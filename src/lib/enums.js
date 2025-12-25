/**
 * Centralized Enum Definitions for The CRNA Club
 *
 * This file contains all enum values used across the application.
 * Import from here to ensure consistency between mock data, components, and future API contracts.
 *
 * Usage:
 *   import { USER_STAGES, PROGRAM_STATUSES, isValidUserStage } from '@/lib/enums';
 */

// =============================================================================
// APPLICATION STAGES (Category 12: Guidance & Focus State)
// =============================================================================

/**
 * Application lifecycle stages - where the user is in their CRNA journey
 * Renamed from USER_STAGES, now part of Category 12: Guidance & Focus State
 * Used for: filtering nudges, personalizing dashboard, analytics segmentation
 */
export const APPLICATION_STAGES = {
  EXPLORING: 'exploring',         // Early research, 12+ months out
  STRATEGIZING: 'strategizing',   // Building plan, identifying programs
  EXECUTING: 'executing',         // Actively working on applications
  INTERVIEWING: 'interviewing',   // Interview phase
  POST_DECISION: 'post_decision', // Accepted, waitlisted, or deciding
};

export const APPLICATION_STAGE_VALUES = Object.values(APPLICATION_STAGES);

export const APPLICATION_STAGE_LABELS = {
  [APPLICATION_STAGES.EXPLORING]: 'Exploring (12+ months)',
  [APPLICATION_STAGES.STRATEGIZING]: 'Strategizing (6-12 months)',
  [APPLICATION_STAGES.EXECUTING]: 'Executing (<6 months)',
  [APPLICATION_STAGES.INTERVIEWING]: 'Interviewing',
  [APPLICATION_STAGES.POST_DECISION]: 'Post-Decision',
};

// Legacy alias for backwards compatibility
/** @deprecated Use APPLICATION_STAGES instead */
export const USER_STAGES = APPLICATION_STAGES;
export const USER_STAGE_VALUES = APPLICATION_STAGE_VALUES;
export const USER_STAGE_LABELS = APPLICATION_STAGE_LABELS;

// =============================================================================
// SUPPORT MODES (Category 12: Guidance & Focus State)
// =============================================================================

/**
 * How the app should help the user - determines guidance style
 * Part of Category 12: Guidance & Focus State
 */
export const SUPPORT_MODES = {
  ORIENTATION: 'orientation',   // New user, needs overview and guidance
  STRATEGY: 'strategy',         // Planning phase, needs decision support
  EXECUTION: 'execution',       // Active work, needs task management
  CONFIDENCE: 'confidence',     // Interview prep, needs polish
};

export const SUPPORT_MODE_VALUES = Object.values(SUPPORT_MODES);

export const SUPPORT_MODE_LABELS = {
  [SUPPORT_MODES.ORIENTATION]: 'Getting Oriented',
  [SUPPORT_MODES.STRATEGY]: 'Building Strategy',
  [SUPPORT_MODES.EXECUTION]: 'Executing Plan',
  [SUPPORT_MODES.CONFIDENCE]: 'Confidence Mode',
};

// =============================================================================
// RISK SIGNALS (Category 12: Guidance & Focus State)
// =============================================================================

/**
 * Risk signals computed by the Guidance Engine
 * Part of Category 12: Guidance & Focus State
 * - stagnation: No meaningful action in 14+ days
 * - deadline_pressure: Nearest deadline <30 days AND checklist <60% complete
 * - momentum: >=3 meaningful actions in last 7 days (positive signal)
 */
export const RISK_SIGNALS = {
  STAGNATION: 'stagnation',
  DEADLINE_PRESSURE: 'deadline_pressure',
  MOMENTUM: 'momentum',
};

export const RISK_SIGNAL_VALUES = Object.values(RISK_SIGNALS);

export const RISK_SIGNAL_LABELS = {
  [RISK_SIGNALS.STAGNATION]: 'Stagnation',
  [RISK_SIGNALS.DEADLINE_PRESSURE]: 'Deadline Pressure',
  [RISK_SIGNALS.MOMENTUM]: 'Momentum',
};

// =============================================================================
// PRIMARY FOCUS AREAS (Category 12: Guidance & Focus State)
// =============================================================================

/**
 * Areas the user is currently focused on
 * Part of Category 12: Guidance & Focus State
 */
