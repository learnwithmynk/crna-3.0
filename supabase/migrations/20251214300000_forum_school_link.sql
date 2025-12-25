-- =============================================
-- FORUM-SCHOOL LINK
-- Migration: 20251214300000_forum_school_link.sql
--
-- Links program subforums to schools table via school_id
-- This ensures program name changes don't break forums
-- =============================================

-- Add school_id column to forums table
-- NULL for non-program forums (e.g., "General Discussion", "Interview Prep")
-- Links to schools.id for program-specific subforums
-- Note: We use a trigger for archiving instead of ON DELETE CASCADE
ALTER TABLE forums
ADD COLUMN school_id INTEGER REFERENCES schools(id) ON DELETE SET NULL;

-- =============================================
-- ARCHIVED FORUM CONTENT TABLE
-- Stores forum content when a school is deleted
-- Preserves topics and replies for admin reference
-- =============================================
CREATE TABLE archived_forum_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Original references
  original_forum_id UUID,
  original_school_id INTEGER,
  school_name TEXT NOT NULL,  -- Preserved since school will be deleted

  -- Archive metadata
  archived_at TIMESTAMPTZ DEFAULT NOW(),
  archived_by UUID REFERENCES auth.users(id),
  archive_reason TEXT DEFAULT 'school_deleted',

  -- Aggregated content (JSON for flexibility)
  forum_data JSONB NOT NULL,  -- Forum details
  topics_data JSONB NOT NULL, -- Array of topics with their replies

  -- Stats at time of archival
  topic_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,

  -- For easy searching
  content_preview TEXT  -- First 500 chars of combined content
);

CREATE INDEX idx_archived_forum_school ON archived_forum_content(original_school_id);
CREATE INDEX idx_archived_forum_date ON archived_forum_content(archived_at DESC);

-- Admin-only access to archived content
ALTER TABLE archived_forum_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_archived_content ON archived_forum_content
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- =============================================
-- ARCHIVE FUNCTION: Archive forum before deletion
-- Called by trigger when school is deleted
-- =============================================
CREATE OR REPLACE FUNCTION archive_school_forum()
RETURNS TRIGGER AS $$
DECLARE
  v_forum RECORD;
  v_topics JSONB;
  v_topic_count INTEGER;
  v_reply_count INTEGER;
  v_preview TEXT;
BEGIN
  -- Find the forum linked to this school
  SELECT * INTO v_forum FROM forums WHERE school_id = OLD.id;

  -- If no forum exists, nothing to archive
  IF v_forum.id IS NULL THEN
    RETURN OLD;
  END IF;

  -- Gather all topics with their replies
  SELECT
    COALESCE(jsonb_agg(
      jsonb_build_object(
        'id', t.id,
        'title', t.title,
        'content', t.content,
        'author_id', t.author_id,
        'created_at', t.created_at,
        'is_sticky', t.is_sticky,
        'view_count', t.view_count,
        'replies', (
          SELECT COALESCE(jsonb_agg(
            jsonb_build_object(
              'id', r.id,
              'content', r.content,
              'author_id', r.author_id,
              'created_at', r.created_at,
              'parent_reply_id', r.parent_reply_id
            ) ORDER BY r.created_at
          ), '[]'::jsonb)
          FROM replies r
          WHERE r.topic_id = t.id AND r.deleted_at IS NULL
        )
      ) ORDER BY t.created_at
    ), '[]'::jsonb),
    COUNT(*)
  INTO v_topics, v_topic_count
  FROM topics t
  WHERE t.forum_id = v_forum.id AND t.deleted_at IS NULL;

  -- Count total replies
  SELECT COUNT(*) INTO v_reply_count
  FROM replies r
  JOIN topics t ON r.topic_id = t.id
  WHERE t.forum_id = v_forum.id
    AND r.deleted_at IS NULL
    AND t.deleted_at IS NULL;

  -- Generate preview from first few topics
  SELECT string_agg(title, ' | ') INTO v_preview
  FROM (
    SELECT title FROM topics
    WHERE forum_id = v_forum.id AND deleted_at IS NULL
    ORDER BY created_at DESC LIMIT 5
  ) t;

  -- Insert into archive
  INSERT INTO archived_forum_content (
    original_forum_id,
    original_school_id,
    school_name,
    archive_reason,
    forum_data,
    topics_data,
    topic_count,
    reply_count,
    content_preview
  ) VALUES (
    v_forum.id,
    OLD.id,
    OLD.name,
    'school_deleted',
    jsonb_build_object(
      'id', v_forum.id,
      'title', v_forum.title,
      'description', v_forum.description,
      'slug', v_forum.slug,
      'created_at', v_forum.created_at
    ),
    v_topics,
    v_topic_count,
    v_reply_count,
    LEFT(v_preview, 500)
  );

  -- Now delete the forum (will cascade to topics/replies)
  DELETE FROM forums WHERE id = v_forum.id;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Archive forum content BEFORE school is deleted
CREATE TRIGGER trigger_archive_school_forum
BEFORE DELETE ON schools
FOR EACH ROW EXECUTE FUNCTION archive_school_forum();

-- Index for quick lookups
CREATE INDEX idx_forums_school_id ON forums(school_id) WHERE school_id IS NOT NULL;

-- =============================================
-- VIEW: forums_with_school_info
-- Joins forums with school data for display
-- Program name comes from schools.name, not forums.title
-- =============================================
CREATE OR REPLACE VIEW forums_with_school_info AS
SELECT
  f.id,
  f.slug,
  f.parent_id,
  f.sort_order,
  f.is_locked,
  f.created_at,
  f.updated_at,
  f.school_id,
  -- Use school name if linked, otherwise use forum title
  COALESCE(s.name, f.title) as display_title,
  -- Keep original title for non-school forums
  f.title as original_title,
  -- School details (NULL for non-program forums)
  s.city as school_city,
  s.state as school_state,
  s.degree as school_degree,
  -- Description from forum, could add school description as fallback
  COALESCE(f.description, s.description) as display_description
