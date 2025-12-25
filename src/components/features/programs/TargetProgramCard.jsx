/**
 * TargetProgramCard - Card for target programs in My Programs page
 *
 * Shows progress, status, deadline, and next action for active applications.
 * Clicking the card navigates to the Target Program Detail page.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Target,
  MapPin,
  Calendar,
  MoreVertical,
  ArrowRight,
  AlertCircle,
  Undo2
} from 'lucide-react';
import { getDeadlineStatus } from '@/lib/dateFormatters';

// getDeadlineInfo moved to @/lib/dateFormatters as getDeadlineStatus
// Note: Original had special "1 day left" singular and "X months left" format
// Current shared version uses "Xd left" format consistently

/**
 * Get the next incomplete checklist item as the "next action"
 */
function getNextAction(checklist) {
  if (!checklist || checklist.length === 0) return null;
  const nextItem = checklist.find(item => !item.completed);
  return nextItem ? nextItem.label : null;
}

export function TargetProgramCard({
  savedProgram,
  onRevertToSaved,
  className = ''
}) {
  const { program, targetData, id } = savedProgram;
  const deadlineInfo = getDeadlineStatus(program.applicationDeadline);
  const nextAction = getNextAction(targetData?.checklist);
  const progress = targetData?.progress || 0;
  const status = targetData?.status || 'not_started';

  return (
    <Card className={`group relative overflow-hidden hover:shadow-md transition-shadow ${className}`}>
      {/* Clickable card area */}
      <Link to={`/my-programs/${id}`} className="block">
        {/* Program Image - Compact */}
        <div className="relative h-20 bg-gray-100">
          {program.imageUrl ? (
            <img
              src={program.imageUrl}
              alt={program.schoolName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
              <Target className="w-6 h-6 text-purple-300" />
            </div>
          )}

          {/* Status Badge Overlay */}
          <div className="absolute top-1.5 left-1.5">
            <StatusBadge status={status} size="sm" />
          </div>

          {/* Overflow Menu - 44px touch target */}
          <div className="absolute top-0 right-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="min-w-[44px] min-h-[44px] p-0 hover:bg-transparent"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    onRevertToSaved?.(savedProgram);
                  }}
                  className="text-orange-600 focus:text-orange-600"
                >
                  <Undo2 className="w-4 h-4 mr-2" />
                  Revert to Saved
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-2.5">
          {/* School Name */}
          <h3 className="font-semibold text-sm mb-0.5 line-clamp-1 group-hover:text-primary transition-colors">
            {program.schoolName}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <MapPin className="w-3 h-3" />
            <span>{program.location.city}, {program.location.state}</span>
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-1 text-xs mb-2">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className={`font-medium ${
              deadlineInfo.isUrgent
                ? deadlineInfo.isPast ? 'text-red-600' : 'text-orange-600'
                : 'text-gray-500'
            }`}>
              {deadlineInfo.text}
            </span>
          </div>

          {/* Progress Bar with percentage */}
          <div className="flex items-center gap-2 mb-2">
            <Progress value={progress} className="h-1.5 flex-1" />
            <span className="text-xs font-medium text-gray-600 w-8">{progress}%</span>
          </div>

          {/* Next Action */}
          {nextAction && (
            <div className="flex items-center gap-1.5 text-xs text-primary bg-primary/5 rounded px-2 py-1.5">
              <ArrowRight className="w-3 h-3 flex-shrink-0" />
              <span className="line-clamp-1">Next: {nextAction}</span>
            </div>
          )}
        </div>
      </Link>
    </Card>
  );
}
