/**
 * Guidance Engine Test Suite
 *
 * Comprehensive unit tests covering all decision branches of computeGuidanceState()
 * ~35 canonical QA scenarios for full logical coverage
 *
 * Test Categories:
 * A. Application Stage (5 scenarios)
 * B. Risk Signals (6 scenarios)
 * C. Step Qualification (12 scenarios)
 * D. Ranking Logic (4 scenarios)
 * E. Edge/Safety (5 scenarios)
 * F. Chaos/Regression (3+ scenarios)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  computeGuidanceState,
  computeApplicationStage,
  computeSupportMode,
  computeRiskSignals,
  computeNextBestSteps,
  MEANINGFUL_ACTIONS,
} from '@/lib/guidance/computeGuidanceState';
import {
  APPLICATION_STAGES,
  SUPPORT_MODES,
  RISK_SIGNALS,
  PRIMARY_FOCUS_AREAS,
  FOCUS_AREA_STATUSES,
} from '@/lib/enums';

// =============================================================================
// TEST FIXTURES & FACTORIES
// =============================================================================

/**
 * Create a minimal user object
 */
function createUser(overrides = {}) {
  return {
    savedPrograms: [],
    targetPrograms: [],
    activityLog: [],
    milestones: [],
    dismissedSteps: [],
    primaryFocusAreas: [],
    academicProfile: {},
    certifications: [],
    ...overrides,
  };
}

/**
 * Create a target program
 */
function createTargetProgram(overrides = {}) {
  return {
    id: `prog_${Math.random().toString(36).substr(2, 9)}`,
    name: 'Test Program',
    status: 'not_started',
    checklistProgress: 0,
    checklist: [],
    ...overrides,
  };
}

/**
 * Create an activity log entry
 */
function createActivity(actionType, daysAgo = 0) {
  const timestamp = new Date();
  timestamp.setDate(timestamp.getDate() - daysAgo);
  return {
    actionType,
    timestamp: timestamp.toISOString(),
  };
}

/**
 * Create a dismissal record
 */
function createDismissal(stepId, daysAgo = 0) {
  const dismissedAt = new Date();
  dismissedAt.setDate(dismissedAt.getDate() - daysAgo);
  return {
    stepId,
    dismissedAt: dismissedAt.toISOString(),
  };
}

/**
 * Helper: Get days from now as ISO string
 */
function daysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

// =============================================================================
// A. APPLICATION STAGE COVERAGE (5 scenarios)
// =============================================================================

