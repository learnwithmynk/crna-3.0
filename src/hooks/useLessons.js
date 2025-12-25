/**
 * useLessons Hook
 *
 * CRUD operations for LMS lessons.
 * Lessons contain video content (Vimeo), Editor.js content, and downloadable resources.
 */

import { useState, useEffect, useCallback } from 'react';
import supabase from '@/lib/supabase';

// Enable mock mode when in development and no data exists
const USE_MOCK_FALLBACK = import.meta.env.DEV;

// Mock lesson data for development/demo
const MOCK_LESSONS = [
  {
    id: 'mock-lesson-1',
    slug: 'welcome-to-crna-journey',
    title: 'Welcome to Your CRNA Journey',
    order_index: 0,
    status: 'published',
    vimeo_video_id: '76979871', // Sample Vimeo video
    video_thumbnail_url: null,
    video_description: 'In this introductory lesson, we\'ll cover everything you need to know about becoming a CRNA. Learn about the path ahead, what to expect, and how to make the most of your preparation journey.',
    video_duration_seconds: 420,
    content: {
      blocks: [
        {
          id: 'block1',
          type: 'header',
          data: { text: 'What is a CRNA?', level: 2 }
        },
        {
          id: 'block2',
          type: 'paragraph',
          data: { text: 'A <b>Certified Registered Nurse Anesthetist (CRNA)</b> is an advanced practice registered nurse who specializes in anesthesia care. CRNAs are highly trained healthcare professionals who administer anesthesia for surgeries and other medical procedures.' }
        },
        {
          id: 'block3',
          type: 'callout',
          data: { type: 'tip', title: 'Did You Know?', text: 'CRNAs provide over 50 million anesthetics to patients each year in the United States!' }
        },
        {
          id: 'block4',
          type: 'header',
          data: { text: 'The Path to Becoming a CRNA', level: 2 }
        },
        {
          id: 'block5',
          type: 'list',
          data: {
            style: 'ordered',
            items: [
              'Earn a BSN (Bachelor of Science in Nursing)',
              'Gain ICU experience (typically 1-3 years)',
              'Complete prerequisite courses',
              'Apply to CRNA programs',
              'Complete your DNP or DNAP degree',
              'Pass the NCE certification exam'
            ]
          }
        },
        {
          id: 'block6',
          type: 'callout',
          data: { type: 'important', text: 'Most CRNA programs require a minimum of 1 year of ICU experience, but competitive applicants often have 2-3 years.' }
        }
      ]
    },
    resource_category_slug: null,
    manual_download_ids: [],
    excluded_download_ids: [],
    accessible_via: [],
    category_slugs: ['getting-started'],
    section_id: null,
    module_id: 'mock-module-1',
    module: {
      id: 'mock-module-1',
      slug: 'getting-started',
      title: 'Getting Started',
      accessible_via: []
    }
  },
  {
    id: 'mock-lesson-2',
    slug: 'understanding-crna-programs',
    title: 'Understanding CRNA Programs',
    order_index: 1,
    status: 'published',
    vimeo_video_id: '148751763',
    video_thumbnail_url: null,
    video_description: 'Learn about the different types of CRNA programs, what to look for when choosing a program, and how to evaluate which programs are the best fit for you.',
    video_duration_seconds: 540,
    content: {
      blocks: [
        {
          id: 'block1',
          type: 'header',
          data: { text: 'Types of CRNA Programs', level: 2 }
        },
        {
          id: 'block2',
          type: 'paragraph',
          data: { text: 'CRNA programs have evolved significantly over the years. Today, all programs must award a doctoral degree. Here\'s what you need to know about program types:' }
        },
        {
          id: 'block3',
          type: 'list',
          data: {
            style: 'unordered',
            items: [
              '<b>DNP (Doctor of Nursing Practice)</b> - The most common doctoral degree for CRNAs',
              '<b>DNAP (Doctor of Nurse Anesthesia Practice)</b> - A practice-focused doctorate specific to nurse anesthesia',
              '<b>PhD Programs</b> - Research-focused programs for those interested in academia'
            ]
          }
        }
      ]
    },
    accessible_via: [],
    section_id: null,
    module_id: 'mock-module-1',
    module: {
      id: 'mock-module-1',
      slug: 'getting-started',
      title: 'Getting Started',
      accessible_via: []
    }
  },
  {
    id: 'mock-lesson-3',
    slug: 'building-your-icu-experience',
    title: 'Building Your ICU Experience',
    order_index: 2,
    status: 'published',
    vimeo_video_id: '225408543',
    video_thumbnail_url: null,
    video_description: 'ICU experience is crucial for CRNA school admission. This lesson covers strategies for getting into the ICU and making the most of your time there.',
    video_duration_seconds: 480,
    content: {
      blocks: [
        {
          id: 'block1',
          type: 'header',
          data: { text: 'Why ICU Experience Matters', level: 2 }
        },
        {
          id: 'block2',
          type: 'paragraph',
          data: { text: 'Critical care experience is the foundation of your CRNA preparation. In the ICU, you\'ll develop essential skills like managing ventilators, titrating vasoactive medications, and caring for critically ill patients.' }
        }
      ]
    },
    accessible_via: [],
    section_id: null,
    module_id: 'mock-module-1',
    module: {
      id: 'mock-module-1',
      slug: 'getting-started',
      title: 'Getting Started',
      accessible_via: []
    }
  }
];

