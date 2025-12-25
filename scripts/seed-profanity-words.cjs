/**
 * Seed Profanity Words Script
 *
 * Seeds the profanity_words table with an initial comprehensive word list.
 * Run with: node scripts/seed-profanity-words.cjs
 *
 * Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Missing Supabase credentials.');
  console.error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Comprehensive profanity and spam word list
// Organized by category for maintainability
const PROFANITY_WORDS = {
  // Spam/Scam related
  spam: [
    'spam',
    'scam',
    'viagra',
    'cialis',
    'casino',
    'poker',
    'lottery',
    'prize',
    'winner',
    'click here',
    'buy now',
    'limited time',
    'act now',
    'cash prize',
    'free money',
    'get rich',
    'work from home',
    'make money fast',
    'mlm',
    'multi-level',
  ],

  // Sexual content
  sexual: [
    'porn',
    'porno',
    'pornography',
    'xxx',
    'nude',
    'nudes',
    'naked',
    'sex',
    'sexy',
    'penis',
    'vagina',
    'cock',
    'dick',
    'pussy',
    'tits',
    'boobs',
    'breasts',
    'nipples',
    'orgasm',
    'masturbate',
    'masturbation',
    'anal',
    'oral',
    'blowjob',
    'handjob',
    'erotic',
    'aroused',
    'horny',
  ],

  // Common profanity
  profanity: [
    'fuck',
    'fucking',
    'fucked',
    'fucker',
    'motherfucker',
    'shit',
    'shitting',
    'bullshit',
    'ass',
    'asshole',
    'bitch',
    'bitching',
    'bastard',
    'damn',
    'dammit',
    'hell',
    'crap',
    'piss',
    'pissed',
  ],

  // Slurs and hate speech (important to filter these)
  slurs: [
    'nigger',
    'nigga',
    'negro',
    'faggot',
    'fag',
    'dyke',
    'tranny',
    'retard',
    'retarded',
    'spic',
    'wetback',
    'chink',
    'gook',
    'kike',
    'towelhead',
  ],

  // Violent/threatening language
  violent: [
    'kill yourself',
    'kys',
    'die',
    'suicide',
    'rape',
    'murder',
    'shoot',
    'stab',
    'bomb',
    'terrorist',
    'attack',
  ],

  // Derogatory terms
  derogatory: [
    'slut',
    'whore',
    'prostitute',
    'hooker',
    'ho',
    'skank',
    'cunt',
    'twat',
    'wanker',
    'tosser',
    'prick',
    'douchebag',
    'moron',
    'idiot',
    'stupid',
  ],

  // Drug-related spam
  drugs: [
    'weed',
    'marijuana',
    'cocaine',
    'crack',
    'heroin',
    'meth',
    'ecstasy',
    'drug dealer',
    'buy drugs',
    'sell drugs',
  ],
};

async function seedProfanityWords() {
  console.log('🌱 Starting profanity words seed...\n');

  try {
    // Flatten all categories into a single array
    const allWords = Object.values(PROFANITY_WORDS).flat();
    const uniqueWords = [...new Set(allWords)]; // Remove duplicates

    console.log(`📝 Total unique words to seed: ${uniqueWords.length}`);

    // Check current count
    const { count: currentCount, error: countError } = await supabase
      .from('profanity_words')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw countError;
    }

    console.log(`📊 Current words in database: ${currentCount || 0}`);

    // Clear existing words (optional - comment out to keep existing)
    if (currentCount > 0) {
      console.log('🗑️  Clearing existing words...');
      const { error: deleteError } = await supabase
        .from('profanity_words')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (deleteError) {
        console.warn('Warning: Could not clear existing words:', deleteError.message);
      }
    }

    // Insert words in batches (Supabase limit is ~1000 per request)
    const batchSize = 100;
    let inserted = 0;
    let failed = 0;

    for (let i = 0; i < uniqueWords.length; i += batchSize) {
      const batch = uniqueWords.slice(i, i + batchSize);
      const records = batch.map(word => ({ word: word.toLowerCase() }));

      const { data, error } = await supabase
        .from('profanity_words')
        .insert(records)
        .select();

      if (error) {
        console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error.message);
        failed += batch.length;
      } else {
        inserted += data.length;
        console.log(`✅ Inserted batch ${i / batchSize + 1}: ${data.length} words`);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Successfully inserted: ${inserted} words`);
    console.log(`   ❌ Failed: ${failed} words`);

    // Verify final count
    const { count: finalCount, error: finalCountError } = await supabase
      .from('profanity_words')
      .select('*', { count: 'exact', head: true });

    if (!finalCountError) {
      console.log(`   📈 Final count in database: ${finalCount || 0}`);
    }

    console.log('\n✨ Profanity words seeded successfully!\n');

    // Show breakdown by category
    console.log('📋 Words by category:');
    Object.entries(PROFANITY_WORDS).forEach(([category, words]) => {
      console.log(`   - ${category}: ${words.length} words`);
    });

  } catch (error) {
    console.error('❌ Error seeding profanity words:', error);
    process.exit(1);
  }
}

// Run the seed
seedProfanityWords()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
