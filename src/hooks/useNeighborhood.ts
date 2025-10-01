// Neighborhood Hook
// React state management for neighborhood exploration

import { useState, useCallback } from 'react';
import {
  Neighborhood,
  NeighborhoodSearchRequest,
  NeighborhoodSearchResponse,
  NeighborhoodDetailsRequest,
  NeighborhoodDetailsResponse,
  UseNeighborhoodReturn
} from '@/types/neighborhood';
import { neighborhoodService } from '@/lib/neighborhoodService';

export const useNeighborhood = (): UseNeighborhoodReturn => {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchNeighborhoods = useCallback(async (request: NeighborhoodSearchRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: NeighborhoodSearchResponse = await neighborhoodService.searchNeighborhoods(request);
      setNeighborhoods(response.neighborhoods.map(result => result.neighborhood));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search neighborhoods';
      setError(errorMessage);
      console.error('Neighborhood search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getNeighborhoodDetails = useCallback(async (request: NeighborhoodDetailsRequest): Promise<NeighborhoodDetailsResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await neighborhoodService.getNeighborhoodDetails(request);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get neighborhood details';
      setError(errorMessage);
      console.error('Neighborhood details error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    neighborhoods,
    loading,
    error,
    searchNeighborhoods,
    getNeighborhoodDetails,
    clearError
  };
};