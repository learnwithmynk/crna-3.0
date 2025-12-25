/**
 * Mock Admin-Provider Messaging Data
 *
 * Two-way messaging between admins and providers for:
 * - Application discussions
 * - Clarification requests
 * - Check-ins on bookings
 * - General support
 *
 * This is separate from applicant↔provider marketplace messaging.
 * Only admins and providers can participate.
 *
 * TODO: Replace with API calls to:
 * - GET /api/admin/provider-messages
 * - POST /api/admin/provider-messages
 * - PUT /api/admin/provider-messages/:id/read
 */

export const MESSAGE_TYPES = {
  APPLICATION_UPDATE: 'application_update',     // Approval, denial, info request
  INFO_REQUEST: 'info_request',                 // Admin needs more info
  CHECK_IN: 'check_in',                         // Admin checking in
  SUPPORT: 'support',                           // Provider question/issue
  SYSTEM: 'system',                             // Automated messages
};

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  DENIED: 'denied',
  INFO_NEEDED: 'info_needed',  // Waiting for provider to submit more info
};

/**
 * Provider application records with status tracking
 * Links to mockPendingProviders but adds more detail
 */
export const mockProviderApplications = [
  {
    id: 'app_001',
    providerId: 'provider_pending_001',
    userId: 'user_srna_pending_001',
    name: 'Tyler Robinson',
    email: 'tyler.r@email.com',
    status: APPLICATION_STATUS.PENDING,
    submittedAt: '2024-12-07T10:00:00Z',
    updatedAt: '2024-12-07T10:00:00Z',
    // Verification statuses
    idVerificationStatus: 'verified',
    eduVerificationStatus: 'pending',
    licenseNumber: 'RN555123',
    licenseState: 'AZ',
    // If denied
    denialReason: null,
    canReapplyAt: null,
    // Groundhogg tag status
    groundhoggTags: ['srna_provider_applicant'],
  },
  {
    id: 'app_002',
    providerId: 'provider_pending_002',
    userId: 'user_srna_pending_002',
    name: 'Rachel Liu',
    email: 'rachel.liu@email.com',
    status: APPLICATION_STATUS.INFO_NEEDED,
    submittedAt: '2024-12-08T14:30:00Z',
    updatedAt: '2024-12-09T09:00:00Z',
    idVerificationStatus: 'verified',
    eduVerificationStatus: 'verified',
    licenseNumber: 'RN888456',
    licenseState: 'PA',
    denialReason: null,
    canReapplyAt: null,
    groundhoggTags: ['srna_provider_applicant'],
    // Pending info request
    infoRequestMessage: 'Could you provide a clearer photo of your student ID? The current one is blurry.',
  },
  {
    id: 'app_003',
    providerId: 'provider_denied_001',
    userId: 'user_srna_denied_001',
    name: 'James Carter',
    email: 'james.c@email.com',
    status: APPLICATION_STATUS.DENIED,
    submittedAt: '2024-12-01T11:00:00Z',
    updatedAt: '2024-12-03T15:00:00Z',
    idVerificationStatus: 'verified',
    eduVerificationStatus: 'failed',
    licenseNumber: 'RN000999',
    licenseState: 'TX',
    denialReason: 'We were unable to verify your enrollment in a CRNA program. Please ensure you\'re currently enrolled and reapply with documentation from your program.',
    canReapplyAt: '2025-01-03T00:00:00Z', // 30 days from denial
    groundhoggTags: ['srna_provider_applicant', 'srna_provider_denied'],
  },
];

/**
 * Admin-Provider conversation threads
 * Each thread is tied to a provider/applicant
 */
export const mockAdminConversations = [
  {
    id: 'admin_conv_001',
    providerId: 'provider_pending_002',
    providerName: 'Rachel Liu',
    providerEmail: 'rachel.liu@email.com',
    applicationId: 'app_002',
    status: 'open', // 'open' | 'resolved' | 'waiting_response'
    lastMessageAt: '2024-12-09T09:00:00Z',
    unreadByProvider: 1,
    unreadByAdmin: 0,
    createdAt: '2024-12-09T09:00:00Z',
  },
  {
    id: 'admin_conv_002',
    providerId: 'provider_001',
    providerName: 'Sarah Chen',
    providerEmail: 'sarah.chen@duke.edu',
    applicationId: null, // Already approved, general check-in
    status: 'resolved',
    lastMessageAt: '2024-11-15T14:00:00Z',
    unreadByProvider: 0,
    unreadByAdmin: 0,
    createdAt: '2024-11-15T10:00:00Z',
  },
  {
    id: 'admin_conv_003',
    providerId: 'provider_denied_001',
    providerName: 'James Carter',
    providerEmail: 'james.c@email.com',
    applicationId: 'app_003',
    status: 'resolved',
    lastMessageAt: '2024-12-03T15:00:00Z',
    unreadByProvider: 0,
    unreadByAdmin: 0,
    createdAt: '2024-12-03T15:00:00Z',
  },
];

