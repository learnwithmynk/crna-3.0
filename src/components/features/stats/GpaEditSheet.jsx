/**
 * GPA Edit Sheet
 *
 * Sheet component for editing GPA values.
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
import { Input, Label } from '@/components/ui/input';
import { isValidGpaInput, parseGpa } from '@/lib/validators';

export function GpaEditSheet({ open, onOpenChange, initialValues, onSave }) {
  const [formData, setFormData] = useState({
    overallGpa: '',
    scienceGpa: '',
    last60Gpa: '',
  });

  useEffect(() => {
    if (initialValues) {
      setFormData({
        overallGpa: initialValues.overallGpa?.toString() || '',
        scienceGpa: initialValues.scienceGpa?.toString() || '',
        last60Gpa: initialValues.last60Gpa?.toString() || '',
      });
    }
  }, [initialValues, open]);

  const handleChange = (field, value) => {
    if (isValidGpaInput(value)) {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = () => {
    onSave?.({
      overallGpa: parseGpa(formData.overallGpa),
      scienceGpa: parseGpa(formData.scienceGpa),
      last60Gpa: parseGpa(formData.last60Gpa),
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit GPA</SheetTitle>
          <SheetDescription>
            Update your GPA information. Use our GPA Calculator for accurate calculations.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="overallGpa">Overall GPA</Label>
            <Input
              id="overallGpa"
              type="text"
              inputMode="decimal"
              placeholder="e.g., 3.50"
              value={formData.overallGpa}
              onChange={(e) => handleChange('overallGpa', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="scienceGpa">Science GPA</Label>
            <Input
              id="scienceGpa"
              type="text"
              inputMode="decimal"
              placeholder="e.g., 3.40"
              value={formData.scienceGpa}
              onChange={(e) => handleChange('scienceGpa', e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Biology, Chemistry, Physics, Math courses
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="last60Gpa">Last 60 Credits GPA</Label>
            <Input
              id="last60Gpa"
              type="text"
              inputMode="decimal"
              placeholder="e.g., 3.60"
              value={formData.last60Gpa}
              onChange={(e) => handleChange('last60Gpa', e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Some programs look at your most recent 60 credit hours
            </p>
          </div>

          <div className="p-3 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-700">
              <strong>Tip:</strong> Use our{' '}
              <a href="/tools/gpa-calculator" className="underline hover:no-underline">
                GPA Calculator
              </a>{' '}
              to calculate these values from your transcript.
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

export default GpaEditSheet;
