/**
 * WeeklyAvailabilityGrid Component
 *
 * Reusable weekly availability schedule editor.
 * Used in both ProviderOnboardingPage and ProviderAvailabilityPage.
 *
 * Features:
 * - Day-by-day availability with multiple time blocks
 * - Add/remove time slots per day
 * - Copy to all days function
 * - Visual indicators for available vs unavailable days
 */

import { useState } from 'react';
import {
  Calendar,
  Plus,
  Trash2,
  Copy,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Days of the week
const DAYS = [
  { value: 'monday', label: 'Monday', short: 'Mon' },
  { value: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { value: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { value: 'thursday', label: 'Thursday', short: 'Thu' },
  { value: 'friday', label: 'Friday', short: 'Fri' },
  { value: 'saturday', label: 'Saturday', short: 'Sat' },
  { value: 'sunday', label: 'Sunday', short: 'Sun' }
];

// Time options (24-hour format for internal use)
const TIME_OPTIONS = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
];

// Convert 24h to 12h format for display
function formatTime12h(time24) {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

// Individual day availability card
function DayAvailabilityCard({ day, blocks = [], onChange, compact = false }) {
  const hasBlocks = blocks.length > 0;

  const addBlock = () => {
    onChange([...blocks, { start: '09:00', end: '17:00' }]);
  };

  const removeBlock = (index) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const updateBlock = (index, field, value) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], [field]: value };
    onChange(newBlocks);
  };

  if (compact) {
    return (
      <div className={cn(
        'border rounded-xl p-3 transition-all',
        hasBlocks ? 'border-primary/30 bg-primary/5' : 'border-gray-200 bg-gray-50'
      )}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              hasBlocks ? 'bg-green-500' : 'bg-gray-300'
            )} />
            <span className="font-medium text-sm text-gray-900">{day.short}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addBlock}
            className="h-7 px-2"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        {blocks.length === 0 ? (
          <p className="text-xs text-gray-400">Unavailable</p>
        ) : (
          <div className="space-y-1">
            {blocks.map((block, index) => (
              <div key={index} className="flex items-center gap-1 text-xs">
                <span className="text-gray-600">
                  {formatTime12h(block.start)} - {formatTime12h(block.end)}
                </span>
                <button
                  type="button"
                  onClick={() => removeBlock(index)}
                  className="text-red-400 hover:text-red-600 ml-auto"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={cn(
      'border-2 transition-all',
      hasBlocks ? 'border-primary/30 bg-primary/5' : 'border-gray-200'
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              hasBlocks ? 'bg-green-500' : 'bg-gray-300'
            )} />
            <Label className="text-base font-semibold text-gray-900">
              {day.label}
            </Label>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addBlock}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Time
          </Button>
        </div>

        {blocks.length === 0 ? (
          <p className="text-sm text-gray-500 italic">Not available</p>
        ) : (
          <div className="space-y-2">
            {blocks.map((block, index) => (
              <div key={index} className="flex items-center gap-2">
                <Select
                  value={block.start}
                  onValueChange={(value) => updateBlock(index, 'start', value)}
                >
                  <SelectTrigger className="bg-white flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OPTIONS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {formatTime12h(time)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <span className="text-gray-500 shrink-0">to</span>

                <Select
                  value={block.end}
                  onValueChange={(value) => updateBlock(index, 'end', value)}
                >
                  <SelectTrigger className="bg-white flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OPTIONS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {formatTime12h(time)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeBlock(index)}
                  className="shrink-0"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function WeeklyAvailabilityGrid({
  availability = {},
  onChange,
  compact = false,
  showCopyButton = true
}) {
  // Update availability for a specific day
  const handleDayChange = (day, blocks) => {
    onChange({
      ...availability,
      [day]: blocks
    });
  };

  // Copy first available day to all days
  const copyToAllDays = () => {
    const sourceDay = DAYS.find(day => availability[day.value]?.length > 0);
    if (!sourceDay) return;

    const sourceBlocks = availability[sourceDay.value];
    const newAvailability = {};
    DAYS.forEach(day => {
      newAvailability[day.value] = sourceBlocks.map(b => ({ ...b }));
    });
    onChange(newAvailability);
  };

  // Check if any day has availability
  const hasAnyAvailability = DAYS.some(
    day => availability[day.value]?.length > 0
  );

  // Count available days
  const availableDaysCount = DAYS.filter(
    day => availability[day.value]?.length > 0
  ).length;

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {availableDaysCount} days available
            </span>
          </div>
          {showCopyButton && hasAnyAvailability && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={copyToAllDays}
              className="h-7"
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy to All
            </Button>
          )}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((day) => (
            <DayAvailabilityCard
              key={day.value}
              day={day}
              blocks={availability[day.value] || []}
              onChange={(blocks) => handleDayChange(day.value, blocks)}
              compact
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          <Label className="text-base font-semibold">Weekly Availability</Label>
        </div>
        {showCopyButton && hasAnyAvailability && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copyToAllDays}
          >
            <Copy className="w-4 h-4 mr-1" />
            Copy to All Days
          </Button>
        )}
      </div>

      <p className="text-sm text-gray-500">
        Set the hours you're available for bookings each day. You can have multiple time blocks per day.
      </p>

      <div className="space-y-3">
        {DAYS.map((day) => (
          <DayAvailabilityCard
            key={day.value}
            day={day}
            blocks={availability[day.value] || []}
            onChange={(blocks) => handleDayChange(day.value, blocks)}
          />
        ))}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <span>Not available</span>
        </div>
      </div>
    </div>
  );
}

// Export the DAYS constant for use in other components
export { DAYS };

export default WeeklyAvailabilityGrid;
