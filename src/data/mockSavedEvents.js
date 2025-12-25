/**
 * Mock data for saved/RSVP'd events
 * Events from the browse events page that users have saved
 *
 * Includes:
 * - Past events (ready to log)
 * - Future events (coming up)
 * - Program-specific events (linked via schoolId)
 * - CRNA Club platform events
 *
 * TODO: Replace with API call to GET /api/user/saved-events
 */

export const mockSavedEvents = [
  // PAST EVENTS (Ready to Log - not yet logged)
  {
    id: 'saved_evt_001',
    title: 'Georgetown CRNA Program Info Session',
    date: '2025-11-20',
    category: 'info_session',
    location: 'Virtual (Zoom)',
    schoolId: 'school_001', // Links to Georgetown target program
    schoolName: 'Georgetown University',
    savedAt: '2025-11-01T00:00:00Z',
    logged: false,
    source: 'school_event', // school_event, crna_club, aana
  },
  {
    id: 'saved_evt_002',
    title: 'Texas AANA State Assembly',
    date: '2025-11-15',
    category: 'aana_state_meeting',
    location: 'Austin, TX',
    schoolId: null,
    schoolName: null,
    savedAt: '2025-10-20T00:00:00Z',
    logged: false,
    source: 'aana',
  },
  {
    id: 'saved_evt_003',
    title: 'CRNA Club November Q&A with SRNAs',
    date: '2025-11-08',
    category: 'crna_club_event',
    location: 'Virtual (Zoom)',
    schoolId: null,
    schoolName: null,
    savedAt: '2025-11-01T00:00:00Z',
    logged: false,
    source: 'crna_club',
  },

  // FUTURE EVENTS (Coming Up)
  {
    id: 'saved_evt_004',
    title: 'Duke CRNA Program Open House',
    date: '2026-01-15',
    category: 'open_house',
    location: 'Durham, NC',
    schoolId: 'school_006', // Links to Duke (saved program)
    schoolName: 'Duke University',
    savedAt: '2025-11-25T00:00:00Z',
    logged: false,
    source: 'school_event',
  },
  {
    id: 'saved_evt_005',
    title: 'CRNA Club December Monthly Q&A',
    date: '2025-12-12',
    category: 'crna_club_event',
    location: 'Virtual (Zoom)',
    schoolId: null,
    schoolName: null,
    savedAt: '2025-11-28T00:00:00Z',
    logged: false,
    source: 'crna_club',
  },
  {
    id: 'saved_evt_006',
    title: 'Columbia University Virtual Info Session',
    date: '2026-01-08',
    category: 'info_session',
    location: 'Virtual (Webex)',
    schoolId: 'school_008', // Links to Columbia (saved program)
    schoolName: 'Columbia University',
    savedAt: '2025-11-22T00:00:00Z',
    logged: false,
    source: 'school_event',
  },
  {
    id: 'saved_evt_007',
    title: 'AANA Mid-Year Assembly 2026',
    date: '2026-05-20',
    category: 'aana_national_meeting',
    location: 'Washington, DC',
    schoolId: null,
    schoolName: null,
    savedAt: '2025-11-15T00:00:00Z',
    logged: false,
    source: 'aana',
  },
  {
    id: 'saved_evt_008',
    title: 'Cedar Crest Virtual Campus Tour',
    date: '2026-02-10',
    category: 'info_session',
    location: 'Virtual',
    schoolId: 'school_002', // Links to Cedar Crest (target program)
    schoolName: 'Cedar Crest College',
    savedAt: '2025-11-20T00:00:00Z',
    logged: false,
    source: 'school_event',
  },
];

/**
 * Pre-event preparation tips based on event category and linked program
 * TODO: In production, these would be AI-generated based on program requirements
 */
