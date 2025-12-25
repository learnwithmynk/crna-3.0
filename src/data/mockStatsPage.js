/**
 * Mock Stats Page Data
 *
 * Additional mock data for the My Stats page including:
 * - User notes (personal, admin, mentor)
 * - Resume boosters
 * - Application materials status
 *
 * TODO: Replace with Supabase queries
 */

// ============================================
// USER NOTES
// ============================================

export const mockUserNotes = {
  userId: 'user_001',
  additionalInfo: 'Former flight nurse with 2 years experience before transitioning to ICU. Bilingual in Spanish - have used this extensively with patients. Completed a medical mission trip to Guatemala in 2023. Currently pursuing my CCRN-K certification.',
  privateNotes: 'Remember to follow up with Dr. Smith about LOR by Dec 15. Need to schedule shadow day at Duke before application deadline. Check if Georgetown requires CCRN or just eligible.',
  updatedAt: '2025-11-27T10:00:00Z',
};

export const mockAdminNotes = [
  {
    id: 'admin_note_001',
    userId: 'user_001',
    adminId: 'admin_001',
    adminName: 'Sarah Admin',
    adminAvatar: null,
    content: 'Strong candidate - very engaged in community. Check in about Georgetown application status. Mentioned interest in becoming a mentor after acceptance.',
    createdAt: '2025-11-20T00:00:00Z',
    updatedAt: '2025-11-20T00:00:00Z',
  },
  {
    id: 'admin_note_002',
    userId: 'user_001',
    adminId: 'admin_002',
    adminName: 'Mike Support',
    adminAvatar: null,
    content: 'Helped with transcript analyzer issue - resolved. Very polite and appreciative.',
    createdAt: '2025-11-15T00:00:00Z',
    updatedAt: '2025-11-15T00:00:00Z',
  },
];

export const mockMentorNotes = [
  {
    id: 'mentor_note_001',
    userId: 'user_001',
    mentorId: 'mentor_001',
    mentorName: 'Jennifer Williams, CRNA',
    mentorAvatar: null,
    content: 'Great questions during our mock interview session. Recommend focusing on "tell me about yourself" - tends to ramble. Strong clinical stories, just needs polish. Follow up in 2 weeks.',
    createdAt: '2025-11-25T00:00:00Z',
    updatedAt: '2025-11-25T00:00:00Z',
    isPrivate: true,
  },
  {
    id: 'mentor_note_002',
    userId: 'user_001',
    mentorId: 'mentor_002',
    mentorName: 'Robert Chen, CRNA',
    mentorAvatar: null,
    content: 'Essay review completed. Good structure but needs more specific examples. Sent marked-up version via email.',
    createdAt: '2025-11-18T00:00:00Z',
    updatedAt: '2025-11-18T00:00:00Z',
    isPrivate: true,
  },
];

// ============================================
// RESUME BOOSTERS
// ============================================

export const mockResumeBoosters = {
  userId: 'user_001',
  research: 'Co-authored poster presentation on early mobility protocols in the MICU, presented at our hospital\'s annual research symposium (2024). Currently participating in a unit-based quality improvement project on VAP prevention.',
  committees: 'Unit Practice Council member (2023-present), Code Blue Committee representative for night shift, Skin Care Committee.',
  volunteering: 'Medical mission trip to Guatemala with Remote Area Medical (2023) - provided basic health screenings and education. Monthly volunteer at local free clinic.',
  leadership: 'Charge nurse 2x per week since 2023. Preceptor for new graduate nurses - have oriented 4 new grads in the past year. Lead our unit\'s journal club.',
  publications: '',
  updatedAt: '2025-11-20T00:00:00Z',
};

// ============================================
// APPLICATION MATERIALS STATUS
// ============================================

export const mockApplicationMaterials = {
  userId: 'user_001',
  items: [
    { id: 'mat_1', name: 'Personal Statement', status: 'completed', notes: 'Final draft reviewed by mentor' },
    { id: 'mat_2', name: 'Resume/CV', status: 'completed', notes: 'Updated Nov 2024' },
    { id: 'mat_3', name: 'Transcripts Ordered', status: 'completed', notes: 'Official transcripts from ASU and Portage' },
    { id: 'mat_4', name: 'LOR #1 (Manager)', status: 'completed', notes: 'Received from Nurse Manager Smith' },
    { id: 'mat_5', name: 'LOR #2 (CRNA)', status: 'in_progress', notes: 'Requested from Jennifer Martinez' },
    { id: 'mat_6', name: 'LOR #3 (MD/Provider)', status: 'not_started', notes: 'Need to ask Dr. Patel' },
    { id: 'mat_7', name: 'CCRN Certification', status: 'completed', notes: 'Passed May 2023' },
    { id: 'mat_8', name: 'GRE Scores', status: 'completed', notes: 'Sent to all programs' },
  ],
};

