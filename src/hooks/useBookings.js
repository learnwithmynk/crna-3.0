/**
 * useBookings Hook
 *
 * Fetches and manages marketplace bookings.
 * Supports both applicant and provider views.
 *
 * When authenticated: Fetches from Supabase tables (bookings, messages)
 * When NOT authenticated: Uses mock data as fallback
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from './useAuth';
import {
  mockBookings,
  getBookingById,
  getApplicantBookings,
  getProviderBookings,
  getUpcomingBookings,
  getPastBookings,
  getPendingRequests,
  getBookingsNeedingReview,
  BOOKING_STATUS
} from '@/data/marketplace/mockBookings';

// Re-export status for convenience
export { BOOKING_STATUS };

// Timeout for provider response (48 hours in ms)
const PROVIDER_RESPONSE_TIMEOUT = 48 * 60 * 60 * 1000;

/**
 * Transform booking from Supabase snake_case to app camelCase
 */
function transformBookingFromSupabase(booking) {
  if (!booking) return null;

  return {
    id: booking.id,
    applicantId: booking.applicant_id,
    providerId: booking.provider_id,
    serviceId: booking.service_id,

    // Service snapshot (stored in booking)
    serviceSnapshot: booking.service_snapshot || null,
    providerSnapshot: booking.provider_snapshot || null,

    // Scheduling
    scheduledAt: booking.scheduled_at,
    timezone: booking.timezone,
    duration: booking.duration,

    // Cal.com Integration
    calComBookingId: booking.cal_com_booking_id || null,
    meetingUrl: booking.cal_com_meeting_url || booking.meeting_url || null,

    // Payment
    price: booking.amount_cents ? booking.amount_cents / 100 : 0,
    platformFee: booking.platform_fee_cents ? booking.platform_fee_cents / 100 : 0,
    providerPayout: booking.provider_payout_cents ? booking.provider_payout_cents / 100 : 0,
    stripePaymentIntentId: booking.stripe_payment_intent_id,
    paymentStatus: booking.payment_status,

    // Service-specific intake data
    intakeData: booking.intake_data || null,

    // Session notes (Editor.js format)
    sessionNotes: booking.session_notes || null,

    // Booking context
    applicantNotes: booking.applicant_notes,
    providerNotes: booking.provider_notes,
    bookingModel: booking.booking_model || 'instant',

    // Status
    status: booking.status,
    createdAt: booking.created_at,
    updatedAt: booking.updated_at,
    acceptedAt: booking.accepted_at,
    declinedAt: booking.declined_at,
    cancelledAt: booking.cancelled_at,
    completedAt: booking.completed_at,
    expiresAt: booking.expires_at,

    // Attachments
    attachments: booking.attachments || [],

    // Reminders
    reminderSentAt: booking.reminder_sent_at,
  };
}

/**
 * Main hook for fetching bookings with filters
 */
