/**
 * TEST USERS - Single Source of Truth
 *
 * These are the two primary test accounts for development and testing.
 * Use these to test all flows in the app.
 *
 * ALICE - Primary ASKER (person who needs help)
 *   - Email: alice@test.com
 *   - Password: test123
 *   - Has active requests, some fulfilled
 *   - Moderate XP and badges
 *
 * BOB - Primary SUPPORTER (person who offers help)
 *   - Email: bob@test.com
 *   - Password: test123
 *   - Has completed many support gigs
 *   - High XP, many badges, top-rated
 */

// User interface (duplicated here to avoid circular dependency)
// Keep in sync with users.ts
export interface TestUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'individual' | 'company' | 'admin';
  verified: boolean;
  rating: number;
  totalConnections: number;
  trustLevel: number;
  badges: string[];
  xp: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  bio: string;
  joinedAt: string;
  skills: string[];
}

// ============================================
// ALICE - The Asker (needs help)
// ============================================
export const TEST_USER_ALICE: TestUser = {
  id: 'test-alice',
  name: 'Alice Namutebi',
  email: 'alice@test.com',
  phone: '+256 770 111 111',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice-kizuna',
  role: 'individual',
  verified: true,
  rating: 4.6,
  totalConnections: 12, // She's asked for help 12 times
  trustLevel: 3,
  badges: [
    'verified-identity',
    'first-connection',   // Made her first connection
    'community-builder',  // Referred friends
  ],
  xp: 850,
  location: {
    lat: 0.3476,
    lng: 32.5825,
    address: 'Kololo, Kampala'
  },
  bio: 'Busy professional and mom of two. Always grateful for community support!',
  joinedAt: '2024-09-15',
  skills: [] // She's mainly an asker, not a helper
};

// ============================================
// BOB - The Supporter (offers help)
// ============================================
export const TEST_USER_BOB: TestUser = {
  id: 'test-bob',
  name: 'Bob Wasswa',
  email: 'bob@test.com',
  phone: '+256 770 222 222',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob-kizuna',
  role: 'individual',
  verified: true,
  rating: 4.9,
  totalConnections: 78, // He's helped 78 people
  trustLevel: 5,
  badges: [
    'verified-identity',
    'trusted-supporter',
    'first-connection',
    'ten-gigs',
    'fifty-gigs',
    'neighborhood-hero',
    'repeat-connector',
    'five-star-streak',
  ],
  xp: 3850,
  location: {
    lat: 0.3136,
    lng: 32.5811,
    address: 'Nakasero, Kampala'
  },
  bio: 'Jack of all trades! Driver, handyman, tutor. Here to help my community thrive.',
  joinedAt: '2024-03-01',
  skills: ['drivers', 'tutors', 'handyman', 'logistics', 'errands']
};

// ============================================
// Test Credentials (for login flow)
// ============================================
export const TEST_CREDENTIALS = {
  alice: {
    email: 'alice@test.com',
    password: 'test123',
    userId: 'test-alice',
  },
  bob: {
    email: 'bob@test.com',
    password: 'test123',
    userId: 'test-bob',
  },
};

// ============================================
// Alice's Request History
// ============================================
export const ALICE_REQUESTS = {
  // Active request - waiting for helper
  active: {
    id: 'alice-req-001',
    title: 'Need someone to pick up groceries',
    description: 'I\'m working from home and can\'t leave. Need someone to pick up groceries from Nakumatt and deliver to Kololo.',
    categoryId: 'errands',
    subcategory: 'Grocery Pickup',
    status: 'open' as const,
    budget: 35000,
    currency: 'UGX',
    urgent: false,
    deliverable: true,
    location: TEST_USER_ALICE.location,
    askerId: TEST_USER_ALICE.id,
    supporterId: null,
    images: [],
    createdAt: new Date().toISOString(),
    scheduledFor: null,
    fulfilledAt: null,
  },
  // In progress - Bob is helping
  inProgress: {
    id: 'alice-req-002',
    title: 'Math tutor for my daughter',
    description: 'Need help with P6 mathematics. 2 sessions per week.',
    categoryId: 'tutors',
    subcategory: 'Primary School',
    status: 'in-progress' as const,
    budget: 150000,
    currency: 'UGX',
    urgent: false,
    deliverable: false,
    location: TEST_USER_ALICE.location,
    askerId: TEST_USER_ALICE.id,
    supporterId: TEST_USER_BOB.id,
    images: [],
    createdAt: '2025-11-20T10:00:00Z',
    scheduledFor: '2025-12-10T15:00:00Z',
    fulfilledAt: null,
  },
  // Completed - Bob helped
  fulfilled: {
    id: 'alice-req-003',
    title: 'Airport pickup',
    description: 'Needed a ride from Entebbe Airport to Kololo.',
    categoryId: 'drivers',
    subcategory: 'Airport Transfer',
    status: 'fulfilled' as const,
    budget: 80000,
    currency: 'UGX',
    urgent: false,
    deliverable: false,
    location: TEST_USER_ALICE.location,
    askerId: TEST_USER_ALICE.id,
    supporterId: TEST_USER_BOB.id,
    images: [],
    createdAt: '2025-11-01T08:00:00Z',
    scheduledFor: '2025-11-05T14:00:00Z',
    fulfilledAt: '2025-11-05T15:30:00Z',
  },
};

