/**
 * CalendarWidget - Dashboard calendar showing events
 *
 * Features:
 * - Mini month view with event dots
 * - Toggle between calendar and list view
 * - Add custom events (Shadow Day, Work Shift, Interview, etc.)
 * - Auto-populated events: CRNA Club (yellow), Target deadlines (red), Marketplace (purple)
 * - Scrollable upcoming events list
 * - Delete user-created events
 *
 * Event Types & Colors:
 * - crna_club: Yellow - Auto from CRNA Club events
 * - deadline: Red - Auto from target program deadlines
 * - school_event: Blue - Saved school events
 * - shadow_day: Orange - User-added shadow experiences
 * - work_shift: Green - User-added work schedule
 * - interview: Teal - User-added interviews
 * - marketplace: Purple - Auto from marketplace bookings
 * - other: Gray - User-added misc events
 *
 * Integration:
 * - Shadow Day events flow to ShadowDaysTracker "Ready to Log" when date passes
 * - Events trigger Smart Nudge system for logging reminders
 */

import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar as CalendarIcon,
  List,
  ChevronLeft,
  ChevronRight,
  Plus,
  MapPin,
  Trash2,
  Target,
  Briefcase,
  HelpCircle,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { LabelText, SectionHeader, ActionLink } from '@/components/ui/label-text';

// TODO: Replace with API call
import { mockCalendarEvents as initialMockEvents } from '@/data/mockActivity';

// Event type colors
const EVENT_COLORS = {
  crna_club: 'bg-yellow-400',      // Yellow - CRNA Club events
  deadline: 'bg-red-500',           // Red - Target program deadlines
  school_event: 'bg-blue-500',      // Blue - School events
  shadow_day: 'bg-orange-500',      // Orange - Shadow days
  work_shift: 'bg-green-500',       // Green - Work schedule
  interview: 'bg-teal-500',         // Teal - Interviews
  marketplace: 'bg-purple-500',     // Purple - Marketplace appointments
  saved: 'bg-blue-500',             // Blue - Legacy saved (maps to school_event)
  other: 'bg-gray-400',             // Gray - Other events
};

// Event type labels
const EVENT_LABELS = {
  crna_club: 'CRNA Club',
  deadline: 'Deadline',
  school_event: 'School Event',
  shadow_day: 'Shadow Day',
  work_shift: 'Work Shift',
  interview: 'Interview',
  marketplace: 'Appointment',
  saved: 'Saved',
  other: 'Other',
};

// Event types users can add
const EVENT_TYPES_FOR_ADD = [
  { value: 'shadow_day', label: 'Shadow Day', color: 'orange' },
  { value: 'work_shift', label: 'Work Shift', color: 'green' },
  { value: 'interview', label: 'Interview', color: 'teal' },
  { value: 'school_event', label: 'School Event', color: 'blue' },
  { value: 'other', label: 'Other', color: 'gray' },
];

// Which event types can be deleted by user
const DELETABLE_EVENT_TYPES = ['shadow_day', 'work_shift', 'interview', 'school_event', 'other', 'saved'];

