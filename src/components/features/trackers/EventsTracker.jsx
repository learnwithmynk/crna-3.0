/**
 * EventsTracker Component (Redesigned)
 *
 * "Your Interview Prep Powerhouse"
 *
 * Layout matches ClinicalTracker:
 * - Header with Log Event button (hides when form is open)
 * - Inline form expands above two-column grid
 * - Two-column layout: Main content (2/3) + Sidebar (1/3)
 * - Blue gradient theme
 *
 * Layout (Desktop):
 * ┌─────────────────────────────────────────────────────────┐
 * │ [Header] Events & Notes              [+ Log Event btn]  │
 * ├─────────────────────────────────────────────────────────┤
 * │ [Inline Form - when expanded]                           │
 * ├─────────────────────────────────┬───────────────────────┤
 * │ My Event Log                    │ Events Logged card    │
 * │ - Event entries list            │ Coming Up             │
 * │                                 │ Ready to Log          │
 * │                                 │ Suggested Events      │
 * │                                 │ Engagement Coaching   │
 * └─────────────────────────────────┴───────────────────────┘
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Plus,
  Calendar,
  Users,
  Sparkles,
  MapPin,
  ChevronDown,
  ChevronUp,
  FileText,
  Trophy,
  Star,
  Clock,
  Target,
  Video,
  ChevronRight,
  X,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePromptState } from '@/hooks/usePromptState';
import { cn } from '@/lib/utils';

// Components
import { StructuredNoteForm } from './StructuredNoteForm';

// Data and helpers
import {
  mockTrackedEvents,
  getCategoryLabel,
} from '@/data/mockTrackedEvents';
import { mockSavedEvents } from '@/data/mockSavedEvents';
import { mockEvents } from '@/data/mockEvents';
import {
  getUpcomingEvents as getUpcomingEventsHelper,
  getOverallEngagementStats,
  formatEventDate,
} from '@/lib/eventHelpers';
import { usePrograms } from '@/hooks/usePrograms';

/**
 * Events Log Reminder Nudge messages
 */
const EVENTS_NUDGE_MESSAGES = [
  { count: 1, message: "You've got an event waiting to be logged! Capture your notes while it's fresh." },
  { count: 2, message: "2 events need logging. Your notes become great interview talking points!" },
  { count: 3, message: "Several events waiting - logging them helps you track who you've met." },
];

/**
 * Events Log Reminder Nudge
 * Triggers when there are past events that haven't been logged
 * Shows clickable links for each event waiting to be logged
 */
function EventsLogNudge({ events, dismissCount, onLogEvent, onDismissEvent, onDismiss, onSnooze, onPermanentDismiss }) {
  const showPermanentDismiss = dismissCount >= 5;

  return (
    <Card className="p-4 bg-gradient-to-r from-sky-50 to-blue-50 border-sky-100">
      <div className="flex items-start gap-3">
        <Clock className="w-6 h-6 text-sky-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium text-sky-900">
            {events.length === 1
              ? "You've got an event waiting to be logged!"
              : `You've got ${events.length} events waiting to be logged!`}
          </p>
          <p className="text-sm text-sky-700 mt-1">
            Capture your notes while they're fresh.
          </p>

          {/* Event links */}
          <div className="mt-3 space-y-1.5">
            {events.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center justify-between gap-2 group/event">
                <button
                  onClick={() => onLogEvent(event)}
                  className="text-left text-sm text-sky-700 hover:text-sky-900 hover:underline"
                >
                  → Log "{event.title}" ({formatEventDate(event.date)})
                </button>
                <button
                  onClick={() => onDismissEvent(event)}
                  className="p-0.5 hover:bg-sky-200 rounded transition-colors opacity-0 group-hover/event:opacity-100"
                  aria-label={`Dismiss ${event.title}`}
                  title="Skip this event"
                >
                  <X className="w-3.5 h-3.5 text-sky-500" />
                </button>
              </div>
            ))}
            {events.length > 5 && (
              <p className="text-xs text-sky-600">
                +{events.length - 5} more events
              </p>
            )}
          </div>

          {/* Dismiss options */}
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-sky-200">
            {showPermanentDismiss ? (
              <button
                onClick={onPermanentDismiss}
                className="text-xs text-sky-600 hover:text-sky-800 hover:underline"
              >
                Don't remind me again
              </button>
            ) : (
              <button
                onClick={onSnooze}
                className="text-xs text-sky-600 hover:text-sky-800 hover:underline"
              >
                Remind me in 3 days
              </button>
            )}
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-sky-100 rounded-full transition-colors"
          aria-label="Dismiss until next session"
          title="Dismiss until next session"
        >
          <X className="w-4 h-4 text-sky-500" />
        </button>
      </div>
    </Card>
  );
}

