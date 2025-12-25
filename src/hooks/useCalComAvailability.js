/**
 * useCalComAvailability Hook
 *
 * Fetches available time slots from Cal.com for booking.
 * Handles timezone conversion and slot selection.
 *
 * TODO: Connect to Cal.com API when credentials are configured
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { getAvailableSlots } from '@/lib/calcom';

// Timezone options (most common US timezones)
export const TIMEZONE_OPTIONS = [
  { value: 'America/New_York', label: 'Eastern (ET)', abbr: 'ET' },
  { value: 'America/Chicago', label: 'Central (CT)', abbr: 'CT' },
  { value: 'America/Denver', label: 'Mountain (MT)', abbr: 'MT' },
  { value: 'America/Los_Angeles', label: 'Pacific (PT)', abbr: 'PT' },
  { value: 'America/Phoenix', label: 'Arizona (MST)', abbr: 'MST' },
  { value: 'America/Anchorage', label: 'Alaska (AKT)', abbr: 'AKT' },
  { value: 'Pacific/Honolulu', label: 'Hawaii (HST)', abbr: 'HST' }
];

/**
 * Detect user's timezone
 */
export function detectTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'America/New_York';
  }
}

/**
 * Main hook for fetching available slots
 */
export function useCalComAvailability(options = {}) {
  const {
    eventTypeId,
    providerId,
    startDate, // ISO date string (YYYY-MM-DD)
    endDate,   // ISO date string (YYYY-MM-DD)
    timezone = detectTimezone(),
    duration = 60 // Service duration in minutes
  } = options;

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!eventTypeId || !startDate || !endDate) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchSlots = async () => {
      try {
        const availableSlots = await getAvailableSlots(
          eventTypeId,
          startDate,
          endDate,
          timezone
        );

        if (!cancelled) {
          setSlots(availableSlots);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load availability');
          setSlots([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchSlots();

    return () => {
      cancelled = true;
    };
  }, [eventTypeId, startDate, endDate, timezone]);

  // Group slots by date for calendar display
  const slotsByDate = useMemo(() => {
    const grouped = {};

    slots.forEach(slot => {
      const date = new Date(slot.time).toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(slot);
    });

    // Sort slots within each date
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => new Date(a.time) - new Date(b.time));
    });

    return grouped;
  }, [slots]);

  // Get available dates (for calendar highlighting)
  const availableDates = useMemo(() => {
    return Object.keys(slotsByDate);
  }, [slotsByDate]);

  // Get slots for a specific date
  const getSlotsForDate = useCallback((date) => {
    return slotsByDate[date] || [];
  }, [slotsByDate]);

  // Format slot time for display
  const formatSlotTime = useCallback((slot, format = 'short') => {
    const date = new Date(slot.time);

    if (format === 'short') {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: timezone
      });
    }

    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: timezone
    });
  }, [timezone]);

  return {
    slots,
    slotsByDate,
    availableDates,
    getSlotsForDate,
    formatSlotTime,
    loading,
    error,
    isEmpty: !loading && slots.length === 0
  };
}

/**
 * Hook for managing time slot selection (multi-select for Requires Confirmation)
 */
export function useSlotSelection(maxSelections = 3) {
  const [selectedSlots, setSelectedSlots] = useState([]);

  const selectSlot = useCallback((slot) => {
    setSelectedSlots(prev => {
      // Check if already selected
      const exists = prev.some(s => s.time === slot.time);
      if (exists) return prev;

      // Check max selections
      if (prev.length >= maxSelections) {
        // Replace the oldest selection
        return [...prev.slice(1), slot];
      }

      return [...prev, slot];
    });
  }, [maxSelections]);

  const deselectSlot = useCallback((slot) => {
    setSelectedSlots(prev =>
      prev.filter(s => s.time !== slot.time)
    );
  }, []);

  const toggleSlot = useCallback((slot) => {
    const isSelected = selectedSlots.some(s => s.time === slot.time);
    if (isSelected) {
      deselectSlot(slot);
    } else {
      selectSlot(slot);
    }
  }, [selectedSlots, selectSlot, deselectSlot]);

  const clearSelection = useCallback(() => {
    setSelectedSlots([]);
  }, []);

  const isSelected = useCallback((slot) => {
    return selectedSlots.some(s => s.time === slot.time);
  }, [selectedSlots]);

  // Sort selected slots chronologically
  const sortedSelections = useMemo(() => {
    return [...selectedSlots].sort((a, b) =>
      new Date(a.time) - new Date(b.time)
    );
  }, [selectedSlots]);

  return {
    selectedSlots: sortedSelections,
    selectSlot,
    deselectSlot,
    toggleSlot,
    clearSelection,
    isSelected,
    canSelectMore: selectedSlots.length < maxSelections,
    selectionCount: selectedSlots.length
  };
}

/**
 * Hook for timezone picker
 */
export function useTimezone() {
  const [timezone, setTimezone] = useState(detectTimezone);

  // Get timezone label
  const timezoneLabel = useMemo(() => {
    const option = TIMEZONE_OPTIONS.find(tz => tz.value === timezone);
    return option?.label || timezone;
  }, [timezone]);

  // Get current time in selected timezone
  const currentTime = useMemo(() => {
    return new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: timezone
    });
  }, [timezone]);

  return {
    timezone,
    setTimezone,
    timezoneLabel,
    currentTime,
    timezoneOptions: TIMEZONE_OPTIONS
  };
}

/**
 * Hook for date range selection (for availability calendar)
 */
export function useDateRange(defaultDays = 14) {
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [endDate, setEndDate] = useState(() => {
    const end = new Date();
    end.setDate(end.getDate() + defaultDays);
    return end.toISOString().split('T')[0];
  });

  const goToNextWeek = useCallback(() => {
    const newStart = new Date(startDate);
    newStart.setDate(newStart.getDate() + 7);

    const newEnd = new Date(endDate);
    newEnd.setDate(newEnd.getDate() + 7);

    setStartDate(newStart.toISOString().split('T')[0]);
    setEndDate(newEnd.toISOString().split('T')[0]);
  }, [startDate, endDate]);

  const goToPrevWeek = useCallback(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const newStart = new Date(startDate);
    newStart.setDate(newStart.getDate() - 7);

    // Don't go before today
    if (newStart.toISOString().split('T')[0] < todayStr) {
      return;
    }

    const newEnd = new Date(endDate);
    newEnd.setDate(newEnd.getDate() - 7);

    setStartDate(newStart.toISOString().split('T')[0]);
    setEndDate(newEnd.toISOString().split('T')[0]);
  }, [startDate, endDate]);

  const canGoPrev = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const checkDate = new Date(startDate);
    checkDate.setDate(checkDate.getDate() - 7);
    return checkDate.toISOString().split('T')[0] >= today;
  }, [startDate]);

  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    goToNextWeek,
    goToPrevWeek,
    canGoPrev
  };
}

export default useCalComAvailability;
