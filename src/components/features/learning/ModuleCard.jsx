/**
 * ModuleCard Component
 *
 * Card displaying a learning module in the Learning Library grid.
 * Shows thumbnail, title, description, lesson count, progress, and access status.
 *
 * Used in: LearningLibraryPage
 */

import { Link } from 'react-router-dom';
import { Lock, BookOpen, CheckCircle2, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

/**
 * @param {Object} props
 * @param {Object} props.module - Module data
 * @param {number} props.progressPercent - User's completion percentage (0-100)
 * @param {number} props.completedLessons - Number of completed lessons
 * @param {boolean} props.hasAccess - Whether user has access to this module
 * @param {string} props.lastAccessedAt - ISO date string of last access
 */
export function ModuleCard({
  module,
  progressPercent = 0,
  completedLessons = 0,
  hasAccess = true,
  lastAccessedAt,
}) {
  const {
    slug,
    title,
    description,
    thumbnail_url,
    lessonCount = 0,
    category_slugs = [],
  } = module;

  // Format last accessed date
  const formatLastAccessed = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isStarted = progressPercent > 0;
  const isCompleted = progressPercent >= 100;
  const lastAccessed = formatLastAccessed(lastAccessedAt);

  return (
    <Link to={hasAccess ? `/learn/${slug}` : '#'} className="block group">
      <Card
        interactive={hasAccess}
        className={cn(
          'overflow-hidden h-full flex flex-col',
          !hasAccess && 'opacity-75 cursor-not-allowed'
        )}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-100 overflow-hidden">
          {thumbnail_url ? (
            <img
              src={thumbnail_url}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-primary/20">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {/* Lock overlay if no access */}
          {!hasAccess && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white rounded-full p-3">
                <Lock className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          )}

          {/* Completed badge */}
          {isCompleted && hasAccess && (
            <div className="absolute top-2 right-2">
              <Badge variant="success" className="gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Complete
              </Badge>
            </div>
          )}

          {/* Category badge */}
          {category_slugs.length > 0 && (
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="capitalize">
                {category_slugs[0].replace(/-/g, ' ')}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-purple-700 transition-colors">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">
              {description}
            </p>
          )}

          {/* Meta info */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}
            </span>
            {lastAccessed && hasAccess && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {lastAccessed}
              </span>
            )}
          </div>

          {/* Progress bar (only show if started and has access) */}
          {hasAccess && (
            <div className="mt-auto">
              {isStarted ? (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium text-gray-700">
                      {completedLessons}/{lessonCount} lessons
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-1.5" />
                </div>
              ) : (
                <div className="text-xs text-gray-400">Not started</div>
              )}
            </div>
          )}

          {/* Locked message */}
          {!hasAccess && (
            <div className="mt-auto text-xs text-gray-500 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Membership required
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}

export default ModuleCard;
