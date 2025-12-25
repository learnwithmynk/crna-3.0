/**
 * BookingsCalendarView Example
 *
 * Demonstrates usage of the BookingsCalendarView component
 * with various configurations and interaction handlers.
 */

import { useState } from 'react';
import { BookingsCalendarView } from './BookingsCalendarView';

// Example bookings data
const exampleBookings = [
  {
    id: 'booking-1',
    applicantName: 'Sarah Martinez',
    service: 'mock_interview',
    scheduledAt: new Date(2025, 0, 15, 14, 0), // Jan 15, 2025 2:00pm
    duration: 60,
  },
  {
    id: 'booking-2',
    applicantName: 'Michael Chen',
    service: 'essay_review',
    scheduledAt: new Date(2025, 0, 15, 10, 0), // Same day, different time
    duration: 30,
  },
  {
    id: 'booking-3',
    applicantName: 'Emily Rodriguez',
    service: 'coaching',
    scheduledAt: new Date(2025, 0, 18, 15, 30),
    duration: 45,
  },
  {
    id: 'booking-4',
    applicantName: 'David Lee',
    service: 'qa_call',
    scheduledAt: new Date(2025, 0, 22, 11, 0),
    duration: 30,
  },
  {
    id: 'booking-5',
    applicantName: 'Jennifer Kim',
    service: 'mock_interview',
    scheduledAt: new Date(2025, 0, 22, 16, 0), // Same day as booking-4
    duration: 60,
  },
  {
    id: 'booking-6',
    applicantName: 'Robert Johnson',
    service: 'essay_review',
    scheduledAt: new Date(2025, 0, 25, 9, 0),
    duration: 30,
  },
  {
    id: 'booking-7',
    applicantName: 'Amanda White',
    service: 'coaching',
    scheduledAt: new Date(2025, 0, 28, 13, 0),
    duration: 45,
  },
];

/**
 * Basic Example - Default usage with mock data
 */
export function BasicExample() {
  const handleBookingClick = (booking) => {
    alert(`Clicked booking: ${booking.applicantName} - ${booking.service}`);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 min-h-screen">
      <BookingsCalendarView
        bookings={exampleBookings}
        onBookingClick={handleBookingClick}
      />
    </div>
  );
}

/**
 * Interactive Example - With view toggle and state management
 */
export function InteractiveExample() {
  const [currentView, setCurrentView] = useState('month');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    console.log('Selected booking:', booking);
  };

  const handleViewChange = (newView) => {
    setCurrentView(newView);
    console.log('View changed to:', newView);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <BookingsCalendarView
          bookings={exampleBookings}
          onBookingClick={handleBookingClick}
          view={currentView}
          onViewChange={handleViewChange}
        />

        {/* Selected booking display */}
        {selectedBooking && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Selected Booking</h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-gray-600">Applicant:</dt>
              <dd className="font-medium">{selectedBooking.applicantName}</dd>
              <dt className="text-gray-600">Service:</dt>
              <dd className="font-medium">{selectedBooking.service}</dd>
              <dt className="text-gray-600">Time:</dt>
              <dd className="font-medium">
                {new Date(selectedBooking.scheduledAt).toLocaleString()}
              </dd>
              <dt className="text-gray-600">Duration:</dt>
              <dd className="font-medium">{selectedBooking.duration} minutes</dd>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Empty State Example - Calendar with no bookings
 */
export function EmptyStateExample() {
  return (
    <div className="p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 min-h-screen">
      <BookingsCalendarView
        bookings={[]}
        onBookingClick={(booking) => console.log('Booking clicked:', booking)}
      />
    </div>
  );
}

/**
 * Busy Day Example - Multiple bookings on same day
 */
export function BusyDayExample() {
  const busyDayBookings = [
    {
      id: 'busy-1',
      applicantName: 'Person A',
      service: 'mock_interview',
      scheduledAt: new Date(2025, 0, 20, 9, 0),
      duration: 60,
    },
    {
      id: 'busy-2',
      applicantName: 'Person B',
      service: 'essay_review',
      scheduledAt: new Date(2025, 0, 20, 11, 0),
      duration: 30,
    },
    {
      id: 'busy-3',
      applicantName: 'Person C',
      service: 'coaching',
      scheduledAt: new Date(2025, 0, 20, 13, 0),
      duration: 45,
    },
    {
      id: 'busy-4',
      applicantName: 'Person D',
      service: 'qa_call',
      scheduledAt: new Date(2025, 0, 20, 15, 0),
      duration: 30,
    },
    {
      id: 'busy-5',
      applicantName: 'Person E',
      service: 'mock_interview',
      scheduledAt: new Date(2025, 0, 20, 16, 0),
      duration: 60,
    },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 min-h-screen">
      <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> This example shows a day with 5 bookings. The calendar
          displays the first 3 bookings and shows "+2 more" indicator.
        </p>
      </div>
      <BookingsCalendarView
        bookings={busyDayBookings}
        onBookingClick={(booking) => console.log('Booking clicked:', booking)}
      />
    </div>
  );
}

/**
 * Default export - Shows the interactive example
 */
export default function BookingsCalendarViewExample() {
  return <InteractiveExample />;
}