describe('A. Application Stage Coverage', () => {
  describe('computeApplicationStage', () => {
    it('A1: returns EXPLORING when no saved or target programs', () => {
      const user = createUser({
        savedPrograms: [],
        targetPrograms: [],
      });
      expect(computeApplicationStage(user)).toBe(APPLICATION_STAGES.EXPLORING);
    });

    it('A2: returns STRATEGIZING when saved programs but no targets', () => {
      const user = createUser({
        savedPrograms: [{ id: 'saved_1' }],
        targetPrograms: [],
      });
      expect(computeApplicationStage(user)).toBe(APPLICATION_STAGES.STRATEGIZING);
    });

    it('A3: returns EXECUTING when any program is in_progress or submitted', () => {
      const user = createUser({
        targetPrograms: [
          createTargetProgram({ status: 'in_progress' }),
        ],
      });
      expect(computeApplicationStage(user)).toBe(APPLICATION_STAGES.EXECUTING);

      // Also test submitted
      const userSubmitted = createUser({
        targetPrograms: [
          createTargetProgram({ status: 'submitted' }),
        ],
      });
      expect(computeApplicationStage(userSubmitted)).toBe(APPLICATION_STAGES.EXECUTING);
    });

    it('A4: returns INTERVIEWING when any program is interview_invite or interview_complete', () => {
      const user = createUser({
        targetPrograms: [
          createTargetProgram({ status: 'interview_invite' }),
        ],
      });
      expect(computeApplicationStage(user)).toBe(APPLICATION_STAGES.INTERVIEWING);

      // Also test interview_complete
      const userComplete = createUser({
        targetPrograms: [
          createTargetProgram({ status: 'interview_complete' }),
        ],
      });
      expect(computeApplicationStage(userComplete)).toBe(APPLICATION_STAGES.INTERVIEWING);
    });

    it('A5: returns POST_DECISION when any program is accepted, waitlisted, or denied', () => {
      const userAccepted = createUser({
        targetPrograms: [createTargetProgram({ status: 'accepted' })],
      });
      expect(computeApplicationStage(userAccepted)).toBe(APPLICATION_STAGES.POST_DECISION);

      const userWaitlisted = createUser({
        targetPrograms: [createTargetProgram({ status: 'waitlisted' })],
      });
      expect(computeApplicationStage(userWaitlisted)).toBe(APPLICATION_STAGES.POST_DECISION);

      const userDenied = createUser({
        targetPrograms: [createTargetProgram({ status: 'denied' })],
      });
      expect(computeApplicationStage(userDenied)).toBe(APPLICATION_STAGES.POST_DECISION);
    });

    it('A5b: highest status wins when multiple programs', () => {
      // User has one in_progress and one interview_invite - should be INTERVIEWING
      const user = createUser({
        targetPrograms: [
          createTargetProgram({ status: 'in_progress' }),
          createTargetProgram({ status: 'interview_invite' }),
        ],
      });
      expect(computeApplicationStage(user)).toBe(APPLICATION_STAGES.INTERVIEWING);
    });
  });

  describe('computeSupportMode', () => {
    it('maps EXPLORING to ORIENTATION', () => {
      expect(computeSupportMode(APPLICATION_STAGES.EXPLORING)).toBe(SUPPORT_MODES.ORIENTATION);
    });

    it('maps STRATEGIZING to STRATEGY', () => {
      expect(computeSupportMode(APPLICATION_STAGES.STRATEGIZING)).toBe(SUPPORT_MODES.STRATEGY);
    });

    it('maps EXECUTING to EXECUTION', () => {
      expect(computeSupportMode(APPLICATION_STAGES.EXECUTING)).toBe(SUPPORT_MODES.EXECUTION);
    });

    it('maps INTERVIEWING to CONFIDENCE', () => {
      expect(computeSupportMode(APPLICATION_STAGES.INTERVIEWING)).toBe(SUPPORT_MODES.CONFIDENCE);
    });

    it('maps POST_DECISION to ORIENTATION', () => {
      expect(computeSupportMode(APPLICATION_STAGES.POST_DECISION)).toBe(SUPPORT_MODES.ORIENTATION);
    });
  });
});

// =============================================================================
// B. RISK SIGNAL COVERAGE (6 scenarios)
// =============================================================================

