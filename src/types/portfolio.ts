/**
 * Portfolio Management Types for FlowGrow
 * Defines data structures for portfolio management and financial modeling
 */

export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  userId: string;
  properties: PortfolioProperty[];
  createdAt: number;
  updatedAt: number;
  totalValue: number;
  totalInvestment: number;
  totalReturn: number;
  totalReturnPercentage: number;
  riskScore: number;
  diversificationScore: number;
  targetAllocation?: PortfolioAllocation;
  currentAllocation: PortfolioAllocation;
  performanceMetrics: PortfolioPerformanceMetrics;
  settings: PortfolioSettings;
}

export interface PortfolioProperty {
  propertyId: string;
  property: {
    id: string;
    title: string;
    location: string;
    price: number;
    images: string[];
    metadata: Record<string, any>;
  };
  purchasePrice: number;
  purchaseDate: number;
  currentValue: number;
  shares: number;
  totalShares: number;
  ownershipPercentage: number;
  monthlyRent?: number;
  annualExpenses: number;
  annualIncome: number;
  netOperatingIncome: number;
  capRate: number;
  cashOnCashReturn: number;
  totalReturn: number;
  totalReturnPercentage: number;
  riskScore: number;
  lastValuation: number;
  notes?: string;
  tags?: string[];
}

export interface PortfolioAllocation {
  residential: number; // Percentage
  commercial: number;
  industrial: number;
  land: number;
  reits: number;
  other: number;
}

export interface PortfolioPerformanceMetrics {
  totalReturn: number;
  totalReturnPercentage: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  beta: number;
  alpha: number;
  informationRatio: number;
  treynorRatio: number;
  jensenAlpha: number;
  calmarRatio: number;
  sortinoRatio: number;
  valueAtRisk: number;
  expectedShortfall: number;
  monthlyReturns: MonthlyReturn[];
  yearlyReturns: YearlyReturn[];
  benchmarkComparison: BenchmarkComparison;
}

export interface MonthlyReturn {
  month: string; // YYYY-MM format
  return: number;
  cumulativeReturn: number;
  benchmarkReturn: number;
  excessReturn: number;
}

export interface YearlyReturn {
  year: number;
  return: number;
  benchmarkReturn: number;
  excessReturn: number;
}

export interface BenchmarkComparison {
  benchmark: string; // e.g., "S&P 500", "Real Estate Index"
  correlation: number;
  trackingError: number;
  informationRatio: number;
  beta: number;
  alpha: number;
}

export interface PortfolioSettings {
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  investmentHorizon: 'short' | 'medium' | 'long';
  rebalancingFrequency: 'monthly' | 'quarterly' | 'annually' | 'never';
  targetReturn: number;
  maxRisk: number;
  minDiversification: number;
  autoRebalancing: boolean;
  notifications: {
    performanceAlerts: boolean;
    rebalancingReminders: boolean;
    riskWarnings: boolean;
    marketUpdates: boolean;
  };
  currency: string;
  timezone: string;
}

export interface FinancialModel {
  id: string;
  name: string;
  type: 'dcf' | 'comparable' | 'income' | 'cost' | 'hybrid';
  inputs: ModelInputs;
  assumptions: ModelAssumptions;
  outputs: ModelOutputs;
  sensitivityAnalysis: SensitivityAnalysis;
  scenarioAnalysis: ScenarioAnalysis;
  createdAt: number;
  updatedAt: number;
  accuracy?: number;
  confidence?: number;
}

export interface ModelInputs {
  propertyValue: number;
  purchasePrice: number;
  downPayment: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  monthlyRent: number;
  vacancyRate: number;
  operatingExpenses: number;
  capitalExpenditures: number;
  appreciationRate: number;
  inflationRate: number;
  taxRate: number;
  depreciationRate: number;
}

