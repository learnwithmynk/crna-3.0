/**
 * Smart Prompts - Prompt Definitions
 *
 * All 39 prompt configurations organized by engine.
 * Each prompt has: id, engine, type, urgency, titleTemplate, messageTemplate, actions
 */

// =============================================================================
// DEADLINE ALERT ENGINE (3 prompts)
// =============================================================================

export const DEADLINE_PROMPTS = {
  DEADLINE_30: {
    id: 'DEADLINE_30',
    engine: 'deadline',
    type: 'periodic',
    urgency: 'medium',
    titleTemplate: '30 days until {{programName}} deadline!',
    messageTemplate: "You're at {{progress}}% complete. Did you submit?",
    actions: [
      { label: 'Yes, I submitted!', actionType: 'mark_submitted' },
      { label: 'Not yet', actionType: 'view_checklist' },
    ],
    dismissible: false,
    snoozeable: true,
  },
  DEADLINE_14: {
    id: 'DEADLINE_14',
    engine: 'deadline',
    type: 'periodic',
    urgency: 'high',
    titleTemplate: 'Two weeks until {{programName}} deadline!',
    messageTemplate: "You're at {{progress}}% complete. Did you submit?",
    actions: [
      { label: 'Yes, I submitted!', actionType: 'mark_submitted' },
      { label: 'Not yet', actionType: 'view_checklist' },
    ],
    dismissible: false,
    snoozeable: true,
  },
  DEADLINE_7: {
    id: 'DEADLINE_7',
    engine: 'deadline',
    type: 'periodic',
    urgency: 'critical',
    titleTemplate: '{{programName}} deadline is this week!',
    messageTemplate: "You're at {{progress}}% complete. Did you submit?",
    actions: [
      { label: 'Yes, I submitted!', actionType: 'mark_submitted' },
      { label: 'Not yet', actionType: 'view_checklist' },
    ],
    dismissible: false,
    snoozeable: false,
  },
};

// =============================================================================
// CERTIFICATION ALERT ENGINE (2 prompts)
// =============================================================================

export const CERTIFICATION_PROMPTS = {
  CERT_EXPIRING_90: {
    id: 'CERT_EXPIRING_90',
    engine: 'certification',
    type: 'periodic',
    urgency: 'low',
    titleTemplate: 'Your {{certName}} expires in {{daysRemaining}} days',
    messageTemplate: 'Plan your renewal to avoid gaps in your application.',
    actions: [
      { label: 'Set Reminder', actionType: 'set_reminder' },
      { label: 'Update Status', actionType: 'update_cert' },
    ],
    dismissible: true,
    snoozeable: true,
  },
  CERT_EXPIRING_30: {
    id: 'CERT_EXPIRING_30',
    engine: 'certification',
    type: 'periodic',
    urgency: 'high',
    titleTemplate: 'Your {{certName}} expires in {{daysRemaining}} days',
    messageTemplate: 'Renew now to avoid gaps in your application timeline.',
    actions: [
      { label: 'Mark as Renewed', actionType: 'mark_renewed' },
      { label: 'View Details', actionType: 'view_cert' },
    ],
    dismissible: true,
    snoozeable: true,
  },
};

// =============================================================================
// LOR TRACKING ENGINE (3 prompts)
// =============================================================================

export const LOR_PROMPTS = {
  LOR_PENDING_21: {
    id: 'LOR_PENDING_21',
    engine: 'lor',
    type: 'periodic',
    urgency: 'medium',
    titleTemplate: "It's been 3 weeks since you requested a letter from {{recommenderName}}",
    messageTemplate: 'Have you heard back?',
    actions: [
      { label: 'Mark as Received', actionType: 'mark_received' },
      { label: 'Send Follow-up', actionType: 'show_template' },
      { label: 'They Declined', actionType: 'mark_declined' },
    ],
    dismissible: true,
    snoozeable: true,
  },
  LOR_PENDING_30: {
    id: 'LOR_PENDING_30',
    engine: 'lor',
    type: 'periodic',
    urgency: 'high',
    titleTemplate: "It's been 4 weeks since you requested a letter from {{recommenderName}}",
    messageTemplate: 'Consider sending a follow-up or asking a backup recommender.',
    actions: [
      { label: 'Mark as Received', actionType: 'mark_received' },
      { label: 'Send Follow-up', actionType: 'show_template' },
      { label: 'Ask Someone Else', actionType: 'add_recommender' },
    ],
    dismissible: true,
    snoozeable: true,
  },
  LOR_INCOMPLETE_DEADLINE: {
    id: 'LOR_INCOMPLETE_DEADLINE',
    engine: 'lor',
    type: 'periodic',
    urgency: 'critical',
    titleTemplate: 'You need {{lorCount}} more LOR(s) for {{programName}}',
    messageTemplate: 'Deadline is in {{daysRemaining}} days. Time to follow up!',
    actions: [
      { label: 'View LOR Status', actionType: 'view_lors' },
      { label: 'Add Recommender', actionType: 'add_recommender' },
    ],
    dismissible: false,
    snoozeable: false,
  },
};

