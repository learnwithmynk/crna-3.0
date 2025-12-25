/**
 * CRNA School ReadyScore™ Calculator
 *
 * Calculates the CRNA School ReadyScore™ (0-100) from multiple data sources:
 * - Academic (25%): GPA meets program requirements + prerequisites
 * - Clinical Experience (20%): ICU type, years, acuity, skills logged
 * - Shadowing (15%): Hours vs 40-hour goal, unique CRNAs, settings
 * - Leadership & Research (15%): Professional development, projects, publications
 * - Engagement & Events (15%): AANA events, open houses, networking
 * - Certifications & Exams (10%): CCRN, GRE, CSC, CMC, etc.
 *
 * ReadyScore Levels:
 * - Emerging (<40): Just getting started
 * - Developing (40-59): Building momentum
 * - Strong (60-79): Well-prepared
 * - Exceptional (80+): Outstanding preparation
 *
 * @see /docs/skills/readyscore-system.md for full specification
 */

import { programRequirementBenchmarks } from '@/data/mockStatsPage';

// =============================================================================
// CONSTANTS
// =============================================================================

const WEIGHTS = {
  academic: 0.25,
  clinical: 0.20,
  shadowing: 0.15,
  leadership: 0.15,
  engagement: 0.15,
  certifications: 0.10,
};

const SHADOW_GOAL_HOURS = 40;

const READINESS_LEVELS = [
  { min: 0, max: 39, level: 'emerging', label: 'Emerging', color: 'text-gray-600', bgColor: 'bg-gray-100', description: 'Just getting started' },
  { min: 40, max: 59, level: 'developing', label: 'Developing', color: 'text-blue-600', bgColor: 'bg-blue-100', description: 'Building momentum' },
  { min: 60, max: 79, level: 'strong', label: 'Strong', color: 'text-green-600', bgColor: 'bg-green-100', description: 'Well-prepared' },
  { min: 80, max: 100, level: 'exceptional', label: 'Exceptional', color: 'text-purple-600', bgColor: 'bg-purple-100', description: 'Outstanding preparation' },
];

// Leadership tiers with point values
const LEADERSHIP_TIERS = {
  'none': 0,
  'committee_member': 40,
  'preceptor': 60,
  'charge_nurse': 70,
  'project_lead': 85,
  'council_member': 100,
};

// Research tiers with point values
const RESEARCH_TIERS = {
  'none': 0,
  'ebp_project': 40,
  'poster_presentation': 60,
  'published_article': 85,
  'clinical_research_team': 100,
};

// Event type weights for engagement scoring
const EVENT_WEIGHTS = {
  'aana_national': 30,
  'aana_state': 20,
  'school_open_house': 15,
  'info_session': 10,
  'workshop': 10,
  'other': 5,
};

// =============================================================================
// COMPONENT CALCULATORS
// =============================================================================

/**
 * Calculate Academic Score (0-100)
 * GPA (60%) + Prerequisites (40%)
 */
function calculateAcademicScore(academicProfile) {
  if (!academicProfile) return { score: 0, details: {} };

  const { scienceGpa, overallGpa, last60Gpa, completedPrerequisites } = academicProfile;
  const details = {};

  // GPA Component (60% of Academic score)
  let gpaScore = 0;
  if (scienceGpa || overallGpa || last60Gpa) {
    // Weight: Overall 30%, Science 40%, Last60 30%
    const overall = overallGpa || 0;
    const science = scienceGpa || 0;
    const last60 = last60Gpa || overall; // Fall back to overall if no last60

    const weightedGpa = (overall * 0.3) + (science * 0.4) + (last60 * 0.3);

    if (weightedGpa >= 3.7) gpaScore = 100;
    else if (weightedGpa >= 3.5) gpaScore = 85;
    else if (weightedGpa >= 3.3) gpaScore = 70;
    else if (weightedGpa >= 3.0) gpaScore = 55;
    else gpaScore = 40;

    details.gpa = {
      overall: overallGpa,
      science: scienceGpa,
      last60: last60Gpa,
      weightedGpa: Math.round(weightedGpa * 100) / 100,
      gpaScore,
    };
  }

  // Prerequisites Component (40% of Academic score)
  let prereqScore = 0;
  const corePrereqs = ['anatomy', 'physiology', 'general_chemistry', 'organic_chemistry',
                       'biochemistry', 'statistics', 'physics', 'microbiology'];
  const totalRequired = corePrereqs.length;

  if (completedPrerequisites?.length > 0) {
    const completedCore = completedPrerequisites.filter(p =>
      corePrereqs.includes(p.courseType)
    );

    // Base score from completion count
    prereqScore = (completedCore.length / totalRequired) * 100;

    // Bonus: No prereqs with grade < B adds +10 (capped at 100)
    const hasLowGrades = completedCore.some(p =>
      p.grade && ['C', 'C+', 'C-', 'D', 'D+', 'D-', 'F'].includes(p.grade)
    );
    if (!hasLowGrades && completedCore.length > 0) {
      prereqScore = Math.min(100, prereqScore + 10);
    }

    details.prerequisites = {
      completed: completedPrerequisites.length,
      coreCompleted: completedCore.length,
      coreTotal: totalRequired,
      hasLowGrades,
    };
  }

  // Final Academic Score
  const score = Math.round((gpaScore * 0.6) + (prereqScore * 0.4));

  return { score, details };
}

