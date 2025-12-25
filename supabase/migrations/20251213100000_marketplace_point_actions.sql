-- ============================================
-- Marketplace Point Actions
-- Phase 3.8 - Gamification Integration
-- ============================================

-- Add marketplace-specific point actions
INSERT INTO point_actions (slug, label, description, base_points, daily_max) VALUES
  ('marketplace_book_session', 'Book a Mentoring Session', 'Awarded when booking a marketplace mentoring session', 10, NULL),
  ('marketplace_complete_session', 'Complete a Mentoring Session', 'Awarded when completing a mentoring session', 15, NULL),
  ('marketplace_leave_review', 'Leave a Session Review', 'Awarded for leaving a review after a mentoring session', 5, 3)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- NOTES FOR DEV TEAM
-- ============================================
--
-- These point actions should be triggered in the following scenarios:
--
-- 1. marketplace_book_session:
--    Trigger: When a booking transitions to 'confirmed' status
--    Reference: booking_id
--    Reference Type: 'booking'
--
-- 2. marketplace_complete_session:
--    Trigger: When a booking transitions to 'completed' status
--    Reference: booking_id
--    Reference Type: 'booking'
--
-- 3. marketplace_leave_review:
--    Trigger: When a user submits a review for a completed booking
--    Reference: review_id
--    Reference Type: 'booking_review'
--    Daily Max: 3 (prevents review farming)
--
-- Example usage in code:
--   await supabase.rpc('award_points', {
--     p_user_id: userId,
--     p_action_slug: 'marketplace_book_session',
--     p_reference_id: bookingId,
--     p_reference_type: 'booking'
--   });
