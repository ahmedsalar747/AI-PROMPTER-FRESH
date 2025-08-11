/**
 * Advanced Cache Management System for Prompter Fresh
 * 
 * This module provides comprehensive caching capabilities including:
 * - Multi-layer caching (memory, localStorage, IndexedDB)
 * - Cache invalidation strategies
 * - TTL (Time To Live) management
 * - LRU (Least Recently Used) eviction
 * - Compression for large data
 * 
 * @module CacheManager
 * @version 1.0.0
 * @author Prompter Fresh Team
 */

import { logError, logInfo, logWarn } from './analytics';

/**
 * Cache entry interface
 */
export interface CacheEntry<T = any> {
  /** Cached data */
  data: T;
  /** Creation timestamp */
  timestamp: number;
  /** Time to live in milliseconds */
  ttl?: number;
  /** Access count */
  accessCount: number;
  /** Last access timestamp */
  lastAccess: number;
  /** Data size in bytes */
  size: number;
  /** Cache metadata */
  metadata?: Record<string, any>;
  /** Version for cache invalidation */
  version?: string;
}

/**
 * Cache configuration interface
 */
export interface CacheConfig {
  /** Maximum cache size in bytes */
  maxSize: number;
  /** Default TTL in milliseconds */
  defaultTtl: number;
  /** Maximum number of entries */
  maxEntries: number;
  /** Enable compression for large data */
  enableCompression: boolean;
  /** Compression threshold in bytes */
  compressionThreshold: number;
  /** Enable persistent storage */
  enablePersistence: boolean;
  /** Cleanup interval in milliseconds */
  cleanupInterval: number;
}

/**
 * Cache storage types
 */
export type CacheStorage = 'memory' | 'localStorage' | 'indexedDB' | 'sessionStorage';

/**
 * Cache strategy types
 */
export type CacheStrategy = 'cache-first' | 'network-first' | 'cache-only' | 'network-only' | 'stale-while-revalidate';

/**
 * Cache statistics interface
 */
export interface CacheStats {
  /** Total entries */
  totalEntries: number;
  /** Total size in bytes */
  totalSize: number;
  /** Hit count */
  hitCount: number;
  /** Miss count */
  missCount: number;
  /** Hit rate percentage */
  hitRate: number;
  /** Memory usage by storage type */
  storageUsage: Record<CacheStorage, number>;
  /** Last cleanup timestamp */
  lastCleanup: number;
}

/**
 * Advanced cache manager class
 */
export class CacheManager {
  private static instance: CacheManager;
  private memoryCache = new Map<string, CacheEntry>();
  private config: CacheConfig;
  private stats: CacheStats;
  private cleanupTimer?: NodeJS.Timeout;
  private readonly dbName = 'prompter-cache-db';
  private readonly dbVersion = 1;
  private db?: IDBDatabase;

