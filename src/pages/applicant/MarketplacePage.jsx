/**
 * MarketplacePage
 *
 * Main browse page for the mentor marketplace.
 * Features hero section, search, filters, and mentor grid.
 */

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Users, Star, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { MentorCard } from '@/components/features/marketplace/MentorCard';
import { MarketplaceFilters } from '@/components/features/marketplace/MarketplaceFilters';
import { useProviders, useSavedProviders } from '@/hooks/useProviders';
import { useServices } from '@/hooks/useServices';

/**
 * Hero section with search
 */
function MarketplaceHero({ searchQuery, onSearchChange }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50 p-6 md:p-10 mb-6">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-200/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Find Your <span className="highlight-marker">Perfect Mentor</span>
        </h1>
        <p className="text-gray-600 mb-6 max-w-xl">
          Connect with current SRNAs for mock interviews, essay reviews, and personalized coaching.
          Find someone who gets your journey.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name, school, or specialty..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12 bg-white border-gray-200 shadow-sm"
          />
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-4 mt-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-purple-500" />
            <span><strong>50+</strong> mentors</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star className="w-4 h-4 text-yellow-500" />
            <span><strong>4.9</strong> avg rating</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-green-500" />
            <span><strong>24h</strong> avg response</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Loading skeleton for mentor cards
 */
function MentorCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-start gap-3 mb-3">
        <Skeleton className="w-14 h-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-10 w-full mb-3" />
      <div className="flex gap-2 mb-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

/**
 * Active filters display
 */
function ActiveFilters({ filters, onRemove, onClear }) {
  const activeFilters = [];

  if (filters.serviceTypes?.length > 0) {
    const labels = {
      mock_interview: 'Mock Interview',
      essay_review: 'Essay Review',
      strategy_session: 'Coaching',
      school_qa: 'Q&A Call'
    };
    filters.serviceTypes.forEach(type => {
      activeFilters.push({ key: `service-${type}`, label: labels[type], remove: () => {
        onRemove({ ...filters, serviceTypes: filters.serviceTypes.filter(t => t !== type) });
      }});
    });
  }

  if (filters.minRating) {
    activeFilters.push({
      key: 'rating',
      label: `${filters.minRating}+ Stars`,
      remove: () => onRemove({ ...filters, minRating: null })
    });
  }

  if (filters.instantBookOnly) {
    activeFilters.push({
      key: 'instant',
      label: 'Instant Book',
      remove: () => onRemove({ ...filters, instantBookOnly: false })
    });
  }

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm text-gray-500">Active filters:</span>
      {activeFilters.map(filter => (
        <Badge
          key={filter.key}
          variant="secondary"
          className="cursor-pointer hover:bg-gray-200"
          onClick={filter.remove}
        >
          {filter.label}
          <span className="ml-1">&times;</span>
        </Badge>
      ))}
      <button onClick={onClear} className="text-sm text-primary hover:underline ml-2">
        Clear all
      </button>
    </div>
  );
}

