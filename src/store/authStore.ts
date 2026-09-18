import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, SavedAddress } from '@/types';
import { authService } from '@/services/authService';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  addSavedAddress: (address: Omit<SavedAddress, 'id'>) => Promise<void>;
  removeSavedAddress: (addressId: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),

      updateProfile: async (data) => {
        const user = get().user;
        if (!user) return;
        const updated = await authService.updateProfile(user.uid, data);
        set({ user: updated });
      },

      addSavedAddress: async (address) => {
        const user = get().user;
        if (!user) return;
        const updatedList = await authService.saveAddress(user.uid, address);
        set({ user: { ...user, addresses: updatedList } });
      },

      removeSavedAddress: async (addressId) => {
        const user = get().user;
        if (!user) return;
        const updatedList = await authService.deleteAddress(user.uid, addressId);
        set({ user: { ...user, addresses: updatedList } });
      },

      logout: async () => {
        await authService.logout();
        set({ user: null });
      },
    }),
    { name: 'smita-couture-auth' }
  )
);
