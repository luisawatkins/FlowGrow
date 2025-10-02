import { PropertyComparison, ComparisonCriteria, ComparisonResult, ComparisonFilter } from '../types/comparison';

class ComparisonService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  async getComparisons(filter?: ComparisonFilter): Promise<PropertyComparison[]> {
    try {
      const params = new URLSearchParams();
      if (filter?.userId) params.append('userId', filter.userId);
      if (filter?.isPublic !== undefined) params.append('isPublic', filter.isPublic.toString());

      const response = await fetch(`${this.baseUrl}/comparison?${params}`);
      if (!response.ok) throw new Error(`Failed to fetch comparisons: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching comparisons:', error);
      return [];
    }
  }

  async createComparison(comparison: Omit<PropertyComparison, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyComparison> {
    try {
      const response = await fetch(`${this.baseUrl}/comparison`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comparison),
      });
      if (!response.ok) throw new Error(`Failed to create comparison: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error creating comparison:', error);
      throw error;
    }
  }

  async compareProperties(propertyIds: string[], criteria: ComparisonCriteria): Promise<ComparisonResult[]> {
    try {
      const response = await fetch(`${this.baseUrl}/comparison/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyIds, criteria }),
      });
      if (!response.ok) throw new Error(`Failed to compare properties: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error comparing properties:', error);
      throw error;
    }
  }
}

export const comparisonService = new ComparisonService();