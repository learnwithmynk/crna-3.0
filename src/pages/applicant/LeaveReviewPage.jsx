/**
 * LeaveReviewPage
 *
 * Page for applicants to leave a review after a completed session.
 * Features double-blind system where reviews are hidden until both submit.
 * Route: /marketplace/bookings/:bookingId/review
 */

import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  Info,
  ThumbsUp
} from 'lucide-react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useBooking, BOOKING_STATUS } from '@/hooks/useBookings';
import { useSubmitReview, useReviewEligibility, REVIEW_TAGS } from '@/hooks/useReviews';
import { cn } from '@/lib/utils';

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
 * Star rating input component
 */
function StarRatingInput({ value, onChange, disabled }) {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
          className={cn(
            'p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          aria-label={`Rate ${star} stars`}
        >
          <Star
            className={cn(
              'w-10 h-10 transition-colors',
              (hoverValue || value) >= star
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            )}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-lg font-semibold">{value}/5</span>
      )}
    </div>
  );
}

/**
 * Tag selector component
 */
function TagSelector({ tags, selectedTags, onChange, disabled }) {
  const toggleTag = (tagValue) => {
    if (disabled) return;
    if (selectedTags.includes(tagValue)) {
      onChange(selectedTags.filter(t => t !== tagValue));
    } else {
      onChange([...selectedTags, tagValue]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <Badge
          key={tag.value}
          variant={selectedTags.includes(tag.value) ? 'default' : 'outline'}
          className={cn(
            'cursor-pointer transition-colors',
            disabled && 'cursor-not-allowed opacity-50',
            !selectedTags.includes(tag.value) && 'hover:bg-gray-100'
          )}
          onClick={() => toggleTag(tag.value)}
        >
          {tag.label}
        </Badge>
      ))}
    </div>
  );
}

/**
 * Booking summary card (compact)
 */
