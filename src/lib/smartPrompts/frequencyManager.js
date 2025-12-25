/**
 * Smart Prompts - Frequency Manager
 *
 * Handles rate limiting, dismissals, and snoozing of nudges.
 * Uses localStorage for persistence across sessions.
 */

// =============================================================================
// CONSTANTS
// =============================================================================

const STORAGE_KEY = 'crnaclub_smartprompts';

/**
 * Frequency rules
 */
export const FREQUENCY_RULES = {
  maxDashboardNudges: 3,
  maxInlinePerPage: 2,
  maxPerSession: 5,
  minHoursBetweenNudges: 4,
  cooldownAfterDismiss: 7, // days
  maxDismissalsBeforeRemove: 3,
};

/**
 * Category-specific rules
 */
export const CATEGORY_RULES = {
  deadline: {
    frequency: 'daily', // For < 14 days
    canDismiss: false,
    canSnooze: true,
  },
  lor: {
    frequency: 'every_5_days',
    canDismiss: true,
    canSnooze: true,
  },
  certification: {
    frequency: 'every_7_days',
    canDismiss: true,
    canSnooze: true,
  },
  interview: {
    frequency: 'daily',
    canDismiss: false,
    canSnooze: true,
  },
  engagement: {
    frequency: 'daily',
    canDismiss: true,
    canSnooze: false,
  },
  event: {
    frequency: 'once_per_event',
    canDismiss: true,
    canSnooze: false,
  },
  prerequisite: {
    frequency: 'weekly',
    canDismiss: true,
    canSnooze: true,
  },
  celebration: {
    frequency: 'once_per_trigger',
    canDismiss: false,
    canSnooze: false,
  },
};

// =============================================================================
// STORAGE FUNCTIONS
// =============================================================================

/**
 * Get stored prompt interactions from localStorage
 */
export function getStoredInteractions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { dismissed: {}, snoozed: {}, shown: {}, session: {} };
    return JSON.parse(stored);
  } catch {
    return { dismissed: {}, snoozed: {}, shown: {}, session: {} };
  }
}

/**
 * Save prompt interactions to localStorage
 */
export function saveInteractions(interactions) {
  try {
    // Cleanup old entries (> 30 days)
    const cleaned = cleanupOldInteractions(interactions);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
  } catch {
    // Silently fail if localStorage is full
  }
}

/**
 * Remove interactions older than 30 days
 */
function cleanupOldInteractions(interactions) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const cutoff = thirtyDaysAgo.toISOString();

  const cleaned = {
    dismissed: {},
    snoozed: {},
    shown: {},
    session: interactions.session || {},
  };

  // Keep only recent dismissals
  Object.entries(interactions.dismissed || {}).forEach(([key, value]) => {
    if (value.at > cutoff) {
      cleaned.dismissed[key] = value;
    }
  });

  // Keep only active snoozes
  Object.entries(interactions.snoozed || {}).forEach(([key, value]) => {
    if (value.until > new Date().toISOString()) {
      cleaned.snoozed[key] = value;
    }
  });

  // Keep only recent shown timestamps
  Object.entries(interactions.shown || {}).forEach(([key, value]) => {
    if (value > cutoff) {
      cleaned.shown[key] = value;
    }
  });

  return cleaned;
}

// =============================================================================
// INTERACTION HANDLERS
// =============================================================================

/**
 * Record that a nudge was shown
 */
export function recordShown(nudgeId) {
  const interactions = getStoredInteractions();
  interactions.shown[nudgeId] = new Date().toISOString();

  // Track session count
  if (!interactions.session.date || !isToday(interactions.session.date)) {
    interactions.session = { date: new Date().toISOString(), count: 0 };
  }
  interactions.session.count = (interactions.session.count || 0) + 1;

  saveInteractions(interactions);
}

/**
 * Record that a nudge was dismissed
 */
export function recordDismissal(nudgeId) {
  const interactions = getStoredInteractions();
  const existing = interactions.dismissed[nudgeId] || { count: 0 };

  interactions.dismissed[nudgeId] = {
    count: existing.count + 1,
    at: new Date().toISOString(),
  };

  saveInteractions(interactions);
  return interactions.dismissed[nudgeId];
}

/**
 * Record that a nudge was snoozed
 */
export function recordSnooze(nudgeId, days = 7) {
  const interactions = getStoredInteractions();
  const snoozeUntil = new Date();
  snoozeUntil.setDate(snoozeUntil.getDate() + days);

  interactions.snoozed[nudgeId] = {
    until: snoozeUntil.toISOString(),
  };

  saveInteractions(interactions);
}

/**
 * Clear snooze for a nudge (e.g., when conditions change)
 */
export function clearSnooze(nudgeId) {
  const interactions = getStoredInteractions();
  delete interactions.snoozed[nudgeId];
  saveInteractions(interactions);
}

