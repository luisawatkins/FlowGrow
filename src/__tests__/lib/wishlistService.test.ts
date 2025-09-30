import {
  wishlistService,
  CreateWishlistRequest,
  UpdateWishlistRequest,
  AddPropertyToWishlistRequest,
  RemovePropertyFromWishlistRequest,
  CreatePriceAlertRequest,
  UpdatePriceAlertRequest,
  PriceAlertType,
  PriceChangeType,
  NotificationFrequency
} from '../../lib/wishlistService';

// Mock data
const mockUserId = 'test-user-123';
const mockPropertyId = '1';

const mockCreateWishlistRequest: CreateWishlistRequest = {
  name: 'Test Wishlist',
  description: 'A test wishlist for unit testing',
  isPublic: false,
  tags: ['test', 'unit-test']
};

const mockUpdateWishlistRequest: UpdateWishlistRequest = {
  name: 'Updated Test Wishlist',
  description: 'Updated description',
  isPublic: true
};

const mockAddPropertyRequest: AddPropertyToWishlistRequest = {
  propertyId: mockPropertyId,
  notes: 'Test property notes',
  tags: ['favorite', 'investment']
};

const mockCreatePriceAlertRequest: CreatePriceAlertRequest = {
  propertyId: mockPropertyId,
  type: PriceAlertType.PRICE_DROP,
  targetPrice: 400000,
  conditions: {
    priceChange: PriceChangeType.PERCENTAGE,
    percentageThreshold: 5,
    timeWindow: 24
  },
  notificationSettings: {
    email: true,
    push: true,
    sms: false,
    frequency: NotificationFrequency.IMMEDIATE,
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00',
      timezone: 'UTC'
    }
  }
};