/**
 * Calculate Clinical Experience Score (0-100)
 * ICU Years (40%) + ICU Type/Acuity (30%) + Skills Diversity (30%)
 */
function calculateClinicalScore(clinicalProfile, clinicalEntries = []) {
  if (!clinicalProfile) return { score: 0, details: {} };

  const { primaryIcuType, totalYearsExperience } = clinicalProfile;
  const details = {};

  // ICU Years (40% of Clinical score)
  const years = totalYearsExperience || 0;
  const yearsScore = Math.min(100, (years / 3) * 100); // Max at 3 years
  details.years = { value: years, score: yearsScore };

  // ICU Type/Acuity (30% of Clinical score)
  const acuityScores = {
    'cvicu': 100,
    'cticu': 100,
    'sicu': 100,
    'trauma_icu': 100,
    'micu': 85,
    'neuro_icu': 85,
    'burn_icu': 90,
    'mixed': 80,
    'picu': 75,
    'nicu': 70,
    'flight_nurse': 95,
    'other': 60,
  };
  const acuityScore = acuityScores[primaryIcuType] || 60;
  details.acuity = { type: primaryIcuType, score: acuityScore };

  // Skills Diversity (30% of Clinical score)
  let skillsLogged = 0;
  if (clinicalEntries?.length > 0) {
    const uniqueSkills = new Set();
    clinicalEntries.forEach(entry => {
      (entry.medications || []).forEach(m => uniqueSkills.add(`med_${m}`));
      (entry.devices || []).forEach(d => uniqueSkills.add(`dev_${d}`));
      (entry.procedures || []).forEach(p => uniqueSkills.add(`proc_${p}`));
      (entry.populations || []).forEach(p => uniqueSkills.add(`pop_${p}`));
    });
    skillsLogged = uniqueSkills.size;
  }
  const skillsScore = Math.min(100, (skillsLogged / 50) * 100); // Max at 50 unique
  details.skills = { count: skillsLogged, score: skillsScore };

  // Final Clinical Score
  const score = Math.round((yearsScore * 0.4) + (acuityScore * 0.3) + (skillsScore * 0.3));

  return { score, details };
}

/**
 * Calculate Shadowing Score (0-100)
 * Hours (50%) + Unique CRNAs (30%) + Setting Diversity (20%)
 */
function calculateShadowingScore(shadowStats, goal = SHADOW_GOAL_HOURS) {
  if (!shadowStats) return { score: 0, details: {} };

  const { totalHours = 0, totalDays = 0, uniqueCRNAs = 0, uniqueSettings = 0 } = shadowStats;

  // Hours (50% of Shadow score)
  const hoursScore = Math.min(100, (totalHours / goal) * 100);

  // Unique CRNAs (30% of Shadow score)
  const crnaScore = Math.min(100, (uniqueCRNAs / 5) * 100); // Max at 5 CRNAs

  // Setting Diversity (20% of Shadow score)
  const settingsScore = Math.min(100, (uniqueSettings / 3) * 100); // Max at 3 settings

  const score = Math.round((hoursScore * 0.5) + (crnaScore * 0.3) + (settingsScore * 0.2));

  return {
    score,
    details: {
      totalHours,
      goal,
      percentOfGoal: Math.round((totalHours / goal) * 100),
      uniqueCRNAs,
      uniqueSettings,
      totalDays,
    },
  };
}

