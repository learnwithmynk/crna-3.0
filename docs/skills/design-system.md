# Design System

## Brand Identity

The CRNA Club brand is approachable, encouraging, and professional. It says "we've been where you are" while feeling modern and trustworthy.

---

## Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Highlight Yellow | `#f6ff88` | Primary accent, marker-style highlights behind headings, buttons, badges |
| Near Black | `#1A1A1A` | Primary text |
| White | `#FFFFFF` | Cards, backgrounds |

### Background Gradient
The app uses a soft pink-to-purple gradient as the page background:
```css
background: linear-gradient(135deg, #FDF2F8 0%, #F3E8FF 50%, #FDF2F8 100%);
```

### Status Colors

| Name | Hex | Usage |
|------|-----|-------|
| Success Green | `#10B981` | Completed items, positive status |
| Teal/Info | `#14B8A6` | Section headers on school profiles |
| Warning Orange | `#F59E0B` | In progress, attention needed |
| Error Red | `#EF4444` | Errors, required items |
| Muted Gray | `#6B7280` | Secondary text, disabled states |

### Badge/Tag Colors
- **Yellow background tags:** `bg-yellow-100 text-yellow-800`
- **Green status:** `bg-green-100 text-green-800`
- **Orange/In Progress:** `bg-orange-100 text-orange-800`
- **Gray/Not Started:** `bg-gray-100 text-gray-600`

---

## Typography

### Font Stack
```css
/* Headings */
font-family: 'Poppins', 'Montserrat', system-ui, sans-serif;

/* Body */
font-family: 'Inter', system-ui, sans-serif;
```

### Type Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Page Title | 2rem (32px) | Bold (700) | 1.2 |
| Section Header | 1.25rem (20px) | Semibold (600) | 1.3 |
| Card Title | 1rem (16px) | Semibold (600) | 1.4 |
| Body | 0.875rem (14px) | Normal (400) | 1.5 |
| Small/Caption | 0.75rem (12px) | Normal (400) | 1.4 |

### The Yellow Highlight Effect
Headings often have a yellow marker-style highlight behind them:
```css
.highlight-heading {
  display: inline;
  background: linear-gradient(to top, #f6ff88 50%, transparent 50%);
  padding: 0 4px;
}
```

**For page titles:** Use the `PageWrapper` component which automatically applies the highlight:
```jsx
import PageWrapper from '@/components/layout/page-wrapper';

// The title automatically gets the highlight-marker effect
<PageWrapper title="Settings">
  <YourPageContent />
</PageWrapper>
```

The `highlight-marker` CSS class is defined in `index.css` and provides the yellow underline effect.

---

## Spacing

Using Tailwind's default spacing scale:
- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-6`: 24px
- `space-8`: 32px

### Standard Spacing Patterns
- **Card padding:** `p-4` or `p-6`
- **Section gaps:** `space-y-6`
- **Grid gaps:** `gap-4` or `gap-6`
- **Page margins:** `px-4 md:px-6 lg:px-8`

---

## Components

### Cards

**IMPORTANT:** Do NOT override the Card component's border-radius. It uses `rounded-4xl` by default for our Apple-inspired design.

```jsx
/* ✅ CORRECT - use Card without rounded overrides */
<Card>
  <CardHeader>...</CardHeader>
  <CardContent>...</CardContent>
</Card>

/* ✅ CORRECT - can add other styling like borders */
<Card className="border-2 border-yellow-200 bg-yellow-50">
  ...
</Card>

/* ❌ WRONG - don't override rounded */
<Card className="rounded-xl">  // Don't do this!
<Card className="rounded-2xl"> // Don't do this!
```

**Card component features (from `/src/components/ui/card.jsx`):**
- `rounded-4xl` - Extra-rounded corners for Apple-style design
- `ease-apple` - Custom Apple-like easing for smooth transitions
- `hover:shadow-soft` - Subtle shadow lift on hover
- `glass` prop - Enables glassmorphism variant (backdrop-blur)
- `interactive` prop - Extra lift animation for clickable cards

```jsx
/* Standard card */
<Card>...</Card>

