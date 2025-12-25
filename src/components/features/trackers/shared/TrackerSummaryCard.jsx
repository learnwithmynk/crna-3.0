/**
 * TrackerSummaryCard - Reusable stat card for tracker summaries
 * Supports progress bars, edit buttons, and click actions
 */

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TrackerSummaryCard({
  label,
  value,
  goal,
  progress,
  subtitle,
  onEdit,
  onClick,
  className,
  children
}) {
  const showProgress = goal !== undefined && progress !== undefined;

  return (
    <Card
      className={cn('p-4 relative', onClick && 'cursor-pointer hover:shadow-md transition-shadow', className)}
      onClick={onClick}
    >
      {/* Edit button (cogwheel) */}
      {onEdit && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 min-h-0 min-w-0"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Settings className="h-4 w-4 text-gray-500" />
        </Button>
      )}

      {/* Main value */}
      <div className="text-2xl font-bold text-gray-900">
        {value}
        {goal !== undefined && (
          <span className="text-sm font-normal text-gray-500 ml-1">of {goal}</span>
        )}
      </div>

      {/* Label */}
      <div className="text-sm text-gray-600 mt-1">{label}</div>

      {/* Progress bar */}
      {showProgress && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Subtitle/motivation */}
      {subtitle && (
        <div className="text-xs text-gray-500 mt-2">{subtitle}</div>
      )}

      {/* Custom content */}
      {children}
    </Card>
  );
}
