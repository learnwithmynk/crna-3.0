/**
 * usePromptState Hook
 *
 * Manages prompt/nudge state across all trackers with localStorage persistence.
 * Ready for Supabase integration when user auth is available.
 *
 * Features:
 * - Tracker nudge dismissals (clinical, EQ, shadow, events, etc.)
 * - Smart prompt interactions
 * - Celebration tracking
 * - localStorage fallback for anonymous/demo users
 *
 * Supabase Integration:
 * - Data stored in: user_guidance_state.prompt_state (JSONB column)
 * - See migration: 20251214500000_prompt_state.sql
 * - When auth available, sync localStorage → Supabase on login
 *
 * Usage:
 *   const { trackerNudges, dismissNudge, snoozeNudge, permanentlyDismissNudge } = usePromptState();
 *   const clinicalState = trackerNudges.clinical_catchup;
 *
 * TODO [DEV TEAM]: Implement Supabase sync when auth is ready
 * ============================================================
 * 1. Table & Column:
 *    - Table: user_guidance_state
 *    - Column: prompt_state (JSONB) - already deployed via migration 20251214500000
 *    - The column stores the same shape as DEFAULT_STATE below
 *
 * 2. Implementation Steps:
 *    a) Import useUser/useAuth hook to get authenticated user
 *    b) On mount: If user is logged in, fetch from Supabase first, merge with localStorage
 *    c) On state change: Debounce and sync to Supabase (if logged in)
 *    d) On login: Merge localStorage state → Supabase (localStorage takes precedence for conflicts)
 *    e) On logout: Keep localStorage copy, clear Supabase reference
 *
 * 3. Merge Strategy (localStorage → Supabase on login):
 *    - For tracker_nudges: Use higher dismissCount, prefer permanentlyDismissed=true
 *    - For dismissed_prompts: Union both arrays, dedupe by promptId+context
 *    - For celebrated_events: Union both arrays
 *
 * 4. Example Supabase query:
 *    ```js
 *    // Fetch
 *    const { data } = await supabase
 *      .from('user_guidance_state')
 *      .select('prompt_state')
 *      .eq('user_id', userId)
 *      .single();
 *
 *    // Upsert
 *    await supabase
 *      .from('user_guidance_state')
 *      .upsert({ user_id: userId, prompt_state: state });
 *    ```
 *
 * 5. localStorage key: 'crna_prompt_state' (see STORAGE_KEY below)
 *
 * 6. Current Usage (trackers already wired up):
 *    - ClinicalTracker.jsx: Uses `clinical_catchup` nudge ID
 *      - Triggers: 4+ days since last clinical log
 *    - EQTracker.jsx: Uses `eq_reflection` nudge ID
 *      - Triggers: 7+ days since last EQ reflection
 *    - ShadowDaysTracker.jsx: Uses `shadow_reminder` nudge ID
 *      - Triggers: 30+ days since last shadow AND hours < goal
 *    - EventsTracker.jsx: Uses `events_log` nudge ID
 *      - Triggers: Past events waiting to be logged (from Ready to Log)
 *
 *    All trackers use same pattern:
 *      - getNudgeState, shouldShowNudge, dismissNudge, snoozeNudge, permanentlyDismissNudge
 *      - X button dismiss: 24 hours (via lastDismissedAt in hook, persisted to localStorage)
 *      - Snooze: 7 days (via snoozedUntil)
 *      - Permanent: After 5 X-button clicks (via permanentlyDismissed)
 *
 * 7. No changes needed to tracker components - just update this hook to sync with Supabase
 */

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'crna_prompt_state';

/**
 * Default state structure
 */
const DEFAULT_STATE = {
  tracker_nudges: {
    // Each tracker can have its own nudge state
    // clinical_catchup: { dismissCount, permanentlyDismissed, snoozedUntil }
    // eq_reflection: { ... }
    // shadow_reminder: { ... }
    // events_reminder: { ... }
  },
  dismissed_prompts: [],
  prompt_interactions: [],
  celebrated_events: [],
  last_nudge_shown: {},
};

/**
 * Default nudge state for a tracker
 */
const DEFAULT_NUDGE_STATE = {
  dismissCount: 0,
  permanentlyDismissed: false,
  snoozedUntil: null,
  lastDismissedAt: null, // ISO string - for 24-hour session dismiss
};

/**
 * Load state from localStorage
 */
function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_STATE, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.warn('Failed to load prompt state from localStorage:', e);
  }
  return DEFAULT_STATE;
}

/**
 * Save state to localStorage
 */
function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save prompt state to localStorage:', e);
  }
}

/**
 * Main hook
 */
