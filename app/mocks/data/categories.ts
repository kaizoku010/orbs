// Mock Categories Data - Single Source of Truth
export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  subcategories: string[];
  deliverable: boolean;
  color: string;
}

export const categories: Category[] = [
  {
    id: 'drivers',
    name: 'Drivers',
    icon: 'car',
    description: 'Personal drivers, chauffeurs, and ride services',
    subcategories: ['Personal Driver', 'Chauffeur', 'Airport Transfer', 'Event Driver'],
    deliverable: false,
    color: '#3C8F5A'
  },
  {
    id: 'tutors',
    name: 'Tutors',
    icon: 'graduation-cap',
    description: 'Academic tutoring and skill training',
    subcategories: ['Mathematics', 'Sciences', 'Languages', 'Music', 'Test Prep'],
    deliverable: false,
    color: '#264653'
  },
  {
    id: 'food',
    name: 'Food',
    icon: 'utensils',
    description: 'Home cooking, catering, and meal prep',
    subcategories: ['Home Cooking', 'Catering', 'Meal Prep', 'Baking', 'Special Diets'],
    deliverable: true,
    color: '#E76F51'
  },
  {
    id: 'logistics',
    name: 'Logistics',
    icon: 'truck',
    description: 'Delivery, moving, and courier services',
    subcategories: ['Same-day Delivery', 'Moving', 'Courier', 'Freight'],
    deliverable: true,
    color: '#2A9D8F'
  },
  {
    id: 'security',
    name: 'Security',
    icon: 'shield',
    description: 'Personal security and event protection',
    subcategories: ['Personal Bodyguard', 'Event Security', 'Night Watch', 'Escort'],
    deliverable: false,
    color: '#1B3640'
  },
  {
    id: 'creative-arts',
    name: 'Creative Arts',
    icon: 'palette',
    description: 'Photography, design, and artistic services',
    subcategories: ['Photography', 'Videography', 'Graphic Design', 'Illustration', 'Music'],
    deliverable: true,
    color: '#9B5DE5'
  },
  {
    id: 'gym-partner',
    name: 'Gym Partner',
    icon: 'dumbbell',
    description: 'Fitness training and workout partners',
    subcategories: ['Personal Trainer', 'Workout Buddy', 'Yoga', 'CrossFit'],
    deliverable: false,
    color: '#F77F00'
  },
  {
    id: 'engineering',
    name: 'Engineering',
    icon: 'wrench',
    description: 'Technical repairs and installations',
    subcategories: ['Electrical', 'Plumbing', 'HVAC', 'Electronics', 'Mechanical'],
    deliverable: false,
    color: '#457B9D'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    icon: 'scissors',
    description: 'Tailoring, styling, and fashion services',
    subcategories: ['Tailoring', 'Styling', 'Alterations', 'Custom Design'],
    deliverable: true,
    color: '#E63946'
  },
  {
    id: 'medical',
    name: 'Medical',
    icon: 'heart-pulse',
    description: 'Home healthcare and wellness services',
    subcategories: ['Home Nursing', 'Physiotherapy', 'Elder Care', 'First Aid'],
    deliverable: false,
    color: '#D62828'
  },
  {
    id: 'pets',
    name: 'Pets',
    icon: 'paw-print',
    description: 'Pet care, grooming, and sitting',
    subcategories: ['Dog Walking', 'Pet Sitting', 'Grooming', 'Vet Visits'],
    deliverable: false,
    color: '#8B5CF6'
  },
  {
    id: 'jack-of-all-trades',
    name: 'Jack of All Trades',
    icon: 'sparkles',
    description: 'General help and miscellaneous tasks',
    subcategories: ['Errands', 'Assembly', 'Cleaning', 'Organization', 'General Help'],
    deliverable: true,
    color: '#6B7280'
  }
];