/**
 * Hook for fetching lessons in a module
 * @param {string} moduleId - Module ID to fetch lessons for
 * @param {Object} options - Hook options
 * @param {boolean} options.adminMode - Include draft/archived lessons (default: false)
 */
export function useLessons(moduleId, { adminMode = false } = {}) {
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLessons = useCallback(async () => {
    if (!moduleId) {
      setLessons([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('lessons')
        .select(`
          id,
          slug,
          title,
          section_id,
          order_index,
          status,
          vimeo_video_id,
          video_thumbnail_url,
          accessible_via
        `)
        .eq('module_id', moduleId)
        .order('order_index', { ascending: true });

      if (!adminMode) {
        query = query.eq('status', 'published');
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setLessons(data || []);
    } catch (err) {
      console.error('Error fetching lessons:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [moduleId, adminMode]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  return {
    lessons,
    isLoading,
    error,
    refetch: fetchLessons,
  };
}

/**
 * Hook for fetching a single lesson by ID (for admin pages)
 * @param {string} lessonId - Lesson UUID
 */
export function useLessonById(lessonId) {
  const [lesson, setLesson] = useState(null);
  const [module, setModule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lessonId) {
      setIsLoading(false);
      return;
    }

    const fetchLesson = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select(`
            *,
            module:modules(id, slug, title, accessible_via)
          `)
          .eq('id', lessonId)
          .single();

        if (lessonError) throw lessonError;

        setLesson(lessonData);
        setModule(lessonData.module);
      } catch (err) {
        console.error('Error fetching lesson by ID:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  return {
    lesson,
    module,
    isLoading,
    error,
  };
}

/**
 * Hook for fetching a single lesson by slug (for user-facing pages)
 * @param {string} slug - Lesson slug
 */
export function useLesson(slug) {
  const [lesson, setLesson] = useState(null);
  const [module, setModule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    const fetchLesson = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select(`
            *,
            module:modules(id, slug, title, accessible_via)
          `)
          .eq('slug', slug)
          .single();

        if (lessonError) throw lessonError;

        setLesson(lessonData);
        setModule(lessonData.module);
      } catch (err) {
        // In dev mode, fall back to mock data
        if (USE_MOCK_FALLBACK) {
          const mockLesson = MOCK_LESSONS.find((l) => l.slug === slug);
          if (mockLesson) {
            setLesson(mockLesson);
            setModule(mockLesson.module);
            setError(null);
            return;
          }
        }
        console.error('Error fetching lesson:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [slug]);

  return {
    lesson,
    module,
    isLoading,
    error,
  };
}

/**
 * Hook for fetching adjacent lessons (prev/next) for navigation
 * @param {string} moduleId - Current module ID
 * @param {number} currentOrderIndex - Current lesson's order_index
 */
export function useAdjacentLessons(moduleId, currentOrderIndex) {
  const [prevLesson, setPrevLesson] = useState(null);
  const [nextLesson, setNextLesson] = useState(null);
  const [totalLessons, setTotalLessons] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);

  useEffect(() => {
    if (!moduleId || currentOrderIndex === undefined) return;

    const fetchAdjacent = async () => {
      try {
        // Get all published lessons in module
        const { data: allLessons, error } = await supabase
          .from('lessons')
          .select('id, slug, title, order_index')
          .eq('module_id', moduleId)
          .eq('status', 'published')
          .order('order_index', { ascending: true });

        if (error) throw error;

        processLessons(allLessons || []);
      } catch (err) {
        // In dev mode, fall back to mock data
        if (USE_MOCK_FALLBACK && moduleId === 'mock-module-1') {
          const mockLessons = MOCK_LESSONS.filter(
            (l) => l.module_id === moduleId
          ).sort((a, b) => a.order_index - b.order_index);
          processLessons(mockLessons);
          return;
        }
        console.error('Error fetching adjacent lessons:', err);
      }
    };

    const processLessons = (allLessons) => {
      setTotalLessons(allLessons.length);

      // Find current position
      const currentIndex = allLessons.findIndex(
        (l) => l.order_index === currentOrderIndex
      );
      setCurrentPosition(currentIndex + 1);

      // Set prev/next
      if (currentIndex > 0) {
        setPrevLesson(allLessons[currentIndex - 1]);
      } else {
        setPrevLesson(null);
      }

      if (currentIndex < allLessons.length - 1) {
        setNextLesson(allLessons[currentIndex + 1]);
      } else {
        setNextLesson(null);
      }
    };

    fetchAdjacent();
  }, [moduleId, currentOrderIndex]);

  return {
    prevLesson,
    nextLesson,
    totalLessons,
    currentPosition,
  };
}

/**
 * Hook for lesson admin operations (create, update, delete, reorder)
 * Also handles sections for the module
 * @param {string} moduleId - Module ID to manage lessons/sections for
 */
export function useLessonAdmin(moduleId) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [sections, setSections] = useState([]);

  // Fetch lessons and sections for the module
  const fetchData = useCallback(async () => {
    if (!moduleId) {
      setLessons([]);
      setSections([]);
      return;
    }

    try {
      // Fetch sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('sections')
        .select('*')
        .eq('module_id', moduleId)
        .order('order_index', { ascending: true });

      if (sectionsError) {
        // Mock mode fallback
        if (USE_MOCK_MODE) {
          setSections([]);
        } else {
          throw sectionsError;
        }
      } else {
        setSections(sectionsData || []);
      }

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('module_id', moduleId)
        .order('order_index', { ascending: true });

      if (lessonsError) {
        if (USE_MOCK_MODE) {
          setLessons([]);
        } else {
          throw lessonsError;
        }
      } else {
        setLessons(lessonsData || []);
      }
    } catch (err) {
      console.error('Error fetching lessons/sections:', err);
      setError(err.message);
    }
  }, [moduleId]);

  // Fetch data on mount and when moduleId changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ============ SECTION OPERATIONS ============

  /**
   * Create a new section
   */
  const createSection = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const insertData = {
        module_id: data.module_id || moduleId,
        title: data.title,
        description: data.description || null,
        order_index: data.sort_order ?? data.order_index ?? sections.length,
      };

      const { data: newSection, error: createError } = await supabase
        .from('sections')
        .insert(insertData)
        .select()
        .single();

      if (createError) {
        if (USE_MOCK_MODE && createError.message?.includes('row-level security')) {
          const mockSection = {
            id: crypto.randomUUID(),
            ...insertData,
            created_at: new Date().toISOString(),
          };
          setSections((prev) => [...prev, mockSection]);
          return { data: mockSection, error: null };
        }
        throw createError;
      }

      setSections((prev) => [...prev, newSection]);
      return { data: newSection, error: null };
    } catch (err) {
      console.error('Error creating section:', err);
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update an existing section
   */
  const updateSection = async (id, data) => {
    setIsLoading(true);
    setError(null);

    try {
      const updateData = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.order_index !== undefined) updateData.order_index = data.order_index;

      const { data: updatedSection, error: updateError } = await supabase
        .from('sections')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        if (USE_MOCK_MODE) {
          setSections((prev) =>
            prev.map((s) => (s.id === id ? { ...s, ...updateData } : s))
          );
          return { data: { id, ...updateData }, error: null };
        }
        throw updateError;
      }

      setSections((prev) =>
        prev.map((s) => (s.id === id ? updatedSection : s))
      );
      return { data: updatedSection, error: null };
    } catch (err) {
      console.error('Error updating section:', err);
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete a section
   */
  const deleteSection = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('sections')
        .delete()
        .eq('id', id);

      if (deleteError) {
        if (USE_MOCK_MODE) {
          setSections((prev) => prev.filter((s) => s.id !== id));
          return { error: null };
        }
        throw deleteError;
      }

      setSections((prev) => prev.filter((s) => s.id !== id));
      return { error: null };
    } catch (err) {
      console.error('Error deleting section:', err);
      setError(err.message);
      return { error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reorder sections
   */
  const reorderSections = async (sectionIds) => {
    setIsLoading(true);
    setError(null);

    try {
      // Optimistically update local state
      const reordered = sectionIds.map((id, index) => {
        const section = sections.find((s) => s.id === id);
        return { ...section, order_index: index };
      });
      setSections(reordered);

      // Update in database
      const updates = sectionIds.map((id, index) =>
        supabase
          .from('sections')
          .update({ order_index: index })
          .eq('id', id)
      );

      await Promise.all(updates);
      return { error: null };
    } catch (err) {
      console.error('Error reordering sections:', err);
      if (USE_MOCK_MODE) {
        return { error: null };
      }
      setError(err.message);
      fetchData(); // Revert on error
      return { error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // ============ LESSON OPERATIONS ============

  /**
   * Create a new lesson
   */
  const createLesson = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: newLesson, error: createError } = await supabase
        .from('lessons')
        .insert({
          module_id: data.moduleId,
          section_id: data.sectionId || null,
          slug: data.slug,
          title: data.title,
          vimeo_video_id: data.vimeoVideoId || null,
          video_thumbnail_url: data.videoThumbnailUrl || null,
          video_description: data.videoDescription || null,
          video_duration_seconds: data.videoDurationSeconds || null,
          content: data.content || null,
          resource_category_slug: data.resourceCategorySlug || null,
          manual_download_ids: data.manualDownloadIds || [],
          excluded_download_ids: data.excludedDownloadIds || [],
          accessible_via: data.accessibleVia || [],
          category_slugs: data.categorySlugs || [],
          status: data.status || 'draft',
          order_index: data.orderIndex || 0,
          meta_description: data.metaDescription || null,
        })
        .select()
        .single();

      if (createError) throw createError;

      return { data: newLesson, error: null };
    } catch (err) {
      console.error('Error creating lesson:', err);
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update an existing lesson
   */
  const updateLesson = async (id, data) => {
    setIsLoading(true);
    setError(null);

    try {
      const updateData = {};

      // Map camelCase to snake_case
      const fieldMap = {
        moduleId: 'module_id',
        sectionId: 'section_id',
        slug: 'slug',
        title: 'title',
        vimeoVideoId: 'vimeo_video_id',
        videoThumbnailUrl: 'video_thumbnail_url',
        videoDescription: 'video_description',
        videoDurationSeconds: 'video_duration_seconds',
        content: 'content',
        resourceCategorySlug: 'resource_category_slug',
        manualDownloadIds: 'manual_download_ids',
        excludedDownloadIds: 'excluded_download_ids',
        accessibleVia: 'accessible_via',
        categorySlugs: 'category_slugs',
        status: 'status',
        orderIndex: 'order_index',
        metaDescription: 'meta_description',
      };

      Object.entries(fieldMap).forEach(([camelKey, snakeKey]) => {
        if (data[camelKey] !== undefined) {
          updateData[snakeKey] = data[camelKey];
        }
      });

      const { data: updatedLesson, error: updateError } = await supabase
        .from('lessons')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      return { data: updatedLesson, error: null };
    } catch (err) {
      console.error('Error updating lesson:', err);
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete a lesson
   */
  const deleteLesson = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      return { error: null };
    } catch (err) {
      console.error('Error deleting lesson:', err);
      setError(err.message);
      return { error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reorder lessons by updating order_index
   * @param {Array<{id: string, orderIndex: number}>} items - Array of lesson IDs with new order
   */
  const reorderLessons = async (items) => {
    setIsLoading(true);
    setError(null);

    try {
      const updates = items.map(({ id, orderIndex }) =>
        supabase
          .from('lessons')
          .update({ order_index: orderIndex })
          .eq('id', id)
      );

      await Promise.all(updates);

      return { error: null };
    } catch (err) {
      console.error('Error reordering lessons:', err);
      setError(err.message);
      return { error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    lessons,
    sections,
    isLoading,
    error,
    // Section operations
    createSection,
    updateSection,
    deleteSection,
    reorderSections,
    // Lesson operations
    createLesson,
    updateLesson,
    deleteLesson,
    reorderLessons,
    // Refetch
    refetch: fetchData,
  };
}

export default useLessons;
