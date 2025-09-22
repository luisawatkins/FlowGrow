import { renderHook, act } from '@testing-library/react'
import { useUserProfile } from '@/hooks/useUserProfile'
import { UserProfile, UserPreferences, FavoriteProperty, UserActivity } from '@/types'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('useUserProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useUserProfile())
    
    expect(result.current.profile).toBeNull()
    expect(result.current.favorites).toEqual([])
    expect(result.current.activities).toEqual([])
    expect(result.current.isLoading).toBe(true)
    expect(result.current.error).toBeNull()
  })

  it('loads profile when userAddress is provided', async () => {
    const { result } = renderHook(() => useUserProfile('0x1234567890abcdef'))
    
    await act(async () => {
      // Wait for the effect to complete
    })
    
    expect(result.current.profile).not.toBeNull()
    expect(result.current.profile?.address).toBe('0x1234567890abcdef')
    expect(result.current.isLoading).toBe(false)
  })

  it('updates profile correctly', async () => {
    const { result } = renderHook(() => useUserProfile('0x1234567890abcdef'))
    
    await act(async () => {
      // Wait for initial load
    })
    
    const updates = {
      displayName: 'Updated Name',
      bio: 'Updated bio',
    }
    
    await act(async () => {
      await result.current.updateProfile(updates)
    })
    
    expect(result.current.profile?.displayName).toBe('Updated Name')
    expect(result.current.profile?.bio).toBe('Updated bio')
    expect(result.current.profile?.updatedAt).toBeDefined()
  })

  it('updates preferences correctly', async () => {
    const { result } = renderHook(() => useUserProfile('0x1234567890abcdef'))
    
    await act(async () => {
      // Wait for initial load
    })
    
    const preferenceUpdates = {
      theme: 'dark' as const,
      currency: 'USD' as const,
    }
    
    await act(async () => {
      await result.current.updatePreferences(preferenceUpdates)
    })
    
    expect(result.current.profile?.preferences.theme).toBe('dark')
    expect(result.current.profile?.preferences.currency).toBe('USD')
  })

  it('adds property to favorites', async () => {
    const { result } = renderHook(() => useUserProfile('0x1234567890abcdef'))
    
    await act(async () => {
      // Wait for initial load
    })
    
    const propertyId = 'prop_123'
    const notes = 'Great property'
    const tags = ['investment', 'downtown']
    
    await act(async () => {
      await result.current.addToFavorites(propertyId, notes, tags)
    })
    
    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.favorites[0].propertyId).toBe(propertyId)
    expect(result.current.favorites[0].notes).toBe(notes)
    expect(result.current.favorites[0].tags).toEqual(tags)
    expect(result.current.profile?.stats.favoritesCount).toBe(1)
  })

  it('removes property from favorites', async () => {
    const { result } = renderHook(() => useUserProfile('0x1234567890abcdef'))
    
    await act(async () => {
      // Wait for initial load
    })
    
    // Add a favorite first
    await act(async () => {
      await result.current.addToFavorites('prop_123', 'Great property', ['investment'])
    })
    
    const favoriteId = result.current.favorites[0].id
    
    // Remove the favorite
    await act(async () => {
      await result.current.removeFromFavorites(favoriteId)
    })
    
    expect(result.current.favorites).toHaveLength(0)
    expect(result.current.profile?.stats.favoritesCount).toBe(0)
  })

  it('checks if property is favorited', async () => {
    const { result } = renderHook(() => useUserProfile('0x1234567890abcdef'))
    
    await act(async () => {
      // Wait for initial load
    })
    
    // Add a favorite
    await act(async () => {
      await result.current.addToFavorites('prop_123', 'Great property')
    })
    
    expect(result.current.isFavorited('prop_123')).toBe(true)
    expect(result.current.isFavorited('prop_456')).toBe(false)
  })

  it('adds activity correctly', async () => {
    const { result } = renderHook(() => useUserProfile('0x1234567890abcdef'))
    
    await act(async () => {
      // Wait for initial load
    })
    
    const activity = {
      type: 'property_minted' as const,
      description: 'Minted new property',
      metadata: { propertyId: 'prop_123' },
    }
    
    await act(async () => {
      await result.current.addActivity(activity.type, activity.description, activity.metadata)
    })
    
    expect(result.current.activities).toHaveLength(1)
    expect(result.current.activities[0].type).toBe('property_minted')
    expect(result.current.activities[0].description).toBe('Minted new property')
    expect(result.current.activities[0].metadata).toEqual(activity.metadata)
  })

  it('limits activities to 50 items', async () => {
    const { result } = renderHook(() => useUserProfile('0x1234567890abcdef'))
    
    await act(async () => {
      // Wait for initial load
    })
    
    // Add 55 activities
    for (let i = 0; i < 55; i++) {
      await act(async () => {
        await result.current.addActivity('property_minted', `Activity ${i}`)
      })
    }
    
    expect(result.current.activities).toHaveLength(50)
    // Should keep the most recent 50
    expect(result.current.activities[0].description).toBe('Activity 54')
    expect(result.current.activities[49].description).toBe('Activity 5')
  })

  it('handles errors during profile loading', async () => {
    // Mock console.error to avoid noise in tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    const { result } = renderHook(() => useUserProfile('invalid-address'))
    
    await act(async () => {
      // Wait for the effect to complete
    })
    
    // The hook should handle errors gracefully
    expect(result.current.isLoading).toBe(false)
    
    consoleSpy.mockRestore()
  })

  it('handles errors during profile update', async () => {
    const { result } = renderHook(() => useUserProfile('0x1234567890abcdef'))
    
    await act(async () => {
      // Wait for initial load
    })
    
    // Try to update profile without a profile loaded
    const { result: result2 } = renderHook(() => useUserProfile())
    
    await act(async () => {
      await result2.current.updateProfile({ displayName: 'Test' })
    })
    
    // Should not throw an error
    expect(result2.current.profile).toBeNull()
  })

  it('handles errors during favorites operations', async () => {
    const { result } = renderHook(() => useUserProfile('0x1234567890abcdef'))
    
    await act(async () => {
      // Wait for initial load
    })
    
    // Try to add favorite without a profile loaded
    const { result: result2 } = renderHook(() => useUserProfile())
    
    await act(async () => {
      await result2.current.addToFavorites('prop_123')
    })
    
    // Should not throw an error
    expect(result2.current.favorites).toEqual([])
  })

  it('handles errors during activity operations', async () => {
    const { result } = renderHook(() => useUserProfile('0x1234567890abcdef'))
    
    await act(async () => {
      // Wait for initial load
    })
    
    // Try to add activity without a profile loaded
    const { result: result2 } = renderHook(() => useUserProfile())
    
    await act(async () => {
      await result2.current.addActivity('property_minted', 'Test activity')
    })
    
    // Should not throw an error
    expect(result2.current.activities).toEqual([])
  })

  it('reloads data when userAddress changes', async () => {
    const { result, rerender } = renderHook(
      ({ address }) => useUserProfile(address),
      { initialProps: { address: '0x1111111111111111' } }
    )
    
    await act(async () => {
      // Wait for initial load
    })
    
    const firstProfile = result.current.profile
    
    // Change address
    rerender({ address: '0x2222222222222222' })
    
    await act(async () => {
      // Wait for new load
    })
    
    expect(result.current.profile).not.toBe(firstProfile)
    expect(result.current.profile?.address).toBe('0x2222222222222222')
  })

  it('generates unique favorite IDs', async () => {
    const { result } = renderHook(() => useUserProfile('0x1234567890abcdef'))
    
    await act(async () => {
      // Wait for initial load
    })
    
    // Add multiple favorites
    await act(async () => {
      await result.current.addToFavorites('prop_1', 'Property 1')
    })
    
    await act(async () => {
      await result.current.addToFavorites('prop_2', 'Property 2')
    })
    
    const favoriteIds = result.current.favorites.map(fav => fav.id)
    const uniqueIds = new Set(favoriteIds)
    
    expect(uniqueIds.size).toBe(favoriteIds.length)
  })

  it('generates unique activity IDs', async () => {
    const { result } = renderHook(() => useUserProfile('0x1234567890abcdef'))
    
    await act(async () => {
      // Wait for initial load
    })
    
    // Add multiple activities
    await act(async () => {
      await result.current.addActivity('property_minted', 'Activity 1')
    })
    
    await act(async () => {
      await result.current.addActivity('property_sold', 'Activity 2')
    })
    
    const activityIds = result.current.activities.map(activity => activity.id)
    const uniqueIds = new Set(activityIds)
    
    expect(uniqueIds.size).toBe(activityIds.length)
  })
})
