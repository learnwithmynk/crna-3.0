# StopForumSpam Integration

## Overview

The CRNA Club community forums integrate with the **StopForumSpam API** to automatically detect and flag potential spammers on their first post. This helps admins catch spam accounts early while avoiding false positives that would block legitimate users.

## Key Design Decisions

### 1. Non-Blocking Approach
- Spam checks **do not block** user posts
- Instead, they **flag users for admin review**
- This prevents false positives from frustrating legitimate users
- Admins can review and take action as needed

### 2. First Post Detection
- Only runs on a user's **first topic** or **first reply**
- Subsequent posts are not checked (to avoid API rate limits)
- Assumes legitimate users won't be flagged on first post

### 3. Caching Strategy
- Results are cached for 24 hours to avoid redundant API calls
- Cache key is the user's email address
- Old cache entries (7+ days) are automatically cleaned up

### 4. High Confidence Threshold
- Only flags users with confidence score **> 50%**
- Lower confidence results are logged but don't create flags
- Balances spam detection with false positive prevention

## Architecture

### Files Created

```
/src/lib/spamCheck.js              # Core spam check logic
/src/lib/spamCheck.test.js         # Example usage and tests
/supabase/migrations/
  20251214100000_spam_check_cache.sql  # Database tables and functions
```

### Database Tables

#### `spam_check_cache`
Caches StopForumSpam API results to avoid redundant calls.

