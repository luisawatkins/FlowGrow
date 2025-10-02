import { PriceHistoryEntry, PriceHistoryFilter, PriceTrend, PriceAlert, PriceHistoryAnalytics } from '../types/priceHistory';

class PriceHistoryService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  async getPriceHistory(propertyId: string, filter?: PriceHistoryFilter): Promise<PriceHistoryEntry[]> {
    try {
      const params = new URLSearchParams();
      if (filter?.dateFrom) params.append('dateFrom', filter.dateFrom);
      if (filter?.dateTo) params.append('dateTo', filter.dateTo);
      if (filter?.type) params.append('type', filter.type);

      const response = await fetch(`${this.baseUrl}/price-history/${propertyId}?${params}`);
      if (!response.ok) throw new Error(`Failed to fetch price history: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching price history:', error);
      return [];
    }
  }

  async addPriceEntry(entry: Omit<PriceHistoryEntry, 'id'>): Promise<PriceHistoryEntry> {
    try {
      const response = await fetch(`${this.baseUrl}/price-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (!response.ok) throw new Error(`Failed to add price entry: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error adding price entry:', error);
      throw error;
    }
  }

  async getPriceTrends(propertyId: string, period: string = '1y'): Promise<PriceTrend[]> {
    try {
      const response = await fetch(`${this.baseUrl}/price-history/${propertyId}/trends?period=${period}`);
      if (!response.ok) throw new Error(`Failed to fetch price trends: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching price trends:', error);
      return [];
    }
  }

  async getPriceAnalytics(propertyId: string): Promise<PriceHistoryAnalytics> {
    try {
      const response = await fetch(`${this.baseUrl}/price-history/${propertyId}/analytics`);
      if (!response.ok) throw new Error(`Failed to fetch price analytics: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching price analytics:', error);
      throw error;
    }
  }

  async createPriceAlert(alert: Omit<PriceAlert, 'id' | 'createdAt'>): Promise<PriceAlert> {
    try {
      const response = await fetch(`${this.baseUrl}/price-alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert),
      });
      if (!response.ok) throw new Error(`Failed to create price alert: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error creating price alert:', error);
      throw error;
    }
  }
}

export const priceHistoryService = new PriceHistoryService();