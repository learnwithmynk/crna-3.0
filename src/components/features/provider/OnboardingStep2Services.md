# OnboardingStep2Services Component

Step 2 of the provider onboarding flow - configures services that mentors will offer in the marketplace.

## Features

### Service Types
- **Mock Interview** ($75-150, 30-90min) - Practice interviews with feedback
- **Essay Review** ($50-100, 30-60min) - Personal statement feedback
- **Coaching/Strategy** ($60-120, 45-90min) - Application planning sessions
- **Q&A Call** ($40-75, 30-45min) - Open conversation about CRNA journey

### Per-Service Configuration
1. **Enable/Disable Toggle** - Turn services on/off
2. **Description Editor**
   - ServiceTemplates integration for quick start
   - AI writing tips specific to each service type
   - Character counter (50 min, 500 max)
3. **Price Input** with suggested ranges
4. **Duration Dropdown** (service-specific options)
5. **Deliverables Checklist** - What provider will provide
6. **Instant Book Toggle** - Allow immediate booking vs. approval required

## Props

```jsx
{
  data: {
    mock_interview: {
      enabled: boolean,
      description: string,
      price: string,
      duration: string,
      deliverables: string[],
      instantBook: boolean
    },
    essay_review: { /* same structure */ },
    coaching: { /* same structure */ },
    qa_call: { /* same structure */ }
  },
  onChange: (newData) => void,
  onNext: () => void,
  onBack: () => void
}
```

## Validation

Component validates:
- ✅ At least one service must be enabled
- ✅ Enabled services must have description (min 50 chars)
- ✅ Enabled services must have price > 0
- ✅ Shows error states on invalid fields
- ✅ Disables "Continue" button until valid

## Service Configurations

### Mock Interview
- **Price Range**: $75-150
- **Durations**: 30, 45, 60, 90 minutes
- **Deliverables**:
  - Real-time feedback during interview
  - Written summary of strengths/areas to improve
  - Recording of the mock interview
  - Follow-up Q&A (15 min)

### Essay Review
- **Price Range**: $50-100
- **Durations**: 30, 45, 60 minutes
- **Deliverables**:
  - Inline comments on essay
  - Summary feedback document
  - Specific revision suggestions
  - Second review after revisions

### Coaching/Strategy
- **Price Range**: $60-120
- **Durations**: 45, 60, 90 minutes
- **Deliverables**:
  - Personalized action plan
  - School list recommendations
  - Application timeline
  - Email follow-up with resources

### Q&A Call
- **Price Range**: $40-75
- **Durations**: 30, 45 minutes
- **Deliverables**:
  - Notes summary of key takeaways
  - Relevant resource links

## AI Writing Tips

Each service type includes contextual AI tips to help mentors write compelling descriptions:

- **Mock Interview**: "Be specific! Instead of 'I'll help with your interview', try 'I'll simulate real CRNA program questions and give honest feedback on your answers, body language, and how to stand out.'"

- **Essay Review**: "Highlight what makes YOUR feedback unique. Do you focus on storytelling? Authenticity? Standing out from other applicants? Be specific!"

- **Coaching**: "What's your coaching style? Are you a cheerleader, strategist, or tough-love coach? Let applicants know what to expect from a session with you."

- **Q&A Call**: "This is your most casual offering. What topics do you love talking about? ICU experience? Student life? Be conversational and welcoming!"

## Usage

```jsx
import { OnboardingStep2Services } from '@/components/features/provider/OnboardingStep2Services';

function ProviderOnboarding() {
  const [servicesData, setServicesData] = useState({});

  return (
    <OnboardingStep2Services
      data={servicesData}
      onChange={setServicesData}
      onNext={() => console.log('Continue to step 3')}
      onBack={() => console.log('Back to step 1')}
    />
  );
}
```

## Visual Design

- Color-coded cards per service type (purple, blue, green, orange)
- Cards become semi-transparent when disabled
- Collapsible template sections to reduce clutter
- Inline validation with orange highlights
- Summary card showing enabled services count
- Navigation buttons with proper validation states

## Integration

- Works with `ServiceTemplates` component for pre-written descriptions
- Designed to integrate with provider onboarding flow
- Data structure matches expected API format for service configuration
- Mobile-responsive with card-based layout

## Files

- `/src/components/features/provider/OnboardingStep2Services.jsx` - Main component
- `/src/components/features/provider/OnboardingStep2Services.example.jsx` - Usage example
- `/src/components/features/provider/ServiceTemplates.jsx` - Template integration
