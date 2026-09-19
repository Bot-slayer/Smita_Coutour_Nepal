import HeroBanner from '@/components/home/HeroBanner';
import NewCollectionSection from '@/components/home/NewCollectionSection';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import NewArrivals from '@/components/home/NewArrivals';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import BrandStatement from '@/components/home/BrandStatement';
import NewsletterSignup from '@/components/home/NewsletterSignup';
import { useWebsiteSettings } from '@/context/WebsiteSettingsContext';

export default function HomePage() {
  const { images } = useWebsiteSettings();

  return (
    <div className="bg-ivory">
      {/* 7. Luxury Fashion Hero Section */}
      <HeroBanner imageSrc={images.homepage_hero} />

      {/* 8. Section 1 — New Collection */}
      <NewCollectionSection imageSrc={images.homepage_about} />

      {/* 8. Section 2 — Featured Categories (Sarees, Dresses, Bridal, Designer Wear) */}
      <FeaturedCategories />

      {/* New Arrivals Section */}
      <NewArrivals bannerImage={images.homepage_new_arrivals} />

      {/* 8. Section 3 — Featured Products Responsive Grid */}
      <FeaturedProductsSection bannerImage={images.homepage_featured} />

      {/* Brand Heritage & Ateliers */}
      <BrandStatement imageSrc={images.homepage_atelier} />

      {/* Newsletter */}
      <NewsletterSignup backgroundImage={images.homepage_newsletter} />
    </div>
  );
}
