/**
 * Mock Intake Forms Data
 *
 * Service-specific intake form templates.
 * These define what information we collect from applicants
 * based on the type of service being booked.
 */

// Intake form configurations by service type
export const INTAKE_FORM_CONFIG = {
  mock_interview: {
    title: 'Mock Interview Details',
    fields: [
      {
        id: 'interviewType',
        type: 'select',
        label: 'Interview Format',
        required: true,
        options: [
          { value: 'traditional', label: 'Traditional Panel' },
          { value: 'mmi', label: 'MMI (Multiple Mini Interview)' },
          { value: 'behavioral', label: 'Behavioral/Situational' },
          { value: 'mixed', label: 'Mixed Format' }
        ]
      },
      {
        id: 'targetPrograms',
        type: 'multiselect',
        label: 'Target Programs',
        required: false,
        description: 'Select programs you\'re interviewing at',
        source: 'user_target_programs' // Pull from user's saved programs
      },
      {
        id: 'areasOfConcern',
        type: 'checkbox_group',
        label: 'Areas of Concern',
        required: false,
        options: [
          { value: 'behavioral_questions', label: 'Behavioral Questions' },
          { value: 'why_crna', label: '"Why CRNA?" Answer' },
          { value: 'technical_questions', label: 'Technical/Clinical Questions' },
          { value: 'program_specific', label: 'Program-Specific Questions' },
          { value: 'nerves_confidence', label: 'Nerves/Confidence' },
          { value: 'storytelling', label: 'Storytelling/Examples' }
        ]
      },
      {
        id: 'wantsRecording',
        type: 'checkbox',
        label: 'I\'d like a recording of my session to review later',
        required: false,
        default: false
      }
    ]
  },

  essay_review: {
    title: 'Essay Review Details',
    fields: [
      {
        id: 'documentType',
        type: 'select',
        label: 'Document Type',
        required: true,
        options: [
          { value: 'personal_statement', label: 'Personal Statement' },
          { value: 'secondary_essay', label: 'Secondary Essay' },
          { value: 'diversity_statement', label: 'Diversity Statement' },
          { value: 'other', label: 'Other Essay/Document' }
        ]
      },
      {
        id: 'draftStage',
        type: 'select',
        label: 'Draft Stage',
        required: true,
        options: [
          { value: 'first_draft', label: 'First Draft' },
          { value: 'revised', label: 'Revised Draft' },
          { value: 'near_final', label: 'Near Final' }
        ]
      },
      {
        id: 'feedbackType',
        type: 'select',
        label: 'Feedback Type',
        required: true,
        options: [
          { value: 'grammar_only', label: 'Grammar & Mechanics Only' },
          { value: 'story_structure', label: 'Story & Structure' },
          { value: 'full_developmental', label: 'Full Developmental Feedback' }
        ]
      },
      {
        id: 'deadline',
        type: 'date',
        label: 'Deadline',
        required: false,
        description: 'When do you need feedback by?'
      },
      {
        id: 'specificConcerns',
        type: 'textarea',
        label: 'Specific Concerns',
        required: false,
        placeholder: 'What specific areas would you like feedback on?'
      }
    ]
  },

  strategy_session: {
    title: 'Coaching Session Details',
    fields: [
      {
        id: 'currentStage',
        type: 'select',
        label: 'Where are you in your journey?',
        required: true,
        options: [
          { value: 'exploring', label: 'Just Exploring CRNA' },
          { value: 'building_prereqs', label: 'Building Prerequisites' },
          { value: 'gaining_experience', label: 'Gaining ICU Experience' },
          { value: 'ready_to_apply', label: 'Ready to Apply' },
          { value: 'application_in_progress', label: 'Application In Progress' }
        ]
      },
      {
        id: 'mainConcerns',
        type: 'checkbox_group',
        label: 'Main Concerns',
        required: false,
        options: [
          { value: 'timeline', label: 'Timeline Planning' },
          { value: 'school_selection', label: 'School Selection' },
          { value: 'gpa_improvement', label: 'GPA Improvement' },
          { value: 'icu_experience', label: 'ICU Experience' },
          { value: 'certifications', label: 'Certifications (CCRN, etc.)' },
          { value: 'extracurriculars', label: 'Extracurriculars/EQ' },
          { value: 'financial_planning', label: 'Financial Planning' },
          { value: 'work_life_balance', label: 'Work-Life Balance' }
        ]
      },
      {
        id: 'priorityQuestion',
        type: 'textarea',
        label: 'If I could walk away with clarity on ONE thing...',
        required: false,
        placeholder: 'What\'s the most important thing you want to figure out in this session?'
      }
    ]
  },

  school_qa: {
    title: 'Q&A Call Details',
    fields: [
      {
        id: 'topics',
        type: 'checkbox_group',
        label: 'Topics You\'d Like to Discuss',
        required: false,
        options: [
          { value: 'program_culture', label: 'Program Culture' },
          { value: 'clinical_rotations', label: 'Clinical Rotations' },
          { value: 'simulation_lab', label: 'Simulation Lab' },
          { value: 'housing', label: 'Housing/Living' },
          { value: 'cost_of_living', label: 'Cost of Living' },
          { value: 'class_schedule', label: 'Class Schedule' },
          { value: 'faculty', label: 'Faculty/Instructors' },
          { value: 'research', label: 'Research Opportunities' }
        ]
      },
      {
        id: 'questions',
        type: 'textarea',
        label: 'Your Questions',
        required: false,
        placeholder: 'List specific questions you\'d like answered...'
      }
    ]
  }
};

// Mock filled intake data for existing bookings
export const mockIntakeData = {
  booking_001: {
    interviewType: 'traditional',
    targetPrograms: ['Duke University', 'UNC Chapel Hill'],
    areasOfConcern: ['behavioral_questions', 'why_crna', 'program_specific'],
    wantsRecording: true
  },
  booking_002: {
    documentType: 'personal_statement',
    draftStage: 'first_draft',
    feedbackType: 'story_structure',
    specificConcerns: 'Looking for feedback on structure and the opening paragraph especially.'
  },
  booking_003: {
    currentStage: 'building_prereqs',
    mainConcerns: ['timeline', 'gpa_improvement', 'school_selection'],
    priorityQuestion: 'How do I balance working full-time while taking prerequisites?'
  }
};

// Helper: Get intake form config for service type
export function getIntakeFormConfig(serviceType) {
  return INTAKE_FORM_CONFIG[serviceType] || INTAKE_FORM_CONFIG.school_qa;
}

// Helper: Get intake data for a booking
export function getBookingIntakeData(bookingId) {
  return mockIntakeData[bookingId] || {};
}

// Helper: Validate intake data against config
export function validateIntakeData(serviceType, data) {
  const config = getIntakeFormConfig(serviceType);
  const errors = [];

  config.fields.forEach(field => {
    if (field.required && !data[field.id]) {
      errors.push({ field: field.id, message: `${field.label} is required` });
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}
