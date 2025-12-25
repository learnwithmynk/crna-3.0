/**
 * MessagesPage
 *
 * Direct messaging page with responsive layout:
 * - Desktop: Two-column (thread list | conversation)
 * - Mobile: Thread list → tap → full-screen conversation
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/page-wrapper';
import {
  ThreadList,
  ThreadDetail,
  NewConversationSheet
} from '@/components/features/messages';
import { useConversations } from '@/hooks/useConversations';
import { useMessages } from '@/hooks/useMessages';
import { cn } from '@/lib/utils';

export function MessagesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedConversationId, setSelectedConversationId] = useState(
    searchParams.get('thread') || null
  );
  const [newConversationOpen, setNewConversationOpen] = useState(false);

  // Conversations hook
  const {
    conversations,
    loading: conversationsLoading,
    getOtherUser,
    createConversation,
    markAsRead,
    updateConversationLastMessage,
    searchConversations
  } = useConversations();

  // Messages hook for selected conversation
  const {
    messages,
    loading: messagesLoading,
    sending,
    sendMessage,
    deleteMessage,
    isOwnMessage,
    getSender
  } = useMessages(selectedConversationId);

  // Get selected conversation and other user
  const selectedConversation = selectedConversationId
    ? conversations.find(c => c.id === selectedConversationId)
    : null;
  const otherUser = selectedConversation ? getOtherUser(selectedConversation) : null;

  // Update URL when conversation changes
  useEffect(() => {
    if (selectedConversationId) {
      setSearchParams({ thread: selectedConversationId });
    } else {
      setSearchParams({});
    }
  }, [selectedConversationId, setSearchParams]);

  // Mark conversation as read when selected
  useEffect(() => {
    if (selectedConversationId && selectedConversation?.unread_count > 0) {
      markAsRead(selectedConversationId);
    }
  }, [selectedConversationId, selectedConversation?.unread_count, markAsRead]);

  // Handle selecting a conversation
  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
  };

  // Handle going back (mobile)
  const handleBack = () => {
    setSelectedConversationId(null);
  };

  // Handle sending a message
  const handleSend = async (content) => {
    const newMessage = await sendMessage(content);
    if (newMessage && selectedConversationId) {
      updateConversationLastMessage(selectedConversationId, newMessage);
    }
  };

  // Handle starting a new conversation
  const handleNewConversation = async (user) => {
    const conversation = await createConversation(user.id);
    if (conversation) {
      setSelectedConversationId(conversation.id);
    }
  };

  // Get existing conversation user IDs (to exclude from new conversation search)
  const existingUserIds = conversations.map(c => {
    const other = getOtherUser(c);
    return other?.user_id;
  }).filter(Boolean);

  return (
    <PageWrapper noPadding className="h-[calc(100vh-4rem)]">
      <div className="flex h-full bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Thread list (hidden on mobile when conversation is selected) */}
        <div
          className={cn(
            'w-full lg:w-80 xl:w-96 border-r border-gray-200 shrink-0',
            selectedConversationId ? 'hidden lg:flex lg:flex-col' : 'flex flex-col'
          )}
        >
          <ThreadList
            conversations={conversations}
            loading={conversationsLoading}
            selectedId={selectedConversationId}
            onSelect={handleSelectConversation}
            onNewConversation={() => setNewConversationOpen(true)}
            getOtherUser={getOtherUser}
            searchConversations={searchConversations}
          />
        </div>

        {/* Thread detail (full screen on mobile, right side on desktop) */}
        <div
          className={cn(
            'flex-1 flex flex-col',
            !selectedConversationId && 'hidden lg:flex'
          )}
        >
          <ThreadDetail
            conversation={selectedConversation}
            otherUser={otherUser}
            messages={messages}
            loading={messagesLoading}
            sending={sending}
            onSend={handleSend}
            onDelete={deleteMessage}
            onBack={handleBack}
            isOwnMessage={isOwnMessage}
            getSender={getSender}
          />
        </div>
      </div>

      {/* New conversation sheet */}
      <NewConversationSheet
        open={newConversationOpen}
        onOpenChange={setNewConversationOpen}
        onSelectRecipient={handleNewConversation}
        existingConversationUserIds={existingUserIds}
      />
    </PageWrapper>
  );
}

export default MessagesPage;
