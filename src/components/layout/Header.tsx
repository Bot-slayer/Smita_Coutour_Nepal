import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
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
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Left: Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8 flex-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  className={({ isActive }) =>
                    `text-xs tracking-widest-lg uppercase font-sans font-medium transition-colors duration-200 ${
                      isActive ? 'text-gold' : 'text-charcoal hover:text-gold'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Mobile: Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-charcoal hover:text-gold transition-colors"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Center: Logo */}
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 text-center"
              aria-label="Smita Couture Nepal — Home"
            >
              <span className="font-serif text-sm sm:text-base lg:text-lg tracking-widest-lg uppercase text-charcoal whitespace-nowrap font-medium">
                Smita Couture Nepal
              </span>
            </Link>

            {/* Right: Icons */}
            <div className="flex items-center gap-1 sm:gap-3 flex-1 justify-end">
              {/* Search */}
              <button
                onClick={() => setSearchOpen((v) => !v)}
                className="p-2 text-charcoal hover:text-gold transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Account */}
              <Link
                to="/login"
                className="hidden sm:flex p-2 text-charcoal hover:text-gold transition-colors"
                aria-label="Account"
              >
                <User size={18} />
              </Link>

              {/* Wishlist */}
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

              {/* Cart */}
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
        navLinks={navLinks}
      />
    </>
  );
}
