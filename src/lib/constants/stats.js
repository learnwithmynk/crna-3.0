/**
 * Stats Page Constants
 *
 * Centralized constants for the MyStats page and related components.
 * This eliminates duplication across Section and EditSheet components.
 */

// =============================================================================
// CERTIFICATIONS
// =============================================================================

export const CERTIFICATION_TYPES = [
  { value: 'ccrn', label: 'CCRN', description: 'Critical Care Registered Nurse' },
  { value: 'bls', label: 'BLS', description: 'Basic Life Support' },
  { value: 'acls', label: 'ACLS', description: 'Advanced Cardiovascular Life Support' },
  { value: 'pals', label: 'PALS', description: 'Pediatric Advanced Life Support' },
  { value: 'tncc', label: 'TNCC', description: 'Trauma Nursing Core Course' },
  { value: 'nihss', label: 'NIHSS', description: 'NIH Stroke Scale' },
  { value: 'other', label: 'Other', description: 'Other certification' },
];

export const CERTIFICATION_LABELS = {
  ccrn: 'CCRN (Adult)',
  'ccrn-pediatric': 'CCRN (Pediatric)',
  'ccrn-neonatal': 'CCRN (Neonatal)',
  'ccrn-k': 'CCRN-K',
  bls: 'BLS',
  acls: 'ACLS',
  pals: 'PALS',
  tncc: 'TNCC',
  nihss: 'NIHSS',
  'nursing-license': 'RN License',
};

export const CERTIFICATION_STATUSES = [
  { value: 'passed', label: 'Passed/Current', color: 'green' },
  { value: 'scheduled', label: 'Scheduled', color: 'blue' },
  { value: 'expired', label: 'Expired', color: 'red' },
  { value: 'planned', label: 'Planning to take', color: 'gray' },
];

// =============================================================================
// PREREQUISITES
// =============================================================================

export const COURSE_LABELS = {
  anatomy_physiology: 'Anatomy & Physiology',
  anatomy: 'Anatomy',
  physiology: 'Physiology',
  general_chemistry: 'Gen Chem',
  organic_chemistry: 'Organic Chem',
  biochemistry: 'Biochem',
  physics: 'Physics',
  statistics: 'Statistics',
  pharmacology: 'Pharm',
  pathophysiology: 'Pathophys',
  microbiology: 'Micro',
  research: 'Research',
};

export const PREREQUISITE_COURSES = [
  'anatomy_physiology',
  'physics',
  'biochemistry',
  'organic_chemistry',
  'general_chemistry',
  'pathophysiology',
  'pharmacology',
  'microbiology',
  'statistics',
];

export const PREREQUISITE_STATUSES = {
  completed: { label: 'Done', color: 'text-white', bgColor: 'bg-green-500', bubbleBg: 'bg-green-500' },
  in_progress: { label: 'Taking', color: 'text-white', bgColor: 'bg-blue-500', bubbleBg: 'bg-blue-500' },
  planned: { label: 'Plan', color: 'text-white', bgColor: 'bg-amber-500', bubbleBg: 'bg-amber-500' },
  plan_retake: { label: 'Retake', color: 'text-white', bgColor: 'bg-orange-500', bubbleBg: 'bg-orange-500' },
  not_taken: { label: 'N/A', color: 'text-gray-500', bgColor: 'bg-gray-200', bubbleBg: 'bg-gray-300' },
};

export const GRADE_OPTIONS = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F', 'P'];

// =============================================================================
// LEADERSHIP
// =============================================================================

export const LEADERSHIP_ROLES = [
  { id: 'charge_nurse', label: 'Charge Nurse' },
  { id: 'preceptor', label: 'Preceptor' },
  { id: 'unit_council', label: 'Unit-Based Council' },
  { id: 'code_committee', label: 'Code Blue Committee/Team' },
  { id: 'rapid_response', label: 'Rapid Response Team' },
  { id: 'other', label: 'Other' },
];

// =============================================================================
// RESUME BOOSTERS
// =============================================================================

export const BOOSTER_TYPES = {
  research: {
    label: 'Research & QI',
    titlePlaceholder: 'e.g., Co-authored poster on early mobility protocols',
    descriptionPlaceholder: 'Describe your role, methodology, outcomes, where presented...',
    hint: 'Add each research project, publication, or QI initiative separately.',
  },
  committees: {
    label: 'Committees',
    titlePlaceholder: 'e.g., Unit Practice Council',
    descriptionPlaceholder: 'Your role and contributions to the committee...',
    hint: 'Include committees, councils, and professional groups.',
  },
  volunteering: {
    label: 'Community Involvement',
    titlePlaceholder: 'e.g., Remote Area Medical volunteer',
    descriptionPlaceholder: 'Describe your volunteer work, duration, and impact...',
    hint: 'Add volunteer work, medical missions, community service.',
  },
  leadership: {
    label: 'Leadership',
    titlePlaceholder: 'e.g., Charge Nurse',
    descriptionPlaceholder: 'Frequency, responsibilities, and impact...',
    hint: 'Include charge nurse, precepting, and other leadership roles.',
  },
};

// =============================================================================
// CLINICAL EXPERIENCE
// =============================================================================

export const ICU_TYPE_LABELS = {
  micu: 'MICU',
  sicu: 'SICU',
  cvicu: 'CVICU',
  ccu: 'CCU',
  neuro_icu: 'Neuro ICU',
  trauma_icu: 'Trauma ICU',
  burn_icu: 'Burn ICU',
  picu: 'PICU',
  nicu: 'NICU',
  mixed_icu: 'Mixed ICU',
};

export const FACILITY_TYPE_LABELS = {
  level_1_trauma: 'Level 1 Trauma',
  level_2_trauma: 'Level 2 Trauma',
  teaching_hospital: 'Teaching Hospital',
  community_hospital: 'Community Hospital',
  academic_medical_center: 'Academic Med Center',
};

// =============================================================================
// APPLICATION STAGE & STATUS
// =============================================================================

export const APPLICATION_STAGES = {
  exploring: 'Exploring',
  planning: 'Building Foundation',
  preparing: 'Preparing Apps',
  applying: 'Actively Applying',
  interviewing: 'Interviewing',
  accepted: 'Accepted',
};

export const PROGRAM_STATUS_LABELS = {
  researching: 'Researching',
  target: 'Target',
  applying: 'Applying',
  applied: 'Applied',
  interview: 'Interviewing',
  accepted: 'Accepted',
  rejected: 'Not Accepted',
  waitlisted: 'Waitlisted',
  withdrawn: 'Withdrawn',
};
