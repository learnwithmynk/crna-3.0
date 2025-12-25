-- ============================================
-- CRNA Club Marketplace Schema
-- Phase 3.0.2 - Database Setup
-- ============================================

-- 1. USER ID MAPPING (Supabase <-> WordPress)
-- Links Supabase auth users to WordPress user IDs for data sync
CREATE TABLE user_id_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supabase_uid UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wordpress_user_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(supabase_uid),
  UNIQUE(wordpress_user_id)
);

CREATE INDEX idx_user_id_mapping_wp ON user_id_mapping(wordpress_user_id);

-- 2. PROVIDER PROFILES
-- SRNA mentors who offer services in the marketplace
CREATE TABLE provider_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic Info
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,

  -- SRNA Program Info
  program_name TEXT,
  program_year INT, -- 1, 2, or 3

  -- Status
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'suspended'
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),

  -- Stripe Connect
  stripe_account_id TEXT,
  stripe_onboarding_complete BOOLEAN DEFAULT FALSE,

  -- Cal.com Integration
  cal_com_user_id TEXT,
  cal_com_access_token TEXT,
  cal_com_refresh_token TEXT,
  cal_com_token_expires_at TIMESTAMPTZ,
  cal_com_connected_at TIMESTAMPTZ,

  -- Availability
  availability_status TEXT DEFAULT 'available', -- 'available', 'limited', 'unavailable'
  timezone TEXT DEFAULT 'America/New_York',

  -- Stats (denormalized for performance)
  total_bookings INT DEFAULT 0,
  average_rating DECIMAL(3,2),
  response_time_hours DECIMAL(5,2),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE INDEX idx_provider_profiles_status ON provider_profiles(status);
CREATE INDEX idx_provider_profiles_stripe ON provider_profiles(stripe_account_id);

-- 3. SERVICES
-- Service offerings by providers
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,

  -- Service Details
  type TEXT NOT NULL, -- 'mock_interview', 'essay_review', 'resume_review', 'strategy_session', 'school_qa'
  title TEXT NOT NULL,
  description TEXT,

  -- Pricing & Duration
  price_cents INT NOT NULL, -- Store in cents to avoid float issues
  duration_minutes INT NOT NULL,

  -- Delivery
  is_live BOOLEAN DEFAULT TRUE, -- Live session vs async
  delivery_method TEXT, -- 'video', 'phone', 'written'

  -- Status
  is_active BOOLEAN DEFAULT TRUE,

  -- Cal.com
  cal_com_event_type_id TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_services_provider ON services(provider_id);
CREATE INDEX idx_services_type ON services(type);
CREATE INDEX idx_services_active ON services(is_active) WHERE is_active = TRUE;

-- 4. BOOKINGS
-- Service bookings/transactions
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Parties
  applicant_id UUID NOT NULL REFERENCES auth.users(id),
  provider_id UUID NOT NULL REFERENCES provider_profiles(id),
  service_id UUID NOT NULL REFERENCES services(id),

  -- Status
  status TEXT NOT NULL DEFAULT 'pending',
  -- 'pending', 'accepted', 'declined', 'cancelled', 'completed', 'disputed', 'refunded'

  -- Scheduling
  requested_times JSONB, -- Array of proposed times
  scheduled_at TIMESTAMPTZ, -- Confirmed time
  completed_at TIMESTAMPTZ,

  -- Payment
  amount_cents INT NOT NULL,
  platform_fee_cents INT NOT NULL, -- 20% of amount
  provider_payout_cents INT NOT NULL, -- 80% of amount
  stripe_payment_intent_id TEXT,
  stripe_transfer_id TEXT,
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'authorized', 'captured', 'refunded'

  -- Communication
  applicant_notes TEXT, -- Notes from applicant when booking
  provider_notes TEXT, -- Notes from provider

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  declined_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_bookings_applicant ON bookings(applicant_id);
CREATE INDEX idx_bookings_provider ON bookings(provider_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_scheduled ON bookings(scheduled_at);

-- 5. BOOKING CAL.COM MAPPING
-- Links bookings to Cal.com events
CREATE TABLE booking_cal_com_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  cal_com_booking_uid TEXT NOT NULL,
  cal_com_event_type_id TEXT,
  cal_com_status TEXT,
  cal_com_meeting_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(booking_id),
  UNIQUE(cal_com_booking_uid)
);

