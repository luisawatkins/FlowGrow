// Market Analysis Hook

import { useState, useEffect, useCallback } from 'react';
import { 
  MarketAnalysisRequest, 
  MarketAnalysisResponse, 
  UseMarketAnalysisReturn,
  MarketError 
} from '@/types/market';
import { marketService } from '@/lib/marketService';

export const useMarketAnalysis = (request?: MarketAnalysisRequest): UseMarketAnalysisReturn => {
  const [analysis, setAnalysis] = useState<MarketAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<MarketError | null>(null);

  const loadAnalysis = useCallback(async () => {
    if (!request) return;

    try {
      setLoading(true);
      setError(null);
      const fetchedAnalysis = await marketService.getMarketAnalysis(request);
      setAnalysis(fetchedAnalysis);
    } catch (err) {
      setError(err as MarketError);
    } finally {
      setLoading(false);
    }
  }, [request]);

  const refreshAnalysis = useCallback(async (): Promise<void> => {
    await loadAnalysis();
  }, [loadAnalysis]);

  useEffect(() => {
    loadAnalysis();
  }, [loadAnalysis]);

  return {
    analysis,
    loading,
    error,
    refreshAnalysis
  };
};
