/**
 * AcuityScoreCard Component
 *
 * Displays the user's acuity score with:
 * - Circular progress indicator (0-100)
 * - Readiness level badge
 * - Component breakdown
 * - Strengths and gaps summary
 */

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import {
  Activity,
  Pill,
  Stethoscope,
  Users,
  Zap,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculateAcuityScore } from '@/lib/acuityCalculator';

/**
 * Circular Progress Ring
 * Theme: Peach Sunrise (Clinical) - coral to peach to amber
 */
function CircularProgress({ score, size = 140, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  // Color based on score - using Peach Sunrise theme
  const getColor = () => {
    if (score >= 80) return '#E07060'; // coral-red for exceptional
    if (score >= 60) return '#E89070'; // peach for strong
    if (score >= 40) return '#F0A080'; // light peach for developing
    return '#C0A090'; // muted for emerging
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#FFF0EE"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Score text in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-[#8B4030]">{score}</span>
        <span className="text-xs text-[#A05040]/80">/ 100</span>
      </div>
    </div>
  );
}

/**
 * Component Score Bar
 * Theme: Peach Sunrise (Clinical)
 */
function ComponentBar({ icon: Icon, label, score, weight }) {
  const percentage = Math.min(100, Math.round(score));

  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-[#A05040]/60 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-gray-600 truncate">{label}</span>
          <span className="text-[#8B4030] ml-2 font-medium">{percentage}%</span>
        </div>
        <div className="h-2.5 bg-[#FFF6F0] rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              percentage >= 70 ? 'bg-gradient-to-r from-[#F0B090] via-[#E89070] to-[#E07060]' :
              percentage >= 40 ? 'bg-gradient-to-r from-[#FFD0B0] to-[#F0B090]' :
              'bg-[#D0B0A0]'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Main AcuityScoreCard component
 */
export function AcuityScoreCard({ entries, className }) {
  const acuityData = useMemo(() => calculateAcuityScore(entries), [entries]);

  const {
    totalScore,
    readinessLevel,
    components,
    strengths,
    gaps,
    entryCount,
  } = acuityData;

  // Require at least 5 shifts to show acuity score
  if (entryCount < 5) {
    return (
      <Card className={cn('p-5 bg-white rounded-3xl shadow-sm border-gray-100/50', className)}>
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFE0DC] to-[#FFF0D0] flex items-center justify-center mx-auto mb-3">
            <Activity className="w-6 h-6 text-[#8B4030]" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Acuity Score</h4>
          <p className="text-sm text-gray-500">
            {entryCount === 0
              ? 'Log your first shift to start building your score'
              : `Log ${5 - entryCount} more shift${5 - entryCount === 1 ? '' : 's'} to see your acuity score`
            }
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('p-5 bg-white rounded-3xl shadow-sm border-gray-100/50', className)}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900">Acuity Score</h4>
        <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase', readinessLevel.bgColor, readinessLevel.color)}>
          {readinessLevel.label}
        </span>
      </div>

      {/* Score Circle */}
      <div className="flex justify-center mb-4">
        <CircularProgress score={totalScore} />
      </div>

      {/* Readiness Level Description */}
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600">
          {readinessLevel.level === 'emerging' && 'Building your ICU foundation. Keep logging!'}
          {readinessLevel.level === 'developing' && 'Growing experience. Target high-acuity opportunities.'}
          {readinessLevel.level === 'strong' && 'Solid preparation for CRNA applications!'}
          {readinessLevel.level === 'exceptional' && 'Outstanding ICU experience. You\'re well prepared!'}
        </p>
      </div>

      {/* Component Breakdown */}
      <div className="space-y-3 mb-4">
        <ComponentBar
          icon={Activity}
          label="Device Complexity"
          score={components.deviceComplexity.score}
          weight={30}
        />
        <ComponentBar
          icon={Pill}
          label="Medication Variety"
          score={components.medicationVariety.score}
          weight={25}
        />
        <ComponentBar
          icon={Stethoscope}
          label="Procedure Experience"
          score={components.procedureParticipation.score}
          weight={20}
        />
        <ComponentBar
          icon={Users}
          label="Population Diversity"
          score={components.populationDiversity.score}
          weight={15}
        />
        <ComponentBar
          icon={Zap}
          label="Vasopressor Depth"
          score={components.vasopressorDepth.score}
          weight={10}
        />
      </div>

      {/* Strengths & Gaps - Peach Sunrise theme */}
      <div className="border-t border-[#FFE8DC] pt-3 space-y-2">
        {strengths.length > 0 && (
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-[#E07060] mt-0.5 shrink-0" />
            <div className="text-sm">
              <span className="text-gray-600">Strengths: </span>
              <span className="text-[#C05040] font-medium">{strengths.join(', ')}</span>
            </div>
          </div>
        )}
        {gaps.length > 0 && (
          <div className="flex items-start gap-2">
            <TrendingDown className="w-4 h-4 text-[#F0A080] mt-0.5 shrink-0" />
            <div className="text-sm">
              <span className="text-gray-600">Focus areas: </span>
              <span className="text-[#D08060] font-medium">{gaps.join(', ')}</span>
            </div>
          </div>
        )}
      </div>

    </Card>
  );
}

export default AcuityScoreCard;