-- 6. BOOKING REVIEWS
-- Double-blind review system
CREATE TABLE booking_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,

  -- Reviewer
  reviewer_id UUID NOT NULL REFERENCES auth.users(id),
  reviewer_type TEXT NOT NULL, -- 'applicant' or 'provider'

  -- Review Content
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,

  -- Double-blind: hidden until both submit
  is_visible BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(booking_id, reviewer_type)
);

CREATE INDEX idx_booking_reviews_booking ON booking_reviews(booking_id);

-- 7. NOTIFICATIONS
-- In-app notifications for all users
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Content
  type TEXT NOT NULL, -- 'booking_request', 'booking_confirmed', 'new_message', 'review_received', etc.
  title TEXT NOT NULL,
  message TEXT,
  link TEXT, -- Where to navigate when clicked

  -- Status
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,

  -- Extra data
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read = FALSE;

-- 8. CONVERSATIONS
-- Messaging threads between applicants and providers
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id UUID NOT NULL REFERENCES auth.users(id),
  provider_id UUID NOT NULL REFERENCES auth.users(id),

  -- Context
  booking_id UUID REFERENCES bookings(id), -- NULL for pre-booking inquiries
  service_type TEXT, -- Which service they're asking about
  source TEXT, -- 'profile', 'service_card', 'booking_flow'

  -- Status
  status TEXT DEFAULT 'active', -- 'active', 'archived', 'blocked'

  -- Read tracking
  last_message_at TIMESTAMPTZ,
  applicant_last_read_at TIMESTAMPTZ,
  provider_last_read_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(applicant_id, provider_id)
);

CREATE INDEX idx_conversations_applicant ON conversations(applicant_id);
CREATE INDEX idx_conversations_provider ON conversations(provider_id);
CREATE INDEX idx_conversations_booking ON conversations(booking_id);

-- 9. MESSAGES
-- Individual messages within conversations
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),

  -- Content
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- 'text', 'booking_link', 'system'
  file_url TEXT,

  -- Status
  read_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);

-- 10. MESSAGE FLAGS (for moderation)
-- Flagged messages for admin review
CREATE TABLE message_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  flag_type TEXT NOT NULL, -- 'phone_detected', 'email_detected', 'reported', 'off_platform'
  flagged_by UUID REFERENCES auth.users(id), -- NULL for auto-detected
  flagged_at TIMESTAMPTZ DEFAULT NOW(),
  admin_notes TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  action_taken TEXT
);

CREATE INDEX idx_message_flags_unresolved ON message_flags(resolved) WHERE resolved = FALSE;

-- 11. SAVED PROVIDERS
-- Applicants can save/favorite providers
CREATE TABLE saved_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider_id)
);

CREATE INDEX idx_saved_providers_user ON saved_providers(user_id);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_id_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_cal_com_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_providers ENABLE ROW LEVEL SECURITY;

-- USER ID MAPPING: Users can only see their own mapping
CREATE POLICY "Users can view own mapping" ON user_id_mapping
  FOR SELECT USING (auth.uid() = supabase_uid);

-- PROVIDER PROFILES: Public read for approved, users can edit own
CREATE POLICY "Anyone can view approved providers" ON provider_profiles
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Providers can view own profile" ON provider_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Providers can update own profile" ON provider_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can create provider profile" ON provider_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- SERVICES: Public read for active services of approved providers
CREATE POLICY "Anyone can view active services" ON services
  FOR SELECT USING (
    is_active = TRUE
    AND EXISTS (
      SELECT 1 FROM provider_profiles pp
      WHERE pp.id = services.provider_id AND pp.status = 'approved'
    )
  );

