/**
 * DashboardNudges
 *
 * Container component for displaying nudges on the dashboard.
 * Shows up to 3 nudges in the sidebar (desktop) or above content (mobile).
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { DashboardNudgeCard, CelebrationCard } from './DashboardNudgeCard';
import { useDashboardNudges, useCelebrations } from '@/hooks/useSmartPrompts';

export function DashboardNudges({
  data,
  onAction,
  className,
  maxNudges = 3,
  showCelebrations = true,
}) {
  const {
    nudges,
    celebrations,
    hasCritical,
    dismissNudge,
    snoozeNudge,
    isLoading,
  } = useDashboardNudges(data);

  // Handle custom actions (like mark_submitted, show_template, etc.)
  const handleAction = (nudgeId, action) => {
    onAction?.(nudgeId, action);
  };

  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        {/* Loading skeleton */}
        <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-20 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  // Limit to max nudges
  const visibleNudges = nudges?.slice(0, maxNudges) || [];

  // Show celebration if available and showCelebrations is true
  const celebration = showCelebrations && celebrations?.[0];

  if (visibleNudges.length === 0 && !celebration) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Celebration card (priority) */}
      {celebration && (
        <CelebrationCard
          nudge={celebration}
          onDismiss={dismissNudge}
          onAction={handleAction}
        />
      )}

      {/* Regular nudge cards */}
      {visibleNudges.map((nudge) => (
        <DashboardNudgeCard
          key={nudge.id}
          nudge={nudge}
          onDismiss={dismissNudge}
          onSnooze={snoozeNudge}
          onAction={handleAction}
        />
      ))}
    </div>
  );
}

/**
 * Mobile version - shows only the most important nudge
 */
export function MobileNudge({ data, onAction, className }) {
  const { mobileNudge, dismissNudge, snoozeNudge } = useDashboardNudges(data);

  if (!mobileNudge) return null;

  return (
    <div className={cn('px-4 py-2', className)}>
      <DashboardNudgeCard
        nudge={mobileNudge}
        onDismiss={dismissNudge}
        onSnooze={snoozeNudge}
        onAction={(id, action) => onAction?.(id, action)}
        compact
      />
    </div>
  );
}

/**
 * Inline nudges for specific page sections
 */
export function InlineNudges({ nudges, onDismiss, onSnooze, onAction, className }) {
  if (!nudges || nudges.length === 0) return null;

  return (
    <div className={cn('space-y-2', className)}>
      {nudges.map((nudge) => (
        <DashboardNudgeCard
          key={nudge.id}
          nudge={nudge}
          onDismiss={onDismiss}
          onSnooze={onSnooze}
          onAction={onAction}
          compact
        />
      ))}
    </div>
  );
}

/**
 * Standalone hook-based component for easy integration
 */
export function SmartNudgesWidget({ className }) {
  // This would be connected to your app's data context
  // For now, return null until integrated with real data
  return (
    <div className={cn('smart-nudges-widget', className)}>
      {/* Widget will render when connected to data */}
    </div>
  );
}

export default DashboardNudges;
