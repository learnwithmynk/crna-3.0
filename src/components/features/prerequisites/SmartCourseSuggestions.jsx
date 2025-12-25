/**
 * SmartCourseSuggestions Component
 *
 * Personalized course suggestions based on:
 * 1. User's target/saved programs and their prerequisite requirements
 * 2. User's completed prerequisites (to identify gaps)
 * 3. Top-rated courses in subjects the user needs
 *
 * Falls back to "Top Rated" and "Most Reviewed" if no personalization data available.
 */

import { useState, useMemo } from 'react';
import {
  Star,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Heart,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SUBJECT_AREAS } from '@/data/mockPrerequisites';

// How many items to show per category
const ITEMS_PER_CATEGORY = 3;

/**
 * Map school prerequisite fields to course subject keys
 */
const PREREQ_FIELD_TO_SUBJECT = {
  prereqStatistics: 'statistics',
  prereqGenChemistry: 'general_chemistry',
  prereqOrganicChemistry: 'organic_chemistry',
  prereqBiochemistry: 'biochemistry',
  prereqAnatomy: 'anatomy',
  prereqPhysics: 'physics',
  prereqPharmacology: 'pharmacology',
  prereqPhysiology: 'physiology',
  prereqMicrobiology: 'microbiology',
  prereqResearch: 'research',
};

/**
 * Map user's completed courseType to subject key
 */
const COURSE_TYPE_TO_SUBJECT = {
  anatomy: 'anatomy',
  physiology: 'physiology',
  anatomy_physiology: 'anatomy_physiology',
  general_chemistry: 'general_chemistry',
  organic_chemistry: 'organic_chemistry',
  biochemistry: 'biochemistry',
  statistics: 'statistics',
  physics: 'physics',
  pharmacology: 'pharmacology',
  pathophysiology: 'pathophysiology',
  microbiology: 'microbiology',
  research: 'research',
};

/**
 * Get prerequisite gaps - subjects required by target programs but not completed by user
 */
function getPrerequisiteGaps(targetPrograms = [], completedPrerequisites = []) {
  // Get all required subjects from target programs
  const requiredSubjects = new Set();

  for (const program of targetPrograms) {
    for (const [field, subject] of Object.entries(PREREQ_FIELD_TO_SUBJECT)) {
      if (program[field] === true) {
        requiredSubjects.add(subject);
      }
    }
  }

  // Get completed subjects
  const completedSubjects = new Set(
    completedPrerequisites.map(p => COURSE_TYPE_TO_SUBJECT[p.courseType] || p.courseType)
  );

  // Also consider combined courses (A&P covers both anatomy and physiology)
  if (completedSubjects.has('anatomy_physiology')) {
    completedSubjects.add('anatomy');
    completedSubjects.add('physiology');
  }

  // Return subjects that are required but not completed
  const gaps = Array.from(requiredSubjects).filter(s => !completedSubjects.has(s));
  return gaps;
}

/**
 * Get subject label for display
 */
