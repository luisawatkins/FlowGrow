// Property Market Analysis Types

export interface MarketData {
  id: string;
  propertyId?: string;
  location: string;
  region: string;
  state: string;
  zipCode: string;
  marketType: MarketType;
  dataType: MarketDataType;
  value: number;
  unit: string;
  date: Date;
  source: string;
  confidence: number;
  metadata?: MarketDataMetadata;
}

export interface MarketDataMetadata {
  sampleSize?: number;
  methodology?: string;
  lastUpdated?: Date;
  dataQuality?: DataQuality;
  notes?: string;
}

export interface MarketTrend {
  id: string;
  location: string;
  propertyType: PropertyType;
  trendType: TrendType;
  period: TimePeriod;
  startDate: Date;
  endDate: Date;
  currentValue: number;
  previousValue: number;
  changePercent: number;
  changeAmount: number;
  direction: TrendDirection;
  confidence: number;
  dataPoints: MarketDataPoint[];
  forecast?: MarketForecast;
}

export interface MarketDataPoint {
  date: Date;
  value: number;
  source: string;
  confidence: number;
}

export interface MarketForecast {
  id: string;
  trendId: string;
  forecastType: ForecastType;
  period: TimePeriod;
  predictedValue: number;
  confidence: number;
  upperBound: number;
  lowerBound: number;
  methodology: string;
  assumptions: string[];
  lastUpdated: Date;
}

export interface MarketInsight {
  id: string;
  location: string;
  propertyType: PropertyType;
  insightType: InsightType;
  title: string;
  description: string;
  impact: ImpactLevel;
  confidence: number;
  source: string;
  date: Date;
  tags: string[];
  relatedTrends: string[];
  recommendations?: string[];
}

export interface MarketComparison {
  id: string;
  location: string;
  propertyType: PropertyType;
  comparisonType: ComparisonType;
  benchmark: string;
  currentValue: number;
  benchmarkValue: number;
  difference: number;
  differencePercent: number;
  rank: number;
  totalProperties: number;
  percentile: number;
  date: Date;
}

export interface InvestmentOpportunity {
  id: string;
  propertyId: string;
  location: string;
  opportunityType: OpportunityType;
  title: string;
  description: string;
  potentialReturn: number;
  riskLevel: RiskLevel;
  timeHorizon: TimeHorizon;
  confidence: number;
  factors: OpportunityFactor[];
  recommendations: string[];
  date: Date;
}

export interface OpportunityFactor {
  factor: string;
  impact: ImpactLevel;
  description: string;
  weight: number;
}

export interface MarketReport {
  id: string;
  location: string;
  propertyType: PropertyType;
  reportType: ReportType;
  title: string;
  summary: string;
  sections: ReportSection[];
  insights: MarketInsight[];
  trends: MarketTrend[];
  comparisons: MarketComparison[];
  opportunities: InvestmentOpportunity[];
  generatedAt: Date;
  validUntil: Date;
  confidence: number;
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  charts: ChartData[];
  tables: TableData[];
  order: number;
}

export interface ChartData {
  id: string;
  type: ChartType;
  title: string;
  data: any[];
  options: any;
  description?: string;
}

export interface TableData {
  id: string;
  title: string;
  headers: string[];
  rows: any[][];
  description?: string;
}

export enum MarketType {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  INDUSTRIAL = 'industrial',
  LAND = 'land',
  MIXED_USE = 'mixed_use'
}

export enum MarketDataType {
  MEDIAN_PRICE = 'median_price',
  AVERAGE_PRICE = 'average_price',
  PRICE_PER_SQFT = 'price_per_sqft',
  SALES_VOLUME = 'sales_volume',
  DAYS_ON_MARKET = 'days_on_market',
  INVENTORY_LEVEL = 'inventory_level',
  APPRECIATION_RATE = 'appreciation_rate',
  RENTAL_YIELD = 'rental_yield',
  CAP_RATE = 'cap_rate'
}

export enum PropertyType {
  SINGLE_FAMILY = 'single_family',
  CONDO = 'condo',
  TOWNHOUSE = 'townhouse',
  MULTI_FAMILY = 'multi_family',
  APARTMENT = 'apartment',
  OFFICE = 'office',
  RETAIL = 'retail',
  WAREHOUSE = 'warehouse',
  HOTEL = 'hotel',
  LAND = 'land'
}

export enum TrendType {
  PRICE_TREND = 'price_trend',
  VOLUME_TREND = 'volume_trend',
  INVENTORY_TREND = 'inventory_trend',
  APPRECIATION_TREND = 'appreciation_trend',
  RENTAL_TREND = 'rental_trend',
  MARKET_ACTIVITY = 'market_activity'
}

export enum TimePeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  CUSTOM = 'custom'
}

export enum TrendDirection {
  RISING = 'rising',
  FALLING = 'falling',
  STABLE = 'stable',
  VOLATILE = 'volatile'
}

