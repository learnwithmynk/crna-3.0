/**
 * Prerequisite Gap Engine
 *
 * Generates nudges for:
 * - PREREQ_GAP: Missing required prerequisites (not "in progress" or "planned")
 * - PREREQ_GRADE_LOW: Science course grades B- or below
 */

import { PREREQUISITE_PROMPTS } from '../promptDefinitions';
import { generateNudgeId, SCIENCE_COURSES, isLowGrade } from '../promptUtils';
import { calculatePriority } from '../prioritySystem';

/**
 * Prerequisite status values
 */
export const PREREQ_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  PLANNED: 'planned',
  COMPLETED: 'completed',
};

/**
 * Common prerequisites required by most programs
 */
export const COMMON_PREREQUISITES = [
  { id: 'anatomy', name: 'Anatomy', isScience: true },
  { id: 'physiology', name: 'Physiology', isScience: true },
  { id: 'anatomy_physiology', name: 'Anatomy & Physiology', isScience: true, coversIds: ['anatomy', 'physiology'] },
  { id: 'general_chemistry', name: 'General Chemistry', isScience: true },
  { id: 'organic_chemistry', name: 'Organic Chemistry', isScience: true, coversIds: ['general_chemistry'] },
  { id: 'biochemistry', name: 'Biochemistry', isScience: true, coversIds: ['organic_chemistry', 'general_chemistry'] },
  { id: 'statistics', name: 'Statistics', isScience: true },
  { id: 'physics', name: 'Physics', isScience: true },
  { id: 'pathophysiology', name: 'Pathophysiology', isScience: true },
  { id: 'pharmacology', name: 'Pharmacology', isScience: true },
  { id: 'biology', name: 'Biology', isScience: true },
  { id: 'microbiology', name: 'Microbiology', isScience: true },
];

/**
 * Evaluate prerequisite gap nudges
 */
export function evaluatePrerequisiteNudges({
  academicProfile = {},
  targetPrograms = [],
  dismissedPrompts = {},
  lastNudgeShown = {},
  userStage,
  trackerStats,
  lastLoginAt,
}) {
  const nudges = [];

  const { completedPrerequisites = [], inProgressPrerequisites = [], plannedPrerequisites = [] } = academicProfile;

  // Get required prereqs from target programs
  const requiredPrereqs = getRequiredPrerequisites(targetPrograms);

  // Check for gaps (missing prereqs not in progress or planned)
  const gapNudges = evaluatePrereqGaps(
    requiredPrereqs,
    completedPrerequisites,
    inProgressPrerequisites,
    plannedPrerequisites,
    dismissedPrompts,
    lastNudgeShown,
    userStage,
    trackerStats,
    lastLoginAt
  );
  nudges.push(...gapNudges);

  // Check for low science grades
  const gradeNudges = evaluateLowGrades(
    completedPrerequisites,
    dismissedPrompts,
    lastNudgeShown,
    userStage,
    trackerStats,
    lastLoginAt
  );
  nudges.push(...gradeNudges);

  return nudges.sort((a, b) => b.priority - a.priority);
}

/**
 * Get required prerequisites from target programs
 */
function getRequiredPrerequisites(targetPrograms) {
  const requiredSet = new Set();

  for (const program of targetPrograms) {
    if (program.prerequisites) {
      for (const prereq of program.prerequisites) {
        if (prereq.required) {
          requiredSet.add(prereq.courseType || prereq.id);
        }
      }
    }
  }

  // If no specific requirements, use common prereqs
  if (requiredSet.size === 0) {
    return COMMON_PREREQUISITES.filter(p =>
      ['anatomy', 'physiology', 'general_chemistry', 'statistics'].includes(p.id)
    ).map(p => p.id);
  }

  return Array.from(requiredSet);
}

/**
 * Evaluate prereq gaps
 */
