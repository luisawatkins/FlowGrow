export interface PropertyComparison {
  id: string;
  userId: string;
  name: string;
  properties: string[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  tags: string[];
}

export interface ComparisonCriteria {
  price: boolean;
  size: boolean;
  location: boolean;
  amenities: boolean;
  condition: boolean;
  yearBuilt: boolean;
  propertyType: boolean;
  features: boolean;
}

export interface ComparisonResult {
  propertyId: string;
  score: number;
  rank: number;
  advantages: string[];
  disadvantages: string[];
  pricePerSqFt: number;
  valueScore: number;
}

export interface ComparisonFilter {
  userId?: string;
  isPublic?: boolean;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
}

export interface ComparisonAnalytics {
  totalComparisons: number;
  averagePropertiesPerComparison: number;
  mostComparedProperties: Array<{ propertyId: string; count: number }>;
  popularCriteria: Record<string, number>;
  userEngagement: Array<{ date: string; comparisons: number }>;
}

export interface ComparisonShare {
  id: string;
  comparisonId: string;
  shareToken: string;
  expiresAt: string;
  isActive: boolean;
  viewCount: number;
  createdAt: string;
}