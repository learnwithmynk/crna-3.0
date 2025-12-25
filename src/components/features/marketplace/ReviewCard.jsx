/**
 * ReviewCard Component
 *
 * Displays a single review for a mentor.
 */

import { Star, ThumbsUp, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Star rating display
 */
function StarRating({ rating, size = 'sm' }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    const filled = i < fullStars || (i === fullStars && hasHalf);
    stars.push(
      <Star
        key={i}
        className={cn(
          size === 'sm' ? 'w-4 h-4' : 'w-5 h-5',
          filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        )}
      />
    );
  }

  return <div className="flex items-center gap-0.5">{stars}</div>;
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Get service type label
 */
function getServiceLabel(type) {
  const labels = {
    mock_interview: 'Mock Interview',
    essay_review: 'Essay Review',
    strategy_session: 'Coaching',
    school_qa: 'Q&A Call'
  };
  return labels[type] || type;
}

export function ReviewCard({ review, variant = 'default', className }) {
  // Get initials from reviewer name
  const initials = review.reviewerName
    ? review.reviewerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  if (variant === 'compact') {
    return (
      <div
        className={cn('flex items-start gap-3 py-3', className)}
        data-testid="review-card"
      >
        <StarRating rating={review.rating} />
        <p className="text-sm text-gray-600 line-clamp-2 flex-1">
          {review.comment || 'No written review'}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200 p-4',
        className
      )}
      data-testid="review-card"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-gray-100 text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">
              {review.reviewerName || 'Anonymous'}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>

        <StarRating rating={review.rating} />
      </div>

      {/* Service Badge */}
      {review.serviceType && (
        <Badge variant="secondary" className="mb-3 text-xs">
          {getServiceLabel(review.serviceType)}
        </Badge>
      )}

      {/* Comment */}
      {review.comment && (
        <p className="text-gray-700 mb-3">{review.comment}</p>
      )}

      {/* Tags */}
      {review.tags && review.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {review.tags.map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Would Recommend */}
      {review.wouldRecommend && (
        <div className="flex items-center gap-1.5 text-sm text-green-600">
          <ThumbsUp className="w-4 h-4" />
          <span>Would recommend</span>
        </div>
      )}
    </div>
  );
}

export default ReviewCard;
