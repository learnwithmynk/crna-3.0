/**
 * Event Helper Functions
 *
 * Utilities for:
 * - Filtering upcoming/past events
 * - Calculating program engagement/touchpoints
 * - Generating AI talking points (mock)
 * - Date formatting and countdown
 *
 * NOTE: These functions accept programs as parameters to work with dynamic data
 * from the usePrograms hook. Components should pass targetPrograms and savedPrograms
 * from the hook when calling these functions.
 */

import { mockSavedEvents, getPreEventTips } from '@/data/mockSavedEvents';
import { mockTrackedEvents, getEventsForProgram, getContactsFromEvents } from '@/data/mockTrackedEvents';

/**
 * Get upcoming events (future dates) from saved events
 * Includes events from saved/target programs
 * @param {Object} options - Options object
 * @param {number} [options.limit=3] - Max events to return
 * @param {Object[]} [options.targetPrograms=[]] - Target programs from usePrograms hook
 * @returns {Object[]} Upcoming events sorted by date
 */
export function getUpcomingEvents({ limit = 3, targetPrograms = [] } = {}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = mockSavedEvents
    .filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= today && !event.logged;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, limit);

  // Enhance with pre-event tips
  return upcoming.map((event) => ({
    ...event,
    preEventTips: getPreEventTips(event),
    countdown: getCountdownText(event.date),
    isFromTarget: isFromTargetProgram(event.schoolId, targetPrograms),
  }));
}

/**
 * Get events ready to log (past saved events not yet logged)
 * @returns {Object[]} Past events that haven't been logged
 */
export function getReadyToLogEvents() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return mockSavedEvents
    .filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate < today && !event.logged;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first
}

/**
 * Check if an event is from a target program
 * @param {string} schoolId - School ID to check
 * @param {Object[]} [targetPrograms=[]] - Target programs from usePrograms hook
 * @returns {boolean}
 */
export function isFromTargetProgram(schoolId, targetPrograms = []) {
  if (!schoolId) return false;
  return targetPrograms.some((p) => p.programId === schoolId);
}

/**
 * Check if an event is from a saved program
 * @param {string} schoolId - School ID to check
 * @param {Object[]} [savedPrograms=[]] - Saved programs from usePrograms hook
 * @returns {boolean}
 */
export function isFromSavedProgram(schoolId, savedPrograms = []) {
  if (!schoolId) return false;
  return savedPrograms.some((p) => p.programId === schoolId);
}

/**
 * Get countdown text for an event date
 * @param {string} dateString - ISO date string
 * @returns {string} Human-readable countdown
 */
export function getCountdownText(dateString) {
  const eventDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);

  const diffTime = eventDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return `In ${diffDays} days`;
  if (diffDays < 14) return 'Next week';
  if (diffDays < 30) return `In ${Math.floor(diffDays / 7)} weeks`;
  if (diffDays < 60) return 'Next month';
  return `In ${Math.floor(diffDays / 30)} months`;
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date (e.g., "Nov 15, 2024")
 */
export function formatEventDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ============================================
// PROGRAM ENGAGEMENT / TOUCHPOINTS
// ============================================

/**
 * Touchpoint types and their weights
 */
export const TOUCHPOINT_TYPES = {
  event_attended: { label: 'Event Attended', weight: 2 },
  contact_made: { label: 'Contact Made', weight: 1 },
  event_scheduled: { label: 'Event Scheduled', weight: 1 },
  info_reviewed: { label: 'Info Reviewed', weight: 0.5 },
};

/**
 * Engagement level thresholds
 */
export const ENGAGEMENT_LEVELS = {
  not_started: { min: 0, max: 0, label: 'Not Started', color: 'gray' },
  getting_started: { min: 1, max: 2, label: 'Getting Started', color: 'yellow' },
  building: { min: 3, max: 4, label: 'Building', color: 'blue' },
  strong: { min: 5, max: Infinity, label: 'Strong', color: 'green' },
};

