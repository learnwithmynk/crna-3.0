/**
 * EntryFormSheet Component
 *
 * Sheet wrapper for tracker entry forms (add/edit).
 * Bottom sheet on mobile, right drawer on desktop.
 *
 * Example:
 * <EntryFormSheet
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Add Event"
 *   isEditing={false}
 *   onSave={handleSave}
 *   onDelete={handleDelete}
 * >
 *   <EventForm ... />
 * </EntryFormSheet>
 */

import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

/**
 * Hook to detect if screen is desktop (md breakpoint)
 */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  return isDesktop;
}

export function EntryFormSheet({
  open,
  onOpenChange,
  title,
  isEditing = false,
  onSave,
  onDelete,
  children,
  saveDisabled = false,
  saveLabel,
}) {
  const isDesktop = useIsDesktop();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isDesktop ? 'right' : 'bottom'}
        className={!isDesktop ? 'h-[85vh] flex flex-col' : 'flex flex-col'}
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        {/* Scrollable form content */}
        <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6">
          {children}
        </div>

        <SheetFooter className="border-t pt-4 -mx-6 px-6 pb-2">
          {/* Delete button (only when editing) */}
          {isEditing && onDelete && (
            <Button
              variant="ghost"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 mr-auto"
              onClick={onDelete}
            >
              Delete
            </Button>
          )}

          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button onClick={onSave} disabled={saveDisabled}>
            {saveLabel || (isEditing ? 'Save Changes' : 'Add Entry')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
