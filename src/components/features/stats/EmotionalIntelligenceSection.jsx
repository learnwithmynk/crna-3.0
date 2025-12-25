/**
 * Emotional Intelligence Section
 *
 * Displays EQ reflection summary in a compact square card format:
 * - Big centered count number
 * - Compact category badge grid
 * - Coverage progress indicator
 *
 * Design: Square card to sit next to Clinical Experience
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, ChevronRight } from 'lucide-react';
import { EQ_CATEGORIES } from '@/data/mockEQReflections';

export function EmotionalIntelligenceSection({
  reflections = [],
  onViewTracker,
}) {
  // Calculate covered categories
  const categoriesUsed = new Set();
  reflections.forEach((r) => r.categories?.forEach((c) => categoriesUsed.add(c)));
  const coveredCategories = EQ_CATEGORIES.filter((c) => categoriesUsed.has(c.value));
  const coveragePercent = Math.round((coveredCategories.length / EQ_CATEGORIES.length) * 100);

  // Empty state
  if (!reflections || reflections.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Brain className="w-4 h-4" />
            EQ Stories
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-7 px-2" onClick={onViewTracker}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center text-center py-4">
          <Brain className="w-10 h-10 text-gray-200 mb-2" />
          <p className="text-sm text-gray-500">No reflections yet</p>
          <p className="text-xs text-gray-400 mt-1">Build your interview story bank</p>
          <Button size="sm" variant="outline" className="mt-3" onClick={onViewTracker}>
            Add Reflection
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Brain className="w-4 h-4" />
          EQ Stories
        </CardTitle>
        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={onViewTracker}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        {/* Big Centered Number */}
        <div className="text-center py-2">
          <p className="text-4xl font-bold text-purple-600">{reflections.length}</p>
          <p className="text-xs text-gray-500">
            {reflections.length === 1 ? 'reflection' : 'reflections'} logged
          </p>
        </div>

        {/* Coverage Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-gray-500">
            <span>Category Coverage</span>
            <span>{coveredCategories.length}/{EQ_CATEGORIES.length}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all"
              style={{ width: `${coveragePercent}%` }}
            />
          </div>
        </div>

        {/* Compact Category Grid */}
        <div className="grid grid-cols-3 gap-1">
          {EQ_CATEGORIES.slice(0, 9).map((cat) => {
            const isCovered = categoriesUsed.has(cat.value);
            return (
              <div
                key={cat.value}
                className={`px-1.5 py-1 rounded text-center text-[9px] truncate ${
                  isCovered
                    ? 'bg-purple-100 text-purple-700 font-medium'
                    : 'bg-gray-50 text-gray-400'
                }`}
                title={cat.label}
              >
                {cat.label}
              </div>
            );
          })}
        </div>

        {/* Encouragement - subtle */}
        <p className="text-[10px] text-gray-400 text-center pt-1">
          {coveragePercent >= 70
            ? 'Strong interview prep!'
            : coveragePercent >= 40
            ? 'Good progress!'
            : 'Keep building stories'}
        </p>
      </CardContent>
    </Card>
  );
}

export default EmotionalIntelligenceSection;
