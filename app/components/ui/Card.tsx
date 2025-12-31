// Card - Core UI component
import { motion } from 'framer-motion';
import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  children: ReactNode;
}

const variants = {
  default: 'bg-white shadow-card',
  elevated: 'bg-white shadow-lg',
  outlined: 'bg-white border border-washi-beige-dark',
};

const paddings = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

export default function Card({
  variant = 'default',
  padding = 'md',
  hover = false,
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.01 } : undefined}
      className={`
        rounded-lg
        ${variants[variant]}
        ${paddings[padding]}
        ${hover ? 'cursor-pointer transition-shadow hover:shadow-lg' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Card subcomponents for composition
export function CardHeader({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <h3 className={`text-lg font-semibold text-charcoal ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <p className={`text-sm text-charcoal-muted mt-1 ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function CardFooter({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <div className={`mt-4 pt-4 border-t border-washi-beige-dark ${className}`}>
      {children}
    </div>
  );
}

