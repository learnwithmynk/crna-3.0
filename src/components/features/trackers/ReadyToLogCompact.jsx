/**
 * ReadyToLogCompact Component
 *
 * Space-efficient list view of past saved events awaiting logging.
 * Features:
 * - Compact single-line items with inline actions
 * - Collapsible by default on mobile
 * - Shows 3 items with "show more" expansion
 * - Quick Log/Skip inline buttons
 *
 * Replaces the large card-based ReadyToLogCard for better UX.
 */

import { useState } from 'react';
import {
  Sparkles,
  Calendar,
  MapPin,
  Check,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/label-text';
import { cn } from '@/lib/utils';
import { formatEventDate } from '@/lib/eventHelpers';
import { getCategoryLabel } from '@/data/mockTrackedEvents';

/**
 * Single compact row item
 */
function ReadyToLogRow({ event, onLogIt, onDismiss }) {
  const { title, date, location, schoolName } = event;

  return (
    <div className="flex items-center gap-2 py-2 px-3 rounded-xl hover:bg-yellow-50/50 transition-colors group">
      {/* Radio-style indicator */}
      <div className="w-4 h-4 rounded-full border-2 border-yellow-400 flex-shrink-0" />

      {/* Event info */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className="font-medium text-gray-900 text-sm truncate">
          {title}
        </span>
        <span className="text-gray-400 hidden sm:inline">·</span>
        <span className="text-xs text-gray-500 hidden sm:flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formatEventDate(date)}
        </span>
        {location && (
          <>
            <span className="text-gray-400 hidden md:inline">·</span>
            <span className="text-xs text-gray-500 hidden md:flex items-center gap-1 truncate max-w-[120px]">
              <MapPin className="w-3 h-3" />
              {location}
            </span>
          </>
        )}
      </div>

      {/* Actions - always visible on mobile, hover on desktop */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Button
          size="sm"
          onClick={() => onLogIt(event)}
          className="h-7 px-2 text-xs bg-yellow-500 hover:bg-yellow-600 text-gray-900"
        >
          Log
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDismiss(event)}
          className="h-7 px-2 text-xs text-gray-400 hover:text-gray-600"
        >
          Skip
        </Button>
      </div>
    </div>
  );
}

/**
 * Main component
 */
export function ReadyToLogCompact({
  events = [],
  onLogEvent,
  onDismissEvent,
  defaultExpanded = false,
  className,
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showAll, setShowAll] = useState(false);

  // Don't render if no events
  if (events.length === 0) {
    return null;
  }

  const INITIAL_SHOW = 3;
  const displayEvents = showAll ? events : events.slice(0, INITIAL_SHOW);
  const remainingCount = events.length - INITIAL_SHOW;

  return (
    <div className={cn('rounded-3xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-sm overflow-hidden', className)}>
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          Ready to Log?
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
            {events.length} waiting
          </Badge>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="">
          {/* Events List */}
          <div className="divide-y divide-gray-50">
            {displayEvents.map((event) => (
              <ReadyToLogRow
                key={event.id}
                event={event}
                onLogIt={onLogEvent}
                onDismiss={onDismissEvent}
              />
            ))}
          </div>

          {/* Show More / Show Less */}
          {events.length > INITIAL_SHOW && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full py-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-3 h-3" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  Show {remainingCount} more {remainingCount === 1 ? 'event' : 'events'}
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ReadyToLogCompact;