// ============================================
// Bob's Support Stats
// ============================================
export const BOB_STATS = {
  totalEarnings: 4250000, // UGX
  thisMonth: 620000,
  completedGigs: 78,
  activeGigs: 3,
  repeatClients: 12,
  avgRating: 4.9,
  responseRate: 98, // percentage
  completionRate: 100, // percentage
};

// ============================================
// Reviews/Ratings between Alice and Bob
// ============================================
export const TEST_REVIEWS = [
  {
    id: 'review-001',
    requestId: 'alice-req-003',
    fromUserId: TEST_USER_ALICE.id,
    toUserId: TEST_USER_BOB.id,
    rating: 5,
    comment: 'Bob was on time and very professional. My daughter loves learning with him!',
    createdAt: '2025-11-05T16:00:00Z',
  },
  {
    id: 'review-002',
    requestId: 'alice-req-003',
    fromUserId: TEST_USER_BOB.id,
    toUserId: TEST_USER_ALICE.id,
    rating: 5,
    comment: 'Great communication. Alice had everything ready. Would help again!',
    createdAt: '2025-11-05T16:30:00Z',
  },
];

// ============================================
// Messages between Alice and Bob
// ============================================
export const TEST_MESSAGES = [
  {
    id: 'msg-001',
    requestId: 'alice-req-002',
    senderId: TEST_USER_BOB.id,
    receiverId: TEST_USER_ALICE.id,
    content: 'Hi Alice! I saw your tutoring request. I have experience teaching P6 math. Would love to help!',
    createdAt: '2025-11-20T11:00:00Z',
    read: true,
  },
  {
    id: 'msg-002',
    requestId: 'alice-req-002',
    senderId: TEST_USER_ALICE.id,
    receiverId: TEST_USER_BOB.id,
    content: 'That sounds great Bob! When are you available?',
    createdAt: '2025-11-20T11:15:00Z',
    read: true,
  },
  {
    id: 'msg-003',
    requestId: 'alice-req-002',
    senderId: TEST_USER_BOB.id,
    receiverId: TEST_USER_ALICE.id,
    content: 'I can do Tuesdays and Thursdays at 4pm. Does that work?',
    createdAt: '2025-11-20T11:20:00Z',
    read: true,
  },
  {
    id: 'msg-004',
    requestId: 'alice-req-002',
    senderId: TEST_USER_ALICE.id,
    receiverId: TEST_USER_BOB.id,
    content: 'Perfect! Let\'s start next Tuesday. I\'ll send you my address.',
    createdAt: '2025-11-20T11:25:00Z',
    read: true,
  },
];

// ============================================
// Notifications for test users
// ============================================
export const TEST_NOTIFICATIONS = {
  alice: [
    {
      id: 'notif-a1',
      type: 'new_offer',
      title: 'New offer on your request',
      message: 'Bob Wasswa wants to help with "Need someone to pick up groceries"',
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'notif-a2',
      type: 'message',
      title: 'New message from Bob',
      message: 'Bob sent you a message about tutoring',
      read: true,
      createdAt: '2025-11-20T11:20:00Z',
    },
  ],
  bob: [
    {
      id: 'notif-b1',
      type: 'new_request',
      title: 'New request nearby',
      message: 'Alice needs grocery pickup in Kololo (2km away)',
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'notif-b2',
      type: 'rating',
      title: 'New 5-star review!',
      message: 'Alice rated you 5 stars for airport pickup',
      read: true,
      createdAt: '2025-11-05T16:00:00Z',
    },
  ],
};

// ============================================
// Helper to get current test user (for mock auth)
// ============================================
export type TestUserType = 'alice' | 'bob';

export const getTestUser = (type: TestUserType) => {
  return type === 'alice' ? TEST_USER_ALICE : TEST_USER_BOB;
};

// Default logged in user for development
export const DEFAULT_TEST_USER: TestUserType = 'alice';

