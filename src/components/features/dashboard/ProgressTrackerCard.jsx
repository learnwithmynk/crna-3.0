/**
 * ProgressTrackerCard - Compact gamification widget
 *
 * Displays:
 * - Level badge (top-left)
 * - Streak fire + count (top-right)
 * - Large XP number with "TOTAL XP" label
 * - Next Level Progress bar with percentage
 *
 * Compact rectangular design matching Skool-style reference
 *
 * Used in: DashboardPage sidebar
 */

import React from 'react';
import { Flame, Trophy } from 'lucide-react';

export function ProgressTrackerCard({
  points = 0,
  level = 1,
  levelName = 'Beginner',
  nextLevelProgress = 0,
  pointsToNextLevel = 100,
  streak = 0,
}) {
  return (
    <div className="bg-gradient-to-br from-[#FFF9E6] via-[#FFFBF0] to-[#FFF5E0] rounded-[2.5rem] shadow-sm p-5">
      {/* Top row: Level badge + Streak */}
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-200/60 text-amber-800 text-xs font-bold tracking-widest">
          <Trophy className="w-3.5 h-3.5" />
          LEVEL {level}
        </span>
        {streak > 0 && (
          <div className="flex items-center gap-1 text-orange-600 font-bold text-base">
            <Flame className="w-5 h-5 fill-orange-500 text-orange-500" />
            <span>{streak}</span>
          </div>
        )}
      </div>

      {/* Large XP display */}
      <div className="text-center mb-5">
        <div className="text-5xl font-black text-gray-800 tracking-tight">{points.toLocaleString()}</div>
        <div className="text-xs font-semibold text-gray-400 tracking-widest mt-1">TOTAL XP</div>
      </div>

      {/* Progress section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Next Level</span>
          <span className="text-sm font-bold text-gray-500">{Math.round(nextLevelProgress)}%</span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200/60 rounded-full overflow-hidden mb-2">
          <div
            className="h-full rounded-full bg-amber-400 transition-all duration-500"
            style={{ width: `${nextLevelProgress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 text-center">{pointsToNextLevel.toLocaleString()} XP to level {level + 1}</p>
      </div>
    </div>
  );
}

export default ProgressTrackerCard;
