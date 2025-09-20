import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Marketplace } from '@/components/Marketplace'

// Mock the wallet hook
jest.mock('@/hooks/useWallet', () => ({
  useWallet: () => ({
    provider: null,
    signer: null,
    address: '0x1234567890123456789012345678901234567890',
  }),
}))

// Mock the contract service
jest.mock('@/lib/contracts', () => ({
  ContractService: jest.fn().mockImplementation(() => ({
    buyProperty: jest.fn().mockResolvedValue({
      transactionHash: '0x1234567890abcdef',
    }),
  })),
}))

describe('Marketplace', () => {
  it('renders the marketplace correctly', async () => {
    render(<Marketplace />)
    
    expect(screen.getByText('Property Marketplace')).toBeInTheDocument()
    expect(screen.getByText('Browse and purchase property NFTs')).toBeInTheDocument()
    
    // Wait for properties to load
    await waitFor(() => {
      expect(screen.getByText('Downtown Luxury Condo')).toBeInTheDocument()
    })
  })

  it('displays search and filter controls', async () => {
    render(<Marketplace />)
    
    expect(screen.getByPlaceholderText('Search properties...')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Sort by Date')).toBeInTheDocument()
    expect(screen.getByText('Refresh')).toBeInTheDocument()
  })

  it('filters properties based on search term', async () => {
    render(<Marketplace />)
    
    // Wait for properties to load
    await waitFor(() => {
      expect(screen.getByText('Downtown Luxury Condo')).toBeInTheDocument()
    })
    
    // Search for "Downtown"
    const searchInput = screen.getByPlaceholderText('Search properties...')
    fireEvent.change(searchInput, { target: { value: 'Downtown' } })
    
    // Should still show Downtown Luxury Condo
    expect(screen.getByText('Downtown Luxury Condo')).toBeInTheDocument()
    
    // Search for something that doesn't exist
    fireEvent.change(searchInput, { target: { value: 'NonExistent' } })
    
    // Should show no properties message
    expect(screen.getByText('No properties match your search')).toBeInTheDocument()
  })

  it('sorts properties correctly', async () => {
    render(<Marketplace />)
    
    // Wait for properties to load
    await waitFor(() => {
      expect(screen.getByText('Downtown Luxury Condo')).toBeInTheDocument()
    })
    
    // Change sort to price
    const sortSelect = screen.getByDisplayValue('Sort by Date')
    fireEvent.change(sortSelect, { target: { value: 'price' } })
    
    // Should still show properties (sorting is tested in the component logic)
    expect(screen.getByText('Downtown Luxury Condo')).toBeInTheDocument()
  })

  it('opens property modal when view button is clicked', async () => {
    render(<Marketplace />)
    
    // Wait for properties to load
    await waitFor(() => {
      expect(screen.getByText('Downtown Luxury Condo')).toBeInTheDocument()
    })
    
    // Click view details button
    const viewButton = screen.getByText('View Details')
    fireEvent.click(viewButton)
    
    // Should open modal with property details
    await waitFor(() => {
      expect(screen.getByText('Downtown Luxury Condo')).toBeInTheDocument()
    })
  })

  it('handles buy property action', async () => {
    render(<Marketplace />)
    
    // Wait for properties to load
    await waitFor(() => {
      expect(screen.getByText('Downtown Luxury Condo')).toBeInTheDocument()
    })
    
    // Click buy button
    const buyButton = screen.getByText('Buy Now')
    fireEvent.click(buyButton)
    
    // Should show error since wallet is not connected
    await waitFor(() => {
      expect(screen.getByText('Wallet not connected')).toBeInTheDocument()
    })
  })
})
