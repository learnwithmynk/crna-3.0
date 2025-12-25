-- =============================================
-- PROFANITY WORDS RLS POLICIES
-- Migration: 20251214100000_profanity_words_rls.sql
--
-- Add Row Level Security policies for profanity_words table
-- - Public read access (needed for profanity filter to work)
-- - Admin-only write access
-- =============================================

-- Enable RLS on profanity_words table
ALTER TABLE profanity_words ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read profanity words (needed for filter to work)
CREATE POLICY "profanity_words_read" ON profanity_words
  FOR SELECT
  USING (true);

-- Policy: Only admins can insert profanity words
CREATE POLICY "profanity_words_admin_insert" ON profanity_words
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- Policy: Only admins can update profanity words
CREATE POLICY "profanity_words_admin_update" ON profanity_words
  FOR UPDATE
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- Policy: Only admins can delete profanity words
CREATE POLICY "profanity_words_admin_delete" ON profanity_words
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );
