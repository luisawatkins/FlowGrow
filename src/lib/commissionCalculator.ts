import { Commission } from '@/types/agent';

export interface CommissionCalculation {
  baseAmount: number;
  commissionRate: number;
  commissionAmount: number;
  splitRate?: number;
  agentAmount: number;
  brokerageAmount: number;
  taxes: number;
  netAmount: number;
  breakdown: {
    grossCommission: number;
    brokerageSplit: number;
    agentSplit: number;
    taxes: number;
    netCommission: number;
  };
}

export interface CommissionSplit {
  agentId: string;
  agentName: string;
  splitPercentage: number;
  amount: number;
}

export class CommissionCalculator {
  private static readonly TAX_RATE = 0.25; // 25% tax rate
  private static readonly DEFAULT_BROKERAGE_SPLIT = 0.3; // 30% to brokerage

  /**
   * Calculate commission for a property sale
   */
  static calculateCommission(
    salePrice: number,
    commissionRate: number,
    agentSplit: number = 0.7,
    brokerageSplit: number = this.DEFAULT_BROKERAGE_SPLIT
  ): CommissionCalculation {
    const baseAmount = salePrice;
    const commissionAmount = (baseAmount * commissionRate) / 100;
    
    // Calculate splits
    const agentAmount = commissionAmount * agentSplit;
    const brokerageAmount = commissionAmount * brokerageSplit;
    
    // Calculate taxes on agent's portion
    const taxes = agentAmount * this.TAX_RATE;
    const netAmount = agentAmount - taxes;
    
    return {
      baseAmount,
      commissionRate,
      commissionAmount,
      splitRate: agentSplit,
      agentAmount,
      brokerageAmount,
      taxes,
      netAmount,
      breakdown: {
        grossCommission: commissionAmount,
        brokerageSplit: brokerageAmount,
        agentSplit: agentAmount,
        taxes,
        netCommission: netAmount
      }
    };
  }

  /**
   * Calculate commission splits for multiple agents
   */
  static calculateMultiAgentCommission(
    salePrice: number,
    commissionRate: number,
    agentSplits: CommissionSplit[]
  ): {
    totalCommission: number;
    agentSplits: CommissionSplit[];
    brokerageAmount: number;
    breakdown: CommissionCalculation;
  } {
    const totalCommission = (salePrice * commissionRate) / 100;
    const totalAgentSplit = agentSplits.reduce((sum, split) => sum + split.splitPercentage, 0);
    
    if (totalAgentSplit > 1) {
      throw new Error('Total agent split cannot exceed 100%');
    }
    
    const brokerageSplit = 1 - totalAgentSplit;
    const brokerageAmount = totalCommission * brokerageSplit;
    
    // Calculate individual agent amounts
    const calculatedSplits = agentSplits.map(split => ({
      ...split,
      amount: totalCommission * split.splitPercentage
    }));
    
    const breakdown = this.calculateCommission(
      salePrice,
      commissionRate,
      totalAgentSplit,
      brokerageSplit
    );
    
    return {
      totalCommission,
      agentSplits: calculatedSplits,
      brokerageAmount,
      breakdown
    };
  }

  /**
   * Calculate commission for different property types
   */
  static calculatePropertyTypeCommission(
    salePrice: number,
    propertyType: 'residential' | 'commercial' | 'luxury' | 'investment',
    agentExperience: number
  ): CommissionCalculation {
    let baseRate: number;
    
    switch (propertyType) {
      case 'residential':
        baseRate = 2.5;
        break;
      case 'commercial':
        baseRate = 3.0;
        break;
      case 'luxury':
        baseRate = 2.0; // Lower rate for higher value
        break;
      case 'investment':
        baseRate = 2.8;
        break;
      default:
        baseRate = 2.5;
    }
    
    // Adjust rate based on agent experience
    let adjustedRate = baseRate;
    if (agentExperience >= 10) {
      adjustedRate += 0.2; // Experienced agents get higher rates
    } else if (agentExperience < 2) {
      adjustedRate -= 0.3; // New agents get lower rates
    }
    
    return this.calculateCommission(salePrice, adjustedRate);
  }

