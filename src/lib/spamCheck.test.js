/**
 * spamCheck.test.js
 *
 * Example usage and tests for StopForumSpam integration
 */

import {
  checkSpammer,
  logFlaggedUser,
  isFirstTimeTopicPoster,
  isFirstTimeReplyPoster,
  checkAndLogFirstPost
} from './spamCheck';

// Example 1: Check if an email is a known spammer
async function exampleCheckEmail() {
  const result = await checkSpammer('known-spammer@example.com');
  console.log('Spam check result:', result);
  // Output: { isSpammer: true/false, confidence: 0-100, cached: true/false }
}

// Example 2: Check email and IP together (more accurate)
async function exampleCheckEmailAndIP() {
  const result = await checkSpammer('user@example.com', '192.168.1.1');
  console.log('Spam check result:', result);
  // Checks both email and IP against StopForumSpam database
}

// Example 3: Check if user is first-time poster
async function exampleCheckFirstTimePoster() {
  const userId = 'some-user-uuid';

  const isFirstTopic = await isFirstTimeTopicPoster(userId);
  console.log('Is first topic?', isFirstTopic); // true/false

  const isFirstReply = await isFirstTimeReplyPoster(userId);
  console.log('Is first reply?', isFirstReply); // true/false
}

// Example 4: Full first post spam check workflow
async function exampleFirstPostWorkflow() {
  const userId = 'user-uuid';
  const userEmail = 'user@example.com';
  const userIP = '192.168.1.1'; // Optional, may not be available in browser

  // This function:
  // 1. Checks StopForumSpam API
  // 2. Caches the result
  // 3. Logs to flagged_users table if spammer detected
  // 4. Does NOT block the post (just flags for admin review)
  const result = await checkAndLogFirstPost(userId, userEmail, userIP);

  console.log('Flagged?', result.flagged);
  console.log('Confidence:', result.confidence);

  // Admin can review flagged users via:
  // SELECT * FROM get_pending_flagged_users();
}

// Example 5: Manual logging of flagged user
async function exampleManualFlag() {
  await logFlaggedUser(
    'user-uuid',
    'suspicious@example.com',
    'Manual review: Suspicious activity pattern',
    75 // Confidence score
  );
}

// How it's used in useTopics.js:
/*
const createTopic = async (forumId, title, content, honeypotValue = '') => {
  // ... other validation ...

  // Check if this is user's first topic and run spam check
  const isFirstTopic = await isFirstTimeTopicPoster(user.id);
  if (isFirstTopic) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    if (profile?.email) {
      // Run spam check (non-blocking - just logs for admin review)
      await checkAndLogFirstPost(user.id, profile.email);
    }
  }

  // ... create the topic ...
};
*/

// Admin workflow:
/*
1. Query flagged users:
   SELECT * FROM get_pending_flagged_users();

2. Review the user's content:
   - Check their topic/reply content
   - Look at confidence score
   - Decide if it's spam or legitimate

3. Take action:
   - If spam: Suspend user (INSERT INTO user_suspensions ...)
   - If legitimate: Mark as reviewed (mark_flagged_user_reviewed(flagged_id, notes))

4. Mark as reviewed:
   SELECT mark_flagged_user_reviewed(
     'flagged-user-id',
     'Reviewed - legitimate user, false positive'
   );
*/

export {
  exampleCheckEmail,
  exampleCheckEmailAndIP,
  exampleCheckFirstTimePoster,
  exampleFirstPostWorkflow,
  exampleManualFlag
};
