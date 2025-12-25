/**
 * Mock User Preferences (Category 4 Data)
 *
 * Explicit user preferences for program matching & filtering.
 * Collected via onboarding wizard and preferences page.
 *
 * TODO: Replace with API call to Supabase user_preferences table
 */

// =============================================================================
// ENUMS FOR PREFERENCES
// =============================================================================

export const REGION_OPTIONS = {
  NORTHEAST: 'northeast',
  MIDWEST: 'midwest',
  SOUTHEAST: 'southeast',
  SOUTHWEST: 'southwest',
  WEST: 'west',
};

export const PROGRAM_TYPE_PREFERENCES = {
  FRONT_LOADED: 'front_loaded',
  INTEGRATED: 'integrated',
  NO_PREFERENCE: 'no_preference',
};

export const DEGREE_PREFERENCES = {
  DNP: 'dnp',
  DNAP: 'dnap',
  NO_PREFERENCE: 'no_preference',
};

export const CLASS_SIZE_PREFERENCES = {
  SMALL: 'small',      // < 20 students
  MEDIUM: 'medium',    // 20-40 students
  LARGE: 'large',      // > 40 students
  NO_PREFERENCE: 'no_preference',
};

export const START_TERM_PREFERENCES = {
  FALL: 'fall',
  SPRING: 'spring',
  SUMMER: 'summer',
  ANY: 'any',
};

// =============================================================================
// MOCK USER PREFERENCES
// =============================================================================

export const mockUserPreferences = {
  userId: 'user_001',

  // Location preferences
  preferredRegions: [REGION_OPTIONS.NORTHEAST, REGION_OPTIONS.MIDWEST],
  preferredStates: ['PA', 'NY', 'OH', 'IL', 'WI'],
  willingToRelocate: true,

  // Budget preferences
  maxTuition: 120000,

  // Program type preferences
  programTypePreference: PROGRAM_TYPE_PREFERENCES.NO_PREFERENCE,
  degreePreference: DEGREE_PREFERENCES.DNP,
  classSizePreference: CLASS_SIZE_PREFERENCES.MEDIUM,

  // Requirements preferences
  avoidGre: true,
  preferOnlineHybrid: false,

  // Special interests
  militaryInterest: false,

  // Timeline preferences
  startYearPreference: 2026,
  startTermPreference: START_TERM_PREFERENCES.FALL,

  // Metadata
  lastUpdatedAt: '2024-11-01T00:00:00Z',
  completedOnboarding: true,
};

// =============================================================================
// PREFERENCE LABELS (for UI display)
// =============================================================================

export const REGION_LABELS = {
  [REGION_OPTIONS.NORTHEAST]: 'Northeast',
  [REGION_OPTIONS.MIDWEST]: 'Midwest',
  [REGION_OPTIONS.SOUTHEAST]: 'Southeast',
  [REGION_OPTIONS.SOUTHWEST]: 'Southwest',
  [REGION_OPTIONS.WEST]: 'West Coast',
};

export const PROGRAM_TYPE_LABELS = {
  [PROGRAM_TYPE_PREFERENCES.FRONT_LOADED]: 'Front-Loaded',
  [PROGRAM_TYPE_PREFERENCES.INTEGRATED]: 'Integrated',
  [PROGRAM_TYPE_PREFERENCES.NO_PREFERENCE]: 'No Preference',
};

export const DEGREE_LABELS = {
  [DEGREE_PREFERENCES.DNP]: 'DNP (Doctor of Nursing Practice)',
  [DEGREE_PREFERENCES.DNAP]: 'DNAP (Doctor of Nurse Anesthesia Practice)',
  [DEGREE_PREFERENCES.NO_PREFERENCE]: 'No Preference',
};

export const CLASS_SIZE_LABELS = {
  [CLASS_SIZE_PREFERENCES.SMALL]: 'Small (< 20 students)',
  [CLASS_SIZE_PREFERENCES.MEDIUM]: 'Medium (20-40 students)',
  [CLASS_SIZE_PREFERENCES.LARGE]: 'Large (> 40 students)',
  [CLASS_SIZE_PREFERENCES.NO_PREFERENCE]: 'No Preference',
};

export const START_TERM_LABELS = {
  [START_TERM_PREFERENCES.FALL]: 'Fall',
  [START_TERM_PREFERENCES.SPRING]: 'Spring',
  [START_TERM_PREFERENCES.SUMMER]: 'Summer',
  [START_TERM_PREFERENCES.ANY]: 'Any Term',
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get a summary of user preferences for display
 */
export function getPreferencesSummary(preferences = mockUserPreferences) {
  const summary = [];

  if (preferences.preferredStates?.length > 0) {
    summary.push(`States: ${preferences.preferredStates.join(', ')}`);
  }

  if (preferences.maxTuition) {
    summary.push(`Budget: Under $${(preferences.maxTuition / 1000).toFixed(0)}k`);
  }

  if (preferences.avoidGre) {
    summary.push('Prefers no GRE');
  }

  if (preferences.degreePreference !== DEGREE_PREFERENCES.NO_PREFERENCE) {
    summary.push(DEGREE_LABELS[preferences.degreePreference]);
  }

  return summary;
}

/**
 * Check if preferences are complete enough for filtering
 */
export function arePreferencesComplete(preferences = mockUserPreferences) {
  return (
    preferences.completedOnboarding &&
    (preferences.preferredRegions?.length > 0 || preferences.preferredStates?.length > 0) &&
    preferences.startYearPreference
  );
}

/**
 * Get default preferences for new users
 */
export function getDefaultPreferences() {
  return {
    preferredRegions: [],
    preferredStates: [],
    willingToRelocate: false,
    maxTuition: null,
    programTypePreference: PROGRAM_TYPE_PREFERENCES.NO_PREFERENCE,
    degreePreference: DEGREE_PREFERENCES.NO_PREFERENCE,
    classSizePreference: CLASS_SIZE_PREFERENCES.NO_PREFERENCE,
    avoidGre: false,
    preferOnlineHybrid: false,
    militaryInterest: false,
    startYearPreference: new Date().getFullYear() + 1,
    startTermPreference: START_TERM_PREFERENCES.ANY,
    lastUpdatedAt: null,
    completedOnboarding: false,
  };
}

export default mockUserPreferences;
