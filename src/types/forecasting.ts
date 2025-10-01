// Property Market Forecasting Types
// Type definitions for property market forecasting and prediction functionality

export interface MarketForecast {
  id: string;
  propertyId?: string;
  location: ForecastLocation;
  type: ForecastType;
  timeframe: ForecastTimeframe;
  methodology: ForecastingMethodology;
  data: ForecastData;
  predictions: Prediction[];
  confidence: ConfidenceMetrics;
  accuracy: AccuracyMetrics;
  assumptions: Assumption[];
  scenarios: Scenario[];
  insights: Insight[];
  recommendations: Recommendation[];
  limitations: Limitation[];
  metadata: ForecastMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface ForecastLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates: Coordinates;
  marketArea: string;
  submarket: string;
  neighborhood: string;
  schoolDistrict: string;
  zipCodeArea: string;
  county: string;
  region: string;
}

export interface ForecastData {
  historical: HistoricalData[];
  current: CurrentData;
  external: ExternalData;
  indicators: Indicator[];
  trends: Trend[];
  seasonality: SeasonalityData;
  correlations: Correlation[];
}

export interface HistoricalData {
  date: string;
  price: number;
  volume: number;
  daysOnMarket: number;
  inventory: number;
  newListings: number;
  pricePerSqFt: number;
  medianPrice: number;
  averagePrice: number;
  priceIndex: number;
  marketActivity: MarketActivity;
  economicIndicators: EconomicIndicator[];
}

export interface CurrentData {
  date: string;
  price: number;
  volume: number;
  daysOnMarket: number;
  inventory: number;
  newListings: number;
  pricePerSqFt: number;
  medianPrice: number;
  averagePrice: number;
  priceIndex: number;
  marketActivity: MarketActivity;
  economicIndicators: EconomicIndicator[];
  sentiment: MarketSentiment;
  supply: SupplyData;
  demand: DemandData;
}

export interface ExternalData {
  economic: EconomicData;
  demographic: DemographicData;
  infrastructure: InfrastructureData;
  regulatory: RegulatoryData;
  environmental: EnvironmentalData;
  social: SocialData;
  technological: TechnologicalData;
}

export interface EconomicData {
  gdp: EconomicIndicator;
  unemployment: EconomicIndicator;
  inflation: EconomicIndicator;
  interestRates: EconomicIndicator;
  consumerConfidence: EconomicIndicator;
  businessConfidence: EconomicIndicator;
  housingStarts: EconomicIndicator;
  buildingPermits: EconomicIndicator;
  constructionCosts: EconomicIndicator;
  laborCosts: EconomicIndicator;
  materialCosts: EconomicIndicator;
  energyCosts: EconomicIndicator;
  transportationCosts: EconomicIndicator;
  taxes: TaxData;
  incentives: IncentiveData;
}

export interface DemographicData {
  population: DemographicIndicator;
  ageDistribution: AgeDistribution;
  incomeDistribution: IncomeDistribution;
  educationLevel: EducationLevel;
  employment: EmploymentData;
  migration: MigrationData;
  householdFormation: HouseholdFormationData;
  lifestyle: LifestyleData;
  preferences: PreferenceData;
}

export interface InfrastructureData {
  transportation: TransportationData;
  utilities: UtilityData;
  communication: CommunicationData;
  healthcare: HealthcareData;
  education: EducationData;
  recreation: RecreationData;
  commercial: CommercialData;
  industrial: IndustrialData;
  public: PublicData;
  planned: PlannedData;
}

export interface RegulatoryData {
  zoning: ZoningData;
  building: BuildingData;
  environmental: EnvironmentalRegulationData;
  tax: TaxRegulationData;
  development: DevelopmentRegulationData;
  rental: RentalRegulationData;
  shortTerm: ShortTermRentalData;
  affordable: AffordableHousingData;
  historic: HistoricPreservationData;
  future: FutureRegulationData;
}

export interface EnvironmentalData {
  climate: ClimateData;
  natural: NaturalData;
  pollution: PollutionData;
  sustainability: SustainabilityData;
  resilience: ResilienceData;
  hazards: HazardData;
  resources: ResourceData;
  conservation: ConservationData;
}

export interface SocialData {
  culture: CultureData;
  community: CommunityData;
  safety: SafetyData;
  diversity: DiversityData;
  amenities: AmenityData;
  events: EventData;
  organizations: OrganizationData;
  networks: NetworkData;
}

