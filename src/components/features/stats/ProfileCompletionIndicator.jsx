/**
 * ProfileCompletionIndicator
 *
 * Visual progress indicator for the "Complete your profile" onboarding step.
 * Shows 0/3, 1/3, 2/3, 3/3 progress with action suggestions.
 *
 * Displays near the My Stats page header.
 * When complete, shows a toast instead of a banner, then hides.
 */

import { useState, useEffect, useRef } from 'react';
import { Check, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function ProfileCompletionIndicator({
  completedCount,
  requiredActions = 3,
  isComplete,
  pointsReward = 20,
  completedLabels = [],
  suggestedActions = [],
  onDismiss,
  className,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasShownToastRef = useRef(false);

  // Show toast when complete, then auto-dismiss
  useEffect(() => {
    if (isComplete && !hasShownToastRef.current) {
      hasShownToastRef.current = true;
      toast.success(`Profile started! +${pointsReward} points earned`, {
        description: 'Keep adding details to improve your ReadyScore.',
      });
      // Auto-dismiss the indicator after showing toast
      onDismiss?.();
    }
  }, [isComplete, pointsReward, onDismiss]);

  // Don't render if complete
  if (isComplete) {
    return null;
  }

  // Progress state
  return (
    <div
      className={cn(
        'bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/60 overflow-hidden',
        className
      )}
    >
      {/* Main bar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center gap-3 text-left hover:bg-amber-100/30 transition-colors"
      >
        {/* Progress circles */}
        <div className="flex items-center gap-1.5">
          {[...Array(requiredActions)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center transition-colors',
                i < completedCount
                  ? 'bg-green-500'
                  : 'bg-gray-200'
              )}
            >
              {i < completedCount && (
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              )}
            </div>
          ))}
        </div>

        {/* Text */}
        <div className="flex-1">
          <p className="font-semibold text-gray-900">
            {completedCount}/{requiredActions} complete
          </p>
          <p className="text-sm text-gray-500">
            {requiredActions - completedCount === 1
              ? 'Add 1 more to earn '
              : `Add ${requiredActions - completedCount} more to earn `}
            <span className="font-semibold text-amber-600">+{pointsReward} pts</span>
          </p>
        </div>

        {/* Points badge */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full">
            <span className="text-sm font-bold text-white flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {pointsReward} pts
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-amber-100 animate-in slide-in-from-top-1 duration-200">
          {/* Completed actions */}
          {completedLabels.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-500 mb-1.5">Completed:</p>
              <div className="flex flex-wrap gap-1.5">
                {completedLabels.map((label, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
                  >
                    <Check className="w-3 h-3" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggested actions */}
          {suggestedActions.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1.5">
                Quick ways to complete:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestedActions.slice(0, 4).map((action) => (
                  <span
                    key={action.id}
                    className="px-2 py-1 bg-white border border-gray-200 text-gray-600 rounded-full text-xs"
                  >
                    {action.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileCompletionIndicator;
