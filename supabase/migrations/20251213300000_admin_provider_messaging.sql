-- ============================================
-- Admin ↔ Provider Messaging System
-- Phase 4.5 - Provider Application Workflow
-- ============================================
--
-- This schema supports:
-- - Enhanced provider application status workflow
-- - Two-way messaging between admins and providers
-- - Notification triggers for Groundhogg integration
-- - Application denial with reapply dates
--
-- Separate from marketplace applicant↔provider messaging.
-- Only admins and providers can participate in these conversations.

-- ============================================
-- 1. EXTEND PROVIDER APPLICATIONS
-- ============================================
-- Add new columns for enhanced workflow

-- Update status constraint to include 'info_needed'
-- First drop the old check constraint if it exists, then add new one
DO $$
BEGIN
  -- Try to alter the column's check constraint
  ALTER TABLE provider_applications DROP CONSTRAINT IF EXISTS provider_applications_status_check;
EXCEPTION WHEN undefined_object THEN
  -- Constraint doesn't exist, continue
  NULL;
END $$;

ALTER TABLE provider_applications
  ADD CONSTRAINT provider_applications_status_check
  CHECK (status IN ('pending', 'approved', 'rejected', 'info_requested', 'denied', 'info_needed'));

-- Add verification status columns
ALTER TABLE provider_applications ADD COLUMN IF NOT EXISTS id_verification_status TEXT DEFAULT 'pending';
ALTER TABLE provider_applications ADD COLUMN IF NOT EXISTS edu_verification_status TEXT DEFAULT 'pending';

-- Add denial handling columns
ALTER TABLE provider_applications ADD COLUMN IF NOT EXISTS denial_reason TEXT;
ALTER TABLE provider_applications ADD COLUMN IF NOT EXISTS can_reapply_at TIMESTAMPTZ;

-- Add info request message column
ALTER TABLE provider_applications ADD COLUMN IF NOT EXISTS info_request_message TEXT;

-- Add Groundhogg tag tracking
ALTER TABLE provider_applications ADD COLUMN IF NOT EXISTS groundhogg_tags TEXT[] DEFAULT ARRAY['srna_provider_applicant'];

-- Add index for submitted_at ordering
CREATE INDEX IF NOT EXISTS idx_provider_applications_submitted ON provider_applications(submitted_at DESC);

-- ============================================
-- 2. ADMIN CONVERSATIONS
-- ============================================
-- Conversation threads between admin and providers
-- Each provider has at most one conversation

CREATE TABLE IF NOT EXISTS admin_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Participants
  provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  application_id UUID REFERENCES provider_applications(id) ON DELETE SET NULL,

  -- Provider info (denormalized for listing)
  provider_name TEXT NOT NULL,
  provider_email TEXT,

  -- Conversation state
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'resolved', 'waiting_response')),

  -- Unread tracking
  unread_by_provider INT DEFAULT 0,
  unread_by_admin INT DEFAULT 0,

  -- Timestamps
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- One conversation per provider
  UNIQUE(provider_id)
);

CREATE INDEX IF NOT EXISTS idx_admin_conversations_status ON admin_conversations(status);
CREATE INDEX IF NOT EXISTS idx_admin_conversations_unread_admin ON admin_conversations(unread_by_admin) WHERE unread_by_admin > 0;
CREATE INDEX IF NOT EXISTS idx_admin_conversations_last_message ON admin_conversations(last_message_at DESC);

-- ============================================
-- 3. ADMIN MESSAGES
-- ============================================
-- Individual messages within admin↔provider conversations

CREATE TABLE IF NOT EXISTS admin_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES admin_conversations(id) ON DELETE CASCADE,

  -- Sender info
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('admin', 'provider')),

  -- Message content
  message_type TEXT NOT NULL DEFAULT 'check_in'
    CHECK (message_type IN (
      'application_update',  -- Approval, denial, status change
      'info_request',        -- Admin needs more info
      'check_in',            -- Admin checking in on provider
      'support',             -- Provider question/issue
      'system'               -- Automated messages
    )),
  content TEXT NOT NULL,

  -- Read tracking
  read_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_messages_conversation ON admin_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_admin_messages_created ON admin_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_messages_unread ON admin_messages(conversation_id, read_at) WHERE read_at IS NULL;

