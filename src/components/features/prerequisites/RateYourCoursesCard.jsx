/**
 * RateYourCoursesCard Component
 *
 * Displays user's completed prerequisites that haven't been rated yet.
 * Encourages users to rate courses and contribute to the library.
 *
 * Subtext: "Earn Points by contributing to our Library"
 * Points: +20 for combined submit + review
 */

import { useState } from 'react';
import { Star, BookOpen, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Subject type to display label
const SUBJECT_LABELS = {
  anatomy: 'Anatomy',
  physiology: 'Physiology',
  anatomy_physiology: 'Anatomy & Physiology',
  general_chemistry: 'General Chemistry',
  organic_chemistry: 'Organic Chemistry',
  biochemistry: 'Biochemistry',
  statistics: 'Statistics',
  physics: 'Physics',
  pharmacology: 'Pharmacology',
  pathophysiology: 'Pathophysiology',
  microbiology: 'Microbiology',
  research: 'Research Methods',
};

/**
 * Single unrated course row
 */
function UnratedCourseRow({ prereq, onRate }) {
  const subjectLabel = SUBJECT_LABELS[prereq.courseType] || prereq.courseType;

  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors group">
      {/* Subject indicator */}
      <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
        <BookOpen className="w-4 h-4 text-orange-600" />
      </div>

      {/* Course info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {prereq.schoolName || subjectLabel}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {prereq.schoolName ? subjectLabel : `Grade: ${prereq.grade || 'N/A'}`}
        </p>
      </div>

      {/* Rate button */}
      <Button
        size="sm"
        onClick={() => onRate(prereq)}
        className="bg-linear-to-r from-[#F97316] via-[#FB923C] to-[#F59E0B] hover:from-[#EA580C] hover:via-[#F97316] hover:to-[#D97706] text-white border-0 shadow-sm text-xs px-3 h-7"
      >
        Rate
        <ChevronRight className="w-3 h-3 ml-0.5" />
      </Button>
    </div>
  );
}

/**
 * Main RateYourCoursesCard component
 *
 * @param {Array} completedPrerequisites - User's completed prerequisites from MyStats
 * @param {Function} onRateCourse - Handler when user clicks "Rate" on a course
 * @param {string} className - Additional CSS classes
 */
export function RateYourCoursesCard({
  completedPrerequisites = [],
  onRateCourse,
  className,
}) {
  // Filter to only completed courses without a library link (unrated)
  const unratedCourses = completedPrerequisites.filter(
    (p) => p.status === 'completed' && !p.prerequisiteLibraryCourseId
  );

  const totalCompleted = completedPrerequisites.filter(
    (p) => p.status === 'completed'
  ).length;
  const ratedCount = totalCompleted - unratedCourses.length;

  // Don't show if no unrated courses
  if (unratedCourses.length === 0) {
    return null;
  }

  return (
    <div className={cn('overflow-hidden', className)}>
      {/* Gradient border wrapper */}
      <div className="p-px bg-linear-to-br from-[#FFD6B8] via-[#FE90AF] to-[#FFB088] rounded-2xl">
        <div className="bg-white rounded-[15px]">
          {/* Header */}
          <div className="px-4 py-3 bg-linear-to-r from-orange-50/80 to-amber-50/80 border-b border-orange-100/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-linear-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                  <Star className="w-4 h-4 text-white fill-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Rate Your Courses
                  </h3>
                  <p className="text-xs text-gray-500">
                    Earn Points by contributing to our Library
                  </p>
                </div>
              </div>

              {/* Points badge */}
              <div className="inline-flex items-center gap-1 bg-linear-to-r from-[#FEF3E2] to-[#FFE4E1] px-2.5 py-1 rounded-full border border-orange-200/60">
                <Sparkles className="w-3 h-3 text-orange-500" />
                <span className="text-xs font-medium text-orange-700">+20 pts</span>
              </div>
            </div>

            {/* Progress indicator */}
            {totalCompleted > 1 && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-orange-400 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${(ratedCount / totalCompleted) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {ratedCount} of {totalCompleted} rated
                </span>
              </div>
            )}
          </div>

          {/* Course list */}
          <div className="p-2 space-y-1 max-h-[200px] overflow-y-auto">
            {unratedCourses.slice(0, 5).map((prereq, index) => (
              <UnratedCourseRow
                key={prereq.id || index}
                prereq={prereq}
                onRate={onRateCourse}
              />
            ))}

            {unratedCourses.length > 5 && (
              <p className="text-xs text-gray-400 text-center py-2">
                +{unratedCourses.length - 5} more courses to rate
              </p>
            )}
          </div>

          {/* All rated state (won't normally show due to early return) */}
          {unratedCourses.length === 0 && totalCompleted > 0 && (
            <div className="p-4 text-center">
              <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">
                All courses rated!
              </p>
              <p className="text-xs text-gray-500">
                Thank you for contributing to the community.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RateYourCoursesCard;
