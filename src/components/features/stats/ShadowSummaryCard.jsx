/**
 * Shadow Summary Card (Simplified for Mentor Review)
 *
 * Shows only essential shadow experience info:
 * - Total shadow hours (large, prominent)
 * - Total shadow days
 * - Optional: Unique CRNAs and facilities
 *
 * Removed: Progress bar, on-track status, LOR suggestions, skills breakdown
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Eye,
  Clock,
  Users,
  Building2,
  ChevronRight,
  Calendar,
} from 'lucide-react';

export function ShadowSummaryCard({
  shadowStats,
  onViewTracker,
}) {
  if (!shadowStats) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Eye className="w-4 h-4" />
            Shadow Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500 text-sm">
            <Eye className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No shadow days logged yet</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={onViewTracker}>
              Log Shadow Day
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { totalHours, totalDays, uniqueCRNAs, uniqueFacilities } = shadowStats;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Eye className="w-4 h-4" />
          Shadowing
        </CardTitle>
        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={onViewTracker}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        {/* Main Stats - Centered */}
        <div className="text-center space-y-4">
          {/* Total Hours - Large and prominent */}
          <div>
            <p className="text-4xl font-bold text-gray-800">{totalHours}</p>
            <p className="text-sm text-gray-500">shadow hours</p>
          </div>

          {/* Secondary Stats Row */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="font-semibold">{totalDays}</span>
              <span className="text-gray-500">days</span>
            </div>
            {uniqueCRNAs > 0 && (
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="font-semibold">{uniqueCRNAs}</span>
                <span className="text-gray-500">CRNAs</span>
              </div>
            )}
          </div>

          {/* Facilities - Optional */}
          {uniqueFacilities > 0 && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
              <Building2 className="w-3.5 h-3.5" />
              <span>{uniqueFacilities} {uniqueFacilities === 1 ? 'facility' : 'facilities'}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ShadowSummaryCard;
