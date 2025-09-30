// Market Report Hook

import { useState, useEffect, useCallback } from 'react';
import { 
  MarketReport, 
  MarketAnalysisRequest, 
  UseMarketReportReturn,
  MarketError 
} from '@/types/market';
import { marketService } from '@/lib/marketService';

export const useMarketReport = (reportId?: string): UseMarketReportReturn => {
  const [report, setReport] = useState<MarketReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<MarketError | null>(null);

  const loadReport = useCallback(async () => {
    if (!reportId) return;

    try {
      setLoading(true);
      setError(null);
      const fetchedReport = await marketService.getMarketReport(reportId);
      setReport(fetchedReport);
    } catch (err) {
      setError(err as MarketError);
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  const generateReport = useCallback(async (request: MarketAnalysisRequest): Promise<MarketReport> => {
    try {
      setLoading(true);
      setError(null);
      const analysis = await marketService.getMarketAnalysis(request);
      setReport(analysis.report);
      return analysis.report;
    } catch (err) {
      setError(err as MarketError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshReport = useCallback(async (): Promise<void> => {
    await loadReport();
  }, [loadReport]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  return {
    report,
    loading,
    error,
    generateReport,
    refreshReport
  };
};
