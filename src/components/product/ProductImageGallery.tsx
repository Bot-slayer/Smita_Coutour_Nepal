import { useState } from 'react';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import type { ProductImage } from '@/types';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full">
        <ImagePlaceholder
          title={productName}
          subtitle="Primary Studio View"
          aspectRatio="portrait"
          className="w-full shadow-xs"
        />
      </div>
    );
  }

  const activeImage = images[activeIdx] || images[0];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 lg:gap-6">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[640px] pb-2 md:pb-0 scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`shrink-0 w-18 sm:w-20 aspect-[3/4] border transition-all duration-300 ${
                activeIdx === idx
                  ? 'border-charcoal ring-1 ring-charcoal'
                  : 'border-border opacity-70 hover:opacity-100 hover:border-charcoal/40'
              }`}
              aria-label={`View photo angle ${idx + 1}: ${img.label || productName}`}
            >
              <ImagePlaceholder
                src={img.url}
                alt={img.alt}
                title={img.label || `Angle ${idx + 1}`}
                aspectRatio="portrait"
                className="w-full h-full text-[9px]"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Feature Image Display */}
      <div className="flex-1 relative overflow-hidden bg-light-taupe border border-border/80 shadow-sm aspect-[3/4]">
        <ImagePlaceholder
          key={activeIdx}
          src={activeImage.url}
          alt={activeImage.alt}
          title={activeImage.label || productName}
          subtitle={`Angle ${activeIdx + 1} of ${images.length} · Recommended: 1200 × 1600 px`}
          aspectRatio="portrait"
          className="w-full h-full animate-fade-in"
        />
      </div>
    </div>
  );
}
