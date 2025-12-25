/**
 * PostActivitySheet Component
 *
 * Sheet/drawer for creating a new activity post in a group.
 */

import { useState } from 'react';
import { Send } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

export function PostActivitySheet({
  open,
  onOpenChange,
  groupName,
  onSubmit
}) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      await onSubmit?.(content);
      setContent('');
      onOpenChange?.(false);
    } catch (err) {
      console.error('Failed to post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onOpenChange?.(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>New Post</SheetTitle>
          <SheetDescription>
            Share something with {groupName || 'this group'}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="What's on your mind?"
            minHeight={200}
            disabled={submitting}
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={submitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !content.trim()}
              className="flex-1"
            >
              {submitting ? (
                'Posting...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default PostActivitySheet;
