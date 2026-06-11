import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaHome, FaChevronLeft } from 'react-icons/fa';

const NotFound = () => {
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center py-10 px-4 bg-amazon-grayBg dark:bg-slate-950 transition-colors text-slate-800 dark:text-slate-100">
      
      {/* 404 Header Code */}
      <h1 className="text-6xl md:text-8xl font-black text-slate-300 dark:text-slate-800 select-none animate-pulse">404</h1>
      
      <h2 className="text-xl md:text-2xl font-bold mt-2 mb-3">Looking for something?</h2>
      <p className="text-xs text-slate-500 text-center max-w-sm mb-6 leading-normal">
        We're sorry. The Web page you requested was not found on our server. Try searching or go back to home.
      </p>

      {/* Embedded Search Form */}
      <form onSubmit={handleSearchSubmit} className="flex h-10 w-full max-w-md rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 shadow-sm mb-6">
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Search products..."
          className="flex-1 px-4 py-1.5 text-xs text-slate-800 focus:outline-none dark:bg-slate-900 dark:text-slate-100"
          required
        />
        <button type="submit" className="px-5 bg-amazon-yellow hover:bg-amazon-yellowHover text-slate-900 transition-colors flex items-center justify-center">
          <FaSearch size={14} />
        </button>
      </form>

      {/* Navigation buttons */}
      <div className="flex gap-4">
        <Link
          to="/"
          className="py-2 px-5 bg-slate-850 hover:bg-slate-800 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow transition-colors dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          <FaHome size={12} /> Go to Home Page
        </Link>
        <Link
          to="/products"
          className="py-2 px-5 border border-slate-350 dark:border-slate-700 hover:bg-slate-55 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
        >
          <FaChevronLeft size={10} /> View Catalog
        </Link>
      </div>

    </div>
  );
};

export default NotFound;