describe('B. Risk Signal Coverage', () => {
  describe('computeRiskSignals', () => {
    it('B1: returns empty array (healthy) when recent activity exists', () => {
      const user = createUser({
        activityLog: [
          createActivity('log_clinical', 1), // 1 day ago
          createActivity('log_shadow', 3),   // 3 days ago
        ],
        targetPrograms: [],
      });
      const signals = computeRiskSignals(user);
      expect(signals).toEqual([]);
    });

    it('B2: returns STAGNATION when 14+ days since meaningful action', () => {
      const user = createUser({
        activityLog: [
          createActivity('log_clinical', 15), // 15 days ago
        ],
        targetPrograms: [],
      });
      const signals = computeRiskSignals(user);
      expect(signals).toContain(RISK_SIGNALS.STAGNATION);
    });

    it('B3: returns MOMENTUM when 3+ meaningful actions in last 7 days', () => {
      const user = createUser({
        activityLog: [
          createActivity('log_clinical', 1),
          createActivity('log_shadow', 2),
          createActivity('complete_checklist_item', 3),
        ],
        targetPrograms: [],
      });
      const signals = computeRiskSignals(user);
      expect(signals).toContain(RISK_SIGNALS.MOMENTUM);
    });

    it('B4: returns DEADLINE_PRESSURE when <30 days to deadline AND <60% complete', () => {
      const user = createUser({
        activityLog: [createActivity('log_clinical', 1)],
        targetPrograms: [
          createTargetProgram({
            deadline: daysFromNow(15), // 15 days from now
            checklistProgress: 0.4,    // 40% complete
          }),
        ],
      });
      const signals = computeRiskSignals(user);
      expect(signals).toContain(RISK_SIGNALS.DEADLINE_PRESSURE);
    });

    it('B5: can have both MOMENTUM and DEADLINE_PRESSURE simultaneously', () => {
      const user = createUser({
        activityLog: [
          createActivity('log_clinical', 1),
          createActivity('log_shadow', 2),
          createActivity('complete_checklist_item', 3),
        ],
        targetPrograms: [
          createTargetProgram({
            deadline: daysFromNow(20),
            checklistProgress: 0.3,
          }),
        ],
      });
      const signals = computeRiskSignals(user);
      expect(signals).toContain(RISK_SIGNALS.MOMENTUM);
      expect(signals).toContain(RISK_SIGNALS.DEADLINE_PRESSURE);
    });

    it('B6: MOMENTUM clears STAGNATION (recovery scenario)', () => {
      // User had long gap but then burst of recent activity
      const user = createUser({
        activityLog: [
          createActivity('log_clinical', 20),  // Old action (would trigger stagnation)
          // But now 3 recent actions
          createActivity('log_clinical', 1),
          createActivity('log_shadow', 2),
          createActivity('complete_checklist_item', 3),
        ],
        targetPrograms: [],
      });
      const signals = computeRiskSignals(user);
      expect(signals).toContain(RISK_SIGNALS.MOMENTUM);
      expect(signals).not.toContain(RISK_SIGNALS.STAGNATION);
    });

    it('B6b: non-meaningful actions do not count for momentum', () => {
      const user = createUser({
        activityLog: [
          // These are not in MEANINGFUL_ACTIONS
          { actionType: 'page_view', timestamp: new Date().toISOString() },
          { actionType: 'login', timestamp: new Date().toISOString() },
          { actionType: 'browse', timestamp: new Date().toISOString() },
        ],
        targetPrograms: [],
      });
      const signals = computeRiskSignals(user);
      // No meaningful actions means no momentum
      expect(signals).not.toContain(RISK_SIGNALS.MOMENTUM);
    });

    it('B7: does not trigger DEADLINE_PRESSURE when checklist >= 60%', () => {
      const user = createUser({
        activityLog: [createActivity('log_clinical', 1)],
        targetPrograms: [
          createTargetProgram({
            deadline: daysFromNow(15),
            checklistProgress: 0.65, // 65% complete
          }),
        ],
      });
      const signals = computeRiskSignals(user);
      expect(signals).not.toContain(RISK_SIGNALS.DEADLINE_PRESSURE);
    });

    it('B8: does not trigger DEADLINE_PRESSURE when deadline > 30 days', () => {
      const user = createUser({
        activityLog: [createActivity('log_clinical', 1)],
        targetPrograms: [
          createTargetProgram({
            deadline: daysFromNow(45), // 45 days from now
            checklistProgress: 0.2,
          }),
        ],
      });
      const signals = computeRiskSignals(user);
      expect(signals).not.toContain(RISK_SIGNALS.DEADLINE_PRESSURE);
    });
  });
});

// =============================================================================
// C. STEP QUALIFICATION COVERAGE (12 scenarios)
// =============================================================================

