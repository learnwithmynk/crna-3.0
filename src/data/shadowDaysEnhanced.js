/**
 * Mock Shadow Days Data
 *
 * Comprehensive data for the shadow day tracker including:
 * - Logged shadow days
 * - Upcoming/scheduled shadow days
 * - CRNA network tracking
 * - Preparation resources
 * - Follow-up action tracking
 *
 * Field naming convention (from schema-decisions.md):
 * - providerName (not crnaName) - consistent with other provider references
 * - hoursLogged (not hours) - explicit about what's logged
 * - casesObserved (not cases) - explicit about observation
 * - addToTotalHours (not addToTotal) - explicit about what's being added
 *
 * TODO: Replace with Supabase queries
 */

import { SHADOW_SKILLS } from '@/lib/enums';

// ============================================
// SHADOW DAY ENTRIES (PAST + UPCOMING)
// ============================================

export const mockShadowDays = [
  {
    id: 'shadow_001',
    date: '2024-11-15T00:00:00Z',
    location: 'Kaiser Permanente',
    providerName: 'Sachi Lord',
    providerEmail: 'sachi.lord@kaiser.com',
    providerLinkedin: 'linkedin.com/in/sachilord',
    providerProgram: null, // Independent CRNA
    providerSpecialty: 'cardiac',
    hoursLogged: 7,
    casesObserved: 2,
    skillsObserved: ['intubation', 'mask_ventilation'],
    notes: 'Observed full intubation sequence and general anesthesia administration for two different surgical procedures. Very informative experience learning about pre-op assessments.',
    standoutMoment: 'Seeing how Sachi handled a difficult airway with calm confidence.',
    status: 'logged', // logged, upcoming, cancelled
    followUpStatus: 'thank_you_sent', // none, thank_you_sent, lor_requested, lor_received
    savedToNetwork: true,
    targetProgramId: null,
    addToTotalHours: true,
  },
  {
    id: 'shadow_002',
    date: '2024-10-20T00:00:00Z',
    location: "St. Mary's Hospital",
    providerName: 'Jennifer Martinez',
    providerEmail: 'j.martinez@stmarys.org',
    providerLinkedin: null,
    providerProgram: 'Duke University',
    providerSpecialty: 'regional',
    hoursLogged: 8,
    casesObserved: 3,
    skillsObserved: ['intubation', 'nerve_block', 'extubation'],
    notes: "Shadowed during outpatient procedures. Learned about different sedation levels and nerve block techniques for pain management. Jennifer mentioned Duke has a strong regional focus.",
    standoutMoment: 'The precision of the ultrasound-guided nerve block was incredible.',
    status: 'logged',
    followUpStatus: 'lor_requested',
    savedToNetwork: true,
    targetProgramId: 'duke_crna',
    addToTotalHours: true,
  },
  {
    id: 'shadow_003',
    date: '2024-09-10T00:00:00Z',
    location: 'University Medical Center',
    providerName: 'Robert Chen',
    providerEmail: null,
    providerLinkedin: 'linkedin.com/in/robertchen-crna',
    providerProgram: null,
    providerSpecialty: 'cardiac',
    hoursLogged: 6,
    casesObserved: 1,
    skillsObserved: ['arterial_line', 'central_line'],
    notes: 'Observed cardiac surgery case. Fascinating to see the complexity of monitoring and anesthesia management in high-risk surgery.',
    standoutMoment: 'The TEE imaging during bypass was mind-blowing.',
    status: 'logged',
    followUpStatus: 'none',
    savedToNetwork: false,
    targetProgramId: null,
    addToTotalHours: true,
  },
];

// Upcoming scheduled shadow days
export const mockUpcomingShadowDays = [
  {
    id: 'shadow_upcoming_001',
    date: '2024-12-10T00:00:00Z',
    location: 'Duke University Hospital',
    providerName: 'To be assigned',
    providerEmail: null,
    providerSpecialty: null,
    hoursLogged: 8,
    casesObserved: null,
    skillsObserved: [],
    notes: '',
    status: 'upcoming',
    targetProgramId: 'duke_crna',
    prepCompleted: false,
  },
  {
    id: 'shadow_upcoming_002',
    date: '2024-12-20T00:00:00Z',
    location: 'Cleveland Clinic',
    providerName: 'Dr. Amanda Foster',
    providerEmail: 'a.foster@clevelandclinic.org',
    providerSpecialty: 'neuro',
    hoursLogged: 6,
    casesObserved: null,
    skillsObserved: [],
    notes: 'Neuro OR day - she specializes in craniotomies',
    status: 'upcoming',
    targetProgramId: null,
    prepCompleted: false,
  },
];

