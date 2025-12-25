/**
 * CourseDetailModal Component
 *
 * Shows full course details including:
 * - Course info (school, subject, credits, format, cost)
 * - Average ratings with bar chart breakdown
 * - Review list with tags
 * - Write Review button
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ExternalLink,
  DollarSign,
  Clock,
  BookOpen,
  Monitor,
  MapPin,
  FlaskConical,
  MessageSquare,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getCourseWithReviews,
  getSubjectLabel,
  getTagLabel,
} from '@/data/mockPrerequisites';

// Color coding for ratings based on score
const getRatingColor = (score) => {
  if (score >= 4.5) return { bg: 'bg-green-100', text: 'text-green-700' };
  if (score >= 4.0) return { bg: 'bg-lime-100', text: 'text-lime-700' };
  if (score >= 3.0) return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
  if (score >= 2.0) return { bg: 'bg-orange-100', text: 'text-orange-700' };
  return { bg: 'bg-red-100', text: 'text-red-700' };
};

export function CourseDetailModal({
  course,
  open,
  onOpenChange,
  onWriteReview,
}) {
  if (!course) return null;

  // Get full course data with reviews
  const courseData = getCourseWithReviews(course.id);
  if (!courseData) return null;

  const {
    schoolName,
    courseName,
    courseUrl,
    subject,
    level,
    credits,
    hasLab,
    labKitRequired,
    format,
    selfPaced,
    courseLengthWeeks,
    rollingAdmission,
    costRange,
    averageRecommend,
    averageEase,
    reviewCount,
    reviews,
    ratingDistribution,
  } = courseData;

  // Format display
  const getFormatDisplay = () => {
    if (format === 'online_async') return 'Online (Self-Paced)';
    if (format === 'online_sync') return 'Online (Live Sessions)';
    if (format === 'in_person') return 'In-Person';
    return 'Hybrid';
  };

  // Get rating label
  const getRatingLabel = (score) => {
    if (score >= 5) return 'Highly Recommend';
    if (score >= 4) return 'Recommend';
    if (score >= 3) return 'Neutral';
    if (score >= 2) return 'Discourage';
    return 'Strongly Discourage';
  };

  // Get ease label
  const getEaseLabel = (score) => {
    if (score >= 5) return 'Very Easy';
    if (score >= 4) return 'Easy';
    if (score >= 3) return 'Moderate';
    if (score >= 2) return 'Challenging';
    return 'Very Challenging';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-0 shadow-[0_0_30px_rgba(254,144,175,0.25),0_0_60px_rgba(255,176,136,0.15)]">
        {/* Gradient border wrapper */}
        <div className="p-px bg-linear-to-br from-[#FFD6B8] via-[#FE90AF] to-[#FFB088] rounded-3xl">
          <div className="bg-white rounded-[20px] max-h-[85vh] overflow-y-auto">
            <div className="p-6">
              <DialogHeader>
                {/* Back link */}
                <button
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2 w-fit"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back To Courses
                </button>

                {/* School name with external link */}
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">{schoolName}</p>
                  {courseUrl && (
                    <a
                      href={courseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-orange-500 transition-colors"
                      title="Visit course website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Course name */}
                <DialogTitle className="text-xl">{courseName}</DialogTitle>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge
                    className={cn(
                      level === 'graduate'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700'
                    )}
                  >
                    {level === 'graduate' ? 'Graduate' : 'Undergraduate'}
                  </Badge>
                  <Badge variant="outline">{getSubjectLabel(subject)}</Badge>
                </div>
              </DialogHeader>

              {/* Ratings Section */}
              <div className="grid grid-cols-2 gap-4 py-4 border-b">
                {/* Average Ratings */}
                <div className="border rounded-xl p-4">
                  <h4 className="text-sm font-medium text-center mb-3">
                    Average Course Ratings
                  </h4>
                  <div className="flex justify-center gap-6">
                    {/* Recommend Score */}
                    <div className="text-center">
                      {(() => {
                        const colors = averageRecommend ? getRatingColor(averageRecommend) : { bg: 'bg-gray-100', text: 'text-gray-600' };
                        return (
                          <div
                            className={cn(
                              'inline-flex items-center justify-center w-14 h-12 rounded-xl font-bold text-xl',
                              colors.bg, colors.text
                            )}
                          >
                            {averageRecommend?.toFixed(1) || '—'}
                          </div>
                        );
                      })()}
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                        Recommend
                      </div>
                    </div>

                    {/* Ease Score */}
                    <div className="text-center">
                      {(() => {
                        const colors = averageEase ? getRatingColor(averageEase) : { bg: 'bg-gray-100', text: 'text-gray-600' };
                        return (
                          <div
                            className={cn(
                              'inline-flex items-center justify-center w-14 h-12 rounded-xl font-bold text-xl',
                              colors.bg, colors.text
                            )}
                          >
                            {averageEase?.toFixed(1) || '—'}
                          </div>
                        );
                      })()}
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                        Ease
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating Distribution */}
                <div className="border rounded-xl p-4">
                  <h4 className="text-sm font-medium text-center mb-3">
                    Rating Distribution
                  </h4>
                  <div className="space-y-1.5">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = ratingDistribution?.[rating] || 0;
                      const total = reviewCount || 1;
                      const percentage = (count / total) * 100;
                      const labels = {
                        5: 'Highly Recommend',
                        4: 'Recommend',
                        3: 'Neutral',
                        2: 'Discourage',
                        1: 'Strongly Discourage',
                      };

                      return (
                        <div key={rating} className="flex items-center gap-2 text-xs">
                          <span className="w-32 text-gray-600 text-right">
                            {rating} ({labels[rating]})
                          </span>
                          <div className="flex-1 bg-gray-100 rounded-full h-2">
                            <div
                              className={cn(
                                'h-2 rounded-full transition-all',
                                percentage > 0 ? 'bg-linear-to-r from-[#FFB088] to-[#FE90AF]' : 'bg-gray-200'
                              )}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="w-6 text-gray-500">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Course Info - Two columns */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 py-4 text-sm border-b">
                <div className="flex items-center gap-2 text-gray-600">
                  <BookOpen className="w-4 h-4" />
                  <span>{credits} Credits</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span>{costRange}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Monitor className="w-4 h-4" />
                  <span>{getFormatDisplay()}</span>
                </div>
                {courseLengthWeeks && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{courseLengthWeeks} Weeks</span>
                  </div>
                )}
                {hasLab && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <FlaskConical className="w-4 h-4" />
                    <span>Lab {labKitRequired ? '(Kit Required)' : 'Included'}</span>
                  </div>
                )}
                {rollingAdmission && (
                  <div className="flex items-center gap-2 text-green-600">
                    <span className="text-xs">Rolling Admission: Yes</span>
                  </div>
                )}
              </div>

              {/* Reviews Section */}
              <div className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg">STUDENT REVIEWS</h4>
                  <Button
                    size="sm"
                    className="bg-linear-to-r from-[#FEF3E2] via-[#FFECD2] to-[#FFE4E1] hover:from-[#FDE8CC] hover:via-[#FFE0C0] hover:to-[#FFD8D4] text-orange-800 border border-orange-100/60 shadow-sm font-medium"
                    onClick={() => onWriteReview?.(course)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Write a Review
                  </Button>
                </div>

                {reviews && reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>No reviews yet. Be the first to review this course!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * ReviewCard - Individual review display
 */
function ReviewCard({ review }) {
  const { userNickname, recommend, ease, reviewText, tags, createdAt } = review;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get rating label
  const getRatingLabel = (score) => {
    if (score >= 5) return 'Highly Recommend';
    if (score >= 4) return 'Recommend';
    if (score >= 3) return 'Neutral';
    if (score >= 2) return 'Discourage';
    return 'Strongly Discourage';
  };

  // Get ease label
  const getEaseLabel = (score) => {
    if (score >= 5) return 'Very Easy';
    if (score >= 4) return 'Mild';
    if (score >= 3) return 'Moderate';
    if (score >= 2) return 'Challenging';
    return 'Very Challenging';
  };

  return (
    <div className="border rounded-xl overflow-hidden">
      {/* Yellow header bar */}
      <div className="bg-primary/30 px-4 py-2 flex justify-between items-center">
        <span className="text-sm font-medium">{userNickname}</span>
        <span className="text-xs text-gray-600">{formatDate(createdAt)}</span>
      </div>

      <div className="p-4">
        {/* Quick tags row */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="text-xs bg-gray-50">
            {recommend >= 4 ? '+ Recommend' : '- Not Recommended'}
          </Badge>
          <Badge variant="outline" className="text-xs bg-gray-50">
            {ease >= 4 ? 'Easy' : ease >= 3 ? 'Moderate' : 'Challenging'}
          </Badge>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs bg-green-50 text-green-700 border-green-200"
              >
                {getTagLabel(tag)}
              </Badge>
            ))}
          </div>
        )}

        {/* Review text */}
        {reviewText && <p className="text-sm text-gray-700 mb-3">{reviewText}</p>}

        {/* Rating scores */}
        <div className="flex gap-4 pt-2 border-t">
          <div className="text-xs">
            <span className="text-gray-500">Recommendation: </span>
            <span
              className={cn(
                'inline-flex items-center justify-center w-8 h-6 rounded font-medium ml-1',
                recommend >= 4 ? 'bg-green-100 text-green-700' : 'bg-gray-100'
              )}
            >
              {recommend}.0
            </span>
            <span className="text-gray-500 ml-1">{getRatingLabel(recommend)}</span>
          </div>
          <div className="text-xs">
            <span className="text-gray-500">Ease of Course: </span>
            <span
              className={cn(
                'inline-flex items-center justify-center w-8 h-6 rounded font-medium ml-1',
                ease >= 4 ? 'bg-green-100 text-green-700' : 'bg-gray-100'
              )}
            >
              {ease}.0
            </span>
            <span className="text-gray-500 ml-1">{getEaseLabel(ease)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailModal;
