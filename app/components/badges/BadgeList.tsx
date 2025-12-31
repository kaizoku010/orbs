// BadgeList - Display a list of badges
import Badge from './Badge';
import type { Badge as BadgeType } from '~/mocks/store';

interface BadgeListProps {
  badges: BadgeType[];
  size?: 'sm' | 'md' | 'lg';
  showNames?: boolean;
  maxDisplay?: number;
  onBadgeClick?: (badge: BadgeType) => void;
}

export default function BadgeList({
  badges,
  size = 'sm',
  showNames = false,
  maxDisplay,
  onBadgeClick,
}: BadgeListProps) {
  const displayBadges = maxDisplay ? badges.slice(0, maxDisplay) : badges;
  const remainingCount = maxDisplay && badges.length > maxDisplay 
    ? badges.length - maxDisplay 
    : 0;

  if (badges.length === 0) {
    return (
      <div className="text-charcoal-muted text-sm py-4 text-center">
        No badges earned yet
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {displayBadges.map(badge => (
        <Badge
          key={badge.id}
          badge={badge}
          size={size}
          showName={showNames}
          onClick={onBadgeClick ? () => onBadgeClick(badge) : undefined}
        />
      ))}
      
      {remainingCount > 0 && (
        <div className="w-10 h-10 rounded-full bg-washi-beige-dark flex items-center justify-center">
          <span className="text-xs font-medium text-charcoal">
            +{remainingCount}
          </span>
        </div>
      )}
    </div>
  );
}

