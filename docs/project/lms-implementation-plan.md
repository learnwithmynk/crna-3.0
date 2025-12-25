# Custom LMS Implementation Plan

> **Status:** ~90% Complete - Content Migration Remaining
> **Estimated Time:** 8-10 weeks (original estimate)
> **Created:** December 9, 2024
> **Last Updated:** December 13, 2024

---

## Overview

Building a custom Learning Management System (LMS) to replace LearnDash. Uses Editor.js for block-based content editing (Notion-like experience) with all data stored in Supabase.

### Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Content Editor | Editor.js (not TipTap) | Block-based, custom blocks, reusable for "My Docs" |
| Data Storage | Supabase only | No external CMS, no recurring costs |
| Search | Full platform search | ⌘+K modal across lessons, schools, BuddyBoss |
| Autosave | 30s interval + 2s debounce | Simple, reliable |
| Undo/Redo | 5 levels in memory | Not full revision history |
| Image Upload | Supabase Storage | Bucket: `lesson-images` |
| Gamification | 3 points per lesson | Calls existing WordPress endpoint |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         SUPABASE                                │
├─────────────────────────────────────────────────────────────────┤
│  modules          │  sections         │  lessons                │
│  - id             │  - id             │  - id                   │
│  - slug           │  - module_id      │  - module_id            │
│  - title          │  - title          │  - section_id           │
│  - description    │  - order_index    │  - slug, title          │
│  - thumbnail_url  │                   │  - vimeo_video_id       │
│  - accessible_via │                   │  - content (JSONB)      │
│  - category_slugs │                   │  - resource_category    │
│  - status         │                   │  - accessible_via       │
│  - order_index    │                   │  - status, order_index  │
├─────────────────────────────────────────────────────────────────┤
│  downloads                    │  user_lesson_progress           │
│  - id, slug, title            │  - user_id                      │
│  - file_url, file_type        │  - lesson_id                    │
│  - category_slugs             │  - completed                    │
│  - is_free                    │  - completed_at                 │
│  - accessible_via             │  - last_accessed_at             │
│  - purchase_product_url       │                                 │
├─────────────────────────────────────────────────────────────────┤
│  categories                   │  entitlements                   │
│  - id, slug, display_name     │  - id, slug, display_name       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Categories Table
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Entitlements Table
```sql
CREATE TABLE entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed entitlements
INSERT INTO entitlements (slug, display_name) VALUES
  ('active_membership', 'Active Members'),
  ('plan_apply_toolkit', 'Plan+Apply Toolkit'),
  ('interviewing_toolkit', 'Interviewing Toolkit');
```

### Modules Table
```sql
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  order_index INTEGER DEFAULT 0,
  accessible_via TEXT[] DEFAULT '{}',
  category_slugs TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Sections Table
```sql
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Lessons Table
```sql
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  section_id UUID REFERENCES sections(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  vimeo_video_id TEXT,
  video_thumbnail_url TEXT,
  video_description TEXT,
  content JSONB,
  resource_category_slug TEXT,
  manual_download_ids UUID[],
  excluded_download_ids UUID[],
  accessible_via TEXT[] DEFAULT '{}',
  category_slugs TEXT[] DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Downloads Table
```sql
CREATE TABLE downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT,
  category_slugs TEXT[] DEFAULT '{}',
  is_free BOOLEAN DEFAULT FALSE,
  accessible_via TEXT[] DEFAULT '{}',
  purchase_product_url TEXT,
  groundhogg_tag TEXT,
  download_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### User Progress Table
```sql
CREATE TABLE user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);
```

### Indexes
```sql
CREATE INDEX idx_lessons_module ON lessons(module_id);
CREATE INDEX idx_lessons_section ON lessons(section_id);
CREATE INDEX idx_sections_module ON sections(module_id);
CREATE INDEX idx_progress_user ON user_lesson_progress(user_id);
CREATE INDEX idx_downloads_categories ON downloads USING GIN(category_slugs);
CREATE INDEX idx_lessons_categories ON lessons USING GIN(category_slugs);
CREATE INDEX idx_modules_categories ON modules USING GIN(category_slugs);

-- Full-text search indexes
CREATE INDEX idx_modules_search ON modules USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX idx_lessons_search ON lessons USING GIN(to_tsvector('english', title || ' ' || COALESCE(video_description, '')));
CREATE INDEX idx_downloads_search ON downloads USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));
```

---

## File Structure

