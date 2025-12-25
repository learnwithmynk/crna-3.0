-- ============================================================
-- USER ENTITLEMENTS AND ROLES
-- Migration: 20251220200000_user_entitlements_and_roles.sql
--
-- This migration addresses critical gaps for access control:
-- 1. Adds role column to user_profiles (admin, provider, user)
-- 2. Creates user_entitlements junction table
-- 3. Syncs role to auth.users.app_metadata for fast RLS checks
-- 4. Seeds additional entitlements (trial_access, founding_member)
-- ============================================================

-- ============================================================
-- 1. ADD ROLE COLUMN TO USER_PROFILES
-- ============================================================

ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user'
CHECK (role IN ('user', 'admin', 'provider'));

CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

COMMENT ON COLUMN user_profiles.role IS 'User role: user (default), admin (full access), provider (SRNA mentor)';

-- ============================================================
-- 2. CREATE USER_ENTITLEMENTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS user_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign keys
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entitlement_slug TEXT NOT NULL REFERENCES entitlements(slug) ON DELETE CASCADE,

  -- Metadata
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,  -- NULL = never expires

  -- Source tracking
  source TEXT NOT NULL CHECK (source IN ('subscription', 'purchase', 'trial', 'manual', 'promo', 'founding')),
  source_id TEXT,  -- e.g., Stripe subscription ID, order ID, promo code

  -- Admin notes (for manual grants)
  notes TEXT,
  granted_by UUID REFERENCES auth.users(id),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- One entitlement per user (can re-grant with different source)
  UNIQUE(user_id, entitlement_slug)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_user_entitlements_user ON user_entitlements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_entitlements_slug ON user_entitlements(entitlement_slug);
CREATE INDEX IF NOT EXISTS idx_user_entitlements_expires ON user_entitlements(expires_at)
  WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_entitlements_source ON user_entitlements(source);

COMMENT ON TABLE user_entitlements IS 'Junction table linking users to their entitlements (access rights)';
COMMENT ON COLUMN user_entitlements.expires_at IS 'When entitlement expires. NULL = never expires';
COMMENT ON COLUMN user_entitlements.source IS 'How entitlement was granted: subscription, purchase, trial, manual, promo, founding';
COMMENT ON COLUMN user_entitlements.source_id IS 'Reference ID from source system (Stripe sub ID, order ID, etc.)';

-- ============================================================
-- 3. ROW LEVEL SECURITY FOR USER_ENTITLEMENTS
-- ============================================================

ALTER TABLE user_entitlements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotent migrations)
DROP POLICY IF EXISTS user_view_own_entitlements ON user_entitlements;
DROP POLICY IF EXISTS admin_view_all_entitlements ON user_entitlements;
DROP POLICY IF EXISTS admin_manage_entitlements ON user_entitlements;
DROP POLICY IF EXISTS service_manage_entitlements ON user_entitlements;

-- Users can view their own entitlements
CREATE POLICY user_view_own_entitlements ON user_entitlements
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all entitlements
CREATE POLICY admin_view_all_entitlements ON user_entitlements
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' OR
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can manage all entitlements
CREATE POLICY admin_manage_entitlements ON user_entitlements
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' OR
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Service role can manage (for webhooks)
CREATE POLICY service_manage_entitlements ON user_entitlements
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================
-- 4. TRIGGER: SYNC ROLE TO AUTH.USERS.APP_METADATA
-- ============================================================

-- Function to sync role from user_profiles to auth.users.raw_app_meta_data
CREATE OR REPLACE FUNCTION sync_role_to_auth_metadata()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the auth.users table with the new role
  UPDATE auth.users
  SET raw_app_meta_data =
    COALESCE(raw_app_meta_data, '{}'::jsonb) ||
    jsonb_build_object('role', NEW.role)
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on INSERT or UPDATE of role column
DROP TRIGGER IF EXISTS on_user_role_change ON user_profiles;
CREATE TRIGGER on_user_role_change
  AFTER INSERT OR UPDATE OF role ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_role_to_auth_metadata();

COMMENT ON FUNCTION sync_role_to_auth_metadata IS 'Syncs user role to auth.users.raw_app_meta_data for fast JWT-based RLS checks';

-- ============================================================
-- 5. TRIGGER: UPDATE TIMESTAMP ON USER_ENTITLEMENTS
-- ============================================================

