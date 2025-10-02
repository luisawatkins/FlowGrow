export interface PriceHistoryEntry {
  id: string;
  propertyId: string;
  price: number;
  currency: string;
  date: string;
  source: string;
  type: 'sale' | 'rent' | 'estimate';
  confidence?: number;
  notes?: string;
}

export interface PriceHistoryFilter {
  propertyId?: string;
  dateFrom?: string;
  dateTo?: string;
  type?: 'sale' | 'rent' | 'estimate';
  source?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface PriceTrend {
  propertyId: string;
  period: '1m' | '3m' | '6m' | '1y' | '2y' | '5y';
  trend: 'increasing' | 'decreasing' | 'stable';
  percentageChange: number;
  averagePrice: number;
  volatility: number;
  dataPoints: number;
}

export interface PriceAlert {
  id: string;
  propertyId: string;
  userId: string;
  type: 'price_drop' | 'price_increase' | 'new_listing';
  threshold: number;
  isActive: boolean;
  createdAt: string;
  triggeredAt?: string;
}

export interface PriceHistoryAnalytics {
  propertyId: string;
  totalEntries: number;
  averagePrice: number;
  medianPrice: number;
  minPrice: number;
  maxPrice: number;
  priceRange: number;
  volatility: number;
  trends: PriceTrend[];
  lastUpdated: string;
}