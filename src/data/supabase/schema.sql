-- ============================================================
-- CRNA Club Supabase Schema
-- Generated: 2024-11-29
--
-- This schema defines the tables for the CRNA Club school database.
-- Run this in Supabase SQL Editor to create the tables.
-- ============================================================

-- ============================================================
-- SCHOOLS TABLE
-- Main table containing all CRNA program information
-- ============================================================
CREATE TABLE IF NOT EXISTS schools (
  id INTEGER PRIMARY KEY,           -- WordPress post ID (3789-3931, 2527828-2527835)
  name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  description TEXT,
  website_url TEXT,

  -- Contact Information
  contact_name TEXT,
  contact_designation TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contact_name_2 TEXT,
  contact_designation_2 TEXT,
  contact_email_2 TEXT,
  contact_phone_2 TEXT,
  instagram_handle TEXT,

  -- Program Details
  degree TEXT,                      -- 'dnp', 'dnap', 'msna'
  program_type TEXT,                -- 'front_loaded', 'integrated'
  program_start TEXT,               -- 'May', 'August', etc.
  length_months INTEGER,
  class_size INTEGER,
  clinical_sites INTEGER,
  rolling_admissions BOOLEAN,
  partially_online BOOLEAN,
  able_to_work BOOLEAN,
  nursing_cas BOOLEAN,
  leap BOOLEAN,
  regional_accreditation_required BOOLEAN,
  accepts_bachelors_science_related BOOLEAN,

  -- Costs
  tuition_in_state INTEGER,
  tuition_out_of_state INTEGER,

  -- GPA Requirements
  minimum_gpa NUMERIC(3,2),
  gpa_science BOOLEAN,
  gpa_nursing BOOLEAN,
  gpa_cumulative BOOLEAN,
  gpa_graduate BOOLEAN,
  gpa_last_60 BOOLEAN,
  gpa_notes TEXT,

  -- GRE Requirements
  gre_required BOOLEAN,
  gre_waived_for TEXT,
  gre_expires BOOLEAN,
  gre_minimum TEXT,

  -- CCRN Requirements
  ccrn_required BOOLEAN,
  ccrn_details TEXT,

  -- Prerequisites (boolean flags)
  prereq_statistics BOOLEAN,
  prereq_gen_chemistry BOOLEAN,
  prereq_organic_chemistry BOOLEAN,
  prereq_biochemistry BOOLEAN,
  prereq_accepts_organic_or_biochem BOOLEAN,
  prereq_anatomy BOOLEAN,
  prereq_physics BOOLEAN,
  prereq_pharmacology BOOLEAN,
  prereq_physiology BOOLEAN,
  prereq_microbiology BOOLEAN,
  prereq_research BOOLEAN,
  prereq_notes TEXT,
  prereq_expires BOOLEAN,

  -- Other Requirements
  minimum_experience INTEGER,       -- Years of ICU experience
  resume_notes TEXT,
  essay_prompt TEXT,
  reference_description TEXT,
  reference_count INTEGER,
  shadowing_required BOOLEAN,
  requirements_notes TEXT,

  -- Experience Types Accepted
  accepts_nicu BOOLEAN,
  accepts_picu BOOLEAN,
  accepts_er BOOLEAN,
  accepts_other_critical_care BOOLEAN,

  -- Program Statistics
  attrition_rate NUMERIC(5,2),
  nce_pass_rate NUMERIC(5,2),

  -- Application Dates
  application_opens DATE,
  application_deadline DATE,
  last_updated DATE,

  -- Notes & Media
  program_notes TEXT,
  image_url TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_schools_state ON schools(state);
CREATE INDEX IF NOT EXISTS idx_schools_degree ON schools(degree);
CREATE INDEX IF NOT EXISTS idx_schools_gpa ON schools(minimum_gpa);
CREATE INDEX IF NOT EXISTS idx_schools_program_type ON schools(program_type);

-- ============================================================
-- SCHOOL_EVENTS TABLE
-- Events associated with schools (info sessions, open houses, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS school_events (
  id TEXT PRIMARY KEY,              -- 'event_{schoolId}_{index}'
  school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
  school_name TEXT,
  name TEXT NOT NULL,
  description TEXT,
  event_date DATE,
  event_time TEXT,
  timezone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_school ON school_events(school_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON school_events(event_date);

-- ============================================================
-- SCHOOLS_INTERNAL TABLE
-- Admin-only data - protected by Row Level Security
-- ============================================================
CREATE TABLE IF NOT EXISTS schools_internal (
  school_id INTEGER PRIMARY KEY REFERENCES schools(id) ON DELETE CASCADE,
  acceptance_rate TEXT,
  admin_program_notes TEXT,
  admin_tuition_notes TEXT,
  admin_gpa_notes TEXT,
  admin_resume_required BOOLEAN,
  admin_essay_required BOOLEAN,
  admin_requirements_notes TEXT,
  general_admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE schools_internal ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can read internal data
CREATE POLICY admin_read_internal ON schools_internal
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- Policy: Only admins can modify internal data
CREATE POLICY admin_write_internal ON schools_internal
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- ============================================================
-- USER_SAVED_SCHOOLS TABLE
-- Tracks which schools users have saved/targeted
-- ============================================================
CREATE TABLE IF NOT EXISTS user_saved_schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
  is_target BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'researching',  -- 'researching', 'preparing', 'applying', 'submitted', etc.
  notes TEXT,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, school_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_schools_user ON user_saved_schools(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_schools_school ON user_saved_schools(school_id);

-- Enable RLS
ALTER TABLE user_saved_schools ENABLE ROW LEVEL SECURITY;

-- Users can only see their own saved schools
CREATE POLICY user_own_saved_schools ON user_saved_schools
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_schools_updated_at
  BEFORE UPDATE ON schools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schools_internal_updated_at
  BEFORE UPDATE ON schools_internal
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_saved_schools_updated_at
  BEFORE UPDATE ON user_saved_schools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- VIEWS
-- ============================================================

-- View for public school data with event counts
CREATE OR REPLACE VIEW schools_with_stats AS
SELECT
  s.*,
  COALESCE(e.event_count, 0) as upcoming_event_count,
  COALESCE(saved.save_count, 0) as times_saved
FROM schools s
LEFT JOIN (
  SELECT school_id, COUNT(*) as event_count
  FROM school_events
  WHERE event_date >= CURRENT_DATE
  GROUP BY school_id
) e ON s.id = e.school_id
LEFT JOIN (
  SELECT school_id, COUNT(*) as save_count
  FROM user_saved_schools
  GROUP BY school_id
) saved ON s.id = saved.school_id;

-- ============================================================
-- ANALYTICS_EVENTS TABLE
-- Tracks user actions for engagement metrics and insights
-- ============================================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_events_date ON analytics_events(created_at);

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Users can insert their own events
CREATE POLICY user_insert_events ON analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only read their own events
CREATE POLICY user_read_own_events ON analytics_events
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can read all events for analytics
CREATE POLICY admin_read_all_events ON analytics_events
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- ============================================================
-- NOTES FOR DEV TEAM
-- ============================================================
--
-- 1. WordPress IDs are used as primary keys (3789-3931, 2527828-2527835)
--    This allows easy cross-referencing with WordPress API if needed.
--
-- 2. The schools_internal table uses RLS to restrict access to admins only.
--    Make sure to set the user's role in their JWT claims.
--
-- 3. To import the generated JS data:
--    - Export schools array from schools.js
--    - Use Supabase client: supabase.from('schools').insert(schools)
--
-- 4. The user_saved_schools table tracks user's saved and target programs.
--    status values: 'researching', 'preparing', 'applying', 'submitted',
--                   'interview_invited', 'interviewed', 'waitlisted',
--                   'accepted', 'denied'
--
-- 5. Consider adding pgvector extension for AI features:
--    CREATE EXTENSION IF NOT EXISTS vector;
--    Then add embedding columns for similarity search.
