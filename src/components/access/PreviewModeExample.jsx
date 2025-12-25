/**
 * PreviewModeExample Component
 *
 * Example demonstrating how to integrate preview mode into your app.
 * Shows:
 * 1. How to open the PreviewLauncher
 * 2. How to display the PreviewModeIndicator
 * 3. How to use preview mode with access control
 *
 * This file serves as a reference implementation.
 * In production, you would:
 * - Add PreviewModeProvider to App.jsx
 * - Add PreviewModeIndicator to PageWrapper or layout
 * - Add a trigger button in admin areas to open PreviewLauncher
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PreviewLauncher } from './PreviewLauncher';
import { PreviewModeIndicator } from './PreviewModeIndicator';
import { usePreviewMode } from '@/hooks/usePreviewMode';
import { useEntitlements } from '@/hooks/useEntitlements';
import { Eye, Lock, Unlock } from 'lucide-react';

export function PreviewModeExample() {
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const { isPreviewMode, previewEntitlements } = usePreviewMode();
  const { entitlements, isLoading } = useEntitlements();

  // Example: Check if user has access to a feature
  const hasTrialAccess = previewEntitlements.includes('trial_access');
  const hasMemberAccess = previewEntitlements.includes('active_membership');
  const hasAnyAccess = hasTrialAccess || hasMemberAccess;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-slate-100 to-purple-50/40">
      {/* Preview Mode Indicator (shows when active) */}
      <PreviewModeIndicator />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Preview Mode Example
            </h1>
            <p className="text-lg text-gray-600">
              Test access control by previewing the app with different entitlements
            </p>
          </div>

          {/* Launch Preview Button */}
          <div className="bg-white rounded-3xl shadow-elevated p-8 space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-2xl">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Preview Mode
                </h2>
                <p className="text-gray-600 mb-4">
                  Click the button below to open the preview launcher and test different
                  user access levels. Perfect for admins testing paywalls and entitlements.
                </p>
                <Button
                  onClick={() => setIsLauncherOpen(true)}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Open Preview Launcher
                </Button>
              </div>
            </div>
          </div>

          {/* Current State */}
          <div className="bg-white rounded-3xl shadow-elevated p-8 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Current Preview State
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                <div className="font-medium text-gray-900 min-w-[140px]">
                  Preview Mode:
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isPreviewMode
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {isPreviewMode ? 'Active' : 'Inactive'}
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                <div className="font-medium text-gray-900 min-w-[140px]">
                  Entitlements:
                </div>
                <div className="flex-1">
                  {previewEntitlements.length === 0 ? (
                    <span className="text-gray-500 text-sm italic">None (Free User)</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {previewEntitlements.map((entitlement) => (
                        <span
                          key={entitlement}
                          className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium"
                        >
                          {entitlement}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Example Access Control */}
          <div className="bg-white rounded-3xl shadow-elevated p-8 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Example Access Control
            </h2>
            <p className="text-gray-600">
              Here's how content would appear based on current preview entitlements:
            </p>

            <div className="space-y-4">
              {/* Trial Feature */}
              <div className={`p-4 rounded-2xl border-2 ${
                hasTrialAccess
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  {hasTrialAccess ? (
                    <Unlock className="h-5 w-5 text-green-600" />
                  ) : (
                    <Lock className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="font-medium text-gray-900">
                    Trial Feature
                  </span>
                  <span className={`ml-auto text-xs px-2 py-1 rounded-full font-medium ${
                    hasTrialAccess
                      ? 'bg-green-200 text-green-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {hasTrialAccess ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Requires: <code className="px-1.5 py-0.5 bg-white rounded text-xs">trial_access</code>
                </p>
              </div>

              {/* Member Feature */}
              <div className={`p-4 rounded-2xl border-2 ${
                hasMemberAccess
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  {hasMemberAccess ? (
                    <Unlock className="h-5 w-5 text-green-600" />
                  ) : (
                    <Lock className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="font-medium text-gray-900">
                    Member Feature
                  </span>
                  <span className={`ml-auto text-xs px-2 py-1 rounded-full font-medium ${
                    hasMemberAccess
                      ? 'bg-green-200 text-green-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {hasMemberAccess ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Requires: <code className="px-1.5 py-0.5 bg-white rounded text-xs">active_membership</code>
                </p>
              </div>

              {/* Premium Feature (Trial OR Member) */}
              <div className={`p-4 rounded-2xl border-2 ${
                hasAnyAccess
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  {hasAnyAccess ? (
                    <Unlock className="h-5 w-5 text-green-600" />
                  ) : (
                    <Lock className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="font-medium text-gray-900">
                    Premium Feature
                  </span>
                  <span className={`ml-auto text-xs px-2 py-1 rounded-full font-medium ${
                    hasAnyAccess
                      ? 'bg-green-200 text-green-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {hasAnyAccess ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Requires: <code className="px-1.5 py-0.5 bg-white rounded text-xs">trial_access</code> OR{' '}
                  <code className="px-1.5 py-0.5 bg-white rounded text-xs">active_membership</code>
                </p>
              </div>
            </div>
          </div>

          {/* Integration Instructions */}
          <div className="bg-purple-50 rounded-3xl border-2 border-purple-200 p-8 space-y-4">
            <h3 className="text-lg font-semibold text-purple-900">
              Integration Instructions
            </h3>
            <div className="space-y-3 text-sm text-purple-800">
              <div>
                <strong>1. Add Provider to App.jsx:</strong>
                <pre className="mt-2 p-3 bg-white rounded-xl overflow-x-auto text-xs">
{`import { PreviewModeProvider } from '@/hooks/usePreviewMode';

function App() {
  return (
    <AuthProvider>
      <PreviewModeProvider>
        <ThemeProvider>
          {/* ... */}
        </ThemeProvider>
      </PreviewModeProvider>
    </AuthProvider>
  );
}`}
                </pre>
              </div>
              <div>
                <strong>2. Add Indicator to Layout:</strong>
                <pre className="mt-2 p-3 bg-white rounded-xl overflow-x-auto text-xs">
{`import { PreviewModeIndicator } from '@/components/access/PreviewModeIndicator';

export function PageWrapper({ children }) {
  return (
    <>
      <PreviewModeIndicator />
      {/* rest of layout */}
    </>
  );
}`}
                </pre>
              </div>
              <div>
                <strong>3. Use in Access Control:</strong>
                <pre className="mt-2 p-3 bg-white rounded-xl overflow-x-auto text-xs">
{`const { isPreviewMode, previewEntitlements } = usePreviewMode();

// In preview mode, use previewEntitlements instead of user.entitlements
const effectiveEntitlements = isPreviewMode
  ? previewEntitlements
  : user?.entitlements || [];

const hasAccess = effectiveEntitlements.includes('active_membership');`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Launcher Modal */}
      <PreviewLauncher
        open={isLauncherOpen}
        onOpenChange={setIsLauncherOpen}
        entitlements={entitlements}
      />
    </div>
  );
}
