import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import { ShopContext } from '../context/ShopContext';
import Button from '../components/ui/Button';
import EmptyState from '../components/common/EmptyState';
import { formatPrice } from '../utils/formatPrice';
import useScrollTop from '../hooks/useScrollTop';

const Cart = () => {
  useScrollTop();
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateCartQty, itemsPrice, shippingPrice, taxPrice, totalPrice } = useContext(ShopContext);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-12 md:py-20 min-h-screen">
        <EmptyState 
          icon={FaShoppingCart}
          title="Your cart is empty"
          description="Looks like you haven't added any premium products to your cart yet."
          actionText="Start Shopping"
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-8 lg:py-12 bg-amazon-grayBg dark:bg-slate-950 transition-colors min-h-screen">
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Shopping Cart</h1>
        <span className="text-sm font-bold text-slate-500 bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800">
          {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
            
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <div className="col-span-6">Product Details</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Items */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {cartItems.map((item) => {
                const discountedPrice = item.price * (1 - item.discount / 100);
                
                return (
                  <div key={item.product} className="p-6 flex flex-col md:grid md:grid-cols-12 gap-6 items-center group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    
                    {/* Product Info */}
                    <div className="col-span-6 flex items-center gap-6 w-full">
                      <Link to={`/products/${item.product}`} className="flex-shrink-0 w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl p-2">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform" 
                        />
                      </Link>
                      <div className="flex-1">
                        <Link to={`/products/${item.product}`} className="text-sm md:text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2 transition-colors">
                          {item.name}
                        </Link>
                        {item.discount > 0 && (
                          <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 rounded">
                            {item.discount}% OFF
                          </span>
                        )}
                        <button 
                          onClick={() => removeFromCart(item.product)}
                          className="flex items-center gap-1 mt-3 text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                        >
                          <FaTrash /> Remove
                        </button>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-2 flex justify-center w-full md:w-auto mt-4 md:mt-0">
                      <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <button 
                          onClick={() => updateCartQty(item.product, item.qty - 1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-slate-900 dark:text-white">
                          {item.qty}
                        </span>
                        <button 
                          onClick={() => updateCartQty(item.product, item.qty + 1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="col-span-2 text-right hidden md:block">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{formatPrice(discountedPrice)}</span>
                      {item.discount > 0 && (
                        <p className="text-[10px] text-slate-400 line-through mt-0.5">{formatPrice(item.price)}</p>
                      )}
                    </div>

                    {/* Total Price */}
                    <div className="col-span-2 flex justify-between md:justify-end items-center w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-slate-100 md:border-t-0 dark:border-slate-800">
                      <span className="md:hidden text-sm font-bold text-slate-500">Total:</span>
                      <span className="text-base font-black text-blue-600 dark:text-blue-400">{formatPrice(discountedPrice * item.qty)}</span>
                    </div>

                  </div>
                );
              })}
            </div>
            
            {/* Footer */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Link to="/products" className="text-sm font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                &larr; Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm sticky top-24">
            
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Subtotal ({cartItems.length} items)</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatPrice(itemsPrice)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Estimated Shipping</span>
                <span className="font-bold text-emerald-600">{shippingPrice === 0 ? 'Free' : formatPrice(shippingPrice)}</span>
              </div>
              <div className="flex justify-between items-center text-sm pb-4 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 font-medium">Estimated Tax (8.5%)</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatPrice(taxPrice)}</span>
              </div>
              
              <div className="flex justify-between items-end pt-2">
                <span className="text-base font-bold text-slate-900 dark:text-white">Order Total</span>
                <span className="text-3xl font-black text-blue-600 dark:text-blue-400 leading-none">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <Button 
              onClick={() => navigate('/checkout')}
              variant="primary" 
              size="lg" 
              className="w-full flex items-center justify-center gap-2 mt-8 shadow-blue-500/30"
            >
              Proceed to Checkout <FaArrowRight />
            </Button>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
              <FaShieldAlt className="text-emerald-500" size={16} />
              Secure Checkout Guarantee
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
