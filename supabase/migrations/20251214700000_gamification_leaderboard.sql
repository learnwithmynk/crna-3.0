-- ============================================
-- CRNA Club Gamification - Leaderboard & Levels
-- Phase 7 - Complete Gamification System
-- Created: December 14, 2024
-- ============================================
--
-- Features:
--   1. Automatic level calculation from points
--   2. Leaderboard views (all-time and monthly)
--   3. Triggers to auto-update levels
--   4. User gamification summary function
-- ============================================

-- ============================================
-- LEVEL THRESHOLDS TABLE
-- Configurable level requirements
-- ============================================
CREATE TABLE IF NOT EXISTS level_thresholds (
  level INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  min_points INTEGER NOT NULL,
  tooltip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE level_thresholds IS 'Defines point thresholds for each level';

-- Seed level thresholds (from gamification-system.md)
INSERT INTO level_thresholds (level, name, min_points, tooltip) VALUES
  (1, 'Aspiring Applicant', 0, 'You''re off to a strong start! Earn 200 points to reach Level 2!'),
  (2, 'Dedicated Dreamer', 200, 'Keep it up! Earn 600 total points to level up to Level 3!'),
  (3, 'Ambitious Achiever', 600, 'You''re making great progress! Earn 1,000 total points to reach Level 4.'),
  (4, 'Committed Candidate', 1000, 'Almost there! Earn 1,600 total points to unlock Level 5.'),
  (5, 'Goal Crusher', 1600, 'You''re nearing the top! Earn 2,000 total points to reach Level 6.'),
  (6, 'Peak Performer', 2000, 'You''re a top achiever! You''ve reached elite status - keep up the solid work.')
ON CONFLICT (level) DO UPDATE SET
  name = EXCLUDED.name,
  min_points = EXCLUDED.min_points,
  tooltip = EXCLUDED.tooltip;

-- Enable RLS
ALTER TABLE level_thresholds ENABLE ROW LEVEL SECURITY;

-- Anyone can read levels
CREATE POLICY "Anyone can view level thresholds" ON level_thresholds
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage level thresholds" ON level_thresholds
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- ============================================
-- LEVEL CALCULATION FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION calculate_level_from_points(p_points INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT level FROM level_thresholds
    WHERE min_points <= p_points
    ORDER BY min_points DESC
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- AUTO-UPDATE LEVEL TRIGGER
-- Updates user level when points change
-- ============================================

CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
DECLARE
  v_new_level INTEGER;
BEGIN
  v_new_level := calculate_level_from_points(NEW.total_points);

  IF v_new_level IS NOT NULL AND v_new_level != NEW.current_level THEN
    NEW.current_level := v_new_level;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger (drop first if exists to avoid duplicates)
DROP TRIGGER IF EXISTS trigger_update_user_level ON user_points;
CREATE TRIGGER trigger_update_user_level
  BEFORE INSERT OR UPDATE OF total_points ON user_points
  FOR EACH ROW EXECUTE FUNCTION update_user_level();

-- ============================================
-- LEADERBOARD VIEWS
-- ============================================

-- All-time leaderboard
CREATE OR REPLACE VIEW leaderboard_all_time AS
SELECT
  up.user_id,
  COALESCE(
    au.raw_user_meta_data->>'display_name',
    au.raw_user_meta_data->>'nickname',
    'Anonymous'
  ) AS display_name,
  up.total_points,
  up.current_level,
  lt.name AS level_name,
  (SELECT COUNT(*) FROM user_badges ub WHERE ub.user_id = up.user_id) AS badge_count,
  ROW_NUMBER() OVER (ORDER BY up.total_points DESC) AS rank
FROM user_points up
JOIN auth.users au ON up.user_id = au.id
LEFT JOIN level_thresholds lt ON up.current_level = lt.level
WHERE up.total_points > 0
ORDER BY up.total_points DESC;

-- Monthly leaderboard (current month)
CREATE OR REPLACE VIEW leaderboard_monthly AS
SELECT
  upl.user_id,
  COALESCE(
    au.raw_user_meta_data->>'display_name',
    au.raw_user_meta_data->>'nickname',
    'Anonymous'
  ) AS display_name,
  SUM(upl.total_points)::INTEGER AS monthly_points,
  up.current_level,
  lt.name AS level_name,
  ROW_NUMBER() OVER (ORDER BY SUM(upl.total_points) DESC) AS rank
FROM user_point_log upl
JOIN auth.users au ON upl.user_id = au.id
LEFT JOIN user_points up ON upl.user_id = up.user_id
LEFT JOIN level_thresholds lt ON up.current_level = lt.level
WHERE upl.awarded_at >= DATE_TRUNC('month', CURRENT_DATE)
  AND upl.awarded_at < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
GROUP BY upl.user_id, au.raw_user_meta_data, up.current_level, lt.name
HAVING SUM(upl.total_points) > 0
ORDER BY monthly_points DESC;

-- ============================================
-- USER GAMIFICATION SUMMARY FUNCTION
-- Returns complete gamification state for a user
-- ============================================

CREATE OR REPLACE FUNCTION get_user_gamification_summary(p_user_id UUID)
RETURNS TABLE(
  -- Points & Level
  total_points INTEGER,
  current_level INTEGER,
  level_name TEXT,
  level_tooltip TEXT,
  points_to_next_level INTEGER,
  next_level_threshold INTEGER,
  progress_to_next_level_percent INTEGER,

  -- Badges
  total_badges_available INTEGER,
  badges_earned INTEGER,

  -- Leaderboard
  all_time_rank BIGINT,
  monthly_rank BIGINT,
  monthly_points INTEGER
) AS $$
DECLARE
  v_user_points user_points%ROWTYPE;
  v_current_level level_thresholds%ROWTYPE;
  v_next_level level_thresholds%ROWTYPE;
BEGIN
  -- Get user points
  SELECT * INTO v_user_points FROM user_points WHERE user_id = p_user_id;

  -- Default if no points record
  IF NOT FOUND THEN
    v_user_points.total_points := 0;
    v_user_points.current_level := 1;
  END IF;

  -- Get level info
  SELECT * INTO v_current_level FROM level_thresholds WHERE level = v_user_points.current_level;
  SELECT * INTO v_next_level FROM level_thresholds WHERE level = v_user_points.current_level + 1;

  RETURN QUERY
  SELECT
    -- Points & Level
    v_user_points.total_points,
    v_user_points.current_level,
    v_current_level.name,
    v_current_level.tooltip,
    CASE
      WHEN v_next_level.min_points IS NOT NULL
      THEN v_next_level.min_points - v_user_points.total_points
      ELSE 0
    END,
    v_next_level.min_points,
    CASE
      WHEN v_next_level.min_points IS NULL THEN 100
      WHEN v_next_level.min_points = v_current_level.min_points THEN 100
      ELSE LEAST(100, ROUND(
        ((v_user_points.total_points - v_current_level.min_points)::DECIMAL /
         (v_next_level.min_points - v_current_level.min_points)) * 100
      ))::INTEGER
    END,

    -- Badges
    (SELECT COUNT(*)::INTEGER FROM badges WHERE is_active = TRUE),
    (SELECT COUNT(*)::INTEGER FROM user_badges ub
     JOIN badges b ON ub.badge_id = b.id
     WHERE ub.user_id = p_user_id AND b.is_active = TRUE),

    -- Leaderboard
    (SELECT lat.rank FROM leaderboard_all_time lat WHERE lat.user_id = p_user_id),
    (SELECT lm.rank FROM leaderboard_monthly lm WHERE lm.user_id = p_user_id),
    (SELECT COALESCE(lm.monthly_points, 0)::INTEGER FROM leaderboard_monthly lm WHERE lm.user_id = p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- BADGE CHECK FUNCTION
-- Called after actions to check for new badges
-- ============================================

CREATE OR REPLACE FUNCTION check_and_award_badges(
  p_user_id UUID,
  p_requirement_type TEXT,
  p_current_count INTEGER
)
RETURNS TABLE(
  badge_awarded BOOLEAN,
  badge_slug TEXT,
  badge_name TEXT,
  points_awarded INTEGER
) AS $$
DECLARE
  v_badge RECORD;
  v_result RECORD;
BEGIN
  -- Find all badges of this type that user hasn't earned
  FOR v_badge IN
    SELECT b.* FROM badges b
    WHERE b.requirement_type = p_requirement_type
      AND b.is_active = TRUE
      AND b.requirement_count <= p_current_count
      AND NOT EXISTS (
        SELECT 1 FROM user_badges ub
        WHERE ub.user_id = p_user_id AND ub.badge_id = b.id
      )
    ORDER BY b.requirement_count ASC
  LOOP
    -- Award the badge
    SELECT * INTO v_result FROM award_badge(p_user_id, v_badge.slug, p_current_count);

    IF v_result.success AND NOT v_result.already_earned THEN
      RETURN QUERY SELECT TRUE, v_badge.slug, v_badge.name, v_badge.points_awarded;
    END IF;
  END LOOP;

  -- Return empty if no badges awarded
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- CONVENIENCE: Get top N for leaderboard display
-- ============================================

CREATE OR REPLACE FUNCTION get_leaderboard(
  p_type TEXT DEFAULT 'all_time',  -- 'all_time' or 'monthly'
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
  user_id UUID,
  display_name TEXT,
  points INTEGER,
  level INTEGER,
  level_name TEXT,
  rank BIGINT
) AS $$
BEGIN
  IF p_type = 'monthly' THEN
    RETURN QUERY
    SELECT
      lm.user_id,
      lm.display_name,
      lm.monthly_points,
      lm.current_level,
      lm.level_name,
      lm.rank
    FROM leaderboard_monthly lm
    LIMIT p_limit;
  ELSE
    RETURN QUERY
    SELECT
      lat.user_id,
      lat.display_name,
      lat.total_points,
      lat.current_level,
      lat.level_name,
      lat.rank
    FROM leaderboard_all_time lat
    LIMIT p_limit;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- NOTES FOR DEV TEAM
-- ============================================
--
-- 1. GET USER'S FULL GAMIFICATION STATE:
--    SELECT * FROM get_user_gamification_summary('user-uuid');
--
-- 2. GET LEADERBOARD:
--    SELECT * FROM get_leaderboard('all_time', 25);
--    SELECT * FROM get_leaderboard('monthly', 10);
--
-- 3. CHECK FOR BADGES AFTER ACTION:
--    -- After logging clinical entry:
--    SELECT * FROM check_and_award_badges(
--      'user-uuid',
--      'clinical_entries',
--      (SELECT COUNT(*) FROM user_clinical_entries WHERE user_id = 'user-uuid')
--    );
--
-- 4. LEVEL AUTO-UPDATES:
--    Levels automatically update when total_points changes
--    No need to manually calculate or set levels
--
-- 5. DISPLAY NAME IN LEADERBOARD:
--    Uses user_meta_data display_name or nickname
--    Falls back to 'Anonymous' if not set
--
-- 6. MONTHLY LEADERBOARD:
--    Resets automatically at start of each month
--    Based on points earned that month (not total)
--
-- ============================================
