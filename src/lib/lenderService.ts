import { 
  Lender, 
  LoanType, 
  LenderFee, 
  LoanApplication, 
  FinancingOption, 
  FinancingComparison,
  PreQualification,
  CreditAssessment,
  FinancingSearchFilters
} from '@/types/financing';
import { MortgageCalculatorService } from './mortgageCalculator';

// Mock data for development
const mockLenders: Lender[] = [
  {
    id: '1',
    name: 'Premier Mortgage Bank',
    logo: '/images/lenders/premier-mortgage.png',
    website: 'https://premiermortgage.com',
    phone: '+1-555-0100',
    email: 'info@premiermortgage.com',
    description: 'Premier Mortgage Bank offers competitive rates and personalized service for homebuyers.',
    specialties: ['First-time Buyers', 'Jumbo Loans', 'Investment Properties'],
    loanTypes: [
      {
        id: 'conventional-30',
        name: '30-Year Fixed',
        description: 'Traditional 30-year fixed-rate mortgage',
        interestRateType: 'fixed',
        minTerm: 30,
        maxTerm: 30,
        minDownPayment: 3,
        maxDownPayment: 20,
        eligibilityRequirements: ['Minimum 620 credit score', 'Stable employment history'],
        benefits: ['Predictable payments', 'Low down payment options'],
        drawbacks: ['Higher interest rate than shorter terms'],
        isPopular: true
      }
    ],
    minLoanAmount: 100000,
    maxLoanAmount: 2000000,
    minCreditScore: 620,
    maxLtv: 97,
    processingTime: '21-30 days',
    fees: [
      {
        id: 'origination',
        name: 'Origination Fee',
        type: 'percentage',
        amount: 1.0,
        description: 'Fee for processing the loan',
        isRequired: true,
        isRefundable: false
      }
    ],
    rating: 4.8,
    reviewCount: 1247,
    isVerified: true,
    isActive: true,
    locations: ['California', 'Nevada', 'Arizona'],
    languages: ['English', 'Spanish'],
    features: ['Online Application', 'Rate Lock', 'Fast Processing'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/premier-mortgage'
    }
  },
  {
    id: '2',
    name: 'Quick Home Loans',
    logo: '/images/lenders/quick-home-loans.png',
    website: 'https://quickhomeloans.com',
    phone: '+1-555-0200',
    email: 'support@quickhomeloans.com',
    description: 'Fast and efficient mortgage processing with competitive rates.',
    specialties: ['Fast Processing', 'Online Application', 'Refinancing'],
    loanTypes: [
      {
        id: 'fha-30',
        name: 'FHA 30-Year',
        description: 'FHA-insured 30-year mortgage',
        interestRateType: 'fixed',
        minTerm: 30,
        maxTerm: 30,
        minDownPayment: 3.5,
        maxDownPayment: 10,
        eligibilityRequirements: ['Minimum 580 credit score', 'FHA approval'],
        benefits: ['Low down payment', 'Flexible credit requirements'],
        drawbacks: ['Mortgage insurance required'],
        isPopular: true
      }
    ],
    minLoanAmount: 50000,
    maxLoanAmount: 1500000,
    minCreditScore: 580,
    maxLtv: 96.5,
    processingTime: '15-21 days',
    fees: [
      {
        id: 'processing',
        name: 'Processing Fee',
        type: 'fixed',
        amount: 500,
        description: 'Loan processing fee',
        isRequired: true,
        isRefundable: false
      }
    ],
    rating: 4.6,
    reviewCount: 892,
    isVerified: true,
    isActive: true,
    locations: ['California', 'Texas', 'Florida'],
    languages: ['English', 'Spanish', 'French'],
    features: ['24/7 Support', 'Mobile App', 'Rate Lock'],
    socialMedia: {
      facebook: 'https://facebook.com/quickhomeloans'
    }
  }
];

