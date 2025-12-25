/**
 * My Stats Page (Optimized for Mentor Review)
 *
 * Comprehensive applicant snapshot/visual resume with:
 * - Profile completion indicator (3-action threshold for 20 pts)
 * - Target Programs pills at top
 * - Hero section with avatar + level ring
 * - Academic details (GPAs, Prerequisites, GRE, Certifications)
 * - Clinical experience (simplified)
 * - Shadowing (simplified)
 * - Events
 * - Leadership, Research, Community sections
 * - Notes in sidebar (desktop) or bottom (mobile)
 * - Sticky sidebar with ReadyScore + Priority Actions + Notes
 *
 * Removed: EQ section (not needed for mentor review)
 */

import React, { useState, useRef } from 'react';
import { PageWrapper, PageHeader } from '@/components/layout/page-wrapper';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Dialogs
import { ChecklistSyncDialog } from '@/components/features/programs/ChecklistSyncDialog';

// Stats components
import { StatsHeroSection } from '@/components/features/stats/StatsHeroSection';
import { AcademicDetailsSection } from '@/components/features/stats/AcademicDetailsSection';
import { PrerequisitesSubCard } from '@/components/features/stats/PrerequisitesSubCard';
import { ClinicalExperienceSection } from '@/components/features/stats/ClinicalExperienceSection';
import { LeadershipSection } from '@/components/features/stats/LeadershipSection';
import { ResearchCommunitySection } from '@/components/features/stats/ResearchCommunitySection';
import { StatsSidebar } from '@/components/features/stats/StatsSidebar';
import { ShadowSummaryCard } from '@/components/features/stats/ShadowSummaryCard';
import { EventsSummaryCard } from '@/components/features/stats/EventsSummaryCard';
import { NotesSection } from '@/components/features/stats/NotesSection';
import { ReadyScoreCompactCard } from '@/components/features/stats/ReadyScoreCompactCard';
import { AdditionalInfoCard } from '@/components/features/stats/AdditionalInfoCard';
import { TargetProgramsPills } from '@/components/features/stats/TargetProgramsPills';
import { PrerequisiteQuickStartWizard } from '@/components/features/stats/PrerequisiteQuickStartWizard';

// Edit sheets
import { GpaEditSheet } from '@/components/features/stats/GpaEditSheet';
import { GreEditSheet } from '@/components/features/stats/GreEditSheet';
import { CertificationsEditSheet } from '@/components/features/stats/CertificationsEditSheet';
import { PrerequisitesEditSheet } from '@/components/features/stats/PrerequisitesEditSheet';
import { ResumeBoosterEditSheet } from '@/components/features/stats/ResumeBoosterEditSheet';
import { ClinicalExperienceEditSheet } from '@/components/features/stats/ClinicalExperienceEditSheet';
import { ShadowExperienceEditSheet } from '@/components/features/stats/ShadowExperienceEditSheet';
import { EventsEditSheet } from '@/components/features/stats/EventsEditSheet';

// Hooks
import { useProfileCompletion, PROFILE_ACTIONS } from '@/hooks/useProfileCompletion';

// Mock data
import {
  mockUser,
  mockAcademicProfile,
  mockClinicalProfile,
  mockTrackerStats,
} from '@/data/mockUser';
import {
  mockUserNotes,
  mockAdminNotes,
  mockMentorNotes,
  mockResumeBoosters,
  mockApplicationMaterials,
} from '@/data/mockStatsPage';
import { mockShadowDays, calculateShadowStats } from '@/data/shadowDaysEnhanced';
import { mockEQReflections } from '@/data/mockEQReflections';
import { mockClinicalEntries } from '@/data/mockClinicalEntries';
import { usePrograms } from '@/hooks/usePrograms';
import { CHECKLIST_TASK_MAPPING } from '@/data/taskConfig';

// Utilities
import { calculateReadinessScore } from '@/lib/readinessCalculator';
import { calculateAcuityScore } from '@/lib/acuityCalculator';
import { getPriorityActions, buildUserDataForPriorityActions } from '@/lib/priorityActions';

