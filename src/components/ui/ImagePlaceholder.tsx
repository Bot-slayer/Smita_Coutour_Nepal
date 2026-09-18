import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ImagePlaceholderProps {
  src?: string;
  alt?: string;
  aspectRatio?: 'portrait' | 'square' | 'wide' | 'banner' | 'free';
  title?: string;
  subtitle?: string;
  className?: string;
  overlay?: React.ReactNode;
  priority?: boolean;
}

export default function ImagePlaceholder({
  src,
  alt = 'Product image',
  aspectRatio = 'portrait',
  title,
  subtitle,
  className = '',
  overlay,
}: ImagePlaceholderProps) {
  const aspectClasses = {
    portrait: 'aspect-[3/4]',
    square: 'aspect-square',
    wide: 'aspect-[16/9]',
    banner: 'aspect-[21/9]',
    free: 'h-full w-full',
  }[aspectRatio];

  if (src) {
    return (
      <div className={`relative overflow-hidden bg-light-taupe ${aspectClasses} ${className}`}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {overlay}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-b from-[#F3EEEA] to-[#E9E3DC] border border-border/80 flex flex-col items-center justify-center p-6 text-center select-none ${aspectClasses} ${className}`}
    >
      {/* Luxury Framing */}
      <div className="absolute inset-3 border border-charcoal/5 pointer-events-none" />

      {/* Center Icon & Info */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-2 max-w-[85%]">
        <div className="w-10 h-10 border border-charcoal/15 bg-white/40 flex items-center justify-center mb-1 backdrop-blur-xs">
          <ImageIcon className="w-4 h-4 text-taupe" strokeWidth={1.5} />
        </div>

        {title && (
          <span className="font-serif text-xs text-charcoal/80 font-medium tracking-wide line-clamp-1">
            {title}
          </span>
        )}

        {subtitle && (
          <span className="text-[10px] tracking-widest uppercase font-sans text-taupe/80">
            {subtitle}
          </span>
        )}
      </div>

      {overlay}
    </div>
  );
}
