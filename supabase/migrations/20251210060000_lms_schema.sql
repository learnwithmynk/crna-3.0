-- ============================================
-- CRNA Club LMS Schema
-- Phase 5.5 - Custom Learning Management System
-- Created: December 9, 2024
-- ============================================
--
-- Tables:
--   1. categories       - Shared categories for modules/lessons/downloads
--   2. entitlements     - Access control levels
--   3. modules          - Top-level learning containers
--   4. sections         - Optional grouping within modules
--   5. lessons          - Individual content pages
--   6. downloads        - Downloadable resources
--   7. user_lesson_progress - User completion tracking
--
-- Features:
--   - Editor.js JSONB content storage
--   - Entitlement-based access control
--   - 3-layer download aggregation (category + manual + exclusions)
--   - Full-text search indexes
--   - RLS policies for security
-- ============================================

-- ============================================
-- 1. CATEGORIES TABLE
-- Shared across modules, lessons, and downloads
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE categories IS 'Shared categories for organizing LMS content (modules, lessons, downloads)';

-- ============================================
-- 2. ENTITLEMENTS TABLE
-- Access control levels for content gating
-- ============================================
CREATE TABLE IF NOT EXISTS entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE entitlements IS 'Access control levels - determines who can access what content';

-- ============================================
-- 3. MODULES TABLE
-- Top-level learning containers (~12 total)
-- ============================================
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,

  -- Ordering
  order_index INTEGER DEFAULT 0,

  -- Access control (array of entitlement slugs)
  accessible_via TEXT[] DEFAULT '{}',

  -- Organization
  category_slugs TEXT[] DEFAULT '{}',

  -- Publishing
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE modules IS 'Top-level learning containers (e.g., "Pharmacology", "Interview Prep")';
COMMENT ON COLUMN modules.accessible_via IS 'Array of entitlement slugs required to access this module';
COMMENT ON COLUMN modules.category_slugs IS 'Array of category slugs for filtering/organization';

-- ============================================
-- 4. SECTIONS TABLE
-- Optional grouping within modules
-- ============================================
CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE sections IS 'Optional grouping of lessons within a module (e.g., "Sedatives" section in Pharmacology)';

-- ============================================
-- 5. LESSONS TABLE
-- Individual content pages (~90 total)
-- ============================================
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  section_id UUID REFERENCES sections(id) ON DELETE SET NULL,

  -- Identity
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,

  -- Video content (Vimeo)
  vimeo_video_id TEXT,
  video_thumbnail_url TEXT,
  video_description TEXT,
  video_duration_seconds INTEGER,

  -- Editor.js content (stored as JSONB)
  content JSONB,

  -- Download resource configuration (3-layer aggregation)
  resource_category_slug TEXT,      -- Auto-populate from this category
  manual_download_ids UUID[],       -- Additional specific downloads
  excluded_download_ids UUID[],     -- Hide these even if category matches

  -- Access control (empty = inherit from module)
  accessible_via TEXT[] DEFAULT '{}',

  -- Organization
  category_slugs TEXT[] DEFAULT '{}',
  order_index INTEGER DEFAULT 0,

  -- Publishing
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),

  -- SEO/Preview
  meta_description TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE lessons IS 'Individual lesson pages with video, Editor.js content, and downloadable resources';
COMMENT ON COLUMN lessons.content IS 'Editor.js JSON content structure';
COMMENT ON COLUMN lessons.resource_category_slug IS 'Category slug for auto-populating downloads';
COMMENT ON COLUMN lessons.manual_download_ids IS 'Additional download IDs to include';
COMMENT ON COLUMN lessons.excluded_download_ids IS 'Download IDs to exclude even if category matches';

-- ============================================
-- 6. DOWNLOADS TABLE
-- Downloadable resources with access control
-- ============================================
CREATE TABLE IF NOT EXISTS downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,

  -- File info (URL-based, typically Google Drive)
  file_url TEXT NOT NULL,
  file_type TEXT,                   -- 'pdf', 'xlsx', 'zip', etc.
  file_size_bytes BIGINT,

  -- Categorization (for auto-populate in lessons)
  category_slugs TEXT[] DEFAULT '{}',

  -- Access control
  is_free BOOLEAN DEFAULT FALSE,
  accessible_via TEXT[] DEFAULT '{}',

  -- WooCommerce product (for "Get Now" button when no access)
  purchase_product_url TEXT,

  -- Reference fields (for VA, no functionality)
  groundhogg_tag TEXT,

  -- Analytics
  download_count INTEGER DEFAULT 0,

  -- Publishing
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE downloads IS 'Downloadable resources (PDFs, spreadsheets, etc.) with entitlement-based access';
COMMENT ON COLUMN downloads.purchase_product_url IS 'WooCommerce product URL shown when user lacks access';

