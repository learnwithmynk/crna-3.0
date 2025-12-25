# Notification System

Design for notifications in The CRNA Club.

---

## Overview

Notifications alert users to important events, updates, and reminders. The system includes in-app notifications, email notifications, and potentially push notifications.

---

## Notification Types

### Application-Related

| Type | Trigger | Channel |
|------|---------|---------|
| `deadline_reminder` | 30, 14, 7 days before target program deadline | In-app, Email |
| `application_submitted` | User marks program as submitted | In-app |
| `interview_invite` | User updates status to "Interview Invited" | In-app |
| `decision_received` | User updates to Accepted/Waitlisted/Denied | In-app |

### Community-Related (Custom Supabase Forums)

| Type | Trigger | Channel |
|------|---------|---------|
| `topic_reply` | Someone replies to user's topic | In-app |
| `reply_to_reply` | Someone replies to user's reply | In-app |
| `mentioned` | User @mentioned in post | In-app |
| `reaction_received` | Someone reacts to user's content | In-app |

> **Note:** Email notifications for community are deferred. Will be added via Groundhogg when ready.

### Gamification-Related

| Type | Trigger | Channel |
|------|---------|---------|
| `level_up` | User reaches new level | In-app (celebration) |
| `badge_earned` | User earns a badge | In-app (celebration) |
| `points_milestone` | Reaches point milestone (500, 1000, etc.) | In-app |
| `leaderboard_rank` | Moves into top 10 | In-app |

### Marketplace-Related

| Type | Trigger | Channel |
|------|---------|---------|
| `booking_request` | New booking request (for provider) | In-app, Email |
| `booking_confirmed` | Booking accepted | In-app, Email |
| `booking_reminder` | 24 hours before session | In-app, Email |
| `booking_completed` | Session marked complete | In-app |
| `review_requested` | Prompt to review after session | In-app, Email |

### Account-Related

| Type | Trigger | Channel |
|------|---------|---------|
| `trial_ending` | 3, 1 days before trial ends | In-app, Email |
| `subscription_renewed` | Subscription renewed | Email |
| `subscription_cancelled` | Subscription cancelled | In-app, Email |
| `welcome` | New account created | In-app, Email |

---

## In-App Notification Structure

```javascript
// Notification object shape
{
  id: "notif_001",
  type: "topic_reply",
  title: "New reply to your topic",
  message: "FutureCRNA replied: \"Great question! I interviewed there...\"",
  link: "/community/forums/123/456",
  read: false,
  createdAt: "2024-11-28T10:30:00Z",
  metadata: {
    topicId: "456",
    replyId: "789",
    authorName: "FutureCRNA",
    authorAvatar: "https://..."
  }
}
```

---

## UI Components

### Notification Bell (Header)

```jsx
// src/components/layout/notification-bell.jsx

import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

export function NotificationBell() {
  const { unreadCount, isOpen, setIsOpen } = useNotifications();
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && <NotificationDropdown />}
    </div>
  );
}
```

### Notification Dropdown

```jsx
// src/components/layout/notification-dropdown.jsx

export function NotificationDropdown() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  
  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border max-h-96 overflow-y-auto">
      <div className="p-3 border-b flex justify-between items-center">
        <h3 className="font-semibold">Notifications</h3>
        <button 
          onClick={markAllAsRead}
          className="text-sm text-blue-600 hover:underline"
        >
          Mark all read
        </button>
      </div>
      
      {notifications.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No notifications
        </div>
      ) : (
        <div>
          {notifications.map(notif => (
            <NotificationItem 
              key={notif.id} 
              notification={notif}
              onRead={() => markAsRead(notif.id)}
            />
          ))}
        </div>
      )}
      
      <div className="p-3 border-t text-center">
        <Link to="/notifications" className="text-sm text-blue-600 hover:underline">
          View all notifications
        </Link>
      </div>
    </div>
  );
}
```

### Notification Item

```jsx
// src/components/layout/notification-item.jsx

import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export function NotificationItem({ notification, onRead }) {
  const icon = getNotificationIcon(notification.type);
  
  return (
    <Link
      to={notification.link}
      onClick={onRead}
      className={`
        block p-3 hover:bg-gray-50 border-b last:border-b-0
        ${!notification.read ? 'bg-blue-50' : ''}
      `}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{notification.title}</p>
          <p className="text-sm text-gray-600 truncate">{notification.message}</p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </p>
        </div>
        {!notification.read && (
          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
        )}
      </div>
    </Link>
  );
}

function getNotificationIcon(type) {
  const icons = {
    topic_reply: <MessageSquare className="w-5 h-5 text-blue-500" />,
    new_message: <Mail className="w-5 h-5 text-green-500" />,
    level_up: <Trophy className="w-5 h-5 text-yellow-500" />,
    badge_earned: <Award className="w-5 h-5 text-purple-500" />,
    deadline_reminder: <Calendar className="w-5 h-5 text-red-500" />,
    booking_request: <Clock className="w-5 h-5 text-orange-500" />,
  };
  return icons[type] || <Bell className="w-5 h-5 text-gray-500" />;
}
```

