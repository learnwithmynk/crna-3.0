/**
 * Mock Prerequisite Course Submissions
 *
 * Mock data for admin moderation of user-submitted prerequisite courses.
 * TODO: Replace with Supabase queries to prerequisite_courses table
 */

export const COURSE_SUBMISSION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const mockCourseSubmissions = [
  // Pending submissions
  {
    id: 'sub_001',
    schoolName: 'University of Phoenix',
    courseName: 'CHM 101: General Chemistry I',
    courseCode: 'CHM101',
    courseUrl: 'https://www.phoenix.edu/courses/chm101',
    subject: 'general_chemistry',
    level: 'undergraduate',
    credits: 4,
    format: 'online_async',
    costRange: '$1,000-$2,000',
    costRangeKey: '1000_to_2000',
    courseLengthWeeks: 8,
    hasLab: true,
    labKitRequired: true,
    selfPaced: false,
    rollingAdmission: true,
    status: 'pending',
    submittedBy: {
      id: 'user_001',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      avatarUrl: null,
    },
    submittedAt: '2024-12-15T10:30:00Z',
    firstReview: {
      recommendScore: 4,
      easeScore: 3,
      tags: ['self_paced', 'proctored_exams', 'lab_kit_required'],
      reviewText: 'Great course with flexible scheduling. The lab kit arrives quickly and the proctored exams are fair. Professor was responsive to questions.',
    },
  },
  {
    id: 'sub_002',
    schoolName: 'Portage Learning',
    courseName: 'BIOL 210: Anatomy & Physiology I',
    courseCode: 'BIOL210',
    courseUrl: 'https://www.portagelearning.com/courses/anatomy-physiology-1',
    subject: 'anatomy_physiology',
    level: 'undergraduate',
    credits: 4,
    format: 'online_async',
    costRange: '$1,000-$2,000',
    costRangeKey: '1000_to_2000',
    courseLengthWeeks: 12,
    hasLab: true,
    labKitRequired: false,
    selfPaced: true,
    rollingAdmission: true,
    status: 'pending',
    submittedBy: {
      id: 'user_002',
      name: 'Michael Chen',
      email: 'mchen@example.com',
      avatarUrl: null,
    },
    submittedAt: '2024-12-14T15:45:00Z',
    firstReview: {
      recommendScore: 5,
      easeScore: 2,
      tags: ['self_paced', 'heavy_reading', 'virtual_lab'],
      reviewText: 'Excellent content but very demanding. The virtual labs are comprehensive. Be prepared to spend 15+ hours per week. Highly recommend for serious students.',
    },
  },
  {
    id: 'sub_003',
    schoolName: 'UCSD Extension',
    courseName: 'BILD 1: Cell Biology',
    courseCode: 'BILD1',
    courseUrl: 'https://extension.ucsd.edu/courses/bild1',
    subject: 'biology',
    level: 'undergraduate',
    credits: 4,
    format: 'hybrid',
    costRange: '$500-$1,000',
    costRangeKey: '500_to_1000',
    courseLengthWeeks: 10,
    hasLab: true,
    labKitRequired: false,
    selfPaced: false,
    rollingAdmission: false,
    status: 'pending',
    submittedBy: {
      id: 'user_003',
      name: 'Emily Rodriguez',
      email: 'emily.r@example.com',
      avatarUrl: null,
    },
    submittedAt: '2024-12-13T09:20:00Z',
    firstReview: {
      recommendScore: 4,
      easeScore: 4,
      tags: ['synchronous', 'discussion_based', 'lab_included'],
      reviewText: 'Really enjoyed this course. The hybrid format works well - online lectures with in-person labs. Great for those near San Diego.',
    },
  },

  // Approved submissions
  {
    id: 'sub_004',
    schoolName: 'Straighterline',
    courseName: 'SCI 201: General Chemistry with Lab',
    courseCode: 'SCI201',
    courseUrl: 'https://www.straighterline.com/courses/general-chemistry',
    subject: 'general_chemistry',
    level: 'undergraduate',
    credits: 4,
    format: 'online_async',
    costRange: '$500-$1,000',
    costRangeKey: '500_to_1000',
    courseLengthWeeks: null,
    hasLab: true,
    labKitRequired: true,
    selfPaced: true,
    rollingAdmission: true,
    status: 'approved',
    submittedBy: {
      id: 'user_004',
      name: 'David Kim',
      email: 'dkim@example.com',
      avatarUrl: null,
    },
    submittedAt: '2024-12-10T14:00:00Z',
    approvedAt: '2024-12-11T10:30:00Z',
    approvedBy: { id: 'admin_001', name: 'Admin User' },
    firstReview: {
      recommendScore: 5,
      easeScore: 4,
      tags: ['self_paced', 'lab_kit_required'],
      reviewText: 'Best value for the price. Completely self-paced so you can finish as fast as you want. Lab kit is high quality.',
    },
  },
  {
    id: 'sub_005',
    schoolName: 'Colorado State University Global',
    courseName: 'STAT 201: Principles of Statistics',
    courseCode: 'STAT201',
    courseUrl: 'https://csuglobal.edu/courses/stat201',
    subject: 'statistics',
    level: 'undergraduate',
    credits: 3,
    format: 'online_async',
    costRange: '$1,000-$2,000',
    costRangeKey: '1000_to_2000',
    courseLengthWeeks: 8,
    hasLab: false,
    labKitRequired: false,
    selfPaced: false,
    rollingAdmission: true,
    status: 'approved',
    submittedBy: {
      id: 'user_005',
      name: 'Jessica Taylor',
      email: 'jtaylor@example.com',
      avatarUrl: null,
    },
    submittedAt: '2024-12-08T11:15:00Z',
    approvedAt: '2024-12-09T09:00:00Z',
    approvedBy: { id: 'admin_001', name: 'Admin User' },
    firstReview: {
      recommendScore: 4,
      easeScore: 3,
      tags: ['pre_recorded_lectures', 'proctored_exams'],
      reviewText: 'Solid statistics course. Weekly assignments keep you on track. Final exam is proctored but fair.',
    },
  },

  // Rejected submissions
  {
    id: 'sub_006',
    schoolName: 'Local Community College',
    courseName: 'CHEM 100',
    courseCode: 'CHEM100',
    courseUrl: '',
    subject: 'general_chemistry',
    level: 'undergraduate',
    credits: 4,
    format: 'in_person',
    costRange: 'Less than $500',
    costRangeKey: 'less_than_500',
    courseLengthWeeks: 16,
    hasLab: true,
    labKitRequired: false,
    selfPaced: false,
    rollingAdmission: false,
    status: 'rejected',
    submittedBy: {
      id: 'user_006',
      name: 'John Smith',
      email: 'jsmith@example.com',
      avatarUrl: null,
    },
    submittedAt: '2024-12-05T16:30:00Z',
    rejectedAt: '2024-12-06T10:00:00Z',
    rejectedBy: { id: 'admin_001', name: 'Admin User' },
    rejectionReason: 'Please provide the specific name of the institution (e.g., "Miami Dade College" rather than "Local Community College"). Also, a course URL is required for verification.',
    firstReview: null,
  },
  {
    id: 'sub_007',
    schoolName: 'Unknown Online School',
    courseName: 'Chemistry Fast Track',
    courseCode: null,
    courseUrl: 'https://sketchy-site.com/chemistry',
    subject: 'general_chemistry',
    level: 'undergraduate',
    credits: 4,
    format: 'online_async',
    costRange: 'Less than $500',
    costRangeKey: 'less_than_500',
    courseLengthWeeks: 2,
    hasLab: false,
    labKitRequired: false,
    selfPaced: true,
    rollingAdmission: true,
    status: 'rejected',
    submittedBy: {
      id: 'user_007',
      name: 'Anonymous User',
      email: 'anon@example.com',
      avatarUrl: null,
    },
    submittedAt: '2024-12-04T08:00:00Z',
    rejectedAt: '2024-12-04T14:00:00Z',
    rejectedBy: { id: 'admin_001', name: 'Admin User' },
    rejectionReason: 'This institution is not accredited and the course does not meet CRNA program prerequisites. Please submit courses from regionally accredited institutions only.',
    firstReview: null,
  },
];