// =============================================================================
// FILTER FUNCTIONS
// =============================================================================

/**
 * Check if a nudge should be shown based on frequency rules
 */
export function shouldShowNudge(nudge, interactions = null) {
  interactions = interactions || getStoredInteractions();

  // Check if snoozed
  const snooze = interactions.snoozed[nudge.id];
  if (snooze && new Date(snooze.until) > new Date()) {
    return { show: false, reason: 'snoozed' };
  }

  // Check dismissal count
  const dismissal = interactions.dismissed[nudge.id];
  if (dismissal && dismissal.count >= FREQUENCY_RULES.maxDismissalsBeforeRemove) {
    return { show: false, reason: 'max_dismissals' };
  }

  // Check cooldown after dismissal
  if (dismissal && dismissal.at) {
    const daysSinceDismissal = Math.floor(
      (new Date() - new Date(dismissal.at)) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceDismissal < FREQUENCY_RULES.cooldownAfterDismiss) {
      return { show: false, reason: 'cooldown' };
    }
  }

  // Check minimum time between shows
  const lastShown = interactions.shown[nudge.id];
  if (lastShown) {
    const hoursSinceShown = (new Date() - new Date(lastShown)) / (1000 * 60 * 60);
    if (hoursSinceShown < FREQUENCY_RULES.minHoursBetweenNudges) {
      return { show: false, reason: 'too_recent' };
    }
  }

  // Check session limit
  if (
    interactions.session.date &&
    isToday(interactions.session.date) &&
    interactions.session.count >= FREQUENCY_RULES.maxPerSession
  ) {
    return { show: false, reason: 'session_limit' };
  }

  return { show: true, reason: null };
}

/**
 * Filter nudges based on frequency rules
 */
export function filterByFrequency(nudges) {
  const interactions = getStoredInteractions();
  return nudges.filter(nudge => shouldShowNudge(nudge, interactions).show);
}

/**
 * Apply dashboard limits (max 3 nudges)
 */
export function applyDashboardLimits(nudges) {
  return nudges.slice(0, FREQUENCY_RULES.maxDashboardNudges);
}

/**
 * Apply inline limits (max 2 per page)
 */
export function applyInlineLimits(nudges) {
  return nudges.slice(0, FREQUENCY_RULES.maxInlinePerPage);
}

// =============================================================================
// CELEBRATION BATCHING
// =============================================================================

/**
 * Track celebrations shown in session
 */
export function recordCelebration(celebrationType) {
  const interactions = getStoredInteractions();
  if (!interactions.session.celebrations) {
    interactions.session.celebrations = [];
  }
  interactions.session.celebrations.push({
    type: celebrationType,
    at: new Date().toISOString(),
  });
  saveInteractions(interactions);
}

/**
 * Check if we can show a celebration (max 1 per session)
 */
export function canShowCelebration() {
  const interactions = getStoredInteractions();
  if (!interactions.session.date || !isToday(interactions.session.date)) {
    return true;
  }
  return !interactions.session.celebrations?.length;
}

/**
 * Get pending celebrations for batching
 */
export function getPendingCelebrations() {
  const interactions = getStoredInteractions();
  return interactions.session.pendingCelebrations || [];
}

/**
 * Add a celebration to pending queue
 */
export function queueCelebration(celebration) {
  const interactions = getStoredInteractions();
  if (!interactions.session.pendingCelebrations) {
    interactions.session.pendingCelebrations = [];
  }
  interactions.session.pendingCelebrations.push(celebration);
  saveInteractions(interactions);
}

/**
 * Clear pending celebrations after showing summary
 */
export function clearPendingCelebrations() {
  const interactions = getStoredInteractions();
  interactions.session.pendingCelebrations = [];
  saveInteractions(interactions);
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Check if a date is today
 */
function isToday(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/**
 * Get interaction stats for debugging
 */
export function getInteractionStats() {
  const interactions = getStoredInteractions();
  return {
    dismissedCount: Object.keys(interactions.dismissed).length,
    snoozedCount: Object.keys(interactions.snoozed).length,
    shownCount: Object.keys(interactions.shown).length,
    sessionCount: interactions.session.count || 0,
    celebrationsShown: interactions.session.celebrations?.length || 0,
  };
}

/**
 * Reset all interactions (for testing)
 */
export function resetInteractions() {
  localStorage.removeItem(STORAGE_KEY);
}

export default {
  FREQUENCY_RULES,
  CATEGORY_RULES,
  getStoredInteractions,
  recordShown,
  recordDismissal,
  recordSnooze,
  clearSnooze,
  shouldShowNudge,
  filterByFrequency,
  applyDashboardLimits,
  applyInlineLimits,
  canShowCelebration,
  recordCelebration,
  queueCelebration,
  getPendingCelebrations,
  clearPendingCelebrations,
  getInteractionStats,
  resetInteractions,
};
