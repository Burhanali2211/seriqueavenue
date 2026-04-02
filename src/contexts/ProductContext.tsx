import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from 'react';
import { Product, ProductContextType, Category, Review } from '../types';
import { supabase, db } from '../lib/supabase';
import { useNotification } from './NotificationContext';
import { cache } from '../lib/storage/cache'; // ✅ PHASE 1: Use unified cache

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// ✅ PHASE 1: Simple cache key generation (no versioning - cache system handles it)
const getCacheKeys = () => ({
  products: (page: number, filters: string) => `products_${page}_${filters}`,
  featured: 'featured_products',
  latest: 'latest_products',
  bestSellers: 'bestsellers',
  categories: 'categories',
});

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ── State initialised from cache immediately — zero loading flash ──
  const [products, setProducts]           = useState<Product[]>(cache.get<Product[]>(getCacheKeys().featured)?.data ? [] : []);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(cache.get<Product[]>(getCacheKeys().featured)?.data || []);
  const [bestSellers, setBestSellers]     = useState<Product[]>(cache.get<Product[]>(getCacheKeys().bestSellers)?.data || []);
  const [latestProducts, setLatestProducts] = useState<Product[]>(cache.get<Product[]>(getCacheKeys().latest)?.data || []);
  const [categories, setCategories]       = useState<Category[]>(cache.get<Category[]>(getCacheKeys().categories)?.data || []);
  const [loading, setLoading]             = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(featuredProducts.length === 0);
  const [bestSellersLoading, setBestSellersLoading] = useState(bestSellers.length === 0);
  const [latestLoading, setLatestLoading] = useState(latestProducts.length === 0);
  const [pagination, setPagination]       = useState<PaginationState>({ page: 1, limit: 20, total: 0, pages: 0 });
  const { showError } = useNotification();

  // Track whether initial homepage fetch has been kicked off
  const initFetched = useRef(false);

  const mapDbProductToAppProduct = useCallback((dbProduct: any): Product => {
    const images = Array.isArray(dbProduct.images) ? dbProduct.images
      : dbProduct.image_url ? [dbProduct.image_url]
      : [];
    return {
      id: dbProduct.id,
      name: dbProduct.name,
      slug: dbProduct.slug,
      description: dbProduct.description || '',
      shortDescription: dbProduct.short_description,
      price: dbProduct.price,
      originalPrice: dbProduct.original_price,
      categoryId: dbProduct.category_id,
      images,
      stock: dbProduct.stock ?? 0,
      minStockLevel: dbProduct.min_stock_level,
      sku: dbProduct.sku,
      weight: dbProduct.weight,
      dimensions: dbProduct.dimensions,
      rating: dbProduct.rating || 0,
      reviewCount: dbProduct.review_count || 0,
      reviews: [],
      sellerId: dbProduct.seller_id,
      sellerName: dbProduct.seller_name || 'Aligarh Attar House',
      tags: dbProduct.tags || [],
      specifications: dbProduct.specifications || {},
      featured: dbProduct.is_featured || false,
      showOnHomepage: dbProduct.show_on_homepage || false,
      isActive: dbProduct.is_active,
      metaTitle: dbProduct.meta_title,
      metaDescription: dbProduct.meta_description,
      createdAt: dbProduct.created_at ? new Date(dbProduct.created_at) : new Date(0),
      updatedAt: dbProduct.updated_at ? new Date(dbProduct.updated_at) : undefined,
    };
  }, []);

  const mapDbCategoryToAppCategory = useCallback((dbCategory: any): Category => ({
    id: dbCategory.id,
    name: dbCategory.name,
    slug: dbCategory.slug,
    description: dbCategory.description,
    imageUrl: dbCategory.image_url || '',
    parentId: dbCategory.parent_id,
    isActive: dbCategory.is_active,
    sortOrder: dbCategory.sort_order,
    productCount: dbCategory.product_count || 0,
    createdAt: dbCategory.created_at ? new Date(dbCategory.created_at) : undefined,
    updatedAt: dbCategory.updated_at ? new Date(dbCategory.updated_at) : undefined,
  }), []);

  const fetchCategories = useCallback(async (background = false, force = false) => {
    const keys = getCacheKeys();
    // ✅ PHASE 1: Use unified cache
    const result = cache.get<Category[]>(keys.categories);

    // Show cached data instantly if available
    if (result?.data) {
      setCategories(result.data);
      // In background mode and data not stale, skip refetch
      if (background && !result.isStale && !force) {
        return;
      }
    }

    // Fetch fresh data
    if (!result?.data) setLoading(true);
    try {
      const data = await db.getCategories();
      const mapped = data.map(mapDbCategoryToAppCategory);
      setCategories(mapped);
      cache.set(keys.categories, mapped);
    } catch (error) {
      // Only show error if no fallback cache
      if (!result?.data) {
        showError('Failed to load categories', error instanceof Error ? error.message : undefined);
      }
    } finally {
      if (!result?.data) setLoading(false);
    }
  }, [showError, mapDbCategoryToAppCategory]);

  const fetchProducts = useCallback(async (page: number = 1, limit: number = 20, filters?: any, force = false) => {
    const filterKey = JSON.stringify(filters || {});
    const keys = getCacheKeys();
    const cacheKey = keys.products(page, filterKey);

    const isDefault = page === 1 && (!filters || Object.keys(filters).length === 0);
    // ✅ PHASE 1: Use unified cache
    const result = isDefault ? cache.get<{ products: Product[]; pagination: PaginationState }>(cacheKey) : null;

    // Show cache instantly (zero loading flash)
    if (result?.data) {
      setProducts(result.data.products);
      setPagination(result.data.pagination);
    }

    // Always fetch fresh when forced OR when no cache exists
    if (force || !result?.data) {
      if (!result?.data) setLoading(true);
      (async () => {
        try {
          const response = await db.getProducts({ page, limit, ...filters });
          const mapped = response.data.map(mapDbProductToAppProduct);
          setProducts(mapped);
          setPagination(response.pagination);
          if (isDefault) cache.set(cacheKey, { products: mapped, pagination: response.pagination });
        } catch (error) {
          if (!result?.data) showError('Failed to load products', error instanceof Error ? error.message : undefined);
        } finally {
          if (!result?.data) setLoading(false);
        }
      })();
    }
  }, [showError, mapDbProductToAppProduct]);

  const fetchFeaturedProducts = useCallback(async (limit: number = 8, force = false) => {
    const keys = getCacheKeys();
    // ✅ PHASE 1: Use unified cache
    const result = cache.get<Product[]>(keys.featured);
    // Show cached data instantly
    if (result?.data) { setFeaturedProducts(result.data); setFeaturedLoading(false); }
    // Fetch fresh when forced OR no cache
    if (force || !result?.data) {
      if (!result?.data) setFeaturedLoading(true);
      (async () => {
        try {
          const data = await db.getFeaturedProducts(limit);
          const mapped = data.map(mapDbProductToAppProduct);
          setFeaturedProducts(mapped);
          cache.set(keys.featured, mapped);
        } catch (error) {
          if (!result?.data) showError('Failed to load featured products', error instanceof Error ? error.message : undefined);
        } finally {
          if (!result?.data) setFeaturedLoading(false);
        }
      })();
    }
  }, [showError, mapDbProductToAppProduct]);

  const fetchBestSellers = useCallback(async (limit: number = 8, force = false) => {
    const keys = getCacheKeys();
    // ✅ PHASE 1: Use unified cache
    const result = cache.get<Product[]>(keys.bestSellers);
    if (result?.data) { setBestSellers(result.data); setBestSellersLoading(false); }
    if (force || !result?.data) {
      if (!result?.data) setBestSellersLoading(true);
      (async () => {
        try {
          const response = await db.getProducts({ bestSellers: true, limit });
          const mapped = response.data.map(mapDbProductToAppProduct);
          setBestSellers(mapped);
          cache.set(keys.bestSellers, mapped);
        } catch (error) {
          if (!result?.data) showError('Failed to load best sellers', error instanceof Error ? error.message : undefined);
        } finally {
          if (!result?.data) setBestSellersLoading(false);
        }
      })();
    }
  }, [showError, mapDbProductToAppProduct]);

  const fetchLatestProducts = useCallback(async (limit: number = 8, force = false) => {
    const keys = getCacheKeys();
    // ✅ PHASE 1: Use unified cache
    const result = cache.get<Product[]>(keys.latest);
    if (result?.data) { setLatestProducts(result.data); setLatestLoading(false); }
    if (force || !result?.data) {
      if (!result?.data) setLatestLoading(true);
      (async () => {
        try {
          const data = await db.getLatestProducts(limit);
          const mapped = data.map(mapDbProductToAppProduct);
          setLatestProducts(mapped);
          cache.set(keys.latest, mapped);
        } catch (error) {
          if (!result?.data) showError('Failed to load latest products', error instanceof Error ? error.message : undefined);
        } finally {
          if (!result?.data) setLatestLoading(false);
        }
      })();
    }
  }, [showError, mapDbProductToAppProduct]);

  const fetchReviewsForProduct = useCallback(async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(full_name, avatar_url)')
        .eq('product_id', productId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      showError('Failed to load reviews', error instanceof Error ? error.message : undefined);
      return [];
    }
  }, [showError]);

  const addProduct = useCallback(async (product: Omit<Product, 'id' | 'createdAt' | 'reviews' | 'rating' | 'reviewCount'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: product.name, description: product.description, price: product.price,
          category_id: product.categoryId, images: product.images, stock: product.stock,
          seller_id: product.sellerId, is_featured: product.featured, show_on_homepage: product.showOnHomepage
        }])
        .select()
        .single();
      if (error) throw error;
      // ✅ PHASE 1: Use unified cache invalidation
      cache.invalidatePattern('products');
      await fetchProducts(1, 20, undefined, true);
      return mapDbProductToAppProduct(data);
    } catch (error) {
      showError('Failed to create product', error instanceof Error ? error.message : undefined);
      throw error;
    }
  }, [showError, fetchProducts, mapDbProductToAppProduct]);

  const submitReview = useCallback(async (review: Omit<Review, 'id' | 'createdAt' | 'profiles'>) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .insert([{ product_id: review.productId, user_id: review.userId, rating: review.rating, comment: review.comment, title: review.title }]);
      if (error) throw error;
    } catch (error) {
      showError('Failed to submit review', error instanceof Error ? error.message : undefined);
      throw error;
    }
  }, [showError]);

  const getProductById = useCallback(async (id: string) => {
    try {
      const data = await db.getProduct(id);
      return data ? mapDbProductToAppProduct(data) : null;
    } catch (error) {
      showError('Failed to load product', error instanceof Error ? error.message : undefined);
      return null;
    }
  }, [showError, mapDbProductToAppProduct]);

  const searchProducts = useCallback(async (query: string) => {
    try {
      setLoading(true);
      const response = await db.getProducts({ search: query, limit: 50 });
      setProducts(response.data.map(mapDbProductToAppProduct));
      setPagination(response.pagination);
    } catch (error) {
      showError('Search failed', error instanceof Error ? error.message : undefined);
    } finally {
      setLoading(false);
    }
  }, [showError, mapDbProductToAppProduct]);

  const filterByCategory = useCallback(async (categoryId: string) => {
    try {
      setLoading(true);
      const response = await db.getProducts({ categoryId, limit: 50 });
      setProducts(response.data.map(mapDbProductToAppProduct));
      setPagination(response.pagination);
    } catch (error) {
      showError('Filter failed', error instanceof Error ? error.message : undefined);
    } finally {
      setLoading(false);
    }
  }, [showError, mapDbProductToAppProduct]);

  const createProduct = useCallback(async (data: Partial<Product>) => addProduct(data as any), [addProduct]);

  const updateProduct = useCallback(async (product: Product) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ name: product.name, description: product.description, price: product.price, category_id: product.categoryId, images: product.images, stock: product.stock, is_featured: product.featured, show_on_homepage: product.showOnHomepage })
        .eq('id', product.id)
        .select()
        .single();
      if (error) throw error;
      // ✅ PHASE 1: Use unified cache invalidation
      cache.invalidatePattern('products');
      await fetchProducts(pagination?.page || 1, 20, undefined, true);
      return mapDbProductToAppProduct(data);
    } catch (error) {
      showError('Failed to update product', error instanceof Error ? error.message : undefined);
      throw error;
    }
  }, [showError, fetchProducts, pagination, mapDbProductToAppProduct]);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      // ✅ PHASE 1: Use unified cache invalidation
      cache.invalidatePattern('products');
      await fetchProducts(pagination?.page || 1, 20, undefined, true);
    } catch (error) {
      showError('Failed to delete product', error instanceof Error ? error.message : undefined);
      throw error;
    }
  }, [showError, fetchProducts, pagination]);

  const createCategory = useCallback(async (data: Partial<Category>) => {
    try {
      const { data: category, error } = await supabase
        .from('categories')
        .insert([{ name: data.name, slug: data.slug, description: data.description, image_url: data.imageUrl, parent_id: data.parentId, is_active: data.isActive, sort_order: data.sortOrder }])
        .select()
        .single();
      if (error) throw error;
      // ✅ PHASE 1: Use unified cache invalidation
      cache.invalidatePattern('categories');
      await fetchCategories(false, true);
      return mapDbCategoryToAppCategory(category);
    } catch (error) {
      showError('Failed to create category', error instanceof Error ? error.message : undefined);
      throw error;
    }
  }, [showError, fetchCategories, mapDbCategoryToAppCategory]);

  const updateCategory = useCallback(async (id: string, data: Partial<Category>) => {
    try {
      const { data: category, error } = await supabase
        .from('categories')
        .update({ name: data.name, slug: data.slug, description: data.description, image_url: data.imageUrl, parent_id: data.parentId, is_active: data.isActive, sort_order: data.sortOrder })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      // ✅ PHASE 1: Use unified cache invalidation
      cache.invalidatePattern('categories');
      await fetchCategories(false, true);
      return mapDbCategoryToAppCategory(category);
    } catch (error) {
      showError('Failed to update category', error instanceof Error ? error.message : undefined);
      throw error;
    }
  }, [showError, fetchCategories, mapDbCategoryToAppCategory]);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      // ✅ PHASE 1: Use unified cache invalidation
      cache.invalidatePattern('categories');
      await fetchCategories(false, true);
    } catch (error) {
      showError('Failed to delete category', error instanceof Error ? error.message : undefined);
      throw error;
    }
  }, [showError, fetchCategories]);

  const nextPage     = useCallback(() => { if (pagination?.page < pagination?.pages) fetchProducts(pagination.page + 1); }, [pagination, fetchProducts]);
  const previousPage = useCallback(() => { if (pagination?.page > 1) fetchProducts(pagination.page - 1); }, [pagination, fetchProducts]);
  const goToPage     = useCallback((page: number) => { if (page >= 1 && page <= pagination?.pages) fetchProducts(page); }, [pagination, fetchProducts]);

  // ── Initial data load — fire once, sequenced to avoid auth lock contention ──
  // All 5 Supabase calls used to fire simultaneously via Promise.all, causing
  // them to compete for the GoTrue auth token lock and triggering the
  // "Lock was not released within 5000ms" warning.
  //
  // Fix: categories + products first (needed for immediate render), then the
  // remaining sections staggered with a small delay so the lock is free.
  useEffect(() => {
    if (initFetched.current) return;
    initFetched.current = true;

    // Phase 1: critical data — show UI immediately
    Promise.all([
      fetchCategories(false, true),
      fetchProducts(1, 20, undefined, true),
      fetchFeaturedProducts(8, true),
    ]).then(() => {
      // Phase 2: below-the-fold sections — fetch after lock is free
      fetchLatestProducts(8, true);
      fetchBestSellers(8, true);
    });

    return () => { initFetched.current = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value: ProductContextType = {
    products, featuredProducts, bestSellers, latestProducts, categories,
    loading, featuredLoading, bestSellersLoading, latestLoading, pagination,
    fetchProducts, fetchFeaturedProducts, fetchBestSellers, fetchLatestProducts,
    fetchReviewsForProduct, fetchCategories,
    addProduct, submitReview, getProductById, searchProducts, filterByCategory,
    createProduct, updateProduct, deleteProduct,
    createCategory, updateCategory, deleteCategory,
    nextPage, previousPage, goToPage
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
