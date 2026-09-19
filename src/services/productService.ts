import type { Product, ProductCategory, ProductImage } from '@/types';
import { supabase } from '@/lib/supabase';

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  category_label?: string | null;
  price: number;
  original_price?: number | null;
  discount?: number | null;
  is_on_sale?: boolean | null;
  is_sale?: boolean | null;
  images?: ProductImage[] | null;
  sizes?: string[] | null;
  colors?: string[] | null;
  description: string;
  fabric: string;
  care: string;
  is_new?: boolean | null;
  is_featured?: boolean | null;
  stock: number;
  tags?: string[] | null;
  created_at?: string | null;
  updated_at?: string | null;
};

const mapRowToProduct = (row: ProductRow): Product => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  category: row.category,

  categoryLabel:
    row.category_label ?? undefined,

  price:
    Number(row.price),

  originalPrice:
    row.original_price != null
      ? Number(row.original_price)
      : undefined,

  discount:
    row.discount != null
      ? Number(row.discount)
      : undefined,

  isOnSale:
    row.is_on_sale ?? undefined,

  isSale:
    row.is_sale ?? undefined,

  images:
    row.images ?? [],

  sizes:
    row.sizes ?? [],

  colors:
    row.colors ?? [],

  description:
    row.description,

  fabric:
    row.fabric,

  care:
    row.care,

  isNew:
    row.is_new ?? undefined,

  isFeatured:
    row.is_featured ?? undefined,

  stock:
    Number(row.stock),

  tags:
    row.tags ?? [],
});

const mapProductToRow = (
  data: Partial<Product>
): Record<string, unknown> => ({
  ...(data.id !== undefined && {
    id: data.id,
  }),

  ...(data.name !== undefined && {
    name: data.name,
  }),

  ...(data.slug !== undefined && {
    slug: data.slug,
  }),

  ...(data.category !== undefined && {
    category: data.category,
  }),

  ...(data.categoryLabel !== undefined && {
    category_label: data.categoryLabel,
  }),

  ...(data.price !== undefined && {
    price: data.price,
  }),

  ...(data.originalPrice !== undefined && {
    original_price: data.originalPrice,
  }),

  ...(data.discount !== undefined && {
    discount: data.discount,
  }),

  ...(data.isOnSale !== undefined && {
    is_on_sale: data.isOnSale,
  }),

  ...(data.isSale !== undefined && {
    is_sale: data.isSale,
  }),

  ...(data.images !== undefined && {
    images: data.images,
  }),

  ...(data.sizes !== undefined && {
    sizes: data.sizes,
  }),

  ...(data.colors !== undefined && {
    colors: data.colors,
  }),

  ...(data.description !== undefined && {
    description: data.description,
  }),

  ...(data.fabric !== undefined && {
    fabric: data.fabric,
  }),

  ...(data.care !== undefined && {
    care: data.care,
  }),

  ...(data.isNew !== undefined && {
    is_new: data.isNew,
  }),

  ...(data.isFeatured !== undefined && {
    is_featured: data.isFeatured,
  }),

  ...(data.stock !== undefined && {
    stock: data.stock,
  }),

  ...(data.tags !== undefined && {
    tags: data.tags,
  }),
});

export const productService = {
  // Get all products
  getAll: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('Products')
      .select('*')
      .order('created_at', {
        ascending: false,
      });

    if (error) {
      console.error(
        'Failed to fetch products:',
        error
      );
      throw error;
    }

    return (data as ProductRow[]).map(
      mapRowToProduct
    );
  },

  // Get one product by ID or slug
  getById: async (
    id: string
  ): Promise<Product | undefined> => {
    const { data, error } = await supabase
      .from('Products')
      .select('*')
      .or(`id.eq.${id},slug.eq.${id}`)
      .maybeSingle();

    if (error) {
      console.error(
        'Failed to fetch product:',
        error
      );
      throw error;
    }

    return data
      ? mapRowToProduct(data as ProductRow)
      : undefined;
  },

  // Get products by category
  getByCategory: async (
    category: ProductCategory
  ): Promise<Product[]> => {
    // Ensure we are using a clean string for the query
    const cleanCategory = String(category).toLowerCase().trim();

    const { data, error } = await supabase
      .from('Products')
      .select('*')
      .eq('category', cleanCategory)
      .order('created_at', {
        ascending: false,
      });

    if (error) {
      console.error(
        'Failed to fetch products by category:',
        error
      );
      throw error;
    }

    // Double check the results client-side just in case Supabase filter was bypassed
    const filteredResults = (data as ProductRow[]).filter(
      (row) => row.category?.toLowerCase() === cleanCategory
    );

    return filteredResults.map(
      mapRowToProduct
    );
  },

  // Get featured products
  getFeatured: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('Products')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', {
        ascending: false,
      });

    if (error) {
      console.error(
        'Failed to fetch featured products:',
        error
      );
      throw error;
    }

    return (data as ProductRow[]).map(
      mapRowToProduct
    );
  },

  // Get new arrivals
  getNewArrivals: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('Products')
      .select('*')
      .eq('is_new', true)
      .order('created_at', {
        ascending: false,
      });

    if (error) {
      console.error(
        'Failed to fetch new arrivals:',
        error
      );
      throw error;
    }

    return (data as ProductRow[]).map(
      mapRowToProduct
    );
  },

  // Get sale products
  getSale: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('Products')
      .select('*')
      .or(
        'is_on_sale.eq.true,is_sale.eq.true'
      )
      .order('created_at', {
        ascending: false,
      });

    if (error) {
      console.error(
        'Failed to fetch sale products:',
        error
      );
      throw error;
    }

    return (data as ProductRow[]).map(
      mapRowToProduct
    );
  },

  // Create a new product
  create: async (
    data: Omit<Product, 'id' | 'slug'>
  ): Promise<Product> => {
    const slug = data.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const row = mapProductToRow({
      ...data,
      slug,
    });

    const { data: created, error } = await supabase
      .from('Products')
      .insert(row)
      .select('*')
      .single();

    if (error) {
      console.error(
        'Failed to create product:',
        error
      );
      throw error;
    }

    return mapRowToProduct(
      created as ProductRow
    );
  },

  // Update an existing product
  update: async (
    id: string,
    data: Partial<Product>
  ): Promise<Product> => {
    const row = mapProductToRow(data);

    const { data: updated, error } = await supabase
      .from('Products')
      .update(row)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error(
        'Failed to update product:',
        error
      );
      throw error;
    }

    return mapRowToProduct(
      updated as ProductRow
    );
  },

  // Delete a product
  delete: async (
    id: string
  ): Promise<void> => {
    const { error } = await supabase
      .from('Products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(
        'Failed to delete product:',
        error
      );
      throw error;
    }
  },

  // Get paginated products with optional filters
  getPaginated: async (options: {
    page: number;
    pageSize: number;
    category?: ProductCategory;
    isNew?: boolean;
    isFeatured?: boolean;
    isSale?: boolean;
  }): Promise<{ products: Product[]; total: number }> => {
    const { page, pageSize, category, isNew, isFeatured, isSale } = options;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('Products')
      .select('*', { count: 'exact' });

    if (category) {
      query = query.eq('category', category.toLowerCase().trim());
    }
    if (isNew) {
      query = query.eq('is_new', true);
    }
    if (isFeatured) {
      query = query.eq('is_featured', true);
    }
    if (isSale) {
      query = query.or('is_on_sale.eq.true,is_sale.eq.true');
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Failed to fetch paginated products:', error);
      throw error;
    }

    return {
      products: (data as ProductRow[]).map(mapRowToProduct),
      total: count || 0,
    };
  },
};