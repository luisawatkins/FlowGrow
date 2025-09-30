// Property Comparison Types
export interface PropertyComparison {
  id: string;
  name: string;
  properties: ComparisonProperty[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  isPublic: boolean;
  tags: string[];
  notes?: string;
}

export interface ComparisonProperty {
  id: string;
  propertyId: string;
  property: Property;
  metrics: PropertyMetrics;
  score: number;
  rank: number;
  notes?: string;
  addedAt: Date;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  location: PropertyLocation;
  details: PropertyDetails;
  images: string[];
  features: string[];
  amenities: string[];
  specifications: PropertySpecifications;
  financial: PropertyFinancial;
  metadata: PropertyMetadata;
}

export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  neighborhood: string;
  schoolDistrict?: string;
}

export interface PropertyDetails {
  type: PropertyType;
  status: PropertyStatus;
  yearBuilt?: number;
  lotSize: number;
  livingArea: number;
  bedrooms: number;
  bathrooms: number;
  garageSpaces?: number;
  stories?: number;
  condition: PropertyCondition;
  style?: string;
}

export interface PropertySpecifications {
  heating: string;
  cooling: string;
  flooring: string[];
  roof: string;
  exterior: string;
  foundation: string;
  utilities: string[];
  appliances: string[];
  security: string[];
  accessibility: string[];
}

export interface PropertyFinancial {
  price: number;
  pricePerSqFt: number;
  taxes: number;
  hoaFees?: number;
  insurance: number;
  utilities: number;
  maintenance: number;
  totalMonthlyCost: number;
  appreciation: number;
  rentalIncome?: number;
  capRate?: number;
  roi?: number;
}

export interface PropertyMetadata {
  listingDate: Date;
  lastUpdated: Date;
  views: number;
  favorites: number;
  shares: number;
  agent: {
    id: string;
    name: string;
    company: string;
    phone: string;
    email: string;
  };
  source: string;
  mlsId?: string;
}

export interface PropertyMetrics {
  // Price metrics
  priceScore: number;
  valueScore: number;
  affordabilityScore: number;
  
  // Location metrics
  locationScore: number;
  neighborhoodScore: number;
  accessibilityScore: number;
  
  // Property metrics
  sizeScore: number;
  conditionScore: number;
  featureScore: number;
  
  // Financial metrics
  investmentScore: number;
  cashFlowScore: number;
  appreciationScore: number;
  
  // Overall score
  overallScore: number;
  
  // Comparison metrics
  priceComparison: ComparisonMetric;
  sizeComparison: ComparisonMetric;
  locationComparison: ComparisonMetric;
  featureComparison: ComparisonMetric;
}

export interface ComparisonMetric {
  value: number;
  rank: number;
  percentile: number;
  isBest: boolean;
  isWorst: boolean;
  difference: number;
  percentageDifference: number;
}

export interface ComparisonSession {
  id: string;
  userId: string;
  properties: ComparisonProperty[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  maxProperties: number;
}

export interface ComparisonCriteria {
  id: string;
  name: string;
  weight: number;
  type: ComparisonCriteriaType;
  isEnabled: boolean;
  description?: string;
}

export interface ComparisonResult {
  winner: ComparisonProperty;
  loser: ComparisonProperty;
  score: number;
  criteria: string[];
  summary: string;
}

export interface ComparisonExport {
  format: ExportFormat;
  data: PropertyComparison;
  generatedAt: Date;
  generatedBy: string;
}

// Enums
export enum PropertyType {
  SINGLE_FAMILY = 'single_family',
  CONDO = 'condo',
  TOWNHOUSE = 'townhouse',
  MULTI_FAMILY = 'multi_family',
  COMMERCIAL = 'commercial',
  LAND = 'land',
  MOBILE = 'mobile',
  OTHER = 'other'
}

export enum PropertyStatus {
  FOR_SALE = 'for_sale',
  FOR_RENT = 'for_rent',
  SOLD = 'sold',
  RENTED = 'rented',
  PENDING = 'pending',
  OFF_MARKET = 'off_market'
}

export enum PropertyCondition {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NEEDS_WORK = 'needs_work'
}

export enum ComparisonCriteriaType {
  PRICE = 'price',
  SIZE = 'size',
  LOCATION = 'location',
  FEATURES = 'features',
  FINANCIAL = 'financial',
  CONDITION = 'condition',
  AMENITIES = 'amenities',
  CUSTOM = 'custom'
}

export enum ExportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json'
}

// API Types
export interface CreateComparisonRequest {
  name: string;
  propertyIds: string[];
  isPublic?: boolean;
  tags?: string[];
  notes?: string;
}

export interface UpdateComparisonRequest {
  name?: string;
  propertyIds?: string[];
  isPublic?: boolean;
  tags?: string[];
  notes?: string;
}

export interface AddPropertyToComparisonRequest {
  propertyId: string;
  notes?: string;
}

export interface RemovePropertyFromComparisonRequest {
  propertyId: string;
}

export interface ComparisonListResponse {
  comparisons: PropertyComparison[];
  total: number;
  page: number;
  limit: number;
}

export interface ComparisonResponse {
  comparison: PropertyComparison;
  success: boolean;
  message?: string;
}

// Error Types
export interface ComparisonError {
  code: string;
  message: string;
  details?: any;
}

export interface ComparisonValidationError {
  field: string;
  message: string;
  value?: any;
}

// Hook Types
export interface UseComparisonOptions {
  autoSave?: boolean;
  maxProperties?: number;
  enableSharing?: boolean;
  enableExport?: boolean;
}

export interface UseComparisonReturn {
  comparison: PropertyComparison | null;
  comparisons: PropertyComparison[];
  isLoading: boolean;
  error: ComparisonError | null;
  addProperty: (propertyId: string, notes?: string) => Promise<void>;
  removeProperty: (propertyId: string) => Promise<void>;
  updateComparison: (updates: UpdateComparisonRequest) => Promise<void>;
  deleteComparison: (id: string) => Promise<void>;
  createComparison: (data: CreateComparisonRequest) => Promise<void>;
  loadComparison: (id: string) => Promise<void>;
  loadComparisons: () => Promise<void>;
  exportComparison: (format: ExportFormat) => Promise<void>;
  shareComparison: (comparisonId: string) => Promise<string>;
  clearError: () => void;
}