describe('WishlistService', () => {
  beforeEach(() => {
    // Reset service state before each test
    jest.clearAllMocks();
  });

  describe('createWishlist', () => {
    it('should create a new wishlist successfully', async () => {
      const response = await wishlistService.createWishlist(mockCreateWishlistRequest, mockUserId);

      expect(response.success).toBe(true);
      expect(response.wishlist).toBeDefined();
      expect(response.wishlist.name).toBe(mockCreateWishlistRequest.name);
      expect(response.wishlist.description).toBe(mockCreateWishlistRequest.description);
      expect(response.wishlist.userId).toBe(mockUserId);
      expect(response.wishlist.isPublic).toBe(mockCreateWishlistRequest.isPublic);
      expect(response.wishlist.tags).toEqual(mockCreateWishlistRequest.tags);
      expect(response.wishlist.properties).toEqual([]);
    });

    it('should fail to create wishlist with empty name', async () => {
      const invalidRequest = { ...mockCreateWishlistRequest, name: '' };
      const response = await wishlistService.createWishlist(invalidRequest, mockUserId);

      expect(response.success).toBe(false);
      expect(response.message).toContain('Wishlist name is required');
    });

    it('should fail to create wishlist with name too long', async () => {
      const invalidRequest = { ...mockCreateWishlistRequest, name: 'a'.repeat(101) };
      const response = await wishlistService.createWishlist(invalidRequest, mockUserId);

      expect(response.success).toBe(false);
      expect(response.message).toContain('Wishlist name must be less than 100 characters');
    });
  });

  describe('getWishlist', () => {
    it('should retrieve a wishlist by ID', async () => {
      // First create a wishlist
      const createResponse = await wishlistService.createWishlist(mockCreateWishlistRequest, mockUserId);
      expect(createResponse.success).toBe(true);

      // Then retrieve it
      const response = await wishlistService.getWishlist(createResponse.wishlist!.id, mockUserId);

      expect(response.success).toBe(true);
      expect(response.wishlist).toBeDefined();
      expect(response.wishlist!.id).toBe(createResponse.wishlist!.id);
      expect(response.wishlist!.name).toBe(mockCreateWishlistRequest.name);
    });

    it('should return null for non-existent wishlist', async () => {
      const response = await wishlistService.getWishlist('non-existent-id', mockUserId);

      expect(response.success).toBe(false);
      expect(response.message).toBe('Wishlist not found');
    });
  });

  describe('getUserWishlists', () => {
    it('should retrieve user wishlists with pagination', async () => {
      // Create multiple wishlists
      await wishlistService.createWishlist({ ...mockCreateWishlistRequest, name: 'Wishlist 1' }, mockUserId);
      await wishlistService.createWishlist({ ...mockCreateWishlistRequest, name: 'Wishlist 2' }, mockUserId);

      const response = await wishlistService.getUserWishlists(mockUserId, 1, 10);

      expect(response.wishlists.length).toBeGreaterThanOrEqual(2);
      expect(response.total).toBeGreaterThanOrEqual(2);
      expect(response.page).toBe(1);
      expect(response.limit).toBe(10);
    });

    it('should handle pagination correctly', async () => {
      // Create multiple wishlists
      for (let i = 0; i < 5; i++) {
        await wishlistService.createWishlist({ ...mockCreateWishlistRequest, name: `Wishlist ${i}` }, mockUserId);
      }

      const response = await wishlistService.getUserWishlists(mockUserId, 1, 2);

      expect(response.wishlists.length).toBe(2);
      expect(response.total).toBeGreaterThanOrEqual(5);
    });
  });

  describe('updateWishlist', () => {
    it('should update wishlist successfully', async () => {
      // Create a wishlist first
      const createResponse = await wishlistService.createWishlist(mockCreateWishlistRequest, mockUserId);
      expect(createResponse.success).toBe(true);

      // Update it
      const response = await wishlistService.updateWishlist(
        createResponse.wishlist!.id,
        mockUpdateWishlistRequest,
        mockUserId
      );

      expect(response.success).toBe(true);
      expect(response.wishlist!.name).toBe(mockUpdateWishlistRequest.name);
      expect(response.wishlist!.description).toBe(mockUpdateWishlistRequest.description);
      expect(response.wishlist!.isPublic).toBe(mockUpdateWishlistRequest.isPublic);
    });

    it('should fail to update non-existent wishlist', async () => {
      const response = await wishlistService.updateWishlist(
        'non-existent-id',
        mockUpdateWishlistRequest,
        mockUserId
      );

      expect(response.success).toBe(false);
      expect(response.message).toBe('Wishlist not found');
    });
  });

  describe('deleteWishlist', () => {
    it('should delete wishlist successfully', async () => {
      // Create a wishlist first
      const createResponse = await wishlistService.createWishlist(mockCreateWishlistRequest, mockUserId);
      expect(createResponse.success).toBe(true);

      // Delete it
      const response = await wishlistService.deleteWishlist(createResponse.wishlist!.id, mockUserId);

      expect(response.success).toBe(true);

      // Verify it's deleted
      const getResponse = await wishlistService.getWishlist(createResponse.wishlist!.id, mockUserId);
      expect(getResponse.success).toBe(false);
    });

    it('should fail to delete non-existent wishlist', async () => {
      const response = await wishlistService.deleteWishlist('non-existent-id', mockUserId);

      expect(response.success).toBe(false);
      expect(response.message).toBe('Wishlist not found');
    });
  });

  describe('addPropertyToWishlist', () => {
    it('should add property to wishlist successfully', async () => {
      // Create a wishlist first
      const createResponse = await wishlistService.createWishlist(mockCreateWishlistRequest, mockUserId);
      expect(createResponse.success).toBe(true);

      // Add property
      const response = await wishlistService.addPropertyToWishlist(
        createResponse.wishlist!.id,
        mockAddPropertyRequest,
        mockUserId
      );

      expect(response.success).toBe(true);
      expect(response.wishlist!.properties.length).toBe(1);
      expect(response.wishlist!.properties[0].propertyId).toBe(mockPropertyId);
      expect(response.wishlist!.properties[0].notes).toBe(mockAddPropertyRequest.notes);
      expect(response.wishlist!.properties[0].tags).toEqual(mockAddPropertyRequest.tags);
    });

    it('should fail to add duplicate property', async () => {
      // Create a wishlist and add property
      const createResponse = await wishlistService.createWishlist(mockCreateWishlistRequest, mockUserId);
      await wishlistService.addPropertyToWishlist(
        createResponse.wishlist!.id,
        mockAddPropertyRequest,
        mockUserId
      );

      // Try to add the same property again
      const response = await wishlistService.addPropertyToWishlist(
        createResponse.wishlist!.id,
        mockAddPropertyRequest,
        mockUserId
      );

      expect(response.success).toBe(false);
      expect(response.message).toBe('Property already in wishlist');
    });

    it('should fail to add property to non-existent wishlist', async () => {
      const response = await wishlistService.addPropertyToWishlist(
        'non-existent-id',
        mockAddPropertyRequest,
        mockUserId
      );

      expect(response.success).toBe(false);
      expect(response.message).toBe('Wishlist not found');
    });
  });

  describe('removePropertyFromWishlist', () => {
    it('should remove property from wishlist successfully', async () => {
      // Create wishlist and add property
      const createResponse = await wishlistService.createWishlist(mockCreateWishlistRequest, mockUserId);
      await wishlistService.addPropertyToWishlist(
        createResponse.wishlist!.id,
        mockAddPropertyRequest,
        mockUserId
      );

      // Remove property
      const response = await wishlistService.removePropertyFromWishlist(
        createResponse.wishlist!.id,
        { propertyId: mockPropertyId },
        mockUserId
      );

      expect(response.success).toBe(true);
      expect(response.wishlist!.properties.length).toBe(0);
    });

    it('should fail to remove property from non-existent wishlist', async () => {
      const response = await wishlistService.removePropertyFromWishlist(
        'non-existent-id',
        { propertyId: mockPropertyId },
        mockUserId
      );

      expect(response.success).toBe(false);
      expect(response.message).toBe('Wishlist not found');
    });
  });

  describe('createPriceAlert', () => {
    it('should create price alert successfully', async () => {
      const response = await wishlistService.createPriceAlert(mockCreatePriceAlertRequest, mockUserId);

      expect(response.success).toBe(true);
      expect(response.alert).toBeDefined();
      expect(response.alert!.propertyId).toBe(mockPropertyId);
      expect(response.alert!.type).toBe(mockCreatePriceAlertRequest.type);
      expect(response.alert!.targetPrice).toBe(mockCreatePriceAlertRequest.targetPrice);
      expect(response.alert!.userId).toBe(mockUserId);
      expect(response.alert!.isActive).toBe(true);
    });

    it('should fail to create alert for non-existent property', async () => {
      const invalidRequest = { ...mockCreatePriceAlertRequest, propertyId: 'non-existent-property' };
      const response = await wishlistService.createPriceAlert(invalidRequest, mockUserId);

      expect(response.success).toBe(false);
      expect(response.message).toBe('Property not found');
    });
  });

  describe('getUserPriceAlerts', () => {
    it('should retrieve user price alerts with pagination', async () => {
      // Create multiple alerts
      await wishlistService.createPriceAlert(mockCreatePriceAlertRequest, mockUserId);
      await wishlistService.createPriceAlert({
        ...mockCreatePriceAlertRequest,
        type: PriceAlertType.PRICE_INCREASE
      }, mockUserId);

      const response = await wishlistService.getUserPriceAlerts(mockUserId, 1, 10);

      expect(response.alerts.length).toBeGreaterThanOrEqual(2);
      expect(response.total).toBeGreaterThanOrEqual(2);
      expect(response.page).toBe(1);
      expect(response.limit).toBe(10);
    });
  });

  describe('updatePriceAlert', () => {
    it('should update price alert successfully', async () => {
      // Create an alert first
      const createResponse = await wishlistService.createPriceAlert(mockCreatePriceAlertRequest, mockUserId);
      expect(createResponse.success).toBe(true);

      // Update it
      const updateRequest: UpdatePriceAlertRequest = {
        type: PriceAlertType.PRICE_INCREASE,
        targetPrice: 500000,
        isActive: false
      };

      const response = await wishlistService.updatePriceAlert(
        createResponse.alert!.id,
        updateRequest,
        mockUserId
      );

      expect(response.success).toBe(true);
      expect(response.alert!.type).toBe(updateRequest.type);
      expect(response.alert!.targetPrice).toBe(updateRequest.targetPrice);
      expect(response.alert!.isActive).toBe(updateRequest.isActive);
    });

    it('should fail to update non-existent alert', async () => {
      const updateRequest: UpdatePriceAlertRequest = {
        type: PriceAlertType.PRICE_INCREASE
      };

      const response = await wishlistService.updatePriceAlert(
        'non-existent-id',
        updateRequest,
        mockUserId
      );

      expect(response.success).toBe(false);
      expect(response.message).toBe('Price alert not found');
    });
  });

  describe('deletePriceAlert', () => {
    it('should delete price alert successfully', async () => {
      // Create an alert first
      const createResponse = await wishlistService.createPriceAlert(mockCreatePriceAlertRequest, mockUserId);
      expect(createResponse.success).toBe(true);

      // Delete it
      const response = await wishlistService.deletePriceAlert(createResponse.alert!.id, mockUserId);

      expect(response.success).toBe(true);
    });

    it('should fail to delete non-existent alert', async () => {
      const response = await wishlistService.deletePriceAlert('non-existent-id', mockUserId);

      expect(response.success).toBe(false);
      expect(response.message).toBe('Price alert not found');
    });
  });

  describe('getWishlistAnalytics', () => {
    it('should return analytics for wishlist with properties', async () => {
      // Create wishlist and add properties
      const createResponse = await wishlistService.createWishlist(mockCreateWishlistRequest, mockUserId);
      await wishlistService.addPropertyToWishlist(
        createResponse.wishlist!.id,
        mockAddPropertyRequest,
        mockUserId
      );

      const analytics = await wishlistService.getWishlistAnalytics(createResponse.wishlist!.id, mockUserId);

      expect(analytics).toBeDefined();
      expect(analytics!.wishlistId).toBe(createResponse.wishlist!.id);
      expect(analytics!.totalProperties).toBe(1);
      expect(analytics!.averagePrice).toBeGreaterThan(0);
      expect(analytics!.priceRange.min).toBeGreaterThan(0);
      expect(analytics!.priceRange.max).toBeGreaterThan(0);
      expect(analytics!.locationDistribution).toBeDefined();
      expect(analytics!.propertyTypeDistribution).toBeDefined();
      expect(analytics!.alertStatistics).toBeDefined();
    });

    it('should return null for non-existent wishlist', async () => {
      const analytics = await wishlistService.getWishlistAnalytics('non-existent-id', mockUserId);

      expect(analytics).toBeNull();
    });
  });
});
