/**
 * Mock Milestones Data - Application Journey Milestones
 *
 * Based on the official CRNA Club milestone structure.
 * Each milestone contains sub-items with checkboxes, video links, and downloads.
 *
 * TODO: Replace with API calls to:
 * - GET /api/user/milestones (user's milestone progress)
 * - PATCH /api/user/milestones/:id/sub-items/:subId (update completion)
 */

export const mockMilestones = [
  {
    id: 1,
    title: "Understand the Profession + Early Prep",
    description: "Learn about the CRNA profession and prepare financially for your education",
    completed: false,
    order: 1,
    icon: "GraduationCap",
    subItems: [
      {
        id: "m1_s1",
        label: "Understand the CRNA role (vs AAs, MDAs)",
        completed: true,
        resources: [
          { type: "video", title: "PROFESSION OVERVIEW", url: "/lessons/profession-overview" },
          { type: "video", title: "AAS AND ANESTHESIOLOGISTS", url: "/lessons/aas-anesthesiologists" },
          { type: "video", title: "CRNA HISTORY + TYPES OF ANESTHESIA", url: "/lessons/crna-history" }
        ]
      },
      {
        id: "m1_s2",
        label: "Understand CRNA school costs & salary",
        completed: true,
        resources: [
          { type: "video", title: "SALARY", url: "/lessons/salary" },
          { type: "video", title: "TYPES OF LOANS", url: "/lessons/loans" },
          { type: "link", title: "Visit the Financial Planner Tool", url: "/tools/financial-planner" }
        ]
      },
      {
        id: "m1_s3",
        label: "For the Non-ICU RN or Nursing Student: Setting Yourself Up For Success",
        completed: false,
        resources: [
          { type: "video", title: "NURSING STUDENT ACCELERATOR", url: "/lessons/nursing-accelerator" }
        ]
      },
      {
        id: "m1_s4",
        label: "Review AANA Resources - Explore the American Association of Nurse Anesthetists website and resources",
        completed: false,
        resources: []
      },
      {
        id: "m1_s5",
        label: "Consider joining the AANA through the RN/APRN Membership",
        completed: false,
        resources: []
      },
      {
        id: "m1_s6",
        label: "Download the Notion Template if you prefer",
        completed: false,
        resources: []
      }
    ],
    metaFields: []
  },
  {
    id: 2,
    title: "Critical Care Experience",
    description: "Identify if your acuity is high enough, and start tracking your experiences",
    completed: false,
    order: 2,
    icon: "Stethoscope",
    subItems: [
      {
        id: "m2_s1",
        label: "Assess Your ICU Unit & Level of Acuity",
        completed: true,
        resources: [
          { type: "video", title: "PREFERRED ICU EXPERIENCE PART I", url: "/lessons/icu-experience-1" },
          { type: "video", title: "PREFERRED ICU EXPERIENCE PART II", url: "/lessons/icu-experience-2" }
        ]
      },
      {
        id: "m2_s2",
        label: "Begin Pharmacology Interview Prep",
        completed: false,
        resources: [
          { type: "download", title: "60+ ICU Drug Chart + Anki Decks", url: "/downloads/icu-drugs" },
          { type: "download", title: "Vasopressor Worksheets", url: "/downloads/vasopressor" }
        ]
      },
      {
        id: "m2_s3",
        label: "Start logging your Critical Care Experiences Tracker",
        completed: false,
        resources: []
      },
      {
        id: "m2_s4",
        label: "Starting logging in your Emotional Intelligence Tracker",
        completed: false,
        resources: []
      }
    ],
    metaFields: []
  },
  {
    id: 3,
    title: "GPA + Prerequisites",
    description: "Calculate your GPAs + Identify Courses to Take",
    completed: false,
    order: 3,
    icon: "Calculator",
    subItems: [
      {
        id: "m3_s1",
        label: "Request your Transcripts from all institutions",
        completed: true,
        resources: []
      },
      {
        id: "m3_s2",
        label: "Understand different GPA types (Last 60, Science, etc.) + Audit Your GPA & Transcript",
        completed: true,
        resources: [
          { type: "video", title: "TYPES OF GPA CALCULATION", url: "/lessons/gpa-types" }
        ]
      },
      {
        id: "m3_s3",
        label: "Calculate your types of GPAs (Overall, Science, Last 60, etc.)",
        completed: true,
        resources: [],
        metaField: "gpa_status"
      },
      {
        id: "m3_s4",
        label: "Audit Your Transcripts - Analyze your transcripts and see which courses you should consider retaking",
        completed: false,
        resources: []
      },
      {
        id: "m3_s5",
        label: "Determining Prerequisite Course Retakes - Should you re-take a course, take a graduate course, or do both?",
        completed: false,
        resources: [
          { type: "video", title: "RETAKING SCIENCE CLASSES", url: "/lessons/retaking-classes" },
          { type: "video", title: "PREREQUISITE LIVE CALL Q+A REPLAY", url: "/lessons/prereq-qa" }
        ]
      },
      {
        id: "m3_s6",
        label: "Visit the Prerequisite Library",
        completed: false,
        resources: []
      }
    ],
    metaFields: ["gpa_status"]
  },
  {
    id: 4,
    title: "Explore CRNA Programs",
    description: "Research different CRNA programs and understand the strategy behind picking schools",
    completed: true,
    order: 4,
    icon: "Search",
    subItems: [
      {
        id: "m4_s1",
        label: "Learn About Program Types (DNP vs DNAP vs PhD)",
        completed: true,
        resources: [
          { type: "video", title: "DNP VS. DNAP VS. PHD", url: "/lessons/program-types" },
          { type: "video", title: "FRONT-LOADED VS. INTEGRATED", url: "/lessons/program-structure" }
        ]
      },
      {
        id: "m4_s2",
        label: "Learn CRNA-Specific Terms & Requirements",
        completed: true,
        resources: [
          { type: "video", title: "TERMS TO KNOW", url: "/lessons/terms" },
          { type: "video", title: "ACCREDITATION AND RESUME", url: "/lessons/accreditation" },
          { type: "video", title: "PROGRAM REQUIREMENTS", url: "/lessons/requirements" }
        ]
      },
      {
        id: "m4_s3",
        label: "Save Your CRNA Programs",
        completed: true,
        resources: [],
        metaField: "program_exploration_status"
      },
      {
        id: "m4_s4",
        label: "Convert Your Saved Programs to Your Target Programs",
        completed: true,
        resources: []
      }
    ],
    metaFields: ["program_exploration_status"]
  },
  {
    id: 5,
    title: "Resume/CV",
    description: "Understand what goes on your resume early, even if you're not applying soon",
    completed: false,
    order: 5,
    icon: "FileText",
    subItems: [
      {
        id: "m5_s1",
        label: "Complete your first draft of your resume/cv",
        completed: false,
        resources: []
      },
      {
        id: "m5_s2",
        label: "Complete Your Resume / CV",
        completed: false,
        resources: [
          { type: "video", title: "RESUME BASICS - WHAT TO WRITE", url: "/lessons/resume-basics" },
          { type: "video", title: "COMMUNICATING VALUE ADD", url: "/lessons/value-add" },
          { type: "video", title: "KEY COMPONENTS + FORMATTING TIPS", url: "/lessons/formatting" },
          { type: "video", title: "RESUME REVIEW REPLAY (LIVE CALL)", url: "/lessons/resume-review" },
          { type: "download", title: "8-Pack Resume Templates + How To Guide", url: "/downloads/resume-templates" }
        ]
      }
    ],
    metaFields: []
  },
  {
    id: 6,
    title: "Anesthesia Events + Networking",
    description: "Early identification of networking events and meetings is key to your success",
    completed: true,
    order: 6,
    icon: "Users",
    subItems: [
      {
        id: "m6_s1",
        label: "Look into the AANA Annual Congress, Mid Year Assembly, or a State AANA Meetings",
        completed: true,
        resources: []
      },
      {
        id: "m6_s2",
        label: "Create Your RN Business Card",
        completed: true,
        resources: [
          { type: "download", title: "Business Card Templates", url: "/downloads/business-cards" }
        ]
      },
      {
        id: "m6_s3",
        label: "Attend an Anesthesia Networking Event (Mid-Year Assembly, AANA Congress)",
        completed: true,
        resources: [
          { type: "video", title: "MID-YEAR ASSEMBLY RECAP (2024)", url: "/lessons/midyear-2024" },
          { type: "video", title: "MID-YEAR ASSEMBLY RECAP (2023)", url: "/lessons/midyear-2023" }
        ]
      }
    ],
    metaFields: []
  },
  {
    id: 7,
    title: "Leadership + Community Involvement",
    description: "Leadership activities are key to your CRNA school application - don't wait till the last minute",
    completed: false,
    order: 7,
    icon: "Award",
    subItems: [
      {
        id: "m7_s1",
        label: "Assess current/past leadership skills",
        completed: true,
        resources: []
      },
      {
        id: "m7_s2",
        label: "Brainstorm potential additional leadership opportunities",
        completed: true,
        resources: [
          { type: "video", title: "Q+A with Faculty Member Dr. Temmermand", url: "/lessons/leadership-qa" }
        ]
      },
      {
        id: "m7_s3",
        label: "Volunteer Or Get Involved In Your Community",
        completed: false,
        resources: [],
        metaField: "volunteer_status"
      }
    ],
    metaFields: ["volunteer_status"]
  },
  {
    id: 8,
    title: "Certifications",
    description: "Certifications show that you're a high achiever and expert in your area of expertise",
    completed: false,
    order: 8,
    icon: "Medal",
    subItems: [
      {
        id: "m8_s1",
        label: "Learn About the CCRN (or other certifications)",
        completed: false,
        resources: [
          { type: "video", title: "CERTIFICATIONS + RESEARCH + LEADERSHIP", url: "/lessons/certifications" },
          { type: "video", title: "CCRN", url: "/lessons/ccrn" }
        ]
      },
      {
        id: "m8_s2",
        label: "Create your CCRN Study Plan",
        completed: false,
        resources: [
          { type: "download", title: "Done-For-You CCRN Study Plan", url: "/downloads/ccrn-plan" }
        ]
      },
      {
        id: "m8_s3",
        label: "Schedule Your CCRN (or others) exam date",
        completed: false,
        resources: []
      },
      {
        id: "m8_s4",
        label: "Purchase Your CCRN review course or books",
        completed: false,
        resources: []
      }
    ],
    metaFields: []
  },
  {
    id: 9,
    title: "GRE",
    description: "Learn about the GRE, plan your exam date, and determine if you should consider taking it",
    completed: false,
    order: 9,
    icon: "BookOpen",
    subItems: [
      {
        id: "m9_s1",
        label: "Learn About the GRE",
        completed: false,
        resources: [
          { type: "video", title: "ANESTHESIA-RELATED EXPERIENCES + GRE", url: "/lessons/gre-intro" },
          { type: "download", title: "Done-For-You GRE Study Plan", url: "/downloads/gre-plan" }
        ]
      },
      {
        id: "m9_s2",
        label: "Take A Practice Exam + See How Much You Need To Improve Your Score",
        completed: false,
        resources: []
      },
      {
        id: "m9_s3",
        label: "Create Your GRE Study Plan",
        completed: false,
        resources: []
      },
      {
        id: "m9_s4",
        label: "Schedule Your GRE Exam Date",
        completed: false,
        resources: []
      },
      {
        id: "m9_s5",
        label: "Take the GRE",
        completed: false,
        resources: []
      }
    ],
    metaFields: []
  },
  {
    id: 10,
    title: "Shadowing",
    description: "Identify how to find CRNAs to shadow, how to prepare, and what to bring/do",
    completed: false,
    order: 10,
    icon: "Eye",
    subItems: [
      {
        id: "m10_s1",
        label: "Reach Out for Shadowing Opportunities",
        completed: false,
        resources: [
          { type: "download", title: "Email Templates", url: "/downloads/shadow-email" }
        ]
      },
      {
        id: "m10_s2",
        label: "Prepare For Shadowing A Crna: Basics",
        completed: false,
        resources: [
          { type: "video", title: "PREPARING + THE DAY OF", url: "/lessons/shadow-prep" },
          { type: "video", title: "SHADOWING FAQS", url: "/lessons/shadow-faq" }
        ]
      },
      {
        id: "m10_s3",
        label: "Prepare for Shadow Day: Advanced",
        completed: false,
        resources: [
          { type: "video", title: "PREOPERATIVE ASSESSMENT", url: "/lessons/preop" },
          { type: "video", title: "ANESTHESIA WORKSTATION", url: "/lessons/workstation" },
          { type: "video", title: "AIRWAY SETUP + DEVICES", url: "/lessons/airway" },
          { type: "video", title: "INHALATIONAL AGENTS", url: "/lessons/inhalational" },
          { type: "video", title: "WHAT IS MAC?", url: "/lessons/mac" },
          { type: "video", title: "INTRODUCTION TO INDUCTION AGENTS", url: "/lessons/induction" }
        ]
      },
      {
        id: "m10_s4",
        label: "Prepare Your Shadow Day Questions",
        completed: false,
        resources: []
      },
      {
        id: "m10_s5",
        label: "Shadow a CRNA",
        completed: false,
        resources: [],
        metaField: "shadow_status"
      },
      {
        id: "m10_s6",
        label: "Journal Your Shadow Day(s) Insights",
        completed: false,
        resources: []
      }
    ],
    metaFields: ["shadow_status"]
  },
  {
    id: 11,
    title: "Personal Statement",
    description: "Learn about the Personal Statement / Essay",
    completed: false,
    order: 11,
    icon: "PenTool",
    subItems: [
      {
        id: "m11_s1",
        label: "Learn about the Personal Statement / Essay",
        completed: false,
        resources: [
          { type: "video", title: "CRNA SCHOOL ESSAY BASICS", url: "/lessons/essay-basics" },
          { type: "video", title: "ESSAY WRITING TIPS W/ CRNA SCHOOL FACULTY", url: "/lessons/essay-tips" },
          { type: "video", title: "MOST COMMON ESSAY PROMPTS + HOW TO ANSWER THEM", url: "/lessons/essay-prompts" },
          { type: "video", title: "WHY CRNA? W/ DR. CHARNELLE LEWIS", url: "/lessons/why-crna" },
          { type: "video", title: "ALL ABOUT THE DNP PROJECT WITH FACULTY DR. TEMMERMAND", url: "/lessons/dnp-project" },
          { type: "download", title: "The CRNA School Essay Workbook", url: "/downloads/essay-workbook" }
        ]
      },
      {
        id: "m11_s2",
        label: "Brainstorm Potential DNP Project Topics",
        completed: false,
        resources: [
          { type: "video", title: "ALL ABOUT THE DNP PROJECT WITH FACULTY DR. TEMMERMAND", url: "/lessons/dnp-project" }
        ]
      }
    ],
    metaFields: []
  },
  {
    id: 12,
    title: "Letters of Recommendation",
    description: "Learn about the Letters of Recommendation",
    completed: false,
    order: 12,
    icon: "Mail",
    subItems: [
      {
        id: "m12_s1",
        label: "Learn about the Letters of Recommendation",
        completed: false,
        resources: [
          { type: "video", title: "REFERENCES BASICS", url: "/lessons/references" },
          { type: "download", title: "Email Templates", url: "/downloads/lor-email" }
        ]
      },
      {
        id: "m12_s2",
        label: "Map out who you will ask for LORs for each application",
        completed: false,
        resources: []
      }
    ],
    metaFields: []
  },
  {
    id: 13,
    title: "Interview Preparation",
    description: "Learn About the Interview Process",
    completed: false,
    order: 13,
    icon: "MessageSquare",
    subItems: [
      {
        id: "m13_s1",
        label: "Learn About the Interview Process",
        completed: false,
        resources: [
          { type: "video", title: "GENERAL INTERVIEW PREP", url: "/lessons/interview-prep" },
          { type: "video", title: "INTERVIEW TIPS W/ PROFESSOR TEMMERMAND PART I", url: "/lessons/interview-tips-1" },
          { type: "video", title: "INTERVIEW TIPS W/ PROFESSOR TEMMERMAND PART II", url: "/lessons/interview-tips-2" }
        ]
      },
      {
        id: "m13_s2",
        label: "Begin Pharmacology Review",
        completed: false,
        resources: [
          { type: "video", title: "ANS + PHARM PART I W/ PROFESSOR TEMMERMAND", url: "/lessons/pharm-1" },
          { type: "video", title: "ANS + PHARM PART II W/ PROFESSOR TEMMERMAND", url: "/lessons/pharm-2" },
          { type: "download", title: "60+ ICU Drug Chart + Anki Decks", url: "/downloads/icu-drugs" },
          { type: "download", title: "Vasopressor Worksheets", url: "/downloads/vasopressor" },
          { type: "download", title: "75 Interview Questions", url: "/downloads/interview-questions" }
        ]
      },
      {
        id: "m13_s3",
        label: "Ensure you know about your program",
        completed: false,
        resources: []
      },
      {
        id: "m13_s4",
        label: "Brainstorm questions to ask faculty + SRNAs",
        completed: false,
        resources: []
      },
      {
        id: "m13_s5",
        label: "Pre-prepare your 'thank you' email to interviewers",
        completed: false,
        resources: []
      },
      {
        id: "m13_s6",
        label: "Brainstorm EQ question answers",
        completed: false,
        resources: []
      },
      {
        id: "m13_s7",
        label: "Begin Pathophysiology Review",
        completed: false,
        resources: [
          { type: "video", title: "PATHOPHYSIOLOGY", url: "/lessons/pathophysiology" }
        ]
      },
      {
        id: "m13_s8",
        label: "Refine Storytelling & Emotional Intelligence Responses",
        completed: false,
        resources: [
          { type: "video", title: "STORYTELLING BASICS", url: "/lessons/storytelling" },
          { type: "video", title: "EMOTIONAL INTELLIGENCE", url: "/lessons/eq" },
          { type: "video", title: "COMMUNICATIONS COACH MICHELLE MILLER (LIVE CALL REPLAY)", url: "/lessons/communications" }
        ]
      }
    ],
    metaFields: []
  }
];
