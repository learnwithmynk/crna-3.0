/**
 * ClinicalStatsBar Component
 *
 * Top stats row for the Clinical Experience Tracker showing:
 * - Top population, medication, device, procedure
 * - Counters: meds, devices, procedures
 */

import { Card } from '@/components/ui/card';
import {
  Users,
  Pill,
  Activity,
  Stethoscope,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Single stat item - simplified
 */
function StatItem({ icon: Icon, label, value, className }) {
  if (!value && value !== 0) return null;

  return (
    <div
      className={cn(
        'flex flex-col items-center text-center p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40',
        className
      )}
    >
      <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-teal-200 to-teal-100 flex items-center justify-center mb-2">
        <Icon className="w-4 h-4 text-teal-700" />
      </div>
      <span className="text-xs text-gray-500 mb-0.5">{label}</span>
      <span className="text-sm font-semibold text-gray-900 truncate max-w-full">
        {value}
      </span>
    </div>
  );
}

/**
 * Main ClinicalStatsBar component
 */
export function ClinicalStatsBar({ stats, className }) {
  const {
    topPopulation,
    topMedication,
    topDevice,
    topProcedure,
    uniqueMedications,
    uniqueDevices,
    uniqueProcedures,
  } = stats;

  return (
    <Card className={cn('p-5 bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-white/20', className)}>
      {/* Top items row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Top Population */}
        <StatItem
          icon={Users}
          label="Top Population"
          value={topPopulation || '—'}
        />

        {/* Top Medication */}
        <StatItem
          icon={Pill}
          label="Top Medication"
          value={topMedication || '—'}
        />

        {/* Top Device */}
        <StatItem
          icon={Activity}
          label="Top Device"
          value={topDevice || '—'}
        />

        {/* Top Procedure */}
        <StatItem
          icon={Stethoscope}
          label="Top Procedure"
          value={topProcedure || '—'}
        />
      </div>

      {/* Counts row - simplified without "unique" */}
      <div className="mt-4 pt-4 border-t border-gray-100/30 flex flex-wrap gap-6 justify-center text-sm">
        <span className="flex items-center gap-1.5">
          <span className="text-2xl font-bold text-teal-700">{uniqueMedications || 0}</span>
          <span className="text-gray-600">meds</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-2xl font-bold text-teal-700">{uniqueDevices || 0}</span>
          <span className="text-gray-600">devices</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-2xl font-bold text-teal-700">{uniqueProcedures || 0}</span>
          <span className="text-gray-600">procedures</span>
        </span>
      </div>
    </Card>
  );
}

export default ClinicalStatsBar;
