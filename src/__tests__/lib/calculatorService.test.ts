import { CalculatorService } from '@/lib/calculatorService';
import { CalculatorInputs, CalculatorPreset, CalculatorComparison } from '@/types/calculator';

describe('CalculatorService', () => {
  beforeEach(() => {
    // Clear any existing data
    jest.clearAllMocks();
  });

  describe('Mortgage calculation', () => {
    it('should calculate mortgage payment correctly', () => {
      const inputs: CalculatorInputs = {
        propertyPrice: 500000,
        downPayment: 100000,
        interestRate: 6.5,
        loanTerm: 30,
        propertyTax: 5000,
        homeInsurance: 1200,
        pmi: 0,
        hoa: 0,
        monthlyIncome: 8000,
        monthlyDebts: 500,
        creditScore: 750,
      };

      const mortgage = CalculatorService.calculateMortgage(inputs);

      expect(mortgage).toBeDefined();
      expect(mortgage.loanAmount).toBe(400000);
      expect(mortgage.downPaymentPercent).toBe(20);
      expect(mortgage.loanToValue).toBe(80);
      expect(mortgage.monthlyPayment).toBeGreaterThan(0);
      expect(mortgage.totalMonthlyPayment).toBeGreaterThan(mortgage.monthlyPayment);
      expect(mortgage.totalInterest).toBeGreaterThan(0);
      expect(mortgage.totalCost).toBeGreaterThan(inputs.propertyPrice);
    });

    it('should calculate affordability correctly', () => {
      const inputs: CalculatorInputs = {
        propertyPrice: 500000,
        downPayment: 100000,
        interestRate: 6.5,
        loanTerm: 30,
        propertyTax: 5000,
        homeInsurance: 1200,
        pmi: 0,
        hoa: 0,
        monthlyIncome: 8000,
        monthlyDebts: 500,
        creditScore: 750,
      };

      const affordability = CalculatorService.calculateAffordability(inputs);

      expect(affordability).toBeDefined();
      expect(affordability.maxAffordablePrice).toBeGreaterThan(0);
      expect(affordability.maxMonthlyPayment).toBeGreaterThan(0);
      expect(affordability.recommendedDownPayment).toBeGreaterThan(0);
      expect(affordability.loanAmount).toBeGreaterThan(0);
      expect(affordability.monthlyPayment).toBeGreaterThan(0);
      expect(affordability.debtToIncomeRatio).toBeGreaterThanOrEqual(0);
      expect(affordability.paymentToIncomeRatio).toBeGreaterThanOrEqual(0);
      expect(affordability.isAffordable).toBeDefined();
      expect(affordability.affordabilityScore).toBeGreaterThanOrEqual(0);
      expect(affordability.affordabilityScore).toBeLessThanOrEqual(100);
    });

    it('should generate amortization schedule correctly', () => {
      const inputs: CalculatorInputs = {
        propertyPrice: 500000,
        downPayment: 100000,
        interestRate: 6.5,
        loanTerm: 30,
        propertyTax: 5000,
        homeInsurance: 1200,
        pmi: 0,
        hoa: 0,
        monthlyIncome: 8000,
        monthlyDebts: 500,
        creditScore: 750,
      };

      const schedule = CalculatorService.calculateAmortizationSchedule(inputs);

      expect(schedule).toBeDefined();
      expect(schedule.length).toBe(360); // 30 years * 12 months
      expect(schedule[0].month).toBe(1);
      expect(schedule[0].payment).toBeGreaterThan(0);
      expect(schedule[0].principal).toBeGreaterThan(0);
      expect(schedule[0].interest).toBeGreaterThan(0);
      expect(schedule[0].balance).toBeGreaterThan(0);
      expect(schedule[0].cumulativeInterest).toBeGreaterThan(0);
      expect(schedule[0].cumulativePrincipal).toBeGreaterThan(0);
      
      // Last payment should have zero balance
      expect(schedule[schedule.length - 1].balance).toBe(0);
    });

    it('should calculate complete results', () => {
      const inputs: CalculatorInputs = {
        propertyPrice: 500000,
        downPayment: 100000,
        interestRate: 6.5,
        loanTerm: 30,
        propertyTax: 5000,
        homeInsurance: 1200,
        pmi: 0,
        hoa: 0,
        monthlyIncome: 8000,
        monthlyDebts: 500,
        creditScore: 750,
      };

      const results = CalculatorService.calculateComplete(inputs);

      expect(results).toBeDefined();
      expect(results.mortgage).toBeDefined();
      expect(results.affordability).toBeDefined();
      expect(results.amortizationSchedule).toBeDefined();
      expect(results.summary).toBeDefined();
      expect(results.summary.totalPayments).toBe(360);
      expect(results.summary.totalInterest).toBeGreaterThan(0);
      expect(results.summary.totalPrincipal).toBe(400000);
      expect(results.summary.payoffDate).toBeInstanceOf(Date);
    });
  });

  describe('Preset operations', () => {
    it('should get presets', async () => {
      const presets = await CalculatorService.getPresets();

      expect(Array.isArray(presets)).toBe(true);
      expect(presets.length).toBeGreaterThan(0);
    });

    it('should create a preset', async () => {
      const presetData = {
        name: 'Test Preset',
        description: 'Test description',
        inputs: {
          interestRate: 6.5,
          loanTerm: 30,
        },
        isDefault: false,
      };

      const preset = await CalculatorService.createPreset(presetData);

      expect(preset).toBeDefined();
      expect(preset.id).toBeDefined();
      expect(preset.name).toBe(presetData.name);
      expect(preset.description).toBe(presetData.description);
      expect(preset.inputs).toEqual(presetData.inputs);
      expect(preset.isDefault).toBe(presetData.isDefault);
      expect(preset.createdAt).toBeInstanceOf(Date);
      expect(preset.updatedAt).toBeInstanceOf(Date);
    });

    it('should update a preset', async () => {
      const presetData = {
        name: 'Original Preset',
        description: 'Original description',
        inputs: { interestRate: 6.5 },
        isDefault: false,
      };

      const createdPreset = await CalculatorService.createPreset(presetData);
      const updates = {
        name: 'Updated Preset',
        description: 'Updated description',
        isDefault: true,
      };

      const updatedPreset = await CalculatorService.updatePreset(createdPreset.id, updates);

      expect(updatedPreset).toBeDefined();
      expect(updatedPreset?.name).toBe(updates.name);
      expect(updatedPreset?.description).toBe(updates.description);
      expect(updatedPreset?.isDefault).toBe(updates.isDefault);
      expect(updatedPreset?.updatedAt.getTime()).toBeGreaterThan(createdPreset.updatedAt.getTime());
    });

    it('should delete a preset', async () => {
      const presetData = {
        name: 'To Delete',
        description: 'Delete me',
        inputs: { interestRate: 6.5 },
        isDefault: false,
      };

      const createdPreset = await CalculatorService.createPreset(presetData);
      const deleteResult = await CalculatorService.deletePreset(createdPreset.id);

      expect(deleteResult).toBe(true);
    });
  });

  describe('Comparison operations', () => {
    it('should create a comparison', async () => {
      const comparisonData = {
        name: 'Test Comparison',
        scenarios: [
          {
            name: 'Scenario 1',
            inputs: {
              propertyPrice: 500000,
              downPayment: 100000,
              interestRate: 6.5,
              loanTerm: 30,
              propertyTax: 5000,
              homeInsurance: 1200,
              pmi: 0,
              hoa: 0,
              monthlyIncome: 8000,
              monthlyDebts: 500,
              creditScore: 750,
            },
            results: CalculatorService.calculateComplete({
              propertyPrice: 500000,
              downPayment: 100000,
              interestRate: 6.5,
              loanTerm: 30,
              propertyTax: 5000,
              homeInsurance: 1200,
              pmi: 0,
              hoa: 0,
              monthlyIncome: 8000,
              monthlyDebts: 500,
              creditScore: 750,
            }),
          },
        ],
      };

      const comparison = await CalculatorService.createComparison(comparisonData);

      expect(comparison).toBeDefined();
      expect(comparison.id).toBeDefined();
      expect(comparison.name).toBe(comparisonData.name);
      expect(comparison.scenarios).toEqual(comparisonData.scenarios);
      expect(comparison.createdAt).toBeInstanceOf(Date);
      expect(comparison.updatedAt).toBeInstanceOf(Date);
    });

    it('should get a comparison by id', async () => {
      const comparisonData = {
        name: 'Test Comparison',
        scenarios: [
          {
            name: 'Scenario 1',
            inputs: {
              propertyPrice: 500000,
              downPayment: 100000,
              interestRate: 6.5,
              loanTerm: 30,
              propertyTax: 5000,
              homeInsurance: 1200,
              pmi: 0,
              hoa: 0,
              monthlyIncome: 8000,
              monthlyDebts: 500,
              creditScore: 750,
            },
            results: CalculatorService.calculateComplete({
              propertyPrice: 500000,
              downPayment: 100000,
              interestRate: 6.5,
              loanTerm: 30,
              propertyTax: 5000,
              homeInsurance: 1200,
              pmi: 0,
              hoa: 0,
              monthlyIncome: 8000,
              monthlyDebts: 500,
              creditScore: 750,
            }),
          },
        ],
      };

      const createdComparison = await CalculatorService.createComparison(comparisonData);
      const retrievedComparison = await CalculatorService.getComparison(createdComparison.id);

      expect(retrievedComparison).toBeDefined();
      expect(retrievedComparison?.id).toBe(createdComparison.id);
      expect(retrievedComparison?.name).toBe(comparisonData.name);
    });

    it('should get all comparisons', async () => {
      const comparisons = await CalculatorService.getComparisons();

      expect(Array.isArray(comparisons)).toBe(true);
    });

    it('should update a comparison', async () => {
      const comparisonData = {
        name: 'Original Comparison',
        scenarios: [
          {
            name: 'Scenario 1',
            inputs: {
              propertyPrice: 500000,
              downPayment: 100000,
              interestRate: 6.5,
              loanTerm: 30,
              propertyTax: 5000,
              homeInsurance: 1200,
              pmi: 0,
              hoa: 0,
              monthlyIncome: 8000,
              monthlyDebts: 500,
              creditScore: 750,
            },
            results: CalculatorService.calculateComplete({
              propertyPrice: 500000,
              downPayment: 100000,
              interestRate: 6.5,
              loanTerm: 30,
              propertyTax: 5000,
              homeInsurance: 1200,
              pmi: 0,
              hoa: 0,
              monthlyIncome: 8000,
              monthlyDebts: 500,
              creditScore: 750,
            }),
          },
        ],
      };

      const createdComparison = await CalculatorService.createComparison(comparisonData);
      const updates = {
        name: 'Updated Comparison',
      };

      const updatedComparison = await CalculatorService.updateComparison(createdComparison.id, updates);

      expect(updatedComparison).toBeDefined();
      expect(updatedComparison?.name).toBe(updates.name);
      expect(updatedComparison?.updatedAt.getTime()).toBeGreaterThan(createdComparison.updatedAt.getTime());
    });

    it('should delete a comparison', async () => {
      const comparisonData = {
        name: 'To Delete',
        scenarios: [
          {
            name: 'Scenario 1',
            inputs: {
              propertyPrice: 500000,
              downPayment: 100000,
              interestRate: 6.5,
              loanTerm: 30,
              propertyTax: 5000,
              homeInsurance: 1200,
              pmi: 0,
              hoa: 0,
              monthlyIncome: 8000,
              monthlyDebts: 500,
              creditScore: 750,
            },
            results: CalculatorService.calculateComplete({
              propertyPrice: 500000,
              downPayment: 100000,
              interestRate: 6.5,
              loanTerm: 30,
              propertyTax: 5000,
              homeInsurance: 1200,
              pmi: 0,
              hoa: 0,
              monthlyIncome: 8000,
              monthlyDebts: 500,
              creditScore: 750,
            }),
          },
        ],
      };

      const createdComparison = await CalculatorService.createComparison(comparisonData);
      const deleteResult = await CalculatorService.deleteComparison(createdComparison.id);

      expect(deleteResult).toBe(true);
    });
  });

  describe('Analytics', () => {
    it('should get calculator analytics', async () => {
      const analytics = await CalculatorService.getAnalytics();

      expect(analytics).toBeDefined();
      expect(analytics.totalCalculations).toBeGreaterThanOrEqual(0);
      expect(analytics.averagePropertyPrice).toBeGreaterThanOrEqual(0);
      expect(analytics.averageInterestRate).toBeGreaterThanOrEqual(0);
      expect(analytics.averageLoanTerm).toBeGreaterThanOrEqual(0);
      expect(analytics.calculationsByMonth).toBeDefined();
      expect(analytics.popularPresets).toBeDefined();
      expect(analytics.userMetrics).toBeDefined();
      expect(analytics.userMetrics.totalUsers).toBeGreaterThanOrEqual(0);
      expect(analytics.userMetrics.activeUsers).toBeGreaterThanOrEqual(0);
      expect(analytics.userMetrics.averageCalculationsPerUser).toBeGreaterThanOrEqual(0);
    });
  });
});
