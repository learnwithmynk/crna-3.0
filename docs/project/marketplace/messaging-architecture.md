# Marketplace Messaging Architecture

**Created:** December 8, 2024
**Status:** Complete Design Specification

---

## Executive Summary

**Recommendation:** Build with Supabase Realtime for MVP, with migration path to Stream Chat if needs evolve.

**Why Supabase:**
- Cost-effective: $0-25/month vs $499+/month for Stream Chat
- Full data ownership and privacy control
- Native integration with existing infrastructure
- Sufficient for 1:1 marketplace messaging
- Can implement marketplace-specific rules directly

---

## Options Comparison

| Criteria | Supabase DIY | Stream Chat | SendBird | TalkJS |
|----------|-------------|-------------|----------|--------|
| **Pricing** | $0-25/mo | $499/mo+ | $399/mo+ | $279/mo+ |
| **React SDK** | Custom hooks | Excellent | Excellent | Good |
| **Real-time** | Native | Sub-100ms | Sub-100ms | Sub-100ms |
| **Read Receipts** | Build | Built-in | Built-in | Built-in |
| **Typing Indicators** | Build | Built-in | Built-in | Built-in |
| **Moderation** | Build | Advanced | Advanced | Basic |
| **Implementation** | 3-4 weeks | 1-2 weeks | 1-2 weeks | 1 week |
| **Data Ownership** | 100% | Stream stores | SendBird stores | TalkJS stores |

---

## Feature Requirements

### Core (MVP)

| Feature | Priority | Supabase |
|---------|----------|----------|
| 1:1 conversations | Critical | ✅ Build |
| Real-time delivery | Critical | ✅ Native |
| Message history | Critical | ✅ Database |
| Read receipts | High | 🔨 Build |
| File/image sharing | High | ✅ Storage |
| Link to bookings | Critical | ✅ Native FK |
| Contact exchange prevention | Critical | ✅ Custom triggers |

### Nice to Have (Post-MVP)

| Feature | Priority |
|---------|----------|
| Typing indicators | Medium |
| Push notifications | Medium |
| Message search | Medium |
| User blocking | Medium |
| Email fallback | High |

---

## Database Schema

```sql
-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id UUID NOT NULL REFERENCES auth.users(id),
  provider_id UUID NOT NULL REFERENCES auth.users(id),
  booking_id UUID REFERENCES bookings(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_archived BOOLEAN DEFAULT FALSE,
  UNIQUE(applicant_id, provider_id)
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP,
  file_url TEXT,
  deleted_at TIMESTAMP
);

-- Read Status
CREATE TABLE conversation_read_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  last_read_message_id UUID,
  last_read_at TIMESTAMP DEFAULT NOW(),
  unread_count INT DEFAULT 0,
  UNIQUE(conversation_id, user_id)
);

-- Message Flags (for moderation)
CREATE TABLE message_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id),
  flag_type TEXT NOT NULL,
  flagged_at TIMESTAMP DEFAULT NOW(),
  admin_notes TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  action_taken TEXT
);

-- Indexes
CREATE INDEX idx_conversations_applicant ON conversations(applicant_id);
CREATE INDEX idx_conversations_provider ON conversations(provider_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
```

---

## Contact Exchange Prevention

### Strategy: Trust-First with Light Monitoring

**Stage 1: Trust (MVP)**
- Allow open communication
- No filtering or blocking
- Build community norms

**Stage 2: Monitor (After 50+ bookings)**
- Flag messages with contact patterns
- Alert admin for review
- Never block or publicly shame

**Stage 3: Value Addition (Incentives)**
Make staying on-platform more valuable than leaving:
- Built-in audience for providers
- Payment protection for applicants
- Reputation building (visible reviews)
- Easy rebooking

### Detection Trigger

```sql
CREATE FUNCTION detect_contact_exchange() RETURNS TRIGGER AS $$
BEGIN
  -- Phone number pattern
  IF NEW.content ~ '(\d{3}[-.]?\d{3}[-.]?\d{4})' THEN
    INSERT INTO message_flags (message_id, flag_type)
    VALUES (NEW.id, 'phone_detected');
  END IF;

  -- Email pattern
  IF NEW.content ~ '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}' THEN
    INSERT INTO message_flags (message_id, flag_type)
    VALUES (NEW.id, 'email_detected');
  END IF;

  -- Off-platform mentions
  IF NEW.content ~* '(whatsapp|telegram|signal|call me|text me)' THEN
    INSERT INTO message_flags (message_id, flag_type)
    VALUES (NEW.id, 'off_platform_mention');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER message_flag_trigger
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION detect_contact_exchange();
```

