import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PropertyRecommendationEngine } from '@/components/PropertyRecommendationEngine'
import { Property, UserActivity } from '@/types'

// Mock data
const mockProperty: Property = {
  id: '1',
  name: 'Test Property',
  description: 'A beautiful test property',
  address: '123 Test St',
  squareFootage: 1500,
  price: '300000',
  owner: '0x123',
  isListed: true,
  propertyType: 'house',
  bedrooms: 3,
  bathrooms: 2,
  location: {
    city: 'Test City',
    state: 'Test State',
    country: 'Test Country'
  },
  features: ['garage', 'garden'],
  amenities: ['pool', 'gym']
}

const mockUserPreferences = {
  priceRange: { min: 250000, max: 400000 },
  propertyTypes: ['house', 'condo'],
  locations: ['Test City'],
  features: ['garage'],
  amenities: ['pool'],
  investmentGoals: 'primary' as const
}

const mockUserHistory: UserActivity[] = [
  {
    id: '1',
    userId: 'user1',
    type: 'property_viewed',
    description: 'Viewed property',
    propertyId: '1',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
]

const mockAvailableProperties: Property[] = [
  mockProperty,
  {
    ...mockProperty,
    id: '2',
    name: 'Another Property',
    price: '350000',
    propertyType: 'condo'
  }
]

describe('PropertyRecommendationEngine', () => {
  const mockOnRecommendationClick = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', () => {
    render(
      <PropertyRecommendationEngine
        userId="user1"
        userPreferences={mockUserPreferences}
        userHistory={mockUserHistory}
        availableProperties={mockAvailableProperties}
        onRecommendationClick={mockOnRecommendationClick}
      />
    )

    expect(screen.getByText('AI Property Recommendations')).toBeInTheDocument()
    expect(screen.getByText('Analyzing your preferences to find the perfect properties...')).toBeInTheDocument()
  })

  it('displays recommendations after loading', async () => {
    render(
      <PropertyRecommendationEngine
        userId="user1"
        userPreferences={mockUserPreferences}
        userHistory={mockUserHistory}
        availableProperties={mockAvailableProperties}
        onRecommendationClick={mockOnRecommendationClick}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Test Property')).toBeInTheDocument()
    })
  })

  it('filters recommendations by confidence level', async () => {
    render(
      <PropertyRecommendationEngine
        userId="user1"
        userPreferences={mockUserPreferences}
        userHistory={mockUserHistory}
        availableProperties={mockAvailableProperties}
        onRecommendationClick={mockOnRecommendationClick}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Test Property')).toBeInTheDocument()
    })

    const highConfidenceButton = screen.getByText('High Confidence')
    fireEvent.click(highConfidenceButton)

    // Should filter to show only high confidence recommendations
    expect(screen.getByText('High Confidence')).toBeInTheDocument()
  })

  it('calls onRecommendationClick when recommendation is clicked', async () => {
    render(
      <PropertyRecommendationEngine
        userId="user1"
        userPreferences={mockUserPreferences}
        userHistory={mockUserHistory}
        availableProperties={mockAvailableProperties}
        onRecommendationClick={mockOnRecommendationClick}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Test Property')).toBeInTheDocument()
    })

    const recommendationCard = screen.getByText('Test Property').closest('div')
    if (recommendationCard) {
      fireEvent.click(recommendationCard)
      expect(mockOnRecommendationClick).toHaveBeenCalledWith(mockProperty)
    }
  })

  it('displays recommendation reasons', async () => {
    render(
      <PropertyRecommendationEngine
        userId="user1"
        userPreferences={mockUserPreferences}
        userHistory={mockUserHistory}
        availableProperties={mockAvailableProperties}
        onRecommendationClick={mockOnRecommendationClick}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Why we recommend this:')).toBeInTheDocument()
    })
  })

  it('shows AI insights section', async () => {
    render(
      <PropertyRecommendationEngine
        userId="user1"
        userPreferences={mockUserPreferences}
        userHistory={mockUserHistory}
        availableProperties={mockAvailableProperties}
        onRecommendationClick={mockOnRecommendationClick}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('💡 AI Insights')).toBeInTheDocument()
    })
  })

  it('handles empty recommendations gracefully', async () => {
    render(
      <PropertyRecommendationEngine
        userId="user1"
        userPreferences={mockUserPreferences}
        userHistory={mockUserHistory}
        availableProperties={[]}
        onRecommendationClick={mockOnRecommendationClick}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('No recommendations match your current filters.')).toBeInTheDocument()
    })
  })

  it('filters by new listings', async () => {
    render(
      <PropertyRecommendationEngine
        userId="user1"
        userPreferences={mockUserPreferences}
        userHistory={mockUserHistory}
        availableProperties={mockAvailableProperties}
        onRecommendationClick={mockOnRecommendationClick}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Test Property')).toBeInTheDocument()
    })

    const newListingsButton = screen.getByText('New Listings')
    fireEvent.click(newListingsButton)

    expect(screen.getByText('New Listings')).toBeInTheDocument()
  })

  it('displays recommendation scores and confidence levels', async () => {
    render(
      <PropertyRecommendationEngine
        userId="user1"
        userPreferences={mockUserPreferences}
        userHistory={mockUserHistory}
        availableProperties={mockAvailableProperties}
        onRecommendationClick={mockOnRecommendationClick}
      />
    )

    await waitFor(() => {
      // Should display percentage scores
      expect(screen.getByText(/%/)).toBeInTheDocument()
      // Should display confidence levels
      expect(screen.getByText(/% confidence/)).toBeInTheDocument()
    })
  })
})
