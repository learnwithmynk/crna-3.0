/**
 * Component Showcase Page - NEW GLASSMORPHISM DESIGN
 *
 * Temporary page for testing UI updates and fine-tuning components.
 * New design: Soft, glassmorphism, sunset gradients, rounded corners
 *
 * Route: /component-showcase
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Star,
  Clock,
  Calendar,
  User,
  Search,
  Bell,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
  Plus,
  Settings,
  TrendingUp,
  BookOpen,
  MessageCircle,
  ChevronRight,
  Activity,
  Eye,
  GraduationCap,
  FileText,
  Sparkles,
  Briefcase,
  Target,
  Award,
  Users,
  Lightbulb,
  MapPin,
  Send,
  Loader2,
  RefreshCw,
  Inbox,
  WifiOff,
  Lock,
  CheckCircle2,
  XCircle,
  ClipboardList
} from 'lucide-react';

function Section({ title, children }) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-100 text-gray-800">{title}</h2>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function SubSection({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">{title}</h3>
      {children}
    </div>
  );
}

// ============================================
// GRADIENT SECTION TITLES
// ============================================

// Gradient text for section titles - multiple gradient options
function GradientTitle({ children, gradient = 'sunset', size = 'default', className = '' }) {
  const gradients = {
    // Warm sunset - coral to orange
    sunset: 'from-[#F97066] via-[#FE90AF] to-[#FFB088]',
    // Cool ocean - teal to blue
    ocean: 'from-[#6FD6FF] via-[#87CEEB] to-[#A8E6CF]',
    // Brand yellow
    brand: 'from-[#f6ff88] via-[#FFE98A] to-[#FFD088]',
    // Lavender purple
    lavender: 'from-[#A890FE] via-[#D8B5FF] to-[#FCA5F1]',
    // Mint green
    mint: 'from-[#6DD5C0] via-[#A8E6CF] to-[#BFF098]',
    // Rose pink
    rose: 'from-[#FE90AF] via-[#FCA5F1] to-[#D8B5FF]',
    // Golden hour
    golden: 'from-[#FFB088] via-[#FFD088] to-[#f6ff88]',
    // Coral warm
    coral: 'from-[#FF8C8C] via-[#FE90AF] to-[#FFBBBB]',
  };

  const sizes = {
    sm: 'text-lg font-semibold',
    default: 'text-xl font-bold',
    lg: 'text-2xl font-bold',
    xl: 'text-3xl font-bold',
  };

  return (
    <span
      className={`
        bg-gradient-to-r ${gradients[gradient]}
        bg-clip-text text-transparent
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// Section with gradient title
function GradientSection({ title, gradient = 'sunset', children }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-100">
        <GradientTitle gradient={gradient} size="default">{title}</GradientTitle>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

// ============================================
// NEW DESIGN SYSTEM COMPONENTS
// ============================================

// Soft Card - the main container style
function SoftCard({ className = '', children, ...props }) {
  return (
    <div
      className={`bg-white rounded-3xl shadow-soft border border-gray-100/50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Glass Card - for overlays and special sections
function GlassCard({ className = '', children, ...props }) {
  return (
    <div
      className={`bg-white/70 backdrop-blur-xl rounded-3xl shadow-soft-lg border border-white/40 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// New Button styles
function SoftButton({ variant = 'primary', size = 'default', children, className = '', ...props }) {
  const variants = {
    primary: 'bg-slate-800 text-white hover:bg-slate-700',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    ghost: 'text-gray-600 hover:bg-gray-100',
    coral: 'bg-[#FE90AF] text-white hover:bg-[#fd7fa3]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    default: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2',
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium
        rounded-full transition-all duration-200 ease-apple
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

// FAB (Floating Action Button) - using coral/pink instead of purple
function FAB({ className = '', children, ...props }) {
  return (
    <button
      className={`
        w-10 h-10 rounded-full
        bg-gradient-to-br from-[#FE90AF] to-[#FF8C8C]
        text-white shadow-soft-lg
        flex items-center justify-center
        hover:shadow-soft-xl hover:scale-105
        transition-all duration-200 ease-apple
        ${className}
      `}
      {...props}
    >
      {children || <Plus className="w-5 h-5" />}
    </button>
  );
}

// Soft Input with Sunset glow focus ring
function SoftInput({ className = '', ...props }) {
  return (
    <input
      className={`
        w-full px-4 py-3 rounded-2xl
        bg-gray-50 border border-gray-200 shadow-inner-soft
        text-gray-900 placeholder-gray-400
        focus:outline-none focus:bg-white focus:border-gray-400
        focus:ring-4 focus:ring-gray-100 focus:shadow-none
        transition-all duration-200 ease-apple
        ${className}
      `}
      {...props}
    />
  );
}

// Soft Textarea with Sunset glow focus ring
function SoftTextarea({ className = '', ...props }) {
  return (
    <textarea
      className={`
        w-full px-4 py-3 rounded-2xl
        bg-gray-50 border border-gray-200 shadow-inner-soft
        text-gray-900 placeholder-gray-400
        focus:outline-none focus:bg-white focus:border-gray-400
        focus:ring-4 focus:ring-gray-100 focus:shadow-none
        transition-all duration-200 ease-apple
        min-h-[100px] resize-y
        ${className}
      `}
      {...props}
    />
  );
}

// Soft Badge - pill-style status indicators
function SoftBadge({ variant = 'default', children, className = '' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-600',
    active: 'bg-orange-50 text-orange-600',
    'in-progress': 'bg-amber-50 text-amber-600',
    'not-started': 'bg-gray-50 text-gray-400',
    success: 'bg-emerald-50 text-emerald-600',
    info: 'bg-blue-50 text-blue-600',
    coral: 'bg-red-50 text-red-400',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded-full
      text-xs font-medium tracking-widest uppercase
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
}

// ============================================
// SMALL TEXT STYLES (timestamps, subheaders, notes)
// ============================================

// Timestamp text - for "2h ago", "1d ago", times
function Timestamp({ children, className = '' }) {
  return (
    <span className={`text-xs text-gray-400 ${className}`}>
      {children}
    </span>
  );
}

// Subheader note - for section subtitles like "Today's Focus"
function SubheaderNote({ children, className = '' }) {
  return (
    <span className={`text-xs text-gray-500 font-medium ${className}`}>
      {children}
    </span>
  );
}

// Caption text - smallest text for metadata
function Caption({ children, className = '' }) {
  return (
    <span className={`text-[11px] text-gray-400 ${className}`}>
      {children}
    </span>
  );
}

// Meta text - for things like "2:00 PM • Zoom"
function MetaText({ children, className = '' }) {
  return (
    <span className={`text-xs text-gray-500 ${className}`}>
      {children}
    </span>
  );
}

// Icon Container - more opaque with gradient backgrounds
function IconBox({ color = 'gray', size = 'default', children, className = '' }) {
  const colors = {
    gray: 'bg-gradient-to-br from-gray-200 to-gray-100 text-gray-600',
    purple: 'bg-gradient-to-br from-purple-200 to-purple-100 text-purple-700',
    blue: 'bg-gradient-to-br from-blue-200 to-blue-100 text-blue-700',
    coral: 'bg-gradient-to-br from-[#FFBFB3] to-[#FFD6CC] text-red-600',
    green: 'bg-gradient-to-br from-emerald-200 to-emerald-100 text-emerald-700',
    amber: 'bg-gradient-to-br from-amber-200 to-amber-100 text-amber-700',
    indigo: 'bg-gradient-to-br from-indigo-200 to-indigo-100 text-indigo-700',
    yellow: 'bg-gradient-to-br from-[#f6ff88] to-[#FFFFC7] text-amber-800',
  };

  const sizes = {
    sm: 'w-8 h-8 rounded-xl',
    default: 'w-10 h-10 rounded-2xl',
    lg: 'w-12 h-12 rounded-2xl',
  };

  return (
    <div className={`
      flex items-center justify-center
      ${colors[color]}
      ${sizes[size]}
      ${className}
    `}>
      {children}
    </div>
  );
}

// ============================================
// SOFT GRADIENT PROGRESS BARS
// ============================================
function SoftProgress({ value = 0, variant = 'peach', className = '' }) {
  // Much softer gradient combinations
  const gradients = {
    peach: 'from-[#FFD6CC] via-[#FFBFB3] to-[#FFA99A]',
    coral: 'from-[#FFCCCC] via-[#FFB3B3] to-[#FE90AF]',
    mint: 'from-[#C6F7E2] via-[#A8F0D4] to-[#8EEDC7]',
    sky: 'from-[#D6ECFF] via-[#BFE0FF] to-[#A8D4FF]',
    lavender: 'from-[#E8D6FF] via-[#D9C2FF] to-[#C9ADFF]',
    lemon: 'from-[#f6ff88] via-[#FFFFC7] to-[#FFF9A3]',
    sunset: 'from-[#FFE4CC] via-[#FFCFB3] to-[#FFB899]',
  };

  return (
    <div className={`w-full h-2.5 bg-gray-100/80 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full bg-gradient-to-r ${gradients[variant]} transition-all duration-500`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

// ============================================
// 13 MILESTONE CARD GRADIENTS
// ============================================

// Milestone Card with gradient background
function MilestoneCard({
  step,
  title,
  description,
  progress = 0,
  gradient = 'brand', // default to brand yellow
  icon: Icon,
  className = ''
}) {
  // 13 soft, beautiful gradients - including brand yellow #f6ff88
  const gradients = {
    // 1. BRAND YELLOW - Primary gradient with your #f6ff88
    brand: {
      bg: 'from-[#f6ff88] via-[#FFFFC7] to-[#FFE4B3]',
      text: 'text-amber-900',
      subtext: 'text-amber-800/70',
      pill: 'bg-amber-900/20 text-amber-900',
      progress: 'bg-amber-900/30',
      progressFill: 'bg-amber-800',
    },
    // 2. Soft Peach/Coral - #FE90AF to #FFBBBB
    peach: {
      bg: 'from-[#FFCCCC] via-[#FFB8B8] to-[#FE90AF]',
      text: 'text-white',
      subtext: 'text-white/80',
      pill: 'bg-white/20 text-white',
      progress: 'bg-white/30',
      progressFill: 'bg-white',
    },
    // 3. Lavender Purple to Pink - #D8B5FF to #FFBBBB
    lavender: {
      bg: 'from-[#D8B5FF] via-[#E8C5FF] to-[#FFBBBB]',
      text: 'text-purple-900',
      subtext: 'text-purple-800/70',
      pill: 'bg-purple-900/20 text-purple-900',
      progress: 'bg-purple-900/30',
      progressFill: 'bg-purple-800',
    },
    // 4. Mint to Teal - #BFF098 to #6FD6FF
    mint: {
      bg: 'from-[#BFF098] via-[#A8E6CF] to-[#6FD6FF]',
      text: 'text-emerald-900',
      subtext: 'text-emerald-800/70',
      pill: 'bg-emerald-900/20 text-emerald-900',
      progress: 'bg-emerald-900/30',
      progressFill: 'bg-emerald-800',
    },
    // 5. Sky Blue - #C6EA8D to #6FD6FF (green to blue)
    sky: {
      bg: 'from-[#C6EA8D] via-[#A8E0C0] to-[#6FD6FF]',
      text: 'text-teal-900',
      subtext: 'text-teal-800/70',
      pill: 'bg-teal-900/20 text-teal-900',
      progress: 'bg-teal-900/30',
      progressFill: 'bg-teal-800',
    },
    // 6. Warm Sunset - #F1EAB9 to #FF8C8C
    sunset: {
      bg: 'from-[#F1EAB9] via-[#FFD6B8] to-[#FF8C8C]',
      text: 'text-orange-900',
      subtext: 'text-orange-800/70',
      pill: 'bg-orange-900/20 text-orange-900',
      progress: 'bg-orange-900/30',
      progressFill: 'bg-orange-800',
    },
    // 7. Soft Purple to Violet - #EA8D8D to #A890FE
    grape: {
      bg: 'from-[#EA8D8D] via-[#C9A0DC] to-[#A890FE]',
      text: 'text-white',
      subtext: 'text-white/80',
      pill: 'bg-white/20 text-white',
      progress: 'bg-white/30',
      progressFill: 'bg-white',
    },
    // 8. Ocean Blue - #00B7FF to #FFFFC7 (blue to cream)
    ocean: {
      bg: 'from-[#87CEEB] via-[#B8E0F0] to-[#FFFFC7]',
      text: 'text-sky-900',
      subtext: 'text-sky-800/70',
      pill: 'bg-sky-900/20 text-sky-900',
      progress: 'bg-sky-900/30',
      progressFill: 'bg-sky-800',
    },
    // 9. Rose Pink - #FCA5F1 to #B5FFFF
    rose: {
      bg: 'from-[#FCA5F1] via-[#E0C5F0] to-[#B5FFFF]',
      text: 'text-pink-900',
      subtext: 'text-pink-800/70',
      pill: 'bg-pink-900/20 text-pink-900',
      progress: 'bg-pink-900/30',
      progressFill: 'bg-pink-800',
    },
    // 10. Golden Hour - #D74177 to #FFE98A (pink to gold)
    golden: {
      bg: 'from-[#FFB088] via-[#FFD088] to-[#FFE98A]',
      text: 'text-amber-900',
      subtext: 'text-amber-800/70',
      pill: 'bg-amber-900/20 text-amber-900',
      progress: 'bg-amber-900/30',
      progressFill: 'bg-amber-800',
    },
    // 11. Soft Teal - #1EAE98 inspired but softer
    teal: {
      bg: 'from-[#A8E6CF] via-[#88D8C0] to-[#6DD5C0]',
      text: 'text-teal-900',
      subtext: 'text-teal-800/70',
      pill: 'bg-teal-900/20 text-teal-900',
      progress: 'bg-teal-900/30',
      progressFill: 'bg-teal-800',
    },
    // 12. Blush - soft pink
    blush: {
      bg: 'from-[#FFE4E4] via-[#FFD4D4] to-[#FFC4C4]',
      text: 'text-rose-900',
      subtext: 'text-rose-800/70',
      pill: 'bg-rose-900/20 text-rose-900',
      progress: 'bg-rose-900/30',
      progressFill: 'bg-rose-800',
    },
    // 13. Cream - warm neutral
    cream: {
      bg: 'from-[#FFF8E7] via-[#FFE8CC] to-[#FFD8B1]',
      text: 'text-amber-900',
      subtext: 'text-amber-800/70',
      pill: 'bg-amber-900/20 text-amber-900',
      progress: 'bg-amber-900/30',
      progressFill: 'bg-amber-800',
    },
  };

  const g = gradients[gradient] || gradients.brand;

  return (
    <div className={`
      rounded-3xl p-5
      bg-gradient-to-br ${g.bg}
      min-h-[180px] flex flex-col justify-between
      shadow-soft
      ${className}
    `}>
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-2xl bg-white/30 flex items-center justify-center ${g.text}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${g.pill}`}>
          STEP {step}
        </span>
      </div>
      <div>
        <h3 className={`text-xl font-bold mb-1 ${g.text}`}>{title}</h3>
        <p className={`text-sm mb-3 ${g.subtext}`}>{description}</p>
        <div className={`flex items-center justify-between text-xs ${g.subtext}`}>
          <span className="uppercase tracking-widest">Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className={`mt-2 h-1.5 ${g.progress} rounded-full overflow-hidden`}>
          <div
            className={`h-full ${g.progressFill} rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// List Item Row (like Quick Logs)
function ListItemRow({ icon: Icon, label, iconColor = 'gray', onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <IconBox color={iconColor} size="sm">
          <Icon className="w-4 h-4" />
        </IconBox>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
    </button>
  );
}

// Task Item with checkbox
function TaskItem({ title, date, tag, status = 'active', completed = false }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        <button className={`
          w-5 h-5 rounded-full border-2 flex items-center justify-center
          transition-all duration-200 ease-apple
          ${completed
            ? 'bg-emerald-500 border-emerald-500'
            : 'border-gray-300 hover:border-gray-400'
          }
        `}>
          {completed && <CheckCircle className="w-3 h-3 text-white" />}
        </button>
        <div>
          <p className={`text-sm font-medium ${completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
            {title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {date}
            </span>
            {tag && (
              <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                {tag}
              </span>
            )}
          </div>
        </div>
      </div>
      <SoftBadge variant={status}>{status.replace('-', ' ')}</SoftBadge>
    </div>
  );
}

// Stat Display (like Clinical Tracker)
function StatDisplay({ value, sublabel, icon: Icon, iconColor = 'coral' }) {
  return (
    <div className="flex items-start gap-3">
      {Icon && (
        <Icon className={`w-5 h-5 mt-1 ${
          iconColor === 'coral' ? 'text-red-400' :
          iconColor === 'blue' ? 'text-blue-500' : 'text-gray-400'
        }`} />
      )}
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-gray-900">{value}</span>
          {sublabel && <span className="text-gray-400 text-sm">{sublabel}</span>}
        </div>
      </div>
    </div>
  );
}

// ============================================
// TOGGLE COMPONENT
// ============================================
function SoftToggle({ checked, onChange, size = 'sm' }) {
  const sizes = {
    sm: { track: 'w-9 h-5', thumb: 'w-4 h-4', translate: 'translate-x-4' },
    default: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
    lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
  };

  const s = sizes[size];

  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`
        ${s.track} rounded-full p-0.5
        transition-all duration-200 ease-apple
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8C66]/50
        ${checked
          ? 'bg-gradient-to-r from-[#FF8C66] via-[#FE90AF] to-[#F97066]'
          : 'bg-gray-200'
        }
      `}
    >
      <span
        className={`
          block ${s.thumb} rounded-full bg-white shadow-soft
          transition-transform duration-200 ease-in-out
          ${checked ? s.translate : 'translate-x-0'}
        `}
      />
    </button>
  );
}

// ============================================
// GRADIENT TAB PILLS (like Feed/Discussions)
// ============================================
function GradientTabPills({ tabs, activeTab, onChange, gradient = 'coral' }) {
  // Multiple gradient color options for the active tab
  const gradients = {
    // Coral/Sunset - warm pinks
    coral: 'from-[#F97066] to-[#FE90AF]',
    // Ocean - teal to blue
    ocean: 'from-[#6DD5C0] to-[#6FD6FF]',
    // Golden - brand yellow to peach
    golden: 'from-[#f6ff88] via-[#FFD088] to-[#FFB088]',
    // Lavender - purple to pink
    lavender: 'from-[#A890FE] to-[#FCA5F1]',
    // Mint - green gradient
    mint: 'from-[#6DD5C0] to-[#A8E6CF]',
    // Sunset - orange to pink
    sunset: 'from-[#FFB088] via-[#FE90AF] to-[#F97066]',
  };

  return (
    <div className="inline-flex bg-gray-100 rounded-full p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`
            px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-apple
            ${activeTab === tab.value
              ? `bg-gradient-to-r ${gradients[gradient]} text-white shadow-soft`
              : 'text-gray-500 hover:text-gray-700'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// Tab Pills (gradient version - default sunset)
function TabPills({ tabs, activeTab, onChange }) {
  return (
    <div className="inline-flex bg-gray-100 rounded-full p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`
            px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ease-apple
            ${activeTab === tab.value
              ? 'bg-gradient-to-r from-[#FF8C66] via-[#FE90AF] to-[#F97066] text-white shadow-soft'
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// Underline Tabs
function UnderlineTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="flex gap-4 border-b border-gray-100">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`
            pb-2 text-sm font-medium transition-all duration-200 ease-apple relative
            ${activeTab === tab.value
              ? 'text-gray-900'
              : 'text-gray-400 hover:text-gray-600'
            }
          `}
        >
          {tab.label}
          {activeTab === tab.value && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}

// Avatar
function SoftAvatar({ src, fallback, size = 'default', className = '' }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    default: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  return (
    <div className={`
      rounded-full bg-gradient-to-br from-[#FFE4E4] to-[#E8D6FF]
      flex items-center justify-center overflow-hidden
      ${sizes[size]}
      ${className}
    `}>
      {src ? (
        <img src={src} alt="" className="w-full h-full object-cover" />
      ) : (
        <span className="font-medium text-rose-700">{fallback}</span>
      )}
    </div>
  );
}

// Color Selector (like in New Event modal)
function ColorSelector({ colors, selected, onChange }) {
  return (
    <div className="flex gap-2">
      {colors.map((color) => (
        <button
          key={color.value}
          onClick={() => onChange(color.value)}
          className={`
            w-10 h-10 rounded-full transition-all duration-200 ease-apple
            ${color.bg}
            ${selected === color.value
              ? 'ring-2 ring-offset-2 ring-gray-400 scale-110'
              : 'hover:scale-105'
            }
          `}
        />
      ))}
    </div>
  );
}

// ============================================
// LOADING STATES
// ============================================

// Spinner component
function Spinner({ size = 'default', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <Loader2 className={`animate-spin text-gray-400 ${sizes[size]} ${className}`} />
  );
}

// Gradient Spinner
function GradientSpinner({ size = 'default' }) {
  const sizes = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div className={`${sizes[size]} relative`}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF8C66] via-[#FE90AF] to-[#F97066] animate-spin"
           style={{ maskImage: 'conic-gradient(transparent 30%, black)', WebkitMaskImage: 'conic-gradient(transparent 30%, black)' }} />
    </div>
  );
}

// Skeleton components
function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded ${className}`} />
  );
}

function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-white rounded-3xl p-6 shadow-soft border border-gray-100/50 ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="w-12 h-12 rounded-2xl" />
        <div className="flex-1">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <SkeletonText lines={2} />
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  );
}

function SkeletonAvatar({ size = 'default' }) {
  const sizes = {
    sm: 'w-8 h-8',
    default: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };
  return <Skeleton className={`${sizes[size]} rounded-full`} />;
}

// Loading overlay
function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center z-10">
      <Spinner size="lg" className="text-[#FE90AF]" />
      <p className="mt-3 text-sm text-gray-500 font-medium">{message}</p>
    </div>
  );
}

// ============================================
// EMPTY STATES
// ============================================

function SoftEmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default' // default, error, offline, locked
}) {
  const variants = {
    default: {
      iconBg: 'bg-gradient-to-br from-gray-200 to-gray-100',
      iconColor: 'text-gray-400',
    },
    error: {
      iconBg: 'bg-gradient-to-br from-red-100 to-red-50',
      iconColor: 'text-red-400',
    },
    offline: {
      iconBg: 'bg-gradient-to-br from-amber-100 to-amber-50',
      iconColor: 'text-amber-500',
    },
    locked: {
      iconBg: 'bg-gradient-to-br from-purple-100 to-purple-50',
      iconColor: 'text-purple-400',
    },
    success: {
      iconBg: 'bg-gradient-to-br from-emerald-100 to-emerald-50',
      iconColor: 'text-emerald-500',
    },
  };

  const v = variants[variant];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className={`w-16 h-16 ${v.iconBg} rounded-3xl flex items-center justify-center mb-4`}>
        <Icon className={`w-8 h-8 ${v.iconColor}`} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs mb-6">{description}</p>
      {actionLabel && (
        <SoftButton variant="primary" onClick={onAction}>
          {actionLabel}
        </SoftButton>
      )}
    </div>
  );
}

// ============================================
// ALERTS & TOASTS
// ============================================

function SoftAlert({ variant = 'info', title, description, onClose, className = '' }) {
  const variants = {
    info: {
      // Brand purple/lavender - more on-brand than generic blue
      bg: 'bg-gradient-to-r from-purple-50/80 to-fuchsia-50/50',
      border: 'border-purple-200/60',
      icon: Info,
      iconColor: 'text-purple-500',
      titleColor: 'text-purple-800',
      textColor: 'text-purple-700',
    },
    success: {
      bg: 'bg-gradient-to-r from-emerald-50/80 to-teal-50/50',
      border: 'border-emerald-200/60',
      icon: CheckCircle2,
      iconColor: 'text-emerald-500',
      titleColor: 'text-emerald-800',
      textColor: 'text-emerald-700',
    },
    warning: {
      bg: 'bg-gradient-to-r from-amber-50/80 to-yellow-50/50',
      border: 'border-amber-200/60',
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      titleColor: 'text-amber-800',
      textColor: 'text-amber-700',
    },
    error: {
      bg: 'bg-gradient-to-r from-red-50/80 to-rose-50/50',
      border: 'border-red-200/60',
      icon: XCircle,
      iconColor: 'text-red-500',
      titleColor: 'text-red-800',
      textColor: 'text-red-700',
    },
  };

  const v = variants[variant];
  const IconComponent = v.icon;

  return (
    <div className={`${v.bg} ${v.border} border rounded-2xl p-4 ${className}`}>
      <div className="flex gap-3">
        <IconComponent className={`w-5 h-5 ${v.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          {title && <h4 className={`font-semibold ${v.titleColor} mb-1`}>{title}</h4>}
          {description && <p className={`text-sm ${v.textColor}`}>{description}</p>}
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Toast-style notification - soft glassmorphism style
function SoftToast({ variant = 'info', message, onClose }) {
  const variants = {
    info: {
      bg: 'bg-white/90 backdrop-blur-sm',
      border: 'border border-purple-200/50',
      iconBg: 'bg-gradient-to-br from-purple-100 to-fuchsia-100',
      iconColor: 'text-purple-600',
      textColor: 'text-gray-800',
    },
    success: {
      bg: 'bg-white/90 backdrop-blur-sm',
      border: 'border border-emerald-200/50',
      iconBg: 'bg-gradient-to-br from-emerald-100 to-teal-100',
      iconColor: 'text-emerald-600',
      textColor: 'text-gray-800',
    },
    warning: {
      bg: 'bg-white/90 backdrop-blur-sm',
      border: 'border border-amber-200/50',
      iconBg: 'bg-gradient-to-br from-amber-100 to-yellow-100',
      iconColor: 'text-amber-600',
      textColor: 'text-gray-800',
    },
    error: {
      bg: 'bg-white/90 backdrop-blur-sm',
      border: 'border border-red-200/50',
      iconBg: 'bg-gradient-to-br from-red-100 to-rose-100',
      iconColor: 'text-red-600',
      textColor: 'text-gray-800',
    },
  };

  const icons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: XCircle,
  };

  const v = variants[variant];
  const IconComponent = icons[variant];

  return (
    <div className={`${v.bg} ${v.border} rounded-3xl px-4 py-3 shadow-soft-lg flex items-center gap-3`}>
      <div className={`w-8 h-8 ${v.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
        <IconComponent className={`w-4 h-4 ${v.iconColor}`} />
      </div>
      <span className={`text-sm font-medium flex-1 ${v.textColor}`}>{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ============================================
// MODAL / DIALOG STYLES
// ============================================

// Modal container for preview
function SoftModal({
  title,
  children,
  footer,
  size = 'default', // sm, default, lg, xl, full
  gradient = null // optional gradient for header
}) {
  const sizes = {
    sm: 'max-w-sm',
    default: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-3xl',
  };

  return (
    <div className={`${sizes[size]} w-full bg-white rounded-3xl shadow-2xl overflow-hidden`}>
      {/* Header */}
      {gradient ? (
        <div
          className="px-6 py-8"
          style={{ background: gradient }}
        >
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
      ) : (
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-4">
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          {footer}
        </div>
      )}
    </div>
  );
}

