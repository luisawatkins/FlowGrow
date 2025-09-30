import { useState, useEffect, useCallback } from 'react';
import {
  PropertySocialData,
  CreateShareRequest,
  UpdateShareRequest,
  CreateReactionRequest,
  CreateCommentRequest,
  UpdateCommentRequest,
  CreateFollowRequest,
  UpdateFollowRequest,
  UsePropertySocialOptions,
  UsePropertySocialReturn,
  SocialError,
  SocialAnalytics
} from '@/types/social';
import { socialService } from '@/lib/socialService';

export function usePropertySocial(
  propertyId: string,
  options: UsePropertySocialOptions = {}
): UsePropertySocialReturn {
  const {
    autoRefresh = true,
    refreshInterval = 5, // 5 minutes
    enableReactions = true,
    enableComments = true,
    enableShares = true,
    enableFollows = true
  } = options;

  // State management
  const [socialData, setSocialData] = useState<PropertySocialData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Create share
  const createShare = useCallback(async (request: CreateShareRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const userId = 'mock-user-123'; // In real app, get from auth context
      const response = await socialService.createShare(request, userId);
      
      if (response.success && response.share) {
        // Refresh social data
        await loadSocialData(propertyId);
        return response.share;
      } else {
        throw new Error(response.message || 'Failed to create share');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create share';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);

  // Update share
  const updateShare = useCallback(async (id: string, request: UpdateShareRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const userId = 'mock-user-123'; // In real app, get from auth context
      const response = await socialService.updateShare(id, request, userId);
      
      if (response.success && response.share) {
        // Refresh social data
        await loadSocialData(propertyId);
        return response.share;
      } else {
        throw new Error(response.message || 'Failed to update share');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update share';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);

  // Delete share
  const deleteShare = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const userId = 'mock-user-123'; // In real app, get from auth context
      const response = await socialService.deleteShare(id, userId);
      
      if (response.success) {
        // Refresh social data
        await loadSocialData(propertyId);
        return true;
      } else {
        throw new Error(response.message || 'Failed to delete share');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete share';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);

  // Create reaction
  const createReaction = useCallback(async (request: CreateReactionRequest) => {
    if (!enableReactions) return;

    setIsLoading(true);
    setError(null);

    try {
      const userId = 'mock-user-123'; // In real app, get from auth context
      const response = await socialService.createReaction(request, userId);
      
      if (response.success && response.reaction) {
        // Refresh social data
        await loadSocialData(propertyId);
        return response.reaction;
      } else {
        throw new Error(response.message || 'Failed to create reaction');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create reaction';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, enableReactions]);

  // Remove reaction
  const removeReaction = useCallback(async (propertyId: string, reactionType: string) => {
    if (!enableReactions) return;

    setIsLoading(true);
    setError(null);

    try {
      const userId = 'mock-user-123'; // In real app, get from auth context
      const response = await socialService.removeReaction(propertyId, reactionType as any, userId);
      
      if (response.success) {
        // Refresh social data
        await loadSocialData(propertyId);
        return true;
      } else {
        throw new Error(response.message || 'Failed to remove reaction');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove reaction';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [enableReactions]);

  // Create comment
  const createComment = useCallback(async (request: CreateCommentRequest) => {
    if (!enableComments) return;

    setIsLoading(true);
    setError(null);

    try {
      const userId = 'mock-user-123'; // In real app, get from auth context
      const response = await socialService.createComment(request, userId);
      
      if (response.success && response.comment) {
        // Refresh social data
        await loadSocialData(propertyId);
        return response.comment;
      } else {
        throw new Error(response.message || 'Failed to create comment');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create comment';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, enableComments]);

  // Update comment
  const updateComment = useCallback(async (id: string, request: UpdateCommentRequest) => {
    if (!enableComments) return;

    setIsLoading(true);
    setError(null);

    try {
      const userId = 'mock-user-123'; // In real app, get from auth context
      const response = await socialService.updateComment(id, request, userId);
      
      if (response.success && response.comment) {
        // Refresh social data
        await loadSocialData(propertyId);
        return response.comment;
      } else {
        throw new Error(response.message || 'Failed to update comment');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update comment';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, enableComments]);

  // Delete comment
  const deleteComment = useCallback(async (id: string) => {
    if (!enableComments) return;

    setIsLoading(true);
    setError(null);

    try {
      const userId = 'mock-user-123'; // In real app, get from auth context
      const response = await socialService.deleteComment(id, userId);
      
      if (response.success) {
        // Refresh social data
        await loadSocialData(propertyId);
        return true;
      } else {
        throw new Error(response.message || 'Failed to delete comment');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete comment';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [enableComments]);

  // Create follow
  const createFollow = useCallback(async (request: CreateFollowRequest) => {
    if (!enableFollows) return;

    setIsLoading(true);
    setError(null);

    try {
      const userId = 'mock-user-123'; // In real app, get from auth context
      const response = await socialService.createFollow(request, userId);
      
      if (response.success && response.follow) {
        // Refresh social data
        await loadSocialData(propertyId);
        return response.follow;
      } else {
        throw new Error(response.message || 'Failed to create follow');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create follow';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, enableFollows]);

  // Update follow
  const updateFollow = useCallback(async (id: string, request: UpdateFollowRequest) => {
    if (!enableFollows) return;

    setIsLoading(true);
    setError(null);

    try {
      const userId = 'mock-user-123'; // In real app, get from auth context
      const response = await socialService.updateFollow(id, request, userId);
      
      if (response.success && response.follow) {
        // Refresh social data
        await loadSocialData(propertyId);
        return response.follow;
      } else {
        throw new Error(response.message || 'Failed to update follow');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update follow';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [enableFollows]);

  // Delete follow
  const deleteFollow = useCallback(async (id: string) => {
    if (!enableFollows) return;

    setIsLoading(true);
    setError(null);

    try {
      const userId = 'mock-user-123'; // In real app, get from auth context
      const response = await socialService.deleteFollow(id, userId);
      
      if (response.success) {
        // Refresh social data
        await loadSocialData(propertyId);
        return true;
      } else {
        throw new Error(response.message || 'Failed to delete follow');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete follow';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [enableFollows]);

  // Load social data
  const loadSocialData = useCallback(async (propertyId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await socialService.getPropertySocialData(propertyId);
      
      if (response.success && response.data) {
        setSocialData(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to load social data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load social data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh && propertyId) {
      const interval = setInterval(() => {
        loadSocialData(propertyId).catch(console.error);
      }, refreshInterval * 60 * 1000); // Convert minutes to milliseconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, propertyId, refreshInterval, loadSocialData]);

  // Load data on mount
  useEffect(() => {
    if (propertyId) {
      loadSocialData(propertyId).catch(console.error);
    }
  }, [propertyId, loadSocialData]);

  return {
    socialData,
    isLoading,
    error,
    createShare,
    updateShare,
    deleteShare,
    createReaction,
    removeReaction,
    createComment,
    updateComment,
    deleteComment,
    createFollow,
    updateFollow,
    deleteFollow,
    loadSocialData,
    clearError
  };
}

// Additional hook for social profile management
export function useSocialProfile(userId?: string) {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await socialService.getSocialProfile(userId);
      
      if (response.success && response.profile) {
        setProfile(response.profile);
        return response.profile;
      } else {
        throw new Error(response.message || 'Failed to load social profile');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load social profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProfile = useCallback(async (request: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const userId = 'mock-user-123'; // In real app, get from auth context
      const response = await socialService.createSocialProfile(request, userId);
      
      if (response.success && response.profile) {
        setProfile(response.profile);
        return response.profile;
      } else {
        throw new Error(response.message || 'Failed to create social profile');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create social profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (request: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const userId = 'mock-user-123'; // In real app, get from auth context
      const response = await socialService.updateSocialProfile(userId, request);
      
      if (response.success && response.profile) {
        setProfile(response.profile);
        return response.profile;
      } else {
        throw new Error(response.message || 'Failed to update social profile');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update social profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (userId) {
      loadProfile(userId).catch(console.error);
    }
  }, [userId, loadProfile]);

  return {
    profile,
    isLoading,
    error,
    createProfile,
    updateProfile,
    loadProfile,
    clearError
  };
}

// Hook for social analytics
export function useSocialAnalytics(propertyId: string, period: 'day' | 'week' | 'month' | 'year' = 'week') {
  const [analytics, setAnalytics] = useState<SocialAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const analyticsData = await socialService.getSocialAnalytics(propertyId, period);
      setAnalytics(analyticsData);
      return analyticsData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load social analytics';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, period]);

  useEffect(() => {
    if (propertyId) {
      loadAnalytics().catch(console.error);
    }
  }, [propertyId, loadAnalytics]);

  return {
    analytics,
    isLoading,
    error,
    loadAnalytics
  };
}
