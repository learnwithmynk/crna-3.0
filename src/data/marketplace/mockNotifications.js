/**
 * Mock Marketplace Notification Data
 *
 * In-app notifications for marketplace events.
 * Displayed in the notification bell dropdown.
 *
 * TODO: Replace with API calls to:
 * - GET /api/notifications
 * - PUT /api/notifications/:id/read
 * - PUT /api/notifications/read-all
 */

export const NOTIFICATION_TYPES = {
  // Inquiry notifications
  NEW_INQUIRY: 'new_inquiry',
  INQUIRY_REPLY: 'inquiry_reply',

  // Booking notifications
  BOOKING_REQUEST: 'booking_request',       // Provider receives (Requires Confirmation)
  BOOKING_CONFIRMED: 'booking_confirmed',   // Applicant receives
  BOOKING_DECLINED: 'booking_declined',     // Applicant receives
  BOOKING_CANCELLED: 'booking_cancelled',   // Both receive
  BOOKING_REMINDER: 'booking_reminder',     // Both receive (24h before)
  BOOKING_COMPLETED: 'booking_completed',   // Both receive

  // Review notifications
  REVIEW_REQUEST: 'review_request',         // Both receive after session
  REVIEW_RECEIVED: 'review_received',       // When other party reviews

  // Provider-specific
  PAYOUT_PROCESSED: 'payout_processed',
  PROVIDER_APPROVED: 'provider_approved',
  PROVIDER_DENIED: 'provider_denied',
  PROVIDER_INFO_NEEDED: 'provider_info_needed',
  PROVIDER_MESSAGE: 'provider_message', // Admin sent a message

  // General
  SYSTEM: 'system'
};

