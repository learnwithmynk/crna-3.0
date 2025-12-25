// Mock Messages Data
// Uses SUPABASE shape (not BuddyBoss) for real-time messaging
// TODO: Replace with Supabase queries to messages table with realtime subscription

import { mockUsers } from './mockTopics';

const CURRENT_USER_ID = mockUsers.currentUser.id; // 999

// Messages for conversation conv_001 (Sachi <-> James about Georgetown)
export const mockMessagesConv001 = [
  {
    id: 'msg_001',
    conversation_id: 'conv_001',
    sender_id: CURRENT_USER_ID,
    content: 'Hi James! I saw your AMA post about Georgetown. I have my interview coming up and would love to ask you some questions if you have time?',
    created_at: '2024-12-01T10:00:00Z'
  },
  {
    id: 'msg_002',
    conversation_id: 'conv_001',
    sender_id: mockUsers.james.id,
    content: 'Hey Sachi! Of course, happy to help. Fire away!',
    created_at: '2024-12-01T10:15:00Z'
  },
  {
    id: 'msg_003',
    conversation_id: 'conv_001',
    sender_id: CURRENT_USER_ID,
    content: 'Thank you! First question - how long was the interview day? I\'m trying to figure out if I need to book a hotel the night before.',
    created_at: '2024-12-01T10:20:00Z'
  },
  {
    id: 'msg_004',
    conversation_id: 'conv_001',
    sender_id: mockUsers.james.id,
    content: 'The whole day was about 6 hours. Started at 8am and finished around 2pm. I\'d definitely recommend staying the night before - DC traffic is unpredictable and you don\'t want to be stressed.',
    created_at: '2024-12-01T10:35:00Z'
  },
  {
    id: 'msg_005',
    conversation_id: 'conv_001',
    sender_id: CURRENT_USER_ID,
    content: 'That\'s really helpful! What about the MMI format - any stations that caught you off guard?',
    created_at: '2024-12-01T11:00:00Z'
  },
  {
    id: 'msg_006',
    conversation_id: 'conv_001',
    sender_id: mockUsers.james.id,
    content: 'There was one ethical scenario that surprised me - about end of life care and family disagreements. Just think out loud and show your reasoning process. They care more about HOW you think than getting the "right" answer.',
    created_at: '2024-12-01T11:30:00Z'
  },
  {
    id: 'msg_007',
    conversation_id: 'conv_001',
    sender_id: mockUsers.james.id,
    content: 'Also make sure you know your ICU drips. They asked me about vasopressors and their mechanisms. Nothing too crazy but be prepared!',
    created_at: '2024-12-01T11:32:00Z'
  },
  {
    id: 'msg_008',
    conversation_id: 'conv_001',
    sender_id: CURRENT_USER_ID,
    content: 'This is exactly what I needed to know. One more question - did you send a thank you note after?',
    created_at: '2024-12-11T14:00:00Z'
  },
  {
    id: 'msg_009',
    conversation_id: 'conv_001',
    sender_id: mockUsers.james.id,
    content: 'Yes! I sent a brief email to the program director within 24 hours. Just thanking them for the opportunity and reiterating my interest. Keep it short and professional.',
    created_at: '2024-12-12T09:25:00Z'
  },
  {
    id: 'msg_010',
    conversation_id: 'conv_001',
    sender_id: CURRENT_USER_ID,
    content: 'Thanks so much for all the Georgetown tips! Really appreciate you taking the time.',
    created_at: '2024-12-12T09:30:00Z'
  }
];

// Messages for conversation conv_002 (Sachi <-> Ashley about mock interview)
export const mockMessagesConv002 = [
  {
    id: 'msg_011',
    conversation_id: 'conv_002',
    sender_id: mockUsers.ashley.id,
    content: 'Hey Sachi! I saw your comment about looking for mock interview partners. Want to practice together?',
    created_at: '2024-12-05T14:00:00Z'
  },
  {
    id: 'msg_012',
    conversation_id: 'conv_002',
    sender_id: CURRENT_USER_ID,
    content: 'Yes definitely! When are you available? I\'m pretty flexible on weekends.',
    created_at: '2024-12-05T15:30:00Z'
  },
  {
    id: 'msg_013',
    conversation_id: 'conv_002',
    sender_id: mockUsers.ashley.id,
    content: 'Weekends work great for me too. I have Duke coming up in January so I really want to practice the pharmacology questions.',
    created_at: '2024-12-05T16:00:00Z'
  },
  {
    id: 'msg_014',
    conversation_id: 'conv_002',
    sender_id: CURRENT_USER_ID,
    content: 'Perfect, I need to work on those too. Should we do a Zoom call? I can share a question bank I\'ve been using.',
    created_at: '2024-12-05T16:30:00Z'
  },
  {
    id: 'msg_015',
    conversation_id: 'conv_002',
    sender_id: mockUsers.ashley.id,
    content: 'That would be awesome! Let me know what time works.',
    created_at: '2024-12-05T17:00:00Z'
  },
  {
    id: 'msg_019',
    conversation_id: 'conv_002',
    sender_id: mockUsers.ashley.id,
    content: 'Hey! Following up - are you free this weekend?',
    created_at: '2024-12-11T20:00:00Z'
  },
  {
    id: 'msg_020',
    conversation_id: 'conv_002',
    sender_id: mockUsers.ashley.id,
    content: 'Are you free Sunday at 2pm EST for a mock interview session?',
    created_at: '2024-12-11T22:15:00Z'
  }
];

