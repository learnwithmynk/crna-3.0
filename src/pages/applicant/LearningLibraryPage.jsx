/**
 * LearningLibraryPage
 *
 * Main page for browsing learning modules in the custom LMS.
 * Features:
 * - Grid of module cards (4 cols desktop, 2 tablet, 1 mobile)
 * - Search modules by title/description
 * - Sort: Alphabetical, Recently Added
 * - Filter by category
 * - Progress tracking per module
 * - Access control (lock icons for restricted content)
 *
 * Route: /learn
 */

import { useState, useMemo, useEffect } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpDown, BookOpen, Clock, Sparkles } from 'lucide-react';
import { InlineSearch } from '@/components/features/search/InlineSearch';
import { ModuleGrid } from '@/components/features/learning/ModuleGrid';
import { useModules } from '@/hooks/useModules';
import { useCategories } from '@/hooks/useCategories';
import { useRecentlyAccessedLessons } from '@/hooks/useLessonProgress';
import { useAuth } from '@/hooks/useAuth';

export function LearningLibraryPage() {
  const { user } = useAuth();

  // Data fetching
  const { modules, isLoading: modulesLoading, error: modulesError } = useModules();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { lessons: recentLessons } = useRecentlyAccessedLessons(5);

  // Filter/sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('order'); // 'order', 'alphabetical', 'recent'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('all'); // 'all', 'in-progress', 'completed'

  // Mock progress data (will be replaced with real data from useLessonProgress)
  // TODO: Replace with actual Supabase query for user progress
  const [progressMap] = useState(() => {
    const map = new Map();
    // Mock some progress for demo
    return map;
  });

  // Access map (for checking entitlements)
  const accessMap = useMemo(() => {
    const map = new Map();
    const userEntitlements = user?.entitlements || user?.user_metadata?.entitlements || [];

    modules.forEach((module) => {
      const requiredEntitlements = module.accessible_via || [];

      // If no entitlements required, everyone has access
      const hasAccess =
        requiredEntitlements.length === 0 ||
        requiredEntitlements.some((e) => userEntitlements.includes(e));

      map.set(module.id, { hasAccess });
    });

    return map;
  }, [modules, user]);

  // Last access map (for showing "Last accessed X days ago")
  const lastAccessMap = useMemo(() => {
    const map = new Map();

    // Build map from recent lessons
    recentLessons.forEach((lesson) => {
      if (lesson.moduleSlug) {
        // Find the module by matching the module title from the lesson
        const module = modules.find(
          (m) => m.slug === lesson.moduleSlug || m.title === lesson.moduleTitle
        );
        if (module && !map.has(module.id)) {
          map.set(module.id, lesson.lastAccessedAt);
        }
      }
    });

    return map;
  }, [recentLessons, modules]);

  // Filter and sort modules
  const filteredModules = useMemo(() => {
    let result = [...modules];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          (m.description && m.description.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(
        (m) => m.category_slugs && m.category_slugs.includes(selectedCategory)
      );
    }

    // View mode filter
    if (viewMode === 'in-progress') {
      result = result.filter((m) => {
        const progress = progressMap.get(m.id);
        return progress && progress.progressPercent > 0 && progress.progressPercent < 100;
      });
    } else if (viewMode === 'completed') {
      result = result.filter((m) => {
        const progress = progressMap.get(m.id);
        return progress && progress.progressPercent >= 100;
      });
    }

    // Sort
    switch (sortBy) {
      case 'alphabetical':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'recent':
        // Sort by last accessed (modules with recent access first)
        result.sort((a, b) => {
          const aAccess = lastAccessMap.get(a.id);
          const bAccess = lastAccessMap.get(b.id);
          if (!aAccess && !bAccess) return 0;
          if (!aAccess) return 1;
          if (!bAccess) return -1;
          return new Date(bAccess) - new Date(aAccess);
        });
        break;
      case 'order':
      default:
        // Keep original order (by order_index from database)
        break;
    }

    return result;
  }, [modules, searchQuery, selectedCategory, viewMode, sortBy, progressMap, lastAccessMap]);

  // Stats for header
  const stats = useMemo(() => {
    let inProgress = 0;
    let completed = 0;

    modules.forEach((m) => {
      const progress = progressMap.get(m.id);
      if (progress) {
        if (progress.progressPercent >= 100) {
          completed++;
        } else if (progress.progressPercent > 0) {
          inProgress++;
        }
      }
    });

    return { total: modules.length, inProgress, completed };
  }, [modules, progressMap]);

  // Check if any filters are active
  const isFiltered = searchQuery || selectedCategory !== 'all' || viewMode !== 'all';

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50/80 to-pink-50/25">
      <PageWrapper className="px-8 md:px-16 lg:px-24 xl:px-32 pt-8 md:pt-12 lg:pt-16 pb-8 bg-transparent relative z-10">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Learning Library</h1>
          <p className="text-gray-600 mt-1">{stats.total} modules available</p>
        </div>

      {/* Continue Learning Banner (if user has recently accessed lessons) */}
      {recentLessons.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-primary/10 rounded-xl p-4 mb-6 border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-full">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">Continue where you left off</p>
              <p className="text-sm text-gray-600 truncate">
                {recentLessons[0]?.title} in {recentLessons[0]?.moduleTitle}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => {
                const lesson = recentLessons[0];
                if (lesson?.moduleSlug && lesson?.slug) {
                  window.location.href = `/learn/${lesson.moduleSlug}/${lesson.slug}`;
                }
              }}
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1">
          <InlineSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search modules..."
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Tabs */}
          <Tabs value={viewMode} onValueChange={setViewMode}>
            <TabsList>
              <TabsTrigger value="all" className="text-xs sm:text-sm">
                All
                <Badge variant="secondary" className="ml-1.5 text-xs">
                  {stats.total}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="in-progress" className="text-xs sm:text-sm">
                <Clock className="w-3.5 h-3.5 mr-1 hidden sm:inline" />
                In Progress
                {stats.inProgress > 0 && (
                  <Badge variant="secondary" className="ml-1.5 text-xs">
                    {stats.inProgress}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs sm:text-sm">
                Completed
                {stats.completed > 0 && (
                  <Badge variant="success" className="ml-1.5 text-xs">
                    {stats.completed}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Category Filter */}
          {categories.length > 0 && (
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[140px]">
                <BookOpen className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="order">Default Order</SelectItem>
              <SelectItem value="alphabetical">A to Z</SelectItem>
              <SelectItem value="recent">Recently Accessed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error state */}
      {modulesError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-800">Failed to load modules: {modulesError}</p>
        </div>
      )}

      {/* Module Grid */}
      <ModuleGrid
        modules={filteredModules}
        progressMap={progressMap}
        accessMap={accessMap}
        lastAccessMap={lastAccessMap}
        isLoading={modulesLoading}
        isFiltered={isFiltered}
        emptyMessage={
          viewMode === 'in-progress'
            ? "You haven't started any modules yet. Browse all modules to begin learning!"
            : viewMode === 'completed'
              ? "You haven't completed any modules yet. Keep learning!"
              : undefined
        }
      />

      {/* Results count (when filtered) */}
      {isFiltered && filteredModules.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing {filteredModules.length} of {modules.length} modules
        </div>
      )}
      </PageWrapper>
    </div>
  );
}

export default LearningLibraryPage;
