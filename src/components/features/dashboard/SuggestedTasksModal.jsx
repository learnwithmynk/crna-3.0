/**
 * SuggestedTasksModal - Modal for viewing and adding suggested tasks
 *
 * Features:
 * - Shows suggestions filtered by user profile data
 * - Individual "+ Add" buttons that change to "Added ✓" when clicked
 * - X button on hover to permanently dismiss suggestions
 * - Tracks added tasks within the session
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Lightbulb,
  Plus,
  Check,
  X,
  GraduationCap,
  Award,
  Calendar,
  FileText,
  User,
  ListTodo,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

// Category labels
const CATEGORY_LABELS = {
  gre: 'GRE',
  'ccrn-prep': 'CCRN Prep',
  ccrn: 'CCRN',
  shadowing: 'Shadowing',
  profile: 'Profile',
  resume: 'Resume',
  'personal-statement': 'Personal Statement',
};

export function SuggestedTasksModal({
  open,
  onOpenChange,
  suggestions = [],
  sessionAddedIds = new Set(),
  onAdd,
  onDismiss,
}) {
  // If no suggestions, show empty state
  const hasSuggestions = suggestions.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 rounded-3xl overflow-hidden border-0 shadow-2xl" hideCloseButton>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-amber-100">
              <Lightbulb className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Suggested Tasks</h2>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="px-6 pb-4 text-sm text-gray-400">
          Based on your profile, here are some tasks to consider adding to your to-do list.
        </p>

        {/* Suggestions List */}
        <div className="px-6 max-h-[400px] overflow-y-auto">
          {hasSuggestions ? (
            <div className="space-y-1">
              {suggestions.map((task) => {
                const Icon = CATEGORY_ICONS[task.category] || ListTodo;
                const colorClass = CATEGORY_COLORS[task.category] || 'bg-gray-100 text-gray-700';
                const isAdded = sessionAddedIds.has(task.id);

                return (
                  <div
                    key={task.id}
                    className="group flex items-center gap-4 py-4 transition-colors"
                  >
                    {/* Category Icon */}
                    <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shrink-0", colorClass)}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Task Name */}
                    <p className={cn(
                      "flex-1 min-w-0 font-medium",
                      isAdded ? "text-green-600" : "text-gray-900"
                    )}>
                      {task.task}
                    </p>

                    {/* Action */}
                    <div className="shrink-0">
                      {isAdded ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                          <Check className="w-4 h-4" />
                          Added
                        </span>
                      ) : (
                        <button
                          onClick={() => onAdd?.(task)}
                          className="text-sm font-semibold text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                          + ADD
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Check className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">
                No more suggestions available
              </p>
              <p className="text-gray-400 text-xs mt-1">
                You've added or dismissed all suggested tasks
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-gray-100 mt-4 flex items-center justify-between">
          <button
            onClick={() => {
              // Dismiss all remaining suggestions
              suggestions.forEach(task => onDismiss?.(task.id));
              onOpenChange?.(false);
            }}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Don't Show Again
          </button>
          <Button
            variant="outline"
            onClick={() => onOpenChange?.(false)}
            className="rounded-full px-6"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SuggestedTasksModal;
