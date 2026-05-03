import React, { useEffect, memo } from 'react';
import { Star, TrendingUp, ArrowRight, Flame, Tag, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProducts } from '../../contexts/ProductContext';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthModal } from '../../contexts/AuthModalContext';
import { BuyNowButton } from '../Product/BuyNowButton';

export const BestSellers: React.FC = memo(() => {
  const { bestSellers, bestSellersLoading, fetchBestSellers } = useProducts();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { showAuthModal } = useAuthModal();

  useEffect(() => {
    fetchBestSellers(1);
  }, [fetchBestSellers]);

  if (bestSellersLoading || bestSellers.length === 0) return null;

  const product = bestSellers[0];
  const image = product.images?.[0] || '';
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;
  const savings = hasDiscount ? product.originalPrice! - product.price : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { showAuthModal(product, 'cart'); return; }
    addItem(product, 1);
  };

  return (
    <section className="py-16 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-3">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 text-stone-400 font-bold text-[10px] uppercase tracking-[0.3em]"
            >
              <TrendingUp className="h-3 w-3" />
              The Spotlight
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-6xl font-serif italic text-black leading-tight"
            >
              Curated Essentials
            </motion.h2>
            <p className="text-stone-400 text-sm font-medium">Exceptional artisanal pieces handpicked for your space.</p>
          </div>

          <Link
            to="/products?sort=best_sellers"
            className="group flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-black/40 hover:text-black transition-colors"
          >
            Discover More <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Card container — Spotilight Editorial Feel */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative group rounded-[2rem] bg-stone-50 border border-stone-100 shadow-sm overflow-hidden"
        >
          <div className="flex flex-row lg:flex-row min-h-[300px] sm:min-h-[450px]">

            {/* ── LEFT: Product image ── */}
            <div className="relative w-[35%] sm:w-[45%] aspect-square sm:aspect-auto overflow-hidden border-r border-stone-100 bg-white">
              <Link to={`/products/${product.id}`} className="block h-full w-full">
                {image ? (
                  <img
                    src={image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-stone-300" />
                  </div>
                )}
              </Link>

              {/* Discount badge - Refined for mobile */}
              {hasDiscount && (
                <div className="absolute top-2 left-2 sm:top-8 sm:left-8">
                  <div className="bg-white/90 backdrop-blur-md text-black text-[8px] sm:text-xs font-bold px-2 py-0.5 sm:px-4 sm:py-2 rounded-full shadow-sm">
                    -{discountPct}%
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT: Info + actions ── */}
            <div className="flex flex-col flex-1 p-3.5 sm:p-12 lg:p-16 justify-center">

              {/* 1. Category & Trust - Refined */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 mb-2 sm:mb-8">
                <span className="inline-flex items-center gap-1 text-amber-600 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider">
                  <Flame className="h-2.5 w-2.5 fill-amber-600" />
                  Trending
                </span>
                {product.category && (
                  <span className="text-[8px] sm:text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                    • {product.category}
                  </span>
                )}
              </div>

              {/* 2. Product name - Refined hierarchy */}
              <Link to={`/products/${product.id}`} className="block mb-2 sm:mb-6">
                <h3 className="text-lg sm:text-4xl md:text-5xl font-serif italic text-black leading-tight hover:text-stone-600 transition-colors line-clamp-2 sm:line-clamp-1">
                  {product.name}
                </h3>
              </Link>

              {/* 3. Rating - Simplified for mobile */}
              {product.rating > 0 && (
                <div className="flex items-center gap-1.5 mb-3 sm:mb-10 pb-3 sm:pb-10 border-b border-stone-100">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        className={`h-2.5 w-2.5 sm:h-4 sm:w-4 ${s <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-stone-200 text-stone-200'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[8px] sm:text-sm font-bold text-black">{product.rating.toFixed(1)}</span>
                </div>
              )}

              {/* 4. Price & Savings - Refined */}
              <div className="mb-4 sm:mb-10">
                <div className="flex items-baseline gap-2 sm:gap-4 mb-0.5 sm:mb-2">
                  <span className="text-xl sm:text-4xl md:text-5xl font-bold text-black">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-[10px] sm:text-xl text-stone-300 line-through font-medium">
                      ₹{product.originalPrice!.toLocaleString()}
                    </span>
                  )}
                </div>
                {hasDiscount && (
                  <div className="flex items-center gap-1 text-amber-600">
                    <Tag className="h-2.5 w-2.5 sm:h-4 sm:w-4" />
                    <span className="text-[7px] sm:text-xs font-bold uppercase tracking-widest">Save ₹{savings.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* 5. CTAs - Refined for mobile */}
              <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-auto">
                <div className="flex-1">
                  <BuyNowButton
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  />
                </div>
                <Link
                  to={`/products/${product.id}`}
                  className="px-4 py-2 sm:px-8 sm:py-4 rounded-lg sm:rounded-2xl border border-stone-200 hover:border-black hover:bg-black hover:text-white text-black font-bold text-[8px] sm:text-sm tracking-widest uppercase transition-all duration-300 text-center flex items-center justify-center"
                >
                  Details
                </Link>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
});

BestSellers.displayName = 'BestSellers';
export default BestSellers;
