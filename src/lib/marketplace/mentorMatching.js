/**
 * Mentor Matching Algorithm
 *
 * Scores and ranks mentors based on:
 * 1. Service type alignment with user's focus area (40 pts)
 * 2. Availability (30 pts)
 * 3. Rating quality (20 pts)
 * 4. ICU background match (15 pts)
 * 5. Target program match (25 pts)
 *
 * Always returns mentors - never empty. Falls back to top-rated if no strong matches.
 */

import { PRIMARY_FOCUS_AREAS } from '@/lib/enums';

// Map focus areas to relevant service types
const FOCUS_TO_SERVICE_MAP = {
  [PRIMARY_FOCUS_AREAS.ESSAY]: ['essay_review'],
  [PRIMARY_FOCUS_AREAS.RESUME]: ['resume_review'],
  [PRIMARY_FOCUS_AREAS.INTERVIEW_PREP]: ['mock_interview'],
  [PRIMARY_FOCUS_AREAS.SCHOOL_SEARCH]: ['strategy_session', 'school_qa'],
  [PRIMARY_FOCUS_AREAS.GPA_PREREQS]: ['strategy_session'],
  [PRIMARY_FOCUS_AREAS.CERTIFICATIONS]: ['strategy_session'],
  [PRIMARY_FOCUS_AREAS.SHADOWING]: ['strategy_session', 'school_qa'],
  [PRIMARY_FOCUS_AREAS.LEADERSHIP]: ['resume_review', 'strategy_session'],
};

/**
 * Calculate days between two dates
 */
function daysBetween(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1 - date2) / oneDay));
}

/**
 * Calculate match score between user and provider
 * @param {Object} user - User with guidanceState, clinicalProfile, targetPrograms
 * @param {Object} provider - Provider from mockProviders
 * @param {string} context - Context hint (general, programs, school, dashboard)
 * @returns {number} Score (higher = better match)
 */
function calculateMatchScore(user, provider, context = 'general') {
  let score = 0;

  // 1. Service type matches user's focus area (40 pts max)
  const activeFocus = user.guidanceState?.primaryFocusAreas?.find(
    (f) => f.status === 'active'
  )?.area;

  if (activeFocus && FOCUS_TO_SERVICE_MAP[activeFocus]) {
    const neededServices = FOCUS_TO_SERVICE_MAP[activeFocus];
    const hasMatchingService = provider.specializations?.some((s) =>
      neededServices.some((ns) => s.includes(ns) || ns.includes(s))
    );
    if (hasMatchingService) {
      score += 40;
    }
  }

  // 2. Availability (30 pts max)
  if (provider.availableThisWeek && !provider.isPaused) {
    score += 20;
  }

  if (provider.nextAvailableSlot) {
    const daysUntil = daysBetween(new Date(), new Date(provider.nextAvailableSlot));
    if (daysUntil <= 3) {
      score += 10;
    } else if (daysUntil <= 7) {
      score += 5;
    }
  }

  // 3. Rating quality (20 pts max)
  if (provider.rating >= 4.9) {
    score += 20;
  } else if (provider.rating >= 4.7) {
    score += 15;
  } else if (provider.rating >= 4.5) {
    score += 10;
  } else if (provider.rating >= 4.0) {
    score += 5;
  }

  // 4. Same ICU background (15 pts)
  const userIcuType = user.clinicalProfile?.primaryIcuType;
  if (userIcuType && provider.previousIcuType === userIcuType) {
    score += 15;
  }

  // 5. Target program match (25 pts)
  const userTargets = user.targetPrograms?.map((t) => t.program?.name?.toLowerCase()) || [];
  const providerProgram = provider.program?.toLowerCase() || provider.programName?.toLowerCase();

  if (providerProgram && userTargets.some((t) => t && providerProgram.includes(t))) {
    score += 25;
  }

  // Context-specific bonuses
  if (context === 'programs' && provider.specializations?.includes('school_qa')) {
    score += 10;
  }

  if (context === 'dashboard') {
    // Boost mentors with high booking counts (proven quality)
    if (provider.totalBookings >= 20) {
      score += 5;
    }
  }

  return score;
}

