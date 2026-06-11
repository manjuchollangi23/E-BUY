import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes, FaSearch, FaUser, FaHeart, FaShoppingCart, FaMoon, FaSun, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';

const MobileMenu = ({ isOpen, onClose, categories, userInfo, logout, theme, toggleTheme }) => {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const term = e.target.search.value;
    if (term.trim()) {
      navigate(`/products?search=${encodeURIComponent(term.trim())}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-[85%] max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-slideRight">
        
        {/* Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          {userInfo ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-inner">
                {userInfo.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">Hello, {userInfo.name.split(' ')[0]}</p>
                <p className="text-xs text-slate-500">Welcome back</p>
              </div>
            </div>
          ) : (
            <Link to="/login" onClick={onClose} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold">
              <FaUser size={20} /> Sign In
            </Link>
          )}
          
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-6">
          
          {/* Search Box */}
          <div className="px-4">
            <form onSubmit={handleSearch} className="relative">
              <input 
                name="search"
                type="text" 
                placeholder="Search products..." 
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
              />
              <FaSearch className="absolute left-3.5 top-3.5 text-slate-400" />
            </form>
          </div>

          {/* Quick Actions */}
          <div className="px-4 grid grid-cols-2 gap-3">
            <Link to="/orders" onClick={onClose} className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <FaUser className="text-blue-500" size={20} />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">My Orders</span>
            </Link>
            <Link to="/wishlist" onClick={onClose} className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <FaHeart className="text-red-500" size={20} />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Wishlist</span>
            </Link>
          </div>

          {/* Shop Categories */}
          <div className="px-4">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">Shop by Category</h3>
            <div className="space-y-1">
              <Link 
                to="/products" 
                onClick={onClose}
                className="block py-3 px-4 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-400 transition-colors"
              >
                All Products
              </Link>
              {categories.map((cat) => (
                <Link 
                  key={cat}
                  to={`/category/${encodeURIComponent(cat)}`}
                  onClick={onClose}
                  className="block py-3 px-4 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-400 transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Settings & Admin */}
          <div className="px-4 border-t border-slate-100 dark:border-slate-800 pt-6 mt-auto">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">Settings & Account</h3>
            
            <button 
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
            >
              {theme === 'dark' ? <FaSun className="text-amber-500" size={18} /> : <FaMoon className="text-slate-500" size={18} />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>

            {userInfo?.isAdmin && (
              <Link 
                to="/admin" 
                onClick={onClose}
                className="flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
              >
                <FaShieldAlt size={18} />
                Admin Dashboard
              </Link>
            )}

            {userInfo && (
              <button 
                onClick={() => { logout(); onClose(); }}
                className="w-full flex items-center gap-3 py-3 px-4 mt-2 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
              >
                <FaSignOutAlt size={18} />
                Sign Out
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
