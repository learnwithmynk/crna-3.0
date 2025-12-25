-- ============================================================
-- USER CALENDAR EVENTS SCHEMA
-- Migration: 20251214800000_user_calendar_events.sql
--
-- Personal calendar events for dashboard calendar widget
-- Includes: work shifts, shadow days, interviews, other manual events
-- Auto-populated events (deadlines, marketplace, crna_club) are derived
-- ============================================================

-- ============================================================
-- USER_CALENDAR_EVENTS TABLE
-- User-created calendar events (manual entries)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Event Details
  title TEXT NOT NULL,
  description TEXT,

  -- Date/Time
  event_date DATE NOT NULL,
  event_time TIME,                       -- Optional time
  end_time TIME,                         -- Optional end time
  all_day BOOLEAN DEFAULT TRUE,

  -- Event Type
  -- 'work_shift', 'shadow_day', 'interview', 'school_event', 'other'
  -- Note: 'crna_club', 'deadline', 'marketplace' are derived, not stored here
  event_type TEXT NOT NULL DEFAULT 'other',

  -- Location
  location TEXT,
  is_virtual BOOLEAN DEFAULT FALSE,
  virtual_link TEXT,

  -- Related Records (for linking to other tables)
  -- Shadow day reference (if created from calendar for shadow tracker)
  shadow_day_id UUID REFERENCES shadow_days(id) ON DELETE SET NULL,
  -- School/program reference (for school events)
  school_id INTEGER REFERENCES schools(id) ON DELETE SET NULL,
  school_event_id TEXT REFERENCES school_events(id) ON DELETE SET NULL,
  -- Target program reference (for interviews)
  target_program_id UUID,

  -- Status
  status TEXT DEFAULT 'scheduled',       -- 'scheduled', 'completed', 'cancelled'

  -- Recurrence (for work shifts)
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_rule TEXT,                  -- iCal RRULE format (future use)
  recurrence_parent_id UUID REFERENCES user_calendar_events(id) ON DELETE CASCADE,

  -- Notes
  notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_calendar_events_user ON user_calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_date ON user_calendar_events(event_date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_date ON user_calendar_events(user_id, event_date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_type ON user_calendar_events(event_type);
CREATE INDEX IF NOT EXISTS idx_calendar_events_shadow ON user_calendar_events(shadow_day_id) WHERE shadow_day_id IS NOT NULL;

-- RLS
ALTER TABLE user_calendar_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_own_calendar_events ON user_calendar_events;
CREATE POLICY user_own_calendar_events ON user_calendar_events
  FOR ALL USING (auth.uid() = user_id);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_calendar_events_updated_at ON user_calendar_events;
CREATE TRIGGER update_calendar_events_updated_at
  BEFORE UPDATE ON user_calendar_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- CRNA_CLUB_EVENTS TABLE
-- Platform-wide events from CRNA Club (auto-shown to all users)
-- Managed by admins
-- ============================================================
CREATE TABLE IF NOT EXISTS crna_club_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Event Details
  title TEXT NOT NULL,
  description TEXT,

  -- Date/Time
  event_date DATE NOT NULL,
  event_time TIME,
  end_time TIME,
  all_day BOOLEAN DEFAULT FALSE,

  -- Event Category
  -- 'live_qa', 'webinar', 'workshop', 'networking', 'announcement'
  category TEXT DEFAULT 'webinar',

  -- Location
  location TEXT,
  is_virtual BOOLEAN DEFAULT TRUE,
  virtual_link TEXT,
  registration_url TEXT,

  -- Visibility
  is_published BOOLEAN DEFAULT TRUE,
  member_tiers TEXT[] DEFAULT ARRAY['all'], -- 'all', 'premium', 'founding', etc.

  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crna_club_events_date ON crna_club_events(event_date);
CREATE INDEX IF NOT EXISTS idx_crna_club_events_published ON crna_club_events(is_published) WHERE is_published = true;

-- RLS - All authenticated users can read published events
ALTER TABLE crna_club_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS read_published_crna_events ON crna_club_events;
CREATE POLICY read_published_crna_events ON crna_club_events
  FOR SELECT USING (is_published = true);

-- Admins can manage
DROP POLICY IF EXISTS admin_manage_crna_events ON crna_club_events;
CREATE POLICY admin_manage_crna_events ON crna_club_events
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_crna_club_events_updated_at ON crna_club_events;
CREATE TRIGGER update_crna_club_events_updated_at
  BEFORE UPDATE ON crna_club_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- USER_HIDDEN_EVENTS TABLE
-- Track which auto-populated events a user has hidden
-- (CRNA Club events, deadlines they don't want to see)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_hidden_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Reference to hidden event
  -- For CRNA Club events
  crna_club_event_id UUID REFERENCES crna_club_events(id) ON DELETE CASCADE,
  -- For deadline events (target program)
  target_program_id UUID,
  -- For school events
  school_event_id TEXT REFERENCES school_events(id) ON DELETE CASCADE,

  hidden_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, crna_club_event_id),
  UNIQUE(user_id, target_program_id),
  UNIQUE(user_id, school_event_id)
);

CREATE INDEX IF NOT EXISTS idx_hidden_events_user ON user_hidden_events(user_id);

ALTER TABLE user_hidden_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_own_hidden_events ON user_hidden_events;
CREATE POLICY user_own_hidden_events ON user_hidden_events
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- COMMENTS
-- ============================================================
COMMENT ON TABLE user_calendar_events IS 'User-created calendar events (work shifts, shadow days, interviews, etc.)';
COMMENT ON TABLE crna_club_events IS 'Platform-wide CRNA Club events shown to all members';
COMMENT ON TABLE user_hidden_events IS 'Tracks which auto-populated events a user has hidden from their calendar';

COMMENT ON COLUMN user_calendar_events.event_type IS 'work_shift, shadow_day, interview, school_event, other';
COMMENT ON COLUMN user_calendar_events.shadow_day_id IS 'Links to shadow_days table when event triggers shadow day logging';
COMMENT ON COLUMN crna_club_events.member_tiers IS 'Which subscription tiers can see this event';
