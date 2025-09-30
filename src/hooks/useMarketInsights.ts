// Market Insights Hook

import { useState, useEffect, useCallback } from 'react';
import { 
  MarketInsight, 
  MarketInsightFilter, 
  UseMarketInsightsReturn,
  MarketError 
} from '@/types/market';
import { marketService } from '@/lib/marketService';

export const useMarketInsights = (filter?: MarketInsightFilter): UseMarketInsightsReturn => {
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<MarketError | null>(null);

  const loadInsights = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedInsights = await marketService.getMarketInsights(filter || {});
      setInsights(fetchedInsights);
    } catch (err) {
      setError(err as MarketError);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const refreshInsights = useCallback(async (): Promise<void> => {
    await loadInsights();
  }, [loadInsights]);

  useEffect(() => {
    loadInsights();
  }, [loadInsights]);

  return {
    insights,
    loading,
    error,
    refreshInsights
  };
};
