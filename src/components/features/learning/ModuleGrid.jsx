/**
 * ModuleGrid Component
 *
 * Responsive grid layout for displaying ModuleCards.
 * 4 columns on desktop, 2 on tablet, 1 on mobile.
 *
 * Used in: LearningLibraryPage
 */

import { ModuleCard } from './ModuleCard';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { BookOpen, Search } from 'lucide-react';

/**
 * @param {Object} props
 * @param {Array} props.modules - Array of module objects
 * @param {Map} props.progressMap - Map of moduleId -> { progressPercent, completedLessons }
 * @param {Map} props.accessMap - Map of moduleId -> { hasAccess }
 * @param {Map} props.lastAccessMap - Map of moduleId -> lastAccessedAt date string
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.emptyMessage - Custom empty state message
 * @param {boolean} props.isFiltered - Whether results are filtered (affects empty state)
 */
export function ModuleGrid({
  modules = [],
  progressMap = new Map(),
  accessMap = new Map(),
  lastAccessMap = new Map(),
  isLoading = false,
  emptyMessage,
  isFiltered = false,
}) {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ModuleCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!modules.length) {
    return (
      <EmptyState
        icon={isFiltered ? Search : BookOpen}
        title={isFiltered ? 'No modules found' : 'No modules yet'}
        description={
          emptyMessage ||
          (isFiltered
            ? 'Try adjusting your search or filters'
            : 'Learning modules will appear here once they are published.')
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {modules.map((module) => {
        const progress = progressMap.get(module.id) || {
          progressPercent: 0,
          completedLessons: 0,
        };
        const access = accessMap.get(module.id) || { hasAccess: true };
        const lastAccessed = lastAccessMap.get(module.id);

        return (
          <ModuleCard
            key={module.id}
            module={module}
            progressPercent={progress.progressPercent}
            completedLessons={progress.completedLessons}
            hasAccess={access.hasAccess}
            lastAccessedAt={lastAccessed}
          />
        );
      })}
    </div>
  );
}

/**
 * Skeleton loader for a single module card
 */
function ModuleCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Thumbnail skeleton */}
      <Skeleton className="aspect-video w-full" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-1.5 w-full mt-2" />
      </div>
    </div>
  );
}

export default ModuleGrid;
