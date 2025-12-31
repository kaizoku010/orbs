// Badge - Reusable badge component with tier styling
import { motion } from 'framer-motion';
import BadgeIcon from './BadgeIcon';
import type { Badge as BadgeType, BadgeTier } from '~/mocks/store';
import { getBadgeTierColor } from '~/mocks/services/badgeService';

interface BadgeProps {
  badge: BadgeType;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  showDescription?: boolean;
  earned?: boolean;
  onClick?: () => void;
}

const sizeStyles = {
  sm: {
    container: 'w-10 h-10',
    icon: 'sm' as const,
    padding: 'p-2',
  },
  md: {
    container: 'w-14 h-14',
    icon: 'md' as const,
    padding: 'p-3',
  },
  lg: {
    container: 'w-20 h-20',
    icon: 'lg' as const,
    padding: 'p-4',
  },
};

const tierGlow: Record<BadgeTier, string> = {
  bronze: 'shadow-[0_0_12px_rgba(205,127,50,0.4)]',
  silver: 'shadow-[0_0_12px_rgba(192,192,192,0.5)]',
  gold: 'shadow-[0_0_16px_rgba(255,215,0,0.5)]',
  kizuna: 'shadow-[0_0_20px_rgba(60,143,90,0.6)]',
};

export default function Badge({
  badge,
  size = 'md',
  showName = false,
  showDescription = false,
  earned = true,
  onClick,
}: BadgeProps) {
  const styles = sizeStyles[size];
  const tierColor = getBadgeTierColor(badge.tier);

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      whileHover={earned ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
    >
      <button
        onClick={onClick}
        disabled={!onClick}
        className={`
          ${styles.container}
          ${styles.padding}
          rounded-full
          flex items-center justify-center
          transition-all duration-200
          ${earned 
            ? `bg-white ${tierGlow[badge.tier]} border-2`
            : 'bg-gray-100 opacity-40 grayscale'
          }
        `}
        style={{ borderColor: earned ? tierColor : '#D1D5DB' }}
      >
        <BadgeIcon 
          icon={badge.icon} 
          tier={earned ? badge.tier : 'bronze'} 
          size={styles.icon}
        />
      </button>

      {showName && (
        <span 
          className={`
            text-xs font-medium text-center leading-tight
            ${earned ? 'text-charcoal' : 'text-charcoal-muted'}
          `}
        >
          {badge.name}
        </span>
      )}

      {showDescription && earned && (
        <span className="text-xs text-charcoal-muted text-center max-w-[120px]">
          {badge.description}
        </span>
      )}
    </motion.div>
  );
}

