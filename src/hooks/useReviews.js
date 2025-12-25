/**
 * useReviews Hook
 *
 * Fetches and manages marketplace reviews (double-blind system).
 * Reviews are only visible after both parties submit OR after 14 days.
 *
 * Integrates with Supabase booking_reviews table when authenticated.
 * Falls back to mock data when unauthenticated.
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  mockApplicantReviews,
  mockProviderReviews,
  getProviderReviews as getMockProviderReviews,
  getReviewsByBooking as getMockReviewsByBooking,
  REVIEW_STATUS
} from '@/data/marketplace/mockReviews';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from './useAuth';

// Review tags that can be applied
export const REVIEW_TAGS = {
  applicant: [
    { value: 'helpful', label: 'Very Helpful' },
    { value: 'knowledgeable', label: 'Knowledgeable' },
    { value: 'encouraging', label: 'Encouraging' },
    { value: 'detailed_feedback', label: 'Detailed Feedback' },
    { value: 'good_questions', label: 'Great Questions' },
    { value: 'would_rebook', label: 'Would Book Again' }
  ],
  provider: [
    { value: 'prepared', label: 'Came Prepared' },
    { value: 'engaged', label: 'Engaged' },
    { value: 'professional', label: 'Professional' },
    { value: 'responsive', label: 'Responsive' },
    { value: 'on_time', label: 'On Time' }
  ]
};

/**
 * Hook for fetching provider reviews (public view)
 */
