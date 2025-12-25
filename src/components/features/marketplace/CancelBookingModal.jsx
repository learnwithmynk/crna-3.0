/**
 * CancelBookingModal
 *
 * Modal for cancelling a booking with refund policy display.
 * Shows refund amount based on cancellation timing.
 */

import { useState, useMemo } from 'react';
import { AlertTriangle, Clock, DollarSign, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useBookingActions } from '@/hooks/useBookings';

// Cancellation policy thresholds
const FULL_REFUND_HOURS = 48; // Full refund if cancelled 48+ hours before
const PARTIAL_REFUND_HOURS = 24; // 50% refund if cancelled 24-48 hours before
// Less than 24 hours = no refund

/**
 * Calculate refund amount based on timing
 */
function calculateRefund(booking) {
  if (!booking?.scheduledAt || !booking?.price) {
    return { amount: 0, percentage: 0, policy: 'unknown' };
  }

  const sessionTime = new Date(booking.scheduledAt);
  const now = new Date();
  const hoursUntilSession = (sessionTime - now) / (1000 * 60 * 60);

  if (hoursUntilSession >= FULL_REFUND_HOURS) {
    return {
      amount: booking.price,
      percentage: 100,
      policy: 'flexible',
      message: 'Full refund (48+ hours notice)'
    };
  } else if (hoursUntilSession >= PARTIAL_REFUND_HOURS) {
    return {
      amount: Math.round(booking.price * 0.5),
      percentage: 50,
      policy: 'moderate',
      message: '50% refund (24-48 hours notice)'
    };
  } else if (hoursUntilSession > 0) {
    return {
      amount: 0,
      percentage: 0,
      policy: 'strict',
      message: 'No refund (less than 24 hours notice)'
    };
  } else {
    return {
      amount: 0,
      percentage: 0,
      policy: 'past',
      message: 'Session has already started'
    };
  }
}

export function CancelBookingModal({
  open,
  onOpenChange,
  booking,
  onSuccess
}) {
  const [reason, setReason] = useState('');
  const { cancelBooking, loading, error } = useBookingActions();

  const refundInfo = useMemo(() => calculateRefund(booking), [booking]);

  const handleCancel = async () => {
    if (!booking?.id) return;

    const result = await cancelBooking(booking.id, reason);

    if (result.success) {
      onSuccess?.();
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setReason('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Cancel Booking
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this booking?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Booking Summary */}
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="font-medium">{booking?.serviceSnapshot?.title}</p>
            <p className="text-sm text-gray-600">with {booking?.providerSnapshot?.name}</p>
            {booking?.scheduledAt && (
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(booking.scheduledAt).toLocaleString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </p>
            )}
          </div>

          {/* Refund Policy */}
          <div className="p-3 border rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                Refund Amount
              </span>
              <span className="font-bold text-lg">
                ${refundInfo.amount}
                {refundInfo.percentage > 0 && refundInfo.percentage < 100 && (
                  <span className="text-sm text-gray-500 ml-1">
                    ({refundInfo.percentage}%)
                  </span>
                )}
              </span>
            </div>
            <p className="text-sm text-gray-600">{refundInfo.message}</p>
          </div>

          {/* Warning for no refund */}
          {refundInfo.percentage === 0 && refundInfo.policy !== 'past' && (
            <Alert variant="warning">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                Cancelling now means you won't receive a refund. Consider rescheduling instead.
              </AlertDescription>
            </Alert>
          )}

          {/* Reason */}
          <div>
            <label className="text-sm font-medium block mb-1">
              Reason for cancellation (optional)
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Let the mentor know why you're cancelling..."
              rows={3}
            />
          </div>

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Keep Booking
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={loading || refundInfo.policy === 'past'}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Cancelling...
              </>
            ) : (
              'Cancel Booking'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CancelBookingModal;
