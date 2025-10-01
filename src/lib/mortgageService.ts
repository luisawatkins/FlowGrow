// Mortgage Service
// Business logic for mortgage calculations and financing

import {
  MortgageCalculation,
  AmortizationSchedule,
  AmortizationPayment,
  LoanProduct,
  AffordabilityCalculation,
  RefinanceAnalysis,
  DownPaymentCalculator,
  AssistanceProgram,
  MortgageComparison,
  MortgageScenario,
  PreApprovalRequest,
  MortgageApplication,
  MortgageCalculationRequest,
  MortgageCalculationResponse,
  AffordabilityRequest,
  RefinanceRequest,
  LoanComparisonRequest,
  PreApprovalRequestData,
  LoanType,
  PropertyType,
  OccupancyType,
  EmploymentType,
  MaritalStatus,
  PreApprovalStatus,
  ApplicationStatus,
  DocumentType,
  DocumentStatus,
  MilestoneStatus,
  RefinanceRecommendation,
  AssistanceType,
  AssetType,
  LiabilityType,
  MortgageApiError
} from '@/types/mortgage';

// Mock data for development and testing
const mockLoanProducts: LoanProduct[] = [
  {
    id: 'lp1',
    name: 'Conventional 30-Year Fixed',
    type: LoanType.CONVENTIONAL,
    lender: 'First National Bank',
    interestRate: 6.5,
    apr: 6.7,
    minDownPayment: 5,
    maxLoanAmount: 766550,
    minCreditScore: 620,
    maxLoanTerm: 30,
    minLoanTerm: 15,
    features: ['No PMI with 20% down', 'Flexible terms', 'Competitive rates'],
    requirements: ['620+ credit score', 'Stable income', 'Debt-to-income ratio under 43%'],
    isConventional: true,
    isGovernment: false,
    isJumbo: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'lp2',
    name: 'FHA 30-Year Fixed',
    type: LoanType.FHA,
    lender: 'Community Credit Union',
    interestRate: 6.2,
    apr: 6.8,
    minDownPayment: 3.5,
    maxLoanAmount: 472030,
    minCreditScore: 580,
    maxLoanTerm: 30,
    minLoanTerm: 15,
    features: ['Low down payment', 'Flexible credit requirements', 'Government backed'],
    requirements: ['580+ credit score', 'Primary residence', 'Mortgage insurance required'],
    isConventional: false,
    isGovernment: true,
    isJumbo: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'lp3',
    name: 'VA 30-Year Fixed',
    type: LoanType.VA,
    lender: 'Veterans First Mortgage',
    interestRate: 6.0,
    apr: 6.2,
    minDownPayment: 0,
    maxLoanAmount: 766550,
    minCreditScore: 620,
    maxLoanTerm: 30,
    minLoanTerm: 15,
    features: ['No down payment', 'No PMI', 'Competitive rates', 'Veteran benefits'],
    requirements: ['VA eligibility', '620+ credit score', 'Primary residence'],
    isConventional: false,
    isGovernment: true,
    isJumbo: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const mockAssistancePrograms: AssistanceProgram[] = [
  {
    id: 'ap1',
    name: 'First-Time Homebuyer Program',
    type: AssistanceType.FIRST_TIME_BUYER,
    description: 'Assistance for first-time homebuyers with down payment and closing costs.',
    eligibilityRequirements: [
      'First-time homebuyer',
      'Income under $75,000',
      'Credit score 640+',
      'Complete homebuyer education course'
    ],
    benefits: [
      'Up to $10,000 down payment assistance',
      'Up to $5,000 closing cost assistance',
      'Below-market interest rates'
    ],
    applicationProcess: [
      'Complete pre-approval',
      'Attend homebuyer education',
      'Submit application',
      'Property inspection',
      'Closing'
    ],
    contactInfo: {
      website: 'https://example.com/first-time-buyer',
      phone: '(555) 123-4567',
      email: 'firsttime@example.com'
    },
    isActive: true
  },
  {
    id: 'ap2',
    name: 'Teacher Next Door Program',
    type: AssistanceType.TEACHER,
    description: 'Special program for teachers and education professionals.',
    eligibilityRequirements: [
      'Full-time teacher or education professional',
      'Income under $100,000',
      'Credit score 650+',
      'Work in designated school district'
    ],
    benefits: [
      'Up to $15,000 down payment assistance',
      'Reduced interest rates',
      'Priority processing'
    ],
    applicationProcess: [
      'Verify employment',
      'Complete application',
      'Property selection',
      'Closing'
    ],
    contactInfo: {
      website: 'https://example.com/teacher-program',
      phone: '(555) 234-5678',
      email: 'teachers@example.com'
    },
    isActive: true
  }
];

class MortgageService {
  private calculations: MortgageCalculation[] = [];
  private loanProducts: LoanProduct[] = mockLoanProducts;
  private assistancePrograms: AssistanceProgram[] = mockAssistancePrograms;

  // Mortgage Calculations
  async calculateMortgage(request: MortgageCalculationRequest): Promise<MortgageCalculationResponse> {
    try {
      const calculation = this.performMortgageCalculation(request);
      const amortizationSchedule = this.generateAmortizationSchedule(calculation);
      const affordability = this.calculateAffordabilityFromMortgage(calculation);

      // Store calculation
      this.calculations.push(calculation);

      return {
        calculation,
        amortizationSchedule,
        affordability
      };
    } catch (error) {
      throw this.createApiError('CALCULATION_FAILED', 'Failed to calculate mortgage', error);
    }
  }

  // Affordability Calculations
  async calculateAffordability(request: AffordabilityRequest): Promise<AffordabilityCalculation> {
    try {
      const calculation = this.performAffordabilityCalculation(request);
      return calculation;
    } catch (error) {
      throw this.createApiError('AFFORDABILITY_FAILED', 'Failed to calculate affordability', error);
    }
  }

  // Refinance Analysis
  async analyzeRefinance(request: RefinanceRequest): Promise<RefinanceAnalysis> {
    try {
      const analysis = this.performRefinanceAnalysis(request);
      return analysis;
    } catch (error) {
      throw this.createApiError('REFINANCE_FAILED', 'Failed to analyze refinance', error);
    }
  }

  // Down Payment Calculator
  async calculateDownPayment(homePrice: number, downPaymentPercentage: number, firstTimeBuyer: boolean = false): Promise<DownPaymentCalculator> {
    try {
      const downPaymentAmount = homePrice * (downPaymentPercentage / 100);
      const loanAmount = homePrice - downPaymentAmount;
      const pmiRequired = downPaymentPercentage < 20;
      const pmiCost = pmiRequired ? this.calculatePMI(loanAmount) : 0;

      const assistancePrograms = firstTimeBuyer 
        ? this.assistancePrograms.filter(program => program.isActive)
        : [];

      return {
        id: `dp_${Date.now()}`,
        homePrice,
        downPaymentPercentage,
        downPaymentAmount,
        loanAmount,
        pmiRequired,
        pmiCost,
        firstTimeBuyer,
        assistancePrograms,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      throw this.createApiError('DOWN_PAYMENT_FAILED', 'Failed to calculate down payment', error);
    }
  }

  // Loan Products
  async getLoanProducts(filters?: any): Promise<LoanProduct[]> {
    try {
      let products = [...this.loanProducts];

      if (filters) {
        if (filters.loanType) {
          products = products.filter(p => p.type === filters.loanType);
        }
        if (filters.minCreditScore) {
          products = products.filter(p => p.minCreditScore <= filters.minCreditScore);
        }
        if (filters.maxLoanAmount) {
          products = products.filter(p => p.maxLoanAmount >= filters.maxLoanAmount);
        }
        if (filters.isGovernment !== undefined) {
          products = products.filter(p => p.isGovernment === filters.isGovernment);
        }
      }

      return products;
    } catch (error) {
      throw this.createApiError('LOAN_PRODUCTS_FAILED', 'Failed to get loan products', error);
    }
  }

  async getLoanProduct(id: string): Promise<LoanProduct | null> {
    try {
      return this.loanProducts.find(p => p.id === id) || null;
    } catch (error) {
      throw this.createApiError('LOAN_PRODUCT_FAILED', 'Failed to get loan product', error);
    }
  }

  // Loan Comparison
  async compareLoans(request: LoanComparisonRequest): Promise<MortgageComparison> {
    try {
      const scenarios = await Promise.all(
        request.scenarios.map(async (scenario) => {
          const calculation = await this.calculateMortgage({
            propertyId: request.propertyId,
            loanAmount: scenario.loanAmount,
            downPayment: scenario.downPayment,
            interestRate: scenario.interestRate,
            loanTerm: scenario.loanTerm
          });

          return {
            ...scenario,
            monthlyPayment: calculation.calculation.monthlyPayment,
            totalInterest: calculation.calculation.totalInterest,
            totalCost: calculation.calculation.totalCost,
            pros: this.generatePros(scenario),
            cons: this.generateCons(scenario),
            recommendation: this.generateRecommendation(scenario)
          };
        })
      );

      const bestOption = scenarios.reduce((best, current) => 
        current.totalCost < best.totalCost ? current : best
      ).id;

      return {
        id: `comp_${Date.now()}`,
        propertyId: request.propertyId,
        scenarios,
        bestOption,
        comparisonDate: new Date().toISOString(),
        notes: 'Comparison generated automatically',
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      throw this.createApiError('COMPARISON_FAILED', 'Failed to compare loans', error);
    }
  }

  // Pre-Approval
  async submitPreApproval(data: PreApprovalRequestData): Promise<PreApprovalRequest> {
    try {
      const preApproval: PreApprovalRequest = {
        id: `pre_${Date.now()}`,
        borrowerInfo: data.borrowerInfo,
        employmentInfo: data.employmentInfo,
        financialInfo: data.financialInfo,
        propertyInfo: data.propertyInfo,
        status: PreApprovalStatus.PENDING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Simulate pre-approval processing
      setTimeout(() => {
        this.processPreApproval(preApproval);
      }, 1000);

      return preApproval;
    } catch (error) {
      throw this.createApiError('PRE_APPROVAL_FAILED', 'Failed to submit pre-approval', error);
    }
  }

  async getPreApprovalStatus(id: string): Promise<PreApprovalRequest | null> {
    try {
      // In a real implementation, this would fetch from database
      return null;
    } catch (error) {
      throw this.createApiError('PRE_APPROVAL_STATUS_FAILED', 'Failed to get pre-approval status', error);
    }
  }

  // Assistance Programs
  async getAssistancePrograms(filters?: any): Promise<AssistanceProgram[]> {
    try {
      let programs = [...this.assistancePrograms];

      if (filters) {
        if (filters.type) {
          programs = programs.filter(p => p.type === filters.type);
        }
        if (filters.isActive !== undefined) {
          programs = programs.filter(p => p.isActive === filters.isActive);
        }
      }

      return programs;
    } catch (error) {
      throw this.createApiError('ASSISTANCE_PROGRAMS_FAILED', 'Failed to get assistance programs', error);
    }
  }

  // Private helper methods
  private performMortgageCalculation(request: MortgageCalculationRequest): MortgageCalculation {
    const {
      propertyId,
      loanAmount,
      downPayment,
      interestRate,
      loanTerm,
      propertyTax = 0,
      homeInsurance = 0,
      pmi = 0,
      hoaFees = 0
    } = request;

    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    // Calculate monthly principal and interest payment
    const monthlyPandI = loanAmount * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    // Calculate total monthly payment
    const monthlyPayment = monthlyPandI + (propertyTax / 12) + (homeInsurance / 12) + pmi + hoaFees;

    // Calculate total interest
    const totalInterest = (monthlyPandI * numberOfPayments) - loanAmount;

    // Calculate total cost
    const totalCost = loanAmount + totalInterest + (propertyTax * loanTerm) + (homeInsurance * loanTerm) + (pmi * numberOfPayments) + (hoaFees * numberOfPayments);

    return {
      id: `calc_${Date.now()}`,
      propertyId: propertyId || '',
      loanAmount,
      downPayment,
      interestRate,
      loanTerm,
      propertyTax,
      homeInsurance,
      pmi,
      hoaFees,
      monthlyPayment,
      totalInterest,
      totalCost,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private generateAmortizationSchedule(calculation: MortgageCalculation): AmortizationSchedule {
    const payments: AmortizationPayment[] = [];
    const monthlyInterestRate = calculation.interestRate / 100 / 12;
    const numberOfPayments = calculation.loanTerm * 12;
    let remainingBalance = calculation.loanAmount;
    let cumulativeInterest = 0;
    let cumulativePrincipal = 0;

    for (let i = 1; i <= numberOfPayments; i++) {
      const interestPayment = remainingBalance * monthlyInterestRate;
      const principalPayment = calculation.monthlyPayment - interestPayment - (calculation.propertyTax / 12) - (calculation.homeInsurance / 12) - calculation.pmi - calculation.hoaFees;
      remainingBalance -= principalPayment;
      cumulativeInterest += interestPayment;
      cumulativePrincipal += principalPayment;

      payments.push({
        paymentNumber: i,
        paymentDate: this.calculatePaymentDate(i),
        monthlyPayment: calculation.monthlyPayment,
        principalPayment,
        interestPayment,
        remainingBalance: Math.max(0, remainingBalance),
        cumulativeInterest,
        cumulativePrincipal
      });
    }

    return {
      id: `amort_${calculation.id}`,
      calculationId: calculation.id,
      payments,
      totalPayments: numberOfPayments,
      totalInterest: cumulativeInterest,
      totalPrincipal: cumulativePrincipal,
      createdAt: new Date().toISOString()
    };
  }

  private calculateAffordabilityFromMortgage(calculation: MortgageCalculation): AffordabilityCalculation {
    // Simplified affordability calculation
    const recommendedMonthlyPayment = calculation.monthlyPayment;
    const annualIncome = recommendedMonthlyPayment * 12 * 3; // 33% of income rule
    const monthlyDebt = recommendedMonthlyPayment * 0.1; // 10% of payment for other debts

    return {
      id: `afford_${calculation.id}`,
      annualIncome,
      monthlyDebt,
      downPayment: calculation.downPayment,
      creditScore: 700, // Default
      maxLoanAmount: calculation.loanAmount,
      maxHomePrice: calculation.loanAmount + calculation.downPayment,
      recommendedLoanAmount: calculation.loanAmount,
      recommendedHomePrice: calculation.loanAmount + calculation.downPayment,
      debtToIncomeRatio: (monthlyDebt / (annualIncome / 12)) * 100,
      frontEndRatio: (recommendedMonthlyPayment / (annualIncome / 12)) * 100,
      backEndRatio: ((recommendedMonthlyPayment + monthlyDebt) / (annualIncome / 12)) * 100,
      createdAt: new Date().toISOString()
    };
  }

  private performAffordabilityCalculation(request: AffordabilityRequest): AffordabilityCalculation {
    const { annualIncome, monthlyDebt, downPayment, creditScore, interestRate = 6.5, loanTerm = 30 } = request;

    const monthlyIncome = annualIncome / 12;
    const maxMonthlyPayment = (monthlyIncome * 0.28) - monthlyDebt; // 28% rule
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    const maxLoanAmount = maxMonthlyPayment * 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1) /
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments));

    const maxHomePrice = maxLoanAmount + downPayment;

    return {
      id: `afford_${Date.now()}`,
      annualIncome,
      monthlyDebt,
      downPayment,
      creditScore,
      maxLoanAmount,
      maxHomePrice,
      recommendedLoanAmount: maxLoanAmount * 0.9, // 90% of max for safety
      recommendedHomePrice: maxHomePrice * 0.9,
      debtToIncomeRatio: (monthlyDebt / monthlyIncome) * 100,
      frontEndRatio: (maxMonthlyPayment / monthlyIncome) * 100,
      backEndRatio: ((maxMonthlyPayment + monthlyDebt) / monthlyIncome) * 100,
      createdAt: new Date().toISOString()
    };
  }

  private performRefinanceAnalysis(request: RefinanceRequest): RefinanceAnalysis {
    const { currentBalance, currentInterestRate, remainingTerm, newInterestRate, newTerm, closingCosts } = request;

    // Calculate current monthly payment
    const currentMonthlyRate = currentInterestRate / 100 / 12;
    const currentRemainingPayments = remainingTerm * 12;
    const currentMonthlyPayment = currentBalance * 
      (currentMonthlyRate * Math.pow(1 + currentMonthlyRate, currentRemainingPayments)) /
      (Math.pow(1 + currentMonthlyRate, currentRemainingPayments) - 1);

    // Calculate new monthly payment
    const newMonthlyRate = newInterestRate / 100 / 12;
    const newPayments = newTerm * 12;
    const newMonthlyPayment = currentBalance * 
      (newMonthlyRate * Math.pow(1 + newMonthlyRate, newPayments)) /
      (Math.pow(1 + newMonthlyRate, newPayments) - 1);

    const monthlySavings = currentMonthlyPayment - newMonthlyPayment;
    const totalSavings = monthlySavings * newPayments - closingCosts;
    const breakEvenMonths = closingCosts / monthlySavings;

    const currentTotalInterest = (currentMonthlyPayment * currentRemainingPayments) - currentBalance;
    const newTotalInterest = (newMonthlyPayment * newPayments) - currentBalance;
    const totalInterestSavings = currentTotalInterest - newTotalInterest;

    let recommendation: RefinanceRecommendation;
    if (monthlySavings > 0 && breakEvenMonths < 24) {
      recommendation = RefinanceRecommendation.RECOMMENDED;
    } else if (monthlySavings > 0 && breakEvenMonths < 60) {
      recommendation = RefinanceRecommendation.CONSIDER;
    } else if (monthlySavings <= 0) {
      recommendation = RefinanceRecommendation.NOT_RECOMMENDED;
    } else {
      recommendation = RefinanceRecommendation.WAIT;
    }

    return {
      id: `refinance_${Date.now()}`,
      currentLoan: {
        balance: currentBalance,
        interestRate: currentInterestRate,
        remainingTerm,
        monthlyPayment: currentMonthlyPayment
      },
      newLoan: {
        loanAmount: currentBalance,
        interestRate: newInterestRate,
        term: newTerm,
        monthlyPayment: newMonthlyPayment
      },
      savings: {
        monthlySavings,
        totalSavings,
        breakEvenMonths,
        totalInterestSavings
      },
      costs: {
        closingCosts,
        appraisalFee: closingCosts * 0.1,
        titleInsurance: closingCosts * 0.05,
        otherFees: closingCosts * 0.05
      },
      recommendation,
      createdAt: new Date().toISOString()
    };
  }

  private calculatePMI(loanAmount: number): number {
    // PMI typically ranges from 0.5% to 1% of loan amount annually
    return (loanAmount * 0.007) / 12; // 0.7% annually, divided by 12 months
  }

  private calculatePaymentDate(paymentNumber: number): string {
    const date = new Date();
    date.setMonth(date.getMonth() + paymentNumber);
    return date.toISOString();
  }

  private generatePros(scenario: MortgageScenario): string[] {
    const pros: string[] = [];
    
    if (scenario.downPayment >= 20) {
      pros.push('No PMI required');
    }
    
    if (scenario.interestRate < 6.0) {
      pros.push('Competitive interest rate');
    }
    
    if (scenario.loanTerm <= 15) {
      pros.push('Shorter term saves interest');
    }
    
    return pros;
  }

  private generateCons(scenario: MortgageScenario): string[] {
    const cons: string[] = [];
    
    if (scenario.downPayment < 20) {
      cons.push('PMI required');
    }
    
    if (scenario.interestRate > 7.0) {
      cons.push('Higher interest rate');
    }
    
    if (scenario.loanTerm > 30) {
      cons.push('Longer term increases total interest');
    }
    
    return cons;
  }

  private generateRecommendation(scenario: MortgageScenario): string {
    if (scenario.downPayment >= 20 && scenario.interestRate < 6.5) {
      return 'Excellent option with low rate and no PMI';
    } else if (scenario.interestRate < 6.0) {
      return 'Good option with competitive rate';
    } else if (scenario.downPayment >= 20) {
      return 'Good option with no PMI';
    } else {
      return 'Consider improving credit score or increasing down payment';
    }
  }

  private processPreApproval(preApproval: PreApprovalRequest): void {
    // Simulate pre-approval processing
    const debtToIncomeRatio = (preApproval.financialInfo.monthlyDebt / preApproval.financialInfo.monthlyIncome) * 100;
    
    if (preApproval.financialInfo.creditScore >= 620 && debtToIncomeRatio <= 43) {
      preApproval.status = PreApprovalStatus.APPROVED;
      preApproval.preApprovalAmount = preApproval.financialInfo.monthlyIncome * 3 * 12; // 3x annual income
      preApproval.expirationDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(); // 90 days
    } else {
      preApproval.status = PreApprovalStatus.DENIED;
    }
    
    preApproval.updatedAt = new Date().toISOString();
  }

  private createApiError(code: string, message: string, details?: any): MortgageApiError {
    return {
      code,
      message,
      details,
      status: 500,
      timestamp: new Date().toISOString()
    };
  }
}

export const mortgageService = new MortgageService();
