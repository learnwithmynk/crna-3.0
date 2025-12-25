/**
 * SessionNotesEditor Component
 *
 * Persistent notes editor for booking sessions.
 * Features autosave and supports rich text formatting.
 *
 * TODO: Replace textarea with Editor.js for full rich text support
 * For now, uses a simple textarea with markdown-like formatting.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Save,
  Check,
  Loader2,
  Bold,
  List,
  ListChecks
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSessionNotes } from '@/hooks/useBookings';

// Debounce delay for autosave (ms)
const AUTOSAVE_DELAY = 1500;

/**
 * Convert Editor.js blocks to plain text for display
 */
function blocksToText(blocks) {
  if (!blocks || !Array.isArray(blocks)) return '';

  return blocks.map(block => {
    switch (block.type) {
      case 'header':
        return `## ${block.data?.text || ''}`;
      case 'paragraph':
        return block.data?.text || '';
      case 'list':
        return (block.data?.items || []).map(item => `- ${item}`).join('\n');
      case 'checklist':
        return (block.data?.items || [])
          .map(item => `[${item.checked ? 'x' : ' '}] ${item.text}`)
          .join('\n');
      default:
        return block.data?.text || '';
    }
  }).join('\n\n');
}

/**
 * Convert plain text back to simple Editor.js-like format for storage
 */
function textToBlocks(text) {
  if (!text) return [];

  const lines = text.split('\n');
  const blocks = [];
  let currentParagraph = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Header (##)
    if (trimmed.startsWith('## ')) {
      if (currentParagraph.length) {
        blocks.push({
          type: 'paragraph',
          data: { text: currentParagraph.join('\n') }
        });
        currentParagraph = [];
      }
      blocks.push({
        type: 'header',
        data: { text: trimmed.slice(3), level: 3 }
      });
    }
    // Checklist item ([x] or [ ])
    else if (/^\[[ x]\]/.test(trimmed)) {
      if (currentParagraph.length) {
        blocks.push({
          type: 'paragraph',
          data: { text: currentParagraph.join('\n') }
        });
        currentParagraph = [];
      }
      // Find or create checklist block
      const lastBlock = blocks[blocks.length - 1];
      const checked = trimmed.startsWith('[x]');
      const itemText = trimmed.slice(4).trim();

      if (lastBlock?.type === 'checklist') {
        lastBlock.data.items.push({ text: itemText, checked });
      } else {
        blocks.push({
          type: 'checklist',
          data: { items: [{ text: itemText, checked }] }
        });
      }
    }
    // List item (-)
    else if (trimmed.startsWith('- ')) {
      if (currentParagraph.length) {
        blocks.push({
          type: 'paragraph',
          data: { text: currentParagraph.join('\n') }
        });
        currentParagraph = [];
      }
      // Find or create list block
      const lastBlock = blocks[blocks.length - 1];
      const itemText = trimmed.slice(2).trim();

      if (lastBlock?.type === 'list') {
        lastBlock.data.items.push(itemText);
      } else {
        blocks.push({
          type: 'list',
          data: { items: [itemText], style: 'unordered' }
        });
      }
    }
    // Empty line
    else if (!trimmed) {
      if (currentParagraph.length) {
        blocks.push({
          type: 'paragraph',
          data: { text: currentParagraph.join('\n') }
        });
        currentParagraph = [];
      }
    }
    // Regular text
    else {
      currentParagraph.push(trimmed);
    }
  }

  // Don't forget remaining paragraph
  if (currentParagraph.length) {
    blocks.push({
      type: 'paragraph',
      data: { text: currentParagraph.join('\n') }
    });
  }

  return blocks;
}

/**
 * Formatting toolbar button
 */
function ToolbarButton({ icon: Icon, label, onClick, disabled }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="h-8 w-8 p-0"
      title={label}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}

