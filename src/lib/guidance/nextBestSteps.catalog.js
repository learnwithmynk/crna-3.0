/**
 * Next Best Steps Catalog
 *
 * The "menu" of all possible Next Best Steps the Guidance Engine can surface.
 * The engine determines which steps qualify at runtime based on user data.
 *
 * Architecture:
 * - Catalog = what steps exist (this file)
 * - Engine = which steps qualify + ranking (guidanceEngine.js - future)
 *
 * See /docs/skills/guidance-engine-spec.md for full specification.
 */

import { APPLICATION_STAGES, PRIMARY_FOCUS_AREAS } from '@/lib/enums';

// =============================================================================
// TYPE DEFINITION (for reference - this is a JS file)
// =============================================================================
/**
 * @typedef {Object} NextBestStepDefinition
 * @property {string} stepId - Unique identifier
 * @property {string} action - Verb phrase (area-focused, not task-specific)
 * @property {string} whyItMatters - Brief explanation of impact
 * @property {string} href - Link destination (may include {programId}, {programName} tokens)
 * @property {string} milestone - Which of the 13 milestones this relates to
 * @property {string} [focusArea] - Optional focus area for ranking
 * @property {string[]} allowedStages - Which application stages this step can appear in
 * @property {boolean} [programContextual] - If true, generates per target program
 */

// =============================================================================
// 1️⃣ FOUNDATIONS & EARLY DIRECTION
// =============================================================================

export const FOUNDATIONAL_STEPS = [
  {
    stepId: 'learn_how_programs_evaluate',
    action: 'Learn how CRNA programs evaluate applicants',
    whyItMatters:
      'Understanding what programs look for helps you make smarter decisions from day one.',
    href: '/learning-library/understanding-the-profession',
    milestone: 'Understand the Profession + Early Prep',
    focusArea: PRIMARY_FOCUS_AREAS.SCHOOL_SEARCH,
    allowedStages: [APPLICATION_STAGES.EXPLORING],
  },

  {
    stepId: 'save_first_program',
    action: 'Save your first CRNA program',
    whyItMatters:
      'Saving programs helps us tailor your guidance to your specific goals.',
    href: '/school-database',
    milestone: 'Explore & Save CRNA Programs',
    focusArea: PRIMARY_FOCUS_AREAS.SCHOOL_SEARCH,
    allowedStages: [APPLICATION_STAGES.EXPLORING],
  },

  {
    stepId: 'add_target_program',
    action: 'Add a target program to start tracking',
    whyItMatters:
      'Target programs unlock custom checklists, deadlines, and personalized guidance.',
    href: '/my-programs',
    milestone: 'Explore & Save CRNA Programs',
    focusArea: PRIMARY_FOCUS_AREAS.SCHOOL_SEARCH,
    allowedStages: [APPLICATION_STAGES.EXPLORING, APPLICATION_STAGES.STRATEGIZING],
  },
];

// =============================================================================
// 2️⃣ ACADEMIC READINESS (GPA + PREREQS)
// =============================================================================

export const ACADEMIC_READINESS_STEPS = [
  {
    stepId: 'calculate_gpa',
    action: 'Calculate your GPA',
    whyItMatters:
      'CRNA programs evaluate multiple GPA types. Knowing yours helps identify where to focus.',
    href: '/gpa-calculator',
    milestone: 'GPA + Prerequisites',
    focusArea: PRIMARY_FOCUS_AREAS.GPA_PREREQS,
    allowedStages: [APPLICATION_STAGES.EXPLORING, APPLICATION_STAGES.STRATEGIZING],
  },

  {
    stepId: 'identify_prereq_gaps',
    action: 'Identify prerequisite gaps for your target programs',
    whyItMatters:
      'Prerequisite courses often take the longest. Identifying gaps early sets you up for success.',
    href: '/prerequisite-library',
    milestone: 'GPA + Prerequisites',
    focusArea: PRIMARY_FOCUS_AREAS.GPA_PREREQS,
    allowedStages: [APPLICATION_STAGES.STRATEGIZING, APPLICATION_STAGES.EXECUTING],
  },
];

// =============================================================================
// 3️⃣ CERTIFICATIONS & EXAMS
// =============================================================================

