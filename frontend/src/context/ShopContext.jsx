import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';
import Toast from '../components/common/Toast';

export const ShopContext = createContext(null);

export const ShopContextProvider = ({ children }) => {
  // --- Global States ---
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(false);
  
  const [userInfo, setUserInfo] = useState(() => {
    const savedUser = localStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const savedWish = localStorage.getItem('wishlist');
    return savedWish ? JSON.parse(savedWish) : [];
  });

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const savedRecent = localStorage.getItem('recentlyViewed');
    return savedRecent ? JSON.parse(savedRecent) : [];
  });

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // --- Dynamic categories & brands ---
  const [categories, setCategories] = useState(['Electronics', 'Mobiles', 'Girls Clothing', 'Men', 'Kids', 'Accessories', 'Skin Care', 'Home Essentials', 'Gaming']);
  const [brands, setBrands] = useState([]);

  // --- Search & Live Suggestions ---
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // --- Toast Notifications State ---
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // --- Sync storage changes ---
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Load initial products, categories, and brands
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Helper: Toast Show ---
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // --- Theme Toggle ---
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    showToast(`Switched to ${theme === 'light' ? 'Dark' : 'Light'} Mode`, 'info');
  };

  // --- API: Fetch Products ---
  const fetchProducts = async (filters = {}) => {
    setLoadingProducts(true);
    try {
      const { data } = await API.get('/products', { params: filters });
      setProducts(data.products || []);
      setTotalPages(data.pages || 1);
      setTotalProducts(data.total || 0);

      // Extract unique categories and brands dynamically from full raw data
      if (data.products && data.products.length > 0) {
        // Collect brands dynamically
        const uniqueBrands = [...new Set(data.products.map(p => p.brand))];
        setBrands(uniqueBrands);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast(error.response?.data?.message || 'Error fetching product list', 'error');
    } finally {
      setLoadingProducts(false);
    }
  };

  // --- API: Fetch live search suggestions ---
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const { data } = await API.get('/products', { params: { search: query, limit: 5 } });
      setSuggestions(data.products || []);
    } catch (err) {
      console.error('Suggestions error:', err);
    }
  };

  // --- Auth Actions ---
  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      showToast(`Welcome back, ${data.name}!`, 'success');
      return data;
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Authentication failed';
      showToast(errMsg, 'error');
      throw new Error(errMsg);
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await API.post('/auth/register', { name, email, password });
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      showToast(`Welcome to E-BUY, ${data.name}!`, 'success');
      return data;
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Registration failed';
      showToast(errMsg, 'error');
      throw new Error(errMsg);
    }
  };

  const logout = () => {
    setUserInfo(null);
    setOrders([]);
    localStorage.removeItem('userInfo');
    showToast('Signed out successfully', 'info');
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await API.put('/auth/profile', profileData);
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      showToast('Profile updated successfully!', 'success');
      return data;
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Profile update failed';
      showToast(errMsg, 'error');
      throw new Error(errMsg);
    }
  };

  // --- Cart Actions ---
  const addToCart = (product, qty = 1) => {
    const existItem = cartItems.find(item => item.product === product._id);
    const stockAvailable = product.countInStock;

    if (existItem) {
      const newQty = existItem.qty + qty;
      if (newQty > stockAvailable) {
        showToast(`Only ${stockAvailable} items available in stock`, 'error');
        return;
      }
      setCartItems(cartItems.map(item =>
        item.product === product._id ? { ...existItem, qty: newQty } : item
      ));
    } else {
      if (qty > stockAvailable) {
        showToast(`Only ${stockAvailable} items available in stock`, 'error');
        return;
      }
      setCartItems([...cartItems, {
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        countInStock: product.countInStock,
        discount: product.discount,
        qty: qty
      }]);
    }
    showToast(`${product.name.substring(0, 20)}... added to cart`, 'success');
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.product !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQty = (productId, qty) => {
    const item = cartItems.find(item => item.product === productId);
    if (!item) return;

    if (qty > item.countInStock) {
      showToast(`Only ${item.countInStock} items in stock`, 'error');
      return;
    }
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(cartItems.map(x =>
      x.product === productId ? { ...x, qty: Number(qty) } : x
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // --- Wishlist Actions ---
  const toggleWishlist = (product) => {
    const inWish = wishlist.some(item => item._id === product._id);
    if (inWish) {
      setWishlist(wishlist.filter(item => item._id !== product._id));
      showToast('Removed from Wishlist', 'info');
    } else {
      setWishlist([...wishlist, product]);
      showToast('Added to Wishlist', 'success');
    }
  };

  // --- Recently Viewed ---
  const addRecentlyViewed = (product) => {
    const filtered = recentlyViewed.filter(item => item._id !== product._id);
    const updated = [product, ...filtered].slice(0, 6); // Cap at 6 products
    setRecentlyViewed(updated);
  };

  // --- Review Submission ---
  const addReview = async (productId, reviewData) => {
    try {
      await API.post(`/products/${productId}/reviews`, reviewData);
      showToast('Review submitted successfully!', 'success');
      // Reload products to pull review calculations
      fetchProducts();
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to submit review';
      showToast(errMsg, 'error');
      throw new Error(errMsg);
    }
  };

  // --- Order Actions ---
  const fetchMyOrders = async () => {
    if (!userInfo) return;
    setLoadingOrders(true);
    try {
      const { data } = await API.get('/orders/myorders');
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const placeOrder = async (orderData) => {
    try {
      const { data } = await API.post('/orders', orderData);
      clearCart();
      showToast('Order placed successfully!', 'success');
      // Update local product stocks
      fetchProducts();
      return data;
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to place order';
      showToast(errMsg, 'error');
      throw new Error(errMsg);
    }
  };

  // --- Calculated Subtotals ---
  const itemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const itemsPrice = cartItems.reduce((acc, item) => acc + (item.price * (1 - item.discount / 100) * item.qty), 0);
  
  // Indian rules: free shipping over ₹8,300, otherwise flat ₹1,250. Tax is 8.5%
  const shippingPrice = itemsPrice > 8300 || itemsPrice === 0 ? 0 : 1250;
  const taxPrice = itemsPrice * 0.085;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return (
    <ShopContext.Provider
      value={{
        products,
        totalPages,
        totalProducts,
        loadingProducts,
        categories,
        brands,
        userInfo,
        cartItems,
        wishlist,
        recentlyViewed,
        orders,
        loadingOrders,
        theme,
        searchQuery,
        suggestions,
        toast,
        itemsCount,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        setSearchQuery,
        fetchSuggestions,
        fetchProducts,
        login,
        register,
        logout,
        updateProfile,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        toggleWishlist,
        addRecentlyViewed,
        addReview,
        fetchMyOrders,
        placeOrder,
        toggleTheme,
        showToast
      }}
    >
      {children}

      {/* Global Custom Toast Banner */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(prev => ({ ...prev, show: false }))} 
          duration={3000} 
        />
      )}
    </ShopContext.Provider>
  );
};
