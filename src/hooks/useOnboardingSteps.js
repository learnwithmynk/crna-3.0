/**
 * useOnboardingSteps Hook
 *
 * Tracks completion of the 5 onboarding steps shown in the Dashboard widget.
 * These are post-modal onboarding tasks that guide users through first actions.
 *
 * Steps:
 * 1. Start your profile (My Stats page) - complete 3 qualifying actions
 * 2. Save your first program
 * 3. Log your first clinical entry
 * 4. Complete your first lesson
 * 5. Introduce yourself (forum post)
 *
 * Points per spec (/docs/skills/gamification-system.md):
 * - Start profile: 20 pts
 * - Save first program: 5 pts
 * - First clinical log: 2 pts
 * - First lesson: 3 pts
 * - First forum post: 2 pts
 * Total: 32 pts
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'onboarding-steps';
const DISMISS_KEY = 'onboarding-widget-dismissed';
const DISMISS_COUNT_KEY = 'onboarding-widget-dismiss-count';
const MAX_DISMISSALS = 3; // After 3 dismissals, hide permanently

// Step definitions per /docs/skills/onboarding-system.md
const ONBOARDING_STEPS = [
  {
    id: 'profile',
    title: 'Start your profile',
    description: 'Add your GPA, certifications, and experience',
    link: '/my-stats',
    points: 20,
  },
  {
    id: 'first_program',
    title: 'Save your first program',
    description: 'Browse schools and save ones that interest you',
    link: '/schools',
    points: 5,
  },
  {
    id: 'first_clinical',
    title: 'Log your first clinical entry',
    description: 'Start tracking your ICU experience',
    link: '/trackers/clinical',
    points: 2,
  },
  {
    id: 'first_lesson',
    title: 'Complete your first lesson',
    description: 'Start learning in the Learning Library',
    link: '/learning',
    points: 3,
  },
  {
    id: 'introduce',
    title: 'Introduce yourself',
    description: 'Say hi in the Introductions forum',
    link: '/community/forums/introductions',
    points: 2,
  },
];

export function useOnboardingSteps() {
  // Load completed steps from localStorage
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Track dismissal state - session-based with max count
  const [isDismissedThisSession, setIsDismissedThisSession] = useState(() => {
    return sessionStorage.getItem(DISMISS_KEY) === 'true';
  });

  // Track total dismiss count for permanent hiding
  const [dismissCount, setDismissCount] = useState(() => {
    const count = localStorage.getItem(DISMISS_COUNT_KEY);
    return count ? parseInt(count, 10) : 0;
  });

  // Permanently dismissed after MAX_DISMISSALS
  const isPermanentlyDismissed = dismissCount >= MAX_DISMISSALS;

  // Persist completed steps
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedSteps));
  }, [completedSteps]);

  // Mark a step as completed
  const completeStep = useCallback((stepId) => {
    setCompletedSteps((prev) => {
      if (prev.includes(stepId)) return prev;
      return [...prev, stepId];
    });
  }, []);

  // Check if a specific step is completed
  const isStepCompleted = useCallback(
    (stepId) => completedSteps.includes(stepId),
    [completedSteps]
  );

  // Dismiss the widget for this session (increments count)
  const dismissWidget = useCallback(() => {
    setIsDismissedThisSession(true);
    sessionStorage.setItem(DISMISS_KEY, 'true');

    // Increment dismiss count
    const newCount = dismissCount + 1;
    setDismissCount(newCount);
    localStorage.setItem(DISMISS_COUNT_KEY, String(newCount));
  }, [dismissCount]);

  // Reset (for testing)
  const resetSteps = useCallback(() => {
    setCompletedSteps([]);
    setIsDismissedThisSession(false);
    setDismissCount(0);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DISMISS_COUNT_KEY);
    sessionStorage.removeItem(DISMISS_KEY);
  }, []);

  // Computed values
  const steps = useMemo(
    () =>
      ONBOARDING_STEPS.map((step) => ({
        ...step,
        completed: completedSteps.includes(step.id),
      })),
    [completedSteps]
  );

  const completedCount = completedSteps.length;
  const totalCount = ONBOARDING_STEPS.length;
  const allCompleted = completedCount === totalCount;
  const totalPoints = ONBOARDING_STEPS.reduce((sum, s) => sum + s.points, 0);
  const earnedPoints = steps
    .filter((s) => s.completed)
    .reduce((sum, s) => sum + s.points, 0);

  // Progress percentage
  const progress = Math.round((completedCount / totalCount) * 100);

  // Combined dismissed state (session OR permanent)
  const isDismissed = isDismissedThisSession || isPermanentlyDismissed;

  return {
    // Step data
    steps,
    completedSteps,

    // Counts
    completedCount,
    totalCount,
    progress,

    // Points
    totalPoints,
    earnedPoints,

    // Status
    allCompleted,
    isDismissed,
    dismissCount,
    dismissesRemaining: Math.max(0, MAX_DISMISSALS - dismissCount),

    // Actions
    completeStep,
    isStepCompleted,
    dismissWidget,
    resetSteps,
  };
}

export default useOnboardingSteps;