export const CERTIFICATION_STEPS = [
  {
    stepId: 'work_toward_ccrn',
    action: 'Work toward your CCRN certification',
    whyItMatters:
      'CCRN is required by most CRNA programs and signals critical care competence.',
    href: '/certifications/ccrn',
    milestone: 'Certifications',
    focusArea: PRIMARY_FOCUS_AREAS.CERTIFICATIONS,
    allowedStages: [APPLICATION_STAGES.STRATEGIZING, APPLICATION_STAGES.EXECUTING],
  },

  {
    stepId: 'explore_additional_certs',
    action: 'Explore certifications beyond CCRN',
    whyItMatters:
      'Additional certifications like CSC or CMC can strengthen your application.',
    href: '/certifications',
    milestone: 'Certifications',
    focusArea: PRIMARY_FOCUS_AREAS.CERTIFICATIONS,
    allowedStages: [APPLICATION_STAGES.STRATEGIZING, APPLICATION_STAGES.EXECUTING],
  },

  {
    stepId: 'plan_gre_prep',
    action: 'Plan your GRE preparation',
    whyItMatters:
      'Many programs still require the GRE. Planning early gives you flexibility.',
    href: '/gre-study-plan',
    milestone: 'GRE',
    focusArea: PRIMARY_FOCUS_AREAS.GPA_PREREQS,
    allowedStages: [APPLICATION_STAGES.STRATEGIZING],
  },
];

// =============================================================================
// 4️⃣ EXPERIENCE BUILDING (CLINICAL, SHADOWING, LEADERSHIP)
// =============================================================================

export const EXPERIENCE_BUILDING_STEPS = [
  {
    stepId: 'log_clinical_experience',
    action: 'Log your clinical experiences',
    whyItMatters:
      'Your clinical logs power your resume, essays, and interview prep.',
    href: '/clinical-tracker',
    milestone: 'Critical Care Experience',
    focusArea: PRIMARY_FOCUS_AREAS.SHADOWING,
    allowedStages: [
      APPLICATION_STAGES.EXPLORING,
      APPLICATION_STAGES.STRATEGIZING,
      APPLICATION_STAGES.EXECUTING,
    ],
  },

  {
    stepId: 'build_shadowing_experience',
    action: 'Build your shadowing experience',
    whyItMatters:
      'Shadowing demonstrates commitment and gives you concrete stories for essays and interviews.',
    href: '/shadowing-tracker',
    milestone: 'Shadowing',
    focusArea: PRIMARY_FOCUS_AREAS.SHADOWING,
    allowedStages: [APPLICATION_STAGES.STRATEGIZING, APPLICATION_STAGES.EXECUTING],
  },

  {
    stepId: 'add_leadership_experience',
    action: 'Add leadership and involvement experiences',
    whyItMatters:
      'Leadership shows initiative and differentiates you from other qualified applicants.',
    href: '/leadership-tracker',
    milestone: 'Leadership + Community Involvement',
    focusArea: PRIMARY_FOCUS_AREAS.LEADERSHIP,
    allowedStages: [APPLICATION_STAGES.STRATEGIZING, APPLICATION_STAGES.EXECUTING],
  },

  {
    stepId: 'explore_upcoming_events',
    action: 'Explore upcoming CRNA events',
    whyItMatters:
      "Many events happen only once a year. Planning ahead ensures you don't miss key opportunities.",
    href: '/events',
    milestone: 'Anesthesia Events + Networking',
    // No focusArea - networking is background activity per spec
    allowedStages: [APPLICATION_STAGES.STRATEGIZING, APPLICATION_STAGES.EXECUTING],
  },
];

// =============================================================================
// 5️⃣ APPLICATION MATERIALS
// =============================================================================

export const APPLICATION_MATERIAL_STEPS = [
  {
    stepId: 'develop_resume',
    action: 'Develop your CRNA resume',
    whyItMatters:
      'Your resume is foundational for networking, applications, and interviews.',
    href: '/resume-builder',
    milestone: 'Resume / CV',
    focusArea: PRIMARY_FOCUS_AREAS.RESUME,
    allowedStages: [APPLICATION_STAGES.STRATEGIZING, APPLICATION_STAGES.EXECUTING],
  },

  {
    stepId: 'work_on_personal_statement',
    action: 'Work on your personal statement',
    whyItMatters:
      'Starting early allows time for reflection, drafts, and strong feedback.',
    href: '/learning-library/personal-statement',
    milestone: 'Personal Statement',
    focusArea: PRIMARY_FOCUS_AREAS.ESSAY,
    allowedStages: [APPLICATION_STAGES.STRATEGIZING, APPLICATION_STAGES.EXECUTING],
  },

  {
    stepId: 'plan_recommendation_letters',
    action: 'Plan your letters of recommendation',
    whyItMatters:
      'Letters take coordination and time. Planning early avoids last-minute stress.',
    href: '/lor-tracker',
    milestone: 'Letters of Recommendation',
    focusArea: PRIMARY_FOCUS_AREAS.ESSAY,
    allowedStages: [APPLICATION_STAGES.STRATEGIZING, APPLICATION_STAGES.EXECUTING],
  },
];

