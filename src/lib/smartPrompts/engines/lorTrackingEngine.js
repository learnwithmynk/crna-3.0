/**
 * LOR (Letter of Recommendation) Tracking Engine
 *
 * Generates nudges for pending LOR requests at 21 and 30 days,
 * and alerts when missing LORs with deadline approaching.
 */

import { LOR_PROMPTS } from '../promptDefinitions';
import { daysSince, daysUntil, generateNudgeId, formatProgramName } from '../promptUtils';
import { calculatePriority } from '../prioritySystem';

/**
 * LOR statuses
 */
export const LOR_STATUSES = {
  NOT_REQUESTED: 'not_requested',
  REQUESTED: 'requested',
  RECEIVED: 'received',
  DECLINED: 'declined',
};

/**
 * Evaluate LOR tracking alerts
 */
export function evaluateLORAlerts({
  letterRequests = [],
  targetPrograms = [],
  dismissedPrompts = {},
  lastNudgeShown = {},
  userStage,
  trackerStats,
  lastLoginAt,
  today = new Date(),
}) {
  const nudges = [];

  // Check for pending LOR requests (21 and 30 days)
  const pendingRequests = letterRequests.filter(
    lor => lor.status === LOR_STATUSES.REQUESTED && lor.requestedDate
  );

  for (const lor of pendingRequests) {
    const daysPending = daysSince(lor.requestedDate, today);

    let promptDef = null;

    if (daysPending >= 30) {
      promptDef = LOR_PROMPTS.LOR_PENDING_30;
    } else if (daysPending >= 21) {
      promptDef = LOR_PROMPTS.LOR_PENDING_21;
    }

    if (!promptDef) continue;

    const nudgeId = generateNudgeId(promptDef.id, { recommenderName: lor.recommenderName });

    const nudge = {
      id: nudgeId,
      promptId: promptDef.id,
      engine: 'lor',
      type: promptDef.type,
      urgency: promptDef.urgency,
      title: interpolate(promptDef.titleTemplate, {
        recommenderName: lor.recommenderName || 'your recommender',
      }),
      message: promptDef.messageTemplate,
      actions: promptDef.actions.map(action => ({
        ...action,
        context: { lorId: lor.id, recommenderName: lor.recommenderName },
      })),
      dismissible: promptDef.dismissible,
      snoozeable: promptDef.snoozeable,
      context: {
        lorId: lor.id,
        recommenderName: lor.recommenderName,
        requestedDate: lor.requestedDate,
        daysPending,
      },
      priority: calculatePriority({
        urgency: promptDef.urgency,
        engine: 'lor',
        userStage,
        trackerStats,
        lastLoginAt,
        lastShownAt: lastNudgeShown[nudgeId],
        dismissalCount: dismissedPrompts[nudgeId]?.count || 0,
      }),
    };

    nudges.push(nudge);
  }

  // Check for programs with missing LORs and approaching deadlines
  const programsNeedingLORs = targetPrograms.filter(program => {
    if (!program.applicationDeadline) return false;
    if (program.status === 'submitted' || program.status === 'accepted') return false;

    const daysToDeadline = daysUntil(program.applicationDeadline, today);
    if (daysToDeadline > 14 || daysToDeadline < 0) return false;

    const requiredLORs = program.lorRequirements?.required || 3;
    const receivedLORs = letterRequests.filter(
      lor => lor.status === LOR_STATUSES.RECEIVED &&
             (lor.programIds?.includes(program.id) || !lor.programIds)
    ).length;

    return receivedLORs < requiredLORs;
  });

  for (const program of programsNeedingLORs) {
    const requiredLORs = program.lorRequirements?.required || 3;
    const receivedLORs = letterRequests.filter(
      lor => lor.status === LOR_STATUSES.RECEIVED &&
             (lor.programIds?.includes(program.id) || !lor.programIds)
    ).length;
    const lorNeeded = requiredLORs - receivedLORs;
    const daysRemaining = daysUntil(program.applicationDeadline, today);

    const promptDef = LOR_PROMPTS.LOR_INCOMPLETE_DEADLINE;
    const nudgeId = generateNudgeId(promptDef.id, { programId: program.id });

    const nudge = {
      id: nudgeId,
      promptId: promptDef.id,
      engine: 'lor',
      type: promptDef.type,
      urgency: promptDef.urgency,
      title: interpolate(promptDef.titleTemplate, {
        lorCount: lorNeeded,
        programName: formatProgramName(program),
      }),
      message: interpolate(promptDef.messageTemplate, {
        daysRemaining,
      }),
      actions: promptDef.actions.map(action => ({
        ...action,
        context: { programId: program.id },
      })),
      dismissible: promptDef.dismissible,
      snoozeable: promptDef.snoozeable,
      context: {
        programId: program.id,
        programName: formatProgramName(program),
        lorNeeded,
        daysRemaining,
      },
      priority: calculatePriority({
        urgency: promptDef.urgency,
        engine: 'lor',
        userStage,
        trackerStats,
        lastLoginAt,
        lastShownAt: lastNudgeShown[nudgeId],
        dismissalCount: dismissedPrompts[nudgeId]?.count || 0,
      }),
    };

    nudges.push(nudge);
  }

  // Sort by priority
  return nudges.sort((a, b) => b.priority - a.priority);
}

/**
 * Simple template interpolation
 */
function interpolate(template, values) {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return result;
}

/**
 * Handle "Mark as Received" action
 */
export function handleMarkReceived(lorId) {
  return {
    lorId,
    newStatus: LOR_STATUSES.RECEIVED,
    receivedAt: new Date().toISOString(),
  };
}

/**
 * Handle "They Declined" action
 */
export function handleMarkDeclined(lorId) {
  return {
    lorId,
    newStatus: LOR_STATUSES.DECLINED,
    declinedAt: new Date().toISOString(),
  };
}

/**
 * Get follow-up email template
 */
export function getFollowUpTemplate(recommenderName) {
  return `Dear ${recommenderName || '[Recommender Name]'},

I hope this message finds you well. I wanted to follow up on my request for a letter of recommendation that I sent a few weeks ago.

I completely understand how busy you are, and I truly appreciate you considering my request. If you need any additional information about the programs I'm applying to or my goals, I'd be happy to provide them.

If you're unable to write the letter at this time, please let me know so I can make alternative arrangements.

Thank you again for your time and support.

Best regards,
[Your Name]`;
}

export default {
  LOR_STATUSES,
  evaluateLORAlerts,
  handleMarkReceived,
  handleMarkDeclined,
  getFollowUpTemplate,
};
