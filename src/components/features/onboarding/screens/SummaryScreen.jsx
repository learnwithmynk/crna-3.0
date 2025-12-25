/**
 * SummaryScreen
 *
 * Final onboarding screen showing personalized summary and first priority.
 * Creates the "aha moment" by reflecting back what we learned.
 */

import { useMemo, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Sparkles,
  Target,
  Clock,
  Award,
  ArrowRight,
  Stethoscope,
  GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/useWindowSize';

// Helper to format experience
function formatExperience(years, months) {
  const parts = [];
  if (years > 0) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
  return parts.join(' ') || 'No experience logged';
}

// Get timeline display text
function getTimelineLabel(timeline) {
  const labels = {
    exploring_18_plus: 'Foundation Building',
    strategizing_6_18: 'Strategy Mode',
    applying_soon: 'Execution Mode',
    actively_applying: 'Execution Mode',
    accepted: 'Accepted!',
  };
  return labels[timeline] || 'Getting Started';
}

// Get first priority based on data
function getFirstPriority(data) {
  const { shadowHours, certifications, icuYears, icuMonths, greStatus, targetSchools } = data;

  // Check for missing CCRN
  if (!certifications?.includes('CCRN')) {
    return {
      action: 'Work toward your CCRN certification',
      reason: 'CCRN is required or preferred by most programs',
      link: '/my-stats#certifications',
    };
  }

  // Check for low shadow hours
  if ((shadowHours || 0) < 20) {
    return {
      action: 'Log more shadow hours',
      reason: `You have ${shadowHours || 0} hours. Most programs expect 20-40 hours.`,
      link: '/trackers/shadow',
    };
  }

  // Check for low ICU experience
  const totalMonths = (icuYears || 0) * 12 + (icuMonths || 0);
  if (totalMonths < 12) {
    return {
      action: 'Continue building ICU experience',
      reason: 'Most programs require 1-2 years minimum',
      link: '/trackers/clinical',
    };
  }

  // Check for GRE
  if (greStatus === 'planning') {
    return {
      action: 'Start preparing for the GRE',
      reason: 'Give yourself 2-3 months to prepare',
      link: '/my-stats#gre',
    };
  }

  // Check for no target schools
  if (!targetSchools?.length) {
    return {
      action: 'Explore CRNA programs',
      reason: "Find programs that match your goals and qualifications",
      link: '/schools',
    };
  }

  // Default - everything looks good
  return {
    action: 'Explore your personalized dashboard',
    reason: "You're on track! Let's keep the momentum going.",
    link: '/dashboard',
  };
}

export default function SummaryScreen({ data, onContinue, pointsEarned }) {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  // Turn off confetti after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Build summary items
  const summaryItems = useMemo(() => {
    const items = [];

    // ICU Experience
    if (data.icuYears || data.icuMonths || data.icuType) {
      items.push({
        icon: Stethoscope,
        label: 'ICU Experience',
        value: `${formatExperience(data.icuYears, data.icuMonths)}${data.icuType ? ` (${data.icuType.toUpperCase()})` : ''}`,
      });
    }

    // Shadow hours
    if (data.shadowHours !== undefined) {
      items.push({
        icon: Clock,
        label: 'Shadow Hours',
        value: `${data.shadowHours} hours`,
      });
    }

    // Certifications
    if (data.certifications?.length > 0) {
      items.push({
        icon: Award,
        label: 'Certifications',
        value: data.certifications.join(', '),
      });
    }

    // Schools
    if (data.interestedSchools?.length > 0 || data.targetSchools?.length > 0) {
      const count = (data.interestedSchools?.length || 0) + (data.targetSchools?.length || 0);
      items.push({
        icon: GraduationCap,
        label: 'Programs Saved',
        value: `${count} program${count !== 1 ? 's' : ''}`,
      });
    }

    return items;
  }, [data]);

  // Get first priority
  const firstPriority = useMemo(() => getFirstPriority(data), [data]);

  return (
    <div className="flex flex-col h-full relative">
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          colors={['#F7E547', '#FFD700', '#FFA500', '#10B981', '#3B82F6']}
        />
      )}

      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {/* Celebration header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
            <Sparkles className="h-8 w-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Dashboard is Ready!
          </h2>
          <p className="text-gray-600">
            {getTimelineLabel(data.timeline)} activated
          </p>
        </div>

        {/* What we know card */}
        {summaryItems.length > 0 && (
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Here's what we know about you
            </h3>
            <div className="space-y-3">
              {summaryItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="p-1.5 rounded-full bg-white">
                      <Icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-gray-500">{item.label}:</span>{' '}
                      <span className="text-sm font-medium text-gray-900">{item.value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* First priority card */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-yellow-200 flex-shrink-0">
              <Target className="h-5 w-5 text-yellow-700" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">
                Your First Priority
              </h3>
              <p className="text-sm font-medium text-yellow-800 mb-1">
                {firstPriority.action}
              </p>
              <p className="text-sm text-yellow-700">
                {firstPriority.reason}
              </p>
            </div>
          </div>
        </div>

        {/* Points earned */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-semibold">+{pointsEarned} points earned!</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            You're now Level 2: Dedicated Dreamer
          </p>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 p-4 bg-white border-t border-gray-100">
        <Button
          onClick={onContinue}
          className="w-full h-12 text-base font-semibold"
        >
          Go to Dashboard
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
