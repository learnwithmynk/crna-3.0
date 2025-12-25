-- ============================================
-- CRNA Club User Badges Schema
-- Phase 7 - Badge Achievement System
-- Created: December 14, 2024
-- ============================================
--
-- Tables:
--   1. badges         - Defines all available badges
--   2. user_badges    - Tracks which badges users have earned
--
-- Features:
--   - Pre-defined achievement badges
--   - Progress tracking toward badge goals
--   - Earned timestamp and display logic
--   - Admin-manageable badge definitions
-- ============================================

-- Drop existing view if it exists (to avoid type mismatch errors)
DROP VIEW IF EXISTS user_badge_progress CASCADE;

-- Drop existing tables if they have wrong schema (will be recreated)
-- Only drop if badge_id is not UUID type
DO $$
BEGIN
  -- Check if user_badges exists with wrong badge_id type
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_badges'
    AND column_name = 'badge_id'
    AND data_type != 'uuid'
  ) THEN
    DROP TABLE IF EXISTS user_badges CASCADE;
  END IF;
END $$;

-- ============================================
-- 1. BADGES TABLE
-- Defines all available badges and requirements
-- ============================================
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,

  -- Requirement tracking
  requirement_type TEXT NOT NULL CHECK (requirement_type IN (
    'clinical_entries',     -- Log X clinical entries
    'eq_reflections',       -- Log X EQ reflections
    'shadow_days',          -- Log X shadow days
    'target_programs',      -- Convert X saved -> target programs
    'lessons_completed',    -- Complete X lessons
    'milestones_completed', -- Complete X milestones
    'forum_posts',          -- Create X forum posts/replies
    'feedback_submitted',   -- Submit feedback form X times
    'events_attended'       -- Attend X events
  )),
  requirement_count INTEGER NOT NULL DEFAULT 1,

  -- Display
  category TEXT NOT NULL DEFAULT 'achievement',
  icon_name TEXT,  -- Lucide icon name
  color TEXT DEFAULT 'teal',  -- Theme color for badge

  -- Points awarded when earned
  points_awarded INTEGER NOT NULL DEFAULT 0,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE badges IS 'Defines all achievement badges users can earn';
COMMENT ON COLUMN badges.slug IS 'Unique identifier used in code (e.g., critical_care_crusher)';
COMMENT ON COLUMN badges.requirement_type IS 'What action/count triggers this badge';
COMMENT ON COLUMN badges.requirement_count IS 'How many of requirement_type needed to earn badge';

-- ============================================
-- 2. USER_BADGES TABLE
-- Tracks which badges each user has earned
-- ============================================
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,

  -- When earned
  earned_at TIMESTAMPTZ DEFAULT NOW(),

  -- The count they had when earned (for records)
  count_at_earn INTEGER,

  -- Notification status
  notified BOOLEAN DEFAULT FALSE,

  -- Unique constraint - each user can only earn each badge once
  UNIQUE(user_id, badge_id)
);

COMMENT ON TABLE user_badges IS 'Records which badges each user has earned';

-- ============================================
-- 3. BADGE PROGRESS VIEW
-- Calculates user progress toward each badge
-- ============================================
CREATE OR REPLACE VIEW user_badge_progress AS
SELECT
  u.id AS user_id,
  b.id AS badge_id,
  b.slug,
  b.name,
  b.description,
  b.requirement_type,
  b.requirement_count,
  b.category,
  b.icon_name,
  b.color,
  b.points_awarded,
  ub.earned_at,
  ub.earned_at IS NOT NULL AS is_earned,
  -- Current progress (placeholder - actual counts come from app logic)
  COALESCE(ub.count_at_earn, 0) AS progress_count,
  CASE
    WHEN ub.earned_at IS NOT NULL THEN 100
    ELSE LEAST(100, ROUND((COALESCE(ub.count_at_earn, 0)::DECIMAL / b.requirement_count) * 100))
  END AS progress_percent
FROM auth.users u
CROSS JOIN badges b
LEFT JOIN user_badges ub ON u.id = ub.user_id AND b.id = ub.badge_id
WHERE b.is_active = TRUE;

-- ============================================
-- INDEXES
-- ============================================

