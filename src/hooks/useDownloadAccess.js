/**
 * useDownloadAccess Hook
 *
 * Check if the current user can access a download based on entitlements.
 * Downloads can be free (accessible to all) or gated by entitlements.
 */

import { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook to check if user has access to a download
 * @param {Object} download - Download object with is_free and accessible_via
 * @returns {Object} Access status and info
 */
export function useDownloadAccess(download) {
  const { user } = useAuth();

  const accessInfo = useMemo(() => {
    // If no download provided, no access check needed
    if (!download) {
      return {
        hasAccess: false,
        isLoading: true,
        isFree: false,
        requiredEntitlements: [],
        purchaseUrl: null,
      };
    }

    // Free downloads are accessible to everyone
    if (download.is_free) {
      return {
        hasAccess: true,
        isLoading: false,
        isFree: true,
        requiredEntitlements: [],
        purchaseUrl: null,
        accessReason: 'free',
      };
    }

    // Get user's entitlements
    const userEntitlements = user?.entitlements || user?.user_metadata?.entitlements || [];

    // Get required entitlements for this download
    const requiredEntitlements = download.accessible_via || [];

    // If no entitlements required, everyone has access
    if (requiredEntitlements.length === 0) {
      return {
        hasAccess: true,
        isLoading: false,
        isFree: false,
        requiredEntitlements: [],
        purchaseUrl: null,
        accessReason: 'public',
      };
    }

    // Check if user has any of the required entitlements
    const hasAccess = requiredEntitlements.some((entitlement) =>
      userEntitlements.includes(entitlement)
    );

    // Find which entitlement grants access
    const matchingEntitlement = requiredEntitlements.find((entitlement) =>
      userEntitlements.includes(entitlement)
    );

    return {
      hasAccess,
      isLoading: false,
      isFree: false,
      requiredEntitlements,
      userEntitlements,
      matchingEntitlement,
      purchaseUrl: download.purchase_product_url || null,
      accessReason: hasAccess ? 'entitlement' : 'none',
    };
  }, [download, user]);

  return accessInfo;
}

/**
 * Check access for multiple downloads at once
 * Useful for rendering download lists
 * @param {Array} downloads - Array of download objects
 * @returns {Map} Map of download ID to access status
 */
export function useDownloadsAccess(downloads) {
  const { user } = useAuth();

  const accessMap = useMemo(() => {
    const map = new Map();

    if (!downloads?.length) return map;

    const userEntitlements = user?.entitlements || user?.user_metadata?.entitlements || [];

    downloads.forEach((download) => {
      // Free downloads
      if (download.is_free) {
        map.set(download.id, {
          hasAccess: true,
          isFree: true,
          isLocked: false,
          purchaseUrl: null,
        });
        return;
      }

      const requiredEntitlements = download.accessible_via || [];

      // No entitlements = public
      if (requiredEntitlements.length === 0) {
        map.set(download.id, {
          hasAccess: true,
          isFree: false,
          isLocked: false,
          purchaseUrl: null,
        });
        return;
      }

      const hasAccess = requiredEntitlements.some((e) => userEntitlements.includes(e));

      map.set(download.id, {
        hasAccess,
        isFree: false,
        isLocked: !hasAccess,
        requiredEntitlements,
        purchaseUrl: download.purchase_product_url || null,
      });
    });

    return map;
  }, [downloads, user]);

  return accessMap;
}

export default useDownloadAccess;