export interface ModelAssumptions {
  holdingPeriod: number;
  exitCapRate: number;
  rentGrowthRate: number;
  expenseGrowthRate: number;
  marketGrowthRate: number;
  riskFreeRate: number;
  marketRiskPremium: number;
  beta: number;
  correlationWithMarket: number;
}

export interface ModelOutputs {
  netPresentValue: number;
  internalRateOfReturn: number;
  cashOnCashReturn: number;
  capRate: number;
  grossRentMultiplier: number;
  pricePerSquareFoot: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  totalCashFlow: number;
  equityMultiple: number;
  paybackPeriod: number;
  modifiedInternalRateOfReturn: number;
  netOperatingIncome: number;
  debtServiceCoverageRatio: number;
  loanToValueRatio: number;
  debtYield: number;
  returnOnEquity: number;
  returnOnInvestment: number;
}

export interface SensitivityAnalysis {
  variables: SensitivityVariable[];
  tornadoChart: TornadoChartData[];
  spiderChart: SpiderChartData[];
  monteCarloResults: MonteCarloResults;
}

export interface SensitivityVariable {
  name: string;
  baseValue: number;
  minValue: number;
  maxValue: number;
  step: number;
  impact: number; // Impact on NPV
  sensitivity: number; // Sensitivity coefficient
}

export interface TornadoChartData {
  variable: string;
  positiveImpact: number;
  negativeImpact: number;
  range: number;
}

export interface SpiderChartData {
  variable: string;
  values: number[];
  npvImpact: number[];
}

export interface MonteCarloResults {
  iterations: number;
  meanNPV: number;
  medianNPV: number;
  standardDeviation: number;
  confidenceIntervals: {
    p5: number;
    p10: number;
    p25: number;
    p75: number;
    p90: number;
    p95: number;
  };
  probabilityOfPositiveReturn: number;
  valueAtRisk: number;
  expectedShortfall: number;
  distribution: number[];
}

export interface ScenarioAnalysis {
  scenarios: Scenario[];
  summary: ScenarioSummary;
}

export interface Scenario {
  name: string;
  probability: number;
  description: string;
  inputs: Partial<ModelInputs>;
  outputs: ModelOutputs;
  keyMetrics: {
    npv: number;
    irr: number;
    cashFlow: number;
    risk: number;
  };
}

export interface ScenarioSummary {
  expectedNPV: number;
  expectedIRR: number;
  expectedCashFlow: number;
  riskScore: number;
  bestCase: Scenario;
  worstCase: Scenario;
  mostLikely: Scenario;
}

export interface RiskAnalysis {
  portfolioId: string;
  overallRisk: number;
  systematicRisk: number;
  unsystematicRisk: number;
  concentrationRisk: number;
  liquidityRisk: number;
  marketRisk: number;
  creditRisk: number;
  operationalRisk: number;
  riskFactors: RiskFactor[];
  riskMetrics: RiskMetrics;
  recommendations: RiskRecommendation[];
}

export interface RiskFactor {
  name: string;
  type: 'market' | 'credit' | 'liquidity' | 'operational' | 'concentration';
  impact: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  description: string;
  mitigation: string[];
}

export interface RiskMetrics {
  valueAtRisk: number;
  expectedShortfall: number;
  maximumDrawdown: number;
  volatility: number;
  beta: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  informationRatio: number;
  trackingError: number;
  correlationWithMarket: number;
  concentrationIndex: number;
  herfindahlIndex: number;
}

export interface RiskRecommendation {
  type: 'diversification' | 'hedging' | 'rebalancing' | 'risk_management';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  action: string;
  expectedImpact: number;
  implementation: string[];
}

export interface PortfolioOptimization {
  portfolioId: string;
  objective: 'maximize_return' | 'minimize_risk' | 'maximize_sharpe' | 'custom';
  constraints: OptimizationConstraints;
  results: OptimizationResults;
  recommendations: OptimizationRecommendation[];
}