export function useProviderReviews(providerId, options = {}) {
  const {
    serviceType = null,
    minRating = null,
    sortBy = 'recent', // 'recent', 'rating_high', 'rating_low', 'helpful'
    limit = 10,
    offset = 0
  } = options;

  // Use centralized auth - prevents duplicate auth listeners
  const { user, isLoading: authLoading } = useAuth();
  const hasFetchedRef = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supabaseReviews, setSupabaseReviews] = useState([]);

  // Fetch reviews from Supabase when authenticated
  useEffect(() => {
    async function fetchReviews() {
      if (!providerId) {
        setLoading(false);
        return;
      }

      if (!user || !isSupabaseConfigured()) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch visible reviews for this provider
        // Join with bookings to get service info and provider profile
        const { data, error: fetchError } = await supabase
          .from('booking_reviews')
          .select(`
            id,
            booking_id,
            reviewer_id,
            reviewer_type,
            rating,
            review_text,
            tags,
            would_recommend,
            is_visible,
            created_at,
            bookings!inner (
              id,
              provider_id,
              service_id,
              services (
                type,
                title
              )
            )
          `)
          .eq('is_visible', true)
          .eq('reviewer_type', 'applicant')
          .eq('bookings.provider_id', providerId)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        // Transform to camelCase
        const transformedReviews = (data || []).map(review => ({
          id: review.id,
          bookingId: review.booking_id,
          reviewerId: review.reviewer_id,
          reviewerType: review.reviewer_type,
          rating: review.rating,
          reviewText: review.review_text,
          tags: review.tags || [],
          wouldRecommend: review.would_recommend,
          isVisible: review.is_visible,
          serviceType: review.bookings?.services?.type,
          serviceName: review.bookings?.services?.title,
          createdAt: review.created_at,
        }));

        setSupabaseReviews(transformedReviews);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [providerId, user]);

  // Use Supabase data if authenticated, otherwise mock data
  const sourceReviews = user ? supabaseReviews : getMockProviderReviews(providerId);

  const { reviews, totalCount, averageRating, ratingBreakdown } = useMemo(() => {
    if (!providerId) {
      return { reviews: [], totalCount: 0, averageRating: 0, ratingBreakdown: {} };
    }

    let providerReviews = [...sourceReviews];

    // Filter by service type
    if (serviceType) {
      providerReviews = providerReviews.filter(r => r.serviceType === serviceType);
    }

    // Filter by minimum rating
    if (minRating) {
      providerReviews = providerReviews.filter(r => r.rating >= minRating);
    }

    // Calculate stats before sorting/pagination
    const totalCount = providerReviews.length;
    const averageRating = totalCount > 0
      ? providerReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount
      : 0;

    // Rating breakdown (count per star)
    const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    providerReviews.forEach(r => {
      ratingBreakdown[r.rating] = (ratingBreakdown[r.rating] || 0) + 1;
    });

    // Sort
    switch (sortBy) {
      case 'recent':
        providerReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'rating_high':
        providerReviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating_low':
        providerReviews.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        providerReviews.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
        break;
      default:
        break;
    }

    // Pagination
    const paginatedReviews = providerReviews.slice(offset, offset + limit);

    return {
      reviews: paginatedReviews,
      totalCount,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingBreakdown
    };
  }, [sourceReviews, providerId, serviceType, minRating, sortBy, limit, offset]);

  return {
    reviews,
    totalCount,
    averageRating,
    ratingBreakdown,
    loading: loading || authLoading,
    error,
    hasMore: offset + limit < totalCount,
    isAuthenticated: !!user,
    user,
  };
}

/**
 * Hook for fetching reviews for a specific booking
 */
export function useBookingReviews(bookingId) {
  // Use centralized auth - prevents duplicate auth listeners
  const { user, isLoading: authLoading } = useAuth();

  const [reviews, setReviews] = useState({ applicant: null, provider: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookingReviews() {
      if (!bookingId) {
        setLoading(false);
        return;
      }

      if (!user || !isSupabaseConfigured()) {
        // Use mock data
        const bookingReviews = getMockReviewsByBooking(bookingId);
        setReviews({
          applicant: bookingReviews.applicantReview,
          provider: bookingReviews.providerReview
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch both reviews for this booking
        const { data, error: fetchError } = await supabase
          .from('booking_reviews')
          .select('*')
          .eq('booking_id', bookingId);

        if (fetchError) throw fetchError;

        // Separate by reviewer type
        const applicantReview = data?.find(r => r.reviewer_type === 'applicant');
        const providerReview = data?.find(r => r.reviewer_type === 'provider');

        // Transform to camelCase
        setReviews({
          applicant: applicantReview ? {
            id: applicantReview.id,
            bookingId: applicantReview.booking_id,
            reviewerId: applicantReview.reviewer_id,
            reviewerType: applicantReview.reviewer_type,
            rating: applicantReview.rating,
            reviewText: applicantReview.review_text,
            tags: applicantReview.tags || [],
            wouldRecommend: applicantReview.would_recommend,
            isVisible: applicantReview.is_visible,
            createdAt: applicantReview.created_at,
          } : null,
          provider: providerReview ? {
            id: providerReview.id,
            bookingId: providerReview.booking_id,
            reviewerId: providerReview.reviewer_id,
            reviewerType: providerReview.reviewer_type,
            rating: providerReview.rating,
            reviewText: providerReview.review_text,
            tags: providerReview.tags || [],
            wouldRecommend: providerReview.would_recommend,
            privateNotes: providerReview.private_notes,
            isVisible: providerReview.is_visible,
            createdAt: providerReview.created_at,
          } : null,
        });
      } catch (err) {
        console.error('Error fetching booking reviews:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookingReviews();
  }, [bookingId, user]);

  // Check if current user can see the other party's review
  const canSeeApplicantReview = reviews.applicant?.isVisible || false;
  const canSeeProviderReview = reviews.provider?.isVisible || false;

  return {
    applicantReview: reviews.applicant,
    providerReview: reviews.provider,
    canSeeApplicantReview,
    canSeeProviderReview,
    loading: loading || authLoading,
    isAuthenticated: !!user,
    user,
  };
}

/**
 * Hook for submitting a review
 */
export function useSubmitReview() {
  // Use centralized auth - prevents duplicate auth listeners
  const { user, isLoading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitReview = useCallback(async ({
    bookingId,
    rating,
    reviewText,
    tags,
    wouldRecommend,
    privateNotes, // Provider-only field
    reviewerType // 'applicant' or 'provider'
  }) => {
    setLoading(true);
    setError(null);

    try {
      // Validate
      if (!bookingId) throw new Error('Booking ID required');
      if (!rating || rating < 1 || rating > 5) throw new Error('Rating must be 1-5');
      if (!reviewerType) throw new Error('Reviewer type required');

      if (!user || !isSupabaseConfigured()) {
        // Mock mode - just log
        console.log('Submit review (mock):', {
          bookingId,
          rating,
          reviewText,
          tags,
          wouldRecommend,
          privateNotes,
          reviewerType
        });
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true };
      }

      // Insert review into Supabase
      const { data, error: insertError } = await supabase
        .from('booking_reviews')
        .insert({
          booking_id: bookingId,
          reviewer_id: user.id,
          reviewer_type: reviewerType,
          rating,
          review_text: reviewText,
          tags: tags || [],
          would_recommend: wouldRecommend,
          private_notes: privateNotes,
          // is_visible defaults to false, will be set by trigger when both reviews exist
        })
        .select()
        .single();

      if (insertError) throw insertError;

      console.log('Review submitted:', data);
      return { success: true, reviewId: data.id };
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    submitReview,
    loading: loading || authLoading,
    error,
    isAuthenticated: !!user,
    user,
  };
}

/**
 * Hook for marking a review as helpful
 * Note: This feature would require a separate helpful_votes table in Supabase
 * For now, keeping as placeholder for future implementation
 */
export function useMarkHelpful() {
  const [loading, setLoading] = useState(false);

  const markHelpful = useCallback(async (reviewId) => {
    setLoading(true);

    try {
      // TODO: Implement helpful votes table and API integration
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log('Mark helpful:', reviewId);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { markHelpful, loading };
}

/**
 * Hook for calculating review eligibility (can user leave a review?)
 */
export function useReviewEligibility(bookingId, userId, role = 'applicant') {
  // Use centralized auth - prevents duplicate auth listeners
  const { user, isLoading: authLoading } = useAuth();

  const [canReview, setCanReview] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkEligibility() {
      if (!bookingId || !userId) {
        setLoading(false);
        return;
      }

      if (!user || !isSupabaseConfigured()) {
        // Use mock data
        const bookingReviews = getMockReviewsByBooking(bookingId);
        const existingReview = role === 'applicant'
          ? bookingReviews.applicantReview
          : bookingReviews.providerReview;

        if (existingReview) {
          setCanReview(false);
          setReason('You have already reviewed this session');
        } else {
          setCanReview(true);
          setReason('');
        }
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Check if user has already submitted a review for this booking
        const { data: existingReview, error: fetchError } = await supabase
          .from('booking_reviews')
          .select('id')
          .eq('booking_id', bookingId)
          .eq('reviewer_id', userId)
          .eq('reviewer_type', role)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (existingReview) {
          setCanReview(false);
          setReason('You have already reviewed this session');
        } else {
          // Also check if booking status is 'completed'
          const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select('status')
            .eq('id', bookingId)
            .single();

          if (bookingError) throw bookingError;

          if (booking?.status === 'completed') {
            setCanReview(true);
            setReason('');
          } else {
            setCanReview(false);
            setReason('Session must be completed before leaving a review');
          }
        }
      } catch (err) {
        console.error('Error checking review eligibility:', err);
        setCanReview(false);
        setReason('Unable to verify review eligibility');
      } finally {
        setLoading(false);
      }
    }

    checkEligibility();
  }, [bookingId, userId, role, user]);

  return {
    canReview,
    reason,
    loading: loading || authLoading,
    isAuthenticated: !!user,
    user,
  };
}

export default useProviderReviews;
