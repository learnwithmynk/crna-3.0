/**
 * ProviderBookingsPage
 *
 * View all provider bookings in calendar or list view.
 * Route: /marketplace/provider/bookings
 *
 * Features:
 * - View toggle: Calendar | List
 * - Tabs: Upcoming | Past
 * - List view with filters
 * - Calendar view with month/week toggle
 * - Empty states for no bookings
 */

import { useState } from 'react';
import { Calendar, List, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProviderBookingCard } from '@/components/features/provider/ProviderBookingCard';
import { BookingsCalendarView } from '@/components/features/provider/BookingsCalendarView';
import { cn } from '@/lib/utils';

// MOCK DATA - Replace with API call
const generateMockBookings = () => {
  const now = new Date();

  return [
    {
      id: 'booking-1',
      applicantName: 'Sarah M.',
      service: 'Mock Interview',
      scheduledAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      duration: 60,
      price: 125,
      status: 'confirmed',
      videoLink: 'https://zoom.us/j/123456789'
    },
    {
      id: 'booking-2',
      applicantName: 'Michael R.',
      service: 'Essay Review',
      scheduledAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      duration: 30,
      price: 85,
      status: 'confirmed',
      videoLink: null // Essay review doesn't need video
    },
    {
      id: 'booking-3',
      applicantName: 'Jessica C.',
      service: 'Strategy Session',
      scheduledAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      duration: 45,
      price: 100,
      status: 'confirmed',
      videoLink: 'https://zoom.us/j/987654321'
    },
    {
      id: 'booking-4',
      applicantName: 'David K.',
      service: 'Mock Interview',
      scheduledAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      duration: 60,
      price: 125,
      status: 'completed',
      videoLink: 'https://zoom.us/j/111222333'
    },
    {
      id: 'booking-5',
      applicantName: 'Rachel T.',
      service: 'School Q&A',
      scheduledAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      duration: 30,
      price: 50,
      status: 'completed',
      videoLink: 'https://zoom.us/j/444555666'
    },
    {
      id: 'booking-6',
      applicantName: 'Amanda F.',
      service: 'Resume Review',
      scheduledAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      duration: 30,
      price: 75,
      status: 'cancelled',
      videoLink: null
    },
    {
      id: 'booking-7',
      applicantName: 'Kevin L.',
      service: 'Mock Interview',
      scheduledAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      duration: 60,
      price: 125,
      status: 'confirmed',
      videoLink: 'https://zoom.us/j/777888999'
    },
  ];
};

const mockBookings = generateMockBookings();

export function ProviderBookingsPage() {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'
  const [serviceFilter, setServiceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter bookings by tab
  const now = new Date();
  const upcomingBookings = mockBookings.filter(
    booking => new Date(booking.scheduledAt) >= now && booking.status !== 'cancelled'
  );
  const pastBookings = mockBookings.filter(
    booking => new Date(booking.scheduledAt) < now || booking.status === 'completed' || booking.status === 'cancelled'
  );

  // Apply filters
  const filterBookings = (bookings) => {
    let filtered = [...bookings];

    // Service type filter
    if (serviceFilter !== 'all') {
      filtered = filtered.filter(b => b.service === serviceFilter);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(b =>
        b.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.service.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by date
    filtered.sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

    return filtered;
  };

  const displayBookings = activeTab === 'upcoming'
    ? filterBookings(upcomingBookings)
    : filterBookings(pastBookings);

  // Get unique service types for filter
  const serviceTypes = ['all', ...new Set(mockBookings.map(b => b.service))];

  // Handlers
  const handleJoinCall = (bookingId) => {
    console.log('Join call for booking:', bookingId);
  };

  const handleViewDetails = (bookingId) => {
    console.log('View details for booking:', bookingId);
    // Navigate to booking details page
  };

  const handleBookingClick = (bookingId) => {
    console.log('Booking clicked:', bookingId);
    handleViewDetails(bookingId);
  };

  // Empty states
  const EmptyState = ({ type }) => {
    const messages = {
      upcoming: {
        title: 'No upcoming sessions',
        description: 'Check your incoming requests to book new sessions!',
        action: 'View Requests',
        link: '/marketplace/provider/requests'
      },
      past: {
        title: 'No past sessions yet',
        description: 'Your completed sessions will appear here.',
        action: null
      }
    };

    const config = messages[type];

    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{config.title}</h3>
        <p className="text-gray-600 mb-4">{config.description}</p>
        {config.action && (
          <Button asChild>
            <a href={config.link}>{config.action}</a>
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
            <p className="text-gray-600">
              Manage your scheduled sessions and view booking history
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex gap-1 border border-gray-200 rounded-xl p-1 bg-white">
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => setViewMode('list')}
              className="gap-2"
            >
              <List className="w-4 h-4" />
              List
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'calendar' ? 'default' : 'ghost'}
              onClick={() => setViewMode('calendar')}
              className="gap-2"
            >
              <Calendar className="w-4 h-4" />
              Calendar
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastBookings.length})
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Tab */}
          <TabsContent value="upcoming" className="space-y-6">
            {viewMode === 'list' && (
              <>
                {/* Filters */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Search */}
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Search by name or service..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>

                      {/* Service Type Filter */}
                      <Select value={serviceFilter} onValueChange={setServiceFilter}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                          <Filter className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Service type" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceTypes.map(type => (
                            <SelectItem key={type} value={type}>
                              {type === 'all' ? 'All Services' : type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Bookings List */}
                {displayBookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayBookings.map(booking => (
                      <ProviderBookingCard
                        key={booking.id}
                        booking={booking}
                        onJoinCall={handleJoinCall}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6">
                      <EmptyState type="upcoming" />
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {viewMode === 'calendar' && (
              <Card>
                <CardContent className="p-6">
                  {upcomingBookings.length > 0 ? (
                    <BookingsCalendarView
                      bookings={upcomingBookings}
                      onBookingClick={handleBookingClick}
                    />
                  ) : (
                    <EmptyState type="upcoming" />
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Past Tab */}
          <TabsContent value="past" className="space-y-6">
            {viewMode === 'list' && (
              <>
                {/* Filters */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Search */}
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Search by name or service..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>

                      {/* Service Type Filter */}
                      <Select value={serviceFilter} onValueChange={setServiceFilter}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                          <Filter className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Service type" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceTypes.map(type => (
                            <SelectItem key={type} value={type}>
                              {type === 'all' ? 'All Services' : type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Bookings List */}
                {displayBookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayBookings.map(booking => (
                      <ProviderBookingCard
                        key={booking.id}
                        booking={booking}
                        onJoinCall={handleJoinCall}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6">
                      <EmptyState type="past" />
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {viewMode === 'calendar' && (
              <Card>
                <CardContent className="p-6">
                  {pastBookings.length > 0 ? (
                    <BookingsCalendarView
                      bookings={pastBookings}
                      onBookingClick={handleBookingClick}
                    />
                  ) : (
                    <EmptyState type="past" />
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ProviderBookingsPage;
