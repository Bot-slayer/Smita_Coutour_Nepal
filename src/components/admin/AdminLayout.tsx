
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Palette,
  Image as ImageIcon,
  Type,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out from Admin Console');
    navigate('/login');
  };

  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin',
    },
    {
      label: 'Products',
      icon: Package,
      href: '/admin/products',
    },
    {
      label: 'Orders',
      icon: ShoppingCart,
      href: '/admin/orders',
    },
    {
      label: 'Customers',
      icon: Users,
      href: '/admin/customers',
    },
    {
      label: 'Appearance',
      icon: Palette,
      href: '/admin/appearance',
    },
    {
      label: 'Website Images',
      icon: ImageIcon,
      href: '/admin/website-images',
    },
    {
      label: 'Website Content',
      icon: Type,
      href: '/admin/content',
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/admin/settings',
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1A1A1A',
            color: '#FAF9F6',
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif',
            borderRadius: '0',
            border: '1px solid #C9A96E',
          },
        }}
      />

      {/* Sidebar */}
      <aside className="w-64 bg-charcoal text-ivory flex flex-col fixed h-full z-20">
        {/* Admin Header */}
        <div className="p-6 border-b border-ivory/10 flex flex-col gap-1">
          <Link
            to="/"
            className="text-gold flex items-center gap-2 mb-2"
          >
            <ChevronLeft size={14} />

            <span className="text-[10px] tracking-widest uppercase font-sans">
              Back to Website
            </span>
          </Link>

          <span className="font-serif text-lg tracking-widest uppercase text-ivory">
            Admin Console
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              end={item.href === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-sans tracking-wide transition-colors ${
                  isActive
                    ? 'bg-gold text-charcoal'
                    : 'text-ivory/60 hover:text-ivory hover:bg-white/5'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-ivory/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-ivory/60 hover:text-red-400 hover:bg-red-900/10 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}

