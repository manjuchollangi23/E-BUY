import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaShoppingBag } from 'react-icons/fa';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-amazon-dark text-slate-300 text-xs mt-auto">
      {/* Back To Top Bar */}
      <button
        onClick={scrollToTop}
        className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-center font-semibold text-white focus:outline-none transition-colors border-b border-slate-700"
      >
        Back to top
      </button>

      {/* Main Footer Links */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-sm font-bold text-white mb-4">Get to Know Us</h4>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:underline hover:text-white transition-colors">About E-BUY</Link></li>
            <li><a href="#" className="hover:underline hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:underline hover:text-white transition-colors">Press Releases</a></li>
            <li><a href="#" className="hover:underline hover:text-white transition-colors">E-BUY Science</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white mb-4">Connect with Us</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 hover:text-white transition-colors">
              <FaFacebook /> <a href="#" className="hover:underline">Facebook</a>
            </li>
            <li className="flex items-center gap-2 hover:text-white transition-colors">
              <FaTwitter /> <a href="#" className="hover:underline">Twitter</a>
            </li>
            <li className="flex items-center gap-2 hover:text-white transition-colors">
              <FaInstagram /> <a href="#" className="hover:underline">Instagram</a>
            </li>
            <li className="flex items-center gap-2 hover:text-white transition-colors">
              <FaLinkedin /> <a href="#" className="hover:underline">LinkedIn</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white mb-4">Make Money with Us</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline hover:text-white transition-colors">Sell on E-BUY</a></li>
            <li><a href="#" className="hover:underline hover:text-white transition-colors">Sell under E-BUY Accelerator</a></li>
            <li><a href="#" className="hover:underline hover:text-white transition-colors">Become an Affiliate</a></li>
            <li><a href="#" className="hover:underline hover:text-white transition-colors">Advertise Your Products</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white mb-4">Let Us Help You</h4>
          <ul className="space-y-2">
            <li><Link to="/profile" className="hover:underline hover:text-white transition-colors">Your Account</Link></li>
            <li><Link to="/orders" className="hover:underline hover:text-white transition-colors">Your Orders</Link></li>
            <li><a href="#" className="hover:underline hover:text-white transition-colors">Shipping Rates & Policies</a></li>
            <li><Link to="/contact" className="hover:underline hover:text-white transition-colors">Help Center & Support</Link></li>
          </ul>
        </div>
      </div>

      {/* Brand & Legal Info */}
      <div className="border-t border-slate-800 bg-slate-950 py-8 px-6 text-center text-[11px] text-slate-500">
        <div className="flex justify-center items-center gap-2 mb-4">
          <img
            src="https://img.icons8.com/fluency/96/shopping-cart-loaded.png"
            alt="E-BUY Logo"
            className="h-6 w-6 opacity-80"
          />
          <span className="font-bold text-sm text-slate-300">E-BUY E-Commerce</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-4 text-slate-400">
          <Link to="/about" className="hover:underline">About Us</Link>
          <Link to="/contact" className="hover:underline">Contact Support</Link>
          <a href="#" className="hover:underline">Conditions of Use</a>
          <a href="#" className="hover:underline">Privacy Notice</a>
          <a href="#" className="hover:underline">Interest-Based Ads</a>
        </div>

        <p>© 2026 E-BUY Inc. or its affiliates. All rights reserved. Designed with modern React & Tailwind CSS.</p>
      </div>
    </footer>
  );
};

export default Footer;