// ============================================
// CRNA NETWORK TRACKING
// ============================================

export const mockCRNANetwork = [
  {
    id: 'crna_001',
    name: 'Sachi Lord',
    email: 'sachi.lord@kaiser.com',
    linkedin: 'linkedin.com/in/sachilord',
    facility: 'Kaiser Permanente',
    specialty: 'cardiac',
    program: null,
    totalHoursShadowed: 7,
    shadowDates: ['2024-11-15T00:00:00Z'],
    relationshipStatus: 'connected', // just_met, connected, mentor, lor_source
    lorStatus: null, // requested, received, declined
    notes: 'Very approachable, offered to connect again',
    lastContact: '2024-11-16T00:00:00Z',
    metAt: 'shadow_day',
  },
  {
    id: 'crna_002',
    name: 'Jennifer Martinez',
    email: 'j.martinez@stmarys.org',
    linkedin: null,
    facility: "St. Mary's Hospital",
    specialty: 'regional',
    program: 'Duke University',
    totalHoursShadowed: 8,
    shadowDates: ['2024-10-20T00:00:00Z'],
    relationshipStatus: 'lor_source',
    lorStatus: 'requested',
    notes: 'Duke grad - great resource for program questions. Already asked for LOR.',
    lastContact: '2024-10-25T00:00:00Z',
    metAt: 'shadow_day',
  },
];

// ============================================
// PREPARATION RESOURCES
// ============================================

export const SHADOW_PREP_CHECKLIST = [
  {
    id: 'prep_1',
    category: 'research',
    label: 'Research the facility',
    description: 'Look up what cases/specialties they handle',
    helpText: 'Google "[Facility] surgery types" or check their website',
  },
  {
    id: 'prep_2',
    category: 'research',
    label: 'Review basic anesthesia concepts',
    description: 'Refresh on airway management, common drugs',
    lessonLink: '/learn/anesthesia-basics',
    lessonTitle: 'Anesthesia Fundamentals',
  },
  {
    id: 'prep_3',
    category: 'logistics',
    label: 'Confirm date, time, and dress code',
    description: 'Email/call to confirm all details',
  },
  {
    id: 'prep_4',
    category: 'logistics',
    label: 'Prepare your questions list',
    description: 'Have 5-10 thoughtful questions ready',
  },
  {
    id: 'prep_5',
    category: 'logistics',
    label: 'Bring a small notebook',
    description: 'For jotting down observations and names',
  },
  {
    id: 'prep_6',
    category: 'mindset',
    label: 'Review professional etiquette',
    description: 'Be punctual, respectful, and curious',
    lessonLink: '/learn/shadow-day-etiquette',
    lessonTitle: 'Shadow Day Success Guide',
  },
];

export const QUESTIONS_TO_ASK = [
  {
    id: 'q_1',
    category: 'career',
    question: 'What made you choose CRNA over other advanced practice roles?',
    why: 'Shows genuine interest in the profession',
  },
  {
    id: 'q_2',
    category: 'career',
    question: "What's your favorite part of being a CRNA?",
    why: 'Great for personal statement material',
  },
  {
    id: 'q_3',
    category: 'education',
    question: 'What do you wish you had known before starting CRNA school?',
    why: 'Practical advice for preparation',
  },
  {
    id: 'q_4',
    category: 'education',
    question: 'How did you prepare for the program academically?',
    why: 'Helps with your own prep strategy',
  },
  {
    id: 'q_5',
    category: 'clinical',
    question: 'Can you walk me through how you approach a pre-op assessment?',
    why: 'Shows clinical curiosity',
  },
  {
    id: 'q_6',
    category: 'clinical',
    question: "What's the most challenging case you've managed recently?",
    why: 'Learn about real-world complexity',
  },
  {
    id: 'q_7',
    category: 'program',
    question: 'What made you choose [Program Name] for your training?',
    why: 'Only ask if CRNA attended a target program',
    conditional: true,
  },
  {
    id: 'q_8',
    category: 'networking',
    question: 'Would you be open to me reaching out with questions later?',
    why: 'Opens door for mentorship',
  },
  {
    id: 'q_9',
    category: 'networking',
    question: 'Do you know any other CRNAs who might let me shadow?',
    why: 'Expands your network',
  },
  {
    id: 'q_10',
    category: 'lor',
    question: 'At what point would it be appropriate to ask for a letter of recommendation?',
    why: 'Sets up future LOR request tactfully',
  },
];

