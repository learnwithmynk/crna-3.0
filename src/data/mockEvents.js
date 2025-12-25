/**
 * Mock data for the Events page
 * Includes AANA State Meetings, AANA National Meetings, and CRNA Club Events
 *
 * TODO: Replace with API call to GET /api/events
 */

/**
 * Event categories for filtering
 */
export const EVENT_CATEGORIES = {
  aana_state_meeting: {
    value: 'aana_state_meeting',
    label: 'AANA State Meeting',
    description: 'State chapter meetings and conferences',
  },
  aana_national_meeting: {
    value: 'aana_national_meeting',
    label: 'AANA National Meeting',
    description: 'National AANA conferences and assemblies',
  },
  crna_club_event: {
    value: 'crna_club_event',
    label: 'CRNA Club Event',
    description: 'Internal CRNA Club events and webinars',
  },
  school_open_house: {
    value: 'school_open_house',
    label: 'Program Open House',
    description: 'In-person or virtual open house events hosted by CRNA programs',
  },
  school_info_session: {
    value: 'school_info_session',
    label: 'Program Info Session',
    description: 'Information sessions and Q&A events hosted by CRNA programs',
  },
};

/**
 * Event sources - where the event originates from
 */
export const EVENT_SOURCES = {
  aana: {
    value: 'aana',
    label: 'AANA',
    description: 'American Association of Nurse Anesthesiology events',
  },
  crna_club: {
    value: 'crna_club',
    label: 'CRNA Club',
    description: 'Internal CRNA Club events',
  },
  school: {
    value: 'school',
    label: 'Program',
    description: 'Events hosted by CRNA programs',
  },
};

/**
 * US States for filtering
 */
export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' },
];

/**
 * Master events list
 */
