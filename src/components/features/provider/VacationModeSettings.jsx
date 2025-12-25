/**
 * VacationModeSettings Component
 *
 * Allows SRNA providers to pause their marketplace availability.
 * Features:
 * - Toggle for pausing new bookings
 * - Optional vacation date range picker
 * - Auto-response message for inquiries during pause
 * - Display existing bookings during vacation period
 * - Warning banner when paused
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertCircle,
  Calendar,
  User,
  Clock,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Format date to readable string
 */
function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Warning banner shown when paused
 */
function PausedBanner() {
  return (
    <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-200 rounded-xl">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-orange-900">
            You are paused - New bookings disabled
          </p>
          <p className="text-sm text-orange-700 mt-1">
            Your profile is hidden from search results and applicants cannot book new sessions with you.
            You can still manage existing bookings.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Info banner explaining vacation mode
 */
function InfoBanner() {
  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900 mb-1">
            How Vacation Mode Works
          </p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Your profile will be hidden from marketplace search</li>
            <li>• Applicants cannot request new bookings</li>
            <li>• Existing confirmed bookings remain active</li>
            <li>• Auto-response sent to any inquiries</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Booking card for displaying existing bookings during pause
 */
function BookingCard({ booking }) {
  const { applicantName, applicantAvatar, service, date, time, status } = booking;

  // Get initials for avatar fallback
  const initials = applicantName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?';

  // Format booking date
  const bookingDate = formatDate(date);

  return (
    <div className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold text-sm flex-shrink-0">
        {applicantAvatar ? (
          <img
            src={applicantAvatar}
            alt={applicantName}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </div>

      {/* Booking details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="font-medium text-gray-900 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              {applicantName}
            </p>
            <p className="text-sm text-gray-600 mt-0.5">{service}</p>
          </div>
          <Badge
            variant={status === 'confirmed' ? 'success' : 'secondary'}
            className="flex-shrink-0"
          >
            {status || 'Confirmed'}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{bookingDate}</span>
          </div>
          {time && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{time}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Main VacationModeSettings component
 */
export function VacationModeSettings({
  isPaused = false,
  onPausedChange,
  vacationStart = null,
  vacationEnd = null,
  onVacationDatesChange,
  autoResponseMessage = '',
  onAutoResponseChange,
  bookingsDuringPause = [],
  className
}) {
  // Handle pause toggle
  const handlePauseToggle = (checked) => {
    if (onPausedChange) {
      onPausedChange(checked);
    }
  };

  // Handle vacation start date change
  const handleStartDateChange = (e) => {
    const newStart = e.target.value ? new Date(e.target.value) : null;
    if (onVacationDatesChange) {
      onVacationDatesChange(newStart, vacationEnd);
    }
  };

  // Handle vacation end date change
  const handleEndDateChange = (e) => {
    const newEnd = e.target.value ? new Date(e.target.value) : null;
    if (onVacationDatesChange) {
      onVacationDatesChange(vacationStart, newEnd);
    }
  };

  // Handle auto-response message change
  const handleMessageChange = (e) => {
    if (onAutoResponseChange) {
      onAutoResponseChange(e.target.value);
    }
  };

  // Format date for input (YYYY-MM-DD)
  const formatInputDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <Card className={cn('shadow-sm', className)} data-testid="vacation-mode-settings">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Vacation Mode</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Show warning if paused */}
        {isPaused && <PausedBanner />}

        {/* Show info banner if not paused */}
        {!isPaused && <InfoBanner />}

        {/* Pause Toggle */}
        <div className="flex items-start justify-between gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <div className="flex-1">
            <Label htmlFor="pause-toggle" className="text-base font-semibold text-gray-900">
              I'm unavailable for new bookings
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              Pause your availability and hide your profile from marketplace search
            </p>
          </div>
          <Switch
            id="pause-toggle"
            checked={isPaused}
            onCheckedChange={handlePauseToggle}
            className="flex-shrink-0"
          />
        </div>

        {/* Vacation Date Range (only show when paused) */}
        {isPaused && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Vacation Dates (Optional)</h3>
            </div>
            <p className="text-sm text-gray-600 -mt-2">
              Setting dates helps you plan ahead. Your pause will remain active until you manually turn it off.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="vacation-start" className="text-sm font-medium text-gray-700">
                  Start Date
                </Label>
                <Input
                  id="vacation-start"
                  type="date"
                  value={formatInputDate(vacationStart)}
                  onChange={handleStartDateChange}
                  className="w-full"
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label htmlFor="vacation-end" className="text-sm font-medium text-gray-700">
                  End Date
                </Label>
                <Input
                  id="vacation-end"
                  type="date"
                  value={formatInputDate(vacationEnd)}
                  onChange={handleEndDateChange}
                  min={formatInputDate(vacationStart)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Auto-Response Message (only show when paused) */}
        {isPaused && (
          <div className="space-y-2">
            <Label htmlFor="auto-response" className="text-sm font-medium text-gray-700">
              Auto-Response Message
            </Label>
            <p className="text-sm text-gray-500 mb-2">
              This message will be sent to applicants who try to contact you
            </p>
            <Textarea
              id="auto-response"
              value={autoResponseMessage}
              onChange={handleMessageChange}
              placeholder="Hi! Thanks for reaching out. I'm currently on vacation and unavailable for new bookings. I'll be back on [date] and would love to work with you then!"
              className="min-h-[120px] resize-y"
            />
            <p className="text-xs text-gray-500 mt-1">
              {autoResponseMessage.length} / 500 characters
            </p>
          </div>
        )}

        {/* Existing Bookings During Pause */}
        {isPaused && bookingsDuringPause && bookingsDuringPause.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                Existing Bookings During Vacation
              </h3>
              <Badge variant="secondary">
                {bookingsDuringPause.length} {bookingsDuringPause.length === 1 ? 'booking' : 'bookings'}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 -mt-2">
              These confirmed bookings will remain active. Contact applicants if you need to reschedule.
            </p>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {bookingsDuringPause.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </div>
        )}

        {/* No bookings message */}
        {isPaused && bookingsDuringPause && bookingsDuringPause.length === 0 && vacationStart && vacationEnd && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm text-green-700 text-center">
              No existing bookings during your vacation period. Enjoy your time off!
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="default"
            onClick={() => {
              // TODO: Save vacation settings
              console.log('Save vacation settings', {
                isPaused,
                vacationStart,
                vacationEnd,
                autoResponseMessage
              });
            }}
            className="flex-1"
          >
            Save Changes
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // TODO: Reset to original values
              console.log('Cancel changes');
            }}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default VacationModeSettings;
