/**
 * useBadges Hook
 *
 * Provides methods for tracking and awarding user badges.
 * Uses localStorage for mock mode, with Supabase integration ready.
 *
 * Badge definitions match the Supabase migration: 20251214600000_user_badges.sql
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from './useAuth';

// Check if Supabase is configured
const SUPABASE_CONFIGURED = isSupabaseConfigured();

// Storage keys
const EARNED_BADGES_KEY = 'crna_club_earned_badges';
const BADGE_NOTIFICATION_KEY = 'crna_club_badge_notifications';

/**
 * Badge definitions - matches Supabase seed data
 */
export const BADGES = [
  {
    id: 'critical_care_crusher',
    slug: 'critical_care_crusher',
    name: 'Critical Care Crusher',
    description: 'Submit at least 20 clinical tracker entries',
    requirementType: 'clinical_entries',
    requirementCount: 20,
    category: 'engagement',
    iconName: 'Heart',
    color: 'teal',
    pointsAwarded: 50,
  },
  {
    id: 'target_trailblazer',
    slug: 'target_trailblazer',
    name: 'Target Trailblazer',
    description: 'Convert at least 3 programs to your target list',
    requirementType: 'target_programs',
    requirementCount: 3,
    category: 'progression',
    iconName: 'Target',
    color: 'blue',
    pointsAwarded: 30,
  },
  {
    id: 'lesson_legend',
    slug: 'lesson_legend',
    name: 'Lesson Legend',
    description: 'Complete at least 20 lessons',
    requirementType: 'lessons_completed',
    requirementCount: 20,
    category: 'learning',
    iconName: 'BookOpen',
    color: 'purple',
    pointsAwarded: 50,
  },
  {
    id: 'milestone_machine',
    slug: 'milestone_machine',
    name: 'Milestone Machine',
    description: 'Complete at least 7 application milestones',
    requirementType: 'milestones_completed',
    requirementCount: 7,
    category: 'progression',
    iconName: 'Flag',
    color: 'green',
    pointsAwarded: 40,
  },
  {
    id: 'top_contributor',
    slug: 'top_contributor',
    name: 'Top Contributor',
    description: 'Post or reply in forums at least 10 times',
    requirementType: 'forum_posts',
    requirementCount: 10,
    category: 'community',
    iconName: 'MessageCircle',
    color: 'orange',
    pointsAwarded: 30,
  },
  {
    id: 'feedback_champion',
    slug: 'feedback_champion',
    name: 'Feedback Champion',
    description: 'Submit the "Let Us Know" form at least 3 times',
    requirementType: 'feedback_submitted',
    requirementCount: 3,
    category: 'community',
    iconName: 'Send',
    color: 'pink',
    pointsAwarded: 25,
  },
  {
    id: 'eq_master',
    slug: 'eq_master',
    name: 'EQ Master',
    description: 'Log at least 15 EQ/leadership reflections',
    requirementType: 'eq_reflections',
    requirementCount: 15,
    category: 'engagement',
    iconName: 'Brain',
    color: 'violet',
    pointsAwarded: 40,
  },
  {
    id: 'shadow_seeker',
    slug: 'shadow_seeker',
    name: 'Shadow Seeker',
    description: 'Log at least 10 shadow day experiences',
    requirementType: 'shadow_days',
    requirementCount: 10,
    category: 'engagement',
    iconName: 'Sun',
    color: 'amber',
    pointsAwarded: 35,
  },
];

/**
 * Get color classes for a badge
 */
export function getBadgeColors(color) {
  const colors = {
    teal: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
    violet: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  };
  return colors[color] || colors.teal;
}

/**
 * Main useBadges hook
 */
