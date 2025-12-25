# Pre-Booking Messaging Flow Research

**Created:** December 9, 2024
**Status:** Research & Recommendation
**Focus:** Communication enablement between applicants and providers BEFORE a service is booked

---

## Executive Summary

This document analyzes the pre-booking communication flow for the CRNA Club marketplace, specifically addressing:
- When and how applicants can message providers before committing to a booking
- Permissions and limitations for pre-booking communication
- Industry patterns from Airbnb, Fiverr, Thumbtack, etc.
- Recommended approach for CRNA Club

**Recommendation:** Implement a **lightweight inquiry system** that allows applicants to message providers directly from their profile, with the following key characteristics:
- Free-flowing messaging (not full chat)
- Context-aware prompts to encourage productive inquiries
- Soft limits for non-members (10 messages/day)
- Seamless transition from inquiry to booking
- No artificial barriers, but strategic friction to encourage booking

---

## Booking Models & How Messaging Fits

### The Two Booking Models Under Consideration

The CRNA Club marketplace is considering **two parallel booking models**:

#### Model A: Instant Book
- Provider sets specific available time slots (e.g., "Mon 3pm, Wed 10am, Fri 2pm")
- Applicant sees available slots and picks one
- Booking is immediately confirmed (no provider approval needed)
- Payment captured immediately
- Similar to: Calendly, ClassPass, salon booking apps

#### Model B: Request-Based (Current Plan)
- Provider indicates general availability (e.g., "Weekday evenings, flexible")
- Applicant proposes preferred times
- Provider reviews and accepts/declines/proposes alternative
- Booking confirmed only after provider accepts
- Similar to: Airbnb (non-instant book hosts), Thumbtack

### Why This Matters for Messaging

The booking model fundamentally changes **when and why** applicants need to message:

| Scenario | Instant Book | Request-Based |
|----------|--------------|---------------|
| **"When are you available?"** | Not needed - they see slots | Very common question |
| **"Can you do Tuesday 3pm?"** | Just book it if slot exists | Yes, this is the flow |
| **"Tell me about yourself"** | Optional nice-to-have | May help provider personalize |
| **Pre-booking messaging needed?** | Less critical | More critical |

### Recommendation: Support Both Models

**Provider Choice:** Let each provider choose their booking model:

```
Provider Settings > Booking Preferences

How do you want to accept bookings?

○ Instant Book
  Applicants can book directly from your calendar.
  You set specific available time slots.
  Best if: You have predictable availability.

● Request & Confirm
  Applicants request a booking, you accept or decline.
  You indicate general availability windows.
  Best if: Your schedule is variable.
```

### How Messaging Works in Each Model

---

#### Instant Book + Messaging

```
┌─────────────────────────────────────────────────────────────────┐
│ INSTANT BOOK PROVIDER PROFILE                                   │
│                                                                 │
│ Sarah Chen - Mock Interview ($100)                              │
│                                                                 │
│ Available Times:                                                │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                │
│ │ Mon Dec 11  │ │ Wed Dec 13  │ │ Fri Dec 15  │                │
│ │ 3:00 PM     │ │ 10:00 AM    │ │ 2:00 PM     │                │
│ │ [Book]      │ │ [Book]      │ │ [Book]      │                │
│ └─────────────┘ └─────────────┘ └─────────────┘                │
│                                                                 │
│ Don't see a time that works? [Message Sarah]                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**When messaging happens:**
- Applicant wants a time NOT shown in available slots
- Applicant has questions about the service itself
- Applicant wants to request a custom/different service

**Message prompt for Instant Book:**
> "Sarah has open time slots above. If none work for you, send her a message to coordinate."

**Key point:** Messaging is the **fallback**, not the primary path.

---

#### Request-Based + Messaging

```
┌─────────────────────────────────────────────────────────────────┐
│ REQUEST-BASED PROVIDER PROFILE                                  │
│                                                                 │
│ Sarah Chen - Mock Interview ($100)                              │
│                                                                 │
│ Availability: Weekday evenings, some weekends                   │
│ Usually responds within: 4 hours                                │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ [Request Booking]  or  [Message First]                    │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**When messaging happens:**
- Applicant wants to discuss times BEFORE submitting a formal request
- Applicant has questions before committing
- Applicant prefers to chat first (personality-driven)

