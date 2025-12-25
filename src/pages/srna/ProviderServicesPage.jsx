/**
 * ProviderServicesPage
 *
 * Manage service offerings for SRNA mentors/providers.
 * Route: /marketplace/provider/services
 *
 * Features:
 * - List of all services with stats (saves, bookings, rating, revenue)
 * - Enable/disable toggle per service
 * - Instant Book toggle per service
 * - Edit service via slide-out sheet
 * - Add new service
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Settings,
  Star,
  DollarSign,
  Users,
  Heart,
  Clock,
  Video,
  FileText,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { SERVICE_TYPE_META, SERVICE_DELIVERY } from '@/data/marketplace/mockServices';
import { EditServiceSheet } from '@/components/features/provider/EditServiceSheet';

// Mock provider services with additional stats for this page
const mockProviderServices = [
  {
    id: 'service_001',
    type: 'mock_interview',
    title: 'Full Mock Interview Experience',
    description: 'A comprehensive 60-minute mock interview covering behavioral, clinical, and program-specific questions.',
    deliverables: [
      '60-minute live video session',
      '10-15 practice questions',
      'Written feedback summary within 24 hours',
      'List of suggested improvements'
    ],
    price: 125,
    duration: 60,
    delivery: SERVICE_DELIVERY.LIVE,
    isActive: true,
    instantBookEnabled: true,
    stats: {
      saves: 42,
      completedBookings: 18,
      rating: 4.9,
      ratingCount: 15,
      revenue: 2250
    },
    createdAt: '2024-11-01T00:00:00Z'
  },
  {
    id: 'service_002',
    type: 'essay_review',
    title: 'Personal Statement Deep Dive',
    description: "I'll review your personal statement with fresh eyes and provide detailed feedback on content, structure, and impact.",
    deliverables: [
      'Line-by-line comments on your essay',
      'Overall structure feedback',
      'Suggestions for stronger opening/closing',
      '48-hour turnaround'
    ],
    price: 75,
    duration: null,
    delivery: SERVICE_DELIVERY.ASYNC,
    turnaroundHours: 48,
    isActive: true,
    instantBookEnabled: false,
    stats: {
      saves: 28,
      completedBookings: 8,
      rating: 5.0,
      ratingCount: 6,
      revenue: 600
    },
    createdAt: '2024-11-01T00:00:00Z'
  },
  {
    id: 'service_003',
    type: 'school_qa',
    title: 'Duke CRNA Program Insider Q&A',
    description: "Get the inside scoop on Duke's CRNA program! I'll answer all your questions about the curriculum, clinical rotations, faculty, and more.",
    deliverables: [
      '30-minute live Q&A session',
      'Honest answers about the program',
      'Tips for your Duke application'
    ],
    price: 50,
    duration: 30,
    delivery: SERVICE_DELIVERY.LIVE,
    isActive: false,
    instantBookEnabled: true,
    stats: {
      saves: 15,
      completedBookings: 5,
      rating: 4.8,
      ratingCount: 4,
      revenue: 250
    },
    createdAt: '2024-11-15T00:00:00Z'
  },
  {
    id: 'service_004',
    type: 'strategy_session',
    title: 'Application Strategy Session',
    description: 'Personalized guidance on your application timeline, school selection, and preparation strategy.',
    deliverables: [
      '45-minute strategy call',
      'Personalized school recommendations',
      'Timeline planning',
      'Follow-up email summary'
    ],
    price: 100,
    duration: 45,
    delivery: SERVICE_DELIVERY.LIVE,
    isActive: true,
    instantBookEnabled: true,
    stats: {
      saves: 31,
      completedBookings: 12,
      rating: 4.7,
      ratingCount: 10,
      revenue: 1200
    },
    createdAt: '2024-10-20T00:00:00Z'
  }
];

// Service card component
function ServiceCard({ service, onToggleActive, onToggleInstantBook, onEdit }) {
  const typeMeta = SERVICE_TYPE_META[service.type] || {};
  const isLive = service.delivery === SERVICE_DELIVERY.LIVE;

  return (
    <Card
      data-testid="service-card"
      className={cn(
        'transition-all',
        !service.isActive && 'opacity-60 bg-gray-50'
      )}
    >
      <CardContent className="p-6">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="text-2xl">{typeMeta.icon || '📋'}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-900 truncate">
                  {service.title}
                </h3>
                {!service.isActive && (
                  <Badge variant="outline" className="text-gray-500 border-gray-300">
                    Disabled
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {typeMeta.name || service.type}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl font-bold text-gray-900">${service.price}</p>
            <p className="text-xs text-gray-500">
              {isLive ? (
                <>
                  <Video className="w-3 h-3 inline mr-1" />
                  {service.duration} min
                </>
              ) : (
                <>
                  <FileText className="w-3 h-3 inline mr-1" />
                  {service.turnaroundHours}h turnaround
                </>
              )}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 py-4 border-y border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
              <Heart className="w-4 h-4" />
            </div>
            <p className="text-lg font-semibold text-gray-900">{service.stats.saves}</p>
            <p className="text-xs text-gray-500">Saves</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-lg font-semibold text-gray-900">{service.stats.completedBookings}</p>
            <p className="text-xs text-gray-500">Bookings</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {service.stats.rating > 0 ? service.stats.rating.toFixed(1) : '—'}
            </p>
            <p className="text-xs text-gray-500">
              {service.stats.ratingCount > 0 ? `(${service.stats.ratingCount})` : 'No ratings'}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-green-500 mb-1">
              <DollarSign className="w-4 h-4" />
            </div>
            <p className="text-lg font-semibold text-gray-900">${service.stats.revenue}</p>
            <p className="text-xs text-gray-500">Revenue</p>
          </div>
        </div>

        {/* Toggles Row */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-6">
            {/* Active Toggle */}
            <div className="flex items-center gap-2">
              <Switch
                id={`active-${service.id}`}
                checked={service.isActive}
                onCheckedChange={() => onToggleActive(service.id)}
                data-testid="service-toggle"
              />
              <label
                htmlFor={`active-${service.id}`}
                className="text-sm text-gray-600 cursor-pointer"
              >
                {service.isActive ? 'Active' : 'Disabled'}
              </label>
            </div>

            {/* Instant Book Toggle */}
            <div className="flex items-center gap-2">
              <Switch
                id={`instant-${service.id}`}
                checked={service.instantBookEnabled}
                onCheckedChange={() => onToggleInstantBook(service.id)}
                disabled={!service.isActive}
                data-testid="instant-book-toggle"
              />
              <label
                htmlFor={`instant-${service.id}`}
                className={cn(
                  'text-sm cursor-pointer',
                  service.isActive ? 'text-gray-600' : 'text-gray-400'
                )}
              >
                Instant Book
              </label>
            </div>
          </div>

          {/* Edit Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(service)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Summary stats card
function SummaryCard({ icon: Icon, label, value, subtext, iconColor = 'text-gray-400' }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-xl bg-gray-100', iconColor)}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-600">{label}</p>
            {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProviderServicesPage() {
  const [services, setServices] = useState(mockProviderServices);
  const [editingService, setEditingService] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Calculate summary stats
  const activeServices = services.filter(s => s.isActive).length;
  const totalBookings = services.reduce((sum, s) => sum + s.stats.completedBookings, 0);
  const totalRevenue = services.reduce((sum, s) => sum + s.stats.revenue, 0);
  const avgRating = services.length > 0
    ? services.reduce((sum, s) => sum + (s.stats.rating * s.stats.ratingCount), 0) /
      services.reduce((sum, s) => sum + s.stats.ratingCount, 0)
    : 0;

  // Toggle service active state
  const handleToggleActive = (serviceId) => {
    setServices(prev => prev.map(s =>
      s.id === serviceId ? { ...s, isActive: !s.isActive } : s
    ));
  };

  // Toggle instant book
  const handleToggleInstantBook = (serviceId) => {
    setServices(prev => prev.map(s =>
      s.id === serviceId ? { ...s, instantBookEnabled: !s.instantBookEnabled } : s
    ));
  };

  // Open edit sheet
  const handleEdit = (service) => {
    setEditingService(service);
    setIsSheetOpen(true);
  };

  // Close edit sheet
  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setEditingService(null);
  };

  // Save service changes
  const handleSaveService = (updatedService) => {
    setServices(prev => prev.map(s =>
      s.id === updatedService.id ? { ...s, ...updatedService } : s
    ));
    handleCloseSheet();
  };

  // Add new service
  const handleAddService = () => {
    setEditingService(null);
    setIsSheetOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Services
            </h1>
            <p className="text-gray-600">
              Manage your service offerings, pricing, and availability.
            </p>
          </div>
          <Button onClick={handleAddService}>
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard
            icon={Settings}
            label="Active Services"
            value={`${activeServices}/${services.length}`}
            iconColor="text-blue-500"
          />
          <SummaryCard
            icon={Users}
            label="Total Bookings"
            value={totalBookings}
            subtext="All time"
            iconColor="text-purple-500"
          />
          <SummaryCard
            icon={Star}
            label="Avg Rating"
            value={avgRating > 0 ? avgRating.toFixed(1) : '—'}
            iconColor="text-yellow-500"
          />
          <SummaryCard
            icon={DollarSign}
            label="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            subtext="All time"
            iconColor="text-green-500"
          />
        </div>

        {/* Services List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Services
            </h2>
            <p className="text-sm text-gray-500">
              {activeServices} of {services.length} active
            </p>
          </div>

          {services.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Settings className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No services yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Create your first service to start accepting bookings from applicants.
                </p>
                <Button onClick={handleAddService}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Service
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {services.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onToggleActive={handleToggleActive}
                  onToggleInstantBook={handleToggleInstantBook}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </div>

        {/* Tips Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-primary/20">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Tips to Increase Bookings
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Providers with 3+ services get 40% more bookings</li>
                  <li>• Enable Instant Book for faster conversions</li>
                  <li>• Keep prices competitive with similar providers</li>
                  <li>• Respond to inquiries within 4 hours for better visibility</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" size="sm">
                <Link to="/marketplace/provider/availability">
                  <Clock className="w-4 h-4 mr-2" />
                  Manage Availability
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/marketplace/provider/profile">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Profile
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/marketplace/provider/earnings">
                  <DollarSign className="w-4 h-4 mr-2" />
                  View Earnings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Service Sheet */}
      <EditServiceSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        service={editingService}
        onSave={handleSaveService}
        onClose={handleCloseSheet}
      />
    </div>
  );
}

export default ProviderServicesPage;