export const mockEvents = [
  // SCHOOL INFO SESSIONS (from screenshots)
  {
    id: 'event_001',
    title: 'Wayne State Nurse Anesthesia Informational Meeting (November 2025)',
    description: "You'll hear a little bit of the history of the program, as well as what currently makes our program unique. Get a feel for what the incoming class application statistics looks like, as well as have an opportunity to connect with current students.",
    date: '2025-12-10',
    time: '17:00',
    timezone: 'America/Detroit',
    category: 'school_info_session',
    source: 'school',
    imageUrl: '/images/schools/wayne-state.png',
    location: 'Virtual (Zoom)',
    isVirtual: true,
    externalUrl: 'https://www.aana.com/membership/state-associations/michigan',
    rsvpUrl: null,
    hostedBy: null,
    schoolId: 'wayne_state',
    schoolName: 'Wayne State',
    state: 'MI',
    pointsValue: 0,
    attendanceWebhookId: null,
  },
  {
    id: 'event_002',
    title: 'USM NAP Face-to-face and Virtual Information Session (March 2026)',
    description: 'These sessions provide an opportunity to learn about the program, tour the facilities, and ask questions about the application process. Meet current students and faculty members who can share their experiences.',
    date: '2026-03-02',
    time: '18:00',
    timezone: 'America/Chicago',
    category: 'school_info_session',
    source: 'school',
    imageUrl: '/images/schools/usm.png',
    location: 'Hattiesburg, MS',
    isVirtual: false,
    externalUrl: 'https://www.aana.com/membership/state-associations/mississippi',
    rsvpUrl: null,
    hostedBy: null,
    schoolId: 'usm',
    schoolName: 'University of Southern Mississippi',
    state: 'MS',
    pointsValue: 0,
    attendanceWebhookId: null,
  },
  {
    id: 'event_003',
    title: 'TXWes CRNA Online Information Session VI',
    description: "Ready to start your career as a CRNA? Sign up for the next online info session and learn more about going back to school, the application process, and what it's like to be an SRNA at Texas Wesleyan.",
    date: '2025-12-10',
    time: '13:00',
    timezone: 'America/Chicago',
    category: 'school_info_session',
    source: 'school',
    imageUrl: '/images/schools/texas-wesleyan.png',
    location: 'Virtual',
    isVirtual: true,
    externalUrl: 'https://txwes.edu/crna-info-session',
    rsvpUrl: null,
    hostedBy: null,
    schoolId: 'texas_wesleyan',
    schoolName: 'Texas Wesleyan',
    state: 'TX',
    pointsValue: 0,
    attendanceWebhookId: null,
  },
  {
    id: 'event_004',
    title: 'Michigan Association of Nurse Anesthetists Annual Meeting',
    description: 'Join fellow CRNAs and SRNAs from across Michigan for our annual state meeting. Network with practicing professionals, attend educational sessions, and learn about the latest in anesthesia practice.',
    date: '2026-04-15',
    time: '08:00',
    timezone: 'America/Detroit',
    category: 'aana_state_meeting',
    source: 'aana',
    imageUrl: '/images/aana/michigan-aana.png',
    location: 'Grand Rapids, MI',
    isVirtual: false,
    externalUrl: 'https://www.aana.com/membership/state-associations/michigan',
    rsvpUrl: null,
    hostedBy: null,
    schoolId: null,
    schoolName: null,
    state: 'MI',
    pointsValue: 0,
    attendanceWebhookId: null,
  },
  {
    id: 'event_005',
    title: 'Texas Association of Nurse Anesthetists Spring Conference',
    description: 'The TANA Spring Conference brings together nurse anesthetists from across Texas for education, networking, and advocacy. Perfect opportunity to meet program representatives and learn about the profession.',
    date: '2026-03-20',
    time: '09:00',
    timezone: 'America/Chicago',
    category: 'aana_state_meeting',
    source: 'aana',
    imageUrl: '/images/aana/texas-aana.png',
    location: 'Austin, TX',
    isVirtual: false,
    externalUrl: 'https://www.aana.com/membership/state-associations/texas',
    rsvpUrl: null,
    hostedBy: null,
    schoolId: null,
    schoolName: null,
    state: 'TX',
    pointsValue: 0,
    attendanceWebhookId: null,
  },
  {
    id: 'event_006',
    title: 'California Association of Nurse Anesthetists Annual Meeting',
    description: 'CANA annual meeting featuring educational sessions, vendor exhibits, and networking opportunities. A great chance to connect with CRNAs and learn about California programs.',
    date: '2026-05-10',
    time: '08:00',
    timezone: 'America/Los_Angeles',
    category: 'aana_state_meeting',
    source: 'aana',
    imageUrl: '/images/aana/california-aana.png',
    location: 'San Diego, CA',
    isVirtual: false,
    externalUrl: 'https://www.aana.com/membership/state-associations/california',
    rsvpUrl: null,
    hostedBy: null,
    schoolId: null,
    schoolName: null,
    state: 'CA',
    pointsValue: 0,
    attendanceWebhookId: null,
  },

  // AANA NATIONAL MEETINGS
  {
    id: 'event_007',
    title: 'AANA Mid-Year Assembly 2026',
    description: 'The AANA Mid-Year Assembly brings together nurse anesthetists from across the country for legislative advocacy, education, and networking. Meet with your representatives and learn about current policy issues affecting the profession.',
    date: '2026-04-25',
    time: '08:00',
    timezone: 'America/New_York',
    category: 'aana_national_meeting',
    source: 'aana',
    imageUrl: '/images/aana/aana-national.png',
    location: 'Washington, DC',
    isVirtual: false,
    externalUrl: 'https://www.aana.com/meetings-events/mid-year-assembly',
    rsvpUrl: null,
    hostedBy: null,
    schoolId: null,
    schoolName: null,
    state: 'DC',
    pointsValue: 0,
    attendanceWebhookId: null,
  },
  {
    id: 'event_008',
    title: 'AANA Annual Congress 2026',
    description: 'The premier educational and networking event for nurse anesthetists. Featuring hundreds of educational sessions, a massive exhibit hall with all major programs represented, and unparalleled networking opportunities.',
    date: '2026-08-15',
    time: '08:00',
    timezone: 'America/Chicago',
    category: 'aana_national_meeting',
    source: 'aana',
    imageUrl: '/images/aana/aana-national.png',
    location: 'Chicago, IL',
    isVirtual: false,
    externalUrl: 'https://www.aana.com/meetings-events/annual-congress',
    rsvpUrl: null,
    hostedBy: null,
    schoolId: null,
    schoolName: null,
    state: 'IL',
    pointsValue: 0,
    attendanceWebhookId: null,
  },

  // CRNA CLUB EVENTS
  {
    id: 'event_009',
    title: 'CRNA Club Monthly Q&A with SRNAs - December',
    description: 'Join us for our monthly live Q&A session with current SRNA students from various programs. Ask questions about the application process, school life, clinical rotations, and more. This is a members-only event.',
    date: '2025-12-15',
    time: '19:00',
    timezone: 'America/New_York',
    category: 'crna_club_event',
    source: 'crna_club',
    imageUrl: '/images/crna-club/monthly-qa.png',
    location: 'Virtual (Zoom)',
    isVirtual: true,
    externalUrl: null,
    rsvpUrl: 'https://us02web.zoom.us/webinar/register/WN_example1',
    hostedBy: 'The CRNA Club Team',
    schoolId: null,
    schoolName: null,
    state: null,
    pointsValue: 50,
    attendanceWebhookId: 'zoom_webhook_001',
  },
  {
    id: 'event_010',
    title: 'Application Essay Workshop',
    description: 'Learn how to craft a compelling personal statement for your CRNA school applications. Our expert panel will share tips, review common mistakes, and provide guidance on what admissions committees look for.',
    date: '2025-12-20',
    time: '18:00',
    timezone: 'America/New_York',
    category: 'crna_club_event',
    source: 'crna_club',
    imageUrl: '/images/crna-club/essay-workshop.png',
    location: 'Virtual (Zoom)',
    isVirtual: true,
    externalUrl: null,
    rsvpUrl: 'https://us02web.zoom.us/webinar/register/WN_example2',
    hostedBy: 'Sarah Johnson, SRNA',
    schoolId: null,
    schoolName: null,
    state: null,
    pointsValue: 75,
    attendanceWebhookId: 'zoom_webhook_002',
  },
  {
    id: 'event_011',
    title: 'Mock Interview Practice Session',
    description: 'Practice your interview skills with real SRNA students and recent graduates. Get feedback on your responses, learn about common interview questions, and build confidence before your actual interviews.',
    date: '2026-01-10',
    time: '19:00',
    timezone: 'America/New_York',
    category: 'crna_club_event',
    source: 'crna_club',
    imageUrl: '/images/crna-club/mock-interview.png',
    location: 'Virtual (Zoom)',
    isVirtual: true,
    externalUrl: null,
    rsvpUrl: 'https://us02web.zoom.us/webinar/register/WN_example3',
    hostedBy: 'Michael Chen, CRNA',
    schoolId: null,
    schoolName: null,
    state: null,
    pointsValue: 100,
    attendanceWebhookId: 'zoom_webhook_003',
  },
  {
    id: 'event_012',
    title: 'CRNA Club Monthly Q&A with SRNAs - January',
    description: 'Start the new year right with our monthly live Q&A session. Connect with current SRNA students, ask questions, and get insider tips on navigating the application cycle.',
    date: '2026-01-19',
    time: '19:00',
    timezone: 'America/New_York',
    category: 'crna_club_event',
    source: 'crna_club',
    imageUrl: '/images/crna-club/monthly-qa.png',
    location: 'Virtual (Zoom)',
    isVirtual: true,
    externalUrl: null,
    rsvpUrl: 'https://us02web.zoom.us/webinar/register/WN_example4',
    hostedBy: 'The CRNA Club Team',
    schoolId: null,
    schoolName: null,
    state: null,
    pointsValue: 50,
    attendanceWebhookId: 'zoom_webhook_004',
  },
  {
    id: 'event_013',
    title: 'ICU Experience Deep Dive',
    description: 'Not sure if your ICU experience is strong enough? Join us for an in-depth discussion about what programs are really looking for, how to maximize your experience, and when you might be ready to apply.',
    date: '2026-01-25',
    time: '18:00',
    timezone: 'America/New_York',
    category: 'crna_club_event',
    source: 'crna_club',
    imageUrl: '/images/crna-club/icu-deep-dive.png',
    location: 'Virtual (Zoom)',
    isVirtual: true,
    externalUrl: null,
    rsvpUrl: 'https://us02web.zoom.us/webinar/register/WN_example5',
    hostedBy: 'Amanda Foster, CRNA',
    schoolId: null,
    schoolName: null,
    state: null,
    pointsValue: 75,
    attendanceWebhookId: 'zoom_webhook_005',
  },
  {
    id: 'event_014',
    title: 'Program Director Panel: What We Look For',
    description: 'A rare opportunity to hear directly from CRNA program directors about what makes applicants stand out. Learn about red flags, how to address weaknesses, and what really matters in the selection process.',
    date: '2026-02-08',
    time: '19:00',
    timezone: 'America/New_York',
    category: 'crna_club_event',
    source: 'crna_club',
    imageUrl: '/images/crna-club/program-directors.png',
    location: 'Virtual (Zoom)',
    isVirtual: true,
    externalUrl: null,
    rsvpUrl: 'https://us02web.zoom.us/webinar/register/WN_example6',
    hostedBy: 'The CRNA Club Team',
    schoolId: null,
    schoolName: null,
    state: null,
    pointsValue: 100,
    attendanceWebhookId: 'zoom_webhook_006',
  },

  // SCHOOL EVENTS (Open Houses & Info Sessions)
  {
    id: 'event_018',
    title: 'Georgetown CRNA Program Virtual Open House',
    description: 'Join us for our virtual open house to learn about Georgetown University\'s Nurse Anesthesia program. Meet faculty, current students, and learn about our curriculum, clinical sites, and application process.',
    date: '2026-02-15',
    time: '14:00',
    timezone: 'America/New_York',
    category: 'school_open_house',
    source: 'school',
    imageUrl: '/images/schools/georgetown.png',
    location: 'Virtual (Zoom)',
    isVirtual: true,
    externalUrl: 'https://nursing.georgetown.edu/programs/nurse-anesthesia/events',
    rsvpUrl: null,
    hostedBy: 'Dr. Sarah Mitchell, Program Director',
    schoolId: 'school_001',
    schoolName: 'Georgetown University',
    state: 'DC',
    pointsValue: 0,
    attendanceWebhookId: null,
  },
  {
    id: 'event_019',
    title: 'Duke CRNA Program Information Session',
    description: 'Learn about Duke University\'s Doctor of Nurse Anesthesia Practice program. Topics include admission requirements, curriculum overview, clinical experiences, and career outcomes.',
    date: '2026-01-20',
    time: '18:00',
    timezone: 'America/New_York',
    category: 'school_info_session',
    source: 'school',
    imageUrl: '/images/schools/duke.png',
    location: 'Virtual (WebEx)',
    isVirtual: true,
    externalUrl: 'https://nursing.duke.edu/academic-programs/dnap/events',
    rsvpUrl: null,
    hostedBy: 'Admissions Team',
    schoolId: 'school_006',
    schoolName: 'Duke University',
    state: 'NC',
    pointsValue: 0,
    attendanceWebhookId: null,
  },
  {
    id: 'event_020',
    title: 'Columbia University CRNA Program Open House',
    description: 'Explore Columbia University\'s Nurse Anesthesia program at our spring open house. Tour our simulation facilities, meet current students, and learn about life in New York City as an SRNA.',
    date: '2026-03-08',
    time: '10:00',
    timezone: 'America/New_York',
    category: 'school_open_house',
    source: 'school',
    imageUrl: '/images/schools/columbia.png',
    location: '630 W 168th St, New York, NY',
    isVirtual: false,
    externalUrl: 'https://nursing.columbia.edu/programs/dnp-nurse-anesthesia/events',
    rsvpUrl: null,
    hostedBy: 'Columbia CRNA Faculty',
    schoolId: 'school_008',
    schoolName: 'Columbia University',
    state: 'NY',
    pointsValue: 0,
    attendanceWebhookId: null,
  },
  {
    id: 'event_021',
    title: 'Rush University CRNA Virtual Q&A Session',
    description: 'Have questions about Rush University\'s Nurse Anesthesia program? Join our monthly virtual Q&A session where current students and faculty answer your questions about admissions, curriculum, and student life.',
    date: '2026-01-15',
    time: '19:00',
    timezone: 'America/Chicago',
    category: 'school_info_session',
    source: 'school',
    imageUrl: '/images/schools/rush.png',
    location: 'Virtual (Zoom)',
    isVirtual: true,
    externalUrl: 'https://www.rushu.rush.edu/college-nursing/programs/dnp-nurse-anesthesia/events',
    rsvpUrl: null,
    hostedBy: 'Rush CRNA Student Ambassadors',
    schoolId: 'school_007',
    schoolName: 'Rush University',
    state: 'IL',
    pointsValue: 0,
    attendanceWebhookId: null,
  },
  {
    id: 'event_022',
    title: 'Emory University CRNA Program Open House',
    description: 'Experience Emory\'s Nurse Anesthesia program firsthand at our annual open house. Includes campus tour, simulation lab demo, panel discussion with current students, and networking reception.',
    date: '2026-04-12',
    time: '09:00',
    timezone: 'America/New_York',
    category: 'school_open_house',
    source: 'school',
    imageUrl: '/images/schools/emory.png',
    location: '1520 Clifton Rd, Atlanta, GA',
    isVirtual: false,
    externalUrl: 'https://nursing.emory.edu/programs/dnp-crna/events',
    rsvpUrl: null,
    hostedBy: 'Emory CRNA Program',
    schoolId: 'school_010',
    schoolName: 'Emory University',
    state: 'GA',
    pointsValue: 0,
    attendanceWebhookId: null,
  },
  {
    id: 'event_023',
    title: 'University of Pittsburgh CRNA Info Session',
    description: 'Learn about one of the oldest and most prestigious CRNA programs in the country. Our virtual info session covers admission requirements, unique program features, and answers to your questions.',
    date: '2026-02-05',
    time: '18:00',
    timezone: 'America/New_York',
    category: 'school_info_session',
    source: 'school',
    imageUrl: '/images/schools/pitt.png',
    location: 'Virtual (Teams)',
    isVirtual: true,
    externalUrl: 'https://www.nursing.pitt.edu/degree-programs/dnp-nurse-anesthesia/events',
    rsvpUrl: null,
    hostedBy: 'Pitt Nursing Admissions',
    schoolId: 'school_011',
    schoolName: 'University of Pittsburgh',
    state: 'PA',
    pointsValue: 0,
    attendanceWebhookId: null,
  },
  {
    id: 'event_024',
    title: 'UCLA CRNA Program Virtual Tour',
    description: 'Take a virtual tour of UCLA\'s Nurse Anesthesia program facilities and learn about our curriculum, clinical rotation sites across Los Angeles, and what makes our program unique.',
    date: '2026-03-18',
    time: '17:00',
    timezone: 'America/Los_Angeles',
    category: 'school_open_house',
    source: 'school',
    imageUrl: '/images/schools/ucla.png',
    location: 'Virtual (Zoom)',
    isVirtual: true,
    externalUrl: 'https://nursing.ucla.edu/programs/dnp-nurse-anesthesia/events',
    rsvpUrl: null,
    hostedBy: 'UCLA CRNA Faculty',
    schoolId: 'school_012',
    schoolName: 'UCLA',
    state: 'CA',
    pointsValue: 0,
    attendanceWebhookId: null,
  },
  {
    id: 'event_025',
    title: 'University of Miami CRNA Information Night',
    description: 'Join us for an evening information session about the University of Miami\'s Nurse Anesthesia program. Learn about our unique opportunities in South Florida and hear from recent graduates.',
    date: '2026-02-20',
    time: '18:30',
    timezone: 'America/New_York',
    category: 'school_info_session',
    source: 'school',
    imageUrl: '/images/schools/miami.png',
    location: 'Virtual (Zoom)',
    isVirtual: true,
    externalUrl: 'https://nursing.miami.edu/programs/dnp-nurse-anesthesia/events',
    rsvpUrl: null,
    hostedBy: 'UM CRNA Admissions',
    schoolId: 'school_013',
    schoolName: 'University of Miami',
    state: 'FL',
    pointsValue: 0,
    attendanceWebhookId: null,
  },
  {
    id: 'event_026',
    title: 'Baylor College of Medicine CRNA Open House',
    description: 'Explore Baylor\'s Nurse Anesthesia program at our Houston campus. Meet faculty, tour the simulation center, and learn about our clinical partnerships across the Texas Medical Center.',
    date: '2026-04-05',
    time: '10:00',
    timezone: 'America/Chicago',
    category: 'school_open_house',
    source: 'school',
    imageUrl: '/images/schools/baylor.png',
    location: 'One Baylor Plaza, Houston, TX',
    isVirtual: false,
    externalUrl: 'https://www.bcm.edu/education/schools/graduate-school-of-biomedical-sciences/programs/nurse-anesthesia/events',
    rsvpUrl: null,
    hostedBy: 'Baylor CRNA Program',
    schoolId: 'school_014',
    schoolName: 'Baylor College of Medicine',
    state: 'TX',
    pointsValue: 0,
    attendanceWebhookId: null,
  },

  // More AANA State meetings
  {
    id: 'event_015',
    title: 'Florida Association of Nurse Anesthetists Annual Meeting',
    description: 'FANA annual conference featuring educational tracks, vendor exhibits, and networking. Great opportunity to meet representatives from Florida CRNA programs.',
    date: '2026-06-12',
    time: '08:00',
    timezone: 'America/New_York',
    category: 'aana_state_meeting',
    source: 'aana',
    imageUrl: '/images/aana/florida-aana.png',
    location: 'Orlando, FL',
    isVirtual: false,
    externalUrl: 'https://www.aana.com/membership/state-associations/florida',
    rsvpUrl: null,
    hostedBy: null,
    schoolId: null,
    schoolName: null,
    state: 'FL',
    pointsValue: 0,
    attendanceWebhookId: null,
  },
  {
    id: 'event_016',
    title: 'New York State Association of Nurse Anesthetists Conference',
    description: 'NYSANA annual conference with educational sessions, networking events, and program representatives from across the Northeast.',
    date: '2026-05-18',
    time: '08:00',
    timezone: 'America/New_York',
    category: 'aana_state_meeting',
    source: 'aana',
    imageUrl: '/images/aana/newyork-aana.png',
    location: 'Albany, NY',
    isVirtual: false,
    externalUrl: 'https://www.aana.com/membership/state-associations/new-york',
    rsvpUrl: null,
    hostedBy: null,
    schoolId: null,
    schoolName: null,
    state: 'NY',
    pointsValue: 0,
    attendanceWebhookId: null,
  },
  {
    id: 'event_017',
    title: 'Pennsylvania Association of Nurse Anesthetists Annual Meeting',
    description: 'PANA annual meeting featuring CE credits, vendor exhibits, and networking with CRNAs and SRNAs from Pennsylvania programs.',
    date: '2026-04-08',
    time: '08:00',
    timezone: 'America/New_York',
    category: 'aana_state_meeting',
    source: 'aana',
    imageUrl: '/images/aana/pennsylvania-aana.png',
    location: 'Philadelphia, PA',
    isVirtual: false,
    externalUrl: 'https://www.aana.com/membership/state-associations/pennsylvania',
    rsvpUrl: null,
    hostedBy: null,
    schoolId: null,
    schoolName: null,
    state: 'PA',
    pointsValue: 0,
    attendanceWebhookId: null,
  },
];