function getSubjectLabel(subjectKey) {
  const subject = SUBJECT_AREAS.find(s => s.key === subjectKey);
  return subject?.label || subjectKey.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Compact single-line suggested course row
 */
function CompactCourseRow({
  course,
  badge,
  badgeColor,
  onViewDetails,
  onSave,
}) {
  return (
    <div
      className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-50 transition-colors group cursor-pointer"
      onClick={() => onViewDetails(course)}
    >
      {/* Color indicator */}
      <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', badgeColor)} />

      {/* Course name - truncated */}
      <span className="flex-1 text-sm text-gray-900 truncate min-w-0">
        {course.courseName}
      </span>

      {/* Badge (e.g., "3/5 programs" or "8 programs") */}
      <span className="text-xs text-gray-400 flex-shrink-0 hidden sm:inline">
        {badge}
      </span>

      {/* Rating */}
      <span className="text-xs font-medium text-gray-600 flex-shrink-0 w-8 text-right">
        {course.averageRecommend?.toFixed(1)}
      </span>

      {/* Save button - visible on hover */}
      {!course.isSaved && (
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onSave(course.id);
          }}
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        >
          <Heart className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}

/**
 * Main component - compact collapsible panel
 *
 * @param {Array} courses - All available courses
 * @param {Array} targetPrograms - User's target/saved programs (with prereq fields)
 * @param {Array} completedPrerequisites - User's completed prerequisites [{courseType, grade, ...}]
 * @param {Function} onViewDetails - Handler for viewing course details
 * @param {Function} onSave - Handler for saving a course
 * @param {string} className - Additional CSS classes
 */
export function SmartCourseSuggestions({
  courses = [],
  targetPrograms = [],
  completedPrerequisites = [],
  onViewDetails,
  onSave,
  className,
}) {
  // Default collapsed on mobile, expanded on desktop
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate personalized suggestions
  const { personalizedCourses, prerequisiteGaps } = useMemo(() => {
    const gaps = getPrerequisiteGaps(targetPrograms, completedPrerequisites);

    if (gaps.length === 0 || targetPrograms.length === 0) {
      return { personalizedCourses: [], prerequisiteGaps: [] };
    }

    // Get top-rated courses in gap subjects
    const coursesInGapSubjects = courses
      .filter(c => gaps.includes(c.subject) && c.reviewCount > 0)
      .sort((a, b) => b.averageRecommend - a.averageRecommend)
      .slice(0, ITEMS_PER_CATEGORY);

    return {
      personalizedCourses: coursesInGapSubjects,
      prerequisiteGaps: gaps,
    };
  }, [courses, targetPrograms, completedPrerequisites]);

  // Get top-rated courses (highest recommend score) - fallback/additional
  const topRatedCourses = useMemo(() => {
    return [...courses]
      .filter((c) => c.reviewCount > 0)
      .sort((a, b) => b.averageRecommend - a.averageRecommend)
      .slice(0, ITEMS_PER_CATEGORY);
  }, [courses]);

  // Get most-reviewed courses (most reviews = most vetted) - fallback/additional
  const mostReviewedCourses = useMemo(() => {
    return [...courses]
      .filter((c) => c.reviewCount > 0)
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, ITEMS_PER_CATEGORY);
  }, [courses]);

  const hasPersonalized = personalizedCourses.length > 0;
  const totalSuggestions = hasPersonalized
    ? personalizedCourses.length + topRatedCourses.length
    : topRatedCourses.length + mostReviewedCourses.length;

  if (totalSuggestions === 0) {
    return null;
  }

  return (
    <div
      className={cn('rounded-2xl bg-white/80 backdrop-blur-sm overflow-hidden shadow-sm max-w-2xl', className)}
    >
      {/* Compact header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 bg-gradient-to-r from-purple-50/50 to-yellow-50/50 flex items-center justify-between hover:bg-purple-50/70 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          <span className="text-sm font-medium text-gray-700">
            Suggested for You
          </span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-purple-100 text-purple-700">
            {totalSuggestions}
          </Badge>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Compact suggestions list */}
      {isExpanded && (
        <div className="divide-y divide-gray-50">
          {/* Personalized - Based on Prerequisite Gaps */}
          {hasPersonalized && personalizedCourses.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-1.5 px-2 mb-1">
                <Target className="w-3 h-3 text-purple-500" />
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">
                  For Your Programs
                </span>
              </div>
              <p className="text-[10px] text-gray-400 px-2 mb-1.5">
                Based on prerequisites you still need
              </p>
              {personalizedCourses.map((course) => (
                <CompactCourseRow
                  key={`personalized-${course.id}`}
                  course={course}
                  badge={getSubjectLabel(course.subject)}
                  badgeColor="bg-purple-500"
                  onViewDetails={onViewDetails}
                  onSave={onSave}
                />
              ))}
            </div>
          )}

          {/* Top Rated */}
          {topRatedCourses.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-1.5 px-2 mb-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">
                  Top Rated
                </span>
              </div>
              {topRatedCourses.map((course) => (
                <CompactCourseRow
                  key={course.id}
                  course={course}
                  badge={`${course.reviewCount} reviews`}
                  badgeColor="bg-yellow-500"
                  onViewDetails={onViewDetails}
                  onSave={onSave}
                />
              ))}
            </div>
          )}

          {/* Most Reviewed - only show if no personalized (as fallback) */}
          {!hasPersonalized && mostReviewedCourses.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-1.5 px-2 mb-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">
                  Most Reviewed
                </span>
              </div>
              {mostReviewedCourses.map((course) => (
                <CompactCourseRow
                  key={`reviewed-${course.id}`}
                  course={course}
                  badge={`${course.reviewCount} reviews`}
                  badgeColor="bg-green-500"
                  onViewDetails={onViewDetails}
                  onSave={onSave}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SmartCourseSuggestions;
