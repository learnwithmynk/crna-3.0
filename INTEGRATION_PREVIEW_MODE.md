# Preview Mode Integration Guide

This guide shows how to integrate the Preview Mode system into the app.

## What is Preview Mode?

Preview Mode allows admins and developers to test access control by simulating different user entitlements (Free, Trial, Member, etc.) without affecting real data. It's stored in URL parameters so you can share test links with team members.

## Quick Start

### 1. Add Provider to App.jsx

Open `/Users/sachi/Desktop/crna-club-rebuild/src/App.jsx` and wrap the app with `PreviewModeProvider`:

```javascript
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { router } from './router';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './hooks/useAuth';
import { PreviewModeProvider } from './hooks/usePreviewMode'; // Add this

function App() {
  return (
    <AuthProvider>
      <PreviewModeProvider> {/* Add this */}
        <ThemeProvider theme="coral" background="dusk">
          <RouterProvider router={router} />
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </PreviewModeProvider> {/* Add this */}
    </AuthProvider>
  );
}

export default App;
```

### 2. Add Indicator to Layout

Open your main layout component (likely `PageWrapper` or similar) and add the preview indicator:

```javascript
import { PreviewModeIndicator } from '@/components/access';

export function PageWrapper({ children }) {
  return (
    <div className="min-h-screen">
      <PreviewModeIndicator /> {/* Add this at the top */}
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

### 3. Add Preview Launcher Button (Admin/Dev Tools)

Add a button in your admin panel or developer tools area:

```javascript
import { useState } from 'react';
import { PreviewLauncher } from '@/components/access';
import { useEntitlements } from '@/hooks/useEntitlements';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

function AdminPanel() {
  const [showLauncher, setShowLauncher] = useState(false);
  const { entitlements } = useEntitlements();

  return (
    <>
      <Button onClick={() => setShowLauncher(true)}>
        <Eye className="h-4 w-4 mr-2" />
        Test Access Control
      </Button>

      <PreviewLauncher
        open={showLauncher}
        onOpenChange={setShowLauncher}
        entitlements={entitlements}
      />
    </>
  );
}
```

### 4. Update Access Control Logic

Create a helper hook to use effective entitlements (preview or real):

```javascript
// src/hooks/useAccess.js
import { useAuth } from '@/hooks/useAuth';
import { usePreviewMode } from '@/hooks/usePreviewMode';

export function useAccess() {
  const { user } = useAuth();
  const { isPreviewMode, previewEntitlements } = usePreviewMode();

  // Use preview entitlements when in preview mode
  const effectiveEntitlements = isPreviewMode
    ? previewEntitlements
    : user?.entitlements || [];

  return {
    hasAccess: (requiredEntitlement) =>
      effectiveEntitlements.includes(requiredEntitlement),
    hasAnyAccess: (requiredEntitlements) =>
      requiredEntitlements.some(e => effectiveEntitlements.includes(e)),
    hasAllAccess: (requiredEntitlements) =>
      requiredEntitlements.every(e => effectiveEntitlements.includes(e)),
    entitlements: effectiveEntitlements,
    isPreviewMode,
  };
}
```

Then use it in components:

```javascript
import { useAccess } from '@/hooks/useAccess';

function ProtectedFeature() {
  const { hasAccess } = useAccess();

  if (!hasAccess('active_membership')) {
    return <PaywallPrompt />;
  }

  return <PremiumContent />;
}
```

## Testing the Integration

1. **View Example Page**: Navigate to the example component to see it in action
2. **Open Preview Launcher**: Click your "Test Access Control" button
3. **Select Preset**: Choose "Free User", "Trial", "Basic Member", or "Premium"
4. **Launch Preview**: Click "Launch Preview" button
5. **Verify**: The preview indicator banner should appear at the top
6. **Test Features**: Navigate around and verify access control works correctly
7. **Exit Preview**: Click "Exit Preview" in the banner

## URL Format

Preview mode uses URL parameters:

```
# Free user (no entitlements)
?preview_as=

# Trial user
?preview_as=trial_access

# Member
?preview_as=active_membership

# Multiple entitlements
?preview_as=active_membership,trial_access
```

You can share these URLs with team members for testing specific scenarios.

## Files Created

- `/src/hooks/usePreviewMode.js` - Context provider and hook
- `/src/components/access/PreviewLauncher.jsx` - Modal for launching preview
- `/src/components/access/PreviewModeIndicator.jsx` - Banner showing active preview
- `/src/components/access/PreviewModeExample.jsx` - Complete demo/reference
- `/src/components/access/README.md` - Full documentation

## Next Steps

1. **Add Provider to App.jsx** (Step 1 above)
2. **Add Indicator to Layout** (Step 2 above)
3. **Create useAccess Hook** (Step 4 above)
4. **Update Access Control Components** to use `useAccess()`
5. **Add Preview Launcher Button** in admin/dev areas
6. **Test All Scenarios**: Free, Trial, Basic Member, Premium

## Need Help?

- See `/src/components/access/PreviewModeExample.jsx` for a complete working example
- See `/src/components/access/README.md` for full documentation
- The example component includes integration instructions and code samples
