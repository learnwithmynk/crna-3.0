# Decision Log

Record of key decisions made during the project build.

---

## Format

```
### [Date] Decision Title

**Context:** Why this decision was needed
**Decision:** What we decided
**Rationale:** Why we chose this
**Alternatives Considered:** What else we looked at
**Impact:** What this affects
```

---

## Decisions

### [Nov 28, 2024] Tech Stack Selection

**Context:** Needed to choose frontend framework and tooling for the rebuild.

**Decision:** 
- React + Vite (not Next.js)
- Tailwind CSS for styling
- shadcn/ui for component library
- Vercel for deployment

**Rationale:**
- React + Vite is simpler than Next.js for a primarily client-side app
- Vite has faster dev server and build times
- shadcn/ui is free, customizable, and Claude-friendly
- Tailwind enables rapid styling with design system constraints
- Vercel provides easy deployment with preview URLs

**Alternatives Considered:**
- Next.js: Overkill for this use case, added complexity
- Material UI: Less customizable, heavier bundle
- Chakra UI: Good but shadcn is newer and more flexible

**Impact:** All component and page development will use these tools.

---

### [Nov 28, 2024] Hybrid Auth Approach

**Context:** Need to authenticate users against both new Supabase database and existing WordPress.

**Decision:** 
- Supabase Auth as primary (React frontend)
- Sync authentication state to WordPress
- Dev team will implement the sync mechanism

**Rationale:**
- Supabase provides modern auth with good React SDK
- WordPress must still recognize users for LearnDash, WooCommerce, BuddyBoss
- Sync allows both systems to work together

**Alternatives Considered:**
- WordPress JWT only: Less modern, harder to extend
- Supabase only: Would break WordPress integrations

**Impact:** Auth components will use Supabase, but backend team needs to handle sync.

---

### [Nov 28, 2024] Keep WooCommerce Subscriptions

**Context:** Deciding whether to migrate billing to Stripe Billing or keep WooCommerce.

**Decision:** Keep WooCommerce Subscriptions for billing.

**Rationale:**
- Existing subscribers already on WooCommerce
- Migration would be disruptive and risky
- WooCommerce works fine, just needs frontend wrapper
- Groundhogg/WP Fusion tags integrate with WooCommerce

**Alternatives Considered:**
- Stripe Billing: Cleaner, but migration risk too high

**Impact:** Checkout flows will redirect to WooCommerce pages.

---

### [Nov 28, 2024] BuddyBoss as Phase 6 (Flex)

**Context:** BuddyBoss community features are complex and timeline is tight.

**Decision:** Push BuddyBoss implementation to Phase 6, mark as optional/flex.

**Rationale:**
- Core applicant features are higher priority
- Community already works in WordPress if needed
- Can launch without new community UI if time runs short

**Alternatives Considered:**
- Skip entirely: Community is valued by users
- Earlier in timeline: Would delay core features

**Impact:** If behind schedule, community can be descoped.

---

### [Nov 28, 2024] Component-First Development

**Context:** Deciding whether to build pages or components first.

**Decision:** Build all base components in Phase 1 before building pages.

**Rationale:**
- Components are reused across pages
- Building components first ensures consistency
- Page development is faster with component library ready
- Easier to QA components in isolation

**Alternatives Considered:**
- Build pages directly: Faster initial progress but messier

**Impact:** Phase 1 focused entirely on components, pages start Phase 2.

---

### [Nov 28, 2024] Mock Data Strategy

**Context:** API integration happens after handoff, need data for development.

**Decision:** 
- Create realistic mock data files in /src/data/
- Use hooks that return mock data with TODO comments
- Dev team replaces with API calls post-handoff

**Rationale:**
- Allows full UI development without backend
- Mock data documents expected data shapes
- Clear handoff: replace mocks with APIs

**Alternatives Considered:**
- Hardcode in components: Harder to replace later
- Skip mock data: Can't test real scenarios

**Impact:** All data-fetching hooks will return mock data initially.

---

### [Nov 28, 2024] Batch QA Per Phase

**Context:** Deciding how often to run QA.

**Decision:** Run QA at the end of each phase, not after each page/component.

**Rationale:**
- More efficient use of time
- Easier to maintain context
- Catch systemic issues
- QA agent can review holistically

**Alternatives Considered:**
- QA per page: Too fragmented
- QA only at end: Too late to fix

**Impact:** QA tasks included at end of each phase in task list.

---

### [Nov 28, 2024] Yellow Primary Color

**Context:** Extracting brand colors from screenshots.

**Decision:** Primary accent color is `#F7E547` (bright yellow).

**Rationale:**
- Consistent across screenshots
- Used for buttons, highlights, badges
- Distinctive brand element

