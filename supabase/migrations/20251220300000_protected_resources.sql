-- ============================================================
-- PROTECTED RESOURCES
-- Migration: 20251220300000_protected_resources.sql
--
-- This migration creates a centralized table for managing access
-- control across all pages, features, widgets, and tools.
--
-- Purpose:
--   - Define which pages/features require which entitlements
--   - Configure deny behaviors (upgrade prompt, blur, hide, redirect)
--   - Support hierarchical resources (pages → features → widgets)
--   - Track dismissed warnings per resource
--
-- Related migrations:
--   - 20251210060000_lms_schema.sql (entitlements table)
--   - 20251220200000_user_entitlements_and_roles.sql (user access)
-- ============================================================

-- ============================================================
-- 1. CREATE PROTECTED_RESOURCES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS protected_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  slug TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,

  -- Resource type and hierarchy
  resource_type TEXT NOT NULL CHECK (resource_type IN ('page', 'feature', 'widget', 'tool')),
  parent_slug TEXT REFERENCES protected_resources(slug) ON DELETE CASCADE,
  route_pattern TEXT,  -- For pages: '/dashboard', '/schools/:id'

  -- Access control
  accessible_via TEXT[] DEFAULT '{}',  -- Array of entitlement slugs required
  is_public BOOLEAN DEFAULT FALSE,     -- If true, accessible to everyone (overrides accessible_via)
  is_active BOOLEAN DEFAULT TRUE,      -- If false, resource is disabled

  -- Deny behavior when user lacks access
  deny_behavior TEXT DEFAULT 'upgrade_prompt'
    CHECK (deny_behavior IN ('upgrade_prompt', 'blur', 'hide', 'redirect')),
  redirect_url TEXT,  -- Used when deny_behavior = 'redirect'

  -- Warning system (for dismissible warnings)
  warnings_dismissed TEXT[] DEFAULT '{}',  -- Array of warning types dismissed by user

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. COMMENTS
-- ============================================================

COMMENT ON TABLE protected_resources IS 'Centralized access control for pages, features, widgets, and tools';
COMMENT ON COLUMN protected_resources.slug IS 'Unique identifier (e.g., "dashboard", "school-ai-insights")';
COMMENT ON COLUMN protected_resources.resource_type IS 'Type: page, feature, widget, tool';
COMMENT ON COLUMN protected_resources.parent_slug IS 'Parent resource slug (for hierarchical resources like features within pages)';
COMMENT ON COLUMN protected_resources.route_pattern IS 'URL pattern for pages (e.g., "/dashboard", "/schools/:id")';
COMMENT ON COLUMN protected_resources.accessible_via IS 'Array of entitlement slugs required to access this resource';
COMMENT ON COLUMN protected_resources.is_public IS 'If true, everyone can access (overrides accessible_via)';
COMMENT ON COLUMN protected_resources.deny_behavior IS 'What to show when user lacks access: upgrade_prompt, blur, hide, redirect';
COMMENT ON COLUMN protected_resources.redirect_url IS 'URL to redirect to when deny_behavior = redirect';
COMMENT ON COLUMN protected_resources.warnings_dismissed IS 'Array of warning types dismissed by users (e.g., ["trial-expiring", "incomplete-profile"])';

-- ============================================================
-- 3. INDEXES
-- ============================================================

-- Core lookups
CREATE INDEX IF NOT EXISTS idx_protected_resources_slug ON protected_resources(slug);
CREATE INDEX IF NOT EXISTS idx_protected_resources_type ON protected_resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_protected_resources_parent ON protected_resources(parent_slug);
CREATE INDEX IF NOT EXISTS idx_protected_resources_active ON protected_resources(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_protected_resources_public ON protected_resources(is_public) WHERE is_public = TRUE;

-- Access control queries
CREATE INDEX IF NOT EXISTS idx_protected_resources_accessible_via ON protected_resources USING GIN(accessible_via);

-- Route lookups (for pages)
CREATE INDEX IF NOT EXISTS idx_protected_resources_route ON protected_resources(route_pattern)
  WHERE route_pattern IS NOT NULL;

-- ============================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE protected_resources ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotent migrations)
DROP POLICY IF EXISTS anyone_view_active_resources ON protected_resources;
DROP POLICY IF EXISTS admin_view_all_resources ON protected_resources;
DROP POLICY IF EXISTS admin_manage_resources ON protected_resources;

