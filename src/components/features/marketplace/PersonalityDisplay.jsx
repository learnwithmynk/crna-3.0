/**
 * PersonalityDisplay Component
 *
 * Fun card/badge layout for displaying mentor personality answers.
 * Major differentiator - helps applicants find mentors they vibe with.
 */

import {
  Sparkles,
  Coffee,
  Dog,
  Cat,
  Music,
  Heart,
  Brain,
  Quote,
  Star,
  Utensils,
  Mountain,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Get icon and emoji for each personality field
 */
const PERSONALITY_CONFIG = {
  if_you_knew_me: {
    icon: Sparkles,
    emoji: '✨',
    label: 'If you knew me...',
    color: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  zodiac_sign: {
    icon: Star,
    emoji: '⭐',
    label: 'Zodiac',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  icu_vibe: {
    icon: Heart,
    emoji: '💉',
    label: 'ICU Vibe',
    color: 'bg-pink-50 text-pink-700 border-pink-200'
  },
  cats_or_dogs: {
    icon: null, // Will determine dynamically
    emoji: null,
    label: 'Pet Preference',
    color: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  favorite_patient_population: {
    icon: Brain,
    emoji: '🏥',
    label: 'Favorite Patients',
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200'
  },
  road_trip_music: {
    icon: Music,
    emoji: '🎵',
    label: 'Road Trip Music',
    color: 'bg-green-50 text-green-700 border-green-200'
  },
  weird_fact: {
    icon: Lightbulb,
    emoji: '🤯',
    label: 'Weird Fact',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200'
  },
  comfort_food: {
    icon: Utensils,
    emoji: '🍕',
    label: 'Comfort Food',
    color: 'bg-orange-50 text-orange-700 border-orange-200'
  },
  when_not_studying: {
    icon: Mountain,
    emoji: '🌟',
    label: 'When Not Studying',
    color: 'bg-teal-50 text-teal-700 border-teal-200'
  },
  motto: {
    icon: Quote,
    emoji: '💬',
    label: 'Life Motto',
    color: 'bg-rose-50 text-rose-700 border-rose-200'
  }
};

/**
 * Get pet icon based on answer
 */
function getPetIcon(value) {
  if (!value) return Dog;
  const lower = value.toLowerCase();
  if (lower.includes('cat')) return Cat;
  if (lower.includes('dog')) return Dog;
  return Heart; // Both or neither
}

/**
 * Get pet emoji based on answer
 */
function getPetEmoji(value) {
  if (!value) return '🐕';
  const lower = value.toLowerCase();
  if (lower.includes('cat')) return '🐱';
  if (lower.includes('dog')) return '🐕';
  return '❤️';
}

/**
 * Individual personality card
 */
function PersonalityCard({ field, value, variant = 'default' }) {
  const config = PERSONALITY_CONFIG[field];
  if (!config || !value) return null;

  // Handle cats_or_dogs specially
  const Icon = field === 'cats_or_dogs' ? getPetIcon(value) : config.icon;
  const emoji = field === 'cats_or_dogs' ? getPetEmoji(value) : config.emoji;

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border',
          config.color
        )}
        data-testid="personality-card"
      >
        <span>{emoji}</span>
        <span className="truncate max-w-[150px]">{value}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'p-3 rounded-xl border',
        config.color
      )}
      data-testid="personality-card"
    >
      <div className="flex items-start gap-2">
        <span className="text-lg">{emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium opacity-75 mb-0.5">{config.label}</p>
          <p className="text-sm font-medium">{value}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Main personality display component
 */
export function PersonalityDisplay({
  personality,
  variant = 'default',
  maxItems,
  className
}) {
  if (!personality) return null;

  // Get non-empty personality fields
  const entries = Object.entries(personality)
    .filter(([_, value]) => value && value.trim())
    .slice(0, maxItems);

  if (entries.length === 0) return null;

  if (variant === 'compact') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {entries.map(([field, value]) => (
          <PersonalityCard
            key={field}
            field={field}
            value={value}
            variant="compact"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-500" />
        Get to Know Me
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {entries.map(([field, value]) => (
          <PersonalityCard
            key={field}
            field={field}
            value={value}
            variant="default"
          />
        ))}
      </div>
    </div>
  );
}

export default PersonalityDisplay;