**Alternatives Considered:** N/A - extracted from existing brand

**Impact:** All primary buttons and accents use this yellow.

---

### [Nov 28, 2024] Mobile-First Development

**Context:** Many users access on mobile devices.

**Decision:** 
- Build mobile-first (375px base)
- Add larger breakpoints progressively
- Minimum 44px touch targets

**Rationale:**
- Mobile users are significant portion
- Easier to scale up than scale down
- Forces simpler, cleaner designs

**Alternatives Considered:**
- Desktop-first: Common but makes mobile harder

**Impact:** All components start with mobile styles.

---

### [Dec 9, 2024] WooCommerce + Supabase Integration for Product Purchases

**Context:** Need to sync WooCommerce one-time product purchases to Supabase entitlements while keeping FunnelKit checkout.

**Decision:**
- Keep WooCommerce + FunnelKit for product checkout
- Pass `supabase_uid` in checkout URL to link purchases to logged-in user
- WooCommerce webhook → Supabase Edge Function → `user_entitlements` table
- Guest digital purchases auto-create Supabase accounts with magic link

**Rationale:**
- FunnelKit already has upsells, thank you pages built
- `supabase_uid` solves email mismatch problem
- Supabase entitlements as source of truth (not Groundhogg tags)
- Magic link provides password setup without WordPress

**Full Details:** `/docs/project/woocommerce-supabase-integration.md`

**Impact:** Dev team implements Edge Functions and WordPress plugin for sync.

---

### [Dec 9, 2024] Supabase Entitlements as Source of Truth

**Context:** Deciding whether Groundhogg tags or Supabase should control access.

**Decision:** Supabase `user_entitlements` table is the source of truth for React app. Groundhogg tags are synced FROM Supabase for email segmentation only.

**Rationale:**
- Future-proof: Can change tag names without breaking access
- React app reads directly from Supabase (faster)
- Single source of truth prevents sync issues
- Groundhogg becomes email-only, not access control

**Impact:** All access checks in React read from Supabase, not Groundhogg.

---

### [Dec 9, 2024] Password Setup via Supabase Magic Link

**Context:** Users purchasing without existing account need to set password.

**Decision:** Use Supabase magic link (not WordPress password reset).

**Flow:**
1. Guest purchases digital product
2. Edge Function creates Supabase account
3. Supabase sends magic link email
4. User clicks → React `/auth/set-password` page
5. User sets password → logged in

**Rationale:**
- Keeps auth in Supabase (not WordPress)
- Custom branded email template
- Secure, time-limited links
- No WordPress admin needed

**Impact:** Custom email templates in Supabase, React password-set page.

---

### [Dec 9, 2024] Marketplace Scheduling: Cal.com Integration

**Context:** Need scheduling/availability management for mentor marketplace without building from scratch.

**Decision:**
- Use Cal.com Platform API as scheduling backend
- 100% white-labeled (neither applicants nor providers see Cal.com)
- Cal.com accounts created programmatically on provider approval
- Custom React UI for all booking/availability interfaces

**Rationale:**
- Cal.com handles complex scheduling logic (timezone, availability, conflicts)
- Platform API allows full white-labeling
- Free tier sufficient for MVP, self-host at scale (~50 bookings/mo)
- Providers never need to learn another tool

**Alternatives Considered:**
- Calendly: Less flexible API, harder to white-label
- Custom build: 4-6 weeks extra development
- Acuity: Similar limitations to Calendly

**Full Details:** `~/.claude/plans/parsed-kindling-honey.md`

**Impact:** Dev team implements Cal.com API integration, not custom scheduling.

---

### [Dec 9, 2024] Marketplace Payment: Stripe Connect Express

**Context:** Need payment processing for two-sided marketplace with provider payouts.

**Decision:**
- Stripe Connect Express accounts for providers
- 20% baseline commission (customizable per provider, e.g., 15% for founding mentors)
- Payment captured immediately (not auth-then-capture)
- Stripe Connect holds funds via delayed transfers
- Bi-weekly payouts (every 2 weeks)
- Platform absorbs chargeback fees (~$15)

**Rationale:**
- Express accounts = quick provider onboarding (Stripe handles verification)
- Platform controls payout timing for dispute window
- Immediate capture + delayed transfer is simpler than auth/capture
- Absorbing chargebacks builds provider trust

**Alternatives Considered:**
- Custom accounts: Too much compliance work
- Auth-then-capture: More complex, no real benefit with delayed transfers

**Full Details:** `/docs/project/marketplace/stripe-connect-decisions.md`

**Impact:** Stripe Connect setup, Edge Functions for webhooks, commission stored per-provider.

---

