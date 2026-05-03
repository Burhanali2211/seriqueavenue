import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { X, LayoutGrid, ChevronRight, ArrowRight } from 'lucide-react';
import { useProducts } from '../../contexts/ProductContext';
import { getSafeImageUrl } from '../../utils/imageUrlUtils';

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Fallback images from CategoryChips for consistency
const CATEGORY_FALLBACKS = [
  'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=120&q=70',
  'https://images.unsplash.com/photo-1541643600914-78b084683702?w=120&q=70',
  'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=120&q=70',
  'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=120&q=70',
  'https://images.unsplash.com/photo-1585241936939-be4099591252?w=120&q=70',
];

const GRADIENTS = [
  'from-rose-400/20 to-pink-600/20',
  'from-amber-400/20 to-orange-600/20',
  'from-violet-400/20 to-purple-600/20',
  'from-emerald-400/20 to-teal-600/20',
  'from-sky-400/20 to-blue-600/20',
];

export const CategoryDrawer: React.FC<CategoryDrawerProps> = ({ isOpen, onClose }) => {
  const { categories, loading } = useProducts();

  const activeCategories = useMemo(
    () => categories.filter(c => c.isActive !== false),
    [categories]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] overflow-hidden flex flex-col max-h-[85vh] transition-transform duration-300 transform ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle */}
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-3 mb-1" />
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Browse Collections</h2>
            <p className="text-xs text-gray-500 mt-0.5">Explore by category</p>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-900 active:scale-95 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {/* Shop All Link */}
          <Link
            to="/products"
            onClick={onClose}
            className="group flex items-center justify-between gap-4 bg-gray-900 text-white rounded-2xl px-5 py-4 hover:bg-black active:scale-[0.99] transition-all duration-150 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                <LayoutGrid className="w-5 h-5 text-white" />
              </span>
              <div>
                <p className="font-bold text-base leading-tight">All Products</p>
                <p className="text-white/60 text-xs mt-0.5">Browse full collection</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-150 flex-shrink-0" />
          </Link>

          {/* Categories Grid */}
          {loading ? (
            <div className="grid grid-cols-1 gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-20 bg-gray-50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : activeCategories.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 pb-8">
              {activeCategories.map((cat, i) => {
                const gradient = GRADIENTS[i % GRADIENTS.length];
                const rawUrl = cat.imageUrl || (cat as any).image_url;
                const imageUrl = getSafeImageUrl(rawUrl, CATEGORY_FALLBACKS[i % CATEGORY_FALLBACKS.length]);

                return (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.slug || cat.id}`}
                    onClick={onClose}
                    className="group relative flex items-center gap-4 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50 hover:bg-white hover:shadow-md active:scale-[0.99] transition-all duration-200"
                  >
                    <div className={`w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden relative bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}>
                      <img 
                        src={imageUrl} 
                        alt={cat.name} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        onError={(e) => {
                          const t = e.target as HTMLImageElement;
                          t.src = CATEGORY_FALLBACKS[i % CATEGORY_FALLBACKS.length];
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-base">{cat.name}</h3>
                      {cat.productCount !== undefined && (
                        <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                          {cat.productCount} Items
                        </p>
                      )}
                    </div>
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No categories found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
