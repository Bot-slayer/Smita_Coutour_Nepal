import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { formatCurrency } from '@/utils/format';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import QuickViewModal from './QuickViewModal';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

export default function ProductCard({ product, layout = 'grid' }: ProductCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const addToCart = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 'Free Size';
    const defaultColor = product.colors[0] || '';
    addToCart(product, defaultSize, defaultColor);
    openDrawer();
    toast.success(`${product.name} added to bag`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  // Primary image or placeholder label
  const primaryImage = product.images[0];

  if (layout === 'list') {
    return (
      <>
        <div className="flex flex-col sm:flex-row gap-6 group border-b border-border pb-6 last:border-0">
          <div className="w-full sm:w-44 h-56 shrink-0 relative overflow-hidden bg-light-taupe">
            <Link to={`/product/${product.slug}`}>
              <ImagePlaceholder
                src={primaryImage?.url}
                alt={primaryImage?.alt || product.name}
                title={primaryImage?.label || product.name}
                subtitle="Couture Piece"
                aspectRatio="portrait"
                className="w-full h-full"
              />
            </Link>
          </div>

          <div className="flex flex-col justify-between py-1 flex-1">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] tracking-widest-xl uppercase text-taupe mb-1">
                  {product.categoryLabel || product.category}
                </p>
                {product.isOnSale && product.discount && (
                  <span className="bg-gold text-charcoal text-[10px] tracking-widest font-sans font-semibold uppercase px-2 py-0.5">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              <Link to={`/product/${product.slug}`}>
                <h3 className="font-serif text-lg text-charcoal group-hover:text-gold transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-sm text-taupe mt-2 line-clamp-2">{product.description}</p>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-3">
                <span className="font-sans font-medium text-charcoal">{formatCurrency(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-taupe line-through">{formatCurrency(product.originalPrice)}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleQuickView}
                  className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5"
                  title="Quick View"
                >
                  <Eye size={13} /> Quick View
                </button>
                <button
                  onClick={handleAddToCart}
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <ShoppingBag size={13} /> Add to Bag
                </button>
                <button
                  onClick={handleWishlist}
                  className={`p-2 border transition-colors ${
                    isWishlisted ? 'border-gold text-gold bg-gold/5' : 'border-border text-charcoal hover:border-charcoal'
                  }`}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {quickViewOpen && (
          <QuickViewModal product={product} onClose={() => setQuickViewOpen(false)} />
        )}
      </>
    );
  }

  return (
    <>
      <div className="product-card group relative bg-transparent flex flex-col justify-between">
        {/* Image Box */}
        <div className="relative overflow-hidden bg-light-taupe aspect-[3/4] border border-border/40">
          <Link to={`/product/${product.slug}`} className="block w-full h-full">
            <ImagePlaceholder
              src={primaryImage?.url}
              alt={primaryImage?.alt || product.name}
              title={primaryImage?.label || product.name}
              subtitle="Smita Couture"
              aspectRatio="portrait"
              className="w-full h-full"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isNew && (
              <span className="bg-charcoal text-ivory text-[10px] tracking-widest font-sans uppercase px-2 py-0.5 shadow-sm">
                New
              </span>
            )}
            {product.isOnSale && product.discount && (
              <span className="bg-gold text-charcoal text-[10px] tracking-widest font-sans font-semibold uppercase px-2 py-0.5 shadow-sm">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* Favourite / Heart button (top-right, works with visual feedback) */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
              isWishlisted
                ? 'bg-ivory text-gold shadow-md'
                : 'bg-ivory/80 text-charcoal/80 hover:text-gold hover:bg-ivory shadow-xs'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={16}
              className="transition-transform duration-200 active:scale-125"
              fill={isWishlisted ? 'currentColor' : 'none'}
              strokeWidth={isWishlisted ? 0 : 2}
            />
          </button>

          {/* Quick View Button on Hover */}
          <button
            onClick={handleQuickView}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-ivory/95 backdrop-blur-md text-charcoal text-[11px] font-sans font-medium tracking-widest uppercase px-4 py-2 border border-border shadow-md hover:bg-charcoal hover:text-ivory whitespace-nowrap flex items-center gap-1.5"
          >
            <Eye size={13} /> Quick View
          </button>
        </div>

        {/* Product Info Section */}
        <div className="pt-4 flex flex-col flex-1 justify-between">
          <div>
            <p className="text-[10px] tracking-widest-xl uppercase text-taupe font-sans font-medium mb-1">
              {product.categoryLabel || product.category}
            </p>
            <Link to={`/product/${product.slug}`}>
              <h3 className="font-serif text-base text-charcoal hover:text-gold transition-colors duration-200 line-clamp-1 leading-snug">
                {product.name}
              </h3>
            </Link>

            {/* Price Row */}
            <div className="flex items-center gap-2.5 mt-2">
              <span className="text-sm font-sans font-medium text-charcoal">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-taupe line-through font-sans">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Bag Button */}
          <button
            onClick={handleAddToCart}
            className="mt-4 w-full py-2.5 px-4 text-xs font-sans font-medium tracking-widest uppercase border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ShoppingBag size={13} /> Add to Bag
          </button>
        </div>
      </div>

      {quickViewOpen && (
        <QuickViewModal product={product} onClose={() => setQuickViewOpen(false)} />
      )}
    </>
  );
}
