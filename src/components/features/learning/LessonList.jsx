/**
 * LessonList Component
 *
 * Displays lessons in a module, optionally grouped by sections.
 * Features collapsible section headers and completion status per lesson.
 *
 * Used in: ModuleDetailPage
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Lock,
  PlayCircle,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @param {Object} props
 * @param {Array} props.lessons - Array of lesson objects
 * @param {Array} props.sections - Array of section objects (optional)
 * @param {Object} props.lessonsBySection - Map of sectionId -> lessons array
 * @param {Map} props.progressMap - Map of lessonId -> { completed, lastAccessedAt }
 * @param {Map} props.accessMap - Map of lessonId -> { hasAccess, isLocked }
 * @param {string} props.moduleSlug - Module slug for building lesson URLs
 * @param {string} props.currentLessonId - Currently active lesson (for highlighting)
 */
export function LessonList({
  lessons = [],
  sections = [],
  lessonsBySection = {},
  progressMap = new Map(),
  accessMap = new Map(),
  moduleSlug,
  currentLessonId,
}) {
  // Track which sections are expanded
  const [expandedSections, setExpandedSections] = useState(() => {
    // Default all sections to expanded
    const initial = new Set();
    sections.forEach((s) => initial.add(s.id));
    initial.add('unsectioned'); // For lessons without a section
    return initial;
  });

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  // If no sections, render flat list
  if (sections.length === 0) {
    return (
      <div className="space-y-1">
        {lessons.map((lesson, index) => (
          <LessonItem
            key={lesson.id}
            lesson={lesson}
            index={index + 1}
            moduleSlug={moduleSlug}
            progress={progressMap.get(lesson.id)}
            access={accessMap.get(lesson.id)}
            isActive={lesson.id === currentLessonId}
          />
        ))}
      </div>
    );
  }

  // Render with sections
  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const sectionLessons = lessonsBySection[section.id] || [];
        const isExpanded = expandedSections.has(section.id);
        const completedCount = sectionLessons.filter(
          (l) => progressMap.get(l.id)?.completed
        ).length;

        return (
          <div key={section.id} className="border border-gray-200 rounded-xl overflow-hidden">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
                <span className="font-medium text-gray-900">{section.title}</span>
              </div>
              <span className="text-sm text-gray-500">
                {completedCount}/{sectionLessons.length} completed
              </span>
            </button>

            {/* Section Lessons */}
            {isExpanded && sectionLessons.length > 0 && (
              <div className="divide-y divide-gray-100">
                {sectionLessons.map((lesson, index) => (
                  <LessonItem
                    key={lesson.id}
                    lesson={lesson}
                    index={index + 1}
                    moduleSlug={moduleSlug}
                    progress={progressMap.get(lesson.id)}
                    access={accessMap.get(lesson.id)}
                    isActive={lesson.id === currentLessonId}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Unsectioned lessons */}
      {lessonsBySection['unsectioned']?.length > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('unsectioned')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              {expandedSections.has('unsectioned') ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
              <span className="font-medium text-gray-900">Other Lessons</span>
            </div>
          </button>

          {expandedSections.has('unsectioned') && (
            <div className="divide-y divide-gray-100">
              {lessonsBySection['unsectioned'].map((lesson, index) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  index={index + 1}
                  moduleSlug={moduleSlug}
                  progress={progressMap.get(lesson.id)}
                  access={accessMap.get(lesson.id)}
                  isActive={lesson.id === currentLessonId}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Individual lesson item in the list
 */
function LessonItem({ lesson, index, moduleSlug, progress, access, isActive }) {
  const isCompleted = progress?.completed;
  const isLocked = access?.isLocked;
  const hasVideo = !!lesson.vimeo_video_id;

  // Format duration if available
  const formatDuration = (seconds) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const duration = formatDuration(lesson.video_duration_seconds);

  const content = (
    <div
      className={cn(
        'flex items-center gap-3 p-4 transition-colors',
        isActive && 'bg-primary/10',
        !isLocked && !isActive && 'hover:bg-gray-50',
        isLocked && 'opacity-60'
      )}
    >
      {/* Status Icon */}
      <div className="flex-shrink-0">
        {isLocked ? (
          <Lock className="w-5 h-5 text-gray-400" />
        ) : isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <Circle className="w-5 h-5 text-gray-300" />
        )}
      </div>

      {/* Lesson Number */}
      <span className="flex-shrink-0 w-6 text-sm text-gray-400 font-medium">
        {index}
      </span>

      {/* Title and Meta */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'font-medium truncate',
            isCompleted ? 'text-gray-500' : 'text-gray-900',
            isActive && 'text-purple-700'
          )}
        >
          {lesson.title}
        </p>
      </div>

      {/* Duration / Video indicator */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        {hasVideo && <PlayCircle className="w-4 h-4" />}
        {duration && (
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {duration}
          </span>
        )}
      </div>
    </div>
  );

  // If locked, render as non-clickable div
  if (isLocked) {
    return <div className="cursor-not-allowed">{content}</div>;
  }

  // Otherwise render as link
  return (
    <Link
      to={`/learn/${moduleSlug}/${lesson.slug}`}
      className="block"
    >
      {content}
    </Link>
  );
}

/**
 * Compact lesson list for sidebar navigation
 */
export function LessonListCompact({
  lessons = [],
  progressMap = new Map(),
  moduleSlug,
  currentLessonId,
}) {
  return (
    <div className="space-y-0.5">
      {lessons.map((lesson, index) => {
        const isCompleted = progressMap.get(lesson.id)?.completed;
        const isActive = lesson.id === currentLessonId;

        return (
          <Link
            key={lesson.id}
            to={`/learn/${moduleSlug}/${lesson.slug}`}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
              isActive
                ? 'bg-primary/20 text-gray-900 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
            )}
            <span className="truncate">{lesson.title}</span>
          </Link>
        );
      })}
    </div>
  );
}

export default LessonList;
