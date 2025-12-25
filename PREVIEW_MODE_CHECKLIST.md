# Preview Mode Integration Checklist

## Files Created ✅

- [x] `/src/hooks/usePreviewMode.js` - Context provider and hook
- [x] `/src/components/access/PreviewLauncher.jsx` - Modal for launching preview
- [x] `/src/components/access/PreviewModeIndicator.jsx` - Simple banner component
- [x] `/src/components/access/PreviewModeExample.jsx` - Complete reference implementation
- [x] `/src/components/access/README.md` - Comprehensive documentation (updated)
- [x] `/src/components/access/index.js` - Exports updated
- [x] `/src/hooks/index.js` - Exports updated (already done)
- [x] `/INTEGRATION_PREVIEW_MODE.md` - Quick start guide
- [x] `/PREVIEW_MODE_SUMMARY.md` - Implementation summary
- [x] `/PREVIEW_MODE_CHECKLIST.md` - This checklist

## Integration Steps ⏳

### Step 1: Add Provider to App.jsx

- [ ] Open `/Users/sachi/Desktop/crna-club-rebuild/src/App.jsx`
- [ ] Import `PreviewModeProvider` from `./hooks/usePreviewMode`
- [ ] Wrap app with `<PreviewModeProvider>` (inside AuthProvider, around ThemeProvider)
- [ ] Save and test

**Code to add:**
```javascript
import { PreviewModeProvider } from './hooks/usePreviewMode';

function App() {
  return (
    <AuthProvider>
      <PreviewModeProvider> {/* ADD THIS */}
        <ThemeProvider theme="coral" background="dusk">
          <RouterProvider router={router} />
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </PreviewModeProvider> {/* ADD THIS */}
    </AuthProvider>
  );
}
```

### Step 2: Add Preview Indicator to Layout

**Option A: Use PreviewModeBanner (Recommended)**
- [ ] Find your main layout component (likely PageWrapper)
- [ ] Import `PreviewModeBanner` from `@/components/access`
- [ ] Add `<PreviewModeBanner />` at the top of the layout
- [ ] Save and test

**Option B: Use PreviewModeIndicator (Simpler)**
- [ ] Find your main layout component
- [ ] Import `PreviewModeIndicator` from `@/components/access`
- [ ] Add `<PreviewModeIndicator />` at the top of the layout
- [ ] Save and test

**Recommendation:** Use PreviewModeBanner (has admin checks and built-in settings)

### Step 3: Add Preview Launcher to Admin Panel

- [ ] Find your admin panel/toolbar component
- [ ] Import `PreviewLauncher` and `useEntitlements`
- [ ] Add button to open preview launcher
- [ ] Add `<PreviewLauncher>` component with state
- [ ] Save and test

**Example code:**
```javascript
import { useState } from 'react';
import { PreviewLauncher } from '@/components/access';
import { useEntitlements } from '@/hooks/useEntitlements';
import { Eye } from 'lucide-react';

function AdminToolbar() {
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

## Testing Checklist ⏳

### Basic Functionality

- [ ] Open the app and verify no errors in console
- [ ] Navigate to admin panel
- [ ] Click "Test Access Control" button
- [ ] Verify PreviewLauncher modal opens
- [ ] Select "Free User" preset
- [ ] Click "Launch Preview"
- [ ] Verify preview banner appears at top
- [ ] Verify URL shows `?preview_as=`
- [ ] Click "Exit Preview" in banner
- [ ] Verify banner disappears
- [ ] Verify URL param is removed

### Preset Testing

- [ ] **Free User** - Click preset, verify `?preview_as=` in URL
- [ ] **Trial User** - Click preset, verify `?preview_as=trial_access` in URL
- [ ] **Basic Member** - Click preset, verify `?preview_as=active_membership` in URL
- [ ] **Premium Member** - Click preset, verify all entitlements in URL

### Custom Selection

- [ ] Open preview launcher
- [ ] Uncheck all entitlements
- [ ] Check `trial_access` manually
- [ ] Click "Launch Preview"
- [ ] Verify URL shows `?preview_as=trial_access`
- [ ] Verify banner shows correct entitlements

### Navigation Testing

- [ ] Launch preview mode
- [ ] Navigate to different pages
- [ ] Verify preview banner persists
- [ ] Verify URL parameter persists
- [ ] Verify access control works correctly

### Access Control Integration

- [ ] Launch preview with no entitlements (Free User)
- [ ] Verify paywalls/upgrade prompts appear
- [ ] Launch preview with `active_membership`
- [ ] Verify premium features unlock
- [ ] Verify FeatureGate components show preview indicators

## Documentation Review ✅

- [x] Read `/src/components/access/README.md`
- [x] Review `/INTEGRATION_PREVIEW_MODE.md`
- [x] Review `/PREVIEW_MODE_SUMMARY.md`
- [ ] Bookmark example component path for reference

## Common Issues & Solutions

### Issue: Preview mode not activating
**Solution:** Ensure `PreviewModeProvider` is added to `App.jsx`

### Issue: Banner not appearing
**Solution:**
- Check that banner component is added to layout
- For PreviewModeBanner: ensure user is admin
- For PreviewModeIndicator: no admin check, should always show

### Issue: Entitlements not loading in launcher
**Solution:**
- Verify Supabase connection is configured
- Check `useEntitlements()` hook is working
- Check browser console for errors

### Issue: Access control not respecting preview mode
**Solution:**
- Verify components use `useAccess` hook (already integrated)
- Check that `FeatureGate` is used for feature-level gating
- Ensure custom access logic checks `isPreviewMode`

## Files to Reference

| Purpose | File |
|---------|------|
| Hook implementation | `/src/hooks/usePreviewMode.js` |
| Launch modal | `/src/components/access/PreviewLauncher.jsx` |
| Banner (feature-rich) | `/src/components/access/PreviewModeBanner.jsx` |
| Banner (simple) | `/src/components/access/PreviewModeIndicator.jsx` |
| Complete example | `/src/components/access/PreviewModeExample.jsx` |
| Full documentation | `/src/components/access/README.md` |
| Quick start | `/INTEGRATION_PREVIEW_MODE.md` |
| Summary | `/PREVIEW_MODE_SUMMARY.md` |

## URL Parameters Reference

```
# Free user (no entitlements)
?preview_as=

# Trial user
?preview_as=trial_access

# Basic member
?preview_as=active_membership

# Multiple entitlements
?preview_as=active_membership,trial_access

# Combined with other params
?tab=settings&preview_as=active_membership
```

## Next Steps After Integration

1. [ ] Share test URLs with QA team
2. [ ] Test all major features in each preset mode
3. [ ] Document any bugs found during testing
4. [ ] Update access control if issues found
5. [ ] Train team on how to use preview mode

## Sign-Off

- [ ] Provider added to App.jsx
- [ ] Banner added to layout
- [ ] Launcher added to admin panel
- [ ] All presets tested
- [ ] Access control verified
- [ ] Team trained on usage
- [ ] Documentation reviewed

---

**Status:** Ready for integration
**Last Updated:** 2025-12-20
**Created By:** Claude Code Agent
