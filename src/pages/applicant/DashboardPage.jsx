/**
 * Dashboard Page - Applicant Central Hub
 *
 * Main content:
 * 1. Onboarding widget (if new user)
 * 2. My To-Do List
 * 3. Target Programs
 * 4. My Application Milestones (carousel)
 *
 * Sidebar (desktop):
 * 1. Calendar Widget
 * 2. Progress + Tracker Card
 * 3. Timeline (scrollable, ~5 posts)
 * 4. My Discussions (3 max)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { getSessionGreeting } from '@/lib/greetings';
import { getDailyQuote } from '@/data/inspirationalQuotes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { MilestoneCard } from '@/components/features/MilestoneCard';
import { MilestoneDetail } from '@/components/features/MilestoneDetail';
import { ToDoListWidget } from '@/components/features/dashboard/ToDoListWidget';
import { CalendarWidget } from '@/components/features/dashboard/CalendarWidget';
import { DashboardSidebar } from '@/components/features/dashboard/DashboardSidebar';
import { ProgressTrackerCard } from '@/components/features/dashboard/ProgressTrackerCard';
import { CommunityActivityWidget } from '@/components/features/dashboard/CommunityActivityWidget';
import { DashboardNudges, MobileNudge } from '@/components/features/prompts';
import { NextBestStepsCard } from '@/components/features/guidance';
import { useGuidanceState } from '@/hooks/useGuidanceState';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import { useAuth } from '@/hooks/useAuth';
import OnboardingModal from '@/components/features/onboarding/OnboardingModal';
import OnboardingOverlay from '@/components/features/onboarding/OnboardingOverlay';
import { OnboardingWidget } from '@/components/features/onboarding';
import {
  Target,
  CheckCircle2,
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

// TODO: Replace with API calls
import { mockUser, getNextLevelInfo, mockTrackerStats, clinicalMilestones, mockClinicalProfile, mockAcademicProfile } from '@/data/mockUser';
// SemiCircleGauge now used by ProgressTrackerCard
import { usePrograms } from '@/hooks/usePrograms';
import { mockMilestones } from '@/data/mockMilestones';
import { mockRecentDiscussions } from '@/data/mockActivity';
import { mockSocialPosts, mockCurrentUser } from '@/data/mockSocialFeed';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(null);
  const [milestones, setMilestones] = useState(mockMilestones);
  // Track which milestones have been celebrated (confetti shown) - persists in session
  const [celebratedMilestones, setCelebratedMilestones] = useState(() => {
    // Load from sessionStorage to persist across component re-renders but reset on page refresh
    const stored = sessionStorage.getItem('celebratedMilestones');
    return stored ? JSON.parse(stored) : [];
  });

  // Use real program data from usePrograms hook
  const {
    targetPrograms,
    savedPrograms,
    tasks: programTasks,
    loading: programsLoading,
    // Dashboard tasks and suggestions
    dashboardTasks,
    addDashboardTask,
    completeDashboardTask,
    deleteDashboardTask,
    dismissedSuggestions,
    dismissSuggestion,
  } = usePrograms();

  const [tasks, setTasks] = useState([])

  // Sync tasks from usePrograms when available
  React.useEffect(() => {
    if (programTasks.length > 0) {
      setTasks(programTasks);
    }
  }, [programTasks]);

  // Onboarding modal state
  const {
    isCompleted: onboardingCompleted,
    isSkipped: onboardingSkipped,
    shouldShowModal: shouldShowOnboardingModal,
    shouldShowReminder: showOnboardingReminder,
    onboardingData,
    completeOnboarding,
    skipOnboarding,
    resumeOnboarding,
    markReminderShown,
  } = useOnboardingStatus();

  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  // Show onboarding modal on first load if needed
  useEffect(() => {
    if (shouldShowOnboardingModal) {
      setIsOnboardingModalOpen(true);
    }
  }, [shouldShowOnboardingModal]);

  // Handle onboarding completion
  const handleOnboardingComplete = (data) => {
    completeOnboarding(data);
    toast.success('Profile setup complete!', {
      description: 'Your personalized dashboard is ready.',
    });
  };

  // Handle onboarding skip
  const handleOnboardingSkip = (partialData, currentScreen) => {
    skipOnboarding(partialData, currentScreen);
    toast.info('You can complete setup anytime', {
      description: 'Some features may be limited.',
    });
  };

  // Handle resume from reminder
  const handleResumeOnboarding = () => {
    resumeOnboarding();
    setIsOnboardingModalOpen(true);
  };

  // Handle dismiss reminder
  const handleDismissReminder = () => {
    markReminderShown();
  };

  const nextLevelInfo = getNextLevelInfo(mockUser.points);

  // Get dynamic greeting and daily quote (memoized to prevent re-renders changing them)
  // Use user's first_name from auth, fall back to mockUser for demo
  const userFirstName = user?.user_metadata?.first_name || mockUser.preferredName;
  const greeting = useMemo(() => getSessionGreeting(userFirstName), [userFirstName]);
  const dailyQuote = useMemo(() => getDailyQuote(), []);

  // Get guidance state for Next Best Steps
  const { nextBestSteps, supportMode, dismissStep, trackStepClick } =
    useGuidanceState();

  // Handle social interactions (coming soon - BuddyBoss integration)
  const handleSocialAction = (action) => {
    toast.info(`${action} coming soon`, {
      description: 'This feature will be available with BuddyBoss integration.',
    });
  };

  // Task handlers
  const handleTaskComplete = (taskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const isCompleting = task.status !== 'completed';
        return {
          ...task,
          status: isCompleting ? 'completed' : 'not_started',
          completedAt: isCompleting ? new Date().toISOString() : null,
        };
      }
      return task;
    }));
  };

  const handleTaskSave = (taskData) => {
    setTasks(prev => {
      const existingIndex = prev.findIndex(t => t.id === taskData.id);
      if (existingIndex >= 0) {
        // Update existing
        const updated = [...prev];
        updated[existingIndex] = { ...prev[existingIndex], ...taskData };
        return updated;
      } else {
        // Add new
        return [...prev, taskData];
      }
    });
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Get the current selected milestone from the milestones array
  const selectedMilestone = selectedMilestoneId
    ? milestones.find(m => m.id === selectedMilestoneId)
    : null;

  // Handle milestone navigation in the detail modal
  const handleMilestoneNavigate = (milestoneId) => {
    setSelectedMilestoneId(milestoneId);
  };

  // Handle milestone celebration (confetti shown) - only fires once per milestone
  const handleMilestoneCelebrated = (milestoneId) => {
    setCelebratedMilestones(prev => {
      const updated = [...prev, milestoneId];
      sessionStorage.setItem('celebratedMilestones', JSON.stringify(updated));
      return updated;
    });
  };

  // Handle toggle sub-item completion
  const handleToggleSubItem = (milestoneId, subItemId) => {
    setMilestones(prev => prev.map(milestone => {
      if (milestone.id === milestoneId) {
        const updatedSubItems = milestone.subItems.map(subItem =>
          subItem.id === subItemId
            ? { ...subItem, completed: !subItem.completed }
            : subItem
        );

        // Update milestone completion based on all sub-items
        const allCompleted = updatedSubItems.every(item => item.completed);

        return {
          ...milestone,
          subItems: updatedSubItems,
          completed: allCompleted
        };
      }
      return milestone;
    }));
  };

  // ProgressTrackerCard and formatTimestamp moved to @/components/features/dashboard/

  // Prepare data for Smart Prompts
  const smartPromptsData = {
    userData: {
      ...mockUser,
      lastLoginAt: mockUser.lastLoginAt || new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago if not set
      loginStreak: mockUser.loginStreak || 5,
      onboardingWidgetComplete: mockUser.onboardingCompletedAt ? true : false,
      onboardingWidgetProgress: mockUser.onboardingProgress || 3,
    },
    targetPrograms: targetPrograms.map(sp => ({
      id: sp.id,
      schoolName: sp.program?.schoolName,
      applicationDeadline: sp.program?.applicationDeadline,
      status: sp.targetData?.status || 'researching',
      checklistItems: sp.targetData?.checklist || [],
      interviewDate: sp.targetData?.interviewDate,
      interviewType: sp.targetData?.interviewType,
      outcome: sp.targetData?.outcome,
    })),
    savedPrograms: savedPrograms.map(sp => ({
      id: sp.id,
      schoolName: sp.program?.schoolName,
    })),
    certifications: mockClinicalProfile.certifications || [],
    letterRequests: mockUser.letterRequests || [],
    savedEvents: mockUser.savedEvents || [],
    academicProfile: {
      scienceGpa: mockAcademicProfile.scienceGpa,
      overallGpa: mockAcademicProfile.overallGpa,
      completedPrerequisites: mockAcademicProfile.completedPrerequisites || [],
    },
    trackerStats: mockTrackerStats,
    readyScoreData: {
      currentScore: mockUser.readyScore || 65,
      previousScore: mockUser.previousReadyScore || 60,
      lastCelebrationAt: mockUser.lastReadyScoreCelebration,
    },
    milestones: milestones,
    checklistProgress: {
      totalCompleted: targetPrograms.reduce((acc, p) =>
        acc + (p.targetData?.checklist?.filter(c => c.completed)?.length || 0), 0
      ),
      previousTotalCompleted: mockUser.previousChecklistCompleted || 0,
    },
  };

  // Handle nudge action callbacks
  const handleNudgeAction = (nudgeId, action) => {
    console.log('Nudge action:', nudgeId, action);

    // Handle specific action types
    if (action.actionType === 'mark_submitted') {
      toast.success('Application marked as submitted!', {
        description: 'Congratulations on completing this milestone.',
      });
    } else if (action.actionType === 'view_checklist') {
      const programId = action.context?.programId;
      if (programId) {
        navigate(`/my-programs/${programId}`);
      }
    } else if (action.actionType === 'link' && action.href) {
      navigate(action.href);
    } else {
      // Generic handler
      toast.info(`Action: ${action.label}`, {
        description: 'This feature will be fully functional with API integration.',
      });
    }
  };

  // Sidebar props for extracted DashboardSidebar component
  const sidebarProps = {
    // Target programs for calendar deadlines
    targetPrograms,
    // Next Best Steps
    nextBestSteps,
    supportMode,
    onDismissStep: dismissStep,
    onStepClick: trackStepClick,
    // Smart Prompts
    smartPromptsData,
    onNudgeAction: handleNudgeAction,
    userPoints: mockUser.points,
    userLevel: mockUser.level,
    userLevelName: mockUser.levelName,
    nextLevelProgress: nextLevelInfo.progress,
    pointsToNextLevel: nextLevelInfo.pointsToNext,
    clinicalStreak: mockTrackerStats.clinical.streak,
    totalLogs: mockTrackerStats.clinical.totalLogs,
    clinicalMilestones: clinicalMilestones,
    pointsPerLog: mockTrackerStats.clinical.pointsPerLog,
    eqStreak: mockTrackerStats.eq.streak,
    socialPosts: mockSocialPosts,
    currentUser: mockCurrentUser,
    discussions: mockRecentDiscussions,
    onSocialAction: handleSocialAction,
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50/80 to-pink-50/25">
      <PageWrapper className="bg-transparent relative z-10 pt-8 md:pt-12 lg:pt-16">
        {/* Custom header without yellow highlight */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{greeting}</h1>
          <p className="text-xs text-gray-400 mt-1 italic">
            "{dailyQuote.quote}" <span className="not-italic">— {dailyQuote.author}</span>
          </p>
        </div>

      {/* Main Layout: Content + Sidebar on Desktop */}
      <div className="flex gap-6">
        {/* Main Content Column */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Row 1: To-Do List with integrated suggestions */}
          <ToDoListWidget
            tasks={tasks}
            programs={targetPrograms}
            showProgramName={true}
            onTaskComplete={handleTaskComplete}
            onTaskSave={handleTaskSave}
            onTaskDelete={handleTaskDelete}
            // Suggestion-related props
            dashboardTasks={dashboardTasks}
            dismissedSuggestions={dismissedSuggestions}
            onAddDashboardTask={addDashboardTask}
            onDismissSuggestion={dismissSuggestion}
          />

        {/* Target Programs - Horizontal Scroll */}
        <div className="bg-white rounded-[2.5rem] border border-gray-50 overflow-hidden">
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                Target Programs
                {targetPrograms.length > 0 && (
                  <span className="text-xs font-normal text-gray-500">
                    ({targetPrograms.length})
                  </span>
                )}
              </h3>
              <Button variant="ghost" size="sm" asChild>
                <a href="/my-programs">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </Button>
            </div>
          </div>
          <div className="px-6 pb-6">
            {targetPrograms.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {targetPrograms.map((savedProgram) => {
                  const program = savedProgram.program;
                  const imageUrl = program?.imageUrl || `https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=200&fit=crop`;
                  const progress = savedProgram.targetData?.progress || 0;
                  const completedItems = savedProgram.targetData?.completedItems || 0;
                  const totalItems = savedProgram.targetData?.totalItems || 8;

                  return (
                    <a
                      key={savedProgram.id}
                      href={`/my-programs/${savedProgram.id}`}
                      className="group shrink-0 w-56 rounded-2xl border border-orange-200/60 bg-white overflow-hidden hover:shadow-md hover:border-orange-300 hover:scale-[1.02] transition-all"
                    >
                      {/* Program Image */}
                      <div className="relative h-24 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={program?.schoolName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Status Badge Overlay */}
                        {savedProgram.targetData && (
                          <div className="absolute top-2 right-2">
                            <StatusBadge status={savedProgram.targetData.status} size="sm" />
                          </div>
                        )}
                      </div>

                      {/* Program Info */}
                      <div className="p-3">
                        <p className="font-semibold text-sm truncate mb-1 group-hover:text-orange-600 transition-colors">
                          {program?.schoolName}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {program?.applicationDeadline
                              ? new Date(program.applicationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                              : 'No deadline'}
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-orange-400 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-600">{progress}%</span>
                          </div>
                          <p className="text-xs text-gray-400">
                            {completedItems}/{totalItems} tasks
                          </p>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={Target}
                title="No target programs yet"
                description="Convert a saved program to a target to start tracking your application."
                actionLabel="Browse Schools"
                actionHref="/schools"
              />
            )}
          </div>
        </div>

        {/* Application Milestones (Carousel) */}
        <div className="bg-white rounded-[2.5rem] border border-gray-50 overflow-hidden">
            <div className="px-6 pt-6 pb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                My Application Milestones
              </h3>
              <span className="text-sm text-gray-500">
                {milestones.filter(m => {
                  const completed = m.subItems.filter(s => s.completed).length;
                  return completed === m.subItems.length;
                }).length} of {milestones.length} completed
              </span>
            </div>
            <div className="relative px-6 pb-6">
              {/* Left scroll arrow */}
              <button
                onClick={() => {
                  const container = document.getElementById('milestone-carousel');
                  if (container) container.scrollBy({ left: -150, behavior: 'smooth' });
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md border border-gray-100 hover:bg-white hover:shadow-lg flex items-center justify-center transition-all hover:scale-105"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </button>

              {/* Milestone cards container - pt-2 for checkmark overflow */}
              <div
                id="milestone-carousel"
                className="flex gap-3 overflow-x-auto pt-2 pb-2 px-6 scrollbar-none scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {milestones.map((milestone) => (
                  <MilestoneCard
                    key={milestone.id}
                    milestone={milestone}
                    onClick={() => setSelectedMilestoneId(milestone.id)}
                  />
                ))}
              </div>

              {/* Right scroll arrow */}
              <button
                onClick={() => {
                  const container = document.getElementById('milestone-carousel');
                  if (container) container.scrollBy({ left: 150, behavior: 'smooth' });
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md border border-gray-100 hover:bg-white hover:shadow-lg flex items-center justify-center transition-all hover:scale-105"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

        {/* Community Activity Widget */}
        <CommunityActivityWidget />

        {/* Sidebar - Mobile Only (shown at bottom) */}
          <div className="lg:hidden space-y-4">
            {/* Next Best Steps - Mobile (compact, shows 1 step) */}
            <NextBestStepsCard
              steps={nextBestSteps}
              supportMode={supportMode}
              onDismiss={dismissStep}
              onStepClick={trackStepClick}
              compact={true}
            />
            {/* Mobile Nudge - Single most important */}
            <MobileNudge data={smartPromptsData} onAction={handleNudgeAction} />
            <CalendarWidget targetPrograms={targetPrograms} />
            <ProgressTrackerCard
              points={mockUser.points}
              level={mockUser.level}
              levelName={mockUser.levelName}
              nextLevelProgress={nextLevelInfo.progress}
              pointsToNextLevel={nextLevelInfo.pointsToNext}
              streak={mockTrackerStats.clinical.streak}
              totalLogs={mockTrackerStats.clinical.totalLogs}
              logMilestones={clinicalMilestones}
              pointsPerLog={mockTrackerStats.clinical.pointsPerLog}
              eqStreak={mockTrackerStats.eq.streak}
            />
            <DashboardSidebar {...sidebarProps} showCalendar={false} showProgress={false} showNudges={false} />
          </div>
        </div>

        {/* Sidebar - Desktop Only */}
        <DashboardSidebar {...sidebarProps} className="hidden lg:block w-[29%] min-w-[380px] shrink-0" />
      </div>

      {/* Milestone Detail Modal */}
      {selectedMilestone && (
        <MilestoneDetail
          milestone={selectedMilestone}
          allMilestones={milestones}
          open={!!selectedMilestone}
          onOpenChange={(open) => !open && setSelectedMilestoneId(null)}
          onToggleSubItem={handleToggleSubItem}
          onNavigate={handleMilestoneNavigate}
          celebratedMilestones={celebratedMilestones}
          onMilestoneCelebrated={handleMilestoneCelebrated}
        />
      )}

      {/* Onboarding Modal - Full-screen questionnaire */}
      <OnboardingModal
        open={isOnboardingModalOpen}
        onOpenChange={setIsOnboardingModalOpen}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
        initialData={onboardingData}
      />

      {/* Onboarding Overlay - Reminder for skipped users */}
      <OnboardingOverlay
        isSkipped={onboardingSkipped}
        shouldShowReminder={showOnboardingReminder}
        onResumeOnboarding={handleResumeOnboarding}
        onDismissReminder={handleDismissReminder}
      />
    </PageWrapper>
    </div>
  );
}
