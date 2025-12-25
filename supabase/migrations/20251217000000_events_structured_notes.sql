-- ============================================================
-- EVENTS TRACKER - STRUCTURED NOTES
-- Migration: 20251217000000_events_structured_notes.sql
--
-- Adds structured notes fields to user_events table to support
-- the enhanced Events Tracker form with guided prompts
-- ============================================================

-- Add structured_notes column for guided note prompts
-- Format: {learned, peopleMet, standout, wouldApply, general}
ALTER TABLE user_events
ADD COLUMN IF NOT EXISTS structured_notes JSONB DEFAULT '{}';

-- Add contacts column for parsed contacts from events
-- Format: [{name, role, school, email}]
ALTER TABLE user_events
ADD COLUMN IF NOT EXISTS contacts JSONB DEFAULT '[]';

-- Add talking_points for AI-generated interview prep content
ALTER TABLE user_events
ADD COLUMN IF NOT EXISTS talking_points TEXT;

-- Add category column (missing from original schema)
-- Values: 'aana_state_meeting', 'aana_national_meeting', 'crna_club_event',
--         'open_house', 'info_session', 'networking', 'other'
ALTER TABLE user_events
ADD COLUMN IF NOT EXISTS category TEXT;

-- Add school_name for display purposes (denormalized from schools table)
ALTER TABLE user_events
ADD COLUMN IF NOT EXISTS school_name TEXT;

-- Add index for category filtering
CREATE INDEX IF NOT EXISTS idx_user_events_category ON user_events(category);

-- ============================================================
-- COMMENT: Structured Notes Schema
-- ============================================================
-- The structured_notes JSONB field stores guided prompt responses:
--
-- {
--   "learned": "What I learned about the program/profession...",
--   "peopleMet": "Names and roles of people I connected with...",
--   "standout": "What stood out most / memorable moments...",
--   "wouldApply": "Would I apply? Why or why not? (for program events)",
--   "general": "Additional notes and observations..."
-- }
--
-- The contacts JSONB field stores parsed contact information:
--
-- [
--   {
--     "name": "Dr. Smith",
--     "role": "Program Director",
--     "school": "Georgetown University",
--     "email": "smith@georgetown.edu"
--   }
-- ]
-- ============================================================

-- ============================================================
-- Update event_tracker_stats to include contacts count
-- ============================================================
ALTER TABLE event_tracker_stats
ADD COLUMN IF NOT EXISTS total_contacts INTEGER DEFAULT 0;

-- ============================================================
-- FUNCTION: Update event stats after event insert/update
-- (Enhanced to count contacts)
-- ============================================================
CREATE OR REPLACE FUNCTION update_event_stats()
RETURNS TRIGGER AS $$
DECLARE
  contact_count INTEGER;
BEGIN
  -- Count contacts in the new event
  contact_count := COALESCE(jsonb_array_length(NEW.contacts), 0);

  INSERT INTO event_tracker_stats (user_id, total_saved, total_contacts, last_entry_date, updated_at)
  VALUES (NEW.user_id, 1, contact_count, NEW.date::date, NOW())
  ON CONFLICT (user_id) DO UPDATE SET
    total_saved = event_tracker_stats.total_saved + 1,
    total_contacts = event_tracker_stats.total_contacts + contact_count,
    total_attended = event_tracker_stats.total_attended + (CASE WHEN NEW.attendance_status = 'attended' THEN 1 ELSE 0 END),
    last_entry_date = GREATEST(event_tracker_stats.last_entry_date, NEW.date::date),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists, then recreate
DROP TRIGGER IF EXISTS after_user_event_insert ON user_events;

CREATE TRIGGER after_user_event_insert
  AFTER INSERT ON user_events
  FOR EACH ROW EXECUTE FUNCTION update_event_stats();

-- ============================================================
-- ADD EVENT_LOG POINT ACTION
-- 5 points for logging an event (3/day max, matches other trackers)
-- ============================================================
INSERT INTO point_actions (slug, label, description, base_points, daily_max) VALUES
  ('event_log', 'Log Event Attendance', 'Awarded for logging event attendance (info sessions, open houses, etc.)', 5, 3)
ON CONFLICT (slug) DO NOTHING;
