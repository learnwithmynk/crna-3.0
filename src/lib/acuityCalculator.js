/**
 * Acuity Score Calculator
 *
 * Calculates a 0-100 acuity score based on clinical experience entries.
 * Higher scores indicate more complex, varied ICU experience.
 *
 * Scoring Components:
 * - Device Complexity (30%): Tier 4 devices weighted 4x
 * - Medication Variety (25%): Unique drug categories logged
 * - Procedure Participation (20%): "Could teach" weighted higher
 * - Patient Population Diversity (15%): Variety of patient types
 * - Vasopressor Depth (10%): Unique pressors + frequency
 *
 * Readiness Levels:
 * - Emerging (<40): Building foundation
 * - Developing (40-59): Growing experience
 * - Strong (60-79): Solid preparation
 * - Exceptional (80+): Outstanding experience
 */

import {
  DEVICES,
  MEDICATIONS,
  MEDICATION_CATEGORIES,
  getDeviceInfo,
  getMedicationInfo,
} from '@/data/clinicalCategories';

// =============================================================================
// CONSTANTS
// =============================================================================

const WEIGHTS = {
  deviceComplexity: 0.30,
  medicationVariety: 0.25,
  procedureParticipation: 0.20,
  populationDiversity: 0.15,
  vasopressorDepth: 0.10,
};

// Readiness levels - Peach Sunrise theme (Clinical)
const READINESS_LEVELS = [
  { min: 0, max: 39, level: 'emerging', label: 'Emerging', color: 'text-[#A08070]', bgColor: 'bg-[#FFF6F0]' },
  { min: 40, max: 59, level: 'developing', label: 'Developing', color: 'text-[#B07050]', bgColor: 'bg-[#FFF0E8]' },
  { min: 60, max: 79, level: 'strong', label: 'Strong', color: 'text-[#8B4030]', bgColor: 'bg-[#FFE8DC]' },
  { min: 80, max: 100, level: 'exceptional', label: 'Exceptional', color: 'text-[#7A3020]', bgColor: 'bg-[#FFD8C8]' },
];

