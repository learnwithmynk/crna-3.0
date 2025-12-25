/**
 * ProviderLeaveReviewPage
 *
 * Allows providers to review applicants after completing a session.
 * Route: /marketplace/provider/bookings/:id/review
 *
 * Features:
 * - Double-blind review system (reviews hidden until both submit or 14 days pass)
 * - Star rating (1-5, required)
 * - Written feedback (optional, 10-500 characters)
 * - Quick tags for efficient feedback
 * - Private admin notes for flagging issues
 * - Booking summary context
 */

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  ArrowLeft,
  Calendar,
  Clock,
  AlertCircle,
  Info,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// TODO: Replace with API call
const mockBookingData = {
  booking_001: {
    id: 'booking_001',
    applicantName: 'Jessica Chen',
    applicantId: 'applicant_001',
    serviceType: 'Mock Interview',
    sessionDate: '2024-12-14',
    sessionTime: '3:00 PM EST',
    duration: 60,
    price: 125,
    status: 'completed',
  },
  booking_002: {
    id: 'booking_002',
    applicantName: 'Michael Rodriguez',
    applicantId: 'applicant_002',
    serviceType: 'Essay Review',
    sessionDate: '2024-12-13',
    sessionTime: 'Async',
    duration: 0,
    price: 85,
    status: 'completed',
  },
};

// Quick tag options for providers
const QUICK_TAGS = [
  'Prepared',
  'Engaged',
  'Professional',
  'Responsive',
  'On Time',
  'Good Questions'
];

export function ProviderLeaveReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // TODO: Replace with API call
  const booking = mockBookingData[id] || mockBookingData.booking_001;

  // Form state
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [privateNotes, setPrivateNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Character counter
  const feedbackLength = feedback.length;
  const feedbackMin = 10;
  const feedbackMax = 500;

  // Rating labels
  const ratingLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Great',
    5: 'Excellent'
  };

  // Toggle tag selection
  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Form validation
  const isValid = rating > 0;

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) {
      setError('Please provide a star rating');
      return;
    }

    if (feedback.length > 0 && (feedback.length < feedbackMin || feedback.length > feedbackMax)) {
      setError(`Written feedback must be between ${feedbackMin}-${feedbackMax} characters`);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // TODO: API call to submit review
      const reviewData = {
        bookingId: booking.id,
        applicantId: booking.applicantId,
        rating,
        feedback: feedback.trim(),
        tags: selectedTags,
        privateNotes: privateNotes.trim(),
        submittedAt: new Date().toISOString(),
      };

      console.log('Submitting review:', reviewData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to bookings page on success
      navigate('/marketplace/provider/bookings', {
        state: { message: 'Review submitted successfully!' }
      });
    } catch (err) {
      setError('Failed to submit review. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
        {/* Back Link */}
        <Link
          to="/marketplace/provider/bookings"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Bookings
        </Link>

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Leave a Review
          </h1>
          <p className="text-gray-600">
            Share your experience working with {booking.applicantName}
          </p>
        </div>

        {/* Booking Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Session Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{booking.applicantName}</p>
                <p className="text-sm text-gray-600">{booking.serviceType}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {booking.sessionDate}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {booking.sessionTime}
              </div>
              {booking.duration > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {booking.duration} minutes
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Double-Blind Info Banner */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Your review will be kept private until:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>The applicant also leaves a review, OR</li>
                  <li>14 days have passed since the session</li>
                </ul>
                <p className="mt-2 text-blue-800">
                  This ensures honest, unbiased feedback from both parties.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Rating <span className="text-red-500">*</span>
              </CardTitle>
              <CardDescription>
                How would you rate your experience with this applicant?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHoveredRating(value)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={cn(
                        "w-8 h-8 transition-colors",
                        (hoveredRating || rating) >= value
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  </button>
                ))}
              </div>

              {rating > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
                    {ratingLabels[rating]}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {rating} out of 5 stars
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Written Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Written Feedback (Optional)</CardTitle>
              <CardDescription>
                Share your experience working with this applicant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Share your experience working with this applicant..."
                rows={5}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                maxLength={feedbackMax}
                className="resize-none"
              />

              {/* Character Counter */}
              <div className="flex items-center justify-between text-sm">
                <span className={cn(
                  "text-gray-500",
                  feedback.length > 0 && feedback.length < feedbackMin && "text-orange-600",
                  feedback.length >= feedbackMin && feedback.length <= feedbackMax && "text-green-600"
                )}>
                  {feedback.length > 0 && feedback.length < feedbackMin && (
                    `At least ${feedbackMin} characters required`
                  )}
                  {feedback.length >= feedbackMin && feedback.length <= feedbackMax && (
                    'Good length'
                  )}
                  {feedback.length === 0 && 'Optional'}
                </span>
                <span className={cn(
                  "text-gray-400",
                  feedback.length > feedbackMax * 0.9 && "text-orange-600"
                )}>
                  {feedbackLength}/{feedbackMax}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Tags (Optional)</CardTitle>
              <CardDescription>
                Select all that apply
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {QUICK_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm border transition-colors",
                      selectedTags.includes(tag)
                        ? "bg-yellow-100 border-yellow-400 text-yellow-800 font-medium"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Private Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Private Notes (Admin Only)
                <Badge variant="outline" className="text-xs">Admin Only</Badge>
              </CardTitle>
              <CardDescription>
                Only visible to admin, not the applicant. Use this to flag any issues or concerns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any concerns or issues to flag for admin review..."
                rows={3}
                value={privateNotes}
                onChange={(e) => setPrivateNotes(e.target.value)}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/marketplace/provider/bookings')}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>

          {/* Submission Note */}
          <p className="text-xs text-center text-gray-500">
            By submitting this review, you agree to our review guidelines and terms of service.
          </p>
        </form>
      </div>
    </div>
  );
}

export default ProviderLeaveReviewPage;
