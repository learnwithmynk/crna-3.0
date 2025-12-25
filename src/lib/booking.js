/**
 * Booking Orchestration Logic
 *
 * Handles the payment-first booking flow for the mentor marketplace.
 * Coordinates between Stripe (payments), Cal.com (scheduling), and Supabase (data).
 *
 * Key principle: Cal.com booking is ONLY created AFTER Stripe payment succeeds.
 * This prevents ghost bookings and ensures we never have to chase refunds.
 *
 * Flow:
 * 1. Applicant picks time slot (Cal.com availability check)
 * 2. Applicant enters payment (Stripe PaymentIntent created)
 * 3. Payment succeeds → Create Cal.com booking → Create Supabase record
 * 4. Payment fails → Show error, no booking created
 *
 * @see ~/.claude/plans/parsed-kindling-honey.md for full integration plan
 * @see /docs/project/marketplace/booking-process-flow.md for state machine
 */

import { createCalComBooking, cancelCalComBooking, CalComError } from './calcom';

// =============================================================================
// BOOKING STATUSES
// =============================================================================

/**
 * Booking status enum - dual state machines based on provider's booking model
 *
 * Instant Book flow:
 *   pending_payment → confirmed → completed
 *                  ↘ cancelled
 *
 * Requires Confirmation flow:
 *   pending_payment → pending_provider → confirmed → completed
 *                  ↘ declined          ↘ cancelled
 */
export const BOOKING_STATUSES = {
  // Payment phase
  PENDING_PAYMENT: 'pending_payment',

  // Provider approval phase (Requires Confirmation only)
  PENDING_PROVIDER: 'pending_provider',
  DECLINED: 'declined',

  // Active booking
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',

  // Session complete
  COMPLETED: 'completed',

  // Disputes
  DISPUTED: 'disputed',
  REFUNDED: 'refunded',
};

export const BOOKING_STATUS_VALUES = Object.values(BOOKING_STATUSES);

/**
 * Human-readable labels for booking statuses
 */
export const BOOKING_STATUS_LABELS = {
  [BOOKING_STATUSES.PENDING_PAYMENT]: 'Awaiting Payment',
  [BOOKING_STATUSES.PENDING_PROVIDER]: 'Awaiting Confirmation',
  [BOOKING_STATUSES.DECLINED]: 'Declined',
  [BOOKING_STATUSES.CONFIRMED]: 'Confirmed',
  [BOOKING_STATUSES.CANCELLED]: 'Cancelled',
  [BOOKING_STATUSES.COMPLETED]: 'Completed',
  [BOOKING_STATUSES.DISPUTED]: 'Under Review',
  [BOOKING_STATUSES.REFUNDED]: 'Refunded',
};

/**
 * CSS color classes for booking statuses
 */
export const BOOKING_STATUS_COLORS = {
  [BOOKING_STATUSES.PENDING_PAYMENT]: 'yellow',
  [BOOKING_STATUSES.PENDING_PROVIDER]: 'blue',
  [BOOKING_STATUSES.DECLINED]: 'red',
  [BOOKING_STATUSES.CONFIRMED]: 'green',
  [BOOKING_STATUSES.CANCELLED]: 'gray',
  [BOOKING_STATUSES.COMPLETED]: 'purple',
  [BOOKING_STATUSES.DISPUTED]: 'orange',
  [BOOKING_STATUSES.REFUNDED]: 'gray',
};

// =============================================================================
// BOOKING MODELS
// =============================================================================

/**
 * Provider booking model types
 */
export const BOOKING_MODELS = {
  INSTANT: 'instant', // Applicants book directly
  REQUIRES_CONFIRMATION: 'requires_confirmation', // Provider approves each booking
};

// =============================================================================
// CANCELLATION POLICIES
// =============================================================================

/**
 * Cancellation policy tiers (Airbnb model)
 * Provider chooses one during onboarding
 */
export const CANCELLATION_POLICIES = {
  FLEXIBLE: 'flexible',
  MODERATE: 'moderate',
  STRICT: 'strict',
};

/**
 * Cancellation policy details
 */