/**
 * Get all course submissions
 */
export function getAllCourseSubmissions() {
  return mockCourseSubmissions;
}

/**
 * Get course submissions by status
 */
export function getCourseSubmissionsByStatus(status) {
  return mockCourseSubmissions.filter(s => s.status === status);
}

/**
 * Get counts by status
 */
export function getCourseSubmissionCounts() {
  const all = mockCourseSubmissions;
  return {
    total: all.length,
    pending: all.filter(s => s.status === COURSE_SUBMISSION_STATUS.PENDING).length,
    approved: all.filter(s => s.status === COURSE_SUBMISSION_STATUS.APPROVED).length,
    rejected: all.filter(s => s.status === COURSE_SUBMISSION_STATUS.REJECTED).length,
  };
}

/**
 * Approve a course submission (mock)
 */
export function approveCourseSubmission(submissionId) {
  const submission = mockCourseSubmissions.find(s => s.id === submissionId);
  if (submission) {
    submission.status = COURSE_SUBMISSION_STATUS.APPROVED;
    submission.approvedAt = new Date().toISOString();
    submission.approvedBy = { id: 'admin_001', name: 'Admin User' };
    return { success: true, submission };
  }
  return { success: false, error: 'Submission not found' };
}

/**
 * Reject a course submission (mock)
 */
export function rejectCourseSubmission(submissionId, reason) {
  const submission = mockCourseSubmissions.find(s => s.id === submissionId);
  if (submission) {
    submission.status = COURSE_SUBMISSION_STATUS.REJECTED;
    submission.rejectedAt = new Date().toISOString();
    submission.rejectedBy = { id: 'admin_001', name: 'Admin User' };
    submission.rejectionReason = reason;
    return { success: true, submission };
  }
  return { success: false, error: 'Submission not found' };
}

export default mockCourseSubmissions;
