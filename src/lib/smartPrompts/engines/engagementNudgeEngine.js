/**
 * Engagement Nudge Engine
 *
 * Generates nudges for:
 * - Welcome back messages (with priority logic)
 * - Login streak milestones and risk warnings
 * - ReadyScore celebrations (with 24-hour cooldown, >=5 point threshold)
 * - Milestone and checklist celebrations (batched)
 * - First target saved, 5 programs saved
 * - Acceptance celebration
 */

import { ENGAGEMENT_PROMPTS } from '../promptDefinitions';
import { daysSince, generateNudgeId, calculateStreakStatus, formatProgramName } from '../promptUtils';
import { calculatePriority } from '../prioritySystem';
import { canShowCelebration, queueCelebration } from '../frequencyManager';

/**
 * Streak milestones to celebrate
 */
const STREAK_MILESTONES = [3, 7, 14, 30, 60, 90, 120, 180, 365];

/**
 * Checklist milestones to celebrate
 */
const CHECKLIST_MILESTONES = [1, 5, 10];

/**
 * Evaluate engagement nudges
 */
export function evaluateEngagementNudges({
  userData = {},
  targetPrograms = [],
  savedPrograms = [],
  trackerStats = {},
  readyScoreData = {},
  milestones = [],
  checklistProgress = {},
  dismissedPrompts = {},
  lastNudgeShown = {},
  userStage,
  lastLoginAt,
  today = new Date(),
}) {
  const nudges = [];

  // Welcome back logic
  const welcomeBackNudge = evaluateWelcomeBack(
    userData,
    targetPrograms,
    trackerStats,
    dismissedPrompts,
    lastNudgeShown,
    userStage,
    lastLoginAt,
    today
  );
  if (welcomeBackNudge) nudges.push(welcomeBackNudge);

  // Streak nudges
  const streakNudges = evaluateStreakNudges(
    userData,
    dismissedPrompts,
    lastNudgeShown,
    userStage,
    trackerStats,
    lastLoginAt,
    today
  );
  nudges.push(...streakNudges);

  // ReadyScore celebration
  const readyScoreNudge = evaluateReadyScoreCelebration(
    readyScoreData,
    userData,
    dismissedPrompts,
    lastNudgeShown,
    userStage,
    trackerStats,
    lastLoginAt
  );
  if (readyScoreNudge) nudges.push(readyScoreNudge);

  // Milestone celebrations
  const milestoneNudges = evaluateMilestoneCelebrations(
    milestones,
    dismissedPrompts,
    lastNudgeShown,
    userStage,
    trackerStats,
    lastLoginAt
  );
  nudges.push(...milestoneNudges);

  // Checklist celebrations
  const checklistNudges = evaluateChecklistCelebrations(
    checklistProgress,
    dismissedPrompts,
    lastNudgeShown,
    userStage,
    trackerStats,
    lastLoginAt
  );
  nudges.push(...checklistNudges);

  // First target saved celebration
  const firstTargetNudge = evaluateFirstTarget(
    targetPrograms,
    userData,
    dismissedPrompts,
    lastNudgeShown,
    userStage,
    trackerStats,
    lastLoginAt
  );
  if (firstTargetNudge) nudges.push(firstTargetNudge);

  // Programs saved (School Scout badge at 5)
  const programsSavedNudge = evaluateProgramsSaved(
    savedPrograms,
    targetPrograms,
    userData,
    dismissedPrompts,
    lastNudgeShown,
    userStage,
    trackerStats,
    lastLoginAt
  );
  if (programsSavedNudge) nudges.push(programsSavedNudge);

  // Acceptance celebration
  const acceptanceNudge = evaluateAcceptance(
    targetPrograms,
    dismissedPrompts,
    lastNudgeShown,
    userStage,
    trackerStats,
    lastLoginAt
  );
  if (acceptanceNudge) nudges.push(acceptanceNudge);

  return nudges.sort((a, b) => b.priority - a.priority);
}

/**
 * Welcome back logic with priority:
 * 1. Onboarding incomplete
 * 2. Overdue tasks
 * 3. Deadline < 30 days
 * 4. Fallback to clinical tracker
 */