// =============================================================================
// INTERVIEW PREP ENGINE (11 prompts)
// =============================================================================

export const INTERVIEW_PROMPTS = {
  INTERVIEW_DATE_PROMPT: {
    id: 'INTERVIEW_DATE_PROMPT',
    engine: 'interview',
    type: 'inline',
    urgency: 'high',
    titleTemplate: 'Congrats on your interview invite from {{programName}}!',
    messageTemplate: "Let's get you prepared. Is this an in-person or virtual interview?",
    actions: [
      { label: 'In-Person', actionType: 'set_interview_type', value: 'in_person' },
      { label: 'Virtual', actionType: 'set_interview_type', value: 'virtual' },
    ],
    dismissible: false,
    snoozeable: false,
  },
  INTERVIEW_30: {
    id: 'INTERVIEW_30',
    engine: 'interview',
    type: 'periodic',
    urgency: 'medium',
    titleTemplate: '30 days until your {{programName}} interview!',
    messageTemplate: 'Time to start interview prep. Watch the interview module.',
    actions: [
      { label: 'Start Prep', actionType: 'link', href: '/learning/interview-prep' },
    ],
    dismissible: false,
    snoozeable: true,
  },
  INTERVIEW_14: {
    id: 'INTERVIEW_14',
    engine: 'interview',
    type: 'periodic',
    urgency: 'medium',
    titleTemplate: '2 weeks until your {{programName}} interview!',
    messageTemplate: 'Start preparing talking points and review your EQ entries.',
    actions: [
      { label: 'View EQ Entries', actionType: 'link', href: '/trackers?tab=eq' },
      { label: 'Practice Answers', actionType: 'link', href: '/learning/interview-prep' },
    ],
    dismissible: false,
    snoozeable: true,
  },
  INTERVIEW_7_INPERSON: {
    id: 'INTERVIEW_7_INPERSON',
    engine: 'interview',
    type: 'periodic',
    urgency: 'high',
    titleTemplate: '1 week until your in-person interview at {{programName}}!',
    messageTemplate: "Print your resume and gather what you're bringing.",
    actions: [
      { label: 'View Checklist', actionType: 'link', href: '/programs/{{programId}}' },
    ],
    dismissible: false,
    snoozeable: false,
  },
  INTERVIEW_7_VIRTUAL: {
    id: 'INTERVIEW_7_VIRTUAL',
    engine: 'interview',
    type: 'periodic',
    urgency: 'high',
    titleTemplate: '1 week until your virtual interview with {{programName}}!',
    messageTemplate: 'Set up your interview space - lighting, camera, background.',
    actions: [
      { label: 'View Tips', actionType: 'link', href: '/learning/virtual-interview-tips' },
    ],
    dismissible: false,
    snoozeable: false,
  },
  INTERVIEW_3: {
    id: 'INTERVIEW_3',
    engine: 'interview',
    type: 'periodic',
    urgency: 'high',
    titleTemplate: '3 days until your {{programName}} interview!',
    messageTemplate: 'Review your talking points and practice answers.',
    actions: [
      { label: 'Final Prep', actionType: 'link', href: '/programs/{{programId}}' },
    ],
    dismissible: false,
    snoozeable: false,
  },
  INTERVIEW_1: {
    id: 'INTERVIEW_1',
    engine: 'interview',
    type: 'periodic',
    urgency: 'critical',
    titleTemplate: 'Your {{programName}} interview is tomorrow!',
    messageTemplate: 'Tee up a thank you email draft to send right after.',
    actions: [
      { label: 'View Thank You Template', actionType: 'show_template' },
      { label: "I'm Ready!", actionType: 'dismiss' },
    ],
    dismissible: false,
    snoozeable: false,
  },
  POST_INTERVIEW_THANKYOU: {
    id: 'POST_INTERVIEW_THANKYOU',
    engine: 'interview',
    type: 'periodic',
    urgency: 'high',
    titleTemplate: 'Send your thank you email to {{programName}}!',
    messageTemplate: 'Your interview was yesterday. Send your thank you and congratulate yourself!',
    actions: [
      { label: 'View Template', actionType: 'show_template' },
      { label: 'Already Sent', actionType: 'mark_sent' },
    ],
    dismissible: true,
    snoozeable: false,
  },
  POST_INTERVIEW_FORM: {
    id: 'POST_INTERVIEW_FORM',
    engine: 'interview',
    type: 'periodic',
    urgency: 'low',
    titleTemplate: 'How did your {{programName}} interview go?',
    messageTemplate: 'Share your experience to help others prepare.',
    actions: [
      { label: 'Share Feedback', actionType: 'open_form' },
      { label: 'Skip', actionType: 'dismiss' },
    ],
    dismissible: true,
    snoozeable: false,
  },
  OUTCOME_CHECK_14: {
    id: 'OUTCOME_CHECK_14',
    engine: 'interview',
    type: 'periodic',
    urgency: 'low',
    titleTemplate: 'Any news from {{programName}}?',
    messageTemplate: "It's been 2 weeks since your interview. Update your status when you hear back.",
    actions: [
      { label: 'Update Status', actionType: 'update_status' },
      { label: 'Still Waiting', actionType: 'snooze', days: 7 },
    ],
    dismissible: true,
    snoozeable: true,
  },
  WAITLIST_SUPPORT: {
    id: 'WAITLIST_SUPPORT',
    engine: 'interview',
    type: 'periodic',
    urgency: 'low',
    titleTemplate: "You're on the waitlist at {{programName}}",
    messageTemplate: "Waiting is hard. Here's how to stay proactive while you wait.",
    actions: [
      { label: 'Waitlist Tips', actionType: 'link', href: '/learning/waitlist-tips' },
      { label: 'Dismiss', actionType: 'dismiss' },
    ],
    dismissible: true,
    snoozeable: true,
  },
};

