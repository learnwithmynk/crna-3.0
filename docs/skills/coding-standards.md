# Coding Standards

Follow these conventions when building the CRNA Club React frontend.

---

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui base components (Button, Input, Card, etc.)
│   ├── layout/          # App-level layout (Sidebar, Header, PageWrapper)
│   └── features/        # Feature-specific components
│       ├── dashboard/   # DashboardTodoList, DashboardPrograms, etc.
│       ├── programs/    # ProgramCard, ProgramChecklist, etc.
│       ├── trackers/    # ClinicalEntry, ShadowDayForm, etc.
│       ├── schools/     # SchoolCard, SchoolFilters, etc.
│       └── community/   # ForumThread, GroupCard, etc.
├── pages/
│   ├── applicant/       # DashboardPage, MyProgramsPage, etc.
│   ├── srna/            # SrnaDashboardPage, ServicesPage, etc.
│   └── shared/          # LoginPage, SettingsPage, etc.
├── hooks/               # Custom hooks (usePrograms, useTrackers, etc.)
├── lib/                 # Utilities, API client, helpers
├── data/                # Mock data files
└── styles/              # Global styles, Tailwind extensions
```

---

## File Naming

| Type | Convention | Example |
|------|------------|---------|
| Pages | PascalCase + "Page" suffix | `DashboardPage.jsx` |
| Components | PascalCase | `ProgramCard.jsx` |
| Hooks | camelCase, "use" prefix | `usePrograms.js` |
| Utilities | camelCase | `formatDate.js` |
| Mock data | camelCase | `mockPrograms.js` |
| Styles | kebab-case | `global-styles.css` |

---

## Component Structure

### Standard Component Template

```jsx
// src/components/features/programs/ProgramCard.jsx

/**
 * ProgramCard - Displays a CRNA program summary card
 * Used in: MyProgramsPage, SchoolDatabasePage
 */

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar } from 'lucide-react';

export function ProgramCard({ program, onSave, onMakeTarget }) {
  const { name, location, deadline, imageUrl, type, isSaved, isTarget } = program;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-40 object-cover"
        />
      )}
      
      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-lg line-clamp-2">{name}</h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{location.city}, {location.state}</span>
        </div>
        
        {deadline && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Deadline: {formatDate(deadline)}</span>
          </div>
        )}
        
        <Badge variant={type === 'integrated' ? 'default' : 'secondary'}>
          {type}
        </Badge>
        
        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {!isTarget && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onMakeTarget(program.id)}
            >
              Make Target
            </Button>
          )}
          <Button
            size="sm"
            variant={isSaved ? 'secondary' : 'default'}
            onClick={() => onSave(program.id)}
          >
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

---

## Page Structure

### Standard Page Template

```jsx
// src/pages/applicant/MyProgramsPage.jsx

/**
 * MyProgramsPage - User's saved and target programs
 * Route: /my-programs
 */

import { useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProgramCard } from '@/components/features/programs/ProgramCard';
import { usePrograms } from '@/hooks/usePrograms';

export default function MyProgramsPage() {
  const [view, setView] = useState('target'); // 'target' | 'saved'
  const { targetPrograms, savedPrograms, isLoading } = usePrograms();

  const programs = view === 'target' ? targetPrograms : savedPrograms;

  return (
    <PageWrapper>
      <PageHeader 
        title="My Programs"
        action={
          <Button onClick={() => navigate('/schools')}>
            Search All Programs
          </Button>
        }
      />

      {/* View Toggle */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={view === 'target' ? 'default' : 'outline'}
          onClick={() => setView('target')}
        >
          Target Programs
        </Button>
        <Button
          variant={view === 'saved' ? 'default' : 'outline'}
          onClick={() => setView('saved')}
        >
          Saved Programs
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : programs.length === 0 ? (
        <EmptyState 
          title="No programs yet"
          description="Start by searching the school database"
          action={{ label: 'Browse Schools', href: '/schools' }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map(program => (
            <ProgramCard 
              key={program.id}
              program={program}
              onSave={handleSave}
              onMakeTarget={handleMakeTarget}
            />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
```

---

## Hooks

### Custom Hook Template

```jsx
// src/hooks/usePrograms.js

/**
 * usePrograms - Fetch and manage user's saved/target programs
 */

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

// TODO: Replace with real API calls
import { mockSavedPrograms, mockTargetPrograms } from '@/data/mockPrograms';

export function usePrograms() {
  const [savedPrograms, setSavedPrograms] = useState([]);
  const [targetPrograms, setTargetPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPrograms() {
      try {
        setIsLoading(true);
        // TODO: Replace with API call
        // const data = await api.get('/user/programs');
        setSavedPrograms(mockSavedPrograms);
        setTargetPrograms(mockTargetPrograms);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPrograms();
  }, []);

  const saveProgram = async (programId) => {
    // TODO: API call
    console.log('Save program:', programId);
  };

  const makeTarget = async (programId) => {
    // TODO: API call
    console.log('Make target:', programId);
  };

  return {
    savedPrograms,
    targetPrograms,
    isLoading,
    error,
    saveProgram,
    makeTarget,
  };
}
```

