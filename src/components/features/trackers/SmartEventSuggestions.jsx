/**
 * SmartEventSuggestions Component
 *
 * Intelligent event suggestions when "Coming Up" section is empty.
 * Features:
 * - Events from target programs (highest priority)
 * - High-value events (AANA meetings)
 * - Events near user's location
 * - Virtual events (easy wins)
 *
 * Replaces the basic empty state in UpcomingEventsPreview.
 */

import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Target,
  Star,
  MapPin,
  Video,
  ChevronRight,
  Plus,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatEventDate } from '@/lib/eventHelpers';

/**
 * Single suggested event row
 */
function SuggestedEventRow({
  event,
  reason,
  reasonIcon: ReasonIcon,
  reasonColor,
  onSave,
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors group">
      <div className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
        reasonColor
      )}>
        <ReasonIcon className="w-3.5 h-3.5" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {event.title}
        </h4>
        {event.schoolName && (
          <p className="text-xs text-gray-500">{event.schoolName}</p>
        )}
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatEventDate(event.date)}
          </span>
          {event.location && (
            <span className="flex items-center gap-1">
              {event.isVirtual ? (
                <Video className="w-3 h-3" />
              ) : (
                <MapPin className="w-3 h-3" />
              )}
              {event.location}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1 italic">{reason}</p>
      </div>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => onSave(event)}
        className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Plus className="w-3 h-3 mr-1" />
        Save
      </Button>
    </div>
  );
}

/**
 * Section header for suggestion categories
 */
function SuggestionCategory({ icon: Icon, label, children }) {
  return (
    <div className="mb-4 last:mb-0">
      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-2 px-3">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </h4>
      <div className="space-y-0.5">
        {children}
      </div>
    </div>
  );
}

/**
 * Main component
 */
export function SmartEventSuggestions({
  targetProgramEvents = [],
  highValueEvents = [],
  nearbyEvents = [],
  virtualEvents = [],
  onSaveEvent,
  onBrowseAll,
  className,
}) {
  const navigate = useNavigate();
  const handleBrowseAll = () => onBrowseAll ? onBrowseAll() : navigate('/events');

  const hasAnySuggestions =
    targetProgramEvents.length > 0 ||
    highValueEvents.length > 0 ||
    nearbyEvents.length > 0 ||
    virtualEvents.length > 0;

  if (!hasAnySuggestions) {
    // Fallback to basic empty state - compact purple style
    return (
      <div
        className={cn('p-4 rounded-3xl', className)}
        style={{ background: 'linear-gradient(to bottom right, rgba(168, 144, 254, 0.12), rgba(252, 165, 241, 0.06))' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-xs font-semibold text-purple-600">For You</span>
        </div>
        <Calendar className="w-8 h-8 text-purple-300 mb-2" />
        <p className="text-sm font-medium text-gray-900 mb-1">No upcoming events</p>
        <p className="text-xs text-gray-500 mb-3">
          Browse events to find open houses!
        </p>
        <Button variant="outline" size="sm" onClick={handleBrowseAll} className="rounded-full">
          Browse Events
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn('rounded-3xl overflow-hidden', className)}
      style={{ background: 'linear-gradient(to bottom right, rgba(168, 144, 254, 0.12), rgba(252, 165, 241, 0.06))' }}
    >
      {/* Header - compact purple style */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-xs font-semibold text-purple-600">For You</span>
        </div>
        <h3 className="text-sm font-semibold text-gray-900">Suggested Events</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Based on your target programs
        </p>
      </div>

      {/* Suggestions */}
      <div className="p-2">
        {/* Target Program Events - Highest Priority */}
        {targetProgramEvents.length > 0 && (
          <SuggestionCategory icon={Target} label="From your target programs">
            {targetProgramEvents.slice(0, 2).map((event) => (
              <SuggestedEventRow
                key={event.id}
                event={event}
                reason="Direct connection to your target program"
                reasonIcon={Target}
                reasonColor="bg-purple-100 text-purple-600"
                onSave={onSaveEvent}
              />
            ))}
          </SuggestionCategory>
        )}

        {/* High Value Events */}
        {highValueEvents.length > 0 && (
          <SuggestionCategory icon={Star} label="High-value networking">
            {highValueEvents.slice(0, 2).map((event) => (
              <SuggestedEventRow
                key={event.id}
                event={event}
                reason="Great for networking + shows commitment"
                reasonIcon={Star}
                reasonColor="bg-yellow-100 text-yellow-600"
                onSave={onSaveEvent}
              />
            ))}
          </SuggestionCategory>
        )}

        {/* Virtual Events - Easy Wins */}
        {virtualEvents.length > 0 && targetProgramEvents.length === 0 && (
          <SuggestionCategory icon={Video} label="Virtual (easy to attend)">
            {virtualEvents.slice(0, 2).map((event) => (
              <SuggestedEventRow
                key={event.id}
                event={event}
                reason="No travel required - easy win"
                reasonIcon={Video}
                reasonColor="bg-blue-100 text-blue-600"
                onSave={onSaveEvent}
              />
            ))}
          </SuggestionCategory>
        )}
      </div>

      {/* Browse All CTA */}
      <div className="px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBrowseAll}
          className="w-full rounded-full"
        >
          Browse All Events
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

export default SmartEventSuggestions;
