/**
 * ForumTopicsPage
 *
 * Forum detail page showing topics in a specific forum.
 * Also shows subforums in a grid if they exist.
 */

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { ForumBreadcrumb, ForumList, TopicList, NewTopicSheet } from '@/components/features/community';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useForums } from '@/hooks/useForums';
import { useTopics } from '@/hooks/useTopics';

export function ForumTopicsPage() {
  const { forumId } = useParams();
  const { getForumDetail, loading: forumsLoading } = useForums();
  const {
    topics,
    total,
    totalPages,
    currentPage,
    loading: topicsLoading,
    goToPage,
    createTopic,
    refresh
  } = useTopics(forumId);

  const [forum, setForum] = useState(null);
  const [newTopicSheetOpen, setNewTopicSheetOpen] = useState(false);

  // Load forum detail
  useEffect(() => {
    async function loadForum() {
      const detail = await getForumDetail(forumId);
      setForum(detail);
    }
    if (forumId && !forumsLoading) {
      loadForum();
    }
  }, [forumId, forumsLoading, getForumDetail]);

  const loading = forumsLoading || !forum;
  const hasSubforums = forum?.sub_forums && forum.sub_forums.length > 0;

  // Handle new topic creation
  const handleCreateTopic = async (data) => {
    await createTopic(forumId, data.title, data.content, data.honeypot);
    // Note: Don't call refresh() here - createTopic already updates state
    // refresh() would re-fetch mock data and overwrite the new topic
  };

  return (
    <PageWrapper>
      {/* Breadcrumb */}
      <ForumBreadcrumb forum={forum} className="mb-4" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          {loading ? (
            <>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-5 w-96" />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900">
                {forum.title.rendered}
              </h1>
              {forum.content?.rendered && (
                <p
                  className="text-gray-600 mt-1"
                  dangerouslySetInnerHTML={{
                    __html: forum.content.rendered.replace(/<[^>]*>/g, '')
                  }}
                />
              )}
            </>
          )}
        </div>

        {/* New Topic button */}
        <Button className="shrink-0" onClick={() => setNewTopicSheetOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Topic
        </Button>
      </div>

      {/* Subforums grid */}
      {hasSubforums && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Sub-Forums
          </h2>
          <ForumList
            forums={forum.sub_forums.map(sf => ({
              ...sf,
              reply_count: sf.reply_count || 0,
              last_active: null,
              content: null,
              sub_forums: []
            }))}
            variant="grid"
          />
        </section>
      )}

      {/* Topics list */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Topics
            {!topicsLoading && total > 0 && (
              <span className="font-normal text-gray-500 ml-2">({total})</span>
            )}
          </h2>
        </div>

        <TopicList
          topics={topics}
          forumId={forumId}
          loading={topicsLoading}
          total={total}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={goToPage}
        />
      </section>

      {/* New topic sheet */}
      <NewTopicSheet
        open={newTopicSheetOpen}
        onOpenChange={setNewTopicSheetOpen}
        forumName={forum?.title?.rendered}
        onSubmit={handleCreateTopic}
      />
    </PageWrapper>
  );
}

export default ForumTopicsPage;