// Messages for conversation conv_003 (Sachi <-> Mike about CCRN)
export const mockMessagesConv003 = [
  {
    id: 'msg_021',
    conversation_id: 'conv_003',
    sender_id: CURRENT_USER_ID,
    content: 'Hey Mike! I\'m studying for my CCRN. You mentioned in the group that you passed recently - any study tips?',
    created_at: '2024-11-20T09:00:00Z'
  },
  {
    id: 'msg_022',
    conversation_id: 'conv_003',
    sender_id: mockUsers.mike.id,
    content: 'Congrats on taking the plunge! I used Barron\'s book + Pass CCRN. The practice questions were key. Do at least 500 before your test.',
    created_at: '2024-11-20T10:30:00Z'
  },
  {
    id: 'msg_023',
    conversation_id: 'conv_003',
    sender_id: CURRENT_USER_ID,
    content: 'That\'s super helpful. How long did you study?',
    created_at: '2024-11-20T11:00:00Z'
  },
  {
    id: 'msg_024',
    conversation_id: 'conv_003',
    sender_id: mockUsers.mike.id,
    content: 'About 6 weeks, studying 1-2 hours after my shifts. Focus on cardiovascular and pulmonary - they\'re the biggest sections.',
    created_at: '2024-11-20T12:15:00Z'
  },
  {
    id: 'msg_029',
    conversation_id: 'conv_003',
    sender_id: CURRENT_USER_ID,
    content: 'Just scheduled my test for next month! Getting nervous but feeling more prepared.',
    created_at: '2024-12-10T16:00:00Z'
  },
  {
    id: 'msg_030',
    conversation_id: 'conv_003',
    sender_id: mockUsers.mike.id,
    content: 'No problem! Let me know how the CCRN goes. You got this! 💪',
    created_at: '2024-12-10T16:45:00Z'
  }
];

// Messages for conversation conv_004 (Sachi <-> Emily about chemistry)
export const mockMessagesConv004 = [
  {
    id: 'msg_031',
    conversation_id: 'conv_004',
    sender_id: mockUsers.emily.id,
    content: 'Hi Sachi! I saw you mentioned taking chemistry online. Which course did you use?',
    created_at: '2024-12-08T11:00:00Z'
  },
  {
    id: 'msg_032',
    conversation_id: 'conv_004',
    sender_id: CURRENT_USER_ID,
    content: 'Hey Emily! I took it through UNE Online. It was self-paced which was perfect for working full-time.',
    created_at: '2024-12-08T12:30:00Z'
  },
  {
    id: 'msg_033',
    conversation_id: 'conv_004',
    sender_id: mockUsers.emily.id,
    content: 'Was it hard to balance with work? I\'m worried about managing my ICU schedule with studying.',
    created_at: '2024-12-08T14:00:00Z'
  },
  {
    id: 'msg_034',
    conversation_id: 'conv_004',
    sender_id: CURRENT_USER_ID,
    content: 'Honestly it was challenging but doable. I studied on my days off and used commute time for videos. You can do it!',
    created_at: '2024-12-08T15:30:00Z'
  },
  {
    id: 'msg_039',
    conversation_id: 'conv_004',
    sender_id: mockUsers.emily.id,
    content: 'Do you have any study resources you\'d recommend?',
    created_at: '2024-12-09T15:00:00Z'
  },
  {
    id: 'msg_040',
    conversation_id: 'conv_004',
    sender_id: CURRENT_USER_ID,
    content: 'Here\'s the link to the chemistry study guide I mentioned: [link]. Hope it helps!',
    created_at: '2024-12-09T18:30:00Z'
  }
];

// Messages for conversation conv_005 (Sachi <-> Sarah about Georgetown)
export const mockMessagesConv005 = [
  {
    id: 'msg_041',
    conversation_id: 'conv_005',
    sender_id: mockUsers.sarah.id,
    content: 'Hey! Just submitted my Georgetown app. So nervous but excited!',
    created_at: '2024-12-10T08:00:00Z'
  },
  {
    id: 'msg_042',
    conversation_id: 'conv_005',
    sender_id: CURRENT_USER_ID,
    content: 'That\'s amazing! I submitted mine last week. The waiting is the hardest part.',
    created_at: '2024-12-10T09:00:00Z'
  },
  {
    id: 'msg_043',
    conversation_id: 'conv_005',
    sender_id: mockUsers.sarah.id,
    content: 'Right?? I keep checking my email every 5 minutes. Need to find a distraction!',
    created_at: '2024-12-10T10:30:00Z'
  },
  {
    id: 'msg_050',
    conversation_id: 'conv_005',
    sender_id: CURRENT_USER_ID,
    content: 'Congrats on submitting to Georgetown! 🎉 When do you think you\'ll hear back?',
    created_at: '2024-12-10T14:00:00Z'
  }
];

// Map of conversation ID to messages
export const mockMessagesByConversation = {
  'conv_001': mockMessagesConv001,
  'conv_002': mockMessagesConv002,
  'conv_003': mockMessagesConv003,
  'conv_004': mockMessagesConv004,
  'conv_005': mockMessagesConv005
};

// Get messages for a specific conversation
export function getMockMessagesForConversation(conversationId) {
  return mockMessagesByConversation[conversationId] || [];
}

// Helper to check if message is from current user
export function isOwnMessage(message, currentUserId = CURRENT_USER_ID) {
  return message.sender_id === currentUserId;
}

// Get sender details for a message
export function getMessageSender(message) {
  if (message.sender_id === CURRENT_USER_ID) {
    return mockUsers.currentUser;
  }
  // Find sender from mockUsers
  const userEntry = Object.values(mockUsers).find(u => u.id === message.sender_id);
  return userEntry || { id: message.sender_id, name: 'Unknown', avatar: null };
}

export default mockMessagesConv001;
