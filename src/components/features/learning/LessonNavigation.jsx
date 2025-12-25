/**
 * LessonNavigation Component
 *
 * Navigation controls for lesson pages:
 * - Lesson X of Y indicator
 * - Previous/Next lesson buttons
 * - Status badge (In Progress / Completed)
 *
 * Used in: LessonPage
 */

import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * @param {Object} props
 * @param {string} props.moduleSlug - Module slug for building URLs
 * @param {Object} props.prevLesson - Previous lesson object (or null)
 * @param {Object} props.nextLesson - Next lesson object (or null)
 * @param {number} props.currentPosition - Current lesson position (1-indexed)
 * @param {number} props.totalLessons - Total lessons in module
 * @param {boolean} props.isCompleted - Whether current lesson is completed
 * @param {string} props.className - Additional classes
 */
export function LessonNavigation({
  moduleSlug,
  prevLesson,
  nextLesson,
  currentPosition,
  totalLessons,
  isCompleted,
  className,
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 flex-wrap',
        className
      )}
    >
      {/* Left side: Position indicator */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">
          Lesson {currentPosition} of {totalLessons}
        </span>

        {/* Status badge */}
        {isCompleted ? (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </Badge>
        ) : (
          <Badge variant="secondary" className="gap-1">
            <Clock className="w-3.5 h-3.5" />
            In Progress
          </Badge>
        )}
      </div>

      {/* Right side: Prev/Next buttons */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        {prevLesson ? (
          <Button variant="outline" size="sm" asChild>
            <Link
              to={`/learn/${moduleSlug}/${prevLesson.slug}`}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled className="gap-1">
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
        )}

        {/* Next button */}
        {nextLesson ? (
          <Button variant="outline" size="sm" asChild>
            <Link
              to={`/learn/${moduleSlug}/${nextLesson.slug}`}
              className="gap-1"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled className="gap-1">
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * Bottom navigation with full lesson titles
 */
export function LessonNavigationFull({
  moduleSlug,
  prevLesson,
  nextLesson,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200',
        className
      )}
    >
      {/* Previous */}
      {prevLesson ? (
        <Link
          to={`/learn/${moduleSlug}/${prevLesson.slug}`}
          className="flex-1 flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          <div className="min-w-0">
            <p className="text-xs text-gray-500 uppercase tracking-widest">Previous</p>
            <p className="font-medium text-gray-900 truncate">{prevLesson.title}</p>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {/* Next */}
      {nextLesson ? (
        <Link
          to={`/learn/${moduleSlug}/${nextLesson.slug}`}
          className="flex-1 flex items-center justify-end gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group text-right"
        >
          <div className="min-w-0">
            <p className="text-xs text-gray-500 uppercase tracking-widest">Next</p>
            <p className="font-medium text-gray-900 truncate">{nextLesson.title}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}

/**
 * "Let's Keep Watching" section showing next lessons
 */
export function NextLessonsPreview({
  moduleSlug,
  nextLessons = [],
  className,
}) {
  if (!nextLessons.length) return null;

  return (
    <section className={cn('', className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Let's Keep Watching...
      </h3>

      <div className="space-y-2">
        {nextLessons.slice(0, 3).map((lesson, index) => (
          <Link
            key={lesson.id}
            to={`/learn/${moduleSlug}/${lesson.slug}`}
            className="flex items-center gap-4 p-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
          >
            <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-500">
              {index + 1}
            </span>
            <span className="flex-1 font-medium text-gray-900 group-hover:text-purple-700 transition-colors truncate">
              {lesson.title}
            </span>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500" />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default LessonNavigation;
