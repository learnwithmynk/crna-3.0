/**
 * BookingPage
 *
 * 3-step booking wizard for marketplace services:
 * 1. Service context & intake form
 * 2. Schedule selection
 * 3. Review & payment
 *
 * Route: /marketplace/book/:serviceId
 */

import { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar,
  CreditCard,
  FileText,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ServiceIntakeForm } from '@/components/features/marketplace/ServiceIntakeForm';
import { useServiceById } from '@/hooks/useServices';
import { useProviderById } from '@/hooks/useProviders';
import { useCalComAvailability, useSlotSelection, useTimezone, useDateRange } from '@/hooks/useCalComAvailability';
import { cn } from '@/lib/utils';

/**
 * Step indicator component
 */
function StepIndicator({ currentStep, steps }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          {/* Step Circle */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors',
                index < currentStep
                  ? 'bg-green-500 border-green-500 text-white'
                  : index === currentStep
                    ? 'bg-primary border-primary text-black'
                    : 'bg-white border-gray-300 text-gray-400'
              )}
            >
              {index < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                <step.icon className="w-5 h-5" />
              )}
            </div>
            <span
              className={cn(
                'text-xs mt-1 font-medium',
                index <= currentStep ? 'text-gray-900' : 'text-gray-400'
              )}
            >
              {step.label}
            </span>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                'w-12 md:w-20 h-0.5 mx-2',
                index < currentStep ? 'bg-green-500' : 'bg-gray-200'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Service summary sidebar
 */
