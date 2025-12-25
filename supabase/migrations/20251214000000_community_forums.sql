-- =============================================
-- COMMUNITY FORUMS SCHEMA
-- Migration: 20251214000000_community_forums.sql
--
-- Custom Supabase community forums (NOT BuddyBoss)
-- Forums only - no Groups feature for MVP
-- =============================================

-- Forums (admin-created via Supabase dashboard)
CREATE TABLE forums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  parent_id UUID REFERENCES forums(id), -- NULL = top-level forum
  sort_order INTEGER DEFAULT 0,
  is_locked BOOLEAN DEFAULT FALSE, -- No new topics allowed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Topics (user-created)
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  forum_id UUID REFERENCES forums(id) NOT NULL,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- HTML from rich text editor
  is_sticky BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE, -- No replies allowed
  is_hidden BOOLEAN DEFAULT FALSE, -- Hidden after reports threshold
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(), -- Updated on new reply

  -- Honeypot (for spam detection)
  honeypot_field TEXT, -- Should always be empty, filled = bot

  -- Soft delete
  deleted_at TIMESTAMPTZ
);

-- Replies (user-created)
CREATE TABLE replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES topics(id) NOT NULL,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  parent_reply_id UUID REFERENCES replies(id), -- For threading
  content TEXT NOT NULL, -- HTML from rich text editor
  is_hidden BOOLEAN DEFAULT FALSE, -- Hidden after reports threshold
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Honeypot
  honeypot_field TEXT,

  -- Soft delete
  deleted_at TIMESTAMPTZ
);

-- Reactions (likes/favorites)
CREATE TABLE topic_reactions (
  topic_id UUID REFERENCES topics(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  reaction_type TEXT DEFAULT 'like', -- 'like', 'love', 'helpful'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (topic_id, user_id)
);

CREATE TABLE reply_reactions (
  reply_id UUID REFERENCES replies(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  reaction_type TEXT DEFAULT 'like',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (reply_id, user_id)
);

-- Reports (for moderation)
CREATE TABLE community_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES auth.users(id) NOT NULL,
  content_type TEXT NOT NULL, -- 'topic' | 'reply'
  content_id UUID NOT NULL, -- topic_id or reply_id
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending' | 'reviewed' | 'dismissed' | 'actioned'
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(reporter_id, content_type, content_id) -- One report per user per content
);

-- User blocks (user-level blocking)
CREATE TABLE user_blocks (
  blocker_id UUID REFERENCES auth.users(id) NOT NULL,
  blocked_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (blocker_id, blocked_id)
);

-- Admin bans/suspensions
CREATE TABLE user_suspensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  suspended_by UUID REFERENCES auth.users(id) NOT NULL,
  reason TEXT NOT NULL,
  suspended_until TIMESTAMPTZ, -- NULL = permanent ban
  created_at TIMESTAMPTZ DEFAULT NOW(),
  lifted_at TIMESTAMPTZ,
  lifted_by UUID REFERENCES auth.users(id)
);

-- Topic subscriptions (for notifications)
CREATE TABLE topic_subscriptions (
  topic_id UUID REFERENCES topics(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (topic_id, user_id)
);

-- In-app notifications
CREATE TABLE community_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT NOT NULL, -- 'reply_to_topic' | 'reply_to_reply' | 'mention' | 'reaction'
  title TEXT NOT NULL,
  message TEXT,
  link TEXT, -- URL to navigate to
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Reference to source
  source_type TEXT, -- 'topic' | 'reply'
  source_id UUID,
  actor_id UUID REFERENCES auth.users(id) -- Who triggered the notification
);

-- Profanity word list (admin-configurable)
CREATE TABLE profanity_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rate limiting tracking
CREATE TABLE user_post_rate (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  topic_count_today INTEGER DEFAULT 0,
  reply_count_today INTEGER DEFAULT 0,
  last_topic_at TIMESTAMPTZ,
  last_reply_at TIMESTAMPTZ,
  last_reset_date DATE DEFAULT CURRENT_DATE
);

