/**
 * Smart Suggestions Engine
 *
 * Compares user's logged clinical experience to peer aggregates
 * and generates personalized suggestions for experience gaps.
 *
 * Generates prompts like:
 * - "72% of CVICU nurses log Impella - do you have access?"
 * - "You're missing experience with CRRT that 62% of MICU nurses have"
 * - "Great job! You have Propofol experience like 88% of your peers"
 */

import { getAggregatesForUnit } from '@/data/mockClinicalAggregates';
import {
  getMedicationInfo,
  getDeviceInfo,
  getProcedureInfo,
} from '@/data/clinicalCategories';

// =============================================================================
// TYPES OF SUGGESTIONS
// =============================================================================

const SUGGESTION_TYPES = {
  MISSING_COMMON: 'missing_common',      // Missing something peers commonly have
  RARE_STRENGTH: 'rare_strength',        // Has something relatively rare
  GOAL_SUGGESTION: 'goal_suggestion',    // Monthly goal idea
  COMPARISON_POSITIVE: 'comparison_pos', // Positive comparison to peers
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Extract logged item IDs from entries
 */
function extractLoggedItems(entries) {
  const medications = new Set();
  const devices = new Set();
  const procedures = new Set();

  entries.forEach((entry) => {
    entry.medications?.forEach((m) => {
      const id = typeof m === 'string' ? m : m.medicationId;
      medications.add(id);
    });
    entry.devices?.forEach((d) => {
      const id = typeof d === 'string' ? d : d.deviceId;
      devices.add(id);
    });
    entry.procedures?.forEach((p) => {
      const id = typeof p === 'string' ? p : p.procedureId;
      procedures.add(id);
    });
  });

  return { medications, devices, procedures };
}

/**
 * Generate a friendly message for missing items
 */
function generateMissingMessage(item, percentage, category) {
  const messages = [
    `${percentage}% of nurses in your ICU type log ${item.label} - do you have access?`,
    `${item.label} is common (${percentage}%) - consider logging when you encounter it`,
    `Many peers (${percentage}%) track ${item.label} experience`,
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Generate a friendly message for strengths
 */
function generateStrengthMessage(item, percentage) {
  if (percentage < 50) {
    return `Great! You have ${item.label} experience - only ${percentage}% of peers do!`;
  }
  return `You're on track with ${item.label} like ${percentage}% of your peers`;
}

// =============================================================================
// MAIN SUGGESTION GENERATOR
// =============================================================================

/**
 * Generate smart suggestions based on user entries and unit type
 */
export function generateSmartSuggestions(entries, unitType = 'mixed_icu') {
  const suggestions = [];
  const aggregates = getAggregatesForUnit(unitType);
  const logged = extractLoggedItems(entries);

  // Find missing common medications (>60% of peers have)
  aggregates.commonMedications.forEach((med) => {
    if (!logged.medications.has(med.id) && med.percentLogging >= 60) {
      const info = getMedicationInfo(med.id);
      if (info) {
        suggestions.push({
          type: SUGGESTION_TYPES.MISSING_COMMON,
          category: 'medication',
          itemId: med.id,
          item: info,
          percentage: med.percentLogging,
          message: generateMissingMessage(info, med.percentLogging, 'medication'),
          priority: med.percentLogging, // Higher percentage = higher priority
        });
      }
    }
  });

  // Find missing common devices (>50% of peers have)
  aggregates.commonDevices.forEach((dev) => {
    if (!logged.devices.has(dev.id) && dev.percentLogging >= 50) {
      const info = getDeviceInfo(dev.id);
      if (info) {
        suggestions.push({
          type: SUGGESTION_TYPES.MISSING_COMMON,
          category: 'device',
          itemId: dev.id,
          item: info,
          percentage: dev.percentLogging,
          message: generateMissingMessage(info, dev.percentLogging, 'device'),
          priority: dev.percentLogging + (info.tier * 10), // Boost tier 4 devices
        });
      }
    }
  });

  // Find missing common procedures (>50% of peers have)
  aggregates.commonProcedures.forEach((proc) => {
    if (!logged.procedures.has(proc.id) && proc.percentLogging >= 50) {
      const info = getProcedureInfo(proc.id);
      if (info) {
        suggestions.push({
          type: SUGGESTION_TYPES.MISSING_COMMON,
          category: 'procedure',
          itemId: proc.id,
          item: info,
          percentage: proc.percentLogging,
          message: generateMissingMessage(info, proc.percentLogging, 'procedure'),
          priority: proc.percentLogging + (info.highValue ? 15 : 0),
        });
      }
    }
  });

  // Sort by priority (highest first) and limit
  suggestions.sort((a, b) => b.priority - a.priority);

  return suggestions.slice(0, 6); // Return top 6 suggestions
}

/**
 * Generate experience gaps summary
 */
export function generateExperienceGaps(entries, unitType = 'mixed_icu') {
  const aggregates = getAggregatesForUnit(unitType);
  const logged = extractLoggedItems(entries);

  const gaps = {
    medications: [],
    devices: [],
    procedures: [],
  };

  // Find high-priority missing medications
  aggregates.commonMedications
    .filter((m) => !logged.medications.has(m.id) && m.percentLogging >= 70)
    .slice(0, 5)
    .forEach((m) => {
      const info = getMedicationInfo(m.id);
      if (info) gaps.medications.push({ ...info, percentLogging: m.percentLogging });
    });

  // Find high-priority missing devices (especially tier 3-4)
  aggregates.commonDevices
    .filter((d) => !logged.devices.has(d.id) && d.percentLogging >= 40)
    .slice(0, 5)
    .forEach((d) => {
      const info = getDeviceInfo(d.id);
      if (info) gaps.devices.push({ ...info, percentLogging: d.percentLogging });
    });

  // Find high-priority missing procedures
  aggregates.commonProcedures
    .filter((p) => !logged.procedures.has(p.id) && p.percentLogging >= 50)
    .slice(0, 5)
    .forEach((p) => {
      const info = getProcedureInfo(p.id);
      if (info) gaps.procedures.push({ ...info, percentLogging: p.percentLogging });
    });

  return gaps;
}

/**
 * Generate strengths (things user has that are relatively rare)
 */
export function generateStrengths(entries, unitType = 'mixed_icu') {
  const aggregates = getAggregatesForUnit(unitType);
  const logged = extractLoggedItems(entries);
  const strengths = [];

  // Find rare devices the user has (tier 4, <50% of peers)
  aggregates.commonDevices.forEach((dev) => {
    if (logged.devices.has(dev.id)) {
      const info = getDeviceInfo(dev.id);
      if (info && info.tier >= 3 && dev.percentLogging < 60) {
        strengths.push({
          category: 'device',
          item: info,
          percentage: dev.percentLogging,
          message: generateStrengthMessage(info, dev.percentLogging),
        });
      }
    }
  });

  // Find rare procedures the user has
  aggregates.commonProcedures.forEach((proc) => {
    if (logged.procedures.has(proc.id)) {
      const info = getProcedureInfo(proc.id);
      if (info && info.highValue && proc.percentLogging < 60) {
        strengths.push({
          category: 'procedure',
          item: info,
          percentage: proc.percentLogging,
          message: generateStrengthMessage(info, proc.percentLogging),
        });
      }
    }
  });

  return strengths.slice(0, 4);
}

/**
 * Generate monthly goals based on gaps
 */
export function generateMonthlyGoals(entries, unitType = 'mixed_icu') {
  const gaps = generateExperienceGaps(entries, unitType);
  const goals = [];

  // Suggest 1 device goal if missing tier 3-4 devices
  const tierDevice = gaps.devices.find((d) => d.tier >= 3);
  if (tierDevice) {
    goals.push({
      type: 'device',
      item: tierDevice,
      message: `Goal: Log experience with ${tierDevice.label} this month`,
    });
  }

  // Suggest 1 medication goal
  if (gaps.medications.length > 0) {
    const med = gaps.medications[0];
    goals.push({
      type: 'medication',
      item: med,
      message: `Goal: Document ${med.label} titration when you encounter it`,
    });
  }

  // Suggest 1 procedure goal
  if (gaps.procedures.length > 0) {
    const proc = gaps.procedures[0];
    goals.push({
      type: 'procedure',
      item: proc,
      message: `Goal: Participate in ${proc.label} when opportunity arises`,
    });
  }

  return goals;
}

/**
 * Get comparison stats vs peers
 */
export function getComparisonStats(entries, unitType = 'mixed_icu') {
  const aggregates = getAggregatesForUnit(unitType);
  const logged = extractLoggedItems(entries);

  // Calculate overlap percentages
  const medOverlap = aggregates.commonMedications.filter((m) =>
    logged.medications.has(m.id)
  ).length / aggregates.commonMedications.length;

  const deviceOverlap = aggregates.commonDevices.filter((d) =>
    logged.devices.has(d.id)
  ).length / aggregates.commonDevices.length;

  const procOverlap = aggregates.commonProcedures.filter((p) =>
    logged.procedures.has(p.id)
  ).length / aggregates.commonProcedures.length;

  return {
    unitType,
    unitLabel: aggregates.label,
    sampleSize: aggregates.sampleSize,
    averageAcuityScore: aggregates.averageAcuityScore,
    medicationCoverage: Math.round(medOverlap * 100),
    deviceCoverage: Math.round(deviceOverlap * 100),
    procedureCoverage: Math.round(procOverlap * 100),
    overallCoverage: Math.round(((medOverlap + deviceOverlap + procOverlap) / 3) * 100),
  };
}

export default {
  generateSmartSuggestions,
  generateExperienceGaps,
  generateStrengths,
  generateMonthlyGoals,
  getComparisonStats,
};
