-- =============================================
-- NOTIFICATION TRIGGERS FOR COMMUNITY FORUMS
-- Migration: 20251214200000_notification_triggers.sql
--
-- Automatically create notifications for:
-- 1. Reply to topic → notify topic author
-- 2. Reply to reply → notify parent reply author
-- 3. Reaction added → notify content author
--
-- Note: @mention notifications should be created by
-- the application when posting (requires parsing HTML content)
-- =============================================

-- =============================================
-- FUNCTION: Create notification for topic reply
-- =============================================
CREATE OR REPLACE FUNCTION notify_topic_reply()
RETURNS TRIGGER AS $$
DECLARE
  v_topic RECORD;
  v_author_name TEXT;
BEGIN
  -- Get topic details
  SELECT * INTO v_topic FROM topics WHERE id = NEW.topic_id;

  -- Don't notify if replying to own topic
  IF v_topic.author_id = NEW.author_id THEN
    RETURN NEW;
  END IF;

  -- Get reply author's name
  SELECT COALESCE(
    user_metadata->>'display_name',
    user_metadata->>'full_name',
    email
  ) INTO v_author_name
  FROM auth.users
  WHERE id = NEW.author_id;

  -- Create notification
  INSERT INTO community_notifications (
    user_id,
    type,
    title,
    message,
    link,
    source_type,
    source_id,
    actor_id
  ) VALUES (
    v_topic.author_id,
    'topic_reply',
    'New reply in "' || v_topic.title || '"',
    v_author_name || ' replied to your topic',
    '/community/topics/' || v_topic.id || '#reply-' || NEW.id,
    'reply',
    NEW.id,
    NEW.author_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for topic replies
DROP TRIGGER IF EXISTS trigger_notify_topic_reply ON replies;
CREATE TRIGGER trigger_notify_topic_reply
AFTER INSERT ON replies
FOR EACH ROW
WHEN (NEW.parent_reply_id IS NULL) -- Only for direct topic replies, not nested replies
EXECUTE FUNCTION notify_topic_reply();

-- =============================================
-- FUNCTION: Create notification for reply to reply
-- =============================================
CREATE OR REPLACE FUNCTION notify_reply_to_reply()
RETURNS TRIGGER AS $$
DECLARE
  v_parent_reply RECORD;
  v_topic RECORD;
  v_author_name TEXT;
BEGIN
  -- Only process if this is a reply to another reply
  IF NEW.parent_reply_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Get parent reply details
  SELECT * INTO v_parent_reply FROM replies WHERE id = NEW.parent_reply_id;

  -- Don't notify if replying to own reply
  IF v_parent_reply.author_id = NEW.author_id THEN
    RETURN NEW;
  END IF;

  -- Get topic details for link
  SELECT * INTO v_topic FROM topics WHERE id = NEW.topic_id;

  -- Get reply author's name
  SELECT COALESCE(
    user_metadata->>'display_name',
    user_metadata->>'full_name',
    email
  ) INTO v_author_name
  FROM auth.users
  WHERE id = NEW.author_id;

  -- Create notification
  INSERT INTO community_notifications (
    user_id,
    type,
    title,
    message,
    link,
    source_type,
    source_id,
    actor_id
  ) VALUES (
    v_parent_reply.author_id,
    'reply_to_reply',
    'Reply to your comment',
    v_author_name || ' responded to your comment in "' || v_topic.title || '"',
    '/community/topics/' || v_topic.id || '#reply-' || NEW.id,
    'reply',
    NEW.id,
    NEW.author_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for nested replies
DROP TRIGGER IF EXISTS trigger_notify_reply_to_reply ON replies;
CREATE TRIGGER trigger_notify_reply_to_reply
AFTER INSERT ON replies
FOR EACH ROW
WHEN (NEW.parent_reply_id IS NOT NULL) -- Only for nested replies
EXECUTE FUNCTION notify_reply_to_reply();

-- =============================================
-- FUNCTION: Create notification for topic reaction
-- =============================================
CREATE OR REPLACE FUNCTION notify_topic_reaction()
RETURNS TRIGGER AS $$
DECLARE
  v_topic RECORD;
  v_author_name TEXT;
BEGIN
  -- Get topic details
  SELECT * INTO v_topic FROM topics WHERE id = NEW.topic_id;

  -- Don't notify if reacting to own topic
  IF v_topic.author_id = NEW.user_id THEN
    RETURN NEW;
  END IF;

  -- Get reactor's name
  SELECT COALESCE(
    user_metadata->>'display_name',
    user_metadata->>'full_name',
    email
  ) INTO v_author_name
  FROM auth.users
  WHERE id = NEW.user_id;

  -- Create notification
  INSERT INTO community_notifications (
    user_id,
    type,
    title,
    message,
    link,
    source_type,
    source_id,
    actor_id
  ) VALUES (
    v_topic.author_id,
    'reaction_received',
    'Someone ' || NEW.reaction_type || 'd your post',
    v_author_name || ' ' || NEW.reaction_type || 'd your topic "' || v_topic.title || '"',
    '/community/topics/' || v_topic.id,
    'topic',
    v_topic.id,
    NEW.user_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for topic reactions
DROP TRIGGER IF EXISTS trigger_notify_topic_reaction ON topic_reactions;
CREATE TRIGGER trigger_notify_topic_reaction
AFTER INSERT ON topic_reactions
FOR EACH ROW
EXECUTE FUNCTION notify_topic_reaction();

-- =============================================
-- FUNCTION: Create notification for reply reaction
-- =============================================
CREATE OR REPLACE FUNCTION notify_reply_reaction()
RETURNS TRIGGER AS $$
DECLARE
  v_reply RECORD;
  v_topic RECORD;
  v_author_name TEXT;
BEGIN
  -- Get reply details
  SELECT * INTO v_reply FROM replies WHERE id = NEW.reply_id;

  -- Don't notify if reacting to own reply
  IF v_reply.author_id = NEW.user_id THEN
    RETURN NEW;
  END IF;

  -- Get topic details for link
  SELECT * INTO v_topic FROM topics WHERE id = v_reply.topic_id;

  -- Get reactor's name
  SELECT COALESCE(
    user_metadata->>'display_name',
    user_metadata->>'full_name',
    email
  ) INTO v_author_name
  FROM auth.users
  WHERE id = NEW.user_id;

  -- Create notification
  INSERT INTO community_notifications (
    user_id,
    type,
    title,
    message,
    link,
    source_type,
    source_id,
    actor_id
  ) VALUES (
    v_reply.author_id,
    'reaction_received',
    'Someone ' || NEW.reaction_type || 'd your reply',
    v_author_name || ' ' || NEW.reaction_type || 'd your reply in "' || v_topic.title || '"',
    '/community/topics/' || v_topic.id || '#reply-' || v_reply.id,
    'reply',
    v_reply.id,
    NEW.user_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for reply reactions
DROP TRIGGER IF EXISTS trigger_notify_reply_reaction ON reply_reactions;
CREATE TRIGGER trigger_notify_reply_reaction
AFTER INSERT ON reply_reactions
FOR EACH ROW
EXECUTE FUNCTION notify_reply_reaction();

-- =============================================
-- HELPER FUNCTION: Create @mention notification
-- (Called by application, not triggered automatically)
-- =============================================
CREATE OR REPLACE FUNCTION create_mention_notification(
  p_mentioned_user_id UUID,
  p_mentioner_id UUID,
  p_topic_id UUID,
  p_reply_id UUID DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  v_topic RECORD;
  v_mentioner_name TEXT;
BEGIN
  -- Don't create notification if mentioning yourself
  IF p_mentioned_user_id = p_mentioner_id THEN
    RETURN;
  END IF;

  -- Get topic details
  SELECT * INTO v_topic FROM topics WHERE id = p_topic_id;

  -- Get mentioner's name
  SELECT COALESCE(
    user_metadata->>'display_name',
    user_metadata->>'full_name',
    email
  ) INTO v_mentioner_name
  FROM auth.users
  WHERE id = p_mentioner_id;

  -- Create notification
  INSERT INTO community_notifications (
    user_id,
    type,
    title,
    message,
    link,
    source_type,
    source_id,
    actor_id
  ) VALUES (
    p_mentioned_user_id,
    'mentioned',
    'You were mentioned',
    v_mentioner_name || ' mentioned you in "' || v_topic.title || '"',
    '/community/topics/' || p_topic_id || CASE WHEN p_reply_id IS NOT NULL THEN '#reply-' || p_reply_id ELSE '' END,
    CASE WHEN p_reply_id IS NOT NULL THEN 'reply' ELSE 'topic' END,
    COALESCE(p_reply_id, p_topic_id),
    p_mentioner_id
  );
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- COMMENTS
-- =============================================
-- Usage for @mention notifications in application:
-- When posting a topic or reply, parse the content for @mentions
-- and call create_mention_notification() for each mentioned user.
--
-- Example:
-- SELECT create_mention_notification(
--   'user-id-who-was-mentioned',
--   auth.uid(), -- current user
--   'topic-id',
--   'reply-id' -- optional, NULL if mention is in topic
-- );
