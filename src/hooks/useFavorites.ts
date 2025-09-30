import { useState, useEffect, useCallback } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteProperties, setFavoriteProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/favorites');
      
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      
      const data = await response.json();
      setFavorites(data.favoriteIds);
      setFavoriteProperties(data.properties);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = async (propertyId: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ propertyId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update favorites');
      }

      const data = await response.json();
      setFavorites(data.favoriteIds);
      setFavoriteProperties(data.properties);
      
      return data;
    } catch (error) {
      console.error('Error updating favorites:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    favorites,
    favoriteProperties,
    isLoading,
    toggleFavorite,
  };
}
