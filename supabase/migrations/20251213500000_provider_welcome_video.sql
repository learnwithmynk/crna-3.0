-- ============================================
-- Provider Welcome Video
-- Phase 4.5 - Mentor profile enhancement
-- ============================================
--
-- Adds support for welcome videos on provider profiles,
-- similar to Upwork's video introduction feature.

-- ============================================
-- 1. ADD WELCOME VIDEO FIELDS
-- ============================================

-- Video URL (Supabase Storage or external like Vimeo/YouTube)
ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS welcome_video_url TEXT;

-- Video thumbnail for preview before playing
ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS welcome_video_thumbnail_url TEXT;

-- Video duration in seconds (for UI display)
ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS welcome_video_duration_seconds INT;

-- When the video was uploaded (for cache busting)
ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS welcome_video_uploaded_at TIMESTAMPTZ;

-- ============================================
-- 2. COMMENTS
-- ============================================

COMMENT ON COLUMN provider_profiles.welcome_video_url IS 'URL to welcome/introduction video (Supabase Storage, Vimeo, or YouTube)';
COMMENT ON COLUMN provider_profiles.welcome_video_thumbnail_url IS 'Thumbnail image URL for video preview';
COMMENT ON COLUMN provider_profiles.welcome_video_duration_seconds IS 'Video duration for UI display';
COMMENT ON COLUMN provider_profiles.welcome_video_uploaded_at IS 'When video was uploaded, for cache management';
