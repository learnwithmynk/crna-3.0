# Access Control

The CRNA Club uses a tag-based access control system powered by WP Fusion and Groundhogg. Tags determine what content and features each user can access.

---

## Tag Naming Convention

Tags follow this pattern: `XX. [Category] - Description`

| Prefix | Category | Purpose |
|--------|----------|---------|
| 00. | Admin | Internal/system tags |
| 01. | Lead Gen | Opt-in tracking |
| 02. | Status | Purchase/subscription status |
| 03. | Access | Grants access to content |
| 04. | Mentor | SRNA/mentor identification |
| 05. | Gamplify | Gamification events |
| 06. | Programs | Program-related tags |

---

## User Access Levels

### Public (Not Logged In)
- Blog posts
- Shop (browse)
- Limited marketing pages
- Login/Register

### Free/Registered User (No Subscription)
- Everything above
- My Account/Settings
- Paywalled/blurred preview of:
  - Dashboard
  - School Database (limited)
  - My Programs (prompt to upgrade)
- My Purchases (if they bought toolkits)

### 7-Day Free Trial
Tag: `02. [Status] - 7 Day Free Trial - Active`

Full access to everything (same as paid member):
- Dashboard
- My Trackers (all tabs)
- My Stats
- School Database (full)
- My Programs
- Prerequisite Library
- Learning Library (all modules)
- Digital Downloads
- Community (Forums, Groups, Messages)
- Events
- All tools

### Active Member (Paid)
Tags:
- `03. [Access] - Premium Member 1 - Give Access`
- `03. [Access] - Premium Member Legacy - Give Access` (for founding members)

Full access to everything.

### Cancelled/Expired Member
Tags:
- `02. [Status] - Premium Member 1 - Cancelled`
- `02. [Status] - Premium Member 1 - On-Hold`

Reverts to Free/Registered access level.

---

## Toolkit-Only Access

Users who purchased toolkits but not the membership:

### Plan + Apply Toolkit
Tag: `02. [Status] - Plan + Apply Toolkit - Purchased`

Access to:
- Resume Templates
- Shadow Day Guide
- Drug Chart
- Business Cards
- School Cheat Sheets
- Vasopressor Worksheet
- GPA Calculator (Spreadsheet + Page)
- Financial Planner (Spreadsheet + Page)
- Application Tracker
- Essay Workbook
- CCRN Study Plan
- GRE Study Plan
- Roadmap Planning Tool
- Prerequisite Guide
- Email Templates
- Digital Plan + Apply Workbook
- Plan + Apply Course modules

### Interviewing Toolkit
Tag: `02. [Status] - Interview Toolkit - Purchased`

Access to:
- Drug Chart
- Vasopressor Worksheet
- Interview Answer Brainstorming
- IOD Bundle (all Interview On Demand modules)
- Digital Pharmacology Workbook
- Digital Pathophysiology Workbook
- Interviewing Course modules

### My Purchases Page
Toolkit-only users access their content via `/my-purchases` even without active membership.

---

## Content Protection

### Pages Protected by Membership
- `/dashboard`
- `/my-programs`
- `/my-programs/:id`
- `/trackers/*`
- `/my-stats`
- `/schools` (full access)
- `/schools/:id` (full details)
- `/prerequisites`
- `/learning`
- `/community/*`
- `/events` (full access)
- `/tools/*`

### Partially Accessible
- `/schools` - Free users see blurred/limited cards
- `/events` - Free users can browse but not save

### Behavior for Unpaid Users
1. Show blurred/grayed content
2. Overlay with upgrade prompt
3. CTA to membership checkout

---

## How Tags Are Applied

### On Purchase (WooCommerce → WP Fusion)
```
User purchases "CRNA Club Membership"
  → WooCommerce triggers order complete
  → WP Fusion applies: 02. [Status] - Premium Member 1 - Active Subscription
  → WP Fusion applies: 03. [Access] - Premium Member 1 - Give Access
  → User now has full access
```

### On Free Trial Start
```
User signs up for 7-day trial
  → Apply: 02. [Status] - 7 Day Free Trial - Active
  → Full access for 7 days
  
After 7 days, if not converted:
  → Remove: 02. [Status] - 7 Day Free Trial - Active
  → Apply: 02. [Status] - 7 Day Free Trial - Ended
  → Reverts to free access
```

