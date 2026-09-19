import { Link } from 'react-router-dom';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import { ArrowRight } from 'lucide-react';
import { useWebsiteSettings } from '@/context/WebsiteSettingsContext';

interface CategoryItem {
  name: string;
  slug: string;
  subtitle: string;
  imageSrc?: string;
  placeholderHint: string;
}

const CATEGORY_ITEMS: CategoryItem[] = [
  {
    name: 'Sarees',
    slug: 'sarees',
    subtitle: 'Banarasi · Chanderi · Kanjivaram',
    placeholderHint: 'Saree Collection Photo (800 × 1000 px)',
  },
  {
    name: 'Dresses',
    slug: 'dresses',
    subtitle: 'Evening Gowns · Velvet · Maxi',
    placeholderHint: 'Dresses Collection Photo (800 × 1000 px)',
  },
  {
    name: 'Bridal',
    slug: 'bridal',
    subtitle: 'Royal Lehengas · Zardozi · Reception',
    placeholderHint: 'Bridal Couture Photo (800 × 1000 px)',
  },
  {
    name: 'Designer Wear',
    slug: 'designer-wear',
    subtitle: 'Anarkalis · Cape Ensembles · Shararas',
    placeholderHint: 'Designer Wear Photo (800 × 1000 px)',
  },
];

export default function FeaturedCategories() {
  const { categoryImages } = useWebsiteSettings();

  return (
    <section className="py-20 sm:py-28 bg-ivory">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="section-label mb-3">Curated Departments</p>
          <h2 className="section-heading mb-4">Featured Categories</h2>
          <p className="text-sm text-taupe">
            Explore our hallmark disciplines — each masterfully tailored with traditional integrity and modern allure.
          </p>
        </div>

        {/* 4 Large Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {CATEGORY_ITEMS.map((cat) => {
            const dynamicImage = categoryImages[cat.slug as keyof typeof categoryImages];

            return (
              <div
                key={cat.slug}
                className="group relative flex flex-col bg-white border border-border/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500"
              >
                {/* Image Placeholder area */}
                <div className="relative overflow-hidden aspect-[3/4] bg-light-taupe">
                  <ImagePlaceholder
                    src={dynamicImage || cat.imageSrc}
                    alt={`${cat.name} Collection`}
                    title={cat.name}
                    subtitle={cat.placeholderHint}
                    aspectRatio="portrait"
                    className="w-full h-full"
                  />

                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Content anchored to bottom of card */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-ivory z-10">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-gold font-sans font-medium mb-1">
                      Couture Category
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-ivory font-normal tracking-wide uppercase mb-2">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-ivory/70 tracking-wider mb-5 line-clamp-1">
                      {cat.subtitle}
                    </p>

                    <Link
                      to={`/category/${cat.slug}`}
                      className="inline-flex items-center justify-between w-full py-3 px-4 border border-ivory/30 bg-charcoal/40 backdrop-blur-xs text-xs tracking-widest uppercase font-sans font-medium text-ivory hover:bg-gold hover:text-charcoal hover:border-gold transition-all duration-300"
                    >
                      <span>View Collection</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
