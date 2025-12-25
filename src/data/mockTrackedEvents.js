/**
 * Mock data for tracked/logged events
 * Events that users have attended and logged with notes
 *
 * Enhanced with:
 * - structuredNotes: Guided note prompts (learned, peopleMet, standout, wouldApply, general)
 * - contacts: Parsed contacts from peopleMet for touchpoint tracking
 * - talkingPoints: AI-generated interview talking points
 * - schoolId: Links to target/saved programs for engagement tracking
 *
 * TODO: Replace with API call to GET /api/user/tracked-events
 */

// Event categories as defined in data-shapes.md
export const EVENT_CATEGORIES = [
  { value: 'aana_state_meeting', label: 'AANA State Meeting' },
  { value: 'aana_national_meeting', label: 'AANA National Meeting' },
  { value: 'crna_club_event', label: 'CRNA Club Event' },
  { value: 'open_house', label: 'Open House' },
  { value: 'info_session', label: 'Info Session' },
  { value: 'networking', label: 'Networking' },
  { value: 'other', label: 'Other' },
];

// Helper to get label from category value
export function getCategoryLabel(value) {
  const category = EVENT_CATEGORIES.find((c) => c.value === value);
  return category ? category.label : value;
}

// Mock tracked events data with enhanced fields
export const mockTrackedEvents = [
  {
    id: '1',
    title: 'Texas AANA State Assembly',
    date: '2025-11-15',
    category: 'aana_state_meeting',
    location: 'Austin, TX',
    schoolId: null, // Not program-specific
    schoolName: null,

    // Legacy notes field (kept for backwards compatibility)
    notes:
      'Great networking opportunity. Met 3 CRNAs from local hospitals. Got advice on application timing.',

    // NEW: Structured notes for guided prompts
    structuredNotes: {
      learned:
        'Learned about Opt Out states and how scope of practice varies significantly by region. Texas has great autonomy for CRNAs.',
      peopleMet:
        'Dr. Temmermand (TANA President), Sarah Martinez (SRNA at UT Health San Antonio), Mike Chen (CRNA at Methodist Hospital)',
      standout:
        'The networking was incredible - met SRNAs from 5 different programs who gave honest feedback about their experiences.',
      wouldApply: null, // N/A for non-program events
      general:
        'Great event! Will definitely attend again next year. The vendor expo was also helpful for learning about equipment.',
    },

    // NEW: Parsed contacts for touchpoint tracking
    contacts: [
      {
        name: 'Dr. Temmermand',
        role: 'TANA President',
        school: null,
        email: null,
      },
      {
        name: 'Sarah Martinez',
        role: 'SRNA',
        school: 'UT Health San Antonio',
        email: null,
      },
      {
        name: 'Mike Chen',
        role: 'CRNA',
        school: null,
        email: null,
      },
    ],

    // NEW: AI-generated talking points for interviews
    talkingPoints:
      "I attended the Texas AANA State Assembly where I had the opportunity to network with practicing CRNAs and current SRNAs from multiple programs. I learned about the differences in scope of practice across states and Texas's strong support for CRNA autonomy. Speaking with the TANA President gave me insight into ongoing advocacy efforts in the profession, which reinforced my commitment to becoming actively involved in professional organizations.",

    tags: ['aana_state_meeting'],
  },
  {
    id: '2',
    title: 'Georgetown University Info Session',
    date: '2025-11-10',
    category: 'info_session',
    location: 'Virtual (Zoom)',
    schoolId: 'school_001', // Links to Georgetown target
    schoolName: 'Georgetown University',

    notes:
      'Learned about their simulation lab and clinical rotations. Application opens January 15th.',

    structuredNotes: {
      learned:
        'They have 10 clinical sites in the DC metro area. Strong emphasis on cardiac and trauma rotations. Class size is 32 students.',
      peopleMet:
        'Dr. Williams (Program Director), Amanda Foster (Admissions Coordinator), Current SRNA cohort members via Q&A',
      standout:
        'The program has a dedicated simulation lab that students can access 24/7. Their board pass rate has been 100% for 3 years.',
      wouldApply:
        'Yes - the location is ideal for my family situation, and the clinical site variety is impressive.',
      general:
        'Very organized info session. The faculty seemed genuinely invested in student success. DC location is a plus for networking opportunities.',
    },

    contacts: [
      {
        name: 'Dr. Williams',
        role: 'Program Director',
        school: 'Georgetown University',
        email: 'williams@georgetown.edu',
      },
      {
        name: 'Amanda Foster',
        role: 'Admissions Coordinator',
        school: 'Georgetown University',
        email: 'adfoster@georgetown.edu',
      },
    ],

    talkingPoints:
      "I attended Georgetown's virtual info session and was impressed by their 100% board pass rate over the last three years. Speaking with Dr. Williams, the Program Director, I learned about their 10 clinical sites across the DC metro area with strong cardiac and trauma rotations. The 24/7 simulation lab access demonstrates their commitment to hands-on learning. The class size of 32 feels ideal for personalized attention while still having a strong cohort community.",

    tags: ['info_session'],
  },
  {
    id: '3',
    title: 'CRNA Club Monthly Q&A',
    date: '2025-11-08',
    category: 'crna_club_event',
    location: 'Zoom',
    schoolId: null,
    schoolName: null,

    notes: 'Asked about GRE waivers and got great tips from SRNAs.',

    structuredNotes: {
      learned:
        'Many programs are moving away from GRE requirements. Focus more on clinical experience quality than quantity.',
      peopleMet:
        'Multiple SRNAs from different programs answered questions. Didn\'t get specific names but connected on the CRNA Club community.',
      standout:
        'The advice about focusing on ICU experience "quality over quantity" really resonated - it\'s not just about years, but the variety of cases.',
      wouldApply: null,
      general:
        'These monthly sessions are gold for applicants. Real, honest answers from people who recently went through the process.',
    },

    contacts: [],

    talkingPoints:
      "Through CRNA Club's monthly Q&A sessions, I've gained valuable insights from current SRNAs about the application process. I learned that programs increasingly value quality of ICU experience over quantity - the variety of patient populations and acuity levels matters more than simply meeting minimum years. This has helped me be more intentional about seeking diverse clinical opportunities.",

    tags: ['crna_club_event'],
  },
  {
    id: '4',
    title: 'Coffee Chat with Local CRNA',
    date: '2025-11-01',
    category: 'networking',
    location: 'Houston, TX',
    schoolId: null,
    schoolName: null,

    notes:
      'Dr. Smith gave me insights on what programs look for. Offered to write a LOR!',

    structuredNotes: {
      learned:
        'Programs want to see initiative and genuine curiosity. Asking good questions during shadow days makes a big impression.',
      peopleMet: 'Dr. Rebecca Smith, CRNA at Houston Methodist - 15 years experience, Duke graduate',
      standout:
        'She offered to write me a letter of recommendation! Also introduced me to two other CRNAs at her practice.',
      wouldApply: null,
      general:
        'This coffee chat was invaluable. Real-world perspective from someone who has been on interview committees. Follow up with thank you note sent.',
    },

    contacts: [
      {
        name: 'Dr. Rebecca Smith',
        role: 'CRNA',
        school: 'Duke (Graduate)',
        email: 'rsmith@houstonmethodist.org',
      },
    ],

    talkingPoints:
      "I proactively reached out to Dr. Rebecca Smith, a CRNA with 15 years of experience and Duke graduate, for a coffee chat about the profession. She shared that programs value initiative and genuine curiosity, particularly how applicants engage during shadow experiences. This conversation reinforced my approach of asking thoughtful questions and being actively engaged during clinical observations. She was so impressed by our conversation that she offered to write me a letter of recommendation.",

    tags: ['networking'],
  },
  {
    id: '5',
    title: 'AANA Congress 2025',
    date: '2025-10-25',
    category: 'aana_national_meeting',
    location: 'New Orleans, LA',
    schoolId: null,
    schoolName: null,

    notes:
      'Attended 3 days. Visited 8 program booths. Collected contact info for follow-up.',

    structuredNotes: {
      learned:
        'Huge variation in program structures - integrated vs front-loaded. Some programs have unique specialization tracks.',
      peopleMet:
        'Reps from Duke, Columbia, Georgetown, Rush, Emory, UT Health, Vanderbilt, and Wake Forest. Too many to list all names.',
      standout:
        'The exhibit hall was overwhelming but so valuable. Got to compare programs side-by-side and ask the same questions to each.',
      wouldApply: null,
      general:
        'Best investment I made this year. Three full days of immersion in the CRNA world. Made lasting connections.',
    },

    contacts: [
      { name: 'Duke Rep', role: 'Program Representative', school: 'Duke University', email: null },
      { name: 'Georgetown Rep', role: 'Program Representative', school: 'Georgetown University', email: null },
      { name: 'Columbia Rep', role: 'Program Representative', school: 'Columbia University', email: null },
    ],

    talkingPoints:
      "I attended the 2025 AANA Congress where I visited 8 different program booths over three days, including Duke, Columbia, Georgetown, and Emory. This allowed me to compare program structures side-by-side and understand the differences between integrated and front-loaded curricula. The experience helped me refine my target program list and gave me direct contacts at each school for follow-up questions.",

    tags: ['aana_national_meeting'],
  },
  {
    id: '6',
    title: 'University of Miami Info Session',
    date: '2025-10-20',
    category: 'info_session',
    location: 'Virtual',
    schoolId: null, // Not in user's saved programs
    schoolName: 'University of Miami',

    notes: 'Program director answered questions about their integrated curriculum.',

    structuredNotes: {
      learned:
        'Their integrated DNP curriculum includes leadership courses throughout. Strong focus on evidence-based practice.',
      peopleMet: 'Dr. Garcia (Program Director), Two current SRNAs who shared their experiences',
      standout:
        'They have clinical sites in both Miami and Fort Lauderdale, offering diverse patient populations including a large Spanish-speaking community.',
      wouldApply:
        'Maybe - the program looks strong but Florida location would require relocation. Need to consider family factors.',
      general:
        'Good info session but realized the location might not work for my situation. Still valuable to learn about their approach.',
    },

    contacts: [
      {
        name: 'Dr. Garcia',
        role: 'Program Director',
        school: 'University of Miami',
        email: null,
      },
    ],

    talkingPoints:
      "I attended the University of Miami's info session to learn about their integrated DNP curriculum. Dr. Garcia explained their emphasis on evidence-based practice and leadership development throughout the program. While the program has excellent clinical sites serving diverse patient populations, I determined that the location doesn't align with my current family situation, which helped me focus my applications on programs in more suitable locations.",

    tags: ['info_session'],
  },
];

