/**
 * Mock Marketplace Provider Data
 *
 * Provider profiles for SRNAs offering mentoring services.
 *
 * TODO: Replace with API calls to:
 * - GET /api/marketplace/providers
 * - GET /api/marketplace/providers/:id
 */

export const BOOKING_MODELS = {
  INSTANT: 'instant',
  REQUIRES_CONFIRMATION: 'requires_confirmation'
};

export const CANCELLATION_POLICIES = {
  FLEXIBLE: 'flexible',      // Free cancel 24h before, 50% after
  MODERATE: 'moderate',      // Free cancel 3 days before, 50% after
  STRICT: 'strict'           // Free cancel 7 days before, no refund after
};

export const PROVIDER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  SUSPENDED: 'suspended',
  INACTIVE: 'inactive'
};

// SRNA Role Tags
// - srna_mentor: Verified SRNA engaging in community (no paid services)
// - srna_provider: Approved to offer paid services in marketplace
// Providers must have BOTH tags to sell services
export const SRNA_ROLES = {
  MENTOR: 'srna_mentor',     // Community participation, no paid services
  PROVIDER: 'srna_provider'  // Marketplace access, can sell services
};

export const mockProviders = [
  {
    id: "provider_001",
    userId: "user_srna_001",

    // SRNA Role Tags (must have both to be a provider)
    roles: [SRNA_ROLES.MENTOR, SRNA_ROLES.PROVIDER],

    // Profile
    name: "Sarah Chen",
    preferredName: "Sarah",
    tagline: "Making CVICU-to-SRNA transitions less scary!",
    avatarUrl: null,
    bio: "First-year SRNA at Duke University. Previously worked in CVICU for 4 years at Johns Hopkins. I love helping applicants prepare for interviews and understand what programs are really looking for. My specialty is mock interviews - I'll give you the tough questions and honest feedback!",

    // Personality (fun profile questions - major differentiator!)
    personality: {
      if_you_knew_me: "I drink way too much coffee and can talk about hemodynamics for hours",
      zodiac_sign: "Virgo",
      icu_vibe: "Organized chaos",
      cats_or_dogs: "Dogs 🐕",
      favorite_patient_population: "Post-CABG patients",
      road_trip_music: "True crime podcasts and 2000s pop",
      weird_fact: "I can name every Friends episode by the opening scene",
      comfort_food: "Pho",
      when_not_studying: "Hiking with my golden retriever",
      motto: "Done is better than perfect"
    },

    // Education & Background
    program: "Duke University",
    programId: "school_duke",
    programYear: 1, // 1, 2, or 3
    previousIcuType: "cvicu",
    yearsIcuExperience: 4,
    undergraduateSchool: "University of Maryland",

    // Specializations (tags for filtering)
    specializations: ["mock_interviews", "cvicu_experience", "essay_review"],

    // Provider Settings
    bookingModel: BOOKING_MODELS.INSTANT,
    instantBookEnabled: true,
    cancellationPolicy: CANCELLATION_POLICIES.FLEXIBLE,
    timezone: "America/New_York",
    videoCallLink: "https://zoom.us/j/1234567890",

    // Vacation/Pause mode
    isPaused: false,
    vacationStart: null,
    vacationEnd: null,
    vacationMessage: null,

    // Cal.com Integration (hidden from UI)
    calComUserId: "cal_abc123",
    calComConnectedAt: "2024-11-01T00:00:00Z",

    // Stripe Connect
    stripeConnectAccountId: "acct_1ABC123",
    stripeOnboardingComplete: true,
    commissionRate: 15.00, // Founding mentor rate

    // License verification
    licenseNumber: "RN123456",
    licenseState: "NC",

    // Stats
    rating: 4.9,
    reviewCount: 23,
    totalBookings: 31,
    responseTimeMinutes: 45, // Average response time

    // Status
    status: PROVIDER_STATUS.APPROVED,
    approvedAt: "2024-11-01T00:00:00Z",
    profileCompletionPercent: 100,

    // Availability indicator (calculated from Cal.com)
    availableThisWeek: true,
    nextAvailableSlot: "2024-12-10T18:00:00Z",

    // Timestamps
    createdAt: "2024-10-28T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z"
  },
  {
    id: "provider_002",
    userId: "user_srna_002",

    // SRNA Role Tags (must have both to be a provider)
    roles: [SRNA_ROLES.MENTOR, SRNA_ROLES.PROVIDER],

    name: "Marcus Johnson",
    preferredName: "Marcus",
    tagline: "From career changer to SRNA - let me help you too!",
    avatarUrl: null,
    bio: "Second-year SRNA at Emory. 5 years MICU/SICU experience at Grady Memorial. I've been through the application process recently and remember how stressful it can be. Let me help you navigate it! I specialize in helping career changers and those with non-traditional backgrounds.",

    // Personality
    personality: {
      if_you_knew_me: "I was an accountant before nursing - seriously!",
      zodiac_sign: "Aries",
      icu_vibe: "Teaching every moment",
      cats_or_dogs: "Both!",
      favorite_patient_population: "Sepsis patients - love the detective work",
      road_trip_music: "90s hip hop",
      weird_fact: "I can solve a Rubik's cube in under 2 minutes",
      comfort_food: "BBQ ribs",
      when_not_studying: "Playing basketball and video games",
      motto: "Your path doesn't have to be linear"
    },

    program: "Emory University",
    programId: "school_emory",
    programYear: 2,
    previousIcuType: "micu",
    yearsIcuExperience: 5,
    undergraduateSchool: "Georgia State University",

    specializations: ["career_changers", "non_traditional", "strategy_sessions"],

    bookingModel: BOOKING_MODELS.REQUIRES_CONFIRMATION,
    instantBookEnabled: false,
    cancellationPolicy: CANCELLATION_POLICIES.MODERATE,
    timezone: "America/New_York",
    videoCallLink: "https://meet.google.com/abc-defg-hij",

    // Vacation/Pause mode
    isPaused: false,
    vacationStart: null,
    vacationEnd: null,
    vacationMessage: null,

    calComUserId: "cal_def456",
    calComConnectedAt: "2024-10-15T00:00:00Z",

    stripeConnectAccountId: "acct_2DEF456",
    stripeOnboardingComplete: true,
    commissionRate: 15.00,

    // License verification
    licenseNumber: "RN654321",
    licenseState: "GA",

    rating: 4.7,
    reviewCount: 15,
    totalBookings: 19,
    responseTimeMinutes: 120,

    status: PROVIDER_STATUS.APPROVED,
    approvedAt: "2024-10-15T00:00:00Z",
    profileCompletionPercent: 95,

    availableThisWeek: true,
    nextAvailableSlot: "2024-12-11T14:00:00Z",

    createdAt: "2024-10-10T00:00:00Z",
    updatedAt: "2024-11-28T00:00:00Z"
  },
  {
    id: "provider_003",
    userId: "user_srna_003",

    // SRNA Role Tags (must have both to be a provider)
    roles: [SRNA_ROLES.MENTOR, SRNA_ROLES.PROVIDER],

    name: "Jessica Martinez",
    preferredName: "Jess",
    tagline: "Your personal statement can tell YOUR story beautifully",
    avatarUrl: null,
    bio: "Third-year SRNA at UCSF, graduating in May! I have 6 years of Neuro ICU experience at Stanford. I'm passionate about essay writing and can help you craft a compelling personal statement. Also happy to answer questions about West Coast programs.",

    // Personality
    personality: {
      if_you_knew_me: "I'm a total grammar nerd and I'm not sorry about it",
      zodiac_sign: "Pisces",
      icu_vibe: "Silent efficiency",
      cats_or_dogs: "Cats 🐱",
      favorite_patient_population: "Stroke patients - watching them recover is magical",
      road_trip_music: "Indie folk and chill beats",
      weird_fact: "I've read over 100 personal statements - yours will be #101!",
      comfort_food: "Tacos from the truck near my apartment",
      when_not_studying: "Writing, yoga, and beach walks",
      motto: "Show, don't tell"
    },

    program: "UCSF",
    programId: "school_ucsf",
    programYear: 3,
    previousIcuType: "neuro_icu",
    yearsIcuExperience: 6,
    undergraduateSchool: "UCLA",

    specializations: ["essay_review", "personal_statements", "west_coast_programs"],

    bookingModel: BOOKING_MODELS.INSTANT,
    instantBookEnabled: true,
    cancellationPolicy: CANCELLATION_POLICIES.STRICT,
    timezone: "America/Los_Angeles",
    videoCallLink: "https://zoom.us/j/9876543210",

    // Vacation/Pause mode - she's on vacation!
    isPaused: true,
    vacationStart: "2024-12-10",
    vacationEnd: "2024-12-15",
    vacationMessage: "Taking a quick study break before finals. Back on Dec 16!",

    calComUserId: "cal_ghi789",
    calComConnectedAt: "2024-09-01T00:00:00Z",

    stripeConnectAccountId: "acct_3GHI789",
    stripeOnboardingComplete: true,
    commissionRate: 20.00, // Standard rate

    // License verification
    licenseNumber: "RN789012",
    licenseState: "CA",

    rating: 5.0,
    reviewCount: 42,
    totalBookings: 56,
    responseTimeMinutes: 30,

    status: PROVIDER_STATUS.APPROVED,
    approvedAt: "2024-09-01T00:00:00Z",
    profileCompletionPercent: 100,

    availableThisWeek: false,
    nextAvailableSlot: "2024-12-16T10:00:00Z",

    createdAt: "2024-08-20T00:00:00Z",
    updatedAt: "2024-12-05T00:00:00Z"
  },
  {
    id: "provider_004",
    userId: "user_srna_004",

    // SRNA Role Tags (must have both to be a provider)
    roles: [SRNA_ROLES.MENTOR, SRNA_ROLES.PROVIDER],

    name: "David Kim",
    preferredName: "David",
    tagline: "5 hospitals, 4 ICU types, 1 CRNA dream - let's make yours happen",
    avatarUrl: null,
    bio: "First-year SRNA at Columbia. Former travel nurse with ICU experience across 5 different hospitals (MICU, CVICU, SICU). I can help you understand what different programs are looking for and how to position your unique background.",

    // Personality
    personality: {
      if_you_knew_me: "I've lived in 8 different cities in 4 years",
      zodiac_sign: "Sagittarius",
      icu_vibe: "Coffee-fueled heroics",
      cats_or_dogs: "Dogs 🐕",
      favorite_patient_population: "LVAD patients",
      road_trip_music: "K-pop and EDM",
      weird_fact: "I can pack my entire life into two suitcases",
      comfort_food: "Korean BBQ",
      when_not_studying: "Exploring NYC restaurants",
      motto: "Adaptability is a superpower"
    },

    program: "Columbia University",
    programId: "school_columbia",
    programYear: 1,
    previousIcuType: "micu",
    yearsIcuExperience: 4,
    undergraduateSchool: "NYU",

    specializations: ["travel_nurses", "multiple_icu_types", "resume_review"],

    bookingModel: BOOKING_MODELS.REQUIRES_CONFIRMATION,
    instantBookEnabled: false,
    cancellationPolicy: CANCELLATION_POLICIES.FLEXIBLE,
    timezone: "America/New_York",
    videoCallLink: "https://zoom.us/j/5555555555",

    // Vacation/Pause mode
    isPaused: false,
    vacationStart: null,
    vacationEnd: null,
    vacationMessage: null,

    calComUserId: "cal_jkl012",
    calComConnectedAt: "2024-11-20T00:00:00Z",

    stripeConnectAccountId: "acct_4JKL012",
    stripeOnboardingComplete: true,
    commissionRate: 15.00,

    // License verification
    licenseNumber: "RN345678",
    licenseState: "NY",

    rating: 4.8,
    reviewCount: 8,
    totalBookings: 10,
    responseTimeMinutes: 90,

    status: PROVIDER_STATUS.APPROVED,
    approvedAt: "2024-11-20T00:00:00Z",
    profileCompletionPercent: 90,

    availableThisWeek: true,
    nextAvailableSlot: "2024-12-09T19:00:00Z",

    createdAt: "2024-11-15T00:00:00Z",
    updatedAt: "2024-12-08T00:00:00Z"
  },
  {
    id: "provider_005",
    userId: "user_srna_005",

    // SRNA Role Tags (must have both to be a provider)
    roles: [SRNA_ROLES.MENTOR, SRNA_ROLES.PROVIDER],

    name: "Amanda Thompson",
    preferredName: "Amanda",
    tagline: "Yes, PICU nurses CAN become CRNAs - I'm proof!",
    avatarUrl: null,
    bio: "Second-year at Vanderbilt. Prior PICU nurse for 3 years - yes, you CAN get into CRNA school from PICU! Happy to share my journey and help others with pediatric backgrounds make the transition.",

    // Personality
    personality: {
      if_you_knew_me: "I still cry happy tears when my former PICU patients visit",
      zodiac_sign: "Cancer",
      icu_vibe: "Organized chaos",
      cats_or_dogs: "Neither - fish mom! 🐠",
      favorite_patient_population: "Peds cardiac - those tiny hearts are amazing",
      road_trip_music: "Country music and Broadway soundtracks",
      weird_fact: "I can quote the entire Frozen movie",
      comfort_food: "Hot chicken (Nashville style obviously)",
      when_not_studying: "Farmers markets and baking elaborate cakes",
      motto: "Every expert was once a beginner"
    },

    program: "Vanderbilt University",
    programId: "school_vanderbilt",
    programYear: 2,
    previousIcuType: "picu",
    yearsIcuExperience: 3,
    undergraduateSchool: "Belmont University",

    specializations: ["picu_background", "non_traditional", "southern_programs"],

    bookingModel: BOOKING_MODELS.INSTANT,
    instantBookEnabled: true,
    cancellationPolicy: CANCELLATION_POLICIES.MODERATE,
    timezone: "America/Chicago",
    videoCallLink: "https://meet.google.com/xyz-abcd-efg",

    // Vacation/Pause mode
    isPaused: false,
    vacationStart: null,
    vacationEnd: null,
    vacationMessage: null,

    calComUserId: "cal_mno345",
    calComConnectedAt: "2024-10-01T00:00:00Z",

    stripeConnectAccountId: "acct_5MNO345",
    stripeOnboardingComplete: true,
    commissionRate: 20.00,

    // License verification
    licenseNumber: "RN901234",
    licenseState: "TN",

    rating: 4.6,
    reviewCount: 11,
    totalBookings: 14,
    responseTimeMinutes: 60,

    status: PROVIDER_STATUS.APPROVED,
    approvedAt: "2024-10-01T00:00:00Z",
    profileCompletionPercent: 85,

    availableThisWeek: true,
    nextAvailableSlot: "2024-12-10T16:00:00Z",

    createdAt: "2024-09-25T00:00:00Z",
    updatedAt: "2024-12-02T00:00:00Z"
  }
];

