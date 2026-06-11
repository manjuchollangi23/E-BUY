import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaRegHeart, FaEye } from 'react-icons/fa';
import { ShopContext } from '../../context/ShopContext';
import StarRating from '../common/StarRating';
import Badge from '../ui/Badge';

const ProductCard = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist } = useContext(ShopContext);

  const isLiked = wishlist.some(item => item._id === product._id);
  const discountedPrice = product.price * (1 - product.discount / 100);

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm card-hover flex flex-col h-full">
      
      {/* Top badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.discount > 0 && (
          <Badge variant="accent" pill>
            -{product.discount}% OFF
          </Badge>
        )}
        {product.countInStock === 0 && (
          <Badge variant="danger" pill>
            Out of Stock
          </Badge>
        )}
      </div>

      {/* Image Container */}
      <div className="relative aspect-[4/3] sm:aspect-square bg-slate-50 dark:bg-slate-800/50 p-4 flex items-center justify-center overflow-hidden">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop'}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop';
          }}
        />
        
        {/* Quick action overlay buttons */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
            className="w-8 h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-md text-slate-600 dark:text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 transition-colors"
            title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          </button>
          <Link
            to={`/products/${product._id}`}
            className="w-8 h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-md text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
            title="Quick view"
          >
            <FaEye />
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{product.brand}</span>
        </div>
        
        <Link to={`/products/${product._id}`} className="block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3 mt-auto">
          <StarRating rating={product.rating} size={12} />
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">({product.numReviews})</span>
        </div>

        {/* Price & Cart row */}
        <div className="flex items-end justify-between mt-1">
          <div className="flex flex-col">
            {product.discount > 0 ? (
              <>
                <span className="text-[10px] text-slate-400 line-through">₹{product.price.toFixed(2)}</span>
                <span className="text-lg font-black text-slate-900 dark:text-white leading-none mt-0.5">₹{discountedPrice.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-lg font-black text-slate-900 dark:text-white leading-none">₹{product.price.toFixed(2)}</span>
            )}
          </div>
          
          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.countInStock === 0}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300
              ${product.countInStock > 0 
                ? 'bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white dark:bg-blue-500/10 dark:hover:bg-blue-600 dark:text-blue-400 dark:hover:text-white' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500'}`}
            title={product.countInStock > 0 ? "Add to cart" : "Out of stock"}
          >
            <FaShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
