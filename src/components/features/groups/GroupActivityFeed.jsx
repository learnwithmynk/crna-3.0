/**
 * GroupActivityFeed Component
 *
 * List of activity posts in a group.
 * Handles loading, empty, and error states.
 */

import { MessageSquare } from 'lucide-react';
import { GroupActivityCard } from './GroupActivityCard';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';

export function GroupActivityFeed({
  activities,
  loading = false,
  currentUserId,
  onFavorite,
  onComment,
  onDelete,
  onReport,
  className
}) {
  // Loading state
  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        {[1, 2, 3].map((i) => (
          <ActivityCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!activities || activities.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No activity yet"
        description="Be the first to post in this group!"
        className={className}
      />
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {activities.map((activity) => (
        <GroupActivityCard
          key={activity.id}
          activity={activity}
          isAuthor={activity.user?.id === currentUserId}
          onFavorite={() => onFavorite?.(activity.id)}
          onComment={() => onComment?.(activity.id)}
          onDelete={() => onDelete?.(activity.id)}
          onReport={() => onReport?.(activity.id)}
        />
      ))}
    </div>
  );
}

// Skeleton for loading state
function ActivityCardSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3 mb-3">
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        <div>
          <Skeleton className="h-5 w-24 mb-1" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <Skeleton className="h-16 w-full mb-4" />
      <div className="flex gap-4 pt-3 border-t border-gray-100">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
      </div>
    </Card>
  );
}

export default GroupActivityFeed;