```
src/
├── components/
│   ├── features/
│   │   ├── editor/
│   │   │   ├── BlockEditor.jsx          # Editor.js wrapper with autosave
│   │   │   ├── EditorRenderer.jsx       # Read-only JSON renderer
│   │   │   ├── ImageUploader.jsx        # Drag & drop to Supabase
│   │   │   └── tools/
│   │   │       ├── CalloutTool.js       # Tip/warning/note blocks
│   │   │       ├── LinkCardTool.js      # Internal navigation cards
│   │   │       └── DownloadTool.js      # Inline download buttons
│   │   ├── learning/
│   │   │   ├── ModuleCard.jsx           # Grid card for modules
│   │   │   ├── ModuleGrid.jsx           # Responsive grid layout
│   │   │   ├── LessonList.jsx           # Lessons grouped by section
│   │   │   ├── LessonContent.jsx        # Rendered lesson content
│   │   │   ├── LessonResources.jsx      # Downloads section
│   │   │   ├── LessonNavigation.jsx     # Prev/Next buttons
│   │   │   ├── LessonPaywall.jsx        # Access denied state
│   │   │   ├── VimeoPlayer.jsx          # Responsive video embed
│   │   │   ├── DownloadCard.jsx         # Resource card
│   │   │   ├── DownloadButton.jsx       # Download vs Get Now
│   │   │   ├── MarkCompleteButton.jsx   # Completion + gamification
│   │   │   └── ProgressBar.jsx          # Module progress
│   │   ├── search/
│   │   │   ├── GlobalSearch.jsx         # ⌘+K modal
│   │   │   ├── InlineSearch.jsx         # Page-level search
│   │   │   └── SearchResult.jsx         # Result item
│   │   └── admin/
│   │       ├── ModuleForm.jsx
│   │       ├── LessonForm.jsx
│   │       ├── DownloadForm.jsx
│   │       ├── SortableModuleList.jsx
│   │       ├── SortableLessonList.jsx
│   │       ├── SectionManager.jsx
│   │       ├── DownloadSelector.jsx
│   │       ├── EntitlementCheckboxes.jsx
│   │       ├── CategoryForm.jsx
│   │       ├── EntitlementForm.jsx
│   │       └── DeleteConfirmModal.jsx
├── hooks/
│   ├── useModules.js
│   ├── useLessons.js
│   ├── useDownloads.js
│   ├── useCategories.js
│   ├── useEntitlements.js
│   ├── useLessonAccess.js
│   ├── useDownloadAccess.js
│   ├── useLessonProgress.js
│   ├── useGlobalSearch.js
│   └── useImageUpload.js
├── lib/
│   ├── editorjs-config.js
│   ├── lesson-resources.js
│   └── gamification.js
└── pages/
    ├── applicant/
    │   ├── LearningLibraryPage.jsx      # /learn
    │   ├── ModuleDetailPage.jsx         # /learn/:moduleSlug
    │   └── LessonPage.jsx               # /learn/:moduleSlug/:lessonSlug
    └── admin/
        ├── ModulesListPage.jsx          # /admin/modules
        ├── ModuleDetailPage.jsx         # /admin/modules/:id
        ├── LessonEditPage.jsx           # /admin/lessons/:id
        ├── DownloadsListPage.jsx        # /admin/downloads
        ├── DownloadEditPage.jsx         # /admin/downloads/:id
        ├── CategoriesPage.jsx           # /admin/categories
        └── EntitlementsPage.jsx         # /admin/entitlements
```

---

## Editor.js Configuration

### Dependencies
```bash
npm install @editorjs/editorjs @editorjs/header @editorjs/list @editorjs/checklist @editorjs/table @editorjs/image @editorjs/quote @editorjs/delimiter @editorjs/embed @editorjs/inline-code @editorjs/marker
```

### Configuration (`/src/lib/editorjs-config.js`)
```javascript
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Checklist from '@editorjs/checklist';
import Table from '@editorjs/table';
import Image from '@editorjs/image';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';
import Embed from '@editorjs/embed';
import InlineCode from '@editorjs/inline-code';
import Marker from '@editorjs/marker';

export const EDITOR_TOOLS = {
  header: {
    class: Header,
    config: { levels: [1, 2, 3], defaultLevel: 2 }
  },
  list: { class: List, inlineToolbar: true },
  checklist: Checklist,
  table: Table,
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByFile: async (file) => {
          // Upload to Supabase Storage
          const { data, error } = await supabase.storage
            .from('lesson-images')
            .upload(`${Date.now()}-${file.name}`, file);

          if (error) throw error;

          const { data: { publicUrl } } = supabase.storage
            .from('lesson-images')
            .getPublicUrl(data.path);

          return { success: 1, file: { url: publicUrl } };
        }
      }
    }
  },
  quote: Quote,
  delimiter: Delimiter,
  embed: {
    class: Embed,
    config: { services: { vimeo: true, youtube: true } }
  },
  inlineCode: InlineCode,
  marker: Marker,
};
```

