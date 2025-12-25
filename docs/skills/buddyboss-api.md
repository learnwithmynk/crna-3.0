# BuddyBoss API

Reference for BuddyBoss REST API integration.

---

## Overview

BuddyBoss provides the community features: forums, groups, messaging, and activity feeds. The React app calls BuddyBoss REST API endpoints.

**Base URL:** `https://thecrnaclub.com/wp-json/buddyboss/v1`

**Authentication:** Same JWT token as WordPress REST API

---

## Forums

### List All Forums

```
GET /buddyboss/v1/forums

Query params:
- parent (number): Filter by parent forum ID
- orderby (string): "date", "title", "topic_count"
- order (string): "asc", "desc"

Response (200):
[
  {
    "id": 123,
    "title": { "rendered": "CRNA Programs" },
    "content": { "rendered": "<p>Discuss specific programs...</p>" },
    "parent": 0,
    "topic_count": 234,
    "reply_count": 1847,
    "last_active": "2024-11-27T15:30:00",
    "sub_forums": [
      { "id": 124, "title": { "rendered": "Georgetown" }, "topic_count": 45 },
      { "id": 125, "title": { "rendered": "Duke" }, "topic_count": 38 }
    ]
  },
  // ...
]
```

### Get Single Forum

```
GET /buddyboss/v1/forums/:id

Response (200):
{
  "id": 123,
  "title": { "rendered": "CRNA Programs" },
  "content": { "rendered": "..." },
  "parent": 0,
  "topic_count": 234,
  "reply_count": 1847,
  "last_active": "2024-11-27T15:30:00",
  "moderators": [
    { "id": 1, "name": "Admin", "avatar": "..." }
  ]
}
```

---

## Topics

### List Topics in Forum

```
GET /buddyboss/v1/topics

Query params:
- forum_id (number): Required - filter by forum
- page (number): Pagination
- per_page (number): Items per page (default 20)
- orderby (string): "date", "last_active", "reply_count"
- order (string): "asc", "desc"

Response (200):
{
  "topics": [
    {
      "id": 456,
      "title": { "rendered": "Georgetown interview tips?" },
      "content": { "rendered": "<p>Has anyone interviewed at Georgetown recently?...</p>" },
      "forum_id": 123,
      "author": {
        "id": 789,
        "name": "FutureCRNA",
        "avatar": "https://..."
      },
      "reply_count": 12,
      "voice_count": 8,
      "created": "2024-11-20T10:15:00",
      "last_active": "2024-11-27T14:22:00",
      "sticky": false
    },
    // ...
  ],
  "total": 234,
  "total_pages": 12
}
```

### Get Single Topic with Replies

```
GET /buddyboss/v1/topics/:id

Query params:
- page (number): For paginated replies
- per_page (number): Replies per page

Response (200):
{
  "id": 456,
  "title": { "rendered": "Georgetown interview tips?" },
  "content": { "rendered": "<p>Full topic content...</p>" },
  "forum_id": 123,
  "forum_title": "CRNA Programs",
  "author": {
    "id": 789,
    "name": "FutureCRNA",
    "avatar": "https://...",
    "member_since": "2024-01-15"
  },
  "reply_count": 12,
  "created": "2024-11-20T10:15:00",
  "last_active": "2024-11-27T14:22:00",
  "replies": [
    {
      "id": 1001,
      "content": { "rendered": "<p>I interviewed there last year...</p>" },
      "author": {
        "id": 101,
        "name": "AcceptedSRNA",
        "avatar": "https://..."
      },
      "created": "2024-11-20T11:30:00"
    },
    // ...
  ],
  "replies_total": 12,
  "replies_pages": 1
}
```

### Create Topic

```
POST /buddyboss/v1/topics

Request:
{
  "title": "New topic title",
  "content": "<p>Topic body content...</p>",
  "forum_id": 123
}

Response (201):
{
  "id": 457,
  "title": { "rendered": "New topic title" },
  "content": { "rendered": "<p>Topic body content...</p>" },
  "forum_id": 123,
  "author": { ... current user },
  "created": "2024-11-28T09:00:00"
}
```

