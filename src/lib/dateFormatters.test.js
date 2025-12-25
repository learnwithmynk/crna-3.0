/**
 * Characterization Tests for Date Formatting Functions
 *
 * These tests document the CURRENT behavior of date formatting functions
 * found across multiple components. They serve as a safety net before refactoring.
 *
 * Variants found:
 * 1. AcademicDetailsSection.jsx - formatDate: "MMM yyyy" format, returns null for empty
 * 2. ToDoListWidget.jsx - formatDate: "MMM d" format, returns '—' for empty
 * 3. ProgramLORTab.jsx - formatDate: "MMM d, yyyy" format, returns '—' for empty
 * 4. ProgramDetailHeader.jsx - getDeadlineInfo: returns urgency + CSS classes
 * 5. MyProgramsPage.jsx - getDeadlineInfo: returns isUrgent/isPast booleans
 * 6. TargetProgramCard.jsx - getDeadlineInfo: same as MyProgramsPage + "1 day left" singular
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// ============================================================================
// STEP 1: Extract current implementations as-is for characterization
// ============================================================================

// From AcademicDetailsSection.jsx (month + year only)
function formatDateAcademic(dateString) {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

// From ToDoListWidget.jsx (month + day, no year)
function formatDateTodo(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// From ProgramLORTab.jsx (full date: month day, year)
function formatDateFull(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// From MyProgramsPage.jsx / TargetProgramCard.jsx (returns object with text + flags)
function getDeadlineInfoPrograms(deadlineStr) {
  if (!deadlineStr)
    return { text: 'No deadline', daysLeft: null, isUrgent: false, isPast: false };

  const deadline = new Date(deadlineStr);
  const now = new Date();
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: 'Deadline passed', daysLeft: diffDays, isUrgent: true, isPast: true };
  } else if (diffDays === 0) {
    return { text: 'Due today', daysLeft: 0, isUrgent: true, isPast: false };
  } else if (diffDays <= 7) {
    return { text: `${diffDays}d left`, daysLeft: diffDays, isUrgent: true, isPast: false };
  } else if (diffDays <= 30) {
    return { text: `${diffDays}d left`, daysLeft: diffDays, isUrgent: false, isPast: false };
  } else {
    const date = deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { text: date, daysLeft: diffDays, isUrgent: false, isPast: false };
  }
}

// From ProgramDetailHeader.jsx (returns object with CSS classes)
function getDeadlineInfoHeader(deadlineStr) {
  if (!deadlineStr) return null;

  const deadline = new Date(deadlineStr);
  const now = new Date();
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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

// ============================================================================
// CHARACTERIZATION TESTS - Document current behavior
// ============================================================================

describe('formatDateAcademic (AcademicDetailsSection)', () => {
  it('returns null for null/undefined/empty', () => {
    expect(formatDateAcademic(null)).toBe(null);
    expect(formatDateAcademic(undefined)).toBe(null);
    expect(formatDateAcademic('')).toBe(null);
  });

  it('formats as "MMM yyyy" (no day)', () => {
    // Note: Date parsing can vary by timezone, use ISO format
    const result = formatDateAcademic('2024-06-15');
    expect(result).toMatch(/Jun\s+2024/);
  });

  it('handles ISO date strings', () => {
    const result = formatDateAcademic('2024-01-01T00:00:00.000Z');
    // Could be Dec 2023 or Jan 2024 depending on timezone
    expect(result).toMatch(/(Dec\s+2023|Jan\s+2024)/);
  });
});

describe('formatDateTodo (ToDoListWidget)', () => {
  it('returns "—" for null/undefined/empty', () => {
    expect(formatDateTodo(null)).toBe('—');
    expect(formatDateTodo(undefined)).toBe('—');
    expect(formatDateTodo('')).toBe('—');
  });

  it('formats as "MMM d" (no year)', () => {
    // Use a date with explicit time to avoid timezone issues
    const result = formatDateTodo('2024-06-15T12:00:00');
    expect(result).toMatch(/Jun\s+15/);
  });
});

describe('formatDateFull (ProgramLORTab)', () => {
  it('returns "—" for null/undefined/empty', () => {
    expect(formatDateFull(null)).toBe('—');
    expect(formatDateFull(undefined)).toBe('—');
    expect(formatDateFull('')).toBe('—');
  });

  it('formats as "MMM d, yyyy"', () => {
    // Use a date with explicit time to avoid timezone issues
    const result = formatDateFull('2024-06-15T12:00:00');
    expect(result).toMatch(/Jun\s+15,?\s+2024/);
  });
});

// ============================================================================
// DEADLINE INFO TESTS - Must mock Date for predictable results
// ============================================================================

describe('getDeadlineInfoPrograms (MyProgramsPage/TargetProgramCard)', () => {
  beforeEach(() => {
    // Mock "now" to 2024-06-15 at noon UTC
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns default for null/undefined', () => {
    expect(getDeadlineInfoPrograms(null)).toEqual({
      text: 'No deadline',
      daysLeft: null,
      isUrgent: false,
      isPast: false,
    });
    expect(getDeadlineInfoPrograms(undefined)).toEqual({
      text: 'No deadline',
      daysLeft: null,
      isUrgent: false,
      isPast: false,
    });
  });

  it('marks past deadlines as passed', () => {
    const result = getDeadlineInfoPrograms('2024-06-10'); // 5 days ago
    expect(result.text).toBe('Deadline passed');
    expect(result.isPast).toBe(true);
    expect(result.isUrgent).toBe(true);
    expect(result.daysLeft).toBeLessThan(0);
  });

  it('marks today as "Due today"', () => {
    const result = getDeadlineInfoPrograms('2024-06-15');
    expect(result.text).toBe('Due today');
    expect(result.daysLeft).toBe(0);
    expect(result.isUrgent).toBe(true);
    expect(result.isPast).toBe(false);
  });

  it('marks 1-7 days as urgent with "Xd left"', () => {
    const result = getDeadlineInfoPrograms('2024-06-18'); // 3 days
    expect(result.text).toBe('3d left');
    expect(result.daysLeft).toBe(3);
    expect(result.isUrgent).toBe(true);
    expect(result.isPast).toBe(false);
  });

  it('marks 8-30 days as not urgent with "Xd left"', () => {
    const result = getDeadlineInfoPrograms('2024-06-30'); // 15 days
    expect(result.text).toBe('15d left');
    expect(result.daysLeft).toBe(15);
    expect(result.isUrgent).toBe(false);
    expect(result.isPast).toBe(false);
  });

  it('shows formatted date for >30 days', () => {
    // Use explicit time to avoid timezone issues
    const result = getDeadlineInfoPrograms('2024-08-15T12:00:00');
    expect(result.text).toMatch(/Aug\s+15/);
    expect(result.isUrgent).toBe(false);
    expect(result.isPast).toBe(false);
  });
});

describe('getDeadlineInfoHeader (ProgramDetailHeader)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null for null/undefined', () => {
    expect(getDeadlineInfoHeader(null)).toBe(null);
    expect(getDeadlineInfoHeader(undefined)).toBe(null);
  });

  it('returns "passed" urgency for past dates', () => {
    const result = getDeadlineInfoHeader('2024-06-10');
    expect(result.urgency).toBe('passed');
    expect(result.urgencyClass).toBe('text-gray-400');
  });

  it('returns "critical" urgency for 1-7 days', () => {
    const result = getDeadlineInfoHeader('2024-06-18');
    expect(result.urgency).toBe('critical');
    expect(result.urgencyClass).toBe('text-red-600 font-semibold');
  });

  it('returns "soon" urgency for 8-30 days', () => {
    const result = getDeadlineInfoHeader('2024-06-30');
    expect(result.urgency).toBe('soon');
    expect(result.urgencyClass).toBe('text-orange-600');
  });

  it('returns "normal" urgency for >30 days', () => {
    const result = getDeadlineInfoHeader('2024-08-15');
    expect(result.urgency).toBe('normal');
    expect(result.urgencyClass).toBe('text-gray-600');
  });

  it('formats date as "MMMM d, yyyy" (full month name)', () => {
    // Use explicit time to avoid timezone issues
    const result = getDeadlineInfoHeader('2024-08-15T12:00:00');
    expect(result.date).toMatch(/August\s+15,?\s+2024/);
  });
});

// ============================================================================
// Edge cases
// ============================================================================

describe('Edge cases', () => {
  it('handles invalid date strings gracefully', () => {
    // Invalid dates return "Invalid Date" string in toLocaleDateString
    const result = formatDateFull('not-a-date');
    expect(result).toBe('Invalid Date');
  });

  it('handles dates at year boundaries', () => {
    const result = formatDateAcademic('2024-12-31');
    expect(result).toMatch(/Dec\s+2024/);
  });
});

// ============================================================================
// STEP 2: Verify new unified implementation matches original behavior
// ============================================================================

import {
  formatDateMonthYear,
  formatDateShort,
  formatDateFull as newFormatDateFull,
  formatDateLong,
  getDeadlineStatus,
  getDeadlineDisplay,
  getDaysUntil,
  MS_PER_DAY,
} from './dateFormatters';

describe('NEW: formatDateMonthYear (replaces AcademicDetailsSection formatDate)', () => {
  it('matches original for null/undefined/empty', () => {
    expect(formatDateMonthYear(null)).toBe(formatDateAcademic(null));
    expect(formatDateMonthYear(undefined)).toBe(formatDateAcademic(undefined));
    expect(formatDateMonthYear('')).toBe(formatDateAcademic(''));
  });

  it('matches original format "MMM yyyy"', () => {
    const input = '2024-06-15T12:00:00';
    expect(formatDateMonthYear(input)).toBe(formatDateAcademic(input));
  });

  it('accepts Date objects', () => {
    const date = new Date('2024-06-15T12:00:00');
    expect(formatDateMonthYear(date)).toMatch(/Jun\s+2024/);
  });

  it('returns custom fallback for invalid dates', () => {
    expect(formatDateMonthYear(null, 'N/A')).toBe('N/A');
    expect(formatDateMonthYear('invalid', 'N/A')).toBe('N/A');
  });
});

describe('NEW: formatDateShort (replaces ToDoListWidget formatDate)', () => {
  it('matches original for null/undefined/empty', () => {
    expect(formatDateShort(null)).toBe(formatDateTodo(null));
    expect(formatDateShort(undefined)).toBe(formatDateTodo(undefined));
    expect(formatDateShort('')).toBe(formatDateTodo(''));
  });

  it('matches original format "MMM d"', () => {
    const input = '2024-06-15T12:00:00';
    expect(formatDateShort(input)).toBe(formatDateTodo(input));
  });

  it('accepts Date objects', () => {
    const date = new Date('2024-06-15T12:00:00');
    expect(formatDateShort(date)).toMatch(/Jun\s+15/);
  });
});

describe('NEW: formatDateFull (replaces ProgramLORTab formatDate)', () => {
  it('matches original for null/undefined/empty', () => {
    expect(newFormatDateFull(null)).toBe(formatDateFull(null));
    expect(newFormatDateFull(undefined)).toBe(formatDateFull(undefined));
    expect(newFormatDateFull('')).toBe(formatDateFull(''));
  });

  it('matches original format "MMM d, yyyy"', () => {
    const input = '2024-06-15T12:00:00';
    expect(newFormatDateFull(input)).toBe(formatDateFull(input));
  });

  it('returns fallback for invalid dates instead of "Invalid Date"', () => {
    // New implementation handles invalid dates better
    expect(newFormatDateFull('not-a-date')).toBe('—');
    expect(newFormatDateFull('not-a-date', 'Invalid')).toBe('Invalid');
  });
});

describe('NEW: formatDateLong', () => {
  it('formats as "MMMM d, yyyy" (full month name)', () => {
    const result = formatDateLong('2024-06-15T12:00:00');
    expect(result).toMatch(/June\s+15,?\s+2024/);
  });

  it('returns fallback for invalid inputs', () => {
    expect(formatDateLong(null)).toBe('—');
    expect(formatDateLong('')).toBe('—');
  });
});

describe('NEW: getDeadlineStatus (replaces MyProgramsPage getDeadlineInfo)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('matches original for null/undefined', () => {
    expect(getDeadlineStatus(null)).toEqual(getDeadlineInfoPrograms(null));
    expect(getDeadlineStatus(undefined)).toEqual(getDeadlineInfoPrograms(undefined));
  });

  it('matches original for past deadlines', () => {
    const input = '2024-06-10';
    expect(getDeadlineStatus(input)).toEqual(getDeadlineInfoPrograms(input));
  });

  it('matches original for today', () => {
    const input = '2024-06-15';
    expect(getDeadlineStatus(input)).toEqual(getDeadlineInfoPrograms(input));
  });

  it('matches original for 1-7 days', () => {
    const input = '2024-06-18';
    expect(getDeadlineStatus(input)).toEqual(getDeadlineInfoPrograms(input));
  });

  it('matches original for 8-30 days', () => {
    const input = '2024-06-30';
    expect(getDeadlineStatus(input)).toEqual(getDeadlineInfoPrograms(input));
  });

  it('matches original for >30 days', () => {
    const input = '2024-08-15T12:00:00';
    expect(getDeadlineStatus(input)).toEqual(getDeadlineInfoPrograms(input));
  });

  it('accepts Date objects', () => {
    // Use UTC date that's clearly 3 days ahead
    const date = new Date('2024-06-18T12:00:00.000Z');
    const result = getDeadlineStatus(date);
    expect(result.daysLeft).toBe(3);
    expect(result.isUrgent).toBe(true);
  });
});

describe('NEW: getDeadlineDisplay (replaces ProgramDetailHeader getDeadlineInfo)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('matches original for null/undefined', () => {
    expect(getDeadlineDisplay(null)).toBe(getDeadlineInfoHeader(null));
    expect(getDeadlineDisplay(undefined)).toBe(getDeadlineInfoHeader(undefined));
  });

  it('matches original for past deadlines', () => {
    const input = '2024-06-10';
    expect(getDeadlineDisplay(input)).toEqual(getDeadlineInfoHeader(input));
  });

  it('matches original for critical (1-7 days)', () => {
    const input = '2024-06-18';
    expect(getDeadlineDisplay(input)).toEqual(getDeadlineInfoHeader(input));
  });

  it('matches original for soon (8-30 days)', () => {
    const input = '2024-06-30';
    expect(getDeadlineDisplay(input)).toEqual(getDeadlineInfoHeader(input));
  });

  it('matches original for normal (>30 days)', () => {
    const input = '2024-08-15T12:00:00';
    expect(getDeadlineDisplay(input)).toEqual(getDeadlineInfoHeader(input));
  });
});

describe('NEW: getDaysUntil utility', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null for invalid inputs', () => {
    expect(getDaysUntil(null)).toBe(null);
    expect(getDaysUntil(undefined)).toBe(null);
    expect(getDaysUntil('')).toBe(null);
    expect(getDaysUntil('invalid')).toBe(null);
  });

  it('calculates days correctly', () => {
    // Same day should be 0 or close to 0
    expect(Math.abs(getDaysUntil('2024-06-15T12:00:00.000Z'))).toBeLessThanOrEqual(1);
    expect(getDaysUntil('2024-06-18T12:00:00.000Z')).toBe(3);
    expect(getDaysUntil('2024-06-10T12:00:00.000Z')).toBeLessThan(0);
  });
});

describe('NEW: MS_PER_DAY constant', () => {
  it('equals 24 hours in milliseconds', () => {
    expect(MS_PER_DAY).toBe(1000 * 60 * 60 * 24);
    expect(MS_PER_DAY).toBe(86400000);
  });
});

// ============================================================================
// RELATIVE TIME FORMATTERS
// ============================================================================

import { formatRelativeDateTime } from './dateFormatters';

describe('NEW: formatRelativeDateTime (for UpcomingSessionsWidget)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock "now" to June 15, 2024 at 2:00 PM
    vi.setSystemTime(new Date('2024-06-15T14:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns fallback for invalid inputs', () => {
    expect(formatRelativeDateTime(null)).toBe('—');
    expect(formatRelativeDateTime(undefined)).toBe('—');
    expect(formatRelativeDateTime('')).toBe('—');
    expect(formatRelativeDateTime('invalid', 'N/A')).toBe('N/A');
  });

  it('returns "Past session" for past dates', () => {
    const pastDate = new Date('2024-06-15T13:00:00.000Z'); // 1 hour ago
    expect(formatRelativeDateTime(pastDate)).toBe('Past session');
  });

  it('returns "Starting now" for imminent sessions (<=0 minutes)', () => {
    const now = new Date('2024-06-15T14:00:00.000Z'); // Exactly now
    expect(formatRelativeDateTime(now)).toBe('Starting now');
  });

  it('formats as "In 1 minute" for singular minute', () => {
    const oneMinute = new Date('2024-06-15T14:01:00.000Z');
    expect(formatRelativeDateTime(oneMinute)).toBe('In 1 minute');
  });

  it('formats as "In X minutes" for 2-59 minutes', () => {
    const fiveMinutes = new Date('2024-06-15T14:05:00.000Z');
    expect(formatRelativeDateTime(fiveMinutes)).toBe('In 5 minutes');

    const thirtyMinutes = new Date('2024-06-15T14:30:00.000Z');
    expect(formatRelativeDateTime(thirtyMinutes)).toBe('In 30 minutes');
  });

  it('formats as "In 1 hour" for singular hour', () => {
    const oneHour = new Date('2024-06-15T15:00:00.000Z');
    expect(formatRelativeDateTime(oneHour)).toBe('In 1 hour');
  });

  it('formats as "In X hours" for 2-23 hours', () => {
    const twoHours = new Date('2024-06-15T16:00:00.000Z');
    expect(formatRelativeDateTime(twoHours)).toBe('In 2 hours');

    const eightHours = new Date('2024-06-15T22:00:00.000Z');
    expect(formatRelativeDateTime(eightHours)).toBe('In 8 hours');
  });

  it('formats as "Tomorrow at H:MMam/pm" for next day', () => {
    const tomorrow = new Date('2024-06-16T10:30:00.000Z');
    const result = formatRelativeDateTime(tomorrow);
    expect(result).toMatch(/^Tomorrow at \d{1,2}:\d{2}[ap]m$/i);
  });

  it('formats as "DayName at H:MMam/pm" for within a week', () => {
    const monday = new Date('2024-06-17T09:00:00.000Z'); // 2 days from Saturday
    const result = formatRelativeDateTime(monday);
    expect(result).toMatch(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday) at \d{1,2}:\d{2}[ap]m$/i);
  });

  it('formats as "MMM d at H:MMam/pm" for same year but >7 days', () => {
    const nextMonth = new Date('2024-07-20T15:45:00.000Z');
    const result = formatRelativeDateTime(nextMonth);
    expect(result).toMatch(/^Jul \d{1,2} at \d{1,2}:\d{2}[ap]m$/i);
  });

  it('formats as "MMM d, yyyy at H:MMam/pm" for different year', () => {
    const nextYear = new Date('2025-01-10T11:00:00.000Z');
    const result = formatRelativeDateTime(nextYear);
    expect(result).toMatch(/^Jan \d{1,2}, 2025 at \d{1,2}:\d{2}[ap]m$/i);
  });

  it('accepts Date objects', () => {
    const date = new Date('2024-06-15T16:30:00.000Z'); // 2.5 hours from now
    expect(formatRelativeDateTime(date)).toBe('In 2 hours');
  });

  it('accepts string dates', () => {
    const dateStr = '2024-06-15T15:15:00.000Z'; // 1.25 hours from now
    expect(formatRelativeDateTime(dateStr)).toBe('In 1 hour');
  });
});
