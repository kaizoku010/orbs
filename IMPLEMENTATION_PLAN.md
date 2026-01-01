# 🚀 KIZUNA: Request Confirmation & Progress Tracking Implementation Plan

**Status**: ✅ IMPLEMENTATION COMPLETE  
**Created**: January 1, 2026  
**Last Updated**: January 1, 2026

---

## 📖 Overview

This implementation adds a complete workflow for request confirmation, real-time progress tracking with timer/progress bar, and automatic connection visualization when requests are completed.

### Feature Flow
```
User clicks "Offer Support"
    ↓ (Auto-navigate to Network)
Chat opens with pre-filled message
    ↓ (User can chat with requester)
User clicks "Confirm & Start Request"
    ↓ (Status: open → enroute)
Timer appears below user orb
    ↓ (Counts down from estimated duration)
Timer expires or manual completion
    ↓ (Status: enroute → fulfilled)
Dotted connection line drawn
    ↓ (Permanent "bond" in network)
```

---

## 🎯 Implementation Phases

### **PHASE 1: Update Request Data Model**
> Files: `requests.ts`, `store.ts`, `requestService.ts`

#### 1.1 Update RequestStatus Type
- [ ] Add `'enroute'` to status union: `'open' | 'connected' | 'enroute' | 'in-progress' | 'fulfilled' | 'cancelled'`

#### 1.2 Extend Request Interface
Add new fields for timing:
```typescript
startedAt?: string;           // ISO timestamp when supporter confirmed
estimatedDuration?: number;   // Minutes (default: 30)
completedAt?: string;         // ISO timestamp when request was fulfilled
```

---

### **PHASE 2: Add Chat Confirmation UI**
> Files: `NetworkScene.tsx` (chat modal section)

#### 2.1 Add "Confirm & Start Request" Button
- [ ] Button appears in chat modal footer
- [ ] Text: "Confirm & Start Request"
- [ ] Styling: Primary button (green)
- [ ] Position: Below message input
- [ ] Disabled state: Gray out if no request data available

#### 2.2 Button Logic
- [ ] On click: Call `handleConfirmRequest()`
- [ ] Add system message: "✓ Request confirmed and started!"
- [ ] Close chat modal (optional)
- [ ] Update UI across all components

---

### **PHASE 3: Implement Confirmation Handler**
> Files: `NetworkScene.tsx`, `requestService.ts`

#### 3.1 Create `handleConfirmRequest()` Function
- [ ] Get current request & asker data
- [ ] Update request:
  - [ ] Set `status` to `'enroute'`
  - [ ] Set `supporterId` to current user ID
  - [ ] Set `startedAt` to current timestamp
  - [ ] Set `estimatedDuration` to 30 (minutes)
- [ ] Call service to persist changes
- [ ] Update local state/UI
- [ ] Show success toast notification

#### 3.2 Create Service Function
- [ ] Add `updateRequestStatus()` in `requestService.ts`
- [ ] Handle status transitions safely
- [ ] Return updated request object

---

### **PHASE 4: Add Timer + Progress Bar to UserOrb**
> Files: `UserOrb.tsx`

#### 4.1 Timer UI Component
- [ ] Create inside UserOrb component
- [ ] Show only when: `request.status === 'enroute'`
- [ ] Display:
  - [ ] Countdown: "15:30 remaining"
  - [ ] Progress bar: 0-100% filled
  - [ ] Status text: "Request in progress..."

#### 4.2 Timer Logic
- [ ] Calculate end time: `startedAt + (estimatedDuration * 60000)`
- [ ] Use `useEffect` with `setInterval`
- [ ] Update every 1 second
- [ ] Calculate remaining: `Math.max(0, endTime - now)`
- [ ] Convert to MM:SS format
- [ ] Calculate progress: `(elapsed / total) * 100`
- [ ] Clean up interval on unmount

#### 4.3 Auto-Complete
- [ ] When timer reaches 0:
  - [ ] Update request status to `'fulfilled'`
  - [ ] Show completion toast
  - [ ] Trigger connection line drawing
  - [ ] Stop timer

---

### **PHASE 5: Update Connection Visualization**
> Files: `ConnectionLine.tsx`, `NetworkScene.tsx`

#### 5.1 Extend Connection Types
- [ ] Add `'completed'` type to connections
  ```typescript
  type: 'active' | 'past' | 'completed'
  ```

#### 5.2 Update Connections Logic
- [ ] In `NetworkScene.tsx` connections useMemo:
  ```typescript
  type: req.status === 'fulfilled' 
    ? 'completed'      // dotted line
    : req.status === 'in-progress' || req.status === 'enroute'
    ? 'active'         // solid green line
    : 'past'           // gray/dim
  ```

#### 5.3 Style Dotted Lines
- [ ] Update `ConnectionLine.tsx` to support dotted style
- [ ] Dotted line: Same color as solid but dashed pattern
- [ ] Use THREE.js dashed material or line segments
- [ ] Styling:
  - [ ] Color: `#3C8F5A` (kizuna-green)
  - [ ] Style: Dotted/dashed
  - [ ] Opacity: 0.8
  - [ ] Width: 1-2px

