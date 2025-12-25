/**
 * ProviderAvailabilityPage
 *
 * Allows providers to manage their availability, blocked dates, vacation mode, and calendar sync.
 * Route: /marketplace/provider/availability
 *
 * Features:
 * - Weekly availability grid (reusing OnboardingStep3Availability pattern)
 * - Blocked dates section (single days and date ranges)
 * - Timezone display with selector
 * - Booking preferences (buffer time, minimum notice, instant book toggle)
 * - Vacation/Pause Mode section
 * - Calendar Sync section (Google/Outlook integration)
 */

import { useState } from 'react';
import {
  Calendar,
  Clock,
  Globe,
  Plus,
  Trash2,
  Copy,
  Info,
  PauseCircle,
  Settings as SettingsIcon,
  CheckCircle2,
  X
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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

// Convert 24h to 12h format for display
function formatTime12h(time24) {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

// Format date for display
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// MOCK DATA - Replace with API call
const mockCurrentSettings = {
  timezone: 'America/New_York',
  availability: {
    monday: [{ start: '09:00', end: '17:00' }],
    tuesday: [{ start: '09:00', end: '17:00' }],
    wednesday: [{ start: '09:00', end: '17:00' }],
    thursday: [{ start: '09:00', end: '17:00' }],
    friday: [{ start: '09:00', end: '12:00' }, { start: '13:00', end: '17:00' }],
    saturday: [],
    sunday: []
  },
  bufferTime: '15',
  minimumNotice: '48',
  instantBook: true,
};

const mockBlockedDates = [
  {
    id: 'block_001',
    type: 'single',
    date: '2024-12-20',
    reason: 'School exam'
  },
  {
    id: 'block_002',
    type: 'range',
    startDate: '2024-12-24',
    endDate: '2024-12-26',
    reason: 'Holiday break'
  },
  {
    id: 'block_003',
    type: 'single',
    date: '2025-01-02',
    reason: 'Clinical rotation'
  }
];

const mockVacationSettings = {
  isOnVacation: false,
  vacationStartDate: '',
  vacationEndDate: '',
  autoResponseMessage: 'Thanks for your interest! I\'m currently taking a break but will be back soon. Feel free to book for dates after my return.'
};

const mockUpcomingBookingsDuringPause = [
  {
    id: 'booking_001',
    applicantName: 'Jessica Chen',
    serviceType: 'Mock Interview',
    date: '2024-12-28',
    time: '2:00 PM EST',
    status: 'confirmed'
  },
  {
    id: 'booking_002',
    applicantName: 'Michael Rodriguez',
    serviceType: 'Strategy Session',
    date: '2024-12-30',
    time: '10:00 AM EST',
    status: 'confirmed'
  }
];

const mockCalendarSync = {
  googleConnected: true,
  outlookConnected: false,
  lastSyncDate: '2024-12-13T08:30:00Z'
};

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

export function ProviderAvailabilityPage() {
  // State for availability settings
  const [timezone, setTimezone] = useState(mockCurrentSettings.timezone);
  const [availability, setAvailability] = useState(mockCurrentSettings.availability);
  const [bufferTime, setBufferTime] = useState(mockCurrentSettings.bufferTime);
  const [minimumNotice, setMinimumNotice] = useState(mockCurrentSettings.minimumNotice);
  const [instantBook, setInstantBook] = useState(mockCurrentSettings.instantBook);

  // State for blocked dates
  const [blockedDates, setBlockedDates] = useState(mockBlockedDates);
  const [showAddBlockedDate, setShowAddBlockedDate] = useState(false);
  const [newBlockedDate, setNewBlockedDate] = useState({
    type: 'single',
    date: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  // State for vacation mode
  const [vacationSettings, setVacationSettings] = useState(mockVacationSettings);

  // State for calendar sync
  const [calendarSync, setCalendarSync] = useState(mockCalendarSync);

  // Update availability for a specific day
  const handleDayChange = (day, blocks) => {
    setAvailability({
      ...availability,
      [day]: blocks
    });
  };

  // Copy availability to all days
  const copyToAllDays = () => {
    const sourceDay = DAYS.find(day => availability[day.value]?.length > 0);
    if (!sourceDay) return;

    const sourceBlocks = availability[sourceDay.value];
    const newAvailability = {};
    DAYS.forEach(day => {
      newAvailability[day.value] = [...sourceBlocks];
    });
    setAvailability(newAvailability);
  };

  // Add blocked date
  const addBlockedDate = () => {
    if (newBlockedDate.type === 'single' && !newBlockedDate.date) return;
    if (newBlockedDate.type === 'range' && (!newBlockedDate.startDate || !newBlockedDate.endDate)) return;

    const newBlock = {
      id: `block_${Date.now()}`,
      type: newBlockedDate.type,
      ...(newBlockedDate.type === 'single'
        ? { date: newBlockedDate.date }
        : { startDate: newBlockedDate.startDate, endDate: newBlockedDate.endDate }
      ),
      reason: newBlockedDate.reason
    };

    setBlockedDates([...blockedDates, newBlock]);
    setNewBlockedDate({ type: 'single', date: '', startDate: '', endDate: '', reason: '' });
    setShowAddBlockedDate(false);
  };

  // Remove blocked date
  const removeBlockedDate = (id) => {
    setBlockedDates(blockedDates.filter(block => block.id !== id));
  };

  // Save changes (placeholder)
  const handleSave = () => {
    // TODO: API call to save all settings
    console.log('Saving availability settings:', {
      timezone,
      availability,
      bufferTime,
      minimumNotice,
      instantBook,
      blockedDates,
      vacationSettings
    });
    alert('Availability settings saved! (This will be connected to the API)');
  };

  // Check if any day has availability (for copy button)
  const hasAnyAvailability = DAYS.some(
    day => availability[day.value]?.length > 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Availability
          </h1>
          <p className="text-gray-600">
            Set your schedule, block dates, and manage booking preferences
          </p>
        </div>

        {/* Timezone Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-600" />
              Timezone
            </CardTitle>
            <CardDescription>
              Your availability will be displayed to applicants in their local timezone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger className="max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Weekly Availability Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  Weekly Availability
                </CardTitle>
                <CardDescription>
                  Set your recurring weekly schedule
                </CardDescription>
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
          </CardHeader>
          <CardContent className="space-y-3">
            {DAYS.map((day) => (
              <DayAvailabilityCard
                key={day.value}
                day={day}
                blocks={availability[day.value] || []}
                onChange={(blocks) => handleDayChange(day.value, blocks)}
              />
            ))}
          </CardContent>
        </Card>

        {/* Booking Preferences Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-600" />
              Booking Preferences
            </CardTitle>
            <CardDescription>
              Control how applicants can book time with you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Buffer between bookings */}
              <div className="space-y-2">
                <Label htmlFor="buffer">Buffer Between Bookings</Label>
                <Select value={bufferTime} onValueChange={setBufferTime}>
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
                <Select value={minimumNotice} onValueChange={setMinimumNotice}>
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

            {/* Instant book toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex-1">
                <Label htmlFor="instant-book" className="text-base font-medium cursor-pointer">
                  Instant Book
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  {instantBook
                    ? 'Applicants can book immediately (recommended)'
                    : 'You must approve each booking request'}
                </p>
              </div>
              <Switch
                id="instant-book"
                checked={instantBook}
                onCheckedChange={setInstantBook}
              />
            </div>
          </CardContent>
        </Card>

        {/* Blocked Dates Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <X className="w-5 h-5 text-gray-600" />
                  Blocked Dates
                </CardTitle>
                <CardDescription>
                  Block specific dates when you're unavailable
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddBlockedDate(!showAddBlockedDate)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Blocked Date
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Blocked Date Form */}
            {showAddBlockedDate && (
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-4">
                <div className="space-y-2">
                  <Label>Block Type</Label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="single"
                        checked={newBlockedDate.type === 'single'}
                        onChange={(e) => setNewBlockedDate({ ...newBlockedDate, type: e.target.value })}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm">Single Day</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="range"
                        checked={newBlockedDate.type === 'range'}
                        onChange={(e) => setNewBlockedDate({ ...newBlockedDate, type: e.target.value })}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm">Date Range</span>
                    </label>
                  </div>
                </div>

                {newBlockedDate.type === 'single' ? (
                  <div className="space-y-2">
                    <Label htmlFor="blocked-date">Date</Label>
                    <Input
                      id="blocked-date"
                      type="date"
                      value={newBlockedDate.date}
                      onChange={(e) => setNewBlockedDate({ ...newBlockedDate, date: e.target.value })}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="blocked-start">Start Date</Label>
                      <Input
                        id="blocked-start"
                        type="date"
                        value={newBlockedDate.startDate}
                        onChange={(e) => setNewBlockedDate({ ...newBlockedDate, startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blocked-end">End Date</Label>
                      <Input
                        id="blocked-end"
                        type="date"
                        value={newBlockedDate.endDate}
                        onChange={(e) => setNewBlockedDate({ ...newBlockedDate, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="blocked-reason">Reason (Optional)</Label>
                  <Input
                    id="blocked-reason"
                    placeholder="e.g., Clinical rotation, School exam"
                    value={newBlockedDate.reason}
                    onChange={(e) => setNewBlockedDate({ ...newBlockedDate, reason: e.target.value })}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={addBlockedDate}>
                    Add Blocked Date
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddBlockedDate(false);
                      setNewBlockedDate({ type: 'single', date: '', startDate: '', endDate: '', reason: '' });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Blocked Dates List */}
            {blockedDates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Info className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No blocked dates</p>
              </div>
            ) : (
              <div className="space-y-2">
                {blockedDates.map((block) => (
                  <div
                    key={block.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {block.type === 'single'
                          ? formatDate(block.date)
                          : `${formatDate(block.startDate)} - ${formatDate(block.endDate)}`
                        }
                      </p>
                      {block.reason && (
                        <p className="text-sm text-gray-600">{block.reason}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBlockedDate(block.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vacation/Pause Mode Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PauseCircle className="w-5 h-5 text-gray-600" />
              Vacation / Pause Mode
            </CardTitle>
            <CardDescription>
              Temporarily pause new bookings while keeping existing commitments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Pause toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex-1">
                <Label htmlFor="vacation-mode" className="text-base font-medium cursor-pointer">
                  I'm unavailable for new bookings
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  {vacationSettings.isOnVacation
                    ? 'Your profile is hidden from search. Existing bookings remain active.'
                    : 'Your profile is visible and accepting bookings'}
                </p>
              </div>
              <Switch
                id="vacation-mode"
                checked={vacationSettings.isOnVacation}
                onCheckedChange={(checked) => setVacationSettings({ ...vacationSettings, isOnVacation: checked })}
              />
            </div>

            {/* Vacation date range */}
            {vacationSettings.isOnVacation && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vacation-start">Vacation Start Date</Label>
                    <Input
                      id="vacation-start"
                      type="date"
                      value={vacationSettings.vacationStartDate}
                      onChange={(e) => setVacationSettings({ ...vacationSettings, vacationStartDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vacation-end">Return Date</Label>
                    <Input
                      id="vacation-end"
                      type="date"
                      value={vacationSettings.vacationEndDate}
                      onChange={(e) => setVacationSettings({ ...vacationSettings, vacationEndDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Auto-response message */}
                <div className="space-y-2">
                  <Label htmlFor="auto-response">Auto-Response Message</Label>
                  <Textarea
                    id="auto-response"
                    placeholder="Message sent to applicants who try to book during your vacation..."
                    rows={3}
                    value={vacationSettings.autoResponseMessage}
                    onChange={(e) => setVacationSettings({ ...vacationSettings, autoResponseMessage: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">
                    This message will be shown to applicants when they view your profile
                  </p>
                </div>

                {/* Existing bookings during pause */}
                {mockUpcomingBookingsDuringPause.length > 0 && (
                  <div className="border border-amber-200 bg-amber-50 rounded-xl p-4">
                    <div className="flex items-start gap-2 mb-3">
                      <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-amber-900">
                          You have {mockUpcomingBookingsDuringPause.length} confirmed bookings during this period
                        </p>
                        <p className="text-xs text-amber-700 mt-1">
                          These sessions will remain active. Contact applicants if you need to reschedule.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {mockUpcomingBookingsDuringPause.map((booking) => (
                        <div key={booking.id} className="bg-white rounded border border-amber-200 p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {booking.applicantName}
                              </p>
                              <p className="text-xs text-gray-600">
                                {booking.serviceType} • {booking.date} at {booking.time}
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Calendar Sync Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-gray-600" />
              Calendar Sync
            </CardTitle>
            <CardDescription>
              Connect your calendar to automatically block busy times
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Calendar */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Google Calendar</p>
                  {calendarSync.googleConnected ? (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Connected</span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Not connected</p>
                  )}
                </div>
              </div>
              <Button
                variant={calendarSync.googleConnected ? 'outline' : 'default'}
                size="sm"
                onClick={() => {
                  // TODO: Handle Google Calendar connection
                  setCalendarSync({ ...calendarSync, googleConnected: !calendarSync.googleConnected });
                }}
              >
                {calendarSync.googleConnected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>

            {/* Outlook Calendar */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Outlook Calendar</p>
                  {calendarSync.outlookConnected ? (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Connected</span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Not connected</p>
                  )}
                </div>
              </div>
              <Button
                variant={calendarSync.outlookConnected ? 'outline' : 'default'}
                size="sm"
                onClick={() => {
                  // TODO: Handle Outlook Calendar connection
                  setCalendarSync({ ...calendarSync, outlookConnected: !calendarSync.outlookConnected });
                }}
              >
                {calendarSync.outlookConnected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>

            {(calendarSync.googleConnected || calendarSync.outlookConnected) && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <p className="text-sm text-blue-900">
                  Events from your connected calendars will automatically block your availability.
                  Last synced: {new Date(calendarSync.lastSyncDate).toLocaleString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProviderAvailabilityPage;
