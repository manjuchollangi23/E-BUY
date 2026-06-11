import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaSearch,
  FaShoppingCart,
  FaHeart,
  FaSun,
  FaMoon,
  FaUser,
  FaBoxOpen,
  FaSignOutAlt,
  FaSlidersH,
  FaChevronDown
} from 'react-icons/fa';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const {
    userInfo,
    cartItems,
    wishlist,
    theme,
    toggleTheme,
    categories,
    itemsCount,
    logout
  } = useContext(ShopContext);

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close profile dropdown on clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Fetch search suggestions
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchVal.trim().length > 1) {
        try {
          const response = await fetch(`http://localhost:5000/api/products?search=${searchVal}&limit=6${selectedCategory ? `&category=${selectedCategory}` : ''}`);
          const data = await response.json();
          setSuggestions(data.products || []);
          setShowSuggestions(true);
        } catch (err) {
          console.error(err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchVal, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    let url = `/products?search=${encodeURIComponent(searchVal)}`;
    if (selectedCategory) {
      url += `&category=${encodeURIComponent(selectedCategory)}`;
    }
    navigate(url);
  };

  const handleSuggestionClick = (prodId) => {
    setShowSuggestions(false);
    setSearchVal('');
    navigate(`/products/${prodId}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-amazon-dark text-white shadow-md">
      {/* Top Main Nav Row */}
      <div className="flex items-center justify-between px-4 py-2.5 md:px-6 gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="https://img.icons8.com/fluency/96/shopping-cart-loaded.png"
            alt="E-BUY Logo"
            className="h-8 w-8 object-contain"
          />
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-amber-400 to-amazon-yellow bg-clip-text text-transparent flex items-center">
            E-BUY<span className="text-amber-500 text-[10px] ml-0.5 font-bold align-super select-none">®</span>
          </span>
        </Link>

        {/* Center: Search Bar */}
        <div ref={searchRef} className="relative flex-grow max-w-2xl hidden sm:block">
          <form onSubmit={handleSearchSubmit} className="flex h-10 w-full rounded overflow-hidden">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-750 text-xs border-r border-slate-350 focus:outline-none cursor-pointer max-w-[120px] transition-all"
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Input field */}
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              placeholder="Search E-BUY..."
              className="flex-grow px-4 py-1.5 bg-white text-slate-900 focus:outline-none text-sm"
            />

            {/* Search Icon button */}
            <button
              type="submit"
              className="px-6 bg-amazon-yellow hover:bg-amazon-yellowHover text-slate-900 transition-colors flex items-center justify-center focus:outline-none"
            >
              <FaSearch size={14} />
            </button>
          </form>

          {/* Suggestions Dropdown Overlay */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-800 shadow-xl overflow-hidden text-slate-800 dark:text-slate-200 z-50">
              {suggestions.map((prod) => (
                <div
                  key={prod._id}
                  onClick={() => handleSuggestionClick(prod._id)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-b-0 transition-colors"
                >
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="h-8 w-8 object-contain bg-white rounded p-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate text-slate-700 dark:text-slate-300">{prod.name}</p>
                    <p className="text-[10px] text-amber-600 font-bold">₹{prod.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-5 shrink-0">
          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-slate-800 rounded focus:outline-none transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FaSun className="text-amber-400" size={16} /> : <FaMoon className="text-slate-300" size={16} />}
          </button>

          {/* User Account / Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex flex-col justify-center text-left hover:bg-slate-800 px-3 py-1 rounded focus:outline-none max-w-[150px] transition-colors"
            >
              <span className="text-[10px] text-slate-300 truncate">
                Hello, {userInfo ? userInfo.name.split(' ')[0] : 'Sign in'}
              </span>
              <span className="text-xs font-bold flex items-center gap-1">
                Account <FaChevronDown size={8} />
              </span>
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded text-slate-800 dark:text-slate-100 py-2 z-50 animate-fadeIn">
                {!userInfo ? (
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 text-center">
                    <Link
                      to="/login"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block w-full text-center py-1.5 bg-amazon-yellow text-slate-950 text-xs font-semibold rounded hover:bg-amber-500 shadow transition-all duration-150"
                    >
                      Sign in
                    </Link>
                    <p className="text-[10px] mt-1.5 text-slate-500">
                      New customer? <Link to="/register" onClick={() => setProfileDropdownOpen(false)} className="text-amazon-blueAccent hover:underline">Start here</Link>
                    </p>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <FaUser className="text-slate-500" /> My Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <FaBoxOpen className="text-slate-500" /> My Orders
                    </Link>
                    {userInfo.isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800"
                      >
                        <FaSlidersH /> Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                    >
                      <FaSignOutAlt /> Sign Out
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <Link to="/wishlist" className="relative p-2 hover:bg-slate-800 rounded flex flex-col items-center transition-colors">
            <span className="absolute -top-1 -right-1 bg-red-505 text-white rounded-full text-[9px] font-bold h-4 w-4 flex items-center justify-center">
              {wishlist.length}
            </span>
            <FaHeart size={16} className="text-rose-500" />
          </Link>

          {/* Cart */}
          <Link to="/cart" className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded transition-colors">
            <div className="relative">
              <span className="absolute -top-1 -right-1.5 bg-amazon-yellow text-slate-900 rounded-full text-[9px] font-bold h-4 w-4 flex items-center justify-center">
                {itemsCount}
              </span>
              <FaShoppingCart size={18} />
            </div>
            <span className="hidden md:inline text-xs font-bold">Cart</span>
          </Link>
        </div>
      </div>

      {/* Mobile-only Search Bar Row (displays only on small screens) */}
      <div className="px-4 pb-2.5 sm:hidden bg-amazon-dark">
        <form onSubmit={handleSearchSubmit} className="flex h-9 w-full rounded overflow-hidden border border-slate-700">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search E-BUY..."
            className="flex-grow px-3 py-1 bg-white text-slate-900 focus:outline-none text-xs"
          />
          <button type="submit" className="bg-amazon-yellow text-slate-900 px-4 flex items-center justify-center">
            <FaSearch size={12} />
          </button>
        </form>
      </div>

      {/* Sub-Navbar: Categories (Equally aligned across page width) */}
      <div className="flex items-center w-full px-6 py-2.5 bg-amazon-lightDark text-xs font-semibold overflow-x-auto whitespace-nowrap gap-4 md:gap-6">
        <Link to="/products" className="flex-1 text-center hover:text-amber-400 transition-colors">
          All Products
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            to={`/category/${encodeURIComponent(cat)}`}
            className="flex-1 text-center hover:text-amber-400 transition-colors"
          >
            {cat}
          </Link>
        ))}
      </div>
    </header>
  );
};

export default Navbar;
