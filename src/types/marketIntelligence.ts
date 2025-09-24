export interface MarketData {
  id: string;
  location: string;
  propertyType: string;
  date: string;
  medianPrice: number;
  averagePrice: number;
  pricePerSqFt: number;
  totalListings: number;
  newListings: number;
  soldListings: number;
  daysOnMarket: number;
  inventoryLevel: number;
  priceChange: number;
  yearOverYearChange: number;
  marketTrend: 'up' | 'down' | 'stable';
  seasonality: number;
  demandScore: number;
  supplyScore: number;
  marketHealth: 'healthy' | 'overheated' | 'cooling' | 'declining';
}

export interface PropertyInsight {
  id: string;
  propertyId: string;
  insightType: 'price' | 'market' | 'investment' | 'risk' | 'opportunity';
  title: string;
  description: string;
  confidence: number; // 0-100
  impact: 'low' | 'medium' | 'high' | 'critical';
  timeframe: 'short' | 'medium' | 'long';
  dataPoints: DataPoint[];
  recommendations: string[];
  riskFactors: string[];
  opportunities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DataPoint {
  id: string;
  metric: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  changePercentage: number;
  benchmark: number;
  percentile: number;
  significance: 'low' | 'medium' | 'high';
}

export interface PredictiveAnalytics {
  id: string;
  propertyId: string;
  modelType: 'price_forecast' | 'demand_forecast' | 'risk_assessment' | 'investment_return';
  prediction: {
    value: number;
    confidence: number;
    timeframe: string;
    factors: string[];
  };
  scenarios: {
    optimistic: number;
    realistic: number;
    pessimistic: number;
  };
  accuracy: number;
  lastUpdated: string;
  nextUpdate: string;
}

export interface MarketReport {
  id: string;
  title: string;
  location: string;
  propertyType: string;
  reportType: 'market_overview' | 'price_analysis' | 'investment_opportunity' | 'risk_assessment';
  period: {
    start: string;
    end: string;
  };
  summary: string;
  keyFindings: string[];
  marketMetrics: MarketMetric[];
  charts: Chart[];
  recommendations: string[];
  riskFactors: string[];
  opportunities: string[];
  methodology: string;
  dataSources: string[];
  generatedBy: string;
  generatedAt: string;
  isPublic: boolean;
  tags: string[];
}

export interface MarketMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
  benchmark: number;
  significance: 'low' | 'medium' | 'high';
  description: string;
}

export interface Chart {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap' | 'area';
  title: string;
  description: string;
  data: any[];
  xAxis: string;
  yAxis: string;
  colors: string[];
  annotations: ChartAnnotation[];
}

export interface ChartAnnotation {
  id: string;
  type: 'point' | 'line' | 'area' | 'text';
  x: number | string;
  y: number | string;
  text?: string;
  color?: string;
  style?: string;
}

export interface MarketIntelligence {
  id: string;
  location: string;
  propertyType: string;
  marketData: MarketData;
  insights: PropertyInsight[];
  predictions: PredictiveAnalytics[];
  reports: MarketReport[];
  alerts: MarketAlert[];
  lastUpdated: string;
}

export interface MarketAlert {
  id: string;
  type: 'price_change' | 'market_shift' | 'opportunity' | 'risk' | 'news';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  propertyType: string;
  impact: string;
  actionRequired: boolean;
  actionUrl?: string;
  expiresAt?: string;
  isRead: boolean;
  createdAt: string;
}

