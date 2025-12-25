/**
 * ProfileTab
 *
 * Profile settings section including:
 * - Profile picture upload
 * - First/Last/Display name
 * - Password change
 */

import { useState, useRef, ChangeEvent } from 'react';
import { Save, Loader2, Lock, Eye, EyeOff, Camera, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useImageUpload } from '@/hooks/useImageUpload';

// Allowed image types for profile picture
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export function ProfileTab() {
  const { user, updateProfile } = useAuth();
  const { upload, isUploading } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user?.user_metadata?.avatar_url || null
  );
  const [avatarError, setAvatarError] = useState<string | null>(null);

  // Profile form state
  const [formData, setFormData] = useState({
    displayName: user?.user_metadata?.display_name || '',
    firstName: user?.user_metadata?.first_name || '',
    lastName: user?.user_metadata?.last_name || '',
  });

  // Password form state
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = formData.displayName || formData.firstName || user?.email || 'User';

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
    setError(null);
  };

  // Handle avatar file selection
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError(null);

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setAvatarError('Please upload a PNG, JPG, GIF, or WebP image');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setAvatarError('Image must be less than 2MB');
      return;
    }

    // Upload the file
    const result = await upload(file, { folder: 'avatars' });

    if (result.error) {
      setAvatarError(result.error);
      return;
    }

    // Update avatar URL locally and save to profile
    setAvatarUrl(result.url);

    // Save to profile
    await updateProfile({
      avatar_url: result.url,
    });

    // Clear the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    setAvatarUrl(null);
    setAvatarError(null);

    await updateProfile({
      avatar_url: null,
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    const fullName = [formData.firstName, formData.lastName].filter(Boolean).join(' ');

    const { error: updateError } = await updateProfile({
      full_name: fullName || formData.displayName,
      display_name: formData.displayName,
      first_name: formData.firstName,
      last_name: formData.lastName,
    });

    setIsLoading(false);

    if (updateError) {
      setError(updateError);
      return;
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handlePasswordChange = async () => {
    setPasswordError(null);

    if (passwordData.new !== passwordData.confirm) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (passwordData.new.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    // TODO: Implement Supabase password change
    // await supabase.auth.updateUser({ password: passwordData.new })
    await new Promise(resolve => setTimeout(resolve, 1000));

    setPasswordChanged(true);
    setPasswordData({ current: '', new: '', confirm: '' });
    setIsLoading(false);

    setTimeout(() => setPasswordChanged(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Upload a photo to personalize your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar Display */}
            <div className="relative group">
              <Avatar className="w-24 h-24 border-4 border-gray-100">
                <AvatarImage src={avatarUrl || undefined} alt={displayName} />
                <AvatarFallback className="text-2xl bg-orange-100 text-orange-600">
                  {getInitials(formData.firstName || displayName)}
                </AvatarFallback>
              </Avatar>

              {/* Overlay on hover */}
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={isUploading}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                {isUploading ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-white" />
                )}
              </button>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Avatar Actions */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAvatarClick}
                  disabled={isUploading}
                  className="gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      {avatarUrl ? 'Change Photo' : 'Upload Photo'}
                    </>
                  )}
                </Button>

                {avatarUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleRemoveAvatar}
                    className="gap-2 text-gray-600 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                    Remove
                  </Button>
                )}
              </div>

              <p className="text-xs text-gray-500">
                PNG, JPG, GIF, or WebP. Max 2MB.
              </p>

              {avatarError && (
                <p className="text-xs text-red-600">{avatarError}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your name and display name
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('firstName', e.target.value)}
                placeholder="Enter your first name"
              />
              <p className="text-xs text-gray-500">
                Used for personalized greetings throughout the app
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('lastName', e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={formData.displayName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('displayName', e.target.value)}
              placeholder="e.g., NurseJess, ICU_Sarah"
            />
            <p className="text-xs text-gray-500">
              This is your public name shown in forums, comments, the marketplace, and the header.
            </p>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isSaved ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-600" />
            Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPassword ? 'text' : 'password'}
                value={passwordData.current}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPasswordData(prev => ({ ...prev, current: e.target.value }))
                }
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.new}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPasswordData(prev => ({ ...prev, new: e.target.value }))
              }
              placeholder="Enter new password"
            />
            <p className="text-xs text-gray-500">
              At least 8 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.confirm}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPasswordData(prev => ({ ...prev, confirm: e.target.value }))
              }
              placeholder="Confirm new password"
            />
          </div>

          {passwordError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {passwordError}
              </AlertDescription>
            </Alert>
          )}

          {passwordChanged && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                Password updated successfully!
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handlePasswordChange}
            disabled={
              isLoading ||
              !passwordData.current ||
              !passwordData.new ||
              !passwordData.confirm
            }
            className="bg-yellow-400 hover:bg-yellow-500 text-black"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Password'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