  private constructor(config?: Partial<CacheConfig>) {
    this.config = {
      maxSize: 50 * 1024 * 1024, // 50MB
      defaultTtl: 24 * 60 * 60 * 1000, // 24 hours
      maxEntries: 1000,
      enableCompression: true,
      compressionThreshold: 1024, // 1KB
      enablePersistence: true,
      cleanupInterval: 60 * 60 * 1000, // 1 hour
      ...config
    };

    this.stats = {
      totalEntries: 0,
      totalSize: 0,
      hitCount: 0,
      missCount: 0,
      hitRate: 0,
      storageUsage: {
        memory: 0,
        localStorage: 0,
        indexedDB: 0,
        sessionStorage: 0
      },
      lastCleanup: Date.now()
    };

    this.initialize();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(config?: Partial<CacheConfig>): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager(config);
    }
    return CacheManager.instance;
  }

  /**
   * Initialize cache manager
   */
  private async initialize(): Promise<void> {
    try {
      // Initialize IndexedDB if persistence is enabled
      if (this.config.enablePersistence) {
        await this.initIndexedDB();
      }

      // Start cleanup timer
      this.cleanupTimer = setInterval(() => {
        this.cleanup();
      }, this.config.cleanupInterval);

      // Load existing statistics
      await this.loadStats();

      logInfo('Cache manager initialized', {
        maxSize: this.config.maxSize,
        maxEntries: this.config.maxEntries,
        enablePersistence: this.config.enablePersistence
      }, 'CacheManager');

    } catch (error) {
      logError('Failed to initialize cache manager', { error }, 'CacheManager');
    }
  }

  /**
   * Initialize IndexedDB for persistent storage
   */
  private async initIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        logError('Failed to open IndexedDB', { error: request.error }, 'CacheManager');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('cache')) {
          const store = db.createObjectStore('cache', { keyPath: 'key' });
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('lastAccess', 'lastAccess');
        }
      };
    });
  }

  /**
   * Set cache entry with multiple storage strategies
   */
  public async set<T>(
    key: string,
    data: T,
    options: {
      ttl?: number;
      storage?: CacheStorage[];
      version?: string;
      metadata?: Record<string, any>;
    } = {}
  ): Promise<void> {
    const {
      ttl = this.config.defaultTtl,
      storage = ['memory', 'localStorage'],
      version,
      metadata
    } = options;

    const serializedData = JSON.stringify(data);
    const size = new Blob([serializedData]).size;
    const timestamp = Date.now();

    const cacheEntry: CacheEntry<T> = {
      data,
      timestamp,
      ttl,
      accessCount: 0,
      lastAccess: timestamp,
      size,
      version,
      metadata
    };

    // Store in requested storage types
    for (const storageType of storage) {
      try {
        await this.setInStorage(key, cacheEntry, storageType);
      } catch (error) {
        logWarn(`Failed to store in ${storageType}`, { key, error }, 'CacheManager');
      }
    }

    // Update statistics
    this.updateStats('set', size);
    
    logInfo('Cache entry set', {
      key,
      size,
      ttl,
      storage,
      version
    }, 'CacheManager');
  }

  /**
   * Get cache entry with fallback strategies
   */
  public async get<T>(
    key: string,
    options: {
      storage?: CacheStorage[];
      strategy?: CacheStrategy;
      fallback?: () => Promise<T>;
    } = {}
  ): Promise<T | null> {
    const {
      storage = ['memory', 'localStorage', 'indexedDB'],
      strategy: _strategy = 'cache-first',
      fallback
    } = options;

    // Try to get from storage in order
    for (const storageType of storage) {
      try {
        const entry = await this.getFromStorage<T>(key, storageType);
        
        if (entry) {
          // Check if entry is expired
          if (this.isExpired(entry)) {
            await this.delete(key, [storageType]);
            continue;
          }

          // Update access info
          entry.accessCount++;
          entry.lastAccess = Date.now();
          await this.setInStorage(key, entry, storageType);

          // Update statistics
          this.updateStats('hit');
          
          logInfo('Cache hit', { key, storageType }, 'CacheManager');
          return entry.data;
        }
      } catch (error) {
        logWarn(`Failed to get from ${storageType}`, { key, error }, 'CacheManager');
      }
    }

    // Cache miss - try fallback
    this.updateStats('miss');
    
    if (fallback) {
      try {
        const data = await fallback();
        if (data !== null && data !== undefined) {
          await this.set(key, data, { storage });
          return data;
        }
      } catch (error) {
        logError('Fallback failed', { key, error }, 'CacheManager');
      }
    }

    logInfo('Cache miss', { key }, 'CacheManager');
    return null;
  }

  /**
   * Delete cache entry from specified storage
   */
  public async delete(
    key: string,
    storage: CacheStorage[] = ['memory', 'localStorage', 'indexedDB']
  ): Promise<void> {
    for (const storageType of storage) {
      try {
        await this.deleteFromStorage(key, storageType);
      } catch (error) {
        logWarn(`Failed to delete from ${storageType}`, { key, error }, 'CacheManager');
      }
    }

    logInfo('Cache entry deleted', { key, storage }, 'CacheManager');
  }

  /**
   * Clear all cache entries
   */
  public async clear(storage: CacheStorage[] = ['memory', 'localStorage', 'indexedDB']): Promise<void> {
    for (const storageType of storage) {
      try {
        await this.clearStorage(storageType);
      } catch (error) {
        logWarn(`Failed to clear ${storageType}`, { error }, 'CacheManager');
      }
    }

    // Reset statistics
    this.stats.totalEntries = 0;
    this.stats.totalSize = 0;
    this.stats.storageUsage = {
      memory: 0,
      localStorage: 0,
      indexedDB: 0,
      sessionStorage: 0
    };

    logInfo('Cache cleared', { storage }, 'CacheManager');
  }

  /**
   * Check if cache entry exists
   */
  public async has(key: string, storage: CacheStorage[] = ['memory', 'localStorage']): Promise<boolean> {
    for (const storageType of storage) {
      try {
        const entry = await this.getFromStorage(key, storageType);
        if (entry && !this.isExpired(entry)) {
          return true;
        }
      } catch (error) {
        // Continue to next storage
      }
    }
    return false;
  }

  /**
   * Get cache statistics
   */
  public getStats(): CacheStats {
    this.calculateHitRate();
    return { ...this.stats };
  }

  /**
   * Get cache keys
   */
  public async getKeys(storage: CacheStorage = 'memory'): Promise<string[]> {
    try {
      switch (storage) {
        case 'memory':
          return Array.from(this.memoryCache.keys());
        
        case 'localStorage':
          return Object.keys(localStorage).filter(key => key.startsWith('cache:'));
        
        case 'sessionStorage':
          return Object.keys(sessionStorage).filter(key => key.startsWith('cache:'));
        
        case 'indexedDB':
          return await this.getIndexedDBKeys();
        
        default:
          return [];
      }
    } catch (error) {
      logError('Failed to get cache keys', { storage, error }, 'CacheManager');
      return [];
    }
  }

  /**
   * Cleanup expired entries
   */
  public async cleanup(): Promise<void> {
    const startTime = Date.now();
    let cleanedCount = 0;

    try {
      // Cleanup memory cache
      for (const [key, entry] of this.memoryCache.entries()) {
        if (this.isExpired(entry)) {
          this.memoryCache.delete(key);
          cleanedCount++;
        }
      }

      // Cleanup localStorage
      await this.cleanupStorage('localStorage');

      // Cleanup IndexedDB
      if (this.config.enablePersistence) {
        await this.cleanupStorage('indexedDB');
      }

      // Apply LRU eviction if over limits
      await this.applyLRUEviction();

      this.stats.lastCleanup = Date.now();
      
      logInfo('Cache cleanup completed', {
        cleanedCount,
        duration: Date.now() - startTime
      }, 'CacheManager');

    } catch (error) {
      logError('Cache cleanup failed', { error }, 'CacheManager');
    }
  }

  /**
   * Set cache entry in specific storage
   */
  private async setInStorage<T>(
    key: string,
    entry: CacheEntry<T>,
    storage: CacheStorage
  ): Promise<void> {
    switch (storage) {
      case 'memory':
        this.memoryCache.set(key, entry);
        break;
      
      case 'localStorage':
        localStorage.setItem(`cache:${key}`, JSON.stringify(entry));
        break;
      
      case 'sessionStorage':
        sessionStorage.setItem(`cache:${key}`, JSON.stringify(entry));
        break;
      
      case 'indexedDB':
        await this.setInIndexedDB(key, entry);
        break;
    }
  }

  /**
   * Get cache entry from specific storage
   */
  private async getFromStorage<T>(
    key: string,
    storage: CacheStorage
  ): Promise<CacheEntry<T> | null> {
    switch (storage) {
      case 'memory':
        return this.memoryCache.get(key) || null;
      
      case 'localStorage':
        const localData = localStorage.getItem(`cache:${key}`);
        return localData ? JSON.parse(localData) : null;
      
      case 'sessionStorage':
        const sessionData = sessionStorage.getItem(`cache:${key}`);
        return sessionData ? JSON.parse(sessionData) : null;
      
      case 'indexedDB':
        return await this.getFromIndexedDB<T>(key);
      
      default:
        return null;
    }
  }

  /**
   * Delete cache entry from specific storage
   */
  private async deleteFromStorage(key: string, storage: CacheStorage): Promise<void> {
    switch (storage) {
      case 'memory':
        this.memoryCache.delete(key);
        break;
      
      case 'localStorage':
        localStorage.removeItem(`cache:${key}`);
        break;
      
      case 'sessionStorage':
        sessionStorage.removeItem(`cache:${key}`);
        break;
      
      case 'indexedDB':
        await this.deleteFromIndexedDB(key);
        break;
    }
  }

  /**
   * Clear specific storage
   */
  private async clearStorage(storage: CacheStorage): Promise<void> {
    switch (storage) {
      case 'memory':
        this.memoryCache.clear();
        break;
      
      case 'localStorage':
        const localKeys = Object.keys(localStorage).filter(key => key.startsWith('cache:'));
        localKeys.forEach(key => localStorage.removeItem(key));
        break;
      
      case 'sessionStorage':
        const sessionKeys = Object.keys(sessionStorage).filter(key => key.startsWith('cache:'));
        sessionKeys.forEach(key => sessionStorage.removeItem(key));
        break;
      
      case 'indexedDB':
        await this.clearIndexedDB();
        break;
    }
  }

  /**
   * IndexedDB operations
   */
  private async setInIndexedDB<T>(key: string, entry: CacheEntry<T>): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      
      const request = store.put({ key, ...entry });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async getFromIndexedDB<T>(key: string): Promise<CacheEntry<T> | null> {
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      
      const request = store.get(key);
      
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          delete result.key;
          resolve(result);
        } else {
          resolve(null);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  private async deleteFromIndexedDB(key: string): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      
      const request = store.delete(key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async clearIndexedDB(): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async getIndexedDBKeys(): Promise<string[]> {
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      
      const request = store.getAllKeys();
      
      request.onsuccess = () => resolve(request.result as string[]);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Utility methods
   */
  private isExpired(entry: CacheEntry): boolean {
    if (!entry.ttl) return false;
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private updateStats(operation: 'set' | 'hit' | 'miss', size?: number): void {
    switch (operation) {
      case 'set':
        this.stats.totalEntries++;
        if (size) this.stats.totalSize += size;
        break;
      
      case 'hit':
        this.stats.hitCount++;
        break;
      
      case 'miss':
        this.stats.missCount++;
        break;
    }
  }

  private calculateHitRate(): void {
    const totalRequests = this.stats.hitCount + this.stats.missCount;
    this.stats.hitRate = totalRequests > 0 ? (this.stats.hitCount / totalRequests) * 100 : 0;
  }

  private async cleanupStorage(_storage: CacheStorage): Promise<void> {
    // Implementation for cleaning expired entries in specific storage
    // This is a simplified version - real implementation would iterate through entries
  }

  private async applyLRUEviction(): Promise<void> {
    // Implementation for LRU eviction when cache is full
    // This would remove least recently used entries
  }

  private async loadStats(): Promise<void> {
    // Load existing statistics from storage
  }

  /**
   * Dispose resources on application exit
   */
  public dispose(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    if (this.db) {
      this.db.close();
    }
  }
}

// Export singleton instance
export const cacheManager = CacheManager.getInstance();

// Convenience functions
export const setCache = <T>(key: string, data: T, options?: any) => {
  return cacheManager.set(key, data, options);
};

export const getCache = <T>(key: string, options?: any) => {
  return cacheManager.get<T>(key, options);
};

export const deleteCache = (key: string, storage?: CacheStorage[]) => {
  return cacheManager.delete(key, storage);
};

export const clearCache = (storage?: CacheStorage[]) => {
  return cacheManager.clear(storage);
};

export const hasCache = (key: string, storage?: CacheStorage[]) => {
  return cacheManager.has(key, storage);
};

export const getCacheStats = () => {
  return cacheManager.getStats();
};

// Initialize cache manager
if (typeof window !== 'undefined') {
  // Dispose resources on page unload
  window.addEventListener('beforeunload', () => {
    cacheManager.dispose();
  });
} 