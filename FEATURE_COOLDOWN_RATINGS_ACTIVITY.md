# 🎯 Feature: Cooldown, Ratings→Badges & Live Activity Log

**Status**: Planning  
**Scope**: Large (requires data model changes, new UI components, event tracking)

---

## 📋 Features Overview

### 1️⃣ **Cooldown System**
- Each user gets individual 30-minute cooldown after confirming a request
- Cooldown timer visible in UserOrb info pane
- Shows: "On cooldown: 15:30 remaining"
- Confirm button disabled during cooldown

### 2️⃣ **Rating → Badge System** ⭐🎮
- After request completion, responder receives a rating (1-5 stars)
- Ratings convert to **unique achievement badges**:
  - 5-star rating → 🏆 "Five Star" badge
  - Multiple 5-star ratings → 🌟 "Superstar" badge (5+ five-star ratings)
  - 10+ completions → 💪 "Neighborhood Hero" badge
  - Perfect streak → 🔥 "Flawless" badge (5 consecutive 5-stars)
  - Community favorite → 👑 "Community Champion" badge
- Badges displayed on user profile
- User can see earned badges in their "My Activity" section
- Rating calculation: Average of all ratings received

### 3️⃣ **My Activity Section (Personal)**
- When user clicks their OWN orb ("Me" user), show personalized activity:
  - ✅ Current Active Deliveries (enroute requests)
  - 📊 Today's Stats (confirmations, completions, ratings)
  - 🏆 Recently Earned Badges
  - ⭐ Recent Ratings & Comments
- Tab-based: "Active" | "History" | "Badges"

### 4️⃣ **Live Activity Pane (Left Sidebar)**
- Real-time event feed showing community events:
  - ✅ New request confirmations
  - 🎉 Request completions (bonds formed)
  - 🏆 Badge unlocked (when someone earns badge)
  - 🔗 Connected/Open route events
- Each event shows: User, action, timestamp, badge (if applicable)
- Scrollable, newest first
- Shows last 50 events

---

## 🔧 Implementation Breakdown

### **Data Model Changes**

#### Badge System
```typescript
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;  // emoji or icon
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  requirement: {
    type: 'rating' | 'completions' | 'streak' | 'special';
    value: number;
  };
}

interface UserBadge {
  badgeId: string;
  earnedAt: string;
  count?: number;  // For stackable badges
}
```

#### User Model Extension
```typescript
interface User {
  // ... existing fields
  lastRequestConfirmedAt?: string;    // ISO timestamp
  cooldownExpiry?: string;             // ISO timestamp
  averageRating: number;               // 0-5
  totalRatingsReceived: number;        // count
  badgesEarned: UserBadge[];          // Array of earned badges
  ratingsBreakdown?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
```

#### Activity/Event Model
```typescript
interface Activity {
  id: string;
  type: 'confirmation' | 'completion' | 'badge_unlocked' | 'rating_received' | 'connected' | 'open';
  userId: string;              // Who performed the action
  targetUserId?: string;        // Who it affects
  requestId?: string;           // Related request
  badgeId?: string;             // For badge events
  rating?: number;              // For rating events
  timestamp: string;
  message: string;              // Display text
}
```

#### Request Model Update
```typescript
interface Request {
  // ... existing fields
  ratings?: {
    [supporterId: string]: {
      score: 1 | 2 | 3 | 4 | 5;
      comment?: string;
      ratedAt: string;
      ratedBy: string;
    }
  }
}
```

---

## 📁 Files to Create/Modify

