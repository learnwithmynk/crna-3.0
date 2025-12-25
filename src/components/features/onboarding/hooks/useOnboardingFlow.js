/**
 * useOnboardingFlow Hook
 *
 * Manages the onboarding questionnaire state machine.
 * Handles path branching (A/B/C), screen navigation, and data persistence.
 */

import { useState, useCallback, useMemo } from 'react';

// Screen definitions for each path
const SCREENS = {
  common: ['welcome', 'timeline'],
  pathA: ['icu-experience', 'shadowing', 'certifications', 'gre', 'schools-interest', 'summary'],
  pathB: ['target-schools', 'quick-snapshot', 'help-needed', 'summary'],
  pathC: ['acceptance', 'applying-more', 'summary'],
};

// Timeline values that map to each path
const TIMELINE_TO_PATH = {
  exploring_18_plus: 'A',
  strategizing_6_18: 'A',
  applying_soon: 'B',
  actively_applying: 'B',
  accepted: 'C',
};

// Initial onboarding data state
const INITIAL_DATA = {
  timeline: null,
  currentlyInIcu: null,
  currentUnit: null,
  icuType: null,
  icuYears: 0,
  icuMonths: 0,
  shadowHours: 0,
  certifications: [],
  greStatus: null,
  greQuantitative: null,
  greVerbal: null,
  greWriting: null,
  helpNeeded: [],
  userState: null,
  interestedSchools: [],
  targetSchools: [],
  acceptedProgramId: null,
  applyingToMore: null,
};

export function useOnboardingFlow(initialData = {}) {
  // Current screen index (across common + path screens)
  const [screenIndex, setScreenIndex] = useState(0);

  // Onboarding data
  const [data, setData] = useState({ ...INITIAL_DATA, ...initialData });

  // Derive current path from timeline selection
  const currentPath = useMemo(() => {
    if (!data.timeline) return null;
    return TIMELINE_TO_PATH[data.timeline];
  }, [data.timeline]);

  // Get the full screen sequence based on current path
  const screenSequence = useMemo(() => {
    if (!currentPath) {
      return SCREENS.common;
    }

    const pathScreens =
      currentPath === 'A'
        ? SCREENS.pathA
        : currentPath === 'B'
          ? SCREENS.pathB
          : SCREENS.pathC;

    return [...SCREENS.common, ...pathScreens];
  }, [currentPath]);

  // Current screen name
  const currentScreen = screenSequence[screenIndex] || 'welcome';

  // Progress calculation (endowed progress: starts at 10%)
  const progress = useMemo(() => {
    const baseProgress = 10; // Endowed progress effect
    const maxProgress = 100;
    const progressPerScreen = (maxProgress - baseProgress) / Math.max(screenSequence.length - 1, 1);
    return Math.min(baseProgress + screenIndex * progressPerScreen, maxProgress);
  }, [screenIndex, screenSequence.length]);

  // Check if we're on the last screen
  const isLastScreen = screenIndex === screenSequence.length - 1;

  // Check if we're past the common screens
  const isPastBranch = screenIndex >= SCREENS.common.length;

  // Update a single field
  const updateField = useCallback((field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Update multiple fields at once
  const updateFields = useCallback((updates) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  // Navigate to next screen
  const goNext = useCallback(() => {
    if (!isLastScreen) {
      setScreenIndex((prev) => prev + 1);
    }
  }, [isLastScreen]);

  // Navigate to previous screen
  const goBack = useCallback(() => {
    if (screenIndex > 0) {
      setScreenIndex((prev) => prev - 1);
    }
  }, [screenIndex]);

  // Go to specific screen by name
  const goToScreen = useCallback(
    (screenName) => {
      const index = screenSequence.indexOf(screenName);
      if (index !== -1) {
        setScreenIndex(index);
      }
    },
    [screenSequence]
  );

  // Reset the flow
  const reset = useCallback(() => {
    setScreenIndex(0);
    setData(INITIAL_DATA);
  }, []);

  // Get points earned for current progress
  const pointsEarned = useMemo(() => {
    // Base points: 5 for starting
    let points = 5;

    // 2 points per completed screen (excluding current)
    points += Math.max(0, screenIndex) * 2;

    // Bonus points for specific data
    if (data.shadowHours > 0) points += 2;
    if (data.certifications.length > 0) points += 2;

    return points;
  }, [screenIndex, data.shadowHours, data.certifications.length]);

  return {
    // Current state
    currentScreen,
    screenIndex,
    screenSequence,
    data,
    currentPath,
    progress,
    isLastScreen,
    isPastBranch,
    pointsEarned,

    // Actions
    updateField,
    updateFields,
    goNext,
    goBack,
    goToScreen,
    reset,
  };
}

export default useOnboardingFlow;
