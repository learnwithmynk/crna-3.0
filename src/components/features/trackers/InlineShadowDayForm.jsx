/**
 * InlineShadowDayForm Component
 *
 * Inline (non-modal) form for logging shadow day entries.
 * Expands in place when user clicks "Log Shadow Day" button.
 * Matches the pattern of InlineClinicalEntryForm.
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Calendar, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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

/**
 * Skill toggle button (pill style)
 */
function SkillButton({ skill, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(skill)}
      className={cn(
        'px-3 py-1.5 rounded-full text-sm border transition-all duration-200',
        'hover:shadow-sm',
        selected
          ? 'bg-orange-50 border-orange-300 text-orange-900 font-medium'
          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
      )}
    >
      {skill}
    </button>
  );
}

/**
 * Main InlineShadowDayForm component
 */
export function InlineShadowDayForm({ onSubmit, onCancel, initialValues }) {
  const isEditing = !!initialValues?.id;

  const [formData, setFormData] = useState({
    date: '',
    location: '',
    crnaName: '',
    crnaEmail: '',
    hours: '',
    cases: '',
    skills: [],
    notes: '',
  });

  // Initialize form when mounted or initialValues change
  useEffect(() => {
    if (initialValues) {
      setFormData({
        date: initialValues.date ? new Date(initialValues.date).toISOString().split('T')[0] : '',
        location: initialValues.location || '',
        crnaName: initialValues.crnaName || initialValues.providerName || '',
        crnaEmail: initialValues.crnaEmail || initialValues.providerEmail || '',
        hours: initialValues.hours || initialValues.hoursLogged || '',
        cases: initialValues.cases || initialValues.casesObserved || '',
        skills: initialValues.skills || initialValues.skillsObserved || [],
        notes: initialValues.notes || '',
      });
    } else {
      // Reset to defaults for new entry
      setFormData({
        date: new Date().toISOString().split('T')[0],
        location: '',
        crnaName: '',
        crnaEmail: '',
        hours: '',
        cases: '',
        skills: [],
        notes: '',
      });
    }
  }, [initialValues]);

  const toggleSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      hours: parseFloat(formData.hours) || 0,
      cases: parseInt(formData.cases) || 0,
    });
  };

  const isValid = formData.date && formData.location && formData.crnaName && formData.hours && formData.cases;

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl border border-orange-100 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-200 to-orange-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-orange-700" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Shadow Day' : 'Log Shadow Day'}
          </h3>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top row: Date and Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="shadow-date">
              Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="shadow-date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="shadow-location">
              Location <span className="text-red-500">*</span>
            </Label>
            <Input
              id="shadow-location"
              type="text"
              placeholder="e.g., Kaiser Permanente"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              className="mt-1"
            />
          </div>
        </div>

        {/* CRNA Info row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="crna-name">
              CRNA Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="crna-name"
              type="text"
              placeholder="Who did you shadow?"
              value={formData.crnaName}
              onChange={(e) => setFormData({ ...formData, crnaName: e.target.value })}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="crna-email">Email (optional)</Label>
            <Input
              id="crna-email"
              type="email"
              placeholder="For thank you notes & letter requests"
              value={formData.crnaEmail}
              onChange={(e) => setFormData({ ...formData, crnaEmail: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>

        {/* Hours and Cases */}
        <div className="grid grid-cols-2 gap-4 max-w-xs">
          <div>
            <Label htmlFor="shadow-hours">
              Hours <span className="text-red-500">*</span>
            </Label>
            <Input
              id="shadow-hours"
              type="number"
              step="0.5"
              min="0"
              placeholder="8"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="shadow-cases">
              Cases <span className="text-red-500">*</span>
            </Label>
            <Input
              id="shadow-cases"
              type="number"
              min="0"
              placeholder="3"
              value={formData.cases}
              onChange={(e) => setFormData({ ...formData, cases: e.target.value })}
              required
              className="mt-1"
            />
          </div>
        </div>

        {/* Skills Observed */}
        <div className="space-y-3">
          <Label>Skills Observed</Label>
          <p className="text-xs text-gray-500">Select all skills you observed during this shadow day</p>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SKILLS.map((skill) => (
              <SkillButton
                key={skill}
                skill={skill}
                selected={formData.skills.includes(skill)}
                onToggle={toggleSkill}
              />
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="shadow-notes">Notes (optional)</Label>
          <textarea
            id="shadow-notes"
            rows={4}
            placeholder="What did you observe? What did you learn? Any memorable moments?"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-2xl focus:outline-none focus:bg-white focus:border-orange-400/40 focus:shadow-[0_0_0_3px_rgba(251,146,60,0.15),0_0_12px_rgba(251,146,60,0.1)] outline-none text-sm mt-1 placeholder:text-gray-400"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <div className="flex flex-col items-center gap-1">
            <Button
              type="submit"
              disabled={!isValid}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white disabled:opacity-50"
            >
              {isEditing ? 'Save Changes' : 'Log Shadow Day'}
            </Button>
            {!isEditing && <span className="text-xs text-orange-600 font-medium">+5 pts</span>}
          </div>
        </div>
      </form>
    </Card>
  );
}

export default InlineShadowDayForm;
