import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Category } from '../../types';
import { getSafeImageUrl } from '../../utils/imageUrlUtils';

interface BentoGridProps {
  categories: Category[];
  loading?: boolean;
}

// Animation variants for the grid
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const BentoGrid: React.FC<BentoGridProps> = ({ categories, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 animate-pulse">
        <div className="col-span-2 md:col-span-3 md:row-span-2 bg-gray-100 rounded-2xl h-[400px]" />
        <div className="bg-gray-100 rounded-2xl aspect-square" />
        <div className="bg-gray-100 rounded-2xl aspect-square" />
        <div className="bg-gray-100 rounded-2xl aspect-square" />
        <div className="col-span-2 bg-gray-100 rounded-2xl h-[160px]" />
        <div className="bg-gray-100 rounded-2xl aspect-square" />
      </div>
    );
  }

  const featuredCat = categories[0];
  const secondaryCats = categories.slice(1, 7);

  const getCatImage = (cat: Category, fallback: string) => {
    const rawUrl = cat.imageUrl || (cat as any).image_url;
    return getSafeImageUrl(rawUrl, fallback);
  };

  const fallbackImages = [
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600',
    'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600',
    'https://images.unsplash.com/photo-1547592180-85f173990554?w=600',
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-2 md:grid-cols-6 md:grid-rows-2 gap-3 sm:gap-4 md:gap-5"
    >
      {/* 1. Main Featured Tile - Editorial Style */}
      {featuredCat && (
        <motion.div variants={itemVariants} className="col-span-2 md:col-span-3 md:row-span-2">
          <Link
            to={`/products?category=${featuredCat.id}`}
            className="group relative flex flex-col h-full overflow-hidden rounded-[2rem] bg-[#f8f9fa] border border-black/5 shadow-sm transition-all duration-500"
          >
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={getCatImage(featuredCat, 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800')}
                alt={featuredCat.name}
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
              />
            </div>
            
            {/* Scrim Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />

            {/* Content Container */}
            <div className="absolute inset-0 p-6 sm:p-8 md:p-10 flex flex-col justify-between z-10">
              <div className="flex justify-between items-start">
                <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-medium tracking-[0.2em] px-3 py-1.5 rounded-full uppercase">
                  Featured Collection
                </span>
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform duration-500">
                  <ArrowUpRight className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-white mb-3 drop-shadow-lg leading-tight">
                  {featuredCat.name}
                </h3>
                <p className="text-white/80 text-sm sm:text-base mb-6 line-clamp-2 max-w-md hidden sm:block font-light tracking-wide leading-relaxed">
                  {featuredCat.description || 'Explore our most exclusive selection of curated essentials designed for the conscious lifestyle.'}
                </p>
                <div className="inline-flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full text-sm font-semibold tracking-wide transition-all group-hover:bg-amber-100 group-hover:px-8">
                  <span>Discover Now</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* 2. Small Tile 1 */}
      {secondaryCats[0] && (
        <motion.div variants={itemVariants}>
          <Link
            to={`/products?category=${secondaryCats[0].id}`}
            className="group relative block h-full overflow-hidden rounded-[1.5rem] bg-white border border-black/5 shadow-sm aspect-square md:aspect-auto"
          >
            <img
              src={getCatImage(secondaryCats[0], fallbackImages[0])}
              alt={secondaryCats[0].name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-sm font-semibold text-white tracking-wide uppercase">{secondaryCats[0].name}</h3>
            </div>
          </Link>
        </motion.div>
      )}

      {/* 3. Small Tile 2 */}
      {secondaryCats[1] && (
        <motion.div variants={itemVariants}>
          <Link
            to={`/products?category=${secondaryCats[1].id}`}
            className="group relative block h-full overflow-hidden rounded-[1.5rem] bg-white border border-black/5 shadow-sm aspect-square md:aspect-auto"
          >
            <img
              src={getCatImage(secondaryCats[1], fallbackImages[1])}
              alt={secondaryCats[1].name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-sm font-semibold text-white tracking-wide uppercase">{secondaryCats[1].name}</h3>
            </div>
          </Link>
        </motion.div>
      )}

      {/* 4. Wide Tile - Luxury Banner Style */}
      {secondaryCats[3] && (
        <motion.div variants={itemVariants} className="col-span-2">
          <Link
            to={`/products?category=${secondaryCats[3].id}`}
            className="group relative block h-full overflow-hidden rounded-[1.5rem] bg-black border border-white/10 shadow-sm min-h-[140px] md:min-h-0"
          >
            <img
              src={getCatImage(secondaryCats[3], fallbackImages[3])}
              alt={secondaryCats[3].name}
              className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[2s] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 p-6 flex flex-col justify-center">
              <span className="text-amber-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-1">New Selection</span>
              <h3 className="text-xl sm:text-2xl font-serif italic text-white mb-2">{secondaryCats[3].name}</h3>
              <div className="flex items-center gap-1 text-white/60 text-xs group-hover:text-white transition-colors">
                <span>View Details</span>
                <ChevronRight className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* 5. Small Tile 3 */}
      {secondaryCats[2] && (
        <motion.div variants={itemVariants}>
          <Link
            to={`/products?category=${secondaryCats[2].id}`}
            className="group relative block h-full overflow-hidden rounded-[1.5rem] bg-white border border-black/5 shadow-sm aspect-square md:aspect-auto"
          >
            <img
              src={getCatImage(secondaryCats[2], fallbackImages[2])}
              alt={secondaryCats[2].name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-sm font-semibold text-white tracking-wide uppercase">{secondaryCats[2].name}</h3>
            </div>
          </Link>
        </motion.div>
      )}

      {/* 6. Small Tile 4 */}
      {secondaryCats[4] && (
        <motion.div variants={itemVariants}>
          <Link
            to={`/products?category=${secondaryCats[4].id}`}
            className="group relative block h-full overflow-hidden rounded-[1.5rem] bg-white border border-black/5 shadow-sm aspect-square md:aspect-auto"
          >
            <img
              src={getCatImage(secondaryCats[4], fallbackImages[4])}
              alt={secondaryCats[4].name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-sm font-semibold text-white tracking-wide uppercase">{secondaryCats[4].name}</h3>
            </div>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};
