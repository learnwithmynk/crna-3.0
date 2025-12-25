/**
 * Demo page to showcase tracker celebration cards at different progress levels
 * Access at: /demo/tracker-cards
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Plus, Star, TrendingUp, Sparkles, Users, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Clinical Tracker - Shifts Logged Card
 */
function ClinicalShiftsCard({ totalShifts }) {
  const totalPoints = totalShifts * 2;

  // Dynamic teal/cyan gradients (darker for white text) - Badge: "Critical Care Crusher" at 20 shifts
  const getCelebrationLevel = () => {
    if (totalShifts >= 20) return { emoji: '🏆', message: 'Critical Care Crusher!', color: 'from-[#0D9488] via-[#14B8A6] to-[#2DD4BF]' };
    if (totalShifts >= 10) return { emoji: '🔥', message: 'On fire!', color: 'from-[#0D9488] via-[#14B8A6] to-[#2DD4BF]' };
    if (totalShifts >= 5) return { emoji: '⭐', message: 'Great progress!', color: 'from-[#14B8A6] via-[#2DD4BF] to-[#5EEAD4]' };
    return { emoji: '💪', message: 'Keep it up!', color: 'from-[#14B8A6] via-[#2DD4BF] to-[#5EEAD4]' };
  };

  const celebration = getCelebrationLevel();

  return (
    <Card className={cn(
      'p-5 rounded-3xl shadow-lg border-0 text-white overflow-hidden relative',
      `bg-gradient-to-br ${celebration.color}`
    )}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="font-semibold">Shifts Logged</span>
          </div>
          <span className="text-3xl">{celebration.emoji}</span>
        </div>

        <div className="mb-4">
          <div className="text-5xl font-bold mb-1">{totalShifts}</div>
          <div className="text-white/80 text-sm">{celebration.message}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-3 py-1.5">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">{totalPoints} pts earned</span>
          </div>
          <Button
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Log +2 pts
          </Button>
        </div>

        {totalShifts < 20 && (
          <div className="mt-4 pt-3 border-t border-white/20">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <TrendingUp className="w-4 h-4" />
              <span>{20 - totalShifts} more to unlock "Critical Care Crusher" badge!</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * Shadow Days Tracker - Hours Logged Card
 */
function ShadowHoursCard({ totalHours, goal = 24 }) {
  const totalPoints = totalHours * 2;
  const progress = Math.min((totalHours / goal) * 100, 100);

  // Dynamic orange/coral/peach gradients
  const getCelebrationLevel = () => {
    if (totalHours >= goal) return { emoji: '🏆', message: 'Goal achieved!', color: 'from-[#FB923C] via-[#FDBA74] to-[#FCD34D]' };
    if (progress >= 75) return { emoji: '🔥', message: 'Almost there!', color: 'from-[#FB923C] via-[#FDBA74] to-[#FCD34D]' };
    if (progress >= 50) return { emoji: '☀️', message: 'Great progress!', color: 'from-[#FDBA74] via-[#FCD34D] to-[#FDE68A]' };
    return { emoji: '🌅', message: 'Keep it up!', color: 'from-[#FDBA74] via-[#FDE68A] to-[#FEF3C7]' };
  };

  const celebration = getCelebrationLevel();

  return (
    <Card className={cn(
      'p-5 rounded-3xl shadow-lg border-0 overflow-hidden relative',
      `bg-gradient-to-br ${celebration.color}`
    )}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Trophy className="w-5 h-5 text-orange-800" />
            </div>
            <span className="font-semibold text-orange-900">Hours Logged</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-white/20 hover:bg-white/30 text-orange-800"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-5xl font-bold text-orange-900">{totalHours}</span>
            <span className="text-3xl">{celebration.emoji}</span>
          </div>
          <div className="text-orange-800/80 text-sm">
            of {goal}h goal • {celebration.message}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="w-full bg-white/30 rounded-full h-2">
            <div
              className="bg-orange-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-3 py-1.5">
            <Star className="w-4 h-4 text-orange-800 fill-current" />
            <span className="text-sm font-medium text-orange-900">{totalPoints} pts earned</span>
          </div>
          <Button
            size="sm"
            className="bg-white/30 hover:bg-white/40 text-orange-900 border-0 backdrop-blur-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Log +2 pts
          </Button>
        </div>

        {totalHours < goal && (
          <div className="mt-4 pt-3 border-t border-orange-900/20">
            <div className="flex items-center gap-2 text-sm text-orange-800">
              <TrendingUp className="w-4 h-4" />
              <span>{goal - totalHours} more hours to reach your goal!</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * Events Tracker - Events Logged Card
 */
function EventsLoggedCard({ totalEvents, totalContacts = 0 }) {
  const totalPoints = totalEvents * 2;

  // Dynamic blue/indigo/violet gradients (more dramatic color range)
  const getCelebrationLevel = () => {
    if (totalEvents >= 10) return { emoji: '🏆', message: 'Event Master!', color: 'from-[#6366F1] via-[#818CF8] to-[#60A5FA]' };
    if (totalEvents >= 7) return { emoji: '🔥', message: 'On fire!', color: 'from-[#6366F1] via-[#818CF8] to-[#60A5FA]' };
    if (totalEvents >= 4) return { emoji: '🎯', message: 'Great progress!', color: 'from-[#818CF8] via-[#93C5FD] to-[#A5B4FC]' };
    return { emoji: '🎟️', message: 'Keep it up!', color: 'from-[#818CF8] via-[#A5B4FC] to-[#C7D2FE]' };
  };

  const celebration = getCelebrationLevel();

  return (
    <Card className={cn(
      'p-5 rounded-3xl shadow-lg border-0 overflow-hidden relative',
      `bg-gradient-to-br ${celebration.color}`
    )}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Trophy className="w-5 h-5 text-blue-900" />
            </div>
            <span className="font-semibold text-blue-900">Events Logged</span>
          </div>
          <span className="text-3xl">{celebration.emoji}</span>
        </div>

        <div className="mb-4">
          <div className="text-5xl font-bold text-blue-900 mb-1">{totalEvents}</div>
          <div className="text-blue-800/80 text-sm">{celebration.message}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-3 py-1.5">
            <Sparkles className="w-4 h-4 text-blue-900" />
            <span className="text-sm font-medium text-blue-900">{totalPoints} pts earned</span>
          </div>
          <Button
            size="sm"
            className="bg-white/30 hover:bg-white/40 text-blue-900 border-0 backdrop-blur-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Log +2 pts
          </Button>
        </div>

        {totalContacts > 0 && (
          <div className="mt-4 pt-3 border-t border-blue-900/20">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <Users className="w-4 h-4" />
              <span>{totalContacts} contacts made</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * Demo Page
 */
export function TrackerCardsDemo() {
  const [clinicalShifts, setClinicalShifts] = useState(8);
  const [shadowHours, setShadowHours] = useState(12);
  const [eventsLogged, setEventsLogged] = useState(6);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tracker Celebration Cards Demo</h1>
        <p className="text-gray-600 mb-8">
          See how the cards change emoji and color as users progress. Use the sliders to adjust values.
        </p>

        {/* Controls */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Adjust Progress Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clinical Shifts: {clinicalShifts}
              </label>
              <input
                type="range"
                min="0"
                max="25"
                value={clinicalShifts}
                onChange={(e) => setClinicalShifts(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>5 (⭐)</span>
                <span>10 (🔥)</span>
                <span>20 (🏆)</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shadow Hours: {shadowHours} (goal: 24h)
              </label>
              <input
                type="range"
                min="0"
                max="30"
                value={shadowHours}
                onChange={(e) => setShadowHours(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>12 (☀️)</span>
                <span>18 (🔥)</span>
                <span>24+ (🏆)</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Events Logged: {eventsLogged}
              </label>
              <input
                type="range"
                min="0"
                max="15"
                value={eventsLogged}
                onChange={(e) => setEventsLogged(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0 (🎟️)</span>
                <span>4 (🎯)</span>
                <span>7 (🔥)</span>
                <span>10+ (🏆)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current State Cards */}
        <h2 className="font-semibold text-gray-900 mb-4">Current State (adjust with sliders above)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Clinical Tracker</h3>
            <ClinicalShiftsCard totalShifts={clinicalShifts} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Shadow Days Tracker</h3>
            <ShadowHoursCard totalHours={shadowHours} goal={24} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Events Tracker</h3>
            <EventsLoggedCard totalEvents={eventsLogged} totalContacts={3} />
          </div>
        </div>

        {/* All Progression States */}
        <h2 className="font-semibold text-gray-900 mb-4">All Progression States</h2>

        {/* Clinical Tracker Progression */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-teal-700 mb-3">Clinical Tracker Progression</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-2">Level 1: 0-4 shifts (💪)</p>
              <ClinicalShiftsCard totalShifts={2} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Level 2: 5-9 shifts (⭐)</p>
              <ClinicalShiftsCard totalShifts={7} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Level 3: 10-19 shifts (🔥)</p>
              <ClinicalShiftsCard totalShifts={15} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Level 4: 20+ shifts (🏆)</p>
              <ClinicalShiftsCard totalShifts={25} />
            </div>
          </div>
        </div>

        {/* Shadow Days Tracker Progression */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-orange-700 mb-3">Shadow Days Tracker Progression</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-2">Level 1: 0-49% (🌅)</p>
              <ShadowHoursCard totalHours={8} goal={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Level 2: 50-74% (☀️)</p>
              <ShadowHoursCard totalHours={14} goal={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Level 3: 75-99% (🔥)</p>
              <ShadowHoursCard totalHours={20} goal={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Level 4: 100%+ (🏆)</p>
              <ShadowHoursCard totalHours={28} goal={24} />
            </div>
          </div>
        </div>

        {/* Events Tracker Progression */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-blue-700 mb-3">Events Tracker Progression</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-2">Level 1: 0-3 events (🎟️)</p>
              <EventsLoggedCard totalEvents={2} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Level 2: 4-6 events (🎯)</p>
              <EventsLoggedCard totalEvents={5} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Level 3: 7-9 events (🔥)</p>
              <EventsLoggedCard totalEvents={8} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Level 4: 10+ events (🏆)</p>
              <EventsLoggedCard totalEvents={12} totalContacts={8} />
            </div>
          </div>
        </div>

        {/* Emoji Legend */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Emoji Legend</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-teal-700 mb-2">Clinical (Teal/Green)</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>💪 Keep it up! (0-4)</li>
                <li>⭐ Great progress! (5-9)</li>
                <li>🔥 On fire! (10-19)</li>
                <li>🏆 Critical Care Crusher! (20+)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-orange-700 mb-2">Shadow Days (Orange)</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>🌅 Keep it up! (0-49%)</li>
                <li>☀️ Great progress! (50-74%)</li>
                <li>🔥 Almost there! (75-99%)</li>
                <li>🏆 Goal achieved! (100%+)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-700 mb-2">Events (Blue)</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>🎟️ Keep it up! (0-3)</li>
                <li>🎯 Great progress! (4-6)</li>
                <li>🔥 On fire! (7-9)</li>
                <li>🏆 Event Master! (10+)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackerCardsDemo;
