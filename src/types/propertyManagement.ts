// Property Management Types and Interfaces

export interface PropertyManagement {
  propertyId: number;
  owner: string;
  manager?: string;
  rentAmount: number;
  rentDueDate: number;
  maintenanceFund: number;
  isActive: boolean;
  createdAt: number;
  lastRentCollection?: number;
  tenantCount: number;
  totalRevenue: number;
  maintenanceRequests: number[];
}

export interface TenantInfo {
  tenantId: number;
  propertyId: number;
  tenantAddress: string;
  leaseStartDate: number;
  leaseEndDate: number;
  monthlyRent: number;
  securityDeposit: number;
  isActive: boolean;
  paymentHistory: PaymentRecord[];
  maintenanceRequests: number[];
}

export interface PaymentRecord {
  paymentId: number;
  amount: number;
  paymentDate: number;
  paymentType: string;
  isLate: boolean;
  lateFee: number;
}

export interface MaintenanceRequest {
  requestId: number;
  propertyId: number;
  tenantId?: number;
  description: string;
  priority: MaintenancePriority;
  estimatedCost: number;
  status: MaintenanceStatus;
  createdAt: number;
  completedAt?: number;
  assignedVendor?: string;
  actualCost?: number;
}

export interface AutomationTask {
  taskId: number;
  taskType: AutomationTaskType;
  propertyId: number;
  owner: string;
  schedule: AutomationSchedule;
  isActive: boolean;
  lastExecuted?: number;
  nextExecution: number;
  executionCount: number;
  successCount: number;
  failureCount: number;
  parameters: Record<string, string>;
}

export interface AutomationSchedule {
  scheduleType: ScheduleType;
  interval: number; // seconds
  startTime: number;
  endTime?: number;
  timezone: string;
  customSchedule?: Record<string, string>;
}

export interface AutomationResult {
  taskId: number;
  executionTime: number;
  success: boolean;
  message: string;
  data: Record<string, string>;
  gasUsed: number;
  executionDuration: number;
}

export interface TenantProfile {
  tenantId: number;
  address: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: number;
  ssn: string;
  employmentInfo: EmploymentInfo;
  creditScore: number;
  income: number;
  references: Reference[];
  verificationStatus: VerificationStatus;
  kycStatus: KYCStatus;
  amlStatus: AMLStatus;
  riskScore: number;
  reputationScore: number;
  createdAt: number;
  lastUpdated: number;
  isActive: boolean;
}

export interface EmploymentInfo {
  employer: string;
  position: string;
  startDate: number;
  salary: number;
  employmentType: EmploymentType;
  employerContact: string;
  isVerified: boolean;
}

export interface Reference {
  referenceId: number;
  name: string;
  relationship: string;
  contact: string;
  isVerified: boolean;
  rating: number;
}

export interface LeaseAgreement {
  leaseId: number;
  tenantId: number;
  propertyId: number;
  landlordAddress: string;
  startDate: number;
  endDate: number;
  monthlyRent: number;
  securityDeposit: number;
  petDeposit: number;
  lateFee: number;
  leaseTerms: Record<string, string>;
  status: LeaseStatus;
  createdAt: number;
  signedAt?: number;
  terminatedAt?: number;
  terminationReason?: string;
}

export interface TenantCommunication {
  communicationId: number;
  tenantId: number;
  propertyId: number;
  sender: string;
  recipient: string;
  messageType: CommunicationType;
  subject: string;
  message: string;
  timestamp: number;
  isRead: boolean;
  priority: CommunicationPriority;
}

export interface PropertyPerformance {
  occupancyRate: number;
  revenuePerMonth: number;
  maintenanceRatio: number;
  totalRevenue: number;
  maintenanceCost: number;
}

export interface AutomationStats {
  totalTasks: number;
  activeTasks: number;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
}

// Enums
export enum MaintenancePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum MaintenanceStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum AutomationTaskType {
  RENT_COLLECTION = 'RENT_COLLECTION',
  MAINTENANCE_REMINDER = 'MAINTENANCE_REMINDER',
  LEASE_RENEWAL = 'LEASE_RENEWAL',
  PROPERTY_INSPECTION = 'PROPERTY_INSPECTION',
  UTILITY_PAYMENT = 'UTILITY_PAYMENT',
  MARKET_ANALYSIS = 'MARKET_ANALYSIS',
  TENANT_COMMUNICATION = 'TENANT_COMMUNICATION',
  SECURITY_CHECK = 'SECURITY_CHECK'
}

export enum ScheduleType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM'
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

export enum KYCStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

export enum AMLStatus {
  PENDING = 'PENDING',
  CLEAR = 'CLEAR',
  FLAGGED = 'FLAGGED',
  BLOCKED = 'BLOCKED'
}

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  SELF_EMPLOYED = 'SELF_EMPLOYED',
  UNEMPLOYED = 'UNEMPLOYED'
}

export enum LeaseStatus {
  DRAFT = 'DRAFT',
  PENDING_SIGNATURE = 'PENDING_SIGNATURE',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  TERMINATED = 'TERMINATED',
  RENEWED = 'RENEWED'
}