export const mockNotifications = [
  // ============================================
  // UNREAD NOTIFICATIONS (for user_001 - Sarah Johnson)
  // ============================================
  {
    id: "notif_001",
    userId: "user_001",
    type: NOTIFICATION_TYPES.BOOKING_CONFIRMED,
    title: "Booking Confirmed",
    body: "Your mock interview with Sarah Chen is confirmed for Thursday, Dec 12 at 6:00 PM EST",
    link: "/marketplace/bookings/booking_001",
    readAt: null,
    createdAt: "2024-12-09T10:30:00Z"
  },
  {
    id: "notif_002",
    userId: "user_001",
    type: NOTIFICATION_TYPES.INQUIRY_REPLY,
    title: "New message from Jessica Martinez",
    body: "Hey Sarah! Great question about the opening. The biggest mistake I see is starting with...",
    link: "/marketplace/messages/conv_001",
    readAt: null,
    createdAt: "2024-12-08T17:45:00Z"
  },

  // ============================================
  // READ NOTIFICATIONS (for user_001)
  // ============================================
  {
    id: "notif_003",
    userId: "user_001",
    type: NOTIFICATION_TYPES.REVIEW_REQUEST,
    title: "How was your session?",
    body: "Your session with Amanda Thompson has ended. Leave a review to help other applicants!",
    link: "/marketplace/bookings/booking_005/review",
    readAt: "2024-11-19T09:00:00Z",
    createdAt: "2024-11-18T16:00:00Z"
  },
  {
    id: "notif_004",
    userId: "user_001",
    type: NOTIFICATION_TYPES.BOOKING_REMINDER,
    title: "Reminder: Session Tomorrow",
    body: "Your Duke Q&A with Sarah Chen is tomorrow at 5:00 PM EST. Don't forget to prepare your questions!",
    link: "/marketplace/bookings/booking_004",
    readAt: "2024-11-24T20:00:00Z",
    createdAt: "2024-11-24T17:00:00Z"
  },
  {
    id: "notif_005",
    userId: "user_001",
    type: NOTIFICATION_TYPES.REVIEW_RECEIVED,
    title: "Sarah Chen left you a review",
    body: "Your provider has reviewed your session. See what they said!",
    link: "/marketplace/bookings/booking_004",
    readAt: "2024-11-26T15:00:00Z",
    createdAt: "2024-11-26T14:00:00Z"
  },

  // ============================================
  // PROVIDER NOTIFICATIONS (for provider_001 - Sarah Chen)
  // ============================================
  {
    id: "notif_006",
    userId: "user_srna_001", // Sarah Chen's user ID
    type: NOTIFICATION_TYPES.NEW_INQUIRY,
    title: "New message from Sarah Johnson",
    body: "Hi Sarah! I'm interviewing at Duke in January and saw you're a current student...",
    link: "/marketplace/messages/conv_002",
    readAt: "2024-12-07T09:30:00Z",
    createdAt: "2024-12-07T09:00:00Z"
  },
  {
    id: "notif_007",
    userId: "user_srna_001",
    type: NOTIFICATION_TYPES.BOOKING_CONFIRMED,
    title: "New Booking",
    body: "Sarah Johnson booked a Full Mock Interview Experience for Dec 12 at 6:00 PM EST",
    link: "/marketplace/provider/bookings/booking_001",
    readAt: "2024-12-09T10:35:00Z",
    createdAt: "2024-12-09T10:30:00Z"
  },
  {
    id: "notif_008",
    userId: "user_srna_001",
    type: NOTIFICATION_TYPES.PAYOUT_PROCESSED,
    title: "Payout Sent",
    body: "$280.00 has been sent to your bank account. Should arrive in 2-3 business days.",
    link: "/marketplace/provider/earnings",
    readAt: "2024-12-02T10:00:00Z",
    createdAt: "2024-12-01T09:00:00Z"
  },
  {
    id: "notif_009",
    userId: "user_srna_001",
    type: NOTIFICATION_TYPES.REVIEW_RECEIVED,
    title: "New 5-star review!",
    body: "Chris M. left you a 5-star review: \"Sarah is the real deal...\"",
    link: "/marketplace/provider/reviews",
    readAt: "2024-10-20T12:00:00Z",
    createdAt: "2024-10-20T09:00:00Z"
  },

  // ============================================
  // REQUIRES CONFIRMATION NOTIFICATIONS (for provider_002 - Marcus Johnson)
  // ============================================
  {
    id: "notif_010",
    userId: "user_srna_002",
    type: NOTIFICATION_TYPES.BOOKING_REQUEST,
    title: "New Booking Request",
    body: "Someone wants to book your Application Strategy session. Respond within 24 hours.",
    link: "/marketplace/provider/requests/booking_003",
    readAt: null, // Still needs to respond
    createdAt: "2024-12-09T12:00:00Z"
  },

  // ============================================
  // DECLINED BOOKING NOTIFICATION
  // ============================================
  {
    id: "notif_011",
    userId: "user_005",
    type: NOTIFICATION_TYPES.BOOKING_DECLINED,
    title: "Booking Request Declined",
    body: "David Kim was unable to accept your booking request. Your payment has been refunded.",
    link: "/marketplace/my-bookings",
    readAt: "2024-12-07T11:00:00Z",
    createdAt: "2024-12-07T10:00:00Z"
  },

  // ============================================
  // CANCELLATION NOTIFICATIONS
  // ============================================
  {
    id: "notif_012",
    userId: "user_004",
    type: NOTIFICATION_TYPES.BOOKING_CANCELLED,
    title: "Booking Cancelled by Provider",
    body: "Marcus Johnson had to cancel your Behavioral Interview Prep session. You've been fully refunded.",
    link: "/marketplace/my-bookings",
    readAt: "2024-11-28T14:30:00Z",
    createdAt: "2024-11-28T14:00:00Z"
  },

  // ============================================
  // PROVIDER APPROVAL NOTIFICATION
  // ============================================
  {
    id: "notif_013",
    userId: "user_srna_003",
    type: NOTIFICATION_TYPES.PROVIDER_APPROVED,
    title: "Welcome to the Mentor Marketplace! 🎉",
    body: "Your provider application has been approved. Complete your profile to start receiving bookings.",
    link: "/marketplace/provider/onboarding",
    readAt: "2024-09-01T10:00:00Z",
    createdAt: "2024-09-01T09:00:00Z"
  }
];

// Helper: Get notifications for a user
export function getUserNotifications(userId, limit = 20) {
  return mockNotifications
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
}

// Helper: Get unread notifications for a user
export function getUnreadNotifications(userId) {
  return mockNotifications.filter(n =>
    n.userId === userId && n.readAt === null
  );
}

// Helper: Get unread count
export function getUnreadNotificationCount(userId) {
  return getUnreadNotifications(userId).length;
}

// Helper: Get notification by ID
export function getNotificationById(id) {
  return mockNotifications.find(n => n.id === id) || null;
}

// Helper: Mark notification as read (mock - just returns updated notification)
export function markNotificationRead(id) {
  const notification = getNotificationById(id);
  if (notification && !notification.readAt) {
    notification.readAt = new Date().toISOString();
  }
  return notification;
}

