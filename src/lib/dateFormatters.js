/**
 * Centralized Date Formatting Utilities
 *
 * This module consolidates date formatting functions that were previously
 * duplicated across multiple components. Uses the Strangler Fig pattern -
 * components can gradually migrate to these functions.
 *
 * Migration guide:
 * - AcademicDetailsSection: formatDate → formatDateMonthYear
 * - ToDoListWidget: formatDate → formatDateShort
 * - ProgramLORTab: formatDate → formatDateFull
 * - ProgramDetailHeader: getDeadlineInfo → getDeadlineDisplay
 * - MyProgramsPage/TargetProgramCard: getDeadlineInfo → getDeadlineStatus
 */

// =============================================================================
// CONSTANTS
// =============================================================================

/** Milliseconds in one day - avoids magic number 1000 * 60 * 60 * 24 */
export const MS_PER_DAY = 86400000;

// =============================================================================
// SIMPLE DATE FORMATTERS
// =============================================================================

/**
 * Format date as "MMM yyyy" (e.g., "Jun 2024")
 * Used in: AcademicDetailsSection for graduation dates, course completion dates
 *
 * @param {string|Date|null} dateInput - Date string or Date object
 * @param {string} fallback - Value to return if date is invalid (default: null)
 * @returns {string|null}
 */
