/**
 * Fit Score Calculator
 *
 * Compares user profile data against school requirements
 * to generate a match percentage and detailed breakdown.
 *
 * Data sources:
 * - User profile: mockUser.js (academic, clinical), mockUserUnitProfile.js (location)
 * - School requirements: schools.js
 *
 * TODO: Replace mock imports with API calls to Supabase
 */

/**
 * Calculate fit score between user profile and school requirements
 * @param {Object} school - School data from schools.js
 * @param {Object} userProfile - Combined user profile data
 * @returns {Object} { score: number, breakdown: Array, message: string }
 */
export function calculateFitScore(school, userProfile) {
  const breakdown = [];
  let totalPoints = 0;
  let earnedPoints = 0;

  // 1. GPA Match (weight: 25 points)
  const gpaResult = checkGpa(school, userProfile);
  breakdown.push(gpaResult);
  totalPoints += 25;
  earnedPoints += gpaResult.points;

  // 2. GRE Match (weight: 20 points)
  const greResult = checkGre(school, userProfile);
  breakdown.push(greResult);
  totalPoints += 20;
  earnedPoints += greResult.points;

  // 3. Experience Type Match (weight: 20 points)
  const experienceResult = checkExperience(school, userProfile);
  breakdown.push(experienceResult);
  totalPoints += 20;
  earnedPoints += experienceResult.points;

  // 4. Years of Experience (weight: 15 points)
  const yearsResult = checkYearsExperience(school, userProfile);
  breakdown.push(yearsResult);
  totalPoints += 15;
  earnedPoints += yearsResult.points;

  // 5. CCRN Certification (weight: 10 points)
  const ccrnResult = checkCcrn(school, userProfile);
  breakdown.push(ccrnResult);
  totalPoints += 10;
  earnedPoints += ccrnResult.points;

  // 6. State/Location Match (weight: 10 points - bonus, doesn't penalize)
  const stateResult = checkState(school, userProfile);
  breakdown.push(stateResult);
  // State is bonus only - add to earned but not total
  earnedPoints += stateResult.points;

  // Calculate percentage (cap at 100)
  const score = Math.min(100, Math.round((earnedPoints / totalPoints) * 100));

  // Generate encouraging message based on score
  const message = getEncouragingMessage(score, breakdown);

  return {
    score,
    breakdown: breakdown.filter(b => b.display), // Only show relevant items
    message,
    earnedPoints,
    totalPoints,
  };
}

/**
 * Check GPA requirements
 */
function checkGpa(school, userProfile) {
  const requiredGpa = school.minimumGpa || 3.0;
  const userGpa = userProfile.scienceGpa || userProfile.overallGpa || 0;

  if (!userGpa) {
    return {
      id: 'gpa',
      label: 'GPA',
      status: 'unknown',
      icon: 'help',
      detail: `Requires ${requiredGpa}+ (Add your GPA)`,
      points: 0,
      display: true,
    };
  }

  const meetsRequirement = userGpa >= requiredGpa;
  const difference = userGpa - requiredGpa;

  return {
    id: 'gpa',
    label: 'GPA',
    status: meetsRequirement ? 'pass' : 'warning',
    icon: meetsRequirement ? 'check' : 'alert',
    detail: meetsRequirement
      ? `${requiredGpa} required (You: ${userGpa.toFixed(2)})`
      : `${requiredGpa} required (You: ${userGpa.toFixed(2)})`,
    points: meetsRequirement ? 25 : (difference > -0.3 ? 15 : 5),
    display: true,
  };
}

/**
 * Check GRE requirements
 */
function checkGre(school, userProfile) {
  const greRequired = school.greRequired;
  const userHasGre = userProfile.greQuantitative && userProfile.greVerbal;

  if (!greRequired) {
    return {
      id: 'gre',
      label: 'GRE',
      status: 'pass',
      icon: 'check',
      detail: 'Not required',
      points: 20,
      display: true,
    };
  }

  if (school.greWaivedFor) {
    return {
      id: 'gre',
      label: 'GRE',
      status: 'info',
      icon: 'info',
      detail: `Required (waived for: ${school.greWaivedFor})`,
      points: userHasGre ? 20 : 10,
      display: true,
    };
  }

  if (!userHasGre) {
    return {
      id: 'gre',
      label: 'GRE',
      status: 'warning',
      icon: 'alert',
      detail: 'Required (You: Not taken)',
      points: 0,
      display: true,
    };
  }

  return {
    id: 'gre',
    label: 'GRE',
    status: 'pass',
    icon: 'check',
    detail: `Required (You: ${userProfile.greQuantitative + userProfile.greVerbal})`,
    points: 20,
    display: true,
  };
}

/**
 * Check ICU experience type match
 */
