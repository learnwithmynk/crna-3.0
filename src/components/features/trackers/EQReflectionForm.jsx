/**
 * EQReflectionForm Component
 *
 * Guided reflection form with structured prompts:
 * - Title (brief description of the situation)
 * - Date
 * - Categories (multi-select)
 * - Structured reflection sections:
 *   - Describe the situation
 *   - What emotions did you experience?
 *   - How did you respond?
 *   - What would you do differently?
 *   - What did you learn about yourself?
 * - Optional tags
 * - Points indicator (+2 points)
 */

import { useState } from 'react';
import { Star, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { SectionHeader } from '@/components/ui/label-text';
import { cn } from '@/lib/utils';
import { EQ_CATEGORIES } from '@/data/mockEQReflections';

/**
 * Category selector with multi-select
 */
function CategorySelector({ selected, onChange }) {
  const toggleCategory = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="space-y-2">
      <Label>
        Categories <span className="text-red-500">*</span>
      </Label>
      <div className="flex flex-wrap gap-2">
        {EQ_CATEGORIES.map((cat) => {
          const isSelected = selected.includes(cat.value);
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => toggleCategory(cat.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                'border focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary/50',
                isSelected
                  ? cat.color + ' border-transparent'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              )}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Reflection prompt section with helper text
 */
function ReflectionSection({ label, helpText, value, onChange, placeholder, rows = 3 }) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <Label className="text-gray-700">{label}</Label>
        {helpText && (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            {helpText}
          </span>
        )}
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="resize-none"
      />
    </div>
  );
}

/**
 * Main form component
 */
export function EQReflectionForm({
  initialValues = {},
  promptContext = null, // Pre-filled from prompt card
  onSave,
  onCancel,
  isEditing = false,
  className,
}) {
  // Form state
  const [form, setForm] = useState({
    title: initialValues.title || '',
    date: initialValues.date || new Date().toISOString().split('T')[0],
    categories: initialValues.categories || (promptContext?.category ? [promptContext.category] : []),
    structuredReflection: {
      situation: initialValues.structuredReflection?.situation || '',
      emotions: initialValues.structuredReflection?.emotions || '',
      response: initialValues.structuredReflection?.response || '',
      different: initialValues.structuredReflection?.different || '',
      learned: initialValues.structuredReflection?.learned || '',
    },
  });

  // Form handlers
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleReflectionChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      structuredReflection: { ...prev.structuredReflection, [field]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      id: initialValues.id || `eq_${Date.now()}`,
      userId: 'user_123', // TODO: Get from auth context
    });
  };

  // Validation
  const isValid =
    form.title.trim() &&
    form.categories.length > 0 &&
    form.structuredReflection.situation.trim();

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-5', className)}>
      {/* Prompt Context Banner (if started from a prompt) */}
      {promptContext && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
          <h4 className="font-medium text-indigo-900 mb-1">
            {promptContext.title}
          </h4>
          <p className="text-sm text-indigo-700">
            {promptContext.prompt}
          </p>
          {promptContext.followUp && (
            <p className="text-xs text-indigo-600 mt-2 italic">
              Also consider: {promptContext.followUp}
            </p>
          )}
        </div>
      )}

      {/* Basic Info Section */}
      <div className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g., Advocating for my patient during rounds"
          />
          <p className="text-xs text-gray-400">
            A brief description of the situation or experience
          </p>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={form.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-48"
          />
        </div>

        {/* Categories */}
        <CategorySelector
          selected={form.categories}
          onChange={(value) => handleChange('categories', value)}
        />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Structured Reflection Section */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-widest">
          Your Reflection
        </h4>

        <ReflectionSection
          label="Describe the situation"
          helpText="Be specific"
          value={form.structuredReflection.situation}
          onChange={(v) => handleReflectionChange('situation', v)}
          placeholder="What happened? Set the scene..."
          rows={3}
        />

        <ReflectionSection
          label="What emotions did you experience?"
          value={form.structuredReflection.emotions}
          onChange={(v) => handleReflectionChange('emotions', v)}
          placeholder="How did you feel in the moment? Any conflicting emotions?"
          rows={2}
        />

        <ReflectionSection
          label="How did you respond?"
          value={form.structuredReflection.response}
          onChange={(v) => handleReflectionChange('response', v)}
          placeholder="What actions did you take? What did you say or do?"
          rows={3}
        />

        <ReflectionSection
          label="What would you do differently?"
          helpText="Hindsight is 20/20"
          value={form.structuredReflection.different}
          onChange={(v) => handleReflectionChange('different', v)}
          placeholder="Looking back, is there anything you'd change?"
          rows={2}
        />

        <ReflectionSection
          label="What did you learn about yourself?"
          helpText="Key takeaway"
          value={form.structuredReflection.learned}
          onChange={(v) => handleReflectionChange('learned', v)}
          placeholder="What insights will you carry forward?"
          rows={2}
        />
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <div className="flex items-center gap-2">
          <Button type="submit" disabled={!isValid}>
            {isEditing ? 'Update Reflection' : 'Save Reflection'}
          </Button>
          {!isEditing && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500" />
              +5 pts
            </span>
          )}
        </div>
      </div>
    </form>
  );
}

export default EQReflectionForm;
