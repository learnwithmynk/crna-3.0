/**
 * GRE Scores Card
 *
 * Displays GRE scores with visual indicators:
 * - Quantitative, Verbal, Analytical Writing, Combined
 * - Progress bars showing score ranges
 * - Comparison to typical program requirements
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, BookOpen, CheckCircle2, TrendingUp } from 'lucide-react';
import { programRequirementBenchmarks } from '@/data/mockStatsPage';

export function GREScoresCard({ academicProfile, onEdit, isEditable = true }) {
  if (!academicProfile) return null;

  const { greQuantitative, greVerbal, greAnalyticalWriting, greCombined } = academicProfile;
  const benchmarks = programRequirementBenchmarks.gre;

  // Check if user has taken GRE
  const hasGRE = greQuantitative || greVerbal;

  if (!hasGRE) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="w-4 h-4" />
            GRE Scores
          </CardTitle>
          {isEditable && (
            <button
              onClick={() => onEdit?.('gre')}
              className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Pencil className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-gray-500 text-sm">
            <p>No GRE scores recorded</p>
            <p className="text-xs mt-1">Many programs require GRE scores</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Score bar renderer for Quant/Verbal (130-170 scale)
  const renderScoreBar = (value, label, minBenchmark, competitiveBenchmark) => {
    if (!value) return null;

    // GRE scale is 130-170
    const percentage = ((value - 130) / (170 - 130)) * 100;
    const minPercentage = ((minBenchmark - 130) / (170 - 130)) * 100;
    const competitivePercentage = ((competitiveBenchmark - 130) / (170 - 130)) * 100;

    const meetsCompetitive = value >= competitiveBenchmark;
    const meetsMinimum = value >= minBenchmark;

    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{label}</span>
          <span className={`font-bold ${meetsCompetitive ? 'text-green-600' : meetsMinimum ? 'text-blue-600' : 'text-amber-600'}`}>
            {value}
          </span>
        </div>
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          {/* Benchmark markers */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
            style={{ left: `${minPercentage}%` }}
            title={`Minimum: ${minBenchmark}`}
          />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-green-500 z-10"
            style={{ left: `${competitivePercentage}%` }}
            title={`Competitive: ${competitiveBenchmark}`}
          />
          {/* Value bar */}
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              meetsCompetitive ? 'bg-green-500' : meetsMinimum ? 'bg-blue-500' : 'bg-amber-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  // Writing score bar (0-6 scale)
  const renderWritingBar = (value) => {
    if (!value) return null;

    const percentage = (value / 6) * 100;
    const meetsCompetitive = value >= benchmarks.writingCompetitive;
    const meetsMinimum = value >= benchmarks.writingMinimum;

    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Analytical Writing</span>
          <span className={`font-bold ${meetsCompetitive ? 'text-green-600' : meetsMinimum ? 'text-blue-600' : 'text-amber-600'}`}>
            {value.toFixed(1)}
          </span>
        </div>
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              meetsCompetitive ? 'bg-green-500' : meetsMinimum ? 'bg-blue-500' : 'bg-amber-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  // Determine overall GRE strength
  const quantGood = greQuantitative >= benchmarks.quantitativeCompetitive;
  const verbalGood = greVerbal >= benchmarks.verbalCompetitive;
  const writingGood = greAnalyticalWriting >= benchmarks.writingCompetitive;
  const overallStrong = quantGood && verbalGood;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="w-4 h-4" />
          GRE Scores
        </CardTitle>
        {isEditable && (
          <button
            onClick={() => onEdit?.('gre')}
            className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Pencil className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Combined Score Badge */}
        {greCombined && (
          <div className="flex items-center justify-center">
            <Badge variant="outline" className="text-lg font-bold px-4 py-1">
              Combined: {greCombined}
            </Badge>
          </div>
        )}

        {/* Score Bars */}
        <div className="space-y-3">
          {renderScoreBar(greQuantitative, 'Quantitative', benchmarks.quantitativeMinimum, benchmarks.quantitativeCompetitive)}
          {renderScoreBar(greVerbal, 'Verbal', benchmarks.verbalMinimum, benchmarks.verbalCompetitive)}
          {renderWritingBar(greAnalyticalWriting)}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs pt-2 border-t">
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-amber-400 rounded" />
            Minimum
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-green-500 rounded" />
            Competitive
          </span>
        </div>

        {/* Insight */}
        <div className={`flex items-start gap-2 p-3 rounded-xl ${overallStrong ? 'bg-green-50' : 'bg-blue-50'}`}>
          {overallStrong ? (
            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          ) : (
            <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          )}
          <p className={`text-sm ${overallStrong ? 'text-green-700' : 'text-blue-700'}`}>
            {overallStrong
              ? `Strong GRE scores! Your combined ${greCombined} is competitive for most programs.`
              : `Your GRE scores meet requirements. ${!quantGood ? 'Consider retaking for Quantitative.' : !verbalGood ? 'Consider retaking for Verbal.' : 'Focus on other application areas.'}`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default GREScoresCard;
