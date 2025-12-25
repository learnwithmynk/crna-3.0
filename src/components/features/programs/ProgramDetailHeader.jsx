/**
 * ProgramDetailHeader - Header section for target program detail page
 *
 * Features:
 * - Clickable status badge with dropdown to change status
 * - Program name, school name, location
 * - Application deadline with prominent urgency colors
 * - Inline requirements section (always visible, no collapse)
 *
 * UX Decision: Requirements are displayed inline within the same card
 * as the program info, creating a unified view of program details.
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
  Check,
  Clock,
  AlertTriangle,
  CheckCircle2,
  GraduationCap,
  FileText,
  Award,
  BookOpen,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDeadlineDisplay } from '@/lib/dateFormatters';
import { ReportRequirementError } from './ReportRequirementError';

// Application status workflow with matching ring colors
// Defined in canonical-user-model.md as PROGRAM_STATUSES
const APPLICATION_STATUSES = [
  { value: 'not_started', label: 'Not Started', color: 'bg-gray-700 text-white', ring: 'ring-gray-700' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800', ring: 'ring-blue-300' },
  { value: 'submitted', label: 'Submitted', color: 'bg-green-100 text-green-800', ring: 'ring-green-300' },
  { value: 'interview_invite', label: 'Interview Invited', color: 'bg-purple-100 text-purple-800', ring: 'ring-purple-300' },
  { value: 'interview_complete', label: 'Interview Complete', color: 'bg-purple-200 text-purple-900', ring: 'ring-purple-400' },
  { value: 'waitlisted', label: 'Waitlisted', color: 'bg-yellow-500 text-white', ring: 'ring-yellow-500' },
  { value: 'denied', label: 'Denied', color: 'bg-red-100 text-red-800', ring: 'ring-red-300' },
  { value: 'accepted', label: 'Accepted', color: 'bg-green-500 text-white', ring: 'ring-green-500' },
];

// getDeadlineInfo moved to @/lib/dateFormatters as getDeadlineDisplay

/**
 * Requirement field component
 */
function RequirementField({ label, value, icon: Icon }) {
  return (
    <div className="space-y-1">
      <dt className="text-xs text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </dt>
      <dd className="text-sm font-medium text-gray-900">
        {value || 'Not specified'}
      </dd>
    </div>
  );
}

/**
 * Format GRE requirement for display
 */
function formatGreRequirement(gre) {
  if (!gre) return 'Not specified';
  if (gre === 'required') return 'Required';
  if (gre === 'not_required' || gre === false) return 'Not Required';
  if (gre === 'required_but_waived') return 'Required but Waived';
  if (gre === true) return 'Required';
  return String(gre);
}

/**
 * Format CCRN requirement for display
 */
function formatCcrnRequirement(ccrn) {
  if (!ccrn) return 'Not specified';
  if (ccrn === 'required') return 'Required';
  if (ccrn === 'not_required' || ccrn === false) return 'Not Required';
  if (ccrn === 'waived') return 'Waived';
  if (ccrn === true) return 'Required';
  return String(ccrn);
}

