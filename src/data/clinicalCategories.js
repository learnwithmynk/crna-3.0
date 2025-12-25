/**
 * Clinical Experience Tracker Categories
 *
 * Defines all tag options for patient populations, medications,
 * devices, and procedures. Includes complexity tiers for devices
 * and flashcard flags for medications.
 *
 * TODO: Replace with API call to Supabase
 */

// =============================================================================
// PATIENT POPULATIONS
// =============================================================================

export const PATIENT_POPULATIONS = [
  { value: 'cardiac', label: 'Cardiac', description: 'Heart failure, post-CABG, arrhythmias, MI' },
  { value: 'neuro', label: 'Neuro', description: 'Stroke, TBI, seizures, ICP monitoring' },
  { value: 'trauma', label: 'Trauma', description: 'Multi-trauma, MVA, penetrating injuries' },
  { value: 'renal', label: 'Renal', description: 'AKI, ESRD, dialysis, electrolyte issues' },
  { value: 'liver', label: 'Liver', description: 'Cirrhosis, liver failure, hepatic encephalopathy' },
  { value: 'pulmonary', label: 'Pulmonary', description: 'ARDS, pneumonia, respiratory failure' },
  { value: 'surgical', label: 'Surgical', description: 'Post-op complications, wound care' },
  { value: 'medical', label: 'Medical', description: 'Sepsis, DKA, overdose, general medicine' },
  { value: 'transplant', label: 'Transplant', description: 'Pre/post transplant, immunosuppression' },
  { value: 'ld_ob', label: 'L&D/OB', description: 'High-risk obstetrics, postpartum' },
  { value: 'ortho', label: 'Ortho', description: 'Orthopedic surgery, fractures, joint replacement' },
  { value: 'burn', label: 'Burn', description: 'Major burns, skin grafts, fluid resuscitation' },
  { value: 'oncology', label: 'Oncology', description: 'Cancer, chemo complications, tumor lysis' },
];

// =============================================================================
// MEDICATIONS/INFUSIONS
// =============================================================================

export const MEDICATION_CATEGORIES = [
  {
    category: 'vasopressors',
    label: 'Vasopressors',
    icon: 'Activity',
    color: 'bg-red-100 text-red-700',
  },
  {
    category: 'sedatives',
    label: 'Sedatives/Anesthetics',
    icon: 'Moon',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    category: 'analgesics',
    label: 'Analgesics',
    icon: 'Pill',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    category: 'paralytics',
    label: 'Paralytics/NMBAs',
    icon: 'Zap',
    color: 'bg-orange-100 text-orange-700',
  },
  {
    category: 'antiarrhythmics',
    label: 'Antiarrhythmics',
    icon: 'HeartPulse',
    color: 'bg-pink-100 text-pink-700',
  },
  {
    category: 'anticoagulants',
    label: 'Anticoagulants',
    icon: 'Droplets',
    color: 'bg-rose-100 text-rose-700',
  },
  {
    category: 'vasodilators',
    label: 'Vasodilators',
    icon: 'ArrowDownCircle',
    color: 'bg-teal-100 text-teal-700',
  },
  {
    category: 'inotropes',
    label: 'Inotropes',
    icon: 'TrendingUp',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    category: 'other',
    label: 'Other',
    icon: 'MoreHorizontal',
    color: 'bg-gray-100 text-gray-700',
  },
];

