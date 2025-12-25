/**
 * Mock Marketplace Conversation Data
 *
 * Pre-booking inquiries and post-booking messaging between applicants and providers.
 * Lifecycle: open → booking_made → stale (30 days) → closed
 *
 * TODO: Replace with API calls to:
 * - GET /api/marketplace/conversations
 * - GET /api/marketplace/conversations/:id
 * - POST /api/marketplace/conversations/:id/messages
 */

export const CONVERSATION_STATUS = {
  OPEN: 'open',               // Active pre-booking inquiry
  BOOKING_MADE: 'booking_made', // Booking created from this conversation
  STALE: 'stale',             // 30 days no activity
  CLOSED: 'closed'            // Manually closed
};

export const MESSAGE_TYPE = {
  TEXT: 'text',
  FILE: 'file',
  SYSTEM: 'system' // e.g., "Booking confirmed"
};

export const mockConversations = [
  // ============================================
  // ACTIVE INQUIRY (Pre-booking)
  // ============================================
  {
    id: "conv_001",
    applicantId: "user_001",
    providerId: "provider_003",

    // Inquiry context
    inquiryServiceType: "essay_review",
    status: CONVERSATION_STATUS.OPEN,

    // Participants info (for display)
    applicant: {
      id: "user_001",
      name: "Sarah Johnson",
      avatarUrl: null
    },
    provider: {
      id: "provider_003",
      name: "Jessica Martinez",
      program: "UCSF",
      avatarUrl: null
    },

    // Linked booking (if any)
    bookingId: null,

    // Last activity
    lastMessageAt: "2024-12-09T11:30:00Z",
    unreadByApplicant: 0,
    unreadByProvider: 1,

    createdAt: "2024-12-08T15:00:00Z",
    updatedAt: "2024-12-09T11:30:00Z"
  },

  // ============================================
  // INQUIRY THAT BECAME BOOKING
  // ============================================
  {
    id: "conv_002",
    applicantId: "user_001",
    providerId: "provider_001",

    inquiryServiceType: "mock_interview",
    status: CONVERSATION_STATUS.BOOKING_MADE,

    applicant: {
      id: "user_001",
      name: "Sarah Johnson",
      avatarUrl: null
    },
    provider: {
      id: "provider_001",
      name: "Sarah Chen",
      program: "Duke University",
      avatarUrl: null
    },

    bookingId: "booking_001",

    lastMessageAt: "2024-12-09T10:45:00Z",
    unreadByApplicant: 0,
    unreadByProvider: 0,

    createdAt: "2024-12-07T09:00:00Z",
    updatedAt: "2024-12-09T10:45:00Z"
  },

  // ============================================
  // COMPLETED BOOKING CONVERSATION
  // ============================================
  {
    id: "conv_003",
    applicantId: "user_001",
    providerId: "provider_005",

    inquiryServiceType: "strategy_session",
    status: CONVERSATION_STATUS.BOOKING_MADE,

    applicant: {
      id: "user_001",
      name: "Sarah Johnson",
      avatarUrl: null
    },
    provider: {
      id: "provider_005",
      name: "Amanda Thompson",
      program: "Vanderbilt University",
      avatarUrl: null
    },

    bookingId: "booking_005",

    lastMessageAt: "2024-11-18T16:00:00Z",
    unreadByApplicant: 0,
    unreadByProvider: 0,

    createdAt: "2024-11-14T10:00:00Z",
    updatedAt: "2024-11-18T16:00:00Z"
  },

  // ============================================
  // STALE INQUIRY (No activity 30+ days)
  // ============================================
  {
    id: "conv_004",
    applicantId: "user_002",
    providerId: "provider_002",

    inquiryServiceType: "strategy_session",
    status: CONVERSATION_STATUS.STALE,

    applicant: {
      id: "user_002",
      name: "Mike Chen",
      avatarUrl: null
    },
    provider: {
      id: "provider_002",
      name: "Marcus Johnson",
      program: "Emory University",
      avatarUrl: null
    },

    bookingId: null,

    lastMessageAt: "2024-10-25T14:00:00Z",
    unreadByApplicant: 0,
    unreadByProvider: 0,

    createdAt: "2024-10-20T11:00:00Z",
    updatedAt: "2024-10-25T14:00:00Z"
  }
];

