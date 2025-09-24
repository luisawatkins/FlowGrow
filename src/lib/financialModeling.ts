/**
 * Financial Modeling Engine for FlowGrow
 * Advanced financial calculations, Monte Carlo simulations, and scenario analysis
 */

import {
  ModelInputs,
  ModelAssumptions,
  ModelOutputs,
  SensitivityAnalysis,
  ScenarioAnalysis,
  MonteCarloResults,
  SensitivityVariable,
  TornadoChartData,
  SpiderChartData,
  Scenario,
  ScenarioSummary
} from '@/types/portfolio';

export class FinancialModelingEngine {
  private static readonly DEFAULT_ITERATIONS = 10000;
  private static readonly CONFIDENCE_LEVELS = [0.05, 0.10, 0.25, 0.75, 0.90, 0.95];

  /**
   * Calculate comprehensive financial metrics for a property investment
   */
  static calculateModelOutputs(inputs: ModelInputs, assumptions: ModelAssumptions): ModelOutputs {
    const {
      propertyValue,
      purchasePrice,
      downPayment,
      loanAmount,
      interestRate,
      loanTerm,
      monthlyRent,
      vacancyRate,
      operatingExpenses,
      capitalExpenditures,
      appreciationRate,
      taxRate,
      depreciationRate
    } = inputs;

    const {
      holdingPeriod,
      exitCapRate,
      rentGrowthRate,
      expenseGrowthRate,
      marketGrowthRate,
      riskFreeRate,
      marketRiskPremium,
      beta
    } = assumptions;

    // Basic calculations
    const monthlyPayment = this.calculateMonthlyPayment(loanAmount, interestRate, loanTerm);
    const annualPayment = monthlyPayment * 12;
    
    // Income calculations
    const grossAnnualRent = monthlyRent * 12;
    const vacancyLoss = grossAnnualRent * (vacancyRate / 100);
    const effectiveGrossIncome = grossAnnualRent - vacancyLoss;
    const netOperatingIncome = effectiveGrossIncome - operatingExpenses;
    
    // Cash flow calculations
    const annualCashFlow = netOperatingIncome - annualPayment;
    const monthlyCashFlow = annualCashFlow / 12;
    
    // Return calculations
    const capRate = (netOperatingIncome / propertyValue) * 100;
    const cashOnCashReturn = (annualCashFlow / downPayment) * 100;
    const grossRentMultiplier = propertyValue / grossAnnualRent;
    
    // DCF calculations
    const cashFlows = this.calculateCashFlows(
      inputs,
      assumptions,
      holdingPeriod
    );
    
    const npv = this.calculateNPV(cashFlows, riskFreeRate + marketRiskPremium);
    const irr = this.calculateIRR(cashFlows);
    const mirr = this.calculateMIRR(cashFlows, riskFreeRate, marketRiskPremium);
    
    // Exit calculations
    const exitValue = this.calculateExitValue(
      propertyValue,
      appreciationRate,
      exitCapRate,
      holdingPeriod,
      netOperatingIncome,
      rentGrowthRate,
      expenseGrowthRate
    );
    
    const totalCashFlow = cashFlows.reduce((sum, cf) => sum + cf, 0);
    const equityMultiple = (totalCashFlow + exitValue) / downPayment;
    const paybackPeriod = this.calculatePaybackPeriod(cashFlows, downPayment);
    
    // Risk metrics
    const debtServiceCoverageRatio = netOperatingIncome / annualPayment;
    const loanToValueRatio = (loanAmount / propertyValue) * 100;
    const debtYield = (netOperatingIncome / loanAmount) * 100;
    const returnOnEquity = (annualCashFlow / (propertyValue - loanAmount)) * 100;
    const returnOnInvestment = (annualCashFlow / downPayment) * 100;
    
    // Price per square foot (if available)
    const pricePerSquareFoot = inputs.metadata?.squareFootage 
      ? propertyValue / inputs.metadata.squareFootage 
      : 0;

    return {
      netPresentValue: npv,
      internalRateOfReturn: irr,
      cashOnCashReturn,
      capRate,
      grossRentMultiplier,
      pricePerSquareFoot,
      monthlyCashFlow,
      annualCashFlow,
      totalCashFlow,
      equityMultiple,
      paybackPeriod,
      modifiedInternalRateOfReturn: mirr,
      netOperatingIncome,
      debtServiceCoverageRatio,
      loanToValueRatio,
      debtYield,
      returnOnEquity,
      returnOnInvestment
    };
  }

