// Insurance Calculator Types
// Type definitions for property insurance calculations and management

export interface InsurancePolicy {
  id: string;
  propertyId: string;
  policyNumber: string;
  insuranceCompany: string;
  policyType: InsuranceType;
  coverageType: CoverageType;
  startDate: string;
  endDate: string;
  premium: number;
  deductible: number;
  coverageAmount: number;
  replacementCost: number;
  actualCashValue: number;
  liabilityCoverage: number;
  personalPropertyCoverage: number;
  additionalCoverages: AdditionalCoverage[];
  discounts: InsuranceDiscount[];
  surcharges: InsuranceSurcharge[];
  claims: InsuranceClaim[];
  status: PolicyStatus;
  renewalDate: string;
  agent: InsuranceAgent;
  documents: InsuranceDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface InsuranceQuote {
  id: string;
  propertyId: string;
  insuranceCompany: string;
  policyType: InsuranceType;
  coverageType: CoverageType;
  premium: number;
  deductible: number;
  coverageAmount: number;
  replacementCost: number;
  actualCashValue: number;
  liabilityCoverage: number;
  personalPropertyCoverage: number;
  additionalCoverages: AdditionalCoverage[];
  discounts: InsuranceDiscount[];
  surcharges: InsuranceSurcharge[];
  quoteValidUntil: string;
  agent: InsuranceAgent;
  comparison: QuoteComparison;
  createdAt: string;
}

export interface InsuranceCalculation {
  id: string;
  propertyId: string;
  propertyDetails: PropertyDetails;
  coverageOptions: CoverageOptions;
  riskFactors: RiskFactor[];
  premiumCalculation: PremiumCalculation;
  deductibleCalculation: DeductibleCalculation;
  coverageCalculation: CoverageCalculation;
  discountCalculation: DiscountCalculation;
  surchargeCalculation: SurchargeCalculation;
  totalPremium: number;
  monthlyPremium: number;
  annualPremium: number;
  effectiveDate: string;
  calculationDate: string;
}

export interface PropertyDetails {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: PropertyType;
  constructionType: ConstructionType;
  yearBuilt: number;
  squareFootage: number;
  numberOfStories: number;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  garageType: GarageType;
  roofType: RoofType;
  heatingType: HeatingType;
  coolingType: CoolingType;
  securityFeatures: SecurityFeature[];
  safetyFeatures: SafetyFeature[];
  recentRenovations: Renovation[];
  propertyValue: number;
  replacementCost: number;
  landValue: number;
  improvementsValue: number;
}

export interface CoverageOptions {
  dwellingCoverage: number;
  otherStructuresCoverage: number;
  personalPropertyCoverage: number;
  lossOfUseCoverage: number;
  liabilityCoverage: number;
  medicalPaymentsCoverage: number;
  additionalCoverages: AdditionalCoverage[];
  coverageLimits: CoverageLimit[];
  endorsements: InsuranceEndorsement[];
}

export interface RiskFactor {
  id: string;
  factor: RiskFactorType;
  level: RiskLevel;
  impact: number;
  description: string;
  mitigation: string;
  monitoring: string;
  lastAssessed: string;
}

export interface PremiumCalculation {
  basePremium: number;
  dwellingFactor: number;
  locationFactor: number;
  constructionFactor: number;
  ageFactor: number;
  sizeFactor: number;
  featuresFactor: number;
  claimsFactor: number;
  creditFactor: number;
  deductibleFactor: number;
  coverageFactor: number;
  discountFactor: number;
  surchargeFactor: number;
  totalPremium: number;
  breakdown: PremiumBreakdown[];
}

export interface DeductibleCalculation {
  dwellingDeductible: number;
  otherStructuresDeductible: number;
  personalPropertyDeductible: number;
  liabilityDeductible: number;
  windHailDeductible: number;
  hurricaneDeductible: number;
  earthquakeDeductible: number;
  floodDeductible: number;
  totalDeductible: number;
  deductibleOptions: DeductibleOption[];
  recommendedDeductible: number;
  savingsAnalysis: DeductibleSavings[];
}

export interface CoverageCalculation {
  dwellingCoverage: number;
  otherStructuresCoverage: number;
  personalPropertyCoverage: number;
  lossOfUseCoverage: number;
  liabilityCoverage: number;
  medicalPaymentsCoverage: number;
  additionalCoverages: AdditionalCoverage[];
  totalCoverage: number;
  coverageAdequacy: CoverageAdequacy;
  coverageGaps: CoverageGap[];
  recommendations: CoverageRecommendation[];
}

export interface DiscountCalculation {
  availableDiscounts: InsuranceDiscount[];
  appliedDiscounts: InsuranceDiscount[];
  totalDiscountAmount: number;
  totalDiscountPercentage: number;
  eligibilityRequirements: DiscountEligibility[];
  savingsAnalysis: DiscountSavings[];
}

export interface SurchargeCalculation {
  applicableSurcharges: InsuranceSurcharge[];
  totalSurchargeAmount: number;
  totalSurchargePercentage: number;
  surchargeReasons: SurchargeReason[];
  mitigationOptions: SurchargeMitigation[];
}

export interface AdditionalCoverage {
  id: string;
  type: AdditionalCoverageType;
  name: string;
  description: string;
  coverageAmount: number;
  premium: number;
  deductible: number;
  isRequired: boolean;
  isRecommended: boolean;
  benefits: string[];
  exclusions: string[];
  limits: CoverageLimit[];
}

export interface InsuranceDiscount {
  id: string;
  type: DiscountType;
  name: string;
  description: string;
  amount: number;
  percentage: number;
  eligibilityRequirements: string[];
  isEligible: boolean;
  isApplied: boolean;
  savingsAmount: number;
  requirements: DiscountRequirement[];
}

export interface InsuranceSurcharge {
  id: string;
  type: SurchargeType;
  name: string;
  description: string;
  amount: number;
  percentage: number;
  reason: string;
  isApplicable: boolean;
  isApplied: boolean;
  mitigationOptions: string[];
  reviewDate: string;
}

export interface InsuranceClaim {
  id: string;
  policyId: string;
  claimNumber: string;
  claimType: ClaimType;
  claimDate: string;
  lossDate: string;
  description: string;
  cause: string;
  amount: number;
  deductible: number;
  paidAmount: number;
  status: ClaimStatus;
  adjuster: string;
  documents: ClaimDocument[];
  timeline: ClaimTimeline[];
  createdAt: string;
  updatedAt: string;
}

export interface InsuranceAgent {
  id: string;
  name: string;
  company: string;
  licenseNumber: string;
  phone: string;
  email: string;
  address: string;
  specialties: string[];
  rating: number;
  yearsExperience: number;
  certifications: string[];
  availability: AgentAvailability[];
}

export interface InsuranceDocument {
  id: string;
  policyId: string;
  type: DocumentType;
  name: string;
  description: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
  expiresAt?: string;
  isRequired: boolean;
  isSigned: boolean;
  signatureDate?: string;
}

export interface QuoteComparison {
  id: string;
  quotes: InsuranceQuote[];
  comparisonMetrics: ComparisonMetric[];
  recommendations: QuoteRecommendation[];
  bestValue: string;
  bestCoverage: string;
  mostAffordable: string;
  comparisonDate: string;
}

export interface ComparisonMetric {
  metric: string;
  values: { [company: string]: number };
  bestValue: string;
  worstValue: string;
  average: number;
  range: number;
}

export interface QuoteRecommendation {
  type: RecommendationType;
  company: string;
  reason: string;
  savings?: number;
  benefits: string[];
  considerations: string[];
}

export interface PremiumBreakdown {
  component: string;
  amount: number;
  percentage: number;
  description: string;
  factors: string[];
}

export interface DeductibleOption {
  type: string;
  amount: number;
  premiumImpact: number;
  savings: number;
  riskLevel: RiskLevel;
  recommendation: string;
}

export interface DeductibleSavings {
  deductibleAmount: number;
  premiumSavings: number;
  breakEvenPoint: number;
  riskAnalysis: string;
  recommendation: string;
}

export interface CoverageAdequacy {
  dwellingAdequacy: number;
  personalPropertyAdequacy: number;
  liabilityAdequacy: number;
  overallAdequacy: number;
  adequacyLevel: AdequacyLevel;
  recommendations: string[];
}

export interface CoverageGap {
  type: string;
  description: string;
  impact: string;
  recommendation: string;
  cost: number;
  priority: Priority;
}

export interface CoverageRecommendation {
  type: string;
  currentCoverage: number;
  recommendedCoverage: number;
  difference: number;
  reason: string;
  cost: number;
  priority: Priority;
}

export interface CoverageLimit {
  type: string;
  limit: number;
  description: string;
  isStandard: boolean;
  isRecommended: boolean;
}

export interface InsuranceEndorsement {
  id: string;
  type: string;
  name: string;
  description: string;
  coverageAmount: number;
  premium: number;
  isRequired: boolean;
  isRecommended: boolean;
  benefits: string[];
  exclusions: string[];
}

export interface DiscountEligibility {
  discount: string;
  requirements: string[];
  isEligible: boolean;
  missingRequirements: string[];
  actionRequired: string;
}

export interface DiscountSavings {
  discount: string;
  currentSavings: number;
  potentialSavings: number;
  requirements: string[];
  actionRequired: string;
}

export interface SurchargeReason {
  surcharge: string;
  reason: string;
  impact: number;
  mitigation: string;
  timeline: string;
}

export interface SurchargeMitigation {
  surcharge: string;
  mitigation: string;
  cost: number;
  timeline: string;
  expectedSavings: number;
  priority: Priority;
}

export interface ClaimDocument {
  id: string;
  type: string;
  name: string;
  fileUrl: string;
  uploadedAt: string;
  isRequired: boolean;
  status: string;
}

export interface ClaimTimeline {
  date: string;
  status: string;
  description: string;
  actor: string;
  notes: string;
}

export interface AgentAvailability {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface InsuranceCalculatorRequest {
  propertyId: string;
  propertyDetails: PropertyDetails;
  coverageOptions: CoverageOptions;
  riskFactors: RiskFactor[];
  calculationType: CalculationType;
  effectiveDate: string;
}

export interface InsuranceCalculatorResponse {
  calculation: InsuranceCalculation;
  quotes: InsuranceQuote[];
  recommendations: InsuranceRecommendation[];
  comparison: QuoteComparison;
  errors: InsuranceError[];
}

export interface InsuranceRecommendation {
  type: RecommendationType;
  title: string;
  description: string;
  action: string;
  expectedSavings: number;
  priority: Priority;
  timeline: string;
  requirements: string[];
  benefits: string[];
  considerations: string[];
}

export interface InsuranceError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}

// Enums
export enum InsuranceType {
  HOMEOWNERS = 'homeowners',
  RENTERS = 'renters',
  CONDOMINIUM = 'condominium',
  MOBILE_HOME = 'mobile_home',
  LANDLORD = 'landlord',
  FLOOD = 'flood',
  EARTHQUAKE = 'earthquake',
  UMBRELLA = 'umbrella',
  COMMERCIAL = 'commercial'
}

export enum CoverageType {
  ACTUAL_CASH_VALUE = 'actual_cash_value',
  REPLACEMENT_COST = 'replacement_cost',
  GUARANTEED_REPLACEMENT_COST = 'guaranteed_replacement_cost',
  EXTENDED_REPLACEMENT_COST = 'extended_replacement_cost'
}

export enum PolicyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended'
}