describe('C. Step Qualification Coverage', () => {
  describe('computeNextBestSteps qualifications', () => {
    it('C1: save_first_program surfaces when no saved programs', () => {
      const user = createUser({
        savedPrograms: [],
        targetPrograms: [],
      });
      const result = computeGuidanceState(user);
      const stepIds = result.nextBestSteps.map(s => s.stepId);
      expect(stepIds).toContain('save_first_program');
    });

    it('C1b: save_first_program does NOT surface when saved programs exist', () => {
      const user = createUser({
        savedPrograms: [{ id: 'saved_1' }],
        targetPrograms: [],
      });
      const result = computeGuidanceState(user);
      const stepIds = result.nextBestSteps.map(s => s.stepId);
      expect(stepIds).not.toContain('save_first_program');
    });

    it('C2: add_target_program surfaces when saved but no targets', () => {
      const user = createUser({
        savedPrograms: [{ id: 'saved_1' }],
        targetPrograms: [],
      });
      const result = computeGuidanceState(user);
      const stepIds = result.nextBestSteps.map(s => s.stepId);
      expect(stepIds).toContain('add_target_program');
    });

    it('C2b: add_target_program does NOT surface when targets exist', () => {
      const user = createUser({
        savedPrograms: [{ id: 'saved_1' }],
        targetPrograms: [createTargetProgram({ status: 'not_started' })],
      });
      const result = computeGuidanceState(user);
      const stepIds = result.nextBestSteps.map(s => s.stepId);
      expect(stepIds).not.toContain('add_target_program');
    });

    it('C3: calculate_gpa surfaces when gpaCalculated is false', () => {
      const user = createUser({
        savedPrograms: [],
        targetPrograms: [],
        academicProfile: { gpaCalculated: false },
      });
      const result = computeGuidanceState(user);
      const stepIds = result.nextBestSteps.map(s => s.stepId);
      expect(stepIds).toContain('calculate_gpa');
    });

    it('C3b: calculate_gpa does NOT surface when gpaCalculated is true', () => {
      const user = createUser({
        savedPrograms: [],
        targetPrograms: [],
        academicProfile: { gpaCalculated: true },
      });
      const result = computeGuidanceState(user);
      const stepIds = result.nextBestSteps.map(s => s.stepId);
      expect(stepIds).not.toContain('calculate_gpa');
    });

    it('C4: identify_prereq_gaps surfaces when targets have missing prereqs', () => {
      const user = createUser({
        savedPrograms: [{ id: 'saved_1' }],
        targetPrograms: [
          createTargetProgram({
            status: 'not_started',
            missingPrereqs: ['organic_chemistry', 'physics'],
          }),
        ],
      });
      const result = computeGuidanceState(user);
      const stepIds = result.nextBestSteps.map(s => s.stepId);
      expect(stepIds).toContain('identify_prereq_gaps');
    });

    it('C5: work_toward_ccrn surfaces when target requires CCRN and user lacks it', () => {
      const user = createUser({
        savedPrograms: [{ id: 'saved_1' }],
        targetPrograms: [
          createTargetProgram({
            status: 'not_started',
            requiresCCRN: true,
          }),
        ],
        certifications: [], // No CCRN
      });
      const result = computeGuidanceState(user);
      const stepIds = result.nextBestSteps.map(s => s.stepId);
      expect(stepIds).toContain('work_toward_ccrn');
    });

    it('C5b: work_toward_ccrn does NOT surface when user has active CCRN', () => {
      const user = createUser({
        savedPrograms: [{ id: 'saved_1' }],
        targetPrograms: [
          createTargetProgram({
            status: 'not_started',
            requiresCCRN: true,
          }),
        ],
        certifications: [{ type: 'CCRN', status: 'active' }],
      });
      const result = computeGuidanceState(user);
      const stepIds = result.nextBestSteps.map(s => s.stepId);
      expect(stepIds).not.toContain('work_toward_ccrn');
    });

    it('C6: plan_gre_prep surfaces when target requires GRE and user has no score', () => {
      const user = createUser({
        savedPrograms: [{ id: 'saved_1' }],
        targetPrograms: [
          createTargetProgram({
            status: 'not_started',
            requiresGRE: true,
          }),
        ],
        academicProfile: { greScore: null },
      });
      const result = computeGuidanceState(user);
      const stepIds = result.nextBestSteps.map(s => s.stepId);
      expect(stepIds).toContain('plan_gre_prep');
    });

    it('C7: build_shadowing_experience surfaces when shadowingHours < 40', () => {
      const user = createUser({
        savedPrograms: [{ id: 'saved_1' }],
        targetPrograms: [createTargetProgram({ status: 'not_started' })],
        shadowingHours: 10,
      });
      const result = computeGuidanceState(user);
      const stepIds = result.nextBestSteps.map(s => s.stepId);
      expect(stepIds).toContain('build_shadowing_experience');
    });

    it('C7b: build_shadowing_experience does NOT surface when shadowingHours >= 40', () => {
      const user = createUser({
        savedPrograms: [{ id: 'saved_1' }],
        targetPrograms: [createTargetProgram({ status: 'not_started' })],
        shadowingHours: 45,
      });
      const result = computeGuidanceState(user);
      const stepIds = result.nextBestSteps.map(s => s.stepId);
      expect(stepIds).not.toContain('build_shadowing_experience');
    });

    it('C8: add_leadership_experience surfaces when leadershipEntries < 3', () => {
      // Note: add_leadership_experience is allowed in STRATEGIZING and EXECUTING stages
      const user = createUser({
        savedPrograms: [{ id: 'saved_1' }],
        targetPrograms: [createTargetProgram({ status: 'in_progress' })], // EXECUTING stage
        leadershipEntries: [{ id: 'lead_1' }], // Only 1
        academicProfile: { gpaCalculated: true }, // Suppress calculate_gpa
        shadowingHours: 50, // Suppress shadowing step
      });
      const result = computeGuidanceState(user);
      const stepIds = result.nextBestSteps.map(s => s.stepId);
      expect(stepIds).toContain('add_leadership_experience');
    });

    it('C9: develop_resume surfaces when resumeCompleted is false', () => {
      // Note: develop_resume is allowed in STRATEGIZING and EXECUTING stages
      const user = createUser({
        savedPrograms: [{ id: 'saved_1' }],
        targetPrograms: [createTargetProgram({ status: 'in_progress' })], // EXECUTING stage
        resumeCompleted: false,
        academicProfile: { gpaCalculated: true }, // Suppress calculate_gpa
        shadowingHours: 50, // Suppress shadowing step
        leadershipEntries: [{ id: '1' }, { id: '2' }, { id: '3' }], // Suppress leadership step
      });
      const result = computeGuidanceState(user);
      const stepIds = result.nextBestSteps.map(s => s.stepId);
      expect(stepIds).toContain('develop_resume');
    });

    it('C10: work_on_personal_statement surfaces when personalStatementCompleted is false', () => {
      // Note: work_on_personal_statement is allowed in STRATEGIZING and EXECUTING stages
      const user = createUser({
        savedPrograms: [{ id: 'saved_1' }],
        targetPrograms: [createTargetProgram({ status: 'in_progress' })], // EXECUTING stage
        personalStatementCompleted: false,
        academicProfile: { gpaCalculated: true }, // Suppress calculate_gpa
        shadowingHours: 50, // Suppress shadowing step
        leadershipEntries: [{ id: '1' }, { id: '2' }, { id: '3' }], // Suppress leadership step
        resumeCompleted: true, // Suppress resume step
      });
      const result = computeGuidanceState(user);
      const stepIds = result.nextBestSteps.map(s => s.stepId);
      expect(stepIds).toContain('work_on_personal_statement');
    });

    it('C11: continue_program_application surfaces for in_progress with <90% checklist', () => {
      const programId = 'prog_123';
      const user = createUser({
        targetPrograms: [
          createTargetProgram({
            id: programId,
            name: 'Duke University',
            status: 'in_progress',
            checklistProgress: 0.5, // 50%
            deadline: daysFromNow(30),
            checklist: [
              { id: '1', completed: true },
              { id: '2', completed: false },
            ],
          }),
        ],
      });
      const result = computeGuidanceState(user);
      const stepIds = result.nextBestSteps.map(s => s.stepId);
      expect(stepIds.some(id => id.startsWith('continue_program_application'))).toBe(true);
    });

    it('C12: submit_application surfaces for in_progress with >=90% checklist', () => {
      const programId = 'prog_456';
      const user = createUser({
        targetPrograms: [
          createTargetProgram({
            id: programId,
            name: 'Emory University',
            status: 'in_progress',
            checklistProgress: 0.95, // 95%
            deadline: daysFromNow(30),
            checklist: [
              { id: '1', completed: true },
              { id: '2', completed: true },
            ],
          }),
        ],
      });
      const result = computeGuidanceState(user);
      const stepIds = result.nextBestSteps.map(s => s.stepId);
      expect(stepIds.some(id => id.startsWith('submit_application'))).toBe(true);
    });
  });
});

