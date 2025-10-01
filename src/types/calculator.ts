export interface CalculatorInputs {
  propertyPrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  propertyTax: number;
  homeInsurance: number;
  pmi: number;
  hoa: number;
  monthlyIncome: number;
  monthlyDebts: number;
  creditScore: number;
}

export interface MortgageCalculation {
  monthlyPayment: number;
  principalAndInterest: number;
  propertyTax: number;
  homeInsurance: number;
  pmi: number;
  hoa: number;
  totalMonthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  loanAmount: number;
  downPaymentPercent: number;
  loanToValue: number;
  debtToIncome: number;
  paymentToIncome: number;
}

export interface AffordabilityCalculation {
  maxAffordablePrice: number;
  maxMonthlyPayment: number;
  recommendedDownPayment: number;
  loanAmount: number;
  monthlyPayment: number;
  debtToIncomeRatio: number;
  paymentToIncomeRatio: number;
  isAffordable: boolean;
  affordabilityScore: number;
}

export interface AmortizationSchedule {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}

export interface CalculatorResults {
  mortgage: MortgageCalculation;
  affordability: AffordabilityCalculation;
  amortizationSchedule: AmortizationSchedule[];
  summary: {
    totalPayments: number;
    totalInterest: number;
    totalPrincipal: number;
    payoffDate: Date;
    interestSavings: number;
  };
}

export interface CalculatorSettings {
  defaultInterestRate: number;
  defaultLoanTerm: number;
  defaultDownPaymentPercent: number;
  maxDebtToIncomeRatio: number;
  maxPaymentToIncomeRatio: number;
  propertyTaxRate: number;
  insuranceRate: number;
  pmiRate: number;
}

export interface CalculatorPreset {
  id: string;
  name: string;
  description: string;
  inputs: Partial<CalculatorInputs>;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalculatorAnalytics {
  totalCalculations: number;
  averagePropertyPrice: number;
  averageInterestRate: number;
  averageLoanTerm: number;
  calculationsByMonth: Array<{
    month: string;
    count: number;
  }>;
  popularPresets: Array<{
    presetId: string;
    presetName: string;
    usageCount: number;
  }>;
  userMetrics: {
    totalUsers: number;
    activeUsers: number;
    averageCalculationsPerUser: number;
  };
}

export interface CalculatorExport {
  format: 'pdf' | 'excel' | 'csv';
  includeAmortization: boolean;
  includeCharts: boolean;
  customTitle?: string;
}

export interface CalculatorComparison {
  id: string;
  name: string;
  scenarios: Array<{
    name: string;
    inputs: CalculatorInputs;
    results: CalculatorResults;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
