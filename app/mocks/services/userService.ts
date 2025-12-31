// User Service - Simulates user API
import { realisticDelay } from '../delays';
import {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  type User,
} from '../store';

export interface UserResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface UsersResponse {
  success: boolean;
  users?: User[];
  error?: string;
}

export async function fetchCurrentUser(): Promise<UserResponse> {
  await realisticDelay();
  const user = getCurrentUser();
  if (user) {
    return { success: true, user };
  }
  return { success: false, error: 'Not authenticated' };
}

export async function fetchUserById(id: string): Promise<UserResponse> {
  await realisticDelay();
  const user = getUserById(id);
  if (user) {
    return { success: true, user };
  }
  return { success: false, error: 'User not found' };
}

export async function fetchAllUsers(): Promise<UsersResponse> {
  await realisticDelay();
  return { success: true, users: getUsers() };
}

export async function fetchNearbyCaptains(
  lat: number, 
  lng: number, 
  radiusKm: number = 10
): Promise<UsersResponse> {
  await realisticDelay();
  
  // Simulate distance filtering (in real app, would use geospatial query)
  const allUsers = getUsers();
  const captains = allUsers.filter(u => 
    u.verified && 
    u.totalGigs > 0 &&
    u.id !== getCurrentUser()?.id
  );
  
  return { success: true, users: captains };
}

export async function updateUserProfile(
  id: string, 
  updates: Partial<User>
): Promise<UserResponse> {
  await realisticDelay();
  
  const updated = updateUser(id, updates);
  if (updated) {
    return { success: true, user: updated };
  }
  return { success: false, error: 'Failed to update user' };
}

export async function verifyUser(userId: string): Promise<UserResponse> {
  await realisticDelay();
  
  const updated = updateUser(userId, { verified: true });
  if (updated) {
    return { success: true, user: updated };
  }
  return { success: false, error: 'Verification failed' };
}

// Calculate trust level based on user stats
export function calculateTrustLevel(user: User): number {
  let level = 1;
  
  if (user.verified) level = 2;
  if (user.totalGigs >= 10 && user.rating >= 4.0) level = 3;
  if (user.totalGigs >= 50 && user.rating >= 4.5) level = 4;
  if (user.totalGigs >= 100 && user.rating >= 4.8) level = 5;
  
  return level;
}

