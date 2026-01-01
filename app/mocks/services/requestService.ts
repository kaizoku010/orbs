// Request Service - Simulates requests API
// Requests are how community members ask for help
import { realisticDelay } from '../delays';
import {
  getRequests,
  getRequestById,
  getRequestsByStatus,
  getRequestsByUser,
  getOpenRequests,
  addRequest,
  updateRequest,
  getCurrentUser,
  type Request,
  type RequestStatus
} from '../store';

export interface RequestResponse {
  success: boolean;
  request?: Request;
  error?: string;
}

export interface RequestsResponse {
  success: boolean;
  requests?: Request[];
  error?: string;
}

export interface CreateRequestData {
  title: string;
  description: string;
  categoryId: string;
  subcategory: string;
  budget: number;
  urgent: boolean;
  deliverable: boolean;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  scheduledFor?: string;
  images?: string[];
}

export async function fetchAllRequests(): Promise<RequestsResponse> {
  await realisticDelay();
  return { success: true, requests: getRequests() };
}

export async function fetchRequestById(id: string): Promise<RequestResponse> {
  await realisticDelay();
  const request = getRequestById(id);
  if (request) {
    return { success: true, request };
  }
  return { success: false, error: 'Request not found' };
}

export async function fetchOpenRequests(): Promise<RequestsResponse> {
  await realisticDelay();
  return { success: true, requests: getOpenRequests() };
}

export async function fetchRequestsByStatus(status: RequestStatus): Promise<RequestsResponse> {
  await realisticDelay();
  return { success: true, requests: getRequestsByStatus(status) };
}

export async function fetchUserRequests(userId: string): Promise<RequestsResponse> {
  await realisticDelay();
  return { success: true, requests: getRequestsByUser(userId) };
}

export async function fetchMyRequests(): Promise<RequestsResponse> {
  await realisticDelay();
  const user = getCurrentUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }
  return { success: true, requests: getRequestsByUser(user.id) };
}

// Ask for help - create a new request
export async function createRequest(data: CreateRequestData): Promise<RequestResponse> {
  await realisticDelay();
  
  const user = getCurrentUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }
  
  const newRequest: Request = {
    id: `request-${Date.now()}`,
    ...data,
    currency: 'NGN',
    status: 'open',
    askerId: user.id,
    supporterId: null,
    images: data.images || [],
    createdAt: new Date().toISOString(),
    scheduledFor: data.scheduledFor || null,
    fulfilledAt: null
  };
  
  addRequest(newRequest);
  return { success: true, request: newRequest };
}

// Offer support - connect with a request
export async function offerSupport(requestId: string): Promise<RequestResponse> {
  await realisticDelay();
  
  const user = getCurrentUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }
  
  const updated = updateRequest(requestId, { 
    supporterId: user.id, 
    status: 'connected' 
  });
  
  if (updated) {
    return { success: true, request: updated };
  }
  return { success: false, error: 'Failed to connect' };
}

// Start working on a request
export async function startRequest(requestId: string): Promise<RequestResponse> {
  await realisticDelay();
  const updated = updateRequest(requestId, { status: 'in-progress' });
  if (updated) {
    return { success: true, request: updated };
  }
  return { success: false, error: 'Failed to start request' };
}

// Confirm & Start Request - transition to enroute status with timer
export async function confirmRequest(requestId: string, estimatedDuration: number = 30): Promise<RequestResponse> {
  await realisticDelay();
  
  const user = getCurrentUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }
  
  const updated = updateRequest(requestId, { 
    status: 'enroute',
    supporterId: user.id,
    startedAt: new Date().toISOString(),
    estimatedDuration
  });
  
  if (updated) {
    return { success: true, request: updated };
  }
  return { success: false, error: 'Failed to confirm request' };
}

// Fulfill a request - mark as complete
export async function fulfillRequest(requestId: string): Promise<RequestResponse> {
  await realisticDelay();
  const updated = updateRequest(requestId, { 
    status: 'fulfilled',
    completedAt: new Date().toISOString(),
    fulfilledAt: new Date().toISOString()
  });
  if (updated) {
    return { success: true, request: updated };
  }
  return { success: false, error: 'Failed to fulfill request' };
}

// Cancel a request
export async function cancelRequest(requestId: string): Promise<RequestResponse> {
  await realisticDelay();
  const updated = updateRequest(requestId, { status: 'cancelled' });
  if (updated) {
    return { success: true, request: updated };
  }
  return { success: false, error: 'Failed to cancel request' };
}