export enum PropertyType {
  SINGLE_FAMILY = 'single_family',
  CONDOMINIUM = 'condominium',
  TOWNHOUSE = 'townhouse',
  DUPLEX = 'duplex',
  TRIPLEX = 'triplex',
  FOURPLEX = 'fourplex',
  MOBILE_HOME = 'mobile_home',
  MANUFACTURED_HOME = 'manufactured_home',
  APARTMENT = 'apartment',
  COMMERCIAL = 'commercial'
}

export enum ConstructionType {
  WOOD_FRAME = 'wood_frame',
  BRICK = 'brick',
  STONE = 'stone',
  CONCRETE = 'concrete',
  STEEL = 'steel',
  MIXED = 'mixed'
}

export enum GarageType {
  ATTACHED = 'attached',
  DETACHED = 'detached',
  CARPORT = 'carport',
  NONE = 'none'
}

export enum RoofType {
  ASPHALT_SHINGLES = 'asphalt_shingles',
  METAL = 'metal',
  TILE = 'tile',
  SLATE = 'slate',
  WOOD_SHINGLES = 'wood_shingles',
  FLAT = 'flat',
  OTHER = 'other'
}

export enum HeatingType {
  FORCED_AIR = 'forced_air',
  RADIANT = 'radiant',
  BASEBOARD = 'baseboard',
  HEAT_PUMP = 'heat_pump',
  WOOD_STOVE = 'wood_stove',
  PELLET_STOVE = 'pellet_stove',
  OTHER = 'other'
}

