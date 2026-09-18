import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-sans font-medium uppercase tracking-widest transition-all duration-300 focus-visible:outline-none';

  const variantStyles = {
    primary: 'bg-charcoal text-ivory hover:bg-gold hover:text-charcoal focus-visible:ring-2 focus-visible:ring-gold',
    outline: 'border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory focus-visible:ring-2 focus-visible:ring-charcoal',
    ghost: 'text-charcoal hover:text-gold bg-transparent',
    gold: 'bg-gold text-charcoal hover:bg-charcoal hover:text-ivory focus-visible:ring-2 focus-visible:ring-gold',
  }[variant];

  const sizeStyles = {
    sm: 'text-xs px-4 py-2',
    md: 'text-sm px-7 py-3',
    lg: 'text-sm sm:text-base px-9 py-4',
  }[size];

  const widthStyle = fullWidth ? 'w-full' : '';
  const disabledStyle = disabled || loading ? 'opacity-60 cursor-not-allowed' : '';

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${widthStyle} ${disabledStyle} ${className}`}
      {...props}
    >
      {loading && (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      )}
      {children}
    </button>
  );
}