export interface TechnologicalData {
  connectivity: ConnectivityData;
  smart: SmartCityData;
  innovation: InnovationData;
  automation: AutomationData;
  energy: EnergyData;
  transportation: TransportationTechData;
  construction: ConstructionTechData;
  property: PropertyTechData;
}

export interface Indicator {
  id: string;
  name: string;
  category: IndicatorCategory;
  type: IndicatorType;
  value: number;
  unit: string;
  trend: TrendDirection;
  significance: number;
  weight: number;
  source: string;
  lastUpdated: string;
  description: string;
  methodology: string;
  limitations: string[];
}

export interface Trend {
  id: string;
  name: string;
  category: TrendCategory;
  direction: TrendDirection;
  strength: number;
  duration: number;
  startDate: string;
  endDate?: string;
  description: string;
  impact: number;
  confidence: number;
  factors: string[];
  implications: string[];
}

export interface SeasonalityData {
  pattern: SeasonalityPattern;
  factors: SeasonalityFactor[];
  adjustments: SeasonalityAdjustment[];
  anomalies: SeasonalityAnomaly[];
  predictions: SeasonalityPrediction[];
}

export interface SeasonalityPattern {
  type: SeasonalityType;
  strength: number;
  period: number;
  amplitude: number;
  phase: number;
  description: string;
}

export interface SeasonalityFactor {
  name: string;
  impact: number;
  timing: string;
  description: string;
  examples: string[];
}

export interface SeasonalityAdjustment {
  month: number;
  adjustment: number;
  reason: string;
  confidence: number;
}

export interface SeasonalityAnomaly {
  date: string;
  deviation: number;
  reason: string;
  impact: number;
  description: string;
}

export interface SeasonalityPrediction {
  period: string;
  adjustment: number;
  confidence: number;
  factors: string[];
}

export interface Correlation {
  variable1: string;
  variable2: string;
  coefficient: number;
  significance: number;
  lag: number;
  description: string;
  implications: string[];
}

export interface MarketActivity {
  sales: number;
  listings: number;
  pending: number;
  withdrawn: number;
  expired: number;
  priceReductions: number;
  priceIncreases: number;
  newConstruction: number;
  foreclosures: number;
  shortSales: number;
  auctions: number;
  rentals: number;
  leaseSignings: number;
  leaseRenewals: number;
  leaseTerminations: number;
}

export interface EconomicIndicator {
  name: string;
  value: number;
  unit: string;
  change: number;
  changePercentage: number;
  trend: TrendDirection;
  source: string;
  date: string;
  frequency: string;
  description: string;
}

export interface MarketSentiment {
  overall: number;
  buyers: number;
  sellers: number;
  investors: number;
  agents: number;
  developers: number;
  lenders: number;
  factors: SentimentFactor[];
  sources: SentimentSource[];
  trends: SentimentTrend[];
}

export interface SentimentFactor {
  name: string;
  impact: number;
  description: string;
  examples: string[];
}

export interface SentimentSource {
  name: string;
  weight: number;
  reliability: number;
  description: string;
}

export interface SentimentTrend {
  period: string;
  value: number;
  change: number;
  factors: string[];
}

export interface SupplyData {
  total: number;
  active: number;
  pending: number;
  new: number;
  priceReduced: number;
  priceIncreased: number;
  daysOnMarket: number;
  monthsOfSupply: number;
  absorptionRate: number;
  construction: ConstructionData;
  pipeline: PipelineData;
}

export interface ConstructionData {
  starts: number;
  completions: number;
  permits: number;
  underConstruction: number;
  planned: number;
  cancelled: number;
  delayed: number;
  cost: number;
  timeline: number;
  quality: string;
  type: string[];
  size: number;
  features: string[];
}

export interface PipelineData {
  planned: number;
  approved: number;
  proposed: number;
  underReview: number;
  timeline: number;
  probability: number;
  impact: number;
  description: string;
}

export interface DemandData {
  total: number;
  active: number;
  qualified: number;
  preApproved: number;
  firstTime: number;
  moveUp: number;
  downsizing: number;
  investment: number;
  rental: number;
  seasonal: number;
  trends: DemandTrend[];
  drivers: DemandDriver[];
}

export interface DemandTrend {
  period: string;
  value: number;
  change: number;
  factors: string[];
}

