/**
 * ForumsPage
 *
 * Main community forums listing page.
 * Shows all top-level forums with their subforums.
 */

import { PageWrapper } from '@/components/layout/page-wrapper';
import { ForumList } from '@/components/features/community';
import { useForums } from '@/hooks/useForums';

export function ForumsPage() {
  const { forums, loading, error } = useForums();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50/80 to-pink-50/25">
      <PageWrapper className="px-8 md:px-16 lg:px-24 xl:px-32 pt-8 md:pt-12 lg:pt-16 pb-8 bg-transparent relative z-10">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Community Forums</h1>
          <p className="text-gray-600 mt-1">Connect with fellow CRNA applicants, share experiences, and get advice.</p>
        </div>

        {error && (
          <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        <ForumList forums={forums} loading={loading} />
      </PageWrapper>
    </div>
  );
}

export default ForumsPage;
