/**
 * useResourceAccess Hook
 *
 * Checks if the current user has access to a specific resource.
 * Resources can be pages, features, widgets, downloads, modules, or lessons.
 * Supports preview mode for admins to test different access levels.
 */

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePreviewMode } from '@/hooks/usePreviewMode';

/**
 * Hook for checking access to a specific resource
 * @param {string} slug - Resource slug to check access for
 * @returns {Object} Access state and metadata
 */
export function useResourceAccess(slug) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { isPreviewMode, previewEntitlements } = usePreviewMode();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [denyBehavior, setDenyBehavior] = useState('hide'); // 'hide', 'blur', 'upgrade_prompt'

  useEffect(() => {
    if (authLoading) {
      setIsLoading(true);
      return;
    }

    // If no slug provided, assume no access
    if (!slug) {
      setHasAccess(false);
      setIsLoading(false);
      return;
    }

    // TODO: Implement actual resource access check against database
    // For now, use simple entitlement check
    if (!isAuthenticated) {
      setHasAccess(false);
      setDenyBehavior('upgrade_prompt');
      setIsLoading(false);
      return;
    }

    // Use preview entitlements if in preview mode, otherwise use real user entitlements
    const effectiveEntitlements = isPreviewMode ? previewEntitlements : (user?.entitlements || []);

    // Check if user has any active entitlements
    const hasMembership =
      effectiveEntitlements.includes('active_membership') ||
      effectiveEntitlements.includes('trial_access') ||
      effectiveEntitlements.includes('founding_member');

    setHasAccess(hasMembership);
    setDenyBehavior(hasMembership ? 'hide' : 'upgrade_prompt');
    setIsLoading(false);
  }, [slug, user, isAuthenticated, authLoading, isPreviewMode, previewEntitlements]);

  return {
    hasAccess,
    isLoading,
    denyBehavior,
    slug,
  };
}

/**
 * Hook for checking if user has specific entitlement
 * Supports preview mode for admins to test different access levels.
 * @param {string} entitlementSlug - Entitlement slug to check
 * @returns {Object} Access state
 */
export function useEntitlementAccess(entitlementSlug) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { isPreviewMode, previewEntitlements } = usePreviewMode();

  const hasAccess = useMemo(() => {
    if (!isAuthenticated || !user) return false;
    // Use preview entitlements if in preview mode, otherwise use real user entitlements
    const effectiveEntitlements = isPreviewMode ? previewEntitlements : (user?.entitlements || []);
    return effectiveEntitlements.includes(entitlementSlug);
  }, [user, isAuthenticated, entitlementSlug, isPreviewMode, previewEntitlements]);

  return {
    hasAccess,
    isLoading: authLoading,
  };
}

/**
 * Hook for checking if user has ANY of the specified entitlements
 * Supports preview mode for admins to test different access levels.
 * @param {string[]} entitlementSlugs - Array of entitlement slugs
 * @returns {Object} Access state
 */
export function useAnyEntitlementAccess(entitlementSlugs = []) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { isPreviewMode, previewEntitlements } = usePreviewMode();

  const hasAccess = useMemo(() => {
    if (!isAuthenticated || !user || !entitlementSlugs.length) return false;
    // Use preview entitlements if in preview mode, otherwise use real user entitlements
    const effectiveEntitlements = isPreviewMode ? previewEntitlements : (user?.entitlements || []);
    return entitlementSlugs.some(slug => effectiveEntitlements.includes(slug));
  }, [user, isAuthenticated, entitlementSlugs, isPreviewMode, previewEntitlements]);

  return {
    hasAccess,
    isLoading: authLoading,
  };
}

/**
 * Alias for backwards compatibility
 */
export const useAccess = useResourceAccess;

export default useResourceAccess;
