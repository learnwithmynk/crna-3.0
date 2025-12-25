/**
 * Smart Prompts - Priority Scoring System
 *
 * Algorithm: Priority = (Urgency × 0.4) + (Relevance × 0.3) + (Engagement × 0.2) + (Recency × 0.1)
 */

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Urgency scores by level
 */
export const URGENCY_SCORES = {
  critical: 100,  // Deadline < 7 days, cert expired
  high: 75,       // Deadline < 14 days, LOR pending 21+ days
  medium: 50,     // Deadline < 30 days, streak at risk
  low: 25,        // Informational, celebration
};

/**
 * Relevance multipliers by engine and user stage
 * Higher = more relevant to that stage
 */
export const RELEVANCE_BY_STAGE = {
  deadline: {
    exploring: 0.3,
    preparing: 0.6,
    applying: 1.0,
    interviewing: 0.4,
    accepted: 0.1,
    srna: 0.0,
  },
  certification: {
    exploring: 0.5,
    preparing: 0.8,
    applying: 0.9,
    interviewing: 0.6,
    accepted: 0.2,
    srna: 0.3,
  },
  lor: {
    exploring: 0.2,
    preparing: 0.6,
    applying: 1.0,
    interviewing: 0.5,
    accepted: 0.1,
    srna: 0.0,
  },
  interview: {
    exploring: 0.1,
    preparing: 0.2,
    applying: 0.5,
    interviewing: 1.0,
    accepted: 0.3,
    srna: 0.0,
  },
  engagement: {
    exploring: 0.8,
    preparing: 0.7,
    applying: 0.6,
    interviewing: 0.5,
    accepted: 0.4,
    srna: 0.5,
  },
  event: {
    exploring: 0.9,
    preparing: 0.8,
    applying: 0.6,
    interviewing: 0.4,
    accepted: 0.2,
    srna: 0.3,
  },
  prerequisite: {
    exploring: 0.7,
    preparing: 0.9,
    applying: 0.7,
    interviewing: 0.3,
    accepted: 0.1,
    srna: 0.0,
  },
};

/**
 * Weight factors for the priority formula
 */
const WEIGHTS = {
  urgency: 0.4,
  relevance: 0.3,
  engagement: 0.2,
  recency: 0.1,
};

// =============================================================================
// PRIORITY CALCULATION
// =============================================================================

/**
 * Calculate engagement score based on user activity
 * Higher engagement = lower priority (they're already engaged)
 */
function calculateEngagementScore(trackerStats, lastLoginAt) {
  if (!trackerStats && !lastLoginAt) return 50; // Default middle

  let score = 100; // Start high (not engaged)

  // Recent login reduces score (already engaged)
  if (lastLoginAt) {
    const daysSinceLogin = Math.floor(
      (new Date() - new Date(lastLoginAt)) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceLogin === 0) score -= 40;
    else if (daysSinceLogin === 1) score -= 30;
    else if (daysSinceLogin < 7) score -= 20;
  }

  // Recent tracker activity reduces score
  if (trackerStats) {
    const hasRecentActivity = Object.values(trackerStats).some(stat => {
      if (!stat?.lastEntryDate) return false;
      const daysSince = Math.floor(
        (new Date() - new Date(stat.lastEntryDate)) / (1000 * 60 * 60 * 24)
      );
      return daysSince < 3;
    });
    if (hasRecentActivity) score -= 20;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate recency score based on when prompt was last shown
 * Recently shown = lower priority
 */
function calculateRecencyScore(lastShownAt, minHoursBetween = 4) {
  if (!lastShownAt) return 100; // Never shown = highest priority

  const hoursSinceShown = (new Date() - new Date(lastShownAt)) / (1000 * 60 * 60);

  if (hoursSinceShown < minHoursBetween) return 0; // Too recent
  if (hoursSinceShown < 24) return 50;
  if (hoursSinceShown < 72) return 75;
  return 100; // Old enough
}

/**
 * Calculate the final priority score for a nudge
 */
export function calculatePriority({
  urgency,
  engine,
  userStage,
  trackerStats,
  lastLoginAt,
  lastShownAt,
  dismissalCount = 0,
}) {
  // Get base scores
  const urgencyScore = URGENCY_SCORES[urgency] || 50;
  const relevanceScore = (RELEVANCE_BY_STAGE[engine]?.[userStage] || 0.5) * 100;
  const engagementScore = calculateEngagementScore(trackerStats, lastLoginAt);
  const recencyScore = calculateRecencyScore(lastShownAt);

  // Calculate weighted total
  let priority =
    urgencyScore * WEIGHTS.urgency +
    relevanceScore * WEIGHTS.relevance +
    engagementScore * WEIGHTS.engagement +
    recencyScore * WEIGHTS.recency;

  // Apply dismissal penalty
  if (dismissalCount === 1) priority -= 30;
  if (dismissalCount >= 2) priority -= 50;
  if (dismissalCount >= 3) return -1; // Remove from queue

  return Math.round(Math.max(0, Math.min(100, priority)));
}

/**
 * Sort nudges by priority (highest first)
 */
export function sortByPriority(nudges) {
  return [...nudges].sort((a, b) => b.priority - a.priority);
}

/**
 * Filter nudges to only include those above threshold
 */
export function filterByThreshold(nudges, threshold = 20) {
  return nudges.filter(n => n.priority >= threshold);
}

/**
 * Get the top N nudges by priority
 */
export function getTopNudges(nudges, n = 3) {
  return sortByPriority(nudges).slice(0, n);
}

export default {
  URGENCY_SCORES,
  RELEVANCE_BY_STAGE,
  calculatePriority,
  sortByPriority,
  filterByThreshold,
  getTopNudges,
};
