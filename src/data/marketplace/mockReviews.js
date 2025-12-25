/**
 * Mock Marketplace Review Data
 *
 * Double-blind reviews from both applicants and providers.
 * Reviews are hidden until both parties submit.
 *
 * TODO: Replace with API calls to:
 * - GET /api/marketplace/reviews
 * - GET /api/marketplace/providers/:id/reviews
 */

export const REVIEW_STATUS = {
  PENDING: 'pending',         // Waiting for user to submit
  SUBMITTED: 'submitted',     // Submitted but other party hasn't
  VISIBLE: 'visible'          // Both submitted, now visible
};

// Reviews from applicants about providers
export const mockApplicantReviews = [
  {
    id: "review_001",
    bookingId: "booking_004",
    reviewerId: "user_001",
    reviewerName: "Sarah J.",
    revieweeId: "provider_001",
    revieweeType: "provider",

    rating: 5,
    comment: "Sarah was absolutely amazing! She asked me tough questions I hadn't thought of and gave me honest feedback. I felt so much more prepared for my Duke interview after our session. Highly recommend!",

    // Service context
    serviceType: "school_qa",
    serviceName: "Duke CRNA Program Insider Q&A",

    status: REVIEW_STATUS.VISIBLE,
    submittedAt: "2024-11-26T10:00:00Z",
    visibleAt: "2024-11-26T14:00:00Z", // When both reviews submitted

    // Provider response
    providerResponse: "It was great meeting you! You're going to crush your interview - you already have great answers, just needed a bit of polish. Good luck!",
    providerRespondedAt: "2024-11-27T09:00:00Z",

    createdAt: "2024-11-25T17:35:00Z"
  },
  {
    id: "review_003",
    bookingId: "booking_005",
    reviewerId: "user_001",
    reviewerName: "Sarah J.",
    revieweeId: "provider_005",
    revieweeType: "provider",

    rating: 4,
    comment: "Amanda gave me a lot of great insights about PICU backgrounds and which programs are most welcoming. The only reason for 4 stars is we ran a bit short on time and I didn't get to all my questions. But the info she shared was gold!",

    serviceType: "strategy_session",
    serviceName: "PICU to CRNA: Making the Transition",

    status: REVIEW_STATUS.SUBMITTED, // Provider hasn't reviewed yet
    submittedAt: "2024-11-19T08:00:00Z",
    visibleAt: null,

    providerResponse: null,
    providerRespondedAt: null,

    createdAt: "2024-11-18T15:50:00Z"
  },
  {
    id: "review_005",
    bookingId: "booking_past_003",
    reviewerId: "user_006",
    reviewerName: "Michael T.",
    revieweeId: "provider_001",
    revieweeType: "provider",

    rating: 5,
    comment: "The mock interview was incredibly realistic. Sarah didn't hold back - she asked the hard questions and pushed me to give better answers. I walked out knowing exactly what I needed to work on.",

    serviceType: "mock_interview",
    serviceName: "Full Mock Interview Experience",

    status: REVIEW_STATUS.VISIBLE,
    submittedAt: "2024-11-10T16:00:00Z",
    visibleAt: "2024-11-10T18:00:00Z",

    providerResponse: null,
    providerRespondedAt: null,

    createdAt: "2024-11-09T19:00:00Z"
  },
  {
    id: "review_006",
    bookingId: "booking_past_004",
    reviewerId: "user_007",
    reviewerName: "Jennifer L.",
    revieweeId: "provider_003",
    revieweeType: "provider",

    rating: 5,
    comment: "Jess completely transformed my personal statement. I went from a generic essay to something that really showed who I am. Her feedback was detailed and actionable. Worth every penny!",

    serviceType: "essay_review",
    serviceName: "Personal Statement Transformation",

    status: REVIEW_STATUS.VISIBLE,
    submittedAt: "2024-10-28T11:00:00Z",
    visibleAt: "2024-10-28T15:00:00Z",

    providerResponse: "Thank you Jennifer! Your story was already compelling - it just needed to shine through more. Wishing you the best with your applications!",
    providerRespondedAt: "2024-10-29T09:00:00Z",

    createdAt: "2024-10-25T00:00:00Z"
  },
  {
    id: "review_007",
    bookingId: "booking_past_005",
    reviewerId: "user_008",
    reviewerName: "David R.",
    revieweeId: "provider_003",
    revieweeType: "provider",

    rating: 5,
    comment: "My West Coast interview prep session was exactly what I needed. Jess knows these programs inside and out. She told me things about UCSF's interview style that I never would have known otherwise.",

    serviceType: "mock_interview",
    serviceName: "West Coast Program Interview Prep",

    status: REVIEW_STATUS.VISIBLE,
    submittedAt: "2024-11-05T14:00:00Z",
    visibleAt: "2024-11-05T16:30:00Z",

    providerResponse: null,
    providerRespondedAt: null,

    createdAt: "2024-11-04T17:00:00Z"
  },
  {
    id: "review_008",
    bookingId: "booking_past_006",
    reviewerId: "user_009",
    reviewerName: "Amanda K.",
    revieweeId: "provider_002",
    revieweeType: "provider",

    rating: 4,
    comment: "Marcus was really helpful for my non-traditional background. He helped me see my career change as a strength. Would have loved a bit more time to practice specific answers.",

    serviceType: "strategy_session",
    serviceName: "Application Strategy for Career Changers",

    status: REVIEW_STATUS.VISIBLE,
    submittedAt: "2024-11-01T10:00:00Z",
    visibleAt: "2024-11-01T12:00:00Z",

    providerResponse: "Thanks Amanda! Your accounting background is definitely an asset - programs love diversity. Feel free to book a mock interview when you're ready to practice!",
    providerRespondedAt: "2024-11-02T08:00:00Z",

    createdAt: "2024-10-31T16:00:00Z"
  },
  {
    id: "review_009",
    bookingId: "booking_past_007",
    reviewerId: "user_010",
    reviewerName: "Chris M.",
    revieweeId: "provider_001",
    revieweeType: "provider",

    rating: 5,
    comment: "Sarah is the real deal. As someone at Duke, she knows exactly what the program is looking for. Her feedback on my 'Why anesthesia?' answer alone was worth the session.",

    serviceType: "mock_interview",
    serviceName: "Full Mock Interview Experience",

    status: REVIEW_STATUS.VISIBLE,
    submittedAt: "2024-10-20T09:00:00Z",
    visibleAt: "2024-10-20T11:00:00Z",

    providerResponse: null,
    providerRespondedAt: null,

    createdAt: "2024-10-19T18:30:00Z"
  },
  {
    id: "review_010",
    bookingId: "booking_past_008",
    reviewerId: "user_011",
    reviewerName: "Taylor S.",
    revieweeId: "provider_004",
    revieweeType: "provider",

    rating: 5,
    comment: "David helped me organize my chaotic travel nursing resume into something coherent and impressive. He understood exactly how to present multiple short-term positions.",

    serviceType: "resume_review",
    serviceName: "Travel Nurse Resume Optimization",

    status: REVIEW_STATUS.VISIBLE,
    submittedAt: "2024-12-01T15:00:00Z",
    visibleAt: "2024-12-01T18:00:00Z",

    providerResponse: null,
    providerRespondedAt: null,

    createdAt: "2024-11-29T00:00:00Z"
  }
];