export function useBadges() {
  // Use centralized auth - prevents duplicate auth listeners
  const { user, isAuthenticated: authIsAuthenticated } = useAuth();
  const isAuthenticated = authIsAuthenticated && !!user;
  const hasFetchedRef = useRef(false);

  // Earned badges state - initialize from localStorage
  const [earnedBadges, setEarnedBadges] = useState(() => {
    const stored = localStorage.getItem(EARNED_BADGES_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // Pending notification (newly earned badge to show)
  const [pendingNotification, setPendingNotification] = useState(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(SUPABASE_CONFIGURED);

  // Fetch badges when user becomes authenticated
  useEffect(() => {
    if (!SUPABASE_CONFIGURED) {
      setIsLoading(false);
      return;
    }

    if (user && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchEarnedBadges();
    } else if (!user) {
      setIsLoading(false);
    }
  }, [user]);

  // Persist to localStorage (always, as fallback)
  useEffect(() => {
    localStorage.setItem(EARNED_BADGES_KEY, JSON.stringify(earnedBadges));
  }, [earnedBadges]);

  /**
   * Fetch earned badges from Supabase
   */
  const fetchEarnedBadges = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          badge_id,
          earned_at,
          count_at_earn,
          badges (
            slug,
            name,
            description,
            requirement_type,
            requirement_count,
            category,
            icon_name,
            color,
            points_awarded
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formatted = (data || []).map(ub => ({
        badgeSlug: ub.badges.slug,
        earnedAt: ub.earned_at,
        countAtEarn: ub.count_at_earn,
      }));

      setEarnedBadges(formatted);
    } catch (err) {
      console.error('Error fetching badges:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Check if a badge is earned
   */
  const isBadgeEarned = useCallback((badgeSlug) => {
    return earnedBadges.some(eb => eb.badgeSlug === badgeSlug);
  }, [earnedBadges]);

  /**
   * Get earned badge info (with earnedAt date)
   */
  const getEarnedBadge = useCallback((badgeSlug) => {
    return earnedBadges.find(eb => eb.badgeSlug === badgeSlug);
  }, [earnedBadges]);

  /**
   * Check if user qualifies for a badge and award it if so
   * @param {string} requirementType - The type of requirement (clinical_entries, etc.)
   * @param {number} currentCount - Current count for that requirement
   * @returns {object|null} - The newly awarded badge, or null
   */
  const checkAndAwardBadge = useCallback(async (requirementType, currentCount) => {
    // Find badges of this type that user hasn't earned yet
    const eligibleBadges = BADGES.filter(badge =>
      badge.requirementType === requirementType &&
      badge.requirementCount <= currentCount &&
      !isBadgeEarned(badge.slug)
    );

    if (eligibleBadges.length === 0) return null;

    // Award the first eligible badge (they're ordered by requirement)
    const badgeToAward = eligibleBadges[0];

    // If not authenticated or Supabase not configured, use localStorage
    if (!isAuthenticated || !SUPABASE_CONFIGURED) {
      const newEarned = {
        badgeSlug: badgeToAward.slug,
        earnedAt: new Date().toISOString(),
        countAtEarn: currentCount,
      };

      setEarnedBadges(prev => [...prev, newEarned]);
      setPendingNotification(badgeToAward);

      console.log(`[localStorage] Badge earned: ${badgeToAward.name}`);
      return badgeToAward;
    }

    // Authenticated: call Supabase function
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Fallback to localStorage
        const newEarned = {
          badgeSlug: badgeToAward.slug,
          earnedAt: new Date().toISOString(),
          countAtEarn: currentCount,
        };
        setEarnedBadges(prev => [...prev, newEarned]);
        setPendingNotification(badgeToAward);
        return badgeToAward;
      }

      const { data, error } = await supabase.rpc('award_badge', {
        p_user_id: user.id,
        p_badge_slug: badgeToAward.slug,
        p_count_at_earn: currentCount,
      });

      if (error) throw error;

      if (data?.[0]?.success && !data[0].already_earned) {
        const newEarned = {
          badgeSlug: badgeToAward.slug,
          earnedAt: new Date().toISOString(),
          countAtEarn: currentCount,
        };

        setEarnedBadges(prev => [...prev, newEarned]);
        setPendingNotification(badgeToAward);

        return badgeToAward;
      }
    } catch (err) {
      console.error('Error awarding badge:', err);
    }

    return null;
  }, [isBadgeEarned, isAuthenticated]);

  /**
   * Clear the pending notification (after showing modal)
   */
  const clearNotification = useCallback(() => {
    setPendingNotification(null);
  }, []);

  /**
   * Get all badges with earned status
   */
  const allBadgesWithStatus = useMemo(() => {
    return BADGES.map(badge => {
      const earned = getEarnedBadge(badge.slug);
      return {
        ...badge,
        isEarned: !!earned,
        earnedAt: earned?.earnedAt || null,
        countAtEarn: earned?.countAtEarn || null,
      };
    });
  }, [getEarnedBadge]);

  /**
   * Get badges by category
   */
  const badgesByCategory = useMemo(() => {
    const categories = {};
    allBadgesWithStatus.forEach(badge => {
      if (!categories[badge.category]) {
        categories[badge.category] = [];
      }
      categories[badge.category].push(badge);
    });
    return categories;
  }, [allBadgesWithStatus]);

  /**
   * Get summary stats
   */
  const summary = useMemo(() => ({
    totalBadges: BADGES.length,
    earnedCount: earnedBadges.length,
    totalPointsFromBadges: earnedBadges.reduce((sum, eb) => {
      const badge = BADGES.find(b => b.slug === eb.badgeSlug);
      return sum + (badge?.pointsAwarded || 0);
    }, 0),
  }), [earnedBadges]);

  return {
    // Badge data
    badges: BADGES,
    allBadgesWithStatus,
    badgesByCategory,
    earnedBadges,
    summary,

    // State
    isLoading,
    pendingNotification,

    // Methods
    isBadgeEarned,
    getEarnedBadge,
    checkAndAwardBadge,
    clearNotification,
    refetch: fetchEarnedBadges,

    // Helpers
    getBadgeColors,
  };
}

/**
 * Hook for checking badges after specific actions
 * Use this in trackers to auto-check badge eligibility
 */
export function useBadgeCheck(requirementType) {
  const { checkAndAwardBadge, isBadgeEarned } = useBadges();

  const checkBadge = useCallback(async (currentCount) => {
    return checkAndAwardBadge(requirementType, currentCount);
  }, [checkAndAwardBadge, requirementType]);

  // Get the relevant badge for this requirement type
  const relevantBadge = useMemo(() => {
    return BADGES.find(b => b.requirementType === requirementType);
  }, [requirementType]);

  const isEarned = relevantBadge ? isBadgeEarned(relevantBadge.slug) : false;

  return {
    checkBadge,
    relevantBadge,
    isEarned,
    targetCount: relevantBadge?.requirementCount || 0,
  };
}

export default useBadges;