function BookingSummaryCard({ booking }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10">
              {getInitials(booking.providerSnapshot?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold">{booking.serviceSnapshot?.title}</h3>
            <p className="text-sm text-gray-600">
              with {booking.providerSnapshot?.name}
            </p>
            {booking.scheduledAt && (
              <p className="text-sm text-gray-500">
                {new Date(booking.scheduledAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Success state after submission
 */
function SuccessState({ providerName }) {
  return (
    <Card className="p-8 text-center max-w-lg mx-auto">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
      <p className="text-gray-600 mb-6">
        Your review has been submitted. It will be visible after {providerName} also leaves their review, or after 14 days.
      </p>
      <div className="space-y-3">
        <Link to="/marketplace/my-bookings">
          <Button className="w-full">Back to My Bookings</Button>
        </Link>
        <Link to="/marketplace">
          <Button variant="outline" className="w-full">
            Browse More Mentors
          </Button>
        </Link>
      </div>
    </Card>
  );
}

/**
 * Loading skeleton
 */
function PageSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export function LeaveReviewPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  // Form state
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [wouldRecommend, setWouldRecommend] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Fetch booking
  const { booking, loading: bookingLoading, error: bookingError } = useBooking(bookingId);

  // Check eligibility
  // TODO: Pass actual user ID from auth context
  const { canReview, reason, loading: eligibilityLoading } = useReviewEligibility(
    bookingId,
    'user_001',
    'applicant'
  );

  // Submit hook
  const { submitReview, loading: submitting, error: submitError } = useSubmitReview();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Validate required fields
    if (rating === 0) {
      setValidationError('Please select a rating');
      return;
    }

    // Validate review text length if provided
    if (reviewText.trim().length > 0 && reviewText.trim().length < 10) {
      setValidationError('Review must be at least 10 characters');
      return;
    }

    if (reviewText.length > 1000) {
      setValidationError('Review must be less than 1000 characters');
      return;
    }

    const result = await submitReview({
      bookingId,
      rating,
      reviewText: reviewText.trim() || null,
      tags: selectedTags,
      wouldRecommend
    });

    if (result.success) {
      setSubmitted(true);
    }
  };

  // Breadcrumbs
  const breadcrumbs = [
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'My Bookings', href: '/marketplace/my-bookings' },
    { label: 'Leave Review' }
  ];

  // Loading state
  if (bookingLoading || eligibilityLoading) {
    return (
      <PageWrapper breadcrumbs={breadcrumbs}>
        <PageSkeleton />
      </PageWrapper>
    );
  }

  // Error state
  if (bookingError) {
    return (
      <PageWrapper breadcrumbs={breadcrumbs}>
        <Card className="p-8 text-center max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Booking Not Found</h2>
          <p className="text-gray-600 mb-4">
            This booking doesn't exist or you don't have access to review it.
          </p>
          <Link to="/marketplace/my-bookings">
            <Button>Back to My Bookings</Button>
          </Link>
        </Card>
      </PageWrapper>
    );
  }

  // Not eligible to review
  if (!canReview) {
    return (
      <PageWrapper breadcrumbs={breadcrumbs}>
        <Card className="p-8 text-center max-w-lg mx-auto">
          <Info className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Cannot Leave Review</h2>
          <p className="text-gray-600 mb-4">{reason}</p>
          <Link to="/marketplace/my-bookings">
            <Button>Back to My Bookings</Button>
          </Link>
        </Card>
      </PageWrapper>
    );
  }

  // Success state
  if (submitted) {
    return (
      <PageWrapper breadcrumbs={breadcrumbs}>
        <SuccessState providerName={booking.providerSnapshot?.name} />
      </PageWrapper>
    );
  }

  const characterCount = reviewText.length;
  const applicantTags = REVIEW_TAGS.applicant;

  return (
    <PageWrapper breadcrumbs={breadcrumbs}>
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link
          to={`/marketplace/bookings/${bookingId}`}
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to booking
        </Link>

        {/* Booking summary */}
        <BookingSummaryCard booking={booking} />

        {/* Review form */}
        <Card>
          <CardHeader>
            <CardTitle>Leave a Review</CardTitle>
            <CardDescription>
              Share your experience to help other applicants find great mentors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star rating */}
              <div className="space-y-2">
                <Label className="text-base font-medium">
                  Overall Rating <span className="text-red-500">*</span>
                </Label>
                <StarRatingInput
                  value={rating}
                  onChange={setRating}
                  disabled={submitting}
                />
              </div>

              {/* Written review */}
              <div className="space-y-2">
                <Label htmlFor="review-text" className="text-base font-medium">
                  Your Review (optional)
                </Label>
                <Textarea
                  id="review-text"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  disabled={submitting}
                  placeholder="Share details about your experience. What did you find helpful? Would you recommend this mentor to others?"
                  className="min-h-[120px]"
                  maxLength={1000}
                />
                <p className={cn(
                  'text-sm text-right',
                  characterCount > 900 ? 'text-yellow-600' : 'text-gray-500',
                  characterCount > 1000 && 'text-red-500'
                )}>
                  {characterCount}/1000
                </p>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label className="text-base font-medium">
                  What stood out? (optional)
                </Label>
                <p className="text-sm text-gray-500 mb-2">
                  Select all that apply
                </p>
                <TagSelector
                  tags={applicantTags}
                  selectedTags={selectedTags}
                  onChange={setSelectedTags}
                  disabled={submitting}
                />
              </div>

              {/* Would recommend */}
              <div className="space-y-2">
                <Label className="text-base font-medium">
                  Would you recommend this mentor?
                </Label>
                <RadioGroup
                  value={wouldRecommend === null ? '' : wouldRecommend ? 'yes' : 'no'}
                  onValueChange={(val) => setWouldRecommend(val === 'yes')}
                  className="flex gap-4"
                  disabled={submitting}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="recommend-yes" />
                    <Label htmlFor="recommend-yes" className="cursor-pointer">
                      <ThumbsUp className="w-4 h-4 inline mr-1" />
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="recommend-no" />
                    <Label htmlFor="recommend-no" className="cursor-pointer">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Double-blind explanation */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Double-blind reviews:</strong> Your review will be visible after {booking.providerSnapshot?.name} also leaves their review, or after 14 days—whichever comes first. This ensures honest feedback from both parties.
                </AlertDescription>
              </Alert>

              {/* Validation error */}
              {validationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}

              {/* Submit error */}
              {submitError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}

              {/* Submit button */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={submitting || rating === 0}
                  className="flex-1"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Link to={`/marketplace/bookings/${bookingId}`}>
                  <Button type="button" variant="outline" disabled={submitting}>
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}

export default LeaveReviewPage;
