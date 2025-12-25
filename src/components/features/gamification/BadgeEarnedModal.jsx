/**
 * BadgeEarnedModal - Celebration modal when user earns a badge
 *
 * Displays badge details with celebratory styling.
 * Uses Supabase for gamification data (not WordPress).
 */

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Target,
  Heart,
  MessageCircle,
  Send,
  BookOpen,
  Flag
} from 'lucide-react';

// Badge configuration matching gamification-system.md
const BADGES = {
  target_trailblazer: {
    name: 'Target Trailblazer',
    description: 'Convert at least 3 Target Programs',
    icon: Target,
    color: 'from-blue-400 to-blue-600',
    category: 'Progression',
  },
  critical_care_crusher: {
    name: 'Critical Care Crusher',
    description: 'Submit at least 20 Clinical Tracker entries',
    icon: Heart,
    color: 'from-red-400 to-red-600',
    category: 'Engagement',
  },
  top_contributor: {
    name: 'Top Contributor',
    description: 'Comment in community at least 10 times',
    icon: MessageCircle,
    color: 'from-purple-400 to-purple-600',
    category: 'Community',
  },
  feedback_champion: {
    name: 'Feedback Champion',
    description: 'Submit "Let Us Know" form at least 3 times',
    icon: Send,
    color: 'from-green-400 to-green-600',
    category: 'Contribution',
  },
  lesson_legend: {
    name: 'Lesson Legend',
    description: 'Complete at least 20 lessons',
    icon: BookOpen,
    color: 'from-orange-400 to-orange-600',
    category: 'Learning',
  },
  milestone_machine: {
    name: 'Milestone Machine',
    description: 'Complete at least 7 milestones',
    icon: Flag,
    color: 'from-yellow-400 to-yellow-600',
    category: 'Mastery',
  },
};

export function BadgeEarnedModal({
  open,
  onOpenChange,
  badgeId = 'target_trailblazer',
  earnedAt = new Date(),
}) {
  const badge = BADGES[badgeId] || BADGES.target_trailblazer;
  const BadgeIcon = badge.icon;

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(earnedAt instanceof Date ? earnedAt : new Date(earnedAt));

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

        {/* Badge icon */}
        <div className="flex justify-center pt-4">
          <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-lg`}>
            <BadgeIcon className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Celebration text */}
        <div className="space-y-2 pt-4">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">
            Badge Unlocked!
          </p>
          <h2 className="text-2xl font-bold text-gray-900">
            {badge.name}
          </h2>
          <p className="text-gray-600">
            {badge.description}
          </p>
        </div>

        {/* Category & date */}
        <div className="flex items-center justify-center gap-4 py-2 text-sm text-gray-500">
          <span className="px-2 py-1 bg-gray-100 rounded-full">
            {badge.category}
          </span>
          <span>Earned {formattedDate}</span>
        </div>

        {/* CTA */}
        <div className="pt-4 pb-2">
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Awesome!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { BADGES };
