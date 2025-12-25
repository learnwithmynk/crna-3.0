/**
 * LevelUpModal - Celebration modal when user reaches a new level
 *
 * Displays a celebratory animation and level details when triggered.
 * Uses Supabase for gamification data (not WordPress).
 */

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Sparkles } from 'lucide-react';

// Level configuration matching gamification-system.md
const LEVELS = {
  1: { name: 'Aspiring Applicant', points: 20, color: 'from-gray-400 to-gray-500' },
  2: { name: 'Dedicated Dreamer', points: 200, color: 'from-green-400 to-green-500' },
  3: { name: 'Ambitious Achiever', points: 600, color: 'from-blue-400 to-blue-500' },
  4: { name: 'Committed Candidate', points: 1000, color: 'from-purple-400 to-purple-500' },
  5: { name: 'Goal Crusher', points: 1600, color: 'from-orange-400 to-orange-500' },
  6: { name: 'Peak Performer', points: 2000, color: 'from-yellow-400 to-primary' },
};

export function LevelUpModal({
  open,
  onOpenChange,
  newLevel = 2,
  totalPoints = 200,
}) {
  const levelInfo = LEVELS[newLevel] || LEVELS[1];
  const nextLevel = LEVELS[newLevel + 1];
  const progressToNext = nextLevel
    ? Math.round(((totalPoints - levelInfo.points) / (nextLevel.points - levelInfo.points)) * 100)
    : 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center border-0 bg-gradient-to-br from-primary-50 via-white to-purple-50">
        {/* Decorative sparkles */}
        <div className="absolute -top-2 -left-2 text-yellow-400 animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="absolute -top-2 -right-2 text-yellow-400 animate-pulse delay-75">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-yellow-400 animate-pulse delay-150">
          <Sparkles className="w-6 h-6" />
        </div>

        {/* Level badge */}
        <div className="flex justify-center pt-4">
          <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${levelInfo.color} flex items-center justify-center shadow-lg`}>
            <Trophy className="w-12 h-12 text-white" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary border-2 border-white flex items-center justify-center font-bold text-black">
              {newLevel}
            </div>
          </div>
        </div>

        {/* Celebration text */}
        <div className="space-y-2 pt-4">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">
            Level Up!
          </p>
          <h2 className="text-2xl font-bold text-gray-900">
            {levelInfo.name}
          </h2>
          <p className="text-gray-600">
            You've reached Level {newLevel}!
          </p>
        </div>

        {/* Points display */}
        <div className="flex items-center justify-center gap-2 py-2">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <span className="text-lg font-semibold">{totalPoints.toLocaleString()} points</span>
        </div>

        {/* Progress to next level */}
        {nextLevel && (
          <div className="space-y-2 px-4">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Progress to Level {newLevel + 1}</span>
              <span>{nextLevel.points - totalPoints} pts to go</span>
            </div>
            <Progress value={progressToNext} className="h-2" />
            <p className="text-xs text-gray-400">
              Next: {nextLevel.name}
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="pt-4 pb-2">
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Keep Going!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { LEVELS };