DROP TRIGGER IF EXISTS update_user_entitlements_updated_at ON user_entitlements;
CREATE TRIGGER update_user_entitlements_updated_at
  BEFORE UPDATE ON user_entitlements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 6. HELPER FUNCTION: GET USER'S ACTIVE ENTITLEMENTS
-- ============================================================

CREATE OR REPLACE FUNCTION get_user_entitlements(p_user_id UUID)
RETURNS TABLE (
  entitlement_slug TEXT,
  display_name TEXT,
  expires_at TIMESTAMPTZ,
  source TEXT,
  is_expiring_soon BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ue.entitlement_slug,
    e.display_name,
    ue.expires_at,
    ue.source,
    -- Expiring within 7 days
    (ue.expires_at IS NOT NULL AND ue.expires_at < NOW() + INTERVAL '7 days') as is_expiring_soon
  FROM user_entitlements ue
  JOIN entitlements e ON e.slug = ue.entitlement_slug
  WHERE ue.user_id = p_user_id
    AND e.is_active = TRUE
    AND (ue.expires_at IS NULL OR ue.expires_at > NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_user_entitlements IS 'Returns all active (non-expired) entitlements for a user';

-- ============================================================
-- 7. HELPER FUNCTION: CHECK IF USER HAS ENTITLEMENT
-- ============================================================

CREATE OR REPLACE FUNCTION user_has_entitlement(p_user_id UUID, p_entitlement_slug TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_entitlements ue
    JOIN entitlements e ON e.slug = ue.entitlement_slug
    WHERE ue.user_id = p_user_id
      AND ue.entitlement_slug = p_entitlement_slug
      AND e.is_active = TRUE
      AND (ue.expires_at IS NULL OR ue.expires_at > NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION user_has_entitlement IS 'Check if user has a specific active entitlement';

-- ============================================================
-- 8. HELPER FUNCTION: CHECK IF USER HAS ANY OF ENTITLEMENTS
-- ============================================================

CREATE OR REPLACE FUNCTION user_has_any_entitlement(p_user_id UUID, p_entitlement_slugs TEXT[])
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_entitlements ue
    JOIN entitlements e ON e.slug = ue.entitlement_slug
    WHERE ue.user_id = p_user_id
      AND ue.entitlement_slug = ANY(p_entitlement_slugs)
      AND e.is_active = TRUE
      AND (ue.expires_at IS NULL OR ue.expires_at > NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION user_has_any_entitlement IS 'Check if user has ANY of the specified entitlements (OR logic)';

-- ============================================================
-- 9. HELPER FUNCTION: GRANT ENTITLEMENT
-- ============================================================

CREATE OR REPLACE FUNCTION grant_entitlement(
  p_user_id UUID,
  p_entitlement_slug TEXT,
  p_source TEXT,
  p_source_id TEXT DEFAULT NULL,
  p_expires_at TIMESTAMPTZ DEFAULT NULL,
  p_notes TEXT DEFAULT NULL,
  p_granted_by UUID DEFAULT NULL
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT,
  entitlement_id UUID
) AS $$
DECLARE
  v_entitlement_id UUID;
BEGIN
  -- Validate entitlement exists
  IF NOT EXISTS (SELECT 1 FROM entitlements WHERE slug = p_entitlement_slug AND is_active = TRUE) THEN
    RETURN QUERY SELECT FALSE, 'Entitlement not found or inactive: ' || p_entitlement_slug, NULL::UUID;
    RETURN;
  END IF;

  -- Upsert entitlement (update if exists, insert if not)
  INSERT INTO user_entitlements (
    user_id, entitlement_slug, source, source_id, expires_at, notes, granted_by
  ) VALUES (
    p_user_id, p_entitlement_slug, p_source, p_source_id, p_expires_at, p_notes, p_granted_by
  )
  ON CONFLICT (user_id, entitlement_slug) DO UPDATE SET
    source = EXCLUDED.source,
    source_id = EXCLUDED.source_id,
    expires_at = EXCLUDED.expires_at,
    notes = EXCLUDED.notes,
    granted_by = EXCLUDED.granted_by,
    updated_at = NOW()
  RETURNING id INTO v_entitlement_id;

  RETURN QUERY SELECT TRUE, 'Entitlement granted successfully', v_entitlement_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION grant_entitlement IS 'Grant an entitlement to a user. Upserts if already exists.';

-- ============================================================
-- 10. HELPER FUNCTION: REVOKE ENTITLEMENT
-- ============================================================

CREATE OR REPLACE FUNCTION revoke_entitlement(
  p_user_id UUID,
  p_entitlement_slug TEXT
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  DELETE FROM user_entitlements
  WHERE user_id = p_user_id AND entitlement_slug = p_entitlement_slug;

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

  IF v_deleted_count > 0 THEN
    RETURN QUERY SELECT TRUE, 'Entitlement revoked successfully';
  ELSE
    RETURN QUERY SELECT FALSE, 'Entitlement not found for user';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION revoke_entitlement IS 'Revoke an entitlement from a user';

-- ============================================================
-- 11. SEED ADDITIONAL ENTITLEMENTS
-- ============================================================

INSERT INTO entitlements (slug, display_name, description) VALUES
  ('trial_access', 'Trial Access', 'Limited access during 7-day free trial'),
  ('founding_member', 'Founding Member', 'Lifetime access for founding members')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 12. VIEW: USER ENTITLEMENTS WITH DETAILS
-- ============================================================

CREATE OR REPLACE VIEW user_entitlements_view AS
SELECT
  ue.id,
  ue.user_id,
  up.email,
  up.name as user_name,
  ue.entitlement_slug,
  e.display_name as entitlement_name,
  e.description as entitlement_description,
  ue.granted_at,
  ue.expires_at,
  ue.source,
  ue.source_id,
  ue.notes,
  ue.granted_by,
  granter.name as granted_by_name,
  -- Computed fields
  CASE
    WHEN ue.expires_at IS NULL THEN FALSE
    WHEN ue.expires_at < NOW() THEN TRUE
    ELSE FALSE
  END as is_expired,
  CASE
    WHEN ue.expires_at IS NULL THEN FALSE
    WHEN ue.expires_at < NOW() + INTERVAL '7 days' AND ue.expires_at > NOW() THEN TRUE
    ELSE FALSE
  END as is_expiring_soon
FROM user_entitlements ue
JOIN entitlements e ON e.slug = ue.entitlement_slug
JOIN user_profiles up ON up.id = ue.user_id
LEFT JOIN user_profiles granter ON granter.id = ue.granted_by
WHERE e.is_active = TRUE;

COMMENT ON VIEW user_entitlements_view IS 'User entitlements with user details and computed expiry status';

-- ============================================================
-- NOTES FOR DEV TEAM
-- ============================================================
--
-- GRANTING ENTITLEMENTS:
--   -- From Stripe webhook (subscription created)
--   SELECT * FROM grant_entitlement(
--     p_user_id := 'user-uuid',
--     p_entitlement_slug := 'active_membership',
--     p_source := 'subscription',
--     p_source_id := 'sub_xxxxx'
--   );
--
--   -- From one-time purchase
--   SELECT * FROM grant_entitlement(
--     p_user_id := 'user-uuid',
--     p_entitlement_slug := 'plan_apply_toolkit',
--     p_source := 'purchase',
--     p_source_id := 'order_xxxxx'
--   );
--
--   -- Trial with expiry
--   SELECT * FROM grant_entitlement(
--     p_user_id := 'user-uuid',
--     p_entitlement_slug := 'trial_access',
--     p_source := 'trial',
--     p_expires_at := NOW() + INTERVAL '7 days'
--   );
--
--   -- Manual admin grant
--   SELECT * FROM grant_entitlement(
--     p_user_id := 'user-uuid',
--     p_entitlement_slug := 'founding_member',
--     p_source := 'manual',
--     p_notes := 'Founding member - lifetime access',
--     p_granted_by := 'admin-uuid'
--   );
--
-- REVOKING ENTITLEMENTS:
--   SELECT * FROM revoke_entitlement('user-uuid', 'active_membership');
--
-- CHECKING ACCESS:
--   -- Single entitlement
--   SELECT user_has_entitlement('user-uuid', 'active_membership');
--
--   -- Any of multiple entitlements (for accessible_via arrays)
--   SELECT user_has_any_entitlement('user-uuid', ARRAY['active_membership', 'trial_access']);
--
-- GETTING USER'S ENTITLEMENTS:
--   SELECT * FROM get_user_entitlements('user-uuid');
--
-- ADMIN ROLE:
--   -- Set a user as admin
--   UPDATE user_profiles SET role = 'admin' WHERE id = 'user-uuid';
--   -- Trigger automatically syncs to auth.users.raw_app_meta_data
--   -- User must re-login for JWT to include new role
--
-- ============================================================
