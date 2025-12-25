-- ============================================================
-- INTERVIEW DATE TRACKING & STATUS UPDATE
-- Migration: 20251214900000_interview_date_tracking.sql
--
-- Adds:
-- 1. Interview date fields to user_saved_schools
-- 2. 'accepted_declined' status
-- 3. State meetings table for AA&A events
-- ============================================================

-- ============================================================
-- ADD INTERVIEW DATE TRACKING FIELDS
-- ============================================================
ALTER TABLE user_saved_schools
ADD COLUMN IF NOT EXISTS interview_date DATE,
ADD COLUMN IF NOT EXISTS interview_date_unknown BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS interview_date_ask_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS interview_date_last_asked TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS interview_date_dismissed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS interview_location TEXT,
ADD COLUMN IF NOT EXISTS interview_is_virtual BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS interview_notes TEXT;

-- Add index for interview date queries
CREATE INDEX IF NOT EXISTS idx_saved_schools_interview_date
  ON user_saved_schools(interview_date)
  WHERE interview_date IS NOT NULL;

-- Index for finding programs needing interview date reminders
CREATE INDEX IF NOT EXISTS idx_saved_schools_interview_unknown
  ON user_saved_schools(user_id, interview_date_unknown, interview_date_ask_count)
  WHERE interview_date_unknown = true AND interview_date_dismissed = false;

-- ============================================================
-- UPDATE STATUS VALUES COMMENT
-- ============================================================
-- Status enum values (updated):
-- 'researching'       - Just saved, exploring
-- 'preparing'         - Actively preparing materials
-- 'applying'          - In progress on application
-- 'submitted'         - Application submitted
-- 'interview_invited' - Received interview invite
-- 'interviewed'       - Completed interview
-- 'waitlisted'        - On waitlist
-- 'accepted'          - Accepted to program
-- 'accepted_declined' - Accepted but user declined offer (NEW)
-- 'denied'            - Application denied

COMMENT ON COLUMN user_saved_schools.status IS 'Program status: researching, preparing, applying, submitted, interview_invited, interviewed, waitlisted, accepted, accepted_declined, denied';
COMMENT ON COLUMN user_saved_schools.interview_date IS 'Scheduled interview date (if known)';
COMMENT ON COLUMN user_saved_schools.interview_date_unknown IS 'True if user selected "I dont know yet" for interview date';
COMMENT ON COLUMN user_saved_schools.interview_date_ask_count IS 'Number of times user has been asked for interview date (max 3 on page, then toast)';
COMMENT ON COLUMN user_saved_schools.interview_date_dismissed IS 'True if user permanently dismissed interview date reminders';

-- ============================================================
-- STATE_MEETINGS TABLE
-- State AA&A meetings and regional events
-- Auto-shown on calendar if user has saved/target programs in that state
-- ============================================================
CREATE TABLE IF NOT EXISTS state_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Event Details
  title TEXT NOT NULL,
  description TEXT,

  -- Date/Time
  event_date DATE NOT NULL,
  event_time TIME,
  end_time TIME,
  timezone TEXT DEFAULT 'America/New_York',

  -- Location
  state TEXT NOT NULL,                   -- State code (e.g., 'NC', 'CA')
  city TEXT,
  location TEXT,                         -- Venue name
  is_virtual BOOLEAN DEFAULT FALSE,
  virtual_link TEXT,
  registration_url TEXT,

  -- Organization
  organization TEXT DEFAULT 'AANA',      -- 'AANA', 'State CRNA Association', etc.

  -- Metadata
  is_published BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_state_meetings_state ON state_meetings(state);
CREATE INDEX IF NOT EXISTS idx_state_meetings_date ON state_meetings(event_date);
CREATE INDEX IF NOT EXISTS idx_state_meetings_published ON state_meetings(is_published) WHERE is_published = true;

-- RLS - All authenticated users can read published meetings
ALTER TABLE state_meetings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS read_published_state_meetings ON state_meetings;
CREATE POLICY read_published_state_meetings ON state_meetings
  FOR SELECT USING (is_published = true);

-- Admins can manage (use JWT claims pattern)
DROP POLICY IF EXISTS admin_manage_state_meetings ON state_meetings;
CREATE POLICY admin_manage_state_meetings ON state_meetings
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_state_meetings_updated_at ON state_meetings;
CREATE TRIGGER update_state_meetings_updated_at
  BEFORE UPDATE ON state_meetings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- USER_SAVED_EVENTS TABLE