// Target benchmarks for scoring (based on typical strong applicant)
const BENCHMARKS = {
  tier4Devices: 3,      // 3 unique tier 4 devices = max score
  tier3Devices: 5,      // 5 unique tier 3 devices = max score
  tier2Devices: 8,      // 8 unique tier 2 devices = max score
  medicationCategories: 7, // 7 unique categories = max score
  uniqueMedications: 20,   // 20 unique meds = max score
  procedures: 10,          // 10 unique procedures = max score
  populations: 6,          // 6 unique populations = max score
  vasopressors: 5,         // 5 unique vasopressors = max score
  codesRapids: 5,          // 5 codes/rapids = max score
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Clamp a value between 0 and 1
 */
function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculate score as percentage of benchmark
 */
function scoreAgainstBenchmark(value, benchmark) {
  return clamp(value / benchmark);
}

/**
 * Get confidence weight multiplier
 */
function getConfidenceWeight(level) {
  switch (level) {
    case 'could_teach': return 1.0;
    case 'used_it': return 0.7;
    case 'observed': return 0.3;
    default: return 0.5;
  }
}

// =============================================================================
// SCORING COMPONENTS
// =============================================================================

/**
 * Calculate Device Complexity Score (30%)
 * Weighted by tier: Tier 4 = 4x, Tier 3 = 3x, Tier 2 = 2x, Tier 1 = 1x
 */
function calculateDeviceScore(entries) {
  const deviceExperience = {};

  entries.forEach((entry) => {
    entry.devices?.forEach((d) => {
      const deviceId = typeof d === 'string' ? d : d.deviceId;
      const confidence = typeof d === 'string' ? 'used_it' : d.confidenceLevel;
      const deviceInfo = getDeviceInfo(deviceId);

      if (deviceInfo) {
        if (!deviceExperience[deviceId]) {
          deviceExperience[deviceId] = {
            tier: deviceInfo.tier,
            maxConfidence: confidence,
            count: 0,
          };
        }
        deviceExperience[deviceId].count++;
        // Track highest confidence level achieved
        if (getConfidenceWeight(confidence) > getConfidenceWeight(deviceExperience[deviceId].maxConfidence)) {
          deviceExperience[deviceId].maxConfidence = confidence;
        }
      }
    });
  });

  // Count devices by tier with confidence weighting
  let tier4Score = 0;
  let tier3Score = 0;
  let tier2Score = 0;
  let tier1Score = 0;

  Object.values(deviceExperience).forEach((exp) => {
    const weight = getConfidenceWeight(exp.maxConfidence);
    switch (exp.tier) {
      case 4: tier4Score += weight; break;
      case 3: tier3Score += weight; break;
      case 2: tier2Score += weight; break;
      case 1: tier1Score += weight; break;
    }
  });

  // Weight by tier importance (tier 4 most valuable)
  const weightedScore =
    (scoreAgainstBenchmark(tier4Score, BENCHMARKS.tier4Devices) * 0.4) +
    (scoreAgainstBenchmark(tier3Score, BENCHMARKS.tier3Devices) * 0.3) +
    (scoreAgainstBenchmark(tier2Score, BENCHMARKS.tier2Devices) * 0.2) +
    (scoreAgainstBenchmark(tier1Score, 5) * 0.1);

  return {
    score: weightedScore * 100,
    details: {
      tier4: Math.round(tier4Score),
      tier3: Math.round(tier3Score),
      tier2: Math.round(tier2Score),
      tier1: Math.round(tier1Score),
      total: Object.keys(deviceExperience).length,
    },
  };
}

/**
 * Calculate Medication Variety Score (25%)
 * Based on category coverage and unique medications
 */
function calculateMedicationScore(entries) {
  const medicationExperience = {};
  const categoriesSeen = new Set();

  entries.forEach((entry) => {
    entry.medications?.forEach((m) => {
      const medId = typeof m === 'string' ? m : m.medicationId;
      const confidence = typeof m === 'string' ? 'used_it' : m.confidenceLevel;
      const medInfo = getMedicationInfo(medId);

      if (medInfo) {
        categoriesSeen.add(medInfo.category);

        if (!medicationExperience[medId]) {
          medicationExperience[medId] = {
            category: medInfo.category,
            maxConfidence: confidence,
            count: 0,
          };
        }
        medicationExperience[medId].count++;
        if (getConfidenceWeight(confidence) > getConfidenceWeight(medicationExperience[medId].maxConfidence)) {
          medicationExperience[medId].maxConfidence = confidence;
        }
      }
    });
  });

  const uniqueMeds = Object.keys(medicationExperience).length;
  const uniqueCategories = categoriesSeen.size;

  // Weight: 60% category coverage, 40% unique meds
  const categoryScore = scoreAgainstBenchmark(uniqueCategories, BENCHMARKS.medicationCategories);
  const medsScore = scoreAgainstBenchmark(uniqueMeds, BENCHMARKS.uniqueMedications);

  return {
    score: ((categoryScore * 0.6) + (medsScore * 0.4)) * 100,
    details: {
      uniqueMedications: uniqueMeds,
      uniqueCategories,
      categories: Array.from(categoriesSeen),
    },
  };
}

/**
 * Calculate Procedure Participation Score (20%)
 * Weighted by confidence level
 */
function calculateProcedureScore(entries) {
  const procedureExperience = {};
  let codeRapidCount = 0;

  entries.forEach((entry) => {
    if (entry.codeOrRapidResponse) codeRapidCount++;

    entry.procedures?.forEach((p) => {
      const procId = typeof p === 'string' ? p : p.procedureId;
      const confidence = typeof p === 'string' ? 'used_it' : p.confidenceLevel;

      if (!procedureExperience[procId]) {
        procedureExperience[procId] = {
          maxConfidence: confidence,
          count: 0,
        };
      }
      procedureExperience[procId].count++;
      if (getConfidenceWeight(confidence) > getConfidenceWeight(procedureExperience[procId].maxConfidence)) {
        procedureExperience[procId].maxConfidence = confidence;
      }
    });
  });

  // Calculate weighted procedure count
  let weightedProcedures = 0;
  Object.values(procedureExperience).forEach((exp) => {
    weightedProcedures += getConfidenceWeight(exp.maxConfidence);
  });

  // 70% procedures, 30% codes/rapids
  const procedureScore = scoreAgainstBenchmark(weightedProcedures, BENCHMARKS.procedures);
  const codeScore = scoreAgainstBenchmark(codeRapidCount, BENCHMARKS.codesRapids);

  return {
    score: ((procedureScore * 0.7) + (codeScore * 0.3)) * 100,
    details: {
      uniqueProcedures: Object.keys(procedureExperience).length,
      weightedProcedures: Math.round(weightedProcedures * 10) / 10,
      codeRapidCount,
    },
  };
}

/**
 * Calculate Population Diversity Score (15%)
 */
function calculatePopulationScore(entries) {
  const populationsSeen = new Set();

  entries.forEach((entry) => {
    entry.patientPopulations?.forEach((p) => {
      populationsSeen.add(p);
    });
  });

  const uniquePopulations = populationsSeen.size;

  return {
    score: scoreAgainstBenchmark(uniquePopulations, BENCHMARKS.populations) * 100,
    details: {
      uniquePopulations,
      populations: Array.from(populationsSeen),
    },
  };
}

/**
 * Calculate Vasopressor Depth Score (10%)
 * Focused specifically on vasopressor experience
 */
function calculateVasopressorScore(entries) {
  const vasopressorExp = {};

  entries.forEach((entry) => {
    entry.medications?.forEach((m) => {
      const medId = typeof m === 'string' ? m : m.medicationId;
      const confidence = typeof m === 'string' ? 'used_it' : m.confidenceLevel;
      const medInfo = getMedicationInfo(medId);

      if (medInfo?.category === 'vasopressors' || medInfo?.category === 'inotropes') {
        if (!vasopressorExp[medId]) {
          vasopressorExp[medId] = {
            maxConfidence: confidence,
            count: 0,
          };
        }
        vasopressorExp[medId].count++;
        if (getConfidenceWeight(confidence) > getConfidenceWeight(vasopressorExp[medId].maxConfidence)) {
          vasopressorExp[medId].maxConfidence = confidence;
        }
      }
    });
  });

  // Calculate weighted count
  let weightedCount = 0;
  Object.values(vasopressorExp).forEach((exp) => {
    weightedCount += getConfidenceWeight(exp.maxConfidence);
  });

  return {
    score: scoreAgainstBenchmark(weightedCount, BENCHMARKS.vasopressors) * 100,
    details: {
      uniqueVasopressors: Object.keys(vasopressorExp).length,
      weightedCount: Math.round(weightedCount * 10) / 10,
    },
  };
}

// =============================================================================
// MAIN CALCULATOR
// =============================================================================

/**
 * Calculate full acuity score from clinical entries
 */
export function calculateAcuityScore(entries) {
  if (!entries || entries.length === 0) {
    return {
      totalScore: 0,
      readinessLevel: READINESS_LEVELS[0],
      components: {
        deviceComplexity: { score: 0, details: {} },
        medicationVariety: { score: 0, details: {} },
        procedureParticipation: { score: 0, details: {} },
        populationDiversity: { score: 0, details: {} },
        vasopressorDepth: { score: 0, details: {} },
      },
      strengths: [],
      gaps: [],
      entryCount: 0,
    };
  }

  // Calculate each component
  const deviceScore = calculateDeviceScore(entries);
  const medicationScore = calculateMedicationScore(entries);
  const procedureScore = calculateProcedureScore(entries);
  const populationScore = calculatePopulationScore(entries);
  const vasopressorScore = calculateVasopressorScore(entries);

  // Calculate weighted total
  const totalScore = Math.round(
    (deviceScore.score * WEIGHTS.deviceComplexity) +
    (medicationScore.score * WEIGHTS.medicationVariety) +
    (procedureScore.score * WEIGHTS.procedureParticipation) +
    (populationScore.score * WEIGHTS.populationDiversity) +
    (vasopressorScore.score * WEIGHTS.vasopressorDepth)
  );

  // Determine readiness level
  const readinessLevel = READINESS_LEVELS.find(
    (level) => totalScore >= level.min && totalScore <= level.max
  ) || READINESS_LEVELS[0];

  // Identify strengths (score >= 70)
  const strengths = [];
  const gaps = [];

  const components = [
    { name: 'Device Complexity', score: deviceScore.score, key: 'deviceComplexity' },
    { name: 'Medication Variety', score: medicationScore.score, key: 'medicationVariety' },
    { name: 'Procedure Experience', score: procedureScore.score, key: 'procedureParticipation' },
    { name: 'Population Diversity', score: populationScore.score, key: 'populationDiversity' },
    { name: 'Vasopressor Depth', score: vasopressorScore.score, key: 'vasopressorDepth' },
  ];

  components.forEach(({ name, score }) => {
    if (score >= 70) {
      strengths.push(name);
    } else if (score < 40) {
      gaps.push(name);
    }
  });

  return {
    totalScore,
    readinessLevel,
    components: {
      deviceComplexity: deviceScore,
      medicationVariety: medicationScore,
      procedureParticipation: procedureScore,
      populationDiversity: populationScore,
      vasopressorDepth: vasopressorScore,
    },
    strengths,
    gaps,
    entryCount: entries.length,
  };
}

/**
 * Get readiness level info
 */
export function getReadinessLevel(score) {
  return READINESS_LEVELS.find(
    (level) => score >= level.min && score <= level.max
  ) || READINESS_LEVELS[0];
}

/**
 * Get all readiness levels for legend
 */
export function getReadinessLevels() {
  return READINESS_LEVELS;
}

export default calculateAcuityScore;
