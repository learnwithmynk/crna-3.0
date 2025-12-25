/**
 * Mock Marketplace Service Data
 *
 * Service offerings from providers. Each provider can offer multiple services.
 *
 * TODO: Replace with API calls to:
 * - GET /api/marketplace/services
 * - GET /api/marketplace/providers/:id/services
 */

export const SERVICE_TYPES = {
  MOCK_INTERVIEW: 'mock_interview',
  ESSAY_REVIEW: 'essay_review',
  STRATEGY_SESSION: 'strategy_session',
  RESUME_REVIEW: 'resume_review',
  SCHOOL_QA: 'school_qa'
};

export const SERVICE_DELIVERY = {
  LIVE: 'live',      // Video call
  ASYNC: 'async'     // Written feedback, no live session
};

// Service type metadata (for UI display)
export const SERVICE_TYPE_META = {
  [SERVICE_TYPES.MOCK_INTERVIEW]: {
    name: "Mock Interview",
    shortName: "Mock Interview",
    description: "Practice answering common CRNA interview questions with real-time feedback",
    icon: "🎤",
    delivery: SERVICE_DELIVERY.LIVE,
    suggestedDuration: 60,
    suggestedPriceRange: { min: 75, max: 150 }
  },
  [SERVICE_TYPES.ESSAY_REVIEW]: {
    name: "Essay Review",
    shortName: "Essay Review",
    description: "Get detailed feedback on your personal statement or application essays",
    icon: "📝",
    delivery: SERVICE_DELIVERY.ASYNC,
    suggestedDuration: null, // Async
    suggestedPriceRange: { min: 50, max: 100 }
  },
  [SERVICE_TYPES.STRATEGY_SESSION]: {
    name: "Strategy Session",
    shortName: "Strategy",
    description: "Personalized guidance on your application timeline, school selection, and preparation",
    icon: "🎯",
    delivery: SERVICE_DELIVERY.LIVE,
    suggestedDuration: 45,
    suggestedPriceRange: { min: 75, max: 125 }
  },
  [SERVICE_TYPES.RESUME_REVIEW]: {
    name: "Resume Review",
    shortName: "Resume",
    description: "Optimize your nursing resume for CRNA applications",
    icon: "📄",
    delivery: SERVICE_DELIVERY.ASYNC,
    suggestedDuration: null,
    suggestedPriceRange: { min: 40, max: 75 }
  },
  [SERVICE_TYPES.SCHOOL_QA]: {
    name: "School Q&A",
    shortName: "Q&A",
    description: "Ask anything about a specific program from someone currently attending",
    icon: "🏫",
    delivery: SERVICE_DELIVERY.LIVE,
    suggestedDuration: 30,
    suggestedPriceRange: { min: 30, max: 60 }
  }
};

