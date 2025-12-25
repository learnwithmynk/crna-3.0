/**
 * useModules Hook
 *
 * CRUD operations for LMS modules.
 * Modules are top-level containers for lessons (e.g., "Pharmacology", "Interview Prep").
 */

import { useState, useEffect, useCallback } from 'react';
import supabase from '@/lib/supabase';

// Enable mock mode when no auth or during development testing
const USE_MOCK_MODE = import.meta.env.DEV;

// Mock data for development when Supabase returns empty/error
const MOCK_MODULES = [
  {
    id: 'mock-module-1',
    slug: 'getting-started',
    title: 'Getting Started',
    description: 'Introduction to CRNA application preparation',
    thumbnail_url: null,
    status: 'published',
    order_index: 0,
    category_slugs: ['foundations'],
    accessible_via: ['active-members'],
    created_at: new Date().toISOString(),
    lessonCount: 5,
    sectionCount: 2,
  },
  {
    id: 'mock-module-2',
    slug: 'interview-prep',
    title: 'Interview Preparation',
    description: 'Everything you need to ace your CRNA interviews',
    thumbnail_url: null,
    status: 'draft',
    order_index: 1,
    category_slugs: ['interviewing'],
    accessible_via: ['interviewing-toolkit'],
    created_at: new Date().toISOString(),
    lessonCount: 8,
    sectionCount: 3,
  },
];

/**
 * Hook for fetching and managing modules
 * @param {Object} options - Hook options
 * @param {boolean} options.includeStats - Include lesson counts (default: true)
 * @param {boolean} options.adminMode - Include draft/archived modules (default: false)
 */
