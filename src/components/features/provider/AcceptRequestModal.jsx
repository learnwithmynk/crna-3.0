/**
 * AcceptRequestModal
 *
 * Modal for providers to accept a booking request.
 * Provider selects one of the applicant's preferred times and optionally adds a message.
 * Payment is charged when the provider accepts.
 */

import { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, DollarSign } from 'lucide-react';
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
import { Label } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

/**
 * Format time slot for display
 */
function formatTimeSlot(timeStr) {
  const date = new Date(timeStr);
  return {
    date: date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }),
    time: date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  };
}

/**
 * AcceptRequestModal Component
 */
export function AcceptRequestModal({
  open,
  onOpenChange,
  request,
  onConfirm
}) {
  const [selectedTime, setSelectedTime] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract requested times from JSONB
  const requestedTimes = request?.requested_times || [];

  const handleConfirm = async () => {
    if (!selectedTime) return;

    setIsSubmitting(true);
    try {
      await onConfirm(selectedTime, message);
      // Reset state on success
      setSelectedTime(null);
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedTime(null);
      setMessage('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Accept Booking Request
          </DialogTitle>
          <DialogDescription>
            Select a time from {request?.applicantSnapshot?.name || 'the applicant'}'s preferred times and confirm.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Service Info */}
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600">Service</p>
            <p className="font-medium">{request?.serviceSnapshot?.title}</p>
            <p className="text-sm text-gray-500 mt-1">
              {request?.serviceSnapshot?.duration} min · ${(request?.amount_cents / 100).toFixed(2)}
            </p>
          </div>

          {/* Time Selection */}
          <div>
            <Label className="mb-2 block">Select a Time *</Label>
            {requestedTimes.length === 0 ? (
              <Alert>
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  No preferred times provided by the applicant.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                {requestedTimes.map((time, index) => {
                  const formatted = formatTimeSlot(time);
                  const isSelected = selectedTime === time;

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        'w-full p-3 rounded-xl border-2 text-left transition-all',
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Clock className={cn(
                          'w-5 h-5 mt-0.5 flex-shrink-0',
                          isSelected ? 'text-primary' : 'text-gray-400'
                        )} />
                        <div className="flex-1">
                          <p className={cn(
                            'font-medium',
                            isSelected && 'text-black'
                          )}>
                            {formatted.date}
                          </p>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {formatted.time}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Optional Message */}
          <div>
            <Label htmlFor="message" className="mb-2 block">
              Message to Applicant (optional)
            </Label>
            <Textarea
              id="message"
              placeholder="Looking forward to working with you! I'll send prep materials before our session."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {/* Payment Notice */}
          <Alert>
            <DollarSign className="w-4 h-4" />
            <AlertDescription>
              <strong>Payment will be charged when you accept.</strong>
              {' '}The applicant will be charged ${(request?.amount_cents / 100).toFixed(2)} and you'll receive ${(request?.provider_payout_cents / 100).toFixed(2)} after completion.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedTime || isSubmitting}
          >
            {isSubmitting ? 'Confirming...' : 'Accept & Confirm Time'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AcceptRequestModal;
