# CLAUDE.md - The CRNA Club React Rebuild

> **Read this file first in every session.**
> After reading, check `/docs/project/status.md` for current progress.

---

## 🎯 What Is This Project?

Building a custom all-in-one React application for ICU nurses applying to CRNA (Certified Registered Nurse Anesthetist) school. This is a comprehensive companion app with tracking, mentorship marketplace, and smart guidance.

**Target Handoff:** December 15, 2024
**What we're building:** Custom React application with Supabase backend
**WordPress retained for:** Email (Groundhogg), products (WooCommerce), blog
**What dev team does after:** Complete API integration, launch marketplace, finalize migrations

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite 7 |
| Styling | Tailwind CSS 4 |
| Components | shadcn/ui (Radix primitives) |
| Icons | Lucide React |
| Drag & Drop | @dnd-kit |
| Deployment | Vercel |
| Version Control | GitHub |

**Backend (Supabase Primary):**
- Supabase (user data, trackers, marketplace, schools, entitlements)
- Stripe (subscriptions - migrating from WooCommerce)
- Stripe Connect (marketplace payouts)

**WordPress Components (Retained):**
- Groundhogg (email/CRM)
- WooCommerce (digital/physical products, cart)
- Blog content

**Community Architecture (Custom Supabase - NOT BuddyBoss):**
- Forums only (no Groups feature for MVP)
- Custom Supabase tables: forums, topics, replies, reactions, reports
- Admin moderation: reports queue, user suspensions
- Spam prevention: honeypot, profanity filter, rate limiting, StopForumSpam
- In-app notifications via Supabase Realtime
- Email notifications deferred (add via Groundhogg later)
- See `/docs/project/step-by-step-guide.md` Phase 6 for full implementation plan

**Planned Migrations:**
- WooCommerce Subscriptions → Stripe Subscriptions
- LearnDash → Custom replacement (under consideration)

---

## 🚀 Key Differentiators

1. **Custom All-in-One Companion App** - Purpose-built React application for CRNA applicants (not a WordPress theme)