/**
 * Get all events sorted by date
 */
export function getAllEvents() {
  return [...mockEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
}

/**
 * Get upcoming events (future dates only)
 */
export function getUpcomingEvents(limit = null) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = mockEvents
    .filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return limit ? upcoming.slice(0, limit) : upcoming;
}

/**
 * Get events by category
 */
export function getEventsByCategory(category) {
  return mockEvents
    .filter(event => event.category === category)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

/**
 * Get events by state
 */
export function getEventsByState(stateCode) {
  return mockEvents
    .filter(event => event.state === stateCode)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

/**
 * Get unique states that have events
 */
export function getStatesWithEvents() {
  const states = new Set(mockEvents.map(e => e.state).filter(Boolean));
  return US_STATES.filter(s => states.has(s.value));
}

/**
 * Get event by ID
 */
export function getEventById(eventId) {
  return mockEvents.find(event => event.id === eventId);
}

/**
 * Format event date and time for display
 */
export function formatEventDateTime(event) {
  const date = new Date(event.date + 'T' + event.time);

  const dateOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };

  const timeOptions = {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  };

  const formattedDate = date.toLocaleDateString('en-US', dateOptions);
  const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

  return `${formattedDate} at ${formattedTime}`;
}

/**
 * Get short date format for cards
 */
export function formatEventDateShort(event) {
  const date = new Date(event.date + 'T' + event.time);

  const options = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  };

  return date.toLocaleDateString('en-US', options) + ' UTC';
}

