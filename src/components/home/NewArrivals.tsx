import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { getNewArrivals } from '@/data/sampleProducts';

const products = getNewArrivals();

export default function NewArrivals() {
  return (
    <section className="bg-light-taupe py-20 sm:py-28">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-label mb-3">Just In</p>
            <h2 className="section-heading">New Arrivals</h2>
          </div>
          <Link
            to="/shop?filter=new"
            className="hidden sm:flex items-center gap-2 text-xs tracking-widest-xl uppercase text-taupe hover:text-gold transition-colors font-sans"
          >
            View All <ArrowRight size={13} />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10 sm:gap-x-8">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 text-center sm:hidden">
          <Link to="/shop?filter=new" className="btn-outline">
            View All New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}
