# ShareTribe & Marketplace Architecture Research Report

**Date:** December 7, 2025
**Researcher:** Marketplace Architecture Researcher
**Purpose:** Research best practices for building the CRNA Club two-sided marketplace

---

## Executive Summary

This report synthesizes research from ShareTribe (leading marketplace platform) and marketplace industry best practices to inform the CRNA Club's marketplace where SRNAs (students) offer services like mock interviews, essay reviews, and coaching to Applicants (ICU nurses).

**Key Takeaways:**
- Service marketplaces are fundamentally different from product marketplaces due to their high-touch, relationship-driven nature
- The chicken-and-egg problem (cold start) is solvable through strategic supply-side seeding
- Standard take rates for service marketplaces range from 10-30%, with 12.4% being the average for successful ShareTribe customers
- Trust signals (verification, reviews, guarantees) are critical for high-stakes services
- MVP should focus on core transaction flow before adding advanced features

---

## 1. ShareTribe's Core Marketplace Model

### Platform Overview

ShareTribe is a marketplace builder platform that provides complete infrastructure for building two-sided marketplaces. Their platform has helped launch thousands of marketplaces and represents industry best practices.

**Core Value Proposition:**
- Complete marketplace infrastructure out-of-the-box
- Headless architecture for full customization
- No-code marketplace builder (Console)
- Comprehensive APIs for custom development
- Built-in payment processing (Stripe integration)
- Pricing: $39/month for development, $99/month for live marketplaces

### Standard Marketplace Entities

ShareTribe's architecture is built around these core entities:

1. **Users** (two types)
   - Providers (supply side)
   - Customers (demand side)
   - Can have distinct user flows and permissions

2. **Listings**
   - Services or products offered by providers
   - Can have categories, custom fields, pricing
   - Support for availability/calendar for services

3. **Transactions**
   - Interaction between customer and provider from start to finish
   - Includes messaging, payment, reviews
   - Configurable transaction processes (booking, purchase, negotiation)

4. **Reviews**
   - Double-blind review system (standard)
   - Both parties review each other
   - Published only after both submit or review period ends

5. **Messages**
   - Built-in messaging system
   - Notifications via email
   - Prevents external communication (reduces disintermediation)

### Standard Transaction Flows

ShareTribe supports multiple transaction process types:

#### Calendar Booking (for services)
1. Customer browses listings
2. Customer selects date/time from provider's availability
3. Customer books and pays
4. Provider accepts or rejects
5. Service is delivered at scheduled time
6. Both parties leave reviews
7. Payment released to provider

**Use Case:** Video calls, coaching sessions, live interviews

#### Purchase Flow (for async services)
1. Customer browses listings
2. Customer purchases instantly
3. Provider fulfills asynchronously
4. Customer confirms completion
5. Reviews exchanged
6. Payment released

**Use Case:** Essay reviews, resume feedback, document analysis

#### Free Messaging (for quotes/negotiation)
1. Customer sends inquiry
2. Provider responds with quote
3. Negotiation happens on-platform
4. Transaction completed (payment happens later or off-platform)

**Use Case:** Custom services, initial consultations

#### Reverse Flow (customer creates request)
1. Customer posts what they need
2. Providers submit offers/bids
3. Customer accepts best offer
4. Transaction proceeds

**Use Case:** Not typically recommended for service marketplaces due to complexity

### Key ShareTribe Features for Service Marketplaces

**User Types & Access Control:**
- Define distinct user types (Provider vs Customer)
- Different signup flows and permissions
- Can restrict listing creation to providers only
- User fields customization

**Listing Customization:**
- Categories and subcategories
- Custom listing fields (searchable)
- Price configuration
- Availability/calendar settings
- Images and descriptions

**Search & Discovery:**
- Keyword search
- Location-based search
- Custom filters based on listing fields
- Category browsing
- Sort options (price, rating, recency)

**Trust & Safety:**
- Email verification (built-in)
- Stripe KYC for providers
- Payment hold until transaction complete
- Double-blind reviews
- Content moderation capabilities

**Payment Processing:**
- Stripe integration
- Holds customer payment in escrow
- Commission automatically calculated
- Releases payment on completion
- Supports various commission structures

---

## 2. Best Practices from ShareTribe Blog & Marketplace Research

### Marketplace Types & Service Marketplace Specifics

**Service Marketplace Characteristics:**
- **High-touch:** Relationship between provider and customer matters
- **Non-commoditized:** Services are personalized, not standardized
- **Less overlap:** Usually distinct supply and demand sides (unlike Etsy where buyers are sellers)
- **Complex procurement:** Longer decision process than product purchases
- **Trust-critical:** Customers need confidence in provider expertise

**Key Insight:** On service marketplaces, providers and customers need different user experiences. There's usually less overlap between supply and demand than on product/rental marketplaces.

### Finding the Right Niche

**ShareTribe Recommendation:** The opportunity is in finding a niche where existing solutions aren't hitting the mark. Start small - instead of competing with Upwork on everything, build the best experience for a specific underserved niche.

**CRNA Marketplace Advantage:**
- Highly specific niche (ICU nurses → CRNA school)
- No direct competitor
- Built-in audience (existing CRNA Club members)
- Trust pre-established through community

### Matching Experience Design

Building a great matching experience is critical for marketplace value:

**Categories:**
- Organize services into clear categories
- Use subcategories for specificity
- Make browsing intuitive

**Listing Fields:**
- Collect specific provider information
- Make key attributes searchable/filterable
- Display credentials prominently

**Search Configuration:**
- Support both keyword and category search
- Add filters for price, availability, provider attributes
- Consider location if relevant (for timezone matching)

**Provider Discovery:**
- Prominent search bar on landing page
- Featured providers
- Sort by rating, price, or recency
- Filter by service type, expertise, availability

### Booking Flow Design Considerations

**Three Key Dimensions:**
1. **Time:** When does service happen? (scheduled vs async)
2. **Location:** Where? (virtual vs in-person)
3. **Price Formation:** How is price set? (fixed vs negotiated)

**Packaged vs Negotiated Services:**

**Packaged Services (Recommended):**
- Provider sets fixed price
- Service clearly defined
- Customer books instantly
- Better customer experience (less friction)
- Easier to compare providers
- Prevents disintermediation

**Negotiated Services:**
- More back-and-forth required
- Custom quotes
- Slower transaction
- Higher risk of going off-platform
- Only use if service truly requires customization

**Key Principle:** The less back and forth between customer and provider, the better. Package services when possible.

### Scheduling for Service Marketplaces

**Dynamic Scheduling System:**
- Providers indicate availability accurately
- Real-time updates
- Integration with external calendars (Google Calendar, etc.)
- Prevent double-bookings
- First-come, first-served principle
- Time zone handling

**Best Practice:** Give providers tools to manage availability themselves without admin intervention.

---

## 3. Two-Sided Marketplace Launch Strategy

### The Chicken-and-Egg Problem Explained

The chicken-and-egg problem: Suppliers won't join without customers, customers won't use a platform without suppliers.

**Critical Truth:** "This is often called the 'cold-start' problem, and it's often the toughest hurdle for founders of marketplaces. Indeed, most marketplaces never get past this stage."

### Solving the Cold Start Problem

#### Strategy 1: Focus on Supply Side First (PRIMARY)

**Why:** Providers have bigger incentive to join (revenue source) than customers (nice-to-have).

