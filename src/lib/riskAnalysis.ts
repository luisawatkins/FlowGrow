/**
 * Risk Analysis System for FlowGrow
 * Advanced risk assessment, diversification analysis, and portfolio risk management
 */

import {
  Portfolio,
  PortfolioProperty,
  RiskAnalysis,
  RiskFactor,
  RiskMetrics,
  RiskRecommendation,
  PortfolioAllocation
} from '@/types/portfolio';

export class RiskAnalysisEngine {
  private static readonly MARKET_BETA = 1.0;
  private static readonly RISK_FREE_RATE = 0.02; // 2% annual
  private static readonly MARKET_RETURN = 0.08; // 8% annual

  /**
   * Perform comprehensive risk analysis on a portfolio
   */
  static analyzePortfolioRisk(portfolio: Portfolio): RiskAnalysis {
    const riskFactors = this.identifyRiskFactors(portfolio);
    const riskMetrics = this.calculateRiskMetrics(portfolio);
    const recommendations = this.generateRiskRecommendations(portfolio, riskFactors, riskMetrics);

    const overallRisk = this.calculateOverallRisk(riskMetrics, riskFactors);

    return {
      portfolioId: portfolio.id,
      overallRisk,
      systematicRisk: this.calculateSystematicRisk(portfolio),
      unsystematicRisk: this.calculateUnsystematicRisk(portfolio),
      concentrationRisk: this.calculateConcentrationRisk(portfolio),
      liquidityRisk: this.calculateLiquidityRisk(portfolio),
      marketRisk: this.calculateMarketRisk(portfolio),
      creditRisk: this.calculateCreditRisk(portfolio),
      operationalRisk: this.calculateOperationalRisk(portfolio),
      riskFactors,
      riskMetrics,
      recommendations
    };
  }

  /**
   * Identify risk factors affecting the portfolio
   */
  private static identifyRiskFactors(portfolio: Portfolio): RiskFactor[] {
    const riskFactors: RiskFactor[] = [];

    // Market risk factors
    const marketRisk = this.assessMarketRisk(portfolio);
    if (marketRisk.impact !== 'low') {
      riskFactors.push({
        name: 'Market Volatility',
        type: 'market',
        impact: marketRisk.impact,
        probability: marketRisk.probability,
        description: 'Portfolio is exposed to general market movements and economic cycles',
        mitigation: [
          'Diversify across different property types',
          'Consider hedging strategies',
          'Maintain adequate cash reserves'
        ]
      });
    }

    // Concentration risk factors
    const concentrationRisk = this.assessConcentrationRisk(portfolio);
    if (concentrationRisk.impact !== 'low') {
      riskFactors.push({
        name: 'Geographic Concentration',
        type: 'concentration',
        impact: concentrationRisk.impact,
        probability: concentrationRisk.probability,
        description: 'Portfolio is heavily concentrated in specific geographic areas',
        mitigation: [
          'Diversify across multiple markets',
          'Consider REITs for broader exposure',
          'Monitor local market conditions'
        ]
      });
    }

    // Liquidity risk factors
    const liquidityRisk = this.assessLiquidityRisk(portfolio);
    if (liquidityRisk.impact !== 'low') {
      riskFactors.push({
        name: 'Low Liquidity',
        type: 'liquidity',
        impact: liquidityRisk.impact,
        probability: liquidityRisk.probability,
        description: 'Portfolio may face challenges in quickly converting assets to cash',
        mitigation: [
          'Maintain liquid reserves',
          'Consider REIT investments',
          'Plan for longer holding periods'
        ]
      });
    }

    // Credit risk factors
    const creditRisk = this.assessCreditRisk(portfolio);
    if (creditRisk.impact !== 'low') {
      riskFactors.push({
        name: 'High Leverage',
        type: 'credit',
        impact: creditRisk.impact,
        probability: creditRisk.probability,
        description: 'Portfolio has high debt levels increasing credit risk',
        mitigation: [
          'Reduce leverage ratios',
          'Improve debt service coverage',
          'Refinance at better terms'
        ]
      });
    }

    // Operational risk factors
    const operationalRisk = this.assessOperationalRisk(portfolio);
    if (operationalRisk.impact !== 'low') {
      riskFactors.push({
        name: 'Operational Complexity',
        type: 'operational',
        impact: operationalRisk.impact,
        probability: operationalRisk.probability,
        description: 'Portfolio requires significant operational management',
        mitigation: [
          'Hire professional property management',
          'Implement automated systems',
          'Regular property inspections'
        ]
      });
    }

    return riskFactors;
  }

