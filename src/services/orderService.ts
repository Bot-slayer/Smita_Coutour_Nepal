import type { Order } from '@/types';

const ORDERS_KEY = 'smita_couture_orders';

export const orderService = {
  createOrder: async (orderData: Omit<Order, 'orderId' | 'createdAt'>): Promise<Order> => {
    const newOrder: Order = {
      ...orderData,
      orderId: `SCN-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = localStorage.getItem(ORDERS_KEY);
      const orders: Order[] = existing ? JSON.parse(existing) : [];
      orders.unshift(newOrder);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to persist order locally', e);
    }

    return Promise.resolve(newOrder);
  },

  getOrders: async (): Promise<Order[]> => {
    try {
      const existing = localStorage.getItem(ORDERS_KEY);
      return Promise.resolve(existing ? JSON.parse(existing) : []);
    } catch {
      return Promise.resolve([]);
    }
  },

  getOrderById: async (orderId: string): Promise<Order | undefined> => {
    try {
      const existing = localStorage.getItem(ORDERS_KEY);
      const orders: Order[] = existing ? JSON.parse(existing) : [];
      return Promise.resolve(orders.find((o) => o.orderId === orderId));
    } catch {
      return Promise.resolve(undefined);
    }
  },
};
