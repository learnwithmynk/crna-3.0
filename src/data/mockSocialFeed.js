/**
 * Mock Social Feed Data
 *
 * BuddyBoss-style activity feed for the Timeline section on Dashboard.
 * TODO: Replace with API calls to /buddyboss/v1/activity
 */

export const mockSocialPosts = [
  {
    id: 'post_001',
    type: 'activity_update',
    user: {
      id: 'user_456',
      name: 'ashley-h',
      avatar: 'https://ui-avatars.com/api/?name=Ashley+H&background=F7E547&color=000',
      memberType: 'Applicant'
    },
    content: `When I look back at my application cycle, the things that moved the needle *for me* weren't random extras, they were intentional choices I made that showed commitment, curiosity, and authenticity. These are the strategies that helped me stand out in a competitive applicant pool.

I Showed Up (Literally) to State Meetings & Seminars

I didn't wait...`,
    date: '2024-11-28T16:00:00Z',
    commentCount: 5,
    likeCount: 12,
    favorited: false,
    comments: [
      {
        id: 'comment_001',
        user: {
          id: 'user_789',
          name: 'jessica-m',
          avatar: 'https://ui-avatars.com/api/?name=Jessica+M&background=10B981&color=fff'
        },
        content: "This is so helpful! I've been wondering if state meetings are worth it.",
        date: '2024-11-28T16:15:00Z'
      },
      {
        id: 'comment_002',
        user: {
          id: 'user_321',
          name: 'michael-t',
          avatar: 'https://ui-avatars.com/api/?name=Michael+T&background=3B82F6&color=fff'
        },
        content: "Great advice about authenticity. That's what I needed to hear today!",
        date: '2024-11-28T16:30:00Z'
      }
    ]
  },
  {
    id: 'post_002',
    type: 'forum_topic',
    user: {
      id: 'user_987',
      name: 'david-r',
      avatar: 'https://ui-avatars.com/api/?name=David+R&background=A855F7&color=fff',
      memberType: 'SRNA'
    },
    content: "Just accepted an offer to provide mock interviews through the marketplace! Super excited to give back to the community. If you're looking for interview prep, reach out!",
    date: '2024-11-28T14:30:00Z',
    commentCount: 8,
    likeCount: 24,
    favorited: true,
    comments: []
  },
  {
    id: 'post_003',
    type: 'activity_update',
    user: {
      id: 'user_654',
      name: 'lauren-s',
      avatar: 'https://ui-avatars.com/api/?name=Lauren+S&background=EC4899&color=fff',
      memberType: 'Applicant'
    },
    content: 'Finally hit 2 years of ICU experience today! 🎉 Feeling one step closer to applying. Started using the clinical tracker and wow, it really puts things in perspective.',
    date: '2024-11-28T12:00:00Z',
    commentCount: 15,
    likeCount: 31,
    favorited: false,
    comments: []
  },
  {
    id: 'post_004',
    type: 'activity_update',
    user: {
      id: 'user_123',
      name: 'chris-p',
      avatar: 'https://ui-avatars.com/api/?name=Chris+P&background=F59E0B&color=fff',
      memberType: 'Applicant'
    },
    content: "Question for the group: Does anyone have experience with online anatomy prerequisites? I'm looking at BYU's program but curious about other options.",
    date: '2024-11-27T18:45:00Z',
    commentCount: 12,
    likeCount: 6,
    favorited: false,
    comments: []
  },
  {
    id: 'post_005',
    type: 'milestone_completed',
    user: {
      id: 'user_current',
      name: 'sachi',
      avatar: 'https://ui-avatars.com/api/?name=Sachi&background=F7E547&color=000',
      memberType: 'Applicant'
    },
    content: 'Completed milestone: Understand the Profession + Early Prep 🎯',
    date: '2024-11-27T15:20:00Z',
    commentCount: 3,
    likeCount: 8,
    favorited: false,
    milestone: {
      id: 1,
      title: 'Understand the Profession + Early Prep',
      icon: 'GraduationCap'
    },
    comments: []
  }
];

export const mockCurrentUser = {
  id: 'user_current',
  name: 'Sachi',
  avatar: 'https://ui-avatars.com/api/?name=Sachi&background=F7E547&color=000',
  memberType: 'Applicant'
};
