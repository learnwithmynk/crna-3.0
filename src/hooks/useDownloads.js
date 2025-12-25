/**
 * useDownloads Hook
 *
 * CRUD operations for downloadable resources.
 * Downloads can be gated by entitlements or free, and are associated with lessons via categories.
 */

import { useState, useEffect, useCallback } from 'react';
import supabase from '@/lib/supabase';

/**
 * Hook for fetching all downloads
 * @param {Object} options - Hook options
 * @param {string} options.categorySlug - Filter by category slug
 * @param {boolean} options.adminMode - Include archived downloads (default: false)
 */
export function useDownloads({ categorySlug, adminMode = false } = {}) {
  const [downloads, setDownloads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDownloads = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('downloads')
        .select('*')
        .order('title', { ascending: true });

      if (!adminMode) {
        query = query.eq('status', 'active');
      }

      if (categorySlug) {
        query = query.contains('category_slugs', [categorySlug]);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setDownloads(data || []);
    } catch (err) {
      console.error('Error fetching downloads:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [categorySlug, adminMode]);

  useEffect(() => {
    fetchDownloads();
  }, [fetchDownloads]);

  return {
    downloads,
    isLoading,
    error,
    refetch: fetchDownloads,
  };
}

/**
 * Hook for fetching a single download
 * @param {string} slug - Download slug
 */
export function useDownload(slug) {
  const [download, setDownload] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    const fetchDownload = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('downloads')
          .select('*')
          .eq('slug', slug)
          .single();

        if (fetchError) throw fetchError;

        setDownload(data);
      } catch (err) {
        console.error('Error fetching download:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDownload();
  }, [slug]);

  return {
    download,
    isLoading,
    error,
  };
}

/**
 * Hook for fetching downloads for a specific lesson
 * Implements 3-layer aggregation: category + manual + exclusions
 * @param {Object} lesson - Lesson object with resource config
 */
export function useLessonDownloads(lesson) {
  const [downloads, setDownloads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lesson) {
      setDownloads([]);
      setIsLoading(false);
      return;
    }

    const fetchLessonDownloads = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all active downloads
        const { data: allDownloads, error: fetchError } = await supabase
          .from('downloads')
          .select('*')
          .eq('status', 'active');

        if (fetchError) throw fetchError;

        // Apply 3-layer aggregation
        let resources = [];

        // Layer 1: Auto-populate from category
        if (lesson.resource_category_slug) {
          const categoryDownloads = allDownloads.filter((d) =>
            d.category_slugs?.includes(lesson.resource_category_slug)
          );
          resources.push(...categoryDownloads);
        }

        // Layer 2: Add manual downloads
        if (lesson.manual_download_ids?.length) {
          const manualDownloads = allDownloads.filter((d) =>
            lesson.manual_download_ids.includes(d.id)
          );
          resources.push(...manualDownloads);
        }

        // Layer 3: Remove exclusions
        if (lesson.excluded_download_ids?.length) {
          resources = resources.filter(
            (r) => !lesson.excluded_download_ids.includes(r.id)
          );
        }

        // Deduplicate by ID
        const uniqueResources = [
          ...new Map(resources.map((r) => [r.id, r])).values(),
        ];

        setDownloads(uniqueResources);
      } catch (err) {
        console.error('Error fetching lesson downloads:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonDownloads();
  }, [lesson]);

  return {
    downloads,
    isLoading,
    error,
  };
}

/**
 * Hook for download admin operations
 */
export function useDownloadAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Create a new download
   */
  const createDownload = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: newDownload, error: createError } = await supabase
        .from('downloads')
        .insert({
          slug: data.slug,
          title: data.title,
          description: data.description || null,
          thumbnail_url: data.thumbnailUrl || null,
          file_url: data.fileUrl,
          file_type: data.fileType || null,
          file_size_bytes: data.fileSizeBytes || null,
          file_source: data.fileSource || 'url',
          storage_path: data.storagePath || null,
          category_slugs: data.categorySlugs || [],
          is_free: data.isFree || false,
          accessible_via: data.accessibleVia || [],
          purchase_product_url: data.purchaseProductUrl || null,
          groundhogg_tag: data.groundhoggTag || null,
          status: data.status || 'active',
        })
        .select()
        .single();

      if (createError) throw createError;

      return { data: newDownload, error: null };
    } catch (err) {
      console.error('Error creating download:', err);
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update an existing download
   */
  const updateDownload = async (id, data) => {
    setIsLoading(true);
    setError(null);

    try {
      const updateData = {};

      const fieldMap = {
        slug: 'slug',
        title: 'title',
        description: 'description',
        thumbnailUrl: 'thumbnail_url',
        fileUrl: 'file_url',
        fileType: 'file_type',
        fileSizeBytes: 'file_size_bytes',
        fileSource: 'file_source',
        storagePath: 'storage_path',
        categorySlugs: 'category_slugs',
        isFree: 'is_free',
        accessibleVia: 'accessible_via',
        purchaseProductUrl: 'purchase_product_url',
        groundhoggTag: 'groundhogg_tag',
        status: 'status',
      };

      Object.entries(fieldMap).forEach(([camelKey, snakeKey]) => {
        if (data[camelKey] !== undefined) {
          updateData[snakeKey] = data[camelKey];
        }
      });

      const { data: updatedDownload, error: updateError } = await supabase
        .from('downloads')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      return { data: updatedDownload, error: null };
    } catch (err) {
      console.error('Error updating download:', err);
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete a download
   */
  const deleteDownload = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('downloads')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      return { error: null };
    } catch (err) {
      console.error('Error deleting download:', err);
      setError(err.message);
      return { error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Increment download count (call when user downloads)
   */
  const incrementDownloadCount = async (id) => {
    try {
      const { error } = await supabase.rpc('increment_download_count', {
        download_id: id,
      });

      if (error) throw error;

      return { error: null };
    } catch (err) {
      console.error('Error incrementing download count:', err);
      return { error: err.message };
    }
  };

  return {
    createDownload,
    updateDownload,
    deleteDownload,
    incrementDownloadCount,
    isLoading,
    error,
  };
}

export default useDownloads;
