/**
 * SubmitCourseModal Component
 *
 * Combined form for users to submit a new prerequisite course AND review it.
 * Course-to-program relationships are automatically extrapolated from users'
 * saved/target schools.
 *
 * Points: 10 (course_submit) + 10 (review_submit) = 20 total
 *
 * TODO: Wire up to Supabase prerequisite_courses and prerequisite_reviews tables
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/input';
import { Award, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SUBJECT_AREAS,
  EDUCATION_LEVELS,
  COST_RANGES,
  COURSE_FORMATS,
  REVIEW_TAGS,
} from '@/data/mockPrerequisites';

// Color coding for ratings (1-5): red to green gradient
const RATING_COLORS = {
  1: { bg: 'bg-red-100', border: 'border-red-400', text: 'text-red-700' },
  2: { bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-700' },
  3: { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-700' },
  4: { bg: 'bg-lime-100', border: 'border-lime-400', text: 'text-lime-700' },
  5: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700' },
};

const RATING_LABELS = {
  recommend: {
    1: 'Strongly Discourage',
    2: 'Discourage',
    3: 'Neutral',
    4: 'Recommend',
    5: 'Highly Recommend',
  },
  ease: {
    1: 'Very Challenging',
    2: 'Challenging',
    3: 'Moderate',
    4: 'Mild',
    5: 'Very Easy',
  },
};

const INITIAL_FORM_STATE = {
  // Course details
  schoolName: '',
  courseName: '',
  courseCode: '',
  courseUrl: '',
  subject: '',
  level: '',
  credits: '',
  format: '',
  costRangeKey: '',
  hasLab: false,
  labKitRequired: false,
  selfPaced: false,
  rollingAdmission: false,
  // Review fields
  recommend: 0,
  ease: 0,
  tags: [],
  reviewText: '',
};

export function SubmitCourseModal({ open, onOpenChange, onSubmit }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTagToggle = (tagKey) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagKey)
        ? prev.tags.filter((t) => t !== tagKey)
        : [...prev.tags, tagKey],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get display cost range
    const costRangeObj = COST_RANGES.find((c) => c.key === formData.costRangeKey);

    const courseData = {
      ...formData,
      costRange: costRangeObj?.display || formData.costRangeKey,
      credits: parseInt(formData.credits) || 0,
    };

    onSubmit?.(courseData);
    setShowSuccess(true);
    setIsSubmitting(false);

    // Reset after showing success
    setTimeout(() => {
      setFormData(INITIAL_FORM_STATE);
      setShowSuccess(false);
      onOpenChange(false);
    }, 2000);
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM_STATE);
    setShowSuccess(false);
    onOpenChange(false);
  };

  const isFormValid =
    formData.schoolName &&
    formData.courseName &&
    formData.subject &&
    formData.level &&
    formData.recommend > 0 &&
    formData.ease > 0;

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md text-center border-0 shadow-[0_0_50px_rgba(255,176,136,0.35),0_0_100px_rgba(249,115,22,0.2)] p-0 overflow-hidden">
          <div className="p-px bg-linear-to-br from-[#FFD6B8] via-[#FE90AF] to-[#FFB088] rounded-3xl">
            <div className="bg-white rounded-[20px] py-8 px-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Course Submitted!</h3>
              <p className="text-gray-600 mb-4">
                Thank you for contributing to the Prerequisite Library.
              </p>
              <div className="inline-flex items-center gap-2 bg-linear-to-r from-[#FEF3E2] to-[#FFE4E1] px-4 py-2 rounded-full border border-orange-200/60">
                <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                <span className="text-sm font-medium text-orange-700">+20 points earned</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-0 shadow-[0_0_30px_rgba(254,144,175,0.25),0_0_60px_rgba(255,176,136,0.15)]">
        {/* Gradient border wrapper */}
        <div className="p-px bg-linear-to-br from-[#FFD6B8] via-[#FE90AF] to-[#FFB088] rounded-3xl">
          <div className="bg-white rounded-[20px] max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <DialogHeader className="text-center pt-2">
                <DialogTitle>Submit a New Course</DialogTitle>
                <DialogDescription>
                  Add a prerequisite course to help other applicants. Your submission
                  will be reviewed before being published.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {/* Institution */}
                <div>
                  <Label htmlFor="schoolName">Institution Name *</Label>
                  <Input
                    id="schoolName"
                    placeholder="e.g., Portage Learning, ASU, etc."
                    value={formData.schoolName}
                    onChange={(e) => handleChange('schoolName', e.target.value)}
                  />
                </div>

                {/* Course Name */}
                <div>
                  <Label htmlFor="courseName">Course Name *</Label>
                  <Input
                    id="courseName"
                    placeholder="e.g., CHEM103: General Chemistry I w/ Lab"
                    value={formData.courseName}
                    onChange={(e) => handleChange('courseName', e.target.value)}
                  />
                </div>

                {/* Subject & Level */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Subject Area *</Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(val) => handleChange('subject', val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECT_AREAS.map((subject) => (
                          <SelectItem key={subject.key} value={subject.key}>
                            {subject.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Education Level *</Label>
                    <Select
                      value={formData.level}
                      onValueChange={(val) => handleChange('level', val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {EDUCATION_LEVELS.map((level) => (
                          <SelectItem key={level.key} value={level.key}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Credits & Format */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="credits">Credits</Label>
                    <Input
                      id="credits"
                      type="number"
                      min="1"
                      max="6"
                      placeholder="e.g., 4"
                      value={formData.credits}
                      onChange={(e) => handleChange('credits', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Format</Label>
                    <Select
                      value={formData.format}
                      onValueChange={(val) => handleChange('format', val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        {COURSE_FORMATS.map((format) => (
                          <SelectItem key={format.key} value={format.key}>
                            {format.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Cost Range */}
                <div>
                  <Label>Cost Range</Label>
                  <Select
                    value={formData.costRangeKey}
                    onValueChange={(val) => handleChange('costRangeKey', val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cost range" />
                    </SelectTrigger>
                    <SelectContent>
                      {COST_RANGES.map((range) => (
                        <SelectItem key={range.key} value={range.key}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Course URL */}
                <div>
                  <Label htmlFor="courseUrl">Course URL</Label>
                  <Input
                    id="courseUrl"
                    type="url"
                    placeholder="https://..."
                    value={formData.courseUrl}
                    onChange={(e) => handleChange('courseUrl', e.target.value)}
                  />
                </div>

                {/* Checkboxes */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="hasLab"
                      checked={formData.hasLab}
                      onCheckedChange={(checked) => handleChange('hasLab', checked)}
                    />
                    <Label htmlFor="hasLab" className="text-sm font-normal">
                      Has Lab Component
                    </Label>
                  </div>

                  {formData.hasLab && (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="labKitRequired"
                        checked={formData.labKitRequired}
                        onCheckedChange={(checked) =>
                          handleChange('labKitRequired', checked)
                        }
                      />
                      <Label htmlFor="labKitRequired" className="text-sm font-normal">
                        Lab Kit Required
                      </Label>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="selfPaced"
                      checked={formData.selfPaced}
                      onCheckedChange={(checked) => handleChange('selfPaced', checked)}
                    />
                    <Label htmlFor="selfPaced" className="text-sm font-normal">
                      Self-Paced
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="rollingAdmission"
                      checked={formData.rollingAdmission}
                      onCheckedChange={(checked) =>
                        handleChange('rollingAdmission', checked)
                      }
                    />
                    <Label htmlFor="rollingAdmission" className="text-sm font-normal">
                      Rolling Admission
                    </Label>
                  </div>
                </div>

                {/* ========== YOUR REVIEW SECTION ========== */}
                <div className="border-t border-gray-200 pt-6 mt-2">
                  <h4 className="text-base font-semibold text-gray-900 mb-4">Your Review</h4>

                  {/* Ratings Section */}
                  <div className="grid grid-cols-2 gap-6 mb-4">
                    {/* Recommend Rating */}
                    <div className="text-center">
                      <Label className="text-sm font-medium block mb-2">
                        Would you recommend? *
                      </Label>
                      <div className="flex justify-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((value) => {
                          const colors = RATING_COLORS[value];
                          const isSelected = formData.recommend === value;
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => handleChange('recommend', value)}
                              className={cn(
                                'w-9 h-9 rounded-xl border-2 font-bold text-sm transition-all',
                                isSelected
                                  ? `${colors.bg} ${colors.border} ${colors.text}`
                                  : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                              )}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                      {formData.recommend > 0 && (
                        <p className={cn('text-xs mt-1.5 font-medium', RATING_COLORS[formData.recommend].text)}>
                          {RATING_LABELS.recommend[formData.recommend]}
                        </p>
                      )}
                    </div>

                    {/* Ease Rating */}
                    <div className="text-center">
                      <Label className="text-sm font-medium block mb-2">
                        How easy was it? *
                      </Label>
                      <div className="flex justify-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((value) => {
                          const colors = RATING_COLORS[value];
                          const isSelected = formData.ease === value;
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => handleChange('ease', value)}
                              className={cn(
                                'w-9 h-9 rounded-xl border-2 font-bold text-sm transition-all',
                                isSelected
                                  ? `${colors.bg} ${colors.border} ${colors.text}`
                                  : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                              )}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                      {formData.ease > 0 && (
                        <p className={cn('text-xs mt-1.5 font-medium', RATING_COLORS[formData.ease].text)}>
                          {RATING_LABELS.ease[formData.ease]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-4">
                    <Label className="text-sm font-medium">
                      Course characteristics (select all that apply)
                    </Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {/* Left column: Format & Assessment */}
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1.5">Format</p>
                          <div className="flex flex-wrap gap-1.5">
                            {REVIEW_TAGS.format.map((tag) => (
                              <button
                                key={tag.key}
                                type="button"
                                onClick={() => handleTagToggle(tag.key)}
                                className={cn(
                                  'px-2 py-1 rounded-full text-xs border transition-all',
                                  formData.tags.includes(tag.key)
                                    ? 'bg-green-100 border-green-400 text-green-800'
                                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                )}
                              >
                                {tag.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1.5">Assessment</p>
                          <div className="flex flex-wrap gap-1.5">
                            {REVIEW_TAGS.assessment.map((tag) => (
                              <button
                                key={tag.key}
                                type="button"
                                onClick={() => handleTagToggle(tag.key)}
                                className={cn(
                                  'px-2 py-1 rounded-full text-xs border transition-all',
                                  formData.tags.includes(tag.key)
                                    ? 'bg-green-100 border-green-400 text-green-800'
                                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                )}
                              >
                                {tag.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right column: Time & Lab */}
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1.5">Time Required</p>
                          <div className="flex flex-wrap gap-1.5">
                            {REVIEW_TAGS.time.map((tag) => (
                              <button
                                key={tag.key}
                                type="button"
                                onClick={() => handleTagToggle(tag.key)}
                                className={cn(
                                  'px-2 py-1 rounded-full text-xs border transition-all',
                                  formData.tags.includes(tag.key)
                                    ? 'bg-green-100 border-green-400 text-green-800'
                                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                )}
                              >
                                {tag.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1.5">Lab Component</p>
                          <div className="flex flex-wrap gap-1.5">
                            {REVIEW_TAGS.lab.map((tag) => (
                              <button
                                key={tag.key}
                                type="button"
                                onClick={() => handleTagToggle(tag.key)}
                                className={cn(
                                  'px-2 py-1 rounded-full text-xs border transition-all',
                                  formData.tags.includes(tag.key)
                                    ? 'bg-green-100 border-green-400 text-green-800'
                                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                )}
                              >
                                {tag.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="bg-linear-to-br from-[#FEF7E0] via-[#FFF0E6] to-[#FFEBE8] border border-orange-200/60 rounded-2xl p-3 shadow-sm">
                    <Label htmlFor="reviewText" className="text-sm font-semibold text-gray-800">
                      Your Review
                    </Label>
                    <p className="text-xs text-gray-500 mt-0.5 mb-2">
                      Share details about your experience. What did you like? Tips for future students?
                    </p>
                    <Textarea
                      id="reviewText"
                      placeholder="This course was great because..."
                      value={formData.reviewText}
                      onChange={(e) => handleChange('reviewText', e.target.value)}
                      rows={3}
                      className="bg-white border-orange-100/80"
                    />
                  </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="bg-linear-to-r from-[#F97316] via-[#FB923C] to-[#F59E0B] hover:from-[#EA580C] hover:via-[#F97316] hover:to-[#D97706] text-white border-0 shadow-md font-medium px-6"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Course & Review'}
                    <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] text-white bg-white/25 px-1.5 py-0.5 rounded-full">
                      <Star className="w-2 h-2 fill-white text-white" />
                      +20
                    </span>
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SubmitCourseModal;
