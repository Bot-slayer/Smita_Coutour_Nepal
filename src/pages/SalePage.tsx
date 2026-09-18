import ProductGrid from '@/components/product/ProductGrid';
import { sampleProducts } from '@/data/sampleProducts';
import { Tag, Sparkles } from 'lucide-react';

export default function SalePage() {
  // Strict filter: only genuine sale products with actual original and sale prices
  const saleProducts = sampleProducts.filter(
    (p) => (p.isOnSale === true || p.isSale === true) && p.originalPrice && p.originalPrice > p.price
  );

  return (
    <div className="bg-ivory min-h-screen">
      {/* Luxury Sale Editorial Header */}
      <div className="bg-charcoal text-ivory py-16 sm:py-24 text-center px-4 relative overflow-hidden">
        {/* Subtle geometric lines */}
        <div className="absolute inset-4 sm:inset-10 border border-gold/10 pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-gold/40 bg-gold/10 text-gold mb-6">
            <Tag size={12} />
            <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-medium">
              Private Archive Sale
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ivory font-normal tracking-wide uppercase mb-6 leading-tight">
            The Season Sale
          </h1>

          <p className="text-xs sm:text-sm text-ivory/70 max-w-md mx-auto leading-relaxed mb-8">
            Select handcrafted pieces from our recent collections, available at reduced prices for a limited window.
            Every piece retains full atelier authenticity and complimentary delivery.
          </p>

          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-gold bg-charcoal/80 border border-gold/30 px-4 py-2">
            <Sparkles size={13} />
            <span>Up to 22% OFF · Genuine Seasonal Markdowns</span>
          </div>
        </div>
      </div>

      {/* Sale Products Grid */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-20">
        <div className="flex items-center justify-between pb-4 mb-10 border-b border-border">
          <div>
            <p className="text-xs tracking-widest uppercase text-taupe font-sans">
              Currently Available
            </p>
            <h2 className="font-serif text-2xl text-charcoal">
              Discounted Couture ({saleProducts.length} pieces)
            </h2>
          </div>
          <span className="text-xs text-taupe tracking-wider font-sans">
            Limited Quantities
          </span>
        </div>

        <ProductGrid
          products={saleProducts}
          columns={4}
          emptyMessage="No pieces are currently marked for seasonal markdown. Please visit our main catalog."
        />
      </div>
    </div>
  );
}
