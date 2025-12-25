/**
 * ClinicalEntryCard Component
 *
 * Displays a single clinical entry with:
 * - Date header + truncated notes preview (collapsed)
 * - Expandable details: populations, medications, devices, procedures
 * - Edit/delete actions
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Pencil,
  Trash2,
  Users,
  Pill,
  Activity,
  Stethoscope,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { formatShiftDate } from '@/data/mockClinicalEntries';
import {
  PATIENT_POPULATIONS,
  getMedicationInfo,
  getDeviceInfo,
  getProcedureInfo,
} from '@/data/clinicalCategories';
import { LabelText } from '@/components/ui/label-text';
import { cn } from '@/lib/utils';

/**
 * Pill-shaped badge for items - light green/teal style
 */
function ItemBadge({ label }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200/50">
      {label}
    </span>
  );
}

/**
 * Category section with icon and flex wrap layout
 */
function CategorySection({ icon: Icon, title, count, children }) {
  if (!children || (Array.isArray(children) && children.length === 0)) return null;

  return (
    <div>
      <div className="text-xs font-semibold text-teal-900 uppercase tracking-widest mb-2 flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-teal-700" />
        {title} {count > 0 && `(${count})`}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {children}
      </div>
    </div>
  );
}

/**
 * Truncate text to a max length with ellipsis
 */
function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Main ClinicalEntryCard component
 */
export function ClinicalEntryCard({ entry, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    id,
    shiftDate,
    patientPopulations = [],
    medications = [],
    devices = [],
    procedures = [],
    customPopulations = [],
    customMedications = [],
    customDevices = [],
    customProcedures = [],
    notes,
  } = entry;

  // Get population labels (including custom)
  const populationLabels = [
    ...patientPopulations
      .map((p) => PATIENT_POPULATIONS.find((pop) => pop.value === p)?.label)
      .filter(Boolean),
    ...customPopulations,
  ];

  // Handle card click to toggle expand/collapse
  const handleCardClick = (e) => {
    // Don't toggle if clicking on buttons
    if (e.target.closest('button')) return;
    setIsExpanded(!isExpanded);
  };

  return (
    <Card
      className={cn(
        'group p-5 bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm hover:shadow-md transition-all duration-200',
        'cursor-pointer',
        isExpanded
          ? 'border-[1.5px] border-transparent bg-clip-padding'
          : 'border border-white/20'
      )}
      style={isExpanded ? {
        background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #14b8a6, #10b981, #059669) border-box',
      } : undefined}
      onClick={handleCardClick}
    >
      {/* Header row - always visible */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 text-lg">
            {formatShiftDate(shiftDate)}
          </div>
          {/* Truncated notes preview when collapsed */}
          {notes && !isExpanded && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {truncateText(notes, 120)}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-2">
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onEdit(entry); }}
              className="h-8 w-8 p-0"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onDelete(id); }}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          {/* Expand/collapse toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Expandable details */}
      <div
        className={cn(
          'grid transition-all duration-200 ease-in-out',
          isExpanded
            ? 'grid-rows-[1fr] opacity-100 mt-4'
            : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          {/* Main content - 2x2 grid for categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Populations */}
            <CategorySection icon={Users} title="Populations" count={populationLabels.length}>
              {populationLabels.map((label) => (
                <ItemBadge key={label} label={label} />
              ))}
            </CategorySection>

            {/* Medications */}
            <CategorySection icon={Pill} title="Medications" count={medications.length + customMedications.length}>
              {medications.map((med) => {
                const info = getMedicationInfo(med.medicationId);
                if (!info) return null;
                return <ItemBadge key={med.medicationId} label={info.label} />;
              })}
              {customMedications.map((label) => (
                <ItemBadge key={`custom-med-${label}`} label={label} />
              ))}
            </CategorySection>

            {/* Devices */}
            <CategorySection icon={Activity} title="Devices" count={devices.length + customDevices.length}>
              {devices.map((dev) => {
                const info = getDeviceInfo(dev.deviceId);
                if (!info) return null;
                return <ItemBadge key={dev.deviceId} label={info.label} />;
              })}
              {customDevices.map((label) => (
                <ItemBadge key={`custom-dev-${label}`} label={label} />
              ))}
            </CategorySection>

            {/* Procedures */}
            <CategorySection icon={Stethoscope} title="Procedures" count={procedures.length + customProcedures.length}>
              {procedures.map((proc) => {
                const info = getProcedureInfo(proc.procedureId);
                if (!info) return null;
                return <ItemBadge key={proc.procedureId} label={info.label} />;
              })}
              {customProcedures.map((label) => (
                <ItemBadge key={`custom-proc-${label}`} label={label} />
              ))}
            </CategorySection>
          </div>

          {/* Full notes when expanded */}
          {notes && (
            <div className="p-3 bg-teal-50/60 rounded-2xl border border-teal-100/50">
              <p className="text-sm text-gray-700">{notes}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default ClinicalEntryCard;
