/**
 * ShadowDayForm - Form for logging or editing a shadow day
 * Used in a dialog/sheet for adding new entries or editing existing ones
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';

const AVAILABLE_SKILLS = [
  'Preoperative Assessment',
  'Intubation',
  'Extubation',
  'Invasive Line Placement',
  'Neuraxial Anesthesia',
  'Nerve Block',
  'MAC Sedation',
  'General Anesthesia',
  'LMA',
  'Videoscope',
  'TEE',
  'POCUS',
];

export function ShadowDayForm({ open, onOpenChange, entry, onSubmit }) {
  const isEditing = !!entry;

  const [formData, setFormData] = useState({
    date: entry?.date || '',
    location: entry?.location || '',
    crnaName: entry?.crnaName || '',
    crnaEmail: entry?.crnaEmail || '',
    hours: entry?.hours || '',
    cases: entry?.cases || '',
    skills: entry?.skills || [],
    notes: entry?.notes || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: entry?.id || Date.now(),
      hours: parseFloat(formData.hours),
      cases: parseInt(formData.cases),
    });
    onOpenChange(false);
    // Reset form if adding new
    if (!isEditing) {
      setFormData({
        date: '',
        location: '',
        crnaName: '',
        crnaEmail: '',
        hours: '',
        cases: '',
        skills: [],
        notes: '',
      });
    }
  };

  const toggleSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.includes(skill)
        ? formData.skills.filter(s => s !== skill)
        : [...formData.skills, skill]
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Edit Shadow Day' : 'Log Shadow Day'}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {/* Date */}
          <div>
            <Label htmlFor="date">
              Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">When did you shadow?</p>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">
              Location <span className="text-red-500">*</span>
            </Label>
            <Input
              id="location"
              type="text"
              placeholder="e.g., Kaiser Permanente"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Hospital or clinic name</p>
          </div>

          {/* CRNA Name */}
          <div>
            <Label htmlFor="crnaName">
              Who I Observed <span className="text-red-500">*</span>
            </Label>
            <Input
              id="crnaName"
              type="text"
              placeholder="e.g., Sachi Lord"
              value={formData.crnaName}
              onChange={(e) => setFormData({ ...formData, crnaName: e.target.value })}
              required
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">CRNA's full name</p>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="crnaEmail">Email Address (Optional)</Label>
            <Input
              id="crnaEmail"
              type="email"
              placeholder="for thank you notes & letter requests"
              value={formData.crnaEmail}
              onChange={(e) => setFormData({ ...formData, crnaEmail: e.target.value })}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Save their contact for follow-up shadowing or letters of recommendation
            </p>
          </div>

          {/* Hours and Cases */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hours">
                Hours Logged <span className="text-red-500">*</span>
              </Label>
              <Input
                id="hours"
                type="number"
                step="0.5"
                min="0"
                placeholder="7"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cases">
                Cases Observed <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cases"
                type="number"
                min="0"
                placeholder="2"
                value={formData.cases}
                onChange={(e) => setFormData({ ...formData, cases: e.target.value })}
                required
                className="mt-1"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <Label>Skills Observed</Label>
            <p className="text-xs text-gray-500 mb-3">Select all skills you observed during this shadow day</p>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SKILLS.map((skill) => (
                <Toggle
                  key={skill}
                  pressed={formData.skills.includes(skill)}
                  onPressedChange={() => toggleSkill(skill)}
                >
                  {skill}
                </Toggle>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <textarea
              id="notes"
              rows={4}
              placeholder="What did you observe? What did you learn?"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm mt-1"
            />
          </div>

          {/* Footer */}
          <SheetFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Save Changes' : 'Log Shadow Day'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
