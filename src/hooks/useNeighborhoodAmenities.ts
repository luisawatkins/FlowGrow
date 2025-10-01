// Neighborhood Amenities Hook
// React state management for neighborhood amenities

import { useState, useCallback } from 'react';
import {
  NeighborhoodAmenity,
  AmenitySearchRequest,
  AmenitySearchResponse,
  UseNeighborhoodAmenitiesReturn
} from '@/types/neighborhood';
import { neighborhoodService } from '@/lib/neighborhoodService';

export const useNeighborhoodAmenities = (): UseNeighborhoodAmenitiesReturn => {
  const [amenities, setAmenities] = useState<NeighborhoodAmenity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAmenities = useCallback(async (request: AmenitySearchRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: AmenitySearchResponse = await neighborhoodService.searchAmenities(request);
      setAmenities(response.amenities);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search amenities';
      setError(errorMessage);
      console.error('Amenity search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAmenityDetails = useCallback(async (amenityId: string): Promise<NeighborhoodAmenity | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const amenity = await neighborhoodService.getAmenityDetails(amenityId);
      return amenity;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get amenity details';
      setError(errorMessage);
      console.error('Amenity details error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    amenities,
    loading,
    error,
    searchAmenities,
    getAmenityDetails,
    clearError
  };
};