  /**
   * Calculate comprehensive risk metrics
   */
  private static calculateRiskMetrics(portfolio: Portfolio): RiskMetrics {
    const returns = this.calculateHistoricalReturns(portfolio);
    const benchmarkReturns = this.calculateBenchmarkReturns(portfolio);

    const volatility = this.calculateVolatility(returns);
    const beta = this.calculateBeta(returns, benchmarkReturns);
    const correlation = this.calculateCorrelation(returns, benchmarkReturns);

    const sharpeRatio = this.calculateSharpeRatio(returns);
    const sortinoRatio = this.calculateSortinoRatio(returns);
    const calmarRatio = this.calculateCalmarRatio(returns);
    const informationRatio = this.calculateInformationRatio(returns, benchmarkReturns);

    const valueAtRisk = this.calculateValueAtRisk(returns);
    const expectedShortfall = this.calculateExpectedShortfall(returns);
    const maxDrawdown = this.calculateMaxDrawdown(returns);

    const concentrationIndex = this.calculateConcentrationIndex(portfolio);
    const herfindahlIndex = this.calculateHerfindahlIndex(portfolio);

    const trackingError = this.calculateTrackingError(returns, benchmarkReturns);

    return {
      valueAtRisk,
      expectedShortfall,
      maximumDrawdown: maxDrawdown,
      volatility,
      beta,
      sharpeRatio,
      sortinoRatio,
      calmarRatio,
      informationRatio,
      trackingError,
      correlationWithMarket: correlation,
      concentrationIndex,
      herfindahlIndex
    };
  }

  /**
   * Generate risk management recommendations
   */
  private static generateRiskRecommendations(
    portfolio: Portfolio,
    riskFactors: RiskFactor[],
    riskMetrics: RiskMetrics
  ): RiskRecommendation[] {
    const recommendations: RiskRecommendation[] = [];

    // Diversification recommendations
    if (riskMetrics.concentrationIndex > 0.7) {
      recommendations.push({
        type: 'diversification',
        priority: 'high',
        description: 'Portfolio is highly concentrated in specific assets or locations',
        action: 'Diversify across different property types, locations, and investment strategies',
        expectedImpact: 0.3,
        implementation: [
          'Add properties in different geographic markets',
          'Consider different property types (residential, commercial, industrial)',
          'Include REITs for broader market exposure',
          'Set maximum allocation limits per property/location'
        ]
      });
    }

    // Risk management recommendations
    if (riskMetrics.beta > 1.2) {
      recommendations.push({
        type: 'risk_management',
        priority: 'medium',
        description: 'Portfolio has high market sensitivity (beta > 1.2)',
        action: 'Reduce market sensitivity through defensive investments',
        expectedImpact: 0.2,
        implementation: [
          'Add defensive property types (e.g., essential retail, healthcare)',
          'Consider fixed-income real estate investments',
          'Implement hedging strategies',
          'Increase cash reserves'
        ]
      });
    }

    // Rebalancing recommendations
    if (this.shouldRebalance(portfolio)) {
      recommendations.push({
        type: 'rebalancing',
        priority: 'medium',
        description: 'Portfolio allocation has drifted from target allocation',
        action: 'Rebalance portfolio to maintain target allocation',
        expectedImpact: 0.15,
        implementation: [
          'Calculate required trades to achieve target allocation',
          'Consider tax implications of rebalancing',
          'Implement gradual rebalancing to minimize transaction costs',
          'Update rebalancing schedule'
        ]
      });
    }

    // Hedging recommendations
    if (riskMetrics.valueAtRisk > portfolio.totalValue * 0.1) {
      recommendations.push({
        type: 'hedging',
        priority: 'high',
        description: 'Portfolio has high Value at Risk (>10% of portfolio value)',
        action: 'Implement hedging strategies to reduce downside risk',
        expectedImpact: 0.25,
        implementation: [
          'Consider real estate derivatives',
          'Add inverse correlation assets',
          'Implement stop-loss strategies',
          'Increase diversification'
        ]
      });
    }

    return recommendations;
  }

