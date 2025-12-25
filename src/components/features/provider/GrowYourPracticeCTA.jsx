/**
 * GrowYourPracticeCTA Component
 *
 * Encourages providers/mentors to grow their practice through community engagement.
 * Displays actionable checklist with gamification points and engagement score.
 * Features gradient background and clear CTAs to community and social templates.
 *
 * Props:
 * - completedActions: array of action IDs that are completed (e.g., ['forums', 'questions'])
 * - engagementScore: number representing total engagement points
 * - onActionComplete: function(actionId) - callback when action checkbox is toggled
 */

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TrendingUp, MessageSquare, Users, Video, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const ENGAGEMENT_ACTIONS = [
  {
    id: 'forums',
    label: 'Post in the forums',
    points: 2,
    icon: MessageSquare,
    unit: 'each',
  },
  {
    id: 'questions',
    label: 'Answer questions in groups',
    points: 2,
    icon: Users,
    unit: 'each',
  },
  {
    id: 'live-qa',
    label: 'Host a live Q&A call',
    points: 10,
    icon: Video,
    unit: '',
  },
  {
    id: 'social',
    label: 'Share your profile on social media',
    points: null,
    icon: Share2,
    unit: '',
  },
];

export function GrowYourPracticeCTA({
  completedActions = [],
  engagementScore = 0,
  onActionComplete,
  className,
}) {
  const handleActionToggle = (actionId) => {
    if (onActionComplete) {
      onActionComplete(actionId);
    }
  };

  return (
    <Card
      className={cn(
        'border-none shadow-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white overflow-hidden',
        className
      )}
      data-testid="grow-your-practice"
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-6 h-6" />
            <h3 className="text-xl font-bold">Grow Your Practice</h3>
          </div>
          <p className="text-white/90 text-sm">
            Get more clients by engaging with the community
          </p>
        </div>

        {/* Action Checklist */}
        <div className="space-y-3 mb-6">
          {ENGAGEMENT_ACTIONS.map((action) => {
            const isCompleted = completedActions.includes(action.id);
            const Icon = action.icon;

            return (
              <div
                key={action.id}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-xl transition-all',
                  'bg-white/10 backdrop-blur-sm border border-white/20',
                  'hover:bg-white/20 hover:border-white/40'
                )}
              >
                {/* Checkbox */}
                <Checkbox
                  id={action.id}
                  checked={isCompleted}
                  onCheckedChange={() => handleActionToggle(action.id)}
                  className="mt-0.5 border-white/50 bg-white/20 data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-purple-600"
                />

                {/* Icon */}
                <Icon className="w-5 h-5 mt-0.5 flex-shrink-0 opacity-90" />

                {/* Label and Points */}
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor={action.id}
                    className={cn(
                      'text-sm font-medium cursor-pointer block',
                      isCompleted && 'line-through opacity-75'
                    )}
                  >
                    {action.label}
                  </label>
                  {action.points && (
                    <span className="text-xs text-white/80">
                      {action.points} pts{action.unit ? ` ${action.unit}` : ''}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Button
            variant="default"
            className="flex-1 bg-white text-purple-600 hover:bg-gray-100 border-2 border-white font-semibold min-h-[44px]"
            onClick={() => {
              // TODO: Replace with actual navigation
              window.location.href = '/community';
            }}
          >
            Go to Community
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-transparent text-white border-2 border-white hover:bg-white/10 font-semibold min-h-[44px]"
            onClick={() => {
              // TODO: Replace with actual Canva templates URL
              window.open('https://www.canva.com/templates/', '_blank');
            }}
          >
            Download Social Templates
          </Button>
        </div>

        {/* Engagement Score Display */}
        <div className="pt-4 border-t border-white/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{engagementScore} points</div>
              <div className="text-xs text-white/80">Your engagement score</div>
            </div>
            <TrendingUp className="w-8 h-8 opacity-60" />
          </div>
          <p className="text-xs text-white/70 mt-2">
            Higher engagement = better search ranking
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default GrowYourPracticeCTA;
