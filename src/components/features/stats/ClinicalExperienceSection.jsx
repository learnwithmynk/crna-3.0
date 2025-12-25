/**
 * Clinical Experience Section (Simplified for Mentor Review)
 *
 * Shows only essential clinical profile info:
 * - Primary ICU Type (prominent)
 * - Acuity Level badge
 * - Years of experience
 * - Total entries logged
 * - Facility type (if available)
 *
 * Removed: Medications, procedures, devices, populations breakdown
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Stethoscope,
  Building2,
  Clock,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { calculateSimpleAcuityLevel } from '@/lib/simpleAcuityLevel';

// =============================================================================
// CONSTANTS
// =============================================================================

// ICU Type labels
const ICU_TYPE_LABELS = {
  micu: 'MICU',
  sicu: 'SICU',
  cvicu: 'CVICU',
  ccu: 'CCU',
  cticu: 'CTICU',
  neuro_icu: 'Neuro ICU',
  trauma_icu: 'Trauma ICU',
  burn_icu: 'Burn ICU',
  picu: 'PICU',
  nicu: 'NICU',
  mixed: 'Mixed ICU',
};

// Facility type labels
const FACILITY_LABELS = {
  level_1_trauma: 'Level 1 Trauma Center',
  level_2_trauma: 'Level 2 Trauma Center',
  academic_medical: 'Academic Medical Center',
  community_hospital: 'Community Hospital',
  va_hospital: 'VA Hospital',
  teaching: 'Teaching Hospital',
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function ClinicalExperienceSection({
  clinicalProfile,
  clinicalEntries = [],
  onViewTracker,
}) {
  // Calculate acuity level
  const acuityLevel = calculateSimpleAcuityLevel(clinicalEntries);

  // Get ICU info
  const primaryIcu = clinicalProfile?.primaryIcuType;
  const additionalIcus = clinicalProfile?.additionalIcuTypes || [];
  const yearsExperience = clinicalProfile?.totalYearsExperience;
  const facilityType = clinicalProfile?.facilityType;
  const hospitalName = clinicalProfile?.hospital_name;
  const isTeaching = clinicalProfile?.is_teaching_hospital;
  const isLevel1Trauma = clinicalProfile?.is_level_1_trauma;

  // Check if we have any data
  const hasData = clinicalEntries.length > 0 || primaryIcu;

  if (!hasData) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Stethoscope className="w-4 h-4" />
            Clinical Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500 text-sm">
            <Stethoscope className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No clinical experience logged yet</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={onViewTracker}>
              Log Clinical Entry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Determine facility description
  let facilityDescription = '';
  if (facilityType) {
    facilityDescription = FACILITY_LABELS[facilityType] || facilityType;
  } else if (isLevel1Trauma) {
    facilityDescription = 'Level 1 Trauma';
  } else if (isTeaching) {
    facilityDescription = 'Teaching Hospital';
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Stethoscope className="w-4 h-4" />
          Clinical
        </CardTitle>
        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={onViewTracker}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        {/* Main Info - Centered */}
        <div className="text-center space-y-3">
          {/* Primary ICU Type - Large */}
          {primaryIcu && (
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {ICU_TYPE_LABELS[primaryIcu] || primaryIcu.toUpperCase()}
              </p>
              {additionalIcus.length > 0 && (
                <p className="text-xs text-gray-500 mt-0.5">
                  + {additionalIcus.map(icu => ICU_TYPE_LABELS[icu] || icu.toUpperCase()).join(', ')}
                </p>
              )}
            </div>
          )}

          {/* Acuity Badge */}
          {acuityLevel.level !== 'insufficient' && (
            <Badge
              className={`${acuityLevel.bgColor} ${acuityLevel.color} border-0 text-sm font-semibold px-3 py-1`}
            >
              {acuityLevel.label} Acuity
            </Badge>
          )}

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            {yearsExperience && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="font-semibold">{yearsExperience}</span>
                <span className="text-gray-500">years</span>
              </div>
            )}
            {clinicalEntries.length > 0 && (
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="font-semibold">{clinicalEntries.length}</span>
                <span className="text-gray-500">entries</span>
              </div>
            )}
          </div>

          {/* Facility Info */}
          {(facilityDescription || hospitalName) && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
              <Building2 className="w-3.5 h-3.5" />
              {hospitalName && <span>{hospitalName}</span>}
              {hospitalName && facilityDescription && <span>•</span>}
              {facilityDescription && <span>{facilityDescription}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ClinicalExperienceSection;
