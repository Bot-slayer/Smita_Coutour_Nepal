import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, Info, AlertCircle, Sparkles } from 'lucide-react';
import { productService } from '@/services/productService';
import type { Product, ProductCategory, ProductImage } from '@/types';
import toast from 'react-hot-toast';

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'sarees', label: 'Sarees' },
  { value: 'dresses', label: 'Dresses' },
  { value: 'bridal', label: 'Bridal' },
  { value: 'suits', label: 'Suits' },
  { value: 'kurtis', label: 'Kurtis' },
  { value: 'gowns', label: 'Gowns' },
  { value: 'lehengas', label: 'Lehengas' },
  { value: 'designer-wear', label: 'Designer Wear' },
  { value: 'tops', label: 'Tops' },
  { value: 'accessories', label: 'Accessories' },
];

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

export default function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const isEditing = !!product;
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'sarees' as ProductCategory,
    description: '',
    fabric: '',
    care: '',
    discount: '',
    stock: '5',
    isNew: false,
    isFeatured: false,
    isOnSale: false,
  });

  const [images, setImages] = useState<ProductImage[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [newColor, setNewColor] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || '',
        category: product.category,
        description: product.description,
        fabric: product.fabric,
        care: product.care,
        discount: product.discount?.toString() || '',
        stock: product.stock.toString(),
        isNew: !!product.isNew,
        isFeatured: !!product.isFeatured,
        isOnSale: !!product.isOnSale,
      });
      setImages(product.images || []);
      setSizes(product.sizes || []);
      setColors(product.colors || []);
      setTags(product.tags || []);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB for storage efficiency.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImages((prev) => [...prev, { url: base64, alt: formData.name || 'Product Image' }]);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleSize = (size: string) => {
    setSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
  };

  const addColor = () => {
    if (newColor.trim() && !colors.includes(newColor.trim())) {
      setColors([...colors, newColor.trim()]);
      setNewColor('');
    }
  };

  const removeColor = (c: string) => {
    setColors(colors.filter((x) => x !== c));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (t: string) => {
    setTags(tags.filter((x) => x !== t));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return toast.error('Product name is required');
    if (!formData.price || isNaN(Number(formData.price))) return toast.error('Valid price is required');
    if (images.length === 0) return toast.error('At least one product image is required');

    setSubmitting(true);
    try {
      const calculatedDiscount = formData.originalPrice
        ? Math.round(((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100)
        : undefined;

      const payload = {
        name: formData.name,
        category: formData.category,
        categoryLabel: CATEGORIES.find(c => c.value === formData.category)?.label,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        discount: formData.discount ? Number(formData.discount) : calculatedDiscount,
        images,
        sizes,
        colors,
        description: formData.description,
        fabric: formData.fabric,
        care: formData.care,
        isNew: formData.isNew,
        isFeatured: formData.isFeatured,
        isOnSale: formData.isOnSale,
        stock: Number(formData.stock),
        tags,
      };

      if (isEditing && product) {
        await productService.update(product.id, payload);
        toast.success('Product updated successfully');
      } else {
        await productService.create(payload as any);
        toast.success('Product added to collection');
      }
      onSuccess();
    } catch (error) {
      toast.error('Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="font-serif text-2xl text-charcoal">
              {isEditing ? 'Edit Piece' : 'Add New Couture Piece'}
            </h2>
            <p className="text-xs text-taupe mt-1">Manage details, images and inventory for your collection.</p>
          </div>
          <button onClick={onClose} className="p-2 text-taupe hover:text-charcoal transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column: Basic Info & Images */}
            <div className="space-y-6">
              <div>
                <label className="text-xs tracking-widest uppercase text-taupe block mb-2 font-medium">Product Name *</label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Royal Gold Banarasi Saree"
                  className="w-full bg-gray-50 border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-charcoal"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs tracking-widest uppercase text-taupe block mb-2 font-medium">Selling Price *</label>
                  <input
                    required
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="24500"
                    className="w-full bg-gray-50 border border-border px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-charcoal"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-taupe block mb-2 font-medium">Original Price</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    placeholder="28000"
                    className="w-full bg-gray-50 border border-border px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-charcoal"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs tracking-widest uppercase text-taupe block font-medium">Discount %</label>
                    <button
                      type="button"
                      onClick={() => {
                        if (formData.price && formData.originalPrice) {
                          const p = Number(formData.price);
                          const op = Number(formData.originalPrice);
                          if (op > p) {
                            const d = Math.round(((op - p) / op) * 100);
                            setFormData(prev => ({ ...prev, discount: d.toString(), isOnSale: true }));
                          }
                        }
                      }}
                      className="text-[10px] text-gold hover:underline uppercase tracking-tighter"
                    >
                      Auto-Calc
                    </button>
                  </div>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="20"
                    className="w-full bg-gray-50 border border-border px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-charcoal"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs tracking-widest uppercase text-taupe block mb-2 font-medium">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-charcoal"
                >
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              {/* Images */}
              <div>
                <label className="text-xs tracking-widest uppercase text-taupe block mb-3 font-medium">Product Images *</label>
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-[3/4] bg-gray-100 border border-border overflow-hidden group">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-white/80 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <label className="aspect-[3/4] border-2 border-dashed border-border hover:border-gold hover:bg-gold/5 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-taupe">
                      <Upload size={20} />
                      <span className="text-[10px] uppercase font-bold tracking-tighter">Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
                <p className="text-[10px] text-taupe mt-3 italic flex items-center gap-1">
                  <Info size={10} /> Max 5 images. Recommended portrait ratio (3:4).
                </p>
              </div>
            </div>

            {/* Right Column: Detailed Info & Variants */}
            <div className="space-y-6">
              <div>
                <label className="text-xs tracking-widest uppercase text-taupe block mb-2 font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell the story of this piece..."
                  className="w-full bg-gray-50 border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-charcoal resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-widest uppercase text-taupe block mb-2 font-medium">Fabric</label>
                  <input
                    name="fabric"
                    value={formData.fabric}
                    onChange={handleChange}
                    placeholder="e.g. Pure Mulberry Silk"
                    className="w-full bg-gray-50 border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-charcoal"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-taupe block mb-2 font-medium">Stock Level</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-border px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-charcoal"
                  />
                </div>
              </div>

              {/* Variants: Sizes & Colors */}
              <div>
                <label className="text-xs tracking-widest uppercase text-taupe block mb-2 font-medium">Available Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_SIZES.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => toggleSize(s)}
                      className={`px-3 py-1.5 text-[10px] border transition-all ${
                        sizes.includes(s) ? 'bg-charcoal text-ivory border-charcoal' : 'bg-white text-taupe border-border hover:border-charcoal'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs tracking-widest uppercase text-taupe block mb-2 font-medium">Colors / Variants</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {colors.map((c) => (
                    <span key={c} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 border border-border text-[10px] text-charcoal uppercase tracking-widest font-medium">
                      {c}
                      <button type="button" onClick={() => removeColor(c)} className="text-taupe hover:text-red-600"><X size={10} /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Add color (e.g. Wine Red)"
                    className="flex-1 bg-gray-50 border border-border px-4 py-2 text-xs focus:outline-none"
                  />
                  <button type="button" onClick={addColor} className="px-4 py-2 bg-charcoal text-ivory text-[10px] uppercase font-bold tracking-widest hover:bg-gold hover:text-charcoal transition-colors">
                    Add
                  </button>
                </div>
              </div>

              {/* Flags */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 border border-border">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="accent-gold" />
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-charcoal">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleChange} className="accent-gold" />
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-charcoal">New</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isOnSale" checked={formData.isOnSale} onChange={handleChange} className="accent-gold" />
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-charcoal">Sale</span>
                </label>
              </div>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border bg-gray-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs tracking-widest uppercase text-taupe hover:text-charcoal font-semibold underline underline-offset-4"
          >
            Cancel Changes
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`btn-primary px-10 py-4 text-xs tracking-[0.2em] shadow-lg flex items-center gap-2 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {submitting ? 'Processing...' : isEditing ? 'Update Collection' : 'Add to Collection'}
          </button>
        </div>
      </div>
    </div>
  );
}
