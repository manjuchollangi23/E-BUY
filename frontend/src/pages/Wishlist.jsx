import React, { useContext } from 'react';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import ProductCard from '../components/product/ProductCard';
import EmptyState from '../components/common/EmptyState';
import useScrollTop from '../hooks/useScrollTop';

const Wishlist = () => {
  useScrollTop();
  const { wishlist, toggleWishlist, addToCart } = useContext(ShopContext);

  if (wishlist.length === 0) {
    return (
      <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-12 md:py-20 min-h-screen">
        <EmptyState 
          icon={FaHeart}
          title="Your wishlist is empty"
          description="Save items you love to your wishlist. Review them anytime and easily move them to cart."
          actionText="Discover Products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-8 lg:py-12 bg-amazon-grayBg dark:bg-slate-950 transition-colors min-h-screen">
      
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center">
            <FaHeart size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Wishlist</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">{wishlist.length} saved {wishlist.length === 1 ? 'item' : 'items'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {wishlist.map((product) => (
          <div key={product._id} className="relative group">
            <ProductCard product={product} />
            <button
              onClick={() => toggleWishlist(product)}
              className="absolute top-3 right-3 z-20 w-8 h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 shadow-md transition-colors translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              title="Remove from wishlist"
            >
              <FaTrash size={12} />
            </button>
            <button
              onClick={() => addToCart(product, 1)}
              disabled={product.countInStock === 0}
              className="absolute bottom-[4.5rem] right-4 z-20 w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-full flex items-center justify-center shadow-lg transition-all scale-0 group-hover:scale-100"
              title="Add to cart"
            >
              <FaShoppingCart size={14} />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Wishlist;