/**
 * Get engagement level based on touchpoint count
 * @param {number} touchpoints - Number of touchpoints
 * @returns {Object} Engagement level object
 */
export function getEngagementLevel(touchpoints) {
  for (const [key, level] of Object.entries(ENGAGEMENT_LEVELS)) {
    if (touchpoints >= level.min && touchpoints <= level.max) {
      return { key, ...level };
    }
  }
  return { key: 'not_started', ...ENGAGEMENT_LEVELS.not_started };
}

/**
 * Calculate engagement/touchpoints for a specific program
 * @param {string} schoolId - The program's school ID
 * @param {Object[]} trackedEvents - Array of tracked events
 * @param {Object[]} savedEvents - Array of saved events
 * @returns {Object} Engagement data for the program
 */
export function calculateProgramEngagement(
  schoolId,
  trackedEvents = mockTrackedEvents,
  savedEvents = mockSavedEvents
) {
  const touchpoints = [];

  // Events attended for this program
  const attendedEvents = trackedEvents.filter((e) => e.schoolId === schoolId);
  attendedEvents.forEach((event) => {
    touchpoints.push({
      type: 'event_attended',
      label: `Attended ${event.title}`,
      date: event.date,
      weight: TOUCHPOINT_TYPES.event_attended.weight,
    });

    // Contacts made at this event
    (event.contacts || []).forEach((contact) => {
      if (contact.school && contact.school.includes(getSchoolNameById(schoolId))) {
        touchpoints.push({
          type: 'contact_made',
          label: `Spoke with ${contact.name} (${contact.role})`,
          date: event.date,
          weight: TOUCHPOINT_TYPES.contact_made.weight,
        });
      }
    });
  });

  // Upcoming events scheduled for this program
  const today = new Date();
  const scheduledEvents = savedEvents.filter(
    (e) => e.schoolId === schoolId && new Date(e.date) >= today && !e.logged
  );
  scheduledEvents.forEach((event) => {
    touchpoints.push({
      type: 'event_scheduled',
      label: `${event.title} scheduled`,
      date: event.date,
      weight: TOUCHPOINT_TYPES.event_scheduled.weight,
    });
  });

  // Calculate total weighted score
  const totalScore = touchpoints.reduce((sum, tp) => sum + tp.weight, 0);
  const level = getEngagementLevel(touchpoints.length);

  return {
    schoolId,
    touchpoints,
    totalTouchpoints: touchpoints.length,
    weightedScore: totalScore,
    level,
  };
}

/**
 * Get school name by ID (helper)
 * @param {string} schoolId - School ID
 * @param {Object[]} [targetPrograms=[]] - Target programs from usePrograms hook
 * @param {Object[]} [savedPrograms=[]] - Saved programs from usePrograms hook
 * @returns {string} School name or empty string
 */
function getSchoolNameById(schoolId, targetPrograms = [], savedPrograms = []) {
  const allPrograms = [...targetPrograms, ...savedPrograms];
  const program = allPrograms.find((p) => p.programId === schoolId);
  return program?.program?.schoolName || '';
}

/**
 * Get engagement data for all target programs
 * @param {Object} options - Options object
 * @param {Object[]} [options.trackedEvents] - Array of tracked events
 * @param {Object[]} [options.savedEvents] - Array of saved events
 * @param {Object[]} [options.targetPrograms=[]] - Target programs from usePrograms hook
 * @returns {Object[]} Engagement data for each target program
 */
export function getAllProgramEngagement({
  trackedEvents = mockTrackedEvents,
  savedEvents = mockSavedEvents,
  targetPrograms = [],
} = {}) {
  return targetPrograms.map((program) => {
    const engagement = calculateProgramEngagement(
      program.programId,
      trackedEvents,
      savedEvents
    );

    return {
      ...engagement,
      programName: program.program.schoolName,
      programId: program.programId,
    };
  });
}