/**
 * Get category label for display
 */
export function getCategoryLabel(category) {
  return EVENT_CATEGORIES[category]?.label || category;
}

/**
 * Get category with state label (e.g., "CRNA Program Events, Michigan")
 */
export function getCategoryWithState(event) {
  const state = US_STATES.find(s => s.value === event.state);

  if ((event.category === 'school_open_house' || event.category === 'school_info_session') && state) {
    return `CRNA Program Events, ${state.label}`;
  }

  if (event.category === 'aana_state_meeting' && state) {
    return `AANA State Meeting, ${state.label}`;
  }

  return getCategoryLabel(event.category);
}

/**
 * Get events for a school profile page
 * Returns two types of events:
 * 1. Events from this specific school (open houses, info sessions)
 * 2. AANA state meetings in the same state as the school
 *
 * @param {string} schoolId - The school ID to get events for
 * @param {string} schoolState - The state code where the school is located
 * @returns {Object} - { schoolEvents, stateEvents }
 */
export function getEventsForSchoolProfile(schoolId, schoolState) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get upcoming events from this specific school
  const schoolEvents = mockEvents
    .filter(event => event.schoolId === schoolId)
    .filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Get upcoming AANA state meetings in the same state
  const stateEvents = mockEvents
    .filter(event => event.category === 'aana_state_meeting')
    .filter(event => event.state === schoolState)
    .filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return {
    schoolEvents,
    stateEvents,
    allEvents: [...schoolEvents, ...stateEvents].sort((a, b) => new Date(a.date) - new Date(b.date)),
  };
}

/**
 * Get all school events (open houses and info sessions)
 */
export function getSchoolEvents() {
  return mockEvents
    .filter(event => event.source === 'school')
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

/**
 * Get events by school ID
 */
export function getEventsBySchoolId(schoolId) {
  return mockEvents
    .filter(event => event.schoolId === schoolId)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

/**
 * Check if event is a school event (open house or info session)
 */
export function isSchoolEvent(event) {
  return event.category === 'school_open_house' || event.category === 'school_info_session';
}

/**
 * Check if event is an AANA event (state or national)
 */
export function isAANAEvent(event) {
  return event.category === 'aana_state_meeting' || event.category === 'aana_national_meeting';
}

/**
 * Check if event is a CRNA Club internal event
 */
export function isCRNAClubEvent(event) {
  return event.source === 'crna_club';
}
