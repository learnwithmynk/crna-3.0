/**
 * My Stats Page (Optimized for Mentor Review)
 *
 * Comprehensive applicant snapshot/visual resume with:
 * - Target Programs pills at top (NEW)
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

// Edit sheets
import { GpaEditSheet } from '@/components/features/stats/GpaEditSheet';
import { GreEditSheet } from '@/components/features/stats/GreEditSheet';
import { CertificationsEditSheet } from '@/components/features/stats/CertificationsEditSheet';
import { PrerequisitesEditSheet } from '@/components/features/stats/PrerequisitesEditSheet';
import { ResumeBoosterEditSheet } from '@/components/features/stats/ResumeBoosterEditSheet';

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

  // Checklist sync dialog state
  const [syncDialog, setSyncDialog] = useState({ open: false, itemType: null, itemIds: [] });
  const pendingSaveRef = useRef(null);

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
    toast.success('Prerequisites updated successfully');
  };

  const handleSaveResumeBoosters = (data) => {
    setResumeBoosters((prev) => ({ ...prev, ...data }));
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

      {/* Target Programs Pills - At the very top */}
      <TargetProgramsPills targetPrograms={targetPrograms} maxVisible={5} />

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

          {/* Hero + Academic */}
          <StatsHeroSection
            user={mockUser}
            isOwnProfile={isOwnProfile}
            onEdit={handleEdit}
          />
          <AcademicDetailsSection
            academicProfile={academicProfile}
            clinicalProfile={clinicalProfile}
            onEdit={handleEdit}
            isEditable={isOwnProfile}
          />

          {/* Clinical + Shadow Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ClinicalExperienceSection
              clinicalProfile={clinicalProfile}
              clinicalEntries={mockClinicalEntries || []}
              onViewTracker={() => handleViewTracker('clinical')}
            />
            <ShadowSummaryCard
              shadowStats={shadowStats}
              onViewTracker={() => handleViewTracker('shadow')}
            />
          </div>

          {/* Events - Full width (EQ removed) */}
          <EventsSummaryCard
            eventStats={{
              totalLogged: mockTrackerStats.events.totalLogged,
              categoryBreakdown: {
                aana_state: 1,
                info_session: 1,
              },
            }}
            eventNames={eventNames}
            onViewTracker={() => handleViewTracker('events')}
          />

          {/* Leadership + Research/Community Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LeadershipSection
              resumeBoosters={resumeBoosters}
              onEdit={handleEdit}
              isEditable={isOwnProfile}
            />
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
          userNotes={userNotes}
          adminNotes={mockAdminNotes}
          mentorNotes={mockMentorNotes}
          viewerRole={viewerRole}
          currentMentorId="mentor_001"
          onSaveNote={handleSaveNote}
          isOwnProfile={isOwnProfile}
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
