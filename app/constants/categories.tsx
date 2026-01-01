import { Truck, Sparkles, Car, Hammer, UtensilsCrossed, ShoppingCart, Shield, HeartPulse, GraduationCap, Camera } from 'lucide-react';

export interface CategorySpec {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
}

export const NETWORK_CATEGORIES: CategorySpec[] = [
    { id: 'logistics', name: 'Logistics', icon: <Truck size={18} />, color: '#2A9D8F' },
    { id: 'drivers', name: 'Drivers', icon: <Car size={18} />, color: '#3C8F5A' },
    { id: 'engineering', name: 'Repairs', icon: <Hammer size={18} />, color: '#457B9D' },
    { id: 'food', name: 'Food', icon: <UtensilsCrossed size={18} />, color: '#E76F51' },
    { id: 'groceries', name: 'Groceries', icon: <ShoppingCart size={18} />, color: '#F4A261' },
    { id: 'tutors', name: 'Education', icon: <GraduationCap size={18} />, color: '#264653' },
    { id: 'medical', name: 'Health', icon: <HeartPulse size={18} />, color: '#D62828' },
    { id: 'security', name: 'Security', icon: <Shield size={18} />, color: '#1B3640' },
    { id: 'creative-arts', name: 'Creative', icon: <Camera size={18} />, color: '#9B5DE5' },
    { id: 'jack-of-all-trades', name: 'General Help', icon: <Sparkles size={18} />, color: '#6B7280' }
];
