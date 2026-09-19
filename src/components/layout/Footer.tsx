import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useWebsiteSettings } from '@/context/WebsiteSettingsContext';

function InstagramIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TikTokIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

const footerLinks = {
  shop: [
    { label: 'New Arrivals', to: '/shop?filter=new' },
    { label: 'Collections', to: '/shop' },
    { label: 'Sale', to: '/sale' },
    { label: 'Best Sellers', to: '/shop?filter=best' },
  ],
  customerCare: [
    { label: 'Contact', to: '/contact' },
    { label: 'Shipping', to: '/about#shipping' },
    { label: 'Returns', to: '/about#returns' },
    { label: 'Size Guide', to: '/about#size-guide' },
    { label: 'FAQs', to: '/about#faqs' },
  ],
  account: [
    { label: 'My Account', to: '/account' },
    { label: 'Orders', to: '/account/orders' },
    { label: 'Wishlist', to: '/wishlist' },
  ],
};

export default function Footer() {
  const { content } = useWebsiteSettings();

  return (
    <footer className="bg-charcoal text-ivory">
      {/* Main footer content */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="block mb-6">
              <span className="font-serif text-xl tracking-widest-lg uppercase text-ivory font-medium">
                Smita Couture Nepal
              </span>
            </Link>
            <p className="text-ivory/60 text-sm leading-relaxed mb-6">
              {content.footerDescription || 'Curating premium South Asian fashion with the finest fabrics, meticulous craftsmanship, and a deep respect for Nepali artisanal heritage.'}
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-xs tracking-widest-xl uppercase text-ivory/40 font-sans font-medium mb-5">
              Shop
            </h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-ivory/60 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care Links */}
          <div>
            <h4 className="text-xs tracking-widest-xl uppercase text-ivory/40 font-sans font-medium mb-5">
              Customer Care
            </h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.customerCare.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-ivory/60 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h4 className="text-xs tracking-widest-xl uppercase text-ivory/40 font-sans font-medium mb-5">
              Account
            </h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.account.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-ivory/60 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs tracking-widest-xl uppercase text-ivory/40 font-sans font-medium mb-5">
              Social
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="#"
                className="text-sm text-ivory/60 hover:text-gold transition-colors duration-200 flex items-center gap-2"
              >
                <InstagramIcon size={14} /> Instagram
              </a>
              <a
                href="#"
                className="text-sm text-ivory/60 hover:text-gold transition-colors duration-200 flex items-center gap-2"
              >
                <FacebookIcon size={14} /> Facebook
              </a>
              <a
                href="#"
                className="text-sm text-ivory/60 hover:text-gold transition-colors duration-200 flex items-center gap-2"
              >
                <TikTokIcon size={14} /> TikTok
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-14 pt-10 border-t border-ivory/10">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="md:flex-1">
              <p className="font-serif text-lg text-ivory mb-1">
                Join the Inner Circle
              </p>
              <p className="text-sm text-ivory/50">
                Be the first to know about new arrivals, exclusive events and private sales.
              </p>
            </div>
            <form className="flex gap-0 flex-1 max-w-sm" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-transparent border border-ivory/20 px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-gold transition-colors"
              />
              <button
                type="submit"
                className="bg-gold text-charcoal px-5 py-3 text-xs tracking-widest-lg uppercase font-sans font-medium hover:bg-ivory transition-colors duration-200 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ivory/10">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ivory/30">
          <span>© {new Date().getFullYear()} Smita Couture Nepal. {content.copyrightText || 'All rights reserved.'}</span>
          <div className="flex items-center gap-4">
            <Link to="/about#privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link to="/about#terms" className="hover:text-gold transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
