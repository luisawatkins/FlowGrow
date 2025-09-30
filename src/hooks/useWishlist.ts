import { useState, useEffect, useCallback } from 'react';
import {
  Wishlist,
  CreateWishlistRequest,
  UpdateWishlistRequest,
  AddPropertyToWishlistRequest,
  RemovePropertyFromWishlistRequest,
  WishlistError,
  UseWishlistOptions,
  UseWishlistReturn,
  WishlistAnalytics
} from '@/types/wishlist';
import { wishlistService } from '@/lib/wishlistService';

export function useWishlist(
  userId: string,
  options: UseWishlistOptions = {}
): UseWishlistReturn {
  const {
    autoSync = true,
    enablePriceAlerts = true,
    maxProperties = 50,
    enableSharing = true
  } = options;

  // State management
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [currentWishlist, setCurrentWishlist] = useState<Wishlist | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<WishlistError | null>(null);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Create wishlist
  const createWishlist = useCallback(async (data: CreateWishlistRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await wishlistService.createWishlist(data, userId);
      
      if (response.success && response.wishlist) {
        setWishlists(prev => [response.wishlist!, ...prev]);
        return response.wishlist;
      } else {
        throw new Error(response.message || 'Failed to create wishlist');
      }
    } catch (err) {
      const error: WishlistError = {
        code: 'CREATE_FAILED',
        message: err instanceof Error ? err.message : 'Failed to create wishlist',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Update wishlist
  const updateWishlist = useCallback(async (id: string, updates: UpdateWishlistRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await wishlistService.updateWishlist(id, updates, userId);
      
      if (response.success && response.wishlist) {
        setWishlists(prev => 
          prev.map(w => w.id === id ? response.wishlist! : w)
        );
        
        if (currentWishlist && currentWishlist.id === id) {
          setCurrentWishlist(response.wishlist);
        }
        
        return response.wishlist;
      } else {
        throw new Error(response.message || 'Failed to update wishlist');
      }
    } catch (err) {
      const error: WishlistError = {
        code: 'UPDATE_FAILED',
        message: err instanceof Error ? err.message : 'Failed to update wishlist',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userId, currentWishlist]);

  // Delete wishlist
  const deleteWishlist = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await wishlistService.deleteWishlist(id, userId);
      
      if (response.success) {
        setWishlists(prev => prev.filter(w => w.id !== id));
        
        if (currentWishlist && currentWishlist.id === id) {
          setCurrentWishlist(null);
        }
        
        return true;
      } else {
        throw new Error(response.message || 'Failed to delete wishlist');
      }
    } catch (err) {
      const error: WishlistError = {
        code: 'DELETE_FAILED',
        message: err instanceof Error ? err.message : 'Failed to delete wishlist',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userId, currentWishlist]);

  // Add property to wishlist
  const addProperty = useCallback(async (wishlistId: string, data: AddPropertyToWishlistRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await wishlistService.addPropertyToWishlist(wishlistId, data, userId);
      
      if (response.success && response.wishlist) {
        setWishlists(prev => 
          prev.map(w => w.id === wishlistId ? response.wishlist! : w)
        );
        
        if (currentWishlist && currentWishlist.id === wishlistId) {
          setCurrentWishlist(response.wishlist);
        }
        
        return response.wishlist;
      } else {
        throw new Error(response.message || 'Failed to add property to wishlist');
      }
    } catch (err) {
      const error: WishlistError = {
        code: 'ADD_PROPERTY_FAILED',
        message: err instanceof Error ? err.message : 'Failed to add property to wishlist',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userId, currentWishlist]);

  // Remove property from wishlist
  const removeProperty = useCallback(async (wishlistId: string, propertyId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await wishlistService.removePropertyFromWishlist(
        wishlistId,
        { propertyId },
        userId
      );
      
      if (response.success && response.wishlist) {
        setWishlists(prev => 
          prev.map(w => w.id === wishlistId ? response.wishlist! : w)
        );
        
        if (currentWishlist && currentWishlist.id === wishlistId) {
          setCurrentWishlist(response.wishlist);
        }
        
        return response.wishlist;
      } else {
        throw new Error(response.message || 'Failed to remove property from wishlist');
      }
    } catch (err) {
      const error: WishlistError = {
        code: 'REMOVE_PROPERTY_FAILED',
        message: err instanceof Error ? err.message : 'Failed to remove property from wishlist',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userId, currentWishlist]);

  // Load wishlist by ID
  const loadWishlist = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await wishlistService.getWishlist(id, userId);
      
      if (response.success && response.wishlist) {
        setCurrentWishlist(response.wishlist);
        return response.wishlist;
      } else {
        throw new Error(response.message || 'Wishlist not found');
      }
    } catch (err) {
      const error: WishlistError = {
        code: 'LOAD_FAILED',
        message: err instanceof Error ? err.message : 'Failed to load wishlist',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Load user's wishlists
  const loadWishlists = useCallback(async (page = 1, limit = 10) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await wishlistService.getUserWishlists(userId, page, limit);
      setWishlists(response.wishlists);
      return response;
    } catch (err) {
      const error: WishlistError = {
        code: 'LOAD_LIST_FAILED',
        message: err instanceof Error ? err.message : 'Failed to load wishlists',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Auto-sync functionality
  useEffect(() => {
    if (autoSync && currentWishlist) {
      const interval = setInterval(() => {
        loadWishlist(currentWishlist.id).catch(console.error);
      }, 30000); // Sync every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoSync, currentWishlist, loadWishlist]);

  // Load wishlists on mount
  useEffect(() => {
    if (userId) {
      loadWishlists().catch(console.error);
    }
  }, [userId, loadWishlists]);

  return {
    wishlists,
    currentWishlist,
    isLoading,
    error,
    createWishlist,
    updateWishlist,
    deleteWishlist,
    addProperty,
    removeProperty,
    loadWishlists,
    loadWishlist,
    clearError
  };
}
