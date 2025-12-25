/**
 * AccountSettings Component
 *
 * Manages account-related settings including:
 * - Email management and verification
 * - Connected accounts (WordPress integration)
 * - Session management
 */

import { useState } from 'react';
import { Mail, Link2, LogOut, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
 * Email Settings Section
 */
function EmailSettings({ currentEmail, isVerified }) {
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const handleChangeEmail = () => {
    // TODO: Connect to API
    alert(`Verification email sent to ${newEmail}. Please check your inbox.`);
    setShowChangeEmail(false);
    setNewEmail('');
  };

  const handleResendVerification = () => {
    // TODO: Connect to API
    alert(`Verification email sent to ${currentEmail}`);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-gray-600" />
            Email Address
          </CardTitle>
          <CardDescription>
            Manage your email address and verification status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Email */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">{currentEmail}</p>
                <div className="flex items-center gap-2 mt-1">
                  {isVerified ? (
                    <Badge variant="success" className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="text-xs">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Not Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChangeEmail(true)}
            >
              Change Email
            </Button>
          </div>

          {/* Verification Warning */}
          {!isVerified && (
            <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
              <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-900">
                  Please verify your email address
                </p>
                <p className="text-sm text-orange-700 mt-1">
                  Check your inbox for a verification link. Didn't receive it?
                </p>
                <Button
                  variant="soft"
                  size="sm"
                  className="mt-3"
                  onClick={handleResendVerification}
                >
                  Resend Verification Email
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Email Dialog */}
      <Dialog open={showChangeEmail} onOpenChange={setShowChangeEmail}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Email Address</DialogTitle>
            <DialogDescription>
              Enter your new email address. We'll send a verification link to confirm the change.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Email</Label>
              <Input value={currentEmail} disabled />
            </div>
            <div className="space-y-2">
              <Label>New Email</Label>
              <Input
                type="email"
                placeholder="your.new@email.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowChangeEmail(false);
                setNewEmail('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangeEmail}
              disabled={!newEmail || newEmail === currentEmail}
            >
              Send Verification Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Connected Accounts Section
 */
function ConnectedAccounts({ isWordPressConnected }) {
  const handleConnectWordPress = () => {
    // TODO: Connect to WordPress integration
    alert('WordPress connection will be implemented with API integration');
  };

  const handleDisconnectWordPress = () => {
    // TODO: Disconnect from WordPress
    if (window.confirm('Are you sure you want to disconnect your WordPress account?')) {
      alert('WordPress account disconnected');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-gray-600" />
          Connected Accounts
        </CardTitle>
        <CardDescription>
          Manage integrations with other services
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* WordPress Connection */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <ExternalLink className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">WordPress Account</p>
              <p className="text-sm text-gray-600">
                {isWordPressConnected
                  ? 'Connected for product purchases and blog access'
                  : 'Connect to sync your account'}
              </p>
            </div>
          </div>
          {isWordPressConnected ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnectWordPress}
            >
              Disconnect
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={handleConnectWordPress}
            >
              Connect
            </Button>
          )}
        </div>

        {/* Future integrations placeholder */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          More integrations coming soon
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Session Management Section
 */
function SessionManagement({ lastLoginAt, lastLoginLocation }) {
  const handleSignOutAllDevices = () => {
    if (window.confirm(
      'This will sign you out from all devices except this one. Continue?'
    )) {
      // TODO: Connect to API
      alert('You have been signed out from all other devices.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LogOut className="w-5 h-5 text-gray-600" />
          Sessions
        </CardTitle>
        <CardDescription>
          Manage your active sessions and sign-out options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Last Login Info */}
        <div className="p-4 bg-gray-50 rounded-2xl">
          <p className="text-sm font-medium text-gray-900 mb-2">Last Login</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Time:</span> {lastLoginAt}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Location:</span> {lastLoginLocation}
            </p>
          </div>
        </div>

        {/* Sign Out All Devices */}
        <div className="flex items-start gap-3 pt-2">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              Sign out of all devices
            </p>
            <p className="text-sm text-gray-600 mt-1">
              This will sign you out from all browsers and devices except this one.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOutAllDevices}
            className="shrink-0"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Main AccountSettings Component
 */
export function AccountSettings() {
  // TODO: Get from auth context
  const currentEmail = 'member@example.com';
  const isVerified = true;
  const isWordPressConnected = false;
  const lastLoginAt = 'Dec 21, 2025 at 2:30 PM';
  const lastLoginLocation = 'San Francisco, CA';

  return (
    <div className="space-y-6">
      <EmailSettings
        currentEmail={currentEmail}
        isVerified={isVerified}
      />
      <ConnectedAccounts
        isWordPressConnected={isWordPressConnected}
      />
      <SessionManagement
        lastLoginAt={lastLoginAt}
        lastLoginLocation={lastLoginLocation}
      />
    </div>
  );
}
