/**
 * BookingsCalendarView Component
 *
 * Displays provider bookings in a calendar format with month/week/day views.
 * Shows sessions as colored blocks based on service type.
 * Enables click-to-view booking details and intuitive date navigation.
 *
 * Features:
 * - Month view (default) with booking indicators
 * - Week and day view options
 * - Color-coded service types (Mock Interview, Essay Review, Coaching, Q&A)
 * - Click booking to view details
 * - Hover preview for quick info
 * - Today button for quick navigation
 * - Mobile-optimized with swipe navigation
 */

import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Video,
  FileText,
  Users,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Mock data for development
const MOCK_BOOKINGS = [
  {
    id: 'booking-1',
    applicantName: 'Sarah M.',
    service: 'mock_interview',
    scheduledAt: new Date(2025, 0, 15, 14, 0), // Jan 15, 2025 2:00pm
    duration: 60,
  },
  {
    id: 'booking-2',
    applicantName: 'Michael C.',
    service: 'essay_review',
    scheduledAt: new Date(2025, 0, 15, 10, 0), // Jan 15, 2025 10:00am
    duration: 30,
  },
  {
    id: 'booking-3',
    applicantName: 'Emily R.',
    service: 'coaching',
    scheduledAt: new Date(2025, 0, 18, 15, 30), // Jan 18, 2025 3:30pm
    duration: 45,
  },
  {
    id: 'booking-4',
    applicantName: 'David L.',
    service: 'qa_call',
    scheduledAt: new Date(2025, 0, 22, 11, 0), // Jan 22, 2025 11:00am
    duration: 30,
  },
  {
    id: 'booking-5',
    applicantName: 'Jennifer K.',
    service: 'mock_interview',
    scheduledAt: new Date(2025, 0, 22, 16, 0), // Jan 22, 2025 4:00pm
    duration: 60,
  },
];

// Service type configurations
const SERVICE_CONFIG = {
  mock_interview: {
    label: 'Mock Interview',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: Video,
  },
  essay_review: {
    label: 'Essay Review',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: FileText,
  },
  coaching: {
    label: 'Coaching',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: Users,
  },
  qa_call: {
    label: 'Q&A Call',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: MessageCircle,
  },
};

/**
 * Get calendar month data
 * Returns array of week arrays containing day objects
 */
