import { Agent, Commission } from '../types/agent'

export interface CommissionCalculation {
  baseCommission: number
  agentCommission: number
  brokerageCommission: number
  totalCommission: number
  agentPercentage: number
  brokeragePercentage: number
}

export interface CommissionTier {
  minValue: number
  maxValue?: number
  agentRate: number
  brokerageRate: number
}

export class CommissionCalculator {
  // Standard commission tiers (can be customized per brokerage)
  private static readonly DEFAULT_TIERS: CommissionTier[] = [
    { minValue: 0, maxValue: 100000, agentRate: 0.025, brokerageRate: 0.025 }, // 2.5% each
    { minValue: 100000, maxValue: 500000, agentRate: 0.03, brokerageRate: 0.03 }, // 3% each
    { minValue: 500000, maxValue: 1000000, agentRate: 0.035, brokerageRate: 0.035 }, // 3.5% each
    { minValue: 1000000, agentRate: 0.04, brokerageRate: 0.04 }, // 4% each
  ]

  /**
   * Calculate commission for a property sale
   */
  static calculateCommission(
    propertyValue: number,
    agent: Agent,
    customTiers?: CommissionTier[]
  ): CommissionCalculation {
    const tiers = customTiers || this.DEFAULT_TIERS
    const tier = this.findApplicableTier(propertyValue, tiers)
    
    const baseCommission = propertyValue * (tier.agentRate + tier.brokerageRate)
    const agentCommission = propertyValue * tier.agentRate
    const brokerageCommission = propertyValue * tier.brokerageRate

    return {
      baseCommission,
      agentCommission,
      brokerageCommission,
      totalCommission: baseCommission,
      agentPercentage: tier.agentRate,
      brokeragePercentage: tier.brokerageRate,
    }
  }

  /**
   * Calculate commission with agent-specific rate override
   */
  static calculateCommissionWithAgentRate(
    propertyValue: number,
    agentRate: number,
    brokerageRate: number
  ): CommissionCalculation {
    const baseCommission = propertyValue * (agentRate + brokerageRate)
    const agentCommission = propertyValue * agentRate
    const brokerageCommission = propertyValue * brokerageRate

    return {
      baseCommission,
      agentCommission,
      brokerageCommission,
      totalCommission: baseCommission,
      agentPercentage: agentRate,
      brokeragePercentage: brokerageRate,
    }
  }

  /**
   * Calculate split commission for co-listing agents
   */
  static calculateSplitCommission(
    propertyValue: number,
    listingAgent: Agent,
    sellingAgent: Agent,
    splitRatio: { listing: number; selling: number } = { listing: 0.5, selling: 0.5 }
  ): {
    listingAgent: CommissionCalculation
    sellingAgent: CommissionCalculation
    totalCommission: number
  } {
    const listingCommission = this.calculateCommission(propertyValue, listingAgent)
    const sellingCommission = this.calculateCommission(propertyValue, sellingAgent)

    const totalCommission = listingCommission.totalCommission + sellingCommission.totalCommission

    return {
      listingAgent: {
        ...listingCommission,
        agentCommission: listingCommission.agentCommission * splitRatio.listing,
        totalCommission: listingCommission.totalCommission * splitRatio.listing,
      },
      sellingAgent: {
        ...sellingCommission,
        agentCommission: sellingCommission.agentCommission * splitRatio.selling,
        totalCommission: sellingCommission.totalCommission * splitRatio.selling,
      },
      totalCommission,
    }
  }

  /**
   * Calculate monthly commission projections
   */
  static calculateMonthlyProjections(
    agent: Agent,
    expectedSales: number,
    averageSalePrice: number
  ): {
    projectedCommission: number
    projectedSales: number
    projectedValue: number
    averageCommission: number
  } {
    const averageCommission = this.calculateCommission(averageSalePrice, agent)
    const projectedSales = expectedSales
    const projectedValue = expectedSales * averageSalePrice
    const projectedCommission = expectedSales * averageCommission.agentCommission

    return {
      projectedCommission,
      projectedSales,
      projectedValue,
      averageCommission: averageCommission.agentCommission,
    }
  }

