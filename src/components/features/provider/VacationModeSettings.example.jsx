/**
 * VacationModeSettings Example Usage
 *
 * Demonstrates the VacationModeSettings component with mock data
 * and state management.
 */

import React, { useState } from 'react';
import { VacationModeSettings } from './VacationModeSettings';

// Mock existing bookings during vacation period
const MOCK_BOOKINGS = [
  {
    id: 'booking-1',
    applicantName: 'Sarah Johnson',
    applicantAvatar: null,
    service: 'Mock Interview Session',
    date: new Date('2024-12-20'),
    time: '2:00 PM EST',
    status: 'confirmed'
  },
  {
    id: 'booking-2',
    applicantName: 'Emily Chen',
    applicantAvatar: null,
    service: 'Essay Review',
    date: new Date('2024-12-22'),
    time: '10:00 AM EST',
    status: 'confirmed'
  },
  {
    id: 'booking-3',
    applicantName: 'Rachel Martinez',
    applicantAvatar: null,
    service: '1:1 Coaching Call',
    date: new Date('2024-12-28'),
    time: '3:30 PM EST',
    status: 'confirmed'
  }
];

export function VacationModeSettingsExample() {
  // State management
  const [isPaused, setIsPaused] = useState(false);
  const [vacationStart, setVacationStart] = useState(null);
  const [vacationEnd, setVacationEnd] = useState(null);
  const [autoResponseMessage, setAutoResponseMessage] = useState(
    "Hi! Thanks for reaching out. I'm currently on vacation until January 5th and unavailable for new bookings. I'll be back then and would love to work with you!"
  );

  // Handle pause toggle
  const handlePausedChange = (checked) => {
    setIsPaused(checked);
    console.log('Pause toggled:', checked);
  };

  // Handle vacation dates change
  const handleVacationDatesChange = (start, end) => {
    setVacationStart(start);
    setVacationEnd(end);
    console.log('Vacation dates changed:', { start, end });
  };

  // Handle auto-response message change
  const handleAutoResponseChange = (message) => {
    setAutoResponseMessage(message);
    console.log('Auto-response updated:', message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Provider Settings
          </h1>
          <p className="text-gray-600">
            Manage your marketplace availability and vacation mode
          </p>
        </div>

        <VacationModeSettings
          isPaused={isPaused}
          onPausedChange={handlePausedChange}
          vacationStart={vacationStart}
          vacationEnd={vacationEnd}
          onVacationDatesChange={handleVacationDatesChange}
          autoResponseMessage={autoResponseMessage}
          onAutoResponseChange={handleAutoResponseChange}
          bookingsDuringPause={isPaused ? MOCK_BOOKINGS : []}
        />

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-white border border-gray-200 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">Debug Info</h3>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify(
              {
                isPaused,
                vacationStart: vacationStart?.toISOString(),
                vacationEnd: vacationEnd?.toISOString(),
                autoResponseLength: autoResponseMessage.length,
                bookingsCount: isPaused ? MOCK_BOOKINGS.length : 0
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default VacationModeSettingsExample;
