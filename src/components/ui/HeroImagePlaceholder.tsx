import React from 'react';
import { Camera, Sparkles } from 'lucide-react';

interface HeroImagePlaceholderProps {
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Luxury Fashion Hero Image Placeholder
 * Maintains professional luxury aesthetics before an image is supplied,
 * with clearly designated image insertion point.
 */
export default function HeroImagePlaceholder({
  imageSrc,
  imageAlt = 'Smita Couture Nepal Hero Campaign',
  className = '',
  children,
}: HeroImagePlaceholderProps) {
  if (imageSrc) {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover object-center"
        />
        {children}
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full min-h-[75vh] lg:min-h-[88vh] bg-gradient-to-br from-[#1F1E1D] via-[#141414] to-[#0D0D0D] flex items-center justify-center overflow-hidden select-none ${className}`}
    >
      {/* Luxury Editorial Geometric Framing */}
      <div className="absolute inset-6 sm:inset-12 border border-gold/15 pointer-events-none" />
      <div className="absolute inset-8 sm:inset-16 border border-white/5 pointer-events-none" />

      {/* Subtle Corner Accents */}
      <div className="absolute top-6 left-6 sm:top-12 sm:left-12 w-4 h-4 border-t-2 border-l-2 border-gold/40" />
      <div className="absolute top-6 right-6 sm:top-12 sm:right-12 w-4 h-4 border-t-2 border-r-2 border-gold/40" />
      <div className="absolute bottom-6 left-6 sm:bottom-12 sm:left-12 w-4 h-4 border-b-2 border-l-2 border-gold/40" />
      <div className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 w-4 h-4 border-b-2 border-r-2 border-gold/40" />

      {/* Decorative Editorial Watermark */}
      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-[0.03] pointer-events-none">
        <span className="font-serif text-8xl sm:text-[14rem] font-bold tracking-widest text-ivory">SCN</span>
      </div>

      {/* Placeholder Guidance (discreet & high fashion) */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
        <div className="w-16 h-16 rounded-full border border-gold/30 bg-charcoal/40 backdrop-blur-md flex items-center justify-center mb-6 shadow-2xl">
          <Camera className="w-6 h-6 text-gold/80" strokeWidth={1.5} />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 border border-gold/20 bg-gold/5 mb-3">
          <Sparkles className="w-3 h-3 text-gold" />
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-sans font-medium">
            Hero Campaign Canvas
          </span>
        </div>

        <h3 className="font-serif text-xl sm:text-2xl text-ivory/90 font-normal tracking-wider mb-2">
          Smita Couture Editorial Space
        </h3>
        <p className="text-xs tracking-widest uppercase text-ivory/40 font-sans max-w-sm mb-4">
          Replace with high-resolution fashion campaign photography (1920 × 1080 or vertical 4:5 recommended)
        </p>

        <span className="text-[11px] font-mono text-gold/60 border-b border-gold/20 pb-0.5">
          &lt;HeroImagePlaceholder imageSrc="/your-image.jpg" /&gt;
        </span>
      </div>

      {children}
    </div>
  );
}