export const CANCELLATION_POLICY_DETAILS = {
  [CANCELLATION_POLICIES.FLEXIBLE]: {
    name: 'Flexible',
    description: 'Full refund if cancelled 24+ hours before. 50% refund if cancelled within 24 hours.',
    freeCancelHours: 24,
    partialRefundPercent: 50,
  },
  [CANCELLATION_POLICIES.MODERATE]: {
    name: 'Moderate',
    description: 'Full refund if cancelled 3+ days before. 50% refund if cancelled within 3 days.',
    freeCancelHours: 72, // 3 days
    partialRefundPercent: 50,
  },
  [CANCELLATION_POLICIES.STRICT]: {
    name: 'Strict',
    description: 'Full refund if cancelled 7+ days before. No refund within 7 days.',
    freeCancelHours: 168, // 7 days
    partialRefundPercent: 0,
  },
};

// =============================================================================
// BOOKING ORCHESTRATION
// =============================================================================

/**
 * Calculate refund amount based on cancellation policy and timing.
 *
 * @param {Object} booking - Booking object
 * @param {Date} booking.scheduledAt - Scheduled session time
 * @param {number} booking.price - Total price paid
 * @param {string} cancellationPolicy - Provider's cancellation policy
 * @param {Date} cancelTime - When cancellation is requested (default: now)
 * @returns {{ refundAmount: number, refundPercent: number, reason: string }}
 */
export function calculateRefundAmount(booking, cancellationPolicy, cancelTime = new Date()) {
  const policy = CANCELLATION_POLICY_DETAILS[cancellationPolicy];
  if (!policy) {
    throw new Error(`Invalid cancellation policy: ${cancellationPolicy}`);
  }

  const scheduledTime = new Date(booking.scheduledAt);
  const hoursUntilSession = (scheduledTime - cancelTime) / (1000 * 60 * 60);

  // Full refund if cancelled within free cancellation window
  if (hoursUntilSession >= policy.freeCancelHours) {
    return {
      refundAmount: booking.price,
      refundPercent: 100,
      reason: `Cancelled ${Math.floor(hoursUntilSession / 24)} days before session`,
    };
  }

  // Partial or no refund based on policy
  const refundPercent = policy.partialRefundPercent;
  const refundAmount = Math.round((booking.price * refundPercent) / 100);

  return {
    refundAmount,
    refundPercent,
    reason:
      refundPercent > 0
        ? `Cancelled within ${policy.freeCancelHours / 24} days - ${refundPercent}% refund per policy`
        : `Cancelled within ${policy.freeCancelHours / 24} days - no refund per policy`,
  };
}

/**
 * Validate that a booking can be created.
 * Checks required fields and business rules.
 *
 * @param {Object} bookingData - Booking data to validate
 * @returns {{ valid: boolean, errors: Object }}
 */
