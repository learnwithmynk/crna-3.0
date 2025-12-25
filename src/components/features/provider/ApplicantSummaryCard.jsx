/**
 * ApplicantSummaryCard Component
 *
 * Shows a summary of an applicant for providers/mentors to understand who they're working with.
 * Displays key stats, application stage, and session history.
 *
 * Features:
 * - Avatar + Name + Member badge
 * - Optional "View Full Profile" link (if member)
 * - Stats grid: Target Programs, ICU Experience, GPA, Stage
 * - Session history with ratings
 * - Quick insights (matched schools, similar background)
 *
 * Props:
 * - applicant: Applicant data object
 * - sessionHistory: Array of past sessions (optional)
 * - showFullProfile: Boolean to show/hide "View Full Profile" link
 * - className: Additional CSS classes
 */

import { useState } from 'react';
import {
  User,
  Heart,
  GraduationCap,
  Target,
  TrendingUp,
  Star,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Get initials from name
 */
function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/**
 * Format stage for display
 */
function formatStage(stage) {
  const stageMap = {
    exploring: 'Exploring',
    planning: 'Planning',
    strategizing: 'Strategizing',
    applying_now: 'Actively Applying',
    accepted: 'Accepted',
    in_school: 'In School'
  };
  return stageMap[stage] || 'Unknown';
}

/**
 * Truncate text to specified length
 */
function truncateText(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function ApplicantSummaryCard({
  applicant = {},
  sessionHistory = [],
  showFullProfile = false,
  className
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract applicant data
  const {
    id,
    name = 'Unknown Applicant',
    avatarUrl,
    subscriptionTier = 'free',
    targetPrograms = [],
    icuType = 'Not specified',
    icuYears,
    gpa,
    gpaPrivate = false,
    stage = 'exploring',
    schoolsAttended = [], // Schools the provider attended (for matching)
    icuTypeMatch = false, // Whether applicant's ICU type matches provider's
  } = applicant;

  const isMember = subscriptionTier !== 'free' && subscriptionTier !== 'lead';
  const hasSessionHistory = sessionHistory && sessionHistory.length > 0;

  // Format target programs for display
  const programsList = targetPrograms.length > 0
    ? targetPrograms.slice(0, 3).map(p => p.schoolName || p.name).join(', ')
    : 'None yet';
  const hasMorePrograms = targetPrograms.length > 3;

  // Format ICU experience
  const icuExperience = icuYears
    ? `${icuYears} year${icuYears !== 1 ? 's' : ''} ${icuType.toUpperCase()}`
    : icuType.toUpperCase();

  // Format GPA display
  const gpaDisplay = gpaPrivate
    ? 'Not shared'
    : gpa
    ? gpa.toFixed(2)
    : 'Not entered';

  // Check for school matches
  const matchedSchools = targetPrograms.filter(tp =>
    schoolsAttended?.some(sa => sa.toLowerCase() === tp.schoolName?.toLowerCase())
  );

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <Avatar className="h-12 w-12">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 font-semibold">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>

            {/* Name + Badge */}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg mb-1 flex items-center gap-2 flex-wrap">
                {name}
                {isMember && (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    CRNA Club Member
                  </Badge>
                )}
              </CardTitle>

              {/* View Full Profile Link */}
              {showFullProfile && isMember && (
                <a
                  href={`/applicants/${id}`}
                  className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1 mt-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Full Profile
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats Grid (2x2) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Target Programs */}
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
              <Target className="w-3.5 h-3.5" />
              Target Programs
            </div>
            <div className="text-sm font-medium text-gray-900">
              {truncateText(programsList, 25)}
              {hasMorePrograms && ` +${targetPrograms.length - 3}`}
            </div>
          </div>

          {/* ICU Experience */}
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
              <Heart className="w-3.5 h-3.5" />
              ICU Experience
            </div>
            <div className="text-sm font-medium text-gray-900">
              {icuExperience}
            </div>
          </div>

          {/* GPA */}
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
              <GraduationCap className="w-3.5 h-3.5" />
              GPA
            </div>
            <div className="text-sm font-medium text-gray-900">
              {gpaDisplay}
            </div>
          </div>

          {/* Stage */}
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Stage
            </div>
            <div className="text-sm font-medium text-gray-900">
              {formatStage(stage)}
            </div>
          </div>
        </div>

        {/* Session History */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900">
              Session History
            </h4>
            {hasSessionHistory && sessionHistory.length > 2 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-auto p-0 text-xs text-gray-600 hover:text-gray-900"
              >
                {isExpanded ? (
                  <>
                    Show less <ChevronUp className="w-3 h-3 ml-1" />
                  </>
                ) : (
                  <>
                    Show all ({sessionHistory.length}) <ChevronDown className="w-3 h-3 ml-1" />
                  </>
                )}
              </Button>
            )}
          </div>

          {!hasSessionHistory ? (
            <p className="text-sm text-gray-500 italic">
              First time client
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-gray-600 mb-2">
                {sessionHistory.length} previous session{sessionHistory.length !== 1 ? 's' : ''}
              </p>
              <div className="space-y-2">
                {sessionHistory.slice(0, isExpanded ? undefined : 2).map((session, index) => (
                  <div
                    key={session.id || index}
                    className="flex items-start justify-between bg-gray-50 rounded p-2 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {session.serviceName || 'Session'}
                      </div>
                      <div className="text-gray-500">
                        {session.date || 'No date'}
                      </div>
                    </div>
                    {session.rating && (
                      <div className="flex items-center gap-0.5 ml-2 flex-shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'w-3 h-3',
                              i < session.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Insights */}
        {(matchedSchools.length > 0 || icuTypeMatch) && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Quick Insights
            </h4>
            <div className="space-y-1.5">
              {matchedSchools.length > 0 && (
                <div className="flex items-start gap-2 text-xs text-green-700 bg-green-50 rounded p-2">
                  <div className="flex-shrink-0 mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <p>
                    Targeting <strong>{matchedSchools[0].schoolName}</strong>
                    {matchedSchools.length > 1 && ` and ${matchedSchools.length - 1} other school${matchedSchools.length > 2 ? 's' : ''}`} you attended
                  </p>
                </div>
              )}
              {icuTypeMatch && (
                <div className="flex items-start gap-2 text-xs text-blue-700 bg-blue-50 rounded p-2">
                  <div className="flex-shrink-0 mt-0.5">
                    <Heart className="w-3.5 h-3.5" />
                  </div>
                  <p>
                    Similar ICU background ({icuType.toUpperCase()})
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ApplicantSummaryCard;
