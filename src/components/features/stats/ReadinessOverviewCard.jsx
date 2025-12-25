/**
 * ReadyScore Overview Card
 *
 * Hero card showing CRNA School ReadyScore™ with:
 * - Overall score (0-100) with circular progress
 * - Readiness level badge
 * - 5 component progress bars
 * - Weekly focus recommendation
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  Stethoscope,
  Eye,
  FileText,
  Calendar,
  Lightbulb,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';

// Icon mapping for components
const COMPONENT_ICONS = {
  academic: GraduationCap,
  clinical: Stethoscope,
  shadowing: Eye,
  materials: FileText,
  engagement: Calendar,
};

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

export function ReadinessOverviewCard({ readinessData, weeklyFocus, onFocusClick }) {
  if (!readinessData) return null;

  const { totalScore, readinessLevel, componentScores, strongest, weakest } = readinessData;

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-primary" />
          CRNA School ReadyScore™
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Display */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Circular Score */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={totalScore >= 80 ? '#9333ea' : totalScore >= 60 ? '#22c55e' : totalScore >= 40 ? '#3b82f6' : '#9ca3af'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(totalScore / 100) * 283} 283`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(totalScore)}`}>
                {totalScore}
              </span>
              <span className="text-xs text-gray-500">out of 100</span>
            </div>
          </div>

          {/* Level and Summary */}
          <div className="flex-1 text-center md:text-left">
            <Badge className={`${readinessLevel.bgColor} ${readinessLevel.color} mb-2`}>
              {readinessLevel.label}
            </Badge>
            <p className="text-gray-600 text-sm mb-3">
              {readinessLevel.description}
            </p>

            {/* Quick Insights */}
            <div className="flex flex-wrap gap-2 text-xs">
              {strongest && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  Strongest: {strongest.label}
                </span>
              )}
              {weakest && weakest.score < 50 && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-full">
                  <Lightbulb className="w-3 h-3" />
                  Focus: {weakest.label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Component Progress Bars */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Breakdown by Area</h4>
          {componentScores.map((component) => {
            const Icon = COMPONENT_ICONS[component.key] || GraduationCap;
            return (
              <div key={component.key} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-600">
                    <Icon className="w-4 h-4" />
                    {component.label}
                  </span>
                  <span className={`font-medium ${getScoreColor(component.score)}`}>
                    {component.score}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(component.score)}`}
                    style={{ width: `${component.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Weekly Focus Recommendation */}
        {weeklyFocus && (
          <button
            onClick={onFocusClick}
            className="w-full p-4 bg-primary/10 hover:bg-primary/15 rounded-xl transition-colors text-left group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 mb-0.5">
                  Focus This Week: {weeklyFocus.area}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {weeklyFocus.action}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
            </div>
          </button>
        )}
      </CardContent>
    </Card>
  );
}

export default ReadinessOverviewCard;