export function validateBookingData(bookingData) {
  const errors = {};

  // Required fields
  if (!bookingData.providerId) {
    errors.providerId = 'Provider is required';
  }

  if (!bookingData.applicantId) {
    errors.applicantId = 'Applicant is required';
  }

  if (!bookingData.serviceType) {
    errors.serviceType = 'Service type is required';
  }

  if (!bookingData.scheduledAt) {
    errors.scheduledAt = 'Scheduled time is required';
  } else {
    const scheduledTime = new Date(bookingData.scheduledAt);
    if (isNaN(scheduledTime.getTime())) {
      errors.scheduledAt = 'Invalid scheduled time';
    } else if (scheduledTime < new Date()) {
      errors.scheduledAt = 'Cannot book in the past';
    }
  }

  if (!bookingData.price || bookingData.price <= 0) {
    errors.price = 'Valid price is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Create a booking after payment succeeds.
 * This is the main orchestration function - coordinates Cal.com and Supabase.
 *
 * IMPORTANT: This should only be called from a backend function (Supabase Edge Function)
 * after Stripe payment is confirmed.
 *
 * @param {Object} params - Booking parameters
 * @param {Object} params.bookingData - Booking details
 * @param {Object} params.paymentIntent - Stripe PaymentIntent (must be succeeded)
 * @param {Object} params.provider - Provider details including Cal.com tokens
 * @param {Object} params.applicant - Applicant details
 * @param {Object} supabase - Supabase client
 * @returns {Promise<Object>} Created booking
 *
 * @throws {Error} If payment not confirmed or Cal.com booking fails
 */
export async function confirmBookingAfterPayment({
  bookingData,
  paymentIntent,
  provider,
  applicant,
  supabase,
}) {
  // 1. Verify payment succeeded
  if (paymentIntent.status !== 'succeeded') {
    throw new Error(`Payment not confirmed. Status: ${paymentIntent.status}`);
  }

  // 2. Validate booking data
  const validation = validateBookingData(bookingData);
  if (!validation.valid) {
    throw new Error(`Invalid booking data: ${JSON.stringify(validation.errors)}`);
  }

  // 3. Determine initial status based on booking model
  const initialStatus =
    provider.bookingModel === BOOKING_MODELS.INSTANT
      ? BOOKING_STATUSES.CONFIRMED
      : BOOKING_STATUSES.PENDING_PROVIDER;

  // 4. Create Supabase booking record
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      applicant_id: bookingData.applicantId,
      provider_id: bookingData.providerId,
      service_type: bookingData.serviceType,
      scheduled_at: bookingData.scheduledAt,
      price: bookingData.price,
      platform_fee: bookingData.platformFee,
      provider_payout: bookingData.providerPayout,
      stripe_payment_intent_id: paymentIntent.id,
      status: initialStatus,
      context: bookingData.context || null,
      timezone: bookingData.timezone || 'America/New_York',
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (bookingError) {
    // Payment succeeded but DB insert failed - critical error
    // Log this for manual recovery
    console.error('CRITICAL: Payment succeeded but booking insert failed', {
      paymentIntentId: paymentIntent.id,
      error: bookingError,
    });
    throw new Error('Failed to create booking record. Please contact support.');
  }

  // 5. Create Cal.com booking (this triggers confirmation emails)
  // Only for Instant Book - Requires Confirmation waits for provider approval
  if (initialStatus === BOOKING_STATUSES.CONFIRMED) {
    try {
      const calBooking = await createCalComBooking(
        {
          eventTypeId: bookingData.calComEventTypeId,
          startTime: bookingData.scheduledAt,
          attendee: {
            name: applicant.name,
            email: applicant.email,
            timezone: bookingData.timezone,
          },
          metadata: {
            supabaseBookingId: booking.id,
            platformBookingId: booking.id, // Redundant but clear
          },
        },
        provider.calComAccessToken
      );

      // 6. Link Cal.com booking to Supabase record
      await supabase.from('booking_cal_com_mapping').insert({
        booking_id: booking.id,
        cal_com_booking_id: calBooking.id,
        cal_com_event_type_id: bookingData.calComEventTypeId,
        meeting_url: calBooking.meetingUrl || null,
        status: 'confirmed',
      });

      // Update booking with meeting URL if available
      if (calBooking.meetingUrl) {
        await supabase.from('bookings').update({ meeting_url: calBooking.meetingUrl }).eq('id', booking.id);
      }
    } catch (calError) {
      // Cal.com booking failed after payment - handle gracefully
      if (calError instanceof CalComError && calError.code === 'SLOT_TAKEN') {
        // Slot was taken (race condition) - need to refund
        console.error('SLOT_TAKEN: Slot booked by another user during checkout', {
          bookingId: booking.id,
          paymentIntentId: paymentIntent.id,
        });

        // Mark booking for refund
        await supabase
          .from('bookings')
          .update({
            status: BOOKING_STATUSES.REFUNDED,
            cancelled_reason: 'slot_taken_race_condition',
          })
          .eq('id', booking.id);

        throw new CalComError(
          'This time slot was just booked by someone else. Your payment will be refunded automatically. Please select another time.',
          'SLOT_TAKEN',
          409
        );
      }

      // Other Cal.com errors - refund and retry
      console.error('Cal.com booking failed', {
        bookingId: booking.id,
        error: calError.message,
      });

      await supabase
        .from('bookings')
        .update({
          status: BOOKING_STATUSES.REFUNDED,
          cancelled_reason: 'calcom_booking_failed',
        })
        .eq('id', booking.id);

      throw new Error(
        'We encountered a technical issue creating your booking. Your payment will be refunded. Please try again.'
      );
    }
  }

  return booking;
}

/**
 * Cancel a booking and process refund.
 *
 * @param {Object} params - Cancellation parameters
 * @param {string} params.bookingId - Booking ID
 * @param {string} params.cancelledBy - 'applicant' | 'provider' | 'admin'
 * @param {string} params.reason - Cancellation reason
 * @param {Object} supabase - Supabase client
 * @returns {Promise<Object>} Updated booking with refund info
 */
export async function cancelBooking({ bookingId, cancelledBy, reason, supabase }) {
  // 1. Get booking with provider info
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select(
      `
      *,
      provider:providers(
        cancellation_policy,
        cal_com_access_token
      ),
      cal_com_mapping:booking_cal_com_mapping(
        cal_com_booking_id
      )
    `
    )
    .eq('id', bookingId)
    .single();

  if (fetchError || !booking) {
    throw new Error('Booking not found');
  }

  // 2. Check if booking can be cancelled
  if ([BOOKING_STATUSES.COMPLETED, BOOKING_STATUSES.CANCELLED, BOOKING_STATUSES.REFUNDED].includes(booking.status)) {
    throw new Error(`Cannot cancel booking with status: ${booking.status}`);
  }

  // 3. Calculate refund amount
  let refundInfo;
  if (cancelledBy === 'provider') {
    // Provider cancellation = full refund always
    refundInfo = {
      refundAmount: booking.price,
      refundPercent: 100,
      reason: 'Cancelled by provider - full refund',
    };
  } else {
    // Applicant/admin cancellation follows policy
    refundInfo = calculateRefundAmount(booking, booking.provider?.cancellation_policy || 'flexible');
  }

  // 4. Cancel Cal.com booking if exists
  const calComBookingId = booking.cal_com_mapping?.[0]?.cal_com_booking_id;
  if (calComBookingId && booking.provider?.cal_com_access_token) {
    try {
      await cancelCalComBooking(calComBookingId, reason, booking.provider.cal_com_access_token);
    } catch (calError) {
      console.error('Failed to cancel Cal.com booking', { calComBookingId, error: calError.message });
      // Continue - we still want to cancel in our system
    }
  }

  // 5. Update booking status
  const { data: updatedBooking, error: updateError } = await supabase
    .from('bookings')
    .update({
      status: BOOKING_STATUSES.CANCELLED,
      cancelled_at: new Date().toISOString(),
      cancelled_by: cancelledBy,
      cancelled_reason: reason,
      refund_amount: refundInfo.refundAmount,
      refund_percent: refundInfo.refundPercent,
    })
    .eq('id', bookingId)
    .select()
    .single();

  if (updateError) {
    throw new Error('Failed to update booking status');
  }

  // 6. Update Cal.com mapping status
  if (calComBookingId) {
    await supabase
      .from('booking_cal_com_mapping')
      .update({ status: 'cancelled' })
      .eq('booking_id', bookingId);
  }

  return {
    booking: updatedBooking,
    refund: refundInfo,
  };
}

/**
 * Mark a booking as completed after session ends.
 * Triggers review request and starts payout timer.
 *
 * @param {string} bookingId - Booking ID
 * @param {Object} supabase - Supabase client
 * @returns {Promise<Object>} Updated booking
 */
export async function completeBooking(bookingId, supabase) {
  const { data: booking, error } = await supabase
    .from('bookings')
    .update({
      status: BOOKING_STATUSES.COMPLETED,
      completed_at: new Date().toISOString(),
    })
    .eq('id', bookingId)
    .eq('status', BOOKING_STATUSES.CONFIRMED) // Only complete confirmed bookings
    .select()
    .single();

  if (error) {
    throw new Error('Failed to mark booking as completed');
  }

  // Note: Review requests and payout scheduling handled by webhooks/triggers
  return booking;
}

/**
 * Provider accepts a pending booking (Requires Confirmation model).
 *
 * @param {string} bookingId - Booking ID
 * @param {Object} supabase - Supabase client
 * @returns {Promise<Object>} Updated booking
 */
export async function acceptBooking(bookingId, supabase) {
  // Get booking with provider info
  const { data: existingBooking } = await supabase
    .from('bookings')
    .select('*, provider:providers(cal_com_access_token), applicant:users!bookings_applicant_id_fkey(name, email)')
    .eq('id', bookingId)
    .single();

  if (!existingBooking) {
    throw new Error('Booking not found');
  }

  if (existingBooking.status !== BOOKING_STATUSES.PENDING_PROVIDER) {
    throw new Error(`Cannot accept booking with status: ${existingBooking.status}`);
  }

  // Create Cal.com booking now that provider has accepted
  try {
    const calBooking = await createCalComBooking(
      {
        eventTypeId: existingBooking.cal_com_event_type_id,
        startTime: existingBooking.scheduled_at,
        attendee: {
          name: existingBooking.applicant?.name,
          email: existingBooking.applicant?.email,
          timezone: existingBooking.timezone,
        },
        metadata: { supabaseBookingId: bookingId },
      },
      existingBooking.provider?.cal_com_access_token
    );

    // Update booking status and add Cal.com mapping
    const { data: booking, error } = await supabase
      .from('bookings')
      .update({
        status: BOOKING_STATUSES.CONFIRMED,
        confirmed_at: new Date().toISOString(),
        meeting_url: calBooking.meetingUrl,
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;

    // Create Cal.com mapping
    await supabase.from('booking_cal_com_mapping').insert({
      booking_id: bookingId,
      cal_com_booking_id: calBooking.id,
      meeting_url: calBooking.meetingUrl,
      status: 'confirmed',
    });

    return booking;
  } catch (calError) {
    if (calError instanceof CalComError && calError.code === 'SLOT_TAKEN') {
      throw new Error('This time slot is no longer available. The booking will be cancelled and refunded.');
    }
    throw calError;
  }
}

/**
 * Provider declines a pending booking (Requires Confirmation model).
 *
 * @param {string} bookingId - Booking ID
 * @param {string} reason - Decline reason
 * @param {Object} supabase - Supabase client
 * @returns {Promise<Object>} Updated booking
 */
export async function declineBooking(bookingId, reason, supabase) {
  const { data: booking, error } = await supabase
    .from('bookings')
    .update({
      status: BOOKING_STATUSES.DECLINED,
      declined_at: new Date().toISOString(),
      declined_reason: reason,
      // Full refund when provider declines
      refund_amount: null, // Will be set based on price
      refund_percent: 100,
    })
    .eq('id', bookingId)
    .eq('status', BOOKING_STATUSES.PENDING_PROVIDER)
    .select()
    .single();

  if (error) {
    throw new Error('Failed to decline booking');
  }

  // Note: Refund processing handled by webhook/trigger
  return booking;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if a booking can be cancelled by the given user.
 *
 * @param {Object} booking - Booking object
 * @param {string} userId - User attempting to cancel
 * @param {string} userRole - 'applicant' | 'provider' | 'admin'
 * @returns {{ canCancel: boolean, reason?: string }}
 */
export function canCancelBooking(booking, userId, userRole) {
  // Admins can always cancel
  if (userRole === 'admin') {
    return { canCancel: true };
  }

  // Can't cancel completed, already cancelled, or refunded bookings
  if ([BOOKING_STATUSES.COMPLETED, BOOKING_STATUSES.CANCELLED, BOOKING_STATUSES.REFUNDED].includes(booking.status)) {
    return { canCancel: false, reason: 'Booking cannot be cancelled' };
  }

  // Check ownership
  if (userRole === 'applicant' && booking.applicant_id !== userId) {
    return { canCancel: false, reason: 'Not your booking' };
  }

  if (userRole === 'provider' && booking.provider_id !== userId) {
    return { canCancel: false, reason: 'Not your booking' };
  }

  return { canCancel: true };
}

/**
 * Get the next valid status transitions for a booking.
 *
 * @param {string} currentStatus - Current booking status
 * @param {string} bookingModel - 'instant' | 'requires_confirmation'
 * @returns {Array<string>} Valid next statuses
 */
export function getValidStatusTransitions(currentStatus, bookingModel = BOOKING_MODELS.INSTANT) {
  const transitions = {
    [BOOKING_STATUSES.PENDING_PAYMENT]: [BOOKING_STATUSES.CONFIRMED, BOOKING_STATUSES.PENDING_PROVIDER],
    [BOOKING_STATUSES.PENDING_PROVIDER]: [
      BOOKING_STATUSES.CONFIRMED,
      BOOKING_STATUSES.DECLINED,
      BOOKING_STATUSES.CANCELLED,
    ],
    [BOOKING_STATUSES.CONFIRMED]: [BOOKING_STATUSES.COMPLETED, BOOKING_STATUSES.CANCELLED, BOOKING_STATUSES.DISPUTED],
    [BOOKING_STATUSES.COMPLETED]: [BOOKING_STATUSES.DISPUTED],
    [BOOKING_STATUSES.DISPUTED]: [BOOKING_STATUSES.REFUNDED, BOOKING_STATUSES.COMPLETED],
    [BOOKING_STATUSES.DECLINED]: [],
    [BOOKING_STATUSES.CANCELLED]: [],
    [BOOKING_STATUSES.REFUNDED]: [],
  };

  return transitions[currentStatus] || [];
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Statuses
  BOOKING_STATUSES,
  BOOKING_STATUS_VALUES,
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_COLORS,
  BOOKING_MODELS,

  // Cancellation
  CANCELLATION_POLICIES,
  CANCELLATION_POLICY_DETAILS,
  calculateRefundAmount,

  // Booking operations
  validateBookingData,
  confirmBookingAfterPayment,
  cancelBooking,
  completeBooking,
  acceptBooking,
  declineBooking,

  // Helpers
  canCancelBooking,
  getValidStatusTransitions,
};
