/**
 * Data Validation Functions for The CRNA Club
 *
 * Validates user input and data integrity before saving or displaying.
 * Use these validators in forms, API calls, and data transformations.
 *
 * Usage:
 *   import { validateGpa, validateDate, validateUserProfile } from '@/lib/validators';
 */

import {
  isValidUserStage,
  isValidProgramStatus,
  isValidLorStatus,
  isValidConfidenceLevel,
  isValidIcuType,
  isValidPrerequisiteType,
  isValidInterviewType,
} from './enums';

// =============================================================================
// INPUT HELPERS (for controlled form inputs)
// =============================================================================

/**
 * Check if a value is a valid GPA input string (for controlled inputs).
 * Allows empty string for clearing the field, partial numbers during typing.
 *
 * @param {string} value - The input value to validate
 * @param {number} max - Maximum allowed value (default: 4.0)
 * @returns {boolean} True if the value is acceptable for input
 */
export function isValidGpaInput(value, max = 4.0) {
  if (value === '') return true;
  if (!/^\d*\.?\d*$/.test(value)) return false;
  const num = parseFloat(value);
  return isNaN(num) || (num >= 0 && num <= max);
}

/**
 * Parse a GPA string value to a number, returning null for invalid/empty.
 *
 * @param {string} value - The string value to parse
 * @returns {number|null} The parsed GPA or null
 */
export function parseGpa(value) {
  if (!value || value === '') return null;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Check if a value is a valid hours input string (for controlled inputs).
 *
 * @param {string} value - The input value to validate
 * @param {number} max - Maximum allowed hours (default: 99999)
 * @returns {boolean} True if the value is acceptable for input
 */
export function isValidHoursInput(value, max = 99999) {
  if (value === '') return true;
  if (!/^\d*$/.test(value)) return false;
  const num = parseInt(value, 10);
  return isNaN(num) || (num >= 0 && num <= max);
}

// =============================================================================
// NUMERIC VALIDATORS
// =============================================================================

/**
 * Validate GPA value (0.0 - 4.0 scale)
 * @param {number} gpa - GPA value to validate
 * @returns {{ valid: boolean, error?: string, value?: number }}
 */
export function validateGpa(gpa) {
  if (gpa === null || gpa === undefined || gpa === '') {
    return { valid: true, value: null }; // Optional field
  }

  const numGpa = typeof gpa === 'string' ? parseFloat(gpa) : gpa;

  if (isNaN(numGpa)) {
    return { valid: false, error: 'GPA must be a number' };
  }

  if (numGpa < 0 || numGpa > 4.0) {
    return { valid: false, error: 'GPA must be between 0.0 and 4.0' };
  }

  return { valid: true, value: Math.round(numGpa * 100) / 100 }; // Round to 2 decimals
}

/**
 * Validate GRE score
 * @param {number} score - GRE score to validate
 * @param {'quantitative'|'verbal'|'writing'} type - Which GRE section
 * @returns {{ valid: boolean, error?: string, value?: number }}
 */
export function validateGreScore(score, type = 'quantitative') {
  if (score === null || score === undefined || score === '') {
    return { valid: true, value: null }; // Optional field
  }

  const numScore = typeof score === 'string' ? parseFloat(score) : score;

  if (isNaN(numScore)) {
    return { valid: false, error: 'GRE score must be a number' };
  }

  if (type === 'writing') {
    if (numScore < 0 || numScore > 6) {
      return { valid: false, error: 'GRE Analytical Writing score must be between 0 and 6' };
    }
    return { valid: true, value: Math.round(numScore * 10) / 10 }; // Round to 1 decimal
  }

  // Quantitative and Verbal: 130-170
  if (numScore < 130 || numScore > 170) {
    return { valid: false, error: 'GRE Quantitative/Verbal score must be between 130 and 170' };
  }

  return { valid: true, value: Math.round(numScore) }; // Whole numbers only
}

/**
 * Validate years of experience
 * @param {number} years - Years of experience
 * @returns {{ valid: boolean, error?: string, value?: number }}
 */
export function validateYearsExperience(years) {
  if (years === null || years === undefined || years === '') {
    return { valid: true, value: null };
  }

  const numYears = typeof years === 'string' ? parseFloat(years) : years;

  if (isNaN(numYears)) {
    return { valid: false, error: 'Years must be a number' };
  }

  if (numYears < 0) {
    return { valid: false, error: 'Years cannot be negative' };
  }

  if (numYears > 50) {
    return { valid: false, error: 'Years value seems too high' };
  }

  return { valid: true, value: Math.round(numYears * 10) / 10 }; // Round to 1 decimal
}

/**
 * Validate shadow hours
 * @param {number} hours - Shadow hours to validate
 * @returns {{ valid: boolean, error?: string, value?: number }}
 */
export function validateShadowHours(hours) {
  if (hours === null || hours === undefined || hours === '') {
    return { valid: true, value: null };
  }

  const numHours = typeof hours === 'string' ? parseFloat(hours) : hours;

  if (isNaN(numHours)) {
    return { valid: false, error: 'Hours must be a number' };
  }

  if (numHours < 0) {
    return { valid: false, error: 'Hours cannot be negative' };
  }

  if (numHours > 24) {
    return { valid: false, error: 'Hours per day cannot exceed 24' };
  }

  return { valid: true, value: Math.round(numHours * 10) / 10 };
}

/**
 * Validate cases observed count
 * @param {number} cases - Number of cases
 * @returns {{ valid: boolean, error?: string, value?: number }}
 */
export function validateCasesObserved(cases) {
  if (cases === null || cases === undefined || cases === '') {
    return { valid: true, value: null };
  }

  const numCases = typeof cases === 'string' ? parseInt(cases, 10) : cases;

  if (isNaN(numCases)) {
    return { valid: false, error: 'Cases must be a number' };
  }

  if (numCases < 0) {
    return { valid: false, error: 'Cases cannot be negative' };
  }

  if (numCases > 100) {
    return { valid: false, error: 'Cases per day seems too high (max 100)' };
  }

  return { valid: true, value: Math.round(numCases) };
}

// =============================================================================
// DATE VALIDATORS
// =============================================================================

/**
 * Validate and parse a date string
 * @param {string|Date} date - Date to validate
 * @returns {{ valid: boolean, error?: string, value?: Date }}
 */
export function validateDate(date) {
  if (date === null || date === undefined || date === '') {
    return { valid: true, value: null };
  }

  let dateObj;

  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    return { valid: false, error: 'Invalid date format' };
  }

  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: 'Invalid date' };
  }

  return { valid: true, value: dateObj };
}

