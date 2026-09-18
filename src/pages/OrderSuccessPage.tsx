import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, MapPin, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import type { Order } from '@/types';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';

export default function OrderSuccessPage() {
  const location = useLocation();
  const { orderId, order } = (location.state as { orderId: string; order?: Order }) || {};

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
      {/* Icon */}
      <div className="flex items-center justify-center mb-8">
        <div className="w-20 h-20 border-2 border-gold flex items-center justify-center">
          <CheckCircle size={36} className="text-gold" />
        </div>
      </div>

      <p className="section-label mb-4">ORDER PLACED SUCCESSFULLY</p>
      <h1 className="font-serif text-3xl sm:text-4xl text-charcoal mb-4">
        Thank you for shopping with Smita Couture Nepal.
      </h1>
      <p className="text-taupe leading-relaxed mb-12 max-w-md mx-auto text-sm">
        We have received your order. Our team will verify the details and begin preparing your couture pieces shortly.
      </p>

      {order && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 text-left">
          {/* Left: Summary & Status */}
          <div className="bg-white border border-border p-7 flex flex-col gap-6">
            <div>
              <h2 className="text-[10px] tracking-widest uppercase text-taupe font-semibold mb-4 border-b border-border pb-2">
                Order Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs text-taupe">Order Number</span>
                  <span className="font-mono text-sm font-semibold text-charcoal">#{order.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-taupe">Status</span>
                  <span className="bg-gold/10 text-gold px-2 py-0.5 text-[9px] uppercase tracking-widest font-bold border border-gold/20">
                    {order.orderStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-taupe">Payment Method</span>
                  <span className="text-xs text-charcoal uppercase">{order.paymentMethod}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-[10px] tracking-widest uppercase text-taupe font-semibold mb-4 border-b border-border pb-2 flex items-center gap-2">
                <MapPin size={12} className="text-gold" /> Delivery Address
              </h2>
              <div className="text-xs text-taupe leading-relaxed">
                <p className="text-charcoal font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.area}, {order.shippingAddress.city}</p>
                <p>{order.shippingAddress.province}{order.shippingAddress.postalCode ? `, ${order.shippingAddress.postalCode}` : ''}</p>
                <p className="mt-2 text-charcoal">{order.shippingAddress.phone}</p>
              </div>
            </div>
          </div>

          {/* Right: Items Preview */}
          <div className="bg-white border border-border p-7">
            <h2 className="text-[10px] tracking-widest uppercase text-taupe font-semibold mb-4 border-b border-border pb-2 flex items-center gap-2">
              <ShoppingBag size={12} className="text-gold" /> Order Items
            </h2>
            <div className="space-y-4 max-h-64 overflow-y-auto mb-6 pr-2 custom-scrollbar">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <div className="w-12 h-16 bg-light-taupe shrink-0 border border-border/80">
                    <ImagePlaceholder
                      src={item.product.images[0]?.url}
                      alt={item.product.name}
                      title={item.product.name}
                      aspectRatio="portrait"
                      className="w-full h-full text-[6px]"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-charcoal line-clamp-1">{item.product.name}</p>
                    <p className="text-[10px] text-taupe">{item.size} · ×{item.quantity}</p>
                  </div>
                  <div className="text-xs font-mono text-charcoal">
                    {formatCurrency(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-taupe">Total Amount</span>
                <span className="font-serif text-xl text-charcoal font-medium">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fallback for simple ID display if full order object is missing */}
      {!order && orderId && (
        <div className="bg-white border border-border p-8 mb-12 max-w-sm mx-auto">
          <p className="text-xs text-taupe uppercase tracking-widest mb-2">Order ID</p>
          <p className="font-mono text-lg font-semibold text-charcoal">#{orderId}</p>
        </div>
      )}

      {/* What's next */}
      <div className="flex flex-col gap-3 text-xs text-taupe mb-12">
        <div className="flex items-center gap-3 justify-center">
          <Package size={15} className="text-gold shrink-0" />
          <span>You'll receive a confirmation email with details once your order is processed.</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/account/orders" className="btn-primary py-4 px-8 text-xs tracking-[0.2em]">
          View Order History
        </Link>
        <Link to="/shop" className="btn-outline py-4 px-8 text-xs tracking-[0.15em] flex items-center justify-center gap-2">
          Continue Shopping <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
