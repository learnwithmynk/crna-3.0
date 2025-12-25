/**
 * Generate SQL seed migration from schools.js
 * Run: node scripts/generate-schools-seed.cjs
 */

const fs = require('fs');
const path = require('path');

// Read the schools.js file
const schoolsFile = fs.readFileSync(
  path.join(__dirname, '../src/data/supabase/schools.js'),
  'utf8'
);

// Extract the array from the JS file
const match = schoolsFile.match(/export const schools = (\[[\s\S]*?\]);/);
if (!match) {
  console.error('Could not find schools array in file');
  process.exit(1);
}

// Parse the JSON (the array is valid JSON)
const schools = eval(match[1]);

console.log(`Found ${schools.length} schools`);

// Helper to escape SQL strings
function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'number') return val.toString();
  if (Array.isArray(val)) return 'NULL'; // Arrays not used in this table
  // Escape single quotes
  return `'${String(val).replace(/'/g, "''")}'`;
}

// Generate INSERT statements
let sql = `-- ============================================================
-- SCHOOLS DATA SEED
-- Migration: 20251215000000_seed_schools.sql
-- Generated: ${new Date().toISOString()}
-- Total schools: ${schools.length}
-- ============================================================

-- Clear existing data (safe for development)
-- TRUNCATE schools CASCADE;

`;

for (const school of schools) {
  sql += `INSERT INTO schools (
  id, name, city, state, description, website_url,
  contact_name, contact_designation, contact_email, contact_phone,
  contact_name_2, contact_designation_2, contact_email_2, contact_phone_2,
  instagram_handle, degree, program_type, program_start, length_months,
  class_size, clinical_sites, rolling_admissions, partially_online,
  able_to_work, nursing_cas, leap, regional_accreditation_required,
  accepts_bachelors_science_related, tuition_in_state, tuition_out_of_state,
  minimum_gpa, gpa_science, gpa_nursing, gpa_cumulative, gpa_graduate,
  gpa_last_60, gpa_notes, gre_required, gre_waived_for, gre_expires,
  gre_minimum, ccrn_required, ccrn_details, prereq_statistics,
  prereq_gen_chemistry, prereq_organic_chemistry, prereq_biochemistry,
  prereq_accepts_organic_or_biochem, prereq_anatomy, prereq_physics,
  prereq_pharmacology, prereq_physiology, prereq_microbiology,
  prereq_research, prereq_notes, prereq_expires, minimum_experience,
  resume_notes, essay_prompt, reference_description, reference_count,
  shadowing_required, requirements_notes, accepts_nicu, accepts_picu,
  accepts_er, accepts_other_critical_care, attrition_rate, nce_pass_rate,
  application_opens, application_deadline, last_updated, program_notes, image_url
) VALUES (
  ${school.id}, ${escapeSql(school.name)}, ${escapeSql(school.city)}, ${escapeSql(school.state)},
  ${escapeSql(school.description)}, ${escapeSql(school.websiteUrl)},
  ${escapeSql(school.contactName)}, ${escapeSql(school.contactDesignation)},
  ${escapeSql(school.contactEmail)}, ${escapeSql(school.contactPhone)},
  ${escapeSql(school.contactName2)}, ${escapeSql(school.contactDesignation2)},
  ${escapeSql(school.contactEmail2)}, ${escapeSql(school.contactPhone2)},
  ${escapeSql(school.instagramHandle)}, ${escapeSql(school.degree)},
  ${escapeSql(school.programType)}, ${escapeSql(school.programStart)},
  ${escapeSql(school.lengthMonths)}, ${escapeSql(school.classSize)},
  ${escapeSql(school.clinicalSites)}, ${escapeSql(school.rollingAdmissions)},
  ${escapeSql(school.partiallyOnline)}, ${escapeSql(school.ableToWork)},
  ${escapeSql(school.nursingCas)}, ${escapeSql(school.leap)},
  ${escapeSql(school.regionalAccreditationRequired)},
  ${escapeSql(school.acceptsBachelorsScienceRelated)},
  ${escapeSql(school.tuitionInState)}, ${escapeSql(school.tuitionOutOfState)},
  ${escapeSql(school.minimumGpa)}, ${escapeSql(school.gpaScience)},
  ${escapeSql(school.gpaNursing)}, ${escapeSql(school.gpaCumulative)},
  ${escapeSql(school.gpaGraduate)}, ${escapeSql(school.gpaLast60)},
  ${escapeSql(school.gpaNotes)}, ${escapeSql(school.greRequired)},
  ${escapeSql(school.greWaivedFor)}, ${escapeSql(school.greExpires)},
  ${escapeSql(school.greMinimum)}, ${escapeSql(school.ccrnRequired)},
  ${escapeSql(school.ccrnDetails)}, ${escapeSql(school.prereqStatistics)},
  ${escapeSql(school.prereqGenChemistry)}, ${escapeSql(school.prereqOrganicChemistry)},
  ${escapeSql(school.prereqBiochemistry)}, ${escapeSql(school.prereqAcceptsOrganicOrBiochem)},
  ${escapeSql(school.prereqAnatomy)}, ${escapeSql(school.prereqPhysics)},
  ${escapeSql(school.prereqPharmacology)}, ${escapeSql(school.prereqPhysiology)},
  ${escapeSql(school.prereqMicrobiology)}, ${escapeSql(school.prereqResearch)},
  ${escapeSql(school.prereqNotes)}, ${escapeSql(school.prereqExpires)},
  ${escapeSql(school.minimumExperience)}, ${escapeSql(school.resumeNotes)},
  ${escapeSql(school.essayPrompt)}, ${escapeSql(school.referenceDescription)},
  ${escapeSql(school.referenceCount)}, ${escapeSql(school.shadowingRequired)},
  ${escapeSql(school.requirementsNotes)}, ${escapeSql(school.acceptsNicu)},
  ${escapeSql(school.acceptsPicu)}, ${escapeSql(school.acceptsEr)},
  ${escapeSql(school.acceptsOtherCriticalCare)}, ${escapeSql(school.attritionRate)},
  ${escapeSql(school.ncePassRate)},
  ${school.applicationOpens ? `'${school.applicationOpens}'` : 'NULL'},
  ${school.applicationDeadline ? `'${school.applicationDeadline}'` : 'NULL'},
  ${school.lastUpdated ? `'${school.lastUpdated}'` : 'NULL'},
  ${escapeSql(school.programNotes)}, ${escapeSql(school.imageUrl)}
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  description = EXCLUDED.description,
  website_url = EXCLUDED.website_url,
  contact_name = EXCLUDED.contact_name,
  contact_email = EXCLUDED.contact_email,
  degree = EXCLUDED.degree,
  program_type = EXCLUDED.program_type,
  minimum_gpa = EXCLUDED.minimum_gpa,
  gre_required = EXCLUDED.gre_required,
  ccrn_required = EXCLUDED.ccrn_required,
  application_deadline = EXCLUDED.application_deadline,
  updated_at = NOW();

`;
}

