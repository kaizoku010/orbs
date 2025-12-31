// Badge Service - Simulates badges/gamification API
import { realisticDelay } from '../delays';
import {
  getBadges,
  getBadgeById,
  getUserBadges,
  awardBadge,
  getUserById,
  badgeTierColors,
  type Badge,
  type BadgeTier,
  type BadgeCategory
} from '../store';

export interface BadgeResponse {
  success: boolean;
  badge?: Badge;
  error?: string;
}

export interface BadgesResponse {
  success: boolean;
  badges?: Badge[];
  error?: string;
}

export async function fetchAllBadges(): Promise<BadgesResponse> {
  await realisticDelay();
  return { success: true, badges: getBadges() };
}

export async function fetchBadgeById(id: string): Promise<BadgeResponse> {
  await realisticDelay();
  const badge = getBadgeById(id);
  if (badge) {
    return { success: true, badge };
  }
  return { success: false, error: 'Badge not found' };
}

export async function fetchBadgesByCategory(category: BadgeCategory): Promise<BadgesResponse> {
  await realisticDelay();
  const badges = getBadges().filter(b => b.category === category);
  return { success: true, badges };
}

export async function fetchBadgesByTier(tier: BadgeTier): Promise<BadgesResponse> {
  await realisticDelay();
  const badges = getBadges().filter(b => b.tier === tier);
  return { success: true, badges };
}

export async function fetchUserBadges(userId: string): Promise<BadgesResponse> {
  await realisticDelay();
  const badges = getUserBadges(userId);
  return { success: true, badges };
}

export async function awardBadgeToUser(
  userId: string, 
  badgeId: string
): Promise<BadgeResponse> {
  await realisticDelay();
  
  const success = awardBadge(userId, badgeId);
  if (success) {
    const badge = getBadgeById(badgeId);
    return { success: true, badge };
  }
  return { success: false, error: 'Failed to award badge' };
}

// Check if user qualifies for any new badges
export async function checkBadgeProgress(userId: string): Promise<{
  success: boolean;
  eligible: Badge[];
  earned: Badge[];
}> {
  await realisticDelay();
  
  const user = getUserById(userId);
  if (!user) {
    return { success: false, eligible: [], earned: [] };
  }
  
  const allBadges = getBadges();
  const userBadges = getUserBadges(userId);
  const userBadgeIds = userBadges.map(b => b.id);
  
  const eligible: Badge[] = [];
  
  // Check eligibility for each badge
  for (const badge of allBadges) {
    if (userBadgeIds.includes(badge.id)) continue;
    
    // Simple eligibility checks (would be more complex in real app)
    if (badge.id === 'verified-identity' && user.verified) {
      eligible.push(badge);
    }
    if (badge.id === 'first-gig' && user.totalGigs >= 1) {
      eligible.push(badge);
    }
    if (badge.id === 'ten-gigs' && user.totalGigs >= 10) {
      eligible.push(badge);
    }
    if (badge.id === 'fifty-gigs' && user.totalGigs >= 50) {
      eligible.push(badge);
    }
    if (badge.id === 'centurion' && user.totalGigs >= 100) {
      eligible.push(badge);
    }
  }
  
  return { success: true, eligible, earned: userBadges };
}

// Get badge tier color
export function getBadgeTierColor(tier: BadgeTier): string {
  return badgeTierColors[tier];
}

// Calculate XP needed for next trust level
export function getXPForNextLevel(currentXP: number): { 
  currentLevel: number; 
  nextLevelXP: number; 
  progress: number;
} {
  const levels = [0, 500, 1500, 3500, 7000, 15000];
  let currentLevel = 1;
  
  for (let i = 1; i < levels.length; i++) {
    if (currentXP >= levels[i]) {
      currentLevel = i + 1;
    } else {
      break;
    }
  }
  
  const nextLevelXP = levels[currentLevel] || levels[levels.length - 1];
  const prevLevelXP = levels[currentLevel - 1] || 0;
  const progress = ((currentXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100;
  
  return { currentLevel, nextLevelXP, progress: Math.min(progress, 100) };
}

