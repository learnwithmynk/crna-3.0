# OnboardingStep5Review Component

Final step of provider onboarding - "Review & Launch" with comprehensive profile preview, completion checklist, and celebratory launch experience.

## Overview

The OnboardingStep5Review component is the culminating step in the provider onboarding journey. It provides a comprehensive review experience with:

- **Full profile preview** - See exactly how the profile will appear to applicants
- **Completion checklist** - Interactive checklist with navigation back to incomplete steps
- **Services summary** - List of configured services with pricing and earnings estimate
- **Terms acceptance** - Required checkboxes for legal agreements
- **Celebratory launch** - Confetti animation and success screen after launch
- **Profile sharing** - Copy link and social sharing after going live

## Component Structure

### Pre-Launch View

Two-column layout (stacks on mobile):

**Left Column:**
- Launch Checklist card
- Services Summary card with earnings estimate
- Terms & Agreements card

**Right Column:**
- Full Profile Preview card
- Stripe warning (if not connected)

**Footer:**
- Back button
- Launch button (disabled until ready)

### Post-Launch View

Celebration screen with:
- Confetti animation
- Success message
- Shareable profile link
- Action buttons (View Profile, Dashboard, Share)
- Next steps guidance

## Props

```jsx
<OnboardingStep5Review
  profileData={object}
  servicesData={array}
  availabilityData={object}
  stripeStatus={string}
  onBack={function}
  onLaunch={function}
  isLaunching={boolean}
  onNavigateToStep={function}
/>
```

### profileData (object)

Complete profile information:

```javascript
{
  firstName: string,          // Required
  lastName: string,           // Required
  tagline: string,            // Optional intro text
  bio: string,                // Required for completion
  avatarUrl: string,          // Profile photo URL
  videoCallLink: string,      // Zoom/Google Meet link (required)
  school: string,             // CRNA program name (required)
  yearInProgram: number,      // 1, 2, or 3 (required)
  personality: {              // Optional personality data
    cats_or_dogs: string,
    road_trip_music: string,
    comfort_food: string,
    // ... other personality fields
  }
}
```

### servicesData (array)

Array of service offerings:

```javascript
[
  {
    name: string,             // Service name
    price: number,            // Price in USD
    duration: number,         // Duration in minutes
    enabled: boolean,         // Whether service is active
  }
]
```

At least one enabled service required for launch.

### availabilityData (object)

Weekly availability schedule:

```javascript
{
  monday: { morning: boolean, afternoon: boolean, evening: boolean },
  tuesday: { morning: boolean, afternoon: boolean, evening: boolean },
  // ... other days
}
```

Must have at least some availability set for launch.

### stripeStatus (string)

Stripe account connection status:

- `'connected'` - Fully connected and ready to receive payments
- `'pending'` - Onboarding in progress
- `'not_connected'` - No Stripe account linked

**Note:** Profile can launch without Stripe connected, but provider won't be able to receive payments until connected.

### onBack (function)

Called when user clicks the "Back" button. Should navigate to Step 4 (Stripe setup).

```javascript
onBack={() => {
  // Navigate to previous step
}}
```

### onLaunch (async function)

Called when user clicks "Launch My Profile". Should handle:

1. Submit profile data to Supabase
2. Mark provider as "active" in database
3. Create provider profile record
4. Send confirmation email via Groundhogg
5. Award gamification points for profile completion
6. Generate unique profile URL/slug

```javascript
onLaunch={async () => {
  try {
    await submitProfileToSupabase(profileData);
    await markProviderActive(userId);
    await sendWelcomeEmail(email);
    await awardCompletionPoints(userId);
    // Component will show celebration view on success
  } catch (error) {
    // Handle error
  }
}}
```

### isLaunching (boolean)

Loading state while profile is being submitted. Shows spinner and disables button.

### onNavigateToStep (function)

Called when user clicks on an incomplete checklist item. Receives step number (1-4).

```javascript
onNavigateToStep={(stepNumber) => {
  // Navigate to specific onboarding step
  setCurrentStep(stepNumber);
}}
```

## Checklist Items

The component validates these requirements:

| Item | Required Fields | Step |
|------|----------------|------|
| Profile information complete | firstName, lastName, bio, school, yearInProgram | 1 |
| At least one service configured | servicesData.length > 0 with at least one enabled | 2 |
| Availability set | availabilityData has entries | 3 |
| Video call link provided | videoCallLink | 3 |
| Stripe connected | stripeStatus === 'connected' | 4 |

**Note:** Stripe is optional for launch but shows as warning. All other items must be complete.

## Terms & Agreements

Three required checkboxes (all must be accepted to enable launch):

1. **Independent Contractor** - User understands they're responsible for own taxes
2. **Response Time** - User agrees to respond to bookings within 48 hours
3. **Terms of Service** - User accepts Mentor Terms of Service (links to /mentor-terms)

## Earnings Estimate

Component calculates potential monthly earnings based on:

- Average price across all enabled services
- Estimated 4 bookings per month
- 80% mentor take (20% platform commission)

```
Monthly Estimate = Average Service Price × 4 bookings × 0.8
```

## Launch Process

### Pre-Launch Validation

1. Check all checklist items complete (except optional Stripe)
2. Verify all terms accepted
3. Enable "Launch My Profile" button

### During Launch (isLaunching = true)

1. Button shows spinner and "Launching..." text
2. All form interactions disabled
3. Call onLaunch() callback
4. Wait for completion

