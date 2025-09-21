import React from 'react'
import { render, screen, fireEvent, waitFor } from '../utils/testUtils'
import { Marketplace } from '@/components/Marketplace'
import { mockProperties } from '../utils/testUtils'

// Mock the useWallet hook
jest.mock('@/hooks/useWallet', () => ({
  useWallet: () => ({
    provider: {},
    signer: {},
    address: '0x1234567890abcdef',
  }),
}))

// Mock the usePropertyFilters hook
jest.mock('@/components/FilterBar', () => ({
  usePropertyFilters: () => ({
    filters: {
      searchTerm: '',
      priceRange: { min: 0, max: 1000 },
      squareFootageRange: { min: 0, max: 10000 },
      propertyType: 'all',
      location: '',
      sortBy: 'date',
      sortOrder: 'desc',
      availability: 'all',
    },
    updateFilters: jest.fn(),
    clearFilters: jest.fn(),
  }),
  FilterBar: ({ totalResults }: { totalResults: number }) => (
    <div data-testid="filter-bar">
      Filter Bar - {totalResults} results
    </div>
  ),
}))

// Mock the search utilities
jest.mock('@/lib/searchUtils', () => ({
  filterProperties: jest.fn((properties) => 
    properties.map(property => ({ property, score: 1, highlights: {} }))
  ),
  getFilterSummary: jest.fn(() => []),
}))

describe('Marketplace', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders marketplace title and description', () => {
    render(<Marketplace />)
    
    expect(screen.getByText('Property Marketplace')).toBeInTheDocument()
    expect(screen.getByText('Browse and purchase property NFTs')).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    render(<Marketplace />)
    
    expect(screen.getByText('Loading properties...')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders properties after loading', async () => {
    render(<Marketplace />)
    
    await waitFor(() => {
      expect(screen.getByText('Downtown Luxury Condo')).toBeInTheDocument()
      expect(screen.getByText('Suburban Family Home')).toBeInTheDocument()
      expect(screen.getByText('Beachfront Villa')).toBeInTheDocument()
    })
  })

  it('shows filter bar with correct results count', async () => {
    render(<Marketplace />)
    
    await waitFor(() => {
      expect(screen.getByTestId('filter-bar')).toBeInTheDocument()
    })
  })

  it('handles property view action', async () => {
    render(<Marketplace />)
    
    await waitFor(() => {
      const viewButtons = screen.getAllByText('View Details')
      fireEvent.click(viewButtons[0])
    })
    
    // Should open property modal
    await waitFor(() => {
      expect(screen.getByText('Downtown Luxury Condo')).toBeInTheDocument()
    })
  })

  it('handles property buy action', async () => {
    const mockContractService = {
      buyProperty: jest.fn().mockResolvedValue({ transactionHash: '0x123' }),
    }
    
    // Mock the ContractService
    jest.doMock('@/lib/contracts', () => ({
      ContractService: jest.fn(() => mockContractService),
    }))
    
    render(<Marketplace />)
    
    await waitFor(() => {
      const buyButtons = screen.getAllByText('Buy Now')
      fireEvent.click(buyButtons[0])
    })
    
    // Should show buying state
    expect(screen.getByText('Buying...')).toBeInTheDocument()
  })

  it('shows error state when loading fails', () => {
    // Mock console.error to avoid noise in tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    // Mock a component that throws an error
    const ThrowingMarketplace = () => {
      throw new Error('Test error')
    }
    
    render(<ThrowingMarketplace />)
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })

  it('displays properties in grid layout', async () => {
    render(<Marketplace />)
    
    await waitFor(() => {
      const propertyCards = screen.getAllByText(/Property|Condo|Home|Villa/)
      expect(propertyCards.length).toBeGreaterThan(0)
    })
  })

  it('shows no properties message when no properties available', async () => {
    // Mock empty properties array
    jest.doMock('@/lib/searchUtils', () => ({
      filterProperties: jest.fn(() => []),
      getFilterSummary: jest.fn(() => []),
    }))
    
    render(<Marketplace />)
    
    await waitFor(() => {
      expect(screen.getByText('No properties available for sale')).toBeInTheDocument()
    })
  })

  it('handles property modal close', async () => {
    render(<Marketplace />)
    
    await waitFor(() => {
      const viewButtons = screen.getAllByText('View Details')
      fireEvent.click(viewButtons[0])
    })
    
    // Open modal
    await waitFor(() => {
      expect(screen.getByText('Downtown Luxury Condo')).toBeInTheDocument()
    })
    
    // Close modal
    const closeButton = screen.getByText('✕')
    fireEvent.click(closeButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Downtown Luxury Condo')).not.toBeInTheDocument()
    })
  })

  it('shows property prices correctly', async () => {
    render(<Marketplace />)
    
    await waitFor(() => {
      expect(screen.getByText('150.50 FLOW')).toBeInTheDocument()
      expect(screen.getByText('300.75 FLOW')).toBeInTheDocument()
      expect(screen.getByText('500.00 FLOW')).toBeInTheDocument()
    })
  })

  it('shows property addresses correctly', async () => {
    render(<Marketplace />)
    
    await waitFor(() => {
      expect(screen.getByText('123 Main St, Downtown, NY 10001')).toBeInTheDocument()
      expect(screen.getByText('456 Oak Ave, Suburbia, CA 90210')).toBeInTheDocument()
      expect(screen.getByText('789 Ocean Dr, Seaside, FL 33101')).toBeInTheDocument()
    })
  })

  it('shows property square footage correctly', async () => {
    render(<Marketplace />)
    
    await waitFor(() => {
      expect(screen.getByText('1,200')).toBeInTheDocument()
      expect(screen.getByText('2,500')).toBeInTheDocument()
      expect(screen.getByText('3,500')).toBeInTheDocument()
    })
  })

  it('handles wallet not connected error', async () => {
    // Mock wallet not connected
    jest.doMock('@/hooks/useWallet', () => ({
      useWallet: () => ({
        provider: null,
        signer: null,
        address: null,
      }),
    }))
    
    render(<Marketplace />)
    
    await waitFor(() => {
      const buyButtons = screen.getAllByText('Buy Now')
      fireEvent.click(buyButtons[0])
    })
    
    // Should show error
    await waitFor(() => {
      expect(screen.getByText('Wallet not connected')).toBeInTheDocument()
    })
  })
})