export enum ForecastType {
  SHORT_TERM = 'short_term',
  MEDIUM_TERM = 'medium_term',
  LONG_TERM = 'long_term',
  SEASONAL = 'seasonal'
}

export enum InsightType {
  MARKET_HOT = 'market_hot',
  MARKET_COOL = 'market_cool',
  PRICE_OPPORTUNITY = 'price_opportunity',
  INVESTMENT_OPPORTUNITY = 'investment_opportunity',
  RISK_WARNING = 'risk_warning',
  TREND_CHANGE = 'trend_change',
  SEASONAL_PATTERN = 'seasonal_pattern',
  COMPETITIVE_ANALYSIS = 'competitive_analysis'
}

export enum ImpactLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ComparisonType {
  NEIGHBORHOOD = 'neighborhood',
  CITY = 'city',
  STATE = 'state',
  NATIONAL = 'national',
  SIMILAR_PROPERTIES = 'similar_properties',
  HISTORICAL = 'historical'
}

export enum OpportunityType {
  UNDERVALUED = 'undervalued',
  GROWTH_POTENTIAL = 'growth_potential',
  RENTAL_INCOME = 'rental_income',
  DEVELOPMENT = 'development',
  FLIP_OPPORTUNITY = 'flip_opportunity',
  DISTRESSED_SALE = 'distressed_sale'
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

export enum TimeHorizon {
  SHORT_TERM = 'short_term', // < 1 year
  MEDIUM_TERM = 'medium_term', // 1-5 years
  LONG_TERM = 'long_term' // > 5 years
}

export enum ReportType {
  MARKET_OVERVIEW = 'market_overview',
  INVESTMENT_ANALYSIS = 'investment_analysis',
  PRICE_ANALYSIS = 'price_analysis',
  TREND_ANALYSIS = 'trend_analysis',
  COMPARATIVE_ANALYSIS = 'comparative_analysis',
  FORECAST_REPORT = 'forecast_report'
}

export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  SCATTER = 'scatter',
  AREA = 'area',
  HEATMAP = 'heatmap',
  GAUGE = 'gauge'
}

export enum DataQuality {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor'
}

// API Request/Response Types
export interface MarketAnalysisRequest {
  location: string;
  propertyType?: PropertyType;
  marketType?: MarketType;
  timeRange?: {
    start: Date;
    end: Date;
  };
  includeForecast?: boolean;
  includeInsights?: boolean;
  includeComparisons?: boolean;
}

export interface MarketAnalysisResponse {
  trends: MarketTrend[];
  insights: MarketInsight[];
  comparisons: MarketComparison[];
  opportunities: InvestmentOpportunity[];
  report: MarketReport;
}

export interface MarketDataRequest {
  location: string;
  dataType: MarketDataType;
  timeRange?: {
    start: Date;
    end: Date;
  };
  propertyType?: PropertyType;
}

export interface MarketDataResponse {
  data: MarketData[];
  trend: MarketTrend;
  summary: {
    currentValue: number;
    changePercent: number;
    direction: TrendDirection;
    confidence: number;
  };
}

// Hook Return Types
export interface UseMarketAnalysisReturn {
  analysis: MarketAnalysisResponse | null;
  loading: boolean;
  error: MarketError | null;
  refreshAnalysis: () => Promise<void>;
}

export interface UseMarketDataReturn {
  data: MarketData[];
  trend: MarketTrend | null;
  loading: boolean;
  error: MarketError | null;
  refreshData: () => Promise<void>;
}

export interface UseMarketInsightsReturn {
  insights: MarketInsight[];
  loading: boolean;
  error: MarketError | null;
  refreshInsights: () => Promise<void>;
}

export interface UseMarketOpportunitiesReturn {
  opportunities: InvestmentOpportunity[];
  loading: boolean;
  error: MarketError | null;
  refreshOpportunities: () => Promise<void>;
}

export interface UseMarketReportReturn {
  report: MarketReport | null;
  loading: boolean;
  error: MarketError | null;
  generateReport: (request: MarketAnalysisRequest) => Promise<MarketReport>;
  refreshReport: () => Promise<void>;
}

// Error Types
export interface MarketError {
  code: string;
  message: string;
  details?: any;
}

// Filter Types
export interface MarketDataFilter {
  location?: string;
  propertyType?: PropertyType;
  marketType?: MarketType;
  dataType?: MarketDataType;
  dateFrom?: Date;
  dateTo?: Date;
  source?: string;
  minConfidence?: number;
}

export interface MarketInsightFilter {
  location?: string;
  propertyType?: PropertyType;
  insightType?: InsightType;
  impact?: ImpactLevel;
  minConfidence?: number;
  dateFrom?: Date;
  dateTo?: Date;
  tags?: string[];
}

export interface MarketOpportunityFilter {
  location?: string;
  propertyType?: PropertyType;
  opportunityType?: OpportunityType;
  riskLevel?: RiskLevel;
  timeHorizon?: TimeHorizon;
  minPotentialReturn?: number;
  maxRiskLevel?: RiskLevel;
}