export function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    serviceTypes: [],
    icuTypes: [],
    minPrice: 0,
    maxPrice: 200,
    minRating: null,
    instantBookOnly: false,
    availableOnly: false
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch providers and services
  const { providers, loading: providersLoading, error: providersError } = useProviders({
    search: searchQuery,
    serviceType: filters.serviceTypes.length > 0 ? filters.serviceTypes[0] : undefined,
    minRating: filters.minRating,
    instantBookOnly: filters.instantBookOnly
  });

  const { services } = useServices();
  const { savedProviders, toggleSave } = useSavedProviders();

  // Group services by provider
  const servicesByProvider = useMemo(() => {
    const grouped = {};
    services.forEach(service => {
      if (!grouped[service.providerId]) {
        grouped[service.providerId] = [];
      }
      grouped[service.providerId].push(service);
    });
    return grouped;
  }, [services]);

  // Filter providers further based on all filters
  const filteredProviders = useMemo(() => {
    return providers.filter(provider => {
      // Available only
      if (filters.availableOnly) {
        const isUnavailable = provider.isPaused ||
          (provider.vacationStart && provider.vacationEnd &&
            new Date() >= new Date(provider.vacationStart) &&
            new Date() <= new Date(provider.vacationEnd));
        if (isUnavailable) return false;
      }

      // ICU type filter
      if (filters.icuTypes.length > 0) {
        if (!filters.icuTypes.includes(provider.icuType)) return false;
      }

      // Service type filter (check if provider offers any of the selected types)
      if (filters.serviceTypes.length > 0) {
        const providerServices = servicesByProvider[provider.id] || [];
        const providerServiceTypes = providerServices.map(s => s.type);
        const hasMatchingService = filters.serviceTypes.some(type =>
          providerServiceTypes.includes(type)
        );
        if (!hasMatchingService) return false;
      }

      // Price range filter
      if (filters.minPrice > 0 || filters.maxPrice < 200) {
        const providerServices = servicesByProvider[provider.id] || [];
        const prices = providerServices.map(s => s.price).filter(Boolean);
        if (prices.length > 0) {
          const minProviderPrice = Math.min(...prices);
          const maxProviderPrice = Math.max(...prices);
          if (maxProviderPrice < filters.minPrice || minProviderPrice > filters.maxPrice) {
            return false;
          }
        }
      }

      return true;
    });
  }, [providers, filters, servicesByProvider]);

  const clearFilters = () => {
    setFilters({
      serviceTypes: [],
      icuTypes: [],
      minPrice: 0,
      maxPrice: 200,
      minRating: null,
      instantBookOnly: false,
      availableOnly: false
    });
  };

  const hasActiveFilters = filters.serviceTypes.length > 0 ||
    filters.icuTypes.length > 0 ||
    filters.minRating !== null ||
    filters.instantBookOnly ||
    filters.availableOnly ||
    filters.minPrice > 0 ||
    filters.maxPrice < 200;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50/80 to-pink-50/25">
      <PageWrapper className="px-8 md:px-16 lg:px-24 xl:px-32 pt-8 md:pt-12 lg:pt-16 pb-8 bg-transparent relative z-10">
      {/* Hero */}
      <MarketplaceHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Become a Mentor CTA */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-medium text-gray-900">Are you a current SRNA?</h3>
            <p className="text-sm text-gray-600">Share your experience and earn extra income as a mentor.</p>
          </div>
          <Link to="/marketplace/become-a-mentor">
            <Button variant="outline" className="flex items-center gap-1">
              Become a Mentor
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-4">
            <MarketplaceFilters
              filters={filters}
              onChange={setFilters}
              onClear={clearFilters}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Mobile Filter Button + Results Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {providersLoading ? (
                'Loading mentors...'
              ) : (
                <>
                  <strong>{filteredProviders.length}</strong> mentor{filteredProviders.length !== 1 ? 's' : ''} found
                </>
              )}
            </p>

            {/* Mobile Filter Trigger */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="default" className="ml-1 px-1.5 py-0.5 text-xs">
                      {filters.serviceTypes.length + (filters.minRating ? 1 : 0) + (filters.instantBookOnly ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md p-0">
                <MarketplaceFilters
                  filters={filters}
                  onChange={setFilters}
                  onClear={clearFilters}
                  isMobile
                  onClose={() => setMobileFiltersOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters */}
          <ActiveFilters
            filters={filters}
            onRemove={setFilters}
            onClear={clearFilters}
          />

          {/* Mentor Grid */}
          {providersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <MentorCardSkeleton key={i} />
              ))}
            </div>
          ) : providersError ? (
            <EmptyState
              icon={Users}
              title="Unable to load mentors"
              description="There was an error loading the mentor list. Please try again."
              action={
                <Button onClick={() => window.location.reload()}>
                  Retry
                </Button>
              }
            />
          ) : filteredProviders.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No mentors match your filters"
              description={
                hasActiveFilters
                  ? "Try adjusting your filters to see more results."
                  : searchQuery
                    ? `No mentors found matching "${searchQuery}"`
                    : "Check back soon - more mentors are joining!"
              }
              action={
                hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                )
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProviders.map(provider => (
                <MentorCard
                  key={provider.id}
                  provider={provider}
                  services={servicesByProvider[provider.id] || []}
                  isSaved={savedProviders.has(provider.id)}
                  onToggleSave={toggleSave}
                />
              ))}
            </div>
          )}
        </main>
      </div>
      </PageWrapper>
    </div>
  );
}

export default MarketplacePage;
