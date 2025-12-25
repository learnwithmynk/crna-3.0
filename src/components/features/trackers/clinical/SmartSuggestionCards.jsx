/**
 * SmartSuggestionCards Component
 *
 * Displays smart suggestions based on peer comparison.
 * Shows prompts like "72% of CVICU nurses log Impella - do you have access?"
 */

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Lightbulb,
  Pill,
  Activity,
  Stethoscope,
  Star,
  Users,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateSmartSuggestions, getComparisonStats } from '@/lib/smartSuggestions';

/**
 * Single suggestion card
 */
function SuggestionCard({ suggestion }) {
  const { category, item, percentage, message } = suggestion;

  const getCategoryIcon = () => {
    switch (category) {
      case 'medication': return Pill;
      case 'device': return Activity;
      case 'procedure': return Stethoscope;
      default: return Lightbulb;
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'medication': return 'bg-blue-50 border-blue-100';
      case 'device': return 'bg-purple-50 border-purple-100';
      case 'procedure': return 'bg-green-50 border-green-100';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

  const Icon = getCategoryIcon();

  return (
    <div className={cn('p-3 rounded-2xl border border-gray-100/50', getCategoryColor())}>
      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
          <Icon className="w-3.5 h-3.5 text-gray-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-gray-900">
              {item.label}
            </span>
            {item.tier && (
              <span className="flex">
                {Array.from({ length: item.tier }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-2.5 h-2.5 fill-amber-400 text-amber-400"
                  />
                ))}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600">{message}</p>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-medium bg-white/80 text-gray-700 border border-gray-100/50 flex-shrink-0">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

/**
 * Peer comparison stats bar
 */
function PeerComparisonBar({ stats }) {
  return (
    <div className="bg-gradient-to-br from-[#C6F7E2] via-[#A8F0D4] to-[#8EEDC7] rounded-2xl p-4 border border-white/20">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center">
          <Users className="w-4 h-4 text-teal-700" />
        </div>
        <span className="text-sm font-semibold text-teal-900">
          Compared to {stats.sampleSize.toLocaleString()} {stats.unitLabel} nurses
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-lg font-bold text-teal-900">
            {stats.medicationCoverage}%
          </div>
          <div className="text-xs text-teal-800/70">Med Coverage</div>
        </div>
        <div>
          <div className="text-lg font-bold text-teal-900">
            {stats.deviceCoverage}%
          </div>
          <div className="text-xs text-teal-800/70">Device Coverage</div>
        </div>
        <div>
          <div className="text-lg font-bold text-teal-900">
            {stats.procedureCoverage}%
          </div>
          <div className="text-xs text-teal-800/70">Procedure Coverage</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Main SmartSuggestionCards component
 */
export function SmartSuggestionCards({ entries, unitType = 'mixed_icu', className }) {
  const suggestions = useMemo(
    () => generateSmartSuggestions(entries, unitType),
    [entries, unitType]
  );

  const stats = useMemo(
    () => getComparisonStats(entries, unitType),
    [entries, unitType]
  );

  if (!entries || entries.length === 0) {
    return null;
  }

  if (suggestions.length === 0) {
    return (
      <Card className={cn('p-5 bg-white rounded-3xl shadow-sm border-gray-100/50', className)}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-200 to-green-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-700" />
          </div>
          <h4 className="font-semibold text-gray-900">Great Coverage!</h4>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          You're logging experience similar to your peers. Keep it up!
        </p>
        <PeerComparisonBar stats={stats} />
      </Card>
    );
  }

  return (
    <Card className={cn('p-5 bg-white rounded-3xl shadow-sm border-gray-100/50', className)}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-200 to-amber-100 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-amber-700" />
        </div>
        <h4 className="font-semibold text-gray-900">Smart Suggestions</h4>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Based on what other {stats.unitLabel} nurses commonly log
      </p>

      {/* Peer comparison stats */}
      <PeerComparisonBar stats={stats} />

      {/* Suggestions grid */}
      <div className="mt-4 space-y-2">
        {suggestions.slice(0, 4).map((suggestion) => (
          <SuggestionCard key={suggestion.itemId} suggestion={suggestion} />
        ))}
      </div>

      {suggestions.length > 4 && (
        <p className="text-xs text-gray-400 mt-3 text-center">
          +{suggestions.length - 4} more suggestions
        </p>
      )}
    </Card>
  );
}

export default SmartSuggestionCards;
