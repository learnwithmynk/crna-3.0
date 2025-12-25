/**
 * useFileUpload Hook
 *
 * Upload files (PDFs, spreadsheets, documents, etc.) to Supabase Storage.
 * Files are stored in the 'downloads' bucket with public access.
 */

import { useState, useCallback } from 'react';
import supabase from '@/lib/supabase';

// Storage bucket for downloadable files
const BUCKET_NAME = 'downloads';

// Allowed MIME types for downloads
const ALLOWED_TYPES = [
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  // Spreadsheets
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'text/csv',
  // Presentations
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  // Archives
  'application/zip',
  'application/x-zip-compressed',
  // Images (for downloadable images like templates)
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  // Text
  'text/plain',
];

// File extension to type mapping (for display)
const EXTENSION_TO_TYPE = {
  pdf: 'PDF',
  doc: 'DOC',
  docx: 'DOCX',
  xls: 'XLS',
  xlsx: 'XLSX',
  csv: 'CSV',
  ppt: 'PPT',
  pptx: 'PPTX',
  zip: 'ZIP',
  png: 'PNG',
  jpg: 'JPG',
  jpeg: 'JPG',
  gif: 'GIF',
  webp: 'WEBP',
  txt: 'TXT',
};

// Max file size (25MB)
const MAX_FILE_SIZE = 25 * 1024 * 1024;

/**
 * Get file type from filename or MIME type
 */
export function getFileType(filename, mimeType) {
  // Try to get from extension first
  const extension = filename?.split('.').pop()?.toLowerCase();
  if (extension && EXTENSION_TO_TYPE[extension]) {
    return EXTENSION_TO_TYPE[extension];
  }

  // Fall back to MIME type
  if (mimeType) {
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('word')) return 'DOCX';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'XLSX';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'PPTX';
    if (mimeType.includes('zip')) return 'ZIP';
    if (mimeType.includes('csv')) return 'CSV';
    if (mimeType.includes('image')) return 'IMG';
  }

  return 'FILE';
}

/**
 * Hook for uploading files to Supabase Storage
 */
export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  /**
   * Upload a single file
   * @param {File} file - File to upload
   * @param {Object} options - Upload options
   * @param {string} options.folder - Optional folder path (e.g., 'templates')
   * @returns {Promise<{url: string, path: string, fileType: string, fileSize: number, error: string|null}>}
   */
  const upload = useCallback(async (file, { folder = '' } = {}) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error(
          `Invalid file type: ${file.type}. Allowed types: PDF, Word, Excel, PowerPoint, ZIP, CSV, images, and text files.`
        );
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(
          `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max size: 25MB`
        );
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const extension = file.name.split('.').pop()?.toLowerCase() || 'file';
      const sanitizedName = file.name
        .replace(/\.[^/.]+$/, '') // Remove extension
        .replace(/[^a-zA-Z0-9-_]/g, '-') // Replace special chars
        .substring(0, 50); // Limit length
      const filename = `${sanitizedName}-${timestamp}-${randomString}.${extension}`;

      // Build path
      const path = folder ? `${folder}/${filename}` : filename;

      setProgress(10);

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      setProgress(80);

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

      setProgress(100);

      return {
        url: publicUrl,
        path: data.path,
        fileType: getFileType(file.name, file.type),
        fileSize: file.size,
        error: null,
      };
    } catch (err) {
      console.error('Error uploading file:', err);
      const errorMessage = err.message || 'Failed to upload file';
      setError(errorMessage);
      return {
        url: null,
        path: null,
        fileType: null,
        fileSize: null,
        error: errorMessage,
      };
    } finally {
      setIsUploading(false);
    }
  }, []);

  /**
   * Delete a file from storage
   * @param {string} path - File path in storage
   */
  const deleteFile = useCallback(async (path) => {
    try {
      const { error: deleteError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([path]);

      if (deleteError) throw deleteError;

      return { error: null };
    } catch (err) {
      console.error('Error deleting file:', err);
      return { error: err.message };
    }
  }, []);

  /**
   * Get public URL for a file path
   * @param {string} path - File path in storage
   */
  const getPublicUrl = useCallback((path) => {
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
    return publicUrl;
  }, []);

  return {
    upload,
    deleteFile,
    getPublicUrl,
    isUploading,
    progress,
    error,
    // Constants for validation/display
    allowedTypes: ALLOWED_TYPES,
    maxFileSize: MAX_FILE_SIZE,
    maxFileSizeMB: MAX_FILE_SIZE / 1024 / 1024,
    bucketName: BUCKET_NAME,
    getFileType,
  };
}

export default useFileUpload;
