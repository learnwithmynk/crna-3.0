# Mobile Considerations

Mobile-first design approach for The CRNA Club.

---

## Design Philosophy

**Mobile-first means:**
1. Design for 375px viewport first
2. Add complexity for larger screens
3. Touch-friendly interactions
4. Performance-conscious loading

**Why mobile-first for this app:**
- ICU nurses often use phones during downtime
- Quick logging of clinical entries
- Checking deadlines on the go
- Community browsing between shifts

---

## Breakpoints

```javascript
// Tailwind breakpoints
// Mobile: < 768px (default)
// Tablet: 768px+ (md:)
// Desktop: 1024px+ (lg:)
// Large Desktop: 1280px+ (xl:)

// Usage pattern:
// Always start with mobile styles, then add larger screen overrides
className="
  p-4              // Mobile padding
  md:p-6           // Tablet padding
  lg:p-8           // Desktop padding
"
```

---

## Touch Targets

**Minimum touch target: 44x44px**

```jsx
// ❌ Bad - too small
<button className="p-2 text-sm">Submit</button>

// ✅ Good - meets minimum
<button className="min-h-[44px] min-w-[44px] p-3">Submit</button>

// ✅ Also good - Button component handles it
<Button size="default">Submit</Button>
```

### Critical Touch Areas
- Navigation items
- Form inputs
- Checkboxes and radio buttons
- Tag selection chips
- Card click areas
- Modal close buttons
- Dropdown options

---

## Layout Patterns

### Single Column on Mobile

```jsx
// Mobile: single column
// Desktop: sidebar layout

function PageLayout({ sidebar, content }) {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar - below content on mobile, side on desktop */}
      <div className="order-2 lg:order-1 lg:w-64 lg:flex-shrink-0">
        {sidebar}
      </div>
      
      {/* Main content */}
      <div className="order-1 lg:order-2 flex-1">
        {content}
      </div>
    </div>
  );
}
```

### Card Grids

```jsx
// Mobile: 1 column
// Tablet: 2 columns
// Desktop: 3 columns

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

### Navigation

```jsx
// Mobile: Bottom nav or hamburger menu
// Desktop: Sidebar

