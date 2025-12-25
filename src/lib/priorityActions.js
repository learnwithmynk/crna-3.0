/**
 * Priority Actions System
 *
 * Generates tiered priority actions for the ReadyScore sidebar.
 * These are persistent readiness guidance items (NOT dismissible like Smart Prompts).
 *
 * Three tiers:
 * - Tier 1: Quick Wins (log what you already have - can be done today)
 * - Tier 2: Moderate (1-8 weeks to complete)
 * - Tier 3: Long-term (3+ months)
 *
 * Users progress through tiers naturally. New users see quick wins.
 * As they complete those, they see moderate actions.
 * After rejection or for competitive edge, they see long-term improvements.
 */

// =============================================================================
// TIER DEFINITIONS
// =============================================================================

/**
 * Tier 1: QUICK WINS
 * Things they ALREADY HAVE but just need to LOG. Can be done in one sitting.
 */
const TIER_1_ACTIONS = [
  {
    id: 'gpa',
    condition: (u) => !u.gpaEntered,
    action: 'Calculate your GPA',
    link: '/tools/gpa-calculator',
    context: 'Your GPA is a major component of your ReadyScore',
    icon: 'GraduationCap',
  },
  {
    id: 'clinical',
    condition: (u) => (u.clinicalEntries || 0) < 10,
    action: 'Log your clinical experience',
    link: '/trackers/clinical',
    context: 'Log devices, medications, and procedures you\'ve worked with',
    icon: 'Stethoscope',
  },
  {
    id: 'shadow',
    condition: (u) => (u.shadowHours || 0) === 0,
    action: 'Log your shadow hours',
    link: '/trackers/shadow',
    context: 'Already shadowed? Log those hours!',
    icon: 'Eye',
  },
  {
    id: 'events',
    condition: (u) => (u.eventsLogged || 0) === 0,
    action: 'Log events you\'ve attended',
    link: '/trackers/events',
    context: 'Already attended an AANA meeting or info session? Add it!',
    icon: 'Calendar',
  },
  {
    id: 'certs',
    condition: (u) => !u.certificationsLogged,
    action: 'Add your certifications',
    link: '/profile/certifications',
    context: 'Log your CCRN, BLS, ACLS, and other credentials',
    icon: 'Award',
  },
  {
    id: 'orgs',
    condition: (u) => !u.organizationsLogged,
    action: 'Add your professional organizations',
    link: '/profile/organizations',
    context: 'Log AANA, AACN, or other memberships',
    icon: 'Users',
  },
  {
    id: 'eq',
    condition: (u) => (u.eqReflections || 0) === 0,
    action: 'Log an EQ reflection',
    link: '/trackers/eq',
    context: 'Start building your interview story bank',
    icon: 'Heart',
  },
  {
    id: 'leadership',
    condition: (u) => (u.leadershipEntries || 0) === 0,
    action: 'Add your leadership experience',
    link: '/stats#leadership',
    context: 'Log charge nurse, preceptor, or committee roles',
    icon: 'Crown',
  },
  {
    id: 'volunteer',
    condition: (u) => (u.volunteeringEntries || 0) === 0,
    action: 'Add community involvement',
    link: '/stats#community',
    context: 'Log volunteer work or medical missions',
    icon: 'HandHeart',
  },
];

/**
 * Tier 2: MODERATE ACTIONS
 * Requires some effort but achievable in 1-8 weeks.
 */
