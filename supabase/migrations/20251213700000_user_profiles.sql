-- ============================================================
-- USER PROFILES SCHEMA
-- Migration: 20251213700000_user_profiles.sql
--
-- Tables: user_profiles, user_academic_profiles, user_clinical_profiles
-- Source: Based on mockUser.js, mockAcademicProfile, mockClinicalProfile
-- ============================================================

-- ============================================================
-- USER_PROFILES TABLE
-- Core user profile data (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic Info
  email TEXT,
  name TEXT,
  preferred_name TEXT,
  avatar_url TEXT,

  -- Subscription (synced from Stripe/WordPress)
  subscription_tier TEXT DEFAULT 'free',  -- 'free', 'trial', 'member', 'founding', 'toolkit'
  subscription_status TEXT DEFAULT 'inactive', -- 'active', 'trialing', 'past_due', 'canceled', 'inactive'
  trial_ends_at TIMESTAMPTZ,
  stripe_customer_id TEXT,

  -- Program Status
  program_status TEXT DEFAULT 'exploring', -- 'exploring', 'some_targets', 'active_applications', 'submitted', 'accepted'

  -- Gamification (synced from/to points system)
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  level_name TEXT DEFAULT 'Aspiring Applicant',

  -- Activity Tracking
  login_streak INTEGER DEFAULT 0,
  previous_streak INTEGER DEFAULT 0,
  last_login_at TIMESTAMPTZ,

  -- Onboarding
  onboarding_completed_at TIMESTAMPTZ,
  onboarding_widget_complete BOOLEAN DEFAULT FALSE,
  onboarding_widget_progress INTEGER DEFAULT 0,
  onboarding_path TEXT,               -- 'A', 'B', 'C' based on timeline

  -- ReadyScore (cached, computed by engine)
  ready_score INTEGER DEFAULT 0,
  previous_ready_score INTEGER DEFAULT 0,
  last_ready_score_celebration TIMESTAMPTZ,

  -- Application Materials Progress
  resume_completed BOOLEAN DEFAULT FALSE,
  personal_statement_completed BOOLEAN DEFAULT FALSE,

  -- Smart Prompts State
  previous_checklist_completed INTEGER DEFAULT 0,
  has_seen_first_target_celebration BOOLEAN DEFAULT FALSE,
  has_seen_school_scout_badge BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription ON user_profiles(subscription_tier, subscription_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_level ON user_profiles(level);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY user_own_profile ON user_profiles
  FOR ALL USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY admin_read_profiles ON user_profiles
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- ============================================================
-- USER_ACADEMIC_PROFILES TABLE
-- Academic profile data (GPA, GRE, prerequisites)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_academic_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- GPA Metrics
  overall_gpa NUMERIC(3,2),
  science_gpa NUMERIC(3,2),
  science_gpa_with_forgiveness NUMERIC(3,2),
  last_60_gpa NUMERIC(3,2),
  nursing_gpa NUMERIC(3,2),
  gpa_calculated BOOLEAN DEFAULT FALSE,  -- Has user used transcript analyzer?

  -- GRE Scores
  gre_quantitative INTEGER,              -- 130-170
  gre_verbal INTEGER,                    -- 130-170
  gre_analytical_writing NUMERIC(2,1),   -- 0.0-6.0
  gre_combined INTEGER,                  -- Computed: quant + verbal
  gre_test_date DATE,
  gre_expires_date DATE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_academic_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_academic ON user_academic_profiles
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- USER_COMPLETED_PREREQUISITES TABLE
-- Prerequisites the user has completed
-- ============================================================
CREATE TABLE IF NOT EXISTS user_completed_prerequisites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  course_type TEXT NOT NULL,             -- 'anatomy', 'physiology', 'organic_chemistry', etc.
  year INTEGER,                          -- Year completed
  grade TEXT,                            -- 'A', 'B', 'C', etc.
  school_name TEXT,                      -- Where course was taken
  credits INTEGER,
  is_graduate_level BOOLEAN DEFAULT FALSE,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Valid course_type values:
-- anatomy, physiology, anatomy_physiology, physics, biochemistry,
-- organic_chemistry, general_chemistry, pathophysiology, pharmacology,
-- microbiology, research, statistics

CREATE INDEX IF NOT EXISTS idx_completed_prereqs_user ON user_completed_prerequisites(user_id);
CREATE INDEX IF NOT EXISTS idx_completed_prereqs_type ON user_completed_prerequisites(course_type);

ALTER TABLE user_completed_prerequisites ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_prereqs ON user_completed_prerequisites
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- USER_CLINICAL_PROFILES TABLE
-- Clinical experience profile
-- ============================================================
CREATE TABLE IF NOT EXISTS user_clinical_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- ICU Experience
  primary_icu_type TEXT,                 -- 'micu', 'sicu', 'cvicu', 'cticu', etc.
  additional_icu_types TEXT[],           -- Array of additional ICU types
  total_years_experience NUMERIC(3,1),

  -- Hospital Info
  hospital_name TEXT,
  hospital_city TEXT,
  hospital_state TEXT,
  unit_type TEXT,                        -- More specific unit designation
  bed_count INTEGER,
  is_teaching_hospital BOOLEAN,
  is_level_1_trauma BOOLEAN,

  -- Employment
  employment_status TEXT,                -- 'full_time', 'part_time', 'prn', 'travel'
  start_date DATE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Valid primary_icu_type values:
-- micu, sicu, cvicu, cticu, neuro_icu, trauma_icu, burn_icu,
-- picu, nicu, mixed, flight_nurse, other

ALTER TABLE user_clinical_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_clinical ON user_clinical_profiles
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- USER_CERTIFICATIONS TABLE
-- User certifications (CCRN, BLS, ACLS, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  cert_type TEXT NOT NULL,               -- 'ccrn', 'bls', 'acls', 'pals', 'tncc', 'cpen', etc.
  status TEXT DEFAULT 'not_started',     -- 'not_started', 'studying', 'scheduled', 'passed', 'expired'
  earned_date DATE,
  expires_date DATE,
  verification_number TEXT,

  -- Scheduling (for studying/scheduled status)
  scheduled_date DATE,
  study_start_date DATE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_certifications_user ON user_certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_certifications_type ON user_certifications(cert_type);
CREATE INDEX IF NOT EXISTS idx_certifications_expires ON user_certifications(expires_date);

ALTER TABLE user_certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_certifications ON user_certifications
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- USER_GUIDANCE_STATE TABLE
-- Computed guidance state from Guidance Engine
-- ============================================================
CREATE TABLE IF NOT EXISTS user_guidance_state (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Application Stage (computed from highest program status)
  application_stage TEXT DEFAULT 'exploring', -- 'exploring', 'strategizing', 'executing', 'interviewing', 'post_decision'

  -- Support Mode (derived from applicationStage)
  support_mode TEXT DEFAULT 'orientation',    -- 'orientation', 'strategy', 'execution', 'confidence'

  -- Risk Signals (array of active signals)
  risk_signals TEXT[] DEFAULT '{}',           -- 'stagnation', 'deadline_pressure', 'momentum'

  -- Next Best Steps (JSONB array of step objects)
  next_best_steps JSONB DEFAULT '[]',

  -- Dismissed Steps (JSONB array of {stepId, dismissedAt})
  dismissed_steps JSONB DEFAULT '[]',

  -- Last computation timestamp
  last_computed_at TIMESTAMPTZ DEFAULT NOW(),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_guidance_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_guidance ON user_guidance_state
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- USER_FOCUS_AREAS TABLE
-- User's active focus areas
-- ============================================================
CREATE TABLE IF NOT EXISTS user_focus_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  area TEXT NOT NULL,                    -- 'school_search', 'gpa_prereqs', 'certifications', etc.
  status TEXT DEFAULT 'active',          -- 'active', 'secondary', 'completed'
  source TEXT DEFAULT 'system',          -- 'system', 'behavior', 'user_action'
  activated_at TIMESTAMPTZ DEFAULT NOW(),
  last_engaged_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  UNIQUE(user_id, area)
);

-- Valid area values:
-- school_search, gpa_prereqs, certifications, shadowing,
-- leadership, resume, essay, interview_prep

CREATE INDEX IF NOT EXISTS idx_focus_areas_user ON user_focus_areas(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_areas_status ON user_focus_areas(status);

ALTER TABLE user_focus_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_focus_areas ON user_focus_areas
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- USER_ACTIVITY_LOG TABLE
-- Track meaningful user actions for engagement metrics
-- ============================================================
CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  action_type TEXT NOT NULL,             -- See action types below
  metadata JSONB DEFAULT '{}',           -- Action-specific data
  points_earned INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Valid action_type values:
-- log_clinical, log_shadow, log_eq, log_event
-- complete_checklist_item, complete_milestone_item
-- add_target_program, update_target_program, submit_application
-- complete_lesson, earn_badge, level_up
-- forum_post, marketplace_booking, feedback_submitted

CREATE INDEX IF NOT EXISTS idx_activity_log_user ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_type ON user_activity_log(action_type);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON user_activity_log(created_at DESC);

-- Note: Partial index for recent activity removed - use query-time filtering instead
-- PostgreSQL doesn't allow NOW() in index predicates (must be immutable)

ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_activity ON user_activity_log
  FOR ALL USING (auth.uid() = user_id);

-- Admins can read all activity for analytics
CREATE POLICY admin_read_activity ON user_activity_log
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- ============================================================
-- USER_BADGES TABLE
-- Earned badges
-- ============================================================
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  badge_id TEXT NOT NULL,                -- 'target_trailblazer', 'critical_care_crusher', etc.
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_badges_user ON user_badges(user_id);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_badges ON user_badges
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_academic_profiles_updated_at
  BEFORE UPDATE ON user_academic_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_clinical_profiles_updated_at
  BEFORE UPDATE ON user_clinical_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_certifications_updated_at
  BEFORE UPDATE ON user_certifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_guidance_state_updated_at
  BEFORE UPDATE ON user_guidance_state
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- FUNCTION: Create profile on user signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, name, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NOW()
  );

  INSERT INTO user_guidance_state (user_id) VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
