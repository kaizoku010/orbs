/**
 * Test User Service
 * 
 * Provides access to test users for development and testing flows.
 * Use this to switch between Alice (asker) and Bob (supporter) personas.
 */

import {
  TEST_USER_ALICE,
  TEST_USER_BOB,
  TEST_CREDENTIALS,
  ALICE_REQUESTS,
  BOB_STATS,
  TEST_REVIEWS,
  TEST_MESSAGES,
  TEST_NOTIFICATIONS,
  DEFAULT_TEST_USER,
  getTestUser,
  type TestUserType,
} from '../data/testUsers';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get a test user by type
 */
export const fetchTestUser = async (type: TestUserType) => {
  await delay(100);
  return getTestUser(type);
};

/**
 * Authenticate with test credentials
 */
export const authenticateTestUser = async (email: string, password: string) => {
  await delay(200);
  
  if (email === TEST_CREDENTIALS.alice.email && password === TEST_CREDENTIALS.alice.password) {
    return { success: true, user: TEST_USER_ALICE };
  }
  
  if (email === TEST_CREDENTIALS.bob.email && password === TEST_CREDENTIALS.bob.password) {
    return { success: true, user: TEST_USER_BOB };
  }
  
  return { success: false, error: 'Invalid credentials' };
};

/**
 * Get Alice's requests
 */
export const fetchAliceRequests = async () => {
  await delay(150);
  return Object.values(ALICE_REQUESTS);
};

/**
 * Get Bob's support stats
 */
export const fetchBobStats = async () => {
  await delay(100);
  return BOB_STATS;
};

/**
 * Get reviews between test users
 */
export const fetchTestReviews = async () => {
  await delay(100);
  return TEST_REVIEWS;
};

/**
 * Get messages between test users
 */
export const fetchTestMessages = async (requestId?: string) => {
  await delay(100);
  if (requestId) {
    return TEST_MESSAGES.filter(m => m.requestId === requestId);
  }
  return TEST_MESSAGES;
};

/**
 * Get notifications for a test user
 */
export const fetchTestNotifications = async (type: TestUserType) => {
  await delay(100);
  return type === 'alice' ? TEST_NOTIFICATIONS.alice : TEST_NOTIFICATIONS.bob;
};

/**
 * Get default test user
 */
export const fetchDefaultTestUser = async () => {
  await delay(100);
  return getTestUser(DEFAULT_TEST_USER);
};

// Export test data for direct access in components
export {
  TEST_USER_ALICE,
  TEST_USER_BOB,
  TEST_CREDENTIALS,
  ALICE_REQUESTS,
  BOB_STATS,
  TEST_REVIEWS,
  TEST_MESSAGES,
  TEST_NOTIFICATIONS,
  DEFAULT_TEST_USER,
};

export type { TestUserType };

