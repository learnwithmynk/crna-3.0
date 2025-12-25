-- ============================================================
-- USER TRACKERS SCHEMA
-- Migration: 20251213800000_user_trackers.sql
--
-- Tables: clinical_entries, shadow_days, eq_reflections, user_events
-- Source: Based on mockClinicalEntries.js, mockShadowDays.js, mockEQReflections.js
-- ============================================================

-- ============================================================
-- CLINICAL_ENTRIES TABLE
-- Clinical shift tracker entries
-- ============================================================
CREATE TABLE IF NOT EXISTS clinical_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Shift Info
  shift_date DATE NOT NULL,
  shift_type TEXT DEFAULT 'day',         -- 'day', 'night', 'evening'
  shift_duration INTEGER DEFAULT 12,     -- Hours

  -- Patient Info
  patient_count INTEGER DEFAULT 1,
  patient_populations TEXT[],            -- ['cardiac', 'surgical', 'trauma', 'neuro', 'renal', etc.]

  -- Experience Arrays (JSONB for structured data)
  -- Format: [{ medicationId: 'propofol', confidenceLevel: 'performed' }]
  medications JSONB DEFAULT '[]',
  devices JSONB DEFAULT '[]',
  procedures JSONB DEFAULT '[]',

  -- Special Circumstances
  teaching_involved BOOLEAN DEFAULT FALSE,
  code_or_rapid_response BOOLEAN DEFAULT FALSE,
  unusual_cases TEXT[],                  -- ['ecmo_initiation', 'crrt_start', etc.]

  -- Notes
  notes TEXT,
  highlight_moment TEXT,                 -- "Today's highlight" for interview prep

  -- Gamification
  points_earned INTEGER DEFAULT 2,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Confidence levels for medications/devices/procedures:
-- 'observed', 'assisted', 'performed', 'could_teach'

CREATE INDEX IF NOT EXISTS idx_clinical_entries_user ON clinical_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_clinical_entries_date ON clinical_entries(shift_date DESC);
CREATE INDEX IF NOT EXISTS idx_clinical_entries_user_date ON clinical_entries(user_id, shift_date DESC);

ALTER TABLE clinical_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_clinical_entries ON clinical_entries
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- CLINICAL_TRACKER_STATS TABLE
-- Cached/computed stats for clinical tracker (for performance)
-- ============================================================
CREATE TABLE IF NOT EXISTS clinical_tracker_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  streak INTEGER DEFAULT 0,
  total_logs INTEGER DEFAULT 0,
  total_shifts INTEGER DEFAULT 0,
  unique_populations INTEGER DEFAULT 0,
  unique_devices INTEGER DEFAULT 0,
  unique_procedures INTEGER DEFAULT 0,
  unique_medications INTEGER DEFAULT 0,

  last_entry_date DATE,
  points_per_log INTEGER DEFAULT 2,

  -- Computed acuity score (0-100)
  acuity_score INTEGER DEFAULT 0,

  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE clinical_tracker_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_clinical_stats ON clinical_tracker_stats
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- SHADOW_DAYS TABLE
-- Shadow day tracker entries
-- ============================================================
CREATE TABLE IF NOT EXISTS shadow_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic Info
  date DATE NOT NULL,
  status TEXT DEFAULT 'logged',          -- 'logged', 'upcoming', 'cancelled'

  -- Location
  location TEXT NOT NULL,                -- Facility name

  -- CRNA Provider Info
  provider_name TEXT,
  provider_email TEXT,
  provider_linkedin TEXT,
  provider_program TEXT,                 -- Where they trained (if known)
  provider_specialty TEXT,               -- 'cardiac', 'regional', 'neuro', 'general'

  -- Hours & Cases
  hours_logged INTEGER DEFAULT 0,
  cases_observed INTEGER DEFAULT 0,
  skills_observed TEXT[],                -- ['intubation', 'mask_ventilation', 'arterial_line', etc.]

  -- Notes
  notes TEXT,
  standout_moment TEXT,                  -- For interview prep

  -- Follow-up Tracking
  follow_up_status TEXT DEFAULT 'none',  -- 'none', 'thank_you_sent', 'lor_requested', 'lor_received'

  -- Network
  saved_to_network BOOLEAN DEFAULT FALSE,
  target_program_id TEXT,                -- If shadowing for specific program
  add_to_total_hours BOOLEAN DEFAULT TRUE,

  -- For upcoming shadows
  prep_completed BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shadow_days_user ON shadow_days(user_id);
