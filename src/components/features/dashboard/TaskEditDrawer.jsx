/**
 * TaskEditDrawer - Slide-out panel for adding/editing tasks
 *
 * Used on:
 * - Dashboard (program dropdown required)
 * - Target Program Detail Page (program pre-filled and locked)
 */

import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2 } from 'lucide-react';

export function TaskEditDrawer({
  open,
  onOpenChange,
  task = null, // null for new task, object for editing
  programs = [],
  lockedProgramId = null, // If set, program is locked to this value
  onSave,
  onDelete,
}) {
  const isEditing = !!task;

  // Form state
  const [formData, setFormData] = useState({
    task: '',
    programId: lockedProgramId || '',
    dueDate: '',
    priority: 'medium',
  });

  // Reset form when task changes or drawer opens
  useEffect(() => {
    if (open) {
      if (task) {
        setFormData({
          task: task.task || '',
          programId: task.programId || lockedProgramId || '',
          dueDate: task.dueDate || '',
          priority: task.priority || 'medium',
        });
      } else {
        setFormData({
          task: '',
          programId: lockedProgramId || '',
          dueDate: '',
          priority: 'medium',
        });
      }
    }
  }, [open, task, lockedProgramId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.task.trim()) return;
    if (!lockedProgramId && !formData.programId) return;

    const programName = lockedProgramId
      ? programs.find(p => p.program.id === lockedProgramId)?.program.schoolName
      : programs.find(p => p.program.id === formData.programId)?.program.schoolName;

    const taskData = {
      ...formData,
      programId: lockedProgramId || formData.programId,
      programName: programName || 'Unknown Program',
      status: task?.status || 'not_started',
    };

    if (task) {
      taskData.id = task.id;
    } else {
      taskData.id = `task_${Date.now()}`;
    }

    onSave?.(taskData);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (task && onDelete) {
      onDelete(task.id);
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Edit Task' : 'Add Task'}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Name */}
          <div className="space-y-2">
            <Label htmlFor="task-name">Task Name *</Label>
            <Input
              id="task-name"
              placeholder="e.g., Complete personal statement"
              value={formData.task}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
              autoFocus
            />
          </div>

          {/* Program Select (hidden if locked) */}
          {!lockedProgramId && (
            <div className="space-y-2">
              <Label htmlFor="program">Program *</Label>
              <Select
                value={formData.programId}
                onValueChange={(value) => setFormData({ ...formData, programId: value })}
              >
                <SelectTrigger id="program">
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((p) => (
                    <SelectItem key={p.program.id} value={p.program.id}>
                      {p.program.schoolName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Locked Program Display */}
          {lockedProgramId && (
            <div className="space-y-2">
              <Label>Program</Label>
              <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-700">
                {programs.find(p => p.program.id === lockedProgramId)?.program.schoolName || 'Unknown Program'}
              </div>
            </div>
          )}

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="due-date">Due Date</Label>
            <Input
              id="due-date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <div className="flex gap-2">
              {['low', 'medium', 'high'].map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority })}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${
                    formData.priority === priority
                      ? priority === 'high'
                        ? 'bg-red-50 border-red-200 text-red-700'
                        : priority === 'medium'
                        ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <SheetFooter className="pt-4 border-t">
            {isEditing && onDelete && (
              <Button
                type="button"
                variant="ghost"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 mr-auto"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Save Changes' : 'Add Task'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