export const SKILLS_TO_OBSERVE = [
  { id: 'preoperative_assessment', label: 'Preoperative Assessment', category: 'evaluation' },
  { id: 'intubation', label: 'Intubation', category: 'airway' },
  { id: 'extubation', label: 'Extubation', category: 'airway' },
  { id: 'lma_placement', label: 'LMA Placement', category: 'airway' },
  { id: 'mask_ventilation', label: 'Mask Ventilation', category: 'airway' },
  { id: 'rapid_sequence', label: 'Rapid Sequence Induction', category: 'airway' },
  { id: 'iv_start', label: 'IV Start', category: 'access' },
  { id: 'arterial_line', label: 'Arterial Line Placement', category: 'monitoring' },
  { id: 'central_line', label: 'Central Line Placement', category: 'monitoring' },
  { id: 'spinal', label: 'Spinal Anesthesia', category: 'regional' },
  { id: 'epidural', label: 'Epidural Placement', category: 'regional' },
  { id: 'nerve_block', label: 'Nerve Block', category: 'regional' },
  { id: 'drug_titration', label: 'Drug Titration', category: 'technique' },
];

export const FOLLOW_UP_ACTIONS = [
  {
    id: 'followup_1',
    action: 'Send thank you email',
    timing: 'Within 24-48 hours',
    template: `Dear [CRNA Name],

Thank you so much for allowing me to shadow you at [Facility] on [Date]. I truly appreciated you taking the time to explain [specific thing you learned] and answer my questions about [topic].

[Specific moment that stood out] really reinforced my commitment to pursuing a career as a CRNA.

I hope to stay in touch as I continue my journey toward CRNA school. Please let me know if there's ever anything I can do to return the favor.

Best regards,
[Your Name]`,
  },
  {
    id: 'followup_2',
    action: 'Connect on LinkedIn',
    timing: 'Same day or next day',
    template: `Hi [CRNA Name], it was wonderful shadowing you at [Facility] yesterday! I really enjoyed learning about [topic]. Would love to stay connected. - [Your Name]`,
  },
  {
    id: 'followup_3',
    action: 'Log your experience in the tracker',
    timing: 'Same day',
    points: 2,
  },
  {
    id: 'followup_4',
    action: 'Add CRNA to your network',
    timing: 'Same day',
    points: 1,
  },
  {
    id: 'followup_5',
    action: 'Request letter of recommendation (if appropriate)',
    timing: 'After 2-3 shadow days or 15+ hours with same CRNA',
    template: `Dear [CRNA Name],

I hope this message finds you well. I wanted to reach out to thank you again for the opportunity to shadow you at [Facility]. The experience has been invaluable in confirming my passion for nurse anesthesia.

I am currently preparing my applications for CRNA programs and was wondering if you would be willing to write a letter of recommendation on my behalf? Having observed me during [X hours] of shadowing, I believe you could speak to my enthusiasm for the profession and my readiness for graduate study.

I would be happy to provide you with my CV, personal statement, and any other materials that would be helpful. Please let me know if you have any questions or need additional information.

Thank you so much for considering this request.

Best regards,
[Your Name]`,
  },
];

// ============================================
// LEARNDASH LESSON RECOMMENDATIONS
// ============================================

