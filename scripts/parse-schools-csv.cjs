/**
 * CSV Parser Script - Transforms school database CSV into Supabase-ready JS files
 *
 * Run with: node scripts/parse-schools-csv.js
 *
 * Generates:
 *   - src/data/supabase/schools.js (public school data)
 *   - src/data/supabase/schoolEvents.js (extracted events)
 *   - src/data/supabase/schoolsInternal.js (admin-only data)
 */

const fs = require('fs');
const path = require('path');

// WordPress ID mapping (school name -> WP post ID)
const WORDPRESS_IDS = {
  "Samford U": 3789,
  "U of Alabama at Birmingham": 3790,
  "U of Mobile": 3791,
  "Midwestern U": 3792,
  "U of Arizona": 3793,
  "Arkansas State U": 3794,
  "U of Arkansas Medical Sciences": 3795,
  "Kaiser Permanente School of Anesthesia California U Fullerton": 3796,
  "Loma Linda U": 3797,
  "National U": 3798,
  "Samuel Merritt U": 3799,
  "U of Southern California": 3800,
  "Fairfield U Nurse Anesthesia Program": 3801,
  "Nurse Anesthesia Program of Hartford": 3802,
  "Yale New Haven Hospital School of Nurse Anesthesia": 3803,
  "AdventHealth U": 3804,
  "Barry U": 3805,
  "Florida Gulf Coast U": 3806,
  "Florida International U": 3807,
  "Florida State U": 3808,
  "Keiser U": 3809,
  "U of Miami": 3810,
  "U of North Florida": 3811,
  "U of South Florida": 3812,
  "Augusta U Nursing Anesthesia Program": 3813,
  "Emory U Doctor of Nursing Practice Nurse Anesthesia Program": 3814,
  "Decatur & Millikin": 3815,
  "NorthShore U": 3816,
  "Rosalind Franklin": 3817,
  "Rush U": 3818,
  "S. Illinois U": 3819,
  "Marian U Nurse Anesthesia Program": 3820,
  "U of Evansville Nurse Anesthesia Program": 3821,
  "U of Iowa": 3822,
  "Newman U Nurse Anesthesia Program": 3823,
  "U of Kansas Nurse Anesthesia Program": 3824,
  "Baptist Health Murray State U Program of Anesthesia": 3825,
  "Northern Kentucky U Nurse Anesthesia Program": 3826,
  "Franciscan Missionaries of Our Lady U": 3827,
  "Louisiana State U": 3828,
  "Northwestern State U": 3829,
  "U of New England School of Nurse Anesthesia": 3830,
  "Johns Hopkins School of Nursing DNP Nurse Anesthesia Program": 3831,
  "Uniformed Services U of the Health Sciences": 3832,
  "U of Maryland School of Nursing": 3833,
  "Boston College William F. Connell School of Nursing": 3834,
  "Northeastern U Bouve College of Health Sciences": 3835,
  "Michigan State U Nurse Anesthesia Program": 3836,
  "Oakland U Beaumont Graduate Program": 3837,
  "U of Detroit Mercy Graduate Program": 3838,
  "U of Michigan-Flint Nurse Anesthesia Program": 3839,
  "Wayne State U": 3840,
  "Mayo Clinic School of Health Sciences": 3841,
  "Minneapolis School of Anesthesia": 3842,
  "Saint Mary's U of Minnesota": 3843,
  "U of Minnesota School of Nursing": 3844,
  "U of Southern Mississippi": 3845,
  "Goldfarb School of Nursing at Barnes-Jewish College": 3846,
  "Missouri State U School of Anesthesia": 3847,
  "U Health Truman Medical Center": 3848,
  "Webster U Nurse Anesthesia Program": 3849,
  "Bryan College of Health Sciences": 3850,
  "Clarkson College Nurse Anesthesia Program": 3851,
  "Rutgers School of Nursing": 3852,
  "Albany Medical": 3853,
  "Columbia U": 3854,
  "Hofstra U": 3855,
  "SUNY Buffalo": 3856,
  "Carolinas Medical Center/UNCC": 3857,
  "Duke U Nurse Anesthesia Program": 3858,
  "East Carolina U College of Nursing": 3859,
  "UNC Greensboro": 3860,
  "Wake Forest Baptist Health": 3861,
  "Western Carolina U": 3862,
  "U of North Dakota": 3863,
  "Cleveland Clinic/Case Western Reserve U": 3864,
  "Frances Payne Bolton School of Nursing": 3865,
  "St. Elizabeth Health Center": 3866,
  "The U of Akron": 3867,
  "U of Cincinnati": 3868,
  "The U of Tulsa": 3869,
  "Oregon Health and Science U": 3870,
  "Cedar Crest College": 3871,
  "Drexel U": 3872,
  "Excela Health School of Anesthesia": 3873,
  "Geisinger/Bloomsburg U": 3874,
  "La Roche U": 3875,
  "The U of Scranton": 3876,
  "Thomas Jefferson U": 3877,
  "U of Pennsylvania": 3878,
  "U of Pittsburgh": 3879,
  "UPMC Hamot/Gannon U": 3880,
  "York College of Pennsylvania/WellSpan": 3881,
  "InterAmerican University of Puerto Rico": 3882,
  "Professional University Dr. Carlos J. Borrero Ríos": 3883,
  "University of Puerto Rico": 3884,
  "Rhode Island College/St. Joseph Hospital": 3885,
  "Medical U of South Carolina": 3886,
  "U of South Carolina Prisma Health": 3887,
  "Mount Marty U": 3888,
  "Lincoln Memorial U": 3889,
  "Middle Tennessee School of Anesthesia": 3890,
  "South College": 3891,
  "The U of Tennessee at Chattanooga": 3892,
  "The U of Tennessee Knoxville": 3893,
  "The U of Tennessee Health Science Center": 3894,
  "Union U College of Nursing": 3895,
  "Baylor College of Medicine": 3896,
  "U.S. Army Graduate Program": 3897,
  "Old Dominion U": 3898,
  "Virginia Commonwealth U": 3899,
  "Providence Sacred Heart/Gonzaga U": 3900,
  "Georgetown U": 3901,
  "West Virginia U": 3902,
  "Franciscan Healthcare School of Anesthesia": 3903,
  "Marquette U College of Nursing": 3904,
  "U of Wisconsin-Oshkosh": 3905,
  "UC Davis": 3906,
  "Rosalind Franklin - Colorado Branch": 3907,
  "Rocky Vista University": 3908,
  "U of Louisville": 3909,
  "Bellarmine University": 3910,
  "Loyola University of New Orleans": 3911,
  "Roseman University of Health Sciences": 3912,
  "New Mexico State U": 3913,
  "Hunter-Bellevue School of Nursing (HBSON)": 3914,
  "St. John Fisher University Wegmans": 3915,
  "Lourdes University": 3916,
  "Ohio University": 3917,
  "Ohio State University": 3918,
  "Ursuline College": 3919,
  "Villanova U": 3920,
  "Duquesne University": 3921,
  "La Salle University": 3922,
  "University of South Dakota": 3923,
  "Texas Christian University": 3924,
  "Texas Wesleyan University": 3925,
  "UT Houston Cizik School of Nursing": 3926,
  "UT Medical Branch": 3927,
  "UT Health at San Antonio": 3928,
  "Westminster University": 3929,
  "Mary Baldwin University": 3930,
  "University of Charleston West Virginia": 3931,
  // Newer additions
  "Idaho State University": 2527828,
  "University of Illinois Chicago": 2527829,
  "Edgewood College": 2527830,
  "University of Nevada Las Vegas": 2527831,
  "George Fox University": 2527832,
  "St. Luke's/DeSales University": 2527834,
  "University of Texas at Tyler": 2527835,
};