/**
 * Validate that a date is not in the future
 * @param {string|Date} date - Date to validate
 * @returns {{ valid: boolean, error?: string, value?: Date }}
 */
export function validatePastDate(date) {
  const result = validateDate(date);
  if (!result.valid || !result.value) return result;

  if (result.value > new Date()) {
    return { valid: false, error: 'Date cannot be in the future' };
  }

  return result;
}

/**
 * Validate that a date is in the future
 * @param {string|Date} date - Date to validate
 * @returns {{ valid: boolean, error?: string, value?: Date }}
 */
export function validateFutureDate(date) {
  const result = validateDate(date);
  if (!result.valid || !result.value) return result;

  if (result.value < new Date()) {
    return { valid: false, error: 'Date must be in the future' };
  }

  return result;
}

/**
 * Validate a deadline date (should be in the future, but allow some grace period)
 * @param {string|Date} date - Deadline date
 * @returns {{ valid: boolean, error?: string, value?: Date, isPast?: boolean }}
 */
export function validateDeadline(date) {
  const result = validateDate(date);
  if (!result.valid || !result.value) return result;

  const isPast = result.value < new Date();

  return { ...result, isPast };
}

// =============================================================================
// TEXT VALIDATORS
// =============================================================================

/**
 * Validate text with length constraints
 * @param {string} text - Text to validate
 * @param {Object} options - Validation options
 * @param {number} [options.minLength=0] - Minimum length
 * @param {number} [options.maxLength=5000] - Maximum length
 * @param {boolean} [options.required=false] - Is field required?
 * @returns {{ valid: boolean, error?: string, value?: string }}
 */
