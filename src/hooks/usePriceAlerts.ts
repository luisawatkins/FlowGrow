import { useState, useEffect, useCallback } from 'react';

interface PriceAlert {
  id: string;
  propertyId: string;
  type: 'price_drop' | 'price_increase' | 'specific_price';
  currentPrice: number;
  targetPrice?: number;
  percentage?: number;
  createdAt: string;
  property: {
    id: string;
    title: string;
    price: number;
  };
}

interface CreateAlertParams {
  propertyId: string;
  type: 'price_drop' | 'price_increase' | 'specific_price';
  currentPrice: number;
  targetPrice?: number;
  percentage?: number;
}

export function usePriceAlerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/price-alerts');
      
      if (!response.ok) {
        throw new Error('Failed to fetch price alerts');
      }
      
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching price alerts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const createAlert = async (params: CreateAlertParams) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/price-alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to create alert');
      }

      const data = await response.json();
      setAlerts(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAlert = async (alertId: string, params: Partial<CreateAlertParams>) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/price-alerts/${alertId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to update alert');
      }

      const data = await response.json();
      setAlerts(prev =>
        prev.map(alert => (alert.id === alertId ? data : alert))
      );
      return data;
    } catch (error) {
      console.error('Error updating alert:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAlert = async (alertId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/price-alerts/${alertId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete alert');
      }

      setAlerts(prev =>
        prev.filter(alert => alert.id !== alertId)
      );
    } catch (error) {
      console.error('Error deleting alert:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    alerts,
    isLoading,
    createAlert,
    updateAlert,
    deleteAlert,
  };
}