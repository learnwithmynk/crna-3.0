/**
 * OnboardingStep1Profile Component
 *
 * Step 1 of provider onboarding - "Your Profile - Professional + Personality"
 *
 * Features:
 * - Professional profile section (tagline, bio, ICU background)
 * - Specializations/tags for services
 * - Personality questions section
 * - Real-time profile preview panel (desktop: side-by-side, mobile: collapsible)
 * - Inline validation with helpful AI tips
 * - Character counters on text inputs
 */

import { useState, useEffect } from 'react';
import {
  Sparkles,
  Briefcase,
  Award,
  AlertCircle,
  ChevronRight,
  User,
  Video,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonalityQuestions } from '@/components/features/provider/PersonalityQuestions';
import { ProfilePreviewPanel } from '@/components/features/provider/ProfilePreviewPanel';
import { WelcomeVideoUpload } from '@/components/features/provider/WelcomeVideoUpload';
import { cn } from '@/lib/utils';

// ICU background types
const ICU_TYPES = [
  { value: 'micu', label: 'MICU (Medical ICU)' },
  { value: 'sicu', label: 'SICU (Surgical ICU)' },
  { value: 'cvicu', label: 'CVICU (Cardiovascular ICU)' },
  { value: 'neuro-icu', label: 'Neuro ICU' },
  { value: 'picu', label: 'PICU (Pediatric ICU)' },
  { value: 'nicu', label: 'NICU (Neonatal ICU)' },
  { value: 'trauma-icu', label: 'Trauma ICU' },
  { value: 'burn-icu', label: 'Burn ICU' },
  { value: 'mixed-icu', label: 'Mixed ICU' },
  { value: 'other', label: 'Other' }
];

// Years of experience options
const YEARS_OPTIONS = Array.from({ length: 20 }, (_, i) => ({
  value: String(i + 1),
  label: i + 1 === 1 ? '1 year' : `${i + 1} years`
}));

// Service specializations
const SPECIALIZATIONS = [
  { value: 'interview-prep', label: 'Interview Prep' },
  { value: 'essay-review', label: 'Essay Review' },
  { value: 'school-selection', label: 'School Selection' },
  { value: 'timeline-planning', label: 'Timeline Planning' },
  { value: 'gpa-strategy', label: 'GPA Strategy' },
  { value: 'clinical-guidance', label: 'Clinical Guidance' },
  { value: 'shadowing-tips', label: 'Shadowing Tips' },
  { value: 'prerequisite-planning', label: 'Prerequisite Planning' },
  { value: 'recommendation-letters', label: 'Recommendation Letters' },
  { value: 'general-mentorship', label: 'General Mentorship' }
];

/**
 * Character counter component
 */
function CharacterCounter({ current, min, max, className }) {
  const remaining = max - current;
  const isNearLimit = remaining < 20;
  const isBelowMin = current < min;

  return (
    <div className={cn('text-xs text-right', className)}>
      {isBelowMin ? (
        <span className="text-gray-500">
          {min - current} more character{min - current !== 1 ? 's' : ''} needed
        </span>
      ) : (
        <span className={isNearLimit ? 'text-orange-600 font-medium' : 'text-gray-400'}>
          {remaining} characters remaining
        </span>
      )}
    </div>
  );
}

/**
 * AI Tip Alert component
 */
function AITip({ children, className }) {
  return (
    <Alert className={cn('bg-purple-50 border-purple-200', className)}>
      <Sparkles className="h-4 w-4 text-purple-600" />
      <AlertDescription className="text-purple-700 text-sm">
        {children}
      </AlertDescription>
    </Alert>
  );
}