**Two paths available:**

**Path 1: Request Booking Directly**
```
Applicant clicks [Request Booking]
    ↓
Booking form asks:
  - When do you prefer? (3 time options)
  - Message to provider (required)
    ↓
Provider receives request with times + message
    ↓
Provider accepts (picking a time) or declines
```

**Path 2: Message First, Then Book**
```
Applicant clicks [Message First]
    ↓
Opens message composer:
  "Hi Sarah, I'm interested in booking a mock interview.
   Are you available next week? I'm flexible on..."
    ↓
Conversation happens
    ↓
When ready, applicant clicks [Book with Sarah]
  OR provider sends booking link in chat
```

**Key point:** Messaging can happen **before or instead of** the formal booking request, and the booking request itself includes a message.

---

### The Hybrid Scenario: Time Coordination via Messaging

This is the scenario you mentioned - someone messages to coordinate a time within a general availability window.

**Example Flow:**

```
Provider Profile shows:
  "Generally available: Weekday evenings EST"

Applicant messages:
  "Hi! I'm interested in your mock interview. I'm in PST -
   would Tuesday or Thursday evening work? I'm free after 6pm my time."

Provider responds:
  "Tuesday works great! How about 7pm PST (10pm my time)?
   Ready to book? Here's a link: [Book Tuesday 7pm PST]"

Applicant clicks link:
  → Pre-filled booking form with Tuesday 7pm PST
  → One-click confirm + payment

Booking confirmed, conversation continues in same thread.
```

**What makes this work:**

1. **In-message booking links** - Provider can send a pre-configured booking link
2. **Smart time parsing** - System could detect time mentions and offer to create booking
3. **Conversation → Booking continuity** - Same thread, no context lost

---

### When to Recommend Each Model

| Provider Situation | Recommended Model |
|-------------------|-------------------|
| Fixed schedule, knows exact availability | **Instant Book** |
| Variable schedule, needs flexibility | **Request-Based** |
| High demand, wants to screen applicants | **Request-Based** |
| Wants maximum bookings with minimum friction | **Instant Book** |
| New provider, still figuring out schedule | **Request-Based** |
| Offering async services (essay review) | **Either** (no time coordination needed) |

**Default for MVP:** Request-Based (current plan)
**Add Instant Book in Phase 2** when calendar integration is built

---

### Messaging Permissions by Booking State

| State | Applicant Can Message? | Provider Can Message? | Limits |
|-------|----------------------|---------------------|--------|
| **Pre-booking** (no request yet) | ✅ Yes | ✅ Yes (if applicant initiated) | 10/day for free accounts |
| **Booking requested** (pending) | ✅ Yes | ✅ Yes | Unlimited |
| **Booking confirmed** | ✅ Yes | ✅ Yes | Unlimited |
| **Booking completed** | ✅ Yes | ✅ Yes | Unlimited (for follow-up) |
| **Booking cancelled** | ✅ Yes | ✅ Yes | Unlimited (for rebooking) |

**Key insight:** Once any booking interaction exists, messaging is unlimited.

---

### Message Types in Time Coordination

When applicants message about availability, they typically send one of these:

**1. Open-ended availability question**
> "When are you generally available?"

**2. Specific time proposal**
> "Are you free Tuesday at 3pm?"

**3. Constraint-based request**
> "I need to prep before my Dec 15 interview - what's your earliest availability?"

**4. Timezone clarification**
> "I'm in PST - does your availability work for evening sessions in my timezone?"