  /**
   * Perform sensitivity analysis on key variables
   */
  static performSensitivityAnalysis(
    baseInputs: ModelInputs,
    baseAssumptions: ModelAssumptions,
    variables: SensitivityVariable[]
  ): SensitivityAnalysis {
    const baseOutputs = this.calculateModelOutputs(baseInputs, baseAssumptions);
    const baseNPV = baseOutputs.netPresentValue;

    // Calculate sensitivity for each variable
    const sensitivityResults = variables.map(variable => {
      const impacts: number[] = [];
      
      // Test different values for the variable
      for (let value = variable.minValue; value <= variable.maxValue; value += variable.step) {
        const modifiedInputs = this.modifyInputs(baseInputs, variable.name, value);
        const modifiedAssumptions = this.modifyAssumptions(baseAssumptions, variable.name, value);
        const outputs = this.calculateModelOutputs(modifiedInputs, modifiedAssumptions);
        impacts.push(outputs.netPresentValue - baseNPV);
      }

      const maxImpact = Math.max(...impacts);
      const minImpact = Math.min(...impacts);
      const sensitivity = (maxImpact - minImpact) / (variable.maxValue - variable.minValue);

      return {
        ...variable,
        impact: maxImpact - minImpact,
        sensitivity
      };
    });

    // Generate tornado chart data
    const tornadoChart: TornadoChartData[] = sensitivityResults
      .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
      .map(variable => ({
        variable: variable.name,
        positiveImpact: variable.impact > 0 ? variable.impact : 0,
        negativeImpact: variable.impact < 0 ? Math.abs(variable.impact) : 0,
        range: Math.abs(variable.impact)
      }));

    // Generate spider chart data
    const spiderChart: SpiderChartData[] = sensitivityResults.map(variable => {
      const values: number[] = [];
      const npvImpact: number[] = [];
      
      for (let value = variable.minValue; value <= variable.maxValue; value += variable.step) {
        values.push(value);
        const modifiedInputs = this.modifyInputs(baseInputs, variable.name, value);
        const modifiedAssumptions = this.modifyAssumptions(baseAssumptions, variable.name, value);
        const outputs = this.calculateModelOutputs(modifiedInputs, modifiedAssumptions);
        npvImpact.push(outputs.netPresentValue);
      }

      return {
        variable: variable.name,
        values,
        npvImpact
      };
    });

    // Perform Monte Carlo simulation
    const monteCarloResults = this.performMonteCarloSimulation(
      baseInputs,
      baseAssumptions,
      variables,
      this.DEFAULT_ITERATIONS
    );

    return {
      variables: sensitivityResults,
      tornadoChart,
      spiderChart,
      monteCarloResults
    };
  }

  /**
   * Perform Monte Carlo simulation
   */
  static performMonteCarloSimulation(
    baseInputs: ModelInputs,
    baseAssumptions: ModelAssumptions,
    variables: SensitivityVariable[],
    iterations: number = this.DEFAULT_ITERATIONS
  ): MonteCarloResults {
    const npvResults: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      // Generate random values for each variable
      const randomInputs = { ...baseInputs };
      const randomAssumptions = { ...baseAssumptions };
      
      variables.forEach(variable => {
        const randomValue = this.generateRandomValue(
          variable.minValue,
          variable.maxValue,
          variable.baseValue
        );
        
        this.modifyInputs(randomInputs, variable.name, randomValue);
        this.modifyAssumptions(randomAssumptions, variable.name, randomValue);
      });
      
      const outputs = this.calculateModelOutputs(randomInputs, randomAssumptions);
      npvResults.push(outputs.netPresentValue);
    }

    // Calculate statistics
    const sortedResults = npvResults.sort((a, b) => a - b);
    const mean = npvResults.reduce((sum, val) => sum + val, 0) / iterations;
    const median = sortedResults[Math.floor(iterations / 2)];
    const variance = npvResults.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / iterations;
    const standardDeviation = Math.sqrt(variance);

    // Calculate confidence intervals
    const confidenceIntervals = {
      p5: sortedResults[Math.floor(iterations * 0.05)],
      p10: sortedResults[Math.floor(iterations * 0.10)],
      p25: sortedResults[Math.floor(iterations * 0.25)],
      p75: sortedResults[Math.floor(iterations * 0.75)],
      p90: sortedResults[Math.floor(iterations * 0.90)],
      p95: sortedResults[Math.floor(iterations * 0.95)]
    };

    const positiveReturns = npvResults.filter(val => val > 0).length;
    const probabilityOfPositiveReturn = positiveReturns / iterations;

    const valueAtRisk = confidenceIntervals.p5;
    const expectedShortfall = sortedResults
      .slice(0, Math.floor(iterations * 0.05))
      .reduce((sum, val) => sum + val, 0) / Math.floor(iterations * 0.05);

