/**
 * Mock Prerequisite Courses & Reviews
 *
 * TODO: Replace with Supabase queries
 * - GET from prerequisites_courses table
 * - GET from prerequisites_reviews table
 * - User saved state from user_prerequisites table
 */

// Subject area options for filtering
export const SUBJECT_AREAS = [
  { key: "anatomy", label: "Anatomy" },
  { key: "anatomy_physiology", label: "Anatomy & Physiology" },
  { key: "biochemistry", label: "Biochemistry" },
  { key: "general_chemistry", label: "General Chemistry" },
  { key: "microbiology", label: "Microbiology" },
  { key: "organic_chemistry", label: "Organic Chemistry" },
  { key: "organic_biochem", label: "Organic & Biochem" },
  { key: "pathophysiology", label: "Pathophysiology" },
  { key: "pharmacology", label: "Pharmacology" },
  { key: "physics", label: "Physics" },
  { key: "physiology", label: "Physiology" },
  { key: "research", label: "Research" },
  { key: "statistics", label: "Statistics" },
];

// Education level options
export const EDUCATION_LEVELS = [
  { key: "undergraduate", label: "Undergraduate" },
  { key: "graduate", label: "Graduate" },
];

// Cost range options
export const COST_RANGES = [
  { key: "less_than_500", label: "Less than $500", display: "< $500" },
  { key: "500_to_1000", label: "$500 - $1,000", display: "$500-$1,000" },
  { key: "1000_to_2000", label: "$1,000 - $2,000", display: "$1,000-$2,000" },
  { key: "more_than_2000", label: "More than $2,000", display: "> $2,000" },
];

// Course format options
export const COURSE_FORMATS = [
  { key: "online_async", label: "Online (Self-Paced)" },
  { key: "online_sync", label: "Online (Live Sessions)" },
  { key: "in_person", label: "In-Person" },
  { key: "hybrid", label: "Hybrid" },
];

// Review tag taxonomy
export const REVIEW_TAGS = {
  format: [
    { key: "self_paced", label: "Self-Paced" },
    { key: "synchronous", label: "Live Sessions Required" },
    { key: "pre_recorded_lectures", label: "Pre-Recorded Lectures" },
  ],
  assessment: [
    { key: "exams_quizzes", label: "Exams/Quizzes" },
    { key: "proctored_exams", label: "Proctored Exams/Quizzes" },
    { key: "discussion_based", label: "Discussion-Based" },
    { key: "projects", label: "Projects/Papers" },
  ],
  time: [
    { key: "time_under_10hrs", label: "< 10 hrs/week" },
    { key: "time_10_to_15hrs", label: "10-15 hrs/week" },
    { key: "time_over_15hrs", label: "15+ hrs/week" },
  ],
  lab: [
    { key: "lab_included", label: "Lab Included" },
    { key: "lab_kit_required", label: "Lab Kit Required" },
    { key: "virtual_lab", label: "Virtual Lab Simulations" },
    { key: "no_lab", label: "No Lab Component" },
  ],
};

// Flatten all tags for easy lookup
export const ALL_REVIEW_TAGS = [
  ...REVIEW_TAGS.format,
  ...REVIEW_TAGS.assessment,
  ...REVIEW_TAGS.time,
  ...REVIEW_TAGS.lab,
];

