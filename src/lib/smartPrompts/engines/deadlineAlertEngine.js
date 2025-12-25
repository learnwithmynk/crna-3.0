/**
 * Deadline Alert Engine
 *
 * Generates nudges for application deadlines at 30, 14, and 7 days.
 * Each nudge includes "Did you submit?" confirmation.
 */

import { DEADLINE_PROMPTS } from '../promptDefinitions';
import { daysUntil, generateNudgeId, formatProgramName } from '../promptUtils';
import { calculatePriority } from '../prioritySystem';

/**
 * Evaluate deadline alerts for all target programs
 */
export function evaluateDeadlineAlerts({
  targetPrograms = [],
  dismissedPrompts = {},
  lastNudgeShown = {},
  userStage,
  trackerStats,
  lastLoginAt,
  today = new Date(),
}) {
  const nudges = [];

  // Only check programs that haven't been submitted
  const activePrograms = targetPrograms.filter(
    p => p.status !== 'submitted' && p.status !== 'accepted' && p.status !== 'rejected' && p.applicationDeadline
  );

  for (const program of activePrograms) {
    const daysRemaining = daysUntil(program.applicationDeadline, today);

    // Skip if deadline has passed
    if (daysRemaining < 0) continue;

    // Calculate checklist progress
    const progress = calculateProgress(program);

    // Determine which prompt to show based on days remaining
    let promptDef = null;

    if (daysRemaining <= 7) {
      promptDef = DEADLINE_PROMPTS.DEADLINE_7;
    } else if (daysRemaining <= 14) {
      promptDef = DEADLINE_PROMPTS.DEADLINE_14;
    } else if (daysRemaining <= 30) {
      promptDef = DEADLINE_PROMPTS.DEADLINE_30;
    }

    if (!promptDef) continue;

    const nudgeId = generateNudgeId(promptDef.id, { programId: program.id });

    // Build the nudge
    const nudge = {
      id: nudgeId,
      promptId: promptDef.id,
      engine: 'deadline',
      type: promptDef.type,
      urgency: promptDef.urgency,
      title: interpolate(promptDef.titleTemplate, {
        programName: formatProgramName(program),
      }),
      message: interpolate(promptDef.messageTemplate, {
        progress: progress,
      }),
      actions: promptDef.actions.map(action => ({
        ...action,
        href: action.href?.replace('{{programId}}', program.id),
      })),
      dismissible: promptDef.dismissible,
      snoozeable: promptDef.snoozeable,
      context: {
        programId: program.id,
        programName: formatProgramName(program),
        daysRemaining,
        progress,
        deadline: program.applicationDeadline,
      },
      priority: calculatePriority({
        urgency: promptDef.urgency,
        engine: 'deadline',
        userStage,
        trackerStats,
        lastLoginAt,
        lastShownAt: lastNudgeShown[nudgeId],
        dismissalCount: dismissedPrompts[nudgeId]?.count || 0,
      }),
    };

    nudges.push(nudge);
  }

  // Sort by days remaining (most urgent first)
  return nudges.sort((a, b) => a.context.daysRemaining - b.context.daysRemaining);
}

/**
 * Calculate checklist completion progress
 */
function calculateProgress(program) {
  if (!program.checklistItems || program.checklistItems.length === 0) {
    return 0;
  }

  const completed = program.checklistItems.filter(item => item.completed).length;
  return Math.round((completed / program.checklistItems.length) * 100);
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
 * Handle "Yes, I submitted" action
 * Returns updated program status
 */
export function handleMarkSubmitted(programId) {
  return {
    programId,
    newStatus: 'submitted',
    submittedAt: new Date().toISOString(),
  };
}

export default {
  evaluateDeadlineAlerts,
  handleMarkSubmitted,
};