export function useModules({ includeStats = true, adminMode = false } = {}) {
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchModules = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('modules')
        .select(`
          *,
          lessons:lessons(count),
          sections:sections(count)
        `)
        .order('order_index', { ascending: true });

      // Only show published modules for non-admin users
      if (!adminMode) {
        query = query.eq('status', 'published');
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Transform the count aggregates
      const transformedData = data?.map((module) => ({
        ...module,
        lessonCount: module.lessons?.[0]?.count || 0,
        sectionCount: module.sections?.[0]?.count || 0,
        lessons: undefined,
        sections: undefined,
      }));

      // In dev mode, use mock data if database returns empty
      if (USE_MOCK_MODE && (!transformedData || transformedData.length === 0)) {
        setModules(MOCK_MODULES);
      } else {
        setModules(transformedData || []);
      }
    } catch (err) {
      console.error('Error fetching modules:', err);
      // In dev mode, use mock data on error
      if (USE_MOCK_MODE) {
        setModules(MOCK_MODULES);
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [adminMode]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return {
    modules,
    isLoading,
    error,
    refetch: fetchModules,
  };
}

/**
 * Hook for fetching a single module with its sections and lessons
 * @param {string} slug - Module slug
 */
export function useModule(slug) {
  const [module, setModule] = useState(null);
  const [sections, setSections] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    const fetchModule = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch module
        const { data: moduleData, error: moduleError } = await supabase
          .from('modules')
          .select('*')
          .eq('slug', slug)
          .single();

        if (moduleError) throw moduleError;

        // Fetch sections for this module
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('sections')
          .select('*')
          .eq('module_id', moduleData.id)
          .order('order_index', { ascending: true });

        if (sectionsError) throw sectionsError;

        // Fetch lessons for this module
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('id, slug, title, section_id, order_index, status, vimeo_video_id')
          .eq('module_id', moduleData.id)
          .eq('status', 'published')
          .order('order_index', { ascending: true });

        if (lessonsError) throw lessonsError;

        setModule(moduleData);
        setSections(sectionsData || []);
        setLessons(lessonsData || []);
      } catch (err) {
        console.error('Error fetching module:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModule();
  }, [slug]);

  // Group lessons by section
  const lessonsBySection = lessons.reduce((acc, lesson) => {
    const sectionId = lesson.section_id || 'unsectioned';
    if (!acc[sectionId]) {
      acc[sectionId] = [];
    }
    acc[sectionId].push(lesson);
    return acc;
  }, {});

  return {
    module,
    sections,
    lessons,
    lessonsBySection,
    isLoading,
    error,
  };
}

/**
 * Hook for module admin operations (create, update, delete, reorder)
 */
export function useModuleAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Create a new module
   */
  const createModule = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      // Normalize field names (accept both camelCase and snake_case)
      const insertData = {
        slug: data.slug,
        title: data.title,
        description: data.description || null,
        thumbnail_url: data.thumbnail_url || data.thumbnailUrl || null,
        accessible_via: data.accessible_via || data.accessibleVia || data.entitlement_slugs || [],
        category_slugs: data.category_slugs ? [data.category_slugs] : data.categorySlugs || [],
        status: data.status || 'draft',
        order_index: data.order_index || data.orderIndex || 0,
      };

      const { data: newModule, error: createError } = await supabase
        .from('modules')
        .insert(insertData)
        .select()
        .single();

      if (createError) {
        // In dev mode with RLS error, return mock success
        if (USE_MOCK_MODE && createError.message?.includes('row-level security')) {
          const mockModule = {
            id: crypto.randomUUID(),
            ...insertData,
            created_at: new Date().toISOString(),
          };
          return { data: mockModule, error: null };
        }
        throw createError;
      }

      return { data: newModule, error: null };
    } catch (err) {
      console.error('Error creating module:', err);
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update an existing module
   */
  const updateModule = async (id, data) => {
    setIsLoading(true);
    setError(null);

    try {
      // Normalize field names (accept both camelCase and snake_case)
      const updateData = {};
      if (data.slug !== undefined) updateData.slug = data.slug;
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.thumbnail_url !== undefined || data.thumbnailUrl !== undefined) {
        updateData.thumbnail_url = data.thumbnail_url || data.thumbnailUrl;
      }
      if (data.accessible_via !== undefined || data.accessibleVia !== undefined || data.entitlement_slugs !== undefined) {
        updateData.accessible_via = data.accessible_via || data.accessibleVia || data.entitlement_slugs;
      }
      if (data.category_slugs !== undefined || data.categorySlugs !== undefined || data.category_slug !== undefined) {
        const cats = data.category_slugs || data.categorySlugs || (data.category_slug ? [data.category_slug] : []);
        updateData.category_slugs = Array.isArray(cats) ? cats : [cats];
      }
      if (data.status !== undefined) updateData.status = data.status;
      if (data.order_index !== undefined || data.orderIndex !== undefined) {
        updateData.order_index = data.order_index || data.orderIndex;
      }

      const { data: updatedModule, error: updateError } = await supabase
        .from('modules')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        // In dev mode with RLS error, return mock success
        if (USE_MOCK_MODE && (updateError.message?.includes('row-level security') || updateError.message?.includes('uuid'))) {
          return { data: { id, ...updateData }, error: null };
        }
        throw updateError;
      }

      return { data: updatedModule, error: null };
    } catch (err) {
      console.error('Error updating module:', err);
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete a module
   */
  const deleteModule = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('modules')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      return { error: null };
    } catch (err) {
      console.error('Error deleting module:', err);
      setError(err.message);
      return { error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reorder modules by updating order_index
   * @param {Array<{id: string, orderIndex: number}>} items - Array of module IDs with new order
   */
  const reorderModules = async (items) => {
    setIsLoading(true);
    setError(null);

    try {
      // Update each module's order_index
      const updates = items.map(({ id, orderIndex }) =>
        supabase
          .from('modules')
          .update({ order_index: orderIndex })
          .eq('id', id)
      );

      await Promise.all(updates);

      return { error: null };
    } catch (err) {
      console.error('Error reordering modules:', err);
      setError(err.message);
      return { error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createModule,
    updateModule,
    deleteModule,
    reorderModules,
    isLoading,
    error,
  };
}

export default useModules;
