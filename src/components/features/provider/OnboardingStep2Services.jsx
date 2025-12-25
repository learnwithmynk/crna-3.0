/**
 * OnboardingStep2Services Component
 *
 * Step 2 of provider onboarding - "Your Services"
 *
 * Features:
 * - Enable/disable toggle for each service type
 * - Service template integration for quick descriptions
 * - Custom description editor with AI writing tips
 * - Price input with suggested range indicators
 * - Duration selection dropdown
 * - Deliverables checklist (what provider will provide)
 * - Instant Book toggle per service
 * - Validation: at least one service enabled, enabled services need description + price
 *
 * Service Types:
 * - Mock Interview ($75-150, 30-90min)
 * - Essay Review ($50-100, 30-60min)
 * - Coaching ($60-120, 45-90min)
 * - Q&A Call ($40-75, 30-45min)
 */

import { useState, useEffect } from 'react';
import {
  FileText,
  Video,
  MessageSquare,
  HelpCircle,
  DollarSign,
  Clock,
  CheckSquare,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ServiceTemplates } from '@/components/features/provider/ServiceTemplates';
import { cn } from '@/lib/utils';

// Service configurations
const SERVICE_CONFIGS = {
  mock_interview: {
    id: 'mock_interview',
    title: 'Mock Interview',
    icon: Video,
    description: 'Practice interview with real-time feedback',
    priceRange: { min: 75, max: 150 },
    durations: ['30min', '45min', '60min', '90min'],
    deliverables: [
      { id: 'realtime_feedback', label: 'Real-time feedback during interview' },
      { id: 'written_summary', label: 'Written summary of strengths/areas to improve' },
      { id: 'recording', label: 'Recording of the mock interview' },
      { id: 'followup_qa', label: 'Follow-up Q&A (15 min)' }
    ],
    aiTip: 'Be specific! Instead of "I\'ll help with your interview", try "I\'ll simulate real CRNA program questions and give honest feedback on your answers, body language, and how to stand out."',
    color: 'purple'
  },
  essay_review: {
    id: 'essay_review',
    title: 'Essay Review',
    icon: FileText,
    description: 'Detailed feedback on personal statements',
    priceRange: { min: 50, max: 100 },
    durations: ['30min', '45min', '60min'],
    deliverables: [
      { id: 'inline_comments', label: 'Inline comments on your essay' },
      { id: 'summary_feedback', label: 'Summary feedback document' },
      { id: 'revision_suggestions', label: 'Specific revision suggestions' },
      { id: 'second_review', label: 'Second review after revisions' }
    ],
    aiTip: 'Highlight what makes YOUR feedback unique. Do you focus on storytelling? Authenticity? Standing out from other applicants? Be specific!',
    color: 'blue'
  },
  coaching: {
    id: 'coaching',
    title: 'Coaching/Strategy',
    icon: MessageSquare,
    description: 'Application strategy and planning session',
    priceRange: { min: 60, max: 120 },
    durations: ['45min', '60min', '90min'],
    deliverables: [
      { id: 'action_plan', label: 'Personalized action plan' },
      { id: 'school_list', label: 'School list recommendations' },
      { id: 'timeline', label: 'Application timeline' },
      { id: 'email_followup', label: 'Email follow-up with resources' }
    ],
    aiTip: 'What\'s your coaching style? Are you a cheerleader, strategist, or tough-love coach? Let applicants know what to expect from a session with you.',
    color: 'green'
  },
  qa_call: {
    id: 'qa_call',
    title: 'Q&A Call',
    icon: HelpCircle,
    description: 'Open Q&A about CRNA journey',
    priceRange: { min: 40, max: 75 },
    durations: ['30min', '45min'],
    deliverables: [
      { id: 'notes_summary', label: 'Notes summary of key takeaways' },
      { id: 'resource_links', label: 'Relevant resource links' }
    ],
    aiTip: 'This is your most casual offering. What topics do you love talking about? ICU experience? Student life? Be conversational and welcoming!',
    color: 'orange'
  }
};

