/**
 * MentorRecommendationCard Component
 *
 * Compact card for displaying a recommended mentor inside the popup.
 * Shows: avatar, name, program, rating, match reasons, and CTA buttons.
 */

import { Link } from 'react-router-dom';
import { Star, GraduationCap, MessageCircle } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

export function MentorRecommendationCard({ mentor, reasons = [], className }) {
  const programName = mentor.program || mentor.programName || 'CRNA Program';

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-xl border bg-card hover:bg-accent/50 transition-colors',
        className
      )}
    >
      {/* Avatar */}
      <Avatar className="w-12 h-12 flex-shrink-0 border-2 border-primary/20">
        <AvatarImage src={mentor.avatarUrl} alt={mentor.name} />
        <AvatarFallback className="bg-primary/10 text-sm font-medium">
          {getInitials(mentor.name)}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name and Program */}
        <h4 className="font-semibold text-sm truncate">{mentor.name}</h4>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <GraduationCap className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{programName}</span>
        </div>

        {/* Rating */}
        {mentor.rating && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{mentor.rating.toFixed(1)}</span>
            {mentor.reviewCount > 0 && (
              <span className="text-xs text-muted-foreground">
                ({mentor.reviewCount} reviews)
              </span>
            )}
          </div>
        )}

        {/* Match Reasons */}
        {reasons.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {reasons.map((reason, i) => (
              <Badge key={i} variant="secondary" className="text-xs py-0">
                {reason}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-2">
          <Button size="sm" variant="default" asChild className="h-7 text-xs">
            <Link to={`/marketplace/mentor/${mentor.id}`}>View Profile</Link>
          </Button>
          <Button size="sm" variant="outline" asChild className="h-7 text-xs">
            <Link to={`/marketplace/messages?to=${mentor.id}`}>
              <MessageCircle className="w-3 h-3 mr-1" />
              Message
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MentorRecommendationCard;
