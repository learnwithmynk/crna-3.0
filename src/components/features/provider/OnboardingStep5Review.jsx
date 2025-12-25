/**
 * OnboardingStep5Review Component
 *
 * Final step of provider onboarding - "Review & Launch"
 * Shows comprehensive profile preview, completion checklist, services summary,
 * and celebratory launch experience.
 */

import { useState } from 'react';
import {
  Eye,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Rocket,
  Share2,
  LayoutDashboard,
  User,
  Clock,
  XCircle,
  Info,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ProfilePreviewPanel } from './ProfilePreviewPanel';
import { cn } from '@/lib/utils';

/**
 * Calculate completion status for each checklist item
 */
function getChecklistStatus(profileData, servicesData, availabilityData, stripeStatus) {
  return {
    profile: {
      complete: !!(
        profileData?.firstName &&
        profileData?.lastName &&
        profileData?.bio &&
        profileData?.school &&
        profileData?.yearInProgram
      ),
      step: 1,
    },
    services: {
      complete: servicesData && servicesData.length > 0,
      step: 2,
    },
    availability: {
      complete: !!(availabilityData && Object.keys(availabilityData).length > 0),
      step: 3,
    },
    videoLink: {
      complete: !!(profileData?.videoCallLink),
      step: 3,
    },
    stripe: {
      complete: stripeStatus === 'connected',
      warning: stripeStatus !== 'connected',
      step: 4,
    },
  };
}

/**
 * Calculate total potential earnings from services
 */
function calculatePotentialEarnings(servicesData) {
  if (!servicesData || servicesData.length === 0) return 0;

  // Get average price across all services
  const prices = servicesData
    .filter((s) => s.enabled && s.price)
    .map((s) => parseFloat(s.price));

  if (prices.length === 0) return 0;

  const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

  // Estimate: 4 bookings per month * 80% mentor take (20% platform fee)
  return Math.round(avgPrice * 4 * 0.8);
}

/**
 * Confetti animation component
 */
function ConfettiEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10%',
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        >
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              i % 3 === 0 && 'bg-primary',
              i % 3 === 1 && 'bg-purple-500',
              i % 3 === 2 && 'bg-pink-500'
            )}
          />
        </div>
      ))}
    </div>
  );
}

