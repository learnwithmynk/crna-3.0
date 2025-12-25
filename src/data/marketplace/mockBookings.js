/**
 * Mock Marketplace Booking Data
 *
 * Bookings across all states for testing UI components.
 * Includes both Instant Book and Requires Confirmation flows.
 *
 * TODO: Replace with API calls to:
 * - GET /api/marketplace/bookings
 * - GET /api/marketplace/bookings/:id
 */

// Booking states based on dual state machine
export const BOOKING_STATUS = {
  // Shared states
  PENDING_PAYMENT: 'pending_payment',
  PAYMENT_FAILED: 'payment_failed',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',

  // Requires Confirmation only
  PENDING_PROVIDER: 'pending_provider',
  DECLINED: 'declined'
};

export const CANCELLATION_REASON = {
  APPLICANT_REQUESTED: 'applicant_requested',
  PROVIDER_REQUESTED: 'provider_requested',
  PROVIDER_NO_RESPONSE: 'provider_no_response',
  PAYMENT_FAILED: 'payment_failed',
  SLOT_CONFLICT: 'slot_conflict',
  TECHNICAL_ISSUE: 'technical_issue'
};

export const mockBookings = [
  // ============================================
  // CONFIRMED BOOKINGS (Upcoming)
  // ============================================
  {
    id: "booking_001",
    applicantId: "user_001", // Sarah Johnson (our main mock user)
    providerId: "provider_001",
    serviceId: "service_001",

    // Service snapshot at time of booking
    serviceSnapshot: {
      title: "Full Mock Interview Experience",
      type: "mock_interview",
      price: 125,
      duration: 60
    },
    providerSnapshot: {
      name: "Sarah Chen",
      program: "Duke University"
    },

    // Scheduling
    scheduledAt: "2024-12-12T18:00:00Z", // 3 days from now
    timezone: "America/New_York",
    duration: 60,

    // Cal.com Integration
    calComBookingId: "cal_booking_abc123",
    meetingUrl: "https://meet.google.com/abc-defg-hij",

    // Payment
    price: 125,
    platformFee: 25, // 20%
    providerPayout: 100,
    stripePaymentIntentId: "pi_abc123",
    paymentStatus: "captured",

    // Service-specific intake form data
    intakeData: {
      interviewType: "traditional",
      targetPrograms: ["Duke University", "UNC Chapel Hill"],
      areasOfConcern: ["behavioral_questions", "why_crna", "program_specific"],
      wantsRecording: true
    },

    // Session notes (Editor.js format - persistent notepad for applicant)
    sessionNotes: {
      time: 1702300000000,
      blocks: [
        { type: "header", data: { text: "Pre-session prep", level: 3 } },
        { type: "paragraph", data: { text: "Research Duke's simulation lab and clinical rotation sites before the call." } },
        { type: "checklist", data: { items: [
          { text: "Review my personal statement for talking points", checked: true },
          { text: "Prepare 3 questions about Duke's program", checked: true },
          { text: "Practice my 'tell me about yourself' answer", checked: false }
        ]}}
      ]
    },

    // Booking context
    applicantNotes: "I'm interviewing at Duke in January. Would love to practice with someone who knows the program!",
    bookingModel: "instant",

    // Status
    status: BOOKING_STATUS.CONFIRMED,
    confirmedAt: "2024-12-09T10:30:00Z",

    // Timestamps
    createdAt: "2024-12-09T10:30:00Z",
    updatedAt: "2024-12-09T10:30:00Z"
  },
  {
    id: "booking_002",
    applicantId: "user_001",
    providerId: "provider_003",
    serviceId: "service_006",

    serviceSnapshot: {
      title: "Personal Statement Transformation",
      type: "essay_review",
      price: 95,
      duration: null
    },
    providerSnapshot: {
      name: "Jessica Martinez",
      program: "UCSF"
    },

    scheduledAt: null, // Async service
    timezone: "America/Los_Angeles",
    duration: null,
    turnaroundDeadline: "2024-12-13T00:00:00Z", // 72 hours from booking

    calComBookingId: null, // No calendar for async
    meetingUrl: null,

    price: 95,
    platformFee: 19,
    providerPayout: 76,
    stripePaymentIntentId: "pi_def456",
    paymentStatus: "captured",

    applicantNotes: "First draft of my personal statement. Looking for feedback on structure and the opening paragraph especially.",
    bookingModel: "instant",

    status: BOOKING_STATUS.CONFIRMED,
    confirmedAt: "2024-12-10T14:00:00Z",

    // File attachments (for async services)
    attachments: [
      {
        id: "file_001",
        name: "Personal_Statement_Draft_v1.pdf",
        url: "/uploads/booking_002/personal_statement.pdf",
        uploadedAt: "2024-12-10T14:05:00Z"
      }
    ],

    createdAt: "2024-12-10T14:00:00Z",
    updatedAt: "2024-12-10T14:05:00Z"
  },

  // ============================================
  // PENDING PROVIDER (Requires Confirmation)
  // ============================================
  {
    id: "booking_003",
    applicantId: "user_002",
    providerId: "provider_002",
    serviceId: "service_004",

    serviceSnapshot: {
      title: "Application Strategy for Career Changers",
      type: "strategy_session",
      price: 100,
      duration: 45
    },
    providerSnapshot: {
      name: "Marcus Johnson",
      program: "Emory University"
    },

    // Requested time slots (provider hasn't confirmed yet)
    requestedSlots: [
      "2024-12-14T14:00:00Z",
      "2024-12-14T15:00:00Z",
      "2024-12-15T10:00:00Z"
    ],
    scheduledAt: null, // Not confirmed yet
    timezone: "America/New_York",
    duration: 45,

    calComBookingId: null, // Created after provider confirms
    meetingUrl: null,

    price: 100,
    platformFee: 20,
    providerPayout: 80,
    stripePaymentIntentId: "pi_ghi789",
    paymentStatus: "authorized", // Payment authorized, captured when provider accepts

    // Service-specific intake form data
    intakeData: {
      currentStage: "building_prereqs",
      mainConcerns: ["timeline", "gpa_improvement", "school_selection"],
      priorityQuestion: "How do I balance working full-time while taking prerequisites?"
    },

    applicantNotes: "I'm a career changer - former accountant with 2 years ICU experience. Need help figuring out my timeline.",
    bookingModel: "requires_confirmation",

    status: BOOKING_STATUS.PENDING_PROVIDER,
    expiresAt: "2024-12-11T12:00:00Z", // 48 hours to respond (not 24)
    reminderSentAt: null, // Will be set when 24h nudge is sent

    createdAt: "2024-12-09T12:00:00Z",
    updatedAt: "2024-12-09T12:00:00Z"
  },

  // ============================================
  // COMPLETED BOOKINGS (Past)
  // ============================================
  {
    id: "booking_004",
    applicantId: "user_001",
    providerId: "provider_001",
    serviceId: "service_003",

    serviceSnapshot: {
      title: "Duke CRNA Program Insider Q&A",
      type: "school_qa",
      price: 50,
      duration: 30
    },
    providerSnapshot: {
      name: "Sarah Chen",
      program: "Duke University"
    },

    scheduledAt: "2024-11-25T17:00:00Z",
    timezone: "America/New_York",
    duration: 30,

    calComBookingId: "cal_booking_past_001",
    meetingUrl: "https://meet.google.com/past-link",

    price: 50,
    platformFee: 10,
    providerPayout: 40,
    stripePaymentIntentId: "pi_jkl012",
    paymentStatus: "captured",

    applicantNotes: "Interested in Duke's simulation lab and clinical rotation sites.",
    bookingModel: "instant",

    status: BOOKING_STATUS.COMPLETED,
    confirmedAt: "2024-11-20T09:00:00Z",
    completedAt: "2024-11-25T17:35:00Z",

    // Review status
    applicantReviewId: "review_001",
    providerReviewId: "review_002",

    createdAt: "2024-11-20T09:00:00Z",
    updatedAt: "2024-11-25T17:35:00Z"
  },
  {
    id: "booking_005",
    applicantId: "user_001",
    providerId: "provider_005",
    serviceId: "service_011",

    serviceSnapshot: {
      title: "PICU to CRNA: Making the Transition",
      type: "strategy_session",
      price: 90,
      duration: 45
    },
    providerSnapshot: {
      name: "Amanda Thompson",
      program: "Vanderbilt University"
    },

    scheduledAt: "2024-11-18T15:00:00Z",
    timezone: "America/Chicago",
    duration: 45,

    calComBookingId: "cal_booking_past_002",
    meetingUrl: "https://zoom.us/j/past-meeting",

    price: 90,
    platformFee: 18,
    providerPayout: 72,
    stripePaymentIntentId: "pi_mno345",
    paymentStatus: "captured",

    applicantNotes: null,
    bookingModel: "instant",

    status: BOOKING_STATUS.COMPLETED,
    confirmedAt: "2024-11-15T10:00:00Z",
    completedAt: "2024-11-18T15:50:00Z",

    // Only applicant has reviewed so far
    applicantReviewId: "review_003",
    providerReviewId: null,

    createdAt: "2024-11-15T10:00:00Z",
    updatedAt: "2024-11-18T15:50:00Z"
  },

  // ============================================
  // CANCELLED BOOKINGS
  // ============================================
  {
    id: "booking_006",
    applicantId: "user_003",
    providerId: "provider_001",
    serviceId: "service_001",

    serviceSnapshot: {
      title: "Full Mock Interview Experience",
      type: "mock_interview",
      price: 125,
      duration: 60
    },
    providerSnapshot: {
      name: "Sarah Chen",
      program: "Duke University"
    },

    scheduledAt: "2024-12-05T19:00:00Z",
    timezone: "America/New_York",
    duration: 60,

    calComBookingId: "cal_booking_cancelled_001",
    meetingUrl: null,

    price: 125,
    platformFee: 25,
    providerPayout: 100,
    stripePaymentIntentId: "pi_pqr678",
    paymentStatus: "refunded",

    applicantNotes: "Preparing for January interviews",
    bookingModel: "instant",

    status: BOOKING_STATUS.CANCELLED,
    confirmedAt: "2024-12-01T11:00:00Z",
    cancelledAt: "2024-12-04T08:00:00Z", // Cancelled 35 hours before
    cancellationReason: CANCELLATION_REASON.APPLICANT_REQUESTED,
    cancellationNote: "Family emergency, need to reschedule",
    refundAmount: 125, // Full refund (> 24 hours notice, Flexible policy)

    createdAt: "2024-12-01T11:00:00Z",
    updatedAt: "2024-12-04T08:00:00Z"
  },
  {
    id: "booking_007",
    applicantId: "user_004",
    providerId: "provider_002",
    serviceId: "service_005",

    serviceSnapshot: {
      title: "Behavioral Interview Prep",
      type: "mock_interview",
      price: 110,
      duration: 60
    },
    providerSnapshot: {
      name: "Marcus Johnson",
      program: "Emory University"
    },

    scheduledAt: "2024-11-28T16:00:00Z",
    timezone: "America/New_York",
    duration: 60,

    calComBookingId: "cal_booking_cancelled_002",
    meetingUrl: null,

    price: 110,
    platformFee: 22,
    providerPayout: 88,
    stripePaymentIntentId: "pi_stu901",
    paymentStatus: "refunded",

    applicantNotes: null,
    bookingModel: "requires_confirmation",

    status: BOOKING_STATUS.CANCELLED,
    confirmedAt: "2024-11-25T09:00:00Z",
    cancelledAt: "2024-11-28T14:00:00Z", // Provider cancelled 2 hours before
    cancellationReason: CANCELLATION_REASON.PROVIDER_REQUESTED,
    cancellationNote: "Clinical emergency at school",
    refundAmount: 110, // Full refund (provider cancelled)
    providerStrikeRecorded: true,

    createdAt: "2024-11-25T09:00:00Z",
    updatedAt: "2024-11-28T14:00:00Z"
  },

  // ============================================
  // DECLINED (Requires Confirmation only)
  // ============================================
  {
    id: "booking_008",
    applicantId: "user_005",
    providerId: "provider_004",
    serviceId: "service_010",

    serviceSnapshot: {
      title: "NYC Program Insider (Columbia)",
      type: "school_qa",
      price: 45,
      duration: 30
    },
    providerSnapshot: {
      name: "David Kim",
      program: "Columbia University"
    },

    requestedSlots: [
      "2024-12-08T18:00:00Z",
      "2024-12-08T19:00:00Z"
    ],
    scheduledAt: null,
    timezone: "America/New_York",
    duration: 30,

    calComBookingId: null,
    meetingUrl: null,

    price: 45,
    platformFee: 9,
    providerPayout: 36,
    stripePaymentIntentId: "pi_vwx234",
    paymentStatus: "refunded",

    applicantNotes: "Quick questions about housing near Columbia",
    bookingModel: "requires_confirmation",

    status: BOOKING_STATUS.DECLINED,
    declinedAt: "2024-12-07T10:00:00Z",
    declineReason: "I have exams that week and can't take any bookings. Please check back next week!",
    refundAmount: 45,

    createdAt: "2024-12-06T14:00:00Z",
    updatedAt: "2024-12-07T10:00:00Z"
  }
];

