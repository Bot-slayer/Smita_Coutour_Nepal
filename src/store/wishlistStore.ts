import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
  // Architecture hook for logged-in user cloud sync (Firebase / Firestore)
  syncWithBackend: (userId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (!get().isWishlisted(product.id)) {
          set((state) => ({ items: [...state.items, product] }));
        }
      },

      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter((p) => p.id !== productId) }));
      },

      toggleItem: (product) => {
        if (get().isWishlisted(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      isWishlisted: (productId) => get().items.some((p) => p.id === productId),

      clearWishlist: () => set({ items: [] }),

      syncWithBackend: async (userId: string) => {
        // Ready for Firebase Firestore integration:
        // e.g. await setDoc(doc(db, 'users', userId, 'wishlist'), { items: get().items });
        console.log(`[Wishlist Sync] Architecture hook ready for Firebase user: ${userId}`);
      },
    }),
    { name: 'smita-couture-wishlist' }
  )
);
