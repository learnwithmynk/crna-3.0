/**
 * Profanity Filter
 *
 * Detects and sanitizes inappropriate content in user-generated text.
 * Uses a configurable word list stored in Supabase.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Default word list for when Supabase isn't configured
// Keep it minimal and PG-rated for development
const DEFAULT_BLOCKED_WORDS = [
  'spam',
  'scam',
  'viagra',
  'casino',
  'porn',
  'xxx',
  'nude',
  'sex',
  'fuck',
  'shit',
  'ass',
  'bitch',
  'damn',
  'hell',
  'crap',
  'bastard',
  'dick',
  'cock',
  'pussy',
  'asshole',
  'bullshit',
  'motherfucker',
  'nigger',
  'nigga',
  'faggot',
  'fag',
  'retard',
  'slut',
  'whore',
  'kill yourself',
  'kys',
  'die',
  'rape',
];

// Cache for word list (refresh every 5 minutes)
let cachedWordList = null;
let cacheExpiry = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get the profanity word list (with caching)
 * @returns {Promise<string[]>}
 */
async function getWordList() {
  const now = Date.now();

  // Return cached list if valid
  if (cachedWordList && now < cacheExpiry) {
    return cachedWordList;
  }

  // Use default list if Supabase not configured
  if (!isSupabaseConfigured()) {
    cachedWordList = DEFAULT_BLOCKED_WORDS.map(w => w.toLowerCase());
    cacheExpiry = now + CACHE_DURATION;
    return cachedWordList;
  }

  try {
    const { data: words, error } = await supabase
      .from('profanity_words')
      .select('word');

    if (error) throw error;

    if (words && words.length > 0) {
      cachedWordList = words.map(w => w.word.toLowerCase());
    } else {
      // Fall back to default list if database is empty
      cachedWordList = DEFAULT_BLOCKED_WORDS.map(w => w.toLowerCase());
    }

    cacheExpiry = now + CACHE_DURATION;
    return cachedWordList;
  } catch (err) {
    console.error('Error fetching profanity word list:', err);
    // Fall back to default list on error
    cachedWordList = DEFAULT_BLOCKED_WORDS.map(w => w.toLowerCase());
    cacheExpiry = now + CACHE_DURATION;
    return cachedWordList;
  }
}

/**
 * Check if text contains profanity
 * @param {string} text - Text to check
 * @returns {Promise<{hasProfanity: boolean, matches: string[]}>}
 */
export async function containsProfanity(text) {
  if (!text || typeof text !== 'string') {
    return { hasProfanity: false, matches: [] };
  }

  const wordList = await getWordList();
  const textLower = text.toLowerCase();

  // Remove HTML tags for checking
  const strippedText = textLower.replace(/<[^>]*>/g, ' ');

  // Find all matches
  const matches = wordList.filter(word => {
    // Check for whole word matches or word boundaries
    // Use regex to avoid false positives (e.g., "assassin" containing "ass")
    const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, 'i');
    return regex.test(strippedText) || strippedText.includes(word);
  });

  return {
    hasProfanity: matches.length > 0,
    matches: [...new Set(matches)] // Remove duplicates
  };
}

/**
 * Replace profanity with asterisks
 * @param {string} text - Text to sanitize
 * @returns {Promise<string>}
 */
export async function sanitizeText(text) {
  if (!text || typeof text !== 'string') {
    return text;
  }

  const wordList = await getWordList();
  let sanitized = text;

  // Replace each profane word with asterisks (preserving length)
  wordList.forEach(word => {
    const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, 'gi');
    const replacement = '*'.repeat(word.length);
    sanitized = sanitized.replace(regex, replacement);
  });

  return sanitized;
}

/**
 * Escape special regex characters in a string
 * @param {string} str - String to escape
 * @returns {string}
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Clear the cached word list (useful for testing or after admin updates)
 */
export function clearWordListCache() {
  cachedWordList = null;
  cacheExpiry = 0;
}

/**
 * Add a word to the profanity list (admin only)
 * @param {string} word - Word to add
 * @returns {Promise<void>}
 */
export async function addProfanityWord(word) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  const { error } = await supabase
    .from('profanity_words')
    .insert({ word: word.toLowerCase() });

  if (error) throw error;

  // Clear cache to force refresh
  clearWordListCache();
}

/**
 * Remove a word from the profanity list (admin only)
 * @param {string} word - Word to remove
 * @returns {Promise<void>}
 */
export async function removeProfanityWord(word) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  const { error } = await supabase
    .from('profanity_words')
    .delete()
    .eq('word', word.toLowerCase());

  if (error) throw error;

  // Clear cache to force refresh
  clearWordListCache();
}

/**
 * Get all profanity words (admin only)
 * @returns {Promise<string[]>}
 */
export async function getAllProfanityWords() {
  return await getWordList();
}