  // Risk calculation methods
  private static calculateOverallRisk(riskMetrics: RiskMetrics, riskFactors: RiskFactor[]): number {
    const riskScore = (
      riskMetrics.volatility * 0.3 +
      riskMetrics.beta * 0.2 +
      riskMetrics.concentrationIndex * 0.2 +
      (riskMetrics.valueAtRisk / 1000000) * 0.15 + // Normalize VaR
      riskFactors.filter(f => f.impact === 'high' || f.impact === 'critical').length * 0.15
    );

    return Math.min(riskScore, 1.0); // Cap at 1.0
  }

  private static calculateSystematicRisk(portfolio: Portfolio): number {
    const returns = this.calculateHistoricalReturns(portfolio);
    const benchmarkReturns = this.calculateBenchmarkReturns(portfolio);
    const beta = this.calculateBeta(returns, benchmarkReturns);
    
    return beta * this.MARKET_BETA;
  }

  private static calculateUnsystematicRisk(portfolio: Portfolio): number {
    const returns = this.calculateHistoricalReturns(portfolio);
    const benchmarkReturns = this.calculateBenchmarkReturns(portfolio);
    const beta = this.calculateBeta(returns, benchmarkReturns);
    const portfolioVariance = this.calculateVariance(returns);
    const marketVariance = this.calculateVariance(benchmarkReturns);
    
    return portfolioVariance - (beta * beta * marketVariance);
  }

  private static calculateConcentrationRisk(portfolio: Portfolio): number {
    const allocation = portfolio.currentAllocation;
    const weights = [
      allocation.residential,
      allocation.commercial,
      allocation.industrial,
      allocation.land,
      allocation.reits,
      allocation.other
    ];
    
    // Calculate Herfindahl-Hirschman Index
    const hhi = weights.reduce((sum, weight) => sum + weight * weight, 0);
    return hhi / 10000; // Normalize to 0-1 scale
  }

  private static calculateLiquidityRisk(portfolio: Portfolio): number {
    const totalValue = portfolio.totalValue;
    const liquidAssets = portfolio.properties
      .filter(p => p.property.metadata?.liquidity === 'high')
      .reduce((sum, p) => sum + p.currentValue, 0);
    
    return 1 - (liquidAssets / totalValue);
  }

  private static calculateMarketRisk(portfolio: Portfolio): number {
    const returns = this.calculateHistoricalReturns(portfolio);
    const volatility = this.calculateVolatility(returns);
    
    return Math.min(volatility / 0.2, 1.0); // Normalize to 0-1 scale
  }

  private static calculateCreditRisk(portfolio: Portfolio): number {
    const avgLeverage = portfolio.properties.reduce((sum, p) => {
      const leverage = p.property.metadata?.loanAmount 
        ? p.property.metadata.loanAmount / p.currentValue 
        : 0;
      return sum + leverage;
    }, 0) / portfolio.properties.length;
    
    return Math.min(avgLeverage, 1.0);
  }

  private static calculateOperationalRisk(portfolio: Portfolio): number {
    const complexityScore = portfolio.properties.reduce((sum, p) => {
      let score = 0;
      if (p.property.metadata?.propertyType === 'commercial') score += 0.3;
      if (p.property.metadata?.units > 10) score += 0.2;
      if (p.property.metadata?.age > 20) score += 0.2;
      if (p.monthlyRent && p.monthlyRent > 5000) score += 0.1;
      return sum + score;
    }, 0) / portfolio.properties.length;
    
    return Math.min(complexityScore, 1.0);
  }

  // Statistical calculation methods
  private static calculateHistoricalReturns(portfolio: Portfolio): number[] {
    // Simplified calculation - in practice, this would use actual historical data
    const returns: number[] = [];
    const months = 12; // Last 12 months
    
    for (let i = 0; i < months; i++) {
      const monthlyReturn = portfolio.properties.reduce((sum, p) => {
        const propertyReturn = (p.totalReturnPercentage / 100) / 12; // Monthly return
        return sum + propertyReturn * (p.currentValue / portfolio.totalValue);
      }, 0);
      returns.push(monthlyReturn);
    }
    
    return returns;
  }

