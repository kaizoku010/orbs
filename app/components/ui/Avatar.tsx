// Avatar - Core UI component
import type { ImgHTMLAttributes } from 'react';

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  name?: string;
  status?: 'online' | 'offline' | 'busy' | 'away';
  verified?: boolean;
}

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-xl',
};

const statusColors = {
  online: 'bg-kizuna-green',
  offline: 'bg-gray-400',
  busy: 'bg-red-500',
  away: 'bg-yellow-500',
};

// Generate initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// Generate consistent color from name
function getColorFromName(name: string): string {
  const colors = [
    '#3C8F5A', '#264653', '#E76F51', '#2A9D8F', 
    '#9B5DE5', '#F77F00', '#457B9D', '#E63946'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function Avatar({
  src,
  alt,
  size = 'md',
  name = '',
  status,
  verified = false,
  className = '',
  ...props
}: AvatarProps) {
  const sizeClass = sizes[size];
  const showFallback = !src;

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {showFallback ? (
        <div
          className={`
            ${sizeClass}
            rounded-full
            flex items-center justify-center
            font-medium text-white
          `}
          style={{ backgroundColor: getColorFromName(name) }}
        >
          {getInitials(name || 'U')}
        </div>
      ) : (
        <img
          src={src}
          alt={alt || name}
          className={`
            ${sizeClass}
            rounded-full
            object-cover
            bg-washi-beige
          `}
          {...props}
        />
      )}

      {/* Status indicator */}
      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            w-3 h-3 rounded-full
            border-2 border-white
            ${statusColors[status]}
          `}
        />
      )}

      {/* Verified badge */}
      {verified && (
        <span
          className="
            absolute -bottom-0.5 -right-0.5
            w-4 h-4 rounded-full
            bg-kizuna-green
            flex items-center justify-center
          "
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
      )}
    </div>
  );
}

