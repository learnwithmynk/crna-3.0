/**
 * Seed Schools Data into Supabase
 *
 * Run with: node scripts/seed-schools.cjs
 *
 * Loads environment from .env.local automatically
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment from .env.local
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  console.error('Required:');
  console.error('  - VITE_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nRun with: VITE_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-schools.cjs');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Read and parse the schools data file
function loadSchoolsData() {
  const filePath = path.join(__dirname, '../src/data/supabase/schools.js');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  // Extract the array from the export statement
  const match = fileContent.match(/export const schools = (\[[\s\S]*\]);/);
  if (!match) {
    throw new Error('Could not parse schools.js - expected "export const schools = [...]"');
  }

  // Parse the JSON array (it's valid JSON since it was auto-generated)
  return JSON.parse(match[1]);
}

// Convert camelCase JS keys to snake_case SQL columns
function toSnakeCase(str) {
  let result = str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

  // Handle special cases where there's a number (e.g., contactName2 -> contact_name_2, gpaLast60 -> gpa_last_60)
  result = result.replace(/(\D)(\d+)/g, '$1_$2');

  return result;
}

// Transform a school object from JS format to Supabase format
function transformSchool(school) {
  const transformed = {};

  for (const [key, value] of Object.entries(school)) {
    const snakeKey = toSnakeCase(key);
    transformed[snakeKey] = value;
  }

  return transformed;
}

async function seedSchools() {
  console.log('🏫 Loading schools data...');

  let schools;
  try {
    schools = loadSchoolsData();
    console.log(`📊 Found ${schools.length} schools to import`);
  } catch (err) {
    console.error('❌ Failed to load schools data:', err.message);
    process.exit(1);
  }

  // Deduplicate by ID (keep first occurrence)
  const seenIds = new Set();
  const uniqueSchools = schools.filter(school => {
    if (seenIds.has(school.id)) {
      console.log(`   ⚠️  Skipping duplicate ID: ${school.id} (${school.name})`);
      return false;
    }
    seenIds.add(school.id);
    return true;
  });

  if (uniqueSchools.length < schools.length) {
    console.log(`📊 Deduplicated to ${uniqueSchools.length} unique schools`);
  }

  // Transform all schools to snake_case
  const transformedSchools = uniqueSchools.map(transformSchool);

  // Check if schools table already has data
  const { count, error: countError } = await supabase
    .from('schools')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('❌ Error checking existing data:', countError.message);
    process.exit(1);
  }

  if (count > 0) {
    console.log(`⚠️  Schools table already has ${count} records.`);
    console.log('   Do you want to replace them? (This will delete existing data)');
    console.log('   Run with --force to proceed, or --upsert to update existing.');

    const args = process.argv.slice(2);
    if (args.includes('--force')) {
      console.log('\n🗑️  Deleting existing schools...');
      const { error: deleteError } = await supabase
        .from('schools')
        .delete()
        .neq('id', 0); // Delete all

      if (deleteError) {
        console.error('❌ Delete error:', deleteError.message);
        process.exit(1);
      }
      console.log('✅ Existing schools deleted');
    } else if (args.includes('--upsert')) {
      console.log('\n🔄 Will upsert (update or insert) schools...');
    } else {
      console.log('\n   Exiting without changes.');
      process.exit(0);
    }
  }

  // Insert schools in batches of 50 to avoid timeouts
  const BATCH_SIZE = 50;
  let inserted = 0;
  let errors = [];

  console.log('\n📤 Inserting schools...');

  for (let i = 0; i < transformedSchools.length; i += BATCH_SIZE) {
    const batch = transformedSchools.slice(i, i + BATCH_SIZE);

    const { data, error } = await supabase
      .from('schools')
      .upsert(batch, { onConflict: 'id' })
      .select('id, name');

    if (error) {
      console.error(`❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} error:`, error.message);
      errors.push({ batch: Math.floor(i / BATCH_SIZE) + 1, error: error.message });
    } else {
      inserted += data.length;
      process.stdout.write(`   Progress: ${inserted}/${transformedSchools.length}\r`);
    }
  }

  console.log('\n');

  if (errors.length > 0) {
    console.error(`⚠️  ${errors.length} batches had errors:`);
    errors.forEach(e => console.error(`   Batch ${e.batch}: ${e.error}`));
  }

  // Verify final count
  const { count: finalCount } = await supabase
    .from('schools')
    .select('*', { count: 'exact', head: true });

  console.log(`✅ Done! ${finalCount} schools now in database.`);

  // Show sample of inserted schools
  const { data: sample } = await supabase
    .from('schools')
    .select('id, name, city, state')
    .limit(5);

  console.log('\n📋 Sample schools:');
  console.table(sample);
}

seedSchools().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
