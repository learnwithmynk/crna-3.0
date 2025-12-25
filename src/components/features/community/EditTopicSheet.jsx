/**
 * EditTopicSheet Component
 *
 * Sheet/drawer for editing an existing topic.
 * Pre-populates with current topic data.
 */

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

export function EditTopicSheet({
  open,
  onOpenChange,
  topic,
  onSubmit
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Populate form when topic changes
  useEffect(() => {
    if (topic) {
      setTitle(topic.title?.rendered || '');
      setContent(topic.content?.rendered || '');
      setErrors({});
    }
  }, [topic]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || submitting) return;

    setSubmitting(true);
    try {
      await onSubmit?.({
        id: topic.id,
        title,
        content
      });
      onOpenChange?.(false);
    } catch (err) {
      console.error('Failed to update topic:', err);
      setErrors({ submit: 'Failed to update topic. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onOpenChange?.(false);
    }
  };

  // Check if content has changed
  const hasChanges = topic && (
    title !== (topic.title?.rendered || '') ||
    content !== (topic.content?.rendered || '')
  );

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Topic</SheetTitle>
          <SheetDescription>
            Make changes to your topic below
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="edit-topic-title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-topic-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Topic title"
              disabled={submitting}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
            <p className="text-xs text-gray-500">
              {title.length}/200 characters
            </p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label>
              Content <span className="text-red-500">*</span>
            </Label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Topic content..."
              minHeight={200}
              disabled={submitting}
              className={errors.content ? 'border-red-500 rounded-lg' : ''}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content}</p>
            )}
          </div>

          {/* Submit error */}
          {errors.submit && (
            <p className="text-sm text-red-500 text-center">{errors.submit}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
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
              disabled={submitting || !hasChanges || !title.trim() || !content.trim()}
              className="flex-1"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default EditTopicSheet;
