/**
 * Event Engagement Engine
 *
 * Generates nudges for:
 * - EVENT_TOMORROW: "Are you still attending?" confirmation
 * - EVENT_LOG_REMINDER: "Did you attend?" (2 days after event)
 */

import { EVENT_PROMPTS } from '../promptDefinitions';
import { daysUntil, daysSince, generateNudgeId, isTomorrow } from '../promptUtils';
import { calculatePriority } from '../prioritySystem';

/**
 * Event attendance status
 */
export const EVENT_ATTENDANCE = {
  SAVED: 'saved',
  CONFIRMED: 'confirmed',
  ATTENDED: 'attended',
  NOT_ATTENDING: 'not_attending',
  NOT_ATTENDED: 'not_attended',
  UNKNOWN: 'unknown',
};

/**
 * Evaluate event engagement nudges
 */
export function evaluateEventNudges({
  savedEvents = [],
  dismissedPrompts = {},
  lastNudgeShown = {},
  userStage,
  trackerStats,
  lastLoginAt,
  today = new Date(),
}) {
  const nudges = [];

  for (const event of savedEvents) {
    // Skip if already marked as not attending
    if (event.attendanceStatus === EVENT_ATTENDANCE.NOT_ATTENDING) continue;
    if (event.attendanceStatus === EVENT_ATTENDANCE.ATTENDED) continue;
    if (event.attendanceStatus === EVENT_ATTENDANCE.NOT_ATTENDED) continue;

    const eventDate = new Date(event.date);
    const daysToEvent = daysUntil(eventDate, today);
    const daysSinceEvent = daysSince(eventDate, today);

    // EVENT_TOMORROW: Event is tomorrow
    if (isTomorrow(eventDate, today)) {
      const promptDef = EVENT_PROMPTS.EVENT_TOMORROW;
      const nudgeId = generateNudgeId(promptDef.id, { eventId: event.id });

      nudges.push({
        id: nudgeId,
        promptId: promptDef.id,
        engine: 'event',
        type: promptDef.type,
        urgency: promptDef.urgency,
        title: interpolate(promptDef.titleTemplate, {
          eventName: event.name || 'Your saved event',
        }),
        message: promptDef.messageTemplate,
        actions: promptDef.actions.map(action => ({
          ...action,
          context: { eventId: event.id },
        })),
        dismissible: promptDef.dismissible,
        snoozeable: promptDef.snoozeable,
        context: {
          eventId: event.id,
          eventName: event.name,
          eventDate: event.date,
          daysToEvent: 1,
        },
        priority: calculatePriority({
          urgency: promptDef.urgency,
          engine: 'event',
          userStage,
          trackerStats,
          lastLoginAt,
          lastShownAt: lastNudgeShown[nudgeId],
          dismissalCount: dismissedPrompts[nudgeId]?.count || 0,
        }),
      });
    }

    // EVENT_LOG_REMINDER: 2 days after event, attendance unknown
    if (daysSinceEvent === 2 && event.attendanceStatus !== EVENT_ATTENDANCE.CONFIRMED) {
      const promptDef = EVENT_PROMPTS.EVENT_LOG_REMINDER;
      const nudgeId = generateNudgeId(promptDef.id, { eventId: event.id });

      nudges.push({
        id: nudgeId,
        promptId: promptDef.id,
        engine: 'event',
        type: promptDef.type,
        urgency: promptDef.urgency,
        title: interpolate(promptDef.titleTemplate, {
          eventName: event.name || 'the event',
        }),
        message: promptDef.messageTemplate,
        actions: promptDef.actions.map(action => ({
          ...action,
          context: { eventId: event.id },
        })),
        dismissible: promptDef.dismissible,
        snoozeable: promptDef.snoozeable,
        context: {
          eventId: event.id,
          eventName: event.name,
          eventDate: event.date,
          daysSinceEvent,
        },
        priority: calculatePriority({
          urgency: promptDef.urgency,
          engine: 'event',
          userStage,
          trackerStats,
          lastLoginAt,
          lastShownAt: lastNudgeShown[nudgeId],
          dismissalCount: dismissedPrompts[nudgeId]?.count || 0,
        }),
      });
    }
  }

  return nudges.sort((a, b) => b.priority - a.priority);
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
 * Handle "Yes, I'm attending" confirmation
 */
export function handleConfirmAttending(eventId) {
  return {
    eventId,
    attendanceStatus: EVENT_ATTENDANCE.CONFIRMED,
    confirmedAt: new Date().toISOString(),
  };
}

/**
 * Handle "No, can't make it" action
 * Removes event from "Coming Up" and stops nudges
 */
export function handleNotAttending(eventId) {
  return {
    eventId,
    attendanceStatus: EVENT_ATTENDANCE.NOT_ATTENDING,
    markedAt: new Date().toISOString(),
  };
}

/**
 * Handle "Yes, log it" action
 * Opens event tracker to log attendance
 */
export function handleLogEvent(eventId) {
  return {
    eventId,
    attendanceStatus: EVENT_ATTENDANCE.ATTENDED,
    attendedAt: new Date().toISOString(),
    redirectTo: `/trackers?tab=events&log=${eventId}`,
  };
}

/**
 * Handle "No, I didn't go" action
 * Marks as not attended and stops prompting
 */
export function handleNotAttended(eventId) {
  return {
    eventId,
    attendanceStatus: EVENT_ATTENDANCE.NOT_ATTENDED,
    markedAt: new Date().toISOString(),
  };
}

export default {
  EVENT_ATTENDANCE,
  evaluateEventNudges,
  handleConfirmAttending,
  handleNotAttending,
  handleLogEvent,
  handleNotAttended,
};
