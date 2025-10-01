import { FavoriteProperty, FavoritesList, FavoritesFilter, FavoritesAnalytics, PriceAlert, FavoritesExport, FavoritesImport } from '@/types/favorites';

class FavoritesService {
  // Mock data storage
  private favorites: Map<string, FavoriteProperty> = new Map();
  private lists: Map<string, FavoritesList> = new Map();
  private priceAlerts: Map<string, PriceAlert> = new Map();

  // Initialize with mock data
  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock favorites
    const mockFavorites: FavoriteProperty[] = [
      {
        id: 'fav_1',
        userId: 'user_1',
        propertyId: 'prop_1',
        property: {
          id: 'prop_1',
          title: 'Modern Downtown Apartment',
          price: 450000,
          imageUrl: '/images/properties/apartment1.jpg',
          bedrooms: 2,
          bathrooms: 2,
          squareFeet: 1200,
          propertyType: 'Apartment',
          location: 'Downtown',
          description: 'Beautiful modern apartment in the heart of downtown',
          amenities: ['Pool', 'Gym', 'Parking'],
          yearBuilt: 2020,
          petFriendly: true,
          hasPool: true,
          hasGym: true,
        },
        addedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Great location, close to work',
        tags: ['downtown', 'modern', 'work'],
        priority: 'high',
        status: 'active',
        lastViewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        viewCount: 5,
        priceAlerts: [],
        customFields: {},
      },
      {
        id: 'fav_2',
        userId: 'user_1',
        propertyId: 'prop_2',
        property: {
          id: 'prop_2',
          title: 'Suburban Family Home',
          price: 750000,
          imageUrl: '/images/properties/house1.jpg',
          bedrooms: 4,
          bathrooms: 3,
          squareFeet: 2500,
          propertyType: 'House',
          location: 'Suburbs',
          description: 'Perfect family home with large backyard',
          amenities: ['Garage', 'Garden', 'Fireplace'],
          yearBuilt: 2015,
          hasGarden: true,
          hasGarage: true,
          hasFireplace: true,
        },
        addedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Great for family, good schools nearby',
        tags: ['family', 'suburbs', 'schools'],
        priority: 'medium',
        status: 'active',
        lastViewedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        viewCount: 3,
        priceAlerts: [],
        customFields: {},
      },
      {
        id: 'fav_3',
        userId: 'user_1',
        propertyId: 'prop_3',
        property: {
          id: 'prop_3',
          title: 'Luxury Beachfront Villa',
          price: 1200000,
          imageUrl: '/images/properties/villa1.jpg',
          bedrooms: 5,
          bathrooms: 4,
          squareFeet: 3500,
          propertyType: 'Villa',
          location: 'Beachfront',
          description: 'Stunning beachfront villa with ocean views',
          amenities: ['Pool', 'Beach Access', 'Security'],
          yearBuilt: 2018,
          hasPool: true,
          hasSecurity: true,
        },
        addedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Dream home, but need to save more',
        tags: ['luxury', 'beachfront', 'dream'],
        priority: 'low',
        status: 'active',
        lastViewedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        viewCount: 8,
        priceAlerts: [],
        customFields: {},
      },
    ];

    mockFavorites.forEach(favorite => {
      this.favorites.set(favorite.id, favorite);
    });

    // Mock lists
    const mockLists: FavoritesList[] = [
      {
        id: 'list_1',
        userId: 'user_1',
        name: 'First Home',
        description: 'Properties for first-time home buyers',
        isPublic: false,
        isDefault: true,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        propertyIds: ['prop_1', 'prop_2'],
        tags: ['first-home'],
        color: '#3B82F6',
        icon: '🏠',
      },
      {
        id: 'list_2',
        userId: 'user_1',
        name: 'Investment Properties',
        description: 'Properties for rental investment',
        isPublic: true,
        isDefault: false,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        propertyIds: ['prop_1'],
        tags: ['investment'],
        color: '#10B981',
        icon: '💰',
      },
    ];

    mockLists.forEach(list => {
      this.lists.set(list.id, list);
    });