```
app/
├── mocks/
│   ├── data/
│   │   ├── activities.ts           [NEW] Activity event data
│   │   ├── badges.ts               [NEW] Badge definitions
│   │   └── users.ts               [UPDATE] Add rating & badge fields
│   └── services/
│       ├── activityService.ts      [NEW] Activity logging
│       ├── badgeService.ts         [NEW] Badge system & unlocking
│       ├── ratingService.ts        [NEW] Rating system
│       └── userService.ts          [UPDATE] Add cooldown check
├── components/
│   ├── network/
│   │   └── UserOrb.tsx            [UPDATE] Show cooldown timer & My Activity
│   └── ui/
│       ├── ActivityPane.tsx        [NEW] Live activity sidebar
│       ├── BadgeDisplay.tsx        [NEW] Badge showcase
│       └── RatingModal.tsx         [NEW] Rating submission
├── hooks/
│   └── useActivityLog.ts          [NEW] Activity state management
└── routes/
    └── network.tsx                [UPDATE] Integrate ActivityPane & RatingModal
```

---

## 📊 Implementation Phases

### **PHASE A: Cooldown System** (~25 min)
1. Update User model with cooldown fields
2. Update `handleConfirmRequest()` to set cooldown
3. Add cooldown check before allowing new confirmations
4. Add cooldown timer display in UserOrb modal
5. Calculate remaining time dynamically

### **PHASE B: Badge System** (~50 min)
1. Create Badge model and mock badge data
2. Create badge achievement logic/rules
3. Create Badge unlock service (checks if user qualifies)
4. Add badge display component (BadgeDisplay.tsx)
5. Auto-unlock badges when rating received
6. Show badge notifications in activity pane

### **PHASE C: Rating → Badge Conversion** (~35 min)
1. Create Rating UI component (star picker, comment box)
2. Add rating service functions
3. Add rating modal to request completion flow
4. On rating submission:
   - Update user rating
   - Check for badge unlocks
   - Log activity event
   - Show badge notification (if earned)
5. Persist ratings to mock store

### **PHASE D: My Activity Section** (~30 min)
1. Add "My Activity" tab to UserOrb (when isMe=true)
2. Show current active deliveries with timer
3. Show recently earned badges
4. Show recent ratings & comments
5. Show today's stats (confirmations, completions)
6. Different UI for self vs. viewing others

### **PHASE E: Live Activity Pane** (~40 min)
1. Create Activity model and mock data
2. Create ActivityPane component (sidebar list)
3. Create activity service for logging events
4. Log events on:
   - Request confirmation
   - Request completion
   - Badge unlocked
   - Rating received
5. Integrate ActivityPane into Network route
6. Auto-refresh every 2 seconds

---

## 🎨 UI Component Details

### **Cooldown Display (UserOrb)**
```
Position: Below user bio in profile pane
Style: Alert box with warning color
Shows:
  ⏱️ On Cooldown
  Timer: "15:30 remaining"
  Progress bar showing cooldown progress
```

### **My Activity Tab (UserOrb - Self Only)**
```
Position: New tab alongside "Profile" | "History" | "Requests"
Only shows when: isMe = true

Tab Content:
  📊 Today's Stats:
    ✅ 3 confirmations
    🎉 1 completion
    ⭐ 2 ratings received

  🏃 Active Deliveries:
    └─ Request: "Need groceries"
       ⏱️ 12:45 remaining
       Progress: ████░░░ 58%

  🏆 Recently Earned Badges:
    └─ [Icon] Five Star (Today, 3:45 PM)
    └─ [Icon] Superstar (Yesterday)
    └─ [Icon] Neighborhood Hero (Last week)

  ⭐ Recent Ratings:
    └─ Alice: ⭐⭐⭐⭐⭐ "Perfect! Very reliable"
    └─ Bob: ⭐⭐⭐⭐ "Great service"
```

### **Activity Pane (Left Sidebar)**
```
Position: Left panel of Network view
Size: ~300px fixed width (scrollable)

Header: "Live Activity"

Event List (Newest First):
  [2:45 PM] Alice unlocked 🏆 Five Star badge
  [2:30 PM] Bob completed delivery 🎉
  [2:15 PM] Charlie confirmed request ✅
  [2:00 PM] Diana unlocked 🌟 Superstar badge
  [1:45 PM] Eve's request went open 📍

Footer: "Showing X/50 events"
```

