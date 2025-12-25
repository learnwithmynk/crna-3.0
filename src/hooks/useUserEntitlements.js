/**
 * useUserEntitlements Hook
 *
 * Fetches the current user's active entitlements from the user_entitlements table.
 * Uses the get_user_entitlements() RPC function for efficient access checks.
 *
 * Returns helper methods for checking entitlement access.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import supabase from '@/lib/supabase';

/**
 * Hook to fetch and manage user's entitlements
 * @returns {Object} Entitlements data and helper methods
 */
export function useUserEntitlements() {
  const { user, isLoading: authLoading } = useAuth();
  const [entitlements, setEntitlements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's active entitlements
  const fetchEntitlements = useCallback(async () => {
    // If user is not authenticated, return empty array
    if (!user) {
      setEntitlements([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call the RPC function to get user's active entitlements
      const { data, error: fetchError } = await supabase.rpc('get_user_entitlements', {
        p_user_id: user.id,
      });

      if (fetchError) throw fetchError;

      setEntitlements(data || []);
    } catch (err) {
      console.error('[useUserEntitlements] Error fetching entitlements:', err);
      setError(err.message);
      setEntitlements([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch entitlements when user changes
  useEffect(() => {
    fetchEntitlements();
  }, [fetchEntitlements]);

  // Extract just the slugs for easy checking
  const entitlementSlugs = useMemo(() => {
    return entitlements.map((e) => e.entitlement_slug);
  }, [entitlements]);

  /**
   * Check if user has a specific entitlement
   * @param {string} slug - Entitlement slug to check
   * @returns {boolean} True if user has the entitlement
   */
  const hasEntitlement = useCallback(
    (slug) => {
      if (!slug) return false;
      return entitlementSlugs.includes(slug);
    },
    [entitlementSlugs]
  );

  /**
   * Check if user has ANY of the specified entitlements (OR logic)
   * @param {string[]} slugs - Array of entitlement slugs
   * @returns {boolean} True if user has at least one of the entitlements
   */
  const hasAnyEntitlement = useCallback(
    (slugs) => {
      if (!slugs || slugs.length === 0) return false;
      return slugs.some((slug) => entitlementSlugs.includes(slug));
    },
    [entitlementSlugs]
  );

  /**
   * Check if user has ALL of the specified entitlements (AND logic)
   * @param {string[]} slugs - Array of entitlement slugs
   * @returns {boolean} True if user has all of the entitlements
   */
  const hasAllEntitlements = useCallback(
    (slugs) => {
      if (!slugs || slugs.length === 0) return false;
      return slugs.every((slug) => entitlementSlugs.includes(slug));
    },
    [entitlementSlugs]
  );

  /**
   * Get entitlement details by slug
   * @param {string} slug - Entitlement slug
   * @returns {Object|null} Entitlement object or null
   */
  const getEntitlement = useCallback(
    (slug) => {
      return entitlements.find((e) => e.entitlement_slug === slug) || null;
    },
    [entitlements]
  );

  /**
   * Get entitlements that are expiring soon (within 7 days)
   * @returns {Array} Array of expiring entitlements
   */
  const expiringEntitlements = useMemo(() => {
    return entitlements.filter((e) => e.is_expiring_soon);
  }, [entitlements]);

  return {
    // Data
    entitlements,
    entitlementSlugs,
    expiringEntitlements,

    // State
    isLoading: authLoading || isLoading,
    error,

    // Methods
    refetch: fetchEntitlements,
    hasEntitlement,
    hasAnyEntitlement,
    hasAllEntitlements,
    getEntitlement,
  };
}

export default useUserEntitlements;
