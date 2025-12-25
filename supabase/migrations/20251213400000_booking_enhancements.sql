-- ============================================
-- Booking Table Enhancements
-- Phase 4.5 - Missing fields from mock data analysis
-- ============================================
--
-- This migration adds fields identified as gaps between
-- mock data and database schema:
-- - booking_model (instant vs requires_confirmation)
-- - cancellation_reason and cancellation_note
-- - refund_amount_cents for partial refunds
-- - dispute tracking fields
-- - status CHECK constraints

-- ============================================
-- 1. ADD BOOKING MODEL FIELD
-- ============================================
-- Tracks whether booking was instant or required confirmation

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_model TEXT DEFAULT 'requires_confirmation'
  CHECK (booking_model IN ('instant', 'requires_confirmation'));

COMMENT ON COLUMN bookings.booking_model IS 'instant = auto-confirmed, requires_confirmation = provider must accept';

-- ============================================
-- 2. ADD CANCELLATION TRACKING
-- ============================================
-- Enhanced cancellation details for analytics and refund processing

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancellation_note TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS refund_amount_cents INT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS refund_processed_at TIMESTAMPTZ;

COMMENT ON COLUMN bookings.cancellation_reason IS 'Standardized reason: schedule_conflict, emergency, provider_unavailable, applicant_request, etc.';
COMMENT ON COLUMN bookings.cancellation_note IS 'Free-form note explaining cancellation';
COMMENT ON COLUMN bookings.refund_amount_cents IS 'Amount refunded (may differ from original for partial refunds)';
COMMENT ON COLUMN bookings.refund_processed_at IS 'When Stripe refund was processed';

-- ============================================
-- 3. ADD DISPUTE TRACKING
-- ============================================
-- For handling booking disputes

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS disputed_at TIMESTAMPTZ;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS dispute_reason TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS dispute_resolved_at TIMESTAMPTZ;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS dispute_resolution TEXT;

COMMENT ON COLUMN bookings.disputed_at IS 'When dispute was opened';
COMMENT ON COLUMN bookings.dispute_reason IS 'Reason for dispute';
COMMENT ON COLUMN bookings.dispute_resolution IS 'How dispute was resolved: refunded, partial_refund, no_refund, etc.';

-- ============================================
-- 4. ADD DECLINED REASON
-- ============================================
-- When provider declines a booking request

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS declined_reason TEXT;

COMMENT ON COLUMN bookings.declined_reason IS 'Optional reason when provider declines booking';

-- ============================================
-- 5. ADD STATUS CHECK CONSTRAINT
-- ============================================
-- Enforce valid status values

-- First check if the constraint already exists
DO $$
BEGIN
  -- Drop existing constraint if any
  ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
EXCEPTION WHEN undefined_object THEN
  -- Constraint doesn't exist, continue
  NULL;
END $$;

-- Add the constraint with all valid statuses
ALTER TABLE bookings
  ADD CONSTRAINT bookings_status_check
  CHECK (status IN (
    'pending',           -- Waiting for provider to accept
    'accepted',          -- Provider accepted, waiting for session
    'confirmed',         -- Alias for accepted (instant book)
    'declined',          -- Provider declined
    'cancelled',         -- Either party cancelled
    'completed',         -- Session finished
    'disputed',          -- Under dispute review
    'refunded',          -- Fully refunded
    'expired',           -- Provider didn't respond in time
    'no_show'            -- Attendee didn't show up
  ));

-- ============================================
-- 6. ADD PAYMENT STATUS CHECK CONSTRAINT
-- ============================================

DO $$
BEGIN
  ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_payment_status_check;
EXCEPTION WHEN undefined_object THEN
  NULL;
END $$;

ALTER TABLE bookings
  ADD CONSTRAINT bookings_payment_status_check
  CHECK (payment_status IN (
    'pending',           -- Payment not yet initiated
    'authorized',        -- Payment authorized, not captured
    'captured',          -- Payment captured
    'partially_refunded', -- Partial refund issued
    'refunded',          -- Full refund issued
    'failed'             -- Payment failed
  ));