const mockLoanTypes: LoanType[] = [
  {
    id: 'conventional-30',
    name: '30-Year Fixed',
    description: 'Traditional 30-year fixed-rate mortgage with stable payments',
    interestRateType: 'fixed',
    minTerm: 30,
    maxTerm: 30,
    minDownPayment: 3,
    maxDownPayment: 20,
    eligibilityRequirements: ['Minimum 620 credit score', 'Stable employment'],
    benefits: ['Predictable payments', 'Low down payment options'],
    drawbacks: ['Higher interest rate than shorter terms'],
    isPopular: true
  },
  {
    id: 'conventional-15',
    name: '15-Year Fixed',
    description: '15-year fixed-rate mortgage with lower interest rates',
    interestRateType: 'fixed',
    minTerm: 15,
    maxTerm: 15,
    minDownPayment: 5,
    maxDownPayment: 20,
    eligibilityRequirements: ['Minimum 620 credit score', 'Higher income requirement'],
    benefits: ['Lower interest rate', 'Faster equity building'],
    drawbacks: ['Higher monthly payments'],
    isPopular: true
  },
  {
    id: 'fha-30',
    name: 'FHA 30-Year',
    description: 'FHA-insured mortgage with flexible requirements',
    interestRateType: 'fixed',
    minTerm: 30,
    maxTerm: 30,
    minDownPayment: 3.5,
    maxDownPayment: 10,
    eligibilityRequirements: ['Minimum 580 credit score', 'FHA approval'],
    benefits: ['Low down payment', 'Flexible credit requirements'],
    drawbacks: ['Mortgage insurance required'],
    isPopular: true
  },
  {
    id: 'va-30',
    name: 'VA 30-Year',
    description: 'VA-guaranteed mortgage for eligible veterans',
    interestRateType: 'fixed',
    minTerm: 30,
    maxTerm: 30,
    minDownPayment: 0,
    maxDownPayment: 0,
    eligibilityRequirements: ['VA eligibility', 'Certificate of Eligibility'],
    benefits: ['No down payment', 'No PMI', 'Competitive rates'],
    drawbacks: ['Limited to eligible veterans'],
    isPopular: false
  },
  {
    id: 'arm-5-1',
    name: '5/1 ARM',
    description: '5-year adjustable rate mortgage',
    interestRateType: 'hybrid',
    minTerm: 30,
    maxTerm: 30,
    minDownPayment: 5,
    maxDownPayment: 20,
    eligibilityRequirements: ['Minimum 620 credit score', 'Income stability'],
    benefits: ['Lower initial rate', 'Rate caps'],
    drawbacks: ['Rate can increase after 5 years'],
    isPopular: false
  }
];

export class LenderService {
  // Lender Management
  static async getLenders(filters?: FinancingSearchFilters): Promise<Lender[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredLenders = [...mockLenders];
    
    if (filters) {
      if (filters.loanAmount) {
        filteredLenders = filteredLenders.filter(lender =>
          lender.minLoanAmount <= filters.loanAmount!.max &&
          lender.maxLoanAmount >= filters.loanAmount!.min
        );
      }
      
      if (filters.lenders && filters.lenders.length > 0) {
        filteredLenders = filteredLenders.filter(lender =>
          filters.lenders!.includes(lender.id)
        );
      }
      
      if (filters.locations && filters.locations.length > 0) {
        filteredLenders = filteredLenders.filter(lender =>
          filters.locations!.some(location =>
            lender.locations.some(lenderLocation =>
              lenderLocation.toLowerCase().includes(location.toLowerCase())
            )
          )
        );
      }
    }
    
    return filteredLenders;
  }

