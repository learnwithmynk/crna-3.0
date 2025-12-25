/**
 * SuggestedTasksWidget - Dashboard widget for users without target programs
 *
 * Shows dynamic task suggestions based on:
 * - Onboarding data (greStatus, certifications, shadowHours)
 * - Profile completion status
 * - User profile data from Supabase
 *
 * Features:
 * - AI/smart indicator showing suggestions are personalized
 * - Checkboxes to complete tasks
 * - Links to relevant pages
 * - Dynamic filtering based on user data
 */

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ListTodo,
  ChevronRight,
  GraduationCap,
  Award,
  Calendar,
  FileText,
  User,
  Calculator,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import { useOnboardingSteps } from '@/hooks/useOnboardingSteps';
import { usePrograms } from '@/hooks/usePrograms';
import { DASHBOARD_SUGGESTED_TASKS } from '@/data/taskConfig';

// Category icons mapping
const CATEGORY_ICONS = {
  gre: GraduationCap,
  'ccrn-prep': Award,
  ccrn: Award,
  shadowing: Calendar,
  profile: User,
  resume: FileText,
  'personal-statement': FileText,
};

// Category colors mapping
const CATEGORY_COLORS = {
  gre: 'bg-purple-100 text-purple-700',
  'ccrn-prep': 'bg-blue-100 text-blue-700',
  ccrn: 'bg-blue-100 text-blue-700',
  shadowing: 'bg-green-100 text-green-700',
  profile: 'bg-orange-100 text-orange-700',
  resume: 'bg-pink-100 text-pink-700',
  'personal-statement': 'bg-pink-100 text-pink-700',
};

export function SuggestedTasksWidget() {
  const { onboardingData } = useOnboardingStatus();
  const { steps: onboardingSteps, completedCount: completedStepsCount } = useOnboardingSteps();
  const {
    dashboardTasks,
    addDashboardTask,
    completeDashboardTask,
    deleteDashboardTask,
  } = usePrograms();

  // Track which suggested tasks the user has added
  const [addedTaskIds, setAddedTaskIds] = useState(new Set());

  // Determine which suggestions to show based on user data
  const suggestedTasks = useMemo(() => {
    // Default values if onboarding data not available
    const data = onboardingData || {};
    const greStatus = data.greStatus;
    const certifications = data.certifications || [];
    const shadowHours = data.shadowHours || 0;

    // Check profile completion
    const profileStep = onboardingSteps?.find(s => s.id === 'profile');
    const profileIncomplete = !profileStep?.complete;

    // Filter suggestions based on conditions
    return DASHBOARD_SUGGESTED_TASKS.filter(task => {
      // Skip if already added
      if (addedTaskIds.has(task.id)) return false;
      // Skip if already in dashboardTasks
      if (dashboardTasks.some(t => t.task === task.task)) return false;

      switch (task.showIf) {
        case 'noGre':
          // Show if GRE not completed
          return greStatus !== 'completed' && !data.greQuantitative;
        case 'noCcrn':
          // Show if CCRN not in certifications
          return !certifications.includes('CCRN');
        case 'noShadow':
          // Show if no shadow hours
          return shadowHours === 0;
        case 'profileIncomplete':
          return profileIncomplete;
        case 'noGpa':
          // Show if GPAs not calculated (would need profile data)
          return profileIncomplete;
        case 'noResume':
          // Show if resume not started
          return true; // Default show, can be refined with profile data
        case 'noPersonalStatement':
          // Show if personal statement not started
          return true; // Default show, can be refined
        default:
          return true;
      }
    });
  }, [onboardingData, onboardingSteps, addedTaskIds, dashboardTasks]);

  // Calculate completion progress
  const completedTasks = dashboardTasks.filter(t => t.status === 'completed');
  const totalTasks = dashboardTasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Handle adding a suggested task
  const handleAddTask = (task) => {
    addDashboardTask(task);
    setAddedTaskIds(prev => new Set([...prev, task.id]));
  };

  // Handle completing a task
  const handleCompleteTask = (taskId) => {
    completeDashboardTask(taskId);
  };

  // If no suggestions and no tasks, show empty state
  if (suggestedTasks.length === 0 && dashboardTasks.length === 0) {
    return (
      <Card className="shadow-[0_0_20px_-5px_rgba(251,146,60,0.25),0_0_10px_-3px_rgba(251,191,36,0.2)] border border-orange-200/40">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ListTodo className="w-5 h-5 text-primary" />
            Getting Started
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <GraduationCap className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 mb-4">
              Add a target program to get personalized tasks
            </p>
            <Button asChild>
              <Link to="/schools">
                Browse Programs
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-[0_0_20px_-5px_rgba(251,146,60,0.25),0_0_10px_-3px_rgba(251,191,36,0.2)] border border-orange-200/40">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ListTodo className="w-5 h-5 text-primary" />
            Suggested Tasks
          </CardTitle>
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="w-3 h-3" />
            Personalized
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Get started on your CRNA journey
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress indicator (if tasks have been added) */}
        {totalTasks > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {completedTasks.length} of {totalTasks} completed
              </span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} variant="warning" className="h-2" />
          </div>
        )}

        {/* Active dashboard tasks */}
        {dashboardTasks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Your Tasks</h4>
            {dashboardTasks.map(task => {
              const Icon = CATEGORY_ICONS[task.category] || ListTodo;
              const isCompleted = task.status === 'completed';

              return (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border transition-colors",
                    isCompleted ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200 hover:border-orange-200"
                  )}
                >
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={() => handleCompleteTask(task.id)}
                    variant="successLight"
                    className="shrink-0"
                  />
                  <Icon className={cn("w-4 h-4 shrink-0", isCompleted ? "text-gray-400" : "text-gray-600")} />
                  <span className={cn(
                    "flex-1 text-sm",
                    isCompleted ? "text-gray-400 line-through" : "text-gray-700"
                  )}>
                    {task.task}
                  </span>
                  {task.link && !isCompleted && (
                    <Button variant="ghost" size="sm" asChild className="shrink-0">
                      <Link to={task.link}>
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Suggested tasks to add */}
        {suggestedTasks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Suggested for You
            </h4>
            <div className="grid gap-2">
              {suggestedTasks.slice(0, 6).map(task => {
                const Icon = CATEGORY_ICONS[task.category] || ListTodo;
                const colorClass = CATEGORY_COLORS[task.category] || 'bg-gray-100 text-gray-700';

                return (
                  <button
                    key={task.id}
                    onClick={() => handleAddTask(task)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 transition-colors text-left w-full group"
                  >
                    <div className={cn("p-1.5 rounded", colorClass)}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="flex-1 text-sm text-gray-700">
                      {task.task}
                    </span>
                    <span className="text-xs text-gray-400 group-hover:text-orange-500 transition-colors">
                      + Add
                    </span>
                  </button>
                );
              })}
            </div>
            {suggestedTasks.length > 6 && (
              <p className="text-xs text-gray-400 text-center">
                +{suggestedTasks.length - 6} more suggestions available
              </p>
            )}
          </div>
        )}

        {/* CTA to add target programs */}
        <div className="pt-2 border-t">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/schools">
              <GraduationCap className="w-4 h-4 mr-2" />
              Add Target Programs for More Tasks
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default SuggestedTasksWidget;
