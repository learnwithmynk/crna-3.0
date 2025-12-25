/**
 * My Trackers Page
 *
 * Tab-based interface for tracking clinical experience, EQ reflections,
 * shadow days, and events. Each tab has its own entry log and form.
 *
 * Routes: /trackers, /trackers/:tab
 */

import { useParams, useNavigate } from 'react-router-dom';
import { Stethoscope, Brain, Calendar, GraduationCap } from 'lucide-react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { EventsTracker } from '@/components/features/trackers/EventsTracker';
import { EQTracker } from '@/components/features/trackers/EQTracker';
import { ShadowDaysTracker } from '@/components/features/trackers/ShadowDaysTracker';
import { ClinicalTracker } from '@/components/features/trackers/clinical/ClinicalTracker';
import { cn } from '@/lib/utils';

// Tab configuration - accent colors for subtle bottom-right gradient wash
// Updated to match sunset-inspired tracker themes
const TABS = [
  {
    value: 'clinical',
    label: 'Clinical',
    icon: Stethoscope,
    // Peach Sunrise - pink to yellow gradient
    accentColor: 'rgba(255, 176, 181, 0.20)', // peach-pink at 20% opacity
    activeGradient: 'from-[#FFB0B5] via-[#FFCAB5] to-[#FFE0A0]',
    iconColor: 'text-[#8B4030]',
    activeIconColor: 'text-white',
    shadowColor: 'shadow-[#FFB0B5]/30',
    bgTextColor: 'rgba(255, 176, 181, 0.05)',
  },
  {
    value: 'eq',
    label: 'EQ',
    icon: Brain,
    // Sunshine - golden yellow gradient
    accentColor: 'rgba(255, 224, 85, 0.18)', // golden yellow at 18% opacity
    activeGradient: 'from-[#FFE055] via-[#FFE878] to-[#FFFBE0]',
    iconColor: 'text-[#7A5500]',
    activeIconColor: 'text-[#7A5500]',
    shadowColor: 'shadow-[#FFE055]/30',
    bgTextColor: 'rgba(255, 224, 85, 0.05)',
  },
  {
    value: 'shadow',
    label: 'Shadow',
    icon: Calendar,
    // Orange accent - keep stark orange (unchanged)
    accentColor: 'rgba(249, 115, 22, 0.12)', // orange-500 at 12% opacity
    activeGradient: 'from-orange-400 to-orange-500',
    iconColor: 'text-orange-600',
    activeIconColor: 'text-white',
    shadowColor: 'shadow-orange-500/20',
    bgTextColor: 'rgba(249, 115, 22, 0.03)',
  },
  {
    value: 'events',
    label: 'Events',
    icon: GraduationCap,
    // Sunset Glow - yellow-gold to coral-pink gradient
    accentColor: 'rgba(232, 117, 138, 0.15)', // coral-pink at 15% opacity
    activeGradient: 'from-[#F5D76E] via-[#F5A970] to-[#E8758A]',
    iconColor: 'text-[#8B4535]',
    activeIconColor: 'text-white',
    shadowColor: 'shadow-[#E8758A]/25',
    bgTextColor: 'rgba(232, 117, 138, 0.04)',
  },
];

// Segmented control tab button - stacked icon + label
function TrackerTab({ tab, isActive, onClick }) {
  const Icon = tab.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative z-10 flex flex-col items-center justify-center gap-1.5 py-4 px-3 sm:px-6 rounded-3xl font-medium transition-all duration-300',
        'min-h-[72px] flex-1',
        isActive
          ? `bg-gradient-to-br ${tab.activeGradient} text-white shadow-lg ${tab.shadowColor}`
          : 'text-gray-500 hover:text-gray-700 hover:bg-white/40'
      )}
    >
      <Icon className={cn(
        'w-6 h-6 transition-transform duration-300',
        isActive ? 'text-white scale-110' : tab.iconColor
      )} />
      <span className={cn(
        'text-xs sm:text-sm transition-all duration-300',
        isActive ? 'font-semibold' : 'font-medium'
      )}>
        {tab.label}
      </span>
    </button>
  );
}

export function MyTrackersPage() {
  const { tab } = useParams();
  const navigate = useNavigate();

  // Default to 'clinical' tab
  const activeTab = tab || 'clinical';
  const activeTabConfig = TABS.find(t => t.value === activeTab) || TABS[0];

  const handleTabChange = (value) => {
    navigate(`/trackers/${value}`, { replace: true });
  };

  // Create a subtle radial gradient with the active tab's accent color
  const backgroundStyle = {
    background: `
      radial-gradient(
        ellipse 140% 120% at 85% 40%,
        ${activeTabConfig.accentColor} 0%,
        transparent 55%
      ),
      linear-gradient(
        to bottom right,
        #FFFFFF 0%,
        #FAFAFA 50%,
        #F8FAFC 100%
      )
    `,
  };

  return (
    <div
      className="min-h-screen transition-all duration-500 relative overflow-hidden"
      style={backgroundStyle}
    >
      {/* Outer padding for dramatic white space border */}
      <div className="p-4 md:p-8 lg:p-12 xl:p-16 relative z-10">
        <PageWrapper className="bg-transparent max-w-7xl mx-auto">
          {/* Segmented Control Tabs */}
          <div className="flex justify-center mb-10 pt-2">
            <div className="inline-flex w-full max-w-xl bg-white/50 backdrop-blur-md rounded-4xl p-1.5 border border-white/30 shadow-sm">
              {TABS.map((tabConfig) => (
                <TrackerTab
                  key={tabConfig.value}
                  tab={tabConfig}
                  isActive={activeTab === tabConfig.value}
                  onClick={() => handleTabChange(tabConfig.value)}
                />
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'clinical' && <ClinicalTracker />}
            {activeTab === 'eq' && <EQTracker />}
            {activeTab === 'shadow' && <ShadowDaysTracker />}
            {activeTab === 'events' && <EventsTracker />}
          </div>
        </PageWrapper>
      </div>
    </div>
  );
}