-- Events explicitly saved by user in MyEvents
-- (distinct from auto-shown calendar events)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_saved_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Reference to source event (one of these will be set)
  school_event_id TEXT REFERENCES school_events(id) ON DELETE CASCADE,
  crna_club_event_id UUID REFERENCES crna_club_events(id) ON DELETE CASCADE,
  state_meeting_id UUID REFERENCES state_meetings(id) ON DELETE CASCADE,

  -- User interaction
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  attended BOOLEAN DEFAULT FALSE,
  attended_at TIMESTAMPTZ,
  notes TEXT,

  -- Unique constraints (can only save each event once)
  UNIQUE(user_id, school_event_id),
  UNIQUE(user_id, crna_club_event_id),
  UNIQUE(user_id, state_meeting_id)
);

CREATE INDEX IF NOT EXISTS idx_user_saved_events_user ON user_saved_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_events_school ON user_saved_events(school_event_id) WHERE school_event_id IS NOT NULL;

ALTER TABLE user_saved_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_own_saved_events ON user_saved_events;
CREATE POLICY user_own_saved_events ON user_saved_events
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- UPDATE user_hidden_events TABLE
-- Add support for hiding state meetings
-- ============================================================
ALTER TABLE user_hidden_events
ADD COLUMN IF NOT EXISTS state_meeting_id UUID REFERENCES state_meetings(id) ON DELETE CASCADE;

-- Add unique constraint for state meetings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_hidden_events_user_id_state_meeting_id_key'
  ) THEN
    ALTER TABLE user_hidden_events
    ADD CONSTRAINT user_hidden_events_user_id_state_meeting_id_key UNIQUE(user_id, state_meeting_id);
  END IF;
END $$;

-- ============================================================
-- FUNCTION: Get calendar events for user
-- Returns all events that should appear on user's calendar
-- ============================================================
CREATE OR REPLACE FUNCTION get_user_calendar_events(p_user_id UUID)
RETURNS TABLE (
  event_id TEXT,
  event_type TEXT,
  title TEXT,
  event_date DATE,
  event_time TIME,
  location TEXT,
  is_virtual BOOLEAN,
  url TEXT,
  source_id TEXT,
  can_hide BOOLEAN,
  can_delete BOOLEAN,
  is_hidden BOOLEAN
) AS $$
BEGIN
  RETURN QUERY

  -- 1. CRNA Club Events (always shown unless hidden)
  SELECT
    'crna_' || ce.id::TEXT as event_id,
    'crna_club'::TEXT as event_type,
    ce.title,
    ce.event_date,
    ce.event_time,
    ce.location,
    ce.is_virtual,
    ce.registration_url as url,
    ce.id::TEXT as source_id,
    TRUE as can_hide,
    FALSE as can_delete,
    EXISTS(SELECT 1 FROM user_hidden_events uhe WHERE uhe.user_id = p_user_id AND uhe.crna_club_event_id = ce.id) as is_hidden
  FROM crna_club_events ce
  WHERE ce.is_published = true
    AND ce.event_date >= CURRENT_DATE

  UNION ALL

  -- 2. Target Program Deadlines (auto-shown for targets)
  SELECT
    'deadline_' || uss.id::TEXT as event_id,
    'deadline'::TEXT as event_type,
    s.name || ' Application Deadline' as title,
    s.application_deadline as event_date,
    '23:59'::TIME as event_time,
    NULL as location,
    FALSE as is_virtual,
    '/my-programs/' || uss.id as url,
    uss.id::TEXT as source_id,
    TRUE as can_hide,
    FALSE as can_delete,
    EXISTS(SELECT 1 FROM user_hidden_events uhe WHERE uhe.user_id = p_user_id AND uhe.target_program_id = uss.id) as is_hidden
  FROM user_saved_schools uss
  JOIN schools s ON s.id = uss.school_id
  WHERE uss.user_id = p_user_id
    AND uss.is_target = true
    AND s.application_deadline IS NOT NULL
    AND s.application_deadline >= CURRENT_DATE

  UNION ALL

  -- 3. School Events (for saved/target programs only)
  SELECT
    'school_' || se.id as event_id,
    'school_event'::TEXT as event_type,
    se.name as title,
    se.event_date,
    se.event_time::TIME as event_time,
    NULL as location,
    se.is_virtual,
    se.registration_url as url,
    se.id as source_id,
    TRUE as can_hide,
    FALSE as can_delete,
    EXISTS(SELECT 1 FROM user_hidden_events uhe WHERE uhe.user_id = p_user_id AND uhe.school_event_id = se.id) as is_hidden
  FROM school_events se
  WHERE se.event_date >= CURRENT_DATE
    AND EXISTS (
      SELECT 1 FROM user_saved_schools uss
      WHERE uss.user_id = p_user_id AND uss.school_id = se.school_id
    )

  UNION ALL

  -- 4. State Meetings (for states with saved/target programs)
  SELECT
    'state_' || sm.id::TEXT as event_id,
    'state_meeting'::TEXT as event_type,
    sm.title,
    sm.event_date,
    sm.event_time,
    sm.city || ', ' || sm.state as location,
    sm.is_virtual,
    sm.registration_url as url,
    sm.id::TEXT as source_id,
    TRUE as can_hide,
    FALSE as can_delete,
    EXISTS(SELECT 1 FROM user_hidden_events uhe WHERE uhe.user_id = p_user_id AND uhe.state_meeting_id = sm.id) as is_hidden
  FROM state_meetings sm
  WHERE sm.is_published = true
    AND sm.event_date >= CURRENT_DATE
    AND EXISTS (
      SELECT 1 FROM user_saved_schools uss
      JOIN schools s ON s.id = uss.school_id
      WHERE uss.user_id = p_user_id AND s.state = sm.state
    )

  UNION ALL

  -- 5. Interview Events (from target programs with interview dates)
  SELECT
    'interview_' || uss.id::TEXT as event_id,
    'interview'::TEXT as event_type,
    s.name || ' Interview' as title,
    uss.interview_date as event_date,
    NULL::TIME as event_time,
    uss.interview_location as location,
    uss.interview_is_virtual as is_virtual,
    '/my-programs/' || uss.id as url,
    uss.id::TEXT as source_id,
    TRUE as can_hide,
    FALSE as can_delete,
    EXISTS(SELECT 1 FROM user_hidden_events uhe WHERE uhe.user_id = p_user_id AND uhe.target_program_id = uss.id) as is_hidden
  FROM user_saved_schools uss
  JOIN schools s ON s.id = uss.school_id
  WHERE uss.user_id = p_user_id
    AND uss.interview_date IS NOT NULL
    AND uss.status IN ('interview_invited', 'interviewed')

  UNION ALL

  -- 6. User Calendar Events (user-created)
  SELECT
    'user_' || uce.id::TEXT as event_id,
    uce.event_type,
    uce.title,
    uce.event_date,
    uce.event_time,
    uce.location,
    uce.is_virtual,
    '#' as url,
    uce.id::TEXT as source_id,
    FALSE as can_hide,
    TRUE as can_delete,
    FALSE as is_hidden
  FROM user_calendar_events uce
  WHERE uce.user_id = p_user_id
    AND uce.status != 'cancelled'

  ORDER BY event_date, event_time NULLS LAST;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCTION: Get programs needing interview date reminders