// Pending provider applications (for admin dashboard)
export const mockPendingProviders = [
  {
    id: "provider_pending_001",
    userId: "user_srna_pending_001",
    name: "Tyler Robinson",
    email: "tyler.r@email.com",
    program: "Mayo Clinic",
    programYear: 1,
    previousIcuType: "trauma_icu",
    yearsIcuExperience: 5,
    status: PROVIDER_STATUS.PENDING,
    submittedAt: "2024-12-07T10:00:00Z",
    idVerificationStatus: "verified", // verified, pending, failed
    eduVerificationStatus: "pending", // verified, pending, failed
    applicationNotes: "Strong background, waiting on .edu email verification"
  },
  {
    id: "provider_pending_002",
    userId: "user_srna_pending_002",
    name: "Rachel Liu",
    email: "rachel.liu@email.com",
    program: "University of Pittsburgh",
    programYear: 2,
    previousIcuType: "cvicu",
    yearsIcuExperience: 4,
    status: PROVIDER_STATUS.PENDING,
    submittedAt: "2024-12-08T14:30:00Z",
    idVerificationStatus: "verified",
    eduVerificationStatus: "verified",
    applicationNotes: null
  }
];

// Helper: Check if user has required roles to be a provider
export function isValidProvider(roles) {
  return roles?.includes(SRNA_ROLES.MENTOR) && roles?.includes(SRNA_ROLES.PROVIDER);
}

// Helper: Get provider by ID
export function getProviderById(id) {
  return mockProviders.find(p => p.id === id) || null;
}

// Helper: Get providers by program
export function getProvidersByProgram(programId) {
  return mockProviders.filter(p => p.programId === programId && p.status === PROVIDER_STATUS.APPROVED);
}

// Helper: Get top-rated providers
export function getTopRatedProviders(limit = 5) {
  return [...mockProviders]
    .filter(p => p.status === PROVIDER_STATUS.APPROVED)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

// Helper: Get available providers this week
export function getAvailableProvidersThisWeek() {
  return mockProviders.filter(p =>
    p.status === PROVIDER_STATUS.APPROVED && p.availableThisWeek
  );
}
