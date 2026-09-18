import { Link } from 'react-router-dom';
import HeroImagePlaceholder from '@/components/ui/HeroImagePlaceholder';

interface HeroBannerProps {
  /**
   * Leave undefined to show the elegant placeholder,
   * or provide a path e.g. "/images/hero-campaign.jpg"
   */
  imageSrc?: string;
}

export default function HeroBanner({ imageSrc }: HeroBannerProps) {
  return (
    <section className="relative min-h-[82vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-charcoal">
      {/* Background Hero Image / Luxury Placeholder */}
      <div className="absolute inset-0 w-full h-full">
        <HeroImagePlaceholder
          imageSrc={imageSrc}
          imageAlt="Smita Couture Nepal Luxury Fashion Campaign"
          className="w-full h-full"
        />
        {/* Subtle Darkening Gradient Overlay for perfect typography contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-charcoal/60 pointer-events-none" />
      </div>

      {/* Main Luxury Overlay Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center py-20">
        <div className="flex flex-col items-center">
          {/* Subtle gold brand pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-gold/40 bg-charcoal/50 backdrop-blur-md mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-[11px] tracking-[0.25em] uppercase text-ivory/90 font-sans font-medium">
              Kathmandu Ateliers · Premium Haute Couture
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-ivory font-normal tracking-wide uppercase leading-[1.1] mb-6">
            Smita Couture Nepal
          </h1>

          {/* Tagline */}
          <p className="font-serif text-lg sm:text-2xl text-gold/90 italic font-light max-w-2xl mb-10 tracking-wide">
            "Timeless Elegance. Crafted for You."
          </p>

          <p className="font-sans text-xs sm:text-sm uppercase tracking-widest text-ivory/70 max-w-xl mb-12 leading-relaxed">
            Exquisite South Asian silhouettes, pure handloom silks, and bespoke Nepali craftsmanship
            for weddings, galas, and life’s most celebrated moments.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              to="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-ivory text-charcoal hover:bg-gold hover:text-charcoal px-8 py-4 text-xs font-sans font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-xl"
            >
              Shop Collection
            </Link>
            <Link
              to="/shop?filter=new"
              className="w-full sm:w-auto inline-flex items-center justify-center border border-ivory/80 text-ivory hover:bg-ivory hover:text-charcoal px-8 py-4 text-xs font-sans font-semibold tracking-[0.2em] uppercase backdrop-blur-xs transition-all duration-300"
            >
              Explore New Arrivals
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Bar */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent z-20" />
    </section>
  );
}
