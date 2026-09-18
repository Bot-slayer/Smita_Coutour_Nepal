import { X, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/utils/format';
import CartItem from './CartItem';

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isDrawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="drawer-overlay"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-ivory z-50 flex flex-col transition-transform duration-350 ease-out shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transitionDuration: '350ms' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} className="text-charcoal" />
            <span className="font-serif text-lg text-charcoal">
              Your Bag {items.length > 0 && <span className="text-taupe text-sm">({items.length})</span>}
            </span>
          </div>
          <button
            onClick={closeDrawer}
            className="p-1 text-charcoal hover:text-gold transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <ShoppingBag size={40} className="text-border" />
              <p className="font-serif text-xl text-charcoal">Your bag is empty</p>
              <p className="text-sm text-taupe">Add some pieces to get started.</p>
              <button onClick={closeDrawer} className="btn-outline mt-4">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {items.map((item) => (
                <CartItem key={`${item.product.id}-${item.size}-${item.color}`} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-6 flex flex-col gap-4 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-sm text-taupe uppercase tracking-wider">Subtotal</span>
              <span className="font-serif text-xl text-charcoal">{formatCurrency(subtotal)}</span>
            </div>
            <p className="text-xs text-taupe">Shipping and taxes calculated at checkout</p>
            <Link
              to="/checkout"
              onClick={closeDrawer}
              className="btn-primary w-full text-center"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/cart"
              onClick={closeDrawer}
              className="btn-outline w-full text-center text-xs"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
