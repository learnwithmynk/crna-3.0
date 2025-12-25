/**
 * WriteReviewModal Component
 *
 * Form for users to write a review for a prerequisite course.
 * Fields: recommend score, ease score, tags, review text, programs that require this course
 *
 * The "programs that require this course" field helps build data for:
 * - Showing "applicants to [School X] took these courses" on school profile pages
 * - Personalizing course recommendations based on user's target programs
 *
 * TODO: Wire up to Supabase prerequisites_reviews table
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/input';
import { Award, X, GraduationCap, Sparkles, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { REVIEW_TAGS } from '@/data/mockPrerequisites';

// Color coding for ratings (1-5): red to green gradient
const RATING_COLORS = {
  1: { bg: 'bg-red-100', border: 'border-red-400', text: 'text-red-700' },
  2: { bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-700' },
  3: { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-700' },
  4: { bg: 'bg-lime-100', border: 'border-lime-400', text: 'text-lime-700' },
  5: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700' },
};

const RATING_LABELS = {
  recommend: {
    1: 'Strongly Discourage',
    2: 'Discourage',
    3: 'Neutral',
    4: 'Recommend',
    5: 'Highly Recommend',
  },
  ease: {
    1: 'Very Challenging',
    2: 'Challenging',
    3: 'Moderate',
    4: 'Mild',
    5: 'Very Easy',
  },
};

const INITIAL_FORM_STATE = {
  recommend: 0,
  ease: 0,
  tags: [],
  reviewText: '',
};

export function WriteReviewModal({ course, open, onOpenChange, onSubmit }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRatingChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTagToggle = (tagKey) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagKey)
        ? prev.tags.filter((t) => t !== tagKey)
        : [...prev.tags, tagKey],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const reviewData = {
      courseId: course?.id,
      ...formData,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSubmit?.(reviewData);
    setShowSuccess(true);
    setIsSubmitting(false);

    // Reset after showing success
    setTimeout(() => {
      setFormData(INITIAL_FORM_STATE);
      setShowSuccess(false);
      onOpenChange(false);
    }, 2000);
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM_STATE);
    setShowSuccess(false);
    onOpenChange(false);
  };

  const isFormValid = formData.recommend > 0 && formData.ease > 0;

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md text-center">
          <div className="py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Review Submitted!</h3>
            <p className="text-gray-600 mb-4">
              Thank you for sharing your experience with this course.
            </p>
            <div className="inline-flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full">
              <span className="text-sm font-medium">+10 points earned</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-0 shadow-[0_0_30px_rgba(254,144,175,0.25),0_0_60px_rgba(255,176,136,0.15)]">
        {/* Gradient border wrapper */}
        <div className="p-px bg-linear-to-br from-[#FFD6B8] via-[#FE90AF] to-[#FFB088] rounded-3xl">
          <div className="bg-white rounded-[20px] max-h-[90vh] overflow-y-auto">
            <div className="p-6">
        <DialogHeader className="text-center pt-2">
          <DialogTitle>Write a Review</DialogTitle>
          {course && (
            <DialogDescription>
              Share your experience with{' '}
              <span className="font-medium text-gray-900">
                {course.courseName}
              </span>{' '}
              at {course.schoolName}
            </DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Ratings Section - Centered */}
          <div className="grid grid-cols-2 gap-8">
            {/* Recommend Rating */}
            <div className="text-center">
              <Label className="text-sm font-medium block mb-3">
                Would you recommend this course? *
              </Label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => {
                  const colors = RATING_COLORS[value];
                  const isSelected = formData.recommend === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleRatingChange('recommend', value)}
                      className={cn(
                        'w-11 h-11 rounded-xl border-2 font-bold text-base transition-all',
                        isSelected
                          ? `${colors.bg} ${colors.border} ${colors.text}`
                          : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                      )}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
              {formData.recommend > 0 && (
                <p className={cn('text-sm mt-2 font-medium', RATING_COLORS[formData.recommend].text)}>
                  {RATING_LABELS.recommend[formData.recommend]}
                </p>
              )}
            </div>

            {/* Ease Rating */}
            <div className="text-center">
              <Label className="text-sm font-medium block mb-3">
                How easy was this course? *
              </Label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => {
                  const colors = RATING_COLORS[value];
                  const isSelected = formData.ease === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleRatingChange('ease', value)}
                      className={cn(
                        'w-11 h-11 rounded-xl border-2 font-bold text-base transition-all',
                        isSelected
                          ? `${colors.bg} ${colors.border} ${colors.text}`
                          : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                      )}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
              {formData.ease > 0 && (
                <p className={cn('text-sm mt-2 font-medium', RATING_COLORS[formData.ease].text)}>
                  {RATING_LABELS.ease[formData.ease]}
                </p>
              )}
            </div>
          </div>

          {/* Tags - Two columns */}
          <div>
            <Label className="text-sm font-medium">
              Course characteristics (select all that apply)
            </Label>

            <div className="grid grid-cols-2 gap-4 mt-3">
              {/* Left column: Format & Assessment */}
              <div className="space-y-3">
                {/* Format Tags */}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                    Format
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {REVIEW_TAGS.format.map((tag) => (
                      <button
                        key={tag.key}
                        type="button"
                        onClick={() => handleTagToggle(tag.key)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-sm border transition-all',
                          formData.tags.includes(tag.key)
                            ? 'bg-green-100 border-green-400 text-green-800'
                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                        )}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Assessment Tags */}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                    Assessment
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {REVIEW_TAGS.assessment.map((tag) => (
                      <button
                        key={tag.key}
                        type="button"
                        onClick={() => handleTagToggle(tag.key)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-sm border transition-all',
                          formData.tags.includes(tag.key)
                            ? 'bg-green-100 border-green-400 text-green-800'
                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                        )}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column: Time & Lab */}
              <div className="space-y-3">
                {/* Time Tags */}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                    Time Required
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {REVIEW_TAGS.time.map((tag) => (
                      <button
                        key={tag.key}
                        type="button"
                        onClick={() => handleTagToggle(tag.key)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-sm border transition-all',
                          formData.tags.includes(tag.key)
                            ? 'bg-green-100 border-green-400 text-green-800'
                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                        )}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lab Tags */}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                    Lab Component
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {REVIEW_TAGS.lab.map((tag) => (
                      <button
                        key={tag.key}
                        type="button"
                        onClick={() => handleTagToggle(tag.key)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-sm border transition-all',
                          formData.tags.includes(tag.key)
                            ? 'bg-green-100 border-green-400 text-green-800'
                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                        )}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Your Review - Gradient highlighted section */}
          <div className="bg-linear-to-br from-[#FEF7E0] via-[#FFF0E6] to-[#FFEBE8] border border-orange-200/60 rounded-2xl p-4 -mx-1 shadow-sm">
            <Label htmlFor="reviewText" className="text-sm font-semibold text-gray-800">
              Your Review
            </Label>
            <p className="text-xs text-gray-500 mt-0.5 mb-2">
              Share details about your experience. What did you like? Tips for future students?
            </p>
            <Textarea
              id="reviewText"
              placeholder="This course was great because..."
              value={formData.reviewText}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, reviewText: e.target.value }))
              }
              rows={4}
              className="bg-white border-orange-100/80"
            />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="bg-linear-to-r from-[#F97316] via-[#FB923C] to-[#F59E0B] hover:from-[#EA580C] hover:via-[#F97316] hover:to-[#D97706] text-white border-0 shadow-md font-medium px-6"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
              <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] text-white bg-white/25 px-1.5 py-0.5 rounded-full">
                <Star className="w-2 h-2 fill-white text-white" />
                +10
              </span>
            </Button>
          </DialogFooter>
        </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default WriteReviewModal;