export const mockServices = [
  // Sarah Chen's services (provider_001)
  {
    id: "service_001",
    providerId: "provider_001",
    type: SERVICE_TYPES.MOCK_INTERVIEW,
    title: "Full Mock Interview Experience",
    description: "A comprehensive 60-minute mock interview covering behavioral, clinical, and program-specific questions. You'll receive honest feedback on your answers, body language, and overall presentation. I'll share the exact questions I was asked at Duke and other top programs.",
    deliverables: [
      "60-minute live video session",
      "10-15 practice questions",
      "Written feedback summary within 24 hours",
      "List of suggested improvements"
    ],
    price: 125,
    duration: 60, // minutes
    delivery: SERVICE_DELIVERY.LIVE,
    isActive: true,
    bookingCount: 18,
    createdAt: "2024-11-01T00:00:00Z"
  },
  {
    id: "service_002",
    providerId: "provider_001",
    type: SERVICE_TYPES.ESSAY_REVIEW,
    title: "Personal Statement Deep Dive",
    description: "I'll review your personal statement with fresh eyes and provide detailed feedback on content, structure, and impact. Having read hundreds of essays, I know what makes admissions committees take notice.",
    deliverables: [
      "Line-by-line comments on your essay",
      "Overall structure feedback",
      "Suggestions for stronger opening/closing",
      "48-hour turnaround"
    ],
    price: 75,
    duration: null,
    delivery: SERVICE_DELIVERY.ASYNC,
    turnaroundHours: 48,
    isActive: true,
    bookingCount: 8,
    createdAt: "2024-11-01T00:00:00Z"
  },
  {
    id: "service_003",
    providerId: "provider_001",
    type: SERVICE_TYPES.SCHOOL_QA,
    title: "Duke CRNA Program Insider Q&A",
    description: "Get the inside scoop on Duke's CRNA program! I'll answer all your questions about the curriculum, clinical rotations, faculty, living in Durham, and what it's really like to be a student here.",
    deliverables: [
      "30-minute live Q&A session",
      "Honest answers about the program",
      "Tips for your Duke application"
    ],
    price: 50,
    duration: 30,
    delivery: SERVICE_DELIVERY.LIVE,
    isActive: true,
    bookingCount: 5,
    createdAt: "2024-11-15T00:00:00Z"
  },

  // Marcus Johnson's services (provider_002)
  {
    id: "service_004",
    providerId: "provider_002",
    type: SERVICE_TYPES.STRATEGY_SESSION,
    title: "Application Strategy for Career Changers",
    description: "If you're coming from a non-traditional background or making a career change, I can help you position your unique experience as a strength. We'll discuss school selection, timeline, and how to tell your story.",
    deliverables: [
      "45-minute strategy call",
      "Personalized school recommendations",
      "Timeline planning",
      "Follow-up email summary"
    ],
    price: 100,
    duration: 45,
    delivery: SERVICE_DELIVERY.LIVE,
    isActive: true,
    bookingCount: 12,
    createdAt: "2024-10-15T00:00:00Z"
  },
  {
    id: "service_005",
    providerId: "provider_002",
    type: SERVICE_TYPES.MOCK_INTERVIEW,
    title: "Behavioral Interview Prep",
    description: "Focus on the behavioral and situational questions that trip up most applicants. Learn the STAR method and practice with real scenarios from my interview experiences.",
    deliverables: [
      "60-minute live session",
      "STAR method training",
      "8-10 behavioral questions",
      "Verbal feedback during session"
    ],
    price: 110,
    duration: 60,
    delivery: SERVICE_DELIVERY.LIVE,
    isActive: true,
    bookingCount: 7,
    createdAt: "2024-10-20T00:00:00Z"
  },

  // Jessica Martinez's services (provider_003)
  {
    id: "service_006",
    providerId: "provider_003",
    type: SERVICE_TYPES.ESSAY_REVIEW,
    title: "Personal Statement Transformation",
    description: "Your personal statement is your chance to shine. I'll help you craft a compelling narrative that showcases your unique journey to anesthesia. Includes two rounds of review.",
    deliverables: [
      "First-round detailed feedback",
      "Second-round polish review",
      "Opening paragraph suggestions",
      "72-hour turnaround per round"
    ],
    price: 95,
    duration: null,
    delivery: SERVICE_DELIVERY.ASYNC,
    turnaroundHours: 72,
    isActive: true,
    bookingCount: 28,
    createdAt: "2024-09-01T00:00:00Z"
  },
  {
    id: "service_007",
    providerId: "provider_003",
    type: SERVICE_TYPES.MOCK_INTERVIEW,
    title: "West Coast Program Interview Prep",
    description: "Specifically tailored for UCSF, UCLA, USC, and other California programs. I know what these programs look for and the unique questions they ask.",
    deliverables: [
      "60-minute focused session",
      "Program-specific questions",
      "Tips for each school's culture",
      "Written summary"
    ],
    price: 140,
    duration: 60,
    delivery: SERVICE_DELIVERY.LIVE,
    isActive: true,
    bookingCount: 15,
    createdAt: "2024-09-15T00:00:00Z"
  },
  {
    id: "service_008",
    providerId: "provider_003",
    type: SERVICE_TYPES.STRATEGY_SESSION,
    title: "Comprehensive Application Review",
    description: "Let's look at your entire application package together. I'll review your stats, experience, and goals to help you build the strongest possible application.",
    deliverables: [
      "45-minute video call",
      "Holistic application assessment",
      "Weakness identification & mitigation",
      "Tailored action plan"
    ],
    price: 85,
    duration: 45,
    delivery: SERVICE_DELIVERY.LIVE,
    isActive: true,
    bookingCount: 13,
    createdAt: "2024-10-01T00:00:00Z"
  },

  // David Kim's services (provider_004)
  {
    id: "service_009",
    providerId: "provider_004",
    type: SERVICE_TYPES.RESUME_REVIEW,
    title: "Travel Nurse Resume Optimization",
    description: "Turn your diverse travel nursing experience into a compelling narrative. I'll help you organize multiple positions and highlight the skills that matter most.",
    deliverables: [
      "Complete resume restructure",
      "Travel experience positioning",
      "ATS-friendly formatting",
      "48-hour turnaround"
    ],
    price: 65,
    duration: null,
    delivery: SERVICE_DELIVERY.ASYNC,
    turnaroundHours: 48,
    isActive: true,
    bookingCount: 6,
    createdAt: "2024-11-20T00:00:00Z"
  },
  {
    id: "service_010",
    providerId: "provider_004",
    type: SERVICE_TYPES.SCHOOL_QA,
    title: "NYC Program Insider (Columbia)",
    description: "Everything you want to know about attending CRNA school in New York City. Cost of living, program culture, clinical sites, and more.",
    deliverables: [
      "30-minute live session",
      "NYC-specific advice",
      "Clinical site overview",
      "Housing/commute tips"
    ],
    price: 45,
    duration: 30,
    delivery: SERVICE_DELIVERY.LIVE,
    isActive: true,
    bookingCount: 4,
    createdAt: "2024-11-25T00:00:00Z"
  },

  // Amanda Thompson's services (provider_005)
  {
    id: "service_011",
    providerId: "provider_005",
    type: SERVICE_TYPES.STRATEGY_SESSION,
    title: "PICU to CRNA: Making the Transition",
    description: "Coming from pediatric ICU? I did too! Let me show you how to position your PICU experience and which programs are PICU-friendly.",
    deliverables: [
      "45-minute strategy call",
      "PICU-friendly program list",
      "Experience positioning guide",
      "Application timeline"
    ],
    price: 90,
    duration: 45,
    delivery: SERVICE_DELIVERY.LIVE,
    isActive: true,
    bookingCount: 8,
    createdAt: "2024-10-01T00:00:00Z"
  },
  {
    id: "service_012",
    providerId: "provider_005",
    type: SERVICE_TYPES.MOCK_INTERVIEW,
    title: "Southern Program Interview Prep",
    description: "Preparing for Vanderbilt, Emory, Duke, or other Southeast programs? Each region has its own culture. Let me help you prepare for what to expect.",
    deliverables: [
      "60-minute interview session",
      "Regional culture tips",
      "Common questions from each school",
      "Presentation coaching"
    ],
    price: 115,
    duration: 60,
    delivery: SERVICE_DELIVERY.LIVE,
    isActive: true,
    bookingCount: 6,
    createdAt: "2024-10-15T00:00:00Z"
  }
];

// Helper: Get services by provider
export function getServicesByProvider(providerId) {
  return mockServices.filter(s => s.providerId === providerId && s.isActive);
}

// Helper: Get service by ID
export function getServiceById(id) {
  return mockServices.find(s => s.id === id) || null;
}

// Helper: Get services by type
export function getServicesByType(type) {
  return mockServices.filter(s => s.type === type && s.isActive);
}

// Helper: Get popular services (by booking count)
export function getPopularServices(limit = 5) {
  return [...mockServices]
    .filter(s => s.isActive)
    .sort((a, b) => b.bookingCount - a.bookingCount)
    .slice(0, limit);
}

// Helper: Get price range for a provider
export function getProviderPriceRange(providerId) {
  const services = getServicesByProvider(providerId);
  if (services.length === 0) return { min: 0, max: 0 };

  const prices = services.map(s => s.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}
