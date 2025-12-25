/**
 * Mock User Data
 *
 * TODO: Replace with API calls to:
 * - GET /api/user/profile
 * - GET /api/user/academic
 * - GET /api/user/clinical
 */

import {
  APPLICATION_STAGES,
  SUPPORT_MODES,
  PRIMARY_FOCUS_AREAS,
  FOCUS_AREA_STATUSES,
  FOCUS_AREA_SOURCES,
  SUBSCRIPTION_TIERS,
  SUBSCRIPTION_STATUSES
} from '@/lib/enums';

export const mockUser = {
  id: "user_001",
  email: "sarah.johnson@email.com",
  name: "Sarah Johnson",
  preferredName: "Sarah",
  avatarUrl: null,

  // Subscription - using enums from enums.js
  subscriptionTier: SUBSCRIPTION_TIERS.MEMBER,
  subscriptionStatus: SUBSCRIPTION_STATUSES.ACTIVE,
  trialEndsAt: null,

  // Program Status
  programStatus: "some_targets",

  // Category 12: Guidance & Focus State
  // See /docs/skills/canonical-user-model.md for field definitions
  // See /docs/skills/guidance-engine-spec.md for computation rules
  guidanceState: {
    // applicationStage: What lifecycle phase the user is in (computed by Guidance Engine)
    applicationStage: APPLICATION_STAGES.STRATEGIZING,

    // supportMode: How the app should help (guidance style, derived from applicationStage)
    supportMode: SUPPORT_MODES.STRATEGY,

    // primaryFocusAreas: Active focus areas with status and timestamps
    // Note: Focus areas can only be marked 'completed' by the user, not the system
    primaryFocusAreas: [
      {
        area: PRIMARY_FOCUS_AREAS.SCHOOL_SEARCH,
        status: FOCUS_AREA_STATUSES.ACTIVE,
        activatedAt: "2024-11-01T00:00:00Z",
        lastEngagedAt: "2024-12-08T14:30:00Z",
        source: FOCUS_AREA_SOURCES.BEHAVIOR,
      },
      {
        area: PRIMARY_FOCUS_AREAS.GPA_PREREQS,
        status: FOCUS_AREA_STATUSES.ACTIVE,
        activatedAt: "2024-10-15T00:00:00Z",
        lastEngagedAt: "2024-12-05T10:00:00Z",
        source: FOCUS_AREA_SOURCES.USER_ACTION,
      },
      {
        area: PRIMARY_FOCUS_AREAS.CERTIFICATIONS,
        status: FOCUS_AREA_STATUSES.SECONDARY,
        activatedAt: "2024-09-01T00:00:00Z",
        lastEngagedAt: "2024-11-20T09:00:00Z",
        source: FOCUS_AREA_SOURCES.SYSTEM,
      },
      {
        area: PRIMARY_FOCUS_AREAS.SHADOWING,
        status: FOCUS_AREA_STATUSES.SECONDARY,
        activatedAt: "2024-08-01T00:00:00Z",
        lastEngagedAt: "2024-11-15T00:00:00Z",
        source: FOCUS_AREA_SOURCES.BEHAVIOR,
      },
    ],

    // riskSignals: Array of active risk signals (computed by Guidance Engine)
    // Empty array = healthy state. Possible values: 'stagnation', 'deadline_pressure', 'momentum'
    riskSignals: [],

    // nextBestSteps: 0-3 actionable guidance items (computed by Guidance Engine)
    // Empty array = silence/affirmation (user is on track)
    nextBestSteps: [],

    // lastComputedAt: When the Guidance Engine last computed this state
    lastComputedAt: "2024-12-08T00:00:00Z",
  },

  // Gamification
  points: 847,
  level: 3,
  levelName: "Ambitious Achiever",
  badges: [
    {
      id: "badge_1",
      name: "Target Trailblazer",
      description: "Converted 3+ Target Programs",
      earnedAt: "2024-09-15"
    }
  ],

  // Timestamps
  createdAt: "2024-06-01T00:00:00Z",
  lastLoginAt: "2024-11-28T14:30:00Z",
  onboardingCompletedAt: null,

  // Smart Prompts / Nudge System Fields
  loginStreak: 7,
  previousStreak: 6,
  onboardingWidgetComplete: false,
  onboardingWidgetProgress: 4, // 4 of 8 items completed
  readyScore: 65,
  previousReadyScore: 62,
  lastReadyScoreCelebration: null,
  previousChecklistCompleted: 3,
  hasSeenFirstTargetCelebration: true,
  hasSeenSchoolScoutBadge: false,

  // =========================================================================
  // GUIDANCE ENGINE FIELDS
  // See /docs/skills/guidance-engine-spec.md for specification
  // =========================================================================

  // Application Materials Progress
  resumeCompleted: false,
  personalStatementCompleted: false,

  // Experience Tracking (used by qualification rules)
  shadowingHours: 12, // Total shadow hours logged
  leadershipEntries: [
    {
      id: 'lead_001',
      title: 'Unit Council Member',
      organization: 'ICU Department',
      startDate: '2023-06-01',
      description: 'Participate in monthly meetings to improve unit processes',
    },
  ],

  // Dismissed Next Best Steps (7-day cool-off period per spec)
  // Format: { stepId: string, dismissedAt: ISO datetime }
  dismissedSteps: [],

  // Activity Log for Stagnation/Momentum Detection
  // Meaningful actions from last 30 days (most recent first)
  // Types: log_clinical, log_shadow, log_eq, complete_checklist_item,
  //        submit_application, add_target_program, update_target_program, complete_milestone_item
  activityLog: [
    { actionType: 'log_clinical', timestamp: '2024-12-08T14:30:00Z' },
    { actionType: 'log_clinical', timestamp: '2024-12-07T10:00:00Z' },
    { actionType: 'log_clinical', timestamp: '2024-12-06T09:15:00Z' },
    { actionType: 'complete_checklist_item', timestamp: '2024-12-05T16:00:00Z' },
    { actionType: 'log_eq', timestamp: '2024-12-04T20:00:00Z' },
    { actionType: 'log_shadow', timestamp: '2024-11-28T12:00:00Z' },
    { actionType: 'update_target_program', timestamp: '2024-11-25T11:00:00Z' },
  ],

  // Saved Programs (not yet targets) - used for stage computation
  // User has saved these programs but not converted to targets
  savedPrograms: [
    { id: 'saved_003', programId: 'school_003', savedAt: '2024-10-01T00:00:00Z' },
    { id: 'saved_004', programId: 'school_004', savedAt: '2024-09-15T00:00:00Z' },
  ],

  // Letter of Recommendation Requests
  letterRequests: [
    {
      id: "lor_001",
      recommenderName: "Dr. Sarah Chen",
      recommenderTitle: "ICU Medical Director",
      requestedDate: "2024-11-05T00:00:00Z",
      status: "requested", // not_requested, requested, received, declined
      programIds: ["target_001"],
    },
    {
      id: "lor_002",
      recommenderName: "Jane Smith, RN",
      recommenderTitle: "Charge Nurse",
      requestedDate: "2024-11-20T00:00:00Z",
      status: "received",
      receivedDate: "2024-11-25T00:00:00Z",
      programIds: ["target_001", "target_002"],
    },
  ],

  // Saved Events for nudges
  savedEvents: [
    {
      id: "event_001",
      name: "Duke CRNA Info Session",
      date: "2024-12-09T18:00:00Z", // Tomorrow relative to demo
      attendanceStatus: "saved", // saved, confirmed, attended, not_attending, not_attended
      programId: "school_001",
    },
    {
      id: "event_002",
      name: "Emory Virtual Open House",
      date: "2024-12-04T14:00:00Z", // 3 days ago relative to demo
      attendanceStatus: "saved",
      programId: "school_002",
    },
  ],
};

