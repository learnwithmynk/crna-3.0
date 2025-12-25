/**
 * useAuth Hook
 *
 * Provides authentication state and user session info via Supabase Auth.
 * Falls back to mock user when Supabase is not configured (dev convenience).
 *
 * Enriches the user object with:
 * - role: from user_profiles.role ('user' | 'admin' | 'provider')
 * - entitlements: array of active entitlement slugs from user_entitlements
 */

import { useState, useEffect, useCallback, useMemo, createContext, useContext, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Mock user for development when Supabase is not configured
const MOCK_USER = {
  id: 'mock-user-123',
  email: 'sarah.johnson@example.com',
  user_metadata: {
    full_name: 'Sarah Johnson',
    avatar_url: null,
  },
  role: 'admin', // Set admin role for tests
  app_metadata: {
    role: 'admin', // Also set in app_metadata for compatibility
  },
  entitlements: ['active_membership'],
};

// Auth context for provider pattern
const AuthContext = createContext(null);

/**
 * Enriches user object with role and entitlements from database
 * @param {Object} authUser - User object from Supabase Auth
 * @returns {Object} Enriched user object with role and entitlements
 */
async function enrichUserData(authUser) {
  console.log('[useAuth] enrichUserData called', { userId: authUser?.id });

  if (!authUser || !isSupabaseConfigured()) {
    console.log('[useAuth] enrichUserData skipped - no user or Supabase not configured');
    return authUser;
  }

  try {
    // Fetch user profile to get role - with separate try/catch for resilience
    let profile = null;
    try {
      console.log('[useAuth] Fetching user profile...');
      const { data, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', authUser.id)
        .single();

      console.log('[useAuth] Profile fetch complete', { data, error: profileError?.message });

      if (profileError && profileError.code !== 'PGRST116') {
        console.warn('[useAuth] Error fetching user profile:', profileError.message);
      } else {
        profile = data;
      }
    } catch (profileErr) {
      console.warn('[useAuth] Profile fetch exception:', profileErr.message);
    }

    // Fetch active entitlements using the RPC function - with separate try/catch
    let entitlementSlugs = [];
    try {
      console.log('[useAuth] Fetching entitlements...');
      const { data: entitlementsData, error: entitlementsError } = await supabase.rpc(
        'get_user_entitlements',
        {
          p_user_id: authUser.id,
        }
      );

      console.log('[useAuth] Entitlements fetch complete', { data: entitlementsData, error: entitlementsError?.message });

      if (entitlementsError) {
        console.warn('[useAuth] Error fetching entitlements:', entitlementsError.message);
      } else {
        entitlementSlugs = (entitlementsData || []).map((e) => e.entitlement_slug);
      }
    } catch (entErr) {
      console.warn('[useAuth] Entitlements fetch exception:', entErr.message);
    }

    console.log('[useAuth] enrichUserData complete', { role: profile?.role, entitlements: entitlementSlugs });

    // Return enriched user object
    return {
      ...authUser,
      role: profile?.role || 'user', // Default to 'user' if not found
      entitlements: entitlementSlugs,
    };
  } catch (err) {
    console.error('[useAuth] Error enriching user data:', err);
    // Return user with defaults on error
    return {
      ...authUser,
      role: 'user',
      entitlements: [],
    };
  }
}

/**
 * Internal hook for authentication state - used by AuthProvider
 * @returns {Object} Auth state and methods
 */
function useAuthInternal() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track current user ID to prevent duplicate updates
  const currentUserIdRef = useRef(null);
  const isEnrichingRef = useRef(false);
  const renderCountRef = useRef(0);

  // Track render count for debugging
  renderCountRef.current++;

  // Initialize auth state
  useEffect(() => {
    console.log('[useAuth] useEffect - setting up auth listener');

    // If Supabase not configured, use mock user
    if (!isSupabaseConfigured()) {
      console.log('[useAuth] Supabase not configured, using mock user');
      setUser(MOCK_USER);
      setSession({ user: MOCK_USER });
      currentUserIdRef.current = MOCK_USER.id;
      setIsLoading(false);
      return;
    }

    // Set up auth state change listener FIRST
    // This handles all auth events including initial session
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('[useAuth] onAuthStateChange:', event, { userId: currentSession?.user?.id?.slice(0, 8) });

      const newUserId = currentSession?.user?.id || null;

      // Skip duplicate SIGNED_IN events for the same user
      if (event === 'SIGNED_IN' && newUserId === currentUserIdRef.current) {
        console.log('[useAuth] Skipping duplicate SIGNED_IN');
        return;
      }

      if (currentSession?.user) {
        // Update the tracked user ID
        currentUserIdRef.current = newUserId;

        // Only set basic user if we're not already enriching
        // This prevents flickering during enrichment
        if (!isEnrichingRef.current) {
          console.log('[useAuth] Setting basic user, starting enrichment...');
          // Don't await enrichUserData in the callback - it can cause issues
          // Instead, set basic user first (without role to prevent flash), then enrich
          // The role property is intentionally NOT set here - it will be undefined
          // until enrichment completes, which prevents the UI from flashing
          // from a default role to the real role
          const basicUser = { ...currentSession.user };
          // Explicitly remove role so header knows to wait for enrichment
          delete basicUser.role;
          setUser(basicUser);
          setSession(currentSession);

          // Enrich in background (non-blocking) - this adds the real role
          isEnrichingRef.current = true;
          enrichUserData(currentSession.user).then(enrichedUser => {
            console.log('[useAuth] Enrichment done, setting enriched user');
            setUser(enrichedUser);
            setSession({ ...currentSession, user: enrichedUser });
            isEnrichingRef.current = false;
          }).catch(err => {
            console.error('[useAuth] Error enriching user:', err);
            isEnrichingRef.current = false;
          });
        } else {
          console.log('[useAuth] Already enriching, skipping');
        }
      } else {
        console.log('[useAuth] No user, clearing state');
        currentUserIdRef.current = null;
        setUser(null);
        setSession(null);
      }
      setIsLoading(false);
    });

    return () => {
      console.log('[useAuth] Cleanup - unsubscribing');
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email/password
  const signIn = useCallback(async (email, password) => {
    if (!isSupabaseConfigured()) {
      setUser(MOCK_USER);
      setSession({ user: MOCK_USER });
      return { data: { user: MOCK_USER }, error: null };
    }

    setIsLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return { data: null, error: authError.message };
    }

    // onAuthStateChange will handle setting user/session
    // Just return the data here
    return { data, error: null };
  }, []);

  // Sign up with email/password
  const signUp = useCallback(async (email, password, metadata = {}) => {
    if (!isSupabaseConfigured()) {
      setUser(MOCK_USER);
      setSession({ user: MOCK_USER });
      return { data: { user: MOCK_USER }, error: null };
    }

    setIsLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata, // full_name, etc.
      },
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return { data: null, error: authError.message };
    }

    // Note: User may need to verify email depending on Supabase settings
    // Enrich user data with role and entitlements (if user is confirmed)
    if (data.user) {
      const enrichedUser = await enrichUserData(data.user);
      setUser(enrichedUser);
      setSession(data.session ? { ...data.session, user: enrichedUser } : null);
      setIsLoading(false);
      return { data: { ...data, user: enrichedUser }, error: null };
    } else {
      setUser(null);
      setSession(null);
      setIsLoading(false);
      return { data, error: null };
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setUser(null);
      setSession(null);
      return { error: null };
    }

    setIsLoading(true);

    const { error: authError } = await supabase.auth.signOut();

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return { error: authError.message };
    }

    setUser(null);
    setSession(null);
    setIsLoading(false);
    return { error: null };
  }, []);

  // Reset password
  const resetPassword = useCallback(async (email) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: 'Supabase not configured' };
    }

    const { data, error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (authError) {
      return { data: null, error: authError.message };
    }

    return { data, error: null };
  }, []);

  // Update user profile (metadata + user_profiles table)
  const updateProfile = useCallback(async (profileData) => {
    if (!isSupabaseConfigured()) {
      // For mock user, update the local state directly
      const updatedUser = {
        ...user,
        user_metadata: {
          ...user?.user_metadata,
          ...profileData,
        },
      };
      setUser(updatedUser);
      setSession(prev => prev ? { ...prev, user: updatedUser } : null);
      return { data: updatedUser, error: null };
    }

    // Update auth.users metadata
    const { data, error: authError } = await supabase.auth.updateUser({
      data: profileData,
    });

    if (authError) {
      return { data: null, error: authError.message };
    }

    // Also sync to user_profiles table
    if (data.user) {
      const profileUpdate = {};
      if (profileData.first_name !== undefined) profileUpdate.first_name = profileData.first_name;
      if (profileData.last_name !== undefined) profileUpdate.last_name = profileData.last_name;
      if (profileData.display_name !== undefined) profileUpdate.display_name = profileData.display_name;
      if (profileData.full_name !== undefined) profileUpdate.name = profileData.full_name;
      if (profileData.avatar_url !== undefined) profileUpdate.avatar_url = profileData.avatar_url;

      if (Object.keys(profileUpdate).length > 0) {
        await supabase
          .from('user_profiles')
          .upsert({ id: data.user.id, ...profileUpdate }, { onConflict: 'id' });
      }

      const enrichedUser = await enrichUserData(data.user);
      setUser(enrichedUser);
      setSession(prev => prev ? { ...prev, user: enrichedUser } : null);
      return { data: enrichedUser, error: null };
    }

    return { data: data.user, error: null };
  }, [user]);

  // Computed values
  const isAuthenticated = useMemo(() => !!user, [user]);

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  };
}

/**
 * Auth provider component - wrap your app with this
 */
export function AuthProvider({ children }) {
  const auth = useAuthInternal();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context - must be used within AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Alias for backwards compatibility
export const useAuthContext = useAuth;

export default useAuth;