function AppLayout() {
  return (
    <div>
      {/* Desktop sidebar - hidden on mobile */}
      <aside className="hidden lg:block fixed left-0 top-0 w-64 h-screen">
        <Sidebar />
      </aside>
      
      {/* Main content */}
      <main className="lg:ml-64">
        <Outlet />
      </main>
      
      {/* Mobile bottom nav - hidden on desktop */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
        <MobileNav />
      </nav>
    </div>
  );
}
```

---

## Mobile Navigation

### Bottom Navigation (Recommended)

```jsx
// src/components/layout/mobile-nav.jsx

import { Home, Target, BookOpen, Users, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/my-programs', icon: Target, label: 'Programs' },
  { to: '/learning', icon: BookOpen, label: 'Learn' },
  { to: '/community/forums', icon: Users, label: 'Community' },
  { to: '/my-stats', icon: User, label: 'Profile' },
];

export function MobileNav() {
  return (
    <nav className="flex justify-around items-center h-16 bg-white border-t safe-area-bottom">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `
            flex flex-col items-center justify-center
            min-w-[64px] min-h-[44px] p-2
            ${isActive ? 'text-yellow-600' : 'text-gray-500'}
          `}
        >
          <Icon className="w-5 h-5" />
          <span className="text-xs mt-1">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
```

### Safe Area Insets

For devices with notches or home indicators:

```css
/* globals.css */
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-area-top {
  padding-top: env(safe-area-inset-top);
}
```

---

## Forms on Mobile

### Stacked Labels

```jsx
// Mobile-friendly form layout
function FormField({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

// Full-width inputs
<Input className="w-full" />
```

### Input Types

Use appropriate input types for mobile keyboards:

```jsx
// Email keyboard
<Input type="email" inputMode="email" />

// Numeric keyboard
<Input type="number" inputMode="numeric" />

// Phone keyboard
<Input type="tel" inputMode="tel" />

// URL keyboard
<Input type="url" inputMode="url" />
```

### Avoid Horizontal Scrolling in Forms

```jsx
// ❌ Bad - side by side on mobile
<div className="flex gap-4">
  <Input placeholder="First" />
  <Input placeholder="Last" />
</div>

// ✅ Good - stack on mobile, side by side on desktop
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <Input placeholder="First Name" />
  <Input placeholder="Last Name" />
</div>
```

---

## Tag Selection (Clinical Tracker)

The tag selection UI is critical for mobile:

```jsx
// src/components/ui/tag-select.jsx

export function TagSelect({ options, selected, onChange, label }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              if (selected.includes(option.value)) {
                onChange(selected.filter(v => v !== option.value));
              } else {
                onChange([...selected, option.value]);
              }
            }}
            className={`
              px-3 py-2 rounded-full text-sm
              min-h-[44px] // Touch target
              transition-colors
              ${selected.includes(option.value)
                ? 'bg-yellow-400 text-black'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## Modals on Mobile

Full-screen modals on mobile:

```jsx
// src/components/ui/responsive-modal.jsx

import { Dialog } from '@/components/ui/dialog';

export function ResponsiveModal({ children, title, onClose }) {
  return (
    <Dialog open onOpenChange={onClose}>
      <div className="
        fixed inset-0 bg-white
        md:relative md:inset-auto md:max-w-lg md:rounded-lg md:shadow-lg
      ">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">{title}</h2>
          <button 
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content - scrollable */}
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-120px)] md:max-h-[60vh]">
          {children}
        </div>
      </div>
    </Dialog>
  );
}
```

---

## Tables on Mobile

Tables don't work well on mobile. Use card layout instead:

```jsx
// Desktop: table layout
// Mobile: card layout

function ProgramList({ programs }) {
  return (
    <>
      {/* Desktop table - hidden on mobile */}
      <table className="hidden md:table w-full">
        <thead>
          <tr>
            <th>Program</th>
            <th>Deadline</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {programs.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.deadline}</td>
              <td><StatusBadge status={p.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Mobile cards - hidden on desktop */}
      <div className="md:hidden space-y-4">
        {programs.map(p => (
          <Card key={p.id} className="p-4">
            <h3 className="font-medium">{p.name}</h3>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-500">Deadline: {p.deadline}</span>
              <StatusBadge status={p.status} />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
```

---

## Performance

### Lazy Loading

```jsx
import { lazy, Suspense } from 'react';

// Lazy load heavy pages
const SchoolDatabasePage = lazy(() => import('@/pages/applicant/SchoolDatabasePage'));

// Use with Suspense
<Suspense fallback={<PageSkeleton />}>
  <SchoolDatabasePage />
</Suspense>
```

### Image Optimization

```jsx
// Use appropriate image sizes
<img
  src={school.image}
  srcSet={`
    ${school.imageSmall} 400w,
    ${school.imageMedium} 800w,
    ${school.imageLarge} 1200w
  `}
  sizes="(max-width: 768px) 100vw, 33vw"
  loading="lazy"
  alt={school.name}
/>
```

### Skeleton Loading

```jsx
// Show skeleton while loading
function ProgramCardSkeleton() {
  return (
    <Card className="p-4">
      <Skeleton className="h-32 w-full mb-4" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </Card>
  );
}
```

---

## Testing Checklist

Before each feature is complete, test on:

1. **Mobile viewport (375px)**
   - All content visible without horizontal scroll
   - Touch targets are 44px minimum
   - Forms are usable
   - Navigation works

2. **Tablet viewport (768px)**
   - Layout adjusts appropriately
   - Sidebar behavior correct

3. **Desktop viewport (1024px+)**
   - Full layout displayed
   - No wasted space

4. **Physical device** (when possible)
   - Touch interactions feel natural
   - Scrolling is smooth
   - Keyboard doesn't cover inputs
