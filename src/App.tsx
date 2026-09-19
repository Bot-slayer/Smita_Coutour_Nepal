
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import WebsiteAppearance from '@/components/WebsiteAppearance';
import { WebsiteSettingsProvider } from '@/context/WebsiteSettingsContext';

// Pages
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CategoryPage from '@/pages/CategoryPage';
import SalePage from '@/pages/SalePage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import WishlistPage from '@/pages/WishlistPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderSuccessPage from '@/pages/OrderSuccessPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';

// Account
import DashboardPage from '@/pages/account/DashboardPage';
import OrderHistoryPage from '@/pages/account/OrderHistoryPage';
import OrderDetailsPage from '@/pages/account/OrderDetailsPage';

// Admin
import AdminRoute from '@/components/admin/AdminRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import ManageProducts from '@/pages/admin/ManageProducts';
import AppearanceSettings from '@/pages/admin/AppearanceSettings';
import WebsiteImageManagement from '@/pages/admin/WebsiteImageManagement';
import WebsiteContentSettings from '@/pages/admin/WebsiteContentSettings';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-5 px-4">
      <p className="font-serif text-6xl text-border">
        404
      </p>

      <h1 className="font-serif text-3xl text-charcoal">
        Page Not Found
      </h1>

      <p className="text-taupe text-sm max-w-sm">
        The page you're looking for doesn't exist or may have been moved.
      </p>

      <a
        href="/"
        className="btn-primary mt-4"
      >
        Return Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <WebsiteSettingsProvider>
      <BrowserRouter>
        {/* Load and apply website appearance settings */}
        <WebsiteAppearance />

        <Routes>
          {/* Admin Routes - Standalone Layout */}
        <Route element={<AdminRoute />}>
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <div className="p-8">
                  <h1 className="font-serif text-3xl text-charcoal mb-4">Dashboard</h1>
                  <p className="text-taupe">Welcome to the Smita Couture Nepal Management Console.</p>
                </div>
              </AdminLayout>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminLayout>
                <ManageProducts />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/appearance"
            element={
              <AdminLayout>
                <AppearanceSettings />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/website-images"
            element={
              <AdminLayout>
                <WebsiteImageManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/content"
            element={
              <AdminLayout>
                <WebsiteContentSettings />
              </AdminLayout>
            }
          />
        </Route>

        {/* Website Routes - Main Layout */}
        <Route element={<Layout />}>
          {/* =========================
              Public Pages
          ========================= */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/sale" element={<SalePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* =========================
              Commerce
          ========================= */}
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />

          {/* =========================
              Authentication
          ========================= */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* =========================
              Account
          ========================= */}
          <Route path="/account" element={<DashboardPage />} />
          <Route path="/account/orders" element={<OrderHistoryPage />} />
          <Route path="/account/orders/:id" element={<OrderDetailsPage />} />

          {/* =========================
              404
          ========================= */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </WebsiteSettingsProvider>
  );
}