export const PRIMARY_FOCUS_AREAS = {
  SCHOOL_SEARCH: 'school_search',     // Finding and comparing programs
  GPA_PREREQS: 'gpa_prereqs',         // Academic preparation
  CERTIFICATIONS: 'certifications',   // CCRN, BLS, ACLS, etc.
  SHADOWING: 'shadowing',             // Shadow day planning and logging
  LEADERSHIP: 'leadership',           // Leadership experience documentation
  RESUME: 'resume',                   // Resume/CV preparation
  ESSAY: 'essay',                     // Personal statement writing
  INTERVIEW_PREP: 'interview_prep',   // Interview preparation
};

export const PRIMARY_FOCUS_AREA_VALUES = Object.values(PRIMARY_FOCUS_AREAS);

export const PRIMARY_FOCUS_AREA_LABELS = {
  [PRIMARY_FOCUS_AREAS.SCHOOL_SEARCH]: 'School Search',
  [PRIMARY_FOCUS_AREAS.GPA_PREREQS]: 'GPA & Prerequisites',
  [PRIMARY_FOCUS_AREAS.CERTIFICATIONS]: 'Certifications',
  [PRIMARY_FOCUS_AREAS.SHADOWING]: 'Shadowing',
  [PRIMARY_FOCUS_AREAS.LEADERSHIP]: 'Leadership',
  [PRIMARY_FOCUS_AREAS.RESUME]: 'Resume/CV',
  [PRIMARY_FOCUS_AREAS.ESSAY]: 'Personal Statement',
  [PRIMARY_FOCUS_AREAS.INTERVIEW_PREP]: 'Interview Prep',
};

/**
 * Focus area status
 */
export const FOCUS_AREA_STATUSES = {
  ACTIVE: 'active',
  SECONDARY: 'secondary',
  COMPLETED: 'completed',
};

export const FOCUS_AREA_STATUS_VALUES = Object.values(FOCUS_AREA_STATUSES);

/**
 * Focus area source - how the focus area was activated
 */
export const FOCUS_AREA_SOURCES = {
  SYSTEM: 'system',           // System-inferred based on stage or requirements
  BEHAVIOR: 'behavior',       // Inferred from user behavior (page views, feature usage)
  USER_ACTION: 'user_action', // User explicitly set via UI
};

export const FOCUS_AREA_SOURCE_VALUES = Object.values(FOCUS_AREA_SOURCES);

// =============================================================================
// PROGRAM / APPLICATION STATUSES
// =============================================================================

/**
 * Target program application status
 * Used for: target program cards, checklist filtering, dashboard stats
 */
export const PROGRAM_STATUSES = {
  NOT_STARTED: 'not_started',
  RESEARCHING: 'researching',
  PREPARING: 'preparing',
  APPLYING: 'applying',
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  INTERVIEW_INVITE: 'interview_invite',
  INTERVIEW_INVITED: 'interview_invited',
  INTERVIEW_COMPLETE: 'interview_complete',
  INTERVIEWED: 'interviewed',
  WAITLISTED: 'waitlisted',
  DENIED: 'denied',
  REJECTED: 'rejected',
  ACCEPTED: 'accepted',
  ACCEPTED_DECLINED: 'accepted_declined',
};

export const PROGRAM_STATUS_VALUES = Object.values(PROGRAM_STATUSES);

export const PROGRAM_STATUS_LABELS = {
  [PROGRAM_STATUSES.NOT_STARTED]: 'Not Started',
  [PROGRAM_STATUSES.RESEARCHING]: 'Researching',
  [PROGRAM_STATUSES.PREPARING]: 'Preparing',
  [PROGRAM_STATUSES.APPLYING]: 'Applying',
  [PROGRAM_STATUSES.IN_PROGRESS]: 'In Progress',
  [PROGRAM_STATUSES.SUBMITTED]: 'Submitted',
  [PROGRAM_STATUSES.INTERVIEW_INVITE]: 'Interview Invited',
  [PROGRAM_STATUSES.INTERVIEW_INVITED]: 'Interview Invited',
  [PROGRAM_STATUSES.INTERVIEW_COMPLETE]: 'Interview Complete',
  [PROGRAM_STATUSES.INTERVIEWED]: 'Interviewed',
  [PROGRAM_STATUSES.WAITLISTED]: 'Waitlisted',
  [PROGRAM_STATUSES.DENIED]: 'Denied',
  [PROGRAM_STATUSES.REJECTED]: 'Rejected',
  [PROGRAM_STATUSES.ACCEPTED]: 'Accepted',
  [PROGRAM_STATUSES.ACCEPTED_DECLINED]: 'Declined Offer',
};

