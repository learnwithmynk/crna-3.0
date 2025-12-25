/**
 * LessonResources Component
 *
 * Displays downloadable resources for a lesson.
 * Shows "More Resources For You" section with download cards.
 *
 * Used in: LessonPage
 */

import { Download } from 'lucide-react';
import { DownloadCard } from './DownloadCard';
import { useLessonDownloads } from '@/hooks/useDownloads';
import { useDownloadAdmin } from '@/hooks/useDownloads';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/**
 * Check if user has access to a download
 * @param {Object} download - Download object
 * @param {Array} userEntitlements - User's entitlements
 * @returns {boolean}
 */
function hasDownloadAccess(download, userEntitlements) {
  // Free downloads are accessible to everyone
  if (download.is_free) return true;

  // If no entitlements required, it's free
  const required = download.accessible_via || [];
  if (required.length === 0) return true;

  // Check if user has any required entitlement
  return required.some((ent) => userEntitlements.includes(ent));
}

/**
 * @param {Object} props
 * @param {Object} props.lesson - Lesson object with resource config
 * @param {string} props.className - Additional classes
 */
export function LessonResources({ lesson, className }) {
  const { user } = useAuth();
  const { downloads, isLoading, error } = useLessonDownloads(lesson);
  const { incrementDownloadCount } = useDownloadAdmin();

  // Get user entitlements
  const userEntitlements = user?.entitlements || user?.user_metadata?.entitlements || [];

  // Handle download click (track count)
  const handleDownload = async (downloadId) => {
    await incrementDownloadCount(downloadId);
  };

  // Don't render section if no downloads and not loading
  if (!isLoading && (!downloads || downloads.length === 0)) {
    return null;
  }

  return (
    <section className={cn('', className)}>
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <Download className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          More Resources For You
        </h2>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4">
              <Skeleton className="aspect-[4/3] w-full mb-3 rounded" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-6 text-gray-500">
          <p>Failed to load resources</p>
        </div>
      )}

      {/* Downloads grid */}
      {!isLoading && !error && downloads.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {downloads.map((download) => (
            <DownloadCard
              key={download.id}
              download={download}
              hasAccess={hasDownloadAccess(download, userEntitlements)}
              onDownload={handleDownload}
              variant="card"
            />
          ))}
        </div>
      )}
    </section>
  );
}

/**
 * Compact version for sidebar or small spaces
 */
export function LessonResourcesCompact({ lesson, className }) {
  const { user } = useAuth();
  const { downloads, isLoading } = useLessonDownloads(lesson);
  const { incrementDownloadCount } = useDownloadAdmin();

  const userEntitlements = user?.entitlements || user?.user_metadata?.entitlements || [];

  if (isLoading || !downloads?.length) {
    return null;
  }

  return (
    <div className={cn('space-y-2', className)}>
      {downloads.slice(0, 5).map((download) => (
        <DownloadCard
          key={download.id}
          download={download}
          hasAccess={hasDownloadAccess(download, userEntitlements)}
          onDownload={() => incrementDownloadCount(download.id)}
          variant="compact"
        />
      ))}
      {downloads.length > 5 && (
        <p className="text-sm text-gray-500 text-center py-2">
          +{downloads.length - 5} more resources
        </p>
      )}
    </div>
  );
}

export default LessonResources;