// ============================================
// AI TALKING POINTS (Mock Implementation)
// ============================================

/**
 * Generate AI talking points from structured notes
 * This is a mock implementation that would be replaced with actual AI call
 *
 * @param {Object} eventData - Event data including structured notes
 * @returns {string} Generated talking points paragraph
 */
export function generateTalkingPoints(eventData) {
  const { title, date, category, location, schoolName, structuredNotes } = eventData;

  if (!structuredNotes) {
    return null;
  }

  const { learned, peopleMet, standout, wouldApply, general } = structuredNotes;

  // Build a talking points paragraph from the structured notes
  const formattedDate = formatEventDate(date);
  const parts = [];

  // Opening
  if (schoolName) {
    parts.push(`I attended ${schoolName}'s ${getCategoryDescription(category)} on ${formattedDate}`);
  } else {
    parts.push(`I attended the ${title} on ${formattedDate}`);
  }

  // What stood out
  if (standout) {
    parts.push(`and was particularly impressed by ${standout.toLowerCase().replace(/^the /i, '')}`);
  }

  // What was learned
  if (learned) {
    const learnedClean = learned.replace(/^I learned|^Learned/i, '').trim();
    parts.push(`I learned that ${learnedClean.charAt(0).toLowerCase() + learnedClean.slice(1)}`);
  }

  // People met (highlight key contacts)
  if (peopleMet && peopleMet.includes('Program Director')) {
    const match = peopleMet.match(/([A-Za-z. ]+)\s*\(Program Director\)/);
    if (match) {
      parts.push(`Speaking with ${match[1]}, the Program Director, gave me valuable insights into the program's culture and expectations`);
    }
  }

  // Why interested (for program-specific events)
  if (wouldApply && wouldApply.toLowerCase().startsWith('yes')) {
    const reason = wouldApply.replace(/^yes[\s-]*/i, '').trim();
    if (reason) {
      parts.push(`This experience reinforced my interest because ${reason.charAt(0).toLowerCase() + reason.slice(1)}`);
    }
  }

  // Combine into paragraph
  let result = parts.join('. ').replace(/\.\./g, '.');
  if (!result.endsWith('.')) {
    result += '.';
  }

  return result;
}

/**
 * Get human-readable category description
 * @param {string} category - Event category value
 * @returns {string} Description for talking points
 */
function getCategoryDescription(category) {
  const descriptions = {
    open_house: 'Open House',
    info_session: 'information session',
    aana_state_meeting: 'state AANA meeting',
    aana_national_meeting: 'AANA Congress',
    crna_club_event: 'CRNA Club event',
    networking: 'networking meeting',
    other: 'event',
  };
  return descriptions[category] || 'event';
}

// ============================================
// OVERALL STATS
// ============================================

/**
 * Get overall engagement stats across all programs
 * @param {Object} options - Options object
 * @param {Object[]} [options.trackedEvents] - Array of tracked events
 * @param {Object[]} [options.savedEvents] - Array of saved events
 * @param {Object[]} [options.targetPrograms=[]] - Target programs from usePrograms hook
 * @returns {Object} Overall stats
 */
export function getOverallEngagementStats({
  trackedEvents = mockTrackedEvents,
  savedEvents = mockSavedEvents,
  targetPrograms = [],
} = {}) {
  const allEngagement = getAllProgramEngagement({ trackedEvents, savedEvents, targetPrograms });

  const totalEvents = trackedEvents.length;
  const totalContacts = trackedEvents.reduce(
    (sum, e) => sum + (e.contacts?.length || 0),
    0
  );
  const programsEngaged = allEngagement.filter(
    (e) => e.totalTouchpoints > 0
  ).length;
  const totalPrograms = targetPrograms.length;

  return {
    totalEvents,
    totalContacts,
    programsEngaged,
    totalPrograms,
    engagementRate: totalPrograms > 0
      ? Math.round((programsEngaged / totalPrograms) * 100)
      : 0,
  };
}
