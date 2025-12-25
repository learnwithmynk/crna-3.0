/**
 * NewConversationSheet Component
 *
 * Sheet/drawer for starting a new conversation by selecting a recipient.
 */

import { X } from 'lucide-react';
import { RecipientSearch } from './RecipientSearch';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export function NewConversationSheet({
  open,
  onOpenChange,
  onSelectRecipient,
  existingConversationUserIds = []
}) {
  const handleSelect = (user) => {
    onSelectRecipient?.(user);
    onOpenChange?.(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="mb-4">
          <div className="flex items-center justify-between">
            <SheetTitle>New Message</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange?.(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Select a user to start a conversation with:
          </p>

          <RecipientSearch
            onSelect={handleSelect}
            excludeIds={existingConversationUserIds}
            placeholder="Search by name..."
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default NewConversationSheet;
