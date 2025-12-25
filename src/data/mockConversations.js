// Mock Conversations Data
// Uses SUPABASE shape (not BuddyBoss) for real-time messaging
// TODO: Replace with Supabase queries to conversations table

import { mockUsers } from './mockTopics';

// Current user ID for reference
const CURRENT_USER_ID = mockUsers.currentUser.id; // 999

// Conversations list (like inbox threads)
export const mockConversations = [
  {
    id: 'conv_001',
    created_at: '2024-12-01T10:00:00Z',
    updated_at: '2024-12-12T09:30:00Z',
    participants: [
      {
        user_id: CURRENT_USER_ID,
        name: mockUsers.currentUser.name,
        avatar: mockUsers.currentUser.avatar,
        last_read_at: '2024-12-12T09:30:00Z'
      },
      {
        user_id: mockUsers.james.id,
        name: mockUsers.james.name,
        avatar: mockUsers.james.avatar,
        last_read_at: '2024-12-12T09:25:00Z'
      }
    ],
    last_message: {
      id: 'msg_010',
      content: 'Thanks so much for all the Georgetown tips! Really appreciate you taking the time.',
      sender_id: CURRENT_USER_ID,
      created_at: '2024-12-12T09:30:00Z'
    },
    unread_count: 0
  },
  {
    id: 'conv_002',
    created_at: '2024-12-05T14:00:00Z',
    updated_at: '2024-12-11T22:15:00Z',
    participants: [
      {
        user_id: CURRENT_USER_ID,
        name: mockUsers.currentUser.name,
        avatar: mockUsers.currentUser.avatar,
        last_read_at: '2024-12-11T20:00:00Z'
      },
      {
        user_id: mockUsers.ashley.id,
        name: mockUsers.ashley.name,
        avatar: mockUsers.ashley.avatar,
        last_read_at: '2024-12-11T22:15:00Z'
      }
    ],
    last_message: {
      id: 'msg_020',
      content: 'Are you free Sunday at 2pm EST for a mock interview session?',
      sender_id: mockUsers.ashley.id,
      created_at: '2024-12-11T22:15:00Z'
    },
    unread_count: 2
  },
  {
    id: 'conv_003',
    created_at: '2024-11-20T09:00:00Z',
    updated_at: '2024-12-10T16:45:00Z',
    participants: [
      {
        user_id: CURRENT_USER_ID,
        name: mockUsers.currentUser.name,
        avatar: mockUsers.currentUser.avatar,
        last_read_at: '2024-12-10T16:45:00Z'
      },
      {
        user_id: mockUsers.mike.id,
        name: mockUsers.mike.name,
        avatar: mockUsers.mike.avatar,
        last_read_at: '2024-12-10T16:30:00Z'
      }
    ],
    last_message: {
      id: 'msg_030',
      content: 'No problem! Let me know how the CCRN goes. You got this! 💪',
      sender_id: mockUsers.mike.id,
      created_at: '2024-12-10T16:45:00Z'
    },
    unread_count: 0
  },
  {
    id: 'conv_004',
    created_at: '2024-12-08T11:00:00Z',
    updated_at: '2024-12-09T18:30:00Z',
    participants: [
      {
        user_id: CURRENT_USER_ID,
        name: mockUsers.currentUser.name,
        avatar: mockUsers.currentUser.avatar,
        last_read_at: '2024-12-09T18:30:00Z'
      },
      {
        user_id: mockUsers.emily.id,
        name: mockUsers.emily.name,
        avatar: mockUsers.emily.avatar,
        last_read_at: '2024-12-09T15:00:00Z'
      }
    ],
    last_message: {
      id: 'msg_040',
      content: 'Here\'s the link to the chemistry study guide I mentioned: [link]. Hope it helps!',
      sender_id: CURRENT_USER_ID,
      created_at: '2024-12-09T18:30:00Z'
    },
    unread_count: 0
  },
  {
    id: 'conv_005',
    created_at: '2024-12-10T08:00:00Z',
    updated_at: '2024-12-10T14:00:00Z',
    participants: [
      {
        user_id: CURRENT_USER_ID,
        name: mockUsers.currentUser.name,
        avatar: mockUsers.currentUser.avatar,
        last_read_at: '2024-12-10T14:00:00Z'
      },
      {
        user_id: mockUsers.sarah.id,
        name: mockUsers.sarah.name,
        avatar: mockUsers.sarah.avatar,
        last_read_at: '2024-12-10T12:00:00Z'
      }
    ],
    last_message: {
      id: 'msg_050',
      content: 'Congrats on submitting to Georgetown! 🎉 When do you think you\'ll hear back?',
      sender_id: CURRENT_USER_ID,
      created_at: '2024-12-10T14:00:00Z'
    },
    unread_count: 0
  }
];

// Get conversation by ID
export function getMockConversation(conversationId) {
  return mockConversations.find(c => c.id === conversationId);
}

// Get conversations for current user (all of them since they all include current user)
export function getMockConversationsForUser(userId = CURRENT_USER_ID) {
  return mockConversations.filter(c =>
    c.participants.some(p => p.user_id === userId)
  );
}

// Get unread count for current user
export function getMockUnreadCount(userId = CURRENT_USER_ID) {
  return mockConversations.reduce((total, conv) => total + conv.unread_count, 0);
}

// Get other participant (for displaying in conversation list)
export function getOtherParticipant(conversation, currentUserId = CURRENT_USER_ID) {
  return conversation.participants.find(p => p.user_id !== currentUserId);
}

export default mockConversations;
