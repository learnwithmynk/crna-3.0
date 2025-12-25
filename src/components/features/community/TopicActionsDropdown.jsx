/**
 * TopicActionsDropdown Component
 *
 * Dropdown menu for topic actions: edit, delete, subscribe, report.
 * Shows different options based on whether user is the author.
 */

import {
  MoreHorizontal,
  Bell,
  BellOff,
  Pencil,
  Trash2,
  Flag,
  Share2,
  Link2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function TopicActionsDropdown({
  isAuthor = false,
  subscribed = false,
  onEdit,
  onDelete,
  onSubscribe,
  onReport,
  onShare,
  onCopyLink,
  disabled = false
}) {
  const handleCopyLink = () => {
    // Copy current URL to clipboard
    navigator.clipboard.writeText(window.location.href);
    onCopyLink?.();
  };

  const handleShare = () => {
    // Use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href
      }).catch(() => {
        // User cancelled or share failed
      });
    }
    onShare?.();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          className="h-9 w-9 p-0"
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="sr-only">Topic actions</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {/* Subscribe/Unsubscribe */}
        <DropdownMenuItem onClick={onSubscribe}>
          {subscribed ? (
            <>
              <BellOff className="w-4 h-4 mr-2" />
              Unsubscribe
            </>
          ) : (
            <>
              <Bell className="w-4 h-4 mr-2" />
              Subscribe
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Share options */}
        <DropdownMenuItem onClick={handleCopyLink}>
          <Link2 className="w-4 h-4 mr-2" />
          Copy Link
        </DropdownMenuItem>

        {navigator.share && (
          <DropdownMenuItem onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </DropdownMenuItem>
        )}

        {/* Author actions */}
        {isAuthor && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Topic
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Topic
            </DropdownMenuItem>
          </>
        )}

        {/* Report (for non-authors) */}
        {!isAuthor && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onReport}>
              <Flag className="w-4 h-4 mr-2" />
              Report Topic
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default TopicActionsDropdown;