---

## Autosave & Undo/Redo

### BlockEditor Component Features

```javascript
// Autosave: 30 second interval + 2 second debounce
const AUTOSAVE_INTERVAL = 30000;
const DEBOUNCE_DELAY = 2000;

// Undo/Redo: 5 levels in memory
const MAX_HISTORY = 5;
const [history, setHistory] = useState([]);
const [historyIndex, setHistoryIndex] = useState(-1);

// Keyboard shortcuts
useEffect(() => {
  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
      if (e.shiftKey) {
        redo();
      } else {
        undo();
      }
      e.preventDefault();
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

### Save Status Indicator
- "Saving..." → "Saved" → "Last saved: X min ago"

---

## Download Resource Aggregation

### Three-Layer System

```javascript
// /src/lib/lesson-resources.js
export function getLessonResources(lesson, allDownloads) {
  let resources = [];

  // 1. Auto-populate from category
  if (lesson.resource_category_slug) {
    resources.push(...allDownloads.filter(
      d => d.category_slugs.includes(lesson.resource_category_slug)
    ));
  }

  // 2. Add manual downloads
  if (lesson.manual_download_ids?.length) {
    resources.push(...allDownloads.filter(
      d => lesson.manual_download_ids.includes(d.id)
    ));
  }

  // 3. Remove exclusions
  if (lesson.excluded_download_ids?.length) {
    resources = resources.filter(
      r => !lesson.excluded_download_ids.includes(r.id)
    );
  }

  // 4. Deduplicate
  return [...new Map(resources.map(r => [r.id, r])).values()];
}
```

### Download Button Logic

```javascript
// /src/components/features/learning/DownloadButton.jsx
function DownloadButton({ download, userEntitlements }) {
  const hasAccess = download.is_free ||
    download.accessible_via.some(e => userEntitlements.includes(e));

  if (hasAccess) {
    return (
      <a href={download.file_url} download className="btn-primary">
        Download
      </a>
    );
  }

  return (
    <a href={download.purchase_product_url} className="btn-secondary">
      Get Now
    </a>
  );
}
```

---

## Global Search System

### Search Hook

```javascript
// /src/hooks/useGlobalSearch.js
export function useGlobalSearch(query) {
  const [results, setResults] = useState({
    modules: [], lessons: [], downloads: [], schools: [], posts: []
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults({ modules: [], lessons: [], downloads: [], schools: [], posts: [] });
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);

      const [modules, lessons, downloads, schools, posts] = await Promise.all([
        searchSupabase('modules', query),
        searchSupabase('lessons', query),
        searchSupabase('downloads', query),
        searchSupabase('schools', query),
        searchBuddyBoss(query),
      ]);

      setResults({ modules, lessons, downloads, schools, posts });
      setIsLoading(false);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  return { results, isLoading };
}

async function searchSupabase(table, query) {
  const { data } = await supabase
    .from(table)
    .select('id, slug, title')
    .textSearch('title', query)
    .limit(5);
  return data || [];
}

async function searchBuddyBoss(query) {
  const response = await fetch(
    `${WP_URL}/wp-json/buddyboss/v1/activity?search=${encodeURIComponent(query)}&per_page=5`
  );
  return response.json();
}
```

### Global Search Modal

- Opens with ⌘+K / Ctrl+K
- Uses shadcn Command component
- Results grouped by type with icons:
  - 📚 Modules
  - 📖 Lessons
  - 📥 Downloads
  - 🏫 Schools
  - 💬 Community

---

## Gamification Integration

```javascript
// /src/lib/gamification.js
export async function awardLessonCompletionPoints(userId) {
  try {
    await fetch('/wp-json/gamplify/v1/award-points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        points: 3,
        action: 'lesson_complete'
      })
    });
  } catch (error) {
    console.error('Failed to award points:', error);
  }
}
```

---

## User-Facing Lesson Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ LESSON 8 OF 23                              [In Progress] [< >] │
├─────────────────────────────────────────────────────────────────┤
│                      LESSON TITLE                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    VIMEO VIDEO                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│  Video description text here...                                 │
│  ─────────────────────────────────────────────────────────────  │
│                    WHAT YOU NEED TO KNOW                        │
│  [Editor.js rendered content]                                   │
│  ─────────────────────────────────────────────────────────────  │
│                    MORE RESOURCES FOR YOU                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │ [Download] │  │ [Get Now]  │  │ [Download] │                │
│  └────────────┘  └────────────┘  └────────────┘                │
│                      [Mark Complete]                            │
│  ─────────────────────────────────────────────────────────────  │
│                    LET'S KEEP WATCHING...                       │
│  [Next lessons in module]                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Routes

### User-Facing Routes
| Route | Page | Description |
|-------|------|-------------|
| `/learn` | LearningLibraryPage | Module grid with search/filter |
| `/learn/:moduleSlug` | ModuleDetailPage | Lesson list with progress |
| `/learn/:moduleSlug/:lessonSlug` | LessonPage | Video + content + downloads |

### Admin Routes
| Route | Page | Description |
|-------|------|-------------|
| `/admin/modules` | ModulesListPage | List with drag & drop reorder |
| `/admin/modules/:id` | ModuleDetailPage | Edit module + manage lessons |
| `/admin/lessons/:id` | LessonEditPage | Editor.js content editor |
| `/admin/downloads` | DownloadsListPage | List all downloads |
| `/admin/downloads/:id` | DownloadEditPage | Edit download details |
| `/admin/categories` | CategoriesPage | Manage categories |
| `/admin/entitlements` | EntitlementsPage | Manage access levels |

---

## Implementation Phases

### Phase 1: Database Setup (3-4 days) ✅ COMPLETE
- [x] Create all Supabase tables (`20251210060000_lms_schema.sql`)
- [x] Add indexes including full-text search
- [x] Set up RLS policies
- [x] Create `lesson-images` storage bucket

### Phase 2: Core Hooks (2-3 days) ✅ COMPLETE
- [x] useModules, useLessons, useDownloads
- [x] useCategories, useEntitlements
- [x] useLessonAccess, useDownloadAccess
- [x] useLessonProgress
- [x] useImageUpload

### Phase 3: Editor.js Setup (4-5 days) ✅ COMPLETE
- [x] Install dependencies
- [x] Create configuration
- [x] Build BlockEditor with autosave + undo/redo
- [x] Build EditorRenderer
- [x] Integrate image upload
- [x] Create custom block tools (Callout, LinkCard, Download)

### Phase 4: Admin - Modules & Lessons (5-7 days) ✅ COMPLETE
- [x] Modules list page with drag & drop (`ModulesListPage.jsx`)
- [x] Module detail page with section management (`ModuleDetailPage.jsx`)
- [x] Lesson edit page with Editor.js (`LessonEditPage.jsx`)

### Phase 5: Admin - Downloads (3-4 days) ✅ COMPLETE
- [x] Downloads list page (`DownloadsListPage.jsx`)
- [x] Download edit page (`DownloadEditPage.jsx`)

### Phase 6: Admin - Categories & Entitlements (2-3 days) ✅ COMPLETE
- [x] Categories management page (`CategoriesPage.jsx`)
- [x] Entitlements management page

### Phase 7: User-Facing Module Grid (2-3 days) ✅ COMPLETE
- [x] Learning Library page (`LearningLibraryPage.jsx`)
- [x] Module cards with progress

### Phase 8: User-Facing Module Detail (2-3 days) ✅ COMPLETE
- [x] Module detail page
- [x] Lesson list with sections
- [x] Paywall component

### Phase 9: User-Facing Lesson Page (4-5 days) ✅ COMPLETE
- [x] Vimeo player (`VimeoPlayer.jsx`)
- [x] Content renderer
- [x] Download resources section
- [x] Mark complete with gamification
- [x] Navigation (prev/next)

### Phase 10: Global Search (3-4 days) 🟡 PARTIAL
- [ ] useGlobalSearch hook
- [ ] GlobalSearch modal (⌘+K)
- [ ] InlineSearch for pages

### Phase 11: Content Migration (3-5 days) ⬜ NOT STARTED
- [ ] Export from LearnDash
- [ ] Convert to Editor.js JSON
- [ ] Import modules, lessons, downloads

### Phase 12: Testing & Polish (3-4 days) 🟡 IN PROGRESS
- [x] Admin QA (Playwright tests exist)
- [ ] User-facing QA
- [ ] Mobile responsive testing

---

## Summary

| Category | Count |
|----------|-------|
| Supabase Tables | 7 |
| Hooks | 10 |
| Admin Pages | 7 |
| User Pages | 3 |
| Components | 30+ |
| **Estimated Time** | **8-10 weeks** |

---

## Related Documentation

- Step-by-step implementation: `/docs/project/step-by-step-guide.md` (Phase 5.5)
- Decisions: `/docs/project/decision-log.md` (Dec 9, 2024 entries)
- Handoff details: `/docs/project/handoff.md` (Custom LMS section)