export interface DemandDriver {
  name: string;
  impact: number;
  description: string;
  examples: string[];
}

export interface Prediction {
  id: string;
  variable: string;
  period: string;
  value: number;
  confidence: number;
  range: PredictionRange;
  factors: PredictionFactor[];
  methodology: string;
  assumptions: string[];
  risks: string[];
  alternatives: AlternativePrediction[];
}

export interface PredictionRange {
  low: number;
  high: number;
  percentile25: number;
  percentile75: number;
  standardDeviation: number;
  confidenceInterval: number;
}

export interface PredictionFactor {
  name: string;
  impact: number;
  weight: number;
  description: string;
  source: string;
}

export interface AlternativePrediction {
  scenario: string;
  value: number;
  probability: number;
  description: string;
  factors: string[];
}

export interface ConfidenceMetrics {
  overall: number;
  shortTerm: number;
  mediumTerm: number;
  longTerm: number;
  factors: ConfidenceFactor[];
  methodology: string;
  limitations: string[];
  improvements: string[];
}

export interface ConfidenceFactor {
  name: string;
  impact: number;
  description: string;
  examples: string[];
}

export interface AccuracyMetrics {
  overall: number;
  shortTerm: number;
  mediumTerm: number;
  longTerm: number;
  mape: number;
  rmse: number;
  mae: number;
  bias: number;
  directional: number;
  volatility: number;
  trends: AccuracyTrend[];
  improvements: string[];
}

export interface AccuracyTrend {
  period: string;
  accuracy: number;
  factors: string[];
}

export interface Assumption {
  id: string;
  name: string;
  description: string;
  value: any;
  type: AssumptionType;
  source: string;
  confidence: number;
  impact: number;
  alternatives: string[];
  risks: string[];
  monitoring: string[];
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  probability: number;
  assumptions: ScenarioAssumption[];
  outcomes: ScenarioOutcome[];
  triggers: ScenarioTrigger[];
  timeline: string;
  impact: number;
  preparation: string[];
}

export interface ScenarioAssumption {
  variable: string;
  value: any;
  description: string;
  source: string;
}

export interface ScenarioOutcome {
  variable: string;
  value: number;
  change: number;
  description: string;
  implications: string[];
}

export interface ScenarioTrigger {
  condition: string;
  probability: number;
  impact: number;
  description: string;
  monitoring: string[];
}

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  impact: number;
  confidence: number;
  timeframe: string;
  factors: string[];
  implications: string[];
  actions: string[];
  monitoring: string[];
}

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  priority: Priority;
  timeframe: string;
  effort: number;
  impact: number;
  cost: number;
  benefits: string[];
  risks: string[];
  requirements: string[];
  alternatives: string[];
  monitoring: string[];
}

export interface Limitation {
  id: string;
  type: LimitationType;
  description: string;
  impact: number;
  mitigation: string[];
  monitoring: string[];
}

export interface ForecastMetadata {
  version: string;
  model: string;
  algorithm: string;
  parameters: ModelParameter[];
  trainingData: TrainingData;
  validation: ValidationData;
  performance: ModelPerformance;
  updates: ModelUpdate[];
  dependencies: ModelDependency[];
}

export interface ModelParameter {
  name: string;
  value: any;
  type: string;
  description: string;
  range: string;
  optimal: boolean;
}

export interface TrainingData {
  startDate: string;
  endDate: string;
  size: number;
  sources: string[];
  quality: number;
  completeness: number;
  accuracy: number;
  preprocessing: string[];
}

export interface ValidationData {
  method: string;
  results: ValidationResult[];
  performance: number;
  limitations: string[];
  improvements: string[];
}

export interface ValidationResult {
  metric: string;
  value: number;
  benchmark: number;
  performance: number;
  description: string;
}

export interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  rmse: number;
  mae: number;
  mape: number;
  trends: PerformanceTrend[];
}

export interface PerformanceTrend {
  period: string;
  metric: string;
  value: number;
  change: number;
  factors: string[];
}

export interface ModelUpdate {
  date: string;
  version: string;
  changes: string[];
  performance: number;
  description: string;
}

export interface ModelDependency {
  name: string;
  version: string;
  type: string;
  description: string;
  critical: boolean;
}

export interface ForecastingMethodology {
  approach: ForecastingApproach;
  models: ForecastingModel[];
  techniques: ForecastingTechnique[];
  dataSources: DataSource[];
  validation: ValidationMethod;
  calibration: CalibrationMethod;
  ensemble: EnsembleMethod;
  updates: UpdateMethod;
}