export enum CoolingType {
  CENTRAL_AIR = 'central_air',
  WINDOW_UNITS = 'window_units',
  HEAT_PUMP = 'heat_pump',
  EVAPORATIVE = 'evaporative',
  NONE = 'none',
  OTHER = 'other'
}

export enum SecurityFeature {
  ALARM_SYSTEM = 'alarm_system',
  SECURITY_CAMERAS = 'security_cameras',
  MOTION_DETECTORS = 'motion_detectors',
  DOOR_LOCKS = 'door_locks',
  WINDOW_LOCKS = 'window_locks',
  SECURITY_LIGHTS = 'security_lights',
  GATED_COMMUNITY = 'gated_community',
  SECURITY_GUARD = 'security_guard'
}

export enum SafetyFeature {
  SMOKE_DETECTORS = 'smoke_detectors',
  CARBON_MONOXIDE_DETECTORS = 'carbon_monoxide_detectors',
  FIRE_EXTINGUISHERS = 'fire_extinguishers',
  SPRINKLER_SYSTEM = 'sprinkler_system',
  FIRE_ESCAPE = 'fire_escape',
  DEADBOLT_LOCKS = 'deadbolt_locks',
  SECURITY_BARS = 'security_bars',
  SAFE_ROOM = 'safe_room'
}

