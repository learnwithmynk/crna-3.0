-- ============================================================
-- WORDPRESS USER MAPPING SCHEMA
-- Migration: 20251213900000_wordpress_mapping.sql
--
-- Tables for syncing existing WordPress users to Supabase
-- This enables the migration of existing CRNA Club members
-- ============================================================

-- ============================================================
-- WORDPRESS_USER_MAPPING TABLE
-- Maps WordPress user IDs to Supabase user IDs
-- ============================================================
CREATE TABLE IF NOT EXISTS wordpress_user_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- WordPress User Info
  wordpress_user_id INTEGER NOT NULL UNIQUE,
  wordpress_email TEXT,
  wordpress_username TEXT,
  wordpress_display_name TEXT,

  -- Supabase User Info
  supabase_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Migration Status
  migration_status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'failed', 'skipped'
  migration_error TEXT,
  migrated_at TIMESTAMPTZ,

  -- WordPress Meta Data (snapshot at migration time)
  wordpress_meta JSONB DEFAULT '{}',

  -- Subscription Info (from WooCommerce)
  woocommerce_subscription_id INTEGER,
  woocommerce_subscription_status TEXT,
  subscription_start_date TIMESTAMPTZ,

  -- Groundhogg Tags (from email system)
  groundhogg_tags TEXT[],

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wp_mapping_wordpress_id ON wordpress_user_mapping(wordpress_user_id);
CREATE INDEX IF NOT EXISTS idx_wp_mapping_supabase_id ON wordpress_user_mapping(supabase_user_id);
CREATE INDEX IF NOT EXISTS idx_wp_mapping_email ON wordpress_user_mapping(wordpress_email);
CREATE INDEX IF NOT EXISTS idx_wp_mapping_status ON wordpress_user_mapping(migration_status);

