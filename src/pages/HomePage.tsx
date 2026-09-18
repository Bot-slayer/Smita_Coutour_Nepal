import HeroBanner from '@/components/home/HeroBanner';
import NewCollectionSection from '@/components/home/NewCollectionSection';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import BrandStatement from '@/components/home/BrandStatement';
import NewsletterSignup from '@/components/home/NewsletterSignup';

export default function HomePage() {
  return (
    <div className="bg-ivory">
      {/* 7. Luxury Fashion Hero Section */}
      <HeroBanner />

      {/* 8. Section 1 — New Collection */}
      <NewCollectionSection />

      {/* 8. Section 2 — Featured Categories (Sarees, Dresses, Bridal, Designer Wear) */}
      <FeaturedCategories />

      {/* 8. Section 3 — Featured Products Responsive Grid */}
      <FeaturedProductsSection />

      {/* Brand Heritage & Ateliers */}
      <BrandStatement />

      {/* Newsletter */}
      <NewsletterSignup />
    </div>
  );
}
