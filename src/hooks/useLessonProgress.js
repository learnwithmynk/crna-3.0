/**
 * useLessonProgress Hook
 *
 * Track and update user progress through lessons.
 * Awards gamification points when lessons are completed.
 */

import { useState, useEffect, useCallback } from 'react';
import supabase from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

// Points awarded for completing a lesson (from gamification-system.md)
const LESSON_COMPLETION_POINTS = 3;

/**
 * Hook for tracking progress on a single lesson
 * @param {string} lessonId - Lesson ID
 */
export function useLessonProgress(lessonId) {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch progress for this lesson
  useEffect(() => {
    if (!lessonId || !user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchProgress = async () => {
      setIsLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('user_lesson_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonId)
          .single();

        // PGRST116 = no rows returned, which is fine
        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }

        setProgress(data || null);
      } catch (err) {
        console.error('Error fetching lesson progress:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [lessonId, user?.id]);

  /**
   * Mark lesson as complete and award points
   */
  const markComplete = useCallback(async () => {
    if (!lessonId || !user?.id) {
      return { error: 'Not authenticated' };
    }

    try {
      // Upsert progress record
      const { data, error: upsertError } = await supabase
        .from('user_lesson_progress')
        .upsert(
          {
            user_id: user.id,
            lesson_id: lessonId,
            completed: true,
            completed_at: new Date().toISOString(),
            last_accessed_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id,lesson_id',
          }
        )
        .select()
        .single();

      if (upsertError) throw upsertError;

      setProgress(data);

      // Award gamification points
      // TODO: Replace with actual API call when WordPress endpoint is ready
      try {
        await awardPoints(user.id, LESSON_COMPLETION_POINTS, 'lesson_complete');
      } catch (pointsError) {
        console.warn('Failed to award points:', pointsError);
        // Don't fail the completion if points fail
      }

      return { data, error: null };
    } catch (err) {
      console.error('Error marking lesson complete:', err);
      return { data: null, error: err.message };
    }
  }, [lessonId, user?.id]);

  /**
   * Mark lesson as incomplete (undo completion)
   */
  const markIncomplete = useCallback(async () => {
    if (!lessonId || !user?.id) {
      return { error: 'Not authenticated' };
    }

    try {
      const { data, error: updateError } = await supabase
        .from('user_lesson_progress')
        .update({
          completed: false,
          completed_at: null,
        })
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .select()
        .single();

      if (updateError) throw updateError;

      setProgress(data);
      return { data, error: null };
    } catch (err) {
      console.error('Error marking lesson incomplete:', err);
      return { data: null, error: err.message };
    }
  }, [lessonId, user?.id]);

  /**
   * Update video progress (for resume functionality)
   */
  const updateVideoProgress = useCallback(
    async (seconds) => {
      if (!lessonId || !user?.id) return;

      try {
        await supabase.from('user_lesson_progress').upsert(
          {
            user_id: user.id,
            lesson_id: lessonId,
            video_progress_seconds: seconds,
            last_accessed_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id,lesson_id',
          }
        );
      } catch (err) {
        console.error('Error updating video progress:', err);
      }
    },
    [lessonId, user?.id]
  );

  /**
   * Record that user accessed this lesson
   */
  const recordAccess = useCallback(async () => {
    if (!lessonId || !user?.id) return;

    try {
      // Check if record exists
      const { data: existing } = await supabase
        .from('user_lesson_progress')
        .select('id, access_count')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single();

      if (existing) {
        // Update existing record
        await supabase
          .from('user_lesson_progress')
          .update({
            last_accessed_at: new Date().toISOString(),
            access_count: (existing.access_count || 0) + 1,
          })
          .eq('id', existing.id);
      } else {
        // Create new record
        await supabase.from('user_lesson_progress').insert({
          user_id: user.id,
          lesson_id: lessonId,
          last_accessed_at: new Date().toISOString(),
          access_count: 1,
        });
      }
    } catch (err) {
      console.error('Error recording access:', err);
    }
  }, [lessonId, user?.id]);

  return {
    progress,
    isCompleted: progress?.completed || false,
    videoProgress: progress?.video_progress_seconds || 0,
    isLoading,
    error,
    markComplete,
    markIncomplete,
    updateVideoProgress,
    recordAccess,
  };
}

/**
 * Hook for getting module-level progress
 * @param {string} moduleId - Module ID
 */
export function useModuleProgress(moduleId) {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    progressPercent: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!moduleId || !user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchProgress = async () => {
      setIsLoading(true);
      try {
        // Use the database function we created
        const { data, error } = await supabase.rpc('get_module_progress', {
          p_user_id: user.id,
          p_module_id: moduleId,
        });

        if (error) throw error;

        if (data?.[0]) {
          setStats({
            totalLessons: data[0].total_lessons,
            completedLessons: data[0].completed_lessons,
            progressPercent: parseFloat(data[0].progress_percent) || 0,
          });
        }
      } catch (err) {
        console.error('Error fetching module progress:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [moduleId, user?.id]);

  return {
    ...stats,
    isLoading,
  };
}

/**
 * Hook for getting recently accessed lessons
 * @param {number} limit - Number of lessons to return (default: 5)
 */
export function useRecentlyAccessedLessons(limit = 5) {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLessons([]);
      setIsLoading(false);
      return;
    }

    const fetchRecent = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_lesson_progress')
          .select(
            `
            lesson_id,
            last_accessed_at,
            completed,
            lesson:lessons(id, slug, title, module:modules(slug, title))
          `
          )
          .eq('user_id', user.id)
          .order('last_accessed_at', { ascending: false })
          .limit(limit);

        if (error) throw error;

        // Flatten the data
        const flattened =
          data?.map((p) => ({
            ...p.lesson,
            lastAccessedAt: p.last_accessed_at,
            completed: p.completed,
            moduleSlug: p.lesson?.module?.slug,
            moduleTitle: p.lesson?.module?.title,
          })) || [];

        setLessons(flattened);
      } catch (err) {
        console.error('Error fetching recent lessons:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecent();
  }, [user?.id, limit]);

  return {
    lessons,
    isLoading,
  };
}

/**
 * Award gamification points
 * TODO: Replace with actual WordPress API call
 */
async function awardPoints(userId, points, action) {
  // Placeholder - will call WordPress Gamplify endpoint
  // POST /wp-json/gamplify/v1/award-points
  // { user_id, points, action }
  // TODO: Dev team will implement actual API call.
  return { success: true };
}

export default useLessonProgress;