sql += `
-- ============================================================
-- VERIFY IMPORT
-- ============================================================
-- SELECT COUNT(*) as total_schools FROM schools;
-- SELECT state, COUNT(*) as count FROM schools GROUP BY state ORDER BY count DESC;
`;

// Write to migration file
const migrationPath = path.join(
  __dirname,
  '../supabase/migrations/20251215000000_seed_schools.sql'
);
fs.writeFileSync(migrationPath, sql);

console.log(`Migration written to: ${migrationPath}`);
console.log(`Total INSERT statements: ${schools.length}`);

// ============================================================
// SCHOOL EVENTS
// ============================================================

const eventsFile = fs.readFileSync(
  path.join(__dirname, '../src/data/supabase/schoolEvents.js'),
  'utf8'
);

const eventsMatch = eventsFile.match(/export const schoolEvents = (\[[\s\S]*?\]);/);
if (!eventsMatch) {
  console.error('Could not find schoolEvents array in file');
  process.exit(1);
}

const events = eval(eventsMatch[1]);
console.log(`Found ${events.length} events`);

let eventsSql = `-- ============================================================
-- SCHOOL EVENTS DATA SEED
-- Migration: 20251215100000_seed_school_events.sql
-- Generated: ${new Date().toISOString()}
-- Total events: ${events.length}
-- ============================================================

`;

// Helper to validate date format (YYYY-MM-DD)
function isValidDate(dateStr) {
  if (!dateStr || dateStr === 'TBA' || dateStr === 'tba') return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

for (const event of events) {
  const eventDate = isValidDate(event.date) ? `'${event.date}'` : 'NULL';

  eventsSql += `INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  ${escapeSql(event.id)}, ${event.schoolId}, ${escapeSql(event.schoolName)},
  ${escapeSql(event.name)}, ${escapeSql(event.description)},
  ${eventDate},
  ${escapeSql(event.time)}, ${escapeSql(event.timezone)},
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

`;
}

eventsSql += `
-- ============================================================
-- VERIFY IMPORT
-- ============================================================
-- SELECT COUNT(*) as total_events FROM school_events;
`;

const eventsMigrationPath = path.join(
  __dirname,
  '../supabase/migrations/20251215100000_seed_school_events.sql'
);
fs.writeFileSync(eventsMigrationPath, eventsSql);

console.log(`Events migration written to: ${eventsMigrationPath}`);
console.log(`Total event INSERT statements: ${events.length}`);