export function formatDateMonthYear(dateInput, fallback = null) {
  if (!dateInput) return fallback;
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format date as "MMM d" (e.g., "Jun 15")
 * Used in: ToDoListWidget for task due dates
 *
 * @param {string|Date|null} dateInput - Date string or Date object
 * @param {string} fallback - Value to return if date is invalid (default: '—')
 * @returns {string}
 */
export function formatDateShort(dateInput, fallback = '—') {
  if (!dateInput) return fallback;
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date as "MMM d, yyyy" (e.g., "Jun 15, 2024")
 * Used in: ProgramLORTab, ProgramDocumentsTab, ProgramTasksTab
 *
 * @param {string|Date|null} dateInput - Date string or Date object
 * @param {string} fallback - Value to return if date is invalid (default: '—')
 * @returns {string}
 */
export function formatDateFull(dateInput, fallback = '—') {
  if (!dateInput) return fallback;
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format date as "MMMM d, yyyy" (e.g., "June 15, 2024") - full month name
 * Used in: ProgramDetailHeader for deadline display
 *
 * @param {string|Date|null} dateInput - Date string or Date object
 * @param {string} fallback - Value to return if date is invalid (default: '—')
 * @returns {string}
 */
export function formatDateLong(dateInput, fallback = '—') {
  if (!dateInput) return fallback;
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// =============================================================================
// DEADLINE UTILITIES
// =============================================================================

/**
 * Calculate days until a deadline from now
 *
 * @param {string|Date} deadlineInput - Deadline date
 * @returns {number|null} Days until deadline (negative if past), null if invalid
 */
export function getDaysUntil(deadlineInput) {
  if (!deadlineInput) return null;
  const deadline = typeof deadlineInput === 'string' ? new Date(deadlineInput) : deadlineInput;
  if (isNaN(deadline.getTime())) return null;
  const now = new Date();
  const diffTime = deadline - now;
  return Math.ceil(diffTime / MS_PER_DAY);
}

/**
 * Get deadline status with display text and urgency flags
 * Used in: MyProgramsPage, TargetProgramCard
 *
 * Returns an object with:
 * - text: Human-readable deadline text
 * - daysLeft: Number of days (negative if past)
 * - isUrgent: true if <= 7 days or past
 * - isPast: true if deadline has passed
 *
 * @param {string|Date|null} deadlineInput - Deadline date
 * @returns {{ text: string, daysLeft: number|null, isUrgent: boolean, isPast: boolean }}
 */
export function getDeadlineStatus(deadlineInput) {
  if (!deadlineInput) {
    return { text: 'No deadline', daysLeft: null, isUrgent: false, isPast: false };
  }

  const deadline = typeof deadlineInput === 'string' ? new Date(deadlineInput) : deadlineInput;
  if (isNaN(deadline.getTime())) {
    return { text: 'No deadline', daysLeft: null, isUrgent: false, isPast: false };
  }

  const now = new Date();
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / MS_PER_DAY);

  if (diffDays < 0) {
    return { text: 'Deadline passed', daysLeft: diffDays, isUrgent: true, isPast: true };
  } else if (diffDays === 0) {
    return { text: 'Due today', daysLeft: 0, isUrgent: true, isPast: false };
  } else if (diffDays <= 7) {
    return { text: `${diffDays}d left`, daysLeft: diffDays, isUrgent: true, isPast: false };
  } else if (diffDays <= 30) {
    return { text: `${diffDays}d left`, daysLeft: diffDays, isUrgent: false, isPast: false };
  } else {
    const text = deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { text, daysLeft: diffDays, isUrgent: false, isPast: false };
  }
}

/**
 * Get deadline display info with CSS classes for styling
 * Used in: ProgramDetailHeader
 *
 * Returns an object with:
 * - date: Formatted date string (full month name)
 * - daysUntil: Number of days until deadline
 * - urgency: 'passed' | 'critical' | 'soon' | 'normal'
 * - urgencyClass: Tailwind CSS classes for styling
 *
 * @param {string|Date|null} deadlineInput - Deadline date
 * @returns {{ date: string, daysUntil: number, urgency: string, urgencyClass: string } | null}
 */
export function getDeadlineDisplay(deadlineInput) {
  if (!deadlineInput) return null;

  const deadline = typeof deadlineInput === 'string' ? new Date(deadlineInput) : deadlineInput;
  if (isNaN(deadline.getTime())) return null;

  const now = new Date();
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / MS_PER_DAY);

  let urgency = 'normal';
  let urgencyClass = 'text-gray-600';

  if (diffDays < 0) {
    urgency = 'passed';
    urgencyClass = 'text-gray-400';
  } else if (diffDays <= 7) {
    urgency = 'critical';
    urgencyClass = 'text-red-600 font-semibold';
  } else if (diffDays <= 30) {
    urgency = 'soon';
    urgencyClass = 'text-orange-600';
  }

  const formattedDate = deadline.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return {
    date: formattedDate,
    daysUntil: diffDays,
    urgency,
    urgencyClass,
  };
}

// =============================================================================
// RELATIVE TIME FORMATTERS
// =============================================================================

/**
 * Format date with time as relative (e.g., "In 2 hours", "Tomorrow at 3pm", "Dec 15 at 10am")
 * Used in: UpcomingSessionsWidget for session scheduling
 *
 * Returns:
 * - "In X minutes" if < 60 minutes away
 * - "In X hours" if < 24 hours away
 * - "Tomorrow at H:MMam/pm" if tomorrow
 * - "MMM d at H:MMam/pm" if within a week
 * - "MMM d, yyyy at H:MMam/pm" if further out
 *
 * @param {string|Date|null} dateInput - Date string or Date object
 * @param {string} fallback - Value to return if date is invalid (default: '—')
 * @returns {string}
 */
export function formatRelativeDateTime(dateInput, fallback = '—') {
  if (!dateInput) return fallback;
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return fallback;

  const now = new Date();
  const diffMs = date - now;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / MS_PER_DAY);

  // Format time as "3:45pm"
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // Past dates
  if (diffMs < 0) {
    return 'Past session';
  }

  // Less than 60 minutes
  if (diffMinutes < 60) {
    if (diffMinutes <= 0) return 'Starting now';
    if (diffMinutes === 1) return 'In 1 minute';
    return `In ${diffMinutes} minutes`;
  }

  // Less than 24 hours
  if (diffHours < 24) {
    if (diffHours === 1) return `In 1 hour`;
    return `In ${diffHours} hours`;
  }

  // Tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow at ${timeStr}`;
  }

  // Within a week
  if (diffDays < 7) {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    return `${dayName} at ${timeStr}`;
  }

  // Same year
  if (date.getFullYear() === now.getFullYear()) {
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    return `${dateStr} at ${timeStr}`;
  }

  // Different year
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `${dateStr} at ${timeStr}`;
}

// =============================================================================
// BACKWARD COMPATIBILITY ALIASES
// These maintain the old function names during migration. Remove after migration.
// =============================================================================

/**
 * @deprecated Use formatDateFull instead
 */
export const formatDate = formatDateFull;

/**
 * @deprecated Use getDeadlineStatus instead
 */
export const getDeadlineInfo = getDeadlineStatus;
