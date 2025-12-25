/**
 * Clinical Skills Breakdown
 *
 * Tabbed display of clinical competencies:
 * - Populations
 * - Medications
 * - Devices
 * - Procedures
 *
 * Shows counts and confidence levels for each
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Stethoscope,
  Users,
  Pill,
  Monitor,
  Activity,
  ChevronRight,
  CheckCircle2,
  Eye,
  GraduationCap,
} from 'lucide-react';

// Confidence level config
const CONFIDENCE_CONFIG = {
  could_teach: {
    label: 'Could Teach',
    icon: GraduationCap,
    badgeClass: 'bg-green-100 text-green-700 border-green-200',
  },
  used_it: {
    label: 'Used It',
    icon: CheckCircle2,
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  observed: {
    label: 'Observed',
    icon: Eye,
    badgeClass: 'bg-gray-100 text-gray-600 border-gray-200',
  },
};

// Tab config
const TABS = [
  { id: 'populations', label: 'Populations', icon: Users },
  { id: 'medications', label: 'Medications', icon: Pill },
  { id: 'devices', label: 'Devices', icon: Monitor },
  { id: 'procedures', label: 'Procedures', icon: Activity },
];

export function ClinicalSkillsBreakdown({
  clinicalEntries = [],
  onViewTracker,
}) {
  // Aggregate skills from entries
  const aggregateSkills = () => {
    const populations = {};
    const medications = {};
    const devices = {};
    const procedures = {};

    clinicalEntries.forEach((entry) => {
      // Populations
      entry.patientPopulations?.forEach((pop) => {
        if (!populations[pop]) populations[pop] = { count: 0, label: pop };
        populations[pop].count++;
      });

      // Medications
      entry.medications?.forEach((med) => {
        const id = typeof med === 'string' ? med : med.medicationId;
        const confidence = typeof med === 'string' ? 'used_it' : med.confidenceLevel;
        if (!medications[id]) {
          medications[id] = { count: 0, confidence: 'observed', label: id };
        }
        medications[id].count++;
        // Update to highest confidence
        if (confidence === 'could_teach' ||
            (confidence === 'used_it' && medications[id].confidence !== 'could_teach')) {
          medications[id].confidence = confidence;
        }
      });

      // Devices
      entry.devices?.forEach((dev) => {
        const id = typeof dev === 'string' ? dev : dev.deviceId;
        const confidence = typeof dev === 'string' ? 'used_it' : dev.confidenceLevel;
        if (!devices[id]) {
          devices[id] = { count: 0, confidence: 'observed', label: id };
        }
        devices[id].count++;
        if (confidence === 'could_teach' ||
            (confidence === 'used_it' && devices[id].confidence !== 'could_teach')) {
          devices[id].confidence = confidence;
        }
      });

      // Procedures
      entry.procedures?.forEach((proc) => {
        const id = typeof proc === 'string' ? proc : proc.procedureId;
        const confidence = typeof proc === 'string' ? 'used_it' : proc.confidenceLevel;
        if (!procedures[id]) {
          procedures[id] = { count: 0, confidence: 'observed', label: id };
        }
        procedures[id].count++;
        if (confidence === 'could_teach' ||
            (confidence === 'used_it' && procedures[id].confidence !== 'could_teach')) {
          procedures[id].confidence = confidence;
        }
      });
    });

    return {
      populations: Object.values(populations).sort((a, b) => b.count - a.count),
      medications: Object.values(medications).sort((a, b) => b.count - a.count),
      devices: Object.values(devices).sort((a, b) => b.count - a.count),
      procedures: Object.values(procedures).sort((a, b) => b.count - a.count),
    };
  };

  const skills = aggregateSkills();

  // Format label (replace underscores, capitalize)
  const formatLabel = (str) => {
    return str
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Render skill list
  const renderSkillList = (items, showConfidence = false) => {
    if (!items || items.length === 0) {
      return (
        <div className="text-center py-6 text-gray-500 text-sm">
          <p>No items logged yet</p>
          <Button size="sm" variant="outline" className="mt-2" onClick={onViewTracker}>
            Log Clinical Entry
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-1.5">
        {items.slice(0, 15).map((item, index) => {
          const config = showConfidence ? CONFIDENCE_CONFIG[item.confidence] : null;

          return (
            <Badge
              key={index}
              variant="outline"
              className={`text-xs ${config?.badgeClass || 'bg-gray-50'}`}
            >
              {formatLabel(item.label)}
              {item.count > 1 && (
                <span className="ml-1 text-gray-400">({item.count})</span>
              )}
            </Badge>
          );
        })}
        {items.length > 15 && (
          <Badge variant="outline" className="text-xs bg-gray-50">
            +{items.length - 15} more
          </Badge>
        )}
      </div>
    );
  };

  // Get counts for tab badges
  const counts = {
    populations: skills.populations.length,
    medications: skills.medications.length,
    devices: skills.devices.length,
    procedures: skills.procedures.length,
  };

  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);

  if (totalCount === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Stethoscope className="w-4 h-4" />
            Clinical Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500 text-sm">
            <Stethoscope className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No clinical entries logged yet</p>
            <p className="text-xs mt-1">Track your ICU experience for program applications</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={onViewTracker}>
              Log Clinical Entry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Stethoscope className="w-4 h-4" />
          Clinical Skills
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onViewTracker}>
          View Tracker <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="populations" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="text-xs px-2 data-[state=active]:bg-primary data-[state=active]:text-gray-900"
              >
                <tab.icon className="w-3 h-3 mr-1 hidden sm:inline" />
                {tab.label}
                {counts[tab.id] > 0 && (
                  <span className="ml-1 text-gray-400">({counts[tab.id]})</span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="populations" className="mt-0">
            {renderSkillList(skills.populations, false)}
          </TabsContent>

          <TabsContent value="medications" className="mt-0">
            {renderSkillList(skills.medications, true)}
            {/* Confidence Legend */}
            {skills.medications.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t text-xs text-gray-500">
                {Object.entries(CONFIDENCE_CONFIG).map(([key, config]) => (
                  <span key={key} className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${config.badgeClass.split(' ')[0]}`} />
                    {config.label}
                  </span>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="devices" className="mt-0">
            {renderSkillList(skills.devices, true)}
            {skills.devices.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t text-xs text-gray-500">
                {Object.entries(CONFIDENCE_CONFIG).map(([key, config]) => (
                  <span key={key} className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${config.badgeClass.split(' ')[0]}`} />
                    {config.label}
                  </span>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="procedures" className="mt-0">
            {renderSkillList(skills.procedures, true)}
            {skills.procedures.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t text-xs text-gray-500">
                {Object.entries(CONFIDENCE_CONFIG).map(([key, config]) => (
                  <span key={key} className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${config.badgeClass.split(' ')[0]}`} />
                    {config.label}
                  </span>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default ClinicalSkillsBreakdown;
