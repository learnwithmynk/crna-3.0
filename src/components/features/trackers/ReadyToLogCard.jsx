/**
 * ReadyToLogCard Component
 *
 * Smart prompt for past saved events that haven't been logged.
 * Shows:
 * - Event title and date
 * - "Did you attend? Add your notes!" prompt
 * - Quick actions: "Yes, Log It" and "Didn't Attend"
 *
 * Clicking "Yes, Log It" pre-fills the form with event details.
 */

import { Sparkles, Calendar, MapPin, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/label-text';
import { cn } from '@/lib/utils';
import { formatEventDate } from '@/lib/eventHelpers';
import { getCategoryLabel } from '@/data/mockTrackedEvents';

/**
 * Single ready-to-log event card
 */
function ReadyToLogEventCard({
  event,
  onLogIt,
  onDismiss,
  className,
}) {
  const { title, date, location, category, schoolName } = event;

  return (
    <div
      className={cn(
        'border border-yellow-200 bg-yellow-50 rounded-xl p-4',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-yellow-600" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-yellow-800 font-medium mb-2">
            You saved this event:
          </p>

          {/* Event Title */}
          <h4 className="font-medium text-gray-900">{title}</h4>

          {/* School name if applicable */}
          {schoolName && (
            <p className="text-sm text-gray-600">{schoolName}</p>
          )}

          {/* Date and Location */}
          <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-500">
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

          {/* Category Badge */}
          <Badge variant="outline" className="mt-2 text-xs">
            {getCategoryLabel(category)}
          </Badge>

          {/* Prompt */}
          <p className="mt-3 text-sm text-yellow-800">
            Did you attend? Add your notes!
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            <Button
              size="sm"
              onClick={() => onLogIt(event)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              <Check className="w-4 h-4 mr-1" />
              Yes, Log It
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDismiss(event)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4 mr-1" />
              Didn't Attend
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Empty state when all caught up
 */
function AllCaughtUpState() {
  return (
    <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center bg-gray-50">
      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
        <Check className="w-4 h-4 text-green-600" />
      </div>
      <p className="text-sm text-gray-600">
        All caught up! No events waiting to be logged.
      </p>
    </div>
  );
}

/**
 * Main component
 */
export function ReadyToLogCard({
  events = [],
  onLogEvent,
  onDismissEvent,
  maxDisplay = 2,
  className,
}) {
  // Don't render section if no events
  if (events.length === 0) {
    return null;
  }

  const displayEvents = events.slice(0, maxDisplay);
  const remainingCount = events.length - maxDisplay;

  return (
    <div className={className}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <SectionHeader className="flex items-center gap-2 text-gray-700">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          Ready to Log?
        </SectionHeader>
        {events.length > 0 && (
          <span className="text-xs text-gray-500">
            {events.length} {events.length === 1 ? 'event' : 'events'} waiting
          </span>
        )}
      </div>

      {/* Events */}
      <div className="space-y-3">
        {displayEvents.map((event) => (
          <ReadyToLogEventCard
            key={event.id}
            event={event}
            onLogIt={onLogEvent}
            onDismiss={onDismissEvent}
          />
        ))}
      </div>

      {/* More indicator */}
      {remainingCount > 0 && (
        <p className="text-xs text-gray-500 text-center mt-3">
          +{remainingCount} more {remainingCount === 1 ? 'event' : 'events'} to log
        </p>
      )}
    </div>
  );
}

export default ReadyToLogCard;
