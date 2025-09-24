'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Portfolio,
  PortfolioProperty,
  CreatePortfolioForm,
  UpdatePortfolioForm,
  AddPropertyForm,
  FinancialModel,
  CreateModelForm,
  RiskAnalysis,
  PortfolioOptimization,
  PortfolioComparison
} from '@/types/portfolio';
import { FinancialModelingEngine } from '@/lib/financialModeling';
import { RiskAnalysisEngine } from '@/lib/riskAnalysis';

interface UsePortfolioReturn {
  // Portfolio state
  portfolios: Portfolio[];
  currentPortfolio: Portfolio | null;
  loading: boolean;
  error: string | null;

  // Portfolio operations
  createPortfolio: (form: CreatePortfolioForm) => Promise<Portfolio>;
  updatePortfolio: (id: string, form: UpdatePortfolioForm) => Promise<Portfolio>;
  deletePortfolio: (id: string) => Promise<void>;
  selectPortfolio: (id: string) => void;
  addProperty: (portfolioId: string, form: AddPropertyForm) => Promise<void>;
  removeProperty: (portfolioId: string, propertyId: string) => Promise<void>;

  // Financial modeling
  createFinancialModel: (form: CreateModelForm) => Promise<FinancialModel>;
  updateFinancialModel: (id: string, form: Partial<CreateModelForm>) => Promise<FinancialModel>;
  deleteFinancialModel: (id: string) => Promise<void>;
  calculateModelOutputs: (inputs: any, assumptions: any) => any;

  // Risk analysis
  analyzeRisk: (portfolioId: string) => Promise<RiskAnalysis>;
  getRiskRecommendations: (portfolioId: string) => Promise<any[]>;

  // Portfolio optimization
  optimizePortfolio: (portfolioId: string, objective: string, constraints: any) => Promise<PortfolioOptimization>;
  rebalancePortfolio: (portfolioId: string) => Promise<void>;

  // Performance tracking
  calculatePerformance: (portfolioId: string) => Promise<any>;
  getPerformanceHistory: (portfolioId: string, period: string) => Promise<any[]>;
  comparePortfolios: (portfolioIds: string[]) => Promise<PortfolioComparison>;

  // Utility functions
  refreshPortfolios: () => Promise<void>;
  exportPortfolio: (portfolioId: string, format: 'csv' | 'pdf' | 'excel') => Promise<void>;
  importPortfolio: (file: File) => Promise<Portfolio>;
}