export function SessionNotesEditor({
  bookingId,
  initialNotes = null,
  readOnly = false,
  className
}) {
  const { notes: savedNotes, saving, saveNotes } = useSessionNotes(bookingId);
  const textareaRef = useRef(null);

  // Convert blocks to text for editing
  const initialText = initialNotes?.blocks
    ? blocksToText(initialNotes.blocks)
    : (savedNotes?.blocks ? blocksToText(savedNotes.blocks) : '');

  const [text, setText] = useState(initialText);
  const [lastSaved, setLastSaved] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Update text when savedNotes changes
  useEffect(() => {
    if (savedNotes?.blocks && !isDirty) {
      setText(blocksToText(savedNotes.blocks));
    }
  }, [savedNotes, isDirty]);

  // Autosave logic
  useEffect(() => {
    if (!isDirty || readOnly) return;

    const timer = setTimeout(async () => {
      const blocks = textToBlocks(text);
      const result = await saveNotes({
        time: Date.now(),
        blocks
      });

      if (result.success) {
        setLastSaved(new Date());
        setIsDirty(false);
      }
    }, AUTOSAVE_DELAY);

    return () => clearTimeout(timer);
  }, [text, isDirty, readOnly, saveNotes]);

  // Handle text change
  const handleChange = useCallback((e) => {
    setText(e.target.value);
    setIsDirty(true);
  }, []);

  // Manual save
  const handleManualSave = useCallback(async () => {
    const blocks = textToBlocks(text);
    const result = await saveNotes({
      time: Date.now(),
      blocks
    });

    if (result.success) {
      setLastSaved(new Date());
      setIsDirty(false);
    }
  }, [text, saveNotes]);

  // Insert formatting helpers
  const insertAtCursor = useCallback((prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);

    const newText =
      text.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      text.substring(end);

    setText(newText);
    setIsDirty(true);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 0);
  }, [text]);

  const insertHeader = () => insertAtCursor('## ');
  const insertList = () => insertAtCursor('- ');
  const insertChecklist = () => insertAtCursor('[ ] ');

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-primary" />
            Session Notes
          </CardTitle>

          <div className="flex items-center gap-2">
            {saving && (
              <Badge variant="secondary" className="text-xs">
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
                Saving...
              </Badge>
            )}
            {!saving && lastSaved && !isDirty && (
              <Badge variant="outline" className="text-xs text-green-600">
                <Check className="w-3 h-3 mr-1" />
                Saved
              </Badge>
            )}
            {isDirty && !saving && (
              <Badge variant="outline" className="text-xs text-yellow-600">
                Unsaved changes
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Formatting toolbar */}
        {!readOnly && (
          <div className="flex items-center gap-1 mb-2 border-b pb-2">
            <ToolbarButton
              icon={Bold}
              label="Add header (## )"
              onClick={insertHeader}
              disabled={readOnly}
            />
            <ToolbarButton
              icon={List}
              label="Add list item (- )"
              onClick={insertList}
              disabled={readOnly}
            />
            <ToolbarButton
              icon={ListChecks}
              label="Add checklist item ([ ] )"
              onClick={insertChecklist}
              disabled={readOnly}
            />
            <div className="flex-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualSave}
              disabled={readOnly || saving || !isDirty}
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        )}

        {/* Editor */}
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          readOnly={readOnly}
          placeholder={readOnly
            ? 'No notes yet.'
            : 'Take notes before, during, or after your session...\n\nTip: Use ## for headers, - for lists, [ ] for checklists'
          }
          className={cn(
            'min-h-[200px] font-mono text-sm resize-y',
            readOnly && 'bg-gray-50 cursor-not-allowed'
          )}
        />

        {/* Last saved timestamp */}
        {lastSaved && (
          <p className="text-xs text-gray-500 mt-2">
            Last saved: {lastSaved.toLocaleTimeString()}
          </p>
        )}

        {/* Formatting hints */}
        {!readOnly && (
          <div className="text-xs text-gray-500 mt-2 space-y-1">
            <p><code className="bg-gray-100 px-1 rounded">## text</code> for headers</p>
            <p><code className="bg-gray-100 px-1 rounded">- item</code> for bullet lists</p>
            <p><code className="bg-gray-100 px-1 rounded">[ ] task</code> or <code className="bg-gray-100 px-1 rounded">[x] done</code> for checklists</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SessionNotesEditor;
