/**
 * Telemetry Module
 *
 * Tracks user interactions for analytics. Engine stays pure.
 *
 * V1 Scope:
 * - Direct Supabase writes (no batching)
 * - Session deduplication for impressions
 * - No analytics dashboard (query Supabase directly)
 *
 * Events tracked:
 * - guidance_step_shown: Step appears on dashboard
 * - guidance_step_dismissed: User clicks X
 * - guidance_step_completed: User clicks CTA link
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Session-scoped tracking to prevent duplicate impressions
const shownThisSession = new Set();

// Generate session ID (persists for tab lifetime)
const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;

/**
 * Extract base stepId for aggregation.
 * Handles program-contextual steps like 'continue_program_application_target_001'
 *
 * @param {string} stepId - Full step ID (may include program suffix)
 * @returns {string} Base step ID without program suffix
 */
function extractBaseStepId(stepId) {
  // Pattern: stepId_programId (e.g., 'continue_program_application_target_001')
  // Match suffix pattern: _[word]_[alphanumeric]
  return stepId.replace(/_[a-z]+_[a-z0-9]+$/i, '');
}

/**
 * Track guidance step shown (impression)
 * Deduplicates within session to prevent inflated counts.
 *
 * @param {string} stepId - The step ID being shown
 * @param {object} context - Event context
 * @param {string} context.applicationStage - User's current application stage
 * @param {string} context.supportMode - Current support mode
 * @param {number} context.position - Position in the list (1, 2, or 3)
 */
export async function trackStepShown(stepId, { applicationStage, supportMode, position }) {
  // Skip if Supabase not configured (dev environment)
  if (!isSupabaseConfigured()) {
    console.debug('[Telemetry] Skipped (no Supabase):', 'shown', stepId);
    return;
  }

  // Deduplicate within session
  if (shownThisSession.has(stepId)) return;
  shownThisSession.add(stepId);

  try {
    await supabase.from('guidance_events').insert({
      event_type: 'shown',
      step_id: stepId,
      base_step_id: extractBaseStepId(stepId),
      application_stage: applicationStage,
      support_mode: supportMode,
      position,
      session_id: sessionId,
    });
  } catch (error) {
    // Fire-and-forget: don't break UX for analytics failures
    console.debug('[Telemetry] Failed to track shown event:', error);
  }
}

/**
 * Track guidance step dismissed
 *
 * @param {string} stepId - The step ID being dismissed
 * @param {object} context - Event context
 * @param {string} context.applicationStage - User's current application stage
 * @param {string} context.supportMode - Current support mode
 */
export async function trackStepDismissed(stepId, { applicationStage, supportMode }) {
  // Skip if Supabase not configured (dev environment)
  if (!isSupabaseConfigured()) {
    console.debug('[Telemetry] Skipped (no Supabase):', 'dismissed', stepId);
    return;
  }

  try {
    await supabase.from('guidance_events').insert({
      event_type: 'dismissed',
      step_id: stepId,
      base_step_id: extractBaseStepId(stepId),
      application_stage: applicationStage,
      support_mode: supportMode,
      session_id: sessionId,
    });
  } catch (error) {
    // Fire-and-forget: don't break UX for analytics failures
    console.debug('[Telemetry] Failed to track dismissed event:', error);
  }
}

/**
 * Track guidance step completed (CTA clicked)
 *
 * @param {string} stepId - The step ID being completed
 * @param {object} context - Event context
 * @param {string} context.applicationStage - User's current application stage
 * @param {string} context.supportMode - Current support mode
 * @param {string} context.href - The destination URL
 */
export async function trackStepCompleted(stepId, { applicationStage, supportMode, href }) {
  // Skip if Supabase not configured (dev environment)
  if (!isSupabaseConfigured()) {
    console.debug('[Telemetry] Skipped (no Supabase):', 'completed', stepId);
    return;
  }

  try {
    await supabase.from('guidance_events').insert({
      event_type: 'completed',
      step_id: stepId,
      base_step_id: extractBaseStepId(stepId),
      application_stage: applicationStage,
      support_mode: supportMode,
      href,
      session_id: sessionId,
    });
  } catch (error) {
    // Fire-and-forget: don't break UX for analytics failures
    console.debug('[Telemetry] Failed to track completed event:', error);
  }
}

/**
 * Reset session tracking (for testing)
 * @internal
 */
export function _resetSession() {
  shownThisSession.clear();
}