function evaluatePrereqGaps(
  requiredPrereqs,
  completed,
  inProgress,
  planned,
  dismissedPrompts,
  lastNudgeShown,
  userStage,
  trackerStats,
  lastLoginAt
) {
  const nudges = [];

  // Build sets of covered prereqs
  const completedSet = new Set(completed.map(p => p.courseType || p.id));
  const inProgressSet = new Set(inProgress.map(p => p.courseType || p.id));
  const plannedSet = new Set(planned.map(p => p.courseType || p.id));

  // Also add covered courses (e.g., Organic Chem covers Gen Chem)
  for (const prereq of COMMON_PREREQUISITES) {
    if (prereq.coversIds && completedSet.has(prereq.id)) {
      prereq.coversIds.forEach(id => completedSet.add(id));
    }
  }

  for (const prereqId of requiredPrereqs) {
    // Skip if completed, in progress, or planned
    if (completedSet.has(prereqId)) continue;
    if (inProgressSet.has(prereqId)) continue;
    if (plannedSet.has(prereqId)) continue;

    const prereqInfo = COMMON_PREREQUISITES.find(p => p.id === prereqId);
    const prereqName = prereqInfo?.name || formatPrereqName(prereqId);

    const promptDef = PREREQUISITE_PROMPTS.PREREQ_GAP;
    const nudgeId = generateNudgeId(promptDef.id, { prereqId });

    nudges.push({
      id: nudgeId,
      promptId: promptDef.id,
      engine: 'prerequisite',
      type: promptDef.type,
      urgency: promptDef.urgency,
      title: interpolate(promptDef.titleTemplate, { prereqName }),
      message: interpolate(promptDef.messageTemplate, { status: 'not started' }),
      actions: promptDef.actions.map(action => ({
        ...action,
        context: { prereqId },
      })),
      dismissible: promptDef.dismissible,
      snoozeable: promptDef.snoozeable,
      context: {
        prereqId,
        prereqName,
        status: 'not_started',
      },
      priority: calculatePriority({
        urgency: promptDef.urgency,
        engine: 'prerequisite',
        userStage,
        trackerStats,
        lastLoginAt,
        lastShownAt: lastNudgeShown[nudgeId],
        dismissalCount: dismissedPrompts[nudgeId]?.count || 0,
      }),
    });
  }

  return nudges;
}

/**
 * Evaluate low grades on science courses
 */
function evaluateLowGrades(
  completedPrerequisites,
  dismissedPrompts,
  lastNudgeShown,
  userStage,
  trackerStats,
  lastLoginAt
) {
  const nudges = [];

  for (const prereq of completedPrerequisites) {
    const courseType = prereq.courseType || prereq.id;

    // Only check science courses
    if (!SCIENCE_COURSES.includes(courseType)) continue;

    // Check if grade is low
    if (!prereq.grade || !isLowGrade(prereq.grade)) continue;

    const prereqInfo = COMMON_PREREQUISITES.find(p => p.id === courseType);
    const courseName = prereqInfo?.name || formatPrereqName(courseType);

    const promptDef = PREREQUISITE_PROMPTS.PREREQ_GRADE_LOW;
    const nudgeId = generateNudgeId(promptDef.id, { prereqId: courseType });

    nudges.push({
      id: nudgeId,
      promptId: promptDef.id,
      engine: 'prerequisite',
      type: promptDef.type,
      urgency: promptDef.urgency,
      title: interpolate(promptDef.titleTemplate, {
        courseName,
        grade: prereq.grade,
      }),
      message: promptDef.messageTemplate,
      actions: promptDef.actions,
      dismissible: promptDef.dismissible,
      snoozeable: promptDef.snoozeable,
      context: {
        prereqId: courseType,
        courseName,
        grade: prereq.grade,
      },
      priority: calculatePriority({
        urgency: promptDef.urgency,
        engine: 'prerequisite',
        userStage,
        trackerStats,
        lastLoginAt,
        lastShownAt: lastNudgeShown[nudgeId],
        dismissalCount: dismissedPrompts[nudgeId]?.count || 0,
      }),
    });
  }

  return nudges;
}

/**
 * Format prerequisite ID to display name
 */
function formatPrereqName(prereqId) {
  return prereqId
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
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
 * Handle "Mark as Planned" action
 */
export function handleMarkPlanned(prereqId) {
  return {
    prereqId,
    newStatus: PREREQ_STATUS.PLANNED,
    plannedAt: new Date().toISOString(),
  };
}

export default {
  PREREQ_STATUS,
  COMMON_PREREQUISITES,
  evaluatePrerequisiteNudges,
  handleMarkPlanned,
};
