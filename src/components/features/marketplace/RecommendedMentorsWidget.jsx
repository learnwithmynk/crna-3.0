/**
 * RecommendedMentorsWidget Component
 *
 * Self-contained widget that:
 * 1. Fetches recommended mentors using useRecommendedMentors
 * 2. Displays the MentorAvatarStack with catchy title
 * 3. Shows dynamic subtext based on match reasons
 * 4. Manages the popup state
 *
 * Hides completely if no mentors available (never shows empty state).
 */

import { useState, useMemo } from 'react';
import { Users } from 'lucide-react';
import { useRecommendedMentors } from '@/hooks/useRecommendedMentors';
import { MentorAvatarStack } from './MentorAvatarStack';
import { MentorRecommendationsPopup } from './MentorRecommendationsPopup';
import { cn } from '@/lib/utils';

/**
 * Generate dynamic subtext based on match reasons
 * Makes it personal and speaks to where the user is
 */
function getDynamicSubtext(matchData, mentorCount) {
  if (!matchData || matchData.length === 0) {
    return `${mentorCount} mentors ready to help`;
  }

  // Get the top reason from the first match
  const topMatch = matchData[0];
  const reasons = topMatch?.reasons || [];

  // Priority order for subtext
  if (reasons.some(r => r.includes('target school'))) {
    return "Mentors from your target programs";
  }
  if (reasons.some(r => r.includes('Available'))) {
    return "Available to chat this week";
  }
  if (reasons.some(r => r.includes('ICU') || r.includes('CVICU') || r.includes('MICU'))) {
    return "Mentors with your ICU background";
  }
  if (reasons.some(r => r.includes('interview') || r.includes('Interview'))) {
    return "Ready to help with interviews";
  }
  if (reasons.some(r => r.includes('essay') || r.includes('Essay'))) {
    return "Essay and application experts";
  }
  if (reasons.some(r => r.includes('rating'))) {
    return "Top-rated by other applicants";
  }
  if (reasons.some(r => r.includes('Quick'))) {
    return "Fast responders, ready to help";
  }

  // Default fallback
  return `${mentorCount} mentors matched for you`;
}

export function RecommendedMentorsWidget({
  context = 'general',
  title = 'Find Your Mentor',
  description,
  compact = false,
  className,
}) {
  const [popupOpen, setPopupOpen] = useState(false);
  const { mentors, matchData, loading, hasMentors } = useRecommendedMentors({
    limit: 3,
    context,
  });

  const dynamicSubtext = useMemo(
    () => getDynamicSubtext(matchData, mentors.length),
    [matchData, mentors.length]
  );

  // Don't render anything if no mentors (per user requirement - no empty state)
  if (loading || !hasMentors) {
    return null;
  }

  if (compact) {
    // Compact variant: just the avatar stack
    return (
      <>
        <MentorAvatarStack
          mentors={mentors}
          onClick={() => setPopupOpen(true)}
          className={className}
        />
        <MentorRecommendationsPopup
          open={popupOpen}
          onOpenChange={setPopupOpen}
          mentors={mentors}
          matchData={matchData}
          title={title}
          description={description}
        />
      </>
    );
  }

  // Full variant: pill-shaped card with gradient
  return (
    <>
      <div
        className={cn(
          'px-5 py-4 cursor-pointer transition-all hover:shadow-md rounded-full shadow-sm',
          className
        )}
        style={{
          background: 'linear-gradient(to right, rgba(243, 232, 255, 0.8), rgba(250, 245, 255, 0.6), rgba(255, 255, 255, 0.5))',
        }}
        onClick={() => setPopupOpen(true)}
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-100/80">
            <Users className="w-6 h-6 text-purple-600" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-purple-600">{title}</p>
            <p className="text-sm text-gray-400">{dynamicSubtext}</p>
          </div>

          {/* Avatar stack + count */}
          <MentorAvatarStack
            mentors={mentors}
            onClick={(e) => {
              e.stopPropagation();
              setPopupOpen(true);
            }}
          />
        </div>
      </div>

      <MentorRecommendationsPopup
        open={popupOpen}
        onOpenChange={setPopupOpen}
        mentors={mentors}
        matchData={matchData}
        title={title}
        description={description}
      />
    </>
  );
}

export default RecommendedMentorsWidget;
