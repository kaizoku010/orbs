import React from 'react';
import type { BadgeDefinition } from '~/mocks/data/badgeDefinitions';

interface BadgeDisplayProps {
  badge: BadgeDefinition;
  earnedAt?: string;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

export default function BadgeDisplay({
  badge,
  earnedAt,
  count,
  size = 'md',
  showDescription = false
}: BadgeDisplayProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl'
  };

  const tierColors = {
    bronze: 'bg-amber-100 border-amber-300 text-amber-900',
    silver: 'bg-gray-100 border-gray-300 text-gray-900',
    gold: 'bg-yellow-100 border-yellow-300 text-yellow-900',
    platinum: 'bg-purple-100 border-purple-300 text-purple-900'
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`${sizeClasses[size]} ${tierColors[badge.tier]} rounded-lg border-2 flex items-center justify-center font-bold shadow-md hover:scale-110 transition-transform`}
        title={badge.description}
      >
        {badge.icon}
      </div>
      {size !== 'sm' && (
        <>
          <p className="text-xs font-bold text-center leading-tight">{badge.name}</p>
          {count && count > 1 && (
            <p className="text-[10px] text-gray-500">x{count}</p>
          )}
          {showDescription && (
            <p className="text-[10px] text-gray-600 text-center max-w-xs">{badge.description}</p>
          )}
          {earnedAt && (
            <p className="text-[9px] text-gray-400">
              {new Date(earnedAt).toLocaleDateString()}
            </p>
          )}
        </>
      )}
    </div>
  );
}
