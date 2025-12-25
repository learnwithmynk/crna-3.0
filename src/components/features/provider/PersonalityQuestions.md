# PersonalityQuestions Component

## Overview

The PersonalityQuestions component is a **KEY DIFFERENTIATOR** for The CRNA Club's mentor marketplace. While competitors focus purely on credentials, we help applicants find mentors they'll actually vibe with through fun personality questions.

This creates a more human, connection-driven marketplace experience that feels less transactional and more community-oriented.

## Features

- **10 Optional Questions**: Mix of text inputs, dropdowns, and radio buttons
- **Character Counters**: Shows remaining characters for text inputs (turns orange near limit)
- **Colorful Card Design**: Each question has a unique color theme and emoji icon
- **Progress Tracking**: Shows "X/10 questions answered" with visual progress bar
- **Gamification**: "Personality Pro" badge unlocked at 5+ answers
- **Visual Feedback**: Checkmark appears when question is answered
- **Encouragement Messages**: Contextual messages based on completion status

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `object` | No | `{}` | Object containing personality answers keyed by question ID |
| `onChange` | `function` | No | - | Callback when any answer changes, receives updated value object |
| `className` | `string` | No | - | Additional CSS classes for the wrapper |

## Value Object Structure

```javascript
{
  tagline: string,           // "If you knew me..." (max 100 chars)
  astrology: string,         // Astrological sign (select)
  icu_vibe: string,          // ICU working style (select)
  pet_preference: string,    // Cats or dogs? (radio)
  patient_population: string, // Favorite patient type (max 50 chars)
  music: string,             // Road trip music (max 75 chars)
  weird_fact: string,        // Weird fact (max 150 chars)
  comfort_food: string,      // Comfort food (max 50 chars)
  hobbies: string,           // Hobbies (max 100 chars)
  motto: string              // Personal motto (max 100 chars)
}
```

## Question Details

### 1. Tagline
- **Field**: `tagline`
- **Type**: Text input
- **Max Length**: 100 characters
- **Icon**: Sparkles
- **Example**: "I always have a coffee in hand"

### 2. Astrology
- **Field**: `astrology`
- **Type**: Select dropdown
- **Icon**: Star
- **Options**: All 12 zodiac signs + "I don't believe in that 😂"

### 3. ICU Vibe
- **Field**: `icu_vibe`
- **Type**: Select dropdown
- **Icon**: Briefcase
- **Options**:
  - Organized chaos
  - Silent efficiency
  - Coffee-fueled heroics
  - Teaching every moment

### 4. Pet Preference
- **Field**: `pet_preference`
- **Type**: Radio buttons
- **Icon**: Cat
- **Options**: Cats 🐱, Dogs 🐕, Both!, Neither

### 5. Patient Population
- **Field**: `patient_population`
- **Type**: Text input
- **Max Length**: 50 characters
- **Icon**: Heart
- **Example**: "Cardiac patients"

### 6. Music
- **Field**: `music`
- **Type**: Text input
- **Max Length**: 75 characters
- **Icon**: Music
- **Example**: "90s hip hop and true crime podcasts"

### 7. Weird Fact
- **Field**: `weird_fact`
- **Type**: Text input
- **Max Length**: 150 characters
- **Icon**: Lightbulb
- **Example**: "I can recite all 50 states in alphabetical order"

### 8. Comfort Food
- **Field**: `comfort_food`
- **Type**: Text input
- **Max Length**: 50 characters
- **Icon**: Coffee
- **Example**: "Pizza and ice cream"

### 9. Hobbies
- **Field**: `hobbies`
- **Type**: Text input
- **Max Length**: 100 characters
- **Icon**: Mountain
- **Example**: "Hiking or binge-watching reality TV"

### 10. Motto
- **Field**: `motto`
- **Type**: Text input
- **Max Length**: 100 characters
- **Icon**: Quote
- **Example**: "Progress over perfection"

## Usage Examples

### Basic Usage

```jsx
import { PersonalityQuestions } from '@/components/features/provider/PersonalityQuestions';

function MentorOnboarding() {
  const [personality, setPersonality] = useState({});

  return (
    <PersonalityQuestions
      value={personality}
      onChange={setPersonality}
    />
  );
}
```

### In Multi-Step Form

```jsx
import { PersonalityQuestions } from '@/components/features/provider/PersonalityQuestions';

function MentorApplicationStep3() {
  const [formData, setFormData] = useState({
    // ... other form fields
    personality: {}
  });

  const handlePersonalityChange = (newPersonality) => {
    setFormData({
      ...formData,
      personality: newPersonality
    });
  };

  return (
    <div>
      <h2>Show Your Personality</h2>
      <PersonalityQuestions
        value={formData.personality}
        onChange={handlePersonalityChange}
      />
    </div>
  );
}
```