/**
 * Calculate Leadership & Research Score (0-100)
 * Takes the higher of leadership or research tier
 */
function calculateLeadershipScore(userProfile) {
  if (!userProfile) return { score: 0, details: {} };

  const { leadershipLevel = 'none', researchLevel = 'none' } = userProfile;

  const leadershipScore = LEADERSHIP_TIERS[leadershipLevel] || 0;
  const researchScore = RESEARCH_TIERS[researchLevel] || 0;

  // Take the higher of the two
  const score = Math.max(leadershipScore, researchScore);

  return {
    score,
    details: {
      leadershipLevel,
      leadershipScore,
      researchLevel,
      researchScore,
      primaryContributor: leadershipScore >= researchScore ? 'leadership' : 'research',
    },
  };
}

/**
 * Calculate Engagement & Events Score (0-100)
 * Event attendance weighted by type
 */
function calculateEngagementScore(eventStats, eventsAttended = []) {
  const details = {};
  let score = 0;

  // Calculate from events attended (weighted by type)
  if (eventsAttended?.length > 0) {
    eventsAttended.forEach(event => {
      const eventType = event.type || event.category || 'other';
      score += EVENT_WEIGHTS[eventType] || EVENT_WEIGHTS.other;
    });
  } else if (eventStats) {
    // Fallback to stats if no detailed events
    const { totalLogged = 0, programsEngaged = 0 } = eventStats;
    // Estimate score based on total logged (assume 10 points each avg)
    score = totalLogged * 10;
    // Bonus for engaging multiple programs
    score += programsEngaged * 5;

    details.totalLogged = totalLogged;
    details.programsEngaged = programsEngaged;
  }

  score = Math.min(100, score); // Cap at 100

  return {
    score,
    details: {
      ...details,
      eventsCount: eventsAttended?.length || eventStats?.totalLogged || 0,
    },
  };
}

/**
 * Calculate Certifications & Exams Score (0-100)
 * CCRN (50) + Other certs (max 30) + GRE (20)
 */
function calculateCertificationsScore(clinicalProfile, academicProfile) {
  let score = 0;
  const details = { certs: [], hasGRE: false };

  if (clinicalProfile?.certifications) {
    const certs = clinicalProfile.certifications;

    // CCRN is critical (50 points)
    const hasCCRN = certs.some(c =>
      c.type?.toLowerCase() === 'ccrn' && c.status === 'passed'
    );
    if (hasCCRN) {
      score += 50;
      details.certs.push('CCRN');
    }

    // Other valuable certs (10 points each, max 30)
    const otherCertTypes = ['csc', 'cmc', 'tncc', 'pals', 'nihss', 'acls'];
    let otherCertCount = 0;
    certs.forEach(c => {
      if (c.status === 'passed' && otherCertTypes.includes(c.type?.toLowerCase())) {
        otherCertCount++;
        details.certs.push(c.type.toUpperCase());
      }
    });
    score += Math.min(otherCertCount * 10, 30);
  }

  // GRE (20 points if taken)
  if (academicProfile) {
    const hasGRE = academicProfile.greQuantitative && academicProfile.greVerbal;
    if (hasGRE) {
      score += 20;
      details.hasGRE = true;
      details.greScores = {
        quantitative: academicProfile.greQuantitative,
        verbal: academicProfile.greVerbal,
        writing: academicProfile.greAnalyticalWriting,
      };
    }
  }

  return {
    score: Math.min(100, score),
    details,
  };
}

// =============================================================================
// MAIN CALCULATOR
// =============================================================================

