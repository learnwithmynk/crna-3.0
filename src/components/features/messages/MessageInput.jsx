/**
 * MessageInput Component
 *
 * Compose message input with send button.
 * Supports Enter to send (Shift+Enter for newline).
 */

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export function MessageInput({
  onSend,
  sending = false,
  placeholder = 'Type a message...',
  disabled = false,
  autoFocus = false,
  className
}) {
  const [content, setContent] = useState('');
  const textareaRef = useRef(null);

  // Auto-focus on mount if requested
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Handle send
  const handleSend = async () => {
    if (!content.trim() || sending || disabled) return;

    const message = content.trim();
    setContent('');

    await onSend?.(message);

    // Re-focus after sending
    textareaRef.current?.focus();
  };

  // Handle key press
  const handleKeyDown = (e) => {
    // Enter to send (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleChange = (e) => {
    setContent(e.target.value);

    // Auto-resize
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
  };

  const canSend = content.trim().length > 0 && !sending && !disabled;

  return (
    <div className={cn('flex gap-2 items-end', className)}>
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || sending}
        className="min-h-[44px] max-h-[150px] resize-none py-3"
        rows={1}
      />
      <Button
        onClick={handleSend}
        disabled={!canSend}
        size="icon"
        className="h-11 w-11 shrink-0"
      >
        <Send className={cn('h-4 w-4', sending && 'animate-pulse')} />
      </Button>
    </div>
  );
}

export default MessageInput;
