// Mock Replies Data
// Matches BuddyBoss REST API shape for replies
// TODO: Replace with API calls to /buddyboss/v1/replies

import { mockUsers } from './mockTopics';

// Available reactions (BuddyBoss Emotions mode)
export const availableReactions = [
  { id: 'like', icon: '👍', label: 'Like', color: '#3b82f6' },
  { id: 'love', icon: '❤️', label: 'Love', color: '#ef4444' },
  { id: 'laugh', icon: '😂', label: 'Laugh', color: '#f59e0b' },
  { id: 'wow', icon: '😮', label: 'Wow', color: '#8b5cf6' },
  { id: 'sad', icon: '😢', label: 'Sad', color: '#6b7280' },
  { id: 'angry', icon: '😠', label: 'Angry', color: '#dc2626' }
];

// Replies for topic 1001 (Georgetown interview tips)
// Now with nested replies (parent_id), reactions, mentions, and media support
export const mockRepliesTopic1001 = [
  {
    id: 5001,
    topic_id: 1001,
    parent_id: null, // Top-level reply
    depth: 0,
    content: { rendered: '<p>I interviewed there last year! Yes, they do MMI format - about 6 stations, 8 minutes each. Stations include ethical scenarios, teamwork situations, and traditional "tell me about yourself" type questions. They were really friendly and tried to put you at ease.</p>' },
    author: mockUsers.james,
    created: '2024-12-01T11:30:00',
    edited: false,
    reactions: {
      like: [mockUsers.sarah.id, mockUsers.mike.id, mockUsers.ashley.id],
      love: [mockUsers.emily.id],
      laugh: []
    },
    reaction_count: 4,
    reply_count: 2, // Number of direct child replies
    mentions: [],
    media: []
  },
  {
    id: 5002,
    topic_id: 1001,
    parent_id: 5001, // Nested reply to 5001
    depth: 1,
    content: { rendered: '<p>Adding to what <span class="mention" data-user-id="104">@JamesSRNA</span> said - make sure you review basic pharm! They asked me about common ICU drips and their mechanisms. Nothing too crazy but you should know your pressors and sedatives.</p>' },
    author: mockUsers.mike,
    created: '2024-12-01T14:45:00',
    edited: false,
    reactions: {
      like: [mockUsers.james.id, mockUsers.sarah.id],
      love: [],
      laugh: []
    },
    reaction_count: 2,
    reply_count: 0,
    mentions: [{ id: 104, name: 'JamesSRNA' }],
    media: []
  },
  {
    id: 5003,
    topic_id: 1001,
    parent_id: 5001, // Nested reply to 5001
    depth: 1,
    content: { rendered: '<p>Thank you both! This is so helpful. Did they ask any curve ball questions or was it pretty standard stuff?</p>' },
    author: mockUsers.sarah,
    created: '2024-12-01T16:00:00',
    edited: false,
    reactions: {
      like: [],
      love: [],
      laugh: []
    },
    reaction_count: 0,
    reply_count: 1,
    mentions: [],
    media: []
  },
  {
    id: 5004,
    topic_id: 1001,
    parent_id: 5003, // Nested reply to 5003 (depth 2)
    depth: 2,
    content: { rendered: '<p>One station had a scenario where I had to discuss a conflict with a coworker. It wasn\'t technically clinical but still important to prepare for. Think STAR method!</p>' },
    author: mockUsers.james,
    created: '2024-12-02T09:15:00',
    edited: false,
    reactions: {
      like: [mockUsers.sarah.id, mockUsers.emily.id, mockUsers.david.id],
      love: [],
      wow: [mockUsers.currentUser.id]
    },
    reaction_count: 4,
    reply_count: 0,
    mentions: [],
    media: []
  },
  {
    id: 5005,
    topic_id: 1001,
    parent_id: null,
    depth: 0,
    content: { rendered: '<p>I interviewed Fall 2024 and got in! A few tips:</p><ul><li>Arrive early - DC traffic is unpredictable</li><li>Wear comfortable shoes - you\'ll walk between stations</li><li>Bring water and a snack</li><li>They provide lunch which is a good networking opportunity with current students</li></ul>' },
    author: mockUsers.ashley,
    created: '2024-12-03T10:30:00',
    edited: false,
    reactions: {
      like: [mockUsers.sarah.id, mockUsers.mike.id, mockUsers.emily.id, mockUsers.david.id, mockUsers.currentUser.id],
      love: [mockUsers.james.id],
      laugh: []
    },
    reaction_count: 6,
    reply_count: 2,
    mentions: [],
    media: []
  },
  {
    id: 5006,
    topic_id: 1001,
    parent_id: 5005,
    depth: 1,
    content: { rendered: '<p><span class="mention" data-user-id="103">@AshleyH</span> congrats on your acceptance! What was the vibe like with the faculty? I\'ve heard they\'re very supportive.</p>' },
    author: mockUsers.emily,
    created: '2024-12-03T15:00:00',
    edited: false,
    reactions: {
      like: [mockUsers.ashley.id],
      love: [],
      laugh: []
    },
    reaction_count: 1,
    reply_count: 1,
    mentions: [{ id: 103, name: 'AshleyH' }],
    media: []
  },
  {
    id: 5007,
    topic_id: 1001,
    parent_id: 5006,
    depth: 2,
    content: { rendered: '<p>The faculty were AMAZING. Very down to earth and genuinely interested in getting to know you as a person. They asked about my hobbies and what I do outside of nursing. Don\'t just prepare clinical answers!</p>' },
    author: mockUsers.ashley,
    created: '2024-12-04T08:45:00',
    edited: false,
    reactions: {
      like: [mockUsers.emily.id, mockUsers.sarah.id],
      love: [mockUsers.james.id, mockUsers.mike.id],
      laugh: []
    },
    reaction_count: 4,
    reply_count: 0,
    mentions: [],
    media: []
  },
  {
    id: 5008,
    topic_id: 1001,
    parent_id: null,
    depth: 0,
    content: { rendered: '<p>Quick question - did anyone stay in DC the night before? Any hotel recommendations near the campus?</p>' },
    author: mockUsers.david,
    created: '2024-12-05T11:00:00',
    edited: false,
    reactions: {
      like: [],
      love: [],
      laugh: []
    },
    reaction_count: 0,
    reply_count: 1,
    mentions: [],
    media: []
  },
  {
    id: 5009,
    topic_id: 1001,
    parent_id: 5008,
    depth: 1,
    content: { rendered: '<p>I stayed at the Georgetown Inn - about 10 min walk to campus. A bit pricey but worth it for the peace of mind of not dealing with traffic day-of.</p>' },
    author: mockUsers.mike,
    created: '2024-12-05T14:30:00',
    edited: false,
    reactions: {
      like: [mockUsers.david.id],
      love: [],
      laugh: []
    },
    reaction_count: 1,
    reply_count: 0,
    mentions: [],
    media: [
      {
        id: 'm001',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1585990976839-e9e9de0b98e0?w=400',
        thumbnail: 'https://images.unsplash.com/photo-1585990976839-e9e9de0b98e0?w=200',
        alt: 'Georgetown Inn exterior'
      }
    ]
  },
  {
    id: 5010,
    topic_id: 1001,
    parent_id: null,
    depth: 0,
    content: { rendered: '<p>This thread is gold! Saving it. My interview is in 3 weeks. So nervous but also excited!</p>' },
    author: mockUsers.currentUser,
    created: '2024-12-10T09:00:00',
    edited: false,
    reactions: {
      like: [mockUsers.james.id, mockUsers.ashley.id, mockUsers.mike.id],
      love: [mockUsers.emily.id, mockUsers.sarah.id],
      laugh: []
    },
    reaction_count: 5,
    reply_count: 1,
    mentions: [],
    media: []
  },
  {
    id: 5011,
    topic_id: 1001,
    parent_id: 5010,
    depth: 1,
    content: { rendered: '<p>You\'ve got this <span class="mention" data-user-id="999">@Sachi</span>! Just be yourself and let your passion for anesthesia shine through. That\'s what they\'re really looking for.</p>' },
    author: mockUsers.james,
    created: '2024-12-11T10:15:00',
    edited: false,
    reactions: {
      like: [mockUsers.currentUser.id, mockUsers.ashley.id],
      love: [mockUsers.emily.id],
      laugh: []
    },
    reaction_count: 3,
    reply_count: 0,
    mentions: [{ id: 999, name: 'Sachi' }],
    media: []
  },
  {
    id: 5012,
    topic_id: 1001,
    parent_id: null,
    depth: 0,
    content: { rendered: '<p>Good luck everyone with upcoming interviews! Feel free to DM me if you have specific questions about Georgetown. Happy to help!</p>' },
    author: mockUsers.ashley,
    created: '2024-12-11T14:22:00',
    edited: false,
    reactions: {
      like: [mockUsers.sarah.id, mockUsers.mike.id, mockUsers.emily.id, mockUsers.david.id, mockUsers.currentUser.id, mockUsers.james.id],
      love: [],
      laugh: []
    },
    reaction_count: 6,
    reply_count: 0,
    mentions: [],
    media: []
  }
];

