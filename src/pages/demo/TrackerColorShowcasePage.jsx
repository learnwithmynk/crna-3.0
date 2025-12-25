/**
 * Tracker Color Showcase Page
 *
 * Shows 3 color variations for Clinical, EQ, and Events trackers
 * Each variation shows the two main gradient cards side by side
 */

import { useState } from 'react';
import {
  Heart,
  Brain,
  FileText,
  Trophy,
  Star,
  Plus,
  TrendingUp,
  Users,
  Pill,
  Activity,
  Stethoscope,
  Crown,
  Clock,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Color Theme Definitions
 * Each tracker has 3 variations (A, B, C)
 * Each variation has:
 * - primaryGradient: For the "logged" celebration card (darker/more saturated)
 * - secondaryGradient: For the summary/stats card (lighter)
 * - accentColor: For tab accent and icons
 * - textColor: Main text color on cards
 * - subtextColor: Secondary text color
 */
const COLOR_THEMES = {
  // CLINICAL - Pink to Yellow gradient (like the "Peach" reference - pink top, yellow bottom)
  clinical: {
    A: {
      name: 'Peach Sunrise',
      // Pink/coral top → Peach middle → Soft yellow bottom
      primaryGradient: 'from-[#FFB0B5] via-[#FFCAB5] to-[#FFE0A0]',
      secondaryGradient: 'from-[#FFF0EE] via-[#FFF6F0] to-[#FFFBE8]',
      accentColor: 'rgba(255, 176, 181, 0.20)',
      iconBg: 'from-[#FFE0DC] to-[#FFF0D0]',
      textColor: 'text-[#8B4030]',
      subtextColor: 'text-[#A05040]/80',
      buttonGradient: 'from-[#F09090] to-[#F8C080]',
      progressBar: 'bg-[#E08060]',
    },
    B: {
      name: 'Coral Dawn',
      // Soft coral → Peachy → Warm yellow
      primaryGradient: 'from-[#FFA8B0] via-[#FFC8B8] to-[#FFDC98]',
      secondaryGradient: 'from-[#FFEEEB] via-[#FFF5EE] to-[#FFFAE5]',
      accentColor: 'rgba(255, 168, 176, 0.20)',
      iconBg: 'from-[#FFDDD8] to-[#FFECC8]',
      textColor: 'text-[#8B3828]',
      subtextColor: 'text-[#A04838]/80',
      buttonGradient: 'from-[#ED8888] to-[#F5BC78]',
      progressBar: 'bg-[#DD7858]',
    },
    C: {
      name: 'Rose Morning',
      // Dusty pink → Soft peach → Buttery yellow
      primaryGradient: 'from-[#FFB5B8] via-[#FFCCBA] to-[#FFE298]',
      secondaryGradient: 'from-[#FFEFEC] via-[#FFF6F0] to-[#FFF9E6]',
      accentColor: 'rgba(255, 181, 184, 0.20)',
      iconBg: 'from-[#FFDFDA] to-[#FFEEC8]',
      textColor: 'text-[#8B3A2A]',
      subtextColor: 'text-[#A04A3A]/80',
      buttonGradient: 'from-[#EF8C8C] to-[#F7C080]',
      progressBar: 'bg-[#DF7A58]',
    },
  },
  // EQ - Bright Golden Yellow family (vibrant yellow to very light cream)
  eq: {
    A: {
      name: 'Sunshine',
      // Bright yellow → Golden → Very light cream for dramatic gradient
      primaryGradient: 'from-[#FFE055] via-[#FFE878] to-[#FFFBE0]',
      secondaryGradient: 'from-[#FFFBE5] via-[#FFFCEE] to-[#FFFDF8]',
      accentColor: 'rgba(255, 224, 85, 0.22)',
      iconBg: 'from-[#FFF2B8] to-[#FFF8D5]',
      textColor: 'text-[#7A5500]',
      subtextColor: 'text-[#8B6510]/80',
      buttonGradient: 'from-[#B8860B] to-[#A67808]',
      progressBar: 'bg-[#9A7008]',
    },
    B: {
      name: 'Honey',
      // Bright honey → Soft gold → Very light for dramatic gradient
      primaryGradient: 'from-[#FFDC50] via-[#FFE570] to-[#FFF8D8]',
      secondaryGradient: 'from-[#FFFAE2] via-[#FFFBEC] to-[#FFFDF8]',
      accentColor: 'rgba(255, 220, 80, 0.22)',
      iconBg: 'from-[#FFF0B0] to-[#FFF6D0]',
      textColor: 'text-[#785200]',
      subtextColor: 'text-[#886208]/80',
      buttonGradient: 'from-[#B58308] to-[#A37505]',
      progressBar: 'bg-[#976D05]',
    },
    C: {
      name: 'Buttercup',
      // Vibrant buttercup → Soft yellow → Very pale for dramatic gradient
      primaryGradient: 'from-[#FFD848] via-[#FFE268] to-[#FFF6D0]',
      secondaryGradient: 'from-[#FFF9E0] via-[#FFFAEA] to-[#FFFDF6]',
      accentColor: 'rgba(255, 216, 72, 0.22)',
      iconBg: 'from-[#FFEEA8] to-[#FFF5C8]',
      textColor: 'text-[#765000]',
      subtextColor: 'text-[#866005]/80',
      buttonGradient: 'from-[#B28005] to-[#A07202]',
      progressBar: 'bg-[#946A02]',
    },
  },
  // EVENTS - Sunset Gradient (yellow-gold top to coral-pink bottom)
  events: {
    A: {
      name: 'Sunset Glow',
      // Yellow-gold → Peach → Coral-pink - like the reference gradient
      primaryGradient: 'from-[#F5D76E] via-[#F5A970] to-[#E8758A]',
      secondaryGradient: 'from-[#FEF9E8] via-[#FEF4EC] to-[#FDF0F2]',
      accentColor: 'rgba(245, 169, 112, 0.18)',
      iconBg: 'from-[#FCEFD0] to-[#FBE5E0]',
      textColor: 'text-[#8B4535]',
      subtextColor: 'text-[#A05545]/80',
      buttonGradient: 'from-[#E89060] to-[#E07080]',
      progressBar: 'bg-[#D86070]',
    },
    B: {
      name: 'Tropical Sunset',
      // Golden → Coral → Rose-pink
      primaryGradient: 'from-[#F8D86A] via-[#F0A068] to-[#E56B88]',
      secondaryGradient: 'from-[#FFFAE6] via-[#FEF2EA] to-[#FCECEF]',
      accentColor: 'rgba(240, 160, 104, 0.18)',
      iconBg: 'from-[#FBECC8] to-[#FAE2DC]',
      textColor: 'text-[#8A4230]',
      subtextColor: 'text-[#9E5240]/80',
      buttonGradient: 'from-[#E58858] to-[#DC6878]',
      progressBar: 'bg-[#D55868]',
    },
    C: {
      name: 'Golden Hour',
      // Soft gold → Peachy coral → Dusty rose
      primaryGradient: 'from-[#F2D570] via-[#F2A872] to-[#E47890]',
      secondaryGradient: 'from-[#FDF8E5] via-[#FDF2E8] to-[#FBEEEF]',
      accentColor: 'rgba(242, 168, 114, 0.18)',
      iconBg: 'from-[#FAEDD2] to-[#F9E3DE]',
      textColor: 'text-[#894838]',
      subtextColor: 'text-[#9C5848]/80',
      buttonGradient: 'from-[#E28C5C] to-[#DA6C82]',
      progressBar: 'bg-[#D5606C]',
    },
  },
};

/**
 * Clinical Tracker Cards
 */
function ClinicalShiftsLoggedCard({ theme }) {
  return (
    <Card className={cn(
      'p-5 rounded-3xl shadow-lg border-0 overflow-hidden relative',
      `bg-gradient-to-br ${theme.primaryGradient}`
    )}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center">
              <Trophy className={cn('w-5 h-5', theme.textColor)} />
            </div>
            <span className={cn('font-semibold', theme.textColor)}>Shifts Logged</span>
          </div>
          <span className="text-3xl">🔥</span>
        </div>

        <div className="mb-4">
          <div className={cn('text-5xl font-bold mb-1', theme.textColor)}>12</div>
          <div className={cn('text-sm', theme.subtextColor)}>On fire!</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-3 py-1.5">
            <Star className={cn('w-4 h-4 fill-current', theme.textColor)} />
            <span className={cn('text-sm font-medium', theme.textColor)}>24 pts earned</span>
          </div>
          <Button
            size="sm"
            className="bg-white/30 hover:bg-white/40 border-0 backdrop-blur-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Log +5 pts
          </Button>
        </div>

        <div className="mt-4 pt-3 border-t border-white/20">
          <div className={cn('flex items-center gap-2 text-sm', theme.subtextColor)}>
            <TrendingUp className="w-4 h-4" />
            <span>8 more to unlock "Critical Care Crusher" badge!</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ClinicalTopStatsCard({ theme }) {
  const statItems = [
    { icon: Users, label: 'Top Population', value: 'Cardiac Surgery' },
    { icon: Pill, label: 'Top Medication', value: 'Levophed' },
    { icon: Activity, label: 'Top Device', value: 'Impella' },
    { icon: Stethoscope, label: 'Top Procedure', value: 'A-Line Insert' },
  ];

  return (
    <Card className={cn(
      'p-4 rounded-3xl border-0',
      `bg-gradient-to-br ${theme.secondaryGradient}`
    )}>
      <h4 className={cn('font-semibold mb-3 flex items-center gap-2', theme.textColor)}>
        <TrendingUp className="w-4 h-4" />
        Your Top Experience
      </h4>
      <div className="space-y-3">
        {statItems.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <div className={cn('w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center', theme.iconBg)}>
              <Icon className={cn('w-4 h-4', theme.textColor)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn('text-xs', theme.subtextColor)}>{label}</p>
              <p className={cn('text-sm font-medium truncate', theme.textColor)}>{value}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/**
 * EQ Tracker Cards
 */
function EQReflectionsLoggedCard({ theme }) {
  return (
    <Card className={cn(
      'p-5 rounded-3xl shadow-lg border-0 overflow-hidden relative',
      `bg-gradient-to-br ${theme.primaryGradient}`
    )}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center">
              <Trophy className={cn('w-5 h-5', theme.textColor)} />
            </div>
            <span className={cn('font-semibold', theme.textColor)}>Reflections Logged</span>
          </div>
          <span className="text-3xl">⭐</span>
        </div>

        <div className="mb-4">
          <div className={cn('text-5xl font-bold mb-1', theme.textColor)}>8</div>
          <div className={cn('text-sm', theme.subtextColor)}>Great progress!</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-3 py-1.5">
            <Star className={cn('w-4 h-4 fill-current', theme.textColor)} />
            <span className={cn('text-sm font-medium', theme.textColor)}>16 pts earned</span>
          </div>
          <Button
            size="sm"
            className={cn('bg-white/40 hover:bg-white/50 border-0 backdrop-blur-sm', theme.textColor)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Log +5 pts
          </Button>
        </div>

        <div className="mt-4 pt-3 border-t border-white/20">
          <div className={cn('flex items-center gap-2 text-sm', theme.subtextColor)}>
            <TrendingUp className="w-4 h-4" />
            <span>7 more to unlock "EQ Master" badge!</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function EQTopSkillCard({ theme }) {
  return (
    <Card className={cn(
      'p-5 rounded-3xl shadow-lg border-0 overflow-hidden relative',
      `bg-gradient-to-br ${theme.secondaryGradient}`
    )}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={cn('w-10 h-10 rounded-2xl bg-gradient-to-br flex items-center justify-center', theme.iconBg)}>
              <Crown className={cn('w-5 h-5', theme.textColor)} />
            </div>
            <span className={cn('font-semibold', theme.textColor)}>Top EQ Skill</span>
          </div>
        </div>

        <div className="mb-2">
          <div className={cn('text-2xl font-bold mb-1', theme.textColor)}>
            Conflict Resolution
          </div>
          <div className={cn('text-sm', theme.subtextColor)}>
            4 reflections logged
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-black/5">
          <div className={cn('text-xs', theme.subtextColor)}>
            Covering 5 of 8 categories
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * Events Tracker Cards
 */
function EventsLoggedCard({ theme }) {
  return (
    <Card className={cn(
      'p-5 rounded-3xl shadow-lg border-0 overflow-hidden relative',
      `bg-gradient-to-br ${theme.primaryGradient}`
    )}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center">
              <Trophy className={cn('w-5 h-5', theme.textColor)} />
            </div>
            <span className={cn('font-semibold', theme.textColor)}>Events Logged</span>
          </div>
          <span className="text-3xl">🎯</span>
        </div>

        <div className="mb-4">
          <div className={cn('text-5xl font-bold mb-1', theme.textColor)}>5</div>
          <div className={cn('text-sm', theme.subtextColor)}>Great progress!</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-3 py-1.5">
            <Star className={cn('w-4 h-4 fill-current', theme.textColor)} />
            <span className={cn('text-sm font-medium', theme.textColor)}>10 pts earned</span>
          </div>
          <Button
            size="sm"
            className="bg-white/30 hover:bg-white/40 border-0 backdrop-blur-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Log +5 pts
          </Button>
        </div>

        <div className="mt-4 pt-3 border-t border-white/20">
          <div className={cn('flex items-center gap-2 text-sm', theme.subtextColor)}>
            <Users className="w-4 h-4" />
            <span>8 contacts made</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function EventsReadyToLogCard({ theme }) {
  const mockEvents = [
    { id: 1, title: 'Duke Open House', date: 'Dec 15, 2024' },
    { id: 2, title: 'AANA State Meeting', date: 'Dec 12, 2024' },
    { id: 3, title: 'UNC Info Session', date: 'Dec 10, 2024' },
  ];

  return (
    <Card className={cn(
      'p-4 rounded-3xl border-0 overflow-hidden relative',
      `bg-gradient-to-br ${theme.secondaryGradient}`
    )}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-white/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-sm" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-sm" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className={cn('w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-sm', theme.iconBg)}>
            <Clock className={cn('w-4 h-4', theme.textColor)} />
          </div>
          <h4 className={cn('font-semibold', theme.textColor)}>Ready to Log</h4>
          <Badge className="bg-white/50 border-0 shadow-sm text-xs">
            3
          </Badge>
        </div>

        <p className={cn('text-xs mb-3', theme.subtextColor)}>
          These events have passed and are waiting to be logged.
        </p>

        <div className="space-y-2">
          {mockEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-2 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm">
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-medium truncate', theme.textColor)}>{event.title}</p>
                <p className={cn('text-xs', theme.subtextColor)}>{event.date}</p>
              </div>
              <Button
                size="sm"
                className={cn('h-7 px-2 text-white shadow-sm', `bg-gradient-to-r ${theme.buttonGradient}`)}
              >
                Log
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/**
 * Section Header with Tracker Icon
 */
function TrackerSectionHeader({ tracker, theme, variation }) {
  const icons = {
    clinical: Heart,
    eq: Brain,
    events: FileText,
  };
  const labels = {
    clinical: 'Clinical Tracker',
    eq: 'EQ Tracker',
    events: 'Events Tracker',
  };
  const Icon = icons[tracker];

  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center', theme.iconBg)}>
        <Icon className={cn('w-6 h-6', theme.textColor)} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900">{labels[tracker]}</h3>
        <p className="text-sm text-gray-500">
          Variation {variation}: <span className="font-medium">{theme.name}</span>
        </p>
      </div>
    </div>
  );
}

/**
 * Main Showcase Page
 */
export function TrackerColorShowcasePage() {
  const [selectedVariation, setSelectedVariation] = useState('all');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/80 to-pink-50/25 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tracker Color Theme Showcase
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Three sunset-inspired color variations for Clinical, EQ, and Events trackers.
            Each variation shows the two main gradient cards (celebration + summary).
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {['all', 'A', 'B', 'C'].map((v) => (
            <Button
              key={v}
              variant={selectedVariation === v ? 'default' : 'outline'}
              onClick={() => setSelectedVariation(v)}
              className={selectedVariation === v ? 'bg-gray-900 text-white' : ''}
            >
              {v === 'all' ? 'Show All' : `Variation ${v}`}
            </Button>
          ))}
        </div>

        {/* Color Showcase Grid */}
        <div className="space-y-16">
          {/* CLINICAL TRACKER */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Heart className="w-6 h-6 text-[#E07060]" />
              Clinical Tracker Options
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['A', 'B', 'C'].filter(v => selectedVariation === 'all' || selectedVariation === v).map((v) => (
                <div key={v} className="space-y-4">
                  <TrackerSectionHeader tracker="clinical" theme={COLOR_THEMES.clinical[v]} variation={v} />
                  <ClinicalShiftsLoggedCard theme={COLOR_THEMES.clinical[v]} />
                  <ClinicalTopStatsCard theme={COLOR_THEMES.clinical[v]} />
                </div>
              ))}
            </div>
          </section>

          {/* EQ TRACKER */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Brain className="w-6 h-6 text-[#E07060]" />
              EQ Tracker Options
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['A', 'B', 'C'].filter(v => selectedVariation === 'all' || selectedVariation === v).map((v) => (
                <div key={v} className="space-y-4">
                  <TrackerSectionHeader tracker="eq" theme={COLOR_THEMES.eq[v]} variation={v} />
                  <EQReflectionsLoggedCard theme={COLOR_THEMES.eq[v]} />
                  <EQTopSkillCard theme={COLOR_THEMES.eq[v]} />
                </div>
              ))}
            </div>
          </section>

          {/* EVENTS TRACKER */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#E07060]" />
              Events Tracker Options
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['A', 'B', 'C'].filter(v => selectedVariation === 'all' || selectedVariation === v).map((v) => (
                <div key={v} className="space-y-4">
                  <TrackerSectionHeader tracker="events" theme={COLOR_THEMES.events[v]} variation={v} />
                  <EventsLoggedCard theme={COLOR_THEMES.events[v]} />
                  <EventsReadyToLogCard theme={COLOR_THEMES.events[v]} />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Color Reference */}
        <div className="mt-16 p-6 bg-white rounded-3xl shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Color Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Clinical Options (Coral/Salmon)</h4>
              <ul className="space-y-1 text-gray-600">
                <li><span className="font-medium">A - Coral Rose:</span> Coral red to soft peach</li>
                <li><span className="font-medium">B - Watermelon:</span> Watermelon pink to peachy</li>
                <li><span className="font-medium">C - Flamingo:</span> Hot pink to light coral</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">EQ Options (Bright Yellow)</h4>
              <ul className="space-y-1 text-gray-600">
                <li><span className="font-medium">A - Sunshine:</span> Bright yellow to soft gold</li>
                <li><span className="font-medium">B - Honey:</span> Vibrant honey to light yellow</li>
                <li><span className="font-medium">C - Buttercup:</span> Vivid buttercup to pale gold</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Events Options (Sunset Gradient)</h4>
              <ul className="space-y-1 text-gray-600">
                <li><span className="font-medium">A - Sunset Glow:</span> Gold to coral-pink</li>
                <li><span className="font-medium">B - Tropical Sunset:</span> Golden to rose-pink</li>
                <li><span className="font-medium">C - Golden Hour:</span> Soft gold to dusty rose</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackerColorShowcasePage;
