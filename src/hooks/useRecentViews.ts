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
  viewedAt: string;
}

export function useRecentViews() {
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecentViews = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/recent-views');
      
      if (!response.ok) {
        throw new Error('Failed to fetch recent views');
      }
      
      const data = await response.json();
      setRecentProperties(data);
    } catch (error) {
      console.error('Error fetching recent views:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentViews();
  }, [fetchRecentViews]);

  const addToRecentViews = async (propertyId: string) => {
    try {
      const response = await fetch('/api/recent-views', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ propertyId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to recent views');
      }

      const data = await response.json();
      setRecentProperties(data);
    } catch (error) {
      console.error('Error adding to recent views:', error);
    }
  };

  const clearHistory = async () => {
    try {
      const response = await fetch('/api/recent-views', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to clear recent views');
      }

      setRecentProperties([]);
    } catch (error) {
      console.error('Error clearing recent views:', error);
    }
  };

  return {
    recentProperties,
    isLoading,
    addToRecentViews,
    clearHistory,
  };
}
