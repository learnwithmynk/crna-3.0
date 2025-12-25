/**
 * Stats Page Header
 *
 * Displays user identity and gamification summary:
 * - Avatar with edit option
 * - Name and tagline
 * - Share button (generates member-only link)
 * - Application stage and program status badges
 * - Points, level progress, badge count
 */

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Share2,
  Pencil,
  Sparkles,
  Award,
  Trophy,
  Copy,
  Check,
  User,
  ChevronRight,
} from 'lucide-react';
import { getNextLevelInfo } from '@/data/mockUser';

// Stage labels for display
const STAGE_LABELS = {
  more_than_12_months: '12+ Months Out',
  '6_to_12_months': '6-12 Months Out',
  less_than_6_months: '< 6 Months Out',
  applying_now: 'Applying Now',
  accepted: 'Accepted!',
  enrolled: 'Enrolled',
};

// Program status labels
const PROGRAM_STATUS_LABELS = {
  exploring: 'Exploring Programs',
  some_targets: 'Some Targets Identified',
  actively_applying: 'Actively Applying',
  waiting_decisions: 'Waiting on Decisions',
  accepted: 'Accepted',
};

export function StatsPageHeader({
  user,
  isOwnProfile = true,
  isSharedView = false,
  viewerName = null,
  onEdit,
}) {
  const [linkCopied, setLinkCopied] = useState(false);

  const nextLevelInfo = getNextLevelInfo(user.points);

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
            {/* Avatar Section */}
            <div className="flex flex-col items-center sm:items-start gap-2">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-primary/20">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="text-2xl bg-primary/10">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                {isOwnProfile && (
                  <button
                    onClick={() => onEdit?.('avatar')}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                    aria-label="Edit avatar"
                  >
                    <Pencil className="w-4 h-4 text-gray-600" />
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

                {/* Share Button - Only on own profile, not shared view */}
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

              {/* Status Badges */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
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

              {/* Gamification Row */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl">
                {/* Points */}
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-xl font-bold">{user.points.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">points</span>
                </div>

                <div className="hidden sm:block w-px h-8 bg-gray-200" />

                {/* Level Progress */}
                <div className="flex-1 min-w-[150px] max-w-[250px]">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium">
                      Lvl {user.level}: {user.levelName}
                    </span>
                    <span className="text-gray-500">
                      {nextLevelInfo.pointsToNext} to next
                    </span>
                  </div>
                  <Progress value={nextLevelInfo.progress} className="h-2" />
                </div>

                <div className="hidden sm:block w-px h-8 bg-gray-200" />

                {/* Badges */}
                <button
                  className="flex items-center gap-2 hover:bg-white/50 rounded-xl px-2 py-1 -mx-2 transition-colors"
                  onClick={() => {
                    if (user.badges?.length > 0) {
                      toast.info('Badges gallery coming soon', {
                        description: `You have earned ${user.badges.length} badge${user.badges.length > 1 ? 's' : ''}!`,
                      });
                    } else {
                      toast.info('No badges yet', {
                        description: 'Complete activities to earn badges!',
                      });
                    }
                  }}
                >
                  <Award className="w-5 h-5 text-yellow-600" />
                  <span className="font-bold">{user.badges?.length || 0}</span>
                  <span className="text-sm text-gray-500">badges</span>
                  {user.badges?.length > 0 && (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Next Badge Insight */}
              {isOwnProfile && (
                <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span>
                    {nextLevelInfo.pointsToNext <= 50 ? (
                      <span className="text-green-600 font-medium">
                        Almost there! Just {nextLevelInfo.pointsToNext} points to Level {user.level + 1}
                      </span>
                    ) : (
                      <span>
                        {nextLevelInfo.pointsToNext} points until Level {user.level + 1}
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default StatsPageHeader;
