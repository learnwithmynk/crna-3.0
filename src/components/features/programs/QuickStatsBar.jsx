/**
 * QuickStatsBar - Horizontal stats row for target programs
 *
 * Shows total targets, submitted count, interview count, and next deadline.
 */

import React from 'react';
import { Target, Send, MessageSquare, Calendar, AlertCircle } from 'lucide-react';

/**
 * Get the nearest upcoming deadline from programs
 */
function getNextDeadline(programs) {
  if (!programs || programs.length === 0) return null;

  const now = new Date();
  const upcomingDeadlines = programs
    .filter(p => p.program.applicationDeadline)
    .map(p => ({
      schoolName: p.program.schoolName,
      deadline: new Date(p.program.applicationDeadline)
    }))
    .filter(d => d.deadline > now)
    .sort((a, b) => a.deadline - b.deadline);

  if (upcomingDeadlines.length === 0) return null;

  const next = upcomingDeadlines[0];
  const diffDays = Math.ceil((next.deadline - now) / (1000 * 60 * 60 * 24));

  return {
    schoolName: next.schoolName,
    daysLeft: diffDays,
    isUrgent: diffDays <= 7
  };
}

export function QuickStatsBar({
  targetPrograms = [],
  className = ''
}) {
  // Calculate stats
  const total = targetPrograms.length;
  const submitted = targetPrograms.filter(p =>
    ['submitted', 'interview_invited', 'interviewed', 'waitlisted', 'accepted', 'denied'].includes(p.targetData?.status)
  ).length;
  const interviews = targetPrograms.filter(p =>
    ['interview_invited', 'interviewed'].includes(p.targetData?.status)
  ).length;
  const nextDeadline = getNextDeadline(targetPrograms);

  const stats = [
    {
      label: 'Total',
      value: total,
      icon: Target,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      label: 'Submitted',
      value: submitted,
      icon: Send,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      label: 'Interviews',
      value: interviews,
      icon: MessageSquare,
      color: 'text-green-600 bg-green-100'
    }
  ];

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {/* Stats Badges */}
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border shadow-sm"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.color}`}>
            <stat.icon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-bold leading-none">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        </div>
      ))}

      {/* Next Deadline */}
      {nextDeadline && (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border shadow-sm ${
          nextDeadline.isUrgent ? 'bg-orange-50 border-orange-200' : 'bg-white'
        }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            nextDeadline.isUrgent ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
          }`}>
            {nextDeadline.isUrgent ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <Calendar className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className={`text-sm font-semibold leading-tight ${
              nextDeadline.isUrgent ? 'text-orange-700' : 'text-gray-900'
            }`}>
              {nextDeadline.daysLeft} days
            </div>
            <div className="text-xs text-gray-500 line-clamp-1">
              {nextDeadline.schoolName}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
