/**
 * MentorCard Component
 *
 * Displays a mentor preview in the marketplace grid.
 * Shows key info, rating, and personality snippet to help
 * applicants find mentors they vibe with.
 */

import { Link } from 'react-router-dom';
import { Star, Heart, Clock, GraduationCap, Coffee, Dog, Cat, Music } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

/**
 * Get initials from a name
 */
function getInitials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format price range from services
 */
function getPriceRange(services) {
  if (!services || services.length === 0) return null;
  const prices = services.filter(s => s.price).map(s => s.price);
  if (prices.length === 0) return null;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `$${min}` : `$${min}-$${max}`;
}

/**
 * Get a personality snippet for the card preview
 * Shows 2-3 fun facts from their personality data
 */
function getPersonalitySnippet(personality) {
  if (!personality) return null;

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

export function MentorCard({
  provider,
  services = [],
  isSaved = false,
  onToggleSave,
  className
}) {
  const priceRange = getPriceRange(services);
  const personalitySnippets = getPersonalitySnippet(provider.personality);
  const isUnavailable = provider.isPaused ||
    (provider.vacationStart && provider.vacationEnd &&
      new Date() >= new Date(provider.vacationStart) &&
      new Date() <= new Date(provider.vacationEnd));

  return (
    <Card
      className={cn('relative overflow-hidden', className)}
      interactive
      data-testid="mentor-card"
    >
      {/* Save Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleSave?.(provider.id);
        }}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        aria-label={isSaved ? 'Remove from saved' : 'Save mentor'}
      >
        <Heart
          className={cn(
            'w-5 h-5 transition-colors',
            isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'
          )}
        />
      </button>

      <Link to={`/marketplace/mentor/${provider.id}`}>
        <div className="p-4">
          {/* Header: Avatar + Basic Info */}
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="w-14 h-14 border-2 border-primary/20">
              <AvatarImage src={provider.avatarUrl} alt={provider.name} />
              <AvatarFallback className="bg-primary/10 text-sm font-medium">
                {getInitials(provider.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{provider.name}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{provider.programName}</span>
              </div>

              {/* Rating */}
              {provider.rating && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{provider.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">
                    ({provider.reviewCount || 0} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Tagline */}
          {provider.tagline && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {provider.tagline}
            </p>
          )}

          {/* Unavailable Badge */}
          {isUnavailable && (
            <Badge variant="warning" className="mb-3">
              Currently Unavailable
            </Badge>
          )}

          {/* Personality Snippet */}
          {personalitySnippets && personalitySnippets.length > 0 && (
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

          {/* Services Preview */}
          {services.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {services.slice(0, 3).map(service => (
                <Badge key={service.id} variant="secondary" className="text-xs">
                  {service.type === 'mock_interview' && 'Mock Interview'}
                  {service.type === 'essay_review' && 'Essay Review'}
                  {service.type === 'strategy_session' && 'Coaching'}
                  {service.type === 'school_qa' && 'Q&A Call'}
                </Badge>
              ))}
              {services.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{services.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Footer: Price + Response Time */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3">
              {priceRange && (
                <span className="text-sm font-semibold text-gray-900">
                  {priceRange}
                </span>
              )}
              {provider.responseTime && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {provider.responseTime}
                </span>
              )}
            </div>

            {/* CTA based on booking model */}
            {!isUnavailable && (
              <Button
                size="sm"
                variant={provider.instantBookEnabled ? 'default' : 'outline'}
                className="text-xs"
              >
                {provider.instantBookEnabled ? 'Book Now' : 'View Profile'}
              </Button>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}

export default MentorCard;
