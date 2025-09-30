import { useState, useEffect, useCallback } from 'react';

interface School {
  id: string;
  name: string;
  type: string;
  grades: string;
  rating: number;
  distance: number;
  students: number;
  reviews: {
    count: number;
    average: number;
  };
}

interface TransitStop {
  type: string;
  name: string;
  distance: number;
  lines: string[];
}

interface CommuteTime {
  destination: string;
  time: number;
  mode: 'driving' | 'transit' | 'walking';
}

interface AmenityItem {
  name: string;
  type: string;
  rating: number;
  distance: number;
  reviews: number;
}

interface Demographics {
  population: number;
  medianAge: number;
  medianIncome: number;
  ageDistribution: Array<{
    range: string;
    percentage: number;
  }>;
  householdTypes: Array<{
    name: string;
    percentage: number;
  }>;
}

interface Neighborhood {
  id: string;
  name: string;
  overview: string;
  walkScore: number;
  transitScore: number;
  crimeRate: number;
  medianHomePrice: number;
  priceHistory: Array<{
    year: number;
    price: number;
  }>;
  schools: School[];
  transportation: {
    publicTransit: TransitStop[];
    commuteTimes: CommuteTime[];
  };
  amenities: {
    shopping: AmenityItem[];
    healthcare: AmenityItem[];
    dining: AmenityItem[];
    recreation: AmenityItem[];
  };
  demographics: Demographics;
}

export function useNeighborhood(propertyId: string) {
  const [neighborhood, setNeighborhood] = useState<Neighborhood | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNeighborhoodInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/neighborhoods/${propertyId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch neighborhood information');
      }

      const data = await response.json();
      setNeighborhood(data);
    } catch (error) {
      console.error('Error fetching neighborhood info:', error);
      setError('Failed to load neighborhood information');
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchNeighborhoodInfo();
  }, [fetchNeighborhoodInfo]);

  const getSchoolsInRange = async (range: number) => {
    try {
      const response = await fetch(
        `/api/neighborhoods/${propertyId}/schools?range=${range}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch schools');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching schools:', error);
      throw error;
    }
  };

  const getCommuteTime = async (
    destination: string,
    mode: 'driving' | 'transit' | 'walking' = 'driving'
  ) => {
    try {
      const response = await fetch(
        `/api/neighborhoods/${propertyId}/commute-time?destination=${encodeURIComponent(destination)}&mode=${mode}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch commute time');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching commute time:', error);
      throw error;
    }
  };

  const getNearbyAmenities = async (
    category: string,
    range: number
  ) => {
    try {
      const response = await fetch(
        `/api/neighborhoods/${propertyId}/amenities?category=${category}&range=${range}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch amenities');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching amenities:', error);
      throw error;
    }
  };

  return {
    neighborhood,
    isLoading,
    error,
    getSchoolsInRange,
    getCommuteTime,
    getNearbyAmenities,
  };
}
