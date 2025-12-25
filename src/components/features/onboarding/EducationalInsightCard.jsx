/**
 * EducationalInsightCard
 *
 * Shows contextual "Why this matters" insight after user provides data.
 * Appears with fade-in animation to create mini-aha moments.
 */

import { Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EducationalInsightCard({
  title = 'Why this matters',
  message,
  variant = 'default', // 'default' | 'positive' | 'actionable'
  className,
  show = true,
}) {
  if (!show || !message) return null;

  const variants = {
    default: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: 'bg-yellow-200 text-yellow-700',
      title: 'text-yellow-900',
      message: 'text-yellow-800',
    },
    positive: {
      container: 'bg-green-50 border-green-200',
      icon: 'bg-green-200 text-green-700',
      title: 'text-green-900',
      message: 'text-green-800',
    },
    actionable: {
      container: 'bg-blue-50 border-blue-200',
      icon: 'bg-blue-200 text-blue-700',
      title: 'text-blue-900',
      message: 'text-blue-800',
    },
  };

  const styles = variants[variant] || variants.default;

  return (
    <div
      className={cn(
        'p-4 rounded-2xl border',
        'animate-in fade-in slide-in-from-bottom-2 duration-300',
        styles.container,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('p-1.5 rounded-full flex-shrink-0', styles.icon)}>
          <Lightbulb className="h-4 w-4" />
        </div>
        <div>
          <div className={cn('font-medium mb-1', styles.title)}>{title}</div>
          <p className={cn('text-sm', styles.message)}>{message}</p>
        </div>
      </div>
    </div>
  );
}