// Replies for topic 1002 (Georgetown SRNA AMA)
export const mockRepliesTopic1002 = [
  {
    id: 5501,
    topic_id: 1002,
    parent_id: null,
    depth: 0,
    content: { rendered: '<p>Thanks for doing this! How are the clinical sites? Do you rotate through different hospitals?</p>' },
    author: mockUsers.sarah,
    created: '2024-11-15T10:30:00',
    edited: false,
    reactions: { like: [mockUsers.james.id, mockUsers.ashley.id], love: [], laugh: [] },
    reaction_count: 2,
    reply_count: 1,
    mentions: [],
    media: []
  },
  {
    id: 5502,
    topic_id: 1002,
    parent_id: 5501,
    depth: 1,
    content: { rendered: '<p>Great question! Yes, we rotate through 4-5 different sites including Georgetown Hospital, Washington Hospital Center, and some outpatient surgery centers. Variety is great for learning.</p>' },
    author: mockUsers.james,
    created: '2024-11-15T11:15:00',
    edited: false,
    reactions: { like: [mockUsers.sarah.id, mockUsers.mike.id, mockUsers.emily.id], love: [], laugh: [] },
    reaction_count: 3,
    reply_count: 0,
    mentions: [],
    media: []
  },
  {
    id: 5503,
    topic_id: 1002,
    parent_id: null,
    depth: 0,
    content: { rendered: '<p>How\'s the workload? I\'ve heard CRNA programs are intense. Do you have any life outside of school?</p>' },
    author: mockUsers.mike,
    created: '2024-11-15T14:00:00',
    edited: false,
    reactions: { like: [mockUsers.david.id], love: [], laugh: [mockUsers.james.id] },
    reaction_count: 2,
    reply_count: 1,
    mentions: [],
    media: []
  },
  {
    id: 5504,
    topic_id: 1002,
    parent_id: 5503,
    depth: 1,
    content: { rendered: '<p>It\'s definitely intense - won\'t sugarcoat it. First year is mostly didactic, lots of studying. Second year is clinical which is exhausting but amazing. I still manage to see friends occasionally and hit the gym. Time management is key!</p>' },
    author: mockUsers.james,
    created: '2024-11-15T15:30:00',
    edited: false,
    reactions: { like: [mockUsers.mike.id, mockUsers.sarah.id, mockUsers.ashley.id, mockUsers.currentUser.id], love: [], laugh: [] },
    reaction_count: 4,
    reply_count: 0,
    mentions: [],
    media: []
  },
  {
    id: 5505,
    topic_id: 1002,
    parent_id: null,
    depth: 0,
    content: { rendered: '<p>What made you choose Georgetown over other programs?</p>' },
    author: mockUsers.ashley,
    created: '2024-11-16T09:00:00',
    edited: false,
    reactions: { like: [mockUsers.emily.id], love: [], laugh: [] },
    reaction_count: 1,
    reply_count: 1,
    mentions: [],
    media: []
  },
  {
    id: 5506,
    topic_id: 1002,
    parent_id: 5505,
    depth: 1,
    content: { rendered: '<p>Few things: the faculty are incredibly supportive, the simulation lab is top-notch, and being in DC means access to amazing hospitals and networking opportunities. Plus I wanted to be on the East Coast near family.</p>' },
    author: mockUsers.james,
    created: '2024-11-16T10:45:00',
    edited: false,
    reactions: { like: [mockUsers.ashley.id, mockUsers.sarah.id, mockUsers.mike.id, mockUsers.david.id], love: [mockUsers.emily.id], laugh: [] },
    reaction_count: 5,
    reply_count: 0,
    mentions: [],
    media: []
  },
  {
    id: 5507,
    topic_id: 1002,
    parent_id: null,
    depth: 0,
    content: { rendered: '<p>This is so helpful! Following this thread. I\'m applying to Georgetown next cycle.</p>' },
    author: mockUsers.currentUser,
    created: '2024-12-01T08:30:00',
    edited: false,
    reactions: { like: [mockUsers.james.id, mockUsers.ashley.id], love: [], laugh: [] },
    reaction_count: 2,
    reply_count: 0,
    mentions: [],
    media: []
  }
];

