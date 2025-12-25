/**
 * Analytics Event Logging Utility
 *
 * Simple event tracking for The CRNA Club.
 * Currently logs to console; dev team will wire to Supabase.
 *
 * Usage:
 *   import { trackEvent } from '@/lib/analytics';
 *   trackEvent('program_saved', { program_id: 3789 });
 *
 * See docs/project/sellability-guide.md for event definitions.
 */

/**
 * Track a user event
 * @param {string} eventName - Name of the event (e.g., 'program_saved', 'page_view')
 * @param {object} properties - Additional event properties
 */
export function trackEvent(eventName, properties = {}) {
  // For now, log to console (dev team wires to Supabase)
  if (import.meta.env.DEV) {
    console.log('[Analytics]', eventName, properties);
  }

  // TODO: Replace with Supabase insert
  // supabase.from('analytics_events').insert({
  //   event_name: eventName,
  //   properties,
  //   user_id: getCurrentUserId()
  // });
}

/**
 * Track a page view
 * @param {string} pageName - Name of the page
 * @param {object} additionalProperties - Optional extra properties
 */
export function trackPageView(pageName, additionalProperties = {}) {
  trackEvent('page_view', {
    page: pageName,
    referrer: document.referrer || null,
    ...additionalProperties,
  });
}

/**
 * Track program actions
 */
export const trackProgram = {
  saved: (programId) => trackEvent('program_saved', { program_id: programId }),
  targeted: (programId) => trackEvent('program_targeted', { program_id: programId }),
  removed: (programId, wasTarget = false) =>
    trackEvent('program_removed', { program_id: programId, was_target: wasTarget }),
  viewed: (programId) => trackEvent('school_viewed', { school_id: programId }),
};

/**
 * Track tracker entry creation
 * @param {string} type - Entry type: 'clinical', 'eq', 'shadow', 'event'
 */
export function trackTrackerEntry(type) {
  trackEvent('tracker_entry_created', { type });
}

/**
 * Track profile updates
 * @param {string} fieldName - Name of the field updated
 * @param {number} completionPercent - Overall profile completion percentage
 */
export function trackProfileUpdate(fieldName, completionPercent) {
  trackEvent('profile_updated', {
    field_name: fieldName,
    completion_percent: completionPercent,
  });
}

/**
 * Track search actions
 * @param {string} query - Search query string
 * @param {object} filters - Applied filters
 * @param {number} resultCount - Number of results returned
 */
export function trackSearch(query, filters = {}, resultCount = 0) {
  trackEvent('search_performed', {
    query,
    filters,
    result_count: resultCount,
  });
}
