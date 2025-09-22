import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { UserDashboard } from '@/components/UserDashboard'
import { useUserProfile } from '@/hooks/useUserProfile'
import { UserProfile, UserActivity } from '@/types'

// Mock the useUserProfile hook
jest.mock('@/hooks/useUserProfile')
const mockUseUserProfile = useUserProfile as jest.MockedFunction<typeof useUserProfile>

const mockProfile: UserProfile = {
  id: 'user_123',
  address: '0x1234567890abcdef',
  username: 'testuser',
  displayName: 'Test User',
  bio: 'Test bio',
  avatar: 'https://example.com/avatar.jpg',
  email: 'test@example.com',
  preferences: {
    theme: 'light',
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
  },
  stats: {
    totalProperties: 5,
    propertiesListed: 3,
    propertiesSold: 2,
    propertiesBought: 1,
    totalSpent: 1000,
    totalEarned: 2000,
    favoritesCount: 10,
    joinDate: '2023-01-01T00:00:00Z',
    lastActive: '2023-12-01T00:00:00Z',
  },
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-12-01T00:00:00Z',
}

const mockActivities: UserActivity[] = [
  {
    id: 'activity_1',
    userId: 'user_123',
    type: 'property_minted',
    description: 'Minted new property "Test House"',
    metadata: { propertyId: 'prop_1' },
    timestamp: '2023-12-01T10:00:00Z',
  },
  {
    id: 'activity_2',
    userId: 'user_123',
    type: 'property_sold',
    description: 'Sold property "Old House" for 500 FLOW',
    metadata: { propertyId: 'prop_2', price: '500' },
    timestamp: '2023-11-30T15:30:00Z',
  },
]

const mockUpdatePreferences = jest.fn()

