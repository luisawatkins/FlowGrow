import {
  Wishlist,
  WishlistProperty,
  CreateWishlistRequest,
  UpdateWishlistRequest,
  AddPropertyToWishlistRequest,
  RemovePropertyFromWishlistRequest,
  WishlistListResponse,
  WishlistResponse,
  WishlistError,
  PriceAlert,
  CreatePriceAlertRequest,
  UpdatePriceAlertRequest,
  PriceAlertListResponse,
  PriceAlertResponse,
  PriceAlertError,
  Property,
  WishlistAnalytics,
  PriceChangeHistory,
  AlertStatistics
} from '@/types/wishlist';

// Mock data for development
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Condo',
    description: 'Beautiful modern condo in the heart of downtown',
    price: 450000,
    currency: 'USD',
    location: {
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zipCode: '10001',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      neighborhood: 'Downtown',
      schoolDistrict: 'NYC District 2'
    },
    details: {
      type: 'condo' as any,
      status: 'for_sale' as any,
      yearBuilt: 2020,
      lotSize: 0,
      livingArea: 1200,
      bedrooms: 2,
      bathrooms: 2,
      garageSpaces: 1,
      stories: 1,
      condition: 'excellent' as any,
      style: 'Modern'
    },
    images: ['/images/property1-1.jpg', '/images/property1-2.jpg'],
    features: ['Hardwood Floors', 'Updated Kitchen', 'Balcony', 'In-Unit Laundry'],
    amenities: ['Gym', 'Pool', 'Concierge', 'Parking'],
    specifications: {
      heating: 'Central',
      cooling: 'Central',
      flooring: ['Hardwood', 'Tile'],
      roof: 'Flat',
      exterior: 'Brick',
      foundation: 'Concrete',
      utilities: ['Gas', 'Electric', 'Water', 'Public Transit'],
      appliances: ['Dishwasher', 'Microwave', 'Refrigerator'],
      security: ['Key Card', 'Security Cameras'],
      accessibility: ['Elevator', 'Wheelchair Accessible']
    },
    financial: {
      price: 450000,
      pricePerSqFt: 375,
      taxes: 800,
      hoaFees: 400,
      insurance: 150,
      utilities: 200,
      maintenance: 100,
      totalMonthlyCost: 1650,
      appreciation: 0.05,
      rentalIncome: 3000,
      capRate: 0.08,
      roi: 0.12
    },
    metadata: {
      listingDate: new Date('2024-01-15'),
      lastUpdated: new Date('2024-01-20'),
      views: 1250,
      favorites: 45,
      shares: 12,
      agent: {
        id: 'agent1',
        name: 'John Smith',
        company: 'Downtown Realty',
        phone: '(555) 123-4567',
        email: 'john@downtownrealty.com'
      },
      source: 'MLS',
      mlsId: 'MLS123456'
    }
  },
  {
    id: '2',
    title: 'Charming Suburban House',
    description: 'Beautiful family home in quiet suburban neighborhood',
    price: 350000,
    currency: 'USD',
    location: {
      address: '456 Oak Ave',
      city: 'Austin',
      state: 'TX',
      country: 'USA',
      zipCode: '78701',
      coordinates: { lat: 30.2672, lng: -97.7431 },
      neighborhood: 'Suburban',
      schoolDistrict: 'Austin ISD'
    },
    details: {
      type: 'single_family' as any,
      status: 'for_sale' as any,
      yearBuilt: 2015,
      lotSize: 8000,
      livingArea: 2000,
      bedrooms: 3,
      bathrooms: 2,
      garageSpaces: 2,
      stories: 2,
      condition: 'good' as any,
      style: 'Traditional'
    },
    images: ['/images/property2-1.jpg', '/images/property2-2.jpg'],
    features: ['Fireplace', 'Hardwood Floors', 'Updated Kitchen', 'Large Yard'],
    amenities: ['Parking', 'Storage'],
    specifications: {
      heating: 'Central',
      cooling: 'Central',
      flooring: ['Hardwood', 'Carpet'],
      roof: 'Shingle',
      exterior: 'Brick',
      foundation: 'Slab',
      utilities: ['Gas', 'Electric', 'Water'],
      appliances: ['Dishwasher', 'Refrigerator', 'Washer/Dryer'],
      security: ['Alarm System'],
      accessibility: ['Single Story']
    },
    financial: {
      price: 350000,
      pricePerSqFt: 175,
      taxes: 600,
      insurance: 120,
      utilities: 180,
      maintenance: 150,
      totalMonthlyCost: 1050,
      appreciation: 0.07,
      rentalIncome: 2200,
      capRate: 0.075,
      roi: 0.15
    },
    metadata: {
      listingDate: new Date('2024-01-10'),
      lastUpdated: new Date('2024-01-18'),
      views: 890,
      favorites: 32,
      shares: 8,
      agent: {
        id: 'agent2',
        name: 'Sarah Johnson',
        company: 'Suburban Properties',
        phone: '(555) 987-6543',
        email: 'sarah@suburbanproperties.com'
      },
      source: 'MLS',
      mlsId: 'MLS789012'
    }
  }
];

