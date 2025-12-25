/**
 * Interview Prep Engine
 *
 * Generates nudges for interview preparation with separate tracks
 * for in-person vs virtual interviews.
 *
 * Countdown: 30 days, 14 days, 7 days, 3 days, 1 day (tomorrow)
 * Post-interview: Thank you, feedback form, outcome check
 */

import { INTERVIEW_PROMPTS } from '../promptDefinitions';
import { daysUntil, daysSince, generateNudgeId, formatProgramName } from '../promptUtils';
import { calculatePriority } from '../prioritySystem';

/**
 * Interview types
 */
export const INTERVIEW_TYPES = {
  IN_PERSON: 'in_person',
  VIRTUAL: 'virtual',
};

/**
 * Interview outcomes
 */
export const INTERVIEW_OUTCOMES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WAITLISTED: 'waitlisted',
};

/**
 * Evaluate interview prep alerts
 */
export function evaluateInterviewAlerts({
  targetPrograms = [],
  dismissedPrompts = {},
  lastNudgeShown = {},
  userStage,
  trackerStats,
  lastLoginAt,
  today = new Date(),
}) {
  const nudges = [];

  // Find programs with interview status
  const interviewPrograms = targetPrograms.filter(
    p => p.status === 'interview_invite' || p.status === 'interview_scheduled'
  );

  for (const program of interviewPrograms) {
    // If no interview date set but has interview invite, prompt to set date
    if (!program.interviewDate && program.status === 'interview_invite') {
      const promptDef = INTERVIEW_PROMPTS.INTERVIEW_DATE_PROMPT;
      const nudgeId = generateNudgeId(promptDef.id, { programId: program.id });

      nudges.push({
        id: nudgeId,
        promptId: promptDef.id,
        engine: 'interview',
        type: promptDef.type,
        urgency: promptDef.urgency,
        title: interpolate(promptDef.titleTemplate, {
          programName: formatProgramName(program),
        }),
        message: promptDef.messageTemplate,
        actions: promptDef.actions.map(action => ({
          ...action,
          context: { programId: program.id },
        })),
        dismissible: promptDef.dismissible,
        snoozeable: promptDef.snoozeable,
        context: {
          programId: program.id,
          programName: formatProgramName(program),
          needsDateAndType: true,
        },
        priority: calculatePriority({
          urgency: promptDef.urgency,
          engine: 'interview',
          userStage,
          trackerStats,
          lastLoginAt,
          lastShownAt: lastNudgeShown[nudgeId],
          dismissalCount: dismissedPrompts[nudgeId]?.count || 0,
        }),
      });
      continue;
    }

    if (!program.interviewDate) continue;

    const daysToInterview = daysUntil(program.interviewDate, today);
    const isVirtual = program.interviewType === INTERVIEW_TYPES.VIRTUAL;

    // Pre-interview nudges
    if (daysToInterview > 0) {
      const preInterviewNudge = getPreInterviewNudge(
        program,
        daysToInterview,
        isVirtual,
        dismissedPrompts,
        lastNudgeShown,
        userStage,
        trackerStats,
        lastLoginAt
      );
      if (preInterviewNudge) {
        nudges.push(preInterviewNudge);
      }
    }

    // Post-interview nudges (interview has passed)
    if (daysToInterview < 0) {
      const postInterviewNudges = getPostInterviewNudges(
        program,
        Math.abs(daysToInterview),
        dismissedPrompts,
        lastNudgeShown,
        userStage,
        trackerStats,
        lastLoginAt
      );
      nudges.push(...postInterviewNudges);
    }
  }

  // Check for waitlisted programs
  const waitlistedPrograms = targetPrograms.filter(p => p.outcome === INTERVIEW_OUTCOMES.WAITLISTED);
  for (const program of waitlistedPrograms) {
    const promptDef = INTERVIEW_PROMPTS.WAITLIST_SUPPORT;
    const nudgeId = generateNudgeId(promptDef.id, { programId: program.id });

    nudges.push({
      id: nudgeId,
      promptId: promptDef.id,
      engine: 'interview',
      type: promptDef.type,
      urgency: promptDef.urgency,
      title: interpolate(promptDef.titleTemplate, {
        programName: formatProgramName(program),
      }),
      message: promptDef.messageTemplate,
      actions: promptDef.actions,
      dismissible: promptDef.dismissible,
      snoozeable: promptDef.snoozeable,
      context: {
        programId: program.id,
        programName: formatProgramName(program),
        outcome: 'waitlisted',
      },
      priority: calculatePriority({
        urgency: promptDef.urgency,
        engine: 'interview',
        userStage,
        trackerStats,
        lastLoginAt,
        lastShownAt: lastNudgeShown[nudgeId],
        dismissalCount: dismissedPrompts[nudgeId]?.count || 0,
      }),
    });
  }

  return nudges.sort((a, b) => b.priority - a.priority);
}

