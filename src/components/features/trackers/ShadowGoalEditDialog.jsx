/**
 * ShadowGoalEditDialog - Dialog for editing shadow hour goal
 * Allows users to set their target shadow hours
 */

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ShadowGoalEditDialog({ open, onOpenChange, currentGoal, onSave }) {
  const [goal, setGoal] = useState(currentGoal);

  const handleSave = () => {
    onSave(parseInt(goal));
    onOpenChange(false);
  };

  const presetGoals = [
    { value: 8, label: '8 hours', description: 'Minimum requirement' },
    { value: 24, label: '24 hours', description: 'Recommended' },
    { value: 40, label: '40 hours', description: 'Competitive' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Shadow Hour Goal</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Preset options */}
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Quick Select:</Label>
            <div className="grid grid-cols-3 gap-2">
              {presetGoals.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setGoal(preset.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    goal === preset.value
                      ? 'border-primary bg-yellow-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-sm">{preset.label}</div>
                  <div className="text-xs text-gray-500">{preset.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom input */}
          <div>
            <Label htmlFor="customGoal">Or enter custom goal:</Label>
            <Input
              id="customGoal"
              type="number"
              min="1"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Info text */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-gray-700">
            <p className="font-medium mb-1">Shadow Hour Guidelines:</p>
            <ul className="text-xs space-y-1 text-gray-600">
              <li>• <strong>8 hours:</strong> Minimum for most programs (if required at all)</li>
              <li>• <strong>24+ hours:</strong> Recommended to strengthen your application</li>
              <li>• <strong>40+ hours:</strong> Competitive advantage for top programs</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Goal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
