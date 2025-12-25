/**
 * MentorProfilePage
 *
 * Full mentor profile page with services, reviews, and personality section.
 * Route: /marketplace/mentor/:mentorId
 */

import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Clock,
  GraduationCap,
  Heart,
  MessageSquare,
  Calendar,
  MapPin,
  Briefcase,
  Award,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { PageWrapper, Breadcrumbs } from '@/components/layout/page-wrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { PersonalityDisplay } from '@/components/features/marketplace/PersonalityDisplay';
import { ServiceCard } from '@/components/features/marketplace/ServiceCard';
import { ReviewList } from '@/components/features/marketplace/ReviewList';
import { useProviderById, useSavedProviders } from '@/hooks/useProviders';
import { useProviderServices } from '@/hooks/useServices';
import { useProviderReviews } from '@/hooks/useReviews';
import { cn } from '@/lib/utils';

/**
 * Get initials from name
 */
function getInitials(name) {
  if (!name) return '??';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Loading skeleton for profile
 */
function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-6">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    </div>
  );
}

export function MentorProfilePage() {
  const { mentorId } = useParams();
  const navigate = useNavigate();

  // Fetch provider data
  const { provider, loading: providerLoading, error: providerError } = useProviderById(mentorId);
  const { services, loading: servicesLoading } = useProviderServices(mentorId);
  const { reviews, loading: reviewsLoading } = useProviderReviews(mentorId);
  const { savedProviders, toggleSave } = useSavedProviders();

  const isSaved = savedProviders.has(mentorId);

  // Check if provider is unavailable
  const isUnavailable = useMemo(() => {
    if (!provider) return false;
    return provider.isPaused ||
      (provider.vacationStart && provider.vacationEnd &&
        new Date() >= new Date(provider.vacationStart) &&
        new Date() <= new Date(provider.vacationEnd));
  }, [provider]);

  // Get vacation end date for display
  const vacationEndDate = useMemo(() => {
    if (!provider?.vacationEnd) return null;
    return new Date(provider.vacationEnd).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }, [provider]);

  // Calculate average rating
  const averageRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return null;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

  // Breadcrumbs
  const breadcrumbs = [
    { label: 'Marketplace', href: '/marketplace' },
    { label: provider?.name || 'Mentor' }
  ];

  if (providerError) {
    return (
      <PageWrapper breadcrumbs={breadcrumbs}>
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Mentor Not Found</h2>
          <p className="text-gray-600 mb-4">
            This mentor profile doesn't exist or may have been removed.
          </p>
          <Link to="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </Card>
      </PageWrapper>
    );
  }

  if (providerLoading) {
    return (
      <PageWrapper breadcrumbs={breadcrumbs}>
        <ProfileSkeleton />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper breadcrumbs={breadcrumbs}>
      <div className="max-w-5xl mx-auto">
        {/* Unavailable Alert */}
        {isUnavailable && (
          <Alert variant="warning" className="mb-6">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              {provider.isPaused ? (
                'This mentor is currently not accepting new bookings.'
              ) : (
                <>
                  This mentor is away until {vacationEndDate}.
                  {provider.vacationMessage && ` "${provider.vacationMessage}"`}
                </>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar & Basic Info */}
              <div className="flex items-start gap-4">
                <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-primary/20">
                  <AvatarImage src={provider.avatarUrl} alt={provider.name} />
                  <AvatarFallback className="bg-primary/10 text-xl font-bold">
                    {getInitials(provider.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{provider.name}</h1>
                      <div className="flex items-center gap-2 text-gray-600 mt-1">
                        <GraduationCap className="w-4 h-4" />
                        <span>{provider.programName}</span>
                      </div>
                    </div>

                    {/* Save Button */}
                    <Button
                      variant={isSaved ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleSave(mentorId)}
                    >
                      <Heart
                        className={cn(
                          'w-4 h-4 mr-1',
                          isSaved && 'fill-current'
                        )}
                      />
                      {isSaved ? 'Saved' : 'Save'}
                    </Button>
                  </div>

                  {/* Tagline */}
                  {provider.tagline && (
                    <p className="text-gray-600 mt-2 italic">"{provider.tagline}"</p>
                  )}

                  {/* Stats Row */}
                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    {averageRating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{averageRating.toFixed(1)}</span>
                        <span className="text-gray-500 text-sm">
                          ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                        </span>
                      </div>
                    )}
                    {provider.responseTime && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Responds in {provider.responseTime}</span>
                      </div>
                    )}
                    {provider.totalSessions && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{provider.totalSessions} sessions</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            {provider.bio && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-gray-700 whitespace-pre-line">{provider.bio}</p>
              </div>
            )}

            {/* Background Info */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {provider.icuType && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase">ICU Experience</p>
                    <p className="font-medium">{provider.icuType}</p>
                    {provider.yearsExperience && (
                      <p className="text-sm text-gray-600">{provider.yearsExperience} years</p>
                    )}
                  </div>
                )}
                {provider.yearInProgram && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Year in Program</p>
                    <p className="font-medium">{provider.yearInProgram}</p>
                  </div>
                )}
                {provider.specialties && provider.specialties.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 uppercase mb-1">Specialties</p>
                    <div className="flex flex-wrap gap-1">
                      {provider.specialties.map(specialty => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
              <Link to={`/marketplace/messages?mentor=${mentorId}`}>
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Personality Section */}
        {provider.personality && Object.keys(provider.personality).some(k => provider.personality[k]) && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <PersonalityDisplay personality={provider.personality} />
            </CardContent>
          </Card>
        )}

        {/* Services Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Services Offered</h2>
          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <Card className="p-6 text-center text-gray-500">
              <p>No services available at this time.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  provider={provider}
                  isUnavailable={isUnavailable}
                />
              ))}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <Card>
          <CardContent className="p-6">
            {reviewsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Star className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No reviews yet.</p>
                <p className="text-sm">Be the first to book and leave a review!</p>
              </div>
            ) : (
              <>
                <ReviewList
                  reviews={reviews}
                  showDistribution={reviews.length >= 5}
                  initialLimit={5}
                />

                {reviews.length > 5 && (
                  <div className="mt-4 text-center">
                    <Link to={`/marketplace/mentor/${mentorId}/reviews`}>
                      <Button variant="outline">
                        View All {reviews.length} Reviews
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}

export default MentorProfilePage;
