import React from 'react';

interface BadgeProps {
  variant?: 'gold' | 'charcoal' | 'outline' | 'subtle';
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = 'charcoal', children, className = '' }: BadgeProps) {
  const base = 'text-[10px] tracking-widest font-sans uppercase px-2.5 py-1 font-medium inline-flex items-center justify-center';

  const variants = {
    charcoal: 'bg-charcoal text-ivory',
    gold: 'bg-gold text-charcoal',
    outline: 'border border-border text-charcoal',
    subtle: 'bg-light-taupe text-taupe',
  }[variant];

  return <span className={`${base} ${variants} ${className}`}>{children}</span>;
}