export const PROGRAM_STATUS_COLORS = {
  [PROGRAM_STATUSES.NOT_STARTED]: 'gray',
  [PROGRAM_STATUSES.RESEARCHING]: 'gray',
  [PROGRAM_STATUSES.PREPARING]: 'amber',
  [PROGRAM_STATUSES.APPLYING]: 'orange',
  [PROGRAM_STATUSES.IN_PROGRESS]: 'blue',
  [PROGRAM_STATUSES.SUBMITTED]: 'purple',
  [PROGRAM_STATUSES.INTERVIEW_INVITE]: 'violet',
  [PROGRAM_STATUSES.INTERVIEW_INVITED]: 'violet',
  [PROGRAM_STATUSES.INTERVIEW_COMPLETE]: 'indigo',
  [PROGRAM_STATUSES.INTERVIEWED]: 'indigo',
  [PROGRAM_STATUSES.WAITLISTED]: 'yellow',
  [PROGRAM_STATUSES.DENIED]: 'red',
  [PROGRAM_STATUSES.REJECTED]: 'red',
  [PROGRAM_STATUSES.ACCEPTED]: 'green',
  [PROGRAM_STATUSES.ACCEPTED_DECLINED]: 'gray',
};

// =============================================================================
// LOR (LETTER OF RECOMMENDATION) STATUSES
// =============================================================================

/**
 * Letter of recommendation tracking status
 * Used for: LOR tracking UI, deadline alerts
 */
export const LOR_STATUSES = {
  NOT_REQUESTED: 'not_requested',
  REQUESTED: 'requested',
  CONFIRMED: 'confirmed',
  SUBMITTED: 'submitted',
  RECEIVED: 'received',
  DECLINED: 'declined',
};

export const LOR_STATUS_VALUES = Object.values(LOR_STATUSES);

export const LOR_STATUS_LABELS = {
  [LOR_STATUSES.NOT_REQUESTED]: 'Not Requested',
  [LOR_STATUSES.REQUESTED]: 'Requested',
  [LOR_STATUSES.CONFIRMED]: 'Confirmed',
  [LOR_STATUSES.SUBMITTED]: 'Submitted',
  [LOR_STATUSES.RECEIVED]: 'Received',
  [LOR_STATUSES.DECLINED]: 'Declined',
};

// =============================================================================
// CLINICAL EXPERIENCE
// =============================================================================

/**
 * Confidence/competency levels for clinical skills
 * Used for: clinical tracker entries, skill assessments
 */
export const CONFIDENCE_LEVELS = {
  OBSERVED: 'observed',
  ASSISTED: 'assisted',
  PERFORMED: 'performed',
  COULD_TEACH: 'could_teach',
};

export const CONFIDENCE_LEVEL_VALUES = Object.values(CONFIDENCE_LEVELS);

export const CONFIDENCE_LEVEL_LABELS = {
  [CONFIDENCE_LEVELS.OBSERVED]: 'Observed',
  [CONFIDENCE_LEVELS.ASSISTED]: 'Assisted',
  [CONFIDENCE_LEVELS.PERFORMED]: 'Performed Independently',
  [CONFIDENCE_LEVELS.COULD_TEACH]: 'Could Teach Others',
};

/**
 * ICU types for clinical profile
 */
export const ICU_TYPES = {
  MICU: 'micu',
  SICU: 'sicu',
  CVICU: 'cvicu',
  CTICU: 'cticu',
  NEURO_ICU: 'neuro_icu',
  TRAUMA_ICU: 'trauma_icu',
  BURN_ICU: 'burn_icu',
  PICU: 'picu',
  NICU: 'nicu',
  MIXED: 'mixed',
  FLIGHT_NURSE: 'flight_nurse',
  OTHER: 'other',
};

export const ICU_TYPE_VALUES = Object.values(ICU_TYPES);