export function useBookings(options = {}) {
  const {
    userId,
    role = 'applicant', // 'applicant' or 'provider'
    status = null, // Filter by specific status
    serviceType = null,
    includeCompleted = true,
    includeCancelled = false
  } = options;

  // Use centralized auth - prevents duplicate auth listeners
  const { user, isLoading: authLoading } = useAuth();
  const hasFetchedRef = useRef(false);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bookings from Supabase when authenticated
  useEffect(() => {
    async function fetchBookings() {
      if (!userId) {
        setBookings([]);
        setLoading(false);
        return;
      }

      // Use mock data if not authenticated or Supabase not configured
      if (!user || !isSupabaseConfigured()) {
        setLoading(true);
        const timer = setTimeout(() => {
          let result = role === 'applicant'
            ? getApplicantBookings(userId)
            : getProviderBookings(userId);

          // Apply filters
          result = applyFilters(result, { status, serviceType, includeCompleted, includeCancelled });
          setBookings(result);
          setLoading(false);
        }, 200);
        return () => clearTimeout(timer);
      }

      // Fetch from Supabase
      try {
        setLoading(true);

        // Build query based on role
        let query = supabase
          .from('bookings')
          .select(`
            *,
            service:services(*),
            provider:provider_profiles(*),
            applicant:users!bookings_applicant_id_fkey(*)
          `);

        // Filter by user role
        if (role === 'applicant') {
          query = query.eq('applicant_id', user.id);
        } else if (role === 'provider') {
          // Join through provider_profiles to get bookings for this provider
          const { data: providerProfile } = await supabase
            .from('provider_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single();

          if (providerProfile) {
            query = query.eq('provider_id', providerProfile.id);
          } else {
            // No provider profile, return empty
            setBookings([]);
            setLoading(false);
            return;
          }
        }

        // Apply status filter
        if (status) {
          query = query.eq('status', status);
        }

        // Order by scheduled date (upcoming first), then created date
        query = query.order('scheduled_at', { ascending: true, nullsFirst: false })
                     .order('created_at', { ascending: false });

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        // Transform and filter results
        let transformed = (data || []).map(transformBookingFromSupabase);

        // Apply additional filters
        transformed = applyFilters(transformed, { status, serviceType, includeCompleted, includeCancelled });

        setBookings(transformed);
        setError(null);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.message);
        // Fallback to mock data on error
        let result = role === 'applicant'
          ? getApplicantBookings(userId)
          : getProviderBookings(userId);
        result = applyFilters(result, { status, serviceType, includeCompleted, includeCancelled });
        setBookings(result);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [user, userId, role, status, serviceType, includeCompleted, includeCancelled]);

  return {
    bookings,
    loading: loading || authLoading,
    error,
    isAuthenticated: !!user,
    user,
  };
}

/**
 * Apply client-side filters to bookings
 */
function applyFilters(bookings, { status, serviceType, includeCompleted, includeCancelled }) {
  let result = [...bookings];

  // Status filter (if not already applied server-side)
  if (!status) {
    // Default exclusions
    if (!includeCompleted) {
      result = result.filter(b => b.status !== BOOKING_STATUS.COMPLETED);
    }
    if (!includeCancelled) {
      result = result.filter(b =>
        b.status !== BOOKING_STATUS.CANCELLED &&
        b.status !== BOOKING_STATUS.DECLINED
      );
    }
  }

  // Service type filter
  if (serviceType) {
    result = result.filter(b => b.serviceSnapshot?.type === serviceType);
  }

  // Sort by scheduled date (upcoming first), then created date
  result.sort((a, b) => {
    if (a.scheduledAt && b.scheduledAt) {
      return new Date(a.scheduledAt) - new Date(b.scheduledAt);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return result;
}

/**
 * Hook for fetching a single booking by ID
 */
export function useBooking(bookingId) {
  // Use centralized auth - prevents duplicate auth listeners
  const { user, isLoading: authLoading } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch booking
  useEffect(() => {
    async function fetchBooking() {
      if (!bookingId) {
        setLoading(false);
        return;
      }

      // Use mock data if not authenticated or Supabase not configured
      if (!user || !isSupabaseConfigured()) {
        setLoading(true);
        const timer = setTimeout(() => {
          const found = getBookingById(bookingId);
          if (found) {
            setBooking(found);
            setError(null);
          } else {
            setBooking(null);
            setError('Booking not found');
          }
          setLoading(false);
        }, 200);
        return () => clearTimeout(timer);
      }

      // Fetch from Supabase
      try {
        setLoading(true);

        const { data, error: fetchError } = await supabase
          .from('bookings')
          .select(`
            *,
            service:services(*),
            provider:provider_profiles(*),
            applicant:users!bookings_applicant_id_fkey(*)
          `)
          .eq('id', bookingId)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setError('Booking not found');
            setBooking(null);
          } else {
            throw fetchError;
          }
        } else {
          setBooking(transformBookingFromSupabase(data));
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError(err.message);
        // Fallback to mock data
        const found = getBookingById(bookingId);
        if (found) {
          setBooking(found);
          setError(null);
        } else {
          setBooking(null);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchBooking();
  }, [user, bookingId]);

  // Calculate time remaining for provider response
  const timeRemaining = useMemo(() => {
    if (!booking || booking.status !== BOOKING_STATUS.PENDING_PROVIDER) {
      return null;
    }

    const expiresAt = booking.expiresAt
      ? new Date(booking.expiresAt)
      : new Date(new Date(booking.createdAt).getTime() + PROVIDER_RESPONSE_TIMEOUT);

    const now = new Date();
    const remaining = expiresAt - now;

    if (remaining <= 0) return { expired: true, hours: 0, minutes: 0 };

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    return { expired: false, hours, minutes, expiresAt };
  }, [booking]);

  return {
    booking,
    loading: loading || authLoading,
    error,
    timeRemaining,
    isAuthenticated: !!user,
    user,
  };
}

/**
 * Hook for upcoming bookings (confirmed, future date)
 */
export function useUpcomingBookings(userId, role = 'applicant') {
  const { bookings: allBookings, loading, isAuthenticated, user } = useBookings({
    userId,
    role,
    status: BOOKING_STATUS.CONFIRMED,
    includeCompleted: false,
    includeCancelled: false,
  });

  // Filter for future bookings only
  const bookings = useMemo(() => {
    const now = new Date();
    return allBookings.filter(b => b.scheduledAt && new Date(b.scheduledAt) > now);
  }, [allBookings]);

  // Get the next upcoming booking
  const nextBooking = bookings[0] || null;

  // Check if any booking is within 24 hours
  const hasSoonBooking = useMemo(() => {
    const soon = new Date();
    soon.setHours(soon.getHours() + 24);
    return bookings.some(b => new Date(b.scheduledAt) <= soon);
  }, [bookings]);

  return {
    bookings,
    nextBooking,
    hasSoonBooking,
    loading,
    isAuthenticated,
    user,
  };
}

/**
 * Hook for past/completed bookings
 */
export function usePastBookings(userId, role = 'applicant') {
  const { bookings: allBookings, loading, isAuthenticated, user } = useBookings({
    userId,
    role,
    status: BOOKING_STATUS.COMPLETED,
    includeCompleted: true,
    includeCancelled: false,
  });

  // Filter for past bookings (completed or past scheduled date)
  const bookings = useMemo(() => {
    const now = new Date();
    return allBookings.filter(b => {
      if (b.status === BOOKING_STATUS.COMPLETED) return true;
      if (b.scheduledAt && new Date(b.scheduledAt) < now) return true;
      return false;
    });
  }, [allBookings]);

  return {
    bookings,
    loading,
    isAuthenticated,
    user,
  };
}

/**
 * Hook for pending provider requests (provider-side)
 */
export function usePendingRequests(providerId) {
  const { bookings: requests, loading, isAuthenticated, user } = useBookings({
    userId: providerId,
    role: 'provider',
    status: BOOKING_STATUS.PENDING_PROVIDER,
    includeCompleted: false,
    includeCancelled: false,
  });

  // Count requests expiring soon (< 12 hours)
  const urgentCount = useMemo(() => {
    const soon = new Date();
    soon.setHours(soon.getHours() + 12);

    return requests.filter(r => {
      const expires = r.expiresAt
        ? new Date(r.expiresAt)
        : new Date(new Date(r.createdAt).getTime() + PROVIDER_RESPONSE_TIMEOUT);
      return expires <= soon;
    }).length;
  }, [requests]);

  return {
    requests,
    urgentCount,
    loading,
    isAuthenticated,
    user,
  };
}

/**
 * Hook for bookings needing review
 */
export function useBookingsNeedingReview(userId, role = 'applicant') {
  const { bookings: allBookings, loading, isAuthenticated, user } = useBookings({
    userId,
    role,
    status: BOOKING_STATUS.COMPLETED,
    includeCompleted: true,
    includeCancelled: false,
  });

  // Filter for bookings that need reviews (completed but not reviewed)
  // TODO: Check if user has submitted a review for this booking
  const bookings = useMemo(() => {
    return allBookings.filter(b => {
      // For now, just return completed bookings
      // In real implementation, check if review exists for this user
      return b.status === BOOKING_STATUS.COMPLETED;
    });
  }, [allBookings]);

  return {
    bookings,
    count: bookings.length,
    loading,
    isAuthenticated,
    user,
  };
}

/**
 * Hook for booking actions (cancel, reschedule, etc.)
 */
export function useBookingActions() {
  // Use centralized auth - prevents duplicate auth listeners
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cancelBooking = useCallback(async (bookingId, reason) => {
    setLoading(true);
    setError(null);

    try {
      if (user && isSupabaseConfigured()) {
        // Update booking status in Supabase
        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            status: BOOKING_STATUS.CANCELLED,
            cancelled_at: new Date().toISOString(),
            cancelled_by: user.id,
            applicant_notes: reason,
          })
          .eq('id', bookingId);

        if (updateError) throw updateError;
      } else {
        // Mock fallback
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const rescheduleBooking = useCallback(async (bookingId, newTime) => {
    setLoading(true);
    setError(null);

    try {
      if (user && isSupabaseConfigured()) {
        // Update scheduled time in Supabase
        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            scheduled_at: newTime,
            updated_at: new Date().toISOString(),
          })
          .eq('id', bookingId);

        if (updateError) throw updateError;
      } else {
        // Mock fallback
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const acceptBooking = useCallback(async (bookingId, selectedTime) => {
    setLoading(true);
    setError(null);

    try {
      if (user && isSupabaseConfigured()) {
        // Update booking to confirmed status
        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            status: BOOKING_STATUS.CONFIRMED,
            accepted_at: new Date().toISOString(),
            scheduled_at: selectedTime || undefined,
          })
          .eq('id', bookingId)
          .eq('status', BOOKING_STATUS.PENDING_PROVIDER);

        if (updateError) throw updateError;
      } else {
        // Mock fallback
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const declineBooking = useCallback(async (bookingId, reason) => {
    setLoading(true);
    setError(null);

    try {
      if (user && isSupabaseConfigured()) {
        // Update booking to declined status
        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            status: BOOKING_STATUS.DECLINED,
            declined_at: new Date().toISOString(),
            provider_notes: reason,
          })
          .eq('id', bookingId)
          .eq('status', BOOKING_STATUS.PENDING_PROVIDER);

        if (updateError) throw updateError;
      } else {
        // Mock fallback
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const completeBooking = useCallback(async (bookingId) => {
    setLoading(true);
    setError(null);

    try {
      if (user && isSupabaseConfigured()) {
        // Mark booking as completed
        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            status: BOOKING_STATUS.COMPLETED,
            completed_at: new Date().toISOString(),
          })
          .eq('id', bookingId)
          .eq('status', BOOKING_STATUS.CONFIRMED);

        if (updateError) throw updateError;
      } else {
        // Mock fallback
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    cancelBooking,
    rescheduleBooking,
    acceptBooking,
    declineBooking,
    completeBooking,
    loading,
    error,
    isAuthenticated: !!user,
    user,
  };
}

/**
 * Hook for session notes (Editor.js content)
 */
export function useSessionNotes(bookingId) {
  // Use centralized auth - prevents duplicate auth listeners
  const { user, isLoading: authLoading } = useAuth();

  const [notes, setNotes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch session notes
  useEffect(() => {
    async function fetchNotes() {
      if (!bookingId) {
        setLoading(false);
        return;
      }

      // Use mock data if not authenticated or Supabase not configured
      if (!user || !isSupabaseConfigured()) {
        setLoading(true);
        const timer = setTimeout(() => {
          const booking = getBookingById(bookingId);
          setNotes(booking?.sessionNotes || null);
          setLoading(false);
        }, 200);
        return () => clearTimeout(timer);
      }

      // Fetch from Supabase
      try {
        setLoading(true);

        const { data, error: fetchError } = await supabase
          .from('bookings')
          .select('session_notes')
          .eq('id', bookingId)
          .single();

        if (fetchError) throw fetchError;

        setNotes(data?.session_notes || null);
      } catch (err) {
        console.error('Error fetching session notes:', err);
        // Fallback to mock data
        const booking = getBookingById(bookingId);
        setNotes(booking?.sessionNotes || null);
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, [user, bookingId]);

  const saveNotes = useCallback(async (newNotes) => {
    setSaving(true);

    try {
      if (user && isSupabaseConfigured()) {
        // Save to Supabase
        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            session_notes: newNotes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', bookingId);

        if (updateError) throw updateError;
      } else {
        // Mock fallback
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      setNotes(newNotes);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }, [user, bookingId]);

  return {
    notes,
    loading: loading || authLoading,
    saving,
    saveNotes,
    isAuthenticated: !!user,
    user,
  };
}

export default useBookings;