export interface ForecastingModel {
  name: string;
  type: ModelType;
  parameters: ModelParameter[];
  performance: number;
  weight: number;
  description: string;
  advantages: string[];
  disadvantages: string[];
}

export interface ForecastingTechnique {
  name: string;
  type: TechniqueType;
  parameters: ModelParameter[];
  performance: number;
  weight: number;
  description: string;
  advantages: string[];
  disadvantages: string[];
}

export interface DataSource {
  name: string;
  type: DataSourceType;
  reliability: number;
  completeness: number;
  timeliness: number;
  cost: number;
  description: string;
  limitations: string[];
}

export interface ValidationMethod {
  approach: ValidationApproach;
  techniques: ValidationTechnique[];
  metrics: ValidationMetric[];
  benchmarks: ValidationBenchmark[];
  crossValidation: CrossValidationMethod;
  backtesting: BacktestingMethod;
}

export interface CalibrationMethod {
  approach: CalibrationApproach;
  techniques: CalibrationTechnique[];
  parameters: CalibrationParameter[];
  frequency: string;
  triggers: CalibrationTrigger[];
}

export interface EnsembleMethod {
  approach: EnsembleApproach;
  models: string[];
  weights: number[];
  combination: CombinationMethod;
  performance: number;
  description: string;
}

export interface UpdateMethod {
  frequency: string;
  triggers: UpdateTrigger[];
  techniques: UpdateTechnique[];
  validation: boolean;
  calibration: boolean;
  performance: number;
}

export interface ForecastApiRequest {
  propertyId?: string;
  location?: ForecastLocation;
  type?: ForecastType;
  timeframe?: ForecastTimeframe;
  methodology?: ForecastingMethodology;
  filters?: ForecastFilters;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

export interface ForecastFilters {
  type: ForecastType[];
  timeframe: ForecastTimeframe[];
  location: LocationFilter;
  confidence: ConfidenceRange;
  accuracy: AccuracyRange;
  dateRange: DateRange;
  methodology: ForecastingApproach[];
}

export interface LocationFilter {
  city?: string;
  state?: string;
  zipCode?: string;
  radius?: number;
  coordinates?: Coordinates;
}

export interface ConfidenceRange {
  min: number;
  max: number;
}

export interface AccuracyRange {
  min: number;
  max: number;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface ForecastApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  pagination?: Pagination;
}

export interface ForecastApiError {
  code: string;
  message: string;
  details?: any;
  status: number;
  timestamp: string;
}

// Enums
export enum ForecastType {
  PRICE = 'price',
  VOLUME = 'volume',
  INVENTORY = 'inventory',
  DAYS_ON_MARKET = 'days_on_market',
  RENTAL_RATE = 'rental_rate',
  OCCUPANCY = 'occupancy',
  CONSTRUCTION = 'construction',
  DEMAND = 'demand',
  SUPPLY = 'supply',
  MARKET_ACTIVITY = 'market_activity',
  ECONOMIC_INDICATORS = 'economic_indicators',
  SENTIMENT = 'sentiment',
  SEASONALITY = 'seasonality',
  TRENDS = 'trends',
  CORRELATIONS = 'correlations'
}

export enum ForecastTimeframe {
  SHORT_TERM = 'short_term',
  MEDIUM_TERM = 'medium_term',
  LONG_TERM = 'long_term',
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual',
  MULTI_YEAR = 'multi_year'
}

export enum ForecastingApproach {
  TIME_SERIES = 'time_series',
  REGRESSION = 'regression',
  MACHINE_LEARNING = 'machine_learning',
  ECONOMETRIC = 'econometric',
  FUNDAMENTAL = 'fundamental',
  TECHNICAL = 'technical',
  SENTIMENT = 'sentiment',
  ENSEMBLE = 'ensemble',
  HYBRID = 'hybrid'
}

export enum ModelType {
  ARIMA = 'arima',
  SARIMA = 'sarima',
  VAR = 'var',
  GARCH = 'garch',
  LSTM = 'lstm',
  GRU = 'gru',
  TRANSFORMER = 'transformer',
  RANDOM_FOREST = 'random_forest',
  GRADIENT_BOOSTING = 'gradient_boosting',
  SVM = 'svm',
  NEURAL_NETWORK = 'neural_network',
  LINEAR_REGRESSION = 'linear_regression',
  POLYNOMIAL_REGRESSION = 'polynomial_regression',
  RIDGE_REGRESSION = 'ridge_regression',
  LASSO_REGRESSION = 'lasso_regression',
  ELASTIC_NET = 'elastic_net',
  LOGISTIC_REGRESSION = 'logistic_regression',
  DECISION_TREE = 'decision_tree',
  K_MEANS = 'k_means',
  HIERARCHICAL_CLUSTERING = 'hierarchical_clustering',
  PCA = 'pca',
  FACTOR_ANALYSIS = 'factor_analysis',
  MARKOV_CHAIN = 'markov_chain',
  MONTE_CARLO = 'monte_carlo',
  BAYESIAN = 'bayesian',
  OTHER = 'other'
}

export enum TechniqueType {
  SMOOTHING = 'smoothing',
  DECOMPOSITION = 'decomposition',
  DIFFERENCING = 'differencing',
  TRANSFORMATION = 'transformation',
  NORMALIZATION = 'normalization',
  STANDARDIZATION = 'standardization',
  FEATURE_ENGINEERING = 'feature_engineering',
  FEATURE_SELECTION = 'feature_selection',
  DIMENSIONALITY_REDUCTION = 'dimensionality_reduction',
  OUTLIER_DETECTION = 'outlier_detection',
  MISSING_DATA_IMPUTATION = 'missing_data_imputation',
  CROSS_VALIDATION = 'cross_validation',
  GRID_SEARCH = 'grid_search',
  RANDOM_SEARCH = 'random_search',
  BAYESIAN_OPTIMIZATION = 'bayesian_optimization',
  ENSEMBLE_LEARNING = 'ensemble_learning',
  BOOSTING = 'boosting',
  BAGGING = 'bagging',
  STACKING = 'stacking',
  BLENDING = 'blending',
  OTHER = 'other'
}

export enum DataSourceType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  PUBLIC = 'public',
  PRIVATE = 'private',
  COMMERCIAL = 'commercial',
  GOVERNMENT = 'government',
  ACADEMIC = 'academic',
  INDUSTRY = 'industry',
  SURVEY = 'survey',
  SENSOR = 'sensor',
  SOCIAL_MEDIA = 'social_media',
  NEWS = 'news',
  FINANCIAL = 'financial',
  ECONOMIC = 'economic',
  DEMOGRAPHIC = 'demographic',
  GEOGRAPHIC = 'geographic',
  TEMPORAL = 'temporal',
  OTHER = 'other'
}

