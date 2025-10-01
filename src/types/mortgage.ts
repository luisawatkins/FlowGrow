// Mortgage Calculator Types
// Comprehensive type definitions for mortgage calculations and financing

export interface MortgageCalculation {
  id: string;
  propertyId: string;
  loanAmount: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number; // in years
  propertyTax: number;
  homeInsurance: number;
  pmi: number; // Private Mortgage Insurance
  hoaFees: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface AmortizationSchedule {
  id: string;
  calculationId: string;
  payments: AmortizationPayment[];
  totalPayments: number;
  totalInterest: number;
  totalPrincipal: number;
  createdAt: string;
}

export interface AmortizationPayment {
  paymentNumber: number;
  paymentDate: string;
  monthlyPayment: number;
  principalPayment: number;
  interestPayment: number;
  remainingBalance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}

export interface LoanProduct {
  id: string;
  name: string;
  type: LoanType;
  lender: string;
  interestRate: number;
  apr: number;
  minDownPayment: number;
  maxLoanAmount: number;
  minCreditScore: number;
  maxLoanTerm: number;
  minLoanTerm: number;
  features: string[];
  requirements: string[];
  isConventional: boolean;
  isGovernment: boolean;
  isJumbo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AffordabilityCalculation {
  id: string;
  annualIncome: number;
  monthlyDebt: number;
  downPayment: number;
  creditScore: number;
  maxLoanAmount: number;
  maxHomePrice: number;
  recommendedLoanAmount: number;
  recommendedHomePrice: number;
  debtToIncomeRatio: number;
  frontEndRatio: number;
  backEndRatio: number;
  createdAt: string;
}

export interface RefinanceAnalysis {
  id: string;
  currentLoan: {
    balance: number;
    interestRate: number;
    remainingTerm: number;
    monthlyPayment: number;
  };
  newLoan: {
    loanAmount: number;
    interestRate: number;
    term: number;
    monthlyPayment: number;
  };
  savings: {
    monthlySavings: number;
    totalSavings: number;
    breakEvenMonths: number;
    totalInterestSavings: number;
  };
  costs: {
    closingCosts: number;
    appraisalFee: number;
    titleInsurance: number;
    otherFees: number;
  };
  recommendation: RefinanceRecommendation;
  createdAt: string;
}

export interface DownPaymentCalculator {
  id: string;
  homePrice: number;
  downPaymentPercentage: number;
  downPaymentAmount: number;
  loanAmount: number;
  pmiRequired: boolean;
  pmiCost: number;
  firstTimeBuyer: boolean;
  assistancePrograms: AssistanceProgram[];
  createdAt: string;
}

export interface AssistanceProgram {
  id: string;
  name: string;
  type: AssistanceType;
  description: string;
  eligibilityRequirements: string[];
  benefits: string[];
  applicationProcess: string[];
  contactInfo: {
    website: string;
    phone: string;
    email: string;
  };
  isActive: boolean;
}

export interface MortgageComparison {
  id: string;
  propertyId: string;
  scenarios: MortgageScenario[];
  bestOption: string;
  comparisonDate: string;
  notes: string;
  createdAt: string;
}

export interface MortgageScenario {
  id: string;
  name: string;
  loanAmount: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  pros: string[];
  cons: string[];
  recommendation: string;
}

export interface PreApprovalRequest {
  id: string;
  borrowerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    ssn: string; // Encrypted
    dateOfBirth: string;
  };
  employmentInfo: {
    employer: string;
    jobTitle: string;
    annualIncome: number;
    employmentLength: number;
    employmentType: EmploymentType;
  };
  financialInfo: {
    monthlyIncome: number;
    monthlyDebt: number;
    assets: number;
    liabilities: number;
    creditScore: number;
  };
  propertyInfo: {
    estimatedPrice: number;
    downPayment: number;
    propertyType: PropertyType;
    occupancyType: OccupancyType;
  };
  status: PreApprovalStatus;
  preApprovalAmount?: number;
  expirationDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MortgageApplication {
  id: string;
  preApprovalId: string;
  propertyId: string;
  loanProductId: string;
  borrowerInfo: BorrowerInfo;
  coBorrowerInfo?: BorrowerInfo;
  propertyInfo: PropertyInfo;
  loanInfo: LoanInfo;
  documents: DocumentInfo[];
  status: ApplicationStatus;
  milestones: ApplicationMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface BorrowerInfo {
  personalInfo: {
    firstName: string;
    lastName: string;
    middleName?: string;
    ssn: string; // Encrypted
    dateOfBirth: string;
    maritalStatus: MaritalStatus;
    dependents: number;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: Address;
  };
  employmentInfo: {
    employer: string;
    jobTitle: string;
    startDate: string;
    annualIncome: number;
    employmentType: EmploymentType;
    workAddress: Address;
  };
  financialInfo: {
    monthlyIncome: number;
    monthlyDebt: number;
    assets: Asset[];
    liabilities: Liability[];
    creditScore: number;
  };
}

export interface PropertyInfo {
  address: Address;
  propertyType: PropertyType;
  occupancyType: OccupancyType;
  purchasePrice: number;
  downPayment: number;
  loanAmount: number;
  propertyTax: number;
  homeInsurance: number;
  hoaFees: number;
  appraisalValue?: number;
  inspectionDate?: string;
  closingDate?: string;
}

export interface LoanInfo {
  loanProductId: string;
  interestRate: number;
  apr: number;
  loanTerm: number;
  loanType: LoanType;
  monthlyPayment: number;
  pmi: number;
  closingCosts: number;
  totalCost: number;
}

export interface DocumentInfo {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  uploadedAt?: string;
  url?: string;
  required: boolean;
  description: string;
}

export interface ApplicationMilestone {
  id: string;
  name: string;
  status: MilestoneStatus;
  completedAt?: string;
  dueDate?: string;
  description: string;
  documents: string[];
}

// Enums
export enum LoanType {
  CONVENTIONAL = 'conventional',
  FHA = 'fha',
  VA = 'va',
  USDA = 'usda',
  JUMBO = 'jumbo',
  ARM = 'arm',
  FIXED = 'fixed'
}

export enum PropertyType {
  SINGLE_FAMILY = 'single_family',
  CONDO = 'condo',
  TOWNHOUSE = 'townhouse',
  MULTI_FAMILY = 'multi_family',
  MANUFACTURED = 'manufactured',
  COOP = 'coop'
}

export enum OccupancyType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  INVESTMENT = 'investment'
}

export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  SELF_EMPLOYED = 'self_employed',
  CONTRACT = 'contract',
  RETIRED = 'retired',
  UNEMPLOYED = 'unemployed'
}

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
  SEPARATED = 'separated'
}