CREATE INDEX IF NOT EXISTS idx_shadow_days_date ON shadow_days(date DESC);
CREATE INDEX IF NOT EXISTS idx_shadow_days_status ON shadow_days(status);

ALTER TABLE shadow_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_shadow_days ON shadow_days
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- CRNA_NETWORK TABLE
-- CRNAs the user has connected with through shadowing
-- ============================================================
CREATE TABLE IF NOT EXISTS crna_network (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  email TEXT,
  linkedin TEXT,
  facility TEXT,
  specialty TEXT,
  program TEXT,                          -- Where they trained

  total_hours_shadowed INTEGER DEFAULT 0,
  shadow_dates DATE[],

  relationship_status TEXT DEFAULT 'just_met', -- 'just_met', 'connected', 'mentor', 'lor_source'
  lor_status TEXT,                        -- 'requested', 'received', 'declined'

  notes TEXT,
  last_contact DATE,
  met_at TEXT DEFAULT 'shadow_day',      -- 'shadow_day', 'event', 'referral', 'online'

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crna_network_user ON crna_network(user_id);
CREATE INDEX IF NOT EXISTS idx_crna_network_lor ON crna_network(lor_status);

ALTER TABLE crna_network ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_crna_network ON crna_network
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- SHADOW_TRACKER_STATS TABLE
-- Cached shadow day stats
-- ============================================================
CREATE TABLE IF NOT EXISTS shadow_tracker_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  total_hours INTEGER DEFAULT 0,
  total_days INTEGER DEFAULT 0,
  total_cases INTEGER DEFAULT 0,
  unique_crnas INTEGER DEFAULT 0,
  unique_facilities INTEGER DEFAULT 0,
  skills_covered INTEGER DEFAULT 0,

  last_entry_date DATE,
  goal_hours INTEGER DEFAULT 24,

  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE shadow_tracker_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_shadow_stats ON shadow_tracker_stats
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- EQ_REFLECTIONS TABLE
-- Emotional Intelligence reflection tracker
-- ============================================================
CREATE TABLE IF NOT EXISTS eq_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Reflection Details
  date DATE NOT NULL,
  title TEXT NOT NULL,
  reflection TEXT NOT NULL,

  -- Categorization
  categories TEXT[],                     -- ['difficult_conversation', 'conflict_resolution', 'leadership', etc.]

  -- Interview Prep Flag
  is_interview_story BOOLEAN DEFAULT FALSE,

  -- Gamification
  points_earned INTEGER DEFAULT 2,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- EQ Categories:
-- difficult_conversation, conflict_resolution, leadership, teamwork,
-- patient_advocacy, self_awareness, stress_management, feedback,
-- mentoring, decision_making, communication, empathy

CREATE INDEX IF NOT EXISTS idx_eq_reflections_user ON eq_reflections(user_id);
CREATE INDEX IF NOT EXISTS idx_eq_reflections_date ON eq_reflections(date DESC);
CREATE INDEX IF NOT EXISTS idx_eq_reflections_interview ON eq_reflections(is_interview_story) WHERE is_interview_story = true;

ALTER TABLE eq_reflections ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_eq_reflections ON eq_reflections
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- EQ_TRACKER_STATS TABLE
-- Cached EQ reflection stats
-- ============================================================
CREATE TABLE IF NOT EXISTS eq_tracker_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  streak INTEGER DEFAULT 0,
  total_logs INTEGER DEFAULT 0,
  interview_stories INTEGER DEFAULT 0,

  last_entry_date DATE,

  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE eq_tracker_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_eq_stats ON eq_tracker_stats
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- USER_EVENTS TABLE
-- Events the user has saved/attended
-- ============================================================
CREATE TABLE IF NOT EXISTS user_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Event Details
  name TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  description TEXT,
  event_type TEXT,                       -- 'info_session', 'open_house', 'webinar', 'conference', 'networking'
  location TEXT,
  is_virtual BOOLEAN DEFAULT FALSE,
  registration_url TEXT,

  -- Related Program (if any)
  program_id INTEGER REFERENCES schools(id),
  school_event_id TEXT REFERENCES school_events(id),

  -- User Status
  attendance_status TEXT DEFAULT 'saved', -- 'saved', 'confirmed', 'attended', 'not_attending', 'not_attended'
  notes TEXT,

  -- Calendar Integration
  calendar_synced BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_events_user ON user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_date ON user_events(date);
CREATE INDEX IF NOT EXISTS idx_user_events_status ON user_events(attendance_status);
CREATE INDEX IF NOT EXISTS idx_user_events_program ON user_events(program_id);

ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_events ON user_events
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- EVENT_TRACKER_STATS TABLE
-- Cached event stats
-- ============================================================
CREATE TABLE IF NOT EXISTS event_tracker_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  total_saved INTEGER DEFAULT 0,
  total_attended INTEGER DEFAULT 0,
  programs_engaged INTEGER DEFAULT 0,

  last_entry_date DATE,

  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE event_tracker_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_event_stats ON event_tracker_stats
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- USER_LETTER_REQUESTS TABLE
-- Letters of recommendation tracking (global, not per-program)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_letter_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  recommender_name TEXT NOT NULL,
  recommender_title TEXT,
  recommender_email TEXT,
  relationship TEXT,                     -- 'supervisor', 'physician', 'crna', 'professor'

  status TEXT DEFAULT 'not_requested',   -- 'not_requested', 'requested', 'received', 'declined'
  requested_date TIMESTAMPTZ,
  received_date TIMESTAMPTZ,

  -- Programs this LOR is for
  program_ids INTEGER[],

  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_letter_requests_user ON user_letter_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_letter_requests_status ON user_letter_requests(status);

ALTER TABLE user_letter_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_letter_requests ON user_letter_requests
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- USER_LEADERSHIP TABLE
-- Leadership experience tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS user_leadership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  organization TEXT,
  start_date DATE,
  end_date DATE,                         -- NULL if current
  is_current BOOLEAN DEFAULT TRUE,
  description TEXT,

  -- Type
  leadership_type TEXT,                  -- 'committee', 'charge_role', 'preceptor', 'council', 'volunteer', 'certification', 'other'

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leadership_user ON user_leadership(user_id);

ALTER TABLE user_leadership ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_leadership ON user_leadership
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER update_clinical_entries_updated_at
  BEFORE UPDATE ON clinical_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shadow_days_updated_at
  BEFORE UPDATE ON shadow_days
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_eq_reflections_updated_at
  BEFORE UPDATE ON eq_reflections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_events_updated_at
  BEFORE UPDATE ON user_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crna_network_updated_at
  BEFORE UPDATE ON crna_network
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_letter_requests_updated_at
  BEFORE UPDATE ON user_letter_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_leadership_updated_at
  BEFORE UPDATE ON user_leadership
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- FUNCTION: Update tracker stats after clinical entry
-- ============================================================
CREATE OR REPLACE FUNCTION update_clinical_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO clinical_tracker_stats (user_id, total_logs, last_entry_date, updated_at)
  VALUES (NEW.user_id, 1, NEW.shift_date, NOW())
  ON CONFLICT (user_id) DO UPDATE SET
    total_logs = clinical_tracker_stats.total_logs + 1,
    last_entry_date = GREATEST(clinical_tracker_stats.last_entry_date, NEW.shift_date),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER after_clinical_entry_insert
  AFTER INSERT ON clinical_entries
  FOR EACH ROW EXECUTE FUNCTION update_clinical_stats();

-- ============================================================
-- FUNCTION: Update shadow stats after shadow day
-- ============================================================
CREATE OR REPLACE FUNCTION update_shadow_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'logged' THEN
    INSERT INTO shadow_tracker_stats (user_id, total_hours, total_days, last_entry_date, updated_at)
    VALUES (NEW.user_id, NEW.hours_logged, 1, NEW.date, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      total_hours = shadow_tracker_stats.total_hours + NEW.hours_logged,
      total_days = shadow_tracker_stats.total_days + 1,
      total_cases = shadow_tracker_stats.total_cases + COALESCE(NEW.cases_observed, 0),
      last_entry_date = GREATEST(shadow_tracker_stats.last_entry_date, NEW.date),
      updated_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER after_shadow_day_insert
  AFTER INSERT ON shadow_days
  FOR EACH ROW EXECUTE FUNCTION update_shadow_stats();

-- ============================================================
-- FUNCTION: Update EQ stats after reflection
-- ============================================================
CREATE OR REPLACE FUNCTION update_eq_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO eq_tracker_stats (user_id, total_logs, last_entry_date, updated_at)
  VALUES (NEW.user_id, 1, NEW.date, NOW())
  ON CONFLICT (user_id) DO UPDATE SET
    total_logs = eq_tracker_stats.total_logs + 1,
    interview_stories = eq_tracker_stats.interview_stories + (CASE WHEN NEW.is_interview_story THEN 1 ELSE 0 END),
    last_entry_date = GREATEST(eq_tracker_stats.last_entry_date, NEW.date),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER after_eq_reflection_insert
  AFTER INSERT ON eq_reflections
  FOR EACH ROW EXECUTE FUNCTION update_eq_stats();
