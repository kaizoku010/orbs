// Mock Badges Data - Single Source of Truth
export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'kizuna';
export type BadgeCategory = 'trust' | 'milestone' | 'community' | 'skill' | 'special';

export interface Badge {
  id: string;
  name: string;
  icon: string; // SVG component name - swappable
  category: BadgeCategory;
  tier: BadgeTier;
  description: string;
  xpReward: number;
  requirement: string;
}

export const badges: Badge[] = [
  // Trust Badges
  {
    id: 'verified-identity',
    name: 'Verified Identity',
    icon: 'shield-check',
    category: 'trust',
    tier: 'bronze',
    description: 'Completed identity verification',
    xpReward: 50,
    requirement: 'Complete ID verification'
  },
  {
    id: 'verified-business',
    name: 'Verified Business',
    icon: 'building-check',
    category: 'trust',
    tier: 'silver',
    description: 'Business registration verified',
    xpReward: 100,
    requirement: 'Submit business documents'
  },
  {
    id: 'trusted-captain',
    name: 'Trusted Captain',
    icon: 'anchor',
    category: 'trust',
    tier: 'gold',
    description: 'Achieved 100% completion rate on 20+ gigs',
    xpReward: 250,
    requirement: 'Complete 20 gigs with 100% success'
  },

  // Milestone Badges
  {
    id: 'first-gig',
    name: 'First Steps',
    icon: 'footprints',
    category: 'milestone',
    tier: 'bronze',
    description: 'Completed your first gig',
    xpReward: 100,
    requirement: 'Complete 1 gig'
  },
  {
    id: 'ten-gigs',
    name: 'Rising Star',
    icon: 'star',
    category: 'milestone',
    tier: 'bronze',
    description: 'Completed 10 gigs',
    xpReward: 200,
    requirement: 'Complete 10 gigs'
  },
  {
    id: 'fifty-gigs',
    name: 'Experienced',
    icon: 'medal',
    category: 'milestone',
    tier: 'silver',
    description: 'Completed 50 gigs',
    xpReward: 500,
    requirement: 'Complete 50 gigs'
  },
  {
    id: 'centurion',
    name: 'Centurion',
    icon: 'crown',
    category: 'milestone',
    tier: 'gold',
    description: 'Completed 100 gigs',
    xpReward: 1000,
    requirement: 'Complete 100 gigs'
  },

  // Community Badges
  {
    id: 'community-builder',
    name: 'Community Builder',
    icon: 'users',
    category: 'community',
    tier: 'silver',
    description: 'Referred 5 new members who completed gigs',
    xpReward: 300,
    requirement: 'Refer 5 active members'
  },
  {
    id: 'neighborhood-hero',
    name: 'Neighborhood Hero',
    icon: 'home-heart',
    category: 'community',
    tier: 'gold',
    description: 'Top rated in your local area',
    xpReward: 500,
    requirement: 'Achieve top 10 rating in your area'
  },
  {
    id: 'repeat-connector',
    name: 'Repeat Connector',
    icon: 'link',
    category: 'community',
    tier: 'silver',
    description: 'Completed 10+ gigs with repeat clients',
    xpReward: 350,
    requirement: 'Build 10 repeat relationships'
  },

  // Skill Badges
  {
    id: 'master-driver',
    name: 'Master Driver',
    icon: 'car',
    category: 'skill',
    tier: 'gold',
    description: 'Expert in driving category with 4.8+ rating',
    xpReward: 400,
    requirement: '50+ driver gigs with 4.8+ rating'
  },
  {
    id: 'master-tutor',
    name: 'Master Tutor',
    icon: 'book-open',
    category: 'skill',
    tier: 'gold',
    description: 'Expert in tutoring category with 4.8+ rating',
    xpReward: 400,
    requirement: '50+ tutor gigs with 4.8+ rating'
  },
  {
    id: 'culinary-expert',
    name: 'Culinary Expert',
    icon: 'chef-hat',
    category: 'skill',
    tier: 'gold',
    description: 'Expert in food category with 4.8+ rating',
    xpReward: 400,
    requirement: '50+ food gigs with 4.8+ rating'
  },

  // Special Badges
  {
    id: 'early-adopter',
    name: 'Early Adopter',
    icon: 'rocket',
    category: 'special',
    tier: 'kizuna',
    description: 'Joined KIZUNA in the first month',
    xpReward: 500,
    requirement: 'Join during launch period'
  },
  {
    id: 'green-captain',
    name: 'Green Captain',
    icon: 'leaf',
    category: 'special',
    tier: 'kizuna',
    description: 'Committed to eco-friendly service delivery',
    xpReward: 300,
    requirement: 'Complete eco-friendly certification'
  },
  {
    id: 'kizuna-legend',
    name: 'KIZUNA Legend',
    icon: 'sparkles',
    category: 'special',
    tier: 'kizuna',
    description: 'Achieved legendary status in the community',
    xpReward: 2000,
    requirement: '500+ gigs, 4.9+ rating, 50+ repeat clients'
  }
];

// Badge tier colors (matching design tokens)
export const badgeTierColors: Record<BadgeTier, string> = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  kizuna: '#3C8F5A'
};

