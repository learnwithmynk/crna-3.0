/**
 * useProviders Hook
 *
 * Fetches and manages marketplace provider (mentor) data.
 * Supports filtering, search, and pagination.
 *
 * Data sources:
 * - Authenticated users: Supabase tables (provider_profiles, services, booking_reviews)
 * - Unauthenticated users: Mock data fallback for testing/demos
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from './useAuth';
import {
  mockProviders,
  getProviderById,
  getTopRatedProviders,
  getAvailableProvidersThisWeek,
  PROVIDER_STATUS
} from '@/data/marketplace/mockProviders';

// Service type options for filtering
export const SERVICE_TYPES = [
  { value: 'mock_interview', label: 'Mock Interview' },
  { value: 'essay_review', label: 'Essay Review' },
  { value: 'resume_review', label: 'Resume Review' },
  { value: 'strategy_session', label: 'Strategy Session' },
  { value: 'school_qa', label: 'School Q&A' }
];

// ICU type options for filtering
export const ICU_TYPES = [
  { value: 'micu', label: 'MICU' },
  { value: 'cvicu', label: 'CVICU' },
  { value: 'sicu', label: 'SICU' },
  { value: 'neuro_icu', label: 'Neuro ICU' },
  { value: 'picu', label: 'PICU' },
  { value: 'nicu', label: 'NICU' },
  { value: 'trauma_icu', label: 'Trauma ICU' }
];

// Price range options
export const PRICE_RANGES = [
  { value: '0-50', label: 'Under $50', min: 0, max: 50 },
  { value: '50-100', label: '$50 - $100', min: 50, max: 100 },
  { value: '100-150', label: '$100 - $150', min: 100, max: 150 },
  { value: '150+', label: '$150+', min: 150, max: Infinity }
];

/**
 * Transform a provider profile from Supabase (snake_case) to app format (camelCase)
 */
function transformProviderFromSupabase(profile) {
  return {
    id: profile.id,
    userId: profile.user_id,

    // Profile
    name: profile.display_name,
    preferredName: profile.display_name?.split(' ')[0] || '',
    tagline: profile.tagline || '',
    avatarUrl: profile.avatar_url,
    bio: profile.bio || '',

    // Personality
    personality: profile.personality || {},

    // Education & Background
    program: profile.program_name || '',
    programId: null, // Would need to be mapped from program_name
    programYear: profile.program_year || 1,
    previousIcuType: null, // Not in provider_profiles, would come from application
    yearsIcuExperience: null, // Not in provider_profiles
    undergraduateSchool: null, // Not in provider_profiles

    // Specializations
    specializations: profile.specialties || [],

    // Provider Settings
    bookingModel: profile.instant_book_enabled ? 'instant' : 'requires_confirmation',
    instantBookEnabled: profile.instant_book_enabled || false,
    cancellationPolicy: 'flexible', // Not stored in DB yet
    timezone: profile.timezone || 'America/New_York',
    videoCallLink: profile.video_call_link || null,

    // Vacation/Pause mode
    isPaused: profile.is_paused || false,
    vacationStart: profile.vacation_start,
    vacationEnd: profile.vacation_end,
    vacationMessage: profile.vacation_message,

    // Cal.com Integration
    calComUserId: profile.cal_com_user_id,
    calComConnectedAt: profile.cal_com_connected_at,

    // Stripe Connect
    stripeConnectAccountId: profile.stripe_account_id,
    stripeOnboardingComplete: profile.stripe_onboarding_complete || false,
    commissionRate: 20.00, // Default 20% (not stored in DB)

    // License verification
    licenseNumber: profile.license_number,
    licenseState: profile.license_state,
    licenseVerified: !!profile.license_number,

    // Status
    status: profile.status || 'pending',
    approvedAt: profile.approved_at,

    // Availability
    availabilityStatus: profile.availability_status || 'available',
    availableThisWeek: profile.availability_status === 'available',

    // Stats
    totalBookings: profile.total_bookings || 0,
    rating: profile.average_rating ? parseFloat(profile.average_rating) : 5.0,
    reviewCount: 0, // Would need to be counted from reviews
    responseTimeMinutes: profile.response_time_hours ? Math.round(profile.response_time_hours * 60) : 60,

    // Timestamps
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,

    // Services (will be populated if joined)
    services: [],
  };
}

/**
 * Main hook for fetching providers list with filters
 */