export enum ValidationApproach {
  HOLD_OUT = 'hold_out',
  CROSS_VALIDATION = 'cross_validation',
  TIME_SERIES_CV = 'time_series_cv',
  WALK_FORWARD = 'walk_forward',
  BOOTSTRAP = 'bootstrap',
  JACKKNIFE = 'jackknife',
  MONTE_CARLO = 'monte_carlo',
  BAYESIAN = 'bayesian',
  OTHER = 'other'
}

export enum ValidationTechnique {
  K_FOLD = 'k_fold',
  STRATIFIED_K_FOLD = 'stratified_k_fold',
  LEAVE_ONE_OUT = 'leave_one_out',
  LEAVE_P_OUT = 'leave_p_out',
  TIME_SERIES_SPLIT = 'time_series_split',
  PURGED_CV = 'purged_cv',
  EMBARGOED_CV = 'embargoed_cv',
  BLOCKING_CV = 'blocking_cv',
  OTHER = 'other'
}

export enum ValidationMetric {
  ACCURACY = 'accuracy',
  PRECISION = 'precision',
  RECALL = 'recall',
  F1_SCORE = 'f1_score',
  AUC = 'auc',
  RMSE = 'rmse',
  MAE = 'mae',
  MAPE = 'mape',
  SMAPE = 'smape',
  MASE = 'mase',
  THEIL_U = 'theil_u',
  DIRECTIONAL_ACCURACY = 'directional_accuracy',
  HIT_RATE = 'hit_rate',
  OTHER = 'other'
}

export enum ValidationBenchmark {
  NAIVE = 'naive',
  SEASONAL_NAIVE = 'seasonal_naive',
  DRIFT = 'drift',
  MEAN = 'mean',
  MEDIAN = 'median',
  LINEAR_TREND = 'linear_trend',
  EXPONENTIAL_SMOOTHING = 'exponential_smoothing',
  ARIMA = 'arima',
  RANDOM_WALK = 'random_walk',
  OTHER = 'other'
}

