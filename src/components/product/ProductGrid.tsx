import type { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  layout?: 'grid' | 'list';
  emptyMessage?: string;
}

export default function ProductGrid({
  products,
  columns = 3,
  layout = 'grid',
  emptyMessage = 'No products found.',
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-serif text-2xl text-charcoal mb-3">No products found</p>
        <p className="text-sm text-taupe">{emptyMessage}</p>
      </div>
    );
  }

  if (layout === 'list') {
    return (
      <div className="flex flex-col gap-0">
        {products.map((p) => (
          <div key={p.id} className="py-6">
            <ProductCard product={p} layout="list" />
          </div>
        ))}
      </div>
    );
  }

  const colClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  }[columns];

  return (
    <div className={`grid ${colClass} gap-x-5 gap-y-10 sm:gap-x-8`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