export function validateText(text, { minLength = 0, maxLength = 5000, required = false } = {}) {
  if (text === null || text === undefined || text === '') {
    if (required) {
      return { valid: false, error: 'This field is required' };
    }
    return { valid: true, value: null };
  }

  const trimmed = String(text).trim();

  if (trimmed.length < minLength) {
    return { valid: false, error: `Must be at least ${minLength} characters` };
  }

  if (trimmed.length > maxLength) {
    return { valid: false, error: `Must be ${maxLength} characters or less` };
  }

  return { valid: true, value: trimmed };
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {{ valid: boolean, error?: string, value?: string }}
 */
export function validateEmail(email) {
  if (!email || email === '') {
    return { valid: true, value: null };
  }

  const trimmed = String(email).trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true, value: trimmed };
}

/**
 * Validate name (letters, spaces, hyphens, apostrophes)
 * @param {string} name - Name to validate
 * @param {boolean} required - Is field required?
 * @returns {{ valid: boolean, error?: string, value?: string }}
 */
export function validateName(name, required = false) {
  if (!name || name === '') {
    if (required) {
      return { valid: false, error: 'Name is required' };
    }
    return { valid: true, value: null };
  }

  const trimmed = String(name).trim();

  if (trimmed.length < 1) {
    return { valid: false, error: 'Name is too short' };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: 'Name is too long' };
  }

  return { valid: true, value: trimmed };
}

// =============================================================================
// ENUM VALIDATORS
// =============================================================================

/**
 * Validate user stage enum value
 */
export function validateUserStage(stage, required = false) {
  if (!stage || stage === '') {
    if (required) {
      return { valid: false, error: 'User stage is required' };
    }
    return { valid: true, value: null };
  }

  if (!isValidUserStage(stage)) {
    return { valid: false, error: `Invalid user stage: ${stage}` };
  }

  return { valid: true, value: stage };
}

/**
 * Validate program status enum value
 */
export function validateProgramStatus(status, required = false) {
  if (!status || status === '') {
    if (required) {
      return { valid: false, error: 'Program status is required' };
    }
    return { valid: true, value: null };
  }

  if (!isValidProgramStatus(status)) {
    return { valid: false, error: `Invalid program status: ${status}` };
  }

  return { valid: true, value: status };
}

/**
 * Validate LOR status enum value
 */
export function validateLorStatus(status, required = false) {
  if (!status || status === '') {
    if (required) {
      return { valid: false, error: 'LOR status is required' };
    }
    return { valid: true, value: null };
  }

  if (!isValidLorStatus(status)) {
    return { valid: false, error: `Invalid LOR status: ${status}` };
  }

  return { valid: true, value: status };
}

/**
 * Validate confidence level enum value
 */
export function validateConfidenceLevel(level, required = false) {
  if (!level || level === '') {
    if (required) {
      return { valid: false, error: 'Confidence level is required' };
    }
    return { valid: true, value: null };
  }

  if (!isValidConfidenceLevel(level)) {
    return { valid: false, error: `Invalid confidence level: ${level}` };
  }

  return { valid: true, value: level };
}

/**
 * Validate ICU type enum value
 */
export function validateIcuType(type, required = false) {
  if (!type || type === '') {
    if (required) {
      return { valid: false, error: 'ICU type is required' };
    }
    return { valid: true, value: null };
  }

  if (!isValidIcuType(type)) {
    return { valid: false, error: `Invalid ICU type: ${type}` };
  }

  return { valid: true, value: type };
}

// =============================================================================
// COMPOSITE VALIDATORS
// =============================================================================

/**
 * Validate a complete shadow day entry
 */
