/**
 * ProviderOnboardingPage
 *
 * Multi-step wizard for provider onboarding after application is approved.
 * Route: /marketplace/provider/onboarding
 *
 * Steps:
 * 1. Profile - Professional info + personality questions
 * 2. Services - Configure service offerings with pricing
 * 3. Availability - Set weekly schedule + video link
 * 4. Stripe - Connect payment account
 * 5. Review - Final review and launch
 *
 * Features:
 * - Progress widget at top showing current step
 * - URL-based step navigation (?step=1, ?step=2, etc.)
 * - Data persistence across steps
 * - Validation before advancing
 * - Skip to step if already completed
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OnboardingProgressWidget } from '@/components/features/provider/OnboardingProgressWidget';
import { OnboardingStep1Profile } from '@/components/features/provider/OnboardingStep1Profile';
import { OnboardingStep2Services } from '@/components/features/provider/OnboardingStep2Services';
import { OnboardingStep3Availability } from '@/components/features/provider/OnboardingStep3Availability';
import { OnboardingStep4Stripe } from '@/components/features/provider/OnboardingStep4Stripe';
import { OnboardingStep5Review } from '@/components/features/provider/OnboardingStep5Review';
import { getApplicationByProviderId, APPLICATION_STATUS } from '@/data/marketplace/mockAdminMessages';
import { cn } from '@/lib/utils';

// Mock current provider ID - would come from auth context
const MOCK_PROVIDER_ID = 'provider_pending_002'; // Rachel Liu - has info_needed status

// Step configuration
const STEPS = [
  { number: 1, label: 'Profile', component: OnboardingStep1Profile },
  { number: 2, label: 'Services', component: OnboardingStep2Services },
  { number: 3, label: 'Availability', component: OnboardingStep3Availability },
  { number: 4, label: 'Stripe', component: OnboardingStep4Stripe },
  { number: 5, label: 'Review & Launch', component: OnboardingStep5Review }
];

// Initial mock data for testing
const INITIAL_PROFILE_DATA = {
  firstName: '',
  lastName: '',
  email: '',
  school: '',
  yearInProgram: '',
  tagline: '',
  bio: '',
  icuType: '',
  icuYears: '',
  specializations: [],
  personality: {},
  photoUrl: null,
  videoCallLink: ''
};

const INITIAL_SERVICES_DATA = [];

const INITIAL_AVAILABILITY_DATA = {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  weeklyHours: {},
  bufferMinutes: 15,
  minimumNotice: 24,
  instantBookEnabled: false,
  cancellationPolicy: 'moderate'
};

export function ProviderOnboardingPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Current step from URL (default to 1)
  const currentStep = parseInt(searchParams.get('step') || '1', 10);

  // Form data state
  const [profileData, setProfileData] = useState(INITIAL_PROFILE_DATA);
  const [servicesData, setServicesData] = useState(INITIAL_SERVICES_DATA);
  const [availabilityData, setAvailabilityData] = useState(INITIAL_AVAILABILITY_DATA);
  const [stripeStatus, setStripeStatus] = useState('not_connected'); // 'not_connected' | 'pending' | 'connected'

  // Track completed steps
  const [completedSteps, setCompletedSteps] = useState([]);

  // Validation errors
  const [errors, setErrors] = useState({});

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get application status
  const applicationStatus = useMemo(() => {
    // TODO: Replace with API call to get current provider's application status
    const application = getApplicationByProviderId(MOCK_PROVIDER_ID);
    return application?.status || APPLICATION_STATUS.PENDING;
  }, []);

  // Calculate completed steps based on data
  useEffect(() => {
    const completed = [];

    // Step 1: Profile complete if basic info filled
    if (profileData.firstName && profileData.lastName && profileData.bio && profileData.school) {
      completed.push(1);
    }

    // Step 2: Services complete if at least one service added
    if (servicesData.length > 0) {
      completed.push(2);
    }

    // Step 3: Availability complete if schedule set and video link provided
    if (Object.keys(availabilityData.weeklyHours || {}).length > 0 && profileData.videoCallLink) {
      completed.push(3);
    }

    // Step 4: Stripe complete if connected
    if (stripeStatus === 'connected') {
      completed.push(4);
    }

    setCompletedSteps(completed);
  }, [profileData, servicesData, availabilityData, stripeStatus]);

  // Navigate to a specific step
  const goToStep = (step) => {
    if (step >= 1 && step <= 5) {
      setSearchParams({ step: step.toString() });
    }
  };

  // Handle next step
  const handleNext = () => {
    // Validate current step before proceeding
    const isValid = validateCurrentStep();
    if (!isValid) return;

    if (currentStep < 5) {
      goToStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handleBack = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  // Validate current step
  const validateCurrentStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 1:
        if (!profileData.firstName) newErrors.firstName = 'First name is required';
        if (!profileData.lastName) newErrors.lastName = 'Last name is required';
        if (!profileData.bio) newErrors.bio = 'Bio is required';
        if (!profileData.school) newErrors.school = 'School is required';
        break;
      case 2:
        if (servicesData.length === 0) newErrors.services = 'Add at least one service';
        break;
      case 3:
        if (!profileData.videoCallLink) newErrors.videoCallLink = 'Video call link is required';
        break;
      case 4:
        if (stripeStatus !== 'connected') newErrors.stripe = 'Connect your Stripe account';
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle profile data changes
  const handleProfileChange = (updates) => {
    setProfileData(prev => ({ ...prev, ...updates }));
    // Clear relevant errors
    Object.keys(updates).forEach(key => {
      if (errors[key]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[key];
          return newErrors;
        });
      }
    });
  };

  // Handle services data changes
  const handleServicesChange = (services) => {
    setServicesData(services);
    if (errors.services && services.length > 0) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.services;
        return newErrors;
      });
    }
  };

  // Handle availability data changes
  const handleAvailabilityChange = (updates) => {
    setAvailabilityData(prev => ({ ...prev, ...updates }));
  };

  // Handle Stripe connection
  const handleStripeConnect = async () => {
    // TODO: Replace with actual Stripe Connect flow
    setStripeStatus('pending');
    // Simulate connection
    setTimeout(() => {
      setStripeStatus('connected');
    }, 2000);
  };

  // Handle final launch
  const handleLaunch = async () => {
    setIsSubmitting(true);
    // TODO: Replace with API call to save all data and activate profile
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    // Navigate to dashboard after successful launch
    navigate('/marketplace/provider/dashboard');
  };

  // Get current step component
  const CurrentStepComponent = STEPS[currentStep - 1]?.component;

  // Props to pass to step components
  const stepProps = {
    1: {
      data: profileData,
      onChange: handleProfileChange,
      errors,
      onNext: handleNext
    },
    2: {
      data: servicesData,  // Component expects 'data', not 'services'
      onChange: handleServicesChange,
      errors,
      onNext: handleNext,
      onBack: handleBack
    },
    3: {
      data: { ...availabilityData, videoCallLink: profileData.videoCallLink },
      onChange: handleAvailabilityChange,
      onVideoLinkChange: (link) => handleProfileChange({ videoCallLink: link }),
      errors,
      onNext: handleNext,
      onBack: handleBack
    },
    4: {
      data: {
        stripeConnected: stripeStatus === 'connected',
        stripePending: stripeStatus === 'pending',
        bankLastFour: null  // TODO: Get from actual Stripe data
      },
      onConnectStripe: handleStripeConnect,  // Component expects 'onConnectStripe'
      errors,
      onNext: handleNext,
      onBack: handleBack
    },
    5: {
      profileData,
      servicesData,
      availabilityData,
      stripeStatus,
      applicationStatus, // Pass application status to control Go Live button
      onLaunch: handleLaunch,
      isSubmitting,
      onBack: handleBack,
      onNavigateToStep: goToStep  // Component expects 'onNavigateToStep'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header with back button */}
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/marketplace/become-a-mentor"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">
              Mentor Onboarding
            </h1>
            <div className="w-16" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Progress Widget */}
        <OnboardingProgressWidget
          currentStep={currentStep}
          completedSteps={completedSteps}
          className="mb-8"
        />

        {/* Step Content */}
        <div className="mb-8">
          {CurrentStepComponent && (
            <CurrentStepComponent {...stepProps[currentStep]} />
          )}
        </div>

        {/* Navigation Buttons (for steps 1-4) */}
        {currentStep < 5 && (
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="flex items-center gap-2">
              {/* Step indicators */}
              {STEPS.slice(0, 4).map((step) => (
                <button
                  key={step.number}
                  onClick={() => goToStep(step.number)}
                  className={cn(
                    'w-2.5 h-2.5 rounded-full transition-all',
                    currentStep === step.number
                      ? 'bg-primary scale-125'
                      : completedSteps.includes(step.number)
                      ? 'bg-green-500'
                      : 'bg-gray-300 hover:bg-gray-400'
                  )}
                  aria-label={`Go to step ${step.number}: ${step.label}`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              className="gap-2"
            >
              {currentStep === 4 ? 'Review' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProviderOnboardingPage;
