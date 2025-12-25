/**
 * AccentColorDemo - Demo page showing different accent color options
 *
 * Shows the same UI elements with different accent colors to help
 * decide on the best color palette for the app.
 */

import React from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Button } from '@/components/ui/button';
import { CheckSquare, Sparkles, Lightbulb, Plus, ChevronRight } from 'lucide-react';

// Color options to demo
const COLOR_OPTIONS = [
  {
    name: 'Teal',
    primary: 'teal-500',
    light: 'teal-100',
    dark: 'teal-600',
    hover: 'teal-600',
    text: 'teal-700',
    bgClass: 'bg-teal-500',
    hoverClass: 'hover:bg-teal-600',
    lightBgClass: 'bg-teal-100',
    textClass: 'text-teal-600',
    borderClass: 'border-teal-200',
    glowFrom: 'from-teal-200/30',
    glowVia: 'via-cyan-200/25',
    glowTo: 'to-teal-300/30',
  },
  {
    name: 'Emerald',
    primary: 'emerald-500',
    light: 'emerald-100',
    dark: 'emerald-600',
    hover: 'emerald-600',
    text: 'emerald-700',
    bgClass: 'bg-emerald-500',
    hoverClass: 'hover:bg-emerald-600',
    lightBgClass: 'bg-emerald-100',
    textClass: 'text-emerald-600',
    borderClass: 'border-emerald-200',
    glowFrom: 'from-emerald-200/30',
    glowVia: 'via-green-200/25',
    glowTo: 'to-emerald-300/30',
  },
  {
    name: 'Indigo',
    primary: 'indigo-500',
    light: 'indigo-100',
    dark: 'indigo-600',
    hover: 'indigo-600',
    text: 'indigo-700',
    bgClass: 'bg-indigo-500',
    hoverClass: 'hover:bg-indigo-600',
    lightBgClass: 'bg-indigo-100',
    textClass: 'text-indigo-600',
    borderClass: 'border-indigo-200',
    glowFrom: 'from-indigo-200/30',
    glowVia: 'via-blue-200/25',
    glowTo: 'to-indigo-300/30',
  },
  {
    name: 'Violet',
    primary: 'violet-500',
    light: 'violet-100',
    dark: 'violet-600',
    hover: 'violet-600',
    text: 'violet-700',
    bgClass: 'bg-violet-500',
    hoverClass: 'hover:bg-violet-600',
    lightBgClass: 'bg-violet-100',
    textClass: 'text-violet-600',
    borderClass: 'border-violet-200',
    glowFrom: 'from-violet-200/30',
    glowVia: 'via-purple-200/25',
    glowTo: 'to-violet-300/30',
  },
  {
    name: 'Slate',
    primary: 'slate-600',
    light: 'slate-100',
    dark: 'slate-700',
    hover: 'slate-700',
    text: 'slate-700',
    bgClass: 'bg-slate-600',
    hoverClass: 'hover:bg-slate-700',
    lightBgClass: 'bg-slate-100',
    textClass: 'text-slate-600',
    borderClass: 'border-slate-200',
    glowFrom: 'from-slate-200/30',
    glowVia: 'via-gray-200/25',
    glowTo: 'to-slate-300/30',
  },
  {
    name: 'Cyan',
    primary: 'cyan-500',
    light: 'cyan-100',
    dark: 'cyan-600',
    hover: 'cyan-600',
    text: 'cyan-700',
    bgClass: 'bg-cyan-500',
    hoverClass: 'hover:bg-cyan-600',
    lightBgClass: 'bg-cyan-100',
    textClass: 'text-cyan-600',
    borderClass: 'border-cyan-200',
    glowFrom: 'from-cyan-200/30',
    glowVia: 'via-sky-200/25',
    glowTo: 'to-cyan-300/30',
  },
];

// Sample onboarding steps
const ONBOARDING_STEPS = [
  { title: 'Complete your profile', description: 'Add your GPA and experience', points: 20 },
  { title: 'Save your first program', description: 'Browse schools and save ones that interest you', points: 5 },
  { title: 'Log your first clinical entry', description: 'Start tracking your ICU experience', points: 2 },
];

export default function AccentColorDemo() {
  return (
    <PageWrapper title="Accent Color Options">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Accent Color Demo</h1>
        <p className="text-gray-500">
          Compare different accent colors against the warm background gradient.
          Each card shows the same UI elements with a different accent color.
        </p>
      </div>

      {/* Demo with warm background gradient */}
      <div className="min-h-screen -mx-6 -mt-6 px-6 pt-6 bg-gradient-to-br from-white via-orange-50/60 to-amber-100/50">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {COLOR_OPTIONS.map((color) => (
            <div key={color.name} className="space-y-4">
              {/* Color name badge */}
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${color.bgClass}`} />
                <span className="font-bold text-gray-900">{color.name}</span>
                <span className="text-xs text-gray-400">({color.primary})</span>
              </div>

              {/* To-Do Widget Preview */}
              <div className="bg-white rounded-3xl border border-gray-50 overflow-hidden shadow-sm">
                <div className="px-5 pt-5 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-2xl ${color.lightBgClass}`}>
                        <CheckSquare className={`w-5 h-5 ${color.textClass}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">My To-Do List</h3>
                        <p className="text-xs text-gray-400 uppercase">Focus for Dec 2025</p>
                      </div>
                    </div>
                    <Button className={`${color.bgClass} ${color.hoverClass} text-white rounded-full px-4 text-sm`}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Task
                    </Button>
                  </div>
                </div>
                <div className="px-5 pb-5">
                  <div className="text-center py-6 text-gray-400 text-sm">
                    All caught up!
                  </div>
                </div>
              </div>

              {/* Get Started Widget Preview */}
              <div className="relative rounded-3xl overflow-visible">
                {/* Glow effect */}
                <div className={`absolute -inset-1 bg-gradient-to-br ${color.glowFrom} ${color.glowVia} ${color.glowTo} rounded-4xl blur-lg -z-10`} />

                <div className={`relative bg-white rounded-3xl shadow-lg border ${color.borderClass}/40 overflow-hidden`}>
                  <div className="px-5 pt-5 pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-2xl ${color.bgClass}`}>
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Get Started</h3>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {ONBOARDING_STEPS.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3 px-5 py-3">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900">{step.title}</p>
                          <p className="text-xs text-gray-400">{step.description}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color.lightBgClass} ${color.textClass}`}>
                          +{step.points} pts
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Button variants */}
              <div className="bg-white rounded-2xl p-4 space-y-3">
                <p className="text-xs font-medium text-gray-400 uppercase">Button Variants</p>
                <div className="flex flex-wrap gap-2">
                  <Button className={`${color.bgClass} ${color.hoverClass} text-white rounded-full px-4 text-sm`}>
                    Primary
                  </Button>
                  <Button variant="outline" className={`rounded-full px-4 text-sm border-2 ${color.borderClass} ${color.textClass}`}>
                    Outline
                  </Button>
                  <Button variant="ghost" className={`rounded-full px-4 text-sm ${color.textClass} hover:${color.lightBgClass}`}>
                    <Lightbulb className="w-4 h-4 mr-1" />
                    Ghost
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Black option for comparison */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Current: Black (gray-900)</h2>
          <div className="max-w-md">
            <div className="bg-white rounded-3xl border border-gray-50 overflow-hidden shadow-sm">
              <div className="px-5 pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-orange-100">
                      <CheckSquare className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">My To-Do List</h3>
                      <p className="text-xs text-gray-400 uppercase">Focus for Dec 2025</p>
                    </div>
                  </div>
                  <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-4 text-sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Task
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