const COLOR_CLASSES = {
  purple: 'border-purple-200 bg-purple-50',
  blue: 'border-blue-200 bg-blue-50',
  green: 'border-green-200 bg-green-50',
  orange: 'border-orange-200 bg-orange-50'
};

// Individual service card component
function ServiceCard({ serviceConfig, serviceData, onChange }) {
  const [showTemplates, setShowTemplates] = useState(false);
  const Icon = serviceConfig.icon;
  const isEnabled = serviceData?.enabled || false;
  const description = serviceData?.description || '';
  const price = serviceData?.price || '';
  const duration = serviceData?.duration || '';
  const deliverables = serviceData?.deliverables || [];
  const instantBook = serviceData?.instantBook || false;

  // Validation states
  const needsDescription = isEnabled && (!description || description.length < 50);
  const needsPrice = isEnabled && !price;
  const hasErrors = needsDescription || needsPrice;

  const handleFieldChange = (field, value) => {
    onChange(serviceConfig.id, field, value);
  };

  const handleTemplateSelect = (templateDescription) => {
    handleFieldChange('description', templateDescription);
    setShowTemplates(false);
  };

  const toggleDeliverable = (deliverableId) => {
    const newDeliverables = deliverables.includes(deliverableId)
      ? deliverables.filter(id => id !== deliverableId)
      : [...deliverables, deliverableId];
    handleFieldChange('deliverables', newDeliverables);
  };

  return (
    <Card className={cn(
      'transition-all',
      isEnabled ? COLOR_CLASSES[serviceConfig.color] : 'opacity-60'
    )}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className={cn(
              'p-2 rounded-xl',
              isEnabled ? 'bg-white' : 'bg-gray-100'
            )}>
              <Icon className={cn(
                'w-6 h-6',
                isEnabled ? 'text-gray-700' : 'text-gray-400'
              )} />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {serviceConfig.title}
                {hasErrors && isEnabled && (
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                )}
              </CardTitle>
              <CardDescription className="mt-1">
                {serviceConfig.description}
              </CardDescription>
            </div>
          </div>

          {/* Enable/Disable Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <Label htmlFor={`${serviceConfig.id}-toggle`} className="text-sm text-gray-600">
              {isEnabled ? 'Enabled' : 'Disabled'}
            </Label>
            <Switch
              id={`${serviceConfig.id}-toggle`}
              checked={isEnabled}
              onCheckedChange={(checked) => handleFieldChange('enabled', checked)}
            />
          </div>
        </div>
      </CardHeader>

      {/* Service Configuration (only shown when enabled) */}
      {isEnabled && (
        <CardContent className="pt-0 space-y-6">
          {/* Description Section */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <Label className="text-sm font-semibold">
                Service Description
                {needsDescription && (
                  <span className="text-orange-500 ml-1">* (min 50 characters)</span>
                )}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-xs h-7"
              >
                {showTemplates ? (
                  <>
                    <ChevronUp className="w-3 h-3 mr-1" />
                    Hide Templates
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 mr-1" />
                    Show Templates
                  </>
                )}
              </Button>
            </div>

            {/* Templates (collapsible) */}
            {showTemplates && (
              <div className="mb-3">
                <ServiceTemplates
                  serviceType={serviceConfig.id}
                  onSelectTemplate={handleTemplateSelect}
                  currentDescription={description}
                />
              </div>
            )}

            {/* AI Writing Tip */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2">
              <Lightbulb className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-blue-900 mb-1">AI Writing Tip:</p>
                <p className="text-xs text-blue-800">{serviceConfig.aiTip}</p>
              </div>
            </div>

            {/* Description Textarea */}
            <Textarea
              value={description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder={`Describe what applicants can expect from your ${serviceConfig.title.toLowerCase()} service...`}
              rows={4}
              className={cn(
                'bg-white',
                needsDescription && 'border-orange-300 focus:border-orange-500'
              )}
            />
            <div className="flex items-center justify-between text-xs">
              <span className={cn(
                description.length < 50 ? 'text-orange-600' : 'text-gray-500'
              )}>
                {description.length} / 50 min characters
              </span>
              <span className="text-gray-400">
                {500 - description.length} remaining
              </span>
            </div>
          </div>

          {/* Price & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Price (USD)
                {needsPrice && (
                  <span className="text-orange-500 ml-1">*</span>
                )}
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => handleFieldChange('price', e.target.value)}
                  placeholder="75"
                  className={cn(
                    'pl-9 bg-white',
                    needsPrice && 'border-orange-300 focus:border-orange-500'
                  )}
                  min={serviceConfig.priceRange.min}
                  max={serviceConfig.priceRange.max}
                />
              </div>
              <p className="text-xs text-gray-500">
                Suggested range: ${serviceConfig.priceRange.min}-${serviceConfig.priceRange.max}
              </p>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Duration</Label>
              <Select
                value={duration}
                onValueChange={(value) => handleFieldChange('duration', value)}
              >
                <SelectTrigger className="bg-white">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <SelectValue placeholder="Select duration..." />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {serviceConfig.durations.map((dur) => (
                    <SelectItem key={dur} value={dur}>
                      {dur.replace('min', ' minutes')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Deliverables */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              What You'll Provide
            </Label>
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
              {serviceConfig.deliverables.map((deliverable) => (
                <div key={deliverable.id} className="flex items-start gap-3">
                  <Checkbox
                    id={`${serviceConfig.id}-${deliverable.id}`}
                    checked={deliverables.includes(deliverable.id)}
                    onCheckedChange={() => toggleDeliverable(deliverable.id)}
                  />
                  <Label
                    htmlFor={`${serviceConfig.id}-${deliverable.id}`}
                    className="text-sm text-gray-700 cursor-pointer font-normal"
                  >
                    {deliverable.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Instant Book Toggle */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Label className="text-sm font-semibold">Instant Book</Label>
                <p className="text-xs text-gray-600 mt-1">
                  Allow applicants to book immediately without approval. You can still
                  manage your calendar and availability.
                </p>
              </div>
              <Switch
                checked={instantBook}
                onCheckedChange={(checked) => handleFieldChange('instantBook', checked)}
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// Main component
export function OnboardingStep2Services({ data = {}, onChange, onNext, onBack }) {
  // Validation
  const enabledServices = Object.entries(data).filter(([_, service]) => service?.enabled);
  const hasEnabledServices = enabledServices.length > 0;

  const invalidServices = enabledServices.filter(([_, service]) => {
    const hasDescription = service.description && service.description.length >= 50;
    const hasPrice = service.price && parseFloat(service.price) > 0;
    return !hasDescription || !hasPrice;
  });

  const canProceed = hasEnabledServices && invalidServices.length === 0;

  const handleServiceChange = (serviceId, field, value) => {
    const currentService = data[serviceId] || {};
    onChange({
      ...data,
      [serviceId]: {
        ...currentService,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your Services
        </h2>
        <p className="text-gray-600">
          Choose which services you'd like to offer and configure the details.
          Enable at least one service to continue.
        </p>
      </div>

      {/* Service Cards */}
      <div className="space-y-4">
        {Object.values(SERVICE_CONFIGS).map((serviceConfig) => (
          <ServiceCard
            key={serviceConfig.id}
            serviceConfig={serviceConfig}
            serviceData={data[serviceConfig.id]}
            onChange={handleServiceChange}
          />
        ))}
      </div>

      {/* Validation Messages */}
      {!hasEnabledServices && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-orange-900">
              Enable at least one service
            </p>
            <p className="text-xs text-orange-800 mt-1">
              Toggle on at least one service type to continue with your provider application.
            </p>
          </div>
        </div>
      )}

      {invalidServices.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-orange-900">
              Complete required fields
            </p>
            <p className="text-xs text-orange-800 mt-1">
              Enabled services need a description (min 50 characters) and a price.
            </p>
          </div>
        </div>
      )}

      {/* Summary */}
      {hasEnabledServices && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-green-800">
            <strong>{enabledServices.length}</strong> service{enabledServices.length !== 1 ? 's' : ''} enabled
            {canProceed && ' - Ready to continue!'}
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={onBack}
          className="min-w-[120px]"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="min-w-[120px]"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export default OnboardingStep2Services;
