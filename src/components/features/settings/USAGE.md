# Settings Components Documentation

This directory contains reusable settings components for The CRNA Club application.

## Components Overview

### 1. AccountSettings.jsx

Manages account-related settings including email, connected accounts, and sessions.

**Features:**
- **Email Settings**
  - Display current email address
  - Email verification status badge (verified/not verified)
  - Change email functionality with verification flow
  - Resend verification email option

- **Connected Accounts**
  - WordPress account integration status
  - Connect/Disconnect WordPress account
  - Placeholder for future integrations

- **Session Management**
  - Last login information (time and location)
  - Sign out from all devices option

**Usage:**
```jsx
import { AccountSettings } from '@/components/features/settings';

function MySettingsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <AccountSettings />
    </div>
  );
}
```

### 2. PrivacySettings.jsx

Manages privacy and data-related settings including GDPR compliance features.

**Features:**
- **Privacy Preferences**
  - Toggle: Show profile to other members
  - Toggle: Allow mentors to see stats
  - Toggle: Appear in leaderboards

- **Data Export (GDPR)**
  - Request full data export
  - Information about what's included
  - Email notification when ready

- **Account Deletion**
  - Destructive action with confirmation
  - Requires typing "DELETE" to confirm
  - Clear warning about consequences
  - Suggests alternatives (pause subscription, contact support)

**Usage:**
```jsx
import { PrivacySettings } from '@/components/features/settings';

function MySettingsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <PrivacySettings />
    </div>
  );
}
```

## Complete Settings Page Example

See `SettingsExample.jsx` for a full implementation with tabs:

```jsx
import { AccountSettings, PrivacySettings } from '@/components/features/settings';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

function SettingsPage() {
  return (
    <PageWrapper>
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>

        <TabsContent value="privacy">
          <PrivacySettings />
        </TabsContent>

        {/* Add other tabs as needed */}
      </Tabs>
    </PageWrapper>
  );
}
```

## API Integration TODOs

Both components have placeholder functionality marked with `// TODO: Connect to API` comments:

### AccountSettings API Integration Points:
1. **Change Email**: POST to `/api/user/email` with new email
2. **Resend Verification**: POST to `/api/user/email/verify`
3. **Connect WordPress**: OAuth flow to WordPress
4. **Disconnect WordPress**: DELETE to `/api/user/wordpress`
5. **Sign Out All Devices**: POST to `/api/auth/signout-all`

### PrivacySettings API Integration Points:
1. **Update Privacy Preferences**: PATCH to `/api/user/preferences`
   - `show_profile`: boolean
   - `allow_stats_sharing`: boolean
   - `show_in_leaderboards`: boolean
2. **Request Data Export**: POST to `/api/user/data-export`
3. **Delete Account**: DELETE to `/api/user/account` (requires confirmation)

## Design System Compliance

Both components follow The CRNA Club design system:
- **Cards**: White background, rounded-3xl, subtle shadow
- **Buttons**: Apple-style with soft shadows and press feedback
- **Colors**:
  - Success/Info: Blue/Green tones
  - Warning: Orange tones
  - Destructive: Red tones
- **Icons**: Lucide React icons
- **Spacing**: Consistent use of Tailwind spacing scale
- **Touch Targets**: Minimum 44px height for mobile

## Dependencies

- `@/components/ui/card` - Card components
- `@/components/ui/button` - Button component
- `@/components/ui/badge` - Badge/pill components
- `@/components/ui/switch` - Toggle switch
- `@/components/ui/input` - Input and Label
- `@/components/ui/dialog` - Modal dialogs
- `lucide-react` - Icon library

## State Management

Currently uses local React state. When integrating with the API:
- Consider using a settings context for global state
- Add optimistic updates for better UX
- Implement proper error handling and validation
- Add loading states during API calls

## Accessibility

- All interactive elements have proper focus states
- Semantic HTML elements used throughout
- ARIA labels on icon-only buttons
- Keyboard navigation supported
- Color contrast meets WCAG AA standards

## Testing

Test these scenarios:
1. Email change flow (including verification)
2. Toggle privacy preferences
3. Data export request
4. Account deletion (full flow with confirmation)
5. WordPress connection/disconnection
6. Sign out all devices confirmation

## Future Enhancements

- [ ] Add success/error toast notifications (replace alerts)
- [ ] Implement undo functionality for certain actions
- [ ] Add email preferences (which emails to receive)
- [ ] Add two-factor authentication settings
- [ ] Add API key management for developers
- [ ] Add notification preferences integration
- [ ] Add billing/subscription settings integration
