/**
 * ModuleDetailPage
 *
 * Displays a learning module with its lessons grouped by sections.
 * Features:
 * - Module header with thumbnail, title, description
 * - Progress bar with completion percentage
 * - "Start Module" or "Continue" button
 * - Search lessons
 * - Lesson list grouped by sections (collapsible)
 * - Completion checkmark per lesson
 * - Paywall for users without access
 *
 * Route: /learn/:moduleSlug
 */

import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  BookOpen,
  Play,
  Search,
  X,
} from 'lucide-react';
import { useModule } from '@/hooks/useModules';
import { useModuleProgress } from '@/hooks/useLessonProgress';
import { useLessonsAccess } from '@/hooks/useLessonAccess';
import { useAuth } from '@/hooks/useAuth';
import { LessonList } from '@/components/features/learning/LessonList';
import { ProgressBar } from '@/components/features/learning/ProgressBar';
import { LessonPaywall } from '@/components/features/learning/LessonPaywall';
import { InlineSearch } from '@/components/features/search/InlineSearch';
import { cn } from '@/lib/utils';

export function ModuleDetailPage() {
  const { moduleSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch module with sections and lessons
  const {
    module,
    sections,
    lessons,
    lessonsBySection,
    isLoading,
    error,
  } = useModule(moduleSlug);

  // Get user's progress for this module
  const {
    totalLessons,
    completedLessons,
    progressPercent,
    isLoading: progressLoading,
  } = useModuleProgress(module?.id);

  // Check access for all lessons
  const accessMap = useLessonsAccess(lessons, module);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Check if user has access to the module
  const hasModuleAccess = useMemo(() => {
    const userEntitlements = user?.entitlements || user?.user_metadata?.entitlements || [];
    const requiredEntitlements = module?.accessible_via || [];

    if (requiredEntitlements.length === 0) return true;
    return requiredEntitlements.some((e) => userEntitlements.includes(e));
  }, [module, user]);

  // Filter lessons by search
  const filteredLessons = useMemo(() => {
    if (!searchQuery) return lessons;

    const query = searchQuery.toLowerCase();
    return lessons.filter((lesson) =>
      lesson.title.toLowerCase().includes(query)
    );
  }, [lessons, searchQuery]);

  // Group filtered lessons by section
  const filteredLessonsBySection = useMemo(() => {
    const grouped = {};

    filteredLessons.forEach((lesson) => {
      const sectionId = lesson.section_id || 'unsectioned';
      if (!grouped[sectionId]) {
        grouped[sectionId] = [];
      }
      grouped[sectionId].push(lesson);
    });

    return grouped;
  }, [filteredLessons]);

  // Mock progress map (will be replaced with real data)
  const progressMap = useMemo(() => {
    const map = new Map();
    // TODO: Replace with actual user progress from useLessonProgress
    return map;
  }, []);

  // Find the first incomplete lesson for "Continue" button
  const nextLesson = useMemo(() => {
    if (!lessons.length) return null;

    // Find first lesson that isn't completed
    for (const lesson of lessons) {
      const progress = progressMap.get(lesson.id);
      if (!progress?.completed) {
        return lesson;
      }
    }

    // All complete, return first lesson
    return lessons[0];
  }, [lessons, progressMap]);

  // Loading state
  if (isLoading) {
    return (
      <PageWrapper>
        <ModuleDetailSkeleton />
      </PageWrapper>
    );
  }

  // Error state
  if (error) {
    return (
      <PageWrapper>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Failed to load module: {error}</p>
          <Button onClick={() => navigate('/learn')}>
            Back to Learning Library
          </Button>
        </div>
      </PageWrapper>
    );
  }

  // Not found state
  if (!module) {
    return (
      <PageWrapper>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Module not found</p>
          <Button onClick={() => navigate('/learn')}>
            Back to Learning Library
          </Button>
        </div>
      </PageWrapper>
    );
  }

  // No access - show paywall
  if (!hasModuleAccess) {
    return (
      <PageWrapper>
        {/* Back button */}
        <Link
          to="/learn"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Learning Library
        </Link>

        {/* Module header (blurred preview) */}
        <div className="relative mb-8">
          <div className="blur-sm pointer-events-none">
            <ModuleHeader module={module} />
          </div>
        </div>

        {/* Paywall */}
        <div className="max-w-lg mx-auto">
          <LessonPaywall
            title={module.title}
            requiredEntitlements={module.accessible_via}
          />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* Back button */}
      <Link
        to="/learn"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Learning Library
      </Link>

      {/* Module Header */}
      <ModuleHeader module={module} />

      {/* Progress Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-2">Your Progress</h3>
            <ProgressBar
              value={progressPercent}
              completedLessons={completedLessons}
              totalLessons={totalLessons || lessons.length}
              showLabel
              showCount
              size="md"
            />
          </div>

          {/* Start / Continue Button */}
          {nextLesson && (
            <Button size="lg" className="gap-2" asChild>
              <Link to={`/learn/${moduleSlug}/${nextLesson.slug}`}>
                <Play className="w-5 h-5" />
                {completedLessons > 0 ? 'Continue' : 'Start Module'}
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Lessons Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Lessons
            <span className="text-gray-500 font-normal ml-2">
              ({lessons.length})
            </span>
          </h2>

          {/* Search */}
          <div className="w-full sm:w-64">
            <InlineSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search lessons..."
            />
          </div>
        </div>

        {/* Search results info */}
        {searchQuery && (
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
            <span>
              {filteredLessons.length} lesson{filteredLessons.length !== 1 ? 's' : ''} found
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Lesson List */}
        {filteredLessons.length > 0 ? (
          <LessonList
            lessons={filteredLessons}
            sections={sections}
            lessonsBySection={searchQuery ? filteredLessonsBySection : lessonsBySection}
            progressMap={progressMap}
            accessMap={accessMap}
            moduleSlug={moduleSlug}
          />
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No lessons match your search</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

/**
 * Module Header component
 */
function ModuleHeader({ module }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8">
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-full md:w-64 aspect-video md:aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
        {module.thumbnail_url ? (
          <img
            src={module.thumbnail_url}
            alt={module.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-primary/20">
            <BookOpen className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        {/* Categories */}
        {module.category_slugs?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {module.category_slugs.map((cat) => (
              <Badge key={cat} variant="secondary" className="capitalize">
                {cat.replace(/-/g, ' ')}
              </Badge>
            ))}
          </div>
        )}

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          {module.title}
        </h1>

        {module.description && (
          <p className="text-gray-600 leading-relaxed">
            {module.description}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Loading skeleton for the page
 */
function ModuleDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Back button */}
      <Skeleton className="h-6 w-40 mb-6" />

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <Skeleton className="w-full md:w-64 aspect-video md:aspect-[4/3] rounded-xl" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>

      {/* Progress */}
      <Skeleton className="h-32 w-full rounded-xl mb-8" />

      {/* Lessons */}
      <Skeleton className="h-8 w-32 mb-4" />
      <div className="space-y-2">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default ModuleDetailPage;
