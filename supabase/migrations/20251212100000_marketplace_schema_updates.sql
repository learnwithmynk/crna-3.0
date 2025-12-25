-- ============================================
-- Marketplace Schema Updates
-- Phase 3.0.3 - Additional fields from plan
-- ============================================

-- 1. PROVIDER APPLICATIONS TABLE
-- For tracking mentor applications before approval
CREATE TABLE IF NOT EXISTS provider_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,

  -- Photo
  avatar_url TEXT,

  -- Program Info
  program_name TEXT NOT NULL,
  program_type TEXT, -- 'DNP', 'DNAP', 'MSNA'
  program_year INT NOT NULL,
  expected_graduation DATE NOT NULL,

  -- Verification Documents
  student_id_url TEXT, -- Required upload
  license_number TEXT, -- RN license
  license_state TEXT,
  license_verified BOOLEAN DEFAULT FALSE,
  license_verified_at TIMESTAMPTZ,

  -- Background
  undergrad_school TEXT,
  gpa_when_applied DECIMAL(3,2),
  science_gpa DECIMAL(3,2),
  gre_score INT,
  ccrn_when_applied BOOLEAN,
  icu_years INT,
  icu_types TEXT[],

  -- Application Content
  bio TEXT NOT NULL,
  service_interests TEXT[],

  -- Status
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'info_requested'
  rejection_reason TEXT,
  admin_notes TEXT,

  -- Timestamps
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE INDEX idx_provider_applications_status ON provider_applications(status);
CREATE INDEX idx_provider_applications_user ON provider_applications(user_id);

-- 2. ADD NEW COLUMNS TO provider_profiles
-- Personality fields (fun profile questions)
ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS personality JSONB DEFAULT '{}';

-- Vacation/pause mode
ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS vacation_start DATE;
ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS vacation_end DATE;
ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS vacation_message TEXT;
ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS is_paused BOOLEAN DEFAULT FALSE;

-- Instant book setting
ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS instant_book_enabled BOOLEAN DEFAULT FALSE;

-- Video call link (provider's own Zoom/Meet)
ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS video_call_link TEXT;

-- Tagline
ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS tagline TEXT;

-- Specialties
ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS specialties TEXT[];

-- License info (copied from approved application)
ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS license_number TEXT;
ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS license_state TEXT;

-- Link to original application
ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS application_id UUID REFERENCES provider_applications(id);

-- 3. ADD NEW COLUMNS TO services
-- Instant book per service
ALTER TABLE services ADD COLUMN IF NOT EXISTS instant_book_enabled BOOLEAN DEFAULT FALSE;

-- Delivery time for async services
ALTER TABLE services ADD COLUMN IF NOT EXISTS delivery_days INT;

-- 4. ADD NEW COLUMNS TO bookings
-- Session notes (Editor.js JSON)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS session_notes JSONB;

-- Service-specific intake data
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS intake_data JSONB;

-- File attachments
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]';

-- Cal.com meeting URL
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cal_com_meeting_url TEXT;

-- Expiration tracking (48h timeout)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Provider response nudge sent
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ;

-- 5. ADD TAGS TO booking_reviews
ALTER TABLE booking_reviews ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE booking_reviews ADD COLUMN IF NOT EXISTS would_recommend BOOLEAN;
ALTER TABLE booking_reviews ADD COLUMN IF NOT EXISTS private_notes TEXT; -- Admin-only for provider reviews

-- 6. ENABLE RLS ON NEW TABLE
ALTER TABLE provider_applications ENABLE ROW LEVEL SECURITY;

-- Provider applications policies
CREATE POLICY "Users can view own application" ON provider_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create application" ON provider_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending application" ON provider_applications
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- 7. TRIGGERS FOR NEW TABLE
CREATE TRIGGER update_provider_applications_updated_at
  BEFORE UPDATE ON provider_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 8. CONTACT EXCHANGE DETECTION TRIGGER
-- Flag messages containing phone numbers, emails, or off-platform mentions
CREATE OR REPLACE FUNCTION detect_contact_exchange()
RETURNS TRIGGER AS $$
BEGIN
  -- Phone number pattern (US format)
  IF NEW.content ~ '(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})' THEN
    INSERT INTO message_flags (message_id, flag_type)
    VALUES (NEW.id, 'phone_detected');
  END IF;

  -- Email pattern
  IF NEW.content ~* '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}' THEN
    INSERT INTO message_flags (message_id, flag_type)
    VALUES (NEW.id, 'email_detected');
  END IF;

  -- Off-platform mentions
  IF NEW.content ~* '(whatsapp|telegram|signal|call me|text me|venmo|zelle|cashapp)' THEN
    INSERT INTO message_flags (message_id, flag_type)
    VALUES (NEW.id, 'off_platform_mention');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER message_contact_detection
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION detect_contact_exchange();

-- 9. AUTO-EXPIRE PENDING BOOKINGS (48h)
-- This would typically be handled by a cron job or edge function
-- But we add a helper function here
CREATE OR REPLACE FUNCTION expire_pending_bookings()
RETURNS void AS $$
BEGIN
  UPDATE bookings
  SET status = 'expired',
      updated_at = NOW()
  WHERE status = 'pending'
    AND expires_at IS NOT NULL
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 10. FUNCTION TO MAKE REVIEWS VISIBLE AFTER 14 DAYS
CREATE OR REPLACE FUNCTION make_old_reviews_visible()
RETURNS void AS $$
BEGIN
  UPDATE booking_reviews
  SET is_visible = TRUE
  WHERE is_visible = FALSE
    AND created_at < NOW() - INTERVAL '14 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMMENT: Personality JSONB Schema
-- ============================================
-- The personality field stores fun profile questions:
-- {
--   "if_you_knew_me": "I'm obsessed with coffee",
--   "zodiac_sign": "Aries",
--   "icu_vibe": "Organized chaos",
--   "cats_or_dogs": "Dogs",
--   "favorite_patient_population": "Neuro patients",
--   "road_trip_music": "True crime podcasts",
--   "weird_fact": "I can name every Friends episode",
--   "comfort_food": "Mac and cheese",
--   "when_not_studying": "Hiking with my dog",
--   "motto": "Done is better than perfect"
-- }
