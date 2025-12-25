// Mock Forums Data
// Now generates program subforums from real schools data
// Each school gets a subforum under "CRNA Programs" with school_id link

import { schools } from './supabase/schools';

// Generate program subforums from schools data
// Each subforum uses the school's real ID for linking
const programSubforums = schools
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((school, index) => ({
    id: school.id,  // Use real school ID for linking
    school_id: school.id,
    title: { rendered: school.name },
    state: school.state,
    // Generate random-ish topic/reply counts for demo
    topic_count: Math.floor(Math.random() * 80) + 5,
    reply_count: Math.floor(Math.random() * 400) + 20,
  }));

// Calculate totals for CRNA Programs forum
const totalProgramTopics = programSubforums.reduce((sum, f) => sum + f.topic_count, 0);
const totalProgramReplies = programSubforums.reduce((sum, f) => sum + f.reply_count, 0);

export const mockForums = [
  {
    id: 1,
    title: { rendered: 'Introductions' },
    content: { rendered: '<p>Welcome to The CRNA Club! Introduce yourself and connect with fellow aspiring CRNAs.</p>' },
    parent: 0,
    topic_count: 156,
    reply_count: 892,
    last_active: '2024-12-11T18:30:00',
    sub_forums: []
  },
  {
    id: 2,
    slug: 'crna-programs',
    title: { rendered: 'CRNA Programs' },
    content: { rendered: '<p>Discuss specific CRNA programs, share experiences, and get insider tips from current students and graduates.</p>' },
    parent: 0,
    topic_count: totalProgramTopics,
    reply_count: totalProgramReplies,
    last_active: '2024-12-12T09:15:00',
    // All 150 schools as subforums!
    sub_forums: programSubforums
  },
  {
    id: 3,
    title: { rendered: 'Application Journey' },
    content: { rendered: '<p>Share your application timeline, ask questions about the process, and celebrate acceptances!</p>' },
    parent: 0,
    topic_count: 324,
    reply_count: 2156,
    last_active: '2024-12-12T10:45:00',
    sub_forums: [
      { id: 20, title: { rendered: 'Personal Statements' }, topic_count: 89, reply_count: 567 },
      { id: 21, title: { rendered: 'Letters of Recommendation' }, topic_count: 67, reply_count: 423 },
      { id: 22, title: { rendered: 'Application Timeline' }, topic_count: 78, reply_count: 512 },
      { id: 23, title: { rendered: 'Acceptance & Rejection' }, topic_count: 90, reply_count: 654 }
    ]
  },
  {
    id: 4,
    title: { rendered: 'Prerequisites' },
    content: { rendered: '<p>Discuss prerequisite courses, online options, GPA requirements, and study strategies.</p>' },
    parent: 0,
    topic_count: 198,
    reply_count: 1345,
    last_active: '2024-12-11T22:15:00',
    sub_forums: [
      { id: 30, title: { rendered: 'Chemistry' }, topic_count: 45, reply_count: 289 },
      { id: 31, title: { rendered: 'Statistics' }, topic_count: 32, reply_count: 198 },
      { id: 32, title: { rendered: 'Physics' }, topic_count: 28, reply_count: 167 },
      { id: 33, title: { rendered: 'Online Courses' }, topic_count: 93, reply_count: 691 }
    ]
  },
  {
    id: 5,
    title: { rendered: 'Critical Care Experience' },
    content: { rendered: '<p>Share tips on gaining ICU experience, discuss different unit types, and track your hours.</p>' },
    parent: 0,
    topic_count: 267,
    reply_count: 1823,
    last_active: '2024-12-12T07:30:00',
    sub_forums: [
      { id: 40, title: { rendered: 'MICU' }, topic_count: 56, reply_count: 378 },
      { id: 41, title: { rendered: 'SICU' }, topic_count: 48, reply_count: 312 },
      { id: 42, title: { rendered: 'CVICU' }, topic_count: 67, reply_count: 456 },
      { id: 43, title: { rendered: 'Neuro ICU' }, topic_count: 34, reply_count: 223 },
      { id: 44, title: { rendered: 'Travel Nursing' }, topic_count: 62, reply_count: 454 }
    ]
  },
  {
    id: 6,
    title: { rendered: 'Interview Prep' },
    content: { rendered: '<p>Prepare for your CRNA school interviews with tips, mock interview partners, and commonly asked questions.</p>' },
    parent: 0,
    topic_count: 189,
    reply_count: 1456,
    last_active: '2024-12-12T11:00:00',
    sub_forums: [
      { id: 50, title: { rendered: 'Common Questions' }, topic_count: 78, reply_count: 623 },
      { id: 51, title: { rendered: 'Mock Interview Partners' }, topic_count: 45, reply_count: 289 },
      { id: 52, title: { rendered: 'Interview Experiences' }, topic_count: 66, reply_count: 544 }
    ]
  },
  {
    id: 7,
    title: { rendered: 'Shadowing' },
    content: { rendered: '<p>Find shadowing opportunities, share experiences, and discuss what to look for during shadow days.</p>' },
    parent: 0,
    topic_count: 134,
    reply_count: 876,
    last_active: '2024-12-11T16:45:00',
    sub_forums: []
  },
  {
    id: 8,
    title: { rendered: 'Study Groups' },
    content: { rendered: '<p>Form study groups for certifications, prerequisites, or general CRNA preparation.</p>' },
    parent: 0,
    topic_count: 87,
    reply_count: 543,
    last_active: '2024-12-11T20:30:00',
    sub_forums: [
      { id: 60, title: { rendered: 'CCRN Study Group' }, topic_count: 45, reply_count: 312 },
      { id: 61, title: { rendered: 'Chemistry Study Group' }, topic_count: 22, reply_count: 134 },
      { id: 62, title: { rendered: 'Stats Study Group' }, topic_count: 20, reply_count: 97 }
    ]
  },
  {
    id: 9,
    title: { rendered: 'General Discussion' },
    content: { rendered: '<p>Off-topic conversations, life as a nurse, and anything else on your mind.</p>' },
    parent: 0,
    topic_count: 234,
    reply_count: 1567,
    last_active: '2024-12-12T08:00:00',
    sub_forums: []
  }
];

// Single forum detail (matches GET /buddyboss/v1/forums/:id)
export const mockForumDetail = {
  id: 2,
  slug: 'crna-programs',
  title: { rendered: 'CRNA Programs' },
  content: { rendered: '<p>Discuss specific CRNA programs, share experiences, and get insider tips from current students and graduates.</p>' },
  parent: 0,
  topic_count: totalProgramTopics,
  reply_count: totalProgramReplies,
  last_active: '2024-12-12T09:15:00',
  moderators: [
    { id: 1, name: 'Admin', avatar: 'https://ui-avatars.com/api/?name=Admin&background=F7E547&color=000' },
    { id: 2, name: 'Sarah SRNA', avatar: 'https://ui-avatars.com/api/?name=Sarah+SRNA&background=10B981&color=fff' }
  ],
  sub_forums: programSubforums
};

// Export schools for reference
export { schools as forumSchools };

export default mockForums;
