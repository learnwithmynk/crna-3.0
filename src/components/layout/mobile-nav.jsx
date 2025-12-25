/**
 * MobileNav component for The CRNA Club
 * Bottom navigation bar for mobile devices
 */

import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Target,
  BookOpen,
  MessageSquare,
  Wrench,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/my-programs', icon: Target, label: 'Programs' },
  { to: '/learning', icon: BookOpen, label: 'Learn' },
  { to: '/community/forums', icon: MessageSquare, label: 'Community' },
  { to: '/tools', icon: Wrench, label: 'Tools' },
];

export function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t safe-area-bottom z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center min-w-[64px] min-h-[44px] p-2',
                isActive ? 'text-primary' : 'text-gray-500'
              )
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs mt-1">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