class WishlistService {
  private wishlists: Wishlist[] = [];
  private priceAlerts: PriceAlert[] = [];
  private nextWishlistId = 1;
  private nextAlertId = 1;

  /**
   * Create a new wishlist
   */
  async createWishlist(data: CreateWishlistRequest, userId: string): Promise<WishlistResponse> {
    try {
      // Validate input
      const validationErrors = this.validateCreateWishlist(data);
      if (validationErrors.length > 0) {
        return {
          wishlist: null as any,
          success: false,
          message: validationErrors.join(', ')
        };
      }

      // Create wishlist
      const wishlist: Wishlist = {
        id: `wishlist-${this.nextWishlistId++}`,
        userId,
        name: data.name,
        description: data.description,
        properties: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: data.isPublic || false,
        tags: data.tags || [],
        settings: {
          autoSync: true,
          shareWithAgents: false,
          allowPublicView: false,
          notificationSettings: {
            email: true,
            push: true,
            sms: false,
            frequency: 'daily' as any,
            quietHours: {
              enabled: true,
              start: '22:00',
              end: '08:00',
              timezone: 'UTC'
            }
          },
          priceTracking: {
            enabled: true,
            updateFrequency: 24,
            priceChangeThreshold: 5
          },
          ...data.settings
        }
      };

      this.wishlists.push(wishlist);

      return {
        wishlist,
        success: true,
        message: 'Wishlist created successfully'
      };
    } catch (error) {
      return {
        wishlist: null as any,
        success: false,
        message: 'Failed to create wishlist'
      };
    }
  }

  /**
   * Get wishlist by ID
   */
  async getWishlist(id: string, userId: string): Promise<WishlistResponse> {
    try {
      const wishlist = this.wishlists.find(w => w.id === id && (w.userId === userId || w.isPublic));
      
      if (!wishlist) {
        return {
          wishlist: null as any,
          success: false,
          message: 'Wishlist not found'
        };
      }

      return {
        wishlist,
        success: true
      };
    } catch (error) {
      return {
        wishlist: null as any,
        success: false,
        message: 'Failed to get wishlist'
      };
    }
  }

  /**
   * Get user's wishlists
   */
  async getUserWishlists(userId: string, page = 1, limit = 10): Promise<WishlistListResponse> {
    try {
      const userWishlists = this.wishlists.filter(w => w.userId === userId);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedWishlists = userWishlists.slice(startIndex, endIndex);

      return {
        wishlists: paginatedWishlists,
        total: userWishlists.length,
        page,
        limit
      };
    } catch (error) {
      return {
        wishlists: [],
        total: 0,
        page,
        limit
      };
    }
  }

  /**
   * Update wishlist
   */
  async updateWishlist(id: string, data: UpdateWishlistRequest, userId: string): Promise<WishlistResponse> {
    try {
      const wishlistIndex = this.wishlists.findIndex(w => w.id === id && w.userId === userId);
      
      if (wishlistIndex === -1) {
        return {
          wishlist: null as any,
          success: false,
          message: 'Wishlist not found'
        };
      }

      const wishlist = this.wishlists[wishlistIndex];
      
      // Update fields
      if (data.name !== undefined) wishlist.name = data.name;
      if (data.description !== undefined) wishlist.description = data.description;
      if (data.isPublic !== undefined) wishlist.isPublic = data.isPublic;
      if (data.tags !== undefined) wishlist.tags = data.tags;
      if (data.settings !== undefined) wishlist.settings = { ...wishlist.settings, ...data.settings };
      
      wishlist.updatedAt = new Date();

      return {
        wishlist,
        success: true,
        message: 'Wishlist updated successfully'
      };
    } catch (error) {
      return {
        wishlist: null as any,
        success: false,
        message: 'Failed to update wishlist'
      };
    }
  }

