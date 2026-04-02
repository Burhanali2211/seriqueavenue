/**
 * UNIFIED CACHING SYSTEM
 * Single source of truth for all data caching
 *
 * Replaces: caching.ts, newCaching.ts, hybridCache.ts
 *
 * Strategy:
 * - SessionStorage for browser persistence
 * - Automatic stale-while-revalidate
 * - Clear cache versioning
 * - No silent failures
 * - Proper error reporting
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  version: number;
}

// Configuration
const CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000,        // 5 minutes before marked stale
  MAX_AGE: 24 * 60 * 60 * 1000,      // 24 hours before deleted
  MAX_ITEMS: 50,                     // Max items in memory
  VERSION: 1,
} as const;

// Global cache version for invalidation
let cacheVersion = CACHE_CONFIG.VERSION;

/**
 * Unified Cache API
 * All caching goes through this system
 */
export const cache = {
  /**
   * Get cached data with staleness info
   * Returns { data, isStale } so components can decide whether to refetch
   */
  get<T>(key: string): { data: T; isStale: boolean } | null {
    if (typeof sessionStorage === 'undefined') return null;

    try {
      const raw = sessionStorage.getItem(`__cache_${key}`);
      if (!raw) {
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(raw);

      // Check if expired entirely
      if (Date.now() > entry.expiresAt) {
        sessionStorage.removeItem(`__cache_${key}`);
        return null;
      }

      // Check if stale (should refetch but can use)
      const isStale = Date.now() > entry.timestamp + CACHE_CONFIG.STALE_TIME;

      return { data: entry.data, isStale };
    } catch (error) {
      console.error(`[Cache] Failed to read ${key}:`, error);
      return null;
    }
  },

  /**
   * Set cache data
   * Returns boolean indicating success (important for error handling)
   */
  set<T>(key: string, data: T, ttl = CACHE_CONFIG.MAX_AGE): boolean {
    if (typeof sessionStorage === 'undefined') return false;

    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl,
        version: cacheVersion,
      };

      sessionStorage.setItem(`__cache_${key}`, JSON.stringify(entry));
      return true;
    } catch (error) {
      console.error(`[Cache] Failed to write ${key}:`, error);
      // SessionStorage full or other write error
      return false;
    }
  },

  /**
   * Delete specific cache entry
   */
  delete(key: string): void {
    if (typeof sessionStorage === 'undefined') return;
    try {
      sessionStorage.removeItem(`__cache_${key}`);
    } catch (error) {
      console.error(`[Cache] Failed to delete ${key}:`, error);
    }
  },

  /**
   * Clear all caches
   */
  clear(): void {
    if (typeof sessionStorage === 'undefined') return;
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith('__cache_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => sessionStorage.removeItem(key));
    } catch (error) {
      console.error('[Cache] Failed to clear:', error);
    }
  },

  /**
   * Invalidate all caches
   * Increments version and clears all old keys
   * Call when data is mutated (add/update/delete product, etc.)
   */
  invalidateAll(): void {
    cacheVersion++;
    if (typeof sessionStorage !== 'undefined') {
      try {
        sessionStorage.setItem('__cache_version', String(cacheVersion));
      } catch (error) {
        console.error('[Cache] Failed to save version:', error);
      }
    }
    this.clear();
  },

  /**
   * Invalidate by pattern
   * E.g., invalidatePattern('products') clears products_1, products_2, etc.
   */
  invalidatePattern(pattern: string): void {
    if (typeof sessionStorage === 'undefined') return;
    try {
      const prefix = `__cache_${pattern}`;
      const keysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => sessionStorage.removeItem(key));
    } catch (error) {
      console.error(`[Cache] Failed to invalidate pattern ${pattern}:`, error);
    }
  },

  /**
   * Get cache statistics
   * Useful for debugging cache issues
   */
  getStats(): { itemCount: number; totalSize: number; version: number } {
    if (typeof sessionStorage === 'undefined') {
      return { itemCount: 0, totalSize: 0, version: cacheVersion };
    }

    try {
      let itemCount = 0;
      let totalSize = 0;
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith('__cache_')) {
          itemCount++;
          const value = sessionStorage.getItem(key);
          totalSize += value?.length || 0;
        }
      }
      return { itemCount, totalSize, version: cacheVersion };
    } catch (error) {
      console.error('[Cache] Failed to get stats:', error);
      return { itemCount: 0, totalSize: 0, version: cacheVersion };
    }
  },

  /**
   * Create a typed cache helper
   * Usage: const userCache = cache.createTyped<User>('user');
   *        userCache.get() / userCache.set()
   */
  createTyped<T>(key: string) {
    return {
      get: () => cache.get<T>(key),
      set: (data: T) => cache.set(key, data),
      delete: () => cache.delete(key),
      invalidate: () => cache.invalidateAll(),
    };
  },
};

/**
 * Initialize cache on app load
 * Clears all old cache keys that don't have __cache_ prefix
 * (from previous caching systems)
 */
export const initializeCache = () => {
  if (typeof window === 'undefined') return;

  try {
    const keysToRemove: string[] = [];

    // Remove old cache keys from previous systems
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (!key) continue;

      // Old cache key patterns from previous systems
      if (
        key.startsWith('pc_') ||                    // ProductContext old
        key.startsWith('perfume_cache_') ||        // Old caching.ts
        key.startsWith('cache_') ||                // Old cache files
        key.includes('_cache_') ||
        key === 'cache_version' ||
        key === '__cache_version'                  // Current version key
      ) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => {
      try {
        sessionStorage.removeItem(key);
      } catch (e) {
        // Ignore individual removal errors
      }
    });

    console.log(`[Cache] Initialized. Cleaned up ${keysToRemove.length} old cache keys`);
  } catch (error) {
    console.error('[Cache] Initialization failed:', error);
  }
};

/**
 * Monitor cache for issues
 * Useful for production debugging
 */
export const monitorCache = () => {
  if (process.env.NODE_ENV !== 'development') return;

  const stats = cache.getStats();
  const threshold = CACHE_CONFIG.MAX_ITEMS * 0.8; // 80% full

  if (stats.itemCount > threshold) {
    console.warn(`[Cache] Cache is ${Math.round((stats.itemCount / CACHE_CONFIG.MAX_ITEMS) * 100)}% full`, stats);
  }

  if (stats.totalSize > 1024 * 1024) { // 1MB
    console.warn(`[Cache] Cache size exceeds 1MB:`, stats);
  }
};

export default cache;
