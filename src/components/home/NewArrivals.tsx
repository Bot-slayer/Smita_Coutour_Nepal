
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { productService } from '@/services/productService';
import { useWebsiteSettings } from '@/context/WebsiteSettingsContext';
import type { Product } from '@/types';
import ImagePlaceholder from '../ui/ImagePlaceholder';

export default function NewArrivals({ bannerImage }: { bannerImage?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { content } = useWebsiteSettings();

  useEffect(() => {
    const loadNewArrivals = async () => {
      try {
        setLoading(true);

        const data = await productService.getNewArrivals();

        setProducts(data);
      } catch (error) {
        console.error('Failed to load new arrivals:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadNewArrivals();
  }, []);

  return (
    <section className="bg-light-taupe py-20 sm:py-28">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-label mb-3">{content.newArrivalsLabel || 'Just In'}</p>
            <h2 className="section-heading">{content.newArrivalsTitle || 'New Arrivals'}</h2>
          </div>

          <Link
            to="/shop?filter=new"
            className="hidden sm:flex items-center gap-2 text-xs tracking-widest-xl uppercase text-taupe hover:text-gold transition-colors font-sans"
          >
            View All <ArrowRight size={13} />
          </Link>
        </div>

        {/* Optional Banner Image */}
        {bannerImage && (
          <div className="mb-12 overflow-hidden shadow-sm border border-border/40">
            <ImagePlaceholder
              src={bannerImage}
              alt="New Arrivals Campaign"
              aspectRatio="banner"
              className="w-full h-full max-h-[300px] sm:max-h-[400px]"
            />
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10 sm:gap-x-8">
            {Array.from({ length: 4 }).map((_, index) => (
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
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-taupe">
              No new arrivals available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10 sm:gap-x-8">
            {products.slice(0, 4).map((p) => (
              <ProductCard
                key={p.id}
                product={p}
              />
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-10 text-center sm:hidden">
          <Link
            to="/shop?filter=new"
            className="btn-outline"
          >
            View All New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}