export function useProviders(options = {}) {
  const {
    search = '',
    serviceType = null,
    icuType = null,
    minRating = null,
    priceRange = null,
    availableNow = false,
    sortBy = 'rating', // 'rating', 'reviews', 'price_low', 'price_high', 'response_time'
    limit = 20
  } = options;

  // Use centralized auth - prevents duplicate auth listeners
  const { user, isLoading: authLoading } = useAuth();
  const hasFetchedRef = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supabaseProviders, setSupabaseProviders] = useState([]);

  // Fetch providers from Supabase when authenticated
  useEffect(() => {
    async function fetchProviders() {
      if (!user || !isSupabaseConfigured()) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch approved providers
        const { data: profiles, error: fetchError } = await supabase
          .from('provider_profiles')
          .select('*')
          .eq('status', 'approved')
          .order('average_rating', { ascending: false, nullsLast: true });

        if (fetchError) throw fetchError;

        // Transform to app format
        const transformed = (profiles || []).map(transformProviderFromSupabase);
        setSupabaseProviders(transformed);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching providers:', err);
        setError(err.message);
        setLoading(false);
      }
    }

    if (user) {
      fetchProviders();
    }
  }, [user]);

  // Filter and sort providers
  const filteredProviders = useMemo(() => {
    // Use Supabase data when authenticated, mock data otherwise
    let providers = user ? supabaseProviders : mockProviders.filter(p => p.status === PROVIDER_STATUS.APPROVED);

    // Search filter (name, program, bio)
    if (search) {
      const searchLower = search.toLowerCase();
      providers = providers.filter(p =>
        p.name?.toLowerCase().includes(searchLower) ||
        p.program?.toLowerCase().includes(searchLower) ||
        p.bio?.toLowerCase().includes(searchLower) ||
        p.tagline?.toLowerCase().includes(searchLower)
      );
    }

    // Service type filter
    if (serviceType) {
      providers = providers.filter(p =>
        p.specializations?.includes(serviceType) ||
        p.specializations?.some(s => s.includes(serviceType))
      );
    }

    // ICU type filter
    if (icuType) {
      providers = providers.filter(p => p.previousIcuType === icuType);
    }

    // Rating filter
    if (minRating) {
      providers = providers.filter(p => p.rating >= minRating);
    }

    // Available now filter (not paused)
    if (availableNow) {
      providers = providers.filter(p => !p.isPaused && p.availableThisWeek);
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        providers.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        providers.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'response_time':
        providers.sort((a, b) => a.responseTimeMinutes - b.responseTimeMinutes);
        break;
      default:
        providers.sort((a, b) => b.rating - a.rating);
    }

    return providers.slice(0, limit);
  }, [user, supabaseProviders, search, serviceType, icuType, minRating, availableNow, sortBy, limit]);

  // Simulate loading for unauthenticated users
  useEffect(() => {
    if (!user) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [user, search, serviceType, icuType, minRating, availableNow, sortBy]);

  return {
    providers: filteredProviders,
    loading: loading || authLoading,
    error,
    totalCount: filteredProviders.length,
    isAuthenticated: !!user,
    user,
  };
}

/**
 * Hook for fetching a single provider by ID
 */
export function useProvider(providerId) {
  // Use centralized auth - prevents duplicate auth listeners
  const { user, isLoading: authLoading } = useAuth();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProvider() {
      if (!providerId) {
        setLoading(false);
        return;
      }

      if (user && isSupabaseConfigured()) {
        // Fetch from Supabase
        try {
          setLoading(true);
          setError(null);

          const { data: profile, error: fetchError } = await supabase
            .from('provider_profiles')
            .select('*')
            .eq('id', providerId)
            .eq('status', 'approved')
            .single();

          if (fetchError) {
            if (fetchError.code === 'PGRST116') {
              // Not found
              setProvider(null);
              setError('Provider not found');
            } else {
              throw fetchError;
            }
          } else {
            setProvider(transformProviderFromSupabase(profile));
          }
          setLoading(false);
        } catch (err) {
          console.error('Error fetching provider:', err);
          setError(err.message);
          setLoading(false);
        }
      } else {
        // Use mock data
        setLoading(true);
        setTimeout(() => {
          const found = getProviderById(providerId);
          if (found) {
            setProvider(found);
            setError(null);
          } else {
            setProvider(null);
            setError('Provider not found');
          }
          setLoading(false);
        }, 200);
      }
    }

    if (!authLoading) {
      fetchProvider();
    }
  }, [providerId, user, authLoading]);

  return {
    provider,
    loading: loading || authLoading,
    error,
    isAuthenticated: !!user,
    user,
  };
}

/**
 * Hook for featured/top-rated providers (homepage widget)
 */
export function useFeaturedProviders(limit = 4) {
  // Use centralized auth - prevents duplicate auth listeners
  const { user, isLoading: authLoading } = useAuth();

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      if (user && isSupabaseConfigured()) {
        // Fetch from Supabase
        try {
          setLoading(true);

          const { data: profiles, error: fetchError } = await supabase
            .from('provider_profiles')
            .select('*')
            .eq('status', 'approved')
            .order('average_rating', { ascending: false, nullsLast: true })
            .limit(limit);

          if (fetchError) throw fetchError;

          const transformed = (profiles || []).map(transformProviderFromSupabase);
          setProviders(transformed);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching featured providers:', err);
          setLoading(false);
        }
      } else {
        // Use mock data
        setLoading(true);
        setTimeout(() => {
          setProviders(getTopRatedProviders(limit));
          setLoading(false);
        }, 200);
      }
    }

    if (!authLoading) {
      fetchFeatured();
    }
  }, [limit, user, authLoading]);

  return {
    providers,
    loading: loading || authLoading,
    isAuthenticated: !!user,
    user,
  };
}

