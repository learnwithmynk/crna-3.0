/**
 * RequirementsCard - Displays program requirements with verify button
 *
 * Features:
 * - Two-column grid of requirement fields
 * - Warning banner until verified
 * - Verify button that toggles to green checkmark
 * - Fields: Min GPA, CCRN, GPA Types, Shadowing, Prerequisites, GRE, Personal Statement, Resume/CV
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  CheckCircle2,
  GraduationCap,
  FileText,
  Clock,
  Award,
  BookOpen,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

export function RequirementsCard({ program, verified = false, onVerify }) {
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Requirements Details</CardTitle>
          {verified ? (
            <Button
              variant="ghost"
              className="text-green-600 hover:text-green-700 hover:bg-green-50 min-h-[44px]"
              disabled
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Verified
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={onVerify}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground min-h-[44px]"
            >
              <AlertTriangle className="w-4 h-4 mr-1.5" />
              Verify
            </Button>
          )}
        </div>

        {/* Warning Banner */}
        {!verified && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-sm text-yellow-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              Please verify these requirements are accurate. Requirements may change.
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent>
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
      </CardContent>
    </Card>
  );
}
