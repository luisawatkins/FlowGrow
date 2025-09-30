import { useState, useEffect, useCallback } from 'react';
import {
  PriceAlert,
  CreatePriceAlertRequest,
  UpdatePriceAlertRequest,
  PriceAlertError,
  UsePriceAlertsOptions,
  UsePriceAlertsReturn
} from '@/types/wishlist';
import { wishlistService } from '@/lib/wishlistService';

export function usePriceAlerts(
  userId: string,
  options: UsePriceAlertsOptions = {}
): UsePriceAlertsReturn {
  const {
    autoRefresh = true,
    refreshInterval = 5, // 5 minutes
    enableNotifications = true
  } = options;

  // State management
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<PriceAlertError | null>(null);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Create price alert
  const createAlert = useCallback(async (data: CreatePriceAlertRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await wishlistService.createPriceAlert(data, userId);
      
      if (response.success && response.alert) {
        setAlerts(prev => [response.alert!, ...prev]);
        return response.alert;
      } else {
        throw new Error(response.message || 'Failed to create price alert');
      }
    } catch (err) {
      const error: PriceAlertError = {
        code: 'CREATE_FAILED',
        message: err instanceof Error ? err.message : 'Failed to create price alert',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Update price alert
  const updateAlert = useCallback(async (id: string, updates: UpdatePriceAlertRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await wishlistService.updatePriceAlert(id, updates, userId);
      
      if (response.success && response.alert) {
        setAlerts(prev => 
          prev.map(alert => alert.id === id ? response.alert! : alert)
        );
        return response.alert;
      } else {
        throw new Error(response.message || 'Failed to update price alert');
      }
    } catch (err) {
      const error: PriceAlertError = {
        code: 'UPDATE_FAILED',
        message: err instanceof Error ? err.message : 'Failed to update price alert',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Delete price alert
  const deleteAlert = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await wishlistService.deletePriceAlert(id, userId);
      
      if (response.success) {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
        return true;
      } else {
        throw new Error(response.message || 'Failed to delete price alert');
      }
    } catch (err) {
      const error: PriceAlertError = {
        code: 'DELETE_FAILED',
        message: err instanceof Error ? err.message : 'Failed to delete price alert',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Load user's price alerts
  const loadAlerts = useCallback(async (page = 1, limit = 20) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await wishlistService.getUserPriceAlerts(userId, page, limit);
      setAlerts(response.alerts);
      return response;
    } catch (err) {
      const error: PriceAlertError = {
        code: 'LOAD_FAILED',
        message: err instanceof Error ? err.message : 'Failed to load price alerts',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh && enableNotifications) {
      const interval = setInterval(() => {
        loadAlerts().catch(console.error);
      }, refreshInterval * 60 * 1000); // Convert minutes to milliseconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, enableNotifications, refreshInterval, loadAlerts]);

  // Load alerts on mount
  useEffect(() => {
    if (userId) {
      loadAlerts().catch(console.error);
    }
  }, [userId, loadAlerts]);

  return {
    alerts,
    isLoading,
    error,
    createAlert,
    updateAlert,
    deleteAlert,
    loadAlerts,
    clearError
  };
}