// =============================================================================
// 6️⃣ ACTIVE APPLICATIONS & INTERVIEW PREP
// =============================================================================

export const APPLICATION_EXECUTION_STEPS = [
  {
    stepId: 'continue_program_application',
    action: 'Continue your {programName} application',
    whyItMatters:
      'You have {incompleteCount} items remaining before the {deadline} deadline.',
    href: '/my-programs/{programId}',
    milestone: 'Target Program Checklists',
    focusArea: PRIMARY_FOCUS_AREAS.SCHOOL_SEARCH,
    allowedStages: [APPLICATION_STAGES.EXECUTING],
    programContextual: true,
  },

  {
    stepId: 'submit_application',
    action: 'Submit your {programName} application',
    whyItMatters:
      'Your checklist is nearly complete. Submitting on time ensures consideration.',
    href: '/my-programs/{programId}',
    milestone: 'Target Program Checklists',
    focusArea: PRIMARY_FOCUS_AREAS.SCHOOL_SEARCH,
    allowedStages: [APPLICATION_STAGES.EXECUTING],
    programContextual: true,
  },

  {
    stepId: 'prepare_for_interviews',
    action: 'Prepare for your upcoming interviews',
    whyItMatters:
      'Strong interviews are built over time. Starting now builds confidence.',
    href: '/learning-library/interview-prep',
    milestone: 'Interview Preparation',
    focusArea: PRIMARY_FOCUS_AREAS.INTERVIEW_PREP,
    allowedStages: [APPLICATION_STAGES.EXECUTING, APPLICATION_STAGES.INTERVIEWING],
  },

  {
    stepId: 'practice_interview_skills',
    action: 'Practice your interview skills',
    whyItMatters:
      'Practicing how you communicate builds confidence and clarity.',
    href: '/mock-interviews',
    milestone: 'Interview Preparation',
    focusArea: PRIMARY_FOCUS_AREAS.INTERVIEW_PREP,
    allowedStages: [APPLICATION_STAGES.INTERVIEWING],
  },
];

// =============================================================================
// FULL CATALOG EXPORT
// =============================================================================

export const NEXT_BEST_STEP_CATALOG = [
  ...FOUNDATIONAL_STEPS,
  ...ACADEMIC_READINESS_STEPS,
  ...CERTIFICATION_STEPS,
  ...EXPERIENCE_BUILDING_STEPS,
  ...APPLICATION_MATERIAL_STEPS,
  ...APPLICATION_EXECUTION_STEPS,
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get a step definition by ID
 * @param {string} stepId
 * @returns {NextBestStepDefinition|undefined}
 */
export function getStepById(stepId) {
  return NEXT_BEST_STEP_CATALOG.find((step) => step.stepId === stepId);
}

/**
 * Get all steps for a given application stage
 * @param {string} stage - APPLICATION_STAGES value
 * @returns {NextBestStepDefinition[]}
 */
export function getStepsForStage(stage) {
  return NEXT_BEST_STEP_CATALOG.filter((step) =>
    step.allowedStages.includes(stage)
  );
}

/**
 * Get all program-contextual steps (templates that need program data)
 * @returns {NextBestStepDefinition[]}
 */
export function getProgramContextualSteps() {
  return NEXT_BEST_STEP_CATALOG.filter((step) => step.programContextual);
}

/**
 * Get all steps for a given milestone
 * @param {string} milestone
 * @returns {NextBestStepDefinition[]}
 */
export function getStepsForMilestone(milestone) {
  return NEXT_BEST_STEP_CATALOG.filter((step) => step.milestone === milestone);
}

export default NEXT_BEST_STEP_CATALOG;
