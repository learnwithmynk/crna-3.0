/**
 * ProviderProfilePage
 *
 * Profile editor for SRNA providers/mentors.
 * Route: /marketplace/provider/profile
 *
 * Features:
 * - Comprehensive profile form (bio, personality questions, background)
 * - Live preview panel showing how profile appears to applicants
 * - Profile completeness indicator with checklist
 * - Save/publish functionality
 * - Mobile-responsive (side-by-side on desktop, stacked on mobile)
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Save,
  Eye,
  Upload,
  Star,
  Clock,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Info,
  Video,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PersonalityDisplay } from '@/components/features/marketplace/PersonalityDisplay';
import { WelcomeVideoUpload, WelcomeVideoPreview } from '@/components/features/provider/WelcomeVideoUpload';
import { cn } from '@/lib/utils';

// MOCK DATA - Current provider profile
// TODO: Replace with API call to GET /api/marketplace/providers/me
const mockCurrentProfile = {
  id: 'provider_001',
  userId: 'user_001',
  displayName: 'Sarah Martinez',
  bio: 'Second-year SRNA at Georgetown University. Previously worked in CVICU for 5 years at Johns Hopkins. I love helping applicants prepare for interviews and understand what programs are really looking for.',
  avatarUrl: null,
  programName: 'Georgetown University',
  graduationYear: 2026,
  yearsExperience: 5,
  icuType: 'CVICU',
  specialties: ['Interview Prep', 'Essay Review', 'CVICU Experience'],

  // Fun personality questions
  personality: {
    if_you_knew_me: 'I drink way too much coffee and can talk about hemodynamics for hours',
    zodiac_sign: 'Virgo',
    icu_vibe: 'Organized chaos',
    cats_or_dogs: 'Dogs 🐕',
    favorite_patient_population: 'Post-CABG patients',
    road_trip_music: 'True crime podcasts and 2000s pop',
    weird_fact: 'I can name every Friends episode by the opening scene',
    comfort_food: 'Pho',
    when_not_studying: 'Hiking with my golden retriever',
    motto: 'Done is better than perfect'
  },

  // Social links (optional)
  linkedinUrl: '',
  instagramUrl: '',

  // Welcome video (optional)
  welcomeVideoUrl: '',
  welcomeVideoThumbnailUrl: '',
  welcomeVideoDurationSeconds: null,

  // Stats (for preview)
  rating: 4.9,
  reviewCount: 27,
  totalSessions: 42,
  responseTime: '2 hours',
};

// Specialty options for multi-select
const SPECIALTY_OPTIONS = [
  'Interview Prep',
  'Essay Review',
  'Resume Review',
  'School Selection',
  'CVICU Experience',
  'MICU Experience',
  'SICU Experience',
  'Neuro ICU Experience',
  'PICU Experience',
  'Application Strategy',
  'GRE Prep',
  'Time Management',
  'Study Skills',
  'Work-Life Balance'
];

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
 * Calculate profile completeness
 */
function calculateCompleteness(profile) {
  const fields = [
    { key: 'displayName', label: 'Display name', required: true },
    { key: 'bio', label: 'Bio/about', required: true },
    { key: 'programName', label: 'CRNA school', required: true },
    { key: 'graduationYear', label: 'Graduation year', required: true },
    { key: 'yearsExperience', label: 'Years of experience', required: true },
    { key: 'icuType', label: 'ICU type', required: true },
    { key: 'specialties', label: 'Specialties (at least 2)', required: true, validator: (val) => Array.isArray(val) && val.length >= 2 },
    { key: 'avatarUrl', label: 'Profile photo', required: false },
    { key: 'welcomeVideoUrl', label: 'Welcome video', required: false },
    { key: 'personality.motto', label: 'Life motto', required: false },
    { key: 'personality.if_you_knew_me', label: 'If you knew me...', required: false },
    { key: 'personality.comfort_food', label: 'Comfort food', required: false },
    { key: 'linkedinUrl', label: 'LinkedIn URL', required: false },
  ];

  const getValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  };

  const completed = fields.filter(field => {
    const value = getValue(profile, field.key);
    if (field.validator) {
      return field.validator(value);
    }
    return value && value.toString().trim().length > 0;
  });

  const requiredFields = fields.filter(f => f.required);
  const completedRequired = completed.filter(f => f.required);

  return {
    total: fields.length,
    completed: completed.length,
    percentage: Math.round((completed.length / fields.length) * 100),
    requiredTotal: requiredFields.length,
    requiredCompleted: completedRequired.length,
    isPublishable: completedRequired.length === requiredFields.length,
    fields: fields.map(f => ({
      ...f,
      completed: completed.some(c => c.key === f.key)
    }))
  };
}

