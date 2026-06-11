import React, { useContext, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaFilter, FaStar, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { ShopContext } from '../context/ShopContext';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/ui/Button';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/ui/Badge';
import useScrollTop from '../hooks/useScrollTop';

const Products = ({ categoryName }) => {
  useScrollTop();

  const {
    products,
    totalPages,
    totalProducts,
    loadingProducts,
    categories,
    brands,
    fetchProducts
  } = useContext(ShopContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamVal = searchParams.get('search') || '';
  const categoryParamVal = categoryName || searchParams.get('category') || '';
  const sortParamVal = searchParams.get('sort') || 'latest';

  const [selectedCategory, setSelectedCategory] = useState(categoryParamVal);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [ratingMin, setRatingMin] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sort, setSort] = useState(sortParamVal);
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setSelectedCategory(categoryParamVal);
    setPage(1);
  }, [categoryParamVal]);

  useEffect(() => {
    setPage(1);
  }, [searchParamVal]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const filterQuery = {
      page,
      limit: 12,
      sort,
      search: searchParamVal
    };

    if (selectedCategory) filterQuery.category = selectedCategory;
    if (selectedBrand) filterQuery.brand = selectedBrand;
    if (priceMin) filterQuery.priceMin = priceMin;
    if (priceMax) filterQuery.priceMax = priceMax;
    if (ratingMin) filterQuery.ratingMin = ratingMin;

    fetchProducts(filterQuery);
    
    const params = {};
    if (searchParamVal) params.search = searchParamVal;
    if (selectedCategory) params.category = selectedCategory;
    if (sort !== 'latest') params.sort = sort;
    setSearchParams(params);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedBrand, ratingMin, sort, page, searchParamVal]);

  const handlePriceApply = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts({
      page: 1, limit: 12, sort, search: searchParamVal,
      category: selectedCategory, brand: selectedBrand,
      priceMin, priceMax, ratingMin
    });
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceMin('');
    setPriceMax('');
    setRatingMin('');
    setSort('latest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-6 lg:py-10 bg-amazon-grayBg dark:bg-slate-950 transition-colors min-h-screen">
      
      {/* Breadcrumb Navigation */}
      <nav className="text-xs md:text-sm text-slate-500 mb-6 flex items-center gap-2 select-none font-medium">
        <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <span className="text-slate-900 dark:text-white">Shop</span>
        {searchParamVal && (
          <>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-blue-600 dark:text-blue-400">Search: "{searchParamVal}"</span>
          </>
        )}
      </nav>

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {searchParamVal ? `Search results for "${searchParamVal}"` : selectedCategory ? `${selectedCategory}` : 'All Products'}
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Showing {(page - 1) * 12 + 1}-{Math.min(page * 12, totalProducts)} of {totalProducts} items</p>
        </div>

        {/* Sorting & Filter Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 text-sm font-bold shadow-sm md:hidden hover:bg-slate-50 transition-colors"
          >
            <FaFilter /> Filters
          </button>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1 shadow-sm">
            <span className="text-sm font-bold text-slate-500 pl-2 hidden sm:block">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="py-1.5 px-2 bg-transparent text-sm font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
            >
              <option value="latest">Newest Arrivals</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="bestSelling">Avg. Customer Review</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Left: Filters Sidebar (Desktop) */}
        <aside className="hidden md:block w-64 flex-shrink-0 space-y-8">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <FaFilter className="text-blue-500" /> Filters
            </h3>
            <button onClick={handleResetFilters} className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors">
              Reset All
            </button>
          </div>

          {/* Active Filters display */}
          {(selectedCategory || selectedBrand || priceMin || priceMax || ratingMin) && (
            <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
              {selectedCategory && (
                <Badge variant="info" pill className="flex items-center gap-1 pr-1 cursor-pointer" onClick={() => setSelectedCategory('')}>
                  {selectedCategory} <FaTimes />
                </Badge>
              )}
              {selectedBrand && (
                <Badge variant="info" pill className="flex items-center gap-1 pr-1 cursor-pointer" onClick={() => setSelectedBrand('')}>
                  {selectedBrand} <FaTimes />
                </Badge>
              )}
              {ratingMin && (
                <Badge variant="warning" pill className="flex items-center gap-1 pr-1 cursor-pointer" onClick={() => setRatingMin('')}>
                  {ratingMin}+ Stars <FaTimes />
                </Badge>
              )}
            </div>
          )}

          {/* Category Filter */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Categories</h4>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => { setSelectedCategory(''); setPage(1); }}
                className={`text-left text-sm py-1.5 px-3 rounded-lg font-medium transition-all ${!selectedCategory ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setPage(1); }}
                  className={`text-left text-sm py-1.5 px-3 rounded-lg font-medium transition-all ${selectedCategory === cat ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          {brands.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Brands</h4>
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {brands.map((br) => (
                  <label key={br} className="flex items-center gap-3 py-1.5 px-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedBrand === br}
                      onChange={() => { setSelectedBrand(selectedBrand === br ? '' : br); setPage(1); }}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-colors"
                    />
                    <span className={`text-sm font-medium transition-colors ${selectedBrand === br ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>{br}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price Range */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Price Range</h4>
            <form onSubmit={handlePriceApply} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  placeholder="Min"
                  className="w-full text-sm p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg outline-none focus:border-blue-500"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  placeholder="Max"
                  className="w-full text-sm p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <Button type="submit" variant="secondary" size="sm" className="w-full">Apply Price</Button>
            </form>
          </div>

          {/* Rating Filter */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Customer Rating</h4>
            <div className="flex flex-col gap-2">
              {[4, 3, 2].map((stars) => (
                <button
                  key={stars}
                  onClick={() => { setRatingMin(stars); setPage(1); }}
                  className={`flex items-center gap-2 text-sm p-2 rounded-lg transition-all ${Number(ratingMin) === stars ? 'bg-amber-50 dark:bg-amber-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} size={14} className={i < stars ? 'fill-current' : 'text-slate-200 dark:text-slate-700'} />
                    ))}
                  </div>
                  <span className={`font-medium ${Number(ratingMin) === stars ? 'text-amber-700 dark:text-amber-500' : 'text-slate-600 dark:text-slate-400'}`}>& Up</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right: Products Grid */}
        <main className="flex-1">
          {loadingProducts ? (
            <LoadingSkeleton count={9} />
          ) : products.length === 0 ? (
            <EmptyState 
              icon={FaFilter}
              title="No products found"
              description="Try adjusting your filters or search terms to find what you're looking for."
              actionText="Clear all filters"
              actionLink="#"
            />
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12 mb-8">
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-700 dark:text-slate-300"
                    >
                      <FaChevronLeft size={14} />
                    </button>
                    
                    <div className="flex gap-1">
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setPage(index + 1)}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                            page === index + 1
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                      className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-700 dark:text-slate-300"
                    >
                      <FaChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)}></div>
          
          <div className="relative w-80 max-w-[85vw] bg-white dark:bg-slate-900 h-full shadow-2xl p-6 overflow-y-auto animate-slideRight ml-auto">
            <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <FaFilter className="text-blue-500" /> Filters
              </h3>
              <button onClick={() => setShowMobileFilters(false)} className="text-slate-400 hover:text-red-500 bg-slate-100 dark:bg-slate-800 p-2 rounded-full">
                <FaTimes size={16} />
              </button>
            </div>

            <div className="space-y-8">
              {/* Similar filter sections as desktop, styled for mobile... */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Category</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={!selectedCategory ? 'info' : 'default'} 
                    className="cursor-pointer" 
                    onClick={() => { setSelectedCategory(''); setPage(1); }}
                  >
                    All
                  </Badge>
                  {categories.map((cat) => (
                    <Badge 
                      key={cat} 
                      variant={selectedCategory === cat ? 'info' : 'default'} 
                      className="cursor-pointer"
                      onClick={() => { setSelectedCategory(cat); setPage(1); }}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              {brands.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Brand</h4>
                  <div className="flex flex-col gap-2">
                    {brands.map((br) => (
                      <label key={br} className="flex items-center gap-3 py-1 cursor-pointer">
                        <input type="checkbox" checked={selectedBrand === br} onChange={() => { setSelectedBrand(selectedBrand === br ? '' : br); setPage(1); }} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{br}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Price Range</h4>
                <form onSubmit={handlePriceApply} className="flex items-center gap-2">
                  <input type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="Min" className="w-full text-sm p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg outline-none" />
                  <span className="text-slate-400">-</span>
                  <input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="Max" className="w-full text-sm p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg outline-none" />
                  <Button type="submit" variant="secondary" size="sm">Go</Button>
                </form>
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <Button variant="primary" className="w-full" onClick={() => setShowMobileFilters(false)}>Show Results</Button>
                <Button variant="outline" className="w-full" onClick={() => { handleResetFilters(); setShowMobileFilters(false); }}>Clear All Filters</Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Products;