export function ProgramDetailHeader({ program, status, onStatusChange, verified = false, onVerify }) {
  const [isOpen, setIsOpen] = useState(false);
  const [requirementsExpanded, setRequirementsExpanded] = useState(false);

  const currentStatus = APPLICATION_STATUSES.find(s => s.value === status) || APPLICATION_STATUSES[0];
  const deadlineInfo = getDeadlineDisplay(program.applicationDeadline);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Left: Status + Program Info */}
          <div className="space-y-3">
            {/* Clickable Status Badge */}
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium transition-all min-h-11",
                    "hover:ring-2 hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-offset-2",
                    currentStatus.color,
                    currentStatus.ring
                  )}
                  aria-label={`Application status: ${currentStatus.label}. Click to change.`}
                >
                  {currentStatus.label}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {APPLICATION_STATUSES.map((statusOption) => (
                  <DropdownMenuItem
                    key={statusOption.value}
                    onClick={() => {
                      onStatusChange(statusOption.value);
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <span className={cn(
                        "w-2.5 h-2.5 rounded-full",
                        statusOption.value === 'not_started' && 'bg-gray-500',
                        statusOption.value === 'in_progress' && 'bg-blue-500',
                        statusOption.value === 'submitted' && 'bg-green-500',
                        statusOption.value === 'interview_invite' && 'bg-purple-500',
                        statusOption.value === 'interview_complete' && 'bg-purple-600',
                        statusOption.value === 'waitlisted' && 'bg-yellow-500',
                        statusOption.value === 'denied' && 'bg-red-500',
                        statusOption.value === 'accepted' && 'bg-green-600'
                      )} />
                      {statusOption.label}
                    </span>
                    {status === statusOption.value && (
                      <Check className="w-4 h-4 text-green-600" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Program Name */}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {program.name}
            </h1>

            {/* School Name */}
            <p className="text-lg text-gray-700 font-medium">
              {program.schoolName}
            </p>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>{program.location.city}, {program.location.state}</span>
            </div>
          </div>

          {/* Right: Deadline - Prominent with urgency colors */}
          {deadlineInfo && (
            <div className={cn(
              "p-4 rounded-2xl text-center sm:text-right min-w-[140px]",
              deadlineInfo.daysUntil < 0 && "bg-gray-100",
              deadlineInfo.daysUntil >= 0 && deadlineInfo.daysUntil <= 7 && "bg-red-50 border border-red-200",
              deadlineInfo.daysUntil > 7 && deadlineInfo.daysUntil <= 30 && "bg-orange-50 border border-orange-200",
              deadlineInfo.daysUntil > 30 && "bg-green-50 border border-green-200"
            )}>
              <div className="flex items-center justify-center sm:justify-end gap-2 mb-1">
                {deadlineInfo.daysUntil >= 0 && deadlineInfo.daysUntil <= 7 && (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
                {deadlineInfo.daysUntil > 7 && deadlineInfo.daysUntil <= 30 && (
                  <Clock className="w-4 h-4 text-orange-500" />
                )}
                {deadlineInfo.daysUntil > 30 && (
                  <Calendar className="w-4 h-4 text-green-600" />
                )}
                {deadlineInfo.daysUntil < 0 && (
                  <Calendar className="w-4 h-4 text-gray-400" />
                )}
                <span className={cn(
                  "text-xs font-medium uppercase tracking-widest",
                  deadlineInfo.daysUntil < 0 && "text-gray-500",
                  deadlineInfo.daysUntil >= 0 && deadlineInfo.daysUntil <= 7 && "text-red-600",
                  deadlineInfo.daysUntil > 7 && deadlineInfo.daysUntil <= 30 && "text-orange-600",
                  deadlineInfo.daysUntil > 30 && "text-green-700"
                )}>
                  Deadline
                </span>
              </div>
              <p className={cn(
                "font-bold text-lg",
                deadlineInfo.daysUntil < 0 && "text-gray-600",
                deadlineInfo.daysUntil >= 0 && deadlineInfo.daysUntil <= 7 && "text-red-700",
                deadlineInfo.daysUntil > 7 && deadlineInfo.daysUntil <= 30 && "text-orange-700",
                deadlineInfo.daysUntil > 30 && "text-green-800"
              )}>
                {deadlineInfo.date}
              </p>
              {deadlineInfo.daysUntil >= 0 && (
                <p className={cn(
                  "text-sm font-semibold mt-1",
                  deadlineInfo.daysUntil <= 7 && "text-red-600",
                  deadlineInfo.daysUntil > 7 && deadlineInfo.daysUntil <= 30 && "text-orange-600",
                  deadlineInfo.daysUntil > 30 && "text-green-700"
                )}>
                  {deadlineInfo.daysUntil === 0
                    ? '⚠️ Today!'
                    : deadlineInfo.daysUntil === 1
                      ? '1 day left'
                      : `${deadlineInfo.daysUntil} days left`}
                </p>
              )}
              {deadlineInfo.daysUntil < 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {Math.abs(deadlineInfo.daysUntil)} days ago
                </p>
              )}
            </div>
          )}
        </div>

        {/* Requirements Section - Collapsible within same card */}
        <div className="border-t border-gray-100 mt-6">
          {/* Expand/Collapse Toggle */}
          <button
            onClick={() => setRequirementsExpanded(!requirementsExpanded)}
            className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50/50 transition-colors -mx-6 px-6"
            aria-expanded={requirementsExpanded}
            aria-controls="program-requirements"
          >
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900">Program Requirements</h3>
              {verified && (
                <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!verified && !requirementsExpanded && (
                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  Needs verification
                </span>
              )}
              {requirementsExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </button>

          {/* Collapsible Content */}
          {requirementsExpanded && (
            <div id="program-requirements" className="pb-2">
              {/* Verify Button */}
              {!verified && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center justify-between gap-3">
                  <p className="text-sm text-yellow-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    Please verify these requirements are accurate.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onVerify}
                    className="border-amber-300 text-amber-700 hover:bg-amber-50 min-h-9 shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Mark Verified
                  </Button>
                </div>
              )}

              {/* Requirements Grid */}
              <RequirementsGrid program={program} />

              {/* Report Error Button - Bottom right */}
              <div className="flex justify-end mt-4 pt-3 border-t border-gray-100">
                <ReportRequirementError
                  programId={program.id || program.programId}
                  programName={program.name}
                  schoolName={program.schoolName}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Requirements Grid Component
 */
function RequirementsGrid({ program }) {
  // Extract requirements from program (handle both nested and flat structures)
  const requirements = program.requirements || {};
  const minimumGpa = requirements.minimumGpa || program.minimumGpa || null;
  const gpaTypes = requirements.gpaTypes || [];
  const ccrn = requirements.ccrn || program.ccrnRequired;
  const shadowingRequired = requirements.shadowingRequired;
  const shadowingHours = requirements.shadowingHours;
  const personalStatement = requirements.personalStatement;
  const resumeRequired = requirements.resumeRequired;
  const gre = requirements.gre || program.greRequired;
  const prerequisites = requirements.prerequisites || program.prerequisitesRequired || [];

  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Minimum GPA */}
      <RequirementField
        label="Minimum GPA"
        value={minimumGpa ? minimumGpa.toFixed(1) : null}
        icon={GraduationCap}
      />

      {/* CCRN */}
      <RequirementField
        label="CCRN"
        value={formatCcrnRequirement(ccrn)}
        icon={Award}
      />

      {/* GPA Types */}
      <RequirementField
        label="Types of GPA"
        value={gpaTypes.length > 0 ? gpaTypes.join(', ') : 'Not specified'}
        icon={BookOpen}
      />

      {/* Shadowing */}
      <RequirementField
        label="Shadowing Required"
        value={
          shadowingRequired === true
            ? shadowingHours
              ? `Yes (${shadowingHours} hours)`
              : 'Yes'
            : shadowingRequired === false
              ? 'No'
              : 'Not specified'
        }
        icon={Clock}
      />

      {/* Prerequisites */}
      <div className="sm:col-span-2 space-y-1">
        <dt className="text-xs text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          Prerequisites Required
        </dt>
        <dd className="text-sm">
          {prerequisites.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {prerequisites.map((prereq, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {prereq}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-gray-900 font-medium">Not specified</span>
          )}
        </dd>
      </div>

      {/* GRE */}
      <RequirementField
        label="GRE"
        value={formatGreRequirement(gre)}
        icon={FileText}
      />

      {/* Personal Statement */}
      <RequirementField
        label="Personal Statement"
        value={
          personalStatement === true
            ? 'Required'
            : personalStatement === false
              ? 'Not Required'
              : 'Not specified'
        }
        icon={FileText}
      />

      {/* Resume/CV */}
      <RequirementField
        label="Resume/CV"
        value={
          resumeRequired === true
            ? 'Required'
            : resumeRequired === false
              ? 'Not Required'
              : 'Not specified'
        }
        icon={Users}
      />
    </dl>
  );
}
