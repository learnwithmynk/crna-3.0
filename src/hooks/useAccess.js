/**
 * useAccess Hook
 *
 * Core access control logic reused by all access hooks.
 * Checks if user has required entitlements to access content/features.
 *
 * Supports:
 * - Public content (no auth required)
 * - Entitlement-based access (OR logic - user needs ANY of the required entitlements)
 * - Preview mode for admins (override entitlements for testing)
 * - Different deny behaviors (paywall, upgrade prompt, redirect)
 *
 * Usage:
 *   const { hasAccess, isLoading } = useAccess({
 *     requiredEntitlements: ['active_membership', 'trial_access'],
 *     isPublic: false,
 *     denyBehavior: 'paywall'
 *   });
 */

import { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserEntitlements } from '@/hooks/useUserEntitlements';

// Safe hook that doesn't throw if used outside provider
function useSafePreviewMode() {
  try {
    // Dynamically import to avoid errors if PreviewModeProvider not set up
    const { usePreviewMode } = require('@/hooks/usePreviewMode');
    return usePreviewMode();
  } catch (err) {
    // Preview mode not available, return default values
    return {
      isPreviewMode: false,
      previewEntitlements: [],
    };
  }
}

/**
 * Hook to check if user has access to content/feature
 * @param {Object} options - Access check options
 * @param {string[]} options.requiredEntitlements - Array of entitlement slugs (OR logic)
 * @param {boolean} options.isPublic - If true, everyone has access (no auth required)
 * @param {string} options.denyBehavior - How to handle denied access: 'paywall', 'upgrade', 'redirect', 'hide'
 * @returns {Object} Access status and metadata
 */
export function useAccess({
  requiredEntitlements = [],
  isPublic = false,
  denyBehavior = 'paywall',
} = {}) {
  const { user, isLoading: authLoading } = useAuth();
  const {
    entitlementSlugs,
    hasAnyEntitlement,
    isLoading: entitlementsLoading,
  } = useUserEntitlements();
  const { isPreviewMode, previewEntitlements } = useSafePreviewMode();

  const accessInfo = useMemo(() => {
    // Still loading auth or entitlements
    if (authLoading || entitlementsLoading) {
      return {
        hasAccess: false,
        isLoading: true,
        requiredEntitlements,
        userEntitlements: [],
        matchingEntitlement: null,
        accessReason: null,
        denyBehavior,
      };
    }

    // PUBLIC CONTENT: Everyone has access
    if (isPublic) {
      return {
        hasAccess: true,
        isLoading: false,
        requiredEntitlements,
        userEntitlements: entitlementSlugs,
        matchingEntitlement: null,
        accessReason: 'public',
        denyBehavior,
      };
    }

    // NO ENTITLEMENTS REQUIRED: Authenticated users have access
    if (!requiredEntitlements || requiredEntitlements.length === 0) {
      const hasAccess = !!user;
      return {
        hasAccess,
        isLoading: false,
        requiredEntitlements: [],
        userEntitlements: entitlementSlugs,
        matchingEntitlement: null,
        accessReason: hasAccess ? 'authenticated' : 'none',
        denyBehavior,
      };
    }

    // PREVIEW MODE: Override entitlements with preview entitlements
    if (isPreviewMode && previewEntitlements.length > 0) {
      const matchingEntitlement = requiredEntitlements.find((slug) =>
        previewEntitlements.includes(slug)
      );
      const hasAccess = !!matchingEntitlement;

      return {
        hasAccess,
        isLoading: false,
        requiredEntitlements,
        userEntitlements: previewEntitlements,
        matchingEntitlement,
        accessReason: hasAccess ? 'preview' : 'none',
        denyBehavior,
      };
    }

    // ENTITLEMENT CHECK: User needs ANY of the required entitlements (OR logic)
    const hasAccess = hasAnyEntitlement(requiredEntitlements);

    // Find which entitlement granted access
    const matchingEntitlement = requiredEntitlements.find((slug) =>
      entitlementSlugs.includes(slug)
    );

    return {
      hasAccess,
      isLoading: false,
      requiredEntitlements,
      userEntitlements: entitlementSlugs,
      matchingEntitlement,
      accessReason: hasAccess ? 'entitlement' : 'none',
      denyBehavior,
    };
  }, [
    authLoading,
    entitlementsLoading,
    isPublic,
    requiredEntitlements,
    user,
    entitlementSlugs,
    hasAnyEntitlement,
    isPreviewMode,
    previewEntitlements,
    denyBehavior,
  ]);

  return accessInfo;
}

/**
 * Check access for multiple items at once
 * Useful for rendering lists with lock icons
 * @param {Array} items - Array of items to check
 * @param {Function} getRequiredEntitlements - Function to extract required entitlements from item
 * @param {Object} options - Access options (isPublic, denyBehavior)
 * @returns {Map} Map of item ID to access status
 */
export function useMultipleAccess(items, getRequiredEntitlements, options = {}) {
  const { user, isLoading: authLoading } = useAuth();
  const { entitlementSlugs, isLoading: entitlementsLoading } = useUserEntitlements();
  const { isPreviewMode, previewEntitlements } = useSafePreviewMode();

  const accessMap = useMemo(() => {
    const map = new Map();

    if (!items?.length || authLoading || entitlementsLoading) {
      return map;
    }

    const { isPublic = false } = options;

    items.forEach((item) => {
      const requiredEntitlements = getRequiredEntitlements(item);

      // Public content
      if (isPublic) {
        map.set(item.id, {
          hasAccess: true,
          isLocked: false,
          accessReason: 'public',
        });
        return;
      }

      // No entitlements required
      if (!requiredEntitlements || requiredEntitlements.length === 0) {
        const hasAccess = !!user;
        map.set(item.id, {
          hasAccess,
          isLocked: !hasAccess,
          accessReason: hasAccess ? 'authenticated' : 'none',
        });
        return;
      }

      // Check entitlements (preview mode or real)
      const userEnts = isPreviewMode ? previewEntitlements : entitlementSlugs;
      const hasAccess = requiredEntitlements.some((slug) => userEnts.includes(slug));

      map.set(item.id, {
        hasAccess,
        isLocked: !hasAccess,
        requiredEntitlements,
        accessReason: hasAccess ? (isPreviewMode ? 'preview' : 'entitlement') : 'none',
      });
    });

    return map;
  }, [
    items,
    authLoading,
    entitlementsLoading,
    user,
    entitlementSlugs,
    isPreviewMode,
    previewEntitlements,
    getRequiredEntitlements,
    options,
  ]);

  return accessMap;
}

export default useAccess;