**How to Apply to CRNA Club:**
- Recruit initial SRNA providers before opening to customers
- Offer incentives: lower commission during beta, featured placement
- Leverage existing community: identify helpful SRNAs already answering questions
- Start with 10-20 quality providers before promoting to applicants

**Quote from Research:** "In almost all cases, it makes sense to start building a marketplace's audience from the supply side. Providers typically have a bigger incentive to join."

#### Strategy 2: Start in a Really Small Niche

**Why:** Easier to dominate a micro-niche than compete broadly.

**How to Apply to CRNA Club:**
- Phase 1: Only mock interviews (single service type)
- Phase 1: Only SRNAs from top 10 programs
- Phase 1: Only for members applying in next cycle
- Expand gradually based on success

**Quote:** "By far the most successful marketplaces out there have started out by focusing on a really, really small niche."

#### Strategy 3: Target Overlapping Markets

**Why:** If buyers and sellers are the same community, you only need to recruit one group.

**How to Apply to CRNA Club:**
- SRNAs were recently applicants themselves
- They're already in the community
- They understand the buyer's pain points
- Lower CAC (customer acquisition cost)

**Example:** Etsy succeeded because craft makers also buy from other craft makers.

#### Strategy 4: Subsidize the Weaker Side

**Why:** Rebalance supply/demand by providing incentives.

**How to Apply to CRNA Club:**
- Lower commission for first 3 months
- Bonus payments for early providers
- Free premium features for providers
- Promotion in newsletter/community

#### Strategy 5: Build a Product First, Then Marketplace

**Why:** Establish value before opening platform.

**How to Apply to CRNA Club:**
- Already done! The trackers, programs database, learning library = product
- Marketplace is layer on top of existing value
- Reduces risk significantly

**Examples:** Salesforce built CRM before marketplace, Amazon was retailer before marketplace

#### Strategy 6: Manual Operations ("Fake It Till You Make It")

**Why:** Manufacture excellent initial transactions manually.

**How to Apply to CRNA Club:**
- Admin manually matches first requests to providers
- Quality-check initial transactions
- Ensure first 10-20 bookings are exceptional
- Builds reviews and trust

**Example:** Zappos manually fulfilled orders in early days by going to shoe stores.

#### Strategy 7: Make It Frictionless for Providers

**Why:** Lower barriers increase signup.

**How to Apply to CRNA Club:**
- No upfront fees
- No subscription cost for providers
- Quick onboarding (< 5 minutes)
- Payment setup can happen after first booking
- Commission-only model (only pay when you earn)

**Quote:** "Don't charge a subscription or order fee for suppliers, and don't ask them to provide an upfront commitment."

### Growth Phases

**Phase 1: Get 10 Happy Users**
- Focus: Quality over quantity
- Goal: Prove value to both sides
- Method: Manual curation, personal outreach
- Metrics: Customer satisfaction, repeat bookings

**Phase 2: Get 100 Happy Users**
- Focus: Refine flows based on feedback
- Goal: Establish patterns
- Method: Referrals, community promotion
- Metrics: NPS, liquidity (match rate)

**Phase 3: Get 1000+ Raving Users**
- Focus: Scale what works
- Goal: Product-market fit
- Method: Marketing, SEO, content
- Metrics: GMV, take rate, retention

**Quote:** "While many entrepreneurs think about complex strategies like SEO, content marketing, and viral marketing, this should be the roof of your strategy, not the foundation."

### Launch Milestones

**Before Launching:**
1. Problem-solution fit validated
2. 10-20 quality providers onboarded
3. Services clearly defined and priced
4. Transaction flow tested
5. Payment processing configured
6. Review system in place

**Minimum Viable Marketplace Features:**
1. Provider profiles with verification
2. Service listings with clear pricing
3. Booking/request flow
4. Payment processing
5. Messaging system
6. Review system
7. Provider availability calendar (for live services)

**Can Be Added Later:**
1. Advanced search filters
2. Provider analytics dashboard
3. Customer support chat
4. Automated recommendations
5. Bulk booking/packages
6. Subscription options
7. Gift certificates

---

## 4. Marketplace Metrics & Economics

### Key Performance Indicators (KPIs)

#### Tier 1: Financial Metrics

**Gross Merchandise Value (GMV):**
- Total value of all transactions
- Calculated before fees/expenses
- The "real top line" - what customers spend
- Example: If 10 mock interviews at $100 each = $1,000 GMV

**Take Rate:**
- Percentage of GMV kept as revenue
- Commission charged on transactions
- Formula: Revenue / GMV
- Example: 20% take rate on $1,000 GMV = $200 revenue

**Net Revenue:**
- GMV × Take Rate - Operating Costs
- Actual money marketplace keeps
- Must cover platform costs, support, payment processing

**Contribution Margin:**
- Revenue minus variable costs
- CM1: After payment processing, customer service costs
- CM2: After sales & marketing costs
- Key profitability metric

#### Tier 2: Unit Economics

**Customer Acquisition Cost (CAC):**
- Cost to acquire one customer (or provider)
- Must track both buyer CAC and seller CAC
- Includes marketing, sales, onboarding costs

**Lifetime Value (LTV):**
- Total revenue from a customer over their lifetime
- Repeat purchases are key
- Formula: Avg transaction × Transactions per year × Years active × Take rate

**LTV:CAC Ratio:**
- LTV divided by CAC
- Healthy ratio: > 3:1
- If ratio < 3, acquisition costs too high
- If ratio > 5, potentially under-investing in growth

**Net Revenue Retention (NRR):**
- Revenue retention from existing customers
- Factors in upgrades, downgrades, churn
- Target: > 100% (customers spend more over time)

#### Tier 3: Marketplace Health

**Liquidity:**
- How easily buyers and sellers find each other
- Match rate: % of searches resulting in transaction
- Time to first transaction
- Provider utilization rate

**Repeat Purchase Rate:**
- % of customers who book more than once
- Strong indicator of product-market fit
- Service marketplaces: 40-60% is healthy
- Goal: Build relationships, not one-off transactions

**Marketplace Concentration:**
- Distribution of transactions across providers
- Risk: If top 20% of providers = 80% of revenue
- Healthy: Fragmented supply with many active providers
- Monitor: No single provider should be > 10% of GMV

**Monogamous Transactions:**
- % of repeat bookings between same buyer-seller pair
- Too high = risk of disintermediation
- Indicates users might go direct
- Benchmark: < 30% is healthy

**GMV Retention:**
- How much GMV retained from period to period
- Cohort analysis: Does Jan 2024 cohort still transact in Jan 2025?
- Measures long-term marketplace health

#### Tier 4: Operational Metrics

**Time to First Transaction:**
- Days from provider signup to first booking
- Days from customer signup to first purchase
- Faster = better liquidity

**Provider Response Time:**
- How quickly providers respond to inquiries
- Critical for booking conversion
- Display on profiles: "Usually responds within 2 hours"

**Booking Conversion Rate:**
- % of service views → bookings
- % of inquiries → completed transactions
- Optimize through better matching, trust signals

**Review Rate:**
- % of transactions that get reviewed
- Target: > 70%
- Reviews build trust for next transactions

**Provider Churn:**
- % of providers who stop offering services
- High churn = supply problem
- Track reasons: lack of bookings, better opportunities, time constraints

### Take Rate Strategy

