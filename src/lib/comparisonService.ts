import { 
  PropertyComparison, 
  ComparisonProperty, 
  ComparisonCriteria, 
  ComparisonResult,
  CreateComparisonRequest, 
  UpdateComparisonRequest,
  AddPropertyToComparisonRequest,
  ComparisonStats,
  ComparisonFilter,
  ComparisonSearchResult
} from '../types/comparison';

// Mock data for development
const mockComparisons: PropertyComparison[] = [
  {
    id: 'comp-1',
    userId: 'user-1',
    name: 'Downtown Apartments Comparison',
    description: 'Comparing modern apartments in downtown area',
    properties: [
      {
        id: 'comp-prop-1',
        propertyId: 'prop-1',
        property: {
          id: 'prop-1',
          title: 'Modern Downtown Apartment',
          address: '123 Main St, Downtown',
          price: 450000,
          imageUrl: '/images/prop-1.jpg',
          bedrooms: 2,
          bathrooms: 2,
          squareFeet: 1200,
          propertyType: 'Apartment',
          yearBuilt: 2020,
          lotSize: 0,
          parkingSpaces: 1,
          features: ['Hardwood floors', 'Granite countertops'],
          amenities: ['Gym', 'Pool', 'Concierge']
        },
        addedAt: new Date('2024-01-15'),
        notes: 'Great investment potential',
        score: 85
      },
      {
        id: 'comp-prop-2',
        propertyId: 'prop-2',
        property: {
          id: 'prop-2',
          title: 'Luxury Downtown Condo',
          address: '456 Oak Ave, Downtown',
          price: 650000,
          imageUrl: '/images/prop-2.jpg',
          bedrooms: 3,
          bathrooms: 2,
          squareFeet: 1800,
          propertyType: 'Condo',
          yearBuilt: 2018,
          lotSize: 0,
          parkingSpaces: 2,
          features: ['Marble floors', 'Stainless appliances'],
          amenities: ['Rooftop deck', 'Gym', 'Pool', 'Concierge']
        },
        addedAt: new Date('2024-01-16'),
        notes: 'Premium location',
        score: 92
      }
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    isPublic: true
  }
];

const mockCriteria: ComparisonCriteria[] = [
  { id: 'crit-1', name: 'Price Value', weight: 0.3, type: 'numeric', higherIsBetter: false },
  { id: 'crit-2', name: 'Location Quality', weight: 0.25, type: 'numeric', higherIsBetter: true },
  { id: 'crit-3', name: 'Property Size', weight: 0.2, type: 'numeric', higherIsBetter: true },
  { id: 'crit-4', name: 'Amenities', weight: 0.15, type: 'numeric', higherIsBetter: true },
  { id: 'crit-5', name: 'Investment Potential', weight: 0.1, type: 'numeric', higherIsBetter: true }
];

export class ComparisonService {
  // Get all comparisons for a user
  static async getUserComparisons(userId: string): Promise<PropertyComparison[]> {
    return mockComparisons.filter(comp => comp.userId === userId);
  }

  // Get a specific comparison by ID
  static async getComparisonById(comparisonId: string): Promise<PropertyComparison | null> {
    return mockComparisons.find(comp => comp.id === comparisonId) || null;
  }

  // Create a new comparison
  static async createComparison(request: CreateComparisonRequest): Promise<PropertyComparison> {
    const newComparison: PropertyComparison = {
      id: `comp-${Date.now()}`,
      userId: 'current-user', // In real app, get from auth context
      name: request.name,
      description: request.description,
      properties: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: request.isPublic
    };

    mockComparisons.push(newComparison);
    return newComparison;
  }

  // Update a comparison
  static async updateComparison(request: UpdateComparisonRequest): Promise<PropertyComparison> {
    const comparisonIndex = mockComparisons.findIndex(comp => comp.id === request.id);
    if (comparisonIndex === -1) {
      throw new Error('Comparison not found');
    }

    const existingComparison = mockComparisons[comparisonIndex];
    const updatedComparison: PropertyComparison = {
      ...existingComparison,
      ...(request.name && { name: request.name }),
      ...(request.description !== undefined && { description: request.description }),
      ...(request.isPublic !== undefined && { isPublic: request.isPublic }),
      updatedAt: new Date()
    };

    mockComparisons[comparisonIndex] = updatedComparison;
    return updatedComparison;
  }

  // Delete a comparison
  static async deleteComparison(comparisonId: string): Promise<boolean> {
    const comparisonIndex = mockComparisons.findIndex(comp => comp.id === comparisonId);
    if (comparisonIndex === -1) {
      return false;
    }

    mockComparisons.splice(comparisonIndex, 1);
    return true;
  }

  // Add property to comparison
  static async addPropertyToComparison(request: AddPropertyToComparisonRequest): Promise<ComparisonProperty> {
    const comparison = mockComparisons.find(comp => comp.id === request.comparisonId);
    if (!comparison) {
      throw new Error('Comparison not found');
    }

    const property = {
      id: 'prop-' + request.propertyId,
      title: 'Sample Property',
      address: 'Sample Address',
      price: 0,
      propertyType: 'Property',
      features: [],
      amenities: []
    };

    const newProperty: ComparisonProperty = {
      id: `comp-prop-${Date.now()}`,
      propertyId: request.propertyId,
      property,
      addedAt: new Date(),
      notes: request.notes
    };

    comparison.properties.push(newProperty);
    comparison.updatedAt = new Date();

    return newProperty;
  }

  // Remove property from comparison
  static async removePropertyFromComparison(comparisonId: string, propertyId: string): Promise<boolean> {
    const comparison = mockComparisons.find(comp => comp.id === comparisonId);
    if (!comparison) {
      return false;
    }

    const propertyIndex = comparison.properties.findIndex(prop => prop.propertyId === propertyId);
    if (propertyIndex === -1) {
      return false;
    }

    comparison.properties.splice(propertyIndex, 1);
    comparison.updatedAt = new Date();
    return true;
  }

  // Get comparison criteria
  static async getComparisonCriteria(): Promise<ComparisonCriteria[]> {
    return mockCriteria;
  }

  // Calculate comparison results
  static async calculateComparisonResults(comparisonId: string): Promise<ComparisonResult[]> {
    const comparison = mockComparisons.find(comp => comp.id === comparisonId);
    if (!comparison) {
      throw new Error('Comparison not found');
    }

    const results: ComparisonResult[] = comparison.properties.map((prop, index) => {
      // Mock calculation - in real app, this would use actual criteria scoring
      const totalScore = Math.floor(Math.random() * 40) + 60; // 60-100 range
      
      return {
        propertyId: prop.propertyId,
        propertyTitle: prop.property.title,
        totalScore,
        criteriaScores: {
          'crit-1': Math.floor(Math.random() * 20) + 70,
          'crit-2': Math.floor(Math.random() * 20) + 70,
          'crit-3': Math.floor(Math.random() * 20) + 70,
          'crit-4': Math.floor(Math.random() * 20) + 70,
          'crit-5': Math.floor(Math.random() * 20) + 70
        },
        rank: index + 1,
        strengths: ['Great location', 'Modern amenities'],
        weaknesses: ['Higher price', 'Limited parking']
      };
    });

    // Sort by total score
    results.sort((a, b) => b.totalScore - a.totalScore);
    
    // Update ranks
    results.forEach((result, index) => {
      result.rank = index + 1;
    });

    return results;
  }

  // Search comparisons
  static async searchComparisons(filter: ComparisonFilter, page: number = 1, limit: number = 10): Promise<ComparisonSearchResult> {
    let filteredComparisons = [...mockComparisons];

    if (filter.userId) {
      filteredComparisons = filteredComparisons.filter(comp => comp.userId === filter.userId);
    }

    if (filter.isPublic !== undefined) {
      filteredComparisons = filteredComparisons.filter(comp => comp.isPublic === filter.isPublic);
    }

    if (filter.dateFrom) {
      filteredComparisons = filteredComparisons.filter(comp => comp.createdAt >= filter.dateFrom!);
    }

    if (filter.dateTo) {
      filteredComparisons = filteredComparisons.filter(comp => comp.createdAt <= filter.dateTo!);
    }

    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      filteredComparisons = filteredComparisons.filter(comp => 
        comp.name.toLowerCase().includes(searchTerm) ||
        (comp.description && comp.description.toLowerCase().includes(searchTerm))
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedComparisons = filteredComparisons.slice(startIndex, endIndex);

    return {
      comparisons: paginatedComparisons,
      total: filteredComparisons.length,
      page,
      limit,
      hasMore: endIndex < filteredComparisons.length
    };
  }

  // Get comparison statistics
  static async getComparisonStats(userId?: string): Promise<ComparisonStats> {
    const comparisons = userId 
      ? mockComparisons.filter(comp => comp.userId === userId)
      : mockComparisons;

    const propertyCounts: { [propertyId: string]: number } = {};
    comparisons.forEach(comp => {
      comp.properties.forEach(prop => {
        propertyCounts[prop.propertyId] = (propertyCounts[prop.propertyId] || 0) + 1;
      });
    });

    const mostComparedProperties = Object.entries(propertyCounts)
      .map(([propertyId, count]) => ({ propertyId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const totalProperties = comparisons.reduce((sum, comp) => sum + comp.properties.length, 0);
    const averagePropertiesPerComparison = comparisons.length > 0 ? totalProperties / comparisons.length : 0;

    const recentComparisons = comparisons
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    return {
      totalComparisons: comparisons.length,
      averagePropertiesPerComparison,
      mostComparedProperties,
      recentComparisons
    };
  }
}