### Update Topic

```
PUT /buddyboss/v1/topics/:id

Request:
{
  "title": "Updated title",
  "content": "<p>Updated content...</p>"
}

Response (200):
{
  ... updated topic object
}
```

### Delete Topic

```
DELETE /buddyboss/v1/topics/:id

Response (200):
{
  "deleted": true,
  "previous": { ... deleted topic object }
}
```

---

## Replies

### Create Reply

```
POST /buddyboss/v1/replies

Request:
{
  "topic_id": 456,
  "content": "<p>My reply content...</p>"
}

Response (201):
{
  "id": 1002,
  "topic_id": 456,
  "content": { "rendered": "<p>My reply content...</p>" },
  "author": { ... current user },
  "created": "2024-11-28T09:15:00"
}
```

### Update Reply

```
PUT /buddyboss/v1/replies/:id

Request:
{
  "content": "<p>Updated reply...</p>"
}

Response (200):
{
  ... updated reply object
}
```

### Delete Reply

```
DELETE /buddyboss/v1/replies/:id

Response (200):
{
  "deleted": true
}
```

---

## Groups

### List Groups

```
GET /buddyboss/v1/groups

Query params:
- type (string): "public", "private", "hidden"
- user_id (number): Groups for specific user
- page (number)
- per_page (number)
- search (string): Search by name

Response (200):
[
  {
    "id": 10,
    "name": "Annual Congress 2025 - Nashville Meetup",
    "description": { "rendered": "<p>Connect with others attending...</p>" },
    "status": "public",
    "created": "2024-09-01T00:00:00",
    "creator_id": 1,
    "member_count": 234,
    "cover_url": "https://...",
    "avatar_url": "https://...",
    "is_member": true
  },
  // ...
]
```

### Get Single Group

```
GET /buddyboss/v1/groups/:id

Response (200):
{
  "id": 10,
  "name": "Annual Congress 2025 - Nashville Meetup",
  "description": { "rendered": "..." },
  "status": "public",
  "created": "2024-09-01T00:00:00",
  "member_count": 234,
  "cover_url": "https://...",
  "avatar_url": "https://...",
  "is_member": true,
  "is_admin": false,
  "admins": [
    { "id": 1, "name": "Admin", "avatar": "..." }
  ],
  "activity_count": 156
}
```

### Join Group

```
POST /buddyboss/v1/groups/:id/members

Request:
{
  "user_id": 789  // Current user ID
}

Response (201):
{
  "success": true,
  "member": {
    "user_id": 789,
    "group_id": 10,
    "joined": "2024-11-28T09:00:00",
    "role": "member"
  }
}
```

### Leave Group

```
DELETE /buddyboss/v1/groups/:id/members/:user_id

Response (200):
{
  "success": true
}
```

### Get Group Members

```
GET /buddyboss/v1/groups/:id/members

Query params:
- page (number)
- per_page (number)
- roles (string): "admin", "mod", "member"

Response (200):
{
  "members": [
    {
      "user_id": 789,
      "name": "Sarah Johnson",
      "avatar": "https://...",
      "joined": "2024-06-15T00:00:00",
      "role": "member"
    },
    // ...
  ],
  "total": 234
}
```

---

## Group Activity

### Get Group Activity Feed

```
GET /buddyboss/v1/activity

Query params:
- group_id (number): Filter by group
- page (number)
- per_page (number)

Response (200):
[
  {
    "id": 5001,
    "type": "activity_update",
    "content": { "rendered": "<p>Just submitted to Georgetown!</p>" },
    "user": {
      "id": 789,
      "name": "Sarah Johnson",
      "avatar": "https://..."
    },
    "date": "2024-11-27T14:00:00",
    "comment_count": 3,
    "favorited": false
  },
  // ...
]
```

### Post Activity Update

```
POST /buddyboss/v1/activity

Request:
{
  "content": "<p>Activity post content...</p>",
  "component": "groups",
  "group_id": 10
}

Response (201):
{
  "id": 5002,
  "type": "activity_update",
  "content": { "rendered": "..." },
  "user": { ... current user },
  "date": "2024-11-28T09:30:00"
}
```

