/**
 * RescheduleModal
 *
 * Modal for rescheduling a booking.
 * Allows selecting new time slots from provider's availability.
 */

import { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useBookingActions } from '@/hooks/useBookings';
import { useCalComAvailability, useTimezone, useDateRange } from '@/hooks/useCalComAvailability';
import { cn } from '@/lib/utils';

export function RescheduleModal({
  open,
  onOpenChange,
  booking,
  onSuccess
}) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const { rescheduleBooking, loading, error } = useBookingActions();
  const { timezone, setTimezone, timezoneOptions } = useTimezone();
  const { startDate, endDate, goToNextWeek, goToPrevWeek, canGoPrev } = useDateRange(14);

  // Fetch availability
  const { slots, loading: slotsLoading, error: slotsError, formatSlotTime } = useCalComAvailability({
    eventTypeId: booking?.serviceSnapshot?.calComEventTypeId,
    providerId: booking?.providerId,
    startDate,
    endDate,
    timezone
  });

  // Reset selection when opening
  useEffect(() => {
    if (open) {
      setSelectedSlot(null);
    }
  }, [open]);

  const handleReschedule = async () => {
    if (!booking?.id || !selectedSlot) return;

    const result = await rescheduleBooking(booking.id, selectedSlot.time);

    if (result.success) {
      onSuccess?.();
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedSlot(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Reschedule Booking
          </DialogTitle>
          <DialogDescription>
            Choose a new time for your session with {booking?.providerSnapshot?.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Booking */}
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">Current Time</p>
            <p className="font-medium flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {booking?.scheduledAt ? (
                new Date(booking.scheduledAt).toLocaleString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })
              ) : (
                'Not scheduled'
              )}
            </p>
          </div>

          {/* Timezone Selector */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
            >
              {timezoneOptions.map(tz => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevWeek}
              disabled={!canGoPrev}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600">
              {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              {' - '}
              {new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <Button variant="outline" size="sm" onClick={goToNextWeek}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Time Slots */}
          <div className="max-h-60 overflow-y-auto">
            {slotsLoading ? (
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : slotsError ? (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{slotsError}</AlertDescription>
              </Alert>
            ) : slots.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Calendar className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p>No available times this week.</p>
                <p className="text-sm">Try the next week.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => setSelectedSlot(slot)}
                    className={cn(
                      'p-2 rounded-xl border text-sm transition-colors text-center',
                      selectedSlot?.time === slot.time
                        ? 'bg-primary border-primary text-black font-medium'
                        : 'bg-white border-gray-200 hover:border-primary'
                    )}
                  >
                    <div className="font-medium">{formatSlotTime(slot)}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(slot.time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Time */}
          {selectedSlot && (
            <div className="p-3 bg-green-50 rounded-xl">
              <p className="text-sm text-green-700 font-medium">
                New Time: {formatSlotTime(selectedSlot, 'long')}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleReschedule} disabled={loading || !selectedSlot}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Rescheduling...
              </>
            ) : (
              'Confirm New Time'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RescheduleModal;