-- Called by cron job or on page load
-- ============================================================
CREATE OR REPLACE FUNCTION get_interview_date_reminders(p_user_id UUID)
RETURNS TABLE (
  saved_school_id UUID,
  school_name TEXT,
  status TEXT,
  ask_count INTEGER,
  last_asked TIMESTAMPTZ,
  should_show_banner BOOLEAN,
  should_show_toast BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    uss.id as saved_school_id,
    s.name as school_name,
    uss.status,
    uss.interview_date_ask_count as ask_count,
    uss.interview_date_last_asked as last_asked,
    -- Show banner if ask_count < 3 AND last asked > 24 hours ago (or never asked)
    (
      uss.interview_date_ask_count < 3
      AND (
        uss.interview_date_last_asked IS NULL
        OR uss.interview_date_last_asked < NOW() - INTERVAL '24 hours'
      )
    ) as should_show_banner,
    -- Show toast if ask_count >= 3 AND last asked > 7 days ago
    (
      uss.interview_date_ask_count >= 3
      AND uss.interview_date_last_asked < NOW() - INTERVAL '7 days'
    ) as should_show_toast
  FROM user_saved_schools uss
  JOIN schools s ON s.id = uss.school_id
  WHERE uss.user_id = p_user_id
    AND uss.is_target = true
    AND uss.status = 'interview_invited'
    AND uss.interview_date IS NULL
    AND uss.interview_date_unknown = true
    AND uss.interview_date_dismissed = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- COMMENTS
-- ============================================================
COMMENT ON TABLE state_meetings IS 'State AA&A meetings and regional CRNA events';
COMMENT ON TABLE user_saved_events IS 'Events explicitly saved by user in MyEvents';
COMMENT ON FUNCTION get_user_calendar_events IS 'Returns all calendar events for a user including auto-populated and user-created';
COMMENT ON FUNCTION get_interview_date_reminders IS 'Returns target programs that need interview date reminders';
