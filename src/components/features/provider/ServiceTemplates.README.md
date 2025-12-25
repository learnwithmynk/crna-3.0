# ServiceTemplates Component

## Overview

The `ServiceTemplates` component provides pre-written service descriptions to help SRNA mentors create compelling service listings without needing professional copywriting skills.

## Purpose

Many SRNAs aren't professional contractors and may struggle with writing effective service descriptions. This component:
- Provides high-quality templates for each service type
- Allows one-click copying to service description field
- Shows which templates have been used
- Provides customization tips

## Service Types Supported

1. **Mock Interview** - Simulated CRNA program interviews with feedback
2. **Essay Review** - Personal statement and secondary essay feedback
3. **Coaching/Strategy** - Application strategy and school selection guidance
4. **Q&A Call** - Open conversation about the CRNA journey

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `serviceType` | string | No | undefined | Filter to show only one template. Options: `'mock_interview'`, `'essay_review'`, `'coaching'`, `'qa_call'`. If omitted, shows all templates. |
| `onSelectTemplate` | function | Yes | - | Callback when user clicks "Use This Template". Receives template text as parameter. |
| `currentDescription` | string | No | `''` | Current service description to check if template has been used. |

## Usage Examples

### Basic Usage (Single Service Type)

```jsx
import { useState } from 'react';
import { ServiceTemplates } from '@/components/features/provider/ServiceTemplates';

function ServiceForm() {
  const [description, setDescription] = useState('');

  return (
    <div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your service..."
        rows={6}
      />

      <ServiceTemplates
        serviceType="mock_interview"
        onSelectTemplate={setDescription}
        currentDescription={description}
      />
    </div>
  );
}
```

### Show All Templates

```jsx
function TemplateLibrary() {
  const [description, setDescription] = useState('');

  return (
    <ServiceTemplates
      onSelectTemplate={setDescription}
      currentDescription={description}
    />
  );
}
```

### Integration with Multi-Service Form

```jsx
function MultiServiceForm() {
  const [services, setServices] = useState({
    mock_interview: { description: '' },
    essay_review: { description: '' },
  });

  const [activeService, setActiveService] = useState('mock_interview');

  const handleSelectTemplate = (templateText) => {
    setServices(prev => ({
      ...prev,
      [activeService]: {
        ...prev[activeService],
        description: templateText
      }
    }));
  };

  return (
    <div>
      {/* Service selector */}
      <select
        value={activeService}
        onChange={(e) => setActiveService(e.target.value)}
      >
        <option value="mock_interview">Mock Interview</option>
        <option value="essay_review">Essay Review</option>
      </select>

      {/* Description field */}
      <textarea
        value={services[activeService].description}
        onChange={(e) => setServices(prev => ({
          ...prev,
          [activeService]: {
            ...prev[activeService],
            description: e.target.value
          }
        }))}
      />

      {/* Templates for active service */}
      <ServiceTemplates
        serviceType={activeService}
        onSelectTemplate={handleSelectTemplate}
        currentDescription={services[activeService].description}
      />
    </div>
  );
}
```

## Features

### 1. Expandable Template Cards
Each template is shown in a collapsible card. Click the chevron to expand and view the full template text.

### 2. One-Click Copy
Clicking "Use This Template" immediately copies the template text to your description via the `onSelectTemplate` callback.

### 3. Visual Feedback
- Copied state shows "Copied to Description!" for 2 seconds
- Used templates show a green checkmark badge
- Used template cards have green border and background

### 4. Customization Tips
Built-in tips section helps mentors personalize templates:
- Add specific program details
- Mention unique expertise
- Keep it conversational and authentic
- Include concrete outcomes
- Be honest about limitations

## Template Content

### Mock Interview
"I'll simulate a real CRNA program interview, covering behavioral questions, clinical scenarios, and program-specific topics. You'll receive honest, constructive feedback on your answers, body language, and presentation. I'll help you identify areas for improvement and build confidence for the real thing."

### Essay Review
"I'll provide detailed feedback on your personal statement or secondary essays. I'll focus on story structure, authenticity, and what makes YOU stand out. You'll get specific suggestions for improvement, not just grammar fixes. My goal is to help your unique voice shine through."

### Coaching/Strategy
"Whether you're just starting to explore CRNA school or fine-tuning your application strategy, I'll help you create a clear action plan. We'll discuss school selection, timeline, strengthening weak areas, and what programs are really looking for."

### Q&A Call
"Got questions about the CRNA journey? Let's chat! No formal structure - just an open conversation where you can ask anything about ICU experience, applications, student life, or what to expect. I'll share my honest experiences and advice."

## Styling

Component uses design system components and follows CRNA Club brand:
- Cards with rounded corners and subtle shadows
- Yellow primary color for buttons
- Green success states for used templates
- Gray neutral states for unused templates
- Responsive spacing and typography

## Accessibility

- Keyboard navigable (all buttons and interactions)
- Semantic HTML structure
- Clear visual states (hover, focus, active, disabled)
- ARIA labels on icon buttons
- Screen reader friendly

## File Structure

```
/src/components/features/provider/
├── ServiceTemplates.jsx           # Main component
├── ServiceTemplates.example.jsx   # Usage examples
└── ServiceTemplates.README.md     # This file
```

## Related Components

- Used in: Provider onboarding flow (Stage 1 & 2)
- Used in: Service creation/editing forms
- Used in: Provider settings (edit existing services)

## Future Enhancements

Potential improvements for future versions:
1. AI-powered template customization suggestions
2. Template versioning (update templates over time)
3. Custom template creation (admins add new templates)
4. Template analytics (which templates convert best)
5. Provider-specific template suggestions based on their program/background
6. Multi-language support
7. Template categories (beginner-friendly, premium, etc.)

## Testing

When testing this component:
1. Verify templates load for each service type
2. Test expand/collapse functionality
3. Confirm "Use This Template" copies text correctly
4. Check that "used" indicator shows when template is in description
5. Test with all service types
6. Test with no service type (shows all)
7. Verify customization tips are helpful and clear

## Notes

- Templates are stored in the component as a constant object
- Template detection uses substring matching (first 50 characters)
- Copied state automatically resets after 2 seconds
- Component is fully controlled (no internal state for description)