// Milestone Modal (like the screenshot)
function MilestoneModal({ step, title, description, tasks = [], progress = 0 }) {
  return (
    <div className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex">
      {/* Close button in corner - positioned relative to full modal */}
      <button className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-white transition-colors shadow-soft">
        <X className="w-4 h-4" />
      </button>

      {/* Left - Gradient Panel */}
      <div
        className="w-64 p-6 flex flex-col"
        style={{ background: 'linear-gradient(to bottom right, #FF8C66, #FE90AF, #F97066)' }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="px-3 py-1 bg-white/20 rounded-full text-white text-xs font-medium">
            STEP {step}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
        <p className="text-white/80 text-sm mb-auto">{description}</p>

        <div className="mt-6">
          <div className="flex justify-between text-white/80 text-xs mb-2">
            <span>MILESTONE PROGRESS</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Right - Content Panel */}
      <div className="flex-1 p-6 pr-14">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Action Items</h3>
          </div>
          <button className="text-sm text-[#FE90AF] font-medium flex items-center gap-1 hover:underline">
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>

        <div className="space-y-3">
          {tasks.map((task, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                task.completed ? 'bg-emerald-500' : 'border-2 border-gray-300'
              }`}>
                {task.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                  {task.title}
                </p>
                {task.dueDate && (
                  <p className="text-xs text-gray-400 mt-0.5">Due: {task.dueDate}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// FORM COMPONENTS (Soft Style)
// ============================================

function SoftCheckbox({ checked, onChange, label, description, color = 'coral' }) {
  const colors = {
    coral: {
      checked: 'bg-gradient-to-br from-[#FF8C66] via-[#FE90AF] to-[#F97066]',
      border: 'border-[#FE90AF]',
    },
    purple: {
      checked: 'bg-gradient-to-br from-[#A890FE] via-[#D8B5FF] to-[#FCA5F1]',
      border: 'border-[#A890FE]',
    },
    teal: {
      checked: 'bg-gradient-to-br from-[#6DD5C0] via-[#5EEAD4] to-[#2DD4BF]',
      border: 'border-[#5EEAD4]',
    },
    yellow: {
      checked: 'bg-gradient-to-br from-[#f6ff88] via-[#FFE98A] to-[#FFD088]',
      border: 'border-[#f6ff88]',
    },
    emerald: {
      checked: 'bg-gradient-to-br from-[#34D399] via-[#10B981] to-[#059669]',
      border: 'border-[#10B981]',
    },
  };

  const c = colors[color] || colors.coral;

  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={`
          w-5 h-5 rounded-lg border-2 transition-all duration-200 ease-apple
          flex items-center justify-center
          ${checked
            ? `${c.checked} border-transparent`
            : 'border-gray-300 bg-white group-hover:border-gray-400'
          }
        `}>
          {checked && <CheckCircle2 className={`w-3 h-3 ${color === 'yellow' ? 'text-gray-800' : 'text-white'}`} />}
        </div>
      </div>
      <div>
        <span className="text-sm font-medium text-gray-900">{label}</span>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
    </label>
  );
}

function SoftRadio({ checked, onChange, label, description, name, color = 'coral' }) {
  const colors = {
    coral: {
      border: 'border-[#FE90AF]',
      dot: 'bg-gradient-to-br from-[#FF8C66] via-[#FE90AF] to-[#F97066]',
    },
    purple: {
      border: 'border-[#A890FE]',
      dot: 'bg-gradient-to-br from-[#A890FE] via-[#D8B5FF] to-[#FCA5F1]',
    },
    teal: {
      border: 'border-[#5EEAD4]',
      dot: 'bg-gradient-to-br from-[#6DD5C0] via-[#5EEAD4] to-[#2DD4BF]',
    },
    yellow: {
      border: 'border-[#f6ff88]',
      dot: 'bg-gradient-to-br from-[#f6ff88] via-[#FFE98A] to-[#FFD088]',
    },
    emerald: {
      border: 'border-[#10B981]',
      dot: 'bg-gradient-to-br from-[#34D399] via-[#10B981] to-[#059669]',
    },
  };

  const c = colors[color] || colors.coral;

  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative mt-0.5">
        <input
          type="radio"
          name={name}
          checked={checked}
          onChange={() => onChange(true)}
          className="sr-only"
        />
        <div className={`
          w-5 h-5 rounded-full border-2 transition-all duration-200 ease-apple
          flex items-center justify-center
          ${checked
            ? `${c.border} bg-white`
            : 'border-gray-300 bg-white group-hover:border-gray-400'
          }
        `}>
          {checked && (
            <div className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
          )}
        </div>
      </div>
      <div>
        <span className="text-sm font-medium text-gray-900">{label}</span>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
    </label>
  );
}

// Custom styled dropdown (fully styleable, not native)
function SoftSelect({ options, value, onChange, placeholder = 'Select...' }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-2.5 rounded-2xl
          bg-gray-50 border text-left
          text-sm cursor-pointer
          flex items-center justify-between gap-2
          transition-all duration-200 ease-apple
          ${isOpen
            ? 'bg-white border-[#FE90AF]/40 shadow-[0_0_0_3px_rgba(254,144,175,0.15),0_0_12px_rgba(254,144,175,0.1)]'
            : 'border-gray-200 hover:bg-gray-100'
          }
        `}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? '-rotate-90' : 'rotate-90'}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <>
          {/* Backdrop to close on click outside */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Options list */}
          <div className="absolute z-20 w-full mt-2 py-1 bg-white rounded-2xl border border-gray-200 shadow-soft-lg max-h-60 overflow-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-4 py-2.5 text-left text-sm
                  transition-colors duration-150
                  ${opt.value === value
                    ? 'bg-purple-50 text-purple-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SoftSearchInput({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-10 pr-4 py-2.5 rounded-2xl
          bg-gray-50 border border-gray-200
          text-sm text-gray-900 placeholder:text-gray-400
          focus:outline-none focus:bg-white focus:border-[#FE90AF]/40
          focus:shadow-[0_0_0_3px_rgba(254,144,175,0.15),0_0_12px_rgba(254,144,175,0.1)]
          transition-all duration-200 ease-apple
        "
      />
    </div>
  );
}

// ============================================
// MOTION ANIMATION DEMOS
// ============================================

// Demo component for staggered list animation
function MotionListDemo() {
  const [isVisible, setIsVisible] = useState(true);
  const items = [
    { icon: Calendar, label: 'Schedule interview', color: 'from-blue-400 to-indigo-500' },
    { icon: FileText, label: 'Submit application', color: 'from-green-400 to-emerald-500' },
    { icon: Users, label: 'Shadow day booked', color: 'from-purple-400 to-pink-500' },
  ];

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="text-xs text-gray-500 hover:text-gray-700 underline"
      >
        {isVisible ? 'Hide list' : 'Show list'}
      </button>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.08 },
              },
            }}
          >
            {items.map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-b-0"
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  show: { opacity: 1, x: 0 },
                }}
                transition={{ ease: [0.4, 0, 0.2, 1] }}
              >
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Demo component for modal animation
function MotionModalDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-2xl shadow-soft"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
      >
        Open Motion Modal
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white/95 backdrop-blur-2xl rounded-4xl shadow-elevated p-8 max-w-md w-full"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Motion Modal</h3>
                <p className="text-gray-600 mb-6">
                  This modal uses Apple-style spring animations with backdrop blur for that premium feel.
                </p>
                <div className="flex gap-3">
                  <motion.button
                    className="flex-1 px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-2xl"
                    whileHover={{ backgroundColor: '#e5e7eb' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    className="flex-1 px-5 py-2.5 bg-gray-900 text-white font-medium rounded-2xl shadow-soft"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsOpen(false)}
                  >
                    Confirm
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================
// MAIN SHOWCASE PAGE
// ============================================

export function ComponentShowcasePage() {
  const [activeTabPill, setActiveTabPill] = useState('feed');
  const [activeGradientTab, setActiveGradientTab] = useState('feed');
  const [activeGradientTab2, setActiveGradientTab2] = useState('feed');
  const [activeGradientTab3, setActiveGradientTab3] = useState('feed');
  const [activeUnderlineTab, setActiveUnderlineTab] = useState('todo');
  const [selectedColor, setSelectedColor] = useState('coral');

  // Toggle states
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(true);
  const [toggle3, setToggle3] = useState(false);

  // Form states
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(true);
  const [radioValue, setRadioValue] = useState('option1');
  const [selectValue, setSelectValue] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const tabPillOptions = [
    { value: 'feed', label: 'Feed' },
    { value: 'discussions', label: 'Discussions' },
  ];

  const underlineTabOptions = [
    { value: 'all', label: 'All' },
    { value: 'todo', label: 'To Do' },
    { value: 'completed', label: 'Completed' },
  ];

  const colorOptions = [
    { value: 'coral', bg: 'bg-[#FE90AF]' },
    { value: 'mint', bg: 'bg-[#A8E6CF]' },
    { value: 'brand', bg: 'bg-[#f6ff88]' },
  ];

  // All 13 gradient options for milestone cards
  const milestoneGradients = [
    'brand', 'peach', 'lavender', 'mint', 'sky', 'sunset',
    'grape', 'ocean', 'rose', 'golden', 'teal', 'blush', 'cream'
  ];

  // Background gradient options - gender neutral alternatives
  const [activeBgGradient, setActiveBgGradient] = useState('sage-cream');
  const backgroundGradients = {
    // Current (pink-ish)
    'current': 'from-orange-50 via-pink-50 to-purple-50',
    // Gender-neutral options
    'neutral-warm': 'from-amber-50/80 via-orange-50/60 to-slate-100',
    'neutral-cool': 'from-slate-50 via-gray-50 to-zinc-100',
    'cream-slate': 'from-[#f7f2e4]/60 via-amber-50/40 to-slate-100',
    'purple-slate': 'from-slate-50 via-purple-50/60 to-indigo-50/40',
    'lavender-mist': 'from-indigo-50/50 via-purple-50/40 to-slate-100',
    'warm-neutral': 'from-orange-50/50 via-amber-50/30 to-gray-100',
    'ocean-mist': 'from-slate-50 via-blue-50/40 to-teal-50/30',
    'sage-cream': 'from-[#f7f2e4]/50 via-green-50/30 to-slate-100',
    'dusk': 'from-amber-50/40 via-slate-100 to-purple-50/40',
    'soft-purple': 'from-purple-50/50 via-indigo-50/40 to-slate-100',
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundGradients[activeBgGradient]} p-4 md:p-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Component Showcase</h1>
          <p className="text-gray-500">Soft glassmorphism design system with brand yellow #f6ff88</p>
        </div>

        {/* ============================================ */}
        {/* DESIGN TOKEN REFERENCE - NAMING GUIDE */}
        {/* ============================================ */}
        <Section title="Design Token Reference (Naming Guide)">
          <p className="text-sm text-gray-500 mb-4">
            Reference names for all design elements. Use these names when specifying page themes.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card Gradients */}
            <div className="p-5 bg-white rounded-2xl border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gradient-to-r from-purple-400 to-pink-400" />
                Card Gradients (13 options)
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><code className="bg-gray-100 px-1.5 py-0.5 rounded">brand</code> - Yellow (#f6ff88)</div>
                <div><code className="bg-gray-100 px-1.5 py-0.5 rounded">peach</code> - Coral/Pink</div>
                <div><code className="bg-gray-100 px-1.5 py-0.5 rounded">lavender</code> - Purple/Pink</div>
                <div><code className="bg-gray-100 px-1.5 py-0.5 rounded">mint</code> - Green/Blue</div>
                <div><code className="bg-gray-100 px-1.5 py-0.5 rounded">sky</code> - Green/Sky</div>
                <div><code className="bg-gray-100 px-1.5 py-0.5 rounded">sunset</code> - Cream/Coral</div>
                <div><code className="bg-gray-100 px-1.5 py-0.5 rounded">grape</code> - Pink/Violet</div>
                <div><code className="bg-gray-100 px-1.5 py-0.5 rounded">ocean</code> - Sky/Cream</div>
                <div><code className="bg-gray-100 px-1.5 py-0.5 rounded">rose</code> - Pink/Cyan</div>
                <div><code className="bg-gray-100 px-1.5 py-0.5 rounded">golden</code> - Peach/Gold</div>
                <div><code className="bg-gray-100 px-1.5 py-0.5 rounded">teal</code> - Soft Teal</div>
                <div><code className="bg-gray-100 px-1.5 py-0.5 rounded">blush</code> - Soft Pink</div>
                <div><code className="bg-gray-100 px-1.5 py-0.5 rounded">cream</code> - Warm Neutral</div>
              </div>
            </div>

            {/* Form Control Colors */}
            <div className="p-5 bg-white rounded-2xl border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Checkbox/Radio Colors (5 options)
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-[#FF8C66] to-[#F97066]" />
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded">coral</code> - Warm pink/orange
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-[#A890FE] to-[#FCA5F1]" />
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded">purple</code> - Lavender/fuchsia
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-[#6DD5C0] to-[#2DD4BF]" />
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded">teal</code> - Cyan/turquoise
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-[#f6ff88] to-[#FFD088]" />
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded">yellow</code> - Brand yellow
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-[#34D399] to-[#059669]" />
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded">emerald</code> - Green
                </div>
              </div>
            </div>

            {/* AI Card Styles */}
            <div className="p-5 bg-white rounded-2xl border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                AI/Smart Card Styles (3 options)
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded bg-gradient-to-br from-purple-100/50 to-fuchsia-100/30 border border-purple-200/60" />
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded">ai-purple</code> - Subtle purple gradient
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded" style={{ background: 'linear-gradient(to br, #E8E0FF, #F3E8FF)' }} />
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded">ai-lavender</code> - Solid lavender
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded" style={{ background: 'linear-gradient(to br, #D8B5FF, #FCA5F1, #f6ff88)' }} />
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded">ai-aurora</code> - Purple → Yellow
                </div>
              </div>
            </div>

            {/* Alert/Toast Variants */}
            <div className="p-5 bg-white rounded-2xl border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Alert Variants (4 options)
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-purple-100 border border-purple-200" />
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded">info</code> - Purple (informational)
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-emerald-100 border border-emerald-200" />
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded">success</code> - Green
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-amber-100 border border-amber-200" />
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded">warning</code> - Amber/Yellow
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-100 border border-red-200" />
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded">error</code> - Red
                </div>
              </div>
            </div>

            {/* Background Gradients */}
            <div className="p-5 bg-white rounded-2xl border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-slate-100 to-purple-50" />
                Page Backgrounds (10 options)
              </h4>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div><code className="bg-gray-100 px-1 py-0.5 rounded text-[10px]">sage-cream</code></div>
                <div><code className="bg-gray-100 px-1 py-0.5 rounded text-[10px]">soft-purple</code></div>
                <div><code className="bg-gray-100 px-1 py-0.5 rounded text-[10px]">lavender-mist</code></div>
                <div><code className="bg-gray-100 px-1 py-0.5 rounded text-[10px]">ocean-mist</code></div>
                <div><code className="bg-gray-100 px-1 py-0.5 rounded text-[10px]">cream-slate</code></div>
                <div><code className="bg-gray-100 px-1 py-0.5 rounded text-[10px]">dusk</code></div>
                <div><code className="bg-gray-100 px-1 py-0.5 rounded text-[10px]">neutral-warm</code></div>
                <div><code className="bg-gray-100 px-1 py-0.5 rounded text-[10px]">neutral-cool</code></div>
                <div><code className="bg-gray-100 px-1 py-0.5 rounded text-[10px]">purple-slate</code></div>
                <div><code className="bg-gray-100 px-1 py-0.5 rounded text-[10px]">warm-neutral</code></div>
              </div>
            </div>

            {/* Button Variants */}
            <div className="p-5 bg-white rounded-2xl border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-4 h-3 rounded bg-[#f6ff88]" />
                Button Variants (4 options)
              </h4>
              <div className="space-y-2 text-xs">
                <div><code className="bg-gray-100 px-1.5 py-0.5 rounded">primary</code> - Brand yellow</div>
                <div><code className="bg-gray-100 px-1.5 py-0.5 rounded">secondary</code> - White/outline</div>
                <div><code className="bg-gray-100 px-1.5 py-0.5 rounded">ghost</code> - Text only</div>
                <div><code className="bg-gray-100 px-1.5 py-0.5 rounded">coral</code> - Coral gradient</div>
              </div>
            </div>
          </div>

          {/* Quick Reference Table */}
          <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
            <h4 className="font-semibold text-gray-900 mb-3">Example Page Theme Specification</h4>
            <p className="text-xs text-gray-600 mb-3">
              When you want a specific theme for a page, tell me like this:
            </p>
            <div className="bg-white p-3 rounded-xl border border-gray-200 text-xs font-mono text-gray-700">
              <p>"For the <strong>School Profile Page</strong>, use:</p>
              <p className="pl-4">• Card gradient: <code className="bg-purple-100 px-1">lavender</code></p>
              <p className="pl-4">• Checkboxes: <code className="bg-purple-100 px-1">purple</code></p>
              <p className="pl-4">• AI cards: <code className="bg-purple-100 px-1">ai-lavender</code></p>
              <p className="pl-4">• Background: <code className="bg-purple-100 px-1">soft-purple</code>"</p>
            </div>
          </div>
        </Section>

        {/* ============================================ */}
        {/* BACKGROUND GRADIENT OPTIONS */}
        {/* ============================================ */}
        <Section title="Page Background Gradients (Gender-Neutral Options)">
          <p className="text-sm text-gray-500 mb-4">
            Click to preview different background gradients. Less pink, more neutral/purple options.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Object.entries(backgroundGradients).map(([name, gradient]) => (
              <button
                key={name}
                onClick={() => setActiveBgGradient(name)}
                className={`
                  relative h-24 rounded-2xl overflow-hidden border-2 transition-all
                  ${activeBgGradient === name ? 'border-gray-800 ring-2 ring-gray-800/20' : 'border-white/50 hover:border-gray-300'}
                `}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                <div className="absolute inset-0 flex items-end p-2">
                  <span className={`
                    text-xs font-medium px-2 py-1 rounded-lg
                    ${activeBgGradient === name ? 'bg-gray-800 text-white' : 'bg-white/80 text-gray-700'}
                  `}>
                    {name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-4 p-3 bg-white/60 rounded-2xl">
            <p className="text-xs text-gray-600">
              <span className="font-semibold">Active:</span> {activeBgGradient} →
              <code className="ml-2 px-2 py-1 bg-gray-100 rounded text-[11px]">
                bg-gradient-to-br {backgroundGradients[activeBgGradient]}
              </code>
            </p>
          </div>
        </Section>

        {/* ============================================ */}
        {/* 13 MILESTONE CARD GRADIENTS - MAIN FOCUS */}
        {/* ============================================ */}
        <Section title="13 Milestone Card Gradients (Journey Steps)">
          <p className="text-sm text-gray-500 mb-6">
            These are the gradient options for the journey milestone cards.
            The "brand" gradient uses your primary yellow (#f6ff88).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {milestoneGradients.map((gradient, index) => (
              <MilestoneCard
                key={gradient}
                step={index + 1}
                title={gradient.charAt(0).toUpperCase() + gradient.slice(1)}
                description={`Gradient option ${index + 1}`}
                progress={Math.floor(Math.random() * 60) + 40}
                gradient={gradient}
                icon={[
                  BookOpen, Activity, GraduationCap, Search, Target,
                  Award, Briefcase, Users, Lightbulb, MapPin,
                  Heart, Star, Send
                ][index]}
              />
            ))}
          </div>

          <div className="mt-8 p-4 bg-white/50 rounded-2xl">
            <h4 className="font-semibold text-gray-800 mb-2">Gradient Reference</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div><span className="font-medium">1. brand:</span> #f6ff88 → cream</div>
              <div><span className="font-medium">2. peach:</span> soft coral/pink</div>
              <div><span className="font-medium">3. lavender:</span> purple → pink</div>
              <div><span className="font-medium">4. mint:</span> green → blue</div>
              <div><span className="font-medium">5. sky:</span> green → sky</div>
              <div><span className="font-medium">6. sunset:</span> cream → coral</div>
              <div><span className="font-medium">7. grape:</span> pink → violet</div>
              <div><span className="font-medium">8. ocean:</span> sky → cream</div>
              <div><span className="font-medium">9. rose:</span> pink → cyan</div>
              <div><span className="font-medium">10. golden:</span> peach → gold</div>
              <div><span className="font-medium">11. teal:</span> soft teal</div>
              <div><span className="font-medium">12. blush:</span> soft pink</div>
              <div><span className="font-medium">13. cream:</span> warm neutral</div>
            </div>
          </div>
        </Section>

        {/* Soft Progress Bars */}
        <Section title="Soft Gradient Progress Bars">
          <SoftCard className="p-6">
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">Peach</span>
                  <span className="text-gray-500">74%</span>
                </div>
                <SoftProgress value={74} variant="peach" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">Coral</span>
                  <span className="text-gray-500">60%</span>
                </div>
                <SoftProgress value={60} variant="coral" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">Mint</span>
                  <span className="text-gray-500">85%</span>
                </div>
                <SoftProgress value={85} variant="mint" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">Sky</span>
                  <span className="text-gray-500">45%</span>
                </div>
                <SoftProgress value={45} variant="sky" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">Lavender</span>
                  <span className="text-gray-500">30%</span>
                </div>
                <SoftProgress value={30} variant="lavender" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">Lemon (Brand)</span>
                  <span className="text-gray-500">90%</span>
                </div>
                <SoftProgress value={90} variant="lemon" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">Sunset</span>
                  <span className="text-gray-500">55%</span>
                </div>
                <SoftProgress value={55} variant="sunset" />
              </div>
            </div>
          </SoftCard>
        </Section>

        {/* ============================================ */}
        {/* AI SUGGESTION CARDS - STANDARDIZED */}
        {/* ============================================ */}
        <Section title="AI / Smart Suggestion Cards">
          <p className="text-sm text-gray-500 mb-6">
            Standardized card styles for personalized recommendations. Always use <strong>Sparkles</strong> icon.
            Compare variants to pick one standard for all AI suggestions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option 1: Purple Gradient (Recommended) */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-widest">Option 1: Purple Gradient (Current Pattern)</p>
              <div
                className="p-5 rounded-3xl border border-purple-200/60"
                style={{ background: 'linear-gradient(to bottom right, rgba(168, 144, 254, 0.15), rgba(216, 181, 255, 0.1), rgba(252, 165, 241, 0.08))' }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-200 to-fuchsia-200 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Smart Suggestion</h4>
                    <p className="text-sm text-gray-600 mb-3">Based on your profile, Duke University could be a great fit. Their program matches your clinical experience.</p>
                    <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
                      View Program →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Option 2: Lavender Card (from milestone gradients) */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-widest">Option 2: Lavender Card</p>
              <div
                className="p-5 rounded-3xl"
                style={{ background: 'linear-gradient(to bottom right, #E8E0FF, #F3E8FF, #FCE7F3)' }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Smart Suggestion</h4>
                    <p className="text-sm text-gray-700 mb-3">Based on your profile, Duke University could be a great fit. Their program matches your clinical experience.</p>
                    <button className="text-sm font-medium text-purple-700 hover:text-purple-800">
                      View Program →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Option 3: Aurora/Purple-Yellow (Journey style) */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-widest">Option 3: Aurora (Purple → Yellow)</p>
              <div
                className="p-5 rounded-3xl"
                style={{ background: 'linear-gradient(to bottom right, #D8B5FF, #FCA5F1, #f6ff88)' }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/40 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-purple-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Smart Suggestion</h4>
                    <p className="text-sm text-gray-800 mb-3">Based on your profile, Duke University could be a great fit. Their program matches your clinical experience.</p>
                    <button className="text-sm font-medium text-purple-800 hover:text-purple-900">
                      View Program →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Variants */}
          <SubSection title="Compact Variants (for sidebars/widgets)">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Compact Purple */}
              <div
                className="p-4 rounded-2xl border border-purple-200/60"
                style={{ background: 'linear-gradient(to bottom right, rgba(168, 144, 254, 0.12), rgba(252, 165, 241, 0.06))' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span className="text-xs font-semibold text-purple-600">For You</span>
                </div>
                <p className="text-sm font-medium text-gray-900">Complete your shadow hours</p>
                <p className="text-xs text-gray-500 mt-1">+10 ReadyScore points</p>
              </div>

              {/* Compact Lavender */}
              <div
                className="p-4 rounded-2xl"
                style={{ background: 'linear-gradient(to bottom right, #E8E0FF, #F3E8FF)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span className="text-xs font-semibold text-purple-600">For You</span>
                </div>
                <p className="text-sm font-medium text-gray-900">Complete your shadow hours</p>
                <p className="text-xs text-gray-500 mt-1">+10 ReadyScore points</p>
              </div>

              {/* Compact Aurora */}
              <div
                className="p-4 rounded-2xl"
                style={{ background: 'linear-gradient(to bottom right, #E8E0FF, #FDF2F8, #FEFCE8)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span className="text-xs font-semibold text-purple-600">For You</span>
                </div>
                <p className="text-sm font-medium text-gray-900">Complete your shadow hours</p>
                <p className="text-xs text-gray-500 mt-1">+10 ReadyScore points</p>
              </div>
            </div>
          </SubSection>

          {/* Numbered Steps Variant (like NextBestStepsCard) */}
          <SubSection title="Numbered Steps Variant (Dashboard Sidebar)">
            <div className="max-w-sm">
              <div
                className="p-5 rounded-3xl border border-purple-200/60"
                style={{ background: 'linear-gradient(to bottom right, rgba(168, 144, 254, 0.1), rgba(252, 165, 241, 0.05))' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <h4 className="font-semibold text-gray-900">Your Next Steps</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Add your CCRN certification</p>
                      <p className="text-xs text-gray-500">Required for 12 of your target programs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-400 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Log your shadow hours</p>
                      <p className="text-xs text-gray-500">You're 8 hours away from your goal</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-300 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Complete Georgetown checklist</p>
                      <p className="text-xs text-gray-500">Deadline in 14 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SubSection>

          {/* Recommendation */}
          <div className="mt-6 p-4 bg-purple-50/50 rounded-2xl border border-purple-200/40">
            <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Pick Your Standard
            </h4>
            <p className="text-sm text-purple-700">
              <strong>Option 1 (Purple Gradient)</strong> - Subtle, matches existing NextBestStepsCard<br />
              <strong>Option 2 (Lavender)</strong> - More visible, solid gradient feel<br />
              <strong>Option 3 (Aurora)</strong> - Eye-catching, ties in brand yellow
            </p>
          </div>
        </Section>

        {/* Buttons */}
        <Section title="Buttons">
          <SubSection title="Variants">
            <div className="flex flex-wrap gap-3">
              <SoftButton variant="primary">Primary</SoftButton>
              <SoftButton variant="secondary">Secondary</SoftButton>
              <SoftButton variant="ghost">Ghost</SoftButton>
              <SoftButton variant="coral">Coral</SoftButton>
            </div>
          </SubSection>
          <SubSection title="FAB (Floating Action Button)">
            <div className="flex flex-wrap items-center gap-4">
              <FAB />
              <FAB><Sparkles className="w-5 h-5" /></FAB>
              <FAB><Bell className="w-5 h-5" /></FAB>
            </div>
          </SubSection>
        </Section>

        {/* Cards */}
        <Section title="Card Variants">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Basic Cards */}
            <SoftCard className="p-6">
              <h3 className="font-semibold bg-gradient-to-r from-gray-700 to-gray-500 bg-clip-text text-transparent mb-2">Soft Card</h3>
              <p className="text-sm text-gray-500">The main container style with subtle shadow.</p>
            </SoftCard>

            <GlassCard className="p-6">
              <h3 className="font-semibold bg-gradient-to-r from-gray-700 to-gray-500 bg-clip-text text-transparent mb-2">Glass Card</h3>
              <p className="text-sm text-gray-500">For overlays with blur effect.</p>
            </GlassCard>

            {/* Brand Yellow Gradient Card - with orange accent + glow */}
            <div
              className="p-6 rounded-3xl bg-gradient-to-br from-[#f6ff88] via-[#FFE98A] to-[#FFB870]"
              style={{ boxShadow: '0 8px 32px -8px rgba(246, 255, 136, 0.5), 0 4px 16px -4px rgba(255, 184, 112, 0.3)' }}
            >
              <h3 className="font-semibold bg-gradient-to-r from-amber-800 via-orange-700 to-amber-600 bg-clip-text text-transparent mb-2">Brand Gradient Card</h3>
              <p className="text-sm text-amber-800/70">Primary #f6ff88 with orange + glow</p>
            </div>

            {/* More saturated card variants with soft glows */}
            <div
              className="p-6 rounded-3xl bg-gradient-to-br from-[#FE90AF]/50 via-[#FFCCCC]/40 to-[#FFB088]/40"
              style={{ boxShadow: '0 8px 32px -8px rgba(254, 144, 175, 0.4), 0 4px 16px -4px rgba(255, 176, 136, 0.25)' }}
            >
              <h3 className="font-semibold bg-gradient-to-r from-rose-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-2">Soft Coral Card</h3>
              <p className="text-sm text-gray-600">Warm pink gradient + glow.</p>
            </div>

            <div
              className="p-6 rounded-3xl bg-gradient-to-br from-[#A8E6CF]/60 via-[#C6F7E2]/50 to-[#6FD6FF]/40"
              style={{ boxShadow: '0 8px 32px -8px rgba(168, 230, 207, 0.5), 0 4px 16px -4px rgba(111, 214, 255, 0.3)' }}
            >
              <h3 className="font-semibold bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent mb-2">Soft Mint Card</h3>
              <p className="text-sm text-gray-600">Cool refreshing gradient + glow.</p>
            </div>

            <div
              className="p-6 rounded-3xl bg-gradient-to-br from-[#D8B5FF]/50 via-[#E8D6FF]/40 to-[#FCA5F1]/40"
              style={{ boxShadow: '0 8px 32px -8px rgba(216, 181, 255, 0.5), 0 4px 16px -4px rgba(252, 165, 241, 0.3)' }}
            >
              <h3 className="font-semibold bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent mb-2">Soft Lavender Card</h3>
              <p className="text-sm text-gray-600">Calming purple tones + glow.</p>
            </div>

            <div
              className="p-6 rounded-3xl bg-gradient-to-br from-[#87CEEB]/50 via-[#B8E0F0]/40 to-[#A8E6CF]/40"
              style={{ boxShadow: '0 8px 32px -8px rgba(135, 206, 235, 0.5), 0 4px 16px -4px rgba(168, 230, 207, 0.3)' }}
            >
              <h3 className="font-semibold bg-gradient-to-r from-sky-600 via-blue-500 to-teal-500 bg-clip-text text-transparent mb-2">Soft Ocean Card</h3>
              <p className="text-sm text-gray-600">Sky blue to teal + glow.</p>
            </div>

            {/* Aurora - Purple to Yellow gradient (from Journey screenshot) */}
            <div
              className="p-6 rounded-3xl"
              style={{
                background: 'linear-gradient(to bottom right, #E8D5F2, #FDF2F8, #FEF3E2, rgba(246, 255, 136, 0.6))',
                boxShadow: '0 8px 32px -8px rgba(232, 213, 242, 0.5), 0 4px 16px -4px rgba(246, 255, 136, 0.3)'
              }}
            >
              <h3 className="font-semibold bg-gradient-to-br from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent mb-2">Aurora Card</h3>
              <p className="text-sm text-gray-600">Purple → pink → yellow (Journey BG).</p>
            </div>
          </div>
        </Section>

        {/* All Status Badges */}
        <Section title="All Status Badges">
          <SoftCard className="p-6 space-y-6">
            <SubSection title="Application Workflow Statuses">
              <div className="flex flex-wrap gap-3">
                <SoftBadge variant="not-started">Not Started</SoftBadge>
                <SoftBadge variant="in-progress">In Progress</SoftBadge>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">Submitted</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-600">Interview Invite</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-600">Interview Complete</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">Waitlisted</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">Denied</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">Accepted</span>
              </div>
            </SubSection>
            <SubSection title="Generic Statuses">
              <div className="flex flex-wrap gap-3">
                <SoftBadge variant="success">Completed</SoftBadge>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">Pending</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">Confirmed</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">Cancelled</span>
              </div>
            </SubSection>
            <SubSection title="UI Badge Variants (Soft Style)">
              <div className="flex flex-wrap gap-3">
                <SoftBadge variant="default">Default</SoftBadge>
                <SoftBadge variant="active">Active</SoftBadge>
                <SoftBadge variant="in-progress">In Progress</SoftBadge>
                <SoftBadge variant="not-started">Not Started</SoftBadge>
                <SoftBadge variant="success">Success</SoftBadge>
                <SoftBadge variant="info">Info</SoftBadge>
                <SoftBadge variant="coral">Coral</SoftBadge>
                <SoftBadge variant="purple">Purple</SoftBadge>
              </div>
            </SubSection>
          </SoftCard>
        </Section>

        {/* Small Text Styles */}
        <Section title="Small Text Styles">
          <SoftCard className="p-6 space-y-6">
            <SubSection title="Timestamps">
              <div className="flex flex-wrap items-center gap-6">
                <Timestamp>2h ago</Timestamp>
                <Timestamp>1d ago</Timestamp>
                <Timestamp>Oct 24, 2023</Timestamp>
                <Timestamp>2:00 PM</Timestamp>
              </div>
            </SubSection>
            <SubSection title="Subheader Notes">
              <div className="flex flex-wrap items-center gap-6">
                <SubheaderNote>Today's Focus</SubheaderNote>
                <SubheaderNote>October 2023</SubheaderNote>
                <SubheaderNote>Schedule</SubheaderNote>
                <SubheaderNote>View All</SubheaderNote>
              </div>
            </SubSection>
            <SubSection title="Meta Text (with dots)">
              <div className="flex flex-wrap items-center gap-6">
                <MetaText>2:00 PM • Zoom</MetaText>
                <MetaText>4:30 PM • Library</MetaText>
                <MetaText>Due: Completed</MetaText>
              </div>
            </SubSection>
            <SubSection title="Captions (smallest)">
              <div className="flex flex-wrap items-center gap-6">
                <Caption>S M T W T F S</Caption>
                <Caption>Resume Review</Caption>
                <Caption>Study Group</Caption>
              </div>
            </SubSection>
            <SubSection title="Usage Example">
              <div className="bg-white rounded-2xl p-4 border border-gray-100 max-w-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">Schedule</span>
                  <SubheaderNote>Today's Focus</SubheaderNote>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-200 to-purple-100 flex items-center justify-center text-purple-700 text-xs font-bold">24</div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Resume Review</p>
                      <MetaText>2:00 PM • Zoom</MetaText>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-200 to-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">25</div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Study Group</p>
                      <MetaText>4:30 PM • Library</MetaText>
                    </div>
                  </div>
                </div>
              </div>
            </SubSection>
          </SoftCard>
        </Section>

        {/* Icon Containers */}
        <Section title="Icon Containers & All Icons">
          <SoftCard className="p-6 space-y-6">
            <SubSection title="Icon Box Color Variants">
              <div className="flex flex-wrap gap-4">
                <div className="text-center">
                  <IconBox color="coral"><Activity className="w-5 h-5" /></IconBox>
                  <p className="text-xs text-gray-400 mt-1">coral</p>
                </div>
                <div className="text-center">
                  <IconBox color="purple"><Heart className="w-5 h-5" /></IconBox>
                  <p className="text-xs text-gray-400 mt-1">purple</p>
                </div>
                <div className="text-center">
                  <IconBox color="blue"><Calendar className="w-5 h-5" /></IconBox>
                  <p className="text-xs text-gray-400 mt-1">blue</p>
                </div>
                <div className="text-center">
                  <IconBox color="green"><CheckCircle className="w-5 h-5" /></IconBox>
                  <p className="text-xs text-gray-400 mt-1">green</p>
                </div>
                <div className="text-center">
                  <IconBox color="amber"><Star className="w-5 h-5" /></IconBox>
                  <p className="text-xs text-gray-400 mt-1">amber</p>
                </div>
                <div className="text-center">
                  <IconBox color="yellow"><Sparkles className="w-5 h-5" /></IconBox>
                  <p className="text-xs text-gray-400 mt-1">yellow</p>
                </div>
                <div className="text-center">
                  <IconBox color="indigo"><GraduationCap className="w-5 h-5" /></IconBox>
                  <p className="text-xs text-gray-400 mt-1">indigo</p>
                </div>
                <div className="text-center">
                  <IconBox color="gray"><Settings className="w-5 h-5" /></IconBox>
                  <p className="text-xs text-gray-400 mt-1">gray</p>
                </div>
              </div>
            </SubSection>
            <SubSection title="Icon Box Sizes">
              <div className="flex flex-wrap items-end gap-4">
                <div className="text-center">
                  <IconBox color="coral" size="sm"><Heart className="w-4 h-4" /></IconBox>
                  <p className="text-xs text-gray-400 mt-1">sm</p>
                </div>
                <div className="text-center">
                  <IconBox color="coral" size="default"><Heart className="w-5 h-5" /></IconBox>
                  <p className="text-xs text-gray-400 mt-1">default</p>
                </div>
                <div className="text-center">
                  <IconBox color="coral" size="lg"><Heart className="w-6 h-6" /></IconBox>
                  <p className="text-xs text-gray-400 mt-1">lg</p>
                </div>
              </div>
            </SubSection>
            <SubSection title="Common App Icons (Lucide)">
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: Heart, name: 'Heart' },
                  { icon: Star, name: 'Star' },
                  { icon: Clock, name: 'Clock' },
                  { icon: Calendar, name: 'Calendar' },
                  { icon: User, name: 'User' },
                  { icon: Search, name: 'Search' },
                  { icon: Bell, name: 'Bell' },
                  { icon: CheckCircle, name: 'CheckCircle' },
                  { icon: AlertTriangle, name: 'AlertTriangle' },
                  { icon: Info, name: 'Info' },
                  { icon: X, name: 'X' },
                  { icon: Plus, name: 'Plus' },
                  { icon: Settings, name: 'Settings' },
                  { icon: TrendingUp, name: 'TrendingUp' },
                  { icon: BookOpen, name: 'BookOpen' },
                  { icon: MessageCircle, name: 'MessageCircle' },
                  { icon: ChevronRight, name: 'ChevronRight' },
                  { icon: Activity, name: 'Activity' },
                  { icon: Eye, name: 'Eye' },
                  { icon: GraduationCap, name: 'GraduationCap' },
                  { icon: FileText, name: 'FileText' },
                  { icon: Sparkles, name: 'Sparkles' },
                  { icon: Briefcase, name: 'Briefcase' },
                  { icon: Target, name: 'Target' },
                  { icon: Award, name: 'Award' },
                  { icon: Users, name: 'Users' },
                  { icon: Lightbulb, name: 'Lightbulb' },
                  { icon: MapPin, name: 'MapPin' },
                  { icon: Send, name: 'Send' },
                ].map(({ icon: Icon, name }) => (
                  <div key={name} className="text-center w-16">
                    <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 truncate">{name}</p>
                  </div>
                ))}
              </div>
            </SubSection>
          </SoftCard>
        </Section>

        {/* Toggle */}
        <Section title="Toggle Switch">
          <SoftCard className="p-6">
            <SubSection title="Toggle Sizes">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <SoftToggle checked={toggle1} onChange={setToggle1} size="sm" />
                  <span className="text-sm text-gray-600">Small</span>
                </div>
                <div className="flex items-center gap-3">
                  <SoftToggle checked={toggle2} onChange={setToggle2} size="default" />
                  <span className="text-sm text-gray-600">Default</span>
                </div>
                <div className="flex items-center gap-3">
                  <SoftToggle checked={toggle3} onChange={setToggle3} size="lg" />
                  <span className="text-sm text-gray-600">Large</span>
                </div>
              </div>
            </SubSection>
            <SubSection title="Toggle States">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <SoftToggle checked={false} onChange={() => {}} />
                  <span className="text-sm text-gray-600">Off State</span>
                </div>
                <div className="flex items-center gap-3">
                  <SoftToggle checked={true} onChange={() => {}} />
                  <span className="text-sm text-gray-600">On State (Gradient)</span>
                </div>
              </div>
            </SubSection>
          </SoftCard>
        </Section>

        {/* Gradient Tab Pills */}
        <Section title="Gradient Tab Pills">
          <SoftCard className="p-6 space-y-6">
            <SubSection title="Coral (Default)">
              <GradientTabPills
                tabs={tabPillOptions}
                activeTab={activeGradientTab}
                onChange={setActiveGradientTab}
                gradient="coral"
              />
            </SubSection>
            <SubSection title="Ocean">
              <GradientTabPills
                tabs={tabPillOptions}
                activeTab={activeGradientTab2}
                onChange={setActiveGradientTab2}
                gradient="ocean"
              />
            </SubSection>
            <SubSection title="Golden (Brand)">
              <GradientTabPills
                tabs={tabPillOptions}
                activeTab={activeGradientTab3}
                onChange={setActiveGradientTab3}
                gradient="golden"
              />
            </SubSection>
            <SubSection title="All Gradient Options">
              <div className="flex flex-wrap gap-3">
                {['coral', 'ocean', 'golden', 'lavender', 'mint', 'sunset'].map((g) => (
                  <div key={g} className={`px-4 py-2 rounded-full text-white text-sm font-medium bg-gradient-to-r ${
                    g === 'coral' ? 'from-[#F97066] to-[#FE90AF]' :
                    g === 'ocean' ? 'from-[#6DD5C0] to-[#6FD6FF]' :
                    g === 'golden' ? 'from-[#f6ff88] via-[#FFD088] to-[#FFB088] text-amber-900' :
                    g === 'lavender' ? 'from-[#A890FE] to-[#FCA5F1]' :
                    g === 'mint' ? 'from-[#6DD5C0] to-[#A8E6CF] text-emerald-900' :
                    'from-[#FFB088] via-[#FE90AF] to-[#F97066]'
                  }`}>
                    {g}
                  </div>
                ))}
              </div>
            </SubSection>
          </SoftCard>
        </Section>

        {/* Gradient Section Titles */}
        <Section title="Gradient Section Titles">
          <SoftCard className="p-6 space-y-6">
            <SubSection title="All 8 Gradient Options">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <GradientTitle gradient="sunset" size="lg">Sunset Gradient</GradientTitle>
                  <span className="text-xs text-gray-400">coral → pink → orange</span>
                </div>
                <div className="flex items-center gap-4">
                  <GradientTitle gradient="ocean" size="lg">Ocean Gradient</GradientTitle>
                  <span className="text-xs text-gray-400">teal → blue → mint</span>
                </div>
                <div className="flex items-center gap-4">
                  <GradientTitle gradient="brand" size="lg">Brand Gradient</GradientTitle>
                  <span className="text-xs text-gray-400">#f6ff88 → gold</span>
                </div>
                <div className="flex items-center gap-4">
                  <GradientTitle gradient="lavender" size="lg">Lavender Gradient</GradientTitle>
                  <span className="text-xs text-gray-400">purple → pink</span>
                </div>
                <div className="flex items-center gap-4">
                  <GradientTitle gradient="mint" size="lg">Mint Gradient</GradientTitle>
                  <span className="text-xs text-gray-400">teal → green</span>
                </div>
                <div className="flex items-center gap-4">
                  <GradientTitle gradient="rose" size="lg">Rose Gradient</GradientTitle>
                  <span className="text-xs text-gray-400">pink → lavender</span>
                </div>
                <div className="flex items-center gap-4">
                  <GradientTitle gradient="golden" size="lg">Golden Gradient</GradientTitle>
                  <span className="text-xs text-gray-400">peach → gold → yellow</span>
                </div>
                <div className="flex items-center gap-4">
                  <GradientTitle gradient="coral" size="lg">Coral Gradient</GradientTitle>
                  <span className="text-xs text-gray-400">soft pink tones</span>
                </div>
              </div>
            </SubSection>
            <SubSection title="Size Variations">
              <div className="space-y-2">
                <GradientTitle gradient="sunset" size="sm">Small Title</GradientTitle>
                <br />
                <GradientTitle gradient="sunset" size="default">Default Title</GradientTitle>
                <br />
                <GradientTitle gradient="sunset" size="lg">Large Title</GradientTitle>
                <br />
                <GradientTitle gradient="sunset" size="xl">Extra Large Title</GradientTitle>
              </div>
            </SubSection>
          </SoftCard>
        </Section>

        {/* Tabs - Solid versions */}
        <Section title="Tabs (Solid Color)">
          <SubSection title="Pill Tabs">
            <TabPills
              tabs={tabPillOptions}
              activeTab={activeTabPill}
              onChange={setActiveTabPill}
            />
          </SubSection>
          <SubSection title="Underline Tabs">
            <UnderlineTabs
              tabs={underlineTabOptions}
              activeTab={activeUnderlineTab}
              onChange={setActiveUnderlineTab}
            />
          </SubSection>
        </Section>

        {/* Avatars */}
        <Section title="Avatars">
          <div className="flex items-center gap-4">
            <SoftAvatar size="sm" fallback="SM" />
            <SoftAvatar size="default" fallback="MD" />
            <SoftAvatar size="lg" fallback="LG" />
            <SoftAvatar size="xl" fallback="XL" />
          </div>
        </Section>

        {/* Color Palette */}
        <Section title="Color Palette Reference">
          <SoftCard className="p-6 space-y-6">
            <SubSection title="Brand Colors">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="w-full h-16 rounded-2xl bg-[#f6ff88] border border-gray-200 mb-2"></div>
                  <p className="text-xs font-medium">Brand Yellow</p>
                  <p className="text-xs text-gray-400">#f6ff88</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-16 rounded-2xl bg-[#f7f2e4] border border-gray-200 mb-2"></div>
                  <p className="text-xs font-medium">Brand Cream</p>
                  <p className="text-xs text-gray-400">#f7f2e4</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#f6ff88] via-[#FFE98A] to-[#FFB870] mb-2"></div>
                  <p className="text-xs font-medium">Brand Gradient</p>
                  <p className="text-xs text-gray-400">yellow → orange</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-16 rounded-2xl bg-slate-800 mb-2"></div>
                  <p className="text-xs font-medium">Primary Dark</p>
                  <p className="text-xs text-gray-400">slate-800</p>
                </div>
              </div>
            </SubSection>
            <SubSection title="Accent Gradients">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#E85A4F] via-[#F97066] to-[#FF8C8C] mb-2"></div>
                  <p className="text-xs font-medium">Coral</p>
                  <p className="text-xs text-gray-400">darker red tones</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#FFCCB8] via-[#FFD6CC] to-[#FFE4D6] mb-2"></div>
                  <p className="text-xs font-medium">Peach</p>
                  <p className="text-xs text-gray-400">softer orange</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#A8E6CF] to-[#6FD6FF] mb-2"></div>
                  <p className="text-xs font-medium">Mint/Teal</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#D8B5FF] to-[#FCA5F1] mb-2"></div>
                  <p className="text-xs font-medium">Lavender</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#FF9F43] via-[#FFD088] to-[#f6ff88] mb-2"></div>
                  <p className="text-xs font-medium">Golden</p>
                  <p className="text-xs text-gray-400">more contrast</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-16 rounded-2xl bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 border mb-2"></div>
                  <p className="text-xs font-medium">BG Gradient</p>
                </div>
              </div>
            </SubSection>
          </SoftCard>
        </Section>

        {/* ============================================ */}
        {/* LOADING STATES */}
        {/* ============================================ */}
        <Section title="Loading States">
          <SoftCard className="p-6 space-y-6">
            <SubSection title="Spinners">
              <div className="flex flex-wrap items-center gap-6">
                <div className="text-center">
                  <Spinner size="sm" />
                  <p className="text-xs text-gray-400 mt-2">sm</p>
                </div>
                <div className="text-center">
                  <Spinner size="default" />
                  <p className="text-xs text-gray-400 mt-2">default</p>
                </div>
                <div className="text-center">
                  <Spinner size="lg" />
                  <p className="text-xs text-gray-400 mt-2">lg</p>
                </div>
                <div className="text-center">
                  <Spinner size="xl" />
                  <p className="text-xs text-gray-400 mt-2">xl</p>
                </div>
                <div className="text-center">
                  <Spinner size="lg" className="text-[#FE90AF]" />
                  <p className="text-xs text-gray-400 mt-2">coral</p>
                </div>
              </div>
            </SubSection>

            <SubSection title="Skeleton Components">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Skeleton Card</p>
                  <SkeletonCard />
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Skeleton Text (3 lines)</p>
                    <SkeletonText lines={3} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Skeleton Avatars</p>
                    <div className="flex gap-3">
                      <SkeletonAvatar size="sm" />
                      <SkeletonAvatar size="default" />
                      <SkeletonAvatar size="lg" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Skeleton Buttons</p>
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-20 rounded-full" />
                      <Skeleton className="h-9 w-24 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </SubSection>

            <SubSection title="Loading Overlay (on card)">
              <div className="relative max-w-sm">
                <SoftCard className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Card with Overlay</h3>
                  <p className="text-sm text-gray-500">Content is loading...</p>
                </SoftCard>
                <LoadingOverlay message="Saving changes..." />
              </div>
            </SubSection>
          </SoftCard>
        </Section>

        {/* ============================================ */}
        {/* EMPTY STATES */}
        {/* ============================================ */}
        <Section title="Empty States">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SoftCard>
              <SoftEmptyState
                icon={Inbox}
                title="No messages yet"
                description="When you receive messages, they'll appear here."
                variant="default"
              />
            </SoftCard>

            <SoftCard>
              <SoftEmptyState
                icon={Search}
                title="No results found"
                description="Try adjusting your search or filters to find what you're looking for."
                actionLabel="Clear filters"
                onAction={() => {}}
                variant="default"
              />
            </SoftCard>

            <SoftCard>
              <SoftEmptyState
                icon={AlertCircle}
                title="Something went wrong"
                description="We couldn't load this content. Please try again."
                actionLabel="Retry"
                onAction={() => {}}
                variant="error"
              />
            </SoftCard>

            <SoftCard>
              <SoftEmptyState
                icon={WifiOff}
                title="You're offline"
                description="Check your internet connection and try again."
                actionLabel="Refresh"
                onAction={() => {}}
                variant="offline"
              />
            </SoftCard>

            <SoftCard>
              <SoftEmptyState
                icon={Lock}
                title="Access restricted"
                description="Upgrade your plan to unlock this feature."
                actionLabel="Upgrade"
                onAction={() => {}}
                variant="locked"
              />
            </SoftCard>

            <SoftCard>
              <SoftEmptyState
                icon={CheckCircle2}
                title="All caught up!"
                description="You've completed all your tasks. Great work!"
                variant="success"
              />
            </SoftCard>
          </div>
        </Section>

        {/* ============================================ */}
        {/* ALERTS & TOASTS */}
        {/* ============================================ */}
        <Section title="Alerts & Toasts">
          <SoftCard className="p-6 space-y-6">
            <SubSection title="Alert Variants">
              <div className="space-y-3">
                <SoftAlert
                  variant="info"
                  title="Information"
                  description="This is an informational alert to keep you updated."
                />
                <SoftAlert
                  variant="success"
                  title="Success!"
                  description="Your changes have been saved successfully."
                />
                <SoftAlert
                  variant="warning"
                  title="Warning"
                  description="Please review your settings before continuing."
                />
                <SoftAlert
                  variant="error"
                  title="Error"
                  description="Something went wrong. Please try again."
                />
              </div>
            </SubSection>

            <SubSection title="Toast Notifications">
              <div className="space-y-3 max-w-md">
                <SoftToast variant="info" message="New message received" />
                <SoftToast variant="success" message="Profile updated successfully!" />
                <SoftToast variant="warning" message="Your session is about to expire" />
                <SoftToast variant="error" message="Failed to save changes" />
              </div>
            </SubSection>
          </SoftCard>
        </Section>

        {/* ============================================ */}
        {/* MODAL / DIALOG VARIANTS */}
        {/* ============================================ */}
        <Section title="Modal / Dialog Variants">
          <p className="text-sm text-gray-500 mb-6">
            These are modal/dialog designs. The actual modal overlay uses a dark backdrop with blur.
          </p>

          <div className="space-y-8">
            <SubSection title="Standard Modal (sizes)">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900/5 rounded-3xl p-6 flex items-center justify-center">
                  <SoftModal
                    title="Confirm Action"
                    size="sm"
                    footer={
                      <>
                        <SoftButton variant="ghost">Cancel</SoftButton>
                        <SoftButton variant="primary">Confirm</SoftButton>
                      </>
                    }
                  >
                    <p className="text-sm text-gray-600">Are you sure you want to continue?</p>
                  </SoftModal>
                </div>

                <div className="bg-gray-900/5 rounded-3xl p-6 flex items-center justify-center">
                  <SoftModal
                    title="Edit Profile"
                    size="default"
                    footer={
                      <>
                        <SoftButton variant="ghost">Cancel</SoftButton>
                        <SoftButton variant="coral">Save Changes</SoftButton>
                      </>
                    }
                  >
                    <div className="space-y-4">
                      <SoftInput placeholder="Full Name" />
                      <SoftInput placeholder="Email" />
                      <SoftTextarea placeholder="Bio" rows={3} />
                    </div>
                  </SoftModal>
                </div>
              </div>
            </SubSection>

            <SubSection title="Gradient Header Modal">
              <div className="bg-gray-900/5 rounded-3xl p-6 flex items-center justify-center">
                <SoftModal
                  title="Welcome to CRNA Club!"
                  size="lg"
                  gradient="linear-gradient(to bottom right, #FF8C66, #FE90AF, #F97066)"
                  footer={
                    <>
                      <SoftButton variant="ghost">Skip for now</SoftButton>
                      <SoftButton variant="coral">Get Started</SoftButton>
                    </>
                  }
                >
                  <div className="py-2">
                    <p className="text-gray-600 mb-4">
                      Complete your profile to get personalized program recommendations.
                    </p>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-200 to-purple-100 rounded-2xl flex items-center justify-center">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Complete Your Profile</p>
                        <p className="text-xs text-gray-500">Takes about 5 minutes</p>
                      </div>
                    </div>
                  </div>
                </SoftModal>
              </div>
            </SubSection>

            <SubSection title="Milestone Modal (Journey Step)">
              <div className="bg-gray-900/5 rounded-3xl p-8 flex items-center justify-center">
                <div className="relative">
                  <MilestoneModal
                    step={1}
                    title="Understand the Profession"
                    description="Research roles and responsibilities."
                    progress={100}
                    tasks={[
                      { title: 'Watch "Day in the Life of CRNA"', completed: true, dueDate: '2023-11-10' },
                      { title: 'Read AANA Guidelines', completed: false, dueDate: '2023-11-12' },
                    ]}
                  />
                </div>
              </div>
            </SubSection>
          </div>
        </Section>

        {/* ============================================ */}
        {/* FORM COMPONENTS */}
        {/* ============================================ */}
        <Section title="Form Components">
          <SoftCard className="p-6 space-y-8">
            <SubSection title="Checkbox Color Options (Side by Side)">
              <p className="text-sm text-gray-500 mb-4">Compare checkbox colors to pick one for the app</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {['coral', 'purple', 'teal', 'yellow', 'emerald'].map((color) => (
                  <div key={color} className="p-4 bg-gray-50/50 rounded-2xl">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">{color}</p>
                    <div className="space-y-2">
                      <SoftCheckbox
                        checked={true}
                        onChange={() => {}}
                        label="Checked"
                        color={color}
                      />
                      <SoftCheckbox
                        checked={false}
                        onChange={() => {}}
                        label="Unchecked"
                        color={color}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="Brand Yellow Visibility Test">
              <p className="text-sm text-gray-500 mb-4">
                Testing if brand yellow (#f6ff88) is visible enough for primary actions.
                Compare pure yellow vs deeper amber/gold variants.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* On White Background */}
                <div className="p-5 bg-white rounded-2xl border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">On White</p>
                  <div className="space-y-4">
                    {/* Pure Brand Yellow */}
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Brand Yellow (#f6ff88)</p>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-lg bg-[#f6ff88] border border-[#f6ff88] flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-gray-800" />
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-[#f6ff88] flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#f6ff88]" />
                        </div>
                        <input
                          type="text"
                          placeholder="Focus ring"
                          className="px-3 py-1.5 text-sm rounded-xl border-2 border-[#f6ff88] ring-2 ring-[#f6ff88]/30 outline-none w-28"
                        />
                      </div>
                    </div>
                    {/* Deeper Amber */}
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Amber (#FFB800)</p>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-lg bg-[#FFB800] flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-[#FFB800] flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#FFB800]" />
                        </div>
                        <input
                          type="text"
                          placeholder="Focus ring"
                          className="px-3 py-1.5 text-sm rounded-xl border-2 border-[#FFB800] ring-2 ring-[#FFB800]/30 outline-none w-28"
                        />
                      </div>
                    </div>
                    {/* Gold/Orange */}
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Gold (#F59E0B)</p>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-lg bg-[#F59E0B] flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-[#F59E0B] flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                        </div>
                        <input
                          type="text"
                          placeholder="Focus ring"
                          className="px-3 py-1.5 text-sm rounded-xl border-2 border-[#F59E0B] ring-2 ring-[#F59E0B]/30 outline-none w-28"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* On Gray Background */}
                <div className="p-5 bg-gray-100 rounded-2xl">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">On Gray</p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Brand Yellow (#f6ff88)</p>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-lg bg-[#f6ff88] flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-gray-800" />
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-[#f6ff88] bg-white flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#f6ff88]" />
                        </div>
                        <input
                          type="text"
                          placeholder="Focus ring"
                          className="px-3 py-1.5 text-sm rounded-xl border-2 border-[#f6ff88] ring-2 ring-[#f6ff88]/30 outline-none w-28 bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Amber (#FFB800)</p>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-lg bg-[#FFB800] flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-[#FFB800] bg-white flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#FFB800]" />
                        </div>
                        <input
                          type="text"
                          placeholder="Focus ring"
                          className="px-3 py-1.5 text-sm rounded-xl border-2 border-[#FFB800] ring-2 ring-[#FFB800]/30 outline-none w-28 bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Gold (#F59E0B)</p>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-lg bg-[#F59E0B] flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-[#F59E0B] bg-white flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                        </div>
                        <input
                          type="text"
                          placeholder="Focus ring"
                          className="px-3 py-1.5 text-sm rounded-xl border-2 border-[#F59E0B] ring-2 ring-[#F59E0B]/30 outline-none w-28 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200/50">
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-4">Visibility Notes</p>
                  <div className="space-y-3 text-sm text-amber-800">
                    <p><strong>#f6ff88</strong> - Very light, low contrast on white. Works best as background/highlight, not small UI elements.</p>
                    <p><strong>#FFB800</strong> - Better visibility, still feels "yellow". Good middle ground.</p>
                    <p><strong>#F59E0B</strong> - Highest contrast, reads as "gold/amber". Most accessible.</p>
                    <p className="pt-2 border-t border-amber-200 text-xs">
                      <strong>Suggestion:</strong> Use #f6ff88 for large areas (card backgrounds, highlights).
                      Use #FFB800 or #F59E0B for small interactive elements (checkboxes, focus rings).
                    </p>
                  </div>
                </div>
              </div>
            </SubSection>

            <SubSection title="Form Controls on Brand Yellow Background">
              <p className="text-sm text-gray-500 mb-4">
                Which checkbox/radio colors work best on your brand yellow card?
              </p>
              <div
                className="p-6 rounded-3xl"
                style={{ background: 'linear-gradient(to bottom right, #f6ff88, #FFE98A, #f7f2e4)' }}
              >
                <p className="text-xs font-semibold text-amber-800 uppercase tracking-widest mb-4">On Brand Yellow Card</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {/* Coral */}
                  <div className="p-3 bg-white/40 backdrop-blur-sm rounded-2xl">
                    <p className="text-xs font-medium text-amber-900 mb-2">Coral</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#FF8C66] via-[#FE90AF] to-[#F97066] flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs text-amber-900">Checked</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border-2 border-[#FE90AF] bg-white/60 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#FF8C66] to-[#F97066]" />
                        </div>
                        <span className="text-xs text-amber-900">Selected</span>
                      </div>
                    </div>
                  </div>

                  {/* Purple */}
                  <div className="p-3 bg-white/40 backdrop-blur-sm rounded-2xl">
                    <p className="text-xs font-medium text-amber-900 mb-2">Purple</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#A890FE] via-[#D8B5FF] to-[#FCA5F1] flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs text-amber-900">Checked</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border-2 border-[#A890FE] bg-white/60 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#A890FE] to-[#FCA5F1]" />
                        </div>
                        <span className="text-xs text-amber-900">Selected</span>
                      </div>
                    </div>
                  </div>

                  {/* Emerald */}
                  <div className="p-3 bg-white/40 backdrop-blur-sm rounded-2xl">
                    <p className="text-xs font-medium text-amber-900 mb-2">Emerald</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#34D399] via-[#10B981] to-[#059669] flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs text-amber-900">Checked</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border-2 border-[#10B981] bg-white/60 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#34D399] to-[#059669]" />
                        </div>
                        <span className="text-xs text-amber-900">Selected</span>
                      </div>
                    </div>
                  </div>

                  {/* Teal */}
                  <div className="p-3 bg-white/40 backdrop-blur-sm rounded-2xl">
                    <p className="text-xs font-medium text-amber-900 mb-2">Teal</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#6DD5C0] via-[#5EEAD4] to-[#2DD4BF] flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs text-amber-900">Checked</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border-2 border-[#5EEAD4] bg-white/60 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#6DD5C0] to-[#2DD4BF]" />
                        </div>
                        <span className="text-xs text-amber-900">Selected</span>
                      </div>
                    </div>
                  </div>

                  {/* Amber/Brown (matches card) */}
                  <div className="p-3 bg-white/40 backdrop-blur-sm rounded-2xl">
                    <p className="text-xs font-medium text-amber-900 mb-2">Amber</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#F59E0B] via-[#D97706] to-[#92400E] flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs text-amber-900">Checked</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border-2 border-[#D97706] bg-white/60 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#92400E]" />
                        </div>
                        <span className="text-xs text-amber-900">Selected</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="mt-4 p-3 bg-white/50 rounded-2xl">
                  <p className="text-xs text-amber-800">
                    <strong>Best options:</strong> Emerald and Coral pop nicely against yellow.
                    Purple creates complementary contrast. Amber matches but may blend in too much.
                  </p>
                </div>
              </div>
            </SubSection>

            <SubSection title="Radio Button Color Options (Side by Side)">
              <p className="text-sm text-gray-500 mb-4">Compare radio button colors</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {['coral', 'purple', 'teal', 'yellow', 'emerald'].map((color) => (
                  <div key={color} className="p-4 bg-gray-50/50 rounded-2xl">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">{color}</p>
                    <div className="space-y-2">
                      <SoftRadio
                        name={`radio-${color}`}
                        checked={true}
                        onChange={() => {}}
                        label="Selected"
                        color={color}
                      />
                      <SoftRadio
                        name={`radio-${color}-off`}
                        checked={false}
                        onChange={() => {}}
                        label="Unselected"
                        color={color}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="Interactive Test (Coral - Current Default)">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Checkboxes</p>
                  <SoftCheckbox
                    checked={checkbox1}
                    onChange={setCheckbox1}
                    label="Accept terms and conditions"
                    description="By checking this, you agree to our privacy policy."
                    color="coral"
                  />
                  <SoftCheckbox
                    checked={checkbox2}
                    onChange={setCheckbox2}
                    label="Subscribe to newsletter"
                    color="coral"
                  />
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Radio Buttons</p>
                  <SoftRadio
                    name="plan"
                    checked={radioValue === 'option1'}
                    onChange={() => setRadioValue('option1')}
                    label="Free Plan"
                    description="Basic features"
                    color="coral"
                  />
                  <SoftRadio
                    name="plan"
                    checked={radioValue === 'option2'}
                    onChange={() => setRadioValue('option2')}
                    label="Pro Plan"
                    description="Full access"
                    color="coral"
                  />
                </div>
              </div>
            </SubSection>

            <SubSection title="Select Dropdown">
              <div className="max-w-xs">
                <SoftSelect
                  value={selectValue}
                  onChange={setSelectValue}
                  placeholder="Select a program..."
                  options={[
                    { value: 'duke', label: 'Duke University' },
                    { value: 'columbia', label: 'Columbia University' },
                    { value: 'johns-hopkins', label: 'Johns Hopkins' },
                    { value: 'usf', label: 'University of South Florida' },
                  ]}
                />
              </div>
            </SubSection>

            <SubSection title="Search Input">
              <div className="max-w-sm">
                <SoftSearchInput
                  value={searchValue}
                  onChange={setSearchValue}
                  placeholder="Search programs..."
                />
              </div>
            </SubSection>

            <SubSection title="Input & Textarea">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
                <SoftInput placeholder="Email address" />
                <SoftInput placeholder="Password" />
              </div>
              <div className="mt-4 max-w-xl">
                <SoftTextarea placeholder="Write your bio..." rows={3} />
              </div>
            </SubSection>
          </SoftCard>
        </Section>

        {/* ============================================ */}
        {/* MOTION ANIMATIONS (Framer Motion) */}
        {/* ============================================ */}
        <GradientSection title="Motion Animations" gradient="lavender">
          <p className="text-sm text-gray-500 mb-6">
            Apple-style micro-interactions using the Motion library. Click/tap the elements to see animations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Motion Card with Hover Lift */}
            <div className="space-y-3">
              <SubheaderNote>Card Hover Lift</SubheaderNote>
              <motion.div
                className="bg-white rounded-3xl p-6 shadow-soft border border-gray-50 cursor-pointer"
                whileHover={{
                  y: -8,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.10)'
                }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Hover Lift Card</p>
                    <p className="text-sm text-gray-500">Hover to see effect</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">This card lifts up with a smooth shadow transition on hover.</p>
              </motion.div>
            </div>

            {/* Motion Button with Press */}
            <div className="space-y-3">
              <SubheaderNote>Button Press Feedback</SubheaderNote>
              <div className="space-y-3">
                <motion.button
                  className="w-full px-6 py-3 bg-gray-900 text-white font-medium rounded-2xl shadow-soft"
                  whileHover={{ scale: 1.02, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                >
                  Press Me (Primary)
                </motion.button>

                <motion.button
                  className="w-full px-6 py-3 bg-yellow-400 text-gray-900 font-medium rounded-2xl shadow-soft"
                  whileHover={{ scale: 1.02, boxShadow: '0 4px 16px rgba(246, 255, 136, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                >
                  Press Me (Accent)
                </motion.button>

                <motion.button
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-2xl"
                  whileHover={{ backgroundColor: '#e5e7eb' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                >
                  Press Me (Secondary)
                </motion.button>
              </div>
            </div>

            {/* Motion Icon Button */}
            <div className="space-y-3">
              <SubheaderNote>Icon Button Bounce</SubheaderNote>
              <div className="flex gap-3 flex-wrap">
                <motion.button
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-pink-500 text-white flex items-center justify-center shadow-soft"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Heart className="w-5 h-5" />
                </motion.button>

                <motion.button
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-soft"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Star className="w-5 h-5" />
                </motion.button>

                <motion.button
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-white flex items-center justify-center shadow-soft"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Bell className="w-5 h-5" />
                </motion.button>

                <motion.button
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white flex items-center justify-center shadow-soft"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <CheckCircle className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Motion List Stagger */}
            <div className="space-y-3">
              <SubheaderNote>List Stagger Animation</SubheaderNote>
              <MotionListDemo />
            </div>

            {/* Motion Scale on Tap */}
            <div className="space-y-3">
              <SubheaderNote>Floating Action Button</SubheaderNote>
              <div className="flex items-center gap-4">
                <motion.button
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FE90AF] to-[#FF8C8C] text-white flex items-center justify-center shadow-soft-lg"
                  whileHover={{ scale: 1.1, boxShadow: '0 16px 64px rgba(254, 144, 175, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Plus className="w-6 h-6" />
                </motion.button>
                <span className="text-sm text-gray-500">Tap to see spring effect</span>
              </div>
            </div>

            {/* Motion Pulse */}
            <div className="space-y-3">
              <SubheaderNote>Attention Pulse</SubheaderNote>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.span
                  className="w-2 h-2 rounded-full bg-red-500"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                3 items need attention
              </motion.div>
            </div>
          </div>

          {/* Motion Modal Demo */}
          <div className="mt-8">
            <SubheaderNote>Modal Animation</SubheaderNote>
            <MotionModalDemo />
          </div>
        </GradientSection>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200/50 text-center text-sm text-gray-400">
          <p>Component Showcase - Glassmorphism Design System</p>
          <p className="mt-1">Brand Yellow: #f6ff88 | Brand Cream: #f7f2e4 | Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}

export default ComponentShowcasePage;