export const mockMessages = [
  // ============================================
  // conv_001 - Active inquiry with Jessica Martinez
  // ============================================
  {
    id: "msg_001",
    conversationId: "conv_001",
    senderId: "user_001",
    senderType: "applicant",
    type: MESSAGE_TYPE.TEXT,
    content: "Hi Jess! I saw you specialize in essay review. I'm working on my personal statement for several West Coast programs (UCSF, UCLA, USC). I'm struggling with how to open it - do you have any tips? Also, do you think the two-round review would be worth it for me?",
    readAt: "2024-12-08T15:30:00Z",
    createdAt: "2024-12-08T15:00:00Z"
  },
  {
    id: "msg_002",
    conversationId: "conv_001",
    senderId: "provider_003",
    senderType: "provider",
    type: MESSAGE_TYPE.TEXT,
    content: "Hey Sarah! Great question about the opening. The biggest mistake I see is starting with \"I've always wanted to be a CRNA\" - it's so overused! Instead, try opening with a specific moment or patient story that sparked your interest.\n\nAs for the two-round review - it really depends on where you are. If this is your first draft, definitely do two rounds. If you've already gotten feedback from others and are just polishing, one round might be enough. What stage are you at?",
    readAt: "2024-12-08T18:00:00Z",
    createdAt: "2024-12-08T17:45:00Z"
  },
  {
    id: "msg_003",
    conversationId: "conv_001",
    senderId: "user_001",
    senderType: "applicant",
    type: MESSAGE_TYPE.TEXT,
    content: "This is my second draft - I had a friend review the first one, but they're not in healthcare so their feedback was pretty surface level. I think I'll go with the two rounds! One more question - should I mention that I'm targeting specifically West Coast programs in my essay, or keep it more general?",
    readAt: null, // Provider hasn't read yet
    createdAt: "2024-12-09T11:30:00Z"
  },

  // ============================================
  // conv_002 - Inquiry that became booking
  // ============================================
  {
    id: "msg_004",
    conversationId: "conv_002",
    senderId: "user_001",
    senderType: "applicant",
    type: MESSAGE_TYPE.TEXT,
    content: "Hi Sarah! I'm interviewing at Duke in January and saw you're a current student there. I'd love to do a mock interview to prepare. Do you know what kinds of questions they typically ask?",
    readAt: "2024-12-07T09:30:00Z",
    createdAt: "2024-12-07T09:00:00Z"
  },
  {
    id: "msg_005",
    conversationId: "conv_002",
    senderId: "provider_001",
    senderType: "provider",
    type: MESSAGE_TYPE.TEXT,
    content: "Congrats on landing a Duke interview! 🎉 Yes, I'd be happy to help you prepare. Duke's interview is pretty comprehensive - they do a mix of behavioral, clinical, and program-specific questions. The faculty really want to see that you understand what you're getting into.\n\nI have some slots available next week if you want to book a mock interview. I'll ask you actual questions from my interview plus some I've heard from classmates!",
    readAt: "2024-12-07T10:00:00Z",
    createdAt: "2024-12-07T09:45:00Z"
  },
  {
    id: "msg_006",
    conversationId: "conv_002",
    senderId: "user_001",
    senderType: "applicant",
    type: MESSAGE_TYPE.TEXT,
    content: "That sounds perfect! I just booked the Thursday evening slot. Looking forward to it!",
    readAt: "2024-12-09T10:40:00Z",
    createdAt: "2024-12-09T10:30:00Z"
  },
  {
    id: "msg_007",
    conversationId: "conv_002",
    senderId: "provider_001",
    senderType: "provider",
    type: MESSAGE_TYPE.SYSTEM,
    content: "Booking confirmed for Thursday, December 12 at 6:00 PM EST",
    readAt: "2024-12-09T10:35:00Z",
    createdAt: "2024-12-09T10:30:00Z"
  },
  {
    id: "msg_008",
    conversationId: "conv_002",
    senderId: "provider_001",
    senderType: "provider",
    type: MESSAGE_TYPE.TEXT,
    content: "Perfect, see you Thursday! Come ready to talk about your ICU experience and why Duke specifically. I'll send you the meeting link closer to the session. 💪",
    readAt: "2024-12-09T10:50:00Z",
    createdAt: "2024-12-09T10:45:00Z"
  },

  // ============================================
  // conv_003 - Completed booking follow-up
  // ============================================
  {
    id: "msg_009",
    conversationId: "conv_003",
    senderId: "user_001",
    senderType: "applicant",
    type: MESSAGE_TYPE.TEXT,
    content: "Hi Amanda! Quick question - in our session you mentioned some programs that are more PICU-friendly. Could you send me that list again? I want to make sure I have it right.",
    readAt: "2024-11-15T11:00:00Z",
    createdAt: "2024-11-14T10:00:00Z"
  },
  {
    id: "msg_010",
    conversationId: "conv_003",
    senderId: "provider_005",
    senderType: "provider",
    type: MESSAGE_TYPE.TEXT,
    content: "Of course! The PICU-friendly programs I mentioned were:\n\n1. Vanderbilt (my program!)\n2. Cincinnati Children's pathway at UC\n3. Texas Children's pathway at UT Houston\n4. Baylor\n5. University of Michigan\n\nThese all have faculty who appreciate pediatric ICU experience. Good luck with your applications!",
    readAt: "2024-11-15T12:00:00Z",
    createdAt: "2024-11-15T10:30:00Z"
  },
  {
    id: "msg_011",
    conversationId: "conv_003",
    senderId: "user_001",
    senderType: "applicant",
    type: MESSAGE_TYPE.TEXT,
    content: "Thank you so much! This is super helpful. I left you a review - our session was really valuable! 🙏",
    readAt: "2024-11-18T16:30:00Z",
    createdAt: "2024-11-18T16:00:00Z"
  },

  // ============================================
  // conv_004 - Stale inquiry
  // ============================================
  {
    id: "msg_012",
    conversationId: "conv_004",
    senderId: "user_002",
    senderType: "applicant",
    type: MESSAGE_TYPE.TEXT,
    content: "Hi Marcus, I'm interested in your career changer strategy session. I was an accountant for 8 years before nursing. Think you could help me position this?",
    readAt: "2024-10-20T12:00:00Z",
    createdAt: "2024-10-20T11:00:00Z"
  },
  {
    id: "msg_013",
    conversationId: "conv_004",
    senderId: "provider_002",
    senderType: "provider",
    type: MESSAGE_TYPE.TEXT,
    content: "Hey Mike! Absolutely - your accounting background is actually a huge asset. CRNA programs love career changers who bring different perspectives. Let me know if you want to book a session and we can talk through your specific situation.",
    readAt: "2024-10-25T14:30:00Z",
    createdAt: "2024-10-20T15:00:00Z"
  },
  {
    id: "msg_014",
    conversationId: "conv_004",
    senderId: "user_002",
    senderType: "applicant",
    type: MESSAGE_TYPE.TEXT,
    content: "Thanks for the response! I'll check my schedule and get back to you about booking.",
    readAt: "2024-10-25T15:00:00Z",
    createdAt: "2024-10-25T14:00:00Z"
  }
  // No more messages - conversation went stale
];

