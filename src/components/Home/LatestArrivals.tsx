import React, { useEffect, memo, useRef, useState, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProducts } from '../../contexts/ProductContext';
import { ProductGridSkeleton } from '../Common/ProductCardSkeleton';
import { LatestArrivalProductCard } from '../Product/LatestArrivalProductCard';
import { Link } from 'react-router-dom';

export const LatestArrivals: React.FC = memo(() => {
  const { latestProducts, latestLoading, fetchLatestProducts } = useProducts();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    fetchLatestProducts(8);
  }, [fetchLatestProducts]);

  const checkScroll = useCallback(() => {
    const c = scrollRef.current;
    if (!c) return;
    setCanScrollLeft(c.scrollLeft > 0);
    setCanScrollRight(c.scrollLeft < c.scrollWidth - c.clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    const c = scrollRef.current;
    if (!c) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { checkScroll(); ticking = false; });
    };
    c.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      c.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [latestProducts, checkScroll]);

  const scroll = (dir: 'left' | 'right') => {
    const c = scrollRef.current;
    if (!c) return;
    c.scrollBy({ left: dir === 'left' ? -c.clientWidth * 0.8 : c.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="py-16 sm:py-24 bg-[#F9F9F9] border-y border-black/[0.03]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 text-black font-bold text-[10px] uppercase tracking-[0.3em]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Just Landed
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl font-serif italic text-black"
            >
              Fresh Releases
            </motion.h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
            
            <Link to="/products?sort=latest" className="group flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-black/40 hover:text-black transition-colors">
              View All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {latestLoading ? (
          <ProductGridSkeleton count={4} variant="latest" />
        ) : latestProducts.length > 0 ? (
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-8 -mx-4 px-4 md:mx-0 md:px-0 snap-x"
          >
            {latestProducts.map((product, idx) => (
              <div key={product.id} className="flex-shrink-0 w-[220px] sm:w-[240px] md:w-[270px] snap-start">
                <LatestArrivalProductCard product={product} index={idx} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-black/[0.03]">
            <Sparkles className="h-10 w-10 text-black/10 mx-auto mb-6" />
            <h3 className="text-black text-xl font-black uppercase tracking-widest">Awaiting Arrivals</h3>
            <p className="text-black/30 font-medium mt-2">The next collection is currently in transit.</p>
          </div>
        )}
      </div>
    </section>
  );
});

LatestArrivals.displayName = 'LatestArrivals';
export default LatestArrivals;