// =============================================================================
// ENGAGEMENT NUDGE ENGINE (16 prompts)
// =============================================================================

export const ENGAGEMENT_PROMPTS = {
  WELCOME_BACK_7: {
    id: 'WELCOME_BACK_7',
    engine: 'engagement',
    type: 'periodic',
    urgency: 'medium',
    titleTemplate: 'Welcome back!',
    messageTemplate: "{{welcomeMessage}}", // Dynamic based on priority logic
    actions: [
      { label: '{{welcomeAction}}', actionType: 'link', href: '{{welcomeHref}}' },
    ],
    dismissible: true,
    snoozeable: false,
  },
  WELCOME_BACK_14: {
    id: 'WELCOME_BACK_14',
    engine: 'engagement',
    type: 'periodic',
    urgency: 'high',
    titleTemplate: "We've missed you!",
    messageTemplate: "{{welcomeMessage}}", // Dynamic based on priority logic
    actions: [
      { label: '{{welcomeAction}}', actionType: 'link', href: '{{welcomeHref}}' },
    ],
    dismissible: true,
    snoozeable: false,
  },
  LOGIN_STREAK_3: {
    id: 'LOGIN_STREAK_3',
    engine: 'engagement',
    type: 'celebration',
    urgency: 'low',
    titleTemplate: "3-day streak! You're building momentum.",
    messageTemplate: 'Keep logging in daily to maintain your streak.',
    actions: [],
    dismissible: false,
    snoozeable: false,
  },
  LOGIN_STREAK_7: {
    id: 'LOGIN_STREAK_7',
    engine: 'engagement',
    type: 'celebration',
    urgency: 'low',
    titleTemplate: "One week strong! You've logged in 7 days in a row.",
    messageTemplate: 'Your consistency is paying off.',
    actions: [],
    dismissible: false,
    snoozeable: false,
  },
  LOGIN_STREAK_14: {
    id: 'LOGIN_STREAK_14',
    engine: 'engagement',
    type: 'celebration',
    urgency: 'low',
    titleTemplate: 'Two weeks of daily logins!',
    messageTemplate: "You're among the most dedicated members.",
    actions: [],
    dismissible: false,
    snoozeable: false,
  },
  LOGIN_STREAK_30: {
    id: 'LOGIN_STREAK_30',
    engine: 'engagement',
    type: 'celebration',
    urgency: 'low',
    titleTemplate: 'One month streak!',
    messageTemplate: "Amazing dedication. You're in the top 5% of members.",
    actions: [],
    dismissible: false,
    snoozeable: false,
  },
  LOGIN_STREAK_MONTHLY: {
    id: 'LOGIN_STREAK_MONTHLY',
    engine: 'engagement',
    type: 'celebration',
    urgency: 'low',
    titleTemplate: '{{streakDays}}-day streak!',
    messageTemplate: 'Your consistency is remarkable. Keep it up!',
    actions: [],
    dismissible: false,
    snoozeable: false,
  },
  LOGIN_STREAK_RISK: {
    id: 'LOGIN_STREAK_RISK',
    engine: 'engagement',
    type: 'periodic',
    urgency: 'medium',
    titleTemplate: "You're on a {{streakDays}}-day login streak!",
    messageTemplate: "Don't break it - you're building great momentum.",
    actions: [
      { label: 'Keep Going', actionType: 'dismiss' },
    ],
    dismissible: true,
    snoozeable: false,
  },
  READYSCORE_UP: {
    id: 'READYSCORE_UP',
    engine: 'engagement',
    type: 'celebration',
    urgency: 'low',
    titleTemplate: 'Your ReadyScore increased to {{newScore}}!',
    messageTemplate: 'Up {{increase}} points. Great progress on your journey.',
    actions: [
      { label: 'View Details', actionType: 'link', href: '/stats' },
    ],
    dismissible: false,
    snoozeable: false,
  },
  MILESTONE_COMPLETE: {
    id: 'MILESTONE_COMPLETE',
    engine: 'engagement',
    type: 'celebration',
    urgency: 'low',
    titleTemplate: 'Milestone complete: {{milestoneName}}!',
    messageTemplate: "You're making excellent progress on your journey.",
    actions: [],
    dismissible: false,
    snoozeable: false,
  },
  CHECKLIST_ITEM_1: {
    id: 'CHECKLIST_ITEM_1',
    engine: 'engagement',
    type: 'celebration',
    urgency: 'low',
    titleTemplate: 'First checklist item complete!',
    messageTemplate: "You're off to a great start.",
    actions: [],
    dismissible: false,
    snoozeable: false,
  },
  CHECKLIST_ITEM_5: {
    id: 'CHECKLIST_ITEM_5',
    engine: 'engagement',
    type: 'celebration',
    urgency: 'low',
    titleTemplate: '5 checklist items complete!',
    messageTemplate: "You're making steady progress.",
    actions: [],
    dismissible: false,
    snoozeable: false,
  },
  CHECKLIST_ITEM_10: {
    id: 'CHECKLIST_ITEM_10',
    engine: 'engagement',
    type: 'celebration',
    urgency: 'low',
    titleTemplate: '10 checklist items complete!',
    messageTemplate: "You're crushing it!",
    actions: [],
    dismissible: false,
    snoozeable: false,
  },
  FIRST_TARGET_SAVED: {
    id: 'FIRST_TARGET_SAVED',
    engine: 'engagement',
    type: 'celebration',
    urgency: 'low',
    titleTemplate: 'First target program saved!',
    messageTemplate: "Great choice! You're on your way.",
    actions: [
      { label: 'View Program', actionType: 'link', href: '/programs/{{programId}}' },
    ],
    dismissible: false,
    snoozeable: false,
  },
  PROGRAMS_SAVED_5: {
    id: 'PROGRAMS_SAVED_5',
    engine: 'engagement',
    type: 'celebration',
    urgency: 'low',
    titleTemplate: 'School Scout badge earned!',
    messageTemplate: "You've saved 5 programs. Great research!",
    actions: [
      { label: 'View Programs', actionType: 'link', href: '/programs' },
    ],
    dismissible: false,
    snoozeable: false,
  },
  ACCEPTANCE_CELEBRATION: {
    id: 'ACCEPTANCE_CELEBRATION',
    engine: 'engagement',
    type: 'celebration',
    urgency: 'high',
    titleTemplate: 'CONGRATULATIONS! You got into {{programName}}!',
    messageTemplate: "You did it! We're so proud of you. Your hard work paid off.",
    actions: [
      { label: 'Share the News', actionType: 'share' },
      { label: 'Thank You!', actionType: 'dismiss' },
    ],
    dismissible: false,
    snoozeable: false,
  },
};

