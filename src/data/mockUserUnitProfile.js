/**
 * Mock User Unit Profile
 *
 * Sample unit profile data for development.
 * Collected after 5 entries via inline prompt.
 *
 * TODO: Replace with API call to Supabase
 */

// =============================================================================
// UNIT TYPES
// =============================================================================

export const UNIT_TYPES = [
  { value: 'cvicu', label: 'CVICU (Cardiovascular ICU)' },
  { value: 'micu', label: 'MICU (Medical ICU)' },
  { value: 'sicu', label: 'SICU (Surgical ICU)' },
  { value: 'neuro_icu', label: 'Neuro ICU' },
  { value: 'trauma_icu', label: 'Trauma ICU' },
  { value: 'ccu', label: 'CCU (Cardiac Care Unit)' },
  { value: 'cticu', label: 'CTICU (Cardiothoracic ICU)' },
  { value: 'burn_icu', label: 'Burn ICU' },
  { value: 'picu', label: 'PICU (Pediatric ICU)' },
  { value: 'nicu', label: 'NICU (Neonatal ICU)' },
  { value: 'mixed_icu', label: 'Mixed ICU / General ICU' },
];

// =============================================================================
// HOSPITAL TYPES
// =============================================================================

export const HOSPITAL_TYPES = [
  { value: 'academic', label: 'Academic Medical Center' },
  { value: 'community', label: 'Community Hospital' },
  { value: 'private', label: 'Private Hospital' },
  { value: 'va', label: 'VA Hospital' },
  { value: 'county', label: 'County/Public Hospital' },
  { value: 'military', label: 'Military Hospital' },
];

// =============================================================================
// BED COUNT RANGES
// =============================================================================

export const BED_COUNT_RANGES = [
  { value: 'small', label: '1-99 beds', min: 1, max: 99 },
  { value: 'medium', label: '100-299 beds', min: 100, max: 299 },
  { value: 'large', label: '300-499 beds', min: 300, max: 499 },
  { value: 'very_large', label: '500+ beds', min: 500, max: null },
];

// =============================================================================
// TRAUMA LEVELS
// =============================================================================

export const TRAUMA_LEVELS = [
  { value: 'level_1', label: 'Level I Trauma Center' },
  { value: 'level_2', label: 'Level II Trauma Center' },
  { value: 'level_3', label: 'Level III Trauma Center' },
  { value: 'none', label: 'Not a Trauma Center' },
];

// =============================================================================
// SHIFT PATTERNS
// =============================================================================

export const SHIFT_PATTERNS = [
  { value: '3x12', label: '3x12 hour shifts' },
  { value: '4x10', label: '4x10 hour shifts' },
  { value: '5x8', label: '5x8 hour shifts' },
  { value: 'variable', label: 'Variable/Mixed' },
];

// =============================================================================
// TYPICAL SHIFT TYPES
// =============================================================================

export const TYPICAL_SHIFTS = [
  { value: 'days', label: 'Days (7a-7p)' },
  { value: 'nights', label: 'Nights (7p-7a)' },
  { value: 'rotating', label: 'Rotating' },
];

// =============================================================================
// UNIT CAPABILITIES
// =============================================================================

export const UNIT_CAPABILITIES = [
  { value: 'ecmo', label: 'ECMO' },
  { value: 'impella', label: 'Impella' },
  { value: 'iabp', label: 'IABP' },
  { value: 'lvad', label: 'LVAD' },
  { value: 'crrt', label: 'CRRT/CVVH' },
  { value: 'targeted_temp', label: 'Targeted Temperature Management' },
  { value: 'evd', label: 'EVD/ICP Monitoring' },
  { value: 'open_heart', label: 'Open Heart Surgery' },
  { value: 'transplant', label: 'Transplant Program' },
];

// =============================================================================
// MOCK USER UNIT PROFILE
// =============================================================================

export const mockUserUnitProfile = {
  userId: 'user_123',

  // Unit Information
  unitType: 'cvicu',
  unitName: 'Cardiac Surgical ICU',

  // Hospital Information
  hospitalName: 'Stanford Medical Center',
  hospitalCity: 'Stanford',
  hospitalState: 'CA',
  hospitalType: 'academic',
  bedCount: 'very_large',
  traumaLevel: 'level_1',
  magnetStatus: true,
  urbanRural: 'urban',

  // Unit Capabilities
  capabilities: ['ecmo', 'impella', 'iabp', 'lvad', 'crrt', 'open_heart', 'transplant'],

  // Shift Schedule
  shiftPattern: '3x12',
  typicalShift: 'nights',
  typicalDays: ['sunday', 'monday', 'tuesday'], // Which days they usually work

  // Profile completion
  isComplete: true,
  completedAt: '2024-11-15T10:30:00Z',
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get unit type label
 */
export function getUnitTypeLabel(value) {
  return UNIT_TYPES.find((u) => u.value === value)?.label || value;
}

/**
 * Get hospital type label
 */
export function getHospitalTypeLabel(value) {
  return HOSPITAL_TYPES.find((h) => h.value === value)?.label || value;
}

/**
 * Get trauma level label
 */
export function getTraumaLevelLabel(value) {
  return TRAUMA_LEVELS.find((t) => t.value === value)?.label || value;
}

/**
 * Check if user profile is complete
 */
export function isProfileComplete(profile) {
  return !!(
    profile?.unitType &&
    profile?.hospitalName &&
    profile?.hospitalState &&
    profile?.shiftPattern
  );
}

/**
 * Get missing profile fields
 */
export function getMissingFields(profile) {
  const required = ['unitType', 'hospitalName', 'hospitalState', 'shiftPattern'];
  return required.filter((field) => !profile?.[field]);
}

export default mockUserUnitProfile;