export const MEDICATIONS = [
  // Vasopressors & Inotropes (matching screenshot order)
  { value: 'norepinephrine', label: 'Norepinephrine', category: 'vasopressors', hasFlashcard: true },
  { value: 'epinephrine', label: 'Epinephrine', category: 'vasopressors', hasFlashcard: true },
  { value: 'vasopressin', label: 'Vasopressin', category: 'vasopressors', hasFlashcard: true },
  { value: 'phenylephrine', label: 'Phenylephrine', category: 'vasopressors', hasFlashcard: true },
  { value: 'dopamine', label: 'Dopamine', category: 'vasopressors', hasFlashcard: true },
  { value: 'dobutamine', label: 'Dobutamine', category: 'inotropes', hasFlashcard: true },
  { value: 'milrinone', label: 'Milrinone', category: 'inotropes', hasFlashcard: true },

  // Sedatives
  { value: 'propofol', label: 'Propofol', category: 'sedatives', hasFlashcard: true },
  { value: 'precedex', label: 'Precedex', category: 'sedatives', hasFlashcard: true },

  // Vasodilators
  { value: 'nicardipine', label: 'Nicardipine', category: 'vasodilators', hasFlashcard: true },
  { value: 'nitroglycerin', label: 'Nitroglycerine', category: 'vasodilators', hasFlashcard: true },
  { value: 'heparin', label: 'Heparin', category: 'anticoagulants', hasFlashcard: true },
  { value: 'clevidipine', label: 'Clevidipine', category: 'vasodilators', hasFlashcard: true },
  { value: 'nitroprusside', label: 'Nitroprusside', category: 'vasodilators', hasFlashcard: true },

  // Keep other medications for backward compatibility
  { value: 'midazolam', label: 'Midazolam (Versed)', category: 'sedatives', hasFlashcard: true },
  { value: 'ketamine', label: 'Ketamine', category: 'sedatives', hasFlashcard: true },
  { value: 'lorazepam', label: 'Lorazepam (Ativan)', category: 'sedatives', hasFlashcard: true },
  { value: 'fentanyl', label: 'Fentanyl', category: 'analgesics', hasFlashcard: true },
  { value: 'morphine', label: 'Morphine', category: 'analgesics', hasFlashcard: true },
  { value: 'hydromorphone', label: 'Hydromorphone (Dilaudid)', category: 'analgesics', hasFlashcard: true },
  { value: 'remifentanil', label: 'Remifentanil (Ultiva)', category: 'analgesics', hasFlashcard: true },
  { value: 'rocuronium', label: 'Rocuronium', category: 'paralytics', hasFlashcard: true },
  { value: 'cisatracurium', label: 'Cisatracurium (Nimbex)', category: 'paralytics', hasFlashcard: true },
  { value: 'vecuronium', label: 'Vecuronium', category: 'paralytics', hasFlashcard: true },
  { value: 'succinylcholine', label: 'Succinylcholine', category: 'paralytics', hasFlashcard: true },
  { value: 'amiodarone', label: 'Amiodarone', category: 'antiarrhythmics', hasFlashcard: true },
  { value: 'lidocaine', label: 'Lidocaine', category: 'antiarrhythmics', hasFlashcard: true },
  { value: 'adenosine', label: 'Adenosine', category: 'antiarrhythmics', hasFlashcard: true },
  { value: 'diltiazem', label: 'Diltiazem (Cardizem)', category: 'antiarrhythmics', hasFlashcard: true },
  { value: 'esmolol', label: 'Esmolol (Brevibloc)', category: 'antiarrhythmics', hasFlashcard: true },
  { value: 'metoprolol', label: 'Metoprolol', category: 'antiarrhythmics', hasFlashcard: false },
  { value: 'atropine', label: 'Atropine', category: 'antiarrhythmics', hasFlashcard: true },
  { value: 'argatroban', label: 'Argatroban', category: 'anticoagulants', hasFlashcard: true },
  { value: 'bivalirudin', label: 'Bivalirudin (Angiomax)', category: 'anticoagulants', hasFlashcard: true },
  { value: 'enoxaparin', label: 'Enoxaparin (Lovenox)', category: 'anticoagulants', hasFlashcard: false },
  { value: 'hydralazine', label: 'Hydralazine', category: 'vasodilators', hasFlashcard: false },
  { value: 'labetalol', label: 'Labetalol', category: 'vasodilators', hasFlashcard: true },
];

// =============================================================================
// DEVICES + MONITORS
// =============================================================================

