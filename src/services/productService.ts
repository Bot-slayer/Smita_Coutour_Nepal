import type { Product, ProductCategory } from '@/types';
import { sampleProducts } from '@/data/sampleProducts';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    return Promise.resolve([...sampleProducts]);
  },

  getById: async (id: string): Promise<Product | undefined> => {
    const product = sampleProducts.find((p) => p.id === id || p.slug === id);
    return Promise.resolve(product);
  },

  getByCategory: async (category: ProductCategory): Promise<Product[]> => {
    const products = sampleProducts.filter((p) => p.category === category);
    return Promise.resolve(products);
  },

  getFeatured: async (): Promise<Product[]> => {
    return Promise.resolve(sampleProducts.filter((p) => p.isFeatured));
  },

  getNewArrivals: async (): Promise<Product[]> => {
    return Promise.resolve(sampleProducts.filter((p) => p.isNew));
  },

  getSale: async (): Promise<Product[]> => {
    return Promise.resolve(sampleProducts.filter((p) => p.isSale));
  },
};
