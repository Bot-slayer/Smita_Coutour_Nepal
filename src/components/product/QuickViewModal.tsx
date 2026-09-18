import { useState } from 'react';
import { X, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import { formatCurrency } from '@/utils/format';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import toast from 'react-hot-toast';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const addToCart = useCartStore((s) => s.addItem);
  const openCartDrawer = useCartStore((s) => s.openDrawer);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => product ? s.isWishlisted(product.id) : false);

  if (!product) return null;

  const currentSize = selectedSize || product.sizes[0] || 'Free Size';
  const currentColor = selectedColor || product.colors[0] || '';
  const currentImage = product.images[activeImageIdx] || product.images[0];

  const handleAddToCart = () => {
    addToCart(product, currentSize, currentColor, quantity);
    onClose();
    openCartDrawer();
    toast.success(`${product.name} added to your bag`);
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-3xl bg-ivory border border-border shadow-2xl overflow-hidden animate-slide-up max-h-[92vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-charcoal hover:text-gold transition-colors bg-white/70 backdrop-blur-xs rounded-full"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Left: Product Image Area */}
        <div className="w-full md:w-1/2 p-6 bg-light-taupe/40 flex flex-col justify-between">
          <div className="relative">
            <ImagePlaceholder
              src={currentImage?.url}
              alt={currentImage?.alt || product.name}
              title={currentImage?.label || product.name}
              subtitle="Product Preview"
              aspectRatio="portrait"
              className="w-full"
            />

            {product.isOnSale && product.discount && (
              <span className="absolute top-3 left-3 bg-gold text-charcoal text-[10px] tracking-widest font-sans font-semibold uppercase px-2.5 py-1">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail switcher if multiple images */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-14 h-18 border transition-all shrink-0 ${
                    activeImageIdx === idx ? 'border-charcoal' : 'border-border/60 opacity-60'
                  }`}
                >
                  <ImagePlaceholder
                    src={img.url}
                    alt={img.alt}
                    title={img.label || `Angle ${idx + 1}`}
                    aspectRatio="portrait"
                    className="w-full h-full text-[8px]"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Options */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <p className="text-[10px] tracking-widest-xl uppercase text-taupe font-sans font-medium mb-1">
              {product.categoryLabel || product.category}
            </p>

            <h3 className="font-serif text-2xl text-charcoal mb-3 leading-snug">
              {product.name}
            </h3>

            {/* Price section */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xl font-medium text-charcoal font-sans">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-taupe line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              {product.isOnSale && product.discount && (
                <span className="text-xs font-semibold text-gold tracking-wider uppercase">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            <p className="text-xs text-taupe leading-relaxed mb-6 line-clamp-3">
              {product.description}
            </p>

            {/* Size selection */}
            {product.sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] tracking-widest uppercase text-charcoal font-medium">
                    Select Size
                  </span>
                  <span className="text-xs text-taupe">{currentSize}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 text-xs font-sans tracking-wider border transition-all ${
                        currentSize === sz
                          ? 'border-charcoal bg-charcoal text-ivory'
                          : 'border-border text-charcoal hover:border-charcoal'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color selection */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <span className="block text-[11px] tracking-widest uppercase text-charcoal font-medium mb-2">
                  Colour: <span className="text-taupe font-normal">{currentColor}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((clr) => (
                    <button
                      key={clr}
                      onClick={() => setSelectedColor(clr)}
                      className={`px-3 py-1 text-xs border transition-all ${
                        currentColor === clr
                          ? 'border-charcoal bg-light-taupe text-charcoal font-medium'
                          : 'border-border text-taupe hover:border-charcoal'
                      }`}
                    >
                      {clr}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[11px] tracking-widest uppercase text-charcoal font-medium">
                Quantity
              </span>
              <div className="flex items-center border border-border">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 text-charcoal hover:text-gold transition-colors"
                >
                  −
                </button>
                <span className="w-8 text-center text-xs font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1 text-charcoal hover:text-gold transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-border flex flex-col gap-3">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="btn-primary flex-1 py-3 text-xs flex items-center justify-center gap-2"
              >
                <ShoppingBag size={14} /> Add to Bag
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`p-3 border transition-colors flex items-center justify-center ${
                  isWishlisted
                    ? 'border-gold text-gold bg-gold/5'
                    : 'border-border text-charcoal hover:border-charcoal'
                }`}
                aria-label="Wishlist"
              >
                <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            <Link
              to={`/product/${product.slug}`}
              onClick={onClose}
              className="text-center text-xs tracking-widest uppercase text-taupe hover:text-gold transition-colors flex items-center justify-center gap-1.5 pt-1"
            >
              View Full Product Details <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
