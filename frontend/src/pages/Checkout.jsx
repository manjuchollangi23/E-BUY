import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaLock, FaCheckCircle, FaMoneyBillWave } from 'react-icons/fa';
import { ShopContext } from '../context/ShopContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { formatPrice } from '../utils/formatPrice';
import useScrollTop from '../hooks/useScrollTop';

const Checkout = () => {
  useScrollTop();
  const navigate = useNavigate();
  const { cartItems, userInfo, itemsPrice, shippingPrice, taxPrice, totalPrice, placeOrder, showToast } = useContext(ShopContext);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: userInfo?.name || '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  // Prevent accessing checkout with empty cart
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price * (1 - item.discount / 100),
          product: item.product
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      };

      const result = await placeOrder(orderData);
      navigate(`/orders?success=${result._id}`);
    } catch (err) {
      showToast('Error placing order', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) return null;

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 lg:py-12 bg-amazon-grayBg dark:bg-slate-950 transition-colors min-h-screen">
      
      {/* Checkout Progress Tracker */}
      <div className="mb-10 max-w-2xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full -z-10"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full -z-10 transition-all duration-500" style={{ width: step === 1 ? '0%' : '100%' }}></div>
          
          <div className="flex flex-col items-center gap-2 bg-amazon-grayBg dark:bg-slate-950 px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 text-sm transition-colors
              ${step >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400'}`}>
              {step > 1 ? <FaCheckCircle /> : '1'}
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${step >= 1 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Shipping</span>
          </div>

          <div className="flex flex-col items-center gap-2 bg-amazon-grayBg dark:bg-slate-950 px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 text-sm transition-colors
              ${step >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400'}`}>
              2
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${step >= 2 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Payment</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Step 1: Shipping Address */}
          {step === 1 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm animate-fadeIn">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Delivery Information</h2>
              <form onSubmit={handleShippingSubmit} className="space-y-5">
                <Input 
                  label="Full Name"
                  required
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  placeholder="John Doe"
                />
                <Input 
                  label="Address Line"
                  required
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                  placeholder="123 Main Street, Apt 4B"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input 
                    label="City"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  />
                  <Input 
                    label="Postal Code"
                    required
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                  />
                </div>
                <Input 
                  label="Country"
                  required
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                />
                <div className="pt-4 flex justify-end">
                  <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto px-8">
                    Continue to Payment
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Shipping Summary */}
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Ship To</h3>
                  <p className="text-base font-bold text-slate-900 dark:text-white">{shippingAddress.fullName}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {shippingAddress.address}, {shippingAddress.city}<br />
                    {shippingAddress.postalCode}, {shippingAddress.country}
                  </p>
                </div>
                <button onClick={() => setStep(1)} className="text-sm font-bold text-blue-600 hover:underline">Edit</button>
              </div>

              {/* Payment Selection */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <FaLock className="text-slate-400" size={20} /> Payment Method
                </h2>
                
                <div className="space-y-4">
                  {/* PayPal Option */}
                  <label className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'PayPal' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="PayPal" 
                      checked={paymentMethod === 'PayPal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <div className="ml-4 flex items-center gap-3">
                      <FaCreditCard className="text-slate-500" size={24} />
                      <div>
                        <span className="block font-bold text-slate-900 dark:text-white">Credit Card / PayPal</span>
                        <span className="text-xs font-medium text-slate-500">Fast and secure</span>
                      </div>
                    </div>
                  </label>

                  {/* COD Option */}
                  <label className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'CashOnDelivery' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="CashOnDelivery" 
                      checked={paymentMethod === 'CashOnDelivery'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <div className="ml-4 flex items-center gap-3">
                      <FaMoneyBillWave className="text-emerald-500" size={24} />
                      <div>
                        <span className="block font-bold text-slate-900 dark:text-white">Cash on Delivery (COD)</span>
                        <span className="text-xs font-medium text-slate-500">Pay when you receive the order</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm sticky top-24">
            
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Order Summary</h3>
            
            {/* Items Mini List */}
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item) => (
                <div key={item.product} className="flex gap-3">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-xl p-1.5 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Qty: {item.qty}</p>
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1">{formatPrice(item.price * (1 - item.discount / 100))}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="space-y-3 py-4 border-y border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Items</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatPrice(itemsPrice)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Shipping</span>
                <span className="font-bold text-emerald-600">{shippingPrice === 0 ? 'Free' : formatPrice(shippingPrice)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Tax</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatPrice(taxPrice)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 mb-6">
              <span className="text-base font-bold text-slate-900 dark:text-white">Total</span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{formatPrice(totalPrice)}</span>
            </div>

            {step === 2 && (
              <Button 
                onClick={handlePlaceOrder}
                loading={loading}
                variant="primary" 
                size="lg" 
                className="w-full"
              >
                Place Order & Pay
              </Button>
            )}
            
            {step === 1 && (
              <p className="text-xs text-center font-medium text-slate-400 mt-4">
                Please complete your shipping address to continue.
              </p>
            )}

            <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <FaLock className="text-emerald-500" /> Secure 256-bit encrypted connection
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