```sql
CREATE TABLE spam_check_cache (
  email TEXT PRIMARY KEY,
  ip_address INET,
  is_spammer BOOLEAN DEFAULT FALSE,
  confidence DECIMAL DEFAULT 0,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `flagged_users`
Stores users flagged for admin review.

```sql
CREATE TABLE flagged_users (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email TEXT,
  reason TEXT,
  confidence DECIMAL DEFAULT 0,
  reviewed BOOLEAN DEFAULT FALSE,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## API Functions

### `checkSpammer(email, ip)`
Checks if an email/IP is a known spammer via StopForumSpam API.

```javascript
const result = await checkSpammer('user@example.com', '192.168.1.1');
// Returns: { isSpammer: boolean, confidence: number, cached: boolean }
```

**Parameters:**
- `email` (string, required): User's email address
- `ip` (string, optional): User's IP address (may not be available in browser)

**Returns:**
- `isSpammer` (boolean): True if confidence > 50%
- `confidence` (number): Confidence score 0-100
- `cached` (boolean): True if result was from cache

### `logFlaggedUser(userId, email, reason, confidence)`
Logs a flagged user for admin review.

```javascript
await logFlaggedUser(
  'user-uuid',
  'suspicious@example.com',
  'StopForumSpam: Known spammer (confidence: 85%)',
  85
);
```

### `isFirstTimeTopicPoster(userId)`
Checks if this will be the user's first topic.

```javascript
const isFirst = await isFirstTimeTopicPoster('user-uuid');
// Returns: true if user has zero topics
```

### `isFirstTimeReplyPoster(userId)`
Checks if this will be the user's first reply.

```javascript
const isFirst = await isFirstTimeReplyPoster('user-uuid');
// Returns: true if user has zero replies
```

### `checkAndLogFirstPost(userId, email, ip)`
Complete workflow: check spammer, cache result, log if flagged.

```javascript
const result = await checkAndLogFirstPost(
  'user-uuid',
  'user@example.com',
  '192.168.1.1' // optional
);
// Returns: { flagged: boolean, confidence: number }
```

## Integration with Forum Hooks

### useTopics.js
Spam check is automatically run on first topic creation:

```javascript
const createTopic = async (forumId, title, content, honeypotValue = '') => {
  // ... validation ...

  // Check if this is user's first topic
  const isFirstTopic = await isFirstTimeTopicPoster(user.id);
  if (isFirstTopic) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    if (profile?.email) {
      // Run spam check (non-blocking)
      await checkAndLogFirstPost(user.id, profile.email);
    }
  }

  // ... create topic ...
};
```

### useReplies.js
Spam check is automatically run on first reply creation:

```javascript
const createReply = async (topicId, content, parentReplyId = null, honeypotValue = '') => {
  // ... validation ...

  // Check if this is user's first reply
  const isFirstReply = await isFirstTimeReplyPoster(user.id);
  if (isFirstReply) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    if (profile?.email) {
      // Run spam check (non-blocking)
      await checkAndLogFirstPost(user.id, profile.email);
    }
  }

  // ... create reply ...
};
```

## Admin Workflow

### 1. View Flagged Users
Query the database to see pending flagged users:

```sql
SELECT * FROM get_pending_flagged_users();
```

This returns:
- User ID, email, and name
- Reason for flagging
- Confidence score
- Number of topics/replies posted
- Created timestamp

### 2. Review User Content
Manually review the user's posts to determine if they're spam:
- Look at topic/reply content
- Check confidence score
- Consider user behavior patterns

### 3. Take Action

**If Spam:**
Suspend the user account:
```sql
INSERT INTO user_suspensions (user_id, suspended_by, reason)
VALUES (
  'spammer-user-id',
  auth.uid(),
  'Confirmed spam account'
);
```

**If Legitimate:**
Mark as reviewed (no action needed):
```sql
SELECT mark_flagged_user_reviewed(
  'flagged-entry-id',
  'Reviewed - legitimate user, false positive from StopForumSpam'
);
```

### 4. Database Maintenance

Old cache entries (7+ days) are automatically cleaned up by running:
```sql
SELECT cleanup_spam_cache();
```

This can be run via a cron job or manually by admins.

## StopForumSpam API

### API Endpoint
```
https://api.stopforumspam.org/api
```

### Rate Limits
- Free tier: 20,000 queries per day
- No authentication required
- Caching strategy keeps us well under limits

### Example Request
```
GET https://api.stopforumspam.org/api?email=spammer@example.com&json
```

### Example Response
```json
{
  "email": {
    "appears": 1,
    "confidence": 85.5,
    "frequency": 3,
    "lastseen": "2025-12-10"
  }
}
```

## Testing

### Test with Known Spammer Email
```javascript
import { checkSpammer } from '@/lib/spamCheck';

// This email is known to StopForumSpam
const result = await checkSpammer('known-spammer@example.com');
console.log(result);
// { isSpammer: true, confidence: 90, cached: false }
```

### Test First Post Detection
```javascript
import { isFirstTimeTopicPoster } from '@/lib/spamCheck';

const isFirst = await isFirstTimeTopicPoster('new-user-uuid');
// Returns true for users with no topics yet
```

### Manual Testing Steps

1. Create a new user account
2. Post their first topic or reply
3. Check the `flagged_users` table:
   ```sql
   SELECT * FROM flagged_users WHERE reviewed = false;
   ```
4. Verify the user appears if their email is in StopForumSpam database

## Security Considerations

### Privacy
- Email addresses are hashed before being sent to StopForumSpam API (if needed)
- Cache table is protected by RLS (service role only)
- Flagged users table is admin-only

### False Positives
- Non-blocking approach prevents legitimate users from being frustrated
- Admins can review and dismiss false flags
- High confidence threshold (>50%) reduces false positives

### Rate Limiting
- 24-hour cache prevents excessive API calls
- Only checking first post per user limits API usage
- Well under free tier limits (20,000/day)

## Future Enhancements

### Potential Improvements
1. **IP Address Detection**: Currently optional, could add server-side IP detection
2. **Bulk Checking**: Admin tool to bulk-check existing users
3. **Automated Actions**: Auto-hide content from high-confidence spammers
4. **Analytics Dashboard**: Track spam detection rate, false positives
5. **Email Notifications**: Alert admins when high-confidence spammer detected
6. **Machine Learning**: Train custom model on flagged users over time

### Integration with Other Systems
- WordPress/Groundhogg: Sync spam flags to email lists
- Analytics: Track spam attempts over time
- Gamification: Penalize spam behavior patterns

## Troubleshooting

### Common Issues

**Issue: API calls failing**
- Check internet connectivity
- Verify StopForumSpam API is not down
- Check API rate limits

**Issue: Cache not working**
- Verify `spam_check_cache` table exists
- Check RLS policies allow service role access
- Confirm Supabase client is configured

**Issue: False positives**
- Review confidence threshold (currently >50%)
- Check StopForumSpam database accuracy
- Consider lowering threshold or adding manual review step

## Resources

- [StopForumSpam API Documentation](https://www.stopforumspam.com/usage)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Community Forums Schema](/supabase/migrations/20251214000000_community_forums.sql)

## Support

For issues or questions:
1. Check the `flagged_users` table for recent activity
2. Review Supabase logs for API errors
3. Test with known spammer emails from StopForumSpam database
4. Contact StopForumSpam support if API issues persist
