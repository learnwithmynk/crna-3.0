/**
 * GlobalSearch Component
 *
 * Command palette that opens with ⌘+K / Ctrl+K
 * Searches across modules, lessons, downloads, schools, and admin pages.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  BookOpen,
  FileText,
  Download,
  GraduationCap,
  MessageSquare,
  Settings,
  Tag,
  Shield,
  Trophy,
  Search,
  ArrowRight,
} from 'lucide-react';
import { useModules } from '@/hooks/useModules';
import { useDownloads } from '@/hooks/useDownloads';

// Static navigation items (always available)
const QUICK_ACTIONS = [
  { name: 'Dashboard', href: '/dashboard', icon: ArrowRight, category: 'navigation' },
  { name: 'My Programs', href: '/my-programs', icon: ArrowRight, category: 'navigation' },
  { name: 'School Database', href: '/schools', icon: GraduationCap, category: 'navigation' },
  { name: 'Learning Library', href: '/learn', icon: BookOpen, category: 'navigation' },
  { name: 'Community Forums', href: '/community/forums', icon: MessageSquare, category: 'navigation' },
  { name: 'Events', href: '/events', icon: ArrowRight, category: 'navigation' },
];

const ADMIN_PAGES = [
  { name: 'Admin Dashboard', href: '/admin', icon: Settings, category: 'admin' },
  { name: 'Modules', href: '/admin/modules', icon: BookOpen, category: 'admin' },
  { name: 'Downloads', href: '/admin/downloads', icon: Download, category: 'admin' },
  { name: 'Categories', href: '/admin/categories', icon: Tag, category: 'admin' },
  { name: 'Entitlements', href: '/admin/entitlements', icon: Shield, category: 'admin' },
  { name: 'Points Config', href: '/admin/points', icon: Trophy, category: 'admin' },
];

export function GlobalSearch({ open, onOpenChange }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Fetch data for searching
  const { modules } = useModules({ adminMode: true });
  const { downloads } = useDownloads();

  // Handle keyboard shortcut
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  // Reset search when closing
  useEffect(() => {
    if (!open) {
      setSearch('');
    }
  }, [open]);

  const handleSelect = useCallback(
    (href) => {
      onOpenChange(false);
      navigate(href);
    },
    [navigate, onOpenChange]
  );

  // Filter modules based on search
  const filteredModules = modules?.filter(
    (m) =>
      m.title?.toLowerCase().includes(search.toLowerCase()) ||
      m.description?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  // Filter downloads based on search
  const filteredDownloads = downloads?.filter(
    (d) =>
      d.title?.toLowerCase().includes(search.toLowerCase()) ||
      d.description?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  // Filter quick actions
  const filteredQuickActions = QUICK_ACTIONS.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Filter admin pages
  const filteredAdminPages = ADMIN_PAGES.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const hasResults =
    filteredModules.length > 0 ||
    filteredDownloads.length > 0 ||
    filteredQuickActions.length > 0 ||
    filteredAdminPages.length > 0;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search modules, downloads, pages..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center py-6">
            <Search className="w-10 h-10 text-gray-300 mb-3" />
            <p className="text-gray-500">No results found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try searching for something else
            </p>
          </div>
        </CommandEmpty>

        {/* Quick Navigation */}
        {filteredQuickActions.length > 0 && (
          <CommandGroup heading="Pages">
            {filteredQuickActions.map((item) => (
              <CommandItem
                key={item.href}
                value={item.name}
                onSelect={() => handleSelect(item.href)}
              >
                <item.icon className="mr-2 h-4 w-4 text-gray-500" />
                <span>{item.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Modules */}
        {filteredModules.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Modules">
              {filteredModules.slice(0, 5).map((module) => (
                <CommandItem
                  key={module.id}
                  value={module.title}
                  onSelect={() => handleSelect(`/learn/${module.slug}`)}
                >
                  <BookOpen className="mr-2 h-4 w-4 text-blue-500" />
                  <div className="flex flex-col">
                    <span>{module.title}</span>
                    {module.description && (
                      <span className="text-xs text-gray-500 truncate max-w-[300px]">
                        {module.description}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
              {filteredModules.length > 5 && (
                <CommandItem
                  value="view-all-modules"
                  onSelect={() => handleSelect('/learn')}
                >
                  <ArrowRight className="mr-2 h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">
                    View all {filteredModules.length} modules...
                  </span>
                </CommandItem>
              )}
            </CommandGroup>
          </>
        )}

        {/* Downloads */}
        {filteredDownloads.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Downloads">
              {filteredDownloads.slice(0, 5).map((download) => (
                <CommandItem
                  key={download.id}
                  value={download.title}
                  onSelect={() => handleSelect(`/admin/downloads/${download.id}`)}
                >
                  <Download className="mr-2 h-4 w-4 text-green-500" />
                  <div className="flex flex-col">
                    <span>{download.title}</span>
                    {download.file_type && (
                      <span className="text-xs text-gray-500">
                        {download.file_type}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Admin Pages */}
        {filteredAdminPages.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Admin">
              {filteredAdminPages.map((item) => (
                <CommandItem
                  key={item.href}
                  value={item.name}
                  onSelect={() => handleSelect(item.href)}
                >
                  <item.icon className="mr-2 h-4 w-4 text-purple-500" />
                  <span>{item.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>

      {/* Footer hint */}
      <div className="border-t px-3 py-2 text-xs text-gray-400 flex items-center justify-between">
        <span>
          Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-600">↵</kbd> to select
        </span>
        <span>
          <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-600">esc</kbd> to close
        </span>
      </div>
    </CommandDialog>
  );
}

export default GlobalSearch;