-- ============================================
-- 4. FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update conversation on new message
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE admin_conversations
  SET
    last_message_at = NEW.created_at,
    unread_by_provider = CASE
      WHEN NEW.sender_role = 'admin' THEN unread_by_provider + 1
      ELSE unread_by_provider
    END,
    unread_by_admin = CASE
      WHEN NEW.sender_role = 'provider' THEN unread_by_admin + 1
      ELSE unread_by_admin
    END,
    status = CASE
      WHEN NEW.sender_role = 'admin' AND NEW.message_type = 'info_request' THEN 'waiting_response'
      WHEN NEW.sender_role = 'provider' THEN 'open'
      ELSE status
    END
  WHERE id = NEW.conversation_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_conversation_on_message ON admin_messages;
CREATE TRIGGER trg_update_conversation_on_message
  AFTER INSERT ON admin_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_on_message();

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_read(
  p_conversation_id UUID,
  p_reader_role TEXT
)
RETURNS void AS $$
BEGIN
  -- Mark messages as read
  UPDATE admin_messages
  SET read_at = NOW()
  WHERE conversation_id = p_conversation_id
    AND sender_role != p_reader_role
    AND read_at IS NULL;

  -- Reset unread counter
  IF p_reader_role = 'admin' THEN
    UPDATE admin_conversations
    SET unread_by_admin = 0
    WHERE id = p_conversation_id;
  ELSE
    UPDATE admin_conversations
    SET unread_by_provider = 0
    WHERE id = p_conversation_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE admin_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_messages ENABLE ROW LEVEL SECURITY;

-- Admin Conversations: Admins see all, providers see their own
DROP POLICY IF EXISTS "Admins can manage all conversations" ON admin_conversations;
CREATE POLICY "Admins can manage all conversations"
  ON admin_conversations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

DROP POLICY IF EXISTS "Providers can view own conversations" ON admin_conversations;
CREATE POLICY "Providers can view own conversations"
  ON admin_conversations
  FOR SELECT
  TO authenticated
  USING (
    provider_id IN (
      SELECT id FROM provider_profiles WHERE user_id = auth.uid()
    )
  );

-- Admin Messages: Admins see all, providers see messages in their conversations
DROP POLICY IF EXISTS "Admins can manage all messages" ON admin_messages;
CREATE POLICY "Admins can manage all messages"
  ON admin_messages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

DROP POLICY IF EXISTS "Providers can view messages in own conversations" ON admin_messages;
CREATE POLICY "Providers can view messages in own conversations"
  ON admin_messages
  FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT c.id FROM admin_conversations c
      JOIN provider_profiles p ON c.provider_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Providers can insert messages in own conversations" ON admin_messages;
CREATE POLICY "Providers can insert messages in own conversations"
  ON admin_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    conversation_id IN (
      SELECT c.id FROM admin_conversations c
      JOIN provider_profiles p ON c.provider_id = p.id
      WHERE p.user_id = auth.uid()
    )
    AND sender_role = 'provider'
  );

-- ============================================
-- 6. HELPER VIEWS
-- ============================================

-- View for admin inbox with unread counts
CREATE OR REPLACE VIEW admin_inbox AS
SELECT
  c.id,
  c.provider_id,
  c.provider_name,
  c.provider_email,
  c.application_id,
  c.status,
  c.unread_by_admin,
  c.last_message_at,
  c.created_at,
  a.status AS application_status,
  (
    SELECT content FROM admin_messages m
    WHERE m.conversation_id = c.id
    ORDER BY m.created_at DESC
    LIMIT 1
  ) AS last_message_preview
FROM admin_conversations c
LEFT JOIN provider_applications a ON c.application_id = a.id
ORDER BY c.last_message_at DESC;

-- View for provider inbox
CREATE OR REPLACE VIEW provider_inbox AS
SELECT
  c.id,
  c.provider_id,
  c.status,
  c.unread_by_provider,
  c.last_message_at,
  a.status AS application_status,
  a.info_request_message
FROM admin_conversations c
LEFT JOIN provider_applications a ON c.application_id = a.id;

-- ============================================
-- 7. COMMENTS
-- ============================================

COMMENT ON TABLE admin_conversations IS 'Two-way messaging threads between admins and providers';
COMMENT ON TABLE admin_messages IS 'Individual messages within admin↔provider conversations';

COMMENT ON COLUMN provider_applications.info_request_message IS 'Latest info request message from admin';
COMMENT ON COLUMN provider_applications.groundhogg_tags IS 'Array of Groundhogg CRM tags for email automation';
COMMENT ON COLUMN provider_applications.can_reapply_at IS 'Set to 30 days after denial, NULL otherwise';

COMMENT ON COLUMN admin_messages.message_type IS 'application_update, info_request, check_in, support, or system';
