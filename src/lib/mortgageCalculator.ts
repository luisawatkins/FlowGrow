import { MortgageCalculator, AmortizationEntry } from '@/types/financing';

export class MortgageCalculatorService {
  /**
   * Calculate monthly mortgage payment using the standard mortgage formula
   */
  static calculateMonthlyPayment(
    loanAmount: number,
    annualInterestRate: number,
    loanTermYears: number
  ): number {
    if (annualInterestRate === 0) {
      return loanAmount / (loanTermYears * 12);
    }

    const monthlyRate = annualInterestRate / 100 / 12;
    const numberOfPayments = loanTermYears * 12;
    
    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return monthlyPayment;
  }

  /**
   * Calculate total interest paid over the life of the loan
   */
  static calculateTotalInterest(
    loanAmount: number,
    monthlyPayment: number,
    loanTermYears: number
  ): number {
    const totalPayments = monthlyPayment * loanTermYears * 12;
    return totalPayments - loanAmount;
  }

  /**
   * Generate complete amortization schedule
   */
  static generateAmortizationSchedule(
    loanAmount: number,
    annualInterestRate: number,
    loanTermYears: number,
    startDate: Date = new Date()
  ): AmortizationEntry[] {
    const monthlyRate = annualInterestRate / 100 / 12;
    const numberOfPayments = loanTermYears * 12;
    const monthlyPayment = this.calculateMonthlyPayment(loanAmount, annualInterestRate, loanTermYears);
    
    const schedule: AmortizationEntry[] = [];
    let remainingBalance = loanAmount;
    let cumulativeInterest = 0;
    let cumulativePrincipal = 0;
    
    for (let i = 1; i <= numberOfPayments; i++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      
      // Handle final payment adjustment
      const actualPrincipalPayment = Math.min(principalPayment, remainingBalance);
      const actualTotalPayment = actualPrincipalPayment + interestPayment;
      
      remainingBalance -= actualPrincipalPayment;
      cumulativeInterest += interestPayment;
      cumulativePrincipal += actualPrincipalPayment;
      
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(paymentDate.getMonth() + i - 1);
      
      schedule.push({
        paymentNumber: i,
        paymentDate: paymentDate.toISOString().split('T')[0],
        principalPayment: actualPrincipalPayment,
        interestPayment: interestPayment,
        totalPayment: actualTotalPayment,
        remainingBalance: Math.max(0, remainingBalance),
        cumulativeInterest: cumulativeInterest,
        cumulativePrincipal: cumulativePrincipal
      });
      
      if (remainingBalance <= 0) break;
    }
    
    return schedule;
  }

  /**
   * Calculate complete mortgage details including taxes, insurance, and PMI
   */
  static calculateCompleteMortgage(
    loanAmount: number,
    annualInterestRate: number,
    loanTermYears: number,
    downPayment: number,
    propertyValue: number,
    annualPropertyTax: number = 0,
    annualInsurance: number = 0,
    annualPMI: number = 0,
    annualHOA: number = 0
  ): MortgageCalculator {
    const monthlyPayment = this.calculateMonthlyPayment(loanAmount, annualInterestRate, loanTermYears);
    const totalInterest = this.calculateTotalInterest(loanAmount, monthlyPayment, loanTermYears);
    const totalCost = loanAmount + totalInterest + downPayment;
    
    // Calculate monthly escrow payments
    const monthlyPropertyTax = annualPropertyTax / 12;
    const monthlyInsurance = annualInsurance / 12;
    const monthlyPMI = annualPMI / 12;
    const monthlyHOA = annualHOA / 12;
    
    const totalMonthlyPayment = monthlyPayment + monthlyPropertyTax + monthlyInsurance + monthlyPMI + monthlyHOA;
    
    const amortizationSchedule = this.generateAmortizationSchedule(
      loanAmount,
      annualInterestRate,
      loanTermYears
    );
    
    return {
      loanAmount,
      interestRate: annualInterestRate,
      loanTerm: loanTermYears,
      downPayment,
      propertyTax: monthlyPropertyTax,
      insurance: monthlyInsurance,
      pmi: monthlyPMI,
      hoa: monthlyHOA,
      monthlyPayment: totalMonthlyPayment,
      totalInterest,
      totalCost,
      amortizationSchedule
    };
  }