// Helper: Get notification icon/color by type
export function getNotificationStyle(type) {
  const styles = {
    [NOTIFICATION_TYPES.NEW_INQUIRY]: { icon: '💬', color: 'blue' },
    [NOTIFICATION_TYPES.INQUIRY_REPLY]: { icon: '💬', color: 'blue' },
    [NOTIFICATION_TYPES.BOOKING_REQUEST]: { icon: '📅', color: 'yellow' },
    [NOTIFICATION_TYPES.BOOKING_CONFIRMED]: { icon: '✅', color: 'green' },
    [NOTIFICATION_TYPES.BOOKING_DECLINED]: { icon: '❌', color: 'red' },
    [NOTIFICATION_TYPES.BOOKING_CANCELLED]: { icon: '🚫', color: 'red' },
    [NOTIFICATION_TYPES.BOOKING_REMINDER]: { icon: '⏰', color: 'yellow' },
    [NOTIFICATION_TYPES.BOOKING_COMPLETED]: { icon: '🎉', color: 'green' },
    [NOTIFICATION_TYPES.REVIEW_REQUEST]: { icon: '⭐', color: 'yellow' },
    [NOTIFICATION_TYPES.REVIEW_RECEIVED]: { icon: '⭐', color: 'green' },
    [NOTIFICATION_TYPES.PAYOUT_PROCESSED]: { icon: '💰', color: 'green' },
    [NOTIFICATION_TYPES.PROVIDER_APPROVED]: { icon: '🎉', color: 'green' },
    [NOTIFICATION_TYPES.PROVIDER_DENIED]: { icon: '❌', color: 'red' },
    [NOTIFICATION_TYPES.PROVIDER_INFO_NEEDED]: { icon: '📋', color: 'orange' },
    [NOTIFICATION_TYPES.PROVIDER_MESSAGE]: { icon: '✉️', color: 'blue' },
    [NOTIFICATION_TYPES.SYSTEM]: { icon: 'ℹ️', color: 'gray' }
  };

  return styles[type] || styles[NOTIFICATION_TYPES.SYSTEM];
}

// ============================================
// Notification Creator Functions
// These functions create notification objects that would
// be sent to the notification service in production.
// ============================================

/**
 * Create notification for provider approval
 * Also triggers Groundhogg tag: srna_provider_approved
 */
export function createApprovalNotification(userId, providerName) {
  // TODO: In production, this would:
  // 1. Create notification in DB
  // 2. Add Groundhogg tag: srna_provider_approved
  // 3. Trigger Groundhogg email sequence
  return {
    id: `notif_${Date.now()}`,
    userId,
    type: NOTIFICATION_TYPES.PROVIDER_APPROVED,
    title: 'Welcome to the Mentor Marketplace! 🎉',
    body: `Congratulations ${providerName}! Your application has been approved. Complete your profile setup to start receiving bookings.`,
    link: '/marketplace/provider/onboarding?step=5',
    readAt: null,
    createdAt: new Date().toISOString(),
    // Groundhogg integration
    groundhoggTag: 'srna_provider_approved',
  };
}

/**
 * Create notification for provider denial
 * Also triggers Groundhogg tag: srna_provider_denied
 */
export function createDenialNotification(userId, providerName, reason) {
  // TODO: In production, this would:
  // 1. Create notification in DB
  // 2. Add Groundhogg tag: srna_provider_denied
  // 3. Trigger Groundhogg email with denial reason
  return {
    id: `notif_${Date.now()}`,
    userId,
    type: NOTIFICATION_TYPES.PROVIDER_DENIED,
    title: 'Application Update',
    body: `Hi ${providerName}, we were unable to approve your mentor application at this time. Please check your application status for details.`,
    link: '/marketplace/provider/application-status',
    readAt: null,
    createdAt: new Date().toISOString(),
    // Groundhogg integration
    groundhoggTag: 'srna_provider_denied',
    metadata: { reason },
  };
}

/**
 * Create notification for info request
 * Also triggers Groundhogg tag: srna_provider_info_needed
 */
export function createInfoNeededNotification(userId, providerName, message) {
  // TODO: In production, this would:
  // 1. Create notification in DB
  // 2. Add Groundhogg tag: srna_provider_info_needed
  // 3. Trigger Groundhogg email with the info request
  return {
    id: `notif_${Date.now()}`,
    userId,
    type: NOTIFICATION_TYPES.PROVIDER_INFO_NEEDED,
    title: 'Additional Information Needed',
    body: `Hi ${providerName}, we need some additional information to complete your application review. Please check your inbox.`,
    link: '/marketplace/provider/application-status',
    readAt: null,
    createdAt: new Date().toISOString(),
    // Groundhogg integration
    groundhoggTag: 'srna_provider_info_needed',
    metadata: { message },
  };
}

/**
 * Create notification for admin message
 */
export function createMessageNotification(userId, providerName) {
  return {
    id: `notif_${Date.now()}`,
    userId,
    type: NOTIFICATION_TYPES.PROVIDER_MESSAGE,
    title: 'New Message from CRNA Club Team',
    body: 'You have a new message from the CRNA Club team. Click to view.',
    link: '/marketplace/provider/dashboard',
    readAt: null,
    createdAt: new Date().toISOString(),
  };
}