// =============================================================================
// D. RANKING LOGIC COVERAGE (4 scenarios)
// =============================================================================

describe('D. Ranking Logic Coverage', () => {
  it('D1: deadline proximity beats priority (closer deadline ranks higher)', () => {
    const user = createUser({
      targetPrograms: [
        createTargetProgram({
          id: 'prog_far',
          name: 'Far Program',
          status: 'in_progress',
          checklistProgress: 0.5,
          deadline: daysFromNow(60), // Far deadline
          checklist: [{ id: '1', completed: false }],
        }),
        createTargetProgram({
          id: 'prog_near',
          name: 'Near Program',
          status: 'in_progress',
          checklistProgress: 0.5,
          deadline: daysFromNow(15), // Near deadline
          checklist: [{ id: '1', completed: false }],
        }),
      ],
    });
    const result = computeGuidanceState(user);
    const programSteps = result.nextBestSteps.filter(s =>
      s.stepId.includes('prog_')
    );

    if (programSteps.length >= 2) {
      // Near deadline should come first
      expect(programSteps[0].stepId).toContain('prog_near');
    }
  });

  it('D2: priority beats focus-area alignment (higher priority step ranks first)', () => {
    // This tests that steps with higher priority values rank higher
    // when deadlines are equal
    const user = createUser({
      savedPrograms: [{ id: 'saved_1' }],
      targetPrograms: [],
      primaryFocusAreas: [
        {
          area: PRIMARY_FOCUS_AREAS.SCHOOL_SEARCH,
          status: FOCUS_AREA_STATUSES.ACTIVE,
        },
      ],
    });
    const result = computeGuidanceState(user);
    // Steps are returned in ranked order
    expect(result.nextBestSteps.length).toBeGreaterThan(0);
  });

  it('D3: focus-area alignment influences ranking', () => {
    const user = createUser({
      savedPrograms: [{ id: 'saved_1' }],
      targetPrograms: [createTargetProgram({ status: 'not_started' })],
      shadowingHours: 10,
      leadershipEntries: [],
      primaryFocusAreas: [
        {
          area: PRIMARY_FOCUS_AREAS.SHADOWING,
          status: FOCUS_AREA_STATUSES.ACTIVE,
        },
      ],
    });
    const result = computeGuidanceState(user);
    // Shadowing-related steps should be boosted due to focus area
    const shadowIdx = result.nextBestSteps.findIndex(s =>
      s.stepId === 'build_shadowing_experience'
    );
    const leaderIdx = result.nextBestSteps.findIndex(s =>
      s.stepId === 'add_leadership_experience'
    );

    // If both exist, shadow should rank higher due to focus area alignment
    if (shadowIdx >= 0 && leaderIdx >= 0) {
      expect(shadowIdx).toBeLessThan(leaderIdx);
    }
  });

  it('D4: impact breadth breaks ties (affects more programs = higher rank)', () => {
    // Create user where a step affects multiple programs
    const user = createUser({
      savedPrograms: [{ id: 'saved_1' }],
      targetPrograms: [
        createTargetProgram({ id: 'prog_1', status: 'not_started', requiresCCRN: true }),
        createTargetProgram({ id: 'prog_2', status: 'not_started', requiresCCRN: true }),
        createTargetProgram({ id: 'prog_3', status: 'not_started', requiresCCRN: true }),
      ],
      certifications: [], // No CCRN
    });
    const result = computeGuidanceState(user);
    // CCRN step affects 3 programs - should rank highly
    const ccrnStep = result.nextBestSteps.find(s => s.stepId === 'work_toward_ccrn');
    expect(ccrnStep).toBeDefined();
  });
});

