/**
 * useCategories Hook
 *
 * CRUD operations for content categories.
 * Categories are shared across modules, lessons, and downloads.
 */

import { useState, useEffect, useCallback } from 'react';
import supabase from '@/lib/supabase';

/**
 * Hook for fetching all categories
 */
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .order('order_index', { ascending: true });

      if (fetchError) throw fetchError;

      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /**
   * Get category display name by slug
   */
  const getCategoryName = useCallback(
    (slug) => {
      const category = categories.find((c) => c.slug === slug);
      return category?.display_name || slug;
    },
    [categories]
  );

  /**
   * Get multiple category names from slugs array
   */
  const getCategoryNames = useCallback(
    (slugs) => {
      if (!slugs?.length) return [];
      return slugs.map((slug) => getCategoryName(slug));
    },
    [getCategoryName]
  );

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
    getCategoryName,
    getCategoryNames,
  };
}

/**
 * Hook for category admin operations
 */
export function useCategoryAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Create a new category
   */
  const createCategory = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: newCategory, error: createError } = await supabase
        .from('categories')
        .insert({
          slug: data.slug,
          display_name: data.displayName,
          description: data.description || null,
          order_index: data.orderIndex || 0,
        })
        .select()
        .single();

      if (createError) throw createError;

      return { data: newCategory, error: null };
    } catch (err) {
      console.error('Error creating category:', err);
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update an existing category
   */
  const updateCategory = async (id, data) => {
    setIsLoading(true);
    setError(null);

    try {
      const updateData = {};
      if (data.slug !== undefined) updateData.slug = data.slug;
      if (data.displayName !== undefined) updateData.display_name = data.displayName;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.orderIndex !== undefined) updateData.order_index = data.orderIndex;

      const { data: updatedCategory, error: updateError } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      return { data: updatedCategory, error: null };
    } catch (err) {
      console.error('Error updating category:', err);
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete a category
   */
  const deleteCategory = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      return { error: null };
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err.message);
      return { error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Rename a category slug (updates all references atomically)
   * Uses database function to update category and all referencing tables
   * @param {string} oldSlug - Current category slug
   * @param {string} newSlug - New category slug
   * @returns {Promise<{data: object|null, error: string|null}>}
   */
  const renameCategory = async (oldSlug, newSlug) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: rpcError } = await supabase.rpc('rename_category', {
        p_old_slug: oldSlug,
        p_new_slug: newSlug,
      });

      if (rpcError) throw rpcError;

      return { data, error: null };
    } catch (err) {
      console.error('Error renaming category:', err);
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    renameCategory,
    isLoading,
    error,
  };
}

export default useCategories;