  private static calculateBenchmarkReturns(portfolio: Portfolio): number[] {
    // Simplified benchmark returns - in practice, this would use actual benchmark data
    const returns: number[] = [];
    const months = 12;
    
    for (let i = 0; i < months; i++) {
      // Simulate benchmark returns (e.g., REIT index)
      const benchmarkReturn = (this.MARKET_RETURN / 12) + (Math.random() - 0.5) * 0.02;
      returns.push(benchmarkReturn);
    }
    
    return returns;
  }

  private static calculateVolatility(returns: number[]): number {
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    return Math.sqrt(variance);
  }

  private static calculateBeta(portfolioReturns: number[], marketReturns: number[]): number {
    const portfolioMean = portfolioReturns.reduce((sum, r) => sum + r, 0) / portfolioReturns.length;
    const marketMean = marketReturns.reduce((sum, r) => sum + r, 0) / marketReturns.length;
    
    let covariance = 0;
    let marketVariance = 0;
    
    for (let i = 0; i < portfolioReturns.length; i++) {
      covariance += (portfolioReturns[i] - portfolioMean) * (marketReturns[i] - marketMean);
      marketVariance += Math.pow(marketReturns[i] - marketMean, 2);
    }
    
    return covariance / marketVariance;
  }

  private static calculateCorrelation(returns1: number[], returns2: number[]): number {
    const mean1 = returns1.reduce((sum, r) => sum + r, 0) / returns1.length;
    const mean2 = returns2.reduce((sum, r) => sum + r, 0) / returns2.length;
    
    let numerator = 0;
    let sumSq1 = 0;
    let sumSq2 = 0;
    
    for (let i = 0; i < returns1.length; i++) {
      const diff1 = returns1[i] - mean1;
      const diff2 = returns2[i] - mean2;
      numerator += diff1 * diff2;
      sumSq1 += diff1 * diff1;
      sumSq2 += diff2 * diff2;
    }
    
    return numerator / Math.sqrt(sumSq1 * sumSq2);
  }

  private static calculateSharpeRatio(returns: number[]): number {
    const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const volatility = this.calculateVolatility(returns);
    return (meanReturn - this.RISK_FREE_RATE / 12) / volatility;
  }

  private static calculateSortinoRatio(returns: number[]): number {
    const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const downsideReturns = returns.filter(r => r < 0);
    const downsideDeviation = this.calculateVolatility(downsideReturns);
    return (meanReturn - this.RISK_FREE_RATE / 12) / downsideDeviation;
  }

  private static calculateCalmarRatio(returns: number[]): number {
    const annualizedReturn = returns.reduce((sum, r) => sum + r, 0) * 12;
    const maxDrawdown = this.calculateMaxDrawdown(returns);
    return annualizedReturn / Math.abs(maxDrawdown);
  }

  private static calculateInformationRatio(portfolioReturns: number[], benchmarkReturns: number[]): number {
    const excessReturns = portfolioReturns.map((r, i) => r - benchmarkReturns[i]);
    const meanExcessReturn = excessReturns.reduce((sum, r) => sum + r, 0) / excessReturns.length;
    const trackingError = this.calculateTrackingError(portfolioReturns, benchmarkReturns);
    return meanExcessReturn / trackingError;
  }

  private static calculateValueAtRisk(returns: number[], confidenceLevel: number = 0.05): number {
    const sortedReturns = [...returns].sort((a, b) => a - b);
    const index = Math.floor(confidenceLevel * sortedReturns.length);
    return sortedReturns[index];
  }

  private static calculateExpectedShortfall(returns: number[], confidenceLevel: number = 0.05): number {
    const varValue = this.calculateValueAtRisk(returns, confidenceLevel);
    const tailReturns = returns.filter(r => r <= varValue);
    return tailReturns.reduce((sum, r) => sum + r, 0) / tailReturns.length;
  }

  private static calculateMaxDrawdown(returns: number[]): number {
    let maxDrawdown = 0;
    let peak = 0;
    let cumulativeReturn = 0;
    
    for (const return_ of returns) {
      cumulativeReturn += return_;
      if (cumulativeReturn > peak) {
        peak = cumulativeReturn;
      }
      const drawdown = peak - cumulativeReturn;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }
    
    return maxDrawdown;
  }

  private static calculateConcentrationIndex(portfolio: Portfolio): number {
    const weights = portfolio.properties.map(p => p.currentValue / portfolio.totalValue);
    const sortedWeights = weights.sort((a, b) => b - a);
    
    // Calculate concentration index (sum of squared weights)
    return sortedWeights.reduce((sum, weight) => sum + weight * weight, 0);
  }

