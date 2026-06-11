import React, { useState } from 'react';
import { FaExpandArrowsAlt, FaTimes } from 'react-icons/fa';

const ProductGallery = ({ images, productName }) => {
  const [activeImage, setActiveImage] = useState(images[0] || '');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Container */}
      <div className="relative aspect-square border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center p-6 group overflow-hidden">
        <img
          src={activeImage}
          alt={productName}
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-150 group-hover:cursor-zoom-in"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop';
          }}
        />
        
        {/* Fullscreen Button */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-sm hover:bg-white dark:hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
        >
          <FaExpandArrowsAlt />
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(img)}
              className={`w-20 h-20 p-2 rounded-xl bg-white dark:bg-slate-900 border-2 transition-all flex items-center justify-center overflow-hidden
                ${img === activeImage 
                  ? 'border-blue-600 dark:border-blue-500 shadow-md scale-105' 
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 opacity-70 hover:opacity-100'
                }`}
            >
              <img 
                src={img} 
                alt={`${productName} preview ${index + 1}`} 
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop';
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-4 animate-fadeIn">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <FaTimes size={24} />
          </button>
          <img
            src={activeImage}
            alt={productName}
            className="max-h-[90vh] max-w-[90vw] object-contain animate-scaleIn"
          />
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
