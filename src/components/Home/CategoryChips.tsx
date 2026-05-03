import React, { useRef, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, LayoutGrid } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { Category } from '../../types';
import { getSafeImageUrl } from '../../utils/imageUrlUtils';

interface CategoryChipsProps {
  categories: Category[];
  loading?: boolean;
}

// Emoji map for Islamic lifestyle / attar store categories
const categoryEmojis: Record<string, string> = {
  attar: '🫙',
  perfume: '✨',
  oud: '🪵',
  agarwood: '🪵',
  floral: '🌸',
  rose: '🌹',
  musky: '💜',
  amber: '🟤',
  hijab: '🧕',
  gift: '🎁',
  book: '📖',
  islamic: '📖',
  kids: '👶',
  toy: '🧸',
  default: '🕌',
};

function getCategoryEmoji(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(categoryEmojis)) {
    if (lower.includes(key)) return emoji;
  }
  return categoryEmojis.default;
}

const fallbackImages = [
  'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=120&q=70',
  'https://images.unsplash.com/photo-1541643600914-78b084683702?w=120&q=70',
  'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=120&q=70',
  'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=120&q=70',
  'https://images.unsplash.com/photo-1585241936939-be4099591252?w=120&q=70',
];

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
};

export const CategoryChips: React.FC<CategoryChipsProps> = memo(({ categories, loading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const activeCategories = useMemo(
    () => categories.filter(c => c.isActive !== false).slice(0, 10),
    [categories]
  );

  if (loading) {
    return (
      <div className="flex gap-8 px-8 py-12 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 flex flex-col items-center gap-4 animate-pulse">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#F5F5F5]" />
            <div className="w-12 h-2 bg-[#F5F5F5] rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="bg-white border-b border-black/[0.03] overflow-hidden">
      <motion.div
        ref={scrollRef}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="flex gap-6 sm:gap-10 px-6 py-10 sm:py-14 overflow-x-auto scrollbar-hide snap-x snap-mandatory
                   sm:flex-nowrap sm:justify-start lg:justify-center lg:px-12"
      >
        {/* All Categories Chip */}
        <motion.div variants={itemVariants} className="flex-shrink-0 snap-start">
          <Link
            to="/products"
            className="flex flex-col items-center gap-4 group"
          >
            <div className="relative p-[3px] rounded-full transition-all duration-500 group-hover:scale-110">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black via-black/40 to-black/80 opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black flex items-center justify-center shadow-2xl shadow-black/10">
                <LayoutGrid className="h-8 w-8 sm:h-10 sm:w-10 text-white/90" />
              </div>
            </div>
            <div className="text-center">
              <span className="block text-[9px] font-black uppercase tracking-[0.3em] text-black/20 group-hover:text-black transition-colors mb-0.5">
                Browse
              </span>
              <span className="text-[12px] sm:text-[13px] font-serif italic text-black font-medium leading-none">
                All Collections
              </span>
            </div>
          </Link>
        </motion.div>

        {activeCategories.map((cat, i) => {
          const rawUrl = cat.imageUrl || (cat as any).image_url;
          const imageUrl = getSafeImageUrl(rawUrl, fallbackImages[i % fallbackImages.length]);
          const emoji = getCategoryEmoji(cat.name);
          const hasRealImage = imageUrl && !imageUrl.includes('via.placeholder');
          
          return (
            <motion.div key={cat.id} variants={itemVariants} className="flex-shrink-0 snap-start">
              <Link
                to={`/products?category=${cat.slug || cat.id}`}
                className="flex flex-col items-center gap-4 group"
              >
                <div className="relative p-[3px] rounded-full transition-all duration-700 group-hover:scale-110">
                  {/* Luxury border ring */}
                  <div className="absolute inset-0 rounded-full border border-black/[0.05]" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-[#F9F9F9] shadow-inner ring-1 ring-black/[0.02]">
                    {hasRealImage ? (
                      <img
                        src={imageUrl}
                        alt={cat.name}
                        loading="lazy"
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover transition-transform duration-[1.5s] cubic-bezier(0.23, 1, 0.32, 1) group-hover:scale-125"
                        onError={(e) => {
                          const t = e.target as HTMLImageElement;
                          t.style.display = 'none';
                          const sibling = t.nextElementSibling as HTMLElement | null;
                          if (sibling) sibling.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`${hasRealImage ? 'hidden' : 'flex'} absolute inset-0 w-full h-full items-center justify-center text-3xl sm:text-4xl bg-[#F9F9F9]`}>
                      {emoji}
                    </div>
                  </div>
                </div>
                <div className="text-center group-hover:-translate-y-1 transition-transform duration-500">
                  <span className="block text-[8px] font-black uppercase tracking-[0.4em] text-black/10 group-hover:text-black/30 transition-colors mb-0.5">
                    Category
                  </span>
                  <span className="text-[12px] sm:text-[13px] font-serif italic text-black/60 group-hover:text-black transition-colors font-medium leading-none">
                    {cat.name}
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}

        {/* Explore All Link */}
        <motion.div variants={itemVariants} className="flex-shrink-0 snap-start">
          <Link
            to="/products"
            className="flex flex-col items-center gap-4 group"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-dashed border-black/10 flex items-center justify-center group-hover:border-black/30 group-hover:bg-[#F9F9F9] transition-all duration-500">
              <ChevronRight className="h-8 w-8 text-black/20 group-hover:text-black transition-colors" />
            </div>
            <div className="text-center">
              <span className="block text-[8px] font-black uppercase tracking-[0.4em] text-black/10 transition-colors mb-0.5">
                View
              </span>
              <span className="text-[12px] sm:text-[13px] font-serif italic text-black/30 group-hover:text-black transition-colors font-medium">
                Explore More
              </span>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
});

CategoryChips.displayName = 'CategoryChips';
export default CategoryChips;
