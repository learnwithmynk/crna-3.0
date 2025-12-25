/**
 * useRecommendedMentors Hook
 *
 * Returns personalized mentor recommendations based on user's
 * focus areas, availability needs, and background.
 *
 * Usage:
 *   const { mentors, matchData, loading, hasMentors } = useRecommendedMentors({
 *     limit: 3,
 *     context: 'dashboard' // 'general' | 'programs' | 'school' | 'dashboard'
 *   });
 */

import { useMemo } from 'react';
import { useUser } from './useUser';
import { useProviders } from './useProviders';
import { getRecommendedMentors, hasAvailableMentors } from '@/lib/marketplace/mentorMatching';

/**
 * Get recommended mentors for the current user
 * @param {Object} options
 * @param {number} options.limit - Max mentors to return (default: 3)
 * @param {string} options.context - Context for matching: 'general', 'programs', 'school', 'dashboard'
 * @returns {Object} { mentors, matchData, loading, hasMentors }
 */
export function useRecommendedMentors(options = {}) {
  const { limit = 3, context = 'general' } = options;

  const { user, loading: userLoading } = useUser();
  const { providers, loading: providersLoading } = useProviders({
    availableNow: false, // We want all providers, will filter in matching
  });

  const loading = userLoading || providersLoading;

  const recommendations = useMemo(() => {
    if (!user || !providers || providers.length === 0) {
      return [];
    }

    return getRecommendedMentors(user, providers, { limit, context });
  }, [user, providers, limit, context]);

  const mentors = useMemo(
    () => recommendations.map((r) => r.provider),
    [recommendations]
  );

  const hasMentors = useMemo(
    () => hasAvailableMentors(providers),
    [providers]
  );

  return {
    mentors,
    matchData: recommendations,
    loading,
    hasMentors: hasMentors && mentors.length > 0,
  };
}

export default useRecommendedMentors;
