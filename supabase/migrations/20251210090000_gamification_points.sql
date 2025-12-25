-- ============================================
-- CRNA Club Gamification Points Schema
-- Phase 5.5 - Points Configuration System
-- Created: December 10, 2024
-- ============================================
--
-- Tables:
--   1. point_actions   - Defines what actions award points
--   2. point_promos    - Time-based promotional multipliers
--   3. user_points     - User point totals and daily tracking
--   4. user_point_log  - Detailed point award history
--
-- Features:
--   - Configurable base points per action
--   - Daily maximums that scale with promos
--   - Time-based promotional multipliers
--   - One promo at a time (no stacking)
--   - Full admin UI support
-- ============================================

-- ============================================
-- 1. POINT_ACTIONS TABLE
-- Defines all actions that can award points
-- ============================================
CREATE TABLE IF NOT EXISTS point_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  base_points INTEGER NOT NULL DEFAULT 1,
  daily_max INTEGER,  -- NULL means unlimited
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE point_actions IS 'Configurable point values for each gamification action';
COMMENT ON COLUMN point_actions.slug IS 'Unique identifier used in code (e.g., lesson_complete, review_submit)';
COMMENT ON COLUMN point_actions.daily_max IS 'Maximum times this action awards points per day (NULL = unlimited)';

-- ============================================
-- 2. POINT_PROMOS TABLE
-- Time-based promotional multipliers
-- ============================================
CREATE TABLE IF NOT EXISTS point_promos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,

  -- Scope: what does this promo apply to?
  scope_type TEXT NOT NULL CHECK (scope_type IN ('global', 'action')),
  scope_value TEXT,  -- action slug if scope_type = 'action', NULL if global

  -- Multiplier
  multiplier DECIMAL(3,1) NOT NULL DEFAULT 2.0 CHECK (multiplier >= 1.0),

  -- Schedule
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,

  -- User visibility
  banner_text TEXT,  -- Shown on dashboard when promo is active

  -- Status
  is_active BOOLEAN DEFAULT TRUE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure end date is after start date
  CONSTRAINT valid_date_range CHECK (ends_at > starts_at)
);

COMMENT ON TABLE point_promos IS 'Time-based promotional multipliers for points';
COMMENT ON COLUMN point_promos.scope_type IS 'global = all actions, action = specific action only';
COMMENT ON COLUMN point_promos.scope_value IS 'Action slug when scope_type is action, NULL for global';
COMMENT ON COLUMN point_promos.banner_text IS 'Text displayed to users when promo is active';

-- ============================================
-- 3. USER_POINTS TABLE
-- User totals and daily tracking
-- ============================================
CREATE TABLE IF NOT EXISTS user_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Totals
  total_points INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id)
);

COMMENT ON TABLE user_points IS 'User point totals and level tracking';

-- ============================================
-- 4. USER_POINT_LOG TABLE
-- Detailed history of point awards
-- ============================================
CREATE TABLE IF NOT EXISTS user_point_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_slug TEXT NOT NULL,

  -- Points awarded
  base_points INTEGER NOT NULL,
  multiplier DECIMAL(3,1) NOT NULL DEFAULT 1.0,
  total_points INTEGER NOT NULL,

  -- Context
  promo_id UUID REFERENCES point_promos(id) ON DELETE SET NULL,
  reference_id TEXT,  -- e.g., lesson_id, review_id
  reference_type TEXT,  -- e.g., 'lesson', 'review'

  -- When
  awarded_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE user_point_log IS 'Detailed log of all point awards for auditing';
COMMENT ON COLUMN user_point_log.reference_id IS 'ID of the related entity (lesson, review, etc.)';

-- ============================================
-- INDEXES
-- ============================================

-- point_actions
CREATE INDEX IF NOT EXISTS idx_point_actions_slug ON point_actions(slug);
CREATE INDEX IF NOT EXISTS idx_point_actions_active ON point_actions(is_active) WHERE is_active = TRUE;

