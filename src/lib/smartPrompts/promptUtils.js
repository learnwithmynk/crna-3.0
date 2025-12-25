/**
 * Smart Prompts - Utility Functions
 * Date helpers, formatters, and common utilities for the nudge engine
 */

/**
 * Calculate days between two dates
 */
export function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate days until a target date from today
 */
export function daysUntil(targetDate, today = new Date()) {
  return daysBetween(today, targetDate);
}

/**
 * Calculate days since a past date
 */
export function daysSince(pastDate, today = new Date()) {
  return daysBetween(pastDate, today);
}

/**
 * Check if a date is in the past
 */
export function isPast(date, today = new Date()) {
  return new Date(date) < today;
}

/**
 * Check if a date is today
 */
export function isToday(date, today = new Date()) {
  const d = new Date(date);
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

/**
 * Check if a date is tomorrow
 */
export function isTomorrow(date, today = new Date()) {
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return isToday(date, tomorrow);
}

/**
 * Format a date for display
 */
export function formatDate(date, options = {}) {
  const d = new Date(date);
  const defaultOptions = { month: 'short', day: 'numeric' };
  return d.toLocaleDateString('en-US', { ...defaultOptions, ...options });
}

/**
 * Format days remaining for display
 */
export function formatDaysRemaining(days) {
  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  if (days < 0) return `${Math.abs(days)} days ago`;
  if (days < 7) return `in ${days} days`;
  if (days < 14) return 'next week';
  if (days < 21) return 'in 2 weeks';
  if (days < 30) return 'in 3 weeks';
  return `in ${Math.round(days / 7)} weeks`;
}

/**
 * Generate a unique nudge ID
 */
export function generateNudgeId(promptId, context = {}) {
  const contextKey = context.programId || context.certType || context.recommenderName || '';
  return contextKey ? `${promptId}_${contextKey}` : promptId;
}

/**
 * Check if a prompt was dismissed within the cooldown period
 */
export function isWithinCooldown(dismissedAt, cooldownDays = 7) {
  if (!dismissedAt) return false;
  const daysSinceDismissal = daysSince(dismissedAt);
  return daysSinceDismissal < cooldownDays;
}

/**
 * Check if we're within the snooze period
 */
export function isSnoozed(snoozeUntil, today = new Date()) {
  if (!snoozeUntil) return false;
  return new Date(snoozeUntil) > today;
}

/**
 * Get the current user stage based on their profile and target programs
 */
export function inferUserStage(userData, targetPrograms) {
  // If any program has acceptance, they're accepted
  const hasAccepted = targetPrograms?.some(p => p.status === 'accepted');
  if (hasAccepted) return 'accepted';

  // If any program has interview scheduled, they're interviewing
  const hasInterview = targetPrograms?.some(
    p => p.status === 'interview_invite' || p.status === 'interview_scheduled'
  );
  if (hasInterview) return 'interviewing';

  // If any program is submitted, they're applying
  const hasSubmitted = targetPrograms?.some(p => p.status === 'submitted');
  if (hasSubmitted) return 'applying';

  // If they have target programs, they're preparing
  const hasTargets = targetPrograms?.length > 0;
  if (hasTargets) return 'preparing';

  // Default to exploring
  return 'exploring';
}

/**
 * Calculate streak status with grace period
 */
export function calculateStreakStatus(streak, lastLoginAt, today = new Date()) {
  if (!lastLoginAt) {
    return { currentStreak: 0, isAtRisk: false, streakBroken: false };
  }

  const daysSinceLogin = daysSince(lastLoginAt, today);

  // Same day - streak continues
  if (daysSinceLogin === 0) {
    return { currentStreak: streak, isAtRisk: false, streakBroken: false };
  }

  // Yesterday - streak at risk (grace period)
  if (daysSinceLogin === 1) {
    return { currentStreak: streak, isAtRisk: true, streakBroken: false };
  }

  // 2+ days - streak broken
  return { currentStreak: 0, isAtRisk: false, streakBroken: streak > 0 };
}

/**
 * Science courses that should be checked for low grades
 */
export const SCIENCE_COURSES = [
  'anatomy',
  'physiology',
  'anatomy_physiology',
  'pathophysiology',
  'pharmacology',
  'general_chemistry',
  'organic_chemistry',
  'biochemistry',
  'physics',
  'statistics',
  'biology',
  'microbiology',
];

/**
 * Check if a grade is considered low (B- or below)
 */
export function isLowGrade(grade) {
  const lowGrades = ['B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
  return lowGrades.includes(grade);
}

/**
 * Format program name for display in nudges
 */
export function formatProgramName(program) {
  if (!program) return 'your program';
  return program.schoolName || program.name || 'your program';
}

export default {
  daysBetween,
  daysUntil,
  daysSince,
  isPast,
  isToday,
  isTomorrow,
  formatDate,
  formatDaysRemaining,
  generateNudgeId,
  isWithinCooldown,
  isSnoozed,
  inferUserStage,
  calculateStreakStatus,
  SCIENCE_COURSES,
  isLowGrade,
  formatProgramName,
};