export function OnboardingStep5Review({
  profileData = {},
  servicesData = [],
  availabilityData = {},
  stripeStatus = 'not_connected',
  applicationStatus = 'approved', // 'pending' | 'approved' | 'denied' | 'info_needed'
  onBack,
  onLaunch,
  isLaunching = false,
  onNavigateToStep,
}) {
  // Check if application is approved
  const isApproved = applicationStatus === 'approved';
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [responseTimeAccepted, setResponseTimeAccepted] = useState(false);
  const [contractorAccepted, setContractorAccepted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [profileLinkCopied, setProfileLinkCopied] = useState(false);

  const checklist = getChecklistStatus(
    profileData,
    servicesData,
    availabilityData,
    stripeStatus
  );

  const allChecklistComplete = Object.values(checklist).every((item) => item.complete);
  const allTermsAccepted = termsAccepted && responseTimeAccepted && contractorAccepted;
  // Must be approved AND have completed checklist AND accepted terms
  const canLaunch = isApproved && allChecklistComplete && allTermsAccepted;

  const potentialEarnings = calculatePotentialEarnings(servicesData);

  // Mock profile URL - in production, this would be generated after launch
  const profileUrl = `https://thecrnaclub.com/marketplace/mentors/${profileData?.firstName?.toLowerCase() || 'mentor'}`;

  const handleLaunch = async () => {
    if (!canLaunch) return;

    try {
      await onLaunch();
      setShowCelebration(true);
    } catch (error) {
      console.error('Launch failed:', error);
    }
  };

  const handleCopyProfileLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setProfileLinkCopied(true);
    setTimeout(() => setProfileLinkCopied(false), 2000);
  };

  // Pre-launch view
  if (!showCelebration) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Launch</h2>
          <p className="text-gray-600">
            Review your profile and complete the final checklist to go live in the marketplace
          </p>
        </div>

        {/* Two-column layout on desktop */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left column: Checklist and Services */}
          <div className="space-y-6">
            {/* Completion Checklist */}
            <Card>
              <CardHeader>
                <CardTitle>Launch Checklist</CardTitle>
                <CardDescription>
                  Complete all items below to go live
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Profile Information */}
                <ChecklistItem
                  complete={checklist.profile.complete}
                  label="Profile information complete"
                  onClick={() => onNavigateToStep?.(checklist.profile.step)}
                />

                {/* Services */}
                <ChecklistItem
                  complete={checklist.services.complete}
                  label="At least one service configured"
                  onClick={() => onNavigateToStep?.(checklist.services.step)}
                />

                {/* Availability */}
                <ChecklistItem
                  complete={checklist.availability.complete}
                  label="Availability set"
                  onClick={() => onNavigateToStep?.(checklist.availability.step)}
                />

                {/* Video Call Link */}
                <ChecklistItem
                  complete={checklist.videoLink.complete}
                  label="Video call link provided"
                  onClick={() => onNavigateToStep?.(checklist.videoLink.step)}
                />

                {/* Stripe */}
                <ChecklistItem
                  complete={checklist.stripe.complete}
                  warning={checklist.stripe.warning}
                  label={
                    checklist.stripe.complete
                      ? 'Stripe connected'
                      : 'Stripe not connected - can\'t receive payments'
                  }
                  onClick={() => onNavigateToStep?.(checklist.stripe.step)}
                />
              </CardContent>
            </Card>

            {/* Services Summary */}
            {servicesData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Services</CardTitle>
                  <CardDescription>
                    {servicesData.filter((s) => s.enabled).length} active service
                    {servicesData.filter((s) => s.enabled).length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {servicesData
                    .filter((s) => s.enabled)
                    .map((service, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between p-3 bg-gray-50 rounded-xl"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {service.name}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {service.duration} min session
                          </p>
                        </div>
                        <div className="text-right ml-3">
                          <p className="font-semibold text-gray-900">
                            ${service.price}
                          </p>
                        </div>
                      </div>
                    ))}

                  {/* Potential Earnings */}
                  {potentialEarnings > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Estimated Monthly Earnings
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Based on 4 bookings/month
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">
                            ${potentialEarnings}
                          </p>
                          <p className="text-xs text-gray-500">after fees</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Terms Confirmation */}
            <Card>
              <CardHeader>
                <CardTitle>Terms & Agreements</CardTitle>
                <CardDescription>
                  Please review and accept the following
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Independent Contractor */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="contractor"
                    checked={contractorAccepted}
                    onCheckedChange={setContractorAccepted}
                  />
                  <label
                    htmlFor="contractor"
                    className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                  >
                    I understand I am an independent contractor and responsible for my own
                    taxes
                  </label>
                </div>

                {/* Response Time */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="response"
                    checked={responseTimeAccepted}
                    onCheckedChange={setResponseTimeAccepted}
                  />
                  <label
                    htmlFor="response"
                    className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                  >
                    I agree to respond to booking requests within 48 hours
                  </label>
                </div>

                {/* Terms of Service */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={setTermsAccepted}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                  >
                    I have read and agree to the{' '}
                    <a
                      href="/mentor-terms"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      Mentor Terms of Service
                    </a>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column: Profile Preview */}
          <div className="space-y-6">
            {/* Full Profile Preview */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-gray-600" />
                  <CardTitle>Profile Preview</CardTitle>
                </div>
                <CardDescription>
                  This is how applicants will see your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfilePreviewPanel profileData={profileData} />
              </CardContent>
            </Card>

            {/* Stripe Warning */}
            {stripeStatus !== 'connected' && (
              <Alert variant="warning">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Payment Setup Required</AlertTitle>
                <AlertDescription>
                  You can launch your profile now, but you won't be able to receive payments
                  until you connect your Stripe account.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Launch Button */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={onBack} disabled={isLaunching}>
            Back
          </Button>

          <Button
            onClick={handleLaunch}
            disabled={!canLaunch || isLaunching}
            size="lg"
            className="min-w-[200px] gap-2"
          >
            {isLaunching ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Launching...
              </>
            ) : !isApproved ? (
              <>
                <Clock className="w-5 h-5" />
                Awaiting Approval
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                Launch My Profile
              </>
            )}
          </Button>
        </div>

        {/* Application Status Notice */}
        {!isApproved && (
          <Alert
            className={cn(
              applicationStatus === 'pending' && 'border-yellow-200 bg-yellow-50',
              applicationStatus === 'info_needed' && 'border-orange-200 bg-orange-50',
              applicationStatus === 'denied' && 'border-red-200 bg-red-50'
            )}
          >
            {applicationStatus === 'pending' && (
              <>
                <Clock className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800">Application Under Review</AlertTitle>
                <AlertDescription className="text-yellow-700">
                  Your application is being reviewed by our team. You can continue setting up your
                  profile, but you won't be able to go live until approved. We'll notify you once
                  a decision is made.
                </AlertDescription>
              </>
            )}
            {applicationStatus === 'info_needed' && (
              <>
                <Info className="h-4 w-4 text-orange-600" />
                <AlertTitle className="text-orange-800">Additional Information Needed</AlertTitle>
                <AlertDescription className="text-orange-700">
                  Please check your{' '}
                  <a href="/marketplace/provider/application-status" className="underline font-medium">
                    application status page
                  </a>{' '}
                  for a message from our team. You can continue setting up your profile while we wait
                  for your response.
                </AlertDescription>
              </>
            )}
            {applicationStatus === 'denied' && (
              <>
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800">Application Not Approved</AlertTitle>
                <AlertDescription className="text-red-700">
                  Unfortunately, your application was not approved. Please check your{' '}
                  <a href="/marketplace/provider/application-status" className="underline font-medium">
                    application status page
                  </a>{' '}
                  for more details and reapply information.
                </AlertDescription>
              </>
            )}
          </Alert>
        )}

        {/* Launch Requirements Notice */}
        {isApproved && !canLaunch && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {!allChecklistComplete
                ? 'Complete all checklist items to launch your profile'
                : 'Please accept all terms and agreements to continue'}
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  // Post-launch celebration view
  return (
    <div className="max-w-2xl mx-auto">
      <ConfettiEffect />

      <Card className="border-2 border-primary/20 bg-linear-to-br from-primary/5 via-white to-purple-50">
        <CardContent className="pt-8 pb-8 text-center">
          {/* Celebration Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary to-yellow-300 flex items-center justify-center shadow-lg">
                <Rocket className="w-12 h-12 text-black" />
              </div>
              <div className="absolute -top-2 -right-2 text-yellow-400 animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="absolute -bottom-2 -left-2 text-yellow-400 animate-pulse delay-75">
                <Sparkles className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Celebration Message */}
          <div className="space-y-3 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Congratulations! You're Live!
            </h2>
            <p className="text-lg text-gray-600">
              Your mentor profile is now visible to applicants in the marketplace
            </p>
          </div>

          {/* Profile Link */}
          <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Your Profile Link</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={profileUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-600"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyProfileLink}
                className="gap-2"
              >
                {profileLinkCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid sm:grid-cols-3 gap-3">
            <Button variant="outline" className="gap-2" asChild>
              <a href={profileUrl} target="_blank" rel="noopener noreferrer">
                <User className="w-4 h-4" />
                View My Profile
              </a>
            </Button>

            <Button variant="outline" className="gap-2" asChild>
              <a href="/provider/dashboard">
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard
              </a>
            </Button>

            <Button className="gap-2">
              <Share2 className="w-4 h-4" />
              Share on Social
            </Button>
          </div>

          {/* Next Steps */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
            <div className="space-y-2 text-sm text-gray-600 text-left">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                <p>Your profile is now discoverable in the marketplace</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                <p>You'll receive notifications when applicants book your services</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                <p>Respond to bookings within 48 hours to maintain your reputation</p>
              </div>
              {stripeStatus !== 'connected' && (
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                  <p>
                    Don't forget to{' '}
                    <a href="/provider/settings/payments" className="text-blue-600 hover:underline">
                      connect your Stripe account
                    </a>{' '}
                    to receive payments
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * ChecklistItem Component
 * Individual checklist item with completion status and navigation
 */
function ChecklistItem({ complete, warning, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-between p-3 rounded-xl transition-colors',
        'hover:bg-gray-50 text-left group'
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {complete ? (
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
        ) : warning ? (
          <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
        )}
        <span
          className={cn(
            'text-sm',
            complete ? 'text-gray-900' : 'text-gray-600',
            warning && 'text-yellow-800'
          )}
        >
          {label}
        </span>
      </div>
      {!complete && (
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 shrink-0" />
      )}
    </button>
  );
}

export default OnboardingStep5Review;
