/**
 * ReadyScore Compact Card
 *
 * Compact sidebar version of CRNA School ReadyScore™ with:
 * - 80px circular score (smaller than full version)
 * - Level badge
 * - Top 3 component mini progress bars
 * - Focus this week button
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Lightbulb } from 'lucide-react';

// Color classes based on score
const getScoreColor = (score) => {
  if (score >= 80) return 'text-purple-600';
  if (score >= 60) return 'text-green-600';
  if (score >= 40) return 'text-blue-600';
  return 'text-gray-600';
};

const getProgressColor = (score) => {
  if (score >= 80) return 'bg-purple-500';
  if (score >= 60) return 'bg-green-500';
  if (score >= 40) return 'bg-blue-500';
  return 'bg-gray-400';
};

const getStrokeColor = (score) => {
  if (score >= 80) return '#9333ea';
  if (score >= 60) return '#22c55e';
  if (score >= 40) return '#3b82f6';
  return '#9ca3af';
};

export function ReadyScoreCompactCard({ readinessData, weeklyFocus, onFocusClick }) {
  if (!readinessData) return null;

  const { totalScore, readinessLevel, componentScores } = readinessData;

  // Show top 3 components by weight (Academic, Clinical, Shadowing)
  const topComponents = componentScores?.slice(0, 3) || [];

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-primary" />
          CRNA School ReadyScore™
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Compact Circular Score */}
        <div className="flex justify-center">
          <div className="relative w-20 h-20">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="10"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={getStrokeColor(totalScore)}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${(totalScore / 100) * 264} 264`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-bold ${getScoreColor(totalScore)}`}>
                {totalScore}
              </span>
              <span className="text-[10px] text-gray-400">/100</span>
            </div>
          </div>
        </div>

        {/* Level Badge */}
        <div className="text-center">
          <Badge className={`${readinessLevel.bgColor} ${readinessLevel.color} text-xs`}>
            {readinessLevel.label}
          </Badge>
          <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">
            {readinessLevel.description}
          </p>
        </div>

        {/* Mini Progress Bars - Top 3 */}
        <div className="space-y-2">
          {topComponents.map((component) => (
            <div key={component.key} className="space-y-0.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 truncate">{component.label}</span>
                <span className={`font-medium ${getScoreColor(component.score)}`}>
                  {component.score}%
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor(component.score)}`}
                  style={{ width: `${component.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Focus Button */}
        {weeklyFocus && (
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs"
            onClick={onFocusClick}
          >
            <Lightbulb className="w-3 h-3 mr-1.5" />
            Focus: {weeklyFocus.area}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default ReadyScoreCompactCard;
