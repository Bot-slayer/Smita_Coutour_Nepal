
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/product/ProductCard';
import { productService } from '@/services/productService';
import { useWebsiteSettings } from '@/context/WebsiteSettingsContext';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import type { Product } from '@/types';
import { ArrowRight } from 'lucide-react';

export default function FeaturedProductsSection({ bannerImage }: { bannerImage?: string }) {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { content } = useWebsiteSettings();

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);

        const data = await productService.getFeatured();

        setFeatured(data);
      } catch (error) {
        console.error('Failed to load featured products:', error);
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
    <section className="py-20 sm:py-28 bg-light-taupe/40 border-b border-border/60">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
          <div>
            <p className="section-label mb-2">{content.featuredLabel || 'Signature Masterpieces'}</p>

            <h2 className="section-heading">
              {content.featuredTitle || 'Featured Products'}
            </h2>

            <p className="text-xs sm:text-sm text-taupe mt-2 max-w-lg">
              {content.featuredDescription || 'Handpicked heirloom garments representing the pinnacle of Nepali craftsmanship and contemporary design.'}
            </p>
          </div>

          <Link
            to="/shop?filter=featured"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-charcoal hover:text-gold transition-colors font-sans font-medium shrink-0"
          >
            <span>View All Pieces</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Optional Banner Image */}
        {bannerImage && (
          <div className="mb-14 overflow-hidden shadow-sm border border-border/40">
            <ImagePlaceholder
              src={bannerImage}
              alt="Featured Pieces Campaign"
              aspectRatio="banner"
              className="w-full h-full max-h-[300px] sm:max-h-[400px]"
            />
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-10 sm:gap-y-12">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse"
              >
                <div className="aspect-[3/4] bg-light-taupe/60 rounded-sm" />
                <div className="h-4 bg-light-taupe/60 rounded mt-4 w-3/4" />
                <div className="h-4 bg-light-taupe/60 rounded mt-2 w-1/2" />
              </div>
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-taupe">
              No featured products available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-10 sm:gap-y-12">
            {featured.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