export enum PreApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DENIED = 'denied',
  EXPIRED = 'expired',
  WITHDRAWN = 'withdrawn'
}

export enum ApplicationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  CONDITIONAL_APPROVAL = 'conditional_approval',
  DENIED = 'denied',
  WITHDRAWN = 'withdrawn',
  CLOSED = 'closed'
}

export enum DocumentType {
  INCOME_VERIFICATION = 'income_verification',
  BANK_STATEMENTS = 'bank_statements',
  TAX_RETURNS = 'tax_returns',
  EMPLOYMENT_VERIFICATION = 'employment_verification',
  CREDIT_REPORT = 'credit_report',
  APPRAISAL = 'appraisal',
  TITLE_INSURANCE = 'title_insurance',
  HOMEOWNERS_INSURANCE = 'homeowners_insurance',
  SURVEY = 'survey',
  OTHER = 'other'
}

export enum DocumentStatus {
  REQUIRED = 'required',
  UPLOADED = 'uploaded',
  REVIEWED = 'reviewed',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum MilestoneStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue'
}

export enum RefinanceRecommendation {
  RECOMMENDED = 'recommended',
  NOT_RECOMMENDED = 'not_recommended',
  CONSIDER = 'consider',
  WAIT = 'wait'
}

export enum AssistanceType {
  DOWN_PAYMENT = 'down_payment',
  CLOSING_COSTS = 'closing_costs',
  INTEREST_RATE = 'interest_rate',
  FIRST_TIME_BUYER = 'first_time_buyer',
  LOW_INCOME = 'low_income',
  VETERAN = 'veteran',
  TEACHER = 'teacher',
  HEALTHCARE_WORKER = 'healthcare_worker'
}

