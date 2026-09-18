import { Link } from 'react-router-dom';
import ProductCard from '@/components/product/ProductCard';
import { getFeaturedProducts } from '@/data/sampleProducts';
import { ArrowRight } from 'lucide-react';

export default function FeaturedProductsSection() {
  const featured = getFeaturedProducts();

  return (
    <section className="py-20 sm:py-28 bg-light-taupe/40 border-b border-border/60">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
          <div>
            <p className="section-label mb-2">Signature Masterpieces</p>
            <h2 className="section-heading">Featured Products</h2>
            <p className="text-xs sm:text-sm text-taupe mt-2 max-w-lg">
              Handpicked heirloom garments representing the pinnacle of Nepali craftsmanship and contemporary design.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-charcoal hover:text-gold transition-colors font-sans font-medium shrink-0"
          >
            <span>View All Pieces</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Responsive Product Grid:
            Desktop: 4 per row (lg:grid-cols-4)
            Tablet: 2-3 per row (sm:grid-cols-2 md:grid-cols-3)
            Mobile: 2 per row (grid-cols-2)
        */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-10 sm:gap-y-12">
          {featured.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
