-- ============================================
-- Add file_source field to downloads table
-- Distinguishes between Supabase-hosted files and external URLs
-- Created: December 10, 2024
-- ============================================

-- Add file_source column to track where the file is stored
ALTER TABLE downloads
ADD COLUMN IF NOT EXISTS file_source TEXT DEFAULT 'url'
CHECK (file_source IN ('url', 'supabase'));

-- Add comment for documentation
COMMENT ON COLUMN downloads.file_source IS 'Source of the file: "url" for external links (Google Drive, etc.), "supabase" for files uploaded to Supabase Storage';

-- Add storage_path column to store the Supabase Storage path (for deletion)
ALTER TABLE downloads
ADD COLUMN IF NOT EXISTS storage_path TEXT;

COMMENT ON COLUMN downloads.storage_path IS 'Supabase Storage path (only set when file_source = "supabase"), used for file deletion';
