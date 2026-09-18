import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, ShoppingBag, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { orderService } from '@/services/orderService';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/utils/format';
import type { Order } from '@/types';

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const allOrders = await orderService.getOrders();
        // Filter by user if userId exists, otherwise show all (for MVP local storage)
        const userOrders = allOrders.filter(o => !o.userId || o.userId === user.uid);
        setOrders(userOrders);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb / Back */}
        <div className="mb-8 flex items-center gap-2 text-[10px] tracking-widest uppercase text-taupe">
          <Link to="/account" className="hover:text-gold transition-colors">Account</Link>
          <ChevronRight size={10} />
          <span className="text-charcoal font-medium">Order History</span>
        </div>

        <div className="mb-10">
          <h1 className="section-heading mb-2">My Orders</h1>
          <p className="text-taupe text-sm">View and track your previous couture selections.</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-border p-12 text-center flex flex-col items-center gap-5">
            <div className="w-16 h-16 bg-ivory flex items-center justify-center text-border">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h3 className="font-serif text-xl text-charcoal mb-2">No Orders Yet</h3>
              <p className="text-taupe text-xs max-w-xs leading-relaxed">
                You haven't placed any orders yet. Start exploring our collections to find your perfect fit.
              </p>
            </div>
            <Link to="/shop" className="btn-primary mt-2">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white border border-border overflow-hidden hover:border-charcoal transition-colors group"
              >
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-charcoal tracking-wider">
                        #{order.orderId}
                      </span>
                      <span className={`px-2 py-0.5 text-[9px] uppercase tracking-widest font-sans font-bold border ${
                        order.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        order.orderStatus === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                        'bg-gold/10 text-gold border-gold/20'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-taupe font-sans">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        <span>{new Date(order.createdAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        <span>{new Date(order.createdAt).toLocaleTimeString('en-NP', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary & Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-8 border-t sm:border-t-0 pt-4 sm:pt-0">
                    <div className="text-right flex flex-col sm:items-end">
                      <span className="text-[10px] uppercase tracking-widest text-taupe mb-0.5">Total Amount</span>
                      <span className="text-sm font-medium font-mono text-charcoal">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                    <Link
                      to={`/account/orders/${order.orderId}`}
                      className="btn-outline py-2 px-5 text-[10px] tracking-widest flex items-center gap-2 group-hover:bg-charcoal group-hover:text-white transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="bg-ivory/50 px-5 sm:px-6 py-3 border-t border-border/60 flex items-center gap-2 overflow-x-auto">
                  {order.items.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="w-10 h-12 bg-light-taupe shrink-0 border border-border/80">
                      {item.product.images[0]?.url && (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <span className="text-[10px] text-taupe font-sans ml-1">
                      +{order.items.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