const TIER_2_ACTIONS = [
  {
    id: 'ccrn',
    condition: (u) => !u.hasCCRN,
    action: 'Get CCRN certified',
    link: '/profile/certifications',
    context: 'Most programs require CCRN - plan 4-8 weeks to prepare',
    icon: 'Award',
  },
  {
    id: 'addlCert',
    condition: (u) => (u.certCount || 0) === 1,
    action: 'Get an additional certification',
    link: '/profile/certifications',
    context: 'Consider CSC, CMC, or TNCC to strengthen your application',
    icon: 'BadgePlus',
  },
  {
    id: 'moreShadow',
    condition: (u) => (u.shadowHours || 0) > 0 && (u.shadowHours || 0) < 24,
    action: (u) => `Schedule more shadow experiences (${u.shadowHours || 0}/24)`,
    link: '/trackers/shadow',
    context: 'Aim for 24+ hours across different settings',
    icon: 'Eye',
  },
  {
    id: 'aanaEvent',
    condition: (u) => !u.hasAANAEvent,
    action: 'Attend a state or national AANA meeting',
    link: '/events',
    context: 'Great for networking and learning about programs',
    icon: 'Calendar',
  },
  {
    id: 'moreLeadership',
    condition: (u) => (u.leadershipEntries || 0) > 0 && (u.leadershipEntries || 0) < 3,
    action: 'Build more leadership experience',
    link: '/stats#leadership',
    context: 'Consider charge nurse, preceptor, or committee roles',
    icon: 'Crown',
  },
  {
    id: 'moreVolunteer',
    condition: (u) => (u.volunteeringEntries || 0) > 0 && (u.volunteeringEntries || 0) < 2,
    action: 'Get more community involvement',
    link: '/stats#community',
    context: 'Volunteer work shows well-roundedness',
    icon: 'HandHeart',
  },
  {
    id: 'prereqs',
    condition: (u) => (u.missingPrereqs || 0) > 0 && (u.missingPrereqs || 0) <= 2,
    action: (u) => `Complete your remaining prerequisites (${u.missingPrereqs} left)`,
    link: '/stats#academic',
    context: 'You\'re close to finishing your prerequisites',
    icon: 'BookOpen',
  },
  {
    id: 'materials',
    condition: (u) => !u.personalStatementStarted,
    action: 'Work on your personal statement',
    link: '/materials',
    context: 'Start drafting - you can refine over time',
    icon: 'FileText',
  },
  {
    id: 'research',
    condition: (u) => (u.researchEntries || 0) === 0,
    action: 'Get involved in a QI project',
    link: '/stats#research',
    context: 'Ask about unit-based quality improvement initiatives',
    icon: 'FlaskConical',
  },
];

/**
 * Tier 3: LONG-TERM ACTIONS
 * Bigger investments that may be needed if rejected or for competitive edge.
 */
const TIER_3_ACTIONS = [
  {
    id: 'gre',
    condition: (u) => (u.scienceGpa || 4.0) < 3.3 && !u.greTaken,
    action: 'Consider taking the GRE',
    link: '/stats#academic',
    context: 'A strong GRE can offset a lower GPA for some programs',
    icon: 'FileQuestion',
  },
  {
    id: 'manyPrereqs',
    condition: (u) => (u.missingPrereqs || 0) >= 3,
    action: 'Plan your prerequisite coursework',
    link: '/stats#academic',
    context: 'Map out which semesters to take remaining courses',
    icon: 'BookOpen',
  },
  {
    id: 'icuYears',
    condition: (u) => (u.icuYears || 0) < 2,
    action: (u) => `Continue building ICU experience (currently ${u.icuYears || 0} years)`,
    link: '/trackers/clinical',
    context: 'Most programs prefer 2+ years',
    icon: 'Timer',
  },
  {
    id: 'acuity',
    condition: (u) => !u.hasAdvancedDevices,
    action: 'Seek high-acuity patient assignments',
    link: '/trackers/clinical',
    context: 'ECMO, IABP, CRRT experience strengthens your application',
    icon: 'Activity',
  },
  {
    id: 'lowGpa',
    condition: (u) => (u.overallGpa || 4.0) < 3.0,
    action: 'Consider grade replacement options',
    link: '/stats#academic',
    context: 'Some schools accept retakes - check target program policies',
    icon: 'RefreshCw',
  },
  {
    id: 'publications',
    condition: (u) => (u.publications || 0) === 0,
    action: 'Consider a research opportunity',
    link: '/stats#research',
    context: 'Publications or poster presentations stand out',
    icon: 'FileText',
  },
];

// =============================================================================
// PRIORITY ACTION LOGIC
// =============================================================================

/**
 * Get applicable actions from a tier
 */
function getApplicableActions(tier, userData) {
  return tier
    .filter((item) => item.condition(userData))
    .map((item) => ({
      id: item.id,
      action: typeof item.action === 'function' ? item.action(userData) : item.action,
      link: item.link,
      context: item.context,
      icon: item.icon,
    }));
}

/**
 * Get priority actions for a user
 *
 * Returns up to 3 actions from the current applicable tier.
 * Only shows Tier 2 if all Tier 1 complete, Tier 3 if all Tier 1 & 2 complete.
 *
 * @param {Object} userData - User profile data
 * @param {number} maxActions - Maximum number of actions to return (default 3)
 * @returns {Object} - { actions: Array, tier: number, hasMoreInTier: boolean }
 */