export function OnboardingStep1Profile({
  data = {},
  onChange,
  onNext,
  onBack,
  className
}) {
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [videoUploadError, setVideoUploadError] = useState(null);

  // Extract current values
  const {
    tagline = '',
    bio = '',
    icuType = '',
    icuYears = '',
    specializations = [],
    personality = {},
    welcomeVideoUrl = '',
    welcomeVideoThumbnailUrl = '',
    welcomeVideoDurationSeconds = null,
  } = data;

  // Handle field changes - pass as object to match parent's expected signature
  const handleFieldChange = (field, value) => {
    onChange?.({ [field]: value });
    setTouched({ ...touched, [field]: true });
  };

  // Handle specialization toggle
  const handleSpecializationToggle = (specValue) => {
    const newSpecializations = specializations.includes(specValue)
      ? specializations.filter(s => s !== specValue)
      : [...specializations, specValue];
    handleFieldChange('specializations', newSpecializations);
  };

  // Handle video upload
  const handleVideoUpload = async (file, duration) => {
    setVideoUploadError(null);
    setIsUploadingVideo(true);
    setVideoUploadProgress(0);

    try {
      // TODO: Replace with actual Supabase Storage upload
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setVideoUploadProgress(i);
      }

      // Mock successful upload - create a blob URL for preview
      const videoUrl = URL.createObjectURL(file);

      // Update profile data with video info
      onChange?.({
        welcomeVideoUrl: videoUrl,
        welcomeVideoDurationSeconds: Math.round(duration),
        // TODO: Generate thumbnail from video
        welcomeVideoThumbnailUrl: null,
      });

      console.log('Video uploaded:', { file: file.name, duration });
    } catch (error) {
      console.error('Video upload failed:', error);
      setVideoUploadError('Upload failed. Please try again.');
    } finally {
      setIsUploadingVideo(false);
      setVideoUploadProgress(0);
    }
  };

  // Handle video delete
  const handleVideoDelete = () => {
    // Revoke blob URL if it exists
    if (welcomeVideoUrl && welcomeVideoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(welcomeVideoUrl);
    }

    onChange?.({
      welcomeVideoUrl: '',
      welcomeVideoThumbnailUrl: '',
      welcomeVideoDurationSeconds: null,
    });
  };

  // Validate form
  const validate = () => {
    const errors = {};

    // Tagline validation
    if (!tagline || tagline.trim().length === 0) {
      errors.tagline = 'Tagline is required';
    } else if (tagline.length < 50) {
      errors.tagline = 'Tagline must be at least 50 characters';
    } else if (tagline.length > 100) {
      errors.tagline = 'Tagline must be 100 characters or less';
    }

    // Bio validation
    if (!bio || bio.trim().length === 0) {
      errors.bio = 'Bio is required';
    } else if (bio.length < 200) {
      errors.bio = 'Bio must be at least 200 characters';
    }

    // ICU type validation
    if (!icuType) {
      errors.icuType = 'ICU background is required';
    }

    // ICU years validation
    if (!icuYears) {
      errors.icuYears = 'Years of ICU experience is required';
    }

    return errors;
  };

  // Handle next button
  const handleNext = () => {
    const errors = validate();
    setValidationErrors(errors);

    // Mark all fields as touched
    setTouched({
      tagline: true,
      bio: true,
      icuType: true,
      icuYears: true
    });

    if (Object.keys(errors).length === 0) {
      onNext?.();
    }
  };

  // Check if form is valid
  const isValid = Object.keys(validate()).length === 0;

  // Prepare profile data for preview
  const profilePreviewData = {
    tagline,
    bio,
    personality,
    welcomeVideoUrl,
    welcomeVideoThumbnailUrl,
    welcomeVideoDurationSeconds,
    // Add other fields as needed for preview
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Desktop: two-column layout. Mobile: stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - Professional + Personality sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Professional Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Professional Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tagline */}
              <div className="space-y-2">
                <Label htmlFor="tagline" className="text-base font-semibold">
                  Tagline <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-gray-600">
                  A catchy one-liner that introduces you (50-100 characters)
                </p>
                <Input
                  id="tagline"
                  value={tagline}
                  onChange={(e) => handleFieldChange('tagline', e.target.value)}
                  placeholder="Example: Making ICU to SRNA transitions less scary!"
                  maxLength={100}
                  className={cn(
                    touched.tagline && validationErrors.tagline && 'border-red-300 focus:border-red-500'
                  )}
                />
                <CharacterCounter
                  current={tagline.length}
                  min={50}
                  max={100}
                />
                {touched.tagline && validationErrors.tagline && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {validationErrors.tagline}
                  </p>
                )}
                <AITip>
                  Example: "Making ICU to SRNA transitions less scary!" or "Your personal guide from bedside to anesthesia"
                </AITip>
              </div>

              {/* Extended Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-base font-semibold">
                  Extended Bio <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-gray-600">
                  Tell your story! What made you pursue CRNA? (200-500 words)
                </p>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => handleFieldChange('bio', e.target.value)}
                  placeholder="Share your journey! What made you pursue CRNA? What was your ICU experience like? What do you wish you knew when applying?"
                  rows={6}
                  maxLength={2000}
                  className={cn(
                    'w-full px-3 py-2 border rounded-xl resize-none',
                    'focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none',
                    touched.bio && validationErrors.bio && 'border-red-300 focus:border-red-500'
                  )}
                />
                <CharacterCounter
                  current={bio.length}
                  min={200}
                  max={2000}
                />
                {touched.bio && validationErrors.bio && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {validationErrors.bio}
                  </p>
                )}
                <AITip>
                  Share your journey! What made you pursue CRNA? What was your ICU experience like? What do you wish you knew when applying?
                </AITip>
              </div>

              {/* ICU Background */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icuType" className="text-base font-semibold">
                    ICU Background <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={icuType}
                    onValueChange={(value) => handleFieldChange('icuType', value)}
                  >
                    <SelectTrigger
                      id="icuType"
                      className={cn(
                        touched.icuType && validationErrors.icuType && 'border-red-300'
                      )}
                    >
                      <SelectValue placeholder="Select ICU type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ICU_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {touched.icuType && validationErrors.icuType && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {validationErrors.icuType}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icuYears" className="text-base font-semibold">
                    Years of ICU Experience <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={icuYears}
                    onValueChange={(value) => handleFieldChange('icuYears', value)}
                  >
                    <SelectTrigger
                      id="icuYears"
                      className={cn(
                        touched.icuYears && validationErrors.icuYears && 'border-red-300'
                      )}
                    >
                      <SelectValue placeholder="Select years" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {touched.icuYears && validationErrors.icuYears && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {validationErrors.icuYears}
                    </p>
                  )}
                </div>
              </div>

              {/* Specializations */}
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Specializations
                </Label>
                <p className="text-sm text-gray-600">
                  Select the areas where you can provide the most value (optional)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SPECIALIZATIONS.map((spec) => (
                    <div key={spec.value} className="flex items-start space-x-2">
                      <Checkbox
                        id={spec.value}
                        checked={specializations.includes(spec.value)}
                        onCheckedChange={() => handleSpecializationToggle(spec.value)}
                      />
                      <label
                        htmlFor={spec.value}
                        className="text-sm text-gray-700 cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {spec.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Welcome Video Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-600" />
                Welcome Video
                <span className="text-sm font-normal text-gray-500">(Optional)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                A short video introduction helps applicants get to know you before booking.
                Profiles with videos get 2x more bookings!
              </p>
              <WelcomeVideoUpload
                videoUrl={welcomeVideoUrl}
                thumbnailUrl={welcomeVideoThumbnailUrl}
                durationSeconds={welcomeVideoDurationSeconds}
                onUpload={handleVideoUpload}
                onDelete={handleVideoDelete}
                isUploading={isUploadingVideo}
                uploadProgress={videoUploadProgress}
                error={videoUploadError}
              />
            </CardContent>
          </Card>

          {/* Personality Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Personality Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PersonalityQuestions
                value={personality}
                onChange={(newPersonality) => handleFieldChange('personality', newPersonality)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Profile Preview Panel - Desktop: sticky sidebar, Mobile: collapsible */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6">
            <ProfilePreviewPanel profileData={profilePreviewData} />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        {onBack ? (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            Back
          </Button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-3">
          {!isValid && (
            <p className="text-sm text-gray-500 hidden sm:block">
              Complete all required fields to continue
            </p>
          )}
          <Button
            type="button"
            onClick={handleNext}
            className="min-w-[120px]"
          >
            Next Step
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingStep1Profile;