2. **Mentor Marketplace** - SRNAs offer coaching to applicants at 20% commission (vs competitors' 35%). See `/docs/project/marketplace/`

3. **Rich Applicant Data Collection** - Comprehensive MyStats profiles powering smart features. See `/docs/skills/canonical-user-model.md`

4. **Smart Nudging System** - 7 prompt engines with 39 personalized nudges based on user stage and data. See `/docs/skills/smart-prompts-system.md`

5. **CRNA-Specific Focus** - Deeply vertical for nurse anesthetist applicants, not generic nursing

---

## 👥 User Types

### Applicants (Primary Users)
ICU nurses planning to apply or actively applying to CRNA school.
- Search/compare ~140 CRNA programs
- Track GPA, prereqs, certifications, shadowing, clinical experience
- Build target program list with checklists
- Use micro-apps (Transcript Analyzer, Timeline Generator, Mock Interview)
- Engage in community forums/groups
- Access learning modules and digital downloads

### SRNAs (Student Registered Nurse Anesthetists)
Already accepted into CRNA programs. Serve as mentors/providers.
- Offer services in marketplace (mock interviews, essay review, coaching)
- Claim internal tasks (blog posts, live calls) for cash/points
- Must apply and be approved to become provider

### Admins
- Manage users, content, marketplace approvals
- Moderate community
- Configure automations and billing

---

## 💰 Subscription Tiers

| Tier | Price | Status |
|------|-------|--------|
| Founding Member | $12-19/mo | Closed (legacy, lifetime access) |
| CRNA Club Membership | ~$27/mo | Active (main plan) |
| 7-Day Free Trial | $0 | Full access, auto-converts |
| Free/Lead | $0 | Paywalled/blurred preview |
| Toolkit-Only | One-time | Plan+Apply or Interviewing bundle |

All paying members get full access (currently all-or-nothing via tags).

---

## 📁 Project Structure

```
/crna-club-rebuild
├── CLAUDE.md                 # This file - read first
├── src/
│   ├── components/
│   │   ├── ui/               # shadcn/ui base components
│   │   ├── layout/           # Sidebar, Header, PageWrapper
│   │   └── features/         # Feature-specific components
│   ├── pages/
│   │   ├── applicant/        # Applicant-facing pages
│   │   ├── srna/             # SRNA/provider pages
│   │   └── shared/           # Auth, settings, etc.
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities, helpers
│   ├── data/                 # Mock data files
│   └── styles/               # Global styles, Tailwind config
├── docs/
│   ├── skills/               # 27 skill files (how to build things)
│   ├── project/              # Status, handoff, issues, decisions
│   │   └── marketplace/      # 14 marketplace planning docs
│   └── reference/            # Marketplace & Stripe docs
└── public/                   # Static assets
```

---

## 📋 Project Documentation (Keep Updated)

These docs in `/docs/project/` must be maintained throughout development:

| Doc | Purpose | When to Update |
|-----|---------|----------------|
| `data-integration-risks.md` | Schema conflicts & API issues | When fixing issues or finding new ones |
| `schema-decisions.md` | Field naming conventions | When adding new fields or making naming decisions |
| `issues.md` | Runtime bugs found in testing | When bugs are found or fixed |
| `status.md` | Current phase and progress | After completing tasks |
| `decision-log.md` | Architecture decisions | When making significant choices |

**Before API integration:** Review all Critical items in `data-integration-risks.md`
**Before adding new data fields:** Check `schema-decisions.md` for naming conventions

---

## 📋 Key Skill Files

Before building anything, read the relevant skill file:

| Building... | Read this skill |
|-------------|-----------------|
| Any component | `/docs/skills/component-library.md` |
| Page layout | `/docs/skills/design-system.md` |
| Forms/data entry | `/docs/skills/data-shapes.md` |
| Empty states | `/docs/skills/empty-states.md` |
| API contracts | `/docs/skills/api-contracts.md` |
| WordPress data | `/docs/skills/wordpress-integration.md` |
| Gamification | `/docs/skills/gamification-system.md` |
| Access control | `/docs/skills/access-control.md` |
| ReadyScore | `/docs/skills/readyscore-system.md` |
| Data collection strategy | `/docs/skills/canonical-user-model.md` |
| Dynamic checklists | `/docs/skills/dynamic-checklist-system.md` |
| Smart prompts & nudges | `/docs/skills/smart-prompts-system.md` |
| B2B school analytics | `/docs/skills/b2b-school-analytics.md` |
| Marketplace payments | `/docs/skills/stripe-connect-integration.md` |
| **Marketplace** | `/docs/project/marketplace/README.md` |
| **Community Forums** | `/docs/project/step-by-step-guide.md` (Phase 6) |
| **Profanity Filter** | `/docs/profanity-filter-system.md` |
| **StopForumSpam** | `/docs/skills/stopforumspam-integration.md` |
| **Data integration risks** | `/docs/project/data-integration-risks.md` |
| Welcome Video | `/src/components/features/provider/WelcomeVideoUpload.jsx` |
| Admin Messaging | `/src/data/marketplace/mockAdminMessages.js` |

---

## 🗄️ Database Migrations

Supabase migrations in `/supabase/migrations/`:

| Migration | Purpose |
|-----------|---------|
| `20251209...` | Core marketplace schema (providers, services, bookings) |
| `20251210050000` | LMS schema (modules, lessons, downloads) |
| `20251210090000` | Gamification points system |
| `20251212000000` | Guidance events telemetry |
| `20251213100000` | Marketplace point actions |
| `20251213300000` | Admin↔Provider messaging |
| `20251213400000` | Booking enhancements |
| `20251213500000` | Provider welcome video |
| `20251213600000` | Schools schema (schools, events, saved_schools) |
| `20251213700000` | User profiles (academic, clinical, guidance state) |
| `20251213800000` | User trackers (clinical, shadow, EQ, events) |
| `20251213900000` | WordPress user mapping + analytics |
| `20251214000000` | Community forums (forums, topics, replies, reactions, reports) |
| `20251214100000` | Profanity words RLS + Spam check cache |
| `20251214200000` | Community notification triggers |

### ✅ Supabase-Connected Hooks

These hooks have full Supabase integration with mock fallback for development:

| Category | Hooks | Status |
|----------|-------|--------|
| **Gamification** | usePoints, useBadges, usePointsConfig | ✅ Supabase-connected |
| **LMS Admin** | useModules, useLessons, useDownloads | ✅ Supabase-connected |
| **Schools** | useSchools | ✅ Supabase-connected |
| **Community Admin** | useAdminForums, useAdminTopics, useAdminReports, useAdminSuspensions | ✅ Supabase-connected |
| **Content Moderation** | useProfanityWords, useAdminCourseSubmissions | ✅ Supabase-connected |

For detailed hook integration status, see `/docs/project/handoff.md` Section 15.5.

---

## 🚀 Quick Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run integration tests (~2 min, 146 tests)
npx playwright test tests/hooks/ --reporter=list

# Quick smoke test (dots output)
npx playwright test tests/hooks/ --reporter=dot

# Debug tests with visible browser
npx playwright test tests/hooks/ --headed
```

### Integration Tests

**Location:** `tests/hooks/` (see [README](tests/hooks/README.md) for details)

**Run after UI changes** to catch regressions. Tests use mock auth/data so Supabase doesn't need to be running.

**If tests fail:** Either fix the bug OR update test selectors to match new UI.

---

## 🔀 Git Workflow

**Always create PRs - do not push directly to main.**

```bash
# Create feature branch
git checkout -b feature/my-feature-name

# After committing, push and create PR
git push -u origin feature/my-feature-name
gh pr create --title "Add feature X" --body "Description..."
```

---

## 📐 Coding Standards (Summary)

**Mobile-first:** Build for 375px first, then scale up
**Touch targets:** Minimum 44px
**Components:** Use shadcn/ui as base, customize to match design

### TypeScript for New Code

**IMPORTANT:** All NEW files should be written in TypeScript (`.ts`/`.tsx`).

- Existing `.js`/`.jsx` files: Leave as-is (gradual migration later)
- New components: Use `.tsx` extension
- New hooks: Use `.ts` extension
- New utilities: Use `.ts` extension
- Shared types: Add to `src/types/` folder

```typescript
// Example: New hook in TypeScript
// src/hooks/useNewFeature.ts
import type { School } from '@/types/school';

export function useNewFeature(school: School): string {
  return school.name; // TypeScript catches typos!
}
```

**Naming (with TypeScript):**
- Pages: `DashboardPage.jsx` (existing) or `NewPage.tsx` (new)
- Components: PascalCase (`ProgramCard.jsx` or `NewCard.tsx`)
- Hooks: `usePrograms.js` (existing) or `useNewHook.ts` (new)
- Types: `src/types/school.ts`, `src/types/user.ts`

**Comments:**
- Top of each component: brief description
- Mark mock data: `// TODO: Replace with API call`
- Non-obvious logic: explain why, not what

**Full standards:** `/docs/skills/coding-standards.md`

---

## 🪝 Hook Patterns (CRITICAL)

**Read this section before creating or modifying any hooks that use Supabase.**

### ❌ Patterns That Cause Infinite Re-renders

1. **Multiple Supabase Auth Listeners**
   ```javascript
   // BAD: Each hook creates its own auth listener
   function useMyHook() {
     useEffect(() => {
       supabase.auth.onAuthStateChange(...) // Creates new listener each mount!
     }, [])
   }
   ```
   **Fix:** Use the centralized `useAuth()` hook from `@/hooks/useAuth` instead.

2. **Duplicate Event Handling**
   ```javascript
   // BAD: Not deduplicating repeated events
   supabase.auth.onAuthStateChange((event, session) => {
     setUser(session?.user) // Triggers re-render on every event!
   })
   ```
   **Fix:** Track current user ID with a ref and skip if unchanged:
   ```javascript
   const currentUserIdRef = useRef(null);
   if (event === 'SIGNED_IN' && newUserId === currentUserIdRef.current) {
     return; // Skip duplicate
   }
   currentUserIdRef.current = newUserId;
   ```

3. **State Updates During Async Operations**
   ```javascript
   // BAD: Multiple state updates trigger multiple re-renders
   enrichUserData(user).then(enriched => {
     setUser(enriched);        // Re-render 1
     setSession(newSession);   // Re-render 2
     setLoading(false);        // Re-render 3
   })
   ```
   **Fix:** Use refs to track async operation state and batch updates.

4. **Unstable Array/Object References**
   ```javascript
   // BAD: Creates new array reference on every render → infinite loop!
   const savedIds = user ? supabaseData.filter(...).map(...) : localData;
   const setSavedIds = user ? () => {} : setLocalData; // New function each render!
   ```
   **Fix:** Wrap with `useMemo` and `useCallback`:
   ```javascript
   const savedIds = useMemo(() => {
     return user ? supabaseData.filter(...).map(...) : localData;
   }, [user, supabaseData, localData]);

   const noopSetter = useCallback(() => {}, []);
   const setSavedIds = user ? noopSetter : setLocalData;
   ```

### ✅ Correct Hook Patterns

1. **For Authentication:** Always use `useAuth()` from `@/hooks/useAuth`
   ```javascript
   const { user, isAuthenticated, isLoading } = useAuth();
   ```

2. **For Supabase Queries:** Check `isSupabaseConfigured()` first
   ```javascript
   if (!isSupabaseConfigured()) {
     return mockData; // Fall back to mock data in dev
   }
   ```

3. **For Subscriptions:** Clean up in useEffect return
   ```javascript
   useEffect(() => {
     const { data: { subscription } } = supabase.auth.onAuthStateChange(...);
     return () => subscription.unsubscribe(); // Always clean up!
   }, []);
   ```

4. **For Realtime:** Use refs to track subscription state
   ```javascript
   const channelRef = useRef(null);
   useEffect(() => {
     if (channelRef.current) return; // Already subscribed
     channelRef.current = supabase.channel('my-channel')...
   }, []);
   ```

### 🔍 Debugging Auth Issues

If navigation stops working or you see excessive re-renders:
1. Check browser console for repeated `onAuthStateChange` events
2. Ensure hooks use `useAuth()` instead of direct Supabase auth calls
3. Look for missing cleanup functions in useEffect
4. Verify refs are used to prevent duplicate operations

---

## 🎨 Design System (Summary)

**Colors:**
- Background Gradient: Pink → Purple (`#FDF2F8` → `#F3E8FF`)
- Cards: White with subtle shadow
- Text: Near-black (`#1A1A1A`)
- Success/Green: `#10B981`
- Status badges: Yellow background, dark text

**Typography:**
- Headings: Bold, possibly Poppins/Montserrat
- Body: Clean sans-serif, possibly Inter

**Full design system:** `/docs/skills/design-system.md`

---

## 🔄 Workflow

### Starting a Session
1. Read this file (CLAUDE.md)
2. Check `/docs/project/status.md` for current state
3. Check `/docs/project/step-by-step-guide.md` for implementation details

### Completing Work
1. Update status.md if needed
2. Log decisions in decision-log.md
3. Note any issues in issues.md

### For Dev Team
- See `/docs/project/handoff.md` for API integration guide
- See `/DEV-TEAM-START-HERE.md` for high-level overview

---

## 📊 Current Phase

Check `/docs/project/status.md` for latest. Project phases:

| Phase | Status | Focus |
|-------|--------|-------|
| 0 | ✅ Complete | Project setup |
| 1 | ✅ Complete | Design system + components |
| 2 | ✅ Complete | Applicant core (Dashboard, Programs, Trackers, Stats) |
| 2.5 | ✅ Complete | Data layer systems (nudges, ReadyScore, checklists) |
| 3 | ✅ Complete | Marketplace Applicant Side |
| 4 | ✅ Complete | Marketplace Provider Side |
| 4.5 | ✅ Complete | Admin Marketplace Management |
| 5 | ✅ Complete | Additional features (schools, prereqs, events) |
| 6 | ✅ Complete | Custom Supabase Forums |
| 7 | ⬜ Not Started | Polish + handoff |

**Target Handoff:** December 15, 2024

### Marketplace Implementation Guide

Full step-by-step implementation with copy-paste prompts and Playwright tests:
**`/docs/project/step-by-step-guide.md`** (Phases 3, 4, 4.5)

Key marketplace differentiators from competitors (TeachRN):
- 20% commission vs 35%
- Fun personality questions for vibe-matching
- Clear expectations BEFORE mentor signup
- AI-powered profile writing tips
- Service templates with deliverables
- Mentor community + resources

---

## ⚠️ Important Context

1. **Supabase is the primary backend.** WordPress retained for email (Groundhogg), products (WooCommerce), and blog. Community forums are custom Supabase (not BuddyBoss).

2. **Mentor Marketplace is a key feature.** Two-sided marketplace where SRNAs mentor applicants. Comprehensive planning in `/docs/project/marketplace/` (14 documents).

3. **Rich applicant data collection.** MyStats page captures comprehensive profiles (academic, clinical, shadow, certifications, etc.) for smart matching and insights. See `/docs/skills/canonical-user-model.md`.

4. **Smart Nudging System.** 7 prompt engines drive personalized guidance based on user stage and data gaps. See `/docs/skills/smart-prompts-system.md`.

5. **Gamification matters.** Points, badges, levels drive engagement. See `/docs/skills/gamification-system.md`.

6. **User is non-technical.** Explain things simply. Use analogies when helpful.

7. **Subscription migration planned.** Moving from WooCommerce Subscriptions to Stripe Subscriptions. WooCommerce retained for product cart.

8. **Admin↔Provider messaging is separate from marketplace messaging.** Used for application workflow (info requests, approvals, denials). See `/src/data/marketplace/mockAdminMessages.js`.

---

## 📞 When Stuck

1. Re-read the relevant skill file
2. Check `/docs/skills/design-system.md` for UI patterns
3. Ask clarifying questions before guessing
4. Log blockers in `/docs/project/issues.md`

---

**Now check `/docs/project/status.md` for current progress.**