  static async getLenderById(id: string): Promise<Lender | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockLenders.find(lender => lender.id === id) || null;
  }

  static async getLoanTypes(): Promise<LoanType[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockLoanTypes;
  }

  static async getLoanTypeById(id: string): Promise<LoanType | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockLoanTypes.find(type => type.id === id) || null;
  }

  // Financing Options
  static async getFinancingOptions(
    loanAmount: number,
    downPayment: number,
    creditScore: number,
    propertyValue: number
  ): Promise<FinancingOption[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const options: FinancingOption[] = [];
    const ltv = (loanAmount / propertyValue) * 100;
    
    for (const lender of mockLenders) {
      if (creditScore >= lender.minCreditScore && ltv <= lender.maxLtv) {
        for (const loanType of lender.loanTypes) {
          if (downPayment >= loanType.minDownPayment && downPayment <= loanType.maxDownPayment) {
            // Calculate interest rate based on credit score and LTV
            let baseRate = 4.5; // Base rate
            if (creditScore < 680) baseRate += 0.5;
            if (creditScore < 640) baseRate += 0.5;
            if (ltv > 80) baseRate += 0.25;
            if (loanType.interestRateType === 'fixed' && loanType.minTerm === 15) baseRate -= 0.5;
            
            const monthlyPayment = MortgageCalculatorService.calculateMonthlyPayment(
              loanAmount,
              baseRate,
              loanType.minTerm
            );
            
            const totalCost = (monthlyPayment * loanType.minTerm * 12) + downPayment;
            const closingCosts = loanAmount * 0.02; // 2% of loan amount
            
            // Calculate comparison score
            let comparisonScore = 100;
            if (baseRate > 4.5) comparisonScore -= (baseRate - 4.5) * 20;
            if (lender.rating < 4.5) comparisonScore -= (4.5 - lender.rating) * 10;
            if (lender.processingTime.includes('30')) comparisonScore -= 5;
            
            options.push({
              id: `${lender.id}-${loanType.id}`,
              lenderId: lender.id,
              loanType: loanType.name,
              loanAmount,
              interestRate: baseRate,
              apr: baseRate + 0.1, // APR includes fees
              loanTerm: loanType.minTerm,
              monthlyPayment,
              totalCost,
              downPayment,
              closingCosts,
              fees: lender.fees,
              features: lender.features,
              benefits: loanType.benefits,
              requirements: loanType.eligibilityRequirements,
              isRecommended: comparisonScore > 80,
              comparisonScore
            });
          }
        }
      }
    }
    
    return options.sort((a, b) => b.comparisonScore - a.comparisonScore);
  }

  // Loan Applications
  static async createLoanApplication(applicationData: Partial<LoanApplication>): Promise<LoanApplication> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newApplication: LoanApplication = {
      id: Date.now().toString(),
      borrowerId: applicationData.borrowerId || '',
      lenderId: applicationData.lenderId || '',
      propertyId: applicationData.propertyId || '',
      loanType: applicationData.loanType || '',
      loanAmount: applicationData.loanAmount || 0,
      downPayment: applicationData.downPayment || 0,
      interestRate: applicationData.interestRate || 0,
      loanTerm: applicationData.loanTerm || 30,
      monthlyIncome: applicationData.monthlyIncome || 0,
      creditScore: applicationData.creditScore || 0,
      debtToIncomeRatio: applicationData.debtToIncomeRatio || 0,
      employmentStatus: applicationData.employmentStatus || 'employed',
      employmentHistory: applicationData.employmentHistory || [],
      assets: applicationData.assets || [],
      liabilities: applicationData.liabilities || [],
      status: 'draft',
      documents: applicationData.documents || [],
      notes: applicationData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return newApplication;
  }

  static async updateLoanApplication(
    id: string, 
    updates: Partial<LoanApplication>
  ): Promise<LoanApplication | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would update the database
    // For now, we'll return a mock updated application
    return {
      id,
      borrowerId: 'borrower-1',
      lenderId: 'lender-1',
      propertyId: 'property-1',
      loanType: '30-Year Fixed',
      loanAmount: 400000,
      downPayment: 80000,
      interestRate: 4.5,
      loanTerm: 30,
      monthlyIncome: 8000,
      creditScore: 720,
      debtToIncomeRatio: 28,
      employmentStatus: 'employed',
      employmentHistory: [],
      assets: [],
      liabilities: [],
      status: updates.status || 'draft',
      documents: [],
      notes: updates.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Pre-qualification
  static async getPreQualification(
    borrowerId: string,
    propertyId: string,
    monthlyIncome: number,
    monthlyDebtPayments: number,
    creditScore: number,
    downPayment: number
  ): Promise<PreQualification> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const dti = (monthlyDebtPayments / monthlyIncome) * 100;
    const maxLoanAmount = MortgageCalculatorService.calculateMaxLoanAmount(
      monthlyIncome,
      28, // Max DTI
      monthlyDebtPayments,
      0, // Property tax
      0, // Insurance
      0, // PMI
      0, // HOA
      4.5, // Interest rate
      30 // Loan term
    );
    
    const estimatedInterestRate = creditScore >= 740 ? 4.0 : 
                                 creditScore >= 680 ? 4.5 : 
                                 creditScore >= 620 ? 5.0 : 5.5;
    
    const estimatedMonthlyPayment = MortgageCalculatorService.calculateMonthlyPayment(
      maxLoanAmount,
      estimatedInterestRate,
      30
    );
    
    const ltv = (maxLoanAmount / (maxLoanAmount + downPayment)) * 100;
    
    let status: 'qualified' | 'not-qualified' | 'conditional' = 'qualified';
    const conditions: string[] = [];
    
    if (dti > 28) {
      status = 'conditional';
      conditions.push('Debt-to-income ratio exceeds 28%');
    }
    
    if (creditScore < 620) {
      status = 'not-qualified';
    } else if (creditScore < 680) {
      status = 'conditional';
      conditions.push('Credit score below 680');
    }
    
    if (ltv > 95) {
      status = 'conditional';
      conditions.push('Loan-to-value ratio exceeds 95%');
    }
    
    return {
      id: Date.now().toString(),
      borrowerId,
      propertyId,
      estimatedLoanAmount: maxLoanAmount,
      estimatedDownPayment: downPayment,
      estimatedInterestRate,
      estimatedMonthlyPayment,
      debtToIncomeRatio: dti,
      loanToValueRatio: ltv,
      creditScore,
      status,
      conditions: conditions.length > 0 ? conditions : undefined,
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
      createdAt: new Date().toISOString()
    };
  }

  // Credit Assessment
  static async getCreditAssessment(borrowerId: string): Promise<CreditAssessment> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock credit assessment
    const creditScore = 720;
    const factors = [
      {
        factor: 'Payment History',
        impact: 'positive' as const,
        description: 'No late payments in the last 24 months',
        weight: 35
      },
      {
        factor: 'Credit Utilization',
        impact: 'positive' as const,
        description: 'Credit utilization below 30%',
        weight: 30
      },
      {
        factor: 'Credit History Length',
        impact: 'neutral' as const,
        description: 'Average account age of 5 years',
        weight: 15
      },
      {
        factor: 'Credit Mix',
        impact: 'positive' as const,
        description: 'Good mix of credit types',
        weight: 10
      },
      {
        factor: 'New Credit',
        impact: 'negative' as const,
        description: 'Recent credit inquiries',
        weight: 10
      }
    ];
    
    const recommendations = [
      'Maintain current payment history',
      'Keep credit utilization below 30%',
      'Avoid new credit applications',
      'Consider paying down high-balance cards'
    ];
    
    const riskLevel = creditScore >= 740 ? 'low' : 
                     creditScore >= 680 ? 'medium' : 'high';
    
    const estimatedRate = creditScore >= 740 ? 4.0 : 
                         creditScore >= 680 ? 4.5 : 
                         creditScore >= 620 ? 5.0 : 5.5;
    
    return {
      id: Date.now().toString(),
      borrowerId,
      creditScore,
      creditBureau: 'composite',
      reportDate: new Date().toISOString(),
      factors,
      recommendations,
      riskLevel,
      estimatedRate,
      preQualificationAmount: 500000
    };
  }

  // Financing Comparison
  static async createFinancingComparison(
    borrowerId: string,
    propertyId: string,
    loanAmount: number,
    downPayment: number
  ): Promise<FinancingComparison> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const options = await this.getFinancingOptions(
      loanAmount,
      downPayment,
      720, // Mock credit score
      loanAmount + downPayment
    );
    
    return {
      id: Date.now().toString(),
      borrowerId,
      propertyId,
      loanAmount,
      downPayment,
      options,
      comparisonDate: new Date().toISOString(),
      notes: ''
    };
  }

  // Rate Alerts
  static async createRateAlert(
    borrowerId: string,
    loanType: string,
    targetRate: number
  ): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would create a rate alert in the database
    return true;
  }

  // Market Data
  static async getMarketRates(): Promise<{
    '30-year-fixed': number;
    '15-year-fixed': number;
    '5-1-arm': number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      '30-year-fixed': 4.5,
      '15-year-fixed': 4.0,
      '5-1-arm': 3.8
    };
  }
}
