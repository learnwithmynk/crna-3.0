/**
 * ReplyForm Component
 *
 * Rich text form for composing replies to topics with BuddyBoss features:
 * - Rich text editing
 * - @mention autocomplete
 * - Image upload
 * - Submit button and loading state
 * - @mention validation with warnings
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { Send, Image as ImageIcon, X, AtSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { mockUsers } from '@/data/mockTopics';
import { MentionWarning } from '@/components/features/community/MentionWarning';
import { validateMentions } from '@/lib/mentionValidator';

// Get all mentionable users for autocomplete
const mentionableUsers = Object.values(mockUsers).filter(u => u.id !== 999); // Exclude current user

// Mention autocomplete popover
function MentionAutocomplete({ open, onOpenChange, onSelect, searchTerm }) {
  const filteredUsers = mentionableUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!open || filteredUsers.length === 0) return null;

  return (
    <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
      <div className="p-2">
        <p className="text-xs text-gray-500 mb-2">Mention someone</p>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {filteredUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => onSelect(user)}
              className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-100 text-left"
            >
              <Avatar className="w-6 h-6">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </Avatar>
              <span className="text-sm font-medium">{user.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Image preview component
function ImagePreviews({ images, onRemove }) {
  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3 p-3 bg-gray-50 rounded-xl">
      {images.map((image, index) => (
        <div key={index} className="relative group">
          <img
            src={image.preview}
            alt={`Upload ${index + 1}`}
            className="w-20 h-20 object-cover rounded-xl border border-gray-200"
          />
          <button
            onClick={() => onRemove(index)}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function ReplyForm({
  onSubmit,
  placeholder = 'Write your reply...',
  submitLabel = 'Post Reply',
  initialContent = '',
  minHeight = 100,
  disabled = false,
  showImageUpload = true,
  className
}) {
  const [content, setContent] = useState(initialContent);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [invalidMentions, setInvalidMentions] = useState([]);
  const fileInputRef = useRef(null);
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

  const handleSubmit = async () => {
    const plainText = getPlainText(content).trim();
    if ((!plainText && images.length === 0) || submitting || disabled) return;

    setSubmitting(true);
    try {
      await onSubmit?.({
        content,
        images: images.map(img => ({
          file: img.file,
          preview: img.preview
        })),
        honeypot
      });
      setContent('');
      setImages([]);
      setHoneypot('');
    } catch (err) {
      console.error('Failed to submit reply:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages].slice(0, 4)); // Max 4 images
    e.target.value = ''; // Reset input
  };

  // Remove image
  const handleRemoveImage = (index) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // Handle mention selection
  const handleMentionSelect = (user) => {
    // Insert mention at cursor position (simplified - inserts at end)
    const mentionHtml = `<span class="mention" data-user-id="${user.id}">@${user.name}</span>&nbsp;`;
    setContent(prev => prev + mentionHtml);
    setMentionOpen(false);
    setMentionSearch('');
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, []);

  const plainContent = getPlainText(content).trim();
  const canSubmit = (plainContent.length > 0 || images.length > 0) && !submitting && !disabled;

  return (
    <Card className={cn('p-4', className)}>
      <h3 className="font-medium text-gray-900 mb-3">Post a Reply</h3>

      <div className="relative">
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder={placeholder}
          minHeight={minHeight}
          disabled={disabled || submitting}
        />

        {/* Mention autocomplete */}
        <MentionAutocomplete
          open={mentionOpen}
          onOpenChange={setMentionOpen}
          onSelect={handleMentionSelect}
          searchTerm={mentionSearch}
        />
      </div>

      {/* Mention validation warning */}
      {invalidMentions.length > 0 && (
        <div className="mt-3">
          <MentionWarning invalidMentions={invalidMentions} />
        </div>
      )}

      {/* Image previews */}
      <ImagePreviews images={images} onRemove={handleRemoveImage} />

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

      <div className="flex items-center justify-between mt-3">
        {/* Left side actions */}
        <div className="flex items-center gap-2">
          {/* Image upload button */}
          {showImageUpload && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || submitting || images.length >= 4}
                className="text-gray-500"
              >
                <ImageIcon className="w-4 h-4 mr-1" />
                <span className="text-xs">Image</span>
              </Button>
            </>
          )}

          {/* Mention button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setMentionOpen(!mentionOpen)}
            disabled={disabled || submitting}
            className="text-gray-500"
          >
            <AtSign className="w-4 h-4 mr-1" />
            <span className="text-xs">Mention</span>
          </Button>

          {/* Character count hint */}
          <p className="text-xs text-gray-400 ml-2">
            {plainContent.length > 0 && `${plainContent.length} characters`}
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {submitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Posting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              {submitLabel}
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}

// Compact variant for inline replies
export function ReplyFormCompact({
  onSubmit,
  placeholder = 'Write a reply...',
  disabled = false,
  className
}) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  // Strip HTML tags to get plain text for validation
  const getPlainText = (html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  const handleSubmit = async () => {
    const plainText = getPlainText(content).trim();
    if (!plainText || submitting || disabled) return;

    setSubmitting(true);
    try {
      await onSubmit?.(content, honeypot);
      setContent('');
      setHoneypot('');
    } catch (err) {
      console.error('Failed to submit reply:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const plainContent = getPlainText(content).trim();

  return (
    <div className={cn('flex gap-2', className)}>
      <div className="flex-1 relative">
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder={placeholder}
          minHeight={60}
          disabled={disabled || submitting}
          className="flex-1"
        />
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
      </div>
      <Button
        onClick={handleSubmit}
        disabled={!plainContent || submitting || disabled}
        size="sm"
        className="shrink-0 self-end"
      >
        {submitting ? '...' : <Send className="w-4 h-4" />}
      </Button>
    </div>
  );
}

export default ReplyForm;
