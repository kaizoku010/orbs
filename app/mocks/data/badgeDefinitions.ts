// Badge Definitions - Achievement system for community members
// Badges are earned through ratings, completions, and streaks

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum';
export type BadgeRequirementType = 'rating' | 'completions' | 'streak' | 'special';

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;  // emoji
  tier: BadgeTier;
  requirement: {
    type: BadgeRequirementType;
    value: number;  // 5 for "5-star rating", 10 for "10 completions", etc.
  };
}

export interface UserBadge {
  badgeId: string;
  earnedAt: string;  // ISO timestamp
  count?: number;    // For stackable badges (e.g., Five Star earned 3 times)
}

// Achievement badge definitions
export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'five-star',
    name: 'Five Star',
    description: 'Received a 5-star rating',
    icon: '⭐',
    tier: 'gold',
    requirement: { type: 'rating', value: 5 }
  },
  {
    id: 'superstar',
    name: 'Superstar',
    description: 'Earned 5 five-star ratings',
    icon: '🌟',
    tier: 'platinum',
    requirement: { type: 'completions', value: 5 }
  },
  {
    id: 'neighborhood-hero',
    name: 'Neighborhood Hero',
    description: 'Completed 10 requests',
    icon: '💪',
    tier: 'gold',
    requirement: { type: 'completions', value: 10 }
  },
  {
    id: 'flawless-streak',
    name: 'Flawless',
    description: '5 consecutive 5-star ratings',
    icon: '🔥',
    tier: 'platinum',
    requirement: { type: 'streak', value: 5 }
  },
  {
    id: 'community-champion',
    name: 'Community Champion',
    description: 'Average rating 4.8+ with 10+ reviews',
    icon: '👑',
    tier: 'platinum',
    requirement: { type: 'special', value: 0 }
  },
  {
    id: 'trusted-member',
    name: 'Trusted Member',
    description: 'Completed your first request',
    icon: '✅',
    tier: 'silver',
    requirement: { type: 'completions', value: 1 }
  },
  {
    id: 'helpful-soul',
    name: 'Helpful Soul',
    description: 'Completed 5 requests',
    icon: '🤝',
    tier: 'bronze',
    requirement: { type: 'completions', value: 5 }
  },
];

export function getBadgeById(id: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find(b => b.id === id);
}

export function getBadgesByTier(tier: BadgeTier): BadgeDefinition[] {
  return BADGE_DEFINITIONS.filter(b => b.tier === tier);
}
