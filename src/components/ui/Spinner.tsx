export default function Spinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  }[size];

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={`rounded-full border-border border-t-gold animate-spin ${sizeClasses} ${className}`}
      />
    </div>
  );
}
