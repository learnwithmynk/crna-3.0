/**
 * ProgramEngagementCard Component
 *
 * Displays per-program engagement/touchpoints.
 * Shows:
 * - Program name
 * - Touchpoint count with progress bar
 * - Engagement level (Not Started, Getting Started, Building, Strong)
 * - List of touchpoints (events attended, contacts made, events scheduled)
 *
 * Used in the "Engagement by Program" section of the Events tracker.
 */

import { CheckCircle2, Circle, Calendar, Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Color classes for engagement levels
 */
const LEVEL_COLORS = {
  not_started: {
    bg: 'bg-gray-100',
    fill: 'bg-gray-300',
    text: 'text-gray-500',
    badge: 'bg-gray-100 text-gray-600',
  },
  getting_started: {
    bg: 'bg-yellow-50',
    fill: 'bg-yellow-400',
    text: 'text-yellow-700',
    badge: 'bg-yellow-100 text-yellow-700',
  },
  building: {
    bg: 'bg-blue-50',
    fill: 'bg-blue-500',
    text: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700',
  },
  strong: {
    bg: 'bg-green-50',
    fill: 'bg-green-500',
    text: 'text-green-700',
    badge: 'bg-green-100 text-green-700',
  },
};

/**
 * Icons for touchpoint types
 */
const TOUCHPOINT_ICONS = {
  event_attended: CheckCircle2,
  contact_made: Users,
  event_scheduled: Calendar,
  info_reviewed: Circle,
};

/**
 * Single touchpoint item
 */
function TouchpointItem({ touchpoint }) {
  const Icon = TOUCHPOINT_ICONS[touchpoint.type] || Circle;
  const isCompleted = touchpoint.type === 'event_attended' || touchpoint.type === 'contact_made';

  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon
        className={cn(
          'w-4 h-4 mt-0.5 flex-shrink-0',
          isCompleted ? 'text-green-500' : 'text-gray-400'
        )}
      />
      <span className={cn(isCompleted ? 'text-gray-700' : 'text-gray-500')}>
        {touchpoint.label}
      </span>
    </div>
  );
}

/**
 * Progress bar component
 */
function EngagementProgressBar({ touchpoints, maxTouchpoints = 6, levelKey }) {
  const percentage = Math.min((touchpoints / maxTouchpoints) * 100, 100);
  const colors = LEVEL_COLORS[levelKey] || LEVEL_COLORS.not_started;

  return (
    <div className="flex items-center gap-3">
      <div className={cn('flex-1 h-2 rounded-full', colors.bg)}>
        <div
          className={cn('h-2 rounded-full transition-all duration-300', colors.fill)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={cn('text-sm font-medium', colors.text)}>
        {touchpoints} {touchpoints === 1 ? 'touchpoint' : 'touchpoints'}
      </span>
    </div>
  );
}

/**
 * Main component
 */
export function ProgramEngagementCard({
  programName,
  programId,
  touchpoints = [],
  totalTouchpoints = 0,
  level = { key: 'not_started', label: 'Not Started' },
  upcomingEvent = null,
  className,
}) {
  const colors = LEVEL_COLORS[level.key] || LEVEL_COLORS.not_started;
  const hasActivity = totalTouchpoints > 0 || upcomingEvent;

  return (
    <div
      className={cn(
        'border rounded-xl p-4 transition-colors',
        hasActivity ? 'border-gray-200 bg-white' : 'border-dashed border-gray-300 bg-gray-50',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900">{programName}</h4>
        <span
          className={cn(
            'text-xs px-2 py-1 rounded-full font-medium',
            colors.badge
          )}
        >
          {level.label}
        </span>
      </div>

      {/* Progress Bar */}
      <EngagementProgressBar
        touchpoints={totalTouchpoints}
        levelKey={level.key}
      />

      {/* Touchpoints List */}
      {touchpoints.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {touchpoints.slice(0, 4).map((tp, idx) => (
            <TouchpointItem key={idx} touchpoint={tp} />
          ))}
          {touchpoints.length > 4 && (
            <p className="text-xs text-gray-400 pl-6">
              +{touchpoints.length - 4} more
            </p>
          )}
        </div>
      )}

      {/* Empty State */}
      {totalTouchpoints === 0 && !upcomingEvent && (
        <p className="mt-3 text-sm text-gray-500">
          Target saved, no engagement yet
        </p>
      )}

      {/* Upcoming Event Hint */}
      {totalTouchpoints === 0 && upcomingEvent && (
        <div className="mt-3 flex items-center gap-2 text-sm text-blue-600">
          <Clock className="w-4 h-4" />
          <span>Upcoming: {upcomingEvent.title}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Compact summary version for header stats
 */
export function EngagementSummary({
  totalEvents,
  totalContacts,
  programsEngaged,
  totalPrograms,
  className,
}) {
  return (
    <div className={cn('flex flex-wrap items-center gap-4 text-sm', className)}>
      <div className="flex items-center gap-1.5">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="font-medium">{totalEvents}</span>
        <span className="text-gray-500">events logged</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Users className="w-4 h-4 text-gray-400" />
        <span className="font-medium">{totalContacts}</span>
        <span className="text-gray-500">contacts made</span>
      </div>
      <div className="flex items-center gap-1.5">
        <CheckCircle2 className="w-4 h-4 text-gray-400" />
        <span className="font-medium">{programsEngaged}/{totalPrograms}</span>
        <span className="text-gray-500">programs engaged</span>
      </div>
    </div>
  );
}

export default ProgramEngagementCard;
