/**
 * Resume Booster Edit Sheet
 *
 * Sheet component for editing resume boosters (research, committees, volunteering, leadership).
 * Uses structured title/description format instead of single text box.
 */

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { FileText, Users, Heart, Crown, Plus, X } from 'lucide-react';
import { parseEntriesWithIds, entriesToString } from '@/lib/textParsers';

const BOOSTER_TYPES = {
  research: {
    label: 'Research & QI',
    icon: FileText,
    titlePlaceholder: 'e.g., Co-authored poster on early mobility protocols',
    descriptionPlaceholder: 'Describe your role, methodology, outcomes, where presented...',
    hint: 'Add each research project, publication, or QI initiative separately.',
  },
  committees: {
    label: 'Committees',
    icon: Users,
    titlePlaceholder: 'e.g., Unit Practice Council',
    descriptionPlaceholder: 'Your role and contributions to the committee...',
    hint: 'Include committees, councils, and professional groups.',
  },
  volunteering: {
    label: 'Community Involvement',
    icon: Heart,
    titlePlaceholder: 'e.g., Remote Area Medical volunteer',
    descriptionPlaceholder: 'Describe your volunteer work, duration, and impact...',
    hint: 'Add volunteer work, medical missions, community service.',
  },
  leadership: {
    label: 'Leadership',
    icon: Crown,
    titlePlaceholder: 'e.g., Charge Nurse',
    descriptionPlaceholder: 'Frequency, responsibilities, and impact...',
    hint: 'Include charge nurse, precepting, and other leadership roles.',
  },
};

export function ResumeBoosterEditSheet({
  open,
  onOpenChange,
  initialValues,
  onSave,
  boosterType = 'research',
}) {
  const [entries, setEntries] = useState([]);

  const config = BOOSTER_TYPES[boosterType] || BOOSTER_TYPES.research;
  const Icon = config.icon;

  useEffect(() => {
    if (open && initialValues?.[boosterType]) {
      const value = initialValues[boosterType];
      setEntries(parseEntriesWithIds(value));
    } else if (open) {
      setEntries([]);
    }
  }, [initialValues, boosterType, open]);

  const handleAddEntry = () => {
    setEntries(prev => [
      ...prev,
      { id: `entry-${Date.now()}`, title: '', description: '' },
    ]);
  };

  const handleUpdateEntry = (id, field, value) => {
    setEntries(prev => prev.map(entry =>
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const handleRemoveEntry = (id) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleSave = () => {
    // Convert entries back to string format for storage
    const content = entriesToString(entries);
    onSave?.({ [boosterType]: content });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            Edit {config.label}
          </SheetTitle>
          <SheetDescription>
            {config.hint}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4">
          {/* Entries List */}
          {entries.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Icon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No entries yet</p>
              <p className="text-xs text-gray-400">Click "Add New" to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry, index) => (
                <div
                  key={entry.id}
                  className="p-3 border rounded-xl bg-gray-50 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs text-gray-400 font-medium mt-2">
                      #{index + 1}
                    </span>
                    <div className="flex-1 space-y-2">
                      <div>
                        <Label className="text-xs text-gray-600">Title</Label>
                        <Input
                          placeholder={config.titlePlaceholder}
                          value={entry.title}
                          onChange={(e) => handleUpdateEntry(entry.id, 'title', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Description</Label>
                        <Textarea
                          placeholder={config.descriptionPlaceholder}
                          value={entry.description}
                          onChange={(e) => handleUpdateEntry(entry.id, 'description', e.target.value)}
                          rows={2}
                          className="mt-1 resize-none"
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                      onClick={() => handleRemoveEntry(entry.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddEntry}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add New
          </Button>

          <div className="p-3 bg-purple-50 rounded-xl">
            <p className="text-sm text-purple-700">
              <strong>Interview tip:</strong> Be ready to discuss any item listed here.
              Programs love candidates who can articulate their involvement and impact.
            </p>
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default ResumeBoosterEditSheet;
