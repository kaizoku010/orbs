// Mock Requests Data - Single Source of Truth
// A "Request" is when someone asks their community for help
export type RequestStatus = 'open' | 'connected' | 'in-progress' | 'fulfilled' | 'cancelled';

export interface Request {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  subcategory: string;
  status: RequestStatus;
  budget: number;
  currency: string;
  urgent: boolean;
  deliverable: boolean;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  askerId: string;
  supporterId: string | null;
  images: string[];
  createdAt: string;
  scheduledFor: string | null;
  fulfilledAt: string | null;
  isMeConnection?: boolean; // New visual flag
}

export const requests: Request[] = [
  {
    id: 'request-001',
    title: 'Need a driver to the airport',
    description: 'Flying out tomorrow morning at 8am. Need a reliable driver to take me from Kololo to Entebbe Airport. Must be punctual.',
    categoryId: 'drivers',
    subcategory: 'Airport Transfer',
    status: 'open',
    budget: 80000,
    currency: 'UGX',
    urgent: true,
    deliverable: false,
    location: {
      lat: 0.3476,
      lng: 32.5825,
      address: 'Kololo, Kampala'
    },
    askerId: 'user-002',
    supporterId: null,
    images: [],
    createdAt: '2025-12-06T08:00:00Z',
    scheduledFor: '2025-12-07T05:30:00Z',
    fulfilledAt: null
  },
  {
    id: 'request-002',
    title: 'Math tutor for UNEB prep',
    description: 'Looking for an experienced math tutor to help my son prepare for UNEB exams. 3 sessions per week for 2 months.',
    categoryId: 'tutors',
    subcategory: 'Test Prep',
    status: 'connected',
    budget: 250000,
    currency: 'UGX',
    urgent: false,
    deliverable: false,
    location: {
      lat: 0.3136,
      lng: 32.5811,
      address: 'Nakasero, Kampala'
    },
    askerId: 'user-003',
    supporterId: 'user-002',
    images: [],
    createdAt: '2025-12-04T10:00:00Z',
    scheduledFor: '2025-12-10T15:00:00Z',
    fulfilledAt: null
  },
  {
    id: 'request-003',
    title: 'Catering for small office party',
    description: 'Need Ugandan dishes for 20 people. Matooke, rice, chicken, tilapia, and rolex. Budget is flexible for quality.',
    categoryId: 'food',
    subcategory: 'Catering',
    status: 'in-progress',
    budget: 600000,
    currency: 'UGX',
    urgent: false,
    deliverable: true,
    location: {
      lat: 0.3163,
      lng: 32.5822,
      address: 'Kamwokya, Kampala'
    },
    askerId: 'user-001',
    supporterId: 'user-003',
    images: [],
    createdAt: '2025-12-01T14:00:00Z',
    scheduledFor: '2025-12-08T12:00:00Z',
    fulfilledAt: null
  },
  {
    id: 'request-004',
    title: 'Package delivery to Ntinda',
    description: 'Small package (documents) needs to go from Kololo to Ntinda. Urgent same-day delivery needed.',
    categoryId: 'logistics',
    subcategory: 'Same-day Delivery',
    status: 'fulfilled',
    budget: 25000,
    currency: 'UGX',
    urgent: true,
    deliverable: true,
    location: {
      lat: 0.3476,
      lng: 32.5825,
      address: 'Kololo, Kampala'
    },
    askerId: 'user-002',
    supporterId: 'user-004',
    images: [],
    createdAt: '2025-12-05T09:00:00Z',
    scheduledFor: null,
    fulfilledAt: '2025-12-05T11:30:00Z'
  },
  {
    id: 'request-005',
    title: 'Personal trainer needed',
    description: 'Looking for a gym partner/personal trainer. 3 times a week, mornings preferred. Focus on weight loss and strength.',
    categoryId: 'gym-partner',
    subcategory: 'Personal Trainer',
    status: 'open',
    budget: 400000,
    currency: 'UGX',
    urgent: false,
    deliverable: false,
    location: {
      lat: 0.3301,
      lng: 32.5705,
      address: 'Bugolobi, Kampala'
    },
    askerId: 'user-005',
    supporterId: null,
    images: [],
    createdAt: '2025-12-06T07:00:00Z',
    scheduledFor: null,
    fulfilledAt: null
  },
  {
    id: 'request-006',
    title: 'Japanese Translator Needed for Event',
    description: 'We are hosting a cultural exchange event and need a fluent Japanese translator for 4 hours. \n\nThe event will include guests from Tokyo. You will need to translate speeches and assist with casual conversation networking.\n\nDress code is business casual. Lunch will be provided.',
    categoryId: 'tutors',
    subcategory: 'Translation',
    status: 'open',
    budget: 150000,
    currency: 'UGX',
    urgent: false,
    deliverable: false,
    location: {
      lat: 0.3136,
      lng: 32.5811,
      address: 'Naguru Skyz Hotel, Kampala'
    },
    askerId: 'user-003',
    supporterId: null,
    images: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    createdAt: '2025-12-06T09:00:00Z',
    scheduledFor: '2025-12-20T10:00:00Z',
    fulfilledAt: null
  },
  // Alice's Connections (The "Me" links)
  {
    id: 'alice-req-002',
    title: 'Math tutor for my daughter',
    description: 'Need help with P6 mathematics. 2 sessions per week.',
    categoryId: 'tutors',
    subcategory: 'Primary School',
    status: 'in-progress' as any,
    budget: 150000,
    currency: 'UGX',
    urgent: false,
    deliverable: false,
    location: { lat: 0.3476, lng: 32.5825, address: 'Kololo, Kampala' },
    askerId: 'test-alice',
    supporterId: 'test-bob',
    images: [],
    createdAt: '2025-11-20T10:00:00Z',
    scheduledFor: '2025-12-10T15:00:00Z',
    fulfilledAt: null,
  },
  {
    id: 'alice-req-003',
    title: 'Airport pickup',
    description: 'Needed a ride from Entebbe Airport to Kololo.',
    categoryId: 'drivers',
    subcategory: 'Airport Transfer',
    status: 'fulfilled' as any,
    budget: 80000,
    currency: 'UGX',
    urgent: false,
    deliverable: false,
    location: { lat: 0.3476, lng: 32.5825, address: 'Kololo, Kampala' },
    askerId: 'test-alice',
    supporterId: 'user-002',
    images: [],
    createdAt: '2025-11-01T08:00:00Z',
    scheduledFor: '2025-11-05T14:00:00Z',
    fulfilledAt: '2025-11-05T15:30:00Z',
  }
];

