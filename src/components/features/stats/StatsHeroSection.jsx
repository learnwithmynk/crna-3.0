/**
 * Stats Hero Section
 *
 * Streamlined hero section for the Stats page featuring:
 * - Avatar with level ring (subtle gamification touch)
 * - Name and tagline
 * - Stage badges (application timeline + program status)
 * - Share button
 *
 * Gamification details (points, badges, level progress) moved to Dashboard/Profile
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Share2, Pencil, Check, User } from 'lucide-react';
import { getNextLevelInfo } from '@/data/mockUser';

// Stage labels for display
const STAGE_LABELS = {
  more_than_12_months: '12+ Months Out',
  '6_to_12_months': '6-12 Months Out',
  less_than_6_months: '< 6 Months Out',
  applying_now: 'Applying Now',
  accepted: 'Accepted!',
  enrolled: 'Enrolled',
  exploring: 'Exploring',
  preparing: 'Preparing',
  applying: 'Applying',
  interviewing: 'Interviewing',
  srna: 'SRNA',
};

// Program status labels
const PROGRAM_STATUS_LABELS = {
  exploring: 'Exploring Programs',
  some_targets: 'Some Targets Identified',
  actively_applying: 'Actively Applying',
  waiting_decisions: 'Waiting on Decisions',
  accepted: 'Accepted',
};

// Level colors for the ring
const LEVEL_COLORS = {
  1: { stroke: '#9ca3af', bg: 'bg-gray-100' },
  2: { stroke: '#3b82f6', bg: 'bg-blue-100' },
  3: { stroke: '#22c55e', bg: 'bg-green-100' },
  4: { stroke: '#eab308', bg: 'bg-yellow-100' },
  5: { stroke: '#f97316', bg: 'bg-orange-100' },
  6: { stroke: '#9333ea', bg: 'bg-purple-100' },
};

export function StatsHeroSection({
  user,
  isOwnProfile = true,
  isSharedView = false,
  viewerName = null,
  onEdit,
}) {
  const [linkCopied, setLinkCopied] = useState(false);

  const nextLevelInfo = getNextLevelInfo(user.points);
  const levelColor = LEVEL_COLORS[user.level] || LEVEL_COLORS[1];

  // Generate and copy share link
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/member/${user.id}/stats`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-4">
      {/* Shared View Banner */}
      {isSharedView && viewerName && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-800">
            Viewing <strong>{user.preferredName || user.name}</strong>'s Stats
          </span>
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar with Level Ring */}
            <div className="flex flex-col items-center sm:items-start gap-2">
              <div className="relative">
                {/* Level Ring SVG */}
                <div className="relative w-28 h-28">
                  <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    {/* Background ring */}
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="4"
                    />
                    {/* Progress ring (level progress) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke={levelColor.stroke}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${(nextLevelInfo.progress / 100) * 289} 289`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  {/* Avatar inside the ring */}
                  <div className="absolute inset-2">
                    <Avatar className="w-full h-full border-2 border-white shadow-sm">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback className="text-2xl bg-primary/10">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                {/* Level Badge */}
                <div
                  className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-semibold ${levelColor.bg} border-2 border-white shadow-sm`}
                >
                  Lvl {user.level}
                </div>
                {/* Edit Button */}
                {isOwnProfile && (
                  <button
                    onClick={() => onEdit?.('avatar')}
                    className="absolute top-0 right-0 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                    aria-label="Edit avatar"
                  >
                    <Pencil className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 text-center sm:text-left">
              {/* Name and Share */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.preferredName || user.name}
                  </h1>
                  {user.tagline && (
                    <p className="text-gray-600 text-sm mt-0.5">{user.tagline}</p>
                  )}
                </div>

                {/* Share Button */}
                {isOwnProfile && !isSharedView && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="self-center sm:self-start"
                  >
                    {linkCopied ? (
                      <>
                        <Check className="w-4 h-4 mr-1.5 text-green-600" />
                        <span className="text-green-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 mr-1.5" />
                        Share Profile
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Stage Badges */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {user.currentStage && (
                  <Badge variant="secondary" className="text-xs">
                    {STAGE_LABELS[user.currentStage] || user.currentStage}
                  </Badge>
                )}
                {user.programStatus && (
                  <Badge variant="outline" className="text-xs">
                    {PROGRAM_STATUS_LABELS[user.programStatus] || user.programStatus}
                  </Badge>
                )}
              </div>

              {/* Level Name - subtle indicator */}
              <p className="mt-3 text-sm text-gray-500">
                {user.levelName}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default StatsHeroSection;
