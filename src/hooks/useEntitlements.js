/**
 * useEntitlements Hook
 *
 * Read operations for entitlements (access control levels).
 * Entitlements determine who can access what content.
 */

import { useState, useEffect, useCallback } from 'react';
import supabase from '@/lib/supabase';

/**
 * Hook for fetching all active entitlements
 */
export function useEntitlements() {
  const [entitlements, setEntitlements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEntitlements = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('entitlements')
        .select('*')
        .eq('is_active', true)
        .order('display_name', { ascending: true });

      if (fetchError) throw fetchError;

      setEntitlements(data || []);
    } catch (err) {
      console.error('Error fetching entitlements:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntitlements();
  }, [fetchEntitlements]);

  /**
   * Get entitlement display name by slug
   */
  const getEntitlementName = useCallback(
    (slug) => {
      const entitlement = entitlements.find((e) => e.slug === slug);
      return entitlement?.display_name || slug;
    },
    [entitlements]
  );

  /**
   * Get multiple entitlement names from slugs array
   */
  const getEntitlementNames = useCallback(
    (slugs) => {
      if (!slugs?.length) return [];
      return slugs.map((slug) => getEntitlementName(slug));
    },
    [getEntitlementName]
  );

  /**
   * Convert slugs array to options for multi-select
   */
  const entitlementOptions = entitlements.map((e) => ({
    value: e.slug,
    label: e.display_name,
  }));

  return {
    entitlements,
    entitlementOptions,
    isLoading,
    error,
    refetch: fetchEntitlements,
    getEntitlementName,
    getEntitlementNames,
  };
}

/**
 * Hook for entitlement admin operations
 */
export function useEntitlementAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Create a new entitlement
   */
  const createEntitlement = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: newEntitlement, error: createError } = await supabase
        .from('entitlements')
        .insert({
          slug: data.slug,
          display_name: data.displayName,
          description: data.description || null,
          is_active: data.isActive !== false,
        })
        .select()
        .single();

      if (createError) throw createError;

      return { data: newEntitlement, error: null };
    } catch (err) {
      console.error('Error creating entitlement:', err);
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update an existing entitlement
   */
  const updateEntitlement = async (id, data) => {
    setIsLoading(true);
    setError(null);

    try {
      const updateData = {};
      if (data.slug !== undefined) updateData.slug = data.slug;
      if (data.displayName !== undefined) updateData.display_name = data.displayName;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.isActive !== undefined) updateData.is_active = data.isActive;

      const { data: updatedEntitlement, error: updateError } = await supabase
        .from('entitlements')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      return { data: updatedEntitlement, error: null };
    } catch (err) {
      console.error('Error updating entitlement:', err);
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete an entitlement
   */
  const deleteEntitlement = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('entitlements')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      return { error: null };
    } catch (err) {
      console.error('Error deleting entitlement:', err);
      setError(err.message);
      return { error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createEntitlement,
    updateEntitlement,
    deleteEntitlement,
    isLoading,
    error,
  };
}

export default useEntitlements;
