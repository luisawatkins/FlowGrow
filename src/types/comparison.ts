export interface PropertyComparison {
  id: string;
  userId: string;
  name: string;
  description?: string;
  properties: ComparisonProperty[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}

export interface ComparisonProperty {
  id: string;
  propertyId: string;
  property: {
    id: string;
    title: string;
    address: string;
    price: number;
    imageUrl?: string;
    bedrooms?: number;
    bathrooms?: number;
    squareFeet?: number;
    propertyType: string;
    yearBuilt?: number;
    lotSize?: number;
    parkingSpaces?: number;
    features: string[];
    amenities: string[];
  };
  addedAt: Date;
  notes?: string;
  score?: number;
}

export interface ComparisonCriteria {
  id: string;
  name: string;
  weight: number;
  type: 'numeric' | 'boolean' | 'text';
  higherIsBetter: boolean;
}

export interface ComparisonResult {
  propertyId: string;
  propertyTitle: string;
  totalScore: number;
  criteriaScores: { [criteriaId: string]: number };
  rank: number;
  strengths: string[];
  weaknesses: string[];
}

export interface CreateComparisonRequest {
  name: string;
  description?: string;
  propertyIds: string[];
  isPublic: boolean;
}

export interface UpdateComparisonRequest {
  id: string;
  name?: string;
  description?: string;
  isPublic?: boolean;
}

export interface AddPropertyToComparisonRequest {
  comparisonId: string;
  propertyId: string;
  notes?: string;
}

export interface ComparisonStats {
  totalComparisons: number;
  averagePropertiesPerComparison: number;
  mostComparedProperties: { propertyId: string; count: number }[];
  recentComparisons: PropertyComparison[];
}

export interface ComparisonFilter {
  userId?: string;
  isPublic?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface ComparisonSearchResult {
  comparisons: PropertyComparison[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}