export const ICU_TYPE_LABELS = {
  [ICU_TYPES.MICU]: 'Medical ICU (MICU)',
  [ICU_TYPES.SICU]: 'Surgical ICU (SICU)',
  [ICU_TYPES.CVICU]: 'Cardiovascular ICU (CVICU)',
  [ICU_TYPES.CTICU]: 'Cardiothoracic ICU (CTICU)',
  [ICU_TYPES.NEURO_ICU]: 'Neuro ICU',
  [ICU_TYPES.TRAUMA_ICU]: 'Trauma ICU',
  [ICU_TYPES.BURN_ICU]: 'Burn ICU',
  [ICU_TYPES.PICU]: 'Pediatric ICU (PICU)',
  [ICU_TYPES.NICU]: 'Neonatal ICU (NICU)',
  [ICU_TYPES.MIXED]: 'Mixed/General ICU',
  [ICU_TYPES.FLIGHT_NURSE]: 'Flight Nurse',
  [ICU_TYPES.OTHER]: 'Other',
};

/**
 * Shift types for clinical logging
 */
export const SHIFT_TYPES = {
  DAY: 'day',
  NIGHT: 'night',
  SWING: 'swing',
};

export const SHIFT_TYPE_VALUES = Object.values(SHIFT_TYPES);

// =============================================================================
// CERTIFICATIONS
// =============================================================================

/**
 * Certification types
 */
export const CERTIFICATION_TYPES = {
  CCRN: 'ccrn',
  BLS: 'bls',
  ACLS: 'acls',
  PALS: 'pals',
  NRP: 'nrp',
  TNCC: 'tncc',
  ENPC: 'enpc',
  CEN: 'cen',
  OTHER: 'other',
};

export const CERTIFICATION_TYPE_VALUES = Object.values(CERTIFICATION_TYPES);

/**
 * Certification status
 */
export const CERTIFICATION_STATUSES = {
  NOT_STARTED: 'not_started',
  STUDYING: 'studying',
  SCHEDULED: 'scheduled',
  PASSED: 'passed',
  EXPIRED: 'expired',
};

export const CERTIFICATION_STATUS_VALUES = Object.values(CERTIFICATION_STATUSES);

// =============================================================================
// PROGRAM REQUIREMENTS
// =============================================================================

/**
 * GRE requirement levels
 */
export const GRE_REQUIREMENTS = {
  REQUIRED: 'required',
  RECOMMENDED: 'recommended',
  OPTIONAL: 'optional',
  NOT_REQUIRED: 'not_required',
};

export const GRE_REQUIREMENT_VALUES = Object.values(GRE_REQUIREMENTS);

/**
 * CCRN requirement levels
 */
export const CCRN_REQUIREMENTS = {
  REQUIRED: 'required',
  PREFERRED: 'preferred',
  NOT_REQUIRED: 'not_required',
};

export const CCRN_REQUIREMENT_VALUES = Object.values(CCRN_REQUIREMENTS);

// =============================================================================
// PREREQUISITES
// =============================================================================

/**
 * Prerequisite course types
 */
export const PREREQUISITE_TYPES = {
  ANATOMY: 'anatomy',
  PHYSIOLOGY: 'physiology',
  PHYSICS: 'physics',
  BIOCHEMISTRY: 'biochemistry',
  ORGANIC_CHEMISTRY: 'organic_chemistry',
  GENERAL_CHEMISTRY: 'general_chemistry',
  PATHOPHYSIOLOGY: 'pathophysiology',
  PHARMACOLOGY: 'pharmacology',
  MICROBIOLOGY: 'microbiology',
  RESEARCH: 'research',
  STATISTICS: 'statistics',
};

export const PREREQUISITE_TYPE_VALUES = Object.values(PREREQUISITE_TYPES);

export const PREREQUISITE_TYPE_LABELS = {
  [PREREQUISITE_TYPES.ANATOMY]: 'Anatomy',
  [PREREQUISITE_TYPES.PHYSIOLOGY]: 'Physiology',
  [PREREQUISITE_TYPES.PHYSICS]: 'Physics',
  [PREREQUISITE_TYPES.BIOCHEMISTRY]: 'Biochemistry',
  [PREREQUISITE_TYPES.ORGANIC_CHEMISTRY]: 'Organic Chemistry',
  [PREREQUISITE_TYPES.GENERAL_CHEMISTRY]: 'General Chemistry',
  [PREREQUISITE_TYPES.PATHOPHYSIOLOGY]: 'Pathophysiology',
  [PREREQUISITE_TYPES.PHARMACOLOGY]: 'Pharmacology',
  [PREREQUISITE_TYPES.MICROBIOLOGY]: 'Microbiology',
  [PREREQUISITE_TYPES.RESEARCH]: 'Research Methods',
  [PREREQUISITE_TYPES.STATISTICS]: 'Statistics',
};

