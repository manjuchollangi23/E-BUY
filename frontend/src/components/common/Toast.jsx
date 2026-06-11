import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <FaCheckCircle className="text-emerald-500" size={18} />,
    error: <FaExclamationCircle className="text-red-500" size={18} />,
    info: <FaInfoCircle className="text-blue-500" size={18} />
  };

  const bgs = {
    success: 'border-emerald-200 dark:border-emerald-900/50',
    error: 'border-red-200 dark:border-red-900/50',
    info: 'border-blue-200 dark:border-blue-900/50'
  };

  return (
    <div className={`fixed bottom-4 right-4 z-[100] flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl shadow-xl border ${bgs[type]} animate-toastIn max-w-sm w-full sm:w-auto`}>
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      <p className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">
        {message}
      </p>
      <button 
        onClick={onClose}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
      >
        <FaTimes size={12} />
      </button>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-slate-100 dark:bg-slate-800 w-full rounded-b-xl overflow-hidden">
        <div 
          className={`h-full ${type === 'success' ? 'bg-emerald-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}
          style={{ 
            animation: `shrink ${duration}ms linear forwards` 
          }}
        />
      </div>
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Toast;
