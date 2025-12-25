/**
 * BlockEditor Component
 *
 * Editor.js-powered block editor for creating lesson content.
 * Used by admin/VA to create and edit lesson content.
 *
 * Features:
 * - All standard Editor.js blocks (header, list, image, etc.)
 * - Autosave with debounce
 * - 5-level undo/redo history
 * - Save status indicator
 */

import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import { getEditorTools, EDITOR_CONFIG } from '@/lib/editorjs-config';
import { cn } from '@/lib/utils';

// Autosave delay in milliseconds
const AUTOSAVE_DELAY = 2000;

// Max undo history levels
const MAX_HISTORY = 5;

/**
 * BlockEditor Component
 *
 * @param {Object} props
 * @param {Object} props.initialData - Initial Editor.js data
 * @param {Function} props.onSave - Called when content is saved (data) => void
 * @param {Function} props.onChange - Called on any change (data) => void
 * @param {boolean} props.readOnly - Whether editor is read-only
 * @param {boolean} props.autosave - Enable autosave (default: true)
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.className - Additional CSS classes
 */
const BlockEditor = forwardRef(function BlockEditor(
  {
    initialData,
    onSave,
    onChange,
    readOnly = false,
    autosave = true,
    placeholder,
    className,
  },
  ref
) {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const autosaveTimerRef = useRef(null);
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);

  const [isReady, setIsReady] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'unsaved'
  const [lastSaved, setLastSaved] = useState(null);

  // Initialize Editor.js
  useEffect(() => {
    if (!editorRef.current || editorInstanceRef.current) return;

    const editor = new EditorJS({
      holder: editorRef.current,
      tools: getEditorTools(),
      data: initialData || { blocks: [] },
      placeholder: placeholder || EDITOR_CONFIG.placeholder,
      minHeight: EDITOR_CONFIG.minHeight,
      readOnly,
      onChange: async () => {
        if (readOnly) return;

        setSaveStatus('unsaved');

        // Get current data
        const data = await editorInstanceRef.current?.save();

        // Call onChange callback
        if (onChange && data) {
          onChange(data);
        }

        // Add to history for undo/redo
        if (data) {
          addToHistory(data);
        }

        // Trigger autosave
        if (autosave && onSave) {
          clearTimeout(autosaveTimerRef.current);
          autosaveTimerRef.current = setTimeout(() => {
            handleSave();
          }, AUTOSAVE_DELAY);
        }
      },
      onReady: () => {
        setIsReady(true);
        // Initialize history with initial data
        if (initialData) {
          historyRef.current = [initialData];
          historyIndexRef.current = 0;
        }
      },
    });

    editorInstanceRef.current = editor;

    return () => {
      clearTimeout(autosaveTimerRef.current);
      if (editorInstanceRef.current?.destroy) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, []);

  // Update read-only state
  useEffect(() => {
    if (editorInstanceRef.current?.readOnly) {
      editorInstanceRef.current.readOnly.toggle(readOnly);
    }
  }, [readOnly]);

  // Add data to undo history
  const addToHistory = useCallback((data) => {
    const history = historyRef.current;
    const index = historyIndexRef.current;

    // Remove any "future" states if we're not at the end
    if (index < history.length - 1) {
      historyRef.current = history.slice(0, index + 1);
    }

    // Add new state
    historyRef.current.push(JSON.parse(JSON.stringify(data)));

    // Trim to max history
    if (historyRef.current.length > MAX_HISTORY) {
      historyRef.current.shift();
    }

    historyIndexRef.current = historyRef.current.length - 1;
  }, []);

  // Save content
  const handleSave = useCallback(async () => {
    if (!editorInstanceRef.current || !onSave) return;

    setSaveStatus('saving');

    try {
      const data = await editorInstanceRef.current.save();
      await onSave(data);
      setSaveStatus('saved');
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving editor content:', error);
      setSaveStatus('unsaved');
    }
  }, [onSave]);

  // Undo
  const undo = useCallback(async () => {
    const index = historyIndexRef.current;
    if (index <= 0) return;

    historyIndexRef.current = index - 1;
    const data = historyRef.current[historyIndexRef.current];

    if (data && editorInstanceRef.current) {
      await editorInstanceRef.current.render(data);
      setSaveStatus('unsaved');
    }
  }, []);

  // Redo
  const redo = useCallback(async () => {
    const index = historyIndexRef.current;
    const history = historyRef.current;

    if (index >= history.length - 1) return;

    historyIndexRef.current = index + 1;
    const data = history[historyIndexRef.current];

    if (data && editorInstanceRef.current) {
      await editorInstanceRef.current.render(data);
      setSaveStatus('unsaved');
    }
  }, []);

  // Get current data
  const getData = useCallback(async () => {
    if (!editorInstanceRef.current) return null;
    return await editorInstanceRef.current.save();
  }, []);

  // Clear editor
  const clear = useCallback(async () => {
    if (!editorInstanceRef.current) return;
    await editorInstanceRef.current.clear();
    historyRef.current = [{ blocks: [] }];
    historyIndexRef.current = 0;
    setSaveStatus('unsaved');
  }, []);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    save: handleSave,
    getData,
    undo,
    redo,
    clear,
    canUndo: () => historyIndexRef.current > 0,
    canRedo: () => historyIndexRef.current < historyRef.current.length - 1,
  }));

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle if editor is focused
      if (!editorRef.current?.contains(document.activeElement)) return;

      // Cmd/Ctrl + Z = Undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Cmd/Ctrl + Shift + Z = Redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }

      // Cmd/Ctrl + S = Save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, handleSave]);

  // Format last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return null;

    const diff = Date.now() - lastSaved.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 min ago';
    return `${minutes} mins ago`;
  };

  return (
    <div className={cn('block-editor', className)}>
      {/* Save Status Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b text-sm">
        <div className="flex items-center gap-2">
          {saveStatus === 'saving' && (
            <>
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-gray-600">Saving...</span>
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-gray-600">
                Saved {formatLastSaved() && `· ${formatLastSaved()}`}
              </span>
            </>
          )}
          {saveStatus === 'unsaved' && (
            <>
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-gray-600">Unsaved changes</span>
            </>
          )}
        </div>

        {!readOnly && (
          <div className="flex items-center gap-1 text-gray-500">
            <button
              onClick={undo}
              disabled={historyIndexRef.current <= 0}
              className="px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
              title="Undo (⌘Z)"
            >
              Undo
            </button>
            <button
              onClick={redo}
              disabled={historyIndexRef.current >= historyRef.current.length - 1}
              className="px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
              title="Redo (⌘⇧Z)"
            >
              Redo
            </button>
          </div>
        )}
      </div>

      {/* Editor Container */}
      <div
        ref={editorRef}
        className={cn(
          'prose prose-sm max-w-none p-4 min-h-[300px]',
          'focus-within:outline-none',
          !isReady && 'opacity-50'
        )}
      />
    </div>
  );
});

export default BlockEditor;
export { BlockEditor };
