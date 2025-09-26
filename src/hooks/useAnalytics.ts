import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '@/lib/analyticsService';

export const useAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await analyticsService.fetchMarketData();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch market data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const predictPrice = useCallback(async (propertyID: number, timeframe: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const prediction = await analyticsService.predictPrice(propertyID, timeframe);
      return prediction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to predict price';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchMarketData,
    predictPrice
  };
};