// Mock Topics Data
// Matches BuddyBoss REST API shape: GET /buddyboss/v1/topics
// TODO: Replace with API call to /buddyboss/v1/topics?forum_id=X

// Mock users for consistent references across topics
// Now includes role (admin, moderator, srna) and title for Circle.so-style display
const mockUsers = {
  sarah: {
    id: 101,
    name: 'SarahICU',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+ICU&background=F7E547&color=000',
    member_since: '2024-01-15',
    role: null, // Regular member
    title: 'ICU RN, Future CRNA'
  },
  mike: {
    id: 102,
    name: 'MikeRN_CVICU',
    avatar: 'https://ui-avatars.com/api/?name=Mike+RN&background=10B981&color=fff',
    member_since: '2023-11-20',
    role: 'moderator',
    title: 'CVICU RN, 5 Years Experience'
  },
  ashley: {
    id: 103,
    name: 'AshleyH',
    avatar: 'https://ui-avatars.com/api/?name=Ashley+H&background=8B5CF6&color=fff',
    member_since: '2024-03-08',
    role: null,
    title: 'ICU RN'
  },
  james: {
    id: 104,
    name: 'JamesSRNA',
    avatar: 'https://ui-avatars.com/api/?name=James+SRNA&background=EC4899&color=fff',
    member_since: '2023-06-01',
    role: 'srna',
    title: 'SRNA, Georgetown University'
  },
  emily: {
    id: 105,
    name: 'EmilyRN',
    avatar: 'https://ui-avatars.com/api/?name=Emily+RN&background=3B82F6&color=fff',
    member_since: '2024-05-12',
    role: null,
    title: 'MICU RN'
  },
  david: {
    id: 106,
    name: 'DavidMICU',
    avatar: 'https://ui-avatars.com/api/?name=David+MICU&background=F59E0B&color=000',
    member_since: '2024-02-28',
    role: null,
    title: 'MICU RN'
  },
  admin: {
    id: 100,
    name: 'CRNAClub',
    avatar: 'https://ui-avatars.com/api/?name=CRNA+Club&background=10B981&color=fff',
    member_since: '2020-01-01',
    role: 'admin',
    title: 'Community Admin'
  },
  currentUser: {
    id: 999,
    name: 'Sachi',
    avatar: 'https://ui-avatars.com/api/?name=Sachi&background=F7E547&color=000',
    member_since: '2024-06-01',
    role: null,
    title: 'ICU RN, Aspiring CRNA'
  }
};

export { mockUsers };

