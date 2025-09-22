import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { UserProfileComponent, UserPreferencesComponent } from '@/components/UserProfile'
import { useUserProfile } from '@/hooks/useUserProfile'
import { UserProfile, UserPreferences } from '@/types'

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

const mockUpdateProfile = jest.fn()
const mockUpdatePreferences = jest.fn()

describe('UserProfileComponent', () => {
  beforeEach(() => {
    mockUseUserProfile.mockReturnValue({
      profile: mockProfile,
      favorites: [],
      activities: [],
      isLoading: false,
      error: null,
      updateProfile: mockUpdateProfile,
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

  it('renders user profile information correctly', () => {
    render(<UserProfileComponent userAddress="0x1234567890abcdef" />)
    
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('@testuser')).toBeInTheDocument()
    expect(screen.getByText('0x1234...cdef')).toBeInTheDocument()
    expect(screen.getByText('Test bio')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('displays user statistics', () => {
    render(<UserProfileComponent userAddress="0x1234567890abcdef" />)
    
    expect(screen.getByText('5')).toBeInTheDocument() // totalProperties
    expect(screen.getByText('2')).toBeInTheDocument() // propertiesSold
    expect(screen.getByText('1')).toBeInTheDocument() // propertiesBought
    expect(screen.getByText('10')).toBeInTheDocument() // favoritesCount
  })

  it('shows loading state', () => {
    mockUseUserProfile.mockReturnValue({
      profile: null,
      favorites: [],
      activities: [],
      isLoading: true,
      error: null,
      updateProfile: mockUpdateProfile,
      updatePreferences: mockUpdatePreferences,
      addToFavorites: jest.fn(),
      removeFromFavorites: jest.fn(),
      isFavorited: jest.fn(),
      addActivity: jest.fn(),
      loadProfile: jest.fn(),
      loadFavorites: jest.fn(),
      loadActivities: jest.fn(),
    })

    render(<UserProfileComponent userAddress="0x1234567890abcdef" />)
    
    expect(screen.getByText('Loading profile...')).toBeInTheDocument()
  })

  it('shows error state when profile not found', () => {
    mockUseUserProfile.mockReturnValue({
      profile: null,
      favorites: [],
      activities: [],
      isLoading: false,
      error: null,
      updateProfile: mockUpdateProfile,
      updatePreferences: mockUpdatePreferences,
      addToFavorites: jest.fn(),
      removeFromFavorites: jest.fn(),
      isFavorited: jest.fn(),
      addActivity: jest.fn(),
      loadProfile: jest.fn(),
      loadFavorites: jest.fn(),
      loadActivities: jest.fn(),
    })

    render(<UserProfileComponent userAddress="0x1234567890abcdef" />)
    
    expect(screen.getByText('Profile not found')).toBeInTheDocument()
  })

  it('enters edit mode when edit button is clicked', () => {
    render(<UserProfileComponent userAddress="0x1234567890abcdef" />)
    
    const editButton = screen.getByText('Edit Profile')
    fireEvent.click(editButton)
    
    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument()
    expect(screen.getByDisplayValue('testuser')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test bio')).toBeInTheDocument()
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument()
  })

  it('saves profile changes', async () => {
    render(<UserProfileComponent userAddress="0x1234567890abcdef" />)
    
    const editButton = screen.getByText('Edit Profile')
    fireEvent.click(editButton)
    
    const displayNameInput = screen.getByDisplayValue('Test User')
    fireEvent.change(displayNameInput, { target: { value: 'Updated Name' } })
    
    const saveButton = screen.getByText('Save Changes')
    fireEvent.click(saveButton)
    
    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        displayName: 'Updated Name',
        username: 'testuser',
        bio: 'Test bio',
        email: 'test@example.com',
      })
    })
  })

  it('cancels edit mode without saving', () => {
    render(<UserProfileComponent userAddress="0x1234567890abcdef" />)
    
    const editButton = screen.getByText('Edit Profile')
    fireEvent.click(editButton)
    
    const displayNameInput = screen.getByDisplayValue('Test User')
    fireEvent.change(displayNameInput, { target: { value: 'Updated Name' } })
    
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)
    
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(mockUpdateProfile).not.toHaveBeenCalled()
  })

  it('displays close button when onClose prop is provided', () => {
    const mockOnClose = jest.fn()
    render(<UserProfileComponent userAddress="0x1234567890abcdef" onClose={mockOnClose} />)
    
    const closeButton = screen.getByText('✕')
    expect(closeButton).toBeInTheDocument()
    
    fireEvent.click(closeButton)
    expect(mockOnClose).toHaveBeenCalled()
  })
})

describe('UserPreferencesComponent', () => {
  const mockPreferences: UserPreferences = {
    theme: 'dark',
    currency: 'USD',
    language: 'en',
    notifications: {
      email: true,
      push: false,
      marketing: true,
      propertyUpdates: false,
      priceChanges: true,
    },
    privacy: {
      showEmail: true,
      showProfile: false,
      showActivity: true,
    },
  }

  const mockOnUpdate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders preferences form correctly', () => {
    render(
      <UserPreferencesComponent
        preferences={mockPreferences}
        onUpdate={mockOnUpdate}
      />
    )
    
    expect(screen.getByDisplayValue('dark')).toBeInTheDocument()
    expect(screen.getByDisplayValue('USD')).toBeInTheDocument()
  })

  it('updates theme preference', () => {
    render(
      <UserPreferencesComponent
        preferences={mockPreferences}
        onUpdate={mockOnUpdate}
      />
    )
    
    const themeSelect = screen.getByDisplayValue('dark')
    fireEvent.change(themeSelect, { target: { value: 'light' } })
    
    expect(mockOnUpdate).toHaveBeenCalledWith({ theme: 'light' })
  })

  it('updates currency preference', () => {
    render(
      <UserPreferencesComponent
        preferences={mockPreferences}
        onUpdate={mockOnUpdate}
      />
    )
    
    const currencySelect = screen.getByDisplayValue('USD')
    fireEvent.change(currencySelect, { target: { value: 'EUR' } })
    
    expect(mockOnUpdate).toHaveBeenCalledWith({ currency: 'EUR' })
  })

  it('updates notification preferences', () => {
    render(
      <UserPreferencesComponent
        preferences={mockPreferences}
        onUpdate={mockOnUpdate}
      />
    )
    
    const emailCheckbox = screen.getByRole('checkbox', { name: /email/i })
    fireEvent.click(emailCheckbox)
    
    expect(mockOnUpdate).toHaveBeenCalledWith({
      notifications: {
        ...mockPreferences.notifications,
        email: false,
      },
    })
  })

  it('updates privacy preferences', () => {
    render(
      <UserPreferencesComponent
        preferences={mockPreferences}
        onUpdate={mockOnUpdate}
      />
    )
    
    const showEmailCheckbox = screen.getByRole('checkbox', { name: /show email/i })
    fireEvent.click(showEmailCheckbox)
    
    expect(mockOnUpdate).toHaveBeenCalledWith({
      privacy: {
        ...mockPreferences.privacy,
        showEmail: false,
      },
    })
  })
})
