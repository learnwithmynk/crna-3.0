/**
 * SchoolRequirements Component
 *
 * Displays school admission requirements with user match status.
 * Shows GPA, GRE, experience, certifications, and other requirements.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  HelpCircle,
  ClipboardList,
  GraduationCap,
  Stethoscope,
  Award,
  FileText,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReportRequirementError } from '@/components/features/programs/ReportRequirementError';

export function SchoolRequirements({ school, fitScore }) {
  if (!school) return null;

  const {
    minimumGpa,
    greRequired,
    greWaivedFor,
    ccrnRequired,
    minimumExperience,
    acceptsNicu,
    acceptsPicu,
    acceptsEr,
    acceptsOtherCriticalCare,
    prerequisites,
    otherRequirements,
  } = school;

  // Get status for a requirement from fit score breakdown
  const getStatus = (id) => {
    const item = fitScore?.breakdown?.find(b => b.id === id);
    return item?.status || 'unknown';
  };

  // Get icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass':
      case 'bonus':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <HelpCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  // Get badge variant based on status
  const getBadgeVariant = (status) => {
    switch (status) {
      case 'pass':
      case 'bonus':
        return 'success';
      case 'warning':
        return 'warning';
      case 'fail':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const requirements = [
    {
      id: 'gpa',
      label: 'Minimum GPA',
      value: minimumGpa || '3.0',
      detail: 'Overall or Science GPA',
      icon: GraduationCap,
    },
    {
      id: 'gre',
      label: 'GRE',
      value: greRequired ? 'Required' : 'Not Required',
      detail: greWaivedFor ? `Waived for: ${greWaivedFor}` : null,
      icon: FileText,
    },
    {
      id: 'years',
      label: 'ICU Experience',
      value: `${minimumExperience || 1}+ years`,
      detail: 'Adult critical care preferred',
      icon: Clock,
    },
    {
      id: 'ccrn',
      label: 'CCRN Certification',
      value: ccrnRequired ? 'Required' : 'Preferred',
      detail: ccrnRequired ? 'Must have before application' : 'Strongly recommended',
      icon: Award,
    },
  ];

  const acceptedExperience = [
    { type: 'Adult ICU (MICU, SICU, CVICU, etc.)', accepted: true },
    { type: 'NICU', accepted: acceptsNicu },
    { type: 'PICU', accepted: acceptsPicu },
    { type: 'ER/ED', accepted: acceptsEr },
    { type: 'Other Critical Care', accepted: acceptsOtherCriticalCare },
  ];

  return (
    <div className="space-y-4">
      {/* Main Requirements */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            Admission Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {requirements.map((req) => {
            const status = getStatus(req.id);
            return (
              <div
                key={req.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl",
                  status === 'pass' && "bg-green-50",
                  status === 'warning' && "bg-yellow-50",
                  status === 'fail' && "bg-red-50",
                  status === 'unknown' && "bg-gray-50"
                )}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getStatusIcon(status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <req.icon className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{req.label}</span>
                  </div>
                  <div className="text-lg font-semibold mt-1">{req.value}</div>
                  {req.detail && (
                    <p className="text-sm text-gray-600 mt-0.5">{req.detail}</p>
                  )}
                </div>
                <Badge variant={getBadgeVariant(status)} className="flex-shrink-0">
                  {status === 'pass' && 'You meet this'}
                  {status === 'warning' && 'Gap to address'}
                  {status === 'fail' && 'Does not meet'}
                  {status === 'unknown' && 'Add to profile'}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Accepted Experience Types */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Stethoscope className="w-5 h-5" />
            Accepted ICU Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {acceptedExperience.map((exp) => (
              <div
                key={exp.type}
                className={cn(
                  "flex items-center gap-2 p-2 rounded",
                  exp.accepted ? "bg-green-50" : "bg-gray-50"
                )}
              >
                {exp.accepted ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
                <span className={cn(
                  "text-sm",
                  exp.accepted ? "text-green-700" : "text-gray-500"
                )}>
                  {exp.type}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Contact the program directly to confirm your specific experience qualifies.
          </p>
        </CardContent>
      </Card>

      {/* Prerequisites if available */}
      {prerequisites && prerequisites.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Prerequisites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {prerequisites.map((prereq, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded-full text-xs font-medium">
                    {index + 1}
                  </span>
                  <span>{prereq}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Other Requirements */}
      {otherRequirements && otherRequirements.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Other Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {otherRequirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-gray-400">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Report Error Button */}
      <div className="flex justify-end pt-2">
        <ReportRequirementError
          programId={school.id}
          programName={school.programName || school.name}
          schoolName={school.schoolName || school.name}
        />
      </div>
    </div>
  );
}

export default SchoolRequirements;
