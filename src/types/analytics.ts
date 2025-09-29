// Advanced Property Analytics and Market Intelligence Types

export interface MarketData {
  propertyID: number;
  timestamp: number;
  price: number;
  volume: number;
  marketCap: number;
  priceChange24h: number;
  priceChange7d: number;
  priceChange30d: number;
  volatility: number;
  liquidity: number;
  tradingVolume: number;
  marketTrend: 'bullish' | 'bearish' | 'neutral';
}

export interface PropertyInsight {
  propertyID: number;
  insightType: 'price_prediction' | 'market_trend' | 'investment_opportunity' | 'risk_assessment';
  confidence: number; // 0-100
  value: number;
  description: string;
  factors: string[];
  timestamp: number;
  expiryDate: number;
}

export interface MarketIntelligence {
  marketID: string;
  region: string;
  propertyType: string;
  averagePrice: number;
  priceTrend: 'increasing' | 'decreasing' | 'stable';
  marketActivity: 'high' | 'medium' | 'low';
  demandLevel: 'high' | 'medium' | 'low';
  supplyLevel: 'high' | 'medium' | 'low';
  marketScore: number; // 0-100
  recommendations: string[];
  lastUpdated: number;
}

export interface PredictiveModel {
  modelID: string;
  name: string;
  type: 'price_prediction' | 'market_forecast' | 'risk_assessment' | 'demand_forecast';
  accuracy: number;
  lastTrained: number;
  features: string[];
  parameters: Record<string, any>;
  status: 'active' | 'training' | 'inactive' | 'error';
}

export interface MarketReport {
  reportID: string;
  title: string;
  type: 'market_analysis' | 'property_valuation' | 'investment_analysis' | 'risk_assessment';
  region: string;
  propertyType: string;
  generatedAt: number;
  validUntil: number;
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  data: Record<string, any>;
  charts: ChartData[];
  confidence: number;
}

export interface ChartData {
  chartID: string;
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap';
  title: string;
  xAxis: string;
  yAxis: string;
  data: any[];
  options: Record<string, any>;
}

export interface ComparativeMarketAnalysis {
  propertyID: number;
  comparableProperties: number[];
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
    median: number;
  };
  marketPosition: 'above_market' | 'at_market' | 'below_market';
  pricePerSqFt: number;
  marketTrend: 'appreciating' | 'depreciating' | 'stable';
  recommendations: string[];
  lastUpdated: number;
}

export interface InvestmentOpportunity {
  opportunityID: string;
  propertyID: number;
  opportunityType: 'buy' | 'sell' | 'hold' | 'rent';
  score: number; // 0-100
  expectedReturn: number;
  riskLevel: 'low' | 'medium' | 'high';
  timeHorizon: 'short' | 'medium' | 'long';
  factors: {
    marketTrend: number;
    propertyCondition: number;
    location: number;
    rentalYield: number;
    appreciation: number;
  };
  description: string;
  recommendations: string[];
  generatedAt: number;
}

export interface MarketTrend {
  trendID: string;
  region: string;
  propertyType: string;
  trendType: 'price' | 'volume' | 'demand' | 'supply';
  direction: 'up' | 'down' | 'stable';
  magnitude: number;
  duration: number; // in days
  confidence: number;
  factors: string[];
  startDate: number;
  endDate?: number;
}

export interface RiskAssessment {
  propertyID: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number; // 0-100
  riskFactors: RiskFactor[];
  mitigationStrategies: string[];
  lastAssessed: number;
  nextAssessment: number;
}

export interface RiskFactor {
  factor: string;
  impact: 'low' | 'medium' | 'high';
  probability: number; // 0-100
  description: string;
  mitigation: string;
}

export interface AnalyticsConfig {
  dataSources: string[];
  updateFrequency: number; // in minutes
  modelRetrainingInterval: number; // in hours
  alertThresholds: {
    priceChange: number;
    volumeChange: number;
    riskScore: number;
  };
  features: {
    pricePrediction: boolean;
    marketForecasting: boolean;
    riskAssessment: boolean;
    investmentScoring: boolean;
  };
}

export interface AnalyticsEvent {
  eventID: string;
  type: 'price_alert' | 'market_trend' | 'risk_warning' | 'opportunity_alert';
  severity: 'info' | 'warning' | 'critical';
  propertyID?: number;
  message: string;
  data: any;
  timestamp: number;
  acknowledged: boolean;
}

