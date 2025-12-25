/**
 * Task Configuration - Dynamic Task Management System
 *
 * This file contains configuration for:
 * - Default task templates for target programs
 * - Global task categories (GRE/CCRN - one-time exams)
 * - Checklist-to-task category mappings for sync
 * - Dashboard suggested tasks for users without targets
 *
 * Note: This is configuration data, NOT mock data.
 * Schools/programs come from Supabase, but task templates
 * and mappings are configured here.
 */

/**
 * Default task templates generated for each target program.
 * weeksBeforeDeadline: How many weeks before the application deadline this task should be due.
 * isGlobal: If true, this task appears once across all programs (uses earliest deadline).
 * triggersChecklistSync: If true, completing this task offers to sync related checklist items.
 */
export const DEFAULT_TASK_TEMPLATES = [
  // Application submission tasks (closest to deadline)
  { task: 'Submit Application', weeksBeforeDeadline: 0, category: 'application', isOptional: false },
  { task: 'Complete application portal', weeksBeforeDeadline: 1, category: 'application', isOptional: false },
  { task: 'Pay application fee', weeksBeforeDeadline: 1, category: 'application', isOptional: false },
  { task: 'Follow up on LORs', weeksBeforeDeadline: 3, category: 'lor', isOptional: false },
  { task: 'Essay Final Draft', weeksBeforeDeadline: 8, category: 'personal-statement', isOptional: false },
  { task: 'Request letters of recommendation', weeksBeforeDeadline: 10, category: 'lor', isOptional: false },
  { task: 'Complete essay second draft', weeksBeforeDeadline: 10, category: 'personal-statement', isOptional: false },
  { task: 'Request official transcripts', weeksBeforeDeadline: 10, category: 'transcripts', isOptional: false },
  { task: 'Complete essay first draft', weeksBeforeDeadline: 12, category: 'personal-statement', isOptional: false },
  { task: '(Optional) Second certification', weeksBeforeDeadline: 12, category: 'ccrn', isOptional: true },
  { task: 'Complete resume', weeksBeforeDeadline: 16, category: 'resume', isOptional: false },
  { task: 'First certification (ie. CCRN, CMC)', weeksBeforeDeadline: 16, category: 'ccrn', isOptional: false },

  // GRE tasks (global - only need to be done once across all schools)
  { task: 'GRE Exam', weeksBeforeDeadline: 20, category: 'gre', isOptional: false, isGlobal: true, triggersChecklistSync: true },
  { task: 'Schedule the GRE', weeksBeforeDeadline: 23, category: 'gre', isOptional: false, isGlobal: true },
  { task: 'Take GRE Practice Exam 2', weeksBeforeDeadline: 24, category: 'gre', isOptional: false, isGlobal: true },
  { task: 'Take GRE Practice Exam 1', weeksBeforeDeadline: 32, category: 'gre', isOptional: false, isGlobal: true },

  // Prerequisites (optional, per-program)
  { task: '(Optional) Prerequisite #1', weeksBeforeDeadline: 36, category: 'prerequisites', isOptional: true },
  { task: '(Optional) Prerequisite #2', weeksBeforeDeadline: 24, category: 'prerequisites', isOptional: true },

  // CCRN prep tasks (global - only need to be done once)
  { task: 'Schedule CCRN Exam', weeksBeforeDeadline: 20, category: 'ccrn-prep', isOptional: false, isGlobal: true },
  { task: 'Take CCRN Practice Exam 1', weeksBeforeDeadline: 28, category: 'ccrn-prep', isOptional: false, isGlobal: true },
  { task: 'Take CCRN Practice Exam 2', weeksBeforeDeadline: 22, category: 'ccrn-prep', isOptional: false, isGlobal: true },
  { task: 'CCRN Exam', weeksBeforeDeadline: 18, category: 'ccrn', isOptional: false, isGlobal: true, triggersChecklistSync: true },
];

/**
 * Dashboard Suggested Tasks for users without target programs.
 * Dynamic suggestions based on onboarding data and profile completion.
 *
 * showIf values determine when to show the task:
 * - noGre: Show if user has no GRE scores in profile
 * - noCcrn: Show if user doesn't have CCRN certification
 * - noShadow: Show if user has 0 shadow hours
 * - profileIncomplete: Show if profile step is incomplete
 * - noGpa: Show if GPAs are not entered
 * - noResume: Show if resume not started
 * - noPersonalStatement: Show if personal statement not started
 */
