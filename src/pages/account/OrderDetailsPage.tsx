import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Package, MapPin, CreditCard, Clock, Calendar, Truck, ArrowRight } from 'lucide-react';
import { orderService } from '@/services/orderService';
import { formatCurrency } from '@/utils/format';
import type { Order } from '@/types';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      const data = await orderService.getOrderById(id);
      if (data) {
        setOrder(data);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-serif text-2xl text-charcoal mb-4">Order Not Found</h2>
        <Link to="/account/orders" className="btn-primary">Back to Orders</Link>
      </div>
    );
  }

  const steps = [
    { label: 'Pending', icon: Clock, current: order.orderStatus === 'Pending' },
    { label: 'Confirmed', icon: Calendar, current: order.orderStatus === 'Confirmed' },
    { label: 'Processing', icon: Package, current: order.orderStatus === 'Processing' },
    { label: 'Shipped', icon: Truck, current: order.orderStatus === 'Shipped' },
    { label: 'Delivered', icon: Truck, current: order.orderStatus === 'Delivered' },
  ];

  return (
    <div className="bg-ivory min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <Link
              to="/account/orders"
              className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-taupe hover:text-gold transition-colors mb-4"
            >
              <ChevronLeft size={14} /> Back to Orders
            </Link>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="font-serif text-3xl text-charcoal tracking-tight">Order #{order.orderId}</h1>
              <span className="bg-gold/10 text-gold px-3 py-1 text-[10px] uppercase tracking-widest font-bold border border-gold/20">
                {order.orderStatus}
              </span>
            </div>
            <p className="text-taupe text-sm">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn-outline text-[10px] tracking-widest uppercase py-2.5 px-6">
              Download Invoice
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Items */}
          <div className="lg:col-span-2 space-y-8">
            {/* Items List */}
            <div className="bg-white border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-ivory/30">
                <h2 className="text-xs tracking-widest uppercase text-charcoal font-semibold flex items-center gap-2">
                  <ShoppingBag size={14} className="text-gold" /> Items Summary
                </h2>
              </div>
              <div className="divide-y divide-border/60">
                {order.items.map((item, idx) => (
                  <div key={idx} className="p-6 flex gap-6 items-center">
                    <div className="w-20 h-28 bg-light-taupe shrink-0 border border-border/80">
                      <ImagePlaceholder
                        src={item.product.images[0]?.url}
                        alt={item.product.name}
                        title={item.product.name}
                        aspectRatio="portrait"
                        className="w-full h-full text-[8px]"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-lg text-charcoal mb-1 line-clamp-1">{item.product.name}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-taupe mb-2">
                        <span>Size: <strong className="text-charcoal">{item.size}</strong></span>
                        {item.color && <span>Color: <strong className="text-charcoal">{item.color}</strong></span>}
                        <span>Qty: <strong className="text-charcoal">{item.quantity}</strong></span>
                      </div>
                      <p className="font-mono text-sm text-charcoal">{formatCurrency(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Tracking (Simple Visualization) */}
            <div className="bg-white border border-border p-6 sm:p-8">
              <h2 className="text-xs tracking-widest uppercase text-charcoal font-semibold mb-8 flex items-center gap-2">
                <Clock size={14} className="text-gold" /> Order Status
              </h2>
              <div className="relative flex justify-between">
                {/* Connector Line */}
                <div className="absolute top-5 left-0 w-full h-0.5 bg-border -z-0" />
                {steps.map((step, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center gap-3 w-1/5">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      step.current ? 'bg-gold border-gold text-ivory' : 'bg-white border-border text-taupe'
                    }`}>
                      <step.icon size={18} />
                    </div>
                    <span className={`text-[10px] tracking-tight text-center font-medium ${step.current ? 'text-charcoal' : 'text-taupe'}`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Details & Summary */}
          <div className="space-y-8">
            {/* Delivery & Payment */}
            <div className="bg-white border border-border p-6 space-y-8">
              {/* Shipping */}
              <div>
                <h2 className="text-xs tracking-widest uppercase text-charcoal font-semibold mb-4 flex items-center gap-2">
                  <MapPin size={14} className="text-gold" /> Shipping Address
                </h2>
                <div className="text-xs text-taupe leading-relaxed space-y-1">
                  <p className="text-charcoal font-medium text-sm">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.area}, {order.shippingAddress.city}</p>
                  <p>{order.shippingAddress.province}{order.shippingAddress.postalCode ? `, ${order.shippingAddress.postalCode}` : ''}</p>
                  <p className="pt-2">{order.shippingAddress.phone}</p>
                  <p>{order.shippingAddress.email}</p>
                </div>
              </div>

              {/* Payment */}
              <div>
                <h2 className="text-xs tracking-widest uppercase text-charcoal font-semibold mb-4 flex items-center gap-2">
                  <CreditCard size={14} className="text-gold" /> Payment Info
                </h2>
                <div className="text-xs text-taupe space-y-2">
                  <div className="flex justify-between">
                    <span>Method:</span>
                    <span className="text-charcoal font-medium uppercase">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-charcoal font-medium">{order.paymentStatus}</span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="pt-8 border-t border-border">
                <div className="space-y-3 text-xs text-taupe mb-5">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-charcoal font-mono">{formatCurrency(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span className="text-emerald-700 font-mono">-{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="text-charcoal font-mono">
                      {order.deliveryCharge === 0 ? 'Free' : formatCurrency(order.deliveryCharge)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-baseline pt-5 border-t border-border">
                  <span className="font-serif text-lg text-charcoal">Total</span>
                  <span className="font-serif text-2xl text-charcoal font-medium">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Support Box */}
            <div className="bg-charcoal text-ivory p-6">
              <h3 className="font-serif text-lg mb-2">Need Assistance?</h3>
              <p className="text-[11px] text-ivory/70 leading-relaxed mb-6">
                If you have any questions regarding your order or bespoke measurements, please contact our concierge.
              </p>
              <Link to="/contact" className="w-full flex items-center justify-between group border-b border-ivory/20 pb-2 text-[10px] tracking-widest uppercase">
                <span>Contact Atelier</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Re-using ShoppingBag since it's common
function ShoppingBag({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
