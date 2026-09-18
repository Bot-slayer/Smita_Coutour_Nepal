import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck, Truck } from 'lucide-react';
import { useCartStore, FREE_DELIVERY_THRESHOLD } from '@/store/cartStore';
import { formatCurrency } from '@/utils/format';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import toast from 'react-hot-toast';

export default function CartPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());
  const delivery = useCartStore((s) => s.deliveryCharge());
  const discount = useCartStore((s) => s.discountAmount());
  const total = useCartStore((s) => s.total());
  const couponCode = useCartStore((s) => s.couponCode);
  const discountPct = useCartStore((s) => s.discountPercentage);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);

  const [promoInput, setPromoInput] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyCoupon(promoInput);
    if (res.success) {
      toast.success(res.message);
      setPromoInput('');
    } else {
      toast.error(res.message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-5 px-4 bg-ivory">
        <div className="w-16 h-16 border border-border flex items-center justify-center bg-white shadow-xs">
          <ShoppingBag size={28} className="text-border" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">Your Shopping Bag is Empty</h1>
        <p className="text-taupe text-xs sm:text-sm max-w-sm leading-relaxed">
          You haven't selected any pieces yet. Explore our handcrafted sarees, bridal lehengas, and couture collections.
        </p>
        <Link to="/shop" className="btn-primary mt-2">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16">
        {/* Header */}
        <div className="pb-4 mb-10 border-b border-border">
          <p className="section-label mb-2">Review Your Selection</p>
          <h1 className="section-heading">Shopping Bag ({items.length} {items.length === 1 ? 'item' : 'items'})</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8">
            {/* Table Header on desktop */}
            <div className="hidden sm:grid grid-cols-12 gap-4 pb-3 border-b border-border/80 text-[10px] tracking-widest-xl uppercase text-taupe font-sans font-medium">
              <span className="col-span-6">Product Details</span>
              <span className="col-span-2 text-center">Unit Price</span>
              <span className="col-span-2 text-center">Quantity</span>
              <span className="col-span-2 text-right">Subtotal</span>
            </div>

            {/* Items */}
            <div className="divide-y divide-border/70">
              {items.map((item) => {
                const itemSubtotal = item.product.price * item.quantity;
                const primaryImg = item.product.images[0];

                return (
                  <div
                    key={`${item.product.id}-${item.size}-${item.color}`}
                    className="py-6 sm:py-7 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
                  >
                    {/* Product image, name, size, color */}
                    <div className="col-span-1 sm:col-span-6 flex gap-4 items-center">
                      <Link to={`/product/${item.product.slug}`} className="shrink-0">
                        <div className="w-20 sm:w-24 aspect-[3/4] bg-light-taupe overflow-hidden border border-border/80">
                          <ImagePlaceholder
                            src={primaryImg?.url}
                            alt={primaryImg?.alt || item.product.name}
                            title={item.product.name}
                            aspectRatio="portrait"
                            className="w-full h-full text-[8px]"
                          />
                        </div>
                      </Link>

                      <div className="flex flex-col justify-center min-w-0">
                        <span className="text-[10px] tracking-widest uppercase text-taupe font-sans mb-1">
                          {item.product.categoryLabel || item.product.category}
                        </span>
                        <Link to={`/product/${item.product.slug}`}>
                          <h3 className="font-serif text-base text-charcoal hover:text-gold transition-colors line-clamp-1 leading-snug">
                            {item.product.name}
                          </h3>
                        </Link>

                        {/* Size and Color badges */}
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-taupe">
                          <span className="border border-border/80 bg-white px-2 py-0.5 font-sans">
                            Size: <strong className="text-charcoal font-medium">{item.size}</strong>
                          </span>
                          {item.color && (
                            <span className="border border-border/80 bg-white px-2 py-0.5 font-sans">
                              Color: <strong className="text-charcoal font-medium">{item.color}</strong>
                            </span>
                          )}
                        </div>

                        {/* Mobile unit price display */}
                        <div className="flex items-center justify-between mt-2 sm:hidden">
                          <span className="text-xs text-taupe font-sans">
                            Unit: {formatCurrency(item.product.price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Unit Price (Desktop) */}
                    <div className="hidden sm:block sm:col-span-2 text-center text-xs font-sans text-charcoal font-medium">
                      {formatCurrency(item.product.price)}
                    </div>

                    {/* Quantity Selector */}
                    <div className="col-span-1 sm:col-span-2 flex items-center sm:justify-center">
                      <div className="flex items-center border border-border bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                          className="px-2.5 py-1.5 text-charcoal hover:text-gold transition-colors text-xs"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-8 text-center text-xs font-medium font-mono text-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                          className="px-2.5 py-1.5 text-charcoal hover:text-gold transition-colors text-xs"
                          aria-label="Increase quantity"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal & Remove */}
                    <div className="col-span-1 sm:col-span-2 flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <span className="text-sm font-sans font-medium text-charcoal">
                          {formatCurrency(itemSubtotal)}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          removeItem(item.product.id, item.size, item.color);
                          toast.success('Piece removed from bag');
                        }}
                        className="p-1.5 text-taupe hover:text-red-600 transition-colors"
                        aria-label="Remove piece"
                        title="Remove from bag"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions under cart items */}
            <div className="pt-6 border-t border-border flex items-center justify-between">
              <Link
                to="/shop"
                className="btn-outline text-xs tracking-widest uppercase py-3 px-6"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right Column: Exact Cart Summary as Specified */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-border/80 p-6 sm:p-8 shadow-xs sticky top-28">
              <h2 className="font-serif text-xl text-charcoal pb-4 mb-6 border-b border-border uppercase tracking-wider">
                Cart Summary
              </h2>

              {/* Promo Code Input */}
              <div className="mb-6 pb-6 border-b border-border/60">
                <p className="text-[10px] tracking-widest-xl uppercase text-taupe font-sans font-medium mb-2">
                  Have a VIP Promo Code?
                </p>
                {couponCode ? (
                  <div className="flex items-center justify-between p-2.5 bg-gold/10 border border-gold/30 text-xs">
                    <span className="font-mono text-gold font-medium">
                      {couponCode} ({discountPct}% OFF)
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-taupe hover:text-red-600 underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="e.g. SMITA10"
                      className="flex-1 bg-ivory border border-border px-3 py-2 text-xs uppercase font-mono text-charcoal placeholder:normal-case placeholder:font-sans focus:outline-none focus:border-charcoal"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-charcoal text-ivory text-xs tracking-wider uppercase hover:bg-gold hover:text-charcoal transition-colors font-sans"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Summary Breakdown Table */}
              <div className="flex flex-col gap-3.5 pb-6 border-b border-border font-sans text-xs">
                <div className="flex justify-between items-center text-taupe">
                  <span>Subtotal</span>
                  <span className="text-charcoal font-medium font-mono text-sm">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between items-center text-taupe">
                  <div className="flex items-center gap-1.5">
                    <span>Delivery</span>
                    <span className="text-[10px] text-gold/90 font-medium">
                      {delivery === 0 ? '(Complimentary)' : ''}
                    </span>
                  </div>
                  <span className="text-charcoal font-medium font-mono text-sm">
                    {delivery === 0 ? 'Free' : formatCurrency(delivery)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-taupe">
                  <span>Discount</span>
                  <span className={`font-mono text-sm ${discount > 0 ? 'text-emerald-700 font-medium' : 'text-charcoal'}`}>
                    {discount > 0 ? `- ${formatCurrency(discount)}` : 'NPR 0'}
                  </span>
                </div>

                {subtotal < FREE_DELIVERY_THRESHOLD && (
                  <p className="text-[11px] text-taupe/80 bg-light-taupe/60 p-2.5 mt-1 border border-border/50">
                    Add <strong className="text-charcoal font-semibold">{formatCurrency(FREE_DELIVERY_THRESHOLD - subtotal)}</strong> more to receive complimentary delivery across Nepal.
                  </p>
                )}
              </div>

              {/* Total Line */}
              <div className="flex justify-between items-baseline py-5 border-b border-border/80">
                <span className="font-serif text-lg text-charcoal uppercase tracking-wider">Total</span>
                <span className="font-serif text-2xl text-charcoal font-medium">{formatCurrency(total)}</span>
              </div>

              {/* Action Buttons: CONTINUE SHOPPING & PROCEED TO CHECKOUT */}
              <div className="flex flex-col gap-3 pt-6">
                <button
                  onClick={() => navigate('/checkout')}
                  className="btn-primary w-full py-4 text-xs tracking-[0.2em] flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={14} />
                </button>

                <button
                  onClick={() => navigate('/shop')}
                  className="btn-outline w-full py-3 text-xs tracking-[0.15em]"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Trust Guarantee */}
              <div className="mt-8 pt-6 border-t border-border/60 flex flex-col gap-2.5 text-[11px] text-taupe">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-gold shrink-0" />
                  <span>100% Certified Authentic Fabrics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-gold shrink-0" />
                  <span>Direct delivery from Kathmandu Atelier</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
