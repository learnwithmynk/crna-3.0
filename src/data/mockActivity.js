/**
 * Mock Activity & Events Data
 *
 * TODO: Replace with API calls to:
 * - GET /api/user/events (upcoming saved events)
 * - GET /api/user/activity (timeline/activity feed)
 * - GET /api/community/discussions (recent forum activity)
 * - GET /api/user/prerequisites (saved courses)
 */

// Upcoming Events
export const mockUpcomingEvents = [
  {
    id: "event_001",
    title: "TXWes CRNA Online Information Session VII",
    date: "2025-12-17T13:00:00Z",
    category: "info_session",
    location: "Online",
    saved: true,
    registrationUrl: "https://example.com/register"
  },
  {
    id: "event_002",
    title: "AANA Mid-Year Assembly",
    date: "2025-05-20T09:00:00Z",
    category: "aana_national_meeting",
    location: "Washington, DC",
    saved: true
  }
];

// Recent Forum Discussions
export const mockRecentDiscussions = [
  {
    id: "topic_001",
    title: "Georgetown vs Cedar Crest - Help Me Decide!",
    forumName: "Program Comparisons",
    authorName: "FutureCRNA",
    lastActivity: "2025-11-27T10:30:00Z",
    replyCount: 12,
    participated: true
  },
  {
    id: "topic_002",
    title: "CCRN Study Tips - What Worked for You?",
    forumName: "Certifications",
    authorName: "ICUNurse2024",
    lastActivity: "2025-11-26T15:45:00Z",
    replyCount: 8,
    participated: false
  },
  {
    id: "topic_003",
    title: "Shadow Day Etiquette - First Timer!",
    forumName: "Shadowing",
    authorName: "NewApplicant",
    lastActivity: "2025-11-25T09:15:00Z",
    replyCount: 15,
    participated: true
  }
];

// Activity Timeline (BuddyBoss style)
export const mockActivityFeed = [
  {
    id: "activity_001",
    type: "milestone_completed",
    timestamp: "2025-11-28T08:00:00Z",
    content: {
      milestone: "Convert a Target Program",
      points: 50
    }
  },
  {
    id: "activity_002",
    type: "clinical_entry",
    timestamp: "2025-11-27T14:30:00Z",
    content: {
      entryCount: 1,
      populations: ["cardiac"]
    }
  },
  {
    id: "activity_003",
    type: "forum_comment",
    timestamp: "2025-11-27T10:30:00Z",
    content: {
      topicTitle: "Georgetown vs Cedar Crest - Help Me Decide!",
      topicId: "topic_001"
    }
  },
  {
    id: "activity_004",
    type: "program_saved",
    timestamp: "2025-11-26T16:20:00Z",
    content: {
      programName: "Bellarmine University"
    }
  },
  {
    id: "activity_005",
    type: "badge_earned",
    timestamp: "2025-11-25T12:00:00Z",
    content: {
      badgeName: "Target Trailblazer",
      points: 100
    }
  }
];

// Saved Prerequisites
export const mockSavedPrerequisites = [
  {
    id: "prereq_001",
    courseName: "Organic Chemistry I",
    schoolName: "Portage Learning",
    courseCode: "CHEM 210",
    completed: true,
    grade: "A",
    year: 2019
  },
  {
    id: "prereq_002",
    courseName: "Advanced Pathophysiology",
    schoolName: "Portage Learning",
    courseCode: "NURS 530",
    completed: true,
    grade: "A",
    year: 2020
  },
  {
    id: "prereq_003",
    courseName: "Statistics for Healthcare",
    schoolName: "Straighterline",
    courseCode: "MATH 250",
    completed: true,
    grade: "A",
    year: 2018
  },
  {
    id: "prereq_004",
    courseName: "Biochemistry",
    schoolName: "UNE Online",
    courseCode: "CHEM 315",
    completed: false,
    grade: null,
    year: null,
    saved: true
  }
];

// Calendar Events (for CalendarWidget)
export const mockCalendarEvents = [
  {
    id: "cal_001",
    title: "TXWes CRNA Online Information Session",
    date: "2025-12-17T13:00:00Z",
    type: "crna_club", // Yellow
    url: "/events/cal_001"
  },
  {
    id: "cal_002",
    title: "AANA Mid-Year Assembly",
    date: "2025-12-20T09:00:00Z",
    type: "saved", // Blue
    url: "/events/cal_002"
  },
  {
    id: "cal_003",
    title: "Mock Interview with Sarah M.",
    date: "2025-12-05T14:00:00Z",
    type: "marketplace", // Purple
    url: "/my-bookings/cal_003"
  },
  {
    id: "cal_004",
    title: "Georgetown Application Deadline",
    date: "2025-12-15T23:59:00Z",
    type: "saved",
    url: "/my-programs/prog_001"
  },
  {
    id: "cal_005",
    title: "CRNA Club Live Q&A: Interview Tips",
    date: "2025-12-10T19:00:00Z",
    type: "crna_club",
    url: "/events/cal_005"
  },
  {
    id: "cal_006",
    title: "Essay Review Session",
    date: "2025-12-08T10:00:00Z",
    type: "marketplace",
    url: "/my-bookings/cal_006"
  },
  {
    id: "cal_007",
    title: "Rush University Info Session",
    date: "2025-12-12T12:00:00Z",
    type: "crna_club",
    url: "/events/cal_007"
  },
  {
    id: "cal_008",
    title: "Shadow Day - Local Hospital",
    date: "2025-12-18T06:00:00Z",
    type: "saved",
    url: "#"
  }
];

// Quick Links Data
export const mockQuickLinks = [
  {
    id: "link_001",
    title: "My Documents",
    description: "Transcripts, essays, resume",
    icon: "FileText",
    href: "/documents",
    count: 5
  },
  {
    id: "link_002",
    title: "Financial Planner",
    description: "Budget for CRNA school",
    icon: "DollarSign",
    href: "/tools/financial-planner",
    external: true
  },
  {
    id: "link_003",
    title: "GPA Calculator",
    description: "Calculate your science GPA",
    icon: "Calculator",
    href: "/tools/gpa-calculator",
    external: true
  }
];
