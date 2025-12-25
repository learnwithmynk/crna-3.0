# Component Library

This documents all reusable components in the CRNA Club design system. Components are built with shadcn/ui as a base, customized to match the brand.

---

## Typography Guidelines

### ALL CAPS Labels

Use uppercase text with letter-spacing for a clean, modern look. This is a core brand pattern.

**Components available:** `LabelText`, `SectionHeader`, `ActionLink` from `@/components/ui/label-text`

```jsx
import { LabelText, SectionHeader, ActionLink } from '@/components/ui/label-text';

// Role labels - orange/coral color
<LabelText variant="primary">SRNA Applicant</LabelText>

// Category labels - neutral gray
<LabelText>Deadline</LabelText>
<LabelText>Club Event</LabelText>
<LabelText>GRE</LabelText>

// Section headers - wider letter-spacing
<SectionHeader>Upcoming Events</SectionHeader>
<SectionHeader className="mb-4">Events on Dec 19</SectionHeader>

// Action links with arrow
<ActionLink href="/events">View Details</ActionLink>
<ActionLink href="/schools/123">Event Details</ActionLink>
```

**Manual classes** (when not using components):

```jsx
// Role labels - orange/coral color
<p className="text-xs font-medium text-orange-400 uppercase tracking-widest">
  SRNA Applicant
</p>

// Neutral labels - light gray
<p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
  Club Event
</p>

// Section headers - widest spacing
<h3 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
  Upcoming Events
</h3>

// Action links
<a className="text-xs font-semibold text-primary uppercase tracking-widest hover:underline">
  View Details ↗
</a>
```

### Where to Apply ALL CAPS

| Location | Example | Variant |
|----------|---------|---------|
| Header user role | "SRNA APPLICANT" | `primary` (orange) |
| Calendar event types | "DEADLINE", "CLUB" | `default` (gray) |
| Calendar date headers | "EVENTS ON DEC 19" | `default` (gray) |
| Card section headers | "UPCOMING EVENTS" | `default` (gray) |
| Legend labels | "SHADOW", "WORK" | `default` (gray) |
| Action links | "VIEW DETAILS ↗" | `accent` (purple) |
| Sidebar section titles | "MY PROGRAMS" | `default` (gray) |
| Form field labels | "EMAIL", "PASSWORD" | `default` (gray) |
| Status badges | "SUBMITTED", "PENDING" | varies by status |
| Milestone categories | "GRE", "CCRN", "ESSAYS" | `default` (gray) |

### Light Gray Text Hierarchy

Use progressively lighter grays for less important information:
- `text-gray-900` - Primary content, headings, important text
- `text-gray-700` - Secondary content, body text
- `text-gray-500` - Tertiary content, descriptions
- `text-gray-400` - Metadata, labels, subtle info (most common for ALL CAPS)
- `text-gray-300` - Icons, dividers, very subtle elements

### When to Use ALL CAPS

**DO use for:**
- User roles and status badges
- Calendar event type labels
- Card/widget section headers
- Navigation section headers
- Form field labels (optionally)
- Metadata tags and categories
- Action links ("VIEW ALL", "SEE DETAILS")
- Legend labels

**DON'T use for:**
- Body text or descriptions
- Primary button labels
- Error messages
- Long strings of text
- Titles/headings (use bold instead)
- User-generated content

---

## Base Components (shadcn/ui)

These come from shadcn/ui and are customized in `/src/components/ui/`:

### Button

```jsx
import { Button } from '@/components/ui/button';

// Variants
<Button>Default (Yellow)</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Destructive</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>

// States
<Button disabled>Disabled</Button>
<Button loading>Loading...</Button>
```

**Customization:**
```css
/* Primary button - yellow */
.btn-primary {
  @apply bg-yellow-400 hover:bg-yellow-500 text-black font-medium;
}
```

---

### Card

```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    Main content here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Customization:**
```css
.card {
  @apply bg-white rounded-xl shadow-sm border border-gray-100;
}
.card-interactive {
  @apply hover:shadow-md hover:border-gray-200 transition-all cursor-pointer;
}
```

---

### Input

```jsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email"
    type="email"
    placeholder="you@example.com"
  />
</div>
```

---

### Textarea

```jsx
import { Textarea } from '@/components/ui/textarea';

