/**
 * ContinueLearningWidget - Shows most recently accessed lesson/module
 *
 * Displays "Continue Where You Left Off" with the user's most recently
 * accessed lesson that hasn't been completed yet.
 *
 * Used in: DashboardPage sidebar
 */

import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Play, CheckCircle } from 'lucide-react';
import { useRecentlyAccessedLessons } from '@/hooks/useLessonProgress';

export function ContinueLearningWidget() {
  const { lessons, isLoading } = useRecentlyAccessedLessons(3);

  // Find the first incomplete lesson to continue
  const continueLesson = lessons.find((l) => !l.completed);

  // If all recent lessons are complete, show the most recent one
  const displayLesson = continueLesson || lessons[0];

  if (isLoading) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="w-4 h-4" />
            Continue Learning
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!displayLesson) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="w-4 h-4" />
            Continue Learning
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-center py-4">
            <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Start your first lesson</p>
            <Link
              to="/learning"
              className="text-sm text-purple-600 hover:text-purple-700 hover:underline mt-2 inline-block"
            >
              Browse courses
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const lessonUrl = `/learning/${displayLesson.moduleSlug}/${displayLesson.slug}`;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="w-4 h-4" />
          Continue Learning
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-3">
          {/* Current lesson */}
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500 text-white shrink-0">
                {displayLesson.completed ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-2">{displayLesson.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{displayLesson.moduleTitle}</p>
              </div>
            </div>

            <Button
              asChild
              size="sm"
              className="w-full mt-3"
            >
              <Link to={lessonUrl}>
                {displayLesson.completed ? 'Review Lesson' : 'Continue'}
              </Link>
            </Button>
          </div>

          {/* Other recent lessons (up to 2 more) */}
          {lessons.length > 1 && (
            <div className="pt-2 border-t">
              <p className="text-xs font-medium text-gray-500 mb-2">Other Recent</p>
              <div className="space-y-1.5">
                {lessons
                  .filter((l) => l.id !== displayLesson.id)
                  .slice(0, 2)
                  .map((lesson) => (
                    <Link
                      key={lesson.id}
                      to={`/learning/${lesson.moduleSlug}/${lesson.slug}`}
                      className="flex items-center gap-2 p-1.5 -mx-1.5 rounded hover:bg-gray-50 transition-colors group"
                    >
                      {lesson.completed ? (
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
                      )}
                      <span className="text-sm text-gray-600 group-hover:text-purple-700 line-clamp-1">
                        {lesson.title}
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ContinueLearningWidget;