/**
 * Calculate full ReadyScore from all data sources
 *
 * @param {Object} params
 * @param {Object} params.academicProfile - GPA, prereqs, GRE scores
 * @param {Object} params.clinicalProfile - ICU type, years, certifications
 * @param {Array} params.clinicalEntries - Clinical tracker entries
 * @param {Object} params.shadowStats - Shadow hours, CRNAs, settings
 * @param {Object} params.userProfile - Leadership/research levels
 * @param {Object} params.eventStats - Event attendance stats
 * @param {Array} params.eventsAttended - Detailed events list
 */
export function calculateReadinessScore({
  academicProfile,
  clinicalProfile,
  clinicalEntries,
  shadowStats,
  userProfile,
  eventStats,
  eventsAttended,
  // Legacy params for backwards compatibility
  clinicalAcuityScore,
  applicationMaterials,
  targetProgramCount,
}) {
  // Calculate each component
  const academicResult = calculateAcademicScore(academicProfile);
  const clinicalResult = calculateClinicalScore(clinicalProfile, clinicalEntries);
  const shadowingResult = calculateShadowingScore(shadowStats);
  const leadershipResult = calculateLeadershipScore(userProfile);
  const engagementResult = calculateEngagementScore(eventStats, eventsAttended);
  const certificationsResult = calculateCertificationsScore(clinicalProfile, academicProfile);

  // Weighted total
  const totalScore = Math.round(
    (academicResult.score * WEIGHTS.academic) +
    (clinicalResult.score * WEIGHTS.clinical) +
    (shadowingResult.score * WEIGHTS.shadowing) +
    (leadershipResult.score * WEIGHTS.leadership) +
    (engagementResult.score * WEIGHTS.engagement) +
    (certificationsResult.score * WEIGHTS.certifications)
  );

  // Determine readiness level
  const readinessLevel = READINESS_LEVELS.find(
    (level) => totalScore >= level.min && totalScore <= level.max
  ) || READINESS_LEVELS[0];

  // Build component scores array
  const componentScores = [
    { key: 'academic', label: 'Academic', score: academicResult.score, weight: WEIGHTS.academic },
    { key: 'clinical', label: 'Clinical Experience', score: clinicalResult.score, weight: WEIGHTS.clinical },
    { key: 'shadowing', label: 'Shadowing', score: shadowingResult.score, weight: WEIGHTS.shadowing },
    { key: 'leadership', label: 'Leadership & Research', score: leadershipResult.score, weight: WEIGHTS.leadership },
    { key: 'engagement', label: 'Engagement & Events', score: engagementResult.score, weight: WEIGHTS.engagement },
    { key: 'certifications', label: 'Certifications & Exams', score: certificationsResult.score, weight: WEIGHTS.certifications },
  ];

  // Identify strongest and weakest areas
  const sorted = [...componentScores].sort((a, b) => b.score - a.score);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  return {
    totalScore,
    readinessLevel,
    components: {
      academic: academicResult,
      clinical: clinicalResult,
      shadowing: shadowingResult,
      leadership: leadershipResult,
      engagement: engagementResult,
      certifications: certificationsResult,
    },
    componentScores,
    strongest,
    weakest,
    focusArea: weakest.score < 50 ? weakest : null,
  };
}

/**
 * Generate actionable drivers (focus areas) based on readiness data
 * Returns up to 3 focus areas with supportive, non-anxiety-inducing copy
 */
