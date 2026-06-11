import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const banners = [
  {
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470&auto=format&fit=crop',
    title: 'Immersive Sound Experiences',
    subtitle: 'Save up to 30% on Premium Headphones and Audio accessories.',
    link: '/category/Electronics'
  },
  {
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1470&auto=format&fit=crop',
    title: 'Step Up Your Style',
    subtitle: 'Explore new athletic designs and street style collection.',
    link: '/category/Fashion'
  },
  {
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1470&auto=format&fit=crop',
    title: 'Flagship Mobile Connections',
    subtitle: 'Trade-in and get the latest smartphone devices with ease.',
    link: '/category/Mobiles'
  },
  {
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1470&auto=format&fit=crop',
    title: 'Smarter Workspaces',
    subtitle: 'Minimalist gadgets and smart watch deals for productivity.',
    link: '/products'
  }
];

const HeroCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-[220px] sm:h-[350px] md:h-[480px] bg-slate-900 overflow-hidden">
      {/* Banner Slides */}
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background image */}
          <div className="absolute inset-0 bg-black/35 z-5"></div>
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover"
          />

          {/* Banner text overlay */}
          <div className="absolute top-1/4 left-6 sm:left-16 z-10 max-w-sm sm:max-w-md text-white select-none">
            <span className="inline-block px-3 py-1 bg-amazon-yellow text-slate-950 text-[10px] sm:text-xs font-bold rounded-full mb-3 shadow">
              LIMITED TIME OFFERS
            </span>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-md mb-2">
              {banner.title}
            </h2>
            <p className="text-xs sm:text-sm drop-shadow-md text-slate-100 mb-6">
              {banner.subtitle}
            </p>
            <Link
              to={banner.link}
              className="py-2.5 px-6 bg-gradient-to-b from-yellow-400 to-amazon-yellow text-slate-950 font-bold rounded text-xs hover:from-yellow-300 hover:to-yellow-500 shadow border border-yellow-500 transition-all duration-200"
            >
              Shop Now
            </Link>
          </div>
        </div>
      ))}

      {/* Slide Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/30 hover:bg-black/60 text-white transition-all focus:outline-none hidden sm:block"
        aria-label="Previous slide"
      >
        <FaChevronLeft size={18} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/30 hover:bg-black/60 text-white transition-all focus:outline-none hidden sm:block"
        aria-label="Next slide"
      >
        <FaChevronRight size={18} />
      </button>

      {/* Fade Overlay blending into grid content */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-amazon-grayBg dark:from-slate-950 to-transparent z-20 pointer-events-none"></div>
    </div>
  );
};

export default HeroCarousel;