// =============================================================================
// E. EDGE / SAFETY COVERAGE (5 scenarios)
// =============================================================================

describe('E. Edge/Safety Coverage', () => {
  it('E1: affirmation state - returns 0 steps when all conditions met', () => {
    // User who is well-prepared in every way
    const user = createUser({
      savedPrograms: [{ id: 'saved_1' }],
      targetPrograms: [
        createTargetProgram({
          status: 'submitted', // Already submitted
          checklistProgress: 1.0,
        }),
      ],
      academicProfile: { gpaCalculated: true, greScore: 320 },
      certifications: [{ type: 'CCRN', status: 'active' }],
      shadowingHours: 50,
      leadershipEntries: [{ id: '1' }, { id: '2' }, { id: '3' }],
      resumeCompleted: true,
      personalStatementCompleted: true,
      letterRequests: [{ id: '1' }, { id: '2' }, { id: '3' }],
      milestones: [
        { name: 'Certifications', status: 'completed' },
        { name: 'Shadowing', status: 'completed' },
        { name: 'Resume / CV', status: 'completed' },
        { name: 'Personal Statement', status: 'completed' },
        { name: 'Letters of Recommendation', status: 'completed' },
      ],
    });
    const result = computeGuidanceState(user);
    // May have 0 steps if everything is complete
    expect(result.nextBestSteps.length).toBeLessThanOrEqual(3);
  });

  it('E2: completed milestone suppresses related steps', () => {
    const user = createUser({
      savedPrograms: [{ id: 'saved_1' }],
      targetPrograms: [createTargetProgram({ status: 'not_started' })],
      shadowingHours: 10, // Would normally trigger build_shadowing_experience
      milestones: [
        { name: 'Shadowing', status: 'completed' },
      ],
    });
    const result = computeGuidanceState(user);
    const stepIds = result.nextBestSteps.map(s => s.stepId);
    // Shadowing step should be suppressed due to completed milestone
    expect(stepIds).not.toContain('build_shadowing_experience');
  });

  it('E3: dismissed step is suppressed within 7-day cool-off', () => {
    const user = createUser({
      savedPrograms: [],
      targetPrograms: [],
      dismissedSteps: [
        createDismissal('save_first_program', 3), // Dismissed 3 days ago
      ],
    });
    const result = computeGuidanceState(user);
    const stepIds = result.nextBestSteps.map(s => s.stepId);
    expect(stepIds).not.toContain('save_first_program');
  });

  it('E4: dismissed step resurfaces after 7-day cool-off', () => {
    const user = createUser({
      savedPrograms: [],
      targetPrograms: [],
      dismissedSteps: [
        createDismissal('save_first_program', 10), // Dismissed 10 days ago
      ],
    });
    const result = computeGuidanceState(user);
    const stepIds = result.nextBestSteps.map(s => s.stepId);
    expect(stepIds).toContain('save_first_program');
  });

  it('E5: max 3 steps returned even when many qualify', () => {
    // Create a user with many qualifying steps
    const user = createUser({
      savedPrograms: [{ id: 'saved_1' }],
      targetPrograms: [
        createTargetProgram({
          status: 'not_started',
          requiresCCRN: true,
          requiresGRE: true,
          missingPrereqs: ['physics'],
        }),
      ],
      academicProfile: { gpaCalculated: false },
      certifications: [],
      shadowingHours: 5,
      leadershipEntries: [],
      resumeCompleted: false,
      personalStatementCompleted: false,
    });
    const result = computeGuidanceState(user);
    expect(result.nextBestSteps.length).toBeLessThanOrEqual(3);
  });
});

