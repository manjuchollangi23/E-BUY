import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { heroBanners } from '../../data/constants';
import Button from '../ui/Button';

const HeroCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [activeIndex, isHovered]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? heroBanners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === heroBanners.length - 1 ? 0 : prev + 1));
  };

  return (
    <div 
      className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-slate-900 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Banner Slides */}
      {heroBanners.map((banner, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background image with gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent z-[1]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-[1]"></div>
          <img
            src={banner.image}
            alt={banner.title}
            className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${index === activeIndex ? 'scale-110' : 'scale-100'}`}
          />

          {/* Text Content */}
          <div className="absolute inset-0 z-10 flex items-center">
            <div className="max-w-[1500px] w-full mx-auto px-6 md:px-12">
              <div className="max-w-xl animate-fadeInUp">
                <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold rounded-full mb-4 backdrop-blur-sm uppercase tracking-widest">
                  Featured Collection
                </span>
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4 leading-[1.1]">
                  {banner.title}
                </h2>
                <p className="text-sm sm:text-lg text-slate-300 mb-8 max-w-md font-medium leading-relaxed">
                  {banner.subtitle}
                </p>
                <Link to={banner.link}>
                  <Button variant="primary" size="lg" className="w-full sm:w-auto px-8">
                    Shop Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className={`absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white transition-all focus:outline-none hidden sm:block ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
        aria-label="Previous slide"
      >
        <FaChevronLeft size={20} />
      </button>
      <button
        onClick={handleNext}
        className={`absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white transition-all focus:outline-none hidden sm:block ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
        aria-label="Next slide"
      >
        <FaChevronRight size={20} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-3">
        {heroBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              index === activeIndex 
                ? 'w-8 h-2 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
