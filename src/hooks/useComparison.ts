import { useState, useEffect } from 'react';
import { PropertyComparison, ComparisonResult, CreateComparisonRequest, UpdateComparisonRequest, AddPropertyToComparisonRequest } from '../types/comparison';
import { ComparisonService } from '../lib/comparisonService';

export const useComparison = (comparisonId?: string) => {
  const [comparison, setComparison] = useState<PropertyComparison | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComparison = async () => {
    if (!comparisonId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const comparisonData = await ComparisonService.getComparisonById(comparisonId);
      setComparison(comparisonData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comparison');
    } finally {
      setLoading(false);
    }
  };

  const updateComparison = async (request: UpdateComparisonRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedComparison = await ComparisonService.updateComparison(request);
      setComparison(updatedComparison);
      return updatedComparison;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update comparison');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addProperty = async (request: AddPropertyToComparisonRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const newProperty = await ComparisonService.addPropertyToComparison(request);
      if (comparison) {
        setComparison({
          ...comparison,
          properties: [...comparison.properties, newProperty],
          updatedAt: new Date()
        });
      }
        return newProperty;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add property');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeProperty = async (propertyId: string) => {
    if (!comparison) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const success = await ComparisonService.removePropertyFromComparison(comparison.id, propertyId);
      if (success) {
        setComparison({
          ...comparison,
          properties: comparison.properties.filter(prop => prop.propertyId !== propertyId),
          updatedAt: new Date()
        });
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove property');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComparison();
  }, [comparisonId]);

  return {
    comparison,
    loading,
    error,
    updateComparison,
    addProperty,
    removeProperty,
    refreshComparison: loadComparison
  };
};

export const useComparisons = (userId?: string) => {
  const [comparisons, setComparisons] = useState<PropertyComparison[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComparisons = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userComparisons = await ComparisonService.getUserComparisons(userId);
      setComparisons(userComparisons);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comparisons');
    } finally {
      setLoading(false);
    }
  };

  const createComparison = async (request: CreateComparisonRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const newComparison = await ComparisonService.createComparison(request);
      setComparisons(prev => [...prev, newComparison]);
      return newComparison;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create comparison');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteComparison = async (comparisonId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await ComparisonService.deleteComparison(comparisonId);
      if (success) {
        setComparisons(prev => prev.filter(comp => comp.id !== comparisonId));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comparison');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComparisons();
  }, [userId]);

  return {
    comparisons,
    loading,
    error,
    createComparison,
    deleteComparison,
    refreshComparisons: loadComparisons
  };
};

export const useComparisonResults = (comparisonId?: string) => {
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateResults = async () => {
    if (!comparisonId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const comparisonResults = await ComparisonService.calculateComparisonResults(comparisonId);
      setResults(comparisonResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateResults();
  }, [comparisonId]);

  return {
    results,
    loading,
    error,
    refreshResults: calculateResults
  };
};