-- Anyone can view active resources
CREATE POLICY anyone_view_active_resources ON protected_resources
  FOR SELECT USING (is_active = TRUE);

-- Admins can view all resources (including inactive)
CREATE POLICY admin_view_all_resources ON protected_resources
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' OR
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can manage all resources
CREATE POLICY admin_manage_resources ON protected_resources
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' OR
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- 5. TRIGGERS
-- ============================================================

-- Auto-update updated_at timestamp
DROP TRIGGER IF EXISTS update_protected_resources_updated_at ON protected_resources;
CREATE TRIGGER update_protected_resources_updated_at
  BEFORE UPDATE ON protected_resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 6. HELPER FUNCTION: CHECK RESOURCE ACCESS
-- ============================================================

CREATE OR REPLACE FUNCTION user_can_access_resource(
  p_user_id UUID,
  p_resource_slug TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_resource RECORD;
  v_parent RECORD;
BEGIN
  -- Get the resource
  SELECT * INTO v_resource
  FROM protected_resources
  WHERE slug = p_resource_slug AND is_active = TRUE;

  -- Resource not found or inactive
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Public resources are always accessible
  IF v_resource.is_public THEN
    RETURN TRUE;
  END IF;

  -- Admins can access everything
  IF EXISTS (SELECT 1 FROM user_profiles WHERE id = p_user_id AND role = 'admin') THEN
    RETURN TRUE;
  END IF;

  -- Check if resource has parent (hierarchical check)
  IF v_resource.parent_slug IS NOT NULL THEN
    SELECT * INTO v_parent
    FROM protected_resources
    WHERE slug = v_resource.parent_slug AND is_active = TRUE;

    -- Parent must be accessible first
    IF NOT user_can_access_resource(p_user_id, v_resource.parent_slug) THEN
      RETURN FALSE;
    END IF;
  END IF;

  -- Check if user has any of the required entitlements
  IF array_length(v_resource.accessible_via, 1) > 0 THEN
    RETURN user_has_any_entitlement(p_user_id, v_resource.accessible_via);
  END IF;

  -- No entitlements required, allow access
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION user_can_access_resource IS 'Check if user can access a protected resource (handles hierarchy and entitlements)';

-- ============================================================
-- 7. HELPER FUNCTION: GET USER'S ACCESSIBLE RESOURCES
-- ============================================================

CREATE OR REPLACE FUNCTION get_user_accessible_resources(
  p_user_id UUID,
  p_resource_type TEXT DEFAULT NULL
)
RETURNS TABLE (
  slug TEXT,
  display_name TEXT,
  resource_type TEXT,
  route_pattern TEXT,
  parent_slug TEXT,
  deny_behavior TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pr.slug,
    pr.display_name,
    pr.resource_type,
    pr.route_pattern,
    pr.parent_slug,
    pr.deny_behavior
  FROM protected_resources pr
  WHERE pr.is_active = TRUE
    AND (p_resource_type IS NULL OR pr.resource_type = p_resource_type)
    AND user_can_access_resource(p_user_id, pr.slug);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_user_accessible_resources IS 'Get all resources a user can access, optionally filtered by type';

-- ============================================================
-- 8. HELPER FUNCTION: GET RESOURCE ACCESS INFO
-- ============================================================

CREATE OR REPLACE FUNCTION get_resource_access_info(
  p_user_id UUID,
  p_resource_slug TEXT
)
RETURNS TABLE (
  has_access BOOLEAN,
  deny_behavior TEXT,
  redirect_url TEXT,
  required_entitlements TEXT[],
  missing_entitlements TEXT[]
) AS $$
DECLARE
  v_resource RECORD;
  v_has_access BOOLEAN;
  v_user_entitlements TEXT[];
  v_missing TEXT[];
BEGIN
  -- Get resource
  SELECT * INTO v_resource
  FROM protected_resources
  WHERE slug = p_resource_slug AND is_active = TRUE;

  -- Resource not found
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 'hide'::TEXT, NULL::TEXT, '{}'::TEXT[], '{}'::TEXT[];
    RETURN;
  END IF;

  -- Check access
  v_has_access := user_can_access_resource(p_user_id, p_resource_slug);

  -- Get user's entitlements
  SELECT array_agg(entitlement_slug)
  INTO v_user_entitlements
  FROM get_user_entitlements(p_user_id);

  -- Calculate missing entitlements
  IF v_resource.accessible_via IS NOT NULL AND array_length(v_resource.accessible_via, 1) > 0 THEN
    SELECT array_agg(required)
    INTO v_missing
    FROM unnest(v_resource.accessible_via) AS required
    WHERE NOT (required = ANY(v_user_entitlements));
  ELSE
    v_missing := '{}'::TEXT[];
  END IF;

  RETURN QUERY SELECT
    v_has_access,
    v_resource.deny_behavior,
    v_resource.redirect_url,
    v_resource.accessible_via,
    COALESCE(v_missing, '{}'::TEXT[]);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_resource_access_info IS 'Get comprehensive access information for a resource including what entitlements are missing';

-- ============================================================
-- 9. SEED DATA: CORE PAGES
-- ============================================================

INSERT INTO protected_resources (slug, display_name, description, resource_type, route_pattern, accessible_via, is_public) VALUES
  -- Public pages
  ('home', 'Home Page', 'Landing page for all users', 'page', '/', '{}', TRUE),
  ('login', 'Login Page', 'Authentication page', 'page', '/login', '{}', TRUE),
  ('signup', 'Signup Page', 'Registration page', 'page', '/signup', '{}', TRUE),

  -- Member-only pages
  ('dashboard', 'Dashboard', 'Applicant dashboard with overview and nudges', 'page', '/dashboard', ARRAY['active_membership', 'trial_access', 'founding_member'], FALSE),
  ('programs', 'Programs Search', 'Search and compare CRNA programs', 'page', '/programs', ARRAY['active_membership', 'trial_access', 'founding_member'], FALSE),
  ('my-programs', 'My Programs', 'User''s saved programs list', 'page', '/my-programs', ARRAY['active_membership', 'trial_access', 'founding_member'], FALSE),
  ('my-stats', 'My Stats', 'User profile and stats tracking', 'page', '/my-stats', ARRAY['active_membership', 'trial_access', 'founding_member'], FALSE),
  ('trackers', 'Trackers', 'Clinical hours, shadow hours, certifications', 'page', '/trackers', ARRAY['active_membership', 'trial_access', 'founding_member'], FALSE),
  ('marketplace', 'Marketplace', 'Find and book SRNA mentors', 'page', '/marketplace', ARRAY['active_membership', 'trial_access', 'founding_member'], FALSE),
  ('community', 'Community', 'Forums and discussions', 'page', '/community', ARRAY['active_membership', 'trial_access', 'founding_member'], FALSE),
  ('learning', 'Learning', 'Courses and lessons', 'page', '/learning', ARRAY['active_membership', 'trial_access', 'founding_member'], FALSE),

  -- Toolkit pages (one-time purchase)
  ('toolkit-plan-apply', 'Plan+Apply Toolkit', 'Application toolkit and resources', 'page', '/toolkit/plan-apply', ARRAY['plan_apply_toolkit', 'active_membership', 'trial_access', 'founding_member'], FALSE),
  ('toolkit-interviewing', 'Interviewing Toolkit', 'Interview prep toolkit and IOD modules', 'page', '/toolkit/interviewing', ARRAY['interviewing_toolkit', 'active_membership', 'trial_access', 'founding_member'], FALSE)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 10. SEED DATA: PREMIUM FEATURES
-- ============================================================

INSERT INTO protected_resources (slug, display_name, description, resource_type, parent_slug, accessible_via, deny_behavior) VALUES
  -- Dashboard features
  ('school-ai-insights', 'AI School Insights', 'AI-powered school recommendations', 'feature', 'dashboard', ARRAY['active_membership', 'founding_member'], 'upgrade_prompt'),
  ('readyscore', 'ReadyScore', 'Application readiness score', 'feature', 'dashboard', ARRAY['active_membership', 'trial_access', 'founding_member'], 'blur'),

  -- Programs features
  ('school-comparison', 'School Comparison', 'Side-by-side program comparison', 'feature', 'programs', ARRAY['active_membership', 'trial_access', 'founding_member'], 'upgrade_prompt'),
  ('advanced-filters', 'Advanced Filters', 'Filter programs by GPA, location, cost, etc.', 'feature', 'programs', ARRAY['active_membership', 'trial_access', 'founding_member'], 'upgrade_prompt'),

  -- Tools
  ('transcript-analyzer', 'Transcript Analyzer', 'Analyze transcripts and calculate GPA', 'tool', NULL, ARRAY['active_membership', 'trial_access', 'founding_member'], 'upgrade_prompt'),
  ('timeline-generator', 'Timeline Generator', 'Generate personalized application timeline', 'tool', NULL, ARRAY['active_membership', 'trial_access', 'founding_member'], 'upgrade_prompt'),
  ('mock-interview', 'Mock Interview', 'AI-powered interview practice', 'tool', NULL, ARRAY['active_membership', 'founding_member'], 'upgrade_prompt')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 11. VIEW: RESOURCES WITH PARENT INFO
-- ============================================================

CREATE OR REPLACE VIEW protected_resources_with_parent AS
SELECT
  pr.id,
  pr.slug,
  pr.display_name,
  pr.description,
  pr.resource_type,
  pr.route_pattern,
  pr.parent_slug,
  parent.display_name as parent_display_name,
  pr.accessible_via,
  pr.is_public,
  pr.is_active,
  pr.deny_behavior,
  pr.redirect_url,
  pr.created_at,
  pr.updated_at
FROM protected_resources pr
LEFT JOIN protected_resources parent ON parent.slug = pr.parent_slug
WHERE pr.is_active = TRUE;

COMMENT ON VIEW protected_resources_with_parent IS 'Protected resources with parent information for easy querying';

-- ============================================================
-- NOTES FOR DEV TEAM
-- ============================================================
--
-- CHECKING ACCESS:
--   -- Check if user can access a resource
--   SELECT user_can_access_resource('user-uuid', 'school-ai-insights');
--
--   -- Get detailed access info (includes missing entitlements)
--   SELECT * FROM get_resource_access_info('user-uuid', 'school-ai-insights');
--
--   -- Get all accessible resources for a user
--   SELECT * FROM get_user_accessible_resources('user-uuid');
--
--   -- Get only accessible pages
--   SELECT * FROM get_user_accessible_resources('user-uuid', 'page');
--
-- ADDING NEW RESOURCES:
--   -- Add a new feature
--   INSERT INTO protected_resources (
--     slug, display_name, description, resource_type,
--     parent_slug, accessible_via, deny_behavior
--   ) VALUES (
--     'new-feature', 'New Feature', 'Description',
--     'feature', 'parent-page-slug',
--     ARRAY['active_membership'], 'upgrade_prompt'
--   );
--
-- DENY BEHAVIORS:
--   - upgrade_prompt: Show modal prompting user to upgrade
--   - blur: Show blurred/preview version of content
--   - hide: Completely hide the feature/widget
--   - redirect: Redirect to redirect_url
--
-- HIERARCHICAL ACCESS:
--   - If a feature has a parent_slug, the parent must be accessible first
--   - Example: 'school-ai-insights' feature requires 'dashboard' page access
--   - This is handled automatically by user_can_access_resource function
--
-- RESOURCE TYPES:
--   - page: Full page (has route_pattern)
--   - feature: Major feature within a page (has parent_slug)
--   - widget: Small UI component (has parent_slug)
--   - tool: Standalone tool (no parent)
--
-- ============================================================
