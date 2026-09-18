import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/utils/format';
import type { ShippingAddress } from '@/types';
import { orderService } from '@/services/orderService';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';

const SHIPPING_THRESHOLD = 5000;
const SHIPPING_FEE = 300;

const PROVINCES = [
  'Koshi Province', 'Madhesh Province', 'Bagmati Province',
  'Gandaki Province', 'Lumbini Province', 'Karnali Province', 'Sudurpaschim Province',
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const discount = useCartStore((s) => s.discountAmount());
  const shippingFee = useCartStore((s) => s.deliveryCharge());
  const total = useCartStore((s) => s.total());
  const clearCart = useCartStore((s) => s.clearCart);

  const user = useAuthStore((s) => s.user);

  const [form, setForm] = useState<ShippingAddress>({
    fullName: user?.displayName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    street: '',
    city: '',
    area: '',
    province: 'Bagmati Province',
    postalCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof ShippingAddress) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const order = await orderService.createOrder({
        userId: user?.uid,
        customerName: form.fullName,
        email: form.email,
        phone: form.phone,
        items,
        subtotal,
        deliveryCharge: shippingFee,
        discount,
        total,
        shippingAddress: form,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Pending',
        orderStatus: 'Pending',
      });
      clearCart();
      navigate('/order-success', { state: { orderId: order.orderId, order } });
    } catch (error) {
      console.error(error);
      const orderId = `SCN-${Date.now().toString().slice(-6)}`;
      clearCart();
      navigate('/order-success', { state: { orderId, total, form } });
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16">
      <p className="section-label mb-2">Final Step</p>
      <h1 className="section-heading mb-10">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Shipping + Payment */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            {/* Shipping Address */}
            <div>
              <h2 className="font-serif text-xl text-charcoal mb-6 pb-4 border-b border-border">
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="text-xs tracking-widest uppercase text-taupe block mb-2">Full Name *</label>
                  <input required value={form.fullName} onChange={set('fullName')} placeholder="Your full name" className="form-input" />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-taupe block mb-2">Phone *</label>
                  <input required value={form.phone} onChange={set('phone')} placeholder="+977 98XXXXXXXX" className="form-input" />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-taupe block mb-2">Email *</label>
                  <input required type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className="form-input" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs tracking-widest uppercase text-taupe block mb-2">Street Address *</label>
                  <input required value={form.street} onChange={set('street')} placeholder="House no., Street, Area" className="form-input" />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-taupe block mb-2">City *</label>
                  <input required value={form.city} onChange={set('city')} placeholder="Kathmandu" className="form-input" />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-taupe block mb-2">Area *</label>
                  <input required value={form.area} onChange={set('area')} placeholder="Baneshwor / Lalitpur" className="form-input" />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-taupe block mb-2">Province *</label>
                  <select required value={form.province} onChange={set('province')} className="form-input">
                    {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-taupe block mb-2">Postal Code</label>
                  <input value={form.postalCode} onChange={set('postalCode')} placeholder="44600" className="form-input" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h2 className="font-serif text-xl text-charcoal mb-6 pb-4 border-b border-border">
                Payment Method
              </h2>
              <div className="flex flex-col gap-3">
                {[
                  { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                  { value: 'bank', label: 'Bank Transfer', desc: 'Transfer to our account — details emailed to you' },
                  { value: 'esewa', label: 'eSewa', desc: 'Pay via eSewa (coming soon)' },
                  { value: 'khalti', label: 'Khalti', desc: 'Pay via Khalti (coming soon)' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${
                      paymentMethod === opt.value ? 'border-charcoal bg-light-taupe' : 'border-border hover:border-taupe'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={paymentMethod === opt.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-0.5 accent-gold"
                    />
                    <div>
                      <p className="text-sm font-medium text-charcoal">{opt.label}</p>
                      <p className="text-xs text-taupe mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div>
            <div className="bg-white border border-border p-7 sticky top-24">
              <h2 className="font-serif text-xl text-charcoal mb-6">Order Summary</h2>

              <div className="flex flex-col gap-3 max-h-60 overflow-y-auto mb-5">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
                    <div className="w-12 h-16 bg-light-taupe overflow-hidden shrink-0 border border-border">
                      <ImagePlaceholder
                        src={item.product.images[0]?.url}
                        alt={item.product.name}
                        title={item.product.name}
                        aspectRatio="portrait"
                        className="w-full h-full text-[7px]"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-charcoal line-clamp-1">{item.product.name}</p>
                      <p className="text-[10px] text-taupe">{item.size} · ×{item.quantity}</p>
                      <p className="text-xs text-charcoal">{formatCurrency(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 py-5 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-taupe">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-taupe">Discount</span>
                    <span className="text-emerald-700">-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-taupe">Shipping</span>
                  <span>{shippingFee === 0 ? 'Free' : formatCurrency(shippingFee)}</span>
                </div>
              </div>

              <div className="flex justify-between py-5 border-t border-border">
                <span className="font-medium text-charcoal">Total</span>
                <span className="font-serif text-xl text-charcoal">{formatCurrency(total)}</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`btn-primary w-full ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {submitting ? 'Placing Order…' : 'Place Order'}
              </button>

              <p className="text-[10px] text-taupe text-center mt-4">
                By placing an order you agree to our Terms & Conditions.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
