# Gamification System

The CRNA Club uses points, badges, and levels to drive engagement and motivate users through their application journey.

---

## Points System

### Point-Earning Actions

| Action | Points | Frequency Limit | Max/Week | Max Total |
|--------|--------|-----------------|----------|-----------|
| **Onboarding & Setup** |
| Complete onboarding widget | 20 | 1x ever | - | 20 |
| Save first program | 5 | 1x ever | - | 5 |
| Convert first saved → target | 3 | 1x ever | - | 3 |
| Calculate GPA (checkbox on My Stats) | 5 | 1x ever | - | 5 |
| **Prerequisites** |
| Submit a prerequisite course | 10 | 10x ever | - | 100 |
| Submit a course review | 10 | 10x ever | - | 100 |
| Save a prerequisite course | 1 | 10/day | 70 | 303 |
| **Trackers** |
| Log clinical experience | 2 | 3/day | 42 | 182 |
| Log EQ/leadership entry | 2 | 5/day | 70 | 303 |
| Log shadow day | 2 | 5/day | 70 | 303 |
| Log event attendance | 2 | 3/day | 42 | 182 |
| **Programs** |
| Convert saved → target | 3 | 20x ever | - | 60 |
| Complete milestone | 10 | 13x ever | - | 130 |
| Complete milestone checklist item | 2 | 10/week | 20 | 87 |
| Complete target school checklist item | 2 | 10/week | 20 | - |
| Submit "Let Us Know" form | 5 | 10/week | 50 | 217 |
| **Learning** |
| Complete a lesson | 3 | 10/day | 210 | 910 |
| **Shop** |
| Buy a product | 20 | No limit | - | - |
| **Community (Forums)** |
| Create a forum topic | 2 | 10/day | 140 | 607 |
| Reply to a forum topic | 2 | 50/day | 100 | - |
| Receive reaction on post | 1 | 20/day | 20 | - |
| **Events** |
| Attend virtual CRNA Club event | 5 | 1/week | 5 | 22 |

### Expected Monthly Points (Active User)
~195 points/month for consistently engaged user

---

## Levels

Users progress through 6 levels based on total points accumulated:

| Level | Name | Points Required | Time Estimate | Tooltip |
|-------|------|-----------------|---------------|---------|
| 1 | Aspiring Applicant | 20 | 5 days | "You're off to a strong start! Earn 200 points to reach Level 2!" |
| 2 | Dedicated Dreamer | 200 | 2 months | "Keep it up! Earn 600 total points to level up to Level 3!" |
| 3 | Ambitious Achiever | 600 | 4 months | "You're making great progress! Earn 1,000 total points to reach Level 4." |
| 4 | Committed Candidate | 1,000 | 6 months | "Almost there! Earn 1,600 total points to unlock Level 5." |
| 5 | Goal Crusher | 1,600 | 9 months | "You're nearing the top! Earn 2,000 total points to reach Level 6." |
| 6 | Peak Performer | 2,000 | 1 year | "You're a top achiever! You've reached elite status - keep up the solid work." |

### Level Display
- Show current level badge/icon
- Show level name
- Show progress bar to next level
- Show tooltip on hover

### Potential Physical Rewards (Future)
- Level 1: Keychain
- Level 2: Sticker Pack
- Level 3: Post-It Notes
- Level 4: Note Pad
- Level 5: Notebook
- Level 6: TBD

---

## Badges

Achievement badges earned for specific milestones:

| Badge Name | Requirement | Category |
|------------|-------------|----------|
| Target Trailblazer | Convert at least 3 Target Programs | Progression + Mastery |
| Critical Care Crusher | Submit at least 20 Clinical Tracker entries | Habit + Engagement |
| Top Contributor | Post or reply in forums at least 10 times | Community + Contribution |
| Feedback Champion | Submit "Let Us Know" form at least 3x | Community + Contribution |
| Lesson Legend | Complete at least 20 lessons | Learning + Skill |
| Milestone Machine | Complete at least 7 milestones | Progression + Mastery |

### Badge Display
- Earned badges: Full color, earned date
- Locked badges: Grayed out, progress indicator
- Badge tooltip shows name, description, progress

---

## Leaderboard

### Public Leaderboard
- Shows nickname (not full name)
- Shows total points
- Views: All Time, This Month
- Top 10 or Top 25 display

### Monthly Recognition
- **Member of the Month:** Most points earned that month
- **Community Contributor:** Most community posts/replies

---

## UI Components

### Points Display
```jsx
// In header/profile
<div className="flex items-center gap-2">
  <span className="text-yellow-500">⭐</span>
  <span className="font-medium">{points} pts</span>
</div>
```

### Level Badge
```jsx
<div className="flex items-center gap-2">
  <img src={levelIcon} className="w-8 h-8" />
  <div>
    <span className="text-sm font-medium">{levelName}</span>
    <div className="w-24 h-2 bg-gray-200 rounded-full">
      <div 
        className="h-2 bg-yellow-400 rounded-full" 
        style={{ width: `${progressPercent}%` }}
      />
    </div>
  </div>
</div>
```

### Points Earned Toast
```jsx
// Show when user earns points
<div className="fixed bottom-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow">
  +{points} points! 🎉
</div>
```

### Badge Earned Modal
```jsx
// Show when user earns a new badge
<Modal>
  <div className="text-center">
    <img src={badgeIcon} className="w-24 h-24 mx-auto" />
    <h2 className="text-xl font-bold mt-4">Badge Unlocked!</h2>
    <p className="text-gray-600">{badgeName}</p>
    <p className="text-sm text-gray-500 mt-2">{badgeDescription}</p>
  </div>
</Modal>
```

---

## Integration with WordPress

The gamification system uses the **Gamplify Game** plugin:
- Points stored in WordPress user meta
- Badge status stored in WordPress
- Level calculated from total points
- API endpoints expose user's gamification data

### Key API Endpoints (for dev team)
```
GET /wp-json/gamplify/v1/user/{id}/points
GET /wp-json/gamplify/v1/user/{id}/level
GET /wp-json/gamplify/v1/user/{id}/badges
GET /wp-json/gamplify/v1/leaderboard
POST /wp-json/gamplify/v1/award-points
```

---

## Points → Store Credit (Future)

Points may eventually be redeemable:
- Discounts on merchandise
- Discounts on marketplace services
- Small perks/bonuses

The WooCommerce Points plugin can integrate with Gamplify Game for redemption.

---

## Design Considerations

1. **Celebration Moments:** Make earning points feel rewarding
   - Toast notifications
   - Sound effect (optional)
   - Animation on level up

2. **Visibility:** Points/level always visible
   - Header or sidebar display
   - Profile page detail view

3. **Progress Motivation:** Show "X points to next level"
   - Progress bars
   - "You're 85% to Level 4!"

4. **Social Proof:** Leaderboard drives competition
   - "You're #47 this month"
   - "12 points behind #5"

5. **Non-Gamers:** Some users don't care
   - Keep it subtle, not obnoxious
   - Focus on utility, gamification is bonus
