-- ============================================================
-- USER RESEARCH & VOLUNTEERING SCHEMA
-- Migration: 20251215200000_user_research_volunteering.sql
--
-- Adds:
-- 1. user_research table - Research experience tracking
-- 2. user_volunteering table - Volunteering/community involvement
-- 3. private_notes and additional_info fields to user_profiles
-- ============================================================

-- ============================================================
-- USER_RESEARCH TABLE
-- Research experience tracking (QI projects, publications, posters)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_research (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,                   -- Research project/publication title
  organization TEXT,                     -- Institution/hospital
  role TEXT,                             -- 'principal_investigator', 'co_investigator', 'data_collector', 'author', 'co_author', 'presenter', 'other'
  research_type TEXT,                    -- 'qi_project', 'poster', 'publication', 'thesis', 'capstone', 'clinical_trial', 'other'

  start_date DATE,
  end_date DATE,                         -- NULL if ongoing
  is_ongoing BOOLEAN DEFAULT FALSE,

  description TEXT,                      -- Details about the research
  outcome TEXT,                          -- Results, publication info, presentation venue
  url TEXT,                              -- Link to publication/poster if available

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Valid role values:
-- principal_investigator, co_investigator, data_collector, author, co_author, presenter, other

-- Valid research_type values:
-- qi_project, poster, publication, thesis, capstone, clinical_trial, other

CREATE INDEX IF NOT EXISTS idx_research_user ON user_research(user_id);
CREATE INDEX IF NOT EXISTS idx_research_type ON user_research(research_type);

ALTER TABLE user_research ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_research ON user_research
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- USER_VOLUNTEERING TABLE
-- Volunteering and community involvement tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS user_volunteering (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,                   -- Role/activity name
  organization TEXT,                     -- Organization name
  volunteer_type TEXT,                   -- 'medical_mission', 'free_clinic', 'community_health', 'education', 'mentoring', 'professional_org', 'other'

  start_date DATE,
  end_date DATE,                         -- NULL if ongoing
  is_ongoing BOOLEAN DEFAULT FALSE,

  hours_total INTEGER,                   -- Approximate total hours
  frequency TEXT,                        -- 'one_time', 'weekly', 'monthly', 'quarterly', 'annually'

  description TEXT,                      -- Details about involvement
  impact TEXT,                           -- Measurable impact or outcomes

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Valid volunteer_type values:
-- medical_mission, free_clinic, community_health, education, mentoring, professional_org, other

CREATE INDEX IF NOT EXISTS idx_volunteering_user ON user_volunteering(user_id);
CREATE INDEX IF NOT EXISTS idx_volunteering_type ON user_volunteering(volunteer_type);

ALTER TABLE user_volunteering ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_volunteering ON user_volunteering
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- ADD NOTES FIELDS TO USER_PROFILES
-- ============================================================
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS private_notes TEXT,
ADD COLUMN IF NOT EXISTS additional_info TEXT;

COMMENT ON COLUMN user_profiles.private_notes IS 'User private notes - personal reminders, application notes, etc.';
COMMENT ON COLUMN user_profiles.additional_info IS 'Additional information for profile - free text for anything not captured elsewhere';

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER update_user_research_updated_at
  BEFORE UPDATE ON user_research
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_volunteering_updated_at
  BEFORE UPDATE ON user_volunteering
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- UPDATE LEADERSHIP_TYPE COMMENT
-- Remove 'volunteer' and 'certification' from valid types since
-- they have their own dedicated tables
-- ============================================================
COMMENT ON COLUMN user_leadership.leadership_type IS 'Leadership type: committee, charge_role, preceptor, council, journal_club, other';

-- ============================================================
-- NOTES FOR DEV TEAM
-- ============================================================
--
-- Frontend components to update:
-- - ResearchCommunitySection.jsx - fetch from user_research & user_volunteering
-- - LeadershipSection.jsx - fetch from user_leadership (committees go here)
-- - AdditionalInfoCard.jsx - save to user_profiles.additional_info
-- - NotesSection.jsx - save private notes to user_profiles.private_notes
--
-- Hook updates needed:
-- - useUser.js - fetch private_notes and additional_info from user_profiles
-- - New hook or extend useTrackers for research/volunteering CRUD
--
-- Research types explained:
-- - qi_project: Quality improvement project at hospital
-- - poster: Poster presentation at conference
-- - publication: Published paper/article
-- - thesis: Graduate thesis work
-- - capstone: DNP capstone project
-- - clinical_trial: Participation in clinical research
--
-- Volunteering types explained:
-- - medical_mission: International or domestic medical mission trips
-- - free_clinic: Volunteer at free/charity clinic
-- - community_health: Health fairs, screenings, education events
-- - education: Teaching, tutoring, health education
-- - mentoring: Mentoring students or peers
-- - professional_org: AACN, state nursing association, etc.
