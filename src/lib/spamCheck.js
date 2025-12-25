/**
 * StopForumSpam API Integration
 *
 * Checks new users' first posts against StopForumSpam database
 * to identify potential spammers. Uses a cache to avoid redundant API calls.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const STOPFORUMSPAM_API = 'https://api.stopforumspam.org/api';

/**
 * Check if user email/IP is known spammer
 * @param {string} email - User email
 * @param {string} ip - User IP address (optional, may not be available in browser)
 * @returns {Promise<{isSpammer: boolean, confidence: number, cached: boolean}>}
 */
export async function checkSpammer(email, ip = null) {
  if (!isSupabaseConfigured() || !email) {
    return { isSpammer: false, confidence: 0, cached: false };
  }

  // Check cache first (spam_check_cache table)
  const cacheKey = email;
  const { data: cached } = await supabase
    .from('spam_check_cache')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  // Return cached result if less than 24 hours old
  if (cached && new Date(cached.checked_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
    return {
      isSpammer: cached.is_spammer,
      confidence: cached.confidence,
      cached: true
    };
  }

  try {
    // Query StopForumSpam API
    let url = `${STOPFORUMSPAM_API}?email=${encodeURIComponent(email)}&json`;
    if (ip) url += `&ip=${ip}`;

    const response = await fetch(url);
    const data = await response.json();

    const emailAppears = data.email?.appears > 0;
    const ipAppears = ip && data.ip?.appears > 0;
    const isSpammer = emailAppears || ipAppears;
    const confidence = Math.max(data.email?.confidence || 0, ip ? (data.ip?.confidence || 0) : 0);

    // Cache result
    await supabase.from('spam_check_cache').upsert({
      email,
      ip_address: ip,
      is_spammer: isSpammer,
      confidence,
      checked_at: new Date().toISOString()
    }, {
      onConflict: 'email'
    });

    // Only flag high-confidence spammers (>50%)
    return { isSpammer: isSpammer && confidence > 50, confidence, cached: false };
  } catch (error) {
    console.error('StopForumSpam check failed:', error);
    return { isSpammer: false, confidence: 0, cached: false };
  }
}

/**
 * Log flagged user for admin review
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @param {string} reason - Reason for flagging
 * @param {number} confidence - Confidence score (0-100)
 */
export async function logFlaggedUser(userId, email, reason, confidence) {
  if (!isSupabaseConfigured()) return;

  try {
    await supabase.from('flagged_users').insert({
      user_id: userId,
      email,
      reason,
      confidence,
      reviewed: false,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error logging flagged user:', error);
  }
}

/**
 * Check if this is user's first topic/post
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} True if this is their first topic
 */
export async function isFirstTimeTopicPoster(userId) {
  if (!isSupabaseConfigured() || !userId) return false;

  try {
    // Count user's existing topics
    const { count, error } = await supabase
      .from('topics')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId)
      .is('deleted_at', null);

    if (error) throw error;

    // If count is 0, this will be their first topic
    return count === 0;
  } catch (error) {
    console.error('Error checking first-time poster status:', error);
    return false;
  }
}

/**
 * Check if this is user's first reply
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} True if this is their first reply
 */
export async function isFirstTimeReplyPoster(userId) {
  if (!isSupabaseConfigured() || !userId) return false;

  try {
    // Count user's existing replies
    const { count, error } = await supabase
      .from('replies')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId)
      .is('deleted_at', null);

    if (error) throw error;

    // If count is 0, this will be their first reply
    return count === 0;
  } catch (error) {
    console.error('Error checking first-time reply poster status:', error);
    return false;
  }
}

/**
 * Perform spam check on first post and log if flagged
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @param {string} ip - User IP address (optional)
 * @returns {Promise<{flagged: boolean, confidence: number}>}
 */
export async function checkAndLogFirstPost(userId, email, ip = null) {
  if (!isSupabaseConfigured() || !userId || !email) {
    return { flagged: false, confidence: 0 };
  }

  try {
    // Check if user is a known spammer
    const spamResult = await checkSpammer(email, ip);

    if (spamResult.isSpammer) {
      // Log flagged user for admin review
      await logFlaggedUser(
        userId,
        email,
        `StopForumSpam: Known spammer (confidence: ${spamResult.confidence}%)`,
        spamResult.confidence
      );

      return { flagged: true, confidence: spamResult.confidence };
    }

    return { flagged: false, confidence: spamResult.confidence };
  } catch (error) {
    console.error('Error in checkAndLogFirstPost:', error);
    return { flagged: false, confidence: 0 };
  }
}
