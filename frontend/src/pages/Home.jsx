import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFire, FaAward, FaArrowRight, FaBolt, FaStar } from 'react-icons/fa';
import { ShopContext } from '../context/ShopContext';
import { categoryCards, testimonials } from '../data/constants';
import HeroCarousel from '../components/layout/HeroCarousel';
import ProductCard from '../components/product/ProductCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const Home = () => {
  const { products, loadingProducts } = useContext(ShopContext);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Compute derived product lists
  const trendingProducts = products?.slice(0, 8) || [];
  const flashDeals = products?.filter(p => p.discount > 0).slice(0, 6) || [];
  const bestSellers = products?.slice(4, 12) || [];
  const featured = products?.slice(2, 6) || [];

  return (
    <div className="flex flex-col min-h-screen bg-amazon-grayBg dark:bg-slate-950 transition-colors">
      
      {/* 1. Hero Carousel */}
      <section className="w-full">
        <HeroCarousel />
      </section>

      <main className="flex-1 w-full max-w-[1500px] mx-auto px-4 md:px-6 py-12 space-y-20">
        
        {/* 2. Shop by Category (Horizontal Scroll) */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Shop by Category</h2>
              <p className="text-slate-500 mt-2">Explore our premium collections</p>
            </div>
          </div>
          <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-4 snap-x">
            {categoryCards.map((cat, idx) => (
              <Link 
                key={idx} 
                to={`/category/${encodeURIComponent(cat.name)}`}
                className="snap-start flex-shrink-0 w-32 sm:w-40 group"
              >
                <div className={`aspect-square rounded-3xl bg-gradient-to-br ${cat.gradient} p-1 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300`}>
                  <div className="w-full h-full bg-white/20 dark:bg-slate-900/20 backdrop-blur-md rounded-[22px] flex flex-col items-center justify-center p-4 border border-white/30 dark:border-white/10">
                    <span className="text-4xl sm:text-5xl mb-3 drop-shadow-md group-hover:scale-110 transition-transform">{cat.icon}</span>
                    <span className="text-sm font-bold text-white drop-shadow-md">{cat.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Flash Deals Section */}
        {flashDeals.length > 0 && (
          <section className="relative rounded-3xl bg-gradient-to-r from-orange-500 to-rose-500 p-1">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-[22px] p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center">
                    <FaBolt size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Flash Deals</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">Ends in:</span>
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300 font-mono">12 : 45 : 30</span>
                    </div>
                  </div>
                </div>
                <Link to="/products?sort=priceAsc" className="text-orange-600 dark:text-orange-400 font-bold text-sm hover:underline flex items-center gap-1">
                  View all deals <FaArrowRight size={12} />
                </Link>
              </div>

              {loadingProducts ? (
                <LoadingSkeleton count={4} />
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
                  {flashDeals.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* 4. Trending Products */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div className="flex items-center gap-3">
              <FaFire className="text-rose-500" size={28} />
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Trending Now</h2>
            </div>
            <Link to="/products?sort=latest" className="hidden sm:flex text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline items-center gap-1">
              Explore more <FaArrowRight size={12} />
            </Link>
          </div>

          {loadingProducts ? (
            <LoadingSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* 5. Featured Highlight */}
        {featured.length > 0 && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-blue-600 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-8 md:p-12 text-white">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase mb-4 border border-white/20">
                Premium Collection
              </span>
              <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">Elevate Your Everyday Essentials</h2>
              <p className="text-blue-100 dark:text-slate-300 mb-8 max-w-md text-lg">
                Discover our hand-picked selection of top-tier products designed for quality and longevity.
              </p>
              <Link 
                to={`/products/${featured[0]?._id}`}
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg active:scale-95"
              >
                Shop Featured
              </Link>
            </div>
            <div className="relative h-[300px] lg:h-full bg-white/10 backdrop-blur-sm p-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent lg:bg-gradient-to-l"></div>
              <img 
                src={featured[0]?.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop'} 
                alt="Featured product" 
                className="w-3/4 max-h-full object-contain drop-shadow-2xl z-10 hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          </section>
        )}

        {/* 6. Best Sellers */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div className="flex items-center gap-3">
              <FaAward className="text-amber-500" size={28} />
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Best Sellers</h2>
            </div>
          </div>

          {loadingProducts ? (
            <LoadingSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* 7. Customer Testimonials */}
        <section className="pb-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">What Our Customers Say</h2>
            <p className="text-slate-500 mt-2">Trusted by over 10,000+ shoppers worldwide</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testi, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
                <FaStar className="absolute top-8 right-8 text-slate-100 dark:text-slate-800 opacity-50" size={60} />
                <div className="flex gap-1 text-amber-500 mb-4 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={14} className={i < Math.floor(testi.rating) ? 'fill-current' : 'text-slate-200 dark:text-slate-700'} />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-8 relative z-10 font-medium leading-relaxed">
                  "{testi.text}"
                </p>
                <div className="flex items-center gap-4 relative z-10 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <img src={testi.avatar} alt={testi.name} className="w-12 h-12 rounded-full ring-2 ring-blue-100 dark:ring-blue-900" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{testi.name}</h4>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{testi.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default Home;