// =============================================================================
// EVENT ENGAGEMENT ENGINE (2 prompts)
// =============================================================================

export const EVENT_PROMPTS = {
  EVENT_TOMORROW: {
    id: 'EVENT_TOMORROW',
    engine: 'event',
    type: 'periodic',
    urgency: 'low',
    titleTemplate: '{{eventName}} is tomorrow!',
    messageTemplate: 'Are you still attending?',
    actions: [
      { label: "Yes, I'm attending", actionType: 'confirm_attending' },
      { label: "No, can't make it", actionType: 'mark_not_attending' },
    ],
    dismissible: false,
    snoozeable: false,
  },
  EVENT_LOG_REMINDER: {
    id: 'EVENT_LOG_REMINDER',
    engine: 'event',
    type: 'periodic',
    urgency: 'low',
    titleTemplate: 'Did you attend {{eventName}}?',
    messageTemplate: 'Log it to track your engagement.',
    actions: [
      { label: 'Yes, log it', actionType: 'log_event' },
      { label: "No, I didn't go", actionType: 'mark_not_attended' },
    ],
    dismissible: true,
    snoozeable: false,
  },
};

// =============================================================================
// PREREQUISITE GAP ENGINE (4 prompts)
// =============================================================================

export const PREREQUISITE_PROMPTS = {
  PREREQ_GAP: {
    id: 'PREREQ_GAP',
    engine: 'prerequisite',
    type: 'periodic',
    urgency: 'medium',
    titleTemplate: "You're missing {{prereqName}}",
    messageTemplate: "Several of your target programs require this. Status: {{status}}",
    actions: [
      { label: 'View Options', actionType: 'link', href: '/prerequisites' },
      { label: 'Mark as Planned', actionType: 'mark_planned' },
    ],
    dismissible: true,
    snoozeable: true,
  },
  PREREQ_GRADE_LOW: {
    id: 'PREREQ_GRADE_LOW',
    engine: 'prerequisite',
    type: 'periodic',
    urgency: 'low',
    titleTemplate: 'Your {{courseName}} grade ({{grade}}) is below the typical B minimum',
    messageTemplate: 'Consider retaking or taking a higher-level course.',
    actions: [
      { label: 'View Courses', actionType: 'link', href: '/prerequisites' },
      { label: 'Dismiss', actionType: 'dismiss' },
    ],
    dismissible: true,
    snoozeable: true,
  },
  RATE_COURSES: {
    id: 'RATE_COURSES',
    engine: 'prerequisite',
    type: 'periodic',
    urgency: 'low',
    titleTemplate: 'Rate Your Courses',
    messageTemplate: 'Share your experience with {{courseName}} to help other applicants. Earn points and contribute to the library!',
    actions: [
      { label: 'Rate Now', actionType: 'link', href: '/prerequisites?action=rate' },
      { label: 'Later', actionType: 'snooze', days: 7 },
    ],
    dismissible: true,
    snoozeable: true,
    // Trigger: Has ≥1 completed prereq without library link, 7 days after registration
    // Re-show: 30 days later if still has unrated courses
    // Cool-off: 7 days after dismiss
  },
  ACADEMIC_DATA_NEEDED: {
    id: 'ACADEMIC_DATA_NEEDED',
    engine: 'prerequisite',
    type: 'periodic',
    urgency: 'medium',
    titleTemplate: 'Track Your Additional Science Classes',
    messageTemplate: 'Add your GPA and completed courses to get personalized recommendations.',
    actions: [
      { label: 'Add My Info', actionType: 'link', href: '/my-stats?section=academic' },
      { label: 'Later', actionType: 'snooze', days: 7 },
    ],
    dismissible: true,
    snoozeable: true,
    // Trigger: Registered >7 days, gpa_calculated=false AND no completed prerequisites
    // First: 7 days after registration
    // Second: 30 days (if still no data)
    // Permanent dismiss after second
  },
};

// =============================================================================
// ALL PROMPTS (Combined)
// =============================================================================

export const ALL_PROMPTS = {
  ...DEADLINE_PROMPTS,
  ...CERTIFICATION_PROMPTS,
  ...LOR_PROMPTS,
  ...INTERVIEW_PROMPTS,
  ...ENGAGEMENT_PROMPTS,
  ...EVENT_PROMPTS,
  ...PREREQUISITE_PROMPTS,
};

/**
 * Get prompt definition by ID
 */
export function getPromptDefinition(promptId) {
  return ALL_PROMPTS[promptId] || null;
}

/**
 * Get all prompts for an engine
 */
export function getPromptsByEngine(engine) {
  return Object.values(ALL_PROMPTS).filter(p => p.engine === engine);
}

export default {
  ALL_PROMPTS,
  DEADLINE_PROMPTS,
  CERTIFICATION_PROMPTS,
  LOR_PROMPTS,
  INTERVIEW_PROMPTS,
  ENGAGEMENT_PROMPTS,
  EVENT_PROMPTS,
  PREREQUISITE_PROMPTS,
  getPromptDefinition,
  getPromptsByEngine,
};
