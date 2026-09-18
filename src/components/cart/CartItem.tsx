import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CartItem as CartItemType } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/utils/format';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const { product, size, color, quantity } = item;

  return (
    <div className="flex gap-4">
      {/* Thumbnail */}
      <Link to={`/product/${product.slug}`} className="shrink-0">
        <div className="w-20 h-26 bg-light-taupe overflow-hidden border border-border" style={{ height: '6.5rem' }}>
          <ImagePlaceholder
            src={product.images[0]?.url}
            alt={product.images[0]?.alt || product.name}
            title={product.name}
            aspectRatio="portrait"
            className="w-full h-full text-[8px]"
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link to={`/product/${product.slug}`}>
          <h4 className="font-serif text-sm text-charcoal line-clamp-1 hover:text-gold transition-colors">
            {product.name}
          </h4>
        </Link>
        <div className="flex items-center gap-2 mt-1">
          {size && <span className="text-xs text-taupe">Size: {size}</span>}
          {color && size && <span className="text-taupe text-xs">·</span>}
          {color && <span className="text-xs text-taupe">{color}</span>}
        </div>
        <p className="text-sm font-medium text-charcoal mt-1">{formatCurrency(product.price)}</p>

        {/* Quantity + Remove */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-border">
            <button
              onClick={() => updateQuantity(product.id, size, color, quantity - 1)}
              className="p-1.5 text-charcoal hover:text-gold transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={12} />
            </button>
            <span className="w-8 text-center text-sm font-medium text-charcoal">{quantity}</span>
            <button
              onClick={() => updateQuantity(product.id, size, color, quantity + 1)}
              className="p-1.5 text-charcoal hover:text-gold transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={12} />
            </button>
          </div>
          <button
            onClick={() => removeItem(product.id, size, color)}
            className="p-1.5 text-taupe hover:text-red-500 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
