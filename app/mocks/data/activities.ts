// Activity Log - Community events and actions
// Real-time feed of what's happening in the network

export type ActivityType = 'confirmation' | 'completion' | 'badge_unlocked' | 'rating_received' | 'connected' | 'open';

export interface Activity {
  id: string;
  type: ActivityType;
  userId: string;              // Who performed the action
  targetUserId?: string;        // Who it affects (e.g., who got rated)
  requestId?: string;           // Related request
  badgeId?: string;             // For badge events
  rating?: number;              // Star rating (1-5)
  timestamp: string;            // ISO timestamp
  message: string;              // Display text
}

// Mock activity data
export const activities: Activity[] = [
  {
    id: 'activity-001',
    type: 'completion',
    userId: 'user-002',
    targetUserId: 'user-001',
    requestId: 'request-001',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    message: 'Bob completed a request'
  },
  {
    id: 'activity-002',
    type: 'rating_received',
    userId: 'user-001',
    targetUserId: 'user-002',
    requestId: 'request-001',
    rating: 5,
    timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
    message: 'Sarah gave Bob a 5-star rating'
  },
  {
    id: 'activity-003',
    type: 'badge_unlocked',
    userId: 'user-002',
    badgeId: 'five-star',
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    message: 'Bob unlocked the Five Star badge ⭐'
  },
  {
    id: 'activity-004',
    type: 'confirmation',
    userId: 'user-003',
    requestId: 'request-002',
    timestamp: new Date(Date.now() - 1 * 60000).toISOString(),
    message: 'Charlie confirmed a request'
  },
];