function evaluateWelcomeBack(
  userData,
  targetPrograms,
  trackerStats,
  dismissedPrompts,
  lastNudgeShown,
  userStage,
  lastLoginAt,
  today
) {
  if (!lastLoginAt) return null;

  const daysSinceLogin = daysSince(lastLoginAt, today);

  // Only show if 7+ days
  if (daysSinceLogin < 7) return null;

  let promptDef = daysSinceLogin >= 14
    ? ENGAGEMENT_PROMPTS.WELCOME_BACK_14
    : ENGAGEMENT_PROMPTS.WELCOME_BACK_7;

  // Determine message based on priority
  let welcomeMessage = '';
  let welcomeAction = '';
  let welcomeHref = '/dashboard';

  // Priority 1: Onboarding incomplete
  if (!userData.onboardingWidgetComplete) {
    const stepsRemaining = 8 - (userData.onboardingWidgetProgress || 0);
    welcomeMessage = `You've been away for ${daysSinceLogin} days. Let's pick up where you left off - you have ${stepsRemaining} onboarding steps remaining.`;
    welcomeAction = 'Continue Setup';
    welcomeHref = '/dashboard';
  }
  // Priority 2: Overdue tasks
  else if (getOverdueTaskCount(targetPrograms, today) > 0) {
    const overdueCount = getOverdueTaskCount(targetPrograms, today);
    const programWithOverdue = targetPrograms.find(p =>
      p.checklistItems?.some(item => !item.completed && item.dueDate && new Date(item.dueDate) < today)
    );
    welcomeMessage = `You have ${overdueCount} overdue tasks${programWithOverdue ? ` for ${formatProgramName(programWithOverdue)}` : ''}. Let's get back on track.`;
    welcomeAction = 'View Tasks';
    welcomeHref = programWithOverdue ? `/programs/${programWithOverdue.id}` : '/programs';
  }
  // Priority 3: Deadline < 30 days
  else if (getUpcomingDeadline(targetPrograms, today)) {
    const program = getUpcomingDeadline(targetPrograms, today);
    const daysToDeadline = Math.ceil((new Date(program.applicationDeadline) - today) / (1000 * 60 * 60 * 24));
    welcomeMessage = `Your ${formatProgramName(program)} deadline is in ${daysToDeadline} days. Ready to make progress?`;
    welcomeAction = 'View Program';
    welcomeHref = `/programs/${program.id}`;
  }
  // Priority 4: Fallback to clinical tracker
  else {
    welcomeMessage = `It's been ${daysSinceLogin} days - let's log your recent shifts.`;
    welcomeAction = 'Go to Clinical Tracker';
    welcomeHref = '/trackers?tab=clinical';
  }

  const nudgeId = generateNudgeId(promptDef.id);

  return {
    id: nudgeId,
    promptId: promptDef.id,
    engine: 'engagement',
    type: promptDef.type,
    urgency: promptDef.urgency,
    title: promptDef.titleTemplate,
    message: welcomeMessage,
    actions: [{
      label: welcomeAction,
      actionType: 'link',
      href: welcomeHref,
    }],
    dismissible: promptDef.dismissible,
    snoozeable: promptDef.snoozeable,
    context: {
      daysSinceLogin,
      priorityReason: !userData.onboardingWidgetComplete ? 'onboarding' :
                      getOverdueTaskCount(targetPrograms, today) > 0 ? 'overdue' :
                      getUpcomingDeadline(targetPrograms, today) ? 'deadline' : 'fallback',
    },
    priority: calculatePriority({
      urgency: promptDef.urgency,
      engine: 'engagement',
      userStage,
      trackerStats,
      lastLoginAt,
      lastShownAt: lastNudgeShown[nudgeId],
      dismissalCount: dismissedPrompts[nudgeId]?.count || 0,
    }),
  };
}

/**
 * Get count of overdue tasks across all programs
 */
