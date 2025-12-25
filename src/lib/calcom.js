/**
 * Cal.com API Integration Helpers
 *
 * Handles all interactions with Cal.com Platform API for the mentor marketplace.
 * Cal.com manages scheduling/availability; we control the UI (100% white-labeled).
 *
 * Key principles:
 * - Neither applicants nor providers ever see Cal.com directly
 * - Payment-first booking: Cal.com booking only created AFTER Stripe payment succeeds
 * - Provider accounts created programmatically on admin approval
 *
 * Environment variables required:
 * - VITE_CAL_COM_API_URL (default: https://api.cal.com/v2)
 * - CAL_COM_CLIENT_ID (server-side only)
 * - CAL_COM_CLIENT_SECRET (server-side only)
 * - CAL_COM_WEBHOOK_SECRET (server-side only)
 *
 * @see ~/.claude/plans/parsed-kindling-honey.md for full integration plan
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

const CAL_COM_API_URL = import.meta.env.VITE_CAL_COM_API_URL || 'https://api.cal.com/v2';

/**
 * Default event types created for each provider on approval.
 * Maps to service types in our marketplace.
 */
export const DEFAULT_EVENT_TYPES = [
  {
    slug: 'mock-interview',
    title: 'Mock Interview',
    description: 'Practice your CRNA school interview with a current SRNA student.',
    length: 60, // minutes
    isLive: true,
  },
  {
    slug: 'essay-review',
    title: 'Essay Review',
    description: 'Get detailed feedback on your personal statement or application essays.',
    length: 30, // placeholder for async - actual delivery is async
    isLive: false,
  },
  {
    slug: 'strategy-session',
    title: 'Strategy Session',
    description: 'Discuss your application strategy, timeline, and program selection.',
    length: 45,
    isLive: true,
  },
  {
    slug: 'resume-review',
    title: 'Resume Review',
    description: 'Get feedback on your nursing resume or CV.',
    length: 30, // placeholder for async
    isLive: false,
  },
  {
    slug: 'school-qa',
    title: 'School Q&A',
    description: 'Ask questions about a specific CRNA program from someone who attends.',
    length: 30,
    isLive: true,
  },
];

// =============================================================================
// ERROR HANDLING
// =============================================================================

/**
 * Custom error class for Cal.com API errors
 */