// Mock courses data
export const mockPrerequisiteCourses = [
  // General Chemistry
  {
    id: "course_001",
    schoolName: "Geneva College Portage Learning",
    courseName: "CHEM103: General Chemistry I w/ Lab",
    courseUrl: "https://www.portagelearning.com/courses/science/chemistry-1",
    subject: "general_chemistry",
    level: "undergraduate",
    credits: 4,
    hasLab: true,
    labKitRequired: false,
    format: "online_async",
    selfPaced: true,
    courseLengthWeeks: 12,
    rollingAdmission: true,
    costRange: "$1,000-$2,000",
    costRangeKey: "1000_to_2000",
    averageRecommend: 4.0,
    averageEase: 5.0,
    reviewCount: 127,
    isSaved: false,
  },
  {
    id: "course_002",
    schoolName: "Thomas Edison State University",
    courseName: "CHE-121: General Chemistry I",
    courseUrl: "https://www.tesu.edu/courses",
    subject: "general_chemistry",
    level: "undergraduate",
    credits: 4,
    hasLab: true,
    labKitRequired: true,
    format: "online_async",
    selfPaced: true,
    courseLengthWeeks: 16,
    rollingAdmission: false,
    costRange: "$1,000-$2,000",
    costRangeKey: "1000_to_2000",
    averageRecommend: 3.8,
    averageEase: 3.5,
    reviewCount: 45,
    isSaved: false,
  },
  // Organic Chemistry
  {
    id: "course_003",
    schoolName: "Geneva College Portage Learning",
    courseName: "CHEM210: Organic Chemistry",
    courseUrl: "https://www.portagelearning.com/courses/science/organic-chemistry",
    subject: "organic_chemistry",
    level: "undergraduate",
    credits: 4,
    hasLab: true,
    labKitRequired: false,
    format: "online_async",
    selfPaced: true,
    courseLengthWeeks: 14,
    rollingAdmission: true,
    costRange: "$1,000-$2,000",
    costRangeKey: "1000_to_2000",
    averageRecommend: 4.2,
    averageEase: 2.8,
    reviewCount: 89,
    isSaved: true,
  },
  {
    id: "course_004",
    schoolName: "University of New England",
    courseName: "CHE 220: Organic Chemistry I",
    courseUrl: "https://online.une.edu/science/chemistry",
    subject: "organic_chemistry",
    level: "undergraduate",
    credits: 4,
    hasLab: true,
    labKitRequired: true,
    format: "online_async",
    selfPaced: false,
    courseLengthWeeks: 16,
    rollingAdmission: false,
    costRange: "> $2,000",
    costRangeKey: "more_than_2000",
    averageRecommend: 4.5,
    averageEase: 2.5,
    reviewCount: 34,
    isSaved: false,
  },
  // Anatomy
  {
    id: "course_005",
    schoolName: "Geneva College Portage Learning",
    courseName: "BIOL201: Human Anatomy",
    courseUrl: "https://www.portagelearning.com/courses/science/anatomy",
    subject: "anatomy",
    level: "undergraduate",
    credits: 3,
    hasLab: true,
    labKitRequired: false,
    format: "online_async",
    selfPaced: true,
    courseLengthWeeks: 10,
    rollingAdmission: true,
    costRange: "$500-$1,000",
    costRangeKey: "500_to_1000",
    averageRecommend: 4.3,
    averageEase: 4.2,
    reviewCount: 156,
    isSaved: false,
  },
  {
    id: "course_006",
    schoolName: "Arizona State University",
    courseName: "BIO 201: Human Anatomy and Physiology I",
    courseUrl: "https://asuonline.asu.edu",
    subject: "anatomy_physiology",
    level: "undergraduate",
    credits: 4,
    hasLab: true,
    labKitRequired: true,
    format: "online_sync",
    selfPaced: false,
    courseLengthWeeks: 15,
    rollingAdmission: false,
    costRange: "$1,000-$2,000",
    costRangeKey: "1000_to_2000",
    averageRecommend: 4.0,
    averageEase: 3.0,
    reviewCount: 78,
    isSaved: false,
  },
  // Physiology
  {
    id: "course_007",
    schoolName: "Geneva College Portage Learning",
    courseName: "BIOL202: Human Physiology",
    courseUrl: "https://www.portagelearning.com/courses/science/physiology",
    subject: "physiology",
    level: "undergraduate",
    credits: 3,
    hasLab: true,
    labKitRequired: false,
    format: "online_async",
    selfPaced: true,
    courseLengthWeeks: 10,
    rollingAdmission: true,
    costRange: "$500-$1,000",
    costRangeKey: "500_to_1000",
    averageRecommend: 4.4,
    averageEase: 3.8,
    reviewCount: 142,
    isSaved: true,
  },
  // Statistics
  {
    id: "course_008",
    schoolName: "Geneva College Portage Learning",
    courseName: "CNSL503: Statistics",
    courseUrl: "https://www.portagelearning.com/courses/math/statistics",
    subject: "statistics",
    level: "graduate",
    credits: 3,
    hasLab: false,
    labKitRequired: false,
    format: "online_async",
    selfPaced: true,
    courseLengthWeeks: 8,
    rollingAdmission: true,
    costRange: "$500-$1,000",
    costRangeKey: "500_to_1000",
    averageRecommend: 5.0,
    averageEase: 5.0,
    reviewCount: 203,
    isSaved: false,
  },
  {
    id: "course_009",
    schoolName: "Straighterline",
    courseName: "MAT250: Introduction to Statistics",
    courseUrl: "https://www.straighterline.com/courses/statistics",
    subject: "statistics",
    level: "undergraduate",
    credits: 3,
    hasLab: false,
    labKitRequired: false,
    format: "online_async",
    selfPaced: true,
    courseLengthWeeks: 6,
    rollingAdmission: true,
    costRange: "< $500",
    costRangeKey: "less_than_500",
    averageRecommend: 3.5,
    averageEase: 4.5,
    reviewCount: 67,
    isSaved: false,
  },
  // Microbiology
  {
    id: "course_010",
    schoolName: "Geneva College Portage Learning",
    courseName: "BIOL230: Microbiology",
    courseUrl: "https://www.portagelearning.com/courses/science/microbiology",
    subject: "microbiology",
    level: "undergraduate",
    credits: 4,
    hasLab: true,
    labKitRequired: false,
    format: "online_async",
    selfPaced: true,
    courseLengthWeeks: 12,
    rollingAdmission: true,
    costRange: "$1,000-$2,000",
    costRangeKey: "1000_to_2000",
    averageRecommend: 4.1,
    averageEase: 3.9,
    reviewCount: 98,
    isSaved: false,
  },
  // Biochemistry
  {
    id: "course_011",
    schoolName: "University of New England",
    courseName: "BIO 380: Biochemistry",
    courseUrl: "https://online.une.edu/science/biochemistry",
    subject: "biochemistry",
    level: "undergraduate",
    credits: 4,
    hasLab: true,
    labKitRequired: true,
    format: "online_async",
    selfPaced: false,
    courseLengthWeeks: 16,
    rollingAdmission: false,
    costRange: "> $2,000",
    costRangeKey: "more_than_2000",
    averageRecommend: 4.3,
    averageEase: 2.2,
    reviewCount: 29,
    isSaved: false,
  },
  {
    id: "course_012",
    schoolName: "Geneva College Portage Learning",
    courseName: "CHEM220: Organic & Biochemistry",
    courseUrl: "https://www.portagelearning.com/courses/science/organic-biochemistry",
    subject: "organic_biochem",
    level: "undergraduate",
    credits: 4,
    hasLab: true,
    labKitRequired: false,
    format: "online_async",
    selfPaced: true,
    courseLengthWeeks: 14,
    rollingAdmission: true,
    costRange: "$1,000-$2,000",
    costRangeKey: "1000_to_2000",
    averageRecommend: 4.0,
    averageEase: 3.5,
    reviewCount: 56,
    isSaved: false,
  },
  // Pathophysiology
  {
    id: "course_013",
    schoolName: "Thomas Edison State University",
    courseName: "NUR-6400: Advanced Pathophysiology",
    courseUrl: "https://www.tesu.edu/courses",
    subject: "pathophysiology",
    level: "graduate",
    credits: 3,
    hasLab: false,
    labKitRequired: false,
    format: "online_async",
    selfPaced: false,
    courseLengthWeeks: 10,
    rollingAdmission: false,
    costRange: "$1,000-$2,000",
    costRangeKey: "1000_to_2000",
    averageRecommend: 4.0,
    averageEase: 5.0,
    reviewCount: 41,
    isSaved: false,
  },
  // Physics
  {
    id: "course_014",
    schoolName: "Straighterline",
    courseName: "PHY250: Introduction to Physics",
    courseUrl: "https://www.straighterline.com/courses/physics",
    subject: "physics",
    level: "undergraduate",
    credits: 4,
    hasLab: true,
    labKitRequired: false,
    format: "online_async",
    selfPaced: true,
    courseLengthWeeks: 8,
    rollingAdmission: true,
    costRange: "< $500",
    costRangeKey: "less_than_500",
    averageRecommend: 3.2,
    averageEase: 3.8,
    reviewCount: 23,
    isSaved: false,
  },
  {
    id: "course_015",
    schoolName: "Arizona State University",
    courseName: "PHY 111: General Physics I",
    courseUrl: "https://asuonline.asu.edu",
    subject: "physics",
    level: "undergraduate",
    credits: 4,
    hasLab: true,
    labKitRequired: true,
    format: "online_sync",
    selfPaced: false,
    courseLengthWeeks: 15,
    rollingAdmission: false,
    costRange: "$1,000-$2,000",
    costRangeKey: "1000_to_2000",
    averageRecommend: 4.1,
    averageEase: 2.8,
    reviewCount: 37,
    isSaved: false,
  },
  // Pharmacology
  {
    id: "course_016",
    schoolName: "Nurse.com",
    courseName: "PHARM-501: Advanced Pharmacology",
    courseUrl: "https://www.nurse.com/courses",
    subject: "pharmacology",
    level: "graduate",
    credits: 3,
    hasLab: false,
    labKitRequired: false,
    format: "online_async",
    selfPaced: true,
    courseLengthWeeks: 8,
    rollingAdmission: true,
    costRange: "$500-$1,000",
    costRangeKey: "500_to_1000",
    averageRecommend: 3.8,
    averageEase: 4.2,
    reviewCount: 52,
    isSaved: false,
  },
  // Research
  {
    id: "course_017",
    schoolName: "Chamberlain University",
    courseName: "NR-500: Foundational Concepts in Nursing Research",
    courseUrl: "https://www.chamberlain.edu",
    subject: "research",
    level: "graduate",
    credits: 3,
    hasLab: false,
    labKitRequired: false,
    format: "online_async",
    selfPaced: false,
    courseLengthWeeks: 8,
    rollingAdmission: true,
    costRange: "$1,000-$2,000",
    costRangeKey: "1000_to_2000",
    averageRecommend: 3.5,
    averageEase: 4.0,
    reviewCount: 31,
    isSaved: false,
  },
  // More varied courses
  {
    id: "course_018",
    schoolName: "Oakton Community College",
    courseName: "BIO 231: Human Anatomy",
    courseUrl: "https://www.oakton.edu",
    subject: "anatomy",
    level: "undergraduate",
    credits: 4,
    hasLab: true,
    labKitRequired: false,
    format: "in_person",
    selfPaced: false,
    courseLengthWeeks: 16,
    rollingAdmission: false,
    costRange: "< $500",
    costRangeKey: "less_than_500",
    averageRecommend: 4.6,
    averageEase: 3.2,
    reviewCount: 18,
    isSaved: false,
  },
  {
    id: "course_019",
    schoolName: "Oregon State University",
    courseName: "CH 231: General Chemistry",
    courseUrl: "https://ecampus.oregonstate.edu",
    subject: "general_chemistry",
    level: "undergraduate",
    credits: 4,
    hasLab: true,
    labKitRequired: true,
    format: "online_async",
    selfPaced: false,
    courseLengthWeeks: 11,
    rollingAdmission: false,
    costRange: "$1,000-$2,000",
    costRangeKey: "1000_to_2000",
    averageRecommend: 4.2,
    averageEase: 3.0,
    reviewCount: 42,
    isSaved: false,
  },
  {
    id: "course_020",
    schoolName: "Study.com",
    courseName: "Biology 105: Anatomy & Physiology",
    courseUrl: "https://study.com/academy/course/anatomy-and-physiology.html",
    subject: "anatomy_physiology",
    level: "undergraduate",
    credits: 3,
    hasLab: false,
    labKitRequired: false,
    format: "online_async",
    selfPaced: true,
    courseLengthWeeks: 4,
    rollingAdmission: true,
    costRange: "< $500",
    costRangeKey: "less_than_500",
    averageRecommend: 2.8,
    averageEase: 5.0,
    reviewCount: 15,
    isSaved: false,
  },
];

