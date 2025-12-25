/**
 * LessonPage
 *
 * User-facing lesson view page with video, content, and resources.
 * Features:
 * - Lesson X of Y indicator with prev/next navigation
 * - Status badge (In Progress / Completed)
 * - Vimeo video player (lazy-loaded)
 * - Video description
 * - "What You Need to Know" section (Editor.js content)
 * - "More Resources For You" section (downloads)
 * - Mark Complete button with gamification
 * - "Let's Keep Watching" next lessons section
 * - Access control (paywall if no access)
 *
 * Route: /learn/:moduleSlug/:lessonSlug
 */

import { useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';

// Hooks
import { useLesson, useAdjacentLessons } from '@/hooks/useLessons';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { useLessonAccess } from '@/hooks/useLessonAccess';
import { useAuth } from '@/hooks/useAuth';

// Components
import { VimeoPlayer } from '@/components/features/learning/VimeoPlayer';
import { LessonContent } from '@/components/features/learning/LessonContent';
import { LessonResources } from '@/components/features/learning/LessonResources';
import {
  LessonNavigation,
  LessonNavigationFull,
  NextLessonsPreview,
} from '@/components/features/learning/LessonNavigation';
import { MarkCompleteButton } from '@/components/features/learning/MarkCompleteButton';
import { LessonPaywall } from '@/components/features/learning/LessonPaywall';

export function LessonPage() {
  const { moduleSlug, lessonSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch lesson data
  const { lesson, module, isLoading, error } = useLesson(lessonSlug);

  // Get adjacent lessons for navigation
  const {
    prevLesson,
    nextLesson,
    totalLessons,
    currentPosition,
  } = useAdjacentLessons(module?.id, lesson?.order_index);

  // Get user's progress for this lesson
  const {
    isCompleted,
    videoProgress,
    isLoading: progressLoading,
    markComplete,
    markIncomplete,
    updateVideoProgress,
    recordAccess,
  } = useLessonProgress(lesson?.id);

  // Check if user has access to this lesson
  const { hasAccess, requiredEntitlements } = useLessonAccess(lesson, module);

  // Record lesson access on mount
  useEffect(() => {
    if (lesson?.id && hasAccess) {
      recordAccess();
    }
  }, [lesson?.id, hasAccess, recordAccess]);

  // Get next few lessons for "Keep Watching" section
  const upcomingLessons = useMemo(() => {
    if (!nextLesson) return [];
    // This would need to be fetched from the module
    // For now, just return the next lesson if available
    return nextLesson ? [nextLesson] : [];
  }, [nextLesson]);

  // Handle video time update for progress saving
  const handleVideoTimeUpdate = (seconds) => {
    // Debounce this - only save every 30 seconds
    if (Math.floor(seconds) % 30 === 0) {
      updateVideoProgress(seconds);
    }
  };

  // Handle video ended
  const handleVideoEnded = () => {
    // Could auto-mark complete when video ends
    // For now, let user manually mark complete
  };

  // Handle mark complete
  const handleMarkComplete = async () => {
    const result = await markComplete();
    return result;
  };

  // Handle undo complete
  const handleMarkIncomplete = async () => {
    const result = await markIncomplete();
    return result;
  };

  // Loading state
  if (isLoading) {
    return (
      <PageWrapper>
        <LessonPageSkeleton />
      </PageWrapper>
    );
  }

  // Error state
  if (error) {
    return (
      <PageWrapper>
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Failed to load lesson: {error}</p>
          <Button onClick={() => navigate(`/learn/${moduleSlug}`)}>
            Back to Module
          </Button>
        </div>
      </PageWrapper>
    );
  }

  // Not found state
  if (!lesson) {
    return (
      <PageWrapper>
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Lesson not found</p>
          <Button onClick={() => navigate('/learn')}>
            Back to Learning Library
          </Button>
        </div>
      </PageWrapper>
    );
  }

  // No access - show paywall
  if (!hasAccess) {
    return (
      <PageWrapper>
        {/* Back button */}
        <Link
          to={`/learn/${moduleSlug}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {module?.title || 'Module'}
        </Link>

        {/* Blurred preview */}
        <div className="relative mb-8">
          <div className="blur-sm pointer-events-none">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {lesson.title}
            </h1>
            {lesson.vimeo_video_id && (
              <div className="aspect-video bg-gray-200 rounded-xl mb-4" />
            )}
          </div>
        </div>

        {/* Paywall */}
        <div className="max-w-lg mx-auto">
          <LessonPaywall
            title={lesson.title}
            requiredEntitlements={requiredEntitlements}
          />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* Back link */}
      <Link
        to={`/learn/${moduleSlug}`}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {module?.title || 'Module'}
      </Link>

      {/* Navigation header */}
      <LessonNavigation
        moduleSlug={moduleSlug}
        prevLesson={prevLesson}
        nextLesson={nextLesson}
        currentPosition={currentPosition}
        totalLessons={totalLessons}
        isCompleted={isCompleted}
        className="mb-6"
      />

      {/* Lesson Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        {lesson.title}
      </h1>

      {/* Video Section */}
      {lesson.vimeo_video_id && (
        <div className="mb-8">
          <VimeoPlayer
            videoId={lesson.vimeo_video_id}
            thumbnailUrl={lesson.video_thumbnail_url}
            title={lesson.title}
            startTime={videoProgress}
            onTimeUpdate={handleVideoTimeUpdate}
            onEnded={handleVideoEnded}
          />

          {/* Video description */}
          {lesson.video_description && (
            <p className="mt-4 text-gray-600 leading-relaxed">
              {lesson.video_description}
            </p>
          )}
        </div>
      )}

      {/* Divider if both video and content exist */}
      {lesson.vimeo_video_id && lesson.content?.blocks?.length > 0 && (
        <hr className="border-gray-200 mb-8" />
      )}

      {/* Content Section */}
      {lesson.content && (
        <LessonContent content={lesson.content} className="mb-8" />
      )}

      {/* Divider before resources */}
      {(lesson.vimeo_video_id || lesson.content?.blocks?.length > 0) && (
        <hr className="border-gray-200 mb-8" />
      )}

      {/* Resources Section */}
      <LessonResources lesson={lesson} className="mb-8" />

      {/* Mark Complete */}
      <div className="py-6 border-t border-gray-200">
        <MarkCompleteButton
          isCompleted={isCompleted}
          isLoading={progressLoading}
          onMarkComplete={handleMarkComplete}
          onMarkIncomplete={handleMarkIncomplete}
        />
      </div>

      {/* Bottom Navigation */}
      <LessonNavigationFull
        moduleSlug={moduleSlug}
        prevLesson={prevLesson}
        nextLesson={nextLesson}
        className="mb-8"
      />

      {/* Next Lessons Preview */}
      {upcomingLessons.length > 0 && (
        <NextLessonsPreview
          moduleSlug={moduleSlug}
          nextLessons={upcomingLessons}
          className="pt-6 border-t border-gray-200"
        />
      )}
    </PageWrapper>
  );
}

/**
 * Loading skeleton for the lesson page
 */
function LessonPageSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Back link */}
      <Skeleton className="h-5 w-40 mb-4" />

      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      {/* Title */}
      <Skeleton className="h-10 w-3/4 mb-6" />

      {/* Video */}
      <Skeleton className="w-full aspect-video rounded-xl mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-8" />

      {/* Content */}
      <Skeleton className="h-6 w-48 mb-4" />
      <div className="space-y-3 mb-8">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Resources */}
      <Skeleton className="h-6 w-48 mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Skeleton className="aspect-[4/3] rounded-xl" />
        <Skeleton className="aspect-[4/3] rounded-xl" />
        <Skeleton className="aspect-[4/3] rounded-xl" />
      </div>
    </div>
  );
}

export default LessonPage;
