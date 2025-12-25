-- =====================================================
-- Marketplace Point Actions Seed Data
-- =====================================================
-- Created: 2025-12-20
-- Purpose: Add marketplace-related point actions for
--          booking, completing, and reviewing sessions
-- =====================================================

-- Note: forums_with_school_info VIEW and get_or_create_school_forum()
-- function already exist in 20251214300000_forum_school_link.sql

-- =====================================================
-- Marketplace Point Actions Seed Data
-- =====================================================
-- Purpose: Pre-populate point actions for marketplace
--          engagement (booking, completing, reviewing sessions)
-- Note: Uses ON CONFLICT to prevent duplicates on re-run
-- =====================================================

INSERT INTO point_actions (slug, label, description, base_points, daily_max) VALUES
  ('marketplace_book_session', 'Book a Mentoring Session', 'Awarded when booking confirmed', 10, NULL),
  ('marketplace_complete_session', 'Complete a Mentoring Session', 'Awarded after session', 15, NULL),
  ('marketplace_leave_review', 'Leave a Session Review', 'Awarded for leaving review', 5, 3)
ON CONFLICT (slug) DO NOTHING;