// Helper: Get conversations for a user
export function getUserConversations(userId, userType = 'applicant') {
  const field = userType === 'applicant' ? 'applicantId' : 'providerId';
  return mockConversations
    .filter(c => c[field] === userId)
    .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
}

// Helper: Get messages for a conversation
export function getConversationMessages(conversationId) {
  return mockMessages
    .filter(m => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

// Helper: Get conversation by ID
export function getConversationById(id) {
  return mockConversations.find(c => c.id === id) || null;
}

// Helper: Get unread count for a user
export function getUnreadCount(userId, userType = 'applicant') {
  const field = userType === 'applicant' ? 'unreadByApplicant' : 'unreadByProvider';
  const idField = userType === 'applicant' ? 'applicantId' : 'providerId';

  return mockConversations
    .filter(c => c[idField] === userId)
    .reduce((sum, c) => sum + c[field], 0);
}

// Helper: Get conversation between two users
export function getConversationBetween(applicantId, providerId) {
  return mockConversations.find(c =>
    c.applicantId === applicantId && c.providerId === providerId
  ) || null;
}

// Helper: Check if conversation is active (can send messages)
export function canSendMessage(conversation) {
  return [CONVERSATION_STATUS.OPEN, CONVERSATION_STATUS.BOOKING_MADE].includes(conversation.status);
}
