import React, { Suspense, lazy, memo, useMemo, useState, useEffect } from 'react';
import { Hero } from '@/components/Home/Hero';
import { CategoryChips } from '@/components/Home/CategoryChips';
import { FlashSale } from '@/components/Home/FlashSale';
import { BestSellers } from '@/components/Home/BestSellers';
import { useProducts } from '@/contexts/ProductContext';
import { ProfessionalLoader } from '@/components/Common/ProfessionalLoader';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Headphones, ArrowUpRight, Leaf } from 'lucide-react';
import { HomepageProductCard } from '@/components/Product/HomepageProductCard';

const FeaturedProducts = lazy(() => import('@/components/Home/FeaturedProducts'));
const LatestArrivals = lazy(() => import('@/components/Home/LatestArrivals'));

const SectionLoader = memo(() => (
  <div className="py-6 bg-white">
    <div className="max-w-7xl mx-auto px-4"><ProfessionalLoader fullPage={false} /></div>
  </div>
));
SectionLoader.displayName = 'SectionLoader';

/* ─── Deal Tiles: Bento layout ─── */
const BENTO_TILES = [
  {
    to: '/products?category=woven-bags',
    img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=75',
    overlay: 'bg-gradient-to-r from-black/80 via-black/30 to-transparent',
    tag: 'Trending Now',
    title: 'Artisan Woven Bags',
    sub: 'Sustainable jute & cotton craft',
    wide: true,
  },
  {
    to: '/products?category=handmade-baskets',
    img: 'https://media.glamourmagazine.co.uk/photos/65f0598dc78787fc9cc35f44/1:1/w_1280,h_1280,c_limit/basket%20bags%20for%20summer%20120324%20GETTYIMAGES-1602431779%20COPY.jpg',
    overlay: 'bg-gradient-to-t from-black/80 via-black/20 to-transparent',
    tag: 'Home Decor',
    title: 'Storage Baskets',
    sub: 'Natural willow & straw',
    wide: false,
  },
  {
    to: '/products?category=woolen-items',
    img: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&q=75',
    overlay: 'bg-gradient-to-t from-black/80 via-black/20 to-transparent',
    tag: 'New Season',
    title: 'Hand Woolens',
    sub: 'Soft textures & purses',
    wide: false,
  },
  {
    to: '/deals',
    img: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&q=75',
    overlay: 'bg-gradient-to-r from-black/80 via-black/40 to-transparent',
    tag: 'Bundle Offer',
    title: 'Artisan Sets',
    sub: 'Handpicked craft collections',
    wide: true,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as any }
  }
};

