/**
 * ProgramTasksTab - Tasks table for a specific program
 *
 * Features:
 * - Table view with Status, Task, Status badge, Due Date, Actions
 * - View Completed toggle
 * - Matches existing dashboard task patterns
 */

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Plus,
  ExternalLink,
  Trash2,
  Calendar,
  ListTodo,
  Eye,
  EyeOff,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDateFull } from '@/lib/dateFormatters';
import { GlobalTaskDeleteDialog } from './GlobalTaskDeleteDialog';
import { ChecklistSyncDialog } from './ChecklistSyncDialog';
import { GLOBAL_TASK_CATEGORIES, TASK_CHECKLIST_SYNC_MAP } from '@/data/taskConfig';

// formatDate moved to @/lib/dateFormatters (use formatDateFull with '' fallback)

/**
 * Check if date is overdue
 */
function isOverdue(dateStr) {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return date < now;
}

/**
 * Map task status to StatusBadge status
 */
function mapTaskStatus(status) {
  switch (status) {
    case 'not_started':
      return 'not_started';
    case 'in_progress':
      return 'in_progress';
    case 'completed':
      return 'completed';
    default:
      return 'not_started';
  }
}

export function ProgramTasksTab({
  tasks = [],
  programId,
  programName,
  onDeleteTask,
  onCompleteTask,
  onDeleteGlobalTask,
  onSyncChecklist,
  targetProgramCount = 0,
}) {
  const [showCompleted, setShowCompleted] = useState(false);
  const [deleteDialogTask, setDeleteDialogTask] = useState(null);
  const [syncDialogTask, setSyncDialogTask] = useState(null);

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

  // Handle task completion
  const handleCompleteTask = (task) => {
    if (shouldTriggerSync(task) && task.status !== 'completed') {
      // Show sync dialog before completing
      setSyncDialogTask(task);
    } else {
      // Just toggle completion
      if (onCompleteTask) {
        onCompleteTask(task.id);
      }
    }
  };

  // Handle task deletion
  const handleDeleteTask = (task) => {
    if (isGlobalTask(task)) {
      // Show global delete confirmation
      setDeleteDialogTask(task);
    } else {
      // Regular delete
      if (onDeleteTask) {
        onDeleteTask(task.id);
      }
    }
  };

  // Confirm global task deletion
  const confirmGlobalDelete = () => {
    if (deleteDialogTask && onDeleteGlobalTask) {
      onDeleteGlobalTask(deleteDialogTask.id);
    }
    setDeleteDialogTask(null);
  };

  // Confirm checklist sync after task completion
  const confirmChecklistSync = () => {
    if (syncDialogTask) {
      // First complete the task
      if (onCompleteTask) {
        onCompleteTask(syncDialogTask.id);
      }
      // Then sync checklists
      if (onSyncChecklist) {
        const itemIds = getChecklistItemsToSync(syncDialogTask);
        onSyncChecklist(itemIds);
      }
    }
    setSyncDialogTask(null);
  };

  // Complete task without syncing
  const completeWithoutSync = () => {
    if (syncDialogTask && onCompleteTask) {
      onCompleteTask(syncDialogTask.id);
    }
    setSyncDialogTask(null);
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    if (showCompleted) {
      return tasks;
    }
    return tasks.filter(task => task.status !== 'completed');
  }, [tasks, showCompleted]);

  // Sort: overdue first, then by due date
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      // Completed tasks last
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;

      // Overdue first
      const aOverdue = isOverdue(a.dueDate);
      const bOverdue = isOverdue(b.dueDate);
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;

      // Then by due date
      const dateA = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
      const dateB = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
      return dateA - dateB;
    });
  }, [filteredTasks]);

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const activeCount = tasks.length - completedCount;

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={ListTodo}
        title="No tasks yet"
        description="Add tasks to track your progress on this application."
        actionLabel="Add Task"
        onAction={() => {
          // TODO: Open task creation modal/drawer
          console.log('Add task for program:', programId);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">
          Program Tasks
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({activeCount} active{completedCount > 0 ? `, ${completedCount} completed` : ''})
          </span>
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowCompleted(!showCompleted)}
          className="text-sm"
        >
          {showCompleted ? (
            <>
              <EyeOff className="w-4 h-4 mr-1.5" />
              Hide Completed
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-1.5" />
              View Completed
            </>
          )}
        </Button>
      </div>

      {/* Tasks Table */}
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-widest w-10">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-widest">
                Task
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-widest hidden sm:table-cell">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-widest">
                Due Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-widest w-20">
                Actions
              </th>
            </tr>
          </thead>
        </table>
        {/* Scrollable body limited to ~8 tasks */}
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full">
            <tbody className="divide-y divide-gray-200 bg-white">
            {sortedTasks.map((task) => {
              const overdue = isOverdue(task.dueDate) && task.status !== 'completed';

              return (
                <tr
                  key={task.id}
                  className={cn(
                    "hover:bg-gray-50 transition-colors",
                    task.status === 'completed' && "bg-gray-50 opacity-60"
                  )}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={task.status === 'completed'}
                      onCheckedChange={() => handleCompleteTask(task)}
                      variant="successLight"
                    />
                  </td>

                  {/* Task Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-sm",
                        task.status === 'completed' && "line-through text-gray-400"
                      )}>
                        {task.task}
                      </span>
                      {/* Global Task Badge */}
                      {isGlobalTask(task) && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="secondary" className="gap-1 text-xs py-0 px-1.5">
                                <Globe className="w-3 h-3" />
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs max-w-xs">
                              Global task - applies to all your target schools.
                              {task.linkedSchoolName && (
                                <span className="block mt-1 text-gray-400">
                                  Deadline based on: {task.linkedSchoolName}
                                </span>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <StatusBadge status={mapTaskStatus(task.status)} size="sm" />
                  </td>

                  {/* Due Date */}
                  <td className="px-4 py-3">
                    <span className={cn(
                      "text-sm flex items-center gap-1.5",
                      overdue ? "text-red-600 font-medium" : "text-gray-600"
                    )}>
                      {overdue && <Calendar className="w-3.5 h-3.5" />}
                      {formatDateFull(task.dueDate, '')}
                      {overdue && <span className="text-xs">(Overdue)</span>}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-0">
                      <button
                        className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Edit task"
                        aria-label={`Edit task: ${task.task}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task)}
                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title={isGlobalTask(task) ? "Delete global task" : "Delete task"}
                        aria-label={`Delete task: ${task.task}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Task Button */}
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => {
          // TODO: Open task creation modal/drawer
          console.log('Add task for program:', programId);
        }}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Task
      </Button>

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
        schoolCount={targetProgramCount}
        onConfirm={confirmChecklistSync}
        source="task"
      />
    </div>
  );
}