export enum CommunicationType {
  RENT_REMINDER = 'RENT_REMINDER',
  MAINTENANCE_UPDATE = 'MAINTENANCE_UPDATE',
  LEASE_NOTICE = 'LEASE_NOTICE',
  GENERAL = 'GENERAL',
  EMERGENCY = 'EMERGENCY',
  INSPECTION_NOTICE = 'INSPECTION_NOTICE'
}

export enum CommunicationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

// API Response Types
export interface PropertyManagementResponse {
  success: boolean;
  data?: PropertyManagement;
  error?: string;
}

export interface TenantResponse {
  success: boolean;
  data?: TenantInfo;
  error?: string;
}

export interface MaintenanceResponse {
  success: boolean;
  data?: MaintenanceRequest;
  error?: string;
}

export interface AutomationResponse {
  success: boolean;
  data?: AutomationTask;
  error?: string;
}

export interface PropertyPerformanceResponse {
  success: boolean;
  data?: PropertyPerformance;
  error?: string;
}

// Form Types
export interface PropertyRegistrationForm {
  propertyId: number;
  manager?: string;
  rentAmount: number;
  rentDueDate: number;
  maintenanceFund: number;
}

export interface TenantRegistrationForm {
  tenantId: number;
  address: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: number;
  ssn: string;
  employmentInfo: EmploymentInfo;
  creditScore: number;
  income: number;
  references: Reference[];
}

export interface MaintenanceRequestForm {
  requestId: number;
  propertyId: number;
  tenantId?: number;
  description: string;
  priority: MaintenancePriority;
  estimatedCost: number;
}

export interface AutomationTaskForm {
  taskId: number;
  taskType: AutomationTaskType;
  propertyId: number;
  schedule: AutomationSchedule;
  parameters: Record<string, string>;
}

export interface LeaseAgreementForm {
  leaseId: number;
  tenantId: number;
  propertyId: number;
  landlordAddress: string;
  startDate: number;
  endDate: number;
  monthlyRent: number;
  securityDeposit: number;
  petDeposit: number;
  lateFee: number;
  leaseTerms: Record<string, string>;
}

// Filter and Search Types
export interface PropertyManagementFilters {
  isActive?: boolean;
  minRentAmount?: number;
  maxRentAmount?: number;
  hasTenants?: boolean;
  maintenanceRequired?: boolean;
}

export interface TenantFilters {
  isActive?: boolean;
  verificationStatus?: VerificationStatus;
  minCreditScore?: number;
  maxRiskScore?: number;
  hasActiveLease?: boolean;
}

export interface MaintenanceFilters {
  status?: MaintenanceStatus;
  priority?: MaintenancePriority;
  propertyId?: number;
  tenantId?: number;
  dateRange?: {
    start: number;
    end: number;
  };
}

export interface AutomationFilters {
  taskType?: AutomationTaskType;
  isActive?: boolean;
  propertyId?: number;
  scheduleType?: ScheduleType;
}

// Analytics Types
export interface PropertyAnalytics {
  totalProperties: number;
  activeProperties: number;
  totalTenants: number;
  activeTenants: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalMaintenanceCost: number;
  averageOccupancyRate: number;
  averageRentAmount: number;
  pendingMaintenanceRequests: number;
  overdueRentPayments: number;
}

export interface TenantAnalytics {
  totalTenants: number;
  verifiedTenants: number;
  activeLeases: number;
  expiringLeases: number;
  averageCreditScore: number;
  averageRiskScore: number;
  averageReputationScore: number;
  pendingVerifications: number;
}

export interface AutomationAnalytics {
  totalTasks: number;
  activeTasks: number;
  totalExecutions: number;
  successRate: number;
  averageExecutionTime: number;
  totalGasUsed: number;
  mostCommonTaskType: AutomationTaskType;
  tasksByProperty: Record<number, number>;
}

// Event Types
export interface PropertyManagementEvent {
  type: string;
  timestamp: number;
  propertyId: number;
  tenantId?: number;
  data: Record<string, any>;
}

export interface AutomationEvent {
  type: string;
  timestamp: number;
  taskId: number;
  propertyId: number;
  result: AutomationResult;
}

export interface TenantEvent {
  type: string;
  timestamp: number;
  tenantId: number;
  propertyId: number;
  data: Record<string, any>;
}

// Notification Types
export interface PropertyManagementNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: number;
  propertyId: number;
  tenantId?: number;
  priority: CommunicationPriority;
  isRead: boolean;
  actionRequired?: boolean;
  actionUrl?: string;
}

// Dashboard Types
export interface PropertyManagementDashboard {
  properties: PropertyManagement[];
  tenants: TenantInfo[];
  maintenanceRequests: MaintenanceRequest[];
  automationTasks: AutomationTask[];
  analytics: PropertyAnalytics;
  recentEvents: PropertyManagementEvent[];
  notifications: PropertyManagementNotification[];
}

// Error Types
export interface PropertyManagementError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: number;
  propertyId?: number;
  tenantId?: number;
}

// Configuration Types
export interface PropertyManagementConfig {
  defaultRentDueDate: number; // days from start of month
  lateFeePercentage: number;
  maintenanceFundPercentage: number;
  maxTenantsPerProperty: number;
  defaultLeaseDuration: number; // days
  automationEnabled: boolean;
  notificationsEnabled: boolean;
  auditLoggingEnabled: boolean;
}