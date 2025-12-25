/**
 * ToDoListWidget - Task list component with filtering and sorting
 *
 * Used on:
 * - Dashboard (all tasks across programs)
 * - Target Program Detail (program-specific tasks)
 *
 * Features:
 * - Filter by status, program, due date (pill-style dropdowns)
 * - Sortable columns (program, due date)
 * - Completed tasks toggle
 * - Edit/Add task via modal
 * - Suggested tasks modal for adding profile-based suggestions
 *
 * Design: Clean, spacious layout with pill filters and inline task rows
 */

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TaskEditModal } from './TaskEditModal';
import { SuggestedTasksModal } from './SuggestedTasksModal';
import { GlobalTaskDeleteDialog } from '@/components/features/programs/GlobalTaskDeleteDialog';
import { ChecklistSyncDialog } from '@/components/features/programs/ChecklistSyncDialog';
import { GLOBAL_TASK_CATEGORIES, TASK_CHECKLIST_SYNC_MAP, DASHBOARD_SUGGESTED_TASKS } from '@/data/taskConfig';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import { useOnboardingSteps } from '@/hooks/useOnboardingSteps';
import {
  CheckSquare,
  CheckCircle2,
  Plus,
  ChevronDown,
  ChevronUp,
  Globe,
  MoreHorizontal,
  Clock,
  Lightbulb,
} from 'lucide-react';

// Helper: Get time period for a date
function getTimePeriod(dateStr) {
  if (!dateStr) return 'no_date';

  const date = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const diff = date - now;
  const daysDiff = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (daysDiff < 0) return 'overdue';
  if (daysDiff <= 7) return 'this_week';
  if (daysDiff <= 30) return 'this_month';
  return 'later';
}

// Helper: Filter tasks by due date period
function matchesDueDateFilter(task, filter) {
  if (filter === 'all') return true;
  if (filter === 'next_90') {
    const date = new Date(task.dueDate);
    const now = new Date();
    const diff = (date - now) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 90;
  }
  return getTimePeriod(task.dueDate) === filter;
}

// Get current month/year for subtitle
function getCurrentFocus() {
  const now = new Date();
  return now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
}