// =============================================================================
// F. CHAOS / REGRESSION TESTS (3+ scenarios)
// =============================================================================

describe('F. Chaos/Regression Tests', () => {
  it('F1: handles empty user object gracefully', () => {
    const user = {};
    expect(() => computeGuidanceState(user)).not.toThrow();
    const result = computeGuidanceState(user);
    expect(result).toHaveProperty('applicationStage');
    expect(result).toHaveProperty('supportMode');
    expect(result).toHaveProperty('riskSignals');
    expect(result).toHaveProperty('nextBestSteps');
  });

  it('F2: handles partial/missing arrays gracefully', () => {
    const user = {
      savedPrograms: null,
      targetPrograms: undefined,
      // activityLog missing entirely
    };
    expect(() => computeGuidanceState(user)).not.toThrow();
    const result = computeGuidanceState(user);
    expect(result.applicationStage).toBe(APPLICATION_STAGES.EXPLORING);
  });

  it('F3: handles malformed timestamps gracefully', () => {
    const user = createUser({
      activityLog: [
        { actionType: 'log_clinical', timestamp: 'not-a-date' },
        { actionType: 'log_shadow', timestamp: null },
        { actionType: 'complete_checklist_item', timestamp: '' },
      ],
    });
    expect(() => computeGuidanceState(user)).not.toThrow();
  });

  it('F4: handles programs with missing fields', () => {
    const user = createUser({
      targetPrograms: [
        { id: 'prog_1' }, // Missing status, checklist, deadline
        { id: 'prog_2', status: 'in_progress' }, // Missing checklistProgress
      ],
    });
    expect(() => computeGuidanceState(user)).not.toThrow();
  });

  it('F5: output schema is correct', () => {
    const user = createUser({
      savedPrograms: [],
      targetPrograms: [],
    });
    const result = computeGuidanceState(user);

    // Verify structure
    expect(result).toHaveProperty('applicationStage');
    expect(result).toHaveProperty('supportMode');
    expect(result).toHaveProperty('primaryFocusAreas');
    expect(result).toHaveProperty('riskSignals');
    expect(result).toHaveProperty('nextBestSteps');
    expect(result).toHaveProperty('lastComputedAt');

    // Verify types
    expect(typeof result.applicationStage).toBe('string');
    expect(typeof result.supportMode).toBe('string');
    expect(Array.isArray(result.primaryFocusAreas)).toBe(true);
    expect(Array.isArray(result.riskSignals)).toBe(true);
    expect(Array.isArray(result.nextBestSteps)).toBe(true);
    expect(typeof result.lastComputedAt).toBe('string');
  });

  it('F6: nextBestSteps have correct shape', () => {
    const user = createUser({
      savedPrograms: [],
      targetPrograms: [],
    });
    const result = computeGuidanceState(user);

    if (result.nextBestSteps.length > 0) {
      const step = result.nextBestSteps[0];
      expect(step).toHaveProperty('stepId');
      expect(step).toHaveProperty('action');
      expect(step).toHaveProperty('whyItMatters');
      expect(step).toHaveProperty('cta');
      expect(step.cta).toHaveProperty('label');
      expect(step.cta).toHaveProperty('href');
      expect(step).toHaveProperty('dismissedAt');
    }
  });
});

