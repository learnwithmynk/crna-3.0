/**
 * usePoints Hook
 *
 * Provides methods for awarding and tracking user points.
 * Uses Supabase for persistence with localStorage fallback for dev mode.
 *
 * Supabase tables used:
 * - user_points: User totals and level
 * - user_point_log: Point history
 * - point_actions: Configurable point values
 *
 * Supabase functions used:
 * - award_points(user_id, action_slug, reference_id, reference_type)
 * - get_points_for_action(action_slug)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { mockUser } from '@/data/mockUser';

// Check if Supabase is configured
const SUPABASE_CONFIGURED = isSupabaseConfigured();

// Point action types for tracking (matches Supabase point_actions slugs)
export const POINT_ACTIONS = {
  // Trackers
  CLINICAL_LOG: 'clinical_log',
  SHADOW_LOG: 'shadow_log',
  EQ_LOG: 'eq_log',
  EVENT_LOG: 'event_log',

  // Learning
  LESSON_COMPLETE: 'lesson_complete',

  // Programs
  PROGRAM_SAVE: 'program_save',
  TASK_COMPLETE: 'task_complete',
  MILESTONE_COMPLETE: 'milestone_complete',

  // Profile
  PROFILE_COMPLETE: 'profile_complete',

  // Community
  FORUM_POST: 'forum_post',
  FORUM_REPLY: 'forum_reply',
  RECEIVE_REACTION: 'receive_reaction',

  // Reports/Feedback
  REPORT_SCHOOL_ERROR: 'report_school_error',
  REPORT_PROGRAM_EVENT: 'report_program_event',
  FEEDBACK_SUBMIT: 'feedback_submit',

  // Bonuses
  FIRST_LOGIN: 'first_login',
  DAILY_STREAK: 'daily_streak',
  BADGE_EARN: 'badge_earn',
};

// Default point values (fallback if Supabase not available)
export const DEFAULT_POINT_VALUES = {
  [POINT_ACTIONS.CLINICAL_LOG]: 2,
  [POINT_ACTIONS.SHADOW_LOG]: 2,
  [POINT_ACTIONS.EQ_LOG]: 2,
  [POINT_ACTIONS.EVENT_LOG]: 2,
  [POINT_ACTIONS.LESSON_COMPLETE]: 3,
  [POINT_ACTIONS.PROGRAM_SAVE]: 3,
  [POINT_ACTIONS.TASK_COMPLETE]: 2,
  [POINT_ACTIONS.MILESTONE_COMPLETE]: 10,
  [POINT_ACTIONS.PROFILE_COMPLETE]: 15,
  [POINT_ACTIONS.FORUM_POST]: 2,
  [POINT_ACTIONS.FORUM_REPLY]: 2,
  [POINT_ACTIONS.RECEIVE_REACTION]: 1,
  [POINT_ACTIONS.REPORT_SCHOOL_ERROR]: 5,
  [POINT_ACTIONS.REPORT_PROGRAM_EVENT]: 5,
  [POINT_ACTIONS.FEEDBACK_SUBMIT]: 5,
  [POINT_ACTIONS.FIRST_LOGIN]: 50,
  [POINT_ACTIONS.DAILY_STREAK]: 5,
  [POINT_ACTIONS.BADGE_EARN]: 0, // Points come from badge itself
};

// Daily caps for certain actions
const DAILY_CAPS = {
  [POINT_ACTIONS.CLINICAL_LOG]: 3,
  [POINT_ACTIONS.SHADOW_LOG]: 5,
  [POINT_ACTIONS.EQ_LOG]: 5,
  [POINT_ACTIONS.EVENT_LOG]: 3,
  [POINT_ACTIONS.LESSON_COMPLETE]: 10,
  [POINT_ACTIONS.FORUM_POST]: 10,
  [POINT_ACTIONS.FORUM_REPLY]: 50,
  [POINT_ACTIONS.RECEIVE_REACTION]: 20,
  [POINT_ACTIONS.REPORT_SCHOOL_ERROR]: 5,
  [POINT_ACTIONS.REPORT_PROGRAM_EVENT]: 5,
};

// Storage keys for localStorage fallback
const STORAGE_KEY = 'crna_club_user_points';
const HISTORY_KEY = 'crna_club_points_history';
const DAILY_CAPS_KEY = 'crna_club_daily_caps';

/**
 * Get today's date string for cap tracking
 */
function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get stored daily caps from localStorage
 */
function getStoredDailyCaps() {
  const stored = localStorage.getItem(DAILY_CAPS_KEY);
  if (!stored) return { date: getTodayKey(), counts: {} };

  const parsed = JSON.parse(stored);
  if (parsed.date !== getTodayKey()) {
    return { date: getTodayKey(), counts: {} };
  }
  return parsed;
}