// Replies for topic 2001 (Common interview questions)
export const mockRepliesTopic2001 = [
  {
    id: 6001,
    topic_id: 2001,
    parent_id: null,
    depth: 0,
    content: { rendered: '<p>Great list! I\'d add "What do you know about our program specifically?" - shows you did your research.</p>' },
    author: mockUsers.ashley,
    created: '2024-10-20T12:30:00',
    edited: false,
    reactions: { like: [mockUsers.mike.id, mockUsers.james.id], love: [], laugh: [] },
    reaction_count: 2,
    reply_count: 0,
    mentions: [],
    media: []
  },
  {
    id: 6002,
    topic_id: 2001,
    parent_id: null,
    depth: 0,
    content: { rendered: '<p>Also "Tell me about a time you advocated for a patient" - this one comes up a LOT.</p>' },
    author: mockUsers.james,
    created: '2024-10-20T15:00:00',
    edited: false,
    reactions: { like: [mockUsers.ashley.id, mockUsers.emily.id, mockUsers.david.id], love: [], laugh: [] },
    reaction_count: 3,
    reply_count: 0,
    mentions: [],
    media: []
  },
  {
    id: 6003,
    topic_id: 2001,
    parent_id: null,
    depth: 0,
    content: { rendered: '<p>Don\'t forget pharmacology questions! Know your ICU drips cold. Pressors, sedatives, paralytics, reversal agents.</p>' },
    author: mockUsers.emily,
    created: '2024-10-21T09:45:00',
    edited: false,
    reactions: { like: [mockUsers.mike.id], love: [], laugh: [] },
    reaction_count: 1,
    reply_count: 0,
    mentions: [],
    media: []
  },
  {
    id: 6004,
    topic_id: 2001,
    parent_id: null,
    depth: 0,
    content: { rendered: '<p>I was asked "What would you do if you disagreed with a physician\'s order?" - ethical/communication scenario.</p>' },
    author: mockUsers.david,
    created: '2024-10-22T11:00:00',
    edited: false,
    reactions: { like: [mockUsers.james.id, mockUsers.ashley.id], love: [], laugh: [] },
    reaction_count: 2,
    reply_count: 0,
    mentions: [],
    media: []
  },
  {
    id: 6005,
    topic_id: 2001,
    parent_id: null,
    depth: 0,
    content: { rendered: '<p>Thanks for adding these everyone! Updated my study sheet. This community is the best!</p>' },
    author: mockUsers.mike,
    created: '2024-10-22T14:30:00',
    edited: true,
    reactions: { like: [], love: [mockUsers.ashley.id, mockUsers.james.id, mockUsers.emily.id], laugh: [] },
    reaction_count: 3,
    reply_count: 0,
    mentions: [],
    media: []
  }
];