export function getDrivers(readinessResult, userData = {}) {
  const drivers = [];
  const { components } = readinessResult;

  // Priority order based on impact (CCRN first, then by weight)

  // CCRN is critical
  if (components.certifications?.details?.certs &&
      !components.certifications.details.certs.includes('CCRN')) {
    drivers.push({
      id: 'ccrn',
      action: 'Get CCRN certified',
      context: 'Most programs require this certification',
      area: 'certifications',
      priority: 1,
    });
  }

  // Shadow hours
  if (components.shadowing?.details) {
    const { totalHours, goal } = components.shadowing.details;
    if (totalHours < goal) {
      drivers.push({
        id: 'shadow',
        action: 'Log more shadow experiences',
        context: `You have ${totalHours} hours — aim for ${goal}+`,
        area: 'shadowing',
        priority: 2,
      });
    }
  }

  // Prerequisites
  if (components.academic?.details?.prerequisites) {
    const { coreCompleted, coreTotal } = components.academic.details.prerequisites;
    const remaining = coreTotal - coreCompleted;
    if (remaining > 0) {
      drivers.push({
        id: 'prereqs',
        action: 'Complete missing prerequisites',
        context: `${remaining} course${remaining > 1 ? 's' : ''} remaining`,
        area: 'academic',
        priority: 3,
      });
    }
  }

  // ICU experience
  if (components.clinical?.details?.years) {
    const years = components.clinical.details.years.value;
    if (years < 2) {
      drivers.push({
        id: 'icu_years',
        action: 'Continue building ICU experience',
        context: 'Most programs prefer 2+ years',
        area: 'clinical',
        priority: 4,
      });
    }
  }

  // Events/engagement
  if (components.engagement?.score < 30) {
    drivers.push({
      id: 'events',
      action: 'Attend a CRNA networking event',
      context: 'Great way to learn about programs',
      area: 'engagement',
      priority: 5,
    });
  }

  // Leadership/research
  if (components.leadership?.score === 0) {
    drivers.push({
      id: 'leadership',
      action: 'Get involved in a leadership role or project',
      context: 'Shows initiative beyond clinical work',
      area: 'leadership',
      priority: 6,
    });
  }

  // Sort by priority and return top 3
  return drivers.sort((a, b) => a.priority - b.priority).slice(0, 3);
}

/**
 * Generate weekly focus recommendation based on readiness data
 */
export function generateWeeklyFocus(readinessResult) {
  if (!readinessResult) return null;

  const { weakest, components } = readinessResult;

  // Focus recommendations by area
  const focusRecommendations = {
    academic: {
      area: 'Academic',
      action: 'Review your GPA calculation or consider a prereq refresh course',
      icon: 'GraduationCap',
    },
    clinical: {
      area: 'Clinical Experience',
      action: 'Log your shifts this week to build your clinical portfolio',
      icon: 'Stethoscope',
    },
    shadowing: {
      area: 'Shadowing',
      action: 'Schedule your next shadow day or log recent experiences',
      icon: 'Eye',
    },
    leadership: {
      area: 'Leadership & Research',
      action: 'Look for a committee or project to get involved with',
      icon: 'Award',
    },
    engagement: {
      area: 'Program Engagement',
      action: 'Attend an info session or reach out to a target program',
      icon: 'Calendar',
    },
    certifications: {
      area: 'Certifications',
      action: 'Work toward your CCRN or schedule your GRE',
      icon: 'Award',
    },
  };

  // Get specific recommendation based on weakest area
  const recommendation = { ...focusRecommendations[weakest.key] };

  // Add specific details if available
  if (weakest.key === 'shadowing' && components.shadowing?.details) {
    const { totalHours, goal } = components.shadowing.details;
    const hoursNeeded = goal - totalHours;
    if (hoursNeeded > 0) {
      recommendation.action = `Log ${Math.min(8, hoursNeeded)} more shadow hours to reach your ${goal}-hour goal`;
    }
  }

  if (weakest.key === 'certifications' && components.certifications?.details) {
    const { certs, hasGRE } = components.certifications.details;
    if (!certs.includes('CCRN')) {
      recommendation.action = 'Start preparing for your CCRN certification';
    } else if (!hasGRE) {
      recommendation.action = 'Consider scheduling your GRE exam';
    }
  }

  return {
    ...recommendation,
    score: weakest.score,
    priority: weakest.score < 30 ? 'high' : weakest.score < 50 ? 'medium' : 'low',
  };
}

/**
 * Get readiness level info by score
 */
export function getReadinessLevel(score) {
  return READINESS_LEVELS.find(
    (level) => score >= level.min && score <= level.max
  ) || READINESS_LEVELS[0];
}

/**
 * Get all readiness levels for legend/reference
 */
export function getReadinessLevels() {
  return READINESS_LEVELS;
}

/**
 * Get the weights used for scoring
 */
export function getWeights() {
  return { ...WEIGHTS };
}

/**
 * Get the shadow hour goal
 */
export function getShadowGoal() {
  return SHADOW_GOAL_HOURS;
}

export default {
  calculateReadinessScore,
  getDrivers,
  generateWeeklyFocus,
  getReadinessLevel,
  getReadinessLevels,
  getWeights,
  getShadowGoal,
};