### **Badge Display**
```
Badge Card:
  ┌─────────────────┐
  │   🏆 Icon       │
  │   Badge Name    │
  │   "Achieved X   │
  │    times"       │
  │   Earned: Date  │
  └─────────────────┘
```

### **Rating Modal**
```
Position: Modal overlay (same as before)
Triggered: When request moves to 'fulfilled'

Components:
  - User avatar + name
  - Question: "Rate this helper"
  - 5-star picker
  - Comment text area (optional)
  - [Submit Rating] button
  
On Submit:
  - Show badge unlock animation (if earned)
  - Toast: "You earned 🏆 Five Star badge!"
  - Activity logged
```

---

## 🎮 Badge Definitions

```typescript
BADGE_DEFINITIONS = [
  {
    id: 'five-star-1',
    name: 'Five Star',
    description: 'Received a 5-star rating',
    icon: '⭐',
    tier: 'gold',
    requirement: { type: 'rating', value: 5 }
  },
  {
    id: 'superstar',
    name: 'Superstar',
    description: 'Earned 5 five-star ratings',
    icon: '🌟',
    tier: 'platinum',
    requirement: { type: 'completions', value: 5 }
  },
  {
    id: 'neighborhood-hero',
    name: 'Neighborhood Hero',
    description: 'Completed 10 requests',
    icon: '💪',
    tier: 'gold',
    requirement: { type: 'completions', value: 10 }
  },
  {
    id: 'flawless-streak',
    name: 'Flawless',
    description: '5 consecutive 5-star ratings',
    icon: '🔥',
    tier: 'platinum',
    requirement: { type: 'streak', value: 5 }
  },
  {
    id: 'community-champion',
    name: 'Community Champion',
    description: 'Average rating 4.8+ with 10+ reviews',
    icon: '👑',
    tier: 'platinum',
    requirement: { type: 'special', value: 0 }
  }
];
```

---

## ⚙️ Default Configuration

```typescript
const COOLDOWN_DURATION = 30 * 60 * 1000;        // 30 minutes
const ACTIVITY_REFRESH_INTERVAL = 2000;           // 2 seconds
const MAX_ACTIVITY_DISPLAY = 50;                  // Show last 50 events
const RATING_SCALE = [1, 2, 3, 4, 5] as const;
const DEFAULT_USER_RATING = 0;
const BADGE_CHECK_INTERVAL = 1000;                // Check for new badges
```

---

## 🧪 Testing Scenarios

1. **Cooldown Test**
   - Confirm request → Cooldown activates
   - Try to confirm another → Disabled with message
   - Verify timer counts down
   - Check "My Activity" shows stats

2. **Rating & Badge Test**
   - Complete request → Rating modal appears
   - Submit 5-star rating → User rating increases
   - Check if badge unlocked → Show notification
   - Verify badge appears in profile & "My Activity"

3. **My Activity Test**
   - Click own orb → "My Activity" tab visible
   - See current active deliveries with timer
   - See recently earned badges
   - See recent ratings from others

4. **Activity Log Test**
   - Perform actions → Events appear in left sidebar
   - Badge unlocks trigger activity event
   - New events appear at top
   - Check timestamps correct

---

## 📝 Notes

- **Cooldown Persistence**: Store in localStorage for persistence across sessions
- **Badge Stacking**: Some badges stack (e.g., Five Star badge counts), others don't
- **Rating History**: Keep all ratings for transparency
- **Activity Log**: Max 50 items; older events shift out
- **My Activity**: Only visible when user views their OWN orb

---

## 🚦 Estimated Timeline

| Phase | Task | Time |
|-------|------|------|
| A | Cooldown System | 25 min |
| B | Badge System | 50 min |
| C | Rating → Badge | 35 min |
| D | My Activity Section | 30 min |
| E | Live Activity Pane | 40 min |
| **TOTAL** | | **~3 hours** |