CREATE POLICY "Providers can manage own services" ON services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM provider_profiles pp
      WHERE pp.id = services.provider_id AND pp.user_id = auth.uid()
    )
  );

-- BOOKINGS: Participants can view/manage their bookings
CREATE POLICY "Applicants can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = applicant_id);

CREATE POLICY "Providers can view their bookings" ON bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM provider_profiles pp
      WHERE pp.id = bookings.provider_id AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Applicants can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Participants can update bookings" ON bookings
  FOR UPDATE USING (
    auth.uid() = applicant_id
    OR EXISTS (
      SELECT 1 FROM provider_profiles pp
      WHERE pp.id = bookings.provider_id AND pp.user_id = auth.uid()
    )
  );

-- BOOKING CAL.COM MAPPING: Same as bookings
CREATE POLICY "Participants can view cal.com mapping" ON booking_cal_com_mapping
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = booking_cal_com_mapping.booking_id
      AND (b.applicant_id = auth.uid() OR EXISTS (
        SELECT 1 FROM provider_profiles pp
        WHERE pp.id = b.provider_id AND pp.user_id = auth.uid()
      ))
    )
  );

-- BOOKING REVIEWS: Visible reviews are public, can create own
CREATE POLICY "Anyone can view visible reviews" ON booking_reviews
  FOR SELECT USING (is_visible = TRUE);

CREATE POLICY "Reviewers can view own reviews" ON booking_reviews
  FOR SELECT USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can create reviews for their bookings" ON booking_reviews
  FOR INSERT WITH CHECK (
    auth.uid() = reviewer_id
    AND EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = booking_reviews.booking_id
      AND (b.applicant_id = auth.uid() OR EXISTS (
        SELECT 1 FROM provider_profiles pp
        WHERE pp.id = b.provider_id AND pp.user_id = auth.uid()
      ))
    )
  );

-- NOTIFICATIONS: Users can only see their own
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- CONVERSATIONS: Participants can view/manage
CREATE POLICY "Participants can view conversations" ON conversations
  FOR SELECT USING (auth.uid() = applicant_id OR auth.uid() = provider_id);

CREATE POLICY "Users can start conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Participants can update conversations" ON conversations
  FOR UPDATE USING (auth.uid() = applicant_id OR auth.uid() = provider_id);

-- MESSAGES: Conversation participants can view/send
CREATE POLICY "Participants can view messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (c.applicant_id = auth.uid() OR c.provider_id = auth.uid())
    )
  );

CREATE POLICY "Participants can send messages" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_id
      AND (c.applicant_id = auth.uid() OR c.provider_id = auth.uid())
    )
  );

-- MESSAGE FLAGS: Only admins (handled at app level, no public policy)
-- Users can report messages
CREATE POLICY "Users can flag messages" ON message_flags
  FOR INSERT WITH CHECK (auth.uid() = flagged_by);

-- SAVED PROVIDERS: Users manage their own saves
CREATE POLICY "Users can view own saved providers" ON saved_providers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save providers" ON saved_providers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave providers" ON saved_providers
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_user_id_mapping_updated_at
  BEFORE UPDATE ON user_id_mapping
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_provider_profiles_updated_at
  BEFORE UPDATE ON provider_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_booking_cal_com_mapping_updated_at
  BEFORE UPDATE ON booking_cal_com_mapping
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Update conversation last_message_at when new message is sent
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at, updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_on_message
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- Make reviews visible when both parties have submitted
CREATE OR REPLACE FUNCTION check_double_blind_reviews()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if both reviews exist for this booking
  IF (
    SELECT COUNT(DISTINCT reviewer_type) = 2
    FROM booking_reviews
    WHERE booking_id = NEW.booking_id
  ) THEN
    -- Make both reviews visible
    UPDATE booking_reviews
    SET is_visible = TRUE
    WHERE booking_id = NEW.booking_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_reviews_visibility
  AFTER INSERT ON booking_reviews
  FOR EACH ROW EXECUTE FUNCTION check_double_blind_reviews();
