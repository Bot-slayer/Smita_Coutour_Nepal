import { useState } from 'react';
import { ChevronDown, ChevronUp, SlidersHorizontal, RotateCcw } from 'lucide-react';
import type { ProductCategory } from '@/types';

interface FiltersProps {
  selectedCategories: ProductCategory[];
  selectedSizes: string[];
  selectedColors: string[];
  priceRange: [number, number];
  sortBy: string;
  onSaleOnly: boolean;
  inStockOnly: boolean;
  onCategoryChange: (cats: ProductCategory[]) => void;
  onSizeChange: (sizes: string[]) => void;
  onColorChange: (colors: string[]) => void;
  onPriceChange: (range: [number, number]) => void;
  onSortChange: (sort: string) => void;
  onSaleChange: (val: boolean) => void;
  onInStockChange: (val: boolean) => void;
  onReset: () => void;
}

const CATEGORIES: { label: string; value: ProductCategory }[] = [
  { label: 'Sarees', value: 'sarees' },
  { label: 'Dresses', value: 'dresses' },
  { label: 'Bridal', value: 'bridal' },
  { label: 'Designer Wear', value: 'designer-wear' },
  { label: 'Suits', value: 'suits' },
  { label: 'Kurtis', value: 'kurtis' },
  { label: 'Gowns', value: 'gowns' },
  { label: 'Lehengas', value: 'lehengas' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
const COMMON_COLORS = ['Crimson Red', 'Ivory White', 'Heritage Gold', 'Obsidian Black', 'Emerald Green', 'Royal Sapphire', 'Powder Blue', 'Dusty Lilac'];
export const MAX_PRICE = 100000;

export default function ProductFilters({
  selectedCategories,
  selectedSizes,
  selectedColors,
  priceRange,
  sortBy,
  onSaleOnly,
  inStockOnly,
  onCategoryChange,
  onSizeChange,
  onColorChange,
  onPriceChange,
  onSortChange,
  onSaleChange,
  onInStockChange,
  onReset,
}: FiltersProps) {
  const [catOpen, setCatOpen] = useState(true);
  const [sizeOpen, setSizeOpen] = useState(true);
  const [colorOpen, setColorOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [availabilityOpen, setAvailabilityOpen] = useState(true);

  const toggleCat = (cat: ProductCategory) => {
    if (selectedCategories.includes(cat)) {
      onCategoryChange(selectedCategories.filter((c) => c !== cat));
    } else {
      onCategoryChange([...selectedCategories, cat]);
    }
  };

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      onSizeChange(selectedSizes.filter((s) => s !== size));
    } else {
      onSizeChange([...selectedSizes, size]);
    }
  };

  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      onColorChange(selectedColors.filter((c) => c !== color));
    } else {
      onColorChange([...selectedColors, color]);
    }
  };

  return (
    <div className="w-full text-charcoal">
      {/* Sort Section */}
      <div className="mb-7 pb-6 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={13} className="text-gold" />
            <span className="text-xs tracking-widest-xl uppercase text-taupe font-sans font-medium">
              Sort By
            </span>
          </div>
        </div>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full border border-border bg-white px-3.5 py-2.5 text-xs tracking-wider uppercase font-sans text-charcoal focus:outline-none focus:border-charcoal cursor-pointer"
        >
          <option value="featured">Featured Pieces</option>
          <option value="newest">Newest Arrivals</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Availability & Sale */}
      <div className="mb-7 pb-6 border-b border-border">
        <button
          onClick={() => setAvailabilityOpen((v) => !v)}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="text-xs tracking-widest-xl uppercase text-taupe font-sans font-medium">
            Availability & Offers
          </span>
          {availabilityOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {availabilityOpen && (
          <div className="flex flex-col gap-3 pt-1">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={onSaleOnly}
                onChange={(e) => onSaleChange(e.target.checked)}
                className="w-4 h-4 accent-gold"
              />
              <span className="text-xs tracking-wider text-charcoal group-hover:text-gold transition-colors">
                On Sale Only
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => onInStockChange(e.target.checked)}
                className="w-4 h-4 accent-gold"
              />
              <span className="text-xs tracking-wider text-charcoal group-hover:text-gold transition-colors">
                In Stock Only
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="mb-7 pb-6 border-b border-border">
        <button
          onClick={() => setCatOpen((v) => !v)}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="text-xs tracking-widest-xl uppercase text-taupe font-sans font-medium">
            Category
          </span>
          {catOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {catOpen && (
          <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1">
            {CATEGORIES.map(({ label, value }) => (
              <label key={value} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(value)}
                  onChange={() => toggleCat(value)}
                  className="w-4 h-4 accent-gold"
                />
                <span className="text-xs tracking-wide text-charcoal group-hover:text-gold transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price range */}
      <div className="mb-7 pb-6 border-b border-border">
        <button
          onClick={() => setPriceOpen((v) => !v)}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="text-xs tracking-widest-xl uppercase text-taupe font-sans font-medium">
            Price Range
          </span>
          {priceOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {priceOpen && (
          <div className="pt-2">
            <input
              type="range"
              min={0}
              max={MAX_PRICE}
              step={2000}
              value={priceRange[1]}
              onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
              className="w-full accent-gold cursor-pointer"
            />
            <div className="flex justify-between text-xs font-mono text-taupe mt-2">
              <span>NPR 0</span>
              <span className="font-medium text-charcoal">NPR {priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Sizes */}
      <div className="mb-7 pb-6 border-b border-border">
        <button
          onClick={() => setSizeOpen((v) => !v)}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="text-xs tracking-widest-xl uppercase text-taupe font-sans font-medium">
            Size
          </span>
          {sizeOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {sizeOpen && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-3 py-1.5 text-xs border font-sans uppercase tracking-wider transition-all ${
                  selectedSizes.includes(size)
                    ? 'border-charcoal bg-charcoal text-ivory font-medium'
                    : 'border-border text-charcoal hover:border-charcoal bg-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="mb-7 pb-6 border-b border-border">
        <button
          onClick={() => setColorOpen((v) => !v)}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="text-xs tracking-widest-xl uppercase text-taupe font-sans font-medium">
            Colour Palette
          </span>
          {colorOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {colorOpen && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {COMMON_COLORS.map((clr) => (
              <button
                key={clr}
                onClick={() => toggleColor(clr)}
                className={`px-2.5 py-1 text-[11px] border font-sans tracking-wide transition-all ${
                  selectedColors.includes(clr)
                    ? 'border-charcoal bg-light-taupe text-charcoal font-medium'
                    : 'border-border/80 text-taupe hover:border-charcoal bg-white'
                }`}
              >
                {clr}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-border text-xs tracking-widest uppercase text-taupe hover:text-charcoal hover:border-charcoal transition-colors font-sans"
      >
        <RotateCcw size={13} /> Reset All Filters
      </button>
    </div>
  );
}
