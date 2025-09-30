// Market Opportunities Hook

import { useState, useEffect, useCallback } from 'react';
import { 
  InvestmentOpportunity, 
  MarketOpportunityFilter, 
  UseMarketOpportunitiesReturn,
  MarketError 
} from '@/types/market';
import { marketService } from '@/lib/marketService';

export const useMarketOpportunities = (filter?: MarketOpportunityFilter): UseMarketOpportunitiesReturn => {
  const [opportunities, setOpportunities] = useState<InvestmentOpportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<MarketError | null>(null);

  const loadOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedOpportunities = await marketService.getInvestmentOpportunities(filter || {});
      setOpportunities(fetchedOpportunities);
    } catch (err) {
      setError(err as MarketError);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const refreshOpportunities = useCallback(async (): Promise<void> => {
    await loadOpportunities();
  }, [loadOpportunities]);

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  return {
    opportunities,
    loading,
    error,
    refreshOpportunities
  };
};
