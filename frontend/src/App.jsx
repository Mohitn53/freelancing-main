import TopNavbar from './components/TopNavbar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import AboutContactPage from './pages/AboutContactPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Admin
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminProducts from './pages/admin/Products';
import AdminCategories from './pages/admin/Categories';
import AdminOrders from './pages/admin/Orders';
import AdminCustomers from './pages/admin/Customers';
import AdminInventory from './pages/admin/Inventory';

function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="app-container">
      <TopNavbar />
      <Navbar />

      <Routes>
        {/* Storefront Routes */}
        <Route element={
          <div style={{ minHeight: 'calc(100vh - 120px)' }}>
            <Outlet />
          </div>
        }>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about-contact" element={<AboutContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

          {/* Admin Layout - Completely Separate */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/products" replace />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/customers" element={<AdminCustomers />} />
              <Route path="/admin/inventory" element={<AdminInventory />} />
            </Route>
          </Route>
      </Routes>

      {!isAdminPath && <Footer />}
    </div>
  );
}

export default App;
