-- ============================================================
-- PROMPT STATE SCHEMA
-- Migration: 20251214500000_prompt_state.sql
--
-- Adds prompt_state JSONB column to user_guidance_state for storing:
-- - Tracker nudge dismissals (clinical, EQ, shadow, events)
-- - Smart prompt interactions
-- - Celebration flags
--
-- Rationale: All nudge/prompt state belongs in guidance_state since
-- it's part of the guidance system (alongside next_best_steps,
-- risk_signals, dismissed_steps, etc.)
-- ============================================================

-- Add prompt_state column to user_guidance_state
ALTER TABLE user_guidance_state
ADD COLUMN IF NOT EXISTS prompt_state JSONB DEFAULT '{}';

-- Add comment explaining the structure
COMMENT ON COLUMN user_guidance_state.prompt_state IS 'Stores user prompt/nudge state. Schema:
{
  "tracker_nudges": {
    "clinical_catchup": {
      "dismissCount": number,
      "permanentlyDismissed": boolean,
      "snoozedUntil": ISO string | null
    },
    "eq_reflection": { ... },
    "shadow_reminder": { ... },
    "events_log": { ... }
  },
  "dismissed_prompts": [
    { "promptId": string, "context": string?, "dismissedAt": ISO string, "dismissType": "permanent" | "snooze_7d" | "snooze_30d" }
  ],
  "prompt_interactions": [
    { "promptId": string, "shownAt": ISO string, "action": "completed" | "dismissed" | "snoozed" }
  ],
  "celebrated_events": ["event_id_1", "event_id_2"],
  "last_nudge_shown": { "nudgeId": string, "shownAt": ISO string }
}';

-- Create index for JSONB queries (for analytics and filtering)
CREATE INDEX IF NOT EXISTS idx_user_guidance_state_prompt_state
ON user_guidance_state USING GIN (prompt_state);
