// Investment Analytics Types
// Comprehensive type definitions for property investment analytics

export interface InvestmentProperty {
  id: string;
  propertyId: string;
  investorId: string;
  purchaseDate: string;
  purchasePrice: number;
  downPayment: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  monthlyPayment: number;
  propertyTax: number;
  insurance: number;
  hoaFees: number;
  maintenance: number;
  management: number;
  vacancyRate: number;
  appreciationRate: number;
  depreciationRate: number;
  status: InvestmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentMetrics {
  id: string;
  propertyId: string;
  period: string; // YYYY-MM format
  grossRent: number;
  operatingExpenses: number;
  netOperatingIncome: number;
  cashFlow: number;
  capRate: number;
  roi: number;
  irr: number;
  cashOnCashReturn: number;
  totalReturn: number;
  appreciation: number;
  depreciation: number;
  taxBenefits: number;
  vacancyLoss: number;
  maintenanceCosts: number;
  managementFees: number;
  insuranceCosts: number;
  propertyTaxes: number;
  utilities: number;
  otherExpenses: number;
  createdAt: string;
}

export interface PortfolioAnalytics {
  id: string;
  investorId: string;
  totalProperties: number;
  totalValue: number;
  totalDebt: number;
  totalEquity: number;
  totalMonthlyRent: number;
  totalMonthlyExpenses: number;
  totalMonthlyCashFlow: number;
  averageCapRate: number;
  averageROI: number;
  averageIRR: number;
  portfolioDiversification: DiversificationMetrics;
  riskMetrics: RiskMetrics;
  performanceMetrics: PerformanceMetrics;
  cashFlowAnalysis: CashFlowAnalysis;
  marketAnalysis: MarketAnalysis;
  recommendations: InvestmentRecommendation[];
  lastUpdated: string;
}

export interface DiversificationMetrics {
  geographicDistribution: GeographicDistribution[];
  propertyTypeDistribution: PropertyTypeDistribution[];
  priceRangeDistribution: PriceRangeDistribution[];
  ageDistribution: AgeDistribution[];
  riskDistribution: RiskDistribution[];
}

export interface GeographicDistribution {
  location: string;
  count: number;
  percentage: number;
  totalValue: number;
  averageValue: number;
}

export interface PropertyTypeDistribution {
  type: PropertyType;
  count: number;
  percentage: number;
  totalValue: number;
  averageValue: number;
  averageROI: number;
}

export interface PriceRangeDistribution {
  range: string;
  count: number;
  percentage: number;
  totalValue: number;
  averageValue: number;
}

export interface AgeDistribution {
  ageRange: string;
  count: number;
  percentage: number;
  totalValue: number;
  averageValue: number;
}

export interface RiskDistribution {
  riskLevel: RiskLevel;
  count: number;
  percentage: number;
  totalValue: number;
  averageValue: number;
}

export interface RiskMetrics {
  portfolioBeta: number;
  valueAtRisk: number;
  maximumDrawdown: number;
  sharpeRatio: number;
  sortinoRatio: number;
  volatility: number;
  correlationMatrix: CorrelationMatrix;
  stressTestResults: StressTestResult[];
}

export interface CorrelationMatrix {
  properties: string[];
  correlations: number[][];
}

export interface StressTestResult {
  scenario: string;
  impact: number;
  probability: number;
  description: string;
}

export interface PerformanceMetrics {
  totalReturn: number;
  annualizedReturn: number;
  cumulativeReturn: number;
  benchmarkComparison: BenchmarkComparison;
  performanceAttribution: PerformanceAttribution;
  riskAdjustedReturns: RiskAdjustedReturns;
}

export interface BenchmarkComparison {
  benchmark: string;
  portfolioReturn: number;
  benchmarkReturn: number;
  excessReturn: number;
  trackingError: number;
  informationRatio: number;
}

export interface PerformanceAttribution {
  assetAllocation: number;
  securitySelection: number;
  interaction: number;
  total: number;
}

export interface RiskAdjustedReturns {
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  treynorRatio: number;
  jensenAlpha: number;
}

export interface CashFlowAnalysis {
  monthlyCashFlow: MonthlyCashFlow[];
  annualCashFlow: AnnualCashFlow[];
  cashFlowProjection: CashFlowProjection;
  breakEvenAnalysis: BreakEvenAnalysis;
  sensitivityAnalysis: SensitivityAnalysis;
}

export interface MonthlyCashFlow {
  month: string;
  grossRent: number;
  operatingExpenses: number;
  netOperatingIncome: number;
  debtService: number;
  cashFlow: number;
  cumulativeCashFlow: number;
}

export interface AnnualCashFlow {
  year: number;
  grossRent: number;
  operatingExpenses: number;
  netOperatingIncome: number;
  debtService: number;
  cashFlow: number;
  appreciation: number;
  totalReturn: number;
}

export interface CashFlowProjection {
  projectionPeriod: number; // in years
  assumptions: ProjectionAssumptions;
  scenarios: ProjectionScenario[];
  confidenceIntervals: ConfidenceInterval[];
}

export interface ProjectionAssumptions {
  rentGrowthRate: number;
  expenseGrowthRate: number;
  appreciationRate: number;
  inflationRate: number;
  vacancyRate: number;
  managementFeeRate: number;
}

export interface ProjectionScenario {
  name: string;
  probability: number;
  cashFlows: number[];
  totalReturn: number;
  irr: number;
}

export interface ConfidenceInterval {
  confidence: number; // percentage
  lowerBound: number;
  upperBound: number;
}

export interface BreakEvenAnalysis {
  breakEvenRent: number;
  breakEvenOccupancy: number;
  breakEvenExpenses: number;
  marginOfSafety: number;
  sensitivityFactors: SensitivityFactor[];
}

export interface SensitivityAnalysis {
  variables: SensitivityVariable[];
  tornadoChart: TornadoChartData[];
  scenarioAnalysis: ScenarioAnalysis[];
}

export interface SensitivityFactor {
  variable: string;
  impact: number;
  description: string;
}

export interface SensitivityVariable {
  name: string;
  baseValue: number;
  optimisticValue: number;
  pessimisticValue: number;
  impact: number;
}

export interface TornadoChartData {
  variable: string;
  positiveImpact: number;
  negativeImpact: number;
}

export interface ScenarioAnalysis {
  name: string;
  probability: number;
  variables: Record<string, number>;
  outcome: number;
  description: string;
}

export interface MarketAnalysis {
  marketTrends: MarketTrend[];
  comparableProperties: ComparableProperty[];
  marketMetrics: MarketMetrics;
  investmentOpportunities: InvestmentOpportunity[];
  marketForecast: MarketForecast;
}

export interface MarketTrend {
  metric: string;
  currentValue: number;
  previousValue: number;
  change: number;
  changePercentage: number;
  trend: TrendDirection;
  period: string;
}

export interface ComparableProperty {
  id: string;
  address: string;
  price: number;
  pricePerSqFt: number;
  capRate: number;
  roi: number;
  distance: number;
  similarity: number;
  lastSold: string;
}

export interface MarketMetrics {
  averagePrice: number;
  averagePricePerSqFt: number;
  averageCapRate: number;
  averageROI: number;
  medianDaysOnMarket: number;
  inventoryLevel: number;
  absorptionRate: number;
  priceToRentRatio: number;
}

export interface InvestmentOpportunity {
  id: string;
  propertyId: string;
  opportunityType: OpportunityType;
  description: string;
  potentialReturn: number;
  riskLevel: RiskLevel;
  timeHorizon: number;
  capitalRequired: number;
  probability: number;
  recommendation: string;
}

export interface MarketForecast {
  forecastPeriod: number; // in months
  priceForecast: PriceForecast[];
  rentForecast: RentForecast[];
  marketConditions: MarketCondition[];
  keyDrivers: KeyDriver[];
}

export interface PriceForecast {
  period: string;
  predictedPrice: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  factors: string[];
}

export interface RentForecast {
  period: string;
  predictedRent: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  factors: string[];
}

export interface MarketCondition {
  period: string;
  condition: MarketConditionType;
  description: string;
  impact: number;
}

export interface KeyDriver {
  factor: string;
  impact: number;
  description: string;
  trend: TrendDirection;
}

export interface InvestmentRecommendation {
  id: string;
  type: RecommendationType;
  priority: Priority;
  title: string;
  description: string;
  action: string;
  expectedImpact: number;
  timeHorizon: number;
  riskLevel: RiskLevel;
  capitalRequired?: number;
  rationale: string;
  alternatives: string[];
}

export interface InvestmentReport {
  id: string;
  investorId: string;
  reportType: ReportType;
  period: {
    start: string;
    end: string;
  };
  executiveSummary: ExecutiveSummary;
  portfolioOverview: PortfolioOverview;
  performanceAnalysis: PerformanceAnalysis;
  riskAnalysis: RiskAnalysis;
  marketAnalysis: MarketAnalysis;
  recommendations: InvestmentRecommendation[];
  appendices: ReportAppendix[];
  generatedAt: string;
}

export interface ExecutiveSummary {
  keyMetrics: KeyMetric[];
  highlights: string[];
  concerns: string[];
  overallRating: number;
  summary: string;
}

export interface KeyMetric {
  name: string;
  value: number;
  unit: string;
  change: number;
  changePercentage: number;
  benchmark?: number;
  status: MetricStatus;
}

export interface PortfolioOverview {
  totalProperties: number;
  totalValue: number;
  totalDebt: number;
  totalEquity: number;
  leverage: number;
  diversification: DiversificationMetrics;
  allocation: AllocationBreakdown;
}

export interface AllocationBreakdown {
  byPropertyType: Record<string, number>;
  byLocation: Record<string, number>;
  byPriceRange: Record<string, number>;
  byRiskLevel: Record<string, number>;
}

export interface PerformanceAnalysis {
  returns: ReturnMetrics;
  benchmarks: BenchmarkComparison[];
  attribution: PerformanceAttribution;
  trends: PerformanceTrend[];
}

export interface ReturnMetrics {
  totalReturn: number;
  annualizedReturn: number;
  riskFreeReturn: number;
  excessReturn: number;
  volatility: number;
  sharpeRatio: number;
}

export interface PerformanceTrend {
  period: string;
  return: number;
  benchmark: number;
  excess: number;
}

export interface RiskAnalysis {
  riskMetrics: RiskMetrics;
  stressTests: StressTestResult[];
  scenarioAnalysis: ScenarioAnalysis[];
  riskFactors: RiskFactor[];
}

export interface RiskFactor {
  factor: string;
  impact: number;
  probability: number;
  mitigation: string;
  monitoring: string;
}

export interface ReportAppendix {
  title: string;
  content: string;
  charts: ChartData[];
  tables: TableData[];
}

export interface ChartData {
  type: ChartType;
  title: string;
  data: any;
  options: any;
}

export interface TableData {
  title: string;
  headers: string[];
  rows: any[][];
}

// Enums
export enum InvestmentStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  SOLD = 'sold',
  FORECLOSED = 'foreclosed',
  UNDER_RENOVATION = 'under_renovation',
  VACANT = 'vacant'
}

