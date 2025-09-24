/**
 * Offline Data Manager for FlowGrow PWA
 * Handles IndexedDB operations for offline data storage and synchronization
 */

export interface OfflineProperty {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  metadata: Record<string, any>;
  lastUpdated: number;
  isOffline: boolean;
}

export interface OfflineFavorite {
  propertyId: string;
  userId: string;
  addedAt: number;
  notes?: string;
  tags?: string[];
}

export interface OfflinePortfolio {
  id: string;
  name: string;
  properties: string[];
  createdAt: number;
  lastUpdated: number;
}

export interface SyncQueueItem {
  id: string;
  type: 'property' | 'favorite' | 'portfolio' | 'bid';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  retryCount: number;
}

class OfflineManager {
  private dbName = 'FlowGrowOffline';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('properties')) {
          const propertyStore = db.createObjectStore('properties', { keyPath: 'id' });
          propertyStore.createIndex('lastUpdated', 'lastUpdated', { unique: false });
          propertyStore.createIndex('isOffline', 'isOffline', { unique: false });
        }

        if (!db.objectStoreNames.contains('favorites')) {
          const favoriteStore = db.createObjectStore('favorites', { keyPath: 'propertyId' });
          favoriteStore.createIndex('userId', 'userId', { unique: false });
          favoriteStore.createIndex('addedAt', 'addedAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('portfolios')) {
          const portfolioStore = db.createObjectStore('portfolios', { keyPath: 'id' });
          portfolioStore.createIndex('lastUpdated', 'lastUpdated', { unique: false });
        }

        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
          syncStore.createIndex('type', 'type', { unique: false });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  // Property operations
  async saveProperty(property: OfflineProperty): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['properties'], 'readwrite');
    const store = transaction.objectStore('properties');
    await store.put({ ...property, lastUpdated: Date.now() });
  }

  async getProperty(id: string): Promise<OfflineProperty | null> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['properties'], 'readonly');
    const store = transaction.objectStore('properties');
    const result = await store.get(id);
    return result || null;
  }

  async getAllProperties(): Promise<OfflineProperty[]> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['properties'], 'readonly');
    const store = transaction.objectStore('properties');
    const result = await store.getAll();
    return result.sort((a, b) => b.lastUpdated - a.lastUpdated);
  }

  async deleteProperty(id: string): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['properties'], 'readwrite');
    const store = transaction.objectStore('properties');
    await store.delete(id);
  }

  // Favorites operations
  async saveFavorite(favorite: OfflineFavorite): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['favorites'], 'readwrite');
    const store = transaction.objectStore('favorites');
    await store.put(favorite);
  }

  async getFavorites(userId: string): Promise<OfflineFavorite[]> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['favorites'], 'readonly');
    const store = transaction.objectStore('favorites');
    const index = store.index('userId');
    const result = await index.getAll(userId);
    return result.sort((a, b) => b.addedAt - a.addedAt);
  }

  async removeFavorite(propertyId: string): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['favorites'], 'readwrite');
    const store = transaction.objectStore('favorites');
    await store.delete(propertyId);
  }

  // Portfolio operations
  async savePortfolio(portfolio: OfflinePortfolio): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['portfolios'], 'readwrite');
    const store = transaction.objectStore('portfolios');
    await store.put({ ...portfolio, lastUpdated: Date.now() });
  }

  async getPortfolios(): Promise<OfflinePortfolio[]> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['portfolios'], 'readonly');
    const store = transaction.objectStore('portfolios');
    const result = await store.getAll();
    return result.sort((a, b) => b.lastUpdated - a.lastUpdated);
  }

  async deletePortfolio(id: string): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['portfolios'], 'readwrite');
    const store = transaction.objectStore('portfolios');
    await store.delete(id);
  }

  // Sync queue operations
  async addToSyncQueue(item: Omit<SyncQueueItem, 'id'>): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    await store.add({
      ...item,
      timestamp: Date.now(),
      retryCount: 0
    });
  }

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['syncQueue'], 'readonly');
    const store = transaction.objectStore('syncQueue');
    const result = await store.getAll();
    return result.sort((a, b) => a.timestamp - b.timestamp);
  }

  async removeFromSyncQueue(id: string): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    await store.delete(id);
  }

  async incrementRetryCount(id: string): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    const item = await store.get(id);
    if (item) {
      item.retryCount += 1;
      await store.put(item);
    }
  }

  // Settings operations
  async saveSetting(key: string, value: any): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['settings'], 'readwrite');
    const store = transaction.objectStore('settings');
    await store.put({ key, value, timestamp: Date.now() });
  }

  async getSetting(key: string): Promise<any> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['settings'], 'readonly');
    const store = transaction.objectStore('settings');
    const result = await store.get(key);
    return result?.value || null;
  }

  // Utility methods
  async clearAllData(): Promise<void> {
    if (!this.db) await this.init();
    
    const stores = ['properties', 'favorites', 'portfolios', 'syncQueue', 'settings'];
    const transaction = this.db!.transaction(stores, 'readwrite');
    
    for (const storeName of stores) {
      const store = transaction.objectStore(storeName);
      await store.clear();
    }
  }

  async getStorageUsage(): Promise<{ used: number; available: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage || 0,
        available: estimate.quota || 0
      };
    }
    return { used: 0, available: 0 };
  }

  // Network status helpers
  isOnline(): boolean {
    return navigator.onLine;
  }

  async waitForOnline(): Promise<void> {
    return new Promise((resolve) => {
      if (this.isOnline()) {
        resolve();
        return;
      }

      const handleOnline = () => {
        window.removeEventListener('online', handleOnline);
        resolve();
      };

      window.addEventListener('online', handleOnline);
    });
  }

  // Background sync helpers
  async registerBackgroundSync(tag: string): Promise<void> {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register(tag);
    }
  }

  async triggerBackgroundSync(): Promise<void> {
    await this.registerBackgroundSync('property-sync');
    await this.registerBackgroundSync('favorites-sync');
  }
}

// Create singleton instance
export const offlineManager = new OfflineManager();

// Initialize on module load
if (typeof window !== 'undefined') {
  offlineManager.init().catch(console.error);
}

export default offlineManager;
