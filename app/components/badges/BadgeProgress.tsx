// BadgeProgress - Shows progress toward earning a badge
import { motion } from 'framer-motion';
import BadgeIcon from './BadgeIcon';
import type { Badge as BadgeType } from '~/mocks/store';
import { getBadgeTierColor } from '~/mocks/services/badgeService';

interface BadgeProgressProps {
  badge: BadgeType;
  current: number;
  target: number;
}

export default function BadgeProgress({
  badge,
  current,
  target,
}: BadgeProgressProps) {
  const progress = Math.min((current / target) * 100, 100);
  const tierColor = getBadgeTierColor(badge.tier);
  const isComplete = progress >= 100;

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-card">
      <div 
        className={`
          w-14 h-14 rounded-full flex items-center justify-center
          ${isComplete ? 'bg-kizuna-green/10' : 'bg-washi-beige'}
        `}
      >
        <BadgeIcon 
          icon={badge.icon} 
          tier={isComplete ? badge.tier : 'bronze'} 
          size="md"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-charcoal truncate">
          {badge.name}
        </h4>
        <p className="text-xs text-charcoal-muted mb-2">
          {badge.requirement}
        </p>
        
        {/* Progress bar */}
        <div className="h-2 bg-washi-beige rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: tierColor }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        
        <div className="flex justify-between mt-1">
          <span className="text-xs text-charcoal-muted">
            {current} / {target}
          </span>
          <span className="text-xs font-medium" style={{ color: tierColor }}>
            +{badge.xpReward} XP
          </span>
        </div>
      </div>
    </div>
  );
}