### [Dec 9, 2024] Marketplace Booking Models: Dual State Machines

**Context:** Providers have different preferences - some want instant booking, others want to approve each request.

**Decision:** Support both booking models with separate state machines:

**Instant Book:**
```
pending_payment → payment_succeeded → confirmed → completed
```

**Requires Confirmation:**
```
pending_payment → payment_succeeded → pending_provider → confirmed → completed
```

**Rationale:**
- SRNAs are busy students with variable schedules
- Some providers want control, others want automation
- Provider chooses their model during onboarding

**Impact:** Two booking flows in UI, provider dashboard shows pending requests.

---

### [Dec 9, 2024] Marketplace Access: Members-Only for MVP

**Context:** Deciding whether marketplace should be public or gated.

**Decision:** Paying CRNA Club members only for MVP.
- Must be logged in with active subscription to view marketplace
- Future: Public browsing with login gate on booking action

**Rationale:**
- Simpler access control for MVP
- Marketplace as membership value-add
- Can open up later as acquisition channel

**Impact:** Access checks on all marketplace routes.

---

### [Dec 9, 2024] SRNA Role Tags: Mentor vs Provider

**Context:** Need to distinguish SRNAs who engage in community vs those approved to sell services.

**Decision:** Two separate tags in Supabase:
- **`srna_mentor`** - SRNAs engaging in community, mentoring informally (no paid services)
- **`srna_provider`** - SRNAs approved to offer paid services in marketplace

**Requirements to be a provider:**
- Must have BOTH `srna_mentor` AND `srna_provider` tags
- `srna_mentor` = verified SRNA status (community access)
- `srna_provider` = approved provider application (marketplace access)

**Rationale:**
- Some SRNAs want to help the community without selling services
- Provider approval is a separate, more rigorous process
- Clear separation of community role vs commercial role
- Can revoke provider status without affecting mentor status

**Impact:**
- Provider routes check for `srna_provider` tag
- Community features available to `srna_mentor`
- Admin sets both tags independently

---

### [Dec 9, 2024] Marketplace Emails: Split Between Cal.com and Groundhogg

**Context:** Multiple email types for marketplace - need to decide which system sends what.

**Decision:**
- **Cal.com handles:** Booking confirmations, reminders, cancellations, reschedules
- **Groundhogg handles:** New inquiry alerts, inquiry replies, review requests, payout notifications

**Rationale:**
- Cal.com has built-in booking email templates
- Groundhogg already handles marketing/transactional for platform
- Clear separation: scheduling emails vs engagement emails

**Impact:** Webhook to Groundhogg for inquiry/review emails, Cal.com configured for booking emails.

---

### [Dec 9, 2024] WP Fusion NOT Used - Groundhogg Native Integration

**Context:** Clarifying which CRM integration layer handles WooCommerce → Groundhogg sync.

**Decision:** WP Fusion is NOT being used. Groundhogg has native WooCommerce integration.
- Groundhogg tags applied directly via WooCommerce hooks
- No WP Fusion license or configuration needed
- Tag application happens in Groundhogg, not WP Fusion

**Rationale:**
- Groundhogg's native integration is sufficient for tag-based automation
- Fewer plugins = less complexity
- All tagging logic stays in one place (Groundhogg)

**Impact:** Dev team does NOT need to set up WP Fusion. Groundhogg handles all tag automation.

---

### [Dec 9, 2024] Custom LMS: Editor.js + Supabase

**Context:** Need to replace LearnDash with custom LMS for learning modules. Evaluated options for content editing.

**Decision:**
- Use Editor.js (not TipTap) for block-based lesson content editing
- Store all LMS data in Supabase (modules, sections, lessons, downloads)
- No external CMS or recurring costs
- Same Editor.js to be reused for future "My Docs" feature (user notes)

**Rationale:**
- Editor.js is block-based (like Notion) - easier for VA to create structured content
- Supports custom blocks (callout, quiz, flashcard) easier than TipTap
- Free & open source (Apache 2.0)
- Content stored as JSON in Supabase `lessons.content` field
- Same editor can power future user-facing note-taking feature

**Alternatives Considered:**
- TipTap: Great WYSIWYG but harder to add custom blocks
- Sanity/Contentful: Recurring costs, user wanted to avoid
- MDX files: Too technical for VA editing

**Full Details:** `/docs/project/lms-implementation-plan.md`

**Impact:** ~8-10 weeks implementation. VA can create/edit lessons without technical knowledge.

---

### [Dec 9, 2024] LMS Download System: Category-Based Auto-Population

**Context:** Lessons need associated downloadable resources. Need flexible system for VA.

