/**
 * Header component for The CRNA Club
 * Shows user info, notifications, and mobile menu toggle
 *
 * Design notes:
 * - Clean, minimal header with search, notification bell, and user profile
 * - User profile shows name + role label in ALL CAPS with light gray color
 * - Rounded avatar with soft background color
 * - Bell icon is simple and light gray
 */

import { Menu, Search, User, Settings, CreditCard, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LabelText } from '@/components/ui/label-text';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { NotificationBell } from '@/components/features/community/NotificationBell';

export function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const { user: authUser, signOut } = useAuth();

  // Get user display data
  // Use display_name for header, fall back to first_name then full_name then email
  const user = {
    name: authUser?.user_metadata?.display_name ||
          authUser?.user_metadata?.first_name ||
          authUser?.user_metadata?.full_name ||
          authUser?.email ||
          'User',
    email: authUser?.email || '',
    // Only show role once it's been enriched from the database (role !== undefined)
    // This prevents the flash from default "SRNA Applicant" to actual role
    role: authUser?.role === undefined ? null :
          authUser?.role === 'admin' ? 'Admin' :
          authUser?.role === 'provider' ? 'Provider' :
          'SRNA Applicant',
    avatarUrl: authUser?.user_metadata?.avatar_url || null,
  };

  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Handle navigation to settings sections
  const handleProfileClick = () => {
    navigate('/settings?section=profile');
  };

  const handleSubscriptionClick = () => {
    navigate('/settings?section=subscription');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Mobile logo - centered */}
      <div className="lg:hidden absolute left-1/2 transform -translate-x-1/2">
        <img
          src="/images/logo.png"
          alt="The CRNA Club"
          className="h-7 w-auto"
        />
      </div>

      {/* Desktop search */}
      <div className="hidden lg:flex flex-1 max-w-lg">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-300" />
          <input
            type="text"
            placeholder="Search Pathway..."
            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-full text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Notification bell with dropdown */}
        <NotificationBell />

        {/* Divider */}
        <div className="hidden sm:block w-px h-8 bg-gray-100" />

        {/* User profile dropdown - Desktop */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hidden sm:flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
              {/* User info */}
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                {user.role && (
                  <LabelText variant="primary">
                    {user.role}
                  </LabelText>
                )}
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-semibold text-orange-600">
                    {getInitials(user.name)}
                  </span>
                )}
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {/* User info header */}
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Menu items */}
            <DropdownMenuItem onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSubscriptionClick}>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Subscription</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="sm:hidden w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-xs font-semibold text-orange-600">
                  {getInitials(user.name)}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {/* User info header */}
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Menu items */}
            <DropdownMenuItem onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSubscriptionClick}>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Subscription</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
