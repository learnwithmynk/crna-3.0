# ServiceTemplates Component - Quick Reference

## Component Summary

**File:** `/src/components/features/provider/ServiceTemplates.jsx`

**Purpose:** Helps SRNA mentors create compelling service descriptions using pre-written templates.

**Key Value:** Reduces friction in provider onboarding by eliminating the "blank page problem" for mentors who aren't professional copywriters.

## Visual Structure

```
ServiceTemplates
├── Header
│   ├── Title: "Service Description Templates"
│   └── Subtitle: Instructions
│
└── Template Cards (1 or 4 depending on props)
    ├── Card Header
    │   ├── Icon + Title + "Used" badge (if applicable)
    │   └── Expand/Collapse button
    │
    ├── Card Content (when expanded)
    │   └── Template preview in gray box
    │
    └── Card Footer (when expanded)
        └── "Use This Template" button
            └── Changes to "Copied!" after click
```

## Props at a Glance

```jsx
<ServiceTemplates
  serviceType="mock_interview"    // Optional: filter to one type
  onSelectTemplate={handleCopy}   // Required: callback with template text
  currentDescription={description} // Optional: to show "used" indicator
/>
```

## States & Behaviors

### Template Card States
1. **Collapsed** - Default state, shows just header
2. **Expanded** - Shows full template text and copy button
3. **Copied** - Button shows checkmark for 2 seconds after copy
4. **Used** - Green border/background if template detected in current description

### Interaction Flow
```
User clicks expand (chevron)
  → Template text reveals
    → User reads template
      → User clicks "Use This Template"
        → onSelectTemplate(templateText) called
          → Button shows "Copied!" for 2s
            → Card shows "Used" badge
              → User can customize in textarea
```

## Service Types & Templates

| Type | Title | Use Case | Typical Price |
|------|-------|----------|---------------|
| `mock_interview` | Mock Interview | Practice interviews with feedback | $75-150 |
| `essay_review` | Essay Review | Personal statement feedback | $50-100 |
| `coaching` | Coaching/Strategy | Application strategy planning | $75-125 |
| `qa_call` | Q&A Call | Open conversation about CRNA journey | $30-60 |

## Integration Points

### Where It's Used
1. **Provider Onboarding** - Stage 1 (Minimum Viable Profile)
2. **Provider Onboarding** - Stage 2 (Enhanced Profile)
3. **Service Creation** - When adding new services
4. **Service Editing** - When editing existing services

### Example Integration
```jsx
// In ServiceCreationForm.jsx
const [description, setDescription] = useState('');

return (
  <>
    <Textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    />

    <ServiceTemplates
      serviceType={serviceType} // From form state
      onSelectTemplate={setDescription}
      currentDescription={description}
    />
  </>
);
```

## UI/UX Features

### User-Friendly Elements
- ✅ Expandable cards prevent overwhelming users
- ✅ One-click copy reduces friction
- ✅ Visual "used" indicator prevents confusion
- ✅ Customization tips encourage personalization
- ✅ Clear preview before copying

### Design Details
- Card border: Gray (unused) → Green (used)
- Icon background: Gray (unused) → Green (used)
- Button text: "Use This Template" → "Copied to Description!"
- Badge: Green with checkmark when template used

## Customization Tips (Built-in)

Component shows these tips to help mentors personalize:
1. Add specific details about your program or experience
2. Mention any unique expertise or specializations
3. Keep it conversational and authentic to your voice
4. Include what applicants will walk away with
5. Be honest about what you can and can't help with

## Technical Details

### Dependencies
```jsx
import { Card, CardHeader, ... } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Check, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
```

### State Management
```jsx
const [expandedTemplate, setExpandedTemplate] = useState(null);  // Which card is expanded
const [copiedTemplate, setCopiedTemplate] = useState(null);      // Which shows "Copied!"
```

### Template Detection Logic
```javascript
const isTemplateUsed = (description) => {
  return currentDescription.includes(description.substring(0, 50));
};
```

## Design System Alignment

- **Colors:** Follows CRNA Club design system
  - Green: Success states (bg-green-50, border-green-300, text-green-800)
  - Blue: Info/tips (bg-blue-50, border-blue-200, text-blue-900)
  - Gray: Neutral/unused states

- **Typography:** System font stack, consistent sizing
- **Spacing:** Uses Tailwind spacing scale (space-y-3, space-y-4, p-4, etc.)
- **Borders:** Rounded corners (rounded-lg) throughout
- **Transitions:** Smooth animations on state changes

## Accessibility

- ✅ Keyboard navigation supported
- ✅ Focus states on all interactive elements
- ✅ Semantic HTML (buttons, headings, etc.)
- ✅ Screen reader friendly text
- ✅ Icon buttons include accessible labels
- ✅ Color contrast meets WCAG AA standards

## Performance

- **Lightweight:** No external API calls
- **Fast:** Templates stored as constants
- **Optimized:** Only renders needed templates
- **Efficient:** Minimal re-renders (controlled component)

## Testing Checklist

When testing this component:
- [ ] All 4 templates display correctly
- [ ] Expand/collapse works for each card
- [ ] "Use This Template" copies text correctly
- [ ] "Copied!" state shows and auto-clears after 2s
- [ ] "Used" badge appears when template is in description
- [ ] Green styling applies to used templates
- [ ] Works with single serviceType prop
- [ ] Works without serviceType (shows all)
- [ ] Customization tips are visible and helpful
- [ ] Mobile responsive (cards stack properly)
- [ ] Keyboard navigation works
- [ ] Focus states are visible

## Future Improvements

Potential enhancements:
1. **AI Customization** - Suggest personalized edits based on mentor's profile
2. **Template Analytics** - Track which templates convert best
3. **Custom Templates** - Allow admins to add/edit templates
4. **Multi-language** - Support for non-English templates
5. **Version History** - Track template usage and edits
6. **A/B Testing** - Test different template wording
7. **Template Categories** - Filter by beginner-friendly, premium, etc.

## Related Files

- `ServiceTemplates.jsx` - Main component
- `ServiceTemplates.example.jsx` - Usage examples
- `ServiceTemplates.README.md` - Full documentation
- `ServiceTemplates.SUMMARY.md` - This file (quick reference)

## Key Metrics to Track

Once implemented, track:
1. **Template Usage Rate** - % of providers using templates vs writing from scratch
2. **Template Customization Rate** - % who modify templates vs use verbatim
3. **Service Completion Rate** - Do templates improve onboarding completion?
4. **Booking Conversion** - Do template-based descriptions convert better?
5. **Time to Complete** - Do templates speed up onboarding?

## Questions & Decisions

### Business Rules
- Should templates be editable by admins? → Future enhancement
- Should we track which template was used? → Good for analytics
- Should we limit template usage (1 per service)? → No, allow customization

### Technical Decisions
- Template storage: Component constant vs database? → Constant for MVP
- Detection method: Exact match vs substring? → Substring (more flexible)
- Multi-language support: Now or later? → Later
- Template versioning: Track changes? → Not for MVP

## Success Criteria

Component is successful if:
1. **Adoption:** 60%+ of new providers use at least one template
2. **Completion:** Template users complete onboarding faster
3. **Quality:** Template-based descriptions maintain 4.5+ star average
4. **Conversion:** Services with templates book at same/higher rate
5. **Feedback:** Providers report templates were helpful in surveys

---

**Component Status:** ✅ Complete and ready for integration

**Last Updated:** December 13, 2024
