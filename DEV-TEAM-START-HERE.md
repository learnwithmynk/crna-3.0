# Dev Team Start Here

**Read time:** 5 minutes | **Last Updated:** December 13, 2024

---

## What Is This?

**The CRNA Club** is a web app for ICU nurses who want to become nurse anesthetists (CRNAs). Think of it as an all-in-one companion for the 2-3 year journey from "I want to apply" to "I got accepted."

The app helps them track clinical experience, research schools, connect with mentors, and stay organized through the application process.

---

## Glossary (You'll See These Terms Everywhere)

| Term | Meaning |
|------|---------|
| **CRNA** | Certified Registered Nurse Anesthetist - the goal career |
| **SRNA** | Student Registered Nurse Anesthetist - already in CRNA school, can be a mentor |
| **ICU** | Intensive Care Unit - where applicants work (required experience) |
| **Supabase** | Our primary backend (Postgres + Auth + Realtime) |
| **Cal.com** | Scheduling service for marketplace bookings (white-labeled) |
| **Community Forums** | Custom Supabase forums (no BuddyBoss) |
| **ReadyScore** | 0-100 score showing how ready someone is to apply |

---

## Quick Start (Get Running in 2 Minutes)

```bash
git clone [repository-url]
cd crna-club-rebuild
npm install
npm run dev
# Opens http://localhost:5173
```

**Everything works with mock data.** You can explore the full UI without any backend setup.

### Key Routes to Explore

| Route | What You'll See |
|-------|-----------------|
| `/dashboard` | Main applicant dashboard with widgets |
| `/schools` | Database of 140+ CRNA programs |
| `/my-stats` | User profile (GPA, certs, experience) |
| `/marketplace` | Browse mentors, book sessions |
| `/admin` | Admin panel (users, content, providers) |
| `/admin/community/reports` | Community moderation queue |
| `/community/forums` | Forums list and topics |
| `/settings` | User settings (profile, subscription, privacy) |

---

## What's Built vs What You Build

### Already Built

| Area | Status |
|------|--------|
| **Frontend** | Complete React UI for all pages (mobile-first, responsive) |
| **Database Schema** | 20 migrations, ~60 tables, all relationships defined |
| **Mock Data** | Every feature works with realistic mock data |
| **Tests** | 894 Playwright E2E tests across 40 test files |

### Your Job

| Task | Details |
|------|---------|
| **Wire Up APIs** | Replace mock data with real Supabase/API calls |
| **Set Up Auth** | Implement Supabase Auth, configure RLS policies |
| **External Integrations** | Stripe Connect, Cal.com, WordPress sync |
| **Deploy** | Vercel (frontend) + Supabase (backend) |

---

## Tech Stack Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                   │
│  React 19 + Vite 7 + Tailwind 4 + shadcn/ui                      │
│  Deployed on Vercel                                               │
├──────────────────────────────────────────────────────────────────┤
│                     PRIMARY BACKEND                               │
│  Supabase (Postgres + Auth + Realtime + Storage)                 │
│  - User data, trackers, marketplace, schools, community          │
│  - 20 migrations, ~60 tables with RLS                            │
├──────────────────────────────────────────────────────────────────┤
│                      MARKETPLACE                                  │
│  Stripe Connect Express - Provider payouts (20% fee)             │
│  Cal.com Platform API - Scheduling (white-labeled)               │
│  Supabase Realtime - Messaging                                   │
├──────────────────────────────────────────────────────────────────┤
│                 WORDPRESS (Retained)                              │
│  Groundhogg - Email marketing & automations                      │
│  WooCommerce - One-time product purchases                        │
│  Blog - Content marketing                                         │
├──────────────────────────────────────────────────────────────────┤
│                      COMMUNITY (Phase 6 ✅)                       │
│  Custom Supabase Forums - Topics, replies, reactions             │
│  In-app notifications - Realtime via Supabase                    │
│  Admin moderation - Reports queue, user suspensions              │
│  Spam prevention - Honeypot, profanity filter, StopForumSpam     │
│  12 tables: forums, topics, replies, reactions, reports, etc.    │
└──────────────────────────────────────────────────────────────────┘
```

---

## User Types

| Type | Who They Are | What They Do |
|------|--------------|--------------|
| **Applicant** | ICU nurse planning to apply | Track stats, research schools, book mentors |
| **SRNA/Provider** | Student in CRNA school | Offer paid mentoring services |
| **Admin** | Platform staff | Manage users, content, approve providers |

---

## Where to Go Next

| Document | Purpose | Read Time |
|----------|---------|-----------|
| [docs/project/handoff.md](docs/project/handoff.md) | **Complete technical reference** - database schema, all features, integration guide | 30 min |
| [docs/project/step-by-step-guide.md](docs/project/step-by-step-guide.md) | Task breakdown by phase with copy-paste prompts | 20 min |
| [CLAUDE.md](CLAUDE.md) | AI session context (for Claude Code users) | 10 min |

---

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
# Required
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Marketplace (when ready)
VITE_STRIPE_PUBLISHABLE_KEY=
CAL_COM_API_URL=https://api.cal.com/v2
CAL_COM_CLIENT_ID=
CAL_COM_CLIENT_SECRET=

# WordPress (for legacy integrations)
VITE_API_URL=https://thecrnaclub.com/wp-json
```

---

## Running Tests

```bash
# Playwright E2E tests (894 tests)
npx playwright test

# Unit tests (Vitest)
npm run test:run
```

---

## Questions?

- Check [docs/project/handoff.md](docs/project/handoff.md) for detailed technical info
- Check [docs/project/issues.md](docs/project/issues.md) for known bugs
- Search for `// TODO:` in the codebase for integration points
