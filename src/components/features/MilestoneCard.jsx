/**
 * MilestoneCard Component
 *
 * Displays a milestone card in the horizontal carousel.
 * Shows icon, title, and progress. Click to expand details.
 *
 * Status-based styling:
 * - Inactive (0% progress): Gray/white, desaturated appearance
 * - Active (1-99% progress): Saturated gradient colors
 * - Complete (100%): Pastel/lighter gradient with green checkmark
 */

import {
  GraduationCap,
  Stethoscope,
  Calculator,
  Search,
  FileText,
  Users,
  Award,
  Medal,
  BookOpen,
  Eye,
  PenTool,
  Mail,
  MessageSquare,
  CheckCircle,
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Icon mapping
const iconMap = {
  GraduationCap,
  Stethoscope,
  Calculator,
  Search,
  FileText,
  Users,
  Award,
  Medal,
  BookOpen,
  Eye,
  PenTool,
  Mail,
  MessageSquare
};

// 13 color configurations - Very subtle tinted backgrounds with colored icons/progress
const GRADIENT_CONFIG = {
  1: { // Brand Yellow
    cardBg: 'bg-amber-50/60',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    progressColor: 'bg-amber-400',
  },
  2: { // Soft Peach/Coral
    cardBg: 'bg-rose-50/60',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    progressColor: 'bg-rose-400',
  },
  3: { // Lavender Purple
    cardBg: 'bg-purple-50/60',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    progressColor: 'bg-purple-400',
  },
  4: { // Mint to Teal
    cardBg: 'bg-emerald-50/60',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    progressColor: 'bg-emerald-500',
  },
  5: { // Sky Blue
    cardBg: 'bg-teal-50/60',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    progressColor: 'bg-teal-400',
  },
  6: { // Warm Sunset
    cardBg: 'bg-orange-50/60',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    progressColor: 'bg-orange-400',
  },
  7: { // Grape
    cardBg: 'bg-violet-50/60',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    progressColor: 'bg-violet-400',
  },
  8: { // Ocean
    cardBg: 'bg-sky-50/60',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
    progressColor: 'bg-sky-400',
  },
  9: { // Rose
    cardBg: 'bg-pink-50/60',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    progressColor: 'bg-pink-400',
  },
  10: { // Golden
    cardBg: 'bg-amber-50/60',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    progressColor: 'bg-amber-400',
  },
  11: { // Teal
    cardBg: 'bg-teal-50/60',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    progressColor: 'bg-teal-400',
  },
  12: { // Blush
    cardBg: 'bg-rose-50/60',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    progressColor: 'bg-rose-400',
  },
  13: { // Cream
    cardBg: 'bg-amber-50/60',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    progressColor: 'bg-amber-400',
  },
};

// Inactive state (no progress) - gray appearance
const INACTIVE_STYLE = {
  cardBg: 'bg-gray-50/80',
  iconBg: 'bg-gray-100',
  iconColor: 'text-gray-400',
  progressColor: 'bg-gray-200',
};

export function MilestoneCard({ milestone, onClick }) {
  const Icon = iconMap[milestone.icon] || Circle;

  // Calculate progress
  const totalSubItems = milestone.subItems.length;
  const completedSubItems = milestone.subItems.filter(item => item.completed).length;
  const progress = totalSubItems > 0 ? (completedSubItems / totalSubItems) * 100 : 0;

  // Determine status: inactive (0%), active (1-99%), complete (100%)
  const isInactive = progress === 0;
  const isComplete = progress === 100;
  const isActive = !isInactive && !isComplete;

  // Get gradient config based on milestone order (1-13, cycling)
  const gradientKey = ((milestone.order - 1) % 13) + 1;
  const baseGradient = GRADIENT_CONFIG[gradientKey];

  // Select styling based on status
  const getStyles = () => {
    if (isInactive) {
      return {
        cardBg: INACTIVE_STYLE.cardBg,
        iconBg: INACTIVE_STYLE.iconBg,
        iconColor: INACTIVE_STYLE.iconColor,
        progressColor: INACTIVE_STYLE.progressColor,
      };
    }
    // Both active and complete use subtle tinted backgrounds
    return {
      cardBg: baseGradient.cardBg,
      iconBg: baseGradient.iconBg,
      iconColor: baseGradient.iconColor,
      progressColor: baseGradient.progressColor,
    };
  };

  const styles = getStyles();

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative shrink-0 w-44 h-52 p-4 cursor-pointer transition-all hover:scale-105 hover:shadow-lg',
        'rounded-2xl border border-gray-200/50 shadow-sm',
        styles.cardBg,
        isInactive && 'opacity-70'
      )}
    >
      {/* Complete checkmark badge */}
      {isComplete && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
      )}

      <div className="flex flex-col h-full">
        {/* Icon */}
        <div className={cn(
          'w-11 h-11 rounded-xl flex items-center justify-center mb-3',
          styles.iconBg
        )}>
          <Icon className={cn('w-6 h-6', styles.iconColor)} />
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold leading-tight line-clamp-2 mb-auto text-gray-900">
          {milestone.title}
        </h3>

        {/* Progress - only percentage and gradient bar */}
        <div className="mt-3">
          <div className="flex justify-end mb-1.5">
            <span className="text-xs font-semibold text-gray-500">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all', styles.progressColor)}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