<Textarea 
  placeholder="Enter your notes..."
  rows={4}
/>
```

---

### Select

```jsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select state" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="ca">California</SelectItem>
    <SelectItem value="tx">Texas</SelectItem>
    <SelectItem value="ny">New York</SelectItem>
  </SelectContent>
</Select>
```

---

### Badge

```jsx
import { Badge } from '@/components/ui/badge';

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>

// Custom status badges
<Badge className="bg-green-100 text-green-800">Submitted</Badge>
<Badge className="bg-orange-100 text-orange-800">In Progress</Badge>
<Badge className="bg-gray-100 text-gray-600">Not Started</Badge>
<Badge className="bg-yellow-100 text-yellow-800">AANA Meeting</Badge>
```

---

### Checkbox

```jsx
import { Checkbox } from '@/components/ui/checkbox';

<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms</Label>
</div>
```

---

### Tabs

```jsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

<Tabs defaultValue="clinical">
  <TabsList>
    <TabsTrigger value="clinical">Clinical</TabsTrigger>
    <TabsTrigger value="eq">EQ Tracker</TabsTrigger>
    <TabsTrigger value="shadow">Shadow Days</TabsTrigger>
    <TabsTrigger value="events">Events</TabsTrigger>
  </TabsList>
  <TabsContent value="clinical">Clinical content...</TabsContent>
  <TabsContent value="eq">EQ content...</TabsContent>
  <TabsContent value="shadow">Shadow content...</TabsContent>
  <TabsContent value="events">Events content...</TabsContent>
</Tabs>
```

---

### Dialog (Modal)

```jsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Modal Title</DialogTitle>
      <DialogDescription>Modal description</DialogDescription>
    </DialogHeader>
    <div>Modal content...</div>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Tooltip

```jsx
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>
      <p>Tooltip content</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

### Progress

```jsx
import { Progress } from '@/components/ui/progress';

<Progress value={36} className="h-2" />
```

---

### Skeleton

```jsx
import { Skeleton } from '@/components/ui/skeleton';

// Loading card
<div className="space-y-3">
  <Skeleton className="h-40 w-full" />
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
</div>
```

---

## Custom Components

### TagSelect

Multi-select tag component used in trackers and filters:

```jsx
// src/components/ui/tag-select.jsx

export function TagSelect({ options, selected, onChange, allowCustom = false }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(toggleSelection(option.value))}
          className={cn(
            "px-3 py-1 rounded-full text-sm border transition-colors",
            selected.includes(option.value)
              ? "bg-yellow-100 border-yellow-400 text-yellow-800"
              : "border-gray-300 hover:bg-gray-50"
          )}
        >
          {option.label}
        </button>
      ))}
      {allowCustom && (
        <input
          type="text"
          placeholder="Add new..."
          className="px-3 py-1 text-sm border border-gray-300 rounded-full"
          onKeyDown={handleAddCustom}
        />
      )}
    </div>
  );
}
```

Usage:
```jsx
<TagSelect
  options={[
    { value: 'cardiac', label: 'Cardiac' },
    { value: 'neuro', label: 'Neuro' },
    { value: 'trauma', label: 'Trauma' },
  ]}
  selected={selectedPopulations}
  onChange={setSelectedPopulations}
  allowCustom
/>
```

---

### StatusBadge

Consistent status badges for program/task status:

```jsx
// src/components/ui/status-badge.jsx

const STATUS_STYLES = {
  submitted: 'bg-green-100 text-green-800',
  in_progress: 'bg-orange-100 text-orange-800',
  not_started: 'bg-gray-100 text-gray-600',
  completed: 'bg-green-100 text-green-800',
  accepted: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-800',
  waitlisted: 'bg-yellow-100 text-yellow-800',
};

export function StatusBadge({ status }) {
  const label = status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  return (
    <span className={cn("px-2 py-1 rounded text-xs font-medium", STATUS_STYLES[status])}>
      {label}
    </span>
  );
}
```

---

### EmptyState

Consistent empty state component:

```jsx
// src/components/ui/empty-state.jsx

