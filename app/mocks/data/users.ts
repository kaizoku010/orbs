// Mock Users Data - Single Source of Truth
// In KIZUNA's relational network, users are community members who help each other

// Import test users (they use TestUser which is compatible with User)
import { TEST_USER_ALICE, TEST_USER_BOB, type TestUser } from './testUsers';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  avatar: string;
  role: 'individual' | 'company' | 'admin';
  verified: boolean;
  rating: number;
  totalConnections: number; // Changed from "totalGigs" - number of times they've helped
  trustLevel: number; // 1-5
  badges: string[];
  xp: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  bio: string;
  joinedAt: string;
  skills: string[]; // Changed from "categories" - what they can offer
  // Cooldown fields
  lastRequestConfirmedAt?: string;    // ISO timestamp when last confirmed
  cooldownExpiry?: string;            // ISO timestamp when cooldown ends
  // Rating fields
  averageRating?: number;             // Average of all ratings
  totalRatingsReceived?: number;      // Count of ratings received
  ratingsBreakdown?: {                // Breakdown by star count
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export const users: User[] = [
  {
    id: 'user-001',
    name: 'Sarah Nakato',
    email: 'sarah@example.com',
    phone: '+256 701 234 567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    role: 'individual',
    verified: true,
    rating: 4.8,
    totalConnections: 47,
    trustLevel: 4,
    badges: ['verified-identity', 'trusted-supporter', 'first-connection', 'community-builder'],
    xp: 2350,
    location: {
      lat: 0.3476,
      lng: 32.5825,
      address: 'Kololo, Kampala'
    },
    bio: 'Professional driver with 5 years experience. Safe, reliable, always on time.',
    joinedAt: '2024-06-15',
    skills: ['drivers', 'logistics']
  },
  {
    id: 'user-002',
    name: 'David Mugisha',
    email: 'david@example.com',
    phone: '+256 702 345 678',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    role: 'individual',
    verified: true,
    rating: 4.9,
    totalConnections: 89,
    trustLevel: 5,
    badges: ['verified-identity', 'centurion', 'neighborhood-hero', 'master-tutor'],
    xp: 4520,
    location: {
      lat: 0.3136,
      lng: 32.5811,
      address: 'Nakasero, Kampala'
    },
    bio: 'Mathematics & Physics tutor. Helping students excel for over 8 years.',
    joinedAt: '2024-03-20',
    skills: ['tutors', 'engineering']
  },
  {
    id: 'user-003',
    name: 'Grace Auma',
    email: 'grace@example.com',
    phone: '+256 703 456 789',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=grace',
    role: 'individual',
    verified: true,
    rating: 4.7,
    totalConnections: 32,
    trustLevel: 3,
    badges: ['verified-identity', 'first-connection', 'culinary-expert'],
    xp: 1680,
    location: {
      lat: 0.3163,
      lng: 32.5822,
      address: 'Kamwokya, Kampala'
    },
    bio: 'Home chef specializing in Ugandan and continental cuisine. Catering available.',
    joinedAt: '2024-08-10',
    skills: ['food', 'groceries']
  },
  {
    id: 'user-004',
    name: 'Kampala Express Logistics',
    email: 'info@kampalaexpress.com',
    phone: '+256 800 123 456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kampala-express',
    role: 'company',
    verified: true,
    rating: 4.6,
    totalConnections: 234,
    trustLevel: 5,
    badges: ['verified-business', 'centurion', 'trusted-company'],
    xp: 8900,
    location: {
      lat: 0.3301,
      lng: 32.5705,
      address: 'Bugolobi, Kampala'
    },
    bio: 'Fast and reliable delivery across Kampala. Same-day delivery guaranteed.',
    joinedAt: '2024-01-05',
    skills: ['logistics', 'drivers']
  },
  {
    id: 'user-005',
    name: 'Brian Okello',
    email: 'brian@example.com',
    phone: '+256 704 567 890',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=brian',
    role: 'individual',
    verified: false,
    rating: 0,
    totalConnections: 0,
    trustLevel: 1,
    badges: [],
    xp: 0,
    location: {
      lat: 0.3478,
      lng: 32.6017,
      address: 'Ntinda, Kampala'
    },
    bio: 'New to KIZUNA. Excited to help my community!',
    joinedAt: '2025-12-01',
    skills: ['jack-of-all-trades']
  },
  // Test users - Alice (asker) and Bob (supporter)
  TEST_USER_ALICE,
  TEST_USER_BOB,
];

// Current logged-in user (for mock auth state)
// Default to Alice for testing the "asker" flow
export const currentUser: User = TEST_USER_ALICE;

// Export test users for easy access
export { TEST_USER_ALICE, TEST_USER_BOB };

