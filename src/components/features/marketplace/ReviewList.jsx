/**
 * ReviewList Component
 *
 * Displays a list of reviews with filtering and sorting options.
 */

import { useState, useMemo } from 'react';
import { Star, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReviewCard } from './ReviewCard';
import { cn } from '@/lib/utils';

/**
 * Calculate rating distribution
 */
function getRatingDistribution(reviews) {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(review => {
    const rounded = Math.round(review.rating);
    if (distribution[rounded] !== undefined) {
      distribution[rounded]++;
    }
  });
  return distribution;
}

/**
 * Rating filter bar
 */
function RatingFilterBar({ distribution, total, selectedRating, onSelect }) {
  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map(rating => {
        const count = distribution[rating];
        const percentage = total > 0 ? (count / total) * 100 : 0;
        const isSelected = selectedRating === rating;

        return (
          <button
            key={rating}
            onClick={() => onSelect(isSelected ? null : rating)}
            className={cn(
              'flex items-center gap-3 w-full group',
              isSelected && 'opacity-100',
              !isSelected && selectedRating !== null && 'opacity-50'
            )}
          >
            <div className="flex items-center gap-1 w-12">
              <span className="text-sm font-medium">{rating}</span>
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  isSelected ? 'bg-yellow-400' : 'bg-yellow-300 group-hover:bg-yellow-400'
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Service type filter
 */
const SERVICE_TYPES = [
  { value: 'all', label: 'All Services' },
  { value: 'mock_interview', label: 'Mock Interview' },
  { value: 'essay_review', label: 'Essay Review' },
  { value: 'strategy_session', label: 'Coaching' },
  { value: 'school_qa', label: 'Q&A Call' }
];

/**
 * Sort options
 */
const SORT_OPTIONS = [
  { value: 'newest', label: 'Most Recent' },
  { value: 'highest', label: 'Highest Rated' },
  { value: 'lowest', label: 'Lowest Rated' }
];

export function ReviewList({
  reviews,
  showFilters = true,
  showDistribution = true,
  initialLimit = 5,
  className
}) {
  const [ratingFilter, setRatingFilter] = useState(null);
  const [serviceFilter, setServiceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showAll, setShowAll] = useState(false);

  const distribution = useMemo(() => getRatingDistribution(reviews), [reviews]);

  // Calculate average rating
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    // Apply rating filter
    if (ratingFilter !== null) {
      result = result.filter(r => Math.round(r.rating) === ratingFilter);
    }

    // Apply service filter
    if (serviceFilter !== 'all') {
      result = result.filter(r => r.serviceType === serviceFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'highest') {
        return b.rating - a.rating;
      }
      if (sortBy === 'lowest') {
        return a.rating - b.rating;
      }
      return 0;
    });

    return result;
  }, [reviews, ratingFilter, serviceFilter, sortBy]);

  // Apply limit if not showing all
  const displayedReviews = showAll
    ? filteredReviews
    : filteredReviews.slice(0, initialLimit);

  const hasMoreReviews = filteredReviews.length > initialLimit;

  return (
    <div className={className}>
      {/* Header with average rating */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-1">Reviews</h3>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-xl font-bold">{averageRating.toFixed(1)}</span>
            <span className="text-gray-500">
              ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
            </span>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      {showDistribution && reviews.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <RatingFilterBar
            distribution={distribution}
            total={reviews.length}
            selectedRating={ratingFilter}
            onSelect={setRatingFilter}
          />
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filter:</span>
          </div>

          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(ratingFilter !== null || serviceFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setRatingFilter(null);
                setServiceFilter('all');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Active filters display */}
      {ratingFilter !== null && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-500">Showing:</span>
          <Badge
            variant="secondary"
            className="cursor-pointer"
            onClick={() => setRatingFilter(null)}
          >
            {ratingFilter} stars &times;
          </Badge>
        </div>
      )}

      {/* Reviews List */}
      {displayedReviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No reviews match your filters.</p>
          {(ratingFilter !== null || serviceFilter !== 'all') && (
            <Button
              variant="link"
              onClick={() => {
                setRatingFilter(null);
                setServiceFilter('all');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayedReviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* Show More Button */}
      {hasMoreReviews && !showAll && (
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => setShowAll(true)}>
            Show All {filteredReviews.length} Reviews
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default ReviewList;