-- point_promos
CREATE INDEX IF NOT EXISTS idx_point_promos_active ON point_promos(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_point_promos_dates ON point_promos(starts_at, ends_at);
CREATE INDEX IF NOT EXISTS idx_point_promos_current ON point_promos(starts_at, ends_at)
  WHERE is_active = TRUE;

-- user_points
CREATE INDEX IF NOT EXISTS idx_user_points_user ON user_points(user_id);
CREATE INDEX IF NOT EXISTS idx_user_points_level ON user_points(current_level);

-- user_point_log
CREATE INDEX IF NOT EXISTS idx_point_log_user ON user_point_log(user_id);
CREATE INDEX IF NOT EXISTS idx_point_log_action ON user_point_log(action_slug);
CREATE INDEX IF NOT EXISTS idx_point_log_date ON user_point_log(awarded_at);
CREATE INDEX IF NOT EXISTS idx_point_log_user_action_date ON user_point_log(user_id, action_slug, awarded_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE point_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_point_log ENABLE ROW LEVEL SECURITY;

-- POINT_ACTIONS: Public read, admin write
CREATE POLICY "Anyone can view active point actions" ON point_actions
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage point actions" ON point_actions
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- POINT_PROMOS: Public read active, admin write
CREATE POLICY "Anyone can view active promos" ON point_promos
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage point promos" ON point_promos
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- USER_POINTS: Users own their data
CREATE POLICY "Users can view own points" ON user_points
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert user points" ON user_points
  FOR INSERT WITH CHECK (true);  -- Handled by functions

CREATE POLICY "System can update user points" ON user_points
  FOR UPDATE USING (true);  -- Handled by functions

CREATE POLICY "Admins can view all user points" ON user_points
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- USER_POINT_LOG: Users view own, admin view all
CREATE POLICY "Users can view own point log" ON user_point_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert point log" ON user_point_log
  FOR INSERT WITH CHECK (true);  -- Handled by functions

CREATE POLICY "Admins can view all point logs" ON user_point_log
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER update_point_actions_updated_at
  BEFORE UPDATE ON point_actions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_point_promos_updated_at
  BEFORE UPDATE ON point_promos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_points_updated_at
  BEFORE UPDATE ON user_points
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get current active promo (returns NULL if none)
-- Only one promo active at a time by design
CREATE OR REPLACE FUNCTION get_active_promo(p_action_slug TEXT DEFAULT NULL)
RETURNS TABLE(
  id UUID,
  name TEXT,
  multiplier DECIMAL(3,1),
  banner_text TEXT,
  scope_type TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pp.id,
    pp.name,
    pp.multiplier,
    pp.banner_text,
    pp.scope_type
  FROM point_promos pp
  WHERE pp.is_active = TRUE
    AND NOW() BETWEEN pp.starts_at AND pp.ends_at
    AND (
      pp.scope_type = 'global'
      OR (pp.scope_type = 'action' AND pp.scope_value = p_action_slug)
    )
  ORDER BY
    -- Prefer action-specific over global
    CASE WHEN pp.scope_type = 'action' THEN 0 ELSE 1 END,
    pp.multiplier DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get points config for an action (with active promo applied)
CREATE OR REPLACE FUNCTION get_points_for_action(p_action_slug TEXT)
RETURNS TABLE(
  base_points INTEGER,
  multiplier DECIMAL(3,1),
  effective_points INTEGER,
  daily_max INTEGER,
  effective_daily_max INTEGER,
  promo_id UUID,
  promo_name TEXT,
  promo_banner TEXT
) AS $$
DECLARE
  v_action point_actions%ROWTYPE;
  v_promo RECORD;
BEGIN
  -- Get action config
  SELECT * INTO v_action FROM point_actions pa WHERE pa.slug = p_action_slug AND pa.is_active = TRUE;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Get active promo
  SELECT * INTO v_promo FROM get_active_promo(p_action_slug);

  RETURN QUERY
  SELECT
    v_action.base_points,
    COALESCE(v_promo.multiplier, 1.0)::DECIMAL(3,1),
    (v_action.base_points * COALESCE(v_promo.multiplier, 1.0))::INTEGER,
    v_action.daily_max,
    CASE
      WHEN v_action.daily_max IS NULL THEN NULL
      ELSE (v_action.daily_max * COALESCE(v_promo.multiplier, 1.0))::INTEGER
    END,
    v_promo.id,
    v_promo.name,
    v_promo.banner_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Count today's awards for a user and action (for daily max checking)
CREATE OR REPLACE FUNCTION get_daily_action_count(p_user_id UUID, p_action_slug TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM user_point_log
    WHERE user_id = p_user_id
      AND action_slug = p_action_slug
      AND awarded_at >= CURRENT_DATE
      AND awarded_at < CURRENT_DATE + INTERVAL '1 day'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Award points to a user (main function for point awards)
CREATE OR REPLACE FUNCTION award_points(
  p_user_id UUID,
  p_action_slug TEXT,
  p_reference_id TEXT DEFAULT NULL,
  p_reference_type TEXT DEFAULT NULL
)
RETURNS TABLE(
  success BOOLEAN,
  points_awarded INTEGER,
  message TEXT,
  new_total INTEGER
) AS $$
DECLARE
  v_config RECORD;
  v_daily_count INTEGER;
  v_effective_max INTEGER;
  v_points_to_award INTEGER;
BEGIN
  -- Get action config with promo
  SELECT * INTO v_config FROM get_points_for_action(p_action_slug);

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0, 'Unknown action: ' || p_action_slug, 0;
    RETURN;
  END IF;

  -- Check daily max
  v_daily_count := get_daily_action_count(p_user_id, p_action_slug);
  v_effective_max := v_config.effective_daily_max;

  IF v_effective_max IS NOT NULL AND v_daily_count >= v_effective_max THEN
    RETURN QUERY SELECT FALSE, 0, 'Daily maximum reached for ' || p_action_slug, 0;
    RETURN;
  END IF;

  v_points_to_award := v_config.effective_points;

  -- Log the award
  INSERT INTO user_point_log (
    user_id, action_slug, base_points, multiplier, total_points,
    promo_id, reference_id, reference_type
  ) VALUES (
    p_user_id, p_action_slug, v_config.base_points, v_config.multiplier, v_points_to_award,
    v_config.promo_id, p_reference_id, p_reference_type
  );

  -- Update user total
  INSERT INTO user_points (user_id, total_points)
  VALUES (p_user_id, v_points_to_award)
  ON CONFLICT (user_id) DO UPDATE
  SET total_points = user_points.total_points + v_points_to_award,
      updated_at = NOW();

  -- Return result
  RETURN QUERY
  SELECT
    TRUE,
    v_points_to_award,
    CASE
      WHEN v_config.promo_name IS NOT NULL
      THEN v_config.promo_name || ' bonus applied!'
      ELSE 'Points awarded'
    END,
    (SELECT up.total_points FROM user_points up WHERE up.user_id = p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SEED DATA - Default Point Actions
-- ============================================

INSERT INTO point_actions (slug, label, description, base_points, daily_max) VALUES
  ('lesson_complete', 'Complete a Lesson', 'Awarded when marking a lesson as complete', 3, 10),
  ('review_submit', 'Submit Course Review', 'Awarded for submitting a prerequisite course review', 10, NULL),
  ('shadow_log', 'Log Shadow Hours', 'Awarded for logging shadow day hours', 5, 3),
  ('clinical_log', 'Log Clinical Experience', 'Awarded for logging clinical experience hours', 5, 3),
  ('profile_complete', 'Complete Profile Section', 'Awarded for completing a MyStats section', 15, NULL),
  ('eq_log', 'Log EQ Hours', 'Awarded for logging extracurricular hours', 5, 3),
  ('program_save', 'Save Target Program', 'Awarded for adding a school to target list', 5, 5),
  ('task_complete', 'Complete Program Task', 'Awarded for completing a program checklist task', 2, 20),
  ('first_login', 'First Login Bonus', 'One-time bonus for first login', 50, 1),
  ('daily_streak', 'Daily Login Streak', 'Awarded for consecutive daily logins', 5, 1)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- NOTES FOR DEV TEAM
-- ============================================
--
-- 1. AWARDING POINTS IN CODE:
--    SELECT * FROM award_points(
--      p_user_id := 'user-uuid',
--      p_action_slug := 'lesson_complete',
--      p_reference_id := 'lesson-uuid',
--      p_reference_type := 'lesson'
--    );
--
-- 2. CHECKING ACTIVE PROMO:
--    SELECT * FROM get_active_promo();  -- Any active promo
--    SELECT * FROM get_active_promo('lesson_complete');  -- For specific action
--
-- 3. GETTING CURRENT CONFIG:
--    SELECT * FROM get_points_for_action('lesson_complete');
--    Returns: base_points, multiplier, effective_points, daily_max, etc.
--
-- 4. DAILY MAX BEHAVIOR:
--    - Daily max scales with promo multiplier
--    - Normal: 3pts × 10/day = 30pts max
--    - 2x Promo: 6pts × 20/day = 120pts max
--
-- 5. ONE PROMO AT A TIME:
--    - Design intentionally prevents overlapping promos
--    - Admin UI should warn if creating overlapping dates
--    - If somehow overlap exists, action-specific wins over global
--
-- ============================================