-- Spam check cache (StopForumSpam results)
CREATE TABLE spam_check_cache (
  ip_address INET PRIMARY KEY,
  is_spammer BOOLEAN,
  confidence DECIMAL,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_topics_forum_id ON topics(forum_id);
CREATE INDEX idx_topics_author_id ON topics(author_id);
CREATE INDEX idx_topics_last_activity ON topics(last_activity_at DESC);
CREATE INDEX idx_replies_topic_id ON replies(topic_id);
CREATE INDEX idx_replies_author_id ON replies(author_id);
CREATE INDEX idx_reports_status ON community_reports(status);
CREATE INDEX idx_notifications_user_unread ON community_notifications(user_id, is_read);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE forums ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reply_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_suspensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_notifications ENABLE ROW LEVEL SECURITY;

-- Forums: Anyone can read
CREATE POLICY "forums_read" ON forums FOR SELECT USING (true);

-- Topics: Read all non-hidden, non-deleted; write own
CREATE POLICY "topics_read" ON topics FOR SELECT USING (
  deleted_at IS NULL AND
  (is_hidden = FALSE OR author_id = auth.uid())
);
CREATE POLICY "topics_insert" ON topics FOR INSERT WITH CHECK (
  auth.uid() = author_id AND
  NOT EXISTS (SELECT 1 FROM user_suspensions WHERE user_id = auth.uid() AND lifted_at IS NULL AND (suspended_until IS NULL OR suspended_until > NOW()))
);
CREATE POLICY "topics_update_own" ON topics FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "topics_delete_own" ON topics FOR DELETE USING (auth.uid() = author_id);

-- Replies: Similar to topics
CREATE POLICY "replies_read" ON replies FOR SELECT USING (
  deleted_at IS NULL AND
  (is_hidden = FALSE OR author_id = auth.uid())
);
CREATE POLICY "replies_insert" ON replies FOR INSERT WITH CHECK (
  auth.uid() = author_id AND
  NOT EXISTS (SELECT 1 FROM user_suspensions WHERE user_id = auth.uid() AND lifted_at IS NULL AND (suspended_until IS NULL OR suspended_until > NOW()))
);
CREATE POLICY "replies_update_own" ON replies FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "replies_delete_own" ON replies FOR DELETE USING (auth.uid() = author_id);

-- Reactions: Read all, manage own
CREATE POLICY "topic_reactions_read" ON topic_reactions FOR SELECT USING (true);
CREATE POLICY "topic_reactions_manage" ON topic_reactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "reply_reactions_read" ON reply_reactions FOR SELECT USING (true);
CREATE POLICY "reply_reactions_manage" ON reply_reactions FOR ALL USING (auth.uid() = user_id);

-- Reports: Users can create, only see own
CREATE POLICY "reports_insert" ON community_reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "reports_read_own" ON community_reports FOR SELECT USING (auth.uid() = reporter_id);

-- Blocks: Manage own
CREATE POLICY "blocks_manage" ON user_blocks FOR ALL USING (auth.uid() = blocker_id);

-- Subscriptions: Manage own
CREATE POLICY "subscriptions_manage" ON topic_subscriptions FOR ALL USING (auth.uid() = user_id);

-- Notifications: Read/manage own
CREATE POLICY "notifications_own" ON community_notifications FOR ALL USING (auth.uid() = user_id);

-- Admin policies (add to all relevant tables)
CREATE POLICY "admin_all_topics" ON topics FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'
);
CREATE POLICY "admin_all_replies" ON replies FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'
);
CREATE POLICY "admin_all_reports" ON community_reports FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'
);
CREATE POLICY "admin_all_suspensions" ON user_suspensions FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'
);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-update topic last_activity_at on new reply
CREATE OR REPLACE FUNCTION update_topic_last_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE topics SET last_activity_at = NOW() WHERE id = NEW.topic_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_topic_activity
AFTER INSERT ON replies
FOR EACH ROW EXECUTE FUNCTION update_topic_last_activity();

