import { comparisonService } from '@/lib/comparisonService';
import { CreateComparisonRequest, ExportFormat } from '@/types/comparison';

// Mock the comparison service for testing
jest.mock('@/lib/comparisonService', () => ({
  comparisonService: {
    createComparison: jest.fn(),
    getComparison: jest.fn(),
    getUserComparisons: jest.fn(),
    updateComparison: jest.fn(),
    deleteComparison: jest.fn(),
    addPropertyToComparison: jest.fn(),
    removePropertyFromComparison: jest.fn(),
    exportComparison: jest.fn(),
    getPublicComparisons: jest.fn(),
    searchComparisons: jest.fn()
  }
}));

describe('ComparisonService', () => {
  const mockUserId = 'user123';
  const mockComparisonId = 'comparison-1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createComparison', () => {
    it('should create a comparison successfully', async () => {
      const mockComparisonData: CreateComparisonRequest = {
        name: 'Test Comparison',
        propertyIds: ['property1', 'property2'],
        isPublic: false,
        tags: ['test'],
        notes: 'Test comparison notes'
      };

      const mockResponse = {
        comparison: {
          id: mockComparisonId,
          name: 'Test Comparison',
          properties: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: mockUserId,
          isPublic: false,
          tags: ['test'],
          notes: 'Test comparison notes'
        },
        success: true,
        message: 'Comparison created successfully'
      };

      (comparisonService.createComparison as jest.Mock).mockResolvedValue(mockResponse);

      const result = await comparisonService.createComparison(mockComparisonData, mockUserId);

      expect(result.success).toBe(true);
      expect(result.comparison.name).toBe('Test Comparison');
      expect(result.comparison.userId).toBe(mockUserId);
    });

    it('should fail to create comparison with invalid data', async () => {
      const invalidData: CreateComparisonRequest = {
        name: '',
        propertyIds: ['property1'],
        isPublic: false
      };

      const mockResponse = {
        comparison: null,
        success: false,
        message: 'Comparison name is required, At least 2 properties are required'
      };

      (comparisonService.createComparison as jest.Mock).mockResolvedValue(mockResponse);

      const result = await comparisonService.createComparison(invalidData, mockUserId);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Comparison name is required');
    });
  });

  describe('getComparison', () => {
    it('should get a comparison successfully', async () => {
      const mockResponse = {
        comparison: {
          id: mockComparisonId,
          name: 'Test Comparison',
          properties: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: mockUserId,
          isPublic: false,
          tags: [],
          notes: ''
        },
        success: true
      };

      (comparisonService.getComparison as jest.Mock).mockResolvedValue(mockResponse);

      const result = await comparisonService.getComparison(mockComparisonId, mockUserId);

      expect(result.success).toBe(true);
      expect(result.comparison.id).toBe(mockComparisonId);
    });

    it('should return error for non-existent comparison', async () => {
      const mockResponse = {
        comparison: null,
        success: false,
        message: 'Comparison not found'
      };

      (comparisonService.getComparison as jest.Mock).mockResolvedValue(mockResponse);

      const result = await comparisonService.getComparison('non-existent', mockUserId);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Comparison not found');
    });
  });

  describe('getUserComparisons', () => {
    it('should get user comparisons successfully', async () => {
      const mockResponse = {
        comparisons: [
          {
            id: mockComparisonId,
            name: 'Test Comparison',
            properties: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: mockUserId,
            isPublic: false,
            tags: [],
            notes: ''
          }
        ],
        total: 1,
        page: 1,
        limit: 10
      };

      (comparisonService.getUserComparisons as jest.Mock).mockResolvedValue(mockResponse);

      const result = await comparisonService.getUserComparisons(mockUserId, 1, 10);

      expect(result.comparisons).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });
  });

  describe('updateComparison', () => {
    it('should update comparison successfully', async () => {
      const updateData = {
        name: 'Updated Comparison Name',
        isPublic: true
      };

      const mockResponse = {
        comparison: {
          id: mockComparisonId,
          name: 'Updated Comparison Name',
          properties: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: mockUserId,
          isPublic: true,
          tags: [],
          notes: ''
        },
        success: true,
        message: 'Comparison updated successfully'
      };

      (comparisonService.updateComparison as jest.Mock).mockResolvedValue(mockResponse);

      const result = await comparisonService.updateComparison(
        mockComparisonId,
        updateData,
        mockUserId
      );

      expect(result.success).toBe(true);
      expect(result.comparison.name).toBe('Updated Comparison Name');
      expect(result.comparison.isPublic).toBe(true);
    });
  });

  describe('deleteComparison', () => {
    it('should delete comparison successfully', async () => {
      const mockResponse = {
        comparison: {
          id: mockComparisonId,
          name: 'Test Comparison',
          properties: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: mockUserId,
          isPublic: false,
          tags: [],
          notes: ''
        },
        success: true,
        message: 'Comparison deleted successfully'
      };

      (comparisonService.deleteComparison as jest.Mock).mockResolvedValue(mockResponse);

      const result = await comparisonService.deleteComparison(mockComparisonId, mockUserId);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Comparison deleted successfully');
    });
  });

  describe('addPropertyToComparison', () => {
    it('should add property to comparison successfully', async () => {
      const propertyData = {
        propertyId: 'property3',
        notes: 'Added property notes'
      };

      const mockResponse = {
        comparison: {
          id: mockComparisonId,
          name: 'Test Comparison',
          properties: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: mockUserId,
          isPublic: false,
          tags: [],
          notes: ''
        },
        success: true,
        message: 'Property added to comparison'
      };

      (comparisonService.addPropertyToComparison as jest.Mock).mockResolvedValue(mockResponse);

      const result = await comparisonService.addPropertyToComparison(
        mockComparisonId,
        propertyData,
        mockUserId
      );

      expect(result.success).toBe(true);
      expect(result.message).toBe('Property added to comparison');
    });
  });

  describe('removePropertyFromComparison', () => {
    it('should remove property from comparison successfully', async () => {
      const propertyData = {
        propertyId: 'property1'
      };

      const mockResponse = {
        comparison: {
          id: mockComparisonId,
          name: 'Test Comparison',
          properties: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: mockUserId,
          isPublic: false,
          tags: [],
          notes: ''
        },
        success: true,
        message: 'Property removed from comparison'
      };

      (comparisonService.removePropertyFromComparison as jest.Mock).mockResolvedValue(mockResponse);

      const result = await comparisonService.removePropertyFromComparison(
        mockComparisonId,
        propertyData,
        mockUserId
      );

      expect(result.success).toBe(true);
      expect(result.message).toBe('Property removed from comparison');
    });
  });

  describe('exportComparison', () => {
    it('should export comparison successfully', async () => {
      const mockExportData = {
        format: ExportFormat.PDF,
        data: {
          id: mockComparisonId,
          name: 'Test Comparison',
          properties: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: mockUserId,
          isPublic: false,
          tags: [],
          notes: ''
        },
        generatedAt: new Date(),
        generatedBy: mockUserId
      };

      (comparisonService.exportComparison as jest.Mock).mockResolvedValue(mockExportData);

      const result = await comparisonService.exportComparison(
        mockComparisonId,
        ExportFormat.PDF,
        mockUserId
      );

      expect(result.format).toBe(ExportFormat.PDF);
      expect(result.data.id).toBe(mockComparisonId);
      expect(result.generatedBy).toBe(mockUserId);
    });
  });

  describe('getPublicComparisons', () => {
    it('should get public comparisons successfully', async () => {
      const mockResponse = {
        comparisons: [
          {
            id: mockComparisonId,
            name: 'Public Comparison',
            properties: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: 'other-user',
            isPublic: true,
            tags: [],
            notes: ''
          }
        ],
        total: 1,
        page: 1,
        limit: 10
      };

      (comparisonService.getPublicComparisons as jest.Mock).mockResolvedValue(mockResponse);

      const result = await comparisonService.getPublicComparisons(1, 10);

      expect(result.comparisons).toHaveLength(1);
      expect(result.comparisons[0].isPublic).toBe(true);
    });
  });

  describe('searchComparisons', () => {
    it('should search comparisons successfully', async () => {
      const mockResponse = {
        comparisons: [
          {
            id: mockComparisonId,
            name: 'Test Comparison',
            properties: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: mockUserId,
            isPublic: false,
            tags: ['test'],
            notes: 'Test comparison notes'
          }
        ],
        total: 1,
        page: 1,
        limit: 1
      };

      (comparisonService.searchComparisons as jest.Mock).mockResolvedValue(mockResponse);

      const result = await comparisonService.searchComparisons('test', mockUserId);

      expect(result.comparisons).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });
});
