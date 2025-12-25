/**
 * useAccessControl Hook
 *
 * Manages access control for resources (modules, lessons, downloads, protected_resources).
 * Provides read operations for viewing and managing access rules across all resources.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import supabase from '@/lib/supabase';
import { syncResourceRegistry } from '@/lib/syncResourceRegistry';

/**
 * Hook for fetching and managing access-controlled resources
 */
export function useAccessControl() {
  const [resources, setResources] = useState([]);
  const [protectedResources, setProtectedResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [error, setError] = useState(null);

  const fetchResources = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch modules - don't fail on error (table may not exist or be inaccessible)
      const { data: modules, error: modulesError } = await supabase
        .from('modules')
        .select('id, slug, title, status, accessible_via, category_slugs')
        .order('order_index', { ascending: true });

      if (modulesError) {
        console.warn('Could not fetch modules:', modulesError.message);
      }

      // Fetch lessons - don't fail on error
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('id, slug, title, status, accessible_via, category_slugs, module_id')
        .order('order_index', { ascending: true });

      if (lessonsError) {
        console.warn('Could not fetch lessons:', lessonsError.message);
      }

      // Fetch downloads - don't fail on error
      const { data: downloads, error: downloadsError } = await supabase
        .from('downloads')
        .select('id, slug, title, status, accessible_via, category_slugs, is_free')
        .order('created_at', { ascending: false });

      if (downloadsError) {
        console.warn('Could not fetch downloads:', downloadsError.message);
      }

      // Fetch protected_resources (pages, features, widgets, tools)
      const { data: protectedRes, error: protectedError } = await supabase
        .from('protected_resources')
        .select('*')
        .order('resource_type', { ascending: true });

      // Don't throw on error - table might not exist yet
      if (protectedError) {
        console.warn('Could not fetch protected_resources:', protectedError.message);
      }

      setProtectedResources(protectedRes || []);

      // Combine and format content resources
      const allResources = [
        ...(modules || []).map(m => ({
          ...m,
          type: 'module',
          name: m.title,
          isPublic: !m.accessible_via || m.accessible_via.length === 0,
          hasRules: m.accessible_via && m.accessible_via.length > 0,
        })),
        ...(lessons || []).map(l => ({
          ...l,
          type: 'lesson',
          name: l.title,
          isPublic: !l.accessible_via || l.accessible_via.length === 0,
          hasRules: l.accessible_via && l.accessible_via.length > 0,
        })),
        ...(downloads || []).map(d => ({
          ...d,
          type: 'download',
          name: d.title,
          isPublic: d.is_free || !d.accessible_via || d.accessible_via.length === 0,
          hasRules: !d.is_free && d.accessible_via && d.accessible_via.length > 0,
        })),
      ];

      setResources(allResources);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Sync resource registry to database
   */
  const syncRegistry = useCallback(async ({ dryRun = false } = {}) => {
    setIsSyncing(true);
    setSyncResult(null);

    try {
      const result = await syncResourceRegistry({ dryRun, verbose: true });
      setSyncResult(result);

      if (result.success && !dryRun) {
        // Refresh data after sync
        await fetchResources();
      }

      return result;
    } catch (err) {
      const errorResult = { success: false, errors: [{ message: err.message }] };
      setSyncResult(errorResult);
      return errorResult;
    } finally {
      setIsSyncing(false);
    }
  }, [fetchResources]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  /**
   * Calculate stats for resources
   */
  const stats = useMemo(() => {
    const protectedCount = resources.filter(r => r.hasRules && !r.isPublic).length;
    const publicCount = resources.filter(r => r.isPublic).length;
    const noRules = resources.filter(r => !r.hasRules && !r.isPublic && r.status === 'published').length;
    const premiumOnly = resources.filter(r =>
      r.hasRules && r.accessible_via?.includes('active_membership')
    ).length;

    return {
      total: resources.length,
      protected: protectedCount,
      public: publicCount,
      noRules,
      premiumOnly,
    };
  }, [resources]);

  /**
   * Get warnings for resources that need attention
   */
  const warnings = useMemo(() => {
    const warns = [];

    // Find resources with no access rules (and not explicitly public)
    resources.forEach(resource => {
      if (!resource.hasRules && !resource.isPublic && resource.status === 'published') {
        warns.push({
          id: resource.id,
          type: 'no_rules',
          message: `${resource.type === 'module' ? 'Module' : resource.type === 'lesson' ? 'Lesson' : 'Download'} "${resource.name}" is published but has no access rules`,
          resource,
        });
      }
    });

    return warns;
  }, [resources]);

  /**
   * Update access rules for a single resource
   */
  const updateResourceAccess = useCallback(async (resourceId, resourceType, data) => {
    try {
      const table = resourceType === 'module' ? 'modules' : resourceType === 'lesson' ? 'lessons' : 'downloads';
      const updateData = {};

      if (data.isPublic !== undefined) {
        if (resourceType === 'download') {
          updateData.is_free = data.isPublic;
          if (data.isPublic) {
            updateData.accessible_via = [];
          }
        } else {
          updateData.accessible_via = data.isPublic ? [] : (data.entitlements || []);
        }
      } else if (data.entitlements !== undefined) {
        if (resourceType === 'download') {
          updateData.accessible_via = data.entitlements;
          updateData.is_free = data.entitlements.length === 0;
        } else {
          updateData.accessible_via = data.entitlements;
        }
      }

      const { data: updatedResource, error: updateError } = await supabase
        .from(table)
        .update(updateData)
        .eq('id', resourceId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Refresh resources
      await fetchResources();

      return { data: updatedResource, error: null };
    } catch (err) {
      console.error('Error updating resource access:', err);
      return { data: null, error: err.message };
    }
  }, [fetchResources]);

  /**
   * Bulk update access rules for multiple resources
   */
  const bulkUpdateAccess = useCallback(async (updates) => {
    try {
      const results = await Promise.all(
        updates.map(({ resourceId, resourceType, data }) =>
          updateResourceAccess(resourceId, resourceType, data)
        )
      );

      const errors = results.filter(r => r.error);
      if (errors.length > 0) {
        throw new Error(`${errors.length} updates failed`);
      }

      return { success: true, error: null };
    } catch (err) {
      console.error('Error bulk updating access:', err);
      return { success: false, error: err.message };
    }
  }, [updateResourceAccess]);

  return {
    resources,
    protectedResources,
    stats,
    warnings,
    isLoading,
    isSyncing,
    syncResult,
    error,
    refetch: fetchResources,
    syncRegistry,
    updateResourceAccess,
    bulkUpdateAccess,
  };
}

export default useAccessControl;