/**
 * Events Logged celebration card - Sunset Glow theme (A) - primary gradient (yellow-gold to coral-pink)
 */
function EventsLoggedCard({ totalEvents, totalContacts, onLogEvent }) {
  const totalPoints = totalEvents * 2;
  const [isLevelUp, setIsLevelUp] = useState(false);
  const prevLevelRef = useRef(null);

  // Determine celebration level - Sunset Glow gradient
  const getCelebrationLevel = () => {
    if (totalEvents >= 10) return { level: 4, emoji: '🏆', message: 'Event Master!' };
    if (totalEvents >= 7) return { level: 3, emoji: '🔥', message: 'On fire!' };
    if (totalEvents >= 4) return { level: 2, emoji: '🎯', message: 'Great progress!' };
    return { level: 1, emoji: '🎟️', message: 'Keep it up!' };
  };

  const celebration = getCelebrationLevel();

  // Detect level up and trigger animation
  useEffect(() => {
    if (prevLevelRef.current !== null && celebration.level > prevLevelRef.current) {
      setIsLevelUp(true);
      const timer = setTimeout(() => setIsLevelUp(false), 1000);
      return () => clearTimeout(timer);
    }
    prevLevelRef.current = celebration.level;
  }, [celebration.level]);

  return (
    <Card className="p-5 rounded-3xl shadow-lg border-0 overflow-hidden relative transition-all duration-500 bg-gradient-to-br from-[#F5D76E] via-[#F5A970] to-[#E8758A]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      {/* Level up celebration burst */}
      {isLevelUp && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/30 rounded-full animate-ping" />
        </div>
      )}

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#8B4535]" />
            </div>
            <span className="font-semibold text-[#8B4535]">Events Logged</span>
          </div>
          <span className={cn(
            'text-3xl transition-transform duration-300',
            isLevelUp && 'animate-bounce'
          )}>{celebration.emoji}</span>
        </div>

        <div className="mb-4">
          <div className="text-5xl font-bold text-[#8B4535] mb-1">{totalEvents}</div>
          <div className="text-[#A05545]/80 text-sm">{celebration.message}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-3 py-1.5">
            <Star className="w-4 h-4 text-[#8B4535] fill-[#8B4535]" />
            <span className="text-sm font-medium text-[#8B4535]">{totalPoints} pts earned</span>
          </div>
          <Button
            onClick={onLogEvent}
            size="sm"
            className="bg-white/40 hover:bg-white/50 text-[#8B4535] border-0 backdrop-blur-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Log +5 pts
          </Button>
        </div>

        {totalContacts > 0 && (
          <div className="mt-4 pt-3 border-t border-[#8B4535]/20">
            <div className="flex items-center gap-2 text-sm text-[#A05545]/80">
              <Users className="w-4 h-4" />
              <span>{totalContacts} contacts made</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * Coming Up card for upcoming saved events (blue theme)
 */
function ComingUpCard({ events, onBrowseEvents }) {
  if (events.length === 0) {
    return (
      <Card className="p-4 bg-blue-50 border-blue-100 rounded-3xl">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-blue-600" />
          <h4 className="font-semibold text-blue-900">Coming Up</h4>
        </div>
        <div className="text-center py-3">
          <Calendar className="w-8 h-8 text-blue-300 mx-auto mb-2" />
          <p className="text-sm text-blue-700 mb-3">No upcoming events saved</p>
          <Button
            variant="outline"
            size="sm"
            onClick={onBrowseEvents}
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            Browse Events
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-blue-50 border-blue-100 rounded-3xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <h4 className="font-semibold text-blue-900">Coming Up</h4>
          <Badge className="bg-blue-200 text-blue-800 text-xs">
            {events.length}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBrowseEvents}
          className="text-xs text-blue-600 hover:text-blue-700 h-7 px-2"
        >
          View all
        </Button>
      </div>
      <div className="space-y-2">
        {events.slice(0, 3).map((event) => (
          <div key={event.id} className="p-2 bg-white rounded-xl">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                {event.schoolName && (
                  <p className="text-xs text-gray-500">{event.schoolName}</p>
                )}
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {formatEventDate(event.date)}
                </div>
              </div>
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 shrink-0">
                {event.countdown}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/**
 * Ready to Log card - Sunset Glow theme (A) - secondary gradient
 */
function ReadyToLogCard({ events, onLogEvent, onDismissEvent }) {
  const [expanded, setExpanded] = useState(true);

  if (events.length === 0) return null;

  return (
    <Card className="p-4 rounded-3xl border-0 overflow-hidden relative bg-gradient-to-br from-[#FEF9E8] via-[#FEF4EC] to-[#FDF0F2]">
      {/* Background decoration - multiple layers for depth */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-white/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-sm" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-sm" />
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-[#F5D76E]/20 rounded-full blur-md" />

      <div className="relative">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/40 backdrop-blur-sm flex items-center justify-center shadow-sm">
              <Clock className="w-4 h-4 text-[#8B4535]" />
            </div>
            <h4 className="font-semibold text-[#8B4535]">Ready to Log</h4>
            <Badge className="bg-white/50 text-[#8B4535] text-xs backdrop-blur-sm border-0 shadow-sm">
              {events.length}
            </Badge>
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-[#A05545]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#A05545]" />
          )}
        </button>

        {expanded && (
          <>
            <p className="text-xs text-[#A05545]/80 mt-2 mb-3">
              These events have passed and are waiting to be logged.
            </p>
            <div className="space-y-2">
              {events.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-2 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#8B4535] truncate">{event.title}</p>
                    <p className="text-xs text-[#A05545]/80">
                      {formatEventDate(event.date)}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => onLogEvent(event)}
                      className="h-7 px-2 bg-gradient-to-r from-[#E89060] to-[#E07080] hover:from-[#D88050] hover:to-[#D06070] text-white shadow-sm"
                    >
                      Log
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDismissEvent(event)}
                      className="h-7 px-2 text-[#A05545] hover:text-[#8B4535] hover:bg-white/30"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

/**
 * Smart Event Suggestions - pulls from user's saved/target programs (blue theme)
 */
function SmartEventSuggestionsCard({ targetPrograms, savedPrograms, onSaveEvent, onBrowseEvents }) {
  // Combine target and saved programs to get their school IDs and states
  const allUserPrograms = useMemo(() => {
    const programs = [...targetPrograms, ...savedPrograms];
    return programs.map(p => ({
      schoolId: p.program?._schoolData?.id,
      schoolName: p.program?.schoolName || p.program?.name,
      state: p.program?.location?.state || p.program?._schoolData?.state,
      isTarget: p.isTarget,
    })).filter(p => p.schoolId);
  }, [targetPrograms, savedPrograms]);

  // Get states that have user's programs (for state AANA meetings)
  const userStates = useMemo(() => {
    const states = new Set();
    allUserPrograms.forEach(p => {
      if (p.state) states.add(p.state);
    });
    return Array.from(states);
  }, [allUserPrograms]);

  // Get suggested events from actual events data
  const suggestedEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const suggestions = {
      targetProgramEvents: [],
      stateMeetings: [],
      virtualEvents: [],
    };

    // Filter future events
    const futureEvents = mockEvents.filter(event => new Date(event.date) >= today);

    // 1. Events from target programs (highest priority)
    const targetSchoolIds = targetPrograms.map(p => p.program?._schoolData?.id).filter(Boolean);
    futureEvents.forEach(event => {
      // Match by school ID or school name
      const matchesTarget = targetSchoolIds.some(id =>
        event.schoolId === `school_${id}` ||
        event.schoolId === id ||
        event.schoolId === String(id)
      ) || targetPrograms.some(p =>
        p.program?.schoolName?.toLowerCase() === event.schoolName?.toLowerCase()
      );

      if (matchesTarget && suggestions.targetProgramEvents.length < 3) {
        suggestions.targetProgramEvents.push({
          ...event,
          reason: 'From your target program',
        });
      }
    });

    // 2. AANA State meetings in states where user has programs
    futureEvents.forEach(event => {
      if (event.category === 'aana_state_meeting' && userStates.includes(event.state)) {
        if (suggestions.stateMeetings.length < 2) {
          suggestions.stateMeetings.push({
            ...event,
            reason: `State meeting for ${event.state}`,
          });
        }
      }
    });

    // 3. Virtual events from saved programs (easy to attend)
    const savedSchoolIds = savedPrograms.map(p => p.program?._schoolData?.id).filter(Boolean);
    futureEvents.forEach(event => {
      const matchesSaved = savedSchoolIds.some(id =>
        event.schoolId === `school_${id}` ||
        event.schoolId === id ||
        event.schoolId === String(id)
      ) || savedPrograms.some(p =>
        p.program?.schoolName?.toLowerCase() === event.schoolName?.toLowerCase()
      );

      if (event.isVirtual && matchesSaved && suggestions.virtualEvents.length < 2) {
        // Don't duplicate events already in target list
        const alreadyInTarget = suggestions.targetProgramEvents.some(e => e.id === event.id);
        if (!alreadyInTarget) {
          suggestions.virtualEvents.push({
            ...event,
            reason: 'Virtual - easy to attend',
          });
        }
      }
    });

    return suggestions;
  }, [targetPrograms, savedPrograms, userStates]);

  const hasAnySuggestions =
    suggestedEvents.targetProgramEvents.length > 0 ||
    suggestedEvents.stateMeetings.length > 0 ||
    suggestedEvents.virtualEvents.length > 0;

  if (!hasAnySuggestions && allUserPrograms.length === 0) {
    return (
      <Card className="p-4 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <h4 className="font-semibold text-gray-900">Suggested Events</h4>
        </div>
        <div className="text-center py-4">
          <Target className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500 mb-3">
            Save programs to see relevant events
          </p>
          <Button variant="outline" size="sm" onClick={onBrowseEvents}>
            Browse Events
          </Button>
        </div>
      </Card>
    );
  }

  if (!hasAnySuggestions) {
    return (
      <Card className="p-4 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <h4 className="font-semibold text-gray-900">Suggested Events</h4>
        </div>
        <div className="text-center py-4">
          <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500 mb-3">
            No upcoming events for your programs
          </p>
          <Button variant="outline" size="sm" onClick={onBrowseEvents}>
            Browse All Events
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-blue-500" />
        <h4 className="font-semibold text-gray-900">Suggested Events</h4>
      </div>
      <p className="text-xs text-gray-500 mb-3">Based on your saved programs</p>

      <div className="space-y-3">
        {/* Target Program Events */}
        {suggestedEvents.targetProgramEvents.length > 0 && (
          <div>
            <p className="text-xs font-medium text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-1">
              <Target className="w-3 h-3" />
              From Target Programs
            </p>
            {suggestedEvents.targetProgramEvents.map(event => (
              <SuggestedEventRow
                key={event.id}
                event={event}
                onSave={() => onSaveEvent(event)}
              />
            ))}
          </div>
        )}

        {/* State Meetings */}
        {suggestedEvents.stateMeetings.length > 0 && (
          <div>
            <p className="text-xs font-medium text-green-600 uppercase tracking-widest mb-2 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              AANA State Meetings
            </p>
            {suggestedEvents.stateMeetings.map(event => (
              <SuggestedEventRow
                key={event.id}
                event={event}
                onSave={() => onSaveEvent(event)}
              />
            ))}
          </div>
        )}

        {/* Virtual Events */}
        {suggestedEvents.virtualEvents.length > 0 && (
          <div>
            <p className="text-xs font-medium text-purple-600 uppercase tracking-widest mb-2 flex items-center gap-1">
              <Video className="w-3 h-3" />
              Virtual (Easy to Attend)
            </p>
            {suggestedEvents.virtualEvents.map(event => (
              <SuggestedEventRow
                key={event.id}
                event={event}
                onSave={() => onSaveEvent(event)}
              />
            ))}
          </div>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onBrowseEvents}
        className="w-full mt-3"
      >
        Browse All Events
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </Card>
  );
}

/**
 * Single suggested event row
 */
function SuggestedEventRow({ event, onSave }) {
  return (
    <div className="flex items-start gap-2 p-2 rounded-xl hover:bg-gray-50 transition-colors group mb-1">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
        {event.schoolName && (
          <p className="text-xs text-gray-500">{event.schoolName}</p>
        )}
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          {formatEventDate(event.date)}
          {event.isVirtual && (
            <span className="flex items-center gap-1 text-blue-600">
              <Video className="w-3 h-3" />
              Virtual
            </span>
          )}
        </div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={onSave}
        className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Plus className="w-3 h-3 mr-1" />
        Save
      </Button>
    </div>
  );
}

/**
 * Why This Matters coaching card - Sunset Glow theme
 */
function WhyItMattersCard() {
  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FCEFD0] to-[#FBE5E0] flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-[#8B4535]" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">
            Why log events?
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            Attending open houses and AANA meetings shows genuine interest.
            Use your notes for concrete interview stories and talking points.
          </p>
        </div>
      </div>
    </Card>
  );
}

/**
 * Event card in the log list
 */
function EventLogCard({ event, onEdit }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-white/20 hover:shadow-md transition-all">
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-gray-900 text-sm">{event.title}</span>
              <Badge variant="secondary" className="text-xs">
                {getCategoryLabel(event.category)}
              </Badge>
            </div>
            {event.schoolName && (
              <p className="text-xs text-gray-600 mt-0.5">{event.schoolName}</p>
            )}
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatEventDate(event.date)}
              </span>
              {event.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {event.location}
                </span>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-gray-500"
            onClick={() => onEdit(event)}
          >
            Edit
          </Button>
        </div>

        {event.structuredNotes?.standout && (
          <p className="mt-2 text-xs text-gray-600 line-clamp-2">
            {event.structuredNotes.standout}
          </p>
        )}

        {event.contacts?.length > 0 && (
          <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
            <Users className="w-3 h-3" />
            <span>{event.contacts.length} contacts</span>
          </div>
        )}
      </div>

      {event.structuredNotes && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-3 py-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50/50 flex items-center justify-center gap-1 rounded-b-2xl"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3 h-3" />
              Hide details
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              Show details
            </>
          )}
        </button>
      )}

      {expanded && event.structuredNotes && (
        <div className="px-3 pb-3 space-y-2 pt-2 bg-gray-50/50 rounded-b-2xl">
          {event.structuredNotes.learned && (
            <div>
              <span className="text-xs font-medium text-gray-500">What I learned:</span>
              <p className="text-xs text-gray-700">{event.structuredNotes.learned}</p>
            </div>
          )}
          {event.structuredNotes.peopleMet && (
            <div>
              <span className="text-xs font-medium text-gray-500">Who I met:</span>
              <p className="text-xs text-gray-700">{event.structuredNotes.peopleMet}</p>
            </div>
          )}
          {event.structuredNotes.wouldApply && (
            <div>
              <span className="text-xs font-medium text-gray-500">Would I apply?</span>
              <p className="text-xs text-gray-700">{event.structuredNotes.wouldApply}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Inline Event Entry Form (expandable, matches Clinical Tracker style)
 */
function InlineEventEntryForm({ onSubmit, onCancel, initialValues }) {
  return (
    <Card className="p-5 bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">
          {initialValues?.id ? 'Edit Event' : 'Log New Event'}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          Cancel
        </Button>
      </div>
      <StructuredNoteForm
        initialValues={initialValues || {}}
        isEditing={!!initialValues?.id}
        onSave={onSubmit}
        onCancel={onCancel}
      />
    </Card>
  );
}

/**
 * Main EventsTracker component
 */
export function EventsTracker() {
  const navigate = useNavigate();

  // Get user's programs from hook
  const { targetPrograms, savedPrograms } = usePrograms();

  // State
  const [events, setEvents] = useState(mockTrackedEvents);
  const [savedEvents, setSavedEvents] = useState(mockSavedEvents);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [prefilledEvent, setPrefilledEvent] = useState(null);

  // Prompt state hook for persistent dismissals
  const NUDGE_ID = 'events_log';
  const {
    getNudgeState,
    shouldShowNudge: checkNudgeVisibility,
    dismissNudge,
    snoozeNudge,
    permanentlyDismissNudge,
  } = usePromptState();

  // Computed data
  const upcomingEvents = useMemo(() => {
    return getUpcomingEventsHelper({ limit: 3, targetPrograms });
  }, [targetPrograms]);

  const readyToLogEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return savedEvents
      .filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate < today && !event.logged && !event.dismissed;
      })
      .filter(
        (saved) => !events.some(
          (logged) => logged.title === saved.title && logged.date === saved.date
        )
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [events, savedEvents]);

  // Determine if we should show the nudge
  // Conditions: have past events waiting to be logged
  // Hook handles: permanent dismiss, snooze, and 24-hour X-button dismiss
  const showNudge = useMemo(() => {
    if (!checkNudgeVisibility(NUDGE_ID)) return false;
    if (readyToLogEvents.length === 0) return false;
    return true;
  }, [checkNudgeVisibility, readyToLogEvents.length]);

  const nudgeState = getNudgeState(NUDGE_ID);

  const overallStats = useMemo(
    () => getOverallEngagementStats({ trackedEvents: events, savedEvents, targetPrograms }),
    [events, savedEvents, targetPrograms]
  );

  // Handlers
  const handleOpenNewForm = () => {
    setEditingEvent(null);
    setPrefilledEvent(null);
    setIsFormExpanded(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setPrefilledEvent(null);
    setIsFormExpanded(true);
  };

  const handleLogFromPrompt = (savedEvent) => {
    setEditingEvent(null);
    setPrefilledEvent({
      title: savedEvent.title,
      date: savedEvent.date,
      category: savedEvent.category,
      location: savedEvent.location,
      schoolId: savedEvent.schoolId,
      schoolName: savedEvent.schoolName,
    });
    setIsFormExpanded(true);
  };

  const handleDismissPrompt = (savedEvent) => {
    setSavedEvents((prev) =>
      prev.map((e) => (e.id === savedEvent.id ? { ...e, dismissed: true } : e))
    );
    toast('Event skipped', {
      description: savedEvent.title,
      action: {
        label: 'Undo',
        onClick: () => {
          setSavedEvents((prev) =>
            prev.map((e) => (e.id === savedEvent.id ? { ...e, dismissed: false } : e))
          );
          toast.success('Event restored');
        },
      },
    });
  };

  const handleSaveEvent = (formData) => {
    if (editingEvent) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editingEvent.id
            ? { ...e, ...formData, tags: [formData.category] }
            : e
        )
      );
    } else {
      const newEvent = {
        id: Date.now().toString(),
        ...formData,
        tags: [formData.category],
      };
      setEvents((prev) => [newEvent, ...prev]);

      if (prefilledEvent) {
        setSavedEvents((prev) =>
          prev.map((e) =>
            e.title === prefilledEvent.title && e.date === prefilledEvent.date
              ? { ...e, logged: true }
              : e
          )
        );
      }
    }

    setIsFormExpanded(false);
    setEditingEvent(null);
    setPrefilledEvent(null);
  };

  const handleCloseForm = () => {
    setIsFormExpanded(false);
    setEditingEvent(null);
    setPrefilledEvent(null);
  };

  const handleBrowseEvents = () => {
    navigate('/events');
  };

  const handleSaveSuggestedEvent = (event) => {
    setSavedEvents((prev) => [
      ...prev,
      { ...event, id: `saved_${Date.now()}`, savedAt: new Date().toISOString(), logged: false },
    ]);
    toast.success('Event saved!', { description: event.title });
  };

  // Nudge handlers
  const handleDismissNudge = () => {
    dismissNudge(NUDGE_ID); // Increments dismissCount and sets lastDismissedAt (24-hour dismiss)
  };

  // Snooze for 3 days
  const handleSnoozeNudge = () => {
    snoozeNudge(NUDGE_ID, 3);
  };

  const handlePermanentDismiss = () => {
    permanentlyDismissNudge(NUDGE_ID);
  };

  return (
    <div className="space-y-6">
      {/* Header - Sunset Glow theme */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FCEFD0] to-[#FBE5E0] flex items-center justify-center">
          <FileText className="w-6 h-6 text-[#8B4535]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Events & Notes</h2>
          <p className="text-sm text-gray-500">Connect with programs and build your network</p>
        </div>
      </div>

      {/* Event Entry Modal */}
      <Dialog open={isFormExpanded} onOpenChange={(open) => {
        if (!open) {
          handleCloseForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Edit Event' : 'Log New Event'}
            </DialogTitle>
          </DialogHeader>
          <StructuredNoteForm
            initialValues={editingEvent || prefilledEvent || {}}
            isEditing={!!editingEvent?.id}
            onSave={handleSaveEvent}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {/* Main Content Grid - Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Event List (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Primary CTA Button - Centered - Sunset Glow theme */}
          <div className="flex justify-center py-2">
            <Button
              onClick={handleOpenNewForm}
              size="lg"
              className="bg-gradient-to-r from-[#E89060] to-[#E07080] hover:from-[#D88050] hover:to-[#D06070] text-white shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Log Event
            </Button>
          </div>

          {/* Section Header */}
          <h3 className="font-semibold text-gray-900">Entries</h3>

          {events.length === 0 ? (
            <EmptyState
              icon={<FileText className="w-12 h-12 text-[#E89060]" />}
              title="Log your first event"
              description="Track the open houses, info sessions, and AANA meetings you attend. Your notes become interview prep gold."
              action={
                <Button
                  onClick={handleOpenNewForm}
                  className="bg-gradient-to-r from-[#E89060] to-[#E07080] hover:from-[#D88050] hover:to-[#D06070] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Log Event
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <EventLogCard
                  key={event.id}
                  event={event}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Sidebar (1/3) */}
        <div className="space-y-4 order-first lg:order-last">
          {/* Events Logged celebration card */}
          <EventsLoggedCard
            totalEvents={events.length}
            totalContacts={overallStats.totalContacts}
            onLogEvent={handleOpenNewForm}
          />

          {/* Ready to Log - Above Coming Up */}
          <ReadyToLogCard
            events={readyToLogEvents}
            onLogEvent={handleLogFromPrompt}
            onDismissEvent={handleDismissPrompt}
          />

          {/* Coming Up */}
          <ComingUpCard
            events={upcomingEvents}
            onBrowseEvents={handleBrowseEvents}
          />

          {/* Smart Event Suggestions */}
          <SmartEventSuggestionsCard
            targetPrograms={targetPrograms}
            savedPrograms={savedPrograms}
            onSaveEvent={handleSaveSuggestedEvent}
            onBrowseEvents={handleBrowseEvents}
          />

          {/* Why it matters - for new users */}
          {events.length < 2 && <WhyItMattersCard />}
        </div>
      </div>
    </div>
  );
}

export default EventsTracker;