// Devices - tiers removed per design requirements
export const DEVICES = [
  // Matching screenshot order
  { value: 'mechanical_vent', label: 'Mechanical Ventilation', tier: 2, category: 'respiratory', description: 'Invasive mechanical ventilation' },
  { value: 'impella', label: 'Impella', tier: 4, category: 'cardiac_support', description: 'Percutaneous ventricular assist' },
  { value: 'lvad', label: 'LVADs', tier: 4, category: 'cardiac_support', description: 'Left ventricular assist device' },
  { value: 'ecmo', label: 'ECMO', tier: 4, category: 'cardiac_support', description: 'VA or VV ECMO circuit management' },
  { value: 'evd', label: 'EVD', tier: 3, category: 'neuro', description: 'External ventricular drain' },
  { value: 'crrt', label: 'CRRT', tier: 3, category: 'renal', description: 'Continuous renal replacement therapy' },
  { value: 'rapid_infuser', label: 'Rapid Infusor', tier: 2, category: 'resuscitation', description: 'Rapid blood/fluid infusion' },
  { value: 'pacemaker', label: 'Pacemaker', tier: 2, category: 'cardiac', description: 'Temporary pacing' },
  { value: 'swan_ganz', label: 'Swan-Ganz', tier: 2, category: 'hemodynamic', description: 'Pulmonary artery catheter' },
  { value: 'flotrac', label: 'FloTrac', tier: 2, category: 'hemodynamic', description: 'Cardiac output monitoring' },
  { value: 'iabp', label: 'IABP', tier: 3, category: 'cardiac_support', description: 'Intra-aortic balloon pump' },
  { value: 'lumbar_drain', label: 'Lumbar Drains', tier: 2, category: 'neuro', description: 'CSF drainage' },
  { value: 'epidural', label: 'Epidural', tier: 2, category: 'pain', description: 'Epidural analgesia management' },

  // Keep other devices for backward compatibility
  { value: 'targeted_temp', label: 'Targeted Temperature (TTM)', tier: 3, category: 'neuro', description: 'Therapeutic hypothermia' },
  { value: 'icp_monitor', label: 'ICP Monitor', tier: 3, category: 'neuro', description: 'Intracranial pressure monitoring' },
  { value: 'pa_catheter', label: 'PA Catheter (Swan-Ganz)', tier: 2, category: 'hemodynamic', description: 'Pulmonary artery catheter' },
  { value: 'external_pacer', label: 'External Pacer', tier: 2, category: 'cardiac', description: 'Temporary pacing' },
  { value: 'temporary_pacer', label: 'Temporary Pacemaker', tier: 2, category: 'cardiac', description: 'Epicardial/transvenous pacing' },
  { value: 'bipap_cpap', label: 'BiPAP/CPAP', tier: 2, category: 'respiratory', description: 'Non-invasive ventilation' },
  { value: 'chest_tube', label: 'Chest Tube', tier: 2, category: 'respiratory', description: 'Thoracostomy tube management' },
  { value: 'arterial_line', label: 'Arterial Line', tier: 1, category: 'hemodynamic', description: 'Continuous BP monitoring' },
  { value: 'central_line', label: 'Central Line', tier: 1, category: 'access', description: 'CVC management' },
  { value: 'cvp_monitoring', label: 'CVP Monitoring', tier: 1, category: 'hemodynamic', description: 'Central venous pressure' },
  { value: 'foley', label: 'Foley Catheter', tier: 1, category: 'general', description: 'Urinary output monitoring' },
  { value: 'ng_og_tube', label: 'NG/OG Tube', tier: 1, category: 'gi', description: 'Gastric decompression/feeding' },
  { value: 'picc', label: 'PICC Line', tier: 1, category: 'access', description: 'Peripherally inserted central catheter' },
];

// =============================================================================
// BEDSIDE PROCEDURES
// =============================================================================

export const PROCEDURES = [
  // Matching screenshot order
  { value: 'intubation', label: 'Intubation', highValue: true, description: 'Endotracheal intubation' },
  { value: 'extubation', label: 'Extubation', highValue: true, description: 'Removed ETT, monitored for complications' },
  { value: 'tracheostomy', label: 'Tracheostomy', highValue: true, description: 'Tracheostomy care and management' },
  { value: 'bronchoscopy', label: 'Bronchoscopy', highValue: true, description: 'Bedside bronchoscopy' },
  { value: 'central_line_insertion', label: 'Central Line Insertion', highValue: true, description: 'CVC placement' },
  { value: 'arterial_line_insertion', label: 'Arterial Line Insertion', highValue: true, description: 'A-line placement' },
  { value: 'lumbar_puncture', label: 'Lumbar Puncture', highValue: false, description: 'LP procedure' },
  { value: 'icp_monitor_placement', label: 'ICP Monitor Placement', highValue: true, description: 'ICP monitor insertion' },
  { value: 'cardioversion', label: 'Cardioversion', highValue: true, description: 'Synchronized cardioversion' },
  { value: 'pericardiocentesis', label: 'Pericardiocentesis', highValue: true, description: 'Pericardial drainage' },
  { value: 'tee', label: 'TEE', highValue: true, description: 'Transesophageal echocardiography' },
  { value: 'chest_tube_insertion', label: 'Chest Tube Insertion', highValue: true, description: 'Thoracostomy tube placement' },
  { value: 'needle_decompression', label: 'Needle Decompression', highValue: true, description: 'Emergency chest decompression' },
  { value: 'g_tube_placement', label: 'G-Tube Placement', highValue: false, description: 'Gastrostomy tube placement' },
  { value: 'evd_bolt', label: 'EVD/Bolt', highValue: true, description: 'External ventricular drain placement' },
  { value: 'us_guided_iv', label: 'US Guided IV', highValue: false, description: 'Ultrasound-guided peripheral IV' },

  // Keep other procedures for backward compatibility
  { value: 'intubation_assist', label: 'Intubation Assist', highValue: true, description: 'Assisted with endotracheal intubation' },
  { value: 'central_line_assist', label: 'Central Line Assist', highValue: true, description: 'Assisted with CVC placement' },
  { value: 'arterial_line_assist', label: 'Arterial Line Assist', highValue: true, description: 'Assisted with A-line placement' },
  { value: 'chest_tube_assist', label: 'Chest Tube Assist', highValue: true, description: 'Assisted with thoracostomy' },
  { value: 'bronchoscopy_assist', label: 'Bronchoscopy Assist', highValue: true, description: 'Assisted with bedside bronch' },
  { value: 'defibrillation', label: 'Defibrillation', highValue: true, description: 'Emergency defibrillation' },
  { value: 'tee_assist', label: 'TEE Assist', highValue: true, description: 'Transesophageal echo assistance' },
  { value: 'lumbar_puncture_assist', label: 'Lumbar Puncture Assist', highValue: false, description: 'Assisted with LP' },
  { value: 'paracentesis_assist', label: 'Paracentesis Assist', highValue: false, description: 'Assisted with abdominal tap' },
  { value: 'thoracentesis_assist', label: 'Thoracentesis Assist', highValue: false, description: 'Assisted with pleural tap' },
  { value: 'code_participation', label: 'Code Blue Participation', highValue: true, description: 'Participated in cardiac arrest response' },
  { value: 'rapid_response', label: 'Rapid Response', highValue: true, description: 'Responded to rapid response call' },
  { value: 'proning', label: 'Patient Proning', highValue: false, description: 'Positioned patient prone' },
  { value: 'tracheostomy_care', label: 'Tracheostomy Care', highValue: false, description: 'Trach care and suctioning' },
  { value: 'blood_administration', label: 'Blood Product Administration', highValue: false, description: 'Transfusion management' },
  { value: 'post_mortem', label: 'Post-Mortem Care', highValue: false, description: 'End-of-life care' },
];

