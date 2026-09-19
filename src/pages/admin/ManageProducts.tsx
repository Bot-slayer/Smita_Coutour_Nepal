import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, ExternalLink, Package, AlertCircle } from 'lucide-react';
import { productService } from '@/services/productService';
import { formatCurrency } from '@/utils/format';
import type { Product, ProductCategory } from '@/types';
import ProductForm from './ProductForm';
import toast from 'react-hot-toast';

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  const fetchProducts = async () => {
    setIsLoading(true);
    const data = await productService.getAll();
    setProducts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      await productService.delete(id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Manage Products</h1>
          <p className="text-sm text-taupe mt-1">Add, edit and manage your couture collection.</p>
        </div>
        <button
          onClick={() => { setEditingProduct(undefined); setIsFormOpen(true); }}
          className="btn-primary flex items-center gap-2 px-6 py-3 text-xs tracking-widest"
        >
          <Plus size={16} /> Add New Product
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-border p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-border text-sm focus:outline-none focus:border-charcoal"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-taupe" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-50 border border-border px-4 py-2 text-sm focus:outline-none focus:border-charcoal"
          >
            <option value="all">All Categories</option>
            <option value="sarees">Sarees</option>
            <option value="dresses">Dresses</option>
            <option value="bridal">Bridal</option>
            <option value="suits">Suits</option>
            <option value="kurtis">Kurtis</option>
            <option value="gowns">Gowns</option>
            <option value="lehengas">Lehengas</option>
            <option value="designer-wear">Designer Wear</option>
            <option value="tops">Tops</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border text-[10px] tracking-widest uppercase text-taupe font-sans">
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold text-right">Price</th>
                <th className="px-6 py-4 font-semibold text-center">Stock</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="inline-block w-8 h-8 border-2 border-gold border-t-transparent animate-spin rounded-full" />
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-taupe">
                    <div className="flex flex-col items-center gap-2">
                      <Package size={32} className="opacity-20" />
                      <span>No products found matching your criteria.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 bg-gray-100 border border-border overflow-hidden shrink-0">
                          {p.images[0]?.url ? (
                            <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <Package size={16} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-serif text-charcoal">{p.name}</p>
                          <p className="text-[10px] font-mono text-taupe tracking-tighter uppercase">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-taupe capitalize">{p.categoryLabel || p.category}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-charcoal">{formatCurrency(p.price)}</span>
                        {p.originalPrice && (
                          <span className="text-[10px] text-taupe line-through">{formatCurrency(p.originalPrice)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-medium ${p.stock <= 2 ? 'text-red-600' : 'text-charcoal'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {p.stock > 0 ? (
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="Active" />
                      ) : (
                        <span className="inline-block w-2 h-2 rounded-full bg-red-500" title="Out of Stock" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/product/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-taupe hover:text-gold transition-colors"
                          title="View on Site"
                        >
                          <ExternalLink size={16} />
                        </a>
                        <button
                          onClick={() => { setEditingProduct(p); setIsFormOpen(true); }}
                          className="p-2 text-taupe hover:text-charcoal transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-taupe hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => { setIsFormOpen(false); fetchProducts(); }}
        />
      )}
    </div>
  );
}