export const mockAcademicProfile = {
  userId: "user_001",

  // GPA Metrics
  overallGpa: 3.45,
  scienceGpa: 3.23,
  scienceGpaWithForgiveness: 3.35,
  last60Gpa: 3.52,
  gpaCalculated: true,

  // GRE Scores
  greQuantitative: 156,
  greVerbal: 152,
  greAnalyticalWriting: 4.0,
  greCombined: 308,

  // Prerequisites Completed
  // Updated structure supports retake tracking
  completedPrerequisites: [
    {
      courseType: "anatomy_physiology",
      status: "completed",
      grade: "A",
      year: 2022,
      schoolName: "Portage Learning",
    },
    {
      courseType: "general_chemistry",
      status: "completed",
      originalGrade: "C+",
      originalYear: 2014,
      retakeGrade: "A",
      retakeYear: 2023,
      schoolName: "ASU → Portage Learning",
    },
    {
      courseType: "organic_chemistry",
      status: "completed",
      grade: "A",
      year: 2023,
      schoolName: "Portage Learning",
    },
    {
      courseType: "biochemistry",
      status: "planned",
    },
    {
      courseType: "physics",
      status: "completed",
      originalGrade: "C",
      originalYear: 2015,
      retakeGrade: "B+",
      retakeYear: 2022,
      schoolName: "ASU → Portage Learning",
    },
    {
      courseType: "statistics",
      status: "completed",
      grade: "A",
      year: 2018,
      schoolName: "Portage Learning",
    },
    {
      courseType: "pharmacology",
      status: "completed",
      grade: "B",
      year: 2019,
      schoolName: "Portage Learning",
    },
    {
      courseType: "pathophysiology",
      status: "completed",
      grade: "A",
      year: 2020,
      schoolName: "Portage Learning",
    },
    {
      courseType: "microbiology",
      status: "in_progress",
      schoolName: "Portage Learning",
    },
  ]
};

