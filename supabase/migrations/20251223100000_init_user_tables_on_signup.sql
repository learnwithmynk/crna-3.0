-- ============================================================
-- INITIALIZE ALL USER TABLES ON SIGNUP
-- Migration: 20251223100000_init_user_tables_on_signup.sql
--
-- Updates handle_new_user() to create records in all user-related
-- tables on signup, eliminating 406 errors from missing records.
-- ============================================================

-- Drop and recreate the handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user_profiles record
  INSERT INTO user_profiles (id, email, name, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create user_guidance_state record
  INSERT INTO user_guidance_state (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create user_academic_profiles record
  INSERT INTO user_academic_profiles (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create user_clinical_profiles record
  INSERT INTO user_clinical_profiles (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create user_points record
  INSERT INTO user_points (user_id, total_points, current_level)
  VALUES (NEW.id, 0, 1)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- The trigger already exists, just updating the function is sufficient
-- But ensure the trigger exists if not:
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- BACKFILL: Create missing records for existing users
-- This ensures current users also have all required records
-- ============================================================

-- Backfill user_academic_profiles for existing users
INSERT INTO user_academic_profiles (user_id)
SELECT id FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_academic_profiles)
ON CONFLICT (user_id) DO NOTHING;

-- Backfill user_clinical_profiles for existing users
INSERT INTO user_clinical_profiles (user_id)
SELECT id FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_clinical_profiles)
ON CONFLICT (user_id) DO NOTHING;

-- Backfill user_points for existing users
INSERT INTO user_points (user_id, total_points, current_level)
SELECT id, 0, 1 FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_points)
ON CONFLICT (user_id) DO NOTHING;

-- Backfill user_guidance_state for existing users
INSERT INTO user_guidance_state (user_id)
SELECT id FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_guidance_state)
ON CONFLICT (user_id) DO NOTHING;

-- Backfill user_profiles for existing users (should already exist, but just in case)
INSERT INTO user_profiles (id, email, name)
SELECT id, email, COALESCE(raw_user_meta_data->>'name', email)
FROM auth.users
WHERE id NOT IN (SELECT id FROM user_profiles)
ON CONFLICT (id) DO NOTHING;
