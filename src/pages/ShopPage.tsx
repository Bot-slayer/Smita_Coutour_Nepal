
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  Search as SearchIcon,
  RotateCcw,
} from 'lucide-react';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters, { MAX_PRICE } from '@/components/product/ProductFilters';
import Pagination from '@/components/ui/Pagination';
import { productService } from '@/services/productService';
import { useWebsiteSettings } from '@/context/WebsiteSettingsContext';
import type { Product, ProductCategory } from '@/types';

const PAGE_SIZE = 18;

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { content } = useWebsiteSettings();

  const querySearch = searchParams.get('q') || '';
  const queryCategory = searchParams.get('category') || '';
  const queryFilter = searchParams.get('filter') || '';
  const queryPage = Number(searchParams.get('page')) || 1;

  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  // Filter states
  const [searchTerm, setSearchTerm] = useState(querySearch);
  const [isNewOnly, setIsNewOnly] = useState(queryFilter === 'new');
  const [isFeaturedOnly, setIsFeaturedOnly] = useState(
    queryFilter === 'featured' || queryFilter === 'best'
  );

  const [selectedCategories, setSelectedCategories] = useState<
    ProductCategory[]
  >(queryCategory ? [queryCategory as ProductCategory] : []);

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    MAX_PRICE,
  ]);

  const [sortBy, setSortBy] = useState<
    'featured' | 'newest' | 'price-asc' | 'price-desc'
  >('featured');

  const [onSaleOnly, setOnSaleOnly] = useState(queryFilter === 'sale');
  const [inStockOnly, setInStockOnly] = useState(false);

  // ------------------------------------------------------------
  // Fetch products with pagination and filters
  // ------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        const { products: data, total } = await productService.getPaginated({
          page: queryPage,
          pageSize: PAGE_SIZE,
          category: selectedCategories[0], // Using first category for server-side filter
          isNew: isNewOnly,
          isFeatured: isFeaturedOnly,
          isSale: onSaleOnly,
        });

        if (isMounted) {
          setProducts(data);
          setTotalCount(total);
        }
      } catch (error) {
        console.error('Failed to load shop products:', error);
        if (isMounted) {
          setProducts([]);
          setTotalCount(0);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [queryPage, selectedCategories, isNewOnly, isFeaturedOnly, onSaleOnly]);

  // ------------------------------------------------------------
  // Sync URL search params with filters
  // ------------------------------------------------------------
  useEffect(() => {
    if (querySearch !== searchTerm) {
      setSearchTerm(querySearch);
    }

    if (queryCategory && selectedCategories[0] !== queryCategory) {
      setSelectedCategories([queryCategory as ProductCategory]);
    }

    setIsNewOnly(queryFilter === 'new');
    setIsFeaturedOnly(queryFilter === 'featured' || queryFilter === 'best');
    setOnSaleOnly(queryFilter === 'sale');

    if (queryFilter === 'new') {
      setSortBy('newest');
    }
  }, [querySearch, queryCategory, queryFilter]);

  // ------------------------------------------------------------
  // Update URL on page change
  // ------------------------------------------------------------
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ------------------------------------------------------------
  // Update URL on filter change
  // ------------------------------------------------------------
  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // Reset to page 1 on filter change
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  };

  // ------------------------------------------------------------
  // Reset filters
  // ------------------------------------------------------------
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, MAX_PRICE]);
    setSortBy('featured');
    setOnSaleOnly(false);
    setInStockOnly(false);
    setIsNewOnly(false);
    setIsFeaturedOnly(false);
    setSearchParams({ page: '1' });
  };

  // ------------------------------------------------------------
  // Client-side filtering (for extra precision or local filters)
  // ------------------------------------------------------------
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search by name, etc.
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter((p) => {
        const name = p.name?.toLowerCase() ?? '';
        const desc = p.description?.toLowerCase() ?? '';
        return name.includes(q) || desc.includes(q);
      });
    }

    // Client-side price filter
    list = list.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case 'newest':
        list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'featured':
      default:
        list.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
        break;
    }

    return list;
  }, [products, searchTerm, priceRange, sortBy]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // ------------------------------------------------------------
  // Active filter count
  // ------------------------------------------------------------
  const activeFilterCount =
    (searchTerm ? 1 : 0) +
    selectedCategories.length +
    selectedSizes.length +
    selectedColors.length +
    (priceRange[1] < MAX_PRICE ? 1 : 0) +
    (onSaleOnly ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (isNewOnly ? 1 : 0) +
    (isFeaturedOnly ? 1 : 0);

  return (
    <div className="bg-ivory min-h-screen">
      {/* Header Banner */}
      <div className="border-b border-border/80 bg-white">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 text-center">
          <p className="section-label mb-2">
            {content.shopLabel || 'Haute Couture Catalog'}
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal font-normal tracking-wide uppercase mb-4">
            {content.shopTitle || 'The Collection'}
          </h1>

          <p className="text-xs sm:text-sm text-taupe max-w-xl mx-auto leading-relaxed">
            {content.shopDescription || 'Browse our complete repertoire of handcrafted sarees, bridal lehengas, bespoke dresses, and evening wear — tailored with the finest textiles in Kathmandu.'}
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto mt-8 relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                placeholder="Search by name, category, or fabric..."
                className="w-full bg-ivory border border-border px-4 py-3 pl-11 text-xs sm:text-sm tracking-wide text-charcoal placeholder:text-taupe/60 focus:outline-none focus:border-charcoal transition-colors"
              />

              <SearchIcon
                size={16}
                className="absolute left-4 text-taupe pointer-events-none"
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 p-1 text-taupe hover:text-charcoal"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Browse Container */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16">
        <div className="flex gap-10 lg:gap-14">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 bg-white border border-border/70 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
                <span className="font-serif text-lg text-charcoal">
                  Filter & Refine
                </span>

                {activeFilterCount > 0 && (
                  <span className="text-[10px] tracking-wider uppercase bg-gold/15 text-charcoal px-2 py-0.5 font-medium">
                    {activeFilterCount} Active
                  </span>
                )}
              </div>

              <ProductFilters
                selectedCategories={selectedCategories}
                selectedSizes={selectedSizes}
                selectedColors={selectedColors}
                priceRange={priceRange}
                sortBy={sortBy}
                onSaleOnly={onSaleOnly}
                inStockOnly={inStockOnly}
                onCategoryChange={setSelectedCategories}
                onSizeChange={setSelectedSizes}
                onColorChange={setSelectedColors}
                onPriceChange={setPriceRange}
                onSortChange={(val) =>
                  setSortBy(
                    val as typeof sortBy
                  )
                }
                onSaleChange={setOnSaleOnly}
                onInStockChange={setInStockOnly}
                onReset={handleResetFilters}
              />
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-8 border-b border-border gap-4">
              <div>
                <p className="text-xs tracking-widest uppercase font-sans text-taupe">
                  Showing{' '}
                  <span className="font-semibold text-charcoal">
                    {filteredProducts.length}
                  </span>{' '}
                  pieces

                  {searchTerm && (
                    <span>
                      {' '}
                      for{' '}
                      <em className="not-italic text-charcoal">
                        "{searchTerm}"
                      </em>
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                {/* Mobile Filter Trigger */}
                <button
                  onClick={() =>
                    setMobileFiltersOpen(true)
                  }
                  className="lg:hidden inline-flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-2.5 border border-charcoal bg-white text-charcoal hover:bg-charcoal hover:text-ivory transition-colors"
                >
                  <SlidersHorizontal size={13} />

                  <span>Filters</span>

                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-gold text-charcoal text-[9px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* View toggle */}
                <div className="hidden sm:flex items-center border border-border bg-white">
                  <button
                    onClick={() => setLayout('grid')}
                    className={`p-2 transition-colors ${
                      layout === 'grid'
                        ? 'bg-charcoal text-ivory'
                        : 'text-taupe hover:text-charcoal'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid size={15} />
                  </button>

                  <button
                    onClick={() => setLayout('list')}
                    className={`p-2 transition-colors ${
                      layout === 'list'
                        ? 'bg-charcoal text-ivory'
                        : 'text-taupe hover:text-charcoal'
                    }`}
                    title="List View"
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Pill Bar */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-8 p-3 bg-white border border-border/70 text-xs">
                <span className="text-[11px] tracking-wider uppercase text-taupe mr-1">
                  Active:
                </span>

                {selectedCategories.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-light-taupe text-charcoal text-[11px] tracking-wider capitalize"
                  >
                    {c}

                    <X
                      size={12}
                      className="cursor-pointer hover:text-red-500"
                      onClick={() =>
                        setSelectedCategories(
                          selectedCategories.filter(
                            (x) => x !== c
                          )
                        )
                      }
                    />
                  </span>
                ))}

                {onSaleOnly && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gold/20 text-charcoal text-[11px] tracking-wider font-medium">
                    On Sale

                    <X
                      size={12}
                      className="cursor-pointer hover:text-red-500"
                      onClick={() =>
                        setOnSaleOnly(false)
                      }
                    />
                  </span>
                )}

                {inStockOnly && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-light-taupe text-charcoal text-[11px] tracking-wider">
                    In Stock

                    <X
                      size={12}
                      className="cursor-pointer hover:text-red-500"
                      onClick={() =>
                        setInStockOnly(false)
                      }
                    />
                  </span>
                )}

                {isNewOnly && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gold/20 text-charcoal text-[11px] tracking-wider font-medium">
                    New Arrivals
                    <X
                      size={12}
                      className="cursor-pointer hover:text-red-500"
                      onClick={() => setIsNewOnly(false)}
                    />
                  </span>
                )}

                {isFeaturedOnly && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gold/20 text-charcoal text-[11px] tracking-wider font-medium">
                    Featured
                    <X
                      size={12}
                      className="cursor-pointer hover:text-red-500"
                      onClick={() => setIsFeaturedOnly(false)}
                    />
                  </span>
                )}

                {selectedSizes.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-light-taupe text-charcoal text-[11px] tracking-wider"
                  >
                    Size {s}

                    <X
                      size={12}
                      className="cursor-pointer hover:text-red-500"
                      onClick={() =>
                        setSelectedSizes(
                          selectedSizes.filter(
                            (x) => x !== s
                          )
                        )
                      }
                    />
                  </span>
                ))}

                <button
                  onClick={handleResetFilters}
                  className="ml-auto text-[11px] tracking-wider uppercase underline text-taupe hover:text-charcoal flex items-center gap-1"
                >
                  <RotateCcw size={11} />
                  Clear All
                </button>
              </div>
            )}

            {/* Products Grid / List */}
            <ProductGrid
              products={filteredProducts}
              columns={layout === 'grid' ? 3 : 2}
              layout={layout}
              isLoading={isLoading}
              emptyMessage="No pieces match your selected filters. Try broadening your criteria or reset filters."
            />

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <Pagination
                currentPage={queryPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* Responsive Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-xs z-50 lg:hidden"
            onClick={() =>
              setMobileFiltersOpen(false)
            }
          />

          <div className="fixed top-0 right-0 h-full w-full max-w-xs bg-ivory z-50 p-6 overflow-y-auto shadow-2xl flex flex-col justify-between animate-slide-in-right lg:hidden">
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
                <span className="font-serif text-lg text-charcoal">
                  Filters
                </span>

                <button
                  onClick={() =>
                    setMobileFiltersOpen(false)
                  }
                  className="p-1.5 text-charcoal hover:text-gold transition-colors"
                  aria-label="Close filters"
                >
                  <X size={18} />
                </button>
              </div>

              <ProductFilters
                selectedCategories={selectedCategories}
                selectedSizes={selectedSizes}
                selectedColors={selectedColors}
                priceRange={priceRange}
                sortBy={sortBy}
                onSaleOnly={onSaleOnly}
                inStockOnly={inStockOnly}
                onCategoryChange={setSelectedCategories}
                onSizeChange={setSelectedSizes}
                onColorChange={setSelectedColors}
                onPriceChange={setPriceRange}
                onSortChange={(val) =>
                  setSortBy(
                    val as typeof sortBy
                  )
                }
                onSaleChange={setOnSaleOnly}
                onInStockChange={setInStockOnly}
                onReset={handleResetFilters}
              />
            </div>

            <div className="pt-6 border-t border-border mt-6">
              <button
                onClick={() =>
                  setMobileFiltersOpen(false)
                }
                className="btn-primary w-full py-3 text-xs tracking-widest uppercase"
              >
                Apply Filters ({filteredProducts.length})
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
