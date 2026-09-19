import { Link } from 'react-router-dom';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import { ArrowRight } from 'lucide-react';
import { useWebsiteSettings } from '@/context/WebsiteSettingsContext';

interface NewCollectionSectionProps {
  imageSrc?: string;
}

export default function NewCollectionSection({ imageSrc }: NewCollectionSectionProps) {
  const { content } = useWebsiteSettings();

  return (
    <section className="py-20 sm:py-28 bg-white border-y border-border/60">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Large Image Placeholder */}
          <div className="lg:col-span-7 relative">
            <div className="relative overflow-hidden bg-light-taupe shadow-lg">
              <ImagePlaceholder
                src={imageSrc}
                alt="Smita Couture The New Collection"
                title="The New Collection Editorial Canvas"
                subtitle="Insert campaign photography (recommended: 1400 × 900 px)"
                aspectRatio="wide"
                className="w-full min-h-[380px] sm:min-h-[460px]"
              />
              {/* Season Badge */}
              <div className="absolute top-4 left-4 bg-charcoal text-ivory text-[10px] tracking-widest-xl uppercase font-sans font-medium px-3 py-1">
                Autumn / Festive Edition
              </div>
            </div>
          </div>

          {/* Text & Action */}
          <div className="lg:col-span-5 flex flex-col justify-center lg:pl-4">
            <p className="text-xs tracking-[0.25em] uppercase text-gold font-sans font-medium mb-3">
              {content.aboutLabel || 'Haute Couture 2024 / 2025'}
            </p>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal font-normal tracking-wide uppercase leading-tight mb-6">
              {content.aboutTitle || 'The New Collection'}
            </h2>

            <p className="text-sm sm:text-base text-taupe leading-relaxed mb-8">
              {content.aboutDescription || 'An homage to classical Nepali grandeur and South Asian heritage weaving. Each garment in our newest seasonal curation combines gossamer silks, hand-guided dabka embroidery, and sculptural modern tailoring designed to turn heads at every gathering.'}
            </p>

            <div className="pt-2">
              <Link
                to="/shop?filter=new"
                className="btn-primary inline-flex items-center gap-3 px-8 py-4"
              >
                <span>{content.aboutButtonText || 'Explore Collection'}</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
