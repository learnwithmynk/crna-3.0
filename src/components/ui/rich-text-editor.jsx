/**
 * RichTextEditor Component
 *
 * A simple rich text editor for forum posts and replies.
 * Uses contenteditable with basic formatting toolbar.
 *
 * For a full-featured editor, consider integrating Tiptap or Slate.
 * This is a lightweight solution for MVP.
 *
 * Usage:
 *   <RichTextEditor
 *     value={content}
 *     onChange={setContent}
 *     placeholder="Write your reply..."
 *   />
 */

import { useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Undo,
  Redo
} from 'lucide-react';

// Toolbar button component
function ToolbarButton({ icon: Icon, label, onClick, active, disabled }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn(
        'h-8 w-8 p-0',
        active && 'bg-gray-200'
      )}
      onClick={onClick}
      disabled={disabled}
      title={label}
    >
      <Icon className="h-4 w-4" />
      <span className="sr-only">{label}</span>
    </Button>
  );
}

export function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Write something...',
  className,
  minHeight = 120,
  maxHeight = 400,
  disabled = false,
  autoFocus = false,
  onSubmit,
  ...props
}) {
  const editorRef = useRef(null);

  // Initialize content
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // Auto focus
  useEffect(() => {
    if (autoFocus && editorRef.current) {
      editorRef.current.focus();
    }
  }, [autoFocus]);

  // Handle content changes
  const handleInput = useCallback(() => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  // Execute formatting command
  const execCommand = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  }, [handleInput]);

  // Format handlers
  const handleBold = () => execCommand('bold');
  const handleItalic = () => execCommand('italic');
  const handleUnderline = () => execCommand('underline');
  const handleUnorderedList = () => execCommand('insertUnorderedList');
  const handleOrderedList = () => execCommand('insertOrderedList');
  const handleQuote = () => execCommand('formatBlock', 'blockquote');
  const handleUndo = () => execCommand('undo');
  const handleRedo = () => execCommand('redo');

  // Handle link insertion
  const handleLink = useCallback(() => {
    const selection = window.getSelection();
    const selectedText = selection?.toString();

    const url = prompt('Enter URL:', 'https://');
    if (url) {
      if (selectedText) {
        execCommand('createLink', url);
      } else {
        const linkText = prompt('Enter link text:', url);
        if (linkText) {
          execCommand('insertHTML', `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`);
        }
      }
    }
  }, [execCommand]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && onSubmit) {
      e.preventDefault();
      onSubmit();
      return;
    }

    // Ctrl/Cmd + B for bold
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      handleBold();
      return;
    }

    // Ctrl/Cmd + I for italic
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      handleItalic();
      return;
    }

    // Ctrl/Cmd + U for underline
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
      e.preventDefault();
      handleUnderline();
      return;
    }
  }, [onSubmit]);

  // Handle paste - strip formatting from pasted content
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  return (
    <div
      className={cn(
        'border border-gray-300 rounded-xl overflow-hidden',
        'focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1 bg-gray-50 border-b border-gray-200">
        <ToolbarButton icon={Bold} label="Bold (Ctrl+B)" onClick={handleBold} disabled={disabled} />
        <ToolbarButton icon={Italic} label="Italic (Ctrl+I)" onClick={handleItalic} disabled={disabled} />
        <ToolbarButton icon={Underline} label="Underline (Ctrl+U)" onClick={handleUnderline} disabled={disabled} />

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton icon={List} label="Bullet List" onClick={handleUnorderedList} disabled={disabled} />
        <ToolbarButton icon={ListOrdered} label="Numbered List" onClick={handleOrderedList} disabled={disabled} />
        <ToolbarButton icon={Quote} label="Quote" onClick={handleQuote} disabled={disabled} />

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton icon={LinkIcon} label="Insert Link" onClick={handleLink} disabled={disabled} />

        <div className="flex-1" />

        <ToolbarButton icon={Undo} label="Undo" onClick={handleUndo} disabled={disabled} />
        <ToolbarButton icon={Redo} label="Redo" onClick={handleRedo} disabled={disabled} />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        className={cn(
          'px-3 py-2 outline-none overflow-y-auto',
          'prose prose-sm max-w-none',
          'empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400',
          disabled && 'pointer-events-none'
        )}
        style={{
          minHeight: `${minHeight}px`,
          maxHeight: `${maxHeight}px`
        }}
        data-placeholder={placeholder}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        suppressContentEditableWarning
      />

      {/* Footer hint */}
      {onSubmit && (
        <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
          Press <kbd className="px-1 py-0.5 bg-gray-200 rounded text-gray-700">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-gray-200 rounded text-gray-700">Enter</kbd> to submit
        </div>
      )}
    </div>
  );
}

export default RichTextEditor;
