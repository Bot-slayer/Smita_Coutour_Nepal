import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';

export const FREE_DELIVERY_THRESHOLD = 5000;
export const STANDARD_DELIVERY_FEE = 350;

interface CartStore {
  items: CartItem[];
  isDrawerOpen: boolean;
  couponCode: string | null;
  discountPercentage: number;

  addItem: (product: Product, size: string, color: string, quantity?: number) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Computations
  totalItems: () => number;
  subtotal: () => number;
  deliveryCharge: () => number;
  discountAmount: () => number;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      couponCode: null,
      discountPercentage: 0,

      addItem: (product, size, color, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product.id === product.id && i.size === size && i.color === color
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id && i.size === size && i.color === color
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, size, color, quantity }] };
        });
      },

      removeItem: (productId, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.product.id === productId && i.size === size && i.color === color)
          ),
        }));
      },

      updateQuantity: (productId, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId && i.size === size && i.color === color
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [], couponCode: null, discountPercentage: 0 }),

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      applyCoupon: (code: string) => {
        const clean = code.trim().toUpperCase();
        if (clean === 'SMITA10') {
          set({ couponCode: clean, discountPercentage: 10 });
          return { success: true, message: 'VIP Promo applied: 10% Off!' };
        } else if (clean === 'FESTIVE15') {
          set({ couponCode: clean, discountPercentage: 15 });
          return { success: true, message: 'Festive Offer applied: 15% Off!' };
        } else if (clean === 'COUTURE') {
          set({ couponCode: clean, discountPercentage: 20 });
          return { success: true, message: 'Exclusive Privilege: 20% Off!' };
        }
        return { success: false, message: 'Invalid promo code. Try SMITA10 or FESTIVE15' };
      },

      removeCoupon: () => set({ couponCode: null, discountPercentage: 0 }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      deliveryCharge: () => {
        const sub = get().subtotal();
        if (sub === 0) return 0;
        return sub >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
      },

      discountAmount: () => {
        const sub = get().subtotal();
        const pct = get().discountPercentage;
        return Math.round((sub * pct) / 100);
      },

      total: () => {
        const sub = get().subtotal();
        const delivery = get().deliveryCharge();
        const discount = get().discountAmount();
        return Math.max(0, sub + delivery - discount);
      },
    }),
    { name: 'smita-couture-cart' }
  )
);
