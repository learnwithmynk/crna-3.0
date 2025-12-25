/**
 * Mock Clinical Experience Tracker Entries
 *
 * Sample clinical shift entries with medications, devices, procedures,
 * and patient populations. Used for development and testing.
 *
 * Confidence levels (from enums.js):
 * - observed: Watched someone else do it
 * - assisted: Helped someone else do it
 * - performed: Did it independently
 * - could_teach: Could teach others how to do it
 *
 * TODO: Replace with API call to Supabase
 */

import { calculateClinicalStats } from './clinicalCategories';
import { CONFIDENCE_LEVELS, SHIFT_TYPES } from '@/lib/enums';

// =============================================================================
// MOCK CLINICAL ENTRIES
// =============================================================================

export const mockClinicalEntries = [
  {
    id: 'clin_001',
    userId: 'user_123',
    shiftDate: '2025-11-27',
    shiftType: 'day',
    shiftDuration: 12,

    patientPopulations: ['cardiac', 'surgical'],

    medications: [
      { medicationId: 'norepinephrine', confidenceLevel: 'performed' },
      { medicationId: 'propofol', confidenceLevel: 'could_teach' },
      { medicationId: 'fentanyl', confidenceLevel: 'could_teach' },
      { medicationId: 'milrinone', confidenceLevel: 'performed' },
    ],

    devices: [
      { deviceId: 'mechanical_vent', confidenceLevel: 'could_teach' },
      { deviceId: 'arterial_line', confidenceLevel: 'could_teach' },
      { deviceId: 'iabp', confidenceLevel: 'performed' },
      { deviceId: 'pa_catheter', confidenceLevel: 'observed' },
    ],

    procedures: [
      { procedureId: 'central_line_assist', confidenceLevel: 'performed' },
    ],

    patientCount: 2,
    teachingInvolved: false,
    codeOrRapidResponse: false,
    unusualCases: [],

    notes: 'Post-CABG patient on IABP weaning today. Great learning experience about timing ratios and when to decrease support.',
    highlightMoment: 'Watched the attending explain IABP timing - finally understand why 1:1 augmentation matters and when to go to 1:2.',

    pointsEarned: 2,
    createdAt: '2025-11-27T19:30:00Z',
  },
  {
    id: 'clin_002',
    userId: 'user_123',
    shiftDate: '2025-11-25',
    shiftType: 'night',
    shiftDuration: 12,

    patientPopulations: ['cardiac', 'renal'],

    medications: [
      { medicationId: 'norepinephrine', confidenceLevel: 'could_teach' },
      { medicationId: 'vasopressin', confidenceLevel: 'performed' },
      { medicationId: 'propofol', confidenceLevel: 'could_teach' },
      { medicationId: 'fentanyl', confidenceLevel: 'could_teach' },
      { medicationId: 'cisatracurium', confidenceLevel: 'performed' },
    ],

    devices: [
      { deviceId: 'ecmo', confidenceLevel: 'performed' },
      { deviceId: 'mechanical_vent', confidenceLevel: 'could_teach' },
      { deviceId: 'crrt', confidenceLevel: 'performed' },
      { deviceId: 'arterial_line', confidenceLevel: 'could_teach' },
    ],

    procedures: [
      { procedureId: 'proning', confidenceLevel: 'could_teach' },
    ],

    patientCount: 1,
    teachingInvolved: true,
    codeOrRapidResponse: false,
    unusualCases: ['ecmo_initiation'],

    notes: 'VV ECMO patient - was present for cannulation earlier in the shift. Spent time learning the circuit and troubleshooting alarms. Had a student with me who was fascinated.',
    highlightMoment: 'The perfusionist walked me through the entire ECMO circuit - now I understand sweep gas vs blood flow and why we adjust each one.',

    pointsEarned: 2,
    createdAt: '2025-11-25T07:45:00Z',
  },
  {
    id: 'clin_003',
    userId: 'user_123',
    shiftDate: '2025-11-23',
    shiftType: 'day',
    shiftDuration: 12,

    patientPopulations: ['neuro', 'trauma'],

    medications: [
      { medicationId: 'propofol', confidenceLevel: 'could_teach' },
      { medicationId: 'fentanyl', confidenceLevel: 'could_teach' },
      { medicationId: 'norepinephrine', confidenceLevel: 'could_teach' },
      { medicationId: 'nicardipine', confidenceLevel: 'performed' },
    ],

    devices: [
      { deviceId: 'evd', confidenceLevel: 'performed' },
      { deviceId: 'icp_monitor', confidenceLevel: 'performed' },
      { deviceId: 'mechanical_vent', confidenceLevel: 'could_teach' },
      { deviceId: 'arterial_line', confidenceLevel: 'could_teach' },
    ],

    procedures: [
      { procedureId: 'intubation_assist', confidenceLevel: 'performed' },
      { procedureId: 'rapid_response', confidenceLevel: 'performed' },
    ],

    patientCount: 2,
    teachingInvolved: false,
    codeOrRapidResponse: true,
    unusualCases: [],

    notes: 'TBI patient with elevated ICP. Called rapid response when ICP spiked to 35. Team came quickly, we gave mannitol and hyperventilated briefly. Patient stabilized.',
    highlightMoment: 'My quick recognition of the ICP crisis and calling the rapid response early made a difference. The neuro attending said early intervention was key.',

    pointsEarned: 2,
    createdAt: '2025-11-23T19:15:00Z',
  },
  {
    id: 'clin_004',
    userId: 'user_123',
    shiftDate: '2025-11-21',
    shiftType: 'night',
    shiftDuration: 12,

    patientPopulations: ['medical', 'pulmonary'],

    medications: [
      { medicationId: 'norepinephrine', confidenceLevel: 'could_teach' },
      { medicationId: 'vasopressin', confidenceLevel: 'could_teach' },
      { medicationId: 'epinephrine', confidenceLevel: 'performed' },
      { medicationId: 'propofol', confidenceLevel: 'could_teach' },
      { medicationId: 'rocuronium', confidenceLevel: 'performed' },
      { medicationId: 'hydrocortisone', confidenceLevel: 'performed' },
    ],

    devices: [
      { deviceId: 'mechanical_vent', confidenceLevel: 'could_teach' },
      { deviceId: 'arterial_line', confidenceLevel: 'could_teach' },
      { deviceId: 'central_line', confidenceLevel: 'could_teach' },
    ],

    procedures: [
      { procedureId: 'code_participation', confidenceLevel: 'performed' },
      { procedureId: 'intubation_assist', confidenceLevel: 'performed' },
    ],

    patientCount: 2,
    teachingInvolved: false,
    codeOrRapidResponse: true,
    unusualCases: [],

    notes: 'Septic shock patient coded. 20 min code, got ROSC. Was pushing meds and managing the airway during compressions. Intense night but the patient survived.',
    highlightMoment: 'During the code, I stayed calm and anticipated what meds would be needed next. The resident commented that my preparation helped the code run smoothly.',

    pointsEarned: 2,
    createdAt: '2025-11-21T07:30:00Z',
  },
  {
    id: 'clin_005',
    userId: 'user_123',
    shiftDate: '2025-11-19',
    shiftType: 'day',
    shiftDuration: 12,

    patientPopulations: ['cardiac', 'transplant'],

    medications: [
      { medicationId: 'milrinone', confidenceLevel: 'performed' },
      { medicationId: 'dobutamine', confidenceLevel: 'performed' },
      { medicationId: 'norepinephrine', confidenceLevel: 'could_teach' },
      { medicationId: 'heparin', confidenceLevel: 'could_teach' },
      { medicationId: 'tacrolimus', confidenceLevel: 'observed' },
    ],

    devices: [
      { deviceId: 'lvad', confidenceLevel: 'observed' },
      { deviceId: 'arterial_line', confidenceLevel: 'could_teach' },
      { deviceId: 'central_line', confidenceLevel: 'could_teach' },
      { deviceId: 'pa_catheter', confidenceLevel: 'performed' },
    ],

    procedures: [
      { procedureId: 'blood_administration', confidenceLevel: 'could_teach' },
    ],

    patientCount: 1,
    teachingInvolved: false,
    codeOrRapidResponse: false,
    unusualCases: ['lvad_implant'],

    notes: 'First day caring for fresh LVAD patient! Learned about flow parameters, pulsatility index, and what the alarms mean. Fascinating technology.',
    highlightMoment: 'The VAD coordinator spent an hour teaching me about the HeartMate 3. I can now explain why we dont take BP with a cuff on LVAD patients.',

    pointsEarned: 2,
    createdAt: '2025-11-19T19:00:00Z',
  },
  {
    id: 'clin_006',
    userId: 'user_123',
    shiftDate: '2025-11-17',
    shiftType: 'night',
    shiftDuration: 12,

    patientPopulations: ['surgical', 'liver'],

    medications: [
      { medicationId: 'norepinephrine', confidenceLevel: 'could_teach' },
      { medicationId: 'propofol', confidenceLevel: 'could_teach' },
      { medicationId: 'fentanyl', confidenceLevel: 'could_teach' },
      { medicationId: 'albumin', confidenceLevel: 'performed' },
    ],

    devices: [
      { deviceId: 'mechanical_vent', confidenceLevel: 'could_teach' },
      { deviceId: 'arterial_line', confidenceLevel: 'could_teach' },
      { deviceId: 'central_line', confidenceLevel: 'could_teach' },
    ],

    procedures: [
      { procedureId: 'paracentesis_assist', confidenceLevel: 'performed' },
      { procedureId: 'blood_administration', confidenceLevel: 'could_teach' },
    ],

    patientCount: 2,
    teachingInvolved: true,
    codeOrRapidResponse: false,
    unusualCases: ['liver_transplant'],

    notes: 'Post liver transplant day 1. Managing coagulopathy, giving lots of blood products. Had a new grad with me learning about massive transfusion.',
    highlightMoment: 'Teaching the new grad about the transplant process and why these patients are so complex - she asked great questions and seemed inspired.',

    pointsEarned: 2,
    createdAt: '2025-11-17T07:45:00Z',
  },
  {
    id: 'clin_007',
    userId: 'user_123',
    shiftDate: '2025-11-15',
    shiftType: 'day',
    shiftDuration: 12,

    patientPopulations: ['pulmonary', 'medical'],

    medications: [
      { medicationId: 'propofol', confidenceLevel: 'could_teach' },
      { medicationId: 'fentanyl', confidenceLevel: 'could_teach' },
      { medicationId: 'cisatracurium', confidenceLevel: 'performed' },
      { medicationId: 'dexmedetomidine', confidenceLevel: 'performed' },
    ],

    devices: [
      { deviceId: 'mechanical_vent', confidenceLevel: 'could_teach' },
      { deviceId: 'arterial_line', confidenceLevel: 'could_teach' },
      { deviceId: 'bipap_cpap', confidenceLevel: 'could_teach' },
    ],

    procedures: [
      { procedureId: 'proning', confidenceLevel: 'could_teach' },
      { procedureId: 'extubation', confidenceLevel: 'performed' },
    ],

    patientCount: 2,
    teachingInvolved: false,
    codeOrRapidResponse: false,
    unusualCases: [],

    notes: 'ARDS patient doing better! Transitioned from prone to supine, weaned sedation, and extubated successfully to BiPAP. Great outcome.',
    highlightMoment: 'The patient squeezed my hand after extubation and mouthed "thank you". Those moments make the hard shifts worth it.',

    pointsEarned: 2,
    createdAt: '2025-11-15T19:30:00Z',
  },
  {
    id: 'clin_008',
    userId: 'user_123',
    shiftDate: '2025-11-13',
    shiftType: 'night',
    shiftDuration: 12,

    patientPopulations: ['cardiac'],

    medications: [
      { medicationId: 'amiodarone', confidenceLevel: 'performed' },
      { medicationId: 'norepinephrine', confidenceLevel: 'could_teach' },
      { medicationId: 'heparin', confidenceLevel: 'could_teach' },
      { medicationId: 'lidocaine', confidenceLevel: 'performed' },
    ],

    devices: [
      { deviceId: 'external_pacer', confidenceLevel: 'performed' },
      { deviceId: 'arterial_line', confidenceLevel: 'could_teach' },
      { deviceId: 'central_line', confidenceLevel: 'could_teach' },
    ],

    procedures: [
      { procedureId: 'cardioversion', confidenceLevel: 'performed' },
    ],

    patientCount: 2,
    teachingInvolved: false,
    codeOrRapidResponse: false,
    unusualCases: [],

    notes: 'Afib with RVR patient converted after 3rd cardioversion. Managing anticoagulation and watching for recurrence all night.',
    highlightMoment: 'First time setting up the defibrillator for synchronized cardioversion myself. The attending walked me through the settings step by step.',

    pointsEarned: 2,
    createdAt: '2025-11-13T07:15:00Z',
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get entries sorted by date (newest first)
 */
export function getEntriesByDate(entries = mockClinicalEntries) {
  return [...entries].sort((a, b) => new Date(b.shiftDate) - new Date(a.shiftDate));
}

/**
 * Get entries for a specific date range
 */
export function getEntriesInRange(startDate, endDate, entries = mockClinicalEntries) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return entries.filter((entry) => {
    const date = new Date(entry.shiftDate);
    return date >= start && date <= end;
  });
}

/**
 * Get entry count by month
 */
export function getEntriesByMonth(entries = mockClinicalEntries) {
  const byMonth = {};
  entries.forEach((entry) => {
    const month = entry.shiftDate.substring(0, 7); // YYYY-MM
    byMonth[month] = (byMonth[month] || 0) + 1;
  });
  return byMonth;
}

/**
 * Get all unique medications logged
 */
export function getUniqueMedications(entries = mockClinicalEntries) {
  const meds = new Set();
  entries.forEach((entry) => {
    entry.medications?.forEach((m) => meds.add(m.medicationId));
  });
  return Array.from(meds);
}

/**
 * Get all unique devices logged
 */
export function getUniqueDevices(entries = mockClinicalEntries) {
  const devices = new Set();
  entries.forEach((entry) => {
    entry.devices?.forEach((d) => devices.add(d.deviceId));
  });
  return Array.from(devices);
}

/**
 * Get stats from mock entries
 */
export function getMockClinicalStats() {
  return calculateClinicalStats(mockClinicalEntries);
}

/**
 * Format shift date for display
 */
export function formatShiftDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Get shift type label
 */
export function getShiftTypeLabel(shiftType) {
  return shiftType === 'day' ? 'Day Shift' : 'Night Shift';
}

export default mockClinicalEntries;