export const mockClinicalProfile = {
  userId: "user_001",

  // ICU Experience
  primaryIcuType: "micu",
  additionalIcuTypes: ["cvicu"],
  totalYearsExperience: 3.5,

  // Certifications
  // Note: expirationDate is used by certification nudge engine
  certifications: [
    {
      type: "ccrn",
      status: "passed",
      earnedDate: "2023-05-15T00:00:00Z",
      expiresDate: "2026-05-15T00:00:00Z",
      expirationDate: "2026-05-15T00:00:00Z"
    },
    {
      type: "bls",
      status: "passed",
      earnedDate: "2023-01-10T00:00:00Z",
      expiresDate: "2025-01-10T00:00:00Z",
      expirationDate: "2025-01-10T00:00:00Z" // ~30 days from demo date - should trigger nudge
    },
    {
      type: "acls",
      status: "passed",
      earnedDate: "2023-01-10T00:00:00Z",
      expiresDate: "2025-01-10T00:00:00Z",
      expirationDate: "2025-01-10T00:00:00Z"
    }
  ]
};

// Tracker Stats
// Note: lastEntryDate fields are used by engagement nudge engine
export const mockTrackerStats = {
  clinical: {
    streak: 7,
    totalLogs: 47,
    populations: 12,
    devices: 8,
    procedures: 15,
    pointsPerLog: 2, // Standard points per log entry
    lastEntryDate: "2024-11-28T00:00:00Z" // When user last logged clinical
  },
  eq: {
    streak: 3,
    totalLogs: 8,
    lastEntryDate: "2024-11-25T00:00:00Z" // When user last logged EQ reflection
  },
  shadow: {
    totalHours: 12,
    casesObserved: 24,
    skillsObserved: 8,
    lastEntryDate: "2024-11-15T00:00:00Z" // When user last logged shadow day
  },
  events: {
    totalLogged: 2,
    lastEntryDate: "2024-11-20T00:00:00Z" // When user last logged event
  }
};

// Clinical Entry Milestones
// TODO: Replace with API call to /api/gamification/milestones
export const clinicalMilestones = [
  { value: 10, icon: '👣', name: 'First Steps', description: "You've logged 10 clinical entries!" },
  { value: 25, icon: '📊', name: 'Consistent Logger', description: '25 entries - you\'re building a habit!' },
  { value: 50, icon: '⭐', name: 'Critical Care Crusher', description: '50 entries - true dedication!' },
  { value: 100, icon: '🏆', name: 'ICU Expert', description: "100 entries - you're a documentation pro!" },
];

// Gamification data
export const mockLevels = [
  { level: 1, name: "Aspiring Applicant", pointsRequired: 0, nextLevelPoints: 200 },
  { level: 2, name: "Dedicated Dreamer", pointsRequired: 200, nextLevelPoints: 600 },
  { level: 3, name: "Ambitious Achiever", pointsRequired: 600, nextLevelPoints: 1000 },
  { level: 4, name: "Committed Candidate", pointsRequired: 1000, nextLevelPoints: 1600 },
  { level: 5, name: "Goal Crusher", pointsRequired: 1600, nextLevelPoints: 2000 },
  { level: 6, name: "Peak Performer", pointsRequired: 2000, nextLevelPoints: null }
];

// Helper to get next level info
export function getNextLevelInfo(currentPoints) {
  const currentLevel = mockLevels.find((level, index) => {
    const nextLevel = mockLevels[index + 1];
    return currentPoints >= level.pointsRequired &&
           (!nextLevel || currentPoints < nextLevel.pointsRequired);
  });

  const nextLevel = mockLevels.find(level => level.pointsRequired > currentPoints);

  if (!nextLevel) {
    return {
      level: 6,
      levelName: "Peak Performer",
      pointsToNext: 0,
      progress: 100
    };
  }

  const pointsIntoLevel = currentPoints - currentLevel.pointsRequired;
  const pointsNeededForNext = nextLevel.pointsRequired - currentLevel.pointsRequired;
  const progress = (pointsIntoLevel / pointsNeededForNext) * 100;

  return {
    level: currentLevel.level,
    levelName: currentLevel.name,
    pointsToNext: nextLevel.pointsRequired - currentPoints,
    progress: Math.round(progress)
  };
}
