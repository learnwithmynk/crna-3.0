/**
 * DeclineRequestModal
 *
 * Modal for providers to decline a booking request.
 * Allows selecting a reason and adding an optional message.
 * Applicant will be notified and can book with another mentor.
 */

import { useState } from 'react';
import { XCircle, AlertCircle } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Decline reasons
 */
const DECLINE_REASONS = [
  { value: 'schedule_conflict', label: 'Schedule conflict' },
  { value: 'not_taking_clients', label: 'Not taking new clients' },
  { value: 'outside_expertise', label: 'Outside my expertise' },
  { value: 'other', label: 'Other' }
];

/**
 * DeclineRequestModal Component
 */
export function DeclineRequestModal({
  open,
  onOpenChange,
  request,
  onConfirm
}) {
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(reason, message);
      // Reset state on success
      setReason('');
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setReason('');
      setMessage('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            Decline Booking Request
          </DialogTitle>
          <DialogDescription>
            Let {request?.applicantSnapshot?.name || 'the applicant'} know why you can't take this session.
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

          {/* Decline Reason */}
          <div>
            <Label htmlFor="reason" className="mb-2 block">
              Reason (optional)
            </Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {DECLINE_REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Optional Message */}
          <div>
            <Label htmlFor="message" className="mb-2 block">
              Message to Applicant (optional)
            </Label>
            <Textarea
              id="message"
              placeholder="I'm currently at capacity but I encourage you to reach out to another mentor who might be a great fit."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          {/* Notice */}
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              The applicant will be notified and can book with another mentor. No charges will be made.
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
            variant="destructive"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Declining...' : 'Decline Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeclineRequestModal;