export function getPriorityActions(userData, maxActions = 3) {
  // Check Tier 1 first
  const tier1Actions = getApplicableActions(TIER_1_ACTIONS, userData);
  if (tier1Actions.length > 0) {
    return {
      actions: tier1Actions.slice(0, maxActions),
      tier: 1,
      tierLabel: 'Quick Wins',
      hasMoreInTier: tier1Actions.length > maxActions,
      totalInTier: tier1Actions.length,
    };
  }

  // If Tier 1 is empty, check Tier 2
  const tier2Actions = getApplicableActions(TIER_2_ACTIONS, userData);
  if (tier2Actions.length > 0) {
    return {
      actions: tier2Actions.slice(0, maxActions),
      tier: 2,
      tierLabel: 'Next Steps',
      hasMoreInTier: tier2Actions.length > maxActions,
      totalInTier: tier2Actions.length,
    };
  }

  // If Tier 1 & 2 are empty, check Tier 3
  const tier3Actions = getApplicableActions(TIER_3_ACTIONS, userData);
  if (tier3Actions.length > 0) {
    return {
      actions: tier3Actions.slice(0, maxActions),
      tier: 3,
      tierLabel: 'Long-term Goals',
      hasMoreInTier: tier3Actions.length > maxActions,
      totalInTier: tier3Actions.length,
    };
  }

  // All complete!
  return {
    actions: [],
    tier: 0,
    tierLabel: 'All Complete',
    hasMoreInTier: false,
    totalInTier: 0,
  };
}

/**
 * Get all actions for all tiers (for debugging/admin view)
 */
export function getAllTierActions(userData) {
  return {
    tier1: getApplicableActions(TIER_1_ACTIONS, userData),
    tier2: getApplicableActions(TIER_2_ACTIONS, userData),
    tier3: getApplicableActions(TIER_3_ACTIONS, userData),
  };
}

/**
 * Build userData object from various data sources
 * Helper to construct the userData object expected by getPriorityActions
 *
 * @param {Object} data - Raw data from various sources
 * @returns {Object} - Normalized userData for priority action evaluation
 */
export function buildUserDataForPriorityActions({
  academicProfile = {},
  clinicalEntries = [],
  shadowStats = {},
  eventStats = {},
  certifications = [],
  organizations = [],
  eqReflections = [],
  leadershipEntries = [],
  volunteeringEntries = [],
  researchEntries = [],
  prerequisites = [],
  applicationMaterials = {},
}) {
  // Calculate missing prerequisites
  const corePrereqs = ['anatomy', 'physiology', 'general_chemistry', 'statistics'];
  const completedPrereqTypes = (prerequisites || [])
    .filter((p) => p.status === 'completed')
    .map((p) => p.courseType);
  const missingPrereqs = corePrereqs.filter((p) => !completedPrereqTypes.includes(p)).length;

  // Check for CCRN
  const hasCCRN = (certifications || []).some(
    (c) => c.type?.toLowerCase().includes('ccrn') || c.name?.toLowerCase().includes('ccrn')
  );

  // Check for AANA event
  const hasAANAEvent = (eventStats?.categories || []).some(
    (c) => c.toLowerCase().includes('aana')
  );

  // Check for advanced devices (Tier 3-4)
  const advancedDevices = ['ecmo', 'impella', 'lvad', 'iabp', 'crrt'];
  const hasAdvancedDevices = (clinicalEntries || []).some((entry) => {
    const devices = (entry.devices || []).map((d) => (typeof d === 'string' ? d : d.deviceId));
    return advancedDevices.some((ad) => devices.includes(ad));
  });

  return {
    gpaEntered: !!(academicProfile.overallGpa || academicProfile.scienceGpa),
    scienceGpa: academicProfile.scienceGpa || null,
    overallGpa: academicProfile.overallGpa || null,
    clinicalEntries: clinicalEntries.length,
    shadowHours: shadowStats.totalHours || 0,
    eventsLogged: eventStats.totalLogged || 0,
    certificationsLogged: certifications.length > 0,
    certCount: certifications.length,
    organizationsLogged: organizations.length > 0,
    eqReflections: eqReflections.length,
    leadershipEntries: leadershipEntries.length,
    volunteeringEntries: volunteeringEntries.length,
    researchEntries: researchEntries.length,
    missingPrereqs,
    hasCCRN,
    hasAANAEvent,
    hasAdvancedDevices,
    greTaken: !!(academicProfile.greQuantitative && academicProfile.greVerbal),
    icuYears: academicProfile.icuYears || 0,
    publications: researchEntries.filter((r) => r.type === 'publication').length,
    personalStatementStarted: applicationMaterials?.personalStatement?.started || false,
  };
}

export default {
  getPriorityActions,
  getAllTierActions,
  buildUserDataForPriorityActions,
};
