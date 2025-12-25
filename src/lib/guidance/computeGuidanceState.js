/**
 * Guidance Engine v1
 *
 * Computes guidanceState from user data. Deterministic, rules-based.
 * See /docs/skills/guidance-engine-spec.md for specification.
 *
 * PERFORMANCE NOTE: This function is pure and recomputes on every call.
 * Callers should cache results (e.g., useMemo, React Query) and avoid
 * calling on every render. Recommended: recompute on user data changes only.
 *
 * INTEGRATION NOTE: Smart Prompts should read guidanceState.nextBestSteps
 * and suppress action-oriented prompts when length > 0.
 * See /docs/skills/smart-prompts-system.md for suppression rules.
 */

import { NEXT_BEST_STEP_CATALOG } from './nextBestSteps.catalog';
import { APPLICATION_STAGES, SUPPORT_MODES, RISK_SIGNALS } from '@/lib/enums';

// =============================================================================
// MEANINGFUL ACTION TYPES (for stagnation/momentum detection)
// =============================================================================

const MEANINGFUL_ACTIONS = [
  'log_clinical',
  'log_shadow',
  'log_eq',
  'complete_checklist_item',
  'submit_application',
  'add_target_program',
  'update_target_program',
  'complete_milestone_item',
];

// =============================================================================
// QUALIFICATION RULES (step eligibility based on user data)
// =============================================================================

const QUALIFICATION_RULES = {
  // Foundations
  learn_how_programs_evaluate: () => true, // Always eligible if stage allows

  save_first_program: (user) => (user.savedPrograms?.length ?? 0) === 0,

  add_target_program: (user) =>
    (user.savedPrograms?.length ?? 0) > 0 &&
    (user.targetPrograms?.length ?? 0) === 0,

  // Academic
  calculate_gpa: (user) => !user.academicProfile?.gpaCalculated,

  identify_prereq_gaps: (user) =>
    (user.targetPrograms?.length ?? 0) > 0 &&
    user.targetPrograms?.some((p) => (p.missingPrereqs?.length ?? 0) > 0),

  // Certifications
  work_toward_ccrn: (user) =>
    user.targetPrograms?.some((p) => p.requiresCCRN) &&
    !user.certifications?.some(
      (c) => c.type === 'CCRN' && c.status === 'active'
    ),

  explore_additional_certs: (user) =>
    user.certifications?.some(
      (c) => c.type === 'CCRN' && c.status === 'active'
    ),

  plan_gre_prep: (user) =>
    user.targetPrograms?.some((p) => p.requiresGRE) &&
    !user.academicProfile?.greScore,

  // Experience
  log_clinical_experience: () => true, // Always valuable

  build_shadowing_experience: (user) => (user.shadowingHours ?? 0) < 40,

  add_leadership_experience: (user) =>
    (user.leadershipEntries?.length ?? 0) < 3,

  explore_upcoming_events: () => true, // Always eligible

  // Application Materials
  develop_resume: (user) => !user.resumeCompleted,

  work_on_personal_statement: (user) => !user.personalStatementCompleted,

  plan_recommendation_letters: (user) =>
    (user.letterRequests?.length ?? 0) < 3,

  // Execution (program-contextual handled separately)
  prepare_for_interviews: (user) =>
    user.targetPrograms?.some(
      (p) =>
        p.status === 'interview_invite' || p.status === 'interview_complete'
    ),

  practice_interview_skills: (user) =>
    user.targetPrograms?.some(
      (p) =>
        p.status === 'interview_invite' || p.status === 'interview_complete'
    ),
};

// =============================================================================
// PROGRAM-SPECIFIC QUALIFICATION RULES
// =============================================================================

const PROGRAM_QUALIFICATION_RULES = {
  continue_program_application: (program) =>
    program.status === 'in_progress' && (program.checklistProgress ?? 0) < 0.9,

  submit_application: (program) =>
    program.status === 'in_progress' && (program.checklistProgress ?? 0) >= 0.9,
};

// =============================================================================
// TOP-LEVEL ORCHESTRATOR
// =============================================================================

/**
 * Compute the full guidance state for a user
 * @param {Object} user - User data from canonical user model
 * @returns {Object} guidanceState object
 */
