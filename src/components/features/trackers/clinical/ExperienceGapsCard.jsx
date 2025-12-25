/**
 * ExperienceGapsCard Component
 *
 * Sidebar card showing experience gaps and monthly goals.
 * Helps users identify what to focus on next.
 */

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  Pill,
  Activity,
  Stethoscope,
  Star,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  generateExperienceGaps,
  generateMonthlyGoals,
  generateStrengths,
} from '@/lib/smartSuggestions';

/**
 * Gap item display
 */
function GapItem({ item, category }) {
  const getCategoryIcon = () => {
    switch (category) {
      case 'medication': return Pill;
      case 'device': return Activity;
      case 'procedure': return Stethoscope;
      default: return Target;
    }
  };

  const Icon = getCategoryIcon();

  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
      <span className="text-gray-700 truncate">{item.label}</span>
      {item.tier && (
        <span className="flex ml-auto flex-shrink-0">
          {Array.from({ length: item.tier }).map((_, i) => (
            <Star
              key={i}
              className="w-2 h-2 fill-amber-400 text-amber-400"
            />
          ))}
        </span>
      )}
      <span className="inline-flex items-center px-2 py-0.5 rounded-xl text-xs font-medium bg-gray-50 text-gray-700 border border-gray-100/50 ml-auto flex-shrink-0">
        {item.percentLogging}%
      </span>
    </div>
  );
}

/**
 * Goal item display
 */
function GoalItem({ goal }) {
  return (
    <div className="flex items-start gap-2 p-3 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-white/40">
      <div className="w-6 h-6 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center flex-shrink-0 mt-0.5">
        <Target className="w-3.5 h-3.5 text-amber-700" />
      </div>
      <span className="text-sm text-amber-900">{goal.message}</span>
    </div>
  );
}

/**
 * Strength item display
 */
function StrengthItem({ strength }) {
  return (
    <div className="flex items-start gap-2 p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-white/40">
      <div className="w-6 h-6 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center flex-shrink-0 mt-0.5">
        <CheckCircle className="w-3.5 h-3.5 text-green-700" />
      </div>
      <span className="text-sm text-green-900">{strength.message}</span>
    </div>
  );
}

/**
 * Main ExperienceGapsCard component
 */
export function ExperienceGapsCard({ entries, unitType = 'mixed_icu', className }) {
  const gaps = useMemo(
    () => generateExperienceGaps(entries, unitType),
    [entries, unitType]
  );

  const goals = useMemo(
    () => generateMonthlyGoals(entries, unitType),
    [entries, unitType]
  );

  const strengths = useMemo(
    () => generateStrengths(entries, unitType),
    [entries, unitType]
  );

  if (!entries || entries.length === 0) {
    return null;
  }

  const hasGaps = gaps.medications.length > 0 || gaps.devices.length > 0 || gaps.procedures.length > 0;

  return (
    <Card className={cn('p-5 bg-white rounded-3xl shadow-sm border-gray-100/50', className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-200 to-teal-100 flex items-center justify-center">
          <Target className="w-5 h-5 text-teal-700" />
        </div>
        <h4 className="font-semibold text-gray-900">Experience Insights</h4>
      </div>

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="mb-4">
          <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            Your Strengths
          </h5>
          <div className="space-y-2">
            {strengths.slice(0, 2).map((s, i) => (
              <StrengthItem key={i} strength={s} />
            ))}
          </div>
        </div>
      )}

      {/* Monthly Goals */}
      {goals.length > 0 && (
        <div className="mb-4">
          <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            Suggested Goals
          </h5>
          <div className="space-y-2">
            {goals.slice(0, 2).map((g, i) => (
              <GoalItem key={i} goal={g} />
            ))}
          </div>
        </div>
      )}

      {/* Experience Gaps */}
      {hasGaps && (
        <div>
          <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            Common Peer Experience You're Missing
          </h5>

          {gaps.devices.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-400 mb-1.5">Devices</div>
              <div className="space-y-1.5">
                {gaps.devices.slice(0, 3).map((item) => (
                  <GapItem key={item.value} item={item} category="device" />
                ))}
              </div>
            </div>
          )}

          {gaps.medications.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-400 mb-1.5">Medications</div>
              <div className="space-y-1.5">
                {gaps.medications.slice(0, 3).map((item) => (
                  <GapItem key={item.value} item={item} category="medication" />
                ))}
              </div>
            </div>
          )}

          {gaps.procedures.length > 0 && (
            <div>
              <div className="text-xs font-medium text-gray-400 mb-1.5">Procedures</div>
              <div className="space-y-1.5">
                {gaps.procedures.slice(0, 3).map((item) => (
                  <GapItem key={item.value} item={item} category="procedure" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!hasGaps && strengths.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          Keep logging to unlock personalized insights!
        </p>
      )}

      {/* Tip */}
      <div className="mt-4 pt-3 border-t border-gray-100/50">
        <p className="text-xs text-gray-500 flex items-center gap-1.5">
          <ArrowRight className="w-3 h-3" />
          Percentages show how many peers log this experience
        </p>
      </div>
    </Card>
  );
}

export default ExperienceGapsCard;