    return {
      iterations,
      meanNPV: mean,
      medianNPV: median,
      standardDeviation,
      confidenceIntervals,
      probabilityOfPositiveReturn,
      valueAtRisk,
      expectedShortfall,
      distribution: sortedResults
    };
  }

  /**
   * Perform scenario analysis
   */
  static performScenarioAnalysis(
    baseInputs: ModelInputs,
    baseAssumptions: ModelAssumptions,
    scenarios: Omit<Scenario, 'outputs' | 'keyMetrics'>[]
  ): ScenarioAnalysis {
    const scenarioResults: Scenario[] = scenarios.map(scenario => {
      const modifiedInputs = { ...baseInputs, ...scenario.inputs };
      const outputs = this.calculateModelOutputs(modifiedInputs, baseAssumptions);
      
      const keyMetrics = {
        npv: outputs.netPresentValue,
        irr: outputs.internalRateOfReturn,
        cashFlow: outputs.annualCashFlow,
        risk: this.calculateRiskScore(outputs, modifiedInputs)
      };

      return {
        ...scenario,
        outputs,
        keyMetrics
      };
    });

    // Calculate summary statistics
    const expectedNPV = scenarioResults.reduce(
      (sum, scenario) => sum + (scenario.outputs.netPresentValue * scenario.probability), 0
    );
    
    const expectedIRR = scenarioResults.reduce(
      (sum, scenario) => sum + (scenario.outputs.internalRateOfReturn * scenario.probability), 0
    );
    
    const expectedCashFlow = scenarioResults.reduce(
      (sum, scenario) => sum + (scenario.outputs.annualCashFlow * scenario.probability), 0
    );
    
    const riskScore = scenarioResults.reduce(
      (sum, scenario) => sum + (scenario.keyMetrics.risk * scenario.probability), 0
    );

    const bestCase = scenarioResults.reduce((best, current) => 
      current.outputs.netPresentValue > best.outputs.netPresentValue ? current : best
    );
    
    const worstCase = scenarioResults.reduce((worst, current) => 
      current.outputs.netPresentValue < worst.outputs.netPresentValue ? current : worst
    );
    
    const mostLikely = scenarioResults.reduce((most, current) => 
      current.probability > most.probability ? current : most
    );

    const summary: ScenarioSummary = {
      expectedNPV,
      expectedIRR,
      expectedCashFlow,
      riskScore,
      bestCase,
      worstCase,
      mostLikely
    };

    return {
      scenarios: scenarioResults,
      summary
    };
  }

  // Helper methods
  private static calculateMonthlyPayment(principal: number, rate: number, term: number): number {
    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;
    
    if (monthlyRate === 0) {
      return principal / numPayments;
    }
    
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  }

  private static calculateCashFlows(
    inputs: ModelInputs,
    assumptions: ModelAssumptions,
    holdingPeriod: number
  ): number[] {
    const cashFlows: number[] = [];
    const { monthlyRent, vacancyRate, operatingExpenses, capitalExpenditures } = inputs;
    const { rentGrowthRate, expenseGrowthRate } = assumptions;
    
    const monthlyPayment = this.calculateMonthlyPayment(
      inputs.loanAmount,
      inputs.interestRate,
      inputs.loanTerm
    );

    for (let year = 1; year <= holdingPeriod; year++) {
      const rentGrowth = Math.pow(1 + rentGrowthRate / 100, year - 1);
      const expenseGrowth = Math.pow(1 + expenseGrowthRate / 100, year - 1);
      
      const annualRent = monthlyRent * 12 * rentGrowth;
      const vacancyLoss = annualRent * (vacancyRate / 100);
      const effectiveGrossIncome = annualRent - vacancyLoss;
      const operatingExpensesAdjusted = operatingExpenses * expenseGrowth;
      const netOperatingIncome = effectiveGrossIncome - operatingExpensesAdjusted;
      
      const annualCashFlow = netOperatingIncome - (monthlyPayment * 12) - capitalExpenditures;
      cashFlows.push(annualCashFlow);
    }

    return cashFlows;
  }

  private static calculateNPV(cashFlows: number[], discountRate: number): number {
    return cashFlows.reduce((npv, cashFlow, year) => {
      return npv + cashFlow / Math.pow(1 + discountRate / 100, year + 1);
    }, 0);
  }

  private static calculateIRR(cashFlows: number[]): number {
    // Simple IRR calculation using Newton-Raphson method
    let rate = 0.1; // Initial guess
    const tolerance = 0.0001;
    const maxIterations = 100;
    
    for (let i = 0; i < maxIterations; i++) {
      let npv = 0;
      let npvDerivative = 0;
      
      cashFlows.forEach((cashFlow, year) => {
        const discountFactor = Math.pow(1 + rate, year + 1);
        npv += cashFlow / discountFactor;
        npvDerivative -= (year + 1) * cashFlow / (discountFactor * (1 + rate));
      });
      
      if (Math.abs(npv) < tolerance) {
        return rate * 100;
      }
      
      rate = rate - npv / npvDerivative;
    }
    
    return rate * 100;
  }

  private static calculateMIRR(
    cashFlows: number[],
    financeRate: number,
    reinvestRate: number
  ): number {
    const negativeFlows: number[] = [];
    const positiveFlows: number[] = [];
    
    cashFlows.forEach((flow, index) => {
      if (flow < 0) {
        negativeFlows.push(Math.abs(flow));
      } else {
        positiveFlows.push(flow);
      }
    });
    
    const pvNegativeFlows = negativeFlows.reduce((sum, flow) => 
      sum + flow / Math.pow(1 + financeRate / 100, 1), 0
    );
    
    const fvPositiveFlows = positiveFlows.reduce((sum, flow, index) => 
      sum + flow * Math.pow(1 + reinvestRate / 100, cashFlows.length - index - 1), 0
    );
    
    return (Math.pow(fvPositiveFlows / pvNegativeFlows, 1 / cashFlows.length) - 1) * 100;
  }

  private static calculateExitValue(
    propertyValue: number,
    appreciationRate: number,
    exitCapRate: number,
    holdingPeriod: number,
    netOperatingIncome: number,
    rentGrowthRate: number,
    expenseGrowthRate: number
  ): number {
    const appreciationFactor = Math.pow(1 + appreciationRate / 100, holdingPeriod);
    const rentGrowthFactor = Math.pow(1 + rentGrowthRate / 100, holdingPeriod);
    const expenseGrowthFactor = Math.pow(1 + expenseGrowthRate / 100, holdingPeriod);
    
    const futureNOI = netOperatingIncome * rentGrowthFactor - 
                     (netOperatingIncome * (1 - expenseGrowthFactor));
    
    const exitValue = futureNOI / (exitCapRate / 100);
    return exitValue * appreciationFactor;
  }

  private static calculatePaybackPeriod(cashFlows: number[], initialInvestment: number): number {
    let cumulativeCashFlow = 0;
    
    for (let i = 0; i < cashFlows.length; i++) {
      cumulativeCashFlow += cashFlows[i];
      if (cumulativeCashFlow >= initialInvestment) {
        return i + 1;
      }
    }
    
    return cashFlows.length; // Never paid back
  }

  private static calculateRiskScore(outputs: ModelOutputs, inputs: ModelInputs): number {
    // Simple risk score based on multiple factors
    const leverageRisk = inputs.loanAmount / inputs.propertyValue;
    const cashFlowRisk = outputs.annualCashFlow < 0 ? 1 : 0;
    const capRateRisk = outputs.capRate < 5 ? 1 : 0;
    
    return (leverageRisk + cashFlowRisk + capRateRisk) / 3;
  }

  private static modifyInputs(inputs: ModelInputs, variableName: string, value: number): ModelInputs {
    const modified = { ...inputs };
    
    switch (variableName) {
      case 'propertyValue':
        modified.propertyValue = value;
        break;
      case 'purchasePrice':
        modified.purchasePrice = value;
        break;
      case 'monthlyRent':
        modified.monthlyRent = value;
        break;
      case 'vacancyRate':
        modified.vacancyRate = value;
        break;
      case 'operatingExpenses':
        modified.operatingExpenses = value;
        break;
      case 'interestRate':
        modified.interestRate = value;
        break;
      // Add more cases as needed
    }
    
    return modified;
  }

  private static modifyAssumptions(assumptions: ModelAssumptions, variableName: string, value: number): ModelAssumptions {
    const modified = { ...assumptions };
    
    switch (variableName) {
      case 'rentGrowthRate':
        modified.rentGrowthRate = value;
        break;
      case 'expenseGrowthRate':
        modified.expenseGrowthRate = value;
        break;
      case 'appreciationRate':
        modified.appreciationRate = value;
        break;
      case 'exitCapRate':
        modified.exitCapRate = value;
        break;
      // Add more cases as needed
    }
    
    return modified;
  }

  private static generateRandomValue(min: number, max: number, base: number): number {
    // Generate random value with normal distribution around base value
    const range = max - min;
    const standardDeviation = range / 6; // 99.7% within range
    
    let randomValue;
    do {
      // Box-Muller transformation for normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      randomValue = base + z0 * standardDeviation;
    } while (randomValue < min || randomValue > max);
    
    return randomValue;
  }
}

export default FinancialModelingEngine;