export function usePromptState() {
  const [state, setState] = useState(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = loadFromStorage();
    setState(loaded);
    setIsLoaded(true);
  }, []);

  // Save to localStorage on state change (after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(state);
    }
  }, [state, isLoaded]);

  /**
   * Get nudge state for a specific tracker
   * @param {string} trackerId - e.g., 'clinical_catchup', 'eq_reflection', 'shadow_reminder'
   */
  const getNudgeState = useCallback((trackerId) => {
    return state.tracker_nudges[trackerId] || DEFAULT_NUDGE_STATE;
  }, [state.tracker_nudges]);

  /**
   * Check if a nudge should be shown
   * @param {string} trackerId
   * @returns {boolean}
   */
  const shouldShowNudge = useCallback((trackerId) => {
    const nudge = getNudgeState(trackerId);
    if (nudge.permanentlyDismissed) return false;
    if (nudge.snoozedUntil && new Date() < new Date(nudge.snoozedUntil)) return false;
    // Check 24-hour dismiss window (X button dismiss)
    if (nudge.lastDismissedAt) {
      const dismissedAt = new Date(nudge.lastDismissedAt);
      const hoursSinceDismiss = (new Date() - dismissedAt) / (1000 * 60 * 60);
      if (hoursSinceDismiss < 24) return false;
    }
    return true;
  }, [getNudgeState]);

  /**
   * Dismiss a nudge for 24 hours (X button) and increment count
   * @param {string} trackerId
   */
  const dismissNudge = useCallback((trackerId) => {
    setState((prev) => ({
      ...prev,
      tracker_nudges: {
        ...prev.tracker_nudges,
        [trackerId]: {
          ...DEFAULT_NUDGE_STATE,
          ...prev.tracker_nudges[trackerId],
          dismissCount: (prev.tracker_nudges[trackerId]?.dismissCount || 0) + 1,
          lastDismissedAt: new Date().toISOString(),
        },
      },
    }));
  }, []);

  /**
   * Snooze a nudge for specified days
   * @param {string} trackerId
   * @param {number} days - Default 7
   */
  const snoozeNudge = useCallback((trackerId, days = 7) => {
    const snoozeDate = new Date();
    snoozeDate.setDate(snoozeDate.getDate() + days);

    setState((prev) => ({
      ...prev,
      tracker_nudges: {
        ...prev.tracker_nudges,
        [trackerId]: {
          ...DEFAULT_NUDGE_STATE,
          ...prev.tracker_nudges[trackerId],
          snoozedUntil: snoozeDate.toISOString(),
        },
      },
    }));
  }, []);

  /**
   * Permanently dismiss a nudge
   * @param {string} trackerId
   */
  const permanentlyDismissNudge = useCallback((trackerId) => {
    setState((prev) => ({
      ...prev,
      tracker_nudges: {
        ...prev.tracker_nudges,
        [trackerId]: {
          ...DEFAULT_NUDGE_STATE,
          ...prev.tracker_nudges[trackerId],
          permanentlyDismissed: true,
        },
      },
    }));
  }, []);

  /**
   * Reset a nudge state (for testing/admin)
   * @param {string} trackerId
   */
  const resetNudge = useCallback((trackerId) => {
    setState((prev) => {
      const newTrackerNudges = { ...prev.tracker_nudges };
      delete newTrackerNudges[trackerId];
      return { ...prev, tracker_nudges: newTrackerNudges };
    });
  }, []);

  /**
   * Dismiss a smart prompt
   * @param {string} promptId
   * @param {string} dismissType - 'permanent', 'snooze_7d', 'snooze_30d'
   * @param {string} context - Optional context (e.g., program_id)
   */
  const dismissPrompt = useCallback((promptId, dismissType = 'permanent', context = null) => {
    setState((prev) => ({
      ...prev,
      dismissed_prompts: [
        ...prev.dismissed_prompts,
        {
          promptId,
          context,
          dismissedAt: new Date().toISOString(),
          dismissType,
        },
      ],
    }));
  }, []);

  /**
   * Check if a prompt is dismissed
   * @param {string} promptId
   * @param {string} context - Optional context
   */
  const isPromptDismissed = useCallback((promptId, context = null) => {
    return state.dismissed_prompts.some((d) => {
      if (d.promptId !== promptId) return false;
      if (context && d.context !== context) return false;

      // Check if snooze has expired
      if (d.dismissType === 'snooze_7d') {
        const expiry = new Date(d.dismissedAt);
        expiry.setDate(expiry.getDate() + 7);
        if (new Date() > expiry) return false;
      }
      if (d.dismissType === 'snooze_30d') {
        const expiry = new Date(d.dismissedAt);
        expiry.setDate(expiry.getDate() + 30);
        if (new Date() > expiry) return false;
      }

      return true;
    });
  }, [state.dismissed_prompts]);

  /**
   * Record a prompt interaction
   * @param {string} promptId
   * @param {string} action - 'completed', 'dismissed', 'snoozed'
   */
  const recordPromptInteraction = useCallback((promptId, action) => {
    setState((prev) => ({
      ...prev,
      prompt_interactions: [
        ...prev.prompt_interactions,
        {
          promptId,
          shownAt: new Date().toISOString(),
          action,
        },
      ],
    }));
  }, []);

  /**
   * Check if an event has been celebrated
   * @param {string} eventId
   */
  const hasCelebrated = useCallback((eventId) => {
    return state.celebrated_events.includes(eventId);
  }, [state.celebrated_events]);

  /**
   * Mark an event as celebrated
   * @param {string} eventId
   */
  const markCelebrated = useCallback((eventId) => {
    setState((prev) => ({
      ...prev,
      celebrated_events: [...new Set([...prev.celebrated_events, eventId])],
    }));
  }, []);

  /**
   * Clear all state (for testing/logout)
   */
  const clearAll = useCallback(() => {
    setState(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    // State
    isLoaded,
    trackerNudges: state.tracker_nudges,
    dismissedPrompts: state.dismissed_prompts,
    celebratedEvents: state.celebrated_events,

    // Tracker nudge helpers
    getNudgeState,
    shouldShowNudge,
    dismissNudge,
    snoozeNudge,
    permanentlyDismissNudge,
    resetNudge,

    // Smart prompt helpers
    dismissPrompt,
    isPromptDismissed,
    recordPromptInteraction,

    // Celebration helpers
    hasCelebrated,
    markCelebrated,

    // Admin/testing
    clearAll,
  };
}

export default usePromptState;