export enum CrossValidationMethod {
  K_FOLD = 'k_fold',
  STRATIFIED_K_FOLD = 'stratified_k_fold',
  LEAVE_ONE_OUT = 'leave_one_out',
  LEAVE_P_OUT = 'leave_p_out',
  TIME_SERIES_SPLIT = 'time_series_split',
  PURGED_CV = 'purged_cv',
  EMBARGOED_CV = 'embargoed_cv',
  BLOCKING_CV = 'blocking_cv',
  OTHER = 'other'
}

export enum BacktestingMethod {
  WALK_FORWARD = 'walk_forward',
  ROLLING_WINDOW = 'rolling_window',
  EXPANDING_WINDOW = 'expanding_window',
  FIXED_WINDOW = 'fixed_window',
  ADAPTIVE_WINDOW = 'adaptive_window',
  OTHER = 'other'
}

export enum CalibrationApproach {
  MANUAL = 'manual',
  AUTOMATIC = 'automatic',
  ADAPTIVE = 'adaptive',
  BAYESIAN = 'bayesian',
  FREQUENTIST = 'frequentist',
  OTHER = 'other'
}

export enum CalibrationTechnique {
  GRID_SEARCH = 'grid_search',
  RANDOM_SEARCH = 'random_search',
  BAYESIAN_OPTIMIZATION = 'bayesian_optimization',
  GENETIC_ALGORITHM = 'genetic_algorithm',
  PARTICLE_SWARM = 'particle_swarm',
  SIMULATED_ANNEALING = 'simulated_annealing',
  GRADIENT_DESCENT = 'gradient_descent',
  NEWTON_METHOD = 'newton_method',
  QUASI_NEWTON = 'quasi_newton',
  OTHER = 'other'
}

export enum CalibrationParameter {
  LEARNING_RATE = 'learning_rate',
  REGULARIZATION = 'regularization',
  BATCH_SIZE = 'batch_size',
  EPOCHS = 'epochs',
  DROPOUT = 'dropout',
  HIDDEN_LAYERS = 'hidden_layers',
  ACTIVATION_FUNCTION = 'activation_function',
  OPTIMIZER = 'optimizer',
  LOSS_FUNCTION = 'loss_function',
  OTHER = 'other'
}

export enum CalibrationTrigger {
  PERFORMANCE_DEGRADATION = 'performance_degradation',
  DATA_DRIFT = 'data_drift',
  CONCEPT_DRIFT = 'concept_drift',
  SCHEDULED = 'scheduled',
  MANUAL = 'manual',
  THRESHOLD = 'threshold',
  OTHER = 'other'
}

export enum EnsembleApproach {
  VOTING = 'voting',
  AVERAGING = 'averaging',
  WEIGHTED_AVERAGING = 'weighted_averaging',
  STACKING = 'stacking',
  BLENDING = 'blending',
  BAGGING = 'bagging',
  BOOSTING = 'boosting',
  RANDOM_SUBSPACE = 'random_subspace',
  RANDOM_FOREST = 'random_forest',
  GRADIENT_BOOSTING = 'gradient_boosting',
  ADABOOST = 'adaboost',
  XGBOOST = 'xgboost',
  LIGHTGBM = 'lightgbm',
  CATBOOST = 'catboost',
  OTHER = 'other'
}

export enum CombinationMethod {
  SIMPLE_AVERAGE = 'simple_average',
  WEIGHTED_AVERAGE = 'weighted_average',
  MEDIAN = 'median',
  MODE = 'mode',
  VOTING = 'voting',
  STACKING = 'stacking',
  BLENDING = 'blending',
  BAYESIAN_MODEL_AVERAGING = 'bayesian_model_averaging',
  OTHER = 'other'
}

export enum UpdateTrigger {
  SCHEDULED = 'scheduled',
  PERFORMANCE_DEGRADATION = 'performance_degradation',
  DATA_DRIFT = 'data_drift',
  CONCEPT_DRIFT = 'concept_drift',
  NEW_DATA = 'new_data',
  MANUAL = 'manual',
  THRESHOLD = 'threshold',
  OTHER = 'other'
}

