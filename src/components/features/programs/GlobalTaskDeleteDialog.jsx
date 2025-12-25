/**
 * GlobalTaskDeleteDialog - Confirmation dialog for deleting global tasks (GRE/CCRN)
 *
 * Shows friendly copy explaining that:
 * - This is a global task tracking prep across all schools
 * - Deleting removes from dashboard and all school task lists
 * - User can add it back anytime from "Add Suggested Tasks"
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Globe, Trash2 } from 'lucide-react';

export function GlobalTaskDeleteDialog({
  open,
  onClose,
  taskName,
  taskCategory,
  onConfirm,
}) {
  // Determine the category display name
  const getCategoryName = () => {
    if (taskCategory?.includes('gre')) return 'GRE';
    if (taskCategory?.includes('ccrn')) return 'CCRN';
    return 'exam';
  };

  const categoryName = getCategoryName();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            Delete Global Task?
          </DialogTitle>
          <DialogDescription className="text-left space-y-3 pt-2">
            <p>
              <strong className="text-gray-900">{taskName}</strong> is a global task
              that tracks your {categoryName} prep across all your target schools.
            </p>
            <p>
              Deleting it will remove it from your dashboard and all school task lists.
            </p>
            <p className="text-sm text-gray-500 italic">
              You can add it back anytime from any school's "Add Suggested Tasks" button.
            </p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full sm:w-auto"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default GlobalTaskDeleteDialog;