export function CalendarWidget({ targetPrograms = [], onEventAdded }) {
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [userEvents, setUserEvents] = useState(initialMockEvents);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState(null);

  // Add event form state
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    type: 'shadow_day',
    location: '',
  });

  // Generate deadline events from target programs
  const deadlineEvents = useMemo(() => {
    return targetPrograms
      .filter(tp => tp.program?.applicationDeadline)
      .map(tp => ({
        id: `deadline_${tp.id}`,
        title: `${tp.program.schoolName} Deadline`,
        date: tp.program.applicationDeadline,
        type: 'deadline',
        url: `/my-programs/${tp.id}`,
        userCreated: false,
        programId: tp.id,
      }));
  }, [targetPrograms]);

  // TODO: Add CRNA Club events from API
  const crnaClubEvents = useMemo(() => {
    // Filter existing mock events that are crna_club type
    return userEvents.filter(e => e.type === 'crna_club');
  }, [userEvents]);

  // Combine all events
  const allEvents = useMemo(() => {
    // User events (excluding crna_club which we handle separately)
    const userOnly = userEvents.filter(e => e.type !== 'crna_club');
    return [...userOnly, ...deadlineEvents, ...crnaClubEvents];
  }, [userEvents, deadlineEvents, crnaClubEvents]);

  // Get calendar data
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingDayOfWeek = new Date(year, month, 1).getDay();

  // Navigate months
  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  // Get events for a specific date
  const getEventsForDate = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return allEvents.filter(event => event.date.startsWith(dateStr));
  };

  // Get all upcoming events (for list view)
  const upcomingEvents = useMemo(() => {
    return allEvents
      .filter(event => new Date(event.date) >= new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [allEvents]);

  // Get events for selected date
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  // Format date for display
  const formatEventDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Check if event is deletable
  const canDeleteEvent = (event) => {
    return event.userCreated || DELETABLE_EVENT_TYPES.includes(event.type);
  };

  // Handle adding new event
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      toast.error('Please fill in required fields');
      return;
    }

    const dateTime = newEvent.time
      ? `${newEvent.date}T${newEvent.time}:00Z`
      : `${newEvent.date}T09:00:00Z`;

    const eventToAdd = {
      id: `cal_${Date.now()}`,
      title: newEvent.title,
      date: dateTime,
      type: newEvent.type,
      location: newEvent.location || null,
      url: '#',
      userCreated: true,
      trackerType: newEvent.type === 'shadow_day' ? 'shadow' : null,
    };

    setUserEvents(prev => [...prev, eventToAdd]);

    // Notify parent component (for tracker integration)
    if (onEventAdded) {
      onEventAdded(eventToAdd);
    }

    // Show success message with context
    const messages = {
      shadow_day: {
        title: 'Shadow day scheduled!',
        description: 'This will appear in your Shadow Days Tracker when the date passes.',
      },
      work_shift: {
        title: 'Work shift added!',
        description: 'Your schedule has been updated.',
      },
      interview: {
        title: 'Interview scheduled!',
        description: "We'll remind you to prepare.",
      },
    };

    const msg = messages[newEvent.type];
    if (msg) {
      toast.success(msg.title, { description: msg.description });
    } else {
      toast.success('Event added to calendar');
    }

    // Reset form
    setNewEvent({
      title: '',
      date: '',
      time: '',
      type: 'shadow_day',
      location: '',
    });
    setIsAddEventOpen(false);
  };

  // Handle delete event
  const handleDeleteEvent = () => {
    if (!deletingEvent) return;

    setUserEvents(prev => prev.filter(e => e.id !== deletingEvent.id));
    toast.success('Event removed from calendar');
    setDeletingEvent(null);
  };

  // Render calendar grid
  const renderCalendarGrid = () => {
    const days = [];
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    // Day headers - single letter like in reference
    const headers = dayNames.map((day, i) => (
      <div key={i} className="text-center text-xs font-medium text-gray-400 py-1.5">
        {day}
      </div>
    ));

    // Empty cells before first day
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-1" />);
    }

    // Days of the month
    const today = new Date();
    const isToday = (day) =>
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year;

    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);
      const hasEvents = dayEvents.length > 0;
      const isSelected = selectedDate === day;

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(day)}
          className="relative flex flex-col items-center justify-center py-2 transition-colors hover:bg-gray-50 rounded-xl"
        >
          {/* Day number - today gets filled purple circle */}
          <span
            className={`
              w-8 h-8 flex items-center justify-center text-sm rounded-full transition-colors
              ${isToday(day)
                ? 'bg-primary text-white font-semibold'
                : isSelected
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-gray-700'
              }
            `}
          >
            {day}
          </span>
          {/* Event dot - small and subtle, positioned below the number */}
          {hasEvents && (
            <span
              className={`absolute bottom-1 w-1 h-1 rounded-full ${
                dayEvents[0].type === 'deadline'
                  ? 'bg-red-400'
                  : 'bg-primary/60'
              }`}
            />
          )}
        </button>
      );
    }

    return (
      <div>
        <div className="grid grid-cols-7">{headers}</div>
        <div className="grid grid-cols-7">{days}</div>
      </div>
    );
  };

  // Get label color classes for event types
  const getEventLabelColors = (type) => {
    const colors = {
      crna_club: 'text-yellow-600',
      deadline: 'text-red-500',
      school_event: 'text-blue-500',
      shadow_day: 'text-orange-500',
      work_shift: 'text-green-500',
      interview: 'text-teal-500',
      marketplace: 'text-purple-500',
      saved: 'text-blue-500',
      other: 'text-gray-500',
    };
    return colors[type] || colors.other;
  };

  // Render event list (scrollable)
  const renderEventList = (eventsList, showDate = true) => (
    <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pr-1">
      {eventsList.map((event) => (
        <div
          key={event.id}
          className="group relative p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
        >
          {/* Event type label with dot */}
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full shrink-0 ${EVENT_COLORS[event.type] || EVENT_COLORS.other}`} />
            <LabelText className={getEventLabelColors(event.type)}>
              {EVENT_LABELS[event.type] || 'Event'}
            </LabelText>
          </div>

          {/* Event title */}
          <p className="font-bold text-base text-gray-900 mb-2">{event.title}</p>

          {/* View details link */}
          <ActionLink href={event.url || '#'}>
            Event Details
          </ActionLink>

          {/* Delete button for user-created events */}
          {canDeleteEvent(event) && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDeletingEvent(event);
              }}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
              title="Remove from calendar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      {eventsList.length === 0 && (
        <div className="text-center py-6">
          <CalendarIcon className="w-10 h-10 text-gray-200 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No events scheduled</p>
        </div>
      )}
    </div>
  );

  return (
    <TooltipProvider>
    <div className="bg-white rounded-[2.5rem] border border-gray-50 overflow-hidden mb-4">
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <Tooltip>
            <TooltipTrigger asChild>
              <h3 className="flex items-center gap-3 text-xl font-bold text-gray-900 cursor-help">
                <CalendarIcon className="w-5 h-5 text-gray-600" />
                Schedule
              </h3>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start" className="max-w-xs p-3">
              <p className="font-medium mb-2">What shows here:</p>
              <ul className="text-xs space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  CRNA Club events (auto)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  Target program deadlines (auto)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Saved/target school events
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Marketplace appointments (auto)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  Shadow days you add
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Work shifts you add
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  Interviews
                </li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">
                Click + to add your own events
              </p>
            </TooltipContent>
          </Tooltip>
          {/* Add Event Button - square with rounded corners, yellow like reference */}
          <Button
            size="sm"
            className="h-9 w-9 p-0 rounded-xl bg-amber-400 hover:bg-amber-500 text-gray-900"
            onClick={() => setIsAddEventOpen(true)}
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
          </Button>
        </div>
      </div>
      <div className="px-6 pb-6">
        {viewMode === 'calendar' ? (
          <>
            {/* Month Navigation - cleaner style */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-base font-bold text-gray-900">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrevMonth}
                  className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={goToNextMonth}
                  className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            {renderCalendarGrid()}

            {/* Selected Date Events - only show when there are events */}
            {selectedDate && selectedDateEvents.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <SectionHeader className="mb-4">
                  Events on {new Date(year, month, selectedDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  }).toUpperCase()}
                </SectionHeader>
                {renderEventList(selectedDateEvents, false)}
              </div>
            )}
          </>
        ) : (
          <>
            {/* List View - Scrollable */}
            <p className="text-xs font-medium text-gray-500 mb-2">
              Upcoming Events ({upcomingEvents.length})
            </p>
            {renderEventList(upcomingEvents)}
          </>
        )}

        {/* Event Legend - 2 column grid like reference */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <LabelText>Club</LabelText>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <LabelText>Deadline</LabelText>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <LabelText>Shadow</LabelText>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <LabelText>Work</LabelText>
          </div>
        </div>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Event</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Event Type */}
            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select
                value={newEvent.type}
                onValueChange={(value) => setNewEvent(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES_FOR_ADD.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${EVENT_COLORS[type.value]}`} />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {newEvent.type === 'shadow_day' && (
                <p className="text-xs text-orange-600">
                  Shadow days will appear in your Shadow Days Tracker for logging after the date passes.
                </p>
              )}
              {newEvent.type === 'work_shift' && (
                <p className="text-xs text-green-600">
                  Track your work schedule to help plan around clinical hours.
                </p>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="event-title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="event-title"
                value={newEvent.title}
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                placeholder={
                  newEvent.type === 'shadow_day'
                    ? 'e.g., Shadow at Kaiser Permanente'
                    : newEvent.type === 'interview'
                    ? 'e.g., Georgetown Interview'
                    : newEvent.type === 'work_shift'
                    ? 'e.g., Day Shift - ICU'
                    : 'Event title'
                }
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="event-date">
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="event-date"
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label htmlFor="event-time">Time (optional)</Label>
              <Input
                id="event-time"
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="event-location">
                Location
                {newEvent.type === 'shadow_day' && <span className="text-gray-400 ml-1">(Hospital name)</span>}
                {newEvent.type === 'work_shift' && <span className="text-gray-400 ml-1">(Unit/Floor)</span>}
              </Label>
              <Input
                id="event-location"
                value={newEvent.location}
                onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                placeholder={
                  newEvent.type === 'shadow_day'
                    ? 'e.g., Duke University Hospital'
                    : newEvent.type === 'work_shift'
                    ? 'e.g., MICU, Floor 3'
                    : 'Location or virtual'
                }
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddEvent}
              disabled={!newEvent.title || !newEvent.date}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingEvent}
        onOpenChange={(open) => !open && setDeletingEvent(null)}
        title="Remove Event?"
        description={`Remove "${deletingEvent?.title}" from your calendar?`}
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={handleDeleteEvent}
      />
    </div>
    </TooltipProvider>
  );
}
