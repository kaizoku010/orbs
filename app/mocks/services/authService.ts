// Auth Service - Simulates authentication API
import { realisticDelay } from '../delays';
import {
  getCurrentUser,
  setCurrentUser,
  getUserById,
  getUsers,
  type User
} from '../store';
import { TEST_USER_ALICE, TEST_USER_BOB, TEST_CREDENTIALS } from '../data/testUsers';

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'individual' | 'company';
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  await realisticDelay();

  // Simulate login - find user by phone
  const users = getUsers();
  const user = users.find(u => u.phone === credentials.phone);

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  // In real app, would verify password
  setCurrentUser(user.id);
  return { success: true, user };
}

/**
 * Quick login for test users - bypasses OTP
 */
export async function loginAsTestUser(type: 'alice' | 'bob'): Promise<AuthResponse> {
  await realisticDelay();

  const user = type === 'alice' ? TEST_USER_ALICE : TEST_USER_BOB;
  setCurrentUser(user.id);

  // Store in localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('kizuna_current_user', JSON.stringify(user));
    localStorage.setItem('kizuna_auth_type', type);
  }

  return { success: true, user: user as User };
}

/**
 * Login with email and password (for test users)
 */
export async function loginWithEmail(email: string, password: string): Promise<AuthResponse> {
  await realisticDelay();

  // Check test credentials
  if (email === TEST_CREDENTIALS.alice.email && password === TEST_CREDENTIALS.alice.password) {
    return loginAsTestUser('alice');
  }

  if (email === TEST_CREDENTIALS.bob.email && password === TEST_CREDENTIALS.bob.password) {
    return loginAsTestUser('bob');
  }

  // Check regular users by email
  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  setCurrentUser(user.id);
  return { success: true, user };
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  await realisticDelay();
  
  // Check if phone already exists
  const users = getUsers();
  if (users.find(u => u.phone === data.phone)) {
    return { success: false, error: 'Phone number already registered' };
  }
  
  // Create new user (in real app, would save to DB)
  const newUser: User = {
    id: `user-${Date.now()}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
    role: data.role,
    verified: false,
    rating: 0,
    totalGigs: 0,
    trustLevel: 1,
    badges: [],
    xp: 0,
    location: { lat: 0, lng: 0, address: '' },
    bio: '',
    joinedAt: new Date().toISOString().split('T')[0],
    categories: []
  };
  
  // Would add to store in real implementation
  setCurrentUser(newUser.id);
  return { success: true, user: newUser };
}

export async function logout(): Promise<void> {
  await realisticDelay();
  setCurrentUser(null);

  // Clear localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('kizuna_current_user');
    localStorage.removeItem('kizuna_auth_type');
  }
}

export async function verifyOTP(phone: string, otp: string): Promise<AuthResponse> {
  await realisticDelay();
  
  // Simulate OTP verification - accept any 6-digit code
  if (otp.length !== 6) {
    return { success: false, error: 'Invalid OTP' };
  }
  
  const user = getCurrentUser();
  return { success: true, user: user || undefined };
}

export async function sendOTP(phone: string): Promise<{ success: boolean; error?: string }> {
  await realisticDelay();
  
  // Simulate sending OTP
  console.log(`[Mock] OTP sent to ${phone}: 123456`);
  return { success: true };
}

export async function checkAuthStatus(): Promise<AuthResponse> {
  await realisticDelay();
  
  const user = getCurrentUser();
  if (user) {
    return { success: true, user };
  }
  return { success: false, error: 'Not authenticated' };
}

