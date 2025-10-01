import { useState, useEffect, useCallback } from 'react';
import { FavoriteProperty, FavoritesFilter, FavoritesAnalytics, UseFavoritesReturn, PriceAlert } from '@/types/favorites';
import { favoritesService } from '@/lib/favoritesService';

export function useEnhancedFavorites(userId?: string): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState<FavoritesFilter>({});
  const [analytics, setAnalytics] = useState<FavoritesAnalytics | null>(null);

  // Load favorites
  const loadFavorites = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);

      const result = await favoritesService.getFavorites(userId, filters);
      setFavorites(result.favorites);
      setTotalCount(result.totalCount);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load favorites');
    } finally {
      setIsLoading(false);
    }
  }, [userId, filters]);

  // Load analytics
  const loadAnalytics = useCallback(async () => {
    if (!userId) return;

    try {
      const analyticsData = await favoritesService.getAnalytics(userId);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  }, [userId]);

  // Initial load
  useEffect(() => {
    loadFavorites();
    loadAnalytics();
  }, [loadFavorites, loadAnalytics]);

  // Add favorite
  const addFavorite = useCallback(async (
    propertyId: string, 
    notes?: string, 
    tags?: string[], 
    priority?: string
  ) => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const newFavorite = await favoritesService.addFavorite(userId, propertyId, notes, tags, priority);
      setFavorites(prev => [newFavorite, ...prev]);
      setTotalCount(prev => prev + 1);
      await loadAnalytics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add favorite');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId, loadAnalytics]);

  // Remove favorite
  const removeFavorite = useCallback(async (favoriteId: string) => {
    try {
      setIsLoading(true);
      await favoritesService.removeFavorite(favoriteId);
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      setTotalCount(prev => Math.max(0, prev - 1));
      await loadAnalytics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove favorite');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadAnalytics]);

  // Update favorite
  const updateFavorite = useCallback(async (favoriteId: string, updates: Partial<FavoriteProperty>) => {
    try {
      setIsLoading(true);
      const updatedFavorite = await favoritesService.updateFavorite(favoriteId, updates);
      setFavorites(prev => prev.map(fav => fav.id === favoriteId ? updatedFavorite : fav));
      await loadAnalytics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update favorite');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadAnalytics]);

  // Toggle favorite
  const toggleFavorite = useCallback(async (propertyId: string): Promise<boolean> => {
    if (!userId) return false;

    try {
      setIsLoading(true);
      const isFavorited = await favoritesService.toggleFavorite(userId, propertyId);
      
      if (isFavorited) {
        // Property was added to favorites
        await loadFavorites();
        await loadAnalytics();
      } else {
        // Property was removed from favorites
        setFavorites(prev => prev.filter(fav => fav.propertyId !== propertyId));
        setTotalCount(prev => Math.max(0, prev - 1));
        await loadAnalytics();
      }
      
      return isFavorited;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle favorite');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId, loadFavorites, loadAnalytics]);

  // Check if property is favorited
  const isFavorited = useCallback((propertyId: string): boolean => {
    if (!userId) return false;
    return favoritesService.isFavorited(userId, propertyId);
  }, [userId]);

  // Get favorite by property ID
  const getFavorite = useCallback((propertyId: string): FavoriteProperty | null => {
    if (!userId) return null;
    return favoritesService.getFavorite(userId, propertyId);
  }, [userId]);

  // Set filters
  const setFiltersCallback = useCallback((newFilters: FavoritesFilter) => {
    setFilters(newFilters);
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Search favorites
  const searchFavorites = useCallback((searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  }, []);

  // Sort favorites
  const sortFavorites = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortBy: sortBy as any, sortOrder }));
  }, []);

  // Create list
  const createList = useCallback(async (name: string, description?: string, isPublic = false): Promise<string> => {
    if (!userId) throw new Error('User ID required');
    return await favoritesService.createList(userId, name, description, isPublic);
  }, [userId]);

  // Add to list
  const addToList = useCallback(async (listId: string, propertyId: string) => {
    await favoritesService.addToList(listId, propertyId);
  }, []);

  // Remove from list
  const removeFromList = useCallback(async (listId: string, propertyId: string) => {
    await favoritesService.removeFromList(listId, propertyId);
  }, []);

  // Delete list
  const deleteList = useCallback(async (listId: string) => {
    await favoritesService.deleteList(listId);
  }, []);

  // Get analytics
  const getAnalytics = useCallback(async (): Promise<FavoritesAnalytics> => {
    if (!userId) throw new Error('User ID required');
    return await favoritesService.getAnalytics(userId);
  }, [userId]);

  // Export favorites
  const exportFavorites = useCallback(async (format: 'json' | 'csv' | 'pdf') => {
    if (!userId) throw new Error('User ID required');
    return await favoritesService.exportFavorites(userId, format);
  }, [userId]);

  // Import favorites
  const importFavorites = useCallback(async (data: any) => {
    if (!userId) throw new Error('User ID required');
    const result = await favoritesService.importFavorites(userId, data);
    
    if (result.validation.isValid) {
      await loadFavorites();
      await loadAnalytics();
    }
    
    return result;
  }, [userId, loadFavorites, loadAnalytics]);

  // Create price alert
  const createPriceAlert = useCallback(async (
    propertyId: string, 
    alert: Omit<PriceAlert, 'id' | 'propertyId' | 'userId'>
  ) => {
    if (!userId) throw new Error('User ID required');
    await favoritesService.createPriceAlert(propertyId, userId, alert);
  }, [userId]);

  // Update price alert
  const updatePriceAlert = useCallback(async (alertId: string, updates: Partial<PriceAlert>) => {
    await favoritesService.updatePriceAlert(alertId, updates);
  }, []);

  // Delete price alert
  const deletePriceAlert = useCallback(async (alertId: string) => {
    await favoritesService.deletePriceAlert(alertId);
  }, []);

  // Bulk add
  const bulkAdd = useCallback(async (propertyIds: string[]) => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      await favoritesService.bulkAdd(userId, propertyIds);
      await loadFavorites();
      await loadAnalytics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk add favorites');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId, loadFavorites, loadAnalytics]);

  // Bulk remove
  const bulkRemove = useCallback(async (favoriteIds: string[]) => {
    try {
      setIsLoading(true);
      await favoritesService.bulkRemove(favoriteIds);
      setFavorites(prev => prev.filter(fav => !favoriteIds.includes(fav.id)));
      setTotalCount(prev => Math.max(0, prev - favoriteIds.length));
      await loadAnalytics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk remove favorites');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadAnalytics]);

  // Bulk update
  const bulkUpdate = useCallback(async (favoriteIds: string[], updates: Partial<FavoriteProperty>) => {
    try {
      setIsLoading(true);
      await favoritesService.bulkUpdate(favoriteIds, updates);
      setFavorites(prev => prev.map(fav => 
        favoriteIds.includes(fav.id) ? { ...fav, ...updates } : fav
      ));
      await loadAnalytics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk update favorites');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadAnalytics]);

  // Refresh
  const refresh = useCallback(async () => {
    await loadFavorites();
    await loadAnalytics();
  }, [loadFavorites, loadAnalytics]);

  // Load more
  const loadMore = useCallback(async () => {
    // In a real implementation, this would load more items with pagination
    // For now, we'll just refresh
    await refresh();
  }, [refresh]);

  return {
    favorites,
    isLoading,
    error,
    totalCount,
    hasMore,
    filters,
    analytics,
    addFavorite,
    removeFavorite,
    updateFavorite,
    toggleFavorite,
    isFavorited,
    getFavorite,
    setFilters: setFiltersCallback,
    clearFilters,
    searchFavorites,
    sortFavorites,
    createList,
    addToList,
    removeFromList,
    deleteList,
    getAnalytics,
    exportFavorites,
    importFavorites,
    createPriceAlert,
    updatePriceAlert,
    deletePriceAlert,
    bulkAdd,
    bulkRemove,
    bulkUpdate,
    refresh,
    loadMore,
  };
}
