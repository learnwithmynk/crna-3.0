/**
 * UnitProfileSetup Component
 *
 * Inline prompt card that appears after 5 clinical entries.
 * Collects unit profile to enable smart suggestions and peer comparisons.
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Building2,
  Sparkles,
  MapPin,
  Calendar,
  Activity,
  Check,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  UNIT_TYPES,
  HOSPITAL_TYPES,
  TRAUMA_LEVELS,
  SHIFT_PATTERNS,
  TYPICAL_SHIFTS,
  UNIT_CAPABILITIES,
} from '@/data/mockUserUnitProfile';

/**
 * Prompt card shown inline
 */
export function UnitProfilePromptCard({ entryCount, onSetupClick, className }) {
  if (entryCount < 5) {
    // Show progress toward unlocking
    return (
      <Card className={cn('p-4 bg-gray-50 border-dashed', className)}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-200 rounded-xl">
            <Lock className="w-5 h-5 text-gray-500" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-600">Unlock Smart Suggestions</h4>
            <p className="text-sm text-gray-500">
              Log {5 - entryCount} more shift{5 - entryCount !== 1 ? 's' : ''} to enable peer comparisons
            </p>
          </div>
          <div className="text-2xl font-bold text-gray-400">{entryCount}/5</div>
        </div>
      </Card>
    );
  }

  // Show setup prompt
  return (
    <Card
      className={cn(
        'p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-100 cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
      onClick={onSetupClick}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 rounded-xl">
          <Sparkles className="w-5 h-5 text-purple-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-purple-900">Unlock Smart Suggestions!</h4>
          <p className="text-sm text-purple-700">
            Tell us about your unit to get personalized peer comparisons
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-purple-400" />
      </div>
    </Card>
  );
}

/**
 * Select button group
 */
function SelectGroup({ options, value, onChange, columns = 2 }) {
  return (
    <div className={cn('grid gap-2', `grid-cols-${columns}`)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'px-3 py-2 text-sm text-left rounded-xl border transition-all',
            value === option.value
              ? 'bg-primary/20 border-primary text-gray-900 font-medium'
              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Checkbox group for capabilities
 */
function CapabilityCheckboxes({ selected, onChange }) {
  const toggle = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {UNIT_CAPABILITIES.map((cap) => (
        <label
          key={cap.value}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all',
            selected.includes(cap.value)
              ? 'bg-green-50 border-green-200'
              : 'bg-white border-gray-200 hover:border-gray-300'
          )}
        >
          <input
            type="checkbox"
            checked={selected.includes(cap.value)}
            onChange={() => toggle(cap.value)}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm">{cap.label}</span>
        </label>
      ))}
    </div>
  );
}

/**
 * Main UnitProfileSetup form (Sheet)
 */
export function UnitProfileSetupSheet({ open, onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Unit info
    unitType: '',
    // Hospital info
    hospitalName: '',
    hospitalCity: '',
    hospitalState: '',
    hospitalType: '',
    traumaLevel: '',
    magnetStatus: false,
    // Capabilities
    capabilities: [],
    // Schedule
    shiftPattern: '',
    typicalShift: '',
  });

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.unitType && formData.hospitalName && formData.hospitalState;
      case 2:
        return formData.capabilities.length > 0;
      case 3:
        return formData.shiftPattern && formData.typicalShift;
      default:
        return false;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Unit Profile Setup
          </SheetTitle>
        </SheetHeader>

        {/* Progress indicator */}
        <div className="flex gap-2 my-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                'flex-1 h-2 rounded-full',
                s <= step ? 'bg-purple-500' : 'bg-gray-200'
              )}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Unit & Hospital Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-gray-500" />
                <h3 className="font-medium">Your ICU & Hospital</h3>
              </div>

              <div>
                <Label>ICU Type *</Label>
                <SelectGroup
                  options={UNIT_TYPES}
                  value={formData.unitType}
                  onChange={(v) => setFormData({ ...formData, unitType: v })}
                  columns={1}
                />
              </div>

              <div>
                <Label htmlFor="hospitalName">Hospital Name *</Label>
                <Input
                  id="hospitalName"
                  placeholder="e.g., Stanford Medical Center"
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="hospitalCity">City</Label>
                  <Input
                    id="hospitalCity"
                    placeholder="City"
                    value={formData.hospitalCity}
                    onChange={(e) => setFormData({ ...formData, hospitalCity: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="hospitalState">State *</Label>
                  <Input
                    id="hospitalState"
                    placeholder="CA"
                    maxLength={2}
                    value={formData.hospitalState}
                    onChange={(e) => setFormData({ ...formData, hospitalState: e.target.value.toUpperCase() })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Hospital Type</Label>
                <SelectGroup
                  options={HOSPITAL_TYPES}
                  value={formData.hospitalType}
                  onChange={(v) => setFormData({ ...formData, hospitalType: v })}
                />
              </div>

              <div>
                <Label>Trauma Designation</Label>
                <SelectGroup
                  options={TRAUMA_LEVELS}
                  value={formData.traumaLevel}
                  onChange={(v) => setFormData({ ...formData, traumaLevel: v })}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.magnetStatus}
                  onChange={(e) => setFormData({ ...formData, magnetStatus: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">Magnet-designated hospital</span>
              </label>
            </div>
          )}

          {/* Step 2: Unit Capabilities */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-gray-500" />
                <h3 className="font-medium">Unit Capabilities</h3>
              </div>

              <p className="text-sm text-gray-600">
                What advanced devices/therapies does your unit have access to?
              </p>

              <CapabilityCheckboxes
                selected={formData.capabilities}
                onChange={(caps) => setFormData({ ...formData, capabilities: caps })}
              />

              <p className="text-xs text-gray-500">
                This helps us give you relevant suggestions and compare to similar units
              </p>
            </div>
          )}

          {/* Step 3: Schedule */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-gray-500" />
                <h3 className="font-medium">Your Schedule</h3>
              </div>

              <div>
                <Label>Shift Pattern *</Label>
                <SelectGroup
                  options={SHIFT_PATTERNS}
                  value={formData.shiftPattern}
                  onChange={(v) => setFormData({ ...formData, shiftPattern: v })}
                />
              </div>

              <div>
                <Label>Typical Shift *</Label>
                <SelectGroup
                  options={TYPICAL_SHIFTS}
                  value={formData.typicalShift}
                  onChange={(v) => setFormData({ ...formData, typicalShift: v })}
                  columns={3}
                />
              </div>

              <p className="text-xs text-gray-500">
                This helps us remind you to log shifts and celebrate your consistency!
              </p>
            </div>
          )}

          {/* Footer */}
          <SheetFooter className="mt-6 pt-4 border-t">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}

            {step < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
                className="ml-auto"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!canProceed()}
                className="ml-auto bg-purple-600 hover:bg-purple-700"
              >
                <Check className="w-4 h-4 mr-1" />
                Complete Setup
              </Button>
            )}
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default UnitProfileSetupSheet;
