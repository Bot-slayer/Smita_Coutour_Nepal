import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '@/components/product/ProductGrid';
import Pagination from '@/components/ui/Pagination';
import { productService } from '@/services/productService';
import { Tag, Sparkles } from 'lucide-react';
import type { Product } from '@/types';

const PAGE_SIZE = 18;

export default function SalePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryPage = Number(searchParams.get('page')) || 1;

  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const { products, total } = await productService.getPaginated({
          page: queryPage,
          pageSize: PAGE_SIZE,
          isSale: true,
        });
        setSaleProducts(products);
        setTotalCount(total);
      } catch (error) {
        console.error('Failed to load sale products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [queryPage]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

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
          isLoading={isLoading}
          emptyMessage="No pieces are currently marked for seasonal markdown. Please visit our main catalog."
        />

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <Pagination
            currentPage={queryPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
