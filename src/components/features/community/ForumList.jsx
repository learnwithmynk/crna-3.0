/**
 * ForumList Component
 *
 * Displays a list of forums with loading and empty states.
 * Can show as a full list or grid of subforums.
 */

import { MessageSquare } from 'lucide-react';
import { ForumCard } from './ForumCard';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';

export function ForumList({
  forums,
  loading = false,
  variant = 'list', // 'list' | 'grid'
  className
}) {
  // Loading state
  if (loading) {
    return (
      <div className={cn(
        variant === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'space-y-5 max-w-4xl mx-auto',
        className
      )}>
        {[1, 2, 3, 4].map((i) => (
          <ForumCardSkeleton key={i} variant={variant} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!forums || forums.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No forums found"
        description="There are no forums to display."
        className={className}
      />
    );
  }

  // Grid variant (for subforums)
  if (variant === 'grid') {
    return (
      <div className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
        className
      )}>
        {forums.map((forum) => (
          <ForumCard key={forum.id} forum={forum} />
        ))}
      </div>
    );
  }

  // List variant (default)
  return (
    <div className={cn('space-y-5 max-w-4xl mx-auto', className)}>
      {forums.map((forum) => (
        <ForumCard key={forum.id} forum={forum} />
      ))}
    </div>
  );
}

// Skeleton for loading state
function ForumCardSkeleton({ variant }) {
  if (variant === 'grid') {
    return (
      <div className="p-4 border border-gray-200 rounded-xl">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="flex-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-200 rounded-xl">
      <div className="flex items-start gap-4">
        <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-2/3 mt-2" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-5 w-16 rounded" />
            <Skeleton className="h-5 w-16 rounded" />
          </div>
        </div>
        <div className="hidden sm:flex flex-col gap-1 items-end">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

export default ForumList;
