// Neighborhood Service
// Business logic for neighborhood exploration and analysis

import {
  Neighborhood,
  NeighborhoodAmenity,
  NeighborhoodDemographics,
  SchoolDistrict,
  CrimeStatistics,
  TransportationInfo,
  NeighborhoodAnalysis,
  NeighborhoodSearchRequest,
  NeighborhoodSearchResponse,
  NeighborhoodDetailsRequest,
  NeighborhoodDetailsResponse,
  AmenitySearchRequest,
  AmenitySearchResponse,
  NeighborhoodSearchFilters,
  NeighborhoodSearchResult,
  AmenityType,
  AmenityCategory,
  SchoolType,
  PropertyType,
  CrimeTrend,
  ParkingAvailability,
  NeighborhoodApiError
} from '@/types/neighborhood';

// Mock data for development and testing
const mockNeighborhoods: Neighborhood[] = [
  {
    id: 'n1',
    name: 'Downtown Arts District',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    zipCode: '94102',
    coordinates: { latitude: 37.7749, longitude: -122.4194 },
    boundaries: {
      type: 'polygon',
      coordinates: [[-122.4194, 37.7749], [-122.4094, 37.7749], [-122.4094, 37.7849], [-122.4194, 37.7849]]
    },
    description: 'Vibrant downtown neighborhood known for its arts scene, galleries, and cultural attractions.',
    imageUrl: '/images/neighborhoods/downtown-arts.jpg',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'n2',
    name: 'Marina District',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    zipCode: '94123',
    coordinates: { latitude: 37.8024, longitude: -122.4484 },
    boundaries: {
      type: 'polygon',
      coordinates: [[-122.4484, 37.8024], [-122.4384, 37.8024], [-122.4384, 37.8124], [-122.4484, 37.8124]]
    },
    description: 'Upscale waterfront neighborhood with beautiful views of the bay and Golden Gate Bridge.',
    imageUrl: '/images/neighborhoods/marina.jpg',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'n3',
    name: 'Mission District',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    zipCode: '94110',
    coordinates: { latitude: 37.7599, longitude: -122.4148 },
    boundaries: {
      type: 'polygon',
      coordinates: [[-122.4148, 37.7599], [-122.4048, 37.7599], [-122.4048, 37.7699], [-122.4148, 37.7699]]
    },
    description: 'Historic neighborhood with vibrant Latino culture, murals, and diverse dining scene.',
    imageUrl: '/images/neighborhoods/mission.jpg',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const mockAmenities: NeighborhoodAmenity[] = [
  {
    id: 'a1',
    name: 'Golden Gate Park',
    type: AmenityType.PARKS,
    category: AmenityCategory.RECREATION,
    address: '501 Stanyan St, San Francisco, CA 94117',
    coordinates: { latitude: 37.7694, longitude: -122.4862 },
    distance: 500,
    rating: 4.8,
    priceLevel: PriceLevel.FREE,
    openingHours: {
      monday: { open: '05:00', close: '22:00', isClosed: false },
      tuesday: { open: '05:00', close: '22:00', isClosed: false },
      wednesday: { open: '05:00', close: '22:00', isClosed: false },
      thursday: { open: '05:00', close: '22:00', isClosed: false },
      friday: { open: '05:00', close: '22:00', isClosed: false },
      saturday: { open: '05:00', close: '22:00', isClosed: false },
      sunday: { open: '05:00', close: '22:00', isClosed: false }
    },
    contactInfo: {
      phone: '(415) 831-2700',
      website: 'https://sfrecpark.org/destination/golden-gate-park/'
    },
    features: ['Walking Trails', 'Museums', 'Botanical Garden', 'Playground', 'Sports Fields'],
    images: ['/images/amenities/golden-gate-park-1.jpg', '/images/amenities/golden-gate-park-2.jpg'],
    description: 'Large urban park with museums, gardens, and recreational facilities.',
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'a2',
    name: 'Whole Foods Market',
    type: AmenityType.GROCERY,
    category: AmenityCategory.ESSENTIAL,
    address: '2001 Market St, San Francisco, CA 94114',
    coordinates: { latitude: 37.7749, longitude: -122.4194 },
    distance: 200,
    rating: 4.2,
    priceLevel: PriceLevel.EXPENSIVE,
    openingHours: {
      monday: { open: '07:00', close: '22:00', isClosed: false },
      tuesday: { open: '07:00', close: '22:00', isClosed: false },
      wednesday: { open: '07:00', close: '22:00', isClosed: false },
      thursday: { open: '07:00', close: '22:00', isClosed: false },
      friday: { open: '07:00', close: '22:00', isClosed: false },
      saturday: { open: '07:00', close: '22:00', isClosed: false },
      sunday: { open: '08:00', close: '21:00', isClosed: false }
    },
    contactInfo: {
      phone: '(415) 552-1155',
      website: 'https://www.wholefoodsmarket.com'
    },
    features: ['Organic Products', 'Hot Bar', 'Bakery', 'Pharmacy', 'Parking'],
    images: ['/images/amenities/whole-foods-1.jpg'],
    description: 'Premium grocery store with organic and natural products.',
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const mockDemographics: NeighborhoodDemographics[] = [
  {
    id: 'd1',
    neighborhoodId: 'n1',
    year: 2023,
    population: 15000,
    ageDistribution: {
      under18: 15,
      age18to24: 20,
      age25to34: 25,
      age35to44: 18,
      age45to54: 12,
      age55to64: 6,
      age65plus: 4
    },
    incomeDistribution: {
      under25k: 20,
      income25kto50k: 25,
      income50kto75k: 20,
      income75kto100k: 15,
      income100kto150k: 12,
      income150kplus: 8
    },
    educationLevel: {
      highSchoolOrLess: 25,
      someCollege: 20,
      bachelorsDegree: 35,
      graduateDegree: 20
    },
    employmentStatus: {
      employed: 85,
      unemployed: 5,
      notInLaborForce: 10
    },
    housingOccupancy: {
      ownerOccupied: 40,
      renterOccupied: 55,
      vacant: 5
    },
    averageHouseholdSize: 2.1,
    medianAge: 32,
    medianIncome: 75000,
    povertyRate: 12,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const mockSchools: SchoolDistrict[] = [
  {
    id: 's1',
    name: 'San Francisco Unified School District',
    type: SchoolType.ELEMENTARY,
    districtCode: 'SFUSD',
    address: '555 Franklin St, San Francisco, CA 94102',
    coordinates: { latitude: 37.7749, longitude: -122.4194 },
    contactInfo: {
      phone: '(415) 241-6000',
      website: 'https://www.sfusd.edu',
      email: 'info@sfusd.edu'
    },
    statistics: {
      totalStudents: 50000,
      studentTeacherRatio: 20,
      graduationRate: 85,
      averageTestScore: 75,
      diversityIndex: 8.5
    },
    ratings: {
      overall: 7.5,
      academics: 7.0,
      teachers: 8.0,
      diversity: 9.0,
      collegePrep: 7.5,
      clubsAndActivities: 8.5,
      sports: 7.0
    },
    programs: ['STEM', 'Arts', 'Language Immersion', 'Special Education'],
    sports: ['Basketball', 'Soccer', 'Track & Field', 'Swimming'],
    clubs: ['Debate', 'Robotics', 'Art', 'Music', 'Environmental'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const mockCrimeStats: CrimeStatistics[] = [
  {
    id: 'c1',
    neighborhoodId: 'n1',
    year: 2023,
    quarter: 4,
    totalCrimes: 150,
    violentCrimes: 25,
    propertyCrimes: 125,
    crimeRate: 10.0,
    crimeTypes: {
      assault: 15,
      robbery: 10,
      burglary: 30,
      theft: 80,
      vandalism: 10,
      drugOffenses: 3,
      other: 2
    },
    safetyScore: 7.5,
    trend: CrimeTrend.STABLE,
    comparisonToCity: -15,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const mockTransportation: TransportationInfo[] = [
  {
    id: 't1',
    neighborhoodId: 'n1',
    publicTransit: {
      busRoutes: [
        {
          id: 'b1',
          routeNumber: '38',
          name: 'Geary',
          stops: [
            {
              id: 'bs1',
              name: 'Geary & Fillmore',
              coordinates: { latitude: 37.7749, longitude: -122.4194 },
              routes: ['38']
            }
          ],
          frequency: 10,
          operatingHours: { start: '05:00', end: '01:00' }
        }
      ],
      trainStations: [
        {
          id: 'ts1',
          name: 'Civic Center Station',
          type: 'subway',
          lines: ['BART', 'Muni'],
          coordinates: { latitude: 37.7799, longitude: -122.4184 },
          accessibility: true,
          parking: false,
          bikeRacks: true
        }
      ],
      bikeLanes: [
        {
          id: 'bl1',
          name: 'Market Street Bike Lane',
          type: 'protected',
          coordinates: [[-122.4194, 37.7749], [-122.4094, 37.7749]],
          length: 1000,
          condition: 'good'
        }
      ],
      walkabilityScore: 85
    },
    commuteTimes: {
      toDowntown: 15,
      toAirport: 45,
      toMajorEmployers: [20, 25, 30]
    },
    parking: {
      streetParking: ParkingAvailability.LIMITED,
      garageParking: ParkingAvailability.MODERATE,
      permitRequired: true,
      permitCost: 150
    },
    trafficPatterns: {
      rushHourCongestion: 7,
      averageSpeed: 25,
      accidentRate: 2.5
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const mockAnalysis: NeighborhoodAnalysis[] = [
  {
    id: 'an1',
    neighborhoodId: 'n1',
    overallScore: 8.2,
    categoryScores: {
      safety: 7.5,
      amenities: 9.0,
      schools: 7.5,
      transportation: 8.5,
      costOfLiving: 6.0,
      walkability: 8.5,
      diversity: 9.5,
      nightlife: 9.0,
      familyFriendly: 7.0,
      investmentPotential: 8.0
    },
    strengths: [
      'Excellent walkability and public transit',
      'Diverse dining and entertainment options',
      'Strong arts and culture scene',
      'Good investment potential'
    ],
    weaknesses: [
      'High cost of living',
      'Limited parking availability',
      'Some safety concerns at night'
    ],
    recommendations: [
      'Consider public transit for daily commute',
      'Look for properties with parking',
      'Explore the neighborhood during different times of day'
    ],
    marketTrends: {
      priceGrowth: 8.5,
      populationGrowth: 3.2,
      developmentActivity: 7.0,
      gentrificationRisk: 6.5
    },
    comparisonToSimilar: {
      neighborhoodIds: ['n2', 'n3'],
      averageScore: 7.8,
      ranking: 1
    },
    lastAnalyzed: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

class NeighborhoodService {
  private neighborhoods: Neighborhood[] = mockNeighborhoods;
  private amenities: NeighborhoodAmenity[] = mockAmenities;
  private demographics: NeighborhoodDemographics[] = mockDemographics;
  private schools: SchoolDistrict[] = mockSchools;
  private crimeStats: CrimeStatistics[] = mockCrimeStats;
  private transportation: TransportationInfo[] = mockTransportation;
  private analysis: NeighborhoodAnalysis[] = mockAnalysis;

  // Neighborhood Search
  async searchNeighborhoods(request: NeighborhoodSearchRequest): Promise<NeighborhoodSearchResponse> {
    try {
      let results = [...this.neighborhoods];

      // Apply text search
      if (request.query) {
        const query = request.query.toLowerCase();
        results = results.filter(neighborhood =>
          neighborhood.name.toLowerCase().includes(query) ||
          neighborhood.city.toLowerCase().includes(query) ||
          neighborhood.description.toLowerCase().includes(query)
        );
      }

      // Apply filters
      if (request.filters) {
        results = this.applyFilters(results, request.filters);
      }

      // Apply location-based filtering
      if (request.location) {
        results = this.filterByLocation(results, request.location);
      }

      // Calculate scores and create search results
      const searchResults: NeighborhoodSearchResult[] = results.map(neighborhood => {
        const score = this.calculateNeighborhoodScore(neighborhood, request);
        const matchReasons = this.getMatchReasons(neighborhood, request);
        const highlights = this.getNeighborhoodHighlights(neighborhood);

        return {
          neighborhood,
          score,
          matchReasons,
          highlights
        };
      });

      // Sort results
      if (request.sortBy) {
        searchResults.sort((a, b) => {
          let comparison = 0;
          switch (request.sortBy) {
            case 'relevance':
              comparison = b.score - a.score;
              break;
            case 'distance':
              // Would need location data for distance calculation
              comparison = 0;
              break;
            case 'score':
              comparison = b.score - a.score;
              break;
            case 'name':
              comparison = a.neighborhood.name.localeCompare(b.neighborhood.name);
              break;
          }
          return request.sortOrder === 'desc' ? comparison : -comparison;
        });
      }

      // Apply pagination
      const limit = request.limit || 20;
      const offset = request.offset || 0;
      const paginatedResults = searchResults.slice(offset, offset + limit);

      return {
        neighborhoods: paginatedResults,
        total: searchResults.length,
        limit,
        offset,
        hasMore: offset + limit < searchResults.length,
        searchTime: 50 // Mock search time
      };
    } catch (error) {
      throw this.createApiError('SEARCH_FAILED', 'Failed to search neighborhoods', error);
    }
  }

  // Get Neighborhood Details
  async getNeighborhoodDetails(request: NeighborhoodDetailsRequest): Promise<NeighborhoodDetailsResponse> {
    try {
      const neighborhood = this.neighborhoods.find(n => n.id === request.neighborhoodId);
      if (!neighborhood) {
        throw this.createApiError('NEIGHBORHOOD_NOT_FOUND', 'Neighborhood not found');
      }

      const response: NeighborhoodDetailsResponse = { neighborhood };

      if (request.includeAmenities) {
        response.amenities = this.amenities.filter(a => 
          this.isAmenityInNeighborhood(a, neighborhood)
        );
      }

      if (request.includeDemographics) {
        response.demographics = this.demographics.find(d => d.neighborhoodId === request.neighborhoodId);
      }

      if (request.includeSchools) {
        response.schools = this.schools; // Simplified - would filter by proximity
      }

      if (request.includeCrime) {
        response.crime = this.crimeStats.find(c => c.neighborhoodId === request.neighborhoodId);
      }

      if (request.includeTransportation) {
        response.transportation = this.transportation.find(t => t.neighborhoodId === request.neighborhoodId);
      }

      if (request.includeAnalysis) {
        response.analysis = this.analysis.find(a => a.neighborhoodId === request.neighborhoodId);
      }

      return response;
    } catch (error) {
      throw this.createApiError('DETAILS_FAILED', 'Failed to get neighborhood details', error);
    }
  }

  // Search Amenities
  async searchAmenities(request: AmenitySearchRequest): Promise<AmenitySearchResponse> {
    try {
      let results = [...this.amenities];

      // Filter by neighborhood
      const neighborhood = this.neighborhoods.find(n => n.id === request.neighborhoodId);
      if (neighborhood) {
        results = results.filter(amenity => 
          this.isAmenityInNeighborhood(amenity, neighborhood)
        );
      }

      // Apply type filter
      if (request.type) {
        results = results.filter(amenity => amenity.type === request.type);
      }

      // Apply category filter
      if (request.category) {
        results = results.filter(amenity => amenity.category === request.category);
      }

      // Apply radius filter
      if (request.radius && neighborhood) {
        results = results.filter(amenity => amenity.distance <= request.radius!);
      }

      // Sort results
      if (request.sortBy) {
        results.sort((a, b) => {
          let comparison = 0;
          switch (request.sortBy) {
            case 'distance':
              comparison = a.distance - b.distance;
              break;
            case 'rating':
              comparison = (b.rating || 0) - (a.rating || 0);
              break;
            case 'name':
              comparison = a.name.localeCompare(b.name);
              break;
          }
          return request.sortOrder === 'desc' ? comparison : -comparison;
        });
      }

      // Apply pagination
      const limit = request.limit || 20;
      const offset = request.offset || 0;
      const paginatedResults = results.slice(offset, offset + limit);

      return {
        amenities: paginatedResults,
        total: results.length,
        limit,
        offset,
        hasMore: offset + limit < results.length
      };
    } catch (error) {
      throw this.createApiError('AMENITY_SEARCH_FAILED', 'Failed to search amenities', error);
    }
  }

  // Get Amenity Details
  async getAmenityDetails(amenityId: string): Promise<NeighborhoodAmenity | null> {
    try {
      return this.amenities.find(a => a.id === amenityId) || null;
    } catch (error) {
      throw this.createApiError('AMENITY_DETAILS_FAILED', 'Failed to get amenity details', error);
    }
  }

  // Get Neighborhood Analysis
  async getNeighborhoodAnalysis(neighborhoodId: string): Promise<NeighborhoodAnalysis | null> {
    try {
      return this.analysis.find(a => a.neighborhoodId === neighborhoodId) || null;
    } catch (error) {
      throw this.createApiError('ANALYSIS_FAILED', 'Failed to get neighborhood analysis', error);
    }
  }

  // Get Neighborhood Demographics
  async getNeighborhoodDemographics(neighborhoodId: string): Promise<NeighborhoodDemographics | null> {
    try {
      return this.demographics.find(d => d.neighborhoodId === neighborhoodId) || null;
    } catch (error) {
      throw this.createApiError('DEMOGRAPHICS_FAILED', 'Failed to get neighborhood demographics', error);
    }
  }

  // Get Crime Statistics
  async getCrimeStatistics(neighborhoodId: string): Promise<CrimeStatistics | null> {
    try {
      return this.crimeStats.find(c => c.neighborhoodId === neighborhoodId) || null;
    } catch (error) {
      throw this.createApiError('CRIME_STATS_FAILED', 'Failed to get crime statistics', error);
    }
  }

  // Get Transportation Info
  async getTransportationInfo(neighborhoodId: string): Promise<TransportationInfo | null> {
    try {
      return this.transportation.find(t => t.neighborhoodId === neighborhoodId) || null;
    } catch (error) {
      throw this.createApiError('TRANSPORTATION_FAILED', 'Failed to get transportation info', error);
    }
  }

  // Get School Districts
  async getSchoolDistricts(neighborhoodId: string): Promise<SchoolDistrict[]> {
    try {
      // Simplified - would filter by proximity to neighborhood
      return this.schools;
    } catch (error) {
      throw this.createApiError('SCHOOLS_FAILED', 'Failed to get school districts', error);
    }
  }

  // Private helper methods
  private applyFilters(neighborhoods: Neighborhood[], filters: NeighborhoodSearchFilters): Neighborhood[] {
    return neighborhoods.filter(neighborhood => {
      // City filter
      if (filters.city && neighborhood.city !== filters.city) return false;

      // State filter
      if (filters.state && neighborhood.state !== filters.state) return false;

      // Zip code filter
      if (filters.zipCode && neighborhood.zipCode !== filters.zipCode) return false;

      // Additional filters would be applied here based on demographics data
      return true;
    });
  }

  private filterByLocation(neighborhoods: Neighborhood[], location: { latitude: number; longitude: number; radius: number }): Neighborhood[] {
    return neighborhoods.filter(neighborhood => {
      const distance = this.calculateDistance(
        location.latitude,
        location.longitude,
        neighborhood.coordinates.latitude,
        neighborhood.coordinates.longitude
      );
      return distance <= location.radius;
    });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private calculateNeighborhoodScore(neighborhood: Neighborhood, request: NeighborhoodSearchRequest): number {
    let score = 5.0; // Base score

    // Boost score based on query match
    if (request.query) {
      const query = request.query.toLowerCase();
      if (neighborhood.name.toLowerCase().includes(query)) score += 2.0;
      if (neighborhood.description.toLowerCase().includes(query)) score += 1.0;
    }

    // Boost score based on analysis data
    const analysis = this.analysis.find(a => a.neighborhoodId === neighborhood.id);
    if (analysis) {
      score = analysis.overallScore;
    }

    return Math.min(10.0, Math.max(0.0, score));
  }

  private getMatchReasons(neighborhood: Neighborhood, request: NeighborhoodSearchRequest): string[] {
    const reasons: string[] = [];

    if (request.query) {
      const query = request.query.toLowerCase();
      if (neighborhood.name.toLowerCase().includes(query)) {
        reasons.push('Name matches search query');
      }
      if (neighborhood.description.toLowerCase().includes(query)) {
        reasons.push('Description matches search query');
      }
    }

    const analysis = this.analysis.find(a => a.neighborhoodId === neighborhood.id);
    if (analysis) {
      if (analysis.overallScore >= 8.0) {
        reasons.push('High overall rating');
      }
      if (analysis.categoryScores.walkability >= 8.0) {
        reasons.push('Excellent walkability');
      }
      if (analysis.categoryScores.amenities >= 8.0) {
        reasons.push('Great amenities');
      }
    }

    return reasons;
  }

  private getNeighborhoodHighlights(neighborhood: Neighborhood) {
    const analysis = this.analysis.find(a => a.neighborhoodId === neighborhood.id);
    const demographics = this.demographics.find(d => d.neighborhoodId === neighborhood.id);
    const crime = this.crimeStats.find(c => c.neighborhoodId === neighborhood.id);
    const transportation = this.transportation.find(t => t.neighborhoodId === neighborhood.id);

    return {
      topAmenities: this.amenities.filter(a => 
        this.isAmenityInNeighborhood(a, neighborhood)
      ).slice(0, 3),
      topSchools: this.schools.slice(0, 2),
      keyStats: {
        population: demographics?.population || 0,
        medianIncome: demographics?.medianIncome || 0,
        walkabilityScore: transportation?.publicTransit.walkabilityScore || 0,
        safetyScore: crime?.safetyScore || 0
      }
    };
  }

  private isAmenityInNeighborhood(amenity: NeighborhoodAmenity, neighborhood: Neighborhood): boolean {
    // Simplified check - would use actual geographic calculations
    const distance = this.calculateDistance(
      neighborhood.coordinates.latitude,
      neighborhood.coordinates.longitude,
      amenity.coordinates.latitude,
      amenity.coordinates.longitude
    );
    return distance <= 2000; // Within 2km
  }

  private createApiError(code: string, message: string, details?: any): NeighborhoodApiError {
    return {
      code,
      message,
      details,
      status: 500,
      timestamp: new Date().toISOString()
    };
  }
}

export const neighborhoodService = new NeighborhoodService();