export interface OptimizationConstraints {
  maxWeight: number; // Maximum weight per property
  minWeight: number; // Minimum weight per property
  maxProperties: number; // Maximum number of properties
  minProperties: number; // Minimum number of properties
  maxSectorWeight: number; // Maximum weight per sector
  minLiquidity: number; // Minimum liquidity requirement
  maxLeverage: number; // Maximum leverage ratio
  targetReturn?: number; // Target return constraint
  maxRisk?: number; // Maximum risk constraint
}

export interface OptimizationResults {
  optimalWeights: Record<string, number>; // Property ID -> Weight
  expectedReturn: number;
  expectedRisk: number;
  sharpeRatio: number;
  efficientFrontier: EfficientFrontierPoint[];
  optimizationMethod: 'mean_variance' | 'black_litterman' | 'risk_parity' | 'equal_weight';
  convergence: boolean;
  iterations: number;
  computationTime: number;
}

export interface EfficientFrontierPoint {
  return: number;
  risk: number;
  sharpeRatio: number;
  weights: Record<string, number>;
}

export interface OptimizationRecommendation {
  action: 'buy' | 'sell' | 'hold' | 'rebalance';
  propertyId: string;
  currentWeight: number;
  targetWeight: number;
  amount: number;
  reason: string;
  priority: 'low' | 'medium' | 'high';
  expectedImpact: {
    return: number;
    risk: number;
    diversification: number;
  };
}

export interface PortfolioComparison {
  portfolios: Portfolio[];
  metrics: ComparisonMetrics;
  rankings: PortfolioRanking[];
  insights: ComparisonInsight[];
}

export interface ComparisonMetrics {
  returns: Record<string, number>;
  risks: Record<string, number>;
  sharpeRatios: Record<string, number>;
  maxDrawdowns: Record<string, number>;
  volatilities: Record<string, number>;
  correlations: Record<string, Record<string, number>>;
}

export interface PortfolioRanking {
  portfolioId: string;
  rank: number;
  score: number;
  metrics: {
    return: number;
    risk: number;
    sharpe: number;
    diversification: number;
  };
}

export interface ComparisonInsight {
  type: 'performance' | 'risk' | 'diversification' | 'efficiency';
  description: string;
  recommendation: string;
  impact: 'positive' | 'negative' | 'neutral';
}

// API Response Types
export interface PortfolioListResponse {
  portfolios: Portfolio[];
  total: number;
  page: number;
  limit: number;
}

export interface PortfolioResponse {
  portfolio: Portfolio;
  success: boolean;
  message?: string;
}

export interface FinancialModelResponse {
  model: FinancialModel;
  success: boolean;
  message?: string;
}

export interface RiskAnalysisResponse {
  analysis: RiskAnalysis;
  success: boolean;
  message?: string;
}

export interface OptimizationResponse {
  optimization: PortfolioOptimization;
  success: boolean;
  message?: string;
}

// Form Types
export interface CreatePortfolioForm {
  name: string;
  description?: string;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  investmentHorizon: 'short' | 'medium' | 'long';
  targetReturn: number;
  maxRisk: number;
  currency: string;
}

export interface UpdatePortfolioForm {
  name?: string;
  description?: string;
  settings?: Partial<PortfolioSettings>;
}

export interface AddPropertyForm {
  propertyId: string;
  purchasePrice: number;
  purchaseDate: number;
  shares: number;
  notes?: string;
  tags?: string[];
}

export interface CreateModelForm {
  name: string;
  type: 'dcf' | 'comparable' | 'income' | 'cost' | 'hybrid';
  inputs: ModelInputs;
  assumptions: ModelAssumptions;
}

// Event Types
export interface PortfolioEvent {
  type: 'created' | 'updated' | 'deleted' | 'property_added' | 'property_removed' | 'rebalanced';
  portfolioId: string;
  timestamp: number;
  data: any;
  userId: string;
}

export interface ModelEvent {
  type: 'created' | 'updated' | 'deleted' | 'calculated' | 'sensitivity_updated';
  modelId: string;
  timestamp: number;
  data: any;
  userId: string;
}