export function computeGuidanceState(user) {
  const applicationStage = computeApplicationStage(user);
  const supportMode = computeSupportMode(applicationStage);
  const riskSignals = computeRiskSignals(user);

  const nextBestSteps = computeNextBestSteps({
    user,
    applicationStage,
    riskSignals,
  });

  return {
    applicationStage,
    supportMode,
    primaryFocusAreas: user.primaryFocusAreas ?? [],
    riskSignals,
    nextBestSteps,
    lastComputedAt: new Date().toISOString(),
  };
}

// =============================================================================
// APPLICATION STAGE
// =============================================================================

/**
 * Compute application stage based on program statuses
 * Highest status wins
 * @param {Object} user
 * @returns {string} APPLICATION_STAGES value
 */
function computeApplicationStage(user) {
  const targets = user.targetPrograms ?? [];
  const saved = user.savedPrograms ?? [];

  // No programs at all = exploring
  if (targets.length === 0 && saved.length === 0) {
    return APPLICATION_STAGES.EXPLORING;
  }

  // Saved but no targets = strategizing
  if (targets.length === 0 && saved.length > 0) {
    return APPLICATION_STAGES.STRATEGIZING;
  }

  // Check target statuses (highest wins)
  const statuses = targets.map((p) => p.status);

  if (statuses.some((s) => ['accepted', 'waitlisted', 'denied'].includes(s))) {
    return APPLICATION_STAGES.POST_DECISION;
  }

  if (
    statuses.some((s) =>
      ['interview_invite', 'interview_complete'].includes(s)
    )
  ) {
    return APPLICATION_STAGES.INTERVIEWING;
  }

  if (statuses.some((s) => ['in_progress', 'submitted'].includes(s))) {
    return APPLICATION_STAGES.EXECUTING;
  }

  return APPLICATION_STAGES.STRATEGIZING;
}

// =============================================================================
// SUPPORT MODE
// =============================================================================

/**
 * Derive support mode from application stage
 * @param {string} stage - APPLICATION_STAGES value
 * @returns {string} SUPPORT_MODES value
 */
function computeSupportMode(stage) {
  switch (stage) {
    case APPLICATION_STAGES.EXPLORING:
    case APPLICATION_STAGES.POST_DECISION:
      return SUPPORT_MODES.ORIENTATION;
    case APPLICATION_STAGES.STRATEGIZING:
      return SUPPORT_MODES.STRATEGY;
    case APPLICATION_STAGES.EXECUTING:
      return SUPPORT_MODES.EXECUTION;
    case APPLICATION_STAGES.INTERVIEWING:
      return SUPPORT_MODES.CONFIDENCE;
    default:
      return SUPPORT_MODES.ORIENTATION;
  }
}

// =============================================================================
// RISK SIGNALS
// =============================================================================

/**
 * Compute risk signals from user activity
 * @param {Object} user
 * @returns {string[]} Array of RISK_SIGNALS values
 */
