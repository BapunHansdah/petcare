import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'frosted' | 'elevated';
}

export function Card({ children, className, variant = 'glass' }: CardProps) {
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm',
    glass: 'bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl shadow-black/5',
    frosted: 'bg-white/60 backdrop-blur-2xl border border-white/30 shadow-2xl shadow-black/10',
    elevated: 'bg-white/80 backdrop-blur-lg border border-white/40 shadow-2xl shadow-black/20'
  };

  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl hover:shadow-black/10 hover:-translate-y-1',
        variants[variant],
        className
      )}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({
  children,
  className,
  variant = 'default',
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient';
}) {
  const variants = {
    default: 'bg-white/50 border-b border-white/20',
    glass: 'bg-gradient-to-r from-white/30 to-white/10 border-b border-white/20',
    gradient: 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-b border-white/30'
  };

  return (
    <div
      className={cn(
        'p-6 font-semibold text-gray-800 backdrop-blur-sm',
        variants[variant],
        className
      )}
    >
      {children}
    </div>
  );
};

Card.Content = function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('p-6 text-gray-700', className)}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({
  children,
  className,
  variant = 'default',
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient';
}) {
  const variants = {
    default: 'bg-white/30 border-t border-white/20',
    glass: 'bg-gradient-to-r from-white/20 to-white/5 border-t border-white/20',
    gradient: 'bg-gradient-to-r from-gray-50/60 to-white/40 border-t border-white/30'
  };

  return (
    <div
      className={cn(
        'p-6 flex items-center justify-between backdrop-blur-sm',
        variants[variant],
        className
      )}
    >
      {children}
    </div>
  );
};

// Additional glassy card variants
Card.Minimal = function CardMinimal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'bg-white/40 backdrop-blur-lg rounded-3xl border border-white/30 shadow-lg shadow-black/5 p-6 transition-all duration-300 hover:bg-white/50 hover:shadow-xl hover:shadow-black/10',
        className
      )}
    >
      {children}
    </div>
  );
};

Card.Spotlight = function CardSpotlight({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative bg-gradient-to-br from-white/70 via-white/50 to-white/30 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl shadow-black/10 overflow-hidden group transition-all duration-500 hover:shadow-3xl hover:shadow-black/20',
        className
      )}
    >
      {/* Spotlight effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};