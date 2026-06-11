import React, { useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { FaBoxes, FaChevronLeft } from 'react-icons/fa';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const { products, fetchProducts, loadingProducts } = useContext(ShopContext);

  useEffect(() => {
    fetchProducts({ category: categoryName, limit: 20 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryName]);

  return (
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-6 bg-amazon-grayBg dark:bg-slate-950 transition-colors min-h-screen">
      <nav className="text-xs text-slate-500 mb-4 select-none">
        <Link to="/" className="hover:underline">Home</Link> / <span className="text-slate-700 dark:text-slate-350 font-medium">{categoryName}</span>
      </nav>

      {/* Category banner */}
      <div className="bg-gradient-to-r from-slate-800 to-amazon-dark text-white rounded-xl p-6 shadow-sm mb-6 flex flex-col justify-center min-h-[120px]">
        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider">{categoryName} Store</h2>
        <p className="text-xs text-slate-300 mt-1">Explore top deals and direct discounts in our {categoryName} collection.</p>
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
          <p className="text-slate-500 mb-5">No products found in this category.</p>
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

export default CategoryPage;
