/**
 * OnboardingStep3Availability Component
 *
 * Step 3 of provider onboarding - "Availability & Video"
 *
 * Collects:
 * - Weekly availability schedule (multi-block per day)
 * - Timezone (auto-detected, editable)
 * - Booking preferences (buffer time, notice time, booking model)
 * - Cancellation policy
 * - Video call link (Zoom/Meet - REQUIRED)
 *
 * Validation:
 * - At least one day must have availability
 * - Video call link is required and must be valid URL
 * - Timezone is required
 */

import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Globe,
  Video,
  Plus,
  Trash2,
  Copy,
  CheckCircle,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Days of the week
const DAYS = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' }
];

// Time options (24-hour format for internal use)
const TIME_OPTIONS = [
  '00:00', '00:30', '01:00', '01:30', '02:00', '02:30',
  '03:00', '03:30', '04:00', '04:30', '05:00', '05:30',
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
];

// Common timezones
const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Phoenix', label: 'Arizona (MST)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'UTC', label: 'UTC' }
];

// Buffer time options
const BUFFER_OPTIONS = [
  { value: '0', label: 'No buffer' },
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '60', label: '1 hour' }
];

// Minimum notice options
const NOTICE_OPTIONS = [
  { value: '24', label: '24 hours' },
  { value: '48', label: '48 hours' },
  { value: '72', label: '72 hours' },
  { value: '168', label: '1 week' }
];

// Cancellation policies
const CANCELLATION_POLICIES = [
  {
    value: 'flexible',
    label: 'Flexible',
    description: 'Full refund up to 24 hours before the session'
  },
  {
    value: 'moderate',
    label: 'Moderate',
    description: 'Full refund up to 48 hours before, 50% refund after'
  },
  {
    value: 'strict',
    label: 'Strict',
    description: 'Full refund up to 1 week before, 50% up to 48 hours, none after'
  }
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

// Detect user's timezone
function detectTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (e) {
    return 'America/New_York'; // Default fallback
  }
}

// Validate Zoom or Google Meet URL
function isValidVideoUrl(url) {
  if (!url) return false;
  const zoomPattern = /^https:\/\/([\w-]+\.)?zoom\.us\/(j|my)\/[\w-]+/i;
  const meetPattern = /^https:\/\/meet\.google\.com\/[\w-]+/i;
  return zoomPattern.test(url) || meetPattern.test(url);
}

