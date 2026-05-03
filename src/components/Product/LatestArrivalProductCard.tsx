import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAddToWishlistWithAuth } from '../../hooks/useAddToWishlistWithAuth';
import ProductImage from '../Common/ProductImage';

interface LatestArrivalProductCardProps {
  product: Product;
  index?: number;
}

/**
 * Compact premium card for horizontal scroll sections.
 */
export const LatestArrivalProductCard: React.FC<LatestArrivalProductCardProps> = ({ product, index = 0 }) => {
  const { isInWishlist } = useWishlist();
  const { handleAddToWishlist } = useAddToWishlistWithAuth();

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddToWishlist(product);
  };

  const isSelectedInWishlist = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
      className="group relative"
    >
      <Link to={`/products/${product.id}`} className="block">
        <article className="bg-white rounded-[1.5rem] overflow-hidden border border-black/[0.03] transition-all duration-500 group">
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
            <ProductImage
              product={product}
              className="w-full h-full object-cover transition-transform duration-[1s] ease-out group-hover:scale-105"
              alt={product.name}
              size="small"
              priority={index < 3 ? 'critical' : 'normal'}
            />

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-10"
              aria-label="Wishlist"
            >
              <Heart className={`h-3.5 w-3.5 transition-colors ${isSelectedInWishlist ? 'fill-red-500 text-red-500' : 'text-black/30'}`} />
            </button>
          </div>

          {/* Info */}
          <div className="p-4 bg-white">
            <div className="mb-3">
              <span className="text-[9px] font-bold text-black/20 uppercase tracking-[0.2em] block mb-1">
                {product.category}
              </span>
              <p className="text-xs font-bold text-black line-clamp-1 uppercase tracking-tight group-hover:text-stone-600 transition-colors truncate">
                {product.name}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-black text-black">₹{product.price.toLocaleString('en-IN')}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-[10px] text-black/30 line-through font-medium">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                )}
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <ArrowUpRight className="w-3.5 h-3.5 text-black/30" />
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
};

export default LatestArrivalProductCard;