/* Glassmorphism card */
<Card glass>...</Card>

/* Interactive/clickable card */
<Card interactive>...</Card>
```

**For nested elements inside cards** (alerts, info boxes, etc.), use `rounded-2xl` or `rounded-3xl`:
```jsx
<Card>
  <CardContent>
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
      Info box content
    </div>
  </CardContent>
</Card>
```

### Buttons

**Primary (Yellow)**
```jsx
<button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-4 py-2 rounded-lg">
  Action
</button>
```

**Secondary (Outlined)**
```jsx
<button className="border border-gray-300 hover:border-gray-400 text-gray-700 font-medium px-4 py-2 rounded-lg">
  Secondary
</button>
```

**Text/Link**
```jsx
<button className="text-gray-600 hover:text-gray-900 underline">
  Link Action
</button>
```

### Tags/Badges

**Category Tags (selectable)**
```jsx
<span className="px-3 py-1 rounded-full border border-gray-300 text-sm hover:bg-gray-50 cursor-pointer">
  Tag Name
</span>

/* Selected state */
<span className="px-3 py-1 rounded-full bg-yellow-100 border border-yellow-400 text-yellow-800 text-sm">
  Selected Tag
</span>
```

**Status Badges**
```jsx
/* Submitted */
<span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
  Submitted
</span>

/* In Progress */
<span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
  In Progress
</span>

/* Not Started */
<span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
  Not Started
</span>
```

### Input Fields
```jsx
<input 
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none"
  placeholder="Placeholder text"
/>
```

### Progress Bars
```jsx
<div className="w-full bg-gray-200 rounded-full h-2">
  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '36%' }}></div>
</div>
```

---

## Layout

### Page Structure
```jsx
<div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
  <Sidebar />
  <main className="ml-16 md:ml-64 p-6">
    <PageHeader title="Page Title" />
    <div className="space-y-6">
      {/* Page content */}
    </div>
  </main>
</div>
```

### Sidebar
- Collapsed on mobile (icons only): `w-16`
- Expanded on desktop: `w-64`
- Dark or white background depending on design
- Active item: Yellow highlight/indicator

### Grid Patterns

**Card Grid (Programs, Courses)**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
```

**Two-Column Layout (Detail pages)**
```jsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">{/* Main content */}</div>
  <div>{/* Sidebar/checklist */}</div>
</div>
```

---

## Icons

Using Lucide React (already available in shadcn/ui setup):
```jsx
import { Heart, BookOpen, Calendar, Users } from 'lucide-react';
```

Common icons in the app:
- `Heart` - Clinical
- `BookOpen` - Learning
- `Calendar` - Events, Shadow Days
- `Users` - Community
- `Target` - Target Programs
- `CheckCircle` - Completed items
- `Circle` - Incomplete items
- `ChevronRight` - Navigation
- `Plus` - Add actions
- `Pencil` - Edit
- `Trash` - Delete

---

## Responsive Breakpoints

Using Tailwind defaults:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Mobile-First Approach
Always start with mobile styles, add complexity at larger breakpoints:
```jsx
<div className="text-sm md:text-base lg:text-lg">
```

### Touch Targets
Minimum 44px for tappable elements on mobile.

---

## Animation & Transitions

Keep it subtle and fast:
```css
transition-all duration-200 ease-in-out
```

Common transitions:
- Hover states: color, background, shadow
- Collapsible sections: height, opacity
- Modals: fade + scale

---

## Dark Mode

Not currently implemented. Design for light mode only for MVP.

---

## Accessibility

- Color contrast: Ensure 4.5:1 minimum for text
- Focus states: Visible focus rings on all interactive elements
- Alt text: All images need descriptions
- Semantic HTML: Use proper headings, buttons, links
- Keyboard navigation: All actions reachable via keyboard