// Topics for Georgetown subforum (forum_id: 10)
// Now includes reactions object for "Liked by" display (matches reply structure)
export const mockTopicsGeorgetown = {
  topics: [
    {
      id: 1001,
      title: { rendered: 'Georgetown interview tips - Fall 2025 cycle?' },
      content: { rendered: '<p>Has anyone interviewed at Georgetown recently? I have my interview coming up in January and would love some tips on what to expect. I\'ve heard they do MMI format - can anyone confirm?</p>' },
      forum_id: 10,
      author: mockUsers.sarah,
      reply_count: 12,
      voice_count: 8,
      created: '2024-12-01T10:15:00',
      last_active: '2024-12-11T14:22:00',
      sticky: false,
      reactions: {
        like: [mockUsers.james, mockUsers.mike],
        love: [mockUsers.ashley, mockUsers.emily]
      }
    },
    {
      id: 1002,
      title: { rendered: 'Current Georgetown SRNA - AMA!' },
      content: { rendered: '<p>Hey everyone! I\'m a second-year SRNA at Georgetown. Happy to answer any questions about the program, curriculum, clinical sites, or DC life. Fire away!</p>' },
      forum_id: 10,
      author: mockUsers.james,
      reply_count: 7,
      voice_count: 6,
      created: '2024-11-15T09:00:00',
      last_active: '2024-12-12T08:30:00',
      sticky: true,
      reactions: {
        like: [mockUsers.sarah, mockUsers.mike, mockUsers.david],
        love: [mockUsers.ashley, mockUsers.emily, mockUsers.currentUser]
      }
    },
    {
      id: 1003,
      title: { rendered: 'Georgetown prereqs - Chem II required?' },
      content: { rendered: '<p>Quick question - does Georgetown require Chem II or just Chem I? Their website isn\'t super clear and I don\'t want to take an extra class if I don\'t need to.</p>' },
      forum_id: 10,
      author: mockUsers.emily,
      reply_count: 6,
      voice_count: 4,
      created: '2024-12-08T16:45:00',
      last_active: '2024-12-10T11:00:00',
      sticky: false,
      reactions: {
        like: [mockUsers.sarah, mockUsers.david]
      }
    },
    {
      id: 1004,
      title: { rendered: 'Georgetown vs Columbia - decision help!' },
      content: { rendered: '<p>I\'m incredibly fortunate to have been accepted to both Georgetown and Columbia. Anyone have experience with either program who can help me decide? Cost of living, clinical experiences, job placement after graduation?</p>' },
      forum_id: 10,
      author: mockUsers.ashley,
      reply_count: 18,
      voice_count: 12,
      created: '2024-12-05T14:30:00',
      last_active: '2024-12-11T19:45:00',
      sticky: false,
      reactions: {
        like: [mockUsers.james, mockUsers.mike, mockUsers.sarah],
        love: [mockUsers.emily, mockUsers.david],
        laugh: [mockUsers.admin, mockUsers.currentUser]
      }
    },
    {
      id: 1005,
      title: { rendered: 'Georgetown class size 2025' },
      content: { rendered: '<p>Does anyone know how many students Georgetown is accepting for Fall 2025? I\'m trying to gauge my chances.</p>' },
      forum_id: 10,
      author: mockUsers.david,
      reply_count: 8,
      voice_count: 5,
      created: '2024-12-10T08:00:00',
      last_active: '2024-12-11T16:30:00',
      sticky: false,
      reactions: {
        like: [mockUsers.sarah, mockUsers.emily, mockUsers.ashley]
      }
    }
  ],
  total: 45,
  total_pages: 3
};

// Topics for Interview Prep forum (forum_id: 6)
export const mockTopicsInterviewPrep = {
  topics: [
    {
      id: 2001,
      title: { rendered: 'Most common interview questions - master list' },
      content: { rendered: '<p>I\'ve compiled a list of the most commonly asked CRNA interview questions based on my research and talking to SRNAs. Let me know if I\'m missing any!</p><ul><li>Why do you want to be a CRNA?</li><li>Tell me about a difficult patient situation</li><li>What makes you stand out from other applicants?</li><li>Where do you see yourself in 5 years?</li><li>Describe a time you made a mistake</li></ul>' },
      forum_id: 6,
      author: mockUsers.mike,
      reply_count: 45,
      voice_count: 32,
      created: '2024-10-20T11:00:00',
      last_active: '2024-12-12T10:15:00',
      sticky: true,
      reactions: {
        like: [mockUsers.sarah, mockUsers.ashley, mockUsers.emily, mockUsers.david],
        love: [mockUsers.james, mockUsers.admin, mockUsers.currentUser]
      }
    },
    {
      id: 2002,
      title: { rendered: 'Looking for mock interview partner - December' },
      content: { rendered: '<p>I have interviews at Duke and Columbia in January. Looking for someone to practice with over Zoom. I can return the favor! DM me if interested.</p>' },
      forum_id: 6,
      author: mockUsers.ashley,
      reply_count: 7,
      voice_count: 5,
      created: '2024-12-09T15:30:00',
      last_active: '2024-12-11T20:00:00',
      sticky: false,
      reactions: {
        like: [mockUsers.sarah, mockUsers.emily, mockUsers.currentUser]
      }
    },
    {
      id: 2003,
      title: { rendered: 'What to wear to CRNA interview?' },
      content: { rendered: '<p>First interview next month! Is a full suit expected or is business casual okay? I\'m a guy if that matters.</p>' },
      forum_id: 6,
      author: mockUsers.david,
      reply_count: 15,
      voice_count: 11,
      created: '2024-12-07T09:15:00',
      last_active: '2024-12-10T14:45:00',
      sticky: false,
      reactions: {
        like: [mockUsers.mike, mockUsers.ashley],
        love: [mockUsers.sarah, mockUsers.james]
      }
    },
    {
      id: 2004,
      title: { rendered: 'MMI vs traditional interview - how to prepare differently?' },
      content: { rendered: '<p>Some schools do MMI format while others do traditional panel interviews. How should I adjust my preparation for each type?</p>' },
      forum_id: 6,
      author: mockUsers.sarah,
      reply_count: 12,
      voice_count: 9,
      created: '2024-12-06T13:00:00',
      last_active: '2024-12-11T08:30:00',
      sticky: false,
      reactions: {
        like: [mockUsers.mike, mockUsers.james, mockUsers.emily]
      }
    }
  ],
  total: 189,
  total_pages: 10
};