export interface DataVisualization {
  id: string;
  title: string;
  type: 'dashboard' | 'chart' | 'map' | 'table' | 'infographic';
  data: any;
  config: VisualizationConfig;
  filters: Filter[];
  interactions: Interaction[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VisualizationConfig {
  width: number;
  height: number;
  theme: 'light' | 'dark' | 'auto';
  colors: string[];
  animations: boolean;
  responsive: boolean;
  exportFormats: string[];
}

export interface Filter {
  id: string;
  field: string;
  type: 'range' | 'select' | 'multiselect' | 'date' | 'boolean';
  label: string;
  options?: any[];
  defaultValue?: any;
  isRequired: boolean;
}

export interface Interaction {
  id: string;
  type: 'click' | 'hover' | 'zoom' | 'pan' | 'select';
  action: string;
  target: string;
  parameters: Record<string, any>;
}

export interface MarketComparison {
  id: string;
  title: string;
  locations: string[];
  propertyTypes: string[];
  metrics: ComparisonMetric[];
  timeframes: string[];
  insights: string[];
  recommendations: string[];
  createdAt: string;
}

export interface ComparisonMetric {
  id: string;
  name: string;
  values: Record<string, number>;
  unit: string;
  trend: Record<string, 'up' | 'down' | 'stable'>;
  significance: 'low' | 'medium' | 'high';
}

export interface InvestmentOpportunity {
  id: string;
  propertyId: string;
  location: string;
  propertyType: string;
  opportunityType: 'undervalued' | 'growth_potential' | 'rental_yield' | 'development' | 'flip';
  score: number; // 0-100
  confidence: number; // 0-100
  expectedReturn: {
    annual: number;
    total: number;
    timeframe: string;
  };
  riskLevel: 'low' | 'medium' | 'high';
  factors: {
    positive: string[];
    negative: string[];
  };
  marketConditions: {
    demand: 'low' | 'medium' | 'high';
    supply: 'low' | 'medium' | 'high';
    competition: 'low' | 'medium' | 'high';
  };
  recommendations: string[];
  timeline: string;
  createdAt: string;
}

export interface RiskAssessment {
  id: string;
  propertyId: string;
  location: string;
  riskType: 'market' | 'financial' | 'regulatory' | 'environmental' | 'operational';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  probability: number; // 0-100
  impact: number; // 0-100
  description: string;
  factors: string[];
  mitigation: string[];
  monitoring: string[];
  lastAssessed: string;
  nextAssessment: string;
}

export interface MarketIntelligenceDashboard {
  id: string;
  userId: string;
  title: string;
  widgets: DashboardWidget[];
  layout: DashboardLayout;
  filters: Filter[];
  refreshInterval: number; // minutes
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'map' | 'alert' | 'insight';
  title: string;
  dataSource: string;
  config: any;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  filters: Filter[];
  refreshInterval: number;
}

export interface DashboardLayout {
  columns: number;
  rows: number;
  gap: number;
  padding: number;
  responsive: boolean;
}

export interface MarketIntelligenceSettings {
  userId: string;
  preferences: {
    defaultLocation: string;
    defaultPropertyType: string;
    alertFrequency: 'realtime' | 'daily' | 'weekly' | 'monthly';
    reportFormat: 'pdf' | 'excel' | 'csv' | 'json';
    language: string;
    timezone: string;
  };
  subscriptions: {
    marketData: boolean;
    priceAlerts: boolean;
    opportunityAlerts: boolean;
    riskAlerts: boolean;
    newsAlerts: boolean;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    webhook: boolean;
  };
  dataRetention: {
    marketData: number; // days
    reports: number; // days
    alerts: number; // days
  };
}

export interface MarketIntelligenceSearchFilters {
  location?: string;
  propertyType?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  marketTrend?: 'up' | 'down' | 'stable';
  riskLevel?: 'low' | 'medium' | 'high';
  opportunityType?: string;
  reportType?: string;
  tags?: string[];
}

export interface MarketIntelligenceAPI {
  getMarketData: (filters: MarketIntelligenceSearchFilters) => Promise<MarketData[]>;
  getPropertyInsights: (propertyId: string) => Promise<PropertyInsight[]>;
  getPredictiveAnalytics: (propertyId: string) => Promise<PredictiveAnalytics[]>;
  generateMarketReport: (params: any) => Promise<MarketReport>;
  getMarketAlerts: (filters: any) => Promise<MarketAlert[]>;
  createDataVisualization: (config: any) => Promise<DataVisualization>;
  getInvestmentOpportunities: (filters: any) => Promise<InvestmentOpportunity[]>;
  getRiskAssessments: (propertyId: string) => Promise<RiskAssessment[]>;
  createDashboard: (config: any) => Promise<MarketIntelligenceDashboard>;
  updateSettings: (settings: MarketIntelligenceSettings) => Promise<boolean>;
}