const DealTiles: React.FC = memo(() => (
  <section className="bg-white py-12 sm:py-20 border-t border-black/[0.03]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8"
      >
        {BENTO_TILES.map((tile) => (
          <motion.div
            key={tile.title}
            variants={itemVariants}
            className={`${tile.wide ? 'col-span-2 md:col-span-2' : 'col-span-1'}`}
          >
            <Link
              to={tile.to}
              className="group relative block overflow-hidden rounded-[2.5rem] h-[220px] sm:h-[280px] md:h-[340px] shadow-sm transition-all duration-700"
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={tile.img}
                  alt={tile.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
                />
              </div>
              <div className={`absolute inset-0 ${tile.overlay} opacity-40 group-hover:opacity-70 transition-opacity duration-700`} />
              
              <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-end">
                <div className="flex flex-col transform group-hover:-translate-y-2 transition-transform duration-700">
                  <span className="text-[10px] font-black tracking-[0.4em] text-white/50 uppercase mb-3">
                    {tile.tag}
                  </span>
                  <p className="text-white font-serif italic text-2xl sm:text-3xl md:text-4xl leading-none drop-shadow-2xl">
                    {tile.title}
                  </p>
                  <p className="text-white/60 text-[11px] sm:text-xs mt-3 font-medium tracking-[0.1em] max-w-xs line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                    {tile.sub}
                  </p>
                </div>
              </div>

              {/* Hover Icon */}
              <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 -rotate-45 group-hover:rotate-0">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
));
DealTiles.displayName = 'DealTiles';

/* ─── Price-Filter Strips ─── */
const PRICE_FILTERS = [
  { label: 'Under ₹499', link: '/products?maxPrice=499', bg: 'bg-stone-50 border-stone-200 text-stone-800' },
  { label: 'Under ₹999', link: '/products?maxPrice=999', bg: 'bg-orange-50 border-orange-200 text-orange-800' },
  { label: 'Under ₹1999', link: '/products?maxPrice=1999', bg: 'bg-amber-50 border-amber-200 text-amber-800' },
  { label: 'Under ₹2999', link: '/products?maxPrice=2999', bg: 'bg-green-50 border-green-200 text-green-800' },
  { label: 'Luxury Craft', link: '/products?minPrice=3000', bg: 'bg-stone-100 border-stone-300 text-stone-900' },
];

const ShopByPrice: React.FC = memo(() => (
  <section className="py-5 sm:py-6 bg-white border-t border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-4">
        <span className="text-base sm:text-lg font-bold text-gray-900">Price Palette</span>
      </div>
      <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
        {PRICE_FILTERS.map(({ label, link, bg }) => (
          <Link
            key={label}
            to={link}
            className={`flex-shrink-0 px-4 py-2 rounded-full border text-sm font-semibold transition-all hover:scale-[1.02] ${bg}`}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  </section>
));
ShopByPrice.displayName = 'ShopByPrice';

/* ─── Mini Promo Banner ─── */
const PromoBanner: React.FC = memo(() => (
  <div className="mx-4 sm:mx-6 lg:mx-8 my-8 max-w-7xl xl:mx-auto">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative overflow-hidden bg-black rounded-[2rem] p-8 sm:p-10 group"
    >
      <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=75')] bg-cover bg-center transition-transform duration-[3s] group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
      
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-white/50 font-bold text-[10px] uppercase tracking-[0.3em]">
            <Leaf className="h-3.5 w-3.5" />
            Our Commitment
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif italic text-white leading-tight">
            Eco-Conscious <span className="font-sans not-italic font-black text-white/20 uppercase tracking-tighter">Packaging</span>
          </h3>
          <p className="text-white/60 text-sm max-w-md font-medium">
            We promise 100% plastic-free delivery on every artisanal order. Protecting the craft and the planet.
          </p>
        </div>
        <Link
          to="/products"
          className="flex-shrink-0 group flex items-center gap-4 bg-white text-black font-black text-xs uppercase tracking-[0.2em] px-8 py-5 rounded-full transition-all hover:bg-[#F0F0F0] active:scale-95"
        >
          Explore Collection
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  </div>
));
PromoBanner.displayName = 'PromoBanner';

/* ─── Trust Signals ─── */
const TRUST_ITEMS = [
  { icon: Truck, title: 'Artisan Direct', desc: 'Crafted with heart' },
  { icon: RotateCcw, title: 'Fair Trade', desc: 'Supporting makers' },
  { icon: ShieldCheck, title: '100% Organic', desc: 'Natural goodness' },
  { icon: Headphones, title: 'Expert Care', desc: 'Concierge support' },
];

const TrustBar: React.FC = memo(() => (
  <section className="bg-white py-16 sm:py-20 border-t border-black/[0.03]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8"
      >
        {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
          <motion.div key={title} variants={itemVariants} className="flex flex-col items-center text-center space-y-4 group">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-[#F9F9F9] flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                <Icon className="h-6 w-6 text-black" />
              </div>
              <div className="absolute inset-0 rounded-full border border-black/5 scale-125 opacity-0 group-hover:opacity-100 transition-all duration-500" />
            </div>
            <div className="space-y-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
                {title}
              </h4>
              <p className="text-black/40 text-[11px] font-medium italic font-serif">
                {desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
));
TrustBar.displayName = 'TrustBar';

/* ─── Main Page ─── */
export default function HomePage() {
  const { categories, loading: categoriesLoading } = useProducts();

  return (
    <div className="min-h-screen bg-stone-50/50">

      {/* 1. Banner Carousel */}
      <Hero />

      {/* 2. Category Chips */}
      <CategoryChips categories={categories} loading={categoriesLoading && categories.length === 0} />

      {/* 3. Deal Tiles — Bento layout */}
      <DealTiles />

      {/* 4. Flash Sale */}
      <div className="mt-1.5">
        <FlashSale />
      </div>

      {/* 5. Featured Products — 2×2 mobile / 4-col desktop */}
      <div className="mt-1.5">
        <Suspense fallback={<SectionLoader />}>
          <FeaturedProducts />
        </Suspense>
      </div>

      {/* 6. Mini promo banner strip */}
      <PromoBanner />

      {/* 7. Best Sellers — horizontal scroll */}
      <BestSellers />

      {/* 8. New Arrivals — horizontal scroll */}
      <div className="mt-1.5">
        <Suspense fallback={<SectionLoader />}>
          <LatestArrivals />
        </Suspense>
      </div>

      {/* 9. CTA Banner */}
      <section className="mt-8 bg-black py-24 sm:py-32 overflow-hidden relative">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&q=75')] bg-cover bg-center" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <span className="text-white/40 font-bold text-[10px] uppercase tracking-[0.4em]">The Serique Philosophy</span>
              <h2 className="text-white text-4xl sm:text-6xl md:text-7xl font-serif italic leading-none">
                Sustainable <span className="font-sans not-italic font-black text-white/10 uppercase tracking-tighter block sm:inline">Elegance</span>
              </h2>
            </div>
            
            <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              Join 10,000+ conscious homes who chose artisan-crafted organic goods over mass production. Elevate your space with soul.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-4 bg-white text-black hover:bg-[#F0F0F0] font-black text-xs uppercase tracking-[0.2em] px-12 py-6 rounded-full transition-all shadow-2xl active:scale-95 group"
            >
              Start Exploring 
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 10. Trust Signals */}
      <TrustBar />

    </div>
  );
}