    // Mock price alerts
    const mockPriceAlerts: PriceAlert[] = [
      {
        id: 'alert_1',
        propertyId: 'prop_1',
        userId: 'user_1',
        type: 'price_drop',
        threshold: 0.05, // 5% drop
        isActive: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        notificationMethods: ['email', 'push'],
        frequency: 'immediate',
      },
      {
        id: 'alert_2',
        propertyId: 'prop_2',
        userId: 'user_1',
        type: 'target_price',
        targetPrice: 700000,
        isActive: true,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        notificationMethods: ['email'],
        frequency: 'daily',
      },
    ];

    mockPriceAlerts.forEach(alert => {
      this.priceAlerts.set(alert.id, alert);
    });
  }

  // Get favorites for a user
  async getFavorites(userId: string, filters?: FavoritesFilter): Promise<{
    favorites: FavoriteProperty[];
    totalCount: number;
    hasMore: boolean;
  }> {
    const userFavorites = Array.from(this.favorites.values())
      .filter(fav => fav.userId === userId && fav.status === 'active');

    let filteredFavorites = userFavorites;

    if (filters) {
      filteredFavorites = this.applyFilters(userFavorites, filters);
    }

    return {
      favorites: filteredFavorites,
      totalCount: filteredFavorites.length,
      hasMore: false,
    };
  }

  // Apply filters to favorites
  private applyFilters(favorites: FavoriteProperty[], filters: FavoritesFilter): FavoriteProperty[] {
    return favorites.filter(favorite => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          favorite.property.title.toLowerCase().includes(searchLower) ||
          favorite.property.location.toLowerCase().includes(searchLower) ||
          favorite.notes?.toLowerCase().includes(searchLower) ||
          favorite.tags?.some(tag => tag.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Property type filter
      if (filters.propertyType && favorite.property.propertyType !== filters.propertyType) {
        return false;
      }

      // Price range filter
      if (filters.priceRange) {
        const price = favorite.property.price;
        if (price < filters.priceRange.min || price > filters.priceRange.max) {
          return false;
        }
      }

      // Location filter
      if (filters.location && !favorite.property.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => 
          favorite.tags?.includes(tag)
        );
        if (!hasMatchingTag) return false;
      }

      // Priority filter
      if (filters.priority && favorite.priority !== filters.priority) {
        return false;
      }

      // Status filter
      if (filters.status && favorite.status !== filters.status) {
        return false;
      }

      // Added date range filter
      if (filters.addedDateRange) {
        const addedDate = new Date(favorite.addedAt);
        const startDate = new Date(filters.addedDateRange.start);
        const endDate = new Date(filters.addedDateRange.end);
        
        if (addedDate < startDate || addedDate > endDate) {
          return false;
        }
      }

      // Has notes filter
      if (filters.hasNotes !== undefined) {
        const hasNotes = Boolean(favorite.notes);
        if (hasNotes !== filters.hasNotes) return false;
      }

      // Has price alerts filter
      if (filters.hasPriceAlerts !== undefined) {
        const hasAlerts = favorite.priceAlerts && favorite.priceAlerts.length > 0;
        if (hasAlerts !== filters.hasPriceAlerts) return false;
      }

      return true;
    });
  }

  // Add favorite
  async addFavorite(
    userId: string, 
    propertyId: string, 
    notes?: string, 
    tags?: string[], 
    priority?: string
  ): Promise<FavoriteProperty> {
    const favoriteId = `fav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Mock property data - in real app, this would come from property service
    const mockProperty = {
      id: propertyId,
      title: `Property ${propertyId}`,
      price: Math.floor(Math.random() * 1000000) + 200000,
      imageUrl: `/images/properties/property${propertyId}.jpg`,
      bedrooms: Math.floor(Math.random() * 4) + 1,
      bathrooms: Math.floor(Math.random() * 3) + 1,
      squareFeet: Math.floor(Math.random() * 2000) + 800,
      propertyType: ['House', 'Apartment', 'Condo', 'Villa'][Math.floor(Math.random() * 4)],
      location: ['Downtown', 'Suburbs', 'Beachfront', 'City Center'][Math.floor(Math.random() * 4)],
    };

    const favorite: FavoriteProperty = {
      id: favoriteId,
      userId,
      propertyId,
      property: mockProperty,
      addedAt: new Date().toISOString(),
      notes,
      tags,
      priority: priority as any || 'medium',
      status: 'active',
      lastViewedAt: new Date().toISOString(),
      viewCount: 0,
      priceAlerts: [],
      customFields: {},
    };

    this.favorites.set(favoriteId, favorite);
    return favorite;
  }

  // Remove favorite
  async removeFavorite(favoriteId: string): Promise<void> {
    this.favorites.delete(favoriteId);
  }

  // Update favorite
  async updateFavorite(favoriteId: string, updates: Partial<FavoriteProperty>): Promise<FavoriteProperty> {
    const favorite = this.favorites.get(favoriteId);
    if (!favorite) {
      throw new Error('Favorite not found');
    }

    const updatedFavorite = { ...favorite, ...updates };
    this.favorites.set(favoriteId, updatedFavorite);
    return updatedFavorite;
  }

  // Toggle favorite
  async toggleFavorite(userId: string, propertyId: string): Promise<boolean> {
    const existingFavorite = Array.from(this.favorites.values())
      .find(fav => fav.userId === userId && fav.propertyId === propertyId && fav.status === 'active');

    if (existingFavorite) {
      await this.removeFavorite(existingFavorite.id);
      return false;
    } else {
      await this.addFavorite(userId, propertyId);
      return true;
    }
  }

  // Check if property is favorited
  isFavorited(userId: string, propertyId: string): boolean {
    return Array.from(this.favorites.values())
      .some(fav => fav.userId === userId && fav.propertyId === propertyId && fav.status === 'active');
  }

  // Get favorite by property ID
  getFavorite(userId: string, propertyId: string): FavoriteProperty | null {
    return Array.from(this.favorites.values())
      .find(fav => fav.userId === userId && fav.propertyId === propertyId && fav.status === 'active') || null;
  }

  // Get analytics
  async getAnalytics(userId: string): Promise<FavoritesAnalytics> {
    const userFavorites = Array.from(this.favorites.values())
      .filter(fav => fav.userId === userId && fav.status === 'active');

    const prices = userFavorites.map(fav => fav.property.price);
    const propertyTypes = userFavorites.reduce((acc, fav) => {
      acc[fav.property.propertyType] = (acc[fav.property.propertyType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const locations = userFavorites.reduce((acc, fav) => {
      acc[fav.property.location] = (acc[fav.property.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const tags = userFavorites.reduce((acc, fav) => {
      fav.tags?.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const now = new Date();
    const averageDaysInFavorites = userFavorites.reduce((sum, fav) => {
      const addedDate = new Date(fav.addedAt);
      const daysDiff = (now.getTime() - addedDate.getTime()) / (1000 * 60 * 60 * 24);
      return sum + daysDiff;
    }, 0) / userFavorites.length || 0;

    return {
      totalFavorites: userFavorites.length,
      averagePrice: prices.reduce((sum, price) => sum + price, 0) / prices.length || 0,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices),
      },
      propertyTypes,
      locations,
      averageDaysInFavorites,
      mostViewedProperty: userFavorites.reduce((max, fav) => 
        fav.viewCount > (max.viewCount || 0) ? fav : max
      ).propertyId,
      recentlyAdded: userFavorites
        .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
        .slice(0, 5),
      priceChanges: {
        increased: 0, // Would be calculated from price history
        decreased: 0,
        unchanged: userFavorites.length,
      },
      tags,
      monthlyTrends: [], // Would be calculated from historical data
    };
  }

  // Create list
  async createList(userId: string, name: string, description?: string, isPublic = false): Promise<string> {
    const listId = `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const list: FavoritesList = {
      id: listId,
      userId,
      name,
      description,
      isPublic,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      propertyIds: [],
      tags: [],
    };

    this.lists.set(listId, list);
    return listId;
  }

  // Get lists
  async getLists(userId: string): Promise<FavoritesList[]> {
    return Array.from(this.lists.values())
      .filter(list => list.userId === userId);
  }

  // Add to list
  async addToList(listId: string, propertyId: string): Promise<void> {
    const list = this.lists.get(listId);
    if (!list) {
      throw new Error('List not found');
    }

    if (!list.propertyIds.includes(propertyId)) {
      list.propertyIds.push(propertyId);
      list.updatedAt = new Date().toISOString();
      this.lists.set(listId, list);
    }
  }

  // Remove from list
  async removeFromList(listId: string, propertyId: string): Promise<void> {
    const list = this.lists.get(listId);
    if (!list) {
      throw new Error('List not found');
    }

    list.propertyIds = list.propertyIds.filter(id => id !== propertyId);
    list.updatedAt = new Date().toISOString();
    this.lists.set(listId, list);
  }

  // Delete list
  async deleteList(listId: string): Promise<void> {
    this.lists.delete(listId);
  }

  // Export favorites
  async exportFavorites(userId: string, format: 'json' | 'csv' | 'pdf'): Promise<FavoritesExport> {
    const userFavorites = Array.from(this.favorites.values())
      .filter(fav => fav.userId === userId && fav.status === 'active');

    return {
      format,
      data: userFavorites,
      metadata: {
        exportedAt: new Date().toISOString(),
        totalCount: userFavorites.length,
        userId,
      },
    };
  }

  // Import favorites
  async importFavorites(userId: string, data: any[]): Promise<FavoritesImport> {
    const errors: string[] = [];
    const warnings: string[] = [];
    let importedCount = 0;
    let skippedCount = 0;

    for (const item of data) {
      try {
        if (!item.propertyId) {
          errors.push(`Missing propertyId for item: ${JSON.stringify(item)}`);
          skippedCount++;
          continue;
        }

        await this.addFavorite(
          userId,
          item.propertyId,
          item.notes,
          item.tags,
          item.priority
        );
        importedCount++;
      } catch (error) {
        errors.push(`Failed to import item: ${error}`);
        skippedCount++;
      }
    }

    return {
      format: 'json',
      data,
      validation: {
        isValid: errors.length === 0,
        errors,
        warnings,
        importedCount,
        skippedCount,
      },
    };
  }

  // Create price alert
  async createPriceAlert(propertyId: string, userId: string, alert: Omit<PriceAlert, 'id' | 'propertyId' | 'userId'>): Promise<void> {
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const priceAlert: PriceAlert = {
      id: alertId,
      propertyId,
      userId,
      ...alert,
    };

    this.priceAlerts.set(alertId, priceAlert);
  }

  // Update price alert
  async updatePriceAlert(alertId: string, updates: Partial<PriceAlert>): Promise<void> {
    const alert = this.priceAlerts.get(alertId);
    if (!alert) {
      throw new Error('Price alert not found');
    }

    const updatedAlert = { ...alert, ...updates };
    this.priceAlerts.set(alertId, updatedAlert);
  }

  // Delete price alert
  async deletePriceAlert(alertId: string): Promise<void> {
    this.priceAlerts.delete(alertId);
  }

  // Get price alerts for property
  async getPriceAlerts(propertyId: string, userId: string): Promise<PriceAlert[]> {
    return Array.from(this.priceAlerts.values())
      .filter(alert => alert.propertyId === propertyId && alert.userId === userId);
  }

  // Bulk operations
  async bulkAdd(userId: string, propertyIds: string[]): Promise<void> {
    for (const propertyId of propertyIds) {
      await this.addFavorite(userId, propertyId);
    }
  }

  async bulkRemove(favoriteIds: string[]): Promise<void> {
    for (const favoriteId of favoriteIds) {
      await this.removeFavorite(favoriteId);
    }
  }

  async bulkUpdate(favoriteIds: string[], updates: Partial<FavoriteProperty>): Promise<void> {
    for (const favoriteId of favoriteIds) {
      await this.updateFavorite(favoriteId, updates);
    }
  }
}

export const favoritesService = new FavoritesService();
