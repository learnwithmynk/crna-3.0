/**
 * Smart Prompts - Main Orchestrator
 *
 * Evaluates all nudge engines and returns prioritized, filtered nudges
 * for display on the dashboard and inline contexts.
 */

import { evaluateDeadlineAlerts } from './engines/deadlineAlertEngine';
import { evaluateCertificationAlerts } from './engines/certificationEngine';
import { evaluateLORAlerts } from './engines/lorTrackingEngine';
import { evaluateInterviewAlerts } from './engines/interviewPrepEngine';
import { evaluateEngagementNudges } from './engines/engagementNudgeEngine';
import { evaluateEventNudges } from './engines/eventEngagementEngine';
import { evaluatePrerequisiteNudges } from './engines/prerequisiteGapEngine';
import { getTopNudges, sortByPriority } from './prioritySystem';
import {
  filterByFrequency,
  applyDashboardLimits,
  applyInlineLimits,
  recordShown,
  getStoredInteractions,
} from './frequencyManager';
import { inferUserStage } from './promptUtils';

// =============================================================================
// MAIN ORCHESTRATOR
// =============================================================================

/**
 * Evaluate all engines and return prioritized nudges
 *
 * @param {Object} data - All user data needed for evaluation
 * @returns {Object} - Categorized nudges for different display contexts
 */
export function evaluateAllEngines(data) {
  const {
    userData = {},
    targetPrograms = [],
    savedPrograms = [],
    certifications = [],
    letterRequests = [],
    savedEvents = [],
    academicProfile = {},
    trackerStats = {},
    readyScoreData = {},
    milestones = [],
    checklistProgress = {},
    today = new Date(),
  } = data;

  // Get stored interactions
  const interactions = getStoredInteractions();
  const dismissedPrompts = interactions.dismissed || {};
  const lastNudgeShown = interactions.shown || {};

  // Infer user stage if not provided
  const userStage = userData.currentStage || inferUserStage(userData, targetPrograms);
  const lastLoginAt = userData.lastLoginAt;

  // Common context for all engines
  const commonContext = {
    dismissedPrompts,
    lastNudgeShown,
    userStage,
    trackerStats,
    lastLoginAt,
    today,
  };

  // Evaluate all engines
  const allNudges = [];

  // 1. Deadline alerts (highest priority)
  const deadlineNudges = evaluateDeadlineAlerts({
    targetPrograms,
    ...commonContext,
  });
  allNudges.push(...deadlineNudges);

  // 2. Certification alerts
  const certNudges = evaluateCertificationAlerts({
    certifications,
    ...commonContext,
  });
  allNudges.push(...certNudges);

  // 3. LOR tracking alerts
  const lorNudges = evaluateLORAlerts({
    letterRequests,
    targetPrograms,
    ...commonContext,
  });
  allNudges.push(...lorNudges);

  // 4. Interview prep alerts
  const interviewNudges = evaluateInterviewAlerts({
    targetPrograms,
    ...commonContext,
  });
  allNudges.push(...interviewNudges);

  // 5. Engagement nudges (welcome back, streaks, celebrations)
  const engagementNudges = evaluateEngagementNudges({
    userData,
    targetPrograms,
    savedPrograms,
    trackerStats,
    readyScoreData,
    milestones,
    checklistProgress,
    ...commonContext,
  });
  allNudges.push(...engagementNudges);

  // 6. Event engagement nudges
  const eventNudges = evaluateEventNudges({
    savedEvents,
    ...commonContext,
  });
  allNudges.push(...eventNudges);

  // 7. Prerequisite gap nudges
  const prereqNudges = evaluatePrerequisiteNudges({
    academicProfile,
    targetPrograms,
    ...commonContext,
  });
  allNudges.push(...prereqNudges);

  // Sort by priority and filter by frequency rules
  const sortedNudges = sortByPriority(allNudges);
  const filteredNudges = filterByFrequency(sortedNudges);

  // Categorize nudges for different display contexts
  return categorizeNudges(filteredNudges);
}

/**
 * Categorize nudges for different display contexts
 */
