import { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { X, User, Heart } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';

interface NavLinkItem {
  label: string;
  to: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLinkItem[];
}

export default function MobileMenu({ isOpen, onClose, navLinks }: MobileMenuProps) {
  const wishlistCount = useWishlistStore((s) => s.items.length);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div className="fixed top-0 left-0 h-full w-[80vw] max-w-sm bg-ivory z-50 flex flex-col animate-slide-in-right shadow-2xl lg:hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <span className="font-serif text-sm tracking-widest-lg uppercase text-charcoal font-medium">
            Smita Couture Nepal
          </span>
          <button onClick={onClose} className="p-1 text-charcoal hover:text-gold transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col flex-1 px-6 py-8 gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `py-3 text-base font-serif border-b border-border/50 transition-colors duration-200 ${
                  isActive ? 'text-gold' : 'text-charcoal hover:text-gold'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer links */}
        <div className="px-6 py-6 border-t border-border flex flex-col gap-4">
          <Link
            to="/login"
            onClick={onClose}
            className="flex items-center gap-3 text-sm text-charcoal hover:text-gold transition-colors"
          >
            <User size={16} /> My Account
          </Link>
          <Link
            to="/wishlist"
            onClick={onClose}
            className="flex items-center gap-3 text-sm text-charcoal hover:text-gold transition-colors"
          >
            <Heart size={16} />
            Wishlist
            {wishlistCount > 0 && (
              <span className="ml-auto bg-gold text-charcoal text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </>
  );
}