export function ToDoListWidget({
  tasks = [],
  title = 'My To-Do List',
  showProgramName = true,
  showFilters = true,
  showViewAll = false,
  viewAllHref = '/tasks',
  programs = [],
  programId = null, // Lock to specific program (hides program filter)
  onTaskComplete,
  onTaskSave,
  onTaskDelete,
  onDeleteGlobalTask,
  onSyncChecklist,
  targetProgramCount = 0,
  className = '',
  // Suggestion-related props
  dashboardTasks = [],
  dismissedSuggestions = [],
  onAddDashboardTask,
  onDismissSuggestion,
}) {
  // Get user profile data for filtering suggestions
  const { onboardingData } = useOnboardingStatus();
  const { steps: onboardingSteps } = useOnboardingSteps();

  // Filter state
  const [filters, setFilters] = useState({
    programId: programId || 'all',
  });

  // Sort state
  const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate' or 'program'
  const [sortDir, setSortDir] = useState('asc'); // 'asc' or 'desc'

  // Filter dropdown open states
  const [openDropdown, setOpenDropdown] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Completed tasks toggle
  const [showCompleted, setShowCompleted] = useState(false);

  // Global task dialog state
  const [deleteDialogTask, setDeleteDialogTask] = useState(null);
  const [syncDialogTask, setSyncDialogTask] = useState(null);

  // Suggestions modal state
  const [suggestionsModalOpen, setSuggestionsModalOpen] = useState(false);
  const [sessionAddedIds, setSessionAddedIds] = useState(new Set());

  // Filter suggestions based on user profile data
  const availableSuggestions = useMemo(() => {
    const data = onboardingData || {};
    const greStatus = data.greStatus;
    const certifications = data.certifications || [];
    const shadowHours = data.shadowHours || 0;

    // Check profile completion
    const profileStep = onboardingSteps?.find(s => s.id === 'profile');
    const profileIncomplete = !profileStep?.complete;

    // Get all task names that are already added (from dashboardTasks)
    const addedTaskNames = new Set(dashboardTasks.map(t => t.task));

    return DASHBOARD_SUGGESTED_TASKS.filter(task => {
      // Skip if permanently dismissed
      if (dismissedSuggestions.includes(task.id)) return false;
      // Skip if already in dashboardTasks
      if (addedTaskNames.has(task.task)) return false;

      // Filter based on showIf conditions
      switch (task.showIf) {
        case 'noGre':
          return greStatus !== 'completed' && !data.greQuantitative;
        case 'noCcrn':
          return !certifications.includes('CCRN');
        case 'noShadow':
          return shadowHours === 0;
        case 'profileIncomplete':
          return profileIncomplete;
        case 'noGpa':
          return profileIncomplete;
        case 'noResume':
          return true;
        case 'noPersonalStatement':
          return true;
        default:
          return true;
      }
    });
  }, [onboardingData, onboardingSteps, dashboardTasks, dismissedSuggestions]);

  // Handle adding a suggestion
  const handleAddSuggestion = (task) => {
    if (onAddDashboardTask) {
      onAddDashboardTask(task);
    }
    setSessionAddedIds(prev => new Set([...prev, task.id]));
  };

  // Handle dismissing a suggestion
  const handleDismissSuggestion = (taskId) => {
    if (onDismissSuggestion) {
      onDismissSuggestion(taskId);
    }
  };

  // Show suggestions button only if there are available suggestions
  const showSuggestionsButton = availableSuggestions.length > 0;

  // Check if a task is global
  const isGlobalTask = (task) => {
    return task.isGlobal || GLOBAL_TASK_CATEGORIES.includes(task.category);
  };

  // Check if completing this task should trigger checklist sync
  const shouldTriggerSync = (task) => {
    return TASK_CHECKLIST_SYNC_MAP[task.task] !== undefined;
  };

  // Get checklist item IDs to sync for a task
  const getChecklistItemsToSync = (task) => {
    return TASK_CHECKLIST_SYNC_MAP[task.task] || [];
  };

  // Get item type for sync dialog
  const getSyncItemType = (task) => {
    if (task.category === 'gre') return 'gre';
    if (task.category === 'ccrn' || task.category === 'ccrn-prep') return 'ccrn';
    return task.category;
  };

  // Handle task completion with sync dialog for global tasks
  const handleTaskCompleteWithSync = (task) => {
    if (shouldTriggerSync(task) && task.status !== 'completed') {
      setSyncDialogTask(task);
    } else {
      if (onTaskComplete) {
        onTaskComplete(task.id);
      }
    }
  };

  // Handle task deletion with confirmation for global tasks
  const handleTaskDeleteWithConfirm = (task) => {
    if (isGlobalTask(task)) {
      setDeleteDialogTask(task);
    } else {
      if (onTaskDelete) {
        onTaskDelete(task.id);
      }
    }
  };

  // Confirm global task deletion
  const confirmGlobalDelete = () => {
    if (deleteDialogTask) {
      if (onDeleteGlobalTask) {
        onDeleteGlobalTask(deleteDialogTask.id);
      } else if (onTaskDelete) {
        onTaskDelete(deleteDialogTask.id);
      }
    }
    setDeleteDialogTask(null);
  };

  // Confirm checklist sync after task completion
  const confirmChecklistSync = () => {
    if (syncDialogTask) {
      if (onTaskComplete) {
        onTaskComplete(syncDialogTask.id);
      }
      if (onSyncChecklist) {
        const itemIds = getChecklistItemsToSync(syncDialogTask);
        onSyncChecklist(itemIds);
      }
    }
    setSyncDialogTask(null);
  };

  // Complete task without syncing
  const completeWithoutSync = () => {
    if (syncDialogTask && onTaskComplete) {
      onTaskComplete(syncDialogTask.id);
    }
    setSyncDialogTask(null);
  };

  // Filter and sort tasks - merge program tasks with dashboard tasks
  const { activeTasks, completedTasks } = useMemo(() => {
    // Combine program tasks with dashboard tasks (suggestions that were added)
    const allTasks = [...tasks, ...dashboardTasks];

    let filtered = allTasks.filter((task) => {
      // Program filter
      if (programId) {
        if (task.programId !== programId) return false;
      } else if (filters.programId !== 'all') {
        // Tasks without programId (dashboard tasks) show in "all" but not in specific program filter
        if (task.programId !== filters.programId) return false;
      }

      return true;
    });

    const active = filtered.filter((t) => t.status !== 'completed');
    const completed = allTasks.filter((t) => t.status === 'completed');

    return {
      activeTasks: active,
      completedTasks: completed,
    };
  }, [tasks, dashboardTasks, filters, programId]);

  // Toggle sort - click same column flips direction, click different column switches and resets to asc
  const toggleSort = (column) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  // Sort tasks by selected column
  const sortedTasks = useMemo(() => {
    return [...activeTasks].sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'dueDate') {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        comparison = dateA - dateB;
      } else if (sortBy === 'program') {
        const programA = (a.programName || '').toLowerCase();
        const programB = (b.programName || '').toLowerCase();
        comparison = programA.localeCompare(programB);
      }

      return sortDir === 'desc' ? -comparison : comparison;
    });
  }, [activeTasks, sortBy, sortDir]);

  const handleEditClick = (task, e) => {
    e?.stopPropagation();
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleSave = (taskData) => {
    if (onTaskSave) {
      onTaskSave(taskData);
    }
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleDelete = (taskId) => {
    if (onTaskDelete) {
      onTaskDelete(taskId);
    }
    setModalOpen(false);
    setEditingTask(null);
  };

  // Check if a date is overdue
  const isOverdue = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return date < now;
  };

  // Format date for display (uppercase, e.g., "DEC 18")
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }).toUpperCase();
  };

  // Filter pill component - compact style
  const FilterPill = ({ label, value, options, filterKey, isActive }) => {
    const isOpen = openDropdown === filterKey;

    return (
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(isOpen ? null : filterKey)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all ${
            isActive
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {label}
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpenDropdown(null)}
            />
            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-40 z-20">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFilters({ ...filters, [filterKey]: option.value });
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${
                    filters[filterKey] === option.value
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  // Task row component - clean, spacious design with aligned columns
  const TaskRow = ({ task, isFirst }) => {
    const taskIsGlobal = isGlobalTask(task);
    const overdue = isOverdue(task.dueDate) && task.status !== 'completed';
    const isCompleted = task.status === 'completed';

    return (
      <div
        className={`group grid grid-cols-[auto_1fr_160px_140px] sm:grid-cols-[auto_1fr_160px_140px] items-center gap-4 py-5 px-2 transition-colors cursor-pointer hover:bg-gray-50/50 ${
          !isFirst ? 'border-t border-dashed border-gray-200' : ''
        }`}
        onClick={(e) => {
          if (onTaskSave && !e.target.closest('button')) {
            handleEditClick(task, e);
          }
        }}
      >
        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleTaskCompleteWithSync(task);
          }}
          className={`w-6 h-6 rounded-full border-2 shrink-0 transition-all duration-200 flex items-center justify-center ${
            isCompleted
              ? 'bg-indigo-600 border-indigo-600'
              : 'border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'
          }`}
          aria-label={`Mark "${task.task}" as ${isCompleted ? 'incomplete' : 'complete'}`}
        >
          {isCompleted && (
            <CheckCircle2 className="w-4 h-4 text-white" />
          )}
        </button>

        {/* Task Name */}
        <div className="min-w-0">
          <p className={`font-medium truncate ${isCompleted ? 'line-through text-gray-400' : 'text-gray-900'}`}>
            {task.task}
          </p>
        </div>

        {/* Program with icon */}
        {showProgramName && (
          <div className="flex items-center gap-2 min-w-0">
            {task.programName ? (
              <>
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <span className="text-amber-600 text-xs">◎</span>
                </div>
                <span className="text-sm text-gray-500 truncate">
                  {task.programName}
                </span>
                {/* Global Task Badge */}
                {taskIsGlobal && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="secondary" className="gap-1 text-xs py-0 px-1.5 shrink-0 bg-gray-100">
                          <Globe className="w-3 h-3" />
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs max-w-xs">
                        Global task - applies to all your target schools.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </>
            ) : (
              <span className="text-sm text-gray-400">—</span>
            )}
          </div>
        )}

        {/* Due Date Badge */}
        <div className="flex items-center justify-center gap-2">
          {task.dueDate ? (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
              overdue
                ? 'bg-red-50 text-red-600'
                : 'bg-orange-50 text-orange-600'
            }`}>
              <Clock className="w-3.5 h-3.5 shrink-0" />
              {formatDate(task.dueDate)}
            </div>
          ) : (
            <span className="text-sm text-gray-400">—</span>
          )}

          {/* More menu (3 dots) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(task, e);
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all shrink-0"
            aria-label="Task options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  // Sort arrows component
  const SortArrows = ({ column }) => {
    const isActive = sortBy === column;
    return (
      <span className="flex flex-col -space-y-1">
        <ChevronUp className={`w-3 h-3 ${isActive && sortDir === 'asc' ? 'text-orange-600' : 'text-gray-300'}`} />
        <ChevronDown className={`w-3 h-3 ${isActive && sortDir === 'desc' ? 'text-orange-600' : 'text-gray-300'}`} />
      </span>
    );
  };

  // Table header - aligned with grid columns
  const TableHeader = () => (
    <div className="grid grid-cols-[auto_1fr_160px_140px] sm:grid-cols-[auto_1fr_160px_140px] items-center gap-4 py-3 px-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
      <div className="w-6" /> {/* Checkbox spacer */}
      <div>Task Name</div>
      {showProgramName && (
        <button
          onClick={() => toggleSort('program')}
          className="flex items-center gap-1 hover:text-gray-600 transition-colors"
        >
          Program
          <SortArrows column="program" />
        </button>
      )}
      <button
        onClick={() => toggleSort('dueDate')}
        className="flex items-center justify-center gap-1 hover:text-gray-600 transition-colors"
      >
        Due Date
        <SortArrows column="dueDate" />
      </button>
    </div>
  );

  // Program filter options
  const programOptions = [
    { value: 'all', label: 'All Programs' },
    ...programs.map(p => ({
      value: p.program?.id || p.programId,
      label: p.program?.schoolName || 'Unknown'
    }))
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Card container - clean white, shadow on hover (Apple-style) */}
      <div className="bg-white rounded-[2.5rem] border border-gray-50 overflow-hidden transition-shadow duration-300 ease-apple hover:shadow-soft">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Title with icon */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-100">
                <CheckSquare className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-0.5">
                  Focus for {getCurrentFocus()}
                </p>
              </div>
            </div>

            {/* Filter pills + Action buttons - inline */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Programs filter */}
              {showFilters && !programId && (
                <FilterPill
                  label={filters.programId === 'all' ? 'All Programs' : programs.find(p => (p.program?.id || p.programId) === filters.programId)?.program?.schoolName || 'Program'}
                  value={filters.programId}
                  options={programOptions}
                  filterKey="programId"
                  isActive={filters.programId !== 'all'}
                />
              )}

              {/* Action buttons */}
              {onTaskSave && (
                <Button
                  onClick={handleAddClick}
                  className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-5"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Task
                </Button>
              )}
              {/* Suggestions button */}
              {showSuggestionsButton && onAddDashboardTask && (
                <Button
                  variant="ghost"
                  onClick={() => setSuggestionsModalOpen(true)}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-full px-5"
                >
                  <Lightbulb className="w-4 h-4 mr-1.5" />
                  Suggestions
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Task list */}
        <div className="px-6 pb-2">
          {sortedTasks.length > 0 ? (
            <div>
              <TableHeader />
              <div className={sortedTasks.length > 5 ? 'max-h-96 overflow-y-auto' : ''}>
                {sortedTasks.map((task, index) => (
                  <TaskRow key={task.id} task={task} isFirst={index === 0} />
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              icon={CheckCircle2}
              title="All caught up!"
              description="You have no pending tasks. Great job!"
            />
          )}
        </div>

        {/* Add new task row - dashed border */}
        {onTaskSave && (
          <div className="px-6 pb-6">
            <button
              onClick={handleAddClick}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium uppercase tracking-wider text-sm">New Task</span>
            </button>
          </div>
        )}

        {/* Completed Tasks Toggle */}
        {completedTasks.length > 0 && (
          <div className="px-6 pb-6 border-t border-gray-100">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mt-4"
            >
              {showCompleted ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              <span>
                {showCompleted ? 'Hide' : 'Show'} Completed ({completedTasks.length})
              </span>
            </button>

            {showCompleted && (
              <div className="mt-3">
                {completedTasks.map((task, index) => (
                  <TaskRow key={task.id} task={task} isFirst={index === 0} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      <TaskEditModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        task={editingTask}
        programs={programs}
        lockedProgramId={programId}
        onSave={handleSave}
        onDelete={editingTask ? handleDelete : undefined}
      />

      {/* Global Task Delete Dialog */}
      <GlobalTaskDeleteDialog
        open={!!deleteDialogTask}
        onClose={() => setDeleteDialogTask(null)}
        taskName={deleteDialogTask?.task}
        taskCategory={deleteDialogTask?.category}
        onConfirm={confirmGlobalDelete}
      />

      {/* Checklist Sync Dialog */}
      <ChecklistSyncDialog
        open={!!syncDialogTask}
        onClose={completeWithoutSync}
        itemType={syncDialogTask ? getSyncItemType(syncDialogTask) : null}
        schoolCount={targetProgramCount || programs.length}
        onConfirm={confirmChecklistSync}
        source="task"
      />

      {/* Suggested Tasks Modal */}
      <SuggestedTasksModal
        open={suggestionsModalOpen}
        onOpenChange={setSuggestionsModalOpen}
        suggestions={availableSuggestions}
        sessionAddedIds={sessionAddedIds}
        onAdd={handleAddSuggestion}
        onDismiss={handleDismissSuggestion}
      />
    </div>
  );
}
