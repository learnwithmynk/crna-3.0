# OnboardingProgressWidget

A visually appealing progress indicator for the provider onboarding flow. Shows the 5-step journey from application to Stripe connection.

## Features

- **5 Step Process**: Application → Profile → Services → Availability → Stripe
- **Visual Progress**: Different styling for completed, current, and upcoming steps
- **Contextual Guidance**: Shows "Next: [action]" prompt based on current step
- **Responsive Design**:
  - Desktop: Horizontal layout with connecting lines and chevrons
  - Mobile: Stacked list with progress bar
- **Smooth Animations**: Transitions between steps with gradient effects
- **Completion State**: Special message when all steps are done

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `currentStep` | `number` | Yes | - | Current step number (1-5, or 6+ for complete) |
| `completedSteps` | `number[]` | No | `[]` | Array of completed step numbers |
| `className` | `string` | No | `''` | Additional CSS classes |

## Usage

### Basic Example

```jsx
import { OnboardingProgressWidget } from '@/components/features/provider/OnboardingProgressWidget';

function OnboardingPage() {
  return (
    <OnboardingProgressWidget
      currentStep={2}
      completedSteps={[1]}
    />
  );
}
```

### With State Management

```jsx
import { useState } from 'react';
import { OnboardingProgressWidget } from '@/components/features/provider/OnboardingProgressWidget';

function ProviderOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);

  const completeStep = (stepNum) => {
    setCompletedSteps([...completedSteps, stepNum]);
    setCurrentStep(stepNum + 1);
  };

  return (
    <div className="p-6">
      <OnboardingProgressWidget
        currentStep={currentStep}
        completedSteps={completedSteps}
      />

      {/* Your onboarding form content */}
      <button onClick={() => completeStep(currentStep)}>
        Continue
      </button>
    </div>
  );
}
```

## Step Definitions

| Step # | Label | Next Action Prompt |
|--------|-------|-------------------|
| 1 | Application | Complete your application |
| 2 | Profile | Build your provider profile |
| 3 | Services | Add your services |
| 4 | Availability | Set your availability |
| 5 | Stripe | Connect Stripe account |

## Visual States

### Desktop Layout

**Step 1 - Just Started**
```
[●] Application → [ ] Profile → [ ] Services → [ ] Availability → [ ] Stripe
    (current)      (upcoming)    (upcoming)      (upcoming)        (upcoming)
```

**Step 2 - In Progress**
```
[✓] Application → [●] Profile → [ ] Services → [ ] Availability → [ ] Stripe
   (completed)      (current)     (upcoming)      (upcoming)        (upcoming)
```

**Step 5 - Almost Complete**
```
[✓] Application → [✓] Profile → [✓] Services → [✓] Availability → [●] Stripe
   (completed)     (completed)    (completed)     (completed)       (current)
```

### Color Scheme

- **Completed Steps**: Green (`bg-green-500`, `text-white`) with checkmark icon
- **Current Step**: Yellow (`bg-yellow-400`, `text-black`) with filled circle icon, ring effect, scale animation
- **Upcoming Steps**: Gray (`bg-white`, `border-gray-300`, `text-gray-400`) with step number
- **Connector Lines**:
  - Completed: Green solid
  - Active: Yellow-to-gray gradient
  - Upcoming: Gray

### Mobile Layout

Shows a compact version with:
- Progress bar with gradient (yellow → green)
- Percentage completion
- Stacked list of all steps
- Current step highlighted with yellow background
- Status labels ("Complete", "In Progress")

## Design Details

- **Card Background**: Gradient from purple-50 → pink-50 → purple-50
- **Desktop Step Circles**: 48px (w-12 h-12)
- **Mobile Step Circles**: 32px (w-8 h-8)
- **Current Step Effect**: Yellow ring with scale-110 transform
- **Animations**: 300ms transition-all for smooth state changes
- **Completion Message**: Green banner with checkmark when all steps done

## Accessibility

- Semantic HTML with proper heading hierarchy
- Clear visual distinction between states
- Touch-friendly sizes on mobile (min 44px touch targets)
- Color is not the only indicator (uses icons and text)

## Integration Points

This component is designed to be placed at the top of all provider onboarding pages:

- `/provider/onboarding/application` - Step 1
- `/provider/onboarding/profile` - Step 2
- `/provider/onboarding/services` - Step 3
- `/provider/onboarding/availability` - Step 4
- `/provider/onboarding/stripe` - Step 5

The component persists across all these pages, updating to reflect progress.

## Related Components

- `ApplicationStepIndicator` - Similar pattern for initial provider application (5 steps before onboarding)
- `Card` - Base shadcn/ui component used for the container
- `Check`, `Circle`, `ChevronRight` - Lucide React icons

## Notes

- Component is self-contained with no external state dependencies
- Step numbers are 1-indexed (1, 2, 3, 4, 5)
- Passing `currentStep={6}` or higher shows completion state
- `completedSteps` array is flexible - can mark steps as complete in any order
- Works seamlessly with the CRNA Club design system gradient backgrounds