export enum UpdateTechnique {
  INCREMENTAL = 'incremental',
  BATCH = 'batch',
  ONLINE = 'online',
  ADAPTIVE = 'adaptive',
  TRANSFER_LEARNING = 'transfer_learning',
  FINE_TUNING = 'fine_tuning',
  RETRAINING = 'retraining',
  OTHER = 'other'
}

export enum IndicatorCategory {
  ECONOMIC = 'economic',
  DEMOGRAPHIC = 'demographic',
  INFRASTRUCTURE = 'infrastructure',
  REGULATORY = 'regulatory',
  ENVIRONMENTAL = 'environmental',
  SOCIAL = 'social',
  TECHNOLOGICAL = 'technological',
  MARKET = 'market',
  FINANCIAL = 'financial',
  BEHAVIORAL = 'behavioral',
  OTHER = 'other'
}

export enum IndicatorType {
  LEADING = 'leading',
  LAGGING = 'lagging',
  COINCIDENT = 'coincident',
  COMPOSITE = 'composite',
  DIFFUSION = 'diffusion',
  MOMENTUM = 'momentum',
  VOLATILITY = 'volatility',
  CORRELATION = 'correlation',
  OTHER = 'other'
}

export enum TrendCategory {
  PRICE = 'price',
  VOLUME = 'volume',
  INVENTORY = 'inventory',
  DEMAND = 'demand',
  SUPPLY = 'supply',
  ECONOMIC = 'economic',
  DEMOGRAPHIC = 'demographic',
  TECHNOLOGICAL = 'technological',
  REGULATORY = 'regulatory',
  ENVIRONMENTAL = 'environmental',
  SOCIAL = 'social',
  BEHAVIORAL = 'behavioral',
  OTHER = 'other'
}

export enum TrendDirection {
  UP = 'up',
  DOWN = 'down',
  STABLE = 'stable',
  VOLATILE = 'volatile',
  CYCLICAL = 'cyclical',
  SEASONAL = 'seasonal',
  TRENDING = 'trending',
  RANGING = 'ranging',
  OTHER = 'other'
}

export enum SeasonalityType {
  ANNUAL = 'annual',
  QUARTERLY = 'quarterly',
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
  DAILY = 'daily',
  HOURLY = 'hourly',
  MULTIPLE = 'multiple',
  NONE = 'none',
  OTHER = 'other'
}

export enum InsightType {
  TREND = 'trend',
  PATTERN = 'pattern',
  ANOMALY = 'anomaly',
  CORRELATION = 'correlation',
  CAUSATION = 'causation',
  OPPORTUNITY = 'opportunity',
  RISK = 'risk',
  PERFORMANCE = 'performance',
  EFFICIENCY = 'efficiency',
  QUALITY = 'quality',
  OTHER = 'other'
}

export enum RecommendationType {
  INVESTMENT = 'investment',
  TIMING = 'timing',
  PRICING = 'pricing',
  MARKETING = 'marketing',
  DEVELOPMENT = 'development',
  RENOVATION = 'renovation',
  MAINTENANCE = 'maintenance',
  RISK_MANAGEMENT = 'risk_management',
  PORTFOLIO = 'portfolio',
  STRATEGY = 'strategy',
  OPERATIONS = 'operations',
  FINANCE = 'finance',
  OTHER = 'other'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum LimitationType {
  DATA = 'data',
  MODEL = 'model',
  METHODOLOGY = 'methodology',
  ASSUMPTION = 'assumption',
  EXTERNAL = 'external',
  TEMPORAL = 'temporal',
  SPATIAL = 'spatial',
  SCALE = 'scale',
  COMPLEXITY = 'complexity',
  UNCERTAINTY = 'uncertainty',
  OTHER = 'other'
}

export enum AssumptionType {
  ECONOMIC = 'economic',
  DEMOGRAPHIC = 'demographic',
  REGULATORY = 'regulatory',
  TECHNOLOGICAL = 'technological',
  ENVIRONMENTAL = 'environmental',
  SOCIAL = 'social',
  BEHAVIORAL = 'behavioral',
  MARKET = 'market',
  FINANCIAL = 'financial',
  OPERATIONAL = 'operational',
  OTHER = 'other'
}

export enum SortBy {
  DATE = 'date',
  CONFIDENCE = 'confidence',
  ACCURACY = 'accuracy',
  TYPE = 'type',
  TIMEFRAME = 'timeframe',
  LOCATION = 'location',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

// Additional interfaces
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
