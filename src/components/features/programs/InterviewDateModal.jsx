/**
 * InterviewDateModal - Capture interview date when status changes to interview_invited
 *
 * Triggered when user changes a target program status to "Interview Invited"
 *
 * Flow:
 * 1. Show modal asking for interview date
 * 2. If date provided → Create calendar event, close modal
 * 3. If "I don't know yet" → Set interview_date_unknown, start reminder flow
 *
 * Reminder Flow (handled by useInterviewDateReminders hook):
 * - 24hr x3 → Show banner on target program page
 * - After 3 asks → Wait 7 days, then show toast
 */

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Calendar,
  PartyPopper,
  HelpCircle,
  Video,
  MapPin,
} from 'lucide-react';

export function InterviewDateModal({
  open,
  onOpenChange,
  programName,
  programId,
  onDateSubmit,
  onDontKnow,
}) {
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [isVirtual, setIsVirtual] = useState(false);
  const [location, setLocation] = useState('');

  const handleSubmit = () => {
    if (!interviewDate) {
      toast.error('Please enter an interview date');
      return;
    }

    onDateSubmit({
      date: interviewDate,
      time: interviewTime || null,
      isVirtual,
      location: location || null,
    });

    // Reset form
    setInterviewDate('');
    setInterviewTime('');
    setIsVirtual(false);
    setLocation('');
  };

  const handleDontKnow = () => {
    onDontKnow();

    // Reset form
    setInterviewDate('');
    setInterviewTime('');
    setIsVirtual(false);
    setLocation('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-teal-100 to-emerald-100">
              <PartyPopper className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Congratulations!</DialogTitle>
              <DialogDescription className="text-sm mt-0.5">
                You got an interview invite from {programName}!
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="p-3 rounded-xl bg-teal-50 border border-teal-100">
            <p className="text-sm text-teal-800">
              <strong>Pro tip:</strong> Adding your interview date helps us remind you to prepare and track your progress!
            </p>
          </div>

          {/* Interview Date */}
          <div className="space-y-2">
            <Label htmlFor="interview-date" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              Interview Date
            </Label>
            <Input
              id="interview-date"
              type="date"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="focus-visible:ring-teal-500"
            />
          </div>

          {/* Interview Time (optional) */}
          <div className="space-y-2">
            <Label htmlFor="interview-time" className="text-gray-600">
              Time (optional)
            </Label>
            <Input
              id="interview-time"
              type="time"
              value={interviewTime}
              onChange={(e) => setInterviewTime(e.target.value)}
            />
          </div>

          {/* Virtual checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is-virtual"
              checked={isVirtual}
              onCheckedChange={setIsVirtual}
            />
            <Label htmlFor="is-virtual" className="flex items-center gap-2 cursor-pointer">
              <Video className="w-4 h-4 text-gray-500" />
              Virtual interview
            </Label>
          </div>

          {/* Location (if not virtual) */}
          {!isVirtual && (
            <div className="space-y-2">
              <Label htmlFor="interview-location" className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-gray-500" />
                Location (optional)
              </Label>
              <Input
                id="interview-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Campus Building A, Room 201"
              />
            </div>
          )}
        </div>

        <DialogFooter className="mt-6 flex-col sm:flex-row gap-2">
          <Button
            variant="ghost"
            onClick={handleDontKnow}
            className="text-gray-500 hover:text-gray-700"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            I don't know yet
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!interviewDate}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Add to Calendar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * InterviewDateBanner - Soft reminder shown on target program page
 *
 * Shows when:
 * - status = interview_invited
 * - interview_date is null
 * - interview_date_unknown = true
 * - interview_date_ask_count < 3
 * - last asked > 24 hours ago
 */
export function InterviewDateBanner({
  programName,
  onAddDate,
  onDismiss,
  askCount = 0,
}) {
  return (
    <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-100 shrink-0">
          <Calendar className="w-5 h-5 text-teal-600" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-teal-900">
            Do you know your interview date yet?
          </p>
          <p className="text-sm text-teal-700 mt-0.5">
            Adding it helps you stay organized and we'll remind you to prepare!
          </p>
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              onClick={onAddDate}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Add Interview Date
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              className="text-teal-600 hover:text-teal-700 hover:bg-teal-100"
            >
              Not yet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook for managing interview date reminders
 */
export function useInterviewDateReminders() {
  // TODO: Connect to Supabase
  // For now, use localStorage to track state

  const getRemindersForProgram = (programId) => {
    const stored = localStorage.getItem(`interview_reminder_${programId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      askCount: 0,
      lastAsked: null,
      dismissed: false,
    };
  };

  const incrementAskCount = (programId) => {
    const current = getRemindersForProgram(programId);
    const updated = {
      ...current,
      askCount: current.askCount + 1,
      lastAsked: new Date().toISOString(),
    };
    localStorage.setItem(`interview_reminder_${programId}`, JSON.stringify(updated));
    return updated;
  };

  const dismissReminder = (programId, permanent = false) => {
    const current = getRemindersForProgram(programId);
    const updated = {
      ...current,
      dismissed: permanent,
      lastAsked: new Date().toISOString(),
    };
    localStorage.setItem(`interview_reminder_${programId}`, JSON.stringify(updated));
    return updated;
  };

  const shouldShowBanner = (programId) => {
    const { askCount, lastAsked, dismissed } = getRemindersForProgram(programId);

    if (dismissed) return false;
    if (askCount >= 3) return false;

    if (!lastAsked) return true;

    const hoursSinceLastAsk = (Date.now() - new Date(lastAsked).getTime()) / (1000 * 60 * 60);
    return hoursSinceLastAsk >= 24;
  };

  const shouldShowToast = (programId) => {
    const { askCount, lastAsked, dismissed } = getRemindersForProgram(programId);

    if (dismissed) return false;
    if (askCount < 3) return false;

    if (!lastAsked) return true;

    const daysSinceLastAsk = (Date.now() - new Date(lastAsked).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceLastAsk >= 7;
  };

  const clearReminder = (programId) => {
    localStorage.removeItem(`interview_reminder_${programId}`);
  };

  return {
    getRemindersForProgram,
    incrementAskCount,
    dismissReminder,
    shouldShowBanner,
    shouldShowToast,
    clearReminder,
  };
}

export default InterviewDateModal;
