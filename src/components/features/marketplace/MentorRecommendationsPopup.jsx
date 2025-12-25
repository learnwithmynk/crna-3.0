/**
 * MentorRecommendationsPopup Component
 *
 * Sheet/modal showing matched mentors with their details and match reasons.
 * Opens from the MentorAvatarStack when clicked.
 */

import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MentorRecommendationCard } from './MentorRecommendationCard';

export function MentorRecommendationsPopup({
  open,
  onOpenChange,
  mentors = [],
  matchData = [],
  title = 'Mentors who can help',
  description,
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {title}
          </SheetTitle>
          {description && (
            <SheetDescription>{description}</SheetDescription>
          )}
        </SheetHeader>

        {/* Mentor Cards */}
        <div className="space-y-3">
          {mentors.map((mentor, i) => (
            <MentorRecommendationCard
              key={mentor.id}
              mentor={mentor}
              reasons={matchData[i]?.reasons || []}
            />
          ))}
        </div>

        {/* Empty State - shouldn't happen per requirements, but just in case */}
        {mentors.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No mentors available right now.</p>
            <p className="text-sm">Check back soon!</p>
          </div>
        )}

        {/* Browse All CTA */}
        <div className="mt-6 pt-4 border-t">
          <Button variant="outline" asChild className="w-full">
            <Link to="/marketplace">Browse all mentors</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MentorRecommendationsPopup;
