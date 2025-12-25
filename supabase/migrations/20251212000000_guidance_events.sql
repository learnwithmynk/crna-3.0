-- Guidance Events Table
-- Tracks user interactions with Next Best Steps for analytics
-- See /docs/skills/guidance-engine-spec.md for context

CREATE TABLE IF NOT EXISTS guidance_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,              -- 'shown', 'dismissed', 'completed'
  step_id TEXT NOT NULL,                 -- Full stepId (e.g., 'continue_program_application_target_001')
  base_step_id TEXT NOT NULL,            -- Aggregatable stepId (e.g., 'continue_program_application')
  application_stage TEXT,                -- User's stage: exploring, strategizing, executing, etc.
  support_mode TEXT,                     -- orientation, strategy, execution, confidence
  position INTEGER,                      -- 1, 2, or 3 (for shown events)
  href TEXT,                             -- Destination URL (for completed events)
  session_id TEXT,                       -- For deduplication within a session
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_guidance_events_user_date
  ON guidance_events(user_id, created_at);

CREATE INDEX IF NOT EXISTS idx_guidance_events_base_step
  ON guidance_events(base_step_id, event_type);

CREATE INDEX IF NOT EXISTS idx_guidance_events_session
  ON guidance_events(session_id);

-- Enable Row Level Security
ALTER TABLE guidance_events ENABLE ROW LEVEL SECURITY;

-- Users can only see their own events
CREATE POLICY "Users can view own guidance events"
  ON guidance_events FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own events
CREATE POLICY "Users can insert own guidance events"
  ON guidance_events FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Comment for documentation
COMMENT ON TABLE guidance_events IS 'Tracks user interactions with Next Best Steps for analytics';
COMMENT ON COLUMN guidance_events.base_step_id IS 'Aggregatable stepId without program suffix';
COMMENT ON COLUMN guidance_events.session_id IS 'Unique session ID for deduplication';