// Mock reviews data
export const mockPrerequisiteReviews = [
  // Reviews for course_001 (Portage Gen Chem)
  {
    id: "review_001",
    courseId: "course_001",
    userId: "user_001",
    userNickname: "FutureCRNA2025",
    recommend: 4,
    ease: 5,
    reviewText: "Great course for working nurses! Self-paced format allowed me to complete it while working full-time nights. The virtual labs were comprehensive and the instructors responded quickly to questions.",
    tags: ["self_paced", "pre_recorded_lectures", "time_under_10hrs", "virtual_lab"],
    createdAt: "2024-10-16",
  },
  {
    id: "review_002",
    courseId: "course_001",
    userId: "user_002",
    userNickname: "ICURNtoSRNA",
    recommend: 4,
    ease: 5,
    reviewText: "Highly recommend for anyone needing to knock out prerequisites quickly. The content is thorough but manageable.",
    tags: ["self_paced", "exams_quizzes", "time_under_10hrs"],
    createdAt: "2024-09-28",
  },
  {
    id: "review_003",
    courseId: "course_001",
    userId: "user_003",
    userNickname: "NurseAnesthesiaGoals",
    recommend: 4,
    ease: 4,
    reviewText: "Solid course. Accepted by all the programs I applied to. Make sure to read the textbook chapters thoroughly.",
    tags: ["self_paced", "exams_quizzes", "time_10_to_15hrs", "lab_included"],
    createdAt: "2024-08-15",
  },
  // Reviews for course_003 (Portage Organic Chem)
  {
    id: "review_004",
    courseId: "course_003",
    userId: "user_004",
    userNickname: "CRNAbound2024",
    recommend: 5,
    ease: 2,
    reviewText: "Challenging but doable. This is organic chemistry after all - don't expect it to be easy. The instructors are helpful and the material prepares you well for interviews.",
    tags: ["self_paced", "exams_quizzes", "proctored_exams", "time_10_to_15hrs", "virtual_lab"],
    createdAt: "2024-11-01",
  },
  {
    id: "review_005",
    courseId: "course_003",
    userId: "user_005",
    userNickname: "MICUtoANesthesia",
    recommend: 4,
    ease: 3,
    reviewText: "Hard but fair. Take your time with this one. I spent about 15 hours a week and got an A. Georgetown accepted it no problem.",
    tags: ["self_paced", "exams_quizzes", "time_10_to_15hrs", "lab_included"],
    createdAt: "2024-10-05",
  },
  // Reviews for course_005 (Portage Anatomy)
  {
    id: "review_006",
    courseId: "course_005",
    userId: "user_006",
    userNickname: "CVICUnurse",
    recommend: 5,
    ease: 4,
    reviewText: "Perfect for refreshing A&P knowledge. The virtual cadaver lab is excellent and really helps visualize structures.",
    tags: ["self_paced", "pre_recorded_lectures", "time_under_10hrs", "virtual_lab"],
    createdAt: "2024-09-20",
  },
  {
    id: "review_007",
    courseId: "course_005",
    userId: "user_007",
    userNickname: "SRNAhopeful",
    recommend: 4,
    ease: 4,
    reviewText: "Straightforward course. Good for anyone who needs anatomy credit. Finished in 6 weeks while working.",
    tags: ["self_paced", "exams_quizzes", "time_under_10hrs"],
    createdAt: "2024-08-30",
  },
  // Reviews for course_008 (Portage Statistics - Graduate)
  {
    id: "review_008",
    courseId: "course_008",
    userId: "user_008",
    userNickname: "NightShiftRN",
    recommend: 5,
    ease: 5,
    reviewText: "Easiest prerequisite I've ever taken. If you're intimidated by statistics, this is the course for you. Very manageable workload.",
    tags: ["self_paced", "exams_quizzes", "time_under_10hrs", "no_lab"],
    createdAt: "2024-11-10",
  },
  {
    id: "review_009",
    courseId: "course_008",
    userId: "user_009",
    userNickname: "DukeOrBust",
    recommend: 5,
    ease: 5,
    reviewText: "Cannot recommend this enough. Graduate level credit, accepted everywhere, and very doable. Finished in 4 weeks.",
    tags: ["self_paced", "exams_quizzes", "time_under_10hrs"],
    createdAt: "2024-10-22",
  },
  {
    id: "review_010",
    courseId: "course_008",
    userId: "user_010",
    userNickname: "CriticalCareRN",
    recommend: 5,
    ease: 5,
    reviewText: "Best kept secret for CRNA prereqs. Quick, cheap, and every program I applied to accepted it.",
    tags: ["self_paced", "time_under_10hrs", "no_lab"],
    createdAt: "2024-09-15",
  },
  // Reviews for course_004 (UNE Organic Chemistry)
  {
    id: "review_011",
    courseId: "course_004",
    userId: "user_011",
    userNickname: "NeuroICURN",
    recommend: 5,
    ease: 2,
    reviewText: "Rigorous but excellent. The lab kit is extensive and the experiments really reinforce the concepts. Universally accepted by all programs.",
    tags: ["pre_recorded_lectures", "proctored_exams", "time_over_15hrs", "lab_kit_required"],
    createdAt: "2024-10-30",
  },
  {
    id: "review_012",
    courseId: "course_004",
    userId: "user_012",
    userNickname: "TraumaRNtoCRNA",
    recommend: 4,
    ease: 3,
    reviewText: "Expensive but worth it if you want the gold standard. The lab component is thorough and the professors are engaged.",
    tags: ["synchronous", "proctored_exams", "time_10_to_15hrs", "lab_kit_required"],
    createdAt: "2024-09-08",
  },
  // Reviews for course_006 (ASU A&P)
  {
    id: "review_013",
    courseId: "course_006",
    userId: "user_013",
    userNickname: "SICUnurse",
    recommend: 4,
    ease: 3,
    reviewText: "Good course but requires attending live sessions which can be tough for night shift nurses. Content is solid.",
    tags: ["synchronous", "exams_quizzes", "time_10_to_15hrs", "lab_kit_required"],
    createdAt: "2024-10-12",
  },
  // Reviews for course_007 (Portage Physiology)
  {
    id: "review_014",
    courseId: "course_007",
    userId: "user_014",
    userNickname: "CardiacRN2025",
    recommend: 5,
    ease: 4,
    reviewText: "Excellent physiology course. Really helped me understand concepts I use daily in the ICU at a deeper level.",
    tags: ["self_paced", "pre_recorded_lectures", "time_under_10hrs", "virtual_lab"],
    createdAt: "2024-11-05",
  },
  {
    id: "review_015",
    courseId: "course_007",
    userId: "user_015",
    userNickname: "FutureSRNA",
    recommend: 4,
    ease: 4,
    reviewText: "Great follow-up to the anatomy course. The instructors explain complex concepts clearly.",
    tags: ["self_paced", "exams_quizzes", "time_10_to_15hrs"],
    createdAt: "2024-08-22",
  },
  // Reviews for course_010 (Portage Microbiology)
  {
    id: "review_016",
    courseId: "course_010",
    userId: "user_016",
    userNickname: "ICUcharge",
    recommend: 4,
    ease: 4,
    reviewText: "Interesting content and well-organized. The virtual labs cover all the key concepts without needing physical supplies.",
    tags: ["self_paced", "exams_quizzes", "time_under_10hrs", "virtual_lab"],
    createdAt: "2024-09-30",
  },
  // Reviews for course_011 (UNE Biochemistry)
  {
    id: "review_017",
    courseId: "course_011",
    userId: "user_017",
    userNickname: "CVICUtoSRNA",
    recommend: 4,
    ease: 2,
    reviewText: "Definitely the hardest prerequisite I took. But it's UNE - accepted everywhere. Plan for 20+ hours a week.",
    tags: ["pre_recorded_lectures", "proctored_exams", "time_over_15hrs", "lab_kit_required"],
    createdAt: "2024-10-18",
  },
  // Reviews for course_013 (TESU Pathophysiology)
  {
    id: "review_018",
    courseId: "course_013",
    userId: "user_018",
    userNickname: "NightOwlRN",
    recommend: 4,
    ease: 5,
    reviewText: "Graduate level patho that's actually manageable. Great for working nurses. Content is clinically relevant.",
    tags: ["self_paced", "discussion_based", "time_under_10hrs", "no_lab"],
    createdAt: "2024-09-25",
  },
  // Reviews for course_016 (Nurse.com Pharmacology)
  {
    id: "review_019",
    courseId: "course_016",
    userId: "user_019",
    userNickname: "MICURNbound",
    recommend: 4,
    ease: 4,
    reviewText: "Good pharm course that covers the essentials. Self-paced works well for busy schedules.",
    tags: ["self_paced", "exams_quizzes", "time_under_10hrs", "no_lab"],
    createdAt: "2024-10-08",
  },
  // Reviews for course_009 (Straighterline Statistics)
  {
    id: "review_020",
    courseId: "course_009",
    userId: "user_020",
    userNickname: "BudgetCRNA",
    recommend: 3,
    ease: 5,
    reviewText: "Cheap and easy but check if your programs accept it first. Not all do. Great for a quick prereq check.",
    tags: ["self_paced", "exams_quizzes", "time_under_10hrs", "no_lab"],
    createdAt: "2024-08-10",
  },
  // Reviews for course_002 (TESU Gen Chem)
  {
    id: "review_021",
    courseId: "course_002",
    userId: "user_021",
    userNickname: "ERtoCRNA",
    recommend: 4,
    ease: 3,
    reviewText: "Solid chemistry course. The lab kit is comprehensive. Took me about 12 weeks to complete.",
    tags: ["self_paced", "exams_quizzes", "time_10_to_15hrs", "lab_kit_required"],
    createdAt: "2024-09-18",
  },
  // Reviews for course_015 (ASU Physics)
  {
    id: "review_022",
    courseId: "course_015",
    userId: "user_022",
    userNickname: "PhysicsStruggles",
    recommend: 4,
    ease: 3,
    reviewText: "Challenging but the professors are helpful. Live sessions required which was tough with my schedule.",
    tags: ["synchronous", "proctored_exams", "time_10_to_15hrs", "lab_kit_required"],
    createdAt: "2024-10-25",
  },
  // Reviews for course_018 (Oakton CC Anatomy)
  {
    id: "review_023",
    courseId: "course_018",
    userId: "user_023",
    userNickname: "ChicagoRN",
    recommend: 5,
    ease: 3,
    reviewText: "Best in-person anatomy course in the Chicago area. Real cadaver lab experience is invaluable. Worth the commute.",
    tags: ["synchronous", "exams_quizzes", "time_10_to_15hrs", "lab_included"],
    createdAt: "2024-11-02",
  },
  // Reviews for course_019 (Oregon State Gen Chem)
  {
    id: "review_024",
    courseId: "course_019",
    userId: "user_024",
    userNickname: "PacificNWnurse",
    recommend: 4,
    ease: 3,
    reviewText: "Good option for those on the West Coast. Accepted by all programs I researched. Quarter system moves fast.",
    tags: ["pre_recorded_lectures", "proctored_exams", "time_10_to_15hrs", "lab_kit_required"],
    createdAt: "2024-09-12",
  },
  // More reviews for popular courses
  {
    id: "review_025",
    courseId: "course_001",
    userId: "user_025",
    userNickname: "NurseLife",
    recommend: 4,
    ease: 5,
    reviewText: "Exactly what I needed. Affordable, self-paced, and widely accepted. Completed it in 8 weeks.",
    tags: ["self_paced", "exams_quizzes", "time_under_10hrs", "virtual_lab"],
    createdAt: "2024-07-20",
  },
  {
    id: "review_026",
    courseId: "course_003",
    userId: "user_026",
    userNickname: "OrganicOChem",
    recommend: 4,
    ease: 2,
    reviewText: "Tough course but Portage explains it well. Get a molecular model kit - it helps a lot!",
    tags: ["self_paced", "proctored_exams", "time_over_15hrs", "virtual_lab"],
    createdAt: "2024-06-15",
  },
  {
    id: "review_027",
    courseId: "course_008",
    userId: "user_027",
    userNickname: "StatsWizard",
    recommend: 5,
    ease: 5,
    reviewText: "If you need graduate stats, this is the one. Super manageable and accepted by literally every program.",
    tags: ["self_paced", "exams_quizzes", "time_under_10hrs", "no_lab"],
    createdAt: "2024-08-05",
  },
  {
    id: "review_028",
    courseId: "course_005",
    userId: "user_028",
    userNickname: "AnatomyAce",
    recommend: 4,
    ease: 5,
    reviewText: "Easy A if you put in the work. The content is presented clearly and the exams are fair.",
    tags: ["self_paced", "exams_quizzes", "time_under_10hrs", "virtual_lab"],
    createdAt: "2024-07-28",
  },
  {
    id: "review_029",
    courseId: "course_007",
    userId: "user_029",
    userNickname: "PhysioNerd",
    recommend: 5,
    ease: 3,
    reviewText: "More challenging than anatomy but the knowledge is so applicable. Helped me in interviews too.",
    tags: ["self_paced", "exams_quizzes", "time_10_to_15hrs", "virtual_lab"],
    createdAt: "2024-09-02",
  },
  {
    id: "review_030",
    courseId: "course_010",
    userId: "user_030",
    userNickname: "MicrobiologyMaster",
    recommend: 4,
    ease: 4,
    reviewText: "Good course. The virtual labs are surprisingly good. Finished faster than expected.",
    tags: ["self_paced", "exams_quizzes", "time_under_10hrs", "virtual_lab"],
    createdAt: "2024-08-18",
  },
];