---

**Ready to implement all phases? 🚀**

---

## 🔧 Implementation Breakdown

### **Data Model Changes**

#### User Model Extension
```typescript
interface User {
  // ... existing fields
  lastRequestConfirmedAt?: string;  // ISO timestamp
  cooldownExpiry?: string;           // ISO timestamp
  averageRating: number;             // 0-5
  totalRatingsReceived: number;      // count
  ratingsBreakdown?: {               // detailed breakdown
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
```

#### Event/Activity Model
```typescript
interface Activity {
  id: string;
  type: 'confirmation' | 'completion' | 'rating' | 'denial' | 'connected' | 'open';
  userId: string;              // Who performed the action
  targetUserId?: string;        // Who it affects
  requestId?: string;           // Related request
  rating?: number;              // For rating events
  timestamp: string;
  message: string;              // Display text
}
```

#### Request Model Update
```typescript
interface Request {
  // ... existing fields
  ratings?: {
    [supporterId: string]: {
      score: 1 | 2 | 3 | 4 | 5;
      comment?: string;
      ratedAt: string;
      ratedBy: string;
    }
  }
}
```

---

## 📁 Files to Create/Modify

```
app/
├── mocks/
│   ├── data/
│   │   ├── activities.ts           [NEW] Activity data
│   │   └── users.ts               [UPDATE] Add rating fields
│   └── services/
│       ├── activityService.ts      [NEW] Activity logging
│       ├── ratingService.ts        [NEW] Rating system
│       └── userService.ts          [UPDATE] Add cooldown check
├── components/
│   ├── network/
│   │   └── UserOrb.tsx            [UPDATE] Show cooldown timer
│   └── ui/
│       └── ActivityPane.tsx        [NEW] Live activity sidebar
├── hooks/
│   └── useActivityLog.ts          [NEW] Activity state management
└── routes/
    └── network.tsx                [UPDATE] Integrate ActivityPane
```

---

## 📊 Implementation Phases

### **PHASE A: Cooldown System** (~30 min)
1. Update User model with cooldown fields
2. Update `handleConfirmRequest()` to set cooldown
3. Add cooldown check before allowing new confirmations
4. Add cooldown timer display in UserOrb modal
5. Calculate remaining time dynamically

### **PHASE B: Rating System** (~40 min)
1. Create Rating UI component (star picker, comment box)
2. Add rating service functions
3. Add rating modal to request completion flow
4. Update user rating on rating submission
5. Persist ratings to mock store

### **PHASE C: Activity/Event Logging** (~45 min)
1. Create Activity model and mock data
2. Create `ActivityPane` component (sidebar list)
3. Create activity service for logging events
4. Log events on:
   - Request confirmation
   - Request completion
   - Rating received
   - Request denial
5. Integrate ActivityPane into Network route

### **PHASE D: Live Updates** (~25 min)
1. Add real-time event broadcasting
2. Auto-refresh activity feed every 2 seconds
3. Show new events with animation
4. Handle event filtering (show/hide)
5. Polish animations and styling

---

## 🎨 UI Component Details

### **Cooldown Display (UserOrb)**
```
Position: Below user bio in profile pane
Style: Alert box with red/warning color
Shows:
  ⏱️ On Cooldown
  Timer: "15:30 remaining"
  Progress bar showing cooldown progress
  [Auto-remove when cooldown expires]
```

### **Activity Pane (Left Sidebar)**
```
Position: Left panel of Network view
Size: ~280px fixed width (can scroll)
Structure:
  Header: "Live Activity"
  Event List:
    ├── [Timestamp] User Action
    │   └── [Star rating] Comment (if rating)
    ├── [Timestamp] User Action
    └── ... (newest at top)
  Footer: "Showing X events"
```

### **Rating Modal**
```
Position: Modal overlay
Triggered: When request moves to 'fulfilled'
Components:
  - User avatar + name
  - Question: "Rate this helper"
  - 5-star picker
  - Comment text area (optional)
  - [Submit Rating] button
```

