/**
 * useProfileCompletion Hook
 *
 * Tracks profile completion for the "Start your profile" onboarding step.
 * Users need to complete 3 qualifying actions to earn their 20 points.
 *
 * Qualifying Actions (pick any 3):
 * - Clinical profile updated (ICU type + experience)
 * - Shadow hours/days added
 * - Certifications added (at least 1)
 * - Prerequisites added (via quick wizard or detailed)
 * - Events profile updated (categories attended)
 * - Leadership/Research/Community entry added (at least 1)
 *
 * Each action type counts once (e.g., 5 certs = 1 action, not 5).
 *
 * When complete, automatically marks the 'profile' onboarding step as done.
 *
 * NOTE: Actions are tracked via explicit completeAction() calls, not auto-detection,
 * to avoid infinite re-render loops from object reference changes.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'profile-completion-actions';
const DISMISSED_KEY = 'profile-completion-dismissed';
const ONBOARDING_STORAGE_KEY = 'onboarding-steps'; // Shared with useOnboardingSteps
const REQUIRED_ACTIONS = 3;
const POINTS_REWARD = 20;

// Define qualifying action types
export const PROFILE_ACTIONS = {
  CLINICAL: 'clinical',
  SHADOW: 'shadow',
  CERTIFICATIONS: 'certifications',
  PREREQUISITES: 'prerequisites',
  EVENTS: 'events',
  EXTRACURRICULARS: 'extracurriculars', // Leadership, Research, or Community
};

// Human-readable labels for each action
const ACTION_LABELS = {
  [PROFILE_ACTIONS.CLINICAL]: 'Clinical experience',
  [PROFILE_ACTIONS.SHADOW]: 'Shadow hours',
  [PROFILE_ACTIONS.CERTIFICATIONS]: 'Certifications',
  [PROFILE_ACTIONS.PREREQUISITES]: 'Prerequisites',
  [PROFILE_ACTIONS.EVENTS]: 'Events attended',
  [PROFILE_ACTIONS.EXTRACURRICULARS]: 'Leadership/Research/Service',
};

export function useProfileCompletion() {
  // Load completed actions from localStorage
  const [completedActions, setCompletedActions] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Track if indicator is dismissed (after earning points)
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem(DISMISSED_KEY) === 'true';
  });

  // Persist completed actions
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedActions));
  }, [completedActions]);

  // Sync to onboarding steps when profile completion threshold is met
  useEffect(() => {
    if (completedActions.length >= REQUIRED_ACTIONS) {
      try {
        const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY);
        const onboardingSteps = stored ? JSON.parse(stored) : [];
        if (!onboardingSteps.includes('profile')) {
          localStorage.setItem(
            ONBOARDING_STORAGE_KEY,
            JSON.stringify([...onboardingSteps, 'profile'])
          );
        }
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [completedActions]);

  // Mark an action as completed
  const completeAction = useCallback((actionType) => {
    if (!Object.values(PROFILE_ACTIONS).includes(actionType)) {
      console.warn(`Invalid profile action type: ${actionType}`);
      return;
    }

    setCompletedActions(prev => {
      if (prev.includes(actionType)) return prev;
      return [...prev, actionType];
    });
  }, []);

  // Dismiss the completion indicator (after earning points)
  const dismissIndicator = useCallback(() => {
    setIsDismissed(true);
    localStorage.setItem(DISMISSED_KEY, 'true');
  }, []);

  // Reset for testing
  const reset = useCallback(() => {
    setCompletedActions([]);
    setIsDismissed(false);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DISMISSED_KEY);
  }, []);

  // Computed values
  const completedCount = completedActions.length;
  const isComplete = completedCount >= REQUIRED_ACTIONS;
  const remainingCount = Math.max(0, REQUIRED_ACTIONS - completedCount);
  const progress = Math.min(100, Math.round((completedCount / REQUIRED_ACTIONS) * 100));

  // Get list of completed action labels
  const completedLabels = useMemo(() => {
    return completedActions.map(action => ACTION_LABELS[action] || action);
  }, [completedActions]);

  // Get list of remaining action suggestions
  const suggestedActions = useMemo(() => {
    const remaining = Object.values(PROFILE_ACTIONS).filter(
      action => !completedActions.includes(action)
    );
    return remaining.map(action => ({
      id: action,
      label: ACTION_LABELS[action],
    }));
  }, [completedActions]);

  // Should show the indicator?
  // Show if: not dismissed AND not complete yet
  // Hide if: dismissed OR (complete AND dismissed)
  const shouldShowIndicator = !isDismissed && (!isComplete || !isDismissed);

  return {
    // State
    completedActions,
    completedCount,
    completedLabels,
    remainingCount,
    progress,
    isComplete,
    isDismissed,
    shouldShowIndicator,

    // Points
    pointsReward: POINTS_REWARD,
    requiredActions: REQUIRED_ACTIONS,

    // Suggestions
    suggestedActions,

    // Actions
    completeAction,
    dismissIndicator,
    reset,

    // Constants for external use
    PROFILE_ACTIONS,
  };
}

export default useProfileCompletion;

// Helper for testing - call from browser console: window.resetProfileCompletion()
if (typeof window !== 'undefined') {
  window.resetProfileCompletion = () => {
    localStorage.removeItem('profile-completion-actions');
    localStorage.removeItem('profile-completion-dismissed');
    // Also remove 'profile' from onboarding steps
    try {
      const stored = localStorage.getItem('onboarding-steps');
      if (stored) {
        const steps = JSON.parse(stored).filter(s => s !== 'profile');
        localStorage.setItem('onboarding-steps', JSON.stringify(steps));
      }
    } catch {}
    console.log('Profile completion data cleared. Refresh the page.');
  };
}