// =============================================================================
// SHADOW DAY SKILLS
// =============================================================================

/**
 * Skills observed during shadow days
 */
export const SHADOW_SKILLS = {
  INTUBATION: 'intubation',
  EXTUBATION: 'extubation',
  MASK_VENTILATION: 'mask_ventilation',
  IV_START: 'iv_start',
  ARTERIAL_LINE: 'arterial_line',
  CENTRAL_LINE: 'central_line',
  SPINAL: 'spinal',
  EPIDURAL: 'epidural',
  NERVE_BLOCK: 'nerve_block',
  LMA_PLACEMENT: 'lma_placement',
  RAPID_SEQUENCE: 'rapid_sequence',
  DRUG_TITRATION: 'drug_titration',
};

export const SHADOW_SKILL_VALUES = Object.values(SHADOW_SKILLS);

export const SHADOW_SKILL_LABELS = {
  [SHADOW_SKILLS.INTUBATION]: 'Intubation',
  [SHADOW_SKILLS.EXTUBATION]: 'Extubation',
  [SHADOW_SKILLS.MASK_VENTILATION]: 'Mask Ventilation',
  [SHADOW_SKILLS.IV_START]: 'IV Start',
  [SHADOW_SKILLS.ARTERIAL_LINE]: 'Arterial Line Placement',
  [SHADOW_SKILLS.CENTRAL_LINE]: 'Central Line Placement',
  [SHADOW_SKILLS.SPINAL]: 'Spinal Anesthesia',
  [SHADOW_SKILLS.EPIDURAL]: 'Epidural Placement',
  [SHADOW_SKILLS.NERVE_BLOCK]: 'Nerve Block',
  [SHADOW_SKILLS.LMA_PLACEMENT]: 'LMA Placement',
  [SHADOW_SKILLS.RAPID_SEQUENCE]: 'Rapid Sequence Induction',
  [SHADOW_SKILLS.DRUG_TITRATION]: 'Drug Titration',
};

// =============================================================================
// SUBSCRIPTION & ACCESS
// =============================================================================

/**
 * Subscription tiers
 */
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  TRIAL: 'trial',
  MEMBER: 'member',
  FOUNDING_MEMBER: 'founding_member',
  TOOLKIT_ONLY: 'toolkit_only',
};

export const SUBSCRIPTION_TIER_VALUES = Object.values(SUBSCRIPTION_TIERS);

/**
 * Subscription statuses
 */
export const SUBSCRIPTION_STATUSES = {
  ACTIVE: 'active',
  TRIAL: 'trial',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
  PAUSED: 'paused',
};

export const SUBSCRIPTION_STATUS_VALUES = Object.values(SUBSCRIPTION_STATUSES);

// =============================================================================
// INTERVIEW TYPES
// =============================================================================

/**
 * Interview format types
 */
export const INTERVIEW_TYPES = {
  IN_PERSON: 'in_person',
  VIRTUAL: 'virtual',
  HYBRID: 'hybrid',
};

export const INTERVIEW_TYPE_VALUES = Object.values(INTERVIEW_TYPES);

export const INTERVIEW_TYPE_LABELS = {
  [INTERVIEW_TYPES.IN_PERSON]: 'In Person',
  [INTERVIEW_TYPES.VIRTUAL]: 'Virtual',
  [INTERVIEW_TYPES.HYBRID]: 'Hybrid',
};

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Check if a value is a valid application stage
 */
export function isValidApplicationStage(value) {
  return APPLICATION_STAGE_VALUES.includes(value);
}

/**
 * Check if a value is a valid user stage (legacy alias)
 * @deprecated Use isValidApplicationStage instead
 */
export function isValidUserStage(value) {
  return APPLICATION_STAGE_VALUES.includes(value);
}

/**
 * Check if a value is a valid support mode
 */