/**
 * Level thresholds (matches Supabase level_thresholds table)
 */
export const LEVEL_THRESHOLDS = [
  { level: 1, name: 'Aspiring Applicant', minPoints: 0 },
  { level: 2, name: 'Dedicated Dreamer', minPoints: 200 },
  { level: 3, name: 'Ambitious Achiever', minPoints: 600 },
  { level: 4, name: 'Committed Candidate', minPoints: 1000 },
  { level: 5, name: 'Goal Crusher', minPoints: 1600 },
  { level: 6, name: 'Peak Performer', minPoints: 2000 },
];

/**
 * Calculate level from points
 */
export function calculateLevel(points) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i].minPoints) {
      return LEVEL_THRESHOLDS[i];
    }
  }
  return LEVEL_THRESHOLDS[0];
}

/**
 * Main usePoints hook
 */
export function usePoints() {
  // Track if user is authenticated (determines Supabase vs localStorage)
  // Use centralized auth context instead of creating another subscription
  const { user: authUser, isLoading: authLoading } = useAuth();
  const isAuthenticated = !!authUser;
  const prevAuthUserRef = useRef(null);

  // State - initialize from localStorage (works for both modes initially)
  const [points, setPoints] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : mockUser.points;
  });

  const [history, setHistory] = useState(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [dailyCaps, setDailyCaps] = useState(() => getStoredDailyCaps());
  const [isLoading, setIsLoading] = useState(SUPABASE_CONFIGURED);
  const [currentLevel, setCurrentLevel] = useState(() => calculateLevel(points));

  // Fetch points when auth user changes
  useEffect(() => {
    // Skip if auth is still loading
    if (authLoading) return;

    // Only fetch if user changed (not just on every render)
    if (authUser?.id === prevAuthUserRef.current?.id) return;
    prevAuthUserRef.current = authUser;

    if (authUser && SUPABASE_CONFIGURED) {
      fetchUserPoints();
    } else {
      setIsLoading(false);
    }
  }, [authUser, authLoading]);

  // Persist to localStorage (always, as fallback)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, points.toString());
    setCurrentLevel(calculateLevel(points));
  }, [points]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(DAILY_CAPS_KEY, JSON.stringify(dailyCaps));
  }, [dailyCaps]);

  // Reset daily caps at midnight
  useEffect(() => {
    const today = getTodayKey();
    if (dailyCaps.date !== today) {
      setDailyCaps({ date: today, counts: {} });
    }
  }, [dailyCaps.date]);

  /**
   * Fetch user points from Supabase
   */
  const fetchUserPoints = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Get user points
      const { data: pointsData, error: pointsError } = await supabase
        .from('user_points')
        .select('total_points, current_level')
        .eq('user_id', user.id)
        .single();

      if (pointsError && pointsError.code !== 'PGRST116') {
        throw pointsError;
      }

      if (pointsData) {
        setPoints(pointsData.total_points);
        setCurrentLevel(LEVEL_THRESHOLDS[pointsData.current_level - 1] || LEVEL_THRESHOLDS[0]);
      }

      // Get recent history
      const { data: historyData, error: historyError } = await supabase
        .from('user_point_log')
        .select('*')
        .eq('user_id', user.id)
        .order('awarded_at', { ascending: false })
        .limit(100);

      if (historyError) throw historyError;

      setHistory((historyData || []).map(h => ({
        id: h.id,
        action: h.action_slug,
        amount: h.total_points,
        metadata: { referenceId: h.reference_id, referenceType: h.reference_type },
        timestamp: h.awarded_at,
      })));

      // Get today's action counts for daily caps
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const { data: todayCounts } = await supabase
        .from('user_point_log')
        .select('action_slug')
        .eq('user_id', user.id)
        .gte('awarded_at', todayStart.toISOString());

      if (todayCounts) {
        const counts = {};
        todayCounts.forEach(row => {
          counts[row.action_slug] = (counts[row.action_slug] || 0) + 1;
        });
        setDailyCaps({ date: getTodayKey(), counts });
      }
    } catch (err) {
      console.error('Error fetching user points:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Check daily cap for an action
   */
  const checkDailyCap = useCallback((action) => {
    const cap = DAILY_CAPS[action];
    if (!cap) {
      return { canSubmit: true, remaining: Infinity, cap: null };
    }

    const currentCount = dailyCaps.counts[action] || 0;
    const remaining = Math.max(0, cap - currentCount);

    return {
      canSubmit: remaining > 0,
      remaining,
      cap,
    };
  }, [dailyCaps]);

  /**
   * Increment daily count locally
   */
  const incrementDailyCount = useCallback((action) => {
    if (!DAILY_CAPS[action]) return;

    setDailyCaps((prev) => ({
      ...prev,
      counts: {
        ...prev.counts,
        [action]: (prev.counts[action] || 0) + 1,
      },
    }));
  }, []);

  /**
   * Award points to the user
   * @param {string} action - The action slug (from POINT_ACTIONS)
   * @param {number} [customAmount] - Optional custom point amount
   * @param {object} [metadata] - Additional data (referenceId, referenceType)
   * @returns {Promise<{ success: boolean, pointsAwarded: number, newTotal: number }>}
   */
  const awardPoints = useCallback(async (action, customAmount, metadata = {}) => {
    // Check daily cap
    const { canSubmit } = checkDailyCap(action);
    if (!canSubmit) {
      console.warn(`Daily cap reached for action: ${action}`);
      return { success: false, pointsAwarded: 0, newTotal: points, reason: 'daily_cap' };
    }

    const amount = customAmount ?? DEFAULT_POINT_VALUES[action] ?? 0;
    if (amount <= 0) {
      console.warn(`No points configured for action: ${action}`);
      return { success: false, pointsAwarded: 0, newTotal: points, reason: 'no_points' };
    }

    // If not authenticated or Supabase not configured, use localStorage
    if (!isAuthenticated || !SUPABASE_CONFIGURED) {
      const newTotal = points + amount;
      setPoints(newTotal);
      incrementDailyCount(action);

      const historyEntry = {
        id: `pts_${Date.now()}`,
        action,
        amount,
        metadata,
        timestamp: new Date().toISOString(),
      };
      setHistory((prev) => [historyEntry, ...prev].slice(0, 100));

      return { success: true, pointsAwarded: amount, newTotal };
    }

    // Authenticated: call Supabase function
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Fallback to localStorage if auth check fails
        const newTotal = points + amount;
        setPoints(newTotal);
        incrementDailyCount(action);
        return { success: true, pointsAwarded: amount, newTotal };
      }

      const { data, error } = await supabase.rpc('award_points', {
        p_user_id: user.id,
        p_action_slug: action,
        p_reference_id: metadata.referenceId || null,
        p_reference_type: metadata.referenceType || null,
      });

      if (error) throw error;

      const result = data?.[0];
      if (result?.success) {
        const newTotal = result.new_total;
        setPoints(newTotal);
        incrementDailyCount(action);

        // Add to local history
        const historyEntry = {
          id: `pts_${Date.now()}`,
          action,
          amount: result.points_awarded,
          metadata,
          timestamp: new Date().toISOString(),
        };
        setHistory((prev) => [historyEntry, ...prev].slice(0, 100));

        return { success: true, pointsAwarded: result.points_awarded, newTotal };
      } else {
        return { success: false, pointsAwarded: 0, newTotal: points, reason: result?.message };
      }
    } catch (err) {
      console.error('Error awarding points:', err);
      return { success: false, pointsAwarded: 0, newTotal: points, reason: err.message };
    }
  }, [points, checkDailyCap, incrementDailyCount, isAuthenticated]);

  /**
   * Get recent points history
   */
  const getRecentHistory = useCallback((limit = 10) => {
    return history.slice(0, limit);
  }, [history]);

  /**
   * Get total points earned today
   */
  const getPointsEarnedToday = useCallback(() => {
    const today = new Date().toDateString();
    return history
      .filter((entry) => new Date(entry.timestamp).toDateString() === today)
      .reduce((sum, entry) => sum + entry.amount, 0);
  }, [history]);

  /**
   * Get progress to next level
   */
  const getProgressToNextLevel = useCallback(() => {
    const currentLevelIndex = LEVEL_THRESHOLDS.findIndex(l => l.level === currentLevel.level);
    const nextLevel = LEVEL_THRESHOLDS[currentLevelIndex + 1];

    if (!nextLevel) {
      return { progress: 100, pointsNeeded: 0, nextLevel: null };
    }

    const pointsInCurrentLevel = points - currentLevel.minPoints;
    const pointsForNextLevel = nextLevel.minPoints - currentLevel.minPoints;
    const progress = Math.round((pointsInCurrentLevel / pointsForNextLevel) * 100);

    return {
      progress: Math.min(100, progress),
      pointsNeeded: nextLevel.minPoints - points,
      nextLevel,
    };
  }, [points, currentLevel]);

  return {
    // Data
    points,
    history,
    currentLevel,
    isLoading,

    // Methods
    awardPoints,
    checkDailyCap,
    getRecentHistory,
    getPointsEarnedToday,
    getProgressToNextLevel,
    refetch: fetchUserPoints,

    // Constants
    POINT_ACTIONS,
    LEVEL_THRESHOLDS,
  };
}

export default usePoints;
