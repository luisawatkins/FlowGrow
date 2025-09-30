import { useState, useEffect, useCallback } from 'react';
import {
  PropertyComparison,
  CreateComparisonRequest,
  UpdateComparisonRequest,
  AddPropertyToComparisonRequest,
  RemovePropertyFromComparisonRequest,
  ComparisonListResponse,
  ComparisonResponse,
  ComparisonError,
  UseComparisonOptions,
  UseComparisonReturn,
  ExportFormat
} from '@/types/comparison';
import { comparisonService } from '@/lib/comparisonService';

export function useComparison(
  userId: string,
  options: UseComparisonOptions = {}
): UseComparisonReturn {
  const {
    autoSave = true,
    maxProperties = 10,
    enableSharing = true,
    enableExport = true
  } = options;

  // State management
  const [comparison, setComparison] = useState<PropertyComparison | null>(null);
  const [comparisons, setComparisons] = useState<PropertyComparison[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ComparisonError | null>(null);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Create comparison
  const createComparison = useCallback(async (data: CreateComparisonRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await comparisonService.createComparison(data, userId);
      
      if (response.success && response.comparison) {
        setComparison(response.comparison);
        // Add to comparisons list
        setComparisons(prev => [response.comparison!, ...prev]);
        return response.comparison;
      } else {
        throw new Error(response.message || 'Failed to create comparison');
      }
    } catch (err) {
      const error: ComparisonError = {
        code: 'CREATE_FAILED',
        message: err instanceof Error ? err.message : 'Failed to create comparison',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Load comparison by ID
  const loadComparison = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await comparisonService.getComparison(id, userId);
      
      if (response.success && response.comparison) {
        setComparison(response.comparison);
        return response.comparison;
      } else {
        throw new Error(response.message || 'Comparison not found');
      }
    } catch (err) {
      const error: ComparisonError = {
        code: 'LOAD_FAILED',
        message: err instanceof Error ? err.message : 'Failed to load comparison',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Load user's comparisons
  const loadComparisons = useCallback(async (page = 1, limit = 10) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await comparisonService.getUserComparisons(userId, page, limit);
      setComparisons(response.comparisons);
      return response;
    } catch (err) {
      const error: ComparisonError = {
        code: 'LOAD_LIST_FAILED',
        message: err instanceof Error ? err.message : 'Failed to load comparisons',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Update comparison
  const updateComparison = useCallback(async (updates: UpdateComparisonRequest) => {
    if (!comparison) {
      throw new Error('No comparison selected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await comparisonService.updateComparison(
        comparison.id,
        updates,
        userId
      );
      
      if (response.success && response.comparison) {
        setComparison(response.comparison);
        // Update in comparisons list
        setComparisons(prev => 
          prev.map(c => c.id === comparison.id ? response.comparison! : c)
        );
        return response.comparison;
      } else {
        throw new Error(response.message || 'Failed to update comparison');
      }
    } catch (err) {
      const error: ComparisonError = {
        code: 'UPDATE_FAILED',
        message: err instanceof Error ? err.message : 'Failed to update comparison',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [comparison, userId]);

  // Delete comparison
  const deleteComparison = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await comparisonService.deleteComparison(id, userId);
      
      if (response.success) {
        // Remove from comparisons list
        setComparisons(prev => prev.filter(c => c.id !== id));
        // Clear current comparison if it was deleted
        if (comparison && comparison.id === id) {
          setComparison(null);
        }
        return true;
      } else {
        throw new Error(response.message || 'Failed to delete comparison');
      }
    } catch (err) {
      const error: ComparisonError = {
        code: 'DELETE_FAILED',
        message: err instanceof Error ? err.message : 'Failed to delete comparison',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [comparison, userId]);

  // Add property to comparison
  const addProperty = useCallback(async (propertyId: string, notes?: string) => {
    if (!comparison) {
      throw new Error('No comparison selected');
    }

    if (comparison.properties.length >= maxProperties) {
      throw new Error(`Maximum ${maxProperties} properties allowed in comparison`);
    }

    setIsLoading(true);
    setError(null);

    try {
      const data: AddPropertyToComparisonRequest = {
        propertyId,
        notes
      };

      const response = await comparisonService.addPropertyToComparison(
        comparison.id,
        data,
        userId
      );
      
      if (response.success && response.comparison) {
        setComparison(response.comparison);
        // Update in comparisons list
        setComparisons(prev => 
          prev.map(c => c.id === comparison.id ? response.comparison! : c)
        );
        return response.comparison;
      } else {
        throw new Error(response.message || 'Failed to add property to comparison');
      }
    } catch (err) {
      const error: ComparisonError = {
        code: 'ADD_PROPERTY_FAILED',
        message: err instanceof Error ? err.message : 'Failed to add property to comparison',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [comparison, userId, maxProperties]);

  // Remove property from comparison
  const removeProperty = useCallback(async (propertyId: string) => {
    if (!comparison) {
      throw new Error('No comparison selected');
    }

    if (comparison.properties.length <= 2) {
      throw new Error('At least 2 properties required in comparison');
    }

    setIsLoading(true);
    setError(null);

    try {
      const data: RemovePropertyFromComparisonRequest = {
        propertyId
      };

      const response = await comparisonService.removePropertyFromComparison(
        comparison.id,
        data,
        userId
      );
      
      if (response.success && response.comparison) {
        setComparison(response.comparison);
        // Update in comparisons list
        setComparisons(prev => 
          prev.map(c => c.id === comparison.id ? response.comparison! : c)
        );
        return response.comparison;
      } else {
        throw new Error(response.message || 'Failed to remove property from comparison');
      }
    } catch (err) {
      const error: ComparisonError = {
        code: 'REMOVE_PROPERTY_FAILED',
        message: err instanceof Error ? err.message : 'Failed to remove property from comparison',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [comparison, userId]);

  // Export comparison
  const exportComparison = useCallback(async (format: ExportFormat) => {
    if (!comparison) {
      throw new Error('No comparison selected');
    }

    if (!enableExport) {
      throw new Error('Export functionality is disabled');
    }

    setIsLoading(true);
    setError(null);

    try {
      const exportData = await comparisonService.exportComparison(
        comparison.id,
        format,
        userId
      );
      
      // Trigger download based on format
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `comparison-${comparison.id}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return exportData;
    } catch (err) {
      const error: ComparisonError = {
        code: 'EXPORT_FAILED',
        message: err instanceof Error ? err.message : 'Failed to export comparison',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [comparison, userId, enableExport]);

  // Share comparison
  const shareComparison = useCallback(async (comparisonId: string) => {
    if (!enableSharing) {
      throw new Error('Sharing functionality is disabled');
    }

    try {
      // Generate shareable URL
      const shareUrl = `${window.location.origin}/comparison/${comparisonId}`;
      
      // Copy to clipboard if available
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }
      
      return shareUrl;
    } catch (err) {
      const error: ComparisonError = {
        code: 'SHARE_FAILED',
        message: err instanceof Error ? err.message : 'Failed to share comparison',
        details: err
      };
      setError(error);
      throw error;
    }
  }, [enableSharing]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && comparison) {
      const timeoutId = setTimeout(() => {
        updateComparison({}).catch(console.error);
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [comparison, autoSave, updateComparison]);

  // Load comparisons on mount
  useEffect(() => {
    if (userId) {
      loadComparisons().catch(console.error);
    }
  }, [userId, loadComparisons]);

  return {
    comparison,
    comparisons,
    isLoading,
    error,
    addProperty,
    removeProperty,
    updateComparison,
    deleteComparison,
    createComparison,
    loadComparison,
    loadComparisons,
    exportComparison,
    shareComparison,
    clearError
  };
}