-- ============================================
-- 7. USER_LESSON_PROGRESS TABLE
-- Tracks lesson completion per user
-- ============================================
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,

  -- Progress tracking
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,

  -- Video progress (optional, for resume feature)
  video_progress_seconds INTEGER DEFAULT 0,

  -- Activity tracking
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  access_count INTEGER DEFAULT 1,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, lesson_id)
);

COMMENT ON TABLE user_lesson_progress IS 'Tracks user progress through lessons (completion, video progress)';

-- ============================================
-- INDEXES
-- ============================================

-- Categories
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(order_index);

-- Entitlements
CREATE INDEX IF NOT EXISTS idx_entitlements_slug ON entitlements(slug);
CREATE INDEX IF NOT EXISTS idx_entitlements_active ON entitlements(is_active) WHERE is_active = TRUE;

-- Modules
CREATE INDEX IF NOT EXISTS idx_modules_slug ON modules(slug);
CREATE INDEX IF NOT EXISTS idx_modules_status ON modules(status);
CREATE INDEX IF NOT EXISTS idx_modules_order ON modules(order_index);
CREATE INDEX IF NOT EXISTS idx_modules_categories ON modules USING GIN(category_slugs);
CREATE INDEX IF NOT EXISTS idx_modules_accessible_via ON modules USING GIN(accessible_via);

-- Sections
CREATE INDEX IF NOT EXISTS idx_sections_module ON sections(module_id);
CREATE INDEX IF NOT EXISTS idx_sections_order ON sections(module_id, order_index);

-- Lessons
CREATE INDEX IF NOT EXISTS idx_lessons_slug ON lessons(slug);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_section ON lessons(section_id);
CREATE INDEX IF NOT EXISTS idx_lessons_status ON lessons(status);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_categories ON lessons USING GIN(category_slugs);
CREATE INDEX IF NOT EXISTS idx_lessons_accessible_via ON lessons USING GIN(accessible_via);
CREATE INDEX IF NOT EXISTS idx_lessons_resource_category ON lessons(resource_category_slug);

-- Downloads
CREATE INDEX IF NOT EXISTS idx_downloads_slug ON downloads(slug);
CREATE INDEX IF NOT EXISTS idx_downloads_status ON downloads(status);
CREATE INDEX IF NOT EXISTS idx_downloads_categories ON downloads USING GIN(category_slugs);
CREATE INDEX IF NOT EXISTS idx_downloads_accessible_via ON downloads USING GIN(accessible_via);
CREATE INDEX IF NOT EXISTS idx_downloads_free ON downloads(is_free) WHERE is_free = TRUE;

-- User Progress
CREATE INDEX IF NOT EXISTS idx_progress_user ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson ON user_lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_completed ON user_lesson_progress(user_id, completed) WHERE completed = TRUE;
CREATE INDEX IF NOT EXISTS idx_progress_last_accessed ON user_lesson_progress(user_id, last_accessed_at DESC);

-- ============================================
-- FULL-TEXT SEARCH INDEXES
-- For global search (⌘+K modal)
-- ============================================

-- Modules search
CREATE INDEX IF NOT EXISTS idx_modules_search ON modules
  USING GIN(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));

-- Lessons search
CREATE INDEX IF NOT EXISTS idx_lessons_search ON lessons
  USING GIN(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(video_description, '') || ' ' || coalesce(meta_description, '')));

