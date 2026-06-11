import React, { useContext, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { FaSearch, FaChevronLeft } from 'react-icons/fa';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { products, fetchProducts, loadingProducts } = useContext(ShopContext);

  useEffect(() => {
    if (query) {
      fetchProducts({ search: query, limit: 20 });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-6 bg-amazon-grayBg dark:bg-slate-950 transition-colors min-h-screen">
      <nav className="text-xs text-slate-500 mb-4 select-none">
        <Link to="/" className="hover:underline">Home</Link> / <span className="text-slate-700 dark:text-slate-350 font-medium">Search Results</span>
      </nav>

      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl p-5 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <FaSearch className="text-amber-500" size={16} /> Search Results for "{query}"
        </h2>
        <p className="text-xs text-slate-500 mt-1">Found {products.length} matching products</p>
      </div>

      {loadingProducts ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
              <div className="w-full aspect-square rounded-lg skeleton-pulse"></div>
              <div className="h-4 w-5/6 rounded skeleton-pulse"></div>
              <div className="h-3 w-1/2 rounded skeleton-pulse"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 rounded-2xl p-12 text-center">
          <p className="text-slate-500 mb-5">No results found for your search term. Try searching for "Sony", "iPhone", or "Hoodie".</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 py-2 px-6 bg-amazon-yellow text-slate-950 font-bold text-xs rounded hover:bg-amber-500 shadow border border-yellow-500 transition-all"
          >
            <FaChevronLeft size={10} /> View All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