export const DASHBOARD_SUGGESTED_TASKS = [
  // GRE-related (show if greStatus !== 'completed' and no GRE scores in profile)
  { id: 'sug_gre_1', task: 'Schedule GRE', category: 'gre', showIf: 'noGre' },
  { id: 'sug_gre_2', task: 'Take GRE Practice Exam 1', category: 'gre', showIf: 'noGre' },
  { id: 'sug_gre_3', task: 'Take GRE Practice Exam 2', category: 'gre', showIf: 'noGre' },
  { id: 'sug_gre_4', task: 'Take GRE Exam', category: 'gre', showIf: 'noGre' },

  // CCRN-related (show if no CCRN in certifications)
  { id: 'sug_ccrn_1', task: 'Schedule CCRN Exam', category: 'ccrn-prep', showIf: 'noCcrn' },
  { id: 'sug_ccrn_2', task: 'Take CCRN Practice Exam 1', category: 'ccrn-prep', showIf: 'noCcrn' },
  { id: 'sug_ccrn_3', task: 'Take CCRN Practice Exam 2', category: 'ccrn-prep', showIf: 'noCcrn' },
  { id: 'sug_ccrn_4', task: 'Take CCRN Exam', category: 'ccrn', showIf: 'noCcrn' },

  // Shadowing (show if shadowHours === 0)
  { id: 'sug_shadow_1', task: 'Schedule Shadow Day', category: 'shadowing', showIf: 'noShadow' },

  // Profile completion (show based on onboarding steps)
  { id: 'sug_profile_1', task: 'Fill out My Stats page', category: 'profile', showIf: 'profileIncomplete', link: '/my-stats' },
  { id: 'sug_profile_2', task: 'Calculate your GPAs', category: 'profile', showIf: 'noGpa', link: '/my-stats' },

  // Application materials
  { id: 'sug_resume', task: 'Start your Resume', category: 'resume', showIf: 'noResume' },
  { id: 'sug_ps', task: 'Draft Personal Statement', category: 'personal-statement', showIf: 'noPersonalStatement' },
];

/**
 * Checklist to Task Category mapping.
 * Maps checklist item IDs to task categories for syncing completion status.
 *
 * When a checklist item is completed, related tasks can be synced.
 * When a task is completed, related checklist items can be synced.
 *
 * Checklist item IDs reference the DEFAULT_CHECKLIST_ITEMS in usePrograms.js:
 * - c5: Complete the GRE
 * - c6: Send GRE Scores
 * - c7: Complete CCRN
 */
export const CHECKLIST_TASK_MAPPING = {
  c5: 'gre',      // Complete the GRE
  c6: 'gre',      // Send GRE Scores
  c7: 'ccrn',     // Complete CCRN
};

/**
 * Task categories that are "global" (one-time exams that apply across all schools).
 * These tasks should only appear once on the dashboard, with the earliest deadline
 * from schools that require them.
 *
 * When a user has multiple target programs:
 * - GRE tasks show once, deadline = earliest GRE-requiring school
 * - CCRN tasks show once, deadline = earliest CCRN-requiring school
 * - If no schools require GRE/CCRN, those tasks still show but with "No deadline set"
 */
export const GLOBAL_TASK_CATEGORIES = ['gre', 'ccrn', 'ccrn-prep'];

/**
 * Tasks that trigger checklist sync when completed.
 * Maps task name → checklist item IDs to sync.
 *
 * When user marks "GRE Exam" complete, they're offered to mark
 * checklist items c5 and c6 complete across all target schools.
 */
export const TASK_CHECKLIST_SYNC_MAP = {
  'GRE Exam': ['c5', 'c6'],           // Completing GRE exam syncs both GRE checklist items
  'First certification (ie. CCRN, CMC)': ['c7'],  // Completing CCRN syncs the CCRN checklist item
  'CCRN Exam': ['c7'],                // Alternative name for CCRN
};

/**
 * Default Checklist Items (12 total)
 * Pre-populated when a program becomes a target.
 * Users can add up to 3 custom items (isDefault: false).
 *
 * excludesTaxonomy: When completed, resources with matching taxonomy are hidden.
 * This enables smart content filtering based on user progress.
 */
export const DEFAULT_CHECKLIST_ITEMS = [
  { id: 'c1', label: 'Verify all program requirements + due date', completed: false, isDefault: true, excludesTaxonomy: null },
  { id: 'c2', label: 'Check for Open House or program event', completed: false, isDefault: true, excludesTaxonomy: null },
  { id: 'c3', label: 'Request official Transcripts', completed: false, isDefault: true, excludesTaxonomy: null },
  { id: 'c4', label: 'Complete Prerequisites', completed: false, isDefault: true, excludesTaxonomy: null },
  { id: 'c5', label: 'Complete the GRE', completed: false, isDefault: true, excludesTaxonomy: 'GRE' },
  { id: 'c6', label: 'Send GRE Scores', completed: false, isDefault: true, excludesTaxonomy: 'GRE' },
  { id: 'c7', label: 'Complete CCRN', completed: false, isDefault: true, excludesTaxonomy: 'CERTIFICATIONS' },
  { id: 'c8', label: 'Complete Resume', completed: false, isDefault: true, excludesTaxonomy: 'RESUME' },
  { id: 'c9', label: 'Complete Personal Statement', completed: false, isDefault: true, excludesTaxonomy: 'PERSONAL STATEMENT' },
  { id: 'c10', label: 'Complete Letters of Recommendation', completed: false, isDefault: true, excludesTaxonomy: 'LETTERS OF RECOMMENDATION' },
  { id: 'c11', label: 'Complete Supplemental Forms', completed: false, isDefault: true, excludesTaxonomy: null },
  { id: 'c12', label: 'Submit Application', completed: false, isDefault: true, excludesTaxonomy: null },
];