#### Industry Benchmarks

**Average Take Rates by Marketplace Type:**
- Service marketplaces: 10-30%
- Successful ShareTribe customers: 12.4% average
- Most common: 10%
- Uber, Lyft, Fiverr: 20-30%
- Airbnb: 10% from hosts + 3% from guests
- Etsy: 6.5%
- Upwork: 10-20% sliding scale

#### Factors Affecting Take Rate

**Can Charge Higher (20-30%):**
- High curation/quality control
- Extensive vetting
- Small provider pool (exclusive)
- High-value services
- Strong trust/safety guarantees
- Payment protection
- Example: Toptal charges 20-40% for "top 3%" talent

**Must Charge Lower (10-15%):**
- Open marketplace (anyone can join)
- Low-margin services
- High competition
- Commoditized offerings
- Minimal vetting
- Example: Thumbtack, TaskRabbit ~15%

#### Commission Structure Options

**1. Flat Percentage (Recommended for MVP):**
- Same % on all transactions
- Simple to understand
- Transparent
- Easy to implement
- Example: 20% on all bookings

**2. Tiered by Transaction Value:**
- Higher % on low-value transactions
- Lower % on high-value transactions
- Example: 25% under $100, 20% $100-250, 15% over $250
- Logic: Small transactions need more support relative to value

**3. Tiered by Provider Performance:**
- Lower commission for top performers
- Incentivizes quality and volume
- Example: 20% base, 15% after 10 bookings, 12% after 50 bookings
- Retention strategy

**4. Category-Based:**
- Different rates for different service types
- Reflects varying costs/complexity
- Example: 15% for essay reviews, 25% for live coaching
- More complex to manage

**5. Dual-Sided (Charge Both Parties):**
- Provider pays X%, customer pays Y%
- Total take rate = X + Y
- Can feel like hidden fees to customers
- Example: Airbnb model (host + guest fees)

#### Pricing Best Practices

**Transparency is Critical:**
- Clearly communicate commission to providers
- Show total price to customers upfront
- No hidden fees
- Builds trust

**Start Low, Scale Up (Carefully):**
- Launch at lower commission (15%) to attract providers
- Announce it's promotional rate from day one
- Increase gradually as value increases
- Risk: Hard to raise rates after launch

**Value-Based Pricing:**
- Commission should reflect value provided
- High curation = higher commission justified
- Basic directory = lower commission
- Add features to justify rate increases

**Consider Marginal Costs:**
- If providers already have thin margins, can't take large cut
- SRNAs are students with free time = high margin (their time cost is low)
- Can support 20-30% commission

### Recommended Take Rate for CRNA Club

**20-25% Commission (Provider-Side Only)**