/**
 * Individual messages within conversations
 */
export const mockAdminMessages = [
  // Rachel Liu - Info request conversation
  {
    id: 'admin_msg_001',
    conversationId: 'admin_conv_001',
    senderId: 'admin',
    senderName: 'CRNA Club Team',
    senderRole: 'admin',
    type: MESSAGE_TYPES.INFO_REQUEST,
    content: 'Hi Rachel! Thanks for applying to become a mentor. We noticed the photo of your student ID is a bit blurry. Could you upload a clearer image? You can reply here or update your application.',
    readAt: null, // Unread by provider
    createdAt: '2024-12-09T09:00:00Z',
  },

  // Sarah Chen - Check-in conversation
  {
    id: 'admin_msg_002',
    conversationId: 'admin_conv_002',
    senderId: 'admin',
    senderName: 'CRNA Club Team',
    senderRole: 'admin',
    type: MESSAGE_TYPES.CHECK_IN,
    content: 'Hey Sarah! Just checking in to see how your first few weeks as a mentor have been going. Any questions or issues we can help with?',
    readAt: '2024-11-15T11:00:00Z',
    createdAt: '2024-11-15T10:00:00Z',
  },
  {
    id: 'admin_msg_003',
    conversationId: 'admin_conv_002',
    senderId: 'user_srna_001',
    senderName: 'Sarah Chen',
    senderRole: 'provider',
    type: MESSAGE_TYPES.SUPPORT,
    content: 'Hi! Everything\'s been great so far. I had one question - is there a way to see analytics on how many people viewed my profile?',
    readAt: '2024-11-15T12:00:00Z',
    createdAt: '2024-11-15T11:30:00Z',
  },
  {
    id: 'admin_msg_004',
    conversationId: 'admin_conv_002',
    senderId: 'admin',
    senderName: 'CRNA Club Team',
    senderRole: 'admin',
    type: MESSAGE_TYPES.SUPPORT,
    content: 'Great question! Check out the Insights page in your provider dashboard - it shows profile views, inquiry rates, and booking conversions. Let us know if you have any other questions!',
    readAt: '2024-11-15T14:30:00Z',
    createdAt: '2024-11-15T14:00:00Z',
  },

  // James Carter - Denial conversation
  {
    id: 'admin_msg_005',
    conversationId: 'admin_conv_003',
    senderId: 'admin',
    senderName: 'CRNA Club Team',
    senderRole: 'admin',
    type: MESSAGE_TYPES.APPLICATION_UPDATE,
    content: 'Hi James, thank you for your interest in becoming a mentor on The CRNA Club. Unfortunately, we were unable to verify your enrollment in a CRNA program at this time.\n\nIf you believe this is an error, please reply with documentation from your program (such as an enrollment letter or student ID showing current enrollment).\n\nYou\'ll be eligible to reapply on January 3, 2025.',
    readAt: '2024-12-03T16:00:00Z',
    createdAt: '2024-12-03T15:00:00Z',
  },
];

// ============================================
// Helper Functions
// ============================================

/**
 * Get all conversations for admin view
 */
