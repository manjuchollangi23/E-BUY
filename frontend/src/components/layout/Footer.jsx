import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaCreditCard, FaPaypal, FaApple, FaGoogle } from 'react-icons/fa';
import Button from '../ui/Button';
import Input from '../ui/Input';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto overflow-hidden">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-slate-800 dark:to-slate-900 py-12 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-400 opacity-10 blur-3xl pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h3 className="text-2xl md:text-3xl font-black text-white mb-4">Join our newsletter</h3>
          <p className="text-blue-100 dark:text-slate-300 text-sm md:text-base mb-8 max-w-2xl mx-auto">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals delivered right to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
            <div className="flex-1">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full px-5 py-3.5 rounded-xl border-none outline-none focus:ring-4 focus:ring-blue-400/50 text-slate-900 text-sm shadow-inner transition-all"
                required
              />
            </div>
            <button 
              type="submit" 
              className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all active:scale-[0.98]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1500px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        
        {/* Brand Info */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-md">
              <img src="https://img.icons8.com/color/48/shop.png" alt="E-BUY Logo" className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">E-BUY</span>
          </Link>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Your premium destination for modern electronics, fashion, and everyday essentials. Experience shopping reimagined.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors shadow-sm">
              <FaFacebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 transition-colors shadow-sm">
              <FaTwitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-pink-600 hover:text-white dark:hover:bg-pink-600 transition-colors shadow-sm">
              <FaInstagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 transition-colors shadow-sm">
              <FaYoutube size={18} />
            </a>
          </div>
        </div>

        {/* Links Column 1 */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider">Company</h4>
          <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
            <li><Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link></li>
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Store Locations</a></li>
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Our Blog</a></li>
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Reviews</a></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider">Help Center</h4>
          <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
            <li><Link to="/profile" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Your Account</Link></li>
            <li><Link to="/orders" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Track Order</Link></li>
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Returns & Exchanges</a></li>
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Shipping Info</a></li>
            <li><Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider">Contact Us</h4>
          <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
            <li className="flex items-start gap-3">
              <FaEnvelope className="mt-1 text-blue-600 dark:text-blue-400" />
              <span>support@ebuy.com</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-4 h-4 rounded-full border-2 border-blue-600 dark:border-blue-400 mt-0.5"></div>
              <span>1-800-EBUY-SHOP<br/><span className="text-xs text-slate-400">(Mon-Fri: 9AM - 8PM)</span></span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-6">
        <div className="max-w-[1500px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} E-BUY Inc. All rights reserved. Designed with ❤️
          </div>
          
          <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
            <FaCreditCard size={24} className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors" />
            <FaPaypal size={24} className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors" />
            <FaApple size={24} className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors" />
            <FaGoogle size={24} className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors" />
          </div>

          <button 
            onClick={scrollToTop}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
