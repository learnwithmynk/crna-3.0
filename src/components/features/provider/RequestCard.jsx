/**
 * RequestCard Component
 *
 * Comprehensive card for displaying a booking request with all details.
 * Shows applicant info, service details, materials, countdown timer,
 * and action buttons for accepting/declining/proposing alternatives.
 *
 * Sections:
 * - Header with applicant avatar, name, date, and countdown badge
 * - Collapsible applicant summary (programs, experience, GPA, stage)
 * - Service details with price breakdown
 * - Applicant's message/context
 * - Uploaded materials with download links
 * - Action buttons (Accept, Decline, Propose Alternative)
 */

import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Download,
  Target,
  Briefcase,
  GraduationCap,
  TrendingUp,
  MessageSquare,
  Video,
  FileEdit,
  Users,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

/**
 * Calculate time remaining and color code the countdown badge
 */
function getCountdownInfo(requestDate, responseTimeHours = 48) {
  const requestTime = new Date(requestDate);
  const deadline = new Date(requestTime.getTime() + responseTimeHours * 60 * 60 * 1000);
  const now = new Date();
  const hoursLeft = Math.max(0, (deadline - now) / (1000 * 60 * 60));

  let variant = 'default';
  let className = '';

  if (hoursLeft <= 6) {
    // Critical - red
    variant = 'destructive';
    className = 'bg-red-100 text-red-800 border-red-300';
  } else if (hoursLeft <= 24) {
    // Warning - yellow
    className = 'bg-yellow-100 text-yellow-800 border-yellow-300';
  } else {
    // Good - green
    className = 'bg-green-100 text-green-800 border-green-300';
  }

  const displayHours = Math.floor(hoursLeft);
  const displayText = displayHours <= 48 ? `${displayHours}h left to respond` : 'Respond soon';

  return { hoursLeft, displayText, className, variant };
}

/**
 * Get icon for service type
 */
function getServiceIcon(serviceType) {
  const icons = {
    'mock-interview': Video,
    'essay-review': FileEdit,
    'general-coaching': MessageSquare,
    'group-session': Users,
  };
  return icons[serviceType] || MessageSquare;
}

/**
 * Get file icon based on file extension
 */
function getFileIcon(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (['pdf'].includes(ext)) return { icon: FileText, color: 'text-red-600' };
  if (['doc', 'docx'].includes(ext)) return { icon: FileText, color: 'text-blue-600' };
  if (['txt'].includes(ext)) return { icon: FileText, color: 'text-gray-600' };
  return { icon: FileText, color: 'text-gray-600' };
}

