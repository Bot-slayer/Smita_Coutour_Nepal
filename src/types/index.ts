// ─── Product ─────────────────────────────────────────────────────────────────

export type ProductCategory =
  | 'sarees'
  | 'dresses'
  | 'bridal'
  | 'suits'
  | 'kurtis'
  | 'gowns'
  | 'lehengas'
  | 'designer-wear'
  | 'tops'
  | 'accessories';

export interface ProductImage {
  url?: string;
  alt: string;
  label?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  categoryLabel?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  isOnSale?: boolean;
  isSale?: boolean;
  images: ProductImage[];
  sizes: string[];
  colors: string[];
  description: string;
  fabric: string;
  care: string;
  isNew?: boolean;
  isFeatured?: boolean;
  stock: number;
  tags: string[];
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

// ─── Wishlist ────────────────────────────────────────────────────────────────

export type WishlistItem = Product;

// ─── Auth / User & Saved Addresses ──────────────────────────────────────────

export interface SavedAddress {
  id: string;
  title: string;          // e.g. "Residence", "Atelier / Studio"
  fullName: string;
  phone: string;
  province: string;
  city: string;
  area: string;
  street: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  photoURL?: string;
  role: 'admin' | 'customer';
  addresses?: SavedAddress[];
  createdAt: string;
}

// ─── Order ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type PaymentStatus = 'Pending' | 'Paid' | 'Cash on Delivery';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  province: string;
  city: string;
  area: string;
  street: string;
  postalCode?: string;
}

export interface Order {
  orderId: string;
  userId?: string;
  customerName: string;
  email: string;
  phone: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
}

// ─── Filters ─────────────────────────────────────────────────────────────────

export interface ProductFilters {
  categories: ProductCategory[];
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  inStockOnly: boolean;
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc';
  onSaleOnly: boolean;
  searchQuery: string;
}
