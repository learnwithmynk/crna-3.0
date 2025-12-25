-- ============================================================
-- ACCESS CONTROL SETTINGS AND AUDIT LOG
-- Migration: 20251220400000_access_control_settings.sql
--
-- This migration creates global settings for access control
-- and an audit trail for tracking changes to protected resources.
--
-- Purpose:
--   - Define default access control settings across the platform
--   - Track changes to resource access controls for compliance
--   - Support admin configuration of access defaults
--
-- Related migrations:
--   - 20251220300000_protected_resources.sql (protected resources table)
--   - 20251220200000_user_entitlements_and_roles.sql (user access)
--   - 20251210060000_lms_schema.sql (entitlements table)
-- ============================================================

-- ============================================================
-- 1. CREATE ACCESS_CONTROL_SETTINGS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS access_control_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Setting identifier
  setting_key TEXT UNIQUE NOT NULL,

  -- Setting value (JSONB for flexibility)
  setting_value JSONB NOT NULL,

  -- Metadata
  description TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. COMMENTS
-- ============================================================

COMMENT ON TABLE access_control_settings IS 'Global settings for access control system (defaults, behaviors, thresholds)';
COMMENT ON COLUMN access_control_settings.setting_key IS 'Unique setting identifier (e.g., "default_page_protection")';
COMMENT ON COLUMN access_control_settings.setting_value IS 'JSONB value - can be string, number, array, or object';
COMMENT ON COLUMN access_control_settings.description IS 'Human-readable description of what this setting does';

-- ============================================================
-- 3. CREATE ACCESS_CHANGE_LOG TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS access_change_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Resource identification
  resource_type TEXT NOT NULL CHECK (
    resource_type IN ('protected_resource', 'download', 'module', 'lesson')
  ),
  resource_id UUID NOT NULL,
  resource_slug TEXT,

  -- Change tracking
  action TEXT NOT NULL CHECK (
    action IN ('created', 'updated', 'deleted', 'access_modified', 'behavior_changed')
  ),

  -- Access control changes
  previous_access TEXT[],
  new_access TEXT[],

  -- Behavior changes
  previous_behavior TEXT,
  new_behavior TEXT,

  -- Public status changes
  previous_public BOOLEAN,
  new_public BOOLEAN,

  -- Admin who made the change
  changed_by UUID REFERENCES auth.users(id),

  -- Additional context
  change_reason TEXT,

  -- Timestamp
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. COMMENTS
-- ============================================================

COMMENT ON TABLE access_change_log IS 'Audit trail for all changes to access control settings on resources';
COMMENT ON COLUMN access_change_log.resource_type IS 'Type of resource: protected_resource, download, module, lesson';
COMMENT ON COLUMN access_change_log.resource_id IS 'UUID of the resource that was modified';
COMMENT ON COLUMN access_change_log.resource_slug IS 'Slug of the resource for easier identification';
COMMENT ON COLUMN access_change_log.action IS 'Type of change: created, updated, deleted, access_modified, behavior_changed';
COMMENT ON COLUMN access_change_log.previous_access IS 'Array of entitlement slugs before change';
COMMENT ON COLUMN access_change_log.new_access IS 'Array of entitlement slugs after change';
COMMENT ON COLUMN access_change_log.changed_by IS 'UUID of admin who made the change';

-- ============================================================
-- 5. INDEXES
-- ============================================================

-- Settings
CREATE INDEX IF NOT EXISTS idx_access_settings_key ON access_control_settings(setting_key);

