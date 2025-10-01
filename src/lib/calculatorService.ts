import { 
  CalculatorInputs, 
  CalculatorResults, 
  MortgageCalculation, 
  AffordabilityCalculation, 
  AmortizationSchedule,
  CalculatorPreset,
  CalculatorAnalytics,
  CalculatorComparison
} from '@/types/calculator';

// Mock database
const calculations = new Map<string, CalculatorResults>();
const presets = new Map<string, CalculatorPreset>();
const comparisons = new Map<string, CalculatorComparison>();

// Initialize with some mock data
const mockPresets: CalculatorPreset[] = [
  {
    id: '1',
    name: 'First Time Buyer',
    description: 'Standard settings for first-time home buyers',
    inputs: {
      downPayment: 0,
      interestRate: 6.5,
      loanTerm: 30,
      propertyTax: 0,
      homeInsurance: 0,
      pmi: 0,
      hoa: 0,
      monthlyIncome: 0,
      monthlyDebts: 0,
      creditScore: 0,
    },
    isDefault: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Investment Property',
    description: 'Settings optimized for investment properties',
    inputs: {
      downPayment: 0,
      interestRate: 7.0,
      loanTerm: 30,
      propertyTax: 0,
      homeInsurance: 0,
      pmi: 0,
      hoa: 0,
      monthlyIncome: 0,
      monthlyDebts: 0,
      creditScore: 0,
    },
    isDefault: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Initialize mock data
mockPresets.forEach(preset => presets.set(preset.id, preset));

export class CalculatorService {
  // Mortgage calculation
  static calculateMortgage(inputs: CalculatorInputs): MortgageCalculation {
    const loanAmount = inputs.propertyPrice - inputs.downPayment;
    const monthlyInterestRate = inputs.interestRate / 100 / 12;
    const numberOfPayments = inputs.loanTerm * 12;

    // Calculate monthly mortgage payment (P&I)
    const principalAndInterest = loanAmount > 0 
      ? (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
      : 0;

    // Calculate additional costs
    const propertyTax = inputs.propertyTax / 12;
    const homeInsurance = inputs.homeInsurance / 12;
    const pmi = inputs.pmi / 12;
    const hoa = inputs.hoa / 12;

    // Calculate totals
    const monthlyPayment = principalAndInterest;
    const totalMonthlyPayment = monthlyPayment + propertyTax + homeInsurance + pmi + hoa;
    const totalInterest = (monthlyPayment * numberOfPayments) - loanAmount;
    const totalCost = inputs.propertyPrice + totalInterest;

    // Calculate ratios
    const downPaymentPercent = (inputs.downPayment / inputs.propertyPrice) * 100;
    const loanToValue = (loanAmount / inputs.propertyPrice) * 100;
    const debtToIncome = inputs.monthlyIncome > 0 ? (inputs.monthlyDebts / inputs.monthlyIncome) * 100 : 0;
    const paymentToIncome = inputs.monthlyIncome > 0 ? (totalMonthlyPayment / inputs.monthlyIncome) * 100 : 0;

    return {
      monthlyPayment,
      principalAndInterest,
      propertyTax,
      homeInsurance,
      pmi,
      hoa,
      totalMonthlyPayment,
      totalInterest,
      totalCost,
      loanAmount,
      downPaymentPercent,
      loanToValue,
      debtToIncome,
      paymentToIncome,
    };
  }

  // Affordability calculation
  static calculateAffordability(inputs: CalculatorInputs): AffordabilityCalculation {
    const maxDebtToIncomeRatio = 43; // Standard DTI limit
    const maxPaymentToIncomeRatio = 28; // Standard PTI limit

    // Calculate maximum monthly payment based on income
    const maxMonthlyPayment = Math.min(
      (inputs.monthlyIncome * maxPaymentToIncomeRatio / 100) - inputs.monthlyDebts,
      (inputs.monthlyIncome * maxDebtToIncomeRatio / 100) - inputs.monthlyDebts
    );

    // Estimate property tax and insurance (1.2% of property value annually)
    const estimatedPropertyTax = inputs.propertyPrice * 0.012 / 12;
    const estimatedInsurance = inputs.propertyPrice * 0.003 / 12;

    // Calculate maximum affordable price
    const monthlyRate = inputs.interestRate / 100 / 12;
    const numberOfPayments = inputs.loanTerm * 12;
    const availableForPandI = maxMonthlyPayment - estimatedPropertyTax - estimatedInsurance;
    
    const maxLoanAmount = availableForPandI > 0 
      ? (availableForPandI * (Math.pow(1 + monthlyRate, numberOfPayments) - 1)) / 
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))
      : 0;

    const maxAffordablePrice = maxLoanAmount / (1 - inputs.downPayment / inputs.propertyPrice);
    const recommendedDownPayment = maxAffordablePrice * 0.2; // 20% down payment
    const loanAmount = maxAffordablePrice - recommendedDownPayment;

    // Calculate actual monthly payment
    const monthlyPayment = loanAmount > 0 
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      : 0;

    const debtToIncomeRatio = inputs.monthlyIncome > 0 ? (inputs.monthlyDebts / inputs.monthlyIncome) * 100 : 0;
    const paymentToIncomeRatio = inputs.monthlyIncome > 0 ? (monthlyPayment / inputs.monthlyIncome) * 100 : 0;

    // Calculate affordability score (0-100)
    const affordabilityScore = Math.max(0, Math.min(100, 
      100 - (debtToIncomeRatio * 2) - (paymentToIncomeRatio * 2)
    ));

    return {
      maxAffordablePrice,
      maxMonthlyPayment,
      recommendedDownPayment,
      loanAmount,
      monthlyPayment,
      debtToIncomeRatio,
      paymentToIncomeRatio,
      isAffordable: debtToIncomeRatio <= maxDebtToIncomeRatio && paymentToIncomeRatio <= maxPaymentToIncomeRatio,
      affordabilityScore,
    };
  }

  // Amortization schedule
  static calculateAmortizationSchedule(inputs: CalculatorInputs): AmortizationSchedule[] {
    const loanAmount = inputs.propertyPrice - inputs.downPayment;
    const monthlyRate = inputs.interestRate / 100 / 12;
    const numberOfPayments = inputs.loanTerm * 12;

    const monthlyPayment = loanAmount > 0 
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      : 0;

    const schedule: AmortizationSchedule[] = [];
    let balance = loanAmount;
    let cumulativeInterest = 0;
    let cumulativePrincipal = 0;

    for (let month = 1; month <= numberOfPayments && balance > 0; month++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      const newBalance = Math.max(0, balance - principal);

      cumulativeInterest += interest;
      cumulativePrincipal += principal;

      schedule.push({
        month,
        payment: monthlyPayment,
        principal,
        interest,
        balance: newBalance,
        cumulativeInterest,
        cumulativePrincipal,
      });

      balance = newBalance;
    }

    return schedule;
  }

  // Complete calculation
  static calculateComplete(inputs: CalculatorInputs): CalculatorResults {
    const mortgage = this.calculateMortgage(inputs);
    const affordability = this.calculateAffordability(inputs);
    const amortizationSchedule = this.calculateAmortizationSchedule(inputs);

    const totalPayments = amortizationSchedule.length;
    const totalInterest = mortgage.totalInterest;
    const totalPrincipal = inputs.propertyPrice - inputs.downPayment;
    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + totalPayments);

    const summary = {
      totalPayments,
      totalInterest,
      totalPrincipal,
      payoffDate,
      interestSavings: 0, // Could calculate savings from extra payments
    };

    return {
      mortgage,
      affordability,
      amortizationSchedule,
      summary,
    };
  }

  // Preset operations
  static async getPresets(): Promise<CalculatorPreset[]> {
    return Array.from(presets.values());
  }

  static async createPreset(presetData: Omit<CalculatorPreset, 'id' | 'createdAt' | 'updatedAt'>): Promise<CalculatorPreset> {
    const preset: CalculatorPreset = {
      ...presetData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    presets.set(preset.id, preset);
    return preset;
  }

  static async updatePreset(id: string, updates: Partial<CalculatorPreset>): Promise<CalculatorPreset | null> {
    const preset = presets.get(id);
    if (!preset) return null;

    const updatedPreset = {
      ...preset,
      ...updates,
      updatedAt: new Date(),
    };
    
    presets.set(id, updatedPreset);
    return updatedPreset;
  }

  static async deletePreset(id: string): Promise<boolean> {
    return presets.delete(id);
  }

  // Comparison operations
  static async createComparison(comparisonData: Omit<CalculatorComparison, 'id' | 'createdAt' | 'updatedAt'>): Promise<CalculatorComparison> {
    const comparison: CalculatorComparison = {
      ...comparisonData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    comparisons.set(comparison.id, comparison);
    return comparison;
  }

  static async getComparison(id: string): Promise<CalculatorComparison | null> {
    return comparisons.get(id) || null;
  }

  static async getComparisons(): Promise<CalculatorComparison[]> {
    return Array.from(comparisons.values());
  }

  static async updateComparison(id: string, updates: Partial<CalculatorComparison>): Promise<CalculatorComparison | null> {
    const comparison = comparisons.get(id);
    if (!comparison) return null;

    const updatedComparison = {
      ...comparison,
      ...updates,
      updatedAt: new Date(),
    };
    
    comparisons.set(id, updatedComparison);
    return updatedComparison;
  }

  static async deleteComparison(id: string): Promise<boolean> {
    return comparisons.delete(id);
  }

  // Analytics
  static async getAnalytics(): Promise<CalculatorAnalytics> {
    const allCalculations = Array.from(calculations.values());
    const totalCalculations = allCalculations.length;
    
    const averagePropertyPrice = allCalculations.length > 0 
      ? allCalculations.reduce((sum, calc) => sum + calc.mortgage.loanAmount, 0) / allCalculations.length 
      : 0;

    const calculationsByMonth = this.getCalculationsByMonth();
    const popularPresets = this.getPopularPresets();

    return {
      totalCalculations,
      averagePropertyPrice,
      averageInterestRate: 6.5, // Mock data
      averageLoanTerm: 30, // Mock data
      calculationsByMonth,
      popularPresets,
      userMetrics: {
        totalUsers: 100, // Mock data
        activeUsers: 50, // Mock data
        averageCalculationsPerUser: totalCalculations / 100,
      },
    };
  }

  private static getCalculationsByMonth(): Array<{ month: string; count: number }> {
    // Mock data for monthly calculations
    const months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'];
    return months.map(month => ({
      month,
      count: Math.floor(Math.random() * 50) + 10,
    }));
  }

  private static getPopularPresets(): Array<{ presetId: string; presetName: string; usageCount: number }> {
    return Array.from(presets.values()).map(preset => ({
      presetId: preset.id,
      presetName: preset.name,
      usageCount: Math.floor(Math.random() * 100) + 10,
    }));
  }
}
