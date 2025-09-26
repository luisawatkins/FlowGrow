// Property Insurance and Risk Management Types

export interface InsurancePolicy {
  policyID: string;
  propertyID: number;
  policyType: InsuranceType;
  coverageAmount: number;
  premium: number;
  deductible: number;
  startDate: number;
  endDate: number;
  status: PolicyStatus;
  provider: string;
  policyNumber: string;
  coverageDetails: CoverageDetails;
  claims: InsuranceClaim[];
  riskFactors: RiskFactor[];
  lastUpdated: number;
}

export interface InsuranceClaim {
  claimID: string;
  policyID: string;
  propertyID: number;
  claimType: ClaimType;
  description: string;
  amount: number;
  status: ClaimStatus;
  submittedDate: number;
  processedDate?: number;
  approvedAmount?: number;
  documents: ClaimDocument[];
  adjuster?: string;
  notes: string[];
  lastUpdated: number;
}

export interface RiskAssessment {
  assessmentID: string;
  propertyID: number;
  assessmentDate: number;
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  riskFactors: RiskFactor[];
  mitigationStrategies: MitigationStrategy[];
  recommendations: string[];
  nextAssessmentDate: number;
  assessor: string;
  status: AssessmentStatus;
}

export interface RiskFactor {
  factorID: string;
  category: RiskCategory;
  name: string;
  description: string;
  impact: RiskImpact;
  probability: number; // 0-100
  severity: RiskSeverity;
  mitigation: string;
  cost: number;
  priority: Priority;
  status: FactorStatus;
}

export interface MitigationStrategy {
  strategyID: string;
  name: string;
  description: string;
  cost: number;
  effectiveness: number; // 0-100
  implementationTime: number; // in days
  maintenanceRequired: boolean;
  status: StrategyStatus;
  riskFactors: string[]; // Risk factor IDs
}

export interface CoverageDetails {
  propertyDamage: boolean;
  liability: boolean;
  naturalDisasters: boolean;
  theft: boolean;
  vandalism: boolean;
  fire: boolean;
  flood: boolean;
  earthquake: boolean;
  windstorm: boolean;
  hail: boolean;
  coverageLimits: Record<string, number>;
  exclusions: string[];
  additionalCoverage: string[];
}

export interface ClaimDocument {
  documentID: string;
  name: string;
  type: DocumentType;
  url: string;
  uploadedDate: number;
  size: number;
  status: DocumentStatus;
}

export interface InsuranceProvider {
  providerID: string;
  name: string;
  contactInfo: ContactInfo;
  rating: number; // 1-5
  specialties: string[];
  coverageTypes: InsuranceType[];
  claimsProcess: string;
  averageProcessingTime: number; // in days
  customerSatisfaction: number; // 0-100
  financialStrength: string;
  status: ProviderStatus;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  website: string;
  emergencyContact: string;
}

export interface InsuranceQuote {
  quoteID: string;
  propertyID: number;
  providerID: string;
  policyType: InsuranceType;
  coverageAmount: number;
  premium: number;
  deductible: number;
  coverageDetails: CoverageDetails;
  validUntil: number;
  terms: string[];
  exclusions: string[];
  status: QuoteStatus;
  generatedDate: number;
}

export interface InsuranceEvent {
  eventID: string;
  type: InsuranceEventType;
  propertyID: number;
  policyID?: string;
  claimID?: string;
  severity: EventSeverity;
  message: string;
  data: any;
  timestamp: number;
  acknowledged: boolean;
  actionRequired: boolean;
}

export interface InsuranceMetrics {
  totalPolicies: number;
  activePolicies: number;
  totalCoverage: number;
  totalPremiums: number;
  totalClaims: number;
  openClaims: number;
  averageClaimAmount: number;
  averageProcessingTime: number;
  riskScore: number;
  lastUpdated: number;
}

export interface InsuranceConfig {
  autoRenewal: boolean;
  claimNotificationThreshold: number;
  riskAssessmentFrequency: number; // in days
  policyExpiryWarning: number; // in days
  defaultProviders: string[];
  riskThresholds: {
    low: number;
    medium: number;
    high: number;
  };
  features: {
    autoQuotes: boolean;
    riskMonitoring: boolean;
    claimAutomation: boolean;
    policyManagement: boolean;
  };
}

export interface InsuranceDashboard {
  dashboardID: string;
  name: string;
  widgets: InsuranceWidget[];
  layout: DashboardLayout;
  filters: InsuranceFilter;
  lastUpdated: number;
}

