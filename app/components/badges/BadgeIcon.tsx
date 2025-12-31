// BadgeIcon - Reusable SVG badge icons (swappable)
// Replace these placeholder SVGs with final designs later

import type { BadgeTier } from '~/mocks/store';
import { getBadgeTierColor } from '~/mocks/services/badgeService';

interface BadgeIconProps {
  icon: string;
  tier?: BadgeTier;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

// Placeholder SVG icons - Replace with custom designs
const iconPaths: Record<string, string> = {
  // Trust badges
  'shield-check': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4',
  'building-check': 'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18H6z M6 12H4a2 2 0 0 0-2 2v6h4 M18 12h2a2 2 0 0 1 2 2v6h-4 M10 6h4 M10 10h4 M10 14h4 M10 18h4',
  'anchor': 'M12 22V8 M5 12H2a10 10 0 0 0 20 0h-3 M12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  
  // Milestone badges
  'footprints': 'M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0z M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6-1.87 0-2.5 1.8-2.5 3.5 0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0z',
  'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'medal': 'M12 8a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M12 2v12 M8.21 13.89L7 23l5-3 5 3-1.21-9.12',
  'crown': 'M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z M2 16h20 M5 20h14',
  
  // Community badges
  'users': 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  'home-heart': 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  'link': 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  
  // Skill badges
  'car': 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2 M7 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M17 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  'book-open': 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
  'chef-hat': 'M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6z M6 17h12',
  
  // Special badges
  'rocket': 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0 M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5',
  'leaf': 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12',
  'sparkles': 'M12 3v4 M12 17v4 M3 12h4 M17 12h4 M5.64 5.64l2.83 2.83 M15.54 15.54l2.83 2.83 M5.64 18.36l2.83-2.83 M15.54 8.46l2.83-2.83',
};

// Default fallback icon
const defaultIcon = 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5';

export default function BadgeIcon({ 
  icon, 
  tier = 'bronze', 
  size = 'md',
  className = '' 
}: BadgeIconProps) {
  const pixelSize = sizeMap[size];
  const color = getBadgeTierColor(tier);
  const pathData = iconPaths[icon] || defaultIcon;

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {pathData.split(' M').map((segment, i) => (
        <path key={i} d={i === 0 ? segment : `M${segment}`} />
      ))}
    </svg>
  );
}