### What NOT to Do
- ❌ Don't block messages
- ❌ Don't publicly shame users
- ❌ Don't require pre-approval
- ❌ Don't auto-delete suspected info

---

## React Hook Implementation

```typescript
// hooks/useMessaging.ts
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export function useMessaging(conversationId: string) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initial load
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) setError(error.message);
      else setMessages(data);
      setLoading(false);
    };

    fetchMessages();

    // Real-time subscription
    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, [conversationId]);

  const sendMessage = useCallback(async (content: string, fileUrl?: string) => {
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('messages')
      .insert([{
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        file_url: fileUrl
      }]);

    if (error) setError(error.message);
  }, [conversationId]);

  return { messages, loading, error, sendMessage };
}
```

---

## Messaging Policies

### Pre-Booking Communication

**Policy:** Allow open messaging before booking

**Rules:**
- ✅ Can message before booking
- ✅ Applicant can ask questions
- ✅ Provider can clarify scope
- ⚠️ 10 messages/day limit for non-members (spam prevention)
- ⚠️ Unlimited after booking

### Policy Text

> "You can message mentors to ask questions about their services before booking. Once you book, you have unlimited messaging to coordinate session details. All communication must happen on The CRNA Club to ensure quality service and dispute resolution protection."

---

## Moderation Workflow

### Three-Tier Strategy

**Tier 1: Automated Filtering**
- Detect contact exchange patterns → Flag for review
- Detect harassment keywords → Flag for review
- Admin reviews within 24h

**Tier 2: User Reporting**
- Allow users to report messages
- Report triggers immediate hiding
- Admin reviews within 2 hours for harassment

**Tier 3: Escalation**
- Harassment, threats, discrimination
- Immediate suspension + investigation

### Admin Dashboard Features

| Feature | Implementation |
|---------|----------------|
| Flagged messages queue | Sort by severity |
| User profiles | Quick lookup |
| Message context | Show full conversation |
| Action buttons | Warn / Suspend / Ban |
| Bulk actions | Process multiple flags |
| Analytics | Flags/day, resolution time |

---

## API Endpoints

```
POST   /api/messages/conversations          # Start conversation
GET    /api/messages/conversations          # List conversations
GET    /api/messages/conversations/:id      # Get conversation
POST   /api/messages/conversations/:id      # Send message
GET    /api/messages/conversations/:id/messages  # Get messages
PUT    /api/messages/:messageId/read        # Mark as read
POST   /api/messages/:messageId/report      # Report message

# Admin
GET    /api/admin/messages/flagged          # Flagged messages
PUT    /api/admin/messages/:id/resolve      # Resolve flag
POST   /api/admin/messages/:id/action       # Take action (warn/ban)
```

---

## Frontend Components

```
components/
├── messaging/
│   ├── ConversationList.tsx     # List all conversations
│   ├── ConversationItem.tsx     # Single conversation preview
│   ├── MessageThread.tsx        # Full conversation view
│   ├── MessageBubble.tsx        # Single message display
│   ├── MessageInput.tsx         # Send message form
│   ├── FileUpload.tsx           # File attachment
│   ├── TypingIndicator.tsx      # "User is typing..."
│   └── ReadReceipt.tsx          # "Read at 3:45pm"
```

---

## Implementation Roadmap

### Week 1-2: Database & Core
- Set up Supabase tables
- Create RLS policies
- Build contact detection triggers

### Week 2-3: Frontend Components
- MessageThread component
- MessageInput component
- ConversationList component
- Read receipts logic

### Week 3-4: Admin & Polish
- Admin moderation queue
- Message flagging UI
- Email notification setup
- Testing & QA

---

## Cost Analysis (Year 1)

### Supabase Build
```
Development: 3-4 weeks @ $150/hr = ~$24,000
Operations: $25/month = $300/year
Email (Sendgrid): $20/month = $240/year
Storage: $50/month = $600/year
TOTAL: ~$25,140
```

### Stream Chat Alternative
```
Subscription: $499/month = $5,988/year
Development: 2 weeks = ~$4,800
TOTAL: ~$10,788/year recurring
```

**Recommendation:** Start with Supabase. Consider Stream Chat if:
- Volume exceeds 10k+ DAU
- Moderation costs become significant
- Advanced AI moderation needed
- Budget allows $499+/month

---

## Metrics to Track

| Metric | Target |
|--------|--------|
| % flagged messages | < 5% by month 3 |
| One-and-done rate | < 40% |
| Repeat booking rate | > 40% |
| Messages per booking | 5-10 average |
| Response time | < 4 hours |