export enum RiskFactorType {
  LOCATION = 'location',
  CONSTRUCTION = 'construction',
  AGE = 'age',
  CLAIMS_HISTORY = 'claims_history',
  CREDIT_SCORE = 'credit_score',
  OCCUPANCY = 'occupancy',
  SECURITY = 'security',
  MAINTENANCE = 'maintenance',
  NEIGHBORHOOD = 'neighborhood',
  WEATHER = 'weather'
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

export enum AdditionalCoverageType {
  JEWELRY = 'jewelry',
  ELECTRONICS = 'electronics',
  ART = 'art',
  COLLECTIBLES = 'collectibles',
  BUSINESS_EQUIPMENT = 'business_equipment',
  IDENTITY_THEFT = 'identity_theft',
  SEWER_BACKUP = 'sewer_backup',
  WATER_DAMAGE = 'water_damage',
  MOLD = 'mold',
  ORDINANCE_LAW = 'ordinance_law'
}

export enum DiscountType {
  MULTI_POLICY = 'multi_policy',
  CLAIMS_FREE = 'claims_free',
  SECURITY_SYSTEM = 'security_system',
  NEW_HOME = 'new_home',
  SENIOR_CITIZEN = 'senior_citizen',
  NON_SMOKER = 'non_smoker',
  AUTOPAY = 'autopay',
  PAPERLESS = 'paperless',
  LOYALTY = 'loyalty',
  GROUP = 'group'
}

export enum SurchargeType {
  CLAIMS_HISTORY = 'claims_history',
  CREDIT_SCORE = 'credit_score',
  HIGH_RISK_LOCATION = 'high_risk_location',
  OLD_HOME = 'old_home',
  POOR_MAINTENANCE = 'poor_maintenance',
  HIGH_VALUE = 'high_value',
  COMMERCIAL_USE = 'commercial_use',
  VACANT_PROPERTY = 'vacant_property'
}

export enum ClaimType {
  FIRE = 'fire',
  WATER_DAMAGE = 'water_damage',
  THEFT = 'theft',
  VANDALISM = 'vandalism',
  WIND = 'wind',
  HAIL = 'hail',
  LIABILITY = 'liability',
  MEDICAL = 'medical',
  OTHER = 'other'
}

export enum ClaimStatus {
  REPORTED = 'reported',
  ASSIGNED = 'assigned',
  INVESTIGATING = 'investigating',
  ADJUSTED = 'adjusted',
  APPROVED = 'approved',
  DENIED = 'denied',
  PAID = 'paid',
  CLOSED = 'closed'
}

export enum DocumentType {
  POLICY = 'policy',
  ENDORSEMENT = 'endorsement',
  CLAIM_FORM = 'claim_form',
  PROOF_OF_LOSS = 'proof_of_loss',
  ESTIMATE = 'estimate',
  RECEIPT = 'receipt',
  PHOTO = 'photo',
  VIDEO = 'video',
  OTHER = 'other'
}

export enum RecommendationType {
  COVERAGE_INCREASE = 'coverage_increase',
  COVERAGE_DECREASE = 'coverage_decrease',
  DEDUCTIBLE_CHANGE = 'deductible_change',
  DISCOUNT_ELIGIBILITY = 'discount_eligibility',
  SURCHARGE_MITIGATION = 'surcharge_mitigation',
  POLICY_CHANGE = 'policy_change',
  COMPANY_SWITCH = 'company_switch',
  ENDORSEMENT_ADD = 'endorsement_add'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum AdequacyLevel {
  INADEQUATE = 'inadequate',
  MINIMAL = 'minimal',
  ADEQUATE = 'adequate',
  GOOD = 'good',
  EXCELLENT = 'excellent'
}

export enum CalculationType {
  QUOTE = 'quote',
  RENEWAL = 'renewal',
  ENDORSEMENT = 'endorsement',
  CLAIM = 'claim',
  COMPARISON = 'comparison'
}

export enum DiscountRequirement {
  MULTI_POLICY = 'multi_policy',
  CLAIMS_FREE = 'claims_free',
  SECURITY_SYSTEM = 'security_system',
  NEW_HOME = 'new_home',
  SENIOR_CITIZEN = 'senior_citizen',
  NON_SMOKER = 'non_smoker',
  AUTOPAY = 'autopay',
  PAPERLESS = 'paperless',
  LOYALTY = 'loyalty',
  GROUP = 'group'
}

export interface Renovation {
  type: string;
  year: number;
  cost: number;
  description: string;
}

export interface InsuranceApiError {
  code: string;
  message: string;
  details?: any;
  status: number;
  timestamp: string;
}