---

## Styling with Tailwind

### Mobile-First Approach

Always start with mobile styles, add larger breakpoints:

```jsx
// ✅ Good - mobile first
<div className="text-sm md:text-base lg:text-lg">

// ❌ Bad - desktop first
<div className="text-lg md:text-base sm:text-sm">
```

### Responsive Grid

```jsx
// Standard responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
```

### Touch Targets

Minimum 44px for tappable elements:

```jsx
// ✅ Good
<button className="p-3 min-h-[44px] min-w-[44px]">

// ❌ Bad - too small
<button className="p-1">
```

### Consistent Spacing

Use Tailwind's spacing scale consistently:
- Component padding: `p-4` or `p-6`
- Section gaps: `space-y-6`
- Grid gaps: `gap-4` or `gap-6`
- Page margins: `px-4 md:px-6`

---

## Comments

### Required Comments

```jsx
// Top of every file: brief description
/**
 * ComponentName - What it does
 * Used in: Where it's used
 */

// Mark mock data
// TODO: Replace with API call
const data = mockData;

// Explain non-obvious logic
// Using last 60 credits because some schools require this specifically
const last60Gpa = calculateLast60(courses);

// Note workarounds
// HACK: BuddyBoss API returns nested array, flattening here
const posts = response.data.flat();
```

### Avoid Obvious Comments

```jsx
// ❌ Bad - obvious
// Set loading to true
setLoading(true);

// ✅ Good - explains why
// Show skeleton while fetching to prevent layout shift
setLoading(true);
```

---

## State Management

### Local State
Use `useState` for component-specific state:

```jsx
const [isOpen, setIsOpen] = useState(false);
const [filters, setFilters] = useState({ state: '', gre: '' });
```

### Server State
Use custom hooks that wrap API calls:

```jsx
const { programs, isLoading, error } = usePrograms();
const { user, updateProfile } = useUser();
```

### Global State
For MVP, avoid complex state management. If needed, use React Context:

```jsx
// src/context/AuthContext.jsx
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // ...
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

## Error Handling

### API Errors

```jsx
try {
  const data = await api.get('/programs');
  setPrograms(data);
} catch (error) {
  if (error.status === 401) {
    // Redirect to login
    navigate('/login');
  } else if (error.status === 403) {
    // Show upgrade prompt
    setShowUpgrade(true);
  } else {
    // Generic error
    setError('Something went wrong. Please try again.');
  }
}
```

### Error Boundaries

Wrap pages in error boundaries to catch render errors:

```jsx
<ErrorBoundary fallback={<ErrorPage />}>
  <MyProgramsPage />
</ErrorBoundary>
```

---

## Forms

### Controlled Inputs

```jsx
const [formData, setFormData] = useState({
  title: '',
  date: '',
  notes: '',
});

const handleChange = (e) => {
  setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }));
};

<input
  name="title"
  value={formData.title}
  onChange={handleChange}
/>
```

### Form Validation

```jsx
const [errors, setErrors] = useState({});

const validate = () => {
  const newErrors = {};
  if (!formData.title) newErrors.title = 'Title is required';
  if (!formData.date) newErrors.date = 'Date is required';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (validate()) {
    // Submit
  }
};
```

---

## Testing at 375px

Before considering any component done:

1. Open browser dev tools
2. Set viewport to 375px width (iPhone SE)
3. Verify:
   - No horizontal scroll
   - Text is readable
   - Buttons are tappable (44px min)
   - Forms are usable
   - Navigation works

---

## Import Aliases

Use `@/` alias for clean imports:

```jsx
// ✅ Good
import { Button } from '@/components/ui/button';
import { usePrograms } from '@/hooks/usePrograms';

// ❌ Bad
import { Button } from '../../../components/ui/button';
```

Configure in `vite.config.js`:

```js
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
},
```

---

## Git Commits

### Commit Message Format

```
type(scope): brief description

- Detail 1
- Detail 2
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `style`: Styling changes
- `refactor`: Code refactor
- `docs`: Documentation
- `chore`: Build/config changes

Examples:
```
feat(dashboard): add to-do list component
fix(programs): correct date formatting on cards
style(trackers): adjust mobile spacing
```

### Commit Frequency
- Commit after each meaningful unit of work
- Don't commit broken code
- Write clear commit messages
