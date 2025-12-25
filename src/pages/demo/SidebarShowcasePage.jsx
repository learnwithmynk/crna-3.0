/**
 * Sidebar Showcase Demo Page
 *
 * Demonstrates various sidebar navigation patterns:
 * 1. Nested/Collapsible (Notion-style) - RECOMMENDED
 * 2. Double/Split Sidebar (ClickUp-style)
 * 3. Pill/Floating Sidebar (Modern minimalist)
 * 4. Contextual Sidebar (Linear-style with workspace switcher)
 *
 * Each pattern shows how CRNA Club navigation could be reorganized
 * with nested programs under My Programs and tools expansion.
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  Target,
  ClipboardList,
  User,
  GraduationCap,
  BookOpen,
  Calendar,
  MessageSquare,
  Users,
  ShoppingBag,
  Settings,
  FileText,
  Wrench,
  Shield,
  ChevronDown,
  ChevronRight,
  Calculator,
  FileSearch,
  CalendarClock,
  Mic,
  HelpCircle,
  Home,
  Search,
  Bell,
  Sparkles,
  FolderOpen,
  Plus,
  MoreHorizontal,
  Building2,
  Star,
  Clock,
  Check,
  Circle,
  Zap,
  TrendingUp,
  Activity,
  Heart,
} from 'lucide-react';

// Mock target programs for demo
const mockTargetPrograms = [
  { id: 1, name: 'Duke University', status: 'applying', logo: '🏫' },
  { id: 2, name: 'University of Alabama', status: 'researching', logo: '🎓' },
  { id: 3, name: 'Rush University', status: 'applying', logo: '🏛️' },
  { id: 4, name: 'Emory University', status: 'interested', logo: '🏫' },
];

// Mock tools
const mockTools = [
  { id: 'gpa', name: 'GPA Calculator', icon: Calculator, badge: null },
  { id: 'transcript', name: 'Transcript Analyzer', icon: FileSearch, badge: 'New' },
  { id: 'timeline', name: 'Timeline Generator', icon: CalendarClock, badge: null },
  { id: 'interview', name: 'Mock Interview', icon: Mic, badge: 'Beta' },
  { id: 'questions', name: 'Question Bank', icon: HelpCircle, badge: null },
  { id: 'docs', name: 'My Documents', icon: FolderOpen, badge: null },
];

// Mock trackers
const mockTrackers = [
  { id: 'clinical', name: 'Clinical Hours', icon: Activity, count: 47 },
  { id: 'shadow', name: 'Shadow Days', icon: Users, count: 12 },
  { id: 'eq', name: 'EQ Reflections', icon: Heart, count: 8 },
  { id: 'events', name: 'Events', icon: Calendar, count: 2 },
];

// ============================================================================
// PATTERN 1: Nested/Collapsible Sidebar (Notion-style) - RECOMMENDED
// ============================================================================
function NestedCollapsibleSidebar() {
  const [openSections, setOpenSections] = useState({
    programs: true,
    trackers: false,
    tools: false,
    admin: false,
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="w-64 h-[600px] bg-white border border-gray-200 rounded-xl shadow-lg flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">
            THE <span className="bg-yellow-200 px-1">CRNA</span> CLUB
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {/* Dashboard - No nesting */}
        <NavItem icon={LayoutDashboard} label="Dashboard" active />

        {/* My Programs - Collapsible with target programs */}
        <CollapsibleNavItem
          icon={Target}
          label="My Programs"
          badge={mockTargetPrograms.length}
          isOpen={openSections.programs}
          onToggle={() => toggleSection('programs')}
        >
          {mockTargetPrograms.map(program => (
            <NestedNavItem
              key={program.id}
              label={program.name}
              avatar={program.logo}
              status={program.status}
            />
          ))}
          <button className="flex items-center gap-2 w-full pl-10 pr-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Program</span>
          </button>
        </CollapsibleNavItem>

        {/* My Trackers - Collapsible */}
        <CollapsibleNavItem
          icon={ClipboardList}
          label="My Trackers"
          isOpen={openSections.trackers}
          onToggle={() => toggleSection('trackers')}
        >
          {mockTrackers.map(tracker => (
            <NestedNavItem
              key={tracker.id}
              label={tracker.name}
              icon={tracker.icon}
              count={tracker.count}
            />
          ))}
        </CollapsibleNavItem>

        {/* My Stats - No nesting */}
        <NavItem icon={User} label="My Stats" />

        <Separator className="my-3" />
        <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Discover
        </div>

        <NavItem icon={GraduationCap} label="School Database" badge="140" />
        <NavItem icon={BookOpen} label="Prerequisites" />
        <NavItem icon={FileText} label="Learning" />
        <NavItem icon={Calendar} label="Events" badge="3" />

        <Separator className="my-3" />
        <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Community
        </div>

        <NavItem icon={MessageSquare} label="Forums" badge="5" />
        <NavItem icon={Users} label="Groups" />
        <NavItem icon={ShoppingBag} label="Marketplace" />

        <Separator className="my-3" />

        {/* Tools - Collapsible */}
        <CollapsibleNavItem
          icon={Wrench}
          label="Tools"
          isOpen={openSections.tools}
          onToggle={() => toggleSection('tools')}
        >
          {mockTools.map(tool => (
            <NestedNavItem
              key={tool.id}
              label={tool.name}
              icon={tool.icon}
              badge={tool.badge}
            />
          ))}
        </CollapsibleNavItem>
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-100">
        <NavItem icon={Settings} label="Settings" />
      </div>
    </div>
  );
}

