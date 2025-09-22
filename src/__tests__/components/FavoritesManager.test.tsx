import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FavoritesManager } from '@/components/FavoritesManager'
import { useUserProfile } from '@/hooks/useUserProfile'
import { FavoriteProperty, Property } from '@/types'

// Mock the useUserProfile hook
jest.mock('@/hooks/useUserProfile')
const mockUseUserProfile = useUserProfile as jest.MockedFunction<typeof useUserProfile>

const mockProperty: Property = {
  id: 'prop_1',
  name: 'Test Property',
  description: 'A beautiful test property',
  address: '123 Test St, Test City',
  squareFootage: 1500,
  price: '1000',
  owner: '0x1234567890abcdef',
  imageUrl: 'https://example.com/property.jpg',
  isListed: true,
  bedrooms: 3,
  bathrooms: 2,
  propertyType: 'house',
}

const mockFavorites: FavoriteProperty[] = [
  {
    id: 'fav_1',
    userId: 'user_123',
    propertyId: 'prop_1',
    property: mockProperty,
    addedAt: '2023-12-01T00:00:00Z',
    notes: 'Great property for investment',
    tags: ['investment', 'downtown'],
  },
  {
    id: 'fav_2',
    userId: 'user_123',
    propertyId: 'prop_2',
    property: {
      ...mockProperty,
      id: 'prop_2',
      name: 'Another Property',
      price: '2000',
    },
    addedAt: '2023-11-01T00:00:00Z',
    notes: '',
    tags: ['luxury'],
  },
]

const mockRemoveFromFavorites = jest.fn()