-- ============================================
-- 7. ADD SERVICE TYPE CHECK CONSTRAINT TO services
-- ============================================

DO $$
BEGIN
  ALTER TABLE services DROP CONSTRAINT IF EXISTS services_type_check;
EXCEPTION WHEN undefined_object THEN
  NULL;
END $$;

ALTER TABLE services
  ADD CONSTRAINT services_type_check
  CHECK (type IN (
    'mock_interview',
    'essay_review',
    'resume_review',
    'strategy_session',
    'school_qa',
    'clinical_advice',
    'application_review',
    'general_coaching'
  ));

-- ============================================
-- 8. ADD PROVIDER AVAILABILITY STATUS CHECK
-- ============================================

DO $$
BEGIN
  ALTER TABLE provider_profiles DROP CONSTRAINT IF EXISTS provider_profiles_availability_status_check;
EXCEPTION WHEN undefined_object THEN
  NULL;
END $$;

ALTER TABLE provider_profiles
  ADD CONSTRAINT provider_profiles_availability_status_check
  CHECK (availability_status IN (
    'available',
    'limited',
    'unavailable',
    'vacation'
  ));

-- ============================================
-- 9. ADD INDEXES FOR NEW COLUMNS
-- ============================================

CREATE INDEX IF NOT EXISTS idx_bookings_booking_model ON bookings(booking_model);
CREATE INDEX IF NOT EXISTS idx_bookings_disputed ON bookings(disputed_at) WHERE disputed_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bookings_refunded ON bookings(refund_processed_at) WHERE refund_processed_at IS NOT NULL;

-- ============================================
-- 10. HELPER FUNCTION: PROCESS CANCELLATION
-- ============================================
-- Helper function for cancelling a booking with proper refund tracking

CREATE OR REPLACE FUNCTION cancel_booking(
  p_booking_id UUID,
  p_cancelled_by UUID,
  p_reason TEXT,
  p_note TEXT DEFAULT NULL,
  p_refund_amount_cents INT DEFAULT NULL
)
RETURNS bookings AS $$
DECLARE
  v_booking bookings;
BEGIN
  UPDATE bookings
  SET
    status = 'cancelled',
    cancelled_at = NOW(),
    cancelled_by = p_cancelled_by,
    cancellation_reason = p_reason,
    cancellation_note = p_note,
    refund_amount_cents = COALESCE(p_refund_amount_cents, amount_cents),
    payment_status = CASE
      WHEN p_refund_amount_cents IS NULL OR p_refund_amount_cents = amount_cents THEN 'refunded'
      WHEN p_refund_amount_cents > 0 THEN 'partially_refunded'
      ELSE payment_status
    END,
    updated_at = NOW()
  WHERE id = p_booking_id
  RETURNING * INTO v_booking;

  RETURN v_booking;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cancel_booking IS 'Cancel a booking with proper refund tracking';

-- ============================================
-- 11. HELPER FUNCTION: MARK NO-SHOW
-- ============================================

CREATE OR REPLACE FUNCTION mark_booking_no_show(
  p_booking_id UUID,
  p_marked_by UUID
)
RETURNS bookings AS $$
DECLARE
  v_booking bookings;
BEGIN
  UPDATE bookings
  SET
    status = 'no_show',
    updated_at = NOW()
  WHERE id = p_booking_id
    AND status IN ('accepted', 'confirmed')
    AND scheduled_at < NOW()
  RETURNING * INTO v_booking;

  RETURN v_booking;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mark_booking_no_show IS 'Mark a booking as no-show (only after scheduled time)';

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON CONSTRAINT bookings_status_check ON bookings IS 'Valid booking statuses';
COMMENT ON CONSTRAINT bookings_payment_status_check ON bookings IS 'Valid payment statuses';
COMMENT ON CONSTRAINT services_type_check ON services IS 'Valid service types';
