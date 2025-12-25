/**
 * Mock Clinical Aggregates
 *
 * Simulated peer comparison data by ICU type.
 * Used for smart suggestions like "72% of CVICU nurses log Impella"
 *
 * TODO: Replace with API call to Supabase aggregated data
 */

// =============================================================================
// PEER AGGREGATES BY ICU TYPE
// =============================================================================

export const PEER_AGGREGATES = {
  cvicu: {
    unitType: 'cvicu',
    label: 'CVICU',
    sampleSize: 847,
    averageAcuityScore: 72,
    commonMedications: [
      { id: 'norepinephrine', percentLogging: 94, label: 'Norepinephrine' },
      { id: 'epinephrine', percentLogging: 88, label: 'Epinephrine' },
      { id: 'milrinone', percentLogging: 85, label: 'Milrinone' },
      { id: 'vasopressin', percentLogging: 82, label: 'Vasopressin' },
      { id: 'propofol', percentLogging: 91, label: 'Propofol' },
      { id: 'fentanyl', percentLogging: 89, label: 'Fentanyl' },
      { id: 'heparin', percentLogging: 87, label: 'Heparin' },
      { id: 'amiodarone', percentLogging: 76, label: 'Amiodarone' },
      { id: 'dobutamine', percentLogging: 71, label: 'Dobutamine' },
      { id: 'nicardipine', percentLogging: 68, label: 'Nicardipine' },
    ],
    commonDevices: [
      { id: 'arterial_line', percentLogging: 98, label: 'Arterial Line' },
      { id: 'central_line', percentLogging: 96, label: 'Central Line' },
      { id: 'mechanical_vent', percentLogging: 94, label: 'Mechanical Vent' },
      { id: 'pa_catheter', percentLogging: 78, label: 'PA Catheter' },
      { id: 'iabp', percentLogging: 72, label: 'IABP' },
      { id: 'impella', percentLogging: 58, label: 'Impella' },
      { id: 'ecmo', percentLogging: 45, label: 'ECMO' },
      { id: 'lvad', percentLogging: 38, label: 'LVAD' },
      { id: 'external_pacer', percentLogging: 65, label: 'External Pacer' },
      { id: 'crrt', percentLogging: 52, label: 'CRRT' },
    ],
    commonProcedures: [
      { id: 'cardioversion', percentLogging: 72, label: 'Cardioversion' },
      { id: 'central_line_assist', percentLogging: 85, label: 'Central Line Assist' },
      { id: 'intubation_assist', percentLogging: 68, label: 'Intubation Assist' },
      { id: 'code_participation', percentLogging: 64, label: 'Code Participation' },
      { id: 'blood_administration', percentLogging: 91, label: 'Blood Administration' },
    ],
  },

  micu: {
    unitType: 'micu',
    label: 'MICU',
    sampleSize: 1243,
    averageAcuityScore: 65,
    commonMedications: [
      { id: 'norepinephrine', percentLogging: 92, label: 'Norepinephrine' },
      { id: 'vasopressin', percentLogging: 85, label: 'Vasopressin' },
      { id: 'propofol', percentLogging: 88, label: 'Propofol' },
      { id: 'fentanyl', percentLogging: 91, label: 'Fentanyl' },
      { id: 'midazolam', percentLogging: 72, label: 'Midazolam' },
      { id: 'cisatracurium', percentLogging: 68, label: 'Cisatracurium' },
      { id: 'hydrocortisone', percentLogging: 74, label: 'Hydrocortisone' },
      { id: 'dexmedetomidine', percentLogging: 76, label: 'Precedex' },
      { id: 'rocuronium', percentLogging: 65, label: 'Rocuronium' },
      { id: 'phenylephrine', percentLogging: 58, label: 'Phenylephrine' },
    ],
    commonDevices: [
      { id: 'mechanical_vent', percentLogging: 96, label: 'Mechanical Vent' },
      { id: 'arterial_line', percentLogging: 94, label: 'Arterial Line' },
      { id: 'central_line', percentLogging: 92, label: 'Central Line' },
      { id: 'bipap_cpap', percentLogging: 85, label: 'BiPAP/CPAP' },
      { id: 'crrt', percentLogging: 62, label: 'CRRT' },
      { id: 'ecmo', percentLogging: 28, label: 'ECMO' },
      { id: 'chest_tube', percentLogging: 58, label: 'Chest Tube' },
      { id: 'flotrac', percentLogging: 45, label: 'FloTrac' },
    ],
    commonProcedures: [
      { id: 'intubation_assist', percentLogging: 82, label: 'Intubation Assist' },
      { id: 'proning', percentLogging: 74, label: 'Patient Proning' },
      { id: 'central_line_assist', percentLogging: 78, label: 'Central Line Assist' },
      { id: 'code_participation', percentLogging: 71, label: 'Code Participation' },
      { id: 'rapid_response', percentLogging: 68, label: 'Rapid Response' },
      { id: 'bronchoscopy_assist', percentLogging: 52, label: 'Bronchoscopy Assist' },
    ],
  },

  sicu: {
    unitType: 'sicu',
    label: 'SICU',
    sampleSize: 956,
    averageAcuityScore: 68,
    commonMedications: [
      { id: 'norepinephrine', percentLogging: 90, label: 'Norepinephrine' },
      { id: 'propofol', percentLogging: 92, label: 'Propofol' },
      { id: 'fentanyl', percentLogging: 94, label: 'Fentanyl' },
      { id: 'ketamine', percentLogging: 58, label: 'Ketamine' },
      { id: 'rocuronium', percentLogging: 72, label: 'Rocuronium' },
      { id: 'vasopressin', percentLogging: 78, label: 'Vasopressin' },
      { id: 'midazolam', percentLogging: 65, label: 'Midazolam' },
      { id: 'heparin', percentLogging: 75, label: 'Heparin' },
    ],
    commonDevices: [
      { id: 'mechanical_vent', percentLogging: 94, label: 'Mechanical Vent' },
      { id: 'arterial_line', percentLogging: 96, label: 'Arterial Line' },
      { id: 'central_line', percentLogging: 95, label: 'Central Line' },
      { id: 'chest_tube', percentLogging: 72, label: 'Chest Tube' },
      { id: 'ng_og_tube', percentLogging: 88, label: 'NG/OG Tube' },
      { id: 'rapid_infuser', percentLogging: 62, label: 'Rapid Infuser' },
      { id: 'crrt', percentLogging: 48, label: 'CRRT' },
    ],
    commonProcedures: [
      { id: 'blood_administration', percentLogging: 88, label: 'Blood Administration' },
      { id: 'intubation_assist', percentLogging: 78, label: 'Intubation Assist' },
      { id: 'central_line_assist', percentLogging: 82, label: 'Central Line Assist' },
      { id: 'chest_tube_assist', percentLogging: 65, label: 'Chest Tube Assist' },
      { id: 'code_participation', percentLogging: 58, label: 'Code Participation' },
    ],
  },

  neuro_icu: {
    unitType: 'neuro_icu',
    label: 'Neuro ICU',
    sampleSize: 423,
    averageAcuityScore: 70,
    commonMedications: [
      { id: 'propofol', percentLogging: 94, label: 'Propofol' },
      { id: 'fentanyl', percentLogging: 88, label: 'Fentanyl' },
      { id: 'nicardipine', percentLogging: 82, label: 'Nicardipine' },
      { id: 'norepinephrine', percentLogging: 76, label: 'Norepinephrine' },
      { id: 'midazolam', percentLogging: 68, label: 'Midazolam' },
      { id: 'labetalol', percentLogging: 72, label: 'Labetalol' },
      { id: 'dexmedetomidine', percentLogging: 65, label: 'Precedex' },
      { id: 'rocuronium', percentLogging: 58, label: 'Rocuronium' },
    ],
    commonDevices: [
      { id: 'mechanical_vent', percentLogging: 92, label: 'Mechanical Vent' },
      { id: 'arterial_line', percentLogging: 94, label: 'Arterial Line' },
      { id: 'evd', percentLogging: 78, label: 'EVD' },
      { id: 'icp_monitor', percentLogging: 72, label: 'ICP Monitor' },
      { id: 'central_line', percentLogging: 88, label: 'Central Line' },
      { id: 'lumbar_drain', percentLogging: 45, label: 'Lumbar Drain' },
      { id: 'targeted_temp', percentLogging: 52, label: 'Targeted Temperature' },
    ],
    commonProcedures: [
      { id: 'intubation_assist', percentLogging: 85, label: 'Intubation Assist' },
      { id: 'lumbar_puncture_assist', percentLogging: 62, label: 'LP Assist' },
      { id: 'rapid_response', percentLogging: 74, label: 'Rapid Response' },
      { id: 'code_participation', percentLogging: 55, label: 'Code Participation' },
    ],
  },

  trauma_icu: {
    unitType: 'trauma_icu',
    label: 'Trauma ICU',
    sampleSize: 512,
    averageAcuityScore: 71,
    commonMedications: [
      { id: 'norepinephrine', percentLogging: 88, label: 'Norepinephrine' },
      { id: 'propofol', percentLogging: 92, label: 'Propofol' },
      { id: 'fentanyl', percentLogging: 95, label: 'Fentanyl' },
      { id: 'ketamine', percentLogging: 72, label: 'Ketamine' },
      { id: 'rocuronium', percentLogging: 78, label: 'Rocuronium' },
      { id: 'vasopressin', percentLogging: 74, label: 'Vasopressin' },
      { id: 'epinephrine', percentLogging: 62, label: 'Epinephrine' },
    ],
    commonDevices: [
      { id: 'mechanical_vent', percentLogging: 94, label: 'Mechanical Vent' },
      { id: 'arterial_line', percentLogging: 96, label: 'Arterial Line' },
      { id: 'central_line', percentLogging: 94, label: 'Central Line' },
      { id: 'chest_tube', percentLogging: 78, label: 'Chest Tube' },
      { id: 'icp_monitor', percentLogging: 65, label: 'ICP Monitor' },
      { id: 'evd', percentLogging: 52, label: 'EVD' },
      { id: 'rapid_infuser', percentLogging: 72, label: 'Rapid Infuser' },
    ],
    commonProcedures: [
      { id: 'blood_administration', percentLogging: 92, label: 'Blood Administration' },
      { id: 'intubation_assist', percentLogging: 85, label: 'Intubation Assist' },
      { id: 'chest_tube_assist', percentLogging: 72, label: 'Chest Tube Assist' },
      { id: 'code_participation', percentLogging: 68, label: 'Code Participation' },
      { id: 'needle_decompression', percentLogging: 35, label: 'Needle Decompression' },
    ],
  },

  mixed_icu: {
    unitType: 'mixed_icu',
    label: 'Mixed ICU',
    sampleSize: 2156,
    averageAcuityScore: 62,
    commonMedications: [
      { id: 'norepinephrine', percentLogging: 88, label: 'Norepinephrine' },
      { id: 'propofol', percentLogging: 85, label: 'Propofol' },
      { id: 'fentanyl', percentLogging: 90, label: 'Fentanyl' },
      { id: 'vasopressin', percentLogging: 72, label: 'Vasopressin' },
      { id: 'midazolam', percentLogging: 65, label: 'Midazolam' },
      { id: 'dexmedetomidine', percentLogging: 62, label: 'Precedex' },
    ],
    commonDevices: [
      { id: 'mechanical_vent', percentLogging: 92, label: 'Mechanical Vent' },
      { id: 'arterial_line', percentLogging: 88, label: 'Arterial Line' },
      { id: 'central_line', percentLogging: 85, label: 'Central Line' },
      { id: 'bipap_cpap', percentLogging: 78, label: 'BiPAP/CPAP' },
      { id: 'crrt', percentLogging: 42, label: 'CRRT' },
    ],
    commonProcedures: [
      { id: 'intubation_assist', percentLogging: 72, label: 'Intubation Assist' },
      { id: 'central_line_assist', percentLogging: 68, label: 'Central Line Assist' },
      { id: 'code_participation', percentLogging: 58, label: 'Code Participation' },
      { id: 'blood_administration', percentLogging: 75, label: 'Blood Administration' },
    ],
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get aggregates for a specific ICU type
 */
export function getAggregatesForUnit(unitType) {
  return PEER_AGGREGATES[unitType] || PEER_AGGREGATES.mixed_icu;
}

/**
 * Get all available unit types
 */
export function getAvailableUnitTypes() {
  return Object.entries(PEER_AGGREGATES).map(([key, data]) => ({
    value: key,
    label: data.label,
    sampleSize: data.sampleSize,
  }));
}

/**
 * Get top medications for a unit type
 */
export function getTopMedicationsForUnit(unitType, limit = 10) {
  const aggregates = getAggregatesForUnit(unitType);
  return aggregates.commonMedications.slice(0, limit);
}

/**
 * Get top devices for a unit type
 */
export function getTopDevicesForUnit(unitType, limit = 10) {
  const aggregates = getAggregatesForUnit(unitType);
  return aggregates.commonDevices.slice(0, limit);
}

/**
 * Get top procedures for a unit type
 */
export function getTopProceduresForUnit(unitType, limit = 10) {
  const aggregates = getAggregatesForUnit(unitType);
  return aggregates.commonProcedures.slice(0, limit);
}

export default PEER_AGGREGATES;