export function RequestCard({
  request,
  onAccept,
  onDecline,
  onProposeAlternative,
  className,
}) {
  const [isApplicantSummaryOpen, setIsApplicantSummaryOpen] = useState(false);

  // Request data destructuring with defaults
  const {
    id,
    applicant = {},
    service = {},
    requestDate = new Date().toISOString(),
    preferredTimes = [],
    message = '',
    materials = [],
    intakeInfo = {},
  } = request || {};

  const {
    name = 'Anonymous Applicant',
    avatar,
    targetPrograms = [],
    icuExperience = {},
    gpa,
    stage = 'Researching',
    previousSessionsCount = 0,
  } = applicant;

  const {
    name: serviceName = 'Coaching Session',
    type: serviceType = 'general-coaching',
    duration = 60,
    price = 100,
    platformFee = 0.2, // 20% platform fee
  } = service;

  // Calculate earnings
  const mentorEarnings = price * (1 - platformFee);

  // Get countdown info
  const countdown = getCountdownInfo(requestDate);
  const ServiceIcon = getServiceIcon(serviceType);

  // Format request date
  const requestDateFormatted = new Date(requestDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  // Get initials for avatar fallback
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          {/* Applicant Info */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Avatar className="w-12 h-12 flex-shrink-0">
              {avatar ? (
                <AvatarImage src={avatar} alt={name} />
              ) : (
                <AvatarFallback>{initials}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
              <p className="text-sm text-gray-500">{requestDateFormatted}</p>
            </div>
          </div>

          {/* Countdown Badge */}
          <Badge className={cn('flex-shrink-0 gap-1.5', countdown.className)}>
            <Clock className="w-3.5 h-3.5" />
            {countdown.displayText}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Applicant Summary - Collapsible */}
        <Collapsible open={isApplicantSummaryOpen} onOpenChange={setIsApplicantSummaryOpen}>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-900">Applicant Summary</span>
                {isApplicantSummaryOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
                {/* Target Programs */}
                {targetPrograms.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Target className="w-4 h-4" />
                      Target Programs
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {targetPrograms.slice(0, 3).map((program, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {program}
                        </Badge>
                      ))}
                      {targetPrograms.length > 3 && (
                        <Badge variant="outline" className="text-xs text-gray-500">
                          +{targetPrograms.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* ICU Experience */}
                {icuExperience.type && (
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Briefcase className="w-4 h-4" />
                      ICU Experience
                    </div>
                    <p className="text-sm text-gray-600">
                      {icuExperience.type} - {icuExperience.years || 0} years
                    </p>
                  </div>
                )}

                {/* GPA */}
                {gpa && (
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <GraduationCap className="w-4 h-4" />
                      GPA
                    </div>
                    <p className="text-sm text-gray-600">{gpa}</p>
                  </div>
                )}

                {/* Application Stage */}
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <TrendingUp className="w-4 h-4" />
                    Stage
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">{stage}</Badge>
                </div>

                {/* Previous Sessions */}
                {previousSessionsCount > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{previousSessionsCount}</span> previous session
                      {previousSessionsCount !== 1 ? 's' : ''} with you
                    </p>
                  </div>
                )}

                {/* View Full Profile Link */}
                <Button variant="link" className="px-0 h-auto text-sm gap-1.5">
                  <ExternalLink className="w-4 h-4" />
                  View Full Profile
                </Button>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Service Details */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <ServiceIcon className="w-5 h-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">{serviceName}</h4>
                <p className="text-sm text-gray-600">{duration} minutes</p>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Service Price</span>
              <span className="font-medium text-gray-900">${price.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Platform Fee (20%)</span>
              <span className="text-gray-600">-${(price * platformFee).toFixed(2)}</span>
            </div>
            <div className="pt-1.5 border-t border-gray-200 flex items-center justify-between">
              <span className="font-medium text-gray-900">You Earn</span>
              <span className="font-bold text-green-600">${mentorEarnings.toFixed(2)}</span>
            </div>
          </div>

          {/* Preferred Times */}
          {preferredTimes.length > 0 && (
            <div className="pt-3 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Preferred Times</p>
              <div className="space-y-1">
                {preferredTimes.slice(0, 3).map((time, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-3.5 h-3.5" />
                    {time}
                  </div>
                ))}
                {preferredTimes.length > 3 && (
                  <p className="text-xs text-gray-500 mt-1">
                    +{preferredTimes.length - 3} more time options
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Applicant's Message/Context */}
        {message && (
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4" />
              Message from Applicant
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{message}</p>
            </div>
          </div>
        )}

        {/* Service-Specific Intake Info */}
        {Object.keys(intakeInfo).length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <AlertCircle className="w-4 h-4" />
              Additional Details
            </div>
            <div className="bg-gray-50 rounded-xl p-3 space-y-2">
              {Object.entries(intakeInfo).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span className="text-gray-900 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Uploaded Materials */}
        {materials.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              Uploaded Materials
            </div>
            <div className="space-y-2">
              {materials.map((file, index) => {
                const { icon: FileIcon, color } = getFileIcon(file.name);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileIcon className={cn('w-5 h-5 flex-shrink-0', color)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        {file.size && (
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 flex-shrink-0"
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-4 border-t border-gray-200">
          <Button
            onClick={() => onAccept?.(request)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2"
          >
            Accept Request
          </Button>
          <Button
            onClick={() => onDecline?.(request)}
            variant="outline"
            className="flex-1"
          >
            Decline
          </Button>
          <Button
            onClick={() => onProposeAlternative?.(request)}
            variant="ghost"
            className="sm:flex-initial"
          >
            Propose Alternative
          </Button>
        </div>

        {/* Urgency Warning */}
        {countdown.hoursLeft <= 6 && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">Action needed soon</p>
              <p className="text-sm text-red-700 mt-0.5">
                Please respond within {Math.floor(countdown.hoursLeft)} hours to maintain your
                response rate and reputation.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RequestCard;
