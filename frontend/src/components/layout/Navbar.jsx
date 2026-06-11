import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUser, FaHeart, FaMoon, FaSun, FaBars } from 'react-icons/fa';
import { ShopContext } from '../../context/ShopContext';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    wishlist, 
    userInfo, 
    logout, 
    categories, 
    theme, 
    toggleTheme,
    itemsCount 
  } = useContext(ShopContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <>
      <header 
        className={`sticky top-0 w-full z-40 transition-all duration-300 ${
          isScrolled 
            ? 'glass shadow-md py-2.5' 
            : 'bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4'
        }`}
      >
        <div className="max-w-[1500px] mx-auto px-4 md:px-6 flex items-center justify-between gap-4 lg:gap-8">
          
          {/* Left: Mobile Menu Toggle & Logo */}
          <div className="flex items-center gap-3 md:gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <FaBars size={20} />
            </button>

            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <img
                  src="https://img.icons8.com/color/48/shop.png"
                  alt="E-BUY Logo"
                  className="h-6 w-6"
                />
              </div>
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 hidden sm:block tracking-tight">
                E-BUY
              </span>
            </Link>
          </div>

          {/* Center: Search Bar (Desktop) */}
          <form 
            onSubmit={handleSearch} 
            className="hidden md:flex flex-1 max-w-2xl relative group"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for premium products, brands, and more..."
              className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 text-sm rounded-full outline-none transition-all duration-300 pl-11 pr-24 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-500"
            />
            <button 
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full transition-colors shadow-md"
            >
              Search
            </button>
          </form>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors hidden sm:block"
            >
              {theme === 'dark' ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>

            {/* User Account */}
            {userInfo ? (
              <div className="relative group hidden lg:block">
                <button className="flex items-center gap-2 p-1.5 pr-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors border border-slate-200 dark:border-slate-700">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                    {userInfo.name.split(' ')[0]}
                  </span>
                </button>
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 flex flex-col p-2">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{userInfo.name}</p>
                    <p className="text-xs text-slate-500 truncate">{userInfo.email}</p>
                  </div>
                  <Link to="/profile" className="px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium">Your Profile</Link>
                  <Link to="/orders" className="px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium">Your Orders</Link>
                  {userInfo.isAdmin && (
                    <Link to="/admin" className="px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors font-bold">Admin Dashboard</Link>
                  )}
                  <button 
                    onClick={logout}
                    className="mt-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-bold text-left"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                to="/login"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <FaUser /> Sign In
              </Link>
            )}

            {/* Wishlist */}
            <Link 
              to="/wishlist" 
              className="relative p-2.5 text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-slate-800 hover:text-red-500 rounded-full transition-colors hidden sm:block"
            >
              <FaHeart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-sm animate-scaleIn">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative p-2.5 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 rounded-full transition-colors"
            >
              <FaShoppingCart size={22} />
              {itemsCount > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-sm animate-scaleIn">
                  {itemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Bottom Nav: Categories (Desktop Only) */}
        <div className="hidden lg:block border-t border-slate-200 dark:border-slate-800 mt-4 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-[1500px] mx-auto px-6 flex items-center gap-6 overflow-x-auto no-scrollbar py-2">
            <Link to="/products" className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap px-2 py-1 transition-colors">
              All Products
            </Link>
            {categories.map((cat) => (
              <Link 
                key={cat} 
                to={`/category/${encodeURIComponent(cat)}`}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap px-2 py-1 transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        categories={categories}
        userInfo={userInfo}
        logout={logout}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    </>
  );
};

export default Navbar;