/**
 * Get pre-interview nudge based on days remaining
 */
function getPreInterviewNudge(
  program,
  daysToInterview,
  isVirtual,
  dismissedPrompts,
  lastNudgeShown,
  userStage,
  trackerStats,
  lastLoginAt
) {
  let promptDef = null;

  if (daysToInterview === 1) {
    promptDef = INTERVIEW_PROMPTS.INTERVIEW_1;
  } else if (daysToInterview <= 3) {
    promptDef = INTERVIEW_PROMPTS.INTERVIEW_3;
  } else if (daysToInterview <= 7) {
    // Different prompts for in-person vs virtual
    promptDef = isVirtual
      ? INTERVIEW_PROMPTS.INTERVIEW_7_VIRTUAL
      : INTERVIEW_PROMPTS.INTERVIEW_7_INPERSON;
  } else if (daysToInterview <= 14) {
    promptDef = INTERVIEW_PROMPTS.INTERVIEW_14;
  } else if (daysToInterview <= 30) {
    promptDef = INTERVIEW_PROMPTS.INTERVIEW_30;
  }

  if (!promptDef) return null;

  const nudgeId = generateNudgeId(promptDef.id, { programId: program.id });

  return {
    id: nudgeId,
    promptId: promptDef.id,
    engine: 'interview',
    type: promptDef.type,
    urgency: promptDef.urgency,
    title: interpolate(promptDef.titleTemplate, {
      programName: formatProgramName(program),
    }),
    message: promptDef.messageTemplate,
    actions: promptDef.actions.map(action => ({
      ...action,
      href: action.href?.replace('{{programId}}', program.id),
      context: { programId: program.id },
    })),
    dismissible: promptDef.dismissible,
    snoozeable: promptDef.snoozeable,
    context: {
      programId: program.id,
      programName: formatProgramName(program),
      daysToInterview,
      interviewType: program.interviewType,
      interviewDate: program.interviewDate,
    },
    priority: calculatePriority({
      urgency: promptDef.urgency,
      engine: 'interview',
      userStage,
      trackerStats,
      lastLoginAt,
      lastShownAt: lastNudgeShown[nudgeId],
      dismissalCount: dismissedPrompts[nudgeId]?.count || 0,
    }),
  };
}

/**
 * Get post-interview nudges
 */
