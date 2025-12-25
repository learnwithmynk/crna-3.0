/**
 * RelativeTime Component
 *
 * Displays timestamps as relative time (e.g., "3 hours ago", "2 days ago").
 * Updates automatically at appropriate intervals.
 *
 * Usage:
 *   <RelativeTime date={topic.last_active} />
 *   <RelativeTime date="2024-12-11T14:22:00" prefix="Last active" />
 */

import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

// Time intervals in milliseconds
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

/**
 * Format a date as relative time
 */
function formatRelativeTime(date) {
  const now = new Date();
  const then = new Date(date);
  const diff = now - then;

  // Future dates
  if (diff < 0) {
    return 'just now';
  }

  // Less than a minute
  if (diff < MINUTE) {
    return 'just now';
  }

  // Less than an hour
  if (diff < HOUR) {
    const minutes = Math.floor(diff / MINUTE);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  // Less than a day
  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  // Less than a week
  if (diff < WEEK) {
    const days = Math.floor(diff / DAY);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }

  // Less than a month
  if (diff < MONTH) {
    const weeks = Math.floor(diff / WEEK);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }

  // Less than a year
  if (diff < YEAR) {
    const months = Math.floor(diff / MONTH);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }

  // More than a year
  const years = Math.floor(diff / YEAR);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}

/**
 * Get the update interval based on how old the date is
 */
function getUpdateInterval(date) {
  const diff = new Date() - new Date(date);

  if (diff < HOUR) return MINUTE; // Update every minute for recent times
  if (diff < DAY) return HOUR; // Update every hour for today
  return DAY; // Update daily for older dates
}

export function RelativeTime({
  date,
  prefix,
  suffix,
  className,
  showTooltip = true,
  live = true,
  ...props
}) {
  const [relativeTime, setRelativeTime] = useState(() => formatRelativeTime(date));

  // Format absolute date for tooltip
  const absoluteDate = useMemo(() => {
    if (!date) return '';
    return new Date(date).toLocaleString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }, [date]);

  // Update relative time at appropriate intervals
  useEffect(() => {
    if (!live || !date) return;

    const updateTime = () => {
      setRelativeTime(formatRelativeTime(date));
    };

    // Initial update
    updateTime();

    // Set up interval for live updates
    const interval = getUpdateInterval(date);
    const timer = setInterval(updateTime, interval);

    return () => clearInterval(timer);
  }, [date, live]);

  if (!date) {
    return null;
  }

  const content = (
    <>
      {prefix && <span>{prefix} </span>}
      {relativeTime}
      {suffix && <span> {suffix}</span>}
    </>
  );

  if (showTooltip) {
    return (
      <time
        dateTime={new Date(date).toISOString()}
        title={absoluteDate}
        className={cn('text-gray-500 text-sm cursor-help', className)}
        {...props}
      >
        {content}
      </time>
    );
  }

  return (
    <time
      dateTime={new Date(date).toISOString()}
      className={cn('text-gray-500 text-sm', className)}
      {...props}
    >
      {content}
    </time>
  );
}

// Export the format function for use elsewhere
export { formatRelativeTime };

export default RelativeTime;