  /**
   * Calculate loan-to-value ratio
   */
  static calculateLTV(loanAmount: number, propertyValue: number): number {
    return (loanAmount / propertyValue) * 100;
  }

  /**
   * Calculate debt-to-income ratio
   */
  static calculateDTI(
    monthlyDebtPayments: number,
    monthlyGrossIncome: number
  ): number {
    return (monthlyDebtPayments / monthlyGrossIncome) * 100;
  }

  /**
   * Calculate maximum loan amount based on DTI ratio
   */
  static calculateMaxLoanAmount(
    monthlyGrossIncome: number,
    maxDTI: number,
    monthlyDebtPayments: number,
    monthlyPropertyTax: number,
    monthlyInsurance: number,
    monthlyPMI: number,
    monthlyHOA: number,
    annualInterestRate: number,
    loanTermYears: number
  ): number {
    const maxMonthlyPayment = (monthlyGrossIncome * maxDTI / 100) - monthlyDebtPayments;
    const maxMortgagePayment = maxMonthlyPayment - monthlyPropertyTax - monthlyInsurance - monthlyPMI - monthlyHOA;
    
    if (maxMortgagePayment <= 0) return 0;
    
    const monthlyRate = annualInterestRate / 100 / 12;
    const numberOfPayments = loanTermYears * 12;
    
    if (monthlyRate === 0) {
      return maxMortgagePayment * numberOfPayments;
    }
    
    const maxLoanAmount = maxMortgagePayment * 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1) /
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments));
    
    return maxLoanAmount;
  }

  /**
   * Calculate refinancing savings
   */
  static calculateRefinancingSavings(
    currentLoanAmount: number,
    currentInterestRate: number,
    currentLoanTerm: number,
    newInterestRate: number,
    newLoanTerm: number,
    refinancingCosts: number
  ): {
    currentMonthlyPayment: number;
    newMonthlyPayment: number;
    monthlySavings: number;
    totalSavings: number;
    breakEvenMonths: number;
    isBeneficial: boolean;
  } {
    const currentMonthlyPayment = this.calculateMonthlyPayment(
      currentLoanAmount,
      currentInterestRate,
      currentLoanTerm
    );
    
    const newMonthlyPayment = this.calculateMonthlyPayment(
      currentLoanAmount,
      newInterestRate,
      newLoanTerm
    );
    
    const monthlySavings = currentMonthlyPayment - newMonthlyPayment;
    const totalSavings = monthlySavings * newLoanTerm * 12 - refinancingCosts;
    const breakEvenMonths = refinancingCosts / monthlySavings;
    
    return {
      currentMonthlyPayment,
      newMonthlyPayment,
      monthlySavings,
      totalSavings,
      breakEvenMonths,
      isBeneficial: totalSavings > 0
    };
  }

  /**
   * Calculate bi-weekly payment savings
   */
  static calculateBiWeeklySavings(
    loanAmount: number,
    annualInterestRate: number,
    loanTermYears: number
  ): {
    monthlyPayment: number;
    biWeeklyPayment: number;
    totalPayments: number;
    totalInterest: number;
    timeSaved: number; // in months
    interestSaved: number;
  } {
    const monthlyPayment = this.calculateMonthlyPayment(loanAmount, annualInterestRate, loanTermYears);
    const biWeeklyPayment = monthlyPayment / 2;
    
    // Calculate total payments and interest for bi-weekly
    const monthlyRate = annualInterestRate / 100 / 12;
    const biWeeklyRate = annualInterestRate / 100 / 26;
    
    let balance = loanAmount;
    let totalPayments = 0;
    let totalInterest = 0;
    
    while (balance > 0.01) {
      const interestPayment = balance * biWeeklyRate;
      const principalPayment = biWeeklyPayment - interestPayment;
      
      balance -= principalPayment;
      totalPayments += biWeeklyPayment;
      totalInterest += interestPayment;
    }
    
    const originalTotalInterest = this.calculateTotalInterest(loanAmount, monthlyPayment, loanTermYears);
    const interestSaved = originalTotalInterest - totalInterest;
    const timeSaved = (loanTermYears * 12) - (totalPayments / monthlyPayment);
    
    return {
      monthlyPayment,
      biWeeklyPayment,
      totalPayments,
      totalInterest,
      timeSaved,
      interestSaved
    };
  }

  /**
   * Calculate ARM (Adjustable Rate Mortgage) payments
   */
  static calculateARMPayments(
    loanAmount: number,
    initialRate: number,
    initialTermYears: number,
    adjustmentPeriod: number,
    rateCap: number,
    lifetimeCap: number,
    indexRate: number,
    margin: number,
    totalTermYears: number
  ): {
    initialPeriod: {
      monthlyPayment: number;
      interestRate: number;
      term: number;
    };
    adjustedPeriod: {
      monthlyPayment: number;
      interestRate: number;
      remainingBalance: number;
    };
    totalSavings: number;
  } {
    const initialMonthlyPayment = this.calculateMonthlyPayment(loanAmount, initialRate, initialTermYears);
    
    // Calculate remaining balance after initial period
    const monthlyRate = initialRate / 100 / 12;
    const numberOfPayments = initialTermYears * 12;
    let remainingBalance = loanAmount;
    
    for (let i = 0; i < numberOfPayments; i++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = initialMonthlyPayment - interestPayment;
      remainingBalance -= principalPayment;
    }
    
    // Calculate adjusted rate
    const newRate = Math.min(
      Math.max(indexRate + margin, initialRate - rateCap),
      initialRate + lifetimeCap
    );
    
    const adjustedMonthlyPayment = this.calculateMonthlyPayment(
      remainingBalance,
      newRate,
      totalTermYears - initialTermYears
    );
    
    const totalSavings = (initialMonthlyPayment * numberOfPayments) - 
      (adjustedMonthlyPayment * (totalTermYears - initialTermYears) * 12);
    
    return {
      initialPeriod: {
        monthlyPayment: initialMonthlyPayment,
        interestRate: initialRate,
        term: initialTermYears
      },
      adjustedPeriod: {
        monthlyPayment: adjustedMonthlyPayment,
        interestRate: newRate,
        remainingBalance: remainingBalance
      },
      totalSavings
    };
  }

  /**
   * Format currency for display
   */
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Format percentage for display
   */
  static formatPercentage(rate: number, decimals: number = 2): string {
    return `${rate.toFixed(decimals)}%`;
  }

  /**
   * Calculate affordability based on income and expenses
   */
  static calculateAffordability(
    monthlyGrossIncome: number,
    monthlyDebtPayments: number,
    downPayment: number,
    maxDTI: number = 28,
    annualInterestRate: number = 4.5,
    loanTermYears: number = 30,
    monthlyPropertyTax: number = 0,
    monthlyInsurance: number = 0,
    monthlyPMI: number = 0,
    monthlyHOA: number = 0
  ): {
    maxLoanAmount: number;
    maxPropertyValue: number;
    maxMonthlyPayment: number;
    recommendedLoanAmount: number;
    recommendedPropertyValue: number;
  } {
    const maxLoanAmount = this.calculateMaxLoanAmount(
      monthlyGrossIncome,
      maxDTI,
      monthlyDebtPayments,
      monthlyPropertyTax,
      monthlyInsurance,
      monthlyPMI,
      monthlyHOA,
      annualInterestRate,
      loanTermYears
    );
    
    const maxPropertyValue = maxLoanAmount + downPayment;
    const maxMonthlyPayment = this.calculateMonthlyPayment(maxLoanAmount, annualInterestRate, loanTermYears);
    
    // Recommend 80% of max to be conservative
    const recommendedLoanAmount = maxLoanAmount * 0.8;
    const recommendedPropertyValue = recommendedLoanAmount + downPayment;
    
    return {
      maxLoanAmount,
      maxPropertyValue,
      maxMonthlyPayment,
      recommendedLoanAmount,
      recommendedPropertyValue
    };
  }
}
