/**
 * UpcomingEventsPreview Component
 *
 * Shows upcoming saved events with:
 * - Event title and date
 * - Countdown (e.g., "In 16 days")
 * - "From your targets" badge if linked to target program
 * - Pre-event preparation tips
 *
 * Used in the "Coming Up" section of the Events tracker.
 */

import { Calendar, MapPin, Target, ChevronRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatEventDate } from '@/lib/eventHelpers';
import { getCategoryLabel } from '@/data/mockTrackedEvents';

/**
 * Single upcoming event card
 */
function UpcomingEventCard({
  event,
  onViewDetails,
  showTips = false,
  className,
}) {
  const { title, date, location, countdown, isFromTarget, preEventTips, schoolName, category } = event;

  return (
    <div
      className={cn(
        'rounded-3xl p-4 bg-white/80 backdrop-blur-sm border border-white/20 shadow-sm hover:shadow-md transition-all',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {isFromTarget && (
              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                <Target className="w-3 h-3 mr-1" />
                From your targets
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {getCategoryLabel(category)}
            </Badge>
          </div>

          {/* Title */}
          <h4 className="font-medium text-gray-900 truncate">{title}</h4>

          {/* School name if applicable */}
          {schoolName && (
            <p className="text-sm text-gray-600 mt-0.5">{schoolName}</p>
          )}

          {/* Date and Location */}
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatEventDate(date)}</span>
            </div>
            {location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span className="truncate max-w-[150px]">{location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Countdown */}
        <div className="flex-shrink-0 text-right">
          <span className="text-sm font-medium text-blue-600">{countdown}</span>
        </div>
      </div>

      {/* Pre-event Tips (expandable) */}
      {showTips && preEventTips && preEventTips.length > 0 && (
        <div className="mt-3 pt-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-yellow-500" />
            <span>Prepare for this event:</span>
          </div>
          <ul className="space-y-1">
            {preEventTips.slice(0, 3).map((tip, idx) => (
              <li key={idx} className="text-xs text-gray-500 pl-4 relative">
                <span className="absolute left-0 top-0">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Empty state when no upcoming events
 */
function EmptyUpcomingState({ onBrowseEvents }) {
  return (
    <div className="rounded-3xl p-6 text-center bg-white/60 backdrop-blur-sm border border-white/20">
      <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
      <h4 className="font-medium text-gray-700 mb-1">No upcoming events</h4>
      <p className="text-sm text-gray-500 mb-4">
        Browse events to find open houses and AANA meetings!
      </p>
      <Button variant="outline" size="sm" onClick={onBrowseEvents}>
        Browse Events
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}

/**
 * Main component
 */
export function UpcomingEventsPreview({
  events = [],
  showAllTips = false,
  onBrowseEvents,
  onEventClick,
  className,
}) {
  if (events.length === 0) {
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-widest flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Coming Up
          </h3>
        </div>
        <EmptyUpcomingState onBrowseEvents={onBrowseEvents} />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-widest flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Coming Up
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-gray-500 hover:text-gray-700"
          onClick={onBrowseEvents}
        >
          View all events
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {events.map((event) => (
          <UpcomingEventCard
            key={event.id}
            event={event}
            showTips={showAllTips || event.isFromTarget}
            onViewDetails={() => onEventClick?.(event)}
          />
        ))}
      </div>
    </div>
  );
}

export default UpcomingEventsPreview;
