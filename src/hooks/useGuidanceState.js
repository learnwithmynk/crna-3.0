/**
 * useGuidanceState Hook
 *
 * Computes and returns the user's guidance state from the Guidance Engine.
 * Memoized to prevent recomputation on every render.
 *
 * PERFORMANCE NOTE: The underlying computeGuidanceState is pure and
 * recomputes on every call. This hook memoizes the result based on
 * user data changes to avoid unnecessary recalculation.
 *
 * See /docs/skills/guidance-engine-spec.md for specification.
 *
 * TODO: Replace with API integration when backend is ready
 */

import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { computeGuidanceState } from '@/lib/guidance/computeGuidanceState';
import { useUser } from '@/hooks/useUser';
import {
  trackStepShown,
  trackStepDismissed,
  trackStepCompleted,
} from '@/lib/telemetry';

export function useGuidanceState() {
  const { user, loading, error } = useUser();

  // Track dismissed steps locally (until API integration)
  // In production, this would be persisted to user.dismissedSteps via API
  const [dismissedStepIds, setDismissedStepIds] = useState(() => {
    // Load from localStorage for persistence across page reloads
    const stored = localStorage.getItem('dismissed-next-best-steps');
    return stored ? JSON.parse(stored) : [];
  });

  // Memoize guidance state computation
  // Only recompute when user data changes
  const guidanceState = useMemo(() => {
    if (!user) return null;
    return computeGuidanceState(user);
  }, [user]);

  // Filter out dismissed steps from the computed next best steps
  const filteredNextBestSteps = useMemo(() => {
    const steps = guidanceState?.nextBestSteps ?? [];
    return steps.filter((step) => !dismissedStepIds.includes(step.stepId));
  }, [guidanceState?.nextBestSteps, dismissedStepIds]);

  // Track shown impressions when steps change
  // Use ref to avoid re-tracking on every render
  const trackedStepsRef = useRef(new Set());

  useEffect(() => {
    if (!guidanceState || loading) return;

    filteredNextBestSteps.forEach((step, index) => {
      // Only track if not already tracked this mount
      if (!trackedStepsRef.current.has(step.stepId)) {
        trackedStepsRef.current.add(step.stepId);
        trackStepShown(step.stepId, {
          applicationStage: guidanceState.applicationStage,
          supportMode: guidanceState.supportMode,
          position: index + 1,
        });
      }
    });
  }, [filteredNextBestSteps, guidanceState, loading]);

  // Handler to dismiss a step
  const dismissStep = useCallback(
    (stepId) => {
      // Track dismissal for analytics
      trackStepDismissed(stepId, {
        applicationStage: guidanceState?.applicationStage,
        supportMode: guidanceState?.supportMode,
      });

      setDismissedStepIds((prev) => {
        const updated = [...prev, stepId];
        // Persist to localStorage
        localStorage.setItem('dismissed-next-best-steps', JSON.stringify(updated));
        return updated;
      });

      toast.success('Step dismissed', {
        description: "This step won't appear for 7 days.",
      });

      // TODO: In production, persist to API:
      // await api.post('/user/dismissed-steps', { stepId, dismissedAt: new Date() });
    },
    [guidanceState?.applicationStage, guidanceState?.supportMode]
  );

  // Handler to track step completion (CTA click)
  const trackStepClick = useCallback(
    (stepId, href) => {
      trackStepCompleted(stepId, {
        applicationStage: guidanceState?.applicationStage,
        supportMode: guidanceState?.supportMode,
        href,
      });
    },
    [guidanceState?.applicationStage, guidanceState?.supportMode]
  );

  return {
    // Core guidance state
    guidanceState,

    // Convenience accessors
    applicationStage: guidanceState?.applicationStage,
    supportMode: guidanceState?.supportMode,
    nextBestSteps: filteredNextBestSteps,
    riskSignals: guidanceState?.riskSignals ?? [],
    primaryFocusAreas: guidanceState?.primaryFocusAreas ?? [],

    // Actions
    dismissStep,
    trackStepClick,

    // Loading/error state (from useUser)
    loading,
    error,
  };
}

export default useGuidanceState;