-- Downloads search
CREATE INDEX IF NOT EXISTS idx_downloads_search ON downloads
  USING GIN(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;

-- CATEGORIES: Public read, admin write
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- ENTITLEMENTS: Public read, admin write
CREATE POLICY "Anyone can view active entitlements" ON entitlements
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage entitlements" ON entitlements
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- MODULES: Public read for published, admin write
CREATE POLICY "Anyone can view published modules" ON modules
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can view all modules" ON modules
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

CREATE POLICY "Admins can manage modules" ON modules
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- SECTIONS: Public read (via module), admin write
CREATE POLICY "Anyone can view sections of published modules" ON sections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM modules m
      WHERE m.id = sections.module_id AND m.status = 'published'
    )
  );

CREATE POLICY "Admins can view all sections" ON sections
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

CREATE POLICY "Admins can manage sections" ON sections
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- LESSONS: Public read for published, admin write
CREATE POLICY "Anyone can view published lessons" ON lessons
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can view all lessons" ON lessons
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

CREATE POLICY "Admins can manage lessons" ON lessons
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- DOWNLOADS: Public read for active, admin write
CREATE POLICY "Anyone can view active downloads" ON downloads
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can view all downloads" ON downloads
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

CREATE POLICY "Admins can manage downloads" ON downloads
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- USER_LESSON_PROGRESS: Users own their data
CREATE POLICY "Users can view own progress" ON user_lesson_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_lesson_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_lesson_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress" ON user_lesson_progress
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- ============================================
-- TRIGGERS
-- ============================================

