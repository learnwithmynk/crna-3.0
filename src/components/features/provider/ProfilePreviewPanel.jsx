/**
 * ProfilePreviewPanel Component
 *
 * Shows a real-time preview of how the mentor's profile will look to applicants.
 * Updates live as the mentor fills out their profile form.
 * Responsive: side panel on desktop, collapsible section on mobile.
 */

import { useState } from 'react';
import { Eye, ChevronDown, ChevronUp, GraduationCap, Dog, Cat, Music, Coffee } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

/**
 * Get initials from first and last name
 */
function getInitials(firstName, lastName) {
  if (!firstName && !lastName) return '?';
  const first = firstName?.[0] || '';
  const last = lastName?.[0] || '';
  return (first + last).toUpperCase();
}

/**
 * Get a personality snippet for the preview
 * Shows 2-3 fun facts from their personality data
 */
function getPersonalitySnippet(personality) {
  if (!personality) return [];

  const snippets = [];

  if (personality.cats_or_dogs) {
    if (personality.cats_or_dogs.toLowerCase().includes('dog')) {
      snippets.push({ icon: Dog, text: 'Dog person' });
    } else if (personality.cats_or_dogs.toLowerCase().includes('cat')) {
      snippets.push({ icon: Cat, text: 'Cat person' });
    }
  }

  if (personality.road_trip_music) {
    snippets.push({ icon: Music, text: personality.road_trip_music.slice(0, 30) });
  }

  if (personality.comfort_food) {
    snippets.push({ icon: Coffee, text: personality.comfort_food });
  }

  return snippets.slice(0, 2);
}

/**
 * Get program display text from school and year
 */
function getProgramText(school, yearInProgram) {
  if (!school && !yearInProgram) return 'CRNA Program';
  if (!school) return `Year ${yearInProgram}`;
  if (!yearInProgram) return school;
  return `${school} • Year ${yearInProgram}`;
}

export function ProfilePreviewPanel({
  profileData = {},
  className
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    firstName = '',
    lastName = '',
    tagline = '',
    bio = '',
    avatarUrl = '',
    personality = {},
    school = '',
    yearInProgram = ''
  } = profileData;

  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Your Name';
  const personalitySnippets = getPersonalitySnippet(personality);
  const programText = getProgramText(school, yearInProgram);

  // Check if profile has any content
  const hasContent = firstName || lastName || tagline || bio || avatarUrl ||
    Object.keys(personality).length > 0 || school || yearInProgram;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header with toggle (mobile) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Profile Preview</h3>
        </div>

        {/* Mobile toggle button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
          aria-label={isExpanded ? 'Collapse preview' : 'Expand preview'}
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      <p className="text-xs text-gray-500">
        This is how applicants will see your profile in the marketplace
      </p>

      {/* Preview Card - always visible on desktop, toggleable on mobile */}
      <div className={cn(
        'lg:block',
        isExpanded ? 'block' : 'hidden'
      )}>
        <Card className="relative overflow-hidden">
          <div className="p-4">
            {/* Empty State */}
            {!hasContent && (
              <div className="text-center py-8 px-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 mx-auto mb-3 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  Start filling out your profile
                </p>
                <p className="text-xs text-gray-400">
                  Your preview will appear here as you add information
                </p>
              </div>
            )}

            {/* Profile Preview Content */}
            {hasContent && (
              <>
                {/* Header: Avatar + Basic Info */}
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="w-14 h-14 border-2 border-primary/20">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt={fullName} />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-sm font-medium">
                      {getInitials(firstName, lastName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {fullName}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{programText}</span>
                    </div>

                    {/* Placeholder for future rating */}
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                      No reviews yet
                    </div>
                  </div>
                </div>

                {/* Tagline */}
                {tagline && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {tagline}
                  </p>
                )}

                {/* Placeholder when no tagline */}
                {!tagline && (
                  <p className="text-sm text-gray-400 italic mb-3 line-clamp-2">
                    Add a tagline to introduce yourself...
                  </p>
                )}

                {/* Personality Snippet */}
                {personalitySnippets.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {personalitySnippets.map((snippet, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full"
                      >
                        <snippet.icon className="w-3 h-3" />
                        <span className="truncate max-w-[100px]">{snippet.text}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Bio Preview */}
                {bio && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">About Me</p>
                    <p className="text-xs text-gray-600 line-clamp-3">
                      {bio}
                    </p>
                  </div>
                )}

                {/* Services Placeholder */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <Badge variant="secondary" className="text-xs opacity-50">
                    Services you add will appear here
                  </Badge>
                </div>

                {/* Footer: Price + Response Time Placeholder */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      Pricing TBD
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    disabled
                  >
                    View Profile
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* View as Applicant Notice */}
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-2">
            <Eye className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-blue-900 mb-1">
                Applicant View
              </p>
              <p className="text-xs text-blue-700">
                This preview shows what applicants will see when browsing the marketplace.
                Complete your profile to make a great first impression.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePreviewPanel;