export const PRE_EVENT_TIPS = {
  open_house: [
    'Review the program\'s admission requirements beforehand',
    'Prepare 2-3 specific questions about clinical rotations',
    'Bring a notebook to take notes on key information',
    'Ask about class size and student-to-faculty ratio',
    'Inquire about clinical site locations and specialties',
  ],
  info_session: [
    'Review the program\'s website and curriculum',
    'Prepare questions about prerequisites you\'re unsure about',
    'Ask about application timeline and deadlines',
    'Find out about financial aid and scholarship opportunities',
  ],
  aana_state_meeting: [
    'Bring business cards or contact info to share',
    'Research which CRNA programs will have booths',
    'Prepare your "30-second story" about why you want to be a CRNA',
    'Ask practicing CRNAs about their favorite aspects of the job',
  ],
  aana_national_meeting: [
    'Plan which program booths you want to visit',
    'Schedule time for both educational sessions and networking',
    'Bring copies of your resume',
    'Connect with SRNAs from programs you\'re interested in',
  ],
  crna_club_event: [
    'Prepare specific questions you want answered',
    'Be ready to network with other applicants',
    'Take notes on advice from SRNAs and CRNAs',
  ],
  networking: [
    'Research the person\'s background if known',
    'Prepare thoughtful questions about their journey',
    'Ask for specific advice relevant to your situation',
    'Follow up with a thank-you message within 24 hours',
  ],
};

/**
 * Get pre-event preparation tips for an event
 * @param {Object} event - The saved event object
 * @param {Object} [programRequirements] - Optional program requirements for targeted tips
 * @returns {string[]} Array of preparation tips
 */
export function getPreEventTips(event, programRequirements = null) {
  const categoryTips = PRE_EVENT_TIPS[event.category] || PRE_EVENT_TIPS.networking;

  // If linked to a program, add program-specific tips
  if (event.schoolId && programRequirements) {
    const programTips = [];

    if (programRequirements.gre === 'required') {
      programTips.push(`Ask about GRE score expectations for ${event.schoolName}`);
    }
    if (programRequirements.shadowingRequired) {
      programTips.push(`Inquire about shadow day opportunities at ${event.schoolName}`);
    }
    if (programRequirements.ccrn === 'required') {
      programTips.push('Ask about certification timing relative to application');
    }

    return [...programTips, ...categoryTips].slice(0, 5);
  }

  return categoryTips;
}

/**
 * Suggested events for smart recommendations
 * These are events the user hasn't saved yet but might be interested in
 * based on their target programs, location, and application goals.
 *
 * TODO: Replace with API call to GET /api/events/suggested
 */
export const mockSuggestedEvents = {
  // Events from target programs (highest priority)
  targetProgramEvents: [
    {
      id: 'suggested_001',
      title: 'Georgetown CRNA Spring Virtual Q&A',
      date: '2026-03-15',
      category: 'info_session',
      location: 'Virtual (Zoom)',
      isVirtual: true,
      schoolId: 'school_001',
      schoolName: 'Georgetown University',
      source: 'school_event',
    },
    {
      id: 'suggested_002',
      title: 'Cedar Crest Open House',
      date: '2026-04-05',
      category: 'open_house',
      location: 'Allentown, PA',
      isVirtual: false,
      schoolId: 'school_002',
      schoolName: 'Cedar Crest College',
      source: 'school_event',
    },
  ],

  // High-value networking events (AANA, major conferences)
  highValueEvents: [
    {
      id: 'suggested_003',
      title: 'AANA Annual Congress 2026',
      date: '2026-08-15',
      category: 'aana_national_meeting',
      location: 'Chicago, IL',
      isVirtual: false,
      schoolId: null,
      schoolName: null,
      source: 'aana',
    },
    {
      id: 'suggested_004',
      title: 'Texas AANA Spring Meeting',
      date: '2026-04-20',
      category: 'aana_state_meeting',
      location: 'Dallas, TX',
      isVirtual: false,
      schoolId: null,
      schoolName: null,
      source: 'aana',
    },
  ],

  // Virtual events (easy to attend)
  virtualEvents: [
    {
      id: 'suggested_005',
      title: 'Duke CRNA Virtual Info Session',
      date: '2025-12-20',
      category: 'info_session',
      location: 'Virtual (Webex)',
      isVirtual: true,
      schoolId: 'school_006',
      schoolName: 'Duke University',
      source: 'school_event',
    },
    {
      id: 'suggested_006',
      title: 'CRNA Club: Ask Me Anything with Program Directors',
      date: '2025-12-05',
      category: 'crna_club_event',
      location: 'Virtual (Zoom)',
      isVirtual: true,
      schoolId: null,
      schoolName: null,
      source: 'crna_club',
    },
    {
      id: 'suggested_007',
      title: 'Rush University Virtual Tour & Q&A',
      date: '2026-01-15',
      category: 'info_session',
      location: 'Virtual',
      isVirtual: true,
      schoolId: 'school_007',
      schoolName: 'Rush University',
      source: 'school_event',
    },
  ],

  // Nearby events (would be filtered by user location in production)
  nearbyEvents: [],
};
