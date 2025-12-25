/**
 * TaskEditModal - Clean, minimal popup modal for adding/editing tasks
 *
 * Design based on screenshot:
 * - Clean white modal with rounded corners
 * - Minimal form fields with gray backgrounds
 * - Bold title, uppercase labels
 * - Full-width indigo "Create Task" button
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import { schools } from '@/data/supabase/schools';

export function TaskEditModal({
  open,
  onOpenChange,
  task = null, // null for new task, object for editing
  programs = [], // User's saved/target programs
  lockedProgramId = null, // If set, program is locked to this value
  onSave,
  onDelete,
}) {
  const isEditing = !!task;

  // Form state
  const [formData, setFormData] = useState({
    task: '',
    notes: '',
    programId: lockedProgramId || '',
    dueDate: '',
    priority: 'medium',
  });

  // Get IDs of user's saved/target programs for filtering
  const userProgramIds = useMemo(() => {
    return new Set(programs.map(p => p.program?.id || p.programId));
  }, [programs]);

  // All other schools (not in user's saved/target list)
  const otherSchools = useMemo(() => {
    return schools
      .filter(s => !userProgramIds.has(`school_${s.id}`))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [userProgramIds]);

  // Reset form when task changes or modal opens
  useEffect(() => {
    if (open) {
      if (task) {
        setFormData({
          task: task.task || '',
          notes: task.notes || '',
          programId: task.programId || lockedProgramId || '',
          dueDate: task.dueDate || '',
          priority: task.priority || 'medium',
        });
      } else {
        setFormData({
          task: '',
          notes: '',
          programId: lockedProgramId || '',
          dueDate: '',
          priority: 'medium',
        });
      }
    }
  }, [open, task, lockedProgramId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Only task name is required
    if (!formData.task.trim()) return;

    // Find program name from either user's programs or all schools
    let programName = null;
    if (lockedProgramId) {
      programName = programs.find(p => p.program?.id === lockedProgramId)?.program?.schoolName;
    } else if (formData.programId) {
      // Check user's programs first
      const userProgram = programs.find(p => p.program?.id === formData.programId);
      if (userProgram) {
        programName = userProgram.program?.schoolName;
      } else {
        // Check all schools (for "other schools" selection)
        const schoolId = formData.programId.replace('school_', '');
        const school = schools.find(s => s.id === Number(schoolId));
        programName = school?.name;
      }
    }

    const taskData = {
      ...formData,
      programId: lockedProgramId || formData.programId || null,
      programName: programName || null,
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

  // Format date placeholder
  const formatDatePlaceholder = () => {
    const now = new Date();
    return `e.g., ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 rounded-3xl overflow-hidden border-0 shadow-2xl" hideCloseButton>
        {/* Header with close button */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
          {/* Task Description */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Task Description
            </label>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={formData.task}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
              autoFocus
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-0 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
            />
          </div>

          {/* Program Select (hidden if locked) */}
          {!lockedProgramId ? (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Program
              </label>
              <Select
                value={formData.programId || 'none'}
                onValueChange={(value) => setFormData({ ...formData, programId: value === 'none' ? '' : value })}
              >
                <SelectTrigger className="w-full px-4 py-3.5 h-auto rounded-xl bg-gray-50 border-0 text-gray-900 focus:ring-2 focus:ring-indigo-500/20">
                  <SelectValue placeholder="General Application" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {/* No program option */}
                  <SelectItem value="none" className="rounded-lg">
                    General Application
                  </SelectItem>

                  {/* User's saved/target programs */}
                  {programs.length > 0 && (
                    <>
                      <SelectSeparator />
                      <SelectGroup>
                        <SelectLabel className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                          My Programs
                        </SelectLabel>
                        {programs.map((p) => (
                          <SelectItem
                            key={p.program?.id || p.programId}
                            value={p.program?.id || p.programId}
                            className="rounded-lg"
                          >
                            {p.program?.schoolName || p.program?.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </>
                  )}

                  {/* All other schools */}
                  {otherSchools.length > 0 && (
                    <>
                      <SelectSeparator />
                      <SelectGroup>
                        <SelectLabel className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                          All Schools (A-Z)
                        </SelectLabel>
                        {otherSchools.map((school) => (
                          <SelectItem
                            key={`school_${school.id}`}
                            value={`school_${school.id}`}
                            className="rounded-lg"
                          >
                            {school.name}
                            {school.state && <span className="text-gray-400 ml-1">({school.state})</span>}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Program
              </label>
              <div className="px-4 py-3.5 rounded-xl bg-gray-50 text-gray-600">
                {programs.find(p => p.program?.id === lockedProgramId)?.program?.schoolName || 'Unknown'}
              </div>
            </div>
          )}

          {/* Due Date */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              placeholder={formatDatePlaceholder()}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-0 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-4 h-auto rounded-full bg-gray-900 hover:bg-gray-800 text-white font-semibold text-base"
          >
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>

          {/* Delete button for editing */}
          {isEditing && onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="w-full py-3 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              Delete Task
            </button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
