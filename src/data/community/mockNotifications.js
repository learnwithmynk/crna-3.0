/**
 * Mock Community Notifications Data
 *
 * Used for development and when Supabase is not configured.
 * Covers all notification types:
 * - topic_reply: Someone replied to your topic
 * - reply_to_reply: Someone replied to your reply
 * - mentioned: Someone @mentioned you
 * - reaction_received: Someone reacted to your content
 *
 * Each notification has:
 * - id, user_id, type, title, message, link
 * - is_read, created_at
 * - source_type, source_id, actor_id
 * - actor_name, actor_avatar (denormalized for display)
 */

export const mockNotifications = [
  // Topic reply - unread
  {
    id: 'notif-1',
    user_id: 'user-123',
    type: 'topic_reply',
    title: 'New reply in "Georgetown Interview Tips"',
    message: 'Sarah replied to your topic',
    link: '/community/topics/georgetown-interview-tips#reply-456',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    source_type: 'reply',
    source_id: 'reply-456',
    actor_id: 'user-sarah',
    actor_name: 'Sarah Martinez',
    actor_avatar: null,
  },

  // Reply to reply - unread
  {
    id: 'notif-2',
    user_id: 'user-123',
    type: 'reply_to_reply',
    title: 'Reply to your comment',
    message: 'Jessica responded to your comment in "GRE Study Tips"',
    link: '/community/topics/gre-study-tips#reply-789',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    source_type: 'reply',
    source_id: 'reply-789',
    actor_id: 'user-jessica',
    actor_name: 'Jessica Chen',
    actor_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
  },

  // Mention - unread
  {
    id: 'notif-3',
    user_id: 'user-123',
    type: 'mentioned',
    title: 'You were mentioned',
    message: 'Alex mentioned you in "Duke vs Georgetown"',
    link: '/community/topics/duke-vs-georgetown#reply-321',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    source_type: 'reply',
    source_id: 'reply-321',
    actor_id: 'user-alex',
    actor_name: 'Alex Thompson',
    actor_avatar: null,
  },

  // Reaction received - unread
  {
    id: 'notif-4',
    user_id: 'user-123',
    type: 'reaction_received',
    title: 'Someone loved your post',
    message: 'Emily loved your reply in "Shadowing Hours Requirements"',
    link: '/community/topics/shadowing-hours-requirements#reply-555',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    source_type: 'reply',
    source_id: 'reply-555',
    actor_id: 'user-emily',
    actor_name: 'Emily Rodriguez',
    actor_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
  },

  // Topic reply - read
  {
    id: 'notif-5',
    user_id: 'user-123',
    type: 'topic_reply',
    title: 'New reply in "CCRN Study Materials"',
    message: 'Michael replied to your topic',
    link: '/community/topics/ccrn-study-materials#reply-888',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    source_type: 'reply',
    source_id: 'reply-888',
    actor_id: 'user-michael',
    actor_name: 'Michael Lee',
    actor_avatar: null,
  },

  // Mention - read
  {
    id: 'notif-6',
    user_id: 'user-123',
    type: 'mentioned',
    title: 'You were mentioned',
    message: 'Taylor mentioned you in "TEAS vs GRE"',
    link: '/community/topics/teas-vs-gre#reply-999',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    source_type: 'reply',
    source_id: 'reply-999',
    actor_id: 'user-taylor',
    actor_name: 'Taylor Kim',
    actor_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor',
  },

  // Reply to reply - read
  {
    id: 'notif-7',
    user_id: 'user-123',
    type: 'reply_to_reply',
    title: 'Reply to your comment',
    message: 'Jordan responded to your comment in "Program Rankings Accuracy"',
    link: '/community/topics/program-rankings-accuracy#reply-111',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    source_type: 'reply',
    source_id: 'reply-111',
    actor_id: 'user-jordan',
    actor_name: 'Jordan Smith',
    actor_avatar: null,
  },

  // Topic reply - read
  {
    id: 'notif-8',
    user_id: 'user-123',
    type: 'topic_reply',
    title: 'New reply in "Volunteer Hours Question"',
    message: 'Chris replied to your topic',
    link: '/community/topics/volunteer-hours-question#reply-222',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    source_type: 'reply',
    source_id: 'reply-222',
    actor_id: 'user-chris',
    actor_name: 'Chris Anderson',
    actor_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris',
  },

  // Reaction received - read
  {
    id: 'notif-9',
    user_id: 'user-123',
    type: 'reaction_received',
    title: 'Someone liked your post',
    message: 'Sam liked your reply in "Application Timeline Advice"',
    link: '/community/topics/application-timeline-advice#reply-333',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    source_type: 'reply',
    source_id: 'reply-333',
    actor_id: 'user-sam',
    actor_name: 'Sam Wilson',
    actor_avatar: null,
  },

  // Mention - read
  {
    id: 'notif-10',
    user_id: 'user-123',
    type: 'mentioned',
    title: 'You were mentioned',
    message: 'Morgan mentioned you in "ICU Experience vs ER"',
    link: '/community/topics/icu-experience-vs-er#reply-444',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    source_type: 'reply',
    source_id: 'reply-444',
    actor_id: 'user-morgan',
    actor_name: 'Morgan Taylor',
    actor_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan',
  },

  // Reply to reply - read
  {
    id: 'notif-11',
    user_id: 'user-123',
    type: 'reply_to_reply',
    title: 'Reply to your comment',
    message: 'Riley responded to your comment in "First Interview Jitters"',
    link: '/community/topics/first-interview-jitters#reply-666',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
    source_type: 'reply',
    source_id: 'reply-666',
    actor_id: 'user-riley',
    actor_name: 'Riley Johnson',
    actor_avatar: null,
  },

  // Reaction received - read
  {
    id: 'notif-12',
    user_id: 'user-123',
    type: 'reaction_received',
    title: 'Someone loved your post',
    message: 'Casey loved your reply in "Personal Statement Help"',
    link: '/community/topics/personal-statement-help#reply-777',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    source_type: 'reply',
    source_id: 'reply-777',
    actor_id: 'user-casey',
    actor_name: 'Casey Davis',
    actor_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey',
  },

  // Topic reply - read (oldest)
  {
    id: 'notif-13',
    user_id: 'user-123',
    type: 'topic_reply',
    title: 'New reply in "Reference Letter Tips"',
    message: 'Jamie replied to your topic',
    link: '/community/topics/reference-letter-tips#reply-888',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week ago
    source_type: 'reply',
    source_id: 'reply-888',
    actor_id: 'user-jamie',
    actor_name: 'Jamie Brown',
    actor_avatar: null,
  },
];
