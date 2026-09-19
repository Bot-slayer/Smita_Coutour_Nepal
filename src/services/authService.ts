import type { User, SavedAddress } from '@/types';

const AUTH_USER_KEY = 'smita_couture_auth_user';
const USERS_DB_KEY = 'smita_couture_users_db';

export interface RegisterPayload {
  fullName: string;
  email: string;
  password?: string;
  phone: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

/**
 * Authentication Service
 * Designed with a clean adapter pattern so Firebase Authentication
 * can be plugged in seamlessly by setting up initializeApp/getAuth.
 */
export const authService = {
  /**
   * Register a new customer with full name, email, password & phone
   */
  register: async (payload: RegisterPayload): Promise<User> => {
    // Artificial latency for authentic luxury feel
    await new Promise((r) => setTimeout(r, 600));

    const existingUsers: (User & { password?: string })[] = JSON.parse(
      localStorage.getItem(USERS_DB_KEY) || '[]'
    );

    const userExists = existingUsers.some((u) => u.email.toLowerCase() === payload.email.toLowerCase());
    if (userExists) {
      throw new Error('An account with this email address already exists. Please sign in.');
    }

    const newUser: User & { password?: string } = {
      uid: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: payload.email.toLowerCase(),
      displayName: payload.fullName,
      phone: payload.phone,
      createdAt: new Date().toISOString(),
      addresses: [
        {
          id: `addr_${Date.now()}`,
          title: 'Primary Residence',
          fullName: payload.fullName,
          phone: payload.phone,
          province: 'Bagmati Province',
          city: 'Kathmandu',
          area: 'Maharajgunj',
          street: 'Main Road, House 42',
          postalCode: '44600',
          isDefault: true,
        },
      ],
      password: payload.password,
      role: payload.email.toLowerCase().includes('admin') ? 'admin' : 'customer',
    };

    existingUsers.push(newUser);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(existingUsers));

    // Exclude password from session
    const { password, ...safeUser } = newUser;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(safeUser));

    return safeUser;
  },

  /**
   * Login customer with email and password
   */
  login: async (payload: LoginPayload): Promise<User> => {
    await new Promise((r) => setTimeout(r, 500));

    const existingUsers: (User & { password?: string })[] = JSON.parse(
      localStorage.getItem(USERS_DB_KEY) || '[]'
    );

    const matched = existingUsers.find(
      (u) => u.email.toLowerCase() === payload.email.toLowerCase()
    );

    if (!matched) {
      // Demo fallback: create a session if first time trying login
      const demoUser: User = {
        uid: `usr_demo_${Date.now()}`,
        email: payload.email.toLowerCase(),
        displayName: payload.email.split('@')[0].toUpperCase(),
        phone: '+977 9801234567',
        role: payload.email.toLowerCase().includes('admin') ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
        addresses: [
          {
            id: `addr_demo`,
            title: 'Primary Residence',
            fullName: payload.email.split('@')[0].toUpperCase(),
            phone: '+977 9801234567',
            province: 'Bagmati Province',
            city: 'Kathmandu',
            area: 'Baluwatar',
            street: 'Marg 3',
            postalCode: '44600',
            isDefault: true,
          },
        ],
      };
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(demoUser));
      return demoUser;
    }

    if (payload.password && matched.password && matched.password !== payload.password) {
      throw new Error('Incorrect password. Please verify your credentials.');
    }

    const { password, ...safeUser } = matched;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(safeUser));
    return safeUser;
  },

  /**
   * Send password reset request
   */
  resetPassword: async (email: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 600));
    console.log(`[AuthService] Password reset token dispatched to: ${email}`);
    return true;
  },

  /**
   * Get active logged in customer
   */
  getCurrentUser: (): User | null => {
    try {
      const data = localStorage.getItem(AUTH_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  /**
   * Logout customer
   */
  logout: async (): Promise<void> => {
    localStorage.removeItem(AUTH_USER_KEY);
  },

  /**
   * Update Profile Information
   */
  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    const existing = authService.getCurrentUser();
    if (!existing) throw new Error('Not authenticated');

    const updated: User = { ...existing, ...data };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));

    // Update in users db
    try {
      const users: User[] = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
      const idx = users.findIndex((u) => u.uid === userId);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...data };
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
      }
    } catch (e) {
      console.error(e);
    }

    return updated;
  },

  /**
   * Add a new saved address
   */
  saveAddress: async (userId: string, address: Omit<SavedAddress, 'id'>): Promise<SavedAddress[]> => {
    const existing = authService.getCurrentUser();
    if (!existing) throw new Error('Not authenticated');

    const newAddr: SavedAddress = {
      ...address,
      id: `addr_${Date.now()}`,
    };

    const currentAddresses = existing.addresses || [];
    const updatedAddresses = [newAddr, ...currentAddresses];

    await authService.updateProfile(userId, { addresses: updatedAddresses });
    return updatedAddresses;
  },

  /**
   * Remove a saved address
   */
  deleteAddress: async (userId: string, addressId: string): Promise<SavedAddress[]> => {
    const existing = authService.getCurrentUser();
    if (!existing) throw new Error('Not authenticated');

    const currentAddresses = existing.addresses || [];
    const updatedAddresses = currentAddresses.filter((a) => a.id !== addressId);

    await authService.updateProfile(userId, { addresses: updatedAddresses });
    return updatedAddresses;
  },
};
