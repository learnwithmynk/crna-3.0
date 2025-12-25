/**
 * DashboardSidebar - Right sidebar for dashboard page
 *
 * Contains (in order):
 * - Get Started (OnboardingWidget) - if active, shown first
 * - Calendar Widget - always shown (below Get Started if active)
 * - Smart Steps (NextBestStepsCard)
 * - Celebrations (streak milestones)
 * - Gamification (ProgressTrackerCard)
 * - Find Your Mentor (RecommendedMentorsWidget)
 *
 * Removed: Timeline, My Discussions (now in CommunityActivityWidget)
 *
 * Used in: DashboardPage (desktop view)
 */

import React from 'react';
import { CalendarWidget } from '@/components/features/dashboard/CalendarWidget';
import { ProgressTrackerCard } from '@/components/features/dashboard/ProgressTrackerCard';
import { DashboardNudges } from '@/components/features/prompts';
import { NextBestStepsCard } from '@/components/features/guidance';
import { RecommendedMentorsWidget } from '@/components/features/marketplace/RecommendedMentorsWidget';
import { OnboardingWidget } from '@/components/features/onboarding';

export function DashboardSidebar({
  className = '',
  showCalendar = true,
  showProgress = true,
  showNudges = true,
  showNextBestSteps = true,
  showOnboarding = true,
  // Target programs for calendar deadlines
  targetPrograms = [],
  // Next Best Steps data (from useGuidanceState)
  nextBestSteps = [],
  supportMode,
  onDismissStep,
  onStepClick,
  // Smart prompts data
  smartPromptsData,
  onNudgeAction,
  // Progress tracker data
  userPoints = 0,
  userLevel = 1,
  userLevelName = 'Beginner',
  nextLevelProgress = 0,
  pointsToNextLevel = 100,
  clinicalStreak = 0,
  totalLogs = 0,
  clinicalMilestones = [],
  pointsPerLog = 5,
  eqStreak = 0,
}) {
  return (
    <div className={className}>
      {/* Calendar Widget - Top of sidebar to align with To-Do List */}
      {showCalendar && (
        <div className="mb-4">
          <CalendarWidget targetPrograms={targetPrograms} />
        </div>
      )}

      {/* Get Started Widget */}
      {showOnboarding && (
        <div className="mb-4">
          <OnboardingWidget />
        </div>
      )}

      {/* Celebrations / Nudges (streak milestones, etc.) */}
      {showNudges && smartPromptsData && (
        <div className="mb-4">
          <DashboardNudges
            data={smartPromptsData}
            onAction={onNudgeAction}
            maxNudges={2}
            showCelebrations={true}
          />
        </div>
      )}

      {/* Smart Steps - Numbered action items */}
      {showNextBestSteps && (
        <div className="mb-4">
          <NextBestStepsCard
            steps={nextBestSteps}
            supportMode={supportMode}
            onDismiss={onDismissStep}
            onStepClick={onStepClick}
          />
        </div>
      )}

      {/* Gamification Card */}
      {showProgress && (
        <div className="mb-4">
          <ProgressTrackerCard
            points={userPoints}
            level={userLevel}
            levelName={userLevelName}
            nextLevelProgress={nextLevelProgress}
            pointsToNextLevel={pointsToNextLevel}
            streak={clinicalStreak}
            totalLogs={totalLogs}
            logMilestones={clinicalMilestones}
            pointsPerLog={pointsPerLog}
            eqStreak={eqStreak}
          />
        </div>
      )}

      {/* Find Your Mentor - Bottom of sidebar */}
      <RecommendedMentorsWidget
        context="dashboard"
        title="Find Your Mentor"
      />
    </div>
  );
}

export default DashboardSidebar;
