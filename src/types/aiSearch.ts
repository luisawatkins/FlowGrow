// AI Search Types
// Type definitions for AI-powered property search functionality

export interface AISearchQuery {
  id: string;
  query: string;
  type: AISearchType;
  filters: AISearchFilters;
  context: AISearchContext;
  userId?: string;
  sessionId?: string;
  timestamp: string;
  results?: AISearchResult[];
  suggestions?: AISearchSuggestion[];
  confidence: number;
  processingTime: number;
  metadata: AISearchMetadata;
}

export interface AISearchFilters {
  priceRange?: PriceRange;
  location?: LocationFilter;
  propertyType?: PropertyType[];
  bedrooms?: NumberRange;
  bathrooms?: NumberRange;
  squareFootage?: NumberRange;
  lotSize?: NumberRange;
  yearBuilt?: NumberRange;
  features?: string[];
  amenities?: string[];
  keywords?: string[];
  dateRange?: DateRange;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  limit?: number;
  offset?: number;
}

export interface AISearchContext {
  userPreferences?: UserPreferences;
  searchHistory?: string[];
  locationContext?: LocationContext;
  timeContext?: TimeContext;
  deviceContext?: DeviceContext;
  sessionContext?: SessionContext;
}

export interface AISearchResult {
  id: string;
  propertyId: string;
  score: number;
  relevance: number;
  confidence: number;
  matchReasons: string[];
  highlights: AISearchHighlight[];
  metadata: AISearchResultMetadata;
}

export interface AISearchHighlight {
  field: string;
  value: string;
  snippet: string;
  score: number;
  type: HighlightType;
}

export interface AISearchSuggestion {
  id: string;
  text: string;
  type: SuggestionType;
  confidence: number;
  category: string;
  metadata: SuggestionMetadata;
}

export interface AISearchMetadata {
  queryId: string;
  userId?: string;
  sessionId?: string;
  timestamp: string;
  processingTime: number;
  resultCount: number;
  confidence: number;
  source: string;
  version: string;
  features: string[];
  model: string;
  parameters: Record<string, any>;
}

export interface AISearchResultMetadata {
  propertyId: string;
  score: number;
  relevance: number;
  confidence: number;
  matchReasons: string[];
  highlights: AISearchHighlight[];
  source: string;
  timestamp: string;
}

export interface UserPreferences {
  preferredLocations?: string[];
  preferredPropertyTypes?: PropertyType[];
  priceRange?: PriceRange;
  bedroomRange?: NumberRange;
  bathroomRange?: NumberRange;
  squareFootageRange?: NumberRange;
  preferredFeatures?: string[];
  preferredAmenities?: string[];
  searchHistory?: string[];
  savedSearches?: string[];
  favoriteProperties?: string[];
  excludedProperties?: string[];
  notificationPreferences?: NotificationPreferences;
}

export interface LocationContext {
  currentLocation?: GeoLocation;
  searchRadius?: number;
  preferredNeighborhoods?: string[];
  excludedAreas?: string[];
  commutePreferences?: CommutePreferences;
  schoolPreferences?: SchoolPreferences;
  amenityPreferences?: AmenityPreferences;
}

export interface TimeContext {
  searchTime: string;
  timeOfDay: string;
  dayOfWeek: string;
  season: string;
  marketConditions?: MarketConditions;
  urgency?: UrgencyLevel;
}