### On Cancellation
```
User cancels subscription
  → Remove: 03. [Access] - Premium Member 1 - Give Access
  → Apply: 02. [Status] - Premium Member 1 - Cancelled
  → Access revoked at billing period end
```

### On Lead Magnet Opt-In
```
User downloads freebie
  → Apply: 01. [Status] - Freebie Download - Opt-In
  → Apply: 01. [List] - Master Email List - Opt-In
  → Enter nurture email sequence
```

### On Behavior (JetForms/Hooks)
```
User saves a program
  → Custom hook triggers
  → Potentially apply segment tags
  → Award gamification points
```

---

## Key Access Tags Reference

### Core Membership Access
| Tag | What It Unlocks |
|-----|-----------------|
| `03. [Access] - Premium Member 1 - Give Access` | Full platform access |
| `03. [Access] - Premium Member Legacy - Give Access` | Full access (founding members) |
| `02. [Status] - 7 Day Free Trial - Active` | Full access during trial |

### Toolkit Access
| Tag | What It Unlocks |
|-----|-----------------|
| `03. [Access] - Plan + Apply Course - Give Access` | P+A modules/downloads |
| `03. [Access] - Interviewing Course - Give Access` | Interview modules/downloads |
| `03. [Access] - IOD Bundle - Give Access` | All Interview On Demand videos |

### Individual Product Access
| Tag | Product |
|-----|---------|
| `03. [Access] - Resume Templates - Give Access` | Resume templates |
| `03. [Access] - Drug Chart - Give Access` | 60+ drug chart |
| `03. [Access] - GPA Calculator Page - Give Access` | GPA calculator tool |
| `03. [Access] - Financial Planner Page - Give Access` | Financial planner tool |
| `03. [Access] - School Database - Give Access` | Full school database |

---

## React Implementation

### Access Check Hook
```javascript
// hooks/useAccess.js
export function useAccess() {
  const { user } = useAuth();
  
  const hasAccess = (requiredTag) => {
    if (!user) return false;
    return user.tags.includes(requiredTag);
  };
  
  const hasMembership = () => {
    return hasAccess('03. [Access] - Premium Member 1 - Give Access') ||
           hasAccess('03. [Access] - Premium Member Legacy - Give Access') ||
           hasAccess('02. [Status] - 7 Day Free Trial - Active');
  };
  
  const hasToolkit = (toolkit) => {
    if (toolkit === 'plan_apply') {
      return hasAccess('02. [Status] - Plan + Apply Toolkit - Purchased');
    }
    if (toolkit === 'interviewing') {
      return hasAccess('02. [Status] - Interview Toolkit - Purchased');
    }
    return false;
  };
  
  return { hasAccess, hasMembership, hasToolkit };
}
```

### Protected Route Component
```jsx
// components/ProtectedRoute.jsx
export function ProtectedRoute({ children, requireMembership = true }) {
  const { hasMembership } = useAccess();
  
  if (requireMembership && !hasMembership()) {
    return <UpgradePrompt />;
  }
  
  return children;
}
```

### Paywall Overlay
```jsx
// components/PaywallOverlay.jsx
export function PaywallOverlay({ children }) {
  const { hasMembership } = useAccess();
  
  if (hasMembership()) {
    return children;
  }
  
  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/80">
        <div className="text-center p-6">
          <h3 className="text-xl font-bold">Unlock Full Access</h3>
          <p className="text-gray-600 mt-2">
            Join The CRNA Club to access this feature
          </p>
          <Button className="mt-4">Start Free Trial</Button>
        </div>
      </div>
    </div>
  );
}
```

---

## Onboarding Status Tags

Track onboarding video views:
- `00. [Status] - Membership Onboarding Video - Viewed`
- `00. [Status] - Trackers Onboarding Video - Viewed`
- `00. [Status] - My Programs Onboarding Video - Viewed`
- `00. [Status] - Prerequisites Library Onboarding Video - Viewed`

These trigger removal of onboarding prompts after user has seen the video.

---

## API Endpoints (for dev team)

```
GET /wp-json/user/v1/me/tags
  → Returns array of user's tags

POST /wp-json/user/v1/me/tags
  → Add tag to user

DELETE /wp-json/user/v1/me/tags/{tag}
  → Remove tag from user

GET /wp-json/user/v1/me/access
  → Returns computed access object:
    {
      hasMembership: true,
      hasToolkit: { planApply: false, interviewing: false },
      accessLevel: 'member',
      trialEndsAt: null
    }
```
