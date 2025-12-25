-- =============================================
-- ADD LIFTED_NOTES TO USER_SUSPENSIONS
-- Migration: 20251220100000_add_suspension_lifted_notes.sql
--
-- Adds lifted_notes field to track admin notes when lifting suspensions
-- =============================================

ALTER TABLE user_suspensions
ADD COLUMN IF NOT EXISTS lifted_notes TEXT;

COMMENT ON COLUMN user_suspensions.lifted_notes IS 'Admin notes explaining why suspension was lifted early';