export const usePortfolio = (): UsePortfolioReturn => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [currentPortfolio, setCurrentPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize portfolios from localStorage or API
  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to load from localStorage first (for offline support)
      const storedPortfolios = localStorage.getItem('flowgrow-portfolios');
      if (storedPortfolios) {
        const parsedPortfolios = JSON.parse(storedPortfolios);
        setPortfolios(parsedPortfolios);
        
        // If there's a current portfolio, restore it
        const currentId = localStorage.getItem('flowgrow-current-portfolio');
        if (currentId) {
          const current = parsedPortfolios.find((p: Portfolio) => p.id === currentId);
          if (current) {
            setCurrentPortfolio(current);
          }
        }
      }

      // In a real app, you would also fetch from API here
      // const response = await fetch('/api/portfolios');
      // const data = await response.json();
      // setPortfolios(data.portfolios);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portfolios');
    } finally {
      setLoading(false);
    }
  }, []);

  const savePortfolios = useCallback(async (updatedPortfolios: Portfolio[]) => {
    try {
      // Save to localStorage
      localStorage.setItem('flowgrow-portfolios', JSON.stringify(updatedPortfolios));
      
      // In a real app, you would also save to API here
      // await fetch('/api/portfolios', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ portfolios: updatedPortfolios })
      // });

      setPortfolios(updatedPortfolios);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save portfolios');
    }
  }, []);

  // Portfolio operations
  const createPortfolio = useCallback(async (form: CreatePortfolioForm): Promise<Portfolio> => {
    try {
      setLoading(true);
      setError(null);

      const newPortfolio: Portfolio = {
        id: `portfolio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: form.name,
        description: form.description,
        userId: 'current_user', // In real app, get from auth context
        properties: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        totalValue: 0,
        totalInvestment: 0,
        totalReturn: 0,
        totalReturnPercentage: 0,
        riskScore: 0,
        diversificationScore: 0,
        currentAllocation: {
          residential: 0,
          commercial: 0,
          industrial: 0,
          land: 0,
          reits: 0,
          other: 0
        },
        performanceMetrics: {
          totalReturn: 0,
          totalReturnPercentage: 0,
          annualizedReturn: 0,
          volatility: 0,
          sharpeRatio: 0,
          maxDrawdown: 0,
          beta: 0,
          alpha: 0,
          informationRatio: 0,
          treynorRatio: 0,
          jensenAlpha: 0,
          calmarRatio: 0,
          sortinoRatio: 0,
          valueAtRisk: 0,
          expectedShortfall: 0,
          monthlyReturns: [],
          yearlyReturns: [],
          benchmarkComparison: {
            benchmark: 'S&P 500',
            correlation: 0,
            trackingError: 0,
            informationRatio: 0,
            beta: 0,
            alpha: 0
          }
        },
        settings: {
          riskTolerance: form.riskTolerance,
          investmentHorizon: form.investmentHorizon,
          rebalancingFrequency: 'quarterly',
          targetReturn: form.targetReturn,
          maxRisk: form.maxRisk,
          minDiversification: 0.3,
          autoRebalancing: false,
          notifications: {
            performanceAlerts: true,
            rebalancingReminders: true,
            riskWarnings: true,
            marketUpdates: false
          },
          currency: form.currency,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };

      const updatedPortfolios = [...portfolios, newPortfolio];
      await savePortfolios(updatedPortfolios);

      return newPortfolio;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create portfolio';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [portfolios, savePortfolios]);

  const updatePortfolio = useCallback(async (id: string, form: UpdatePortfolioForm): Promise<Portfolio> => {
    try {
      setLoading(true);
      setError(null);

      const portfolioIndex = portfolios.findIndex(p => p.id === id);
      if (portfolioIndex === -1) {
        throw new Error('Portfolio not found');
      }

      const updatedPortfolio = {
        ...portfolios[portfolioIndex],
        ...form,
        updatedAt: Date.now()
      };

      const updatedPortfolios = [...portfolios];
      updatedPortfolios[portfolioIndex] = updatedPortfolio;
      await savePortfolios(updatedPortfolios);

      if (currentPortfolio?.id === id) {
        setCurrentPortfolio(updatedPortfolio);
      }

      return updatedPortfolio;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update portfolio';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [portfolios, currentPortfolio, savePortfolios]);

  const deletePortfolio = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const updatedPortfolios = portfolios.filter(p => p.id !== id);
      await savePortfolios(updatedPortfolios);

      if (currentPortfolio?.id === id) {
        setCurrentPortfolio(null);
        localStorage.removeItem('flowgrow-current-portfolio');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete portfolio';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [portfolios, currentPortfolio, savePortfolios]);

  const selectPortfolio = useCallback((id: string) => {
    const portfolio = portfolios.find(p => p.id === id);
    if (portfolio) {
      setCurrentPortfolio(portfolio);
      localStorage.setItem('flowgrow-current-portfolio', id);
    }
  }, [portfolios]);

  const addProperty = useCallback(async (portfolioId: string, form: AddPropertyForm): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const portfolioIndex = portfolios.findIndex(p => p.id === portfolioId);
      if (portfolioIndex === -1) {
        throw new Error('Portfolio not found');
      }

      const portfolio = portfolios[portfolioIndex];
      
      // In a real app, you would fetch property details from API
      const propertyDetails = {
        id: form.propertyId,
        title: `Property ${form.propertyId}`,
        location: 'Unknown Location',
        price: form.purchasePrice,
        images: [],
        metadata: {}
      };

      const portfolioProperty: PortfolioProperty = {
        propertyId: form.propertyId,
        property: propertyDetails,
        purchasePrice: form.purchasePrice,
        purchaseDate: form.purchaseDate,
        currentValue: form.purchasePrice, // Initial value equals purchase price
        shares: form.shares,
        totalShares: 1000000, // Assume 1M total shares
        ownershipPercentage: (form.shares / 1000000) * 100,
        monthlyRent: 0,
        annualExpenses: 0,
        annualIncome: 0,
        netOperatingIncome: 0,
        capRate: 0,
        cashOnCashReturn: 0,
        totalReturn: 0,
        totalReturnPercentage: 0,
        riskScore: 0,
        lastValuation: Date.now(),
        notes: form.notes,
        tags: form.tags
      };

      const updatedPortfolio = {
        ...portfolio,
        properties: [...portfolio.properties, portfolioProperty],
        updatedAt: Date.now()
      };

      // Recalculate portfolio metrics
      await recalculatePortfolioMetrics(updatedPortfolio);

      const updatedPortfolios = [...portfolios];
      updatedPortfolios[portfolioIndex] = updatedPortfolio;
      await savePortfolios(updatedPortfolios);

      if (currentPortfolio?.id === portfolioId) {
        setCurrentPortfolio(updatedPortfolio);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add property';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [portfolios, currentPortfolio, savePortfolios]);

  const removeProperty = useCallback(async (portfolioId: string, propertyId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const portfolioIndex = portfolios.findIndex(p => p.id === portfolioId);
      if (portfolioIndex === -1) {
        throw new Error('Portfolio not found');
      }

      const portfolio = portfolios[portfolioIndex];
      const updatedPortfolio = {
        ...portfolio,
        properties: portfolio.properties.filter(p => p.propertyId !== propertyId),
        updatedAt: Date.now()
      };

      // Recalculate portfolio metrics
      await recalculatePortfolioMetrics(updatedPortfolio);

      const updatedPortfolios = [...portfolios];
      updatedPortfolios[portfolioIndex] = updatedPortfolio;
      await savePortfolios(updatedPortfolios);

      if (currentPortfolio?.id === portfolioId) {
        setCurrentPortfolio(updatedPortfolio);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove property';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [portfolios, currentPortfolio, savePortfolios]);

  // Financial modeling operations
  const createFinancialModel = useCallback(async (form: CreateModelForm): Promise<FinancialModel> => {
    try {
      setLoading(true);
      setError(null);

      const outputs = FinancialModelingEngine.calculateModelOutputs(form.inputs, form.assumptions);
      
      const model: FinancialModel = {
        id: `model_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: form.name,
        type: form.type,
        inputs: form.inputs,
        assumptions: form.assumptions,
        outputs,
        sensitivityAnalysis: {
          variables: [],
          tornadoChart: [],
          spiderChart: [],
          monteCarloResults: {
            iterations: 0,
            meanNPV: 0,
            medianNPV: 0,
            standardDeviation: 0,
            confidenceIntervals: { p5: 0, p10: 0, p25: 0, p75: 0, p90: 0, p95: 0 },
            probabilityOfPositiveReturn: 0,
            valueAtRisk: 0,
            expectedShortfall: 0,
            distribution: []
          }
        },
        scenarioAnalysis: {
          scenarios: [],
          summary: {
            expectedNPV: 0,
            expectedIRR: 0,
            expectedCashFlow: 0,
            riskScore: 0,
            bestCase: {} as any,
            worstCase: {} as any,
            mostLikely: {} as any
          }
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      // Save model to localStorage
      const storedModels = JSON.parse(localStorage.getItem('flowgrow-models') || '[]');
      storedModels.push(model);
      localStorage.setItem('flowgrow-models', JSON.stringify(storedModels));

      return model;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create financial model';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFinancialModel = useCallback(async (id: string, form: Partial<CreateModelForm>): Promise<FinancialModel> => {
    try {
      setLoading(true);
      setError(null);

      const storedModels = JSON.parse(localStorage.getItem('flowgrow-models') || '[]');
      const modelIndex = storedModels.findIndex((m: FinancialModel) => m.id === id);
      
      if (modelIndex === -1) {
        throw new Error('Model not found');
      }

      const updatedModel = {
        ...storedModels[modelIndex],
        ...form,
        updatedAt: Date.now()
      };

      if (form.inputs || form.assumptions) {
        updatedModel.outputs = FinancialModelingEngine.calculateModelOutputs(
          updatedModel.inputs,
          updatedModel.assumptions
        );
      }

      storedModels[modelIndex] = updatedModel;
      localStorage.setItem('flowgrow-models', JSON.stringify(storedModels));

      return updatedModel;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update financial model';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFinancialModel = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const storedModels = JSON.parse(localStorage.getItem('flowgrow-models') || '[]');
      const updatedModels = storedModels.filter((m: FinancialModel) => m.id !== id);
      localStorage.setItem('flowgrow-models', JSON.stringify(updatedModels));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete financial model';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateModelOutputs = useCallback((inputs: any, assumptions: any) => {
    return FinancialModelingEngine.calculateModelOutputs(inputs, assumptions);
  }, []);

  // Risk analysis operations
  const analyzeRisk = useCallback(async (portfolioId: string): Promise<RiskAnalysis> => {
    try {
      setLoading(true);
      setError(null);

      const portfolio = portfolios.find(p => p.id === portfolioId);
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      const riskAnalysis = RiskAnalysisEngine.analyzePortfolioRisk(portfolio);
      
      // Save risk analysis to localStorage
      const storedAnalyses = JSON.parse(localStorage.getItem('flowgrow-risk-analyses') || '[]');
      const existingIndex = storedAnalyses.findIndex((a: RiskAnalysis) => a.portfolioId === portfolioId);
      
      if (existingIndex >= 0) {
        storedAnalyses[existingIndex] = riskAnalysis;
      } else {
        storedAnalyses.push(riskAnalysis);
      }
      
      localStorage.setItem('flowgrow-risk-analyses', JSON.stringify(storedAnalyses));

      return riskAnalysis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze risk';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [portfolios]);

  const getRiskRecommendations = useCallback(async (portfolioId: string): Promise<any[]> => {
    try {
      const riskAnalysis = await analyzeRisk(portfolioId);
      return riskAnalysis.recommendations;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get risk recommendations');
      return [];
    }
  }, [analyzeRisk]);

  // Portfolio optimization operations
  const optimizePortfolio = useCallback(async (portfolioId: string, objective: string, constraints: any): Promise<PortfolioOptimization> => {
    try {
      setLoading(true);
      setError(null);

      const portfolio = portfolios.find(p => p.id === portfolioId);
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      // Simplified optimization - in a real app, you would use more sophisticated algorithms
      const optimization: PortfolioOptimization = {
        portfolioId,
        objective: objective as any,
        constraints,
        results: {
          optimalWeights: {},
          expectedReturn: 0,
          expectedRisk: 0,
          sharpeRatio: 0,
          efficientFrontier: [],
          optimizationMethod: 'mean_variance',
          convergence: true,
          iterations: 100,
          computationTime: 0.5
        },
        recommendations: []
      };

      return optimization;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to optimize portfolio';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [portfolios]);

  const rebalancePortfolio = useCallback(async (portfolioId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const portfolioIndex = portfolios.findIndex(p => p.id === portfolioId);
      if (portfolioIndex === -1) {
        throw new Error('Portfolio not found');
      }

      const portfolio = portfolios[portfolioIndex];
      
      // Simplified rebalancing logic
      const updatedPortfolio = {
        ...portfolio,
        updatedAt: Date.now()
      };

      const updatedPortfolios = [...portfolios];
      updatedPortfolios[portfolioIndex] = updatedPortfolio;
      await savePortfolios(updatedPortfolios);

      if (currentPortfolio?.id === portfolioId) {
        setCurrentPortfolio(updatedPortfolio);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to rebalance portfolio';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [portfolios, currentPortfolio, savePortfolios]);

  // Performance tracking operations
  const calculatePerformance = useCallback(async (portfolioId: string): Promise<any> => {
    try {
      const portfolio = portfolios.find(p => p.id === portfolioId);
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      return portfolio.performanceMetrics;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate performance');
      return null;
    }
  }, [portfolios]);

  const getPerformanceHistory = useCallback(async (portfolioId: string, period: string): Promise<any[]> => {
    try {
      const portfolio = portfolios.find(p => p.id === portfolioId);
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      return portfolio.performanceMetrics.monthlyReturns;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get performance history');
      return [];
    }
  }, [portfolios]);

  const comparePortfolios = useCallback(async (portfolioIds: string[]): Promise<PortfolioComparison> => {
    try {
      const selectedPortfolios = portfolios.filter(p => portfolioIds.includes(p.id));
      
      const comparison: PortfolioComparison = {
        portfolios: selectedPortfolios,
        metrics: {
          returns: {},
          risks: {},
          sharpeRatios: {},
          maxDrawdowns: {},
          volatilities: {},
          correlations: {}
        },
        rankings: [],
        insights: []
      };

      return comparison;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to compare portfolios');
      throw new Error('Failed to compare portfolios');
    }
  }, [portfolios]);

  // Utility functions
  const refreshPortfolios = useCallback(async (): Promise<void> => {
    await loadPortfolios();
  }, [loadPortfolios]);

  const exportPortfolio = useCallback(async (portfolioId: string, format: 'csv' | 'pdf' | 'excel'): Promise<void> => {
    try {
      const portfolio = portfolios.find(p => p.id === portfolioId);
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      // In a real app, you would generate and download the file
      console.log(`Exporting portfolio ${portfolioId} in ${format} format`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export portfolio');
    }
  }, [portfolios]);

  const importPortfolio = useCallback(async (file: File): Promise<Portfolio> => {
    try {
      setLoading(true);
      setError(null);

      const text = await file.text();
      const importedPortfolio = JSON.parse(text);
      
      const updatedPortfolios = [...portfolios, importedPortfolio];
      await savePortfolios(updatedPortfolios);

      return importedPortfolio;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import portfolio';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [portfolios, savePortfolios]);

  // Helper function to recalculate portfolio metrics
  const recalculatePortfolioMetrics = useCallback(async (portfolio: Portfolio): Promise<void> => {
    const totalValue = portfolio.properties.reduce((sum, p) => sum + p.currentValue, 0);
    const totalInvestment = portfolio.properties.reduce((sum, p) => sum + p.purchasePrice, 0);
    const totalReturn = totalValue - totalInvestment;
    const totalReturnPercentage = totalInvestment > 0 ? (totalReturn / totalInvestment) * 100 : 0;

    portfolio.totalValue = totalValue;
    portfolio.totalInvestment = totalInvestment;
    portfolio.totalReturn = totalReturn;
    portfolio.totalReturnPercentage = totalReturnPercentage;

    // Update performance metrics
    portfolio.performanceMetrics.totalReturn = totalReturn;
    portfolio.performanceMetrics.totalReturnPercentage = totalReturnPercentage;
  }, []);

  return {
    // Portfolio state
    portfolios,
    currentPortfolio,
    loading,
    error,

    // Portfolio operations
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    selectPortfolio,
    addProperty,
    removeProperty,

    // Financial modeling
    createFinancialModel,
    updateFinancialModel,
    deleteFinancialModel,
    calculateModelOutputs,

    // Risk analysis
    analyzeRisk,
    getRiskRecommendations,

    // Portfolio optimization
    optimizePortfolio,
    rebalancePortfolio,

    // Performance tracking
    calculatePerformance,
    getPerformanceHistory,
    comparePortfolios,

    // Utility functions
    refreshPortfolios,
    exportPortfolio,
    importPortfolio
  };
};

export default usePortfolio;
