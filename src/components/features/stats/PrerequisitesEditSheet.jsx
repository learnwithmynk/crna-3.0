/**
 * Prerequisites Edit Sheet
 *
 * Sheet component for editing completed prerequisites.
 * Includes inline prompt to rate courses when status changes to "completed".
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, CheckCircle2, Star, Sparkles } from 'lucide-react';

const PREREQUISITE_TYPES = [
  { value: 'anatomy', label: 'Anatomy' },
  { value: 'physiology', label: 'Physiology' },
  { value: 'anatomy_physiology', label: 'Anatomy & Physiology (Combined)' },
  { value: 'pharmacology', label: 'Pharmacology' },
  { value: 'pathophysiology', label: 'Pathophysiology' },
  { value: 'general_chemistry', label: 'General Chemistry' },
  { value: 'organic_chemistry', label: 'Organic Chemistry' },
  { value: 'biochemistry', label: 'Biochemistry' },
  { value: 'statistics', label: 'Statistics' },
  { value: 'microbiology', label: 'Microbiology' },
  { value: 'physics', label: 'Physics' },
  { value: 'biology', label: 'Biology' },
  { value: 'health_assessment', label: 'Health Assessment' },
  { value: 'research', label: 'Research/Evidence-Based Practice' },
  { value: 'other', label: 'Other' },
];

const GRADE_OPTIONS = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F', 'P'];

const STATUS_OPTIONS = [
  { value: 'completed', label: 'Completed' },
  { value: 'in_progress', label: 'Currently Taking' },
  { value: 'planned', label: 'Planning to Take' },
  { value: 'plan_retake', label: 'Planning to Retake' },
];

export function PrerequisitesEditSheet({ open, onOpenChange, initialValues, onSave, onRateCourse }) {
  const [prerequisites, setPrerequisites] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPrereq, setNewPrereq] = useState({
    courseType: '',
    status: 'completed',
    grade: '',
    year: '',
    schoolName: '',
  });
  // Track which courses just completed (for inline prompt)
  const [justCompletedId, setJustCompletedId] = useState(null);

  useEffect(() => {
    if (initialValues?.completedPrerequisites) {
      setPrerequisites(initialValues.completedPrerequisites);
    }
  }, [initialValues, open]);

  const handleAddPrerequisite = () => {
    if (!newPrereq.courseType) return;

    setPrerequisites(prev => [
      ...prev,
      {
        ...newPrereq,
        id: Date.now().toString(),
      },
    ]);
    setNewPrereq({ courseType: '', status: 'completed', grade: '', year: '', schoolName: '' });
    setShowAddForm(false);
  };

  const handleUpdatePrerequisite = (id, field, value) => {
    setPrerequisites(prev => prev.map((p, index) => {
      const matchId = p.id ? p.id === id : index.toString() === id;
      if (matchId) {
        // Detect status change from in_progress to completed
        if (field === 'status' && value === 'completed' && p.status === 'in_progress') {
          // Show inline prompt for this course
          setJustCompletedId(id);
        }
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  // Dismiss the inline prompt
  const handleDismissRatePrompt = () => {
    setJustCompletedId(null);
  };

  // Handle rate button click
  const handleRateClick = (prereq) => {
    setJustCompletedId(null);
    onRateCourse?.(prereq);
  };

  const getStatusLabel = (status) => {
    return STATUS_OPTIONS.find(s => s.value === status)?.label || 'Completed';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'planned': return 'bg-amber-100 text-amber-700';
      case 'plan_retake': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleRemovePrerequisite = (id) => {
    setPrerequisites(prev => prev.filter((p, index) => {
      if (p.id) return p.id !== id;
      return index.toString() !== id;
    }));
  };

  const handleSave = () => {
    onSave?.({ completedPrerequisites: prerequisites });
    onOpenChange(false);
  };

  const getPrereqLabel = (type) => {
    return PREREQUISITE_TYPES.find(p => p.value === type)?.label || type;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Prerequisites</SheetTitle>
          <SheetDescription>
            Track the prerequisite courses you've completed. Requirements vary by program.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          {/* Current Prerequisites */}
          <div className="space-y-2">
            <Label>Your Courses</Label>
            {prerequisites.length === 0 ? (
              <p className="text-sm text-gray-500 py-2">No prerequisites added yet</p>
            ) : (
              <div className="space-y-3">
                {prerequisites.map((prereq, index) => {
                  const prereqId = prereq.id || index.toString();
                  const showRatePrompt = justCompletedId === prereqId;
                  return (
                    <div key={prereqId}>
                      <div className="p-3 border rounded-xl bg-gray-50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{getPrereqLabel(prereq.courseType)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleRemovePrerequisite(prereqId)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Editable fields */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-[10px] text-gray-500">Status</Label>
                            <Select
                              value={prereq.status || 'completed'}
                              onValueChange={(value) => handleUpdatePrerequisite(prereqId, 'status', value)}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {STATUS_OPTIONS.map(status => (
                                  <SelectItem key={status.value} value={status.value}>
                                    {status.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-[10px] text-gray-500">Grade</Label>
                            <Select
                              value={prereq.grade || ''}
                              onValueChange={(value) => handleUpdatePrerequisite(prereqId, 'grade', value)}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Grade" />
                              </SelectTrigger>
                              <SelectContent>
                                {GRADE_OPTIONS.map(grade => (
                                  <SelectItem key={grade} value={grade}>
                                    {grade}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-[10px] text-gray-500">Year</Label>
                            <Input
                              type="number"
                              className="h-8 text-xs"
                              min="1990"
                              max={new Date().getFullYear()}
                              placeholder="2023"
                              value={prereq.year || ''}
                              onChange={(e) => handleUpdatePrerequisite(prereqId, 'year', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label className="text-[10px] text-gray-500">School</Label>
                            <Input
                              className="h-8 text-xs"
                              placeholder="School name"
                              value={prereq.schoolName || ''}
                              onChange={(e) => handleUpdatePrerequisite(prereqId, 'schoolName', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Inline Rate Prompt - shown when status changes to completed */}
                      {showRatePrompt && (
                        <div className="mt-2 p-3 bg-linear-to-r from-orange-50 to-amber-50 border border-orange-200/60 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                              <Star className="w-4 h-4 text-white fill-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                Nice! Want to rate this course for other applicants?
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Earn +20 points and help the community
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleRateClick(prereq)}
                                  className="bg-linear-to-r from-[#F97316] via-[#FB923C] to-[#F59E0B] hover:from-[#EA580C] hover:via-[#F97316] hover:to-[#D97706] text-white border-0 shadow-sm text-xs h-7 px-3"
                                >
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Rate Now
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={handleDismissRatePrompt}
                                  className="text-xs h-7"
                                >
                                  Maybe Later
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add New Form */}
          {showAddForm ? (
            <div className="space-y-3 p-3 border rounded-xl bg-white">
              <div className="space-y-2">
                <Label>Course Type</Label>
                <Select
                  value={newPrereq.courseType}
                  onValueChange={(value) => setNewPrereq(prev => ({ ...prev, courseType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREREQUISITE_TYPES.map(prereq => (
                      <SelectItem key={prereq.value} value={prereq.value}>
                        {prereq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={newPrereq.status}
                  onValueChange={(value) => setNewPrereq(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Grade</Label>
                  <Select
                    value={newPrereq.grade}
                    onValueChange={(value) => setNewPrereq(prev => ({ ...prev, grade: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {GRADE_OPTIONS.map(grade => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input
                    type="number"
                    min="1990"
                    max={new Date().getFullYear()}
                    placeholder="2023"
                    value={newPrereq.year}
                    onChange={(e) => setNewPrereq(prev => ({ ...prev, year: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>School Name</Label>
                <Input
                  placeholder="e.g., Portage Learning"
                  value={newPrereq.schoolName}
                  onChange={(e) => setNewPrereq(prev => ({ ...prev, schoolName: e.target.value }))}
                />
              </div>

              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddPrerequisite}>
                  Add Course
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(true)}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Prerequisite
            </Button>
          )}

          <div className="p-3 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-700">
              <strong>Tip:</strong> Check your target programs' specific prerequisite requirements.
              Some accept online courses, others require in-person labs.
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

export default PrerequisitesEditSheet;