// Reviews from providers about applicants
export const mockProviderReviews = [
  {
    id: "review_002",
    bookingId: "booking_004",
    reviewerId: "provider_001",
    reviewerName: "Sarah Chen",
    revieweeId: "user_001",
    revieweeType: "applicant",

    rating: 5,
    comment: "Sarah came prepared with great questions and was receptive to feedback. She has a strong application - just needs to polish her interview delivery.",

    serviceType: "school_qa",
    serviceName: "Duke CRNA Program Insider Q&A",

    status: REVIEW_STATUS.VISIBLE,
    submittedAt: "2024-11-26T14:00:00Z",
    visibleAt: "2024-11-26T14:00:00Z",

    createdAt: "2024-11-25T17:35:00Z"
  },
  {
    id: "review_004",
    bookingId: "booking_past_003",
    reviewerId: "provider_001",
    reviewerName: "Sarah Chen",
    revieweeId: "user_006",
    revieweeType: "applicant",

    rating: 5,
    comment: "Michael was engaged throughout and took detailed notes. He implemented feedback in real-time during our practice. Great attitude!",

    serviceType: "mock_interview",
    serviceName: "Full Mock Interview Experience",

    status: REVIEW_STATUS.VISIBLE,
    submittedAt: "2024-11-10T18:00:00Z",
    visibleAt: "2024-11-10T18:00:00Z",

    createdAt: "2024-11-09T19:00:00Z"
  }
];

// Combined for easy access
export const mockAllReviews = [...mockApplicantReviews, ...mockProviderReviews];

// Helper: Get reviews for a provider (visible only)
export function getProviderReviews(providerId) {
  return mockApplicantReviews.filter(r =>
    r.revieweeId === providerId &&
    r.status === REVIEW_STATUS.VISIBLE
  ).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
}

// Helper: Get review stats for a provider
export function getProviderReviewStats(providerId) {
  const reviews = getProviderReviews(providerId);
  if (reviews.length === 0) return { average: 0, count: 0, distribution: {} };

  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => distribution[r.rating]++);

  return {
    average: Math.round((sum / reviews.length) * 10) / 10,
    count: reviews.length,
    distribution
  };
}

// Helper: Get reviews by an applicant
export function getApplicantSubmittedReviews(applicantId) {
  return mockApplicantReviews.filter(r => r.reviewerId === applicantId);
}

// Helper: Get review by booking ID
export function getReviewsByBooking(bookingId) {
  const applicantReview = mockApplicantReviews.find(r => r.bookingId === bookingId);
  const providerReview = mockProviderReviews.find(r => r.bookingId === bookingId);

  return {
    applicantReview: applicantReview || null,
    providerReview: providerReview || null,
    bothSubmitted: !!(applicantReview && providerReview)
  };
}

// Helper: Check if user can see review
export function canSeeReview(review, userId) {
  // Both parties can see once status is VISIBLE
  if (review.status === REVIEW_STATUS.VISIBLE) return true;

  // User can see their own submitted review
  if (review.reviewerId === userId && review.status === REVIEW_STATUS.SUBMITTED) {
    return true;
  }

  return false;
}