**Helpful UX additions:**
- Timezone display on both sides
- "Quick reply" buttons for providers: [I'm available then] [Let me check] [Suggest another time]
- Date picker in message composer (for proposing specific times)

---

## Current Documentation State

### What's Already Documented

From `messaging-architecture.md`:
```
Pre-Booking Communication Policy: Allow open messaging before booking

Rules:
- ✅ Can message before booking
- ✅ Applicant can ask questions
- ✅ Provider can clarify scope
- ⚠️ 10 messages/day limit for non-members (spam prevention)
- ⚠️ Unlimited after booking
```

This establishes the philosophy but doesn't specify the **flow**, **UI**, or **permissions** in detail.

### Gaps Identified

1. **No distinction between "inquiry" vs. "booking request"**
2. **Unclear when messaging becomes available** (profile view? service selection?)
3. **No guidance on conversation context** (tied to a service? free-form?)
4. **Provider response expectations for inquiries not defined**
5. **Transition from inquiry to booking not specified**

---

## Industry Research: Pre-Booking Communication Patterns

### Pattern 1: Airbnb - Inquiry System

**How it works:**
- Guest can send "Inquiry" without committing to booking
- Inquiry includes: dates, guest count, message to host
- Host receives and can respond
- Host response rate tracked ("Usually responds within X hours")
- Guest can then "Book" after inquiry OR book directly
- Inquiry messages continue into booking thread

**Pros:**
- Low friction for tentative customers
- Hosts can pre-qualify guests
- Builds trust through conversation

**Cons:**
- Some guests inquire but never book (tire-kickers)
- Hosts complain about "inquiry spam"
- Adds step before revenue

**Key Insight:** Airbnb allows free inquiry because:
- High-value transactions ($200+/night average)
- Stay duration matters (need to coordinate)
- Trust is critical (strangers in your home)

### Pattern 2: Fiverr - "Contact Seller" Before Order

**How it works:**
- Buyer can click "Contact Seller" on any profile
- Opens message composer (no booking context required)
- Seller responds, can send custom offers
- Buyer can then place order
- No formal "inquiry" status - just messages

**Pros:**
- Very low friction
- Allows custom quotes
- Good for complex projects

**Cons:**
- Lots of non-converting inquiries
- Sellers get "tire-kickers"
- No commitment signal

**Key Insight:** Fiverr allows open messaging because:
- Service scopes vary widely
- Custom pricing is common
- Platform is transactional (one-off projects)

### Pattern 3: Thumbtack - "Request a Quote" Model

**How it works:**
- Customer posts a "project" describing what they need
- Pros send quotes/bids
- Customer selects a pro and messages them
- Messaging only opens AFTER expressing intent

**Pros:**
- High-intent messaging (customer is serious)
- Reduces tire-kicker inquiries
- Clear conversion path

**Cons:**
- More friction for simple questions
- Doesn't work well for standardized services
- Customer must define need upfront

**Key Insight:** Thumbtack uses intent-first messaging because:
- Services are custom (home repairs, events)
- Pricing varies significantly
- Need to filter out non-serious inquiries

### Pattern 4: Upwork - Proposal + Chat

**How it works:**
- Client posts job
- Freelancers send proposals (formal application)
- Client can message freelancers after receiving proposal
- OR client can "invite" freelancer to apply and message directly

**Pros:**
- Structured conversation (around a specific job)
- Both parties have context
- Clear intent signal

**Cons:**
- Complex for simple engagements
- Overkill for $50 tasks

### Pattern 5: Wyzant (Tutoring) - Free Messaging with Soft Limits

**How it works:**
- Student can message any tutor from their profile
- First message is free
- Tutor responds
- Student can continue messaging OR book
- No daily limits (but monitors for abuse)

**Pros:**
- Perfect for service marketplaces with relationship potential
- Allows "fit" conversations before commitment
- Tutors can assess student level

**Cons:**
- Some students just want free help via chat
- Tutors might get overwhelmed

**Key Insight:** Wyzant allows open messaging because:
- Fit matters enormously (ongoing relationship)
- Students need to trust tutors before buying
- Questions help tutors tailor their service

---

## Comparison Matrix

| Platform | Pre-Booking Messaging | Requires Intent? | Limits | Best For |
|----------|----------------------|------------------|--------|----------|
| **Airbnb** | Inquiry system | Soft (dates required) | None | High-trust, high-value |
| **Fiverr** | Contact seller (open) | No | None | Custom projects |
| **Thumbtack** | After request posted | Yes (strong) | N/A | Variable pricing |
| **Upwork** | After proposal/invite | Yes (strong) | N/A | Complex projects |
| **Wyzant** | Open messaging | No | Soft monitoring | Relationship services |

---

## CRNA Club Context Analysis

### Why Pre-Booking Messaging Matters Here

1. **High-stakes service:** Applicants are investing in their career - they want to know they're choosing the right mentor

2. **Fit matters:** Not every SRNA is right for every applicant (different programs, ICU backgrounds, communication styles)

3. **Unfamiliar transaction:** Most applicants have never bought mentorship before - they have questions

4. **Premium pricing:** $75-150 per session is significant - applicants want reassurance

5. **Ongoing relationship potential:** One session often leads to more - building rapport early helps

### What Applicants Want to Know Before Booking

Based on typical marketplace behavior:

1. **Availability questions:**
   - "Are you available next week?"
   - "Do you do weekends?"

2. **Scope clarification:**
   - "What exactly is covered in a mock interview?"
   - "How detailed is your essay feedback?"

3. **Fit questions:**
   - "I'm applying to your specific program - can you help with insider tips?"
   - "My GPA is low - do you have experience helping applicants like me?"

4. **Process questions:**
   - "How do you deliver the essay feedback?"
   - "What platform do we use for video calls?"

5. **Personal connection:**
   - "I saw you went to [undergrad]. I'm there now!"
   - General rapport building before commitment

### What Providers Want from Pre-Booking Messages

1. **Context:** Understanding the applicant's situation to prepare better
2. **Screening:** Identifying if the applicant is a good fit for their expertise
3. **Expectations:** Clarifying what they can/can't help with
4. **Scheduling:** Coordinating availability before formal booking

---

## Recommendation: Lightweight Inquiry System

### Philosophy

**Allow easy communication without full chat features.**

- Applicants should feel confident they can ask questions
- But friction should gently push toward booking (where value is delivered)
- Don't build a standalone chat product - build booking-focused messaging

### The Flow

```
┌────────────────────────────────────────────────────────────────┐
│ APPLICANT views Mentor Profile                                  │
│                                                                │
│ [Book Service]  [Message Sarah] ← Primary CTAs                 │
└────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────────┐
│ Message Composer (Modal or Drawer)                              │
│                                                                │
│ "Ask Sarah a question before booking"                          │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Hi Sarah! I'm interested in your [Service Type ▼]        │   │
│ │                                                          │   │
│ │ [Your message here...]                                   │   │
│ │                                                          │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                │
│ Quick questions (click to add):                                │
│ [What's your availability?] [What ICU experience...]           │
│ [Do you offer custom packages?] [More about your program...]   │
│                                                                │
│ [Send Message]                                                 │
│                                                                │
│ ℹ️ Sarah typically responds within 4 hours                     │
└────────────────────────────────────────────────────────────────┘
```

### Key Design Elements

#### 1. Message Button Placement

**On Mentor Profile:**
- Primary CTA: "Book a Service" (leads to booking flow)
- Secondary CTA: "Message [Name]" (opens message composer)
- Position: Both visible in hero section, "Message" is secondary styling

**On Service Cards:**
- Primary CTA: "Book Now"
- No separate message button per service (messages are to the person, not the service)
- But service context can be pre-filled when composing

#### 2. Message Composer Design

**Context-Aware Prompts:**
- Pre-fill dropdown: "I'm interested in your [Service Type]"
- If user came from specific service card, pre-select that service
- Quick question buttons reduce typing friction

**Character Limits:**
- Minimum: 20 characters (prevent empty/spam messages)
- Maximum: 500 characters (encourage brevity, not essays)
- Show character count

**Service Context (Optional):**
- Dropdown to select which service they're asking about
- If not selected, marked as "General inquiry"
- Helps provider understand intent

#### 3. Conversation Thread

**Thread Structure:**
```
┌────────────────────────────────────────────────────────────────┐
│ Conversation with Sarah Chen                                    │
│ Georgetown CRNA '25                                            │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ You (Today, 2:30 PM)                                     │   │
│ │ Hi Sarah! I'm interested in your Mock Interview service. │   │
│ │ I'm applying to Georgetown this cycle and was wondering  │   │
│ │ if you could share what your interview was like?         │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Sarah (Today, 4:15 PM)                                   │   │
│ │ Hey! Yes, I'd be happy to help. Georgetown's interview   │   │
│ │ has two parts - a panel and an MMI. I can walk you       │   │
│ │ through both in a mock session. When were you thinking?  │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ [Reply...]                                               │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                │
│ [Book with Sarah] ← Persistent CTA                             │
└────────────────────────────────────────────────────────────────┘
```

**Key Thread Features:**
- Simple back-and-forth (not real-time chat bubbles)
- Timestamps
- Read receipts (optional, post-MVP)
- **Persistent "Book with [Provider]" CTA** - always visible
- Thread continues into booking if they proceed

#### 4. Permissions & Limits

| User Type | Can Message? | Daily Limit | Notes |
|-----------|--------------|-------------|-------|
| **Logged-out** | No | N/A | Must create free account |
| **Free account** | Yes | 10 messages/day | Encourages booking |
| **Trial member** | Yes | 20 messages/day | Still limited |
| **Paid member** | Yes | Unlimited | Full access |
| **After booking** | Yes | Unlimited | No limits on active booking |

**Rate Limiting Rationale:**
- Prevents spam from free accounts
- 10/day is generous for genuine inquiries (you don't need to message 10 mentors)
- Encourages conversion: "Want unlimited messaging? Start your trial"

**When Limits Are Checked:**
- Only on NEW conversation starts or NEW messages
- Not on continuing existing conversations
- Not on messages within a booking context

#### 5. Provider Experience

**Notification Flow:**
```
New message arrives
    ↓
Email notification: "New message from [Applicant]"
    - First line of message
    - [View & Reply] button
    - [View Applicant's Profile] link (if allowed)
    ↓
In-app notification (badge on Messages nav item)
    ↓
Provider can reply from:
    - Email reply (if implementing)
    - Dashboard "Messages" section
    - Mobile push (future)
```

**Response Time Tracking:**
- Track: Time from message received → first response
- Display on profile: "Usually responds within X hours"
- NOT a hard requirement (unlike booking requests)
- But: Slow responders appear lower in search results

**Provider Message Dashboard:**
```
┌────────────────────────────────────────────────────────────────┐
│ Messages                                                        │
│                                                                │
│ [All] [Unread (3)] [Booking Inquiries] [General]               │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ M. • 2 hours ago • Unread                                │   │
│ │ "Hi! I'm interested in your Mock Interview service..."   │   │
│ │ Service: Mock Interview                                  │   │
│ │ [Reply] [View Full]                                      │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ J. • Yesterday • Read ✓                                  │   │
│ │ "Thank you so much for the quick response! I'll go..."   │   │
│ │ Service: Essay Review                                    │   │
│ │ [Reply] [View Full]                                      │   │
│ └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

#### 6. Transition from Message to Booking

**Scenario 1: Applicant Books After Messaging**
```
Applicant viewing conversation with Sarah
    ↓
Clicks [Book with Sarah]
    ↓
Booking flow opens
    - Pre-selected service (from message context)
    - Message field pre-filled: "Continuing from our conversation..."
    - Or: Link to previous conversation visible
    ↓
Booking submitted
    ↓
Conversation thread continues with booking context
    - New message: "I've submitted a booking request for Mock Interview"
    - Thread shows booking status updates
```

**Scenario 2: Provider Suggests Booking**
```
In conversation, provider types:
"I'd be happy to help! You can book a session here: [Book Mock Interview]"
    ↓
Platform auto-detects booking intent OR
Provider can click "Send Booking Link" button
    ↓
Applicant receives message with embedded booking CTA
    ↓
One click → Booking flow with context preserved
```

**Scenario 3: Messaging Continues Without Booking**
- Totally fine - no forced booking
- Conversation remains in Messages
- Provider can follow up later
- System may send gentle reminders:
  - "You had a conversation with Sarah. Ready to book?"

---

## What NOT to Build

### Avoid These Patterns

1. **Full chat functionality (typing indicators, online status, instant delivery)**
   - Overkill for this use case
   - Creates expectation of instant response
   - Expensive to build/maintain

2. **Mandatory inquiry before booking**
   - Adds friction for confident buyers
   - Many applicants know what they want

3. **Complex inquiry forms (like Thumbtack)**
   - Our services are standardized enough
   - Keep it conversational

4. **Blocking messages if provider hasn't responded**
   - Feels punitive to applicant
   - Provider may be busy but will respond

5. **Requiring message approval before delivery**
   - Kills conversation flow
   - Creates admin burden

6. **Aggressive contact info filtering in pre-booking**
   - Trust the community initially
   - Monitor, don't prevent
   - Can add filters later if needed

---

## Implementation Approach

### MVP (Phase 1)

**Build:**
- Message button on mentor profiles
- Simple message composer with service context
- Basic conversation thread view
- Email notifications for new messages
- Messages section in applicant dashboard
- Messages section in provider dashboard
- Response time tracking (display only, no penalties)
- 10/day limit for free accounts

**Skip for MVP:**
- Real-time updates (page refresh to see new messages)
- Read receipts
- Typing indicators
- Rich text/attachments
- Message templates
- Auto-replies

### Post-MVP (Phase 2)

**Add:**
- Real-time message updates (Supabase subscriptions)
- Read receipts
- "Quick question" templates
- Provider auto-reply when unavailable
- Message search
- Archive/delete conversations
- Block user functionality

### Future (Phase 3)

**Consider:**
- Typing indicators
- Mobile push notifications
- Scheduled messages
- AI-powered suggested replies
- Message translation (if multilingual)

---

## Edge Cases & Rules

### What If: Provider Never Responds?

**Behavior:**
- Message sits in thread unanswered
- No automatic follow-up from platform (MVP)
- Provider's "response time" metric gets worse
- Applicant can still book (booking request is separate)

**Post-MVP Enhancement:**
- If no response in 48 hours, gentle prompt to applicant:
  - "Sarah hasn't responded yet. Try messaging another mentor or book directly."
- Provider nudge after 24h: "You have an unanswered message"

### What If: Applicant Spams Questions?

**Behavior:**
- 10/day limit enforces cap for free accounts
- If hitting limit: "You've reached your daily message limit. Upgrade for unlimited messaging."
- Paid members: No limit, but monitor for abuse

**Abuse Pattern Detection (Post-MVP):**
- Flagging multiple messages to different providers with same content (copy-paste spam)
- High-volume messaging without any bookings
- Admin can review flagged accounts

### What If: Someone Shares Contact Info in Pre-Booking Messages?

**MVP Approach:**
- Allow it (trust-first)
- Log it for monitoring
- No blocking or filtering

**Post-MVP:**
- Light detection (flag phone numbers, email addresses)
- Alert admin for review
- Do NOT block the message
- Handle through community guidelines, not tech

### What If: Applicant Messages Multiple Providers?

**Behavior:**
- Totally fine and expected
- Each conversation is separate
- Providers don't see who else applicant has messaged
- Applicant can compare responses

### What If: Provider Wants to Decline an Inquiry?

**Options:**
- Simply don't respond (no obligation)
- Send polite decline: "Thanks for reaching out! I'm not taking new clients right now."
- No formal "decline" button for messages (unlike booking requests)

### What If: Conversation Gets Inappropriate?

**Applicant or Provider can:**
- Report the conversation (flag button)
- Block the user (prevents future messages)
- Admin reviews and takes action

---

## Database Schema Addition

```sql
-- Conversations table (add context for pre-booking)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id UUID NOT NULL REFERENCES auth.users(id),
  provider_id UUID NOT NULL REFERENCES auth.users(id),
  booking_id UUID REFERENCES bookings(id), -- NULL for pre-booking messages
  service_type TEXT, -- Context: which service they're asking about
  source TEXT, -- 'profile', 'service_card', 'booking_flow'
  status TEXT DEFAULT 'active', -- 'active', 'archived', 'blocked'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_message_at TIMESTAMP,
  applicant_last_read_at TIMESTAMP,
  provider_last_read_at TIMESTAMP,
  UNIQUE(applicant_id, provider_id) -- One conversation per pair
);

-- Messages table (already defined, minor additions)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- 'text', 'booking_link', 'system'
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Message rate limits
CREATE TABLE message_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  message_count INT DEFAULT 0,
  UNIQUE(user_id, date)
);
```

---

## UI Copy Recommendations

### Message Button
- **Label:** "Message [First Name]"
- **Tooltip:** "Ask a question before booking"

### Message Composer
- **Header:** "Ask [First Name] a question"
- **Placeholder:** "Hi [First Name]! I'm interested in..."
- **Service dropdown label:** "What's this about?"
- **Send button:** "Send Message"

### Empty State (Applicant Messages)
- **Title:** "No conversations yet"
- **Body:** "Find a mentor and send them a message to get started."
- **CTA:** "Browse Mentors"

### Empty State (Provider Messages)
- **Title:** "No messages yet"
- **Body:** "When applicants message you, they'll appear here."
- **CTA:** "View My Profile"

### Rate Limit Message
- **Title:** "Daily message limit reached"
- **Body:** "You've sent 10 messages today. Upgrade to a paid membership for unlimited messaging."
- **CTA:** "Upgrade Now"

### Response Time Display
- "Usually responds within 2 hours"
- "Usually responds within 1 day"
- "Response time varies"

---

## Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| % of bookings preceded by message | 20-40% | Not too high (friction) or low (feature unused) |
| Message-to-booking conversion | >30% | Messages should lead to bookings |
| Provider response rate | >80% | Providers should engage |
| Provider response time | <8 hours | Quick enough to not lose applicant |
| Messages per booking | 2-5 avg | Enough to clarify, not endless chat |

---

## Summary: What to Tell the Team

**What we're building:**
A simple messaging system that lets applicants ask providers questions before booking - similar to Airbnb inquiries but simpler.

**Key decisions:**
1. Free-form messaging from mentor profile (no booking intent required)
2. 10 messages/day limit for free accounts
3. Conversations persist and continue into bookings
4. No real-time chat features (page refresh model initially)
5. Trust-first approach (no contact blocking in MVP)

**What it's NOT:**
- Not a full chat system (no typing indicators, online status)
- Not a requirement before booking (optional)
- Not filtered/moderated before delivery

**Timeline:**
- MVP messaging: Part of Week 4 (Messaging System per implementation checklist)
- ~3-5 days development
- Can enhance post-launch based on usage patterns

---

## Open Questions for Discussion

1. **Should we show applicant profile info to providers before they respond?**
   - Pro: Helps provider personalize response
   - Con: Privacy concern
   - Recommendation: Show first name and target programs only (opt-in for more)

2. **Should response time affect search ranking?**
   - Pro: Incentivizes quick responses
   - Con: Punishes busy SRNAs unfairly
   - Recommendation: Soft factor in ranking, not hard penalty

3. **Should we allow file attachments in pre-booking messages?**
   - Pro: Applicants could share essays for preview
   - Con: Complexity, potential for getting free reviews
   - Recommendation: No attachments in MVP, only after booking

4. **Should providers be able to send custom booking offers via message?**
   - Pro: Flexible pricing, custom packages
   - Con: Complexity, potential for circumventing platform
   - Recommendation: Yes in post-MVP (Fiverr "custom offer" model)

---

## Appendix: Competitor Pre-Booking Flows

### Airbnb Inquiry Flow (Visual)
```
Property Page
    ↓
[Check Availability] or [Contact Host]
    ↓
Inquiry Form:
- Check-in / Check-out dates (required)
- Number of guests (required)
- Message to host (optional but encouraged)
    ↓
[Send Inquiry]
    ↓
Host receives notification
Host can: Respond, Pre-approve, Decline
    ↓
Guest can book anytime (with or without response)
```

### Fiverr Contact Flow (Visual)
```
Seller Profile
    ↓
[Contact Me] button
    ↓
Message Composer:
- Subject line (optional)
- Message body
- Attachment (optional)
    ↓
[Send Message]
    ↓
Seller receives notification
Conversation continues in inbox
Seller can send custom offers
```

### Wyzant Request Flow (Visual)
```
Tutor Profile
    ↓
[Contact [Name]] button
    ↓
Message Form:
- Subject (auto: which subject)
- Message
- Preferred availability
    ↓
[Send Request]
    ↓
Tutor responds
Student can book through separate flow
```

---

**End of Document**
