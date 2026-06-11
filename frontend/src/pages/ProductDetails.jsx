import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaExclamationCircle, FaShoppingCart, FaBolt, FaHeart, FaRegHeart, FaShieldAlt, FaTruck } from 'react-icons/fa';
import { ShopContext } from '../context/ShopContext';
import API from '../services/api';
import StarRating from '../components/common/StarRating';
import ProductCard from '../components/product/ProductCard';
import ProductGallery from '../components/product/ProductGallery';
import ReviewSection from '../components/product/ReviewSection';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { formatPrice } from '../utils/formatPrice';
import useScrollTop from '../hooks/useScrollTop';

const ProductDetails = () => {
  useScrollTop();
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist, products, addRecentlyViewed, userInfo, addReview, showToast } = useContext(ShopContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const loadProductDetails = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
        addRecentlyViewed(data);
        setQuantity(1);
      } catch (err) {
        showToast('Product not found', 'error');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    loadProductDetails();
  }, [id, navigate, showToast, addRecentlyViewed]);

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amazon-grayBg dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading premium experience...</p>
        </div>
      </div>
    );
  }

  const isLiked = wishlist.some(item => item._id === product._id);
  const discountedPrice = product.price * (1 - product.discount / 100);
  const savingAmount = product.price * (product.discount / 100);

  const similarProducts = products
    .filter(p => p.category === product.category && p._id !== product._id)
    .slice(0, 4);

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (reviewData) => {
    setSubmittingReview(true);
    try {
      await addReview(product._id, reviewData);
      const { data } = await API.get(`/products/${product._id}`);
      setProduct(data);
      showToast('Review submitted successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-6 lg:py-10 bg-amazon-grayBg dark:bg-slate-950 transition-colors min-h-screen space-y-8">
      
      {/* Breadcrumbs */}
      <nav className="text-xs md:text-sm text-slate-500 flex items-center gap-2 select-none font-medium mb-2">
        <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <Link to="/products" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Products</Link>
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <Link to={`/category/${encodeURIComponent(product.category)}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{product.category}</Link>
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <span className="text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left: Product Gallery (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <ProductGallery images={product.images} productName={product.name} />
          </div>
        </div>

        {/* Center: Details info (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="info" size="sm">{product.brand}</Badge>
              {product.discount > 0 && <Badge variant="accent" size="sm">SAVE {product.discount}%</Badge>}
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-4 tracking-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-3 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-full border border-amber-200 dark:border-amber-800">
                <span className="text-sm font-bold text-amber-600 dark:text-amber-500">{product.rating.toFixed(1)}</span>
                <StarRating rating={product.rating} size={14} />
              </div>
              <span className="text-sm font-medium text-slate-500 hover:text-blue-600 cursor-pointer underline decoration-dotted transition-colors">
                {product.numReviews} Reviews
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {product.discount > 0 ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{formatPrice(discountedPrice)}</span>
                  <span className="text-lg text-slate-400 line-through font-semibold mb-1">{formatPrice(product.price)}</span>
                </div>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-500">
                  You save: {formatPrice(savingAmount)} ({product.discount}%)
                </p>
              </div>
            ) : (
              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{formatPrice(product.price)}</span>
            )}
            <p className="text-xs text-slate-500 font-medium">Local taxes included (where applicable)</p>
          </div>

          <div className="prose prose-sm dark:prose-invert text-slate-600 dark:text-slate-400 leading-relaxed">
            <p>{product.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <FaShieldAlt size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">1 Year</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Warranty</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <FaTruck size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Free</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Shipping</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Buy widget (3 cols) */}
        <div className="lg:col-span-3">
          <div className="sticky top-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col h-fit">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium text-sm">Total</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{formatPrice(discountedPrice * quantity)}</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <FaTruck className="text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-slate-700 dark:text-slate-300">Delivery in <span className="font-bold text-slate-900 dark:text-white">{product.deliveryTime || '3-5 business days'}</span></p>
                  <p className="text-xs text-emerald-600 font-medium mt-1">Dispatches in 24 hours</p>
                </div>
              </div>
            </div>

            {/* Stock State */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center gap-2">
              {product.countInStock > 0 ? (
                <>
                  <FaCheckCircle className="text-emerald-500" />
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500">
                    {product.countInStock < 5 ? `Only ${product.countInStock} items left!` : 'In Stock & Ready'}
                  </span>
                </>
              ) : (
                <>
                  <FaExclamationCircle className="text-red-500" />
                  <span className="text-sm font-bold text-red-600 dark:text-red-500">Out of Stock</span>
                </>
              )}
            </div>

            {/* Actions */}
            {product.countInStock > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
                  <span className="text-sm font-medium text-slate-500 pl-3">Quantity</span>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-4 text-sm font-bold outline-none cursor-pointer text-slate-900 dark:text-white shadow-sm"
                  >
                    {[...Array(Math.min(10, product.countInStock))].map((_, x) => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>
                </div>

                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-full text-sm"
                  onClick={() => addToCart(product, quantity)}
                >
                  <FaShoppingCart /> Add to Cart
                </Button>
                
                <Button 
                  variant="accent" 
                  size="lg" 
                  className="w-full text-sm"
                  onClick={handleBuyNow}
                >
                  <FaBolt /> Buy Now
                </Button>
              </div>
            )}

            <button
              onClick={() => toggleWishlist(product)}
              className={`w-full py-3 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300
                ${isLiked 
                  ? 'border-red-500 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-500' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-red-200 hover:text-red-500 dark:hover:border-slate-600'}`}
            >
              {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
              {isLiked ? 'Saved to Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Details Tabs Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm mt-12">
        <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 no-scrollbar">
          {['description', 'reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2
                ${activeTab === tab 
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50 dark:border-blue-500 dark:text-blue-400 dark:bg-blue-900/10' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:text-slate-300 dark:hover:bg-slate-800'}`}
            >
              {tab === 'description' ? 'Full Details' : `Reviews (${product.numReviews})`}
            </button>
          ))}
        </div>
        
        <div className="p-6 md:p-10">
          {activeTab === 'description' && (
            <div className="prose prose-slate dark:prose-invert max-w-4xl mx-auto">
              <h3 className="text-xl font-bold mb-4">About {product.name}</h3>
              <p className="whitespace-pre-line leading-loose text-slate-600 dark:text-slate-400">
                {product.description}
                {'\n\n'}
                Experience premium quality with the {product.brand} {product.name}. Designed with precision and built to last, it is the perfect addition to your lifestyle.
              </p>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <ReviewSection 
              product={product} 
              userInfo={userInfo} 
              onReviewSubmit={handleReviewSubmit}
              submitting={submittingReview} 
            />
          )}
        </div>
      </div>

      {/* Similar Products Carousel */}
      {similarProducts.length > 0 && (
        <section className="pt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">You Might Also Like</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {similarProducts.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default ProductDetails;
