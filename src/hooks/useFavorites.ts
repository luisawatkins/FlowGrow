import { useState, useEffect } from 'react';
import { FavoriteProperty, FavoriteList, CreateFavoriteRequest, UpdateFavoriteRequest, CreateFavoriteListRequest, UpdateFavoriteListRequest } from '../types/favorites';
import { FavoritesService } from '../lib/favoritesService';

export const useFavorites = (userId?: string) => {
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userFavorites = await FavoritesService.getUserFavorites(userId);
      setFavorites(userFavorites);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (request: CreateFavoriteRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const newFavorite = await FavoritesService.addToFavorites(request);
      setFavorites(prev => [...prev, newFavorite]);
      return newFavorite;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to favorites');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFavorite = async (request: UpdateFavoriteRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedFavorite = await FavoritesService.updateFavorite(request);
      setFavorites(prev => prev.map(fav => fav.id === request.id ? updatedFavorite : fav));
      return updatedFavorite;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update favorite');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (favoriteId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await FavoritesService.removeFromFavorites(favoriteId);
      if (success) {
        setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from favorites');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const isPropertyFavorited = (propertyId: string): boolean => {
    return favorites.some(fav => fav.propertyId === propertyId);
  };

  useEffect(() => {
    loadFavorites();
  }, [userId]);

  return {
    favorites,
    loading,
    error,
    addToFavorites,
    updateFavorite,
    removeFromFavorites,
    isPropertyFavorited,
    refreshFavorites: loadFavorites
  };
};

export const useFavoriteLists = (userId?: string) => {
  const [lists, setLists] = useState<FavoriteList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLists = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userLists = await FavoritesService.getFavoriteLists(userId);
      setLists(userLists);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load favorite lists');
    } finally {
      setLoading(false);
    }
  };

  const createList = async (request: CreateFavoriteListRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const newList = await FavoritesService.createFavoriteList(request);
      setLists(prev => [...prev, newList]);
      return newList;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create favorite list');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateList = async (request: UpdateFavoriteListRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedList = await FavoritesService.updateFavoriteList(request);
      setLists(prev => prev.map(list => list.id === request.id ? updatedList : list));
      return updatedList;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update favorite list');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteList = async (listId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await FavoritesService.deleteFavoriteList(listId);
      if (success) {
        setLists(prev => prev.filter(list => list.id !== listId));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete favorite list');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLists();
  }, [userId]);

  return {
    lists,
    loading,
    error,
    createList,
    updateList,
    deleteList,
    refreshLists: loadLists
  };
};