export interface AnalyticsDashboard {
  dashboardID: string;
  name: string;
  widgets: DashboardWidget[];
  layout: DashboardLayout;
  filters: AnalyticsFilter;
  lastUpdated: number;
}

export interface DashboardWidget {
  widgetID: string;
  type: 'chart' | 'metric' | 'table' | 'alert';
  title: string;
  data: any;
  position: { x: number; y: number; width: number; height: number };
  config: Record<string, any>;
}

export interface DashboardLayout {
  columns: number;
  rows: number;
  gap: number;
}

export interface AnalyticsFilter {
  dateRange: {
    start: number;
    end: number;
  };
  regions: string[];
  propertyTypes: string[];
  priceRange: {
    min: number;
    max: number;
  };
  marketCap: {
    min: number;
    max: number;
  };
}

export interface MLModel {
  modelID: string;
  name: string;
  type: 'regression' | 'classification' | 'clustering' | 'time_series';
  algorithm: 'linear_regression' | 'random_forest' | 'neural_network' | 'lstm' | 'arima';
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingData: any[];
  features: string[];
  hyperparameters: Record<string, any>;
  lastTrained: number;
  status: 'training' | 'active' | 'inactive' | 'error';
}

export interface DataSource {
  sourceID: string;
  name: string;
  type: 'api' | 'database' | 'file' | 'stream';
  endpoint: string;
  credentials: Record<string, string>;
  updateFrequency: number;
  lastUpdate: number;
  status: 'active' | 'inactive' | 'error';
  dataQuality: number; // 0-100
}

export interface AnalyticsMetrics {
  totalProperties: number;
  totalMarketCap: number;
  averagePrice: number;
  priceChange24h: number;
  volume24h: number;
  activeModels: number;
  predictionsGenerated: number;
  alertsTriggered: number;
  dataQuality: number;
  lastUpdated: number;
}

export interface AnalyticsState {
  marketData: MarketData[];
  insights: PropertyInsight[];
  intelligence: MarketIntelligence[];
  models: PredictiveModel[];
  reports: MarketReport[];
  opportunities: InvestmentOpportunity[];
  trends: MarketTrend[];
  riskAssessments: RiskAssessment[];
  events: AnalyticsEvent[];
  dashboards: AnalyticsDashboard[];
  metrics: AnalyticsMetrics;
  loading: boolean;
  error?: string;
}

export interface AnalyticsActions {
  // Data Management
  fetchMarketData: (filters?: AnalyticsFilter) => Promise<MarketData[]>;
  fetchPropertyInsights: (propertyID: number) => Promise<PropertyInsight[]>;
  fetchMarketIntelligence: (region: string, propertyType: string) => Promise<MarketIntelligence>;
  generateReport: (type: string, filters: AnalyticsFilter) => Promise<MarketReport>;
  
  // Predictive Analytics
  predictPrice: (propertyID: number, timeframe: number) => Promise<number>;
  forecastMarket: (region: string, propertyType: string, timeframe: number) => Promise<MarketTrend[]>;
  assessRisk: (propertyID: number) => Promise<RiskAssessment>;
  scoreInvestment: (propertyID: number) => Promise<InvestmentOpportunity>;
  
  // Model Management
  trainModel: (modelID: string, data: any[]) => Promise<boolean>;
  evaluateModel: (modelID: string) => Promise<MLModel>;
  updateModel: (modelID: string, parameters: Record<string, any>) => Promise<boolean>;
  
  // Dashboard Management
  createDashboard: (config: Partial<AnalyticsDashboard>) => Promise<string>;
  updateDashboard: (dashboardID: string, config: Partial<AnalyticsDashboard>) => Promise<boolean>;
  deleteDashboard: (dashboardID: string) => Promise<boolean>;
  
  // Event Management
  subscribeToEvents: (callback: (event: AnalyticsEvent) => void) => void;
  acknowledgeEvent: (eventID: string) => Promise<boolean>;
  
  // Configuration
  updateConfig: (config: Partial<AnalyticsConfig>) => Promise<boolean>;
  getConfig: () => Promise<AnalyticsConfig>;
}

