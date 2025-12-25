/**
 * ReplyCard Component
 *
 * Displays a single reply in a topic thread with BuddyBoss features:
 * - Nested/threaded replies (indentation based on depth)
 * - Reaction buttons (like, love, laugh, etc.)
 * - Reply button for nested responses
 * - Report functionality
 * - Image/media attachments
 * - @mention highlighting
 */

import { useState } from 'react';
import {
  MoreHorizontal,
  Flag,
  Pencil,
  Trash2,
  MessageSquare,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { HtmlContent } from '@/components/ui/html-content';
import { RelativeTime } from '@/components/ui/relative-time';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { availableReactions } from '@/data/mockReplies';

// Role badge component (Circle.so style)
function RoleBadge({ role }) {
  if (!role) return null;

  const roleStyles = {
    admin: 'bg-emerald-500 text-white',
    moderator: 'bg-amber-500 text-white',
    srna: 'bg-purple-500 text-white',
  };

  const roleLabels = {
    admin: 'ADMIN',
    moderator: 'MODERATOR',
    srna: 'SRNA',
  };

  return (
    <Badge className={cn('text-[10px] px-1.5 py-0 font-semibold', roleStyles[role])}>
      {roleLabels[role]}
    </Badge>
  );
}

// Reaction button - Circle.so style simple text
function ReactionButton({ reactions, currentUserId, onReact }) {
  const [showPicker, setShowPicker] = useState(false);

  // Get count of all reactions
  const totalReactions = Object.values(reactions || {}).reduce(
    (sum, users) => sum + (users?.length || 0),
    0
  );

  // Get user's current reaction
  const userReaction = Object.entries(reactions || {}).find(
    ([, users]) => users?.includes(currentUserId)
  )?.[0];

  // Get top reaction emojis to display
  const topReactions = Object.entries(reactions || {})
    .filter(([, users]) => users?.length > 0)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 2);

  const handleReact = (reactionId) => {
    onReact?.(reactionId);
    setShowPicker(false);
  };

  return (
    <Popover open={showPicker} onOpenChange={setShowPicker}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1',
            userReaction && 'text-blue-600'
          )}
        >
          {topReactions.length > 0 && (
            <span className="flex -space-x-0.5">
              {topReactions.map(([id]) => {
                const reaction = availableReactions.find(r => r.id === id);
                return <span key={id} className="text-sm">{reaction?.icon}</span>;
              })}
            </span>
          )}
          {totalReactions > 0 ? (
            <span>{totalReactions} {totalReactions === 1 ? 'like' : 'likes'}</span>
          ) : (
            <span>Like</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 bg-white shadow-lg border border-gray-200 rounded-full" align="start">
        <div className="flex gap-2">
          {availableReactions.map((reaction) => (
            <button
              key={reaction.id}
              onClick={() => handleReact(reaction.id)}
              className={cn(
                'p-2 rounded-full hover:bg-gray-100 transition-transform hover:scale-125',
                userReaction === reaction.id && 'bg-blue-50 ring-2 ring-blue-200'
              )}
              title={reaction.label}
            >
              <span className="text-2xl">{reaction.icon}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Report dialog component
function ReportDialog({ open, onOpenChange, onSubmit }) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit?.(reason);
      setReason('');
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Reply</DialogTitle>
          <DialogDescription>
            Help us understand why you're reporting this reply. Our team will review it.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="report-reason">Reason for reporting</Label>
            <Textarea
              id="report-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please describe why you're reporting this content..."
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!reason.trim() || submitting}
            variant="destructive"
          >
            {submitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Media gallery for images
function MediaGallery({ media }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  if (!media || media.length === 0) return null;

  const openLightbox = (item) => {
    setActiveImage(item);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-3">
        {media.map((item) => (
          <button
            key={item.id}
            onClick={() => openLightbox(item)}
            className="relative rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <img
              src={item.thumbnail || item.url}
              alt={item.alt || 'Attached image'}
              className="w-24 h-24 object-cover"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute right-2 top-2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            <X className="w-5 h-5" />
          </button>
          {activeImage && (
            <img
              src={activeImage.url}
              alt={activeImage.alt || 'Full size image'}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function ReplyCard({
  reply,
  isAuthor = false,
  currentUserId = 999,
  onEdit,
  onDelete,
  onReport,
  onReply,
  onReact,
  maxDepth = 3,
  className
}) {
  const {
    author,
    content,
    created,
    edited,
    depth = 0,
    reactions,
    media,
    reply_count
  } = reply;

  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  // Calculate indentation based on depth (max 3 levels, then stop indenting)
  const indentLevel = Math.min(depth, maxDepth);
  const indentPx = indentLevel * 40; // 40px per level

  const handleReport = async (reason) => {
    await onReport?.(reply, reason);
  };

  return (
    <>
      <div
        className={cn(
          'py-3 px-4',
          depth === 0 && 'border-b border-gray-100 last:border-b-0',
          depth > 0 && 'ml-14 pt-2 pb-2',
          className
        )}
      >
        <div className="flex items-start gap-3">
          {/* Author avatar - smaller for nested replies */}
          <Avatar className={cn('shrink-0', depth > 0 ? 'w-8 h-8' : 'w-10 h-10')}>
            <img
              src={author.avatar}
              alt={author.name}
              className="w-full h-full object-cover"
            />
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header row with name, badge, time, and actions */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-900">
                    {author.name}
                  </span>
                  <RoleBadge role={author.role} />
                  <span className="text-gray-400">·</span>
                  <RelativeTime date={created} className="text-sm text-gray-500" />
                  {edited && (
                    <span className="text-xs text-gray-400">(edited)</span>
                  )}
                </div>
              </div>

              {/* Actions dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                    <span className="sr-only">Reply actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isAuthor && (
                    <>
                      <DropdownMenuItem onClick={onEdit}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit Reply
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={onDelete}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Reply
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={() => setReportDialogOpen(true)}>
                    <Flag className="w-4 h-4 mr-2" />
                    Report Reply
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Reply content with @mention styling */}
            <HtmlContent
              html={content.rendered}
              className="text-gray-700 mt-1 [&_.mention]:text-blue-600 [&_.mention]:font-medium [&_.mention]:hover:underline [&_.mention]:cursor-pointer"
            />

            {/* Media attachments */}
            <MediaGallery media={media} />

            {/* Action buttons row - Circle.so style text links */}
            <div className="flex items-center gap-4 mt-2">
              {/* Reply button */}
              <button
                onClick={() => onReply?.(reply)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Reply
                {reply_count > 0 && ` (${reply_count})`}
              </button>

              {/* Like button with count */}
              <ReactionButton
                reactions={reactions}
                currentUserId={currentUserId}
                onReact={(reactionId) => onReact?.(reply.id, reactionId)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Report dialog */}
      <ReportDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        onSubmit={handleReport}
      />
    </>
  );
}

export default ReplyCard;
