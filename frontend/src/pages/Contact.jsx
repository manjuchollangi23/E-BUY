import React, { useState, useContext } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaQuestionCircle, FaPaperPlane } from 'react-icons/fa';
import { ShopContext } from '../context/ShopContext';

const Contact = () => {
  const { showToast } = useContext(ShopContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      showToast('Your message has been sent to our customer care team!', 'success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setSending(false);
    }, 1500);
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8 bg-amazon-grayBg dark:bg-slate-950 transition-colors min-h-screen text-slate-800 dark:text-slate-100">
      <h2 className="text-xl md:text-2xl font-bold text-center mb-2">Contact Customer Support</h2>
      <p className="text-xs text-slate-500 text-center mb-8">We are available 24/7. Get in touch with us regarding orders, shipping, or refunds.</p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Side: Contact details (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold border-b pb-2 border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <FaQuestionCircle className="text-amber-500" /> Support Channels
            </h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-950/20 text-amber-600 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                  <FaPhone size={12} />
                </div>
                <div>
                  <h4 className="font-bold">Phone Hotline</h4>
                  <p className="text-slate-500 mt-0.5">1-800-EBUY-NOW (1-800-328-9669)</p>
                  <p className="text-[10px] text-slate-400">Monday - Sunday, 24 Hours</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 bg-sky-100 dark:bg-sky-950/20 text-sky-600 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                  <FaEnvelope size={12} />
                </div>
                <div>
                  <h4 className="font-bold">Email Support</h4>
                  <p className="text-slate-500 mt-0.5">support@ebuy.com</p>
                  <p className="text-[10px] text-slate-400">Response within 12 hours</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt size={12} />
                </div>
                <div>
                  <h4 className="font-bold">Corporate Headquarters</h4>
                  <p className="text-slate-500 mt-0.5">410 Terry Ave N, Seattle, WA 98109</p>
                  <p className="text-[10px] text-slate-400">United States</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="bg-slate-200 dark:bg-slate-800 h-48 rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden flex flex-col justify-center items-center relative text-center px-4">
            <FaMapMarkerAlt className="text-red-500 animate-bounce mb-2" size={24} />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Seattle HQ Map Placeholder</p>
            <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-1">Interactive mapping systems loaded on deployment.</p>
          </div>
        </div>

        {/* Right Side: Message form (7 cols) */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-805 rounded-xl p-5 sm:p-6 shadow-sm">
          <h3 className="text-sm font-bold border-b pb-2 border-slate-105 dark:border-slate-800 mb-4 flex items-center gap-2">
            <FaEnvelope className="text-amber-500" /> Send a Support Query
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Your Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="amazon-input"
                required
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="amazon-input"
                required
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Inquiry about order status"
                className="amazon-input"
                required
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Message Content</label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your query in detail..."
                className="amazon-input leading-relaxed"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="amazon-btn-primary w-full font-bold py-2 shadow flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <FaPaperPlane size={11} /> {sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