---

### **PHASE 6: Integration & Testing**
> Files: All modified files

#### 6.1 Data Flow Verification
- [ ] Request data flows correctly through components
- [ ] Timestamps persist across navigation
- [ ] Timer calculates correctly
- [ ] Status updates reflect in UI

#### 6.2 Edge Cases
- [ ] Timer continues counting even with modal closed
- [ ] Refreshing page preserves timer progress
- [ ] Multiple requests in progress simultaneously
- [ ] Manual completion before timer expires
- [ ] Network latency (status update delays)

#### 6.3 User Experience
- [ ] Chat confirm button visible and functional
- [ ] Toast notifications appear on key events
- [ ] Timer visually appeals & is readable
- [ ] Connection line appears smoothly
- [ ] No UI glitches during transitions

---

## 📁 Files to Modify

```
app/
├── mocks/
│   ├── data/
│   │   └── requests.ts          [UPDATE] Add enroute status & fields
│   └── services/
│       └── requestService.ts    [UPDATE] Add update function
├── components/
│   └── network/
│       ├── NetworkScene.tsx     [UPDATE] Add confirm handler & button
│       ├── UserOrb.tsx          [UPDATE] Add timer + progress bar
│       └── ConnectionLine.tsx   [UPDATE] Add dotted style support
└── store.ts                     [UPDATE] If needed for mutations
```

---

## 🔑 Key Technical Details

### Request Status Lifecycle
```
open
  ↓ (user confirms chat)
enroute (timer starts)
  ↓ (timer expires OR manual completion)
fulfilled (connection line drawn)
  ↓
(permanent state)
```

### Timer Implementation
```javascript
// Calculate end time
const startTime = new Date(request.startedAt).getTime();
const duration = request.estimatedDuration * 60 * 1000; // convert to ms
const endTime = startTime + duration;

// Calculate remaining
const now = Date.now();
const remaining = Math.max(0, endTime - now);
const minutes = Math.floor(remaining / 60000);
const seconds = Math.floor((remaining % 60000) / 1000);
const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;

// Progress percentage
const elapsed = now - startTime;
const progress = (elapsed / duration) * 100;
```

### Connection Line Detection
```typescript
// In NetworkScene connections useMemo
const connections = requests
  .filter(req => req.supporterId && req.askerId) // both must exist
  .map(req => {
    const askerNode = nodes.find(n => n.id === req.askerId);
    const supporterNode = nodes.find(n => n.id === req.supporterId);
    
    if (!askerNode || !supporterNode) return null;
    
    return {
      id: req.id,
      start: askerNode.position,
      end: supporterNode.position,
      type: req.status === 'fulfilled' ? 'completed' : 'active',
      style: req.status === 'fulfilled' ? 'dotted' : 'solid'
    };
  })
  .filter(Boolean);
```

---

## ⚙️ Default Configuration

```typescript
// Default values
const DEFAULT_ESTIMATED_DURATION = 30; // minutes
const TIMER_UPDATE_INTERVAL = 1000;    // ms (every second)
const AUTO_COMPLETE_DELAY = 500;       // ms after timer hits 0
```

---

## 🧪 Testing Checklist

### Manual Testing Steps
1. **Confirm Request**
   - [ ] Click "Offer Support" on request
   - [ ] Chat opens automatically
   - [ ] Type message (optional)
   - [ ] Click "Confirm & Start Request"
   - [ ] Toast appears: "Request confirmed!"
   - [ ] Request status changes to `enroute`

2. **Timer Progress**
   - [ ] Timer appears under user orb
   - [ ] Timer counts down (15:30 → 15:29 → ...)
   - [ ] Progress bar fills gradually
   - [ ] Can navigate away, timer continues
   - [ ] Timer persists on page refresh

3. **Auto-Completion**
   - [ ] Let timer reach 0:00
   - [ ] Toast: "Request completed!"
   - [ ] Status changes to `fulfilled`
   - [ ] Dotted connection line appears
   - [ ] Connection links asker ↔ supporter

4. **Visual Consistency**
   - [ ] Solid lines for active requests
   - [ ] Dotted lines for completed connections
   - [ ] Colors match design system
   - [ ] No UI overlaps or glitches

---

## 📝 Notes

- **Data Persistence**: Use localStorage or sessionStorage for timer state if needed
- **Estimated Duration**: Currently hardcoded to 30 min; can be made configurable per request category
- **Concurrent Requests**: Multiple requests can be `enroute` simultaneously - timer logic handles independently
- **Manual Completion**: Can be added later as "Mark as Complete" button
- **Animations**: Consider fade-in/out for timer appearance/disappearance

---

## 🚦 Implementation Order

1. ✅ **Phase 1** - Update data model (10 min)
2. ✅ **Phase 2** - Chat UI button (15 min)
3. ✅ **Phase 3** - Confirmation handler (20 min)
4. ✅ **Phase 4** - Timer + progress (30 min)
5. ✅ **Phase 5** - Connection visualization (25 min)
6. ✅ **Phase 6** - Testing & polish (20 min)

**Total Estimated Time**: ~2 hours

---

**Ready to implement? Let's go! 🎉**