function checkExperience(school, userProfile) {
  const userIcuType = userProfile.primaryIcuType?.toLowerCase() || '';
  const additionalTypes = userProfile.additionalIcuTypes || [];
  const allUserTypes = [userIcuType, ...additionalTypes.map(t => t.toLowerCase())];

  // Check what the school accepts
  const accepts = {
    nicu: school.acceptsNicu,
    picu: school.acceptsPicu,
    er: school.acceptsEr,
    other: school.acceptsOtherCriticalCare,
  };

  // Standard ICU types always accepted
  const standardIcuTypes = ['micu', 'sicu', 'cvicu', 'ccu', 'cticu', 'neuro_icu', 'trauma_icu', 'mixed_icu'];
  const isStandardIcu = allUserTypes.some(t => standardIcuTypes.includes(t));

  if (isStandardIcu) {
    return {
      id: 'experience',
      label: 'ICU Type',
      status: 'pass',
      icon: 'check',
      detail: `Accepts ${formatIcuType(userIcuType)}`,
      points: 20,
      display: true,
    };
  }

  // Check specialty types
  if (userIcuType === 'nicu' && accepts.nicu) {
    return {
      id: 'experience',
      label: 'ICU Type',
      status: 'pass',
      icon: 'check',
      detail: 'Accepts NICU experience',
      points: 20,
      display: true,
    };
  }

  if (userIcuType === 'picu' && accepts.picu) {
    return {
      id: 'experience',
      label: 'ICU Type',
      status: 'pass',
      icon: 'check',
      detail: 'Accepts PICU experience',
      points: 20,
      display: true,
    };
  }

  if (userIcuType === 'er' && accepts.er) {
    return {
      id: 'experience',
      label: 'ICU Type',
      status: 'pass',
      icon: 'check',
      detail: 'Accepts ER experience',
      points: 20,
      display: true,
    };
  }

  // Doesn't match
  return {
    id: 'experience',
    label: 'ICU Type',
    status: 'warning',
    icon: 'alert',
    detail: `May not accept ${formatIcuType(userIcuType)}`,
    points: 5,
    display: true,
  };
}

/**
 * Check years of ICU experience
 */
function checkYearsExperience(school, userProfile) {
  const requiredYears = school.minimumExperience || 1;
  const userYears = userProfile.totalYearsExperience || 0;

  if (!userYears) {
    return {
      id: 'years',
      label: 'Experience',
      status: 'unknown',
      icon: 'help',
      detail: `${requiredYears}+ years required`,
      points: 0,
      display: true,
    };
  }

  const meetsRequirement = userYears >= requiredYears;

  return {
    id: 'years',
    label: 'Experience',
    status: meetsRequirement ? 'pass' : 'warning',
    icon: meetsRequirement ? 'check' : 'alert',
    detail: meetsRequirement
      ? `${requiredYears}+ years (You: ${userYears})`
      : `${requiredYears}+ years required (You: ${userYears})`,
    points: meetsRequirement ? 15 : (userYears >= requiredYears - 0.5 ? 10 : 5),
    display: true,
  };
}

/**
 * Check CCRN certification
 */
function checkCcrn(school, userProfile) {
  const ccrnRequired = school.ccrnRequired;
  const userHasCcrn = userProfile.certifications?.some(
    c => c.type === 'ccrn' && c.status === 'passed'
  );

  if (!ccrnRequired) {
    return {
      id: 'ccrn',
      label: 'CCRN',
      status: 'info',
      icon: 'info',
      detail: 'Not required',
      points: 10,
      display: false, // Don't show if not required
    };
  }

  return {
    id: 'ccrn',
    label: 'CCRN',
    status: userHasCcrn ? 'pass' : 'warning',
    icon: userHasCcrn ? 'check' : 'alert',
    detail: userHasCcrn ? 'Required (You have it!)' : 'Required (You need this)',
    points: userHasCcrn ? 10 : 0,
    display: true,
  };
}

/**
 * Check state/location (bonus points only)
 */
function checkState(school, userProfile) {
  const schoolState = school.state;
  const userState = userProfile.hospitalState;

  if (!userState) {
    return {
      id: 'state',
      label: 'Location',
      status: 'info',
      icon: 'info',
      detail: school.state,
      points: 0,
      display: false,
    };
  }

  const isMatch = schoolState?.toLowerCase() === userState?.toLowerCase();

  return {
    id: 'state',
    label: 'Location',
    status: isMatch ? 'bonus' : 'info',
    icon: isMatch ? 'star' : 'info',
    detail: isMatch ? `Your state (${schoolState})` : schoolState,
    points: isMatch ? 5 : 0, // Bonus points, doesn't penalize
    display: isMatch, // Only show if match
  };
}

/**
 * Generate encouraging message based on score
 */
function getEncouragingMessage(score, breakdown) {
  const warnings = breakdown.filter(b => b.status === 'warning');

  if (score >= 90) {
    return "Excellent match! You're highly competitive.";
  }
  if (score >= 75) {
    return "Strong match - you meet most requirements.";
  }
  if (score >= 60) {
    if (warnings.length === 1) {
      return `Good fit with one gap: ${warnings[0].label}`;
    }
    return "Solid option - a few areas to strengthen.";
  }
  if (score >= 40) {
    return "Worth considering - work on key gaps.";
  }
  return "May need significant preparation.";
}

/**
 * Format ICU type for display
 */
function formatIcuType(type) {
  const typeMap = {
    micu: 'MICU',
    sicu: 'SICU',
    cvicu: 'CVICU',
    ccu: 'CCU',
    cticu: 'CTICU',
    neuro_icu: 'Neuro ICU',
    trauma_icu: 'Trauma ICU',
    mixed_icu: 'Mixed ICU',
    nicu: 'NICU',
    picu: 'PICU',
    er: 'ER',
  };
  return typeMap[type?.toLowerCase()] || type?.toUpperCase() || 'ICU';
}

/**
 * Get fit score color based on percentage
 */
export function getFitScoreColor(score) {
  if (score >= 80) return 'green';
  if (score >= 60) return 'yellow';
  return 'red';
}

/**
 * Get status icon component name
 */
export function getStatusIcon(status) {
  const iconMap = {
    pass: 'CheckCircle2',
    warning: 'AlertCircle',
    info: 'Info',
    unknown: 'HelpCircle',
    bonus: 'Star',
  };
  return iconMap[status] || 'Circle';
}

export default {
  calculateFitScore,
  getFitScoreColor,
  getStatusIcon,
};