describe('FavoritesManager', () => {
  beforeEach(() => {
    mockUseUserProfile.mockReturnValue({
      profile: null,
      favorites: mockFavorites,
      activities: [],
      isLoading: false,
      error: null,
      updateProfile: jest.fn(),
      updatePreferences: jest.fn(),
      addToFavorites: jest.fn(),
      removeFromFavorites: mockRemoveFromFavorites,
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

  it('renders favorites list correctly', () => {
    render(<FavoritesManager userAddress="0x1234567890abcdef" />)
    
    expect(screen.getByText('My Favorites')).toBeInTheDocument()
    expect(screen.getByText('Properties you\'ve saved for later (2 total)')).toBeInTheDocument()
    expect(screen.getByText('Test Property')).toBeInTheDocument()
    expect(screen.getByText('Another Property')).toBeInTheDocument()
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

    render(<FavoritesManager userAddress="0x1234567890abcdef" />)
    
    expect(screen.getByText('Loading favorites...')).toBeInTheDocument()
  })

  it('shows empty state when no favorites', () => {
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

    render(<FavoritesManager userAddress="0x1234567890abcdef" />)
    
    expect(screen.getByText('No favorites yet')).toBeInTheDocument()
    expect(screen.getByText('Start exploring properties and add them to your favorites!')).toBeInTheDocument()
  })

  it('filters favorites by search term', () => {
    render(<FavoritesManager userAddress="0x1234567890abcdef" />)
    
    const searchInput = screen.getByPlaceholderText('Search favorites...')
    fireEvent.change(searchInput, { target: { value: 'Test Property' } })
    
    expect(screen.getByText('Test Property')).toBeInTheDocument()
    expect(screen.queryByText('Another Property')).not.toBeInTheDocument()
  })

  it('filters favorites by tags', () => {
    render(<FavoritesManager userAddress="0x1234567890abcdef" />)
    
    const tagSelect = screen.getByDisplayValue('All Tags')
    fireEvent.change(tagSelect, { target: { value: 'investment' } })
    
    expect(screen.getByText('Test Property')).toBeInTheDocument()
    expect(screen.queryByText('Another Property')).not.toBeInTheDocument()
  })

  it('sorts favorites by price', () => {
    render(<FavoritesManager userAddress="0x1234567890abcdef" />)
    
    const sortSelect = screen.getByDisplayValue('Sort by Date Added')
    fireEvent.change(sortSelect, { target: { value: 'price' } })
    
    const propertyCards = screen.getAllByText(/Property/)
    expect(propertyCards[0]).toHaveTextContent('Test Property') // Lower price first
  })

  it('sorts favorites by name', () => {
    render(<FavoritesManager userAddress="0x1234567890abcdef" />)
    
    const sortSelect = screen.getByDisplayValue('Sort by Date Added')
    fireEvent.change(sortSelect, { target: { value: 'name' } })
    
    const propertyCards = screen.getAllByText(/Property/)
    expect(propertyCards[0]).toHaveTextContent('Another Property') // Alphabetically first
  })

  it('removes favorite when remove button is clicked', async () => {
    window.confirm = jest.fn(() => true)
    
    render(<FavoritesManager userAddress="0x1234567890abcdef" />)
    
    const removeButtons = screen.getAllByText('Remove')
    fireEvent.click(removeButtons[0])
    
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to remove this property from your favorites?')
    expect(mockRemoveFromFavorites).toHaveBeenCalledWith('fav_1')
  })

  it('does not remove favorite when confirmation is cancelled', () => {
    window.confirm = jest.fn(() => false)
    
    render(<FavoritesManager userAddress="0x1234567890abcdef" />)
    
    const removeButtons = screen.getAllByText('Remove')
    fireEvent.click(removeButtons[0])
    
    expect(window.confirm).toHaveBeenCalled()
    expect(mockRemoveFromFavorites).not.toHaveBeenCalled()
  })

  it('displays property notes', () => {
    render(<FavoritesManager userAddress="0x1234567890abcdef" />)
    
    expect(screen.getByText('Great property for investment')).toBeInTheDocument()
    expect(screen.getByText('No notes')).toBeInTheDocument()
  })

  it('allows editing notes', () => {
    render(<FavoritesManager userAddress="0x1234567890abcdef" />)
    
    const editNotesButton = screen.getByText('Edit')
    fireEvent.click(editNotesButton)
    
    const notesInput = screen.getByDisplayValue('Great property for investment')
    expect(notesInput).toBeInTheDocument()
    
    const saveButton = screen.getByText('Save')
    const cancelButton = screen.getByText('Cancel')
    expect(saveButton).toBeInTheDocument()
    expect(cancelButton).toBeInTheDocument()
  })

  it('displays property tags', () => {
    render(<FavoritesManager userAddress="0x1234567890abcdef" />)
    
    expect(screen.getByText('investment')).toBeInTheDocument()
    expect(screen.getByText('downtown')).toBeInTheDocument()
    expect(screen.getByText('luxury')).toBeInTheDocument()
  })

  it('allows adding new tags', () => {
    render(<FavoritesManager userAddress="0x1234567890abcdef" />)
    
    const tagInputs = screen.getAllByPlaceholderText('Add tag...')
    const firstTagInput = tagInputs[0]
    
    fireEvent.change(firstTagInput, { target: { value: 'new-tag' } })
    fireEvent.keyPress(firstTagInput, { key: 'Enter', code: 'Enter' })
    
    // In a real implementation, this would add the tag
    expect(firstTagInput).toHaveValue('')
  })

  it('calls onViewProperty when view button is clicked', () => {
    const mockOnViewProperty = jest.fn()
    render(
      <FavoritesManager 
        userAddress="0x1234567890abcdef" 
        onViewProperty={mockOnViewProperty}
      />
    )
    
    const viewButtons = screen.getAllByText('View')
    fireEvent.click(viewButtons[0])
    
    expect(mockOnViewProperty).toHaveBeenCalledWith(mockProperty)
  })

  it('calls onBuyProperty when buy button is clicked', () => {
    const mockOnBuyProperty = jest.fn()
    render(
      <FavoritesManager 
        userAddress="0x1234567890abcdef" 
        onBuyProperty={mockOnBuyProperty}
      />
    )
    
    const buyButtons = screen.getAllByText('Buy')
    fireEvent.click(buyButtons[0])
    
    expect(mockOnBuyProperty).toHaveBeenCalledWith(mockProperty)
  })

  it('shows active filters', () => {
    render(<FavoritesManager userAddress="0x1234567890abcdef" />)
    
    const searchInput = screen.getByPlaceholderText('Search favorites...')
    fireEvent.change(searchInput, { target: { value: 'test' } })
    
    expect(screen.getByText('Active filters:')).toBeInTheDocument()
    expect(screen.getByText('Search: "test"')).toBeInTheDocument()
  })

  it('clears search filter', () => {
    render(<FavoritesManager userAddress="0x1234567890abcdef" />)
    
    const searchInput = screen.getByPlaceholderText('Search favorites...')
    fireEvent.change(searchInput, { target: { value: 'test' } })
    
    const clearButton = screen.getByText('✕')
    fireEvent.click(clearButton)
    
    expect(searchInput).toHaveValue('')
  })

  it('shows no matching favorites when filters return no results', () => {
    render(<FavoritesManager userAddress="0x1234567890abcdef" />)
    
    const searchInput = screen.getByPlaceholderText('Search favorites...')
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } })
    
    expect(screen.getByText('No matching favorites')).toBeInTheDocument()
    expect(screen.getByText('Try adjusting your search or filter criteria.')).toBeInTheDocument()
  })
})
