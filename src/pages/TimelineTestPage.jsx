/**
 * Timeline Generator Test Page
 *
 * Proof of concept: Replicating the exact UI from the Timeline Generator screenshot
 * to demonstrate design system flexibility.
 */

import React from 'react';
import { Calendar, GraduationCap, List, HelpCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TimelineTestPage() {
  return (
    <div className="min-h-screen bg-[#F5F1E8] p-6">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-pink-400 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              CRNA TIMELINE GENERATOR
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm">by</span>
              <span className="px-2 py-0.5 bg-primary text-black text-xs font-bold rounded">
                The CRNA Club
              </span>
              <span className="px-2 py-0.5 bg-gray-900 text-white text-xs font-bold rounded">
                BETA
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-gray-600 hover:text-gray-900">
            <HelpCircle className="w-6 h-6" />
          </button>
          <div className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">
            Future CRNA Loading...
          </div>
          <Button className="bg-black text-white hover:bg-gray-900 rounded-xl px-4 py-2 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </header>

      {/* Master Timeline Section */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white border-4 border-black rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6" />
              <h2 className="text-xl font-bold">MASTER TIMELINE</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-white border-2 border-black rounded-full text-sm font-medium">
                0 Events • 0 Schools
              </span>
              <button className="p-2 hover:bg-gray-100 rounded-xl">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="w-10 h-10 text-gray-900" />
            </div>
            <h3 className="text-xl font-bold mb-2">Timeline Empty!</h3>
            <p className="text-gray-600 text-sm">Add a school deadline below to start.</p>
          </div>
        </div>
      </div>

      {/* Bottom Cards Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Target Schools Card */}
        <div className="bg-white border-4 border-black rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-pink-100 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-pink-600" />
              </div>
              <h2 className="text-lg font-bold">Target Schools</h2>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-4 py-2 flex items-center gap-2 text-sm">
              Add School
              <span className="text-lg">+</span>
            </Button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
            <p className="text-gray-500 font-medium">No schools yet.</p>
            <p className="text-gray-400 text-sm mt-1">Click "Add School" to start your journey.</p>
          </div>
        </div>

        {/* Custom Events Card */}
        <div className="bg-white border-4 border-black rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center">
                <List className="w-5 h-5 text-yellow-700" />
              </div>
              <h2 className="text-lg font-bold">Custom Events</h2>
            </div>
            <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl px-4 py-2 flex items-center gap-2 text-sm">
              Add Event
              <span className="text-lg">+</span>
            </Button>
          </div>

          <p className="text-gray-600 text-sm">
            Add exams, shadowing hours, or study sessions.
          </p>
        </div>
      </div>
    </div>
  );
}
