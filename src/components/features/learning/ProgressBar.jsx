/**
 * ProgressBar Component (Learning Module)
 *
 * A styled progress bar for showing module completion progress.
 * Includes percentage label and optional lesson count.
 *
 * Used in: ModuleDetailPage, ModuleCard
 */

import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

/**
 * @param {Object} props
 * @param {number} props.value - Progress percentage (0-100)
 * @param {number} props.completedLessons - Number of completed lessons
 * @param {number} props.totalLessons - Total number of lessons
 * @param {string} props.size - Size variant: 'sm', 'md', 'lg'
 * @param {boolean} props.showLabel - Show percentage label
 * @param {boolean} props.showCount - Show lesson count
 * @param {string} props.className - Additional classes
 */
export function ProgressBar({
  value = 0,
  completedLessons,
  totalLessons,
  size = 'md',
  showLabel = true,
  showCount = false,
  className,
}) {
  // Ensure value is within bounds
  const percent = Math.min(100, Math.max(0, value));
  const isComplete = percent >= 100;

  // Size variants
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn('space-y-1', className)}>
      {/* Labels */}
      {(showLabel || showCount) && (
        <div className="flex justify-between items-center text-sm">
          {showLabel && (
            <span
              className={cn(
                'font-medium',
                isComplete ? 'text-green-600' : 'text-gray-700'
              )}
            >
              {isComplete ? 'Complete!' : `${Math.round(percent)}% complete`}
            </span>
          )}
          {showCount && totalLessons !== undefined && (
            <span className="text-gray-500">
              {completedLessons || 0}/{totalLessons} lessons
            </span>
          )}
        </div>
      )}

      {/* Progress bar */}
      <Progress
        value={percent}
        className={cn(
          sizeClasses[size],
          isComplete && '[&>div]:bg-green-500'
        )}
      />
    </div>
  );
}

/**
 * Circular progress indicator for compact displays
 */
export function ProgressCircle({
  value = 0,
  size = 40,
  strokeWidth = 4,
  className,
}) {
  const percent = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;
  const isComplete = percent >= 100;

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className={cn(
            'transition-all duration-300 ease-out',
            isComplete ? 'text-green-500' : 'text-primary'
          )}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* Center text */}
      <span className="absolute text-xs font-medium text-gray-700">
        {Math.round(percent)}%
      </span>
    </div>
  );
}

export default ProgressBar;
