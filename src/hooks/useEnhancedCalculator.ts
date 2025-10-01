import { useState, useCallback } from 'react';
import { 
  CalculatorInputs, 
  CalculatorResults, 
  CalculatorPreset, 
  CalculatorAnalytics, 
  CalculatorComparison 
} from '@/types/calculator';
import { CalculatorService } from '@/lib/calculatorService';

export function useEnhancedCalculator() {
  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [presets, setPresets] = useState<CalculatorPreset[]>([]);
  const [comparisons, setComparisons] = useState<CalculatorComparison[]>([]);
  const [analytics, setAnalytics] = useState<CalculatorAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculation operations
  const calculate = useCallback(async (inputs: CalculatorInputs) => {
    try {
      setIsLoading(true);
      setError(null);
      const results = CalculatorService.calculateComplete(inputs);
      setResults(results);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const calculateMortgage = useCallback(async (inputs: CalculatorInputs) => {
    try {
      setIsLoading(true);
      setError(null);
      const mortgage = CalculatorService.calculateMortgage(inputs);
      return mortgage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate mortgage');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const calculateAffordability = useCallback(async (inputs: CalculatorInputs) => {
    try {
      setIsLoading(true);
      setError(null);
      const affordability = CalculatorService.calculateAffordability(inputs);
      return affordability;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate affordability');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Preset operations
  const getPresets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const presets = await CalculatorService.getPresets();
      setPresets(presets);
      return presets;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch presets');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPreset = useCallback(async (presetData: Omit<CalculatorPreset, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      setError(null);
      const preset = await CalculatorService.createPreset(presetData);
      setPresets(prev => [...prev, preset]);
      return preset;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create preset');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePreset = useCallback(async (id: string, updates: Partial<CalculatorPreset>) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedPreset = await CalculatorService.updatePreset(id, updates);
      if (updatedPreset) {
        setPresets(prev => prev.map(preset => 
          preset.id === id ? updatedPreset : preset
        ));
      }
      return updatedPreset;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preset');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePreset = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const success = await CalculatorService.deletePreset(id);
      if (success) {
        setPresets(prev => prev.filter(preset => preset.id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete preset');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Comparison operations
  const createComparison = useCallback(async (comparisonData: Omit<CalculatorComparison, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      setError(null);
      const comparison = await CalculatorService.createComparison(comparisonData);
      setComparisons(prev => [...prev, comparison]);
      return comparison;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create comparison');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getComparisons = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const comparisons = await CalculatorService.getComparisons();
      setComparisons(comparisons);
      return comparisons;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comparisons');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateComparison = useCallback(async (id: string, updates: Partial<CalculatorComparison>) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedComparison = await CalculatorService.updateComparison(id, updates);
      if (updatedComparison) {
        setComparisons(prev => prev.map(comparison => 
          comparison.id === id ? updatedComparison : comparison
        ));
      }
      return updatedComparison;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update comparison');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteComparison = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const success = await CalculatorService.deleteComparison(id);
      if (success) {
        setComparisons(prev => prev.filter(comparison => comparison.id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comparison');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Analytics
  const getAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const analytics = await CalculatorService.getAnalytics();
      setAnalytics(analytics);
      return analytics;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    results,
    presets,
    comparisons,
    analytics,
    isLoading,
    error,
    
    // Calculation operations
    calculate,
    calculateMortgage,
    calculateAffordability,
    
    // Preset operations
    getPresets,
    createPreset,
    updatePreset,
    deletePreset,
    
    // Comparison operations
    createComparison,
    getComparisons,
    updateComparison,
    deleteComparison,
    
    // Analytics
    getAnalytics,
  };
}
