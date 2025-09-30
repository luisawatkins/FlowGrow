import {
  PropertyComparison,
  ComparisonProperty,
  CreateComparisonRequest,
  UpdateComparisonRequest,
  AddPropertyToComparisonRequest,
  RemovePropertyFromComparisonRequest,
  ComparisonListResponse,
  ComparisonResponse,
  ComparisonError,
  ComparisonValidationError,
  Property,
  PropertyMetrics,
  ExportFormat,
  ComparisonExport
} from '@/types/comparison';
import { calculatePropertyMetrics, rankProperties, validateComparison, generateComparisonSummary } from './comparisonUtils';

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

class ComparisonService {
  private comparisons: PropertyComparison[] = [];
  private nextId = 1;

  /**
   * Create a new comparison
   */
  async createComparison(data: CreateComparisonRequest, userId: string): Promise<ComparisonResponse> {
    try {
      // Validate input
      const validationErrors = this.validateCreateComparison(data);
      if (validationErrors.length > 0) {
        return {
          comparison: null as any,
          success: false,
          message: validationErrors.join(', ')
        };
      }

      // Get properties
      const properties = await this.getPropertiesByIds(data.propertyIds);
      if (properties.length !== data.propertyIds.length) {
        return {
          comparison: null as any,
          success: false,
          message: 'One or more properties not found'
        };
      }

      // Calculate metrics for each property
      const comparisonProperties: ComparisonProperty[] = properties.map(property => {
        const metrics = calculatePropertyMetrics(property, properties);
        return {
          id: `${this.nextId}-${property.id}`,
          propertyId: property.id,
          property,
          metrics,
          score: metrics.overallScore,
          rank: 0,
          addedAt: new Date()
        };
      });

      // Rank properties
      const rankedProperties = rankProperties(comparisonProperties);

      // Create comparison
      const comparison: PropertyComparison = {
        id: `comparison-${this.nextId++}`,
        name: data.name,
        properties: rankedProperties,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
        isPublic: data.isPublic || false,
        tags: data.tags || [],
        notes: data.notes
      };

      this.comparisons.push(comparison);

      return {
        comparison,
        success: true,
        message: 'Comparison created successfully'
      };
    } catch (error) {
      return {
        comparison: null as any,
        success: false,
        message: 'Failed to create comparison'
      };
    }
  }

  /**
   * Get comparison by ID
   */
  async getComparison(id: string, userId: string): Promise<ComparisonResponse> {
    try {
      const comparison = this.comparisons.find(c => c.id === id && (c.userId === userId || c.isPublic));
      
      if (!comparison) {
        return {
          comparison: null as any,
          success: false,
          message: 'Comparison not found'
        };
      }

      return {
        comparison,
        success: true
      };
    } catch (error) {
      return {
        comparison: null as any,
        success: false,
        message: 'Failed to get comparison'
      };
    }
  }

  /**
   * Get user's comparisons
   */
  async getUserComparisons(userId: string, page = 1, limit = 10): Promise<ComparisonListResponse> {
    try {
      const userComparisons = this.comparisons.filter(c => c.userId === userId);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedComparisons = userComparisons.slice(startIndex, endIndex);

      return {
        comparisons: paginatedComparisons,
        total: userComparisons.length,
        page,
        limit
      };
    } catch (error) {
      return {
        comparisons: [],
        total: 0,
        page,
        limit
      };
    }
  }