export interface DeviceContext {
  deviceType: DeviceType;
  screenSize: ScreenSize;
  operatingSystem: string;
  browser: string;
  connectionType: ConnectionType;
  locationEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface SessionContext {
  sessionId: string;
  startTime: string;
  duration: number;
  pageViews: number;
  interactions: number;
  previousSearches: string[];
  currentPage: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
  timestamp: string;
}

export interface CommutePreferences {
  workLocation?: GeoLocation;
  maxCommuteTime?: number;
  preferredTransportation?: TransportationType[];
  avoidHighways?: boolean;
  avoidTolls?: boolean;
  avoidFerries?: boolean;
}

export interface SchoolPreferences {
  schoolDistricts?: string[];
  schoolTypes?: SchoolType[];
  schoolRatings?: SchoolRating[];
  maxDistanceToSchool?: number;
  preferredSchools?: string[];
}

export interface AmenityPreferences {
  requiredAmenities?: string[];
  preferredAmenities?: string[];
  maxDistanceToAmenities?: number;
  amenityTypes?: AmenityType[];
}

export interface MarketConditions {
  marketType: MarketType;
  priceTrend: PriceTrend;
  inventoryLevel: InventoryLevel;
  competitionLevel: CompetitionLevel;
  seasonality: Seasonality;
  economicFactors: EconomicFactor[];
}

export interface EconomicFactor {
  factor: string;
  impact: ImpactLevel;
  description: string;
  source: string;
  timestamp: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  frequency: NotificationFrequency;
  quietHours: QuietHours;
  types: NotificationType[];
}

export interface QuietHours {
  enabled: boolean;
  startTime: string;
  endTime: string;
  timezone: string;
  days: string[];
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface NumberRange {
  min: number;
  max: number;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface LocationFilter {
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  coordinates?: GeoLocation;
  radius?: number;
  bounds?: GeoBounds;
  neighborhoods?: string[];
  schoolDistricts?: string[];
  zipCodes?: string[];
}

export interface GeoBounds {
  northeast: GeoLocation;
  southwest: GeoLocation;
}

export interface AISearchRequest {
  query: string;
  filters?: AISearchFilters;
  context?: AISearchContext;
  options?: AISearchOptions;
  userId?: string;
  sessionId?: string;
}

export interface AISearchOptions {
  maxResults?: number;
  includeMetadata?: boolean;
  includeHighlights?: boolean;
  includeSuggestions?: boolean;
  includeAnalytics?: boolean;
  language?: string;
  region?: string;
  timezone?: string;
  debug?: boolean;
  cache?: boolean;
  timeout?: number;
}

export interface AISearchResponse {
  success: boolean;
  data?: AISearchResult[];
  suggestions?: AISearchSuggestion[];
  metadata?: AISearchMetadata;
  error?: AISearchError;
  pagination?: Pagination;
}

export interface AISearchError {
  code: string;
  message: string;
  details?: any;
  status: number;
  timestamp: string;
}

export interface AISearchAnalytics {
  queryId: string;
  userId?: string;
  sessionId?: string;
  query: string;
  filters: AISearchFilters;
  context: AISearchContext;
  results: AISearchResult[];
  suggestions: AISearchSuggestion[];
  metadata: AISearchMetadata;
  performance: AISearchPerformance;
  userBehavior: AISearchUserBehavior;
  timestamp: string;
}

export interface AISearchPerformance {
  processingTime: number;
  resultCount: number;
  confidence: number;
  cacheHit: boolean;
  modelVersion: string;
  features: string[];
  parameters: Record<string, any>;
}

export interface AISearchUserBehavior {
  clickThroughRate: number;
  conversionRate: number;
  bounceRate: number;
  sessionDuration: number;
  pageViews: number;
  interactions: number;
  feedback: AISearchFeedback[];
}

export interface AISearchFeedback {
  type: FeedbackType;
  rating?: number;
  comment?: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

export interface AISearchOptimization {
  queryId: string;
  originalQuery: string;
  optimizedQuery: string;
  improvements: QueryImprovement[];
  confidence: number;
  timestamp: string;
}

export interface QueryImprovement {
  type: ImprovementType;
  description: string;
  impact: ImpactLevel;
  original: string;
  improved: string;
  confidence: number;
}

export interface AISearchCache {
  key: string;
  query: string;
  filters: AISearchFilters;
  context: AISearchContext;
  results: AISearchResult[];
  suggestions: AISearchSuggestion[];
  metadata: AISearchMetadata;
  timestamp: string;
  expiresAt: string;
  hits: number;
  lastAccessed: string;
}

export interface AISearchIndex {
  propertyId: string;
  content: string;
  fields: Record<string, any>;
  vectors: number[];
  metadata: Record<string, any>;
  timestamp: string;
  version: string;
}

export interface AISearchModel {
  id: string;
  name: string;
  version: string;
  type: ModelType;
  status: ModelStatus;
  accuracy: number;
  performance: ModelPerformance;
  features: string[];
  parameters: Record<string, any>;
  trainingData: TrainingData;
  validationData: ValidationData;
  createdAt: string;
  updatedAt: string;
}

export interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  processingTime: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface TrainingData {
  size: number;
  sources: string[];
  quality: DataQuality;
  diversity: number;
  balance: number;
  timestamp: string;
}

export interface ValidationData {
  size: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  timestamp: string;
}

export interface AISearchConfig {
  models: AISearchModel[];
  features: string[];
  parameters: Record<string, any>;
  cache: CacheConfig;
  performance: PerformanceConfig;
  monitoring: MonitoringConfig;
  security: SecurityConfig;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number;
  maxSize: number;
  strategy: CacheStrategy;
  compression: boolean;
  encryption: boolean;
}

export interface PerformanceConfig {
  timeout: number;
  maxConcurrent: number;
  retryAttempts: number;
  retryDelay: number;
  circuitBreaker: CircuitBreakerConfig;
  loadBalancing: LoadBalancingConfig;
}

export interface MonitoringConfig {
  enabled: boolean;
  metrics: string[];
  alerts: AlertConfig[];
  dashboards: DashboardConfig[];
  reports: ReportConfig[];
}

export interface SecurityConfig {
  authentication: AuthenticationConfig;
  authorization: AuthorizationConfig;
  encryption: EncryptionConfig;
  audit: AuditConfig;
  compliance: ComplianceConfig;
}

export interface CircuitBreakerConfig {
  enabled: boolean;
  failureThreshold: number;
  timeout: number;
  resetTimeout: number;
}

export interface LoadBalancingConfig {
  strategy: LoadBalancingStrategy;
  weights: Record<string, number>;
  healthChecks: HealthCheckConfig[];
}

export interface HealthCheckConfig {
  endpoint: string;
  interval: number;
  timeout: number;
  retries: number;
}

export interface AlertConfig {
  name: string;
  condition: string;
  threshold: number;
  action: AlertAction;
  enabled: boolean;
}

export interface DashboardConfig {
  name: string;
  widgets: WidgetConfig[];
  refreshInterval: number;
  permissions: string[];
}

export interface ReportConfig {
  name: string;
  schedule: string;
  format: ReportFormat;
  recipients: string[];
  template: string;
}

export interface AuthenticationConfig {
  enabled: boolean;
  methods: AuthMethod[];
  providers: AuthProvider[];
  sessionTimeout: number;
  refreshToken: boolean;
}

export interface AuthorizationConfig {
  enabled: boolean;
  roles: Role[];
  permissions: Permission[];
  policies: Policy[];
}

export interface EncryptionConfig {
  enabled: boolean;
  algorithm: EncryptionAlgorithm;
  keySize: number;
  keyRotation: number;
}

export interface AuditConfig {
  enabled: boolean;
  events: AuditEvent[];
  retention: number;
  storage: AuditStorage;
}

export interface ComplianceConfig {
  standards: ComplianceStandard[];
  requirements: ComplianceRequirement[];
  certifications: Certification[];
  audits: Audit[];
}

export interface WidgetConfig {
  type: WidgetType;
  title: string;
  data: WidgetData;
  options: WidgetOptions;
}

export interface AlertAction {
  type: ActionType;
  target: string;
  parameters: Record<string, any>;
}

export interface AuthMethod {
  type: AuthMethodType;
  enabled: boolean;
  configuration: Record<string, any>;
}

export interface AuthProvider {
  name: string;
  type: ProviderType;
  configuration: Record<string, any>;
  enabled: boolean;
}

export interface Role {
  name: string;
  permissions: string[];
  description: string;
}

export interface Permission {
  name: string;
  resource: string;
  actions: string[];
  conditions: string[];
}

export interface Policy {
  name: string;
  rules: PolicyRule[];
  priority: number;
}

export interface PolicyRule {
  condition: string;
  action: string;
  effect: RuleEffect;
}

export interface AuditEvent {
  name: string;
  description: string;
  level: AuditLevel;
  enabled: boolean;
}

export interface AuditStorage {
  type: StorageType;
  configuration: Record<string, any>;
  retention: number;
}

export interface ComplianceStandard {
  name: string;
  version: string;
  requirements: string[];
  certification: boolean;
}

export interface ComplianceRequirement {
  name: string;
  description: string;
  standard: string;
  mandatory: boolean;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  expiry: string;
  status: CertificationStatus;
}

export interface Audit {
  name: string;
  type: AuditType;
  date: string;
  results: AuditResult[];
  recommendations: string[];
}

export interface AuditResult {
  requirement: string;
  status: ComplianceStatus;
  evidence: string[];
  notes: string;
}

export interface WidgetData {
  source: string;
  query: string;
  filters: Record<string, any>;
  aggregation: AggregationConfig;
}

export interface WidgetOptions {
  chartType: ChartType;
  colors: string[];
  size: WidgetSize;
  refresh: number;
}

export interface AggregationConfig {
  field: string;
  function: AggregationFunction;
  groupBy: string[];
  orderBy: OrderBy[];
}

export interface OrderBy {
  field: string;
  direction: SortDirection;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Enums
export enum AISearchType {
  NATURAL_LANGUAGE = 'natural_language',
  SEMANTIC = 'semantic',
  KEYWORD = 'keyword',
  HYBRID = 'hybrid',
  VOICE = 'voice',
  IMAGE = 'image',
  LOCATION = 'location',
  FILTER = 'filter'
}

export enum PropertyType {
  SINGLE_FAMILY = 'single_family',
  CONDO = 'condo',
  TOWNHOUSE = 'townhouse',
  APARTMENT = 'apartment',
  DUPLEX = 'duplex',
  MULTI_FAMILY = 'multi_family',
  COMMERCIAL = 'commercial',
  LAND = 'land',
  MOBILE_HOME = 'mobile_home',
  OTHER = 'other'
}

export enum SortBy {
  RELEVANCE = 'relevance',
  PRICE = 'price',
  SIZE = 'size',
  DATE = 'date',
  DISTANCE = 'distance',
  RATING = 'rating',
  POPULARITY = 'popularity'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export enum HighlightType {
  EXACT = 'exact',
  FUZZY = 'fuzzy',
  SEMANTIC = 'semantic',
  CONTEXTUAL = 'contextual'
}

export enum SuggestionType {
  QUERY = 'query',
  FILTER = 'filter',
  LOCATION = 'location',
  PROPERTY = 'property',
  FEATURE = 'feature',
  AMENITY = 'amenity'
}

export enum TransportationType {
  DRIVING = 'driving',
  WALKING = 'walking',
  CYCLING = 'cycling',
  PUBLIC_TRANSPORT = 'public_transport',
  RIDESHARE = 'rideshare'
}

export enum SchoolType {
  ELEMENTARY = 'elementary',
  MIDDLE = 'middle',
  HIGH = 'high',
  PRIVATE = 'private',
  CHARTER = 'charter',
  MAGNET = 'magnet'
}

export enum SchoolRating {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  AVERAGE = 'average',
  BELOW_AVERAGE = 'below_average',
  POOR = 'poor'
}

export enum AmenityType {
  SHOPPING = 'shopping',
  DINING = 'dining',
  ENTERTAINMENT = 'entertainment',
  FITNESS = 'fitness',
  HEALTHCARE = 'healthcare',
  EDUCATION = 'education',
  TRANSPORTATION = 'transportation',
  RECREATION = 'recreation'
}

export enum MarketType {
  BUYER = 'buyer',
  SELLER = 'seller',
  RENTAL = 'rental',
  INVESTMENT = 'investment'
}

export enum PriceTrend {
  RISING = 'rising',
  FALLING = 'falling',
  STABLE = 'stable',
  VOLATILE = 'volatile'
}

export enum InventoryLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

export enum CompetitionLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

export enum Seasonality {
  SPRING = 'spring',
  SUMMER = 'summer',
  FALL = 'fall',
  WINTER = 'winter'
}

export enum ImpactLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum NotificationFrequency {
  IMMEDIATE = 'immediate',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  NEVER = 'never'
}

export enum NotificationType {
  PRICE_ALERT = 'price_alert',
  NEW_LISTING = 'new_listing',
  PRICE_CHANGE = 'price_change',
  MARKET_UPDATE = 'market_update',
  RECOMMENDATION = 'recommendation'
}

export enum DeviceType {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  TABLET = 'tablet',
  TV = 'tv',
  WEARABLE = 'wearable'
}

export enum ScreenSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  EXTRA_LARGE = 'extra_large'
}

export enum ConnectionType {
  WIFI = 'wifi',
  ETHERNET = 'ethernet',
  CELLULAR = 'cellular',
  SATELLITE = 'satellite',
  DIAL_UP = 'dial_up'
}

export enum UrgencyLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum FeedbackType {
  RATING = 'rating',
  COMMENT = 'comment',
  BUG_REPORT = 'bug_report',
  FEATURE_REQUEST = 'feature_request',
  GENERAL = 'general'
}

export enum ImprovementType {
  SPELLING = 'spelling',
  SYNTAX = 'syntax',
  SEMANTIC = 'semantic',
  CONTEXT = 'context',
  FILTER = 'filter',
  SORT = 'sort'
}

export enum ModelType {
  NLP = 'nlp',
  ML = 'ml',
  DL = 'dl',
  TRANSFORMER = 'transformer',
  EMBEDDING = 'embedding',
  CLASSIFICATION = 'classification',
  REGRESSION = 'regression',
  CLUSTERING = 'clustering'
}

export enum ModelStatus {
  TRAINING = 'training',
  VALIDATING = 'validating',
  DEPLOYED = 'deployed',
  DEPRECATED = 'deprecated',
  FAILED = 'failed'
}

export enum DataQuality {
  POOR = 'poor',
  FAIR = 'fair',
  GOOD = 'good',
  EXCELLENT = 'excellent'
}

export enum CacheStrategy {
  LRU = 'lru',
  LFU = 'lfu',
  FIFO = 'fifo',
  TTL = 'ttl',
  RANDOM = 'random'
}

export enum LoadBalancingStrategy {
  ROUND_ROBIN = 'round_robin',
  LEAST_CONNECTIONS = 'least_connections',
  WEIGHTED = 'weighted',
  RANDOM = 'random',
  IP_HASH = 'ip_hash'
}

export enum ReportFormat {
  PDF = 'pdf',
  HTML = 'html',
  CSV = 'csv',
  JSON = 'json',
  XML = 'xml'
}

export enum AuthMethodType {
  PASSWORD = 'password',
  TOKEN = 'token',
  OAUTH = 'oauth',
  SAML = 'saml',
  LDAP = 'ldap'
}

export enum ProviderType {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  GITHUB = 'github',
  MICROSOFT = 'microsoft',
  APPLE = 'apple'
}

export enum RuleEffect {
  ALLOW = 'allow',
  DENY = 'deny',
  CONDITIONAL = 'conditional'
}

export enum AuditLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

export enum StorageType {
  DATABASE = 'database',
  FILE = 'file',
  CLOUD = 'cloud',
  MEMORY = 'memory'
}

export enum CertificationStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
  PENDING = 'pending'
}

export enum AuditType {
  COMPLIANCE = 'compliance',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  QUALITY = 'quality',
  FINANCIAL = 'financial'
}

export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  PARTIAL = 'partial',
  NOT_APPLICABLE = 'not_applicable'
}

export enum WidgetType {
  CHART = 'chart',
  TABLE = 'table',
  METRIC = 'metric',
  MAP = 'map',
  LIST = 'list',
  GRAPH = 'graph'
}

export enum ActionType {
  EMAIL = 'email',
  SMS = 'sms',
  WEBHOOK = 'webhook',
  SLACK = 'slack',
  TEAMS = 'teams',
  CUSTOM = 'custom'
}

export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  SCATTER = 'scatter',
  AREA = 'area',
  HISTOGRAM = 'histogram',
  HEATMAP = 'heatmap'
}

export enum WidgetSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  FULL = 'full'
}

export enum AggregationFunction {
  COUNT = 'count',
  SUM = 'sum',
  AVG = 'avg',
  MIN = 'min',
  MAX = 'max',
  MEDIAN = 'median',
  MODE = 'mode',
  STDDEV = 'stddev'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

// Hook interfaces
export interface UseAISearchReturn {
  search: (query: string, filters?: AISearchFilters, context?: AISearchContext) => Promise<AISearchResponse>;
  suggestions: AISearchSuggestion[];
  results: AISearchResult[];
  loading: boolean;
  error: AISearchError | null;
  metadata: AISearchMetadata | null;
  clearResults: () => void;
  clearError: () => void;
  refresh: () => Promise<void>;
}

export interface UseAISearchOptimizationReturn {
  optimize: (query: string) => Promise<AISearchOptimization>;
  optimization: AISearchOptimization | null;
  loading: boolean;
  error: AISearchError | null;
  clearOptimization: () => void;
  clearError: () => void;
}

export interface UseAISearchAnalyticsReturn {
  analytics: AISearchAnalytics[];
  loading: boolean;
  error: AISearchError | null;
  refresh: () => Promise<void>;
  clearError: () => void;
}

export interface UseAISearchCacheReturn {
  cache: AISearchCache[];
  loading: boolean;
  error: AISearchError | null;
  clearCache: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

export interface UseAISearchModelReturn {
  models: AISearchModel[];
  activeModel: AISearchModel | null;
  loading: boolean;
  error: AISearchError | null;
  switchModel: (modelId: string) => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

export interface UseAISearchConfigReturn {
  config: AISearchConfig;
  loading: boolean;
  error: AISearchError | null;
  updateConfig: (config: Partial<AISearchConfig>) => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}
