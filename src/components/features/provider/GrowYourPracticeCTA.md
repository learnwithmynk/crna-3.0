# GrowYourPracticeCTA Component

## Overview

The `GrowYourPracticeCTA` component is a call-to-action card designed for the provider dashboard that encourages mentors to grow their practice through community engagement. It features a vibrant gradient background, an interactive checklist of engagement actions, gamification points, and clear CTAs.

## Features

- **Eye-catching Design**: Vibrant purple-to-orange gradient background that stands out
- **Interactive Checklist**: Track completion of 4 key engagement actions
- **Gamification**: Display points earned for each action (2 pts for posts, 10 pts for live calls)
- **Engagement Score**: Shows total engagement points with motivational messaging
- **Action Buttons**: Primary CTA to community, secondary to download social templates
- **Mobile Responsive**: Stacks buttons vertically on small screens
- **Accessible**: Proper ARIA labels, keyboard navigation, touch-friendly targets

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `completedActions` | `string[]` | `[]` | Array of action IDs that are completed (e.g., `['forums', 'questions']`) |
| `engagementScore` | `number` | `0` | Total engagement points earned by the provider |
| `onActionComplete` | `function` | - | Callback when action checkbox is toggled. Receives `actionId` as parameter |
| `className` | `string` | - | Additional CSS classes to apply to the card |

## Engagement Actions

The component tracks 4 specific actions:

1. **Post in the forums** (`'forums'`)
   - Icon: MessageSquare
   - Points: 2 pts each

2. **Answer questions in groups** (`'questions'`)
   - Icon: Users
   - Points: 2 pts each

3. **Host a live Q&A call** (`'live-qa'`)
   - Icon: Video
   - Points: 10 pts

4. **Share your profile on social media** (`'social'`)
   - Icon: Share2
   - Points: None (awareness/marketing action)

## Usage

### Basic Usage

```jsx
import { GrowYourPracticeCTA } from '@/components/features/provider/GrowYourPracticeCTA';

function ProviderDashboard() {
  const [completedActions, setCompletedActions] = useState(['forums']);
  const [engagementScore, setEngagementScore] = useState(24);

  const handleActionComplete = (actionId) => {
    // Toggle completion and update score
    setCompletedActions(prev =>
      prev.includes(actionId)
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };

  return (
    <GrowYourPracticeCTA
      completedActions={completedActions}
      engagementScore={engagementScore}
      onActionComplete={handleActionComplete}
    />
  );
}
```

### With API Integration

```jsx
import { GrowYourPracticeCTA } from '@/components/features/provider/GrowYourPracticeCTA';
import { useProviderEngagement } from '@/hooks/useProviderEngagement';

function ProviderDashboard() {
  const {
    completedActions,
    engagementScore,
    toggleAction
  } = useProviderEngagement();

  return (
    <GrowYourPracticeCTA
      completedActions={completedActions}
      engagementScore={engagementScore}
      onActionComplete={toggleAction}
    />
  );
}
```

## Styling

The component uses a gradient background that creates a vibrant, eye-catching appearance:

```css
background: linear-gradient(to bottom right,
  rgb(168, 85, 247),  /* purple-500 */
  rgb(236, 72, 153),  /* pink-500 */
  rgb(251, 146, 60)   /* orange-400 */
);
```

Key visual elements:
- White text with varying opacity for hierarchy
- Glass-morphism effect on action items (white/10 background with backdrop blur)
- White checkboxes that turn purple when checked
- Primary button has white background with purple text
- Secondary button has transparent background with white border

## Data Structure

### Completed Actions Array

```javascript
const completedActions = [
  'forums',    // Posted in forums
  'questions', // Answered questions
  'live-qa',   // Hosted live Q&A
  'social'     // Shared on social media
];
```

### Action Toggle Handler

```javascript
const handleActionComplete = (actionId) => {
  // actionId will be one of: 'forums', 'questions', 'live-qa', 'social'

  // Example: Toggle completion in state
  setCompletedActions(prev => {
    if (prev.includes(actionId)) {
      return prev.filter(id => id !== actionId);
    } else {
      return [...prev, actionId];
    }
  });

  // Example: Update score based on action points
  const points = { forums: 2, questions: 2, 'live-qa': 10, social: 0 };
  updateEngagementScore(points[actionId]);
};
```

## Button Actions

### Go to Community Button

Currently navigates to `/community`. Replace with actual navigation:

```javascript
// Update in component:
onClick={() => navigate('/community')}
// or
onClick={() => window.location.href = '/community'}
```

### Download Social Templates Button

Currently opens generic Canva templates. Replace with actual template URL:

```javascript
// Update in component:
onClick={() => {
  window.open('https://your-canva-templates-url', '_blank');
}}
```

## Integration Points

### With Supabase

Store engagement data in a `provider_engagement` table:

```sql
CREATE TABLE provider_engagement (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id uuid REFERENCES profiles(id),
  action_id text NOT NULL,
  completed_at timestamp with time zone DEFAULT now(),
  points_earned integer
);
```

Query completed actions:

```javascript
const { data: completedActions } = await supabase
  .from('provider_engagement')
  .select('action_id')
  .eq('provider_id', userId);

const actionIds = completedActions.map(a => a.action_id);
```

### With Gamification System

This component integrates with the gamification system documented in `/docs/skills/gamification-system.md`:

- Forum posts: 2 points (tracked in `action_history`)
- Group answers: 2 points
- Live Q&A calls: 10 points
- Total engagement score affects provider search ranking

## Accessibility

- Checkboxes are keyboard accessible (Tab to focus, Space to toggle)
- All interactive elements have minimum 44px touch targets
- Color contrast meets WCAG AA standards (white text on gradient)
- Labels are properly associated with checkboxes using `htmlFor`
- Icons have descriptive aria-labels (implicit through icon components)

## Mobile Responsive Behavior

- **Mobile (< 640px)**: Action buttons stack vertically
- **Desktop (>= 640px)**: Action buttons display side-by-side
- Touch targets remain 44px minimum at all breakpoints
- Card padding adjusts for smaller screens

## Testing

Use the test ID for integration tests:

```javascript
const card = screen.getByTestId('grow-your-practice');
```

## Future Enhancements

1. **Progress Animation**: Animate engagement score when it changes
2. **Action History**: Show recent engagement activities below score
3. **Milestones**: Display badges/achievements at score thresholds
4. **Comparison**: Show average engagement score vs other providers
5. **Recommendations**: Suggest next best action based on profile completion

## Related Components

- `OnboardingProgressWidget`: Shows provider onboarding completion
- `EngagementChart`: Visualizes engagement over time (if implemented)
- Provider dashboard stats cards

## Notes

- The component handles its own UI state for checkboxes
- Parent component is responsible for persisting state changes
- Engagement score calculation should be done server-side for accuracy
- Consider debouncing API calls if toggling actions updates backend immediately
