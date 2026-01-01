// Rating Service - Manages ratings and reviews
import { realisticDelay } from '../delays';
import { getUserById, updateRequest } from '../store';
import type { User } from '../data/users';

export interface RatingSubmission {
  requestId: string;
  ratedBy: string;      // User ID of rater
  ratedUser: string;    // User ID being rated (supporter)
  score: 1 | 2 | 3 | 4 | 5;
  comment?: string;
}

export interface RatingResponse {
  success: boolean;
  message?: string;
  error?: string;
  newRating?: number;   // Updated average rating
}

/**
 * Submit a rating for a request
 */
export async function submitRating(rating: RatingSubmission): Promise<RatingResponse> {
  await realisticDelay();

  const ratedUser = getUserById(rating.ratedUser);
  if (!ratedUser) {
    return { success: false, error: 'User not found' };
  }

  // Update user ratings
  if (!ratedUser.ratingsBreakdown) {
    ratedUser.ratingsBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  }

  ratedUser.ratingsBreakdown[rating.score]++;
  ratedUser.totalRatingsReceived = (ratedUser.totalRatingsReceived || 0) + 1;

  // Calculate new average
  const breakdown = ratedUser.ratingsBreakdown;
  const totalRatings = ratedUser.totalRatingsReceived;
  const sum = breakdown[5] * 5 + breakdown[4] * 4 + breakdown[3] * 3 + breakdown[2] * 2 + breakdown[1] * 1;
  ratedUser.averageRating = totalRatings > 0 ? sum / totalRatings : 0;

  // Update request with rating
  const updated = updateRequest(rating.requestId, {
    ratings: {
      [rating.ratedUser]: {
        rating: rating.score,
        comment: rating.comment,
        ratedAt: new Date().toISOString()
      }
    }
  });

  if (!updated) {
    return { success: false, error: 'Failed to update request' };
  }

  return {
    success: true,
    message: `Rating submitted! User now has ${ratedUser.averageRating.toFixed(2)} average rating`,
    newRating: ratedUser.averageRating
  };
}

/**
 * Get user's average rating
 */
export async function getUserRating(userId: string): Promise<{
  success: boolean;
  averageRating: number;
  totalRatings: number;
  breakdown?: { 1: number; 2: number; 3: number; 4: number; 5: number };
}> {
  await realisticDelay();

  const user = getUserById(userId);
  if (!user) {
    return { success: false, averageRating: 0, totalRatings: 0 };
  }

  return {
    success: true,
    averageRating: user.averageRating || 0,
    totalRatings: user.totalRatingsReceived || 0,
    breakdown: user.ratingsBreakdown
  };
}

/**
 * Get all ratings for a user
 */
export async function getUserRatings(userId: string): Promise<{
  success: boolean;
  ratings: Array<{
    score: 1 | 2 | 3 | 4 | 5;
    comment?: string;
    ratedAt: string;
    ratedBy: string;
  }>;
}> {
  await realisticDelay();

  const user = getUserById(userId);
  if (!user) {
    return { success: false, ratings: [] };
  }

  // This would normally fetch from requests, for now return empty
  return { success: true, ratings: [] };
}