function computeRiskSignals(user) {
  const signals = [];
  const now = Date.now();

  // Find meaningful actions from activity log
  const meaningfulActions =
    user.activityLog?.filter((a) =>
      MEANINGFUL_ACTIONS.includes(a.actionType)
    ) ?? [];

  // Sort by timestamp descending to get most recent
  const sortedActions = [...meaningfulActions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const lastAction = sortedActions[0]?.timestamp;
  const daysSinceLastAction = lastAction
    ? (now - new Date(lastAction).getTime()) / (1000 * 60 * 60 * 24)
    : Infinity;

  // Stagnation: 14+ days since meaningful action
  if (daysSinceLastAction >= 14) {
    signals.push(RISK_SIGNALS.STAGNATION);
  }

  // Momentum: 3+ meaningful actions in last 7 days
  const recentActions = meaningfulActions.filter((a) => {
    const daysAgo =
      (now - new Date(a.timestamp).getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 7;
  });

  if (recentActions.length >= 3) {
    signals.push(RISK_SIGNALS.MOMENTUM);
    // Momentum clears stagnation (user returned)
    const stagnationIdx = signals.indexOf(RISK_SIGNALS.STAGNATION);
    if (stagnationIdx !== -1) signals.splice(stagnationIdx, 1);
  }

  // Deadline pressure: <30 days + <60% complete
  const hasDeadlinePressure = user.targetPrograms?.some((p) => {
    if (!p.deadline) return false;
    const daysUntil =
      (new Date(p.deadline).getTime() - now) / (1000 * 60 * 60 * 24);
    const progress = p.checklistProgress ?? 0;
    return daysUntil < 30 && daysUntil > 0 && progress < 0.6;
  });

  if (hasDeadlinePressure) {
    signals.push(RISK_SIGNALS.DEADLINE_PRESSURE);
  }

  return signals;
}

// =============================================================================
// NEXT BEST STEPS (CORE LOGIC)
// =============================================================================

/**
 * Compute next best steps for user
 * @param {Object} params
 * @param {Object} params.user
 * @param {string} params.applicationStage
 * @param {string[]} params.riskSignals
 * @returns {Object[]} Array of NextBestStep objects (max 3)
 */
function computeNextBestSteps({ user, applicationStage, riskSignals }) {
  // 1. Stage gating
  let eligibleSteps = NEXT_BEST_STEP_CATALOG.filter((step) =>
    step.allowedStages.includes(applicationStage)
  );

  // 2. Qualification logic + impact count computation
  eligibleSteps = eligibleSteps
    .filter((step) => {
      // Skip program-contextual steps (handled separately)
      if (step.programContextual) return false;

      const qualifies = QUALIFICATION_RULES[step.stepId];
      return qualifies ? qualifies(user) : true;
    })
    .map((step) => ({
      ...step,
      _impactCount: computeImpactCount(step.stepId, user),
    }));

  // 3. Milestone status gating
  eligibleSteps = eligibleSteps.filter((step) => {
    if (!step.milestone) return true;

    const milestone = user.milestones?.find(
      (m) => m.name === step.milestone || m.id === step.milestone
    );

    // Completed milestones don't surface
    if (milestone?.status === 'completed') return false;

    return true;
  });

  // 4. Dismissal gating
  eligibleSteps = eligibleSteps.filter(
    (step) => !isDismissed(step.stepId, user)
  );

  // 5. Program-contextual step hydration
  const programSteps = hydrateProgramContextualSteps(user, applicationStage);

  // 6. Combine and rank
  const allSteps = [...eligibleSteps, ...programSteps];
  const rankedSteps = rankSteps(allSteps, user);

  // 7. Transform to output schema and slice to max 3
  return rankedSteps.slice(0, 3).map((step) => ({
    stepId: step.stepId,
    action: step.action,
    whyItMatters: step.whyItMatters,
    cta: {
      label: step.ctaLabel ?? 'Get started',
      href: step.href,
    },
    dismissedAt: null,
  }));
}

// =============================================================================
// PROGRAM-CONTEXTUAL STEP HYDRATION
// =============================================================================

/**
 * Hydrate program-contextual steps with actual program data
 * @param {Object} user
 * @param {string} applicationStage
 * @returns {Object[]} Array of hydrated step objects
 */
function hydrateProgramContextualSteps(user, applicationStage) {
  const programSteps = NEXT_BEST_STEP_CATALOG.filter(
    (step) =>
      step.programContextual && step.allowedStages.includes(applicationStage)
  );

  const hydratedSteps = [];

  for (const step of programSteps) {
    const qualifies = PROGRAM_QUALIFICATION_RULES[step.stepId];
    if (!qualifies) continue;

    const qualifyingPrograms =
      user.targetPrograms?.filter((p) => qualifies(p)) ?? [];

    for (const program of qualifyingPrograms) {
      // Check dismissal for this specific program
      if (isDismissed(`${step.stepId}_${program.id}`, user)) continue;

      hydratedSteps.push({
        ...step,
        stepId: `${step.stepId}_${program.id}`,
        action: interpolate(step.action, program),
        whyItMatters: interpolate(step.whyItMatters, program),
        href: interpolate(step.href, program),
        _programDeadline: program.deadline,
        _programId: program.id,
      });
    }
  }

  return hydratedSteps;
}

// =============================================================================
// INTERPOLATION
// =============================================================================

/**
 * Interpolate template tokens with program data
 * @param {string} template
 * @param {Object} program
 * @returns {string}
 */
function interpolate(template, program) {
  const incompleteCount =
    program.checklist?.filter((i) => !i.completed).length ?? 0;
  const deadline = program.deadline
    ? new Date(program.deadline).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : 'upcoming';

  return template
    .replace(/{programName}/g, program.name)
    .replace(/{programId}/g, program.id)
    .replace(/{incompleteCount}/g, String(incompleteCount))
    .replace(/{deadline}/g, deadline);
}

// =============================================================================
// IMPACT COUNT COMPUTATION
// =============================================================================

/**
 * Compute how many target programs a step affects
 * Used for ranking - steps affecting more programs rank higher
 * @param {string} stepId
 * @param {Object} user
 * @returns {number} Number of affected programs (default 1)
 */
function computeImpactCount(stepId, user) {
  const targets = user.targetPrograms ?? [];

  switch (stepId) {
    case 'work_toward_ccrn':
      // Count programs that require CCRN
      return targets.filter((p) => p.requiresCCRN).length || 1;

    case 'identify_prereq_gaps':
      // Count programs with missing prereqs
      return (
        targets.filter((p) => (p.missingPrereqs?.length ?? 0) > 0).length || 1
      );

    case 'plan_gre_prep':
      // Count programs that require GRE
      return targets.filter((p) => p.requiresGRE).length || 1;

    default:
      // Default impact of 1 for steps that don't span programs
      return 1;
  }
}

// =============================================================================
// RANKING
// =============================================================================

/**
 * Rank steps by deadline proximity, priority, impact breadth, and focus area alignment
 * Order: (1) deadline, (2) priority, (3) impact breadth, (4) focus area
 * @param {Object[]} steps
 * @param {Object} user
 * @returns {Object[]} Sorted steps
 */
function rankSteps(steps, user) {
  const activeAreas =
    user.primaryFocusAreas
      ?.filter((a) => a.status === 'active')
      .map((a) => a.area) ?? [];

  return steps.sort((a, b) => {
    // 1. Deadline proximity (program-contextual steps only)
    const aDeadline = a._programDeadline
      ? new Date(a._programDeadline).getTime()
      : Infinity;
    const bDeadline = b._programDeadline
      ? new Date(b._programDeadline).getTime()
      : Infinity;

    if (aDeadline !== bDeadline) return aDeadline - bDeadline;

    // 2. Priority (if defined in catalog)
    const aPriority = a.priority ?? 0;
    const bPriority = b.priority ?? 0;
    if (aPriority !== bPriority) return bPriority - aPriority;

    // 3. Impact breadth (affects more programs = higher priority)
    const aImpact = a._impactCount ?? 1;
    const bImpact = b._impactCount ?? 1;
    if (aImpact !== bImpact) return bImpact - aImpact;

    // 4. Focus area alignment
    const aFocusBoost = a.focusArea && activeAreas.includes(a.focusArea) ? 1 : 0;
    const bFocusBoost = b.focusArea && activeAreas.includes(b.focusArea) ? 1 : 0;

    return bFocusBoost - aFocusBoost;
  });
}

// =============================================================================
// DISMISSAL LOGIC
// =============================================================================

/**
 * Check if a step has been dismissed within the cool-off period
 * @param {string} stepId
 * @param {Object} user
 * @returns {boolean}
 */
function isDismissed(stepId, user) {
  const dismissed = user.dismissedSteps?.find((d) => d.stepId === stepId);

  if (!dismissed) return false;

  const daysSinceDismiss =
    (Date.now() - new Date(dismissed.dismissedAt).getTime()) /
    (1000 * 60 * 60 * 24);

  // 7-day cool-off period
  return daysSinceDismiss < 7;
}

// =============================================================================
// EXPORTS
// =============================================================================

export default computeGuidanceState;

// Export individual functions for testing
export {
  computeApplicationStage,
  computeSupportMode,
  computeRiskSignals,
  computeNextBestSteps,
  computeImpactCount,
  MEANINGFUL_ACTIONS,
  QUALIFICATION_RULES,
  PROGRAM_QUALIFICATION_RULES,
};