export function MyStatsPage() {
  const navigate = useNavigate();

  // Get real program data
  const { targetPrograms, syncChecklistItemsAcrossPrograms } = usePrograms();

  // Sheet/modal state
  const [editSheet, setEditSheet] = useState({ type: null, open: false });

  // Local state for data (in real app, this would be from API)
  const [academicProfile, setAcademicProfile] = useState(mockAcademicProfile);
  const [clinicalProfile, setClinicalProfile] = useState(mockClinicalProfile);
  const [resumeBoosters, setResumeBoosters] = useState(mockResumeBoosters);
  const [userNotes, setUserNotes] = useState(mockUserNotes);
  const [shadowProfile, setShadowProfile] = useState({ totalHours: 0, totalDays: 0 });
  const [eventsProfile, setEventsProfile] = useState({ categoriesAttended: [] });

  // Prerequisite quick start wizard state
  const [showPrereqWizard, setShowPrereqWizard] = useState(false);

  // Checklist sync dialog state
  const [syncDialog, setSyncDialog] = useState({ open: false, itemType: null, itemIds: [] });
  const pendingSaveRef = useRef(null);

  // Profile completion tracking (uses localStorage, not props, to avoid infinite loops)
  const {
    completedCount,
    requiredActions,
    isComplete: isProfileComplete,
    completedLabels,
    suggestedActions,
    shouldShowIndicator,
    pointsReward,
    dismissIndicator,
    completeAction,
  } = useProfileCompletion();

  // Calculate shadow stats from entries
  const shadowStats = calculateShadowStats(mockShadowDays);

  // Calculate clinical acuity score
  const acuityResult = calculateAcuityScore(mockClinicalEntries || []);

  // Calculate overall readiness
  const readinessData = calculateReadinessScore({
    academicProfile: academicProfile,
    clinicalAcuityScore: acuityResult.totalScore,
    shadowStats: shadowStats,
    applicationMaterials: mockApplicationMaterials,
    eventStats: {
      totalLogged: mockTrackerStats.events.totalLogged,
      programsEngaged: 1,
    },
    targetProgramCount: targetPrograms.length,
  });

  // Build user data for priority actions
  const priorityUserData = buildUserDataForPriorityActions({
    academicProfile,
    clinicalEntries: mockClinicalEntries || [],
    shadowStats,
    eventStats: {
      totalLogged: mockTrackerStats.events.totalLogged,
      categories: ['aana_state', 'info_session'],
    },
    certifications: clinicalProfile.certifications || [],
    organizations: [],
    eqReflections: mockEQReflections || [],
    leadershipEntries: resumeBoosters.leadership ? [{ id: 1 }] : [],
    volunteeringEntries: resumeBoosters.volunteering ? [{ id: 1 }] : [],
    researchEntries: resumeBoosters.research ? [{ id: 1 }] : [],
    prerequisites: academicProfile.completedPrerequisites || [],
    applicationMaterials: mockApplicationMaterials,
  });

  // Get priority actions
  const priorityActions = getPriorityActions(priorityUserData);

  // Edit handlers
  const handleEdit = (section, subsection) => {
    const sheetMap = {
      gpa: 'gpa',
      gre: 'gre',
      certifications: 'certifications',
      prerequisites: 'prerequisites',
      clinical: 'clinical',
      shadow: 'shadow',
      events: 'events',
      resume_boosters: subsection || 'research',
      research: 'resume_research',
      committees: 'resume_committees',
      volunteering: 'resume_volunteering',
      leadership: 'resume_leadership',
    };

    const sheetType = sheetMap[section] || sheetMap[subsection];
    if (sheetType) {
      setEditSheet({ type: sheetType, open: true, subsection });
    }
  };

  // Open prerequisite quick start wizard
  const handleOpenPrereqWizard = () => {
    setShowPrereqWizard(true);
  };

  // Get checklist item IDs for a category
  const getChecklistItemsForCategory = (category) => {
    return Object.entries(CHECKLIST_TASK_MAPPING)
      .filter(([, cat]) => cat === category)
      .map(([id]) => id);
  };

  // Handle sync dialog confirm
  const handleSyncConfirm = () => {
    if (syncDialog.itemIds.length > 0 && syncChecklistItemsAcrossPrograms) {
      syncChecklistItemsAcrossPrograms(syncDialog.itemIds);
      toast.success(`${syncDialog.itemType === 'gre' ? 'GRE' : 'CCRN'} checklist items marked complete across all schools`);
    }
    // Apply the pending save
    if (pendingSaveRef.current) {
      pendingSaveRef.current();
      pendingSaveRef.current = null;
    }
    setSyncDialog({ open: false, itemType: null, itemIds: [] });
  };

  // Handle sync dialog dismiss (still save, just don't sync)
  const handleSyncDismiss = () => {
    // Apply the pending save without syncing
    if (pendingSaveRef.current) {
      pendingSaveRef.current();
      pendingSaveRef.current = null;
    }
    setSyncDialog({ open: false, itemType: null, itemIds: [] });
  };

  // Save handlers
  const handleSaveGpa = (data) => {
    setAcademicProfile((prev) => ({ ...prev, ...data }));
    toast.success('GPA updated successfully');
  };

  const handleSaveGre = (data) => {
    // Check if GRE scores are being added for the first time
    const hadNoGre = !academicProfile.greQuantitative && !academicProfile.greVerbal;
    const hasGreNow = data.greQuantitative || data.greVerbal;

    if (hadNoGre && hasGreNow && targetPrograms.length > 0) {
      // Store the save action and show sync dialog
      pendingSaveRef.current = () => {
        setAcademicProfile((prev) => ({ ...prev, ...data }));
        toast.success('GRE scores updated successfully');
      };

      const greItemIds = getChecklistItemsForCategory('gre');
      setSyncDialog({
        open: true,
        itemType: 'gre',
        itemIds: greItemIds,
      });
    } else {
      // Just save normally
      setAcademicProfile((prev) => ({ ...prev, ...data }));
      toast.success('GRE scores updated successfully');
    }
  };

  const handleSaveCertifications = (data) => {
    // Check if CCRN is being added for the first time
    const hadNoCcrn = !clinicalProfile.certifications?.includes('CCRN');
    const hasCcrnNow = data.certifications?.includes('CCRN');

    // Track profile completion
    if (data.certifications?.length > 0) {
      completeAction(PROFILE_ACTIONS.CERTIFICATIONS);
    }

    if (hadNoCcrn && hasCcrnNow && targetPrograms.length > 0) {
      // Store the save action and show sync dialog
      pendingSaveRef.current = () => {
        setClinicalProfile((prev) => ({ ...prev, ...data }));
        toast.success('Certifications updated successfully');
      };

      const ccrnItemIds = getChecklistItemsForCategory('ccrn');
      setSyncDialog({
        open: true,
        itemType: 'ccrn',
        itemIds: ccrnItemIds,
      });
    } else {
      // Just save normally
      setClinicalProfile((prev) => ({ ...prev, ...data }));
      toast.success('Certifications updated successfully');
    }
  };

  const handleSavePrerequisites = (data) => {
    setAcademicProfile((prev) => ({ ...prev, ...data }));
    completeAction(PROFILE_ACTIONS.PREREQUISITES);
    toast.success('Prerequisites updated successfully');
  };

  // Handle quick start wizard completion
  const handlePrereqWizardComplete = (prerequisites) => {
    setAcademicProfile((prev) => ({
      ...prev,
      completedPrerequisites: [
        ...(prev.completedPrerequisites || []),
        ...prerequisites,
      ],
    }));
    completeAction(PROFILE_ACTIONS.PREREQUISITES);
    toast.success('Prerequisites added! You can add grades and details anytime.');
  };

  const handleSaveClinical = (data) => {
    setClinicalProfile((prev) => ({ ...prev, ...data }));
    completeAction(PROFILE_ACTIONS.CLINICAL);
    toast.success('Clinical experience updated successfully');
  };

  const handleSaveShadow = (data) => {
    setShadowProfile((prev) => ({ ...prev, ...data }));
    completeAction(PROFILE_ACTIONS.SHADOW);
    toast.success('Shadow experience updated successfully');
  };

  const handleSaveEvents = (data) => {
    setEventsProfile((prev) => ({ ...prev, ...data }));
    completeAction(PROFILE_ACTIONS.EVENTS);
    toast.success('Events profile updated successfully');
  };

  const handleSaveResumeBoosters = (data) => {
    setResumeBoosters((prev) => ({ ...prev, ...data }));
    // Track if any extracurricular was added (leadership, research, community)
    if (data.leadership?.length > 0 || data.research?.length > 0 || data.volunteering?.length > 0) {
      completeAction(PROFILE_ACTIONS.EXTRACURRICULARS);
    }
    toast.success('Resume boosters updated successfully');
  };

  const handleSaveNote = (noteType, value) => {
    setUserNotes((prev) => ({ ...prev, [noteType]: value }));
    toast.success('Note saved successfully');
  };

  // Navigation handlers
  const handleViewTracker = (tracker) => {
    const routes = {
      clinical: '/trackers/clinical',
      shadow: '/trackers/shadow',
      events: '/trackers/events',
      eq: '/trackers/eq',
    };
    navigate(routes[tracker] || '/trackers');
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  // Scroll to section handler for profile completion card
  const handleScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a brief highlight effect
      element.classList.add('ring-2', 'ring-purple-400', 'ring-offset-2');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-purple-400', 'ring-offset-2');
      }, 2000);
    }
  };

  // Mock viewer role
  const viewerRole = 'user';
  const isOwnProfile = true;

  // Event names for EventsSummaryCard
  const eventNames = ['AANA State Meeting 2024', 'Duke CRNA Info Session'];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50/80 to-pink-50/25">
      <PageWrapper className="px-8 md:px-16 lg:px-24 xl:px-32 pt-8 md:pt-12 lg:pt-16 pb-8 bg-transparent relative z-10">
      <PageHeader
        title="My Stats"
        description="Your application snapshot and progress"
      />

      {/* Mobile ReadyScore - Shows at top on mobile only */}
      <div className="lg:hidden mb-6">
        <ReadyScoreCompactCard
          readinessData={readinessData}
          weeklyFocus={null}
          onFocusClick={() => {}}
        />
      </div>

      {/* Main Layout: Content + Sidebar */}
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* Hero with Target Programs integrated */}
          <StatsHeroSection
            user={mockUser}
            isOwnProfile={isOwnProfile}
            onEdit={handleEdit}
            targetPrograms={targetPrograms}
          />

          {/* Academic Details (vertical) + Prerequisites (side-by-side) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div id="academic-section" className="rounded-2xl transition-all duration-300">
              <AcademicDetailsSection
                academicProfile={academicProfile}
                clinicalProfile={clinicalProfile}
                onEdit={handleEdit}
                isEditable={isOwnProfile}
              />
            </div>
            <div id="prerequisites-section" className="rounded-2xl transition-all duration-300">
              <PrerequisitesSubCard
                academicProfile={academicProfile}
                onEdit={handleEdit}
                onQuickStart={() => setShowPrereqWizard(true)}
                isEditable={isOwnProfile}
              />
            </div>
          </div>

          {/* Clinical + Shadow + Events - 3-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div id="clinical-section" className="rounded-2xl transition-all duration-300">
              <ClinicalExperienceSection
                clinicalProfile={clinicalProfile}
                clinicalEntries={mockClinicalEntries || []}
                onViewTracker={() => handleViewTracker('clinical')}
                onEdit={() => handleEdit('clinical')}
                isEditable={isOwnProfile}
              />
            </div>
            <div id="shadow-section" className="rounded-2xl transition-all duration-300">
              <ShadowSummaryCard
                shadowStats={{ ...shadowStats, ...shadowProfile }}
                onViewTracker={() => handleViewTracker('shadow')}
                onEdit={() => handleEdit('shadow')}
                isEditable={isOwnProfile}
              />
            </div>
            <div id="events-section" className="rounded-2xl transition-all duration-300">
              <EventsSummaryCard
                eventStats={{
                  totalLogged: mockTrackerStats.events.totalLogged,
                  categoryBreakdown: {
                    aana_state: 1,
                    info_session: 1,
                  },
                }}
                eventNames={eventNames}
                categoriesAttended={eventsProfile.categoriesAttended}
                onViewTracker={() => handleViewTracker('events')}
                onEdit={() => handleEdit('events')}
                isEditable={isOwnProfile}
              />
            </div>
          </div>

          {/* Leadership + Research/Community Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div id="leadership-section" className="rounded-2xl transition-all duration-300">
              <LeadershipSection
                resumeBoosters={resumeBoosters}
                onEdit={handleEdit}
                isEditable={isOwnProfile}
              />
            </div>
            <ResearchCommunitySection
              resumeBoosters={resumeBoosters}
              onEdit={handleEdit}
              isEditable={isOwnProfile}
            />
          </div>

          {/* Additional Information - Full width */}
          <AdditionalInfoCard
            additionalInfo={userNotes?.additionalInfo}
            onSave={(value) => handleSaveNote('additionalInfo', value)}
            isEditable={isOwnProfile}
          />

          {/* Mobile-only Notes Section */}
          <div className="lg:hidden">
            <NotesSection
              userNotes={userNotes}
              adminNotes={mockAdminNotes}
              mentorNotes={mockMentorNotes}
              viewerRole={viewerRole}
              currentMentorId="mentor_001"
              onSaveNote={handleSaveNote}
              isOwnProfile={isOwnProfile}
            />
          </div>
        </div>

        {/* Sidebar - Desktop only (includes Notes) */}
        <StatsSidebar
          readinessData={readinessData}
          priorityActions={priorityActions}
          onNavigate={handleNavigate}
          user={mockUser}
          userNotes={userNotes}
          adminNotes={mockAdminNotes}
          mentorNotes={mockMentorNotes}
          viewerRole={viewerRole}
          currentMentorId="mentor_001"
          onSaveNote={handleSaveNote}
          isOwnProfile={isOwnProfile}
          // Profile completion props for sidebar card
          profileCompletion={{
            shouldShowIndicator,
            completedCount,
            requiredActions,
            isComplete: isProfileComplete,
            pointsReward,
            completedLabels,
            suggestedActions,
            onDismiss: isProfileComplete ? dismissIndicator : undefined,
          }}
          onScrollToSection={handleScrollToSection}
          onEdit={handleEdit}
        />
      </div>

      {/* Edit Sheets */}
      <GpaEditSheet
        open={editSheet.type === 'gpa' && editSheet.open}
        onOpenChange={(open) => setEditSheet((prev) => ({ ...prev, open }))}
        initialValues={academicProfile}
        onSave={handleSaveGpa}
      />

      <GreEditSheet
        open={editSheet.type === 'gre' && editSheet.open}
        onOpenChange={(open) => setEditSheet((prev) => ({ ...prev, open }))}
        initialValues={academicProfile}
        onSave={handleSaveGre}
      />

      <CertificationsEditSheet
        open={editSheet.type === 'certifications' && editSheet.open}
        onOpenChange={(open) => setEditSheet((prev) => ({ ...prev, open }))}
        initialValues={clinicalProfile}
        onSave={handleSaveCertifications}
      />

      <PrerequisitesEditSheet
        open={editSheet.type === 'prerequisites' && editSheet.open}
        onOpenChange={(open) => setEditSheet((prev) => ({ ...prev, open }))}
        initialValues={academicProfile}
        onSave={handleSavePrerequisites}
      />

      <ResumeBoosterEditSheet
        open={editSheet.type?.startsWith('resume_') && editSheet.open}
        onOpenChange={(open) => setEditSheet((prev) => ({ ...prev, open }))}
        initialValues={resumeBoosters}
        boosterType={editSheet.type?.replace('resume_', '') || 'research'}
        onSave={handleSaveResumeBoosters}
      />

      <ClinicalExperienceEditSheet
        open={editSheet.type === 'clinical' && editSheet.open}
        onOpenChange={(open) => setEditSheet((prev) => ({ ...prev, open }))}
        initialValues={clinicalProfile}
        onSave={handleSaveClinical}
      />

      <ShadowExperienceEditSheet
        open={editSheet.type === 'shadow' && editSheet.open}
        onOpenChange={(open) => setEditSheet((prev) => ({ ...prev, open }))}
        initialValues={shadowProfile}
        onSave={handleSaveShadow}
      />

      <EventsEditSheet
        open={editSheet.type === 'events' && editSheet.open}
        onOpenChange={(open) => setEditSheet((prev) => ({ ...prev, open }))}
        initialValues={eventsProfile}
        onSave={handleSaveEvents}
      />

      {/* Prerequisite Quick Start Wizard */}
      <PrerequisiteQuickStartWizard
        open={showPrereqWizard}
        onOpenChange={setShowPrereqWizard}
        existingCourses={academicProfile.completedPrerequisites || []}
        onComplete={handlePrereqWizardComplete}
      />

      {/* Checklist Sync Dialog - appears when user adds GRE scores or CCRN certification */}
      <ChecklistSyncDialog
        open={syncDialog.open}
        onClose={handleSyncDismiss}
        itemType={syncDialog.itemType}
        schoolCount={targetPrograms.length}
        onConfirm={handleSyncConfirm}
        source="profile"
      />
      </PageWrapper>
    </div>
  );
}

export default MyStatsPage;