---

## 🔄 Event Flow Examples

### **Example 1: Request Confirmation with Cooldown**
```
1. User clicks "Confirm & Start Request"
   → status: 'open' → 'enroute'
   → lastRequestConfirmedAt = now
   → cooldownExpiry = now + 30 min
   
2. ActivityPane logs: "User confirmed request"
   
3. UserOrb shows cooldown timer
   → "On Cooldown: 29:45 remaining"
   
4. User tries to confirm another request
   → Button disabled: "On cooldown (15:30 remaining)"
```

### **Example 2: Request Completion & Rating**
```
1. Timer expires → status: 'enroute' → 'fulfilled'
   
2. Rating modal appears
   → User rates responder: 5 stars + comment
   
3. ActivityPane logs: "User rated helper (5 stars)"
   
4. User's rating updates:
   → averageRating recalculated
   → totalRatingsReceived ++
   → ratingsBreakdown[5]++
   
5. Both users see updated rating in profile
```

### **Example 3: Activity Log Events**
```
ActivityPane shows:
  2:34 PM   Alice confirmed request ✅
  2:12 PM   Alice gave Bob 5-star rating ⭐
  1:45 PM   Bob completed request 🎉
  1:15 PM   Charlie connected on request 🔗
  12:50 PM  Diana requested help (Open) 📍
```

---

## ⚙️ Default Configuration

```typescript
const COOLDOWN_DURATION = 30 * 60 * 1000;        // 30 minutes in ms
const ACTIVITY_REFRESH_INTERVAL = 2000;           // 2 seconds
const MAX_ACTIVITY_DISPLAY = 50;                  // Show last 50 events
const RATING_SCALE = [1, 2, 3, 4, 5] as const;   // Star scale
const DEFAULT_USER_RATING = 0;                    // New users
```

---

## 🧪 Testing Scenarios

1. **Cooldown Test**
   - Confirm request → Cooldown activates
   - Try to confirm another → Disabled with message
   - Wait 30 min → Button re-enables
   - Verify timer counts down correctly

2. **Rating Test**
   - Complete request → Rating modal appears
   - Submit 5-star rating → User rating increases
   - View updated profile → New rating visible
   - Check averageRating calculation

3. **Activity Log Test**
   - Perform various actions → Events appear in pane
   - Check event ordering (newest first)
   - Verify timestamps are correct
   - Test scroll and refresh

4. **Edge Cases**
   - Multiple users' cooldowns overlapping
   - Rapid requests (test cooldown prevents)
   - Rating someone twice (should update, not duplicate)
   - Offline events (sync when reconnected)

---

## 📝 Notes

- **Cooldown Persistence**: Store in localStorage for persistence across sessions
- **Rating History**: Keep all ratings for transparency (average shown, all stored)
- **Activity Log**: Mock data in mock store; replace with API later
- **Performance**: Activity log max 50 items; pagination or virtual scroll if needed
- **Animations**: Fade-in for new activity items, progress animations for cooldown/progress

---

## 🚦 Estimated Timeline

| Phase | Task | Time |
|-------|------|------|
| A | Cooldown System | 30 min |
| B | Rating System | 40 min |
| C | Activity Logging | 45 min |
| D | Live Updates | 25 min |
| **TOTAL** | | **~2.5 hours** |

---

## ❓ Questions Before Implementation

1. **Cooldown Cooldown per user?** Should each user have independent 30-min cooldowns, or global?
2. **Rating Visibility**: Should ratings be anonymous or show who rated?
3. **Rating Cooldown**: Can users rate the same person multiple times, or only once per request?
4. **Activity Feed**: Should non-authenticated users see activity, or logged-in only?
5. **Rating Scale**: Stick with 5-star, or add emoji reactions?

---

**Ready to implement? Let's build it! 🚀**
