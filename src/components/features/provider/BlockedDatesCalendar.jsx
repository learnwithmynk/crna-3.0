/**
 * BlockedDatesCalendar Component
 *
 * Allows providers using "Requires Confirmation" booking model to manage unavailable dates.
 * Supports both single-day blocking and date ranges with optional reasons.
 *
 * Used in provider availability settings to prevent applicants from requesting dates
 * when the provider is unavailable (vacation, conference, personal time, etc.).
 *
 * Props:
 * - blockedDates: Array of { id, startDate, endDate, reason? } objects
 * - onAddBlockedDate: Callback (startDate, endDate, reason?) to add new blocked date
 * - onRemoveBlockedDate: Callback (id) to remove a blocked date
 */

import { useState } from 'react';
import { Calendar, Plus, X, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Calculate number of days in a date range (inclusive)
 */
function calculateDays(startDate, endDate) {
  if (!endDate) return 1; // Single day
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Include both start and end dates
}

/**
 * Format date to readable string
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format date range for display
 */
function formatDateRange(startDate, endDate) {
  if (!endDate || startDate === endDate) {
    return formatDate(startDate);
  }
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

/**
 * Individual blocked date card
 */
function BlockedDateCard({ blockedDate, onRemove }) {
  const { id, startDate, endDate, reason } = blockedDate;
  const days = calculateDays(startDate, endDate);

  return (
    <Card className="border-2 border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-gray-500 shrink-0" />
              <span className="font-medium text-gray-900">
                {formatDateRange(startDate, endDate)}
              </span>
              <Badge variant="secondary" className="shrink-0">
                {days} {days === 1 ? 'day' : 'days'}
              </Badge>
            </div>
            {reason && (
              <p className="text-sm text-gray-600 ml-6">
                {reason}
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(id)}
            className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Form to add new blocked date
 */
function AddBlockedDateForm({ onAdd, onCancel }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({});

  // Get today's date in YYYY-MM-DD format for min date validation
  const today = new Date().toISOString().split('T')[0];

  const validate = () => {
    const newErrors = {};

    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }

    // If end date is provided, make sure it's after start date
    if (endDate && startDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      onAdd(startDate, endDate || startDate, reason || null);

      // Reset form
      setStartDate('');
      setEndDate('');
      setReason('');
      setErrors({});
    }
  };

  const handleCancel = () => {
    setStartDate('');
    setEndDate('');
    setReason('');
    setErrors({});
    onCancel();
  };

  const days = startDate ? calculateDays(startDate, endDate || startDate) : 0;

  return (
    <Card className="border-2 border-primary/30 bg-primary/5">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="start-date">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="start-date"
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={cn(errors.startDate && 'border-red-500')}
              />
              {errors.startDate && (
                <p className="text-xs text-red-600">{errors.startDate}</p>
              )}
            </div>

            {/* End Date (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="end-date">
                End Date <span className="text-gray-500 text-xs">(optional)</span>
              </Label>
              <Input
                id="end-date"
                type="date"
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={!startDate}
                className={cn(errors.endDate && 'border-red-500')}
              />
              {errors.endDate && (
                <p className="text-xs text-red-600">{errors.endDate}</p>
              )}
              {!errors.endDate && startDate && (
                <p className="text-xs text-gray-500">
                  Leave blank to block single day
                </p>
              )}
            </div>
          </div>

          {/* Reason (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason <span className="text-gray-500 text-xs">(optional)</span>
            </Label>
            <Input
              id="reason"
              type="text"
              placeholder="e.g., Conference, Vacation, Personal"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={100}
            />
            <p className="text-xs text-gray-500">
              Help applicants understand why you're unavailable
            </p>
          </div>

          {/* Days preview */}
          {days > 0 && (
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">
                Blocking <strong>{days}</strong> {days === 1 ? 'day' : 'days'}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              type="submit"
              size="sm"
              className="flex-1"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Blocked Date
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/**
 * Main BlockedDatesCalendar Component
 */
export function BlockedDatesCalendar({
  blockedDates = [],
  onAddBlockedDate,
  onRemoveBlockedDate
}) {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = (startDate, endDate, reason) => {
    onAddBlockedDate?.(startDate, endDate, reason);
    setShowAddForm(false);
  };

  const handleRemove = (id) => {
    onRemoveBlockedDate?.(id);
  };

  // Calculate total blocked days
  const totalBlockedDays = blockedDates.reduce((total, blockedDate) => {
    return total + calculateDays(blockedDate.startDate, blockedDate.endDate);
  }, 0);

  return (
    <div className="space-y-4">
      {/* Header with summary */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                Blocked Dates
              </CardTitle>
              <CardDescription className="mt-1">
                Mark dates when you're unavailable so applicants don't request them
              </CardDescription>
            </div>
            {!showAddForm && (
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Blocked Date
              </Button>
            )}
          </div>
        </CardHeader>

        {/* Summary stats */}
        {blockedDates.length > 0 && (
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <Badge variant="secondary">
                {blockedDates.length} {blockedDates.length === 1 ? 'period' : 'periods'}
              </Badge>
              <span className="text-sm text-gray-600">•</span>
              <span className="text-sm text-gray-700">
                <strong>{totalBlockedDays}</strong> {totalBlockedDays === 1 ? 'day' : 'days'} blocked
              </span>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Add form (conditionally shown) */}
      {showAddForm && (
        <AddBlockedDateForm
          onAdd={handleAdd}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* List of blocked dates */}
      {blockedDates.length > 0 ? (
        <div className="space-y-3">
          {blockedDates
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
            .map((blockedDate) => (
              <BlockedDateCard
                key={blockedDate.id}
                blockedDate={blockedDate}
                onRemove={handleRemove}
              />
            ))}
        </div>
      ) : (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-1">
              No blocked dates yet
            </p>
            <p className="text-xs text-gray-500">
              Add dates when you'll be unavailable to prevent booking requests
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default BlockedDatesCalendar;
