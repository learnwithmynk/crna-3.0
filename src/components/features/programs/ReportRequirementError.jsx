/**
 * ReportRequirementError - Flag button and form for reporting incorrect program requirements
 *
 * Features:
 * - Flag icon button with "Something not right?" text
 * - Dialog with checkboxes for error categories
 * - Auto-captures school/program info
 * - Text field for details
 * - Points incentive messaging
 * - Success confirmation with points awarded
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Flag, Gift, CheckCircle2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePoints, POINT_ACTIONS } from '@/hooks/usePoints';

const ERROR_CATEGORIES = [
  { id: 'gpa', label: 'GPA Requirements' },
  { id: 'prerequisites', label: 'Prerequisites' },
  { id: 'gre', label: 'GRE Requirements' },
  { id: 'certification', label: 'Certification (CCRN, etc.)' },
  { id: 'shadowing', label: 'Shadowing Requirements' },
  { id: 'resume', label: 'Resume/CV Requirements' },
  { id: 'personal_statement', label: 'Personal Statement' },
  { id: 'deadline', label: 'Application Deadline' },
  { id: 'other', label: 'Other' },
];

const POINTS_REWARD = 5;

export function ReportRequirementError({
  programId,
  programName,
  schoolName,
  variant = 'default', // 'default' | 'compact'
  triggerLabel = 'Something not right?', // Custom trigger label
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(0);

  const { awardPoints, checkDailyCap } = usePoints();
  const { canSubmit } = checkDailyCap(POINT_ACTIONS.REPORT_SCHOOL_ERROR);

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async () => {
    if (selectedCategories.length === 0) return;

    setIsSubmitting(true);

    // TODO: Replace with actual API call to submit report
    const report = {
      type: 'school_requirement_error',
      programId,
      programName,
      schoolName,
      categories: selectedCategories,
      details: details.trim(),
      submittedAt: new Date().toISOString(),
    };

    console.log('Submitting requirement error report:', report);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    // Award points to user immediately on submission
    const awarded = awardPoints(POINT_ACTIONS.REPORT_SCHOOL_ERROR, POINTS_REWARD, {
      programId,
      schoolName,
      categories: selectedCategories,
    });
    setPointsAwarded(awarded);

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset form after dialog closes
    setTimeout(() => {
      setSelectedCategories([]);
      setDetails('');
      setIsSubmitted(false);
      setPointsAwarded(0);
    }, 300);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors",
          variant === 'compact'
            ? "text-xs"
            : "text-sm"
        )}
      >
        <Flag className={cn(variant === 'compact' ? "w-3 h-3" : "w-4 h-4")} />
        <span>{triggerLabel}</span>
      </button>

      {/* Report Dialog */}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          {!isSubmitted ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Flag className="w-5 h-5 text-amber-500" />
                  Report Incorrect Information
                </DialogTitle>
                <DialogDescription>
                  Help us keep program requirements accurate for all applicants.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Auto-captured info */}
                {schoolName ? (
                  <div className="p-3 bg-gray-50 rounded-xl text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-900">Reporting for:</span>
                    </p>
                    <p className="text-gray-900 font-medium mt-1">{schoolName}</p>
                    {programName && programName !== schoolName && (
                      <p className="text-gray-600 text-xs mt-0.5">{programName}</p>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 rounded-xl text-sm border border-amber-200">
                    <p className="text-amber-800">
                      To report incorrect information for a specific school, please use the "Something not right?" link on that school's detail page or card.
                    </p>
                  </div>
                )}

                {/* Category Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    What information is incorrect? <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                    {ERROR_CATEGORIES.map((category) => (
                      <label
                        key={category.id}
                        className={cn(
                          "flex items-center gap-3 p-2 rounded-xl border cursor-pointer transition-colors",
                          selectedCategories.includes(category.id)
                            ? "border-amber-300 bg-amber-50"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <Checkbox
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => handleCategoryToggle(category.id)}
                        />
                        <span className="text-sm text-gray-700">{category.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Details Text Area */}
                <div className="space-y-2">
                  <Label htmlFor="errorDetails" className="text-sm font-medium">
                    Additional details (optional)
                  </Label>
                  <Textarea
                    id="errorDetails"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Tell us what's incorrect and what the correct information should be..."
                    rows={3}
                    className="resize-none"
                  />
                </div>

                {/* Points Incentive */}
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                  <Gift className="w-5 h-5 text-green-600 shrink-0" />
                  <p className="text-sm font-medium text-green-800">
                    Earn +{POINTS_REWARD} points!
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={selectedCategories.length === 0 || isSubmitting}
                >
                  {isSubmitting ? (
                    <>Submitting...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-1.5" />
                      Submit Report
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          ) : (
            /* Success State */
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Thanks for letting us know!
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Your report has been submitted to our admin team. We're looking into it!
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full text-green-700 font-medium">
                <Gift className="w-4 h-4" />
                +{pointsAwarded || POINTS_REWARD} points earned!
              </div>
              <div className="mt-6">
                <Button onClick={handleClose}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
