/**
 * useProviderStatus Hook
 *
 * Fetches the current user's provider profile status from provider_profiles table.
 * Returns status flags and helper methods for checking provider approval/suspension.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook for checking current user's provider status
 */
export function useProviderStatus() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch provider profile
  const fetchProviderProfile = useCallback(async () => {
    // If not authenticated or Supabase not configured, return early
    if (!isAuthenticated || !user || !isSupabaseConfigured()) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch provider profile for current user
      const { data, error: fetchError } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      setProfile(data);
      setIsLoading(false);
    } catch (err) {
      console.error('[useProviderStatus] Error fetching provider status:', err);
      setError(err.message);
      setProfile(null);
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    fetchProviderProfile();
  }, [fetchProviderProfile]);

  // Computed status flags
  const status = profile?.status || null;
  const isApproved = status === 'approved';
  const isPending = status === 'pending';
  const isSuspended = status === 'suspended';
  const isProvider = profile !== null;

  // Stripe Connect status
  const hasStripeConnected = useMemo(() => {
    return Boolean(profile?.stripe_account_id && profile?.stripe_onboarding_complete);
  }, [profile]);

  // Cal.com status
  const hasCalComConnected = useMemo(() => {
    return Boolean(profile?.cal_com_user_id && profile?.cal_com_access_token);
  }, [profile]);

  // Availability status
  const isAvailable = useMemo(() => {
    return profile?.availability_status === 'available';
  }, [profile]);

  const isLimited = useMemo(() => {
    return profile?.availability_status === 'limited';
  }, [profile]);

  const isUnavailable = useMemo(() => {
    return profile?.availability_status === 'unavailable';
  }, [profile]);

  return {
    // Profile data
    profile,

    // Status flags
    status,
    isProvider,
    isApproved,
    isPending,
    isSuspended,

    // Integration status
    hasStripeConnected,
    hasCalComConnected,

    // Availability
    isAvailable,
    isLimited,
    isUnavailable,

    // State
    isLoading: authLoading || isLoading,
    error,

    // Methods
    refetch: fetchProviderProfile,

    // Backwards compatibility
    providerProfile: profile,
    hasProviderProfile: isProvider,
    isApprovedProvider: isApproved,
    isPendingProvider: isPending,
    isDeniedProvider: isSuspended, // Map 'denied' to 'suspended' for backwards compat
  };
}

export default useProviderStatus;