### Post-Launch Success

1. Trigger confetti animation
2. Show celebration screen
3. Display shareable profile link
4. Provide action buttons
5. Show next steps guidance

## Profile Preview

Uses the ProfilePreviewPanel component to show a live preview of how the profile appears to applicants. Updates in real-time as data changes (though data is locked at this step).

## Styling & UX

- **Mobile-first** - Two-column layout stacks on mobile
- **Touch targets** - All interactive elements meet 44px minimum
- **Disabled states** - Clear visual feedback for incomplete requirements
- **Loading states** - Spinner during launch process
- **Success celebration** - Confetti animation with gradient background
- **Color coding** - Green checkmarks for complete, yellow warnings for Stripe

## Accessibility

- Semantic HTML structure
- Proper ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly checklist
- Focus management through launch flow

## Example Usage

### Complete Profile Ready to Launch

```jsx
import { OnboardingStep5Review } from '@/components/features/provider/OnboardingStep5Review';

function OnboardingFlow() {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleLaunch = async () => {
    setIsLaunching(true);
    try {
      await api.launchProviderProfile({
        profile: profileData,
        services: servicesData,
        availability: availabilityData,
      });
      // Component shows celebration on success
    } catch (error) {
      console.error('Launch failed:', error);
      // Show error toast
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <OnboardingStep5Review
      profileData={{
        firstName: 'Sarah',
        lastName: 'Johnson',
        bio: 'Passionate about helping future CRNAs...',
        school: 'Johns Hopkins University',
        yearInProgram: 2,
        videoCallLink: 'https://meet.google.com/abc-defg',
        // ... other fields
      }}
      servicesData={[
        { name: 'Essay Review', price: 75, duration: 45, enabled: true },
        { name: 'Mock Interview', price: 100, duration: 60, enabled: true },
      ]}
      availabilityData={{
        monday: { morning: true, afternoon: false, evening: true },
        // ... other days
      }}
      stripeStatus="connected"
      onBack={() => setStep(4)}
      onLaunch={handleLaunch}
      isLaunching={isLaunching}
      onNavigateToStep={(step) => setStep(step)}
    />
  );
}
```

### Incomplete Profile (Shows Requirements)

```jsx
<OnboardingStep5Review
  profileData={{ firstName: 'John' }}  // Incomplete
  servicesData={[]}                    // No services
  availabilityData={{}}                // No availability
  stripeStatus="not_connected"
  onBack={() => setStep(4)}
  onLaunch={handleLaunch}
  isLaunching={false}
  onNavigateToStep={(step) => setStep(step)}
/>
```

In this case:
- Launch button will be disabled
- Checklist shows incomplete items
- User can click incomplete items to navigate back and complete them

## Integration with Onboarding Flow

This component is Step 5 in the provider onboarding sequence:

1. **Profile Setup** - Basic info, bio, photo
2. **Services Configuration** - Add/configure services
3. **Availability & Settings** - Set schedule, video link
4. **Stripe Setup** - Connect payment account
5. **Review & Launch** ← This component

## Post-Launch Actions

After successful launch, the component provides these actions:

- **View My Profile** - Opens profile page in new tab
- **Go to Dashboard** - Navigate to provider dashboard
- **Share on Social** - Share profile link on social media
- **Copy Link** - Copy profile URL to clipboard

## Database Updates on Launch

When onLaunch succeeds, these database changes should occur:

### Supabase Tables

1. **providers** table:
   - Set status = 'active'
   - Set profile_launched_at = NOW()
   - Set profile_url_slug = generated slug

2. **provider_profiles** table:
   - Insert complete profile record

3. **provider_services** table:
   - Insert all enabled services

4. **provider_availability** table:
   - Insert availability schedule

5. **gamification_events** table:
   - Award "Profile Launched" achievement (500 points)

### WordPress/Groundhogg

- Tag user: "Mentor - Active"
- Send "Welcome to Marketplace" email
- Start mentor automation sequence

## Error Handling

Handle these potential errors:

- **Profile submission fails** - Show error toast, keep on pre-launch view
- **Stripe not connected** - Show warning but allow launch
- **Network error** - Retry mechanism
- **Validation errors** - Highlight specific checklist items

## Performance Considerations

- Profile preview updates efficiently (memoized)
- Confetti animation uses CSS (GPU accelerated)
- Form validation runs on checklist items only
- No heavy computations during render

## Future Enhancements

Potential additions:

- [ ] Social media preview cards (Twitter, LinkedIn)
- [ ] Email preview of welcome message
- [ ] Calendar integration setup
- [ ] Tour of provider dashboard
- [ ] Mentor community introduction
- [ ] First booking walkthrough

## Files

- **Component:** `/src/components/features/provider/OnboardingStep5Review.jsx`
- **Example:** `/src/components/features/provider/OnboardingStep5Review.example.jsx`
- **Documentation:** `/src/components/features/provider/OnboardingStep5Review.md` (this file)

## Related Components

- `ProfilePreviewPanel` - Shows profile preview
- `OnboardingProgressWidget` - Shows overall progress
- `ServiceTemplates` - Used in Step 2
- `LevelUpModal` - Similar celebration pattern

## Design References

Celebration pattern inspired by:
- `LevelUpModal.jsx` - Confetti and celebration UI
- `BadgeEarnedModal.jsx` - Success state patterns
- Gamification system celebrations
