/**
 * GPA Comparison Card
 *
 * Displays GPA metrics with program requirement comparisons:
 * - Overall GPA, Science GPA, Science w/Forgiveness, Last 60
 * - Visual comparison to typical requirements
 * - Insight about program qualification
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, GraduationCap, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { programRequirementBenchmarks, checkGpaRequirements } from '@/data/mockStatsPage';

export function GpaComparisonCard({ academicProfile, onEdit, isEditable = true }) {
  if (!academicProfile) return null;

  const { overallGpa, scienceGpa, scienceGpaWithForgiveness, last60Gpa } = academicProfile;
  const benchmarks = programRequirementBenchmarks.gpa;
  const gpaCheck = checkGpaRequirements(scienceGpa, overallGpa);

  // Helper to render GPA bar
  const renderGpaBar = (value, label, showBenchmarks = true) => {
    if (!value) return null;

    const percentage = Math.min(100, (value / 4.0) * 100);
    const meetsCompetitive = value >= benchmarks.scienceCompetitive;
    const meetsMinimum = value >= benchmarks.scienceMinimum;

    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{label}</span>
          <span className={`font-bold ${meetsCompetitive ? 'text-green-600' : meetsMinimum ? 'text-blue-600' : 'text-amber-600'}`}>
            {value.toFixed(2)}
          </span>
        </div>
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          {/* Benchmark markers */}
          {showBenchmarks && (
            <>
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
                style={{ left: `${(benchmarks.scienceMinimum / 4.0) * 100}%` }}
                title={`Minimum: ${benchmarks.scienceMinimum}`}
              />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-green-500 z-10"
                style={{ left: `${(benchmarks.scienceCompetitive / 4.0) * 100}%` }}
                title={`Competitive: ${benchmarks.scienceCompetitive}`}
              />
            </>
          )}
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <GraduationCap className="w-4 h-4" />
          GPAs
        </CardTitle>
        {isEditable && (
          <button
            onClick={() => onEdit?.('gpa')}
            className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Edit GPAs"
          >
            <Pencil className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* GPA Values */}
        <div className="space-y-3">
          {renderGpaBar(scienceGpa, 'Science GPA', true)}
          {renderGpaBar(overallGpa, 'Overall GPA', false)}
          {scienceGpaWithForgiveness && scienceGpaWithForgiveness !== scienceGpa && (
            renderGpaBar(scienceGpaWithForgiveness, 'Science (w/ Forgiveness)', false)
          )}
          {last60Gpa && renderGpaBar(last60Gpa, 'Last 60 Credits', false)}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs pt-2 border-t">
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-amber-400 rounded" />
            Min ({benchmarks.scienceMinimum})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-green-500 rounded" />
            Competitive ({benchmarks.scienceCompetitive})
          </span>
        </div>

        {/* Insight */}
        <div className={`flex items-start gap-2 p-3 rounded-xl ${
          gpaCheck.scienceMeetsCompetitive ? 'bg-green-50' : gpaCheck.scienceMeetsMinimum ? 'bg-blue-50' : 'bg-amber-50'
        }`}>
          {gpaCheck.scienceMeetsCompetitive ? (
            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          ) : gpaCheck.scienceMeetsMinimum ? (
            <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          )}
          <p className={`text-sm ${
            gpaCheck.scienceMeetsCompetitive ? 'text-green-700' : gpaCheck.scienceMeetsMinimum ? 'text-blue-700' : 'text-amber-700'
          }`}>
            {gpaCheck.scienceMeetsCompetitive
              ? `Your Science GPA is competitive! You meet requirements for ~${gpaCheck.estimatedProgramsQualified}% of programs.`
              : gpaCheck.scienceMeetsMinimum
              ? `Your Science GPA meets minimum requirements for most programs (~${gpaCheck.estimatedProgramsQualified}%). Consider GPA forgiveness options.`
              : `Your Science GPA is below typical minimums. Look into GPA recalculation or retaking courses.`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default GpaComparisonCard;