/**
 * Live Preview Panel
 */
function ProfilePreview({ profile }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Eye className="w-4 h-4 text-gray-500" />
        <h3 className="font-semibold text-gray-900">Live Preview</h3>
        <span className="text-xs text-gray-500">(How applicants will see you)</span>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Avatar & Basic Info */}
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="w-20 h-20 border-4 border-primary/20">
              <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
              <AvatarFallback className="bg-primary/10 text-xl font-bold">
                {getInitials(profile.displayName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {profile.displayName || 'Your Name'}
              </h2>
              <div className="flex items-center gap-2 text-gray-600 mt-1 text-sm">
                <GraduationCap className="w-4 h-4" />
                <span>{profile.programName || 'Your School'}</span>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{profile.rating}</span>
                  <span className="text-gray-500">({profile.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="w-3 h-3" />
                  <span>Responds in {profile.responseTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Video */}
          {profile.welcomeVideoUrl && (
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h3 className="font-semibold mb-2 text-sm flex items-center gap-2">
                <Video className="w-4 h-4" />
                Introduction
              </h3>
              <WelcomeVideoPreview
                videoUrl={profile.welcomeVideoUrl}
                thumbnailUrl={profile.welcomeVideoThumbnailUrl}
                durationSeconds={profile.welcomeVideoDurationSeconds}
                providerName={profile.displayName}
                className="aspect-video"
              />
            </div>
          )}

          {/* Bio */}
          {profile.bio && (
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h3 className="font-semibold mb-2 text-sm">About</h3>
              <p className="text-gray-700 text-sm whitespace-pre-line">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Background Info */}
          <div className="grid grid-cols-2 gap-3 mb-6 pb-6 border-b border-gray-100">
            {profile.icuType && (
              <div>
                <p className="text-xs text-gray-500 uppercase">ICU Experience</p>
                <p className="font-medium text-sm">{profile.icuType}</p>
                {profile.yearsExperience && (
                  <p className="text-xs text-gray-600">{profile.yearsExperience} years</p>
                )}
              </div>
            )}
            {profile.graduationYear && (
              <div>
                <p className="text-xs text-gray-500 uppercase">Graduating</p>
                <p className="font-medium text-sm">{profile.graduationYear}</p>
              </div>
            )}
          </div>

          {/* Specialties */}
          {profile.specialties && profile.specialties.length > 0 && (
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase mb-2">Specialties</p>
              <div className="flex flex-wrap gap-1">
                {profile.specialties.map(specialty => (
                  <Badge key={specialty} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Personality Preview */}
          {profile.personality && Object.values(profile.personality).some(v => v) && (
            <div className="pt-6 border-t border-gray-100">
              <PersonalityDisplay personality={profile.personality} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Profile Completeness Widget
 */
function CompletenessWidget({ completeness }) {
  return (
    <Card className={cn(
      "border-2",
      completeness.isPublishable ? "border-green-200 bg-green-50/50" : "border-yellow-200 bg-yellow-50/50"
    )}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          {completeness.isPublishable ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Profile Ready!
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              Complete Your Profile
            </>
          )}
        </CardTitle>
        <CardDescription>
          {completeness.isPublishable
            ? 'Your profile meets all requirements. Complete optional fields for better visibility!'
            : `${completeness.requiredCompleted}/${completeness.requiredTotal} required fields complete`
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-gray-600">Overall Completeness</span>
            <span className="font-bold text-gray-900">{completeness.percentage}%</span>
          </div>
          <Progress value={completeness.percentage} className="h-2" />
        </div>

        {/* Checklist */}
        <div className="space-y-1.5">
          {completeness.fields.map(field => (
            <div key={field.key} className="flex items-start gap-2 text-sm">
              {field.completed ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 mt-0.5" />
              )}
              <div className="flex-1">
                <span className={cn(
                  field.completed ? 'text-gray-500' : 'text-gray-900 font-medium'
                )}>
                  {field.label}
                </span>
                {field.required && !field.completed && (
                  <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {!completeness.isPublishable && (
          <Alert variant="warning">
            <Info className="w-4 h-4" />
            <AlertDescription className="text-xs">
              Complete all required fields to publish your profile and start receiving bookings.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

export function ProviderProfilePage() {
  const [profile, setProfile] = useState(mockCurrentProfile);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [videoUploadError, setVideoUploadError] = useState(null);

  // Calculate completeness
  const completeness = useMemo(() => calculateCompleteness(profile), [profile]);

  // Handle field changes
  const updateField = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setSaveSuccess(false);
  };

  // Handle nested personality field changes
  const updatePersonality = (field, value) => {
    setProfile(prev => ({
      ...prev,
      personality: {
        ...prev.personality,
        [field]: value
      }
    }));
    setSaveSuccess(false);
  };

  // Toggle specialty
  const toggleSpecialty = (specialty) => {
    setProfile(prev => {
      const current = prev.specialties || [];
      const newSpecialties = current.includes(specialty)
        ? current.filter(s => s !== specialty)
        : [...current, specialty];
      return { ...prev, specialties: newSpecialties };
    });
    setSaveSuccess(false);
  };

  // Handle video upload
  const handleVideoUpload = async (file, duration) => {
    setVideoUploadError(null);
    setIsUploadingVideo(true);
    setVideoUploadProgress(0);

    try {
      // TODO: Replace with actual Supabase Storage upload
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setVideoUploadProgress(i);
      }

      const videoUrl = URL.createObjectURL(file);

      setProfile(prev => ({
        ...prev,
        welcomeVideoUrl: videoUrl,
        welcomeVideoDurationSeconds: Math.round(duration),
        welcomeVideoThumbnailUrl: null,
      }));

      setSaveSuccess(false);
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
    if (profile.welcomeVideoUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(profile.welcomeVideoUrl);
    }

    setProfile(prev => ({
      ...prev,
      welcomeVideoUrl: '',
      welcomeVideoThumbnailUrl: '',
      welcomeVideoDurationSeconds: null,
    }));
    setSaveSuccess(false);
  };

  // Handle save
  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);

    // TODO: Replace with API call
    // await updateProviderProfile(profile);

    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Edit Profile
            </h1>
            <p className="text-gray-600">
              Update your mentor profile to attract the right applicants
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving || !completeness.isPublishable}
            size="lg"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Profile saved successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Main Grid: Editor + Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Editor Form */}
          <div className="space-y-6">
            {/* Completeness Widget */}
            <CompletenessWidget completeness={completeness} />

            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Your name and professional background
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Display Name */}
                <div>
                  <Label htmlFor="displayName">
                    Display Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="displayName"
                    value={profile.displayName}
                    onChange={(e) => updateField('displayName', e.target.value)}
                    placeholder="e.g., Sarah Martinez"
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    How you'll appear to applicants
                  </p>
                </div>

                {/* Bio */}
                <div>
                  <Label htmlFor="bio">
                    About / Bio <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => updateField('bio', e.target.value)}
                    placeholder="Tell applicants about your background, expertise, and what you can help with..."
                    rows={5}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {profile.bio?.length || 0}/500 characters
                  </p>
                </div>

                {/* Profile Photo */}
                <div>
                  <Label htmlFor="avatar">Profile Photo</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Avatar className="w-16 h-16 border-2 border-gray-200">
                      <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
                      <AvatarFallback className="bg-gray-100">
                        {getInitials(profile.displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Profiles with photos get 3x more bookings
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Welcome Video */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-blue-600" />
                  Welcome Video
                  <span className="text-sm font-normal text-gray-500">(Optional)</span>
                </CardTitle>
                <CardDescription>
                  A short video introduction helps applicants get to know you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WelcomeVideoUpload
                  videoUrl={profile.welcomeVideoUrl}
                  thumbnailUrl={profile.welcomeVideoThumbnailUrl}
                  durationSeconds={profile.welcomeVideoDurationSeconds}
                  onUpload={handleVideoUpload}
                  onDelete={handleVideoDelete}
                  isUploading={isUploadingVideo}
                  uploadProgress={videoUploadProgress}
                  error={videoUploadError}
                />
              </CardContent>
            </Card>

            {/* Education & Background */}
            <Card>
              <CardHeader>
                <CardTitle>Education & Experience</CardTitle>
                <CardDescription>
                  Your CRNA program and clinical background
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* CRNA School */}
                <div>
                  <Label htmlFor="programName">
                    CRNA School <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="programName"
                    value={profile.programName}
                    onChange={(e) => updateField('programName', e.target.value)}
                    placeholder="e.g., Georgetown University"
                  />
                </div>

                {/* Graduation Year */}
                <div>
                  <Label htmlFor="graduationYear">
                    Expected Graduation Year <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="graduationYear"
                    type="number"
                    value={profile.graduationYear}
                    onChange={(e) => updateField('graduationYear', parseInt(e.target.value))}
                    placeholder="2026"
                    min={2024}
                    max={2030}
                  />
                </div>

                {/* ICU Type */}
                <div>
                  <Label htmlFor="icuType">
                    Primary ICU Type <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="icuType"
                    value={profile.icuType}
                    onChange={(e) => updateField('icuType', e.target.value)}
                    placeholder="e.g., CVICU, MICU, SICU"
                  />
                </div>

                {/* Years Experience */}
                <div>
                  <Label htmlFor="yearsExperience">
                    Years of ICU Experience <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="yearsExperience"
                    type="number"
                    value={profile.yearsExperience}
                    onChange={(e) => updateField('yearsExperience', parseInt(e.target.value))}
                    placeholder="5"
                    min={0}
                    max={30}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Specialties */}
            <Card>
              <CardHeader>
                <CardTitle>Specialties & Focus Areas</CardTitle>
                <CardDescription>
                  Select at least 2 areas you can help with <span className="text-red-500">*</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {SPECIALTY_OPTIONS.map(specialty => {
                    const isSelected = profile.specialties?.includes(specialty);
                    return (
                      <button
                        key={specialty}
                        onClick={() => toggleSpecialty(specialty)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm border transition-colors",
                          isSelected
                            ? "bg-primary border-primary text-gray-900 font-medium"
                            : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                        )}
                      >
                        {specialty}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Selected: {profile.specialties?.length || 0} (minimum 2)
                </p>
              </CardContent>
            </Card>

            {/* Personality Questions */}
            <Card>
              <CardHeader>
                <CardTitle>Personality Questions</CardTitle>
                <CardDescription>
                  Fun questions that help applicants find mentors they vibe with
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="if_you_knew_me">If you knew me, you'd know...</Label>
                  <Input
                    id="if_you_knew_me"
                    value={profile.personality?.if_you_knew_me || ''}
                    onChange={(e) => updatePersonality('if_you_knew_me', e.target.value)}
                    placeholder="e.g., I drink way too much coffee"
                    maxLength={100}
                  />
                </div>

                <div>
                  <Label htmlFor="motto">Life Motto</Label>
                  <Input
                    id="motto"
                    value={profile.personality?.motto || ''}
                    onChange={(e) => updatePersonality('motto', e.target.value)}
                    placeholder="e.g., Done is better than perfect"
                    maxLength={100}
                  />
                </div>

                <div>
                  <Label htmlFor="comfort_food">Comfort Food</Label>
                  <Input
                    id="comfort_food"
                    value={profile.personality?.comfort_food || ''}
                    onChange={(e) => updatePersonality('comfort_food', e.target.value)}
                    placeholder="e.g., Pho"
                    maxLength={50}
                  />
                </div>

                <div>
                  <Label htmlFor="cats_or_dogs">Cats or Dogs?</Label>
                  <Input
                    id="cats_or_dogs"
                    value={profile.personality?.cats_or_dogs || ''}
                    onChange={(e) => updatePersonality('cats_or_dogs', e.target.value)}
                    placeholder="e.g., Dogs 🐕"
                    maxLength={50}
                  />
                </div>

                <div>
                  <Label htmlFor="road_trip_music">Road Trip Music</Label>
                  <Input
                    id="road_trip_music"
                    value={profile.personality?.road_trip_music || ''}
                    onChange={(e) => updatePersonality('road_trip_music', e.target.value)}
                    placeholder="e.g., True crime podcasts and 2000s pop"
                    maxLength={100}
                  />
                </div>

                <div>
                  <Label htmlFor="when_not_studying">When Not Studying, I'm...</Label>
                  <Input
                    id="when_not_studying"
                    value={profile.personality?.when_not_studying || ''}
                    onChange={(e) => updatePersonality('when_not_studying', e.target.value)}
                    placeholder="e.g., Hiking with my golden retriever"
                    maxLength={100}
                  />
                </div>

                <div>
                  <Label htmlFor="weird_fact">Weird Fact About Me</Label>
                  <Input
                    id="weird_fact"
                    value={profile.personality?.weird_fact || ''}
                    onChange={(e) => updatePersonality('weird_fact', e.target.value)}
                    placeholder="e.g., I can name every Friends episode"
                    maxLength={100}
                  />
                </div>

                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription className="text-xs">
                    These questions are optional but highly recommended! They help applicants find mentors
                    they connect with on a personal level.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle>Social Links (Optional)</CardTitle>
                <CardDescription>
                  Connect your professional profiles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                  <Input
                    id="linkedinUrl"
                    type="url"
                    value={profile.linkedinUrl || ''}
                    onChange={(e) => updateField('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <Label htmlFor="instagramUrl">Instagram Handle (Optional)</Label>
                  <Input
                    id="instagramUrl"
                    value={profile.instagramUrl || ''}
                    onChange={(e) => updateField('instagramUrl', e.target.value)}
                    placeholder="@yourusername"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Live Preview */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <ProfilePreview profile={profile} />
          </div>
        </div>

        {/* Bottom Save Button (mobile) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg">
          <Button
            onClick={handleSave}
            disabled={saving || !completeness.isPublishable}
            size="lg"
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProviderProfilePage;