export function validateShadowDayEntry(entry) {
  const errors = {};

  const dateResult = validatePastDate(entry.date);
  if (!dateResult.valid) errors.date = dateResult.error;

  const hoursResult = validateShadowHours(entry.hoursLogged);
  if (!hoursResult.valid) errors.hoursLogged = hoursResult.error;

  const casesResult = validateCasesObserved(entry.casesObserved);
  if (!casesResult.valid) errors.casesObserved = casesResult.error;

  const locationResult = validateText(entry.location, { maxLength: 200 });
  if (!locationResult.valid) errors.location = locationResult.error;

  const providerResult = validateName(entry.providerName);
  if (!providerResult.valid) errors.providerName = providerResult.error;

  const notesResult = validateText(entry.notes, { maxLength: 2000 });
  if (!notesResult.valid) errors.notes = notesResult.error;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    values: {
      date: dateResult.value,
      hoursLogged: hoursResult.value,
      casesObserved: casesResult.value,
      location: locationResult.value,
      providerName: providerResult.value,
      notes: notesResult.value,
    },
  };
}

/**
 * Validate a clinical entry
 */
export function validateClinicalEntry(entry) {
  const errors = {};

  const dateResult = validatePastDate(entry.date);
  if (!dateResult.valid) errors.date = dateResult.error;

  const notesResult = validateText(entry.notes, { maxLength: 5000 });
  if (!notesResult.valid) errors.notes = notesResult.error;

  // Validate medications, devices, procedures are arrays
  if (entry.medications && !Array.isArray(entry.medications)) {
    errors.medications = 'Medications must be an array';
  }

  if (entry.devices && !Array.isArray(entry.devices)) {
    errors.devices = 'Devices must be an array';
  }

  if (entry.procedures && !Array.isArray(entry.procedures)) {
    errors.procedures = 'Procedures must be an array';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate LOR entry
 */
export function validateLorEntry(entry) {
  const errors = {};

  const nameResult = validateName(entry.personName, true);
  if (!nameResult.valid) errors.personName = nameResult.error;

  const emailResult = validateEmail(entry.email);
  if (!emailResult.valid) errors.email = emailResult.error;

  const statusResult = validateLorStatus(entry.status);
  if (!statusResult.valid) errors.status = statusResult.error;

  const relationshipResult = validateText(entry.relationship, { maxLength: 100 });
  if (!relationshipResult.valid) errors.relationship = relationshipResult.error;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    values: {
      personName: nameResult.value,
      email: emailResult.value,
      status: statusResult.value,
      relationship: relationshipResult.value,
    },
  };
}

/**
 * Validate academic profile
 */
export function validateAcademicProfile(profile) {
  const errors = {};

  const overallGpaResult = validateGpa(profile.overallGpa);
  if (!overallGpaResult.valid) errors.overallGpa = overallGpaResult.error;

  const scienceGpaResult = validateGpa(profile.scienceGpa);
  if (!scienceGpaResult.valid) errors.scienceGpa = scienceGpaResult.error;

  const greQuantResult = validateGreScore(profile.greQuantitative, 'quantitative');
  if (!greQuantResult.valid) errors.greQuantitative = greQuantResult.error;

  const greVerbalResult = validateGreScore(profile.greVerbal, 'verbal');
  if (!greVerbalResult.valid) errors.greVerbal = greVerbalResult.error;

  const greWritingResult = validateGreScore(profile.greAnalyticalWriting, 'writing');
  if (!greWritingResult.valid) errors.greAnalyticalWriting = greWritingResult.error;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    values: {
      overallGpa: overallGpaResult.value,
      scienceGpa: scienceGpaResult.value,
      greQuantitative: greQuantResult.value,
      greVerbal: greVerbalResult.value,
      greAnalyticalWriting: greWritingResult.value,
    },
  };
}

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default {
  // Input helpers
  isValidGpaInput,
  parseGpa,
  isValidHoursInput,
  // Validators
  validateGpa,
  validateGreScore,
  validateYearsExperience,
  validateShadowHours,
  validateCasesObserved,
  validateDate,
  validatePastDate,
  validateFutureDate,
  validateDeadline,
  validateText,
  validateEmail,
  validateName,
  validateUserStage,
  validateProgramStatus,
  validateLorStatus,
  validateConfidenceLevel,
  validateIcuType,
  validateShadowDayEntry,
  validateClinicalEntry,
  validateLorEntry,
  validateAcademicProfile,
};
