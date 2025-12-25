/**
 * ProposeAlternativeModal
 *
 * Modal for providers to propose alternative times when the applicant's
 * preferred times don't work. Provider can select up to 3 alternative times.
 * Applicant will be notified and can accept or decline.
 */

import { useState } from 'react';
import { Calendar, Clock, Plus, X, AlertCircle } from 'lucide-react';
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
import { Input, Label } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

/**
 * Get minimum date/time (now + 1 hour)
 */
function getMinDateTime() {
  const now = new Date();
  now.setHours(now.getHours() + 1);
  return now.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
}

/**
 * Format datetime for display
 */
function formatDateTime(dateTimeStr) {
  const date = new Date(dateTimeStr);
  return {
    date: date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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
 * ProposeAlternativeModal Component
 */
export function ProposeAlternativeModal({
  open,
  onOpenChange,
  request,
  onConfirm
}) {
  const [proposedTimes, setProposedTimes] = useState([]);
  const [newDateTime, setNewDateTime] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const maxTimes = 3;
  const canAddMore = proposedTimes.length < maxTimes;

  const handleAddTime = () => {
    setError('');

    if (!newDateTime) {
      setError('Please select a date and time');
      return;
    }

    // Validate future time
    const selectedTime = new Date(newDateTime);
    const minTime = new Date();
    minTime.setHours(minTime.getHours() + 1);

    if (selectedTime < minTime) {
      setError('Time must be at least 1 hour from now');
      return;
    }

    // Check for duplicates
    if (proposedTimes.includes(newDateTime)) {
      setError('This time has already been added');
      return;
    }

    // Add time and clear input
    setProposedTimes([...proposedTimes, newDateTime]);
    setNewDateTime('');
  };

  const handleRemoveTime = (index) => {
    setProposedTimes(proposedTimes.filter((_, i) => i !== index));
    setError('');
  };

  const handleConfirm = async () => {
    if (proposedTimes.length === 0) {
      setError('Please add at least one alternative time');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Convert to ISO strings for API
      const timesISO = proposedTimes.map(t => new Date(t).toISOString());
      await onConfirm(timesISO, message);

      // Reset state on success
      setProposedTimes([]);
      setNewDateTime('');
      setMessage('');
    } catch (err) {
      setError(err.message || 'Failed to propose times');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setProposedTimes([]);
      setNewDateTime('');
      setMessage('');
      setError('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Propose Alternative Times
          </DialogTitle>
          <DialogDescription>
            Suggest up to 3 alternative times that work better for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Service Info */}
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600">Service</p>
            <p className="font-medium">{request?.serviceSnapshot?.title}</p>
            <p className="text-sm text-gray-500 mt-1">
              {request?.serviceSnapshot?.duration} min with {request?.applicantSnapshot?.name}
            </p>
          </div>

          {/* Proposed Times List */}
          {proposedTimes.length > 0 && (
            <div>
              <Label className="mb-2 block">
                Proposed Times ({proposedTimes.length}/{maxTimes})
              </Label>
              <div className="space-y-2">
                {proposedTimes.map((time, index) => {
                  const formatted = formatDateTime(time);
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-primary/10 border border-primary/20 rounded-xl"
                    >
                      <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{formatted.date}</p>
                        <p className="text-sm text-gray-600">{formatted.time}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveTime(index)}
                        className="p-1 hover:bg-red-100 rounded transition-colors flex-shrink-0"
                        disabled={isSubmitting}
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add New Time */}
          {canAddMore && (
            <div>
              <Label htmlFor="newDateTime" className="mb-2 block">
                {proposedTimes.length === 0 ? 'Select Date & Time *' : 'Add Another Time'}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="newDateTime"
                  type="datetime-local"
                  value={newDateTime}
                  onChange={(e) => {
                    setNewDateTime(e.target.value);
                    setError('');
                  }}
                  min={getMinDateTime()}
                  disabled={isSubmitting}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddTime}
                  disabled={!newDateTime || isSubmitting}
                  size="icon"
                  className="flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Select a date and time, then click + to add it
              </p>
            </div>
          )}

          {/* Message */}
          <div>
            <Label htmlFor="message" className="mb-2 block">
              Message to Applicant
            </Label>
            <Textarea
              id="message"
              placeholder="Let them know why these times work better for you..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              Explain why the original times don't work and why these alternatives are better
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Notice */}
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              The applicant will be notified and can accept or decline your proposed times.
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
            disabled={proposedTimes.length === 0 || isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Propose These Times'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ProposeAlternativeModal;