  private static calculateHerfindahlIndex(portfolio: Portfolio): number {
    const allocation = portfolio.currentAllocation;
    const weights = [
      allocation.residential,
      allocation.commercial,
      allocation.industrial,
      allocation.land,
      allocation.reits,
      allocation.other
    ];
    
    return weights.reduce((sum, weight) => sum + weight * weight, 0);
  }

  private static calculateTrackingError(portfolioReturns: number[], benchmarkReturns: number[]): number {
    const excessReturns = portfolioReturns.map((r, i) => r - benchmarkReturns[i]);
    return this.calculateVolatility(excessReturns);
  }

  private static calculateVariance(returns: number[]): number {
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    return returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
  }

  // Risk assessment helper methods
  private static assessMarketRisk(portfolio: Portfolio): { impact: 'low' | 'medium' | 'high' | 'critical', probability: number } {
    const beta = this.calculateBeta(
      this.calculateHistoricalReturns(portfolio),
      this.calculateBenchmarkReturns(portfolio)
    );
    
    if (beta > 1.5) return { impact: 'high', probability: 0.8 };
    if (beta > 1.2) return { impact: 'medium', probability: 0.6 };
    if (beta > 0.8) return { impact: 'low', probability: 0.4 };
    return { impact: 'low', probability: 0.3 };
  }

  private static assessConcentrationRisk(portfolio: Portfolio): { impact: 'low' | 'medium' | 'high' | 'critical', probability: number } {
    const concentrationIndex = this.calculateConcentrationIndex(portfolio);
    
    if (concentrationIndex > 0.5) return { impact: 'critical', probability: 0.9 };
    if (concentrationIndex > 0.3) return { impact: 'high', probability: 0.7 };
    if (concentrationIndex > 0.2) return { impact: 'medium', probability: 0.5 };
    return { impact: 'low', probability: 0.3 };
  }

  private static assessLiquidityRisk(portfolio: Portfolio): { impact: 'low' | 'medium' | 'high' | 'critical', probability: number } {
    const liquidityRisk = this.calculateLiquidityRisk(portfolio);
    
    if (liquidityRisk > 0.8) return { impact: 'critical', probability: 0.9 };
    if (liquidityRisk > 0.6) return { impact: 'high', probability: 0.7 };
    if (liquidityRisk > 0.4) return { impact: 'medium', probability: 0.5 };
    return { impact: 'low', probability: 0.3 };
  }

  private static assessCreditRisk(portfolio: Portfolio): { impact: 'low' | 'medium' | 'high' | 'critical', probability: number } {
    const creditRisk = this.calculateCreditRisk(portfolio);
    
    if (creditRisk > 0.8) return { impact: 'critical', probability: 0.9 };
    if (creditRisk > 0.6) return { impact: 'high', probability: 0.7 };
    if (creditRisk > 0.4) return { impact: 'medium', probability: 0.5 };
    return { impact: 'low', probability: 0.3 };
  }

  private static assessOperationalRisk(portfolio: Portfolio): { impact: 'low' | 'medium' | 'high' | 'critical', probability: number } {
    const operationalRisk = this.calculateOperationalRisk(portfolio);
    
    if (operationalRisk > 0.7) return { impact: 'high', probability: 0.8 };
    if (operationalRisk > 0.5) return { impact: 'medium', probability: 0.6 };
    if (operationalRisk > 0.3) return { impact: 'low', probability: 0.4 };
    return { impact: 'low', probability: 0.2 };
  }

  private static shouldRebalance(portfolio: Portfolio): boolean {
    if (!portfolio.targetAllocation) return false;
    
    const current = portfolio.currentAllocation;
    const target = portfolio.targetAllocation;
    
    const threshold = 0.05; // 5% threshold
    
    return (
      Math.abs(current.residential - target.residential) > threshold ||
      Math.abs(current.commercial - target.commercial) > threshold ||
      Math.abs(current.industrial - target.industrial) > threshold ||
      Math.abs(current.land - target.land) > threshold ||
      Math.abs(current.reits - target.reits) > threshold ||
      Math.abs(current.other - target.other) > threshold
    );
  }
}

export default RiskAnalysisEngine;
