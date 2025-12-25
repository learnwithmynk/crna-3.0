/**
 * ReplyList Component
 *
 * Displays a threaded list of replies for a topic.
 * Supports nested replies with proper indentation.
 * Handles loading, empty, and error states.
 */

import { useState, useCallback } from 'react';
import { MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { ReplyCard } from './ReplyCard';
import { ReplyFormCompact } from './ReplyForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';
import { buildReplyTree } from '@/data/mockReplies';

// Recursive component to render nested replies
function NestedReply({
  reply,
  currentUserId,
  onEditReply,
  onDeleteReply,
  onReportReply,
  onReplyTo,
  onReact,
  replyingToId,
  onSubmitReply,
  maxDepth = 3
}) {
  const isAuthor = reply.author?.id === currentUserId;

  return (
    <div className="relative">
      <ReplyCard
        reply={reply}
        isAuthor={isAuthor}
        currentUserId={currentUserId}
        onEdit={() => onEditReply?.(reply)}
        onDelete={() => onDeleteReply?.(reply)}
        onReport={(r, reason) => onReportReply?.(r, reason)}
        onReply={() => onReplyTo?.(reply.id)}
        onReact={onReact}
        maxDepth={maxDepth}
      />

      {/* Inline reply form when replying to this specific reply */}
      {replyingToId === reply.id && (
        <div
          className="mt-2 mb-4"
          style={{ marginLeft: `${Math.min(reply.depth + 1, maxDepth) * 40}px` }}
        >
          <ReplyFormCompact
            onSubmit={(content) => onSubmitReply?.(reply.id, content)}
            placeholder={`Reply to ${reply.author?.name}...`}
          />
        </div>
      )}

      {/* Render children recursively */}
      {reply.children && reply.children.length > 0 && (
        <div>
          {reply.children.map((childReply) => (
            <NestedReply
              key={childReply.id}
              reply={childReply}
              currentUserId={currentUserId}
              onEditReply={onEditReply}
              onDeleteReply={onDeleteReply}
              onReportReply={onReportReply}
              onReplyTo={onReplyTo}
              onReact={onReact}
              replyingToId={replyingToId}
              onSubmitReply={onSubmitReply}
              maxDepth={maxDepth}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ReplyList({
  replies,
  loading = false,
  total = 0,
  totalPages = 0,
  currentPage = 1,
  onPageChange,
  currentUserId = 999,
  onEditReply,
  onDeleteReply,
  onReportReply,
  onCreateReply,
  onReactToReply,
  embedded = false, // When true, don't wrap in Card (embedded in parent)
  className
}) {
  const [replyingToId, setReplyingToId] = useState(null);

  // Build nested tree structure from flat array
  const replyTree = buildReplyTree(replies || []);

  // Handle clicking reply button
  const handleReplyTo = useCallback((replyId) => {
    setReplyingToId((current) => (current === replyId ? null : replyId));
  }, []);

  // Handle submitting a nested reply
  const handleSubmitReply = useCallback(async (parentId, content) => {
    await onCreateReply?.(content, parentId);
    setReplyingToId(null);
  }, [onCreateReply]);

  // Loading state
  if (loading) {
    const Wrapper = embedded ? 'div' : Card;
    return (
      <Wrapper className={className}>
        {[1, 2, 3].map((i) => (
          <ReplyCardSkeleton key={i} />
        ))}
      </Wrapper>
    );
  }

  // Empty state
  if (!replies || replies.length === 0) {
    if (embedded) {
      return (
        <div className={cn('p-6 text-center text-gray-500', className)}>
          No comments yet. Be the first to comment!
        </div>
      );
    }
    return (
      <Card className={cn('p-6 text-center', className)}>
        <EmptyState
          icon={MessageSquare}
          title="No replies yet"
          description="Be the first to respond to this topic!"
        />
      </Card>
    );
  }

  // Content wrapper - use div when embedded, Card when standalone
  const ContentWrapper = embedded ? 'div' : Card;

  return (
    <div className={className}>
      {/* All replies in one container */}
      <ContentWrapper className={cn(!embedded && 'divide-y divide-gray-100')}>
        {replyTree.map((reply) => (
          <NestedReply
            key={reply.id}
            reply={reply}
            currentUserId={currentUserId}
            onEditReply={onEditReply}
            onDeleteReply={onDeleteReply}
            onReportReply={onReportReply}
            onReplyTo={handleReplyTo}
            onReact={onReactToReply}
            replyingToId={replyingToId}
            onSubmitReply={handleSubmitReply}
          />
        ))}
      </ContentWrapper>

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
        Showing {startItem}-{endItem} of {total} replies
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

        {/* Page indicator */}
        <span className="text-sm text-gray-500 px-2">
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

// Skeleton for loading state
function ReplyCardSkeleton() {
  return (
    <div className="py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex items-start gap-3">
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-16 w-full" />
          <div className="flex gap-2 mt-3">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-7 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReplyList;
