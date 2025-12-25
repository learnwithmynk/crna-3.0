/**
 * EQPromptCards Component
 *
 * Grid of prompt cards to inspire EQ reflections:
 * - Shows guided prompts by category
 * - "Start Reflection" button prefills form
 * - Rotates/shuffles prompts for variety
 * - Highlights categories not yet covered
 */

import { useState, useMemo } from 'react';
import {
  Lightbulb,
  ArrowRight,
  Shuffle,
  Scale,
  Users,
  Heart,
  HeartHandshake,
  RefreshCw,
  Crown,
  Brain,
  Globe,
  Shield,
  BadgeCheck,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { REFLECTION_PROMPTS, getCategoryInfo } from '@/data/mockEQReflections';

// Icon mapping
const CATEGORY_ICONS = {
  Scale,
  Users,
  Heart,
  HeartHandshake,
  RefreshCw,
  Crown,
  Brain,
  Globe,
  Shield,
  BadgeCheck,
};

/**
 * Single prompt card
 */
function PromptCard({ prompt, onStart, isHighlighted }) {
  const categoryInfo = getCategoryInfo(prompt.category);
  const IconComponent = categoryInfo ? CATEGORY_ICONS[categoryInfo.icon] : null;

  return (
    <Card
      className={cn(
        'p-4 hover:shadow-md transition-shadow',
        isHighlighted && 'ring-2 ring-primary ring-offset-2'
      )}
    >
      {/* Category Badge */}
      <div className="flex items-center justify-between mb-3">
        {categoryInfo && (
          <Badge variant="outline" className={cn('text-xs', categoryInfo.color)}>
            {IconComponent && <IconComponent className="w-3 h-3 mr-1" />}
            {categoryInfo.label}
          </Badge>
        )}
        {isHighlighted && (
          <span className="text-xs text-primary font-medium">New category!</span>
        )}
      </div>

      {/* Title */}
      <h4 className="font-medium text-gray-900 mb-2">{prompt.title}</h4>

      {/* Prompt */}
      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
        {prompt.prompt}
      </p>

      {/* Follow-up hint */}
      {prompt.followUp && (
        <p className="text-xs text-gray-400 italic mb-4">
          Also consider: {prompt.followUp}
        </p>
      )}

      {/* Start Button */}
      <Button
        size="sm"
        variant="outline"
        onClick={() => onStart(prompt)}
        className="w-full"
      >
        Start Reflection
        <ArrowRight className="w-3 h-3 ml-2" />
      </Button>
    </Card>
  );
}

/**
 * Main component
 */
export function EQPromptCards({
  onStartReflection,
  usedCategories = [],
  maxPrompts = 4,
  className,
}) {
  const [shuffleKey, setShuffleKey] = useState(0);

  // Get prompts, prioritizing unused categories
  const displayPrompts = useMemo(() => {
    // Shuffle based on key
    const shuffled = [...REFLECTION_PROMPTS].sort(() => Math.random() - 0.5);

    // Separate into unused and used categories
    const unusedCategoryPrompts = shuffled.filter(
      (p) => !usedCategories.includes(p.category)
    );
    const usedCategoryPrompts = shuffled.filter((p) =>
      usedCategories.includes(p.category)
    );

    // Prioritize unused categories, then fill with used
    const combined = [...unusedCategoryPrompts, ...usedCategoryPrompts];

    // Return unique categories (one prompt per category, up to max)
    const seen = new Set();
    const unique = [];
    for (const prompt of combined) {
      if (!seen.has(prompt.category) && unique.length < maxPrompts) {
        seen.add(prompt.category);
        unique.push(prompt);
      }
    }

    return unique;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usedCategories, maxPrompts, shuffleKey]);

  const handleShuffle = () => {
    setShuffleKey((k) => k + 1);
  };

  // Count how many categories user hasn't covered yet
  const uncoveredCount = displayPrompts.filter(
    (p) => !usedCategories.includes(p.category)
  ).length;

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-gray-900">Reflection Prompts</h3>
          {uncoveredCount > 0 && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {uncoveredCount} new {uncoveredCount === 1 ? 'category' : 'categories'}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShuffle}
          className="text-gray-500"
        >
          <Shuffle className="w-4 h-4 mr-1" />
          Shuffle
        </Button>
      </div>

      {/* Helper text */}
      <p className="text-sm text-gray-500 mb-4">
        Not sure what to reflect on? Pick a prompt below to get started.
        Covering different categories helps prepare you for diverse interview questions.
      </p>

      {/* Prompt Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayPrompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onStart={onStartReflection}
            isHighlighted={!usedCategories.includes(prompt.category)}
          />
        ))}
      </div>

      {/* Coverage Progress */}
      {usedCategories.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            You've covered {usedCategories.length} of 10 EQ categories.{' '}
            {usedCategories.length < 10 && (
              <span className="text-primary">
                Keep diversifying your reflections!
              </span>
            )}
            {usedCategories.length === 10 && (
              <span className="text-green-600">
                Amazing! You've covered all categories.
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

export default EQPromptCards;