function ServiceSummary({ service, provider, className }) {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm text-gray-500 uppercase mb-3">
          Your Booking
        </h3>

        {/* Provider */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={provider?.avatarUrl} />
            <AvatarFallback>
              {provider?.name?.slice(0, 2).toUpperCase() || '??'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{provider?.name}</p>
            <p className="text-sm text-gray-500">{provider?.programName}</p>
          </div>
        </div>

        {/* Service Details */}
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <div>
            <p className="text-sm text-gray-500">Service</p>
            <p className="font-medium">{service?.title}</p>
          </div>

          {service?.duration && (
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {service.duration} minutes
              </p>
            </div>
          )}

          <div className="pt-3 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-xl font-bold">${service?.price}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Step 1: Service Context & Intake
 */
function BookingStepContext({
  service,
  intakeData,
  onIntakeChange,
  files,
  onFilesChange,
  onNext
}) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Tell Us About Your Session</h2>
      <p className="text-gray-600 mb-6">
        Help your mentor prepare by sharing details about what you're looking for.
      </p>

      <ServiceIntakeForm
        serviceType={service?.type}
        intakeData={intakeData}
        onIntakeChange={onIntakeChange}
        files={files}
        onFilesChange={onFilesChange}
      />

      <div className="mt-8 flex justify-end">
        <Button onClick={onNext} className="flex items-center gap-2">
          Continue to Schedule
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

/**
 * Step 2: Schedule Selection
 */
function BookingStepSchedule({
  service,
  provider,
  onBack,
  onNext,
  selectedSlots,
  onSlotsChange
}) {
  const { timezone, setTimezone, timezoneOptions } = useTimezone();
  const { startDate, endDate, goToNextWeek, goToPrevWeek, canGoPrev } = useDateRange(14);

  const { slots, loading, error, availableDates, formatSlotTime } = useCalComAvailability({
    eventTypeId: service?.calComEventTypeId,
    providerId: provider?.id,
    startDate,
    endDate,
    timezone
  });

  const {
    selectedSlots: localSelectedSlots,
    toggleSlot,
    isSelected,
    canSelectMore,
    selectionCount
  } = useSlotSelection(3);

  // Sync selected slots up
  useEffect(() => {
    onSlotsChange(localSelectedSlots);
  }, [localSelectedSlots, onSlotsChange]);

  const canContinue = localSelectedSlots.length > 0;

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Choose Your Availability</h2>
      <p className="text-gray-600 mb-6">
        Select up to 3 preferred time slots. Your mentor will confirm one of them.
      </p>

      {/* Timezone Selector */}
      <div className="mb-4">
        <label className="text-sm text-gray-600 block mb-1">Your Timezone</label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2 text-sm"
        >
          {timezoneOptions.map(tz => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPrevWeek}
          disabled={!canGoPrev}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous Week
        </Button>
        <span className="text-sm text-gray-600">
          {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          {' - '}
          {new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <Button variant="outline" size="sm" onClick={goToNextWeek}>
          Next Week
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Time Slots */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : slots.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No available slots in this period.</p>
          <p className="text-sm">Try checking the next week.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
          {slots.map((slot, index) => (
            <button
              key={slot.time}
              data-testid={`time-slot-${index + 1}`}
              onClick={() => toggleSlot(slot)}
              disabled={!canSelectMore && !isSelected(slot)}
              className={cn(
                'p-3 rounded-xl border text-sm transition-colors',
                isSelected(slot)
                  ? 'bg-primary border-primary text-black font-medium'
                  : 'bg-white border-gray-200 hover:border-primary',
                !canSelectMore && !isSelected(slot) && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="font-medium">{formatSlotTime(slot)}</div>
              <div className="text-xs text-gray-500">
                {new Date(slot.time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected Slots Summary */}
      {localSelectedSlots.length > 0 && (
        <div className="p-3 bg-green-50 rounded-xl mb-4" data-testid="selected-times">
          <p className="text-sm font-medium text-green-800 mb-2">
            Your preferred times ({selectionCount}/3):
          </p>
          <div className="space-y-1">
            {localSelectedSlots.map((slot, index) => (
              <div key={slot.time} className="text-sm text-green-700">
                {index + 1}. {formatSlotTime(slot, 'long')}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button onClick={onNext} disabled={!canContinue}>
          Continue to Payment
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

/**
 * Step 3: Review & Payment
 */
function BookingStepPayment({
  service,
  provider,
  intakeData,
  selectedSlots,
  files,
  onBack,
  onSubmit,
  submitting
}) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

  const canSubmit = agreedToTerms && agreedToPolicy && !submitting;

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Review & Confirm</h2>
      <p className="text-gray-600 mb-6">
        Review your booking details and authorize payment.
      </p>

      {/* Booking Summary */}
      <Card className="mb-6">
        <CardContent className="p-4 space-y-4">
          <div>
            <h4 className="font-medium text-sm text-gray-500 mb-2">Service</h4>
            <p className="font-medium">{service?.title}</p>
            <p className="text-sm text-gray-600">with {provider?.name}</p>
          </div>

          <div>
            <h4 className="font-medium text-sm text-gray-500 mb-2">
              Requested Times (Provider will confirm one)
            </h4>
            <ul className="space-y-1">
              {selectedSlots.map((slot, index) => (
                <li key={slot.time} className="text-sm">
                  {index + 1}. {new Date(slot.time).toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </li>
              ))}
            </ul>
          </div>

          {files.length > 0 && (
            <div>
              <h4 className="font-medium text-sm text-gray-500 mb-2">Attachments</h4>
              <ul className="space-y-1">
                {files.map((file, index) => (
                  <li key={index} className="text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Note */}
      <Alert className="mb-6">
        <CreditCard className="w-4 h-4" />
        <AlertDescription>
          <strong>You won't be charged until {provider?.name} accepts your request.</strong>
          <br />
          Your payment method will be authorized for ${service?.price}. The charge will only
          go through when your mentor confirms one of your requested times.
        </AlertDescription>
      </Alert>

      {/* Price Breakdown */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span>Service Price</span>
            <span>${service?.price}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold">${service?.price}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form Placeholder */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-500"
            data-testid="stripe-card-element"
          >
            <p>Stripe Elements Payment Form</p>
            <p className="text-sm">(Will be integrated with Stripe)</p>
          </div>
        </CardContent>
      </Card>

      {/* Terms */}
      <div className="space-y-3 mb-6">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm">
            I agree to the{' '}
            <a href="/terms" className="text-primary underline">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-primary underline">Privacy Policy</a>
          </span>
        </label>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToPolicy}
            onChange={(e) => setAgreedToPolicy(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm">
            I understand the{' '}
            <a href="/marketplace/cancellation-policy" className="text-primary underline">
              cancellation policy
            </a>
            {' '}and that my payment will be authorized but not charged until my request is accepted.
          </span>
        </label>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={submitting}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button onClick={onSubmit} disabled={!canSubmit}>
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Authorize Payment - ${service?.price}
              <ChevronRight className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

/**
 * Main BookingPage Component
 */
export function BookingPage() {
  const { serviceId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get current step from URL or default to 0
  const currentStep = parseInt(searchParams.get('step') || '0');

  // Fetch service and provider
  const { service, loading: serviceLoading, error: serviceError } = useServiceById(serviceId);
  const { provider, loading: providerLoading } = useProviderById(service?.providerId);

  // Booking state
  const [intakeData, setIntakeData] = useState({});
  const [files, setFiles] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Steps config
  const steps = [
    { id: 'context', label: 'Details', icon: FileText },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'payment', label: 'Payment', icon: CreditCard }
  ];

  // Navigation handlers
  const goToStep = (step) => {
    setSearchParams({ step: step.toString() });
  };

  const handleNext = () => {
    goToStep(currentStep + 1);
  };

  const handleBack = () => {
    goToStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      // TODO: Submit booking to API
      console.log('Submit booking:', {
        serviceId,
        intakeData,
        files,
        selectedSlots
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Navigate to confirmation
      navigate('/marketplace/bookings/new-booking-123');
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Breadcrumbs
  const breadcrumbs = [
    { label: 'Marketplace', href: '/marketplace' },
    { label: provider?.name || 'Mentor', href: `/marketplace/mentor/${service?.providerId}` },
    { label: 'Book' }
  ];

  // Loading state
  if (serviceLoading || providerLoading) {
    return (
      <PageWrapper breadcrumbs={breadcrumbs}>
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PageWrapper>
    );
  }

  // Error state
  if (serviceError || !service) {
    return (
      <PageWrapper breadcrumbs={breadcrumbs}>
        <Card className="max-w-lg mx-auto p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Service Not Found</h2>
          <p className="text-gray-600 mb-4">
            This service doesn't exist or is no longer available.
          </p>
          <Link to="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </Card>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper breadcrumbs={breadcrumbs}>
      <div className="max-w-5xl mx-auto">
        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} steps={steps} />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <Card>
              <CardContent className="p-6">
                {currentStep === 0 && (
                  <BookingStepContext
                    service={service}
                    intakeData={intakeData}
                    onIntakeChange={setIntakeData}
                    files={files}
                    onFilesChange={setFiles}
                    onNext={handleNext}
                  />
                )}
                {currentStep === 1 && (
                  <BookingStepSchedule
                    service={service}
                    provider={provider}
                    selectedSlots={selectedSlots}
                    onSlotsChange={setSelectedSlots}
                    onBack={handleBack}
                    onNext={handleNext}
                  />
                )}
                {currentStep === 2 && (
                  <BookingStepPayment
                    service={service}
                    provider={provider}
                    intakeData={intakeData}
                    selectedSlots={selectedSlots}
                    files={files}
                    onBack={handleBack}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80">
            <ServiceSummary
              service={service}
              provider={provider}
              className="lg:sticky lg:top-4"
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default BookingPage;
