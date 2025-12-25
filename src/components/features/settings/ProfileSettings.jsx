/**
 * ProfileSettings Component
 *
 * Allows users to edit their profile information including:
 * - Avatar upload/remove
 * - Personal information (name, email, phone)
 * - Password change
 *
 * Uses Apple-style design with soft shadows and rounded corners.
 * TODO: Connect to actual Supabase API for profile updates and password changes.
 */

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export function ProfileSettings() {
  const { user } = useAuth();

  // Form state for personal information
  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.user_metadata?.full_name || user?.email || '',
    preferredName: user?.user_metadata?.preferred_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
  });

  // Form state for password change
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Loading states
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || null);

  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle personal info input changes
  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle password input changes
  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle avatar upload (UI only for now)
  const handleAvatarUpload = () => {
    // TODO: Implement actual file upload to Supabase Storage
    toast.info('Avatar Upload', {
      description: 'Avatar upload will be implemented with Supabase Storage integration.',
    });
  };

  // Handle avatar removal
  const handleAvatarRemove = () => {
    setAvatarUrl(null);
    toast.success('Avatar Removed', {
      description: 'Your profile photo has been removed.',
    });
    // TODO: Update in Supabase
  };

  // Save personal information
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // TODO: Replace with actual Supabase API call
    console.log('[ProfileSettings] Saving profile data:', personalInfo);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSaving(false);
    toast.success('Profile Updated', {
      description: 'Your profile information has been saved successfully.',
    });
  };

  // Update password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('All Fields Required', {
        description: 'Please fill in all password fields.',
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords Do Not Match', {
        description: 'New password and confirmation must match.',
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password Too Short', {
        description: 'Password must be at least 8 characters long.',
      });
      return;
    }

    setIsChangingPassword(true);

    // TODO: Replace with actual Supabase password update
    console.log('[ProfileSettings] Updating password');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsChangingPassword(false);

    // Clear password fields
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    toast.success('Password Updated', {
      description: 'Your password has been changed successfully.',
    });
  };

  // Email verification status (mock for now)
  const isEmailVerified = true; // TODO: Get from Supabase user.email_confirmed_at

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar Display */}
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-gray-100">
                <AvatarImage src={avatarUrl} alt={personalInfo.fullName} />
                <AvatarFallback className="text-2xl bg-primary/10">
                  {getInitials(personalInfo.fullName)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Avatar Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="secondary"
                onClick={handleAvatarUpload}
                className="gap-2"
              >
                <Camera className="w-4 h-4" />
                Change Photo
              </Button>

              {avatarUrl && (
                <Button
                  variant="ghost"
                  onClick={handleAvatarRemove}
                  className="gap-2 text-gray-600 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                  Remove
                </Button>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Recommended: Square image, at least 400x400px. Max file size: 2MB.
          </p>
        </CardContent>
      </Card>

      {/* Personal Information Form */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveChanges} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={personalInfo.fullName}
                onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Preferred Name */}
            <div className="space-y-2">
              <Label htmlFor="preferredName">
                Preferred Name / Display Name
                <span className="text-gray-400 ml-2">(Optional)</span>
              </Label>
              <Input
                id="preferredName"
                type="text"
                value={personalInfo.preferredName}
                onChange={(e) => handlePersonalInfoChange('preferredName', e.target.value)}
                placeholder="How you'd like to be called"
              />
              <p className="text-xs text-gray-500">
                This name will be displayed in the community and on your profile.
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
                {/* Verification Badge */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isEmailVerified ? (
                    <div className="flex items-center gap-1.5 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-orange-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">Unverified</span>
                    </div>
                  )}
                </div>
              </div>
              {!isEmailVerified && (
                <p className="text-xs text-orange-600">
                  Please verify your email address. Check your inbox for a verification link.
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number
                <span className="text-gray-400 ml-2">(Optional)</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={personalInfo.phone}
                onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
              <p className="text-xs text-gray-500">
                Used for SMS notifications if enabled (not shared publicly).
              </p>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto min-w-[200px]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Change Section */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-5">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                placeholder="Enter current password"
                autoComplete="current-password"
              />
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                placeholder="Enter new password"
                autoComplete="new-password"
              />
              <p className="text-xs text-gray-500">
                Must be at least 8 characters long.
              </p>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                placeholder="Confirm new password"
                autoComplete="new-password"
              />
            </div>

            {/* Update Password Button */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="secondary"
                disabled={isChangingPassword}
                className="w-full sm:w-auto min-w-[200px]"
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfileSettings;