**Decision:** Three-layer download aggregation:
1. **Auto-populate from category** - Set `resource_category_slug` on lesson, all downloads with that category appear
2. **Manual additions** - Add specific download IDs for extras
3. **Exclusions** - Hide specific downloads even if category matches

**Download Button Logic:**
- User has access → "Download" button (opens file URL)
- No access → "Get Now" button (links to WooCommerce product)

**Rationale:**
- VA doesn't need to manually add every download to every lesson
- Categories handle bulk association
- Manual additions handle exceptions
- Exclusions handle edge cases

**Impact:** `downloads` table with `category_slugs` array, `lessons` table with `resource_category_slug`, `manual_download_ids`, `excluded_download_ids`.

---

### [Dec 9, 2024] Full Platform Search from Day One

**Context:** Users need to search for topics to study across the platform.

**Decision:** Implement full platform search in LMS phase, not just LMS-only search.

**Search Scope:**
| Source | Data Location |
|--------|---------------|
| Modules | Supabase |
| Lessons | Supabase |
| Downloads | Supabase |
| Schools | Supabase |
| BuddyBoss Posts | WordPress API |

**Implementation:**
- Global search modal (⌘+K / Ctrl+K) in app header
- Inline search on Learning Library and Module Detail pages
- Postgres full-text search for Supabase tables
- WordPress REST API for BuddyBoss content

**Rationale:**
- Users want to find topics across entire platform, not just LMS
- Nurses studying on phones need quick topic lookup
- Building search infrastructure once serves all future features

**Impact:** `useGlobalSearch` hook, full-text search indexes in Supabase, Command modal component.

---

### [Dec 9, 2024] Editor.js Autosave + Undo/Redo (Not Revision History)

**Context:** Need to prevent VA from losing work in lesson editor.

**Decision:**
- Autosave every 30 seconds + 2-second debounce on changes
- 5 levels of undo/redo in memory (⌘+Z / ⌘+Shift+Z)
- Visual save status indicator ("Saving..." → "Saved" → "Last saved: X min ago")
- NO full revision history (too complex for scope)

**Rationale:**
- Autosave prevents lost work from browser crashes
- 5-level undo sufficient for accidental deletions
- Full revision history would add significant complexity
- Can add revision history later if needed

**Alternatives Considered:**
- Full revision history with Google Docs-style viewer: Too complex for MVP
- No undo at all: Too risky for VA

**Impact:** BlockEditor component maintains history state, debounced save function.

---

### [Dec 9, 2024] Image Upload via Supabase Storage

**Context:** Editor.js needs image upload capability for lesson content.

**Decision:**
- Drag & drop images into Editor.js
- Upload to Supabase Storage bucket `lesson-images`
- Return public URL for Editor.js Image block

**Rationale:**
- VA shouldn't need external hosting for lesson images
- Supabase Storage is already in our stack
- Public URLs work directly in Editor.js

**Impact:** `useImageUpload` hook, Supabase Storage bucket, custom Image tool config.

---

### [Dec 10, 2024] LMS Admin Module Builder - Part of Future Admin Section

**Context:** Built Module Builder pages during Phase 5.5 LMS implementation. Need to clarify scope.

**Decision:**
- Current routes (`/admin/modules/*`) are standalone for now
- Module Builder will be integrated into a unified Admin Section (not yet scoped)
- Admin Section will include: LMS management, user management, marketplace moderation, etc.

**Current State:**
- `/admin/modules` - Module list with search, filters, drag & drop reorder
- `/admin/modules/new` - Create new module
- `/admin/modules/:moduleId` - Edit module details, manage sections/lessons
- `/admin/lessons/*` - Placeholder for lesson editor

**Future Scope (Admin Section):**
- Unified admin dashboard
- Role-based access (admin-only routes)
- User management
- Marketplace provider approvals
- Content moderation
- Analytics dashboard

**Impact:** Module Builder is functional but will need integration into larger Admin Section later.

---

## Future Decisions Needed

- [x] ~~Marketplace booking: Instant book vs request-based~~ → Both supported (Dec 9)
- [x] ~~SRNA availability: Calendly integration or custom?~~ → Cal.com (Dec 9)
- [x] ~~WP Fusion vs Native Groundhogg~~ → Native Groundhogg (Dec 9)
- [x] ~~LMS content editor: TipTap vs Editor.js~~ → Editor.js (Dec 9)
- [x] ~~LMS search scope: LMS-only vs full platform~~ → Full platform (Dec 9)
- [x] ~~Ready Score calculation: Algorithm details~~ → Documented in `/docs/skills/readyscore-system.md` (Dec 13)
- [ ] Admin Section: Full scope and design
- [ ] Notification delivery: In-app only or push?
- [ ] Mentor matching: Algorithm details