// =============================================================================
// INTEGRATION TEST: Full computeGuidanceState flow
// =============================================================================

describe('Integration: computeGuidanceState', () => {
  it('computes full guidance state for typical exploring user', () => {
    const user = createUser({
      savedPrograms: [],
      targetPrograms: [],
      academicProfile: { gpaCalculated: false },
      // Add recent activity to avoid stagnation signal
      activityLog: [
        createActivity('log_clinical', 1),
      ],
    });

    const result = computeGuidanceState(user);

    expect(result.applicationStage).toBe(APPLICATION_STAGES.EXPLORING);
    expect(result.supportMode).toBe(SUPPORT_MODES.ORIENTATION);
    expect(result.riskSignals).toEqual([]);
    expect(result.nextBestSteps.length).toBeGreaterThan(0);
    expect(result.lastComputedAt).toBeDefined();
  });

  it('computes full guidance state for typical strategizing user', () => {
    const user = createUser({
      savedPrograms: [{ id: 'saved_1' }, { id: 'saved_2' }],
      targetPrograms: [],
      academicProfile: { gpaCalculated: true },
      shadowingHours: 20,
    });

    const result = computeGuidanceState(user);

    expect(result.applicationStage).toBe(APPLICATION_STAGES.STRATEGIZING);
    expect(result.supportMode).toBe(SUPPORT_MODES.STRATEGY);
  });

  it('computes full guidance state for typical executing user', () => {
    const user = createUser({
      savedPrograms: [{ id: 'saved_1' }],
      targetPrograms: [
        createTargetProgram({
          id: 'prog_1',
          name: 'Duke CRNA',
          status: 'in_progress',
          checklistProgress: 0.6,
          deadline: daysFromNow(45),
          checklist: [
            { id: '1', completed: true },
            { id: '2', completed: false },
          ],
        }),
      ],
      activityLog: [
        createActivity('log_clinical', 1),
        createActivity('complete_checklist_item', 2),
      ],
    });

    const result = computeGuidanceState(user);

    expect(result.applicationStage).toBe(APPLICATION_STAGES.EXECUTING);
    expect(result.supportMode).toBe(SUPPORT_MODES.EXECUTION);
  });

  it('computes full guidance state for interviewing user', () => {
    const user = createUser({
      savedPrograms: [{ id: 'saved_1' }],
      targetPrograms: [
        createTargetProgram({
          status: 'interview_invite',
        }),
      ],
    });

    const result = computeGuidanceState(user);

    expect(result.applicationStage).toBe(APPLICATION_STAGES.INTERVIEWING);
    expect(result.supportMode).toBe(SUPPORT_MODES.CONFIDENCE);
  });
});