export const SHADOW_RELATED_LESSONS = [
  {
    id: 'lesson_1',
    title: 'Shadow Day Success: What to Expect',
    slug: 'shadow-day-success',
    duration: '15 min',
    description: 'Everything you need to know before your first shadow day',
    tags: ['preparation', 'beginner'],
  },
  {
    id: 'lesson_2',
    title: 'Anesthesia Machine Basics',
    slug: 'anesthesia-machine-basics',
    duration: '25 min',
    description: "Understanding the equipment you'll see in the OR",
    tags: ['clinical', 'equipment'],
  },
  {
    id: 'lesson_3',
    title: 'Common Anesthesia Drugs',
    slug: 'common-anesthesia-drugs',
    duration: '30 min',
    description: "Pharmacology overview of drugs you'll observe",
    tags: ['clinical', 'pharmacology'],
  },
  {
    id: 'lesson_4',
    title: 'Airway Management Overview',
    slug: 'airway-management',
    duration: '20 min',
    description: 'From mask ventilation to intubation',
    tags: ['clinical', 'airway'],
  },
  {
    id: 'lesson_5',
    title: 'Building Your CRNA Network',
    slug: 'building-crna-network',
    duration: '12 min',
    description: 'How to leverage shadow days for networking',
    tags: ['networking', 'career'],
  },
  {
    id: 'lesson_6',
    title: 'Requesting Letters of Recommendation',
    slug: 'lor-requests',
    duration: '18 min',
    description: 'When and how to ask for LORs from CRNAs',
    tags: ['application', 'networking'],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function calculateShadowStats(entries) {
  const logged = entries.filter((e) => e.status === 'logged');
  const totalHours = logged.reduce((sum, e) => sum + (e.hoursLogged || 0), 0);
  const totalCases = logged.reduce((sum, e) => sum + (e.casesObserved || 0), 0);
  const uniqueCRNAs = new Set(logged.map((e) => e.providerName)).size;
  const uniqueFacilities = new Set(logged.map((e) => e.location)).size;

  // Skills coverage
  const allSkills = logged.flatMap((e) => e.skillsObserved || []);
  const skillCounts = allSkills.reduce((acc, skill) => {
    acc[skill] = (acc[skill] || 0) + 1;
    return acc;
  }, {});

  return {
    totalHours,
    totalCases,
    totalDays: logged.length,
    uniqueCRNAs,
    uniqueFacilities,
    skillCounts,
    skillsCovered: Object.keys(skillCounts).length,
    totalSkills: SKILLS_TO_OBSERVE.length,
  };
}

export function getUpcomingShadowDays(upcoming, daysAhead = 14) {
  const today = new Date();
  const cutoff = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  return upcoming
    .filter((day) => {
      const date = new Date(day.date);
      return date >= today && date <= cutoff;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

export function getReadyToLogDays(upcoming) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return upcoming.filter((day) => {
    const date = new Date(day.date);
    date.setHours(0, 0, 0, 0);
    return date < today && day.status === 'upcoming';
  });
}

export function getPendingFollowUps(entries, daysWindow = 7) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysWindow);

  return entries.filter((entry) => {
    const entryDate = new Date(entry.date);
    return entry.status === 'logged' && entry.followUpStatus === 'none' && entryDate >= cutoff;
  });
}

export function getCRNAsForLOR(network, minHours = 8) {
  return network.filter(
    (crna) =>
      crna.totalHoursShadowed >= minHours &&
      crna.lorStatus !== 'received' &&
      crna.lorStatus !== 'declined'
  );
}

export function getLessonRecommendations(upcoming, completed = []) {
  const hasUpcoming = upcoming.length > 0;

  return SHADOW_RELATED_LESSONS.filter((lesson) => {
    if (completed.includes(lesson.id)) return false;
    if (hasUpcoming && lesson.tags.includes('preparation')) return true;
    return true;
  }).slice(0, 3);
}

// Default goal
export const defaultShadowGoal = 24;
export const userShadowGoal = 24;

export default {
  mockShadowDays,
  mockUpcomingShadowDays,
  mockCRNANetwork,
  SHADOW_PREP_CHECKLIST,
  QUESTIONS_TO_ASK,
  SKILLS_TO_OBSERVE,
  FOLLOW_UP_ACTIONS,
  SHADOW_RELATED_LESSONS,
  calculateShadowStats,
  getUpcomingShadowDays,
  getReadyToLogDays,
  getPendingFollowUps,
  getCRNAsForLOR,
  getLessonRecommendations,
  defaultShadowGoal,
  userShadowGoal,
};
