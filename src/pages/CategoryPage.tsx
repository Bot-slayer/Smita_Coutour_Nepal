import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductGrid from '@/components/product/ProductGrid';
import { getProductsByCategory } from '@/data/sampleProducts';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';

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
  const activeCat = (category || 'sarees').toLowerCase();
  const products = getProductsByCategory(activeCat);
  const meta = CATEGORY_META[activeCat] || {
    title: activeCat.replace('-', ' '),
    desc: 'Exclusive handcrafted fashion created by master artisans in Kathmandu.',
  };

  return (
    <div className="bg-ivory min-h-screen">
      {/* Category Hero Banner with Luxury Placeholder */}
      <div className="relative bg-charcoal text-ivory py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-4 sm:inset-10 border border-gold/15 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-sans font-medium mb-3">
            Couture Department
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ivory font-normal tracking-wide uppercase mb-4 leading-tight">
            {meta.title}
          </h1>
          <p className="text-xs sm:text-sm text-ivory/70 max-w-xl mx-auto leading-relaxed mb-6 font-sans">
            {meta.desc}
          </p>

          <div className="inline-flex items-center gap-2 text-[11px] font-sans tracking-widest uppercase text-gold/80 border-b border-gold/30 pb-0.5">
            {products.length} Curated Pieces Available
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="border-b border-border/70 bg-white">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 py-3.5">
          <nav className="flex items-center gap-2 text-xs text-taupe tracking-wider uppercase font-sans">
            <Link to="/" className="hover:text-charcoal transition-colors">Home</Link>
            <ChevronRight size={11} />
            <Link to="/shop" className="hover:text-charcoal transition-colors">Shop</Link>
            <ChevronRight size={11} />
            <span className="text-charcoal font-medium capitalize">{meta.title}</span>
          </nav>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-20">
        <ProductGrid
          products={products}
          columns={4}
          emptyMessage={`Our artisans are currently preparing new pieces for the ${meta.title} collection. Please explore our other categories or check back soon.`}
        />
      </div>
    </div>
  );
}