  /**
   * Calculate monthly commission projections
   */
  static calculateMonthlyProjections(
    averageSalePrice: number,
    expectedSales: number,
    commissionRate: number,
    agentSplit: number = 0.7
  ): {
    monthly: CommissionCalculation;
    quarterly: CommissionCalculation;
    yearly: CommissionCalculation;
  } {
    const monthlySales = averageSalePrice * expectedSales;
    const quarterlySales = monthlySales * 3;
    const yearlySales = monthlySales * 12;
    
    return {
      monthly: this.calculateCommission(monthlySales, commissionRate, agentSplit),
      quarterly: this.calculateCommission(quarterlySales, commissionRate, agentSplit),
      yearly: this.calculateCommission(yearlySales, commissionRate, agentSplit)
    };
  }

  /**
   * Calculate commission for rental transactions
   */
  static calculateRentalCommission(
    monthlyRent: number,
    leaseTerm: number, // in months
    commissionRate: number = 1.0 // Typically 1 month's rent
  ): CommissionCalculation {
    const totalRent = monthlyRent * leaseTerm;
    const commissionAmount = monthlyRent; // Usually 1 month's rent
    
    return {
      baseAmount: totalRent,
      commissionRate: (commissionAmount / totalRent) * 100,
      commissionAmount,
      agentAmount: commissionAmount * 0.7,
      brokerageAmount: commissionAmount * 0.3,
      taxes: commissionAmount * 0.7 * this.TAX_RATE,
      netAmount: commissionAmount * 0.7 * (1 - this.TAX_RATE),
      breakdown: {
        grossCommission: commissionAmount,
        brokerageSplit: commissionAmount * 0.3,
        agentSplit: commissionAmount * 0.7,
        taxes: commissionAmount * 0.7 * this.TAX_RATE,
        netCommission: commissionAmount * 0.7 * (1 - this.TAX_RATE)
      }
    };
  }

  /**
   * Calculate commission adjustments for various factors
   */
  static calculateAdjustedCommission(
    baseCalculation: CommissionCalculation,
    adjustments: {
      referralFee?: number; // Percentage to referring agent
      marketingFee?: number; // Marketing costs
      transactionFee?: number; // Transaction processing fees
      bonus?: number; // Performance bonus
    }
  ): CommissionCalculation {
    let adjustedAmount = baseCalculation.agentAmount;
    let totalAdjustments = 0;
    
    // Apply adjustments
    if (adjustments.referralFee) {
      const referralAmount = adjustedAmount * (adjustments.referralFee / 100);
      adjustedAmount -= referralAmount;
      totalAdjustments += referralAmount;
    }
    
    if (adjustments.marketingFee) {
      const marketingAmount = adjustedAmount * (adjustments.marketingFee / 100);
      adjustedAmount -= marketingAmount;
      totalAdjustments += marketingAmount;
    }
    
    if (adjustments.transactionFee) {
      adjustedAmount -= adjustments.transactionFee;
      totalAdjustments += adjustments.transactionFee;
    }
    
    if (adjustments.bonus) {
      adjustedAmount += adjustments.bonus;
      totalAdjustments -= adjustments.bonus;
    }
    
    // Recalculate taxes on adjusted amount
    const adjustedTaxes = adjustedAmount * this.TAX_RATE;
    const adjustedNet = adjustedAmount - adjustedTaxes;
    
    return {
      ...baseCalculation,
      agentAmount: adjustedAmount,
      taxes: adjustedTaxes,
      netAmount: adjustedNet,
      breakdown: {
        ...baseCalculation.breakdown,
        agentSplit: adjustedAmount,
        taxes: adjustedTaxes,
        netCommission: adjustedNet
      }
    };
  }

  /**
   * Format commission for display
   */
  static formatCommission(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Calculate commission history summary
   */
  static calculateCommissionSummary(commissions: Commission[]): {
    totalCommission: number;
    averageCommission: number;
    totalTransactions: number;
    monthlyTrend: { month: string; amount: number }[];
    topMonths: { month: string; amount: number }[];
  } {
    const totalCommission = commissions.reduce((sum, comm) => sum + comm.amount, 0);
    const averageCommission = totalCommission / commissions.length;
    const totalTransactions = commissions.length;
    
    // Group by month
    const monthlyData = commissions.reduce((acc, comm) => {
      const month = comm.createdAt.substring(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + comm.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const monthlyTrend = Object.entries(monthlyData)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));
    
    const topMonths = [...monthlyTrend]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
    
    return {
      totalCommission,
      averageCommission,
      totalTransactions,
      monthlyTrend,
      topMonths
    };
  }
}