### Celebration Modal (Level Up / Badge)

```jsx
// src/components/features/gamification/celebration-modal.jsx

import { Dialog } from '@/components/ui/dialog';
import confetti from 'canvas-confetti';

export function CelebrationModal({ type, data, onClose }) {
  useEffect(() => {
    // Fire confetti on open
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);
  
  return (
    <Dialog open onOpenChange={onClose}>
      <div className="text-center p-6">
        {type === 'level_up' && (
          <>
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Level Up!</h2>
            <p className="text-lg text-gray-600 mb-4">
              You've reached Level {data.level}: {data.levelName}
            </p>
            <img src={data.badgeImage} alt={data.levelName} className="w-24 h-24 mx-auto mb-4" />
          </>
        )}
        
        {type === 'badge_earned' && (
          <>
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold mb-2">Badge Earned!</h2>
            <p className="text-lg text-gray-600 mb-4">
              You've earned the {data.badgeName} badge!
            </p>
            <img src={data.badgeImage} alt={data.badgeName} className="w-24 h-24 mx-auto mb-4" />
            <p className="text-sm text-gray-500">{data.badgeDescription}</p>
          </>
        )}
        
        <Button onClick={onClose} className="mt-4">
          Awesome!
        </Button>
      </div>
    </Dialog>
  );
}
```

---

## Points Toast

```jsx
// src/components/features/gamification/points-toast.jsx

import { useEffect, useState } from 'react';

export function PointsToast({ points, action }) {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);
  
  if (!visible) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-lg shadow-lg animate-bounce-in flex items-center gap-2">
      <span className="text-xl">⭐</span>
      <span className="font-medium">+{points} points!</span>
      <span className="text-sm text-yellow-800">{action}</span>
    </div>
  );
}
```

---

## useNotifications Hook

```jsx
// src/hooks/useNotifications.js

import { useState, useEffect, useCallback } from 'react';

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch notifications
  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    // TODO: Replace with API call
    // const res = await api.get('/notifications');
    // setNotifications(res.data.notifications);
    // setUnreadCount(res.data.unreadCount);
    setIsLoading(false);
  };

  const markAsRead = useCallback(async (id) => {
    // TODO: API call to mark as read
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(async () => {
    // TODO: API call to mark all as read
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    isOpen,
    setIsOpen,
    isLoading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  };
}
```

---

## API Endpoints

### Get Notifications

```
GET /crna/v1/notifications

Query params:
- page (number)
- per_page (number)
- unread_only (boolean)

Response (200):
{
  "notifications": [...],
  "total": 45,
  "unread_count": 3
}
```

### Mark as Read

```
PUT /crna/v1/notifications/:id/read

Response (200):
{
  "success": true
}
```

### Mark All as Read

```
PUT /crna/v1/notifications/read-all

Response (200):
{
  "success": true,
  "marked_count": 5
}
```

---

## Email Notification Settings

Users can configure email preferences:

```javascript
// Email preferences stored in user meta
{
  email_notifications: {
    deadline_reminders: true,
    community_replies: "digest",  // "instant", "digest", "off"
    new_messages: true,
    marketing: false,
    gamification: false
  }
}
```

Settings UI in `/settings`:

```jsx
function NotificationSettings() {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Email Notifications</h3>
      
      <div className="space-y-3">
        <ToggleSetting 
          label="Application deadline reminders"
          description="Get reminded before your target program deadlines"
          defaultChecked
        />
        
        <SelectSetting
          label="Community replies"
          description="When someone replies to your topics"
          options={[
            { value: "instant", label: "Instant" },
            { value: "digest", label: "Daily digest" },
            { value: "off", label: "Off" }
          ]}
          defaultValue="digest"
        />
        
        <ToggleSetting 
          label="New messages"
          description="When you receive a new private message"
          defaultChecked
        />
        
        <ToggleSetting 
          label="Level ups and badges"
          description="Celebrate your achievements via email"
          defaultChecked={false}
        />
      </div>
    </div>
  );
}
```

---

## Implementation Notes

### Phase 1 (MVP)
- In-app notification bell
- Dropdown with last 10 notifications
- Mark as read functionality
- Basic email notifications via Groundhogg

### Phase 2
- Notification preferences page
- Email digests
- Celebration modals for gamification

### Phase 3 (Future)
- Push notifications (if mobile app)
- Real-time updates via WebSocket
- More granular preferences
