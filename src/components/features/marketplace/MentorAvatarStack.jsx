/**
 * MentorAvatarStack Component
 *
 * Displays 3 overlapping circular avatars with an "X available" text.
 * Clicking opens the mentor recommendations popup.
 */

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

/**
 * Get initials from a name
 */
function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function MentorAvatarStack({ mentors, onClick, className }) {
  if (!mentors?.length) return null;

  const displayCount = Math.min(mentors.length, 3);
  const displayMentors = mentors.slice(0, 3);

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full px-1',
        className
      )}
      aria-label={`View ${mentors.length} available mentors`}
    >
      <div className="flex -space-x-2">
        {displayMentors.map((mentor, i) => (
          <Avatar
            key={mentor.id}
            className={cn(
              'w-8 h-8 border-2 border-white ring-0',
              // Stacking order: first avatar on top
              i === 0 && 'z-30',
              i === 1 && 'z-20',
              i === 2 && 'z-10'
            )}
          >
            <AvatarImage src={mentor.avatarUrl} alt={mentor.name} />
            <AvatarFallback className="text-xs bg-primary/10 font-medium">
              {getInitials(mentor.name)}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        {displayCount} available
      </span>
    </button>
  );
}

export default MentorAvatarStack;
