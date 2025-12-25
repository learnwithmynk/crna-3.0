/**
 * Simple Acuity Level Calculator
 *
 * Calculates a simple High/Medium/Low acuity indicator for display on the Stats page.
 * This is separate from the detailed 0-100 Acuity Score used in ReadyScore calculation.
 *
 * Purpose: Quick visual indicator for mentors - "this person has worked with sick patients"
 *
 * Key Markers of High Acuity ICU Experience:
 * 1. Most patients are intubated (mechanical ventilation)
 * 2. Most have invasive lines (A-line or central line)
 * 3. Many are on vasopressors (levophed, neo, vasopressin)
 * 4. Some experience with advanced devices (CRRT, LVAD, ECMO, IABP, Impella)
 *
 * Thresholds:
 * - HIGH: 50%+ vent, 50%+ lines, 50%+ vasopressors, 3+ entries with advanced devices
 * - MEDIUM: 30%+ vent, 30%+ lines, 30%+ vasopressors (no advanced device requirement)
 * - LOW: Below 30% thresholds
 */

// Device/Medication IDs from clinicalCategories.js
const ACUITY_MARKERS = {
  // Mechanical ventilation (intubated)
  mechanicalVent: ['mechanical_vent'],

  // Invasive lines (A-line OR central line)
  invasiveLines: ['arterial_line', 'central_line'],

  // Vasopressors (life-saving drips)
  vasopressors: ['norepinephrine', 'phenylephrine', 'vasopressin', 'epinephrine', 'dopamine'],

  // High acuity devices (Tier 3-4)
  advancedDevices: ['ecmo', 'impella', 'lvad', 'iabp', 'crrt'],
};

// Minimum entries required for meaningful acuity assessment
const MIN_ENTRIES = 5;

// Acuity level definitions
const ACUITY_LEVELS = {
  high: {
    level: 'high',
    label: 'High Acuity',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    description: 'Complex ICU experience with critically ill patients',
  },
  medium: {
    level: 'medium',
    label: 'Medium Acuity',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: 'Solid ICU experience with acutely ill patients',
  },
  low: {
    level: 'low',
    label: 'Building',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    description: 'Continue logging entries with high acuity patients',
  },
  insufficient: {
    level: 'insufficient',
    label: 'Not enough data',
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    description: 'Log at least 5 clinical entries to see your acuity level',
  },
};

/**
 * Extract device IDs from entry
 */
function getDeviceIds(entry) {
  return (entry.devices || []).map((d) => (typeof d === 'string' ? d : d.deviceId));
}

/**
 * Extract medication IDs from entry
 */
function getMedicationIds(entry) {
  return (entry.medications || []).map((m) => (typeof m === 'string' ? m : m.medicationId));
}

/**
 * Calculate simple acuity level from clinical entries
 *
 * @param {Array} entries - Clinical experience entries
 * @returns {Object} - Acuity level info { level, label, color, bgColor, description, stats }
 */
export function calculateSimpleAcuityLevel(entries) {
  if (!entries || entries.length < MIN_ENTRIES) {
    return {
      ...ACUITY_LEVELS.insufficient,
      stats: {
        totalEntries: entries?.length || 0,
        ventPercent: 0,
        invasivePercent: 0,
        vasopressorPercent: 0,
        advancedDeviceCount: 0,
      },
    };
  }

  const totalEntries = entries.length;

  // Count entries with each marker
  let ventCount = 0;
  let invasiveLineCount = 0;
  let vasopressorCount = 0;
  const advancedDeviceEntries = new Set(); // Count unique entries with advanced devices

  entries.forEach((entry, index) => {
    const devices = getDeviceIds(entry);
    const meds = getMedicationIds(entry);

    // Check for mechanical vent
    if (ACUITY_MARKERS.mechanicalVent.some((v) => devices.includes(v))) {
      ventCount++;
    }

    // Check for invasive lines (either A-line OR central line counts)
    if (ACUITY_MARKERS.invasiveLines.some((l) => devices.includes(l))) {
      invasiveLineCount++;
    }

    // Check for vasopressors
    if (ACUITY_MARKERS.vasopressors.some((v) => meds.includes(v))) {
      vasopressorCount++;
    }

    // Check for advanced devices
    if (ACUITY_MARKERS.advancedDevices.some((d) => devices.includes(d))) {
      advancedDeviceEntries.add(index);
    }
  });

  // Calculate percentages
  const ventPercent = ventCount / totalEntries;
  const invasivePercent = invasiveLineCount / totalEntries;
  const vasopressorPercent = vasopressorCount / totalEntries;
  const advancedDeviceCount = advancedDeviceEntries.size;

  // Stats for debugging/display
  const stats = {
    totalEntries,
    ventPercent: Math.round(ventPercent * 100),
    invasivePercent: Math.round(invasivePercent * 100),
    vasopressorPercent: Math.round(vasopressorPercent * 100),
    advancedDeviceCount,
  };

  // HIGH ACUITY CRITERIA:
  // - 50%+ entries have mechanical ventilation
  // - 50%+ entries have invasive lines (A-line or central)
  // - 50%+ entries have vasopressors
  // - 3+ entries with advanced devices (ECMO, LVAD, IABP, Impella, CRRT)
  const isHigh =
    ventPercent >= 0.5 &&
    invasivePercent >= 0.5 &&
    vasopressorPercent >= 0.5 &&
    advancedDeviceCount >= 3;

  // MEDIUM ACUITY CRITERIA:
  // - 30%+ entries have mechanical ventilation
  // - 30%+ entries have invasive lines
  // - 30%+ entries have vasopressors
  // (no advanced device requirement)
  const isMedium =
    ventPercent >= 0.3 && invasivePercent >= 0.3 && vasopressorPercent >= 0.3;

  if (isHigh) {
    return { ...ACUITY_LEVELS.high, stats };
  }

  if (isMedium) {
    return { ...ACUITY_LEVELS.medium, stats };
  }

  return { ...ACUITY_LEVELS.low, stats };
}

/**
 * Get all acuity level definitions (for legend display)
 */
export function getAcuityLevels() {
  return ACUITY_LEVELS;
}

/**
 * Get acuity markers (for documentation/display)
 */
export function getAcuityMarkers() {
  return ACUITY_MARKERS;
}

export default calculateSimpleAcuityLevel;
