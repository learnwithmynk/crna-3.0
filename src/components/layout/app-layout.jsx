/**
 * AppLayout component for The CRNA Club
 * Main layout wrapper with sidebar, header, and content area
 */

import { useState, useEffect, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { MobileNav } from './mobile-nav';
import { GlobalSearch } from '@/components/features/search/GlobalSearch';
import { PreviewModeBanner } from '@/components/access/PreviewModeBanner';

export function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  // Debug navigation
  useEffect(() => {
    console.log('[AppLayout] Route changed to:', location.pathname);
  }, [location.pathname]);

  // Force scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Preview Mode Banner (shown when admin is in preview mode) */}
      <PreviewModeBanner />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="lg:ml-64">
        {/* Header */}
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Page content */}
        <main>
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNav />

      {/* Mobile menu overlay (for future sheet/drawer implementation) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          {/* Mobile menu content would go here */}
          <div
            className="w-64 h-full bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Reuse sidebar content */}
          </div>
        </div>
      )}

      {/* Global Search Command Palette */}
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
