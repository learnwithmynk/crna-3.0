/**
 * GRE Edit Sheet
 *
 * Sheet component for editing GRE scores.
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
import { Checkbox } from '@/components/ui/checkbox';

export function GreEditSheet({ open, onOpenChange, initialValues, onSave }) {
  const [formData, setFormData] = useState({
    greQuantitative: '',
    greVerbal: '',
    greAnalyticalWriting: '',
    noGreRequired: false,
  });

  useEffect(() => {
    if (initialValues) {
      setFormData({
        greQuantitative: initialValues.greQuantitative?.toString() || '',
        greVerbal: initialValues.greVerbal?.toString() || '',
        greAnalyticalWriting: initialValues.greAnalyticalWriting?.toString() || '',
        noGreRequired: initialValues.noGreRequired || false,
      });
    }
  }, [initialValues, open]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave?.({
      greQuantitative: parseInt(formData.greQuantitative) || null,
      greVerbal: parseInt(formData.greVerbal) || null,
      greAnalyticalWriting: parseFloat(formData.greAnalyticalWriting) || null,
      greCombined: (parseInt(formData.greQuantitative) || 0) + (parseInt(formData.greVerbal) || 0),
      noGreRequired: formData.noGreRequired,
    });
    onOpenChange(false);
  };

  const combined = (parseInt(formData.greQuantitative) || 0) + (parseInt(formData.greVerbal) || 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit GRE Scores</SheetTitle>
          <SheetDescription>
            Update your GRE test scores. Many programs are becoming GRE-optional.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="noGreRequired"
              checked={formData.noGreRequired}
              onCheckedChange={(checked) => handleChange('noGreRequired', checked)}
            />
            <Label htmlFor="noGreRequired" className="text-sm">
              My target programs don't require GRE
            </Label>
          </div>

          {!formData.noGreRequired && (
            <>
              <div className="space-y-2">
                <Label htmlFor="greQuantitative">Quantitative Score</Label>
                <Input
                  id="greQuantitative"
                  type="number"
                  min="130"
                  max="170"
                  placeholder="130-170"
                  value={formData.greQuantitative}
                  onChange={(e) => handleChange('greQuantitative', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="greVerbal">Verbal Score</Label>
                <Input
                  id="greVerbal"
                  type="number"
                  min="130"
                  max="170"
                  placeholder="130-170"
                  value={formData.greVerbal}
                  onChange={(e) => handleChange('greVerbal', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="greAnalyticalWriting">Analytical Writing</Label>
                <Input
                  id="greAnalyticalWriting"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.0-6.0"
                  value={formData.greAnalyticalWriting}
                  onChange={(e) => handleChange('greAnalyticalWriting', e.target.value)}
                />
              </div>

              {combined > 0 && (
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-700">
                    <strong>Combined Score:</strong> {combined}
                  </p>
                </div>
              )}
            </>
          )}

          <div className="p-3 bg-purple-50 rounded-xl">
            <p className="text-sm text-purple-700">
              <strong>Note:</strong> GRE scores are valid for 5 years. Check your target programs
              for specific score requirements.
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

export default GreEditSheet;