// Replies for topic 3002 (Just got accepted)
export const mockRepliesTopic3002 = [
  {
    id: 7001,
    topic_id: 3002,
    parent_id: null,
    depth: 0,
    content: { rendered: '<p>CONGRATULATIONS!!! 🎉🎊 You deserve this! Which program?</p>' },
    author: mockUsers.sarah,
    created: '2024-12-10T14:15:00',
    edited: false,
    reactions: { like: [mockUsers.mike.id], love: [], laugh: [] },
    reaction_count: 1,
    reply_count: 0,
    mentions: [],
    media: []
  },
  {
    id: 7002,
    topic_id: 3002,
    parent_id: null,
    depth: 0,
    content: { rendered: '<p>This gives me so much hope! I\'m on my second cycle. Congratulations!!!</p>' },
    author: mockUsers.emily,
    created: '2024-12-10T14:30:00',
    edited: false,
    reactions: { like: [mockUsers.mike.id, mockUsers.sarah.id], love: [], laugh: [] },
    reaction_count: 2,
    reply_count: 0,
    mentions: [],
    media: []
  },
  {
    id: 7003,
    topic_id: 3002,
    parent_id: null,
    depth: 0,
    content: { rendered: '<p>So happy for you! The persistence paid off. Go celebrate! 🍾</p>' },
    author: mockUsers.david,
    created: '2024-12-10T15:00:00',
    edited: false,
    reactions: { like: [mockUsers.mike.id], love: [], laugh: [] },
    reaction_count: 1,
    reply_count: 0,
    mentions: [],
    media: []
  },
  {
    id: 7004,
    topic_id: 3002,
    parent_id: null,
    depth: 0,
    content: { rendered: '<p>Incredible news! What do you think made the difference this cycle vs previous ones?</p>' },
    author: mockUsers.currentUser,
    created: '2024-12-10T16:45:00',
    edited: false,
    reactions: { like: [mockUsers.mike.id], love: [], laugh: [] },
    reaction_count: 1,
    reply_count: 1,
    mentions: [],
    media: []
  },
  {
    id: 7005,
    topic_id: 3002,
    parent_id: 7004,
    depth: 1,
    content: { rendered: '<p><span class="mention" data-user-id="999">@Sachi</span> honestly, I think it was a combination of things:</p><ol><li>More ICU experience (3 years vs 1.5)</li><li>Got my CCRN</li><li>Completely rewrote my personal statement to be more authentic</li><li>Did more shadowing hours</li><li>This community! The mock interviews and feedback were invaluable</li></ol>' },
    author: mockUsers.mike,
    created: '2024-12-10T18:00:00',
    edited: false,
    reactions: { like: [mockUsers.currentUser.id, mockUsers.sarah.id, mockUsers.emily.id, mockUsers.david.id], love: [mockUsers.james.id, mockUsers.ashley.id], laugh: [] },
    reaction_count: 6,
    reply_count: 0,
    mentions: [{ id: 999, name: 'Sachi' }],
    media: []
  }
];

// Map of topic ID to replies
export const mockRepliesByTopic = {
  1001: mockRepliesTopic1001,
  1002: mockRepliesTopic1002,
  2001: mockRepliesTopic2001,
  3002: mockRepliesTopic3002
};

// Get replies for a specific topic
export function getMockRepliesForTopic(topicId) {
  return mockRepliesByTopic[topicId] || [];
}

// Helper to build nested reply tree from flat array
export function buildReplyTree(replies) {
  const replyMap = new Map();
  const rootReplies = [];

  // First pass: create map of all replies
  replies.forEach(reply => {
    replyMap.set(reply.id, { ...reply, children: [] });
  });

  // Second pass: build tree structure
  replies.forEach(reply => {
    const node = replyMap.get(reply.id);
    if (reply.parent_id && replyMap.has(reply.parent_id)) {
      replyMap.get(reply.parent_id).children.push(node);
    } else {
      rootReplies.push(node);
    }
  });

  return rootReplies;
}

export default mockRepliesTopic1001;