export function EmptyState({ 
  icon: Icon,
  title, 
  description, 
  action 
}) {
  return (
    <div className="text-center py-12">
      {Icon && <Icon className="w-12 h-12 mx-auto text-gray-400 mb-4" />}
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="text-gray-500 mt-1 max-w-sm mx-auto">{description}</p>
      {action && (
        <Button className="mt-4" onClick={action.onClick} asChild={action.href}>
          {action.href ? <a href={action.href}>{action.label}</a> : action.label}
        </Button>
      )}
    </div>
  );
}
```

Usage:
```jsx
<EmptyState
  icon={BookOpen}
  title="No programs saved yet"
  description="Start by exploring the school database to find programs that match your goals."
  action={{ label: 'Browse Schools', href: '/schools' }}
/>
```

---

### HighlightHeading

The signature yellow marker highlight behind headings:

```jsx
// src/components/ui/highlight-heading.jsx

export function HighlightHeading({ children, as: Component = 'h2' }) {
  return (
    <Component className="inline font-bold text-2xl">
      <span className="bg-gradient-to-t from-yellow-300 to-transparent bg-[length:100%_50%] bg-no-repeat bg-bottom px-1">
        {children}
      </span>
    </Component>
  );
}
```

Usage:
```jsx
<HighlightHeading>MY PROGRAMS</HighlightHeading>
```

---

### StatCard

Display a single stat with label:

```jsx
// src/components/ui/stat-card.jsx

export function StatCard({ icon: Icon, label, value, sublabel }) {
  return (
    <div className="bg-white rounded-xl p-4 text-center">
      {Icon && <Icon className="w-6 h-6 mx-auto text-gray-400 mb-2" />}
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
      {sublabel && <div className="text-xs text-gray-400">{sublabel}</div>}
    </div>
  );
}
```

---

### ProgressRing

Circular progress indicator:

```jsx
// src/components/ui/progress-ring.jsx

export function ProgressRing({ percent, size = 80, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size}>
      <circle
        className="text-gray-200"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className="text-yellow-400"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        className="text-lg font-bold fill-current"
      >
        {percent}%
      </text>
    </svg>
  );
}
```

---

## Layout Components

### PageWrapper

Standard page container:

```jsx
// src/components/layout/page-wrapper.jsx

export function PageWrapper({ children, className }) {
  return (
    <div className={cn("p-4 md:p-6 max-w-7xl mx-auto", className)}>
      {children}
    </div>
  );
}
```

---

### PageHeader

Page title with optional actions:

```jsx
// src/components/layout/page-header.jsx

export function PageHeader({ title, subtitle, action, backLink }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        {backLink && (
          <a href={backLink} className="text-sm text-gray-500 hover:text-gray-700 mb-1 block">
            ← Back
          </a>
        )}
        <HighlightHeading>{title}</HighlightHeading>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
}
```

---

### Sidebar

Main navigation sidebar:

```jsx
// src/components/layout/sidebar.jsx

export function Sidebar() {
  const navItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Target, label: 'My Programs', href: '/my-programs' },
    { icon: Activity, label: 'My Trackers', href: '/trackers' },
    { icon: User, label: 'My Stats', href: '/my-stats' },
    // ... more items
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-16 md:w-64 bg-white border-r border-gray-200 z-40">
      {/* Logo */}
      <div className="p-4">
        <img src="/logo.svg" alt="The CRNA Club" className="h-8" />
      </div>
      
      {/* Navigation */}
      <nav className="mt-4">
        {navItems.map(item => (
          <NavLink 
            key={item.href}
            to={item.href}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </nav>
    </aside>
  );
}
```

---

### Header

Top header with search and user menu:

```jsx
// src/components/layout/header.jsx

export function Header() {
  return (
    <header className="fixed top-0 right-0 left-16 md:left-64 h-16 bg-white border-b border-gray-200 z-30">
      <div className="flex items-center justify-between h-full px-4">
        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search..."
            className="pl-10"
          />
        </div>
        
        {/* Right side */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MessageSquare className="w-5 h-5" />
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
```

---

## Component Checklist

When building a new component:

- [ ] Mobile-first responsive design
- [ ] Minimum 44px touch targets
- [ ] Loading state (if async)
- [ ] Empty state (if data-dependent)
- [ ] Error state (if can fail)
- [ ] Keyboard accessible
- [ ] Proper focus states
- [ ] Uses design system colors
- [ ] Has file-level comment
- [ ] Tested at 375px width
