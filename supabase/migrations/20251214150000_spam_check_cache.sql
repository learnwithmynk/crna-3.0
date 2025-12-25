-- =============================================
-- SPAM CHECK CACHE TABLES
-- Migration: 20251214100000_spam_check_cache.sql
--
-- StopForumSpam API integration for checking new users' first posts
-- =============================================

-- Update spam_check_cache table (already exists in community_forums migration)
-- Add email as primary key instead of ip_address
-- Since we may not always have IP in browser context

DROP TABLE IF EXISTS spam_check_cache;

CREATE TABLE spam_check_cache (
  email TEXT PRIMARY KEY,
  ip_address INET,
  is_spammer BOOLEAN DEFAULT FALSE,
  confidence DECIMAL DEFAULT 0,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flagged users for admin review
CREATE TABLE flagged_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  email TEXT NOT NULL,
  reason TEXT NOT NULL,
  confidence DECIMAL DEFAULT 0,
  reviewed BOOLEAN DEFAULT FALSE,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_spam_cache_checked_at ON spam_check_cache(checked_at);
CREATE INDEX idx_flagged_users_reviewed ON flagged_users(reviewed);
CREATE INDEX idx_flagged_users_user_id ON flagged_users(user_id);
CREATE INDEX idx_flagged_users_created_at ON flagged_users(created_at DESC);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE spam_check_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE flagged_users ENABLE ROW LEVEL SECURITY;

-- spam_check_cache: Only system/service role can access
-- (No user-facing policies - backend only)
CREATE POLICY "spam_cache_service_only" ON spam_check_cache FOR ALL
  USING (auth.role() = 'service_role');

-- flagged_users: Only admins can read/manage
CREATE POLICY "flagged_users_admin_only" ON flagged_users FOR ALL
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Clean up old spam check cache (older than 7 days)
-- Run periodically via cron
CREATE OR REPLACE FUNCTION cleanup_spam_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM spam_check_cache
  WHERE checked_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Get flagged users pending review
CREATE OR REPLACE FUNCTION get_pending_flagged_users()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  email TEXT,
  reason TEXT,
  confidence DECIMAL,
  created_at TIMESTAMPTZ,
  user_name TEXT,
  topic_count BIGINT,
  reply_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    f.id,
    f.user_id,
    f.email,
    f.reason,
    f.confidence,
    f.created_at,
    p.name as user_name,
    (SELECT COUNT(*) FROM topics WHERE author_id = f.user_id AND deleted_at IS NULL) as topic_count,
    (SELECT COUNT(*) FROM replies WHERE author_id = f.user_id AND deleted_at IS NULL) as reply_count
  FROM flagged_users f
  LEFT JOIN user_profiles p ON f.user_id = p.id
  WHERE f.reviewed = FALSE
  ORDER BY f.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Mark flagged user as reviewed
CREATE OR REPLACE FUNCTION mark_flagged_user_reviewed(
  p_flagged_id UUID,
  p_admin_notes TEXT DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  v_admin_id UUID;
BEGIN
  -- Get current admin user
  v_admin_id := auth.uid();

  UPDATE flagged_users
  SET
    reviewed = TRUE,
    reviewed_by = v_admin_id,
    reviewed_at = NOW(),
    admin_notes = p_admin_notes
  WHERE id = p_flagged_id;
END;
$$ LANGUAGE plpgsql;
