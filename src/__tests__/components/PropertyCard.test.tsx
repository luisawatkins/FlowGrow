import React from 'react'
import { render, screen, fireEvent, waitFor } from '../utils/testUtils'
import { PropertyCard } from '@/components/PropertyCard'
import { Property } from '@/types'

// Mock the useUserProfile hook
jest.mock('@/hooks/useUserProfile', () => ({
  useUserProfile: () => ({
    isFavorited: jest.fn(() => false),
    addToFavorites: jest.fn(),
    removeFromFavorites: jest.fn(),
  }),
}))

describe('PropertyCard', () => {
  const mockProperty: Property = {
    id: '1',
    name: 'Test Property',
    description: 'A beautiful test property',
    address: '123 Test St, Test City, TC 12345',
    squareFootage: 1500,
    price: '100.50',
    owner: '0x1234567890abcdef',
    isListed: true,
    tokenId: '1',
    contractAddress: '0xabcdef1234567890',
  }

  const defaultProps = {
    property: mockProperty,
    currentUser: '0x1234567890abcdef',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders property information correctly', () => {
    render(<PropertyCard {...defaultProps} />)
    
    expect(screen.getByText('Test Property')).toBeInTheDocument()
    expect(screen.getByText('A beautiful test property')).toBeInTheDocument()
    expect(screen.getByText('123 Test St, Test City, TC 12345')).toBeInTheDocument()
    expect(screen.getByText('1,500')).toBeInTheDocument()
    expect(screen.getByText('100.50 FLOW')).toBeInTheDocument()
  })

  it('shows "For Sale" badge when property is listed', () => {
    render(<PropertyCard {...defaultProps} />)
    expect(screen.getByText('For Sale')).toBeInTheDocument()
  })

  it('does not show "For Sale" badge when property is not listed', () => {
    const unlistedProperty = { ...mockProperty, isListed: false }
    render(<PropertyCard {...defaultProps} property={unlistedProperty} />)
    expect(screen.queryByText('For Sale')).not.toBeInTheDocument()
  })

  it('shows owner information', () => {
    render(<PropertyCard {...defaultProps} />)
    expect(screen.getByText('0x1234...cdef')).toBeInTheDocument()
  })

  it('shows token ID when available', () => {
    render(<PropertyCard {...defaultProps} />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('calls onView when View Details button is clicked', () => {
    const onView = jest.fn()
    render(<PropertyCard {...defaultProps} onView={onView} />)
    
    fireEvent.click(screen.getByText('View Details'))
    expect(onView).toHaveBeenCalledWith(mockProperty)
  })

  it('calls onBuy when Buy Now button is clicked', () => {
    const onBuy = jest.fn()
    const otherUserProperty = { ...mockProperty, owner: '0x9876543210fedcba' }
    render(
      <PropertyCard 
        {...defaultProps} 
        property={otherUserProperty} 
        onBuy={onBuy} 
      />
    )
    
    fireEvent.click(screen.getByText('Buy Now'))
    expect(onBuy).toHaveBeenCalledWith(otherUserProperty)
  })

  it('shows "Your Property" when user owns the property', () => {
    render(<PropertyCard {...defaultProps} />)
    expect(screen.getByText('Your Property')).toBeInTheDocument()
  })

  it('does not show Buy button for owned properties', () => {
    render(<PropertyCard {...defaultProps} />)
    expect(screen.queryByText('Buy Now')).not.toBeInTheDocument()
  })

  it('shows loading state when buying', () => {
    const otherUserProperty = { ...mockProperty, owner: '0x9876543210fedcba' }
    render(
      <PropertyCard 
        {...defaultProps} 
        property={otherUserProperty} 
        isBuying={true} 
      />
    )
    
    expect(screen.getByText('Buying...')).toBeInTheDocument()
  })

  it('disables buy button when buying', () => {
    const otherUserProperty = { ...mockProperty, owner: '0x9876543210fedcba' }
    render(
      <PropertyCard 
        {...defaultProps} 
        property={otherUserProperty} 
        isBuying={true} 
      />
    )
    
    const buyButton = screen.getByText('Buying...')
    expect(buyButton).toBeDisabled()
  })

  it('shows favorite button when showFavoriteButton is true', () => {
    render(<PropertyCard {...defaultProps} showFavoriteButton={true} />)
    expect(screen.getByTitle('Add to favorites')).toBeInTheDocument()
  })

  it('does not show favorite button when showFavoriteButton is false', () => {
    render(<PropertyCard {...defaultProps} showFavoriteButton={false} />)
    expect(screen.queryByTitle('Add to favorites')).not.toBeInTheDocument()
  })

  it('does not show favorite button for owned properties', () => {
    render(<PropertyCard {...defaultProps} showFavoriteButton={true} />)
    expect(screen.queryByTitle('Add to favorites')).not.toBeInTheDocument()
  })

  it('shows image count when multiple images are available', () => {
    const propertyWithImages = {
      ...mockProperty,
      images: [
        { id: '1', url: 'image1.jpg', alt: 'Image 1', isPrimary: true, order: 0, uploadedAt: new Date().toISOString() },
        { id: '2', url: 'image2.jpg', alt: 'Image 2', isPrimary: false, order: 1, uploadedAt: new Date().toISOString() },
      ],
    }
    
    render(<PropertyCard {...defaultProps} property={propertyWithImages} />)
    expect(screen.getByText('+1 more')).toBeInTheDocument()
  })

  it('handles missing images gracefully', () => {
    const propertyWithoutImages = { ...mockProperty, imageUrl: undefined, images: undefined }
    render(<PropertyCard {...defaultProps} property={propertyWithoutImages} />)
    
    // Should show house emoji as fallback
    expect(screen.getByText('🏠')).toBeInTheDocument()
  })

  it('formats price correctly', () => {
    render(<PropertyCard {...defaultProps} />)
    expect(screen.getByText('100.50 FLOW')).toBeInTheDocument()
  })

  it('formats square footage with commas', () => {
    const largeProperty = { ...mockProperty, squareFootage: 15000 }
    render(<PropertyCard {...defaultProps} property={largeProperty} />)
    expect(screen.getByText('15,000')).toBeInTheDocument()
  })

  it('truncates long addresses', () => {
    const longAddress = '123 Very Long Street Name That Should Be Truncated, Very Long City Name, Very Long State Name 12345'
    const propertyWithLongAddress = { ...mockProperty, address: longAddress }
    render(<PropertyCard {...defaultProps} property={propertyWithLongAddress} />)
    
    const addressElement = screen.getByText(longAddress)
    expect(addressElement).toHaveClass('truncate')
  })

  it('shows USD conversion', () => {
    render(<PropertyCard {...defaultProps} />)
    expect(screen.getByText('≈ $50.25 USD')).toBeInTheDocument()
  })
})
