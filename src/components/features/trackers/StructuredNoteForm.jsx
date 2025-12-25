/**
 * StructuredNoteForm Component
 *
 * Guided note-taking form with structured prompts:
 * - What did you learn about this program?
 * - Who did you meet? (Name, role)
 * - What surprised you or stood out?
 * - Would you apply here? Why/why not?
 * - General notes
 *
 * Also handles:
 * - Contact entry (parsed from "Who did you meet")
 * - Program linking (schoolId)
 * - Points indicator (+2 points)
 * - Checklist update indicator
 */

import { useState } from 'react';
import { Star, CheckCircle2, Info, Users, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { EVENT_CATEGORIES } from '@/data/mockTrackedEvents';
import { usePrograms } from '@/hooks/usePrograms';

/**
 * Contact entry row
 */
function ContactEntry({ contact, onUpdate, onRemove, index }) {
  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Name"
        value={contact.name}
        onChange={(e) => onUpdate(index, 'name', e.target.value)}
        className="flex-1"
      />
      <Input
        placeholder="Role (e.g., Program Director)"
        value={contact.role}
        onChange={(e) => onUpdate(index, 'role', e.target.value)}
        className="flex-1"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onRemove(index)}
        className="flex-shrink-0 text-gray-400 hover:text-red-500"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}

/**
 * Main form component
 */
