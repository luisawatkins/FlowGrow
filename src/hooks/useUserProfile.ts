'use client'

import { useState, useEffect, useCallback } from 'react'
import { UserProfile, UserPreferences, UserStats, FavoriteProperty, UserActivity } from '@/types'

interface UserProfileState {
  profile: UserProfile | null
  favorites: FavoriteProperty[]
  activities: UserActivity[]
  isLoading: boolean
  error: string | null
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  currency: 'FLOW',
  language: 'en',
  notifications: {
    email: true,
    push: true,
    marketing: false,
    propertyUpdates: true,
    priceChanges: true,
  },
  privacy: {
    showEmail: false,
    showProfile: true,
    showActivity: true,
  },
}

const DEFAULT_STATS: UserStats = {
  totalProperties: 0,
  propertiesListed: 0,
  propertiesSold: 0,
  propertiesBought: 0,
  totalSpent: 0,
  totalEarned: 0,
  favoritesCount: 0,
  joinDate: new Date().toISOString(),
  lastActive: new Date().toISOString(),
}

export function useUserProfile(userAddress?: string) {
  const [state, setState] = useState<UserProfileState>({
    profile: null,
    favorites: [],
    activities: [],
    isLoading: true,
    error: null,
  })

  // Load user profile
  const loadProfile = useCallback(async (address: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      // In a real app, this would fetch from your backend/blockchain
      const profile: UserProfile = {
        id: `user_${address}`,
        address,
        username: `user_${address.slice(0, 8)}`,
        displayName: `User ${address.slice(0, 6)}...${address.slice(-4)}`,
        bio: 'Property enthusiast and blockchain investor',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${address}`,
        preferences: DEFAULT_PREFERENCES,
        stats: DEFAULT_STATS,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setState(prev => ({
        ...prev,
        profile,
        isLoading: false,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load profile',
        isLoading: false,
      }))
    }
  }, [])

  // Update profile
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!state.profile) return

    try {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
      }))

      const updatedProfile = {
        ...state.profile,
        ...updates,
        updatedAt: new Date().toISOString(),
      }

      // In a real app, this would save to your backend
      setState(prev => ({
        ...prev,
        profile: updatedProfile,
        isLoading: false,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update profile',
        isLoading: false,
      }))
    }
  }, [state.profile])

  // Update preferences
  const updatePreferences = useCallback(async (preferences: Partial<UserPreferences>) => {
    if (!state.profile) return

    const updatedPreferences = {
      ...state.profile.preferences,
      ...preferences,
    }

    await updateProfile({ preferences: updatedPreferences })
  }, [state.profile, updateProfile])

  // Load favorites
  const loadFavorites = useCallback(async (address: string) => {
    try {
      // In a real app, this would fetch from your backend
      const favorites: FavoriteProperty[] = []
      
      setState(prev => ({
        ...prev,
        favorites,
      }))
    } catch (error) {
      console.error('Failed to load favorites:', error)
    }
  }, [])

  // Add to favorites
  const addToFavorites = useCallback(async (propertyId: string, notes?: string, tags?: string[]) => {
    if (!state.profile) return

    try {
      const newFavorite: FavoriteProperty = {
        id: `fav_${Date.now()}`,
        userId: state.profile.id,
        propertyId,
        property: {} as any, // Would be populated from property data
        addedAt: new Date().toISOString(),
        notes,
        tags,
      }

      setState(prev => ({
        ...prev,
        favorites: [...prev.favorites, newFavorite],
      }))

      // Update stats
      await updateProfile({
        stats: {
          ...state.profile.stats,
          favoritesCount: state.favorites.length + 1,
        },
      })
    } catch (error) {
      console.error('Failed to add to favorites:', error)
    }
  }, [state.profile])

  // Remove from favorites
  const removeFromFavorites = useCallback(async (favoriteId: string) => {
    try {
      setState(prev => ({
        ...prev,
        favorites: prev.favorites.filter(fav => fav.id !== favoriteId),
      }))

      // Update stats
      if (state.profile) {
        await updateProfile({
          stats: {
            ...state.profile.stats,
            favoritesCount: Math.max(0, state.favorites.length - 1),
          },
        })
      }
    } catch (error) {
      console.error('Failed to remove from favorites:', error)
    }
  }, [state.profile, state.favorites.length, updateProfile])

  // Check if property is favorited
  const isFavorited = useCallback((propertyId: string) => {
    return state.favorites.some(fav => fav.propertyId === propertyId)
  }, [state.favorites])

  // Load activities
  const loadActivities = useCallback(async (address: string) => {
    try {
      // In a real app, this would fetch from your backend
      const activities: UserActivity[] = []
      
      setState(prev => ({
        ...prev,
        activities,
      }))
    } catch (error) {
      console.error('Failed to load activities:', error)
    }
  }, [])

  // Add activity
  const addActivity = useCallback(async (
    type: UserActivity['type'],
    description: string,
    metadata?: Record<string, any>
  ) => {
    if (!state.profile) return

    const activity: UserActivity = {
      id: `activity_${Date.now()}`,
      userId: state.profile.id,
      type,
      description,
      metadata,
      timestamp: new Date().toISOString(),
    }

    setState(prev => ({
      ...prev,
      activities: [activity, ...prev.activities].slice(0, 50), // Keep last 50 activities
    }))
  }, [state.profile])

  // Initialize profile when address changes
  useEffect(() => {
    if (userAddress) {
      loadProfile(userAddress)
      loadFavorites(userAddress)
      loadActivities(userAddress)
    }
  }, [userAddress, loadProfile, loadFavorites, loadActivities])

  return {
    ...state,
    updateProfile,
    updatePreferences,
    addToFavorites,
    removeFromFavorites,
    isFavorited,
    addActivity,
    loadProfile,
    loadFavorites,
    loadActivities,
  }
}
