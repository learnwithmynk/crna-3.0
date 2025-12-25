-- ============================================================
-- ADD ONBOARDING COLUMNS AND PROFILES VIEW
-- Migration: 20251223000000_add_onboarding_columns.sql
--
-- 1. Adds columns required by useOnboardingStatus and useOnboardingSteps hooks
-- 2. Creates profiles view as alias to user_profiles for community queries
-- 3. Creates reactions view as alias to topic_reactions
-- 4. Adds status column to topics table
-- ============================================================

-- ============================================================
-- PART 1: Add onboarding columns to user_guidance_state
-- ============================================================

-- Add onboarding status columns
ALTER TABLE user_guidance_state
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS onboarding_skipped_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS onboarding_data JSONB DEFAULT '{}';

-- Add onboarding steps tracking columns
ALTER TABLE user_guidance_state
ADD COLUMN IF NOT EXISTS completed_onboarding_steps TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS onboarding_widget_dismiss_count INTEGER DEFAULT 0;

-- Add comments for documentation
COMMENT ON COLUMN user_guidance_state.onboarding_completed_at IS 'Timestamp when user completed the onboarding flow';
COMMENT ON COLUMN user_guidance_state.onboarding_skipped_at IS 'Timestamp when user skipped the onboarding flow';
COMMENT ON COLUMN user_guidance_state.onboarding_data IS 'JSONB storage for onboarding questionnaire responses';
COMMENT ON COLUMN user_guidance_state.completed_onboarding_steps IS 'Array of completed onboarding widget step IDs';
COMMENT ON COLUMN user_guidance_state.onboarding_widget_dismiss_count IS 'Number of times user dismissed the onboarding widget';

-- ============================================================
-- PART 2: Create profiles view for community queries
-- ============================================================

-- Create profiles view that maps to user_profiles
-- This allows forum queries to use profiles!topics_author_id_fkey
CREATE OR REPLACE VIEW profiles AS
SELECT
  id,
  email,
  name AS display_name,
  avatar_url,
  level,
  points,
  created_at,
  updated_at
FROM user_profiles;

-- Enable RLS on the view (inherits from base table)
-- Note: Views inherit RLS from base tables in PostgreSQL

-- ============================================================
-- PART 3: Create reactions view as alias to topic_reactions
-- ============================================================

CREATE OR REPLACE VIEW reactions AS
SELECT
  topic_id,
  user_id,
  reaction_type,
  created_at
FROM topic_reactions;

-- ============================================================
-- PART 4: Add status column to topics table
-- ============================================================

-- Add status column if it doesn't exist
ALTER TABLE topics
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';

-- Set status based on deleted_at for existing records
UPDATE topics SET status = CASE
  WHEN deleted_at IS NOT NULL THEN 'deleted'
  WHEN is_hidden = TRUE THEN 'hidden'
  ELSE 'published'
END
WHERE status IS NULL OR status = 'published';

COMMENT ON COLUMN topics.status IS 'Topic status: published, hidden, deleted';
