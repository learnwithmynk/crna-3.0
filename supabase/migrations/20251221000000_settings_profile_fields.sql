-- ============================================================
-- SETTINGS PROFILE FIELDS
-- Migration: 20251221000000_settings_profile_fields.sql
--
-- Adds explicit name fields for Settings page:
-- - first_name: Used for internal personalization (e.g., "Hey Sarah!")
-- - last_name: User's last name
-- - display_name: Public name shown in forums, comments, marketplace
-- ============================================================

-- Add name fields to user_profiles
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Add comment for documentation
COMMENT ON COLUMN user_profiles.first_name IS 'Used for internal personalization (e.g., dashboard greeting)';
COMMENT ON COLUMN user_profiles.last_name IS 'User last name';
COMMENT ON COLUMN user_profiles.display_name IS 'Public name shown in forums, comments, and marketplace';

-- Note: Password is handled by Supabase Auth (auth.users table)
-- Note: Subscription fields already exist (subscription_tier, subscription_status, stripe_customer_id)
