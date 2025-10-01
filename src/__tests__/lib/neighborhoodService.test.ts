// Neighborhood Service Tests
// Comprehensive test suite for neighborhood exploration functionality

import { neighborhoodService } from '@/lib/neighborhoodService';
import {
  NeighborhoodSearchRequest,
  NeighborhoodDetailsRequest,
  AmenitySearchRequest,
  AmenityType,
  AmenityCategory
} from '@/types/neighborhood';

describe('NeighborhoodService', () => {
  describe('searchNeighborhoods', () => {
    it('should return all neighborhoods when no filters are applied', async () => {
      const request: NeighborhoodSearchRequest = {
        limit: 20,
        offset: 0
      };

      const result = await neighborhoodService.searchNeighborhoods(request);

      expect(result).toBeDefined();
      expect(result.neighborhoods).toBeDefined();
      expect(result.total).toBeGreaterThan(0);
      expect(result.limit).toBe(20);
      expect(result.offset).toBe(0);
      expect(result.hasMore).toBeDefined();
      expect(result.searchTime).toBeGreaterThan(0);
    });

    it('should filter neighborhoods by query', async () => {
      const request: NeighborhoodSearchRequest = {
        query: 'Downtown',
        limit: 20,
        offset: 0
      };

      const result = await neighborhoodService.searchNeighborhoods(request);

      expect(result).toBeDefined();
      expect(result.neighborhoods).toBeDefined();
      expect(result.neighborhoods.length).toBeGreaterThan(0);
      
      // Check that all returned neighborhoods match the query
      result.neighborhoods.forEach(neighborhoodResult => {
        const neighborhood = neighborhoodResult.neighborhood;
        expect(
          neighborhood.name.toLowerCase().includes('downtown') ||
          neighborhood.description.toLowerCase().includes('downtown')
        ).toBe(true);
      });
    });

    it('should filter neighborhoods by city', async () => {
      const request: NeighborhoodSearchRequest = {
        filters: {
          city: 'San Francisco'
        },
        limit: 20,
        offset: 0
      };

      const result = await neighborhoodService.searchNeighborhoods(request);

      expect(result).toBeDefined();
      expect(result.neighborhoods).toBeDefined();
      
      // Check that all returned neighborhoods are in San Francisco
      result.neighborhoods.forEach(neighborhoodResult => {
        expect(neighborhoodResult.neighborhood.city).toBe('San Francisco');
      });
    });

    it('should filter neighborhoods by state', async () => {
      const request: NeighborhoodSearchRequest = {
        filters: {
          state: 'CA'
        },
        limit: 20,
        offset: 0
      };

      const result = await neighborhoodService.searchNeighborhoods(request);

      expect(result).toBeDefined();
      expect(result.neighborhoods).toBeDefined();
      
      // Check that all returned neighborhoods are in California
      result.neighborhoods.forEach(neighborhoodResult => {
        expect(neighborhoodResult.neighborhood.state).toBe('CA');
      });
    });

    it('should filter neighborhoods by zip code', async () => {
      const request: NeighborhoodSearchRequest = {
        filters: {
          zipCode: '94102'
        },
        limit: 20,
        offset: 0
      };

      const result = await neighborhoodService.searchNeighborhoods(request);

      expect(result).toBeDefined();
      expect(result.neighborhoods).toBeDefined();
      
      // Check that all returned neighborhoods have the specified zip code
      result.neighborhoods.forEach(neighborhoodResult => {
        expect(neighborhoodResult.neighborhood.zipCode).toBe('94102');
      });
    });

    it('should apply location-based filtering', async () => {
      const request: NeighborhoodSearchRequest = {
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          radius: 1000 // 1km radius
        },
        limit: 20,
        offset: 0
      };

      const result = await neighborhoodService.searchNeighborhoods(request);

      expect(result).toBeDefined();
      expect(result.neighborhoods).toBeDefined();
      
      // Check that all returned neighborhoods are within the specified radius
      result.neighborhoods.forEach(neighborhoodResult => {
        const neighborhood = neighborhoodResult.neighborhood;
        const distance = calculateDistance(
          37.7749, -122.4194,
          neighborhood.coordinates.latitude,
          neighborhood.coordinates.longitude
        );
        expect(distance).toBeLessThanOrEqual(1000);
      });
    });

    it('should sort neighborhoods by relevance', async () => {
      const request: NeighborhoodSearchRequest = {
        query: 'Arts',
        sortBy: 'relevance',
        sortOrder: 'desc',
        limit: 20,
        offset: 0
      };

      const result = await neighborhoodService.searchNeighborhoods(request);

      expect(result).toBeDefined();
      expect(result.neighborhoods).toBeDefined();
      
      // Check that results are sorted by score (highest first)
      for (let i = 1; i < result.neighborhoods.length; i++) {
        expect(result.neighborhoods[i - 1].score).toBeGreaterThanOrEqual(result.neighborhoods[i].score);
      }
    });

    it('should sort neighborhoods by name', async () => {
      const request: NeighborhoodSearchRequest = {
        sortBy: 'name',
        sortOrder: 'asc',
        limit: 20,
        offset: 0
      };

      const result = await neighborhoodService.searchNeighborhoods(request);

      expect(result).toBeDefined();
      expect(result.neighborhoods).toBeDefined();
      
      // Check that results are sorted by name (alphabetical)
      for (let i = 1; i < result.neighborhoods.length; i++) {
        const prevName = result.neighborhoods[i - 1].neighborhood.name;
        const currName = result.neighborhoods[i].neighborhood.name;
        expect(prevName.localeCompare(currName)).toBeLessThanOrEqual(0);
      }
    });

    it('should handle pagination correctly', async () => {
      const request1: NeighborhoodSearchRequest = {
        limit: 2,
        offset: 0
      };

      const request2: NeighborhoodSearchRequest = {
        limit: 2,
        offset: 2
      };

      const result1 = await neighborhoodService.searchNeighborhoods(request1);
      const result2 = await neighborhoodService.searchNeighborhoods(request2);

      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(result1.neighborhoods.length).toBeLessThanOrEqual(2);
      expect(result2.neighborhoods.length).toBeLessThanOrEqual(2);
      expect(result1.offset).toBe(0);
      expect(result2.offset).toBe(2);
      
      // Check that results don't overlap
      const ids1 = result1.neighborhoods.map(r => r.neighborhood.id);
      const ids2 = result2.neighborhoods.map(r => r.neighborhood.id);
      const overlap = ids1.filter(id => ids2.includes(id));
      expect(overlap.length).toBe(0);
    });

    it('should return empty results for non-matching query', async () => {
      const request: NeighborhoodSearchRequest = {
        query: 'NonExistentNeighborhood',
        limit: 20,
        offset: 0
      };

      const result = await neighborhoodService.searchNeighborhoods(request);

      expect(result).toBeDefined();
      expect(result.neighborhoods).toBeDefined();
      expect(result.neighborhoods.length).toBe(0);
      expect(result.total).toBe(0);
      expect(result.hasMore).toBe(false);
    });

    it('should handle invalid request gracefully', async () => {
      const request = {} as NeighborhoodSearchRequest;

      const result = await neighborhoodService.searchNeighborhoods(request);

      expect(result).toBeDefined();
      expect(result.neighborhoods).toBeDefined();
      expect(result.total).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getNeighborhoodDetails', () => {
    it('should return neighborhood details with all data', async () => {
      const request: NeighborhoodDetailsRequest = {
        neighborhoodId: 'n1',
        includeAmenities: true,
        includeDemographics: true,
        includeSchools: true,
        includeCrime: true,
        includeTransportation: true,
        includeAnalysis: true
      };

      const result = await neighborhoodService.getNeighborhoodDetails(request);

      expect(result).toBeDefined();
      expect(result.neighborhood).toBeDefined();
      expect(result.neighborhood.id).toBe('n1');
      expect(result.amenities).toBeDefined();
      expect(result.demographics).toBeDefined();
      expect(result.schools).toBeDefined();
      expect(result.crime).toBeDefined();
      expect(result.transportation).toBeDefined();
      expect(result.analysis).toBeDefined();
    });

    it('should return neighborhood details with selective data', async () => {
      const request: NeighborhoodDetailsRequest = {
        neighborhoodId: 'n1',
        includeAmenities: true,
        includeDemographics: false,
        includeSchools: false,
        includeCrime: false,
        includeTransportation: false,
        includeAnalysis: false
      };

      const result = await neighborhoodService.getNeighborhoodDetails(request);

      expect(result).toBeDefined();
      expect(result.neighborhood).toBeDefined();
      expect(result.neighborhood.id).toBe('n1');
      expect(result.amenities).toBeDefined();
      expect(result.demographics).toBeUndefined();
      expect(result.schools).toBeUndefined();
      expect(result.crime).toBeUndefined();
      expect(result.transportation).toBeUndefined();
      expect(result.analysis).toBeUndefined();
    });

    it('should return null for non-existent neighborhood', async () => {
      const request: NeighborhoodDetailsRequest = {
        neighborhoodId: 'non-existent',
        includeAmenities: true
      };

      const result = await neighborhoodService.getNeighborhoodDetails(request);

      expect(result).toBeNull();
    });

    it('should handle invalid neighborhood ID', async () => {
      const request: NeighborhoodDetailsRequest = {
        neighborhoodId: '',
        includeAmenities: true
      };

      const result = await neighborhoodService.getNeighborhoodDetails(request);

      expect(result).toBeNull();
    });
  });

  describe('searchAmenities', () => {
    it('should return amenities for a neighborhood', async () => {
      const request: AmenitySearchRequest = {
        neighborhoodId: 'n1',
        limit: 20,
        offset: 0
      };

      const result = await neighborhoodService.searchAmenities(request);

      expect(result).toBeDefined();
      expect(result.amenities).toBeDefined();
      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(result.limit).toBe(20);
      expect(result.offset).toBe(0);
      expect(result.hasMore).toBeDefined();
    });

    it('should filter amenities by type', async () => {
      const request: AmenitySearchRequest = {
        neighborhoodId: 'n1',
        type: AmenityType.PARKS,
        limit: 20,
        offset: 0
      };

      const result = await neighborhoodService.searchAmenities(request);

      expect(result).toBeDefined();
      expect(result.amenities).toBeDefined();
      
      // Check that all returned amenities are of the specified type
      result.amenities.forEach(amenity => {
        expect(amenity.type).toBe(AmenityType.PARKS);
      });
    });

    it('should filter amenities by category', async () => {
      const request: AmenitySearchRequest = {
        neighborhoodId: 'n1',
        category: AmenityCategory.ESSENTIAL,
        limit: 20,
        offset: 0
      };

      const result = await neighborhoodService.searchAmenities(request);

      expect(result).toBeDefined();
      expect(result.amenities).toBeDefined();
      
      // Check that all returned amenities are of the specified category
      result.amenities.forEach(amenity => {
        expect(amenity.category).toBe(AmenityCategory.ESSENTIAL);
      });
    });

    it('should filter amenities by radius', async () => {
      const request: AmenitySearchRequest = {
        neighborhoodId: 'n1',
        radius: 500, // 500 meters
        limit: 20,
        offset: 0
      };

      const result = await neighborhoodService.searchAmenities(request);

      expect(result).toBeDefined();
      expect(result.amenities).toBeDefined();
      
      // Check that all returned amenities are within the specified radius
      result.amenities.forEach(amenity => {
        expect(amenity.distance).toBeLessThanOrEqual(500);
      });
    });

    it('should sort amenities by distance', async () => {
      const request: AmenitySearchRequest = {
        neighborhoodId: 'n1',
        sortBy: 'distance',
        sortOrder: 'asc',
        limit: 20,
        offset: 0
      };

      const result = await neighborhoodService.searchAmenities(request);

      expect(result).toBeDefined();
      expect(result.amenities).toBeDefined();
      
      // Check that results are sorted by distance (closest first)
      for (let i = 1; i < result.amenities.length; i++) {
        expect(result.amenities[i - 1].distance).toBeLessThanOrEqual(result.amenities[i].distance);
      }
    });

    it('should sort amenities by rating', async () => {
      const request: AmenitySearchRequest = {
        neighborhoodId: 'n1',
        sortBy: 'rating',
        sortOrder: 'desc',
        limit: 20,
        offset: 0
      };

      const result = await neighborhoodService.searchAmenities(request);

      expect(result).toBeDefined();
      expect(result.amenities).toBeDefined();
      
      // Check that results are sorted by rating (highest first)
      for (let i = 1; i < result.amenities.length; i++) {
        const prevRating = result.amenities[i - 1].rating || 0;
        const currRating = result.amenities[i].rating || 0;
        expect(prevRating).toBeGreaterThanOrEqual(currRating);
      }
    });

    it('should handle pagination correctly', async () => {
      const request1: AmenitySearchRequest = {
        neighborhoodId: 'n1',
        limit: 1,
        offset: 0
      };

      const request2: AmenitySearchRequest = {
        neighborhoodId: 'n1',
        limit: 1,
        offset: 1
      };

      const result1 = await neighborhoodService.searchAmenities(request1);
      const result2 = await neighborhoodService.searchAmenities(request2);

      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(result1.amenities.length).toBeLessThanOrEqual(1);
      expect(result2.amenities.length).toBeLessThanOrEqual(1);
      expect(result1.offset).toBe(0);
      expect(result2.offset).toBe(1);
    });

    it('should return empty results for non-existent neighborhood', async () => {
      const request: AmenitySearchRequest = {
        neighborhoodId: 'non-existent',
        limit: 20,
        offset: 0
      };

      const result = await neighborhoodService.searchAmenities(request);

      expect(result).toBeDefined();
      expect(result.amenities).toBeDefined();
      expect(result.amenities.length).toBe(0);
      expect(result.total).toBe(0);
      expect(result.hasMore).toBe(false);
    });
  });

  describe('getAmenityDetails', () => {
    it('should return amenity details for valid ID', async () => {
      const result = await neighborhoodService.getAmenityDetails('a1');

      expect(result).toBeDefined();
      expect(result?.id).toBe('a1');
      expect(result?.name).toBeDefined();
      expect(result?.type).toBeDefined();
      expect(result?.category).toBeDefined();
      expect(result?.address).toBeDefined();
      expect(result?.coordinates).toBeDefined();
    });

    it('should return null for non-existent amenity ID', async () => {
      const result = await neighborhoodService.getAmenityDetails('non-existent');

      expect(result).toBeNull();
    });

    it('should return null for empty amenity ID', async () => {
      const result = await neighborhoodService.getAmenityDetails('');

      expect(result).toBeNull();
    });
  });

  describe('getNeighborhoodAnalysis', () => {
    it('should return analysis for valid neighborhood ID', async () => {
      const result = await neighborhoodService.getNeighborhoodAnalysis('n1');

      expect(result).toBeDefined();
      expect(result?.neighborhoodId).toBe('n1');
      expect(result?.overallScore).toBeDefined();
      expect(result?.categoryScores).toBeDefined();
      expect(result?.strengths).toBeDefined();
      expect(result?.weaknesses).toBeDefined();
      expect(result?.recommendations).toBeDefined();
      expect(result?.marketTrends).toBeDefined();
    });

    it('should return null for non-existent neighborhood ID', async () => {
      const result = await neighborhoodService.getNeighborhoodAnalysis('non-existent');

      expect(result).toBeNull();
    });

    it('should return null for empty neighborhood ID', async () => {
      const result = await neighborhoodService.getNeighborhoodAnalysis('');

      expect(result).toBeNull();
    });
  });

  describe('getNeighborhoodDemographics', () => {
    it('should return demographics for valid neighborhood ID', async () => {
      const result = await neighborhoodService.getNeighborhoodDemographics('n1');

      expect(result).toBeDefined();
      expect(result?.neighborhoodId).toBe('n1');
      expect(result?.population).toBeDefined();
      expect(result?.ageDistribution).toBeDefined();
      expect(result?.incomeDistribution).toBeDefined();
      expect(result?.educationLevel).toBeDefined();
      expect(result?.employmentStatus).toBeDefined();
      expect(result?.housingOccupancy).toBeDefined();
    });

    it('should return null for non-existent neighborhood ID', async () => {
      const result = await neighborhoodService.getNeighborhoodDemographics('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('getCrimeStatistics', () => {
    it('should return crime statistics for valid neighborhood ID', async () => {
      const result = await neighborhoodService.getCrimeStatistics('n1');

      expect(result).toBeDefined();
      expect(result?.neighborhoodId).toBe('n1');
      expect(result?.totalCrimes).toBeDefined();
      expect(result?.violentCrimes).toBeDefined();
      expect(result?.propertyCrimes).toBeDefined();
      expect(result?.crimeRate).toBeDefined();
      expect(result?.safetyScore).toBeDefined();
      expect(result?.trend).toBeDefined();
    });

    it('should return null for non-existent neighborhood ID', async () => {
      const result = await neighborhoodService.getCrimeStatistics('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('getTransportationInfo', () => {
    it('should return transportation info for valid neighborhood ID', async () => {
      const result = await neighborhoodService.getTransportationInfo('n1');

      expect(result).toBeDefined();
      expect(result?.neighborhoodId).toBe('n1');
      expect(result?.publicTransit).toBeDefined();
      expect(result?.commuteTimes).toBeDefined();
      expect(result?.parking).toBeDefined();
      expect(result?.trafficPatterns).toBeDefined();
    });

    it('should return null for non-existent neighborhood ID', async () => {
      const result = await neighborhoodService.getTransportationInfo('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('getSchoolDistricts', () => {
    it('should return school districts for valid neighborhood ID', async () => {
      const result = await neighborhoodService.getSchoolDistricts('n1');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      if (result.length > 0) {
        const school = result[0];
        expect(school.id).toBeDefined();
        expect(school.name).toBeDefined();
        expect(school.type).toBeDefined();
        expect(school.districtCode).toBeDefined();
        expect(school.address).toBeDefined();
        expect(school.coordinates).toBeDefined();
        expect(school.contactInfo).toBeDefined();
        expect(school.statistics).toBeDefined();
        expect(school.ratings).toBeDefined();
      }
    });

    it('should return empty array for non-existent neighborhood ID', async () => {
      const result = await neighborhoodService.getSchoolDistricts('non-existent');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle service errors gracefully', async () => {
      // Mock a service error by passing invalid data
      const invalidRequest = {
        location: {
          latitude: 'invalid',
          longitude: 'invalid',
          radius: 'invalid'
        }
      } as any;

      try {
        await neighborhoodService.searchNeighborhoods(invalidRequest);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.code).toBeDefined();
        expect(error.message).toBeDefined();
        expect(error.status).toBeDefined();
        expect(error.timestamp).toBeDefined();
      }
    });
  });
});

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