  /**
   * Delete wishlist
   */
  async deleteWishlist(id: string, userId: string): Promise<WishlistResponse> {
    try {
      const wishlistIndex = this.wishlists.findIndex(w => w.id === id && w.userId === userId);
      
      if (wishlistIndex === -1) {
        return {
          wishlist: null as any,
          success: false,
          message: 'Wishlist not found'
        };
      }

      const wishlist = this.wishlists[wishlistIndex];
      this.wishlists.splice(wishlistIndex, 1);

      // Remove associated price alerts
      this.priceAlerts = this.priceAlerts.filter(alert => 
        !wishlist.properties.some(prop => prop.propertyId === alert.propertyId)
      );

      return {
        wishlist,
        success: true,
        message: 'Wishlist deleted successfully'
      };
    } catch (error) {
      return {
        wishlist: null as any,
        success: false,
        message: 'Failed to delete wishlist'
      };
    }
  }

  /**
   * Add property to wishlist
   */
  async addPropertyToWishlist(
    wishlistId: string,
    data: AddPropertyToWishlistRequest,
    userId: string
  ): Promise<WishlistResponse> {
    try {
      const wishlistIndex = this.wishlists.findIndex(w => w.id === wishlistId && w.userId === userId);
      
      if (wishlistIndex === -1) {
        return {
          wishlist: null as any,
          success: false,
          message: 'Wishlist not found'
        };
      }

      const wishlist = this.wishlists[wishlistIndex];
      
      // Check if property already exists
      if (wishlist.properties.some(p => p.propertyId === data.propertyId)) {
        return {
          wishlist: null as any,
          success: false,
          message: 'Property already in wishlist'
        };
      }

      // Get property
      const property = await this.getPropertyById(data.propertyId);
      if (!property) {
        return {
          wishlist: null as any,
          success: false,
          message: 'Property not found'
        };
      }

      // Add property to wishlist
      const wishlistProperty: WishlistProperty = {
        id: `${wishlistId}-${property.id}`,
        propertyId: property.id,
        property,
        addedAt: new Date(),
        notes: data.notes,
        tags: data.tags || [],
        priceAlerts: [],
        isActive: true
      };

      wishlist.properties.push(wishlistProperty);
      wishlist.updatedAt = new Date();

      return {
        wishlist,
        success: true,
        message: 'Property added to wishlist'
      };
    } catch (error) {
      return {
        wishlist: null as any,
        success: false,
        message: 'Failed to add property to wishlist'
      };
    }
  }

  /**
   * Remove property from wishlist
   */
  async removePropertyFromWishlist(
    wishlistId: string,
    data: RemovePropertyFromWishlistRequest,
    userId: string
  ): Promise<WishlistResponse> {
    try {
      const wishlistIndex = this.wishlists.findIndex(w => w.id === wishlistId && w.userId === userId);
      
      if (wishlistIndex === -1) {
        return {
          wishlist: null as any,
          success: false,
          message: 'Wishlist not found'
        };
      }

      const wishlist = this.wishlists[wishlistIndex];
      
      // Remove property
      wishlist.properties = wishlist.properties.filter(p => p.propertyId !== data.propertyId);
      
      // Remove associated price alerts
      this.priceAlerts = this.priceAlerts.filter(alert => alert.propertyId !== data.propertyId);
      
      wishlist.updatedAt = new Date();

      return {
        wishlist,
        success: true,
        message: 'Property removed from wishlist'
      };
    } catch (error) {
      return {
        wishlist: null as any,
        success: false,
        message: 'Failed to remove property from wishlist'
      };
    }
  }

  /**
   * Create price alert
   */
  async createPriceAlert(data: CreatePriceAlertRequest, userId: string): Promise<PriceAlertResponse> {
    try {
      // Get current property price
      const property = await this.getPropertyById(data.propertyId);
      if (!property) {
        return {
          alert: null as any,
          success: false,
          message: 'Property not found'
        };
      }

      const alert: PriceAlert = {
        id: `alert-${this.nextAlertId++}`,
        propertyId: data.propertyId,
        userId,
        type: data.type,
        targetPrice: data.targetPrice || property.price,
        currentPrice: property.price,
        isActive: true,
        createdAt: new Date(),
        notificationSettings: data.notificationSettings,
        conditions: data.conditions
      };

      this.priceAlerts.push(alert);

      return {
        alert,
        success: true,
        message: 'Price alert created successfully'
      };
    } catch (error) {
      return {
        alert: null as any,
        success: false,
        message: 'Failed to create price alert'
      };
    }
  }

  /**
   * Get user's price alerts
   */
  async getUserPriceAlerts(userId: string, page = 1, limit = 10): Promise<PriceAlertListResponse> {
    try {
      const userAlerts = this.priceAlerts.filter(a => a.userId === userId);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedAlerts = userAlerts.slice(startIndex, endIndex);

      return {
        alerts: paginatedAlerts,
        total: userAlerts.length,
        page,
        limit
      };
    } catch (error) {
      return {
        alerts: [],
        total: 0,
        page,
        limit
      };
    }
  }