export function StructuredNoteForm({
  initialValues = {},
  linkedProgram = null,
  onSave,
  onCancel,
  isEditing = false,
  className,
}) {
  // Get program data from hook
  const { targetPrograms, savedPrograms } = usePrograms();

  // Form state
  const [form, setForm] = useState({
    title: initialValues.title || '',
    date: initialValues.date || new Date().toISOString().split('T')[0],
    category: initialValues.category || '',
    location: initialValues.location || '',
    schoolId: initialValues.schoolId || linkedProgram?.programId || '',
    structuredNotes: {
      learned: initialValues.structuredNotes?.learned || '',
      peopleMet: initialValues.structuredNotes?.peopleMet || '',
      standout: initialValues.structuredNotes?.standout || '',
      wouldApply: initialValues.structuredNotes?.wouldApply || '',
      general: initialValues.structuredNotes?.general || '',
    },
    contacts: initialValues.contacts || [],
  });

  // Get all programs for dropdown
  const allPrograms = [
    ...targetPrograms.map((p) => ({
      id: p.programId,
      name: p.program.schoolName,
      isTarget: true,
    })),
    ...savedPrograms.map((p) => ({
      id: p.programId,
      name: p.program.schoolName,
      isTarget: false,
    })),
  ];

  // Check if form links to a target program
  const linkedToTarget = form.schoolId && form.schoolId !== 'none'
    ? targetPrograms.some((p) => p.programId === form.schoolId)
    : false;

  // Form handlers
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotesChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      structuredNotes: { ...prev.structuredNotes, [field]: value },
    }));
  };

  const handleAddContact = () => {
    setForm((prev) => ({
      ...prev,
      contacts: [...prev.contacts, { name: '', role: '', school: '', email: '' }],
    }));
  };

  const handleUpdateContact = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      contacts: prev.contacts.map((c, i) =>
        i === index ? { ...c, [field]: value } : c
      ),
    }));
  };

  const handleRemoveContact = (index) => {
    setForm((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Handle "none" selection for schoolId
    const schoolId = form.schoolId === 'none' ? null : form.schoolId;

    // Auto-populate schoolName if schoolId is selected
    const selectedProgram = schoolId ? allPrograms.find((p) => p.id === schoolId) : null;

    onSave({
      ...form,
      schoolId,
      schoolName: selectedProgram?.name || null,
      // Filter out empty contacts
      contacts: form.contacts.filter((c) => c.name.trim()),
    });
  };

  // Validation
  const isValid = form.title.trim() && form.category;

  // Check if this is a program-specific event
  const isProgramEvent = ['open_house', 'info_session'].includes(form.category);

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-5', className)}>
      {/* Basic Info Section */}
      <div className="space-y-4">
        {/* Event Title */}
        <div className="space-y-2">
          <Label htmlFor="title">
            Event Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g., Duke CRNA Program Open House"
          />
        </div>

        {/* Date and Category Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">
              Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => handleChange('date', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.category}
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={form.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="e.g., Durham, NC or Virtual"
          />
        </div>

        {/* Link to Program */}
        <div className="space-y-2">
          <Label htmlFor="schoolId">Link to Program (optional)</Label>
          <Select
            value={form.schoolId}
            onValueChange={(value) => handleChange('schoolId', value)}
          >
            <SelectTrigger id="schoolId">
              <SelectValue placeholder="Select a program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {/* Target programs first */}
              {targetPrograms.length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                    Target Programs
                  </div>
                  {targetPrograms.map((p) => (
                    <SelectItem key={p.programId} value={p.programId}>
                      {p.program.schoolName}
                    </SelectItem>
                  ))}
                </>
              )}
              {/* Saved programs (non-target) */}
              {savedPrograms.length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                    Saved Programs
                  </div>
                  {savedPrograms.map((p) => (
                    <SelectItem key={p.programId} value={p.programId}>
                      {p.program.schoolName}
                    </SelectItem>
                  ))}
                </>
              )}
              {/* Separator if there are any saved/target programs */}
              {(targetPrograms.length > 0 || savedPrograms.length > 0) && (
                <div className="my-1 border-t border-gray-200" />
              )}
              {/* Other programs label - only if user has some saved programs */}
              {(targetPrograms.length > 0 || savedPrograms.length > 0) && (
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Other Programs
                </div>
              )}
            </SelectContent>
          </Select>
          {linkedToTarget && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Will update your {allPrograms.find((p) => p.id === form.schoolId)?.name} checklist
            </p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Structured Notes Section */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-widest">
          Capture Your Experience
        </h4>

        {/* What did you learn */}
        <div className="space-y-2">
          <Label htmlFor="learned">What did you learn about this program?</Label>
          <Textarea
            id="learned"
            value={form.structuredNotes.learned}
            onChange={(e) => handleNotesChange('learned', e.target.value)}
            placeholder="e.g., Class size is 30, they have 24/7 sim lab access..."
            rows={2}
          />
        </div>

        {/* Who did you meet */}
        <div className="space-y-2">
          <Label htmlFor="peopleMet">Who did you meet? (Name, role)</Label>
          <Textarea
            id="peopleMet"
            value={form.structuredNotes.peopleMet}
            onChange={(e) => handleNotesChange('peopleMet', e.target.value)}
            placeholder="e.g., Dr. Williams (Program Director), Amanda (Admissions)..."
            rows={2}
          />
        </div>

        {/* Contacts (structured) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-gray-400" />
              Add Contacts (for touchpoint tracking)
            </Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAddContact}
              className="text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Contact
            </Button>
          </div>
          {form.contacts.length > 0 && (
            <div className="space-y-2 pl-2">
              {form.contacts.map((contact, idx) => (
                <ContactEntry
                  key={idx}
                  contact={contact}
                  index={idx}
                  onUpdate={handleUpdateContact}
                  onRemove={handleRemoveContact}
                />
              ))}
            </div>
          )}
        </div>

        {/* What stood out */}
        <div className="space-y-2">
          <Label htmlFor="standout">What surprised you or stood out?</Label>
          <Textarea
            id="standout"
            value={form.structuredNotes.standout}
            onChange={(e) => handleNotesChange('standout', e.target.value)}
            placeholder="e.g., Their 100% board pass rate, the welcoming faculty..."
            rows={2}
          />
        </div>

        {/* Would you apply (only for program events) */}
        {isProgramEvent && form.schoolId && (
          <div className="space-y-2">
            <Label htmlFor="wouldApply">Would you apply here? Why/why not?</Label>
            <Textarea
              id="wouldApply"
              value={form.structuredNotes.wouldApply}
              onChange={(e) => handleNotesChange('wouldApply', e.target.value)}
              placeholder="e.g., Yes - the cardiac focus aligns with my CVICU experience..."
              rows={2}
            />
          </div>
        )}

        {/* General notes */}
        <div className="space-y-2">
          <Label htmlFor="general">General notes</Label>
          <Textarea
            id="general"
            value={form.structuredNotes.general}
            onChange={(e) => handleNotesChange('general', e.target.value)}
            placeholder="Any other thoughts or follow-up items..."
            rows={2}
          />
        </div>
      </div>

      {/* Points Indicator */}
      <div className="flex items-center justify-between py-3 px-4 bg-green-50 rounded-xl border border-green-100">
        <div className="flex items-center gap-2 text-sm text-green-700">
          <Star className="w-4 h-4 text-yellow-500" />
          <span>+5 points for logging this event</span>
        </div>
        {linkedToTarget && (
          <div className="flex items-center gap-2 text-sm text-green-700">
            <CheckCircle2 className="w-4 h-4" />
            <span>Updates checklist</span>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={!isValid}>
          {isEditing ? 'Update Event' : 'Log Event'}
        </Button>
      </div>
    </form>
  );
}

export default StructuredNoteForm;