export class CalComError extends Error {
  constructor(message, code, status, details = null) {
    super(message);
    this.name = 'CalComError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

/**
 * Parse Cal.com API error response
 */
function parseCalComError(response, data) {
  const message = data?.message || data?.error || 'Cal.com API error';
  const code = data?.code || 'UNKNOWN_ERROR';
  return new CalComError(message, code, response.status, data);
}

// =============================================================================
// API HELPERS (Client-side - read-only operations)
// =============================================================================

/**
 * Fetch available time slots for a provider's event type.
 * This is the main client-side function for showing availability in the booking UI.
 *
 * @param {string} eventTypeId - Cal.com event type ID
 * @param {string} dateFrom - Start date (ISO 8601, e.g., "2024-12-15")
 * @param {string} dateTo - End date (ISO 8601, e.g., "2024-12-22")
 * @param {string} timezone - User's timezone (e.g., "America/New_York")
 * @returns {Promise<Array<{ time: string, available: boolean }>>}
 *
 * @example
 * const slots = await getAvailableSlots('evt_123', '2024-12-15', '2024-12-22', 'America/New_York');
 * // Returns: [{ time: '2024-12-15T15:00:00-05:00', available: true }, ...]
 */
export async function getAvailableSlots(eventTypeId, dateFrom, dateTo, timezone = 'America/New_York') {
  // TODO: Replace with actual API call when Cal.com credentials are configured
  // For now, return mock data for UI development

  const params = new URLSearchParams({
    eventTypeId,
    dateFrom,
    dateTo,
    timeZone: timezone,
  });

  // Mock implementation for development
  if (import.meta.env.DEV && !import.meta.env.VITE_CAL_COM_API_KEY) {
    return generateMockSlots(dateFrom, dateTo, timezone);
  }

  const response = await fetch(`${CAL_COM_API_URL}/slots/available?${params}`, {
    headers: {
      'Content-Type': 'application/json',
      // API key will be passed from backend proxy in production
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw parseCalComError(response, data);
  }

  const data = await response.json();
  return data.slots || [];
}

/**
 * Get provider's availability schedule (weekly hours).
 * Used in provider dashboard to display current availability settings.
 *
 * @param {string} providerCalComUserId - Provider's Cal.com user ID
 * @returns {Promise<Object>} Availability schedule
 */
export async function getProviderAvailability(providerCalComUserId) {
  // TODO: Implement when Cal.com credentials are configured
  // This will be called via backend proxy for auth

  // Mock implementation for development
  if (import.meta.env.DEV) {
    return generateMockAvailability();
  }

  throw new CalComError('Not implemented - requires backend proxy', 'NOT_IMPLEMENTED', 501);
}

// =============================================================================
// BOOKING HELPERS (Called from backend after payment succeeds)
// =============================================================================

/**
 * Create a booking in Cal.com after payment succeeds.
 * This should ONLY be called from a backend function (Supabase Edge Function)
 * after Stripe payment is confirmed.
 *
 * @param {Object} params - Booking parameters
 * @param {string} params.eventTypeId - Cal.com event type ID
 * @param {string} params.startTime - ISO 8601 start time
 * @param {Object} params.attendee - Attendee info
 * @param {string} params.attendee.name - Attendee name
 * @param {string} params.attendee.email - Attendee email
 * @param {string} params.attendee.timezone - Attendee timezone
 * @param {Object} params.metadata - Custom metadata (e.g., supabaseBookingId)
 * @param {string} providerAccessToken - Provider's Cal.com access token
 * @returns {Promise<Object>} Created booking
 *
 * @example
 * // Called from Supabase Edge Function after payment
 * const calBooking = await createCalComBooking({
 *   eventTypeId: 'evt_123',
 *   startTime: '2024-12-15T15:00:00-05:00',
 *   attendee: { name: 'Sarah', email: 'sarah@email.com', timezone: 'America/New_York' },
 *   metadata: { supabaseBookingId: 'booking_456' }
 * }, providerAccessToken);
 */
export async function createCalComBooking(params, providerAccessToken) {
  const { eventTypeId, startTime, attendee, metadata = {} } = params;

  const response = await fetch(`${CAL_COM_API_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${providerAccessToken}`,
    },
    body: JSON.stringify({
      eventTypeId,
      start: startTime,
      attendee: {
        name: attendee.name,
        email: attendee.email,
        timeZone: attendee.timezone,
      },
      metadata,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    // Handle slot already taken (race condition)
    if (data.code === 'SLOT_ALREADY_BOOKED' || response.status === 409) {
      throw new CalComError(
        'This time slot was just booked by someone else. Please select another time.',
        'SLOT_TAKEN',
        409,
        data
      );
    }

    throw parseCalComError(response, data);
  }

  return response.json();
}

/**
 * Cancel a Cal.com booking.
 * Should be called when a refund is processed or booking is cancelled.
 *
 * @param {string} calComBookingId - Cal.com booking ID
 * @param {string} reason - Cancellation reason
 * @param {string} accessToken - Access token for auth
 * @returns {Promise<Object>} Cancelled booking
 */
export async function cancelCalComBooking(calComBookingId, reason, accessToken) {
  const response = await fetch(`${CAL_COM_API_URL}/bookings/${calComBookingId}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      reason,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw parseCalComError(response, data);
  }

  return response.json();
}

/**
 * Reschedule a Cal.com booking to a new time.
 *
 * @param {string} calComBookingId - Cal.com booking ID
 * @param {string} newStartTime - New ISO 8601 start time
 * @param {string} accessToken - Access token for auth
 * @returns {Promise<Object>} Rescheduled booking
 */
export async function rescheduleCalComBooking(calComBookingId, newStartTime, accessToken) {
  const response = await fetch(`${CAL_COM_API_URL}/bookings/${calComBookingId}/reschedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      start: newStartTime,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    // Handle slot already taken
    if (data.code === 'SLOT_ALREADY_BOOKED' || response.status === 409) {
      throw new CalComError(
        'This time slot is no longer available. Please select another time.',
        'SLOT_TAKEN',
        409,
        data
      );
    }

    throw parseCalComError(response, data);
  }

  return response.json();
}

// =============================================================================
// PROVIDER ACCOUNT MANAGEMENT (Backend-only operations)
// =============================================================================

/**
 * Create a Cal.com managed user account for a new provider.
 * Called automatically when admin approves a provider application.
 * Provider never sees Cal.com - account is created programmatically.
 *
 * @param {Object} provider - Provider info
 * @param {string} provider.email - Provider email
 * @param {string} provider.name - Provider name
 * @param {string} provider.timezone - Provider timezone
 * @param {string} platformApiKey - Cal.com Platform API key (server-side only)
 * @param {string} clientId - Cal.com OAuth client ID
 * @returns {Promise<{ id: string, accessToken: string, refreshToken: string }>}
 */
export async function createProviderCalAccount(provider, platformApiKey, clientId) {
  const response = await fetch(`${CAL_COM_API_URL}/oauth-clients/${clientId}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${platformApiKey}`,
    },
    body: JSON.stringify({
      email: provider.email,
      name: provider.name,
      timeZone: provider.timezone || 'America/New_York',
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw parseCalComError(response, data);
  }

  const data = await response.json();

  return {
    id: data.id,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
}

/**
 * Create default event types for a new provider.
 * Called after provider Cal.com account is created.
 *
 * @param {string} providerAccessToken - Provider's Cal.com access token
 * @param {Object} providerDefaults - Provider's default settings
 * @returns {Promise<Array<Object>>} Created event types
 */
export async function createProviderEventTypes(providerAccessToken, providerDefaults = {}) {
  const createdEventTypes = [];

  for (const eventType of DEFAULT_EVENT_TYPES) {
    const response = await fetch(`${CAL_COM_API_URL}/event-types`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${providerAccessToken}`,
      },
      body: JSON.stringify({
        title: eventType.title,
        slug: eventType.slug,
        description: eventType.description,
        length: eventType.length,
        // Default settings
        requiresConfirmation: providerDefaults.requiresConfirmation ?? true,
        minimumBookingNotice: providerDefaults.minimumBookingNotice ?? 1440, // 24 hours in minutes
        beforeEventBuffer: providerDefaults.beforeEventBuffer ?? 15, // 15 min buffer
        afterEventBuffer: providerDefaults.afterEventBuffer ?? 15,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      createdEventTypes.push({
        ...data,
        isLive: eventType.isLive,
        serviceSlug: eventType.slug,
      });
    }
    // Continue even if one fails - log error but don't throw
  }

  return createdEventTypes;
}

/**
 * Update provider's availability schedule.
 * Called when provider updates their availability in our dashboard.
 *
 * @param {string} providerAccessToken - Provider's Cal.com access token
 * @param {Object} availability - Availability schedule
 * @param {Array} availability.schedules - Weekly schedule array
 * @returns {Promise<Object>} Updated availability
 */
export async function updateProviderAvailability(providerAccessToken, availability) {
  const response = await fetch(`${CAL_COM_API_URL}/schedules`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${providerAccessToken}`,
    },
    body: JSON.stringify({
      name: 'Default Schedule',
      timeZone: availability.timezone || 'America/New_York',
      availability: availability.schedules,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw parseCalComError(response, data);
  }

  return response.json();
}

// =============================================================================
// WEBHOOK HELPERS
// =============================================================================

/**
 * Verify Cal.com webhook signature.
 * Must be called in webhook handler before processing events.
 *
 * @param {string} payload - Raw request body
 * @param {string} signature - X-Cal-Signature header
 * @param {string} secret - Webhook secret
 * @returns {boolean} Whether signature is valid
 */
export function verifyWebhookSignature(payload, signature, secret) {
  // Note: This needs to run server-side with crypto module
  // Implementation depends on runtime (Node.js vs Deno for Supabase Edge Functions)
  throw new Error('verifyWebhookSignature must be implemented in backend');
}

/**
 * Cal.com webhook event types we care about
 */
export const CALCOM_WEBHOOK_EVENTS = {
  BOOKING_CREATED: 'BOOKING_CREATED',
  BOOKING_RESCHEDULED: 'BOOKING_RESCHEDULED',
  BOOKING_CANCELLED: 'BOOKING_CANCELLED',
  BOOKING_REJECTED: 'BOOKING_REJECTED', // For "Requires Confirmation" model
  MEETING_ENDED: 'MEETING_ENDED',
};

// =============================================================================
// MOCK DATA GENERATORS (Development only)
// =============================================================================

/**
 * Generate mock available slots for development.
 * Simulates realistic availability patterns.
 */
function generateMockSlots(dateFrom, dateTo, timezone) {
  const slots = [];
  const start = new Date(dateFrom);
  const end = new Date(dateTo);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    // Skip weekends for realism
    if (d.getDay() === 0 || d.getDay() === 6) continue;

    // Generate 3-4 slots per day (evening hours - SRNAs are students)
    const slotHours = [15, 16, 17, 18, 19, 20]; // 3 PM - 8 PM
    const availableHours = slotHours.filter(() => Math.random() > 0.3);

    for (const hour of availableHours) {
      const slotDate = new Date(d);
      slotDate.setHours(hour, 0, 0, 0);

      slots.push({
        time: slotDate.toISOString(),
        available: true,
      });
    }
  }

  return slots;
}

/**
 * Generate mock availability schedule for development.
 */
function generateMockAvailability() {
  return {
    timezone: 'America/New_York',
    schedules: [
      { day: 'monday', startTime: '18:00', endTime: '21:00', enabled: true },
      { day: 'tuesday', startTime: '18:00', endTime: '21:00', enabled: true },
      { day: 'wednesday', startTime: '18:00', endTime: '21:00', enabled: false },
      { day: 'thursday', startTime: '18:00', endTime: '21:00', enabled: true },
      { day: 'friday', startTime: '18:00', endTime: '21:00', enabled: false },
      { day: 'saturday', startTime: '10:00', endTime: '14:00', enabled: true },
      { day: 'sunday', startTime: '10:00', endTime: '14:00', enabled: false },
    ],
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Configuration
  DEFAULT_EVENT_TYPES,
  CAL_COM_API_URL,

  // Client-side helpers
  getAvailableSlots,
  getProviderAvailability,

  // Booking operations (backend)
  createCalComBooking,
  cancelCalComBooking,
  rescheduleCalComBooking,

  // Provider management (backend)
  createProviderCalAccount,
  createProviderEventTypes,
  updateProviderAvailability,

  // Webhooks
  verifyWebhookSignature,
  CALCOM_WEBHOOK_EVENTS,

  // Errors
  CalComError,
};
