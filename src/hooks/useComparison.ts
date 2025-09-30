import { useState, useEffect, useCallback } from 'react';

interface Property {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: string;
  location: string;
  yearBuilt: number;
  parking: string;
  features: string[];
  amenities: string[];
}

export function useComparison() {
  const [comparisonList, setComparisonList] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComparisonList = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/comparison');
      
      if (!response.ok) {
        throw new Error('Failed to fetch comparison list');
      }
      
      const data = await response.json();
      setComparisonList(data);
    } catch (error) {
      console.error('Error fetching comparison list:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComparisonList();
  }, [fetchComparisonList]);

  const addToComparison = async (propertyId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/comparison', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ propertyId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to comparison');
      }

      const data = await response.json();
      setComparisonList(data);
    } catch (error) {
      console.error('Error adding to comparison:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromComparison = async (propertyId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/comparison/${propertyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove from comparison');
      }

      const data = await response.json();
      setComparisonList(data);
    } catch (error) {
      console.error('Error removing from comparison:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearComparison = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/comparison', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to clear comparison');
      }

      setComparisonList([]);
    } catch (error) {
      console.error('Error clearing comparison:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isInComparison = (propertyId: string) => {
    return comparisonList.some(property => property.id === propertyId);
  };

  return {
    comparisonList,
    isLoading,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
  };
}