function categorizeNudges(nudges) {
  // Separate by type
  const periodicNudges = nudges.filter(n => n.type === 'periodic');
  const inlineNudges = nudges.filter(n => n.type === 'inline');
  const celebrationNudges = nudges.filter(n => n.type === 'celebration');

  // Dashboard nudges (max 3, periodic only)
  const dashboardNudges = applyDashboardLimits(periodicNudges);

  // Find critical nudges (for mobile - show 1 critical if exists)
  const criticalNudge = periodicNudges.find(n => n.urgency === 'critical');

  // Get nudges by engine for page-specific displays
  const byEngine = {
    deadline: nudges.filter(n => n.engine === 'deadline'),
    certification: nudges.filter(n => n.engine === 'certification'),
    lor: nudges.filter(n => n.engine === 'lor'),
    interview: nudges.filter(n => n.engine === 'interview'),
    engagement: nudges.filter(n => n.engine === 'engagement'),
    event: nudges.filter(n => n.engine === 'event'),
    prerequisite: nudges.filter(n => n.engine === 'prerequisite'),
  };

  // Get inline nudges by page context
  const inlineByPage = {
    programs: applyInlineLimits([...byEngine.deadline, ...byEngine.lor]),
    stats: applyInlineLimits([...byEngine.certification, ...byEngine.prerequisite]),
    trackers: applyInlineLimits(byEngine.engagement),
    targetDetail: applyInlineLimits([...byEngine.interview, ...byEngine.deadline]),
  };

  return {
    // For dashboard display
    dashboard: dashboardNudges,

    // For mobile (single critical nudge)
    mobile: criticalNudge ? [criticalNudge] : dashboardNudges.slice(0, 1),

    // Inline nudges by page
    inline: inlineByPage,

    // By engine (for specific page sections)
    byEngine,

    // Celebrations (batched)
    celebrations: celebrationNudges,

    // All nudges for debugging/analytics
    all: nudges,

    // Stats
    stats: {
      total: nudges.length,
      critical: nudges.filter(n => n.urgency === 'critical').length,
      high: nudges.filter(n => n.urgency === 'high').length,
      medium: nudges.filter(n => n.urgency === 'medium').length,
      low: nudges.filter(n => n.urgency === 'low').length,
    },
  };
}

/**
 * Get nudges for a specific page/context
 *
 * @param {string} page - Page identifier (dashboard, programs, stats, trackers, targetDetail)
 * @param {Object} data - All user data
 * @returns {Array} - Nudges for that page
 */
export function getNudgesForPage(page, data) {
  const result = evaluateAllEngines(data);

  switch (page) {
    case 'dashboard':
      return result.dashboard;
    case 'programs':
      return result.inline.programs;
    case 'stats':
      return result.inline.stats;
    case 'trackers':
      return result.inline.trackers;
    case 'targetDetail':
      return result.inline.targetDetail;
    default:
      return result.dashboard;
  }
}

/**
 * Record that a nudge was shown (call when rendering)
 */
export function markNudgeShown(nudgeId) {
  recordShown(nudgeId);
}

/**
 * Get the single most important nudge (for notifications, mobile, etc.)
 */
export function getMostImportantNudge(data) {
  const result = evaluateAllEngines(data);
  return result.all[0] || null;
}

// Re-export utility functions for consumers
export { getStoredInteractions } from './frequencyManager';
export { recordDismissal, recordSnooze, clearSnooze } from './frequencyManager';
export { canShowCelebration, recordCelebration, clearPendingCelebrations } from './frequencyManager';
export { getPromptDefinition, getPromptsByEngine } from './promptDefinitions';

// Re-export action handlers from engines
export { handleMarkSubmitted } from './engines/deadlineAlertEngine';
export { handleMarkRenewed } from './engines/certificationEngine';
export { handleMarkReceived, handleMarkDeclined, getFollowUpTemplate } from './engines/lorTrackingEngine';
export { handleSetInterviewType, handleSetInterviewDate, handleUpdateOutcome, getThankYouTemplate } from './engines/interviewPrepEngine';
export { handleConfirmAttending, handleNotAttending, handleLogEvent, handleNotAttended } from './engines/eventEngagementEngine';
export { handleMarkPlanned } from './engines/prerequisiteGapEngine';

export default {
  evaluateAllEngines,
  getNudgesForPage,
  markNudgeShown,
  getMostImportantNudge,
};
