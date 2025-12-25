/**
 * BlockedDatesCalendar Example
 *
 * Demonstrates how to use the BlockedDatesCalendar component
 * with mock data for providers managing unavailable dates.
 */

import { useState } from 'react';
import { BlockedDatesCalendar } from './BlockedDatesCalendar';

// Mock blocked dates
const MOCK_BLOCKED_DATES = [
  {
    id: '1',
    startDate: '2024-12-20',
    endDate: '2024-12-27',
    reason: 'Winter Holiday Break'
  },
  {
    id: '2',
    startDate: '2025-01-15',
    endDate: '2025-01-17',
    reason: 'AANA Conference'
  },
  {
    id: '3',
    startDate: '2025-02-10',
    endDate: null, // Single day
    reason: 'Personal Day'
  },
  {
    id: '4',
    startDate: '2025-03-05',
    endDate: '2025-03-12',
    reason: 'Spring Break Vacation'
  }
];

export function BlockedDatesCalendarExample() {
  const [blockedDates, setBlockedDates] = useState(MOCK_BLOCKED_DATES);

  const handleAddBlockedDate = (startDate, endDate, reason) => {
    const newBlockedDate = {
      id: `temp-${Date.now()}`, // In real app, this would come from API
      startDate,
      endDate,
      reason
    };

    setBlockedDates([...blockedDates, newBlockedDate]);

    console.log('Adding blocked date:', {
      startDate,
      endDate,
      reason
    });

    // TODO: Replace with API call
    // await api.blockedDates.create({ startDate, endDate, reason });
  };

  const handleRemoveBlockedDate = (id) => {
    setBlockedDates(blockedDates.filter(date => date.id !== id));

    console.log('Removing blocked date:', id);

    // TODO: Replace with API call
    // await api.blockedDates.delete(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Blocked Dates Calendar
          </h1>
          <p className="text-gray-600">
            Example of the BlockedDatesCalendar component for provider availability management.
          </p>
        </div>

        <BlockedDatesCalendar
          blockedDates={blockedDates}
          onAddBlockedDate={handleAddBlockedDate}
          onRemoveBlockedDate={handleRemoveBlockedDate}
        />

        {/* Developer Info */}
        <div className="mt-8 p-4 bg-white rounded-xl border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Developer Notes:</h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Component supports both single-day and date-range blocking</li>
            <li>Reason field is optional but recommended for clarity</li>
            <li>Automatically calculates and displays total blocked days</li>
            <li>Prevents end date from being before start date</li>
            <li>Prevents selecting dates in the past</li>
            <li>Shows empty state when no blocked dates exist</li>
            <li>Sorts blocked dates chronologically</li>
          </ul>
        </div>

        {/* API Integration Notes */}
        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">API Integration:</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>Add Blocked Date:</strong></p>
            <pre className="bg-blue-100 p-2 rounded text-xs overflow-x-auto">
{`POST /api/providers/{providerId}/blocked-dates
{
  "startDate": "2024-12-20",
  "endDate": "2024-12-27",
  "reason": "Winter Holiday Break"
}`}
            </pre>

            <p className="pt-2"><strong>Remove Blocked Date:</strong></p>
            <pre className="bg-blue-100 p-2 rounded text-xs overflow-x-auto">
{`DELETE /api/providers/{providerId}/blocked-dates/{id}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlockedDatesCalendarExample;
