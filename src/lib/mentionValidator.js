import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Mention Validation Utilities
 *
 * Extracts and validates @mentions in community forum content.
 * Checks against user_profiles to ensure mentioned users exist.
 */

/**
 * Extract @mentions from content
 * @param {string} content - Text content
 * @returns {string[]} - Array of usernames (without @)
 */
export function extractMentions(content) {
  if (!content) return [];
  const mentions = content.match(/@(\w+)/g) || [];
  return [...new Set(mentions.map(m => m.slice(1)))]; // Remove @ and dedupe
}

/**
 * Validate that mentioned users exist
 * @param {string} content - Content with @mentions
 * @returns {Promise<{valid: boolean, validMentions: string[], invalidMentions: string[]}>}
 */
export async function validateMentions(content) {
  const usernames = extractMentions(content);

  if (usernames.length === 0) {
    return { valid: true, validMentions: [], invalidMentions: [] };
  }

  if (!isSupabaseConfigured()) {
    // In mock mode, assume all mentions are valid
    return { valid: true, validMentions: usernames, invalidMentions: [] };
  }

  // Check which users exist in user_profiles
  const { data: validUsers } = await supabase
    .from('user_profiles')
    .select('name, preferred_name')
    .or(`name.in.(${usernames.map(u => `"${u}"`).join(',')}),preferred_name.in.(${usernames.map(u => `"${u}"`).join(',')})`);

  const validUsernames = new Set();
  validUsers?.forEach(u => {
    if (u.name) validUsernames.add(u.name.toLowerCase());
    if (u.preferred_name) validUsernames.add(u.preferred_name.toLowerCase());
  });

  const validMentions = usernames.filter(u => validUsernames.has(u.toLowerCase()));
  const invalidMentions = usernames.filter(u => !validUsernames.has(u.toLowerCase()));

  return {
    valid: invalidMentions.length === 0,
    validMentions,
    invalidMentions
  };
}

/**
 * Get user IDs for valid mentions (for notifications)
 */
export async function getMentionedUserIds(content) {
  const { validMentions } = await validateMentions(content);
  if (validMentions.length === 0) return [];

  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data: users } = await supabase
    .from('user_profiles')
    .select('id, name, preferred_name')
    .or(`name.in.(${validMentions.map(u => `"${u}"`).join(',')}),preferred_name.in.(${validMentions.map(u => `"${u}"`).join(',')})`);

  return users?.map(u => u.id) || [];
}
