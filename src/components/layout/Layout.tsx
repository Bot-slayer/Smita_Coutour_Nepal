import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
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
    </div>
  );
}