// Helper components for nested sidebar
function NavItem({ icon: Icon, label, active, badge }) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer',
        active
          ? 'bg-amber-100 text-gray-900'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
}

function CollapsibleNavItem({ icon: Icon, label, badge, isOpen, onToggle, children }) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="flex-1 text-left truncate">{label}</span>
        {badge && (
          <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
            {badge}
          </span>
        )}
        <ChevronDown className={cn(
          "w-4 h-4 text-gray-400 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-1 space-y-0.5">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

function NestedNavItem({ label, avatar, icon: Icon, status, badge, count }) {
  return (
    <div className="flex items-center gap-2 pl-10 pr-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors cursor-pointer">
      {avatar && <span className="text-base">{avatar}</span>}
      {Icon && <Icon className="w-4 h-4 text-gray-400" />}
      <span className="flex-1 truncate">{label}</span>
      {status && (
        <span className={cn(
          "text-xs px-1.5 py-0.5 rounded-full",
          status === 'applying' && "bg-green-100 text-green-700",
          status === 'researching' && "bg-blue-100 text-blue-700",
          status === 'interested' && "bg-gray-100 text-gray-600"
        )}>
          {status}
        </span>
      )}
      {badge && (
        <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
          {badge}
        </span>
      )}
      {count !== undefined && (
        <span className="text-xs text-gray-400">{count}</span>
      )}
    </div>
  );
}

// ============================================================================
// PATTERN 2: Double/Split Sidebar (ClickUp-style)
// ============================================================================
function DoubleSidebar() {
  const [activeSection, setActiveSection] = useState('programs');
  const [activeItem, setActiveItem] = useState(null);

  const sections = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'programs', icon: Target, label: 'Programs', badge: 4 },
    { id: 'trackers', icon: ClipboardList, label: 'Trackers' },
    { id: 'discover', icon: Search, label: 'Discover' },
    { id: 'community', icon: MessageSquare, label: 'Community', badge: 5 },
    { id: 'tools', icon: Wrench, label: 'Tools' },
    { id: 'admin', icon: Shield, label: 'Admin' },
  ];

  const getSectionContent = () => {
    switch (activeSection) {
      case 'programs':
        return (
          <>
            <div className="p-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">My Programs</h3>
              <p className="text-xs text-gray-500 mt-0.5">4 target schools</p>
            </div>
            <div className="p-2 space-y-1">
              {mockTargetPrograms.map(program => (
                <div
                  key={program.id}
                  onClick={() => setActiveItem(program.id)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors",
                    activeItem === program.id
                      ? "bg-amber-100 text-gray-900"
                      : "hover:bg-gray-50"
                  )}
                >
                  <span className="text-lg">{program.logo}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{program.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{program.status}</div>
                  </div>
                </div>
              ))}
              <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg">
                <Plus className="w-4 h-4" />
                Add Program
              </button>
            </div>
          </>
        );
      case 'tools':
        return (
          <>
            <div className="p-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Tools</h3>
              <p className="text-xs text-gray-500 mt-0.5">Calculators & utilities</p>
            </div>
            <div className="p-2 space-y-1">
              {mockTools.map(tool => (
                <div
                  key={tool.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <tool.icon className="w-5 h-5 text-gray-400" />
                  <span className="flex-1 text-sm">{tool.name}</span>
                  {tool.badge && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      {tool.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </>
        );
      case 'trackers':
        return (
          <>
            <div className="p-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">My Trackers</h3>
              <p className="text-xs text-gray-500 mt-0.5">Track your progress</p>
            </div>
            <div className="p-2 space-y-1">
              {mockTrackers.map(tracker => (
                <div
                  key={tracker.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <tracker.icon className="w-5 h-5 text-gray-400" />
                  <span className="flex-1 text-sm">{tracker.name}</span>
                  <span className="text-xs text-gray-400">{tracker.count}</span>
                </div>
              ))}
            </div>
          </>
        );
      default:
        return (
          <div className="p-4 text-center text-gray-500 text-sm">
            Select a section from the rail
          </div>
        );
    }
  };

  return (
    <TooltipProvider>
      <div className="flex h-[600px] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        {/* Primary Rail */}
        <div className="w-16 bg-gradient-to-b from-purple-600 to-purple-800 flex flex-col items-center py-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-sm">CC</span>
          </div>

          <div className="flex-1 space-y-2">
            {sections.map(section => (
              <Tooltip key={section.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "relative w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                      activeSection === section.id
                        ? "bg-white text-purple-600 shadow-md"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <section.icon className="w-5 h-5" />
                    {section.badge && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {section.badge}
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {section.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="w-10 h-10 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all">
                <Settings className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </div>

        {/* Secondary Panel */}
        <div className="w-56 border-r border-gray-200 bg-gray-50/50 flex flex-col">
          {getSectionContent()}
        </div>

        {/* Main Content Preview */}
        <div className="flex-1 bg-white p-6">
          <div className="text-sm text-gray-400">Main content area</div>
        </div>
      </div>
    </TooltipProvider>
  );
}

// ============================================================================
// PATTERN 3: Pill/Floating Sidebar (Modern minimalist)
// ============================================================================
function PillFloatingSidebar() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [expandedTool, setExpandedTool] = useState(null);

  const mainItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'programs', icon: Target, label: 'Programs' },
    { id: 'trackers', icon: Activity, label: 'Trackers' },
    { id: 'stats', icon: TrendingUp, label: 'Stats' },
  ];

  return (
    <div className="relative w-80 h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
      {/* Floating pill sidebar */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-xl p-2 space-y-1">
        {mainItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
              activeItem === item.id
                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            )}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}

        <div className="py-2">
          <div className="w-8 h-0.5 bg-gray-100 mx-auto rounded-full" />
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="w-12 h-12 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all">
                <Search className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Search</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="w-12 h-12 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Notifications</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="w-12 h-12 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all">
                <Settings className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Preview of selected content */}
      <div className="ml-24 p-6 h-full flex flex-col">
        <div className="text-lg font-semibold text-gray-900 mb-4">
          {mainItems.find(i => i.id === activeItem)?.label}
        </div>

        {activeItem === 'programs' && (
          <div className="space-y-2">
            {mockTargetPrograms.map(program => (
              <div key={program.id} className="bg-white p-3 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{program.logo}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{program.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{program.status}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// PATTERN 4: Linear-style with Workspace Switcher
// ============================================================================
function LinearStyleSidebar() {
  const [activeView, setActiveView] = useState('inbox');
  const [favorites, setFavorites] = useState(['duke', 'rush']);

  return (
    <div className="w-64 h-[600px] bg-white border border-gray-200 rounded-xl shadow-lg flex flex-col overflow-hidden">
      {/* Workspace header */}
      <div className="p-3 border-b border-gray-100">
        <button className="flex items-center gap-2 w-full px-2 py-1.5 hover:bg-gray-50 rounded-lg transition-colors">
          <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-bold">CC</span>
          </div>
          <span className="font-semibold text-sm flex-1 text-left">The CRNA Club</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Quick actions */}
      <div className="px-3 py-2 space-y-0.5">
        <QuickNavItem icon={Search} label="Search" shortcut="/" />
        <QuickNavItem
          icon={Bell}
          label="Inbox"
          badge={3}
          active={activeView === 'inbox'}
          onClick={() => setActiveView('inbox')}
        />
        <QuickNavItem icon={Sparkles} label="AI Assistant" badge="New" />
      </div>

      <Separator className="my-1" />

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {/* Your Work */}
        <div>
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-xs font-semibold text-gray-400 uppercase">Your Work</span>
          </div>
          <div className="space-y-0.5">
            <LinearNavItem icon={LayoutDashboard} label="Dashboard" />
            <LinearNavItem icon={User} label="My Stats" />
            <LinearNavItem icon={ClipboardList} label="My Trackers" />
          </div>
        </div>

        {/* Target Programs - with favorites */}
        <div>
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-xs font-semibold text-gray-400 uppercase">Target Programs</span>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Plus className="w-3 h-3 text-gray-400" />
            </button>
          </div>
          <div className="space-y-0.5">
            {mockTargetPrograms.map(program => (
              <div
                key={program.id}
                className="group flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <span className="text-sm">{program.logo}</span>
                <span className="text-sm flex-1 truncate">{program.name}</span>
                <button
                  className={cn(
                    "opacity-0 group-hover:opacity-100 transition-opacity",
                    favorites.includes(program.id.toString()) && "opacity-100"
                  )}
                >
                  <Star className={cn(
                    "w-3.5 h-3.5",
                    favorites.includes(program.id.toString())
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-300"
                  )} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Discover */}
        <div>
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-xs font-semibold text-gray-400 uppercase">Discover</span>
          </div>
          <div className="space-y-0.5">
            <LinearNavItem icon={GraduationCap} label="Schools" badge="140" />
            <LinearNavItem icon={BookOpen} label="Prerequisites" />
            <LinearNavItem icon={Calendar} label="Events" badge="3" />
            <LinearNavItem icon={FileText} label="Learning" />
          </div>
        </div>

        {/* Community */}
        <div>
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-xs font-semibold text-gray-400 uppercase">Community</span>
          </div>
          <div className="space-y-0.5">
            <LinearNavItem icon={MessageSquare} label="Forums" badge="5" />
            <LinearNavItem icon={Users} label="Groups" />
            <LinearNavItem icon={ShoppingBag} label="Marketplace" />
          </div>
        </div>

        {/* Tools - Collapsible section */}
        <div>
          <Collapsible defaultOpen={false}>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-2 mb-1 group">
              <span className="text-xs font-semibold text-gray-400 uppercase">Tools</span>
              <ChevronRight className="w-3 h-3 text-gray-400 transition-transform group-data-[state=open]:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-0.5">
              {mockTools.map(tool => (
                <LinearNavItem
                  key={tool.id}
                  icon={tool.icon}
                  label={tool.name}
                  badge={tool.badge}
                />
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="w-7 h-7 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">SJ</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">Sarah Johnson</div>
            <div className="text-xs text-gray-500 truncate">sarah@example.com</div>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

function QuickNavItem({ icon: Icon, label, shortcut, badge, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm transition-colors",
        active ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="flex-1 text-left">{label}</span>
      {shortcut && (
        <kbd className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
          {shortcut}
        </kbd>
      )}
      {badge && (
        <span className={cn(
          "text-xs px-1.5 py-0.5 rounded-full",
          typeof badge === 'number' ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"
        )}>
          {badge}
        </span>
      )}
    </button>
  );
}

function LinearNavItem({ icon: Icon, label, badge, active }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer transition-colors",
        active ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
      )}
    >
      <Icon className="w-4 h-4 text-gray-400" />
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
          {badge}
        </span>
      )}
    </div>
  );
}

// ============================================================================
// Main Showcase Component
// ============================================================================
export default function SidebarShowcasePage() {
  const [selectedPattern, setSelectedPattern] = useState('nested');

  const patterns = [
    {
      id: 'nested',
      name: 'Nested Collapsible',
      tag: 'RECOMMENDED',
      tagColor: 'bg-green-100 text-green-700',
      description: 'Notion-style with expandable sections. Best for your use case - shows programs and tools nested.',
    },
    {
      id: 'double',
      name: 'Double/Split',
      tag: 'Complex',
      tagColor: 'bg-orange-100 text-orange-700',
      description: 'ClickUp-style with icon rail + panel. Great for apps with many distinct workspaces.',
    },
    {
      id: 'pill',
      name: 'Pill/Floating',
      tag: 'Modern',
      tagColor: 'bg-purple-100 text-purple-700',
      description: 'Ultra-minimal floating nav. Best for apps with few top-level sections.',
    },
    {
      id: 'linear',
      name: 'Linear-style',
      tag: 'Polished',
      tagColor: 'bg-blue-100 text-blue-700',
      description: 'Workspace switcher + favorites + collapsible sections. Very professional feel.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sidebar Navigation Patterns
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Exploring different sidebar designs for The CRNA Club. Click each pattern to see how it handles
            nested target programs, tools, and other navigation needs.
          </p>
        </div>

        {/* Pattern selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {patterns.map(pattern => (
            <button
              key={pattern.id}
              onClick={() => setSelectedPattern(pattern.id)}
              className={cn(
                "p-4 rounded-xl text-left transition-all border-2",
                selectedPattern === pattern.id
                  ? "border-gray-900 bg-white shadow-lg"
                  : "border-transparent bg-white/50 hover:bg-white hover:shadow-md"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-gray-900">{pattern.name}</span>
                <span className={cn("text-xs px-2 py-0.5 rounded-full", pattern.tagColor)}>
                  {pattern.tag}
                </span>
              </div>
              <p className="text-sm text-gray-600">{pattern.description}</p>
            </button>
          ))}
        </div>

        {/* Sidebar preview */}
        <div className="flex justify-center items-start gap-8">
          {selectedPattern === 'nested' && <NestedCollapsibleSidebar />}
          {selectedPattern === 'double' && <DoubleSidebar />}
          {selectedPattern === 'pill' && <PillFloatingSidebar />}
          {selectedPattern === 'linear' && <LinearStyleSidebar />}

          {/* Side notes */}
          <div className="w-80 bg-white rounded-xl p-6 shadow-lg">
            <h3 className="font-semibold text-gray-900 mb-4">Pattern Details</h3>

            {selectedPattern === 'nested' && (
              <div className="space-y-4 text-sm">
                <div>
                  <div className="font-medium text-green-700 mb-1">Why Recommended</div>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Perfect for nesting programs under "My Programs"</li>
                    <li>• Tools expand to show all 6+ individual tools</li>
                    <li>• Familiar pattern (Notion, Linear)</li>
                    <li>• Low implementation complexity</li>
                    <li>• Works great on mobile</li>
                  </ul>
                </div>
                <div>
                  <div className="font-medium text-gray-700 mb-1">Key Features</div>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Collapsible sections with chevron toggle</li>
                    <li>• Status badges on nested programs</li>
                    <li>• "Add Program" inline action</li>
                    <li>• Smooth expand/collapse animations</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedPattern === 'double' && (
              <div className="space-y-4 text-sm">
                <div>
                  <div className="font-medium text-orange-700 mb-1">Pros</div>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Maximum space efficiency</li>
                    <li>• Clear section separation</li>
                    <li>• Scales to many items</li>
                    <li>• Modern, professional look</li>
                  </ul>
                </div>
                <div>
                  <div className="font-medium text-orange-700 mb-1">Cons</div>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Higher cognitive load</li>
                    <li>• More clicks to navigate</li>
                    <li>• Complex to implement</li>
                    <li>• May be overkill for this app</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedPattern === 'pill' && (
              <div className="space-y-4 text-sm">
                <div>
                  <div className="font-medium text-purple-700 mb-1">Best For</div>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Apps with 4-5 main sections</li>
                    <li>• Content-focused layouts</li>
                    <li>• Mobile-first design</li>
                    <li>• Minimalist aesthetic</li>
                  </ul>
                </div>
                <div>
                  <div className="font-medium text-gray-700 mb-1">Considerations</div>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Limited to icon-only nav</li>
                    <li>• Requires tooltips for labels</li>
                    <li>• Doesn't handle deep nesting</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedPattern === 'linear' && (
              <div className="space-y-4 text-sm">
                <div>
                  <div className="font-medium text-blue-700 mb-1">Key Features</div>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Workspace switcher header</li>
                    <li>• Favorites with star toggle</li>
                    <li>• Inline search with shortcut</li>
                    <li>• AI assistant quick access</li>
                    <li>• User profile in footer</li>
                  </ul>
                </div>
                <div>
                  <div className="font-medium text-gray-700 mb-1">Good For</div>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Power users who want shortcuts</li>
                    <li>• Apps with many programs to track</li>
                    <li>• SaaS-like professional feel</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Implementation notes */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <h3 className="font-semibold text-gray-900 mb-4">Implementation Notes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <div className="font-medium text-gray-700 mb-2">Already Have</div>
              <ul className="text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Radix Collapsible primitive
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Badge component
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Tooltip component
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  All Lucide icons
                </li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-gray-700 mb-2">Would Need</div>
              <ul className="text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <Circle className="w-4 h-4 text-gray-300" />
                  CollapsibleNavSection wrapper component
                </li>
                <li className="flex items-center gap-2">
                  <Circle className="w-4 h-4 text-gray-300" />
                  localStorage for open/close state persistence
                </li>
                <li className="flex items-center gap-2">
                  <Circle className="w-4 h-4 text-gray-300" />
                  School logo avatars (or emoji fallback)
                </li>
                <li className="flex items-center gap-2">
                  <Circle className="w-4 h-4 text-gray-300" />
                  Target programs data hook
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