**Rationale:**
- Higher than industry average (12.4%) but justified by:
  - High curation (approved SRNAs only)
  - Verification (school enrollment confirmed)
  - Built-in audience (don't need to market)
  - Trust/safety (reviews, guarantees)
  - High-stakes services (career impact = willingness to pay)
- Lower than Uber/Fiverr (20-30%) because:
  - Niche market with limited provider pool
  - Want to attract SRNAs who have other opportunities
  - Community goodwill matters

**Implementation:**
- Charge providers 20% on all transactions
- Customers pay listed price (no additional fee)
- Transparent: "CRNA Club takes 20% to maintain platform"
- Beta pricing: 15% for first 20 providers for 3 months
- Review after 100 transactions

---

## 5. Trust & Safety Patterns

### Identity Verification

**Email Verification (Essential):**
- Verify email on signup
- Ensures notifications reach users
- ShareTribe includes by default

**SRNA Verification (Critical for CRNA Club):**
- Confirm student enrollment
- Require .edu email address
- Upload acceptance letter or student ID
- Manual admin review
- Display "Verified SRNA" badge

**Stripe KYC (Payment Verification):**
- Automatic when provider connects Stripe
- Verifies identity for payments
- Required by law
- Conducted by Stripe, not marketplace

**Provider Credentials:**
- CRNA program name
- Program year (1st, 2nd, 3rd year)
- Undergraduate school
- ICU background (optional showcase)

### Reviews and Ratings System

**Double-Blind Reviews (Industry Standard):**
- Both parties review each other
- Reviews hidden until both submit OR review period expires
- Prevents feedback extortion ("give me 5 stars or I'll give you 1 star")
- ShareTribe implements this by default

**Rating Components:**
1. **Star Rating:** 1-5 stars (required)
2. **Written Review:** Text feedback (optional but encouraged)
3. **Service-Specific Questions:** (optional)
   - "Was the mentor prepared?"
   - "Did you receive actionable feedback?"
   - "Would you book again?"

**Review Display:**
- Average rating prominently on profile
- Distribution chart (X reviews at 5 stars, Y at 4 stars, etc.)
- Recent reviews first
- Provider can respond to reviews
- No deleting bad reviews (authenticity)

**Review Incentives:**
- Can't book again until previous booking reviewed
- Gamification points for leaving reviews
- Email reminder 24 hours after service completion
- Another reminder 7 days later if not completed

**Target Review Rate:** 70%+ of transactions should get reviewed

### Payment Protection

**Escrow System (Essential):**
- Customer pays upfront
- Payment held by Stripe
- Released to provider after service delivery
- Protects both parties

**For Live Services (e.g., Mock Interview):**
- Payment held until scheduled session completes
- Auto-release 24 hours after session time
- Customer can dispute within 24 hours

**For Async Services (e.g., Essay Review):**
- Payment held until customer confirms receipt
- Auto-release after 7 days if no response
- Customer can request revision

**Refund Policy (Define Clearly):**
- Full refund if provider cancels < 24 hours before
- Partial refund if customer cancels > 48 hours before
- No refund if customer no-shows
- Dispute resolution process for issues

### Guarantees and Policies

**Quality Guarantee:**
- "If you're not satisfied, we'll make it right"
- Process: Contact support within 48 hours
- Options: Refund or rebook with different provider
- Builds customer confidence

**Provider Standards:**
- All SRNAs verified
- Minimum rating threshold (providers below 4.0 stars reviewed)
- Response time expectations (reply to inquiries within 24 hours)
- Cancellation limits (max 2 cancellations per month)

**Customer Protection:**
- Secure payment processing
- Privacy protection (no sharing contact info)
- Dispute resolution process
- Support access (email, chat during business hours)

### Content Moderation

**Automated Filters:**
- Block email addresses in messages
- Block phone numbers in messages
- Flag URLs (allow only in certain contexts)
- Detect scam patterns

**Manual Moderation:**
- Admin review of reported content
- Review flagged messages
- Investigate user reports
- Ban users who violate terms

**Communication Monitoring:**
- Users should know platform may monitor messages
- Prevents sharing contact info
- Identifies attempts to go off-platform
- Balances privacy with safety

**Study Finding:** "54% of users who detected a counterfeit item would be unlikely to return to the site" - trust is fragile

### Dispute Resolution

**Process:**
1. Customer or provider initiates dispute
2. Both parties provide information
3. Admin reviews evidence (messages, service details)
4. Decision within 48-72 hours
5. Resolution: refund, partial refund, or no action

**Common Disputes:**
- Provider no-show or late
- Service quality below expectations
- Customer provided incomplete information
- Miscommunication about service scope

**Prevention:**
- Clear service descriptions
- Upfront expectations setting
- Message templates for common issues
- FAQ for both providers and customers

---

## 6. Preventing Disintermediation (Platform Leakage)

### What is Disintermediation?

"Disintermediation is a backdooring process where the buyer and seller complete the transaction outside the platform to avoid paying any transaction/service fee."

**Why It Matters:** If users go direct after first transaction, marketplace loses all future revenue from that relationship.

**Risk Level for Service Marketplaces:** HIGH - longer relationships, repeated interactions make it easier to go direct.

### Prevention Strategies

#### Strategy 1: Provide Irreplaceable Value (MOST IMPORTANT)

**Principle:** "You only have two options: increase the value to users such that the value exceeds the fees, or lower the fees."

**How to Add Value for Providers:**
- Built-in audience (don't have to find customers themselves)
- Payment processing (don't chase invoices)
- Calendar management (booking automation)
- Reputation building (reviews displayed)
- Marketing/promotion (featured providers, newsletter highlights)
- Administrative tools (earnings tracking, tax reports)
- Support (customer service, dispute resolution)

**How to Add Value for Customers:**
- Quality assurance (verified providers only)
- Trust/safety (payment protection, reviews)
- Discovery (find right provider easily)
- Convenience (book in 2 clicks)
- Support (help if issues arise)
- History (track all bookings in one place)

**CRNA Club Advantage:**
- Providers want to stay engaged with community (not just transactions)
- Customers are paying for membership anyway (marketplace is added value)
- Relationship goes beyond marketplace (forums, events, content)

#### Strategy 2: Build Trust Through Reputation Systems

**Provider Incentive:**
- Reviews only appear on platform
- Going direct = losing social proof
- New customers won't find them without platform presence
- Reputation is portable within platform

**Customer Incentive:**
- Want providers with good reviews
- Reviews only valid on platform
- Going direct = no review protection

**Example:** "Airbnb hosts use reviews as a vetting mechanism and might only accept bookings from people with positive reviews. If the customer wants to build their reputation as a trusted guest, they need to use Airbnb's booking system."

#### Strategy 3: Restrict Direct Contact (CAREFULLY)

**Technical Restrictions:**
- Filter out email addresses from messages
- Block phone numbers in messages
- Delay sharing contact info until after transaction
- Use platform messaging system

**Risks:**
- Can frustrate users
- May harm user experience
- Only implement if disintermediation is proven problem

**Recommendation for CRNA Club:**
- Start open (don't restrict)
- Monitor for patterns
- Add restrictions only if needed
- Community goodwill is valuable - don't damage it prematurely

#### Strategy 4: Lower Transaction Friction

**Principle:** "Lowering transaction costs through enabling Instant Bookable reduces the risk of disintermediation."

**Implementation:**
- One-click booking (no back-and-forth)
- Instant confirmation
- Calendar integration
- Automated reminders
- Easy rebooking of same provider

**Why It Works:** If booking on platform is easier than coordinating directly, users stay on platform.

#### Strategy 5: Offer Provider Tools & Services

**Examples:**
- Analytics dashboard (earnings, bookings, ratings over time)
- Marketing tools (promote yourself, A/B test service descriptions)
- Scheduling integrations (sync Google Calendar)
- Tax reporting (1099 generation)
- Loyalty programs (bonus for high volume)

**CRNA Club Opportunity:**
- Job board access (internal tasks for cash/points)
- Community visibility (reputation in forums)
- Networking with other SRNAs
- Professional development resources

#### Strategy 6: Commoditize the Service

**Principle:** Standardized, packaged services are harder to replicate off-platform.

**Implementation:**
- Fixed service types ("30-minute mock interview" not "interview help")
- Standard pricing tiers
- Instant booking (no negotiation)
- Clear deliverables

**Example:** "Remoovaz uses standardised fees so that payments can be done at the booking stage. This removes the need for a quotation or negotiation process."

**CRNA Club Application:**
- "Mock Interview - 45 minutes - $75" (packaged)
- NOT "Interview help - contact for pricing" (negotiated)

#### Strategy 7: Delay Provider-Customer Connection

**Principle:** The later you introduce direct contact, the less time to build off-platform relationship.

**Examples:**
- Uber: Only share driver info at pickup time
- Taskrabbit: Assign provider 2-4 hours before service
- Marketplace: Use platform messaging only until transaction complete

**For CRNA Club:**
- Video call link provided 1 hour before session
- Document exchange through platform
- Messaging only through platform initially
- After 3 successful bookings, allow more flexibility (they've proven loyalty)

### Risk Factors Affecting Disintermediation

**Lower Risk (CRNA Club Benefits):**
- Real-time need (last-minute mock interview before actual interview)
- High trust requirement (career-stakes service)
- Small transactions (not worth coordination overhead for $50-100 bookings)
- Payment hassle (easier to click "book again" than Venmo/PayPal)
- Community integration (losing access to other platform benefits)

**Higher Risk (CRNA Club Challenges):**
- Ongoing relationships (essay review → mock interview → coaching)
- Known quality (after first booking, no need for discovery)
- Limited provider pool (might want specific provider again)

### Monitoring Disintermediation

**Warning Signs:**
- Providers with initial bookings but no repeats
- Customers with single booking then inactive
- Messages requesting "contact outside platform"
- Declining repeat booking rate
- Providers canceling bookings (moving to direct)

**Metrics to Track:**
- Repeat booking rate (target: 40-60%)
- Monogamous transaction rate (< 30%)
- Provider retention after first booking (> 70%)
- Message filter hits (email/phone sharing attempts)

### Recommended Approach for CRNA Club

**Phase 1 (Launch - First 100 Transactions):**
- Trust the community
- No restrictions on contact
- Focus on value delivery
- Monitor for issues
- Build relationships

**Phase 2 (After Product-Market Fit):**
- Analyze disintermediation patterns
- Add light restrictions if needed (email/phone filtering)
- Increase platform value (more features)
- Provider incentives (lower commission for loyalty)

**Phase 3 (Scale):**
- Reputation portability (providers can't leave without losing reviews)
- Provider subscription tier (pay $X/month for lower commission)
- Advanced analytics for providers
- Marketplace-exclusive benefits

**Key Principle:** "Both proactive and reactive approaches have strengths and weaknesses. A single approach may not be effective in preventing disintermediation. Therefore, marketplaces must implement a combination of the two approaches."

---

## 7. Provider Onboarding Best Practices

### Streamlined Onboarding Flow

**Goal:** Get SRNAs from signup to first booking as fast as possible.

**Key Metrics:**
- Time to first listing: < 10 minutes
- Time to first booking: < 7 days
- Conversion to verified seller: > 80%
- Onboarding completion rate: > 90%

### Onboarding Steps

**Step 1: Application (2-3 minutes)**
- Name, email, profile photo
- CRNA program name
- Program year
- Brief bio (50-100 words)
- .edu email verification

**Step 2: Verification (Admin Review - 24-48 hours)**
- Admin confirms enrollment
- Reviews profile quality
- Checks for red flags
- Approves or requests more info

**Step 3: Create First Service (3-5 minutes)**
- Select service type from template
- Customize description
- Set price (suggested ranges provided)
- Define deliverables
- Mark live or async

**Step 4: Set Availability (2 minutes for live services)**
- Connect calendar OR
- Mark general availability
- Set timezone
- Define buffer times

**Step 5: Payment Setup (5 minutes)**
- Connect Stripe account
- Can defer until after first booking
- Required before first payout

**Total Time: ~15 minutes active time, 24-48 hours approval time**

### Onboarding Best Practices

**Quick Wins:**
- Show progress bar (Step 1 of 5)
- Save progress automatically
- Allow skipping optional steps
- Celebrate completion ("You're live!")

**Reduce Complexity:**
- Service templates (pre-filled descriptions)
- Suggested pricing
- Example profiles
- Help text / tooltips

**Distinct Provider Flow:**
- Separate onboarding for providers vs customers
- Different checklist
- Different welcome email
- Different dashboard

**Trust-First UX:**
- Verification badge prominent
- Onboarding checklist visible
- Payout transparency (when you'll get paid)
- Set expectations (response time required, etc.)

**Automation:**
- Email verification automatic
- Stripe KYC automatic
- Profile approval can be semi-automated (flag for review if issues)
- Payment processing automatic

### Post-Onboarding Support

**First Booking Support:**
- Email when profile approved
- Tips for getting first booking
- Featured in "New Providers" section
- Admin can create test booking

**Education:**
- Welcome video (how marketplace works)
- FAQ for providers
- Example messages to customers
- Best practices guide

**Ongoing:**
- Weekly digest (earnings, bookings, reviews)
- Performance tips (optimize pricing, descriptions)
- Feature updates
- Community spotlights

### Quality Assurance

**Application Review Criteria:**
- Enrolled in accredited CRNA program
- Professional profile photo
- Well-written bio (grammar, completeness)
- Appropriate service offerings
- Reasonable pricing

**Rejection Reasons:**
- Can't verify enrollment
- Inappropriate content
- Unclear service offerings
- Too-low or too-high pricing (outliers)
- Poor communication skills

**Feedback Loop:**
- If rejected, provide clear reason
- Allow reapplication after fixes
- Offer help (email support)

**Ongoing Quality:**
- Monitor ratings (below 4.0 = review)
- Track response times (must respond < 24 hours)
- Review complaints
- Quarterly check-ins with providers

---

## 8. Quality Control & Vetting

### Provider Vetting Process

**Initial Vetting (Before Approval):**

**Document Verification:**
- Acceptance letter to CRNA program OR
- Student ID with program name OR
- .edu email confirmation + LinkedIn verification

**Profile Quality Check:**
- Professional photo (clear face, appropriate)
- Complete bio (minimum 50 words)
- No typos or grammar issues
- Appropriate tone (professional but friendly)

**Service Definition Review:**
- Clear service descriptions
- Appropriate pricing (within normal ranges)
- Realistic deliverables
- No prohibited services

**Background Research (Light):**
- Google name + program (public presence)
- LinkedIn profile (verify story)
- Red flags (news, issues)

**Manual Admin Review:**
- 10-15 minutes per application
- Approve, reject, or request more info
- Target: 24-48 hour turnaround

### Ongoing Quality Assurance

**Performance Monitoring:**

**Rating Threshold:**
- Providers below 4.0 stars = reviewed
- Below 3.5 stars = suspended pending review
- Single 1-star review = admin investigates

**Response Time:**
- Must respond to inquiries within 24 hours
- Tracked automatically
- Below 80% on-time = warning

**Cancellation Rate:**
- Max 2 provider-initiated cancellations per month
- 3+ cancellations = review
- Pattern of cancellations = suspension

**Completion Rate:**
- % of bookings completed successfully
- Target: > 95%
- Track no-shows, cancellations

**Customer Complaints:**
- Track all reported issues
- 3+ complaints = review
- Pattern of similar complaints = action

**Quality Metrics Dashboard:**
- Shows all providers
- Sort by rating, bookings, complaints
- Flag providers needing attention
- Automated alerts for issues

### Quality Standards

**Define Clear Standards:**
- Response time: < 24 hours
- Professionalism: friendly, helpful, no inappropriate behavior
- Preparation: be ready for scheduled sessions
- Deliverables: meet stated service promises
- Communication: clear, timely, respectful

**Communicate Standards:**
- In provider onboarding
- In provider handbook/FAQ
- In email reminders
- In provider dashboard

**Enforce Consistently:**
- Warning for first minor violation
- Suspension for major violation or repeat issues
- Permanent removal for serious violations (harassment, fraud)

### Service Quality Assurance

**Service Description Requirements:**
- Minimum 100 words
- Clear deliverables
- Expected duration or turnaround time
- What customer should prepare/bring
- What customer will receive

**Pricing Guidelines:**
- Suggested price ranges by service type
- Can set own price within reason
- Flag outliers for review
- Market data shown (average for similar services)

**Service Templates (Recommended):**
- Pre-written descriptions for common services
- Providers can customize
- Ensures quality baseline
- Reduces onboarding friction

**Example Template - Mock Interview:**
```
Title: Mock Interview - [Your Program Specialty]

Description:
A 45-minute mock interview session designed to prepare you for your CRNA program interview. I'll ask common questions based on my own interview experience at [Program Name], provide real-time feedback, and share tips for success.

What's Included:
- 45-minute video call
- 15-20 common interview questions
- Real-time feedback on your responses
- Post-interview summary with strengths and areas to improve
- Email follow-up with additional resources

What to Prepare:
- Resume/CV
- List of programs you're applying to
- Any specific questions you want to practice

Duration: 45 minutes live + 15 minutes prep
Delivery: Within 24 hours of scheduled session

Price: $75-100 (suggested)
```

### Customer Protection

**Money-Back Guarantee:**
- If service not delivered as described
- If provider no-shows
- If quality significantly below expectations
- Process: Contact support within 48 hours of service

**Dispute Resolution:**
- Customer submits complaint
- Provider has 24 hours to respond
- Admin reviews messages, service details, both perspectives
- Decision within 72 hours
- Options: Full refund, partial refund, rebook with different provider, no action

**Rating Authenticity:**
- Verified purchase required to review
- One review per booking
- Can't delete bad reviews (authentic)
- Provider can respond publicly
- Admin can remove spam/abuse reviews only

---

## 9. Marketplace Launch Checklist

### Pre-Launch (Phase 0)

**Technical:**
- [ ] Marketplace pages designed and built
- [ ] Booking flow tested end-to-end
- [ ] Payment processing integrated (Stripe test mode)
- [ ] Review system implemented
- [ ] Messaging system functional
- [ ] Email notifications configured
- [ ] Calendar integration for live services
- [ ] Admin dashboard for managing providers/bookings

**Business:**
- [ ] Take rate decided (20-25% recommended)
- [ ] Provider agreement/terms drafted
- [ ] Customer terms of service
- [ ] Refund policy defined
- [ ] Provider onboarding flow documented
- [ ] Support email/process established
- [ ] FAQ created (provider and customer versions)

**Content:**
- [ ] Service templates created (5-7 types)
- [ ] Provider handbook written
- [ ] Customer guide created
- [ ] Landing page copy
- [ ] Email templates (welcome, booking confirmation, reminders, etc.)

### Soft Launch (Phase 1) - Goal: 10-20 Providers, 50 Transactions

**Provider Recruitment (Weeks 1-2):**
- [ ] Identify 20-30 potential SRNA providers from community
- [ ] Personal outreach (email/DM)
- [ ] Offer beta incentives (15% commission vs 20%)
- [ ] Onboard first 10 providers
- [ ] Create profiles for them if needed (white glove service)
- [ ] Test bookings with each provider

**Launch to Limited Customers (Weeks 3-4):**
- [ ] Announce in newsletter to subset of members
- [ ] Post in community forums
- [ ] Feature providers on dashboard
- [ ] Offer launch discount ($10 off first booking)
- [ ] Manually facilitate first 10-20 bookings

**Monitoring & Learning (Weeks 3-6):**
- [ ] Track all bookings
- [ ] Survey every customer (feedback form)
- [ ] Interview 5-10 providers
- [ ] Identify friction points
- [ ] Fix critical bugs
- [ ] Adjust pricing if needed
- [ ] Refine onboarding based on feedback

**Success Criteria Before Full Launch:**
- 20+ providers onboarded
- 50+ completed transactions
- Average rating 4.5+ stars
- NPS > 50
- 40%+ repeat booking rate
- No major bugs or issues
- Support response time < 24 hours

### Full Launch (Phase 2) - Goal: 50+ Providers, 500+ Transactions

**Marketing (Month 2):**
- [ ] Announce to all members via email
- [ ] Blog post about marketplace launch
- [ ] Social media promotion
- [ ] Community forum pinned post
- [ ] Dashboard banner/promotion
- [ ] Add to onboarding flow for new members

**Provider Expansion (Month 2-3):**
- [ ] Open applications to all SRNAs
- [ ] Recruit from diverse programs
- [ ] Feature different specialties
- [ ] Recruit for underserved service types
- [ ] Goal: 50-100 total providers

**Optimization (Month 3-6):**
- [ ] A/B test service page layouts
- [ ] Optimize search/filter experience
- [ ] Add provider recommendations
- [ ] Implement featured providers
- [ ] Add service bundles/packages
- [ ] Launch provider analytics dashboard

**Growth (Month 6+):**
- [ ] SEO for marketplace pages
- [ ] External marketing (outside CRNA Club)
- [ ] Provider referral program (invite other SRNAs)
- [ ] Customer referral incentives
- [ ] Scale support team
- [ ] Automated provider recruitment

### Key Decisions to Make Early

**1. Booking Model:**
- [ ] Instant booking vs request-based?
  - **Recommendation:** Hybrid - instant for packaged services, request for custom

**2. Commission Structure:**
- [ ] Flat % or tiered?
  - **Recommendation:** Flat 20% to start, evaluate after 100 transactions

**3. Service Types:**
- [ ] What services to allow initially?
  - **Recommendation:** Start with 3-5 types, expand based on demand
  - Phase 1: Mock Interview, Essay Review, Strategy Session
  - Phase 2: Add Resume Review, School Q&A, Clinical Tutoring

**4. Pricing Control:**
- [ ] Fixed prices or provider-set?
  - **Recommendation:** Provider-set within suggested ranges

**5. Verification Requirements:**
- [ ] How strict on SRNA verification?
  - **Recommendation:** Very strict - verified enrollment required

**6. Payment Timing:**
- [ ] When to charge customers?
  - **Recommendation:** At booking (with escrow hold)

**7. Review Requirements:**
- [ ] Required or optional?
  - **Recommendation:** Strongly encouraged but not blocking (can book again before reviewing, but incentivize reviews)

**8. Messaging:**
- [ ] On-platform only or allow external?
  - **Recommendation:** Start with on-platform only, monitor for issues

**9. Calendar Integration:**
- [ ] Build custom or integrate with Calendly/Google?
  - **Recommendation:** Start simple (manual availability), integrate Google Calendar after PMF

**10. Refund Policy:**
- [ ] How generous?
  - **Recommendation:** Customer-friendly for MVP (build trust), tighten if abused

---

## 10. Recommendations for CRNA Club Marketplace

### Architecture Patterns to Adopt from ShareTribe

**1. Core Entity Model:**
- Users (with provider/customer types)
- Services (listings with clear service types)
- Bookings (transactions with status flow)
- Reviews (double-blind after completion)
- Messages (on-platform communication)

**2. Transaction Flow:**
- Customer browses providers or services
- Customer books service (instant or request)
- Payment held in escrow
- Service delivered (live or async)
- Customer confirms completion or auto-releases after period
- Both parties leave reviews
- Payment released to provider

**3. Trust & Safety:**
- Email verification (automatic)
- SRNA verification (manual admin approval)
- Payment protection (Stripe escrow)
- Double-blind reviews
- Dispute resolution process

**4. Provider Features:**
- Profile with bio, credentials, stats
- Service creation/management
- Availability calendar
- Booking management
- Earnings dashboard
- Review display

**5. Customer Features:**
- Provider search/filter
- Service comparison
- Booking history
- Review submission
- Support access

### What to Customize for CRNA Club

**1. Verification Process:**
- **ShareTribe default:** Email + Stripe KYC
- **CRNA Club custom:** SRNA enrollment verification required
  - Upload acceptance letter or student ID
  - .edu email verification
  - Manual admin review
  - "Verified SRNA" badge display

**2. Service Categories:**
- **ShareTribe default:** Generic categories
- **CRNA Club custom:** CRNA-specific service types
  - Mock Interview
  - Personal Statement Review
  - Resume/CV Review
  - Application Strategy Session
  - School Selection Consultation
  - Clinical Tutoring (Pharm/Patho)
  - Later: Mentorship packages, study groups

**3. Provider Credentials Display:**
- **ShareTribe default:** Generic profile fields
- **CRNA Club custom:**
  - CRNA program name (with prestige signals)
  - Program year (more experienced = higher credibility)
  - Undergraduate institution
  - ICU background (specialty areas)
  - Programs applied to (if graduated)
  - Interview success stories

**4. Integration with Existing Platform:**
- **ShareTribe default:** Standalone marketplace
- **CRNA Club custom:**
  - Integrate with gamification (points for bookings)
  - Link to forums (provider Q&A participation)
  - Connect to community (reputation from forums)
  - Cross-promote events, content, tools

**5. Messaging Templates:**
- **ShareTribe default:** Freeform messaging
- **CRNA Club custom:** Message templates for common scenarios
  - "Request more information about your background"
  - "Confirm my interview focus areas"
  - "Reschedule request"
  - "Thank you / follow-up questions"

**6. Service Packaging:**
- **ShareTribe default:** Simple price per service
- **CRNA Club custom:**
  - Single session
  - Package deals (3 mock interviews for price of 2)
  - Bundles (essay review + mock interview)
  - Subscription options (monthly coaching)

### Phased Implementation Approach

#### Phase 1: MVP (December 2024 - Launch ready by handoff)

**Goal:** Prove marketplace concept with minimum features

**Scope:**
- Provider profiles (basic)
- 3 service types (Mock Interview, Essay Review, Strategy Session)
- Request-based booking only (no instant book yet)
- Manual calendar (providers mark general availability)
- Messaging system
- Payment processing (Stripe)
- Basic review system
- Admin dashboard for approvals

**Out of Scope:**
- Calendar integration
- Automated recommendations
- Provider analytics
- Advanced search filters
- Service bundles

**Success Metrics:**
- 10 providers onboarded
- 20 transactions completed
- Average 4.5+ star rating
- 40%+ repeat booking rate

**Timeline:** 4-5 days of development work

**Pages Required:**
1. `/marketplace` - Browse providers/services
2. `/marketplace/:providerId` - Provider profile
3. `/marketplace/book/:serviceId` - Booking request form
4. `/my-bookings` - Customer booking management
5. `/srna/dashboard` - SRNA dashboard (earnings, bookings)
6. `/srna/services` - SRNA service management
7. Admin pages for provider approval

#### Phase 2: Enhanced Features (Post-Launch - Month 1-2)

**Add:**
- Instant booking for packaged services
- Google Calendar integration
- Provider availability calendar
- Advanced search filters (price, rating, service type, program)
- Featured providers
- Service recommendations based on user data

**Improvements:**
- Automated email sequences
- Provider performance analytics
- Customer booking history with rebooking
- Review prompts and gamification
- Message templates

#### Phase 3: Scale Features (Month 3-6)

**Add:**
- Service bundles and packages
- Subscription coaching options
- Provider referral program
- Customer referral incentives
- Video call integration (built-in vs Zoom link)
- Document exchange system (for essay reviews)
- Provider tiers (basic vs premium)

**Advanced:**
- Smart matching (recommend providers based on customer profile)
- Dynamic pricing suggestions
- A/B testing framework
- SEO optimization
- External marketing

### Integration with Existing CRNA Club Features

**1. Gamification Integration:**
- Earn points for booking services (100 points per booking)
- Earn points for reviewing providers (50 points per review)
- Badge: "Feedback Champion" (leave 5 reviews)
- Providers earn points for completions (creates dual incentive to stay on platform)

**2. Community Integration:**
- Link provider profiles to forum profiles
- Show forum activity ("Active in forums")
- Providers can answer forum questions (builds reputation)
- Customers can book from forum interactions ("Book 1:1 with this SRNA")

**3. Content Integration:**
- Recommend marketplace after certain milestones
  - Completed "Interview Prep" module → Suggest mock interview
  - Added target programs → Suggest strategy session
  - Uploaded personal statement → Suggest essay review

**4. Data Integration:**
- Pull customer profile data for providers (programs, stats, goals)
- Providers can see customer's ReadyScore (if shared)
- Suggest services based on user stage (exploring, preparing, applying, interviewing)

**5. Events Integration:**
- Providers can offer "office hours" at CRNA Club events
- Promote marketplace at virtual events
- Feature providers in newsletter/blog

### Technical Implementation Recommendations

**Data Models (Add to /home/user/crna-club-rebuild/docs/skills/data-shapes.md):**

```typescript
// Already defined in data-shapes.md:
interface SrnaProvider { /* ... */ }
interface MarketplaceService { /* ... */ }
interface Booking { /* ... */ }
interface BookingReview { /* ... */ }

// Additional models needed:

interface ProviderApplication {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string; // Admin user ID

  // Application data
  programName: string;
  programYear: number;
  eduEmail: string;
  verificationDocUrl?: string; // Uploaded document
  bio: string;
  servicesInterested: ServiceType[];

  // Admin notes
  rejectionReason?: string;
  notes?: string;
}

interface BookingMessage {
  id: string;
  bookingId: string;
  senderId: string;
  recipientId: string;
  content: string;
  sentAt: Date;
  read: boolean;
}

interface ProviderAvailability {
  id: string;
  providerId: string;

  // Recurring availability
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // Sunday = 0
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  timezone: string;

  // Or specific time slots
  specificDate?: Date;
  specificStartTime?: string;
  specificEndTime?: string;

  isAvailable: boolean;
}

interface DisputeCase {
  id: string;
  bookingId: string;
  initiatedBy: 'customer' | 'provider';
  reason: string;
  description: string;
  status: 'open' | 'under_review' | 'resolved';
  resolution?: string;
  refundAmount?: number;
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string; // Admin user ID
}
```

**Stripe Integration:**
- Use Stripe Connect for provider payouts
- Platform account holds commission automatically
- Escrow payments until service complete
- Automatic transfer on completion/release
- Handle refunds through Stripe

**Email Notifications (using existing notification system):**
- Provider approved
- New booking request
- Booking confirmed
- Booking reminder (24 hours before)
- Service completed (prompt review)
- Review received
- Payment received
- Dispute filed

**Admin Dashboard Requirements:**
- Pending provider applications (review queue)
- All providers (with performance metrics)
- All bookings (filter by status)
- Disputes (queue)
- GMV and take rate metrics
- Provider leaderboard
- Flag problematic users

**Search & Filter Implementation:**
- Service type filter (multi-select)
- Price range slider
- Provider program filter
- Provider rating filter (4+ stars, 4.5+ stars, etc.)
- Availability filter (available this week)
- Keyword search (in bio and service descriptions)
- Sort options (highest rated, lowest price, most bookings, newest)

### Specific Recommendations Summary

**1. Launch Strategy:**
- Start with 10-20 hand-picked SRNA providers (quality over quantity)
- Limit to 3 service types initially
- Soft launch to subset of members
- Gather intensive feedback from first 50 transactions
- Iterate before full launch

**2. Chicken-and-Egg Solution:**
- Build supply first (providers have more incentive)
- Leverage existing community (SRNAs already engaged)
- Offer beta incentives (lower commission for early providers)
- Manual matching for first transactions (ensure success)
- Promote heavily in newsletter and forums

**3. Take Rate:**
- Start at 20% (provider-side only)
- Consider 15% promotional rate for first 20 providers
- Review after 100 transactions
- Can increase to 25% if adding significant value

**4. Trust & Safety:**
- Strict SRNA verification (non-negotiable)
- Double-blind reviews (prevent gaming)
- Payment escrow (protect both parties)
- Clear refund policy (customer-friendly to start)
- Monitor for disintermediation (but don't restrict prematurely)

**5. Disintermediation Prevention:**
- Focus on adding value (built-in audience, ease of booking, reputation)
- Don't restrict communication initially (trust community)
- Build reputation system (reviews only on platform)
- Make rebooking seamless (one-click)
- Integrate with broader platform (gamification, community)

**6. Service Packaging:**
- Package services with clear deliverables (no negotiation)
- Fixed pricing within suggested ranges
- Instant booking where possible
- Templates for common services

**7. Provider Onboarding:**
- Keep it simple (< 15 minutes active time)
- Service templates (pre-written descriptions)
- Suggested pricing (based on market data)
- Can defer payment setup until first booking

**8. Quality Control:**
- Manual approval of all providers
- Monitor ratings (< 4.0 = review)
- Response time tracking (< 24 hours required)
- Customer satisfaction surveys
- Quarterly provider reviews

**9. MVP Feature Set:**
- Provider profiles and verification
- Service listings (3 types)
- Request-based booking
- Messaging system
- Payment processing with escrow
- Review system
- Admin dashboard
- **Skip:** Calendar integration, instant booking, bundles (add post-launch)

**10. Success Metrics:**
- Track GMV, take rate, bookings per provider
- Monitor liquidity (time to first booking)
- Measure repeat booking rate (target 40%+)
- NPS for customers and providers
- Provider retention after first booking
- Disintermediation signals

---

## Conclusion

The CRNA Club marketplace has strong fundamentals for success:

**Advantages:**
- Established community (solves cold start)
- Clear value proposition (CRNA-specific mentorship)
- No direct competition
- High-trust environment
- Integration with broader platform

**Risks:**
- Limited provider pool (small # of SRNAs)
- Potential disintermediation (ongoing relationships)
- Quality control (student providers)
- Market size (niche audience)

**Recommended Approach:**
1. Start small (10-20 providers, 3 services)
2. Focus on quality (strict vetting, great experiences)
3. Manual operations initially (learn before automating)
4. Build trust (verification, reviews, guarantees)
5. Prevent disintermediation through value, not restrictions
6. Integrate deeply with existing platform
7. Iterate based on data (track everything)

**Key Success Factors:**
- Quality of first 50 transactions (make them exceptional)
- Provider satisfaction (they choose to stay on platform)
- Pricing (fair for providers, valuable for customers)
- Ease of use (booking should be effortless)
- Trust signals (verification, reviews, guarantees)

The marketplace has excellent potential to become a major value driver for CRNA Club membership while providing meaningful income for SRNAs. Success depends on thoughtful execution of these best practices adapted to the unique CRNA community context.

---

## Sources

### ShareTribe Resources
- [ShareTribe - Marketplace Software for Founders](https://www.sharetribe.com/)
- [Build a Service Marketplace with Sharetribe](https://www.sharetribe.com/service-marketplace/)
- [Sharetribe Developer Platform Documentation](https://www.sharetribe.com/docs/introduction/)
- [How to set up a directory-style service marketplace](https://www.sharetribe.com/help/en/articles/9956216-how-to-set-up-a-directory-style-service-marketplace)

### Two-Sided Marketplace Strategy
- [The complete guide to building a two-sided marketplace](https://www.sharetribe.com/how-to-build/two-sided-marketplace/)
- [How to build supply for your marketplace](https://www.sharetribe.com/academy/how-to-build-supply-marketplace/)
- [How to grow your marketplace on a budget](https://www.sharetribe.com/academy/grow-your-marketplace-on-a-budget/)

### Booking Flow & Service Design
- [How to design the booking flow of your service marketplace](https://www.sharetribe.com/academy/design-booking-flow-service-marketplace/)
- [Service Marketplaces: A Business Blueprint - BORN Group](https://www.borngroup.com/views/service-marketplaces-a-business-blueprint/)

### Cold Start & Chicken-and-Egg Problem
- [The chicken-and-egg problem of marketplaces - Platform Chronicles](https://platformchronicles.substack.com/p/the-chicken-and-egg-problem-of-marketplaces)
- [19 Tactics to Solve the Chicken-or-Egg Problem - NFX](https://www.nfx.com/post/19-marketplace-tactics-for-overcoming-the-chicken-or-egg-problem)
- [What is the chicken and egg problem in marketplaces - Sharetribe](https://www.sharetribe.com/marketplace-glossary/chicken-and-egg-problem/)
- [Cracking the Two Sided Marketplace Conundrum](https://timecrunch.io/blog/cracking-the-two-sided-marketplace-conundrum-solving-the-chicken-and-egg-problem)

### Marketplace Metrics
- [10 Marketplace KPIs That Matter - Medium](https://medium.com/@algovc/10-marketplace-kpis-that-matter-22e0fd2d2779)
- [The 8 Most Important Metrics for Marketplace Growth - Reforge](https://www.reforge.com/blog/brief-the-8-most-important-metrics-for-marketplace-growth)
- [Marketplace metrics: 26 key metrics + how to use them - Sharetribe](https://www.sharetribe.com/academy/measure-your-success-key-marketplace-metrics/)
- [13 Metrics for Marketplace Companies - Andreessen Horowitz](https://a16z.com/13-metrics-for-marketplace-companies/)

### Trust & Safety
- [How to build trust on your marketplace - Sharetribe](https://www.sharetribe.com/academy/build-trust-marketplace/)
- [How reviews work - Sharetribe Help Center](https://www.sharetribe.com/help/en/articles/8790491-how-reviews-work)
- [What are double-blind reviews in marketplaces? - Sharetribe](https://www.sharetribe.com/marketplace-glossary/double-blind-reviews/)
- [Using content moderation as a trust facilitator - Sharetribe](https://www.sharetribe.com/academy/content-moderation-trust/)

### Pricing & Commission Structure
- [What is marketplace commission (take rate?) - Sharetribe](https://www.sharetribe.com/marketplace-glossary/commission-take-rate/)
- [Marketplace pricing: How to define your ideal take rate - Sharetribe](https://www.sharetribe.com/academy/how-to-set-pricing-in-your-marketplace/)
- [How Much Commission Do Online Marketplaces Take - Yclas](https://yclas.com/blog/how-much-commission-do-online-marketplaces-take-from-buyers-and-sellers1.html)
- [How to set your marketplace commission rates - Sharetribe Help](https://www.sharetribe.com/help/en/articles/8413880-how-to-set-your-marketplace-commission-rates)

### Transaction Flows
- [Introduction to transaction processes - Sharetribe Developer Docs](https://www.sharetribe.com/docs/concepts/transactions/transaction-process/)
- [What happens during a transaction for your users - Sharetribe Help](https://www.sharetribe.com/help/en/articles/8413563-what-happens-during-a-transaction-for-customers-providers-and-operators)
- [How free messaging transactions work - Sharetribe Help](https://www.sharetribe.com/help/en/articles/9106951-how-free-messaging-transactions-work)

### Disintermediation Prevention
- [How to prevent marketplace leakage - Sharetribe](https://www.sharetribe.com/academy/how-to-discourage-people-from-going-around-your-payment-system/)
- [Learn How to Prevent Disintermediation at the Marketplace - LatentView](https://www.latentview.com/blog/how-to-prevent-disintermediation-at-the-marketplace/)
- [Combatting disintermediation - Marketbase](https://www.marketbase.app/marketplace-insights/combatting-disintermediation)
- [How Two-Sided Marketplace Can Prevent Disintermediation - Appoint](https://www.applicoinc.com/blog/5-ways-two-sided-marketplace-ceos-can-prevent-platform-leakage/)

### Provider Onboarding
- [Successful Vendor Onboarding Strategy for Digital Marketplaces - Torry Harris](https://www.torryharris.com/insights/whitepapers/successful-onboarding-digital-marketplace)
- [The Impact of User Onboarding on Marketplace Activation - UserGuiding](https://userguiding.com/blog/user-onboarding-for-marketplaces)
- [Marketplace Onboarding - JourneyH](https://www.journeyh.io/blog/marketplace-onboarding-marketplace-seller)
- [Advanced Guide to Seller Onboarding - UserGuiding](https://userguiding.com/blog/seller-onboarding)

### Quality Control
- [What are the most effective strategies for quality assurance in online marketplaces? - LinkedIn](https://www.linkedin.com/advice/3/what-most-effective-strategies-quality-assurance-lp4uc)
- [7 Best Practices for Quality Control in Multi-Vendor Outsourcing - Unity Connect](https://unity-connect.com/our-resources/bpo-learning-center/quality-assurance-in-multi-vendor-models/)

### MVP & Launch Strategy
- [Minimum viable product (MVP): What is it & how to start - Atlassian](https://www.atlassian.com/agile/product-management/minimum-viable-product)
- [MVP Design Checklist: 10 Steps to Launch Faster - Exalt Studio](https://exalt-studio.com/blog/mvp-design-checklist-10-steps-to-launch-faster)
- [19 Step Minimum Viable Product (MVP) Checklist - Net Solutions](https://www.netsolutions.com/hub/minimum-viable-product/checklist/)
