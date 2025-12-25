/**
 * useOnboardingStatus Hook
 *
 * Manages onboarding state and reminder logic.
 * Handles persistent sessions (users stay logged in via cookies).
 */

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
  COMPLETED_AT: 'onboarding-completed-at',
  SKIPPED_AT: 'onboarding-skipped-at',
  ONBOARDING_DATA: 'onboarding-data',
};

const REMINDER_COOLDOWN_HOURS = 24;
const SESSION_REMINDER_KEY = 'onboarding-reminder-shown';

export function useOnboardingStatus() {
  // Load initial state from localStorage
  const [completedAt, setCompletedAt] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.COMPLETED_AT);
    return stored ? new Date(stored) : null;
  });

  const [skippedAt, setSkippedAt] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SKIPPED_AT);
    return stored ? new Date(stored) : null;
  });

  const [onboardingData, setOnboardingData] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA);
    return stored ? JSON.parse(stored) : null;
  });

  // Derived states
  const isCompleted = !!completedAt;
  const isSkipped = !!skippedAt && !completedAt;

  // Should show modal (never completed, never skipped)
  const shouldShowModal = !completedAt && !skippedAt;

  // Should show reminder (skipped 24h+ ago, not shown this session)
  const shouldShowReminder = useCallback(() => {
    if (completedAt) return false;
    if (!skippedAt) return false;

    const hoursSinceSkip = (Date.now() - new Date(skippedAt).getTime()) / (1000 * 60 * 60);
    const shownThisSession = sessionStorage.getItem(SESSION_REMINDER_KEY);

    return hoursSinceSkip >= REMINDER_COOLDOWN_HOURS && !shownThisSession;
  }, [completedAt, skippedAt]);

  // Mark reminder as shown for this session
  const markReminderShown = useCallback(() => {
    sessionStorage.setItem(SESSION_REMINDER_KEY, 'true');
  }, []);

  // Complete onboarding
  const completeOnboarding = useCallback((data) => {
    const now = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.COMPLETED_AT, now);
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_DATA, JSON.stringify(data));
    // Clear skipped state if it was set
    localStorage.removeItem(STORAGE_KEYS.SKIPPED_AT);

    setCompletedAt(new Date(now));
    setSkippedAt(null);
    setOnboardingData(data);
  }, []);

  // Skip onboarding
  const skipOnboarding = useCallback((partialData, currentScreen) => {
    const now = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.SKIPPED_AT, now);
    // Save partial data so we can resume
    if (partialData) {
      localStorage.setItem(
        STORAGE_KEYS.ONBOARDING_DATA,
        JSON.stringify({ ...partialData, _lastScreen: currentScreen })
      );
      setOnboardingData({ ...partialData, _lastScreen: currentScreen });
    }
    setSkippedAt(new Date(now));
  }, []);

  // Resume onboarding (clears skipped state to show modal again)
  const resumeOnboarding = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.SKIPPED_AT);
    setSkippedAt(null);
  }, []);

  // Reset all onboarding state (for testing)
  const resetOnboarding = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_AT);
    localStorage.removeItem(STORAGE_KEYS.SKIPPED_AT);
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_DATA);
    sessionStorage.removeItem(SESSION_REMINDER_KEY);
    setCompletedAt(null);
    setSkippedAt(null);
    setOnboardingData(null);
  }, []);

  return {
    // State
    isCompleted,
    isSkipped,
    completedAt,
    skippedAt,
    onboardingData,

    // Computed
    shouldShowModal,
    shouldShowReminder: shouldShowReminder(),

    // Actions
    completeOnboarding,
    skipOnboarding,
    resumeOnboarding,
    resetOnboarding,
    markReminderShown,
  };
}

export default useOnboardingStatus;