// Helper functions

/**
 * Get all courses with optional filters
 */
export function getCourses(filters = {}) {
  let filtered = [...mockPrerequisiteCourses];

  if (filters.subject) {
    filtered = filtered.filter(c => c.subject === filters.subject);
  }

  if (filters.subjects && filters.subjects.length > 0) {
    filtered = filtered.filter(c => filters.subjects.includes(c.subject));
  }

  if (filters.level) {
    filtered = filtered.filter(c => c.level === filters.level);
  }

  if (filters.savedOnly) {
    filtered = filtered.filter(c => c.isSaved);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(c =>
      c.courseName.toLowerCase().includes(searchLower) ||
      c.schoolName.toLowerCase().includes(searchLower) ||
      c.subject.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
}

/**
 * Get reviews for a specific course
 */
export function getReviewsForCourse(courseId) {
  return mockPrerequisiteReviews.filter(r => r.courseId === courseId);
}

/**
 * Get a single course by ID with its reviews
 */
export function getCourseWithReviews(courseId) {
  const course = mockPrerequisiteCourses.find(c => c.id === courseId);
  if (!course) return null;

  const reviews = getReviewsForCourse(courseId);

  // Calculate rating distribution
  const ratingDistribution = {
    5: reviews.filter(r => r.recommend === 5).length,
    4: reviews.filter(r => r.recommend === 4).length,
    3: reviews.filter(r => r.recommend === 3).length,
    2: reviews.filter(r => r.recommend === 2).length,
    1: reviews.filter(r => r.recommend === 1).length,
  };

  return {
    ...course,
    reviews,
    ratingDistribution,
  };
}

// NOTE: Removed getCoursesForTargetPrograms, getHighYieldCourses, and getPopularCoursesForProgram
// These used fabricated "acceptedByPrograms" and "popularWithApplicantsTo" data.
// In the future, this data will be collected via user reviews (programsRequiring field)
// and aggregated to power "applicants to [School X] took these courses" recommendations.

/**
 * Get tag label from key
 */
export function getTagLabel(tagKey) {
  const tag = ALL_REVIEW_TAGS.find(t => t.key === tagKey);
  return tag ? tag.label : tagKey;
}

/**
 * Get subject label from key
 */
export function getSubjectLabel(subjectKey) {
  const subject = SUBJECT_AREAS.find(s => s.key === subjectKey);
  return subject ? subject.label : subjectKey;
}
