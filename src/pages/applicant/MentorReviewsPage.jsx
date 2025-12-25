/**
 * MentorReviewsPage
 *
 * Displays all reviews for a mentor with filtering, sorting, and pagination.
 * Route: /marketplace/mentor/:mentorId/reviews
 */

import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  ChevronLeft,
  AlertCircle,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReviewCard } from '@/components/features/marketplace/ReviewCard';
import { useProviderById } from '@/hooks/useProviders';
import { useProviderReviews } from '@/hooks/useReviews';
import { cn } from '@/lib/utils';

const REVIEWS_PER_PAGE = 10;

/**
 * Service type filter options
 */
const SERVICE_TYPES = [
  { value: 'all', label: 'All Services' },
  { value: 'mock_interview', label: 'Mock Interview' },
  { value: 'essay_review', label: 'Essay Review' },
  { value: 'strategy_session', label: 'Coaching' },
  { value: 'school_qa', label: 'Q&A Call' },
  { value: 'resume_review', label: 'Resume Review' }
];

/**
 * Sort options
 */
const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'rating_high', label: 'Highest Rated' },
  { value: 'rating_low', label: 'Lowest Rated' }
];

/**
 * Rating filter options
 */
const RATING_FILTERS = [
  { value: 'all', label: 'All Ratings' },
  { value: '5', label: '5 Stars' },
  { value: '4', label: '4+ Stars' },
  { value: '3', label: '3+ Stars' }
];

/**
 * Get initials from name
 */
function getInitials(name) {
  if (!name) return '??';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Compact mentor header for reviews page
 */
function CompactMentorHeader({ provider, averageRating, totalReviews }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12 border-2 border-primary/20">
            <AvatarImage src={provider.avatarUrl} alt={provider.name} />
            <AvatarFallback className="bg-primary/10 font-medium">
              {getInitials(provider.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900 truncate">
              {provider.name}
            </h2>
            <p className="text-sm text-gray-600 truncate">
              {provider.programName}
            </p>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-bold">{averageRating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-gray-500">
              {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Rating distribution bar chart
 */
function RatingDistribution({ breakdown, total, selectedRating, onSelect }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">Rating Distribution</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(rating => {
            const count = breakdown[rating] || 0;
            const percentage = total > 0 ? (count / total) * 100 : 0;
            const isSelected = selectedRating === rating.toString();

            return (
              <button
                key={rating}
                onClick={() => onSelect(isSelected ? 'all' : rating.toString())}
                className={cn(
                  'flex items-center gap-3 w-full group transition-opacity',
                  isSelected && 'opacity-100',
                  !isSelected && selectedRating !== 'all' && 'opacity-50 hover:opacity-75'
                )}
              >
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      isSelected ? 'bg-yellow-400' : 'bg-yellow-300 group-hover:bg-yellow-400'
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-10 text-right">{count}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Loading skeleton
 */
function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-48 w-full" />
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </div>
  );
}

/**
 * Pagination component
 */
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>

      {startPage > 1 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(1)}
          >
            1
          </Button>
          {startPage > 2 && <span className="text-gray-400">...</span>}
        </>
      )}

      {pages.map(page => (
        <Button
          key={page}
          variant={page === currentPage ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
}

export function MentorReviewsPage() {
  const { mentorId } = useParams();

  // Filter/sort state
  const [serviceFilter, setServiceFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch provider data
  const { provider, loading: providerLoading, error: providerError } = useProviderById(mentorId);

  // Build filter options for hook
  const reviewOptions = useMemo(() => ({
    serviceType: serviceFilter !== 'all' ? serviceFilter : null,
    minRating: ratingFilter !== 'all' ? parseInt(ratingFilter) : null,
    sortBy,
    limit: REVIEWS_PER_PAGE,
    offset: (currentPage - 1) * REVIEWS_PER_PAGE
  }), [serviceFilter, ratingFilter, sortBy, currentPage]);

  // Fetch reviews
  const {
    reviews,
    totalCount,
    averageRating,
    ratingBreakdown,
    loading: reviewsLoading,
    hasMore
  } = useProviderReviews(mentorId, reviewOptions);

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / REVIEWS_PER_PAGE);

  // Reset page when filters change
  const handleServiceFilter = (value) => {
    setServiceFilter(value);
    setCurrentPage(1);
  };

  const handleRatingFilter = (value) => {
    setRatingFilter(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  // Check for active filters
  const hasActiveFilters = serviceFilter !== 'all' || ratingFilter !== 'all';

  // Clear all filters
  const clearFilters = () => {
    setServiceFilter('all');
    setRatingFilter('all');
    setCurrentPage(1);
  };

  // Breadcrumbs
  const breadcrumbs = [
    { label: 'Marketplace', href: '/marketplace' },
    { label: provider?.name || 'Mentor', href: `/marketplace/mentor/${mentorId}` },
    { label: 'Reviews' }
  ];

  // Error state
  if (providerError) {
    return (
      <PageWrapper breadcrumbs={breadcrumbs}>
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Mentor Not Found</h2>
          <p className="text-gray-600 mb-4">
            This mentor profile doesn't exist or may have been removed.
          </p>
          <Link to="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </Card>
      </PageWrapper>
    );
  }

  // Loading state
  if (providerLoading) {
    return (
      <PageWrapper breadcrumbs={breadcrumbs}>
        <PageSkeleton />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper breadcrumbs={breadcrumbs}>
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          to={`/marketplace/mentor/${mentorId}`}
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to profile
        </Link>

        {/* Compact mentor header */}
        <CompactMentorHeader
          provider={provider}
          averageRating={averageRating}
          totalReviews={totalCount}
        />

        {/* Rating distribution */}
        {totalCount >= 5 && (
          <RatingDistribution
            breakdown={ratingBreakdown}
            total={totalCount}
            selectedRating={ratingFilter}
            onSelect={handleRatingFilter}
          />
        )}

        {/* Filters and sort */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Filter:</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 flex-1">
                <Select value={serviceFilter} onValueChange={handleServiceFilter}>
                  <SelectTrigger className="w-[150px] h-9">
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

                <Select value={ratingFilter} onValueChange={handleRatingFilter}>
                  <SelectTrigger className="w-[130px] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RATING_FILTERS.map(filter => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Clear filters
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-500" />
                <Select value={sortBy} onValueChange={handleSortChange}>
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews list */}
        {reviewsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <Card className="p-8 text-center">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            {hasActiveFilters ? (
              <>
                <h3 className="font-semibold text-gray-900 mb-2">No matching reviews</h3>
                <p className="text-gray-600 mb-4">
                  No reviews match your current filters.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-600">
                  Be the first to book a session and leave a review!
                </p>
              </>
            )}
          </Card>
        ) : (
          <>
            {/* Results count */}
            <p className="text-sm text-gray-500 mb-4">
              Showing {(currentPage - 1) * REVIEWS_PER_PAGE + 1}-
              {Math.min(currentPage * REVIEWS_PER_PAGE, totalCount)} of {totalCount} review{totalCount !== 1 ? 's' : ''}
            </p>

            {/* Reviews */}
            <div className="space-y-4">
              {reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </PageWrapper>
  );
}

export default MentorReviewsPage;