FROM forums f
LEFT JOIN schools s ON f.school_id = s.id;

-- =============================================
-- HELPER FUNCTION: Create forum for school
-- Automatically creates a subforum linked to a school
-- =============================================
CREATE OR REPLACE FUNCTION create_school_forum(
  p_school_id INTEGER,
  p_parent_forum_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_school_name TEXT;
  v_slug TEXT;
  v_base_slug TEXT;
  v_forum_id UUID;
  v_counter INTEGER := 0;
BEGIN
  -- Get school name
  SELECT name INTO v_school_name FROM schools WHERE id = p_school_id;

  IF v_school_name IS NULL THEN
    RAISE EXCEPTION 'School with ID % not found', p_school_id;
  END IF;

  -- Generate base slug from school name
  v_base_slug := LOWER(REGEXP_REPLACE(v_school_name, '[^a-zA-Z0-9]+', '-', 'g'));
  v_base_slug := TRIM(BOTH '-' FROM v_base_slug);
  v_slug := v_base_slug;

  -- Handle duplicate slugs by appending counter
  WHILE EXISTS (SELECT 1 FROM forums WHERE slug = v_slug) LOOP
    v_counter := v_counter + 1;
    v_slug := v_base_slug || '-' || v_counter;
  END LOOP;

  -- Create forum
  INSERT INTO forums (title, slug, parent_id, school_id, description)
  VALUES (
    v_school_name,  -- Initial title (will be overridden by view)
    v_slug,
    p_parent_forum_id,
    p_school_id,
    'Discussion forum for ' || v_school_name
  )
  RETURNING id INTO v_forum_id;

  RETURN v_forum_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- HELPER FUNCTION: Get forum for school
-- Returns forum ID for a given school, creates if not exists
-- =============================================
CREATE OR REPLACE FUNCTION get_or_create_school_forum(
  p_school_id INTEGER,
  p_parent_forum_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_forum_id UUID;
BEGIN
  -- Check if forum exists
  SELECT id INTO v_forum_id
  FROM forums
  WHERE school_id = p_school_id;

  -- Create if not exists
  IF v_forum_id IS NULL THEN
    v_forum_id := create_school_forum(p_school_id, p_parent_forum_id);
  END IF;

  RETURN v_forum_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- AUTO-CREATE TRIGGER: New school → New subforum
-- When a school is added, automatically create its forum
-- =============================================
CREATE OR REPLACE FUNCTION auto_create_school_forum()
RETURNS TRIGGER AS $$
DECLARE
  v_programs_forum_id UUID;
BEGIN
  -- Find the "CRNA Programs" parent forum by slug
  SELECT id INTO v_programs_forum_id
  FROM forums
  WHERE slug = 'crna-programs' AND parent_id IS NULL;

  -- If parent forum exists, create subforum for new school
  IF v_programs_forum_id IS NOT NULL THEN
    PERFORM create_school_forum(NEW.id, v_programs_forum_id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-create forum when school is inserted
CREATE TRIGGER trigger_auto_create_school_forum
AFTER INSERT ON schools
FOR EACH ROW EXECUTE FUNCTION auto_create_school_forum();

-- =============================================
-- ONE-TIME SETUP: Create "CRNA Programs" parent forum
-- This is the parent forum for all school subforums
-- =============================================
INSERT INTO forums (title, slug, description, sort_order)
VALUES (
  'CRNA Programs',
  'crna-programs',
  'Discuss specific CRNA programs, share experiences, and get insider tips from current students and graduates.',
  1
)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- ONE-TIME SEED: Create subforums for ALL existing schools
-- This populates forums for all ~140 existing programs
-- =============================================
DO $$
DECLARE
  v_programs_forum_id UUID;
  v_school RECORD;
  v_existing_forum UUID;
BEGIN
  -- Get the CRNA Programs parent forum ID
  SELECT id INTO v_programs_forum_id
  FROM forums
  WHERE slug = 'crna-programs' AND parent_id IS NULL;

  IF v_programs_forum_id IS NULL THEN
    RAISE NOTICE 'CRNA Programs forum not found, skipping school forum creation';
    RETURN;
  END IF;

  -- Loop through all schools and create forums
  FOR v_school IN SELECT id, name FROM schools ORDER BY name
  LOOP
    -- Check if forum already exists for this school
    SELECT id INTO v_existing_forum FROM forums WHERE school_id = v_school.id;

    -- Only create if doesn't exist
    IF v_existing_forum IS NULL THEN
      PERFORM create_school_forum(v_school.id, v_programs_forum_id);
      RAISE NOTICE 'Created forum for school: %', v_school.name;
    ELSE
      RAISE NOTICE 'Forum already exists for school: %', v_school.name;
    END IF;
  END LOOP;

  RAISE NOTICE 'Completed creating school forums';
END;
$$;

-- =============================================
-- COMMENT: Usage pattern
-- =============================================
--
-- In your React app, when displaying forums:
-- 1. Query forums_with_school_info view instead of forums table
-- 2. display_title will always be the current school name
--
-- When linking from school profile to forum:
-- 1. Query: SELECT id FROM forums WHERE school_id = :school_id
-- 2. Or use the URL pattern: /community/forums/school/:school_id
--
-- When creating a new program subforum manually:
-- 1. SELECT get_or_create_school_forum(school_id, parent_forum_id)
--
-- Auto-creation:
-- - New schools automatically get a subforum via trigger
-- - Existing schools got subforums via the one-time seed above
--