// Topics for General Discussion forum (forum_id: 9)
export const mockTopicsGeneral = {
  topics: [
    {
      id: 3001,
      title: { rendered: 'How do you balance ICU work with CRNA prep?' },
      content: { rendered: '<p>Between 3 12-hour shifts, studying for CCRN, taking prereqs, and trying to have a life... how is everyone managing? I feel like I\'m drowning. Any tips?</p>' },
      forum_id: 9,
      author: mockUsers.emily,
      reply_count: 28,
      voice_count: 19,
      created: '2024-12-04T18:00:00',
      last_active: '2024-12-12T07:00:00',
      sticky: false,
      reactions: {
        like: [mockUsers.sarah, mockUsers.ashley, mockUsers.david],
        love: [mockUsers.mike, mockUsers.currentUser]
      }
    },
    {
      id: 3002,
      title: { rendered: 'Just got accepted!! 🎉' },
      content: { rendered: '<p>After 2 years of preparation, 3 application cycles, and countless moments of doubt... I FINALLY got accepted to my dream program! Never give up, everyone. It\'s possible!</p>' },
      forum_id: 9,
      author: mockUsers.mike,
      reply_count: 42,
      voice_count: 35,
      created: '2024-12-10T14:00:00',
      last_active: '2024-12-12T09:30:00',
      sticky: false,
      reactions: {
        like: [mockUsers.sarah, mockUsers.ashley],
        love: [mockUsers.emily, mockUsers.david, mockUsers.james, mockUsers.admin, mockUsers.currentUser]
      }
    },
    {
      id: 3003,
      title: { rendered: 'Weekend thread - what are you working on?' },
      content: { rendered: '<p>Happy weekend everyone! What\'s on your CRNA prep agenda this weekend? I\'m finishing up my personal statement draft.</p>' },
      forum_id: 9,
      author: mockUsers.currentUser,
      reply_count: 16,
      voice_count: 12,
      created: '2024-12-07T08:00:00',
      last_active: '2024-12-08T22:00:00',
      sticky: false,
      reactions: {
        like: [mockUsers.mike, mockUsers.ashley, mockUsers.sarah, mockUsers.emily]
      }
    }
  ],
  total: 234,
  total_pages: 12
};

// Combined topics list for all forums (for search/recent activity)
export const mockAllTopics = [
  ...mockTopicsGeorgetown.topics,
  ...mockTopicsInterviewPrep.topics,
  ...mockTopicsGeneral.topics
].sort((a, b) => new Date(b.last_active) - new Date(a.last_active));

// Single topic detail (matches GET /buddyboss/v1/topics/:id)
// Note: Replies are included in topic detail but also available separately
export const mockTopicDetail = {
  id: 1001,
  title: { rendered: 'Georgetown interview tips - Fall 2025 cycle?' },
  content: { rendered: '<p>Has anyone interviewed at Georgetown recently? I have my interview coming up in January and would love some tips on what to expect. I\'ve heard they do MMI format - can anyone confirm?</p>' },
  forum_id: 10,
  forum_title: 'Georgetown',
  author: {
    ...mockUsers.sarah,
    post_count: 23,
    reply_count: 89
  },
  reply_count: 12,
  voice_count: 8,
  created: '2024-12-01T10:15:00',
  last_active: '2024-12-11T14:22:00',
  sticky: false,
  subscribed: true,
  replies: [], // Populated from mockReplies.js
  replies_total: 12,
  replies_pages: 1
};

export default mockTopicsGeorgetown;
