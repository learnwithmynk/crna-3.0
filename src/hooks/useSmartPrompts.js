/**
 * useSmartPrompts Hook
 *
 * React hook for consuming smart prompts/nudges in components.
 * Handles evaluation, caching, and interaction tracking.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  evaluateAllEngines,
  getNudgesForPage,
  markNudgeShown,
  recordDismissal,
  recordSnooze,
} from '@/lib/smartPrompts';

/**
 * Main hook for consuming smart prompts
 *
 * @param {Object} data - User data for evaluation
 * @param {Object} options - Configuration options
 * @returns {Object} - Nudges and interaction handlers
 */
export function useSmartPrompts(data, options = {}) {
  const {
    page = 'dashboard',
    autoRecord = true,
    refreshInterval = null, // ms, null = no auto-refresh
  } = options;

  const [nudges, setNudges] = useState(null);
  const [lastEvaluated, setLastEvaluated] = useState(null);

  // Evaluate nudges when data changes
  useEffect(() => {
    if (!data) return;

    const result = evaluateAllEngines(data);
    setNudges(result);
    setLastEvaluated(new Date());

    // Record shown nudges if auto-recording is enabled
    if (autoRecord) {
      const pageNudges = page === 'dashboard' ? result.dashboard : result.inline[page] || [];
      pageNudges.forEach(nudge => markNudgeShown(nudge.id));
    }
  }, [data, page, autoRecord]);

  // Optional auto-refresh
  useEffect(() => {
    if (!refreshInterval || !data) return;

    const interval = setInterval(() => {
      const result = evaluateAllEngines(data);
      setNudges(result);
      setLastEvaluated(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [data, refreshInterval]);

  // Get nudges for current page
  const pageNudges = useMemo(() => {
    if (!nudges) return [];
    if (page === 'dashboard') return nudges.dashboard;
    return nudges.inline[page] || [];
  }, [nudges, page]);

  // Handler for dismissing a nudge
  const dismissNudge = useCallback((nudgeId) => {
    recordDismissal(nudgeId);
    // Re-evaluate to update state
    if (data) {
      const result = evaluateAllEngines(data);
      setNudges(result);
    }
  }, [data]);

  // Handler for snoozing a nudge
  const snoozeNudge = useCallback((nudgeId, days = 7) => {
    recordSnooze(nudgeId, days);
    // Re-evaluate to update state
    if (data) {
      const result = evaluateAllEngines(data);
      setNudges(result);
    }
  }, [data]);

  // Handler for marking a nudge as shown
  const markShown = useCallback((nudgeId) => {
    markNudgeShown(nudgeId);
  }, []);

  // Refresh manually
  const refresh = useCallback(() => {
    if (data) {
      const result = evaluateAllEngines(data);
      setNudges(result);
      setLastEvaluated(new Date());
    }
  }, [data]);

  return {
    // Nudges for current page
    nudges: pageNudges,

    // All categorized nudges
    all: nudges,

    // Mobile-specific nudge (single most important)
    mobileNudge: nudges?.mobile?.[0] || null,

    // Celebrations to show
    celebrations: nudges?.celebrations || [],

    // Stats
    stats: nudges?.stats || { total: 0, critical: 0, high: 0, medium: 0, low: 0 },

    // Has any critical nudges
    hasCritical: nudges?.stats?.critical > 0,

    // Handlers
    dismissNudge,
    snoozeNudge,
    markShown,
    refresh,

    // Meta
    lastEvaluated,
    isLoading: nudges === null,
  };
}

/**
 * Hook for getting nudges by engine (for specific sections)
 */
export function useNudgesByEngine(data, engine) {
  const { all } = useSmartPrompts(data);

  return useMemo(() => {
    if (!all?.byEngine) return [];
    return all.byEngine[engine] || [];
  }, [all, engine]);
}

/**
 * Hook for inline prompts on specific pages
 */
export function useInlinePrompts(data, page) {
  const { all, dismissNudge, snoozeNudge, markShown } = useSmartPrompts(data);

  const prompts = useMemo(() => {
    if (!all?.inline) return [];
    return all.inline[page] || [];
  }, [all, page]);

  return {
    prompts,
    dismissNudge,
    snoozeNudge,
    markShown,
  };
}

/**
 * Hook for dashboard nudges specifically
 */
export function useDashboardNudges(data) {
  return useSmartPrompts(data, { page: 'dashboard' });
}

/**
 * Hook for celebration nudges
 */
export function useCelebrations(data) {
  const { celebrations, all } = useSmartPrompts(data);

  // Get pending celebrations from queue
  const pendingCelebrations = useMemo(() => {
    return celebrations || [];
  }, [celebrations]);

  // Check if acceptance celebration should show
  const hasAcceptance = useMemo(() => {
    return celebrations?.some(c => c.promptId === 'ACCEPTANCE_CELEBRATION');
  }, [celebrations]);

  return {
    celebrations: pendingCelebrations,
    hasAcceptance,
    hasCelebrations: pendingCelebrations.length > 0,
  };
}

/**
 * Hook for critical alerts (deadline, interview, etc.)
 */
export function useCriticalAlerts(data) {
  const { all } = useSmartPrompts(data);

  const criticalNudges = useMemo(() => {
    if (!all?.all) return [];
    return all.all.filter(n => n.urgency === 'critical');
  }, [all]);

  return {
    alerts: criticalNudges,
    hasAlerts: criticalNudges.length > 0,
    mostUrgent: criticalNudges[0] || null,
  };
}

export default useSmartPrompts;