export function isValidSupportMode(value) {
  return SUPPORT_MODE_VALUES.includes(value);
}

/**
 * Check if a value is a valid risk signal
 */
export function isValidRiskSignal(value) {
  return RISK_SIGNAL_VALUES.includes(value);
}

/**
 * Check if a value is a valid primary focus area
 */
export function isValidPrimaryFocusArea(value) {
  return PRIMARY_FOCUS_AREA_VALUES.includes(value);
}

/**
 * Check if a value is a valid program status
 */
export function isValidProgramStatus(value) {
  return PROGRAM_STATUS_VALUES.includes(value);
}

/**
 * Check if a value is a valid LOR status
 */
export function isValidLorStatus(value) {
  return LOR_STATUS_VALUES.includes(value);
}

/**
 * Check if a value is a valid confidence level
 */
export function isValidConfidenceLevel(value) {
  return CONFIDENCE_LEVEL_VALUES.includes(value);
}

/**
 * Check if a value is a valid ICU type
 */
export function isValidIcuType(value) {
  return ICU_TYPE_VALUES.includes(value);
}

/**
 * Check if a value is a valid prerequisite type
 */
export function isValidPrerequisiteType(value) {
  return PREREQUISITE_TYPE_VALUES.includes(value);
}

/**
 * Check if a value is a valid interview type
 */
export function isValidInterviewType(value) {
  return INTERVIEW_TYPE_VALUES.includes(value);
}

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default {
  // Category 12: Guidance & Focus State
  APPLICATION_STAGES,
  APPLICATION_STAGE_VALUES,
  APPLICATION_STAGE_LABELS,
  SUPPORT_MODES,
  SUPPORT_MODE_VALUES,
  SUPPORT_MODE_LABELS,
  RISK_SIGNALS,
  RISK_SIGNAL_VALUES,
  RISK_SIGNAL_LABELS,
  PRIMARY_FOCUS_AREAS,
  PRIMARY_FOCUS_AREA_VALUES,
  PRIMARY_FOCUS_AREA_LABELS,
  FOCUS_AREA_STATUSES,
  FOCUS_AREA_STATUS_VALUES,
  FOCUS_AREA_SOURCES,
  FOCUS_AREA_SOURCE_VALUES,
  // Legacy aliases
  USER_STAGES,
  USER_STAGE_VALUES,
  USER_STAGE_LABELS,
  // Other enums
  PROGRAM_STATUSES,
  PROGRAM_STATUS_VALUES,
  PROGRAM_STATUS_LABELS,
  PROGRAM_STATUS_COLORS,
  LOR_STATUSES,
  LOR_STATUS_VALUES,
  LOR_STATUS_LABELS,
  CONFIDENCE_LEVELS,
  CONFIDENCE_LEVEL_VALUES,
  CONFIDENCE_LEVEL_LABELS,
  ICU_TYPES,
  ICU_TYPE_VALUES,
  ICU_TYPE_LABELS,
  SHIFT_TYPES,
  SHIFT_TYPE_VALUES,
  CERTIFICATION_TYPES,
  CERTIFICATION_TYPE_VALUES,
  CERTIFICATION_STATUSES,
  CERTIFICATION_STATUS_VALUES,
  GRE_REQUIREMENTS,
  GRE_REQUIREMENT_VALUES,
  CCRN_REQUIREMENTS,
  CCRN_REQUIREMENT_VALUES,
  PREREQUISITE_TYPES,
  PREREQUISITE_TYPE_VALUES,
  PREREQUISITE_TYPE_LABELS,
  SHADOW_SKILLS,
  SHADOW_SKILL_VALUES,
  SHADOW_SKILL_LABELS,
  SUBSCRIPTION_TIERS,
  SUBSCRIPTION_TIER_VALUES,
  SUBSCRIPTION_STATUSES,
  SUBSCRIPTION_STATUS_VALUES,
  INTERVIEW_TYPES,
  INTERVIEW_TYPE_VALUES,
  INTERVIEW_TYPE_LABELS,
  isValidUserStage,
  isValidApplicationStage,
  isValidSupportMode,
  isValidRiskSignal,
  isValidPrimaryFocusArea,
  isValidProgramStatus,
  isValidLorStatus,
  isValidConfidenceLevel,
  isValidIcuType,
  isValidPrerequisiteType,
  isValidInterviewType,
};
