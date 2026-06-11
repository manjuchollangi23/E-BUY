import React from 'react';
import { Link } from 'react-router-dom';
import { FaBoxes, FaShippingFast, FaShieldAlt, FaComments } from 'react-icons/fa';

const About = () => {
  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8 bg-amazon-grayBg dark:bg-slate-950 transition-colors min-h-screen text-slate-800 dark:text-slate-100">
      
      {/* Intro section */}
      <section className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-xl md:text-3xl font-extrabold mb-3">About E-BUY</h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Launched in 2026, E-BUY is a leading global e-commerce destination inspired by premium shopping standards. 
          We connect millions of buyers with modern products across electronics, fashion, home essentials, and gaming.
        </p>
      </section>

      {/* Grid: Pillars */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {[
          { title: 'Curated Selections', text: 'We vet and test every item in our inventory to ensure premium standards and lasting quality.', icon: FaBoxes, color: 'text-amber-500' },
          { title: 'Superfast Shipping', text: 'Free standard delivery on orders over $100. Trade routes guarantee shipping in 1-2 days.', icon: FaShippingFast, color: 'text-sky-500' },
          { title: 'Secure Transactions', text: 'Checkout screens leverage full Stripe Elements mocks ensuring SSL security encryption.', icon: FaShieldAlt, color: 'text-emerald-500' },
          { title: 'Customer Support', text: 'We offer 24/7 client care channels addressing inquiries on status, shipping, or refunds.', icon: FaComments, color: 'text-indigo-500' }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl p-5 shadow-sm flex gap-4">
              <div className={`p-3 bg-slate-50 dark:bg-slate-950 rounded-lg h-fit ${item.color}`}>
                <Icon size={22} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-normal">{item.text}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Story & milestones section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-805 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-850 dark:text-white border-b pb-2.5 border-slate-100 dark:border-slate-800">Our Operational Milestone</h3>
        
        <div className="space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-light">
          <p>
            At E-BUY, our goal is to build the web's most customer-centric shopping portal. 
            We strive to provide consumers with the lowest possible prices, the best available selections, and the utmost convenience.
          </p>
          <p>
            Starting from a small technology workshop in Seattle, our engineers developed a database-agnostic backend API 
            that operates flawlessly across local JSON files and MongoDB instances. 
            This allows us to maintain 100% database uptime, providing high resiliency even during local database downtime.
          </p>
        </div>

        <div className="pt-4 flex justify-center">
          <Link
            to="/products"
            className="py-2.5 px-8 bg-amazon-yellow hover:bg-amber-500 text-slate-950 text-xs font-bold rounded border border-yellow-500 shadow-sm transition-all"
          >
            Browse Store Collections
          </Link>
        </div>
      </section>

    </div>
  );
};

export default About;