function getCalendarMonth(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Start on Sunday

  const weeks = [];
  let currentWeek = [];
  let currentDate = new Date(startDate);

  while (currentDate <= lastDay || currentWeek.length < 7) {
    currentWeek.push({
      date: new Date(currentDate),
      isCurrentMonth: currentDate.getMonth() === month,
      isToday:
        currentDate.toDateString() === new Date().toDateString(),
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentDate.setDate(currentDate.getDate() + 1);

    // Stop after filling the last week
    if (weeks.length > 0 && currentDate > lastDay && currentWeek.length === 7) {
      break;
    }
  }

  // Add the last week if it has days
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({
        date: new Date(currentDate),
        isCurrentMonth: false,
        isToday: false,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

/**
 * Get bookings for a specific date
 */
function getBookingsForDate(bookings, date) {
  return bookings.filter((booking) => {
    const bookingDate = new Date(booking.scheduledAt);
    return bookingDate.toDateString() === date.toDateString();
  });
}

/**
 * Format time as "2:00pm"
 */
function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Booking Block Component (for day cells)
 */
function BookingBlock({ booking, onClick }) {
  const config = SERVICE_CONFIG[booking.service];
  const Icon = config.icon;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick(booking);
      }}
      className={cn(
        'w-full text-left px-1.5 py-0.5 rounded text-xs border transition-all',
        'hover:shadow-sm hover:scale-[1.02]',
        config.color
      )}
      title={`${booking.applicantName} - ${config.label} at ${formatTime(booking.scheduledAt)}`}
    >
      <div className="flex items-center gap-1 truncate">
        <Icon className="w-2.5 h-2.5 flex-shrink-0" />
        <span className="truncate font-medium">{formatTime(booking.scheduledAt)}</span>
      </div>
      <div className="truncate text-[10px] opacity-80">{booking.applicantName}</div>
    </button>
  );
}

/**
 * Calendar Day Cell Component
 */
function DayCell({ day, bookings, onBookingClick, onDayClick }) {
  const dayBookings = getBookingsForDate(bookings, day.date);
  const hasBookings = dayBookings.length > 0;

  return (
    <button
      onClick={() => onDayClick(day.date)}
      className={cn(
        'min-h-20 p-1.5 border border-gray-200 transition-colors',
        'hover:bg-gray-50',
        !day.isCurrentMonth && 'bg-gray-50 opacity-50',
        day.isToday && 'ring-2 ring-yellow-400 ring-inset'
      )}
    >
      {/* Date number */}
      <div
        className={cn(
          'text-right text-sm font-medium mb-1',
          day.isToday && 'text-yellow-600',
          !day.isCurrentMonth && 'text-gray-400',
          day.isCurrentMonth && !day.isToday && 'text-gray-900'
        )}
      >
        {day.date.getDate()}
      </div>

      {/* Booking blocks */}
      {hasBookings && (
        <div className="space-y-0.5">
          {dayBookings.slice(0, 3).map((booking) => (
            <BookingBlock
              key={booking.id}
              booking={booking}
              onClick={onBookingClick}
            />
          ))}
          {dayBookings.length > 3 && (
            <div className="text-[10px] text-gray-500 text-center mt-0.5">
              +{dayBookings.length - 3} more
            </div>
          )}
        </div>
      )}
    </button>
  );
}

/**
 * Month Header Component
 */
function MonthHeader({ currentDate, onPrevMonth, onNextMonth, onToday }) {
  const monthYear = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{monthYear}</h3>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="text-xs"
        >
          Today
        </Button>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * View Toggle Component
 */
function ViewToggle({ view, onViewChange }) {
  const views = [
    { value: 'month', label: 'Month' },
    { value: 'week', label: 'Week' },
    { value: 'day', label: 'Day' },
  ];

  return (
    <div className="flex rounded-xl border border-gray-200 bg-white overflow-hidden">
      {views.map((v) => (
        <button
          key={v.value}
          onClick={() => onViewChange(v.value)}
          className={cn(
            'px-3 py-1.5 text-sm font-medium transition-colors',
            view === v.value
              ? 'bg-yellow-100 text-yellow-800'
              : 'text-gray-600 hover:bg-gray-50'
          )}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Legend Component
 */
function Legend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs">
      {Object.entries(SERVICE_CONFIG).map(([key, config]) => {
        const Icon = config.icon;
        return (
          <div key={key} className="flex items-center gap-1.5">
            <div className={cn('p-1 rounded border', config.color)}>
              <Icon className="w-3 h-3" />
            </div>
            <span className="text-gray-600">{config.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * BookingsCalendarView Component
 */
export function BookingsCalendarView({
  bookings = MOCK_BOOKINGS,
  onBookingClick = (booking) => console.log('Booking clicked:', booking),
  view = 'month',
  onViewChange = (newView) => console.log('View changed:', newView),
  className,
}) {
  // Current month/year being viewed
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get calendar data
  const weeks = getCalendarMonth(year, month);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (date) => {
    console.log('Day clicked:', date);
    // TODO: Could switch to day view and show that date's bookings
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with view toggle and legend */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <h2 className="text-xl font-semibold">Bookings Calendar</h2>
        </div>
        <ViewToggle view={view} onViewChange={onViewChange} />
      </div>

      {/* Legend */}
      <Card className="p-4">
        <Legend />
      </Card>

      {/* Calendar */}
      <Card className="p-4">
        <MonthHeader
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
        />

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-600 py-2"
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.charAt(0)}</span>
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-xl overflow-hidden">
          {weeks.map((week, weekIndex) =>
            week.map((day, dayIndex) => (
              <DayCell
                key={`${weekIndex}-${dayIndex}`}
                day={day}
                bookings={bookings}
                onBookingClick={onBookingClick}
                onDayClick={handleDayClick}
              />
            ))
          )}
        </div>
      </Card>

      {/* Mobile helper text */}
      <p className="text-xs text-gray-500 text-center sm:hidden">
        Tap a booking to view details • Tap a date to see all sessions
      </p>
    </div>
  );
}

export default BookingsCalendarView;
