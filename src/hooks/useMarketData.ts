// Market Data Hook

import { useState, useEffect, useCallback } from 'react';
import { 
  MarketDataRequest, 
  MarketDataResponse, 
  UseMarketDataReturn,
  MarketError 
} from '@/types/market';
import { marketService } from '@/lib/marketService';

export const useMarketData = (request?: MarketDataRequest): UseMarketDataReturn => {
  const [data, setData] = useState<any[]>([]);
  const [trend, setTrend] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<MarketError | null>(null);

  const loadData = useCallback(async () => {
    if (!request) return;

    try {
      setLoading(true);
      setError(null);
      const response = await marketService.getMarketData(request);
      setData(response.data);
      setTrend(response.trend);
    } catch (err) {
      setError(err as MarketError);
    } finally {
      setLoading(false);
    }
  }, [request]);

  const refreshData = useCallback(async (): Promise<void> => {
    await loadData();
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    trend,
    loading,
    error,
    refreshData
  };
};
