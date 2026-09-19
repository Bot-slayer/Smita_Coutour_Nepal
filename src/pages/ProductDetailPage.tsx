
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Zap,
  ChevronRight,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
} from 'lucide-react';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductSizeSelector from '@/components/product/ProductSizeSelector';
import ProductGrid from '@/components/product/ProductGrid';
import { productService } from '@/services/productService';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useWebsiteSettings } from '@/context/WebsiteSettingsContext';
import { formatCurrency } from '@/utils/format';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { content } = useWebsiteSettings();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const [activeTab, setActiveTab] = useState<
    'material' | 'care' | 'size' | 'delivery' | 'returns'
  >('material');

  const [sizeModalOpen, setSizeModalOpen] = useState(false);

  const addToCart = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);

  const isWishlisted = useWishlistStore((s) =>
    product ? s.isWishlisted(product.id) : false
  );

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const data = await productService.getById(id);

        if (data) {
          setProduct(data);

          const all = await productService.getAll();

          const related = all
            .filter(
              (p) => p.category === data.category && p.id !== data.id
            )
            .slice(0, 4);

          setRelatedProducts(related);
        } else {
          setProduct(null);
          setRelatedProducts([]);
        }
      } catch (error) {
        console.error('Failed to load product:', error);
        setProduct(null);
        setRelatedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  /*
   * Important:
   * product starts as null while the page is loading.
   * This guard tells TypeScript that below this point
   * product is guaranteed to exist.
   */
  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="font-serif text-2xl text-charcoal mb-3">
          Product Not Found
        </h1>

        <p className="text-sm text-taupe mb-6">
          The product you are looking for is unavailable or may have been
          removed.
        </p>

        <Link
          to="/shop"
          className="btn-primary px-6 py-3 text-xs tracking-[0.2em]"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const currentSize =
    selectedSize || product.sizes[0] || 'Free Size';

  const currentColor =
    selectedColor || product.colors[0] || '';

  const handleAddToCart = () => {
    addToCart(product, currentSize, currentColor, quantity);
    openDrawer();

    toast.success(`${product.name} added to your bag`);
  };

  const handleBuyNow = () => {
    addToCart(product, currentSize, currentColor, quantity);
    navigate('/checkout');
  };

  const handleWishlist = () => {
    toggleWishlist(product);

    toast.success(
      isWishlisted
        ? 'Removed from wishlist'
        : 'Added to wishlist'
    );
  };

  return (
    <div className="bg-ivory min-h-screen">
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

            <Link
              to={`/category/${product.category}`}
              className="hover:text-charcoal transition-colors capitalize"
            >
              {product.categoryLabel || product.category}
            </Link>

            <ChevronRight size={11} />

            <span className="text-charcoal font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Section */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Product Image Gallery */}
          <div className="lg:col-span-7">
            <ProductImageGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Right Column: Product Details */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            {/* Header info */}
            <div className="mb-6">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-sans font-semibold">
                  {product.categoryLabel || product.category}
                </span>

                {/* Stock Status Badge */}
                {product.stock > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-0.5 border border-emerald-200 font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    {content.inStockLabel || 'In Stock'} ({product.stock} available)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 px-2.5 py-0.5 border border-amber-200 font-sans">
                    {content.outOfStockLabel || 'Made to Order (10-14 days)'}
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal tracking-wide uppercase leading-tight mb-4">
                {product.name}
              </h1>

              {/* Price & Discounts */}
              <div className="flex items-baseline gap-4 mb-4">
                <span className="font-sans text-2xl sm:text-3xl font-medium text-charcoal">
                  {formatCurrency(product.price)}
                </span>

                {product.originalPrice && (
                  <span className="text-base sm:text-lg text-taupe line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}

                {product.isOnSale && product.discount && (
                  <span className="bg-gold text-charcoal text-xs font-sans font-bold tracking-widest uppercase px-2.5 py-1">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              <p className="text-xs text-taupe tracking-wider font-sans">
                Tax included. Free insured delivery across Nepal on this
                order.
              </p>
            </div>

            <div className="w-full h-px bg-border/80 mb-6" />

            {/* Description */}
            <div className="mb-8">
              <h4 className="text-xs tracking-widest uppercase text-charcoal font-sans font-medium mb-2">
                The Piece
              </h4>

              <p className="text-sm text-taupe leading-relaxed font-sans">
                {product.description}
              </p>
            </div>

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs tracking-widest uppercase text-charcoal font-sans font-medium">
                    Colour:{' '}
                    <span className="text-taupe font-normal">
                      {currentColor}
                    </span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.colors.map((clr) => (
                    <button
                      key={clr}
                      onClick={() => setSelectedColor(clr)}
                      className={`px-4 py-2 text-xs border font-sans tracking-wide transition-all ${
                        currentColor === clr
                          ? 'border-charcoal bg-charcoal text-ivory'
                          : 'border-border bg-white text-charcoal hover:border-charcoal'
                      }`}
                    >
                      {clr}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div className="mb-6">
                <ProductSizeSelector
                  sizes={product.sizes}
                  selectedSize={currentSize}
                  onSelect={setSelectedSize}
                />
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-8">
              <span className="block text-xs tracking-widest uppercase text-charcoal font-sans font-medium mb-2.5">
                Quantity
              </span>

              <div className="flex items-center border border-border bg-white w-fit">
                <button
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1))
                  }
                  className="px-4 py-2.5 text-charcoal hover:text-gold transition-colors text-base"
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span className="w-12 text-center text-sm font-medium font-mono">
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity((q) => q + 1)
                  }
                  className="px-4 py-2.5 text-charcoal hover:text-gold transition-colors text-base"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="btn-primary flex-1 py-4 text-xs tracking-[0.2em]"
                >
                  <ShoppingBag size={16} /> {content.addToCartLabel || 'Add to Bag'}
                </button>

                <button
                  onClick={handleWishlist}
                  className={`px-5 border transition-all flex items-center justify-center ${
                    isWishlisted
                      ? 'border-gold text-gold bg-gold/10'
                      : 'border-charcoal text-charcoal hover:border-gold hover:text-gold bg-white'
                  }`}
                  aria-label={
                    isWishlisted
                      ? 'Remove from wishlist'
                      : 'Add to wishlist'
                  }
                  title="Save to Wishlist"
                >
                  <Heart
                    size={18}
                    fill={
                      isWishlisted
                        ? 'currentColor'
                        : 'none'
                    }
                  />
                </button>
              </div>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                className="w-full py-4 text-xs font-sans font-semibold tracking-[0.2em] uppercase border border-gold bg-gold text-charcoal hover:bg-charcoal hover:text-ivory hover:border-charcoal transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
              >
                <Zap size={15} /> {content.buyNowLabel || 'Buy Now'}
              </button>
            </div>

            {/* Trust Assurance Bar */}
            <div className="grid grid-cols-3 gap-4 py-5 border-y border-border/80 text-center bg-white/50">
              <div className="flex flex-col items-center gap-1">
                <Truck size={16} className="text-gold" />

                <span className="text-[11px] font-medium text-charcoal uppercase tracking-wider">
                  Courier Shipping
                </span>

                <span className="text-[10px] text-taupe">
                  Free within Nepal
                </span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <RotateCcw size={16} className="text-gold" />

                <span className="text-[11px] font-medium text-charcoal uppercase tracking-wider">
                  7-Day Trial
                </span>

                <span className="text-[10px] text-taupe">
                  Simple exchanges
                </span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <ShieldCheck size={16} className="text-gold" />

                <span className="text-[11px] font-medium text-charcoal uppercase tracking-wider">
                  Certified Pure
                </span>

                <span className="text-[10px] text-taupe">
                  100% genuine silks
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Product Information */}
        <div className="mt-20 pt-12 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-serif text-2xl text-charcoal text-center mb-8 uppercase tracking-wide">
              Product Information
            </h3>

            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center border-b border-border mb-8 gap-2 sm:gap-8">
              {[
                {
                  key: 'material',
                  label: 'Material & Fabric',
                },
                {
                  key: 'care',
                  label: 'Care Instructions',
                },
                {
                  key: 'size',
                  label: 'Size & Fit Guide',
                },
                {
                  key: 'delivery',
                  label: 'Delivery Information',
                },
                {
                  key: 'returns',
                  label: 'Return & Exchange',
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() =>
                    setActiveTab(
                      tab.key as typeof activeTab
                    )
                  }
                  className={`pb-3 text-xs tracking-widest uppercase font-sans font-medium transition-colors relative ${
                    activeTab === tab.key
                      ? 'text-charcoal border-b-2 border-charcoal'
                      : 'text-taupe hover:text-charcoal'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Panes */}
            <div className="bg-white border border-border/80 p-8 shadow-xs">
              {/* Material */}
              {activeTab === 'material' && (
                <div className="flex flex-col gap-4 text-sm text-taupe leading-relaxed">
                  <h4 className="font-serif text-lg text-charcoal mb-1">
                    Fabric Details
                  </h4>

                  <p>
                    <strong className="text-charcoal font-medium">
                      Composition:
                    </strong>{' '}
                    {product.fabric}
                  </p>

                  <p>
                    Each Smita Couture textile is personally evaluated
                    by master fabric technologists in Kathmandu. All
                    silks, brocades, and embellishments are sourced
                    directly from traditional artisan clusters and
                    authenticated for purity, tensile strength, and
                    color fastness.
                  </p>
                </div>
              )}

              {/* Care */}
              {activeTab === 'care' && (
                <div className="flex flex-col gap-4 text-sm text-taupe leading-relaxed">
                  <h4 className="font-serif text-lg text-charcoal mb-1">
                    Garment Maintenance
                  </h4>

                  <p>
                    <strong className="text-charcoal font-medium">
                      Care Recommendation:
                    </strong>{' '}
                    {product.care}
                  </p>

                  <ul className="list-disc pl-5 flex flex-col gap-2 mt-2">
                    <li>
                      Never machine wash or tumble dry fine zari
                      embroidery.
                    </li>

                    <li>
                      Always store wrapped in cotton muslin or
                      acid-free tissue paper.
                    </li>

                    <li>
                      Avoid direct contact with perfumes,
                      deodorants, or hairsprays.
                    </li>

                    <li>
                      Refold along alternate fold lines every few
                      months to preserve structural integrity.
                    </li>
                  </ul>
                </div>
              )}

              {/* Size */}
              {activeTab === 'size' && (
                <div className="flex flex-col gap-4 text-sm text-taupe leading-relaxed">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-serif text-lg text-charcoal">
                      Size & Measurement Chart
                    </h4>

                    <span className="text-xs text-gold flex items-center gap-1">
                      <Ruler size={13} />
                      Measurements in Inches
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-light-taupe/60 text-charcoal uppercase tracking-wider">
                          <th className="p-3">Size</th>
                          <th className="p-3">Bust (in)</th>
                          <th className="p-3">Waist (in)</th>
                          <th className="p-3">Hip (in)</th>
                          <th className="p-3">Length (in)</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="p-3 font-medium text-charcoal">
                            XS
                          </td>
                          <td className="p-3">32</td>
                          <td className="p-3">26</td>
                          <td className="p-3">35</td>
                          <td className="p-3">54</td>
                        </tr>

                        <tr>
                          <td className="p-3 font-medium text-charcoal">
                            S
                          </td>
                          <td className="p-3">34</td>
                          <td className="p-3">28</td>
                          <td className="p-3">37</td>
                          <td className="p-3">55</td>
                        </tr>

                        <tr>
                          <td className="p-3 font-medium text-charcoal">
                            M
                          </td>
                          <td className="p-3">36</td>
                          <td className="p-3">30</td>
                          <td className="p-3">39</td>
                          <td className="p-3">55</td>
                        </tr>

                        <tr>
                          <td className="p-3 font-medium text-charcoal">
                            L
                          </td>
                          <td className="p-3">38</td>
                          <td className="p-3">32</td>
                          <td className="p-3">41</td>
                          <td className="p-3">56</td>
                        </tr>

                        <tr>
                          <td className="p-3 font-medium text-charcoal">
                            XL
                          </td>
                          <td className="p-3">40</td>
                          <td className="p-3">34</td>
                          <td className="p-3">43</td>
                          <td className="p-3">56</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="text-xs text-taupe mt-2">
                    Custom sizing is also available upon request for
                    our bridal and couture commissions.
                  </p>
                </div>
              )}

              {/* Delivery */}
              {activeTab === 'delivery' && (
                <div className="flex flex-col gap-4 text-sm text-taupe leading-relaxed">
                  <h4 className="font-serif text-lg text-charcoal mb-1">
                    Shipping & Courier Logistics
                  </h4>

                  <p>
                    We provide expedited, insured delivery across all
                    7 Provinces of Nepal.
                  </p>

                  <ul className="list-disc pl-5 flex flex-col gap-2">
                    <li>
                      <strong className="text-charcoal font-medium">
                        Kathmandu Valley:
                      </strong>{' '}
                      24–48 hours direct hand delivery.
                    </li>

                    <li>
                      <strong className="text-charcoal font-medium">
                        Major Cities (Pokhara, Biratnagar, Butwal,
                        Chitwan):
                      </strong>{' '}
                      2–3 business days via air cargo.
                    </li>

                    <li>
                      <strong className="text-charcoal font-medium">
                        All other districts:
                      </strong>{' '}
                      3–5 business days with tracked courier service.
                    </li>

                    <li>
                      <strong className="text-charcoal font-medium">
                        Complimentary Shipping:
                      </strong>{' '}
                      On all orders above रू 5,000.
                    </li>
                  </ul>
                </div>
              )}

              {/* Returns */}
              {activeTab === 'returns' && (
                <div className="flex flex-col gap-4 text-sm text-taupe leading-relaxed">
                  <h4 className="font-serif text-lg text-charcoal mb-1">
                    Return & Exchange Policy
                  </h4>

                  <p>
                    We want you to feel sublime in every garment. If the
                    fit or drape is not as you envisioned:
                  </p>

                  <ul className="list-disc pl-5 flex flex-col gap-2">
                    <li>
                      Returns or size exchanges are accepted within 7
                      days of delivery.
                    </li>

                    <li>
                      Garment must remain unworn, unaltered, with
                      original security tags and garment bags intact.
                    </li>

                    <li>
                      Custom-measured bridal lehengas are final sale
                      but include complimentary alterations at our
                      Maharajgunj atelier.
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-border">
            <div className="text-center mb-12">
              <p className="section-label mb-2">
                Complementary Styles
              </p>

              <h3 className="section-heading">
                You May Also Admire
              </h3>
            </div>

            <ProductGrid
              products={relatedProducts}
              columns={4}
            />
          </div>
        )}
      </div>
    </div>
  );
}
