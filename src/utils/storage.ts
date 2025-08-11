/**
 * Mobile-safe storage utility
 * Handles localStorage/sessionStorage gracefully on mobile devices
 */

import { Capacitor } from '@capacitor/core';

export interface StorageOptions {
  fallbackToMemory?: boolean;
  prefix?: string;
  serialize?: boolean;
}

/**
 * In-memory storage fallback for when localStorage is not available
 */
class MemoryStorage {
  private storage = new Map<string, string>();

  getItem(key: string): string | null {
    return this.storage.get(key) || null;
  }

  setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }

  removeItem(key: string): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }

  get length(): number {
    return this.storage.size;
  }

  key(index: number): string | null {
    const keys = Array.from(this.storage.keys());
    return keys[index] || null;
  }
}

/**
 * Safe storage implementation
 */
class SafeStorage {
  private memoryStorage = new MemoryStorage();
  private isNative = Capacitor.isNativePlatform();

  /**
   * Check if storage is available
   */
  private isStorageAvailable(storage: Storage): boolean {
    try {
      const test = '__storage_test__';
      storage.setItem(test, test);
      storage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get storage instance with fallback
   */
  private getStorage(type: 'local' | 'session'): Storage | MemoryStorage {
    try {
      const storage = type === 'local' ? localStorage : sessionStorage;
      
      if (this.isStorageAvailable(storage)) {
        return storage;
      }
    } catch (error) {
      console.warn(`${type}Storage not available, falling back to memory storage`);
    }
    
    return this.memoryStorage;
  }

  /**
   * Set item in storage
   */
  setItem(key: string, value: any, options: StorageOptions = {}): void {
    const { fallbackToMemory = true, prefix = '', serialize = true } = options;
    const finalKey = prefix ? `${prefix}:${key}` : key;
    const finalValue = serialize ? JSON.stringify(value) : value;

    try {
      const storage = this.getStorage('local');
      storage.setItem(finalKey, finalValue);
    } catch (error) {
      console.warn('Failed to set item in storage:', error);
      
      if (fallbackToMemory) {
        this.memoryStorage.setItem(finalKey, finalValue);
      }
    }
  }

  /**
   * Get item from storage
   */
  getItem<T = any>(key: string, options: StorageOptions = {}): T | null {
    const { fallbackToMemory = true, prefix = '', serialize = true } = options;
    const finalKey = prefix ? `${prefix}:${key}` : key;

    try {
      const storage = this.getStorage('local');
      const value = storage.getItem(finalKey);
      
      if (value === null) {
        return null;
      }
      
      return serialize ? JSON.parse(value) : (value as T);
    } catch (error) {
      console.warn('Failed to get item from storage:', error);
      
      if (fallbackToMemory) {
        const value = this.memoryStorage.getItem(finalKey);
        if (value === null) return null;
        return serialize ? JSON.parse(value) : (value as T);
      }
      
      return null;
    }
  }

  /**
   * Remove item from storage
   */
  removeItem(key: string, options: StorageOptions = {}): void {
    const { fallbackToMemory = true, prefix = '' } = options;
    const finalKey = prefix ? `${prefix}:${key}` : key;

    try {
      const storage = this.getStorage('local');
      storage.removeItem(finalKey);
    } catch (error) {
      console.warn('Failed to remove item from storage:', error);
    }

    if (fallbackToMemory) {
      this.memoryStorage.removeItem(finalKey);
    }
  }

  /**
   * Clear storage
   */
  clear(options: StorageOptions = {}): void {
    const { fallbackToMemory = true, prefix = '' } = options;

    try {
      const storage = this.getStorage('local');
      
      if (prefix) {
        // Clear only items with prefix
        const keys = [];
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          if (key && key.startsWith(`${prefix}:`)) {
            keys.push(key);
          }
        }
        keys.forEach(key => storage.removeItem(key));
      } else {
        storage.clear();
      }
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }

    if (fallbackToMemory) {
      this.memoryStorage.clear();
    }
  }

  /**
   * Check if item exists
   */
  hasItem(key: string, options: StorageOptions = {}): boolean {
    return this.getItem(key, options) !== null;
  }

  /**
   * Get all keys
   */
  getKeys(options: StorageOptions = {}): string[] {
    const { prefix = '' } = options;
    const keys: string[] = [];

    try {
      const storage = this.getStorage('local');
      
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key) {
          if (prefix) {
            if (key.startsWith(`${prefix}:`)) {
              keys.push(key.substring(prefix.length + 1));
            }
          } else {
            keys.push(key);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to get keys from storage:', error);
    }

    return keys;
  }

  /**
   * Get storage info
   */
  getInfo(): {
    isNative: boolean;
    hasLocalStorage: boolean;
    hasSessionStorage: boolean;
    storageType: 'localStorage' | 'sessionStorage' | 'memory';
  } {
    return {
      isNative: this.isNative,
      hasLocalStorage: this.isStorageAvailable(localStorage),
      hasSessionStorage: this.isStorageAvailable(sessionStorage),
      storageType: this.isStorageAvailable(localStorage) ? 'localStorage' : 'memory'
    };
  }
}

// Export singleton instance
export const safeStorage = new SafeStorage();

// Convenience functions
export const setStorageItem = (key: string, value: any, options?: StorageOptions) => {
  safeStorage.setItem(key, value, options);
};

export const getStorageItem = <T = any>(key: string, options?: StorageOptions): T | null => {
  return safeStorage.getItem<T>(key, options);
};

export const removeStorageItem = (key: string, options?: StorageOptions) => {
  safeStorage.removeItem(key, options);
};

export const clearStorage = (options?: StorageOptions) => {
  safeStorage.clear(options);
};

export const hasStorageItem = (key: string, options?: StorageOptions): boolean => {
  return safeStorage.hasItem(key, options);
};

export const getStorageKeys = (options?: StorageOptions): string[] => {
  return safeStorage.getKeys(options);
};

export const getStorageInfo = () => {
  return safeStorage.getInfo();
};

// Legacy localStorage replacement (for gradual migration)
export const createSafeLocalStorage = () => {
  const storage = new SafeStorage();
  
  return {
    getItem: (key: string) => storage.getItem(key, { serialize: false }),
    setItem: (key: string, value: string) => storage.setItem(key, value, { serialize: false }),
    removeItem: (key: string) => storage.removeItem(key),
    clear: () => storage.clear(),
    get length() { return storage.getKeys().length; },
    key: (index: number) => storage.getKeys()[index] || null
  };
};

export default safeStorage; 