---

## Messages

### Get Message Threads (Inbox)

```
GET /buddyboss/v1/messages

Query params:
- box (string): "inbox", "sentbox"
- page (number)
- per_page (number)

Response (200):
{
  "threads": [
    {
      "id": 2001,
      "subject": { "rendered": "Question about Georgetown" },
      "last_message": {
        "id": 3001,
        "content": { "rendered": "Thanks for the info!" },
        "sender": { "id": 101, "name": "OtherUser", "avatar": "..." },
        "date": "2024-11-27T16:00:00"
      },
      "participants": [
        { "id": 789, "name": "Sarah", "avatar": "..." },
        { "id": 101, "name": "OtherUser", "avatar": "..." }
      ],
      "unread_count": 2,
      "message_count": 8
    },
    // ...
  ],
  "total": 15
}
```

### Get Single Thread

```
GET /buddyboss/v1/messages/:thread_id

Query params:
- page (number)
- per_page (number)

Response (200):
{
  "id": 2001,
  "subject": { "rendered": "Question about Georgetown" },
  "participants": [...],
  "messages": [
    {
      "id": 3001,
      "content": { "rendered": "<p>Hi! I saw your post about Georgetown...</p>" },
      "sender": { "id": 101, "name": "OtherUser", "avatar": "..." },
      "date": "2024-11-25T10:00:00"
    },
    {
      "id": 3002,
      "content": { "rendered": "<p>Sure, happy to help!</p>" },
      "sender": { "id": 789, "name": "Sarah", "avatar": "..." },
      "date": "2024-11-25T11:30:00"
    },
    // ...
  ],
  "message_count": 8
}
```

### Send Message (New Thread)

```
POST /buddyboss/v1/messages

Request:
{
  "recipients": [101],  // Array of user IDs
  "subject": "Question about your experience",
  "message": "<p>Hi! I wanted to ask...</p>"
}

Response (201):
{
  "thread_id": 2002,
  "message": {
    "id": 3010,
    "content": { "rendered": "..." },
    "sender": { ... current user },
    "date": "2024-11-28T10:00:00"
  }
}
```

### Reply to Thread

```
POST /buddyboss/v1/messages/:thread_id/reply

Request:
{
  "message": "<p>Reply content...</p>"
}

Response (201):
{
  "id": 3011,
  "thread_id": 2001,
  "content": { "rendered": "..." },
  "sender": { ... current user },
  "date": "2024-11-28T10:15:00"
}
```

### Mark Thread Read

```
PUT /buddyboss/v1/messages/:thread_id/read

Response (200):
{
  "success": true,
  "unread_count": 0
}
```

### Delete Thread

```
DELETE /buddyboss/v1/messages/:thread_id

Response (200):
{
  "deleted": true
}
```

---

## Error Responses

```
Response (401):
{
  "code": "rest_not_logged_in",
  "message": "You are not currently logged in."
}

Response (403):
{
  "code": "rest_forbidden",
  "message": "You don't have permission to do this."
}

Response (404):
{
  "code": "rest_not_found",
  "message": "Resource not found."
}
```

---

## React Integration Tips

### Custom Hooks

```javascript
// src/hooks/useCommunity.js

export function useForums() {
  const [forums, setForums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // TODO: Replace with actual API call
    fetch('/wp-json/buddyboss/v1/forums')
      .then(res => res.json())
      .then(data => {
        setForums(data);
        setIsLoading(false);
      });
  }, []);
  
  return { forums, isLoading };
}

export function useTopics(forumId) {
  // Similar pattern...
}

export function useGroups() {
  // Similar pattern...
}

export function useMessages() {
  // Similar pattern...
}
```

### Real-Time Considerations

BuddyBoss doesn't have built-in WebSocket support. Options:
1. Polling every 30-60 seconds for new messages
2. Use WordPress push notification plugin
3. Manual refresh buttons

For MVP, use polling with reasonable intervals.
