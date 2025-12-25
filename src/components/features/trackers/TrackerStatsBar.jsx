/**
 * TrackerStatsBar Component
 *
 * Horizontal row of stat cards for tracker summary stats.
 * Mobile: horizontally scrollable with snap points
 * Desktop: flex row with equal-width cards
 *
 * Example:
 * <TrackerStatsBar
 *   stats={[
 *     { icon: Calendar, value: 12, label: 'Total Events' },
 *     { icon: MapPin, value: 'AANA Meeting', label: 'Most Common' },
 *   ]}
 * />
 */

import { StatCard } from '@/components/ui/stat-card';

export function TrackerStatsBar({ stats }) {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="mb-6">
      {/* Horizontal scroll on mobile, flex row on desktop */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            sublabel={stat.sublabel}
            variant={stat.variant}
            className="min-w-[120px] flex-shrink-0 snap-start md:flex-1 md:min-w-0"
          />
        ))}
      </div>
    </div>
  );
}
