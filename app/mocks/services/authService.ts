// Auth Service - Simulates authentication API
import { realisticDelay } from '../delays';
import {
  getCurrentUser,
  setCurrentUser,
  getUsers,
  addUser,
  type User
} from '../store';
import { TEST_USER_ALICE, TEST_USER_BOB, TEST_CREDENTIALS } from '../data/testUsers';
import { saveUserToFirestore, getUserFromFirestore } from '~/services/firebaseService';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '~/lib/firebase';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'individual' | 'company';
  bio: string;
  avatar: string;
  lat: number;
  lng: number;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  await realisticDelay();

  // Try Firestore first
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", credentials.email));
  const querySnapshot = await getDocs(q);

  let user: User | undefined;
  let storedPassword: string | undefined;

  if (!querySnapshot.empty) {
    const userData = querySnapshot.docs[0].data();
    user = userData as User;
    storedPassword = userData.password;
  } else {
    // Fallback to mock users
    const mockUsers = getUsers();
    user = mockUsers.find(u => u.email === credentials.email);
    // For mock users, accept any password for now (in production, would check hashed password)
  }

  if (!user) {
    return { success: false, error: 'Invalid password' };
  }

  // In a real app, we'd verify hashed password here
  // For now, just check if password was provided
  if (!credentials.password) {
    return { success: false, error: 'Password is required' };
  }

  // If user has a stored password (from Firestore), verify it
  if (storedPassword && storedPassword !== credentials.password) {
    return { success: false, error: 'Invalid password' };
  }

  setCurrentUser(user.id);
  if (typeof window !== 'undefined') {
    localStorage.setItem('kizuna_current_user', JSON.stringify(user));
  }
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

  const users = getUsers();
  const usersRef = collection(db, "users");

  // Check if phone already exists in local store
  if (users.find(u => u.phone === data.phone)) {
    return { success: false, error: 'Phone number already registered' };
  }

  // Check if phone already exists in Firestore
  const phoneQuery = query(usersRef, where("phone", "==", data.phone));
  const phoneSnapshot = await getDocs(phoneQuery);

  if (!phoneSnapshot.empty) {
    return { success: false, error: 'Phone number already registered' };
  }

  // Check if email already exists in local store
  if (data.email && users.find(u => u.email === data.email)) {
    return { success: false, error: 'Email already registered' };
  }

  // Check if email already exists in Firestore
  if (data.email) {
    const emailQuery = query(usersRef, where("email", "==", data.email));
    const emailSnapshot = await getDocs(emailQuery);

    if (!emailSnapshot.empty) {
      return { success: false, error: 'Email already registered' };
    }
  }

  // Validate password
  if (!data.password || data.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  // Create new user (in real app, would save to DB)
  const newUser: User = {
    id: `user-${Date.now()}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
    role: data.role,
    password: data.password,
    verified: false,
    rating: 0,
    totalConnections: 0,
    trustLevel: 1,
    badges: [],
    xp: 0,
    location: {
      lat: data.lat || 0.33,
      lng: data.lng || 32.58,
      address: 'Kampala, Uganda'
    },
    bio: data.bio || '',
    joinedAt: new Date().toISOString().split('T')[0],
    skills: []
  };

  // Save to Firestore for persistence (including password)
  await saveUserToFirestore({ ...newUser, password: data.password });

  // Add to local store and set as current
  addUser(newUser);
  setCurrentUser(newUser.id);

  if (typeof window !== 'undefined') {
    localStorage.setItem('kizuna_current_user', JSON.stringify(newUser));
  }

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

