// Neighborhood Analysis Hook
// React state management for neighborhood analysis

import { useState, useCallback } from 'react';
import {
  NeighborhoodAnalysis,
  UseNeighborhoodAnalysisReturn
} from '@/types/neighborhood';
import { neighborhoodService } from '@/lib/neighborhoodService';

export const useNeighborhoodAnalysis = (): UseNeighborhoodAnalysisReturn => {
  const [analysis, setAnalysis] = useState<NeighborhoodAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAnalysis = useCallback(async (neighborhoodId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const analysisData = await neighborhoodService.getNeighborhoodAnalysis(neighborhoodId);
      setAnalysis(analysisData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get neighborhood analysis';
      setError(errorMessage);
      console.error('Neighborhood analysis error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshAnalysis = useCallback(async (neighborhoodId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, this would trigger a new analysis
      const analysisData = await neighborhoodService.getNeighborhoodAnalysis(neighborhoodId);
      setAnalysis(analysisData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh neighborhood analysis';
      setError(errorMessage);
      console.error('Neighborhood analysis refresh error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    analysis,
    loading,
    error,
    getAnalysis,
    refreshAnalysis,
    clearError
  };
};