function getPostInterviewNudges(
  program,
  daysSinceInterview,
  dismissedPrompts,
  lastNudgeShown,
  userStage,
  trackerStats,
  lastLoginAt
) {
  const nudges = [];

  // Only show post-interview nudges if no outcome yet
  if (program.outcome && program.outcome !== INTERVIEW_OUTCOMES.PENDING) {
    return nudges;
  }

  // 1 day after: Thank you email reminder
  if (daysSinceInterview === 1) {
    const thankYouDef = INTERVIEW_PROMPTS.POST_INTERVIEW_THANKYOU;
    const thankYouId = generateNudgeId(thankYouDef.id, { programId: program.id });

    nudges.push({
      id: thankYouId,
      promptId: thankYouDef.id,
      engine: 'interview',
      type: thankYouDef.type,
      urgency: thankYouDef.urgency,
      title: interpolate(thankYouDef.titleTemplate, {
        programName: formatProgramName(program),
      }),
      message: thankYouDef.messageTemplate,
      actions: thankYouDef.actions,
      dismissible: thankYouDef.dismissible,
      snoozeable: thankYouDef.snoozeable,
      context: {
        programId: program.id,
        programName: formatProgramName(program),
        daysSinceInterview,
      },
      priority: calculatePriority({
        urgency: thankYouDef.urgency,
        engine: 'interview',
        userStage,
        trackerStats,
        lastLoginAt,
        lastShownAt: lastNudgeShown[thankYouId],
        dismissalCount: dismissedPrompts[thankYouId]?.count || 0,
      }),
    });

    // Also show feedback form
    const formDef = INTERVIEW_PROMPTS.POST_INTERVIEW_FORM;
    const formId = generateNudgeId(formDef.id, { programId: program.id });

    nudges.push({
      id: formId,
      promptId: formDef.id,
      engine: 'interview',
      type: formDef.type,
      urgency: formDef.urgency,
      title: interpolate(formDef.titleTemplate, {
        programName: formatProgramName(program),
      }),
      message: formDef.messageTemplate,
      actions: formDef.actions,
      dismissible: formDef.dismissible,
      snoozeable: formDef.snoozeable,
      context: {
        programId: program.id,
        programName: formatProgramName(program),
        daysSinceInterview,
      },
      priority: calculatePriority({
        urgency: formDef.urgency,
        engine: 'interview',
        userStage,
        trackerStats,
        lastLoginAt,
        lastShownAt: lastNudgeShown[formId],
        dismissalCount: dismissedPrompts[formId]?.count || 0,
      }),
    });
  }

  // 14+ days after: Outcome check
  if (daysSinceInterview >= 14) {
    const outcomeDef = INTERVIEW_PROMPTS.OUTCOME_CHECK_14;
    const outcomeId = generateNudgeId(outcomeDef.id, { programId: program.id });

    nudges.push({
      id: outcomeId,
      promptId: outcomeDef.id,
      engine: 'interview',
      type: outcomeDef.type,
      urgency: outcomeDef.urgency,
      title: interpolate(outcomeDef.titleTemplate, {
        programName: formatProgramName(program),
      }),
      message: outcomeDef.messageTemplate,
      actions: outcomeDef.actions.map(action => ({
        ...action,
        context: { programId: program.id },
      })),
      dismissible: outcomeDef.dismissible,
      snoozeable: outcomeDef.snoozeable,
      context: {
        programId: program.id,
        programName: formatProgramName(program),
        daysSinceInterview,
      },
      priority: calculatePriority({
        urgency: outcomeDef.urgency,
        engine: 'interview',
        userStage,
        trackerStats,
        lastLoginAt,
        lastShownAt: lastNudgeShown[outcomeId],
        dismissalCount: dismissedPrompts[outcomeId]?.count || 0,
      }),
    });
  }

  return nudges;
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
 * Handle interview type selection (in-person vs virtual)
 */
export function handleSetInterviewType(programId, interviewType) {
  return {
    programId,
    interviewType,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Handle interview date selection
 */
export function handleSetInterviewDate(programId, interviewDate) {
  return {
    programId,
    interviewDate,
    status: 'interview_scheduled',
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Handle outcome update
 */
export function handleUpdateOutcome(programId, outcome) {
  return {
    programId,
    outcome,
    outcomeDate: new Date().toISOString(),
    status: outcome === INTERVIEW_OUTCOMES.ACCEPTED ? 'accepted' :
            outcome === INTERVIEW_OUTCOMES.REJECTED ? 'rejected' : 'interview_scheduled',
  };
}

/**
 * Get thank you email template
 */
export function getThankYouTemplate(programName, interviewerNames = []) {
  const interviewers = interviewerNames.length > 0
    ? interviewerNames.join(', ')
    : '[Interviewer Names]';

  return `Dear ${interviewers},

Thank you so much for taking the time to interview me for the ${programName || '[Program Name]'} CRNA program. I truly enjoyed learning more about your program and the opportunity to discuss my qualifications and goals.

Our conversation reinforced my enthusiasm for your program. I was particularly impressed by [specific aspect discussed during interview].

I am confident that my clinical experience, commitment to excellence, and passion for anesthesia nursing would allow me to contribute positively to your program.

Please don't hesitate to reach out if you need any additional information. Thank you again for this opportunity.

Sincerely,
[Your Name]`;
}

export default {
  INTERVIEW_TYPES,
  INTERVIEW_OUTCOMES,
  evaluateInterviewAlerts,
  handleSetInterviewType,
  handleSetInterviewDate,
  handleUpdateOutcome,
  getThankYouTemplate,
};
