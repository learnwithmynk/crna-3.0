/**
 * SavedProgramCard - Card for saved programs in My Programs page
 *
 * Shows basic program info with "Make Target" and "Unsave" actions.
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  MapPin,
  Calendar,
  GraduationCap,
  Heart,
  DollarSign
} from 'lucide-react';

/**
 * Format currency for tuition display
 */
function formatCurrency(amount) {
  if (!amount) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format date for deadline display
 */
function formatDeadline(dateStr) {
  if (!dateStr) return 'No deadline';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function SavedProgramCard({
  savedProgram,
  onMakeTarget,
  onUnsave,
  className = ''
}) {
  const { program } = savedProgram;

  return (
    <Card className={`group relative overflow-hidden hover:shadow-md transition-shadow ${className}`}>
      {/* Program Image - Compact */}
      <div className="relative h-20 bg-gray-100">
        {program.imageUrl ? (
          <img
            src={program.imageUrl}
            alt={program.schoolName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <GraduationCap className="w-6 h-6 text-gray-300" />
          </div>
        )}

        {/* GRE Badge */}
        <div className="absolute top-1.5 left-1.5">
          <Badge
            variant={program.greRequired ? "default" : "secondary"}
            className={`text-[10px] px-1.5 py-0 ${program.greRequired
              ? "bg-blue-100 text-blue-700 border-blue-200"
              : "bg-green-100 text-green-700 border-green-200"
            }`}
          >
            {program.greRequired ? 'GRE' : 'No GRE'}
          </Badge>
        </div>

        {/* Unsave Button - 44px touch target */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUnsave?.(savedProgram);
          }}
          className="absolute top-0 right-0 min-w-[44px] min-h-[44px] flex items-center justify-center text-red-500 hover:text-red-600 transition-colors"
          title="Remove from saved"
        >
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white">
            <Heart className="w-3.5 h-3.5 fill-current" />
          </span>
        </button>
      </div>

      {/* Card Content */}
      <div className="p-2.5">
        {/* School Name */}
        <h3 className="font-semibold text-sm mb-0.5 line-clamp-1">
          {program.schoolName}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
          <MapPin className="w-3 h-3" />
          <span>{program.location.city}, {program.location.state}</span>
        </div>

        {/* Deadline */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
          <Calendar className="w-3 h-3" />
          <span>{formatDeadline(program.applicationDeadline)}</span>
        </div>

        {/* Tuition */}
        {program.tuition && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <DollarSign className="w-3 h-3" />
            <span>{formatCurrency(program.tuition)}</span>
          </div>
        )}

        {/* Program Type Badges */}
        <div className="flex flex-wrap gap-1 mb-2">
          {program.programType && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {program.programType === 'integrated' ? 'Integrated' : 'Front-loaded'}
            </Badge>
          )}
          {program.degree && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {program.degree}
            </Badge>
          )}
        </div>

        {/* Make Target Button */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onMakeTarget?.(savedProgram);
          }}
          className="w-full h-7 text-xs"
          size="sm"
        >
          <Target className="w-3.5 h-3.5 mr-1.5" />
          Make Target
        </Button>
      </div>
    </Card>
  );
}
