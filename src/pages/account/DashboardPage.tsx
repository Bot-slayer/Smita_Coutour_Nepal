import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Heart, MapPin, LogOut, ChevronRight, Settings } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const menuItems = [
    {
      label: 'My Profile',
      desc: 'Update your personal details and account settings',
      icon: User,
      href: '/account/profile',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Order History',
      desc: 'Track and manage your recent and past orders',
      icon: Package,
      href: '/account/orders',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Wishlist',
      desc: 'Your saved favorite pieces for later',
      icon: Heart,
      href: '/wishlist',
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
    {
      label: 'Saved Addresses',
      desc: 'Manage your primary and alternative shipping locations',
      icon: MapPin,
      href: '/account/addresses',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="bg-ivory min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-12 pb-8 border-b border-border">
          <div className="w-20 h-20 bg-gold/10 border border-gold/30 flex items-center justify-center text-gold text-2xl font-serif">
            {user.displayName.charAt(0)}
          </div>
          <div className="text-center sm:text-left flex-1">
            <p className="text-[10px] tracking-widest-xl uppercase text-gold font-sans font-medium mb-1">
              Client Portal
            </p>
            <h1 className="font-serif text-3xl text-charcoal mb-1">Welcome, {user.displayName}</h1>
            <p className="text-sm text-taupe">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/account/settings')}
              className="p-2 border border-border text-taupe hover:text-charcoal hover:border-charcoal transition-colors"
              title="Settings"
            >
              <Settings size={18} />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 border border-border text-taupe hover:text-red-600 hover:border-red-200 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="group bg-white border border-border/80 p-6 hover:border-charcoal transition-all flex items-start gap-4 shadow-xs"
            >
              <div className={`p-3 ${item.bg} ${item.color} group-hover:bg-charcoal group-hover:text-white transition-colors`}>
                <item.icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif text-lg text-charcoal group-hover:text-gold transition-colors">
                    {item.label}
                  </h3>
                  <ChevronRight size={16} className="text-border group-hover:text-charcoal group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-taupe leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Logout Button (Mobile) */}
        <button
          onClick={handleLogout}
          className="mt-8 w-full sm:hidden py-4 border border-red-100 text-red-600 flex items-center justify-center gap-2 text-xs tracking-widest uppercase font-sans font-medium hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
