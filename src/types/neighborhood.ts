// Neighborhood Explorer Types
// Comprehensive type definitions for neighborhood exploration and analysis

export interface Neighborhood {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  boundaries: {
    type: 'polygon' | 'circle' | 'rectangle';
    coordinates: number[][];
    radius?: number; // for circle type
  };
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NeighborhoodAmenity {
  id: string;
  name: string;
  type: AmenityType;
  category: AmenityCategory;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance: number; // in meters from neighborhood center
  rating?: number;
  priceLevel?: PriceLevel;
  openingHours?: OpeningHours;
  contactInfo?: {
    phone?: string;
    website?: string;
    email?: string;
  };
  features: string[];
  images: string[];
  description: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NeighborhoodDemographics {
  id: string;
  neighborhoodId: string;
  year: number;
  population: number;
  ageDistribution: {
    under18: number;
    age18to24: number;
    age25to34: number;
    age35to44: number;
    age45to54: number;
    age55to64: number;
    age65plus: number;
  };
  incomeDistribution: {
    under25k: number;
    income25kto50k: number;
    income50kto75k: number;
    income75kto100k: number;
    income100kto150k: number;
    income150kplus: number;
  };
  educationLevel: {
    highSchoolOrLess: number;
    someCollege: number;
    bachelorsDegree: number;
    graduateDegree: number;
  };
  employmentStatus: {
    employed: number;
    unemployed: number;
    notInLaborForce: number;
  };
  housingOccupancy: {
    ownerOccupied: number;
    renterOccupied: number;
    vacant: number;
  };
  averageHouseholdSize: number;
  medianAge: number;
  medianIncome: number;
  povertyRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolDistrict {
  id: string;
  name: string;
  type: SchoolType;
  districtCode: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  contactInfo: {
    phone: string;
    website: string;
    email?: string;
  };
  statistics: {
    totalStudents: number;
    studentTeacherRatio: number;
    graduationRate: number;
    averageTestScore: number;
    diversityIndex: number;
  };
  ratings: {
    overall: number;
    academics: number;
    teachers: number;
    diversity: number;
    collegePrep: number;
    clubsAndActivities: number;
    sports: number;
  };
  programs: string[];
  sports: string[];
  clubs: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CrimeStatistics {
  id: string;
  neighborhoodId: string;
  year: number;
  quarter: number;
  totalCrimes: number;
  violentCrimes: number;
  propertyCrimes: number;
  crimeRate: number; // crimes per 1000 residents
  crimeTypes: {
    assault: number;
    robbery: number;
    burglary: number;
    theft: number;
    vandalism: number;
    drugOffenses: number;
    other: number;
  };
  safetyScore: number; // 1-10 scale
  trend: CrimeTrend;
  comparisonToCity: number; // percentage compared to city average
  createdAt: string;
  updatedAt: string;
}

export interface TransportationInfo {
  id: string;
  neighborhoodId: string;
  publicTransit: {
    busRoutes: BusRoute[];
    trainStations: TrainStation[];
    bikeLanes: BikeLane[];
    walkabilityScore: number; // 1-100
  };
  commuteTimes: {
    toDowntown: number; // in minutes
    toAirport: number;
    toMajorEmployers: number[];
  };
  parking: {
    streetParking: ParkingAvailability;
    garageParking: ParkingAvailability;
    permitRequired: boolean;
    permitCost?: number;
  };
  trafficPatterns: {
    rushHourCongestion: number; // 1-10 scale
    averageSpeed: number; // mph
    accidentRate: number; // accidents per 1000 residents
  };
  createdAt: string;
  updatedAt: string;
}

export interface NeighborhoodAnalysis {
  id: string;
  neighborhoodId: string;
  overallScore: number; // 1-10 scale
  categoryScores: {
    safety: number;
    amenities: number;
    schools: number;
    transportation: number;
    costOfLiving: number;
    walkability: number;
    diversity: number;
    nightlife: number;
    familyFriendly: number;
    investmentPotential: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  marketTrends: {
    priceGrowth: number; // percentage
    populationGrowth: number;
    developmentActivity: number;
    gentrificationRisk: number; // 1-10 scale
  };
  comparisonToSimilar: {
    neighborhoodIds: string[];
    averageScore: number;
    ranking: number;
  };
  lastAnalyzed: string;
  createdAt: string;
  updatedAt: string;
}

export interface NeighborhoodSearchFilters {
  city?: string;
  state?: string;
  zipCode?: string;
  minPopulation?: number;
  maxPopulation?: number;
  minMedianIncome?: number;
  maxMedianIncome?: number;
  minWalkabilityScore?: number;
  maxWalkabilityScore?: number;
  minSafetyScore?: number;
  maxSafetyScore?: number;
  amenityTypes?: AmenityType[];
  schoolTypes?: SchoolType[];
  maxCommuteTime?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  propertyTypes?: PropertyType[];
  tags?: string[];
}

export interface NeighborhoodSearchResult {
  neighborhood: Neighborhood;
  score: number;
  matchReasons: string[];
  highlights: {
    topAmenities: NeighborhoodAmenity[];
    topSchools: SchoolDistrict[];
    keyStats: {
      population: number;
      medianIncome: number;
      walkabilityScore: number;
      safetyScore: number;
    };
  };
}

// Enums
export enum AmenityType {
  RESTAURANT = 'restaurant',
  SHOPPING = 'shopping',
  ENTERTAINMENT = 'entertainment',
  HEALTHCARE = 'healthcare',
  FITNESS = 'fitness',
  EDUCATION = 'education',
  TRANSPORTATION = 'transportation',
  FINANCIAL = 'financial',
  GOVERNMENT = 'government',
  RELIGIOUS = 'religious',
  PARKS = 'parks',
  RECREATION = 'recreation',
  NIGHTLIFE = 'nightlife',
  GROCERY = 'grocery',
  PHARMACY = 'pharmacy',
  OTHER = 'other'
}

export enum AmenityCategory {
  ESSENTIAL = 'essential',
  CONVENIENCE = 'convenience',
  LUXURY = 'luxury',
  ENTERTAINMENT = 'entertainment',
  HEALTH = 'health',
  EDUCATION = 'education',
  TRANSPORTATION = 'transportation',
  FINANCIAL = 'financial',
  GOVERNMENT = 'government',
  RELIGIOUS = 'religious',
  RECREATION = 'recreation',
  NIGHTLIFE = 'nightlife',
  SHOPPING = 'shopping',
  DINING = 'dining',
  OTHER = 'other'
}

export enum PriceLevel {
  FREE = 'free',
  BUDGET = 'budget',
  MODERATE = 'moderate',
  EXPENSIVE = 'expensive',
  VERY_EXPENSIVE = 'very_expensive'
}

export enum SchoolType {
  ELEMENTARY = 'elementary',
  MIDDLE = 'middle',
  HIGH = 'high',
  PRIVATE = 'private',
  CHARTER = 'charter',
  MONTESSORI = 'montessori',
  MAGNET = 'magnet',
  VOCATIONAL = 'vocational',
  SPECIAL_EDUCATION = 'special_education'
}

export enum PropertyType {
  SINGLE_FAMILY = 'single_family',
  CONDO = 'condo',
  TOWNHOUSE = 'townhouse',
  APARTMENT = 'apartment',
  MULTI_FAMILY = 'multi_family',
  COMMERCIAL = 'commercial',
  LAND = 'land',
  MOBILE_HOME = 'mobile_home',
  OTHER = 'other'
}

export enum CrimeTrend {
  DECREASING = 'decreasing',
  STABLE = 'stable',
  INCREASING = 'increasing',
  UNKNOWN = 'unknown'
}

export enum ParkingAvailability {
  ABUNDANT = 'abundant',
  MODERATE = 'moderate',
  LIMITED = 'limited',
  SCARCE = 'scarce',
  NONE = 'none'
}

// Supporting interfaces
export interface OpeningHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string; // HH:MM format
  close: string; // HH:MM format
  isClosed: boolean;
}

export interface BusRoute {
  id: string;
  routeNumber: string;
  name: string;
  stops: BusStop[];
  frequency: number; // minutes between buses
  operatingHours: {
    start: string;
    end: string;
  };
}

export interface BusStop {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  routes: string[];
}

export interface TrainStation {
  id: string;
  name: string;
  type: 'subway' | 'commuter' | 'light_rail' | 'intercity';
  lines: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  accessibility: boolean;
  parking: boolean;
  bikeRacks: boolean;
}

export interface BikeLane {
  id: string;
  name: string;
  type: 'protected' | 'buffered' | 'standard' | 'shared';
  coordinates: number[][];
  length: number; // in meters
  condition: 'excellent' | 'good' | 'fair' | 'poor';
}

// API Types
export interface NeighborhoodSearchRequest {
  query?: string;
  filters?: NeighborhoodSearchFilters;
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // in meters
  };
  limit?: number;
  offset?: number;
  sortBy?: 'relevance' | 'distance' | 'score' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface NeighborhoodSearchResponse {
  neighborhoods: NeighborhoodSearchResult[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  searchTime: number; // in milliseconds
}

export interface NeighborhoodDetailsRequest {
  neighborhoodId: string;
  includeAmenities?: boolean;
  includeDemographics?: boolean;
  includeSchools?: boolean;
  includeCrime?: boolean;
  includeTransportation?: boolean;
  includeAnalysis?: boolean;
}

export interface NeighborhoodDetailsResponse {
  neighborhood: Neighborhood;
  amenities?: NeighborhoodAmenity[];
  demographics?: NeighborhoodDemographics;
  schools?: SchoolDistrict[];
  crime?: CrimeStatistics;
  transportation?: TransportationInfo;
  analysis?: NeighborhoodAnalysis;
}

export interface AmenitySearchRequest {
  neighborhoodId: string;
  type?: AmenityType;
  category?: AmenityCategory;
  radius?: number; // in meters
  limit?: number;
  offset?: number;
  sortBy?: 'distance' | 'rating' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface AmenitySearchResponse {
  amenities: NeighborhoodAmenity[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// Hook Types
export interface UseNeighborhoodReturn {
  neighborhoods: Neighborhood[];
  loading: boolean;
  error: string | null;
  searchNeighborhoods: (request: NeighborhoodSearchRequest) => Promise<void>;
  getNeighborhoodDetails: (request: NeighborhoodDetailsRequest) => Promise<NeighborhoodDetailsResponse | null>;
  clearError: () => void;
}

export interface UseNeighborhoodAmenitiesReturn {
  amenities: NeighborhoodAmenity[];
  loading: boolean;
  error: string | null;
  searchAmenities: (request: AmenitySearchRequest) => Promise<void>;
  getAmenityDetails: (amenityId: string) => Promise<NeighborhoodAmenity | null>;
  clearError: () => void;
}

export interface UseNeighborhoodAnalysisReturn {
  analysis: NeighborhoodAnalysis | null;
  loading: boolean;
  error: string | null;
  getAnalysis: (neighborhoodId: string) => Promise<void>;
  refreshAnalysis: (neighborhoodId: string) => Promise<void>;
  clearError: () => void;
}

// Error Types
export interface NeighborhoodError {
  code: string;
  message: string;
  details?: any;
}

export interface NeighborhoodApiError extends NeighborhoodError {
  status: number;
  timestamp: string;
}
