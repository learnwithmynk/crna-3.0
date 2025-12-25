/**
 * useImageUpload Hook
 *
 * Upload images to Supabase Storage for use in Editor.js lesson content.
 * Images are stored in the 'lesson-images' bucket with public access.
 *
 * In development mode, if Supabase Storage fails due to RLS, returns a
 * local object URL so the UI can still function.
 */

import { useState, useCallback } from 'react';
import supabase from '@/lib/supabase';

// Storage bucket for lesson images
const BUCKET_NAME = 'lesson-images';

// Allowed MIME types
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

// Max file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Enable mock mode when no auth or during development testing
const USE_MOCK_MODE = import.meta.env.DEV;

/**
 * Hook for uploading images to Supabase Storage
 */
export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  /**
   * Upload a single image file
   * @param {File} file - Image file to upload
   * @param {Object} options - Upload options
   * @param {string} options.folder - Optional folder path (e.g., 'lessons/pharmacology')
   * @returns {Promise<{url: string, error: string|null}>}
   */
  const upload = useCallback(async (file, { folder = '' } = {}) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error(
          `Invalid file type: ${file.type}. Allowed types: ${ALLOWED_TYPES.join(', ')}`
        );
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(
          `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max size: 5MB`
        );
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const extension = file.name.split('.').pop()?.toLowerCase() || 'png';
      const filename = `${timestamp}-${randomString}.${extension}`;

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

      if (uploadError) {
        // In dev mode with RLS error, return a local object URL for preview
        if (USE_MOCK_MODE && uploadError.message?.includes('row-level security')) {
          const localUrl = URL.createObjectURL(file);
          setProgress(100);
          return {
            url: localUrl,
            path: `mock/${filename}`,
            error: null,
            isMock: true,
          };
        }
        throw uploadError;
      }

      setProgress(80);

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

      setProgress(100);

      return {
        url: publicUrl,
        path: data.path,
        error: null,
      };
    } catch (err) {
      console.error('Error uploading image:', err);
      const errorMessage = err.message || 'Failed to upload image';

      // In dev mode, provide a fallback for any storage error
      if (USE_MOCK_MODE) {
        const localUrl = URL.createObjectURL(file);
        setProgress(100);
        return {
          url: localUrl,
          path: `mock/${Date.now()}.${file.name.split('.').pop()}`,
          error: null,
          isMock: true,
        };
      }

      setError(errorMessage);
      return {
        url: null,
        path: null,
        error: errorMessage,
      };
    } finally {
      setIsUploading(false);
    }
  }, []);

  /**
   * Upload multiple images
   * @param {FileList|File[]} files - Files to upload
   * @param {Object} options - Upload options
   * @returns {Promise<Array<{url: string, error: string|null}>>}
   */
  const uploadMultiple = useCallback(
    async (files, options = {}) => {
      const results = [];
      const fileArray = Array.from(files);

      for (let i = 0; i < fileArray.length; i++) {
        const result = await upload(fileArray[i], options);
        results.push(result);
        setProgress(((i + 1) / fileArray.length) * 100);
      }

      return results;
    },
    [upload]
  );

  /**
   * Delete an image from storage
   * @param {string} path - Image path in storage
   */
  const deleteImage = useCallback(async (path) => {
    try {
      const { error: deleteError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([path]);

      if (deleteError) throw deleteError;

      return { error: null };
    } catch (err) {
      console.error('Error deleting image:', err);
      return { error: err.message };
    }
  }, []);

  /**
   * Get public URL for an image path
   * @param {string} path - Image path in storage
   */
  const getPublicUrl = useCallback((path) => {
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
    return publicUrl;
  }, []);

  return {
    upload,
    uploadMultiple,
    deleteImage,
    getPublicUrl,
    isUploading,
    progress,
    error,
    // Constants for validation
    allowedTypes: ALLOWED_TYPES,
    maxFileSize: MAX_FILE_SIZE,
    bucketName: BUCKET_NAME,
  };
}

/**
 * Editor.js Image Tool uploader
 * Returns an object compatible with Editor.js Image tool config
 */
export function createEditorImageUploader() {
  return {
    /**
     * Upload file by URL (for paste/drag from web)
     */
    uploadByUrl: async (url) => {
      // For now, just return the URL as-is
      // Could add proxy/download logic later
      return {
        success: 1,
        file: {
          url,
        },
      };
    },

    /**
     * Upload file from local device
     */
    uploadByFile: async (file) => {
      try {
        // Validate
        if (!ALLOWED_TYPES.includes(file.type)) {
          return {
            success: 0,
            error: 'Invalid file type',
          };
        }

        if (file.size > MAX_FILE_SIZE) {
          return {
            success: 0,
            error: 'File too large (max 5MB)',
          };
        }

        // Generate filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const extension = file.name.split('.').pop()?.toLowerCase() || 'png';
        const filename = `editor/${timestamp}-${randomString}.${extension}`;

        // Upload
        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filename, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          // In dev mode with RLS error, return a local object URL for preview
          if (USE_MOCK_MODE && error.message?.includes('row-level security')) {
            const localUrl = URL.createObjectURL(file);
            return {
              success: 1,
              file: {
                url: localUrl,
              },
            };
          }
          throw error;
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

        return {
          success: 1,
          file: {
            url: publicUrl,
          },
        };
      } catch (err) {
        console.error('Editor.js image upload error:', err);

        // In dev mode, provide a fallback for any storage error
        if (USE_MOCK_MODE) {
          const localUrl = URL.createObjectURL(file);
          return {
            success: 1,
            file: {
              url: localUrl,
            },
          };
        }

        return {
          success: 0,
          error: err.message || 'Upload failed',
        };
      }
    },
  };
}

export default useImageUpload;
