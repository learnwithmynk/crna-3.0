/**
 * Sidebar component for The CRNA Club
 * Desktop sidebar navigation - hidden on mobile (use MobileNav instead)
 */

import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/ui/label-text';
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
  Store,
  Flag,
  UserX,
} from 'lucide-react';

const mainNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/my-programs', icon: Target, label: 'My Programs' },
  { to: '/trackers', icon: ClipboardList, label: 'My Trackers' },
  { to: '/my-stats', icon: User, label: 'My Stats' },
];

const discoverNavItems = [
  { to: '/schools', icon: GraduationCap, label: 'School Database' },
  { to: '/prerequisites', icon: BookOpen, label: 'Prerequisites' },
  { to: '/learn', icon: FileText, label: 'Learning' },
  { to: '/events', icon: Calendar, label: 'Events' },
];

const communityNavItems = [
  { to: '/community/forums', icon: MessageSquare, label: 'Forums' },
  { to: '/community/groups', icon: Users, label: 'Groups' },
  { to: '/marketplace', icon: ShoppingBag, label: 'Marketplace' },
];

const toolsNavItems = [
  { to: '/tools', icon: Wrench, label: 'Tools' },
];

const adminNavItems = [
  { to: '/admin', icon: Shield, label: 'Admin Dashboard' },
  { to: '/admin/marketplace', icon: Store, label: 'Marketplace' },
];

const adminCommunityNavItems = [
  { to: '/admin/community/reports', icon: Flag, label: 'Reports', badge: 3 }, // Mock count for now
  { to: '/admin/community/suspensions', icon: UserX, label: 'Suspensions' },
];

function NavItem({ to, icon: Icon, label, badge }) {
  return (
    <NavLink
      to={to}
      onClick={() => console.log('[Sidebar] NavLink clicked:', to)}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl',
          'transition-colors min-h-[44px]',
          isActive
            ? 'bg-amber-100 text-gray-900 font-semibold'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        )
      }
    >
      <Icon className="w-5 h-5" />
      <span className="flex-1">{label}</span>
      {badge && badge > 0 && (
        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-white bg-red-500 rounded-full">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

function NavSection({ title, items }) {
  return (
    <div className="space-y-1">
      {title && (
        <SectionHeader className="px-3 mb-2">
          {title}
        </SectionHeader>
      )}
      {items.map((item) => (
        <NavItem key={item.to} {...item} />
      ))}
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-[60]">
      {/* Logo */}
      <div className="p-4 border-b border-gray-100 flex justify-center">
        <img
          src="/images/logo.png"
          alt="The CRNA Club"
          className="h-10 w-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
        <NavSection items={mainNavItems} />
        <NavSection title="Discover" items={discoverNavItems} />
        <NavSection title="Community" items={communityNavItems} />
        <NavSection title="Tools" items={toolsNavItems} />
        <NavSection title="Admin" items={adminNavItems} />
        <NavSection title="Community Moderation" items={adminCommunityNavItems} />
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-100">
        <NavItem to="/settings" icon={Settings} label="Settings" />
      </div>
    </aside>
  );
}
