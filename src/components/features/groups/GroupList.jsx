/**
 * GroupList Component
 *
 * Displays a grid of groups with loading and empty states.
 */

import { Users } from 'lucide-react';
import { GroupCard } from './GroupCard';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';

export function GroupList({
  groups,
  loading = false,
  emptyTitle = 'No groups found',
  emptyDescription = 'Try adjusting your search or browse all groups.',
  columns = 3,
  className
}) {
  // Loading state
  if (loading) {
    return (
      <div className={cn(
        'grid gap-4',
        columns === 2 && 'sm:grid-cols-2',
        columns === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}>
        {[1, 2, 3, 4, 5, 6].slice(0, columns * 2).map((i) => (
          <GroupCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!groups || groups.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title={emptyTitle}
        description={emptyDescription}
        className={className}
      />
    );
  }

  return (
    <div className={cn(
      'grid gap-4',
      columns === 2 && 'sm:grid-cols-2',
      columns === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
      columns === 4 && 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      className
    )}>
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </div>
  );
}

// Skeleton for loading state
function GroupCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <Skeleton className="h-24 w-full" />
      <div className="p-4 pt-8">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-3" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

export default GroupList;