export enum PropertyType {
  SINGLE_FAMILY = 'single_family',
  MULTI_FAMILY = 'multi_family',
  CONDO = 'condo',
  TOWNHOUSE = 'townhouse',
  COMMERCIAL = 'commercial',
  INDUSTRIAL = 'industrial',
  RETAIL = 'retail',
  OFFICE = 'office',
  MIXED_USE = 'mixed_use',
  LAND = 'land'
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

export enum TrendDirection {
  UP = 'up',
  DOWN = 'down',
  STABLE = 'stable',
  VOLATILE = 'volatile'
}

export enum OpportunityType {
  VALUE_ADD = 'value_add',
  CASH_FLOW = 'cash_flow',
  APPRECIATION = 'appreciation',
  DEVELOPMENT = 'development',
  REHABILITATION = 'rehabilitation',
  REFINANCING = 'refinancing',
  DISPOSITION = 'disposition'
}

export enum MarketConditionType {
  BUYERS_MARKET = 'buyers_market',
  SELLERS_MARKET = 'sellers_market',
  BALANCED_MARKET = 'balanced_market',
  OVERHEATED = 'overheated',
  DEPRESSED = 'depressed'
}

export enum RecommendationType {
  BUY = 'buy',
  SELL = 'sell',
  HOLD = 'hold',
  REFINANCE = 'refinance',
  RENOVATE = 'renovate',
  DIVERSIFY = 'diversify',
  REBALANCE = 'rebalance'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ReportType {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual',
  AD_HOC = 'ad_hoc',
  PERFORMANCE = 'performance',
  RISK = 'risk',
  MARKET = 'market'
}

export enum MetricStatus {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  AVERAGE = 'average',
  POOR = 'poor',
  CRITICAL = 'critical'
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

// API Types
export interface InvestmentAnalyticsRequest {
  investorId: string;
  propertyIds?: string[];
  period?: {
    start: string;
    end: string;
  };
  metrics?: string[];
  includeProjections?: boolean;
  includeBenchmarks?: boolean;
}

export interface InvestmentAnalyticsResponse {
  portfolio: PortfolioAnalytics;
  properties: InvestmentProperty[];
  metrics: InvestmentMetrics[];
  report: InvestmentReport;
}

export interface PerformanceComparisonRequest {
  investorId: string;
  benchmarkIds: string[];
  period: {
    start: string;
    end: string;
  };
  metrics: string[];
}

export interface RiskAnalysisRequest {
  investorId: string;
  confidenceLevel: number;
  timeHorizon: number;
  scenarios: string[];
}

// Hook Types
export interface UseInvestmentAnalyticsReturn {
  analytics: PortfolioAnalytics | null;
  loading: boolean;
  error: string | null;
  getAnalytics: (request: InvestmentAnalyticsRequest) => Promise<void>;
  getPerformanceComparison: (request: PerformanceComparisonRequest) => Promise<void>;
  getRiskAnalysis: (request: RiskAnalysisRequest) => Promise<void>;
  generateReport: (reportType: ReportType) => Promise<InvestmentReport>;
  clearError: () => void;
}

export interface UseInvestmentPropertiesReturn {
  properties: InvestmentProperty[];
  loading: boolean;
  error: string | null;
  getProperties: (investorId: string) => Promise<void>;
  addProperty: (property: Omit<InvestmentProperty, 'id' | 'createdAt' | 'updatedAt'>) => Promise<InvestmentProperty>;
  updateProperty: (id: string, updates: Partial<InvestmentProperty>) => Promise<InvestmentProperty>;
  deleteProperty: (id: string) => Promise<void>;
  clearError: () => void;
}

// Error Types
export interface InvestmentError {
  code: string;
  message: string;
  details?: any;
}

export interface InvestmentApiError extends InvestmentError {
  status: number;
  timestamp: string;
}
