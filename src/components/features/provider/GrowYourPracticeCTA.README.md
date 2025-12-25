# GrowYourPracticeCTA Component Files

## Overview

The `GrowYourPracticeCTA` component encourages provider/mentors to grow their practice through community engagement. It's a vibrant, eye-catching card with a purple-to-orange gradient background that displays engagement actions, gamification points, and clear calls-to-action.

## Files Created

### 1. `GrowYourPracticeCTA.jsx` (Main Component)
The primary component file containing:
- Interactive checklist with 4 engagement actions
- Gamification points (2 pts for posts, 10 pts for live Q&A)
- Engagement score display
- Two action buttons (Community, Social Templates)
- Mobile-responsive layout
- Vibrant gradient background design

**Location**: `/src/components/features/provider/GrowYourPracticeCTA.jsx`

### 2. `GrowYourPracticeCTA.example.jsx` (Example Usage)
Demonstrates how to use the component with:
- State management for completed actions
- Engagement score tracking
- Toggle action completion handler
- Multiple states examples (empty, high engagement)
- Debug info display

**Location**: `/src/components/features/provider/GrowYourPracticeCTA.example.jsx`

### 3. `GrowYourPracticeCTA.md` (Documentation)
Comprehensive documentation including:
- Features overview
- Props API reference
- Engagement actions details
- Usage examples (basic and with API)
- Data structures
- Integration points (Supabase, gamification)
- Accessibility features
- Mobile responsive behavior
- Future enhancements

**Location**: `/src/components/features/provider/GrowYourPracticeCTA.md`

### 4. `GrowYourPracticeCTA.VISUAL.md` (Visual Design Guide)
Visual representation showing:
- ASCII art mockup of component
- Mobile vs desktop layouts
- Color palette details
- All component states
- Icons reference
- Spacing specifications
- Touch target requirements
- Animation details
- Design rationale

**Location**: `/src/components/features/provider/GrowYourPracticeCTA.VISUAL.md`

### 5. Updated `index.js`
Added export for the new component:
```javascript
export { GrowYourPracticeCTA } from './GrowYourPracticeCTA';
```

**Location**: `/src/components/features/provider/index.js`

## Quick Start

### Import and Use

```jsx
import { GrowYourPracticeCTA } from '@/components/features/provider';

function ProviderDashboard() {
  return (
    <GrowYourPracticeCTA
      completedActions={['forums', 'questions']}
      engagementScore={24}
      onActionComplete={(actionId) => {
        console.log('Action toggled:', actionId);
      }}
    />
  );
}
```

### Run Example

To see the component in action, import the example:

```jsx
import GrowYourPracticeCTAExample from '@/components/features/provider/GrowYourPracticeCTA.example';
```

## Component Features

### Key Functionality
- ✅ Interactive checklist with 4 engagement actions
- ✅ Gamification points display
- ✅ Engagement score tracking
- ✅ Community and social template CTAs
- ✅ Mobile responsive (buttons stack on mobile)
- ✅ Accessible (keyboard nav, proper ARIA)
- ✅ Vibrant gradient design
- ✅ Glass-morphism action items
- ✅ Test ID for integration testing

### Engagement Actions
1. **Post in the forums** - 2 pts each
2. **Answer questions in groups** - 2 pts each
3. **Host a live Q&A call** - 10 pts
4. **Share your profile on social media** - No points (awareness)

## Design Highlights

### Visual Style
- **Background**: Purple → Pink → Orange gradient
- **Text**: White with varying opacity
- **Actions**: Frosted glass effect (white/10 + backdrop blur)
- **Buttons**: White primary, transparent outlined secondary
- **Checkboxes**: White border, purple when checked

### Responsive Behavior
- Mobile (< 640px): Stacked buttons, full width
- Desktop (≥ 640px): Side-by-side buttons

## Integration Points

### With Supabase
Store engagement data in `provider_engagement` table:
```sql
CREATE TABLE provider_engagement (
  id uuid PRIMARY KEY,
  provider_id uuid REFERENCES profiles(id),
  action_id text NOT NULL,
  completed_at timestamp,
  points_earned integer
);
```

### With Gamification System
Integrates with `/docs/skills/gamification-system.md`:
- Forum posts: 2 points
- Group answers: 2 points
- Live Q&A: 10 points
- Affects provider search ranking

## Testing

```javascript
// Find component in tests
const card = screen.getByTestId('grow-your-practice');

// Test checkbox interaction
const forumCheckbox = screen.getByLabelText('Post in the forums');
fireEvent.click(forumCheckbox);

// Verify score updates
expect(screen.getByText(/24 points/)).toBeInTheDocument();
```

## Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `completedActions` | `string[]` | `[]` | Array of completed action IDs |
| `engagementScore` | `number` | `0` | Total engagement points |
| `onActionComplete` | `function` | - | Callback when action is toggled |
| `className` | `string` | - | Additional CSS classes |

## Action IDs

```javascript
const ACTION_IDS = {
  FORUMS: 'forums',
  QUESTIONS: 'questions',
  LIVE_QA: 'live-qa',
  SOCIAL: 'social'
};
```

## TODO Items in Code

The component has two TODOs that need to be addressed during integration:

1. **Community Navigation** (line ~123)
   ```javascript
   // TODO: Replace with actual navigation
   window.location.href = '/community';
   ```
   Update to use React Router or your navigation system.

2. **Social Templates URL** (line ~132)
   ```javascript
   // TODO: Replace with actual Canva templates URL
   window.open('https://www.canva.com/templates/', '_blank');
   ```
   Update with actual branded social media template link.

## Related Components

- `OnboardingProgressWidget` - Shows provider onboarding status
- `EarningsSummaryWidget` - Displays earnings summary
- Provider dashboard cards

## File Structure

```
src/components/features/provider/
├── GrowYourPracticeCTA.jsx           # Main component
├── GrowYourPracticeCTA.example.jsx   # Usage examples
├── GrowYourPracticeCTA.md            # Full documentation
├── GrowYourPracticeCTA.VISUAL.md     # Visual design guide
├── GrowYourPracticeCTA.README.md     # This file
└── index.js                          # Exports (updated)
```

## Next Steps

1. Add to provider dashboard page
2. Connect to Supabase backend
3. Integrate with gamification system
4. Update Community button navigation
5. Replace social templates URL
6. Add analytics tracking for button clicks
7. Create engagement scoring algorithm
8. Build provider search ranking feature

## Questions or Issues?

- See `GrowYourPracticeCTA.md` for detailed documentation
- See `GrowYourPracticeCTA.VISUAL.md` for design specifications
- Run `GrowYourPracticeCTA.example.jsx` to see live examples
