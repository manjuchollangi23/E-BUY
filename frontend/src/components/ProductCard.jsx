import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { ShopContext } from '../context/ShopContext';
import StarRating from './StarRating';

const ProductCard = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist } = useContext(ShopContext);

  const isInWishlist = wishlist.some(item => item._id === product._id);
  const discountedPrice = product.price * (1 - product.discount / 100);

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      
      {/* Wishlist Button Overlay */}
      <button
        onClick={() => toggleWishlist(product)}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 shadow-xs text-slate-500 hover:text-red-500 transition-colors focus:outline-none"
        aria-label="Add to wishlist"
      >
        {isInWishlist ? (
          <FaHeart className="text-red-500 animate-pulse" size={16} />
        ) : (
          <FaRegHeart size={16} />
        )}
      </button>

      {/* Discount Badge Overlay */}
      {product.discount > 0 && (
        <span className="absolute top-3 left-3 z-10 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-md shadow-xs">
          -{product.discount}% OFF
        </span>
      )}

      {/* Product Image Link */}
      <Link to={`/products/${product._id}`} className="block overflow-hidden bg-slate-50 dark:bg-slate-950 aspect-square">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop'}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-2"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop';
          }}
        />
      </Link>

      {/* Product Details Section */}
      <div className="flex flex-col flex-1 p-4">
        {/* Brand */}
        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold mb-1">
          {product.brand}
        </span>

        {/* Title */}
        <Link
          to={`/products/${product._id}`}
          className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-100 hover:text-amazon-blueAccent dark:hover:text-amber-400 line-clamp-2 h-10 mb-2 transition-colors"
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <StarRating rating={product.rating} size={13} />
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            ({product.numReviews})
          </span>
        </div>

        {/* Prices */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-base font-bold text-slate-900 dark:text-white">
            ₹{discountedPrice.toFixed(2)}
          </span>
          {product.discount > 0 && (
            <span className="text-xs text-slate-400 line-through">
              ₹{product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          {product.countInStock > 0 ? (
            <button
              onClick={() => addToCart(product, 1)}
              className="w-full py-2 bg-gradient-to-b from-yellow-400 to-amazon-yellow hover:from-yellow-300 hover:to-yellow-500 text-slate-900 text-xs font-semibold rounded-md border border-yellow-500 flex items-center justify-center gap-2 shadow-xs transition-all duration-200"
            >
              <FaShoppingCart size={12} /> Add to Cart
            </button>
          ) : (
            <button
              disabled
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 text-xs font-semibold rounded-md cursor-not-allowed border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2"
            >
              Out of stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