-- Auto-hide content after 3 reports
CREATE OR REPLACE FUNCTION auto_hide_reported_content()
RETURNS TRIGGER AS $$
DECLARE
  report_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO report_count
  FROM community_reports
  WHERE content_type = NEW.content_type AND content_id = NEW.content_id;

  IF report_count >= 3 THEN
    IF NEW.content_type = 'topic' THEN
      UPDATE topics SET is_hidden = TRUE WHERE id = NEW.content_id;
    ELSIF NEW.content_type = 'reply' THEN
      UPDATE replies SET is_hidden = TRUE WHERE id = NEW.content_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_hide_content
AFTER INSERT ON community_reports
FOR EACH ROW EXECUTE FUNCTION auto_hide_reported_content();

-- Rate limiting reset (run daily via cron)
CREATE OR REPLACE FUNCTION reset_daily_post_rates()
RETURNS void AS $$
BEGIN
  UPDATE user_post_rate
  SET topic_count_today = 0,
      reply_count_today = 0,
      last_reset_date = CURRENT_DATE
  WHERE last_reset_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Rate limit check function
CREATE OR REPLACE FUNCTION check_post_rate_limit(p_user_id UUID, p_type TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_rate RECORD;
  v_daily_topic_limit INTEGER := 10;
  v_daily_reply_limit INTEGER := 50;
  v_min_seconds_between_posts INTEGER := 30;
BEGIN
  SELECT * INTO v_rate FROM user_post_rate WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    INSERT INTO user_post_rate (user_id) VALUES (p_user_id);
    RETURN TRUE;
  END IF;

  -- Reset if new day
  IF v_rate.last_reset_date < CURRENT_DATE THEN
    UPDATE user_post_rate SET topic_count_today = 0, reply_count_today = 0, last_reset_date = CURRENT_DATE WHERE user_id = p_user_id;
    v_rate.topic_count_today := 0;
    v_rate.reply_count_today := 0;
  END IF;

  -- Check daily limits
  IF p_type = 'topic' AND v_rate.topic_count_today >= v_daily_topic_limit THEN
    RETURN FALSE;
  END IF;
  IF p_type = 'reply' AND v_rate.reply_count_today >= v_daily_reply_limit THEN
    RETURN FALSE;
  END IF;

  -- Check time between posts
  IF p_type = 'topic' AND v_rate.last_topic_at IS NOT NULL THEN
    IF EXTRACT(EPOCH FROM (NOW() - v_rate.last_topic_at)) < v_min_seconds_between_posts THEN
      RETURN FALSE;
    END IF;
  END IF;
  IF p_type = 'reply' AND v_rate.last_reply_at IS NOT NULL THEN
    IF EXTRACT(EPOCH FROM (NOW() - v_rate.last_reply_at)) < v_min_seconds_between_posts THEN
      RETURN FALSE;
    END IF;
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Increment rate counter
CREATE OR REPLACE FUNCTION increment_post_rate(p_user_id UUID, p_type TEXT)
RETURNS void AS $$
BEGIN
  IF p_type = 'topic' THEN
    UPDATE user_post_rate
    SET topic_count_today = topic_count_today + 1, last_topic_at = NOW()
    WHERE user_id = p_user_id;
  ELSE
    UPDATE user_post_rate
    SET reply_count_today = reply_count_today + 1, last_reply_at = NOW()
    WHERE user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Enable Realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE community_notifications;

-- =============================================
-- SEED DATA: Initial profanity word list
-- =============================================
-- Note: Add your own words as needed via Supabase dashboard
-- This is a minimal starter list
INSERT INTO profanity_words (word) VALUES
  ('spam'),
  ('scam');