// Helper: Get bookings for an applicant
export function getApplicantBookings(applicantId) {
  return mockBookings.filter(b => b.applicantId === applicantId);
}

// Helper: Get bookings for a provider
export function getProviderBookings(providerId) {
  return mockBookings.filter(b => b.providerId === providerId);
}

// Helper: Get upcoming bookings
export function getUpcomingBookings(userId, role = 'applicant') {
  const now = new Date();
  const field = role === 'applicant' ? 'applicantId' : 'providerId';

  return mockBookings.filter(b =>
    b[field] === userId &&
    b.status === BOOKING_STATUS.CONFIRMED &&
    b.scheduledAt &&
    new Date(b.scheduledAt) > now
  ).sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
}

// Helper: Get past bookings
export function getPastBookings(userId, role = 'applicant') {
  const field = role === 'applicant' ? 'applicantId' : 'providerId';

  return mockBookings.filter(b =>
    b[field] === userId &&
    b.status === BOOKING_STATUS.COMPLETED
  ).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
}

// Helper: Get pending requests (for providers)
export function getPendingRequests(providerId) {
  return mockBookings.filter(b =>
    b.providerId === providerId &&
    b.status === BOOKING_STATUS.PENDING_PROVIDER
  );
}

// Helper: Get booking by ID
export function getBookingById(id) {
  return mockBookings.find(b => b.id === id) || null;
}

// Helper: Get bookings needing review
export function getBookingsNeedingReview(userId, role = 'applicant') {
  const field = role === 'applicant' ? 'applicantId' : 'providerId';
  const reviewField = role === 'applicant' ? 'applicantReviewId' : 'providerReviewId';

  return mockBookings.filter(b =>
    b[field] === userId &&
    b.status === BOOKING_STATUS.COMPLETED &&
    !b[reviewField]
  );
}