### With Save/Skip Buttons

```jsx
import { PersonalityQuestions } from '@/components/features/provider/PersonalityQuestions';
import { Button } from '@/components/ui/button';

function PersonalityStep({ onNext, onSkip }) {
  const [personality, setPersonality] = useState({});

  const handleSave = async () => {
    // Save to backend
    await savePersonality(personality);
    onNext();
  };

  return (
    <div className="space-y-6">
      <PersonalityQuestions
        value={personality}
        onChange={setPersonality}
      />

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onSkip}>
          Skip for Now
        </Button>
        <Button onClick={handleSave}>
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
```

## Backend Integration

### Supabase Schema

Add a `personality` JSONB column to your `mentor_profiles` table:

```sql
ALTER TABLE mentor_profiles
ADD COLUMN personality JSONB DEFAULT '{}'::jsonb;
```

### Saving Data

```javascript
const { error } = await supabase
  .from('mentor_profiles')
  .update({
    personality: personalityData
  })
  .eq('user_id', userId);
```

### Querying Data

```javascript
const { data, error } = await supabase
  .from('mentor_profiles')
  .select('*, personality')
  .eq('user_id', userId)
  .single();

// Use personality data
if (data?.personality) {
  setPersonality(data.personality);
}
```

## Display on Mentor Profiles

When showing mentor profiles to applicants, you can display these personality answers to help them feel connected:

```jsx
function MentorProfileCard({ mentor }) {
  const { personality } = mentor;

  return (
    <div>
      {/* ... other mentor info ... */}

      {personality?.tagline && (
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm italic">
            "{personality.tagline}"
          </p>
        </div>
      )}

      {personality?.icu_vibe && (
        <div>
          <strong>ICU Style:</strong> {personality.icu_vibe}
        </div>
      )}

      {/* Display other fields as needed */}
    </div>
  );
}
```

## Gamification

The component includes built-in gamification:

- **Progress Bar**: Visual progress from 0-100%
- **Count Display**: "X/10 questions answered"
- **Personality Pro Badge**: Unlocked at 5+ answers
- **Checkmarks**: Visual feedback for completed questions
- **Encouragement Messages**: Contextual based on completion

## Design Decisions

### Why These Questions?

1. **Tagline**: Quick personality snapshot
2. **Astrology**: Fun, low-stakes compatibility indicator
3. **ICU Vibe**: Work style compatibility
4. **Pets**: Personal connection point
5. **Patient Population**: Professional interest alignment
6. **Music**: Shared interests discovery
7. **Weird Fact**: Conversation starter
8. **Comfort Food**: Relatability
9. **Hobbies**: Life outside work
10. **Motto**: Values alignment

### Color Coding

Each question has a unique color to create visual variety and make the form feel playful rather than monotonous:

- Purple: Sparkles (personality)
- Pink: Star (astrology)
- Blue: Briefcase (work)
- Orange: Cat (pets)
- Red: Heart (patients)
- Green: Music
- Yellow: Lightbulb (fun fact)
- Amber: Coffee (comfort)
- Teal: Mountain (hobbies)
- Indigo: Quote (motto)

### Character Limits

Carefully chosen to encourage concise, engaging answers:
- Short (50 chars): Quick answers
- Medium (75-100 chars): 1-2 sentences
- Long (150 chars): More detailed response

## Accessibility

- All inputs have proper labels
- Radio buttons are keyboard accessible
- Select dropdowns use native semantics
- Character counters provide real-time feedback
- Color is not the only differentiator (icons + labels)

## Mobile Responsive

- Cards stack vertically
- Touch-friendly targets (44px minimum)
- Character counters remain visible
- Icons scale appropriately

## Future Enhancements

Potential additions for future versions:

1. **Auto-save**: Save answers as user types (debounced)
2. **Question Suggestions**: AI-powered answer suggestions
3. **Matching Score**: Show compatibility score with applicants
4. **Popular Answers**: "X% of mentors also said..."
5. **Video Answers**: Option to record short video responses
6. **More Questions**: Expand based on user feedback

## Testing

Key scenarios to test:

1. Empty state (no answers)
2. Partial completion (1-4 answers)
3. Badge unlock (5+ answers)
4. Full completion (all 10)
5. Character limit behavior
6. Form validation (if required)
7. Save/load from backend

## Related Components

- `PhotoUpload`: Profile photo (also personality-focused)
- `StudentIdUpload`: Verification (credentials-focused)
- `ApplicationStepIndicator`: Multi-step form navigation