// ============ TRANSFORMATION HELPERS ============

function parseBoolean(value) {
  if (value === undefined || value === null || value === '') return null;
  const v = String(value).trim().toLowerCase();
  if (v === '1' || v === 'yes' || v === 'true' || v === 'required') return true;
  if (v === '0' || v === 'no' || v === 'false' || v === 'not required') return false;
  return null;
}

function parseNumber(value) {
  if (value === undefined || value === null || value === '') return null;
  // Remove $, commas, %, and other non-numeric characters (except .)
  const cleaned = String(value).replace(/[$,%]/g, '').replace(/,/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function parseExperience(value) {
  if (!value) return null;
  const match = String(value).match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

function parseDate(value) {
  if (!value) return null;
  // Handle MM/DD/YYYY format
  const parts = String(value).trim().split('/');
  if (parts.length === 3) {
    const [month, day, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return null;
}

function parseDegree(value) {
  if (!value) return null;
  const v = String(value).trim().toLowerCase();
  if (v.includes('dnap')) return 'dnap';
  if (v.includes('dnp')) return 'dnp';
  if (v.includes('msna')) return 'msna';
  return v;
}

function parseProgramType(value) {
  if (!value) return null;
  const v = String(value).trim().toLowerCase();
  if (v.includes('front')) return 'front_loaded';
  if (v.includes('integrated')) return 'integrated';
  return v;
}

function cleanString(value) {
  if (value === undefined || value === null) return null;
  const cleaned = String(value).trim();
  return cleaned === '' ? null : cleaned;
}

function getWordPressId(schoolName) {
  if (!schoolName) return null;

  // Try exact match first
  if (WORDPRESS_IDS[schoolName]) return WORDPRESS_IDS[schoolName];

  // Normalize for comparison
  const normalize = (str) => str.toLowerCase().trim()
    .replace(/\s+/g, ' ')        // Multiple spaces to single
    .replace(/[^\w\s]/g, '');    // Remove special chars

  const normalizedInput = normalize(schoolName);

  // Try normalized exact match
  for (const [name, id] of Object.entries(WORDPRESS_IDS)) {
    if (normalize(name) === normalizedInput) return id;
  }

  // Try if CSV name STARTS WITH a WP name (WP names are shorter)
  for (const [name, id] of Object.entries(WORDPRESS_IDS)) {
    const wpNorm = normalize(name);
    if (normalizedInput.startsWith(wpNorm)) return id;
  }

  // Try if WP name is CONTAINED in CSV name
  for (const [name, id] of Object.entries(WORDPRESS_IDS)) {
    const wpNorm = normalize(name);
    if (normalizedInput.includes(wpNorm) && wpNorm.length > 10) return id;
  }

  // Try key word matching for common patterns
  const keyMatches = [
    [/arkansas\s*(medical|sciences)/i, 3795],
    [/oregon\s*health/i, 3870],
    [/marian\s*u/i, 3820],
    [/uniformed\s*services/i, 3832],
    [/maryland.*nursing/i, 3833],
    [/boston\s*college/i, 3834],
    [/northeastern\s*u/i, 3835],
    [/oakland\s*u/i, 3837],
    [/detroit\s*mercy/i, 3838],
    [/wayne\s*state/i, 3840],
    [/mayo\s*clinic/i, 3841],
    [/saint\s*mary.*minnesota/i, 3843],
    [/minnesota.*nursing/i, 3844],
    [/southern\s*mississippi/i, 3845],
    [/goldfarb|barnes.*jewish/i, 3846],
    [/truman\s*medical/i, 3848],
    [/bryan\s*college/i, 3850],
    [/rutgers/i, 3852],
    [/carolinas.*uncc|uncc.*carolinas/i, 3857],
    [/east\s*carolina/i, 3859],
    [/unc\s*greensboro/i, 3860],
    [/wake\s*forest/i, 3861],
    [/western\s*carolina/i, 3862],
    [/north\s*dakota/i, 3863],
    [/cleveland\s*clinic|case\s*western/i, 3864],
    [/frances\s*payne\s*bolton/i, 3865],
    [/st\.?\s*elizabeth.*health/i, 3866],
    [/akron/i, 3867],
    [/cincinnati/i, 3868],
    [/tulsa/i, 3869],
    [/cedar\s*crest/i, 3871],
    [/drexel/i, 3872],
    [/geisinger|bloomsburg/i, 3874],
    [/la\s*roche/i, 3875],
    [/scranton/i, 3876],
    [/thomas\s*jefferson/i, 3877],
    [/u\s*of\s*pennsylvania|penn.*nursing/i, 3878],
    [/pittsburgh/i, 3879],
    [/upmc\s*hamot|gannon/i, 3880],
    [/york\s*college.*wellspan/i, 3881],
    [/puerto\s*rico.*nursing/i, 3884],
    [/rhode\s*island|st\.?\s*joseph.*hospital/i, 3885],
    [/medical.*south\s*carolina/i, 3886],
    [/south\s*carolina.*prisma/i, 3887],
    [/mount\s*marty/i, 3888],
    [/lincoln\s*memorial/i, 3889],
    [/south\s*college/i, 3891],
    [/tennessee.*chattanooga/i, 3892],
    [/union\s*u.*nursing/i, 3895],
    [/baylor.*medicine/i, 3896],
    [/army.*anesthesia/i, 3897],
    [/old\s*dominion/i, 3898],
    [/virginia\s*commonwealth/i, 3899],
    [/sacred\s*heart.*gonzaga/i, 3900],
    [/georgetown/i, 3901],
    [/west\s*virginia/i, 3902],
    [/edgewood/i, 2527830],
    [/marquette/i, 3904],
    [/wisconsin.*oshkosh/i, 3905],
    [/rosalind.*colorado/i, 3907],
    [/rocky\s*vista/i, 3908],
    [/loyola.*new\s*orleans/i, 3911],
    [/lourdes/i, 3916],
    [/villanova/i, 3920],
    [/duquesne/i, 3921],
    [/st\.?\s*luke.*desales/i, 2527834],
    [/texas\s*christian/i, 3924],
    [/texas\s*wesleyan/i, 3925],
    [/cizik|houston.*nursing/i, 3926],
    [/texas\s*medical\s*branch|utmb/i, 3927],
    [/westminster.*nursing/i, 3929],
    [/mary\s*baldwin/i, 3930],
  ];

  for (const [pattern, id] of keyMatches) {
    if (pattern.test(schoolName)) return id;
  }

  // Log unmatched schools
  console.warn(`No WordPress ID found for: "${schoolName}"`);
  return null;
}

// ============ CSV PARSING ============

function parseCSV(content) {
  const lines = [];
  let currentLine = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];

    if (char === '"') {
      inQuotes = !inQuotes;
      currentLine += char;
    } else if (char === '\n' && !inQuotes) {
      lines.push(currentLine);
      currentLine = '';
    } else if (char === '\r') {
      // Skip carriage returns
    } else {
      currentLine += char;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  // Parse header
  const header = parseCSVLine(lines[0]);

  // Parse rows
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = parseCSVLine(lines[i]);
      const row = {};
      header.forEach((col, idx) => {
        row[col.trim()] = values[idx];
      });
      rows.push(row);
    }
  }

  return rows;
}

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

// ============ TRANSFORM ROW TO SCHOOL ============

function transformRow(row) {
  const schoolName = cleanString(row['School Name']);
  const wpId = getWordPressId(schoolName);

  if (!wpId) {
    console.warn(`Skipping school without WP ID: ${schoolName}`);
    return null;
  }

  return {
    id: wpId,
    name: schoolName,
    city: cleanString(row['City']),
    state: cleanString(row['State']),
    description: cleanString(row['Description']),
    websiteUrl: cleanString(row['Website Link']),

    // Contact
    contactName: cleanString(row['Contact Person 1']),
    contactDesignation: cleanString(row['Designation 1']),
    contactEmail: cleanString(row['Email 1']),
    contactPhone: cleanString(row['Phone Number 1']),
    contactName2: cleanString(row['Contact Person 2  Name']),
    contactDesignation2: cleanString(row['Designation 2']),
    contactEmail2: cleanString(row['Email 2']),
    contactPhone2: cleanString(row['Phone Number 2']),
    instagramHandle: cleanString(row['Instagram']),

    // Program Details
    degree: parseDegree(row['Degree']),
    programType: parseProgramType(row['Type']),
    programStart: cleanString(row['Program Start']),
    lengthMonths: parseNumber(row['Length of the Program (Months)']),
    classSize: parseNumber(row['Class Size']),
    clinicalSites: parseNumber(row['#Of Clinical Sites']),
    rollingAdmissions: parseBoolean(row['Rolling']),
    partiallyOnline: parseBoolean(row['Partially Online']),
    ableToWork: parseBoolean(row['Able To Work']),
    nursingCas: parseBoolean(row['Nursing CAS']),
    leap: parseBoolean(row['Leap']),
    regionalAccreditationRequired: parseBoolean(row['Regional Accreditation Required']),
    acceptsBachelorsScienceRelated: parseBoolean(row['Accepts Bachelors of Science In a Related Field']),

    // Costs
    tuitionInState: parseNumber(row['In State Tution']),
    tuitionOutOfState: parseNumber(row['Out of State Tution']),

    // Requirements - GPA
    minimumGpa: parseNumber(row['Minimum GPA']),
    gpaScience: parseBoolean(row['Science']),
    gpaNursing: parseBoolean(row['Nursing/Undergraduate']),
    gpaCumulative: parseBoolean(row['Cumulative/Overall']),
    gpaGraduate: parseBoolean(row['Graduate']),
    gpaLast60: parseBoolean(row['Last 60']),
    gpaNotes: cleanString(row['GPA Notes:']),

    // Requirements - GRE
    greRequired: parseBoolean(row['GRE']),
    greWaivedFor: cleanString(row['GRE Waived For']),
    greExpires: parseBoolean(row['GRE Expires']),
    greMinimum: cleanString(row['GRE Minimum']),

    // Requirements - CCRN
    ccrnRequired: parseBoolean(row['CCRN Required?']),
    ccrnDetails: cleanString(row['CCRN Details']),

    // Requirements - Prerequisites
    prereqStatistics: parseBoolean(row['Statistics']),
    prereqGenChemistry: parseBoolean(row['General Chemistry']),
    prereqOrganicChemistry: parseBoolean(row['Organic Chemistry']),
    prereqBiochemistry: parseBoolean(row['Biochemistry']),
    prereqAcceptsOrganicOrBiochem: parseBoolean(row['Accepts Either Organic OR Biochemistry']),
    prereqAnatomy: parseBoolean(row['Anatomy']),
    prereqPhysics: parseBoolean(row['Physics']),
    prereqPharmacology: parseBoolean(row['Pharmacology']),
    prereqPhysiology: parseBoolean(row['Physiology']),
    prereqMicrobiology: parseBoolean(row['Microbiology']),
    prereqResearch: parseBoolean(row['Research']),
    prereqNotes: cleanString(row['Other Prerequisites/Notes']),
    prereqExpires: parseBoolean(row['Expiration of Prerequisites?']),

    // Requirements - Other
    minimumExperience: parseExperience(row['Minimum Experience']),
    resumeNotes: cleanString(row['Resume/CV Notes:']),
    essayPrompt: cleanString(row['Essay Prompt']),
    referenceDescription: cleanString(row['References Description']),
    referenceCount: parseNumber(row['# Of References']),
    shadowingRequired: parseBoolean(row['Shadowing Required?']),
    requirementsNotes: cleanString(row['Requirements Notes:']),

    // Experience Accepted
    acceptsNicu: parseBoolean(row['NICU']),
    acceptsPicu: parseBoolean(row['PICU']),
    acceptsEr: parseBoolean(row['ER']),
    acceptsOtherCriticalCare: parseBoolean(row['May Accept Other Areas of Critical Care']),

    // Stats
    attritionRate: parseNumber(row['Attrition Rate']),
    ncePassRate: parseNumber(row['First Time NCE Pass Rate']),

    // Dates
    applicationOpens: parseDate(row['Application Open']),
    applicationDeadline: parseDate(row['Application Closed']),
    lastUpdated: parseDate(row['Last Updated']),

    // Notes
    programNotes: cleanString(row['General Program Notes:']),
    imageUrl: cleanString(row['Google Drive School Image URL:']),
  };
}

function transformRowToInternal(row) {
  const schoolName = cleanString(row['School Name']);
  const wpId = getWordPressId(schoolName);

  if (!wpId) return null;

  return {
    schoolId: wpId,
    acceptanceRate: cleanString(row['[INTERNAL]  Acceptance Rate:']),
    adminProgramNotes: cleanString(row['[INTERNAL] ADMIN Program Notes:']),
    adminTuitionNotes: cleanString(row['[INTERNAL] ADMIN Tuition Notes:']),
    adminGpaNotes: cleanString(row['[INTERNAL] ADMIN GPA Notes:']),
    adminResumeRequired: parseBoolean(row['[INTERNAL] Resume/CV']),
    adminEssayRequired: parseBoolean(row['[INTERNAL] Essay Required?']),
    adminRequirementsNotes: cleanString(row['[INTERNAL] ADMIN Requirements/To Do List Note:']),
    generalAdminNotes: cleanString(row['[INTERNAL] GENERAL ADMIN NOTES:']),
  };
}

function extractEvents(row) {
  const schoolName = cleanString(row['School Name']);
  const wpId = getWordPressId(schoolName);

  if (!wpId) return [];

  const eventName = cleanString(row['Event Name']);
  const eventDescription = cleanString(row['Event Description']);
  const eventDates = cleanString(row['Event Date']);
  const eventTimes = cleanString(row['Event Time']);
  const timezone = cleanString(row['Time Zone']);

  if (!eventName || !eventDates) return [];

  // Split multiple events (semicolon-separated)
  const dates = eventDates.split(';').map(d => d.trim()).filter(Boolean);
  const times = eventTimes ? eventTimes.split(';').map(t => t.trim()) : [];
  const names = eventName.split('\n').map(n => n.trim()).filter(Boolean);

  const events = [];

  dates.forEach((date, index) => {
    // Parse date (could be MM/DD/YYYY or other formats)
    let parsedDate = parseDate(date);
    if (!parsedDate && date) {
      // Try other formats
      parsedDate = date;
    }

    events.push({
      id: `event_${wpId}_${index + 1}`,
      schoolId: wpId,
      schoolName: schoolName,
      name: names[index] || names[0] || eventName.split('\n')[0],
      description: eventDescription,
      date: parsedDate,
      time: times[index] || times[0] || null,
      timezone: timezone,
    });
  });

  return events;
}

// ============ MAIN ============

async function main() {
  const csvPath = path.join(__dirname, '../src/data/[CRNA CLUB]  NEW SCHOOL SPREADSHEET - [OCTOBER 2025] - [EDITS HERE] SCHOOL DATABASE MASTER SHEET.csv');
  const outputDir = path.join(__dirname, '../src/data/supabase');

  console.log('Reading CSV file...');
  const content = fs.readFileSync(csvPath, 'utf-8');

  console.log('Parsing CSV...');
  const rows = parseCSV(content);
  console.log(`Found ${rows.length} rows`);

  // Transform data
  const schools = [];
  const schoolsInternal = [];
  const allEvents = [];

  rows.forEach((row, index) => {
    const school = transformRow(row);
    if (school) {
      schools.push(school);
    }

    const internal = transformRowToInternal(row);
    if (internal) {
      schoolsInternal.push(internal);
    }

    const events = extractEvents(row);
    allEvents.push(...events);
  });

  console.log(`Transformed ${schools.length} schools`);
  console.log(`Extracted ${allEvents.length} events`);

  // Generate schools.js
  const schoolsContent = `/**
 * CRNA Schools Database
 * AUTO-GENERATED from CSV - Do not edit directly
 * Generated: ${new Date().toISOString()}
 * Total schools: ${schools.length}
 */

export const schools = ${JSON.stringify(schools, null, 2)};

// Helper functions
export const getSchoolById = (id) => schools.find(s => s.id === id);

export const getSchoolsByState = (state) =>
  schools.filter(s => s.state?.toLowerCase() === state.toLowerCase());

export const getSchoolsByDegree = (degree) =>
  schools.filter(s => s.degree === degree);

export const searchSchools = (query) => {
  const q = query.toLowerCase();
  return schools.filter(s =>
    s.name?.toLowerCase().includes(q) ||
    s.city?.toLowerCase().includes(q) ||
    s.state?.toLowerCase().includes(q)
  );
};

export const getAllStates = () =>
  [...new Set(schools.map(s => s.state).filter(Boolean))].sort();

export default schools;
`;

  // Generate schoolEvents.js
  const eventsContent = `/**
 * CRNA School Events
 * AUTO-GENERATED from CSV - Do not edit directly
 * Generated: ${new Date().toISOString()}
 * Total events: ${allEvents.length}
 */

export const schoolEvents = ${JSON.stringify(allEvents, null, 2)};

// Helper functions
export const getEventsBySchool = (schoolId) =>
  schoolEvents.filter(e => e.schoolId === schoolId);

export const getUpcomingEvents = (limit = 10) => {
  const now = new Date();
  return schoolEvents
    .filter(e => e.date && new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, limit);
};

export const getAllEvents = () => schoolEvents;

export default schoolEvents;
`;

  // Generate schoolsInternal.js
  const internalContent = `/**
 * CRNA Schools Internal Admin Data
 * AUTO-GENERATED from CSV - Do not edit directly
 * Generated: ${new Date().toISOString()}
 *
 * WARNING: This file contains admin-only data.
 * Do NOT import in public-facing pages.
 * Use Row Level Security in Supabase production.
 */

export const schoolsInternal = ${JSON.stringify(schoolsInternal, null, 2)};

// Helper functions
export const getInternalBySchoolId = (schoolId) =>
  schoolsInternal.find(s => s.schoolId === schoolId);

export default schoolsInternal;
`;

  // Write files
  console.log('Writing output files...');
  fs.writeFileSync(path.join(outputDir, 'schools.js'), schoolsContent);
  fs.writeFileSync(path.join(outputDir, 'schoolEvents.js'), eventsContent);
  fs.writeFileSync(path.join(outputDir, 'schoolsInternal.js'), internalContent);

  console.log('\nDone! Files generated:');
  console.log(`  - src/data/supabase/schools.js (${schools.length} schools)`);
  console.log(`  - src/data/supabase/schoolEvents.js (${allEvents.length} events)`);
  console.log(`  - src/data/supabase/schoolsInternal.js (${schoolsInternal.length} internal records)`);
}

main().catch(console.error);