describe('UserDashboard', () => {
  beforeEach(() => {
    mockUseUserProfile.mockReturnValue({
      profile: mockProfile,
      favorites: [],
      activities: mockActivities,
      isLoading: false,
      error: null,
      updateProfile: jest.fn(),
      updatePreferences: mockUpdatePreferences,
      addToFavorites: jest.fn(),
      removeFromFavorites: jest.fn(),
      isFavorited: jest.fn(),
      addActivity: jest.fn(),
      loadProfile: jest.fn(),
      loadFavorites: jest.fn(),
      loadActivities: jest.fn(),
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders dashboard with sidebar navigation', () => {
    render(<UserDashboard userAddress="0x1234567890abcdef" />)
    
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('@testuser')).toBeInTheDocument()
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Favorites')).toBeInTheDocument()
    expect(screen.getByText('My Properties')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    mockUseUserProfile.mockReturnValue({
      profile: null,
      favorites: [],
      activities: [],
      isLoading: true,
      error: null,
      updateProfile: jest.fn(),
      updatePreferences: jest.fn(),
      addToFavorites: jest.fn(),
      removeFromFavorites: jest.fn(),
      isFavorited: jest.fn(),
      addActivity: jest.fn(),
      loadProfile: jest.fn(),
      loadFavorites: jest.fn(),
      loadActivities: jest.fn(),
    })

    render(<UserDashboard userAddress="0x1234567890abcdef" />)
    
    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument()
  })

  it('shows error state when profile not found', () => {
    mockUseUserProfile.mockReturnValue({
      profile: null,
      favorites: [],
      activities: [],
      isLoading: false,
      error: null,
      updateProfile: jest.fn(),
      updatePreferences: jest.fn(),
      addToFavorites: jest.fn(),
      removeFromFavorites: jest.fn(),
      isFavorited: jest.fn(),
      addActivity: jest.fn(),
      loadProfile: jest.fn(),
      loadFavorites: jest.fn(),
      loadActivities: jest.fn(),
    })

    render(<UserDashboard userAddress="0x1234567890abcdef" />)
    
    expect(screen.getByText('Profile not found')).toBeInTheDocument()
  })

  it('displays overview tab by default', () => {
    render(<UserDashboard userAddress="0x1234567890abcdef" />)
    
    expect(screen.getByText('Welcome back, Test User!')).toBeInTheDocument()
    expect(screen.getByText('Total Properties')).toBeInTheDocument()
    expect(screen.getByText('Properties Sold')).toBeInTheDocument()
    expect(screen.getByText('Favorites')).toBeInTheDocument()
    expect(screen.getByText('Total Earned (FLOW)')).toBeInTheDocument()
  })

  it('switches to profile tab when clicked', () => {
    render(<UserDashboard userAddress="0x1234567890abcdef" />)
    
    const profileTab = screen.getByText('Profile')
    fireEvent.click(profileTab)
    
    expect(screen.getByText('User Profile')).toBeInTheDocument()
    expect(screen.getByText('Manage your account settings and preferences')).toBeInTheDocument()
  })

  it('switches to favorites tab when clicked', () => {
    render(<UserDashboard userAddress="0x1234567890abcdef" />)
    
    const favoritesTab = screen.getByText('Favorites')
    fireEvent.click(favoritesTab)
    
    expect(screen.getByText('My Favorites')).toBeInTheDocument()
  })

  it('switches to properties tab when clicked', () => {
    render(<UserDashboard userAddress="0x1234567890abcdef" />)
    
    const propertiesTab = screen.getByText('My Properties')
    fireEvent.click(propertiesTab)
    
    expect(screen.getByText('My Properties')).toBeInTheDocument()
    expect(screen.getByText('Properties you own or have listed for sale')).toBeInTheDocument()
  })

  it('switches to settings tab when clicked', () => {
    render(<UserDashboard userAddress="0x1234567890abcdef" />)
    
    const settingsTab = screen.getByText('Settings')
    fireEvent.click(settingsTab)
    
    expect(screen.getByText('Preferences')).toBeInTheDocument()
    expect(screen.getByText('Customize your experience')).toBeInTheDocument()
  })

  it('displays user statistics in overview', () => {
    render(<UserDashboard userAddress="0x1234567890abcdef" />)
    
    expect(screen.getByText('5')).toBeInTheDocument() // totalProperties
    expect(screen.getByText('2')).toBeInTheDocument() // propertiesSold
    expect(screen.getByText('10')).toBeInTheDocument() // favoritesCount
    expect(screen.getByText('2000')).toBeInTheDocument() // totalEarned
  })

  it('displays recent activities', () => {
    render(<UserDashboard userAddress="0x1234567890abcdef" />)
    
    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
    expect(screen.getByText('Minted new property "Test House"')).toBeInTheDocument()
    expect(screen.getByText('Sold property "Old House" for 500 FLOW')).toBeInTheDocument()
  })

  it('shows no activity message when no activities', () => {
    mockUseUserProfile.mockReturnValue({
      profile: mockProfile,
      favorites: [],
      activities: [],
      isLoading: false,
      error: null,
      updateProfile: jest.fn(),
      updatePreferences: mockUpdatePreferences,
      addToFavorites: jest.fn(),
      removeFromFavorites: jest.fn(),
      isFavorited: jest.fn(),
      addActivity: jest.fn(),
      loadProfile: jest.fn(),
      loadFavorites: jest.fn(),
      loadActivities: jest.fn(),
    })

    render(<UserDashboard userAddress="0x1234567890abcdef" />)
    
    expect(screen.getByText('No recent activity')).toBeInTheDocument()
  })

  it('shows empty properties state in properties tab', () => {
    render(<UserDashboard userAddress="0x1234567890abcdef" />)
    
    const propertiesTab = screen.getByText('My Properties')
    fireEvent.click(propertiesTab)
    
    expect(screen.getByText('No properties yet')).toBeInTheDocument()
    expect(screen.getByText('Start by minting your first property NFT!')).toBeInTheDocument()
    expect(screen.getByText('Mint Property')).toBeInTheDocument()
  })

  it('highlights active tab', () => {
    render(<UserDashboard userAddress="0x1234567890abcdef" />)
    
    const overviewTab = screen.getByText('Overview')
    const profileTab = screen.getByText('Profile')
    
    // Overview should be active by default
    expect(overviewTab.closest('button')).toHaveClass('bg-blue-50', 'text-blue-700')
    expect(profileTab.closest('button')).not.toHaveClass('bg-blue-50', 'text-blue-700')
    
    // Click profile tab
    fireEvent.click(profileTab)
    
    // Profile should now be active
    expect(profileTab.closest('button')).toHaveClass('bg-blue-50', 'text-blue-700')
    expect(overviewTab.closest('button')).not.toHaveClass('bg-blue-50', 'text-blue-700')
  })

  it('displays activity icons correctly', () => {
    render(<UserDashboard userAddress="0x1234567890abcdef" />)
    
    // Check for activity icons
    expect(screen.getByText('🏗️')).toBeInTheDocument() // property_minted
    expect(screen.getByText('💸')).toBeInTheDocument() // property_sold
  })

  it('formats activity timestamps', () => {
    render(<UserDashboard userAddress="0x1234567890abcdef" />)
    
    // Check that timestamps are displayed (exact format may vary)
    const activityItems = screen.getAllByText(/Dec 1, 2023|Nov 30, 2023/)
    expect(activityItems.length).toBeGreaterThan(0)
  })
})
