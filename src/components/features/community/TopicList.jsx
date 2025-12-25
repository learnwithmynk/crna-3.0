/**
 * TopicList Component
 *
 * Displays a paginated list of topics.
 * Sticky topics are shown first.
 */

import { MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { TopicCard } from './TopicCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';

export function TopicList({
  topics,
  forumId,
  loading = false,
  total = 0,
  totalPages = 0,
  currentPage = 1,
  onPageChange,
  className
}) {
  // Loading state
  if (loading) {
    return (
      <div className={cn('space-y-3', className)}>
        {[1, 2, 3, 4, 5].map((i) => (
          <TopicCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!topics || topics.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No topics yet"
        description="Be the first to start a discussion in this forum."
        className={className}
      />
    );
  }

  // Separate sticky and regular topics
  const stickyTopics = topics.filter(t => t.sticky);
  const regularTopics = topics.filter(t => !t.sticky);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Sticky topics */}
      {stickyTopics.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-widest px-1">
            Pinned
          </h3>
          <div className="space-y-2">
            {stickyTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} forumId={forumId} />
            ))}
          </div>
        </div>
      )}

      {/* Regular topics */}
      {regularTopics.length > 0 && (
        <div className="space-y-2">
          {stickyTopics.length > 0 && (
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-widest px-1">
              Discussions
            </h3>
          )}
          <div className="space-y-2">
            {regularTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} forumId={forumId} />
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

// Pagination component
function Pagination({ currentPage, totalPages, total, onPageChange }) {
  const startItem = (currentPage - 1) * 20 + 1;
  const endItem = Math.min(currentPage * 20, total);

  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
      <p className="text-sm text-gray-500">
        Showing {startItem}-{endItem} of {total} topics
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        {/* Page numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {generatePageNumbers(currentPage, totalPages).map((page, idx) => (
            page === '...' ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                ...
              </span>
            ) : (
              <Button
                key={page}
                variant={page === currentPage ? 'default' : 'ghost'}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => onPageChange?.(page)}
              >
                {page}
              </Button>
            )
          ))}
        </div>

        {/* Mobile page indicator */}
        <span className="sm:hidden text-sm text-gray-500">
          {currentPage} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

// Generate page numbers with ellipsis
function generatePageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [];

  // Always show first page
  pages.push(1);

  // Calculate range around current page
  let start = Math.max(2, current - 1);
  let end = Math.min(total - 1, current + 1);

  // Adjust if at edges
  if (current <= 3) {
    end = 4;
  }
  if (current >= total - 2) {
    start = total - 3;
  }

  // Add ellipsis before range if needed
  if (start > 2) {
    pages.push('...');
  }

  // Add range
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Add ellipsis after range if needed
  if (end < total - 1) {
    pages.push('...');
  }

  // Always show last page
  pages.push(total);

  return pages;
}

// Skeleton for loading state
function TopicCardSkeleton() {
  return (
    <div className="p-4 border border-gray-200 rounded-xl">
      <div className="flex items-start gap-3">
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-5 w-3/4" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="hidden sm:flex gap-4">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>
    </div>
  );
}

export default TopicList;
