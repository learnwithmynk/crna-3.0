/**
 * MessageInput Component
 *
 * Text input for composing and sending messages in conversations.
 * Supports text messages and optional file attachments.
 */

import { useState, useRef } from 'react';
import { Send, Paperclip, X, FileText, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

/**
 * File attachment preview
 */
function AttachmentPreview({ file, onRemove }) {
  const isImage = file.type.startsWith('image/');

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-xl">
      {isImage ? (
        <Image className="w-4 h-4 text-gray-500" />
      ) : (
        <FileText className="w-4 h-4 text-gray-500" />
      )}
      <span className="text-sm text-gray-700 truncate max-w-[150px]">
        {file.name}
      </span>
      <button
        type="button"
        onClick={onRemove}
        className="p-0.5 hover:bg-gray-200 rounded"
        aria-label="Remove attachment"
      >
        <X className="w-3 h-3 text-gray-500" />
      </button>
    </div>
  );
}

export function MessageInput({
  onSend,
  placeholder = 'Type a message...',
  disabled = false,
  allowAttachments = true,
  maxLength = 2000,
  className
}) {
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Handle text change
  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);
    }
  };

  // Handle key press (Enter to send, Shift+Enter for newline)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (25MB max)
      if (file.size > 25 * 1024 * 1024) {
        alert('File size must be less than 25MB');
        return;
      }
      setAttachment(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  // Remove attachment
  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  // Send message
  const handleSend = async () => {
    const trimmedMessage = message.trim();

    // Must have message or attachment
    if (!trimmedMessage && !attachment) return;
    if (disabled || isSending) return;

    setIsSending(true);

    try {
      await onSend({
        content: trimmedMessage || null,
        attachment: attachment || null
      });

      // Clear input on success
      setMessage('');
      setAttachment(null);

      // Focus textarea
      textareaRef.current?.focus();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const canSend = (message.trim().length > 0 || attachment) && !disabled && !isSending;
  const characterCount = message.length;
  const showCharacterCount = characterCount > maxLength * 0.8;

  return (
    <div className={cn('border-t bg-white p-3', className)}>
      {/* Attachment preview */}
      {attachment && (
        <div className="mb-2">
          <AttachmentPreview file={attachment} onRemove={handleRemoveAttachment} />
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2">
        {/* Attachment button */}
        {allowAttachments && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isSending}
              className="shrink-0"
              aria-label="Attach file"
            >
              <Paperclip className="w-5 h-5 text-gray-500" />
            </Button>
          </>
        )}

        {/* Text input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isSending}
            className="min-h-[44px] max-h-[120px] resize-none pr-12"
            rows={1}
          />
          {showCharacterCount && (
            <span
              className={cn(
                'absolute bottom-1 right-2 text-xs',
                characterCount >= maxLength ? 'text-red-500' : 'text-gray-400'
              )}
            >
              {characterCount}/{maxLength}
            </span>
          )}
        </div>

        {/* Send button */}
        <Button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          size="icon"
          className="shrink-0"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>

      {/* Hint text */}
      <p className="text-xs text-gray-400 mt-1 text-center">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}

export default MessageInput;