/**
 * Hook for providers available this week
 */
export function useAvailableProviders() {
  // Use centralized auth - prevents duplicate auth listeners
  const { user, isLoading: authLoading } = useAuth();

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAvailable() {
      if (user && isSupabaseConfigured()) {
        // Fetch from Supabase
        try {
          setLoading(true);

          const { data: profiles, error: fetchError } = await supabase
            .from('provider_profiles')
            .select('*')
            .eq('status', 'approved')
            .eq('is_paused', false)
            .eq('availability_status', 'available')
            .order('average_rating', { ascending: false, nullsLast: true });

          if (fetchError) throw fetchError;

          const transformed = (profiles || []).map(transformProviderFromSupabase);
          setProviders(transformed);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching available providers:', err);
          setLoading(false);
        }
      } else {
        // Use mock data
        setLoading(true);
        setTimeout(() => {
          setProviders(getAvailableProvidersThisWeek());
          setLoading(false);
        }, 200);
      }
    }

    if (!authLoading) {
      fetchAvailable();
    }
  }, [user, authLoading]);

  return {
    providers,
    loading: loading || authLoading,
    isAuthenticated: !!user,
    user,
  };
}

/**
 * Hook for saving/unsaving providers (favorites)
 */
export function useSavedProviders(userId = 'default') {
  // Use centralized auth - prevents duplicate auth listeners
  const { user, isLoading: authLoading } = useAuth();

  const [savedIds, setSavedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch saved providers from Supabase when authenticated
  useEffect(() => {
    async function fetchSavedProviders() {
      if (user && isSupabaseConfigured()) {
        try {
          setLoading(true);

          const { data: saved, error: fetchError } = await supabase
            .from('saved_providers')
            .select('provider_id')
            .eq('user_id', user.id);

          if (fetchError) throw fetchError;

          setSavedIds((saved || []).map(s => s.provider_id));
          setLoading(false);
        } catch (err) {
          console.error('Error fetching saved providers:', err);
          setLoading(false);
        }
      } else {
        // Load from localStorage for unauthenticated users
        const saved = localStorage.getItem(`savedProviders_${userId}`);
        setSavedIds(saved ? JSON.parse(saved) : []);
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchSavedProviders();
    }
  }, [user, userId, authLoading]);

  // Return as a Set for O(1) lookup
  const savedProviders = useMemo(() => new Set(savedIds), [savedIds]);

  const saveProvider = useCallback(async (providerId) => {
    if (user && isSupabaseConfigured()) {
      // Save to Supabase
      try {
        const { error: insertError } = await supabase
          .from('saved_providers')
          .upsert({
            user_id: user.id,
            provider_id: providerId,
          }, { onConflict: 'user_id,provider_id' });

        if (insertError) throw insertError;

        setSavedIds(prev => [...prev, providerId]);
      } catch (err) {
        console.error('Error saving provider:', err);
      }
    } else {
      // Save to localStorage
      setSavedIds(prev => {
        const newIds = [...prev, providerId];
        localStorage.setItem(`savedProviders_${userId}`, JSON.stringify(newIds));
        return newIds;
      });
    }
  }, [user, userId]);

  const unsaveProvider = useCallback(async (providerId) => {
    if (user && isSupabaseConfigured()) {
      // Remove from Supabase
      try {
        const { error: deleteError } = await supabase
          .from('saved_providers')
          .delete()
          .eq('user_id', user.id)
          .eq('provider_id', providerId);

        if (deleteError) throw deleteError;

        setSavedIds(prev => prev.filter(id => id !== providerId));
      } catch (err) {
        console.error('Error unsaving provider:', err);
      }
    } else {
      // Remove from localStorage
      setSavedIds(prev => {
        const newIds = prev.filter(id => id !== providerId);
        localStorage.setItem(`savedProviders_${userId}`, JSON.stringify(newIds));
        return newIds;
      });
    }
  }, [user, userId]);

  const isSaved = useCallback((providerId) => {
    return savedIds.includes(providerId);
  }, [savedIds]);

  const toggleSave = useCallback((providerId) => {
    if (savedIds.includes(providerId)) {
      unsaveProvider(providerId);
    } else {
      saveProvider(providerId);
    }
  }, [savedIds, saveProvider, unsaveProvider]);

  // Get full provider objects for saved providers
  const savedProvidersList = useMemo(() => {
    return savedIds.map(id => getProviderById(id)).filter(Boolean);
  }, [savedIds]);

  return {
    savedIds,
    savedProviders,
    savedProvidersList,
    saveProvider,
    unsaveProvider,
    isSaved,
    toggleSave,
    loading: loading || authLoading,
    isAuthenticated: !!user,
    user,
  };
}

// Alias for useProvider
export const useProviderById = useProvider;

export default useProviders;