  /**
   * Calculate year-to-date commission summary
   */
  static calculateYearToDateSummary(commissions: Commission[]): {
    totalCommission: number
    totalSales: number
    averageCommission: number
    monthlyBreakdown: Record<string, number>
    topMonths: Array<{ month: string; amount: number }>
  } {
    const currentYear = new Date().getFullYear()
    const yearCommissions = commissions.filter(
      c => new Date(c.createdAt).getFullYear() === currentYear
    )

    const totalCommission = yearCommissions.reduce((sum, c) => sum + c.amount, 0)
    const totalSales = yearCommissions.length
    const averageCommission = totalSales > 0 ? totalCommission / totalSales : 0

    // Monthly breakdown
    const monthlyBreakdown: Record<string, number> = {}
    yearCommissions.forEach(commission => {
      const month = new Date(commission.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      })
      monthlyBreakdown[month] = (monthlyBreakdown[month] || 0) + commission.amount
    })

    // Top months
    const topMonths = Object.entries(monthlyBreakdown)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3)

    return {
      totalCommission,
      totalSales,
      averageCommission,
      monthlyBreakdown,
      topMonths,
    }
  }

  /**
   * Calculate commission goals and performance
   */
  static calculateGoalPerformance(
    actualCommissions: Commission[],
    monthlyGoal: number,
    yearlyGoal: number
  ): {
    monthlyProgress: number
    yearlyProgress: number
    monthlyRemaining: number
    yearlyRemaining: number
    projectedYearly: number
    goalStatus: 'on_track' | 'behind' | 'ahead'
  } {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Monthly calculations
    const monthlyCommissions = actualCommissions.filter(
      c => new Date(c.createdAt).getMonth() === currentMonth &&
           new Date(c.createdAt).getFullYear() === currentYear
    )
    const monthlyActual = monthlyCommissions.reduce((sum, c) => sum + c.amount, 0)
    const monthlyProgress = monthlyGoal > 0 ? (monthlyActual / monthlyGoal) * 100 : 0
    const monthlyRemaining = Math.max(0, monthlyGoal - monthlyActual)

    // Yearly calculations
    const yearlyCommissions = actualCommissions.filter(
      c => new Date(c.createdAt).getFullYear() === currentYear
    )
    const yearlyActual = yearlyCommissions.reduce((sum, c) => sum + c.amount, 0)
    const yearlyProgress = yearlyGoal > 0 ? (yearlyActual / yearlyGoal) * 100 : 0
    const yearlyRemaining = Math.max(0, yearlyGoal - yearlyActual)

    // Projected yearly based on current pace
    const monthsElapsed = currentMonth + 1
    const projectedYearly = monthsElapsed > 0 ? (yearlyActual / monthsElapsed) * 12 : 0

    // Goal status
    let goalStatus: 'on_track' | 'behind' | 'ahead' = 'on_track'
    if (projectedYearly < yearlyGoal * 0.9) {
      goalStatus = 'behind'
    } else if (projectedYearly > yearlyGoal * 1.1) {
      goalStatus = 'ahead'
    }

    return {
      monthlyProgress,
      yearlyProgress,
      monthlyRemaining,
      yearlyRemaining,
      projectedYearly,
      goalStatus,
    }
  }

  /**
   * Find the applicable commission tier for a property value
   */
  private static findApplicableTier(propertyValue: number, tiers: CommissionTier[]): CommissionTier {
    return tiers.find(tier => 
      propertyValue >= tier.minValue && 
      (tier.maxValue === undefined || propertyValue <= tier.maxValue)
    ) || tiers[tiers.length - 1] // Fallback to highest tier
  }

  /**
   * Validate commission calculation
   */
  static validateCommission(calculation: CommissionCalculation): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (calculation.agentCommission < 0) {
      errors.push('Agent commission cannot be negative')
    }

    if (calculation.brokerageCommission < 0) {
      errors.push('Brokerage commission cannot be negative')
    }

    if (calculation.totalCommission !== calculation.agentCommission + calculation.brokerageCommission) {
      errors.push('Total commission does not match sum of agent and brokerage commissions')
    }

    if (calculation.agentPercentage < 0 || calculation.agentPercentage > 1) {
      errors.push('Agent percentage must be between 0 and 1')
    }

    if (calculation.brokeragePercentage < 0 || calculation.brokeragePercentage > 1) {
      errors.push('Brokerage percentage must be between 0 and 1')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}