-- ============================================================
-- WORDPRESS_USER_META_STAGING TABLE
-- Staging table for WordPress user meta during migration
-- ============================================================
CREATE TABLE IF NOT EXISTS wordpress_user_meta_staging (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wordpress_user_id INTEGER NOT NULL,
  meta_key TEXT NOT NULL,
  meta_value TEXT,
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wp_meta_user ON wordpress_user_meta_staging(wordpress_user_id);
CREATE INDEX IF NOT EXISTS idx_wp_meta_key ON wordpress_user_meta_staging(meta_key);
CREATE INDEX IF NOT EXISTS idx_wp_meta_processed ON wordpress_user_meta_staging(processed);

-- ============================================================
-- MIGRATION_LOG TABLE
-- Track migration operations
-- ============================================================
CREATE TABLE IF NOT EXISTS migration_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  migration_type TEXT NOT NULL,          -- 'user', 'subscription', 'gamification', 'tracker_data'
  wordpress_user_id INTEGER,
  supabase_user_id UUID,

  status TEXT DEFAULT 'started',         -- 'started', 'completed', 'failed'
  error_message TEXT,
  details JSONB DEFAULT '{}',

  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_migration_log_type ON migration_log(migration_type);
CREATE INDEX IF NOT EXISTS idx_migration_log_status ON migration_log(status);
CREATE INDEX IF NOT EXISTS idx_migration_log_wp_user ON migration_log(wordpress_user_id);

-- ============================================================
-- WORDPRESS META KEY MAPPING
-- Reference for which WordPress meta keys map to which Supabase fields
-- ============================================================

-- This is a reference comment for the dev team:
-- WordPress User Meta -> Supabase Table.Field
--
-- === Basic Profile ===
-- nickname -> user_profiles.preferred_name
-- display_name -> user_profiles.name
-- profile_photo -> user_profiles.avatar_url
--
-- === Subscription (from WooCommerce) ===
-- membership_level -> user_profiles.subscription_tier
-- membership_status -> user_profiles.subscription_status
--
-- === Gamification (from Gamipress/GamiPlify) ===
-- gamipress_points -> user_profiles.points
-- gamipress_rank -> user_profiles.level
-- gamipress_achievements -> user_badges (array)
--
-- === Academic Profile ===
-- overall_gpa -> user_academic_profiles.overall_gpa
-- science_gpa -> user_academic_profiles.science_gpa
-- gre_quant -> user_academic_profiles.gre_quantitative
-- gre_verbal -> user_academic_profiles.gre_verbal
-- gre_awa -> user_academic_profiles.gre_analytical_writing
-- completed_prereqs -> user_completed_prerequisites (serialized array)
--
-- === Clinical Profile ===
-- primary_icu_type -> user_clinical_profiles.primary_icu_type
-- years_icu_experience -> user_clinical_profiles.total_years_experience
-- certifications -> user_certifications (serialized array)
--
-- === Tracker Data ===
-- clinical_entries -> clinical_entries (separate table, needs migration script)
-- shadow_days -> shadow_days (separate table, needs migration script)
-- eq_reflections -> eq_reflections (separate table, needs migration script)

-- ============================================================
-- FUNCTION: Migrate a single WordPress user
-- Dev team will call this for each user during migration
-- ============================================================
CREATE OR REPLACE FUNCTION migrate_wordpress_user(
  p_wordpress_user_id INTEGER,
  p_email TEXT,
  p_display_name TEXT DEFAULT NULL,
  p_meta JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_supabase_user_id UUID;
  v_mapping_id UUID;
BEGIN
  -- Create log entry
  INSERT INTO migration_log (migration_type, wordpress_user_id, status, details)
  VALUES ('user', p_wordpress_user_id, 'started', p_meta);

  -- Check if user already exists by email
  SELECT id INTO v_supabase_user_id
  FROM auth.users
  WHERE email = p_email;

  -- If user doesn't exist, they need to be created via Supabase Auth
  -- This function just sets up the mapping - actual user creation should happen via API
  IF v_supabase_user_id IS NULL THEN
    -- Create mapping record in pending state
    INSERT INTO wordpress_user_mapping (
      wordpress_user_id,
      wordpress_email,
      wordpress_display_name,
      wordpress_meta,
      migration_status
    ) VALUES (
      p_wordpress_user_id,
      p_email,
      p_display_name,
      p_meta,
      'pending'
    )
    RETURNING id INTO v_mapping_id;

    -- Update log
    UPDATE migration_log
    SET status = 'completed', completed_at = NOW(),
        details = jsonb_set(details, '{note}', '"User needs to be created via Auth API"')
    WHERE wordpress_user_id = p_wordpress_user_id AND status = 'started';

    RETURN NULL;
  END IF;

  -- User exists - create or update mapping
  INSERT INTO wordpress_user_mapping (
    wordpress_user_id,
    wordpress_email,
    wordpress_display_name,
    supabase_user_id,
    wordpress_meta,
    migration_status,
    migrated_at
  ) VALUES (
    p_wordpress_user_id,
    p_email,
    p_display_name,
    v_supabase_user_id,
    p_meta,
    'completed',
    NOW()
  )
  ON CONFLICT (wordpress_user_id) DO UPDATE SET
    supabase_user_id = v_supabase_user_id,
    wordpress_meta = p_meta,
    migration_status = 'completed',
    migrated_at = NOW(),
    updated_at = NOW();

  -- Update log
  UPDATE migration_log
  SET status = 'completed', completed_at = NOW(), supabase_user_id = v_supabase_user_id
  WHERE wordpress_user_id = p_wordpress_user_id AND status = 'started';

  RETURN v_supabase_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCTION: Get migration status summary
-- ============================================================
CREATE OR REPLACE FUNCTION get_migration_summary()
RETURNS TABLE (
  status TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.migration_status,
    COUNT(*)::BIGINT
  FROM wordpress_user_mapping m
  GROUP BY m.migration_status
  ORDER BY m.migration_status;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- FUNCTION: Get users pending migration
-- ============================================================
CREATE OR REPLACE FUNCTION get_pending_migrations(p_limit INTEGER DEFAULT 100)
RETURNS TABLE (
  wordpress_user_id INTEGER,
  wordpress_email TEXT,
  wordpress_display_name TEXT,
  wordpress_meta JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.wordpress_user_id,
    m.wordpress_email,
    m.wordpress_display_name,
    m.wordpress_meta
  FROM wordpress_user_mapping m
  WHERE m.migration_status = 'pending'
  ORDER BY m.created_at
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- GROUNDHOGG_TAG_SYNC TABLE
-- Tracks Groundhogg tag sync state
-- ============================================================
CREATE TABLE IF NOT EXISTS groundhogg_tag_sync (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  wordpress_user_id INTEGER,

  tags TEXT[] DEFAULT '{}',
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),

  -- Derived entitlements from tags
  has_membership BOOLEAN DEFAULT FALSE,
  has_toolkit_access BOOLEAN DEFAULT FALSE,
  is_founding_member BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_groundhogg_user ON groundhogg_tag_sync(user_id);
CREATE INDEX IF NOT EXISTS idx_groundhogg_wp_user ON groundhogg_tag_sync(wordpress_user_id);

ALTER TABLE groundhogg_tag_sync ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_groundhogg ON groundhogg_tag_sync
  FOR SELECT USING (auth.uid() = user_id);

-- Admin can read/write all
CREATE POLICY admin_groundhogg ON groundhogg_tag_sync
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- ============================================================
-- ANALYTICS_EVENTS TABLE
-- For tracking user behavior (referenced in schema.sql)
-- ============================================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics_events(created_at);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Users can insert their own events
CREATE POLICY user_insert_events ON analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only read their own events
CREATE POLICY user_read_own_events ON analytics_events
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can read all events for analytics
CREATE POLICY admin_read_all_events ON analytics_events
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER update_wordpress_user_mapping_updated_at
  BEFORE UPDATE ON wordpress_user_mapping
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groundhogg_tag_sync_updated_at
  BEFORE UPDATE ON groundhogg_tag_sync
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
