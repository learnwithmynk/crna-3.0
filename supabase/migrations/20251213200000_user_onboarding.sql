-- ============================================
-- User Onboarding Questionnaire Schema
-- Stores applicant onboarding responses for personalization and admin analytics
-- ============================================

-- USER ONBOARDING TABLE
-- Captures questionnaire answers from first-login onboarding flow
CREATE TABLE user_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Timeline/Stage (determines Path A/B/C)
  timeline TEXT CHECK (timeline IN (
    'exploring_18_plus',      -- Path A: 18+ months out
    'strategizing_6_18',      -- Path A: 6-18 months out
    'applying_soon',          -- Path B: < 6 months
    'actively_applying',      -- Path B: Currently applying
    'accepted'                -- Path C: Already accepted
  )),

  -- Current Status
  currently_in_icu TEXT CHECK (currently_in_icu IN (
    'yes',
    'nursing_school',
    'other_unit'
  )),
  current_unit TEXT,  -- If not in ICU, what unit

  -- ICU Experience (snapshot at signup for baseline)
  icu_type TEXT,
  icu_years INTEGER DEFAULT 0,
  icu_months INTEGER DEFAULT 0,

  -- Shadowing
  shadow_hours INTEGER DEFAULT 0,

  -- Certifications (array of certification codes)
  certifications TEXT[] DEFAULT '{}',

  -- GRE Status
  gre_status TEXT CHECK (gre_status IN (
    'taken',
    'planning',
    'looking_for_no_gre'
  )),
  gre_quantitative INTEGER,  -- 130-170
  gre_verbal INTEGER,        -- 130-170
  gre_writing DECIMAL(2,1),  -- 0.0-6.0

  -- Help Needed (maps to primaryFocusAreas)
  help_needed TEXT[] DEFAULT '{}',  -- ['essay', 'resume', 'interview_prep', 'lor', 'logistics', 'other']

  -- Location (for event recommendations)
  user_state TEXT,  -- Two-letter state code

  -- Schools of Interest (Path A) - stored as array of school IDs
  interested_schools UUID[] DEFAULT '{}',

  -- Target Schools (Path B) - stored as array of school IDs
  target_schools UUID[] DEFAULT '{}',

  -- Acceptance Info (Path C)
  accepted_program_id UUID,
  applying_to_more BOOLEAN,

  -- Flow Tracking
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  skipped_at TIMESTAMPTZ,
  current_screen TEXT,  -- For resuming abandoned flow
  path TEXT CHECK (path IN ('A', 'B', 'C')),

  -- Admin Analytics (snapshot for cohort analysis)
  signup_application_stage TEXT,  -- Stage at time of signup

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id)
);

-- Indexes for common queries
CREATE INDEX idx_user_onboarding_user ON user_onboarding(user_id);
CREATE INDEX idx_user_onboarding_timeline ON user_onboarding(timeline);
CREATE INDEX idx_user_onboarding_completed ON user_onboarding(completed_at) WHERE completed_at IS NOT NULL;
CREATE INDEX idx_user_onboarding_skipped ON user_onboarding(skipped_at) WHERE skipped_at IS NOT NULL;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_user_onboarding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_onboarding_updated_at
  BEFORE UPDATE ON user_onboarding
  FOR EACH ROW
  EXECUTE FUNCTION update_user_onboarding_updated_at();

-- Row Level Security
ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;

-- Users can read/write their own onboarding data
CREATE POLICY "Users can manage own onboarding"
  ON user_onboarding
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can read all onboarding data (for analytics)
CREATE POLICY "Admins can read all onboarding"
  ON user_onboarding
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Comments for documentation
COMMENT ON TABLE user_onboarding IS 'Stores first-login onboarding questionnaire responses for personalization and admin analytics';
COMMENT ON COLUMN user_onboarding.timeline IS 'Application timeline determining onboarding path (A=Foundation, B=Execution, C=Accepted)';
COMMENT ON COLUMN user_onboarding.icu_years IS 'ICU experience years at signup - baseline for tracking growth';
COMMENT ON COLUMN user_onboarding.help_needed IS 'Areas user needs help with - maps to Guidance Engine primaryFocusAreas';
COMMENT ON COLUMN user_onboarding.current_screen IS 'Last completed screen - allows resuming abandoned onboarding';
COMMENT ON COLUMN user_onboarding.signup_application_stage IS 'Snapshot of application stage at signup for cohort analysis';
