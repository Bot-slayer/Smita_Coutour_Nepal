import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { useWebsiteSettings } from '@/context/WebsiteSettingsContext';
import MobileMenu from './MobileMenu';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'New Arrivals', to: '/shop?filter=new' },
  { label: 'Collections', to: '/shop' },
  { label: 'Sale', to: '/sale' },
  { label: 'About', to: '/about' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const totalItems = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const openCart = useCartStore((s) => s.openDrawer);
  const user = useAuthStore((s) => s.user);
  const { content } = useWebsiteSettings();

  const dynamicNavLinks = [
    { label: content.navHome || 'Home', to: '/' },
    { label: content.navShop || 'Shop', to: '/shop' },
    { label: content.navNewArrivals || 'New Arrivals', to: '/shop?filter=new' },
    { label: content.navCollections || 'Collections', to: '/shop' },
    { label: content.navSale || 'Sale', to: '/sale' },
    { label: content.navAbout || 'About', to: '/about' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-charcoal text-ivory text-center py-2 px-4 text-xs tracking-widest-xl uppercase font-sans">
        Free shipping on orders above रू 5,000 &nbsp;|&nbsp; Authentic Premium Fashion from Nepal
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-30 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-ivory'
        }`}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center h-16 lg:h-20">

            {/* Left: Desktop Nav */}
            <div className="hidden lg:flex items-center flex-1">
              <nav className="flex items-center gap-6">
                {dynamicNavLinks.map((link) => (
                  <NavLink
                    key={link.label}
                    to={link.to}
                    className={({ isActive }) =>
                      `text-[11px] tracking-widest uppercase font-sans font-medium transition-colors duration-200 whitespace-nowrap ${
                        isActive ? 'text-gold' : 'text-charcoal hover:text-gold'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Mobile: Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-charcoal hover:text-gold transition-colors"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Center: Logo */}
            <div className="flex-none text-center px-4 lg:px-8">
              <Link
                to="/"
                className="inline-block"
                aria-label="Smita Couture Nepal — Home"
              >
                <span className="font-serif text-sm sm:text-base lg:text-lg tracking-widest-lg uppercase text-charcoal whitespace-nowrap font-medium">
                  Smita Couture Nepal
                </span>
              </Link>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end">
              {/* Search */}
              <div className="relative group/tooltip">
                <button
                  onClick={() => setSearchOpen((v) => !v)}
                  className="p-2 text-charcoal hover:text-gold transition-colors"
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-charcoal text-ivory text-[9px] tracking-widest uppercase opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-1 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 font-sans">
                  Search
                </span>
              </div>

              {/* Account */}
              <div className="relative group/tooltip hidden sm:block">
                <Link
                  to={user ? "/account" : "/login"}
                  className="p-2 text-charcoal hover:text-gold transition-colors"
                  aria-label={user ? "My Account" : "Sign In"}
                >
                  <User size={18} />
                </Link>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-charcoal text-ivory text-[9px] tracking-widest uppercase opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-1 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 font-sans">
                  {user ? 'Account' : 'Login'}
                </span>
              </div>

              {/* Wishlist */}
              <div className="relative group/tooltip">
                <Link
                  to="/wishlist"
                  className="p-2 text-charcoal hover:text-gold transition-colors relative"
                  aria-label="Wishlist"
                >
                  <Heart size={18} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-charcoal text-[10px] font-bold rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-charcoal text-ivory text-[9px] tracking-widest uppercase opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-1 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 font-sans">
                  Wishlist
                </span>
              </div>

              {/* Cart */}
              <div className="relative group/tooltip">
                <button
                  onClick={openCart}
                  className="p-2 text-charcoal hover:text-gold transition-colors relative"
                  aria-label="Shopping bag"
                >
                  <ShoppingBag size={18} />
                  {totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-charcoal text-ivory text-[10px] font-bold rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-charcoal text-ivory text-[9px] tracking-widest uppercase opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-1 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 font-sans">
                  Bag ({totalItems})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-border bg-white/98 backdrop-blur-md animate-fade-in">
            <div className="max-w-2xl mx-auto px-4 py-4">
              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <Search size={16} className="text-taupe shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sarees, suits, kurtis…"
                  autoFocus
                  className="flex-1 bg-transparent text-sm text-charcoal placeholder:text-taupe/60 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="p-1 text-taupe hover:text-charcoal transition-colors"
                >
                  <X size={16} />
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={dynamicNavLinks}
      />
    </>
  );
}
