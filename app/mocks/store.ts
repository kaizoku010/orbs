// Mock Store - Single Source of Truth for all mock data
// This simulates a backend database that services read/write to
// KIZUNA is a Relational Network, not a marketplace

import { users, currentUser, type User } from './data/users';
import { categories, type Category } from './data/categories';
import { badges, badgeTierColors, type Badge, type BadgeTier, type BadgeCategory } from './data/badges';
import { requests, type Request, type RequestStatus } from './data/requests';

// Clone data to allow mutations without affecting original imports
interface MockStore {
  users: User[];
  categories: Category[];
  badges: Badge[];
  requests: Request[]; // Changed from "gigs"
  currentUserId: string | null;
  isAuthenticated: boolean;
}

// Initialize store with cloned data
const store: MockStore = {
  users: [...users],
  categories: [...categories],
  badges: [...badges],
  requests: [...requests], // Changed from "gigs"
  currentUserId: currentUser.id,
  isAuthenticated: true, // Start authenticated for dev
};

// ============ GETTERS ============

export function getUsers(): User[] {
  return store.users;
}

export function getUserById(id: string): User | undefined {
  return store.users.find(u => u.id === id);
}

export function getCurrentUser(): User | null {
  if (!store.currentUserId) return null;
  return getUserById(store.currentUserId) || null;
}

export function getCategories(): Category[] {
  return store.categories;
}

export function getCategoryById(id: string): Category | undefined {
  return store.categories.find(c => c.id === id);
}

export function getBadges(): Badge[] {
  return store.badges;
}

export function getBadgeById(id: string): Badge | undefined {
  return store.badges.find(b => b.id === id);
}

export function getUserBadges(userId: string): Badge[] {
  const user = getUserById(userId);
  if (!user) return [];
  return user.badges
    .map(badgeId => getBadgeById(badgeId))
    .filter((b): b is Badge => b !== undefined);
}

export function getRequests(): Request[] {
  return store.requests;
}

export function getRequestById(id: string): Request | undefined {
  return store.requests.find(r => r.id === id);
}

export function getRequestsByStatus(status: RequestStatus): Request[] {
  return store.requests.filter(r => r.status === status);
}

export function getRequestsByUser(userId: string): Request[] {
  return store.requests.filter(r => r.askerId === userId || r.supporterId === userId);
}

export function getOpenRequests(): Request[] {
  return getRequestsByStatus('open');
}

export function isAuthenticated(): boolean {
  return store.isAuthenticated;
}

// ============ SETTERS ============

export function setCurrentUser(userId: string | null): void {
  store.currentUserId = userId;
  store.isAuthenticated = userId !== null;
}

export function addRequest(request: Request): void {
  store.requests.push(request);
}

export function updateRequest(id: string, updates: Partial<Request>): Request | undefined {
  const index = store.requests.findIndex(r => r.id === id);
  if (index === -1) return undefined;
  store.requests[index] = { ...store.requests[index], ...updates };
  return store.requests[index];
}

export function updateUser(id: string, updates: Partial<User>): User | undefined {
  const index = store.users.findIndex(u => u.id === id);
  if (index === -1) return undefined;
  store.users[index] = { ...store.users[index], ...updates };
  return store.users[index];
}

export function awardBadge(userId: string, badgeId: string): boolean {
  const user = getUserById(userId);
  const badge = getBadgeById(badgeId);
  if (!user || !badge) return false;
  if (user.badges.includes(badgeId)) return false; // Already has badge
  
  const index = store.users.findIndex(u => u.id === userId);
  store.users[index].badges.push(badgeId);
  store.users[index].xp += badge.xpReward;
  return true;
}

// ============ EXPORTS ============

export { badgeTierColors };
export type { User, Category, Badge, BadgeTier, BadgeCategory, Request, RequestStatus };