-- Use existing update_updated_at function from marketplace migration
-- If it doesn't exist, create it
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entitlements_updated_at
  BEFORE UPDATE ON entitlements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at
  BEFORE UPDATE ON modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sections_updated_at
  BEFORE UPDATE ON sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_downloads_updated_at
  BEFORE UPDATE ON downloads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_updated_at
  BEFORE UPDATE ON user_lesson_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count(download_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE downloads
  SET download_count = download_count + 1
  WHERE id = download_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate module progress for a user
CREATE OR REPLACE FUNCTION get_module_progress(p_user_id UUID, p_module_id UUID)
RETURNS TABLE(
  total_lessons INTEGER,
  completed_lessons INTEGER,
  progress_percent DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(l.id)::INTEGER as total_lessons,
    COUNT(ulp.id) FILTER (WHERE ulp.completed = TRUE)::INTEGER as completed_lessons,
    CASE
      WHEN COUNT(l.id) = 0 THEN 0
      ELSE ROUND((COUNT(ulp.id) FILTER (WHERE ulp.completed = TRUE)::DECIMAL / COUNT(l.id)::DECIMAL) * 100, 2)
    END as progress_percent
  FROM lessons l
  LEFT JOIN user_lesson_progress ulp
    ON l.id = ulp.lesson_id AND ulp.user_id = p_user_id
  WHERE l.module_id = p_module_id AND l.status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search LMS content
CREATE OR REPLACE FUNCTION search_lms_content(search_query TEXT, result_limit INTEGER DEFAULT 10)
RETURNS TABLE(
  content_type TEXT,
  id UUID,
  slug TEXT,
  title TEXT,
  description TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  -- Search modules
  SELECT
    'module'::TEXT as content_type,
    m.id,
    m.slug,
    m.title,
    m.description,
    ts_rank(to_tsvector('english', coalesce(m.title, '') || ' ' || coalesce(m.description, '')),
            plainto_tsquery('english', search_query)) as rank
  FROM modules m
  WHERE m.status = 'published'
    AND to_tsvector('english', coalesce(m.title, '') || ' ' || coalesce(m.description, ''))
        @@ plainto_tsquery('english', search_query)

  UNION ALL

  -- Search lessons
  SELECT
    'lesson'::TEXT as content_type,
    l.id,
    l.slug,
    l.title,
    l.video_description as description,
    ts_rank(to_tsvector('english', coalesce(l.title, '') || ' ' || coalesce(l.video_description, '')),
            plainto_tsquery('english', search_query)) as rank
  FROM lessons l
  WHERE l.status = 'published'
    AND to_tsvector('english', coalesce(l.title, '') || ' ' || coalesce(l.video_description, ''))
        @@ plainto_tsquery('english', search_query)

  UNION ALL

  -- Search downloads
  SELECT
    'download'::TEXT as content_type,
    d.id,
    d.slug,
    d.title,
    d.description,
    ts_rank(to_tsvector('english', coalesce(d.title, '') || ' ' || coalesce(d.description, '')),
            plainto_tsquery('english', search_query)) as rank
  FROM downloads d
  WHERE d.status = 'active'
    AND to_tsvector('english', coalesce(d.title, '') || ' ' || coalesce(d.description, ''))
        @@ plainto_tsquery('english', search_query)

  ORDER BY rank DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VIEWS
-- ============================================

-- View: Modules with lesson counts and categories
CREATE OR REPLACE VIEW modules_with_stats AS
SELECT
  m.*,
  COUNT(DISTINCT l.id) FILTER (WHERE l.status = 'published') as lesson_count,
  COUNT(DISTINCT s.id) as section_count,
  array_agg(DISTINCT c.display_name) FILTER (WHERE c.display_name IS NOT NULL) as category_names
FROM modules m
LEFT JOIN lessons l ON l.module_id = m.id
LEFT JOIN sections s ON s.module_id = m.id
LEFT JOIN categories c ON c.slug = ANY(m.category_slugs)
WHERE m.status = 'published'
GROUP BY m.id;

-- View: Lessons with module info
CREATE OR REPLACE VIEW lessons_with_module AS
SELECT
  l.*,
  m.title as module_title,
  m.slug as module_slug,
  s.title as section_title
FROM lessons l
JOIN modules m ON m.id = l.module_id
LEFT JOIN sections s ON s.id = l.section_id
WHERE l.status = 'published' AND m.status = 'published';

-- ============================================
-- SEED DATA
-- ============================================

-- Seed entitlements (matching existing access control system)
INSERT INTO entitlements (slug, display_name, description) VALUES
  ('active_membership', 'Active Members', 'Full platform access for paid members'),
  ('plan_apply_toolkit', 'Plan+Apply Toolkit', 'Access to Plan+Apply course and downloads'),
  ('interviewing_toolkit', 'Interviewing Toolkit', 'Access to Interviewing course and IOD modules')
ON CONFLICT (slug) DO NOTHING;

-- Seed initial categories (common content categories)
INSERT INTO categories (slug, display_name, description, order_index) VALUES
  ('pharmacology', 'Pharmacology', 'Drug knowledge and medication content', 1),
  ('pathophysiology', 'Pathophysiology', 'Disease processes and conditions', 2),
  ('interview-prep', 'Interview Prep', 'Interview preparation materials', 3),
  ('application-prep', 'Application Prep', 'Application and essay materials', 4),
  ('clinical-skills', 'Clinical Skills', 'ICU and clinical experience content', 5),
  ('school-research', 'School Research', 'Program research and comparison', 6),
  ('general', 'General', 'General CRNA journey content', 7)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- STORAGE BUCKET (Supabase Storage)
-- Note: Run this in Supabase Dashboard > Storage
-- ============================================
--
-- CREATE BUCKET: lesson-images
-- - Public: Yes (for serving images in lessons)
-- - Allowed MIME types: image/png, image/jpeg, image/gif, image/webp
-- - Max file size: 5MB
--
-- Policy: Allow authenticated users to upload
-- Policy: Allow public read access
-- ============================================

-- ============================================
-- NOTES FOR DEV TEAM
-- ============================================
--
-- 1. ACCESS CONTROL:
--    - Content gating uses `accessible_via` arrays containing entitlement slugs
--    - Empty array means inherit from parent (lesson → module)
--    - Check user's entitlements against content's accessible_via array
--
-- 2. DOWNLOAD AGGREGATION (3-layer system):
--    - Layer 1: Auto-populate from lesson.resource_category_slug
--    - Layer 2: Add downloads from lesson.manual_download_ids
--    - Layer 3: Remove downloads in lesson.excluded_download_ids
--    - Deduplicate by download ID
--
-- 3. GAMIFICATION:
--    - Award 3 points when marking lesson complete
--    - Call WordPress endpoint: POST /wp-json/gamplify/v1/award-points
--    - Body: { user_id, points: 3, action: 'lesson_complete' }
--
-- 4. SEARCH:
--    - Use search_lms_content() function for unified search
--    - Also query schools table and BuddyBoss API for full platform search
--
-- 5. EDITOR.JS CONTENT:
--    - Stored as JSONB in lessons.content
--    - Structure: { time, blocks: [...], version }
--    - Render with custom EditorRenderer component
--
-- ============================================