  /**
   * Update comparison
   */
  async updateComparison(id: string, data: UpdateComparisonRequest, userId: string): Promise<ComparisonResponse> {
    try {
      const comparisonIndex = this.comparisons.findIndex(c => c.id === id && c.userId === userId);
      
      if (comparisonIndex === -1) {
        return {
          comparison: null as any,
          success: false,
          message: 'Comparison not found'
        };
      }

      const comparison = this.comparisons[comparisonIndex];
      
      // Update properties if provided
      if (data.propertyIds) {
        const properties = await this.getPropertiesByIds(data.propertyIds);
        if (properties.length !== data.propertyIds.length) {
          return {
            comparison: null as any,
            success: false,
            message: 'One or more properties not found'
          };
        }

        const comparisonProperties: ComparisonProperty[] = properties.map(property => {
          const metrics = calculatePropertyMetrics(property, properties);
          return {
            id: `${comparison.id}-${property.id}`,
            propertyId: property.id,
            property,
            metrics,
            score: metrics.overallScore,
            rank: 0,
            addedAt: new Date()
          };
        });

        comparison.properties = rankProperties(comparisonProperties);
      }

      // Update other fields
      if (data.name !== undefined) comparison.name = data.name;
      if (data.isPublic !== undefined) comparison.isPublic = data.isPublic;
      if (data.tags !== undefined) comparison.tags = data.tags;
      if (data.notes !== undefined) comparison.notes = data.notes;
      
      comparison.updatedAt = new Date();

      return {
        comparison,
        success: true,
        message: 'Comparison updated successfully'
      };
    } catch (error) {
      return {
        comparison: null as any,
        success: false,
        message: 'Failed to update comparison'
      };
    }
  }

  /**
   * Add property to comparison
   */
  async addPropertyToComparison(
    comparisonId: string,
    data: AddPropertyToComparisonRequest,
    userId: string
  ): Promise<ComparisonResponse> {
    try {
      const comparisonIndex = this.comparisons.findIndex(c => c.id === comparisonId && c.userId === userId);
      
      if (comparisonIndex === -1) {
        return {
          comparison: null as any,
          success: false,
          message: 'Comparison not found'
        };
      }

      const comparison = this.comparisons[comparisonIndex];
      
      // Check if property already exists
      if (comparison.properties.some(p => p.propertyId === data.propertyId)) {
        return {
          comparison: null as any,
          success: false,
          message: 'Property already in comparison'
        };
      }

      // Check maximum properties limit
      if (comparison.properties.length >= 10) {
        return {
          comparison: null as any,
          success: false,
          message: 'Maximum 10 properties allowed in comparison'
        };
      }

      // Get property
      const property = await this.getPropertyById(data.propertyId);
      if (!property) {
        return {
          comparison: null as any,
          success: false,
          message: 'Property not found'
        };
      }

      // Add property to comparison
      const allProperties = [...comparison.properties.map(p => p.property), property];
      const metrics = calculatePropertyMetrics(property, allProperties);
      
      const newComparisonProperty: ComparisonProperty = {
        id: `${comparison.id}-${property.id}`,
        propertyId: property.id,
        property,
        metrics,
        score: metrics.overallScore,
        rank: 0,
        notes: data.notes,
        addedAt: new Date()
      };

      comparison.properties.push(newComparisonProperty);
      comparison.properties = rankProperties(comparison.properties);
      comparison.updatedAt = new Date();

      return {
        comparison,
        success: true,
        message: 'Property added to comparison'
      };
    } catch (error) {
      return {
        comparison: null as any,
        success: false,
        message: 'Failed to add property to comparison'
      };
    }
  }

  /**
   * Remove property from comparison
   */
  async removePropertyFromComparison(
    comparisonId: string,
    data: RemovePropertyFromComparisonRequest,
    userId: string
  ): Promise<ComparisonResponse> {
    try {
      const comparisonIndex = this.comparisons.findIndex(c => c.id === comparisonId && c.userId === userId);
      
      if (comparisonIndex === -1) {
        return {
          comparison: null as any,
          success: false,
          message: 'Comparison not found'
        };
      }

      const comparison = this.comparisons[comparisonIndex];
      
      // Remove property
      comparison.properties = comparison.properties.filter(p => p.propertyId !== data.propertyId);
      
      if (comparison.properties.length < 2) {
        return {
          comparison: null as any,
          success: false,
          message: 'At least 2 properties required in comparison'
        };
      }

      // Recalculate metrics and rank
      const allProperties = comparison.properties.map(p => p.property);
      comparison.properties = comparison.properties.map(property => {
        const metrics = calculatePropertyMetrics(property.property, allProperties);
        return {
          ...property,
          metrics,
          score: metrics.overallScore
        };
      });
      
      comparison.properties = rankProperties(comparison.properties);
      comparison.updatedAt = new Date();

      return {
        comparison,
        success: true,
        message: 'Property removed from comparison'
      };
    } catch (error) {
      return {
        comparison: null as any,
        success: false,
        message: 'Failed to remove property from comparison'
      };
    }
  }

