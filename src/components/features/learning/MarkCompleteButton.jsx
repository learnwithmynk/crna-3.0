/**
 * MarkCompleteButton Component
 *
 * Button to mark a lesson as complete.
 * Shows completion state and awards gamification points.
 * Includes celebration animation on completion.
 *
 * Used in: LessonPage
 */

import { useState } from 'react';
import { CheckCircle2, Circle, Loader2, Sparkles, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * @param {Object} props
 * @param {boolean} props.isCompleted - Whether lesson is already completed
 * @param {boolean} props.isLoading - Loading state
 * @param {Function} props.onMarkComplete - Called when marking complete
 * @param {Function} props.onMarkIncomplete - Called when unmarking (optional)
 * @param {boolean} props.showUndo - Show undo option after completion
 * @param {string} props.className - Additional classes
 */
export function MarkCompleteButton({
  isCompleted,
  isLoading,
  onMarkComplete,
  onMarkIncomplete,
  showUndo = true,
  className,
}) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  const handleComplete = async () => {
    if (isCompleted || isLoading) return;

    const result = await onMarkComplete?.();

    if (result?.error) {
      // Error handled by parent
      return;
    }

    // Show celebration
    setShowCelebration(true);
    setJustCompleted(true);

    // Hide celebration after animation
    setTimeout(() => {
      setShowCelebration(false);
    }, 2000);
  };

  const handleUndo = async () => {
    if (isLoading) return;

    await onMarkIncomplete?.();
    setJustCompleted(false);
  };

  // Already completed state
  if (isCompleted && !justCompleted) {
    return (
      <div className={cn('relative', className)}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 border border-green-200">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-700">Completed</span>
          </div>

          {showUndo && onMarkIncomplete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndo}
              disabled={isLoading}
              className="text-gray-500 hover:text-gray-700"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Undo2 className="w-4 h-4 mr-1" />
                  Undo
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Just completed state with celebration
  if (justCompleted) {
    return (
      <div className={cn('relative', className)}>
        {/* Celebration animation */}
        {showCelebration && <CelebrationEffect />}

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 animate-in zoom-in-95">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <div>
              <span className="font-semibold text-green-700 block">
                Great job!
              </span>
              <span className="text-sm text-green-600">
                +3 points earned
              </span>
            </div>
          </div>

          {showUndo && onMarkIncomplete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndo}
              disabled={isLoading}
              className="text-gray-500 hover:text-gray-700"
            >
              <Undo2 className="w-4 h-4 mr-1" />
              Undo
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Default state - not completed
  return (
    <div className={cn('relative', className)}>
      <Button
        size="lg"
        onClick={handleComplete}
        disabled={isLoading}
        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white gap-2 px-6"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Circle className="w-5 h-5" />
            Mark Complete
          </>
        )}
      </Button>

      {/* Points hint */}
      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        Earn 3 points when you complete this lesson
      </p>
    </div>
  );
}

/**
 * Celebration animation effect
 */
function CelebrationEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {/* Confetti particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full animate-confetti"
          style={{
            backgroundColor: ['#f6ff88', '#10B981', '#8B5CF6', '#F59E0B'][i % 4],
            left: `${Math.random() * 100}%`,
            top: '50%',
            animationDelay: `${Math.random() * 0.3}s`,
          }}
        />
      ))}

      {/* Sparkle burst */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Sparkles className="w-8 h-8 text-amber-400 animate-ping" />
      </div>
    </div>
  );
}

/**
 * Inline version for lesson list items
 */
export function MarkCompleteInline({
  isCompleted,
  isLoading,
  onToggle,
  className,
}) {
  return (
    <button
      onClick={onToggle}
      disabled={isLoading}
      className={cn(
        'p-1 rounded-full transition-colors',
        isCompleted
          ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
          : 'text-gray-300 hover:text-gray-500 hover:bg-gray-50',
        isLoading && 'opacity-50 cursor-not-allowed',
        className
      )}
      aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : isCompleted ? (
        <CheckCircle2 className="w-5 h-5" />
      ) : (
        <Circle className="w-5 h-5" />
      )}
    </button>
  );
}

export default MarkCompleteButton;
