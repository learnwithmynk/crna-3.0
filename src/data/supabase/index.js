/**
 * Supabase Data Exports
 * Central export point for all school-related data
 */

// Schools
export {
  schools,
  getSchoolById,
  getSchoolsByState,
  getSchoolsByDegree,
  searchSchools,
  getAllStates,
} from './schools.js';

// Events
export {
  schoolEvents,
  getEventsBySchool,
  getUpcomingEvents,
  getAllEvents,
} from './schoolEvents.js';

// Re-export defaults
export { default as schools } from './schools.js';
export { default as schoolEvents } from './schoolEvents.js';
