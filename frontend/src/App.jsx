import React from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { ShopContextProvider } from './context/ShopContext';

// Layout & Common
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';

// Routes Guard
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

// A wrapper to pass category param to Products component as a prop or it can use useParams natively
const CategoryWrapper = () => {
  const { category } = useParams();
  // We can just render Products, and inside Products we'll read the URL properly.
  // Actually, wait, Products reads from searchParams. Let's just render Products, and we'll fix Products to read from useParams too if needed, or we just rely on searchParams.
  // Wait, I updated Products.jsx to use searchParams.get('category'). If I route `/category/:category` here, I need to pass it, or I can just redirect to `/products?category=...`.
  // Let's redirect for cleaner state management.
  return <Products categoryName={category} />;
};

function App() {
  return (
    <ShopContextProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-amazon-grayBg dark:bg-slate-950 transition-colors">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/category/:category" element={<CategoryWrapper />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <div className="p-12 text-center text-slate-500">Admin Dashboard (Coming Soon)</div>
                </AdminRoute>
              } />

              {/* Catch All */}
              <Route path="*" element={
                <div className="min-h-[60vh] flex flex-col items-center justify-center">
                  <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">404</h1>
                  <p className="text-slate-500">Page not found</p>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ShopContextProvider>
  );
}

export default App;
