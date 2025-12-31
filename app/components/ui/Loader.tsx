// Loader - Core UI component
import { motion } from 'framer-motion';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'muted';
  text?: string;
}

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

const colors = {
  primary: 'border-kizuna-green',
  white: 'border-white',
  muted: 'border-charcoal-muted',
};

export default function Loader({ 
  size = 'md', 
  color = 'primary',
  text 
}: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`
          ${sizes[size]}
          border-2
          ${colors[color]}
          border-t-transparent
          rounded-full
          animate-spin
        `}
      />
      {text && (
        <span className="text-sm text-charcoal-muted">{text}</span>
      )}
    </div>
  );
}

// Full page loader
export function PageLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-washi-beige flex items-center justify-center z-50">
      <Loader size="lg" text={text} />
    </div>
  );
}

// Skeleton loader for content
export function Skeleton({ 
  className = '',
  animate = true 
}: { 
  className?: string;
  animate?: boolean;
}) {
  return (
    <div
      className={`
        bg-washi-beige-dark rounded
        ${animate ? 'animate-pulse' : ''}
        ${className}
      `}
    />
  );
}

// Kizuna branded loader with logo animation
export function KizunaLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="text-5xl"
      >
        絆
      </motion.div>
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="text-sm text-charcoal-muted font-medium tracking-wider"
      >
        KIZUNA
      </motion.div>
    </div>
  );
}