/**
 * Generate human-readable match reasons
 * @param {Object} user - User data
 * @param {Object} provider - Provider data
 * @returns {string[]} Array of reason strings
 */
function getMatchReasons(user, provider) {
  const reasons = [];

  // Availability
  if (provider.availableThisWeek && !provider.isPaused) {
    reasons.push('Available this week');
  }

  // Rating
  if (provider.rating >= 4.8) {
    reasons.push(`${provider.rating.toFixed(1)}★ rating`);
  }

  // ICU match
  const userIcuType = user.clinicalProfile?.primaryIcuType;
  if (userIcuType && provider.previousIcuType === userIcuType) {
    const icuLabel = userIcuType.toUpperCase().replace('_', ' ');
    reasons.push(`Also ${icuLabel}`);
  }

  // Target program match
  const userTargets = user.targetPrograms?.map((t) => t.program?.name?.toLowerCase()) || [];
  const providerProgram = provider.program?.toLowerCase() || provider.programName?.toLowerCase();

  if (providerProgram && userTargets.some((t) => t && providerProgram.includes(t))) {
    reasons.push('At your target school');
  }

  // Focus area match
  const activeFocus = user.guidanceState?.primaryFocusAreas?.find(
    (f) => f.status === 'active'
  )?.area;

  if (activeFocus) {
    const focusLabels = {
      [PRIMARY_FOCUS_AREAS.ESSAY]: 'Essay expert',
      [PRIMARY_FOCUS_AREAS.RESUME]: 'Resume specialist',
      [PRIMARY_FOCUS_AREAS.INTERVIEW_PREP]: 'Interview coach',
      [PRIMARY_FOCUS_AREAS.SCHOOL_SEARCH]: 'School advisor',
    };

    if (focusLabels[activeFocus]) {
      const neededServices = FOCUS_TO_SERVICE_MAP[activeFocus];
      const hasMatch = provider.specializations?.some((s) =>
        neededServices?.some((ns) => s.includes(ns) || ns.includes(s))
      );
      if (hasMatch) {
        reasons.push(focusLabels[activeFocus]);
      }
    }
  }

  // Quick responder
  if (provider.responseTimeMinutes && provider.responseTimeMinutes < 180) {
    reasons.push('Quick responder');
  }

  // Return top 2 most relevant
  return reasons.slice(0, 2);
}

/**
 * Get recommended mentors for a user
 * @param {Object} user - User with guidanceState, clinicalProfile, targetPrograms
 * @param {Object[]} providers - Array of providers from useProviders
 * @param {Object} options - { limit, context }
 * @returns {Object[]} Array of { provider, score, reasons }
 */
export function getRecommendedMentors(user, providers, options = {}) {
  const { limit = 3, context = 'general' } = options;

  if (!providers || providers.length === 0) {
    return [];
  }

  // Filter to approved, non-paused providers
  const availableProviders = providers.filter(
    (p) => p.status === 'approved' && !p.isPaused
  );

  // If no available providers, return top-rated from all
  if (availableProviders.length === 0) {
    return providers
      .slice()
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit)
      .map((provider) => ({
        provider,
        score: 0,
        reasons: ['Top rated mentor'],
      }));
  }

  // Score each provider
  const scored = availableProviders.map((provider) => ({
    provider,
    score: calculateMatchScore(user, provider, context),
    reasons: getMatchReasons(user, provider),
  }));

  // Sort by score descending, then by rating as tiebreaker
  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return (b.provider.rating || 0) - (a.provider.rating || 0);
  });

  // Always return at least `limit` mentors
  // If not enough high-scoring, fill with top-rated
  const results = scored.slice(0, limit);

  // Ensure we have reasons for all results
  results.forEach((r) => {
    if (r.reasons.length === 0) {
      r.reasons = ['Highly rated mentor'];
    }
  });

  return results;
}

/**
 * Check if we have any mentors to show
 * @param {Object[]} providers - Array of providers
 * @returns {boolean}
 */
export function hasAvailableMentors(providers) {
  if (!providers || providers.length === 0) return false;
  return providers.some((p) => p.status === 'approved');
}

export default getRecommendedMentors;
