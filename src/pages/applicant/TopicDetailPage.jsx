/**
 * TopicDetailPage
 *
 * Topic detail page showing the topic content and replies.
 */

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/page-wrapper';
import {
  ForumBreadcrumb,
  TopicHeader,
  ReplyList,
  ReplyForm,
  ReplyFormCompact,
  EditTopicSheet
} from '@/components/features/community';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useForums } from '@/hooks/useForums';
import { useTopics } from '@/hooks/useTopics';
import { useReplies } from '@/hooks/useReplies';
import { mockUsers } from '@/data/mockTopics';

export function TopicDetailPage() {
  const { forumId, topicId } = useParams();
  const { getForumDetail, loading: forumsLoading } = useForums();
  const { getTopicDetail, updateTopic, deleteTopic } = useTopics();
  const {
    replies,
    total: replyTotal,
    totalPages: replyTotalPages,
    currentPage: replyCurrentPage,
    loading: repliesLoading,
    createReply,
    deleteReply,
    goToPage: goToReplyPage
  } = useReplies(topicId);

  const [forum, setForum] = useState(null);
  const [topic, setTopic] = useState(null);
  const [editSheetOpen, setEditSheetOpen] = useState(false);

  // Load forum and topic
  useEffect(() => {
    async function loadData() {
      const [forumDetail, topicDetail] = await Promise.all([
        getForumDetail(forumId),
        getTopicDetail(topicId)
      ]);
      setForum(forumDetail);
      setTopic(topicDetail);
    }
    if (forumId && topicId && !forumsLoading) {
      loadData();
    }
  }, [forumId, topicId, forumsLoading, getForumDetail, getTopicDetail]);

  const loading = !topic;
  const currentUserId = mockUsers.currentUser.id;
  const isAuthor = topic?.author?.id === currentUserId;

  // Handle reply submission (supports both main replies and nested replies)
  const handleSubmitReply = async (data, parentId = null) => {
    // Handle both old format (string) and new format (object with content/images/honeypot)
    const content = typeof data === 'string' ? data : data.content;
    const honeypot = typeof data === 'string' ? '' : (data.honeypot || '');
    await createReply(topicId, content, parentId, honeypot);
  };

  // Handle reaction to reply
  const handleReactToReply = async (replyId, reactionId) => {
    // TODO: Replace with API call to toggle reaction
    console.log('React to reply:', replyId, 'with:', reactionId);
  };

  // Handle report reply
  const handleReportReply = async (reply, reason) => {
    // TODO: Replace with API call to report
    console.log('Report reply:', reply.id, 'reason:', reason);
    alert('Thank you for your report. Our team will review it.');
  };

  // Handle topic edit
  const handleEditTopic = async (data) => {
    await updateTopic(topicId, { title: data.title, content: data.content });
    // Refresh topic
    const updatedTopic = await getTopicDetail(topicId);
    setTopic(updatedTopic);
  };

  // Handle topic delete
  const handleDeleteTopic = async () => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      await deleteTopic(topicId);
      // Navigate back to forum
      window.location.href = `/community/forums/${forumId}`;
    }
  };

  return (
    <PageWrapper>
      {/* Breadcrumb */}
      <ForumBreadcrumb forum={forum} topic={topic} className="mb-4" />

      {/* Facebook-style unified post + comments card */}
      {loading ? (
        <TopicHeaderSkeleton />
      ) : (
        <Card className="overflow-hidden">
          {/* Post content */}
          <div className="p-6">
            <TopicHeader
              topic={topic}
              isAuthor={isAuthor}
              subscribed={topic.subscribed}
              onSubscribe={() => console.log('Subscribe')}
              onEdit={() => setEditSheetOpen(true)}
              onDelete={handleDeleteTopic}
              onReport={() => console.log('Report')}
            />
          </div>

          {/* Comments divider with count */}
          <div className="border-t border-gray-100 px-6 py-2 flex items-center justify-between bg-gray-50/50">
            <span className="text-sm text-gray-600 font-medium">
              {replyTotal} {replyTotal === 1 ? 'Comment' : 'Comments'}
            </span>
          </div>

          {/* Comments list */}
          <ReplyList
            replies={replies}
            loading={repliesLoading}
            total={replyTotal}
            totalPages={replyTotalPages}
            currentPage={replyCurrentPage}
            onPageChange={goToReplyPage}
            currentUserId={currentUserId}
            onEditReply={(reply) => console.log('Edit reply:', reply.id)}
            onDeleteReply={(reply) => deleteReply(reply.id)}
            onReportReply={handleReportReply}
            onCreateReply={handleSubmitReply}
            onReactToReply={handleReactToReply}
            embedded={true}
          />

          {/* Comment input at bottom */}
          <div className="border-t border-gray-100 p-4 bg-gray-50/30">
            <ReplyFormCompact
              onSubmit={(content) => handleSubmitReply(content)}
              placeholder="Write a comment..."
            />
          </div>
        </Card>
      )}

      {/* Edit topic sheet */}
      <EditTopicSheet
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        topic={topic}
        onSubmit={handleEditTopic}
      />
    </PageWrapper>
  );
}

// Skeleton for topic header
function TopicHeaderSkeleton() {
  return (
    <Card className="p-6 mb-6">
      <Skeleton className="h-8 w-3/4 mb-4" />
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div>
          <Skeleton className="h-5 w-24 mb-1" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" />
    </Card>
  );
}

export default TopicDetailPage;
