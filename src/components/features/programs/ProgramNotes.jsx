/**
 * ProgramNotes - Auto-saving notes section for program
 *
 * Features:
 * - Auto-saving textarea with debounce
 * - Save indicator (Saving... / Saved)
 * - Placeholder text
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/input';
import { StickyNote, Check, Loader2 } from 'lucide-react';

export function ProgramNotes({ notes = '', onChange }) {
  const [value, setValue] = useState(notes);
  const [saveState, setSaveState] = useState('saved'); // 'saved' | 'saving' | 'unsaved'
  const debounceTimerRef = useRef(null);

  // Sync with external notes prop
  useEffect(() => {
    setValue(notes);
  }, [notes]);

  // Handle textarea change with debounced save
  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    setSaveState('unsaved');

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounce timer (1 second)
    debounceTimerRef.current = setTimeout(() => {
      setSaveState('saving');
      // Simulate save delay
      setTimeout(() => {
        onChange(newValue);
        setSaveState('saved');
      }, 300);
    }, 1000);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <StickyNote className="w-5 h-5 text-primary" />
            Notes
          </CardTitle>

          {/* Save State Indicator */}
          <div className="flex items-center gap-1.5 text-xs">
            {saveState === 'saving' && (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                <span className="text-gray-400">Saving...</span>
              </>
            )}
            {saveState === 'saved' && value && (
              <>
                <Check className="w-3 h-3 text-green-500" />
                <span className="text-green-600">Saved</span>
              </>
            )}
            {saveState === 'unsaved' && (
              <span className="text-yellow-600">Unsaved changes</span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Textarea
          value={value}
          onChange={handleChange}
          placeholder="Add your personal notes about this program here..."
          className="min-h-[120px] resize-none text-sm"
        />
        <p className="mt-2 text-xs text-gray-400">
          Notes auto-save as you type
        </p>
      </CardContent>
    </Card>
  );
}
