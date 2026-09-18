import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/utils/format';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);
  const addToCart = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const handleMoveToCart = (product: typeof items[0]) => {
    addToCart(product, product.sizes[0] || 'Free Size', product.colors[0] || '');
    removeItem(product.id);
    openDrawer();
    toast.success(`${product.name} moved to your bag`);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-5 px-4 bg-ivory">
        <div className="w-16 h-16 border border-border flex items-center justify-center bg-white">
          <Heart size={28} className="text-border" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">Your Wishlist is Empty</h1>
        <p className="text-taupe text-xs sm:text-sm max-w-xs leading-relaxed">
          Save your favourite pieces while browsing and revisit them whenever you are ready.
        </p>
        <Link to="/shop" className="btn-primary mt-2">
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16">
        {/* Header */}
        <div className="flex items-end justify-between pb-4 mb-10 border-b border-border">
          <div>
            <p className="section-label mb-2">Saved Pieces</p>
            <h1 className="section-heading">My Wishlist ({items.length})</h1>
          </div>
          <button
            onClick={() => { clearWishlist(); toast.success('Wishlist cleared'); }}
            className="text-xs text-taupe hover:text-red-500 transition-colors uppercase tracking-wider font-sans underline underline-offset-4"
          >
            Clear All
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 sm:gap-x-8">
          {items.map((product) => {
            const primaryImg = product.images[0];
            return (
              <div key={product.id} className="group relative flex flex-col justify-between">
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-light-taupe border border-border/60">
                  <Link to={`/product/${product.slug}`} className="block w-full h-full">
                    <ImagePlaceholder
                      src={primaryImg?.url}
                      alt={primaryImg?.alt || product.name}
                      title={primaryImg?.label || product.name}
                      subtitle="Saved Piece"
                      aspectRatio="portrait"
                      className="w-full h-full"
                    />
                  </Link>

                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeItem(product.id);
                      toast.success('Removed from wishlist');
                    }}
                    className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-xs text-taupe hover:text-red-600 transition-colors shadow-xs"
                    aria-label="Remove item"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={13} />
                  </button>

                  {product.isOnSale && product.discount && (
                    <span className="absolute top-2 left-2 bg-gold text-charcoal text-[9px] font-sans font-semibold tracking-wider uppercase px-2 py-0.5">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="pt-4 flex flex-col flex-1 justify-between">
                  <div>
                    <p className="text-[10px] tracking-widest-xl uppercase text-taupe mb-1">
                      {product.categoryLabel || product.category}
                    </p>
                    <Link to={`/product/${product.slug}`}>
                      <h3 className="font-serif text-base text-charcoal hover:text-gold transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm font-medium text-charcoal mt-1.5 font-sans">
                      {formatCurrency(product.price)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="mt-4 w-full flex items-center justify-center gap-2 border border-charcoal text-charcoal text-xs tracking-widest uppercase py-2.5 hover:bg-charcoal hover:text-ivory transition-all duration-200"
                  >
                    <ShoppingBag size={13} /> Move to Bag
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