  /**
   * Delete comparison
   */
  async deleteComparison(id: string, userId: string): Promise<ComparisonResponse> {
    try {
      const comparisonIndex = this.comparisons.findIndex(c => c.id === id && c.userId === userId);
      
      if (comparisonIndex === -1) {
        return {
          comparison: null as any,
          success: false,
          message: 'Comparison not found'
        };
      }

      const comparison = this.comparisons[comparisonIndex];
      this.comparisons.splice(comparisonIndex, 1);

      return {
        comparison,
        success: true,
        message: 'Comparison deleted successfully'
      };
    } catch (error) {
      return {
        comparison: null as any,
        success: false,
        message: 'Failed to delete comparison'
      };
    }
  }

  /**
   * Export comparison
   */
  async exportComparison(id: string, format: ExportFormat, userId: string): Promise<ComparisonExport> {
    try {
      const comparison = this.comparisons.find(c => c.id === id && (c.userId === userId || c.isPublic));
      
      if (!comparison) {
        throw new Error('Comparison not found');
      }

      return {
        format,
        data: comparison,
        generatedAt: new Date(),
        generatedBy: userId
      };
    } catch (error) {
      throw new Error('Failed to export comparison');
    }
  }

  /**
   * Get public comparisons
   */
  async getPublicComparisons(page = 1, limit = 10): Promise<ComparisonListResponse> {
    try {
      const publicComparisons = this.comparisons.filter(c => c.isPublic);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedComparisons = publicComparisons.slice(startIndex, endIndex);

      return {
        comparisons: paginatedComparisons,
        total: publicComparisons.length,
        page,
        limit
      };
    } catch (error) {
      return {
        comparisons: [],
        total: 0,
        page,
        limit
      };
    }
  }

  /**
   * Search comparisons
   */
  async searchComparisons(query: string, userId?: string): Promise<ComparisonListResponse> {
    try {
      let searchResults = this.comparisons.filter(c => 
        c.isPublic || (userId && c.userId === userId)
      );

      if (query) {
        const searchTerm = query.toLowerCase();
        searchResults = searchResults.filter(c => 
          c.name.toLowerCase().includes(searchTerm) ||
          c.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
          c.notes?.toLowerCase().includes(searchTerm)
        );
      }

      return {
        comparisons: searchResults,
        total: searchResults.length,
        page: 1,
        limit: searchResults.length
      };
    } catch (error) {
      return {
        comparisons: [],
        total: 0,
        page: 1,
        limit: 0
      };
    }
  }

  // Private helper methods
  private validateCreateComparison(data: CreateComparisonRequest): string[] {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Comparison name is required');
    }

    if (!data.propertyIds || data.propertyIds.length < 2) {
      errors.push('At least 2 properties are required');
    }

    if (data.propertyIds && data.propertyIds.length > 10) {
      errors.push('Maximum 10 properties allowed');
    }

    if (data.name && data.name.length > 100) {
      errors.push('Comparison name must be less than 100 characters');
    }

    return errors;
  }

  private async getPropertiesByIds(propertyIds: string[]): Promise<Property[]> {
    // In a real implementation, this would fetch from a database
    return mockProperties.filter(p => propertyIds.includes(p.id));
  }

  private async getPropertyById(propertyId: string): Promise<Property | null> {
    // In a real implementation, this would fetch from a database
    return mockProperties.find(p => p.id === propertyId) || null;
  }
}

// Export singleton instance
export const comparisonService = new ComparisonService();
export default comparisonService;