-- Change log
CREATE INDEX IF NOT EXISTS idx_access_log_resource ON access_change_log(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_access_log_slug ON access_change_log(resource_slug);
CREATE INDEX IF NOT EXISTS idx_access_log_time ON access_change_log(changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_access_log_admin ON access_change_log(changed_by);
CREATE INDEX IF NOT EXISTS idx_access_log_action ON access_change_log(action);

-- ============================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE access_control_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_change_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotent migrations)
DROP POLICY IF EXISTS admin_view_settings ON access_control_settings;
DROP POLICY IF EXISTS admin_manage_settings ON access_control_settings;
DROP POLICY IF EXISTS admin_view_change_log ON access_change_log;
DROP POLICY IF EXISTS admin_insert_change_log ON access_change_log;

-- access_control_settings: Admins only
CREATE POLICY admin_view_settings ON access_control_settings
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' OR
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY admin_manage_settings ON access_control_settings
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' OR
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- access_change_log: Admins can view and insert, no one can update/delete
CREATE POLICY admin_view_change_log ON access_change_log
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' OR
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY admin_insert_change_log ON access_change_log
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' OR
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- 7. TRIGGERS
-- ============================================================

-- Auto-update updated_at on settings
DROP TRIGGER IF EXISTS update_access_settings_updated_at ON access_control_settings;
CREATE TRIGGER update_access_settings_updated_at
  BEFORE UPDATE ON access_control_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Log changes to protected_resources
CREATE OR REPLACE FUNCTION log_protected_resource_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log if access-related fields changed
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO access_change_log (
      resource_type,
      resource_id,
      resource_slug,
      action,
      previous_access,
      previous_behavior,
      previous_public,
      changed_by
    ) VALUES (
      'protected_resource',
      OLD.id,
      OLD.slug,
      'deleted',
      OLD.accessible_via,
      OLD.deny_behavior,
      OLD.is_public,
      auth.uid()
    );
    RETURN OLD;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO access_change_log (
      resource_type,
      resource_id,
      resource_slug,
      action,
      new_access,
      new_behavior,
      new_public,
      changed_by
    ) VALUES (
      'protected_resource',
      NEW.id,
      NEW.slug,
      'created',
      NEW.accessible_via,
      NEW.deny_behavior,
      NEW.is_public,
      auth.uid()
    );
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    -- Log if access control fields changed
    IF (OLD.accessible_via IS DISTINCT FROM NEW.accessible_via OR
        OLD.is_public IS DISTINCT FROM NEW.is_public OR
        OLD.deny_behavior IS DISTINCT FROM NEW.deny_behavior) THEN

      -- Determine specific action type
      DECLARE
        v_action TEXT := 'updated';
      BEGIN
        IF OLD.accessible_via IS DISTINCT FROM NEW.accessible_via OR OLD.is_public IS DISTINCT FROM NEW.is_public THEN
          v_action := 'access_modified';
        ELSIF OLD.deny_behavior IS DISTINCT FROM NEW.deny_behavior THEN
          v_action := 'behavior_changed';
        END IF;

        INSERT INTO access_change_log (
          resource_type,
          resource_id,
          resource_slug,
          action,
          previous_access,
          new_access,
          previous_behavior,
          new_behavior,
          previous_public,
          new_public,
          changed_by
        ) VALUES (
          'protected_resource',
          NEW.id,
          NEW.slug,
          v_action,
          OLD.accessible_via,
          NEW.accessible_via,
          OLD.deny_behavior,
          NEW.deny_behavior,
          OLD.is_public,
          NEW.is_public,
          auth.uid()
        );
      END;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_protected_resource_changes ON protected_resources;
CREATE TRIGGER trigger_log_protected_resource_changes
  AFTER INSERT OR UPDATE OR DELETE ON protected_resources
  FOR EACH ROW
  EXECUTE FUNCTION log_protected_resource_changes();

-- Log changes to downloads
CREATE OR REPLACE FUNCTION log_download_access_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    IF (OLD.accessible_via IS DISTINCT FROM NEW.accessible_via OR
        OLD.is_free IS DISTINCT FROM NEW.is_free) THEN
      INSERT INTO access_change_log (
        resource_type,
        resource_id,
        resource_slug,
        action,
        previous_access,
        new_access,
        changed_by
      ) VALUES (
        'download',
        NEW.id,
        NEW.slug,
        'access_modified',
        OLD.accessible_via,
        NEW.accessible_via,
        auth.uid()
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_download_access_changes ON downloads;
CREATE TRIGGER trigger_log_download_access_changes
  AFTER UPDATE ON downloads
  FOR EACH ROW
  EXECUTE FUNCTION log_download_access_changes();

-- Log changes to modules
CREATE OR REPLACE FUNCTION log_module_access_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    IF (OLD.accessible_via IS DISTINCT FROM NEW.accessible_via) THEN
      INSERT INTO access_change_log (
        resource_type,
        resource_id,
        resource_slug,
        action,
        previous_access,
        new_access,
        changed_by
      ) VALUES (
        'module',
        NEW.id,
        NEW.slug,
        'access_modified',
        OLD.accessible_via,
        NEW.accessible_via,
        auth.uid()
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_module_access_changes ON modules;
CREATE TRIGGER trigger_log_module_access_changes
  AFTER UPDATE ON modules
  FOR EACH ROW
  EXECUTE FUNCTION log_module_access_changes();

-- Log changes to lessons
CREATE OR REPLACE FUNCTION log_lesson_access_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    IF (OLD.accessible_via IS DISTINCT FROM NEW.accessible_via) THEN
      INSERT INTO access_change_log (
        resource_type,
        resource_id,
        resource_slug,
        action,
        previous_access,
        new_access,
        changed_by
      ) VALUES (
        'lesson',
        NEW.id,
        NEW.slug,
        'access_modified',
        OLD.accessible_via,
        NEW.accessible_via,
        auth.uid()
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_lesson_access_changes ON lessons;
CREATE TRIGGER trigger_log_lesson_access_changes
  AFTER UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION log_lesson_access_changes();

-- ============================================================
-- 8. HELPER FUNCTION: GET SETTING VALUE
-- ============================================================

CREATE OR REPLACE FUNCTION get_access_setting(p_setting_key TEXT)
RETURNS JSONB AS $$
DECLARE
  v_value JSONB;
BEGIN
  SELECT setting_value INTO v_value
  FROM access_control_settings
  WHERE setting_key = p_setting_key;

  RETURN COALESCE(v_value, 'null'::JSONB);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_access_setting IS 'Retrieve a setting value by key (returns null JSONB if not found)';

-- ============================================================
-- 9. HELPER FUNCTION: UPDATE SETTING VALUE
-- ============================================================

CREATE OR REPLACE FUNCTION update_access_setting(
  p_setting_key TEXT,
  p_setting_value JSONB,
  p_description TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO access_control_settings (setting_key, setting_value, description)
  VALUES (p_setting_key, p_setting_value, p_description)
  ON CONFLICT (setting_key)
  DO UPDATE SET
    setting_value = p_setting_value,
    description = COALESCE(p_description, access_control_settings.description),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION update_access_setting IS 'Create or update an access control setting';

-- ============================================================
-- 10. VIEW: RECENT ACCESS CHANGES
-- ============================================================

CREATE OR REPLACE VIEW recent_access_changes AS
SELECT
  acl.id,
  acl.resource_type,
  acl.resource_slug,
  acl.action,
  acl.previous_access,
  acl.new_access,
  acl.previous_behavior,
  acl.new_behavior,
  acl.changed_at,
  up.email as changed_by_email,
  up.name as changed_by_name
FROM access_change_log acl
LEFT JOIN user_profiles up ON up.id = acl.changed_by
ORDER BY acl.changed_at DESC
LIMIT 100;

COMMENT ON VIEW recent_access_changes IS 'Recent 100 access control changes with admin info';

-- ============================================================
-- 11. SEED DEFAULT SETTINGS
-- ============================================================

INSERT INTO access_control_settings (setting_key, setting_value, description) VALUES
  (
    'default_page_protection',
    '["active_membership"]'::JSONB,
    'Default entitlements required for new pages'
  ),
  (
    'default_feature_protection',
    '["active_membership"]'::JSONB,
    'Default entitlements required for new features'
  ),
  (
    'default_download_protection',
    '["active_membership"]'::JSONB,
    'Default entitlements required for new downloads'
  ),
  (
    'default_module_protection',
    '["active_membership"]'::JSONB,
    'Default entitlements required for new modules'
  ),
  (
    'require_explicit_public',
    'true'::JSONB,
    'Require explicit is_public=true for public resources (security measure)'
  ),
  (
    'default_deny_behavior',
    '"upgrade_prompt"'::JSONB,
    'Default behavior when user lacks access: upgrade_prompt, blur, hide, redirect'
  ),
  (
    'trial_duration_days',
    '7'::JSONB,
    'Default trial duration in days'
  ),
  (
    'allow_multiple_trials',
    'false'::JSONB,
    'Whether users can have multiple trial periods'
  )
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================================
-- NOTES FOR DEV TEAM
-- ============================================================
--
-- RETRIEVING SETTINGS:
--   -- Get a setting value
--   SELECT get_access_setting('default_page_protection');
--
--   -- Get all settings
--   SELECT * FROM access_control_settings;
--
-- UPDATING SETTINGS:
--   -- Update a setting
--   SELECT update_access_setting(
--     'default_page_protection',
--     '["active_membership", "trial_access"]'::JSONB,
--     'Updated default page protection'
--   );
--
-- VIEWING AUDIT TRAIL:
--   -- Recent changes
--   SELECT * FROM recent_access_changes;
--
--   -- Changes to a specific resource
--   SELECT * FROM access_change_log
--   WHERE resource_slug = 'dashboard'
--   ORDER BY changed_at DESC;
--
--   -- Changes by a specific admin
--   SELECT * FROM access_change_log
--   WHERE changed_by = 'admin-uuid'
--   ORDER BY changed_at DESC;
--
-- AUTOMATIC LOGGING:
--   - All changes to protected_resources are automatically logged
--   - Changes to downloads, modules, lessons are logged when access changes
--   - Logs include before/after values for access arrays
--   - Logs track which admin made the change
--
-- SETTING VALUE TYPES:
--   - String: '"value"'::JSONB
--   - Number: '123'::JSONB
--   - Boolean: 'true'::JSONB or 'false'::JSONB
--   - Array: '["item1", "item2"]'::JSONB
--   - Object: '{"key": "value"}'::JSONB
--
-- COMPLIANCE NOTES:
--   - Change log has no UPDATE or DELETE policies (append-only)
--   - All access control changes are permanently recorded
--   - Useful for security audits and compliance requirements
--
-- ============================================================