// Simple radio group component
function RadioGroup({ options, value, onChange, name }) {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border-2 border-gray-200 hover:border-primary/50 transition-colors group"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-0.5 w-4 h-4 text-primary focus:ring-2 focus:ring-primary"
          />
          <div className="flex-1">
            <div className="font-medium text-gray-900 group-hover:text-gray-700">
              {option.label}
            </div>
            {option.description && (
              <div className="text-xs text-gray-500 mt-1">
                {option.description}
              </div>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}

// Individual day availability card
function DayAvailabilityCard({ day, blocks = [], onChange }) {
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
                  <SelectTrigger className="bg-white">
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

                <span className="text-gray-500">to</span>

                <Select
                  value={block.end}
                  onValueChange={(value) => updateBlock(index, 'end', value)}
                >
                  <SelectTrigger className="bg-white">
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

export function OnboardingStep3Availability({ data = {}, onChange, onNext, onBack }) {
  const [errors, setErrors] = useState({});
  const [videoUrlTested, setVideoUrlTested] = useState(false);

  // Initialize timezone on mount
  useEffect(() => {
    if (!data.timezone) {
      onChange('timezone', detectTimezone());
    }
  }, []);

  // Update availability for a specific day
  const handleDayChange = (day, blocks) => {
    onChange('availability', {
      ...data.availability,
      [day]: blocks
    });
  };

  // Copy availability to all days
  const copyToAllDays = () => {
    // Find first day with availability
    const sourceDay = DAYS.find(day => data.availability?.[day.value]?.length > 0);
    if (!sourceDay) return;

    const sourceBlocks = data.availability[sourceDay.value];
    const newAvailability = {};
    DAYS.forEach(day => {
      newAvailability[day.value] = [...sourceBlocks];
    });
    onChange('availability', newAvailability);
  };

  // Test video call link
  const testVideoLink = () => {
    if (data.videoCallLink && isValidVideoUrl(data.videoCallLink)) {
      window.open(data.videoCallLink, '_blank');
      setVideoUrlTested(true);
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    // Check if at least one day has availability
    const hasAvailability = DAYS.some(
      day => data.availability?.[day.value]?.length > 0
    );
    if (!hasAvailability) {
      newErrors.availability = 'Please set availability for at least one day';
    }

    // Check timezone
    if (!data.timezone) {
      newErrors.timezone = 'Timezone is required';
    }

    // Check video call link
    if (!data.videoCallLink) {
      newErrors.videoCallLink = 'Video call link is required';
    } else if (!isValidVideoUrl(data.videoCallLink)) {
      newErrors.videoCallLink = 'Please enter a valid Zoom or Google Meet URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next
  const handleNext = () => {
    if (validate()) {
      onNext?.();
    }
  };

  // Check if any day has availability (for copy button)
  const hasAnyAvailability = DAYS.some(
    day => data.availability?.[day.value]?.length > 0
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Availability & Video Setup
        </h2>
        <p className="text-gray-600">
          Set your schedule and booking preferences so applicants can book time with you.
        </p>
      </div>

      {/* Timezone Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-gray-600" />
          <Label className="text-base font-semibold">Your Timezone</Label>
        </div>
        <Select
          value={data.timezone || ''}
          onValueChange={(value) => onChange('timezone', value)}
        >
          <SelectTrigger className={cn(errors.timezone && 'border-red-500')}>
            <SelectValue placeholder="Select timezone..." />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONES.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.timezone && (
          <p className="text-sm text-red-600">{errors.timezone}</p>
        )}
      </div>

      {/* Weekly Availability Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <Label className="text-base font-semibold">Weekly Availability</Label>
          </div>
          {hasAnyAvailability && (
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

        {errors.availability && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
            <Info className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
            <p className="text-sm text-red-600">{errors.availability}</p>
          </div>
        )}

        <div className="space-y-3">
          {DAYS.map((day) => (
            <DayAvailabilityCard
              key={day.value}
              day={day}
              blocks={data.availability?.[day.value] || []}
              onChange={(blocks) => handleDayChange(day.value, blocks)}
            />
          ))}
        </div>
      </div>

      {/* Booking Preferences Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <Label className="text-base font-semibold">Booking Preferences</Label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Buffer between bookings */}
          <div className="space-y-2">
            <Label htmlFor="buffer">Buffer Between Bookings</Label>
            <Select
              value={data.bufferTime || '15'}
              onValueChange={(value) => onChange('bufferTime', value)}
            >
              <SelectTrigger id="buffer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BUFFER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Break time between back-to-back sessions
            </p>
          </div>

          {/* Minimum notice time */}
          <div className="space-y-2">
            <Label htmlFor="notice">Minimum Notice Time</Label>
            <Select
              value={data.minimumNotice || '48'}
              onValueChange={(value) => onChange('minimumNotice', value)}
            >
              <SelectTrigger id="notice">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NOTICE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              How far in advance must applicants book
            </p>
          </div>
        </div>

        {/* Booking model toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex-1">
            <Label htmlFor="instant-book" className="text-base font-medium cursor-pointer">
              Instant Book
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              {data.instantBook
                ? 'Applicants can book immediately (recommended)'
                : 'You must approve each booking request'}
            </p>
          </div>
          <Switch
            id="instant-book"
            checked={data.instantBook || false}
            onCheckedChange={(checked) => onChange('instantBook', checked)}
          />
        </div>
      </div>

      {/* Cancellation Policy Section */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Cancellation Policy</Label>
        <RadioGroup
          options={CANCELLATION_POLICIES}
          value={data.cancellationPolicy || 'moderate'}
          onChange={(value) => onChange('cancellationPolicy', value)}
          name="cancellation-policy"
        />
      </div>

      {/* Video Call Link Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Video className="w-5 h-5 text-gray-600" />
          <Label className="text-base font-semibold">Video Call Link (Required)</Label>
        </div>
        <Input
          type="url"
          placeholder="https://zoom.us/j/123456789 or https://meet.google.com/abc-defg-hij"
          value={data.videoCallLink || ''}
          onChange={(e) => {
            onChange('videoCallLink', e.target.value);
            setVideoUrlTested(false);
          }}
          className={cn(errors.videoCallLink && 'border-red-500')}
        />
        {errors.videoCallLink && (
          <p className="text-sm text-red-600">{errors.videoCallLink}</p>
        )}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={testVideoLink}
            disabled={!data.videoCallLink || !isValidVideoUrl(data.videoCallLink)}
          >
            {videoUrlTested ? (
              <>
                <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                Link Tested
              </>
            ) : (
              <>
                <Video className="w-4 h-4 mr-1" />
                Test Link
              </>
            )}
          </Button>
          <p className="text-xs text-gray-500">
            Don't have Zoom?{' '}
            <a
              href="https://zoom.us/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Get a free account
            </a>
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          className="flex-1"
        >
          Continue to Services
        </Button>
      </div>
    </div>
  );
}

export default OnboardingStep3Availability;