// Get stats from events
export function getEventStats(events) {
  const totalEvents = events.length;

  // Count by category
  const categoryCount = events.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {});

  // Find most common category
  let topCategory = null;
  let topCount = 0;
  Object.entries(categoryCount).forEach(([category, count]) => {
    if (count > topCount) {
      topCategory = category;
      topCount = count;
    }
  });

  // Events this month
  const now = new Date();
  const thisMonth = events.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getMonth() === now.getMonth() &&
      eventDate.getFullYear() === now.getFullYear()
    );
  }).length;

  // Total contacts made
  const totalContacts = events.reduce((acc, event) => {
    return acc + (event.contacts?.length || 0);
  }, 0);

  // Programs engaged (unique schools from events)
  const programsEngaged = new Set(
    events.filter((e) => e.schoolId).map((e) => e.schoolId)
  ).size;

  return {
    totalEvents,
    topCategory: topCategory ? getCategoryLabel(topCategory) : 'None',
    thisMonth,
    categoryCount,
    totalContacts,
    programsEngaged,
  };
}

/**
 * Get events for a specific program
 * @param {Object[]} events - Array of tracked events
 * @param {string} schoolId - The school/program ID
 * @returns {Object[]} Events for that program
 */
export function getEventsForProgram(events, schoolId) {
  return events.filter((e) => e.schoolId === schoolId);
}

/**
 * Get all contacts from events, optionally filtered by school
 * @param {Object[]} events - Array of tracked events
 * @param {string} [schoolId] - Optional school ID to filter by
 * @returns {Object[]} Array of contacts
 */
export function getContactsFromEvents(events, schoolId = null) {
  const filteredEvents = schoolId
    ? events.filter((e) => e.schoolId === schoolId)
    : events;

  return filteredEvents.flatMap((e) => e.contacts || []);
}
