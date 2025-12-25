/**
 * Apple Style UI Demo Page
 * Showcases Apple-inspired design patterns: glassmorphism, soft shadows, animations
 */

import { useState } from 'react';
import {
  Sparkles,
  Bell,
  ChevronRight,
  Heart,
  Star,
  Clock,
  CheckCircle2,
  ArrowRight,
  Play,
  Settings,
  User,
  Calendar,
  BookOpen
} from 'lucide-react';

export default function AppleStyleDemo() {
  const [activeTab, setActiveTab] = useState('current');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      {/* Glassmorphic Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-soft">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight text-gray-900">Apple Style Demo</h1>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-12">

        {/* Section: Shadows Comparison */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Shadow Comparison</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-1">Current</p>
              <p className="font-semibold">shadow-sm</p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-soft">
              <p className="text-sm font-medium text-gray-500 mb-1">Apple</p>
              <p className="font-semibold">shadow-soft</p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-soft-md">
              <p className="text-sm font-medium text-gray-500 mb-1">Apple Hover</p>
              <p className="font-semibold">shadow-soft-md</p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-soft-lg">
              <p className="text-sm font-medium text-gray-500 mb-1">Apple Elevated</p>
              <p className="font-semibold">shadow-soft-lg</p>
            </div>
          </div>
        </section>

        {/* Section: Cards with Hover */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Interactive Cards</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Current Style */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-yellow-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-gray-900" />
                </div>
                <div>
                  <p className="font-semibold">Current Style</p>
                  <p className="text-sm text-gray-500">Standard hover</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">Uses shadow-sm with basic hover transition.</p>
            </div>

            {/* Apple Style */}
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-50 cursor-pointer transition-all duration-300 ease-apple hover:shadow-soft-lg hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Apple Style</p>
                  <p className="text-sm text-gray-500">Soft shadow + lift</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">Uses shadow-soft with smooth Apple easing.</p>
            </div>

            {/* Glassmorphic */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-soft-md border border-white/50 cursor-pointer transition-all duration-300 ease-apple hover:shadow-soft-lg hover:-translate-y-1 hover:bg-white/80">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Glassmorphic</p>
                  <p className="text-sm text-gray-500">Frosted glass effect</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">backdrop-blur-xl with semi-transparent bg.</p>
            </div>
          </div>
        </section>

        {/* Section: Buttons */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Button Styles</h2>
          <div className="flex flex-wrap gap-4">
            {/* Current Primary */}
            <button className="px-6 py-2.5 bg-yellow-400 text-gray-900 font-medium rounded-2xl transition-colors hover:bg-yellow-500">
              Current Primary
            </button>

            {/* Apple Primary */}
            <button className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-2xl shadow-soft transition-all duration-200 ease-apple hover:shadow-soft-md active:scale-[0.98]">
              Apple Primary
            </button>

            {/* Apple Secondary */}
            <button className="px-6 py-2.5 bg-gray-100 text-gray-900 font-medium rounded-2xl transition-all duration-200 ease-apple hover:bg-gray-200 active:scale-[0.98]">
              Secondary
            </button>

            {/* Apple Tinted */}
            <button className="px-6 py-2.5 bg-blue-100/60 text-blue-600 font-medium rounded-2xl backdrop-blur-sm transition-all duration-200 ease-apple hover:bg-blue-100 active:scale-[0.98]">
              Tinted
            </button>

            {/* Apple Accent (Your Yellow) */}
            <button className="px-6 py-2.5 bg-yellow-400 text-gray-900 font-medium rounded-2xl shadow-soft transition-all duration-200 ease-apple hover:shadow-soft-md hover:bg-yellow-500 active:scale-[0.98]">
              Accent + Shadow
            </button>
          </div>
        </section>

        {/* Section: Input Fields */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Input Fields</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Style</label>
              <input
                type="text"
                placeholder="Enter text..."
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Apple Style</label>
              <input
                type="text"
                placeholder="Enter text..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl shadow-inner-soft focus:bg-white focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all duration-200 outline-none"
              />
            </div>
          </div>
        </section>

        {/* Section: List Items */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">List Items</h2>
          <div className="bg-white rounded-4xl shadow-soft border border-gray-50 overflow-hidden">
            {[
              { icon: Calendar, label: 'Upcoming Events', desc: '3 events this week', color: 'from-orange-400 to-red-400' },
              { icon: BookOpen, label: 'Learning Progress', desc: '12 lessons completed', color: 'from-green-400 to-emerald-500' },
              { icon: User, label: 'Profile Completion', desc: '85% complete', color: 'from-blue-400 to-indigo-500' },
              { icon: Settings, label: 'Settings', desc: 'Customize your experience', color: 'from-gray-400 to-gray-500' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors duration-200 hover:bg-gray-50/50"
              >
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </section>

        {/* Section: Tabs */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Tab Navigation</h2>
          <div className="bg-gray-100 p-1 rounded-2xl inline-flex gap-1">
            {['current', 'upcoming', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ease-apple ${
                  activeTab === tab
                    ? 'bg-white shadow-soft text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {/* Section: Modal/Sheet Preview */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Modal Preview</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-2xl shadow-soft transition-all duration-200 ease-apple hover:shadow-soft-md active:scale-[0.98]"
          >
            Open Modal
          </button>
        </section>

        {/* Section: Badges & Pills */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Badges & Status</h2>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">Active</span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">Pending</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">In Progress</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">Draft</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">Premium</span>
          </div>
        </section>

        {/* Section: Progress Indicators */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Progress</h2>
          <div className="space-y-4 max-w-md">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">Profile Completion</span>
                <span className="text-gray-500">85%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">Course Progress</span>
                <span className="text-gray-500">60%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[60%] bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500" />
              </div>
            </div>
          </div>
        </section>

        {/* Section: Feature Card */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Feature Card (Hero Style)</h2>
          <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-4xl p-8 text-white shadow-soft-xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">NEW FEATURE</p>
                <h3 className="text-2xl font-bold tracking-tight">Smart Matching</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
            <p className="text-white/90 mb-6">Get personalized mentor recommendations based on your goals and preferences.</p>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-purple-600 font-semibold rounded-2xl transition-all duration-200 hover:shadow-lg active:scale-[0.98]">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white/95 backdrop-blur-2xl rounded-4xl shadow-elevated p-8 max-w-md w-full mx-4 transform transition-all">
            <h3 className="text-xl font-semibold tracking-tight mb-2">Apple-Style Modal</h3>
            <p className="text-gray-600 mb-6">This modal uses backdrop-blur, soft shadows, and the elevated shadow style.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-5 py-2.5 bg-gray-100 text-gray-900 font-medium rounded-2xl transition-all duration-200 ease-apple hover:bg-gray-200 active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-5 py-2.5 bg-gray-900 text-white font-medium rounded-2xl shadow-soft transition-all duration-200 ease-apple hover:shadow-soft-md active:scale-[0.98]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