// =============================================================================
// CONFIDENCE LEVELS
// =============================================================================

export const CONFIDENCE_LEVELS = [
  { value: 'observed', label: 'Observed', description: 'Watched it being done' },
  { value: 'used_it', label: 'Used it', description: 'Hands-on experience with guidance' },
  { value: 'could_teach', label: 'Could teach it', description: 'Confident to precept others' },
];

// =============================================================================
// UNUSUAL/RARE CASES
// =============================================================================

export const UNUSUAL_CASES = [
  { value: 'ecmo_initiation', label: 'ECMO Initiation', description: 'Present during ECMO cannulation' },
  { value: 'ecmo_decannulation', label: 'ECMO Decannulation', description: 'Present during ECMO removal' },
  { value: 'liver_transplant', label: 'Liver Transplant', description: 'Post-liver transplant care' },
  { value: 'kidney_transplant', label: 'Kidney Transplant', description: 'Post-kidney transplant care' },
  { value: 'heart_transplant', label: 'Heart Transplant', description: 'Post-heart transplant care' },
  { value: 'lung_transplant', label: 'Lung Transplant', description: 'Post-lung transplant care' },
  { value: 'lvad_implant', label: 'LVAD Implantation', description: 'Post-LVAD surgery care' },
  { value: 'open_chest', label: 'Open Chest', description: 'Patient with open sternum' },
  { value: 'aortic_dissection', label: 'Aortic Dissection', description: 'Type A or B dissection management' },
  { value: 'massive_transfusion', label: 'Massive Transfusion Protocol', description: 'MTP activation' },
  { value: 'dka_hhs', label: 'DKA/HHS', description: 'Severe diabetic emergency' },
  { value: 'status_epilepticus', label: 'Status Epilepticus', description: 'Prolonged seizure management' },
  { value: 'malignant_hyperthermia', label: 'Malignant Hyperthermia', description: 'MH crisis' },
  { value: 'brain_death_eval', label: 'Brain Death Evaluation', description: 'Participated in brain death testing' },
  { value: 'organ_procurement', label: 'Organ Procurement', description: 'Donor management/procurement' },
  { value: 'therapeutic_hypothermia', label: 'Therapeutic Hypothermia', description: 'Post-arrest cooling protocol' },
  { value: 'pe_thrombolysis', label: 'PE Thrombolysis', description: 'tPA for massive PE' },
  { value: 'stroke_thrombolysis', label: 'Stroke Thrombolysis', description: 'tPA for acute stroke' },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get medication info by value
 */
export function getMedicationInfo(value) {
  return MEDICATIONS.find((m) => m.value === value) || null;
}

/**
 * Get device info by value
 */
export function getDeviceInfo(value) {
  return DEVICES.find((d) => d.value === value) || null;
}

/**
 * Get procedure info by value
 */
export function getProcedureInfo(value) {
  return PROCEDURES.find((p) => p.value === value) || null;
}

/**
 * Get medications by category
 */
export function getMedicationsByCategory(category) {
  return MEDICATIONS.filter((m) => m.category === category);
}

/**
 * Get devices by tier
 */
export function getDevicesByTier(tier) {
  return DEVICES.filter((d) => d.tier === tier);
}

/**
 * Get devices with flashcard content
 */
export function getMedicationsWithFlashcards() {
  return MEDICATIONS.filter((m) => m.hasFlashcard);
}

/**
 * Get high-value procedures
 */
export function getHighValueProcedures() {
  return PROCEDURES.filter((p) => p.highValue);
}

/**
 * Format options for TagSelect component
 */
export function getPopulationOptions() {
  return PATIENT_POPULATIONS.map(({ value, label }) => ({ value, label }));
}

export function getMedicationOptions() {
  return MEDICATIONS.map(({ value, label, hasFlashcard }) => ({
    value,
    label,
    hasFlashcard,
  }));
}

export function getDeviceOptions() {
  return DEVICES.map(({ value, label, tier }) => ({
    value,
    label,
    tier,
  }));
}

export function getProcedureOptions() {
  return PROCEDURES.map(({ value, label, highValue }) => ({
    value,
    label,
    highValue,
  }));
}

export function getUnusualCaseOptions() {
  return UNUSUAL_CASES.map(({ value, label }) => ({ value, label }));
}

/**
 * Calculate stats from entries
 */
export function calculateClinicalStats(entries) {
  if (!entries || entries.length === 0) {
    return {
      totalEntries: 0,
      topPopulation: null,
      topMedication: null,
      topDevice: null,
      topProcedure: null,
      uniqueMedications: 0,
      uniqueDevices: 0,
      uniqueProcedures: 0,
      tier4Devices: 0,
      codeRapidCount: 0,
    };
  }

  // Count occurrences
  const populationCounts = {};
  const medicationCounts = {};
  const deviceCounts = {};
  const procedureCounts = {};
  let tier4Count = 0;
  let codeRapidCount = 0;

  entries.forEach((entry) => {
    // Populations
    entry.patientPopulations?.forEach((p) => {
      populationCounts[p] = (populationCounts[p] || 0) + 1;
    });

    // Medications
    entry.medications?.forEach((m) => {
      const id = typeof m === 'string' ? m : m.medicationId;
      medicationCounts[id] = (medicationCounts[id] || 0) + 1;
    });

    // Devices
    entry.devices?.forEach((d) => {
      const id = typeof d === 'string' ? d : d.deviceId;
      deviceCounts[id] = (deviceCounts[id] || 0) + 1;
      const deviceInfo = getDeviceInfo(id);
      if (deviceInfo?.tier === 4) tier4Count++;
    });

    // Procedures
    entry.procedures?.forEach((p) => {
      const id = typeof p === 'string' ? p : p.procedureId;
      procedureCounts[id] = (procedureCounts[id] || 0) + 1;
    });

    // Code/Rapid
    if (entry.codeOrRapidResponse) codeRapidCount++;
  });

  // Find top items
  const getTop = (counts) => {
    const entries = Object.entries(counts);
    if (entries.length === 0) return null;
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  };

  const topPopulation = getTop(populationCounts);
  const topMedication = getTop(medicationCounts);
  const topDevice = getTop(deviceCounts);
  const topProcedure = getTop(procedureCounts);

  return {
    totalEntries: entries.length,
    topPopulation: topPopulation ? PATIENT_POPULATIONS.find((p) => p.value === topPopulation)?.label : null,
    topMedication: topMedication ? getMedicationInfo(topMedication)?.label : null,
    topDevice: topDevice ? getDeviceInfo(topDevice)?.label : null,
    topProcedure: topProcedure ? getProcedureInfo(topProcedure)?.label : null,
    uniqueMedications: Object.keys(medicationCounts).length,
    uniqueDevices: Object.keys(deviceCounts).length,
    uniqueProcedures: Object.keys(procedureCounts).length,
    tier4Devices: tier4Count,
    codeRapidCount,
  };
}

export default {
  PATIENT_POPULATIONS,
  MEDICATION_CATEGORIES,
  MEDICATIONS,
  DEVICES,
  PROCEDURES,
  CONFIDENCE_LEVELS,
  UNUSUAL_CASES,
};
