# OnboardingStep1Profile Component

Step 1 of the provider onboarding wizard - "Your Profile - Professional + Personality"

## Overview

This component handles the first step of the SRNA provider onboarding process, where applicants create their professional profile and showcase their personality. It's designed to make providers feel confident and excited about joining the marketplace.

## Features

- **Professional Profile Section:**
  - Tagline input (50-100 characters) with character counter
  - Extended bio textarea (200-500 words) with character counter
  - ICU background dropdown (MICU, SICU, CVICU, etc.)
  - Years of ICU experience dropdown
  - Specializations checkboxes (Interview Prep, Essay Review, etc.)

- **Personality Section:**
  - Integrates PersonalityQuestions component
  - 10 fun, optional questions to help applicants find mentors they vibe with

- **Profile Preview Panel:**
  - Real-time preview of how the profile will look to applicants
  - Desktop: sticky sidebar on the right
  - Mobile: collapsible section at the top

- **Validation:**
  - Inline validation with helpful error messages
  - Required field indicators
  - Character count tracking with visual feedback
  - AI tips for writing compelling content

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `data` | `object` | No | Current step data containing profile fields |
| `onChange` | `function(field, value)` | No | Callback when any field changes |
| `onNext` | `function` | No | Callback when user clicks Next Step |
| `onBack` | `function` | No | Callback when user clicks Back |
| `className` | `string` | No | Additional CSS classes |

## Data Structure

```javascript
{
  tagline: string,           // 50-100 chars
  bio: string,               // 200+ chars
  icuType: string,           // One of ICU_TYPES values
  icuYears: string,          // "1" to "20"
  specializations: string[], // Array of specialization values
  personality: {             // Personality question answers
    tagline: string,
    astrology: string,
    icu_vibe: string,
    pet_preference: string,
    patient_population: string,
    music: string,
    weird_fact: string,
    comfort_food: string,
    hobbies: string,
    motto: string
  }
}
```

## Validation Rules

- **Tagline:**
  - Required
  - Minimum 50 characters
  - Maximum 100 characters

- **Bio:**
  - Required
  - Minimum 200 characters
  - Maximum 2000 characters

- **ICU Type:**
  - Required
  - Must select from dropdown

- **ICU Years:**
  - Required
  - Must select from dropdown

- **Specializations:**
  - Optional
  - Can select multiple

- **Personality Questions:**
  - All optional
  - Help with marketplace matching

## Usage Example

```jsx
import { OnboardingStep1Profile } from '@/components/features/provider/OnboardingStep1Profile';

function ProviderOnboarding() {
  const [stepData, setStepData] = useState({
    tagline: '',
    bio: '',
    icuType: '',
    icuYears: '',
    specializations: [],
    personality: {}
  });

  const handleChange = (field, value) => {
    setStepData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    // Save data and proceed to Step 2
    saveStepData(stepData);
    goToStep2();
  };

  return (
    <OnboardingStep1Profile
      data={stepData}
      onChange={handleChange}
      onNext={handleNext}
      onBack={() => goToWelcome()}
    />
  );
}
```

## ICU Types

Available ICU background options:

- MICU (Medical ICU)
- SICU (Surgical ICU)
- CVICU (Cardiovascular ICU)
- Neuro ICU
- PICU (Pediatric ICU)
- NICU (Neonatal ICU)
- Trauma ICU
- Burn ICU
- Mixed ICU
- Other

## Specializations

Available service specializations:

- Interview Prep
- Essay Review
- School Selection
- Timeline Planning
- GPA Strategy
- Clinical Guidance
- Shadowing Tips
- Prerequisite Planning
- Recommendation Letters
- General Mentorship

## Design Considerations

### Mobile-First
- Stacked layout on mobile (< 1024px)
- Two-column layout on desktop (>= 1024px)
- Collapsible preview panel on mobile
- Touch-friendly form controls

### Accessibility
- Proper label associations
- Error messages with ARIA support
- Keyboard navigation
- Focus management
- Semantic HTML

### User Experience
- Character counters show remaining characters
- Visual feedback when approaching limits
- AI tips provide helpful examples
- Real-time preview encourages completion
- Clear validation error messages
- Required fields marked with asterisks

## AI Tips

The component includes contextual AI tips to help providers write compelling content:

- **Tagline Tip:** Example suggestions like "Making ICU to SRNA transitions less scary!"
- **Bio Tip:** Prompts to share journey, ICU experience, and advice

## Character Counters

Character counters provide visual feedback:

- **Gray:** Plenty of characters remaining
- **Orange:** Less than 20 characters remaining
- **Below minimum:** Shows how many more characters needed

## Related Components

- `PersonalityQuestions` - Handles the fun personality section
- `ProfilePreviewPanel` - Shows real-time preview of profile
- `OnboardingProgressWidget` - Shows overall onboarding progress

## Next Steps

After completing Step 1, users proceed to:
- **Step 2:** School & Program Info
- **Step 3:** Photo & Verification
- **Step 4:** Services & Pricing

## TODO

- [ ] Add photo upload to this step (currently in Step 3)
- [ ] Add rich text editor support for bio
- [ ] Add auto-save functionality
- [ ] Add progress persistence to localStorage
- [ ] Add "Save Draft" button option
