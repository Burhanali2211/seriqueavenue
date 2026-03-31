import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&q=75&auto=format',
    title: 'Artisan Woven Bags',
    subtitle: 'Handcrafted with love · Sustainable materials',
    cta: 'Shop Bags',
    ctaLink: '/products?category=woven-bags',
    accent: 'from-primary-900/80 to-transparent',
  },
  {
    image: 'https://images.unsplash.com/photo-1591084728795-1149f32d9866?w=1200&q=75&auto=format',
    title: 'Organic Storage Baskets',
    subtitle: 'Natural willow & straw · Home organization',
    cta: 'Explore Baskets',
    ctaLink: '/products?category=handmade-baskets',
    accent: 'from-secondary-900/80 to-transparent',
  },
  {
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=1200&q=75&auto=format',
    title: 'The Woolen Collection',
    subtitle: 'Soft textures · Handcrafted excellence',
    cta: 'View Woolens',
    ctaLink: '/products?category=woolen-items',
    accent: 'from-neutral-900/80 to-transparent',
  },
];

export const Hero: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (transitioning || index === current) return;
    setTransitioning(true);
    setCurrent(index);
    setTimeout(() => setTransitioning(false), 400);
  }, [current, transitioning]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section className="relative w-full h-[280px] sm:h-[360px] md:h-[480px] lg:h-[580px] xl:h-[640px] overflow-hidden bg-stone-100">
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            aria-hidden={i !== current}
          >
            <img
              src={slide.image}
              alt={slide.title}
              loading={i === 0 ? 'eager' : 'lazy'}
              className={`w-full h-full object-cover transition-transform duration-[4000ms] ease-out ${i === current ? 'scale-105' : 'scale-100'}`}
            />
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent} mix-blend-multiply opacity-60`} />
            <div className="absolute inset-0 bg-black/20" />

            {/* Content Container */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                <div className="max-w-xl">
                  <div className={`transition-all duration-700 delay-300 transform ${i === current ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <p className="text-white/90 text-xs sm:text-sm md:text-base font-medium tracking-widest uppercase mb-2">
                      {slide.subtitle}
                    </p>
                    <h2 className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] mb-6 drop-shadow-lg">
                      {slide.title}
                    </h2>
                    <Link
                      to={slide.ctaLink}
                      className="inline-flex items-center gap-3 bg-white text-stone-900 hover:bg-stone-100 text-sm sm:text-base font-bold px-8 py-3.5 sm:py-4 rounded-xl transition-all shadow-xl hover:scale-105 active:scale-95"
                    >
                      {slide.cta}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Contained within max-w-7xl boundary for better desktop feel */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="max-w-[1440px] mx-auto h-full relative px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button 
            onClick={prev} 
            className="pointer-events-auto p-3 sm:p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition-all border border-white/20 group translate-x-0"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:-translate-x-1" />
          </button>
          <button 
            onClick={next} 
            className="pointer-events-auto p-3 sm:p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition-all border border-white/20 group"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Modern Progress Dots */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'w-10 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
