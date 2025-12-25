/**
 * NewTopicSheet Component
 *
 * Sheet/drawer for creating a new topic in a forum.
 * Includes title input and rich text content editor.
 * Validates @mentions and warns about invalid users.
 */

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
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
import { MentionWarning } from '@/components/features/community/MentionWarning';
import { validateMentions } from '@/lib/mentionValidator';

export function NewTopicSheet({
  open,
  onOpenChange,
  forumName,
  onSubmit
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [honeypot, setHoneypot] = useState('');
  const [invalidMentions, setInvalidMentions] = useState([]);
  const validationTimerRef = useRef(null);

  // Strip HTML tags to get plain text for validation
  const getPlainText = (html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  // Validate mentions when content changes (debounced)
  useEffect(() => {
    // Clear previous timer
    if (validationTimerRef.current) {
      clearTimeout(validationTimerRef.current);
    }

    // Debounce validation by 500ms
    validationTimerRef.current = setTimeout(async () => {
      const plainText = getPlainText(content);
      const result = await validateMentions(plainText);
      setInvalidMentions(result.invalidMentions);
    }, 500);

    // Cleanup timer on unmount
    return () => {
      if (validationTimerRef.current) {
        clearTimeout(validationTimerRef.current);
      }
    };
  }, [content]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    const plainContent = getPlainText(content).trim();
    if (!plainContent) {
      newErrors.content = 'Content is required';
    } else if (plainContent.length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || submitting) return;

    setSubmitting(true);
    try {
      await onSubmit?.({ title, content, honeypot });
      // Reset form on success
      setTitle('');
      setContent('');
      setHoneypot('');
      setErrors({});
      onOpenChange?.(false);
    } catch (err) {
      console.error('Failed to create topic:', err);
      setErrors({ submit: 'Failed to create topic. Please try again.' });
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
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>New Topic</SheetTitle>
          <SheetDescription>
            Create a new discussion in {forumName || 'this forum'}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="topic-title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="topic-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What would you like to discuss?"
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
              placeholder="Share your thoughts, questions, or experiences..."
              minHeight={200}
              disabled={submitting}
              className={errors.content ? 'border-red-500 rounded-lg' : ''}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content}</p>
            )}
            {/* Mention validation warning */}
            {invalidMentions.length > 0 && (
              <MentionWarning invalidMentions={invalidMentions} />
            )}
          </div>

          {/* Honeypot field - hidden from users, bots fill it */}
          <input
            type="text"
            name="website"
            className="sr-only"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            aria-hidden="true"
          />

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
              disabled={submitting || !title.trim() || !getPlainText(content).trim()}
              className="flex-1"
            >
              {submitting ? 'Creating...' : 'Create Topic'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default NewTopicSheet;
