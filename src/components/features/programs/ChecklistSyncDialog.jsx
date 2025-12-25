/**
 * ChecklistSyncDialog - Confirmation dialog for syncing checklist items across schools
 *
 * Shows when user completes a global task (GRE Exam, CCRN Certification) or
 * when user updates their profile to indicate they have GRE scores or CCRN.
 *
 * Asks if they want to mark all related checklist items complete across all schools.
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
import { CheckCircle2, PartyPopper, School } from 'lucide-react';

export function ChecklistSyncDialog({
  open,
  onClose,
  itemType, // 'gre' | 'ccrn'
  schoolCount,
  onConfirm,
  source = 'task', // 'task' | 'profile'
}) {
  // Get display name for the item type
  const getItemTypeName = () => {
    if (itemType === 'gre') return 'GRE';
    if (itemType === 'ccrn') return 'CCRN';
    return itemType;
  };

  const itemTypeName = getItemTypeName();

  // Get the title based on source
  const getTitle = () => {
    if (source === 'task') {
      return `Completed ${itemTypeName}!`;
    }
    return `${itemTypeName} Added to Profile`;
  };

  // Get the description based on source
  const getDescription = () => {
    if (source === 'task') {
      return `You completed your ${itemTypeName}! Would you like to mark all ${itemTypeName}-related checklist items complete across your target schools?`;
    }
    return `You've added your ${itemTypeName} to your profile. Would you like to mark all ${itemTypeName}-related checklist items complete across your target schools?`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PartyPopper className="w-5 h-5 text-amber-500" />
            {getTitle()}
          </DialogTitle>
          <DialogDescription className="text-left space-y-3 pt-2">
            <p>{getDescription()}</p>

            {schoolCount > 0 && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
                <School className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-blue-700">
                  This will update <strong>{schoolCount} target school{schoolCount !== 1 ? 's' : ''}</strong>
                </span>
              </div>
            )}

            <div className="text-sm text-gray-500">
              Items to be marked complete:
              <ul className="mt-1 ml-4 list-disc">
                {itemType === 'gre' && (
                  <>
                    <li>Complete the GRE</li>
                    <li>Send GRE Scores</li>
                  </>
                )}
                {itemType === 'ccrn' && (
                  <li>Complete CCRN</li>
                )}
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Not Now
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full sm:w-auto"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark All Complete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ChecklistSyncDialog;
