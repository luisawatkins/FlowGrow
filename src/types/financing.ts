export interface MortgageCalculator {
  loanAmount: number;
  interestRate: number;
  loanTerm: number; // in years
  downPayment: number;
  propertyTax: number;
  insurance: number;
  pmi: number; // Private Mortgage Insurance
  hoa: number; // Homeowners Association fees
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  amortizationSchedule: AmortizationEntry[];
}

export interface AmortizationEntry {
  paymentNumber: number;
  paymentDate: string;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
  remainingBalance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}

export interface Lender {
  id: string;
  name: string;
  logo?: string;
  website: string;
  phone: string;
  email: string;
  description: string;
  specialties: string[];
  loanTypes: LoanType[];
  minLoanAmount: number;
  maxLoanAmount: number;
  minCreditScore: number;
  maxLtv: number; // Loan-to-Value ratio
  processingTime: string;
  fees: LenderFee[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isActive: boolean;
  locations: string[];
  languages: string[];
  features: string[];
  socialMedia: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface LoanType {
  id: string;
  name: string;
  description: string;
  interestRateType: 'fixed' | 'variable' | 'hybrid';
  minTerm: number;
  maxTerm: number;
  minDownPayment: number;
  maxDownPayment: number;
  eligibilityRequirements: string[];
  benefits: string[];
  drawbacks: string[];
  isPopular: boolean;
}

export interface LenderFee {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  amount: number;
  description: string;
  isRequired: boolean;
  isRefundable: boolean;
}

export interface LoanApplication {
  id: string;
  borrowerId: string;
  lenderId: string;
  propertyId: string;
  loanType: string;
  loanAmount: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  monthlyIncome: number;
  creditScore: number;
  debtToIncomeRatio: number;
  employmentStatus: 'employed' | 'self-employed' | 'unemployed' | 'retired';
  employmentHistory: EmploymentHistory[];
  assets: Asset[];
  liabilities: Liability[];
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected' | 'withdrawn';
  submittedDate?: string;
  approvedDate?: string;
  rejectionReason?: string;
  documents: Document[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmploymentHistory {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  monthlyIncome: number;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'self-employed';
  industry: string;
}

export interface Asset {
  id: string;
  type: 'checking' | 'savings' | 'investment' | 'retirement' | 'property' | 'vehicle' | 'other';
  name: string;
  value: number;
  description?: string;
  isLiquid: boolean;
}

export interface Liability {
  id: string;
  type: 'credit-card' | 'loan' | 'mortgage' | 'student-loan' | 'auto-loan' | 'other';
  name: string;
  balance: number;
  monthlyPayment: number;
  interestRate: number;
  description?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'income' | 'asset' | 'liability' | 'identity' | 'property' | 'other';
  status: 'required' | 'uploaded' | 'verified' | 'rejected';
  uploadedDate?: string;
  verifiedDate?: string;
  rejectionReason?: string;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
}

export interface CreditAssessment {
  id: string;
  borrowerId: string;
  creditScore: number;
  creditBureau: 'experian' | 'equifax' | 'transunion' | 'composite';
  reportDate: string;
  factors: CreditFactor[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  estimatedRate: number;
  preQualificationAmount: number;
}

export interface CreditFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  weight: number;
}

export interface FinancingOption {
  id: string;
  lenderId: string;
  loanType: string;
  loanAmount: number;
  interestRate: number;
  apr: number;
  loanTerm: number;
  monthlyPayment: number;
  totalCost: number;
  downPayment: number;
  closingCosts: number;
  fees: LenderFee[];
  features: string[];
  benefits: string[];
  requirements: string[];
  isRecommended: boolean;
  comparisonScore: number;
}

export interface FinancingComparison {
  id: string;
  borrowerId: string;
  propertyId: string;
  loanAmount: number;
  downPayment: number;
  options: FinancingOption[];
  selectedOption?: string;
  comparisonDate: string;
  notes: string;
}

export interface PreQualification {
  id: string;
  borrowerId: string;
  propertyId: string;
  estimatedLoanAmount: number;
  estimatedDownPayment: number;
  estimatedInterestRate: number;
  estimatedMonthlyPayment: number;
  debtToIncomeRatio: number;
  loanToValueRatio: number;
  creditScore: number;
  status: 'qualified' | 'not-qualified' | 'conditional';
  conditions?: string[];
  validUntil: string;
  createdAt: string;
}

export interface LoanTracker {
  id: string;
  applicationId: string;
  borrowerId: string;
  lenderId: string;
  status: 'application-submitted' | 'document-review' | 'underwriting' | 'conditional-approval' | 'final-approval' | 'closing-scheduled' | 'closed' | 'rejected';
  currentStep: string;
  nextStep: string;
  progress: number; // 0-100
  estimatedCompletionDate?: string;
  milestones: LoanMilestone[];
  documents: Document[];
  communications: Communication[];
  lastUpdated: string;
}

export interface LoanMilestone {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  dueDate?: string;
  completedDate?: string;
  assignedTo: string;
  notes?: string;
}

export interface Communication {
  id: string;
  type: 'email' | 'phone' | 'meeting' | 'document' | 'system';
  subject: string;
  message: string;
  from: string;
  to: string;
  date: string;
  isRead: boolean;
  attachments?: string[];
}

export interface FinancingDashboard {
  borrowerId: string;
  applications: LoanApplication[];
  preQualifications: PreQualification[];
  comparisons: FinancingComparison[];
  trackers: LoanTracker[];
  creditAssessment: CreditAssessment | null;
  recommendations: {
    loanTypes: string[];
    lenders: string[];
    improvements: string[];
  };
  marketInsights: {
    averageRates: {
      '30-year-fixed': number;
      '15-year-fixed': number;
      '5-1-arm': number;
    };
    rateTrend: 'up' | 'down' | 'stable';
    marketConditions: string;
  };
}

export interface FinancingSearchFilters {
  loanAmount?: {
    min: number;
    max: number;
  };
  downPayment?: {
    min: number;
    max: number;
  };
  creditScore?: {
    min: number;
    max: number;
  };
  loanTypes?: string[];
  lenders?: string[];
  locations?: string[];
  features?: string[];
  maxFees?: number;
  maxProcessingTime?: number;
}

export interface RateAlert {
  id: string;
  borrowerId: string;
  loanType: string;
  targetRate: number;
  currentRate: number;
  isActive: boolean;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  createdAt: string;
  lastTriggered?: string;
}
