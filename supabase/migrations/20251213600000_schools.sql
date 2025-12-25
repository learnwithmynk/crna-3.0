-- ============================================================
-- SCHOOLS SCHEMA
-- Migration: 20251213600000_schools.sql
--
-- Tables: schools, school_events, schools_internal, user_saved_schools
-- Source: Converted from src/data/supabase/schema.sql
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
  event_type TEXT,                  -- 'info_session', 'open_house', 'webinar', 'deadline'
  registration_url TEXT,
  is_virtual BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_school ON school_events(school_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON school_events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_type ON school_events(event_type);

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
  status TEXT DEFAULT 'researching',  -- See status enum below
  notes TEXT,
  progress INTEGER DEFAULT 0,         -- Checklist completion percentage
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, school_id)
);

-- Status enum values:
-- 'researching' - Just saved, exploring
-- 'preparing' - Actively preparing materials
-- 'applying' - In progress on application
-- 'submitted' - Application submitted
-- 'interview_invited' - Received interview invite
-- 'interviewed' - Completed interview
-- 'waitlisted' - On waitlist
-- 'accepted' - Accepted to program
-- 'denied' - Application denied

CREATE INDEX IF NOT EXISTS idx_saved_schools_user ON user_saved_schools(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_schools_school ON user_saved_schools(school_id);
CREATE INDEX IF NOT EXISTS idx_saved_schools_status ON user_saved_schools(status);
CREATE INDEX IF NOT EXISTS idx_saved_schools_target ON user_saved_schools(is_target) WHERE is_target = true;

-- Enable RLS
ALTER TABLE user_saved_schools ENABLE ROW LEVEL SECURITY;

-- Users can only see their own saved schools
CREATE POLICY user_own_saved_schools ON user_saved_schools
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TARGET_PROGRAM_CHECKLISTS TABLE
-- Checklist items for each target program
-- ============================================================
CREATE TABLE IF NOT EXISTS target_program_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  saved_school_id UUID REFERENCES user_saved_schools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  is_default BOOLEAN DEFAULT FALSE,   -- System-generated vs user-added
  excludes_taxonomy TEXT[],           -- Program-specific exclusions (e.g., no GRE)
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_checklist_saved_school ON target_program_checklists(saved_school_id);
CREATE INDEX IF NOT EXISTS idx_checklist_user ON target_program_checklists(user_id);

ALTER TABLE target_program_checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_checklists ON target_program_checklists
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TARGET_PROGRAM_LORS TABLE
-- Letter of recommendation tracking per target program
-- ============================================================
CREATE TABLE IF NOT EXISTS target_program_lors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  saved_school_id UUID REFERENCES user_saved_schools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  person_name TEXT NOT NULL,
  relationship TEXT,                  -- 'supervisor', 'physician', 'crna', 'professor'
  email TEXT,
  status TEXT DEFAULT 'not_requested', -- 'not_requested', 'requested', 'received', 'declined'
  requested_date TIMESTAMPTZ,
  received_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lors_saved_school ON target_program_lors(saved_school_id);
CREATE INDEX IF NOT EXISTS idx_lors_user ON target_program_lors(user_id);
CREATE INDEX IF NOT EXISTS idx_lors_status ON target_program_lors(status);

ALTER TABLE target_program_lors ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_lors ON target_program_lors
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TARGET_PROGRAM_DOCUMENTS TABLE
-- Documents uploaded per target program
-- ============================================================
CREATE TABLE IF NOT EXISTS target_program_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  saved_school_id UUID REFERENCES user_saved_schools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  document_type TEXT,                 -- 'resume', 'personal_statement', 'transcript', 'other'
  file_url TEXT,
  file_size INTEGER,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_saved_school ON target_program_documents(saved_school_id);
CREATE INDEX IF NOT EXISTS idx_documents_user ON target_program_documents(user_id);

ALTER TABLE target_program_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_documents ON target_program_documents
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- HELPER: View for public school data with stats
-- ============================================================
CREATE OR REPLACE VIEW schools_with_stats AS
SELECT
  s.*,
  COALESCE(e.event_count, 0) as upcoming_event_count,
  COALESCE(saved.save_count, 0) as times_saved,
  COALESCE(target.target_count, 0) as times_targeted
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
) saved ON s.id = saved.school_id
LEFT JOIN (
  SELECT school_id, COUNT(*) as target_count
  FROM user_saved_schools
  WHERE is_target = true
  GROUP BY school_id
) target ON s.id = target.school_id;

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Trigger for updated_at on schools
CREATE TRIGGER update_schools_updated_at
  BEFORE UPDATE ON schools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for updated_at on schools_internal
CREATE TRIGGER update_schools_internal_updated_at
  BEFORE UPDATE ON schools_internal
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for updated_at on user_saved_schools
CREATE TRIGGER update_user_saved_schools_updated_at
  BEFORE UPDATE ON user_saved_schools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
