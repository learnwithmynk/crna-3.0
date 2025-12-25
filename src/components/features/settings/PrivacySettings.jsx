/**
 * PrivacySettings Component
 *
 * Manages privacy and data-related settings including:
 * - Data export (GDPR compliance)
 * - Account deletion
 * - Privacy preferences (profile visibility, stats sharing)
 */

import { useState } from 'react';
import {
  Download,
  Trash2,
  Shield,
  Eye,
  EyeOff,
  AlertTriangle,
  FileText,
  Users,
  Trophy,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input, Label } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

/**
 * Data Export Section
 */
function DataExport() {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestExport = async () => {
    setIsRequesting(true);
    // TODO: Connect to API
    setTimeout(() => {
      alert('Data export requested! We\'ll email you when your download is ready (usually within 24 hours).');
      setIsRequesting(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5 text-gray-600" />
          Download Your Data
        </CardTitle>
        <CardDescription>
          Request a copy of all your data (GDPR compliant)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">
                What's included in your data export?
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>Profile information and stats</li>
                <li>Tracker entries (clinical, shadow, certifications)</li>
                <li>Saved schools and target programs</li>
                <li>Booking history and reviews</li>
                <li>Community posts and comments</li>
                <li>Learning progress and course completions</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 pt-2">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              Request Data Export
            </p>
            <p className="text-sm text-gray-600 mt-1">
              We'll email you a secure download link when your data is ready (usually within 24 hours).
            </p>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={handleRequestExport}
            disabled={isRequesting}
            className="shrink-0"
          >
            <Download className="w-4 h-4 mr-2" />
            {isRequesting ? 'Requesting...' : 'Request Export'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Delete Account Dialog
 */
function DeleteAccountDialog({ open, onOpenChange }) {
  const [confirmText, setConfirmText] = useState('');
  const isConfirmed = confirmText === 'DELETE';

  const handleDelete = () => {
    // TODO: Connect to API for actual deletion
    alert('Account deletion requested. This feature will be connected to the API during integration.');
    onOpenChange(false);
    setConfirmText('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Delete Account
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. Please read carefully.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Warning Box */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-sm font-medium text-red-900 mb-2">
              Deleting your account will:
            </p>
            <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
              <li>Permanently delete all your data and trackers</li>
              <li>Cancel your active subscription</li>
              <li>Remove you from all community groups and forums</li>
              <li>Delete your booking history and reviews</li>
              <li>Remove access to all learning content</li>
            </ul>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-2">
            <Label className="text-gray-900">
              Type <span className="font-mono font-bold">DELETE</span> to confirm
            </Label>
            <Input
              type="text"
              placeholder="Type DELETE to confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="font-mono"
            />
          </div>

          {/* Alternative Options */}
          <div className="p-4 bg-gray-50 rounded-2xl">
            <p className="text-sm font-medium text-gray-900 mb-2">
              Not sure? Try these instead:
            </p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Download your data to keep a backup</li>
              <li>• Pause your subscription instead of deleting</li>
              <li>• Contact support if you're having issues</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setConfirmText('');
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!isConfirmed}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete My Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Account Deletion Section
 */
function AccountDeletion() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            Delete Account
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">
                Warning: This action is permanent
              </p>
              <p className="text-sm text-red-700 mt-1">
                Once you delete your account, there is no going back. All your data will be permanently removed.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete My Account
            </Button>
          </div>
        </CardContent>
      </Card>

      <DeleteAccountDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}

/**
 * Privacy Preferences Section
 */
function PrivacyPreferences({
  showProfile,
  onShowProfileChange,
  allowStatsSharing,
  onAllowStatsSharingChange,
  showInLeaderboards,
  onShowInLeaderboardsChange,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-gray-600" />
          Privacy Preferences
        </CardTitle>
        <CardDescription>
          Control who can see your information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Visibility */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
              {showProfile ? (
                <Eye className="w-5 h-5 text-purple-600" />
              ) : (
                <EyeOff className="w-5 h-5 text-purple-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">
                Show my profile to other members
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Allow other CRNA Club members to view your public profile in the community and forums.
              </p>
            </div>
          </div>
          <Switch
            checked={showProfile}
            onCheckedChange={onShowProfileChange}
            className="shrink-0"
          />
        </div>

        {/* Stats Sharing */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">
                Allow mentors to see my stats
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Share your MyStats data with mentors to help them provide better personalized guidance.
              </p>
            </div>
          </div>
          <Switch
            checked={allowStatsSharing}
            onCheckedChange={onAllowStatsSharingChange}
            className="shrink-0"
          />
        </div>

        {/* Leaderboard Visibility */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">
                Appear in leaderboards
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Show your name and rank in community leaderboards and gamification features.
              </p>
            </div>
          </div>
          <Switch
            checked={showInLeaderboards}
            onCheckedChange={onShowInLeaderboardsChange}
            className="shrink-0"
          />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Main PrivacySettings Component
 */
export function PrivacySettings() {
  // TODO: Get from user settings/preferences
  const [showProfile, setShowProfile] = useState(true);
  const [allowStatsSharing, setAllowStatsSharing] = useState(true);
  const [showInLeaderboards, setShowInLeaderboards] = useState(true);

  // Handle preference changes
  const handleShowProfileChange = (checked) => {
    // TODO: Save to API
    setShowProfile(checked);
    alert(`Profile visibility ${checked ? 'enabled' : 'disabled'}`);
  };

  const handleAllowStatsSharingChange = (checked) => {
    // TODO: Save to API
    setAllowStatsSharing(checked);
    alert(`Stats sharing ${checked ? 'enabled' : 'disabled'}`);
  };

  const handleShowInLeaderboardsChange = (checked) => {
    // TODO: Save to API
    setShowInLeaderboards(checked);
    alert(`Leaderboard visibility ${checked ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="space-y-6">
      <PrivacyPreferences
        showProfile={showProfile}
        onShowProfileChange={handleShowProfileChange}
        allowStatsSharing={allowStatsSharing}
        onAllowStatsSharingChange={handleAllowStatsSharingChange}
        showInLeaderboards={showInLeaderboards}
        onShowInLeaderboardsChange={handleShowInLeaderboardsChange}
      />
      <DataExport />
      <AccountDeletion />
    </div>
  );
}