// ============================================
// PROGRAM REQUIREMENT BENCHMARKS
// ============================================

// Average requirements across CRNA programs for comparison
export const programRequirementBenchmarks = {
  gpa: {
    scienceMinimum: 3.0,
    scienceCompetitive: 3.3,
    overallMinimum: 3.0,
    overallCompetitive: 3.5,
  },
  gre: {
    quantitativeMinimum: 150,
    quantitativeCompetitive: 155,
    verbalMinimum: 150,
    verbalCompetitive: 155,
    writingMinimum: 3.5,
    writingCompetitive: 4.0,
  },
  icuExperience: {
    minimumYears: 1,
    competitiveYears: 2,
    preferredYears: 3,
  },
  shadowHours: {
    minimum: 8,
    recommended: 24,
    strong: 40,
  },
  certifications: {
    required: ['ccrn', 'bls', 'acls'],
    preferred: ['pals', 'tncc'],
  },
};

// Percentage of programs requiring each prerequisite
export const prerequisiteRequirements = {
  anatomy: { required: 95, label: 'Anatomy' },
  physiology: { required: 95, label: 'Physiology' },
  general_chemistry: { required: 85, label: 'General Chemistry' },
  organic_chemistry: { required: 45, label: 'Organic Chemistry' },
  biochemistry: { required: 35, label: 'Biochemistry' },
  physics: { required: 25, label: 'Physics' },
  statistics: { required: 75, label: 'Statistics' },
  pharmacology: { required: 60, label: 'Pharmacology' },
  pathophysiology: { required: 50, label: 'Pathophysiology' },
  microbiology: { required: 40, label: 'Microbiology' },
  research: { required: 20, label: 'Research Methods' },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate application materials completion percentage
 */
export function calculateMaterialsProgress(materials) {
  if (!materials?.items?.length) return 0;

  const completed = materials.items.filter(m => m.status === 'completed').length;
  return Math.round((completed / materials.items.length) * 100);
}

/**
 * Get next action for application materials
 */
export function getNextMaterialAction(materials) {
  if (!materials?.items?.length) return null;

  const inProgress = materials.items.find(m => m.status === 'in_progress');
  if (inProgress) {
    return { item: inProgress, action: 'Continue working on' };
  }

  const notStarted = materials.items.find(m => m.status === 'not_started');
  if (notStarted) {
    return { item: notStarted, action: 'Start working on' };
  }

  return null;
}

/**
 * Check GPA against program requirements
 */
export function checkGpaRequirements(scienceGpa, overallGpa) {
  const benchmarks = programRequirementBenchmarks.gpa;

  return {
    scienceMeetsMinimum: scienceGpa >= benchmarks.scienceMinimum,
    scienceMeetsCompetitive: scienceGpa >= benchmarks.scienceCompetitive,
    overallMeetsMinimum: overallGpa >= benchmarks.overallMinimum,
    overallMeetsCompetitive: overallGpa >= benchmarks.overallCompetitive,
    // Estimate % of programs this GPA qualifies for
    estimatedProgramsQualified: calculateProgramsQualified(scienceGpa, overallGpa),
  };
}

/**
 * Estimate percentage of programs user qualifies for based on GPA
 */
function calculateProgramsQualified(scienceGpa, overallGpa) {
  // Simplified estimation based on typical distribution
  const avgGpa = (scienceGpa + overallGpa) / 2;

  if (avgGpa >= 3.8) return 98;
  if (avgGpa >= 3.5) return 90;
  if (avgGpa >= 3.3) return 78;
  if (avgGpa >= 3.0) return 60;
  if (avgGpa >= 2.8) return 30;
  return 10;
}

/**
 * Get missing prerequisites based on target programs
 */
export function getMissingPrerequisites(completedPrereqs, targetProgramCount = 2) {
  const completedTypes = new Set(completedPrereqs.map(p => p.courseType));
  const missing = [];

  // Check high-requirement prereqs first
  Object.entries(prerequisiteRequirements).forEach(([type, data]) => {
    if (!completedTypes.has(type) && data.required >= 50) {
      missing.push({
        type,
        label: data.label,
        percentRequired: data.required,
        urgency: data.required >= 80 ? 'high' : 'medium',
      });
    }
  });

  return missing.sort((a, b) => b.percentRequired - a.percentRequired);
}

export default {
  mockUserNotes,
  mockAdminNotes,
  mockMentorNotes,
  mockResumeBoosters,
  mockApplicationMaterials,
  programRequirementBenchmarks,
  prerequisiteRequirements,
};