  /**
   * Update price alert
   */
  async updatePriceAlert(id: string, data: UpdatePriceAlertRequest, userId: string): Promise<PriceAlertResponse> {
    try {
      const alertIndex = this.priceAlerts.findIndex(a => a.id === id && a.userId === userId);
      
      if (alertIndex === -1) {
        return {
          alert: null as any,
          success: false,
          message: 'Price alert not found'
        };
      }

      const alert = this.priceAlerts[alertIndex];
      
      // Update fields
      if (data.type !== undefined) alert.type = data.type;
      if (data.targetPrice !== undefined) alert.targetPrice = data.targetPrice;
      if (data.conditions !== undefined) alert.conditions = { ...alert.conditions, ...data.conditions };
      if (data.notificationSettings !== undefined) alert.notificationSettings = { ...alert.notificationSettings, ...data.notificationSettings };
      if (data.isActive !== undefined) alert.isActive = data.isActive;

      return {
        alert,
        success: true,
        message: 'Price alert updated successfully'
      };
    } catch (error) {
      return {
        alert: null as any,
        success: false,
        message: 'Failed to update price alert'
      };
    }
  }

  /**
   * Delete price alert
   */
  async deletePriceAlert(id: string, userId: string): Promise<PriceAlertResponse> {
    try {
      const alertIndex = this.priceAlerts.findIndex(a => a.id === id && a.userId === userId);
      
      if (alertIndex === -1) {
        return {
          alert: null as any,
          success: false,
          message: 'Price alert not found'
        };
      }

      const alert = this.priceAlerts[alertIndex];
      this.priceAlerts.splice(alertIndex, 1);

      return {
        alert,
        success: true,
        message: 'Price alert deleted successfully'
      };
    } catch (error) {
      return {
        alert: null as any,
        success: false,
        message: 'Failed to delete price alert'
      };
    }
  }

  /**
   * Get wishlist analytics
   */
  async getWishlistAnalytics(wishlistId: string, userId: string): Promise<WishlistAnalytics | null> {
    try {
      const wishlist = this.wishlists.find(w => w.id === wishlistId && w.userId === userId);
      
      if (!wishlist) {
        return null;
      }

      const properties = wishlist.properties.map(p => p.property);
      const prices = properties.map(p => p.price);
      const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

      const locationDistribution: { [city: string]: number } = {};
      properties.forEach(property => {
        const city = property.location.city;
        locationDistribution[city] = (locationDistribution[city] || 0) + 1;
      });

      const propertyTypeDistribution: { [type: string]: number } = {};
      properties.forEach(property => {
        const type = property.details.type;
        propertyTypeDistribution[type] = (propertyTypeDistribution[type] || 0) + 1;
      });

      const priceChangeHistory: PriceChangeHistory[] = [];
      // Mock price change history
      properties.forEach(property => {
        const changePercentage = Math.random() * 10 - 5; // Random change between -5% and +5%
        const oldPrice = property.price / (1 + changePercentage / 100);
        priceChangeHistory.push({
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
          propertyId: property.id,
          oldPrice,
          newPrice: property.price,
          changePercentage,
          changeType: changePercentage > 0 ? 'increase' : 'decrease'
        });
      });

      const alertStatistics: AlertStatistics = {
        totalAlerts: this.priceAlerts.filter(a => 
          wishlist.properties.some(p => p.propertyId === a.propertyId)
        ).length,
        activeAlerts: this.priceAlerts.filter(a => 
          wishlist.properties.some(p => p.propertyId === a.propertyId) && a.isActive
        ).length,
        triggeredAlerts: this.priceAlerts.filter(a => 
          wishlist.properties.some(p => p.propertyId === a.propertyId) && a.triggeredAt
        ).length,
        alertTypes: {},
        averageResponseTime: 2.5 // Mock value
      };

      return {
        wishlistId,
        totalProperties: properties.length,
        averagePrice,
        priceRange: {
          min: Math.min(...prices),
          max: Math.max(...prices)
        },
        locationDistribution,
        propertyTypeDistribution,
        priceChangeHistory,
        alertStatistics
      };
    } catch (error) {
      return null;
    }
  }

  // Private helper methods
  private validateCreateWishlist(data: CreateWishlistRequest): string[] {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Wishlist name is required');
    }

    if (data.name && data.name.length > 100) {
      errors.push('Wishlist name must be less than 100 characters');
    }

    return errors;
  }

  private async getPropertyById(propertyId: string): Promise<Property | null> {
    // In a real implementation, this would fetch from a database
    return mockProperties.find(p => p.id === propertyId) || null;
  }
}

// Export singleton instance
export const wishlistService = new WishlistService();
export default wishlistService;
