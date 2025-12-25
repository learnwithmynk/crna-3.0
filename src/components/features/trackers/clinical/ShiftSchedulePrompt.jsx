/**
 * ShiftSchedulePrompt Component
 *
 * Schedule-aware prompts that appear based on user's shift pattern.
 * Includes fun motivational messages like "Wow! You worked last night and you're here! 🌟"
 */

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Clock,
  TrendingUp,
  Coffee,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Calculate days since last log
 */
function getDaysSinceLastLog(entries) {
  if (!entries || entries.length === 0) return null;

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.shiftDate) - new Date(a.shiftDate)
  );

  const lastDate = new Date(sortedEntries[0].shiftDate);
  const today = new Date();
  const diffTime = today - lastDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Check if user worked last night (logged a night shift yesterday)
 */
function workedLastNight(entries) {
  if (!entries || entries.length === 0) return false;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  return entries.some(
    (e) => e.shiftDate === yesterdayStr && e.shiftType === 'night'
  );
}

/**
 * Get time of day greeting
 */
function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

/**
 * Motivational messages for night shift workers logging in the morning
 */
const NIGHT_SHIFT_MESSAGES = [
  { emoji: '🌟', message: "Wow! You worked last night and you're here logging! Dedication!" },
  { emoji: '☕', message: "Post-night shift and still tracking? You're a rockstar!" },
  { emoji: '💪', message: "Logging after a night shift? That's commitment!" },
  { emoji: '🎯', message: "Night shift warriors who track are unstoppable!" },
];

/**
 * Messages for consistent loggers
 */
const STREAK_MESSAGES = [
  { emoji: '🔥', message: "You're on fire! Keep that momentum going!" },
  { emoji: '⭐', message: "Consistency is key - you've got it!" },
  { emoji: '🚀', message: "Your future CRNA program will love this dedication!" },
];

/**
 * Messages for users who haven't logged recently
 */
const CATCH_UP_MESSAGES = [
  { days: 4, message: "It's been a few days - time to catch up on your recent shifts?" },
  { days: 7, message: "A week since your last log! Don't forget those great experiences." },
  { days: 14, message: "We miss you! Log your recent shifts while the memories are fresh." },
];

/**
 * Main ShiftSchedulePrompt component
 */
export function ShiftSchedulePrompt({ entries, onLogShift, className }) {
  const daysSince = useMemo(() => getDaysSinceLastLog(entries), [entries]);
  const isPostNightShift = useMemo(() => workedLastNight(entries), [entries]);
  const timeOfDay = getTimeGreeting();

  // Post-night shift celebration
  if (isPostNightShift && timeOfDay === 'morning') {
    const msg = NIGHT_SHIFT_MESSAGES[Math.floor(Math.random() * NIGHT_SHIFT_MESSAGES.length)];
    return (
      <Card
        className={cn(
          'p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-100',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="text-3xl">{msg.emoji}</div>
          <div className="flex-1">
            <p className="font-medium text-purple-900">{msg.message}</p>
            <p className="text-sm text-purple-700 mt-1">
              Your post-shift logging is building a powerful interview prep library!
            </p>
          </div>
          <Coffee className="w-8 h-8 text-purple-300" />
        </div>
      </Card>
    );
  }

  // Catch-up prompt for users who haven't logged recently
  if (daysSince !== null && daysSince >= 4) {
    const catchUpMsg = CATCH_UP_MESSAGES.find((m) => daysSince >= m.days) ||
      CATCH_UP_MESSAGES[0];

    return (
      <Card
        className={cn(
          'p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-100',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <Clock className="w-8 h-8 text-amber-400" />
          <div className="flex-1">
            <p className="font-medium text-amber-900">{catchUpMsg.message}</p>
            <p className="text-sm text-amber-700 mt-1">
              {daysSince} days since your last log
            </p>
          </div>
          <Button size="sm" onClick={onLogShift}>
            Log Shift
          </Button>
        </div>
      </Card>
    );
  }

  // Streak celebration (logged recently and consistently)
  if (daysSince !== null && daysSince <= 2 && entries.length >= 3) {
    const streakMsg = STREAK_MESSAGES[Math.floor(Math.random() * STREAK_MESSAGES.length)];
    return (
      <Card
        className={cn(
          'p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-100',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="text-3xl">{streakMsg.emoji}</div>
          <div className="flex-1">
            <p className="font-medium text-green-900">{streakMsg.message}</p>
            <p className="text-sm text-green-700 mt-1">
              {entries.length} shifts logged and counting!
            </p>
          </div>
          <TrendingUp className="w-8 h-8 text-green-300" />
        </div>
      </Card>
    );
  }

  // Default: Simple encouraging prompt
  return (
    <Card
      className={cn(
        'p-4 bg-gradient-to-r from-gray-50 to-slate-50 border-gray-100',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-gray-400" />
        <div className="flex-1">
          <p className="text-sm text-gray-600">
            Good {timeOfDay}! Every shift you log builds your interview prep library.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onLogShift}>
          Log Shift
        </Button>
      </div>
    </Card>
  );
}

export default ShiftSchedulePrompt;