// Supporting interfaces
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Asset {
  id: string;
  type: AssetType;
  description: string;
  value: number;
  isLiquid: boolean;
}

export interface Liability {
  id: string;
  type: LiabilityType;
  description: string;
  balance: number;
  monthlyPayment: number;
  creditor: string;
}

export enum AssetType {
  CHECKING_ACCOUNT = 'checking_account',
  SAVINGS_ACCOUNT = 'savings_account',
  INVESTMENT_ACCOUNT = 'investment_account',
  RETIREMENT_ACCOUNT = 'retirement_account',
  REAL_ESTATE = 'real_estate',
  VEHICLE = 'vehicle',
  OTHER = 'other'
}

export enum LiabilityType {
  CREDIT_CARD = 'credit_card',
  AUTO_LOAN = 'auto_loan',
  STUDENT_LOAN = 'student_loan',
  PERSONAL_LOAN = 'personal_loan',
  MORTGAGE = 'mortgage',
  HELOC = 'heloc',
  OTHER = 'other'
}

// API Types
export interface MortgageCalculationRequest {
  propertyId?: string;
  loanAmount: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  propertyTax?: number;
  homeInsurance?: number;
  pmi?: number;
  hoaFees?: number;
}

export interface MortgageCalculationResponse {
  calculation: MortgageCalculation;
  amortizationSchedule?: AmortizationSchedule;
  affordability?: AffordabilityCalculation;
}

export interface AffordabilityRequest {
  annualIncome: number;
  monthlyDebt: number;
  downPayment: number;
  creditScore: number;
  interestRate?: number;
  loanTerm?: number;
}

export interface RefinanceRequest {
  currentBalance: number;
  currentInterestRate: number;
  remainingTerm: number;
  newInterestRate: number;
  newTerm: number;
  closingCosts: number;
}

export interface LoanComparisonRequest {
  propertyId: string;
  scenarios: MortgageScenario[];
}

export interface PreApprovalRequestData {
  borrowerInfo: PreApprovalRequest['borrowerInfo'];
  employmentInfo: PreApprovalRequest['employmentInfo'];
  financialInfo: PreApprovalRequest['financialInfo'];
  propertyInfo: PreApprovalRequest['propertyInfo'];
}

// Hook Types
export interface UseMortgageCalculatorReturn {
  calculation: MortgageCalculation | null;
  amortizationSchedule: AmortizationSchedule | null;
  loading: boolean;
  error: string | null;
  calculateMortgage: (request: MortgageCalculationRequest) => Promise<void>;
  calculateAffordability: (request: AffordabilityRequest) => Promise<void>;
  compareLoans: (request: LoanComparisonRequest) => Promise<void>;
  clearError: () => void;
}

export interface UseLoanProductsReturn {
  loanProducts: LoanProduct[];
  loading: boolean;
  error: string | null;
  getLoanProducts: (filters?: any) => Promise<void>;
  getLoanProduct: (id: string) => Promise<LoanProduct | null>;
  clearError: () => void;
}

export interface UsePreApprovalReturn {
  preApproval: PreApprovalRequest | null;
  loading: boolean;
  error: string | null;
  submitPreApproval: (data: PreApprovalRequestData) => Promise<void>;
  getPreApprovalStatus: (id: string) => Promise<void>;
  clearError: () => void;
}

// Error Types
export interface MortgageError {
  code: string;
  message: string;
  details?: any;
}

export interface MortgageApiError extends MortgageError {
  status: number;
  timestamp: string;
}