function getOverdueTaskCount(targetPrograms, today) {
  let count = 0;
  for (const program of targetPrograms) {
    if (!program.checklistItems) continue;
    for (const item of program.checklistItems) {
      if (!item.completed && item.dueDate && new Date(item.dueDate) < today) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Get program with deadline < 30 days
 */
function getUpcomingDeadline(targetPrograms, today) {
  return targetPrograms.find(p => {
    if (!p.applicationDeadline) return false;
    if (p.status === 'submitted' || p.status === 'accepted') return false;
    const daysToDeadline = Math.ceil((new Date(p.applicationDeadline) - today) / (1000 * 60 * 60 * 24));
    return daysToDeadline > 0 && daysToDeadline <= 30;
  });
}

/**
 * Evaluate streak nudges
 */
function evaluateStreakNudges(
  userData,
  dismissedPrompts,
  lastNudgeShown,
  userStage,
  trackerStats,
  lastLoginAt,
  today
) {
  const nudges = [];
  const streak = userData.loginStreak || 0;
  const { isAtRisk } = calculateStreakStatus(streak, lastLoginAt, today);

  // Streak at risk warning
  if (isAtRisk && streak >= 3) {
    const promptDef = ENGAGEMENT_PROMPTS.LOGIN_STREAK_RISK;
    const nudgeId = generateNudgeId(promptDef.id);

    nudges.push({
      id: nudgeId,
      promptId: promptDef.id,
      engine: 'engagement',
      type: promptDef.type,
      urgency: promptDef.urgency,
      title: interpolate(promptDef.titleTemplate, { streakDays: streak }),
      message: promptDef.messageTemplate,
      actions: promptDef.actions,
      dismissible: promptDef.dismissible,
      snoozeable: promptDef.snoozeable,
      context: { streakDays: streak, isAtRisk: true },
      priority: calculatePriority({
        urgency: promptDef.urgency,
        engine: 'engagement',
        userStage,
        trackerStats,
        lastLoginAt,
        lastShownAt: lastNudgeShown[nudgeId],
        dismissalCount: dismissedPrompts[nudgeId]?.count || 0,
      }),
    });
  }

  // Streak milestone celebrations
  if (!canShowCelebration()) return nudges;

  // Check if they just hit a milestone
  const justHitMilestone = STREAK_MILESTONES.includes(streak) && userData.previousStreak < streak;

  if (justHitMilestone) {
    let promptDef;

    if (streak === 3) promptDef = ENGAGEMENT_PROMPTS.LOGIN_STREAK_3;
    else if (streak === 7) promptDef = ENGAGEMENT_PROMPTS.LOGIN_STREAK_7;
    else if (streak === 14) promptDef = ENGAGEMENT_PROMPTS.LOGIN_STREAK_14;
    else if (streak === 30) promptDef = ENGAGEMENT_PROMPTS.LOGIN_STREAK_30;
    else if (streak > 30 && streak % 30 === 0) promptDef = ENGAGEMENT_PROMPTS.LOGIN_STREAK_MONTHLY;

    if (promptDef) {
      const nudgeId = generateNudgeId(promptDef.id, { streak });

      // Queue for batching if needed
      queueCelebration({ type: 'streak', streak, promptId: promptDef.id });

      nudges.push({
        id: nudgeId,
        promptId: promptDef.id,
        engine: 'engagement',
        type: 'celebration',
        urgency: 'low',
        title: interpolate(promptDef.titleTemplate, { streakDays: streak }),
        message: promptDef.messageTemplate,
        actions: promptDef.actions,
        dismissible: false,
        snoozeable: false,
        context: { streakDays: streak },
        priority: 20, // Celebrations have lower priority
      });
    }
  }

  return nudges;
}

/**
 * Evaluate ReadyScore celebration
 * Only celebrate if: >=5 point increase AND 24-hour cooldown passed
 */
function evaluateReadyScoreCelebration(
  readyScoreData,
  userData,
  dismissedPrompts,
  lastNudgeShown,
  userStage,
  trackerStats,
  lastLoginAt
) {
  if (!canShowCelebration()) return null;

  const { currentScore, previousScore, lastCelebrationAt } = readyScoreData;

  if (!currentScore || !previousScore) return null;

  // Check 24-hour cooldown
  if (lastCelebrationAt) {
    const hoursSinceCelebration = (new Date() - new Date(lastCelebrationAt)) / (1000 * 60 * 60);
    if (hoursSinceCelebration < 24) return null;
  }

  // Check for >=5 point increase
  const increase = currentScore - previousScore;
  if (increase < 5) return null;

  const promptDef = ENGAGEMENT_PROMPTS.READYSCORE_UP;
  const nudgeId = generateNudgeId(promptDef.id);

  queueCelebration({ type: 'readyscore', increase, newScore: currentScore });

  return {
    id: nudgeId,
    promptId: promptDef.id,
    engine: 'engagement',
    type: 'celebration',
    urgency: 'low',
    title: interpolate(promptDef.titleTemplate, { newScore: currentScore }),
    message: interpolate(promptDef.messageTemplate, { increase }),
    actions: promptDef.actions,
    dismissible: false,
    snoozeable: false,
    context: { currentScore, previousScore, increase },
    priority: 20,
  };
}

/**
 * Evaluate milestone celebrations
 */
function evaluateMilestoneCelebrations(
  milestones,
  dismissedPrompts,
  lastNudgeShown,
  userStage,
  trackerStats,
  lastLoginAt
) {
  if (!canShowCelebration()) return [];

  const nudges = [];

  // Find recently completed milestones (completed in last session)
  const recentlyCompleted = milestones.filter(m =>
    m.completed && m.completedAt && daysSince(m.completedAt) === 0
  );

  if (recentlyCompleted.length > 0) {
    const milestone = recentlyCompleted[0]; // Show one at a time
    const promptDef = ENGAGEMENT_PROMPTS.MILESTONE_COMPLETE;
    const nudgeId = generateNudgeId(promptDef.id, { milestoneId: milestone.id });

    queueCelebration({ type: 'milestone', milestoneName: milestone.name });

    nudges.push({
      id: nudgeId,
      promptId: promptDef.id,
      engine: 'engagement',
      type: 'celebration',
      urgency: 'low',
      title: interpolate(promptDef.titleTemplate, { milestoneName: milestone.name }),
      message: promptDef.messageTemplate,
      actions: [],
      dismissible: false,
      snoozeable: false,
      context: { milestoneId: milestone.id, milestoneName: milestone.name },
      priority: 20,
    });
  }

  return nudges;
}

/**
 * Evaluate checklist celebrations (1st, 5th, 10th items)
 */
function evaluateChecklistCelebrations(
  checklistProgress,
  dismissedPrompts,
  lastNudgeShown,
  userStage,
  trackerStats,
  lastLoginAt
) {
  if (!canShowCelebration()) return [];

  const nudges = [];
  const { totalCompleted, previousTotalCompleted } = checklistProgress;

  if (!totalCompleted || totalCompleted === previousTotalCompleted) return nudges;

  // Check if we just crossed a milestone
  for (const milestone of CHECKLIST_MILESTONES) {
    if (totalCompleted >= milestone && (previousTotalCompleted || 0) < milestone) {
      let promptDef;
      if (milestone === 1) promptDef = ENGAGEMENT_PROMPTS.CHECKLIST_ITEM_1;
      else if (milestone === 5) promptDef = ENGAGEMENT_PROMPTS.CHECKLIST_ITEM_5;
      else if (milestone === 10) promptDef = ENGAGEMENT_PROMPTS.CHECKLIST_ITEM_10;

      if (promptDef) {
        const nudgeId = generateNudgeId(promptDef.id);

        queueCelebration({ type: 'checklist', milestone, totalCompleted });

        nudges.push({
          id: nudgeId,
          promptId: promptDef.id,
          engine: 'engagement',
          type: 'celebration',
          urgency: 'low',
          title: promptDef.titleTemplate,
          message: promptDef.messageTemplate,
          actions: [],
          dismissible: false,
          snoozeable: false,
          context: { totalCompleted, milestone },
          priority: 20,
        });

        break; // Only one checklist celebration per evaluation
      }
    }
  }

  return nudges;
}

/**
 * Evaluate first target saved
 */
function evaluateFirstTarget(
  targetPrograms,
  userData,
  dismissedPrompts,
  lastNudgeShown,
  userStage,
  trackerStats,
  lastLoginAt
) {
  if (!canShowCelebration()) return null;

  // Check if they just saved their first target
  if (targetPrograms.length !== 1) return null;
  if (userData.hasSeenFirstTargetCelebration) return null;

  const program = targetPrograms[0];
  const promptDef = ENGAGEMENT_PROMPTS.FIRST_TARGET_SAVED;
  const nudgeId = generateNudgeId(promptDef.id);

  queueCelebration({ type: 'first_target', programId: program.id });

  return {
    id: nudgeId,
    promptId: promptDef.id,
    engine: 'engagement',
    type: 'celebration',
    urgency: 'low',
    title: promptDef.titleTemplate,
    message: promptDef.messageTemplate,
    actions: [{
      label: 'View Program',
      actionType: 'link',
      href: `/programs/${program.id}`,
    }],
    dismissible: false,
    snoozeable: false,
    context: { programId: program.id, programName: formatProgramName(program) },
    priority: 20,
  };
}

/**
 * Evaluate programs saved (School Scout badge at 5)
 */
function evaluateProgramsSaved(
  savedPrograms,
  targetPrograms,
  userData,
  dismissedPrompts,
  lastNudgeShown,
  userStage,
  trackerStats,
  lastLoginAt
) {
  if (!canShowCelebration()) return null;

  const totalSaved = (savedPrograms?.length || 0) + (targetPrograms?.length || 0);

  // Check if they just hit 5
  if (totalSaved !== 5) return null;
  if (userData.hasSeenSchoolScoutBadge) return null;

  const promptDef = ENGAGEMENT_PROMPTS.PROGRAMS_SAVED_5;
  const nudgeId = generateNudgeId(promptDef.id);

  queueCelebration({ type: 'badge', badgeName: 'School Scout' });

  return {
    id: nudgeId,
    promptId: promptDef.id,
    engine: 'engagement',
    type: 'celebration',
    urgency: 'low',
    title: promptDef.titleTemplate,
    message: promptDef.messageTemplate,
    actions: promptDef.actions,
    dismissible: false,
    snoozeable: false,
    context: { totalSaved, badgeName: 'School Scout' },
    priority: 25, // Badges slightly higher priority
  };
}

/**
 * Evaluate acceptance celebration
 */
function evaluateAcceptance(
  targetPrograms,
  dismissedPrompts,
  lastNudgeShown,
  userStage,
  trackerStats,
  lastLoginAt
) {
  // Find newly accepted program (accepted in last 24 hours)
  const newlyAccepted = targetPrograms.find(p => {
    if (p.status !== 'accepted' || !p.acceptedAt) return false;
    const hoursSinceAccepted = (new Date() - new Date(p.acceptedAt)) / (1000 * 60 * 60);
    return hoursSinceAccepted < 24;
  });

  if (!newlyAccepted) return null;

  const promptDef = ENGAGEMENT_PROMPTS.ACCEPTANCE_CELEBRATION;
  const nudgeId = generateNudgeId(promptDef.id, { programId: newlyAccepted.id });

  // Don't queue - acceptance celebrations are always shown immediately
  return {
    id: nudgeId,
    promptId: promptDef.id,
    engine: 'engagement',
    type: 'celebration',
    urgency: 'high', // High priority for acceptance!
    title: interpolate(promptDef.titleTemplate, { programName: formatProgramName(newlyAccepted) }),
    message: promptDef.messageTemplate,
    actions: promptDef.actions,
    dismissible: false,
    snoozeable: false,
    context: { programId: newlyAccepted.id, programName: formatProgramName(newlyAccepted) },
    priority: 100, // Highest priority
  };
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

export default {
  evaluateEngagementNudges,
  STREAK_MILESTONES,
  CHECKLIST_MILESTONES,
};
