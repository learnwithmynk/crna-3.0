/**
 * NewTopicModal Component
 *
 * Modal dialog for creating a new topic in a forum.
 * Uses the platform's modal styling (centered dialog, not sidebar sheet).
 * Includes title input and rich text content editor.
 * Validates @mentions and warns about invalid users.
 */

import { useState, useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { MentionWarning } from '@/components/features/community/MentionWarning';
import { validateMentions } from '@/lib/mentionValidator';

export function NewTopicModal({
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

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setTitle('');
      setContent('');
      setHoneypot('');
      setErrors({});
      setInvalidMentions([]);
    }
  }, [open]);

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
      setErrors({ submit: err.message || 'Failed to create topic. Please try again.' });
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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border-0 shadow-xl">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-orange-100 to-amber-50 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Start a Discussion
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-0.5">
                Post to {forumName || 'this forum'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 pt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="topic-title" className="text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="topic-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What would you like to discuss?"
              disabled={submitting}
              className={`h-11 rounded-xl border-gray-200 focus:border-orange-300 focus:ring-orange-200 ${errors.title ? 'border-red-500' : ''}`}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
            <p className="text-xs text-gray-400">
              {title.length}/200 characters
            </p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Content <span className="text-red-500">*</span>
            </Label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Share your thoughts, questions, or experiences..."
              minHeight={180}
              disabled={submitting}
              className={`rounded-xl ${errors.content ? 'border-red-500' : 'border-gray-200'}`}
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
            <div className="p-3 bg-red-50 rounded-xl border border-red-200">
              <p className="text-sm text-red-600 text-center">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={submitting}
              className="flex-1 h-11 rounded-full border-gray-300 hover:bg-gray-100 text-gray-700 font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !title.trim() || !getPlainText(content).trim()}
              className="flex-1 h-11 rounded-full bg-gray-900 hover:bg-gray-800 text-white font-medium disabled:bg-gray-300 disabled:text-gray-500"
            >
              {submitting ? 'Posting...' : 'Post Discussion'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NewTopicModal;
