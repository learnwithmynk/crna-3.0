/**
 * ServiceIntakeForm Component
 *
 * Service-specific intake form that shows different fields
 * based on the service type (mock interview, essay review, coaching, Q&A).
 */

import { useState } from 'react';
import { FileText, Video, MessageSquare, Calendar, Upload, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Mock Interview Intake Fields
 */
function MockInterviewFields({ data, onChange, targetPrograms = [] }) {
  return (
    <div className="space-y-4">
      {/* Interview Type */}
      <div>
        <Label htmlFor="interviewType">Interview Format *</Label>
        <Select
          value={data.interviewType || ''}
          onValueChange={(value) => onChange({ ...data, interviewType: value })}
        >
          <SelectTrigger id="interviewType">
            <SelectValue placeholder="Select interview format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="traditional">Traditional Panel</SelectItem>
            <SelectItem value="mmi">MMI (Multiple Mini Interview)</SelectItem>
            <SelectItem value="behavioral">Behavioral/Situational</SelectItem>
            <SelectItem value="mixed">Mixed Format</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Target Programs */}
      {targetPrograms.length > 0 && (
        <div>
          <Label>Target Programs</Label>
          <p className="text-xs text-gray-500 mb-2">Select programs you're interviewing at</p>
          <div className="space-y-2">
            {targetPrograms.map(program => (
              <div key={program.id} className="flex items-center gap-2">
                <Checkbox
                  id={`program-${program.id}`}
                  checked={(data.targetPrograms || []).includes(program.id)}
                  onCheckedChange={(checked) => {
                    const current = data.targetPrograms || [];
                    const updated = checked
                      ? [...current, program.id]
                      : current.filter(id => id !== program.id);
                    onChange({ ...data, targetPrograms: updated });
                  }}
                />
                <Label htmlFor={`program-${program.id}`} className="text-sm cursor-pointer">
                  {program.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Areas of Concern */}
      <div>
        <Label>Areas of Concern</Label>
        <p className="text-xs text-gray-500 mb-2">What would you like to focus on?</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'behavioral_questions', label: 'Behavioral Questions' },
            { value: 'why_crna', label: '"Why CRNA?" Answer' },
            { value: 'technical_questions', label: 'Technical/Clinical Questions' },
            { value: 'program_specific', label: 'Program-Specific Questions' },
            { value: 'nerves_confidence', label: 'Nerves/Confidence' },
            { value: 'storytelling', label: 'Storytelling/Examples' }
          ].map(concern => (
            <div key={concern.value} className="flex items-center gap-2">
              <Checkbox
                id={`concern-${concern.value}`}
                checked={(data.areasOfConcern || []).includes(concern.value)}
                onCheckedChange={(checked) => {
                  const current = data.areasOfConcern || [];
                  const updated = checked
                    ? [...current, concern.value]
                    : current.filter(v => v !== concern.value);
                  onChange({ ...data, areasOfConcern: updated });
                }}
              />
              <Label htmlFor={`concern-${concern.value}`} className="text-sm cursor-pointer">
                {concern.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Recording Request */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
        <Checkbox
          id="wantsRecording"
          checked={data.wantsRecording || false}
          onCheckedChange={(checked) => onChange({ ...data, wantsRecording: checked })}
        />
        <Label htmlFor="wantsRecording" className="cursor-pointer">
          I'd like a recording of my session to review later
        </Label>
      </div>
    </div>
  );
}

/**
 * Essay Review Intake Fields
 */
function EssayReviewFields({ data, onChange }) {
  return (
    <div className="space-y-4">
      {/* Document Type */}
      <div>
        <Label htmlFor="documentType">Document Type *</Label>
        <Select
          value={data.documentType || ''}
          onValueChange={(value) => onChange({ ...data, documentType: value })}
        >
          <SelectTrigger id="documentType">
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal_statement">Personal Statement</SelectItem>
            <SelectItem value="secondary_essay">Secondary Essay</SelectItem>
            <SelectItem value="diversity_statement">Diversity Statement</SelectItem>
            <SelectItem value="other">Other Essay/Document</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Draft Stage */}
      <div>
        <Label htmlFor="draftStage">Draft Stage *</Label>
        <Select
          value={data.draftStage || ''}
          onValueChange={(value) => onChange({ ...data, draftStage: value })}
        >
          <SelectTrigger id="draftStage">
            <SelectValue placeholder="Select draft stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="first_draft">First Draft</SelectItem>
            <SelectItem value="revised">Revised Draft</SelectItem>
            <SelectItem value="near_final">Near Final</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Feedback Type */}
      <div>
        <Label htmlFor="feedbackType">Feedback Type *</Label>
        <Select
          value={data.feedbackType || ''}
          onValueChange={(value) => onChange({ ...data, feedbackType: value })}
        >
          <SelectTrigger id="feedbackType">
            <SelectValue placeholder="What feedback are you looking for?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grammar_only">Grammar & Mechanics Only</SelectItem>
            <SelectItem value="story_structure">Story & Structure</SelectItem>
            <SelectItem value="full_developmental">Full Developmental Feedback</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Deadline */}
      <div>
        <Label htmlFor="deadline">Deadline (optional)</Label>
        <p className="text-xs text-gray-500 mb-1">When do you need feedback by?</p>
        <Input
          id="deadline"
          type="date"
          value={data.deadline || ''}
          onChange={(e) => onChange({ ...data, deadline: e.target.value })}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Specific Concerns */}
      <div>
        <Label htmlFor="specificConcerns">Specific Concerns</Label>
        <Textarea
          id="specificConcerns"
          placeholder="What specific areas would you like feedback on? (e.g., opening paragraph, conclusion, authenticity)"
          value={data.specificConcerns || ''}
          onChange={(e) => onChange({ ...data, specificConcerns: e.target.value })}
          rows={3}
        />
      </div>
    </div>
  );
}

/**
 * Coaching/Strategy Session Intake Fields
 */
function CoachingFields({ data, onChange }) {
  return (
    <div className="space-y-4">
      {/* Current Stage */}
      <div>
        <Label htmlFor="currentStage">Where are you in your journey? *</Label>
        <Select
          value={data.currentStage || ''}
          onValueChange={(value) => onChange({ ...data, currentStage: value })}
        >
          <SelectTrigger id="currentStage">
            <SelectValue placeholder="Select your current stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="exploring">Just Exploring CRNA</SelectItem>
            <SelectItem value="building_prereqs">Building Prerequisites</SelectItem>
            <SelectItem value="gaining_experience">Gaining ICU Experience</SelectItem>
            <SelectItem value="ready_to_apply">Ready to Apply</SelectItem>
            <SelectItem value="application_in_progress">Application In Progress</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Concerns */}
      <div>
        <Label>Main Concerns</Label>
        <p className="text-xs text-gray-500 mb-2">What would you like to discuss?</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'timeline', label: 'Timeline Planning' },
            { value: 'school_selection', label: 'School Selection' },
            { value: 'gpa_improvement', label: 'GPA Improvement' },
            { value: 'icu_experience', label: 'ICU Experience' },
            { value: 'certifications', label: 'Certifications (CCRN, etc.)' },
            { value: 'extracurriculars', label: 'Extracurriculars/EQ' },
            { value: 'financial_planning', label: 'Financial Planning' },
            { value: 'work_life_balance', label: 'Work-Life Balance' }
          ].map(concern => (
            <div key={concern.value} className="flex items-center gap-2">
              <Checkbox
                id={`main-${concern.value}`}
                checked={(data.mainConcerns || []).includes(concern.value)}
                onCheckedChange={(checked) => {
                  const current = data.mainConcerns || [];
                  const updated = checked
                    ? [...current, concern.value]
                    : current.filter(v => v !== concern.value);
                  onChange({ ...data, mainConcerns: updated });
                }}
              />
              <Label htmlFor={`main-${concern.value}`} className="text-sm cursor-pointer">
                {concern.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Question */}
      <div>
        <Label htmlFor="priorityQuestion">If I could walk away with clarity on ONE thing...</Label>
        <Textarea
          id="priorityQuestion"
          placeholder="What's the most important thing you want to figure out in this session?"
          value={data.priorityQuestion || ''}
          onChange={(e) => onChange({ ...data, priorityQuestion: e.target.value })}
          rows={3}
        />
      </div>
    </div>
  );
}

/**
 * Q&A Call Intake Fields (simpler form)
 */
function QACallFields({ data, onChange }) {
  return (
    <div className="space-y-4">
      {/* Topics */}
      <div>
        <Label>Topics You'd Like to Discuss</Label>
        <p className="text-xs text-gray-500 mb-2">Select all that apply</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'program_culture', label: 'Program Culture' },
            { value: 'clinical_rotations', label: 'Clinical Rotations' },
            { value: 'simulation_lab', label: 'Simulation Lab' },
            { value: 'housing', label: 'Housing/Living' },
            { value: 'cost_of_living', label: 'Cost of Living' },
            { value: 'class_schedule', label: 'Class Schedule' },
            { value: 'faculty', label: 'Faculty/Instructors' },
            { value: 'research', label: 'Research Opportunities' }
          ].map(topic => (
            <div key={topic.value} className="flex items-center gap-2">
              <Checkbox
                id={`topic-${topic.value}`}
                checked={(data.topics || []).includes(topic.value)}
                onCheckedChange={(checked) => {
                  const current = data.topics || [];
                  const updated = checked
                    ? [...current, topic.value]
                    : current.filter(v => v !== topic.value);
                  onChange({ ...data, topics: updated });
                }}
              />
              <Label htmlFor={`topic-${topic.value}`} className="text-sm cursor-pointer">
                {topic.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div>
        <Label htmlFor="questions">Your Questions</Label>
        <Textarea
          id="questions"
          placeholder="List specific questions you'd like answered..."
          value={data.questions || ''}
          onChange={(e) => onChange({ ...data, questions: e.target.value })}
          rows={4}
        />
      </div>
    </div>
  );
}

/**
 * File Upload Section
 */
function FileUploadSection({ files, onFilesChange, maxFiles = 5, maxSizeMb = 25 }) {
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setError(null);

    // Validate file count
    if (files.length + selectedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate file sizes
    const maxSizeBytes = maxSizeMb * 1024 * 1024;
    const oversized = selectedFiles.filter(f => f.size > maxSizeBytes);
    if (oversized.length > 0) {
      setError(`Files must be under ${maxSizeMb}MB`);
      return;
    }

    // Add files
    onFilesChange([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <Label>Attachments (optional)</Label>
      <p className="text-xs text-gray-500">
        Upload relevant documents (PDF, DOCX, TXT, images). Max {maxFiles} files, {maxSizeMb}MB each.
      </p>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm truncate">{file.name}</span>
                <span className="text-xs text-gray-400">
                  ({(file.size / 1024).toFixed(0)} KB)
                </span>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {files.length < maxFiles && (
        <div>
          <input
            type="file"
            id="file-upload"
            multiple
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className={cn(
              'flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-xl cursor-pointer',
              'hover:border-primary hover:bg-primary/5 transition-colors',
              'text-sm text-gray-600'
            )}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Files</span>
          </label>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

/**
 * Main ServiceIntakeForm Component
 */
export function ServiceIntakeForm({
  serviceType,
  intakeData,
  onIntakeChange,
  files,
  onFilesChange,
  targetPrograms = [],
  className
}) {
  // Get icon and title for service type
  const serviceConfig = {
    mock_interview: { icon: Video, label: 'Mock Interview' },
    essay_review: { icon: FileText, label: 'Essay Review' },
    strategy_session: { icon: MessageSquare, label: 'Coaching Session' },
    school_qa: { icon: Calendar, label: 'Q&A Call' }
  };

  const config = serviceConfig[serviceType] || serviceConfig.school_qa;
  const Icon = config.icon;

  return (
    <div className={className}>
      {/* Service Type Header */}
      <div className="flex items-center gap-2 mb-4 p-3 bg-primary/5 rounded-xl">
        <Icon className="w-5 h-5 text-primary" />
        <span className="font-medium">{config.label} - Session Details</span>
      </div>

      {/* Service-Specific Fields */}
      {serviceType === 'mock_interview' && (
        <MockInterviewFields
          data={intakeData}
          onChange={onIntakeChange}
          targetPrograms={targetPrograms}
        />
      )}
      {serviceType === 'essay_review' && (
        <EssayReviewFields data={intakeData} onChange={onIntakeChange} />
      )}
      {serviceType === 'strategy_session' && (
        <CoachingFields data={intakeData} onChange={onIntakeChange} />
      )}
      {serviceType === 'school_qa' && (
        <QACallFields data={intakeData} onChange={onIntakeChange} />
      )}

      {/* File Upload (available for all service types) */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <FileUploadSection
          files={files}
          onFilesChange={onFilesChange}
        />
      </div>

      {/* Additional Notes (available for all) */}
      <div className="mt-4">
        <Label htmlFor="additionalNotes">Additional Notes for Your Mentor</Label>
        <Textarea
          id="additionalNotes"
          placeholder="Anything else you'd like your mentor to know before the session?"
          value={intakeData.additionalNotes || ''}
          onChange={(e) => onIntakeChange({ ...intakeData, additionalNotes: e.target.value })}
          rows={3}
        />
      </div>
    </div>
  );
}

export default ServiceIntakeForm;