-- badges
CREATE INDEX IF NOT EXISTS idx_badges_slug ON badges(slug);
CREATE INDEX IF NOT EXISTS idx_badges_active ON badges(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_badges_type ON badges(requirement_type);
CREATE INDEX IF NOT EXISTS idx_badges_order ON badges(display_order);

-- user_badges
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge ON user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_earned ON user_badges(earned_at);
CREATE INDEX IF NOT EXISTS idx_user_badges_unnotified ON user_badges(notified) WHERE notified = FALSE;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- BADGES: Anyone can read active badges
DROP POLICY IF EXISTS "Anyone can view active badges" ON badges;
CREATE POLICY "Anyone can view active badges" ON badges
  FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Admins can manage badges" ON badges;
CREATE POLICY "Admins can manage badges" ON badges
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- USER_BADGES: Users see their own, admins see all
DROP POLICY IF EXISTS "Users can view own badges" ON user_badges;
CREATE POLICY "Users can view own badges" ON user_badges
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert user badges" ON user_badges;
CREATE POLICY "System can insert user badges" ON user_badges
  FOR INSERT WITH CHECK (true);  -- Handled by functions

DROP POLICY IF EXISTS "System can update user badges" ON user_badges;
CREATE POLICY "System can update user badges" ON user_badges
  FOR UPDATE USING (true);  -- For notified flag

DROP POLICY IF EXISTS "Admins can view all user badges" ON user_badges;
CREATE POLICY "Admins can view all user badges" ON user_badges
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- ============================================
-- TRIGGERS
-- ============================================

DROP TRIGGER IF EXISTS update_badges_updated_at ON badges;
CREATE TRIGGER update_badges_updated_at
  BEFORE UPDATE ON badges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Award a badge to a user
CREATE OR REPLACE FUNCTION award_badge(
  p_user_id UUID,
  p_badge_slug TEXT,
  p_count_at_earn INTEGER DEFAULT NULL
)
RETURNS TABLE(
  success BOOLEAN,
  badge_name TEXT,
  points_awarded INTEGER,
  already_earned BOOLEAN
) AS $$
DECLARE
  v_badge badges%ROWTYPE;
  v_existing user_badges%ROWTYPE;
BEGIN
  -- Get badge info
  SELECT * INTO v_badge FROM badges WHERE slug = p_badge_slug AND is_active = TRUE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::TEXT, 0, FALSE;
    RETURN;
  END IF;

  -- Check if already earned
  SELECT * INTO v_existing FROM user_badges
  WHERE user_id = p_user_id AND badge_id = v_badge.id;

  IF FOUND THEN
    RETURN QUERY SELECT TRUE, v_badge.name, 0, TRUE;
    RETURN;
  END IF;

  -- Award the badge
  INSERT INTO user_badges (user_id, badge_id, count_at_earn)
  VALUES (p_user_id, v_badge.id, p_count_at_earn);

  -- Award points if any
  IF v_badge.points_awarded > 0 THEN
    -- Use existing award_points function if available
    PERFORM award_points(p_user_id, 'badge_earn', v_badge.id::TEXT, 'badge');
  END IF;

  RETURN QUERY SELECT TRUE, v_badge.name, v_badge.points_awarded, FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user qualifies for a badge based on count
CREATE OR REPLACE FUNCTION check_badge_qualification(
  p_user_id UUID,
  p_badge_slug TEXT,
  p_current_count INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  v_badge badges%ROWTYPE;
  v_already_earned BOOLEAN;
BEGIN
  -- Get badge info
  SELECT * INTO v_badge FROM badges WHERE slug = p_badge_slug AND is_active = TRUE;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Check if already earned
  SELECT EXISTS(
    SELECT 1 FROM user_badges
    WHERE user_id = p_user_id AND badge_id = v_badge.id
  ) INTO v_already_earned;

  IF v_already_earned THEN
    RETURN FALSE;
  END IF;

  -- Check if count meets requirement
  RETURN p_current_count >= v_badge.requirement_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user's badge summary
CREATE OR REPLACE FUNCTION get_user_badges_summary(p_user_id UUID)
RETURNS TABLE(
  total_badges INTEGER,
  earned_badges INTEGER,
  total_badge_points INTEGER,
  recent_badge_name TEXT,
  recent_badge_earned_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*)::INTEGER FROM badges WHERE is_active = TRUE),
    (SELECT COUNT(*)::INTEGER FROM user_badges ub
     JOIN badges b ON ub.badge_id = b.id
     WHERE ub.user_id = p_user_id AND b.is_active = TRUE),
    (SELECT COALESCE(SUM(b.points_awarded), 0)::INTEGER FROM user_badges ub
     JOIN badges b ON ub.badge_id = b.id
     WHERE ub.user_id = p_user_id),
    (SELECT b.name FROM user_badges ub
     JOIN badges b ON ub.badge_id = b.id
     WHERE ub.user_id = p_user_id
     ORDER BY ub.earned_at DESC LIMIT 1),
    (SELECT ub.earned_at FROM user_badges ub
     WHERE ub.user_id = p_user_id
     ORDER BY ub.earned_at DESC LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SEED DATA - Default Badges
-- Based on gamification-system.md
-- ============================================

INSERT INTO badges (slug, name, description, requirement_type, requirement_count, category, icon_name, color, points_awarded, display_order) VALUES
  (
    'critical_care_crusher',
    'Critical Care Crusher',
    'Submit at least 20 clinical tracker entries',
    'clinical_entries',
    20,
    'engagement',
    'Heart',
    'teal',
    50,
    1
  ),
  (
    'target_trailblazer',
    'Target Trailblazer',
    'Convert at least 3 programs to your target list',
    'target_programs',
    3,
    'progression',
    'Target',
    'blue',
    30,
    2
  ),
  (
    'lesson_legend',
    'Lesson Legend',
    'Complete at least 20 lessons',
    'lessons_completed',
    20,
    'learning',
    'BookOpen',
    'purple',
    50,
    3
  ),
  (
    'milestone_machine',
    'Milestone Machine',
    'Complete at least 7 application milestones',
    'milestones_completed',
    7,
    'progression',
    'Flag',
    'green',
    40,
    4
  ),
  (
    'top_contributor',
    'Top Contributor',
    'Post or reply in forums at least 10 times',
    'forum_posts',
    10,
    'community',
    'MessageCircle',
    'orange',
    30,
    5
  ),
  (
    'feedback_champion',
    'Feedback Champion',
    'Submit the "Let Us Know" form at least 3 times',
    'feedback_submitted',
    3,
    'community',
    'Send',
    'pink',
    25,
    6
  ),
  (
    'eq_master',
    'EQ Master',
    'Log at least 15 EQ/leadership reflections',
    'eq_reflections',
    15,
    'engagement',
    'Brain',
    'violet',
    40,
    7
  ),
  (
    'shadow_seeker',
    'Shadow Seeker',
    'Log at least 10 shadow day experiences',
    'shadow_days',
    10,
    'engagement',
    'Sun',
    'amber',
    35,
    8
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  requirement_type = EXCLUDED.requirement_type,
  requirement_count = EXCLUDED.requirement_count,
  category = EXCLUDED.category,
  icon_name = EXCLUDED.icon_name,
  color = EXCLUDED.color,
  points_awarded = EXCLUDED.points_awarded,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

-- Add badge_earn action to point_actions if not exists
INSERT INTO point_actions (slug, label, description, base_points, daily_max) VALUES
  ('badge_earn', 'Earn a Badge', 'Bonus points awarded when earning an achievement badge', 0, NULL)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- NOTES FOR DEV TEAM
-- ============================================
--
-- 1. AWARDING A BADGE:
--    SELECT * FROM award_badge(
--      p_user_id := 'user-uuid',
--      p_badge_slug := 'critical_care_crusher',
--      p_count_at_earn := 20
--    );
--
-- 2. CHECKING IF USER QUALIFIES:
--    SELECT check_badge_qualification(
--      'user-uuid',
--      'critical_care_crusher',
--      current_clinical_count
--    );
--
-- 3. GETTING USER'S BADGES:
--    SELECT * FROM user_badges WHERE user_id = 'user-uuid';
--    SELECT * FROM get_user_badges_summary('user-uuid');
--
-- 4. BADGE CHECK FLOW (in app code):
--    a. After relevant action (log clinical, complete lesson, etc.)
--    b. Count user's total for that type
--    c. Call check_badge_qualification()
--    d. If true, call award_badge()
--    e. Show celebration modal to user
--
-- 5. EXISTING TRACKERS SHOULD CHECK:
--    - ClinicalTracker: After submit, check 'critical_care_crusher'
--    - EQTracker: After submit, check 'eq_master'
--    - ShadowDaysTracker: After submit, check 'shadow_seeker'
--    - Program save->target: Check 'target_trailblazer'
--    - Lesson complete: Check 'lesson_legend'
--    - Milestone complete: Check 'milestone_machine'
--    - Forum post/reply: Check 'top_contributor'
--    - Feedback form: Check 'feedback_champion'
--
-- ============================================