export function getAdminConversations() {
  return mockAdminConversations.sort(
    (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
  );
}

/**
 * Get conversations with unread messages (for admin)
 */
export function getUnreadAdminConversations() {
  return mockAdminConversations.filter(c => c.unreadByAdmin > 0);
}

/**
 * Get conversation for a specific provider
 */
export function getProviderConversation(providerId) {
  return mockAdminConversations.find(c => c.providerId === providerId) || null;
}

/**
 * Get messages for a conversation
 */
export function getConversationMessages(conversationId) {
  return mockAdminMessages
    .filter(m => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

/**
 * Get provider inbox (messages for a specific provider)
 */
export function getProviderInbox(providerId) {
  const conversation = getProviderConversation(providerId);
  if (!conversation) return { conversation: null, messages: [] };

  return {
    conversation,
    messages: getConversationMessages(conversation.id),
  };
}

/**
 * Get unread count for provider inbox
 */
export function getProviderUnreadCount(providerId) {
  const conversation = getProviderConversation(providerId);
  return conversation?.unreadByProvider || 0;
}

/**
 * Get application by provider ID
 */
export function getApplicationByProviderId(providerId) {
  return mockProviderApplications.find(a => a.providerId === providerId) || null;
}

/**
 * Get application status with details
 */
export function getApplicationStatus(providerId) {
  const app = getApplicationByProviderId(providerId);
  if (!app) return null;

  return {
    status: app.status,
    denialReason: app.denialReason,
    canReapplyAt: app.canReapplyAt,
    infoRequestMessage: app.infoRequestMessage,
    updatedAt: app.updatedAt,
  };
}

// ============================================
// Mock API Functions (for future integration)
// ============================================

/**
 * Send message from admin to provider
 * In production, this would:
 * 1. Create message in DB
 * 2. Create/update conversation
 * 3. Send notification to provider
 * 4. Optionally trigger Groundhogg email
 */
export function sendAdminMessage(providerId, content, type = MESSAGE_TYPES.CHECK_IN) {
  // Mock implementation
  console.log('Admin message sent:', { providerId, content, type });
  return {
    success: true,
    messageId: `admin_msg_${Date.now()}`,
  };
}

/**
 * Send message from provider to admin
 */
export function sendProviderMessage(providerId, content) {
  console.log('Provider message sent:', { providerId, content });
  return {
    success: true,
    messageId: `provider_msg_${Date.now()}`,
  };
}

/**
 * Approve provider application
 * In production, this would:
 * 1. Update application status
 * 2. Add Groundhogg tag: srna_provider_approved
 * 3. Send in-app notification
 * 4. Create system message in conversation
 *
 * @param {string} applicationId - The application to approve
 * @param {string} adminNotes - Optional admin notes
 * @returns {Object} Result with notification info
 */
export function approveProviderApplication(applicationId, adminNotes = '') {
  // Find the application
  const application = mockProviderApplications.find(a => a.id === applicationId);

  if (!application) {
    console.error('Application not found:', applicationId);
    return { success: false, error: 'Application not found' };
  }

  console.log('Provider approved:', { applicationId, adminNotes });

  // In production, this would:
  // 1. Update application status in DB
  // 2. Call Groundhogg API to add tag
  // 3. Create notification via createApprovalNotification()
  // 4. Create system message in conversation

  return {
    success: true,
    groundhoggTag: 'srna_provider_approved',
    notificationSent: true,
    // Notification would be created like this:
    // notification: createApprovalNotification(application.userId, application.name),
    applicationStatus: APPLICATION_STATUS.APPROVED,
  };
}

/**
 * Deny provider application
 * In production, this would:
 * 1. Update application status with reason
 * 2. Add Groundhogg tag: srna_provider_denied
 * 3. Send in-app notification
 * 4. Create message in conversation with denial reason
 * 5. Set reapply date (30 days)
 *
 * @param {string} applicationId - The application to deny
 * @param {string} denialReason - Reason for denial (shown to provider)
 * @param {number} canReapplyDays - Days until provider can reapply (default 30)
 * @returns {Object} Result with notification info and reapply date
 */
export function denyProviderApplication(applicationId, denialReason, canReapplyDays = 30) {
  const application = mockProviderApplications.find(a => a.id === applicationId);

  if (!application) {
    console.error('Application not found:', applicationId);
    return { success: false, error: 'Application not found' };
  }

  const canReapplyAt = new Date(Date.now() + canReapplyDays * 24 * 60 * 60 * 1000).toISOString();

  console.log('Provider denied:', { applicationId, denialReason, canReapplyDays });

  // In production, this would:
  // 1. Update application status in DB
  // 2. Store denial reason
  // 3. Call Groundhogg API to add tag
  // 4. Create notification via createDenialNotification()
  // 5. Create message in conversation with denial details

  return {
    success: true,
    groundhoggTag: 'srna_provider_denied',
    notificationSent: true,
    canReapplyAt,
    // Notification would be created like this:
    // notification: createDenialNotification(application.userId, application.name, denialReason),
    applicationStatus: APPLICATION_STATUS.DENIED,
  };
}

/**
 * Request more info from provider
 * In production, this would:
 * 1. Update application status to 'info_needed'
 * 2. Create message in conversation
 * 3. Send notification
 * 4. Add Groundhogg tag: srna_provider_info_needed
 *
 * @param {string} applicationId - The application needing info
 * @param {string} message - Info request message to provider
 * @returns {Object} Result with notification info
 */
export function requestProviderInfo(applicationId, message) {
  const application = mockProviderApplications.find(a => a.id === applicationId);

  if (!application) {
    console.error('Application not found:', applicationId);
    return { success: false, error: 'Application not found' };
  }

  console.log('Info requested:', { applicationId, message });

  // In production, this would:
  // 1. Update application status to INFO_NEEDED
  // 2. Store the info request message
  // 3. Create message in conversation
  // 4. Create notification via createInfoNeededNotification()
  // 5. Call Groundhogg API to add tag

  return {
    success: true,
    groundhoggTag: 'srna_provider_info_needed',
    notificationSent: true,
    // Notification would be created like this:
    // notification: createInfoNeededNotification(application.userId, application.name, message),
    applicationStatus: APPLICATION_STATUS.INFO_NEEDED,
  };
}