export interface InsuranceWidget {
  widgetID: string;
  type: 'policy_summary' | 'claims_overview' | 'risk_assessment' | 'premium_tracker';
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

export interface InsuranceFilter {
  dateRange: {
    start: number;
    end: number;
  };
  policyTypes: InsuranceType[];
  providers: string[];
  status: PolicyStatus[];
  riskLevels: RiskLevel[];
}

// Enums
export enum InsuranceType {
  HOMEOWNERS = 'homeowners',
  RENTAL = 'rental',
  COMMERCIAL = 'commercial',
  LIABILITY = 'liability',
  FLOOD = 'flood',
  EARTHQUAKE = 'earthquake',
  UMBRELLA = 'umbrella'
}

export enum PolicyStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

export enum ClaimType {
  PROPERTY_DAMAGE = 'property_damage',
  LIABILITY = 'liability',
  THEFT = 'theft',
  NATURAL_DISASTER = 'natural_disaster',
  FIRE = 'fire',
  WATER_DAMAGE = 'water_damage',
  VANDALISM = 'vandalism'
}

export enum ClaimStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  DENIED = 'denied',
  PAID = 'paid',
  CLOSED = 'closed'
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum RiskCategory {
  NATURAL = 'natural',
  CRIMINAL = 'criminal',
  STRUCTURAL = 'structural',
  ENVIRONMENTAL = 'environmental',
  ECONOMIC = 'economic',
  LEGAL = 'legal'
}

export enum RiskImpact {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum RiskSeverity {
  MINOR = 'minor',
  MODERATE = 'moderate',
  MAJOR = 'major',
  SEVERE = 'severe'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum FactorStatus {
  IDENTIFIED = 'identified',
  ASSESSED = 'assessed',
  MITIGATED = 'mitigated',
  MONITORED = 'monitored',
  RESOLVED = 'resolved'
}

export enum StrategyStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum AssessmentStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue'
}

export enum DocumentType {
  PHOTO = 'photo',
  RECEIPT = 'receipt',
  INVOICE = 'invoice',
  REPORT = 'report',
  CONTRACT = 'contract',
  OTHER = 'other'
}

export enum DocumentStatus {
  UPLOADED = 'uploaded',
  PROCESSING = 'processing',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum ProviderStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export enum QuoteStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export enum InsuranceEventType {
  POLICY_EXPIRY = 'policy_expiry',
  CLAIM_SUBMITTED = 'claim_submitted',
  CLAIM_APPROVED = 'claim_approved',
  CLAIM_DENIED = 'claim_denied',
  RISK_ALERT = 'risk_alert',
  PREMIUM_DUE = 'premium_due',
  COVERAGE_CHANGE = 'coverage_change'
}

export enum EventSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// State and Actions
export interface InsuranceState {
  policies: InsurancePolicy[];
  claims: InsuranceClaim[];
  riskAssessments: RiskAssessment[];
  providers: InsuranceProvider[];
  quotes: InsuranceQuote[];
  events: InsuranceEvent[];
  metrics: InsuranceMetrics | null;
  config: InsuranceConfig | null;
  loading: boolean;
  error?: string;
}

export interface InsuranceActions {
  // Policy Management
  createPolicy: (policy: Partial<InsurancePolicy>) => Promise<string>;
  updatePolicy: (policyID: string, updates: Partial<InsurancePolicy>) => Promise<boolean>;
  cancelPolicy: (policyID: string) => Promise<boolean>;
  renewPolicy: (policyID: string) => Promise<boolean>;
  getPolicy: (policyID: string) => Promise<InsurancePolicy>;
  getPolicies: (filters?: InsuranceFilter) => Promise<InsurancePolicy[]>;
  
  // Claims Management
  submitClaim: (claim: Partial<InsuranceClaim>) => Promise<string>;
  updateClaim: (claimID: string, updates: Partial<InsuranceClaim>) => Promise<boolean>;
  getClaim: (claimID: string) => Promise<InsuranceClaim>;
  getClaims: (filters?: InsuranceFilter) => Promise<InsuranceClaim[]>;
  uploadClaimDocument: (claimID: string, document: File) => Promise<string>;
  
  // Risk Assessment
  assessRisk: (propertyID: number) => Promise<RiskAssessment>;
  updateRiskAssessment: (assessmentID: string, updates: Partial<RiskAssessment>) => Promise<boolean>;
  getRiskAssessment: (propertyID: number) => Promise<RiskAssessment>;
  getRiskAssessments: (filters?: InsuranceFilter) => Promise<RiskAssessment[]>;
  
  // Provider Management
  getProviders: () => Promise<InsuranceProvider[]>;
  getProvider: (providerID: string) => Promise<InsuranceProvider>;
  compareProviders: (providerIDs: string[]) => Promise<InsuranceProvider[]>;
  
  // Quote Management
  generateQuote: (propertyID: number, policyType: InsuranceType) => Promise<InsuranceQuote[]>;
  acceptQuote: (quoteID: string) => Promise<boolean>;
  getQuotes: (propertyID: number) => Promise<InsuranceQuote[]>;
  
  // Event Management
  subscribeToEvents: (callback: (event: InsuranceEvent) => void) => void;
  acknowledgeEvent: (eventID: string) => Promise<boolean>;
  getEvents: (filters?: InsuranceFilter) => Promise<InsuranceEvent[]>;
  
  // Configuration
  updateConfig: (config: Partial<InsuranceConfig>) => Promise<boolean>;
  getConfig: () => Promise<InsuranceConfig>;
  
  // Metrics and Reporting
  getMetrics: () => Promise<InsuranceMetrics>;
  generateReport: (type: string, filters: InsuranceFilter) => Promise<any>;
}
