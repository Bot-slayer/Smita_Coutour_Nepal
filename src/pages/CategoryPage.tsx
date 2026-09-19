
import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductGrid from '@/components/product/ProductGrid';
import Pagination from '@/components/ui/Pagination';
import { productService } from '@/services/productService';
import { useWebsiteSettings } from '@/context/WebsiteSettingsContext';
import type { Product, ProductCategory } from '@/types';

const PAGE_SIZE = 18;

const CATEGORY_META: Record<string, { title: string; desc: string }> = {
  sarees: {
    title: 'Sarees',
    desc: 'From luminous handwoven Banarasi silks to delicate Chanderi weaves — our saree curation is an ode to timeless South Asian elegance.',
  },
  dresses: {
    title: 'Dresses',
    desc: 'Contemporary gowns and maxi dresses sculpted in silk velvet, pleated georgette, and organza for galas and evening celebrations.',
  },
  bridal: {
    title: 'Bridal Couture',
    desc: 'Exquisite bridal lehengas, reception gowns, and bespoke wedding ensembles embellished with intricate zardozi, dabka, and crystal craftsmanship.',
  },
  'designer-wear': {
    title: 'Designer Wear',
    desc: 'Dramatic cape ensembles, 32-kali raw silk anarkalis, and artisanal sharara sets combining historical silhouettes with modern flair.',
  },
  suits: {
    title: 'Suits',
    desc: 'Tailored three-piece suit sets in pure handloom silks and georgette, designed for effortless poise at festive gatherings.',
  },
  kurtis: {
    title: 'Kurtis',
    desc: 'Refined everyday luxury crafted in handspun organic linen and authentic block prints for seamless versatility.',
  },
  gowns: {
    title: 'Gowns',
    desc: 'Architectural floor-sweeping silhouettes and column gowns crafted for galas, red carpets, and black-tie affairs.',
  },
  lehengas: {
    title: 'Lehengas',
    desc: 'Voluminous festive and wedding-guest lehengas in organza and silk, detailed with fine floral resham and badla embroidery.',
  },
};

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const { categoryImages, content } = useWebsiteSettings();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryPage = Number(searchParams.get('page')) || 1;

  const activeCat = (category || 'sarees').toLowerCase() as ProductCategory;
  const configuredImage = categoryImages[activeCat];

  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const meta = CATEGORY_META[activeCat] || {
    title: activeCat.replace('-', ' '),
    desc: 'Exclusive handcrafted fashion created by master artisans in Kathmandu.',
  };

  useEffect(() => {
    const loadCategoryProducts = async () => {
      try {
        setLoading(true);

        const { products: data, total } = await productService.getPaginated({
          page: queryPage,
          pageSize: PAGE_SIZE,
          category: activeCat,
        });

        setProducts(data);
        setTotalCount(total);
      } catch (error) {
        console.error('Failed to load category products:', error);
        setProducts([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryProducts();
  }, [activeCat, queryPage]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="bg-ivory min-h-screen">
      {/* Category Hero Banner */}
      <div className="relative bg-charcoal text-ivory py-16 sm:py-24 overflow-hidden">
        {/* Dynamic Background Image */}
        {configuredImage && (
          <div className="absolute inset-0 z-0">
            <img
              src={configuredImage}
              alt={meta.title}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-charcoal/40" />
          </div>
        )}

        <div className="absolute inset-4 sm:inset-10 border border-gold/15 pointer-events-none z-10" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-sans font-medium mb-3">
            {content.collectionsTitle || 'Couture Department'}
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ivory font-normal tracking-wide uppercase mb-4 leading-tight">
            {meta.title}
          </h1>

          <p className="text-xs sm:text-sm text-ivory/70 max-w-xl mx-auto leading-relaxed mb-6 font-sans">
            {content.collectionsDescription || meta.desc}
          </p>

          <div className="inline-flex items-center gap-2 text-[11px] font-sans tracking-widest uppercase text-gold/80 border-b border-gold/30 pb-0.5">
            {loading
              ? 'Loading Curated Pieces...'
              : `${products.length} Curated Pieces Available`}
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="border-b border-border/70 bg-white">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 py-3.5">
          <nav className="flex items-center gap-2 text-xs text-taupe tracking-wider uppercase font-sans">
            <Link
              to="/"
              className="hover:text-charcoal transition-colors"
            >
              Home
            </Link>

            <ChevronRight size={11} />

            <Link
              to="/shop"
              className="hover:text-charcoal transition-colors"
            >
              Shop
            </Link>

            <ChevronRight size={11} />

            <span className="text-charcoal font-medium capitalize">
              {meta.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-20">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-10 sm:gap-y-12">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse"
              >
                <div className="aspect-[3/4] bg-light-taupe/60 rounded-sm" />

                <div className="h-4 bg-light-taupe/60 rounded mt-4 w-3/4" />

                <div className="h-4 bg-light-taupe/60 rounded mt-2 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <ProductGrid
            products={products}
            columns={4}
            emptyMessage={`Our artisans are currently preparing new pieces for the ${meta.title} collection. Please explore our other categories or check back soon.`}
          />
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={queryPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
